import itemCatalog from "../../../content/base/items/items.json" with { type: "json" };
import type {
  AccountEstateAssetRecord,
  AccountEstateCurrencyKey,
  AccountEstateOperationalAssetType,
  AccountEstateState,
  AccountProfileState,
  AccountRunHistoryRecord,
  EstateAssetLocationState,
  InventoryStack,
  PanelRecordState,
  SaveSnapshot
} from "../../../shared/types/src/index.js";

type ItemCatalogRecord = {
  id: string;
  itemKey?: string;
  itemClass?: string;
  marketable?: boolean;
};

export type EstateClaimTierId = "small" | "medium" | "major";

export type EstateClaimTierPreview = {
  tierId: EstateClaimTierId;
  label: string;
  accessPercent: number;
  prestigeCost: number;
  requirementLabel: string | null;
  disabledLabel: string;
};

export type EstateClaimAssetPreview = {
  estateAssetId: string;
  title: string;
  detailLabel: string;
  assetKind: AccountEstateAssetRecord["assetKind"];
  usable: boolean;
  lockedReason: string | null;
};

export type EstateClaimPreview = {
  claimantRunId: string;
  sourceRunId: string;
  sourceName: string | null;
  tiers: EstateClaimTierPreview[];
  assets: EstateClaimAssetPreview[];
};

const SAFE_ITEM_CLASSES = new Set(["commodity", "consumable"]);
const OPERATIONAL_SECTION_TYPES: Record<string, AccountEstateOperationalAssetType> = {
  businesses: "business"
};
const OPERATIONAL_ID_PREFIX_TYPES: Record<string, AccountEstateOperationalAssetType> = {
  "business.": "business",
  "workshop.": "workshop",
  "property.": "property",
  "holding.": "holding"
};
const ESTATE_CLAIM_TIERS: EstateClaimTierPreview[] = [
  {
    tierId: "small",
    label: "Small Estate Claim",
    accessPercent: 10,
    prestigeCost: 1,
    requirementLabel: null,
    disabledLabel: "Preview only"
  },
  {
    tierId: "medium",
    label: "Medium Estate Claim",
    accessPercent: 25,
    prestigeCost: 3,
    requirementLabel: "Inheritance Threads I",
    disabledLabel: "Preview only"
  },
  {
    tierId: "major",
    label: "Major Estate Claim",
    accessPercent: 50,
    prestigeCost: 8,
    requirementLabel: "Inheritance Threads II",
    disabledLabel: "Preview only"
  }
];

const itemDefinitionsById = new Map<string, ItemCatalogRecord>(
  (itemCatalog as { records?: ItemCatalogRecord[] }).records
    ?.filter((record) => typeof record.id === "string")
    .map((record) => [record.id, record]) ?? []
);

export function createDefaultAccountEstateState(): AccountEstateState {
  return {
    deposits: [],
    assets: []
  };
}

export function resolveAccountRunHistorySourceId(record: AccountRunHistoryRecord): string {
  return `${record.characterId}::${record.startedAt}`;
}

function sanitizeIdSegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "unknown";
}

function normalizePositiveInteger(value: number): number {
  return Math.max(0, Math.trunc(value));
}

function createEstateAssetId(sourceRunId: string, suffix: string): string {
  return `estate.asset.${sanitizeIdSegment(sourceRunId)}.${sanitizeIdSegment(suffix)}`;
}

function createEstateDepositId(sourceRunId: string): string {
  return `estate.deposit.${sanitizeIdSegment(sourceRunId)}`;
}

function isSafeEstateItem(stack: InventoryStack): ItemCatalogRecord | null {
  const itemId = stack.itemId.trim();

  if (!itemId || normalizePositiveInteger(stack.quantity) <= 0) {
    return null;
  }

  const definition = itemDefinitionsById.get(itemId);

  if (!definition || !SAFE_ITEM_CLASSES.has(definition.itemClass ?? "")) {
    return null;
  }

  return definition;
}

function collectCurrencyAssets(
  snapshot: SaveSnapshot,
  sourceRunId: string,
  depositedAt: string
): AccountEstateAssetRecord[] {
  const currencyKeys: AccountEstateCurrencyKey[] = ["gold", "silver", "copper"];

  return currencyKeys.flatMap((currencyKey) => {
    const quantityDeposited = normalizePositiveInteger(snapshot.playerState.currency[currencyKey]);

    if (quantityDeposited <= 0) {
      return [];
    }

    return [
      {
        estateAssetId: createEstateAssetId(sourceRunId, `currency.${currencyKey}`),
        sourceRunId,
        depositedAt,
        assetKind: "currency" as const,
        quantityClaimed: 0,
        currencyKey,
        quantityDeposited
      }
    ];
  });
}

