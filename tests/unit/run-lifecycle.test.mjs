import test from "node:test";
import assert from "node:assert/strict";
import { demoSnapshot } from "../../apps/rpg-ui/src/runtime/demoSnapshot.ts";
import { evaluateAchievementProgress } from "../../packages/engines/game-engine/src/achievements.ts";
import {
  hasRunLegacyPayoutResolved,
  isRunEligibleForLegacyPayout,
  resolveRunLegacyPayout
} from "../../packages/engines/game-engine/src/run-legacy-payout.ts";
import {
  archiveActiveRun,
  consumeRetiredRunInheritanceUse,
  isRunChronicleVisible,
  isRunDeleted,
  isRunLineageAuthoritative,
  isRunProgressionAuthoritative,
  purgeBlockedRunSlot,
  retainRetiredRun,
  resolveTerminalArchiveReason
} from "../../apps/rpg-ui/src/game-shell/runLifecycle.ts";
import {
  buildSaveMetadata,
  createSave,
  loadSave
} from "../../apps/rpg-ui/src/game-shell/saveManager.ts";
import { loadAccountProfile } from "../../apps/rpg-ui/src/game-shell/accountProfileManager.ts";

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
  snapshot.playerState.achievements = { unlocked: [] };
  return snapshot;
}

function createMeaningfulSnapshot(accountId, playerName) {
  const snapshot = createSnapshot(accountId, playerName);
  snapshot.playerState.progression = {
    ...snapshot.playerState.progression,
    level: 8
  };
  snapshot.playerState.saveMeta = {
    ...snapshot.playerState.saveMeta,
    totalPlayTicks: 960
  };
  return snapshot;
}

function createPayoutRecord(overrides = {}) {
  return {
    characterId: "player.payout",
    name: "Payout Runner",
    lineageId: "lineage.human",
    startingContinentId: "continent.kaelvar",
    startingRegionId: "region.aurelia",
    startingSettlementId: "settlement.aurelis",
    startedAt: "2026-04-17T12:00:00.000Z",
    endedAt: "2026-04-17T12:30:00.000Z",
    lastSeenAt: "2026-04-17T12:30:00.000Z",
    outcome: "archived",
    archiveReason: "retired",
    echoLevelReached: 8,
    notableCharacterAchievementIds: [],
    totalPlayTicks: 960,
    survivedDays: 40,
    saveSlotIds: [],
    ...overrides
  };
}

function assertCompactPayoutBreakdown(breakdown) {
  const keys = [
    "archiveReasonModifier",
    "challengeModifier",
    "finalAmount",
    "milestoneQuality",
    "modifiedScore",
    "notableDeeds",
    "progressionDepth",
    "rawScore",
    "repeatedWeakRunModifier",
    "shallowRunModifier",
    "survivalDepth"
  ];

  assert.deepEqual(Object.keys(breakdown).sort(), keys.sort());
  for (const key of keys) {
    assert.equal(typeof breakdown[key], "number");
  }
  assert.deepEqual(JSON.parse(JSON.stringify(breakdown)), breakdown);
}

