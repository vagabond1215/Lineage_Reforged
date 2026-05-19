import type {
  AccountAchievementUnlockState,
  AccountAchievementsState,
  AccountFamiliesState,
  AccountFamilyRecord,
  AccountFamilyUnlockState,
  AccountEstateAssetRecord,
  AccountEstateDepositRecord,
  AccountEstateState,
  AccountHistoryState,
  AccountLegacyState,
  AccountProfileState,
  AccountRunHistoryRecord,
  AchievementMetricId,
  FamilyPrestigeTransactionState,
  RunLegacyPayoutBaselineState,
  LegacyTransactionState,
  LegacyUnlockState,
  RunLegacyPayoutBreakdownState
} from "../../../../packages/shared/types/src/index.js";
import {
  DEFAULT_ACCOUNT_DISPLAY_NAME,
  DEFAULT_ACCOUNT_ID,
  createDefaultAccountProfileState
} from "../../../../packages/engines/game-engine/src/legacy-account.js";
import { createDefaultAccountEstateState } from "../../../../packages/engines/game-engine/src/account-estate.js";
import {
  ACCOUNT_FAMILY_STATUSES,
  FAMILY_PRESTIGE_CATEGORY_TAGS,
  FAMILY_PRESTIGE_TRANSACTION_KINDS,
  createDefaultAccountFamiliesState
} from "../../../../packages/engines/game-engine/src/account-family.js";
import { resolveLegacyPreparationSelection } from "../../../../packages/engines/game-engine/src/legacy-unlocks.js";
import {
  ACHIEVEMENT_METRIC_IDS,
  createAchievementMetricRecord,
  createDefaultAccountAchievementsState,
  createDefaultAccountHistoryState
} from "../../../../packages/engines/game-engine/src/account-achievement-state.js";

const ACCOUNT_STORAGE_PREFIX = "cataclysm-rpg-ui.accounts.v1";
const ACTIVE_ACCOUNT_KEY = `${ACCOUNT_STORAGE_PREFIX}.active-account`;
const ACCOUNT_FAMILY_STATUS_SET = new Set<string>(ACCOUNT_FAMILY_STATUSES);
const FAMILY_PRESTIGE_TRANSACTION_KIND_SET = new Set<string>(FAMILY_PRESTIGE_TRANSACTION_KINDS);
const FAMILY_PRESTIGE_CATEGORY_TAG_SET = new Set<string>(FAMILY_PRESTIGE_CATEGORY_TAGS);

function getAccountStorage(): Storage {
  if (typeof window === "undefined") {
    throw new Error("Account profile storage is only available in the browser.");
  }

  return window.localStorage;
}

function getAccountProfileKey(accountId: string): string {
  return `${ACCOUNT_STORAGE_PREFIX}.account.${accountId}`;
}

function sanitizeAccountId(accountId: string | null | undefined): string {
  const trimmed = accountId?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : DEFAULT_ACCOUNT_ID;
}

function sanitizeDisplayName(displayName: string | null | undefined): string {
  const trimmed = displayName?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : DEFAULT_ACCOUNT_DISPLAY_NAME;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isRunLegacyPayoutBreakdownState(
  value: unknown
): value is RunLegacyPayoutBreakdownState {
  return (
    isRecord(value) &&
    isFiniteNumber(value.progressionDepth) &&
    isFiniteNumber(value.notableDeeds) &&
    isFiniteNumber(value.survivalDepth) &&
    isFiniteNumber(value.milestoneQuality) &&
    isFiniteNumber(value.archiveReasonModifier) &&
    isFiniteNumber(value.challengeModifier) &&
    isFiniteNumber(value.shallowRunModifier) &&
    isFiniteNumber(value.repeatedWeakRunModifier) &&
    isFiniteNumber(value.rawScore) &&
    isFiniteNumber(value.modifiedScore) &&
    isFiniteNumber(value.finalAmount)
  );
}

function isRunLegacyPayoutBaselineState(
  value: unknown
): value is RunLegacyPayoutBaselineState {
  return isRecord(value) && isNonNegativeInteger(value.echoLevel);
}

function isLegacyUnlockState(value: unknown): value is LegacyUnlockState {
  return (
    isRecord(value) &&
    typeof value.unlockId === "string" &&
    typeof value.unlockedAt === "string" &&
    typeof value.sourceTransactionId === "string" &&
    (value.rank === undefined || isPositiveInteger(value.rank))
  );
}

function isLegacyTransactionState(value: unknown): value is LegacyTransactionState {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    (value.kind === "grant" || value.kind === "spend") &&
    isNonNegativeInteger(value.amount) &&
    isNonNegativeInteger(value.balanceAfter) &&
    typeof value.recordedAt === "string" &&
    typeof value.summary === "string" &&
    typeof value.sourceType === "string" &&
    typeof value.sourceId === "string" &&
    (typeof value.unlockId === "string" || value.unlockId === undefined)
  );
}

