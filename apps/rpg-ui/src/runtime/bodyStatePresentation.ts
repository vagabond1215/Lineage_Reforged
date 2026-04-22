import type {
  ConsumableProfileState,
  BodyEnergyBandId,
  BodyFatigueBandId,
  BodyHydrationBandId,
  BodyIntoxicationBandId,
  BodyProteinBandId,
  PlayerBodyState,
  RecoveryAssessmentState,
  RecoveryContextState,
  SaveSnapshot
} from '../../../../packages/shared/types/src/index.js';
import {
  advancePlayerBodyState,
  applyConsumableToBodyState,
  loadBodyStateBalanceRule
} from '../../../../packages/engines/player-engine/src/index.js';
import type { GameShellNotice } from '../game-shell/state.js';
import type {
  ActionOutcomePreviewViewModel,
  BodyStateAlertLevel,
  BodyStatePillViewModel,
  BodyStateSeverity,
  BodyStateTrend,
  ConditionStripViewModel,
  ConsumableEffectDeltaLabel,
  ConsumableEffectPreviewViewModel,
  NotificationItem,
  ReadinessCardViewModel,
  ReadinessIssueViewModel,
  RecommendedActionViewModel,
  RecoveryProjectionViewModel,
  StatMeterVisualState
} from '../types.js';

export type BodyStateId = 'energy' | 'hydration' | 'fatigue' | 'protein' | 'intoxication';

export type BodyStatePresentationSnapshot = {
  tick: number;
  day: number;
  values: Record<BodyStateId, number>;
  labels: Record<BodyStateId, string>;
  severities: Record<BodyStateId, BodyStateSeverity>;
  bands: Record<BodyStateId, string>;
  starvationLoad: number;
  proteinDeficitLoad: number;
  fatigueDebt: number;
  resolved: PlayerBodyState['resolved'];
};

export type BodyStatePresentationMemory = {
  previousSnapshot: BodyStatePresentationSnapshot | null;
  previousPrimaryOrder: BodyStateId[];
  previousIssueOrder: BodyStateId[];
  warningStreaks: Record<BodyStateId, number>;
  sustainedFlags: Record<BodyStateId, boolean>;
  armedAlertTiers: Partial<Record<BodyStateId, BodyStateAlertLevel>>;
  notifications: NotificationItem[];
};

export type BodyStatePresentationViewModel = {
  snapshot: BodyStatePresentationSnapshot;
  conditionStrip: ConditionStripViewModel;
  readinessCard: ReadinessCardViewModel;
  recoveryProjection: RecoveryProjectionViewModel;
  staminaVisualState: StatMeterVisualState;
  alertLevels: Partial<Record<BodyStateId, BodyStateAlertLevel>>;
  warningStreaks: Record<BodyStateId, number>;
  sustainedFlags: Record<BodyStateId, boolean>;
  ephemeralNotifications: NotificationItem[];
  toastId: string | null;
  toast: GameShellNotice | null;
  nextMemory: BodyStatePresentationMemory;
};

const PRIMARY_STATE_IDS: BodyStateId[] = ['energy', 'hydration', 'fatigue'];
const SECONDARY_STATE_IDS: BodyStateId[] = ['protein', 'intoxication'];
const ALL_STATE_IDS: BodyStateId[] = [...PRIMARY_STATE_IDS, ...SECONDARY_STATE_IDS];

const PRIMARY_PRIORITY: Record<BodyStateId, number> = {
  hydration: 0,
  fatigue: 1,
  energy: 2,
  protein: 3,
  intoxication: 4
};

const ISSUE_PRIORITY: Record<BodyStateId, number> = {
  hydration: 0,
  fatigue: 1,
  energy: 2,
  protein: 3,
  intoxication: 4
};

const POSITIVE_DIRECTION: Record<BodyStateId, 1 | -1> = {
  energy: 1,
  hydration: 1,
  fatigue: -1,
  protein: 1,
  intoxication: -1
};

const TREND_THRESHOLDS: Record<BodyStateId, number> = {
  energy: 4,
  hydration: 4,
  fatigue: 3,
  protein: 5,
  intoxication: 3
};

const BAND_ORDER: Record<BodyStateId, string[]> = {
  energy: ['drained', 'low_energy', 'stable', 'well_fed'],
  hydration: ['severely_dehydrated', 'dehydrated', 'slightly_dehydrated', 'optimal'],
  fatigue: ['exhausted', 'fatigued', 'strained', 'fresh'],
  protein: ['deficient', 'thin_diet', 'supported', 'protein_rich'],
  intoxication: ['blackout_risk', 'heavily_intoxicated', 'drunk', 'buzzed', 'clear']
};

function severityRank(severity: BodyStateSeverity): number {
  return severity === 'critical' ? 2 : severity === 'warning' ? 1 : 0;
}

function alertRank(level: BodyStateAlertLevel | undefined): number {
  return level === 'hard' ? 3 : level === 'medium' ? 2 : level === 'soft' ? 1 : 0;
}

function createEmptyWarningStreaks(): Record<BodyStateId, number> {
  return {
    energy: 0,
    hydration: 0,
    fatigue: 0,
    protein: 0,
    intoxication: 0
  };
}

function createEmptySustainedFlags(): Record<BodyStateId, boolean> {
  return {
    energy: false,
    hydration: false,
    fatigue: false,
    protein: false,
    intoxication: false
  };
}

