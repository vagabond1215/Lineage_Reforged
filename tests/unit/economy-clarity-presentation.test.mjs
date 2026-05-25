import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  buildCraftCostClarityViewModel,
  buildEconomyPriceClarityViewModel,
  buildTradeOpportunityClarityViewModel
} from "../../apps/rpg-ui/src/game-shell/economyClarityPresentation.ts";

function createPrice(overrides = {}) {
  return {
    itemKey: "grain",
    baseProductionCost: 80,
    effectiveProductionCost: 90,
    estimatedMarketValue: 100,
    localBuyPrice: 100,
    localSellPrice: 84,
    spread: 16,
    pressureSources: [
      {
        source: "demand_band",
        factor: 1.12,
        impact: 0.12,
        note: "demand band utility"
      }
    ],
    ...overrides
  };
}

function createStockPressure(overrides = {}) {
  return {
    itemKey: "grain",
    stockLevel: 8,
    reservePerTick: 4,
    tradeSurplusPerTick: 0,
    unmetDemandPerTick: 0,
    netPerTick: 0,
    supplyPressure: 0,
    demandPressure: 0,
    ...overrides
  };
}

function createSupplyDemand(overrides = {}) {
  return {
    settlementId: "settlement.vinecross",
    surplusGoods: [],
    shortageGoods: [],
    exportGoods: [],
    importGoods: [],
    consumptionGoods: [],
    tradeDependencies: [],
    notes: [],
    ...overrides
  };
}

function createLaborPressure(overrides = {}) {
  return {
    skillId: "skill.craft.cooking",
    availability: 1,
    pressure: 1,
    supportingSupplyPerTick: 1,
    shortfallPerTick: 0,
    ...overrides
  };
}

function createMarketState(overrides = {}) {
  return {
    settlementId: "settlement.vinecross",
    tick: 12,
    productionCapacityModifier: 1,
    stock: [createStockPressure()],
    laborPressure: [createLaborPressure()],
    priceView: [createPrice()],
    ...overrides
  };
}

function createTradeOpportunity(overrides = {}) {
  return {
    opportunityId: "trade.vinecross.aurelis.grain.cart",
    originSettlementId: "settlement.vinecross",
    destinationSettlementId: "settlement.aurelis",
    itemKey: "grain",
    modeId: "route.mode.cart",
    vehicleId: "vehicle.ox_cart",
    viable: true,
    strategicNecessity: false,
    projectedQuantity: 20,
    projectedLoadUnits: 16,
    fillRatio: 0.7,
    exportableSurplus: 30,
    protectedReserve: 4,
    destinationAbsorption: 25,
    originSellPrice: 80,
    destinationBuyPrice: 100,
    unitMargin: 20,
    projectedGrossMargin: 400,
    projectedNetMargin: 120,
    routeTimeDays: 4,
    cycleDays: 9,
    routeIds: ["route.vinecross_aurelis"],
    rejectionReasons: [],
    explanation: ["Stored trade evaluation explains the route."],
    ...overrides
  };
}

function createItemValue(overrides = {}) {
  return {
    itemKey: "bread",
    baseProductionCost: 20,
    effectiveProductionCost: 24,
    estimatedMarketValue: 32,
    profitMarginEstimate: 8,
    resolutionPath: ["chain.food.bread", "step.mix", "step.bake"],
    explanation: [
      {
        source: "recipe_chain",
        factor: 1,
        impact: 0,
        note: "derived from chain.food.bread"
      }
    ],
    ...overrides
  };
}

function createCraft(overrides = {}) {
  return {
    chainId: "chain.food.bread",
    settlementId: "settlement.vinecross",
    primarySkillId: "skill.craft.cooking",
    targetOutputItemKey: "bread",
    outputQuantity: 1,
    processingTimeHours: 3,
    laborCost: 36,
    materialCost: 46,
    processingCost: 32,
    wasteCost: 14,
    totalCost: 100,
    inputConsumption: [
      {
        itemKey: "grain",
        quantity: 2,
        unitCost: 10,
        totalCost: 20
      }
    ],
    outputs: [
      {
        itemKey: "bread",
        quantity: 1,
        role: "primary",
        unitValueBasis: 120,
        totalValueBasis: 120
      }
    ],
    explanation: {
      selectedVariantId: null,
      valuePropagation: {
        materialCostMode: "carry_forward",
        laborCostMode: "estimated",
        processingCostMode: "estimated",
        difficultyMode: "moderate",
        demandBand: "common",
        carriesForward: true
      },
      stepBreakdown: [
        {
          stepId: "step.bake",
          stageRef: "workplace.bakehouse",
          operation: "bake",
          skillId: "skill.craft.cooking",
          skillRank: 20,
          minimumRank: 5,
          effectiveRequiredRank: 7,
          inputItems: ["grain"],
          outputItems: ["bread"],
          materialCost: 46,
          laborCost: 36,
          processingCost: 32,
          wasteCost: 14,
          processingTimeHours: 3,
          materialDifficultyFactor: 1,
          skillTimeFactor: 1,
          skillQualityFactor: 1,
          quantityFactor: 1,
          appliedDimensions: ["timeEfficiency", "waste"],
          laborRate: 12,
          notes: ["fuel shortfall increased time", "missing supportive tools", "waste risk remains visible"]
        }
      ],
      notes: ["tool availability evaluated", "fuel assumptions reviewed"]
    },
    ...overrides
  };
}

