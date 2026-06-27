import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { validateMapFeatures } from "../../tools/content-lint/map-features.mjs";

const ROOT = process.cwd();
const MAP_FEATURE_PATH = "packages/content/base/world/map_features.json";

async function readJson(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath), "utf8");
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

const schema = await readJson("packages/schemas/world/map-feature.schema.json");
const regionsWrapper = await readJson("packages/content/base/world/regions.json");
const regionLocalitiesWrapper = await readJson("packages/content/base/world/region_localities.json");
const settlementsWrapper = await readJson("packages/content/base/world/settlements.json");
const worldMapFeaturesWrapper = await readJson("packages/content/base/world/world_map_features.json");

function mapFeature(overrides = {}) {
  return {
    id: "map_feature.thalos_run",
    slug: "thalos_run",
    name: "Thalos Run",
    aliases: [],
    summary: "In-memory semantic map-feature fixture for static validation.",
    featureType: "river",
    extentKind: "linear",
    placeAnchors: [
      {
        placeType: "region",
        placeId: "region.kaelvar",
        anchorRole: "feature_crosses"
      }
    ],
    descriptiveTags: ["freshwater", "riverine"],
    visualReferences: [],
    status: "planned",
    sourceAuthorityNotes: [
      "Fixture only; no live map-feature content is authored by this test."
    ],
    notes: [
      "Static semantic feature identity only; no geometry, routes, ecology, Knowledge, runtime, UI, storage, command, event, reward, or gameplay behavior."
    ],
    ...overrides
  };
}

function makeInput(records = [mapFeature()], overrides = {}) {
  return {
    relativePath: MAP_FEATURE_PATH,
    wrapper: { records: structuredClone(records) },
    schema: structuredClone(schema),
    regions: structuredClone(regionsWrapper.records),
    regionLocalities: structuredClone(regionLocalitiesWrapper.records),
    settlements: structuredClone(settlementsWrapper.records),
    worldMapFeatures: structuredClone(worldMapFeaturesWrapper.records),
    ...overrides
  };
}

function validateInput(input = makeInput()) {
  return validateMapFeatures(input);
}

function record(input) {
  return input.wrapper.records[0];
}

function expectFailure(mutate, expected) {
  const input = makeInput();
  mutate(input);
  assert.throws(() => validateInput(input), expected);
}

test("accepts valid minimal planned map feature with a region anchor and empty visual references", () => {
  assert.deepEqual(validateInput(), {
    ok: true,
    mapFeatureIds: ["map_feature.thalos_run"]
  });
});

test("accepts valid active river or mountain features with region and locality anchors", async (t) => {
  const cases = [
    [
      "active river",
      {
        status: "active",
        placeAnchors: [
          {
            placeType: "region",
            placeId: "region.kaelvar",
            anchorRole: "feature_crosses"
          },
          {
            placeType: "region_locality",
            placeId: "region_locality.verdant_thalos_coastal_bays",
            anchorRole: "contains_feature"
          }
        ]
      }
    ],
    [
      "active mountain range",
      {
        id: "map_feature.crownwall",
        slug: "crownwall",
        name: "Crownwall",
        featureType: "mountain_range",
        extentKind: "linear",
        status: "active",
        placeAnchors: [
          {
            placeType: "region_locality",
            placeId: "region_locality.verdant_thalos_coastal_bays",
            anchorRole: "feature_near"
          }
        ],
        descriptiveTags: ["upland"]
      }
    ]
  ];

  for (const [name, overrides] of cases) {
    await t.test(name, () => {
      assert.equal(validateInput(makeInput([mapFeature(overrides)])).ok, true);
    });
  }
});

test("accepts settlement named-context anchor only with a region or locality anchor", () => {
  const input = makeInput([
    mapFeature({
      id: "map_feature.aurelis_bay",
      slug: "aurelis_bay",
      name: "Aurelis Bay",
      featureType: "natural_harbor",
      extentKind: "area_like",
      placeAnchors: [
        {
          placeType: "region_locality",
          placeId: "region_locality.verdant_thalos_coastal_bays",
          anchorRole: "contains_feature"
        },
        {
          placeType: "settlement",
          placeId: "settlement.aurelis",
          anchorRole: "named_context"
        }
      ]
    })
  ]);

  assert.equal(validateInput(input).ok, true);
});

