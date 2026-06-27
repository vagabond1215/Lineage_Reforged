import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { validateSettlementEconomies } from "../../tools/content-lint/settlement-economies.mjs";

const ROOT = process.cwd();
const SETTLEMENT_ECONOMY_PATH = "packages/content/base/world/settlement_economies.json";

async function readJson(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath), "utf8");
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

const schema = await readJson("packages/schemas/world/settlement-economy.schema.json");
const settlementsWrapper = await readJson("packages/content/base/world/settlements.json");
const itemWrapper = await readJson("packages/content/base/items/items.json");
const workplaceWrapper = await readJson("packages/content/base/civilization/workplaces.json");
const productionChainWrapper = await readJson("packages/content/base/civilization/production_chains.json");
const guildWrapper = await readJson("packages/content/base/civilization/guilds.json");

function settlementEconomy(overrides = {}) {
  return {
    id: "settlement_economy.aurelis",
    slug: "aurelis",
    settlementId: "settlement.aurelis",
    summary: "In-memory settlement economy fixture for static descriptive validation.",
    economicRole: {
      dominantRole: "administration",
      secondaryRoles: ["regional_trade"]
    },
    specializationTags: ["civic_exchange", "ledger_work"],
    marketScale: "regional",
    marketOrder: "permanent_market",
    economicBands: {
      wealthBand: "comfortable",
      resilienceBand: "steady",
      scarcityBand: "adequate",
      seasonalityBand: "stable",
      importBand: "moderate",
      exportBand: "low",
      dependencyBand: "moderate"
    },
    tradePosture: {
      importPosture: "moderate",
      exportPosture: "low",
      dependencyPosture: "moderate",
      notes: ["Descriptive import and export posture only."]
    },
    itemPostures: [],
    industryPosture: {
      workplaceRefs: [],
      productionChainRefs: [],
      industryTags: ["administration"],
      notes: []
    },
    guildRefs: [],
    routeDependenceNotes: [],
    status: "planned",
    sourceAuthorityNotes: [
      "Fixture only; no live settlement-economy content is authored by this test."
    ],
    notes: [
      "Static descriptive authority only; no prices, stock, trade topology, runtime, UI, storage, command, event, reward, or gameplay behavior."
    ],
    ...overrides
  };
}

function makeInput(records = [settlementEconomy()], overrides = {}) {
  return {
    relativePath: SETTLEMENT_ECONOMY_PATH,
    wrapper: { records: structuredClone(records) },
    schema: structuredClone(schema),
    settlements: structuredClone(settlementsWrapper.records),
    items: structuredClone(itemWrapper.records),
    workplaces: structuredClone(workplaceWrapper.records),
    productionChains: structuredClone(productionChainWrapper.records),
    guilds: structuredClone(guildWrapper.records),
    ...overrides
  };
}

function validateInput(input = makeInput()) {
  return validateSettlementEconomies(input);
}

function record(input) {
  return input.wrapper.records[0];
}

function expectFailure(mutate, expected) {
  const input = makeInput();
  mutate(input);
  assert.throws(() => validateInput(input), expected);
}

test("accepts valid minimal planned settlement economy for an existing settlement", () => {
  assert.deepEqual(validateInput(), {
    ok: true,
    settlementEconomyIds: ["settlement_economy.aurelis"]
  });
});

test("accepts valid active settlement economy for an existing settlement", () => {
  const input = makeInput([
    settlementEconomy({
      id: "settlement_economy.vinecross",
      slug: "vinecross",
      settlementId: "settlement.vinecross",
      status: "active",
      economicRole: {
        dominantRole: "agricultural_production",
        secondaryRoles: []
      },
      specializationTags: ["viticulture"]
    })
  ]);

  assert.equal(validateInput(input).ok, true);
});

test("accepts empty optional posture reference arrays", () => {
  const input = makeInput();
  assert.deepEqual(record(input).itemPostures, []);
  assert.deepEqual(record(input).industryPosture.workplaceRefs, []);
  assert.deepEqual(record(input).industryPosture.productionChainRefs, []);
  assert.deepEqual(record(input).guildRefs, []);
  assert.deepEqual(record(input).routeDependenceNotes, []);
  assert.equal(validateInput(input).ok, true);
});

