import { deserializeSnapshot, serializeSnapshot } from '../../../../packages/shared/persistence/src/index.js';
import { advanceClock } from '../../../../packages/shared/time/src/index.js';
import {
  type ActionAttributeLoadProfileState,
  type ActionMetabolicProfileState,
  type ChronicleEventState,
  type CurrentActivityState,
  type InventoryStack,
  type OperationState,
  type PlayerBodyState,
  type PlayerStandingState,
  type PlayerSkillState,
  type QuestJournalEntryState,
  type ReputationAwardDefinitionState,
  type RecoveryAssessmentState,
  type RecoveryContextState,
  type SaveSnapshot
} from '../../../../packages/shared/types/src/index.js';
import {
  createPlayerTravelCommand,
  executePlayerTravelCommand,
  type PlayerTravelResult
} from '../../../../packages/engines/game-engine/src/player-travel.js';
import {
  getCurrentPlayerTravelLocationId,
  getCurrentPlayerTravelLocationLabel,
  getPlayerTravelDestinationFacts,
  resolvePlayerTravelPlan
} from '../../../../packages/engines/game-engine/src/player-travel-rules.js';
import { synchronizeGameplaySnapshot } from '../../../../packages/engines/game-engine/src/gameplay-snapshot-sync.js';
import {
  applyReputationAward,
  applyActionAttributeLoad,
  applyAttributeTensionToActionProfile,
  advancePlayerBodyState,
  convertPlayerStatGrowthOnRecovery,
  loadBodyStateBalanceRule,
  resolveSkillRankGainPolicy,
  syncPlayerRuntimeState
} from '../../../../packages/engines/player-engine/src/index.js';
import type { GameShellNotice } from './state.js';

type GameplayActionResult = {
  snapshot: SaveSnapshot;
  notice: GameShellNotice;
};

type SkillGainApplicationResult = {
  skills: PlayerSkillState[];
  appliedDelta: number;
  blockedGate: number | null;
  requiredBand: string | null;
};

export type GameplayBodyStatePreview = {
  available: boolean;
  reason?: string;
  tickCount: number;
  projectedBodyState: PlayerBodyState | null;
  timeline: PlayerBodyState[];
};

type QuestCommandState = {
  canAccept: boolean;
  canTurnIn: boolean;
  canTrack: boolean;
  nextStep: string;
};

const WATCH_LABELS: Record<number, string> = {
  1: 'Dawn Watch',
  2: 'High Sun',
  3: 'Dusk Watch',
  4: 'Night Watch'
};

const FLAG_SURVEY_SECTOR_PREFIX = 'gameplay.quest.ashen_reef_survey.sector.';
const FLAG_SURVEY_RUINS_CONFIRMED = 'gameplay.quest.ashen_reef_survey.ruins_confirmed';
const FLAG_PORTER_CRATES_SECURED = 'gameplay.quest.rivet_shortfall_relief.crates_secured';
const FLAG_DISCOVERY_STORMGLASS_BLOOM = 'gameplay.discovery.stormglass_bloom';
const RIVET_CRATE_ITEM_KEY = 'deepiron_rivet_crate';
const RIVET_CRATE_ITEM_ID = 'item.deepiron_rivet_crate';
const OPERATION_SURVEY_ID = 'operation.quest.ashen_reef_survey';
const OPERATION_PORTER_ID = 'operation.quest.rivet_shortfall_relief';

const ASHEN_REEF_SURVEY_FAME_AWARD: ReputationAwardDefinitionState = {
  axis: 'fame',
  branchId: 'commercial',
  directEarnedScope: 'regional',
  baseValue: 6,
  originSettlementIds: ['settlement.aurelis']
};

const RIVET_SHORTFALL_RELIEF_FAME_AWARD: ReputationAwardDefinitionState = {
  axis: 'fame',
  branchId: 'trade',
  directEarnedScope: 'local',
  baseValue: 4,
  originSettlementIds: ['settlement.aurelis']
};

const DEFAULT_SHIFT_PROFILE: ActionMetabolicProfileState = {
  intensity: 'moderate',
  fatigueGain: 8,
  energyDemand: 10,
  hydrationDemand: 8,
  highIntensityLoad: 1
};

const DEFAULT_SHIFT_ATTRIBUTE_PROFILE: ActionAttributeLoadProfileState = {
  intensity: 'moderate',
  sourceTag: 'labor',
  weights: {
    STR: 0.5,
    CON: 0.6,
    VIT: 0.5,
    WIS: 0.2
  },
  meaningfulInteraction: true
};

const SURVEY_SHIFT_PROFILE: ActionMetabolicProfileState = {
  intensity: 'high',
  fatigueGain: 14,
  energyDemand: 16,
  hydrationDemand: 12,
  highIntensityLoad: 2
};

const SURVEY_SHIFT_ATTRIBUTE_PROFILE: ActionAttributeLoadProfileState = {
  intensity: 'high',
  sourceTag: 'survey',
  weights: {
    AGI: 0.7,
    CON: 0.6,
    VIT: 0.4,
    WIS: 0.3
  },
  meaningfulInteraction: true
};

const PROCUREMENT_SHIFT_PROFILE: ActionMetabolicProfileState = {
  intensity: 'moderate',
  fatigueGain: 9,
  energyDemand: 11,
  hydrationDemand: 9,
  highIntensityLoad: 1
};

const PROCUREMENT_SHIFT_ATTRIBUTE_PROFILE: ActionAttributeLoadProfileState = {
  intensity: 'moderate',
  sourceTag: 'procurement_field',
  weights: {
    DEX: 0.4,
    AGI: 0.3,
    CON: 0.4,
    WIS: 0.3
  },
  meaningfulInteraction: true
};

const SETTLEMENT_REST_RECOVERY: RecoveryContextState = {
  sleepUnits: 1,
  campTier: 'secure_indoor',
  safetyTier: 'secure',
  mealSupport: 1,
  waterSupport: 1
};

function cloneSnapshot(snapshot: SaveSnapshot): SaveSnapshot {
  return deserializeSnapshot(serializeSnapshot(snapshot));
}

function humanizeId(value: string | null | undefined): string {
  if (!value) {
    return 'Unknown';
  }

  const segments = value.split('.');
  const lastSegment = segments[segments.length - 1] ?? value;

  return lastSegment
    .split(/[_-]/)
    .filter((part) => part.length > 0)
    .map((part) => part[0]!.toUpperCase() + part.slice(1))
    .join(' ');
}

function formatTickTime(snapshot: SaveSnapshot): string {
  return `Day ${snapshot.clock.day}, ${WATCH_LABELS[snapshot.clock.subday] ?? 'Unknown Watch'}`;
}

function getCurrentLocationId(snapshot: SaveSnapshot): string | null {
  return getCurrentPlayerTravelLocationId(snapshot);
}

function getCurrentLocationName(snapshot: SaveSnapshot): string {
  return getCurrentPlayerTravelLocationLabel(snapshot);
}

function hasFlag(snapshot: SaveSnapshot, flag: string): boolean {
  return snapshot.sessionState.flags.includes(flag);
}

