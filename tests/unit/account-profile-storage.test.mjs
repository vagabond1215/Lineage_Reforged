import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_ACCOUNT_DISPLAY_NAME,
  DEFAULT_ACCOUNT_ID,
  createDefaultAccountProfileState,
  grantLegacy,
  spendLegacy
} from "../../packages/engines/game-engine/src/index.ts";
import { demoSnapshot } from "../../apps/rpg-ui/src/runtime/demoSnapshot.ts";
import {
  loadAccountProfile,
  loadActiveAccountProfile,
  resolveActiveAccountId,
  saveAccountProfile,
  setActiveAccountId
} from "../../apps/rpg-ui/src/game-shell/accountProfileManager.ts";
import {
  buildSaveMetadata,
  createSave,
  listSaves,
  loadSave,
  resetAllSaves
} from "../../apps/rpg-ui/src/game-shell/saveManager.ts";

function createMockStorage() {
  const values = new Map();

  return {
    get length() {
      return values.size;
    },
    key(index) {
      return Array.from(values.keys())[index] ?? null;
    },
    getItem(key) {
      const normalizedKey = String(key);
      return values.has(normalizedKey) ? values.get(normalizedKey) : null;
    },
    setItem(key, value) {
      values.set(String(key), String(value));
    },
    removeItem(key) {
      values.delete(String(key));
    },
    clear() {
      values.clear();
    }
  };
}

function withMockWindow(run) {
  const originalWindow = globalThis.window;
  const mockWindow = {
    localStorage: createMockStorage()
  };

  globalThis.window = mockWindow;

  try {
    return run(mockWindow.localStorage);
  } finally {
    if (originalWindow === undefined) {
      delete globalThis.window;
    } else {
      globalThis.window = originalWindow;
    }
  }
}

function createSnapshot(accountId, playerName) {
  const snapshot = structuredClone(demoSnapshot);
  snapshot.accountId = accountId;
  snapshot.snapshotVersion = "0.6.0";
  snapshot.playerState.coreData.playerName = playerName;
  snapshot.playerState.playerId = `player.${playerName.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`;
  return snapshot;
}

test("default account profile auto-creates and active account id persists separately from saves", () =>
  withMockWindow(() => {
    assert.equal(resolveActiveAccountId(), DEFAULT_ACCOUNT_ID);

    const defaultProfile = loadActiveAccountProfile();
    assert.equal(defaultProfile.accountId, DEFAULT_ACCOUNT_ID);
    assert.equal(defaultProfile.displayName, DEFAULT_ACCOUNT_DISPLAY_NAME);

    const secondAccountId = setActiveAccountId("account.local.second");
    assert.equal(secondAccountId, "account.local.second");
    assert.equal(resolveActiveAccountId(), "account.local.second");

    const secondProfile = loadActiveAccountProfile();
    assert.equal(secondProfile.accountId, "account.local.second");
    assert.equal(secondProfile.displayName, DEFAULT_ACCOUNT_DISPLAY_NAME);
  }));

