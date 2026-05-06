import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  createDefaultAccountProfileState,
  grantLegacy,
  purchaseLegacyUnlock,
  setLegacyPreparationChoice,
  selectLegacyPreparation,
  spendLegacy
} from "../../packages/engines/game-engine/src/index.ts";
import { demoSnapshot } from "../../apps/rpg-ui/src/runtime/demoSnapshot.ts";
import {
  buildBodyStatePresentation,
  createInitialBodyStatePresentationMemory
} from "../../apps/rpg-ui/src/runtime/bodyStatePresentation.ts";
import { createUiViewModel } from "../../apps/rpg-ui/src/runtime/uiViewModel.ts";
import { buildAccountMetaViewModel } from "../../apps/rpg-ui/src/game-shell/accountMetaPresentation.ts";
import { buildChroniclesSummary } from "../../apps/rpg-ui/src/game-shell/achievementChroniclesPresentation.ts";
import { buildLegacyLedgerSummary } from "../../apps/rpg-ui/src/game-shell/legacyLedgerPresentation.ts";
import { resolveRunHistorySourceId } from "../../apps/rpg-ui/src/game-shell/runLifecycle.ts";

function buildProfileWithTransactions() {
  let profile = createDefaultAccountProfileState({
    displayName: "Wayfarer Ledger",
    createdAt: "2026-04-17T12:00:00.000Z",
    updatedAt: "2026-04-17T12:00:00.000Z"
  });

  const steps = [
    {
      type: "grant",
      amount: 10,
      summary: "Harbor writ recorded",
      sourceId: "reward.harbor_writ",
      recordedAt: "2026-04-17T12:01:00.000Z"
    },
    {
      type: "spend",
      amount: 3,
      summary: "Claimed Brass Seal",
      sourceId: "unlock.brass_seal",
      unlockId: "legacy.unlock.brass_seal",
      recordedAt: "2026-04-17T12:02:00.000Z"
    },
    {
      type: "grant",
      amount: 7,
      summary: "Survey marks tallied",
      sourceId: "reward.survey_marks",
      recordedAt: "2026-04-17T12:03:00.000Z"
    },
    {
      type: "grant",
      amount: 2,
      summary: "Town relief remembered",
      sourceId: "reward.relief",
      recordedAt: "2026-04-17T12:04:00.000Z"
    },
    {
      type: "grant",
      amount: 1,
      summary: "Court notice entered",
      sourceId: "reward.court_notice",
      recordedAt: "2026-04-17T12:05:00.000Z"
    },
    {
      type: "spend",
      amount: 1,
      summary: "Claimed Wax Mark",
      sourceId: "unlock.wax_mark",
      recordedAt: "2026-04-17T12:06:00.000Z"
    }
  ];

  for (const step of steps) {
    if (step.type === "grant") {
      const granted = grantLegacy(profile, {
        amount: step.amount,
        summary: step.summary,
        sourceType: "test",
        sourceId: step.sourceId,
        recordedAt: step.recordedAt
      });
      assert.equal(granted.ok, true);
      profile = granted.profile;
      continue;
    }

    const spent = spendLegacy(profile, {
      amount: step.amount,
      summary: step.summary,
      sourceType: "test",
      sourceId: step.sourceId,
      recordedAt: step.recordedAt,
      ...(step.unlockId ? { unlockId: step.unlockId } : {})
    });
    assert.equal(spent.ok, true);
    profile = spent.profile;
  }

  return profile;
}

function createChronicleRecord(overrides = {}) {
  return {
    characterId: "player.chronicle",
    name: "Chronicler Vale",
    lineageId: "lineage.human",
    startingContinentId: "continent.vale",
    startingRegionId: "region.riverlands",
    startingSettlementId: "settlement.harth",
    startedAt: "2026-04-15T10:00:00.000Z",
    lastSeenAt: "2026-04-15T10:00:00.000Z",
    outcome: "active",
    echoLevelReached: 1,
    notableCharacterAchievementIds: [],
    saveSlotIds: [],
    ...overrides
  };
}

test("legacy ledger summary keeps full history but shows the five most recent transactions newest first", () => {
  const summary = buildLegacyLedgerSummary(buildProfileWithTransactions());

  assert.equal(summary.displayName, "Wayfarer Ledger");
  assert.equal(summary.currentLegacyLabel, "16");
  assert.equal(summary.lifetimeLegacyLabel, "20");
  assert.equal(summary.unlockCountLabel, "1");
  assert.equal(summary.recentTransactions.length, 5);
  assert.equal(summary.recentTransactions[0].summary, "Claimed Wax Mark");
  assert.equal(summary.recentTransactions[4].summary, "Claimed Brass Seal");
  assert.equal(summary.emptyState, null);
});

test("player-facing view models expose Growth Tier and never Legacy Growth", () => {
  const bodyStatePresentation = buildBodyStatePresentation(
    demoSnapshot,
    createInitialBodyStatePresentationMemory(),
    new Set()
  );
  const viewModel = createUiViewModel(
    demoSnapshot,
    bodyStatePresentation,
    createDefaultAccountProfileState()
  );
  const serialized = JSON.stringify(viewModel);

  assert.equal(serialized.includes("Legacy Growth"), false);
  assert.equal(serialized.includes("Growth Tier"), true);
});

test("codex sections include Deeds and Chronicles", () => {
  const bodyStatePresentation = buildBodyStatePresentation(
    demoSnapshot,
    createInitialBodyStatePresentationMemory(),
    new Set()
  );
  const viewModel = createUiViewModel(
    demoSnapshot,
    bodyStatePresentation,
    createDefaultAccountProfileState()
  );

  const labels = viewModel.codex.sections.map((section) => section.label);
  assert.ok(labels.includes("Deeds"));
  assert.ok(labels.includes("Chronicles"));
});

test("chronicles summary exposes total account achievements and empty state before unlocks", () => {
  const summary = buildChroniclesSummary(createDefaultAccountProfileState());

  assert.equal(summary.unlockedCountLabel, "0");
  assert.equal(summary.emptyState, "No chronicles have been recorded yet.");
  assert.ok(Number(summary.totalCountLabel) > 0);
});

