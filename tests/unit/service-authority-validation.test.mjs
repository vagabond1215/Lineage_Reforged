import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { validateServicesContent } from "../../tools/content-lint/services.mjs";

const ROOT = process.cwd();
const SERVICE_CONTENT_PATH = "packages/content/base/civilization/services.json";
const SCHEMA_PATH = "packages/schemas/civilization/service.schema.json";
const VALIDATOR_PATH = "tools/content-lint/services.mjs";
const TEST_PATH = "tests/unit/service-authority-validation.test.mjs";

async function readJson(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath), "utf8");
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

const serviceSchema = await readJson(SCHEMA_PATH);
const buildingsWrapper = await readJson("packages/content/base/civilization/buildings.json");

function service(overrides = {}) {
  return {
    id: "service.lodging",
    slug: "lodging",
    name: "Lodging",
    status: "planned",
    family: "lodging",
    summary: "Provider-independent vocabulary for lodging service identity.",
    tags: ["lodging", "licensed"],
    publicPosture: "public",
    providerAnchorTypes: ["building_template", "settlement_site"],
    allowedOwnerTypes: ["civilization.buildings", "world.settlement_sites"],
    sourceAuthorityNotes: [
      "In-memory fixture only; no live service content is authored by this test."
    ],
    notes: [
      "Static service vocabulary only; no provider availability, prices, stock, access checks, effects, UI, runtime, save state, or gameplay behavior."
    ],
    ...overrides
  };
}

function makeInput(records = [service()], overrides = {}) {
  return {
    relativePath: SERVICE_CONTENT_PATH,
    wrapper: { records: structuredClone(records) },
    schema: structuredClone(serviceSchema),
    buildings: structuredClone(buildingsWrapper.records),
    ...overrides
  };
}

function validateInput(input = makeInput()) {
  return validateServicesContent(input);
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
    serviceIds: []
  });
});

test("accepts valid minimal service wrapper and record", () => {
  assert.deepEqual(validateInput(), {
    ok: true,
    serviceIds: ["service.lodging"]
  });
});

test("accepts active vocabulary-only record with no provider refs", () => {
  assert.deepEqual(validateInput(makeInput([
    service({
      status: "active",
      providerAnchorTypes: [],
      allowedOwnerTypes: []
    })
  ])), {
    ok: true,
    serviceIds: ["service.lodging"]
  });
});

