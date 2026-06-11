import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { proposeKnowledgeProgressFromEvidence } from "../../tools/content-lint/knowledge-evidence-to-progress.mjs";

const ROOT = process.cwd();
const OPERATION_PATH = "tests/fixtures/in-memory/knowledge-evidence-to-progress";

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

function snippetFor(snippetKey, wrapper = snippetsWrapper) {
  return wrapper.records.find((record) => record.id === SNIPPET_IDS[snippetKey]);
}

function evidenceFor(snippetKey, sequence = 1, overrides = {}) {
  const snippet = snippetFor(snippetKey);
  const sourceType = snippet.discoverySources[0].sourceType;
  const contextType =
    sourceType === "travel_observation" ? "travel_observation" : "field_observation";

  return {
    evidenceId: `knowledge_evidence.${ID_TOKENS[snippetKey]}.sample.entry_${String(sequence).padStart(3, "0")}`,
    snippetId: snippet.id,
    domainId: snippet.domainId,
    subjectType: snippet.subjectType,
    subjectId: snippet.subjectId,
    sourceType,
    sourceId: null,
    ownerScope: "character",
    ownerId: "character.test_subject",
    acquiredSequence: sequence,
    acquisitionContext: {
      contextType
    },
    notes: ["Focused in-memory evidence-to-progress fixture."],
    ...overrides
  };
}

function progressFor(snippetKey, overrides = {}) {
  const snippet = snippetFor(snippetKey);

  return {
    progressId: `knowledge_progress.${ID_TOKENS[snippetKey]}.sample.entry_001`,
    snippetId: snippet.id,
    domainId: snippet.domainId,
    subjectType: snippet.subjectType,
    subjectId: snippet.subjectId,
    ownerScope: "character",
    ownerId: "character.test_subject",
    progressValue: 0,
    consumedEvidenceIds: [],
    updatedSequence: 0,
    notes: ["Focused in-memory progress target."],
    ...overrides
  };
}

function makeInput({
  targetProgress = progressFor("aloe"),
  progressRecords,
  evidenceRecords = [evidenceFor("aloe")],
  candidateEvidenceIds,
  targetProgressId,
  progressSchemaValue = progressSchema,
  evidenceSchemaValue = evidenceSchema,
  snippetsValue = snippetsWrapper,
  domainsValue = domainRegistryWrapper
} = {}) {
  const records = progressRecords ?? [targetProgress];
  const resolvedTargetProgressId =
    targetProgressId ?? targetProgress?.progressId ?? "knowledge_progress.missing.sample.entry_001";
  const resolvedCandidateEvidenceIds =
    candidateEvidenceIds ?? evidenceRecords.map((record) => record.evidenceId);

  return {
    relativePath: OPERATION_PATH,
    targetProgressId: resolvedTargetProgressId,
    candidateEvidenceIds: structuredClone(resolvedCandidateEvidenceIds),
    progressWrapper: {
      records: structuredClone(records)
    },
    evidenceWrapper: {
      records: structuredClone(evidenceRecords)
    },
    progressAuthorities: {
      progressSchema: structuredClone(progressSchemaValue)
    },
    evidenceAuthorities: {
      evidenceSchema: structuredClone(evidenceSchemaValue),
      snippetsWrapper: structuredClone(snippetsValue),
      domainRegistryWrapper: structuredClone(domainsValue),
      regionsWrapper: structuredClone(regionsWrapper),
      settlementsWrapper: structuredClone(settlementsWrapper)
    }
  };
}

function propose(input = makeInput()) {
  return proposeKnowledgeProgressFromEvidence(input);
}

function assertAccepted(result, evidenceIds, expectedProgressValue) {
  assert.deepEqual(result.acceptedEvidenceIds, evidenceIds);
  assert.equal(result.deltaTotal, evidenceIds.length);
  assert.equal(result.proposedProgressRecord.progressValue, expectedProgressValue);
  assert.deepEqual(
    result.appliedDeltas,
    evidenceIds.map((evidenceId) => ({
      evidenceId,
      targetProgressId: result.proposedProgressRecord.progressId,
      delta: 1
    }))
  );
  assert.deepEqual(result.issues, []);
}

test("accepts one eligible Aloe evidence record and proposes exactly +1", () => {
  const evidence = evidenceFor("aloe", 7);
  const result = propose(makeInput({ evidenceRecords: [evidence] }));

  assertAccepted(result, [evidence.evidenceId], 1);
  assert.equal(result.proposedProgressRecord.updatedSequence, 8);
});

