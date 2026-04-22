import globalRuleCatalog from "../../../content/base/game/global_rules.json" with { type: "json" };
import type { GlobalRuleContentRecord } from "../../civilization-engine/src/content.js";
import type {
  DifficultyBalanceRuleState,
  DifficultyBodyStateRuleState,
  DifficultyEchoRuleState,
  DifficultyPrestigeRuleState,
  DifficultyProgressionRuleState,
  DifficultyStatGrowthRuleState,
  DifficultyTierRuleState,
  RecoveryAssessmentState,
  ResolvedDifficultyModifiersState,
  RunDifficultyState,
  RunDifficultyTierId,
  StatGrowthBalanceRuleState
} from "../../../shared/types/src/index.js";

const RUN_DIFFICULTY_BALANCE_RULE_ID = "rule.run_difficulty_balance";
const RUN_DIFFICULTY_TIERS: RunDifficultyTierId[] = ["easy", "normal", "hard", "brutal"];

type ContentCatalog<TRecord> = {
  records: TRecord[];
};

let difficultyBalanceRuleCache: DifficultyBalanceRuleState | null = null;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isDevelopmentLikeEnvironment(): boolean {
  const metaEnv =
    typeof import.meta !== "undefined"
      ? (import.meta as ImportMeta & { env?: { PROD?: boolean } }).env
      : undefined;
  if (typeof metaEnv !== "undefined") {
    return !Boolean(metaEnv.PROD);
  }

  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function normalizeFinite(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function requirePositiveNumber(value: unknown, fieldPath: string): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`${RUN_DIFFICULTY_BALANCE_RULE_ID} ${fieldPath} must be a positive number`);
  }
  return value;
}

function requireBoolean(value: unknown, fieldPath: string): boolean {
  if (typeof value !== "boolean") {
    throw new Error(`${RUN_DIFFICULTY_BALANCE_RULE_ID} ${fieldPath} must be a boolean`);
  }
  return value;
}

function validateStatGrowthRule(value: unknown, fieldPath: string): DifficultyStatGrowthRuleState {
  if (!isObject(value)) {
    throw new Error(`${RUN_DIFFICULTY_BALANCE_RULE_ID} ${fieldPath} must be an object`);
  }

  return {
    loadThresholdScalar: requirePositiveNumber(value.loadThresholdScalar, `${fieldPath}.loadThresholdScalar`),
    saturationScalar: requirePositiveNumber(value.saturationScalar, `${fieldPath}.saturationScalar`),
    recoveryCapacityScalar: requirePositiveNumber(value.recoveryCapacityScalar, `${fieldPath}.recoveryCapacityScalar`),
    minimumRecoveryQualityScalar: requirePositiveNumber(
      value.minimumRecoveryQualityScalar,
      `${fieldPath}.minimumRecoveryQualityScalar`
    ),
    minimumRecoveryDurationScalar: requirePositiveNumber(
      value.minimumRecoveryDurationScalar,
      `${fieldPath}.minimumRecoveryDurationScalar`
    )
  };
}

function validateProgressionRule(value: unknown, fieldPath: string): DifficultyProgressionRuleState {
  if (!isObject(value)) {
    throw new Error(`${RUN_DIFFICULTY_BALANCE_RULE_ID} ${fieldPath} must be an object`);
  }

  return {
    requirementScalar: requirePositiveNumber(value.requirementScalar, `${fieldPath}.requirementScalar`),
    meaningfulActionScalar: requirePositiveNumber(value.meaningfulActionScalar, `${fieldPath}.meaningfulActionScalar`),
    antiTrivialityScalar: requirePositiveNumber(value.antiTrivialityScalar, `${fieldPath}.antiTrivialityScalar`),
    trainingGateScalar: requirePositiveNumber(value.trainingGateScalar, `${fieldPath}.trainingGateScalar`),
    retentionPressureScalar: requirePositiveNumber(value.retentionPressureScalar, `${fieldPath}.retentionPressureScalar`)
  };
}

function validateBodyStateRule(value: unknown, fieldPath: string): DifficultyBodyStateRuleState {
  if (!isObject(value)) {
    throw new Error(`${RUN_DIFFICULTY_BALANCE_RULE_ID} ${fieldPath} must be an object`);
  }

  return {
    deficitOnsetScalar: requirePositiveNumber(value.deficitOnsetScalar, `${fieldPath}.deficitOnsetScalar`),
    surplusPersistenceScalar: requirePositiveNumber(value.surplusPersistenceScalar, `${fieldPath}.surplusPersistenceScalar`),
    resourceDrainScalar: requirePositiveNumber(value.resourceDrainScalar, `${fieldPath}.resourceDrainScalar`),
    recoveryEffectivenessScalar: requirePositiveNumber(
      value.recoveryEffectivenessScalar,
      `${fieldPath}.recoveryEffectivenessScalar`
    ),
    fatigueDebtPersistenceScalar: requirePositiveNumber(
      value.fatigueDebtPersistenceScalar,
      `${fieldPath}.fatigueDebtPersistenceScalar`
    ),
    penaltySeverityScalar: requirePositiveNumber(value.penaltySeverityScalar, `${fieldPath}.penaltySeverityScalar`),
    starvationEscalationScalar: requirePositiveNumber(
      value.starvationEscalationScalar,
      `${fieldPath}.starvationEscalationScalar`
    ),
    dehydrationEscalationScalar: requirePositiveNumber(
      value.dehydrationEscalationScalar,
      `${fieldPath}.dehydrationEscalationScalar`
    )
  };
}

