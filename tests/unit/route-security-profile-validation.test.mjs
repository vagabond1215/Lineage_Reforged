import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { validateRouteSecurityProfiles } from "../../tools/content-lint/route-security-profiles.mjs";

const ROOT = process.cwd();
const ROUTE_SECURITY_PATH = "packages/content/base/world/route_security_profiles.json";

async function readJson(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath), "utf8");
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

const schema = await readJson("packages/schemas/world/route-security-profile.schema.json");
const travelNetworksWrapper = await readJson("packages/content/base/world/travel_networks.json");
const worldHexEdgesWrapper = await readJson("packages/content/base/world/world_hex_edges.json");
const worldHexesWrapper = await readJson("packages/content/base/world/world_hexes.json");
const regionLocalitiesWrapper = await readJson("packages/content/base/world/region_localities.json");
const settlementsWrapper = await readJson("packages/content/base/world/settlements.json");

function routeSecurityProfile(overrides = {}) {
  return {
    id: "route_security.aurelis_vinecross_watch",
    slug: "aurelis_vinecross_watch",
    name: "Aurelis-Vinecross Watch",
    summary: "In-memory route-security fixture for static posture validation.",
    status: "planned",
    primaryTarget: {
      targetType: "travel_route",
      targetId: "route.aurelis_vinecross",
      targetRole: "primary_corridor"
    },
    securityPosture: {
      patrolPresence: "regular",
      maintenancePosture: "maintained",
      checkpointPosture: "periodic",
      tollPosture: "customary",
      escortAvailability: "available",
      banditPressure: "low",
      piracyPressure: "none",
      conflictDisruption: "none",
      publicReliability: "reliable"
    },
    sourceAuthorityNotes: [
      "Fixture only; no live route-security content is authored by this test."
    ],
    ...overrides
  };
}

function target(targetType, targetId, targetRole, overrides = {}) {
  return {
    targetType,
    targetId,
    targetRole,
    ...overrides
  };
}

function makeInput(records = [routeSecurityProfile()], overrides = {}) {
  return {
    relativePath: ROUTE_SECURITY_PATH,
    wrapper: { records: structuredClone(records) },
    schema: structuredClone(schema),
    travelNetworks: structuredClone(travelNetworksWrapper.records),
    worldHexEdges: structuredClone(worldHexEdgesWrapper.records),
    worldHexes: structuredClone(worldHexesWrapper.records),
    regionLocalities: structuredClone(regionLocalitiesWrapper.records),
    settlements: structuredClone(settlementsWrapper.records),
    ...overrides
  };
}

function validateInput(input = makeInput()) {
  return validateRouteSecurityProfiles(input);
}

function record(input) {
  return input.wrapper.records[0];
}

function expectFailure(mutate, expected) {
  const input = makeInput();
  mutate(input);
  assert.throws(() => validateInput(input), expected);
}

test("accepts valid minimal planned travel-route security profile", () => {
  assert.deepEqual(validateInput(), {
    ok: true,
    routeSecurityIds: ["route_security.aurelis_vinecross_watch"]
  });
});

test("accepts valid primary target types from current world authorities", async (t) => {
  const cases = [
    [
      "travel lane",
      {
        id: "route_security.brineharbor_starfall_lane_watch",
        slug: "brineharbor_starfall_lane_watch",
        status: "active",
        primaryTarget: target(
          "travel_lane",
          "lane.brineharbor_starfall_port",
          "primary_corridor"
        )
      }
    ],
    [
      "world hex edge",
      {
        id: "route_security.coastal_bays_edge_watch",
        slug: "coastal_bays_edge_watch",
        primaryTarget: target(
          "world_hex_edge",
          "world_hex_edge.verdant_thalos_coastal_bays_verdant_thalos_inland_estates",
          "primary_corridor"
        )
      }
    ],
    [
      "region locality",
      {
        id: "route_security.coastal_bays_local_watch",
        slug: "coastal_bays_local_watch",
        primaryTarget: target(
          "region_locality",
          "region_locality.verdant_thalos_coastal_bays",
          "local_context"
        )
      }
    ],
    [
      "settlement approach",
      {
        id: "route_security.aurelis_approach_watch",
        slug: "aurelis_approach_watch",
        primaryTarget: target(
          "settlement",
          "settlement.aurelis",
          "approach_zone"
        )
      }
    ],
    [
      "world hex approach",
      {
        id: "route_security.coastal_bays_hex_watch",
        slug: "coastal_bays_hex_watch",
        primaryTarget: target(
          "world_hex",
          "world_hex.verdant_thalos_coastal_bays",
          "approach_zone"
        )
      }
    ]
  ];

  for (const [name, overrides] of cases) {
    await t.test(name, () => {
      assert.equal(validateInput(makeInput([routeSecurityProfile(overrides)])).ok, true);
    });
  }
});

