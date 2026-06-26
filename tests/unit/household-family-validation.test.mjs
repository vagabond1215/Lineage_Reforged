import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import {
  validateFamilies,
  validateHouseholds
} from "../../tools/content-lint/households-families.mjs";

const ROOT = process.cwd();
const HOUSEHOLD_PATH = "packages/content/base/civilization/households.json";
const FAMILY_PATH = "packages/content/base/civilization/families.json";

async function readJson(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath), "utf8");
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

const householdSchema = await readJson("packages/schemas/civilization/household.schema.json");
const familySchema = await readJson("packages/schemas/civilization/family.schema.json");
const regionsWrapper = await readJson("packages/content/base/world/regions.json");
const regionLocalitiesWrapper = await readJson("packages/content/base/world/region_localities.json");
const settlementsWrapper = await readJson("packages/content/base/world/settlements.json");

function household(overrides = {}) {
  return {
    id: "civilization_household.aurelis_hearth",
    slug: "aurelis_hearth",
    name: "Aurelis Hearth",
    summary: "In-memory authored household identity fixture for static validation.",
    householdForm: "shared_domestic",
    placeAnchors: [
      {
        placeType: "settlement",
        placeId: "settlement.aurelis",
        anchorRole: "domestic_base"
      }
    ],
    status: "planned",
    sourceAuthorityNotes: [
      "Fixture only; no live household content is authored by this test."
    ],
    notes: [
      "Static domestic-unit identity only; no membership, kinship, property, economy, runtime, UI, storage, command, event, reward, or gameplay behavior."
    ],
    ...overrides
  };
}

function family(overrides = {}) {
  return {
    id: "civilization_family.ashvale",
    slug: "ashvale",
    name: "Ashvale Family",
    aliases: [],
    summary: "In-memory authored family identity fixture for static validation.",
    recognitionPosture: "recognized",
    placeAssociations: [],
    status: "planned",
    sourceAuthorityNotes: [
      "Fixture only; no live family content is authored by this test."
    ],
    notes: [
      "Static recognized kin-group identity only; no account family, membership, kinship, inheritance, property, runtime, UI, storage, command, event, reward, or gameplay behavior."
    ],
    ...overrides
  };
}

function makeHouseholdInput(records = [household()], overrides = {}) {
  return {
    relativePath: HOUSEHOLD_PATH,
    wrapper: { records: structuredClone(records) },
    schema: structuredClone(householdSchema),
    regions: structuredClone(regionsWrapper.records),
    regionLocalities: structuredClone(regionLocalitiesWrapper.records),
    settlements: structuredClone(settlementsWrapper.records),
    ...overrides
  };
}

function makeFamilyInput(records = [family()], overrides = {}) {
  return {
    relativePath: FAMILY_PATH,
    wrapper: { records: structuredClone(records) },
    schema: structuredClone(familySchema),
    regions: structuredClone(regionsWrapper.records),
    regionLocalities: structuredClone(regionLocalitiesWrapper.records),
    settlements: structuredClone(settlementsWrapper.records),
    ...overrides
  };
}

function householdRecord(input) {
  return input.wrapper.records[0];
}

function familyRecord(input) {
  return input.wrapper.records[0];
}

function expectHouseholdFailure(mutate, expected) {
  const input = makeHouseholdInput();
  mutate(input);
  assert.throws(() => validateHouseholds(input), expected);
}

function expectFamilyFailure(mutate, expected) {
  const input = makeFamilyInput();
  mutate(input);
  assert.throws(() => validateFamilies(input), expected);
}

