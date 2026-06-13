import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { proposeKnowledgeProgressApplication } from "../../tools/content-lint/knowledge-progress-application.mjs";
import { validateKnowledgeProgress } from "../../tools/content-lint/knowledge-progress.mjs";

const ROOT = process.cwd();
const OPERATION_PATH = "tests/fixtures/in-memory/knowledge-progress-application";

async function readText(relativePath) {
  return readFile(path.join(ROOT, relativePath), "utf8");
}

async function readJson(relativePath) {
  const raw = await readText(relativePath);
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

const progressSchema = await readJson(
  "packages/schemas/player/knowledge_progress.schema.json"
);
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

const PROPOSAL_SAFETY = {
  noMutation: true,
  noPersistence: true,
  noCompletion: true,
  noTrialUnlock: true,
  noUiOutput: true
};

const APPLICATION_SAFETY = {
  noMutation: true,
  noPersistence: true,
  noEvidenceAcceptance: true,
  noProgressInitialization: true,
  noCompletion: true,
  noTrialUnlock: true,
  noUiOutput: true,
  noRuntimeEffect: true,
  noGeneratedOutput: true
};

const TARGET_FIELDS = [
  "progressId",
  "ownerScope",
  "ownerId",
  "snippetId",
  "domainId",
  "subjectType",
  "subjectId"
];

function snippetFor(snippetKey, wrapper = snippetsWrapper) {
  return wrapper.records.find((record) => record.id === SNIPPET_IDS[snippetKey]);
}

function evidenceFor(
  snippetKey = "aloe",
  sequence = 7,
  suffix = "entry_001",
  overrides = {}
) {
  const snippet = snippetFor(snippetKey);
  const isTravel = snippetKey === "kaelvar";

  return {
    evidenceId: `knowledge_evidence.${ID_TOKENS[snippetKey]}.application.${suffix}`,
    snippetId: snippet.id,
    domainId: snippet.domainId,
    subjectType: snippet.subjectType,
    subjectId: snippet.subjectId,
    sourceType: isTravel ? "travel_observation" : "field_identification",
    sourceId: null,
    ownerScope: "character",
    ownerId: "character.test_subject",
    acquiredSequence: sequence,
    acquisitionContext: isTravel
      ? {
          contextType: "travel_observation",
          continentId: "region.kaelvar"
        }
      : {
          contextType: "field_observation"
        },
    notes: ["Focused in-memory accepted evidence."],
    ...overrides
  };
}

function progressFor(snippetKey = "aloe", overrides = {}) {
  const snippet = snippetFor(snippetKey);

  return {
    progressId: `knowledge_progress.${ID_TOKENS[snippetKey]}.application.entry_001`,
    snippetId: snippet.id,
    domainId: snippet.domainId,
    subjectType: snippet.subjectType,
    subjectId: snippet.subjectId,
    ownerScope: "character",
    ownerId: "character.test_subject",
    progressValue: 0,
    consumedEvidenceIds: [],
    updatedSequence: 0,
    notes: ["Focused in-memory progress application target."],
    ...overrides
  };
}

function proposalFor(targetProgress, evidenceRecords, overrides = {}) {
  const acceptedEvidenceIds = evidenceRecords
    .map((record) => record.evidenceId)
    .sort();
  const maximumSequence = Math.max(
    targetProgress.updatedSequence,
    ...evidenceRecords.map((record) => record.acquiredSequence)
  );

  return {
    acceptedEvidenceIds,
    rejectedEvidence: [],
    proposedProgressRecord: {
      ...structuredClone(targetProgress),
      progressValue: targetProgress.progressValue + acceptedEvidenceIds.length,
      consumedEvidenceIds: [
        ...targetProgress.consumedEvidenceIds,
        ...acceptedEvidenceIds
      ],
      updatedSequence: maximumSequence + 1
    },
    deltaTotal: acceptedEvidenceIds.length,
    appliedDeltas: acceptedEvidenceIds.map((evidenceId) => ({
      evidenceId,
      targetProgressId: targetProgress.progressId,
      delta: 1
    })),
    issues: [],
    safety: structuredClone(PROPOSAL_SAFETY),
    ...overrides
  };
}

function makeInput({
  snippetKey = "aloe",
  targetProgress = progressFor(snippetKey),
  progressRecords,
  acceptedEvidenceRecords,
  proposalEvidenceRecords,
  proposal,
  targetProgressId,
  snippetsValue = snippetsWrapper,
  domainsValue = domainRegistryWrapper
} = {}) {
  const defaultEvidence = evidenceFor(snippetKey);
  const acceptedRecords = acceptedEvidenceRecords ?? [defaultEvidence];
  const proposalRecords = proposalEvidenceRecords ?? [defaultEvidence];
  const currentRecords = progressRecords ?? [targetProgress];

  return {
    relativePath: OPERATION_PATH,
    targetProgressId: targetProgressId ?? targetProgress.progressId,
    currentProgressWrapper: {
      records: structuredClone(currentRecords)
    },
    currentAcceptedEvidenceWrapper: {
      records: structuredClone(acceptedRecords)
    },
    proposal: structuredClone(
      proposal ?? proposalFor(targetProgress, proposalRecords)
    ),
    progressSchema: structuredClone(progressSchema),
    evidenceSchema: structuredClone(evidenceSchema),
    snippetsWrapper: structuredClone(snippetsValue),
    domainRegistryWrapper: structuredClone(domainsValue),
    regionsWrapper: structuredClone(regionsWrapper),
    settlementsWrapper: structuredClone(settlementsWrapper)
  };
}

function apply(input = makeInput()) {
  return proposeKnowledgeProgressApplication(input);
}

function assertApplied(result, input) {
  assert.equal(result.decision, "applied");
  assert.deepEqual(
    result.appliedProgressRecord,
    input.proposal.proposedProgressRecord
  );
  assert.notEqual(
    result.appliedProgressRecord,
    input.proposal.proposedProgressRecord
  );
  assert.equal(result.rejectedApplication, null);
  assert.deepEqual(
    result.consumedEvidenceIdsApplied,
    input.proposal.acceptedEvidenceIds
  );
  assert.deepEqual(result.issues, []);
  assert.deepEqual(result.safety, APPLICATION_SAFETY);
}

function assertRejected(result, code) {
  assert.equal(result.decision, "rejected");
  assert.equal(result.appliedProgressRecord, null);
  assert.deepEqual(result.consumedEvidenceIdsApplied, []);
  assert.deepEqual(result.issues, []);
  assert.equal(result.rejectedApplication.code, code);
  assert.deepEqual(result.safety, APPLICATION_SAFETY);
}

function assertIssue(result, code) {
  assert.equal(result.decision, "rejected");
  assert.equal(result.appliedProgressRecord, null);
  assert.equal(result.rejectedApplication, null);
  assert.deepEqual(result.consumedEvidenceIdsApplied, []);
  assert.equal(result.issues[0].code, code);
  assert.deepEqual(result.safety, APPLICATION_SAFETY);
}

function validateApplied(result, input) {
  const replacementWrapper = structuredClone(input.currentProgressWrapper);
  const index = replacementWrapper.records.findIndex(
    (record) => record.progressId === input.targetProgressId
  );
  replacementWrapper.records[index] = structuredClone(
    result.appliedProgressRecord
  );

  return validateKnowledgeProgress({
    relativePath: `${OPERATION_PATH} external validation`,
    wrapper: replacementWrapper,
    progressSchema: structuredClone(input.progressSchema),
    evidenceSchema: structuredClone(input.evidenceSchema),
    snippetsWrapper: structuredClone(input.snippetsWrapper),
    domainRegistryWrapper: structuredClone(input.domainRegistryWrapper),
    evidenceWrapper: structuredClone(input.currentAcceptedEvidenceWrapper),
    evidenceAuthorities: {
      regionsWrapper: structuredClone(input.regionsWrapper),
      settlementsWrapper: structuredClone(input.settlementsWrapper)
    },
    allowZeroStateRecords: true
  });
}

for (const snippetKey of ["aloe", "badger", "ironOre", "kaelvar"]) {
  test(`applies one valid ${snippetKey} proposal`, () => {
    const evidence = evidenceFor(snippetKey, 8);
    const targetProgress = progressFor(snippetKey, { updatedSequence: 2 });
    const input = makeInput({
      snippetKey,
      targetProgress,
      acceptedEvidenceRecords: [evidence],
      proposalEvidenceRecords: [evidence]
    });
    const result = apply(input);

    assertApplied(result, input);
    assert.equal(result.appliedProgressRecord.progressValue, 1);
    assert.deepEqual(result.appliedProgressRecord.consumedEvidenceIds, [
      evidence.evidenceId
    ]);
    assert.equal(result.appliedProgressRecord.updatedSequence, 9);
    for (const field of TARGET_FIELDS) {
      assert.equal(
        result.appliedProgressRecord[field],
        targetProgress[field],
        field
      );
    }
    assert.equal(validateApplied(result, input), true);
  });
}

test("applies multiple evidence ids in deterministic proposal order", () => {
  const evidenceRecords = [
    evidenceFor("aloe", 9, "entry_003"),
    evidenceFor("aloe", 4, "entry_001"),
    evidenceFor("aloe", 6, "entry_002")
  ];
  const input = makeInput({
    acceptedEvidenceRecords: evidenceRecords,
    proposalEvidenceRecords: evidenceRecords
  });
  const result = apply(input);
  const expectedIds = evidenceRecords
    .map((record) => record.evidenceId)
    .sort();

  assertApplied(result, input);
  assert.equal(result.appliedProgressRecord.progressValue, 3);
  assert.deepEqual(result.appliedProgressRecord.consumedEvidenceIds, expectedIds);
  assert.deepEqual(result.consumedEvidenceIdsApplied, expectedIds);
  assert.equal(result.appliedProgressRecord.updatedSequence, 10);
});

test("preserves existing consumed evidence order and appends only proposed ids", () => {
  const priorEvidence = evidenceFor("aloe", 1, "prior_001");
  const nextEvidence = evidenceFor("aloe", 7, "entry_002");
  const targetProgress = progressFor("aloe", {
    progressValue: 1,
    consumedEvidenceIds: [priorEvidence.evidenceId],
    updatedSequence: 3,
    notes: ["Preserve this exact application note source."]
  });
  const input = makeInput({
    targetProgress,
    acceptedEvidenceRecords: [priorEvidence, nextEvidence],
    proposalEvidenceRecords: [nextEvidence]
  });
  const result = apply(input);

  assertApplied(result, input);
  assert.deepEqual(result.appliedProgressRecord.consumedEvidenceIds, [
    priorEvidence.evidenceId,
    nextEvidence.evidenceId
  ]);
  assert.deepEqual(result.appliedProgressRecord.notes, targetProgress.notes);
});

test("returns the complete inert application envelope", () => {
  const result = apply();

  assert.deepEqual(Object.keys(result), [
    "decision",
    "appliedProgressRecord",
    "rejectedApplication",
    "consumedEvidenceIdsApplied",
    "issues",
    "safety"
  ]);
  assert.deepEqual(result.safety, APPLICATION_SAFETY);
  for (const field of [
    "replacementProgressWrapper",
    "persistedProgress",
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

test("does not mutate any input and returns independent output arrays", () => {
  const input = makeInput();
  const before = structuredClone(input);
  const result = apply(input);

  assertApplied(result, input);
  assert.deepEqual(input, before);
  assert.notEqual(
    result.appliedProgressRecord.consumedEvidenceIds,
    input.proposal.proposedProgressRecord.consumedEvidenceIds
  );
  assert.notEqual(
    result.consumedEvidenceIdsApplied,
    input.proposal.acceptedEvidenceIds
  );

  result.appliedProgressRecord.notes.push("Changed returned copy.");
  result.consumedEvidenceIdsApplied.push(
    "knowledge_evidence.aloe.application.returned_only"
  );
  assert.deepEqual(input, before);
});

test("returns deterministic output for repeated equivalent invocations", () => {
  const input = makeInput();

  assert.deepEqual(apply(input), apply(structuredClone(input)));
});

test("ignores proposal rejectedEvidence when accepted application data remains valid", () => {
  const input = makeInput();
  input.proposal.rejectedEvidence.push({
    evidenceId: "knowledge_evidence.badger.application.rejected_001",
    code: "target_mismatch",
    reason: "Rejected candidates receive no application effect."
  });

  assertApplied(apply(input), input);
});

test("rejects a missing proposal", () => {
  const input = makeInput();
  delete input.proposal;

  assertIssue(apply(input), "missing_proposal");
});

test("rejects malformed proposals and unsupported proposal fields", () => {
  const malformed = makeInput();
  malformed.proposal = [];
  assertIssue(apply(malformed), "invalid_proposal");

  const extraField = makeInput();
  extraField.proposal.persisted = true;
  assertIssue(apply(extraField), "invalid_proposal");
});

test("rejects a proposal with issues", () => {
  const input = makeInput();
  input.proposal.issues.push({
    code: "invalid_input",
    message: "Proposal validation failed."
  });

  assertRejected(apply(input), "proposal_has_issues");
});

test("rejects a missing proposed progress record", () => {
  const input = makeInput();
  input.proposal.proposedProgressRecord = null;

  assertIssue(apply(input), "invalid_proposal");
});

test("rejects empty accepted evidence ids", () => {
  const input = makeInput();
  input.proposal.acceptedEvidenceIds = [];

  assertRejected(apply(input), "empty_accepted_evidence_ids");
});

test("rejects duplicate accepted evidence ids", () => {
  const input = makeInput();
  input.proposal.acceptedEvidenceIds.push(
    input.proposal.acceptedEvidenceIds[0]
  );

  assertRejected(apply(input), "duplicate_accepted_evidence_ids");
});

test("rejects accepted evidence ids outside deterministic ascending order", () => {
  const evidenceRecords = [
    evidenceFor("aloe", 1, "entry_001"),
    evidenceFor("aloe", 2, "entry_002")
  ];
  const input = makeInput({
    acceptedEvidenceRecords: evidenceRecords,
    proposalEvidenceRecords: evidenceRecords
  });
  input.proposal.acceptedEvidenceIds.reverse();

  assertRejected(apply(input), "accepted_evidence_ids_not_sorted");
});

test("rejects non-positive, fractional, and count-mismatched deltaTotal", () => {
  for (const [deltaTotal, expectedCode] of [
    [0, "invalid_delta_total"],
    [-1, "invalid_delta_total"],
    [1.5, "invalid_delta_total"],
    [2, "delta_total_mismatch"]
  ]) {
    const input = makeInput();
    input.proposal.deltaTotal = deltaTotal;

    assertRejected(apply(input), expectedCode);
  }
});

test("rejects applied delta count, id, target, and value mismatches", () => {
  const mutations = [
    (input) => {
      input.proposal.appliedDeltas = [];
    },
    (input) => {
      input.proposal.appliedDeltas[0].evidenceId =
        "knowledge_evidence.aloe.application.other_001";
    },
    (input) => {
      input.proposal.appliedDeltas[0].targetProgressId =
        "knowledge_progress.aloe.application.entry_002";
    },
    (input) => {
      input.proposal.appliedDeltas[0].delta = 2;
    }
  ];

  for (const mutate of mutations) {
    const input = makeInput();
    mutate(input);
    assertRejected(apply(input), "applied_deltas_mismatch");
  }
});

test("rejects progressId mismatch", () => {
  const input = makeInput();
  input.proposal.proposedProgressRecord.progressId =
    "knowledge_progress.aloe.application.entry_002";

  assertRejected(apply(input), "progress_id_mismatch");
});

test("rejects every proposed target parity mismatch", () => {
  const mismatches = {
    ownerScope: "family",
    ownerId: "character.other_subject",
    snippetId: SNIPPET_IDS.badger,
    domainId: "knowledge_domain.fauna",
    subjectType: "fauna",
    subjectId: "fauna.badger"
  };

  for (const [field, value] of Object.entries(mismatches)) {
    const input = makeInput();
    input.proposal.proposedProgressRecord[field] = value;
    const result = apply(input);

    assertRejected(result, "proposal_target_mismatch");
    assert.match(result.rejectedApplication.reason, new RegExp(field));
  }
});

test("rejects accepted evidence target mismatch", () => {
  const mismatchedEvidence = evidenceFor("badger");
  const input = makeInput({
    acceptedEvidenceRecords: [mismatchedEvidence],
    proposalEvidenceRecords: [mismatchedEvidence]
  });

  assertRejected(apply(input), "accepted_evidence_target_mismatch");
});

test("rejects progressValue mismatch", () => {
  const input = makeInput();
  input.proposal.proposedProgressRecord.progressValue += 1;

  assertRejected(apply(input), "progress_value_mismatch");
});

test("rejects consumed evidence replacement, removal, and reordering", () => {
  const priorEvidence = evidenceFor("aloe", 1, "prior_001");
  const nextEvidence = evidenceFor("aloe", 7, "entry_002");
  const targetProgress = progressFor("aloe", {
    progressValue: 1,
    consumedEvidenceIds: [priorEvidence.evidenceId],
    updatedSequence: 2
  });
  const baseInput = makeInput({
    targetProgress,
    acceptedEvidenceRecords: [priorEvidence, nextEvidence],
    proposalEvidenceRecords: [nextEvidence]
  });
  const mutations = [
    (input) => {
      input.proposal.proposedProgressRecord.consumedEvidenceIds = [
        nextEvidence.evidenceId
      ];
    },
    (input) => {
      input.proposal.proposedProgressRecord.consumedEvidenceIds = [
        priorEvidence.evidenceId
      ];
    },
    (input) => {
      input.proposal.proposedProgressRecord.consumedEvidenceIds.reverse();
    }
  ];

  for (const mutate of mutations) {
    const input = structuredClone(baseInput);
    mutate(input);
    assertRejected(apply(input), "consumed_evidence_ids_mismatch");
  }
});

test("rejects equal, lower, negative, and fractional updatedSequence values", () => {
  const targetProgress = progressFor("aloe", { updatedSequence: 5 });
  for (const updatedSequence of [5, 4, -1, 5.5]) {
    const input = makeInput({ targetProgress });
    input.proposal.proposedProgressRecord.updatedSequence = updatedSequence;

    assertRejected(apply(input), "updated_sequence_not_monotonic");
  }
});

test("rejects notes mismatch", () => {
  const input = makeInput();
  input.proposal.proposedProgressRecord.notes = ["Changed application notes."];

  assertRejected(apply(input), "notes_mismatch");
});

test("rejects unsupported persistence and downstream claims in preserved notes", () => {
  for (const note of [
    "Progress was persisted.",
    "Snippet was completed.",
    "Trial is ready.",
    "UI was revealed.",
    "Reward was granted.",
    "Event was emitted.",
    "Runtime was mutated.",
    "Generated output was created."
  ]) {
    const targetProgress = progressFor("aloe", { notes: [note] });
    const input = makeInput({ targetProgress });

    assertRejected(apply(input), "unsupported_note_claim");
  }
});

test("rejects proposal safety claims that are not inert", () => {
  for (const field of [
    "noMutation",
    "noPersistence",
    "noCompletion",
    "noTrialUnlock",
    "noUiOutput"
  ]) {
    const input = makeInput();
    input.proposal.safety[field] = false;

    assertRejected(apply(input), "proposal_safety_violation");
  }
});

test("rejects a missing current accepted evidence wrapper", () => {
  const input = makeInput();
  delete input.currentAcceptedEvidenceWrapper;

  assertIssue(apply(input), "missing_current_accepted_evidence");
});

test("rejects invalid current accepted evidence", () => {
  const input = makeInput();
  delete input.currentAcceptedEvidenceWrapper.records[0].notes;

  assertIssue(apply(input), "invalid_current_accepted_evidence");
});

test("rejects unsupported accepted-evidence source semantics through the current validator", () => {
  const input = makeInput();
  input.currentAcceptedEvidenceWrapper.records[0].sourceType =
    "combat_observation";

  assertIssue(apply(input), "invalid_current_accepted_evidence");
});

test("rejects a proposal id absent from current accepted evidence", () => {
  const pendingEvidence = evidenceFor("aloe");
  const input = makeInput({
    acceptedEvidenceRecords: [],
    proposalEvidenceRecords: [pendingEvidence]
  });

  assertRejected(apply(input), "accepted_evidence_not_found");
});

test("rejects missing and invalid current progress wrappers", () => {
  const missing = makeInput();
  delete missing.currentProgressWrapper;
  assertIssue(apply(missing), "missing_current_progress");

  const invalid = makeInput();
  delete invalid.currentProgressWrapper.records[0].notes;
  assertIssue(apply(invalid), "invalid_current_progress");
});

test("rejects missing and unresolved targetProgressId", () => {
  const missing = makeInput();
  delete missing.targetProgressId;
  assertIssue(apply(missing), "invalid_target_progress_id");

  const unresolved = makeInput({
    targetProgressId: "knowledge_progress.aloe.application.missing_001"
  });
  assertRejected(apply(unresolved), "target_progress_not_found");
});

test("rejects duplicate target progress ids through current validation", () => {
  const targetProgress = progressFor("aloe");
  const input = makeInput({
    targetProgress,
    progressRecords: [targetProgress, structuredClone(targetProgress)]
  });

  assertIssue(apply(input), "invalid_current_progress");
  assert.match(input.currentProgressWrapper.records[0].progressId, /aloe/);
});

test("rejects evidence already consumed by the target", () => {
  const evidence = evidenceFor("aloe");
  const targetProgress = progressFor("aloe", {
    progressValue: 1,
    consumedEvidenceIds: [evidence.evidenceId],
    updatedSequence: 2
  });
  const input = makeInput({
    targetProgress,
    acceptedEvidenceRecords: [evidence],
    proposalEvidenceRecords: [evidence]
  });

  assertRejected(apply(input), "evidence_already_consumed_by_target");
});

test("rejects evidence consumed by another supplied progress record", () => {
  const badgerEvidence = evidenceFor("badger");
  const targetProgress = progressFor("aloe");
  const otherProgress = progressFor("badger", {
    progressValue: 1,
    consumedEvidenceIds: [badgerEvidence.evidenceId],
    updatedSequence: 7
  });
  const input = makeInput({
    targetProgress,
    progressRecords: [targetProgress, otherProgress],
    acceptedEvidenceRecords: [badgerEvidence],
    proposalEvidenceRecords: [badgerEvidence]
  });

  assertRejected(apply(input), "evidence_consumed_by_other_progress");
});

test("rejects planned Arcane Lore through the current evidence validator", () => {
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
  const arcaneEvidence = {
    evidenceId: "knowledge_evidence.arcane_lore.application.entry_001",
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
    notes: ["Synthetic planned-domain accepted evidence."]
  };
  const syntheticSnippets = structuredClone(snippetsWrapper);
  syntheticSnippets.records.push(arcaneSnippet);
  const input = makeInput({
    acceptedEvidenceRecords: [arcaneEvidence],
    proposalEvidenceRecords: [arcaneEvidence],
    snippetsValue: syntheticSnippets
  });

  assertIssue(apply(input), "invalid_current_accepted_evidence");
});

test("rejects invalid applied records through replacement-wrapper validation", () => {
  const input = makeInput();
  input.proposal.proposedProgressRecord.completed = true;

  assertIssue(apply(input), "invalid_applied_progress");
});

test("rejects passive and cross-system shortcut inputs", () => {
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
    const result = apply(input);

    assertIssue(result, "unsupported_input_fields");
    assert.deepEqual(input, before);
  }
});

test("helper source has no filesystem, clock, randomness, counters, or helper coupling", async () => {
  const source = await readText(
    "tools/content-lint/knowledge-progress-application.mjs"
  );

  assert.doesNotMatch(source, /node:fs|readFile|writeFile|readdir/);
  assert.doesNotMatch(source, /Date\.now|new Date|Math\.random|performance\.now/);
  assert.doesNotMatch(source, /globalCounter|hiddenCounter|let\s+\w*[Cc]ounter/);
  assert.doesNotMatch(
    source,
    /knowledge-evidence-producers|proposeKnowledgeObservationEvidence/
  );
  assert.doesNotMatch(
    source,
    /knowledge-evidence-acceptance|proposeKnowledgeEvidenceAcceptance/
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

test("normal content lint does not register the application helper", async () => {
  const source = await readText("tools/content-lint/index.mjs");

  assert.doesNotMatch(source, /knowledge-progress-application/);
  assert.doesNotMatch(source, /proposeKnowledgeProgressApplication/);
});

test("focused tests require no knowledge fixture directory", async () => {
  await assert.rejects(
    access(path.join(ROOT, "tests", "fixtures", "knowledge"))
  );
});