test("accepts distinct eligible Aloe evidence ids additively", () => {
  const evidenceRecords = [
    evidenceFor("aloe", 4),
    evidenceFor("aloe", 9)
  ];
  const result = propose(makeInput({ evidenceRecords }));

  assertAccepted(
    result,
    evidenceRecords.map((record) => record.evidenceId),
    2
  );
  assert.equal(result.proposedProgressRecord.updatedSequence, 10);
});

for (const snippetKey of ["badger", "ironOre", "kaelvar"]) {
  test(`accepts eligible ${snippetKey} evidence only for matching progress`, () => {
    const evidence = evidenceFor(snippetKey, 5);
    const targetProgress = progressFor(snippetKey, { updatedSequence: 2 });
    const result = propose(makeInput({ targetProgress, evidenceRecords: [evidence] }));

    assertAccepted(result, [evidence.evidenceId], 1);
    assert.equal(result.proposedProgressRecord.updatedSequence, 6);
    assert.equal(result.proposedProgressRecord.ownerScope, "character");
    for (const field of ["ownerId", "snippetId", "domainId", "subjectType", "subjectId"]) {
      assert.equal(result.proposedProgressRecord[field], targetProgress[field]);
    }
  });
}

test("sorts accepted evidence ids independently of candidate input order", () => {
  const evidenceRecords = [
    evidenceFor("aloe", 3),
    evidenceFor("aloe", 1),
    evidenceFor("aloe", 2)
  ];
  const input = makeInput({
    evidenceRecords,
    candidateEvidenceIds: evidenceRecords.map((record) => record.evidenceId)
  });
  const result = propose(input);
  const expectedIds = evidenceRecords
    .map((record) => record.evidenceId)
    .sort();

  assert.deepEqual(result.acceptedEvidenceIds, expectedIds);
  assert.deepEqual(
    result.proposedProgressRecord.consumedEvidenceIds,
    expectedIds
  );
});

test("returns identical results for equivalent candidate inputs in different orders", () => {
  const evidenceRecords = [
    evidenceFor("aloe", 3),
    evidenceFor("aloe", 1),
    evidenceFor("aloe", 2)
  ];
  const forward = makeInput({
    evidenceRecords,
    candidateEvidenceIds: evidenceRecords.map((record) => record.evidenceId)
  });
  const reverse = makeInput({
    evidenceRecords,
    candidateEvidenceIds: evidenceRecords
      .map((record) => record.evidenceId)
      .reverse()
  });

  assert.deepEqual(propose(forward), propose(reverse));
});

test("derives updatedSequence from explicit target and accepted evidence sequences", () => {
  const targetProgress = progressFor("aloe", { updatedSequence: 12 });
  const evidenceRecords = [
    evidenceFor("aloe", 4),
    evidenceFor("aloe", 18)
  ];
  const result = propose(makeInput({ targetProgress, evidenceRecords }));

  assert.equal(result.proposedProgressRecord.updatedSequence, 19);
});

test("appends accepted ids after existing consumed ids and preserves other fields", () => {
  const priorEvidence = evidenceFor("aloe", 1);
  const candidate = evidenceFor("aloe", 8);
  const targetProgress = progressFor("aloe", {
    progressValue: 4,
    consumedEvidenceIds: [priorEvidence.evidenceId],
    updatedSequence: 6,
    notes: ["Preserve this exact note."]
  });
  const result = propose(
    makeInput({
      targetProgress,
      evidenceRecords: [priorEvidence, candidate],
      candidateEvidenceIds: [candidate.evidenceId]
    })
  );

  assert.equal(result.proposedProgressRecord.progressValue, 5);
  assert.deepEqual(result.proposedProgressRecord.consumedEvidenceIds, [
    priorEvidence.evidenceId,
    candidate.evidenceId
  ]);
  assert.equal(result.proposedProgressRecord.updatedSequence, 9);
  assert.deepEqual(result.proposedProgressRecord.notes, targetProgress.notes);
});

test("returns an immutable proposed copy and leaves every input unchanged", () => {
  const input = makeInput({
    evidenceRecords: [evidenceFor("aloe", 4), evidenceFor("aloe", 2)]
  });
  const before = structuredClone(input);
  const result = propose(input);

  assert.deepEqual(input, before);
  assert.notEqual(result.proposedProgressRecord, input.progressWrapper.records[0]);
  result.proposedProgressRecord.notes.push("Mutated result only.");
  assert.deepEqual(input, before);
});