test("account meta view model exposes real unlock catalog state and chronicle summary counts", () => {
  const profile = buildProfileWithTransactions();
  profile.history.runRecords = [
    createChronicleRecord({
      characterId: "player.active",
      name: "Aren Vale",
      lastSeenAt: "2026-04-18T10:00:00.000Z",
      outcome: "active",
      echoLevelReached: 7,
      saveSlotIds: ["slot.manual.1"]
    }),
    createChronicleRecord({
      characterId: "player.retired",
      name: "Mira Thorn",
      lineageId: "lineage.elf",
      startingContinentId: "continent.shore",
      startingRegionId: "region.lowtide",
      startingSettlementId: "settlement.tidewatch",
      startedAt: "2026-04-16T10:00:00.000Z",
      endedAt: "2026-04-17T18:00:00.000Z",
      lastSeenAt: "2026-04-17T18:00:00.000Z",
      outcome: "archived",
      archiveReason: "retired",
      echoLevelReached: 9,
      legacyGranted: 3
    }),
    createChronicleRecord({
      characterId: "player.dead",
      name: "Tern Ash",
      lineageId: "lineage.dwarf",
      startingContinentId: "continent.stone",
      startingRegionId: "region.deepmark",
      startingSettlementId: "settlement.ironrest",
      startedAt: "2026-04-15T10:00:00.000Z",
      endedAt: "2026-04-16T18:00:00.000Z",
      lastSeenAt: "2026-04-16T18:00:00.000Z",
      outcome: "archived",
      archiveReason: "dead",
      echoLevelReached: 5
    }),
    createChronicleRecord({
      characterId: "player.deleted",
      name: "Ash Reed",
      lineageId: "lineage.orc",
      startingContinentId: "continent.ashfall",
      startingRegionId: "region.charcoast",
      startingSettlementId: "settlement.brink",
      endedAt: "2026-04-15T18:00:00.000Z",
      lastSeenAt: "2026-04-15T18:00:00.000Z",
      outcome: "deleted",
      echoLevelReached: 2,
      legacyGranted: 99
    })
  ];

  const meta = buildAccountMetaViewModel(profile);

  assert.equal(meta.legacy.currentPrestigeLabel, "16");
  assert.equal(meta.legacy.lifetimePrestigeLabel, "20");
  assert.deepEqual(meta.legacy.unlockTypeTabs, [
    "All",
    "Lineage",
    "Renown",
    "Fortune",
    "Craft",
    "Destiny",
    "Chronicle",
    "Preparations"
  ]);
  assert.equal(meta.legacy.unlockEntries.some((entry) => entry.isPlaceholder), false);
  assert.equal(
    meta.legacy.unlockEntries.some((entry) => entry.id === "legacy.unlock.account.ledger_seal"),
    true
  );
  assert.equal(
    meta.legacy.unlockEntries
      .filter((entry) => entry.isKnownCatalogEntry)
      .every((entry) => entry.costLabel.length > 0 && entry.unlockClassification.length > 0),
    true
  );
  assert.equal(
    meta.legacy.unlockEntries.some((entry) => entry.state === "unlocked" || entry.state === "maxed"),
    true
  );
  assert.equal(
    meta.legacy.unlockEntries.some((entry) => entry.catalogCanPurchase),
    true
  );
  assert.equal(
    meta.legacy.unlockEntries.some(
      (entry) => entry.catalogCanPurchase && entry.purchaseButtonLabel.startsWith("Purchase")
    ),
    true
  );
  assert.equal(
    meta.legacy.unlockEntries.some(
      (entry) =>
        entry.id === "legacy.unlock.brass_seal" &&
        !entry.isKnownCatalogEntry &&
        entry.statusTagLabel === "Owned" &&
        entry.requiresLabel === "Historical unlock"
    ),
    true
  );
  assert.deepEqual(
    meta.chronicles.summaryStats.map((stat) => [stat.label, stat.valueLabel]),
    [
      ["Active", "1"],
      ["Archived", "2"],
      ["Retired", "1"],
      ["Deaths", "1"],
      ["Deleted", "1"],
      ["Total", "4"]
    ]
  );
  assert.deepEqual(meta.chronicles.filters.map((filter) => filter.label), [
    "Recent",
    "Active",
    "Archived",
    "Deaths",
    "Retired",
    "Prestige Earned"
  ]);
  assert.equal(meta.chronicles.tiles[0].title, "Aren Vale");
});

test("account meta labels live start-resource upgrades as new-character permanent upgrades", () => {
  let profile = grantLegacy(createDefaultAccountProfileState(), {
    amount: 100,
    summary: "Test grant",
    sourceType: "test",
    sourceId: "test.start_resource_visibility",
    recordedAt: "2026-04-20T12:00:00.000Z"
  }).profile;

  for (const unlockId of [
    "legacy.unlock.account.starting_hp",
    "legacy.unlock.account.starting_stamina",
    "legacy.unlock.account.starting_coin"
  ]) {
    const purchased = purchaseLegacyUnlock(
      profile,
      unlockId,
      `2026-04-20T12:${profile.legacy.legacyTransactions.length.toString().padStart(2, "0")}:00.000Z`
    );
    assert.equal(purchased.ok, true);
    profile = purchased.profile;
  }

  const meta = buildAccountMetaViewModel(profile);
  const hp = meta.legacy.unlockEntries.find(
    (entry) => entry.id === "legacy.unlock.account.starting_hp"
  );
  const stamina = meta.legacy.unlockEntries.find(
    (entry) => entry.id === "legacy.unlock.account.starting_stamina"
  );
  const coin = meta.legacy.unlockEntries.find(
    (entry) => entry.id === "legacy.unlock.account.starting_coin"
  );
  const serializedEntries = JSON.stringify(meta.legacy.unlockEntries);

  assert.equal(
    meta.legacy.characterStartNoteLabel,
    "Character-start Legacy upgrades apply when the next character is created."
  );
  assert.deepEqual(hp?.detailLabels, [
    "Rank 1 / 30",
    "Permanent account upgrade",
    "Applies to new characters"
  ]);
  assert.deepEqual(stamina?.detailLabels, [
    "Rank 1 / 30",
    "Permanent account upgrade",
    "Applies to new characters"
  ]);
  assert.deepEqual(coin?.detailLabels, [
    "Rank 1 / 20",
    "Permanent account upgrade",
    "Applies to new characters"
  ]);
  assert.equal(serializedEntries.includes("docs/design/legacy-upgrade-catalog-draft"), false);
  assert.equal(serializedEntries.includes("draft.legacy"), false);
});