function ensureFlag(flags: string[], flag: string): string[] {
  return flags.includes(flag) ? flags : [...flags, flag];
}

function removeFlag(flags: string[], flag: string): string[] {
  return flags.filter((entry) => entry !== flag);
}

function getSurveySectorCount(snapshot: SaveSnapshot): number {
  return [1, 2, 3].filter((index) =>
    hasFlag(snapshot, `${FLAG_SURVEY_SECTOR_PREFIX}${index}`)
  ).length;
}

function isSurveyComplete(snapshot: SaveSnapshot): boolean {
  return getSurveySectorCount(snapshot) >= 3 && hasFlag(snapshot, FLAG_SURVEY_RUINS_CONFIRMED);
}

function hasRivetCargo(snapshot: SaveSnapshot): boolean {
  return hasFlag(snapshot, FLAG_PORTER_CRATES_SECURED);
}

function findQuest(snapshot: SaveSnapshot, questId: string): QuestJournalEntryState | undefined {
  return snapshot.sessionState.questJournal.find((entry) => entry.id === questId);
}

function isQuestReadyToTurnIn(snapshot: SaveSnapshot, questId: string): boolean {
  const quest = findQuest(snapshot, questId);

  if (!quest || quest.category !== 'active') {
    return false;
  }

  if (questId === 'quest.ashen_reef_survey') {
    return isSurveyComplete(snapshot) && getCurrentLocationId(snapshot) === 'location.saltmere';
  }

  if (questId === 'quest.rivet_shortfall_relief') {
    return hasRivetCargo(snapshot) && getCurrentLocationId(snapshot) === 'location.saltmere';
  }

  return false;
}

function createNotice(
  tone: GameShellNotice['tone'],
  title: string,
  detail: string
): GameShellNotice {
  return {
    tone,
    title,
    detail
  };
}

function appendNotification(
  snapshot: SaveSnapshot,
  title: string,
  detail: string,
  tone: GameShellNotice['tone']
) {
  snapshot.sessionState.notifications = [
    {
      id: `notification.${snapshot.clock.tick}.${snapshot.sessionState.notifications.length + 1}`,
      title,
      detail,
      timeLabel: formatTickTime(snapshot),
      tone
    },
    ...snapshot.sessionState.notifications
  ].slice(0, 8);
}