test("retirement archives the run, clears all playable saves, and records zero Legacy by default", () =>
  withMockWindow(() => {
    const accountId = "account.local.lifecycle";
    const snapshot = createSnapshot(accountId, "Arden Voss");
    snapshot.playerState.progression = {
      ...snapshot.playerState.progression,
      level: 0
    };
    snapshot.playerState.saveMeta = {
      ...snapshot.playerState.saveMeta,
      totalPlayTicks: 0
    };
    snapshot.playerState.discoveryChronicle = {
      ...snapshot.playerState.discoveryChronicle,
      entries: []
    };
    snapshot.playerState.completedQuestIds = [];
    snapshot.playerState.reputation = {
      ...snapshot.playerState.reputation,
      fame: []
    };
    snapshot.sessionState = {
      ...snapshot.sessionState,
      chronicle: []
    };
    createSave(accountId, "slot-1", snapshot, buildSaveMetadata("slot-1", snapshot));
    createSave(accountId, "quick-save", snapshot, buildSaveMetadata("quick-save", snapshot));
    const baseline = evaluateAchievementProgress(snapshot, loadAccountProfile(accountId), {
      slotId: "slot-1",
      touchHistory: true
    }).nextAccountProfile;

    const archived = archiveActiveRun({
      accountId,
      accountProfile: loadAccountProfile(accountId),
      snapshot,
      archiveReason: "retired",
      fallbackSlotId: "slot-1"
    });

    assert.equal(loadSave(accountId, "slot-1"), null);
    assert.equal(loadSave(accountId, "quick-save"), null);
    assert.deepEqual(archived.clearedSlotIds.sort(), ["quick-save", "slot-1"]);
    assert.equal(archived.legacyGranted, 0);
    assert.equal(archived.accountProfile.legacy.legacyPoints, baseline.legacy.legacyPoints);
    assert.equal(
      archived.accountProfile.legacy.legacyTransactions.length,
      baseline.legacy.legacyTransactions.length
    );
    const record = archived.accountProfile.history.runRecords[0];
    assert.equal(record?.outcome, "archived");
    assert.equal(record?.archiveReason, "retired");
    assert.equal(record?.legacyGranted, 0);
    assert.equal(record?.payoutEligible, false);
    assertCompactPayoutBreakdown(record?.payoutBreakdown);
    assert.equal(record?.payoutBreakdown?.finalAmount, 0);
    assert.equal(record?.totalPlayTicks, snapshot.playerState.saveMeta.totalPlayTicks);
    assert.equal(record?.survivedDays, Math.floor(snapshot.playerState.saveMeta.totalPlayTicks / 24));
    assert.equal(typeof record?.legacyPayoutResolvedAt, "string");
    assert.equal(record?.legacyPayoutTransactionId, undefined);
    assert.deepEqual(record?.saveSlotIds, []);
  }));

test("meaningful archived run grants positive Legacy and persists payout metadata", () =>
  withMockWindow(() => {
    const accountId = "account.local.meaningful_payout";
    const snapshot = createMeaningfulSnapshot(accountId, "Lyra Morn");
    createSave(accountId, "slot-1", snapshot, buildSaveMetadata("slot-1", snapshot));
    const baseline = evaluateAchievementProgress(snapshot, loadAccountProfile(accountId), {
      slotId: "slot-1",
      touchHistory: true
    }).nextAccountProfile;

    const archived = archiveActiveRun({
      accountId,
      accountProfile: loadAccountProfile(accountId),
      snapshot,
      archiveReason: "retired",
      fallbackSlotId: "slot-1",
      recordedAt: "2026-04-17T13:00:00.000Z"
    });
    const record = archived.accountProfile.history.runRecords[0];

    assert.ok(archived.legacyGranted > 0);
    assert.equal(archived.accountProfile.legacy.legacyPoints, baseline.legacy.legacyPoints + archived.legacyGranted);
    assert.equal(
      archived.accountProfile.legacy.legacyTransactions.length,
      baseline.legacy.legacyTransactions.length + 1
    );
    assert.equal(record?.legacyGranted, archived.legacyGranted);
    assert.equal(record?.payoutEligible, true);
    assertCompactPayoutBreakdown(record?.payoutBreakdown);
    assert.equal(record?.payoutBreakdown?.finalAmount, archived.legacyGranted);
    assert.equal(record?.totalPlayTicks, 960);
    assert.equal(record?.survivedDays, 40);
    assert.equal(record?.legacyPayoutResolvedAt, "2026-04-17T13:00:00.000Z");
    assert.equal(record?.legacyPayoutTransactionId, archived.rewardTransactionId);
  }));

