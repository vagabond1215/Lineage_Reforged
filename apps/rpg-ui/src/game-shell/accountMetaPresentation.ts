import type {
  AccountProfileState,
  AccountRunHistoryRecord,
  LegacyUnlockRequirementResolutionState
} from "../../../../packages/shared/types/src/index.js";
import { resolveLegacyUnlockStates } from "../../../../packages/engines/game-engine/src/legacy-unlocks.js";

export type AccountMetaSectionId = "legacy" | "chronicles";
export type LegacyUnlockStateFilter = "All" | "Locked" | "Unlocked";

export type LegacyUnlockEntryViewModel = {
  id: string;
  title: string;
  description: string;
  type: string;
  requirementLabel: string;
  requirementState: LegacyUnlockRequirementResolutionState;
  costLabel: string;
  progressLabel: string;
  affordabilityLabel: string;
  purchaseStatusLabel: string;
  state: "locked" | "unlocked" | "maxed";
  isPlaceholder: boolean;
  isKnownCatalogEntry: boolean;
  catalogCanPurchase: boolean;
};

export type LegacyMetaViewModel = {
  currentPrestigeLabel: string;
  lifetimePrestigeLabel: string;
  unlockTypeTabs: string[];
  unlockEntries: LegacyUnlockEntryViewModel[];
};

export type ChronicleSummaryStatViewModel = {
  label: "Active" | "Retired" | "Deaths" | "Heirs" | "Total";
  valueLabel: string;
};

export type ChronicleTileViewModel = {
  id: string;
  title: string;
  originLabel: string;
  fateLabel: string;
  echoPeakLabel: string;
  legacyGrantedLabel: string | null;
  isPlaceholder: boolean;
};

export type ChroniclesMetaViewModel = {
  summaryStats: ChronicleSummaryStatViewModel[];
  tiles: ChronicleTileViewModel[];
};

export type AccountMetaViewModel = {
  legacy: LegacyMetaViewModel;
  chronicles: ChroniclesMetaViewModel;
};

const FALLBACK_UNLOCK_TYPES = [
  "Origins",
  "Titles",
  "Perks",
  "Traits",
  "Account",
  "Chronicle",
  "Heir"
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

function resolveRequirementSummary(
  requirementResults: ReturnType<typeof resolveLegacyUnlockStates>[number]["requirementResults"]
): {
  requirementLabel: string;
  requirementState: LegacyUnlockRequirementResolutionState;
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
    requirementLabel: requirementResults.length > 0 ? "Requirements met" : "No gameplay gate",
    requirementState: "eligible"
  };
}

function buildProgressLabel(entry: ReturnType<typeof resolveLegacyUnlockStates>[number]): string {
  if (!entry.isKnown && entry.isOwned) {
    return "Historical record";
  }

  if (entry.kind === "binary") {
    return entry.isOwned ? "Owned" : "One-time unlock";
  }

  return `Rank ${formatCount(entry.currentRank)} / ${formatCount(entry.maxRank)}`;
}

function buildCostLabel(entry: ReturnType<typeof resolveLegacyUnlockStates>[number]): string {
  if (!entry.isKnown) {
    return "Historical record";
  }

  if (entry.nextRank === null) {
    return "Max rank";
  }

  return entry.nextCost === null ? "No cost" : `${formatCount(entry.nextCost)} Prestige`;
}

function buildAffordabilityLabel(
  entry: ReturnType<typeof resolveLegacyUnlockStates>[number]
): string {
  if (!entry.isKnown) {
    return "Non-purchasable";
  }

  if (entry.nextRank === null) {
    return "Owned";
  }

  if (!entry.eligible) {
    return "Gated";
  }

  switch (entry.affordability) {
    case "affordable":
      return "Affordable";
    case "unaffordable":
      return "Insufficient Prestige";
    case "no_cost":
      return "No active cost";
  }
}

function buildPurchaseStatusLabel(
  entry: ReturnType<typeof resolveLegacyUnlockStates>[number]
): string {
  if (!entry.isKnown) {
    return "Historical record";
  }

  if (entry.nextRank === null) {
    return "Owned";
  }

  return "Purchase wiring pending";
}

