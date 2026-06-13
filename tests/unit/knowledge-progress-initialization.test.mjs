import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { proposeKnowledgeProgressInitialization } from "../../tools/content-lint/knowledge-progress-initialization.mjs";
import { validateKnowledgeProgress } from "../../tools/content-lint/knowledge-progress.mjs";

const ROOT = process.cwd();
const OPERATION_PATH = "tests/fixtures/in-memory/knowledge-progress-initialization";
const DEFAULT_NOTE = "Initialized explicit zero-state Knowledge progress record.";

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

const EXPECTED_PROGRESS_IDS = {
  aloe:
    "knowledge_progress.flora.4_aloe_14_identification.9_character_12_test_subject",
  badger:
    "knowledge_progress.fauna.6_badger_14_identification.9_character_12_test_subject",
  ironOre:
    "knowledge_progress.minerals.8_iron_ore_14_identification.9_character_12_test_subject",
  kaelvar:
    "knowledge_progress.general_lore.7_kaelvar_16_cultural_context.9_character_12_test_subject"
};

const EXPECTED_PROGRESS_FIELDS = [
  "progressId",
  "snippetId",
  "domainId",
  "subjectType",
  "subjectId",
  "ownerScope",
  "ownerId",
  "progressValue",
  "consumedEvidenceIds",
  "updatedSequence",
  "notes"
];

const EXPECTED_SAFETY = {
  noMutation: true,
  noPersistence: true,
  noEvidenceCreation: true,
  noEvidenceConsumption: true,
  noProposal: true,
  noProgressApplication: true,
  noCompletion: true,
  noTrialUnlock: true,
  noUiOutput: true,
  noRuntimeEffect: true,
  noGeneratedOutput: true
};

function makeInput(snippetKey = "aloe", overrides = {}) {
  return {
    relativePath: OPERATION_PATH,
    initializationMode: "zero_state",
    ownerScope: "character",
    ownerId: "character.test_subject",
    snippetId: SNIPPET_IDS[snippetKey],
    updatedSequence: 7,
    notes: [DEFAULT_NOTE],
    snippetsWrapper: structuredClone(snippetsWrapper),
    domainRegistryWrapper: structuredClone(domainRegistryWrapper),
    currentProgressWrapper: {
      records: []
    },
    progressSchema: structuredClone(progressSchema),
    ...overrides
  };
}

function propose(input = makeInput()) {
  return proposeKnowledgeProgressInitialization(input);
}

function assertInitialized(result) {
  assert.deepEqual(result.issues, []);
  assert.notEqual(result.initializedProgressRecord, null);
  assert.deepEqual(Object.keys(result.initializedProgressRecord), EXPECTED_PROGRESS_FIELDS);
  assert.deepEqual(result.safety, EXPECTED_SAFETY);
}

function validateInitialized(result, input) {
  return validateKnowledgeProgress({
    relativePath: `${OPERATION_PATH} external-validation`,
    wrapper: {
      records: [structuredClone(result.initializedProgressRecord)]
    },
    progressSchema: structuredClone(input.progressSchema),
    evidenceSchema: structuredClone(evidenceSchema),
    snippetsWrapper: structuredClone(input.snippetsWrapper),
    domainRegistryWrapper: structuredClone(input.domainRegistryWrapper),
    evidenceWrapper: {
      records: []
    },
    evidenceAuthorities: {
      regionsWrapper: structuredClone(regionsWrapper),
      settlementsWrapper: structuredClone(settlementsWrapper)
    },
    allowZeroStateRecords: true
  });
}

for (const snippetKey of ["aloe", "badger", "ironOre", "kaelvar"]) {
  test(`initializes deterministic ${snippetKey} zero-state progress`, () => {
    const input = makeInput(snippetKey);
    const result = propose(input);

    assertInitialized(result);
    assert.equal(result.initializedProgressRecord.progressId, EXPECTED_PROGRESS_IDS[snippetKey]);
    assert.equal(result.initializedProgressRecord.progressValue, 0);
    assert.deepEqual(result.initializedProgressRecord.consumedEvidenceIds, []);
    assert.equal(result.initializedProgressRecord.updatedSequence, 7);
    assert.deepEqual(result.initializedProgressRecord.notes, [DEFAULT_NOTE]);
    assert.equal(validateInitialized(result, input), true);
    assert.deepEqual(result, propose(structuredClone(input)));
  });
}

test("identity changes only with explicit owner or snippet identity", () => {
  const first = propose(makeInput("aloe")).initializedProgressRecord.progressId;
  const replay = propose(makeInput("aloe")).initializedProgressRecord.progressId;
  const otherOwner = propose(
    makeInput("aloe", { ownerId: "character.other_subject" })
  ).initializedProgressRecord.progressId;
  const otherSnippet = propose(makeInput("badger")).initializedProgressRecord.progressId;

  assert.equal(first, replay);
  assert.notEqual(first, otherOwner);
  assert.notEqual(first, otherSnippet);
});