test("archived run payout uses explicit resolution markers for idempotency", () =>
  withMockWindow(() => {
    const accountId = "account.local.payout_idempotency";
    const snapshot = createMeaningfulSnapshot(accountId, "Ida Vale");
    createSave(accountId, "slot-1", snapshot, buildSaveMetadata("slot-1", snapshot));

    const first = archiveActiveRun({
      accountId,
      accountProfile: loadAccountProfile(accountId),
      snapshot,
      archiveReason: "retired",
      fallbackSlotId: "slot-1",
      recordedAt: "2026-04-17T13:10:00.000Z"
    });
    const transactionCount = first.accountProfile.legacy.legacyTransactions.length;

    const second = archiveActiveRun({
      accountId,
      accountProfile: first.accountProfile,
      snapshot,
      archiveReason: "retired",
      recordedAt: "2026-04-17T13:15:00.000Z"
    });

    assert.ok(first.legacyGranted > 0);
    assert.equal(second.legacyGranted, 0);
    assert.equal(second.accountProfile.legacy.legacyTransactions.length, transactionCount);
    assert.equal(
      second.accountProfile.history.runRecords[0]?.legacyPayoutResolvedAt,
      "2026-04-17T13:10:00.000Z"
    );

    const unresolvedPriorGrant = createPayoutRecord({
      legacyGranted: 99
    });
    assert.equal(hasRunLegacyPayoutResolved(unresolvedPriorGrant), false);
    assert.equal(isRunEligibleForLegacyPayout(unresolvedPriorGrant), true);
    assert.equal(
      isRunEligibleForLegacyPayout({
        ...unresolvedPriorGrant,
        legacyPayoutResolvedAt: "2026-04-17T13:20:00.000Z"
      }),
      false
    );
  }));

test("run legacy payout resolves archive reasons and excludes active or deleted records", () => {
  const retired = resolveRunLegacyPayout(createPayoutRecord({ archiveReason: "retired" }));
  const dead = resolveRunLegacyPayout(createPayoutRecord({ archiveReason: "dead" }));
  const hardcoreDead = resolveRunLegacyPayout(createPayoutRecord({ archiveReason: "hardcore_dead" }));
  const retainedRetired = resolveRunLegacyPayout(
    createPayoutRecord({
      outcome: "retired",
      archiveReason: "retired",
      inheritanceUsesRemaining: 0
    })
  );
  const active = resolveRunLegacyPayout(
    createPayoutRecord({
      outcome: "active",
      archiveReason: undefined
    })
  );
  const deleted = resolveRunLegacyPayout(
    createPayoutRecord({
      outcome: "deleted",
      archiveReason: undefined
    })
  );

  assert.ok(retired.legacyGranted > 0);
  assert.ok(dead.legacyGranted < retired.legacyGranted);
  assert.ok(hardcoreDead.legacyGranted > retired.legacyGranted);
  assert.equal(retainedRetired.legacyGranted, retired.legacyGranted);
  assert.equal(active.payoutEligible, false);
  assert.equal(active.legacyGranted, 0);
  assert.equal(deleted.payoutEligible, false);
  assert.equal(deleted.legacyGranted, 0);
  assertCompactPayoutBreakdown(deleted.payoutBreakdown);
});

test("retained retired helper keeps slots and defaults inheritance uses to zero", () =>
  withMockWindow(() => {
    const accountId = "account.local.retained_retired";
    const snapshot = createSnapshot(accountId, "Selene Ward");
    createSave(accountId, "slot-1", snapshot, buildSaveMetadata("slot-1", snapshot));
    createSave(accountId, "quick-save", snapshot, buildSaveMetadata("quick-save", snapshot));

    const retired = retainRetiredRun({
      accountId,
      accountProfile: loadAccountProfile(accountId),
      snapshot,
      fallbackSlotId: "slot-1",
      recordedAt: "2026-04-17T13:20:00.000Z"
    });
    const record = retired.accountProfile.history.runRecords[0];

    assert.equal(loadSave(accountId, "slot-1")?.playerState.playerId, snapshot.playerState.playerId);
    assert.equal(loadSave(accountId, "quick-save")?.playerState.playerId, snapshot.playerState.playerId);
    assert.deepEqual(retired.retainedSlotIds.sort(), ["quick-save", "slot-1"]);
    assert.equal(retired.inheritanceUsesRemaining, 0);
    assert.equal(record?.outcome, "retired");
    assert.equal(record?.archiveReason, "retired");
    assert.equal(record?.inheritanceUsesRemaining, 0);
    assert.deepEqual(record?.saveSlotIds.sort(), ["quick-save", "slot-1"]);
  }));

