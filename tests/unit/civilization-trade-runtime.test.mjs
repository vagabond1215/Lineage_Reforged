import test from "node:test";
import assert from "node:assert/strict";
import { createInitialClock } from "../../packages/shared/time/src/index.js";
import { aggregateEconomyHierarchy, buildEconomyStateFromContent } from "../../packages/engines/civilization-engine/src/economy.js";
import {
  buildSettlementMarketStates,
  createEmptyCivilizationTransportState,
  evaluateAutonomousTradeOpportunities,
  runAutonomousTradeDispatch
} from "../../packages/engines/civilization-engine/src/index.js";
import { resolveResourceFamilies } from "../../packages/engines/civilization-engine/src/resource-taxonomy.js";

const TEST_SETTLEMENTS = [
  "settlement.aurelis",
  "settlement.vinecross",
  "settlement.stonevein",
  "settlement.brineharbor"
];

function createFixture() {
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
    marketStates
  };
}

function getStockLevel(marketStates, settlementId, itemKey) {
  return marketStates.find((state) => state.settlementId === settlementId)?.stock.find((entry) => entry.itemKey === itemKey)?.stockLevel ?? 0;
}

function isGrainFamilyItem(itemKey) {
  return resolveResourceFamilies(itemKey).includes("grain");
}

test("autonomous trade evaluation produces viable, explained opportunities", () => {
  const fixture = createFixture();
  const evaluation = evaluateAutonomousTradeOpportunities({
    settlementIds: TEST_SETTLEMENTS,
    marketStates: fixture.marketStates,
    transportState: createEmptyCivilizationTransportState()
  });

  assert.ok(evaluation.opportunities.length > 0, "expected evaluated trade opportunities");
  assert.ok(evaluation.opportunities.some((opportunity) => opportunity.viable), "expected at least one viable trade opportunity");
  assert.ok(
    evaluation.opportunities.some(
      (opportunity) =>
        opportunity.viable &&
        isGrainFamilyItem(opportunity.itemKey) &&
        opportunity.originSettlementId === "settlement.vinecross"
    ),
    "expected a viable grain-family export from the agrarian settlement"
  );
  assert.ok(
    evaluation.opportunities.some((opportunity) => !opportunity.viable && opportunity.rejectionReasons.length > 0),
    "expected rejected opportunities to retain explanations"
  );
});

test("autonomous trade dispatch creates caravans, reservations, and origin stock changes", () => {
  const fixture = createFixture();
  const beforeGrain = getStockLevel(fixture.marketStates, "settlement.vinecross", "grain");

  const firstPass = runAutonomousTradeDispatch({
    settlementIds: TEST_SETTLEMENTS,
    marketStates: fixture.marketStates,
    transportState: createEmptyCivilizationTransportState(),
    tick: fixture.clock.tick
  });

  assert.ok(firstPass.dispatched.length > 0, "expected autonomous dispatch to launch at least one convoy");
  assert.equal(firstPass.transportState.caravans.length, firstPass.dispatched.length);
  assert.equal(firstPass.transportState.assetReservations.length, firstPass.dispatched.length);
  assert.equal(firstPass.transportState.lastEvaluatedOpportunities.length, firstPass.opportunities.length);

  const firstShipment = firstPass.dispatched[0];
  const afterOriginStock = getStockLevel(firstPass.marketStates, firstShipment.originSettlementId, firstShipment.itemKey);
  const beforeOriginStock = getStockLevel(fixture.marketStates, firstShipment.originSettlementId, firstShipment.itemKey);
  assert.ok(afterOriginStock < beforeOriginStock, "dispatch should remove stock from the origin immediately");

  const secondPass = runAutonomousTradeDispatch({
    settlementIds: TEST_SETTLEMENTS,
    marketStates: firstPass.marketStates,
    transportState: firstPass.transportState,
    tick: fixture.clock.tick + 1
  });

  assert.ok(secondPass.transportState.assetReservations.length >= firstPass.transportState.assetReservations.length);
  assert.ok(secondPass.dispatched.length <= firstPass.dispatched.length, "reservations and throughput should limit immediate repeat dispatching");
  assert.ok(beforeGrain >= afterOriginStock || firstShipment.itemKey !== "grain");
});
