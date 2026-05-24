import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createDefaultAccountProfileState } from "../../packages/engines/game-engine/src/index.ts";
import {
  buildChronicleRunEndSummaryViewModel
} from "../../apps/rpg-ui/src/game-shell/chronicleRunEndSummaryPresentation.ts";
import { resolveRunHistorySourceId } from "../../apps/rpg-ui/src/game-shell/runLifecycle.ts";

function createRun(overrides = {}) {
  return {
    characterId: "player.arden_voss",
    name: "Arden Voss",
    lineageId: "lineage.human",
    startingContinentId: "continent.kaelvar",
    startingRegionId: "region.aurelia",
    startingSettlementId: "settlement.aurelis",
    startedAt: "2026-04-17T12:00:00.000Z",
    lastSeenAt: "2026-04-17T13:00:00.000Z",
    outcome: "active",
    echoLevelReached: 3,
    notableCharacterAchievementIds: [],
    saveSlotIds: ["slot-1"],
    ...overrides
  };
}

function createPayoutBreakdown(overrides = {}) {
  return {
    progressionDepth: 6,
    notableDeeds: 2,
    survivalDepth: 4,
    milestoneQuality: 1,
    archiveReasonModifier: 1,
    challengeModifier: 1,
    shallowRunModifier: 0,
    repeatedWeakRunModifier: 0,
    rawScore: 13,
    modifiedScore: 13,
    finalAmount: 13,
    ...overrides
  };
}

function createProfile({ runRecords = [], deposits = [], assets = [] } = {}) {
  return {
    ...createDefaultAccountProfileState({
      accountId: "account.local.chronicle_run_end_summary",
      displayName: "Chronicle Summary"
    }),
    history: {
      runRecords
    },
    estate: {
      deposits,
      assets
    }
  };
}

function buildViewModel(runRecord, options = {}) {
  const runRecords = options.runRecords ?? (runRecord ? [runRecord] : []);

  return buildChronicleRunEndSummaryViewModel({
    accountProfile: createProfile({
      runRecords,
      deposits: options.deposits ?? [],
      assets: options.assets ?? []
    }),
    runRecord,
    lifecycleResult: options.lifecycleResult ?? null
  });
}

function findRow(rows, id) {
  return rows.find((row) => row.id === id) ?? null;
}

function assertNoActions(viewModel) {
  assert.deepEqual(viewModel.actionIds, []);
}

test("missing runRecord returns safe missing-record summary with warnings and no actions", () => {
  const viewModel = buildViewModel(null);

  assert.equal(viewModel.title, "Run record unavailable");
  assert.equal(viewModel.statusTone, "missing");
  assert.deepEqual(viewModel.warningLabels, ["Run record unavailable."]);
  assert.deepEqual(viewModel.identityRows, []);
  assert.deepEqual(viewModel.payoutRows, []);
  assertNoActions(viewModel);
});

test("active records render non-terminal context without claiming payout resolution", () => {
  const viewModel = buildViewModel(createRun());

  assert.equal(viewModel.outcomeLabel, "Active Run");
  assert.equal(viewModel.statusTone, "active");
  assert.equal(findRow(viewModel.payoutRows, "payout-state")?.valueLabel, "Not resolved");
  assert.equal(findRow(viewModel.payoutRows, "payout-resolved-at"), null);
  assert.equal(findRow(viewModel.payoutRows, "legacy-granted"), null);
  assert.ok(viewModel.warningLabels.includes("Active records are not terminal run-end summaries."));
  assertNoActions(viewModel);
});

test("retained retired records render retirement, retained slots, inheritance count, and no estate claim", () => {
  const retired = createRun({
    outcome: "retired",
    archiveReason: "retired",
    endedAt: "2026-04-18T12:00:00.000Z",
    inheritanceUsesRemaining: 2,
    saveSlotIds: ["slot-retained"]
  });
  const viewModel = buildViewModel(retired, {
    lifecycleResult: {
      retainedSlotIds: ["slot-retained"],
      inheritanceUsesRemaining: 2
    }
  });

  assert.equal(viewModel.outcomeLabel, "Retired");
  assert.equal(findRow(viewModel.slotRows, "retained-slots")?.valueLabel, "1");
  assert.equal(findRow(viewModel.continuityRows, "inheritance-uses")?.valueLabel, "2 remaining");
  assert.deepEqual(viewModel.estateRows, []);
  assertNoActions(viewModel);
});