test("empty account meta chronicles do not fabricate placeholder records", () => {
  const meta = buildAccountMetaViewModel(createDefaultAccountProfileState());

  assert.deepEqual(
    meta.chronicles.summaryStats.map((stat) => [stat.label, stat.valueLabel]),
    [
      ["Active", "0"],
      ["Archived", "0"],
      ["Retired", "0"],
      ["Deaths", "0"],
      ["Deleted", "0"],
      ["Total", "0"]
    ]
  );
  assert.equal(meta.chronicles.filters[0]?.emptyLabel, "No Chronicle records yet.");
  assert.deepEqual(meta.chronicles.tiles, []);
  assert.equal(meta.chronicles.estate.emptyLabel, "No estate assets deposited yet.");
  assert.deepEqual(
    meta.chronicles.estate.summaryStats.map((stat) => [stat.label, stat.valueLabel]),
    [
      ["Deposits", "0"],
      ["Assets", "0"],
      ["Currency", "0"],
      ["Items", "0"],
      ["Ops", "0"]
    ]
  );
});

test("chronicle tiles surface compact lineage cues, deed titles, and deleted-record limits", () => {
  const profile = createDefaultAccountProfileState();
  const retiredLineRecord = createChronicleRecord({
    characterId: "player.retired_line",
    name: "Selene Ward",
    lineageId: "lineage.human",
    startingContinentId: "continent.kaelvar",
    startingRegionId: "region.aurelia",
    startingSettlementId: "settlement.aurelis",
    endedAt: "2026-04-18T12:00:00.000Z",
    lastSeenAt: "2026-04-18T12:00:00.000Z",
    outcome: "retired",
    archiveReason: "retired",
    echoLevelReached: 6,
    inheritanceUsesRemaining: 2
  });
  profile.history.runRecords = [
    retiredLineRecord,
    createChronicleRecord({
      characterId: "player.child_line",
      name: "Liora Ward",
      lineageId: "lineage.elf",
      startingContinentId: "continent.kaelvar",
      startingRegionId: "region.aurelia",
      startingSettlementId: "settlement.aurelis",
      startedAt: "2026-04-18T13:00:00.000Z",
      lastSeenAt: "2026-04-18T13:30:00.000Z",
      outcome: "active",
      echoLevelReached: 3,
      sourceRunId: resolveRunHistorySourceId(retiredLineRecord),
      crossLineageStart: true
    }),
    createChronicleRecord({
      characterId: "player.stale_child",
      name: "Orin Branch",
      lineageId: "lineage.human",
      startedAt: "2026-04-18T12:30:00.000Z",
      lastSeenAt: "2026-04-18T12:45:00.000Z",
      outcome: "active",
      echoLevelReached: 1,
      sourceRunId: "player.missing_source::2026-04-01T00:00:00.000Z"
    }),
    createChronicleRecord({
      characterId: "player.archived_hero",
      name: "Mira Thorn",
      lineageId: "lineage.elf",
      startingContinentId: "continent.shore",
      startingRegionId: "region.lowtide",
      startingSettlementId: "settlement.tidewatch",
      startedAt: "2026-04-16T10:00:00.000Z",
      endedAt: "2026-04-17T18:00:00.000Z",
      lastSeenAt: "2026-04-17T18:00:00.000Z",
      outcome: "archived",
      archiveReason: "retired",
      echoLevelReached: 9,
      legacyGranted: 3,
      survivedDays: 15,
      totalPlayTicks: 360,
      notableCharacterAchievementIds: [
        "achievement.character.first_blooded",
        "achievement.character.road_worn",
        "achievement.character.keen_eye"
      ]
    }),
    createChronicleRecord({
      characterId: "player.deleted_record",
      name: "Ash Reed",
      lineageId: "lineage.orc",
      startingContinentId: "continent.ashfall",
      startingRegionId: "region.charcoast",
      startingSettlementId: "settlement.brink",
      endedAt: "2026-04-16T18:00:00.000Z",
      lastSeenAt: "2026-04-16T18:00:00.000Z",
      outcome: "deleted",
      echoLevelReached: 2,
      legacyGranted: 99
    })
  ];

  const meta = buildAccountMetaViewModel(profile);
  const archivedHero = meta.chronicles.tiles.find((tile) => tile.id === "player.archived_hero");
  const retiredLine = meta.chronicles.tiles.find((tile) => tile.id === "player.retired_line");
  const childLine = meta.chronicles.tiles.find((tile) => tile.id === "player.child_line");
  const staleChild = meta.chronicles.tiles.find((tile) => tile.id === "player.stale_child");
  const deletedRecord = meta.chronicles.tiles.find((tile) => tile.id === "player.deleted_record");

  assert.equal(archivedHero?.lineageLabel, "Elf");
  assert.equal(archivedHero?.originLabel, "Tidewatch / Lowtide");
  assert.equal(archivedHero?.statusTagLabel, "Retired");
  assert.equal(archivedHero?.echoPeakLabel, "Echo 9");
  assert.equal(archivedHero?.prestigeEarnedLabel, "+3 Prestige");
  assert.equal(archivedHero?.durationLabel, "15 days");
  assert.deepEqual(archivedHero?.deedLabels, ["First Blooded", "Road-Worn"]);
  assert.equal(archivedHero?.moreDeedsLabel, "+1 more");
  assert.deepEqual(archivedHero?.lineageCueLabels, []);
  assert.equal(archivedHero?.authorityNoteLabel, null);
  assert.equal(archivedHero?.filterIds.includes("archived"), true);
  assert.equal(archivedHero?.filterIds.includes("retired"), true);
  assert.equal(archivedHero?.filterIds.includes("prestige-earned"), true);

  assert.equal(retiredLine?.statusTagLabel, "Retired");
  assert.deepEqual(retiredLine?.lineageCueLabels, ["Source Line", "Founded from this line"]);
  assert.equal(retiredLine?.filterIds.includes("retired"), true);
  assert.equal(retiredLine?.filterIds.includes("archived"), false);

  assert.equal(childLine?.statusTagLabel, "Active");
  assert.deepEqual(childLine?.lineageCueLabels, ["Descended from Selene Ward"]);
  assert.deepEqual(staleChild?.lineageCueLabels, []);

  assert.equal(deletedRecord?.statusTagLabel, "Deleted");
  assert.equal(deletedRecord?.authorityNoteLabel, "Non-authoritative record");
  assert.deepEqual(deletedRecord?.filterIds, ["recent"]);
  assert.equal(deletedRecord?.prestigeEarnedLabel, "+99 Prestige");
});