test("account profile roundtrip preserves display name, lastPlayedAt, unlocks, and transactions", () =>
  withMockWindow(() => {
    let profile = createDefaultAccountProfileState({
      accountId: DEFAULT_ACCOUNT_ID,
      displayName: "Harbor Ledger",
      createdAt: "2026-04-17T12:00:00.000Z",
      updatedAt: "2026-04-17T12:00:00.000Z"
    });

    const granted = grantLegacy(profile, {
      amount: 14,
      summary: "Survey writ recorded",
      sourceType: "test",
      sourceId: "reward.survey_writ",
      recordedAt: "2026-04-17T12:05:00.000Z"
    });
    assert.equal(granted.ok, true);
    profile = granted.profile;

    const spent = spendLegacy(profile, {
      amount: 4,
      summary: "Claimed Brass Seal",
      sourceType: "test",
      sourceId: "unlock.brass_seal",
      unlockId: "legacy.unlock.brass_seal",
      recordedAt: "2026-04-17T12:10:00.000Z"
    });
    assert.equal(spent.ok, true);
    const payoutBreakdown = {
      progressionDepth: 27,
      notableDeeds: 10,
      survivalDepth: 3,
      milestoneQuality: 4,
      archiveReasonModifier: 1,
      challengeModifier: 1,
      shallowRunModifier: 1,
      repeatedWeakRunModifier: 1,
      rawScore: 44,
      modifiedScore: 44,
      finalAmount: 4
    };
    profile = {
      ...spent.profile,
      lastPlayedAt: "2026-04-17T12:15:00.000Z",
      legacy: {
        ...spent.profile.legacy,
        legacyUnlocks: [
          {
            ...spent.profile.legacy.legacyUnlocks[0],
            rank: 2
          },
          {
            unlockId: "legacy.unlock.historical_rankless",
            unlockedAt: "2026-04-17T12:12:00.000Z",
            sourceTransactionId: "legacy.transaction.spend.20260417121200000.3"
          }
        ]
      },
      achievements: {
        ...spent.profile.achievements,
        revealedCharacterAchievementIds: ["achievement.character.first_blooded"],
        unlocked: [
          {
            achievementId: "achievement.account.first_chronicle",
            unlockedAt: "2026-04-17T12:11:00.000Z",
            sourceCharacterId: "player.arden_voss",
            rewardTransactionId: spent.profile.legacy.legacyTransactions.at(-1)?.id
          }
        ],
        cumulativeMetrics: {
          ...spent.profile.achievements.cumulativeMetrics,
          "account.runs.started": 1
        },
        characterMetricHighWaterMarks: {
          "player.arden_voss": {
            "character.combat.entries": 1
          }
        }
      },
      history: {
        runRecords: [
          {
            characterId: "player.arden_voss",
            name: "Arden Voss",
            lineageId: "lineage.human",
            startingContinentId: "continent.kaelvar",
            startingRegionId: "region.aurelia",
            startingSettlementId: "settlement.aurelis",
            startedAt: "2026-04-17T12:00:00.000Z",
            endedAt: "2026-04-17T12:14:00.000Z",
            lastSeenAt: "2026-04-17T12:15:00.000Z",
            outcome: "archived",
            archiveReason: "retired",
            echoLevelReached: 4,
            notableCharacterAchievementIds: ["achievement.character.first_blooded"],
            legacyGranted: 4,
            totalPlayTicks: 360,
            survivedDays: 15,
            payoutEligible: true,
            payoutBreakdown,
            legacyPayoutResolvedAt: "2026-04-17T12:14:00.000Z",
            legacyPayoutTransactionId: spent.profile.legacy.legacyTransactions.at(-1)?.id,
            saveSlotIds: []
          }
        ]
      }
    };

    saveAccountProfile(profile);

    const loaded = loadAccountProfile(DEFAULT_ACCOUNT_ID);
    assert.equal(loaded.displayName, "Harbor Ledger");
    assert.equal(loaded.lastPlayedAt, "2026-04-17T12:15:00.000Z");
    assert.equal(loaded.legacy.legacyPoints, 10);
    assert.equal(loaded.legacy.lifetimeLegacyEarned, 14);
    assert.equal(loaded.legacy.legacyUnlocks.length, 2);
    assert.equal(loaded.legacy.legacyUnlocks[0].unlockId, "legacy.unlock.brass_seal");
    assert.equal(loaded.legacy.legacyUnlocks[0].rank, 2);
    assert.equal(loaded.legacy.legacyUnlocks[1].unlockId, "legacy.unlock.historical_rankless");
    assert.equal(loaded.legacy.legacyUnlocks[1].rank, undefined);
    assert.equal(loaded.legacy.legacyTransactions.length, 2);
    assert.deepEqual(loaded.achievements.revealedCharacterAchievementIds, [
      "achievement.character.first_blooded"
    ]);
    assert.equal(loaded.achievements.unlocked[0]?.achievementId, "achievement.account.first_chronicle");
    assert.equal(loaded.achievements.cumulativeMetrics["account.runs.started"], 1);
    assert.equal(
      loaded.achievements.characterMetricHighWaterMarks["player.arden_voss"]["character.combat.entries"],
      1
    );
    assert.equal(loaded.history.runRecords[0]?.outcome, "archived");
    assert.equal(loaded.history.runRecords[0]?.archiveReason, "retired");
    assert.equal(loaded.history.runRecords[0]?.name, "Arden Voss");
    assert.equal(loaded.history.runRecords[0]?.totalPlayTicks, 360);
    assert.equal(loaded.history.runRecords[0]?.survivedDays, 15);
    assert.equal(loaded.history.runRecords[0]?.payoutEligible, true);
    assert.deepEqual(loaded.history.runRecords[0]?.payoutBreakdown, payoutBreakdown);
    assert.deepEqual(
      JSON.parse(JSON.stringify(loaded.history.runRecords[0]?.payoutBreakdown)),
      payoutBreakdown
    );
    assert.equal(loaded.history.runRecords[0]?.legacyPayoutResolvedAt, "2026-04-17T12:14:00.000Z");
    assert.equal(
      loaded.history.runRecords[0]?.legacyPayoutTransactionId,
      spent.profile.legacy.legacyTransactions.at(-1)?.id
    );
  }));

