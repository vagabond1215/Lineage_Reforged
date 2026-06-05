import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import {
  AUTHORED_SPELL_HOOK_SUPPORT,
  CLASSIFIER_SPELL_RESOLUTION_HOOKS,
  DEFERRED_SPELL_ITEM_GENERATION_HOOK_IDS,
  DEFERRED_SPELL_RESOLUTION_HOOKS,
  RUNTIME_CONSUMED_SPELL_RESOLUTION_HOOKS,
  classifySpellItemGenerationHookId,
  classifySpellResolutionHook,
  validateSpellItemGenerationHooks,
  validateSpellResolutionHooks
} from "../../tools/content-lint/spell-hook-support.mjs";
import {
  AUTHORED_SPELL_HOOK_SUPPORT as SHARED_AUTHORED_SPELL_HOOK_SUPPORT,
  CLASSIFIER_SPELL_RESOLUTION_HOOKS as SHARED_CLASSIFIER_SPELL_RESOLUTION_HOOKS,
  DEFERRED_SPELL_ITEM_GENERATION_HOOK_IDS as SHARED_DEFERRED_SPELL_ITEM_GENERATION_HOOK_IDS,
  DEFERRED_SPELL_RESOLUTION_HOOKS as SHARED_DEFERRED_SPELL_RESOLUTION_HOOKS,
  RUNTIME_CONSUMED_SPELL_RESOLUTION_HOOKS as SHARED_RUNTIME_CONSUMED_SPELL_RESOLUTION_HOOKS
} from "../../packages/shared/types/src/spell-hook-support.js";
import * as typedSpellHookSupport from "../../packages/shared/types/src/spell-hook-support.ts";

const ALPHA_PROMOTED_SPELL_IDS = Object.freeze([
  "spell.water.elemental.waterjet",
  "spell.air.elemental.windblade",
  "spell.earth.elemental.stone_spike",
  "spell.ice.elemental.ice_shard",
  "spell.light.elemental.radiance",
  "spell.lightning.elemental.spark",
  "spell.air.enfeebling.gust",
  "spell.lightning.enfeebling.shock",
  "spell.ice.enfeebling.freeze",
  "spell.druidic.control.root",
  "spell.earth.enhancing.stone_skin",
  "spell.ice.enhancing.frostguard"
]);

async function loadContentRecords(relativePath) {
  const raw = await readFile(relativePath, "utf8");
  return JSON.parse(raw.replace(/^\uFEFF/, "")).records;
}

test("spell hook matrix documents current support groups", () => {
  assert.deepEqual(RUNTIME_CONSUMED_SPELL_RESOLUTION_HOOKS, [
    "damage.magic",
    "damage.ranged",
    "heal.hp",
    "interrupt.primary",
    "status.bind",
    "status.stagger",
    "buff.protect",
    "buff.ward",
    "buff.anthem",
    "mobility.shadow_step",
    "support.berry"
  ]);
  assert.deepEqual(CLASSIFIER_SPELL_RESOLUTION_HOOKS, [
    "school.control",
    "school.elemental",
    "school.enfeebling",
    "school.enhancing",
    "school.healing",
    "school.ranged",
    "school.utility",
    "tradition.druidic",
    "discipline.ninjutsu",
    "discipline.performance",
    "element.air",
    "element.earth",
    "element.fire",
    "element.ice",
    "element.light",
    "element.lightning",
    "element.shadow",
    "element.water"
  ]);
  assert.deepEqual(DEFERRED_SPELL_RESOLUTION_HOOKS, [
    "buff.bless",
    "buff.charge",
    "buff.ember_spikes",
    "buff.grace",
    "buff.haste",
    "buff.haze",
    "buff.march",
    "buff.preserve",
    "buff.regeneration",
    "buff.thornskin",
    "buff.veil",
    "buff.war_song",
    "buff.warmth",
    "buff.waterbreath",
    "debuff.blind",
    "debuff.curse",
    "debuff.dirge",
    "debuff.discord",
    "debuff.soaked",
    "field.smoke",
    "restore.mp",
    "restore.stamina",
    "status.burn",
    "status.slow",
    "utility.mirror",
    "utility.speak_beast",
    "utility.speak_plant"
  ]);
  assert.deepEqual(DEFERRED_SPELL_ITEM_GENERATION_HOOK_IDS, ["generated_item.druidic.berry"]);
});

