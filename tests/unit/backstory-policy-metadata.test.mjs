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
const PLANNING_VALUE_FIELDS = [
  ["tier", "tierValues"],
  ["laneId", "laneValues"],
  ["branchRole", "branchRoleValues"],
  ["capIntent", "capIntentValues"],
  ["extraEffectIntent", "extraEffectIntentValues"],
  ["runtimeRisk", "runtimeRiskValues"],
  ["implementationReadiness", "implementationReadinessValues"],
  ["upgradeScaleIntent", "upgradeScaleIntentValues"],
  ["upgradeCostCurveIntent", "upgradeCostCurveIntentValues"],
  ["prestigeRequirementIntent", "prestigeRequirementIntentValues"],
  ["echoRequirementIntent", "echoRequirementIntentValues"],
  ["capProgressionIntent", "capProgressionIntentValues"]
];
const TIERED_ORIGIN_VALUES = new Set(["tier_2", "tier_3"]);
const NULL_PRIMARY_SKILL_READINESS_VALUES = new Set([
  "needs_runtime_owner",
  "backlog"
]);

function ownerId(record) {
  return record.backstoryId ?? record.draftId ?? "<unknown>";
}

function assertNonEmptyString(value, message) {
  assert.equal(typeof value, "string", message);
  assert.ok(value.trim().length > 0, message);
}

function assertExpectedUpgradeCountRange(record) {
  const id = ownerId(record);
  const range = record.expectedUpgradeCountRange;
  assert.equal(typeof range, "object", `${id} must define expectedUpgradeCountRange`);
  assert.notEqual(range, null, `${id} must define expectedUpgradeCountRange`);

  const hasNumericRange =
    Number.isFinite(range.min) &&
    Number.isFinite(range.max) &&
    range.min >= 0 &&
    range.max >= range.min;
  const hasExplicitDeferredRange =
    range.deferred === true && range.min === null && range.max === null;

  assert.ok(
    hasNumericRange || hasExplicitDeferredRange,
    `${id} must use numeric min/max or explicit deferred null range`
  );
}

function assertNoStandaloneValue(value, context) {
  if (typeof value === "string") {
    assert.notEqual(value, "standalone", `${context} must not use standalone`);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertNoStandaloneValue(entry, `${context}[${index}]`));
    return;
  }

  if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      assertNoStandaloneValue(entry, `${context}.${key}`);
    }
  }
}

function assertPlanningVocabulary(metadata, record, category) {
  const id = ownerId(record);

  for (const [field, valueArrayKey] of PLANNING_VALUE_FIELDS) {
    const allowedValues = new Set(metadata[valueArrayKey]);
    assert.ok(allowedValues.size > 0, `${valueArrayKey} must declare allowed values`);
    assert.ok(
      allowedValues.has(record[field]),
      `${id} has invalid ${field} ${record[field]}`
    );
  }

  assert.equal(typeof record.hasPrecursor, "boolean", `${id} must define hasPrecursor`);
  assert.ok(Array.isArray(record.parentBackstoryIds), `${id} must define parentBackstoryIds`);
  assert.equal(
    typeof record.alternateUnlockPath,
    "boolean",
    `${id} must define alternateUnlockPath`
  );
  assert.ok(Array.isArray(record.alternateUnlockKinds), `${id} must define alternateUnlockKinds`);

  for (const unlockKind of record.alternateUnlockKinds) {
    assert.ok(
      metadata.alternateUnlockKindValues.includes(unlockKind),
      `${id} has invalid alternate unlock kind ${unlockKind}`
    );
  }

  if (record.alternateUnlockPath) {
    assert.ok(
      record.alternateUnlockKinds.some((unlockKind) => unlockKind !== "none"),
      `${id} alternate unlock path must name at least one evidence kind`
    );
    assert.ok(
      !record.alternateUnlockKinds.includes("none"),
      `${id} alternate unlock path must not include none`
    );
  } else {
    assert.deepEqual(
      record.alternateUnlockKinds,
      ["none"],
      `${id} without alternate unlock path should use none`
    );
  }

  assertNonEmptyString(record.prerequisiteIntent, `${id} must define prerequisiteIntent`);
  assertExpectedUpgradeCountRange(record);

  if (TIERED_ORIGIN_VALUES.has(record.tier)) {
    assert.ok(
      record.hasPrecursor ||
        (record.alternateUnlockPath &&
          record.alternateUnlockKinds.some((unlockKind) => unlockKind !== "none")),
      `${id} ${record.tier} must have a precursor or explicit alternate unlock evidence`
    );
    assertNonEmptyString(
      record.prerequisiteIntent,
      `${id} ${record.tier} must define prerequisite intent`
    );
  }

  if (category === "futureDraft") {
    assert.ok(Array.isArray(record.parentDraftIds), `${id} must define parentDraftIds`);
  }
}

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

  const draftIds = metadata.futureBackstoryLaneDrafts.map((record) => record.draftId);

  assert.equal(new Set(draftIds).size, draftIds.length, "future draft ids must be unique");

  for (const draft of metadata.futureBackstoryLaneDrafts) {
    assert.ok(!backstoryIds.has(draft.draftId), `${draft.draftId} must not be a live backstory id`);
    assert.ok(
      !policyIds.includes(draft.draftId),
      `${draft.draftId} must not be listed as a current policy record`
    );
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

  for (const [key, values] of Object.entries(metadata)) {
    if (key.endsWith("Values") && Array.isArray(values)) {
      assert.ok(!values.includes("standalone"), `${key} must not include standalone`);
    }
  }

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

  for (const record of metadata.records) {
    assertPlanningVocabulary(metadata, record, "record");
    assertNoStandaloneValue(record, record.backstoryId);
  }

  for (const draft of metadata.futureBackstoryLaneDrafts) {
    assertPlanningVocabulary(metadata, draft, "futureDraft");
    assertNoStandaloneValue(draft, draft.draftId);
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

  for (const draft of metadata.futureBackstoryLaneDrafts) {
    if (draft.primaryBackgroundSkillId === null) {
      assert.ok(
        NULL_PRIMARY_SKILL_READINESS_VALUES.has(draft.implementationReadiness),
        `${draft.draftId} with null primary skill must need runtime owner or remain backlog`
      );
      assert.match(
        draft.notes,
        /skill|runtime owner|ownership|not defined|not established/i,
        `${draft.draftId} with null primary skill must explain the missing or uncertain owner`
      );
      continue;
    }

    assert.ok(
      skillIds.has(draft.primaryBackgroundSkillId),
      `${draft.draftId} references missing primary skill ${draft.primaryBackgroundSkillId}`
    );
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
