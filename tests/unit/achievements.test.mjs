import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  archiveRunRecord,
  createDefaultAccountProfileState,
  evaluateAchievementProgress,
  markRunDeleted,
  validateAchievementDefinitions
} from "../../packages/engines/game-engine/src/index.ts";
import { demoSnapshot } from "../../apps/rpg-ui/src/runtime/demoSnapshot.ts";

function createSnapshot() {
  const snapshot = structuredClone(demoSnapshot);
  snapshot.snapshotVersion = "0.6.0";
  snapshot.playerState.playerId = "player.arden_voss";
  snapshot.playerState.achievements = { unlocked: [] };
  snapshot.playerState.discoveryChronicle = {
    entries: [],
    lastUpdatedTick: null
  };
  snapshot.playerState.completedQuestIds = [];
  snapshot.playerState.reputation = {
    fame: [],
    notoriety: [],
    notorietyEvents: []
  };
  snapshot.sessionState.chronicle = [
    {
      id: "chronicle.combat.1",
      category: "combat",
      title: "Harbor Clash",
      summary: "A brief clash on the quay ended in your favor.",
      timeLabel: "Tick 120",
      statusLabel: "Recorded",
      entities: ["Arden Voss"],
      results: ["Held the line"],
      statChanges: ["HP -3"],
      tags: ["Combat"]
    }
  ];
  return snapshot;
}

function createHistorySnapshot(params) {
  const snapshot = createSnapshot();
  snapshot.playerState.playerId = params.playerId;
  snapshot.playerState.coreData.playerName = params.playerName;
  snapshot.playerState.coreData.lineageId = params.lineageId;
  snapshot.playerState.regionId = params.regionId;
  snapshot.playerState.location.settlementId = params.settlementId;
  snapshot.playerState.flags = [`player.start.${params.settlementId}`];
  snapshot.playerState.geographicKnowledge = [
    {
      scope: "continent",
      geographyId: params.continentId,
      level: 1
    }
  ];
  snapshot.playerState.achievements = { unlocked: [] };
  snapshot.sessionState.chronicle = [];
  return snapshot;
}

test("achievement evaluation reveals deeds, keeps start chronicles non-Prestige, and stays idempotent", () => {
  const snapshot = createSnapshot();
  const profile = createDefaultAccountProfileState({
    createdAt: "2026-04-17T12:00:00.000Z",
    updatedAt: "2026-04-17T12:00:00.000Z"
  });

  const first = evaluateAchievementProgress(snapshot, profile, {
    slotId: "slot-1",
    touchHistory: true,
    recordedAt: "2026-04-17T12:10:00.000Z"
  });

  assert.equal(first.changed, true);
  assert.ok(
    first.nextSnapshot.playerState.achievements.unlocked.some(
      (entry) => entry.achievementId === "achievement.character.first_blooded"
    )
  );
  assert.ok(
    first.nextAccountProfile.achievements.revealedCharacterAchievementIds.includes(
      "achievement.character.first_blooded"
    )
  );
  assert.ok(
    first.nextAccountProfile.achievements.unlocked.some(
      (entry) => entry.achievementId === "achievement.account.first_chronicle"
    )
  );
  assert.equal(first.nextAccountProfile.legacy.legacyPoints, 0);
  assert.equal(first.nextAccountProfile.legacy.lifetimeLegacyEarned, 0);
  assert.equal(first.nextAccountProfile.legacy.legacyTransactions.length, 0);
  assert.equal(
    first.nextAccountProfile.achievements.cumulativeMetrics["account.combat.entries_total"],
    1
  );

  const second = evaluateAchievementProgress(
    first.nextSnapshot,
    first.nextAccountProfile,
    {
      recordedAt: "2026-04-17T12:20:00.000Z"
    }
  );

  assert.equal(second.changed, false);
  assert.equal(second.nextAccountProfile.legacy.legacyPoints, 0);
  assert.equal(second.nextAccountProfile.legacy.legacyTransactions.length, 0);
  assert.equal(
    second.nextAccountProfile.achievements.cumulativeMetrics["account.combat.entries_total"],
    1
  );
});

test("character creation mode suppresses Prestige rewards", () => {
  const snapshot = createHistorySnapshot({
    playerId: "player.no_reward_start",
    playerName: "No Reward Start",
    lineageId: "lineage.human",
    continentId: "continent.alpha",
    regionId: "region.alpha",
    settlementId: "settlement.alpha"
  });
  const profile = createDefaultAccountProfileState({
    accountId: "account.local.creation_no_prestige"
  });

  const evaluated = evaluateAchievementProgress(snapshot, profile, {
    slotId: "slot-1",
    touchHistory: true,
    suppressLegacyRewards: true,
    recordedAt: "2026-04-17T12:25:00.000Z"
  });

  assert.equal(evaluated.nextAccountProfile.legacy.legacyPoints, 0);
  assert.equal(evaluated.nextAccountProfile.legacy.lifetimeLegacyEarned, 0);
  assert.equal(evaluated.nextAccountProfile.legacy.legacyTransactions.length, 0);
  assert.ok(
    evaluated.nextAccountProfile.achievements.unlocked.some(
      (entry) => entry.achievementId === "achievement.account.first_chronicle"
    )
  );
});

