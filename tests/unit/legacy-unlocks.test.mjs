import test from "node:test";
import assert from "node:assert/strict";
import {
  createDefaultAccountProfileState,
  getLegacyUnlockDefinitions,
  grantLegacy,
  purchaseLegacyUnlock,
  resolveLegacyUnlockStates,
  validateLegacyUnlockDefinitions
} from "../../packages/engines/game-engine/src/index.ts";

function createArchivedRun(overrides = {}) {
  return {
    characterId: "player.test_archived",
    name: "Test Archived",
    lineageId: "lineage.human",
    startingContinentId: "continent.kaelvar",
    startingRegionId: "region.aurelia",
    startingSettlementId: "settlement.aurelis",
    startedAt: "2026-04-20T12:00:00.000Z",
    endedAt: "2026-04-20T13:00:00.000Z",
    lastSeenAt: "2026-04-20T13:00:00.000Z",
    outcome: "archived",
    archiveReason: "retired",
    echoLevelReached: 9,
    notableCharacterAchievementIds: [],
    survivedDays: 14,
    saveSlotIds: [],
    ...overrides
  };
}

function grantProfile(amount = 50) {
  const granted = grantLegacy(createDefaultAccountProfileState(), {
    amount,
    summary: "Test grant",
    sourceType: "test",
    sourceId: "test.grant",
    recordedAt: "2026-04-20T12:00:00.000Z"
  });
  assert.equal(granted.ok, true);
  return granted.profile;
}

test("legacy unlock definitions load binary, tiered, incremental, and metadata-only effects", () => {
  const definitions = getLegacyUnlockDefinitions();
  const kinds = new Set(definitions.map((definition) => definition.kind));
  const categories = new Set(definitions.map((definition) => definition.category));

  assert.ok(kinds.has("binary"));
  assert.ok(kinds.has("tiered"));
  assert.ok(kinds.has("incremental"));
  assert.ok(categories.has("Heir"));
  assert.ok(
    definitions
      .flatMap((definition) => definition.effects)
      .some((effect) => effect.type === "future_inheritance_uses")
  );
  assert.equal(
    definitions.flatMap((definition) => definition.effects).some((effect) =>
      ["stat_bonus", "skill_bonus", "combat_bonus", "survival_bonus"].includes(effect.type)
    ),
    false
  );

  const invalid = structuredClone(definitions[0]);
  invalid.id = "legacy.unlock.invalid.direct_power";
  invalid.effects = [{ type: "stat_bonus", key: "direct.stat.strength", value: 1 }];

  assert.throws(
    () => validateLegacyUnlockDefinitions([invalid], "test-invalid-effects"),
    /non-metadata effect/
  );
});

test("unlock resolution separates eligibility, affordability, and unsupported future hooks", () => {
  const profile = {
    ...createDefaultAccountProfileState(),
    legacy: {
      ...createDefaultAccountProfileState().legacy,
      legacyPoints: 0,
      lifetimeLegacyEarned: 5
    },
    history: {
      runRecords: [
        createArchivedRun({
          characterId: "player.deleted",
          outcome: "deleted",
          archiveReason: "retired"
        })
      ]
    }
  };

  const states = resolveLegacyUnlockStates(profile);
  const ledgerSeal = states.find((entry) => entry.id === "legacy.unlock.account.ledger_seal");
  const boundIndex = states.find((entry) => entry.id === "legacy.unlock.chronicle.bound_index");
  const tradeCharter = states.find((entry) => entry.id === "legacy.unlock.account.trade_charter");

  assert.equal(ledgerSeal?.eligible, true);
  assert.equal(ledgerSeal?.affordability, "unaffordable");
  assert.equal(ledgerSeal?.canPurchase, false);
  assert.equal(boundIndex?.eligible, false);
  assert.equal(
    boundIndex?.requirementResults.some((result) => result.state === "unmet"),
    true
  );
  assert.equal(tradeCharter?.eligible, false);
  assert.equal(
    tradeCharter?.requirementResults.some((result) => result.state === "unsupported"),
    true
  );
});

test("historical unknown unlock ids are preserved as non-purchasable binary records", () => {
  const profile = {
    ...createDefaultAccountProfileState(),
    legacy: {
      ...createDefaultAccountProfileState().legacy,
      legacyUnlocks: [
        {
          unlockId: "legacy.unlock.old_brass_seal",
          unlockedAt: "2026-04-20T12:00:00.000Z",
          sourceTransactionId: "legacy.transaction.spend.20260420120000000.1"
        }
      ]
    }
  };

  const historical = resolveLegacyUnlockStates(profile).find(
    (entry) => entry.id === "legacy.unlock.old_brass_seal"
  );

  assert.equal(historical?.isKnown, false);
  assert.equal(historical?.state, "maxed");
  assert.equal(historical?.kind, "binary");
  assert.equal(historical?.currentRank, 1);
  assert.equal(historical?.nextRank, null);
  assert.equal(historical?.canPurchase, false);
});

