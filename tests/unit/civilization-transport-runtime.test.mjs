import test from "node:test";
import assert from "node:assert/strict";
import { createInitialClock } from "../../packages/shared/time/src/index.js";
import { aggregateEconomyHierarchy, buildEconomyStateFromContent } from "../../packages/engines/civilization-engine/src/economy.js";
import {
  advanceTransportState,
  buildSettlementMarketStates,
  createEmptyCivilizationTransportState,
  dispatchCaravan,
  resolveBestRoute,
  resolveTransportPerformance
} from "../../packages/engines/civilization-engine/src/index.js";

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

function getSettlementState(marketStates, settlementId) {
  const state = marketStates.find((entry) => entry.settlementId === settlementId);
  assert.ok(state, `missing market state for ${settlementId}`);
  return state;
}

function getStockLevel(marketStates, settlementId, itemKey) {
  return getSettlementState(marketStates, settlementId).stock.find((entry) => entry.itemKey === itemKey)?.stockLevel ?? 0;
}

function getRoadSegment() {
  return resolveBestRoute({
    fromSettlementId: "settlement.aurelis",
    toSettlementId: "settlement.vinecross",
    modeId: "travel_mode.wagon",
    strategy: "fastest"
  }).segments[0];
}

function getPassSegment() {
  return resolveBestRoute({
    fromSettlementId: "settlement.aurelis",
    toSettlementId: "settlement.stonevein",
    modeId: "travel_mode.wagon",
    strategy: "fastest"
  }).segments[0];
}

function getSeaSegment() {
  return resolveBestRoute({
    fromSettlementId: "settlement.brineharbor",
    toSettlementId: "settlement.aurelis",
    modeId: "travel_mode.sea_vessel",
    strategy: "fastest"
  }).segments[0];
}

test("transport performance slows under heavier loads and rougher terrain", () => {
  const roadSegment = getRoadSegment();
  const passSegment = getPassSegment();
  const transportUnit = {
    transportType: "vehicle",
    modeId: "travel_mode.wagon",
    vehicleId: "vehicle.caravan_wagon",
    harnessId: "harness.caravan_team",
    animals: [{ animalId: "animal.mule", count: 3 }],
    crewSize: 2
  };

  const lightLoad = resolveTransportPerformance({
    transportUnit,
    cargoManifest: [{ itemKey: "grain", quantity: 40, loadUnits: 40 }],
    segment: roadSegment
  });
  const heavyLoad = resolveTransportPerformance({
    transportUnit,
    cargoManifest: [{ itemKey: "grain", quantity: 220, loadUnits: 220 }],
    segment: roadSegment
  });
  const roughTerrain = resolveTransportPerformance({
    transportUnit,
    cargoManifest: [{ itemKey: "grain", quantity: 40, loadUnits: 40 }],
    segment: passSegment
  });

  assert.ok(heavyLoad.loadFactor < lightLoad.loadFactor, "higher load should reduce the load factor");
  assert.ok(heavyLoad.effectiveSpeedKilometersPerDay < lightLoad.effectiveSpeedKilometersPerDay, "heavier loads should travel more slowly");
  assert.ok(roughTerrain.terrainFactor < lightLoad.terrainFactor, "rough terrain should reduce terrain factor");
  assert.ok(roughTerrain.effectiveSpeedKilometersPerDay < lightLoad.effectiveSpeedKilometersPerDay, "rough terrain should slow the wagon");
});