function appendChronicle(snapshot: SaveSnapshot, entry: ChronicleEventState) {
  snapshot.sessionState.chronicle = [entry, ...snapshot.sessionState.chronicle].slice(0, 48);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getSkillRank(snapshot: SaveSnapshot, skillId: string): number {
  return snapshot.playerState.skills.find((skill) => skill.id === skillId)?.rank ?? 0;
}

function mitigateActionProfile(
  snapshot: SaveSnapshot,
  profile: ActionMetabolicProfileState,
  sourceTag: string,
  attributeKeys: Array<'AGI' | 'CON' | 'VIT' | 'DEX' | 'WIS' | 'INT' | 'CHA'>,
  skillIds: string[]
): ActionMetabolicProfileState {
  const attributeAverage =
    attributeKeys.reduce((total, key) => total + snapshot.playerState.attributes[key], 0) /
    Math.max(1, attributeKeys.length);
  const skillAverage =
    skillIds.reduce((total, skillId) => total + getSkillRank(snapshot, skillId), 0) /
    Math.max(1, skillIds.length);
  const attributeBonus = Math.max(0, (attributeAverage - 10) * 0.0125);
  const skillBonus = Math.max(0, skillAverage * 0.004);
  const efficiencyMitigation = clamp(attributeBonus + skillBonus, 0, 0.3);
  const tensionPerformance = applyAttributeTensionToActionProfile(
    snapshot.playerState.attributes,
    { sourceTag }
  );
  const tensionStrain = 1 / Math.max(0.5, tensionPerformance);

  return {
    ...profile,
    fatigueGain: Number((profile.fatigueGain * (1 - efficiencyMitigation) * tensionStrain).toFixed(3)),
    energyDemand: Number((profile.energyDemand * (1 - efficiencyMitigation * 0.5) * tensionStrain).toFixed(3)),
    hydrationDemand: Number((profile.hydrationDemand * (1 - efficiencyMitigation * 0.35) * tensionStrain).toFixed(3))
  };
}

function advanceSnapshotClock(
  snapshot: SaveSnapshot,
  ticks: number,
  options: {
    metabolicProfile?: ActionMetabolicProfileState | null;
    attributeProfile?: ActionAttributeLoadProfileState | null;
    recoveryContext?: RecoveryContextState | null;
    convertStatGrowthOnRecovery?: boolean;
  } = {}
) {
  const stepCount = Math.max(0, Math.round(ticks));
  const runDifficulty = snapshot.gameState.runDifficulty;
  const recoveryAssessment = buildRecoveryAssessment(snapshot, options.recoveryContext ?? null, stepCount);

  for (let index = 0; index < stepCount; index += 1) {
    const nextClock = advanceClock(snapshot.clock, 1);
    snapshot.clock = nextClock;
    snapshot.capturedAtTick = nextClock.tick;
    snapshot.playerState.saveMeta.totalPlayTicks += 1;
    snapshot.playerState.bodyState = advancePlayerBodyState(snapshot.playerState.bodyState, 1, {
      day: nextClock.day,
      tick: nextClock.tick,
      lineageId: snapshot.playerState.coreData.lineageId,
      runDifficulty,
      metabolicProfile: options.metabolicProfile ?? null,
      recoveryContext: options.recoveryContext ?? null,
      recoveryAssessment
    });
    if (options.attributeProfile) {
      applyActionAttributeLoad(snapshot.playerState, options.attributeProfile, 1, nextClock.day, runDifficulty);
    }
    if (
      options.recoveryContext &&
      options.convertStatGrowthOnRecovery !== false &&
      index === stepCount - 1
    ) {
      convertPlayerStatGrowthOnRecovery(
        snapshot.playerState,
        nextClock.tick,
        nextClock.day,
        recoveryAssessment,
        runDifficulty
      );
    }
    syncPlayerRuntimeState(snapshot.playerState, nextClock.tick, nextClock.day, [], runDifficulty);
  }
}

function previewSnapshotClock(
  snapshot: SaveSnapshot,
  ticks: number,
  options: {
    metabolicProfile?: ActionMetabolicProfileState | null;
    attributeProfile?: ActionAttributeLoadProfileState | null;
    recoveryContext?: RecoveryContextState | null;
  } = {}
): GameplayBodyStatePreview {
  const nextSnapshot = cloneSnapshot(snapshot);
  const timeline: PlayerBodyState[] = [];
  const stepCount = Math.max(0, Math.round(ticks));
  const runDifficulty = snapshot.gameState.runDifficulty;
  const recoveryAssessment = buildRecoveryAssessment(snapshot, options.recoveryContext ?? null, stepCount);

  for (let index = 0; index < stepCount; index += 1) {
    const nextClock = advanceClock(nextSnapshot.clock, 1);
    nextSnapshot.clock = nextClock;
    nextSnapshot.capturedAtTick = nextClock.tick;
    nextSnapshot.playerState.saveMeta.totalPlayTicks += 1;
    nextSnapshot.playerState.bodyState = advancePlayerBodyState(nextSnapshot.playerState.bodyState, 1, {
      day: nextClock.day,
      tick: nextClock.tick,
      lineageId: nextSnapshot.playerState.coreData.lineageId,
      runDifficulty,
      metabolicProfile: options.metabolicProfile ?? null,
      recoveryContext: options.recoveryContext ?? null,
      recoveryAssessment
    });
    syncPlayerRuntimeState(nextSnapshot.playerState, nextClock.tick, nextClock.day, [], runDifficulty);
    timeline.push(nextSnapshot.playerState.bodyState);
  }

  return {
    available: true,
    tickCount: stepCount,
    projectedBodyState: nextSnapshot.playerState.bodyState,
    timeline
  };
}

function clampResource(value: number, min: number, max: number): number {
  return clamp(value, min, max);
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

function applyResourceDelta(
  snapshot: SaveSnapshot,
  delta: Partial<Record<'hp' | 'mp' | 'stamina', number>>
) {
  snapshot.playerState.resources.hp.current = clampResource(
    snapshot.playerState.resources.hp.current + (delta.hp ?? 0),
    0,
    snapshot.playerState.resources.hp.max
  );
  snapshot.playerState.resources.mp.current = clampResource(
    snapshot.playerState.resources.mp.current + (delta.mp ?? 0),
    0,
    snapshot.playerState.resources.mp.max
  );
  snapshot.playerState.resources.stamina.current = clampResource(
    snapshot.playerState.resources.stamina.current + (delta.stamina ?? 0),
    0,
    snapshot.playerState.resources.stamina.max
  );
}

function addCurrency(
  snapshot: SaveSnapshot,
  delta: { gold?: number; silver?: number; copper?: number }
) {
  snapshot.playerState.currency = {
    gold: Math.max(0, snapshot.playerState.currency.gold + (delta.gold ?? 0)),
    silver: Math.max(0, snapshot.playerState.currency.silver + (delta.silver ?? 0)),
    copper: Math.max(0, snapshot.playerState.currency.copper + (delta.copper ?? 0))
  };
}

function spendCurrency(
  snapshot: SaveSnapshot,
  delta: { gold?: number; silver?: number; copper?: number }
): boolean {
  const nextGold = snapshot.playerState.currency.gold - (delta.gold ?? 0);
  const nextSilver = snapshot.playerState.currency.silver - (delta.silver ?? 0);
  const nextCopper = snapshot.playerState.currency.copper - (delta.copper ?? 0);

  if (nextGold < 0 || nextSilver < 0 || nextCopper < 0) {
    return false;
  }

  snapshot.playerState.currency = {
    gold: nextGold,
    silver: nextSilver,
    copper: nextCopper
  };

  return true;
}

function addOrUpdateSkill(
  skills: PlayerSkillState[],
  skillId: string,
  rankDelta: number,
  sourceLabel = 'Noncombat skill gain'
): SkillGainApplicationResult {
  const existing = skills.find((entry) => entry.id === skillId);
  const policy = resolveSkillRankGainPolicy({
    skillId,
    currentSkill: existing ?? null,
    rankDelta,
    sourceLabel,
    sourceType: 'noncombat'
  });

  if (policy.appliedDelta <= 0) {
    return {
      skills,
      appliedDelta: 0,
      blockedGate: policy.blockedGate,
      requiredBand: policy.requiredBand
    };
  }

  if (!existing) {
    return {
      skills: [
        ...skills,
        {
          id: skillId,
          rank: policy.appliedRank,
          source: 'trained' as const
        }
      ].sort((left, right) => left.id.localeCompare(right.id)),
      appliedDelta: policy.appliedDelta,
      blockedGate: policy.blockedGate,
      requiredBand: policy.requiredBand
    };
  }

  return {
    skills: skills.map((entry) =>
      entry.id === skillId
        ? {
            ...entry,
            rank: policy.appliedRank,
            source: 'trained' as const
          }
        : entry
    ),
    appliedDelta: policy.appliedDelta,
    blockedGate: policy.blockedGate,
    requiredBand: policy.requiredBand
  };
}

function formatSkillGainEffect(result: SkillGainApplicationResult, label: string): string {
  if (result.appliedDelta > 0) {
    return `${label} +${result.appliedDelta}`;
  }

  if (result.blockedGate !== null) {
    return `${label} progress requires a breakthrough`;
  }

  return `${label} unchanged`;
}

function getStandingLabel(score: number): string {
  if (score >= 75) {
    return 'Honored';
  }

  if (score >= 50) {
    return 'Trusted';
  }

  if (score >= 25) {
    return 'Known';
  }

  if (score >= 10) {
    return 'Noted';
  }

  return 'Unproven';
}

function addOrUpdateStanding(
  standing: PlayerStandingState[],
  id: string,
  label: string,
  delta: number,
  effects: string[]
): PlayerStandingState[] {
  const existing = standing.find((entry) => entry.id === id);

  if (!existing) {
    const score = Math.max(0, delta);

    return [
      ...standing,
      {
        id,
        label,
        score,
        standingLabel: getStandingLabel(score),
        effects
      }
    ].sort((left, right) => left.label.localeCompare(right.label));
  }

  const score = Math.max(0, existing.score + delta);

  return standing.map((entry) =>
    entry.id === id
      ? {
          ...entry,
          score,
          standingLabel: getStandingLabel(score),
          effects: entry.effects.length > 0 ? entry.effects : effects
        }
      : entry
  );
}

function addInventoryStack(
  inventory: SaveSnapshot['playerState']['inventory'],
  stack: InventoryStack
) {
  for (const bag of inventory.bags) {
    const existing = bag.stacks.find(
      (entry) => entry.itemId === stack.itemId && entry.itemKey === stack.itemKey
    );

    if (existing) {
      existing.quantity += stack.quantity;
      return;
    }
  }

  const openBag = inventory.bags.find((bag) => bag.stacks.length < bag.slotCapacity);

  if (openBag) {
    openBag.stacks.push({ ...stack });
    return;
  }

  const overflowExisting = inventory.overflow.find(
    (entry) => entry.itemId === stack.itemId && entry.itemKey === stack.itemKey
  );

  if (overflowExisting) {
    overflowExisting.quantity += stack.quantity;
    return;
  }

  inventory.overflow.push({ ...stack });
}

function removeInventoryQuantity(
  inventory: SaveSnapshot['playerState']['inventory'],
  itemKey: string,
  quantity: number
): boolean {
  let remaining = quantity;

  for (const bag of inventory.bags) {
    for (let index = bag.stacks.length - 1; index >= 0 && remaining > 0; index -= 1) {
      const stack = bag.stacks[index];

      if (!stack || stack.itemKey !== itemKey) {
        continue;
      }

      const removed = Math.min(stack.quantity, remaining);
      stack.quantity -= removed;
      remaining -= removed;

      if (stack.quantity <= 0) {
        bag.stacks.splice(index, 1);
      }
    }
  }

  for (let index = inventory.overflow.length - 1; index >= 0 && remaining > 0; index -= 1) {
    const stack = inventory.overflow[index];

    if (!stack || stack.itemKey !== itemKey) {
      continue;
    }

    const removed = Math.min(stack.quantity, remaining);
    stack.quantity -= removed;
    remaining -= removed;

    if (stack.quantity <= 0) {
      inventory.overflow.splice(index, 1);
    }
  }

  return remaining === 0;
}

function makeChronicleEntry(
  snapshot: SaveSnapshot,
  category: ChronicleEventState['category'],
  title: string,
  summary: string,
  statusLabel: string | undefined,
  entities: string[],
  results: string[],
  statChanges: string[],
  tags: string[]
): ChronicleEventState {
  return {
    id: `chronicle.${snapshot.clock.tick}.${snapshot.sessionState.chronicle.length + 1}`,
    category,
    title,
    timeLabel: formatTickTime(snapshot),
    summary,
    entities,
    results,
    statChanges,
    tags,
    ...(statusLabel ? { statusLabel } : {})
  };
}

function upsertOperation(operations: OperationState[], nextOperation: OperationState): OperationState[] {
  const existing = operations.find((entry) => entry.id === nextOperation.id);

  if (!existing) {
    return [nextOperation, ...operations];
  }

  return operations.map((entry) => (entry.id === nextOperation.id ? nextOperation : entry));
}

function removeOperation(operations: OperationState[], operationId: string): OperationState[] {
  return operations.filter((entry) => entry.id !== operationId);
}

function buildSurveyOperation(snapshot: SaveSnapshot): OperationState {
  const sectors = getSurveySectorCount(snapshot);
  const ruinsConfirmed = hasFlag(snapshot, FLAG_SURVEY_RUINS_CONFIRMED);
  const progress = ruinsConfirmed ? 100 : sectors * 25;
  const stage = ruinsConfirmed
    ? 'Chart packet ready for harbor turn-in'
    : `Survey sectors logged: ${sectors} / 3`;

  return {
    id: OPERATION_SURVEY_ID,
    title: 'Ashen Reef Survey',
    stage,
    progress,
    etaLabel: ruinsConfirmed ? 'Ready now' : `${Math.max(1, 4 - sectors)} shift(s)`,
    owner: snapshot.playerState.coreData.playerName,
    output: ruinsConfirmed ? 'Verified reef chart packet' : 'Field chart updates',
    priority: 'High'
  };
}

function buildPorterOperation(snapshot: SaveSnapshot): OperationState {
  const secured = hasRivetCargo(snapshot);
  const inSaltmere = getCurrentLocationId(snapshot) === 'location.saltmere';

  return {
    id: OPERATION_PORTER_ID,
    title: 'Rivet Shortfall Relief',
    stage: secured
      ? inSaltmere
        ? 'Cargo delivered to Saltmere drydock'
        : 'Cargo secured in Westreach, return trip underway'
      : 'Procurement trip underway',
    progress: secured ? (inSaltmere ? 100 : 70) : 35,
    etaLabel: secured ? (inSaltmere ? 'Ready now' : '1 route leg') : '1 work shift',
    owner: snapshot.playerState.coreData.playerName,
    output: secured ? 'Six deepiron rivet crates' : 'Procurement charter',
    priority: 'High'
  };
}

function syncSnapshot(snapshot: SaveSnapshot): SaveSnapshot {
  return synchronizeGameplaySnapshot(snapshot);
}

function addDiscoveryEntry(snapshot: SaveSnapshot) {
  const exists = snapshot.playerState.discoveryChronicle.entries.some(
    (entry) => entry.id === 'discovery.stormglass_bloom'
  );

  if (exists) {
    return;
  }

  snapshot.playerState.discoveryChronicle.entries = [
    {
      id: 'discovery.stormglass_bloom',
      codexEntryId: 'flora.unknown_bloom',
      category: 'flora',
      title: 'Stormglass Bloom',
      discoveredAtTick: snapshot.clock.tick,
      discoveredAtLabel: formatTickTime(snapshot),
      regionLabel: 'Glasswater',
      sourceType: 'survey',
      sourceId: 'quest.ashen_reef_survey',
      notes: [
        'Logged during the Ashen Reef survey while the crew marked ruin shelves.',
        'The petals refract storm light and dry into brittle crystalline veins.'
      ]
    },
    ...snapshot.playerState.discoveryChronicle.entries
  ];
  snapshot.playerState.discoveryChronicle.lastUpdatedTick = snapshot.clock.tick;
  snapshot.sessionState.flags = ensureFlag(snapshot.sessionState.flags, FLAG_DISCOVERY_STORMGLASS_BLOOM);
}

function makeQuestState(snapshot: SaveSnapshot, questId: string): QuestCommandState {
  const quest = findQuest(snapshot, questId);

  if (!quest) {
    return {
      canAccept: false,
      canTurnIn: false,
      canTrack: false,
      nextStep: 'This quest is not available in the current session.'
    };
  }

  if (quest.category === 'contracts') {
    return {
      canAccept: true,
      canTurnIn: false,
      canTrack: true,
      nextStep: 'Accept this contract to move it into the active quest ledger.'
    };
  }

  if (quest.category === 'completed') {
    return {
      canAccept: false,
      canTurnIn: false,
      canTrack: false,
      nextStep: 'This contract has already been resolved.'
    };
  }

  if (quest.category === 'failed') {
    return {
      canAccept: false,
      canTurnIn: false,
      canTrack: false,
      nextStep: 'This contract is no longer actionable.'
    };
  }

  if (questId === 'quest.ashen_reef_survey') {
    const sectorCount = getSurveySectorCount(snapshot);

    if (getCurrentLocationId(snapshot) !== 'location.ashen_reef' && sectorCount === 0) {
      return {
        canAccept: false,
        canTurnIn: false,
        canTrack: true,
        nextStep: 'Travel from Saltmere to Ashen Reef, then advance a work shift to begin charting.'
      };
    }

    if (!isSurveyComplete(snapshot)) {
      return {
        canAccept: false,
        canTurnIn: false,
        canTrack: true,
        nextStep:
          getCurrentLocationId(snapshot) === 'location.ashen_reef'
            ? 'Advance work shifts at Ashen Reef until all three sectors and ruin markers are logged.'
            : 'Return to Ashen Reef to finish the survey packet.'
      };
    }

    return {
      canAccept: false,
      canTurnIn: isQuestReadyToTurnIn(snapshot, questId),
      canTrack: true,
      nextStep:
        getCurrentLocationId(snapshot) === 'location.saltmere'
          ? 'Turn the chart packet in at Saltmere Harbor Office for payout and discovery credit.'
          : 'Return to Saltmere to turn in the completed chart packet.'
    };
  }

  if (questId === 'quest.rivet_shortfall_relief') {
    if (!hasRivetCargo(snapshot)) {
      return {
        canAccept: false,
        canTurnIn: false,
        canTrack: true,
        nextStep:
          getCurrentLocationId(snapshot) === 'location.westreach'
            ? 'Advance a work shift in Westreach to secure the emergency rivet crates.'
            : 'Travel to Westreach to secure the emergency rivet cargo.'
      };
    }

    return {
      canAccept: false,
      canTurnIn: isQuestReadyToTurnIn(snapshot, questId),
      canTrack: true,
      nextStep:
        getCurrentLocationId(snapshot) === 'location.saltmere'
          ? 'Turn the cargo in at Saltmere Drydock for payment and standing.'
          : 'Escort the cargo back to Saltmere for turn-in.'
    };
  }

  return {
    canAccept: false,
    canTurnIn: false,
    canTrack: true,
    nextStep: 'Track this quest and review its objectives from the quest detail panel.'
  };
}

export function getQuestCommandState(snapshot: SaveSnapshot, questId: string): QuestCommandState {
  return makeQuestState(snapshot, questId);
}

export function getCurrentLocationLabel(snapshot: SaveSnapshot): string {
  return getCurrentLocationName(snapshot);
}

export function getKnownLocationId(snapshot: SaveSnapshot): string | null {
  return getCurrentLocationId(snapshot);
}

export function previewTravelToKnownLocation(
  snapshot: SaveSnapshot,
  locationId: string
): GameplayBodyStatePreview {
  const plan = resolvePlayerTravelPlan(snapshot, locationId);
  if (!plan.accepted) {
    return {
      available: false,
      reason: plan.reason,
      tickCount: 0,
      projectedBodyState: null,
      timeline: []
    };
  }

  return {
    available: true,
    tickCount: plan.facts.travelTicks,
    projectedBodyState: plan.projectedBodyState,
    timeline: plan.timeline
  };
}

export function acceptQuest(snapshot: SaveSnapshot, questId: string): GameplayActionResult {
  const quest = findQuest(snapshot, questId);

  if (!quest) {
    return {
      snapshot,
      notice: createNotice('warning', 'Quest Missing', 'That quest could not be found in the current session.')
    };
  }

  if (quest.category !== 'contracts') {
    return {
      snapshot,
      notice: createNotice('warning', 'Contract Already Active', `${quest.title} is already in the active ledger.`)
    };
  }

  const nextSnapshot = cloneSnapshot(snapshot);
  nextSnapshot.sessionState.questJournal = nextSnapshot.sessionState.questJournal.map((entry) =>
    entry.id === questId
      ? {
          ...entry,
          category: 'active',
          statusLabel: 'Accepted'
        }
      : entry
  );
  nextSnapshot.sessionState.trackedQuestId = questId;
  nextSnapshot.sessionState.currentActivity = {
    id: `activity.prepare.${questId}`,
    label: `Preparing ${quest.title}`,
    category: 'Contract',
    detail: quest.summary
  };
  appendNotification(nextSnapshot, 'Contract accepted', `${quest.title} moved into the active quest ledger.`, 'accent');
  appendChronicle(
    nextSnapshot,
    makeChronicleEntry(
      nextSnapshot,
      'social',
      `${nextSnapshot.playerState.coreData.playerName} accepted ${quest.title}`,
      `The contract board cleared ${quest.title} into the active ledger.`,
      'Accepted',
      [nextSnapshot.playerState.coreData.playerName, quest.title],
      ['Quest moved to active'],
      ['Tracked quest updated'],
      ['Contract', quest.regionLabel]
    )
  );

  return {
    snapshot: syncSnapshot(nextSnapshot),
    notice: createNotice('success', 'Contract Accepted', `${quest.title} is now active and tracked.`)
  };
}

export function toggleTrackedQuest(snapshot: SaveSnapshot, questId: string): GameplayActionResult {
  const quest = findQuest(snapshot, questId);

  if (!quest) {
    return {
      snapshot,
      notice: createNotice('warning', 'Quest Missing', 'That quest could not be found in the current session.')
    };
  }

  if (quest.category === 'completed' || quest.category === 'failed') {
    return {
      snapshot,
      notice: createNotice('warning', 'Quest Cannot Be Tracked', `${quest.title} is no longer an active objective.`)
    };
  }

  const nextSnapshot = cloneSnapshot(snapshot);
  nextSnapshot.sessionState.trackedQuestId =
    nextSnapshot.sessionState.trackedQuestId === questId ? null : questId;

  return {
    snapshot: syncSnapshot(nextSnapshot),
    notice:
      nextSnapshot.sessionState.trackedQuestId === questId
        ? createNotice('accent', 'Quest Tracked', `${quest.title} now anchors the top-bar objective display.`)
        : createNotice('neutral', 'Quest Untracked', `${quest.title} was removed from the tracked objective slot.`)
  };
}

export function setCurrentActivityFromRecord(
  snapshot: SaveSnapshot,
  recordId: string
): GameplayActionResult {
  const record = snapshot.sessionState.activityRecords.find((entry) => entry.id === recordId);

  if (!record) {
    return {
      snapshot,
      notice: createNotice('warning', 'Activity Missing', 'That activity record is not available in the current session.')
    };
  }

  const nextSnapshot = cloneSnapshot(snapshot);
  nextSnapshot.sessionState.currentActivity = {
    id: record.id,
    label: record.title,
    category: humanizeId(record.sectionId),
    detail: record.summary
  };
  appendNotification(nextSnapshot, 'Current activity set', `${record.title} is now the focus of the current shift.`, 'accent');

  return {
    snapshot: syncSnapshot(nextSnapshot),
    notice: createNotice('accent', 'Current Activity Updated', `${record.title} is now set as the active process.`)
  };
}

function createPlayerTravelNotice(result: PlayerTravelResult): GameShellNotice {
  if (result.accepted) {
    return createNotice('success', 'Travel Complete', `${result.noticeFacts.destinationName} is now the active location.`);
  }

  if (result.code === 'unknown_destination') {
    return createNotice('warning', 'Travel Target Unknown', 'That destination does not yet have travel rules wired into the current vertical slice.');
  }
  if (result.code === 'destination_not_known') {
    return createNotice('warning', 'Destination Unknown', 'That location is not yet discovered in the current session.');
  }
  if (result.code === 'already_at_destination') {
    return createNotice('warning', 'Already There', `${result.noticeFacts.destinationName ?? 'That location'} is already the current destination.`);
  }
  if (result.code === 'stale_snapshot' || result.code === 'stale_origin') {
    return createNotice('warning', 'Travel State Changed', 'The travel outlook is stale. Review the current location and try again.');
  }
  return createNotice('warning', 'Travel Blocked', 'Travel could not be applied to the current session state.');
}

export function travelToKnownLocation(
  snapshot: SaveSnapshot,
  locationId: string
): GameplayActionResult & { accepted: boolean } {
  const result = executePlayerTravelCommand(
    snapshot,
    createPlayerTravelCommand(snapshot, locationId)
  );
  return {
    accepted: result.accepted,
    snapshot: result.snapshot,
    notice: createPlayerTravelNotice(result)
  };
}

export function previewAdvanceCurrentActivity(snapshot: SaveSnapshot): GameplayBodyStatePreview {
  const trackedQuestId = snapshot.sessionState.trackedQuestId;

  if (trackedQuestId === 'quest.ashen_reef_survey' && findQuest(snapshot, trackedQuestId)?.category === 'active') {
    if (getCurrentLocationId(snapshot) !== 'location.ashen_reef') {
      return {
        available: false,
        reason: 'Travel to Ashen Reef before advancing the survey work.',
        tickCount: 0,
        projectedBodyState: null,
        timeline: []
      };
    }

    return previewSnapshotClock(snapshot, 2, {
      metabolicProfile: mitigateActionProfile(
        snapshot,
        SURVEY_SHIFT_PROFILE,
        'survey',
        ['AGI', 'WIS', 'INT'],
        ['skill.knowledge.general_lore', 'skill.resource.identify.flora']
      )
    });
  }

  if (trackedQuestId === 'quest.rivet_shortfall_relief' && findQuest(snapshot, trackedQuestId)?.category === 'active') {
    if (getCurrentLocationId(snapshot) !== 'location.westreach') {
      return {
        available: false,
        reason: 'Travel to Westreach before securing the rivet shipment.',
        tickCount: 0,
        projectedBodyState: null,
        timeline: []
      };
    }

    if (hasRivetCargo(snapshot)) {
      return {
        available: false,
        reason: 'The deepiron crates are already loaded.',
        tickCount: 0,
        projectedBodyState: null,
        timeline: []
      };
    }

    return previewSnapshotClock(snapshot, 2, {
      metabolicProfile: mitigateActionProfile(
        snapshot,
        PROCUREMENT_SHIFT_PROFILE,
        'procurement_field',
        ['CON', 'CHA', 'INT'],
        ['skill.knowledge.mineral_lore', 'skill.knowledge.general_lore']
      )
    });
  }

  if (!snapshot.sessionState.currentActivity) {
    return {
      available: false,
      reason: 'Set a current activity before advancing a work shift.',
      tickCount: 0,
      projectedBodyState: null,
      timeline: []
    };
  }

  return previewSnapshotClock(snapshot, 2, {
    metabolicProfile: mitigateActionProfile(
      snapshot,
      DEFAULT_SHIFT_PROFILE,
      'labor',
      ['CON', 'VIT', 'WIS'],
      ['skill.knowledge.general_lore']
    )
  });
}

export function advanceCurrentActivity(snapshot: SaveSnapshot): GameplayActionResult {
  const trackedQuestId = snapshot.sessionState.trackedQuestId;

  if (trackedQuestId === 'quest.ashen_reef_survey' && findQuest(snapshot, trackedQuestId)?.category === 'active') {
    if (getCurrentLocationId(snapshot) !== 'location.ashen_reef') {
      return {
        snapshot,
        notice: createNotice('warning', 'Wrong Location', 'Travel to Ashen Reef before advancing the survey work.')
      };
    }

    const nextSnapshot = cloneSnapshot(snapshot);
    advanceSnapshotClock(nextSnapshot, 2, {
      metabolicProfile: mitigateActionProfile(
        snapshot,
        SURVEY_SHIFT_PROFILE,
        'survey',
        ['AGI', 'WIS', 'INT'],
        ['skill.knowledge.general_lore', 'skill.resource.identify.flora']
      ),
      attributeProfile: SURVEY_SHIFT_ATTRIBUTE_PROFILE
    });
    applyResourceDelta(nextSnapshot, { stamina: -10, mp: -3 });

    const sectorsComplete = getSurveySectorCount(nextSnapshot);

    if (sectorsComplete < 3) {
      nextSnapshot.sessionState.flags = ensureFlag(
        nextSnapshot.sessionState.flags,
        `${FLAG_SURVEY_SECTOR_PREFIX}${sectorsComplete + 1}`
      );
      const skillGain = addOrUpdateSkill(
        nextSnapshot.playerState.skills,
        'skill.knowledge.general_lore',
        1,
        'Ashen Reef survey sector'
      );
      nextSnapshot.playerState.skills = skillGain.skills;
      nextSnapshot.sessionState.operations = upsertOperation(
        nextSnapshot.sessionState.operations,
        buildSurveyOperation(nextSnapshot)
      );
      appendNotification(
        nextSnapshot,
        'Survey sector logged',
        `Ashen Reef sector ${sectorsComplete + 1} is now charted and filed into the packet.`,
        'success'
      );
      appendChronicle(
        nextSnapshot,
        makeChronicleEntry(
          nextSnapshot,
          'discovery',
          `Survey sector ${sectorsComplete + 1} logged at Ashen Reef`,
          'The crew marked channels, breakers, and draft-safe approaches for the charter packet.',
          `Sector ${sectorsComplete + 1} / 3`,
          [nextSnapshot.playerState.coreData.playerName, 'Ashen Reef'],
          ['Survey packet expanded'],
          [formatSkillGainEffect(skillGain, 'Navigation'), 'Stamina -10', 'MP -3'],
          ['Exploration', 'Survey']
        )
      );

      return {
        snapshot: syncSnapshot(nextSnapshot),
        notice: createNotice('success', 'Survey Progress', `Ashen Reef sector ${sectorsComplete + 1} is now charted.`)
      };
    }

    if (!hasFlag(nextSnapshot, FLAG_SURVEY_RUINS_CONFIRMED)) {
      nextSnapshot.sessionState.flags = ensureFlag(
        nextSnapshot.sessionState.flags,
        FLAG_SURVEY_RUINS_CONFIRMED
      );
      const skillGain = addOrUpdateSkill(
        nextSnapshot.playerState.skills,
        'skill.resource.identify.flora',
        1,
        'Ashen Reef survey discovery'
      );
      nextSnapshot.playerState.skills = skillGain.skills;
      addDiscoveryEntry(nextSnapshot);
      nextSnapshot.sessionState.operations = upsertOperation(
        nextSnapshot.sessionState.operations,
        buildSurveyOperation(nextSnapshot)
      );
      nextSnapshot.sessionState.currentActivity = {
        id: 'activity.return.survey_packet',
        label: 'Returning Chart Packet',
        category: 'Contract',
        detail: 'The field chart is complete and ready to be taken back to Saltmere Harbor Office.'
      };
      appendNotification(
        nextSnapshot,
        'Survey packet complete',
        'All sectors and ruin markers are logged. Return to Saltmere for payment and codex credit.',
        'accent'
      );
      appendChronicle(
        nextSnapshot,
        makeChronicleEntry(
          nextSnapshot,
          'discovery',
          'Ashen Reef survey packet completed',
          'The crew verified the ruin markers and logged a new flora sample for the reef archive.',
          'Packet complete',
          [nextSnapshot.playerState.coreData.playerName, 'Ashen Reef', 'Stormglass Bloom'],
          ['Chart packet finalized', 'New discovery recorded'],
          [formatSkillGainEffect(skillGain, 'Survival'), 'Stamina -10', 'MP -3'],
          ['Exploration', 'Discovery', 'Survey']
        )
      );

      return {
        snapshot: syncSnapshot(nextSnapshot),
        notice: createNotice('accent', 'Survey Packet Ready', 'Return to Saltmere Harbor Office to turn in the completed chart packet.')
      };
    }
  }

  if (trackedQuestId === 'quest.rivet_shortfall_relief' && findQuest(snapshot, trackedQuestId)?.category === 'active') {
    if (getCurrentLocationId(snapshot) !== 'location.westreach') {
      return {
        snapshot,
        notice: createNotice('warning', 'Wrong Location', 'Travel to Westreach before securing the rivet shipment.')
      };
    }

    if (hasRivetCargo(snapshot)) {
      return {
        snapshot,
        notice: createNotice('warning', 'Cargo Already Secured', 'The deepiron crates are already loaded. Return to Saltmere to turn them in.')
      };
    }

    const nextSnapshot = cloneSnapshot(snapshot);
    advanceSnapshotClock(nextSnapshot, 2, {
      metabolicProfile: mitigateActionProfile(
        snapshot,
        PROCUREMENT_SHIFT_PROFILE,
        'procurement_field',
        ['CON', 'CHA', 'INT'],
        ['skill.knowledge.mineral_lore', 'skill.knowledge.general_lore']
      ),
      attributeProfile: PROCUREMENT_SHIFT_ATTRIBUTE_PROFILE
    });
    applyResourceDelta(nextSnapshot, { stamina: -7 });
    nextSnapshot.sessionState.flags = ensureFlag(
      nextSnapshot.sessionState.flags,
      FLAG_PORTER_CRATES_SECURED
    );
    addInventoryStack(nextSnapshot.playerState.inventory, {
      itemId: RIVET_CRATE_ITEM_ID,
      itemKey: RIVET_CRATE_ITEM_KEY,
      quantity: 6
    });
    const skillGain = addOrUpdateSkill(
      nextSnapshot.playerState.skills,
      'skill.resource.identify.minerals',
      1,
      'Rivet cargo procurement'
    );
    nextSnapshot.playerState.skills = skillGain.skills;
    nextSnapshot.sessionState.operations = upsertOperation(
      nextSnapshot.sessionState.operations,
      buildPorterOperation(nextSnapshot)
    );
    nextSnapshot.sessionState.currentActivity = {
      id: 'activity.return.rivets',
      label: 'Escorting Rivet Cargo',
      category: 'Trade',
      detail: 'The crates are loaded and need to be returned to Saltmere Drydock.'
    };
    appendNotification(
      nextSnapshot,
      'Rivet cargo secured',
      'Six deepiron crates are loaded for the emergency Saltmere drydock run.',
      'success'
    );
    appendChronicle(
      nextSnapshot,
      makeChronicleEntry(
        nextSnapshot,
        'trade',
        'Deepiron rivet cargo secured in Westreach',
        'The emergency order is packed and ready for immediate return to Saltmere.',
        'Cargo loaded',
        [nextSnapshot.playerState.coreData.playerName, 'Westreach', 'Saltmere Drydock'],
        ['Cargo secured', 'Return leg prepared'],
        [formatSkillGainEffect(skillGain, 'Mercantile'), 'Stamina -7'],
        ['Trade', 'Contract']
      )
    );

    return {
      snapshot: syncSnapshot(nextSnapshot),
      notice: createNotice('success', 'Cargo Secured', 'The rivet shipment is loaded. Return to Saltmere to turn it in.')
    };
  }

  if (!snapshot.sessionState.currentActivity) {
    return {
      snapshot,
      notice: createNotice('warning', 'No Active Process', 'Set a current activity or track a quest before advancing a work shift.')
    };
  }

  const nextSnapshot = cloneSnapshot(snapshot);
  const currentActivity = nextSnapshot.sessionState.currentActivity!;
  advanceSnapshotClock(nextSnapshot, 2, {
    metabolicProfile: mitigateActionProfile(
      snapshot,
      DEFAULT_SHIFT_PROFILE,
      'labor',
      ['CON', 'VIT', 'WIS'],
      ['skill.knowledge.general_lore']
    ),
    attributeProfile: DEFAULT_SHIFT_ATTRIBUTE_PROFILE
  });
  applyResourceDelta(nextSnapshot, { stamina: -6 });
  appendNotification(
    nextSnapshot,
    'Shift advanced',
    `${currentActivity.label} moved forward through another work shift.`,
    'neutral'
  );
  appendChronicle(
    nextSnapshot,
    makeChronicleEntry(
      nextSnapshot,
      'social',
      `Shift advanced for ${currentActivity.label}`,
      'Time passed on the current assignment without a major milestone event.',
      'Routine progress',
      [nextSnapshot.playerState.coreData.playerName, currentActivity.label],
      ['Routine progress'],
      ['Stamina -6', 'Time +2 ticks'],
      ['Activity']
    )
  );

  return {
    snapshot: syncSnapshot(nextSnapshot),
    notice: createNotice('neutral', 'Shift Advanced', `${currentActivity.label} advanced through another work shift.`)
  };
}

export function previewRestAtCurrentSettlement(snapshot: SaveSnapshot): GameplayBodyStatePreview {
  const locationId = getCurrentLocationId(snapshot);

  if (!locationId) {
    return {
      available: false,
      reason: 'A proper rest stop is only available inside a settlement.',
      tickCount: 0,
      projectedBodyState: null,
      timeline: []
    };
  }

  const nextSnapshot = cloneSnapshot(snapshot);

  if (!spendCurrency(nextSnapshot, { silver: 4 })) {
    return {
      available: false,
      reason: 'Resting requires 4 silver for board, food, and a secure bunk.',
      tickCount: 0,
      projectedBodyState: null,
      timeline: []
    };
  }

  return previewSnapshotClock(snapshot, 4, {
    recoveryContext: SETTLEMENT_REST_RECOVERY
  });
}

export function restAtCurrentSettlement(snapshot: SaveSnapshot): GameplayActionResult {
  const locationId = getCurrentLocationId(snapshot);
  const location = locationId ? getPlayerTravelDestinationFacts(locationId) : null;

  if (!locationId || !location) {
    return {
      snapshot,
      notice: createNotice('warning', 'Rest Unavailable', 'A proper rest stop is only available inside a settlement for this first playable loop.')
    };
  }

  const nextSnapshot = cloneSnapshot(snapshot);

  if (!spendCurrency(nextSnapshot, { silver: 4 })) {
    return {
      snapshot,
      notice: createNotice('warning', 'Not Enough Coin', 'Resting requires 4 silver for board, food, and a secure bunk.')
    };
  }

  advanceSnapshotClock(nextSnapshot, 4, {
    recoveryContext: SETTLEMENT_REST_RECOVERY
  });
  nextSnapshot.playerState.resources.hp.current = nextSnapshot.playerState.resources.hp.max;
  nextSnapshot.playerState.resources.mp.current = nextSnapshot.playerState.resources.mp.max;
  nextSnapshot.playerState.resources.stamina.current = nextSnapshot.playerState.resources.stamina.max;
  nextSnapshot.playerState.resourceRuntime.pendingChanges = [];
  nextSnapshot.playerState.saveMeta.lastRestAtTick = nextSnapshot.clock.tick;
  nextSnapshot.sessionState.currentActivity = {
    id: 'activity.rest',
    label: `Resting In ${location.name}`,
    category: 'Recovery',
    detail: 'Resources, nerves, and field notes are being restored before the next contract.'
  };
  appendNotification(
    nextSnapshot,
    'Rest complete',
    `A settled rest in ${location.name} restored current resources.`,
    'success'
  );
  appendChronicle(
    nextSnapshot,
    makeChronicleEntry(
      nextSnapshot,
      'social',
      `${nextSnapshot.playerState.coreData.playerName} rested in ${location.name}`,
      'A proper bunk, meal, and dry roof restored the current reserves.',
      '-4 silver',
      [nextSnapshot.playerState.coreData.playerName, location.name],
      ['All resources restored'],
      ['Silver -4', 'HP to full', 'MP to full', 'Stamina to full'],
      ['Recovery', location.regionLabel]
    )
  );

  return {
    snapshot: syncSnapshot(nextSnapshot),
    notice: createNotice('success', 'Recovered', `Resources were restored after resting in ${location.name}.`)
  };
}

export function turnInQuest(snapshot: SaveSnapshot, questId: string): GameplayActionResult {
  const quest = findQuest(snapshot, questId);

  if (!quest) {
    return {
      snapshot,
      notice: createNotice('warning', 'Quest Missing', 'That quest could not be found in the current session.')
    };
  }

  if (quest.category !== 'active') {
    return {
      snapshot,
      notice: createNotice('warning', 'Quest Not Active', `${quest.title} must be active before it can be turned in.`)
    };
  }

  if (!isQuestReadyToTurnIn(snapshot, questId)) {
    return {
      snapshot,
      notice: createNotice('warning', 'Turn-In Not Ready', makeQuestState(snapshot, questId).nextStep)
    };
  }

  const nextSnapshot = cloneSnapshot(snapshot);
  nextSnapshot.sessionState.questJournal = nextSnapshot.sessionState.questJournal.map((entry) =>
    entry.id === questId
      ? {
          ...entry,
          category: 'completed',
          statusLabel: 'Turned in'
        }
      : entry
  );

  if (questId === 'quest.ashen_reef_survey') {
    addCurrency(nextSnapshot, { gold: 5, silver: 8 });
    const skillGain = addOrUpdateSkill(
      nextSnapshot.playerState.skills,
      'skill.knowledge.general_lore',
      1,
      'Ashen Reef survey turn-in'
    );
    nextSnapshot.playerState.skills = skillGain.skills;
    nextSnapshot.playerState.standing = addOrUpdateStanding(
      nextSnapshot.playerState.standing,
      'rep.harbor_office',
      'Saltmere Harbor Office',
      8,
      ['survey_priority', 'harbor_access']
    );
    nextSnapshot.playerState.reputation = applyReputationAward(
      nextSnapshot.playerState.reputation,
      ASHEN_REEF_SURVEY_FAME_AWARD,
      {
        meaningful: true,
        exposureSatisfied: true,
        attributionSatisfied: true,
        sociallyValued: true,
        tick: nextSnapshot.clock.tick,
        sourceId: questId
      }
    );
    nextSnapshot.sessionState.operations = removeOperation(
      nextSnapshot.sessionState.operations,
      OPERATION_SURVEY_ID
    );
    nextSnapshot.sessionState.currentActivity = {
      id: 'activity.harbor.turn_in',
      label: 'Filing Survey Packet',
      category: 'Contract',
      detail: 'Harbor clerks are stamping the packet, payout order, and codex notes.'
    };
    appendNotification(
      nextSnapshot,
      'Survey payout received',
      'Saltmere Harbor Office paid out the Ashen Reef charter and logged the new flora record.',
      'success'
    );
    appendChronicle(
      nextSnapshot,
      makeChronicleEntry(
        nextSnapshot,
        'reputation',
        'Ashen Reef survey turned in at Saltmere Harbor Office',
        'The harbor office paid the charter, updated the route file, and credited the discovery record.',
        '+5g 8s',
        [nextSnapshot.playerState.coreData.playerName, 'Saltmere Harbor Office', 'Ashen Reef'],
        ['Payout secured', 'Harbor standing improved', 'Codex entry unlocked'],
        [formatSkillGainEffect(skillGain, 'Common Lore'), 'Harbor Office Standing +8', 'Regional Fame +6'],
        ['Contract', 'Discovery', 'Harbor Office']
      )
    );
  } else if (questId === 'quest.rivet_shortfall_relief') {
    removeInventoryQuantity(nextSnapshot.playerState.inventory, RIVET_CRATE_ITEM_KEY, 6);
    addCurrency(nextSnapshot, { gold: 4, silver: 1 });
    const skillGain = addOrUpdateSkill(
      nextSnapshot.playerState.skills,
      'skill.knowledge.mineral_lore',
      1,
      'Rivet shortfall turn-in'
    );
    nextSnapshot.playerState.skills = skillGain.skills;
    nextSnapshot.playerState.standing = addOrUpdateStanding(
      nextSnapshot.playerState.standing,
      'rep.guild_consortium',
      'Guild Consortium',
      6,
      ['priority_bids', 'drydock_discount']
    );
    nextSnapshot.playerState.reputation = applyReputationAward(
      nextSnapshot.playerState.reputation,
      RIVET_SHORTFALL_RELIEF_FAME_AWARD,
      {
        meaningful: true,
        exposureSatisfied: true,
        attributionSatisfied: true,
        sociallyValued: true,
        tick: nextSnapshot.clock.tick,
        sourceId: questId
      }
    );
    nextSnapshot.sessionState.operations = removeOperation(
      nextSnapshot.sessionState.operations,
      OPERATION_PORTER_ID
    );
    nextSnapshot.sessionState.currentActivity = {
      id: 'activity.drydock.turn_in',
      label: 'Handing Off Rivet Cargo',
      category: 'Contract',
      detail: 'The drydock has the emergency crates and yard schedules are stabilizing.'
    };
    nextSnapshot.sessionState.flags = removeFlag(
      nextSnapshot.sessionState.flags,
      FLAG_PORTER_CRATES_SECURED
    );
    appendNotification(
      nextSnapshot,
      'Rivet contract paid',
      'Saltmere Drydock accepted the emergency shipment and eased the active shortage.',
      'success'
    );
    appendChronicle(
      nextSnapshot,
      makeChronicleEntry(
        nextSnapshot,
        'trade',
        'Rivet shortfall relief turned in at Saltmere Drydock',
        'The emergency cargo was accepted and yard crews can resume delayed fittings.',
        '+4g 1s',
        [nextSnapshot.playerState.coreData.playerName, 'Saltmere Drydock', 'Westreach'],
        ['Drydock shortage eased', 'Payout secured'],
        [formatSkillGainEffect(skillGain, 'Earth Lore'), 'Guild Consortium Standing +6', 'Local Fame +4'],
        ['Contract', 'Trade', 'Drydock']
      )
    );
  }

  const nextTrackedQuest = nextSnapshot.sessionState.questJournal.find(
    (entry) => entry.category === 'active' && entry.id !== questId
  );
  nextSnapshot.sessionState.trackedQuestId = nextTrackedQuest?.id ?? null;

  return {
    snapshot: syncSnapshot(nextSnapshot),
    notice: createNotice('success', 'Quest Turned In', `${quest.title} was completed and rewards were applied.`)
  };
}