test("account meta estate summary exposes read-only claim previews and location locks", () => {
  const profile = createDefaultAccountProfileState();
  const sourceRecord = createChronicleRecord({
    characterId: "player.source_line",
    name: "Selene Ward",
    lineageId: "lineage.human",
    startedAt: "2026-04-18T10:00:00.000Z",
    endedAt: "2026-04-18T12:00:00.000Z",
    lastSeenAt: "2026-04-18T12:00:00.000Z",
    outcome: "archived",
    archiveReason: "retired",
    echoLevelReached: 6,
    legacyGranted: 4
  });
  const sourceRunId = resolveRunHistorySourceId(sourceRecord);
  profile.history.runRecords = [
    sourceRecord,
    createChronicleRecord({
      characterId: "player.local_heir",
      name: "Liora Ward",
      startedAt: "2026-04-19T10:00:00.000Z",
      lastSeenAt: "2026-04-19T10:30:00.000Z",
      outcome: "active",
      sourceRunId
    }),
    createChronicleRecord({
      characterId: "player.remote_heir",
      name: "Orin Branch",
      startingSettlementId: "settlement.northwatch",
      startedAt: "2026-04-19T09:00:00.000Z",
      lastSeenAt: "2026-04-19T09:30:00.000Z",
      outcome: "active",
      sourceRunId
    })
  ];
  profile.estate = {
    deposits: [
      {
        depositId: "estate.deposit.source_line",
        sourceRunId,
        sourceCharacterId: "player.source_line",
        sourceName: "Selene Ward",
        archiveReason: "retired",
        depositedAt: "2026-04-18T12:00:00.000Z"
      }
    ],
    assets: [
      {
        estateAssetId: "estate.asset.source_line.currency.gold",
        sourceRunId,
        depositedAt: "2026-04-18T12:00:00.000Z",
        assetKind: "currency",
        quantityClaimed: 0,
        currencyKey: "gold",
        quantityDeposited: 10
      },
      {
        estateAssetId: "estate.asset.source_line.business.gannet_cutter",
        sourceRunId,
        depositedAt: "2026-04-18T12:00:00.000Z",
        assetKind: "operational",
        quantityClaimed: 0,
        assetId: "business.gannet_cutter",
        assetType: "business",
        displayName: "Gannet Cutter",
        location: {
          settlementId: "settlement.harth",
          regionId: "region.riverlands",
          continentId: "continent.vale"
        },
        ownershipState: "recorded",
        operatingState: "Mothballed",
        storedValueSummary: "Value 120 silver"
      }
    ]
  };

  const meta = buildAccountMetaViewModel(profile);

  assert.deepEqual(
    meta.chronicles.estate.summaryStats.map((stat) => [stat.label, stat.valueLabel]),
    [
      ["Deposits", "1"],
      ["Assets", "2"],
      ["Currency", "1"],
      ["Items", "0"],
      ["Ops", "1"]
    ]
  );
  assert.deepEqual(
    meta.chronicles.estate.claimTiers.map((tier) => [
      tier.label,
      tier.accessLabel,
      tier.costLabel,
      tier.stateLabel
    ]),
    [
      ["Small Estate Claim", "10% access", "1 Prestige", "Preview only"],
      ["Medium Estate Claim", "25% access", "3 Prestige", "Preview only"],
      ["Major Estate Claim", "50% access", "8 Prestige", "Preview only"]
    ]
  );
  assert.equal(meta.chronicles.estate.emptyLabel, null);
  assert.equal(
    meta.chronicles.estate.previewRows.some(
      (row) =>
        row.title === "Gannet Cutter" &&
        row.statusLabel === "Usable preview" &&
        row.lockedReasonLabel === null
    ),
    true
  );
  assert.equal(
    meta.chronicles.estate.previewRows.some(
      (row) =>
        row.title === "Gannet Cutter" &&
        row.statusLabel === "Locked" &&
        row.lockedReasonLabel === "Requires settlement access"
    ),
    true
  );
  assert.equal(
    meta.chronicles.estate.previewRows.every((row) => row.sourceLabel === "From Selene Ward"),
    true
  );
});

test("account meta view model reflects purchased Legacy unlock state from refreshed profile", () => {
  const granted = grantLegacy(createDefaultAccountProfileState(), {
    amount: 5,
    summary: "Test grant",
    sourceType: "test",
    sourceId: "test.grant",
    recordedAt: "2026-04-20T12:00:00.000Z"
  });
  assert.equal(granted.ok, true);

  const before = buildAccountMetaViewModel(granted.profile);
  const beforeEntry = before.legacy.unlockEntries.find(
    (entry) => entry.id === "legacy.unlock.account.ledger_seal"
  );
  assert.equal(beforeEntry?.catalogCanPurchase, true);

  const purchased = purchaseLegacyUnlock(
    granted.profile,
    "legacy.unlock.account.ledger_seal",
    "2026-04-20T12:01:00.000Z"
  );
  assert.equal(purchased.ok, true);

  const after = buildAccountMetaViewModel(purchased.profile);
  const afterEntry = after.legacy.unlockEntries.find(
    (entry) => entry.id === "legacy.unlock.account.ledger_seal"
  );

  assert.equal(after.legacy.currentPrestigeLabel, "4");
  assert.equal(afterEntry?.state, "maxed");
  assert.equal(afterEntry?.catalogCanPurchase, false);
  assert.equal(afterEntry?.statusTagLabel, "Owned");
  assert.equal(afterEntry?.costLabel, "Owned");
});

test("account meta view model exposes preparation capacity and selection state", () => {
  let profile = grantLegacy(createDefaultAccountProfileState(), {
    amount: 100,
    summary: "Test grant",
    sourceType: "test",
    sourceId: "test.preparation_grant",
    recordedAt: "2026-04-20T18:00:00.000Z"
  }).profile;

  for (const unlockId of [
    "legacy.unlock.lineage.prepared_lineage",
    "legacy.unlock.lineage.prepared_lineage",
    "legacy.unlock.preparation.storehouse_keys",
    "legacy.unlock.preparation.merchant_purse",
    "legacy.unlock.preparation.martial_legacy"
  ]) {
    const purchased = purchaseLegacyUnlock(
      profile,
      unlockId,
      `2026-04-20T18:${profile.legacy.legacyTransactions.length.toString().padStart(2, "0")}:00.000Z`
    );
    assert.equal(purchased.ok, true);
    profile = purchased.profile;
  }

  const selected = selectLegacyPreparation(
    profile,
    "legacy.unlock.preparation.storehouse_keys"
  );
  assert.equal(selected.ok, true);
  profile = selected.profile;

  const meta = buildAccountMetaViewModel(profile);
  const storehouse = meta.legacy.unlockEntries.find(
    (entry) => entry.id === "legacy.unlock.preparation.storehouse_keys"
  );
  const merchant = meta.legacy.unlockEntries.find(
    (entry) => entry.id === "legacy.unlock.preparation.merchant_purse"
  );
  const martial = meta.legacy.unlockEntries.find(
    (entry) => entry.id === "legacy.unlock.preparation.martial_legacy"
  );

  assert.equal(meta.legacy.preparationCapacityLabel, "1 / 2 selected");
  assert.equal(storehouse?.statusTagLabel, "Selected");
  assert.deepEqual(storehouse?.detailLabels, [
    "Selected preparation",
    "Applies to next character"
  ]);
  assert.equal(storehouse?.canRemovePreparation, true);
  assert.equal(storehouse?.canSelectPreparation, false);
  assert.deepEqual(merchant?.detailLabels, [
    "Preparation option",
    "Select for next character"
  ]);
  assert.equal(merchant?.canSelectPreparation, true);
  assert.equal(merchant?.canRemovePreparation, false);
  assert.equal(martial?.requiresLabel, "Choose one");
  assert.equal(martial?.canSelectPreparation, false);
  assert.deepEqual(
    martial?.preparationChoiceOptions.map((option) => option.label),
    ["STR", "DEX", "AGI", "CON"]
  );
});

