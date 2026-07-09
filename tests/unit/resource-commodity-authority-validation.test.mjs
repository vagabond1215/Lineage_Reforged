import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { validateResourcesContent } from "../../tools/content-lint/resources.mjs";
import { validateCommoditiesContent } from "../../tools/content-lint/commodities.mjs";

const ROOT = process.cwd();
const RESOURCE_CONTENT_PATH = "packages/content/base/world/resources.json";
const COMMODITY_CONTENT_PATH = "packages/content/base/world/commodities.json";
const RESOURCE_SCHEMA_PATH = "packages/schemas/world/resource.schema.json";
const COMMODITY_SCHEMA_PATH = "packages/schemas/world/commodity.schema.json";
const RESOURCE_VALIDATOR_PATH = "tools/content-lint/resources.mjs";
const COMMODITY_VALIDATOR_PATH = "tools/content-lint/commodities.mjs";
const TEST_PATH = "tests/unit/resource-commodity-authority-validation.test.mjs";
const ITEM_CONTENT_PATH = "packages/content/base/items/items.json";
const MARKET_ITEM_VALUES_PATH = "packages/content/base/civilization/market_item_values.json";

async function readJson(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath), "utf8");
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

const resourceSchema = await readJson(RESOURCE_SCHEMA_PATH);
const commoditySchema = await readJson(COMMODITY_SCHEMA_PATH);

function item(itemKey, overrides = {}) {
  return {
    id: `item.${itemKey}`,
    itemKey,
    name: itemKey.replaceAll("_", " "),
    ...overrides
  };
}

function resource(overrides = {}) {
  return {
    id: "resource.iron_ore",
    slug: "iron_ore",
    name: "Iron Ore",
    status: "planned",
    family: "mineral",
    summary: "Static source-material identity for iron-bearing ore.",
    sourceDomains: ["mined"],
    allowedOwnerTypes: ["item", "production_chain"],
    tags: ["ore", "metal"],
    sourceAuthorityNotes: [
      "In-memory fixture only; no live resource content is authored by this test."
    ],
    notes: [
      "Descriptive resource identity only; no prices, stock, nodes, extraction, runtime, UI, save state, or gameplay behavior."
    ],
    ...overrides
  };
}

function commodity(overrides = {}) {
  return {
    id: "commodity.iron_ore_lots",
    slug: "iron_ore_lots",
    name: "Iron Ore Lots",
    status: "planned",
    family: "raw_bulk",
    tradeCategory: "raw_material",
    summary: "Static bulk-trade class for iron ore lots.",
    handlingTags: ["bulky", "dry"],
    allowedOwnerTypes: ["item", "resource", "production_chain"],
    tags: ["ore", "bulk"],
    sourceAuthorityNotes: [
      "In-memory fixture only; no live commodity content is authored by this test."
    ],
    notes: [
      "Descriptive commodity identity only; no prices, stock, cargo, storage, trading, runtime, UI, save state, or gameplay behavior."
    ],
    ...overrides
  };
}

function resourceInput(records = [resource()], overrides = {}) {
  return {
    relativePath: RESOURCE_CONTENT_PATH,
    wrapper: { records: structuredClone(records) },
    schema: structuredClone(resourceSchema),
    items: [item("iron_ore"), item("iron_ingot")],
    marketItemValues: [{ itemKey: "iron_ore" }, { itemKey: "fauna.abalone" }],
    commodities: [commodity()],
    productionChains: [
      {
        id: "chain.metal.iron_ingot",
        stages: [{ stageRef: "extract.mining.basic" }]
      }
    ],
    flora: [{ id: "flora.oak" }],
    fauna: [{ id: "fauna.sheep" }],
    biomes: [{ id: "biome.temperate_forest" }],
    habitats: [{ id: "habitat.riverbank" }],
    regions: [{ id: "region.kaelvar" }],
    mapFeatures: [{ id: "map_feature.iron_hills" }],
    ...overrides
  };
}

function commodityInput(records = [commodity()], overrides = {}) {
  return {
    relativePath: COMMODITY_CONTENT_PATH,
    wrapper: { records: structuredClone(records) },
    schema: structuredClone(commoditySchema),
    items: [item("iron_ore"), item("iron_ingot")],
    marketItemValues: [{ itemKey: "iron_ore" }, { itemKey: "fauna.abalone" }],
    resources: [resource()],
    productionChains: [{ id: "chain.metal.iron_ingot" }],
    recipes: [{ id: "recipe.iron_ingot_from_ore" }],
    ...overrides
  };
}

