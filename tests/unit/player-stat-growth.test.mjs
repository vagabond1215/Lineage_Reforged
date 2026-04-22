import test from "node:test";
import assert from "node:assert/strict";
import {
  applyActionAttributeLoad,
  applyAttributeTensionToActionProfile,
  convertPlayerStatGrowthOnRecovery,
  createDefaultPlayerBodyState,
  createDefaultPlayerStatGrowthState,
  loadStatGrowthBalanceRule,
  resolveRunDifficultyModifiers
} from "../../packages/engines/player-engine/src/index.ts";

function createPlayerFixture(overrides = {}) {
  return {
    playerId: "player.stat_growth",
    coreData: {
      lineageId: "lineage.human"
    },
    attributes: {
      STR: 12,
      DEX: 12,
      AGI: 12,
      CON: 12,
      VIT: 12,
      WIS: 12,
      INT: 12,
      SPT: 12,
      CHA: 12,
      ...(overrides.attributes ?? {})
    },
    bodyState: overrides.bodyState ??
      createDefaultPlayerBodyState({
        tick: 24,
        day: 6,
        lineageId: "lineage.human"
      }),
    statGrowth: overrides.statGrowth ?? createDefaultPlayerStatGrowthState(6)
  };
}

test("applyActionAttributeLoad saturates stored load instead of hoarding linearly", () => {
  const player = createPlayerFixture();
  const profile = {
    intensity: "high",
    sourceTag: "labor",
    weights: { STR: 0.9, CON: 0.7, VIT: 0.5 },
    meaningfulInteraction: true
  };

  for (let index = 0; index < 30; index += 1) {
    applyActionAttributeLoad(player, profile, 1, 6);
  }

  assert.ok(player.statGrowth.load.STR > 0);
  assert.ok(player.statGrowth.load.STR < 48, "load should stay below the hard cap");
});

test("convertPlayerStatGrowthOnRecovery turns stored load into permanent stat progress only during recovery", () => {
  const player = createPlayerFixture();
  const profile = {
    intensity: "high",
    sourceTag: "labor",
    weights: { STR: 0.9, CON: 0.7, VIT: 0.5 },
    meaningfulInteraction: true
  };

  for (let index = 0; index < 18; index += 1) {
    applyActionAttributeLoad(player, profile, 1, 6);
  }

  const beforeStrength = player.attributes.STR;
  const result = convertPlayerStatGrowthOnRecovery(player, 144, 6, {
    quality: 1,
    durationHours: 6
  });

  assert.ok(result.changedAttributes.includes("STR"));
  assert.ok(player.statGrowth.progress.STR > 0 || player.attributes.STR > beforeStrength);
  assert.ok(player.statGrowth.load.STR < 18 * 1.75, "recovery should soften retained load");
});

test("below-gate recovery yields zero stat conversion on all tiers including hardcore", () => {
  const player = createPlayerFixture();
  const profile = {
    intensity: "high",
    sourceTag: "labor",
    weights: { STR: 0.9, CON: 0.7, VIT: 0.5 },
    meaningfulInteraction: true
  };

  for (let index = 0; index < 12; index += 1) {
    applyActionAttributeLoad(player, profile, 1, 6);
  }

  const beforeAttributes = { ...player.attributes };
  const beforeProgress = { ...player.statGrowth.progress };
  const baselineResult = convertPlayerStatGrowthOnRecovery(
    player,
    144,
    6,
    { quality: 0.4, durationHours: 2 },
    { tier: "normal", hardcore: false }
  );
  const hardcoreResult = convertPlayerStatGrowthOnRecovery(
    player,
    145,
    6,
    { quality: 0.4, durationHours: 2 },
    { tier: "hard", hardcore: true }
  );

  assert.deepEqual(baselineResult, { gainedAttributes: [], changedAttributes: [] });
  assert.deepEqual(hardcoreResult, { gainedAttributes: [], changedAttributes: [] });
  assert.deepEqual(player.attributes, beforeAttributes);
  assert.deepEqual(player.statGrowth.progress, beforeProgress);
});

test("normal difficulty is a baseline lock for stat-growth load and recovery conversion", () => {
  const unrestricted = createPlayerFixture();
  const explicitNormal = createPlayerFixture();
  const profile = {
    intensity: "high",
    sourceTag: "labor",
    weights: { STR: 0.9, CON: 0.7, VIT: 0.5 },
    meaningfulInteraction: true
  };

  for (let index = 0; index < 10; index += 1) {
    applyActionAttributeLoad(unrestricted, profile, 1, 6);
    applyActionAttributeLoad(explicitNormal, profile, 1, 6, { tier: "normal", hardcore: false });
  }

  assert.deepEqual(explicitNormal.statGrowth.load, unrestricted.statGrowth.load);

  convertPlayerStatGrowthOnRecovery(unrestricted, 144, 6, { quality: 1, durationHours: 6 });
  convertPlayerStatGrowthOnRecovery(
    explicitNormal,
    144,
    6,
    { quality: 1, durationHours: 6 },
    { tier: "normal", hardcore: false }
  );

  assert.deepEqual(explicitNormal.attributes, unrestricted.attributes);
  assert.deepEqual(explicitNormal.statGrowth.progress, unrestricted.statGrowth.progress);
  assert.deepEqual(explicitNormal.statGrowth.load, unrestricted.statGrowth.load);
});

test("difficulty saturation formulas preserve start below cap on every tier", () => {
  const rule = loadStatGrowthBalanceRule();
  const attributeKeys = ["STR", "DEX", "AGI", "CON", "VIT", "WIS", "INT", "SPT", "CHA"];

  for (const tier of ["easy", "normal", "hard", "brutal"]) {
    const modifiers = resolveRunDifficultyModifiers({ tier, hardcore: false });

    for (const key of attributeKeys) {
      const threshold = rule.thresholds[key];
      const saturationStart =
        threshold.loadThreshold * rule.saturation.startMultiplier * modifiers.statGrowth.saturationScalar;
      const hardLoadCap = Math.max(
        saturationStart + 0.01,
        threshold.loadThreshold * rule.saturation.hardCapMultiplier * modifiers.statGrowth.saturationScalar
      );

      assert.ok(
        saturationStart < hardLoadCap,
        `expected saturation start below hard cap for ${tier}:${key}`
      );
    }
  }
});

test("attribute tension lowers precision performance and precision-oriented load efficiency", () => {
  const balanced = createPlayerFixture();
  const strained = createPlayerFixture({
    attributes: {
      STR: 20,
      DEX: 10
    }
  });
  const profile = {
    intensity: "moderate",
    sourceTag: "precision_crafting",
    weights: { DEX: 0.9, INT: 0.6, WIS: 0.3 },
    meaningfulInteraction: true
  };

  const balancedPerformance = applyAttributeTensionToActionProfile(balanced.attributes, profile);
  const strainedPerformance = applyAttributeTensionToActionProfile(strained.attributes, profile);

  applyActionAttributeLoad(balanced, profile, 2, 6);
  applyActionAttributeLoad(strained, profile, 2, 6);

  assert.equal(balancedPerformance, 1);
  assert.ok(strainedPerformance < 1);
  assert.ok(strained.statGrowth.load.DEX < balanced.statGrowth.load.DEX);
});