test("account profiles preserve retained retired records without migrating archived retirements", () =>
  withMockWindow(() => {
    const profile = {
      ...createDefaultAccountProfileState({
        accountId: "account.local.retired_storage",
        displayName: "Retired Storage",
        createdAt: "2026-04-17T12:00:00.000Z",
        updatedAt: "2026-04-17T12:00:00.000Z"
      }),
      history: {
        runRecords: [
          {
            characterId: "player.retained_retired",
            name: "Retained Retired",
            lineageId: "lineage.human",
            startingContinentId: "continent.kaelvar",
            startingRegionId: "region.aurelia",
            startingSettlementId: "settlement.aurelis",
            startedAt: "2026-04-17T12:00:00.000Z",
            endedAt: "2026-04-17T12:10:00.000Z",
            lastSeenAt: "2026-04-17T12:10:00.000Z",
            outcome: "retired",
            archiveReason: "retired",
            echoLevelReached: 3,
            notableCharacterAchievementIds: [],
            inheritanceUsesRemaining: 2,
            saveSlotIds: ["slot-1"]
          },
          {
            characterId: "player.archived_retired",
            name: "Archived Retired",
            lineageId: "lineage.human",
            startingContinentId: "continent.kaelvar",
            startingRegionId: "region.aurelia",
            startingSettlementId: "settlement.aurelis",
            startedAt: "2026-04-17T11:00:00.000Z",
            endedAt: "2026-04-17T11:10:00.000Z",
            lastSeenAt: "2026-04-17T11:10:00.000Z",
            outcome: "archived",
            archiveReason: "retired",
            echoLevelReached: 4,
            notableCharacterAchievementIds: [],
            legacyGranted: 0,
            saveSlotIds: []
          }
        ]
      }
    };

    saveAccountProfile(profile);

    const loaded = loadAccountProfile("account.local.retired_storage");
    assert.equal(loaded.history.runRecords[0]?.outcome, "retired");
    assert.equal(loaded.history.runRecords[0]?.inheritanceUsesRemaining, 2);
    assert.deepEqual(loaded.history.runRecords[0]?.saveSlotIds, ["slot-1"]);
    assert.equal(loaded.history.runRecords[1]?.outcome, "archived");
    assert.equal(loaded.history.runRecords[1]?.archiveReason, "retired");
    assert.equal(loaded.history.runRecords[1]?.inheritanceUsesRemaining, undefined);
  }));