function findRow(rows, id) {
  return rows.find((row) => row.id === id) ?? null;
}

function assertNoActions(viewModel) {
  assert.deepEqual(viewModel.actionIds, []);
}

test("missing price input returns Unknown, warnings, and no actions", () => {
  const viewModel = buildEconomyPriceClarityViewModel({});

  assert.equal(viewModel.priceLabel, "Unknown");
  assert.equal(viewModel.spreadLabel, "Unknown spread");
  assert.deepEqual(viewModel.scarcityLabels, ["Unknown pressure"]);
  assert.ok(viewModel.warningLabels.includes("No item key was supplied."));
  assert.ok(viewModel.warningLabels.includes("No current price data was supplied."));
  assertNoActions(viewModel);
});

test("cheap, fair, and expensive labels derive from local buy price versus estimated value", () => {
  assert.equal(buildEconomyPriceClarityViewModel({ price: createPrice({ localBuyPrice: 92 }) }).priceLabel, "Cheap");
  assert.equal(buildEconomyPriceClarityViewModel({ price: createPrice({ localBuyPrice: 100 }) }).priceLabel, "Fair");
  assert.equal(buildEconomyPriceClarityViewModel({ price: createPrice({ localBuyPrice: 112 }) }).priceLabel, "Expensive");
});

test("tight, normal, and wide spread labels derive from stored spread", () => {
  assert.equal(buildEconomyPriceClarityViewModel({ price: createPrice({ spread: 12 }) }).spreadLabel, "Tight spread");
  assert.equal(buildEconomyPriceClarityViewModel({ price: createPrice({ spread: 18 }) }).spreadLabel, "Normal spread");
  assert.equal(buildEconomyPriceClarityViewModel({ price: createPrice({ spread: 24 }) }).spreadLabel, "Wide spread");
});

test("pressure source rows preserve stored source and note data", () => {
  const viewModel = buildEconomyPriceClarityViewModel({
    price: createPrice({
      pressureSources: [
        {
          source: "local_sourcing",
          factor: 1.2,
          impact: 0.2,
          note: "local stock pressure adjusted source effort"
        }
      ]
    })
  });

  assert.equal(viewModel.pressureRows[0]?.label, "Local Sourcing");
  assert.equal(viewModel.pressureRows[0]?.valueLabel, "Factor 1.2");
  assert.equal(viewModel.pressureRows[0]?.detailLabel, "local stock pressure adjusted source effort");
});

test("scarce label derives from shortage goods, unmet demand, or demand pressure", () => {
  const byShortage = buildEconomyPriceClarityViewModel({
    itemKey: "grain",
    price: createPrice(),
    supplyDemand: createSupplyDemand({ shortageGoods: ["grain"] })
  });
  const byPressure = buildEconomyPriceClarityViewModel({
    itemKey: "grain",
    price: createPrice(),
    stockPressure: createStockPressure({ unmetDemandPerTick: 0.2, demandPressure: 0.2 })
  });

  assert.ok(byShortage.scarcityLabels.includes("Scarce"));
  assert.ok(byPressure.scarcityLabels.includes("Scarce"));
});

test("surplus and export-ready labels derive from supply and stock state", () => {
  const viewModel = buildEconomyPriceClarityViewModel({
    itemKey: "grain",
    price: createPrice(),
    stockPressure: createStockPressure({ tradeSurplusPerTick: 0.2, netPerTick: 0.2 }),
    supplyDemand: createSupplyDemand({ exportGoods: ["grain"], surplusGoods: ["grain"] })
  });

  assert.ok(viewModel.scarcityLabels.includes("Surplus"));
  assert.ok(viewModel.scarcityLabels.includes("Export ready"));
});