test("accepts valid household records with settlement, region, and locality anchors", async (t) => {
  const cases = [
    [
      "settlement anchor",
      {
        placeAnchors: [
          {
            placeType: "settlement",
            placeId: "settlement.aurelis",
            anchorRole: "domestic_base"
          }
        ]
      }
    ],
    [
      "region anchor",
      {
        id: "civilization_household.kaelvar_roadhouse",
        slug: "kaelvar_roadhouse",
        placeAnchors: [
          {
            placeType: "region",
            placeId: "region.kaelvar",
            anchorRole: "associated_place"
          }
        ]
      }
    ],
    [
      "locality anchor",
      {
        id: "civilization_household.verdant_bays_camp",
        slug: "verdant_bays_camp",
        householdForm: "itinerant",
        placeAnchors: [
          {
            placeType: "region_locality",
            placeId: "region_locality.verdant_thalos_coastal_bays",
            anchorRole: "domestic_base"
          }
        ]
      }
    ]
  ];

  for (const [name, overrides] of cases) {
    await t.test(name, () => {
      assert.equal(validateHouseholds(makeHouseholdInput([household(overrides)])).ok, true);
    });
  }
});

test("accepts valid family records with empty and populated aliases/place associations", async (t) => {
  await t.test("empty aliases and place associations", () => {
    assert.deepEqual(validateFamilies(makeFamilyInput()), {
      ok: true,
      familyIds: ["civilization_family.ashvale"]
    });
  });

  await t.test("region and settlement associations", () => {
    const input = makeFamilyInput([
      family({
        aliases: ["House Ashvale"],
        placeAssociations: [
          {
            placeType: "region",
            placeId: "region.kaelvar",
            associationRole: "origin_association"
          },
          {
            placeType: "settlement",
            placeId: "settlement.aurelis",
            associationRole: "public_center"
          }
        ]
      })
    ]);
    assert.equal(validateFamilies(input).ok, true);
  });
});

test("does not mutate household or family validation inputs", () => {
  const householdInput = makeHouseholdInput();
  const familyInput = makeFamilyInput();
  const beforeHousehold = structuredClone(householdInput);
  const beforeFamily = structuredClone(familyInput);

  validateHouseholds(householdInput);
  validateFamilies(familyInput);

  assert.deepEqual(householdInput, beforeHousehold);
  assert.deepEqual(familyInput, beforeFamily);
});

test("rejects invalid household wrappers and strict record failures", async (t) => {
  const cases = [
    ["non-object wrapper", (input) => { input.wrapper = null; }, /wrapper must be an object/],
    ["extra wrapper key", (input) => { input.wrapper.version = 1; }, /exactly one top-level key/],
    ["missing records", (input) => { input.wrapper = {}; }, /exactly one top-level key/],
    ["non-array records", (input) => { input.wrapper.records = {}; }, /records must be an array/],
    ["empty records", (input) => { input.wrapper.records = []; }, /records must be non-empty/],
    [
      "unsupported runtime field",
      (input) => { householdRecord(input).runtimeState = {}; },
      /structural validation failed: wrapper\.records\[0\] has unsupported property 'runtimeState'/
    ]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectHouseholdFailure(mutate, expected));
  }
});

test("rejects invalid family wrappers and strict record failures", async (t) => {
  const cases = [
    ["non-object wrapper", (input) => { input.wrapper = null; }, /wrapper must be an object/],
    ["extra wrapper key", (input) => { input.wrapper.version = 1; }, /exactly one top-level key/],
    ["missing records", (input) => { input.wrapper = {}; }, /exactly one top-level key/],
    ["non-array records", (input) => { input.wrapper.records = {}; }, /records must be an array/],
    ["empty records", (input) => { input.wrapper.records = []; }, /records must be non-empty/],
    [
      "unsupported account field",
      (input) => { familyRecord(input).rootCharacterId = "character.root"; },
      /structural validation failed: wrapper\.records\[0\] has unsupported property 'rootCharacterId'/
    ]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFamilyFailure(mutate, expected));
  }
});