test("new-character App path requests Legacy reward suppression", () => {
  const appSource = readFileSync(
    new URL("../../apps/rpg-ui/src/App.tsx", import.meta.url),
    "utf8"
  );

  assert.match(appSource, /createNewGameSnapshot/);
  assert.match(appSource, /suppressLegacyRewards:\s*true/);
});

test("run history tracks multiple slots before deletion and only marks deleted after the final active slot disappears", () => {
  const snapshot = createSnapshot();
  const profile = createDefaultAccountProfileState();

  const withManual = evaluateAchievementProgress(snapshot, profile, {
    slotId: "slot-1",
    touchHistory: true,
    recordedAt: "2026-04-17T12:30:00.000Z"
  }).nextAccountProfile;
  const withQuick = evaluateAchievementProgress(snapshot, withManual, {
    slotId: "quick-save",
    touchHistory: true,
    recordedAt: "2026-04-17T12:35:00.000Z"
  }).nextAccountProfile;

  assert.deepEqual(
    withQuick.history.runRecords[0].saveSlotIds.sort(),
    ["quick-save", "slot-1"]
  );

  const afterManualDelete = markRunDeleted(withQuick, {
    characterId: snapshot.playerState.playerId,
    slotId: "slot-1",
    recordedAt: "2026-04-17T12:40:00.000Z"
  });
  assert.equal(afterManualDelete.history.runRecords[0].outcome, "active");
  assert.deepEqual(afterManualDelete.history.runRecords[0].saveSlotIds, ["quick-save"]);

  const afterFinalDelete = markRunDeleted(afterManualDelete, {
    characterId: snapshot.playerState.playerId,
    slotId: "quick-save",
    recordedAt: "2026-04-17T12:45:00.000Z"
  });
  assert.equal(afterFinalDelete.history.runRecords[0].outcome, "deleted");
  assert.deepEqual(afterFinalDelete.history.runRecords[0].saveSlotIds, []);
  assert.equal(afterFinalDelete.achievements.cumulativeMetrics["account.runs.started"], 0);
  assert.equal(afterFinalDelete.achievements.cumulativeMetrics["account.starts.lineages"], 0);
});

test("deleted runs are excluded at the shared history metric source", () => {
  const firstSnapshot = createHistorySnapshot({
    playerId: "player.deleted_alpha",
    playerName: "Deleted Alpha",
    lineageId: "lineage.human",
    continentId: "continent.alpha",
    regionId: "region.alpha",
    settlementId: "settlement.alpha"
  });
  const secondSnapshot = createHistorySnapshot({
    playerId: "player.active_beta",
    playerName: "Active Beta",
    lineageId: "lineage.elf",
    continentId: "continent.beta",
    regionId: "region.beta",
    settlementId: "settlement.beta"
  });
  const firstProfile = evaluateAchievementProgress(
    firstSnapshot,
    createDefaultAccountProfileState(),
    {
      slotId: "slot-1",
      touchHistory: true,
      suppressLegacyRewards: true,
      recordedAt: "2026-04-17T12:46:00.000Z"
    }
  ).nextAccountProfile;
  const secondProfile = evaluateAchievementProgress(secondSnapshot, firstProfile, {
    slotId: "slot-2",
    touchHistory: true,
    suppressLegacyRewards: true,
    recordedAt: "2026-04-17T12:47:00.000Z"
  }).nextAccountProfile;

  assert.equal(secondProfile.achievements.cumulativeMetrics["account.runs.started"], 2);
  assert.equal(secondProfile.achievements.cumulativeMetrics["account.starts.lineages"], 2);
  assert.equal(secondProfile.achievements.cumulativeMetrics["account.starts.continents"], 2);

  const afterDelete = markRunDeleted(secondProfile, {
    characterId: firstSnapshot.playerState.playerId,
    slotId: "slot-1",
    recordedAt: "2026-04-17T12:48:00.000Z"
  });

  assert.equal(afterDelete.history.runRecords[0].outcome, "deleted");
  assert.equal(afterDelete.achievements.cumulativeMetrics["account.runs.started"], 1);
  assert.equal(afterDelete.achievements.cumulativeMetrics["account.starts.lineages"], 1);
  assert.equal(afterDelete.achievements.cumulativeMetrics["account.starts.continents"], 1);
  assert.equal(afterDelete.achievements.cumulativeMetrics["account.starts.regions"], 1);
  assert.equal(afterDelete.achievements.cumulativeMetrics["account.starts.settlements"], 1);
});