function isAccountLegacyState(value: unknown): value is AccountLegacyState {
  return (
    isRecord(value) &&
    isNonNegativeInteger(value.legacyPoints) &&
    isNonNegativeInteger(value.lifetimeLegacyEarned) &&
    Array.isArray(value.legacyUnlocks) &&
    value.legacyUnlocks.every(isLegacyUnlockState) &&
    Array.isArray(value.legacyTransactions) &&
    value.legacyTransactions.every(isLegacyTransactionState) &&
    (value.selectedPreparationUnlockIds === undefined ||
      (Array.isArray(value.selectedPreparationUnlockIds) &&
        value.selectedPreparationUnlockIds.every((entry) => typeof entry === "string"))) &&
    (value.selectedPreparationChoicePayloads === undefined ||
      (isRecord(value.selectedPreparationChoicePayloads) &&
        Object.values(value.selectedPreparationChoicePayloads).every(
          (entry) => typeof entry === "string"
        )))
  );
}

function isAccountAchievementUnlockState(value: unknown): value is AccountAchievementUnlockState {
  return (
    isRecord(value) &&
    typeof value.achievementId === "string" &&
    typeof value.unlockedAt === "string" &&
    typeof value.sourceCharacterId === "string" &&
    (typeof value.rewardTransactionId === "string" || value.rewardTransactionId === undefined)
  );
}

function isAchievementMetricRecord(value: unknown): value is Record<AchievementMetricId, number> {
  return (
    isRecord(value) &&
    ACHIEVEMENT_METRIC_IDS.every(
      (metricId) => value[metricId] === undefined || isNonNegativeInteger(value[metricId])
    )
  );
}

function isAccountAchievementsState(value: unknown): value is AccountAchievementsState {
  return (
    isRecord(value) &&
    Array.isArray(value.unlocked) &&
    value.unlocked.every(isAccountAchievementUnlockState) &&
    Array.isArray(value.revealedCharacterAchievementIds) &&
    value.revealedCharacterAchievementIds.every((entry) => typeof entry === "string") &&
    isAchievementMetricRecord(value.cumulativeMetrics) &&
    isRecord(value.characterMetricHighWaterMarks) &&
    Object.values(value.characterMetricHighWaterMarks).every(
      (record) => isRecord(record) && isAchievementMetricRecord(record)
    )
  );
}