export function createInitialBodyStatePresentationMemory(): BodyStatePresentationMemory {
  return {
    previousSnapshot: null,
    previousPrimaryOrder: [...PRIMARY_STATE_IDS],
    previousIssueOrder: [...ALL_STATE_IDS],
    warningStreaks: createEmptyWarningStreaks(),
    sustainedFlags: createEmptySustainedFlags(),
    armedAlertTiers: {},
    notifications: []
  };
}

export function formatEnergyBandLabel(band: BodyEnergyBandId): string {
  return band === 'well_fed'
    ? 'Well Fed'
    : band === 'stable'
      ? 'Stable'
      : band === 'low_energy'
        ? 'Low Energy'
        : 'Drained';
}

export function formatProteinBandLabel(band: BodyProteinBandId): string {
  return band === 'protein_rich'
    ? 'Protein-Rich'
    : band === 'supported'
      ? 'Supported'
      : band === 'thin_diet'
        ? 'Thin Diet'
        : 'Deficient';
}

export function formatHydrationBandLabel(band: BodyHydrationBandId): string {
  return band === 'optimal'
    ? 'Hydrated'
    : band === 'slightly_dehydrated'
      ? 'Slightly Dry'
      : band === 'dehydrated'
        ? 'Dehydrated'
        : 'Severely Dehydrated';
}

export function formatFatigueBandLabel(band: BodyFatigueBandId): string {
  return band === 'fresh'
    ? 'Fresh'
    : band === 'strained'
      ? 'Strained'
      : band === 'fatigued'
        ? 'Fatigued'
        : 'Exhausted';
}

export function formatIntoxicationBandLabel(band: BodyIntoxicationBandId): string {
  return band === 'clear'
    ? 'Clear'
    : band === 'buzzed'
      ? 'Buzzed'
      : band === 'drunk'
        ? 'Drunk'
        : band === 'heavily_intoxicated'
          ? 'Heavily Intoxicated'
          : 'Blackout Risk';
}

function getBandImpact(stateId: BodyStateId, band: string): string {
  if (stateId === 'energy') {
    return band === 'well_fed'
      ? 'stamina recovery steady'
      : band === 'stable'
        ? 'stamina recovery holding'
        : band === 'low_energy'
          ? 'stamina recovery reduced'
          : 'stamina recovery heavily reduced';
  }

  if (stateId === 'hydration') {
    return band === 'optimal'
      ? 'fatigue gain normal'
      : band === 'slightly_dehydrated'
        ? 'fatigue gain rising'
        : band === 'dehydrated'
          ? 'fatigue gain increased'
          : 'fatigue gain sharply increased';
  }

  if (stateId === 'fatigue') {
    return band === 'fresh'
      ? 'action pace steady'
      : band === 'strained'
        ? 'stamina efficiency slipping'
        : band === 'fatigued'
          ? 'stamina and recovery reduced'
          : 'stamina and action efficiency heavily reduced';
  }

  if (stateId === 'protein') {
    return band === 'protein_rich'
      ? 'recovery well supported'
      : band === 'supported'
        ? 'recovery supported'
        : band === 'thin_diet'
          ? 'recovery quality reduced'
          : 'recovery quality impaired';
  }

  return band === 'clear'
    ? 'control steady'
    : band === 'buzzed'
      ? 'judgment loosened'
      : band === 'drunk'
        ? 'hydration loss increased'
        : band === 'heavily_intoxicated'
          ? 'coordination heavily impaired'
          : 'control may fail';
}

function getRecommendedAction(stateId: BodyStateId, band: string): string {
  if (stateId === 'energy' || stateId === 'protein') {
    return band === 'well_fed' ||
      band === 'stable' ||
      band === 'protein_rich' ||
      band === 'supported'
      ? 'stay on the current rhythm'
      : 'eat to recover';
  }

  if (stateId === 'hydration') {
    return band === 'optimal' ? 'keep drinking between shifts' : 'drink to recover';
  }

  if (stateId === 'fatigue') {
    return band === 'fresh' ? 'keep a steady pace' : 'rest to recover';
  }

  return band === 'clear' || band === 'buzzed' ? 'pace the next drink' : 'rest and drink water';
}

function formatTooltip(summary: BodyStatePresentationSnapshot, stateId: BodyStateId): string {
  const label = summary.labels[stateId];
  const effect = getBandImpact(stateId, summary.bands[stateId]);
  const recommendation = getRecommendedAction(stateId, summary.bands[stateId]);
  return `${label} -> ${effect} -> ${recommendation}`;
}

export function getBodyStateDetail(summary: BodyStatePresentationSnapshot, stateId: BodyStateId): string {
  const effect = getBandImpact(stateId, summary.bands[stateId]);
  const recommendation = getRecommendedAction(stateId, summary.bands[stateId]);
  return `${effect}; ${recommendation}.`;
}

function getSeverityForState(summary: BodyStatePresentationSnapshot, stateId: BodyStateId): BodyStateSeverity {
  if (stateId === 'energy') {
    return summary.resolved.energyBand === 'drained'
      ? 'critical'
      : summary.resolved.energyBand === 'low_energy'
        ? 'warning'
        : 'normal';
  }

  if (stateId === 'hydration') {
    return summary.resolved.hydrationBand === 'dehydrated' || summary.resolved.hydrationBand === 'severely_dehydrated'
      ? 'critical'
      : summary.resolved.hydrationBand === 'slightly_dehydrated'
        ? 'warning'
        : 'normal';
  }

  if (stateId === 'fatigue') {
    return summary.resolved.fatigueBand === 'fatigued' || summary.resolved.fatigueBand === 'exhausted'
      ? 'critical'
      : summary.resolved.fatigueBand === 'strained'
        ? 'warning'
        : 'normal';
  }

  if (stateId === 'protein') {
    return summary.resolved.proteinBand === 'deficient'
      ? 'critical'
      : summary.resolved.proteinBand === 'thin_diet'
        ? 'warning'
        : 'normal';
  }

  return summary.resolved.intoxicationBand === 'drunk'
    ? 'warning'
    : summary.resolved.intoxicationBand === 'heavily_intoxicated' ||
        summary.resolved.intoxicationBand === 'blackout_risk'
      ? 'critical'
      : 'normal';
}

