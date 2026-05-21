import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import {
  BACKSTORY_BLOCKED_EVIDENCE_KINDS,
  BACKSTORY_ELIGIBILITY_DEFAULT_BACKSTORY_IDS,
  BACKSTORY_ELIGIBILITY_POLICY,
  BACKSTORY_ELIGIBILITY_POLICY_STATUSES,
  validateBackstoryEligibilityPolicy
} from "../../packages/engines/game-engine/src/index.ts";

async function loadRecords(relativePath) {
  const raw = await readFile(relativePath, "utf8");
  return JSON.parse(raw.replace(/^\uFEFF/, "")).records;
}

async function loadLiveBackstoryIds() {
  return (await loadRecords("packages/content/base/player/backstories.json")).map(
    (record) => record.id
  );
}

function clonePolicy(overrides = {}) {
  return {
    ...structuredClone(BACKSTORY_ELIGIBILITY_POLICY),
    ...overrides
  };
}

test("runtime backstory eligibility policy covers every current live backstory", async () => {
  const liveIds = await loadLiveBackstoryIds();
  const issues = validateBackstoryEligibilityPolicy(BACKSTORY_ELIGIBILITY_POLICY, liveIds);
  const policyIds = BACKSTORY_ELIGIBILITY_POLICY.availabilityRules.map((rule) => rule.backstoryId);

  assert.deepEqual(issues, []);
  assert.equal(BACKSTORY_ELIGIBILITY_POLICY.policyVersion, "0.5.69");
  assert.equal(BACKSTORY_ELIGIBILITY_POLICY.contentVersion, "current-live-backstories-27");
  assert.equal(BACKSTORY_ELIGIBILITY_POLICY.status, "runtime_owned_policy");
  assert.equal(BACKSTORY_ELIGIBILITY_POLICY.runtimeImportAllowed, true);
  assert.equal(new Set(policyIds).size, policyIds.length);
  assert.deepEqual([...policyIds].sort(), [...liveIds].sort());
});

test("runtime backstory eligibility policy keeps defaults live and non-empty", async () => {
  const liveIds = new Set(await loadLiveBackstoryIds());

  assert.ok(BACKSTORY_ELIGIBILITY_POLICY.defaultBackstoryIds.length > 0);
  assert.deepEqual(
    BACKSTORY_ELIGIBILITY_POLICY.defaultBackstoryIds,
    [...BACKSTORY_ELIGIBILITY_DEFAULT_BACKSTORY_IDS]
  );

  for (const defaultId of BACKSTORY_ELIGIBILITY_POLICY.defaultBackstoryIds) {
    assert.ok(liveIds.has(defaultId), `${defaultId} must be a live default backstory`);
  }
});

test("runtime policy vocabulary excludes compatibility availability states", () => {
  assert.deepEqual([...BACKSTORY_ELIGIBILITY_POLICY_STATUSES].sort(), [
    "always_available",
    "default_available",
    "deferred",
    "early_legacy",
    "hidden",
    "locked",
    "special"
  ]);
  assert.equal(BACKSTORY_ELIGIBILITY_POLICY_STATUSES.includes("retired"), false);
  assert.equal(BACKSTORY_ELIGIBILITY_POLICY_STATUSES.includes("converted"), false);

  for (const rule of BACKSTORY_ELIGIBILITY_POLICY.availabilityRules) {
    assert.notEqual(rule.availabilityStatus, "retired");
    assert.notEqual(rule.availabilityStatus, "converted");
  }
});

test("runtime policy declares blocked evidence owners centrally", () => {
  assert.deepEqual([...BACKSTORY_ELIGIBILITY_POLICY.blockedEvidenceKinds].sort(), [
    ...BACKSTORY_BLOCKED_EVIDENCE_KINDS
  ].sort());

  for (const expected of [
    "family_skill_maximum",
    "family_backstory_history",
    "heir_legitimacy_status",
    "estate_title_ownership",
    "regional_renown_storage",
    "institutional_membership",
    "patronage_contact_system",
    "adoption",
    "marriage",
    "mounted_behavior",
    "market_economy_effect",
    "magic_licensing_acquisition",
    "medical_injury_system",
    "oath_paladin_behavior"
  ]) {
    assert.ok(
      BACKSTORY_ELIGIBILITY_POLICY.blockedEvidenceKinds.includes(expected),
      `${expected} should stay blocked`
    );
  }
});