test("accepts visual references to allowed coastline, river, mountain, and pass feature geometry", async (t) => {
  const cases = [
    ["coastline", "feature.coastline.first_world.part_1", "partial_depiction"],
    ["river", "feature.river_thalos_run", "approximate_depiction"],
    ["mountain", "feature.mountains_crownwall", "reference_only"],
    ["pass", "feature.pass_sunscar_gate", "reference_only"]
  ];

  for (const [name, visualFeatureId, relationship] of cases) {
    await t.test(name, () => {
      const input = makeInput([
        mapFeature({
          visualReferences: [
            {
              visualAggregateId: "world_map_feature.first_world",
              visualFeatureId,
              relationship,
              notes: "Non-authoritative pointer to current visual geometry only."
            }
          ]
        })
      ]);
      assert.equal(validateInput(input).ok, true);
    });
  }
});

test("does not require feature type encoded into the map-feature id", () => {
  const input = makeInput([
    mapFeature({
      id: "map_feature.sunscar_gate",
      slug: "sunscar_gate",
      name: "Sunscar Gate",
      featureType: "mountain_pass",
      extentKind: "point_like"
    })
  ]);

  assert.equal(validateInput(input).ok, true);
});

test("does not mutate map-feature validation inputs", () => {
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
    ],
    [
      "visual id alias bridge",
      (input) => { record(input).aliases = ["feature.river_thalos_run"]; },
      /aliases must not bridge to visual id/
    ]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects map-feature identity and vocabulary failures", async (t) => {
  const cases = [
    [
      "duplicate id",
      (input) => { input.wrapper.records.push(structuredClone(record(input))); },
      /duplicate map-feature id 'map_feature\.thalos_run'/
    ],
    [
      "duplicate slug",
      (input) => {
        const duplicate = structuredClone(record(input));
        duplicate.id = "map_feature.other_feature";
        input.wrapper.records.push(duplicate);
      },
      /duplicate map-feature slug 'thalos_run'/
    ],
    [
      "id slug mismatch",
      (input) => { record(input).slug = "other_feature"; },
      /id must equal map_feature\.other_feature/
    ],
    ["invalid lifecycle status", (input) => { record(input).status = "draft"; }, /status must be one of the schema enum values/],
    ["invalid feature type", (input) => { record(input).featureType = "waterway"; }, /featureType must be one of the schema enum values/],
    ["invalid extent kind", (input) => { record(input).extentKind = "polygon"; }, /extentKind must be one of the schema enum values/],
    ["duplicate aliases", (input) => { record(input).aliases = ["Thalos Run", "Thalos Run"]; }, /aliases must contain unique items/],
    ["duplicate descriptive tags", (input) => { record(input).descriptiveTags = ["freshwater", "freshwater"]; }, /descriptiveTags must contain unique items/],
    ["invalid descriptive tag shape", (input) => { record(input).descriptiveTags = ["Freshwater"]; }, /descriptiveTags\[0\] must match pattern/]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }

  for (const forbiddenFeatureType of ["road", "port", "route", "ford", "cave", "mine"]) {
    await t.test(`forbidden feature type ${forbiddenFeatureType}`, () => {
      expectFailure(
        (input) => { record(input).featureType = forbiddenFeatureType; },
        /featureType must be one of the schema enum values/
      );
    });
  }
});