export function createBodyStatePresentationSnapshot(snapshot: SaveSnapshot): BodyStatePresentationSnapshot {
  const bodyState = snapshot.playerState.bodyState;
  const summary: BodyStatePresentationSnapshot = {
    tick: snapshot.clock.tick,
    day: snapshot.clock.day,
    values: {
      energy: bodyState.resolved.effectiveEnergy,
      hydration: bodyState.hydrationLevel,
      fatigue: bodyState.fatigue,
      protein: bodyState.proteinSufficiency,
      intoxication: bodyState.intoxicationLevel
    },
    labels: {
      energy: formatEnergyBandLabel(bodyState.resolved.energyBand),
      hydration: formatHydrationBandLabel(bodyState.resolved.hydrationBand),
      fatigue: formatFatigueBandLabel(bodyState.resolved.fatigueBand),
      protein: formatProteinBandLabel(bodyState.resolved.proteinBand),
      intoxication: formatIntoxicationBandLabel(bodyState.resolved.intoxicationBand)
    },
    severities: {
      energy: 'normal',
      hydration: 'normal',
      fatigue: 'normal',
      protein: 'normal',
      intoxication: 'normal'
    },
    bands: {
      energy: bodyState.resolved.energyBand,
      hydration: bodyState.resolved.hydrationBand,
      fatigue: bodyState.resolved.fatigueBand,
      protein: bodyState.resolved.proteinBand,
      intoxication: bodyState.resolved.intoxicationBand
    },
    starvationLoad: bodyState.starvationLoad,
    proteinDeficitLoad: bodyState.proteinDeficitLoad,
    fatigueDebt: bodyState.fatigueDebt,
    resolved: bodyState.resolved
  };

  for (const stateId of ALL_STATE_IDS) {
    summary.severities[stateId] = getSeverityForState(summary, stateId);
  }

  return summary;
}

function createSyntheticBodyStateSnapshot(
  bodyState: PlayerBodyState,
  tick: number,
  day: number
): BodyStatePresentationSnapshot {
  return createBodyStatePresentationSnapshot({
    ...({} as SaveSnapshot),
    clock: {
      ...({} as SaveSnapshot['clock']),
      tick,
      day
    },
    playerState: {
      ...({} as SaveSnapshot['playerState']),
      bodyState
    }
  });
}

function resolveTrendFromBandChange(
  stateId: BodyStateId,
  currentBand: string,
  previousBand: string
): BodyStateTrend {
  const currentIndex = BAND_ORDER[stateId].indexOf(currentBand);
  const previousIndex = BAND_ORDER[stateId].indexOf(previousBand);

  if (currentIndex === previousIndex) {
    return 'stable';
  }

  return currentIndex > previousIndex ? 'improving' : 'worsening';
}

function resolveTrend(
  current: BodyStatePresentationSnapshot,
  previous: BodyStatePresentationSnapshot | null,
  stateId: BodyStateId
): BodyStateTrend {
  if (!previous || previous.tick === current.tick) {
    return 'stable';
  }

  if (current.bands[stateId] !== previous.bands[stateId]) {
    return resolveTrendFromBandChange(stateId, current.bands[stateId], previous.bands[stateId]);
  }

  const delta = current.values[stateId] - previous.values[stateId];
  if (Math.abs(delta) < TREND_THRESHOLDS[stateId]) {
    return 'stable';
  }

  return delta * POSITIVE_DIRECTION[stateId] > 0 ? 'improving' : 'worsening';
}

function buildPill(
  summary: BodyStatePresentationSnapshot,
  previous: BodyStatePresentationSnapshot | null,
  stateId: BodyStateId,
  emphasis: BodyStateAlertLevel | null | undefined
): BodyStatePillViewModel {
  return {
    id: stateId,
    label: summary.labels[stateId],
    severity: summary.severities[stateId],
    trend: resolveTrend(summary, previous, stateId),
    tooltip: formatTooltip(summary, stateId),
    ...(emphasis === undefined ? {} : { emphasis })
  };
}

function comparePrimaryPills(
  left: BodyStatePillViewModel,
  right: BodyStatePillViewModel,
  previousOrder: BodyStateId[]
): number {
  const severityDelta = severityRank(right.severity) - severityRank(left.severity);
  if (severityDelta !== 0) {
    return severityDelta;
  }

  const stableDelta = Number(left.severity === 'normal') - Number(right.severity === 'normal');
  if (stableDelta !== 0) {
    return stableDelta;
  }

  const priorityDelta = PRIMARY_PRIORITY[left.id] - PRIMARY_PRIORITY[right.id];
  if (priorityDelta !== 0) {
    return priorityDelta;
  }

  return previousOrder.indexOf(left.id) - previousOrder.indexOf(right.id);
}

