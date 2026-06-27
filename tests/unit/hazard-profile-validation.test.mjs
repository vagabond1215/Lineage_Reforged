import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { validateHazardProfiles } from "../../tools/content-lint/hazard-profiles.mjs";

const ROOT = process.cwd();
const HAZARD_PROFILE_PATH = "packages/content/base/world/hazard_profiles.json";

async function readJson(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath), "utf8");
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

const schema = await readJson("packages/schemas/world/hazard-profile.schema.json");

function hazardProfile(overrides = {}) {
  return {
    id: "hazard_profile.rockfall",
    slug: "rockfall",
    name: "Rockfall",
    summary: "In-memory hazard profile fixture for static reusable vocabulary validation.",
    status: "planned",
    hazardCategory: "geologic",
    severityBand: "moderate",
    exposureBand: "intermittent",
    applicableTerrainTags: ["cliff", "mountain_pass"],
    applicableSeasonTags: ["year_round"],
    applicablePlacePosture: "localized",
    warningSigns: [
      "Fresh debris below unstable slopes."
    ],
    mitigationNotes: [
      "Treat as descriptive mitigation context only; no pathfinding, damage, travel, or gameplay effect is executed."
    ],
    sourceAuthorityNotes: [
      "Fixture only; no live hazard-profile content is authored by this test."
    ],
    ...overrides
  };
}

function makeInput(records = [hazardProfile()], overrides = {}) {
  return {
    relativePath: HAZARD_PROFILE_PATH,
    wrapper: { records: structuredClone(records) },
    schema: structuredClone(schema),
    ...overrides
  };
}

function validateInput(input = makeInput()) {
  return validateHazardProfiles(input);
}

function record(input) {
  return input.wrapper.records[0];
}

function expectFailure(mutate, expected) {
  const input = makeInput();
  mutate(input);
  assert.throws(() => validateInput(input), expected);
}

test("accepts valid minimal planned hazard profile", () => {
  assert.deepEqual(validateInput(), {
    ok: true,
    hazardProfileIds: ["hazard_profile.rockfall"]
  });
});

test("accepts valid active hazard profile", () => {
  const input = makeInput([
    hazardProfile({
      id: "hazard_profile.miasma",
      slug: "miasma",
      name: "Miasma",
      status: "active",
      hazardCategory: "toxic_environment",
      severityBand: "severe",
      exposureBand: "persistent",
      applicableTerrainTags: ["marsh", "swamp"],
      applicableSeasonTags: ["wet_season", "summer"],
      applicablePlacePosture: "area_like"
    })
  ]);

  assert.equal(validateInput(input).ok, true);
});

test("accepts optional descriptive tags and notes", () => {
  const input = makeInput([
    hazardProfile({
      descriptiveTags: ["loose_stone", "steep_slope"],
      notes: [
        "Static hazard vocabulary only; placement and current condition overlays remain deferred."
      ]
    })
  ]);

  assert.equal(validateInput(input).ok, true);
});

test("does not mutate hazard-profile validation inputs", () => {
  const input = makeInput();
  const before = structuredClone(input);

  validateInput(input);

  assert.deepEqual(input, before);
});