test("returns every inert safety flag as true", () => {
  const result = propose();
  assert.deepEqual(result.safety, {
    noMutation: true,
    noPersistence: true,
    noCompletion: true,
    noTrialUnlock: true,
    noUiOutput: true
  });
});

test("leaves the proposed record value-equivalent when no evidence is accepted", () => {
  const targetProgress = progressFor("aloe", { updatedSequence: 14 });
  const badgerEvidence = evidenceFor("badger", 20);
  const result = propose(
    makeInput({
      targetProgress,
      evidenceRecords: [badgerEvidence]
    })
  );

  assert.deepEqual(result.acceptedEvidenceIds, []);
  assert.equal(result.deltaTotal, 0);
  assert.deepEqual(result.appliedDeltas, []);
  assert.deepEqual(result.proposedProgressRecord, targetProgress);
});

test("rejects structurally invalid evidence before calculation", () => {
  const evidence = evidenceFor("aloe");
  delete evidence.notes;
  const result = propose(makeInput({ evidenceRecords: [evidence] }));

  assert.equal(result.issues[0].code, "invalid_input");
  assert.match(result.issues[0].message, /structural validation failed.*notes/);
  assert.equal(result.proposedProgressRecord, null);
  assert.equal(result.deltaTotal, 0);
});

test("rejects semantically invalid evidence before calculation", () => {
  const evidence = evidenceFor("aloe", 1, {
    sourceType: "combat_observation"
  });
  const result = propose(makeInput({ evidenceRecords: [evidence] }));

  assert.equal(result.issues[0].code, "invalid_input");
  assert.match(result.issues[0].message, /sourceType.*not declared by snippet/);
  assert.deepEqual(result.acceptedEvidenceIds, []);
});

test("rejects structurally invalid progress before calculation", () => {
  const targetProgress = progressFor("aloe");
  delete targetProgress.notes;
  const result = propose(makeInput({ targetProgress }));

  assert.equal(result.issues[0].code, "invalid_input");
  assert.match(result.issues[0].message, /structural validation failed.*notes/);
});

test("rejects semantically invalid progress before calculation", () => {
  const targetProgress = progressFor("aloe", {
    progressValue: 2,
    consumedEvidenceIds: []
  });
  const result = propose(makeInput({ targetProgress }));

  assert.equal(result.issues[0].code, "invalid_input");
  assert.match(result.issues[0].message, /progressValue value 2 must be zero/);
});

test("rejects a missing target rather than auto-creating progress", () => {
  const input = makeInput({
    targetProgressId: "knowledge_progress.missing.sample.entry_001"
  });
  const result = propose(input);

  assert.equal(result.issues[0].code, "target_progress_not_found");
  assert.match(result.issues[0].message, /must resolve to exactly one existing/);
  assert.equal(result.proposedProgressRecord, null);
});

test("rejects non-character owner scope through current validators", () => {
  const evidence = evidenceFor("aloe", 1, { ownerScope: "family" });
  const widenedSchema = structuredClone(evidenceSchema);
  widenedSchema.properties.ownerScope.enum.push("family");
  const result = propose(
    makeInput({
      evidenceRecords: [evidence],
      evidenceSchemaValue: widenedSchema
    })
  );

  assert.equal(result.issues[0].code, "invalid_input");
  assert.match(result.issues[0].message, /ownerScope value "family" must remain 'character'/);
});

test("rejects owner id mismatch", () => {
  const evidence = evidenceFor("aloe", 1, {
    ownerId: "character.other_subject"
  });
  const result = propose(makeInput({ evidenceRecords: [evidence] }));

  assert.equal(result.rejectedEvidence[0].code, "target_mismatch");
  assert.deepEqual(result.rejectedEvidence[0].mismatchedFields, ["ownerId"]);
});

test("reports every target snapshot mismatch deterministically", () => {
  const evidence = evidenceFor("badger");
  const result = propose(makeInput({ evidenceRecords: [evidence] }));

  assert.equal(result.rejectedEvidence[0].code, "target_mismatch");
  assert.deepEqual(result.rejectedEvidence[0].mismatchedFields, [
    "snippetId",
    "domainId",
    "subjectType",
    "subjectId"
  ]);
  assert.match(
    result.rejectedEvidence[0].reason,
    /snippetId, domainId, subjectType, subjectId/
  );
});