test("account meta view model reflects finalized grouped-choice selections", () => {
  let profile = grantLegacy(createDefaultAccountProfileState(), {
    amount: 100,
    summary: "Test grant",
    sourceType: "test",
    sourceId: "test.choice_prep",
    recordedAt: "2026-04-20T18:30:00.000Z"
  }).profile;

  for (const unlockId of [
    "legacy.unlock.lineage.prepared_lineage",
    "legacy.unlock.lineage.prepared_lineage",
    "legacy.unlock.preparation.martial_legacy"
  ]) {
    const purchased = purchaseLegacyUnlock(
      profile,
      unlockId,
      `2026-04-20T18:${profile.legacy.legacyTransactions.length.toString().padStart(2, "0")}:00.000Z`
    );
    assert.equal(purchased.ok, true);
    profile = purchased.profile;
  }

  const selected = setLegacyPreparationChoice(
    profile,
    "legacy.unlock.preparation.martial_legacy",
    "AGI"
  );
  assert.equal(selected.ok, true);

  const meta = buildAccountMetaViewModel(selected.profile);
  const martial = meta.legacy.unlockEntries.find(
    (entry) => entry.id === "legacy.unlock.preparation.martial_legacy"
  );

  assert.equal(martial?.statusTagLabel, "Selected");
  assert.equal(martial?.selectedPreparationChoiceId, "AGI");
  assert.equal(
    martial?.preparationChoiceOptions.find((option) => option.id === "AGI")?.isSelected,
    true
  );
});

