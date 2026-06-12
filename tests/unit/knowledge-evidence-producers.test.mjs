import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { proposeKnowledgeObservationEvidence } from "../../tools/content-lint/knowledge-evidence-producers.mjs";
import { validateKnowledgeEvidence } from "../../tools/content-lint/knowledge-evidence.mjs";

const ROOT = process.cwd();
const OPERATION_PATH = "tests/fixtures/in-memory/knowledge-observation-evidence";

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

const EXPECTED_EVIDENCE_FIELDS = [
  "evidenceId",
  "snippetId",
  "domainId",
  "subjectType",
  "subjectId",
  "ownerScope",
  "ownerId",
  "sourceType",
  "sourceId",
  "acquisitionContext",
  "acquiredSequence",
  "notes"
];

function makeInput(snippetKey = "aloe", overrides = {}) {
  const isTravel = snippetKey === "kaelvar";
  const occurrenceKind = isTravel ? "travel_observation" : "field_observation";
  const acquisitionContext = isTravel
    ? {
        contextType: "travel_observation",
        continentId: "region.kaelvar"
      }
    : {
        contextType: "field_observation"
      };

  return {
    relativePath: OPERATION_PATH,
    ownerId: "character.test_subject",
    snippetId: SNIPPET_IDS[snippetKey],
    occurrenceId: `knowledge_occurrence.${occurrenceKind}.${snippetKey.toLowerCase()}_001`,
    acquisitionContext,
    acquiredSequence: 7,
    snippetsWrapper: structuredClone(snippetsWrapper),
    domainRegistryWrapper: structuredClone(domainRegistryWrapper),
    evidenceSchema: structuredClone(evidenceSchema),
    evidenceAuthorities: {
      regionsWrapper: structuredClone(regionsWrapper),
      settlementsWrapper: structuredClone(settlementsWrapper)
    },
    ...overrides
  };
}

function propose(input = makeInput()) {
  return proposeKnowledgeObservationEvidence(input);
}

function assertCandidate(result) {
  assert.deepEqual(result.issues, []);
  assert.notEqual(result.candidateEvidence, null);
  assert.deepEqual(Object.keys(result.candidateEvidence), EXPECTED_EVIDENCE_FIELDS);
  assert.deepEqual(result.safety, {
    candidateOnly: true,
    noMutation: true,
    noPersistence: true,
    noProgressMutation: true,
    noProgressProposal: true,
    noCompletion: true,
    noTrialUnlock: true,
    noEvents: true,
    noUiOutput: true,
    noGeneratedOutput: true
  });
}

function validateCandidate(result, input) {
  return validateKnowledgeEvidence({
    relativePath: `${OPERATION_PATH} external-validation`,
    wrapper: {
      records: [structuredClone(result.candidateEvidence)]
    },
    evidenceSchema: structuredClone(input.evidenceSchema),
    snippetsWrapper: structuredClone(input.snippetsWrapper),
    domainRegistryWrapper: structuredClone(input.domainRegistryWrapper),
    regionsWrapper: structuredClone(input.evidenceAuthorities.regionsWrapper),
    settlementsWrapper: structuredClone(input.evidenceAuthorities.settlementsWrapper)
  });
}

const POSITIVE_CASES = [
  {
    key: "aloe",
    evidenceId:
      "knowledge_evidence.flora.aloe.identification_field_observation_aloe_001",
    sourceType: "field_identification"
  },
  {
    key: "badger",
    evidenceId:
      "knowledge_evidence.fauna.badger.identification_field_observation_badger_001",
    sourceType: "field_identification"
  },
  {
    key: "ironOre",
    evidenceId:
      "knowledge_evidence.minerals.iron_ore.identification_field_observation_ironore_001",
    sourceType: "field_identification"
  },
  {
    key: "kaelvar",
    evidenceId:
      "knowledge_evidence.general_lore.kaelvar.cultural_context_travel_observation_kaelvar_001",
    sourceType: "travel_observation"
  }
];

for (const positiveCase of POSITIVE_CASES) {
  test(`proposes deterministic ${positiveCase.key} observation candidate`, () => {
    const input = makeInput(positiveCase.key);
    const result = propose(input);

    assertCandidate(result);
    assert.equal(result.candidateEvidence.evidenceId, positiveCase.evidenceId);
    assert.equal(result.candidateEvidence.sourceType, positiveCase.sourceType);
    assert.equal(result.candidateEvidence.sourceId, null);
    assert.equal(validateCandidate(result, input), true);
    assert.deepEqual(result, propose(structuredClone(input)));
  });
}

test("replay of the same occurrence yields the same evidenceId", () => {
  const input = makeInput("aloe");

  assert.equal(
    propose(input).candidateEvidence.evidenceId,
    propose(structuredClone(input)).candidateEvidence.evidenceId
  );
});

test("distinct occurrenceId values yield distinct evidenceId values", () => {
  const first = makeInput("aloe");
  const second = makeInput("aloe", {
    occurrenceId: "knowledge_occurrence.field_observation.aloe_002"
  });

  assert.notEqual(
    propose(first).candidateEvidence.evidenceId,
    propose(second).candidateEvidence.evidenceId
  );
});