function resourceRecord(input) {
  return input.wrapper.records[0];
}

function commodityRecord(input) {
  return input.wrapper.records[0];
}

function ids(records) {
  return records.map((record) => record.id).sort();
}

function recordById(records, id) {
  const record = records.find((candidate) => candidate.id === id);
  assert.ok(record, `expected record ${id}`);
  return record;
}

function assertNoKeyDeep(value, forbiddenKeys, valuePath = "record") {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertNoKeyDeep(entry, forbiddenKeys, `${valuePath}[${index}]`));
    return;
  }
  if (typeof value !== "object" || value === null) {
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    assert.equal(forbiddenKeys.includes(key), false, `${valuePath}.${key} must be absent`);
    assertNoKeyDeep(child, forbiddenKeys, `${valuePath}.${key}`);
  }
}

function expectResourceFailure(mutate, expected) {
  const input = resourceInput();
  mutate(input);
  assert.throws(() => validateResourcesContent(input), expected);
}

function expectCommodityFailure(mutate, expected) {
  const input = commodityInput();
  mutate(input);
  assert.throws(() => validateCommoditiesContent(input), expected);
}

test("accepts valid minimal resource and commodity wrappers", () => {
  assert.deepEqual(validateResourcesContent(resourceInput()), {
    ok: true,
    resourceIds: ["resource.iron_ore"]
  });
  assert.deepEqual(validateCommoditiesContent(commodityInput()), {
    ok: true,
    commodityIds: ["commodity.iron_ore_lots"]
  });
});

test("accepts empty wrappers during schema-validator-only phase", () => {
  assert.deepEqual(validateResourcesContent(resourceInput([])), {
    ok: true,
    resourceIds: []
  });
  assert.deepEqual(validateCommoditiesContent(commodityInput([])), {
    ok: true,
    commodityIds: []
  });
});

test("accepts valid canonical item-key relationships", () => {
  assert.equal(validateResourcesContent(resourceInput([
    resource({ relatedItemKeys: ["iron_ore"] })
  ])).ok, true);
  assert.equal(validateCommoditiesContent(commodityInput([
    commodity({ relatedItemKeys: ["iron_ore"] })
  ])).ok, true);
});

test("accepts resource and commodity cross-references when peer records are supplied", () => {
  assert.equal(validateResourcesContent(resourceInput([
    resource({ relatedCommodityIds: ["commodity.iron_ore_lots"] })
  ])).ok, true);
  assert.equal(validateCommoditiesContent(commodityInput([
    commodity({ relatedResourceIds: ["resource.iron_ore"] })
  ])).ok, true);
});

test("accepts optional relationship arrays when empty", () => {
  assert.equal(validateResourcesContent(resourceInput([
    resource({
      relatedItemKeys: [],
      relatedCommodityIds: [],
      relatedFloraIds: [],
      relatedFaunaIds: [],
      relatedBiomeIds: [],
      relatedHabitatIds: [],
      relatedRegionIds: [],
      relatedMapFeatureIds: [],
      relatedProductionStageRefs: [],
      observedSettlementGoodsTerms: []
    })
  ])).ok, true);
  assert.equal(validateCommoditiesContent(commodityInput([
    commodity({
      relatedItemKeys: [],
      relatedResourceIds: [],
      relatedProductionChainIds: [],
      relatedRecipeIds: [],
      observedSettlementGoodsTerms: []
    })
  ])).ok, true);
});

test("accepts supported resource ecology, geography, and production-stage refs", () => {
  assert.equal(validateResourcesContent(resourceInput([
    resource({
      relatedFloraIds: ["flora.oak"],
      relatedFaunaIds: ["fauna.sheep"],
      relatedBiomeIds: ["biome.temperate_forest"],
      relatedHabitatIds: ["habitat.riverbank"],
      relatedRegionIds: ["region.kaelvar"],
      relatedMapFeatureIds: ["map_feature.iron_hills"],
      relatedProductionStageRefs: ["extract.mining.basic"]
    })
  ])).ok, true);
});