function isAccountRunHistoryRecord(value: unknown): value is AccountRunHistoryRecord {
  return (
    isRecord(value) &&
    typeof value.characterId === "string" &&
    typeof value.name === "string" &&
    typeof value.lineageId === "string" &&
    (typeof value.familyId === "string" || value.familyId === undefined) &&
    (typeof value.parentCharacterId === "string" ||
      value.parentCharacterId === undefined) &&
    typeof value.startingContinentId === "string" &&
    typeof value.startingRegionId === "string" &&
    typeof value.startingSettlementId === "string" &&
    typeof value.startedAt === "string" &&
    (typeof value.endedAt === "string" || value.endedAt === undefined) &&
    typeof value.lastSeenAt === "string" &&
    (value.outcome === "active" ||
      value.outcome === "retired" ||
      value.outcome === "archived" ||
      value.outcome === "deleted") &&
    (value.archiveReason === "retired" ||
      value.archiveReason === "dead" ||
      value.archiveReason === "hardcore_dead" ||
      value.archiveReason === undefined) &&
    isNonNegativeInteger(value.echoLevelReached) &&
    Array.isArray(value.notableCharacterAchievementIds) &&
    value.notableCharacterAchievementIds.every((entry) => typeof entry === "string") &&
    (value.legacyPayoutBaseline === undefined ||
      isRunLegacyPayoutBaselineState(value.legacyPayoutBaseline)) &&
    (value.legacyGranted === undefined || isNonNegativeInteger(value.legacyGranted)) &&
    (value.inheritanceUsesRemaining === undefined ||
      isNonNegativeInteger(value.inheritanceUsesRemaining)) &&
    (value.totalPlayTicks === undefined || isNonNegativeInteger(value.totalPlayTicks)) &&
    (value.survivedDays === undefined || isNonNegativeInteger(value.survivedDays)) &&
    (typeof value.payoutEligible === "boolean" || value.payoutEligible === undefined) &&
    (value.payoutBreakdown === undefined ||
      isRunLegacyPayoutBreakdownState(value.payoutBreakdown)) &&
    (typeof value.legacyPayoutResolvedAt === "string" ||
      value.legacyPayoutResolvedAt === undefined) &&
    (typeof value.legacyPayoutTransactionId === "string" ||
      value.legacyPayoutTransactionId === undefined) &&
    (typeof value.sourceRunId === "string" || value.sourceRunId === undefined) &&
    (typeof value.crossLineageStart === "boolean" ||
      value.crossLineageStart === undefined) &&
    Array.isArray(value.saveSlotIds) &&
    value.saveSlotIds.every((entry) => typeof entry === "string")
  );
}

function isAccountHistoryState(value: unknown): value is AccountHistoryState {
  return (
    isRecord(value) &&
    Array.isArray(value.runRecords) &&
    value.runRecords.every(isAccountRunHistoryRecord)
  );
}

function isAccountFamilyRecord(value: unknown): value is AccountFamilyRecord {
  return (
    isRecord(value) &&
    typeof value.familyId === "string" &&
    typeof value.familyName === "string" &&
    (typeof value.rootCharacterId === "string" || value.rootCharacterId === null) &&
    typeof value.status === "string" &&
    ACCOUNT_FAMILY_STATUS_SET.has(value.status) &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string" &&
    Array.isArray(value.memberCharacterIds) &&
    value.memberCharacterIds.every((entry) => typeof entry === "string") &&
    Array.isArray(value.notes) &&
    value.notes.every((entry) => typeof entry === "string")
  );
}

function isFamilyPrestigeTransactionState(
  value: unknown
): value is FamilyPrestigeTransactionState {
  return (
    isRecord(value) &&
    typeof value.transactionId === "string" &&
    typeof value.familyId === "string" &&
    typeof value.kind === "string" &&
    FAMILY_PRESTIGE_TRANSACTION_KIND_SET.has(value.kind) &&
    isPositiveInteger(value.amount) &&
    typeof value.categoryTag === "string" &&
    FAMILY_PRESTIGE_CATEGORY_TAG_SET.has(value.categoryTag) &&
    typeof value.sourceType === "string" &&
    typeof value.sourceId === "string" &&
    typeof value.recordedAt === "string" &&
    typeof value.summary === "string" &&
    (typeof value.characterId === "string" || value.characterId === undefined) &&
    (typeof value.sourceRunId === "string" || value.sourceRunId === undefined) &&
    (typeof value.unlockId === "string" || value.unlockId === undefined)
  );
}

function isAccountFamilyUnlockState(value: unknown): value is AccountFamilyUnlockState {
  return (
    isRecord(value) &&
    isNonEmptyString(value.unlockId) &&
    isNonEmptyString(value.familyId) &&
    isNonEmptyString(value.unlockedAt) &&
    isNonEmptyString(value.sourceTransactionId) &&
    (value.rank === undefined || isPositiveInteger(value.rank))
  );
}

