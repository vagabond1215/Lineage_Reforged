import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { proposeKnowledgeEvidenceAcceptance } from "../../tools/content-lint/knowledge-evidence-acceptance.mjs";
import { validateKnowledgeEvidence } from "../../tools/content-lint/knowledge-evidence.mjs";

const ROOT = process.cwd();
const OPERATION_PATH = "knowledge-evidence-acceptance-operation";

async function readText(relativePath) {
  return readFile(path.join(ROOT, relativePath), "utf8");
}

async function readJson(relativePath) {
  const raw = await readText(relativePath);
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

const evidenceSchema = await readJson(
  "packages/schemas/player/knowledge_evidence.schema.json"
);
const snippetsWrapper = await readJson(
  "packages/content/base/player/knowledge_snippets.json"
);
const domainRegistryWrapper = await readJson(
  "packages/content/base/player/knowledge_domain_registry.json"
);
const regionsWrapper = await readJson("packages/content/base/world/regions.json");
const settlementsWrapper = await readJson(
  "packages/content/base/world/settlements.json"
);

const SNIPPET_IDS = {
  aloe: "knowledge_snippet.flora.aloe.identification",
  badger: "knowledge_snippet.fauna.badger.identification",
  ironOre: "knowledge_snippet.minerals.iron_ore.identification",
  kaelvar: "knowledge_snippet.general_lore.kaelvar.cultural_context"
};

const ID_TOKENS = {
  aloe: "aloe",
  badger: "badger",
  ironOre: "iron_ore",
  kaelvar: "kaelvar"
};

const EXPECTED_SAFETY = {
  noMutation: true,
  noPersistence: true,
  noProgressInitialization: true,
  noProgressProposal: true,
  noProgressApplication: true,
  noCompletion: true,
  noTrialUnlock: true,
  noUiOutput: true,
  noRuntimeEffect: true,
  noGeneratedOutput: true
};

function snippetFor(snippetKey, wrapper = snippetsWrapper) {
  return wrapper.records.find((record) => record.id === SNIPPET_IDS[snippetKey]);
}

function evidenceFor(snippetKey = "aloe", suffix = "entry_001", overrides = {}) {
  const snippet = snippetFor(snippetKey);
  const isTravel = snippetKey === "kaelvar";

  return {
    evidenceId: `knowledge_evidence.${ID_TOKENS[snippetKey]}.acceptance.${suffix}`,
    snippetId: snippet.id,
    domainId: snippet.domainId,
    subjectType: snippet.subjectType,
    subjectId: snippet.subjectId,
    sourceType: isTravel ? "travel_observation" : "field_identification",
    sourceId: null,
    ownerScope: "character",
    ownerId: "character.test_subject",
    acquiredSequence: 7,
    acquisitionContext: isTravel
      ? {
          contextType: "travel_observation",
          continentId: "region.kaelvar"
        }
      : {
          contextType: "field_observation"
        },
    notes: ["Focused in-memory acceptance candidate."],
    ...overrides
  };
}

function makeInput(candidateEvidence = evidenceFor(), overrides = {}) {
  return {
    relativePath: OPERATION_PATH,
    candidateEvidence: structuredClone(candidateEvidence),
    currentAcceptedEvidenceWrapper: {
      records: []
    },
    evidenceSchema: structuredClone(evidenceSchema),
    snippetsWrapper: structuredClone(snippetsWrapper),
    domainRegistryWrapper: structuredClone(domainRegistryWrapper),
    regionsWrapper: structuredClone(regionsWrapper),
    settlementsWrapper: structuredClone(settlementsWrapper),
    ...overrides
  };
}

function propose(input = makeInput()) {
  return proposeKnowledgeEvidenceAcceptance(input);
}

function assertAccepted(result, candidate) {
  assert.equal(result.decision, "accepted");
  assert.deepEqual(result.acceptedEvidenceRecord, candidate);
  assert.notEqual(result.acceptedEvidenceRecord, candidate);
  assert.equal(result.rejectedCandidate, null);
  assert.deepEqual(result.acceptedEvidenceIds, [candidate.evidenceId]);
  assert.deepEqual(result.issues, []);
  assert.deepEqual(result.safety, EXPECTED_SAFETY);
}

function assertRejected(result) {
  assert.equal(result.decision, "rejected");
  assert.equal(result.acceptedEvidenceRecord, null);
  assert.deepEqual(result.acceptedEvidenceIds, []);
  assert.deepEqual(result.safety, EXPECTED_SAFETY);
}

function validateAccepted(result, input) {
  return validateKnowledgeEvidence({
    relativePath: `${OPERATION_PATH} accepted output`,
    wrapper: {
      records: [structuredClone(result.acceptedEvidenceRecord)]
    },
    evidenceSchema: structuredClone(input.evidenceSchema),
    snippetsWrapper: structuredClone(input.snippetsWrapper),
    domainRegistryWrapper: structuredClone(input.domainRegistryWrapper),
    regionsWrapper: structuredClone(input.regionsWrapper),
    settlementsWrapper: structuredClone(input.settlementsWrapper)
  });
}

for (const snippetKey of ["aloe", "badger", "ironOre", "kaelvar"]) {
  test(`accepts valid ${snippetKey} evidence against an explicit empty wrapper`, () => {
    const candidate = evidenceFor(snippetKey);
    const input = makeInput(candidate);
    const result = propose(input);

    assertAccepted(result, candidate);
    assert.equal(validateAccepted(result, input), true);
  });
}

test("accepts a candidate when current accepted evidence contains a distinct record", () => {
  const candidate = evidenceFor("aloe", "entry_002");
  const existing = evidenceFor("badger", "entry_001");
  const input = makeInput(candidate, {
    currentAcceptedEvidenceWrapper: {
      records: [structuredClone(existing)]
    }
  });
  const result = propose(input);

  assertAccepted(result, candidate);
  assert.deepEqual(result.acceptedEvidenceIds, [candidate.evidenceId]);
  assert.deepEqual(input.currentAcceptedEvidenceWrapper.records, [existing]);
});

test("returns a deep copied accepted record without mutating any input", () => {
  const input = makeInput(evidenceFor("kaelvar"));
  const before = structuredClone(input);
  const result = propose(input);

  assertAccepted(result, before.candidateEvidence);
  assert.notEqual(
    result.acceptedEvidenceRecord.acquisitionContext,
    input.candidateEvidence.acquisitionContext
  );
  assert.notEqual(result.acceptedEvidenceRecord.notes, input.candidateEvidence.notes);
  assert.deepEqual(input, before);

  result.acceptedEvidenceRecord.acquisitionContext.continentId = "region.changed";
  result.acceptedEvidenceRecord.notes.push("Changed returned copy.");
  assert.deepEqual(input, before);
});

test("returns deterministic output for repeated equivalent invocations", () => {
  const input = makeInput(evidenceFor("ironOre"));

  assert.deepEqual(propose(input), propose(structuredClone(input)));
});

test("returns the complete deterministic decision envelope", () => {
  const result = propose();

  assert.deepEqual(Object.keys(result), [
    "decision",
    "acceptedEvidenceRecord",
    "rejectedCandidate",
    "acceptedEvidenceIds",
    "issues",
    "safety"
  ]);
  assert.deepEqual(result.safety, EXPECTED_SAFETY);
});

test("rejects a candidate evidenceId already present in current accepted evidence", () => {
  const candidate = evidenceFor("aloe");
  const result = propose(
    makeInput(candidate, {
      currentAcceptedEvidenceWrapper: {
        records: [structuredClone(candidate)]
      }
    })
  );

  assertRejected(result);
  assert.deepEqual(result.issues, []);
  assert.deepEqual(result.rejectedCandidate, {
    evidenceId: candidate.evidenceId,
    code: "duplicate_evidence_id",
    reason: `evidenceId '${candidate.evidenceId}' is already present in current accepted evidence`
  });
});

test("rejects an exact duplicate id with identical fields", () => {
  const candidate = evidenceFor("badger");
  const input = makeInput(candidate, {
    currentAcceptedEvidenceWrapper: {
      records: [structuredClone(candidate)]
    }
  });

  assert.equal(propose(input).rejectedCandidate.code, "duplicate_evidence_id");
});

test("rejects a duplicate id with conflicting fields", () => {
  const candidate = evidenceFor("ironOre");
  const existing = evidenceFor("ironOre", "entry_001", {
    acquiredSequence: 2,
    notes: ["Existing accepted record with different values."]
  });
  const input = makeInput(candidate, {
    currentAcceptedEvidenceWrapper: {
      records: [existing]
    }
  });
  const result = propose(input);

  assertRejected(result);
  assert.equal(result.rejectedCandidate.code, "duplicate_evidence_id");
  assert.deepEqual(result.issues, []);
});

test("rejects duplicate evidence ids already inside current accepted evidence", () => {
  const existing = evidenceFor("aloe");
  const input = makeInput(evidenceFor("badger"), {
    currentAcceptedEvidenceWrapper: {
      records: [structuredClone(existing), structuredClone(existing)]
    }
  });
  const result = propose(input);

  assertRejected(result);
  assert.equal(result.rejectedCandidate, null);
  assert.equal(result.issues[0].code, "invalid_current_accepted_evidence");
  assert.match(result.issues[0].message, /evidenceId.*is duplicated/);
});

test("keeps distinct ids eligible despite similar occurrence context and sequence", () => {
  const existing = evidenceFor("aloe", "entry_001");
  const candidate = evidenceFor("aloe", "entry_002", {
    acquiredSequence: existing.acquiredSequence,
    acquisitionContext: structuredClone(existing.acquisitionContext)
  });
  const result = propose(
    makeInput(candidate, {
      currentAcceptedEvidenceWrapper: {
        records: [existing]
      }
    })
  );

  assertAccepted(result, candidate);
});

test("rejects a missing candidate and a candidate wrapper", () => {
  const missing = makeInput();
  delete missing.candidateEvidence;
  const missingResult = propose(missing);

  assertRejected(missingResult);
  assert.equal(missingResult.issues[0].code, "missing_candidate_evidence");

  const wrappedCandidate = makeInput({
    records: [evidenceFor("aloe")]
  });
  const wrappedResult = propose(wrappedCandidate);

  assertRejected(wrappedResult);
  assert.equal(wrappedResult.issues[0].code, "invalid_candidate_evidence");
  assert.match(wrappedResult.issues[0].message, /one plain evidence record/);
});

test("rejects structurally invalid candidate evidence", () => {
  const candidate = evidenceFor("aloe");
  delete candidate.notes;
  const result = propose(makeInput(candidate));

  assertRejected(result);
  assert.equal(result.issues[0].code, "invalid_candidate_evidence");
  assert.match(result.issues[0].message, /structural validation failed.*notes/);
});

test("rejects semantically invalid candidate evidence", () => {
  const candidate = evidenceFor("aloe", "entry_001", {
    sourceType: "combat_observation"
  });
  const result = propose(makeInput(candidate));

  assertRejected(result);
  assert.equal(result.issues[0].code, "invalid_candidate_evidence");
  assert.match(result.issues[0].message, /sourceType.*not declared by snippet/);
});

test("rejects missing, null, bare-array, and malformed current wrappers", () => {
  const cases = [
    {
      name: "missing",
      mutate(input) {
        delete input.currentAcceptedEvidenceWrapper;
      },
      code: "missing_current_accepted_evidence"
    },
    {
      name: "null",
      mutate(input) {
        input.currentAcceptedEvidenceWrapper = null;
      },
      code: "invalid_current_accepted_evidence"
    },
    {
      name: "bare array",
      mutate(input) {
        input.currentAcceptedEvidenceWrapper = [];
      },
      code: "invalid_current_accepted_evidence"
    },
    {
      name: "malformed",
      mutate(input) {
        input.currentAcceptedEvidenceWrapper.version = 1;
      },
      code: "invalid_current_accepted_evidence"
    }
  ];

  for (const currentCase of cases) {
    const input = makeInput();
    currentCase.mutate(input);
    const result = propose(input);

    assertRejected(result);
    assert.equal(result.issues[0].code, currentCase.code, currentCase.name);
  }
});

test("rejects an invalid current accepted record without repairing it", () => {
  const invalidCurrent = evidenceFor("badger");
  delete invalidCurrent.notes;
  const input = makeInput(evidenceFor("aloe"), {
    currentAcceptedEvidenceWrapper: {
      records: [invalidCurrent]
    }
  });
  const before = structuredClone(input);
  const result = propose(input);

  assertRejected(result);
  assert.equal(result.issues[0].code, "invalid_current_accepted_evidence");
  assert.match(result.issues[0].message, /structural validation failed.*notes/);
  assert.deepEqual(input, before);
});

test("rejects an unknown snippet", () => {
  const candidate = evidenceFor("aloe", "entry_001", {
    snippetId: "knowledge_snippet.flora.missing.identification"
  });
  const result = propose(makeInput(candidate));

  assert.equal(result.issues[0].code, "invalid_candidate_evidence");
  assert.match(result.issues[0].message, /snippetId.*is unresolved/);
});

test("rejects planned Arcane Lore evidence through the current validator", () => {
  const arcaneSnippet = {
    id: "knowledge_snippet.arcane_lore.spark.identification",
    domainId: "knowledge_domain.arcane_lore",
    subjectType: "spell",
    subjectId: "spell.spark",
    discoverySources: [
      {
        sourceType: "book_study",
        sourceId: null
      }
    ]
  };
  const arcaneCandidate = {
    evidenceId: "knowledge_evidence.arcane_lore.spark.entry_001",
    snippetId: arcaneSnippet.id,
    domainId: arcaneSnippet.domainId,
    subjectType: arcaneSnippet.subjectType,
    subjectId: arcaneSnippet.subjectId,
    sourceType: "book_study",
    sourceId: null,
    ownerScope: "character",
    ownerId: "character.test_subject",
    acquiredSequence: 7,
    acquisitionContext: {
      contextType: "study"
    },
    notes: ["Synthetic planned-domain acceptance candidate."]
  };
  const input = makeInput(arcaneCandidate);
  input.snippetsWrapper.records.push(arcaneSnippet);
  const result = propose(input);

  assert.equal(result.issues[0].code, "invalid_candidate_evidence");
  assert.match(result.issues[0].message, /arcane_lore.*status 'active'.*"planned"/);
});

test("rejects invalid source and acquisition context compatibility", () => {
  const candidate = evidenceFor("aloe");
  candidate.acquisitionContext = {
    contextType: "study"
  };
  const result = propose(makeInput(candidate));

  assert.equal(result.issues[0].code, "invalid_candidate_evidence");
  assert.match(result.issues[0].message, /contextType.*must be "field_observation"/);
});

test("rejects non-character owner, invalid ownerId, invalid sequence, and sourceId", () => {
  const cases = [
    {
      field: "ownerScope",
      value: "family",
      expected: /ownerScope.*schema enum/
    },
    {
      field: "ownerId",
      value: "invalid",
      expected: /ownerId.*must match pattern/
    },
    {
      field: "acquiredSequence",
      value: -1,
      expected: /acquiredSequence.*at least 0/
    },
    {
      field: "sourceId",
      value: "source.aloe",
      expected: /sourceId.*must remain null/
    }
  ];

  for (const invalidCase of cases) {
    const candidate = evidenceFor("aloe", "entry_001", {
      [invalidCase.field]: invalidCase.value
    });
    const result = propose(makeInput(candidate));

    assertRejected(result);
    assert.equal(result.issues[0].code, "invalid_candidate_evidence");
    assert.match(result.issues[0].message, invalidCase.expected);
  }
});

test("rejects passive and cross-system authority shortcuts as unsupported inputs", () => {
  const attemptedFields = [
    "passiveLocation",
    "inventory",
    "skillState",
    "spellState",
    "accountState",
    "familyState",
    "institutionState",
    "saveState",
    "sessionState",
    "runtimeState",
    "uiState",
    "completion",
    "trialState",
    "generatedOutput"
  ];

  for (const field of attemptedFields) {
    const input = makeInput();
    input[field] = {};
    const before = structuredClone(input);
    const result = propose(input);

    assertRejected(result);
    assert.equal(result.issues[0].code, "unsupported_input_fields");
    assert.deepEqual(input, before);
  }
});

test("output contains no completion, trial, UI, runtime, generated, or gameplay fields", () => {
  const result = propose();

  for (const field of [
    "currentAcceptedEvidenceWrapper",
    "replacementAcceptedEvidenceWrapper",
    "progressRecord",
    "proposedProgressRecord",
    "appliedProgress",
    "completion",
    "trialUnlocks",
    "events",
    "rewards",
    "ui",
    "runtime",
    "generatedOutput",
    "gameplay"
  ]) {
    assert.equal(field in result, false);
  }
});

test("helper source has no filesystem, clock, randomness, producer, progress, or runtime coupling", async () => {
  const source = await readText(
    "tools/content-lint/knowledge-evidence-acceptance.mjs"
  );

  assert.doesNotMatch(source, /node:fs|readFile|writeFile|readdir/);
  assert.doesNotMatch(source, /Date\.now|new Date|Math\.random|performance\.now/);
  assert.doesNotMatch(
    source,
    /knowledge-evidence-producers|proposeKnowledgeObservationEvidence/
  );
  assert.doesNotMatch(
    source,
    /knowledge-progress-initialization|proposeKnowledgeProgressInitialization/
  );
  assert.doesNotMatch(
    source,
    /knowledge-evidence-to-progress|proposeKnowledgeProgressFromEvidence/
  );
  assert.doesNotMatch(
    source,
    /apps\/rpg-ui|packages\/engines|dispatchEvent|eventEmitter|tests\/fixtures\/knowledge/
  );
});

test("normal content lint does not register the acceptance helper", async () => {
  const source = await readText("tools/content-lint/index.mjs");

  assert.doesNotMatch(source, /knowledge-evidence-acceptance/);
  assert.doesNotMatch(source, /proposeKnowledgeEvidenceAcceptance/);
});

test("focused tests require no knowledge fixture directory", async () => {
  await assert.rejects(
    access(path.join(ROOT, "tests", "fixtures", "knowledge"))
  );
});