test("launcher shell owns account meta navigation and exposes compact legacy and chronicle copy", () => {
  const appShellSource = readFileSync(
    new URL("../../apps/rpg-ui/src/game-shell/components/AppShell.tsx", import.meta.url),
    "utf8"
  );
  const mainMenuSource = readFileSync(
    new URL("../../apps/rpg-ui/src/game-shell/components/MainMenuScreen.tsx", import.meta.url),
    "utf8"
  );
  const gameShellStateSource = readFileSync(
    new URL("../../apps/rpg-ui/src/game-shell/state.ts", import.meta.url),
    "utf8"
  );
  const indexCssSource = readFileSync(
    new URL("../../apps/rpg-ui/src/index.css", import.meta.url),
    "utf8"
  );
  const accountMetaSource = readFileSync(
    new URL("../../apps/rpg-ui/src/game-shell/components/AccountMetaPanel.tsx", import.meta.url),
    "utf8"
  );
  const characterCreationSource = readFileSync(
    new URL(
      "../../apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx",
      import.meta.url
    ),
    "utf8"
  );
  const characterCreationFormSource = readFileSync(
    new URL("../../apps/rpg-ui/src/game-shell/characterCreationForm.ts", import.meta.url),
    "utf8"
  );
  const newGameSnapshotSource = readFileSync(
    new URL("../../apps/rpg-ui/src/game-shell/newGameSnapshot.ts", import.meta.url),
    "utf8"
  );
  const appSource = readFileSync(
    new URL("../../apps/rpg-ui/src/App.tsx", import.meta.url),
    "utf8"
  );
  const settingsSource = readFileSync(
    new URL("../../apps/rpg-ui/src/game-shell/components/SettingsScreen.tsx", import.meta.url),
    "utf8"
  );
  const topStatusBarSource = readFileSync(
    new URL("../../apps/rpg-ui/src/components/TopStatusBar.tsx", import.meta.url),
    "utf8"
  );
  const progressBarSource = readFileSync(
    new URL("../../apps/rpg-ui/src/components/ui/ProgressBar.tsx", import.meta.url),
    "utf8"
  );
  const uiViewModelSource = readFileSync(
    new URL("../../apps/rpg-ui/src/runtime/uiViewModel.ts", import.meta.url),
    "utf8"
  );
  const indexHtmlSource = readFileSync(
    new URL("../../apps/rpg-ui/index.html", import.meta.url),
    "utf8"
  );
  const legacyBrandPattern = new RegExp("Cata" + "clysm");

  assert.match(appShellSource, /export function AppShell/);
  assert.match(appShellSource, /export function TopBar/);
  assert.match(appShellSource, /export function SidebarNav/);
  assert.match(appShellSource, /export function ShellSubBar/);
  assert.match(appShellSource, /export function ShellContent/);
  assert.match(appShellSource, /relative z-30/);
  assert.match(appShellSource, /relative z-10/);
  assert.match(appShellSource, /var\(--color-surface-elevated\)/);
  assert.match(appShellSource, /gap-3 overflow-x-auto p-4 md:flex-col md:gap-0 md:overflow-visible md:p-0/);
  assert.match(appShellSource, /aria-current=\{item\.active \? 'page' : undefined\}/);
  assert.match(appShellSource, /launcher-sidebar-button min-w-\[10rem\] rounded-lg border px-4 py-4 text-left transition/);
  assert.match(appShellSource, /md:min-h-\[4\.25rem\] md:min-w-0 md:w-full md:rounded-none md:border-x-0 md:border-t-0 md:first:border-t md:px-5 md:py-3/);
  assert.match(appShellSource, /\? 'is-active border-\[color:var\(--color-border-soft\)\] text-\[color:var\(--color-text-primary\)\]'/);
  assert.match(appShellSource, /: 'border-\[color:var\(--color-border-soft\)\] text-\[color:var\(--color-text-secondary\)\]'/);
  assert.match(appShellSource, /truncate text-\[1\.75rem\] font-light leading-tight tracking-\[0\.08em\]/);
  assert.match(indexCssSource, /--font-display: "Arial Nova", Arial, "Segoe UI", sans-serif/);
  assert.match(indexCssSource, /--font-body: "Arial Nova", Arial, "Segoe UI", sans-serif/);
  assert.match(gameShellStateSource, /MANUAL_SAVE_SLOT_COUNT = 128/);
  assert.match(gameShellStateSource, /MANUAL_SAVE_SLOTS_PER_PAGE = 16/);
  assert.match(mainMenuSource, /AppShell/);
  assert.match(mainMenuSource, /SidebarNav/);
  assert.match(mainMenuSource, /LauncherSectionId = 'characters' \| AccountMetaSectionId/);
  assert.match(mainMenuSource, /activeSection === 'characters'/);
  assert.match(mainMenuSource, /Characters/);
  assert.match(mainMenuSource, /label: 'Settings'/);
  assert.match(mainMenuSource, /AccountMetaPanel/);
  assert.match(mainMenuSource, /centerActions=\{/);
  assert.doesNotMatch(mainMenuSource, /New Character/);
  assert.doesNotMatch(mainMenuSource, /onNewCharacter:/);
  assert.match(mainMenuSource, /rounded-md border text-base font-semibold transition/);
  assert.match(mainMenuSource, /formatSlotNumberLabel\(slot\.id\)/);
  assert.match(mainMenuSource, /getSaveSlotLabel\(slotId\)\.replace/);
  assert.match(mainMenuSource, /formatOrdinalDay\(day: number\)/);
  assert.match(mainMenuSource, /lastTwoDigits >= 11 && lastTwoDigits <= 13/);
  assert.match(mainMenuSource, /formatInGameDateLabel\(inGameDate: string \| null\)/);
  assert.match(mainMenuSource, /of \$\{monthLabel\}, Year \$\{yearValue\}/);
  assert.match(mainMenuSource, /formatCharacterSummaryLine\(slot: SaveSlotSummary\)/);
  assert.match(
    mainMenuSource,
    /return `\$\{levelLabel\} \$\{sexLabel\} \$\{lineageLabel\} \$\{roleLabel\} in \$\{locationLabel\} with \$\{fundsLabel\}`/
  );
  assert.match(mainMenuSource, /slot\.playerName/);
  assert.match(mainMenuSource, /text-\[2rem\] font-light leading-tight tracking-\[0\.08em\] text-\[color:var\(--color-text-primary\)\]/);
  assert.match(mainMenuSource, /formatSlotHeaderTimestamp\(slot\.lastSavedAt\)/);
  assert.match(mainMenuSource, /slot\.playtimeLabel \?\? '0 ticks played'/);
  assert.match(mainMenuSource, /formatInGameDateLabel\(slot\.inGameDate\)/);
  assert.match(mainMenuSource, /formatCharacterSummaryLine\(slot\)/);
  assert.match(mainMenuSource, /min-h-\[4\.5rem\]/);
  assert.match(mainMenuSource, /text-\[2rem\]/);
  assert.match(mainMenuSource, /text-\[1\.125rem\]/);
  assert.match(mainMenuSource, /text-\[1rem\]/);
  assert.match(mainMenuSource, /Empty/);
  assert.match(mainMenuSource, /opacity-45/);
  assert.match(mainMenuSource, /hover:opacity-70/);
  assert.match(mainMenuSource, /tracking-\[0\.15em\]/);
  assert.match(mainMenuSource, /fontFamily: 'var\(--font-display\)'/);
  assert.match(mainMenuSource, /text-\[color:var\(--color-text-muted\)\]/);
  assert.match(mainMenuSource, /text-rose-600/);
  assert.match(mainMenuSource, /Icon name="trash" className="h-10 w-10"/);
  assert.doesNotMatch(mainMenuSource, /Available for a new character in this slot\./);
  assert.doesNotMatch(
    mainMenuSource,
    /Select this row or use New Character to start the existing creation flow\./
  );
  assert.match(mainMenuSource, /opacity-45/);
  assert.match(mainMenuSource, /grid-cols-\[4\.25rem_minmax\(0,1fr\)_4\.25rem\]/);
  assert.match(mainMenuSource, /grid-cols-\[4\.25rem_minmax\(0,1fr\)\]/);
  assert.match(mainMenuSource, /border-l border-\[color:var\(--color-border-soft\)\]/);
  assert.match(mainMenuSource, /justify-end gap-2/);
  assert.match(
    mainMenuSource,
    /md:grid-cols-\[minmax\(0,1\.05fr\)_minmax\(0,0\.9fr\)_minmax\(0,1\.5fr\)\]/
  );
  assert.match(mainMenuSource, /continueLabel/);
  assert.match(mainMenuSource, /formatPossessiveName/);
  assert.doesNotMatch(mainMenuSource, /Start your Legacy/);
  assert.match(mainMenuSource, /slot\.kind === 'manual'/);
  assert.doesNotMatch(mainMenuSource, /slot\.kind === 'manual' && slot\.hasSave/);
  assert.doesNotMatch(mainMenuSource, /disabled=\{!hasContinueSave\}/);
  assert.match(mainMenuSource, />\s*Empty\s*</);
  assert.doesNotMatch(mainMenuSource, /\{slot\.label\}/);
  assert.match(mainMenuSource, /accountProfile\.displayName/);
  assert.match(mainMenuSource, /accountMenuOpen/);
  assert.doesNotMatch(mainMenuSource, /primaryActions=\{/);
  assert.match(mainMenuSource, /Log Out/);
  assert.doesNotMatch(mainMenuSource, /onToggleThemeMode/);
  assert.doesNotMatch(mainMenuSource, /Open settings/);
  assert.doesNotMatch(mainMenuSource, /Signed In/);
  assert.match(mainMenuSource, /activeSection=\{activeSection\}/);
  assert.match(mainMenuSource, /onPurchaseLegacyUnlock/);
  assert.match(mainMenuSource, /onPurchaseUnlock=\{onPurchaseLegacyUnlock\}/);
  assert.match(mainMenuSource, /onSelectLegacyPreparation/);
  assert.match(mainMenuSource, /onSetLegacyPreparationChoice/);
  assert.match(mainMenuSource, /onRemoveLegacyPreparation/);
  assert.match(mainMenuSource, /onSelectPreparation=\{onSelectLegacyPreparation\}/);
  assert.match(mainMenuSource, /onSetPreparationChoice=\{onSetLegacyPreparationChoice\}/);
  assert.match(mainMenuSource, /onRemovePreparation=\{onRemoveLegacyPreparation\}/);
  assert.match(mainMenuSource, /showSectionNav=\{false\}/);
  assert.match(mainMenuSource, /frameless/);
  assert.doesNotMatch(mainMenuSource, /rounded-\[30px\]/);
  assert.doesNotMatch(mainMenuSource, /<Card accent="var\(--color-world\)">/);
  assert.match(settingsSource, /AppShell/);
  assert.match(settingsSource, /SidebarNav/);
  assert.match(settingsSource, /centerActions=\{/);
  assert.match(settingsSource, /accountControls=\{/);
  assert.match(settingsSource, /onContinue/);
  assert.match(settingsSource, /onExit/);
  assert.match(settingsSource, /Start your Legacy/);
  assert.doesNotMatch(settingsSource, /ScreenFrame/);
  assert.match(settingsSource, /Appearance/);
  assert.match(settingsSource, /Timezone/);
  assert.match(settingsSource, /FALLBACK_TIME_ZONE_IDS/);
  assert.match(settingsSource, /supportedValuesOf/);
  assert.match(settingsSource, /buildTimeZoneOptions/);
  assert.match(settingsSource, /clockNow: Date/);
  assert.match(settingsSource, /formatTimeZoneCurrentTime\(normalized, date, hourFormat\)/);
  assert.match(settingsSource, /offsetOptions/);
  assert.match(settingsSource, /formatGmtOffset/);
  assert.doesNotMatch(settingsSource, /replace\(\/_\/g/);
  assert.match(settingsSource, /<select/);
  assert.doesNotMatch(settingsSource, /datalist/);
  assert.match(settingsSource, /HOUR_FORMAT_OPTIONS/);
  assert.match(settingsSource, /\{option\} hr/);
  assert.match(settingsSource, /Log Out/);
  assert.match(settingsSource, /Reset Account/);
  assert.match(settingsSource, /Delete Account/);
  assert.match(settingsSource, /onResetAccount/);
  assert.match(settingsSource, /onDeleteAccount/);
  assert.match(settingsSource, /Resetting your account will delete all character data, Prestige, and achievements/);
  assert.match(settingsSource, /onOpenLauncherSection\('characters'\)/);
  assert.match(settingsSource, /onOpenLauncherSection\('legacy'\)/);
  assert.match(settingsSource, /onOpenLauncherSection\('chronicles'\)/);
  assert.doesNotMatch(settingsSource, /LegacyLedgerCard/);
  assert.doesNotMatch(settingsSource, /ChroniclesCard/);
  assert.doesNotMatch(settingsSource, /Launcher Notes/);
  assert.doesNotMatch(settingsSource, /Legacy ledger/);
  assert.doesNotMatch(settingsSource, /Save Reset/);
  assert.doesNotMatch(settingsSource, /Reset Save Data/);
  assert.doesNotMatch(settingsSource, /<Card/);
  assert.match(mainMenuSource, /Echoes of Legacy/);
  assert.match(settingsSource, /Echoes of Legacy/);
  assert.match(indexCssSource, /--color-surface-base:/);
  assert.match(indexCssSource, /--color-action-primary:/);
  assert.match(indexCssSource, /--color-progress-active:/);
  assert.match(indexCssSource, /--color-hp-fill:/);
  assert.match(indexCssSource, /--color-prestige-accent:/);
  assert.match(indexCssSource, /--color-shell-bar-bg:/);
  assert.doesNotMatch(mainMenuSource, /title="Launcher"/);
  assert.doesNotMatch(mainMenuSource, /Campaign slots, account records, and launcher controls/);
  assert.doesNotMatch(mainMenuSource, legacyBrandPattern);
  assert.doesNotMatch(settingsSource, legacyBrandPattern);
  assert.match(indexHtmlSource, /Echoes of Legacy RPG UI/);
  assert.doesNotMatch(indexHtmlSource, legacyBrandPattern);
  assert.match(accountMetaSource, /activeSection\?: AccountMetaSectionId/);
  assert.match(accountMetaSource, /showSectionNav\?: boolean/);
  assert.match(accountMetaSource, /frameless\?: boolean/);
  assert.match(accountMetaSource, /showSectionNav = true/);
  assert.match(accountMetaSource, /frameless = false/);
  assert.match(accountMetaSource, /Legacy/);
  assert.match(accountMetaSource, /Chronicles/);
  assert.match(accountMetaSource, /Current Prestige/);
  assert.match(accountMetaSource, /Lifetime Prestige/);
  assert.match(accountMetaSource, /onPurchaseUnlock\?: \(\(unlockId: string\) => void\) \| undefined/);
  assert.match(accountMetaSource, /onSelectPreparation\?: \(\(unlockId: string\) => void\) \| undefined/);
  assert.match(accountMetaSource, /onSetPreparationChoice\?: \(\(unlockId: string, choiceId: string\) => void\) \| undefined/);
  assert.match(accountMetaSource, /onRemovePreparation\?: \(\(unlockId: string\) => void\) \| undefined/);
  assert.match(accountMetaSource, /entry\.catalogCanPurchase && onPurchaseUnlock/);
  assert.match(accountMetaSource, /entry\.canSelectPreparation && onSelectPreparation/);
  assert.match(accountMetaSource, /entry\.canRemovePreparation && onRemovePreparation/);
  assert.match(accountMetaSource, /entry\.preparationChoiceOptions\.length > 0/);
  assert.match(accountMetaSource, /onSetPreparationChoice\?\.\(entry\.id, option\.id\)/);
  assert.match(accountMetaSource, /meta\.legacy\.preparationCapacityLabel/);
  assert.match(accountMetaSource, />\s*Select\s*</);
  assert.match(accountMetaSource, />\s*Remove\s*</);
  assert.match(accountMetaSource, /entry\.purchaseButtonLabel/);
  assert.match(accountMetaSource, /statusTagLabel/);
  assert.match(accountMetaSource, /requiresLabel/);
  assert.match(accountMetaSource, /ChronicleTileCard/);
  assert.match(accountMetaSource, /EstatePreviewPanel/);
  assert.match(accountMetaSource, /Estate Claims/);
  assert.match(accountMetaSource, /Preview/);
  assert.match(accountMetaSource, /selectedChronicleFilter/);
  assert.match(accountMetaSource, /filteredChronicleTiles/);
  assert.match(accountMetaSource, /lineageCueLabels\.map/);
  assert.doesNotMatch(accountMetaSource, /Claim Estate/);
  assert.doesNotMatch(accountMetaSource, /Withdraw Estate/);
  assert.doesNotMatch(accountMetaSource, /Purchase wiring pending/);
  assert.doesNotMatch(accountMetaSource, /Heirs/);
  assert.match(accountMetaSource, /Prestige Cost/);
  assert.match(accountMetaSource, /Requires:/);
  assert.match(accountMetaSource, /Geographic Renown/);
  assert.match(accountMetaSource, /<details/);
  assert.match(accountMetaSource, /var\(--color-action-primary\)/);
  assert.match(accountMetaSource, /var\(--color-prestige-accent\)/);
  assert.match(accountMetaSource, /var\(--color-echo-accent\)/);
  assert.doesNotMatch(accountMetaSource, /text-slate-950/);
  assert.doesNotMatch(accountMetaSource, /Progress:/);
  assert.doesNotMatch(accountMetaSource, /Status:/);
  assert.doesNotMatch(accountMetaSource, /Future Hook/);
  assert.match(appSource, /purchaseLegacyUnlock/);
  assert.match(appSource, /resolveLegacyPreparationSelection/);
  assert.match(appSource, /setLegacyPreparationChoice/);
  assert.match(appSource, /selectLegacyPreparation/);
  assert.match(appSource, /removeLegacyPreparation/);
  assert.match(appSource, /consumeSelectedLegacyPreparations/);
  assert.match(appSource, /resolveEligibleHeirSources/);
  assert.match(appSource, /resolveHeirSourceById/);
  assert.match(appSource, /consumeRetiredRunInheritanceUse/);
  assert.match(appSource, /Lineage Source Unavailable/);
  assert.match(appSource, /appliedLegacyPreparationIds: preparationSelection\.selectedUnlockIds/);
  assert.match(appSource, /appliedLegacyPreparationChoices: preparationSelection\.selectedChoicePayloads/);
  assert.match(appSource, /sourceRunId: selectedSourceRunId/);
  assert.match(appSource, /selectedHeirSource\.lineageId !== state\.form\.lineageId/);
  assert.match(appSource, /crossLineageStart: true/);
  assert.match(characterCreationFormSource, /sourceRunId: string/);
  assert.match(characterCreationFormSource, /sourceRunId: ""/);
  assert.match(characterCreationSource, /eligibleHeirSources\?: AccountRunHistoryRecord\[\]/);
  assert.match(characterCreationSource, /Lineage Start/);
  assert.match(characterCreationSource, /Fresh Start/);
  assert.match(characterCreationSource, /Heir Start/);
  assert.match(characterCreationSource, /Source Line/);
  assert.match(characterCreationSource, /overflow-x-auto pb-1/);
  assert.match(characterCreationSource, /w-10 shrink-0 justify-center px-0/);
  assert.match(
    characterCreationSource,
    /min-w-\[7\.75rem\] flex-1 justify-center gap-2 px-3/
  );
  assert.match(
    characterCreationSource,
    /const showReviewSummaryDetails = currentStepId === 'review' && preview\.isResolved/
  );
  assert.match(
    characterCreationSource,
    /grid-cols-\[repeat\(auto-fit,minmax\(2\.5rem,1fr\)\)\]/
  );
  assert.match(characterCreationSource, /summaryContextRows/);
  assert.match(characterCreationSource, /var\(--color-progress-active\)/);
  assert.match(characterCreationSource, /var\(--color-action-primary\)/);
  assert.match(characterCreationSource, /var\(--color-shell-bar-bg\)/);
  assert.doesNotMatch(characterCreationSource, /AppShell/);
  assert.doesNotMatch(characterCreationSource, /SidebarNav/);
  assert.doesNotMatch(
    characterCreationSource,
    /xl:grid-cols-\[144px_minmax\(0,1fr\)_204px\]/
  );
  assert.doesNotMatch(characterCreationSource, /sticky top-20 flex flex-col items-start gap-1/);
  assert.doesNotMatch(characterCreationSource, /grid-cols-9/);
  assert.match(topStatusBarSource, /var\(--color-shell-bar-bg\)/);
  assert.match(topStatusBarSource, /var\(--color-surface-overlay\)/);
  assert.match(topStatusBarSource, /var\(--color-action-danger\)/);
  assert.match(topStatusBarSource, /overflow-x-auto pb-1/);
  assert.doesNotMatch(topStatusBarSource, /trackedQuestDetail/);
  assert.doesNotMatch(topStatusBarSource, /Icon name="coin"/);
  assert.doesNotMatch(topStatusBarSource, /activeQuestLabel/);
  assert.match(progressBarSource, /min-w-\[138px\]/);
  assert.match(progressBarSource, /text-\[10px\]/);
  assert.match(progressBarSource, /var\(--color-surface-muted\)/);
  assert.doesNotMatch(progressBarSource, /pointer-events-none absolute inset-0 flex items-center justify-center/);
  assert.match(uiViewModelSource, /var\(--color-hp-fill\)/);
  assert.match(uiViewModelSource, /var\(--color-mp-fill\)/);
  assert.match(uiViewModelSource, /var\(--color-stamina-fill\)/);
  assert.doesNotMatch(uiViewModelSource, /trackedQuest: trackedQuest\?\.title/);
  assert.doesNotMatch(uiViewModelSource, /activityTag/);
  assert.doesNotMatch(uiViewModelSource, /renownLabel/);
  assert.match(indexCssSource, /background-position: calc\(100% - 7rem\) bottom;/);
  assert.match(indexCssSource, /background-position: center bottom;/);
  assert.doesNotMatch(indexCssSource, /background-size: auto 100%;/);
  assert.match(characterCreationSource, /art\?\.backgroundPosition \?\? 'center bottom'/);
  assert.match(characterCreationSource, /art\?\.selectedBackgroundPosition \?\? 'right bottom'/);
  assert.match(newGameSnapshotSource, /fillCoreResourcesToMax\(resolution\.resources\)/);
  assert.match(newGameSnapshotSource, /fillCoreResourcesToMax\(resources\.resources\)/);
  assert.match(appSource, /persistProfile: false/);
  assert.match(newGameSnapshotSource, /appliedLegacyPreparationIds\?: string\[\]/);
  assert.match(newGameSnapshotSource, /appliedLegacyPreparationChoices\?: Record<string, string>/);
  assert.match(newGameSnapshotSource, /sourceRunId\?: string/);
  assert.match(newGameSnapshotSource, /crossLineageStart\?: boolean/);
  assert.match(newGameSnapshotSource, /saveMeta: \{/);
  assert.match(newGameSnapshotSource, /appliedLegacyPreparationIds/);
  assert.match(newGameSnapshotSource, /appliedLegacyPreparationChoices/);
  assert.match(newGameSnapshotSource, /sourceRunId && options\.crossLineageStart/);
  assert.match(appSource, /saveAccountProfile\(purchased\.profile\)/);
  assert.match(appSource, /accountProfile: savedProfile/);
  assert.match(appSource, /Legacy Purchased/);
  assert.doesNotMatch(appSource, /onNewCharacter=\{\(\) =>/);
});
