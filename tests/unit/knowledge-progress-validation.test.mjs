import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { validateKnowledgeProgress } from "../../tools/content-lint/knowledge-progress.mjs";
import { validateKnowledgeSnippets } from "../../tools/content-lint/knowledge-snippets.mjs";

const ROOT = process.cwd();
const PROGRESS_PATH = "tests/fixtures/in-memory/knowledge-progress.json";

async function readJson(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath), "utf8");
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

const progressSchema = await readJson(
  "packages/schemas/player/knowledge_progress.schema.json"
);
const evidenceSchema = await readJson(
  "packages/schemas/player/knowledge_evidence.schema.json"
);
const snippetSchema = await readJson(
  "packages/schemas/player/knowledge_snippet.schema.json"
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
const skillsWrapper = await readJson("packages/content/base/player/skills.json");
const floraWrapper = await readJson("packages/content/base/world/flora.json");
const faunaWrapper = await readJson("packages/content/base/world/fauna.json");
const mineralsWrapper = await readJson("packages/content/base/world/minerals.json");

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

function evidenceFor(snippetKey, overrides = {}) {
  const snippet = snippetFor(snippetKey);
  const sourceType = snippet.discoverySources[0].sourceType;
  const contextType =
    sourceType === "travel_observation" ? "travel_observation" : "field_observation";

  return {
    evidenceId: `knowledge_evidence.${ID_TOKENS[snippetKey]}.sample.entry_001`,
    snippetId: snippet.id,
    domainId: snippet.domainId,
    subjectType: snippet.subjectType,
    subjectId: snippet.subjectId,
    sourceType,
    sourceId: null,
    ownerScope: "character",
    ownerId: "character.test_subject",
    acquiredSequence: 1,
    acquisitionContext: {
      contextType
    },
    notes: ["Focused in-memory evidence fixture."],
    ...overrides
  };
}

function progressFor(snippetKey, overrides = {}) {
  const snippet = snippetFor(snippetKey);
  const evidence = evidenceFor(snippetKey);

  return {
    progressId: `knowledge_progress.${ID_TOKENS[snippetKey]}.sample.entry_001`,
    snippetId: snippet.id,
    domainId: snippet.domainId,
    subjectType: snippet.subjectType,
    subjectId: snippet.subjectId,
    ownerScope: "character",
    ownerId: "character.test_subject",
    progressValue: 1,
    consumedEvidenceIds: [evidence.evidenceId],
    updatedSequence: 1,
    notes: ["Focused in-memory progress fixture."],
    ...overrides
  };
}

function makeInput({
  progressRecords = [progressFor("aloe")],
  evidenceRecords = [evidenceFor("aloe")],
  allowEmptyRecords = false,
  allowZeroStateRecords = false
} = {}) {
  return {
    relativePath: PROGRESS_PATH,
    wrapper: {
      records: structuredClone(progressRecords)
    },
    progressSchema: structuredClone(progressSchema),
    evidenceSchema: structuredClone(evidenceSchema),
    snippetsWrapper: structuredClone(snippetsWrapper),
    domainRegistryWrapper: structuredClone(domainRegistryWrapper),
    evidenceWrapper: {
      records: structuredClone(evidenceRecords)
    },
    evidenceAuthorities: {
      regionsWrapper: structuredClone(regionsWrapper),
      settlementsWrapper: structuredClone(settlementsWrapper)
    },
    allowEmptyRecords,
    allowZeroStateRecords
  };
}

function validate(input = makeInput()) {
  return validateKnowledgeProgress(input);
}

function expectFailure(mutate, expected, options) {
  const input = makeInput(options);
  mutate(input);
  assert.throws(() => validate(input), expected);
}

function firstProgress(input) {
  return input.wrapper.records[0];
}

function firstEvidence(input) {
  return input.evidenceWrapper.records[0];
}

function makeSnippetValidationInput() {
  return {
    relativePath: "packages/content/base/player/knowledge_snippets.json",
    wrapper: structuredClone(snippetsWrapper),
    snippetSchema: structuredClone(snippetSchema),
    registryRecords: structuredClone(domainRegistryWrapper.records),
    subjectAuthorities: {
      flora: {
        collectionId: "world.flora",
        idPrefix: "flora.",
        records: structuredClone(floraWrapper.records)
      },
      fauna: {
        collectionId: "world.fauna",
        idPrefix: "fauna.",
        records: structuredClone(faunaWrapper.records)
      },
      mineral: {
        collectionId: "world.minerals",
        idPrefix: "mineral.",
        records: structuredClone(mineralsWrapper.records)
      },
      region: {
        collectionId: "world.regions",
        idPrefix: "region.",
        records: structuredClone(regionsWrapper.records)
      }
    },
    locationAuthorities: {
      regions: structuredClone(regionsWrapper.records),
      settlements: structuredClone(settlementsWrapper.records)
    },
    skillRecords: structuredClone(skillsWrapper.records),
    availableContentCollectionIds: new Set([
      "world.flora",
      "world.fauna",
      "world.minerals",
      "world.regions"
    ])
  };
}

test("accepts an explicitly allowed empty-state wrapper", () => {
  const input = makeInput({
    progressRecords: [],
    evidenceRecords: [],
    allowEmptyRecords: true
  });
  assert.equal(validate(input), true);
});

test("accepts an explicitly allowed zero-state Aloe record", () => {
  const input = makeInput({
    progressRecords: [
      progressFor("aloe", {
        progressValue: 0,
        consumedEvidenceIds: []
      })
    ],
    evidenceRecords: [],
    allowZeroStateRecords: true
  });
  assert.equal(validate(input), true);
});

for (const snippetKey of ["aloe", "badger", "ironOre", "kaelvar"]) {
  test(`accepts valid ${snippetKey} progress with semantically valid evidence`, () => {
    const input = makeInput({
      progressRecords: [progressFor(snippetKey)],
      evidenceRecords: [evidenceFor(snippetKey)]
    });
    assert.equal(validate(input), true);
  });
}

test("accepts one or more unique non-empty notes", () => {
  const input = makeInput();
  firstProgress(input).notes = ["First note.", "Second note."];
  assert.equal(validate(input), true);
});

test("allows semantically valid evidence that is not consumed", () => {
  const input = makeInput({
    progressRecords: [progressFor("aloe")],
    evidenceRecords: [evidenceFor("aloe"), evidenceFor("badger")]
  });
  assert.equal(validate(input), true);
});

test("returns deterministic success and failure results", () => {
  const validInput = makeInput();
  assert.equal(validate(validInput), true);
  assert.equal(validate(validInput), true);

  const invalidInput = makeInput();
  firstProgress(invalidInput).ownerId = "character.other";
  const messages = [];
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      validate(invalidInput);
    } catch (error) {
      messages.push(error.message);
    }
  }
  assert.equal(messages.length, 2);
  assert.equal(messages[0], messages[1]);
});