test("accepts supported commodity production-chain and recipe refs", () => {
  assert.equal(validateCommoditiesContent(commodityInput([
    commodity({
      relatedProductionChainIds: ["chain.metal.iron_ingot"],
      relatedRecipeIds: ["recipe.iron_ingot_from_ore"]
    })
  ])).ok, true);
});

test("does not mutate validator inputs", () => {
  const resourceValidationInput = resourceInput();
  const commodityValidationInput = commodityInput();
  const beforeResource = structuredClone(resourceValidationInput);
  const beforeCommodity = structuredClone(commodityValidationInput);

  validateResourcesContent(resourceValidationInput);
  validateCommoditiesContent(commodityValidationInput);

  assert.deepEqual(resourceValidationInput, beforeResource);
  assert.deepEqual(commodityValidationInput, beforeCommodity);
});

test("rejects invalid resource wrappers and strict record failures", async (t) => {
  const cases = [
    ["non-object wrapper", (input) => { input.wrapper = null; }, /wrapper must be an object/],
    ["extra wrapper key", (input) => { input.wrapper.version = 1; }, /exactly one top-level key/],
    ["missing records", (input) => { input.wrapper = {}; }, /exactly one top-level key/],
    ["non-array records", (input) => { input.wrapper.records = {}; }, /records must be an array/],
    ["extra record property", (input) => { resourceRecord(input).unexpectedField = true; }, /unsupported property 'unexpectedField'/]
  ];
  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectResourceFailure(mutate, expected));
  }
});

test("rejects invalid commodity wrappers and strict record failures", async (t) => {
  const cases = [
    ["non-object wrapper", (input) => { input.wrapper = null; }, /wrapper must be an object/],
    ["extra wrapper key", (input) => { input.wrapper.version = 1; }, /exactly one top-level key/],
    ["missing records", (input) => { input.wrapper = {}; }, /exactly one top-level key/],
    ["non-array records", (input) => { input.wrapper.records = {}; }, /records must be an array/],
    ["extra record property", (input) => { commodityRecord(input).unexpectedField = true; }, /unsupported property 'unexpectedField'/]
  ];
  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectCommodityFailure(mutate, expected));
  }
});

test("rejects resource identity and vocabulary failures", async (t) => {
  const cases = [
    ["malformed id", (input) => { resourceRecord(input).id = "world_resource.iron_ore"; }, /id must match pattern \^resource/],
    ["slug mismatch", (input) => { resourceRecord(input).slug = "copper_ore"; }, /slug must match id suffix 'iron_ore'/],
    ["duplicate id", (input) => { input.wrapper.records.push(structuredClone(resourceRecord(input))); }, /duplicate resource id 'resource\.iron_ore'/],
    ["duplicate slug", (input) => {
      const duplicate = resource({ id: "resource.other_iron_ore" });
      input.wrapper.records.push(duplicate);
    }, /duplicate resource slug 'iron_ore'/],
    ["duplicate name", (input) => {
      const duplicate = resource({ id: "resource.other_iron_ore", slug: "other_iron_ore" });
      input.wrapper.records.push(duplicate);
    }, /duplicate resource name 'Iron Ore'/],
    ["unknown status", (input) => { resourceRecord(input).status = "draft"; }, /status must be one of the schema enum values/],
    ["unknown family", (input) => { resourceRecord(input).family = "other"; }, /family must be one of the schema enum values/],
    ["unknown source domain", (input) => { resourceRecord(input).sourceDomains = ["invented"]; }, /sourceDomains\[0\] must be one of the schema enum values/],
    ["unknown allowed owner", (input) => { resourceRecord(input).allowedOwnerTypes = ["vendor_profile"]; }, /allowedOwnerTypes\[0\] must be one of the schema enum values/]
  ];
  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectResourceFailure(mutate, expected));
  }
});