test("rejects planned Arcane Lore through existing validators", () => {
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
    evidenceId: "knowledge_evidence.arcane_lore.spark.entry_001",
    snippetId: arcaneSnippet.id,
    domainId: arcaneSnippet.domainId,
    subjectType: arcaneSnippet.subjectType,
    subjectId: arcaneSnippet.subjectId,
    sourceType: "book_study",
    sourceId: null,
    ownerScope: "character",
    ownerId: "character.test_subject",
    acquiredSequence: 1,
    acquisitionContext: {
      contextType: "study"
    },
    notes: ["Synthetic planned-domain fixture."]
  };
  const arcaneProgress = {
    progressId: "knowledge_progress.arcane_lore.spark.entry_001",
    snippetId: arcaneSnippet.id,
    domainId: arcaneSnippet.domainId,
    subjectType: arcaneSnippet.subjectType,
    subjectId: arcaneSnippet.subjectId,
    ownerScope: "character",
    ownerId: "character.test_subject",
    progressValue: 0,
    consumedEvidenceIds: [],
    updatedSequence: 0,
    notes: ["Synthetic planned-domain fixture."]
  };
  const syntheticSnippets = structuredClone(snippetsWrapper);
  syntheticSnippets.records.push(arcaneSnippet);
  const result = propose(
    makeInput({
      targetProgress: arcaneProgress,
      evidenceRecords: [arcaneEvidence],
      snippetsValue: syntheticSnippets
    })
  );

  assert.equal(result.issues[0].code, "invalid_input");
  assert.match(result.issues[0].message, /arcane_lore.*status 'active'.*"planned"/);
});

test("rejects unsupported source and context through the evidence validator", () => {
  const evidence = evidenceFor("aloe", 1, {
    acquisitionContext: {
      contextType: "study"
    }
  });
  const result = propose(makeInput({ evidenceRecords: [evidence] }));

  assert.equal(result.issues[0].code, "invalid_input");
  assert.match(result.issues[0].message, /contextType.*must be "field_observation"/);
});

test("rejects non-null sourceId through the evidence validator", () => {
  const evidence = evidenceFor("aloe", 1, {
    sourceId: "source.aloe_sample"
  });
  const result = propose(makeInput({ evidenceRecords: [evidence] }));

  assert.equal(result.issues[0].code, "invalid_input");
  assert.match(result.issues[0].message, /sourceId.*must remain null/);
});

test("rejects evidence already consumed by the target record", () => {
  const evidence = evidenceFor("aloe", 1);
  const targetProgress = progressFor("aloe", {
    progressValue: 1,
    consumedEvidenceIds: [evidence.evidenceId],
    updatedSequence: 2
  });
  const result = propose(
    makeInput({
      targetProgress,
      evidenceRecords: [evidence]
    })
  );

  assert.equal(result.rejectedEvidence[0].code, "already_consumed_by_target");
  assert.deepEqual(result.proposedProgressRecord, targetProgress);
});

test("rejects evidence consumed by another supplied progress record", () => {
  const evidence = evidenceFor("aloe", 3, {
    ownerId: "character.other_subject"
  });
  const targetProgress = progressFor("aloe");
  const otherProgress = progressFor("aloe", {
    progressId: "knowledge_progress.aloe.sample.entry_002",
    ownerId: "character.other_subject",
    progressValue: 1,
    consumedEvidenceIds: [evidence.evidenceId],
    updatedSequence: 3
  });
  const result = propose(
    makeInput({
      targetProgress,
      progressRecords: [targetProgress, otherProgress],
      evidenceRecords: [evidence]
    })
  );

  assert.equal(result.rejectedEvidence[0].code, "consumed_by_other_progress");
  assert.match(result.rejectedEvidence[0].reason, /entry_002/);
});

test("accepts the first sorted candidate and rejects duplicate candidate entries", () => {
  const evidence = evidenceFor("aloe", 2);
  const result = propose(
    makeInput({
      evidenceRecords: [evidence],
      candidateEvidenceIds: [evidence.evidenceId, evidence.evidenceId]
    })
  );

  assert.deepEqual(result.acceptedEvidenceIds, [evidence.evidenceId]);
  assert.equal(result.rejectedEvidence[0].code, "duplicate_candidate");
  assert.equal(result.deltaTotal, 1);
});

test("rejects unresolved candidate evidence ids without inventing records", () => {
  const missingEvidenceId = "knowledge_evidence.aloe.missing.entry_001";
  const result = propose(
    makeInput({
      evidenceRecords: [],
      candidateEvidenceIds: [missingEvidenceId]
    })
  );

  assert.equal(result.rejectedEvidence[0].code, "unresolved_evidence");
  assert.equal(result.proposedProgressRecord.progressValue, 0);
});

