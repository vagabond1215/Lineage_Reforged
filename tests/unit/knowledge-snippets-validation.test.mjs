import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { validateKnowledgeSnippets } from "../../tools/content-lint/knowledge-snippets.mjs";

const ROOT = process.cwd();
const SNIPPET_PATH = "packages/content/base/player/knowledge_snippets.json";

async function readJson(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath), "utf8");
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

const snippetWrapper = await readJson(SNIPPET_PATH);
const snippetSchema = await readJson("packages/schemas/player/knowledge_snippet.schema.json");
const registryWrapper = await readJson(
  "packages/content/base/player/knowledge_domain_registry.json"
);
const skillsWrapper = await readJson("packages/content/base/player/skills.json");
const floraWrapper = await readJson("packages/content/base/world/flora.json");
const faunaWrapper = await readJson("packages/content/base/world/fauna.json");
const mineralWrapper = await readJson("packages/content/base/world/minerals.json");
const religionWrapper = await readJson("packages/content/base/world/religions.json");
const regionWrapper = await readJson("packages/content/base/world/regions.json");
const settlementWrapper = await readJson("packages/content/base/world/settlements.json");
const deityRecords = religionWrapper.records.flatMap((religion) => religion.deities ?? []);

const ACTIVE_DOMAIN_IDS = [
  "knowledge_domain.flora",
  "knowledge_domain.fauna",
  "knowledge_domain.minerals",
  "knowledge_domain.ecology",
  "knowledge_domain.ecology",
  "knowledge_domain.ecology",
  "knowledge_domain.general_lore"
];

const EXPECTED_SNIPPET_IDS = [
  "knowledge_snippet.flora.aloe.identification",
  "knowledge_snippet.fauna.badger.identification",
  "knowledge_snippet.minerals.iron_ore.identification",
  "knowledge_snippet.ecology.kaelvar.regional_variant",
  "knowledge_snippet.ecology.sheep.seasonality",
  "knowledge_snippet.ecology.grape_vine.habitat",
  "knowledge_snippet.general_lore.kaelvar.cultural_context"
];

function makeInput() {
  return {
    relativePath: SNIPPET_PATH,
    wrapper: structuredClone(snippetWrapper),
    snippetSchema: structuredClone(snippetSchema),
    registryRecords: structuredClone(registryWrapper.records),
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
        records: structuredClone(mineralWrapper.records)
      },
      religion: {
        collectionId: "world.religions",
        idPrefix: "religion.",
        records: structuredClone(religionWrapper.records)
      },
      deity: {
        collectionId: "world.religions",
        idPrefix: "deity.",
        records: structuredClone(deityRecords)
      },
      region: {
        collectionId: "world.regions",
        idPrefix: "region.",
        records: structuredClone(regionWrapper.records)
      }
    },
    locationAuthorities: {
      regions: structuredClone(regionWrapper.records),
      settlements: structuredClone(settlementWrapper.records)
    },
    skillRecords: structuredClone(skillsWrapper.records),
    availableContentCollectionIds: new Set([
      "world.flora",
      "world.fauna",
      "world.minerals",
      "world.religions",
      "world.regions"
    ])
  };
}

function validate(input = makeInput()) {
  return validateKnowledgeSnippets(input);
}

function expectFailure(mutate, expected) {
  const input = makeInput();
  mutate(input);
  assert.throws(() => validate(input), expected);
}

function snippet(input, id = EXPECTED_SNIPPET_IDS[0]) {
  return input.wrapper.records.find((record) => record.id === id);
}

function religionDomain(input) {
  return input.registryRecords.find(
    (record) => record.id === "knowledge_domain.religion"
  );
}

function activateReligionDomain(input) {
  religionDomain(input).status = "active";
}