test("rejects malformed, duplicate, unresolved, and settlement-only place anchors", async (t) => {
  const cases = [
    ["empty place anchors", [], /placeAnchors must contain at least 1 items/],
    [
      "duplicate place anchors",
      [
        { placeType: "region", placeId: "region.kaelvar", anchorRole: "feature_crosses" },
        { placeType: "region", placeId: "region.kaelvar", anchorRole: "feature_crosses" }
      ],
      /placeAnchors must contain unique items/
    ],
    [
      "invalid place type",
      [{ placeType: "world_map", placeId: "world_map.first_world", anchorRole: "named_context" }],
      /placeType must be one of the schema enum values/
    ],
    [
      "invalid anchor role",
      [{ placeType: "region", placeId: "region.kaelvar", anchorRole: "owns_feature" }],
      /anchorRole must be one of the schema enum values/
    ],
    [
      "missing region",
      [{ placeType: "region", placeId: "region.missing", anchorRole: "feature_crosses" }],
      /placeAnchor region 'region\.missing' is missing or inactive/
    ],
    [
      "missing region locality",
      [{ placeType: "region_locality", placeId: "region_locality.missing", anchorRole: "contains_feature" }],
      /placeAnchor region_locality 'region_locality\.missing' is missing or inactive/
    ],
    [
      "missing settlement",
      [
        { placeType: "region", placeId: "region.kaelvar", anchorRole: "feature_crosses" },
        { placeType: "settlement", placeId: "settlement.missing", anchorRole: "named_context" }
      ],
      /placeAnchor settlement 'settlement\.missing' is missing or inactive/
    ],
    [
      "settlement-only anchoring",
      [{ placeType: "settlement", placeId: "settlement.aurelis", anchorRole: "named_context" }],
      /must include at least one region or region_locality placeAnchor/
    ],
    [
      "sacred-site anchor",
      [{ placeType: "sacred_site", placeId: "sacred_site.glasswake_shrine", anchorRole: "named_context" }],
      /placeType must be one of the schema enum values/
    ],
    [
      "religious-hotspot anchor",
      [{ placeType: "religious_hotspot", placeId: "religious_hotspot.glasswake_shrine_lantern_gardens", anchorRole: "named_context" }],
      /placeType must be one of the schema enum values/
    ]
  ];

  for (const [name, placeAnchors, expected] of cases) {
    await t.test(name, () => {
      expectFailure(
        (input) => { record(input).placeAnchors = placeAnchors; },
        expected
      );
    });
  }
});

