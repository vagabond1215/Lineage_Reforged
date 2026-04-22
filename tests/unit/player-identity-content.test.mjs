import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

const BACKSTORY_STARTING_LORE_ALLOWLIST = new Set([
  "skill.knowledge.general_lore",
  "skill.knowledge.flora_lore",
  "skill.knowledge.fauna_lore",
  "skill.knowledge.mineral_lore",
  "skill.knowledge.arcane_lore",
  "skill.knowledge.cultural_lore",
  "skill.knowledge.civic_lore"
]);

const BACKSTORY_STARTING_ABILITY_ALLOWLIST = new Map([
  ["backstory.village_hunter", new Set(["ability.ranged.quick_shot"])],
  ["backstory.military_brat", new Set(["ability.command.hold_formation"])]
]);

async function loadPlayerJson(relativePath) {
  const raw = await readFile(relativePath, "utf8");
  return JSON.parse(raw.replace(/^\uFEFF/, "")).records;
}

test("backstories stay within canonical starting lore and ability rules", async () => {
  const records = await loadPlayerJson("packages/content/base/player/backstories.json");

  for (const record of records) {
    const loreSkills = (record.startingSkills ?? []).filter((entry) =>
      String(entry.skillId).startsWith("skill.knowledge.")
    );

    for (const loreSkill of loreSkills) {
      assert.ok(
        BACKSTORY_STARTING_LORE_ALLOWLIST.has(loreSkill.skillId),
        `${record.id} uses non-canonical starting lore '${loreSkill.skillId}'`
      );
    }

    const allowedAbilityIds = BACKSTORY_STARTING_ABILITY_ALLOWLIST.get(record.id) ?? new Set();
    for (const abilityId of record.startingAbilityIds ?? []) {
      assert.ok(
        allowedAbilityIds.has(abilityId),
        `${record.id} is not allowed to grant '${abilityId}'`
      );
    }
  }
});

test("backstories avoid broad combat-fundamentals starter drift", async () => {
  const records = await loadPlayerJson("packages/content/base/player/backstories.json");

  for (const record of records) {
    assert.ok(
      !(record.startingSkills ?? []).some(
        (entry) => entry.skillId === "skill.combat.combat_fundamentals"
      ),
      `${record.id} still grants skill.combat.combat_fundamentals`
    );
  }
});

test("starting bundles keep unique 1-of-N choice-group item options", async () => {
  const records = await loadPlayerJson("packages/content/base/player/starting_bundles.json");

  for (const record of records) {
    for (const group of record.choiceGroups ?? []) {
      const optionItemIds = group.options.map((option) => option.itemId);
      assert.equal(
        new Set(optionItemIds).size,
        optionItemIds.length,
        `${record.id} repeats choice-group item ids in ${group.id}`
      );
      assert.ok(optionItemIds.length >= 2, `${record.id} choice group ${group.id} must stay 1-of-N`);
    }
  }
});