test("run lifecycle authority classifiers separate active retired archived and deleted states", () => {
  const baseRecord = {
    characterId: "player.authority",
    name: "Authority",
    lineageId: "lineage.human",
    startingContinentId: "continent.kaelvar",
    startingRegionId: "region.aurelia",
    startingSettlementId: "settlement.aurelis",
    startedAt: "2026-04-17T12:00:00.000Z",
    lastSeenAt: "2026-04-17T12:05:00.000Z",
    echoLevelReached: 1,
    notableCharacterAchievementIds: [],
    saveSlotIds: ["slot-1"]
  };
  const active = { ...baseRecord, outcome: "active" };
  const retiredWithoutUses = {
    ...baseRecord,
    outcome: "retired",
    archiveReason: "retired",
    inheritanceUsesRemaining: 0
  };
  const retiredWithUses = {
    ...baseRecord,
    outcome: "retired",
    archiveReason: "retired",
    inheritanceUsesRemaining: 2
  };
  const archived = {
    ...baseRecord,
    outcome: "archived",
    archiveReason: "retired",
    saveSlotIds: []
  };
  const deleted = {
    ...baseRecord,
    outcome: "deleted",
    saveSlotIds: []
  };

  assert.equal(isRunChronicleVisible(active), true);
  assert.equal(isRunProgressionAuthoritative(active), false);
  assert.equal(isRunLineageAuthoritative(active), false);

  assert.equal(isRunChronicleVisible(retiredWithoutUses), true);
  assert.equal(isRunProgressionAuthoritative(retiredWithoutUses), true);
  assert.equal(isRunLineageAuthoritative(retiredWithoutUses), false);

  assert.equal(isRunChronicleVisible(retiredWithUses), true);
  assert.equal(isRunProgressionAuthoritative(retiredWithUses), true);
  assert.equal(isRunLineageAuthoritative(retiredWithUses), true);

  assert.equal(isRunChronicleVisible(archived), true);
  assert.equal(isRunProgressionAuthoritative(archived), true);
  assert.equal(isRunLineageAuthoritative(archived), false);

  assert.equal(isRunChronicleVisible(deleted), false);
  assert.equal(isRunProgressionAuthoritative(deleted), false);
  assert.equal(isRunLineageAuthoritative(deleted), false);
  assert.equal(isRunDeleted(deleted), true);
});

test("retired inheritance consumption decrements uses and reports auto-archive eligibility", () =>
  withMockWindow(() => {
    const accountId = "account.local.retired_inheritance";
    const snapshot = createSnapshot(accountId, "Marin Vale");
    createSave(accountId, "slot-1", snapshot, buildSaveMetadata("slot-1", snapshot));
    const retired = retainRetiredRun({
      accountId,
      accountProfile: loadAccountProfile(accountId),
      snapshot,
      fallbackSlotId: "slot-1",
      recordedAt: "2026-04-17T13:30:00.000Z",
      inheritanceUsesRemaining: 1
    });

    const consumed = consumeRetiredRunInheritanceUse(retired.accountProfile, {
      characterId: snapshot.playerState.playerId,
      recordedAt: "2026-04-17T13:35:00.000Z"
    });

    assert.equal(consumed.consumed, true);
    assert.equal(consumed.remainingInheritanceUses, 0);
    assert.equal(consumed.autoArchiveEligible, true);
    assert.equal(
      consumed.accountProfile.history.runRecords[0]?.inheritanceUsesRemaining,
      0
    );
    assert.equal(loadSave(accountId, "slot-1")?.playerState.playerId, snapshot.playerState.playerId);
  }));