test("rejects invalid visual references and disallowed visual targets", async (t) => {
  const cases = [
    [
      "duplicate visual reference",
      (input) => {
        record(input).visualReferences = [
          {
            visualAggregateId: "world_map_feature.first_world",
            visualFeatureId: "feature.river_thalos_run",
            relationship: "approximate_depiction",
            notes: "First pointer."
          },
          {
            visualAggregateId: "world_map_feature.first_world",
            visualFeatureId: "feature.river_thalos_run",
            relationship: "approximate_depiction",
            notes: "Second pointer."
          }
        ];
      },
      /duplicate visualReference 'world_map_feature\.first_world:feature\.river_thalos_run:approximate_depiction'/
    ],
    [
      "missing aggregate",
      (input) => {
        record(input).visualReferences = [
          {
            visualAggregateId: "world_map_feature.missing",
            visualFeatureId: "feature.river_thalos_run",
            relationship: "reference_only",
            notes: "Missing aggregate."
          }
        ];
      },
      /visualReference aggregate 'world_map_feature\.missing' is missing/
    ],
    [
      "missing nested feature",
      (input) => {
        record(input).visualReferences = [
          {
            visualAggregateId: "world_map_feature.first_world",
            visualFeatureId: "feature.river_missing",
            relationship: "reference_only",
            notes: "Missing nested feature."
          }
        ];
      },
      /visualReference feature 'feature\.river_missing' is missing/
    ],
    [
      "region footprint",
      (input) => {
        record(input).visualReferences = [
          {
            visualAggregateId: "world_map_feature.first_world",
            visualFeatureId: "feature.region_auric_marches.part_1",
            relationship: "reference_only",
            notes: "Region footprints are not semantic feature proof."
          }
        ];
      },
      /targets disallowed region footprint geometry/
    ],
    [
      "crossing",
      (input) => {
        record(input).visualReferences = [
          {
            visualAggregateId: "world_map_feature.first_world",
            visualFeatureId: "feature.crossing_kingsbridge",
            relationship: "reference_only",
            notes: "Crossings are not first-pass semantic map features."
          }
        ];
      },
      /targets disallowed crossing geometry/
    ],
    [
      "climate zone",
      (input) => {
        record(input).visualReferences = [
          {
            visualAggregateId: "world_map_feature.first_world",
            visualFeatureId: "map_climate.first_world.kaelvar_plateau",
            relationship: "reference_only",
            notes: "Climate zones are not physical nested feature ids."
          }
        ];
      },
      /visualFeatureId must match pattern/
    ],
    [
      "biome zone",
      (input) => {
        record(input).visualReferences = [
          {
            visualAggregateId: "world_map_feature.first_world",
            visualFeatureId: "map_biome.first_world.verdant_thalos_woodland.part_1",
            relationship: "reference_only",
            notes: "Biome zones are not physical nested feature ids."
          }
        ];
      },
      /visualFeatureId must match pattern/
    ],
    [
      "geometry copied into visual reference",
      (input) => {
        record(input).visualReferences = [
          {
            visualAggregateId: "world_map_feature.first_world",
            visualFeatureId: "feature.river_thalos_run",
            relationship: "reference_only",
            notes: "Do not copy geometry.",
            points: [{ x: 1, y: 2 }]
          }
        ];
      },
      /visualReferences\[0\] has unsupported property 'points'/
    ]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects forbidden geometry, topology, political, ecology, Knowledge, runtime, and gameplay fields", async (t) => {
  const forbiddenFieldCases = [
    ["x coordinate", "x"],
    ["y coordinate", "y"],
    ["pixel coordinate", "pixelX"],
    ["latitude", "latitude"],
    ["longitude", "longitude"],
    ["point geometry", "point"],
    ["line geometry", "line"],
    ["polygon geometry", "polygon"],
    ["bounding box", "boundingBox"],
    ["hex ids", "hexIds"],
    ["edge ids", "edgeIds"],
    ["grid ids", "gridIds"],
    ["cell ids", "cellIds"],
    ["adjacency", "adjacency"],
    ["friction", "friction"],
    ["route ids", "routeIds"],
    ["crossing ids", "crossingIds"],
    ["port ids", "portIds"],
    ["travel network ids", "travelNetworkIds"],
    ["pathfinding cost", "pathfindingCost"],
    ["cargo", "cargo"],
    ["polity ids", "polityIds"],
    ["claim ids", "claimIds"],
    ["border ids", "borderIds"],
    ["jurisdiction ids", "jurisdictionIds"],
    ["ecology profile", "ecologyProfileId"],
    ["biome ids", "biomeIds"],
    ["climate ids", "climateIds"],
    ["hydrology state", "hydrologyState"],
    ["resource ids", "resourceIds"],
    ["spawn profile ids", "spawnProfileIds"],
    ["encounter template ids", "encounterTemplateIds"],
    ["POI placement", "poiPlacementRules"],
    ["sacred site", "sacredSiteId"],
    ["religious hotspot", "religiousHotspotId"],
    ["settlement effect", "settlementEffectIds"],
    ["Knowledge domain", "knowledgeDomainId"],
    ["Knowledge refs", "knowledgeRefs"],
    ["discovery state", "discoveryState"],
    ["runtime state", "runtimeState"],
    ["UI state", "uiState"],
    ["storage state", "storageState"],
    ["command refs", "commandRefs"],
    ["event refs", "eventRefs"],
    ["reward refs", "rewardRefs"],
    ["gameplay effects", "gameplayEffects"],
    ["access", "access"],
    ["favorability", "favorability"],
    ["alignment", "alignment"]
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

test("schema is registered while live semantic content and normal lint registration remain absent", async () => {
  const schemaTestSource = await readFile(path.join(ROOT, "tests/unit/schema-files.test.mjs"), "utf8");
  const contentLintSource = await readFile(path.join(ROOT, "tools/content-lint/index.mjs"), "utf8");

  assert.match(schemaTestSource, /packages\/schemas\/world\/map-feature\.schema\.json/);
  assert.equal(existsSync(path.join(ROOT, MAP_FEATURE_PATH)), false);
  assert.doesNotMatch(contentLintSource, /packages\/content\/base\/world\/map_features\.json/);
  assert.doesNotMatch(contentLintSource, /map-features\.mjs/);
});

test("existing visual world-map-feature authority remains registered separately", async () => {
  const schemaTestSource = await readFile(path.join(ROOT, "tests/unit/schema-files.test.mjs"), "utf8");
  const contentLintSource = await readFile(path.join(ROOT, "tools/content-lint/index.mjs"), "utf8");

  assert.equal(existsSync(path.join(ROOT, "packages/content/base/world/world_map_features.json")), true);
  assert.equal(existsSync(path.join(ROOT, "packages/schemas/world/world-map-feature.schema.json")), true);
  assert.match(schemaTestSource, /packages\/schemas\/world\/world-map-feature\.schema\.json/);
  assert.match(contentLintSource, /packages\/content\/base\/world\/world_map_features\.json/);
  assert.match(contentLintSource, /validateWorldMapFeaturesAgainstWorldData/);
});