function isAccountFamiliesState(value: unknown): value is AccountFamiliesState {
  if (
    !isRecord(value) ||
    !Array.isArray(value.families) ||
    !value.families.every(isAccountFamilyRecord) ||
    !Array.isArray(value.prestigeTransactions) ||
    !value.prestigeTransactions.every(isFamilyPrestigeTransactionState) ||
    !Array.isArray(value.familyUnlocks) ||
    !value.familyUnlocks.every(isAccountFamilyUnlockState)
  ) {
    return false;
  }

  const familyIds = new Set(value.families.map((family) => family.familyId));
  const transactionFamilyIds = new Map(
    value.prestigeTransactions.map((transaction) => [
      transaction.transactionId,
      transaction.familyId
    ])
  );
  const seenFamilyUnlocks = new Set<string>();

  return (
    value.prestigeTransactions.every((transaction) => familyIds.has(transaction.familyId)) &&
    value.familyUnlocks.every((unlock) => {
      if (!familyIds.has(unlock.familyId)) {
        return false;
      }

      if (transactionFamilyIds.get(unlock.sourceTransactionId) !== unlock.familyId) {
        return false;
      }

      const duplicateKey = `${unlock.familyId}\u0000${unlock.unlockId}`;
      if (seenFamilyUnlocks.has(duplicateKey)) {
        return false;
      }

      seenFamilyUnlocks.add(duplicateKey);
      return true;
    })
  );
}

function isEstateLocationState(value: unknown): value is NonNullable<AccountEstateAssetRecord["location"]> {
  return (
    isRecord(value) &&
    (typeof value.settlementId === "string" || value.settlementId === undefined) &&
    (typeof value.regionId === "string" || value.regionId === undefined) &&
    (typeof value.continentId === "string" || value.continentId === undefined)
  );
}

function isAccountEstateDepositRecord(value: unknown): value is AccountEstateDepositRecord {
  return (
    isRecord(value) &&
    typeof value.depositId === "string" &&
    typeof value.sourceRunId === "string" &&
    typeof value.sourceCharacterId === "string" &&
    typeof value.sourceName === "string" &&
    (value.archiveReason === "retired" ||
      value.archiveReason === "dead" ||
      value.archiveReason === "hardcore_dead") &&
    typeof value.depositedAt === "string"
  );
}

function isAccountEstateAssetRecord(value: unknown): value is AccountEstateAssetRecord {
  return (
    isRecord(value) &&
    typeof value.estateAssetId === "string" &&
    typeof value.sourceRunId === "string" &&
    typeof value.depositedAt === "string" &&
    (value.assetKind === "currency" ||
      value.assetKind === "item" ||
      value.assetKind === "operational") &&
    isNonNegativeInteger(value.quantityClaimed) &&
    (value.currencyKey === "gold" ||
      value.currencyKey === "silver" ||
      value.currencyKey === "copper" ||
      value.currencyKey === undefined) &&
    (typeof value.itemId === "string" || value.itemId === undefined) &&
    (typeof value.itemKey === "string" || value.itemKey === undefined) &&
    (value.quantityDeposited === undefined || isNonNegativeInteger(value.quantityDeposited)) &&
    (typeof value.assetId === "string" || value.assetId === undefined) &&
    (value.assetType === "business" ||
      value.assetType === "workshop" ||
      value.assetType === "property" ||
      value.assetType === "holding" ||
      value.assetType === undefined) &&
    (typeof value.displayName === "string" || value.displayName === undefined) &&
    (value.location === undefined || isEstateLocationState(value.location)) &&
    (typeof value.ownershipState === "string" || value.ownershipState === undefined) &&
    (typeof value.operatingState === "string" || value.operatingState === undefined) &&
    (typeof value.storedValueSummary === "string" ||
      value.storedValueSummary === undefined)
  );
}

function isAccountEstateState(value: unknown): value is AccountEstateState {
  return (
    isRecord(value) &&
    Array.isArray(value.deposits) &&
    value.deposits.every(isAccountEstateDepositRecord) &&
    Array.isArray(value.assets) &&
    value.assets.every(isAccountEstateAssetRecord)
  );
}

function isAccountProfileState(value: unknown): value is AccountProfileState {
  return (
    isRecord(value) &&
    typeof value.accountId === "string" &&
    typeof value.displayName === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string" &&
    (typeof value.lastPlayedAt === "string" || value.lastPlayedAt === undefined) &&
    isAccountLegacyState(value.legacy) &&
    (value.achievements === undefined || isAccountAchievementsState(value.achievements)) &&
    (value.history === undefined || isAccountHistoryState(value.history)) &&
    isAccountFamiliesState(value.families) &&
    (value.estate === undefined || isAccountEstateState(value.estate))
  );
}

