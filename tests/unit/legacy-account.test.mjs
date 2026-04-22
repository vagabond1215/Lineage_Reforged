import test from "node:test";
import assert from "node:assert/strict";
import {
  createDefaultAccountProfileState,
  grantLegacy,
  grantLegacyReward,
  hasLegacyUnlock,
  spendLegacy
} from "../../packages/engines/game-engine/src/index.ts";

function createProfile() {
  return createDefaultAccountProfileState({
    createdAt: "2026-04-17T12:00:00.000Z",
    updatedAt: "2026-04-17T12:00:00.000Z"
  });
}

test("grantLegacy increases current and lifetime Legacy and records one transaction", () => {
  const profile = createProfile();
  const granted = grantLegacy(profile, {
    amount: 12,
    summary: "Harbor survey commendation",
    sourceType: "test",
    sourceId: "reward.harbor_survey",
    recordedAt: "2026-04-17T12:15:00.000Z"
  });

  assert.equal(granted.ok, true);
  assert.equal(granted.profile.legacy.legacyPoints, 12);
  assert.equal(granted.profile.legacy.lifetimeLegacyEarned, 12);
  assert.equal(granted.profile.legacy.legacyTransactions.length, 1);
  assert.equal(granted.transaction.kind, "grant");
  assert.equal(granted.transaction.balanceAfter, 12);
});

test("spendLegacy decreases current Legacy only and records one transaction", () => {
  const granted = grantLegacy(createProfile(), {
    amount: 18,
    summary: "Recovered civic charter",
    sourceType: "test",
    sourceId: "reward.charter",
    recordedAt: "2026-04-17T12:20:00.000Z"
  });

  assert.equal(granted.ok, true);

  const spent = spendLegacy(granted.profile, {
    amount: 5,
    summary: "Ledger mark claimed",
    sourceType: "test",
    sourceId: "unlock.ledger_mark",
    recordedAt: "2026-04-17T12:25:00.000Z"
  });

  assert.equal(spent.ok, true);
  assert.equal(spent.profile.legacy.legacyPoints, 13);
  assert.equal(spent.profile.legacy.lifetimeLegacyEarned, 18);
  assert.equal(spent.profile.legacy.legacyTransactions.length, 2);
  assert.equal(spent.transaction.kind, "spend");
  assert.equal(spent.transaction.balanceAfter, 13);
});

test("spendLegacy rejects insufficient Legacy without mutating state or logging", () => {
  const profile = createProfile();
  const original = structuredClone(profile);
  const spent = spendLegacy(profile, {
    amount: 3,
    summary: "Impossible purchase",
    sourceType: "test",
    sourceId: "unlock.impossible",
    recordedAt: "2026-04-17T12:30:00.000Z"
  });

  assert.equal(spent.ok, false);
  assert.equal(spent.error, "insufficient_legacy");
  assert.deepEqual(spent.profile, original);
});

test("duplicate unlock purchases are rejected and the profile stays unchanged", () => {
  const granted = grantLegacy(createProfile(), {
    amount: 20,
    summary: "Completed charter work",
    sourceType: "test",
    sourceId: "reward.charter_work",
    recordedAt: "2026-04-17T12:35:00.000Z"
  });

  assert.equal(granted.ok, true);

  const firstSpend = spendLegacy(granted.profile, {
    amount: 6,
    summary: "Claimed Harbor Seal",
    sourceType: "test",
    sourceId: "unlock.harbor_seal",
    unlockId: "legacy.unlock.harbor_seal",
    recordedAt: "2026-04-17T12:40:00.000Z"
  });

  assert.equal(firstSpend.ok, true);
  assert.equal(hasLegacyUnlock(firstSpend.profile, "legacy.unlock.harbor_seal"), true);

  const beforeDuplicate = structuredClone(firstSpend.profile);
  const duplicateSpend = spendLegacy(firstSpend.profile, {
    amount: 6,
    summary: "Claimed Harbor Seal again",
    sourceType: "test",
    sourceId: "unlock.harbor_seal.duplicate",
    unlockId: "legacy.unlock.harbor_seal",
    recordedAt: "2026-04-17T12:45:00.000Z"
  });

  assert.equal(duplicateSpend.ok, false);
  assert.equal(duplicateSpend.error, "duplicate_unlock");
  assert.deepEqual(duplicateSpend.profile, beforeDuplicate);
});

test("grantLegacyReward supports unlock-only and combined rewards with one transaction each", () => {
  const profile = createProfile();

  const unlockOnly = grantLegacyReward(profile, {
    unlockId: "legacy.unlock.chronicle.many_banners",
    summary: "Many Banners was recorded in the chronicles.",
    sourceType: "achievement",
    sourceId: "achievement.account.many_banners",
    recordedAt: "2026-04-17T12:50:00.000Z"
  });

  assert.equal(unlockOnly.ok, true);
  assert.equal(unlockOnly.profile.legacy.legacyPoints, 0);
  assert.equal(unlockOnly.profile.legacy.legacyTransactions.length, 1);
  assert.equal(
    hasLegacyUnlock(unlockOnly.profile, "legacy.unlock.chronicle.many_banners"),
    true
  );

  const combined = grantLegacyReward(unlockOnly.profile, {
    legacyPoints: 8,
    unlockId: "legacy.unlock.chronicle.beyond_one_shore",
    summary: "Beyond One Shore was recorded in the chronicles.",
    sourceType: "achievement",
    sourceId: "achievement.account.beyond_one_shore",
    recordedAt: "2026-04-17T12:55:00.000Z"
  });

  assert.equal(combined.ok, true);
  assert.equal(combined.profile.legacy.legacyPoints, 8);
  assert.equal(combined.profile.legacy.legacyTransactions.length, 2);
});
