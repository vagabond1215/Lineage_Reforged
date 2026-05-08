import globalRuleCatalog from "../../../content/base/game/global_rules.json" with { type: "json" };
import playerAttributeCatalog from "../../../content/base/player/attributes.json" with { type: "json" };
import skillCatalog from "../../../content/base/player/skills.json" with { type: "json" };
import { resolveRunDifficultyModifiers } from "./difficulty.js";
import type {
  GlobalRuleContentRecord,
  PlayerAttributeContentRecord,
  SkillContentRecord
} from "../../civilization-engine/src/content.js";
import type {
  EchoBalanceRuleState,
  EchoRequirementState,
  ItemUseProfileState,
  KnowledgeDomainState,
  PlayerAttributeKey,
  PlayerEchoState,
  PlayerLegacyGrowthState,
  PlayerProgression,
  PlayerState,
  PlayerSkillState,
  PlayerTrialProgressState,
  RunDifficultyState,
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

const DEFAULT_SKILL_MAXIMUM_RANK = 125;
const ECHO_BALANCE_RULE_ID = "rule.echo_balance";

type LegacyProgressionCompatState = Partial<PlayerProgression> & {
  classLevel?: number;
  unspentAttributePoints?: number;
  unspentSkillPoints?: number;
  legacyGrowth?: Partial<PlayerLegacyGrowthState>;
};

type EchoCatalog = {
  balanceRule: EchoBalanceRuleState;
  attributeDefaults: Record<PlayerAttributeKey, number>;
  skillById: Map<string, SkillContentRecord>;
};

type ContentCatalog<TRecord> = {
  records: TRecord[];
};

export interface SkillRankGainPolicyInput {
  skillId: string;
  currentSkill?: Pick<PlayerSkillState, "id" | "rank" | "progression"> | null;
  currentRank?: number | null;
  rankDelta?: number | null;
  requestedRank?: number | null;
  unlockedBandIds?: SkillProgressionBandId[] | null;
  sourceLabel?: string | null;
  sourceType?: string | null;
}

export interface SkillRankGainPolicyResult {
  skillId: string;
  previousRank: number;
  requestedRank: number;
  appliedRank: number;
  appliedDelta: number;
  blockedGate: number | null;
  requiredBand: SkillProgressionBandId | null;
  maximumRank: number;
  previousBand: SkillProgressionBandId;
  appliedBand: SkillProgressionBandId;
  sourceLabel: string | null;
  sourceType: string | null;
}

let echoCatalogCache: EchoCatalog | null = null;

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

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, digits = 4): number {
  return Number(value.toFixed(digits));
}

function normalizeInteger(value: unknown, fallback: number, minimum = 0): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(minimum, Math.round(value));
}