function normalizeAchievements(
  achievements: AccountAchievementsState | undefined
): AccountAchievementsState {
  const defaults = createDefaultAccountAchievementsState();

  if (!achievements) {
    return defaults;
  }

  return {
    unlocked: achievements.unlocked.map((entry) => ({ ...entry })),
    revealedCharacterAchievementIds: [...new Set(achievements.revealedCharacterAchievementIds)],
    cumulativeMetrics: {
      ...createAchievementMetricRecord(),
      ...Object.fromEntries(
        Object.entries(achievements.cumulativeMetrics ?? {}).map(([metricId, value]) => [
          metricId,
          Math.max(0, Math.trunc(value as number))
        ])
      )
    },
    characterMetricHighWaterMarks: Object.fromEntries(
      Object.entries(achievements.characterMetricHighWaterMarks ?? {}).map(
        ([characterId, record]) => [
          characterId,
          Object.fromEntries(
            Object.entries(record ?? {}).map(([metricId, value]) => [
              metricId,
              Math.max(0, Math.trunc(value as number))
            ])
          ) as Partial<Record<AchievementMetricId, number>>
        ]
      )
    )
  };
}

function normalizeHistory(history: AccountHistoryState | undefined): AccountHistoryState {
  const defaults = createDefaultAccountHistoryState();

  if (!history) {
    return defaults;
  }

  const normalizeFinite = (value: number): number => Math.max(0, value);
  const normalizeBreakdown = (
    breakdown: RunLegacyPayoutBreakdownState
  ): RunLegacyPayoutBreakdownState => ({
    progressionDepth: normalizeFinite(breakdown.progressionDepth),
    notableDeeds: normalizeFinite(breakdown.notableDeeds),
    survivalDepth: normalizeFinite(breakdown.survivalDepth),
    milestoneQuality: normalizeFinite(breakdown.milestoneQuality),
    archiveReasonModifier: normalizeFinite(breakdown.archiveReasonModifier),
    challengeModifier: normalizeFinite(breakdown.challengeModifier),
    shallowRunModifier: normalizeFinite(breakdown.shallowRunModifier),
    repeatedWeakRunModifier: normalizeFinite(breakdown.repeatedWeakRunModifier),
    rawScore: normalizeFinite(breakdown.rawScore),
    modifiedScore: normalizeFinite(breakdown.modifiedScore),
    finalAmount: normalizeFinite(breakdown.finalAmount)
  });

  return {
    runRecords: history.runRecords.map((record) => ({
      ...record,
      ...(record.familyId !== undefined ? { familyId: record.familyId } : {}),
      ...(record.parentCharacterId !== undefined
        ? { parentCharacterId: record.parentCharacterId }
        : {}),
      echoLevelReached: Math.max(0, Math.trunc(record.echoLevelReached)),
      notableCharacterAchievementIds: [...new Set(record.notableCharacterAchievementIds)],
      ...(record.legacyPayoutBaseline !== undefined
        ? {
            legacyPayoutBaseline: {
              echoLevel: Math.max(0, Math.trunc(record.legacyPayoutBaseline.echoLevel))
            }
          }
        : {}),
      ...(record.legacyGranted !== undefined
        ? { legacyGranted: Math.max(0, Math.trunc(record.legacyGranted)) }
        : {}),
      ...(record.inheritanceUsesRemaining !== undefined
        ? { inheritanceUsesRemaining: Math.max(0, Math.trunc(record.inheritanceUsesRemaining)) }
        : {}),
      ...(record.totalPlayTicks !== undefined
        ? { totalPlayTicks: Math.max(0, Math.trunc(record.totalPlayTicks)) }
        : {}),
      ...(record.survivedDays !== undefined
        ? { survivedDays: Math.max(0, Math.trunc(record.survivedDays)) }
        : {}),
      ...(record.payoutEligible !== undefined
        ? { payoutEligible: record.payoutEligible }
        : {}),
      ...(record.payoutBreakdown !== undefined
        ? { payoutBreakdown: normalizeBreakdown(record.payoutBreakdown) }
        : {}),
      ...(record.legacyPayoutResolvedAt !== undefined
        ? { legacyPayoutResolvedAt: record.legacyPayoutResolvedAt }
        : {}),
      ...(record.legacyPayoutTransactionId !== undefined
        ? { legacyPayoutTransactionId: record.legacyPayoutTransactionId }
        : {}),
      ...(record.sourceRunId !== undefined ? { sourceRunId: record.sourceRunId } : {}),
      ...(record.crossLineageStart !== undefined
        ? { crossLineageStart: record.crossLineageStart }
        : {}),
      saveSlotIds: [...new Set(record.saveSlotIds)]
    }))
  };
}