test("does not infer occurrence equivalence between distinct evidence ids", () => {
  const sharedContext = {
    contextType: "field_observation"
  };
  const evidenceRecords = [
    evidenceFor("aloe", 10, { acquisitionContext: sharedContext }),
    evidenceFor("aloe", 11, {
      acquisitionContext: structuredClone(sharedContext),
      acquiredSequence: 10
    })
  ];
  const result = propose(makeInput({ evidenceRecords }));

  assert.equal(result.acceptedEvidenceIds.length, 2);
  assert.equal(result.deltaTotal, 2);
});

test("authorizes no non-evidence operation", () => {
  const targetProgress = progressFor("aloe", { updatedSequence: 7 });
  const input = makeInput({
    targetProgress,
    evidenceRecords: [],
    candidateEvidenceIds: []
  });
  input.nonEvidenceOperation = {
    skillId: "skill.knowledge.flora_lore",
    spellId: "spell.sample",
    itemId: "item.sample",
    travelRegionId: "region.kaelvar"
  };
  const result = propose(input);

  assert.deepEqual(result.proposedProgressRecord, targetProgress);
  assert.equal(result.deltaTotal, 0);
});

test("produces only positive integer unit deltas with no weighting or thresholds", () => {
  const evidenceRecords = [
    evidenceFor("aloe", 1),
    evidenceFor("aloe", 2),
    evidenceFor("aloe", 3)
  ];
  const result = propose(makeInput({ evidenceRecords }));

  assert.equal(Number.isInteger(result.deltaTotal), true);
  assert.equal(result.deltaTotal, 3);
  assert.equal(result.appliedDeltas.every((entry) => entry.delta === 1), true);
  assert.equal(result.appliedDeltas.every((entry) => Number.isInteger(entry.delta)), true);
  assert.equal("completion" in result, false);
  assert.equal("trial" in result, false);
  assert.equal("percentage" in result, false);
  assert.equal("weight" in result, false);
});

test("never persists progressSources or appliedDeltas into the proposed record", () => {
  const result = propose();

  assert.equal("progressSources" in result.proposedProgressRecord, false);
  assert.equal("appliedDeltas" in result.proposedProgressRecord, false);
  assert.equal(Array.isArray(result.appliedDeltas), true);
});

test("returns stable rejected reasons, issues, deltas, sequence, and safety flags", () => {
  const badgerEvidence = evidenceFor("badger", 12);
  const duplicateId = badgerEvidence.evidenceId;
  const input = makeInput({
    evidenceRecords: [badgerEvidence],
    candidateEvidenceIds: [duplicateId, duplicateId]
  });

  assert.deepEqual(propose(input), propose(structuredClone(input)));
});

test("rejects invalid operation identifiers deterministically", () => {
  const invalidTarget = propose(
    makeInput({
      targetProgressId: ""
    })
  );
  assert.equal(invalidTarget.issues[0].code, "invalid_target_progress_id");

  const invalidCandidates = propose(
    makeInput({
      candidateEvidenceIds: ["knowledge_evidence.aloe.sample.entry_001", null]
    })
  );
  assert.equal(invalidCandidates.issues[0].code, "invalid_candidate_evidence_ids");
});

test("helper source has no filesystem, clock, randomness, runtime, UI, or event imports", async () => {
  const source = await readText(
    "tools/content-lint/knowledge-evidence-to-progress.mjs"
  );

  assert.doesNotMatch(source, /node:fs|readFile|writeFile/);
  assert.doesNotMatch(source, /Date\.now|new Date|Math\.random|performance\.now/);
  assert.doesNotMatch(source, /apps\/rpg-ui|packages\/engines|eventEmitter|dispatchEvent/);
});

test("normal content lint does not register evidence-to-progress or progress validation", async () => {
  const source = await readText("tools/content-lint/index.mjs");

  assert.doesNotMatch(source, /knowledge-evidence-to-progress/);
  assert.doesNotMatch(source, /validateKnowledgeProgress/);
  assert.doesNotMatch(source, /proposeKnowledgeProgressFromEvidence/);
});

test("result envelope contains only inert proposal fields", () => {
  const result = propose();

  assert.deepEqual(Object.keys(result), [
    "acceptedEvidenceIds",
    "rejectedEvidence",
    "proposedProgressRecord",
    "deltaTotal",
    "appliedDeltas",
    "issues",
    "safety"
  ]);
  assert.equal("events" in result, false);
  assert.equal("rewards" in result, false);
  assert.equal("ui" in result, false);
  assert.equal("trialUnlocks" in result, false);
  assert.equal("completionTransitions" in result, false);
});