function buildConditionStrip(
  summary: BodyStatePresentationSnapshot,
  previous: BodyStatePresentationSnapshot | null,
  previousPrimaryOrder: BodyStateId[],
  alertLevels: Partial<Record<BodyStateId, BodyStateAlertLevel>>
): ConditionStripViewModel {
  const primary = PRIMARY_STATE_IDS.map((stateId) =>
    buildPill(summary, previous, stateId, alertLevels[stateId] ?? null)
  ).sort((left, right) => comparePrimaryPills(left, right, previousPrimaryOrder));
  const secondary = SECONDARY_STATE_IDS.map((stateId) =>
    buildPill(summary, previous, stateId, alertLevels[stateId] ?? null)
  );

  return {
    primary,
    secondary,
    collapsedLabel: 'Condition: Stable',
    expandedByDefault: [...primary, ...secondary].some((pill) => pill.severity !== 'normal')
  };
}

function buildIssue(summary: BodyStatePresentationSnapshot, stateId: BodyStateId): ReadinessIssueViewModel {
  return {
    id: stateId,
    label: summary.labels[stateId],
    detail: getBandImpact(stateId, summary.bands[stateId]),
    severity: summary.severities[stateId]
  };
}

function buildRecommendedActions(summary: BodyStatePresentationSnapshot): RecommendedActionViewModel[] {
  const candidates = new Map<
    RecommendedActionViewModel['id'],
    RecommendedActionViewModel & { severityScore: number; immediacy: number }
  >();

  const pushAction = (
    issueId: BodyStateId,
    action: RecommendedActionViewModel['id'],
    label: RecommendedActionViewModel['label'],
    detail: string
  ) => {
    const severityScore = severityRank(summary.severities[issueId]);
    if (severityScore === 0) {
      return;
    }

    const immediacy = ISSUE_PRIORITY[issueId];
    const existing = candidates.get(action);
    if (
      !existing ||
      severityScore > existing.severityScore ||
      (severityScore === existing.severityScore && immediacy < existing.immediacy)
    ) {
      candidates.set(action, { id: action, label, detail, severityScore, immediacy });
    }
  };

  pushAction('hydration', 'drink', 'Drink', 'Restore hydration before the next push.');
  pushAction('intoxication', 'drink', 'Drink', 'Water will steady recovery and slow the slide.');
  pushAction('fatigue', 'rest', 'Rest', 'Rest will restore recovery quality fastest.');
  pushAction('intoxication', 'rest', 'Rest', 'Rest will settle intoxication pressure.');
  pushAction('energy', 'eat', 'Eat', 'A meal will restore reserves and recovery.');
  pushAction('protein', 'eat', 'Eat', 'A better meal will support recovery.');

  const tieBreak: Record<RecommendedActionViewModel['id'], number> = {
    drink: 0,
    rest: 1,
    eat: 2
  };

  return Array.from(candidates.values())
    .sort((left, right) => {
      if (right.severityScore !== left.severityScore) {
        return right.severityScore - left.severityScore;
      }

      if (left.immediacy !== right.immediacy) {
        return left.immediacy - right.immediacy;
      }

      return tieBreak[left.id] - tieBreak[right.id];
    })
    .slice(0, 3)
    .map(({ severityScore: _severityScore, immediacy: _immediacy, ...entry }) => entry);
}

function buildReadinessCard(
  summary: BodyStatePresentationSnapshot,
  previousIssueOrder: BodyStateId[]
): { viewModel: ReadinessCardViewModel; issueOrder: BodyStateId[] } {
  const issues = ALL_STATE_IDS
    .filter((stateId) => summary.severities[stateId] !== 'normal')
    .map((stateId) => buildIssue(summary, stateId))
    .sort((left, right) => {
      const severityDelta = severityRank(right.severity) - severityRank(left.severity);
      if (severityDelta !== 0) {
        return severityDelta;
      }

      const priorityDelta = ISSUE_PRIORITY[left.id as BodyStateId] - ISSUE_PRIORITY[right.id as BodyStateId];
      if (priorityDelta !== 0) {
        return priorityDelta;
      }

      return previousIssueOrder.indexOf(left.id as BodyStateId) - previousIssueOrder.indexOf(right.id as BodyStateId);
    })
    .slice(0, 3);

  const severityScore = ALL_STATE_IDS.reduce(
    (total, stateId) => total + severityRank(summary.severities[stateId]),
    0
  );
  const overallCondition: ReadinessCardViewModel['overallCondition'] =
    PRIMARY_STATE_IDS.some((stateId) => summary.severities[stateId] === 'critical') ||
    summary.bands.intoxication === 'blackout_risk'
      ? 'Compromised'
      : severityScore >= 3
        ? 'Strained'
        : severityScore >= 1
          ? 'Pressured'
          : 'Ready';
  const staminaRegenLabel: ReadinessCardViewModel['staminaRegenLabel'] =
    summary.resolved.staminaRegenMultiplier >= 0.95
      ? 'Steady'
      : summary.resolved.staminaRegenMultiplier >= 0.8
        ? 'Slowed'
        : summary.resolved.staminaRegenMultiplier >= 0.6
          ? 'Poor'
          : 'Suppressed';
  const recoveryLabel: ReadinessCardViewModel['recoveryLabel'] =
    summary.resolved.recoveryEffectivenessMultiplier >= 0.95
      ? 'Strong'
      : summary.resolved.recoveryEffectivenessMultiplier >= 0.8
        ? 'Fair'
        : summary.resolved.recoveryEffectivenessMultiplier >= 0.6
          ? 'Poor'
          : 'Impaired';

  return {
    viewModel: {
      overallCondition,
      staminaRegenLabel,
      recoveryLabel,
      primaryIssues: issues,
      recommendedActions: buildRecommendedActions(summary)
    },
    issueOrder: issues.map((issue) => issue.id as BodyStateId)
  };
}