test("rejects commodity identity and vocabulary failures", async (t) => {
  const cases = [
    ["malformed id", (input) => { commodityRecord(input).id = "world_commodity.iron_ore_lots"; }, /id must match pattern \^commodity/],
    ["slug mismatch", (input) => { commodityRecord(input).slug = "copper_ore_lots"; }, /slug must match id suffix 'iron_ore_lots'/],
    ["duplicate id", (input) => { input.wrapper.records.push(structuredClone(commodityRecord(input))); }, /duplicate commodity id 'commodity\.iron_ore_lots'/],
    ["duplicate slug", (input) => {
      const duplicate = commodity({ id: "commodity.other_iron_ore_lots" });
      input.wrapper.records.push(duplicate);
    }, /duplicate commodity slug 'iron_ore_lots'/],
    ["duplicate name", (input) => {
      const duplicate = commodity({ id: "commodity.other_iron_ore_lots", slug: "other_iron_ore_lots" });
      input.wrapper.records.push(duplicate);
    }, /duplicate commodity name 'Iron Ore Lots'/],
    ["unknown status", (input) => { commodityRecord(input).status = "draft"; }, /status must be one of the schema enum values/],
    ["unknown family", (input) => { commodityRecord(input).family = "other"; }, /family must be one of the schema enum values/],
    ["unknown trade category", (input) => { commodityRecord(input).tradeCategory = "retail_stock"; }, /tradeCategory must be one of the schema enum values/],
    ["unknown handling tag", (input) => { commodityRecord(input).handlingTags = ["warehoused"]; }, /handlingTags\[0\] must be one of the schema enum values/],
    ["unknown allowed owner", (input) => { commodityRecord(input).allowedOwnerTypes = ["service"]; }, /allowedOwnerTypes\[0\] must be one of the schema enum values/]
  ];
  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectCommodityFailure(mutate, expected));
  }
});

test("rejects tag shape, duplicates, and generic category tags", async (t) => {
  const resourceCases = [
    ["resource malformed tag", (input) => { resourceRecord(input).tags = ["Iron Ore"]; }, /tags\[0\] must match pattern/],
    ["resource duplicate tag", (input) => { resourceRecord(input).tags = ["ore", "ore"]; }, /tags must contain unique items/],
    ["resource generic tag", (input) => { resourceRecord(input).tags = ["custom"]; }, /must not use generic category vocabulary/],
    ["resource forbidden-intent tag", (input) => { resourceRecord(input).tags = ["market_price"]; }, /implies forbidden resource state/]
  ];
  for (const [name, mutate, expected] of resourceCases) {
    await t.test(name, () => expectResourceFailure(mutate, expected));
  }

  const commodityCases = [
    ["commodity malformed tag", (input) => { commodityRecord(input).tags = ["Iron Ore"]; }, /tags\[0\] must match pattern/],
    ["commodity duplicate tag", (input) => { commodityRecord(input).tags = ["ore", "ore"]; }, /tags must contain unique items/],
    ["commodity generic tag", (input) => { commodityRecord(input).tags = ["misc"]; }, /must not use generic category vocabulary/],
    ["commodity forbidden-intent tag", (input) => { commodityRecord(input).tags = ["cargo_manifest"]; }, /implies forbidden commodity state/]
  ];
  for (const [name, mutate, expected] of commodityCases) {
    await t.test(name, () => expectCommodityFailure(mutate, expected));
  }
});

test("rejects unresolved and market-only related item keys", async (t) => {
  await t.test("resource unresolved item key", () => {
    expectResourceFailure(
      (input) => { resourceRecord(input).relatedItemKeys = ["missing_ore"]; },
      /relatedItemKeys 'missing_ore' is missing from items\.items/
    );
  });
  await t.test("commodity unresolved item key", () => {
    expectCommodityFailure(
      (input) => { commodityRecord(input).relatedItemKeys = ["missing_ore"]; },
      /relatedItemKeys 'missing_ore' is missing from items\.items/
    );
  });
  await t.test("resource market-only item key", () => {
    expectResourceFailure(
      (input) => { resourceRecord(input).relatedItemKeys = ["fauna.abalone"]; },
      /market-only and is not an items\.items itemKey/
    );
  });
  await t.test("commodity market-only item key", () => {
    expectCommodityFailure(
      (input) => { commodityRecord(input).relatedItemKeys = ["fauna.abalone"]; },
      /market-only and is not an items\.items itemKey/
    );
  });
});

test("rejects unresolved resource and commodity cross-references", async (t) => {
  await t.test("resource unresolved commodity", () => {
    expectResourceFailure(
      (input) => { resourceRecord(input).relatedCommodityIds = ["commodity.missing_lots"]; },
      /relatedCommodityIds 'commodity\.missing_lots' is missing from world\.commodities/
    );
  });
  await t.test("commodity unresolved resource", () => {
    expectCommodityFailure(
      (input) => { commodityRecord(input).relatedResourceIds = ["resource.missing_ore"]; },
      /relatedResourceIds 'resource\.missing_ore' is missing from world\.resources/
    );
  });
});

