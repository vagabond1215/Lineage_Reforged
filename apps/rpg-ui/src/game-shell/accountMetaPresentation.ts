import type {
  AccountProfileState,
  AccountRunHistoryRecord,
  LegacyRenownTier
} from "../../../../packages/shared/types/src/index.js";
import { getAchievementDefinitionById } from "../../../../packages/engines/game-engine/src/achievements.js";
import {
  resolveEstateClaimPreviews,
  resolveEstateClaimTiers
} from "../../../../packages/engines/game-engine/src/account-estate.js";
import {
  getLegacyPreparationChoiceOptions,
  isLegacyPreparationChoiceRequired,
  resolveLegacyPreparationSelection,
  resolveLegacyUnlockStates
} from "../../../../packages/engines/game-engine/src/legacy-unlocks.js";
import {
  isRunDeleted,
  isRunLineageAuthoritative,
  resolveRunHistorySourceId
} from "./runLifecycle.js";

export type AccountMetaSectionId = "legacy" | "chronicles";
export type LegacyUnlockStateFilter = "All" | "Locked" | "Unlocked";

export type LegacyUnlockEntryViewModel = {
  id: string;
  title: string;
  description: string;
  type: string;
  unlockClassification: "permanent" | "tiered_permanent" | "preparation";
  costLabel: string;
  statusTagLabel: string | null;
  requiresLabel: string | null;
  purchaseButtonLabel: string;
  purchaseBlockedReason: string | null;
  state: "locked" | "unlocked" | "maxed";
  currentRank: number;
  maxRank: number;
  renownTier: LegacyRenownTier | null;
  renownDepth: number;
  isPlaceholder: boolean;
  isKnownCatalogEntry: boolean;
  catalogCanPurchase: boolean;
  isPreparation: boolean;
  isChoicePreparation: boolean;
  isSelectedPreparation: boolean;
  selectedPreparationChoiceId: string | null;
  preparationChoiceOptions: Array<{
    id: string;
    label: string;
    isSelected: boolean;
    disabled: boolean;
  }>;
  canSelectPreparation: boolean;
  canRemovePreparation: boolean;
  preparationBlockedReason: string | null;
};

export type LegacyMetaViewModel = {
  currentPrestigeLabel: string;
  lifetimePrestigeLabel: string;
  preparationCapacityLabel: string;
  unlockTypeTabs: string[];
  unlockEntries: LegacyUnlockEntryViewModel[];
};

export type ChronicleSummaryStatViewModel = {
  label: "Active" | "Archived" | "Retired" | "Deaths" | "Deleted" | "Total";
  valueLabel: string;
};

export type ChronicleFilterId =
  | "recent"
  | "active"
  | "archived"
  | "deaths"
  | "retired"
  | "prestige-earned";

export type ChronicleFilterViewModel = {
  id: ChronicleFilterId;
  label: string;
  emptyLabel: string;
};

export type ChronicleTileViewModel = {
  id: string;
  title: string;
  lineageLabel: string;
  originLabel: string;
  statusTagLabel: string;
  echoPeakLabel: string;
  prestigeEarnedLabel: string | null;
  durationLabel: string | null;
  deedLabels: string[];
  moreDeedsLabel: string | null;
  lineageCueLabels: string[];
  authorityNoteLabel: string | null;
  filterIds: ChronicleFilterId[];
  isDeleted: boolean;
  isPlaceholder: boolean;
};

export type ChronicleEstateSummaryStatViewModel = {
  label: "Deposits" | "Assets" | "Currency" | "Items" | "Ops";
  valueLabel: string;
};

export type ChronicleEstateClaimTierViewModel = {
  id: string;
  label: string;
  accessLabel: string;
  costLabel: string;
  requirementLabel: string | null;
  stateLabel: string;
};

export type ChronicleEstatePreviewRowViewModel = {
  id: string;
  title: string;
  detailLabel: string;
  sourceLabel: string;
  claimantLabel: string | null;
  statusLabel: string;
  lockedReasonLabel: string | null;
  isLocked: boolean;
};

export type ChronicleEstateViewModel = {
  summaryStats: ChronicleEstateSummaryStatViewModel[];
  claimTiers: ChronicleEstateClaimTierViewModel[];
  previewRows: ChronicleEstatePreviewRowViewModel[];
  emptyLabel: string | null;
  overflowLabel: string | null;
  noteLabel: string;
};