test("rejects household identity and vocabulary failures", async (t) => {
  await t.test("duplicate household id", () => {
    expectHouseholdFailure(
      (input) => { input.wrapper.records.push(structuredClone(householdRecord(input))); },
      /duplicate household id 'civilization_household\.aurelis_hearth'/
    );
  });
  await t.test("duplicate household slug", () => {
    expectHouseholdFailure(
      (input) => {
        const duplicate = structuredClone(householdRecord(input));
        duplicate.id = "civilization_household.other_hearth";
        input.wrapper.records.push(duplicate);
      },
      /duplicate household slug 'aurelis_hearth'/
    );
  });
  await t.test("id slug mismatch", () => {
    expectHouseholdFailure(
      (input) => { householdRecord(input).slug = "other_hearth"; },
      /id must equal civilization_household\.other_hearth/
    );
  });
  await t.test("synthetic household namespace", () => {
    expectHouseholdFailure(
      (input) => { householdRecord(input).id = "household.aurelis.market"; },
      /id must match pattern/
    );
  });
  await t.test("invalid lifecycle status", () => {
    expectHouseholdFailure(
      (input) => { householdRecord(input).status = "dormant"; },
      /status must be one of the schema enum values/
    );
  });
  await t.test("invalid household form", () => {
    expectHouseholdFailure(
      (input) => { householdRecord(input).householdForm = "estate"; },
      /householdForm must be one of the schema enum values/
    );
  });
  await t.test("empty place anchors", () => {
    expectHouseholdFailure(
      (input) => { householdRecord(input).placeAnchors = []; },
      /placeAnchors must contain at least 1 items/
    );
  });
  await t.test("duplicate place anchors", () => {
    expectHouseholdFailure(
      (input) => {
        householdRecord(input).placeAnchors.push(structuredClone(householdRecord(input).placeAnchors[0]));
      },
      /placeAnchors must contain unique items/
    );
  });
});

test("rejects family identity and vocabulary failures", async (t) => {
  await t.test("duplicate family id", () => {
    expectFamilyFailure(
      (input) => { input.wrapper.records.push(structuredClone(familyRecord(input))); },
      /duplicate family id 'civilization_family\.ashvale'/
    );
  });
  await t.test("duplicate family slug", () => {
    expectFamilyFailure(
      (input) => {
        const duplicate = structuredClone(familyRecord(input));
        duplicate.id = "civilization_family.other";
        input.wrapper.records.push(duplicate);
      },
      /duplicate family slug 'ashvale'/
    );
  });
  await t.test("id slug mismatch", () => {
    expectFamilyFailure(
      (input) => { familyRecord(input).slug = "other_family"; },
      /id must equal civilization_family\.other_family/
    );
  });
  await t.test("mutable account family namespace", () => {
    expectFamilyFailure(
      (input) => { familyRecord(input).id = "family.ashvale"; },
      /id must match pattern/
    );
  });
  await t.test("invalid lifecycle status", () => {
    expectFamilyFailure(
      (input) => { familyRecord(input).status = "closed"; },
      /status must be one of the schema enum values/
    );
  });
  await t.test("invalid recognition posture", () => {
    expectFamilyFailure(
      (input) => { familyRecord(input).recognitionPosture = "legitimate"; },
      /recognitionPosture must be one of the schema enum values/
    );
  });
  await t.test("duplicate aliases", () => {
    expectFamilyFailure(
      (input) => { familyRecord(input).aliases = ["Ashvale", "Ashvale"]; },
      /aliases must contain unique items/
    );
  });
  await t.test("duplicate place associations", () => {
    expectFamilyFailure(
      (input) => {
        familyRecord(input).placeAssociations = [
          {
            placeType: "settlement",
            placeId: "settlement.aurelis",
            associationRole: "public_center"
          },
          {
            placeType: "settlement",
            placeId: "settlement.aurelis",
            associationRole: "public_center"
          }
        ];
      },
      /placeAssociations must contain unique items/
    );
  });
});

