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

const STARTER_SKILL_POLICY = Object.freeze({
  defaultCap: 25,
  firstBreakthroughRank: 30,
  maxSkillsPerBackstory: 5
});

async function loadPlayerJson(relativePath) {
  const raw = await readFile(relativePath, "utf8");
  return JSON.parse(raw.replace(/^\uFEFF/, "")).records;
}

function validateStarterSkillPolicy(record) {
  const startingSkills = record.startingSkills ?? [];
  if (!Array.isArray(startingSkills) || startingSkills.length === 0) {
    throw new Error(`${record.id} must define starter skills`);
  }
  if (startingSkills.length > STARTER_SKILL_POLICY.maxSkillsPerBackstory) {
    throw new Error(`${record.id} grants too many starter skills`);
  }

  const seenSkillIds = new Set();
  for (const [index, entry] of startingSkills.entries()) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error(`${record.id} has invalid starter skill entry ${index}`);
    }
    if (typeof entry.skillId !== "string" || entry.skillId.trim().length === 0) {
      throw new Error(`${record.id} has invalid starter skill id at ${index}`);
    }
    if (seenSkillIds.has(entry.skillId)) {
      throw new Error(`${record.id} repeats starter skill ${entry.skillId}`);
    }
    seenSkillIds.add(entry.skillId);
    if (!Number.isInteger(entry.level) || entry.level < 1) {
      throw new Error(`${record.id} has invalid starter skill rank for ${entry.skillId}`);
    }
    if (entry.level >= STARTER_SKILL_POLICY.firstBreakthroughRank) {
      throw new Error(`${record.id} starter skill ${entry.skillId} reaches first breakthrough`);
    }
    if (entry.level > STARTER_SKILL_POLICY.defaultCap) {
      throw new Error(`${record.id} starter skill ${entry.skillId} exceeds starter cap`);
    }
  }
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

test("backstories stay within starter skill cap guardrails", async () => {
  const records = await loadPlayerJson("packages/content/base/player/backstories.json");
  let totalStarterSkillEntries = 0;
  let highestStarterRank = 0;

  for (const record of records) {
    assert.doesNotThrow(() => validateStarterSkillPolicy(record), record.id);
    totalStarterSkillEntries += record.startingSkills.length;
    highestStarterRank = Math.max(
      highestStarterRank,
      ...record.startingSkills.map((entry) => entry.level)
    );
  }

  assert.equal(records.length, 25);
  assert.equal(totalStarterSkillEntries, 106);
  assert.equal(highestStarterRank, STARTER_SKILL_POLICY.defaultCap);
});

test("starter skill policy rejects invalid backstory fixtures", () => {
  const fixture = (id, startingSkills) => ({ id, startingSkills });

  assert.throws(
    () =>
      validateStarterSkillPolicy(
        fixture("fixture.duplicate", [
          { skillId: "skill.knowledge.general_lore", level: 15 },
          { skillId: "skill.knowledge.general_lore", level: 15 }
        ])
      ),
    /repeats starter skill/
  );
  assert.throws(
    () =>
      validateStarterSkillPolicy(
        fixture("fixture.too_many", [
          { skillId: "skill.test.one", level: 15 },
          { skillId: "skill.test.two", level: 15 },
          { skillId: "skill.test.three", level: 15 },
          { skillId: "skill.test.four", level: 15 },
          { skillId: "skill.test.five", level: 15 },
          { skillId: "skill.test.six", level: 15 }
        ])
      ),
    /too many starter skills/
  );
  assert.throws(
    () =>
      validateStarterSkillPolicy(
        fixture("fixture.over_cap", [{ skillId: "skill.knowledge.general_lore", level: 26 }])
      ),
    /exceeds starter cap/
  );
  assert.throws(
    () =>
      validateStarterSkillPolicy(
        fixture("fixture.breakthrough", [{ skillId: "skill.knowledge.general_lore", level: 30 }])
      ),
    /reaches first breakthrough/
  );
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

test("runtime starter skill paths do not import draft Legacy skill tracks", async () => {
  const runtimeSourceFiles = [
    "apps/rpg-ui/src/game-shell/characterCreationCatalog.ts",
    "apps/rpg-ui/src/game-shell/newGameSnapshot.ts",
    "apps/rpg-ui/src/game-shell/components/AccountMetaPanel.tsx",
    "packages/engines/game-engine/src/legacy-unlocks.ts",
    "packages/content/base/player/legacy_unlocks.json"
  ];

  for (const sourceFile of runtimeSourceFiles) {
    const source = await readFile(sourceFile, "utf8");
    assert.doesNotMatch(source, /legacy-upgrade-catalog-draft/, sourceFile);
    assert.doesNotMatch(source, /draft\.legacy\.skill/, sourceFile);
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