test("accepts related targets, descriptive tags, notes, and target notes", () => {
  const input = makeInput([
    routeSecurityProfile({
      relatedTargets: [
        target(
          "settlement",
          "settlement.aurelis",
          "local_context",
          { notes: ["The settlement is context only, not a route authority."] }
        ),
        target(
          "world_hex",
          "world_hex.verdant_thalos_coastal_bays",
          "approach_zone"
        )
      ],
      descriptiveTags: ["watch_patrol", "coastal_trade"],
      notes: [
        "Static descriptive security posture only; no travel runtime or access behavior is executed."
      ]
    })
  ]);

  assert.equal(validateInput(input).ok, true);
});

test("does not mutate route-security validation inputs", () => {
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

test("rejects route-security identity, lifecycle, and duplicate primary failures", async (t) => {
  const cases = [
    [
      "duplicate id",
      (input) => { input.wrapper.records.push(structuredClone(record(input))); },
      /duplicate route-security id 'route_security\.aurelis_vinecross_watch'/
    ],
    [
      "duplicate slug",
      (input) => {
        const duplicate = structuredClone(record(input));
        duplicate.id = "route_security.aurelis_duplicate_watch";
        input.wrapper.records.push(duplicate);
      },
      /duplicate route-security slug 'aurelis_vinecross_watch'/
    ],
    [
      "id slug mismatch",
      (input) => { record(input).slug = "aurelis_other_watch"; },
      /id must equal route_security\.aurelis_other_watch/
    ],
    ["invalid lifecycle status", (input) => { record(input).status = "draft"; }, /status must be one of the schema enum values/],
    ["missing primary target", (input) => { delete record(input).primaryTarget; }, /missing required property 'primaryTarget'/],
    [
      "duplicate non-retired primary target",
      (input) => {
        input.wrapper.records.push(routeSecurityProfile({
          id: "route_security.aurelis_vinecross_second_watch",
          slug: "aurelis_vinecross_second_watch",
          status: "active"
        }));
      },
      /share non-retired primaryTarget 'travel_route:route\.aurelis_vinecross'/
    ]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("allows a retired record to overlap another primary target", () => {
  const records = [
    routeSecurityProfile({ status: "active" }),
    routeSecurityProfile({
      id: "route_security.aurelis_vinecross_retired_watch",
      slug: "aurelis_vinecross_retired_watch",
      status: "retired"
    })
  ];

  assert.equal(validateInput(makeInput(records)).ok, true);
});

test("rejects malformed, incompatible, duplicate, and unresolved targets", async (t) => {
  const missingCases = [
    ["missing travel route", target("travel_route", "route.missing", "primary_corridor")],
    ["missing travel lane", target("travel_lane", "lane.missing", "primary_corridor")],
    ["missing world hex edge", target("world_hex_edge", "world_hex_edge.missing", "primary_corridor")],
    ["missing region locality", target("region_locality", "region_locality.missing", "local_context")],
    ["missing settlement", target("settlement", "settlement.missing", "approach_zone")],
    ["missing world hex", target("world_hex", "world_hex.missing", "approach_zone")]
  ];

  const cases = [
    [
      "invalid target type",
      (input) => { record(input).primaryTarget.targetType = "port"; },
      /primaryTarget\.targetType must be one of the schema enum values/
    ],
    [
      "invalid target role",
      (input) => { record(input).primaryTarget.targetRole = "guarded"; },
      /primaryTarget\.targetRole must be one of the schema enum values/
    ],
    [
      "travel route local primary role",
      (input) => { record(input).primaryTarget.targetRole = "local_context"; },
      /primaryTarget travel_route must use primary_corridor/
    ],
    [
      "world hex corridor primary role",
      (input) => {
        record(input).primaryTarget = target(
          "world_hex",
          "world_hex.verdant_thalos_coastal_bays",
          "primary_corridor"
        );
      },
      /primaryTarget world_hex must use approach_zone or local_context/
    ],
    [
      "duplicate exact target refs",
      (input) => {
        record(input).relatedTargets = [
          target("travel_route", "route.aurelis_vinecross", "primary_corridor")
        ];
      },
      /repeats target ref 'travel_route:route\.aurelis_vinecross:primary_corridor'/
    ],
    ...missingCases.map(([name, missingTarget]) => [
      name,
      (input) => { record(input).primaryTarget = missingTarget; },
      /is missing from approved current authority/
    ])
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects invalid security posture vocabulary", async (t) => {
  const cases = [
    ["patrolPresence", "constant"],
    ["maintenancePosture", "pristine"],
    ["checkpointPosture", "fortified"],
    ["tollPosture", "free_market"],
    ["escortAvailability", "guaranteed"],
    ["banditPressure", "deadly"],
    ["piracyPressure", "naval_war"],
    ["conflictDisruption", "active_battle"],
    ["publicReliability", "safe"]
  ];

  for (const [field, value] of cases) {
    await t.test(field, () => {
      expectFailure(
        (input) => { record(input).securityPosture[field] = value; },
        new RegExp(`securityPosture\\.${field} must be one of the schema enum values`)
      );
    });
  }
});

test("rejects tag, note, and source-authority shape failures", async (t) => {
  const cases = [
    ["duplicate descriptive tag", (input) => { record(input).descriptiveTags = ["watch", "watch"]; }, /descriptiveTags must contain unique items/],
    ["invalid descriptive tag shape", (input) => { record(input).descriptiveTags = ["Watch"]; }, /descriptiveTags\[0\] must match pattern/],
    ["empty sourceAuthorityNotes", (input) => { record(input).sourceAuthorityNotes = []; }, /sourceAuthorityNotes must contain at least 1 items/],
    ["empty sourceAuthorityNotes string", (input) => { record(input).sourceAuthorityNotes = [""]; }, /sourceAuthorityNotes\[0\] must have length at least 1/],
    ["empty notes", (input) => { record(input).notes = []; }, /notes must contain at least 1 items/],
    ["empty notes string", (input) => { record(input).notes = [""]; }, /notes\[0\] must have length at least 1/],
    [
      "empty target notes string",
      (input) => { record(input).primaryTarget.notes = [""]; },
      /primaryTarget\.notes\[0\] must have length at least 1/
    ]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects topology, route authority, civic, economy, runtime, and gameplay fields", async (t) => {
  const forbiddenFields = [
    "routeRecords",
    "interPortShipRoutes",
    "routeSegments",
    "routeSegmentIds",
    "crossingIds",
    "crossingId",
    "portIds",
    "portId",
    "tradeRouteIds",
    "tradeRouteId",
    "roadIds",
    "roadId",
    "bridgeIds",
    "bridgeId",
    "ferryIds",
    "ferryId",
    "checkpointIds",
    "checkpointId",
    "orderedHexIds",
    "orderedEdgeIds",
    "hexPath",
    "edgePath",
    "topology",
    "adjacency",
    "distance",
    "travelEstimate",
    "travelTime",
    "eta",
    "pathfindingCost",
    "routeQuality",
    "crossingDifficulty",
    "allowedModes",
    "availableModes",
    "barriers",
    "closureState",
    "routeClosure",
    "detours",
    "activeIncident",
    "currentAvailability",
    "currentCondition",
    "currentDanger",
    "currentWeather",
    "forecast",
    "weatherSimulation",
    "patrolUnits",
    "guardRoster",
    "guardIds",
    "forceIds",
    "forceId",
    "jurisdictionIds",
    "jurisdictionId",
    "polityIds",
    "polityId",
    "lawIds",
    "lawId",
    "courtIds",
    "taxRules",
    "tariffRules",
    "tollCollection",
    "customsChecks",
    "checkpointExecution",
    "lawEnforcement",
    "accessRules",
    "permissions",
    "wantedStatus",
    "legalState",
    "reputationState",
    "guildIds",
    "guildId",
    "marketLogistics",
    "cargo",
    "supply",
    "prices",
    "stock",
    "tradeSimulation",
    "logisticsMovement",
    "encounterTemplateIds",
    "spawnProfileIds",
    "spawnRate",
    "spawnDensity",
    "hostilityWeights",
    "encounterWeights",
    "encounterTable",
    "travelTick",
    "partyLocation",
    "vehicleState",
    "fatigue",
    "hunger",
    "thirst",
    "provisions",
    "damage",
    "conditionApplication",
    "discoveryState",
    "mapRevealState",
    "routeKnown",
    "hazardKnown",
    "securityKnown",
    "journeyHistory",
    "playerJourneyState",
    "runtimeState",
    "saveState",
    "storageState",
    "uiState",
    "commandRefs",
    "eventRefs",
    "rewardRefs",
    "serviceIds",
    "access",
    "gameplayEffects",
    "routeName",
    "crossingName",
    "portName",
    "roadName",
    "bridgeName",
    "ferryName",
    "checkpointName",
    "guildName",
    "polityName",
    "forceName",
    "lawName",
    "ownerName"
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

test("schema is registered while live route-security content and normal lint registration remain absent", async () => {
  const schemaTestSource = await readFile(path.join(ROOT, "tests/unit/schema-files.test.mjs"), "utf8");
  const contentLintSource = await readFile(path.join(ROOT, "tools/content-lint/index.mjs"), "utf8");

  assert.match(schemaTestSource, /packages\/schemas\/world\/route-security-profile\.schema\.json/);
  assert.equal(existsSync(path.join(ROOT, "packages/schemas/world/hazard-profile.schema.json")), true);
  assert.equal(existsSync(path.join(ROOT, "tools/content-lint/hazard-profiles.mjs")), true);
  assert.equal(existsSync(path.join(ROOT, "tests/unit/hazard-profile-validation.test.mjs")), true);
  assert.equal(existsSync(path.join(ROOT, ROUTE_SECURITY_PATH)), false);
  assert.doesNotMatch(contentLintSource, /route_security_profiles\.json/);
  assert.doesNotMatch(contentLintSource, /route-security-profiles\.mjs/);
  assert.doesNotMatch(contentLintSource, /hazard_target_overlays\.json/);
});