test("archived death records render death outcome, survival, Echo, deeds, and stored payout rows", () => {
  const archived = createRun({
    outcome: "archived",
    archiveReason: "dead",
    endedAt: "2026-04-20T12:00:00.000Z",
    echoLevelReached: 8,
    notableCharacterAchievementIds: ["achievement.character.first_blooded"],
    legacyPayoutBaseline: { echoLevel: 2 },
    legacyGranted: 13,
    payoutEligible: true,
    payoutBreakdown: createPayoutBreakdown(),
    legacyPayoutResolvedAt: "2026-04-20T12:05:00.000Z",
    legacyPayoutTransactionId: "legacy.transaction.death.1",
    totalPlayTicks: 288,
    survivedDays: 12
  });
  const viewModel = buildViewModel(archived);

  assert.equal(viewModel.outcomeLabel, "Death");
  assert.equal(viewModel.statusTone, "death");
  assert.equal(findRow(viewModel.survivalRows, "survived-days")?.valueLabel, "12");
  assert.equal(findRow(viewModel.progressionRows, "echo-peak")?.valueLabel, "8");
  assert.equal(viewModel.deedRows[0]?.valueLabel, "First Blooded");
  assert.equal(findRow(viewModel.payoutRows, "legacy-granted")?.valueLabel, "13");
  assert.equal(findRow(viewModel.payoutRows, "payout-breakdown-finalAmount")?.valueLabel, "13");
  assertNoActions(viewModel);
});

test("hardcore death records render a distinct hardcore death label", () => {
  const viewModel = buildViewModel(
    createRun({
      outcome: "archived",
      archiveReason: "hardcore_dead",
      endedAt: "2026-04-20T12:00:00.000Z"
    })
  );

  assert.equal(viewModel.outcomeLabel, "Hardcore Death");
  assert.equal(viewModel.statusTone, "hardcore_death");
});

test("deleted records render non-authoritative warnings and no payout, estate, or action claims", () => {
  const deleted = createRun({
    outcome: "deleted",
    legacyGranted: 99,
    payoutEligible: true,
    payoutBreakdown: createPayoutBreakdown({ finalAmount: 99 })
  });
  const sourceRunId = resolveRunHistorySourceId(deleted);
  const viewModel = buildViewModel(deleted, {
    deposits: [
      {
        depositId: "estate.deposit.deleted",
        sourceRunId,
        sourceCharacterId: deleted.characterId,
        sourceName: deleted.name,
        archiveReason: "dead",
        depositedAt: "2026-04-20T12:05:00.000Z"
      }
    ],
    assets: [
      {
        estateAssetId: "estate.asset.deleted.gold",
        sourceRunId,
        depositedAt: "2026-04-20T12:05:00.000Z",
        assetKind: "currency",
        quantityClaimed: 0,
        currencyKey: "gold",
        quantityDeposited: 5
      }
    ]
  });

  assert.equal(viewModel.statusTone, "deleted");
  assert.ok(viewModel.warningLabels.includes("Deleted records are non-authoritative."));
  assert.deepEqual(viewModel.payoutRows, []);
  assert.deepEqual(viewModel.estateRows, []);
  assertNoActions(viewModel);
});

test("stored payout metadata is displayed without importing or calling the payout resolver", () => {
  const source = readFileSync(
    "apps/rpg-ui/src/game-shell/chronicleRunEndSummaryPresentation.ts",
    "utf8"
  );
  const archived = createRun({
    outcome: "archived",
    archiveReason: "retired",
    legacyGranted: 4,
    payoutEligible: true,
    payoutBreakdown: createPayoutBreakdown({ finalAmount: 4 }),
    legacyPayoutResolvedAt: "2026-04-20T12:05:00.000Z"
  });
  const viewModel = buildViewModel(archived);

  assert.equal(source.includes("resolveRunLegacyPayout"), false);
  assert.equal(findRow(viewModel.payoutRows, "legacy-granted")?.valueLabel, "4");
  assert.equal(findRow(viewModel.payoutRows, "payout-resolved-at")?.valueLabel, "2026-04-20");
});

