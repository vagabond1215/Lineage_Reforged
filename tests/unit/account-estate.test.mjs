import test from "node:test";
import assert from "node:assert/strict";
import { demoSnapshot } from "../../apps/rpg-ui/src/runtime/demoSnapshot.ts";
import {
  createDefaultAccountProfileState,
  depositEstateFromArchivedSnapshot,
  resolveAccountRunHistorySourceId,
  resolveEstateClaimPreview,
  resolveEstateClaimPreviews
} from "../../packages/engines/game-engine/src/index.ts";

function createSnapshot() {
  const snapshot = structuredClone(demoSnapshot);
  snapshot.accountId = "account.local.estate";
  snapshot.playerState.playerId = "player.estate_source";
  snapshot.playerState.coreData.playerName = "Estate Source";
  snapshot.playerState.coreData.lineageId = "lineage.human";
  snapshot.playerState.location = {
    ...snapshot.playerState.location,
    settlementId: "settlement.aurelis"
  };
  snapshot.playerState.regionId = "region.aurelia";
  snapshot.playerState.geographicKnowledge = [
    { scope: "continent", geographyId: "continent.kaelvar", discoveredAtTick: 0 }
  ];
  snapshot.sessionState = {
    ...snapshot.sessionState,
    activityRecords: []
  };
  return snapshot;
}

function createArchivedRecord(overrides = {}) {
  return {
    characterId: "player.estate_source",
    name: "Estate Source",
    lineageId: "lineage.human",
    startingContinentId: "continent.kaelvar",
    startingRegionId: "region.aurelia",
    startingSettlementId: "settlement.aurelis",
    startedAt: "2026-04-21T10:00:00.000Z",
    endedAt: "2026-04-21T11:00:00.000Z",
    lastSeenAt: "2026-04-21T11:00:00.000Z",
    outcome: "archived",
    archiveReason: "retired",
    echoLevelReached: 5,
    notableCharacterAchievementIds: [],
    legacyGranted: 3,
    totalPlayTicks: 120,
    survivedDays: 5,
    saveSlotIds: [],
    ...overrides
  };
}

function createClaimantRecord(sourceRunId, overrides = {}) {
  return {
    characterId: "player.estate_heir",
    name: "Estate Heir",
    lineageId: "lineage.elf",
    startingContinentId: "continent.kaelvar",
    startingRegionId: "region.aurelia",
    startingSettlementId: "settlement.aurelis",
    startedAt: "2026-04-22T10:00:00.000Z",
    lastSeenAt: "2026-04-22T10:10:00.000Z",
    outcome: "active",
    echoLevelReached: 1,
    notableCharacterAchievementIds: [],
    sourceRunId,
    crossLineageStart: true,
    saveSlotIds: ["slot-1"],
    ...overrides
  };
}

test("default account estate state starts empty", () => {
  const profile = createDefaultAccountProfileState();

  assert.deepEqual(profile.estate, {
    deposits: [],
    assets: []
  });
});

test("archive estate deposit captures safe currency and stackable items by itemId", () => {
  const profile = createDefaultAccountProfileState();
  const snapshot = createSnapshot();
  const record = createArchivedRecord();

  snapshot.playerState.currency = { gold: 2, silver: 3, copper: 4 };
  snapshot.playerState.inventory = {
    bags: [
      {
        id: "bag.test",
        label: "Test Bag",
        slotCapacity: 10,
        stacks: [
          { itemId: "item.abalone_meat", itemKey: "volatile-instance-key", quantity: 2 },
          { itemId: "item.arming_sword", itemKey: "weapon-instance-key", quantity: 1 },
          { itemId: "", itemKey: "missing-id", quantity: 8 },
          { itemId: "item.acid_vial", itemKey: "volatile-acid-key", quantity: 1 }
        ]
      }
    ],
    overflow: [
      { itemId: "item.abalone_meat", itemKey: "another-instance-key", quantity: 3 }
    ]
  };

  const deposited = depositEstateFromArchivedSnapshot(
    profile,
    snapshot,
    record,
    "2026-04-21T11:05:00.000Z"
  );
  const currencyAssets = deposited.estate.assets.filter((asset) => asset.assetKind === "currency");
  const itemAssets = deposited.estate.assets.filter((asset) => asset.assetKind === "item");
  const abalone = itemAssets.find((asset) => asset.itemId === "item.abalone_meat");
  const acid = itemAssets.find((asset) => asset.itemId === "item.acid_vial");

  assert.equal(deposited.estate.deposits.length, 1);
  assert.equal(currencyAssets.length, 3);
  assert.equal(currencyAssets.find((asset) => asset.currencyKey === "gold")?.quantityDeposited, 2);
  assert.equal(abalone?.quantityDeposited, 5);
  assert.equal(abalone?.itemKey, "abalone_meat");
  assert.equal(acid?.quantityDeposited, 1);
  assert.equal(acid?.itemKey, "acid_vial");
  assert.equal(itemAssets.some((asset) => asset.itemId === "item.arming_sword"), false);
  assert.equal(itemAssets.some((asset) => asset.itemKey === "volatile-instance-key"), false);
});

test("estate deposit is idempotent per source run id", () => {
  const profile = createDefaultAccountProfileState();
  const snapshot = createSnapshot();
  const record = createArchivedRecord();

  snapshot.playerState.currency = { gold: 1, silver: 0, copper: 0 };

  const first = depositEstateFromArchivedSnapshot(
    profile,
    snapshot,
    record,
    "2026-04-21T11:05:00.000Z"
  );
  const second = depositEstateFromArchivedSnapshot(
    first,
    snapshot,
    record,
    "2026-04-21T11:06:00.000Z"
  );

  assert.equal(second.estate.deposits.length, 1);
  assert.equal(second.estate.assets.length, first.estate.assets.length);
});