function buildLegacyEntries(profile: AccountProfileState): LegacyUnlockEntryViewModel[] {
  return resolveLegacyUnlockStates(profile).map((entry) => {
    const requirementSummary = resolveRequirementSummary(entry.requirementResults);

    return {
      id: entry.id,
      title: entry.title,
      description: entry.description,
      type: entry.category,
      requirementLabel: requirementSummary.requirementLabel,
      requirementState: requirementSummary.requirementState,
      costLabel: buildCostLabel(entry),
      progressLabel: buildProgressLabel(entry),
      affordabilityLabel: buildAffordabilityLabel(entry),
      purchaseStatusLabel: buildPurchaseStatusLabel(entry),
      state: entry.state,
      isPlaceholder: false,
      isKnownCatalogEntry: entry.isKnown,
      catalogCanPurchase: entry.canPurchase
    };
  });
}

function resolveOriginLabel(record: AccountRunHistoryRecord): string {
  const lineageLabel = conservativeLabel(record.lineageId, "Unknown Origin");
  const settlementLabel = conservativeLabel(
    record.startingSettlementId,
    "Unrecorded Settlement"
  );
  const regionLabel = conservativeLabel(record.startingRegionId, "Unknown Region");
  const parts: string[] = [];

  if (lineageLabel !== "Unknown Origin") {
    parts.push(lineageLabel);
  }

  if (settlementLabel !== "Unrecorded Settlement") {
    parts.push(settlementLabel);
  } else if (regionLabel !== "Unknown Region") {
    parts.push(regionLabel);
  }

  return parts.length > 0 ? parts.join(" • ") : "Unknown Origin";
}

function resolveFateLabel(record: AccountRunHistoryRecord): string {
  if (record.outcome === "active") {
    return "Active";
  }

  if (record.outcome === "deleted") {
    return "Deleted";
  }

  switch (record.archiveReason) {
    case "retired":
      return "Retired";
    case "hardcore_dead":
      return "Hardcore Death";
    case "dead":
      return "Death Recorded";
    default:
      return "Archived Record";
  }
}

function buildChronicleTiles(profile: AccountProfileState): ChronicleTileViewModel[] {
  const fallbackTimestamp =
    parseTimestamp(profile.updatedAt) ?? parseTimestamp(profile.createdAt) ?? 0;

  const tiles = profile.history.runRecords
    .map((record, index) => ({
      record,
      index,
      sortTimestamp: parseTimestamp(record.lastSeenAt) ?? fallbackTimestamp
    }))
    .sort((left, right) => right.sortTimestamp - left.sortTimestamp || left.index - right.index)
    .map(({ record }) => ({
      id: record.characterId,
      title: record.name || "Archived Record",
      originLabel: resolveOriginLabel(record),
      fateLabel: resolveFateLabel(record),
      echoPeakLabel: `Echo Peak ${formatCount(record.echoLevelReached)}`,
      legacyGrantedLabel:
        record.legacyGranted && record.legacyGranted > 0
          ? `+${formatCount(record.legacyGranted)} Prestige`
          : null,
      isPlaceholder: false
    }));

  return tiles;
}

export function buildAccountMetaViewModel(profile: AccountProfileState): AccountMetaViewModel {
  const unlockEntries = buildLegacyEntries(profile);
  const observedUnlockTypes = new Set(unlockEntries.map((entry) => entry.type));
  const extraUnlockTypes = [...observedUnlockTypes]
    .filter((type) => !FALLBACK_UNLOCK_TYPES.includes(type))
    .sort((left, right) => left.localeCompare(right));
  const unlockTypes = [
    ...FALLBACK_UNLOCK_TYPES.filter((type) => observedUnlockTypes.has(type)),
    ...extraUnlockTypes
  ];
  const activeCount = profile.history.runRecords.filter((record) => record.outcome === "active").length;
  const retiredCount = profile.history.runRecords.filter(
    (record) => record.outcome === "archived" && record.archiveReason === "retired"
  ).length;
  const deathCount = profile.history.runRecords.filter(
    (record) =>
      record.outcome === "archived" &&
      (record.archiveReason === "dead" || record.archiveReason === "hardcore_dead")
  ).length;

  return {
    legacy: {
      currentPrestigeLabel: formatCount(profile.legacy.legacyPoints),
      lifetimePrestigeLabel: formatCount(profile.legacy.lifetimeLegacyEarned),
      unlockTypeTabs: ["All", ...unlockTypes],
      unlockEntries
    },
    chronicles: {
      summaryStats: [
        { label: "Active", valueLabel: formatCount(activeCount) },
        { label: "Retired", valueLabel: formatCount(retiredCount) },
        { label: "Deaths", valueLabel: formatCount(deathCount) },
        { label: "Heirs", valueLabel: "0" },
        { label: "Total", valueLabel: formatCount(profile.history.runRecords.length) }
      ],
      tiles: buildChronicleTiles(profile)
    }
  };
}