function requireFiniteNumber(value: unknown, fieldPath: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${ECHO_BALANCE_RULE_ID} ${fieldPath} must be a finite number`);
  }

  return value;
}

function requirePositiveNumber(value: unknown, fieldPath: string): number {
  const normalized = requireFiniteNumber(value, fieldPath);
  if (normalized <= 0) {
    throw new Error(`${ECHO_BALANCE_RULE_ID} ${fieldPath} must be greater than zero`);
  }

  return normalized;
}

function requireNonNegativeNumber(value: unknown, fieldPath: string): number {
  const normalized = requireFiniteNumber(value, fieldPath);
  if (normalized < 0) {
    throw new Error(`${ECHO_BALANCE_RULE_ID} ${fieldPath} must not be negative`);
  }

  return normalized;
}

function requireAttributeKeyArray(value: unknown, fieldPath: string): PlayerAttributeKey[] {
  if (!Array.isArray(value)) {
    throw new Error(`${ECHO_BALANCE_RULE_ID} ${fieldPath} must be an array`);
  }

  const seen = new Set<PlayerAttributeKey>();
  const keys = value.map((entry, index) => {
    if (
      entry !== "STR" &&
      entry !== "DEX" &&
      entry !== "AGI" &&
      entry !== "CON" &&
      entry !== "VIT" &&
      entry !== "WIS" &&
      entry !== "INT" &&
      entry !== "SPT" &&
      entry !== "CHA"
    ) {
      throw new Error(`${ECHO_BALANCE_RULE_ID} ${fieldPath}[${index}] must be a valid player attribute key`);
    }

    if (seen.has(entry)) {
      throw new Error(`${ECHO_BALANCE_RULE_ID} ${fieldPath}[${index}] must not repeat '${entry}'`);
    }
    seen.add(entry);

    return entry;
  });

  if (keys.length === 0) {
    throw new Error(`${ECHO_BALANCE_RULE_ID} ${fieldPath} must not be empty`);
  }

  return keys;
}

function validateEchoBalanceRule(value: unknown): EchoBalanceRuleState {
  if (!isObject(value)) {
    throw new Error(`${ECHO_BALANCE_RULE_ID} must contain an object value`);
  }

  const exponents = value.exponents;
  const weights = value.weights;
  const normalization = value.normalization;
  const diversity = value.diversity;

  if (!isObject(exponents) || !isObject(weights) || !isObject(normalization) || !isObject(diversity)) {
    throw new Error(`${ECHO_BALANCE_RULE_ID} is missing one or more required configuration blocks`);
  }

  const normalizedRule: EchoBalanceRuleState = {
    version: normalizeInteger(value.version, 1, 1),
    exponents: {
      skill: requirePositiveNumber(exponents.skill, "exponents.skill"),
      stat: requirePositiveNumber(exponents.stat, "exponents.stat"),
      knowledge: requirePositiveNumber(exponents.knowledge, "exponents.knowledge")
    },
    weights: {
      skills: requirePositiveNumber(weights.skills, "weights.skills"),
      stats: requirePositiveNumber(weights.stats, "weights.stats"),
      knowledge: requirePositiveNumber(weights.knowledge, "weights.knowledge")
    },
    levelScale: requirePositiveNumber(value.levelScale, "levelScale"),
    normalization: {
      skillReferenceRank: requirePositiveNumber(normalization.skillReferenceRank, "normalization.skillReferenceRank"),
      skillReferenceSlots: requirePositiveNumber(normalization.skillReferenceSlots, "normalization.skillReferenceSlots"),
      knowledgeSkillReferenceRank: requirePositiveNumber(
        normalization.knowledgeSkillReferenceRank,
        "normalization.knowledgeSkillReferenceRank"
      ),
      knowledgeSkillReferenceSlots: requirePositiveNumber(
        normalization.knowledgeSkillReferenceSlots,
        "normalization.knowledgeSkillReferenceSlots"
      ),
      statReferenceDelta: requirePositiveNumber(normalization.statReferenceDelta, "normalization.statReferenceDelta"),
      trackedAttributeKeys: requireAttributeKeyArray(normalization.trackedAttributeKeys, "normalization.trackedAttributeKeys")
    },
    diversity: {
      thresholdRank: requirePositiveNumber(diversity.thresholdRank, "diversity.thresholdRank"),
      bonusPerSkill: requireNonNegativeNumber(diversity.bonusPerSkill, "diversity.bonusPerSkill"),
      maxMultiplier: requirePositiveNumber(diversity.maxMultiplier, "diversity.maxMultiplier")
    }
  };

  const weightTotal =
    normalizedRule.weights.skills +
    normalizedRule.weights.stats +
    normalizedRule.weights.knowledge;
  if (Math.abs(weightTotal - 1) > 0.0001) {
    throw new Error(`${ECHO_BALANCE_RULE_ID} weights must sum to 1`);
  }

  if (normalizedRule.diversity.maxMultiplier < 1) {
    throw new Error(`${ECHO_BALANCE_RULE_ID} diversity.maxMultiplier must be at least 1`);
  }

  return normalizedRule;
}

function resolveAttributeDefaults(
  records: PlayerAttributeContentRecord[],
  trackedAttributeKeys: PlayerAttributeKey[]
): Record<PlayerAttributeKey, number> {
  const defaultsByKey = records.reduce<Partial<Record<PlayerAttributeKey, number>>>((result, record) => {
    result[record.shortCode] = record.default;
    return result;
  }, {});

  for (const key of trackedAttributeKeys) {
    if (typeof defaultsByKey[key] !== "number") {
      throw new Error(`${ECHO_BALANCE_RULE_ID} references tracked attribute '${key}' without a matching authored default`);
    }
  }

  return defaultsByKey as Record<PlayerAttributeKey, number>;
}

function getGlobalRuleRecords(): GlobalRuleContentRecord<unknown>[] {
  return (globalRuleCatalog as ContentCatalog<GlobalRuleContentRecord<unknown>>).records;
}

function getPlayerAttributeRecords(): PlayerAttributeContentRecord[] {
  return (playerAttributeCatalog as ContentCatalog<PlayerAttributeContentRecord>).records;
}

function getSkillRecords(): SkillContentRecord[] {
  return (skillCatalog as ContentCatalog<SkillContentRecord>).records;
}

function loadEchoCatalog(): EchoCatalog {
  if (echoCatalogCache) {
    return echoCatalogCache;
  }

  const globalRule = getGlobalRuleRecords().find((record) => record.id === ECHO_BALANCE_RULE_ID);
  if (!globalRule) {
    throw new Error(`Missing authored global rule '${ECHO_BALANCE_RULE_ID}'`);
  }

  const balanceRule = validateEchoBalanceRule(globalRule.value);
  const attributeDefaults = resolveAttributeDefaults(
    getPlayerAttributeRecords(),
    balanceRule.normalization.trackedAttributeKeys
  );
  const skillById = new Map(getSkillRecords().map((record) => [record.id, record]));

  echoCatalogCache = {
    balanceRule,
    attributeDefaults,
    skillById
  };

  return echoCatalogCache;
}

function normalizedEchoUnit(value: number, reference: number, exponent: number): number {
  if (!Number.isFinite(value) || value <= 0 || reference <= 0) {
    return 0;
  }

  return round(Math.pow(Math.min(1, value / reference), exponent));
}

export function loadEchoBalanceRule(): EchoBalanceRuleState {
  return loadEchoCatalog().balanceRule;
}

export function createPlayerLegacyGrowthState(
  overrides: Partial<PlayerLegacyGrowthState> = {}
): PlayerLegacyGrowthState {
  return {
    resourceGrowthLevel: normalizeInteger(overrides.resourceGrowthLevel, 1, 1),
    classLevel: normalizeInteger(overrides.classLevel, 0, 0),
    unspentAttributePoints: normalizeInteger(overrides.unspentAttributePoints, 0, 0),
    unspentSkillPoints: normalizeInteger(overrides.unspentSkillPoints, 0, 0)
  };
}

export function createDefaultPlayerEchoState(rule: EchoBalanceRuleState = loadEchoBalanceRule()): PlayerEchoState {
  return {
    balanceRuleId: ECHO_BALANCE_RULE_ID,
    balanceRuleVersion: rule.version,
    skillContribution: 0,
    statContribution: 0,
    knowledgeContribution: 0,
    echoBase: 0,
    diversityCount: 0,
    diversityBonus: 1,
    echoAdjusted: 0
  };
}

export function createPlayerProgressionState(params: {
  level?: number;
  legacyGrowth?: Partial<PlayerLegacyGrowthState>;
} = {}): PlayerProgression {
  return {
    level: normalizeInteger(params.level, 0, 0),
    echo: createDefaultPlayerEchoState(),
    legacyGrowth: createPlayerLegacyGrowthState(params.legacyGrowth)
  };
}

export function normalizePlayerProgression(progression?: LegacyProgressionCompatState | null): PlayerProgression {
  const oldLevel = normalizeInteger(progression?.level, 0, 0);
  const legacyGrowth = createPlayerLegacyGrowthState({
    resourceGrowthLevel: progression?.legacyGrowth?.resourceGrowthLevel ?? (oldLevel || 1),
    classLevel: progression?.legacyGrowth?.classLevel ?? progression?.classLevel ?? 0,
    unspentAttributePoints:
      progression?.legacyGrowth?.unspentAttributePoints ?? progression?.unspentAttributePoints ?? 0,
    unspentSkillPoints: progression?.legacyGrowth?.unspentSkillPoints ?? progression?.unspentSkillPoints ?? 0
  });

  return {
    level: oldLevel,
    echo: createDefaultPlayerEchoState(),
    legacyGrowth
  };
}

export function calculatePlayerEcho(
  playerState: Pick<PlayerState, "attributes" | "skills">
): PlayerEchoState {
  const { balanceRule, attributeDefaults, skillById } = loadEchoCatalog();

  let nonKnowledgeSkillUnits = 0;
  let knowledgeSkillUnits = 0;

  for (const skill of playerState.skills) {
    const skillRecord = skillById.get(skill.id);
    const isKnowledgeSkill = skillRecord?.category === "knowledge";
    const unit = normalizedEchoUnit(
      skill.rank,
      isKnowledgeSkill
        ? balanceRule.normalization.knowledgeSkillReferenceRank
        : balanceRule.normalization.skillReferenceRank,
      isKnowledgeSkill ? balanceRule.exponents.knowledge : balanceRule.exponents.skill
    );

    if (isKnowledgeSkill) {
      knowledgeSkillUnits += unit;
      continue;
    }

    nonKnowledgeSkillUnits += unit;
  }

  const skillContribution = round(
    100 *
      Math.min(
        1,
        nonKnowledgeSkillUnits / balanceRule.normalization.skillReferenceSlots
      )
  );

  const statUnits = balanceRule.normalization.trackedAttributeKeys.map((attributeKey) =>
    normalizedEchoUnit(
      Math.max(0, playerState.attributes[attributeKey] - attributeDefaults[attributeKey]),
      balanceRule.normalization.statReferenceDelta,
      balanceRule.exponents.stat
    )
  );
  const statContribution = round(
    100 *
      (statUnits.length === 0
        ? 0
        : statUnits.reduce((total, entry) => total + entry, 0) / statUnits.length)
  );

  const knowledgeContribution = round(
    100 *
      Math.min(
        1,
        knowledgeSkillUnits / balanceRule.normalization.knowledgeSkillReferenceSlots
      )
  );

  const echoBase = round(
    skillContribution * balanceRule.weights.skills +
      statContribution * balanceRule.weights.stats +
      knowledgeContribution * balanceRule.weights.knowledge
  );

  const diversityCount = playerState.skills.filter(
    (skill) => skill.rank >= balanceRule.diversity.thresholdRank
  ).length;
  const diversityBonus = round(
    Math.min(
      balanceRule.diversity.maxMultiplier,
      1 + diversityCount * balanceRule.diversity.bonusPerSkill
    )
  );
  const echoAdjusted = round(echoBase * diversityBonus);

  return {
    balanceRuleId: ECHO_BALANCE_RULE_ID,
    balanceRuleVersion: balanceRule.version,
    skillContribution,
    statContribution,
    knowledgeContribution,
    echoBase,
    diversityCount,
    diversityBonus,
    echoAdjusted
  };
}

export function resolvePlayerEchoProgression(
  playerState: Pick<PlayerState, "attributes" | "skills" | "progression">
): PlayerProgression {
  const normalizedProgression = normalizePlayerProgression(playerState.progression);
  const echo = calculatePlayerEcho(playerState);
  const level = Math.floor(loadEchoBalanceRule().levelScale * Math.sqrt(Math.max(echo.echoAdjusted, 0)));

  return {
    level,
    echo,
    legacyGrowth: normalizedProgression.legacyGrowth
  };
}

export function syncPlayerEchoProgression(
  playerState: Pick<PlayerState, "attributes" | "skills" | "progression">
): PlayerProgression {
  const progression = resolvePlayerEchoProgression(playerState);
  playerState.progression = progression;
  return progression;
}

export function meetsEchoRequirement(
  progression: PlayerProgression,
  requirement?: EchoRequirementState | null
): boolean {
  if (!requirement) {
    return true;
  }

  if (progression.level < requirement.minLevel) {
    return false;
  }

  if (
    requirement.minEchoAdjusted !== undefined &&
    requirement.minEchoAdjusted !== null &&
    progression.echo.echoAdjusted < requirement.minEchoAdjusted
  ) {
    return false;
  }

  return true;
}

export function canAttemptTrial(
  trial: Pick<TrialDefinitionState, "echoRequirement">,
  progression: PlayerProgression
): boolean {
  return meetsEchoRequirement(progression, trial.echoRequirement);
}

export function resolveGlobalRuleEchoRequirement(ruleId: string): EchoRequirementState | null {
  const globalRule = getGlobalRuleRecords().find((record) => record.id === ruleId);
  if (!globalRule || !isObject(globalRule.value)) {
    return null;
  }

  const requirement = globalRule.value.echoRequirement;
  if (!isObject(requirement) || typeof requirement.minLevel !== "number") {
    return null;
  }

  return {
    minLevel: requirement.minLevel,
    minEchoAdjusted:
      typeof requirement.minEchoAdjusted === "number" ? requirement.minEchoAdjusted : null
  };
}

export function meetsGlobalRuleEchoRequirement(
  ruleId: string,
  progression: PlayerProgression
): boolean {
  return meetsEchoRequirement(progression, resolveGlobalRuleEchoRequirement(ruleId));
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

function resolveSkillMaximumRank(skillId: string): number {
  const authoredMaximum = loadEchoCatalog().skillById.get(skillId)?.leveling.maximumRank;
  return clamp(normalizeInteger(authoredMaximum, DEFAULT_SKILL_MAXIMUM_RANK, 1), 1, DEFAULT_SKILL_MAXIMUM_RANK);
}

function normalizeSkillRank(value: unknown, fallback: number, maximumRank: number): number {
  return clamp(normalizeInteger(value, fallback, 0), 0, maximumRank);
}

function normalizeRequestedSkillRank(input: SkillRankGainPolicyInput, previousRank: number): number {
  if (typeof input.requestedRank === "number" && Number.isFinite(input.requestedRank)) {
    return Math.max(0, Math.round(input.requestedRank));
  }

  if (typeof input.rankDelta !== "number" || !Number.isFinite(input.rankDelta) || input.rankDelta <= 0) {
    return previousRank;
  }

  return Math.max(0, previousRank + Math.round(input.rankDelta));
}

function normalizeUnlockedSkillBands(value: SkillProgressionBandId[] | null | undefined): SkillProgressionBandId[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const validBandIds = new Set(BREAKTHROUGH_GATES.map((gate) => gate.bandId));
  const normalized: SkillProgressionBandId[] = [];
  for (const bandId of value) {
    if (!validBandIds.has(bandId) || normalized.includes(bandId)) {
      continue;
    }

    normalized.push(bandId);
  }

  return normalized;
}

function normalizeOptionalText(value: string | null | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function resolveSkillRankGainPolicy(input: SkillRankGainPolicyInput): SkillRankGainPolicyResult {
  const maximumRank = resolveSkillMaximumRank(input.skillId);
  const matchingSkill = input.currentSkill?.id === input.skillId ? input.currentSkill : null;
  const previousRank = normalizeSkillRank(input.currentRank ?? matchingSkill?.rank, 0, maximumRank);
  const requestedRank = normalizeRequestedSkillRank(input, previousRank);
  const unlockedBandIds = normalizeUnlockedSkillBands(input.unlockedBandIds ?? matchingSkill?.progression?.unlockedBandIds);

  if (requestedRank <= previousRank) {
    return {
      skillId: input.skillId,
      previousRank,
      requestedRank,
      appliedRank: previousRank,
      appliedDelta: 0,
      blockedGate: null,
      requiredBand: null,
      maximumRank,
      previousBand: resolveSkillBand(previousRank).id,
      appliedBand: resolveSkillBand(previousRank).id,
      sourceLabel: normalizeOptionalText(input.sourceLabel),
      sourceType: normalizeOptionalText(input.sourceType)
    };
  }

  const rankForGating = Math.min(requestedRank, maximumRank);
  const gated = applyBreakthroughGating(rankForGating, unlockedBandIds);
  const appliedRank = clamp(Math.max(previousRank, gated.permittedRank), 0, maximumRank);

  return {
    skillId: input.skillId,
    previousRank,
    requestedRank,
    appliedRank,
    appliedDelta: appliedRank - previousRank,
    blockedGate: gated.blockedByGate,
    requiredBand: gated.requiredBandId,
    maximumRank,
    previousBand: resolveSkillBand(previousRank).id,
    appliedBand: resolveSkillBand(appliedRank).id,
    sourceLabel: normalizeOptionalText(input.sourceLabel),
    sourceType: normalizeOptionalText(input.sourceType)
  };
}

export function accumulateBreakthroughProgress(input: {
  currentProgress: number;
  performanceScore: number;
  requirementScalar?: number;
  difficultyFactor?: number;
  requiredProgress?: number;
  trialBonus?: number;
  eventBonus?: number;
  rngBonus?: number;
}): {
  previousProgress: number;
  gain: number;
  progress: number;
  requiredProgress: number;
  readyToUnlock: boolean;
} {
  const requirementScalar = Math.max(0.1, input.requirementScalar ?? input.difficultyFactor ?? 1);
  const requiredProgress = round(Math.max(1, (input.requiredProgress ?? 100) * requirementScalar));
  const previousProgress = clamp(input.currentProgress, 0, requiredProgress);
  const weightedPerformance = Math.max(0, input.performanceScore);
  const bonus = Math.max(0, input.trialBonus ?? 0) + Math.max(0, input.eventBonus ?? 0) + Math.max(0, input.rngBonus ?? 0);
  const gain = round(weightedPerformance + bonus);
  const progress = round(clamp(previousProgress + gain, 0, requiredProgress));

  return {
    previousProgress,
    gain,
    progress,
    requiredProgress,
    readyToUnlock: progress >= requiredProgress
  };
}

function resolveProgressionDifficultyThresholds(
  base: {
    requirement: number;
    meaningfulActionThreshold: number;
    antiTrivialityThreshold: number;
    trainingGate: number;
    retentionPressure: number;
  },
  scaling: ReturnType<typeof resolveRunDifficultyModifiers>["skillProgression" | "knowledgeProgression"]
) {
  return {
    requirement: round(base.requirement * scaling.requirementScalar),
    meaningfulActionThreshold: round(base.meaningfulActionThreshold * scaling.meaningfulActionScalar),
    antiTrivialityThreshold: round(base.antiTrivialityThreshold * scaling.antiTrivialityScalar),
    trainingGate: round(base.trainingGate * scaling.trainingGateScalar),
    retentionPressure: round(base.retentionPressure * scaling.retentionPressureScalar)
  };
}

export function resolveSkillProgressionDifficultyThresholds(
  base: {
    requirement: number;
    meaningfulActionThreshold: number;
    antiTrivialityThreshold: number;
    trainingGate: number;
    retentionPressure: number;
  },
  runDifficulty?: Partial<RunDifficultyState> | null
) {
  return resolveProgressionDifficultyThresholds(base, resolveRunDifficultyModifiers(runDifficulty).skillProgression);
}

export function resolveKnowledgeProgressionDifficultyThresholds(
  base: {
    requirement: number;
    meaningfulActionThreshold: number;
    antiTrivialityThreshold: number;
    trainingGate: number;
    retentionPressure: number;
  },
  runDifficulty?: Partial<RunDifficultyState> | null
) {
  return resolveProgressionDifficultyThresholds(base, resolveRunDifficultyModifiers(runDifficulty).knowledgeProgression);
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
  track: KnowledgeDomainState;
  domainKnowledgeRank: number;
  generalLoreRank: number;
  spottingRank: number;
}): {
  weightedScore: number;
  contributions: {
    domainKnowledge: number;
    generalLore: number;
    spotting: number;
  };
  autoIdentify: Record<"common" | "uncommon" | "rare" | "obscure", boolean>;
} {
  const domainKnowledge = clamp(input.domainKnowledgeRank, 0, 125);
  const generalLore = clamp(input.generalLoreRank, 0, 125);
  const spotting = clamp(input.spottingRank, 0, 125);
  const contributions = {
    domainKnowledge: round(domainKnowledge * input.track.supportWeights.domainKnowledge),
    generalLore: round(generalLore * input.track.supportWeights.generalLore),
    spotting: round(spotting * input.track.supportWeights.spotting)
  };
  const weightedScore = round(contributions.domainKnowledge + contributions.generalLore + contributions.spotting);

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