function validateEchoRule(value: unknown, fieldPath: string): DifficultyEchoRuleState {
  if (!isObject(value)) {
    throw new Error(`${RUN_DIFFICULTY_BALANCE_RULE_ID} ${fieldPath} must be an object`);
  }

  return {
    requirementScalar: requirePositiveNumber(value.requirementScalar, `${fieldPath}.requirementScalar`)
  };
}

function validatePrestigeRule(value: unknown, fieldPath: string): DifficultyPrestigeRuleState {
  if (!isObject(value)) {
    throw new Error(`${RUN_DIFFICULTY_BALANCE_RULE_ID} ${fieldPath} must be an object`);
  }

  return {
    rewardMultiplier: requirePositiveNumber(value.rewardMultiplier, `${fieldPath}.rewardMultiplier`)
  };
}

function validateTierRule(value: unknown, fieldPath: string): DifficultyTierRuleState {
  if (!isObject(value)) {
    throw new Error(`${RUN_DIFFICULTY_BALANCE_RULE_ID} ${fieldPath} must be an object`);
  }

  return {
    statGrowth: validateStatGrowthRule(value.statGrowth, `${fieldPath}.statGrowth`),
    skillProgression: validateProgressionRule(value.skillProgression, `${fieldPath}.skillProgression`),
    knowledgeProgression: validateProgressionRule(value.knowledgeProgression, `${fieldPath}.knowledgeProgression`),
    bodyState: validateBodyStateRule(value.bodyState, `${fieldPath}.bodyState`),
    echo: validateEchoRule(value.echo, `${fieldPath}.echo`),
    prestige: validatePrestigeRule(value.prestige, `${fieldPath}.prestige`)
  };
}

function validateDifficultyBalanceRule(value: unknown): DifficultyBalanceRuleState {
  if (!isObject(value) || !isObject(value.tiers) || !isObject(value.hardcore)) {
    throw new Error(`${RUN_DIFFICULTY_BALANCE_RULE_ID} must define tiers and hardcore blocks`);
  }

  const tiersValue = value.tiers as Record<string, unknown>;
  const tiers = RUN_DIFFICULTY_TIERS.reduce<Record<RunDifficultyTierId, DifficultyTierRuleState>>((result, tier) => {
    result[tier] = validateTierRule(tiersValue[tier], `tiers.${tier}`);
    return result;
  }, {} as Record<RunDifficultyTierId, DifficultyTierRuleState>);

  return {
    version: Math.max(1, Math.round(normalizeFinite(value.version, 1))),
    tiers,
    hardcore: {
      recoveryScalar: requirePositiveNumber(value.hardcore.recoveryScalar, "hardcore.recoveryScalar"),
      deficitRecoveryScalar: requirePositiveNumber(
        value.hardcore.deficitRecoveryScalar,
        "hardcore.deficitRecoveryScalar"
      ),
      aftereffectPersistenceScalar: requirePositiveNumber(
        value.hardcore.aftereffectPersistenceScalar,
        "hardcore.aftereffectPersistenceScalar"
      ),
      partialRecoveryScalar: requirePositiveNumber(
        value.hardcore.partialRecoveryScalar,
        "hardcore.partialRecoveryScalar"
      ),
      removeForgivenessCaps: requireBoolean(value.hardcore.removeForgivenessCaps, "hardcore.removeForgivenessCaps"),
      deathZeroesPrestige: requireBoolean(value.hardcore.deathZeroesPrestige, "hardcore.deathZeroesPrestige"),
      prestigeMultiplier: requirePositiveNumber(value.hardcore.prestigeMultiplier, "hardcore.prestigeMultiplier")
    }
  };
}

function getGlobalRuleRecords(): GlobalRuleContentRecord<unknown>[] {
  return (globalRuleCatalog as ContentCatalog<GlobalRuleContentRecord<unknown>>).records;
}

function createReservedEchoRule(requirementScalar: number): DifficultyEchoRuleState {
  const echo = {} as DifficultyEchoRuleState;

  Object.defineProperty(echo, "requirementScalar", {
    configurable: false,
    enumerable: false,
    get() {
      if (isDevelopmentLikeEnvironment()) {
        throw new Error(
          `${RUN_DIFFICULTY_BALANCE_RULE_ID} echo.requirementScalar is reserved for future use and must not be read in v1`
        );
      }
      return 1;
    }
  });

  void requirementScalar;
  return echo;
}

function cloneTierRule(rule: DifficultyTierRuleState): DifficultyTierRuleState {
  return {
    statGrowth: { ...rule.statGrowth },
    skillProgression: { ...rule.skillProgression },
    knowledgeProgression: { ...rule.knowledgeProgression },
    bodyState: { ...rule.bodyState },
    echo: { ...rule.echo },
    prestige: { ...rule.prestige }
  };
}

