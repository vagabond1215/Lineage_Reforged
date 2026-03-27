import test from "node:test";
import assert from "node:assert/strict";
import {
  buildSpatialWorldContext,
  describeRouteDirection,
  resolveBestRoute,
  resolveHexResourceAvailability,
  resolveSettlementResourceAccess,
  resolveSettlementSupplyCapability
} from "../../packages/engines/civilization-engine/src/index.js";
import { resolveResourceFamilies } from "../../packages/engines/civilization-engine/src/resource-taxonomy.js";

function tierWeight(tier) {
  switch (tier) {
    case "abundant":
      return 4;
    case "common":
      return 3;
    case "uncommon":
      return 2;
    case "rare":
      return 1;
    default:
      return 0;
  }
}

function bestTierByFamily(entries, family) {
  return entries.reduce((best, entry) => {
    const matches = entry.resourceKeys.some((itemKey) => resolveResourceFamilies(itemKey).includes(family));
    return matches && tierWeight(entry.availabilityTier) > tierWeight(best) ? entry.availabilityTier : best;
  }, "absent");
}

test("spatial world context exposes authored hex, edge, route, and settlement counts", () => {
  const context = buildSpatialWorldContext();
  assert.ok(context.hexCount > 0);
  assert.ok(context.edgeCount > 0);
  assert.ok(context.routeCount > 0);
  assert.ok(context.settlementCount > 0);
  assert.ok(context.localityCount > 0);
});

test("hex resource availability differentiates agrarian and extractive terrain", () => {
  const fertileHex = resolveHexResourceAvailability({ hexId: "world_hex.verdant_thalos_inland_estates" });
  const miningHex = resolveHexResourceAvailability({ hexId: "world_hex.auric_marches_ore_ridges" });

  assert.ok(tierWeight(bestTierByFamily(fertileHex, "grain")) >= tierWeight("common"));
  assert.ok(tierWeight(bestTierByFamily(miningHex, "minerals")) >= tierWeight("common"));
});

test("settlement resource access and supply gating follow locality and infrastructure", () => {
  const vinecross = resolveSettlementResourceAccess({ settlementId: "settlement.vinecross" });
  const stonevein = resolveSettlementResourceAccess({ settlementId: "settlement.stonevein" });

  const vinecrossGrain = vinecross.familyAvailability.find((entry) => entry.family === "grain");
  const stoneveinMinerals = stonevein.familyAvailability.find((entry) => entry.family === "minerals");
  assert.ok(vinecrossGrain, "expected grain access for vinecross");
  assert.ok(stoneveinMinerals, "expected mineral access for stonevein");
  assert.notEqual(vinecrossGrain.usableTier, "absent");
  assert.notEqual(stoneveinMinerals.usableTier, "absent");

  const stoneveinOre = resolveSettlementSupplyCapability({
    settlementId: "settlement.stonevein",
    itemKey: "iron_ore"
  });
  const vinecrossOre = resolveSettlementSupplyCapability({
    settlementId: "settlement.vinecross",
    itemKey: "iron_ore"
  });

  assert.ok(stoneveinOre.supplyFactor > vinecrossOre.supplyFactor, "mining settlement should outperform agrarian settlement for ore access");
});

test("best route resolution is deterministic and mode-specific", () => {
  const wagonRoute = resolveBestRoute({
    fromSettlementId: "settlement.aurelis",
    toSettlementId: "settlement.stonevein",
    modeId: "travel_mode.wagon",
    strategy: "fastest"
  });

  assert.ok(wagonRoute.segments.length > 0);
  assert.ok(wagonRoute.totalTimeDays > 0);
  assert.ok(wagonRoute.routeIds.length > 0);
  assert.match(describeRouteDirection({ routeId: wagonRoute.routeIds[0], fromSettlementId: "settlement.aurelis" }), /toward/i);

  assert.throws(
    () =>
      resolveBestRoute({
        fromSettlementId: "settlement.aurelis",
        toSettlementId: "settlement.brineharbor",
        modeId: "travel_mode.wagon",
        strategy: "fastest"
      }),
    /No valid/
  );

  const seaRoute = resolveBestRoute({
    fromSettlementId: "settlement.brineharbor",
    toSettlementId: "settlement.aurelis",
    modeId: "travel_mode.sea_vessel",
    strategy: "fastest"
  });
  assert.ok(seaRoute.totalDistanceKilometers > 0);
  assert.ok(seaRoute.segments.every((segment) => segment.allowedTravelModes.includes("travel_mode.sea_vessel")));
});