test("rejects unresolved ecology, geography, production-stage, production-chain, and recipe refs", async (t) => {
  const resourceCases = [
    ["missing flora", (input) => { resourceRecord(input).relatedFloraIds = ["flora.missing"]; }, /relatedFloraIds 'flora\.missing' is missing from world\.flora/],
    ["missing fauna", (input) => { resourceRecord(input).relatedFaunaIds = ["fauna.missing"]; }, /relatedFaunaIds 'fauna\.missing' is missing from world\.fauna/],
    ["missing biome", (input) => { resourceRecord(input).relatedBiomeIds = ["biome.missing"]; }, /relatedBiomeIds 'biome\.missing' is missing from world\.biomes/],
    ["missing habitat", (input) => { resourceRecord(input).relatedHabitatIds = ["habitat.missing"]; }, /relatedHabitatIds 'habitat\.missing' is missing from world\.habitats/],
    ["missing region", (input) => { resourceRecord(input).relatedRegionIds = ["region.missing"]; }, /relatedRegionIds 'region\.missing' is missing from world\.regions/],
    ["missing map feature", (input) => { resourceRecord(input).relatedMapFeatureIds = ["map_feature.missing"]; }, /relatedMapFeatureIds 'map_feature\.missing' is missing from world\.map_features/],
    ["missing production stage", (input) => { resourceRecord(input).relatedProductionStageRefs = ["extract.mining.deep"]; }, /relatedProductionStageRefs 'extract\.mining\.deep' is missing/]
  ];
  for (const [name, mutate, expected] of resourceCases) {
    await t.test(name, () => expectResourceFailure(mutate, expected));
  }

  const commodityCases = [
    ["missing production chain", (input) => { commodityRecord(input).relatedProductionChainIds = ["chain.missing"]; }, /relatedProductionChainIds 'chain\.missing' is missing from civilization\.production_chains/],
    ["missing recipe", (input) => { commodityRecord(input).relatedRecipeIds = ["recipe.missing"]; }, /relatedRecipeIds 'recipe\.missing' is missing from crafting\.recipes/]
  ];
  for (const [name, mutate, expected] of commodityCases) {
    await t.test(name, () => expectCommodityFailure(mutate, expected));
  }
});

test("rejects relationship fields when corresponding authority records are absent", async (t) => {
  await t.test("resource item refs require items", () => {
    expectResourceFailure(
      (input) => {
        delete input.items;
        resourceRecord(input).relatedItemKeys = ["iron_ore"];
      },
      /relatedItemKeys requires items\.items/
    );
  });
  await t.test("commodity resource refs require resources", () => {
    expectCommodityFailure(
      (input) => {
        delete input.resources;
        commodityRecord(input).relatedResourceIds = ["resource.iron_ore"];
      },
      /relatedResourceIds requires world\.resources/
    );
  });
});

test("rejects forbidden resource fields recursively", async (t) => {
  const fields = [
    "baseValue",
    "pricingProfile",
    "stock",
    "supply",
    "demand",
    "cargoContents",
    "storageContents",
    "node",
    "depletion",
    "respawn",
    "harvestRoll",
    "extractionRate",
    "skillCheck",
    "toolRequirement",
    "accessCheck",
    "runtimeState",
    "uiState",
    "effect",
    "command",
    "event",
    "reward",
    "saveState",
    "accountState",
    "gameplayEffects"
  ];
  for (const field of fields) {
    await t.test(field, () => {
      expectResourceFailure(
        (input) => { resourceRecord(input)[field] = {}; },
        new RegExp(`forbidden field '${field}'`)
      );
    });
  }
  await t.test("nested forbidden field", () => {
    expectResourceFailure(
      (input) => { resourceRecord(input).notes = ["Static note."]; resourceRecord(input).nested = { prices: {} }; },
      /forbidden field 'prices'/
    );
  });
});