test("contradictory payout fixtures display stored values instead of recomputing", () => {
  const archived = createRun({
    outcome: "archived",
    archiveReason: "retired",
    echoLevelReached: 1,
    legacyPayoutBaseline: { echoLevel: 99 },
    legacyGranted: 91,
    payoutEligible: true,
    payoutBreakdown: createPayoutBreakdown({ finalAmount: 3 })
  });
  const viewModel = buildViewModel(archived);

  assert.equal(findRow(viewModel.payoutRows, "legacy-granted")?.valueLabel, "91");
  assert.equal(findRow(viewModel.payoutRows, "payout-breakdown-finalAmount")?.valueLabel, "3");
  assert.ok(
    viewModel.warningLabels.includes(
      "Stored Legacy award differs from stored payout breakdown final amount."
    )
  );
});

test("known achievement ids resolve titles and unknown ids use conservative fallback labels", () => {
  const viewModel = buildViewModel(
    createRun({
      outcome: "archived",
      archiveReason: "retired",
      notableCharacterAchievementIds: [
        "achievement.character.first_blooded",
        "achievement.character.unlisted_deed"
      ]
    })
  );

  assert.deepEqual(
    viewModel.deedRows.map((row) => row.valueLabel),
    ["First Blooded", "Unlisted Deed"]
  );
  assert.equal(
    viewModel.deedRows[1]?.detailLabel,
    "Achievement id is not present in the current catalog."
  );
});

test("missing optional family, location, and duration fields produce safe labels", () => {
  const viewModel = buildViewModel(
    createRun({
      lineageId: "lineage.human",
      startingRegionId: "",
      startingSettlementId: "",
      endedAt: undefined,
      totalPlayTicks: undefined,
      survivedDays: undefined
    })
  );

  assert.equal(findRow(viewModel.identityRows, "family"), null);
  assert.equal(findRow(viewModel.originRows, "region")?.valueLabel, "Unknown Region");
  assert.equal(findRow(viewModel.originRows, "settlement")?.valueLabel, "Unknown Settlement");
  assert.equal(findRow(viewModel.survivalRows, "ended-at")?.valueLabel, "Unavailable");
  assert.equal(findRow(viewModel.survivalRows, "survived-days")?.valueLabel, "Unavailable");
  assert.equal(findRow(viewModel.survivalRows, "play-ticks")?.valueLabel, "Unavailable");
});

test("lineageId is never treated as familyId", () => {
  const viewModel = buildViewModel(
    createRun({
      lineageId: "family.voss"
    })
  );

  assert.equal(findRow(viewModel.identityRows, "lineage")?.valueLabel, "Voss");
  assert.equal(findRow(viewModel.identityRows, "family"), null);
  assert.equal(findRow(viewModel.continuityRows, "explicit-family"), null);
});

test("sourceRunId can display source context without creating parent-child copy", () => {
  const source = createRun({
    characterId: "player.source",
    name: "Source Vale",
    startedAt: "2026-04-10T12:00:00.000Z",
    outcome: "archived",
    archiveReason: "retired"
  });
  const child = createRun({
    characterId: "player.child",
    name: "Child Vale",
    sourceRunId: resolveRunHistorySourceId(source)
  });
  const viewModel = buildViewModel(child, {
    runRecords: [source, child]
  });

  assert.equal(findRow(viewModel.continuityRows, "source-run")?.valueLabel, "Source Vale");
  assert.equal(findRow(viewModel.continuityRows, "explicit-parent"), null);
  assert.match(findRow(viewModel.continuityRows, "source-run")?.detailLabel ?? "", /does not create parent/);
});