function collectInventoryStacks(snapshot: SaveSnapshot): InventoryStack[] {
  return [
    ...snapshot.playerState.inventory.bags.flatMap((bag) => bag.stacks),
    ...snapshot.playerState.inventory.overflow
  ];
}

function collectItemAssets(
  snapshot: SaveSnapshot,
  sourceRunId: string,
  depositedAt: string
): AccountEstateAssetRecord[] {
  const itemTotals = new Map<string, { quantity: number; itemKey?: string }>();

  for (const stack of collectInventoryStacks(snapshot)) {
    const definition = isSafeEstateItem(stack);

    if (!definition) {
      continue;
    }

    const itemId = stack.itemId.trim();
    const existing = itemTotals.get(itemId);
    const nextQuantity = (existing?.quantity ?? 0) + normalizePositiveInteger(stack.quantity);
    itemTotals.set(itemId, {
      quantity: nextQuantity,
      ...(definition.itemKey ? { itemKey: definition.itemKey } : {})
    });
  }

  return [...itemTotals.entries()].map(([itemId, item]) => ({
    estateAssetId: createEstateAssetId(sourceRunId, `item.${itemId}`),
    sourceRunId,
    depositedAt,
    assetKind: "item" as const,
    quantityClaimed: 0,
    itemId,
    ...(item.itemKey ? { itemKey: item.itemKey } : {}),
    quantityDeposited: item.quantity
  }));
}

function resolveSnapshotContinentId(snapshot: SaveSnapshot): string | undefined {
  return snapshot.playerState.geographicKnowledge.find((entry) => entry.scope === "continent")
    ?.geographyId;
}

function buildSnapshotLocation(snapshot: SaveSnapshot): EstateAssetLocationState {
  return {
    ...(snapshot.playerState.location.settlementId
      ? { settlementId: snapshot.playerState.location.settlementId }
      : {}),
    ...(snapshot.playerState.regionId ? { regionId: snapshot.playerState.regionId } : {}),
    ...(resolveSnapshotContinentId(snapshot)
      ? { continentId: resolveSnapshotContinentId(snapshot) }
      : {})
  };
}

function resolveOperationalAssetType(
  record: PanelRecordState
): AccountEstateOperationalAssetType | null {
  const sectionType = OPERATIONAL_SECTION_TYPES[record.sectionId];

  if (sectionType) {
    return sectionType;
  }

  for (const [prefix, assetType] of Object.entries(OPERATIONAL_ID_PREFIX_TYPES)) {
    if (record.id.startsWith(prefix)) {
      return assetType;
    }
  }

  return null;
}

function collectOperationalAssets(
  snapshot: SaveSnapshot,
  sourceRunId: string,
  depositedAt: string
): AccountEstateAssetRecord[] {
  const location = buildSnapshotLocation(snapshot);

  return snapshot.sessionState.activityRecords.flatMap((record) => {
    const assetType = resolveOperationalAssetType(record);

    if (!assetType || !record.id.trim() || !record.title.trim()) {
      return [];
    }

    return [
      {
        estateAssetId: createEstateAssetId(sourceRunId, `operational.${record.id}`),
        sourceRunId,
        depositedAt,
        assetKind: "operational" as const,
        quantityClaimed: 0,
        assetId: record.id,
        assetType,
        displayName: record.title,
        location,
        ownershipState: "recorded",
        ...(record.status ? { operatingState: record.status } : {}),
        ...(record.meta ? { storedValueSummary: record.meta } : {})
      }
    ];
  });
}

function dedupeEstateAssets(assets: AccountEstateAssetRecord[]): AccountEstateAssetRecord[] {
  const seen = new Set<string>();
  const deduped: AccountEstateAssetRecord[] = [];

  for (const asset of assets) {
    if (seen.has(asset.estateAssetId)) {
      continue;
    }

    seen.add(asset.estateAssetId);
    deduped.push(asset);
  }

  return deduped;
}