test("content lint re-exports the browser-safe authored spell hook authority", () => {
  assert.strictEqual(AUTHORED_SPELL_HOOK_SUPPORT, SHARED_AUTHORED_SPELL_HOOK_SUPPORT);
  assert.strictEqual(
    RUNTIME_CONSUMED_SPELL_RESOLUTION_HOOKS,
    SHARED_RUNTIME_CONSUMED_SPELL_RESOLUTION_HOOKS
  );
  assert.strictEqual(
    CLASSIFIER_SPELL_RESOLUTION_HOOKS,
    SHARED_CLASSIFIER_SPELL_RESOLUTION_HOOKS
  );
  assert.strictEqual(
    DEFERRED_SPELL_RESOLUTION_HOOKS,
    SHARED_DEFERRED_SPELL_RESOLUTION_HOOKS
  );
  assert.strictEqual(
    DEFERRED_SPELL_ITEM_GENERATION_HOOK_IDS,
    SHARED_DEFERRED_SPELL_ITEM_GENERATION_HOOK_IDS
  );
  assert.deepEqual(AUTHORED_SPELL_HOOK_SUPPORT, {
    runtimeResolutionHooks: RUNTIME_CONSUMED_SPELL_RESOLUTION_HOOKS,
    classifierResolutionHooks: CLASSIFIER_SPELL_RESOLUTION_HOOKS,
    deferredResolutionHooks: DEFERRED_SPELL_RESOLUTION_HOOKS,
    deferredItemGenerationHookIds: DEFERRED_SPELL_ITEM_GENERATION_HOOK_IDS
  });
});

test("tracked TypeScript and JavaScript shared hook entries stay identical", () => {
  assert.deepEqual(
    typedSpellHookSupport.RUNTIME_CONSUMED_SPELL_RESOLUTION_HOOKS,
    SHARED_RUNTIME_CONSUMED_SPELL_RESOLUTION_HOOKS
  );
  assert.deepEqual(
    typedSpellHookSupport.CLASSIFIER_SPELL_RESOLUTION_HOOKS,
    SHARED_CLASSIFIER_SPELL_RESOLUTION_HOOKS
  );
  assert.deepEqual(
    typedSpellHookSupport.DEFERRED_SPELL_RESOLUTION_HOOKS,
    SHARED_DEFERRED_SPELL_RESOLUTION_HOOKS
  );
  assert.deepEqual(
    typedSpellHookSupport.DEFERRED_SPELL_ITEM_GENERATION_HOOK_IDS,
    SHARED_DEFERRED_SPELL_ITEM_GENERATION_HOOK_IDS
  );
  assert.deepEqual(
    typedSpellHookSupport.AUTHORED_SPELL_HOOK_SUPPORT,
    SHARED_AUTHORED_SPELL_HOOK_SUPPORT
  );
  for (const hook of [
    ...RUNTIME_CONSUMED_SPELL_RESOLUTION_HOOKS,
    ...CLASSIFIER_SPELL_RESOLUTION_HOOKS,
    ...DEFERRED_SPELL_RESOLUTION_HOOKS,
    "spell.future.unmapped"
  ]) {
    assert.equal(
      typedSpellHookSupport.classifySpellResolutionHook(hook),
      classifySpellResolutionHook(hook),
      hook
    );
  }
});

test("current authored spell hook inventory matches the canonical four-class boundary", async () => {
  const records = await loadContentRecords("packages/content/base/player/spells.json");
  const compatibilityCounts = new Map();
  const occurrenceCounts = new Map([
    ["runtime", 0],
    ["classifier", 0],
    ["deferred", 0],
    ["unknown", 0]
  ]);
  const uniqueHooks = new Map([
    ["runtime", new Set()],
    ["classifier", new Set()],
    ["deferred", new Set()],
    ["unknown", new Set()]
  ]);
  const itemGenerationHookIds = [];

  for (const record of records) {
    compatibilityCounts.set(
      record.compatibilityStatus,
      (compatibilityCounts.get(record.compatibilityStatus) ?? 0) + 1
    );
    for (const hook of record.resolutionHooks ?? []) {
      const classification = classifySpellResolutionHook(hook);
      occurrenceCounts.set(classification, occurrenceCounts.get(classification) + 1);
      uniqueHooks.get(classification).add(hook);
    }
    for (const hook of record.itemGenerationHooks ?? []) {
      itemGenerationHookIds.push(hook.generatedItemId);
    }
  }

  assert.equal(records.length, 55);
  assert.deepEqual(Object.fromEntries(compatibilityCounts), {
    ready: 23,
    partial: 5,
    deferred: 27
  });
  assert.deepEqual(Object.fromEntries(occurrenceCounts), {
    runtime: 32,
    classifier: 110,
    deferred: 30,
    unknown: 0
  });
  assert.deepEqual(
    [...uniqueHooks.get("runtime")].sort(),
    [...RUNTIME_CONSUMED_SPELL_RESOLUTION_HOOKS].sort()
  );
  assert.deepEqual(
    [...uniqueHooks.get("classifier")].sort(),
    [...CLASSIFIER_SPELL_RESOLUTION_HOOKS].sort()
  );
  assert.deepEqual(
    [...uniqueHooks.get("deferred")].sort(),
    [...DEFERRED_SPELL_RESOLUTION_HOOKS].sort()
  );
  assert.deepEqual([...uniqueHooks.get("unknown")], []);
  assert.deepEqual(itemGenerationHookIds, DEFERRED_SPELL_ITEM_GENERATION_HOOK_IDS);
});

