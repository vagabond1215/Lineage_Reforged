import test from "node:test";
import assert from "node:assert/strict";
import { createInitialClock } from "../../packages/shared/time/src/index.ts";
import { aggregateEconomyHierarchy, buildEconomyStateFromContent } from "../../packages/engines/civilization-engine/src/economy.ts";
import {
  buildSettlementMarketStates,
  resolveCraftAtSettlement,
  resolveItemValueAtSettlement,
  resolveLocalMarketPrice
} from "../../packages/engines/civilization-engine/src/runtime-economy.ts";

const TEST_SETTLEMENTS = ["settlement.vinecross", "settlement.stonevein", "settlement.aurelis"];
const COOKING_SKILL_ID = "skill.crafting.cooking";

function createMarketStateFixture() {
  const clock = createInitialClock();
  const { economy } = buildEconomyStateFromContent(TEST_SETTLEMENTS, clock);
  const { snapshots } = aggregateEconomyHierarchy(economy);
  const marketStates = buildSettlementMarketStates({
    settlementIds: TEST_SETTLEMENTS,
    snapshots,
    clock
  });
  return {
    clock,
    marketStates,
    getMarketState(settlementId) {
      const state = marketStates.find((entry) => entry.settlementId === settlementId);
      assert.ok(state, `missing market state for ${settlementId}`);
      return state;
    }
  };
}

test("craft resolution uses worker skill to reduce time and cost", () => {
  const fixture = createMarketStateFixture();
  const marketState = fixture.getMarketState("settlement.vinecross");

  const lowSkill = resolveCraftAtSettlement({
    chainId: "chain.food.bread",
    settlementId: "settlement.vinecross",
    marketState,
    workerSkills: {
      [COOKING_SKILL_ID]: 22
    },
    availableToolTags: ["tool.bread_peel", "tool.oven_peel", "tool.hammer"],
    fuelAvailable: true
  });

  const highSkill = resolveCraftAtSettlement({
    chainId: "chain.food.bread",
    settlementId: "settlement.vinecross",
    marketState,
    workerSkills: {
      [COOKING_SKILL_ID]: 120
    },
    availableToolTags: ["tool.bread_peel", "tool.oven_peel", "tool.hammer"],
    fuelAvailable: true
  });

  assert.ok(highSkill.processingTimeHours < lowSkill.processingTimeHours, "higher skill should reduce processing time");
  assert.ok(highSkill.totalCost < lowSkill.totalCost, "higher skill should reduce effective production cost");
  assert.ok(highSkill.explanation.stepBreakdown.some((step) => step.stageRef === "workplace.bakehouse"));
});

test("material difficulty increases resolved production cost for harder metals", () => {
  const fixture = createMarketStateFixture();
  const marketState = fixture.getMarketState("settlement.stonevein");

  const iron = resolveItemValueAtSettlement({
    itemKey: "iron_ingot",
    settlementId: "settlement.stonevein",
    marketState
  });

  const steel = resolveItemValueAtSettlement({
    itemKey: "steel_ingot",
    settlementId: "settlement.stonevein",
    marketState
  });

  assert.ok(steel.effectiveProductionCost > iron.effectiveProductionCost, "steel should resolve above iron due to harder processing");
  assert.ok(steel.resolutionPath.length > 0);
});

test("local market prices respond to settlement supply and demand pressure", () => {
  const fixture = createMarketStateFixture();
  const vinecross = fixture.getMarketState("settlement.vinecross");
  const stonevein = fixture.getMarketState("settlement.stonevein");

  const vinecrossGrain = resolveLocalMarketPrice({
    itemKey: "grain",
    settlementId: "settlement.vinecross",
    marketState: vinecross
  });
  const stoneveinGrain = resolveLocalMarketPrice({
    itemKey: "grain",
    settlementId: "settlement.stonevein",
    marketState: stonevein
  });

  assert.ok(vinecrossGrain.localBuyPrice < stoneveinGrain.localBuyPrice, "grain should be cheaper in the agricultural market than in the mining city");
});

test("market and craft results expose structured explanations", () => {
  const fixture = createMarketStateFixture();
  const marketState = fixture.getMarketState("settlement.aurelis");

  const craft = resolveCraftAtSettlement({
    chainId: "chain.food.fresh_cheese",
    settlementId: "settlement.aurelis",
    marketState,
    workerSkills: {
      [COOKING_SKILL_ID]: 95
    },
    fuelAvailable: true
  });
  const price = resolveLocalMarketPrice({
    itemKey: "fresh_cheese",
    settlementId: "settlement.aurelis",
    marketState
  });

  assert.ok(craft.explanation.stepBreakdown.length > 0, "craft resolution should expose step explanations");
  assert.ok(price.pressureSources.length >= 4, "market pricing should expose pressure contributions");
});

test("recipe dimensions only affect quantity when the recipe allows it", () => {
  const fixture = createMarketStateFixture();
  const marketState = fixture.getMarketState("settlement.aurelis");

  const breadLow = resolveCraftAtSettlement({
    chainId: "chain.food.bread",
    settlementId: "settlement.aurelis",
    marketState,
    workerSkills: {
      [COOKING_SKILL_ID]: 22
    },
    fuelAvailable: true
  });
  const breadHigh = resolveCraftAtSettlement({
    chainId: "chain.food.bread",
    settlementId: "settlement.aurelis",
    marketState,
    workerSkills: {
      [COOKING_SKILL_ID]: 120
    },
    fuelAvailable: true
  });
  const cheeseLow = resolveCraftAtSettlement({
    chainId: "chain.food.fresh_cheese",
    settlementId: "settlement.aurelis",
    marketState,
    workerSkills: {
      [COOKING_SKILL_ID]: 22
    },
    fuelAvailable: true
  });
  const cheeseHigh = resolveCraftAtSettlement({
    chainId: "chain.food.fresh_cheese",
    settlementId: "settlement.aurelis",
    marketState,
    workerSkills: {
      [COOKING_SKILL_ID]: 120
    },
    fuelAvailable: true
  });

  assert.equal(breadLow.outputQuantity, breadHigh.outputQuantity, "bread should not vary output quantity without a quantity dimension");
  assert.ok(cheeseHigh.outputQuantity > cheeseLow.outputQuantity, "cheese should expose quantity gains when quantity is allowed");
  assert.ok(
    cheeseHigh.explanation.stepBreakdown.some((step) => step.appliedDimensions.includes("quantity")),
    "quantity-enabled recipes should expose quantity in step dimensions"
  );
});