test("does not mutate progress, evidence, schema, or authority inputs", () => {
  const input = makeInput({
    progressRecords: [progressFor("kaelvar")],
    evidenceRecords: [evidenceFor("kaelvar")]
  });
  const before = structuredClone(input);
  assert.equal(validate(input), true);
  assert.deepEqual(input, before);
});

test("rejects a missing records wrapper", () => {
  expectFailure(
    (input) => {
      input.wrapper = {};
    },
    /wrapper must contain exactly one top-level key: records/
  );
});

test("rejects a non-object wrapper", () => {
  expectFailure(
    (input) => {
      input.wrapper = [];
    },
    /wrapper must be an object/
  );
});

test("rejects extra top-level wrapper keys", () => {
  expectFailure(
    (input) => {
      input.wrapper.version = 1;
    },
    /wrapper must contain exactly one top-level key: records/
  );
});

test("rejects an empty wrapper without allowEmptyRecords", () => {
  expectFailure(
    (input) => {
      input.wrapper.records = [];
      input.evidenceWrapper.records = [];
    },
    /records must be non-empty unless allowEmptyRecords is explicitly true/
  );
});

test("rejects structurally invalid progress before evidence or progress semantics", () => {
  expectFailure(
    (input) => {
      delete firstProgress(input).notes;
      firstProgress(input).snippetId =
        "knowledge_snippet.flora.missing.identification";
      input.evidenceWrapper = {};
    },
    /structural validation failed.*missing required property 'notes'/
  );
});

test("rejects unsupported progress schema keywords", () => {
  expectFailure(
    (input) => {
      input.progressSchema.default = {};
    },
    /knowledge progress schema \$ uses unsupported keyword 'default'/
  );
});

test("rejects duplicate progressId values", () => {
  expectFailure(
    (input) => {
      input.wrapper.records.push(structuredClone(firstProgress(input)));
    },
    /progressId value "knowledge_progress\.aloe\.sample\.entry_001" is duplicated/
  );
});

test("rejects duplicate ownerScope ownerId snippetId tuples", () => {
  expectFailure(
    (input) => {
      const duplicateIdentity = structuredClone(firstProgress(input));
      duplicateIdentity.progressId = "knowledge_progress.aloe.sample.entry_002";
      input.wrapper.records.push(duplicateIdentity);
    },
    /ownerScope\/ownerId\/snippetId value \["character","character\.test_subject","knowledge_snippet\.flora\.aloe\.identification"\] duplicates a current progress identity/
  );
});