export type ChroniclesMetaViewModel = {
  summaryStats: ChronicleSummaryStatViewModel[];
  filters: ChronicleFilterViewModel[];
  tiles: ChronicleTileViewModel[];
  estate: ChronicleEstateViewModel;
};

export type AccountMetaViewModel = {
  legacy: LegacyMetaViewModel;
  chronicles: ChroniclesMetaViewModel;
};

const FALLBACK_UNLOCK_TYPES = [
  "Lineage",
  "Renown",
  "Fortune",
  "Craft",
  "Destiny",
  "Chronicle",
  "Preparations"
];

const CHRONICLE_FILTERS: ChronicleFilterViewModel[] = [
  {
    id: "recent",
    label: "Recent",
    emptyLabel: "No Chronicle records yet."
  },
  {
    id: "active",
    label: "Active",
    emptyLabel: "No active records."
  },
  {
    id: "archived",
    label: "Archived",
    emptyLabel: "No archived records."
  },
  {
    id: "deaths",
    label: "Deaths",
    emptyLabel: "No death records."
  },
  {
    id: "retired",
    label: "Retired",
    emptyLabel: "No retired records."
  },
  {
    id: "prestige-earned",
    label: "Prestige Earned",
    emptyLabel: "No Prestige earned yet."
  }
];