function simulateBodyStateWindow(
  snapshot: SaveSnapshot,
  ticks: number,
  recoveryContext?: RecoveryContextState | null
): BodyStatePresentationSnapshot {
  let bodyState = snapshot.playerState.bodyState;
  let tick = snapshot.clock.tick;
  let day = snapshot.clock.day;
  const lineageId = snapshot.playerState.coreData.lineageId;
  const runDifficulty = snapshot.gameState.runDifficulty;
  const recoveryAssessment = buildRecoveryAssessment(snapshot, recoveryContext ?? null, ticks);

  for (let index = 0; index < ticks; index += 1) {
    tick += 1;
    if ((tick - 1) % 24 === 0) {
      day += 1;
    }
    bodyState = advancePlayerBodyState(bodyState, 1, {
      day,
      tick,
      lineageId,
      runDifficulty,
      metabolicProfile: null,
      recoveryContext: recoveryContext ?? null,
      recoveryAssessment
    });
  }

  const simulatedSnapshot = {
    ...snapshot,
    clock: {
      ...snapshot.clock,
      tick,
      day
    },
    playerState: {
      ...snapshot.playerState,
      bodyState
    }
  };

  return createBodyStatePresentationSnapshot(simulatedSnapshot);
}

function buildRecoveryAssessment(
  snapshot: SaveSnapshot,
  recoveryContext: RecoveryContextState | null,
  durationHours: number
): RecoveryAssessmentState | null {
  if (!recoveryContext || durationHours <= 0) {
    return null;
  }

  const rule = loadBodyStateBalanceRule();
  const campMultiplier = rule.recovery.campMultipliers[recoveryContext.campTier] ?? 1;
  const safetyMultiplier = rule.recovery.safetyMultipliers[recoveryContext.safetyTier] ?? 1;

  return {
    quality: Number(
      (campMultiplier * safetyMultiplier * snapshot.playerState.bodyState.resolved.recoveryEffectivenessMultiplier)
        .toFixed(4)
    ),
    durationHours
  };
}

function buildEnergyProjectionLabel(
  current: BodyStatePresentationSnapshot,
  projected: BodyStatePresentationSnapshot
): string {
  if (projected.bands.energy !== current.bands.energy) {
    return resolveTrendFromBandChange('energy', projected.bands.energy, current.bands.energy) === 'improving'
      ? 'Improving'
      : 'Slipping';
  }

  const delta = projected.values.energy - current.values.energy;
  if (Math.abs(delta) < 5) {
    return 'Holding';
  }

  return delta > 0 ? 'Improving' : 'Slipping';
}

function buildFatigueProjectionLabel(
  current: BodyStatePresentationSnapshot,
  projected: BodyStatePresentationSnapshot
): string {
  if (projected.bands.fatigue !== current.bands.fatigue) {
    return resolveTrendFromBandChange('fatigue', projected.bands.fatigue, current.bands.fatigue) === 'improving'
      ? 'Recovering'
      : 'Worsening';
  }

  const delta = projected.values.fatigue - current.values.fatigue;
  if (Math.abs(delta) < 4) {
    return 'No change';
  }

  return delta < 0 ? 'Recovering' : 'Worsening';
}

function buildRecoveryProjection(snapshot: SaveSnapshot): RecoveryProjectionViewModel {
  const current = createBodyStatePresentationSnapshot(snapshot);
  const short = simulateBodyStateWindow(snapshot, 3);
  const medium = simulateBodyStateWindow(snapshot, 8);

  return {
    windows: [
      { id: 'now', label: 'Now', energy: 'Holding', fatigue: 'No change' },
      {
        id: 'short',
        label: 'Short (2-3h)',
        energy: buildEnergyProjectionLabel(current, short),
        fatigue: buildFatigueProjectionLabel(current, short)
      },
      {
        id: 'medium',
        label: 'Medium (6-8h)',
        energy: buildEnergyProjectionLabel(current, medium),
        fatigue: buildFatigueProjectionLabel(current, medium)
      }
    ]
  };
}

function getSustainedFlags(summary: BodyStatePresentationSnapshot): Record<BodyStateId, boolean> {
  const fatigueThreshold = Math.max(12, loadBodyStateBalanceRule().fatigue.carryoverThreshold * 0.45);
  return {
    energy: summary.starvationLoad >= 1,
    hydration: false,
    fatigue: summary.fatigueDebt >= fatigueThreshold,
    protein: summary.proteinDeficitLoad >= 2,
    intoxication: false
  };
}

function formatAlertTime(summary: BodyStatePresentationSnapshot): string {
  return `Day ${summary.day} · Tick ${summary.tick}`;
}

function createHardAlertCopy(
  summary: BodyStatePresentationSnapshot,
  stateId: BodyStateId
): { id: string; notification: NotificationItem; toast: GameShellNotice } {
  const label = summary.labels[stateId];
  const effect = getBandImpact(stateId, summary.bands[stateId]);
  const recommendation = getRecommendedAction(stateId, summary.bands[stateId]);
  const title =
    stateId === 'energy' && summary.starvationLoad >= 1
      ? 'Sustained Low Energy'
      : stateId === 'fatigue' && summary.fatigueDebt > 0
        ? 'Prolonged Fatigue'
        : stateId === 'protein' && summary.proteinDeficitLoad >= 2
          ? 'Protein Deficit'
          : summary.severities[stateId] === 'critical'
            ? `${label} Critical`
            : label;
  const detail = `${effect}. ${recommendation[0]!.toUpperCase()}${recommendation.slice(1)}.`;
  const tone = summary.severities[stateId] === 'critical' ? 'danger' : 'warning';
  const id = `body-state.${stateId}.${summary.tick}.${summary.bands[stateId]}`;

  return {
    id,
    notification: {
      id,
      title,
      detail,
      time: formatAlertTime(summary),
      type: tone
    },
    toast: {
      tone,
      title,
      detail,
      message: `${title} - ${effect}.`,
      compact: true,
      autoDismissMs: 6000
    }
  };
}