test("accepts canonical item, workplace, production-chain, and guild references", async (t) => {
  const cases = [
    [
      "canonical item posture",
      {
        itemPostures: [
          {
            itemKey: "iron_ore",
            role: "regular_import",
            notes: ["Canonical item key only; no copied values or prices."]
          }
        ]
      }
    ],
    [
      "workplace ref",
      {
        industryPosture: {
          workplaceRefs: ["workplace.bloomery_forge"],
          productionChainRefs: [],
          industryTags: ["metalwork"],
          notes: []
        }
      }
    ],
    [
      "production-chain ref",
      {
        industryPosture: {
          workplaceRefs: [],
          productionChainRefs: ["chain.metal.iron_ingot"],
          industryTags: ["smelting"],
          notes: []
        }
      }
    ],
    [
      "guild ref",
      {
        guildRefs: ["guild.smiths_guild"]
      }
    ]
  ];

  for (const [name, overrides] of cases) {
    await t.test(name, () => {
      assert.equal(validateInput(makeInput([settlementEconomy(overrides)])).ok, true);
    });
  }
});

test("does not mutate settlement-economy validation inputs", () => {
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
      "settlement embedded economy field",
      (input) => { record(input).economicModel = {}; },
      /structural validation failed: wrapper\.records\[0\] has unsupported property 'economicModel'/
    ]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects settlement-economy identity and settlement-reference failures", async (t) => {
  await t.test("duplicate id", () => {
    expectFailure(
      (input) => { input.wrapper.records.push(structuredClone(record(input))); },
      /duplicate settlement-economy id 'settlement_economy\.aurelis'/
    );
  });
  await t.test("duplicate slug", () => {
    expectFailure(
      (input) => {
        const duplicate = structuredClone(record(input));
        duplicate.id = "settlement_economy.other";
        input.wrapper.records.push(duplicate);
      },
      /duplicate settlement-economy slug 'aurelis'/
    );
  });
  await t.test("duplicate settlementId", () => {
    expectFailure(
      (input) => {
        const duplicate = structuredClone(record(input));
        duplicate.id = "settlement_economy.other";
        duplicate.slug = "other";
        input.wrapper.records.push(duplicate);
      },
      /duplicate settlementId 'settlement\.aurelis'/
    );
  });
  await t.test("id slug mismatch", () => {
    expectFailure(
      (input) => { record(input).slug = "vinecross"; },
      /id must equal settlement_economy\.vinecross/
    );
  });
  await t.test("slug settlementId mismatch", () => {
    expectFailure(
      (input) => { record(input).settlementId = "settlement.vinecross"; },
      /settlementId must equal settlement\.aurelis/
    );
  });
  await t.test("missing settlement reference", () => {
    expectFailure(
      (input) => {
        record(input).id = "settlement_economy.missing_settlement";
        record(input).slug = "missing_settlement";
        record(input).settlementId = "settlement.missing_settlement";
      },
      /settlementId 'settlement\.missing_settlement' is missing or inactive/
    );
  });
});