export function depositEstateFromArchivedSnapshot(
  profile: AccountProfileState,
  snapshot: SaveSnapshot,
  record: AccountRunHistoryRecord,
  depositedAt = new Date().toISOString()
): AccountProfileState {
  if (record.outcome !== "archived" || !record.archiveReason) {
    return profile;
  }

  const estate = profile.estate ?? createDefaultAccountEstateState();
  const sourceRunId = resolveAccountRunHistorySourceId(record);

  if (estate.deposits.some((deposit) => deposit.sourceRunId === sourceRunId)) {
    return profile;
  }

  const deposit = {
    depositId: createEstateDepositId(sourceRunId),
    sourceRunId,
    sourceCharacterId: record.characterId,
    sourceName: record.name,
    archiveReason: record.archiveReason,
    depositedAt
  };
  const assets = dedupeEstateAssets([
    ...collectCurrencyAssets(snapshot, sourceRunId, depositedAt),
    ...collectItemAssets(snapshot, sourceRunId, depositedAt),
    ...collectOperationalAssets(snapshot, sourceRunId, depositedAt)
  ]);
  const existingAssetIds = new Set(estate.assets.map((asset) => asset.estateAssetId));

  return {
    ...profile,
    updatedAt: depositedAt,
    estate: {
      deposits: [...estate.deposits, deposit],
      assets: [
        ...estate.assets,
        ...assets.filter((asset) => !existingAssetIds.has(asset.estateAssetId))
      ]
    }
  };
}

function formatHumanId(value: string | undefined): string {
  if (!value) {
    return "Unknown";
  }

  const lastSegment = value.split(".").at(-1) ?? value;
  return lastSegment
    .split("_")
    .filter(Boolean)
    .map((segment) => segment[0]!.toUpperCase() + segment.slice(1))
    .join(" ");
}

function formatAssetDetail(asset: AccountEstateAssetRecord): string {
  if (asset.assetKind === "currency") {
    return `${asset.quantityDeposited ?? 0} ${formatHumanId(asset.currencyKey)}`;
  }

  if (asset.assetKind === "item") {
    return `${asset.quantityDeposited ?? 0} ${formatHumanId(asset.itemId)}`;
  }

  return asset.storedValueSummary ?? asset.operatingState ?? "Operational summary";
}

function formatAssetTitle(asset: AccountEstateAssetRecord): string {
  if (asset.assetKind === "currency") {
    return formatHumanId(asset.currencyKey);
  }

  if (asset.assetKind === "item") {
    return formatHumanId(asset.itemId);
  }

  return asset.displayName ?? formatHumanId(asset.assetId);
}

function resolveOperationalLockReason(
  asset: AccountEstateAssetRecord,
  claimantRecord: AccountRunHistoryRecord
): string | null {
  if (asset.assetKind !== "operational") {
    return null;
  }

  const location = asset.location;

  if (!location) {
    return "Remote management not unlocked";
  }

  if (location.settlementId) {
    return claimantRecord.startingSettlementId === location.settlementId
      ? null
      : "Requires settlement access";
  }

  if (location.regionId) {
    return claimantRecord.startingRegionId === location.regionId
      ? null
      : "Requires local start";
  }

  if (location.continentId) {
    return claimantRecord.startingContinentId === location.continentId
      ? null
      : "Requires local start";
  }

  return "Remote management not unlocked";
}

export function resolveEstateClaimPreview(
  profile: AccountProfileState,
  claimantRecord: AccountRunHistoryRecord
): EstateClaimPreview | null {
  const sourceRunId = claimantRecord.sourceRunId?.trim();

  if (!sourceRunId || claimantRecord.outcome === "deleted") {
    return null;
  }

  const estate = profile.estate ?? createDefaultAccountEstateState();
  const sourceRecord = profile.history.runRecords.find(
    (record) => resolveAccountRunHistorySourceId(record) === sourceRunId
  );

  if (!sourceRecord || sourceRecord.outcome === "deleted") {
    return null;
  }

  const assets = estate.assets.filter((asset) => asset.sourceRunId === sourceRunId);

  if (assets.length === 0) {
    return null;
  }

  const sourceDeposit = estate.deposits.find((deposit) => deposit.sourceRunId === sourceRunId);

  return {
    claimantRunId: claimantRecord.characterId,
    sourceRunId,
    sourceName: sourceDeposit?.sourceName ?? null,
    tiers: ESTATE_CLAIM_TIERS.map((tier) => ({ ...tier })),
    assets: assets.map((asset) => {
      const lockedReason = resolveOperationalLockReason(asset, claimantRecord);

      return {
        estateAssetId: asset.estateAssetId,
        title: formatAssetTitle(asset),
        detailLabel: formatAssetDetail(asset),
        assetKind: asset.assetKind,
        usable: lockedReason === null,
        lockedReason
      };
    })
  };
}

export function resolveEstateClaimTiers(): EstateClaimTierPreview[] {
  return ESTATE_CLAIM_TIERS.map((tier) => ({ ...tier }));
}

export function resolveEstateClaimPreviews(profile: AccountProfileState): EstateClaimPreview[] {
  return profile.history.runRecords.flatMap((record) => {
    const preview = resolveEstateClaimPreview(profile, record);
    return preview ? [preview] : [];
  });
}
