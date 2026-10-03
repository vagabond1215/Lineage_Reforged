import test from "node:test";
import assert from "node:assert/strict";

const profile = await import("../../apps/rpg-ui/src/game-shell/characterCreationProfileTraits.ts");
const appearance = await import("../../apps/rpg-ui/src/game-shell/characterCreationAppearance.ts");
const portraitSpec = await import("../../apps/rpg-ui/src/game-shell/characterPortraitSpec.ts");
const portraitProvider = await import("../../apps/rpg-ui/src/game-shell/characterPortraitProvider.ts");

function fixedSequence(values) {
  let index = 0;
  return () => {
    const value = values[index % values.length];
    index += 1;
    return value;
  };
}

test("profile trait catalog is internally valid and every trait carries exactly eight weight units", () => {
  assert.deepEqual(profile.validateCharacterProfileTraitCatalog(), []);
  assert.ok(profile.CHARACTER_PROFILE_TRAITS.length >= 40);
  for (const entry of profile.CHARACTER_PROFILE_TRAITS) {
    const total = Object.values(entry.attributeWeights).reduce((sum, value) => sum + (value ?? 0), 0);
    assert.equal(total, 8, entry.id);
    assert.ok(entry.id.startsWith("profile_trait."), entry.id);
  }
  assert.equal(
    profile.validateCharacterProfileTraitSelection(profile.DEFAULT_CHARACTER_PROFILE_TRAIT_IDS).isValid,
    true
  );
});

test("profile trait randomization is valid by construction across a broad deterministic sample", () => {
  for (let i = 0; i < 500; i += 1) {
    const rng = fixedSequence([
      ((i * 17) % 97) / 97,
      ((i * 29 + 7) % 101) / 101,
      ((i * 43 + 11) % 103) / 103,
      ((i * 59 + 13) % 107) / 107,
      ((i * 71 + 17) % 109) / 109
    ]);
    const ids = profile.generateRandomCharacterProfileTraitIds(rng);
    const validation = profile.validateCharacterProfileTraitSelection(ids);
    assert.equal(ids.length, 6);
    assert.equal(validation.isValid, true, validation.errors.join(" | "));
  }
});

test("profile trait aggregation is selection-order independent", () => {
  const ids = [...profile.DEFAULT_CHARACTER_PROFILE_TRAIT_IDS];
  const forward = profile.aggregateCharacterProfileTraitWeights(ids);
  const reverse = profile.aggregateCharacterProfileTraitWeights([...ids].reverse());
  assert.deepEqual(forward, reverse);
});

test("appearance catalog is mechanically inert and dependency validation is deterministic", () => {
  assert.deepEqual(appearance.validateCharacterAppearanceCatalog(), []);
  for (const entry of appearance.CHARACTER_APPEARANCE_DESCRIPTORS) {
    assert.equal(Object.hasOwn(entry, "attributeWeights"), false, entry.id);
    assert.ok(entry.id.startsWith("appearance."), entry.id);
  }
  const context = { sexId: "female", lineageId: "lineage.human" };
  const validation = appearance.validateCharacterAppearanceSelection(
    appearance.DEFAULT_CHARACTER_APPEARANCE_DESCRIPTOR_IDS,
    context
  );
  assert.equal(validation.isValid, true, validation.errors.join(" | "));
});

test("appearance randomization never emits an invalid hair or facial-hair combination", () => {
  for (const sexId of ["male", "female"]) {
    for (let i = 0; i < 300; i += 1) {
      const rng = fixedSequence([
        ((i * 13) % 89) / 89,
        ((i * 23 + 5) % 97) / 97,
        ((i * 31 + 9) % 101) / 101,
        ((i * 47 + 3) % 103) / 103
      ]);
      const context = { sexId, lineageId: "lineage.human" };
      const ids = appearance.generateRandomCharacterAppearanceDescriptorIds(context, rng);
      const validation = appearance.validateCharacterAppearanceSelection(ids, context);
      assert.equal(validation.isValid, true, `${sexId}: ${validation.errors.join(" | ")}`);
      if (sexId === "female") {
        assert.equal(ids.some((id) => id.startsWith("appearance.facial_hair.")), false);
      }
    }
  }
});

function createPrompt(overrides = {}) {
  return portraitSpec.buildCharacterPortraitPromptSpec({
    lineageId: "lineage.human",
    sexId: "female",
    ageBandId: "prime",
    heightCm: 170,
    profileTraitIds: profile.DEFAULT_CHARACTER_PROFILE_TRAIT_IDS,
    appearanceDescriptorIds: appearance.DEFAULT_CHARACTER_APPEARANCE_DESCRIPTOR_IDS,
    skinToneId: "warm_beige",
    skinToneLabel: "warm beige",
    hairColorId: "brown",
    hairColorLabel: "brown",
    eyeColorId: "hazel",
    eyeColorLabel: "hazel",
    ...overrides
  });
}