function buildAlertState(
  summary: BodyStatePresentationSnapshot,
  memory: BodyStatePresentationMemory,
  dismissedToastIds: Set<string>
): {
  alertLevels: Partial<Record<BodyStateId, BodyStateAlertLevel>>;
  warningStreaks: Record<BodyStateId, number>;
  sustainedFlags: Record<BodyStateId, boolean>;
  armedAlertTiers: Partial<Record<BodyStateId, BodyStateAlertLevel>>;
  notifications: NotificationItem[];
  toastId: string | null;
  toast: GameShellNotice | null;
} {
  const previous = memory.previousSnapshot;
  const nextWarningStreaks = createEmptyWarningStreaks();
  const sustainedFlags = getSustainedFlags(summary);
  const alertLevels: Partial<Record<BodyStateId, BodyStateAlertLevel>> = {};
  const armedAlertTiers: Partial<Record<BodyStateId, BodyStateAlertLevel>> = {
    ...memory.armedAlertTiers
  };
  const notifications = [...memory.notifications];
  let toastId: string | null = null;
  let toast: GameShellNotice | null = null;

  for (const stateId of ALL_STATE_IDS) {
    const severity = summary.severities[stateId];
    const previousSeverity = previous?.severities[stateId] ?? 'normal';
    const enteredWarning = previousSeverity === 'normal' && severity === 'warning';
    const enteredCritical = previousSeverity !== 'critical' && severity === 'critical';
    const sustainedThresholdReached = sustainedFlags[stateId] && !memory.sustainedFlags[stateId];

    if (severity === 'warning') {
      nextWarningStreaks[stateId] =
        previous && previous.tick !== summary.tick && previousSeverity === 'warning'
          ? memory.warningStreaks[stateId] + 1
          : 1;
    } else {
      nextWarningStreaks[stateId] = 0;
    }

    if (severity === 'normal') {
      delete armedAlertTiers[stateId];
      continue;
    }

    let triggeredLevel: BodyStateAlertLevel | null = null;
    if (enteredCritical) {
      triggeredLevel = 'hard';
    } else if (severity === 'warning' && nextWarningStreaks[stateId] >= 6) {
      triggeredLevel = 'hard';
    } else if (severity === 'warning' && (nextWarningStreaks[stateId] >= 3 || sustainedThresholdReached)) {
      triggeredLevel = 'medium';
    } else if (enteredWarning) {
      triggeredLevel = 'soft';
    }

    const armedLevel = armedAlertTiers[stateId];
    const finalLevel =
      alertRank(triggeredLevel ?? undefined) > alertRank(armedLevel) ? triggeredLevel : armedLevel;

    if (finalLevel) {
      alertLevels[stateId] = finalLevel;
      armedAlertTiers[stateId] = finalLevel;
    }

    if (!triggeredLevel || alertRank(triggeredLevel) <= alertRank(armedLevel)) {
      continue;
    }

    if (triggeredLevel === 'hard') {
      const alertCopy = createHardAlertCopy(summary, stateId);
      if (!notifications.some((item) => item.id === alertCopy.notification.id)) {
        notifications.unshift(alertCopy.notification);
      }
      if (!dismissedToastIds.has(alertCopy.notification.id)) {
        toastId = alertCopy.id;
        toast = alertCopy.toast;
      }
    }
  }

  return {
    alertLevels,
    warningStreaks: nextWarningStreaks,
    sustainedFlags,
    armedAlertTiers,
    notifications: notifications.slice(0, 12),
    toastId,
    toast
  };
}

function getStrongestPrimarySeverity(summary: BodyStatePresentationSnapshot): BodyStateSeverity {
  if (PRIMARY_STATE_IDS.some((stateId) => summary.severities[stateId] === 'critical')) {
    return 'critical';
  }

  if (PRIMARY_STATE_IDS.some((stateId) => summary.severities[stateId] === 'warning')) {
    return 'warning';
  }

  return 'normal';
}

export function buildBodyStatePresentation(
  snapshot: SaveSnapshot,
  memory: BodyStatePresentationMemory,
  dismissedToastIds: Set<string>
): BodyStatePresentationViewModel {
  const summary = createBodyStatePresentationSnapshot(snapshot);
  const alerts = buildAlertState(summary, memory, dismissedToastIds);
  const conditionStrip = buildConditionStrip(
    summary,
    memory.previousSnapshot,
    memory.previousPrimaryOrder,
    alerts.alertLevels
  );
  const readiness = buildReadinessCard(summary, memory.previousIssueOrder);
  const strongestPrimarySeverity = getStrongestPrimarySeverity(summary);

  return {
    snapshot: summary,
    conditionStrip,
    readinessCard: readiness.viewModel,
    recoveryProjection: buildRecoveryProjection(snapshot),
    staminaVisualState:
      strongestPrimarySeverity === 'critical'
        ? 'critical'
        : strongestPrimarySeverity === 'warning'
          ? 'warning'
          : 'normal',
    alertLevels: alerts.alertLevels,
    warningStreaks: alerts.warningStreaks,
    sustainedFlags: alerts.sustainedFlags,
    ephemeralNotifications: alerts.notifications,
    toastId: alerts.toastId,
    toast: alerts.toast,
    nextMemory: {
      previousSnapshot: summary,
      previousPrimaryOrder: conditionStrip.primary.map((pill) => pill.id),
      previousIssueOrder: readiness.issueOrder.length > 0 ? readiness.issueOrder : memory.previousIssueOrder,
      warningStreaks: alerts.warningStreaks,
      sustainedFlags: alerts.sustainedFlags,
      armedAlertTiers: alerts.armedAlertTiers,
      notifications: alerts.notifications
    }
  };
}