test("rejects malformed, unresolved, inactive, and free-form household place anchors", async (t) => {
  const cases = [
    [
      "invalid place type",
      [{ placeType: "sacred_site", placeId: "sacred_site.sunwell", anchorRole: "domestic_base" }],
      /placeType must be one of the schema enum values/
    ],
    [
      "invalid anchor role",
      [{ placeType: "settlement", placeId: "settlement.aurelis", anchorRole: "public_center" }],
      /anchorRole must be one of the schema enum values/
    ],
    [
      "missing region",
      [{ placeType: "region", placeId: "region.missing", anchorRole: "associated_place" }],
      /placeAnchor region 'region\.missing' is missing or inactive/
    ],
    [
      "missing region locality",
      [{ placeType: "region_locality", placeId: "region_locality.missing", anchorRole: "domestic_base" }],
      /placeAnchor region_locality 'region_locality\.missing' is missing or inactive/
    ],
    [
      "missing settlement",
      [{ placeType: "settlement", placeId: "settlement.missing", anchorRole: "domestic_base" }],
      /placeAnchor settlement 'settlement\.missing' is missing or inactive/
    ],
    [
      "synthetic household id is not a settlement",
      [{ placeType: "settlement", placeId: "household.aurelis.market", anchorRole: "domestic_base" }],
      /placeAnchor settlement 'household\.aurelis\.market' is missing or inactive/
    ],
    [
      "account family id is not a region",
      [{ placeType: "region", placeId: "family.ashvale", anchorRole: "associated_place" }],
      /placeAnchor region 'family\.ashvale' is missing or inactive/
    ],
    [
      "lineage id is not a locality",
      [{ placeType: "region_locality", placeId: "lineage.human", anchorRole: "associated_place" }],
      /placeAnchor region_locality 'lineage\.human' is missing or inactive/
    ],
    [
      "character id is not a settlement",
      [{ placeType: "settlement", placeId: "character.root", anchorRole: "domestic_base" }],
      /placeAnchor settlement 'character\.root' is missing or inactive/
    ],
    [
      "synthetic operator id is not a settlement",
      [{ placeType: "settlement", placeId: "operator.household.aurelis", anchorRole: "domestic_base" }],
      /placeAnchor settlement 'operator\.household\.aurelis' is missing or inactive/
    ]
  ];

  for (const [name, placeAnchors, expected] of cases) {
    await t.test(name, () => {
      expectHouseholdFailure(
        (input) => { householdRecord(input).placeAnchors = placeAnchors; },
        expected
      );
    });
  }

  await t.test("active record fails on planned place authority", () => {
    expectHouseholdFailure(
      (input) => {
        householdRecord(input).status = "active";
        householdRecord(input).placeAnchors = [
          {
            placeType: "region",
            placeId: "region.kaelvar",
            anchorRole: "associated_place"
          }
        ];
        input.regions[0].status = "planned";
      },
      /placeAnchor region 'region\.kaelvar' is missing or inactive/
    );
  });

  await t.test("active record fails on retired place authority", () => {
    expectHouseholdFailure(
      (input) => {
        householdRecord(input).status = "active";
        householdRecord(input).placeAnchors = [
          {
            placeType: "region",
            placeId: "region.kaelvar",
            anchorRole: "associated_place"
          }
        ];
        input.regions[0].status = "retired";
      },
      /placeAnchor region 'region\.kaelvar' is missing or inactive/
    );
  });
});

test("rejects malformed, unresolved, inactive, and free-form family place associations", async (t) => {
  const cases = [
    [
      "invalid place type",
      [{ placeType: "polity", placeId: "polity.kaelvar_crown", associationRole: "origin_association" }],
      /placeType must be one of the schema enum values/
    ],
    [
      "invalid association role",
      [{ placeType: "settlement", placeId: "settlement.aurelis", associationRole: "domestic_base" }],
      /associationRole must be one of the schema enum values/
    ],
    [
      "missing region",
      [{ placeType: "region", placeId: "region.missing", associationRole: "origin_association" }],
      /placeAssociation region 'region\.missing' is missing or inactive/
    ],
    [
      "missing region locality",
      [{ placeType: "region_locality", placeId: "region_locality.missing", associationRole: "historical_association" }],
      /placeAssociation region_locality 'region_locality\.missing' is missing or inactive/
    ],
    [
      "missing settlement",
      [{ placeType: "settlement", placeId: "settlement.missing", associationRole: "public_center" }],
      /placeAssociation settlement 'settlement\.missing' is missing or inactive/
    ],
    [
      "authored family id is not a settlement",
      [{ placeType: "settlement", placeId: "civilization_family.ashvale", associationRole: "public_center" }],
      /placeAssociation settlement 'civilization_family\.ashvale' is missing or inactive/
    ],
    [
      "mutable family id is not a region",
      [{ placeType: "region", placeId: "family.ashvale", associationRole: "origin_association" }],
      /placeAssociation region 'family\.ashvale' is missing or inactive/
    ],
    [
      "account family bridge id is not a settlement",
      [{ placeType: "settlement", placeId: "account_family.ashvale", associationRole: "public_center" }],
      /placeAssociation settlement 'account_family\.ashvale' is missing or inactive/
    ]
  ];

  for (const [name, placeAssociations, expected] of cases) {
    await t.test(name, () => {
      expectFamilyFailure(
        (input) => { familyRecord(input).placeAssociations = placeAssociations; },
        expected
      );
    });
  }

  await t.test("active record fails on planned place authority", () => {
    expectFamilyFailure(
      (input) => {
        familyRecord(input).status = "active";
        familyRecord(input).placeAssociations = [
          {
            placeType: "region",
            placeId: "region.kaelvar",
            associationRole: "origin_association"
          }
        ];
        input.regions[0].status = "planned";
      },
      /placeAssociation region 'region\.kaelvar' is missing or inactive/
    );
  });

  await t.test("active record fails on retired place authority", () => {
    expectFamilyFailure(
      (input) => {
        familyRecord(input).status = "active";
        familyRecord(input).placeAssociations = [
          {
            placeType: "region",
            placeId: "region.kaelvar",
            associationRole: "origin_association"
          }
        ];
        input.regions[0].status = "retired";
      },
      /placeAssociation region 'region\.kaelvar' is missing or inactive/
    );
  });
});