test("non-archived and deleted records do not create estate deposits", () => {
  const profile = createDefaultAccountProfileState();
  const snapshot = createSnapshot();
  const retained = createArchivedRecord({
    outcome: "retired",
    archiveReason: "retired",
    inheritanceUsesRemaining: 1,
    saveSlotIds: ["slot-1"]
  });
  const deleted = createArchivedRecord({
    outcome: "deleted",
    archiveReason: undefined
  });

  assert.equal(
    depositEstateFromArchivedSnapshot(profile, snapshot, retained).estate.deposits.length,
    0
  );
  assert.equal(
    depositEstateFromArchivedSnapshot(profile, snapshot, deleted).estate.deposits.length,
    0
  );
});

test("operational asset summaries are preserved only from existing snapshot activity records", () => {
  const profile = createDefaultAccountProfileState();
  const snapshot = createSnapshot();
  const record = createArchivedRecord();

  snapshot.sessionState.activityRecords = [
    {
      id: "business.gannet_cutter",
      sectionId: "businesses",
      title: "Gannet Cutter",
      meta: "Value 120 silver",
      status: "Mothballed",
      summary: "Small harbor ferry concern.",
      tags: ["business"],
      detailEntries: []
    },
    {
      id: "job.harbor_runner",
      sectionId: "jobs",
      title: "Harbor Runner",
      summary: "Not an estate asset.",
      tags: ["job"],
      detailEntries: []
    }
  ];

  const deposited = depositEstateFromArchivedSnapshot(
    profile,
    snapshot,
    record,
    "2026-04-21T11:05:00.000Z"
  );
  const operationalAssets = deposited.estate.assets.filter(
    (asset) => asset.assetKind === "operational"
  );

  assert.equal(operationalAssets.length, 1);
  assert.equal(operationalAssets[0]?.assetId, "business.gannet_cutter");
  assert.equal(operationalAssets[0]?.assetType, "business");
  assert.equal(operationalAssets[0]?.displayName, "Gannet Cutter");
  assert.equal(operationalAssets[0]?.ownershipState, "recorded");
  assert.equal(operationalAssets[0]?.operatingState, "Mothballed");
  assert.equal(operationalAssets[0]?.storedValueSummary, "Value 120 silver");
  assert.deepEqual(operationalAssets[0]?.location, {
    settlementId: "settlement.aurelis",
    regionId: "region.aurelia",
    continentId: "continent.kaelvar"
  });
});

test("claim preview is read-only and location-gates operational estate assets", () => {
  const profile = createDefaultAccountProfileState();
  const snapshot = createSnapshot();
  const sourceRecord = createArchivedRecord();
  const sourceRunId = resolveAccountRunHistorySourceId(sourceRecord);

  snapshot.playerState.currency = { gold: 1, silver: 0, copper: 0 };
  snapshot.sessionState.activityRecords = [
    {
      id: "business.gannet_cutter",
      sectionId: "businesses",
      title: "Gannet Cutter",
      meta: "Value 120 silver",
      status: "Mothballed",
      summary: "Small harbor ferry concern.",
      tags: ["business"],
      detailEntries: []
    }
  ];

  const deposited = depositEstateFromArchivedSnapshot(
    {
      ...profile,
      history: {
        runRecords: [sourceRecord]
      }
    },
    snapshot,
    sourceRecord,
    "2026-04-21T11:05:00.000Z"
  );
  const localClaimant = createClaimantRecord(sourceRunId);
  const remoteClaimant = createClaimantRecord(sourceRunId, {
    startingSettlementId: "settlement.northwatch"
  });
  const previewProfile = {
    ...deposited,
    history: {
      runRecords: [sourceRecord, localClaimant]
    }
  };
  const localPreview = resolveEstateClaimPreview(previewProfile, localClaimant);
  const remotePreview = resolveEstateClaimPreview(previewProfile, remoteClaimant);
  const previews = resolveEstateClaimPreviews(previewProfile);
  const prePreviewClaimed = previewProfile.estate.assets.map((asset) => asset.quantityClaimed);
  const deletedSourceProfile = {
    ...previewProfile,
    history: {
      runRecords: [
        { ...sourceRecord, outcome: "deleted", archiveReason: undefined },
        localClaimant
      ]
    }
  };

  assert.equal(localPreview?.tiers.length, 3);
  assert.equal(localPreview?.tiers[0]?.label, "Small Estate Claim");
  assert.equal(localPreview?.tiers[0]?.disabledLabel, "Preview only");
  assert.equal(
    localPreview?.assets.find((asset) => asset.assetKind === "operational")?.usable,
    true
  );
  assert.equal(
    remotePreview?.assets.find((asset) => asset.assetKind === "operational")?.usable,
    false
  );
  assert.equal(
    remotePreview?.assets.find((asset) => asset.assetKind === "operational")?.lockedReason,
    "Requires settlement access"
  );
  assert.equal(previews.length, 1);
  assert.equal(resolveEstateClaimPreview(deletedSourceProfile, localClaimant), null);
  assert.deepEqual(
    previewProfile.estate.assets.map((asset) => asset.quantityClaimed),
    prePreviewClaimed
  );
  assert.equal(previewProfile.legacy.legacyPoints, 0);
});