function buildEffectLabel(
  delta: number,
  thresholds: { strong: number; helpful: number; light: number },
  reverse = false
): ConsumableEffectDeltaLabel {
  const directionalDelta = reverse ? -delta : delta;
  if (directionalDelta >= thresholds.strong) {
    return 'Strong support';
  }
  if (directionalDelta >= thresholds.helpful) {
    return 'Helpful';
  }
  if (directionalDelta >= thresholds.light) {
    return 'Light support';
  }
  if (directionalDelta <= -thresholds.helpful) {
    return 'Rises';
  }
  return 'No major change';
}

function getStrongestNeed(summary: BodyStatePresentationSnapshot): RecommendedActionViewModel['id'] | null {
  return buildRecommendedActions(summary)[0]?.id ?? null;
}

function summaryNeedsHeavyRecovery(summary: BodyStatePresentationSnapshot): boolean {
  return summary.severities.fatigue !== 'normal' || summary.resolved.recoveryEffectivenessMultiplier < 0.9;
}

export function buildConsumableEffectPreview(
  snapshot: SaveSnapshot,
  consumableProfile: ConsumableProfileState,
  itemTags: string[] = []
): ConsumableEffectPreviewViewModel {
  const before = createBodyStatePresentationSnapshot(snapshot);
  const nextBodyState = applyConsumableToBodyState(snapshot.playerState.bodyState, consumableProfile, {
    itemTags,
    lineageId: snapshot.playerState.coreData.lineageId,
    tick: snapshot.clock.tick,
    day: snapshot.clock.day,
    runDifficulty: snapshot.gameState.runDifficulty
  });
  const after = createBodyStatePresentationSnapshot({
    ...snapshot,
    playerState: {
      ...snapshot.playerState,
      bodyState: nextBodyState
    }
  });
  const recoveryDelta =
    after.resolved.recoveryEffectivenessMultiplier - before.resolved.recoveryEffectivenessMultiplier;

  let contextTag: ConsumableEffectPreviewViewModel['contextTag'] = 'Light meal';
  if ((after.values.intoxication - before.values.intoxication) >= 7) {
    contextTag = 'Drink with care';
  } else if ((after.values.hydration - before.values.hydration) >= 8) {
    contextTag = 'Good for hydration';
  } else if (
    summaryNeedsHeavyRecovery(before) &&
    ((after.values.protein - before.values.protein) >= 8 || recoveryDelta >= 0.08)
  ) {
    contextTag = 'Best after heavy exertion';
  }

  const strongestNeed = getStrongestNeed(before);
  const highlighted =
    (strongestNeed === 'drink' && contextTag === 'Good for hydration') ||
    (strongestNeed === 'eat' && (contextTag === 'Light meal' || contextTag === 'Best after heavy exertion')) ||
    (strongestNeed === 'rest' && contextTag === 'Best after heavy exertion');

  return {
    immediateEffects: {
      energy: buildEffectLabel(after.values.energy - before.values.energy, {
        strong: 10,
        helpful: 6,
        light: 3
      }),
      protein: buildEffectLabel(after.values.protein - before.values.protein, {
        strong: 12,
        helpful: 8,
        light: 4
      }),
      hydration: buildEffectLabel(after.values.hydration - before.values.hydration, {
        strong: 12,
        helpful: 7,
        light: 3
      }),
      intoxication: buildEffectLabel(
        after.values.intoxication - before.values.intoxication,
        { strong: 12, helpful: 7, light: 3 },
        true
      )
    },
    delayedRecovery:
      recoveryDelta >= 0.08
        ? 'Boosts recovery'
        : recoveryDelta >= 0.02
          ? 'Supports recovery'
          : recoveryDelta <= -0.04
            ? 'May hinder recovery'
            : 'Little recovery support',
    contextTag,
    highlighted,
    ...(highlighted
      ? {
          highlightLabel: strongestNeed === 'drink' ? 'Recommended' : 'Useful now'
        }
      : {})
  };
}

export function buildConsumeFeedback(
  itemLabel: string,
  before: BodyStatePresentationSnapshot,
  after: BodyStatePresentationSnapshot
): {
  title: string;
  detail: string;
  tone: GameShellNotice['tone'];
} {
  const improvedBands = ALL_STATE_IDS.filter(
    (stateId) =>
      after.bands[stateId] !== before.bands[stateId] && resolveTrend(after, before, stateId) === 'improving'
  );
  const remainingCritical = PRIMARY_STATE_IDS.some((stateId) => after.severities[stateId] === 'critical');
  const intoxicationRose = after.values.intoxication > before.values.intoxication + 6;

  if (improvedBands.length > 0 && !remainingCritical && !intoxicationRose) {
    return {
      tone: 'success',
      title: 'Recovery Helped',
      detail: `${itemLabel} steadied ${improvedBands.map((stateId) => after.labels[stateId]).join(' and ').toLowerCase()}.`
    };
  }

  if (intoxicationRose) {
    return {
      tone: 'warning',
      title: 'A Little Relief, With A Cost',
      detail: `${itemLabel} took the edge off, but intoxication pressure is climbing.`
    };
  }

  if (remainingCritical) {
    return {
      tone: 'warning',
      title: 'Some Relief',
      detail: `${itemLabel} helped, but your condition is still under real strain.`
    };
  }

  return {
    tone: 'success',
    title: 'Consumed',
    detail: `${itemLabel} gave a little breathing room for the next stretch.`
  };
}

