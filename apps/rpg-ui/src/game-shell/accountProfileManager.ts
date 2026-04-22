import type {
  AccountAchievementUnlockState,
  AccountAchievementsState,
  AccountHistoryState,
  AccountLegacyState,
  AccountProfileState,
  AccountRunHistoryRecord,
  AchievementMetricId,
  LegacyTransactionState,
  LegacyUnlockState,
  RunLegacyPayoutBreakdownState
} from "../../../../packages/shared/types/src/index.js";
import {
  DEFAULT_ACCOUNT_DISPLAY_NAME,
  DEFAULT_ACCOUNT_ID,
  createDefaultAccountProfileState
} from "../../../../packages/engines/game-engine/src/legacy-account.js";
import {
  ACHIEVEMENT_METRIC_IDS,
  createAchievementMetricRecord,
  createDefaultAccountAchievementsState,
  createDefaultAccountHistoryState
} from "../../../../packages/engines/game-engine/src/account-achievement-state.js";

const ACCOUNT_STORAGE_PREFIX = "cataclysm-rpg-ui.accounts.v1";
const ACTIVE_ACCOUNT_KEY = `${ACCOUNT_STORAGE_PREFIX}.active-account`;

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
    value.legacyTransactions.every(isLegacyTransactionState)
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
    (value.history === undefined || isAccountHistoryState(value.history))
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
      echoLevelReached: Math.max(0, Math.trunc(record.echoLevelReached)),
      notableCharacterAchievementIds: [...new Set(record.notableCharacterAchievementIds)],
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
      saveSlotIds: [...new Set(record.saveSlotIds)]
    }))
  };
}

function normalizeProfile(profile: AccountProfileState): AccountProfileState {
  return {
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
      }))
    },
    achievements: normalizeAchievements(profile.achievements),
    history: normalizeHistory(profile.history)
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