function normalizeFamilies(families: AccountFamiliesState): AccountFamiliesState {
  const defaults = createDefaultAccountFamiliesState();

  if (!families) {
    return defaults;
  }

  const seenFamilies = new Set<string>();
  const normalizedFamilies = families.families.flatMap((family) => {
    if (seenFamilies.has(family.familyId)) {
      return [];
    }

    seenFamilies.add(family.familyId);
    return [
      {
        familyId: family.familyId,
        familyName: family.familyName,
        rootCharacterId: family.rootCharacterId,
        status: family.status,
        createdAt: family.createdAt,
        updatedAt: family.updatedAt,
        memberCharacterIds: [...new Set(family.memberCharacterIds)],
        notes: [...family.notes]
      }
    ];
  });
  const familyIds = new Set(normalizedFamilies.map((family) => family.familyId));
  const seenTransactions = new Set<string>();
  const prestigeTransactions = families.prestigeTransactions.flatMap((transaction) => {
    if (
      seenTransactions.has(transaction.transactionId) ||
      !familyIds.has(transaction.familyId)
    ) {
      return [];
    }

    seenTransactions.add(transaction.transactionId);
    return [
      {
        transactionId: transaction.transactionId,
        familyId: transaction.familyId,
        kind: transaction.kind,
        amount: Math.max(1, Math.trunc(transaction.amount)),
        categoryTag: transaction.categoryTag,
        sourceType: transaction.sourceType,
        sourceId: transaction.sourceId,
        recordedAt: transaction.recordedAt,
        summary: transaction.summary,
        ...(transaction.characterId ? { characterId: transaction.characterId } : {}),
        ...(transaction.sourceRunId ? { sourceRunId: transaction.sourceRunId } : {}),
        ...(transaction.unlockId ? { unlockId: transaction.unlockId } : {})
      }
    ];
  });
  const transactionFamilyIds = new Map(
    prestigeTransactions.map((transaction) => [
      transaction.transactionId,
      transaction.familyId
    ])
  );
  const seenFamilyUnlocks = new Set<string>();
  const familyUnlocks = families.familyUnlocks.flatMap((unlock) => {
    const duplicateKey = `${unlock.familyId}\u0000${unlock.unlockId}`;
    if (
      seenFamilyUnlocks.has(duplicateKey) ||
      !familyIds.has(unlock.familyId) ||
      transactionFamilyIds.get(unlock.sourceTransactionId) !== unlock.familyId
    ) {
      return [];
    }

    seenFamilyUnlocks.add(duplicateKey);
    return [
      {
        unlockId: unlock.unlockId,
        familyId: unlock.familyId,
        unlockedAt: unlock.unlockedAt,
        sourceTransactionId: unlock.sourceTransactionId,
        ...(unlock.rank !== undefined ? { rank: Math.max(1, Math.trunc(unlock.rank)) } : {})
      }
    ];
  });

  return {
    families: normalizedFamilies,
    prestigeTransactions,
    familyUnlocks
  };
}