function isSignificantPrimaryWorsening(
  before: BodyStatePresentationSnapshot,
  after: BodyStatePresentationSnapshot,
  stateId: BodyStateId
): boolean {
  if (after.bands[stateId] !== before.bands[stateId] && resolveTrend(after, before, stateId) === 'worsening') {
    return true;
  }

  const delta = after.values[stateId] - before.values[stateId];
  if (stateId === 'fatigue') {
    return delta >= 8;
  }

  return delta <= -8;
}

function hasHardAlertCrossing(args: {
  current: BodyStatePresentationSnapshot;
  timeline: PlayerBodyState[];
  warningStreaks: Record<BodyStateId, number>;
  sustainedFlags: Record<BodyStateId, boolean>;
}): boolean {
  let warningStreaks = { ...args.warningStreaks };
  let sustainedFlags = { ...args.sustainedFlags };

  for (const bodyState of args.timeline) {
    const summary = createSyntheticBodyStateSnapshot(
      bodyState,
      args.current.tick,
      args.current.day
    );

    for (const stateId of PRIMARY_STATE_IDS) {
      if (summary.severities[stateId] === 'critical') {
        return true;
      }

      if (summary.severities[stateId] === 'warning') {
        warningStreaks[stateId] += 1;
        if (warningStreaks[stateId] >= 6) {
          return true;
        }
      } else {
        warningStreaks[stateId] = 0;
      }
    }

    const nextSustained = getSustainedFlags(summary);
    if (ALL_STATE_IDS.some((stateId) => nextSustained[stateId] && !sustainedFlags[stateId])) {
      return true;
    }
    sustainedFlags = nextSustained;
  }

  return false;
}

function buildEnergyOrHydrationPreviewLabel(
  delta: number
): ActionOutcomePreviewViewModel['energy'] {
  if (delta >= 4) {
    return 'Recovery';
  }
  if (delta > -4) {
    return 'No major change';
  }
  if (delta > -10) {
    return 'Minor drain';
  }
  if (delta > -18) {
    return 'Moderate drain';
  }
  return 'Heavy drain';
}

function buildFatiguePreviewLabel(delta: number): ActionOutcomePreviewViewModel['fatigue'] {
  if (delta <= -4) {
    return 'Recovery';
  }
  if (delta < 4) {
    return 'No change';
  }
  if (delta < 12) {
    return 'Increase';
  }
  return 'Heavy increase';
}

export function buildActionOutcomePreview(args: {
  current: BodyStatePresentationSnapshot;
  projectedBodyState: PlayerBodyState;
  timeline: PlayerBodyState[];
  warningStreaks: Record<BodyStateId, number>;
  sustainedFlags: Record<BodyStateId, boolean>;
}): ActionOutcomePreviewViewModel {
  const after = createSyntheticBodyStateSnapshot(
    args.projectedBodyState,
    args.current.tick,
    args.current.day
  );
  const energyDelta = after.values.energy - args.current.values.energy;
  const hydrationDelta = after.values.hydration - args.current.values.hydration;
  const fatigueDelta = after.values.fatigue - args.current.values.fatigue;
  const significantPrimaryWorseningCount = PRIMARY_STATE_IDS.filter((stateId) =>
    isSignificantPrimaryWorsening(args.current, after, stateId)
  ).length;
  const bandWarnings = PRIMARY_STATE_IDS.filter(
    (stateId) =>
      after.bands[stateId] !== args.current.bands[stateId] &&
      resolveTrend(after, args.current, stateId) === 'worsening'
  );
  const hardAlertCrossing = hasHardAlertCrossing(args);

  return {
    energy: buildEnergyOrHydrationPreviewLabel(energyDelta),
    hydration: buildEnergyOrHydrationPreviewLabel(hydrationDelta),
    fatigue: buildFatiguePreviewLabel(fatigueDelta),
    riskTier:
      PRIMARY_STATE_IDS.some(
        (stateId) => after.severities[stateId] === 'critical' && args.current.severities[stateId] !== 'critical'
      ) ||
      hardAlertCrossing ||
      significantPrimaryWorseningCount >= 2
        ? 'risky'
        : bandWarnings.length > 0 ||
            PRIMARY_STATE_IDS.some(
              (stateId) =>
                args.current.severities[stateId] === 'warning' &&
                isSignificantPrimaryWorsening(args.current, after, stateId)
            )
          ? 'straining'
          : 'safe',
    warnings: [
      ...(bandWarnings.includes('energy') ? ['Energy is likely to slip into a worse state.'] : []),
      ...(bandWarnings.includes('hydration') ? ['Hydration is likely to slip into a worse state.'] : []),
      ...(bandWarnings.includes('fatigue') ? ['Fatigue is likely to worsen.'] : []),
      ...(hardAlertCrossing && bandWarnings.length === 0
        ? ['This action is likely to trigger a sustained condition warning.']
        : [])
    ]
  };
}
