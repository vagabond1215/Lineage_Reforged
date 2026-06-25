import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import { validateSettlementVisualMapRefs } from "../../tools/content-lint/settlement-visual-map-refs.mjs";

const SETTLEMENT_PATH = "packages/content/base/world/settlements.json";

function settlement(overrides = {}) {
  return {
    id: "settlement.glasswake_shrine",
    visualMapRef: {
      mapId: "world_map.first_world",
      pixelX: 1860,
      pixelY: 730,
      climateZoneId: "map_climate.first_world.lantern_isles",
      biomeZoneId: "map_biome.first_world.lantern_temperate_forest.part_1"
    },
    ...overrides
  };
}

function worldMap(overrides = {}) {
  return {
    id: "world_map.first_world",
    scaleProfile: {
      referenceImageWidthPx: 2048,
      referenceImageHeightPx: 1152
    },
    ...overrides
  };
}

function worldMapFeature(overrides = {}) {
  return {
    id: "world_map_feature.first_world",
    mapId: "world_map.first_world",
    climateZones: [
      {
        id: "map_climate.first_world.lantern_isles"
      }
    ],
    biomeZones: [
      {
        id: "map_biome.first_world.lantern_temperate_forest.part_1"
      },
      {
        id: "map_biome.first_world.lantern_temperate_forest.part_2"
      }
    ],
    ...overrides
  };
}

function makeInput(records = [settlement()]) {
  return {
    relativePath: SETTLEMENT_PATH,
    settlements: structuredClone(records),
    worldMaps: [worldMap()],
    worldMapFeatures: [worldMapFeature()]
  };
}

function validate(input = makeInput()) {
  return validateSettlementVisualMapRefs(input);
}

function expectFailure(mutate, expected) {
  const input = makeInput();
  mutate(input);
  assert.throws(() => validate(input), expected);
}

test("accepts valid settlement visual map references with deterministic output", () => {
  const expected = {
    ok: true,
    checkedSettlementIds: ["settlement.glasswake_shrine"]
  };
  assert.deepEqual(validate(), expected);
  assert.deepEqual(validate(), expected);
});

test("leaves visualMapRef optional", () => {
  assert.deepEqual(validate(makeInput([{ id: "settlement.without_visual_ref" }])), {
    ok: true,
    checkedSettlementIds: []
  });
});

test("does not mutate input", () => {
  const input = makeInput();
  const before = structuredClone(input);
  validate(input);
  assert.deepEqual(input, before);
});

test("rejects missing map authority", () => {
  expectFailure(
    (input) => {
      input.settlements[0].visualMapRef.mapId = "world_map.missing";
    },
    /visualMapRef\.mapId 'world_map\.missing' missing/
  );
});

test("rejects missing visual feature authority for a known map", () => {
  expectFailure(
    (input) => {
      input.worldMapFeatures = [];
    },
    /has no world_map_features authority/
  );
});

test("rejects unresolved climate and biome zones", async (t) => {
  await t.test("climate zone", () => {
    expectFailure(
      (input) => {
        input.settlements[0].visualMapRef.climateZoneId = "map_climate.first_world.missing";
      },
      /visualMapRef\.climateZoneId 'map_climate\.first_world\.missing' missing/
    );
  });

  await t.test("biome zone", () => {
    expectFailure(
      (input) => {
        input.settlements[0].visualMapRef.biomeZoneId = "map_biome.first_world.missing";
      },
      /visualMapRef\.biomeZoneId 'map_biome\.first_world\.missing' missing/
    );
  });
});

test("rejects pixels outside authoritative map bounds", async (t) => {
  await t.test("x bound", () => {
    expectFailure(
      (input) => {
        input.settlements[0].visualMapRef.pixelX = 2049;
      },
      /visualMapRef\.pixelX 2049 exceeds map width 2048/
    );
  });

  await t.test("y bound", () => {
    expectFailure(
      (input) => {
        input.settlements[0].visualMapRef.pixelY = 1153;
      },
      /visualMapRef\.pixelY 1153 exceeds map height 1152/
    );
  });
});

test("registers the helper in normal settlement content lint", async () => {
  const indexSource = await readFile("tools/content-lint/index.mjs", "utf8");
  assert.match(indexSource, /settlement-visual-map-refs\.mjs/);
  assert.match(indexSource, /validateSettlementVisualMapRefs\(/);
});
