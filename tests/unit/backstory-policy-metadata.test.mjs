import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

async function loadJson(relativePath) {
  const raw = await readFile(relativePath, "utf8");
  return JSON.parse(raw.replace(/^\uFEFF/, ""));
}

async function loadRecords(relativePath) {
  return (await loadJson(relativePath)).records;
}

const BACKSTORY_POLICY_METADATA_PATH = "docs/design/backstory-policy-metadata.json";
const DEFAULT_UNLOCKED_BACKSTORY_IDS = [
  "backstory.local",
  "backstory.vagabond",
  "backstory.exile",
  "backstory.farmhand",
  "backstory.amnesiac"
];
const RUNTIME_SOURCE_FILES = [
  "apps/rpg-ui/src/game-shell/characterCreationCatalog.ts",
  "apps/rpg-ui/src/game-shell/characterCreationForm.ts",
  "apps/rpg-ui/src/game-shell/newGameSnapshot.ts",
  "apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx",
  "packages/engines/game-engine/src/legacy-unlocks.ts",
  "packages/content/base/player/legacy_unlocks.json"
];
const IMPLEMENTATION_READY_EXCLUDED_STATUSES = new Set([
  "convert_to_achievement",
  "retire",
  "special_non_default"
]);
const PRIMARY_SKILL_EXCLUDED_STATUSES = new Set(["convert_to_achievement", "retire"]);
const EVIDENCE_REQUIRED_STATUSES = new Set([
  "legacy_locked",
  "rename",
  "rewrite",
  "special_non_default"
]);

test("backstory policy metadata covers every current backstory exactly once", async () => {
  const backstories = await loadRecords("packages/content/base/player/backstories.json");
  const metadata = await loadJson(BACKSTORY_POLICY_METADATA_PATH);
  const backstoryIds = new Set(backstories.map((record) => record.id));
  const policyIds = metadata.records.map((record) => record.backstoryId);

  assert.equal(new Set(policyIds).size, policyIds.length, "policy ids must be unique");
  assert.deepEqual([...new Set(policyIds)].sort(), [...backstoryIds].sort());

  for (const policyId of policyIds) {
    assert.ok(backstoryIds.has(policyId), `${policyId} does not reference a current backstory`);
  }
});

test("backstory policy metadata uses declared vocabulary values", async () => {
  const metadata = await loadJson(BACKSTORY_POLICY_METADATA_PATH);
  const allowedFutureStatuses = new Set(metadata.futureStatusValues);
  const allowedToneActions = new Set(metadata.toneActionValues);
  const allowedEvidenceKinds = new Set(metadata.unlockEvidenceKindValues);

  assert.equal(metadata.status, "non_runtime_policy_draft");
  assert.equal(metadata.runtimeImportAllowed, false);
  assert.equal(metadata.baseBackgroundSkillBonusDefault, 5);

  for (const record of metadata.records) {
    assert.ok(
      allowedFutureStatuses.has(record.futureStatus),
      `${record.backstoryId} has invalid futureStatus ${record.futureStatus}`
    );
    assert.ok(
      allowedToneActions.has(record.toneAction),
      `${record.backstoryId} has invalid toneAction ${record.toneAction}`
    );
    assert.ok(
      Array.isArray(record.unlockEvidenceKinds),
      `${record.backstoryId} must define unlockEvidenceKinds`
    );
    for (const evidenceKind of record.unlockEvidenceKinds) {
      assert.ok(
        allowedEvidenceKinds.has(evidenceKind),
        `${record.backstoryId} has invalid unlockEvidenceKind ${evidenceKind}`
      );
    }
  }
});

test("backstory policy metadata validates skill ids and future bonus defaults", async () => {
  const metadata = await loadJson(BACKSTORY_POLICY_METADATA_PATH);
  const skillIds = new Set(
    (await loadRecords("packages/content/base/player/skills.json")).map((record) => record.id)
  );

  for (const record of metadata.records) {
    if (!PRIMARY_SKILL_EXCLUDED_STATUSES.has(record.futureStatus)) {
      assert.ok(
        skillIds.has(record.recommendedPrimaryBackgroundSkillId),
        `${record.backstoryId} references missing primary skill ${record.recommendedPrimaryBackgroundSkillId}`
      );
    }

    if (!IMPLEMENTATION_READY_EXCLUDED_STATUSES.has(record.futureStatus)) {
      assert.equal(
        record.baseBackgroundSkillBonus,
        metadata.baseBackgroundSkillBonusDefault,
        `${record.backstoryId} should use the default future background skill bonus`
      );
    }
  }
});

test("backstory policy metadata preserves expected default and special-case decisions", async () => {
  const metadata = await loadJson(BACKSTORY_POLICY_METADATA_PATH);
  const defaultUnlockedIds = metadata.records
    .filter((record) => record.defaultUnlocked)
    .map((record) => record.backstoryId)
    .sort();
  const byBackstoryId = new Map(metadata.records.map((record) => [record.backstoryId, record]));

  assert.ok(defaultUnlockedIds.length > 0, "at least one backstory must remain default-unlocked");
  assert.deepEqual(defaultUnlockedIds, [...DEFAULT_UNLOCKED_BACKSTORY_IDS].sort());

  for (const record of metadata.records) {
    if (record.futureStatus === "rename") {
      assert.equal(typeof record.recommendedName, "string");
      assert.ok(record.recommendedName.trim().length > 0);
    }

    if (EVIDENCE_REQUIRED_STATUSES.has(record.futureStatus)) {
      assert.ok(
        record.unlockEvidenceKinds.length > 0,
        `${record.backstoryId} should list future unlock evidence kinds`
      );
    }
  }

  assert.equal(byBackstoryId.get("backstory.isekai_outcast")?.futureStatus, "special_non_default");
  assert.equal(byBackstoryId.get("backstory.isekai_outcast")?.baseBackgroundSkillBonus, 0);
  assert.equal(byBackstoryId.get("backstory.local_hero")?.futureStatus, "convert_to_achievement");
  assert.equal(byBackstoryId.get("backstory.local_hero")?.baseBackgroundSkillBonus, 0);
});

test("backstory policy metadata is not imported by live runtime paths", async () => {
  for (const sourceFile of RUNTIME_SOURCE_FILES) {
    const source = await readFile(sourceFile, "utf8");
    assert.doesNotMatch(source, /backstory-policy-metadata/, sourceFile);
  }
});