export function createRunDifficultyState(input?: Partial<RunDifficultyState> | null): RunDifficultyState {
  return {
    tier:
      input?.tier === "easy" || input?.tier === "normal" || input?.tier === "hard" || input?.tier === "brutal"
        ? input.tier
        : "normal",
    hardcore: normalizeBoolean(input?.hardcore, false)
  };
}

export function normalizeRunDifficultyState(input?: Partial<RunDifficultyState> | null): RunDifficultyState {
  return createRunDifficultyState(input);
}

export function loadRunDifficultyBalanceRule(): DifficultyBalanceRuleState {
  if (difficultyBalanceRuleCache) {
    return difficultyBalanceRuleCache;
  }

  const record = getGlobalRuleRecords().find((entry) => entry.id === RUN_DIFFICULTY_BALANCE_RULE_ID);
  if (!record) {
    throw new Error(`Missing required global rule ${RUN_DIFFICULTY_BALANCE_RULE_ID}`);
  }

  difficultyBalanceRuleCache = validateDifficultyBalanceRule(record.value);
  return difficultyBalanceRuleCache;
}

export function resolveRunDifficultyModifiers(
  runDifficulty?: Partial<RunDifficultyState> | null
): ResolvedDifficultyModifiersState {
  const normalized = normalizeRunDifficultyState(runDifficulty);
  const rule = loadRunDifficultyBalanceRule();
  const tierRule = cloneTierRule(rule.tiers[normalized.tier]);

  return {
    tier: normalized.tier,
    hardcoreEnabled: normalized.hardcore,
    statGrowth: { ...tierRule.statGrowth },
    skillProgression: { ...tierRule.skillProgression },
    knowledgeProgression: { ...tierRule.knowledgeProgression },
    bodyState: { ...tierRule.bodyState },
    echo: createReservedEchoRule(tierRule.echo.requirementScalar),
    prestige: { ...tierRule.prestige },
    hardcore: normalized.hardcore ? { ...rule.hardcore } : null
  };
}

export function resolveRecoveryGate(input: {
  runDifficulty?: Partial<RunDifficultyState> | null;
  recoveryAssessment: RecoveryAssessmentState | null | undefined;
  statGrowthRule: Pick<StatGrowthBalanceRuleState, "recoveryGate">;
}): {
  minimumQuality: number;
  minimumDurationHours: number;
  observedQuality: number;
  observedDurationHours: number;
  passesGate: boolean;
  statConversionScalar: number;
  bodyStateRecoveryScalar: number;
} {
  const modifiers = resolveRunDifficultyModifiers(input.runDifficulty);
  const observedQuality = Math.max(0, normalizeFinite(input.recoveryAssessment?.quality, 0));
  const observedDurationHours = Math.max(0, normalizeFinite(input.recoveryAssessment?.durationHours, 0));
  const minimumQuality =
    input.statGrowthRule.recoveryGate.minimumQuality * modifiers.statGrowth.minimumRecoveryQualityScalar;
  const minimumDurationHours =
    input.statGrowthRule.recoveryGate.minimumDurationHours * modifiers.statGrowth.minimumRecoveryDurationScalar;
  const passesGate = observedQuality >= minimumQuality && observedDurationHours >= minimumDurationHours;

  if (passesGate) {
    return {
      minimumQuality,
      minimumDurationHours,
      observedQuality,
      observedDurationHours,
      passesGate: true,
      statConversionScalar: modifiers.hardcoreEnabled ? (modifiers.hardcore?.recoveryScalar ?? 1) : 1,
      bodyStateRecoveryScalar: modifiers.hardcoreEnabled ? (modifiers.hardcore?.recoveryScalar ?? 1) : 1
    };
  }

  const qualityRatio = observedQuality / Math.max(minimumQuality, Number.EPSILON);
  const durationRatio = observedDurationHours / Math.max(minimumDurationHours, Number.EPSILON);
  const partialRatio = Math.max(0, Math.min(1, Math.min(qualityRatio, durationRatio)));
  const hardcorePartialScalar = modifiers.hardcoreEnabled ? (modifiers.hardcore?.partialRecoveryScalar ?? 1) : 1;

  return {
    minimumQuality,
    minimumDurationHours,
    observedQuality,
    observedDurationHours,
    passesGate: false,
    statConversionScalar: 0,
    bodyStateRecoveryScalar: partialRatio * hardcorePartialScalar
  };
}

export function resolvePrestigeRewardMultiplier(input: {
  runDifficulty?: Partial<RunDifficultyState> | null;
  runEndsInDeath?: boolean;
} = {}): number {
  const modifiers = resolveRunDifficultyModifiers(input.runDifficulty);
  if (modifiers.hardcoreEnabled && modifiers.hardcore?.deathZeroesPrestige && input.runEndsInDeath) {
    return 0;
  }

  const hardcoreMultiplier = modifiers.hardcoreEnabled ? (modifiers.hardcore?.prestigeMultiplier ?? 1) : 1;
  return modifiers.prestige.rewardMultiplier * hardcoreMultiplier;
}
