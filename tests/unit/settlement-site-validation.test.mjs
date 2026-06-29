import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { validateSettlementSites } from "../../tools/content-lint/settlement-sites.mjs";

const ROOT = process.cwd();
const SETTLEMENT_SITE_PATH = "packages/content/base/world/settlement_sites.json";
const SETTLEMENT_DISTRICT_PATH = "packages/content/base/world/settlement_districts.json";
const SCHEMA_PATH = "packages/schemas/world/settlement-site.schema.json";
const VALIDATOR_PATH = "tools/content-lint/settlement-sites.mjs";
const TEST_PATH = "tests/unit/settlement-site-validation.test.mjs";

async function readJson(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath), "utf8");
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

const schema = await readJson(SCHEMA_PATH);
const settlementsWrapper = await readJson("packages/content/base/world/settlements.json");

function settlementSite(overrides = {}) {
  return {
    id: "settlement_site.aurelis.moon_gate",
    slug: "moon_gate",
    name: "Moon Gate",
    aliases: [],
    summary: "In-memory settlement site fixture for static descriptive validation.",
    parentSettlementId: "settlement.aurelis",
    parentDistrictId: null,
    siteType: "gatehouse",
    functionalTags: ["access"],
    placeRoleTags: ["civic_anchor"],
    status: "planned",
    sourceAuthorityNotes: [
      "Fixture only; no live settlement-site content is authored by this test."
    ],
    notes: [
      "Static site identity only; no coordinates, routes, services, inventories, ownership, Knowledge state, runtime, UI, storage, command, event, reward, or gameplay behavior."
    ],
    ...overrides
  };
}

function settlementDistrict(overrides = {}) {
  return {
    id: "settlement_district.aurelis.gate_district",
    slug: "gate_district",
    name: "Gate District",
    parentSettlementId: "settlement.aurelis",
    status: "planned",
    ...overrides
  };
}

function makeInput(records = [settlementSite()], overrides = {}) {
  return {
    relativePath: SETTLEMENT_SITE_PATH,
    wrapper: { records: structuredClone(records) },
    schema: structuredClone(schema),
    settlements: structuredClone(settlementsWrapper.records),
    ...overrides
  };
}

function validateInput(input = makeInput()) {
  return validateSettlementSites(input);
}

function record(input) {
  return input.wrapper.records[0];
}

function expectFailure(mutate, expected) {
  const input = makeInput();
  mutate(input);
  assert.throws(() => validateInput(input), expected);
}

test("accepts empty records wrapper during schema-validator-only phase", () => {
  assert.deepEqual(validateInput(makeInput([])), {
    ok: true,
    settlementSiteIds: []
  });
});

test("accepts valid planned settlement site with null parent district", () => {
  assert.deepEqual(validateInput(), {
    ok: true,
    settlementSiteIds: ["settlement_site.aurelis.moon_gate"]
  });
});

test("accepts valid planned settlement site with a supplied in-memory district reference", () => {
  const input = makeInput([
    settlementSite({
      parentDistrictId: "settlement_district.aurelis.gate_district"
    })
  ], {
    settlementDistricts: [settlementDistrict()]
  });

  assert.deepEqual(validateInput(input), {
    ok: true,
    settlementSiteIds: ["settlement_site.aurelis.moon_gate"]
  });
});

test("accepts allowed lifecycle statuses", async (t) => {
  for (const status of ["planned", "active", "retired"]) {
    await t.test(status, () => {
      assert.equal(validateInput(makeInput([settlementSite({ status })])).ok, true);
    });
  }
});

test("accepts all controlled site types", async (t) => {
  for (const siteType of schema.$defs.siteType.enum) {
    await t.test(siteType, () => {
      assert.equal(
        validateInput(makeInput([
          settlementSite({
            id: `settlement_site.aurelis.${siteType}`,
            slug: siteType,
            siteType
          })
        ])).ok,
        true
      );
    });
  }
});

test("allows duplicate site slugs under different parent settlements", () => {
  const records = [
    settlementSite(),
    settlementSite({
      id: "settlement_site.vinecross.moon_gate",
      parentSettlementId: "settlement.vinecross"
    })
  ];

  assert.deepEqual(validateInput(makeInput(records)), {
    ok: true,
    settlementSiteIds: [
      "settlement_site.aurelis.moon_gate",
      "settlement_site.vinecross.moon_gate"
    ]
  });
});

test("does not mutate settlement-site validation inputs", () => {
  const input = makeInput([
    settlementSite({
      parentDistrictId: "settlement_district.aurelis.gate_district"
    })
  ], {
    settlementDistricts: [settlementDistrict()]
  });
  const before = structuredClone(input);

  validateInput(input);

  assert.deepEqual(input, before);
});