test("animal teams scale sub-linearly and invalid harness pairings fail", () => {
  const roadSegment = getRoadSegment();

  const twoMuleTeam = resolveTransportPerformance({
    transportUnit: {
      transportType: "vehicle",
      modeId: "travel_mode.wagon",
      vehicleId: "vehicle.caravan_wagon",
      harnessId: "harness.caravan_team",
      animals: [{ animalId: "animal.mule", count: 2 }],
      crewSize: 2
    },
    cargoManifest: [{ itemKey: "grain", quantity: 120, loadUnits: 120 }],
    segment: roadSegment
  });

  const fourMuleTeam = resolveTransportPerformance({
    transportUnit: {
      transportType: "vehicle",
      modeId: "travel_mode.wagon",
      vehicleId: "vehicle.caravan_wagon",
      harnessId: "harness.caravan_team",
      animals: [{ animalId: "animal.mule", count: 4 }],
      crewSize: 2
    },
    cargoManifest: [{ itemKey: "grain", quantity: 120, loadUnits: 120 }],
    segment: roadSegment
  });

  assert.ok(fourMuleTeam.effectivePullUnits > twoMuleTeam.effectivePullUnits, "more draft animals should increase pull strength");
  assert.ok(fourMuleTeam.effectivePullUnits < twoMuleTeam.effectivePullUnits * 2, "extra draft animals should add pull sub-linearly");
  assert.ok(fourMuleTeam.notes.some((note) => /sub-linearly/i.test(note)), "performance notes should explain draft inefficiency");

  assert.throws(
    () =>
      resolveTransportPerformance({
        transportUnit: {
          transportType: "vehicle",
          modeId: "travel_mode.wagon",
          vehicleId: "vehicle.wagon",
          harnessId: "harness.light_draft",
          animals: [{ animalId: "animal.horse", count: 1 }],
          crewSize: 1
        },
        cargoManifest: [{ itemKey: "grain", quantity: 20, loadUnits: 20 }],
        segment: roadSegment
      }),
    /requires harness/
  );
});

test("human-powered carts and pack trains resolve through distinct propulsion rules", () => {
  const roadSegment = getRoadSegment();

  const handCart = resolveTransportPerformance({
    transportUnit: {
      transportType: "vehicle",
      modeId: "travel_mode.wagon",
      vehicleId: "vehicle.hand_cart",
      harnessId: null,
      animals: [],
      crewSize: 1
    },
    cargoManifest: [{ itemKey: "grain", quantity: 8, loadUnits: 8 }],
    segment: roadSegment
  });

  const packTrain = resolveTransportPerformance({
    transportUnit: {
      transportType: "vehicle",
      modeId: "travel_mode.pack_animal",
      vehicleId: "vehicle.pack_train",
      harnessId: "harness.pack_train",
      animals: [{ animalId: "animal.mule", count: 3 }],
      crewSize: 1
    },
    cargoManifest: [{ itemKey: "grain", quantity: 50, loadUnits: 50 }],
    segment: {
      ...roadSegment,
      edgeType: "trail",
      allowedTravelModes: ["travel_mode.foot", "travel_mode.horseback", "travel_mode.pack_animal"],
      barrierTags: ["pass_country"]
    }
  });

  assert.ok(handCart.effectiveSpeedKilometersPerDay > 0);
  assert.ok(packTrain.effectivePullUnits > handCart.effectivePullUnits);
  assert.ok(packTrain.notes.some((note) => /draft team|sub-linearly|pass/i.test(note)));
});

test("ship transport respects water modes and rejects draft-animal assignments", () => {
  const seaSegment = getSeaSegment();

  const ship = resolveTransportPerformance({
    transportUnit: {
      transportType: "ship",
      modeId: "travel_mode.sea_vessel",
      vehicleId: "vehicle.coastal_vessel",
      harnessId: null,
      animals: [],
      crewSize: 8
    },
    cargoManifest: [{ itemKey: "grain", quantity: 180, loadUnits: 180 }],
    segment: seaSegment
  });

  assert.ok(ship.effectiveSpeedKilometersPerDay > 0, "valid ship configurations should resolve movement speed");
  assert.ok(ship.notes.some((note) => /crew/i.test(note)), "ship performance should explain crew sufficiency");

  assert.throws(
    () =>
      resolveTransportPerformance({
        transportUnit: {
          transportType: "ship",
          modeId: "travel_mode.sea_vessel",
          vehicleId: "vehicle.coastal_vessel",
          harnessId: null,
          animals: [{ animalId: "animal.horse", count: 1 }],
          crewSize: 8
        },
        cargoManifest: [{ itemKey: "grain", quantity: 20, loadUnits: 20 }],
        segment: seaSegment
      }),
    /cannot use draft animals/
  );
});