test("rejects account, lineage, kinship, estate, economy, Knowledge, runtime, and gameplay fields", async (t) => {
  const forbiddenFields = [
    "accountFamilyId",
    "sourceRunId",
    "rootCharacterId",
    "Prestige",
    "prestigeBalance",
    "lineageId",
    "ancestorIds",
    "bloodlineId",
    "memberIds",
    "personIds",
    "householdIds",
    "familyIds",
    "householdMembershipIds",
    "familyMembershipIds",
    "kinshipLinkIds",
    "founderId",
    "spouseIds",
    "childIds",
    "guardianIds",
    "adoptionRecords",
    "fosterageRecords",
    "estateId",
    "propertyIds",
    "ownerOperatorId",
    "inheritanceRules",
    "succession",
    "marriageRecords",
    "offspringRules",
    "employmentIds",
    "workplaceIds",
    "serviceIds",
    "income",
    "legalStatus",
    "propertyLegalStatus",
    "knowledgeRefs",
    "religionIds",
    "polityIds",
    "lawIds",
    "questIds",
    "travelRefs",
    "magicStudyRefs",
    "itemRefs",
    "runtimeState",
    "uiState",
    "storageState",
    "commandRefs",
    "eventRefs",
    "rewardRefs",
    "gameplayEffects"
  ];

  for (const field of forbiddenFields) {
    await t.test(`household ${field}`, () => {
      expectHouseholdFailure(
        (input) => { householdRecord(input)[field] = {}; },
        new RegExp(`unsupported property '${field}'`)
      );
    });
    await t.test(`family ${field}`, () => {
      expectFamilyFailure(
        (input) => { familyRecord(input)[field] = {}; },
        new RegExp(`unsupported property '${field}'`)
      );
    });
  }
});

test("schemas are registered while live content and normal lint registration remain absent", async () => {
  const schemaTestSource = await readFile(path.join(ROOT, "tests/unit/schema-files.test.mjs"), "utf8");
  const contentLintSource = await readFile(path.join(ROOT, "tools/content-lint/index.mjs"), "utf8");

  assert.match(schemaTestSource, /packages\/schemas\/civilization\/household\.schema\.json/);
  assert.match(schemaTestSource, /packages\/schemas\/civilization\/family\.schema\.json/);
  assert.equal(existsSync(path.join(ROOT, HOUSEHOLD_PATH)), false);
  assert.equal(existsSync(path.join(ROOT, FAMILY_PATH)), false);
  assert.doesNotMatch(contentLintSource, /households\.json/);
  assert.doesNotMatch(contentLintSource, /families\.json/);
  assert.doesNotMatch(contentLintSource, /households-families\.mjs/);
});