test("preserves explicit schema-valid sequence and notes", () => {
  const input = makeInput("kaelvar", {
    updatedSequence: 42,
    notes: [DEFAULT_NOTE, "Focused initialization operation."]
  });
  const result = propose(input);

  assertInitialized(result);
  assert.equal(result.initializedProgressRecord.updatedSequence, 42);
  assert.deepEqual(result.initializedProgressRecord.notes, input.notes);
});

test("derives target snapshots only from the authored snippet", () => {
  const result = propose(makeInput("ironOre"));

  assertInitialized(result);
  assert.equal(result.initializedProgressRecord.domainId, "knowledge_domain.minerals");
  assert.equal(result.initializedProgressRecord.subjectType, "mineral");
  assert.equal(result.initializedProgressRecord.subjectId, "mineral.iron_ore");
});

test("does not mutate authority, schema, current progress, or operation inputs", () => {
  const input = makeInput("kaelvar");
  const before = structuredClone(input);
  const result = propose(input);

  assertInitialized(result);
  assert.deepEqual(input, before);
  result.initializedProgressRecord.notes.push("Changed returned copy.");
  assert.deepEqual(input, before);
});

test("returns only the initialization proposal envelope and no behavior fields", () => {
  const result = propose();

  assert.deepEqual(Object.keys(result), [
    "initializedProgressRecord",
    "issues",
    "safety"
  ]);
  for (const field of [
    "candidateEvidence",
    "acceptedEvidence",
    "proposedProgressRecord",
    "appliedDeltas",
    "completion",
    "trialUnlocks",
    "events",
    "ui",
    "runtime",
    "generatedOutput",
    "rewards",
    "gameplay"
  ]) {
    assert.equal(field in result, false);
  }
});

test("rejects missing, invalid, and non-character owners", () => {
  const missing = makeInput();
  delete missing.ownerId;
  assert.equal(propose(missing).issues[0].code, "invalid_owner_id");

  assert.equal(
    propose(makeInput("aloe", { ownerId: "invalid" })).issues[0].code,
    "invalid_owner_id"
  );

  for (const ownerScope of [undefined, "family", "account", "institution"]) {
    const input = makeInput("aloe", { ownerScope });
    assert.equal(propose(input).issues[0].code, "invalid_owner_scope");
  }
});

test("rejects missing and unknown snippets", () => {
  const missing = makeInput();
  delete missing.snippetId;
  assert.equal(propose(missing).issues[0].code, "invalid_snippet_id");

  assert.equal(
    propose(
      makeInput("aloe", {
        snippetId: "knowledge_snippet.flora.missing.identification"
      })
    ).issues[0].code,
    "snippet_not_found"
  );
});

test("rejects duplicate snippet and domain authority ids", () => {
  const duplicateSnippet = makeInput();
  duplicateSnippet.snippetsWrapper.records.push(
    structuredClone(duplicateSnippet.snippetsWrapper.records[0])
  );
  assert.equal(propose(duplicateSnippet).issues[0].code, "duplicate_snippet_id");

  const duplicateDomain = makeInput();
  duplicateDomain.domainRegistryWrapper.records.push(
    structuredClone(duplicateDomain.domainRegistryWrapper.records[0])
  );
  assert.equal(propose(duplicateDomain).issues[0].code, "duplicate_domain_id");
});

test("rejects unknown and planned domains including Arcane Lore", () => {
  const unknownDomain = makeInput();
  unknownDomain.snippetsWrapper.records[0].domainId = "knowledge_domain.missing";
  assert.equal(propose(unknownDomain).issues[0].code, "domain_not_found");

  const arcaneSnippet = {
    id: "knowledge_snippet.arcane_lore.spark.identification",
    domainId: "knowledge_domain.arcane_lore",
    subjectType: "spell",
    subjectId: "spell.spark"
  };
  const arcane = makeInput("aloe", {
    snippetId: arcaneSnippet.id
  });
  arcane.snippetsWrapper.records.push(arcaneSnippet);

  const result = propose(arcane);
  assert.equal(result.issues[0].code, "inactive_domain");
  assert.match(result.issues[0].message, /arcane_lore.*active.*planned/);
});

test("rejects target snapshots, caller ids, evidence, passive state, and system shortcuts", () => {
  const attemptedFields = [
    "progressId",
    "domainId",
    "subjectType",
    "subjectId",
    "candidateEvidence",
    "acceptedEvidence",
    "evidenceWrapper",
    "passiveLocation",
    "inventory",
    "skillState",
    "spellState",
    "accountState",
    "familyState",
    "institutionState",
    "questState",
    "chronicleState",
    "renownState",
    "uiState",
    "runtimeState",
    "saveState",
    "generatedState",
    "completion",
    "trialState"
  ];

  for (const field of attemptedFields) {
    const input = makeInput();
    input[field] = {};
    const before = structuredClone(input);
    const result = propose(input);

    assert.equal(result.issues[0].code, "unsupported_input_fields");
    assert.equal(result.initializedProgressRecord, null);
    assert.deepEqual(input, before);
  }
});