test("current authored spells use known classified resolution hooks", async () => {
  const records = await loadContentRecords("packages/content/base/player/spells.json");

  for (const record of records) {
    assert.deepEqual(
      validateSpellResolutionHooks({
        hooks: record.resolutionHooks ?? [],
        source: record.id
      }),
      [],
      record.id
    );
  }
});

test("Alpha promoted spells use only runtime or classifier resolution hooks", async () => {
  const records = await loadContentRecords("packages/content/base/player/spells.json");
  const recordsById = new Map(records.map((record) => [record.id, record]));

  for (const id of ALPHA_PROMOTED_SPELL_IDS) {
    const record = recordsById.get(id);
    assert.ok(record, `${id} exists`);
    assert.equal(record.compatibilityStatus, "ready", id);
    for (const hook of record.resolutionHooks ?? []) {
      assert.ok(["runtime", "classifier"].includes(classifySpellResolutionHook(hook)), `${id} uses supported hook ${hook}`);
    }
  }
});

test("runtime, classifier, and deferred spell hooks are distinguished", () => {
  assert.equal(classifySpellResolutionHook("damage.magic"), "runtime");
  assert.equal(classifySpellResolutionHook("school.elemental"), "classifier");
  assert.equal(classifySpellResolutionHook("element.fire"), "classifier");
  assert.equal(classifySpellResolutionHook("buff.bless"), "deferred");
  assert.equal(classifySpellResolutionHook("restore.mp"), "deferred");
  assert.equal(classifySpellResolutionHook("school.summoning"), "unknown");
});

test("known deferred spell hooks are accepted only by explicit classification", () => {
  assert.deepEqual(
    validateSpellResolutionHooks({
      hooks: ["buff.bless", "restore.mp", "utility.mirror"],
      source: "fixture.deferred"
    }),
    []
  );

  assert.match(
    validateSpellResolutionHooks({
      hooks: ["buff.future_blessing"],
      source: "fixture.unknown"
    }).join("\n"),
    /unknown spell resolution hook 'buff\.future_blessing'/
  );
});

test("future-looking spell hook namespaces are not accepted by wildcard", () => {
  for (const hook of ["school.future", "element.void", "tradition.dark", "discipline.hexcraft", "utility.instant_win"]) {
    assert.match(
      validateSpellResolutionHooks({
        hooks: [hook],
        source: "fixture.future"
      }).join("\n"),
      new RegExp(`unknown spell resolution hook '${hook.replace(".", "\\.")}'`)
    );
  }
});

test("spell item-generation hooks are deferred and explicit", async () => {
  const records = await loadContentRecords("packages/content/base/player/spells.json");
  const hooks = records.flatMap((record) => record.itemGenerationHooks ?? []);

  assert.equal(classifySpellItemGenerationHookId("generated_item.druidic.berry"), "deferred");
  assert.deepEqual(
    validateSpellItemGenerationHooks({
      hooks,
      source: "packages/content/base/player/spells.json itemGenerationHooks"
    }),
    []
  );
  assert.match(
    validateSpellItemGenerationHooks({
      hooks: [{ generatedItemId: "generated_item.arcane_scroll" }],
      source: "fixture.itemGenerationHooks"
    }).join("\n"),
    /unknown spell item-generation hook 'generated_item\.arcane_scroll'/
  );
});