test("import-dependent label derives from import goods or dependencies", () => {
  const viewModel = buildEconomyPriceClarityViewModel({
    itemKey: "grain",
    price: createPrice(),
    supplyDemand: createSupplyDemand({
      importGoods: ["grain"],
      tradeDependencies: [
        {
          direction: "import",
          itemKey: "grain",
          partnerSettlementIds: ["settlement.aurelis"],
          reason: "stored import pressure"
        }
      ]
    })
  });

  assert.ok(viewModel.scarcityLabels.includes("Import dependent"));
});

test("protected reserve label derives from stored trade reserve and rejection data", () => {
  const viewModel = buildEconomyPriceClarityViewModel({
    itemKey: "grain",
    price: createPrice(),
    tradeOpportunity: createTradeOpportunity({
      viable: false,
      exportableSurplus: 2,
      protectedReserve: 4,
      rejectionReasons: ["Protected reserve blocks full export."]
    })
  });

  assert.ok(viewModel.scarcityLabels.includes("Protected reserve"));
});

test("labor labels derive from explicit labor pressure rows", () => {
  const constrained = buildEconomyPriceClarityViewModel({
    price: createPrice(),
    laborPressure: createLaborPressure({ pressure: 1.2 })
  });
  const stable = buildEconomyPriceClarityViewModel({
    price: createPrice(),
    laborPressure: createLaborPressure({ pressure: 1 })
  });
  const available = buildEconomyPriceClarityViewModel({
    price: createPrice(),
    laborPressure: createLaborPressure({ pressure: 0.88, availability: 1.12 })
  });

  assert.equal(constrained.laborRows[0]?.valueLabel, "Labor constrained");
  assert.equal(stable.laborRows[0]?.valueLabel, "Stable labor");
  assert.equal(available.laborRows[0]?.valueLabel, "Skilled labor available");
});

test("trade viable, blocked, and strategic labels derive from TradeOpportunityState", () => {
  assert.equal(buildTradeOpportunityClarityViewModel({ opportunity: createTradeOpportunity() }).viabilityLabel, "Viable route");
  assert.equal(
    buildTradeOpportunityClarityViewModel({ opportunity: createTradeOpportunity({ strategicNecessity: true }) }).viabilityLabel,
    "Strategic necessity"
  );
  assert.equal(
    buildTradeOpportunityClarityViewModel({
      opportunity: createTradeOpportunity({ viable: false, rejectionReasons: ["No meaningful quantity fits reserve, absorption, and transport limits."] })
    }).viabilityLabel,
    "Blocked route"
  );
});

test("trade margin labels derive from stored margin fields", () => {
  assert.equal(
    buildTradeOpportunityClarityViewModel({ opportunity: createTradeOpportunity({ viable: false }) }).marginLabel,
    "Blocked"
  );
  assert.equal(
    buildTradeOpportunityClarityViewModel({ opportunity: createTradeOpportunity({ projectedGrossMargin: 100, projectedNetMargin: -1 }) }).marginLabel,
    "Losing route"
  );
  assert.equal(
    buildTradeOpportunityClarityViewModel({ opportunity: createTradeOpportunity({ projectedGrossMargin: 100, projectedNetMargin: 15 }) }).marginLabel,
    "Thin margin"
  );
  assert.equal(
    buildTradeOpportunityClarityViewModel({ opportunity: createTradeOpportunity({ projectedGrossMargin: 100, projectedNetMargin: 25 }) }).marginLabel,
    "Fair margin"
  );
  assert.equal(
    buildTradeOpportunityClarityViewModel({ opportunity: createTradeOpportunity({ projectedGrossMargin: 100, projectedNetMargin: 35 }) }).marginLabel,
    "Strong margin"
  );
  assert.equal(
    buildTradeOpportunityClarityViewModel({ opportunity: createTradeOpportunity({ projectedGrossMargin: 0, projectedNetMargin: 1 }) }).marginLabel,
    "Unknown margin"
  );
});

test("trade rejection reasons render as explanation rows, not actions", () => {
  const viewModel = buildTradeOpportunityClarityViewModel({
    opportunity: createTradeOpportunity({
      viable: false,
      rejectionReasons: ["Projected net margin is below the viable dispatch threshold."]
    })
  });

  assert.equal(viewModel.rejectionRows[0]?.valueLabel, "Projected net margin is below the viable dispatch threshold.");
  assert.equal(viewModel.rejectionRows[0]?.tone, "blocked");
  assertNoActions(viewModel);
});

