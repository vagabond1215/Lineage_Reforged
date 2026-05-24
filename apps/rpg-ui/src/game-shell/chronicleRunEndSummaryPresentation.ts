import type {
  AccountEstateAssetRecord,
  AccountProfileState,
  AccountRunArchiveReason,
  AccountRunHistoryRecord,
  RunLegacyPayoutBreakdownState
} from "../../../../packages/shared/types/src/index.js";
import {
  getAchievementDefinitionById
} from "../../../../packages/engines/game-engine/src/achievements.js";
import {
  isRunDeleted,
  isRunLineageAuthoritative,
  isRunProgressionAuthoritative,
  resolveRunHistorySourceId
} from "./runLifecycle.js";

export type ChronicleRunEndSummaryStatusTone =
  | "missing"
  | "active"
  | "retired"
  | "archived"
  | "death"
  | "hardcore_death"
  | "deleted";

export type ChronicleRunEndSummaryRow = {
  id: string;
  label: string;
  valueLabel: string;
  detailLabel: string | null;
};

export type ChronicleRunEndSummaryLifecycleContext = {
  legacyGranted?: number;
  rewardTransactionId?: string;
  clearedSlotIds?: readonly string[];
  retainedSlotIds?: readonly string[];
  inheritanceUsesRemaining?: number;
};

export type ChronicleRunEndSummaryInput = {
  accountProfile: AccountProfileState;
  runRecord: AccountRunHistoryRecord | null;
  lifecycleResult?: ChronicleRunEndSummaryLifecycleContext | null;
};

export type ChronicleRunEndSummaryViewModel = {
  title: string;
  subtitle: string;
  outcomeLabel: string;
  statusTone: ChronicleRunEndSummaryStatusTone;
  identityRows: ChronicleRunEndSummaryRow[];
  originRows: ChronicleRunEndSummaryRow[];
  survivalRows: ChronicleRunEndSummaryRow[];
  progressionRows: ChronicleRunEndSummaryRow[];
  deedRows: ChronicleRunEndSummaryRow[];
  payoutRows: ChronicleRunEndSummaryRow[];
  estateRows: ChronicleRunEndSummaryRow[];
  continuityRows: ChronicleRunEndSummaryRow[];
  slotRows: ChronicleRunEndSummaryRow[];
  warningLabels: string[];
  actionIds: [];
};

type ResolvedOutcome = {
  outcomeLabel: string;
  statusTone: ChronicleRunEndSummaryStatusTone;
  subtitle: string;
};

const EMPTY_ACTION_IDS: [] = [];

const ARCHIVE_REASON_LABELS: Record<AccountRunArchiveReason, string> = {
  retired: "Retirement",
  dead: "Death",
  hardcore_dead: "Hardcore Death"
};

const PAYOUT_BREAKDOWN_LABELS: Array<{
  key: keyof RunLegacyPayoutBreakdownState;
  label: string;
}> = [
  { key: "progressionDepth", label: "Progression depth" },
  { key: "notableDeeds", label: "Notable deeds" },
  { key: "survivalDepth", label: "Survival depth" },
  { key: "milestoneQuality", label: "Milestone quality" },
  { key: "archiveReasonModifier", label: "Archive modifier" },
  { key: "challengeModifier", label: "Challenge modifier" },
  { key: "shallowRunModifier", label: "Shallow-run modifier" },
  { key: "repeatedWeakRunModifier", label: "Repeated weak-run modifier" },
  { key: "rawScore", label: "Raw score" },
  { key: "modifiedScore", label: "Modified score" },
  { key: "finalAmount", label: "Final amount" }
];

function createRow(
  id: string,
  label: string,
  valueLabel: string,
  detailLabel: string | null = null
): ChronicleRunEndSummaryRow {
  return {
    id,
    label,
    valueLabel,
    detailLabel
  };
}

function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatKnownInteger(value: number | undefined): string {
  return typeof value === "number" && Number.isFinite(value)
    ? formatCount(Math.max(0, Math.trunc(value)))
    : "Unavailable";
}

