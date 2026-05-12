import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import {
  CLASSIFIER_SPELL_RESOLUTION_HOOKS,
  DEFERRED_SPELL_ITEM_GENERATION_HOOK_IDS,
  DEFERRED_SPELL_RESOLUTION_HOOKS,
  RUNTIME_CONSUMED_SPELL_RESOLUTION_HOOKS,
  classifySpellItemGenerationHookId,
  classifySpellResolutionHook,
  validateSpellItemGenerationHooks,
  validateSpellResolutionHooks
} from "../../tools/content-lint/spell-hook-support.mjs";

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
  assert.ok(CLASSIFIER_SPELL_RESOLUTION_HOOKS.includes("school.elemental"));
  assert.ok(CLASSIFIER_SPELL_RESOLUTION_HOOKS.includes("tradition.druidic"));
  assert.ok(CLASSIFIER_SPELL_RESOLUTION_HOOKS.includes("discipline.ninjutsu"));
  assert.ok(DEFERRED_SPELL_RESOLUTION_HOOKS.includes("buff.bless"));
  assert.ok(DEFERRED_SPELL_RESOLUTION_HOOKS.includes("restore.mp"));
  assert.deepEqual(DEFERRED_SPELL_ITEM_GENERATION_HOOK_IDS, ["generated_item.druidic.berry"]);
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
