import type {
  ItemUseProfileState,
  KnowledgeTrackState,
  PlayerTrialProgressState,
  SkillProgressionBandId,
  SkillProgressionBandState,
  SpellScalingChannel,
  TrialDefinitionState
} from "../../../shared/types/src/index.js";

const BREAKTHROUGH_GATES: Array<{ gate: number; bandId: SkillProgressionBandId }> = [
  { gate: 30, bandId: "familiar" },
  { gate: 55, bandId: "proficient" },
  { gate: 80, bandId: "skilled" },
  { gate: 100, bandId: "mastery" }
];

export const SKILL_PROGRESSION_BANDS: SkillProgressionBandState[] = [
  { id: "clumsy", label: "Clumsy", minRank: 1, maxRank: 30, softCapRank: 30, requiresBreakthrough: false },
  { id: "familiar", label: "Familiar", minRank: 25, maxRank: 55, softCapRank: 55, requiresBreakthrough: true },
  { id: "proficient", label: "Proficient", minRank: 50, maxRank: 80, softCapRank: 80, requiresBreakthrough: true },
  { id: "skilled", label: "Skilled", minRank: 75, maxRank: 100, softCapRank: 100, requiresBreakthrough: true },
  {
    id: "mastery",
    label: "Mastery",
    minRank: 100,
    maxRank: 125,
    softCapRank: 125,
    requiresBreakthrough: true,
    requiresMasteryTrial: true
  }
];

export const SPELL_SCALING_CHANNELS_BY_SCHOOL: Record<string, SpellScalingChannel[]> = {
  elemental: ["power", "radius", "manaEfficiency", "accuracy"],
  enfeebling: ["magnitude", "duration", "manaEfficiency", "accuracy", "statusChance"],
  enhancing: ["magnitude", "duration", "manaEfficiency", "barrier", "tempo"],
  healing: ["power", "healingPower", "duration", "manaEfficiency", "charges"],
  control: ["magnitude", "duration", "manaEfficiency", "accuracy", "statusChance"],
  utility: ["duration", "manaEfficiency", "accuracy", "tempo", "charges"],
  ranged: ["power", "accuracy", "manaEfficiency", "statusChance"]
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number): number {
  return Number(value.toFixed(4));
}

export function resolveSkillBand(rank: number): SkillProgressionBandState {
  const normalized = clamp(rank, 1, 125);
  const band =
    SKILL_PROGRESSION_BANDS.find((entry) => normalized >= entry.minRank && normalized <= entry.maxRank) ??
    SKILL_PROGRESSION_BANDS.at(-1);

  if (!band) {
    throw new Error("skill progression bands are not configured");
  }

  return band;
}

export function applyBreakthroughGating(
  requestedRank: number,
  unlockedBandIds: SkillProgressionBandId[] = []
): {
  permittedRank: number;
  blocked: boolean;
  blockedByGate: number | null;
  requiredBandId: SkillProgressionBandId | null;
} {
  const normalized = clamp(requestedRank, 1, 125);

  for (const gate of BREAKTHROUGH_GATES) {
    if (normalized > gate.gate && !unlockedBandIds.includes(gate.bandId)) {
      return {
        permittedRank: gate.gate,
        blocked: true,
        blockedByGate: gate.gate,
        requiredBandId: gate.bandId
      };
    }
  }

  return {
    permittedRank: normalized,
    blocked: false,
    blockedByGate: null,
    requiredBandId: null
  };
}

export function accumulateBreakthroughProgress(input: {
  currentProgress: number;
  performanceScore: number;
  difficultyFactor: number;
  trialBonus?: number;
  eventBonus?: number;
  rngBonus?: number;
}): {
  previousProgress: number;
  gain: number;
  progress: number;
  readyToUnlock: boolean;
} {
  const previousProgress = clamp(input.currentProgress, 0, 100);
  const weightedPerformance = Math.max(0, input.performanceScore) * Math.max(0.1, input.difficultyFactor);
  const bonus = Math.max(0, input.trialBonus ?? 0) + Math.max(0, input.eventBonus ?? 0) + Math.max(0, input.rngBonus ?? 0);
  const gain = round(weightedPerformance + bonus);
  const progress = round(clamp(previousProgress + gain, 0, 100));

  return {
    previousProgress,
    gain,
    progress,
    readyToUnlock: progress >= 100
  };
}