test("portrait prompt fingerprint ignores selection array order and provider details", () => {
  const first = createPrompt();
  const second = createPrompt({
    profileTraitIds: [...profile.DEFAULT_CHARACTER_PROFILE_TRAIT_IDS].reverse(),
    appearanceDescriptorIds: [...appearance.DEFAULT_CHARACTER_APPEARANCE_DESCRIPTOR_IDS].reverse()
  });
  assert.equal(
    portraitSpec.createCharacterPortraitIdentityFingerprint(first),
    portraitSpec.createCharacterPortraitIdentityFingerprint(second)
  );
  assert.match(first.promptText, /hips-up portrait framing/i);
  assert.match(first.promptText, /hands and wrists fully outside the frame/i);
});

test("portrait request completion ignores superseded results and preserves previous image on regeneration failure", () => {
  const prompt = createPrompt();
  const fingerprint = portraitSpec.createCharacterPortraitIdentityFingerprint(prompt);
  const firstStart = portraitProvider.beginCharacterPortraitGeneration(
    portraitProvider.EMPTY_CHARACTER_PORTRAIT_UI_STATE,
    prompt
  );
  const secondStart = portraitProvider.beginCharacterPortraitGeneration(firstStart.state, prompt);

  const lateFirst = portraitProvider.completeCharacterPortraitGeneration({
    state: secondStart.state,
    requestId: firstStart.requestId,
    requestFingerprint: firstStart.requestFingerprint,
    currentIdentityFingerprint: fingerprint,
    result: { ok: true, assetRef: "asset:first", generationId: "first", providerKey: "test" }
  });
  assert.deepEqual(lateFirst, secondStart.state);

  const ready = portraitProvider.completeCharacterPortraitGeneration({
    state: lateFirst,
    requestId: secondStart.requestId,
    requestFingerprint: secondStart.requestFingerprint,
    currentIdentityFingerprint: fingerprint,
    result: { ok: true, assetRef: "asset:second", generationId: "second", providerKey: "test" }
  });
  assert.equal(ready.status, "ready");
  assert.equal(ready.assetRef, "asset:second");

  const regeneration = portraitProvider.beginCharacterPortraitGeneration(ready, prompt);
  const failed = portraitProvider.completeCharacterPortraitGeneration({
    state: regeneration.state,
    requestId: regeneration.requestId,
    requestFingerprint: regeneration.requestFingerprint,
    currentIdentityFingerprint: fingerprint,
    result: { ok: false, code: "quota", message: "quota", providerKey: "test" }
  });
  assert.equal(failed.status, "failed_regeneration");
  assert.equal(failed.assetRef, "asset:second");
});

test("portrait completion is stale when identity changes while the request is in flight", () => {
  const prompt = createPrompt();
  const changed = createPrompt({ hairColorId: "black", hairColorLabel: "black" });
  const start = portraitProvider.beginCharacterPortraitGeneration(
    portraitProvider.EMPTY_CHARACTER_PORTRAIT_UI_STATE,
    prompt
  );
  const completed = portraitProvider.completeCharacterPortraitGeneration({
    state: start.state,
    requestId: start.requestId,
    requestFingerprint: start.requestFingerprint,
    currentIdentityFingerprint: portraitSpec.createCharacterPortraitIdentityFingerprint(changed),
    result: { ok: true, assetRef: "asset:old", generationId: "old", providerKey: "test" }
  });
  assert.equal(completed.status, "stale");
  assert.equal(completed.assetRef, "asset:old");
});

test("portrait completion is stale when current identity becomes temporarily invalid", () => {
  const prompt = createPrompt();
  const start = portraitProvider.beginCharacterPortraitGeneration(
    portraitProvider.EMPTY_CHARACTER_PORTRAIT_UI_STATE,
    prompt
  );
  const completed = portraitProvider.completeCharacterPortraitGeneration({
    state: start.state,
    requestId: start.requestId,
    requestFingerprint: start.requestFingerprint,
    currentIdentityFingerprint: null,
    result: {
      ok: true,
      assetRef: "asset:invalidated",
      generationId: "invalidated",
      providerKey: "test"
    }
  });
  assert.equal(completed.status, "stale");
  assert.equal(completed.assetRef, "asset:invalidated");
});

test("ready portrait becomes stale when current identity is temporarily invalid", () => {
  const prompt = createPrompt();
  const fingerprint = portraitSpec.createCharacterPortraitIdentityFingerprint(prompt);
  const start = portraitProvider.beginCharacterPortraitGeneration(
    portraitProvider.EMPTY_CHARACTER_PORTRAIT_UI_STATE,
    prompt
  );
  const ready = portraitProvider.completeCharacterPortraitGeneration({
    state: start.state,
    requestId: start.requestId,
    requestFingerprint: start.requestFingerprint,
    currentIdentityFingerprint: fingerprint,
    result: { ok: true, assetRef: "asset:ready", generationId: "ready", providerKey: "test" }
  });
  assert.equal(ready.status, "ready");

  const stale = portraitProvider.markCharacterPortraitIdentityChanged(ready, null);
  assert.equal(stale.status, "stale");
  assert.equal(stale.assetRef, "asset:ready");
});