test("caravans dispatch, travel, rest, and deliver cargo into destination stock", () => {
  const fixture = createFixture();
  const baseMarketStates = fixture.marketStates;
  const beforeOriginGrain = getStockLevel(baseMarketStates, "settlement.vinecross", "grain");
  const beforeDestinationGrain = getStockLevel(baseMarketStates, "settlement.aurelis", "grain");

  const dispatched = dispatchCaravan({
    transportState: createEmptyCivilizationTransportState(),
    marketStates: baseMarketStates,
    originSettlementId: "settlement.vinecross",
    destinationSettlementId: "settlement.aurelis",
    cargoManifest: [{ itemKey: "grain", quantity: 5 }],
    transportUnit: {
      transportType: "vehicle",
      modeId: "travel_mode.wagon",
      vehicleId: "vehicle.cart",
      harnessId: "harness.light_draft",
      animals: [{ animalId: "animal.mule", count: 1 }],
      crewSize: 1
    },
    strategy: "lowest_cost"
  });

  const afterDispatchOriginGrain = getStockLevel(dispatched.marketStates, "settlement.vinecross", "grain");
  assert.equal(afterDispatchOriginGrain, beforeOriginGrain - 5, "dispatch should remove cargo from origin stock");

  let transportState = dispatched.transportState;
  let finalMarketStates = baseMarketStates;

  for (let day = 1; day <= 120; day += 1) {
    const advanced = advanceTransportState({
      transportState,
      marketStates: baseMarketStates,
      elapsedDays: 1,
      tick: day
    });
    transportState = advanced.transportState;
    finalMarketStates = advanced.marketStates;
    if (transportState.caravans[0]?.status === "arrived") {
      break;
    }
  }

  const caravan = transportState.caravans[0];
  assert.ok(caravan, "expected the dispatched caravan to exist");
  assert.equal(caravan.status, "arrived", "caravan should arrive after enough simulated travel time");
  assert.ok(caravan.explanation.some((line) => /transferred cargo/i.test(line)), "caravan explanation should record delivery");

  const afterDestinationGrain = getStockLevel(finalMarketStates, "settlement.aurelis", "grain");
  assert.equal(afterDestinationGrain, beforeDestinationGrain + 5, "arrival should add cargo into destination stock");
});

test("dispatch rejects routes that do not support the chosen transport mode", () => {
  const fixture = createFixture();

  assert.throws(
    () =>
      dispatchCaravan({
        transportState: createEmptyCivilizationTransportState(),
        marketStates: fixture.marketStates,
        originSettlementId: "settlement.brineharbor",
        destinationSettlementId: "settlement.aurelis",
        cargoManifest: [{ itemKey: "grain", quantity: 1 }],
        transportUnit: {
          transportType: "vehicle",
          modeId: "travel_mode.wagon",
          vehicleId: "vehicle.wagon",
          harnessId: "harness.heavy_yoke",
          animals: [{ animalId: "animal.ox", count: 2 }],
          crewSize: 1
        },
        strategy: "fastest"
      }),
    /No valid/
  );
});

test("in-flight transport failures transition caravans into blocked status with explanations", () => {
  const fixture = createFixture();
  const dispatched = dispatchCaravan({
    transportState: createEmptyCivilizationTransportState(),
    marketStates: fixture.marketStates,
    originSettlementId: "settlement.vinecross",
    destinationSettlementId: "settlement.aurelis",
    cargoManifest: [{ itemKey: "grain", quantity: 2 }],
    transportUnit: {
      transportType: "vehicle",
      modeId: "travel_mode.wagon",
      vehicleId: "vehicle.cart",
      harnessId: "harness.light_draft",
      animals: [{ animalId: "animal.mule", count: 1 }],
      crewSize: 1
    },
    strategy: "fastest"
  });

  const brokenTransportState = {
    ...dispatched.transportState,
    caravans: dispatched.transportState.caravans.map((caravan) => ({
      ...caravan,
      transportUnit: {
        ...caravan.transportUnit,
        vehicleId: "vehicle.coastal_vessel",
        harnessId: null,
        animals: []
      }
    }))
  };

  const advanced = advanceTransportState({
    transportState: brokenTransportState,
    marketStates: fixture.marketStates,
    elapsedDays: 1,
    tick: 1
  });

  const caravan = advanced.transportState.caravans[0];
  assert.ok(caravan, "expected the dispatched caravan to remain tracked");
  assert.equal(caravan.status, "blocked");
  assert.match(caravan.failureReason ?? "", /requires route mode|cannot use draft animals|does not match transport type/i);
  assert.ok(caravan.explanation.some((line) => /movement blocked/i.test(line)));
});