test("policy validation rejects duplicate and missing live-id rules", async () => {
  const liveIds = await loadLiveBackstoryIds();
  const duplicatePolicy = clonePolicy({
    availabilityRules: [
      ...BACKSTORY_ELIGIBILITY_POLICY.availabilityRules,
      structuredClone(BACKSTORY_ELIGIBILITY_POLICY.availabilityRules[0])
    ]
  });
  const missingPolicy = clonePolicy({
    availabilityRules: [
      ...BACKSTORY_ELIGIBILITY_POLICY.availabilityRules,
      {
        ...structuredClone(BACKSTORY_ELIGIBILITY_POLICY.availabilityRules[0]),
        backstoryId: "backstory.future_sword_drill"
      }
    ]
  });

  assert.ok(
    validateBackstoryEligibilityPolicy(duplicatePolicy, liveIds).some(
      (issue) => issue.code === "duplicate_rule"
    )
  );
  assert.ok(
    validateBackstoryEligibilityPolicy(missingPolicy, liveIds).some(
      (issue) => issue.code === "missing_live_backstory"
    )
  );
});

test("policy validation rejects Tier 2 or Tier 3 Legacy-purchase-only rules", async () => {
  const liveIds = await loadLiveBackstoryIds();
  const invalidRule = {
    ...structuredClone(
      BACKSTORY_ELIGIBILITY_POLICY.availabilityRules.find(
        (rule) => rule.backstoryId === "backstory.merchants_child"
      )
    ),
    requiresAny: [],
    requiresAll: [],
    requiresEvidence: []
  };
  const invalidPolicy = clonePolicy({
    availabilityRules: BACKSTORY_ELIGIBILITY_POLICY.availabilityRules.map((rule) =>
      rule.backstoryId === invalidRule.backstoryId ? invalidRule : rule
    )
  });

  assert.ok(
    validateBackstoryEligibilityPolicy(invalidPolicy, liveIds).some(
      (issue) => issue.code === "legacy_purchase_without_evidence"
    )
  );
});

test("resolver and runtime policy modules do not import design-only metadata", async () => {
  const runtimeSourceFiles = [
    "packages/engines/game-engine/src/backstory-eligibility-policy.ts",
    "packages/engines/game-engine/src/backstory-eligibility.ts",
    "packages/engines/game-engine/src/index.ts"
  ];

  for (const sourceFile of runtimeSourceFiles) {
    const source = await readFile(sourceFile, "utf8");

    assert.doesNotMatch(source, /backstory-policy-metadata/, sourceFile);
    assert.doesNotMatch(source, /legacy-upgrade-catalog-draft/, sourceFile);
    assert.doesNotMatch(source, /futureBackstoryLaneDrafts/, sourceFile);
    assert.doesNotMatch(source, /docs\/design|docs\\design/, sourceFile);
    assert.doesNotMatch(source, /legacyIdAliases|idAliases|retired|converted|migrationFallback|old-save|old-account|historical id/i, sourceFile);
  }
});

test("creator runtime paths use approved resolver boundary without design-only metadata", async () => {
  const creatorSourceFiles = [
    "apps/rpg-ui/src/game-shell/characterCreationCatalog.ts",
    "apps/rpg-ui/src/game-shell/characterCreationForm.ts",
    "apps/rpg-ui/src/game-shell/newGameSnapshot.ts",
    "apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx"
  ];
  const catalogSource = await readFile(
    "apps/rpg-ui/src/game-shell/characterCreationCatalog.ts",
    "utf8"
  );

  assert.match(catalogSource, /resolveBackstoryEligibility/);

  for (const sourceFile of creatorSourceFiles) {
    const source = await readFile(sourceFile, "utf8");

    assert.doesNotMatch(source, /backstory-policy-metadata/, sourceFile);
    assert.doesNotMatch(source, /legacy-upgrade-catalog-draft/, sourceFile);
    assert.doesNotMatch(source, /futureBackstoryLaneDrafts/, sourceFile);
    assert.doesNotMatch(source, /docs\/design|docs\\design/, sourceFile);
    assert.doesNotMatch(source, /legacyIdAliases|idAliases|retired|converted|migrationFallback|old-save|old-account|historical id/i, sourceFile);
  }
});