test("purchaseLegacyUnlock is transactional for failures and writes one spend ledger on success", () => {
  const profile = grantProfile(5);
  const originalUnknown = structuredClone(profile);
  const unknown = purchaseLegacyUnlock(
    profile,
    "legacy.unlock.not_in_catalog",
    "2026-04-20T12:05:00.000Z"
  );
  assert.equal(unknown.ok, false);
  assert.equal(unknown.error, "unknown_unlock");
  assert.deepEqual(unknown.profile, originalUnknown);

  const zeroCurrent = {
    ...profile,
    legacy: {
      ...profile.legacy,
      legacyPoints: 0
    }
  };
  const originalInsufficient = structuredClone(zeroCurrent);
  const insufficient = purchaseLegacyUnlock(
    zeroCurrent,
    "legacy.unlock.account.ledger_seal",
    "2026-04-20T12:06:00.000Z"
  );
  assert.equal(insufficient.ok, false);
  assert.equal(insufficient.error, "insufficient_legacy");
  assert.deepEqual(insufficient.profile, originalInsufficient);

  const originalUnsupported = structuredClone(profile);
  const unsupported = purchaseLegacyUnlock(
    profile,
    "legacy.unlock.account.trade_charter",
    "2026-04-20T12:07:00.000Z"
  );
  assert.equal(unsupported.ok, false);
  assert.equal(unsupported.error, "unsupported_requirement");
  assert.deepEqual(unsupported.profile, originalUnsupported);

  const originalTransactionCount = profile.legacy.legacyTransactions.length;
  const purchased = purchaseLegacyUnlock(
    profile,
    "legacy.unlock.account.ledger_seal",
    "2026-04-20T12:08:00.000Z"
  );
  assert.equal(purchased.ok, true);
  assert.equal(purchased.profile.legacy.legacyPoints, 4);
  assert.equal(purchased.profile.legacy.lifetimeLegacyEarned, 5);
  assert.equal(purchased.profile.legacy.legacyTransactions.length, originalTransactionCount + 1);
  assert.equal(purchased.transaction.kind, "spend");
  assert.equal(purchased.transaction.unlockId, "legacy.unlock.account.ledger_seal");
  assert.equal(purchased.unlock.rank, undefined);
  assert.equal(
    purchased.profile.legacy.legacyUnlocks.some(
      (unlock) => unlock.unlockId === "legacy.unlock.account.ledger_seal"
    ),
    true
  );
});

test("ranked unlock purchases advance ranks and stop at max without partial mutation", () => {
  let profile = {
    ...grantProfile(50),
    history: {
      runRecords: [createArchivedRun()]
    }
  };

  for (let rank = 1; rank <= 5; rank += 1) {
    const purchased = purchaseLegacyUnlock(
      profile,
      "legacy.unlock.perk.campfire_notes",
      `2026-04-20T12:${10 + rank}:00.000Z`
    );

    assert.equal(purchased.ok, true);
    assert.equal(purchased.unlock.rank, rank);
    profile = purchased.profile;
  }

  const maxed = resolveLegacyUnlockStates(profile).find(
    (entry) => entry.id === "legacy.unlock.perk.campfire_notes"
  );
  assert.equal(maxed?.state, "maxed");
  assert.equal(maxed?.currentRank, 5);

  const originalMaxed = structuredClone(profile);
  const repurchase = purchaseLegacyUnlock(
    profile,
    "legacy.unlock.perk.campfire_notes",
    "2026-04-20T12:20:00.000Z"
  );
  assert.equal(repurchase.ok, false);
  assert.equal(repurchase.error, "max_rank");
  assert.deepEqual(repurchase.profile, originalMaxed);
});

test("known ranked definitions can resolve historical rank-one ownership without converting unknown ids", () => {
  const profile = {
    ...createDefaultAccountProfileState(),
    legacy: {
      ...createDefaultAccountProfileState().legacy,
      legacyUnlocks: [
        {
          unlockId: "legacy.unlock.perk.campfire_notes",
          unlockedAt: "2026-04-20T12:00:00.000Z",
          sourceTransactionId: "legacy.transaction.spend.20260420120000000.1"
        },
        {
          unlockId: "legacy.unlock.unknown_rankless",
          unlockedAt: "2026-04-20T12:01:00.000Z",
          sourceTransactionId: "legacy.transaction.spend.20260420120100000.2"
        }
      ]
    }
  };

  const states = resolveLegacyUnlockStates(profile);
  const knownRanked = states.find((entry) => entry.id === "legacy.unlock.perk.campfire_notes");
  const unknownRankless = states.find((entry) => entry.id === "legacy.unlock.unknown_rankless");

  assert.equal(knownRanked?.isKnown, true);
  assert.equal(knownRanked?.currentRank, 1);
  assert.equal(knownRanked?.nextRank, 2);
  assert.equal(unknownRankless?.isKnown, false);
  assert.equal(unknownRankless?.kind, "binary");
  assert.equal(unknownRankless?.currentRank, 1);
  assert.equal(unknownRankless?.nextRank, null);
});