test("rejects strict wrapper and record failures", async (t) => {
  const cases = [
    ["non-object wrapper", (input) => { input.wrapper = null; }, /wrapper must be an object/],
    ["extra wrapper key", (input) => { input.wrapper.version = 1; }, /exactly one top-level key/],
    ["missing records", (input) => { input.wrapper = {}; }, /exactly one top-level key/],
    ["non-array records", (input) => { input.wrapper.records = {}; }, /records must be an array/],
    ["empty records", (input) => { input.wrapper.records = []; }, /records must be non-empty/],
    [
      "extra record property",
      (input) => { record(input).unexpectedField = true; },
      /structural validation failed: wrapper\.records\[0\] has unsupported property 'unexpectedField'/
    ]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects hazard-profile identity and lifecycle failures", async (t) => {
  const cases = [
    [
      "duplicate id",
      (input) => { input.wrapper.records.push(structuredClone(record(input))); },
      /duplicate hazard-profile id 'hazard_profile\.rockfall'/
    ],
    [
      "duplicate slug",
      (input) => {
        const duplicate = structuredClone(record(input));
        duplicate.id = "hazard_profile.falling_stone";
        input.wrapper.records.push(duplicate);
      },
      /duplicate hazard-profile slug 'rockfall'/
    ],
    [
      "id slug mismatch",
      (input) => { record(input).slug = "falling_stone"; },
      /id must equal hazard_profile\.falling_stone/
    ],
    [
      "place-specific slug",
      (input) => {
        record(input).id = "hazard_profile.rockfall_kaelvar";
        record(input).slug = "rockfall_kaelvar";
      },
      /slug must describe reusable hazard vocabulary/
    ],
    ["invalid lifecycle status", (input) => { record(input).status = "draft"; }, /status must be one of the schema enum values/]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects invalid hazard, severity, exposure, place, and season vocabulary", async (t) => {
  const cases = [
    ["invalid hazard category", (input) => { record(input).hazardCategory = "banditry"; }, /hazardCategory must be one of the schema enum values/],
    ["invalid severity band", (input) => { record(input).severityBand = "deadly"; }, /severityBand must be one of the schema enum values/],
    ["invalid exposure band", (input) => { record(input).exposureBand = "current"; }, /exposureBand must be one of the schema enum values/],
    ["invalid applicable place posture", (input) => { record(input).applicablePlacePosture = "settlement_specific"; }, /applicablePlacePosture must be one of the schema enum values/],
    ["invalid season tag", (input) => { record(input).applicableSeasonTags = ["monsoon"]; }, /applicableSeasonTags\[0\] must be one of the schema enum values/]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects tag shape, duplicate, and empty-array failures", async (t) => {
  const cases = [
    ["duplicate terrain tag", (input) => { record(input).applicableTerrainTags = ["cliff", "cliff"]; }, /applicableTerrainTags must contain unique items/],
    ["duplicate season tag", (input) => { record(input).applicableSeasonTags = ["winter", "winter"]; }, /applicableSeasonTags must contain unique items/],
    ["duplicate descriptive tag", (input) => { record(input).descriptiveTags = ["unstable", "unstable"]; }, /descriptiveTags must contain unique items/],
    ["invalid terrain tag shape", (input) => { record(input).applicableTerrainTags = ["Steep Slope"]; }, /applicableTerrainTags\[0\] must match pattern/],
    ["invalid descriptive tag shape", (input) => { record(input).descriptiveTags = ["Warning"]; }, /descriptiveTags\[0\] must match pattern/],
    ["empty terrain tags", (input) => { record(input).applicableTerrainTags = []; }, /applicableTerrainTags must contain at least 1 items/],
    ["empty season tags", (input) => { record(input).applicableSeasonTags = []; }, /applicableSeasonTags must contain at least 1 items/]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects required string-array emptiness and empty strings", async (t) => {
  const cases = [
    ["empty warningSigns", (input) => { record(input).warningSigns = []; }, /warningSigns must contain at least 1 items/],
    ["empty mitigationNotes", (input) => { record(input).mitigationNotes = []; }, /mitigationNotes must contain at least 1 items/],
    ["empty sourceAuthorityNotes", (input) => { record(input).sourceAuthorityNotes = []; }, /sourceAuthorityNotes must contain at least 1 items/],
    ["empty notes", (input) => { record(input).notes = []; }, /notes must contain at least 1 items/],
    ["empty warning sign string", (input) => { record(input).warningSigns = [""]; }, /warningSigns\[0\] must have length at least 1/],
    ["empty mitigation note string", (input) => { record(input).mitigationNotes = [""]; }, /mitigationNotes\[0\] must have length at least 1/],
    ["empty source note string", (input) => { record(input).sourceAuthorityNotes = [""]; }, /sourceAuthorityNotes\[0\] must have length at least 1/],
    ["empty notes string", (input) => { record(input).notes = [""]; }, /notes\[0\] must have length at least 1/]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects target refs and place, route, map-feature, spawn, encounter, and environment refs", async (t) => {
  const forbiddenFields = [
    "targetRefs",
    "targets",
    "placeRefs",
    "placeId",
    "regionId",
    "regionLocalityId",
    "settlementId",
    "worldHexId",
    "worldHexEdgeId",
    "hexId",
    "edgeId",
    "routeId",
    "routeIds",
    "laneId",
    "laneIds",
    "travelRouteId",
    "travelLaneId",
    "crossingId",
    "portId",
    "tradeRouteId",
    "mapFeatureId",
    "spawnProfileId",
    "encounterTemplateId",
    "ecologyProfileId",
    "biomeId",
    "climateProfileId",
    "habitatId",
    "currentConditionId",
    "hazardOverlayId",
    "targetOverlayId"
  ];

  for (const field of forbiddenFields) {
    await t.test(field, () => {
      expectFailure(
        (input) => { record(input)[field] = `${field}.example`; },
        new RegExp(`unsupported property '${field}'`)
      );
    });
  }
});

test("rejects current condition, damage, disease, weather, runtime, and gameplay fields", async (t) => {
  const forbiddenFields = [
    "damageFormula",
    "damage",
    "diseaseMechanics",
    "diseaseRoll",
    "weatherSimulation",
    "currentWeather",
    "forecast",
    "currentSeverity",
    "currentDanger",
    "activeIncident",
    "conditionApplication",
    "fatigue",
    "hunger",
    "thirst",
    "supplyBurn",
    "supplyConsumption",
    "resourceYield",
    "loot",
    "runtimeState",
    "saveState",
    "gameplayEffects"
  ];

  for (const field of forbiddenFields) {
    await t.test(field, () => {
      expectFailure(
        (input) => { record(input)[field] = {}; },
        new RegExp(`unsupported property '${field}'`)
      );
    });
  }
});

test("rejects encounter, spawn, travel, pathfinding, ETA, discovery, and map-reveal fields", async (t) => {
  const forbiddenFields = [
    "spawnRate",
    "spawnDensity",
    "hostility",
    "hostilityWeights",
    "movementModeFilter",
    "encounterWeights",
    "encounterTable",
    "pathfindingCost",
    "travelSpeed",
    "travelTime",
    "eta",
    "routeClosure",
    "closureState",
    "discoveryState",
    "mapRevealState",
    "hazardKnown",
    "routeKnown",
    "securityKnown",
    "playerJourneyState"
  ];

  for (const field of forbiddenFields) {
    await t.test(field, () => {
      expectFailure(
        (input) => { record(input)[field] = {}; },
        new RegExp(`unsupported property '${field}'`)
      );
    });
  }
});

test("rejects route-security posture and UI/storage/command/event/reward/service/access fields", async (t) => {
  const forbiddenFields = [
    "patrolPresence",
    "maintenancePosture",
    "checkpointPosture",
    "tollPosture",
    "escortAvailability",
    "banditPressure",
    "piracyPressure",
    "conflictDisruption",
    "publicReliability",
    "storageState",
    "uiState",
    "commandRefs",
    "eventRefs",
    "rewardRefs",
    "serviceIds",
    "access"
  ];

  for (const field of forbiddenFields) {
    await t.test(field, () => {
      expectFailure(
        (input) => { record(input)[field] = {}; },
        new RegExp(`unsupported property '${field}'`)
      );
    });
  }
});

test("schema is registered while live content, overlays, normal lint, and route security remain absent", async () => {
  const schemaTestSource = await readFile(path.join(ROOT, "tests/unit/schema-files.test.mjs"), "utf8");
  const contentLintSource = await readFile(path.join(ROOT, "tools/content-lint/index.mjs"), "utf8");

  assert.match(schemaTestSource, /packages\/schemas\/world\/hazard-profile\.schema\.json/);
  assert.equal(existsSync(path.join(ROOT, HAZARD_PROFILE_PATH)), false);
  assert.equal(existsSync(path.join(ROOT, "packages/content/base/world/hazard_target_overlays.json")), false);
  assert.equal(existsSync(path.join(ROOT, "packages/schemas/world/route-security-profile.schema.json")), false);
  assert.equal(existsSync(path.join(ROOT, "packages/content/base/world/route_security_profiles.json")), false);
  assert.doesNotMatch(contentLintSource, /hazard_profiles\.json/);
  assert.doesNotMatch(contentLintSource, /hazard-profiles\.mjs/);
  assert.doesNotMatch(contentLintSource, /route_security_profiles\.json/);
});
