import test from "node:test";
import assert from "node:assert/strict";

const { CHARACTER_ATTRIBUTE_ORDER } = await import("../../apps/rpg-ui/src/game-shell/characterAttributes.ts");
const {
  DEFAULT_CHARACTER_PROFILE_TRAIT_IDS,
  generateRandomCharacterProfileTraitIds,
  validateCharacterProfileTraitSelection
} = await import("../../apps/rpg-ui/src/game-shell/characterCreationProfileTraits.ts");
const {
  resolveCharacterCreationAttributes,
  resolveGeneratedProfilePointDistribution
} = await import("../../apps/rpg-ui/src/game-shell/characterCreationMath.ts");

function sumPlayerAttributes(attributes) {
  return CHARACTER_ATTRIBUTE_ORDER.reduce((total, attributeKey) => total + attributes[attributeKey], 0);
}

function deterministicRng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function resolve(profileTraitIds, overrides = {}) {
  return resolveCharacterCreationAttributes({
    lineageId: "lineage.human",
    sexId: "male",
    ageBandId: "prime",
    heightBandId: "normal",
    profileTraitIds,
    backstoryId: "backstory.local_hero",
    ...overrides
  });
}

test("approved default six-trait profile resolves deterministically to a 100-total character", () => {
  const first = resolve(DEFAULT_CHARACTER_PROFILE_TRAIT_IDS);
  const second = resolve([...DEFAULT_CHARACTER_PROFILE_TRAIT_IDS].reverse());

  assert.deepEqual(first.errors, []);
  assert.deepEqual(second.errors, []);
  assert.deepEqual(first.baseAttributes, second.baseAttributes);
  assert.deepEqual(first.generatedProfilePoints, second.generatedProfilePoints);
  assert.deepEqual(first.finalAttributes, second.finalAttributes);
  assert.equal(sumPlayerAttributes(first.baseAttributes), 90);
  assert.equal(sumPlayerAttributes(first.generatedProfilePoints), 10);
  assert.equal(sumPlayerAttributes(first.finalAttributes), 100);

  for (const attributeKey of CHARACTER_ATTRIBUTE_ORDER) {
    assert.ok(first.generatedProfilePoints[attributeKey] >= 0, attributeKey);
    assert.ok(Number.isInteger(first.generatedProfilePoints[attributeKey]));
    assert.ok(first.finalAttributes[attributeKey] >= 1, attributeKey);
  }
});

test("five hundred valid randomized profiles preserve resolver invariants", () => {
  for (let seed = 1; seed <= 500; seed += 1) {
    const profileTraitIds = generateRandomCharacterProfileTraitIds(deterministicRng(seed));
    const validation = validateCharacterProfileTraitSelection(profileTraitIds, "lineage.human");
    assert.equal(validation.isValid, true, `${seed}: ${validation.errors.join(" | ")}`);

    const resolution = resolve(profileTraitIds);
    assert.deepEqual(resolution.errors, [], `${seed}: ${resolution.errors.join(" | ")}`);
    assert.equal(sumPlayerAttributes(resolution.baseAttributes), 90);
    assert.equal(sumPlayerAttributes(resolution.generatedProfilePoints), 10);
    assert.equal(sumPlayerAttributes(resolution.finalAttributes), 100);
  }
});

test("invalid trait count fails rather than silently reallocating profile power", () => {
  const resolution = resolve(DEFAULT_CHARACTER_PROFILE_TRAIT_IDS.slice(0, 5));
  assert.ok(resolution.errors.some((error) => /exactly 6 profile traits/i.test(error)));
});

test("remainder ties inside epsilon resolve by canonical stat order", () => {
  const distribution = resolveGeneratedProfilePointDistribution({
    STR: 0.1333334,
    DEX: 0.13333335,
    AGI: 0.1333333,
    CON: 0.1,
    VIT: 0.1,
    INT: 0.1,
    WIS: 0.1,
    SPT: 0.1,
    CHA: 0.1
  });

  assert.deepEqual(distribution, {
    STR: 2,
    DEX: 1,
    AGI: 1,
    CON: 1,
    VIT: 1,
    INT: 1,
    WIS: 1,
    SPT: 1,
    CHA: 1
  });
});
