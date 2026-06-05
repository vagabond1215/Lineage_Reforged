import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import {
  DESCRIPTIVE_COMBAT_EFFECT_CHANNELS,
  RUNTIME_CONSUMED_COMBAT_EFFECT_CHANNELS,
  RUNTIME_CONSUMED_COMBAT_RESOLUTION_HOOKS,
  UTILITY_ONLY_ITEM_EFFECT_CHANNELS,
  isUtilityOnlyItemUseProfile,
  validateCombatEffectChannels,
  validateCombatResolutionHooks
} from "../../tools/content-lint/combat-hook-support.mjs";
import {
  RUNTIME_CONSUMED_SPELL_RESOLUTION_HOOKS
} from "../../packages/shared/types/src/spell-hook-support.js";

async function loadContentRecords(relativePath) {
  const raw = await readFile(relativePath, "utf8");
  return JSON.parse(raw.replace(/^\uFEFF/, "")).records;
}

function assertSupportedChannels(channels, source, options = {}) {
  assert.deepEqual(
    validateCombatEffectChannels({
      channels,
      source,
      ...options
    }),
    [],
    source
  );
}

function assertSupportedHooks(hooks, source) {
  assert.deepEqual(
    validateCombatResolutionHooks({
      hooks,
      source
    }),
    [],
    source
  );
}

test("combat hook matrix keeps current channel labels explicit", () => {
  assert.deepEqual(RUNTIME_CONSUMED_COMBAT_EFFECT_CHANNELS, [
    "damage",
    "power",
    "pressure",
    "armorBreak",
    "penetration",
    "critChance",
    "guardPressure",
    "healingPower",
    "magnitude",
    "barrier",
    "tempo",
    "duration",
    "statusChance",
    "stagger",
    "blockChance",
    "damageMitigation",
    "mitigation",
    "evasion",
    "interrupt"
  ]);
  assert.deepEqual(DESCRIPTIVE_COMBAT_EFFECT_CHANNELS, [
    "accuracy",
    "accuracyPenalty",
    "evasionPenalty",
    "counter",
    "control",
    "execution",
    "manaEfficiency",
    "charges",
    "penaltyReduction",
    "recoveryWindow",
    "reposition",
    "slow",
    "staggerResistance",
    "stun",
    "threat"
  ]);
  assert.deepEqual(UTILITY_ONLY_ITEM_EFFECT_CHANNELS, [
    "yield",
    "wasteReduction",
    "timeEfficiency"
  ]);
});

test("runtime-consumed spell hooks remain a subset of combat runtime support", () => {
  assert.deepEqual(
    RUNTIME_CONSUMED_SPELL_RESOLUTION_HOOKS.filter(
      (hook) => !RUNTIME_CONSUMED_COMBAT_RESOLUTION_HOOKS.includes(hook)
    ),
    []
  );
});

test("current live skill effects use supported combat channels and hooks", async () => {
  const records = await loadContentRecords("packages/content/base/player/skill_effects.json");

  for (const record of records) {
    for (const [index, channel] of record.channels.entries()) {
      const source = `${record.id}.channels[${index}]`;
      assertSupportedChannels([channel.effectChannel], `${source}.effectChannel`);
      assertSupportedHooks(channel.resolutionHooks ?? [], `${source}.resolutionHooks`);
    }
  }
});

test("current live abilities use supported combat channels and hooks", async () => {
  const records = await loadContentRecords("packages/content/base/player/abilities.json");

  for (const record of records) {
    assertSupportedChannels(record.effectChannels ?? [], `${record.id}.effectChannels`);
    assertSupportedHooks(record.resolutionHooks ?? [], `${record.id}.resolutionHooks`);
  }
});

test("current live item useProfiles use supported channels and hooks", async () => {
  const records = await loadContentRecords("packages/content/base/items/items.json");

  for (const record of records) {
    for (const [index, profile] of (record.useProfiles ?? []).entries()) {
      const source = `${record.id}.useProfiles[${index}]`;
      assertSupportedChannels(profile.effectChannels ?? [], `${source}.effectChannels`, {
        allowUtilityOnlyItemChannels: isUtilityOnlyItemUseProfile(profile)
      });
      assertSupportedHooks(profile.resolutionHooks ?? [], `${source}.resolutionHooks`);
    }
  }
});

test("unsupported combat hook fixtures fail validation", () => {
  assert.match(
    validateCombatEffectChannels({
      channels: ["instantVictory"],
      source: "fixture.effectChannels"
    }).join("\n"),
    /unsupported combat effect channel 'instantVictory'/
  );
  assert.match(
    validateCombatResolutionHooks({
      hooks: ["weapon.future"],
      source: "fixture.resolutionHooks"
    }).join("\n"),
    /unsupported combat resolution hook 'weapon.future'/
  );
  assert.match(
    validateCombatResolutionHooks({
      hooks: ["crit.instant_kill"],
      source: "fixture.resolutionHooks"
    }).join("\n"),
    /unsupported combat resolution hook 'crit.instant_kill'/
  );
});

test("utility-only item channels are rejected outside utility profiles", () => {
  assert.deepEqual(
    validateCombatEffectChannels({
      channels: ["yield", "wasteReduction", "timeEfficiency"],
      source: "fixture.utility.effectChannels",
      allowUtilityOnlyItemChannels: true
    }),
    []
  );
  assert.match(
    validateCombatEffectChannels({
      channels: ["yield"],
      source: "fixture.combat.effectChannels"
    }).join("\n"),
    /utility-only item channel 'yield' outside a utility item profile/
  );
});