function normalizeEstate(estate: AccountEstateState | undefined): AccountEstateState {
  const defaults = createDefaultAccountEstateState();

  if (!estate) {
    return defaults;
  }

  const seenDeposits = new Set<string>();
  const deposits = estate.deposits.flatMap((deposit) => {
    if (seenDeposits.has(deposit.depositId)) {
      return [];
    }

    seenDeposits.add(deposit.depositId);
    return [
      {
        depositId: deposit.depositId,
        sourceRunId: deposit.sourceRunId,
        sourceCharacterId: deposit.sourceCharacterId,
        sourceName: deposit.sourceName,
        archiveReason: deposit.archiveReason,
        depositedAt: deposit.depositedAt
      }
    ];
  });
  const seenAssets = new Set<string>();
  const assets = estate.assets.flatMap((asset) => {
    if (seenAssets.has(asset.estateAssetId)) {
      return [];
    }

    seenAssets.add(asset.estateAssetId);
    return [
      {
        estateAssetId: asset.estateAssetId,
        sourceRunId: asset.sourceRunId,
        depositedAt: asset.depositedAt,
        assetKind: asset.assetKind,
        quantityClaimed: Math.max(0, Math.trunc(asset.quantityClaimed)),
        ...(asset.currencyKey ? { currencyKey: asset.currencyKey } : {}),
        ...(asset.itemId ? { itemId: asset.itemId } : {}),
        ...(asset.itemKey ? { itemKey: asset.itemKey } : {}),
        ...(asset.quantityDeposited !== undefined
          ? { quantityDeposited: Math.max(0, Math.trunc(asset.quantityDeposited)) }
          : {}),
        ...(asset.assetId ? { assetId: asset.assetId } : {}),
        ...(asset.assetType ? { assetType: asset.assetType } : {}),
        ...(asset.displayName ? { displayName: asset.displayName } : {}),
        ...(asset.location ? { location: { ...asset.location } } : {}),
        ...(asset.ownershipState ? { ownershipState: asset.ownershipState } : {}),
        ...(asset.operatingState ? { operatingState: asset.operatingState } : {}),
        ...(asset.storedValueSummary ? { storedValueSummary: asset.storedValueSummary } : {})
      }
    ];
  });

  return {
    deposits,
    assets
  };
}

function normalizeProfile(profile: AccountProfileState): AccountProfileState {
  const normalized: AccountProfileState = {
    accountId: sanitizeAccountId(profile.accountId),
    displayName: sanitizeDisplayName(profile.displayName),
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
    ...(profile.lastPlayedAt ? { lastPlayedAt: profile.lastPlayedAt } : {}),
    legacy: {
      legacyPoints: Math.max(0, Math.trunc(profile.legacy.legacyPoints)),
      lifetimeLegacyEarned: Math.max(0, Math.trunc(profile.legacy.lifetimeLegacyEarned)),
      legacyUnlocks: profile.legacy.legacyUnlocks.map((entry) => ({
        unlockId: entry.unlockId,
        unlockedAt: entry.unlockedAt,
        sourceTransactionId: entry.sourceTransactionId,
        ...(entry.rank !== undefined ? { rank: Math.max(1, Math.trunc(entry.rank)) } : {})
      })),
      legacyTransactions: profile.legacy.legacyTransactions.map((entry) => ({
        ...entry,
        amount: Math.max(0, Math.trunc(entry.amount)),
        balanceAfter: Math.max(0, Math.trunc(entry.balanceAfter))
      })),
      selectedPreparationUnlockIds: Array.isArray(profile.legacy.selectedPreparationUnlockIds)
        ? profile.legacy.selectedPreparationUnlockIds.filter((entry) => typeof entry === "string")
        : [],
      selectedPreparationChoicePayloads: isRecord(profile.legacy.selectedPreparationChoicePayloads)
        ? Object.fromEntries(
            Object.entries(profile.legacy.selectedPreparationChoicePayloads).filter(
              ([unlockId, payload]) =>
                typeof unlockId === "string" &&
                unlockId.length > 0 &&
                typeof payload === "string" &&
                payload.trim().length > 0
            )
          )
        : {}
    },
    achievements: normalizeAchievements(profile.achievements),
    history: normalizeHistory(profile.history),
    families: normalizeFamilies(profile.families),
    estate: normalizeEstate(profile.estate)
  };
  const selection = resolveLegacyPreparationSelection(normalized);

  return {
    ...normalized,
    legacy: {
      ...normalized.legacy,
      selectedPreparationUnlockIds: selection.selectedUnlockIds,
      selectedPreparationChoicePayloads: selection.selectedChoicePayloads
    }
  };
}