test("legacy-only account profiles normalize forward with achievements and history defaults", () =>
  withMockWindow((storage) => {
    storage.setItem(
      "cataclysm-rpg-ui.accounts.v1.account.account.local.legacy_only",
      JSON.stringify({
        accountId: "account.local.legacy_only",
        displayName: "Old Ledger",
        createdAt: "2026-04-17T12:00:00.000Z",
        updatedAt: "2026-04-17T12:05:00.000Z",
        legacy: {
          legacyPoints: 4,
          lifetimeLegacyEarned: 7,
          legacyUnlocks: [],
          legacyTransactions: []
        }
      })
    );

    const loaded = loadAccountProfile("account.local.legacy_only");
    assert.equal(loaded.legacy.legacyPoints, 4);
    assert.deepEqual(loaded.achievements.unlocked, []);
    assert.deepEqual(loaded.achievements.revealedCharacterAchievementIds, []);
    assert.deepEqual(loaded.history.runRecords, []);
  }));

test("account-scoped saves roundtrip with accountId and remain invisible to other accounts", () =>
  withMockWindow(() => {
    const accountA = "account.local.alpha";
    const accountB = "account.local.beta";
    const snapshotA = createSnapshot(accountA, "Arden Voss");
    const snapshotB = createSnapshot(accountB, "Mira Vale");

    createSave(accountA, "slot-1", snapshotA, buildSaveMetadata("slot-1", snapshotA));
    createSave(accountB, "slot-1", snapshotB, buildSaveMetadata("slot-1", snapshotB));

    assert.equal(loadSave(accountA, "slot-1")?.accountId, accountA);
    assert.equal(loadSave(accountB, "slot-1")?.accountId, accountB);
    assert.equal(loadSave(accountA, "slot-2"), null);

    const accountASlots = listSaves(accountA);
    const accountBSlots = listSaves(accountB);
    assert.equal(accountASlots.find((slot) => slot.id === "slot-1")?.status, "ready");
    assert.equal(accountBSlots.find((slot) => slot.id === "slot-1")?.playerName, "Mira Vale");
    assert.equal(accountBSlots.find((slot) => slot.id === "slot-2")?.status, "empty");

    const updatedProfile = loadAccountProfile(accountA);
    assert.equal(typeof updatedProfile.lastPlayedAt, "string");
  }));

test("resetAllSaves clears only the targeted account saves and leaves the ledger intact", () =>
  withMockWindow(() => {
    const accountA = DEFAULT_ACCOUNT_ID;
    const accountB = "account.local.other";
    const snapshotA = createSnapshot(accountA, "Arden Voss");
    const snapshotB = createSnapshot(accountB, "Mira Vale");

    let profile = loadAccountProfile(accountA);
    const granted = grantLegacy(profile, {
      amount: 9,
      summary: "Recorded harbor service",
      sourceType: "test",
      sourceId: "reward.harbor_service",
      recordedAt: "2026-04-17T12:20:00.000Z"
    });
    assert.equal(granted.ok, true);
    profile = granted.profile;
    saveAccountProfile(profile);

    createSave(accountA, "slot-1", snapshotA, buildSaveMetadata("slot-1", snapshotA));
    createSave(accountB, "slot-1", snapshotB, buildSaveMetadata("slot-1", snapshotB));

    resetAllSaves(accountA);

    assert.equal(listSaves(accountA).find((slot) => slot.id === "slot-1")?.status, "empty");
    assert.equal(listSaves(accountB).find((slot) => slot.id === "slot-1")?.status, "ready");
    assert.equal(loadAccountProfile(accountA).legacy.lifetimeLegacyEarned, 9);
  }));

test("obsolete unscoped v4 save keys remain incompatible", () =>
  withMockWindow((storage) => {
    storage.setItem("cataclysm-rpg-ui.saves.v4.slot.slot-1", "{}");
    const slot = listSaves(DEFAULT_ACCOUNT_ID).find((entry) => entry.id === "slot-1");
    assert.equal(slot?.status, "incompatible");
  }));