test("rejects malformed wrapper and strict record failures", async (t) => {
  const cases = [
    ["non-object wrapper", (input) => { input.wrapper = null; }, /wrapper must be an object/],
    ["extra wrapper key", (input) => { input.wrapper.version = 1; }, /exactly one top-level key/],
    ["missing records", (input) => { input.wrapper = {}; }, /exactly one top-level key/],
    ["non-array records", (input) => { input.wrapper.records = {}; }, /records must be an array/],
    [
      "missing required field",
      (input) => { delete record(input).summary; },
      /structural validation failed: wrapper\.records\[0\] is missing required property 'summary'/
    ],
    [
      "extra record property",
      (input) => { record(input).unexpectedField = true; },
      /structural validation failed: wrapper\.records\[0\] has unsupported property 'unexpectedField'/
    ],
    [
      "settlement embedded reverse ownership assumption",
      (input) => { record(input).settlementSiteIds = ["settlement_site.aurelis.moon_gate"]; },
      /unsupported property 'settlementSiteIds'/
    ]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects settlement-site identity and parent failures", async (t) => {
  const cases = [
    [
      "malformed id",
      (input) => { record(input).id = "site.aurelis.moon_gate"; },
      /id must match pattern \^settlement_site/
    ],
    [
      "id slug mismatch",
      (input) => { record(input).slug = "sun_gate"; },
      /slug must match final id segment 'moon_gate'/
    ],
    [
      "id parent slug mismatch",
      (input) => { record(input).parentSettlementId = "settlement.vinecross"; },
      /parent settlement slug must match parentSettlementId/
    ],
    [
      "missing parent settlement",
      (input) => {
        record(input).id = "settlement_site.missing.moon_gate";
        record(input).parentSettlementId = "settlement.missing";
      },
      /parentSettlementId 'settlement\.missing' is missing or inactive/
    ],
    [
      "retired parent settlement if lifecycle is present",
      (input) => {
        input.settlements = [
          ...input.settlements.filter((settlement) => settlement.id !== "settlement.aurelis"),
          { ...input.settlements.find((settlement) => settlement.id === "settlement.aurelis"), status: "retired" }
        ];
      },
      /parentSettlementId 'settlement\.aurelis' is missing or inactive/
    ],
    [
      "duplicate id",
      (input) => { input.wrapper.records.push(structuredClone(record(input))); },
      /duplicate settlement-site id 'settlement_site\.aurelis\.moon_gate'/
    ],
    [
      "duplicate slug within one parent settlement",
      (input) => {
        const duplicate = structuredClone(record(input));
        duplicate.id = "settlement_site.aurelis.moon_gate_duplicate";
        input.wrapper.records.push(duplicate);
      },
      /duplicate settlement-site slug 'moon_gate' under parent 'settlement\.aurelis'/
    ]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects malformed or unresolved parent district references", async (t) => {
  const cases = [
    [
      "malformed non-null parent district",
      (input) => { record(input).parentDistrictId = "district.aurelis.gate_district"; },
      /parentDistrictId must match pattern \^settlement_district/
    ],
    [
      "parent district settlement slug mismatch",
      (input) => { record(input).parentDistrictId = "settlement_district.vinecross.gate_district"; },
      /parentDistrictId must share parent settlement slug 'aurelis'/
    ],
    [
      "missing supplied parent district",
      (input) => {
        record(input).parentDistrictId = "settlement_district.aurelis.gate_district";
        input.settlementDistricts = [settlementDistrict({ id: "settlement_district.aurelis.harbor_ward" })];
      },
      /parentDistrictId 'settlement_district\.aurelis\.gate_district' is missing in supplied world\.settlement_districts/
    ],
    [
      "non-null parent district without supplied district authority",
      (input) => { record(input).parentDistrictId = "settlement_district.aurelis.gate_district"; },
      /parentDistrictId 'settlement_district\.aurelis\.gate_district' is missing in supplied world\.settlement_districts/
    ]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects duplicate arrays, invalid vocabularies, and malformed tags", async (t) => {
  const cases = [
    ["duplicate aliases", (input) => { record(input).aliases = ["Moon Gate", "Moon Gate"]; }, /aliases must contain unique items/],
    ["duplicate functional tags", (input) => { record(input).functionalTags = ["access", "access"]; }, /functionalTags must contain unique items/],
    ["duplicate place role tags", (input) => { record(input).placeRoleTags = ["civic_anchor", "civic_anchor"]; }, /placeRoleTags must contain unique items/],
    ["duplicate source notes", (input) => { record(input).sourceAuthorityNotes = ["Repeated.", "Repeated."]; }, /sourceAuthorityNotes must contain unique items/],
    ["duplicate notes", (input) => { record(input).notes = ["Repeated.", "Repeated."]; }, /notes must contain unique items/],
    ["invalid site type", (input) => { record(input).siteType = "service_runtime"; }, /siteType must be one of the schema enum values/],
    ["invalid lifecycle status", (input) => { record(input).status = "draft"; }, /status must be one of the schema enum values/],
    ["non-lower-snake functional tag", (input) => { record(input).functionalTags = ["Access"]; }, /functionalTags\[0\] must match pattern/],
    ["non-lower-snake place role tag", (input) => { record(input).placeRoleTags = ["civic anchor"]; }, /placeRoleTags\[0\] must match pattern/],
    ["empty name", (input) => { record(input).name = ""; }, /name must have length at least 1/],
    ["empty summary", (input) => { record(input).summary = ""; }, /summary must have length at least 1/]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects forbidden geometry, route, service, ownership, Knowledge, runtime, and gameplay fields", async (t) => {
  const forbiddenFieldCases = [
    ["coordinates", "coordinates"],
    ["x coordinate", "x"],
    ["y coordinate", "y"],
    ["latitude", "latitude"],
    ["longitude", "longitude"],
    ["polygon", "polygon"],
    ["points", "points"],
    ["bounds", "bounds"],
    ["map asset reference", "mapAssetRef"],
    ["UI marker state", "uiMarkerState"],
    ["route ids", "routeIds"],
    ["pathfinding cost", "pathfindingCost"],
    ["travel estimate", "travelEstimate"],
    ["street graph ids", "streetGraphIds"],
    ["building inventories", "buildingInventories"],
    ["workplace inventories", "workplaceInventories"],
    ["service inventories", "serviceInventories"],
    ["vendor stock", "vendorStock"],
    ["prices", "prices"],
    ["inventory", "inventory"],
    ["storage state", "storageState"],
    ["NPC ids", "npcIds"],
    ["ownership records", "ownershipRecords"],
    ["population counts", "populationCounts"],
    ["workforce counts", "workforceCounts"],
    ["access-control execution", "accessControlExecution"],
    ["law rules", "lawRules"],
    ["tax rules", "taxRules"],
    ["control rules", "controlRules"],
    ["polity ids", "polityIds"],
    ["claim ids", "claimIds"],
    ["border ids", "borderIds"],
    ["jurisdiction ids", "jurisdictionIds"],
    ["quest ids", "questIds"],
    ["event refs", "eventRefs"],
    ["command refs", "commandRefs"],
    ["reward refs", "rewardRefs"],
    ["Knowledge unlock state", "knowledgeUnlockState"],
    ["Knowledge discovery state", "knowledgeDiscoveryState"],
    ["Knowledge progress state", "knowledgeProgressState"],
    ["sacred-site ownership", "sacredSiteOwnership"],
    ["religious-hotspot ownership", "religiousHotspotOwnership"],
    ["runtime state", "runtimeState"],
    ["save state", "saveState"],
    ["gameplay effects", "gameplayEffects"]
  ];

  for (const [name, field] of forbiddenFieldCases) {
    await t.test(name, () => {
      expectFailure(
        (input) => { record(input)[field] = {}; },
        new RegExp(`unsupported property '${field}'`)
      );
    });
  }
});

test("schema, validator, focused test, live content, and normal lint registration match live seed posture", async () => {
  const schemaTestSource = await readFile(path.join(ROOT, "tests/unit/schema-files.test.mjs"), "utf8");
  const contentLintSource = await readFile(path.join(ROOT, "tools/content-lint/index.mjs"), "utf8");

  assert.equal(existsSync(path.join(ROOT, SCHEMA_PATH)), true);
  assert.equal(existsSync(path.join(ROOT, VALIDATOR_PATH)), true);
  assert.equal(existsSync(path.join(ROOT, TEST_PATH)), true);
  assert.equal(existsSync(path.join(ROOT, SETTLEMENT_SITE_PATH)), true);
  assert.equal(existsSync(path.join(ROOT, SETTLEMENT_DISTRICT_PATH)), true);
  assert.match(schemaTestSource, /packages\/schemas\/world\/settlement-site\.schema\.json/);
  assert.match(contentLintSource, /settlement_sites\.json/);
  assert.match(contentLintSource, /settlement-sites\.mjs/);
});