test("death archiving resolves dead and hardcore_dead terminal reasons", () => {
  const deadSnapshot = createSnapshot("account.local.dead", "Mira Vale");
  deadSnapshot.playerState.resources.hp.current = 0;

  const hardcoreSnapshot = createSnapshot("account.local.hardcore_dead", "Joren Pike");
  hardcoreSnapshot.playerState.resources.hp.current = 0;
  hardcoreSnapshot.gameState.runDifficulty = {
    ...hardcoreSnapshot.gameState.runDifficulty,
    hardcore: true
  };

  assert.equal(resolveTerminalArchiveReason(deadSnapshot), "dead");
  assert.equal(resolveTerminalArchiveReason(hardcoreSnapshot), "hardcore_dead");
});

test("archived and deleted runs are rejected on load and stale slots are cleared", () =>
  withMockWindow(() => {
    const archivedAccountId = "account.local.archived";
    const archivedSnapshot = createSnapshot(archivedAccountId, "Iris Vale");
    createSave(
      archivedAccountId,
      "slot-1",
      archivedSnapshot,
      buildSaveMetadata("slot-1", archivedSnapshot)
    );
    const archivedProfile = {
      ...loadAccountProfile(archivedAccountId),
      history: {
        runRecords: [
          {
            characterId: archivedSnapshot.playerState.playerId,
            name: archivedSnapshot.playerState.coreData.playerName,
            lineageId: archivedSnapshot.playerState.coreData.lineageId,
            startingContinentId: "continent.kaelvar",
            startingRegionId: archivedSnapshot.playerState.regionId,
            startingSettlementId: archivedSnapshot.playerState.location.settlementId,
            startedAt: "2026-04-17T12:00:00.000Z",
            endedAt: "2026-04-17T12:10:00.000Z",
            lastSeenAt: "2026-04-17T12:10:00.000Z",
            outcome: "archived",
            archiveReason: "retired",
            echoLevelReached: archivedSnapshot.playerState.progression.level,
            notableCharacterAchievementIds: [],
            legacyGranted: 0,
            saveSlotIds: []
          }
        ]
      }
    };

    const archivedBlocked = purgeBlockedRunSlot({
      accountId: archivedAccountId,
      accountProfile: archivedProfile,
      characterId: archivedSnapshot.playerState.playerId,
      slotId: "slot-1"
    });

    assert.equal(archivedBlocked?.outcome, "archived");
    assert.equal(loadSave(archivedAccountId, "slot-1"), null);

    const deletedAccountId = "account.local.deleted";
    const deletedSnapshot = createSnapshot(deletedAccountId, "Tomas Reed");
    createSave(
      deletedAccountId,
      "slot-1",
      deletedSnapshot,
      buildSaveMetadata("slot-1", deletedSnapshot)
    );
    const deletedProfile = {
      ...loadAccountProfile(deletedAccountId),
      history: {
        runRecords: [
          {
            characterId: deletedSnapshot.playerState.playerId,
            name: deletedSnapshot.playerState.coreData.playerName,
            lineageId: deletedSnapshot.playerState.coreData.lineageId,
            startingContinentId: "continent.kaelvar",
            startingRegionId: deletedSnapshot.playerState.regionId,
            startingSettlementId: deletedSnapshot.playerState.location.settlementId,
            startedAt: "2026-04-17T12:00:00.000Z",
            endedAt: "2026-04-17T12:10:00.000Z",
            lastSeenAt: "2026-04-17T12:10:00.000Z",
            outcome: "deleted",
            echoLevelReached: deletedSnapshot.playerState.progression.level,
            notableCharacterAchievementIds: [],
            legacyGranted: 0,
            saveSlotIds: []
          }
        ]
      }
    };

    const deletedBlocked = purgeBlockedRunSlot({
      accountId: deletedAccountId,
      accountProfile: deletedProfile,
      characterId: deletedSnapshot.playerState.playerId,
      slotId: "slot-1"
    });

    assert.equal(deletedBlocked?.outcome, "deleted");
    assert.equal(loadSave(deletedAccountId, "slot-1"), null);
  }));