test("rejects an unresolved snippetId with path, record, field, and value", () => {
  expectFailure(
    (input) => {
      firstProgress(input).snippetId =
        "knowledge_snippet.flora.missing.identification";
    },
    /tests\/fixtures\/in-memory\/knowledge-progress\.json snippetId value "knowledge_snippet\.flora\.missing\.identification" is unresolved on record knowledge_progress\.aloe\.sample\.entry_001/
  );
});

test("rejects progress target mismatches", async (t) => {
  const cases = [
    ["snippetId", SNIPPET_IDS.badger],
    ["domainId", "knowledge_domain.fauna"],
    ["subjectType", "fauna"],
    ["subjectId", "flora.missing"]
  ];

  for (const [field, value] of cases) {
    await t.test(field, () => {
      expectFailure(
        (input) => {
          firstProgress(input)[field] = value;
        },
        new RegExp(`${field} value .* must equal consumed evidence`)
      );
    });
  }
});

test("rejects Arcane Lore progress while its domain remains planned", () => {
  const arcaneSnippet = {
    id: "knowledge_snippet.arcane_lore.spark.identification",
    domainId: "knowledge_domain.arcane_lore",
    subjectType: "spell",
    subjectId: "spell.spark"
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
    notes: ["Synthetic zero-state fixture for planned-domain rejection."]
  };
  const input = makeInput({
    progressRecords: [arcaneProgress],
    evidenceRecords: [],
    allowZeroStateRecords: true
  });
  input.snippetsWrapper.records.push(arcaneSnippet);

  assert.throws(
    () => validate(input),
    /domainId value "knowledge_domain\.arcane_lore" must reference status 'active', not "planned"/
  );
});

test("rejects non-character ownerScope through schema validation", () => {
  expectFailure(
    (input) => {
      firstProgress(input).ownerScope = "family";
    },
    /structural validation failed.*ownerScope value "family" must be one of the schema enum values/
  );
});

test("retains character-only semantic posture if the progress schema is broadened", () => {
  expectFailure(
    (input) => {
      input.progressSchema.properties.ownerScope.enum.push("family");
      firstProgress(input).ownerScope = "family";
    },
    /ownerScope value "family" must remain 'character'/
  );
});

test("rejects invalid ownerId through schema validation", () => {
  expectFailure(
    (input) => {
      firstProgress(input).ownerId = "invalid";
    },
    /structural validation failed.*ownerId value "invalid" must match pattern/
  );
});

test("rejects an unresolved consumedEvidenceId", () => {
  expectFailure(
    (input) => {
      input.evidenceWrapper.records = [];
    },
    /consumedEvidenceIds\[0\] value "knowledge_evidence\.aloe\.sample\.entry_001" is unresolved/
  );
});

test("rejects consumed evidence that fails evidence semantic validation", () => {
  expectFailure(
    (input) => {
      firstEvidence(input).sourceType = "combat_observation";
    },
    /consumed evidence validation failed: .*sourceType value "combat_observation" is not declared by snippet/
  );
});

test("rejects consumed evidence ownerScope mismatch through evidence validation", () => {
  expectFailure(
    (input) => {
      input.evidenceSchema.properties.ownerScope.enum.push("family");
      firstEvidence(input).ownerScope = "family";
    },
    /consumed evidence validation failed: .*ownerScope value "family" must remain 'character'/
  );
});

test("rejects consumed evidence ownerId mismatch", () => {
  expectFailure(
    (input) => {
      firstEvidence(input).ownerId = "character.other";
    },
    /ownerId value "character\.test_subject" must equal consumed evidence .* value "character\.other"/
  );
});

test("rejects consumed evidence target mismatches", async (t) => {
  await t.test("snippetId", () => {
    const alternateSnippet = {
      ...structuredClone(snippetFor("aloe")),
      id: "knowledge_snippet.flora.aloe.use"
    };
    const evidence = evidenceFor("aloe", {
      evidenceId: "knowledge_evidence.aloe.use.entry_001",
      snippetId: alternateSnippet.id
    });
    const progress = progressFor("aloe", {
      consumedEvidenceIds: [evidence.evidenceId]
    });
    const input = makeInput({
      progressRecords: [progress],
      evidenceRecords: [evidence]
    });
    input.snippetsWrapper.records.push(alternateSnippet);

    assert.throws(
      () => validate(input),
      /snippetId value "knowledge_snippet\.flora\.aloe\.identification" must equal consumed evidence .* value "knowledge_snippet\.flora\.aloe\.use"/
    );
  });

  const cases = [
    ["domainId", "knowledge_domain.fauna"],
    ["subjectType", "fauna"],
    ["subjectId", "flora.missing"]
  ];

  for (const [field, value] of cases) {
    await t.test(field, () => {
      const evidence = evidenceFor("aloe");
      const progress = progressFor("aloe", {
        [field]: value,
        consumedEvidenceIds: [evidence.evidenceId]
      });
      const input = makeInput({
        progressRecords: [progress],
        evidenceRecords: [evidence]
      });

      assert.throws(
        () => validate(input),
        new RegExp(`${field} value .* must equal consumed evidence`)
      );
    });
  }
});