export function evaluateTrialOutcome(
  trial: TrialDefinitionState,
  current: PlayerTrialProgressState | null,
  attempt: {
    successProgress: number;
    failurePotentialLoss: number;
    completedCheckpointIds?: string[];
  }
): PlayerTrialProgressState {
  const currentProgress = current?.progress ?? trial.progress;
  const currentPotential = current?.maxPotential ?? trial.maxPotential;
  const completedCheckpointIds = new Set(current?.completedCheckpointIds ?? []);

  for (const checkpointId of attempt.completedCheckpointIds ?? []) {
    completedCheckpointIds.add(checkpointId);
  }

  const nextProgress = round(clamp(currentProgress + Math.max(0, attempt.successProgress), 0, currentPotential));
  const passed = nextProgress >= trial.thresholdToPass;

  if (passed) {
    return {
      trialId: trial.id,
      associatedSkillId: trial.associatedSkillId,
      progress: nextProgress,
      maxPotential: currentPotential,
      completedCheckpointIds: [...completedCheckpointIds],
      passed: true,
      failed: false
    };
  }

  const reducedPotential = round(clamp(currentPotential - Math.max(0, attempt.failurePotentialLoss), 0, trial.maxPotential));
  return {
    trialId: trial.id,
    associatedSkillId: trial.associatedSkillId,
    progress: nextProgress,
    maxPotential: reducedPotential,
    completedCheckpointIds: [...completedCheckpointIds],
    passed: false,
    failed: reducedPotential < trial.thresholdToPass
  };
}

export function resolveKnowledgeAssistance(input: {
  track: KnowledgeTrackState;
  domainKnowledgeRank: number;
  universalKnowledgeRank: number;
  spottingRank: number;
}): {
  weightedScore: number;
  contributions: {
    domainKnowledge: number;
    universalKnowledge: number;
    spotting: number;
  };
  autoIdentify: Record<"common" | "uncommon" | "rare" | "obscure", boolean>;
} {
  const domainKnowledge = clamp(input.domainKnowledgeRank, 0, 125);
  const universalKnowledge = clamp(input.universalKnowledgeRank, 0, 125);
  const spotting = clamp(input.spottingRank, 0, 125);
  const contributions = {
    domainKnowledge: round(domainKnowledge * input.track.supportWeights.domainKnowledge),
    universalKnowledge: round(universalKnowledge * input.track.supportWeights.universalKnowledge),
    spotting: round(spotting * input.track.supportWeights.spotting)
  };
  const weightedScore = round(contributions.domainKnowledge + contributions.universalKnowledge + contributions.spotting);

  return {
    weightedScore,
    contributions,
    autoIdentify: {
      common: weightedScore >= input.track.autoIdentifyThresholds.common,
      uncommon: weightedScore >= input.track.autoIdentifyThresholds.uncommon,
      rare: weightedScore >= input.track.autoIdentifyThresholds.rare,
      obscure: weightedScore >= input.track.autoIdentifyThresholds.obscure
    }
  };
}

export function validateSpellScalingChannelsForSchool(
  school: string,
  scalingChannels: SpellScalingChannel[]
): {
  valid: boolean;
  invalidChannels: SpellScalingChannel[];
} {
  const allowed = new Set(SPELL_SCALING_CHANNELS_BY_SCHOOL[school] ?? []);
  const invalidChannels = scalingChannels.filter((channel) => !allowed.has(channel));
  return {
    valid: invalidChannels.length === 0,
    invalidChannels
  };
}

export function resolveEligibleTitleMilestones(input: {
  rank: number;
  masteryTrialPassed?: boolean;
}): number[] {
  const thresholds: number[] = [];
  const rank = clamp(input.rank, 0, 125);

  if (rank >= 50) {
    thresholds.push(50);
  }
  if (rank >= 100) {
    thresholds.push(100);
  }
  if (rank >= 125 && input.masteryTrialPassed) {
    thresholds.push(125);
  }

  return thresholds;
}

export function resolveItemUseProfile(
  useProfiles: ItemUseProfileState[] | undefined,
  actionType: string
): ItemUseProfileState | null {
  if (!useProfiles || useProfiles.length === 0) {
    return null;
  }

  return (
    useProfiles.find((profile) => profile.actionType === actionType) ??
    useProfiles.find((profile) => actionType.startsWith(profile.actionType) || profile.actionType.startsWith(actionType)) ??
    null
  );
}