test("rejects forbidden commodity fields recursively", async (t) => {
  const fields = [
    "baseValue",
    "valueProfile",
    "pricingMode",
    "price",
    "fee",
    "payment",
    "wallet",
    "stock",
    "inventory",
    "vendorInventory",
    "shopInventory",
    "restock",
    "cargo",
    "cargoMovement",
    "storageContents",
    "itemInstance",
    "quantity",
    "currentQuantity",
    "runtimeState",
    "uiState",
    "effect",
    "command",
    "event",
    "reward",
    "saveState",
    "accountState",
    "gameplayEffects"
  ];
  for (const field of fields) {
    await t.test(field, () => {
      expectCommodityFailure(
        (input) => { commodityRecord(input)[field] = {}; },
        new RegExp(`forbidden field '${field}'`)
      );
    });
  }
  await t.test("nested forbidden field", () => {
    expectCommodityFailure(
      (input) => { commodityRecord(input).nested = { cargoMovement: {} }; },
      /forbidden field 'cargoMovement'/
    );
  });
});

test("live resource and commodity seed is registered in normal content lint", async () => {
  const schemaTestSource = await readFile(path.join(ROOT, "tests/unit/schema-files.test.mjs"), "utf8");
  const contentLintSource = await readFile(path.join(ROOT, "tools/content-lint/index.mjs"), "utf8");
  const resourceValidatorSource = await readFile(path.join(ROOT, RESOURCE_VALIDATOR_PATH), "utf8");
  const commodityValidatorSource = await readFile(path.join(ROOT, COMMODITY_VALIDATOR_PATH), "utf8");
  const resourcesWrapper = await readJson(RESOURCE_CONTENT_PATH);
  const commoditiesWrapper = await readJson(COMMODITY_CONTENT_PATH);
  const itemsWrapper = await readJson(ITEM_CONTENT_PATH);
  const marketItemValuesWrapper = await readJson(MARKET_ITEM_VALUES_PATH);
  const checksStart = contentLintSource.indexOf("const checks = [");
  const checksEnd = contentLintSource.indexOf("\n];", checksStart);
  const checksSource = contentLintSource.slice(checksStart, checksEnd);
  const itemKeys = new Set(itemsWrapper.records.map((record) => record.itemKey));
  const marketOnlyKeys = new Set(
    marketItemValuesWrapper.records
      .map((record) => record.itemKey)
      .filter((itemKey) => typeof itemKey === "string" && !itemKeys.has(itemKey))
  );
  const forbiddenRuntimeFields = [
    "baseValue",
    "currencyId",
    "valueUnit",
    "valueProfile",
    "pricingProfile",
    "pricingMode",
    "price",
    "prices",
    "stock",
    "inventory",
    "vendorInventory",
    "shopInventory",
    "cargo",
    "cargoMovement",
    "cargoContents",
    "storage",
    "storageContents",
    "extraction",
    "extractionRate",
    "execution",
    "runtime",
    "runtimeState",
    "UI",
    "ui",
    "uiState",
    "save",
    "saveState",
    "account",
    "accountState",
    "gameplay",
    "gameplayEffects"
  ];

  assert.equal(existsSync(path.join(ROOT, RESOURCE_SCHEMA_PATH)), true);
  assert.equal(existsSync(path.join(ROOT, COMMODITY_SCHEMA_PATH)), true);
  assert.equal(existsSync(path.join(ROOT, RESOURCE_VALIDATOR_PATH)), true);
  assert.equal(existsSync(path.join(ROOT, COMMODITY_VALIDATOR_PATH)), true);
  assert.equal(existsSync(path.join(ROOT, TEST_PATH)), true);
  assert.equal(existsSync(path.join(ROOT, RESOURCE_CONTENT_PATH)), true);
  assert.equal(existsSync(path.join(ROOT, COMMODITY_CONTENT_PATH)), true);
  assert.match(schemaTestSource, /packages\/schemas\/world\/resource\.schema\.json/);
  assert.match(schemaTestSource, /packages\/schemas\/world\/commodity\.schema\.json/);
  assert.ok(checksStart >= 0);
  assert.ok(checksEnd > checksStart);

  assert.deepEqual(validateResourcesContent({
    relativePath: RESOURCE_CONTENT_PATH,
    wrapper: resourcesWrapper,
    schema: resourceSchema,
    items: itemsWrapper,
    marketItemValues: marketItemValuesWrapper,
    commodities: commoditiesWrapper
  }), {
    ok: true,
    resourceIds: ["resource.grain", "resource.iron_ore"]
  });
  assert.deepEqual(validateCommoditiesContent({
    relativePath: COMMODITY_CONTENT_PATH,
    wrapper: commoditiesWrapper,
    schema: commoditySchema,
    items: itemsWrapper,
    marketItemValues: marketItemValuesWrapper,
    resources: resourcesWrapper
  }), {
    ok: true,
    commodityIds: ["commodity.grain_bundles", "commodity.iron_ore_lots"]
  });

  assert.deepEqual(ids(resourcesWrapper.records), ["resource.grain", "resource.iron_ore"]);
  assert.deepEqual(ids(commoditiesWrapper.records), ["commodity.grain_bundles", "commodity.iron_ore_lots"]);
  assert.deepEqual(resourcesWrapper.records.map((record) => record.status), ["planned", "planned"]);
  assert.deepEqual(commoditiesWrapper.records.map((record) => record.status), ["planned", "planned"]);

  assert.deepEqual(recordById(resourcesWrapper.records, "resource.iron_ore").relatedItemKeys, ["iron_ore"]);
  assert.deepEqual(recordById(resourcesWrapper.records, "resource.iron_ore").relatedCommodityIds, ["commodity.iron_ore_lots"]);
  assert.deepEqual(recordById(resourcesWrapper.records, "resource.grain").relatedItemKeys, ["grain_bundle"]);
  assert.deepEqual(recordById(resourcesWrapper.records, "resource.grain").relatedCommodityIds, ["commodity.grain_bundles"]);
  assert.deepEqual(recordById(commoditiesWrapper.records, "commodity.iron_ore_lots").relatedItemKeys, ["iron_ore"]);
  assert.deepEqual(recordById(commoditiesWrapper.records, "commodity.iron_ore_lots").relatedResourceIds, ["resource.iron_ore"]);
  assert.deepEqual(recordById(commoditiesWrapper.records, "commodity.grain_bundles").relatedItemKeys, ["grain_bundle"]);
  assert.deepEqual(recordById(commoditiesWrapper.records, "commodity.grain_bundles").relatedResourceIds, ["resource.grain"]);

  for (const itemKey of resourcesWrapper.records.flatMap((record) => record.relatedItemKeys)) {
    assert.equal(itemKeys.has(itemKey), true);
    assert.equal(marketOnlyKeys.has(itemKey), false);
  }
  for (const itemKey of commoditiesWrapper.records.flatMap((record) => record.relatedItemKeys)) {
    assert.equal(itemKeys.has(itemKey), true);
    assert.equal(marketOnlyKeys.has(itemKey), false);
  }

  for (const record of resourcesWrapper.records) {
    assert.equal(Object.hasOwn(record, "relatedProductionStageRefs"), false);
    assert.equal(Object.hasOwn(record, "relatedFloraIds"), false);
    assert.equal(Object.hasOwn(record, "relatedFaunaIds"), false);
    assert.equal(Object.hasOwn(record, "relatedBiomeIds"), false);
    assert.equal(Object.hasOwn(record, "relatedHabitatIds"), false);
    assert.equal(Object.hasOwn(record, "relatedRegionIds"), false);
    assert.equal(Object.hasOwn(record, "relatedMapFeatureIds"), false);
    assert.equal(Object.hasOwn(record, "observedSettlementGoodsTerms"), false);
    assertNoKeyDeep(record, forbiddenRuntimeFields, record.id);
  }
  for (const record of commoditiesWrapper.records) {
    assert.equal(Object.hasOwn(record, "relatedProductionChainIds"), false);
    assert.equal(Object.hasOwn(record, "relatedRecipeIds"), false);
    assert.equal(Object.hasOwn(record, "observedSettlementGoodsTerms"), false);
    assertNoKeyDeep(record, forbiddenRuntimeFields, record.id);
  }

  assert.equal(
    checksSource.match(/packages\/content\/base\/world\/resources\.json/g)?.length,
    1
  );
  assert.equal(
    checksSource.match(/packages\/content\/base\/world\/commodities\.json/g)?.length,
    1
  );
  assert.equal(contentLintSource.match(/from "\.\/resources\.mjs"/g)?.length, 1);
  assert.equal(contentLintSource.match(/from "\.\/commodities\.mjs"/g)?.length, 1);
  assert.doesNotMatch(resourceValidatorSource, /^import .*from ["'][^"']*(?:apps\/rpg-ui|runtime|game-shell|save|account)/m);
  assert.doesNotMatch(commodityValidatorSource, /^import .*from ["'][^"']*(?:apps\/rpg-ui|runtime|game-shell|save|account)/m);
});
