import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import {
  ARCANE_COMPENDIUM_CATEGORY,
  buildArcaneCompendiumEntries,
  classifyArcaneCompendiumHook,
  classifyArcaneCompendiumItemGenerationHook,
  getArcaneCompendiumEntries
} from "../../apps/rpg-ui/src/runtime/spellCompatibilityPresentation.ts";
import {
  CLASSIFIER_SPELL_RESOLUTION_HOOKS,
  DEFERRED_SPELL_ITEM_GENERATION_HOOK_IDS,
  DEFERRED_SPELL_RESOLUTION_HOOKS,
  RUNTIME_CONSUMED_SPELL_RESOLUTION_HOOKS
} from "../../packages/shared/types/src/spell-hook-support.js";
import spellCatalog from "../../packages/content/base/player/spells.json" with { type: "json" };

function entryById(entries, id) {
  const entry = entries.find((candidate) => candidate.id === id);
  assert.ok(entry, `${id} exists`);
  return entry;
}

function detailText(entry) {
  return entry.detailGroups
    .flatMap((group) => group.entries.map((detail) => `${group.title}: ${detail.label}: ${detail.value}`))
    .join("\n");
}

test("Arcane Compendium mapper projects all authored spells as read-only entries", () => {
  const entries = getArcaneCompendiumEntries();

  assert.equal(entries.length, 55);
  assert.equal(entries.every((entry) => entry.category === ARCANE_COMPENDIUM_CATEGORY), true);
  assert.equal(new Set(entries.map((entry) => entry.id)).size, 55);
});

test("Arcane Compendium mapper represents ready, partial, and deferred states", () => {
  const counts = new Map();

  for (const entry of getArcaneCompendiumEntries()) {
    counts.set(entry.status, (counts.get(entry.status) ?? 0) + 1);
  }

  assert.equal(counts.get("Compatibility ready"), 23);
  assert.equal(counts.get("Partial support"), 5);
  assert.equal(counts.get("Deferred behavior"), 27);
});

test("Arcane Compendium mapper surfaces profile tags and catalyst families", () => {
  const surge = entryById(getArcaneCompendiumEntries(), "spell.lightning.healing.surge");
  const text = detailText(surge);

  assert.ok(surge.tags.includes("magic.healing"));
  assert.ok(surge.tags.includes("delivery.ally"));
  assert.ok(surge.tags.includes("lightning"));
  assert.match(text, /Required Tags: all: magic\.healing/);
  assert.match(text, /Delivery Tags: delivery\.ally/);
  assert.match(text, /Catalyst Families: lightning/);
});

test("Arcane Compendium mapper emits warnings for partial and runtime-blocked records", () => {
  const entries = getArcaneCompendiumEntries();
  const drainText = detailText(entryById(entries, "spell.shadow.healing.drain"));
  const berryText = detailText(entryById(entries, "spell.druidic.healing.berry"));
  const curseText = detailText(entryById(entries, "spell.shadow.enfeebling.curse"));

  assert.match(drainText, /Partial support:/);
  assert.match(berryText, /Runtime blocked: deferred item generation generated_item\.druidic\.berry/);
  assert.match(curseText, /Runtime blocked: deferred hooks debuff\.curse/);
});

test("Arcane Compendium hook classification mirrors current validation groups", () => {
  for (const hook of RUNTIME_CONSUMED_SPELL_RESOLUTION_HOOKS) {
    assert.equal(classifyArcaneCompendiumHook(hook), "runtime", hook);
  }
  for (const hook of CLASSIFIER_SPELL_RESOLUTION_HOOKS) {
    assert.equal(classifyArcaneCompendiumHook(hook), "classifier", hook);
  }
  for (const hook of DEFERRED_SPELL_RESOLUTION_HOOKS) {
    assert.equal(classifyArcaneCompendiumHook(hook), "deferred", hook);
  }
  for (const hookId of DEFERRED_SPELL_ITEM_GENERATION_HOOK_IDS) {
    assert.equal(
      classifyArcaneCompendiumItemGenerationHook(hookId),
      "deferred",
      hookId
    );
  }
  assert.equal(classifyArcaneCompendiumHook("spell.future.unmapped"), "unknown");
  assert.equal(
    classifyArcaneCompendiumItemGenerationHook("generated_item.future.unmapped"),
    "unknown"
  );
});

test("Arcane Compendium imports the shared hook authority instead of copying hook ids", async () => {
  const source = await readFile(
    "apps/rpg-ui/src/runtime/spellCompatibilityPresentation.ts",
    "utf8"
  );

  assert.match(source, /packages\/shared\/types\/src\/spell-hook-support\.js/);
  assert.doesNotMatch(source, /new Set\(\[\s*['"]damage\.magic/);
  assert.doesNotMatch(source, /new Set\(\[\s*['"]school\.control/);
  assert.doesNotMatch(source, /new Set\(\[\s*['"]buff\.bless/);
  assert.doesNotMatch(source, /new Set\(\[\s*['"]generated_item\.druidic\.berry/);
});

test("Arcane Compendium mapper can project explicit records without runtime state", () => {
  const entries = buildArcaneCompendiumEntries(spellCatalog.records);

  assert.equal(entries.length, 55);
  assert.equal(entries.some((entry) => entry.id === "spell.fire.elemental.firebolt"), true);
});