test("rejects invalid wrappers and strict record failures", async (t) => {
  const cases = [
    ["non-object wrapper", (input) => { input.wrapper = null; }, /wrapper must be an object/],
    ["extra wrapper key", (input) => { input.wrapper.version = 1; }, /exactly one top-level key/],
    ["missing records", (input) => { input.wrapper = {}; }, /exactly one top-level key/],
    ["non-array records", (input) => { input.wrapper.records = {}; }, /records must be an array/],
    [
      "missing required field",
      (input) => { delete record(input).publicPosture; },
      /structural validation failed: wrapper\.records\[0\] is missing required property 'publicPosture'/
    ],
    [
      "extra record property",
      (input) => { record(input).unexpectedField = true; },
      /structural validation failed: wrapper\.records\[0\] has unsupported property 'unexpectedField'/
    ],
    [
      "aliases are not part of service identity",
      (input) => { record(input).aliases = ["Innkeeping"]; },
      /forbidden field 'aliases'/
    ]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects duplicate ids, slugs, and names", async (t) => {
  const cases = [
    [
      "duplicate ids",
      (input) => { input.wrapper.records.push(structuredClone(record(input))); },
      /duplicate service id 'service\.lodging'/
    ],
    [
      "duplicate slugs",
      (input) => {
        const duplicate = structuredClone(record(input));
        duplicate.id = "service.other_lodging";
        input.wrapper.records.push(duplicate);
      },
      /duplicate service slug 'lodging'/
    ],
    [
      "duplicate names",
      (input) => {
        const duplicate = structuredClone(record(input));
        duplicate.id = "service.room_board";
        duplicate.slug = "room_board";
        input.wrapper.records.push(duplicate);
      },
      /duplicate service name 'Lodging'/
    ]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects malformed ids, slug mismatch, and invalid vocabularies", async (t) => {
  const cases = [
    ["malformed id", (input) => { record(input).id = "civilization_service.lodging"; }, /id must match pattern \^service/],
    ["slug/id mismatch", (input) => { record(input).slug = "room_board"; }, /slug must match id suffix 'lodging'/],
    ["invalid status", (input) => { record(input).status = "draft"; }, /status must be one of the schema enum values/],
    ["invalid family", (input) => { record(input).family = "shop"; }, /family must be one of the schema enum values/],
    ["invalid public posture", (input) => { record(input).publicPosture = "members_only"; }, /publicPosture must be one of the schema enum values/],
    ["invalid provider anchor type", (input) => { record(input).providerAnchorTypes = ["building.inn"]; }, /providerAnchorTypes\[0\] must be one of the schema enum values/],
    ["invalid allowed owner type", (input) => { record(input).allowedOwnerTypes = ["building.inn"]; }, /allowedOwnerTypes\[0\] must be one of the schema enum values/],
    ["non-lower-snake tag", (input) => { record(input).tags = ["Licensed"]; }, /tags\[0\] must match pattern/],
    ["forbidden-intent tag", (input) => { record(input).tags = ["price_table"]; }, /tag 'price_table' implies forbidden/]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects duplicate array values", async (t) => {
  const cases = [
    ["duplicate tags", (input) => { record(input).tags = ["lodging", "lodging"]; }, /tags must contain unique items/],
    ["duplicate provider anchors", (input) => { record(input).providerAnchorTypes = ["building_template", "building_template"]; }, /providerAnchorTypes must contain unique items/],
    ["duplicate allowed owners", (input) => { record(input).allowedOwnerTypes = ["civilization.buildings", "civilization.buildings"]; }, /allowedOwnerTypes must contain unique items/],
    ["duplicate source notes", (input) => { record(input).sourceAuthorityNotes = ["Repeated.", "Repeated."]; }, /sourceAuthorityNotes must contain unique items/],
    ["duplicate notes", (input) => { record(input).notes = ["Repeated.", "Repeated."]; }, /notes must contain unique items/],
    ["duplicate related building functions", (input) => { record(input).relatedBuildingServiceFunctions = ["lodging", "lodging"]; }, /relatedBuildingServiceFunctions must contain unique items/]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("validates related building service functions against observed descriptors", () => {
  assert.ok(buildingsWrapper.records.some((building) => building.serviceFunctions?.includes("lodging")));
  assert.deepEqual(validateInput(makeInput([
    service({
      relatedBuildingServiceFunctions: ["lodging"]
    })
  ])), {
    ok: true,
    serviceIds: ["service.lodging"]
  });
});

test("rejects unresolved related building service functions", () => {
  expectFailure(
    (input) => { record(input).relatedBuildingServiceFunctions = ["runtime_booking"]; },
    /relatedBuildingServiceFunctions 'runtime_booking' is not an observed building serviceFunctions value/
  );
});

test("rejects concrete provider refs and forbidden state or execution fields", async (t) => {
  const cases = [
    ["concrete provider refs", "providerRefs"],
    ["concrete provider ids", "providerIds"],
    ["concrete building ids", "buildingIds"],
    ["pricing", "prices"],
    ["stock", "stock"],
    ["payment", "payment"],
    ["access checks", "accessChecks"],
    ["training effects", "trainingEffects"],
    ["healing effects", "healingEffects"],
    ["repair effects", "repairEffects"],
    ["runtime state", "runtimeState"],
    ["UI menus", "uiMenus"],
    ["save state", "saveState"],
    ["account state", "accountState"],
    ["gameplay execution", "gameplayExecution"]
  ];

  for (const [name, field] of cases) {
    await t.test(name, () => {
      expectFailure(
        (input) => { record(input)[field] = {}; },
        new RegExp(`forbidden field '${field}'`)
      );
    });
  }
});

test("rejects nested forbidden fields", () => {
  expectFailure(
    (input) => {
      record(input).relationshipNotes = [
        "Static relationship note."
      ];
      record(input).nested = {
        prices: {}
      };
    },
    /forbidden field 'prices'/
  );
});

test("schema, validator, focused test, absent live content, and absent normal lint registration match posture", async () => {
  const schemaTestSource = await readFile(path.join(ROOT, "tests/unit/schema-files.test.mjs"), "utf8");
  const contentLintSource = await readFile(path.join(ROOT, "tools/content-lint/index.mjs"), "utf8");
  const validatorSource = await readFile(path.join(ROOT, VALIDATOR_PATH), "utf8");

  assert.equal(existsSync(path.join(ROOT, SCHEMA_PATH)), true);
  assert.equal(existsSync(path.join(ROOT, VALIDATOR_PATH)), true);
  assert.equal(existsSync(path.join(ROOT, TEST_PATH)), true);
  assert.equal(existsSync(path.join(ROOT, SERVICE_CONTENT_PATH)), false);
  assert.match(schemaTestSource, /packages\/schemas\/civilization\/service\.schema\.json/);
  assert.doesNotMatch(contentLintSource, /civilization\/services\.json/);
  assert.doesNotMatch(contentLintSource, /services\.mjs/);
  assert.doesNotMatch(validatorSource, /^import .*from ["'][^"']*(?:apps\/rpg-ui|runtime|game-shell)/m);
});