test("explicit owner and acquiredSequence are preserved", () => {
  const input = makeInput("badger", {
    ownerId: "character.observer_17",
    acquiredSequence: 42
  });
  const result = propose(input);

  assertCandidate(result);
  assert.equal(result.candidateEvidence.ownerScope, "character");
  assert.equal(result.candidateEvidence.ownerId, "character.observer_17");
  assert.equal(result.candidateEvidence.acquiredSequence, 42);
});

test("candidate snapshots come only from the referenced snippet", () => {
  const result = propose(makeInput("ironOre"));

  assertCandidate(result);
  assert.equal(result.candidateEvidence.snippetId, SNIPPET_IDS.ironOre);
  assert.equal(result.candidateEvidence.domainId, "knowledge_domain.minerals");
  assert.equal(result.candidateEvidence.subjectType, "mineral");
  assert.equal(result.candidateEvidence.subjectId, "mineral.iron_ore");
});

test("candidate contains exactly the current evidence fields", () => {
  const result = propose();

  assertCandidate(result);
  assert.equal("occurrenceId" in result.candidateEvidence, false);
  assert.equal("progressSources" in result.candidateEvidence, false);
  assert.equal("appliedDeltas" in result.candidateEvidence, false);
  assert.equal("events" in result.candidateEvidence, false);
  assert.equal("ui" in result.candidateEvidence, false);
});

test("helper does not mutate any input", () => {
  const input = makeInput("kaelvar");
  const before = structuredClone(input);
  const result = propose(input);

  assertCandidate(result);
  assert.deepEqual(input, before);
  result.candidateEvidence.acquisitionContext.continentId = "region.changed";
  assert.deepEqual(input, before);
});

test("rejects Arcane production while its domain remains planned", () => {
  const input = makeInput();
  const arcaneSnippet = {
    id: "knowledge_snippet.arcane_lore.spark.identification",
    domainId: "knowledge_domain.arcane_lore",
    subjectType: "spell",
    subjectId: "spell.spark",
    discoverySources: [
      {
        sourceType: "field_identification",
        sourceId: null
      }
    ]
  };
  input.snippetsWrapper.records.push(arcaneSnippet);
  input.snippetId = arcaneSnippet.id;
  input.occurrenceId =
    "knowledge_occurrence.field_observation.arcane_spark_001";

  const result = propose(input);

  assert.equal(result.candidateEvidence, null);
  assert.equal(result.issues[0].code, "inactive_domain");
  assert.match(result.issues[0].message, /arcane_lore.*active.*planned/);
});

test("rejects unsupported snippetId", () => {
  const result = propose(
    makeInput("aloe", {
      snippetId: "knowledge_snippet.flora.missing.identification"
    })
  );

  assert.equal(result.issues[0].code, "snippet_not_found");
});

test("rejects unresolved domain", () => {
  const input = makeInput();
  input.snippetsWrapper.records[0].domainId = "knowledge_domain.missing";

  const result = propose(input);

  assert.equal(result.issues[0].code, "domain_not_found");
});

test("rejects duplicate snippet ids in supplied authority", () => {
  const input = makeInput();
  input.snippetsWrapper.records.push(
    structuredClone(input.snippetsWrapper.records[0])
  );

  const result = propose(input);

  assert.equal(result.issues[0].code, "duplicate_snippet_id");
});

test("rejects duplicate domain ids in supplied authority", () => {
  const input = makeInput();
  input.domainRegistryWrapper.records.push(
    structuredClone(input.domainRegistryWrapper.records[0])
  );

  const result = propose(input);

  assert.equal(result.issues[0].code, "duplicate_domain_id");
});

test("rejects caller domain and subject override attempts", () => {
  for (const field of ["domainId", "subjectType", "subjectId"]) {
    const input = makeInput();
    input[field] = "caller.override";
    const result = propose(input);

    assert.equal(result.issues[0].code, "unsupported_input_fields");
    assert.match(result.issues[0].message, new RegExp(field));
  }
});

test("rejects unsupported source and acquisition context combinations", () => {
  const aloeStudy = makeInput("aloe", {
    occurrenceId: "knowledge_occurrence.field_observation.aloe_study_001",
    acquisitionContext: {
      contextType: "study"
    }
  });
  const kaelvarField = makeInput("kaelvar", {
    occurrenceId: "knowledge_occurrence.field_observation.kaelvar_001",
    acquisitionContext: {
      contextType: "field_observation"
    }
  });

  assert.equal(propose(aloeStudy).issues[0].code, "occurrence_context_mismatch");
  assert.equal(propose(kaelvarField).issues[0].code, "unsupported_source_context");
});

test("requires Kaelvar's authored continent scope", () => {
  const input = makeInput("kaelvar", {
    acquisitionContext: {
      contextType: "travel_observation"
    }
  });
  const result = propose(input);

  assert.equal(result.issues[0].code, "source_location_mismatch");
  assert.match(result.issues[0].message, /continentId.*region\.kaelvar/);
});

