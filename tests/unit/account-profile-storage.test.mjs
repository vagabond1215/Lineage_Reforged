import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_ACCOUNT_DISPLAY_NAME,
  DEFAULT_ACCOUNT_ID,
  createDefaultAccountProfileState,
  grantLegacy,
  purchaseLegacyUnlock,
  setLegacyPreparationChoice,
  selectLegacyPreparation,
  spendLegacy
} from "../../packages/engines/game-engine/src/index.ts";
import { createInitialClock } from "../../packages/shared/time/src/index.ts";
import { demoSnapshot } from "../../apps/rpg-ui/src/runtime/demoSnapshot.ts";
import {
  createDefaultCharacterCreationFormState,
  validateCharacterCreationForm
} from "../../apps/rpg-ui/src/game-shell/characterCreationForm.ts";
import {
  createDefaultStartingBundleChoiceSelections,
  getLineageIdentityCatalog
} from "../../apps/rpg-ui/src/game-shell/characterCreationCatalog.ts";
import {
  createNewGameSnapshot
} from "../../apps/rpg-ui/src/game-shell/newGameSnapshot.ts";
import { getDefaultWorldSelection } from "../../apps/rpg-ui/src/game-shell/worldSelectionCatalog.ts";
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

const STARTING_HP = "legacy.unlock.account.starting_hp";
const STARTING_STAMINA = "legacy.unlock.account.starting_stamina";
const STARTING_COIN = "legacy.unlock.account.starting_coin";
const MERCHANT_PURSE = "legacy.unlock.preparation.merchant_purse";
const VITAL_LEGACY = "legacy.unlock.preparation.vital_legacy";

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

function createCompleteCharacterForm(backstoryId = "backstory.local_hero") {
  const identity = getLineageIdentityCatalog("lineage.human");
  assert.ok(identity);
  const startingBundleId = "starting_bundle.traveler";
  const world = getDefaultWorldSelection(backstoryId);
  const form = {
    ...createDefaultCharacterCreationFormState("slot-1"),
    playerName: "Storage Legacy Runner",
    hairColorId: identity.hairColorOptions[0]?.id ?? "",
    eyeColorId: identity.eyeColorOptions[0]?.id ?? "",
    skinToneId: identity.skinToneOptions[0]?.id ?? "",
    startingBundleId,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(startingBundleId),
    backstoryId,
    continentId: world.continentId,
    regionId: world.regionId,
    startingSettlementId: world.settlementId
  };
  const validation = validateCharacterCreationForm(form);

  assert.deepEqual(validation.errors, {});
  return form;
}