test("delete and recreate loops do not grant Prestige through start-history achievements", () => {
  let profile = createDefaultAccountProfileState();
  const starts = [
    {
      playerId: "player.loop_alpha",
      playerName: "Loop Alpha",
      lineageId: "lineage.human",
      continentId: "continent.alpha",
      regionId: "region.alpha",
      settlementId: "settlement.alpha"
    },
    {
      playerId: "player.loop_beta",
      playerName: "Loop Beta",
      lineageId: "lineage.elf",
      continentId: "continent.beta",
      regionId: "region.beta",
      settlementId: "settlement.beta"
    },
    {
      playerId: "player.loop_gamma",
      playerName: "Loop Gamma",
      lineageId: "lineage.dwarf",
      continentId: "continent.gamma",
      regionId: "region.gamma",
      settlementId: "settlement.gamma"
    }
  ];

  for (const [index, params] of starts.entries()) {
    const snapshot = createHistorySnapshot(params);
    profile = evaluateAchievementProgress(snapshot, profile, {
      slotId: "slot-1",
      touchHistory: true,
      suppressLegacyRewards: true,
      recordedAt: `2026-04-17T12:5${index}:00.000Z`
    }).nextAccountProfile;
    profile = markRunDeleted(profile, {
      characterId: snapshot.playerState.playerId,
      slotId: "slot-1",
      recordedAt: `2026-04-17T12:5${index}:30.000Z`
    });
  }

  assert.equal(profile.legacy.legacyPoints, 0);
  assert.equal(profile.legacy.lifetimeLegacyEarned, 0);
  assert.equal(profile.legacy.legacyTransactions.length, 0);
  assert.equal(profile.achievements.cumulativeMetrics["account.runs.started"], 0);
  assert.equal(profile.achievements.cumulativeMetrics["account.starts.lineages"], 0);
  assert.equal(profile.achievements.cumulativeMetrics["account.starts.continents"], 0);
});

test("archiving a run keeps compact history, sets archive reason, and clears save slots", () => {
  const snapshot = createSnapshot();
  const profile = evaluateAchievementProgress(
    snapshot,
    createDefaultAccountProfileState(),
    {
      slotId: "slot-1",
      touchHistory: true,
      recordedAt: "2026-04-17T12:50:00.000Z"
    }
  ).nextAccountProfile;

  const archived = archiveRunRecord(profile, {
    characterId: snapshot.playerState.playerId,
    archiveReason: "retired",
    endedAt: "2026-04-17T13:00:00.000Z",
    legacyGranted: 12
  });

  assert.equal(archived.history.runRecords[0].outcome, "archived");
  assert.equal(archived.history.runRecords[0].archiveReason, "retired");
  assert.equal(archived.history.runRecords[0].legacyGranted, 12);
  assert.deepEqual(archived.history.runRecords[0].saveSlotIds, []);
});

test("achievement catalog validation rejects malformed rewards and applies layer defaults", () => {
  assert.throws(
    () =>
      validateAchievementDefinitions("test.records", [
        {
          id: "achievement.character.bad_reward",
          layer: "character",
          category: "combat",
          title: "Bad Reward",
          description: "Should not reward a deed directly.",
          metricId: "character.combat.entries",
          targetValue: 1,
          reward: { legacyPoints: 1 }
        }
      ]),
    /reward is only allowed for account achievements/
  );

  assert.throws(
    () =>
      validateAchievementDefinitions("test.records", [
        {
          id: "achievement.account.bad_reward",
          layer: "account",
          category: "trade",
          title: "Broken Chronicle",
          description: "A malformed reward should fail validation.",
          metricId: "account.trade.entries_total",
          targetValue: 2,
          reward: {}
        }
      ]),
    /reward must define legacyPoints, unlockId, or both/
  );

  const [accountEntry, characterEntry] = validateAchievementDefinitions("test.records", [
    {
      id: "achievement.account.default_visibility",
      layer: "account",
      category: "beginnings",
      title: "Visible Chronicle",
      description: "Account achievements default to visible.",
      metricId: "account.runs.started",
      targetValue: 1
    },
    {
      id: "achievement.character.default_visibility",
      layer: "character",
      category: "travel",
      title: "Hidden Deed",
      description: "Character achievements default to hidden until revealed.",
      metricId: "character.travel.entries",
      targetValue: 1
    }
  ]);

  assert.equal(accountEntry.hiddenByDefault, false);
  assert.equal(accountEntry.rarity, "common");
  assert.equal(characterEntry.hiddenByDefault, true);
  assert.equal(characterEntry.rarity, "common");
});