function formatDateLabel(value: string | undefined): string {
  if (!value) {
    return "Unavailable";
  }

  const parsed = Date.parse(value);

  return Number.isFinite(parsed) ? new Date(parsed).toISOString().slice(0, 10) : value;
}

function conservativeLabel(value: string | undefined, fallback: string): string {
  if (!value) {
    return fallback;
  }

  const segments = value.split(".");
  const candidate = segments[segments.length - 1] ?? value;
  const words = candidate
    .split(/[_-]+/g)
    .map((word) => word.trim())
    .filter(Boolean);

  if (words.length === 0 || words.length > 4 || words.some((word) => word.length > 24)) {
    return fallback;
  }

  return words
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function resolveOutcome(record: AccountRunHistoryRecord): ResolvedOutcome {
  if (record.outcome === "active") {
    return {
      outcomeLabel: "Active Run",
      statusTone: "active",
      subtitle: "Active Chronicle context. Run-end impact is not resolved yet."
    };
  }

  if (record.outcome === "deleted") {
    return {
      outcomeLabel: "Deleted Record",
      statusTone: "deleted",
      subtitle: "Deleted Chronicle record. Treat as non-authoritative."
    };
  }

  if (record.archiveReason === "hardcore_dead") {
    return {
      outcomeLabel: "Hardcore Death",
      statusTone: "hardcore_death",
      subtitle: "Archived death record from a hardcore run."
    };
  }

  if (record.archiveReason === "dead") {
    return {
      outcomeLabel: "Death",
      statusTone: "death",
      subtitle: "Archived death record."
    };
  }

  if (record.outcome === "retired") {
    return {
      outcomeLabel: "Retired",
      statusTone: "retired",
      subtitle: "Retired run record retained for later continuity."
    };
  }

  if (record.archiveReason === "retired") {
    return {
      outcomeLabel: "Archived Retirement",
      statusTone: "retired",
      subtitle: "Archived retirement record."
    };
  }

  return {
    outcomeLabel: "Archived Run",
    statusTone: "archived",
    subtitle: "Archived Chronicle record."
  };
}

function buildIdentityRows(record: AccountRunHistoryRecord): ChronicleRunEndSummaryRow[] {
  return [
    createRow("character", "Character", record.name || "Unnamed Record"),
    createRow("character-id", "Character ID", record.characterId || "Unavailable"),
    createRow(
      "lineage",
      "Lineage",
      conservativeLabel(record.lineageId, "Unknown Lineage"),
      "Lineage is shown as recorded and is not treated as a family id."
    ),
    ...(record.familyId
      ? [
          createRow(
            "family",
            "Family",
            conservativeLabel(record.familyId, "Recorded Family"),
            "Explicit family id only."
          )
        ]
      : []),
    ...(record.parentCharacterId
      ? [
          createRow(
            "parent-character",
            "Parent character",
            conservativeLabel(record.parentCharacterId, "Recorded Parent"),
            "Explicit parent character id only."
          )
        ]
      : [])
  ];
}

function buildOriginRows(record: AccountRunHistoryRecord): ChronicleRunEndSummaryRow[] {
  return [
    createRow(
      "continent",
      "Starting continent",
      conservativeLabel(record.startingContinentId, "Unknown Continent")
    ),
    createRow(
      "region",
      "Starting region",
      conservativeLabel(record.startingRegionId, "Unknown Region")
    ),
    createRow(
      "settlement",
      "Starting settlement",
      conservativeLabel(record.startingSettlementId, "Unknown Settlement")
    )
  ];
}

function buildSurvivalRows(record: AccountRunHistoryRecord): ChronicleRunEndSummaryRow[] {
  return [
    createRow("started-at", "Started", formatDateLabel(record.startedAt)),
    createRow("ended-at", "Ended", formatDateLabel(record.endedAt)),
    createRow("last-seen-at", "Last seen", formatDateLabel(record.lastSeenAt)),
    createRow("survived-days", "Survived days", formatKnownInteger(record.survivedDays)),
    createRow("play-ticks", "Play ticks", formatKnownInteger(record.totalPlayTicks)),
    ...(record.archiveReason
      ? [
          createRow(
            "archive-reason",
            "Archive reason",
            ARCHIVE_REASON_LABELS[record.archiveReason],
            "Stored archive reason."
          )
        ]
      : [])
  ];
}

function buildProgressionRows(record: AccountRunHistoryRecord): ChronicleRunEndSummaryRow[] {
  return [
    createRow("echo-peak", "Echo peak", formatKnownInteger(record.echoLevelReached)),
    createRow(
      "payout-baseline",
      "Payout baseline",
      formatKnownInteger(record.legacyPayoutBaseline?.echoLevel)
    )
  ];
}

function buildDeedRows(record: AccountRunHistoryRecord): ChronicleRunEndSummaryRow[] {
  return record.notableCharacterAchievementIds.map((achievementId, index) => {
    const definition = getAchievementDefinitionById(achievementId);

    return createRow(
      `deed-${index}`,
      "Deed",
      definition?.title ?? conservativeLabel(achievementId, "Recorded Deed"),
      definition ? "Known achievement." : "Achievement id is not present in the current catalog."
    );
  });
}

function buildPayoutRows(
  record: AccountRunHistoryRecord,
  lifecycleResult: ChronicleRunEndSummaryLifecycleContext | null | undefined
): ChronicleRunEndSummaryRow[] {
  if (isRunDeleted(record)) {
    return [];
  }

  const rows: ChronicleRunEndSummaryRow[] = [];
  const terminal = isRunProgressionAuthoritative(record);
  const legacyGranted = record.legacyGranted ?? lifecycleResult?.legacyGranted;
  const transactionId = record.legacyPayoutTransactionId ?? lifecycleResult?.rewardTransactionId;

  if (record.payoutEligible !== undefined) {
    rows.push(
      createRow(
        "payout-eligible",
        "Payout eligibility",
        record.payoutEligible ? "Eligible" : "Not eligible"
      )
    );
  } else if (terminal) {
    rows.push(createRow("payout-eligible", "Payout eligibility", "Unavailable"));
  } else {
    rows.push(
      createRow(
        "payout-state",
        "Payout",
        "Not resolved",
        "Active records do not have run-end payout resolution."
      )
    );
  }

  if (legacyGranted !== undefined) {
    rows.push(
      createRow(
        "legacy-granted",
        "Legacy awarded",
        formatKnownInteger(legacyGranted),
        "Stored payout value."
      )
    );
  } else if (terminal) {
    rows.push(createRow("legacy-granted", "Legacy awarded", "Unavailable"));
  }

  if (record.legacyPayoutResolvedAt) {
    rows.push(
      createRow(
        "payout-resolved-at",
        "Payout resolved",
        formatDateLabel(record.legacyPayoutResolvedAt)
      )
    );
  }

  if (transactionId) {
    rows.push(createRow("payout-transaction", "Payout transaction", transactionId));
  }

  if (record.payoutBreakdown) {
    for (const { key, label } of PAYOUT_BREAKDOWN_LABELS) {
      rows.push(
        createRow(
          `payout-breakdown-${key}`,
          label,
          formatKnownInteger(record.payoutBreakdown[key]),
          "Stored payout breakdown."
        )
      );
    }
  }

  return rows;
}

function resolveEstateAssetLabel(asset: AccountEstateAssetRecord): string {
  if (asset.displayName) {
    return asset.displayName;
  }

  if (asset.assetKind === "currency") {
    return conservativeLabel(asset.currencyKey, "Currency");
  }

  if (asset.assetKind === "item") {
    return conservativeLabel(asset.itemId ?? asset.itemKey, "Item");
  }

  return conservativeLabel(asset.assetId ?? asset.assetType, "Operational Asset");
}

function resolveEstateAssetDetail(asset: AccountEstateAssetRecord): string {
  if (asset.assetKind === "currency") {
    return `${formatKnownInteger(asset.quantityDeposited)} ${conservativeLabel(
      asset.currencyKey,
      "currency"
    )}`;
  }

  if (asset.assetKind === "item") {
    return `${formatKnownInteger(asset.quantityDeposited)} stored`;
  }

  return asset.storedValueSummary ?? asset.operatingState ?? "Stored operational summary";
}

function buildEstateRows(
  record: AccountRunHistoryRecord,
  profile: AccountProfileState
): ChronicleRunEndSummaryRow[] {
  if (isRunDeleted(record)) {
    return [];
  }

  const sourceRunId = resolveRunHistorySourceId(record);
  const deposits = profile.estate.deposits.filter((deposit) => deposit.sourceRunId === sourceRunId);
  const assets = profile.estate.assets.filter((asset) => asset.sourceRunId === sourceRunId);

  if (deposits.length === 0 && assets.length === 0) {
    return [];
  }

  const latestDeposit = deposits
    .map((deposit, index) => ({
      deposit,
      index,
      timestamp: Date.parse(deposit.depositedAt)
    }))
    .sort((left, right) => {
      const leftTimestamp = Number.isFinite(left.timestamp) ? left.timestamp : 0;
      const rightTimestamp = Number.isFinite(right.timestamp) ? right.timestamp : 0;
      return rightTimestamp - leftTimestamp || left.index - right.index;
    })[0]?.deposit;
  const rows: ChronicleRunEndSummaryRow[] = [
    createRow(
      "estate-source",
      "Estate source",
      latestDeposit?.sourceName ?? (record.name || "Archived estate"),
      "Stored estate record only."
    ),
    createRow("estate-deposits", "Estate deposits", formatCount(deposits.length)),
    createRow("estate-assets", "Stored estate assets", formatCount(assets.length))
  ];

  for (const asset of assets.slice(0, 5)) {
    rows.push(
      createRow(
        `estate-asset-${asset.estateAssetId}`,
        resolveEstateAssetLabel(asset),
        resolveEstateAssetDetail(asset),
        "Stored only; no claim or transfer action."
      )
    );
  }

  const overflowCount = Math.max(0, assets.length - 5);

  if (overflowCount > 0) {
    rows.push(createRow("estate-overflow", "Additional estate assets", formatCount(overflowCount)));
  }

  return rows;
}

function buildRecordBySourceId(profile: AccountProfileState): Map<string, AccountRunHistoryRecord> {
  return new Map(
    profile.history.runRecords.map((record) => [resolveRunHistorySourceId(record), record])
  );
}

function buildContinuityRows(
  record: AccountRunHistoryRecord,
  profile: AccountProfileState,
  lifecycleResult: ChronicleRunEndSummaryLifecycleContext | null | undefined
): ChronicleRunEndSummaryRow[] {
  const rows: ChronicleRunEndSummaryRow[] = [];
  const recordBySourceId = buildRecordBySourceId(profile);
  const sourceRecord = record.sourceRunId ? recordBySourceId.get(record.sourceRunId) : null;
  const inheritanceUsesRemaining =
    lifecycleResult?.inheritanceUsesRemaining ?? record.inheritanceUsesRemaining;

  if (record.sourceRunId) {
    rows.push(
      createRow(
        "source-run",
        "Source run",
        sourceRecord?.name || conservativeLabel(record.sourceRunId, "Recorded Source"),
        sourceRecord
          ? "Source context only; source run id alone does not create parent or child copy."
          : "Source context only; source record unavailable."
      )
    );
  }

  if (record.crossLineageStart) {
    rows.push(createRow("cross-lineage-start", "Cross-lineage start", "Recorded"));
  }

  if (record.parentCharacterId) {
    rows.push(
      createRow(
        "explicit-parent",
        "Explicit parent",
        conservativeLabel(record.parentCharacterId, "Recorded Parent"),
        "Parent copy is shown only because parentCharacterId is stored."
      )
    );
  }

  if (record.familyId) {
    rows.push(
      createRow(
        "explicit-family",
        "Explicit family",
        conservativeLabel(record.familyId, "Recorded Family"),
        "Family context is shown only because familyId is stored."
      )
    );
  }

  if (inheritanceUsesRemaining !== undefined) {
    rows.push(
      createRow(
        "inheritance-uses",
        "Inheritance uses",
        `${formatKnownInteger(inheritanceUsesRemaining)} remaining`,
        "Read-only retained-run count; this does not imply an heir exists."
      )
    );
  }

  if (isRunLineageAuthoritative(record)) {
    rows.push(
      createRow(
        "lineage-authority",
        "Lineage source",
        "Available for later continuity",
        "Read-only authority marker from current run lifecycle rules."
      )
    );
  }

  return rows;
}

function buildSlotRows(
  record: AccountRunHistoryRecord,
  lifecycleResult: ChronicleRunEndSummaryLifecycleContext | null | undefined
): ChronicleRunEndSummaryRow[] {
  const rows = [
    createRow("stored-slots", "Stored slot refs", formatCount(record.saveSlotIds.length))
  ];

  if (lifecycleResult?.clearedSlotIds) {
    rows.push(
      createRow(
        "cleared-slots",
        "Cleared slots",
        formatCount(lifecycleResult.clearedSlotIds.length),
        "Read-only lifecycle impact."
      )
    );
  }

  if (lifecycleResult?.retainedSlotIds) {
    rows.push(
      createRow(
        "retained-slots",
        "Retained slots",
        formatCount(lifecycleResult.retainedSlotIds.length),
        "Read-only lifecycle impact."
      )
    );
  }

  return rows;
}

function buildWarnings(record: AccountRunHistoryRecord, profile: AccountProfileState): string[] {
  const warnings: string[] = [];

  if (record.outcome === "active") {
    warnings.push("Active records are not terminal run-end summaries.");
  }

  if (isRunDeleted(record)) {
    warnings.push("Deleted records are non-authoritative.");
  }

  if (record.sourceRunId && !buildRecordBySourceId(profile).has(record.sourceRunId)) {
    warnings.push("Source run context is unavailable.");
  }

  if (
    record.legacyGranted !== undefined &&
    record.payoutBreakdown?.finalAmount !== undefined &&
    record.legacyGranted !== record.payoutBreakdown.finalAmount
  ) {
    warnings.push("Stored Legacy award differs from stored payout breakdown final amount.");
  }

  return [...new Set(warnings)];
}

export function buildChronicleRunEndSummaryViewModel(
  input: ChronicleRunEndSummaryInput
): ChronicleRunEndSummaryViewModel {
  const { accountProfile, runRecord, lifecycleResult } = input;

  if (!runRecord) {
    return {
      title: "Run record unavailable",
      subtitle: "No Chronicle run record was provided.",
      outcomeLabel: "Unavailable",
      statusTone: "missing",
      identityRows: [],
      originRows: [],
      survivalRows: [],
      progressionRows: [],
      deedRows: [],
      payoutRows: [],
      estateRows: [],
      continuityRows: [],
      slotRows: [],
      warningLabels: ["Run record unavailable."],
      actionIds: EMPTY_ACTION_IDS
    };
  }

  const outcome = resolveOutcome(runRecord);

  return {
    title: runRecord.name || (isRunDeleted(runRecord) ? "Deleted Record" : "Archived Record"),
    subtitle: outcome.subtitle,
    outcomeLabel: outcome.outcomeLabel,
    statusTone: outcome.statusTone,
    identityRows: buildIdentityRows(runRecord),
    originRows: buildOriginRows(runRecord),
    survivalRows: buildSurvivalRows(runRecord),
    progressionRows: buildProgressionRows(runRecord),
    deedRows: buildDeedRows(runRecord),
    payoutRows: buildPayoutRows(runRecord, lifecycleResult),
    estateRows: buildEstateRows(runRecord, accountProfile),
    continuityRows: buildContinuityRows(runRecord, accountProfile, lifecycleResult),
    slotRows: buildSlotRows(runRecord, lifecycleResult),
    warningLabels: buildWarnings(runRecord, accountProfile),
    actionIds: EMPTY_ACTION_IDS
  };
}