test("rejects the same evidence id consumed by more than one progress record", () => {
  const evidence = evidenceFor("aloe");
  const input = makeInput({
    progressRecords: [
      progressFor("aloe"),
      progressFor("badger", {
        consumedEvidenceIds: [evidence.evidenceId]
      })
    ],
    evidenceRecords: [evidence]
  });

  assert.throws(
    () => validate(input),
    /consumedEvidenceIds value "knowledge_evidence\.aloe\.sample\.entry_001" is already consumed by progressId "knowledge_progress\.aloe\.sample\.entry_001"/
  );
});

test("rejects nonzero progressValue with empty consumedEvidenceIds", () => {
  expectFailure(
    (input) => {
      firstProgress(input).consumedEvidenceIds = [];
      input.evidenceWrapper.records = [];
      input.allowZeroStateRecords = true;
    },
    /progressValue value 1 must be zero when consumedEvidenceIds is empty/
  );
});

test("rejects zero-state records without allowZeroStateRecords", () => {
  expectFailure(
    (input) => {
      firstProgress(input).progressValue = 0;
      firstProgress(input).consumedEvidenceIds = [];
      input.evidenceWrapper.records = [];
    },
    /progressValue value 0 requires allowZeroStateRecords to be explicitly true/
  );
});

test("rejects zero progressValue with consumed evidence", () => {
  expectFailure(
    (input) => {
      firstProgress(input).progressValue = 0;
    },
    /progressValue value 0 must be positive when consumedEvidenceIds is non-empty/
  );
});

test("rejects invalid notes through schema validation", async (t) => {
  const cases = [
    {
      name: "empty notes",
      value: [],
      expected: /notes must contain at least 1 items/
    },
    {
      name: "duplicate notes",
      value: ["Duplicate.", "Duplicate."],
      expected: /notes must contain unique items; duplicate value "Duplicate\."/
    },
    {
      name: "empty note",
      value: [""],
      expected: /notes\[0\] must have length at least 1/
    }
  ];

  for (const invalidCase of cases) {
    await t.test(invalidCase.name, () => {
      expectFailure(
        (input) => {
          firstProgress(input).notes = invalidCase.value;
        },
        invalidCase.expected
      );
    });
  }
});

test("rejects deferred and embedded state fields through schema validation", async (t) => {
  const cases = [
    ["progressSources", []],
    ["completed", true],
    ["trialState", "ready"],
    ["isSelected", true],
    ["generatedAt", "sequence.1"],
    ["saveSlotId", "save.slot_1"],
    ["eventId", "event.test"],
    ["characterId", "character.test_subject"],
    ["evidenceRecords", [evidenceFor("aloe")]]
  ];

  for (const [field, value] of cases) {
    await t.test(field, () => {
      expectFailure(
        (input) => {
          firstProgress(input)[field] = value;
        },
        new RegExp(`unsupported property '${field}'`)
      );
    });
  }
});

test("rejects progress fields in authored snippet JSON through existing strictness", () => {
  const input = makeSnippetValidationInput();
  input.wrapper.records[0].progressValue = 1;

  assert.throws(
    () => validateKnowledgeSnippets(input),
    /structural validation failed: records\[0\] has unsupported property 'progressValue'/
  );
});

test("rejects duplicate snippet authority ids", () => {
  expectFailure(
    (input) => {
      input.snippetsWrapper.records.push(
        structuredClone(input.snippetsWrapper.records[0])
      );
    },
    /consumed evidence validation failed: .*knowledge snippets authority has duplicate id/
  );
});

test("rejects duplicate domain authority ids", () => {
  expectFailure(
    (input) => {
      input.domainRegistryWrapper.records.push(
        structuredClone(input.domainRegistryWrapper.records[0])
      );
    },
    /consumed evidence validation failed: .*knowledge domain registry authority has duplicate id/
  );
});

test("rejects duplicate evidence ids in the supplied evidence wrapper", () => {
  expectFailure(
    (input) => {
      input.evidenceWrapper.records.push(structuredClone(firstEvidence(input)));
    },
    /consumed evidence validation failed: .*evidenceId value "knowledge_evidence\.aloe\.sample\.entry_001" is duplicated/
  );
});