function createDefaultProfile(accountId: string): AccountProfileState {
  return createDefaultAccountProfileState({
    accountId,
    displayName: DEFAULT_ACCOUNT_DISPLAY_NAME
  });
}

function parseStoredAccountProfile(
  normalizedAccountId: string,
  raw: string
): AccountProfileState {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`Stored account profile '${normalizedAccountId}' is malformed.`);
  }

  if (!isAccountProfileState(parsed)) {
    throw new Error(`Stored account profile '${normalizedAccountId}' is malformed.`);
  }

  return normalizeProfile(parsed);
}

export function resolveActiveAccountId(): string {
  const storage = getAccountStorage();
  const stored = storage.getItem(ACTIVE_ACCOUNT_KEY);
  const accountId = sanitizeAccountId(stored);

  if (stored !== accountId) {
    storage.setItem(ACTIVE_ACCOUNT_KEY, accountId);
  }

  return accountId;
}

export function setActiveAccountId(accountId: string): string {
  const storage = getAccountStorage();
  const normalizedAccountId = sanitizeAccountId(accountId);
  storage.setItem(ACTIVE_ACCOUNT_KEY, normalizedAccountId);
  return normalizedAccountId;
}

export function clearActiveAccountId(accountId?: string): void {
  const storage = getAccountStorage();

  if (!accountId) {
    storage.removeItem(ACTIVE_ACCOUNT_KEY);
    return;
  }

  if (sanitizeAccountId(storage.getItem(ACTIVE_ACCOUNT_KEY)) === sanitizeAccountId(accountId)) {
    storage.removeItem(ACTIVE_ACCOUNT_KEY);
  }
}

export function saveAccountProfile(profile: AccountProfileState): AccountProfileState {
  const storage = getAccountStorage();
  const normalized = normalizeProfile({
    ...profile,
    accountId: sanitizeAccountId(profile.accountId),
    displayName: sanitizeDisplayName(profile.displayName),
    createdAt: profile.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  storage.setItem(getAccountProfileKey(normalized.accountId), JSON.stringify(normalized));
  return normalized;
}

export function deleteStoredAccountProfile(accountId: string): void {
  const storage = getAccountStorage();
  storage.removeItem(getAccountProfileKey(sanitizeAccountId(accountId)));
}

export function loadStoredAccountProfile(accountId: string): AccountProfileState | null {
  const storage = getAccountStorage();
  const normalizedAccountId = sanitizeAccountId(accountId);
  const raw = storage.getItem(getAccountProfileKey(normalizedAccountId));

  if (!raw) {
    return null;
  }

  return parseStoredAccountProfile(normalizedAccountId, raw);
}

export function listStoredAccountProfiles(): AccountProfileState[] {
  const storage = getAccountStorage();
  const profileKeyPrefix = `${ACCOUNT_STORAGE_PREFIX}.account.`;
  const profiles: AccountProfileState[] = [];

  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);

    if (!key || !key.startsWith(profileKeyPrefix)) {
      continue;
    }

    const accountId = sanitizeAccountId(key.slice(profileKeyPrefix.length));
    const raw = storage.getItem(key);

    if (!raw) {
      continue;
    }

    profiles.push(parseStoredAccountProfile(accountId, raw));
  }

  return profiles.sort((left, right) => {
    const leftSortKey = left.lastPlayedAt ?? left.updatedAt ?? left.createdAt;
    const rightSortKey = right.lastPlayedAt ?? right.updatedAt ?? right.createdAt;
    return rightSortKey.localeCompare(leftSortKey) || left.displayName.localeCompare(right.displayName);
  });
}

export function loadAccountProfile(accountId: string): AccountProfileState {
  const storage = getAccountStorage();
  const normalizedAccountId = sanitizeAccountId(accountId);
  const raw = storage.getItem(getAccountProfileKey(normalizedAccountId));

  if (!raw) {
    const created = createDefaultProfile(normalizedAccountId);
    return saveAccountProfile(created);
  }

  return parseStoredAccountProfile(normalizedAccountId, raw);
}

export function loadActiveAccountProfile(): AccountProfileState {
  const accountId = resolveActiveAccountId();
  return loadAccountProfile(accountId);
}