test("estate rows read only stored deposits and assets matching the run source id", () => {
  const archived = createRun({
    outcome: "archived",
    archiveReason: "dead",
    endedAt: "2026-04-20T12:00:00.000Z"
  });
  const sourceRunId = resolveRunHistorySourceId(archived);
  const viewModel = buildViewModel(archived, {
    deposits: [
      {
        depositId: "estate.deposit.matching",
        sourceRunId,
        sourceCharacterId: archived.characterId,
        sourceName: "Arden Estate",
        archiveReason: "dead",
        depositedAt: "2026-04-20T12:05:00.000Z"
      },
      {
        depositId: "estate.deposit.other",
        sourceRunId: "other-source",
        sourceCharacterId: "player.other",
        sourceName: "Other Estate",
        archiveReason: "dead",
        depositedAt: "2026-04-20T12:05:00.000Z"
      }
    ],
    assets: [
      {
        estateAssetId: "estate.asset.matching.gold",
        sourceRunId,
        depositedAt: "2026-04-20T12:05:00.000Z",
        assetKind: "currency",
        quantityClaimed: 0,
        currencyKey: "gold",
        quantityDeposited: 7
      },
      {
        estateAssetId: "estate.asset.other.silver",
        sourceRunId: "other-source",
        depositedAt: "2026-04-20T12:05:00.000Z",
        assetKind: "currency",
        quantityClaimed: 0,
        currencyKey: "silver",
        quantityDeposited: 9
      }
    ]
  });

  assert.equal(findRow(viewModel.estateRows, "estate-source")?.valueLabel, "Arden Estate");
  assert.equal(findRow(viewModel.estateRows, "estate-assets")?.valueLabel, "1");
  assert.ok(viewModel.estateRows.some((row) => row.valueLabel.includes("7 Gold")));
  assert.equal(JSON.stringify(viewModel).includes("Other Estate"), false);
  assert.equal(JSON.stringify(viewModel).includes("9 Silver"), false);
});

test("estate rows never expose claim, transfer, bequest, or heirloom actions", () => {
  const archived = createRun({
    outcome: "archived",
    archiveReason: "dead"
  });
  const sourceRunId = resolveRunHistorySourceId(archived);
  const viewModel = buildViewModel(archived, {
    assets: [
      {
        estateAssetId: "estate.asset.matching.tool",
        sourceRunId,
        depositedAt: "2026-04-20T12:05:00.000Z",
        assetKind: "item",
        quantityClaimed: 0,
        itemId: "item.small_tool",
        quantityDeposited: 1
      }
    ]
  });
  const actionLikeIds = viewModel.estateRows
    .map((row) => row.id.toLowerCase())
    .filter((id) => /claim|transfer|bequest|heirloom/.test(id));

  assert.deepEqual(actionLikeIds, []);
  assertNoActions(viewModel);
});

test("lifecycle clearedSlotIds and retainedSlotIds produce read-only slot impact rows only", () => {
  const viewModel = buildViewModel(createRun(), {
    lifecycleResult: {
      clearedSlotIds: ["slot-a", "slot-b"],
      retainedSlotIds: ["slot-c"]
    }
  });

  assert.equal(findRow(viewModel.slotRows, "cleared-slots")?.valueLabel, "2");
  assert.equal(findRow(viewModel.slotRows, "retained-slots")?.valueLabel, "1");
  assert.match(findRow(viewModel.slotRows, "cleared-slots")?.detailLabel ?? "", /Read-only/);
  assert.match(findRow(viewModel.slotRows, "retained-slots")?.detailLabel ?? "", /Read-only/);
  assertNoActions(viewModel);
});

test("actionIds is always empty", () => {
  const archived = createRun({
    outcome: "archived",
    archiveReason: "retired"
  });

  for (const viewModel of [
    buildViewModel(null),
    buildViewModel(createRun()),
    buildViewModel(archived),
    buildViewModel(createRun({ outcome: "deleted" }))
  ]) {
    assertNoActions(viewModel);
  }
});

test("projection does not represent deferred Chronicle, Bloodlines, or mutation systems", () => {
  const archived = createRun({
    outcome: "archived",
    archiveReason: "dead",
    legacyGranted: 2,
    payoutEligible: true,
    payoutBreakdown: createPayoutBreakdown({ finalAmount: 2 })
  });
  const viewModel = buildViewModel(archived);
  const serialized = JSON.stringify(viewModel);

  assert.equal(serialized.includes("Chronicle Mark"), false);
  assert.equal(serialized.includes("Lineage Seal"), false);
  assert.equal(serialized.includes("Family Prestige"), false);
  assert.equal(serialized.includes("Bloodlines"), false);
  assert.equal(serialized.includes("estate delivery"), false);
  assertNoActions(viewModel);
});
