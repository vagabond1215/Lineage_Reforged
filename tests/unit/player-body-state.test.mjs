import test from "node:test";
import assert from "node:assert/strict";
import {
  advancePlayerBodyState,
  applyConsumableToBodyState,
  createDefaultPlayerBodyState,
  resolveBodyState
} from "../../packages/engines/player-engine/src/index.ts";

function advanceForTicks(state, totalTicks, profile, lineageId = "lineage.human", runDifficulty) {
  let next = state;
  let tick = state.lastAdvancedTick;
  let day = state.lastDailyRolloverDay;

  for (let index = 0; index < totalTicks; index += 1) {
    tick += 1;
    if (tick % 24 === 0) {
      day += 1;
    }

    next = advancePlayerBodyState(next, 1, {
      tick,
      day,
      lineageId,
      metabolicProfile: profile,
      runDifficulty
    });
  }

  return next;
}

test("short-term missed meals lower energy without rapidly building starvation load", () => {
  const baseline = createDefaultPlayerBodyState({
    tick: 0,
    day: 1,
    lineageId: "lineage.human"
  });
  const advanced = advanceForTicks(
    baseline,
    6,
    {
      intensity: "moderate",
      fatigueGain: 6,
      energyDemand: 10,
      hydrationDemand: 8,
      highIntensityLoad: 0
    },
    "lineage.human"
  );

  assert.ok(advanced.energyReserve.quick < baseline.energyReserve.quick);
  assert.equal(advanced.starvationLoad, 0);
});

test("multi-day underfeeding raises starvation load gradually and not from one rollover spike", () => {
  let state = createDefaultPlayerBodyState({
    tick: 0,
    day: 1,
    lineageId: "lineage.human"
  });

  state = advanceForTicks(
    state,
    24,
    {
      intensity: "moderate",
      fatigueGain: 10,
      energyDemand: 18,
      hydrationDemand: 12,
      highIntensityLoad: 1
    },
    "lineage.human"
  );
  const afterDayOne = state.starvationLoad;

  state = advanceForTicks(
    state,
    24,
    {
      intensity: "moderate",
      fatigueGain: 10,
      energyDemand: 18,
      hydrationDemand: 12,
      highIntensityLoad: 1
    },
    "lineage.human"
  );

  assert.ok(afterDayOne <= 1);
  assert.ok(state.starvationLoad > afterDayOne);
  assert.ok(state.starvationLoad <= 3);
});

test("hydration pressure ramps quickly and drinking reverses it quickly", () => {
  let state = createDefaultPlayerBodyState({
    tick: 0,
    day: 1,
    lineageId: "lineage.half_merfolk"
  });

  state = advanceForTicks(
    state,
    4,
    {
      intensity: "high",
      fatigueGain: 10,
      energyDemand: 8,
      hydrationDemand: 22,
      highIntensityLoad: 1
    },
    "lineage.half_merfolk"
  );
  const beforeDrinkHydration = state.hydrationLevel;

  assert.ok(
    state.resolved.hydrationBand === "dehydrated" ||
      state.resolved.hydrationBand === "severely_dehydrated" ||
      state.hydrationLevel < 60
  );

  state = applyConsumableToBodyState(
    state,
    { calories: 0, protein: 0, carbs: 0, fat: 0, hydration: 28, useVerb: "Drink" },
    {
      lineageId: "lineage.half_merfolk",
      itemTags: ["water_rich"],
      tick: 4,
      day: 1
    }
  );

  assert.ok(state.hydrationLevel > beforeDrinkHydration);
  assert.ok(
    state.resolved.hydrationBand === "optimal" ||
      state.resolved.hydrationBand === "slightly_dehydrated" ||
      state.resolved.hydrationBand === "dehydrated"
  );
});

test("protein deficiency slows recovery before strength efficiency penalties appear", () => {
  let state = createDefaultPlayerBodyState({
    tick: 0,
    day: 1,
    lineageId: "lineage.human"
  });

  state = advanceForTicks(
    state,
    24,
    {
      intensity: "high",
      fatigueGain: 14,
      energyDemand: 16,
      hydrationDemand: 10,
      highIntensityLoad: 2
    },
    "lineage.human"
  );

  const resolved = resolveBodyState(state, "lineage.human");

  assert.ok(state.proteinDeficitLoad > 0);
  assert.ok(resolved.recoveryEffectivenessMultiplier < 1);
  assert.equal(resolved.strengthEfficiencyMultiplier, 1);
});

test("normal non-hardcore preserves pre-difficulty body-state behavior", () => {
  const baseline = createDefaultPlayerBodyState({
    tick: 0,
    day: 1,
    lineageId: "lineage.human"
  });
  const profile = {
    intensity: "moderate",
    fatigueGain: 6,
    energyDemand: 10,
    hydrationDemand: 8,
    highIntensityLoad: 0
  };

  const unrestricted = advanceForTicks(baseline, 6, profile, "lineage.human");
  const explicitNormal = advanceForTicks(
    baseline,
    6,
    profile,
    "lineage.human",
    { tier: "normal", hardcore: false }
  );

  assert.deepEqual(explicitNormal, unrestricted);
});

test("easy body-state pressure is more forgiving than brutal under the same activity", () => {
  const baseline = createDefaultPlayerBodyState({
    tick: 0,
    day: 1,
    lineageId: "lineage.human"
  });
  const profile = {
    intensity: "high",
    fatigueGain: 10,
    energyDemand: 14,
    hydrationDemand: 12,
    highIntensityLoad: 1
  };

  const easy = advanceForTicks(baseline, 8, profile, "lineage.human", {
    tier: "easy",
    hardcore: false
  });
  const brutal = advanceForTicks(baseline, 8, profile, "lineage.human", {
    tier: "brutal",
    hardcore: false
  });

  assert.ok(easy.hydrationLevel > brutal.hydrationLevel);
  assert.ok(easy.energyReserve.quick > brutal.energyReserve.quick);
});

test("hardcore reduces below-gate body-state recovery compared with standard recovery", () => {
  const strained = createDefaultPlayerBodyState({
    tick: 24,
    day: 2,
    lineageId: "lineage.human"
  });
  strained.fatigue = 52;
  strained.fatigueDebt = 20;
  strained.hydrationLevel = 42;
  strained.energyReserve.quick = 32;

  const standard = advancePlayerBodyState(strained, 1, {
    tick: 25,
    day: 2,
    lineageId: "lineage.human",
    runDifficulty: { tier: "normal", hardcore: false },
    recoveryContext: {
      sleepUnits: 1,
      campTier: "basic",
      safetyTier: "stable",
      mealSupport: 0,
      waterSupport: 0
    },
    recoveryAssessment: {
      quality: 0.4,
      durationHours: 2
    }
  });
  const hardcore = advancePlayerBodyState(strained, 1, {
    tick: 25,
    day: 2,
    lineageId: "lineage.human",
    runDifficulty: { tier: "normal", hardcore: true },
    recoveryContext: {
      sleepUnits: 1,
      campTier: "basic",
      safetyTier: "stable",
      mealSupport: 0,
      waterSupport: 0
    },
    recoveryAssessment: {
      quality: 0.4,
      durationHours: 2
    }
  });

  assert.ok(standard.fatigue < strained.fatigue);
  assert.ok(hardcore.fatigue < strained.fatigue);
  assert.ok(hardcore.fatigue > standard.fatigue);
});