test("rejects invalid lifecycle, market, role, tag, and band vocabularies", async (t) => {
  const cases = [
    ["invalid lifecycle status", (input) => { record(input).status = "draft"; }, /status must be one of the schema enum values/],
    ["invalid marketScale", (input) => { record(input).marketScale = "global"; }, /marketScale must be one of the schema enum values/],
    ["invalid marketOrder", (input) => { record(input).marketOrder = "automated_exchange"; }, /marketOrder must be one of the schema enum values/],
    ["invalid dominant economic role", (input) => { record(input).economicRole.dominantRole = "price_simulation"; }, /dominantRole must be one of the schema enum values/],
    ["duplicate secondary roles", (input) => { record(input).economicRole.secondaryRoles = ["regional_trade", "regional_trade"]; }, /secondaryRoles must contain unique items/],
    ["duplicate specialization tags", (input) => { record(input).specializationTags = ["civic_exchange", "civic_exchange"]; }, /specializationTags must contain unique items/],
    ["invalid specialization tag shape", (input) => { record(input).specializationTags = ["Civic Exchange"]; }, /specializationTags\[0\] must match pattern/],
    ["invalid qualitative band value", (input) => { record(input).economicBands.wealthBand = "score_10"; }, /wealthBand must be one of the schema enum values/]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects item posture reference and duplication failures", async (t) => {
  await t.test("duplicate item posture", () => {
    expectFailure(
      (input) => {
        record(input).itemPostures = [
          { itemKey: "iron_ore", role: "regular_import", notes: [] },
          { itemKey: "iron_ore", role: "regular_import", notes: ["Different note."] }
        ];
      },
      /repeats item posture 'iron_ore:regular_import'/
    );
  });
  await t.test("missing item key property", () => {
    expectFailure(
      (input) => { record(input).itemPostures = [{ role: "regular_import", notes: [] }]; },
      /itemPostures\[0\] is missing required property 'itemKey'/
    );
  });
  await t.test("item id rejected instead of canonical key", () => {
    expectFailure(
      (input) => { record(input).itemPostures = [{ itemKey: "item.iron_ore", role: "regular_import", notes: [] }]; },
      /must use canonical itemKey, not item\.<key>/
    );
  });
  await t.test("missing canonical item", () => {
    expectFailure(
      (input) => { record(input).itemPostures = [{ itemKey: "missing_ore", role: "regular_import", notes: [] }]; },
      /itemPostures\.itemKey 'missing_ore' is missing from items\.items/
    );
  });
});

test("rejects unresolved industry and guild references", async (t) => {
  const cases = [
    [
      "missing workplace ref",
      (input) => { record(input).industryPosture.workplaceRefs = ["workplace.missing_forge"]; },
      /workplaceRefs 'workplace\.missing_forge' is missing from civilization\.workplaces/
    ],
    [
      "missing production-chain ref",
      (input) => { record(input).industryPosture.productionChainRefs = ["chain.missing.process"]; },
      /productionChainRefs 'chain\.missing\.process' is missing from civilization\.production_chains/
    ],
    [
      "missing guild ref",
      (input) => { record(input).guildRefs = ["guild.missing_guild"]; },
      /guildRefs 'guild\.missing_guild' is missing from civilization\.guilds/
    ]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects forbidden economy, topology, market, production, law, Knowledge, runtime, and gameplay fields", async (t) => {
  const forbiddenFieldCases = [
    ["free-form resource id", "resourceIds"],
    ["free-form commodity id", "commodityIds"],
    ["free-form goods catalog", "goodsCatalog"],
    ["route topology refs", "routeIds"],
    ["market profile duplication", "marketProfileId"],
    ["market value duplication", "baseValue"],
    ["exact price duplication", "basePrice"],
    ["stock count", "stockCounts"],
    ["supply field", "supply"],
    ["demand field", "demand"],
    ["runtime market field", "tradeState"],
    ["labor field", "laborState"],
    ["throughput field", "throughput"],
    ["production tick field", "productionTicks"],
    ["output field", "outputs"],
    ["recipe field", "recipeIds"],
    ["crafting estimate field", "craftingEstimates"],
    ["service field", "serviceIds"],
    ["vendor field", "vendorIds"],
    ["shop field", "shopIds"],
    ["law field", "lawIds"],
    ["tax field", "taxRates"],
    ["tariff field", "tariffRates"],
    ["toll field", "tollRates"],
    ["customs field", "customsRules"],
    ["property field", "propertyIds"],
    ["ownership field", "ownership"],
    ["Knowledge domain field", "knowledgeDomainId"],
    ["Knowledge refs field", "knowledgeRefs"],
    ["runtime field", "runtimeState"],
    ["UI field", "uiState"],
    ["storage field", "storageState"],
    ["command field", "commandRefs"],
    ["event field", "eventRefs"],
    ["reward field", "rewardRefs"],
    ["gameplay field", "gameplayEffects"],
    ["profession field", "professionIds"],
    ["institution field", "institutionIds"],
    ["settlement identity duplication", "settlementName"],
    ["embedded domestic trade copy", "domesticTradeFlows"],
    ["embedded guild presence copy", "guildPresence"],
    ["market tier copy", "marketTier"]
  ];

  for (const [name, field] of forbiddenFieldCases) {
    await t.test(name, () => {
      expectFailure(
        (input) => { record(input)[field] = {}; },
        new RegExp(`unsupported property '${field}'`)
      );
    });
  }

  await t.test("route dependence note with topology id", () => {
    expectFailure(
      (input) => { record(input).routeDependenceNotes = ["Depends on route.aurelis_vinecross."]; },
      /routeDependenceNotes must not contain topology reference/
    );
  });
});

test("settlement embedded economy fields are not migrated or copied", () => {
  const input = makeInput();

  assert.equal(Object.hasOwn(record(input), "economicModel"), false);
  assert.equal(Object.hasOwn(record(input), "tradeDependencyProfile"), false);
  assert.equal(Object.hasOwn(record(input), "domesticResourceProfile"), false);
  assert.equal(Object.hasOwn(record(input), "domesticTradeFlows"), false);
  assert.equal(Object.hasOwn(record(input), "guildPresence"), false);
  assert.equal(Object.hasOwn(record(input), "infrastructureProfile"), false);
  assert.equal(validateInput(input).ok, true);
});

test("schema is registered while live content and normal lint registration remain absent", async () => {
  const schemaTestSource = await readFile(path.join(ROOT, "tests/unit/schema-files.test.mjs"), "utf8");
  const contentLintSource = await readFile(path.join(ROOT, "tools/content-lint/index.mjs"), "utf8");

  assert.match(schemaTestSource, /packages\/schemas\/world\/settlement-economy\.schema\.json/);
  assert.equal(existsSync(path.join(ROOT, SETTLEMENT_ECONOMY_PATH)), false);
  assert.doesNotMatch(contentLintSource, /settlement_economies\.json/);
  assert.doesNotMatch(contentLintSource, /settlement-economies\.mjs/);
});