function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function parseTimestamp(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function conservativeLabel(value: string | undefined, fallback: string): string {
  if (!value) {
    return fallback;
  }

  const segments = value.split(".");
  const lastSegment = segments.length > 0 ? (segments[segments.length - 1] ?? value) : value;
  const words: string[] = lastSegment.split(/[_-]+/).filter((word) => word.length > 0);

  if (words.length === 0 || words.length > 4 || lastSegment.length > 28) {
    return fallback;
  }

  if (words.some((word) => word.length > 16)) {
    return fallback;
  }

  return words
    .map((word) => word[0]!.toUpperCase() + word.slice(1))
    .join(" ");
}

function formatPlural(value: number, singular: string): string {
  const normalized = Math.max(0, Math.trunc(value));
  return `${formatCount(normalized)} ${singular}${normalized === 1 ? "" : "s"}`;
}

function resolveRequirementSummary(
  requirementResults: ReturnType<typeof resolveLegacyUnlockStates>[number]["requirementResults"]
): {
  requirementLabel: string | null;
  requirementState: "eligible" | "unmet" | "unsupported";
} {
  const unsupported = requirementResults.find((result) => result.state === "unsupported");
  if (unsupported) {
    return {
      requirementLabel: unsupported.label,
      requirementState: "unsupported"
    };
  }

  const unmet = requirementResults.find((result) => result.state === "unmet");
  if (unmet) {
    return {
      requirementLabel: unmet.label,
      requirementState: "unmet"
    };
  }

  return {
    requirementLabel: null,
    requirementState: "eligible"
  };
}

function buildCostLabel(entry: ReturnType<typeof resolveLegacyUnlockStates>[number]): string {
  if (!entry.isKnown) {
    return "Historical";
  }

  if (entry.nextRank === null) {
    return entry.kind === "binary" ? "Owned" : "Maxed";
  }

  return entry.nextCost === null ? "No cost" : `${formatCount(entry.nextCost)} Prestige`;
}

function formatTier(value: number): string {
  switch (value) {
    case 1:
      return "I";
    case 2:
      return "II";
    case 3:
      return "III";
    case 4:
      return "IV";
    case 5:
      return "V";
    default:
      return formatCount(value);
  }
}

function stripRequiresPrefix(label: string): string {
  return label.replace(/^Requires\s+/i, "");
}

function buildStatusTagLabel(
  entry: ReturnType<typeof resolveLegacyUnlockStates>[number]
): string | null {
  if (!entry.isKnown) {
    return "Owned";
  }

  if (entry.classification === "preparation") {
    return "Temporary";
  }

  if (entry.nextRank === null) {
    return entry.kind === "binary" ? "Owned" : "Maxed";
  }

  if (entry.kind !== "binary" && entry.currentRank > 0) {
    return `Tier ${formatTier(entry.currentRank)}`;
  }

  return entry.canPurchase ? null : "Locked";
}

function buildRequiresLabel(
  entry: ReturnType<typeof resolveLegacyUnlockStates>[number],
  requirementLabel: string | null,
  requirementState: "eligible" | "unmet" | "unsupported"
): string | null {
  if (!entry.isKnown) {
    return "Historical unlock";
  }

  if (entry.nextRank === null) {
    return null;
  }

  if (requirementState !== "eligible") {
    return requirementLabel ? stripRequiresPrefix(requirementLabel) : "Further progress";
  }

  if (entry.affordability === "unaffordable") {
    return "More Prestige";
  }

  if (entry.nextCost === null) {
    return "Valid Prestige cost";
  }

  return null;
}

function buildPurchaseButtonLabel(
  entry: ReturnType<typeof resolveLegacyUnlockStates>[number]
): string {
  if (!entry.isKnown || entry.nextRank === null) {
    return "Unavailable";
  }

  if (entry.kind === "binary") {
    return "Purchase";
  }

  return `Purchase Rank ${formatCount(entry.nextRank)}`;
}

function resolveRenownDepth(tier: LegacyRenownTier | null): number {
  switch (tier) {
    case "settlement":
      return 0;
    case "region":
      return 1;
    case "continent":
      return 2;
    case "universal":
      return 3;
    default:
      return 0;
  }
}

function buildPreparationBlockedReason(
  entry: ReturnType<typeof resolveLegacyUnlockStates>[number],
  isSelectedPreparation: boolean,
  selectedCount: number,
  capacity: number,
  supportsChoiceSelection: boolean
): string | null {
  if (entry.classification !== "preparation" || entry.currentRank <= 0) {
    return null;
  }

  if (isLegacyPreparationChoiceRequired(entry.id)) {
    if (!supportsChoiceSelection) {
      return "Selection unavailable";
    }

    if (!isSelectedPreparation && selectedCount >= capacity) {
      return "Preparation capacity full";
    }

    return null;
  }

  if (!isSelectedPreparation && selectedCount >= capacity) {
    return "Preparation capacity full";
  }

  return null;
}

function buildLegacyEntries(profile: AccountProfileState): LegacyUnlockEntryViewModel[] {
  const preparationSelection = resolveLegacyPreparationSelection(profile);
  const selectedPreparationIds = new Set(preparationSelection.selectedUnlockIds);
  const selectedPreparationChoices = preparationSelection.selectedChoicePayloads;

  return resolveLegacyUnlockStates(profile).map((entry) => {
    const requirementSummary = resolveRequirementSummary(entry.requirementResults);
    const isPreparation = entry.classification === "preparation";
    const isChoicePreparation =
      isPreparation &&
      entry.isKnown &&
      entry.currentRank > 0 &&
      isLegacyPreparationChoiceRequired(entry.id);
    const isSelectedPreparation = selectedPreparationIds.has(entry.id);
    const choiceOptions = isChoicePreparation
      ? getLegacyPreparationChoiceOptions(entry.id)
      : [];
    const selectedPreparationChoiceId = selectedPreparationChoices[entry.id] ?? null;
    const rawPreparationBlockedReason = buildPreparationBlockedReason(
      entry,
      isSelectedPreparation,
      preparationSelection.selectedUnlockIds.length,
      preparationSelection.capacity,
      choiceOptions.length > 0
    );
    const preparationBlockedReason = isSelectedPreparation ? null : rawPreparationBlockedReason;
    const canRemovePreparation = isPreparation && isSelectedPreparation;
    const canSelectPreparation =
      isPreparation &&
      entry.isKnown &&
      entry.currentRank > 0 &&
      !isChoicePreparation &&
      !isSelectedPreparation &&
      preparationBlockedReason === null;
    const requiresLabel =
      preparationBlockedReason ??
      (isChoicePreparation &&
      choiceOptions.length > 0 &&
      !isSelectedPreparation
        ? "Choose one"
        : null) ??
      buildRequiresLabel(
        entry,
        requirementSummary.requirementLabel,
        requirementSummary.requirementState
      );

    return {
      id: entry.id,
      title: entry.title,
      description: entry.description,
      type: entry.category,
      unlockClassification: entry.classification,
      costLabel: buildCostLabel(entry),
      statusTagLabel: isSelectedPreparation ? "Selected" : buildStatusTagLabel(entry),
      requiresLabel,
      purchaseButtonLabel: buildPurchaseButtonLabel(entry),
      purchaseBlockedReason: entry.purchaseBlockedReason,
      state: entry.state,
      currentRank: entry.currentRank,
      maxRank: entry.maxRank,
      renownTier: entry.renownTier,
      renownDepth: resolveRenownDepth(entry.renownTier),
      isPlaceholder: false,
      isKnownCatalogEntry: entry.isKnown,
      catalogCanPurchase: entry.canPurchase,
      isPreparation,
      isChoicePreparation,
      isSelectedPreparation,
      selectedPreparationChoiceId,
      preparationChoiceOptions: choiceOptions.map((option) => ({
        id: option.id,
        label: option.label,
        isSelected: selectedPreparationChoiceId === option.id,
        disabled: !isSelectedPreparation && preparationBlockedReason !== null
      })),
      canSelectPreparation,
      canRemovePreparation,
      preparationBlockedReason
    };
  });
}

function resolveLineageLabel(record: AccountRunHistoryRecord): string {
  return conservativeLabel(record.lineageId, "Unknown Line");
}

function resolveOriginLabel(record: AccountRunHistoryRecord): string {
  const settlementLabel = conservativeLabel(record.startingSettlementId, "Unknown Settlement");
  const regionLabel = conservativeLabel(record.startingRegionId, "Unknown Region");
  const continentLabel = conservativeLabel(record.startingContinentId, "Unknown Continent");
  const parts: string[] = [];

  if (settlementLabel !== "Unknown Settlement") {
    parts.push(settlementLabel);
  }

  if (regionLabel !== "Unknown Region" && regionLabel !== settlementLabel) {
    parts.push(regionLabel);
  }

  if (parts.length === 0 && continentLabel !== "Unknown Continent") {
    parts.push(continentLabel);
  }

  return parts.length > 0 ? parts.join(" / ") : "Unknown Origin";
}

function resolveStatusTagLabel(record: AccountRunHistoryRecord): string {
  if (record.outcome === "active") {
    return "Active";
  }

  if (isRunDeleted(record)) {
    return "Deleted";
  }

  switch (record.archiveReason) {
    case "retired":
      return "Retired";
    case "hardcore_dead":
      return "Hardcore";
    case "dead":
      return "Death";
    default:
      return "Archived";
  }
}

function resolveDurationLabel(record: AccountRunHistoryRecord): string | null {
  if (record.survivedDays !== undefined && record.survivedDays > 0) {
    return formatPlural(record.survivedDays, "day");
  }

  if (record.totalPlayTicks !== undefined && record.totalPlayTicks > 0) {
    return formatPlural(record.totalPlayTicks, "tick");
  }

  return null;
}

function resolveDeedLabel(achievementId: string): string {
  const definition = getAchievementDefinitionById(achievementId);
  if (definition?.title) {
    return definition.title;
  }

  return conservativeLabel(achievementId, "Recorded Deed");
}

function resolveDeedLabels(record: AccountRunHistoryRecord): {
  deedLabels: string[];
  moreDeedsLabel: string | null;
} {
  const labels = [...new Set(record.notableCharacterAchievementIds.map(resolveDeedLabel))];

  return {
    deedLabels: labels.slice(0, 2),
    moreDeedsLabel: labels.length > 2 ? `+${formatCount(labels.length - 2)} more` : null
  };
}

function resolveChronicleFilterIds(record: AccountRunHistoryRecord): ChronicleFilterId[] {
  if (isRunDeleted(record)) {
    return ["recent"];
  }

  const filterIds: ChronicleFilterId[] = ["recent"];

  if (record.outcome === "active") {
    filterIds.push("active");
  }

  if (record.outcome === "archived") {
    filterIds.push("archived");
  }

  if (record.archiveReason === "dead" || record.archiveReason === "hardcore_dead") {
    filterIds.push("deaths");
  }

  if (record.outcome === "retired" || record.archiveReason === "retired") {
    filterIds.push("retired");
  }

  if ((record.legacyGranted ?? 0) > 0) {
    filterIds.push("prestige-earned");
  }

  return [...new Set(filterIds)];
}

function buildChronicleContinuityLabels(params: {
  record: AccountRunHistoryRecord;
  recordBySourceId: Map<string, AccountRunHistoryRecord>;
  parentSourceIdsWithChildren: Set<string>;
}): string[] {
  const labels: string[] = [];
  const sourceRecord = params.record.sourceRunId
    ? params.recordBySourceId.get(params.record.sourceRunId)
    : null;

  if (sourceRecord && !isRunDeleted(sourceRecord)) {
    labels.push(`Descended from ${sourceRecord.name || "Unnamed Source"}`);
  }

  if (isRunLineageAuthoritative(params.record)) {
    labels.push("Source Line");
  }

  if (
    !isRunDeleted(params.record) &&
    params.parentSourceIdsWithChildren.has(resolveRunHistorySourceId(params.record))
  ) {
    labels.push("Founded from this line");
  }

  return labels;
}

function buildChronicleTiles(profile: AccountProfileState): ChronicleTileViewModel[] {
  const recordBySourceId = new Map(
    profile.history.runRecords.map((record) => [resolveRunHistorySourceId(record), record])
  );
  const parentSourceIdsWithChildren = new Set(
    profile.history.runRecords.flatMap((record) => (record.sourceRunId ? [record.sourceRunId] : []))
  );

  return profile.history.runRecords
    .map((record, index) => ({
      record,
      index,
      lastSeenTimestamp: parseTimestamp(record.lastSeenAt) ?? 0,
      endedAtTimestamp: parseTimestamp(record.endedAt) ?? 0
    }))
    .sort(
      (left, right) =>
        right.lastSeenTimestamp - left.lastSeenTimestamp ||
        right.endedAtTimestamp - left.endedAtTimestamp ||
        left.index - right.index
    )
    .map(({ record }) => {
      const { deedLabels, moreDeedsLabel } = resolveDeedLabels(record);

      return {
        id: record.characterId,
        title: record.name || (isRunDeleted(record) ? "Deleted Record" : "Archived Record"),
        lineageLabel: resolveLineageLabel(record),
        originLabel: resolveOriginLabel(record),
        statusTagLabel: resolveStatusTagLabel(record),
        echoPeakLabel: `Echo ${formatCount(record.echoLevelReached)}`,
        prestigeEarnedLabel:
          record.legacyGranted && record.legacyGranted > 0
            ? `+${formatCount(record.legacyGranted)} Prestige`
            : null,
        durationLabel: resolveDurationLabel(record),
        deedLabels,
        moreDeedsLabel,
        lineageCueLabels: buildChronicleContinuityLabels({
          record,
          recordBySourceId,
          parentSourceIdsWithChildren
        }),
        authorityNoteLabel: isRunDeleted(record) ? "Non-authoritative record" : null,
        filterIds: resolveChronicleFilterIds(record),
        isDeleted: isRunDeleted(record),
        isPlaceholder: false
      };
    });
}

function buildEstateSummary(profile: AccountProfileState): ChronicleEstateViewModel {
  const estate = profile.estate ?? { deposits: [], assets: [] };
  const depositCount = estate.deposits.length;
  const assetCount = estate.assets.length;
  const currencyCount = estate.assets.filter((asset) => asset.assetKind === "currency").length;
  const itemCount = estate.assets.filter((asset) => asset.assetKind === "item").length;
  const operationalCount = estate.assets.filter(
    (asset) => asset.assetKind === "operational"
  ).length;
  const sourceNameByRunId = new Map(
    estate.deposits.map((deposit) => [deposit.sourceRunId, deposit.sourceName])
  );
  const claimPreviews = resolveEstateClaimPreviews(profile);
  const previewRows = claimPreviews.flatMap((preview) =>
    preview.assets.map((asset) => ({
      id: `${preview.claimantRunId}.${asset.estateAssetId}`,
      title: asset.title,
      detailLabel: asset.detailLabel,
      sourceLabel: preview.sourceName
        ? `From ${preview.sourceName}`
        : "From archived estate",
      claimantLabel: `Preview for ${conservativeLabel(preview.claimantRunId, "linked heir")}`,
      statusLabel: asset.usable ? "Usable preview" : "Locked",
      lockedReasonLabel: asset.lockedReason,
      isLocked: !asset.usable
    }))
  );
  const storedRows =
    previewRows.length > 0
      ? []
      : estate.assets.map((asset) => ({
          id: asset.estateAssetId,
          title:
            asset.displayName ??
            conservativeLabel(asset.itemId ?? asset.currencyKey ?? asset.assetId, "Estate asset"),
          detailLabel:
            asset.assetKind === "currency"
              ? `${formatCount(asset.quantityDeposited ?? 0)} ${conservativeLabel(asset.currencyKey, "currency")}`
              : asset.assetKind === "item"
                ? `${formatCount(asset.quantityDeposited ?? 0)} ${conservativeLabel(asset.itemId, "item")}`
                : asset.storedValueSummary ?? asset.operatingState ?? "Operational summary",
          sourceLabel: sourceNameByRunId.get(asset.sourceRunId)
            ? `From ${sourceNameByRunId.get(asset.sourceRunId)}`
            : "From archived estate",
          claimantLabel: null,
          statusLabel: "Stored",
          lockedReasonLabel: "Claim preview requires a linked heir",
          isLocked: true
        }));
  const visibleRows = [...previewRows, ...storedRows].slice(0, 5);
  const overflowCount = Math.max(0, previewRows.length + storedRows.length - visibleRows.length);

  return {
    summaryStats: [
      { label: "Deposits", valueLabel: formatCount(depositCount) },
      { label: "Assets", valueLabel: formatCount(assetCount) },
      { label: "Currency", valueLabel: formatCount(currencyCount) },
      { label: "Items", valueLabel: formatCount(itemCount) },
      { label: "Ops", valueLabel: formatCount(operationalCount) }
    ],
    claimTiers: resolveEstateClaimTiers().map((tier) => ({
      id: tier.tierId,
      label: tier.label,
      accessLabel: `${formatCount(tier.accessPercent)}% access`,
      costLabel: `${formatCount(tier.prestigeCost)} Prestige`,
      requirementLabel: tier.requirementLabel,
      stateLabel: tier.disabledLabel
    })),
    previewRows: visibleRows,
    emptyLabel: assetCount === 0 ? "No estate assets deposited yet." : null,
    overflowLabel: overflowCount > 0 ? `+${formatCount(overflowCount)} more estate assets` : null,
    noteLabel: "Claim preview only. Assets remain stored until a later delivery seam moves them."
  };
}

export function buildAccountMetaViewModel(profile: AccountProfileState): AccountMetaViewModel {
  const unlockEntries = buildLegacyEntries(profile);
  const preparationSelection = resolveLegacyPreparationSelection(profile);
  const observedUnlockTypes = new Set(unlockEntries.map((entry) => entry.type));
  const extraUnlockTypes = [...observedUnlockTypes]
    .filter((type) => !FALLBACK_UNLOCK_TYPES.includes(type))
    .sort((left, right) => left.localeCompare(right));
  const unlockTypes = [
    ...FALLBACK_UNLOCK_TYPES.filter((type) => observedUnlockTypes.has(type)),
    ...extraUnlockTypes
  ];
  const activeCount = profile.history.runRecords.filter((record) => record.outcome === "active").length;
  const archivedCount = profile.history.runRecords.filter(
    (record) => record.outcome === "archived"
  ).length;
  const retiredCount = profile.history.runRecords.filter(
    (record) => record.outcome === "retired" || record.archiveReason === "retired"
  ).length;
  const deathCount = profile.history.runRecords.filter(
    (record) =>
      record.outcome === "archived" &&
      (record.archiveReason === "dead" || record.archiveReason === "hardcore_dead")
  ).length;
  const deletedCount = profile.history.runRecords.filter((record) => isRunDeleted(record)).length;

  return {
    legacy: {
      currentPrestigeLabel: formatCount(profile.legacy.legacyPoints),
      lifetimePrestigeLabel: formatCount(profile.legacy.lifetimeLegacyEarned),
      preparationCapacityLabel: `${formatCount(preparationSelection.selectedUnlockIds.length)} / ${formatCount(preparationSelection.capacity)} selected`,
      unlockTypeTabs: ["All", ...unlockTypes],
      unlockEntries
    },
    chronicles: {
      summaryStats: [
        { label: "Active", valueLabel: formatCount(activeCount) },
        { label: "Archived", valueLabel: formatCount(archivedCount) },
        { label: "Retired", valueLabel: formatCount(retiredCount) },
        { label: "Deaths", valueLabel: formatCount(deathCount) },
        { label: "Deleted", valueLabel: formatCount(deletedCount) },
        { label: "Total", valueLabel: formatCount(profile.history.runRecords.length) }
      ],
      filters: CHRONICLE_FILTERS,
      tiles: buildChronicleTiles(profile),
      estate: buildEstateSummary(profile)
    }
  };
}