test("rejects unsupported first_evidence and missing modes", () => {
  assert.equal(
    propose(makeInput("aloe", { initializationMode: "first_evidence" })).issues[0].code,
    "unsupported_initialization_mode"
  );

  const missing = makeInput();
  delete missing.initializationMode;
  assert.equal(propose(missing).issues[0].code, "unsupported_initialization_mode");
});

test("rejects invalid updatedSequence values", () => {
  for (const updatedSequence of [undefined, -1, 1.5, "1", null]) {
    const input = makeInput("aloe", { updatedSequence });
    assert.equal(propose(input).issues[0].code, "invalid_updated_sequence");
  }
});

test("rejects invalid notes", () => {
  for (const notes of [undefined, [], [""], ["Duplicate.", "Duplicate."], "note"]) {
    const input = makeInput("aloe", { notes });
    assert.equal(propose(input).issues[0].code, "invalid_notes");
  }
});

test("rejects invalid current progress wrappers and records", () => {
  const missingWrapper = makeInput();
  delete missingWrapper.currentProgressWrapper;
  assert.equal(propose(missingWrapper).issues[0].code, "invalid_current_progress");

  const extraWrapperField = makeInput();
  extraWrapperField.currentProgressWrapper.version = 1;
  assert.equal(propose(extraWrapperField).issues[0].code, "invalid_current_progress");

  const invalidRecord = makeInput();
  invalidRecord.currentProgressWrapper.records.push({
    progressId: "knowledge_progress.flora.invalid.record"
  });
  assert.equal(propose(invalidRecord).issues[0].code, "invalid_current_progress");
});

test("rejects duplicate current progress ids", () => {
  const initialized = propose(makeInput()).initializedProgressRecord;
  const input = makeInput();
  input.currentProgressWrapper.records = [
    structuredClone(initialized),
    structuredClone(initialized)
  ];

  assert.equal(propose(input).issues[0].code, "duplicate_current_progress_id");
});

test("rejects duplicate current owner/snippet targets", () => {
  const initialized = propose(makeInput()).initializedProgressRecord;
  const duplicateTarget = {
    ...structuredClone(initialized),
    progressId: "knowledge_progress.flora.existing.alternate"
  };
  const input = makeInput();
  input.currentProgressWrapper.records = [initialized, duplicateTarget];

  assert.equal(propose(input).issues[0].code, "duplicate_current_progress_target");
});

test("rejects an existing deterministic progressId", () => {
  const initialized = propose(makeInput()).initializedProgressRecord;
  const input = makeInput();
  input.currentProgressWrapper.records = [initialized];

  assert.equal(propose(input).issues[0].code, "existing_progress_id");
});

test("rejects an existing owner/snippet target with another progressId", () => {
  const initialized = propose(makeInput()).initializedProgressRecord;
  initialized.progressId = "knowledge_progress.flora.existing.alternate";
  const input = makeInput();
  input.currentProgressWrapper.records = [initialized];

  assert.equal(propose(input).issues[0].code, "existing_progress_target");
});

test("rejects progress schema drift and constructed-record extra-field drift", () => {
  const missingField = makeInput();
  delete missingField.progressSchema.properties.notes;
  assert.equal(propose(missingField).issues[0].code, "invalid_progress_schema");

  const extraField = makeInput();
  extraField.progressSchema.properties.completed = { type: "string" };
  extraField.progressSchema.required.push("completed");
  assert.equal(propose(extraField).issues[0].code, "invalid_progress_schema");
});

test("helper source has no filesystem, clock, randomness, counter, evidence, or runtime coupling", async () => {
  const source = await readText(
    "tools/content-lint/knowledge-progress-initialization.mjs"
  );

  assert.doesNotMatch(source, /node:fs|readFile|writeFile|readdir/);
  assert.doesNotMatch(source, /Date\.now|new Date|Math\.random|performance\.now/);
  assert.doesNotMatch(source, /globalCounter|hiddenCounter|let\s+\w*[Cc]ounter/);
  assert.doesNotMatch(
    source,
    /knowledge-evidence-to-progress|proposeKnowledgeProgressFromEvidence/
  );
  assert.doesNotMatch(
    source,
    /knowledge-evidence-producers|proposeKnowledgeObservationEvidence|validateKnowledgeEvidence/
  );
  assert.doesNotMatch(
    source,
    /apps\/rpg-ui|packages\/engines|dispatchEvent|eventEmitter|tests\/fixtures\/knowledge/
  );
});

test("normal content lint does not register the initialization helper", async () => {
  const source = await readText("tools/content-lint/index.mjs");

  assert.doesNotMatch(source, /knowledge-progress-initialization/);
  assert.doesNotMatch(source, /proposeKnowledgeProgressInitialization/);
});

test("focused tests require no knowledge fixture directory", async () => {
  await assert.rejects(
    access(path.join(ROOT, "tests/fixtures/knowledge"))
  );
});