function religionSnippet({
  id = "knowledge_snippet.religion.elemental_pantheon.identification",
  subjectType = "religion",
  subjectId = "religion.elemental_pantheon",
  title = "Recognizing the Elemental Pantheon"
} = {}) {
  return {
    id,
    domainId: "knowledge_domain.religion",
    subjectType,
    subjectId,
    tier: 1,
    category: "identification",
    title,
    summary: "The Elemental Pantheon is recognized as a balanced faith tradition centered on paired elemental opposition and cyclical dominance.",
    discoverySources: [
      {
        sourceType: "book_study",
        sourceId: null
      }
    ],
    progression: {
      completionWeight: 1,
      countsTowardTierCompletion: true,
      trialUnlockWeight: 0
    },
    visibility: {
      lockedUntilDiscovered: true,
      revealsSubjectIdentity: true,
      hiddenSummary: "An unidentified faith tradition remains to be understood."
    },
    notes: [
      "Religion snippets remain authored knowledge only and do not grant worship, favor, faction, magic, or runtime behavior."
    ]
  };
}

test("accepts the current seven-record snippet catalog", () => {
  const input = makeInput();
  assert.deepEqual(
    input.wrapper.records.map((record) => record.id),
    EXPECTED_SNIPPET_IDS
  );
  assert.equal(validate(input), true);
});

test("accepts active Flora, Fauna, Minerals, Ecology, and General Lore domains", () => {
  const input = makeInput();
  assert.deepEqual(
    input.wrapper.records.map((record) => record.domainId),
    ACTIVE_DOMAIN_IDS
  );
  assert.equal(validate(input), true);
});

test("accepts current canonical subject ids", () => {
  const input = makeInput();
  assert.deepEqual(
    input.wrapper.records.map((record) => record.subjectId),
    [
      "flora.aloe",
      "fauna.badger",
      "mineral.iron_ore",
      "region.kaelvar",
      "fauna.sheep",
      "flora.grape_vine",
      "region.kaelvar"
    ]
  );
  assert.equal(validate(input), true);
});

test("accepts an active Religion fixture with religion and deity authorities", () => {
  const input = makeInput();
  activateReligionDomain(input);
  input.wrapper.records = [
    religionSnippet(),
    religionSnippet({
      id: "knowledge_snippet.religion.light_lady.identification",
      subjectType: "deity",
      subjectId: "deity.light_lady",
      title: "Recognizing the Lady of Light"
    })
  ];

  assert.equal(validate(input), true);
});

test("keeps Religion snippets blocked while the domain remains planned", () => {
  expectFailure(
    (input) => {
      input.wrapper.records = [religionSnippet()];
    },
    /domainId 'knowledge_domain\.religion' must reference status 'active'/
  );
});

test("accepts null sourceId values", () => {
  const input = makeInput();
  assert.ok(
    input.wrapper.records.every((record) =>
      record.discoverySources.every((source) => source.sourceId === null)
    )
  );
  assert.equal(validate(input), true);
});

test("accepts records with no prerequisites", () => {
  const input = makeInput();
  assert.ok(input.wrapper.records.every((record) => record.prerequisites === undefined));
  assert.equal(validate(input), true);
});

test("accepts known subregion and settlement location ids", () => {
  const input = makeInput();
  const subregion = input.locationAuthorities.regions.find(
    (record) => record.regionType === "subregion"
  );
  const settlement = input.locationAuthorities.settlements[0];
  const source = snippet(
    input,
    "knowledge_snippet.general_lore.kaelvar.cultural_context"
  ).discoverySources[0];

  source.locationScope.regionId = subregion.id;
  source.locationScope.settlementId = settlement.id;
  assert.equal(validate(input), true);
});

test("rejects a missing records wrapper", () => {
  expectFailure(
    (input) => {
      input.wrapper = {};
    },
    /wrapper must contain exactly one top-level key: records/
  );
});