function purchaseRanks(profile, unlockId, ranks, startMinute = 0) {
  let nextProfile = profile;

  for (let rank = 1; rank <= ranks; rank += 1) {
    const purchased = purchaseLegacyUnlock(
      nextProfile,
      unlockId,
      `2026-04-20T21:${(startMinute + rank).toString().padStart(2, "0")}:00.000Z`
    );

    assert.equal(purchased.ok, true);
    nextProfile = purchased.profile;
  }

  return nextProfile;
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
            legacyPayoutBaseline: { echoLevel: 1 },
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
      },
      estate: {
        deposits: [
          {
            depositId: "estate.deposit.player_arden_voss_20260417120000000",
            sourceRunId: "player.arden_voss::2026-04-17T12:00:00.000Z",
            sourceCharacterId: "player.arden_voss",
            sourceName: "Arden Voss",
            archiveReason: "retired",
            depositedAt: "2026-04-17T12:14:00.000Z"
          }
        ],
        assets: [
          {
            estateAssetId: "estate.asset.player_arden_voss.currency.gold",
            sourceRunId: "player.arden_voss::2026-04-17T12:00:00.000Z",
            depositedAt: "2026-04-17T12:14:00.000Z",
            assetKind: "currency",
            quantityClaimed: 0,
            currencyKey: "gold",
            quantityDeposited: 7
          },
          {
            estateAssetId: "estate.asset.player_arden_voss.item.abalone_meat",
            sourceRunId: "player.arden_voss::2026-04-17T12:00:00.000Z",
            depositedAt: "2026-04-17T12:14:00.000Z",
            assetKind: "item",
            quantityClaimed: 0,
            itemId: "item.abalone_meat",
            quantityDeposited: 3
          },
          {
            estateAssetId: "estate.asset.player_arden_voss.business.gannet_cutter",
            sourceRunId: "player.arden_voss::2026-04-17T12:00:00.000Z",
            depositedAt: "2026-04-17T12:14:00.000Z",
            assetKind: "operational",
            quantityClaimed: 0,
            assetId: "business.gannet_cutter",
            assetType: "business",
            displayName: "Gannet Cutter",
            location: {
              settlementId: "settlement.aurelis",
              regionId: "region.aurelia",
              continentId: "continent.kaelvar"
            },
            ownershipState: "recorded",
            operatingState: "Mothballed",
            storedValueSummary: "Value 120 silver"
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
    assert.deepEqual(loaded.legacy.selectedPreparationUnlockIds, []);
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
    assert.deepEqual(loaded.history.runRecords[0]?.legacyPayoutBaseline, { echoLevel: 1 });
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
    assert.equal(loaded.estate.deposits.length, 1);
    assert.equal(loaded.estate.deposits[0]?.sourceName, "Arden Voss");
    assert.equal(loaded.estate.assets.length, 3);
    assert.equal(
      loaded.estate.assets.find((asset) => asset.assetKind === "item")?.itemKey,
      undefined
    );
    assert.equal(
      loaded.estate.assets.find((asset) => asset.assetKind === "currency")?.quantityDeposited,
      7
    );
    assert.deepEqual(
      loaded.estate.assets.find((asset) => asset.assetKind === "operational")?.location,
      {
        settlementId: "settlement.aurelis",
        regionId: "region.aurelia",
        continentId: "continent.kaelvar"
      }
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
            sourceRunId: "player.parent::2026-04-16T12:00:00.000Z",
            crossLineageStart: true,
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
    assert.equal(
      loaded.history.runRecords[0]?.sourceRunId,
      "player.parent::2026-04-16T12:00:00.000Z"
    );
    assert.equal(loaded.history.runRecords[0]?.crossLineageStart, true);
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
    assert.deepEqual(loaded.legacy.selectedPreparationUnlockIds, []);
    assert.deepEqual(loaded.achievements.unlocked, []);
    assert.deepEqual(loaded.achievements.revealedCharacterAchievementIds, []);
    assert.deepEqual(loaded.history.runRecords, []);
    assert.deepEqual(loaded.estate, { deposits: [], assets: [] });
  }));

test("account profile roundtrip preserves owned and selected Legacy preparations separately", () =>
  withMockWindow(() => {
    let profile = grantLegacy(
      createDefaultAccountProfileState({
        accountId: "account.local.preparations",
        displayName: "Preparation Ledger"
      }),
      {
        amount: 100,
        summary: "Test grant",
        sourceType: "test",
        sourceId: "test.preparations",
        recordedAt: "2026-04-20T17:00:00.000Z"
      }
    ).profile;

    for (const unlockId of [
      "legacy.unlock.lineage.prepared_lineage",
      "legacy.unlock.lineage.prepared_lineage",
      "legacy.unlock.preparation.storehouse_keys",
      "legacy.unlock.preparation.merchant_purse",
      "legacy.unlock.preparation.camp_supplies",
      "legacy.unlock.preparation.martial_legacy"
    ]) {
      const purchased = purchaseLegacyUnlock(
        profile,
        unlockId,
        `2026-04-20T17:${profile.legacy.legacyTransactions.length.toString().padStart(2, "0")}:00.000Z`
      );
      assert.equal(purchased.ok, true);
      profile = purchased.profile;
    }

    profile = {
      ...profile,
      legacy: {
        ...profile.legacy,
        selectedPreparationUnlockIds: [
          "legacy.unlock.preparation.storehouse_keys",
          "legacy.unlock.preparation.martial_legacy",
          "legacy.unlock.preparation.unknown",
          "legacy.unlock.preparation.merchant_purse",
          "legacy.unlock.preparation.camp_supplies"
        ],
        selectedPreparationChoicePayloads: {
          "legacy.unlock.preparation.martial_legacy": "DEX",
          "legacy.unlock.preparation.unknown": "WIS",
          "legacy.unlock.preparation.camp_supplies": "hp"
        }
      }
    };

    const chosen = setLegacyPreparationChoice(
      profile,
      "legacy.unlock.preparation.martial_legacy",
      "DEX"
    );
    assert.equal(chosen.ok, true);
    profile = {
      ...chosen.profile,
      legacy: {
        ...chosen.profile.legacy,
        selectedPreparationUnlockIds: [
          ...chosen.profile.legacy.selectedPreparationUnlockIds,
          "legacy.unlock.preparation.unknown",
          "legacy.unlock.preparation.camp_supplies"
        ]
      }
    };

    saveAccountProfile(profile);

    const loaded = loadAccountProfile("account.local.preparations");
    assert.deepEqual(loaded.legacy.selectedPreparationUnlockIds, [
      "legacy.unlock.preparation.storehouse_keys",
      "legacy.unlock.preparation.martial_legacy"
    ]);
    assert.deepEqual(loaded.legacy.selectedPreparationChoicePayloads, {
      "legacy.unlock.preparation.martial_legacy": "DEX"
    });
    assert.equal(
      loaded.legacy.legacyUnlocks.some(
        (unlock) => unlock.unlockId === "legacy.unlock.preparation.camp_supplies"
      ),
      true
    );

    const removed = selectLegacyPreparation(
      {
        ...loaded,
        legacy: {
          ...loaded.legacy,
          selectedPreparationUnlockIds: [
            "legacy.unlock.preparation.storehouse_keys"
          ],
          selectedPreparationChoicePayloads: {}
        }
      },
      "legacy.unlock.preparation.merchant_purse"
    );
    assert.equal(removed.ok, true);
    assert.deepEqual(removed.profile.legacy.selectedPreparationUnlockIds, [
      "legacy.unlock.preparation.storehouse_keys",
      "legacy.unlock.preparation.merchant_purse"
    ]);
    assert.deepEqual(removed.profile.legacy.selectedPreparationChoicePayloads, {});
  }));

test("account-scoped saves roundtrip with accountId and remain invisible to other accounts", () =>
  withMockWindow(() => {
    const accountA = "account.local.alpha";
    const accountB = "account.local.beta";
    const snapshotA = createSnapshot(accountA, "Arden Voss");
    snapshotA.playerState.saveMeta.appliedLegacyPreparationIds = [
      "legacy.unlock.preparation.storehouse_keys"
    ];
    snapshotA.playerState.saveMeta.appliedLegacyPreparationChoices = {
      "legacy.unlock.preparation.martial_legacy": "STR"
    };
    const snapshotB = createSnapshot(accountB, "Mira Vale");

    createSave(accountA, "slot-1", snapshotA, buildSaveMetadata("slot-1", snapshotA));
    createSave(accountB, "slot-1", snapshotB, buildSaveMetadata("slot-1", snapshotB));

    assert.equal(loadSave(accountA, "slot-1")?.accountId, accountA);
    assert.deepEqual(loadSave(accountA, "slot-1")?.playerState.saveMeta.appliedLegacyPreparationIds, [
      "legacy.unlock.preparation.storehouse_keys"
    ]);
    assert.deepEqual(loadSave(accountA, "slot-1")?.playerState.saveMeta.appliedLegacyPreparationChoices, {
      "legacy.unlock.preparation.martial_legacy": "STR"
    });
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

test("Legacy-created new game snapshots roundtrip start resources and modifiers", () =>
  withMockWindow(() => {
    const accountId = "account.local.legacy_start_roundtrip";
    const form = createCompleteCharacterForm();
    const emptyProfile = createDefaultAccountProfileState({ accountId });
    const baseline = createNewGameSnapshot(form, accountId, {
      accountProfile: emptyProfile
    });
    let profile = grantLegacy(emptyProfile, {
      amount: 1000,
      summary: "Test grant",
      sourceType: "test",
      sourceId: "test.grant",
      recordedAt: "2026-04-20T21:00:00.000Z"
    }).profile;
    profile = purchaseRanks(profile, STARTING_HP, 3);
    profile = purchaseRanks(profile, STARTING_STAMINA, 2, 10);
    profile = purchaseRanks(profile, STARTING_COIN, 4, 20);
    saveAccountProfile(profile);

    const snapshot = createNewGameSnapshot(form, accountId, {
      accountProfile: profile,
      appliedLegacyPreparationIds: [MERCHANT_PURSE, VITAL_LEGACY],
      appliedLegacyPreparationChoices: {
        [VITAL_LEGACY]: "hp"
      }
    });
    createSave(accountId, "slot-1", snapshot, buildSaveMetadata("slot-1", snapshot));

    const loaded = loadSave(accountId, "slot-1");
    const expectedClock = createInitialClock();
    assert.ok(loaded);
    assert.equal(loaded.accountId, accountId);
    assert.deepEqual(loaded.clock, expectedClock);
    assert.equal(loaded.capturedAtTick, expectedClock.tick);
    assert.equal(loaded.playerState.saveMeta.lastRestAtTick, expectedClock.tick);
    assert.equal(loaded.playerState.saveMeta.lastSavedAtTick, expectedClock.tick);
    assert.equal(loaded.playerState.saveMeta.lastReputationDecayDay, expectedClock.day);
    assert.deepEqual(loaded.worldState.weatherState, {});
    assert.deepEqual(loaded.worldState.activeRegions, [loaded.playerState.regionId]);
    assert.deepEqual(loaded.civilizationState.settlements, []);
    assert.deepEqual(loaded.civilizationState.markets, []);
    assert.equal(loaded.civilizationState.economy.lastComputedTick, expectedClock.tick);
    assert.equal(loaded.civilizationState.transport.lastProcessedTick, expectedClock.tick);
    assert.equal(loaded.civilizationState.quests.lastGeneratedTick, expectedClock.tick);
    assert.equal(loaded.playerState.resources.hp.max, baseline.playerState.resources.hp.max + 8);
    assert.equal(loaded.playerState.resources.hp.current, loaded.playerState.resources.hp.max);
    assert.equal(
      loaded.playerState.resources.stamina.max,
      baseline.playerState.resources.stamina.max + 2
    );
    assert.equal(
      loaded.playerState.resources.stamina.current,
      loaded.playerState.resources.stamina.max
    );
    assert.equal(loaded.playerState.currency.silver, baseline.playerState.currency.silver + 6);
    assert.deepEqual(
      loaded.playerState.resourceRuntime.modifiers.map((modifier) => modifier.sourceId),
      [STARTING_HP, STARTING_STAMINA, VITAL_LEGACY]
    );

    const hpModifier = loaded.playerState.resourceRuntime.modifiers.find(
      (modifier) => modifier.sourceId === STARTING_HP
    );
    const staminaModifier = loaded.playerState.resourceRuntime.modifiers.find(
      (modifier) => modifier.sourceId === STARTING_STAMINA
    );
    const preparationModifier = loaded.playerState.resourceRuntime.modifiers.find(
      (modifier) => modifier.sourceId === VITAL_LEGACY
    );
    assert.equal(hpModifier?.label, "Starting HP");
    assert.deepEqual(hpModifier?.maxFlat, { hp: 3 });
    assert.equal(staminaModifier?.label, "Starting Stamina");
    assert.deepEqual(staminaModifier?.maxFlat, { stamina: 2 });
    assert.equal(preparationModifier?.label, "Vital Legacy");
    assert.deepEqual(preparationModifier?.maxFlat, { hp: 5 });
    assert.deepEqual(loaded.playerState.saveMeta.appliedLegacyPreparationIds, [
      MERCHANT_PURSE,
      VITAL_LEGACY
    ]);
    assert.deepEqual(loaded.playerState.saveMeta.appliedLegacyPreparationChoices, {
      [VITAL_LEGACY]: "hp"
    });
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
