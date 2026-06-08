import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { validateKnowledgeEvidence } from "../../tools/content-lint/knowledge-evidence.mjs";

const ROOT = process.cwd();
const EVIDENCE_PATH = "tests/fixtures/in-memory/knowledge-evidence.json";

async function readJson(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath), "utf8");
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
const settlementsWrapper = await readJson("packages/content/base/world/settlements.json");

const SNIPPET_IDS = {
  aloe: "knowledge_snippet.flora.aloe.identification",
  badger: "knowledge_snippet.fauna.badger.identification",
  ironOre: "knowledge_snippet.minerals.iron_ore.identification",
  kaelvar: "knowledge_snippet.general_lore.kaelvar.cultural_context"
};

function evidenceFor(snippetKey, overrides = {}) {
  const snippet = snippetsWrapper.records.find(
    (record) => record.id === SNIPPET_IDS[snippetKey]
  );
  const evidenceSubject = snippetKey.replace(
    /[A-Z]/g,
    (letter) => `_${letter.toLowerCase()}`
  );
  const sourceType = snippet.discoverySources[0].sourceType;
  const contextType =
    sourceType === "travel_observation" ? "travel_observation" : "field_observation";

  return {
    evidenceId: `knowledge_evidence.${evidenceSubject}.sample.entry_001`,
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

function makeInput(record = evidenceFor("aloe")) {
  return {
    relativePath: EVIDENCE_PATH,
    wrapper: {
      records: [structuredClone(record)]
    },
    evidenceSchema: structuredClone(evidenceSchema),
    snippetsWrapper: structuredClone(snippetsWrapper),
    domainRegistryWrapper: structuredClone(domainRegistryWrapper),
    regionsWrapper: structuredClone(regionsWrapper),
    settlementsWrapper: structuredClone(settlementsWrapper)
  };
}

function validate(input = makeInput()) {
  return validateKnowledgeEvidence(input);
}

function expectFailure(mutate, expected, record = evidenceFor("aloe")) {
  const input = makeInput(record);
  mutate(input);
  assert.throws(() => validate(input), expected);
}

function firstRecord(input) {
  return input.wrapper.records[0];
}

function referencedSnippet(input) {
  const record = firstRecord(input);
  return input.snippetsWrapper.records.find((snippet) => snippet.id === record.snippetId);
}

function configureSource(input, sourceType, contextType) {
  const record = firstRecord(input);
  record.sourceType = sourceType;
  record.acquisitionContext = { contextType };
  referencedSnippet(input).discoverySources = [{ sourceType, sourceId: null }];
  return record;
}

test("accepts an explicitly allowed empty-state wrapper", () => {
  const input = makeInput();
  input.wrapper.records = [];
  input.allowEmptyRecords = true;
  assert.equal(validate(input), true);
});

test("rejects an empty wrapper without the explicit empty-state option", () => {
  expectFailure(
    (input) => {
      input.wrapper.records = [];
    },
    /records must be non-empty unless allowEmptyRecords is explicitly true/
  );
});

for (const snippetKey of ["aloe", "badger", "ironOre", "kaelvar"]) {
  test(`accepts valid ${snippetKey} evidence`, () => {
    const input = makeInput(evidenceFor(snippetKey));
    assert.equal(validate(input), true);
  });
}

test("accepts valid continent and region context ids", () => {
  const input = makeInput(evidenceFor("kaelvar"));
  firstRecord(input).acquisitionContext = {
    contextType: "travel_observation",
    continentId: "region.kaelvar",
    regionId: "region.verdant_thalos"
  };
  assert.equal(validate(input), true);
});

test("accepts a settlement context with matching region and continent", () => {
  const input = makeInput(evidenceFor("kaelvar"));
  firstRecord(input).acquisitionContext = {
    contextType: "travel_observation",
    continentId: "region.kaelvar",
    regionId: "region.verdant_thalos",
    settlementId: "settlement.aurelis"
  };
  assert.equal(validate(input), true);
});

test("accepts one or more unique non-empty notes", () => {
  const input = makeInput();
  firstRecord(input).notes = ["First note.", "Second note."];
  assert.equal(validate(input), true);
});

test("accepts every approved source and context pairing", async (t) => {
  const cases = [
    ["field_identification", "field_observation", "eventId"],
    ["combat_observation", "field_observation", "actionId"],
    ["travel_observation", "travel_observation", "eventId"],
    ["resource_use", "resource_use", "itemInstanceId"],
    ["crafting_use", "crafting_use", "skillId"],
    ["book_study", "study", "documentId"],
    ["scroll_study", "study", "spellId"],
    ["tome_study", "study", "actionId"],
    ["teacher_instruction", "instruction", "teacherId"],
    ["institutional_study", "instruction", "institutionId"],
    ["quest_event", "quest_event", "questOutcomeId"],
    ["chronicle_record", "chronicle_record", "chronicleRecordId"]
  ];

  for (const [sourceType, contextType, nullableField] of cases) {
    await t.test(sourceType, () => {
      const input = makeInput();
      const record = configureSource(input, sourceType, contextType);
      record.acquisitionContext[nullableField] = null;
      assert.equal(validate(input), true);
    });
  }
});

test("does not mutate evidence or authority inputs", () => {
  const input = makeInput(evidenceFor("kaelvar"));
  firstRecord(input).acquisitionContext = {
    contextType: "travel_observation",
    continentId: "region.kaelvar",
    regionId: "region.verdant_thalos",
    settlementId: "settlement.aurelis"
  };
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

test("rejects structurally invalid evidence before semantic checks", () => {
  expectFailure(
    (input) => {
      const record = firstRecord(input);
      delete record.notes;
      record.snippetId = "knowledge_snippet.flora.missing.identification";
    },
    /structural validation failed.*missing required property 'notes'/
  );
});

test("rejects unsupported evidence schema keywords", () => {
  expectFailure(
    (input) => {
      input.evidenceSchema.default = {};
    },
    /knowledge evidence schema \$ uses unsupported keyword 'default'/
  );
});

test("rejects duplicate evidenceId values", () => {
  expectFailure(
    (input) => {
      input.wrapper.records.push(structuredClone(firstRecord(input)));
    },
    /evidenceId value "knowledge_evidence\.aloe\.sample\.entry_001" is duplicated/
  );
});

test("rejects duplicate authority ids", async (t) => {
  const cases = [
    ["snippetsWrapper", "knowledge snippets"],
    ["domainRegistryWrapper", "knowledge domain registry"],
    ["regionsWrapper", "world regions"],
    ["settlementsWrapper", "world settlements"]
  ];

  for (const [wrapperName, authorityName] of cases) {
    await t.test(authorityName, () => {
      expectFailure(
        (input) => {
          input[wrapperName].records.push(structuredClone(input[wrapperName].records[0]));
        },
        new RegExp(`${authorityName} authority has duplicate id`)
      );
    });
  }
});

test("rejects an unresolved snippetId with path, record, field, and value", () => {
  expectFailure(
    (input) => {
      firstRecord(input).snippetId = "knowledge_snippet.flora.missing.identification";
    },
    /tests\/fixtures\/in-memory\/knowledge-evidence\.json snippetId value "knowledge_snippet\.flora\.missing\.identification" is unresolved on record knowledge_evidence\.aloe\.sample\.entry_001/
  );
});

test("rejects evidence snapshot mismatches", async (t) => {
  const cases = [
    ["domainId", "knowledge_domain.fauna"],
    ["subjectType", "fauna"],
    ["subjectId", "flora.missing"]
  ];

  for (const [field, value] of cases) {
    await t.test(field, () => {
      expectFailure(
        (input) => {
          firstRecord(input)[field] = value;
        },
        new RegExp(`${field} value .* must equal referenced snippet value`)
      );
    });
  }
});

test("rejects a sourceType not declared by the referenced snippet", () => {
  expectFailure(
    (input) => {
      const record = firstRecord(input);
      record.sourceType = "combat_observation";
      record.acquisitionContext.contextType = "field_observation";
    },
    /sourceType value "combat_observation" is not declared by snippet/
  );
});

test("rejects custom sourceType", () => {
  expectFailure(
    (input) => {
      const record = firstRecord(input);
      record.sourceType = "custom";
      referencedSnippet(input).discoverySources = [{ sourceType: "custom", sourceId: null }];
    },
    /sourceType value "custom" is blocked in the first validator/
  );
});

test("rejects non-null sourceId", () => {
  expectFailure(
    (input) => {
      firstRecord(input).sourceId = "observation.aloe_001";
    },
    /sourceId value "observation\.aloe_001" must remain null/
  );
});

test("rejects non-character ownerScope through schema validation", () => {
  expectFailure(
    (input) => {
      firstRecord(input).ownerScope = "family";
    },
    /structural validation failed.*ownerScope value "family" must be one of the schema enum values/
  );
});

test("rejects invalid ownerId pattern through schema validation", () => {
  expectFailure(
    (input) => {
      firstRecord(input).ownerId = "invalid";
    },
    /structural validation failed.*ownerId value "invalid" must match pattern/
  );
});

test("rejects incompatible sourceType and contextType", () => {
  expectFailure(
    (input) => {
      firstRecord(input).acquisitionContext.contextType = "study";
    },
    /acquisitionContext\.contextType value "study" must be "field_observation" for sourceType "field_identification"/
  );
});

test("rejects context fields incompatible with contextType even when null", () => {
  expectFailure(
    (input) => {
      firstRecord(input).acquisitionContext.documentId = null;
    },
    /acquisitionContext\.documentId value null is incompatible with contextType "field_observation"/
  );
});

test("rejects invalid continent, region, and settlement references", async (t) => {
  const cases = [
    {
      name: "unresolved continent",
      field: "continentId",
      value: "region.missing_continent",
      expected: /continentId value "region\.missing_continent" is unresolved/
    },
    {
      name: "non-continent continent",
      field: "continentId",
      value: "region.verdant_thalos",
      expected: /continentId value "region\.verdant_thalos" must reference regionType 'continent'/
    },
    {
      name: "unresolved region",
      field: "regionId",
      value: "region.missing_subregion",
      expected: /regionId value "region\.missing_subregion" is unresolved/
    },
    {
      name: "non-subregion region",
      field: "regionId",
      value: "region.kaelvar",
      expected: /regionId value "region\.kaelvar" must reference regionType 'subregion'/
    },
    {
      name: "unresolved settlement",
      field: "settlementId",
      value: "settlement.missing",
      expected: /settlementId value "settlement\.missing" is unresolved/
    }
  ];

  for (const locationCase of cases) {
    await t.test(locationCase.name, () => {
      expectFailure(
        (input) => {
          firstRecord(input).acquisitionContext[locationCase.field] = locationCase.value;
        },
        locationCase.expected,
        evidenceFor("kaelvar")
      );
    });
  }
});

test("rejects inconsistent location relationships", async (t) => {
  const cases = [
    {
      name: "continent and region",
      context: {
        contextType: "travel_observation",
        continentId: "region.valtherion",
        regionId: "region.verdant_thalos"
      },
      expected: /regionId value "region\.verdant_thalos" does not descend from continentId "region\.valtherion"/
    },
    {
      name: "settlement and region",
      context: {
        contextType: "travel_observation",
        regionId: "region.auric_marches",
        settlementId: "settlement.aurelis"
      },
      expected: /settlementId value "settlement\.aurelis" has regionId "region\.verdant_thalos", not "region\.auric_marches"/
    },
    {
      name: "settlement and continent",
      context: {
        contextType: "travel_observation",
        continentId: "region.valtherion",
        settlementId: "settlement.aurelis"
      },
      expected: /settlementId value "settlement\.aurelis" has macroRegionId "region\.kaelvar", not "region\.valtherion"/
    }
  ];

  for (const locationCase of cases) {
    await t.test(locationCase.name, () => {
      expectFailure(
        (input) => {
          firstRecord(input).acquisitionContext = locationCase.context;
        },
        locationCase.expected,
        evidenceFor("kaelvar")
      );
    });
  }
});

test("rejects non-null context references without selected authorities", async (t) => {
  const cases = [
    ["eventId", "field_identification", "field_observation"],
    ["actionId", "field_identification", "field_observation"],
    ["itemInstanceId", "resource_use", "resource_use"],
    ["documentId", "book_study", "study"],
    ["teacherId", "teacher_instruction", "instruction"],
    ["institutionId", "institutional_study", "instruction"],
    ["questOutcomeId", "quest_event", "quest_event"],
    ["chronicleRecordId", "chronicle_record", "chronicle_record"],
    ["skillId", "resource_use", "resource_use"],
    ["spellId", "book_study", "study"]
  ];

  for (const [field, sourceType, contextType] of cases) {
    await t.test(field, () => {
      expectFailure(
        (input) => {
          const record = configureSource(input, sourceType, contextType);
          record.acquisitionContext[field] = `${field.replace(/[A-Z]/g, "_id").toLowerCase()}.test`;
        },
        new RegExp(
          `acquisitionContext\\.${field} value .* has no selected authority and must remain null or absent`
        )
      );
    });
  }
});

test("rejects invalid notes and deferred state fields through schema validation", async (t) => {
  const cases = [
    {
      name: "empty notes",
      mutate(record) {
        record.notes = [];
      },
      expected: /notes must contain at least 1 items/
    },
    {
      name: "duplicate notes",
      mutate(record) {
        record.notes = ["Duplicate.", "Duplicate."];
      },
      expected: /notes must contain unique items; duplicate value "Duplicate\."/
    },
    {
      name: "missing notes",
      mutate(record) {
        delete record.notes;
      },
      expected: /missing required property 'notes'/
    },
    {
      name: "progress field",
      mutate(record) {
        record.progress = 1;
      },
      expected: /unsupported property 'progress' with value 1/
    },
    {
      name: "completion field",
      mutate(record) {
        record.completed = true;
      },
      expected: /unsupported property 'completed' with value true/
    },
    {
      name: "trial field",
      mutate(record) {
        record.trialState = "ready";
      },
      expected: /unsupported property 'trialState' with value "ready"/
    },
    {
      name: "UI field",
      mutate(record) {
        record.isSelected = true;
      },
      expected: /unsupported property 'isSelected' with value true/
    }
  ];

  for (const invalidCase of cases) {
    await t.test(invalidCase.name, () => {
      expectFailure(
        (input) => {
          invalidCase.mutate(firstRecord(input));
        },
        invalidCase.expected
      );
    });
  }
});

test("rejects Arcane Lore evidence while its domain remains planned", () => {
  const arcaneSnippet = {
    id: "knowledge_snippet.arcane_lore.spark.identification",
    domainId: "knowledge_domain.arcane_lore",
    subjectType: "spell",
    subjectId: "spell.spark",
    discoverySources: [{ sourceType: "book_study", sourceId: null }]
  };
  const arcaneEvidence = {
    evidenceId: "knowledge_evidence.arcane_lore.spark.study_001",
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
    notes: ["Synthetic authority fixture for planned-domain rejection."]
  };

  expectFailure(
    (input) => {
      input.snippetsWrapper.records.push(arcaneSnippet);
    },
    /domainId value "knowledge_domain\.arcane_lore" must reference status 'active', not "planned"/,
    arcaneEvidence
  );
});