test("craft labels derive from supplied CraftResolutionState", () => {
  const viewModel = buildCraftCostClarityViewModel({
    craft: createCraft(),
    itemValue: createItemValue()
  });

  assert.deepEqual(
    viewModel.costProfileLabels,
    [
      "Material-heavy",
      "Labor-heavy",
      "Processing-heavy",
      "Waste-sensitive",
      "Fuel-sensitive",
      "Tool-sensitive",
      "Skill-sensitive"
    ]
  );
});

test("item value rows use supplied value state without promising resale profit", () => {
  const viewModel = buildCraftCostClarityViewModel({
    craft: createCraft(),
    itemValue: createItemValue()
  });
  const profitRow = findRow(viewModel.valueRows, "value-profit-estimate");

  assert.equal(profitRow?.valueLabel, "8");
  assert.equal(profitRow?.detailLabel, "Production estimate only; not a resale promise.");
  assert.equal(JSON.stringify(viewModel).includes("guaranteed"), false);
});

test("mismatched settlement and item inputs produce warnings instead of guessed data", () => {
  const priceViewModel = buildEconomyPriceClarityViewModel({
    itemKey: "grain",
    settlementId: "settlement.vinecross",
    marketState: createMarketState({ settlementId: "settlement.aurelis" }),
    price: createPrice({ itemKey: "iron_ingot" }),
    stockPressure: createStockPressure({ itemKey: "iron_ingot" }),
    supplyDemand: createSupplyDemand({ settlementId: "settlement.aurelis" }),
    itemValue: createItemValue({ itemKey: "bread" })
  });
  const craftViewModel = buildCraftCostClarityViewModel({
    craft: createCraft(),
    itemValue: createItemValue({ itemKey: "cheese" })
  });

  assert.ok(priceViewModel.warningLabels.includes("Market state does not match the requested settlement."));
  assert.ok(priceViewModel.warningLabels.includes("Price item does not match the requested item."));
  assert.ok(priceViewModel.warningLabels.includes("Stock pressure item does not match the requested item."));
  assert.ok(priceViewModel.warningLabels.includes("Supply and demand data does not match the requested settlement."));
  assert.ok(priceViewModel.warningLabels.includes("Item value data does not match the requested item."));
  assert.ok(craftViewModel.warningLabels.includes("Item value data does not match the craft target output."));
});

test("projection helpers do not mutate supplied inputs", () => {
  const priceInput = {
    itemKey: "grain",
    marketState: createMarketState(),
    price: createPrice(),
    stockPressure: createStockPressure(),
    supplyDemand: createSupplyDemand(),
    laborPressure: createLaborPressure(),
    itemValue: createItemValue({ itemKey: "grain" }),
    tradeOpportunity: createTradeOpportunity()
  };
  const tradeInput = { opportunity: createTradeOpportunity() };
  const craftInput = { craft: createCraft(), itemValue: createItemValue() };
  const before = JSON.stringify({ priceInput, tradeInput, craftInput });

  buildEconomyPriceClarityViewModel(priceInput);
  buildTradeOpportunityClarityViewModel(tradeInput);
  buildCraftCostClarityViewModel(craftInput);

  assert.equal(JSON.stringify({ priceInput, tradeInput, craftInput }), before);
});

test("all view models emit no command or action ids", () => {
  assertNoActions(buildEconomyPriceClarityViewModel({ price: createPrice() }));
  assertNoActions(buildTradeOpportunityClarityViewModel({ opportunity: createTradeOpportunity() }));
  assertNoActions(buildCraftCostClarityViewModel({ craft: createCraft(), itemValue: createItemValue() }));
});

test("projection source does not call economy runtime helpers or mutating systems", () => {
  const source = readFileSync("apps/rpg-ui/src/game-shell/economyClarityPresentation.ts", "utf8");

  for (const forbidden of [
    "resolveLocalMarketPrice",
    "buildSettlementMarketStates",
    "resolveItemValueAtSettlement",
    "resolveCraftAtSettlement",
    "runAutonomousTradeDispatch",
    "dispatchCaravan",
    "tickCivilization"
  ]) {
    assert.equal(source.includes(forbidden), false, `${forbidden} should not appear in projection source`);
  }
});

test("projection source does not represent deferred cross-system behavior", () => {
  const source = readFileSync("apps/rpg-ui/src/game-shell/economyClarityPresentation.ts", "utf8");

  for (const forbidden of [
    "Chronicle",
    "Bloodlines",
    "Legacy",
    "Family Prestige",
    "Chronicle Mark",
    "Lineage Seal",
    "heirloom",
    "bequest",
    "estate"
  ]) {
    assert.equal(source.includes(forbidden), false, `${forbidden} should remain outside economy clarity projection`);
  }
});
