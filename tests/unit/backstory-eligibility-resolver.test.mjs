import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import {
  BACKSTORY_ELIGIBILITY_POLICY,
  resolveBackstoryEligibility
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

function resolve(liveBackstoryIds, evidence = {}, policy = BACKSTORY_ELIGIBILITY_POLICY) {
  return resolveBackstoryEligibility({
    liveBackstoryIds,
    policy,
    evidence
  });
}

function recordFor(result, backstoryId) {
  const record = result.records.find((entry) => entry.backstoryId === backstoryId);
  assert.ok(record, `${backstoryId} should have a resolver record`);
  return record;
}

function clonePolicy(overrides = {}) {
  return {
    ...structuredClone(BACKSTORY_ELIGIBILITY_POLICY),
    ...overrides
  };
}

test("resolver returns default-safe current behavior with missing optional evidence", async () => {
  const liveIds = await loadLiveBackstoryIds();
  const result = resolve(liveIds);

  assert.deepEqual(result.defaultBackstoryIds, [
    "backstory.local",
    "backstory.vagabond",
    "backstory.exile",
    "backstory.farmhand",
    "backstory.amnesiac"
  ]);
  assert.ok(result.defaultBackstoryIds.length > 0);
  assert.ok(result.defaultBackstoryIds.every((id) => result.eligibleBackstoryIds.includes(id)));
  assert.equal(result.warnings.length, 0);

  for (const higherOrSpecialId of [
    "backstory.merchants_child",
    "backstory.military_brat",
    "backstory.minor_noble",
    "backstory.local_hero",
    "backstory.isekai_outcast",
    "backstory.hedge_adept"
  ]) {
    assert.equal(
      result.eligibleBackstoryIds.includes(higherOrSpecialId),
      false,
      `${higherOrSpecialId} should not be default-unlocked`
    );
  }
});

test("resolver reports locked, deferred, hidden, and special buckets without UI wiring", async () => {
  const liveIds = await loadLiveBackstoryIds();
  const result = resolve(liveIds);

  assert.ok(result.lockedBackstories.some((entry) => entry.backstoryId === "backstory.merchants_child"));
  assert.ok(result.lockedBackstories.some((entry) => entry.backstoryId === "backstory.military_brat"));
  assert.ok(result.deferredBackstoryIds.includes("backstory.hedge_adept"));
  assert.ok(result.deferredBackstoryIds.includes("backstory.minor_noble"));
  assert.ok(result.specialBackstoryIds.includes("backstory.local_hero"));
  assert.ok(result.specialBackstoryIds.includes("backstory.isekai_outcast"));
  assert.equal(result.hiddenBackstoryIds.length, 0);
});

test("Tier 1 account Legacy purchase ids can satisfy early Backstory Legacy rules", async () => {
  const liveIds = await loadLiveBackstoryIds();
  const result = resolve(liveIds, {
    legacyPurchaseIds: ["legacy.backstory.street_vendor"]
  });

  assert.equal(recordFor(result, "backstory.street_vendor").state, "eligible");
  assert.equal(result.eligibleBackstoryIds.includes("backstory.street_vendor"), true);

  for (const backstoryId of [
    "backstory.net_tender",
    "backstory.gatherer",
    "backstory.scribes_apprentice",
    "backstory.kitchen_hand"
  ]) {
    assert.equal(recordFor(result, backstoryId).state, "locked", backstoryId);
    assert.equal(result.eligibleBackstoryIds.includes(backstoryId), false, backstoryId);
  }
});

test("Tier 2 origins require Legacy support plus scoped evidence", async () => {
  const liveIds = await loadLiveBackstoryIds();
  const purchaseOnly = resolve(liveIds, {
    familyId: "family.test",
    sourceRunIds: ["run.trade"],
    legacyPurchaseIds: ["legacy.backstory.merchant_family"]
  });
  const withEvidence = resolve(liveIds, {
    familyId: "family.test",
    sourceRunIds: ["run.trade"],
    legacyPurchaseIds: ["legacy.backstory.merchant_family"],
    evidenceRecords: [
      {
        kind: "source_run_evidence",
        scope: "source_run",
        sourceRunId: "run.trade",
        tag: "trade_history",
        sourceType: "source_run"
      }
    ]
  });

  assert.equal(recordFor(purchaseOnly, "backstory.merchants_child").state, "locked");
  assert.equal(recordFor(withEvidence, "backstory.merchants_child").state, "eligible");
  assert.ok(withEvidence.eligibleBackstoryIds.includes("backstory.merchants_child"));
});

test("starter-granted skill ranks do not satisfy earned maxima", async () => {
  const liveIds = await loadLiveBackstoryIds();
  const starterGranted = resolve(liveIds, {
    familyId: "family.garrison",
    sourceRunIds: ["run.militia"],
    legacyPurchaseIds: ["legacy.backstory.garrison_ward"],
    evidenceRecords: [
      {
        kind: "earned_skill_maximum",
        scope: "source_run",
        sourceRunId: "run.militia",
        skillId: "skill.combat.tactics.formation_discipline",
        value: 25,
        sourceType: "starter_backstory"
      }
    ]
  });
  const earned = resolve(liveIds, {
    familyId: "family.garrison",
    sourceRunIds: ["run.militia"],
    legacyPurchaseIds: ["legacy.backstory.garrison_ward"],
    evidenceRecords: [
      {
        kind: "earned_skill_maximum",
        scope: "source_run",
        sourceRunId: "run.militia",
        skillId: "skill.combat.tactics.formation_discipline",
        value: 25,
        sourceType: "earned_play"
      }
    ]
  });

  assert.equal(recordFor(starterGranted, "backstory.military_brat").state, "locked");
  assert.equal(recordFor(earned, "backstory.military_brat").state, "eligible");
});

test("missing source attribution does not infer earned skill evidence", async () => {
  const liveIds = await loadLiveBackstoryIds();
  const missingSourceType = resolve(liveIds, {
    familyId: "family.garrison",
    sourceRunIds: ["run.militia"],
    legacyPurchaseIds: ["legacy.backstory.garrison_ward"],
    evidenceRecords: [
      {
        kind: "earned_skill_maximum",
        scope: "source_run",
        sourceRunId: "run.militia",
        skillId: "skill.combat.tactics.formation_discipline",
        value: 25
      }
    ]
  });

  assert.equal(recordFor(missingSourceType, "backstory.military_brat").state, "locked");
});

test("source-run scoped evidence must identify a valid source-run owner", async () => {
  const liveIds = await loadLiveBackstoryIds();
  const missingSourceRunOwner = resolve(liveIds, {
    familyId: "family.garrison",
    legacyPurchaseIds: ["legacy.backstory.garrison_ward"],
    evidenceRecords: [
      {
        kind: "source_run_evidence",
        scope: "source_run",
        sourceRunId: "run.militia",
        tag: "militia_service",
        sourceType: "source_run"
      }
    ]
  });

  assert.equal(recordFor(missingSourceRunOwner, "backstory.military_brat").state, "locked");
});

test("family-scoped rules do not fall back to account-wide evidence", async () => {
  const liveIds = await loadLiveBackstoryIds();
  const accountEvidence = resolve(liveIds, {
    familyId: "family.trade",
    sourceRunIds: ["run.trade"],
    legacyPurchaseIds: ["legacy.backstory.merchant_family"],
    prestigeRecords: [{ scope: "account", value: 100 }],
    evidenceRecords: [
      {
        kind: "earned_skill_maximum",
        scope: "account",
        skillId: "skill.settlement.trade",
        value: 50,
        sourceType: "earned_play"
      }
    ]
  });

  assert.equal(recordFor(accountEvidence, "backstory.merchants_child").state, "locked");
});

test("status and title origins do not unlock from account Prestige alone", async () => {
  const liveIds = await loadLiveBackstoryIds();
  const accountPrestige = resolve(liveIds, {
    prestigeRecords: [{ scope: "account", value: 999 }]
  });

  assert.equal(recordFor(accountPrestige, "backstory.minor_noble").state, "deferred");
  assert.equal(accountPrestige.eligibleBackstoryIds.includes("backstory.minor_noble"), false);
});

test("blocked evidence cannot unlock content", async () => {
  const liveIds = await loadLiveBackstoryIds();
  const blockedRule = {
    ...structuredClone(
      BACKSTORY_ELIGIBILITY_POLICY.availabilityRules.find(
        (rule) => rule.backstoryId === "backstory.street_vendor"
      )
    ),
    availabilityStatus: "locked",
    requiresAny: [
      {
        kind: "market_economy_effect",
        scope: "account",
        tag: "market_passive"
      }
    ]
  };
  const policy = clonePolicy({
    availabilityRules: BACKSTORY_ELIGIBILITY_POLICY.availabilityRules.map((rule) =>
      rule.backstoryId === "backstory.street_vendor" ? blockedRule : rule
    )
  });
  const result = resolve(
    liveIds,
    {
      evidenceRecords: [
        {
          kind: "market_economy_effect",
          scope: "account",
          tag: "market_passive",
          sourceType: "achievement"
        }
      ]
    },
    policy
  );

  assert.equal(recordFor(result, "backstory.street_vendor").state, "deferred");
  assert.equal(result.eligibleBackstoryIds.includes("backstory.street_vendor"), false);
});

test("future example fixtures are not treated as live policy", async () => {
  const liveIds = await loadLiveBackstoryIds();
  const futureRule = {
    ...structuredClone(BACKSTORY_ELIGIBILITY_POLICY.availabilityRules[0]),
    backstoryId: "backstory.future_sword_drill",
    availabilityStatus: "locked",
    tier: "tier_2"
  };
  const policy = clonePolicy({
    availabilityRules: [...BACKSTORY_ELIGIBILITY_POLICY.availabilityRules, futureRule]
  });
  const result = resolve(liveIds, {}, policy);

  assert.ok(
    result.warnings.some((warning) => warning.includes("backstory.future_sword_drill")),
    "future fixture should produce a validation warning"
  );
  assert.equal(
    result.records.some((record) => record.backstoryId === "backstory.future_sword_drill"),
    false
  );
});

test("selected-effect policy keeps parent and child backstory effects non-stacking", async () => {
  const liveIds = await loadLiveBackstoryIds();
  const result = resolve(liveIds, {
    familyId: "family.garrison",
    sourceRunIds: ["run.militia"],
    legacyPurchaseIds: ["legacy.backstory.garrison_ward"],
    evidenceRecords: [
      {
        kind: "source_run_evidence",
        scope: "source_run",
        sourceRunId: "run.militia",
        tag: "militia_service",
        sourceType: "source_run",
        backstoryId: "backstory.militia_levy"
      }
    ]
  });
  const garrison = recordFor(result, "backstory.military_brat");

  assert.equal(garrison.state, "eligible");
  assert.deepEqual(garrison.selectedBackstoryEffectPolicy, {
    appliesOnlySelectedBackstory: true,
    parentEffectsStack: false,
    previousBackstoriesAreEvidenceOnly: true
  });
});

test("resolver validates selected ids directly without compatibility rescue", async () => {
  const liveIds = await loadLiveBackstoryIds();
  const result = resolve(liveIds, {
    selectedBackstoryId: "backstory.old_merchant_alias"
  });

  assert.ok(
    result.warnings.some((warning) =>
      warning.includes("backstory.old_merchant_alias")
    )
  );
  assert.equal(
    result.records.some((record) => record.backstoryId === "backstory.old_merchant_alias"),
    false
  );
});

test("resolver does not mutate policy or evidence inputs", async () => {
  const liveIds = await loadLiveBackstoryIds();
  const evidence = {
    familyId: "family.test",
    sourceRunIds: ["run.trade"],
    legacyPurchaseIds: ["legacy.backstory.merchant_family"],
    evidenceRecords: [
      {
        kind: "source_run_evidence",
        scope: "source_run",
        sourceRunId: "run.trade",
        tag: "trade_history",
        sourceType: "source_run"
      }
    ]
  };
  const before = JSON.stringify(evidence);

  resolve(liveIds, evidence);

  assert.equal(JSON.stringify(evidence), before);
});