test("rejects a non-object top-level wrapper", () => {
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

test("rejects non-array records", () => {
  expectFailure(
    (input) => {
      input.wrapper.records = {};
    },
    /records must be an array/
  );
});

test("rejects empty records", () => {
  expectFailure(
    (input) => {
      input.wrapper.records = [];
    },
    /records must be non-empty/
  );
});

test("rejects a structurally invalid record before semantic checks", () => {
  expectFailure(
    (input) => {
      const record = snippet(input);
      delete record.title;
      record.domainId = "knowledge_domain.missing";
    },
    /structural validation failed: records\[0\] is missing required property 'title'/
  );
});

test("rejects unsupported snippet schema keywords", () => {
  expectFailure(
    (input) => {
      input.snippetSchema.default = {};
    },
    /knowledge snippet schema \$ uses unsupported keyword 'default'/
  );
});

test("enforces snippet schema numeric bounds and finite values", async (t) => {
  const cases = [
    {
      name: "maximum tier",
      mutate(record) {
        record.tier = 11;
      },
      expected: /records\[0\]\.tier must be at most 10/
    },
    {
      name: "non-negative completion weight",
      mutate(record) {
        record.progression.completionWeight = -1;
      },
      expected: /records\[0\]\.progression\.completionWeight must be at least 0/
    },
    {
      name: "finite trial unlock weight",
      mutate(record) {
        record.progression.trialUnlockWeight = Number.NaN;
      },
      expected: /records\[0\]\.progression\.trialUnlockWeight must be type number/
    }
  ];

  for (const numericCase of cases) {
    await t.test(numericCase.name, () => {
      expectFailure(
        (input) => {
          numericCase.mutate(snippet(input));
        },
        numericCase.expected
      );
    });
  }
});

test("rejects duplicate snippet ids", () => {
  expectFailure(
    (input) => {
      input.wrapper.records[1].id = input.wrapper.records[0].id;
    },
    /duplicate snippet id 'knowledge_snippet\.flora\.aloe\.identification'/
  );
});

test("rejects an unresolved domainId", () => {
  expectFailure(
    (input) => {
      snippet(input).domainId = "knowledge_domain.missing";
    },
    /domainId 'knowledge_domain\.missing' is missing/
  );
});

test("rejects a planned domainId including Arcane Lore", () => {
  expectFailure(
    (input) => {
      snippet(input).domainId = "knowledge_domain.arcane_lore";
    },
    /domainId 'knowledge_domain\.arcane_lore' must reference status 'active'/
  );
});

test("rejects a subjectType not supported by the domain", () => {
  expectFailure(
    (input) => {
      const record = snippet(input);
      record.subjectType = "fauna";
      record.subjectId = "fauna.badger";
    },
    /subjectType 'fauna' is not supported by domain knowledge_domain\.flora/
  );
});

test("rejects a category not supported by the domain", () => {
  expectFailure(
    (input) => {
      snippet(input).category = "behavior";
    },
    /category 'behavior' is not supported by domain knowledge_domain\.flora/
  );
});

test("rejects a sourceType not supported by the domain", () => {
  expectFailure(
    (input) => {
      snippet(input).discoverySources[0].sourceType = "combat_observation";
    },
    /discovery sourceType 'combat_observation' is not supported by domain knowledge_domain\.flora/
  );
});

test("rejects an unresolved subjectId", () => {
  expectFailure(
    (input) => {
      snippet(input).subjectId = "flora.missing";
    },
    /subjectId 'flora\.missing' is missing from world\.flora/
  );
});

test("rejects a subjectId prefix mismatch", () => {
  expectFailure(
    (input) => {
      snippet(input).subjectId = "fauna.badger";
    },
    /subjectId 'fauna\.badger' must use prefix 'flora\.'/
  );
});

test("rejects unresolved religion and deity subject ids", async (t) => {
  const cases = [
    {
      name: "religion",
      record: religionSnippet({ subjectId: "religion.missing" }),
      expected: /subjectId 'religion\.missing' is missing from world\.religions/
    },
    {
      name: "deity",
      record: religionSnippet({
        id: "knowledge_snippet.religion.missing_deity.identification",
        subjectType: "deity",
        subjectId: "deity.missing"
      }),
      expected: /subjectId 'deity\.missing' is missing from world\.religions/
    }
  ];

  for (const authorityCase of cases) {
    await t.test(authorityCase.name, () => {
      expectFailure(
        (input) => {
          activateReligionDomain(input);
          input.wrapper.records = [authorityCase.record];
        },
        authorityCase.expected
      );
    });
  }
});

test("rejects duplicate religion and deity authority ids", async (t) => {
  const cases = [
    {
      name: "religion",
      subjectType: "religion",
      record: religionSnippet(),
      duplicate() {
        return structuredClone(religionWrapper.records[0]);
      },
      expected: /religion subject authority has duplicate id 'religion\.elemental_pantheon'/
    },
    {
      name: "deity",
      subjectType: "deity",
      record: religionSnippet({
        id: "knowledge_snippet.religion.light_lady.identification",
        subjectType: "deity",
        subjectId: "deity.light_lady"
      }),
      duplicate() {
        return structuredClone(deityRecords[0]);
      },
      expected: /deity subject authority has duplicate id 'deity\.light_lady'/
    }
  ];

  for (const authorityCase of cases) {
    await t.test(authorityCase.name, () => {
      expectFailure(
        (input) => {
          activateReligionDomain(input);
          input.wrapper.records = [authorityCase.record];
          input.subjectAuthorities[authorityCase.subjectType].records.push(
            authorityCase.duplicate()
          );
        },
        authorityCase.expected
      );
    });
  }
});

test("rejects malformed religion and deity authority records without canonical ids", async (t) => {
  const cases = [
    {
      name: "religion",
      subjectType: "religion",
      record: religionSnippet(),
      expected: /religion subject authority records\[1\] must provide a canonical id/
    },
    {
      name: "deity",
      subjectType: "deity",
      record: religionSnippet({
        id: "knowledge_snippet.religion.light_lady.identification",
        subjectType: "deity",
        subjectId: "deity.light_lady"
      }),
      expected: /deity subject authority records\[8\] must provide a canonical id/
    }
  ];

  for (const authorityCase of cases) {
    await t.test(authorityCase.name, () => {
      expectFailure(
        (input) => {
          activateReligionDomain(input);
          input.wrapper.records = [authorityCase.record];
          input.subjectAuthorities[authorityCase.subjectType].records.push({
            name: "Missing Canonical Id"
          });
        },
        authorityCase.expected
      );
    });
  }
});

test("rejects blocked subject types without authority", () => {
  expectFailure(
    (input) => {
      const record = snippet(
        input,
        "knowledge_snippet.general_lore.kaelvar.cultural_context"
      );
      record.subjectType = "settlement";
      record.subjectId = "settlement.aurelis";
    },
    /subjectType 'settlement' is blocked in the first validator/
  );
});

test("rejects a domain missing the subject authority collection", () => {
  expectFailure(
    (input) => {
      const domain = input.registryRecords.find(
        (record) => record.id === "knowledge_domain.flora"
      );
      domain.relatedContentCollections = domain.relatedContentCollections.filter(
        (collectionId) => collectionId !== "world.flora"
      );
    },
    /domain knowledge_domain\.flora must include 'world\.flora'/
  );
});

test("rejects a subject collection absent from current base content ids", () => {
  expectFailure(
    (input) => {
      input.availableContentCollectionIds.delete("world.flora");
    },
    /subject collection 'world\.flora' is not a current base content collection/
  );
});

test("rejects non-null sourceId", () => {
  expectFailure(
    (input) => {
      snippet(input).discoverySources[0].sourceId = "flora.aloe";
    },
    /sourceId must remain null/
  );
});

test("rejects duplicate discovery source declarations regardless of key order", () => {
  expectFailure(
    (input) => {
      snippet(input).discoverySources.push({
        sourceId: null,
        sourceType: "field_identification"
      });
    },
    /duplicate discovery source declarations/
  );
});

test("rejects empty discoverySources", () => {
  expectFailure(
    (input) => {
      snippet(input).discoverySources = [];
    },
    /discoverySources must contain at least 1 items/
  );
});

test("rejects invalid continent, region, and settlement location ids", async (t) => {
  const generalLoreId = "knowledge_snippet.general_lore.kaelvar.cultural_context";
  const subregion = regionWrapper.records.find((record) => record.regionType === "subregion");

  const cases = [
    {
      name: "unknown continent",
      mutate(scope) {
        scope.continentId = "region.missing_continent";
      },
      expected: /continentId 'region\.missing_continent' is missing/
    },
    {
      name: "continent with subregion type",
      mutate(scope) {
        scope.continentId = subregion.id;
      },
      expected: /continentId '.+' must reference regionType 'continent'/
    },
    {
      name: "unknown region",
      mutate(scope) {
        scope.regionId = "region.missing_subregion";
      },
      expected: /regionId 'region\.missing_subregion' is missing/
    },
    {
      name: "region with continent type",
      mutate(scope) {
        scope.regionId = "region.kaelvar";
      },
      expected: /regionId 'region\.kaelvar' must reference regionType 'subregion'/
    },
    {
      name: "unknown settlement",
      mutate(scope) {
        scope.settlementId = "settlement.missing";
      },
      expected: /settlementId 'settlement\.missing' is missing/
    }
  ];

  for (const locationCase of cases) {
    await t.test(locationCase.name, () => {
      expectFailure(
        (input) => {
          const scope = snippet(input, generalLoreId).discoverySources[0].locationScope;
          locationCase.mutate(scope);
        },
        locationCase.expected
      );
    });
  }
});

test("rejects lockedUntilDiscovered true without hiddenSummary", () => {
  expectFailure(
    (input) => {
      delete snippet(input).visibility.hiddenSummary;
    },
    /visibility\.hiddenSummary is required when lockedUntilDiscovered is true/
  );
});

test("rejects prerequisite snippet self-reference", () => {
  expectFailure(
    (input) => {
      const record = snippet(input);
      record.prerequisites = { requiredSnippetIds: [record.id] };
    },
    /prerequisite snippet self-reference/
  );
});

test("rejects prerequisite snippet cycles", () => {
  expectFailure(
    (input) => {
      const first = input.wrapper.records[0];
      const second = input.wrapper.records[1];
      first.prerequisites = { requiredSnippetIds: [second.id] };
      second.prerequisites = { requiredSnippetIds: [first.id] };
    },
    /prerequisite cycle detected:/
  );
});

test("rejects an unresolved prerequisite snippet id", () => {
  expectFailure(
    (input) => {
      snippet(input).prerequisites = {
        requiredSnippetIds: ["knowledge_snippet.flora.missing.identification"]
      };
    },
    /prerequisite snippet id 'knowledge_snippet\.flora\.missing\.identification' is missing/
  );
});

test("rejects an unresolved prerequisite skill id", () => {
  expectFailure(
    (input) => {
      snippet(input).prerequisites = {
        requiredSkillRanks: [
          {
            skillId: "skill.knowledge.missing",
            minimumRank: 1
          }
        ]
      };
    },
    /prerequisite skill id 'skill\.knowledge\.missing' is missing/
  );
});

test("rejects duplicate and conflicting prerequisite skill ranks", () => {
  expectFailure(
    (input) => {
      snippet(input).prerequisites = {
        requiredSkillRanks: [
          {
            skillId: "skill.knowledge.general_lore",
            minimumRank: 1
          },
          {
            skillId: "skill.knowledge.general_lore",
            minimumRank: 2
          }
        ]
      };
    },
    /duplicate prerequisite skill id 'skill\.knowledge\.general_lore'/
  );
});

test("rejects an empty prerequisites object", () => {
  expectFailure(
    (input) => {
      snippet(input).prerequisites = {};
    },
    /prerequisites must be omitted when empty/
  );
});

test("rejects custom subject, category, and source values", async (t) => {
  const generalLoreId = "knowledge_snippet.general_lore.kaelvar.cultural_context";
  const cases = [
    {
      name: "subject",
      mutate(record) {
        record.subjectType = "custom";
        record.subjectId = "custom.kaelvar";
      },
      expected: /subjectType 'custom' is blocked/
    },
    {
      name: "category",
      mutate(record) {
        record.category = "custom";
      },
      expected: /category 'custom' is blocked/
    },
    {
      name: "source",
      mutate(record) {
        record.discoverySources[0].sourceType = "custom";
      },
      expected: /sourceType 'custom' is blocked/
    }
  ];

  for (const customCase of cases) {
    await t.test(customCase.name, () => {
      expectFailure(
        (input) => {
          customCase.mutate(snippet(input, generalLoreId));
        },
        customCase.expected
      );
    });
  }
});

test("rejects runtime and player-state fields", () => {
  expectFailure(
    (input) => {
      snippet(input).currentProgress = 50;
    },
    /structural validation failed: records\[0\] has unsupported property 'currentProgress'/
  );
});
