import test from "node:test";
import assert from "node:assert/strict";
import { createInitialClock } from "../../packages/shared/time/src/index.js";
import { aggregateEconomyHierarchy, buildEconomyStateFromContent } from "../../packages/engines/civilization-engine/src/economy.js";
import { buildSettlementMarketStates, buildSimulationConsistencyReport } from "../../packages/engines/civilization-engine/src/index.js";
import { loadSettlementContent } from "../../packages/engines/civilization-engine/src/content.js";

const TEST_SETTLEMENTS = loadSettlementContent().map((record) => record.id);

function buildConsistencyReport() {
  const clock = createInitialClock();
  const { economy } = buildEconomyStateFromContent(TEST_SETTLEMENTS, clock);
  const { snapshots } = aggregateEconomyHierarchy(economy);
  const marketStates = buildSettlementMarketStates({
    settlementIds: TEST_SETTLEMENTS,
    snapshots,
    clock
  });

  return buildSimulationConsistencyReport({
    settlementIds: TEST_SETTLEMENTS,
    marketStates
  });
}

test("system consistency report closes essential goods, geography, and building coverage", () => {
  const report = buildConsistencyReport();

  assert.equal(report.itemsWithoutProductionSource.length, 0);
  assert.equal(report.missingRecipeDependencies.length, 0);
  assert.equal(report.cyclicProductionDependencies.length, 0);
  assert.equal(report.workplacesWithoutDefinedFunction.length, 0);
  assert.equal(report.workplacesWithoutBuildingCoverage.length, 0);
  assert.equal(report.buildingsWithoutFunction.length, 0);
  assert.equal(report.invalidSettlementGeography.length, 0);
  assert.ok(report.essentialGoodsCoverage.every((group) => group.missingKeys.length === 0));
  assert.ok(report.unrealisticTradeDispatchAttempts.length > 0, "trade report should include rejected low-viability opportunities");
  assert.ok(report.unrealisticTradeDispatchAttempts.some((entry) => entry.rejectionReasons.length > 0));
});