test("rejects non-null sourceId attempts", () => {
  const result = propose(makeInput("aloe", { sourceId: "source.attempt" }));

  assert.equal(result.issues[0].code, "invalid_source_id");
});

test("rejects missing and invalid ownerId", () => {
  const missing = makeInput();
  delete missing.ownerId;

  assert.equal(propose(missing).issues[0].code, "invalid_owner_id");
  assert.equal(
    propose(makeInput("aloe", { ownerId: "invalid" })).issues[0].code,
    "invalid_owner_id"
  );
});

test("rejects account, family, and non-character owner attempts", () => {
  for (const ownerScope of ["account", "family", "party"]) {
    const result = propose(makeInput("aloe", { ownerScope }));
    assert.equal(result.issues[0].code, "invalid_owner_scope");
  }
});

test("rejects missing and invalid occurrenceId", () => {
  const missing = makeInput();
  delete missing.occurrenceId;

  assert.equal(propose(missing).issues[0].code, "invalid_occurrence_id");
  for (const occurrenceId of [
    "",
    "random.uuid_001",
    "timestamp.1781279104",
    "ui.click_001",
    "implicit.counter_1"
  ]) {
    assert.equal(
      propose(makeInput("aloe", { occurrenceId })).issues[0].code,
      "invalid_occurrence_id"
    );
  }
});

test("rejects occurrence kind that does not match acquisition context", () => {
  const result = propose(
    makeInput("aloe", {
      occurrenceId: "knowledge_occurrence.travel_observation.aloe_001"
    })
  );

  assert.equal(result.issues[0].code, "occurrence_context_mismatch");
});

test("rejects missing, negative, and non-integer acquiredSequence", () => {
  const missing = makeInput();
  delete missing.acquiredSequence;

  assert.equal(propose(missing).issues[0].code, "invalid_acquired_sequence");
  assert.equal(
    propose(makeInput("aloe", { acquiredSequence: -1 })).issues[0].code,
    "invalid_acquired_sequence"
  );
  assert.equal(
    propose(makeInput("aloe", { acquiredSequence: 1.5 })).issues[0].code,
    "invalid_acquired_sequence"
  );
});

test("rejects passive, unrelated state, mutation, and output-field attempts", () => {
  const attemptedFields = [
    "passiveMapPresence",
    "ambientLocation",
    "inventory",
    "knownSpellIds",
    "skillRanks",
    "chronicleState",
    "renownState",
    "accountState",
    "familyState",
    "uiState",
    "questState",
    "progressRecord",
    "persist",
    "events",
    "generatedOutput",
    "outputFields"
  ];

  for (const field of attemptedFields) {
    const input = makeInput();
    input[field] = {};
    const before = structuredClone(input);
    const result = propose(input);

    assert.equal(result.issues[0].code, "unsupported_input_fields");
    assert.equal(result.candidateEvidence, null);
    assert.deepEqual(input, before);
  }
});

test("invalid candidate context is rejected through the current validator", () => {
  const input = makeInput("aloe");
  input.acquisitionContext.eventId = "event.unresolved";
  const result = propose(input);

  assert.equal(result.issues[0].code, "invalid_candidate");
  assert.match(result.issues[0].message, /eventId.*must remain null or absent/);
});

test("result envelope is candidate-only and contains no behavior output", () => {
  const result = propose();

  assert.deepEqual(Object.keys(result), [
    "candidateEvidence",
    "issues",
    "safety"
  ]);
  for (const field of [
    "acceptedEvidence",
    "progressRecord",
    "proposedProgressRecord",
    "appliedDeltas",
    "events",
    "trialUnlocks",
    "completionTransitions",
    "rewards",
    "ui",
    "generatedOutput"
  ]) {
    assert.equal(field in result, false);
  }
});

test("helper source has no filesystem, clock, randomness, runtime, UI, event, or progress coupling", async () => {
  const source = await readText(
    "tools/content-lint/knowledge-evidence-producers.mjs"
  );

  assert.doesNotMatch(source, /node:fs|readFile|writeFile|readdir/);
  assert.doesNotMatch(source, /Date\.now|new Date|Math\.random|performance\.now/);
  assert.doesNotMatch(source, /apps\/rpg-ui|packages\/engines|dispatchEvent|eventEmitter/);
  assert.doesNotMatch(
    source,
    /knowledge-evidence-to-progress|proposeKnowledgeProgressFromEvidence|validateKnowledgeProgress/
  );
});

test("normal content lint does not register producer, progress, or evidence-to-progress helpers", async () => {
  const source = await readText("tools/content-lint/index.mjs");

  assert.doesNotMatch(source, /from "\.\/knowledge-evidence-producers\.mjs"/);
  assert.doesNotMatch(source, /from "\.\/knowledge-evidence-to-progress\.mjs"/);
  assert.doesNotMatch(source, /from "\.\/knowledge-progress\.mjs"/);
  assert.doesNotMatch(source, /proposeKnowledgeObservationEvidence/);
  assert.doesNotMatch(source, /proposeKnowledgeProgressFromEvidence/);
  assert.doesNotMatch(source, /validateKnowledgeProgress/);
});
