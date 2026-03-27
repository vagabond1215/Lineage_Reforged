import test from "node:test";
import assert from "node:assert/strict";
import { createInitialClock } from "../../packages/shared/time/src/index.js";
import { aggregateEconomyHierarchy, buildEconomyStateFromContent } from "../../packages/engines/civilization-engine/src/economy.js";
import {
  buildSettlementMarketStates,
  buildSettlementSimulationProfiles
} from "../../packages/engines/civilization-engine/src/index.js";

const TEST_SETTLEMENTS = [
  "settlement.aurelis",
  "settlement.vinecross",
  "settlement.stonevein",
  "settlement.brineharbor"
];

function createProfiles() {
  const clock = createInitialClock();
  const { economy } = buildEconomyStateFromContent(TEST_SETTLEMENTS, clock);
  const { snapshots } = aggregateEconomyHierarchy(economy);
  const marketStates = buildSettlementMarketStates({
    settlementIds: TEST_SETTLEMENTS,
    snapshots,
    clock
  });
  return buildSettlementSimulationProfiles({
    settlementIds: TEST_SETTLEMENTS,
    marketStates
  });
}

function getProfile(profiles, settlementId) {
  const profile = profiles.find((entry) => entry.settlementId === settlementId);
  assert.ok(profile, `missing profile for ${settlementId}`);
  return profile;
}

function getLaborClass(profile, classId) {
  return profile.population.laborClasses.find((entry) => entry.classId === classId)?.count ?? 0;
}

test("settlement simulation profiles derive non-uniform labor mixes and businesses from geography", () => {
  const profiles = createProfiles();
  const vinecross = getProfile(profiles, "settlement.vinecross");
  const stonevein = getProfile(profiles, "settlement.stonevein");
  const brineharbor = getProfile(profiles, "settlement.brineharbor");

  assert.ok(getLaborClass(vinecross, "agrarian") > getLaborClass(vinecross, "extractive"), "vinecross should skew agrarian");
  assert.ok(vinecross.businesses.some((business) => business.businessType === "farm_estates"));
  assert.ok(vinecross.businesses.some((business) => business.businessType === "mills_and_granaries"));
  assert.ok(vinecross.buildings.length > 0, "vinecross should derive buildings");
  assert.ok(vinecross.infrastructure.storageProfiles.length > 0, "vinecross should derive storage profiles");
  assert.ok(vinecross.profile.primaryIndustries.length >= 1, "vinecross should derive a settlement profile");
  assert.ok(vinecross.districts.length >= 2, "vinecross should derive districts");
  assert.ok(vinecross.plots.some((plot) => plot.state === "vacant"), "vinecross should keep vacant plots");
  assert.ok(vinecross.plots.some((plot) => plot.state === "dilapidated" || plot.state === "abandoned"), "vinecross should keep degraded plots");
  assert.ok(vinecross.buildings.every((building) => building.instances.length === building.instanceCount), "vinecross building summaries should instantiate their building counts");
  assert.ok(vinecross.repairProjects.length > 0, "vinecross should derive repair work");
  assert.ok(vinecross.supplyDemand.exportGoods.length >= 1, "vinecross should export something");
  assert.ok(vinecross.supplyDemand.importGoods.length >= 1, "vinecross should import something");
  assert.ok(vinecross.morale.moraleScore > 0, "vinecross should derive morale");

  assert.ok(getLaborClass(stonevein, "extractive") >= getLaborClass(stonevein, "agrarian"), "stonevein should skew extractive");
  assert.ok(stonevein.businesses.some((business) => business.businessType === "mine_works"));
  assert.ok(stonevein.businesses.some((business) => business.businessType === "smelters_and_toolshops"));
  assert.ok(stonevein.buildings.some((building) => building.category === "extractive"));
  assert.ok(stonevein.profile.primaryIndustries.some((entry) => /mining|extract|metal/i.test(entry)));
  assert.ok(stonevein.repairProjects.some((project) => project.requiredTradeIds.includes("trade.blacksmith")));

  assert.ok(brineharbor.infrastructure.transportAvailability.some((entry) => entry.vehicleId === "vehicle.coastal_vessel"));
  assert.ok(brineharbor.businesses.some((business) => business.businessType === "fishing_docks"));
  assert.ok(brineharbor.buildings.some((building) => building.category === "maritime"));
  assert.ok(brineharbor.profile.tradeRole === "exporter" || brineharbor.profile.tradeRole === "mixed");
  assert.ok(brineharbor.districts.some((district) => district.districtType === "storage_trade"));
  assert.ok(brineharbor.plots.some((plot) => plot.tags.includes("near_water")));
  assert.notEqual(
    roundRatio(vinecross.population.workforcePopulation, vinecross.population.totalPopulation),
    roundRatio(stonevein.population.workforcePopulation, stonevein.population.totalPopulation),
    "settlement workforce shares should not be uniform"
  );
});

function roundRatio(numerator, denominator) {
  return Number((numerator / Math.max(denominator, 1)).toFixed(4));
}
