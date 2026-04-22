import type {
  AccountProfileState,
  AccountRunArchiveReason,
  AccountRunHistoryRecord,
  RunLegacyPayoutBreakdownState
} from "../../../shared/types/src/index.js";

export type RunLegacyPayoutRules = {
  minimumEchoLevel: number;
  minimumNotableDeeds: number;
  progressionDepthWeight: number;
  notableDeedWeight: number;
  survivalDepthWeight: number;
  milestoneQualityWeight: number;
  scorePerLegacyPoint: number;
  minimumPositivePayout: number;
  shallowEchoLevel: number;
  shallowTotalPlayTicks: number;
  shallowRunModifier: number;
  archiveReasonModifiers: Record<AccountRunArchiveReason, number>;
  challengeModifier: number;
  repeatedWeakRunModifier: number;
};

export type RunLegacyPayoutResolution = {
  payoutEligible: boolean;
  legacyGranted: number;
  payoutBreakdown: RunLegacyPayoutBreakdownState;
  summary: string;
  sourceType: string;
  sourceId: string;
};

export const DEFAULT_RUN_LEGACY_PAYOUT_RULES: RunLegacyPayoutRules = {
  minimumEchoLevel: 3,
  minimumNotableDeeds: 1,
  progressionDepthWeight: 3,
  notableDeedWeight: 10,
  survivalDepthWeight: 1,
  milestoneQualityWeight: 4,
  scorePerLegacyPoint: 10,
  minimumPositivePayout: 1,
  shallowEchoLevel: 2,
  shallowTotalPlayTicks: 120,
  shallowRunModifier: 0,
  archiveReasonModifiers: {
    retired: 1,
    dead: 0.8,
    hardcore_dead: 1.25
  },
  challengeModifier: 1,
  repeatedWeakRunModifier: 1
};

function nonNegativeInteger(value: number | undefined): number {
  return Number.isFinite(value) ? Math.max(0, Math.trunc(value ?? 0)) : 0;
}

function resolveArchiveReasonModifier(
  record: AccountRunHistoryRecord,
  rules: RunLegacyPayoutRules
): number {
  if (record.archiveReason) {
    return rules.archiveReasonModifiers[record.archiveReason] ?? 1;
  }

  return record.outcome === "retired" ? rules.archiveReasonModifiers.retired : 1;
}

function isPayoutAuthoritativeOutcome(record: AccountRunHistoryRecord): boolean {
  return record.outcome === "archived" || record.outcome === "retired";
}

export function hasRunLegacyPayoutResolved(record: AccountRunHistoryRecord): boolean {
  return typeof record.legacyPayoutResolvedAt === "string" && record.legacyPayoutResolvedAt.length > 0;
}

export function isRunEligibleForLegacyPayout(
  record: AccountRunHistoryRecord,
  _accountProfile?: AccountProfileState,
  rules: RunLegacyPayoutRules = DEFAULT_RUN_LEGACY_PAYOUT_RULES
): boolean {
  if (!isPayoutAuthoritativeOutcome(record) || hasRunLegacyPayoutResolved(record)) {
    return false;
  }

  const echoLevel = nonNegativeInteger(record.echoLevelReached);
  const notableDeedCount = record.notableCharacterAchievementIds.length;

  return echoLevel >= rules.minimumEchoLevel || notableDeedCount >= rules.minimumNotableDeeds;
}

function resolvePayoutBreakdown(
  record: AccountRunHistoryRecord,
  eligible: boolean,
  rules: RunLegacyPayoutRules
): RunLegacyPayoutBreakdownState {
  const echoLevel = nonNegativeInteger(record.echoLevelReached);
  const notableDeedCount = record.notableCharacterAchievementIds.length;
  const totalPlayTicks = nonNegativeInteger(record.totalPlayTicks);
  const survivedDays = nonNegativeInteger(record.survivedDays);
  const progressionDepth = Math.max(0, echoLevel - 1) ** 2 * rules.progressionDepthWeight;
  const notableDeeds = notableDeedCount ** 2 * rules.notableDeedWeight;
  const survivalDepth = Math.floor(Math.sqrt(survivedDays)) * rules.survivalDepthWeight;
  const milestoneQuality =
    (Math.floor(echoLevel / 5) ** 2 + notableDeedCount) * rules.milestoneQualityWeight;
  const archiveReasonModifier = resolveArchiveReasonModifier(record, rules);
  const shallowRunModifier =
    echoLevel <= rules.shallowEchoLevel &&
    notableDeedCount === 0 &&
    totalPlayTicks < rules.shallowTotalPlayTicks
      ? rules.shallowRunModifier
      : 1;
  const rawScore = progressionDepth + notableDeeds + survivalDepth + milestoneQuality;
  const modifiedScore =
    rawScore *
    archiveReasonModifier *
    rules.challengeModifier *
    shallowRunModifier *
    rules.repeatedWeakRunModifier;
  const resolvedAmount = eligible
    ? Math.max(
        modifiedScore > 0 ? rules.minimumPositivePayout : 0,
        Math.floor(modifiedScore / rules.scorePerLegacyPoint)
      )
    : 0;

  return {
    progressionDepth,
    notableDeeds,
    survivalDepth,
    milestoneQuality,
    archiveReasonModifier,
    challengeModifier: rules.challengeModifier,
    shallowRunModifier,
    repeatedWeakRunModifier: rules.repeatedWeakRunModifier,
    rawScore,
    modifiedScore,
    finalAmount: resolvedAmount
  };
}

export function resolveRunLegacyPayout(
  record: AccountRunHistoryRecord,
  accountProfile?: AccountProfileState,
  rules: RunLegacyPayoutRules = DEFAULT_RUN_LEGACY_PAYOUT_RULES
): RunLegacyPayoutResolution {
  const payoutEligible = isRunEligibleForLegacyPayout(record, accountProfile, rules);
  const payoutBreakdown = resolvePayoutBreakdown(record, payoutEligible, rules);
  const playerName = record.name.trim() || "This run";

  return {
    payoutEligible,
    legacyGranted: payoutBreakdown.finalAmount,
    payoutBreakdown,
    summary:
      payoutBreakdown.finalAmount > 0
        ? `${playerName}'s completed run earned ${payoutBreakdown.finalAmount} Legacy.`
        : `${playerName}'s completed run resolved without a Legacy award.`,
    sourceType: "run_lifecycle",
    sourceId: `run.payout.${record.characterId}`
  };
}
