import globalRuleCatalog from "../../../content/base/game/global_rules.json" with { type: "json" };
import {
  getPlayerLineageProfile,
  type PlayerFoodTagBiasId,
  type PlayerLineageMetabolicProfileRecord
} from "../../../shared/types/src/player-origins.js";
import { resolveRecoveryGate, resolveRunDifficultyModifiers } from "./difficulty.js";
import { loadStatGrowthBalanceRule } from "./stat-growth.js";
import type { GlobalRuleContentRecord } from "../../civilization-engine/src/content.js";
import type {
  ActionIntensityTier,
  ActionMetabolicProfileState,
  BodyEnergyBandId,
  BodyFatigueBandId,
  BodyHydrationBandId,
  BodyIntoxicationBandId,
  BodyProteinBandId,
  BodyStateBalanceRuleState,
  ConsumableProfileState,
  PlayerBodyState,
  RecoveryAssessmentState,
  PlayerState,
  RecoveryContextState,
  RunDifficultyState,
  ResolvedBodyState
} from "../../../shared/types/src/index.js";

const BODY_STATE_BALANCE_RULE_ID = "rule.body_state_balance";

type ContentCatalog<TRecord> = {
  records: TRecord[];
};

type BodyStateAdvanceOptions = {
  day: number;
  tick: number;
  lineageId?: string | null;
  runDifficulty?: Partial<RunDifficultyState> | null;
  metabolicProfile?: ActionMetabolicProfileState | null;
  recoveryContext?: RecoveryContextState | null;
  recoveryAssessment?: RecoveryAssessmentState | null;
};

type ConsumableApplicationOptions = {
  itemTags?: string[];
  lineageId?: string | null;
  runDifficulty?: Partial<RunDifficultyState> | null;
  tick?: number;
  day?: number;
};

const DEFAULT_LINEAGE_METABOLISM: PlayerLineageMetabolicProfileRecord = {
  calorieEfficiency: 1,
  proteinRecoveryEfficiency: 1,
  carbToStaminaEfficiency: 1,
  fatToReserveEfficiency: 1,
  hydrationRetention: 1,
  dehydrationSensitivity: 1,
  intoxicationSensitivity: 1,
  deficiencyPenaltyScale: 1,
  atrophySensitivity: 1,
  foodTagBiases: {}
};

let bodyStateBalanceRuleCache: BodyStateBalanceRuleState | null = null;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, digits = 4): number {
  return Number(value.toFixed(digits));
}

function normalizeFinite(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeInteger(value: unknown, fallback: number): number {
  return Math.round(normalizeFinite(value, fallback));
}

function requirePositiveNumber(value: unknown, fieldPath: string): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`${BODY_STATE_BALANCE_RULE_ID} ${fieldPath} must be a positive number`);
  }

  return value;
}

function requireRangeRecord<TKey extends string>(
  value: unknown,
  fieldPath: string,
  keys: readonly TKey[]
): Record<TKey, number> {
  if (!isObject(value)) {
    throw new Error(`${BODY_STATE_BALANCE_RULE_ID} ${fieldPath} must be an object`);
  }

  return keys.reduce<Record<TKey, number>>((result, key) => {
    result[key] = requirePositiveNumber(value[key], `${fieldPath}.${key}`);
    return result;
  }, {} as Record<TKey, number>);
}

function validateBodyStateBalanceRule(value: unknown): BodyStateBalanceRuleState {
  if (!isObject(value)) {
    throw new Error(`${BODY_STATE_BALANCE_RULE_ID} must define an object value`);
  }

  const targets = value.targets;
  const energy = value.energy;
  const protein = value.protein;
  const hydration = value.hydration;
  const fatigue = value.fatigue;
  const intoxication = value.intoxication;
  const starvation = value.starvation;
  const recovery = value.recovery;

  if (
    !isObject(targets) ||
    !isObject(energy) ||
    !isObject(protein) ||
    !isObject(hydration) ||
    !isObject(fatigue) ||
    !isObject(intoxication) ||
    !isObject(starvation) ||
    !isObject(recovery)
  ) {
    throw new Error(`${BODY_STATE_BALANCE_RULE_ID} is missing one or more required configuration blocks`);
  }

  const energyBands = isObject(energy.energyBands) ? energy.energyBands : {};
  const proteinStrengthPenalty = isObject(protein.strengthPenaltyByLoad) ? protein.strengthPenaltyByLoad : {};
  const hydrationBands = isObject(hydration.bands) ? hydration.bands : {};

  return {
    version: Math.max(1, normalizeInteger(value.version, 1)),
    targets: {
      dailyCalories: requirePositiveNumber(targets.dailyCalories, "targets.dailyCalories"),
      dailyHydration: requirePositiveNumber(targets.dailyHydration, "targets.dailyHydration"),
      proteinBaseline: requirePositiveNumber(targets.proteinBaseline, "targets.proteinBaseline"),
      proteinLoadScale: requirePositiveNumber(targets.proteinLoadScale, "targets.proteinLoadScale")
    },
    energy: {
      quickWeight: requirePositiveNumber(energy.quickWeight, "energy.quickWeight"),
      storedWeight: requirePositiveNumber(energy.storedWeight, "energy.storedWeight"),
      quickDecayByIntensity: requireRangeRecord<ActionIntensityTier>(
        energy.quickDecayByIntensity,
        "energy.quickDecayByIntensity",
        ["low", "moderate", "high", "extreme"]
      ),
      storedDecayByIntensity: requireRangeRecord<ActionIntensityTier>(
        energy.storedDecayByIntensity,
        "energy.storedDecayByIntensity",
        ["low", "moderate", "high", "extreme"]
      ),
      quickGainPerCalorie: requirePositiveNumber(energy.quickGainPerCalorie, "energy.quickGainPerCalorie"),
      storedGainPerCalorie: requirePositiveNumber(energy.storedGainPerCalorie, "energy.storedGainPerCalorie"),
      energyBands: {
        wellFed: requirePositiveNumber(energyBands.wellFed, "energy.energyBands.wellFed"),
        stable: requirePositiveNumber(energyBands.stable, "energy.energyBands.stable"),
        lowEnergy: requirePositiveNumber(energyBands.lowEnergy, "energy.energyBands.lowEnergy")
      },
      staminaRegenMultipliers: requireRangeRecord<BodyEnergyBandId>(
        energy.staminaRegenMultipliers,
        "energy.staminaRegenMultipliers",
        ["well_fed", "stable", "low_energy", "drained"]
      ),
      fatigueGainMultipliers: requireRangeRecord<BodyEnergyBandId>(
        energy.fatigueGainMultipliers,
        "energy.fatigueGainMultipliers",
        ["well_fed", "stable", "low_energy", "drained"]
      ),
      recoveryMultipliers: requireRangeRecord<BodyEnergyBandId>(
        energy.recoveryMultipliers,
        "energy.recoveryMultipliers",
        ["well_fed", "stable", "low_energy", "drained"]
      )
    },
    protein: {
      smoothing: requirePositiveNumber(protein.smoothing, "protein.smoothing"),
      recoveryMultipliers: requireRangeRecord<BodyProteinBandId>(
        protein.recoveryMultipliers,
        "protein.recoveryMultipliers",
        ["protein_rich", "supported", "thin_diet", "deficient"]
      ),
      strengthPenaltyByLoad: {
        mild: requirePositiveNumber(proteinStrengthPenalty.mild, "protein.strengthPenaltyByLoad.mild"),
        moderate: requirePositiveNumber(
          proteinStrengthPenalty.moderate,
          "protein.strengthPenaltyByLoad.moderate"
        ),
        severe: requirePositiveNumber(proteinStrengthPenalty.severe, "protein.strengthPenaltyByLoad.severe")
      }
    },
    hydration: {
      passiveLossPerTick: requirePositiveNumber(hydration.passiveLossPerTick, "hydration.passiveLossPerTick"),
      recoveryGainPerTick: requirePositiveNumber(hydration.recoveryGainPerTick, "hydration.recoveryGainPerTick"),
      bands: {
        optimal: requirePositiveNumber(hydrationBands.optimal, "hydration.bands.optimal"),
        slightlyDehydrated: requirePositiveNumber(
          hydrationBands.slightlyDehydrated,
          "hydration.bands.slightlyDehydrated"
        ),
        dehydrated: requirePositiveNumber(hydrationBands.dehydrated, "hydration.bands.dehydrated")
      },
      staminaRegenMultipliers: requireRangeRecord<BodyHydrationBandId>(
        hydration.staminaRegenMultipliers,
        "hydration.staminaRegenMultipliers",
        ["optimal", "slightly_dehydrated", "dehydrated", "severely_dehydrated"]
      ),
      fatigueGainMultipliers: requireRangeRecord<BodyHydrationBandId>(
        hydration.fatigueGainMultipliers,
        "hydration.fatigueGainMultipliers",
        ["optimal", "slightly_dehydrated", "dehydrated", "severely_dehydrated"]
      ),
      actionEfficiencyMultipliers: requireRangeRecord<BodyHydrationBandId>(
        hydration.actionEfficiencyMultipliers,
        "hydration.actionEfficiencyMultipliers",
        ["optimal", "slightly_dehydrated", "dehydrated", "severely_dehydrated"]
      )
    },
    fatigue: {
      passiveRecoveryPerTick: requirePositiveNumber(fatigue.passiveRecoveryPerTick, "fatigue.passiveRecoveryPerTick"),
      sleepRecoveryPerUnit: requirePositiveNumber(fatigue.sleepRecoveryPerUnit, "fatigue.sleepRecoveryPerUnit"),
      carryoverThreshold: requirePositiveNumber(fatigue.carryoverThreshold, "fatigue.carryoverThreshold"),
      carryoverScale: requirePositiveNumber(fatigue.carryoverScale, "fatigue.carryoverScale"),
      actionEfficiencyPerPoint: requirePositiveNumber(fatigue.actionEfficiencyPerPoint, "fatigue.actionEfficiencyPerPoint"),
      staminaMaxPerPoint: requirePositiveNumber(fatigue.staminaMaxPerPoint, "fatigue.staminaMaxPerPoint"),
      staminaDebtMaxPerPoint: requirePositiveNumber(
        fatigue.staminaDebtMaxPerPoint,
        "fatigue.staminaDebtMaxPerPoint"
      ),
      staminaRegenPerPoint: requirePositiveNumber(fatigue.staminaRegenPerPoint, "fatigue.staminaRegenPerPoint"),
      staminaDebtRegenPerPoint: requirePositiveNumber(
        fatigue.staminaDebtRegenPerPoint,
        "fatigue.staminaDebtRegenPerPoint"
      )
    },
    intoxication: {
      decayPerTick: requirePositiveNumber(intoxication.decayPerTick, "intoxication.decayPerTick"),
      buzzedThreshold: requirePositiveNumber(intoxication.buzzedThreshold, "intoxication.buzzedThreshold"),
      drunkThreshold: requirePositiveNumber(intoxication.drunkThreshold, "intoxication.drunkThreshold"),
      heavilyIntoxicatedThreshold: requirePositiveNumber(
        intoxication.heavilyIntoxicatedThreshold,
        "intoxication.heavilyIntoxicatedThreshold"
      ),
      blackoutRiskThreshold: requirePositiveNumber(
        intoxication.blackoutRiskThreshold,
        "intoxication.blackoutRiskThreshold"
      ),
      mediumActionPenalty: requirePositiveNumber(intoxication.mediumActionPenalty, "intoxication.mediumActionPenalty"),
      mediumHydrationLossMultiplier: requirePositiveNumber(
        intoxication.mediumHydrationLossMultiplier,
        "intoxication.mediumHydrationLossMultiplier"
      ),
      highActionPenalty: requirePositiveNumber(intoxication.highActionPenalty, "intoxication.highActionPenalty"),
      highStaminaPenalty: requirePositiveNumber(intoxication.highStaminaPenalty, "intoxication.highStaminaPenalty"),
      highHydrationLossMultiplier: requirePositiveNumber(
        intoxication.highHydrationLossMultiplier,
        "intoxication.highHydrationLossMultiplier"
      ),
      nextDayFatigueDebt: requirePositiveNumber(intoxication.nextDayFatigueDebt, "intoxication.nextDayFatigueDebt")
    },
    starvation: {
      dailyRecoveryWhenCovered: requirePositiveNumber(
        starvation.dailyRecoveryWhenCovered,
        "starvation.dailyRecoveryWhenCovered"
      ),
      maxDeficitDays: requirePositiveNumber(starvation.maxDeficitDays, "starvation.maxDeficitDays"),
      stageTwoThreshold: requirePositiveNumber(starvation.stageTwoThreshold, "starvation.stageTwoThreshold"),
      stageThreeThreshold: requirePositiveNumber(starvation.stageThreeThreshold, "starvation.stageThreeThreshold")
    },
    recovery: {
      campMultipliers: requireRangeRecord<"none" | "basic" | "proper" | "secure_indoor">(
        recovery.campMultipliers,
        "recovery.campMultipliers",
        ["none", "basic", "proper", "secure_indoor"]
      ),
      safetyMultipliers: requireRangeRecord<"unsafe" | "exposed" | "stable" | "secure">(
        recovery.safetyMultipliers,
        "recovery.safetyMultipliers",
        ["unsafe", "exposed", "stable", "secure"]
      )
    }
  };
}

function loadMetabolicProfile(lineageId?: string | null): PlayerLineageMetabolicProfileRecord {
  return getPlayerLineageProfile(lineageId ?? "")?.metabolicProfile ?? DEFAULT_LINEAGE_METABOLISM;
}

function normalizeTag(tag: string): PlayerFoodTagBiasId | null {
  const normalized = tag.trim().toLowerCase().replace(/-/g, "_");

  if (
    normalized === "protein" ||
    normalized === "carbs" ||
    normalized === "fat" ||
    normalized === "greens" ||
    normalized === "fruit" ||
    normalized === "grain" ||
    normalized === "meat" ||
    normalized === "fish" ||
    normalized === "fungus" ||
    normalized === "dairy" ||
    normalized === "alcohol" ||
    normalized === "water_rich"
  ) {
    return normalized;
  }

  return null;
}

function resolveFoodTagBias(itemTags: string[] | undefined, profile: PlayerLineageMetabolicProfileRecord): number {
  const matches = (itemTags ?? [])
    .map((tag) => normalizeTag(tag))
    .flatMap((tag) => (tag ? [profile.foodTagBiases[tag] ?? 1] : []))
    .sort((left, right) => right - left)
    .slice(0, 2);

  if (matches.length === 0) {
    return 1;
  }

  const average = matches.reduce((total, entry) => total + entry, 0) / matches.length;
  return clamp(round(average, 3), 0.9, 1.1);
}

function getGlobalRuleRecords(): GlobalRuleContentRecord<unknown>[] {
  return (globalRuleCatalog as ContentCatalog<GlobalRuleContentRecord<unknown>>).records;
}

export function loadBodyStateBalanceRule(): BodyStateBalanceRuleState {
  if (bodyStateBalanceRuleCache) {
    return bodyStateBalanceRuleCache;
  }

  const globalRule = getGlobalRuleRecords().find((record) => record.id === BODY_STATE_BALANCE_RULE_ID);
  if (!globalRule) {
    throw new Error(`Missing authored global rule '${BODY_STATE_BALANCE_RULE_ID}'`);
  }

  bodyStateBalanceRuleCache = validateBodyStateBalanceRule(globalRule.value);
  return bodyStateBalanceRuleCache;
}

function resolveEnergyBand(rule: BodyStateBalanceRuleState, effectiveEnergy: number): BodyEnergyBandId {
  if (effectiveEnergy >= rule.energy.energyBands.wellFed) {
    return "well_fed";
  }
  if (effectiveEnergy >= rule.energy.energyBands.stable) {
    return "stable";
  }
  if (effectiveEnergy >= rule.energy.energyBands.lowEnergy) {
    return "low_energy";
  }
  return "drained";
}

function resolveProteinBand(proteinSufficiency: number): BodyProteinBandId {
  if (proteinSufficiency >= 75) {
    return "protein_rich";
  }
  if (proteinSufficiency >= 50) {
    return "supported";
  }
  if (proteinSufficiency >= 25) {
    return "thin_diet";
  }
  return "deficient";
}

function resolveHydrationBand(rule: BodyStateBalanceRuleState, hydrationLevel: number): BodyHydrationBandId {
  if (hydrationLevel >= rule.hydration.bands.optimal) {
    return "optimal";
  }
  if (hydrationLevel >= rule.hydration.bands.slightlyDehydrated) {
    return "slightly_dehydrated";
  }
  if (hydrationLevel >= rule.hydration.bands.dehydrated) {
    return "dehydrated";
  }
  return "severely_dehydrated";
}

function resolveFatigueBand(fatigue: number): BodyFatigueBandId {
  if (fatigue >= 70) {
    return "exhausted";
  }
  if (fatigue >= 45) {
    return "fatigued";
  }
  if (fatigue >= 20) {
    return "strained";
  }
  return "fresh";
}

function resolveIntoxicationBand(rule: BodyStateBalanceRuleState, intoxicationLevel: number): BodyIntoxicationBandId {
  if (intoxicationLevel >= rule.intoxication.blackoutRiskThreshold) {
    return "blackout_risk";
  }
  if (intoxicationLevel >= rule.intoxication.heavilyIntoxicatedThreshold) {
    return "heavily_intoxicated";
  }
  if (intoxicationLevel >= rule.intoxication.drunkThreshold) {
    return "drunk";
  }
  if (intoxicationLevel >= rule.intoxication.buzzedThreshold) {
    return "buzzed";
  }
  return "clear";
}

function buildWarnings(
  energyBand: BodyEnergyBandId,
  proteinBand: BodyProteinBandId,
  hydrationBand: BodyHydrationBandId,
  fatigueBand: BodyFatigueBandId,
  intoxicationBand: BodyIntoxicationBandId,
  starvationLoad: number
): string[] {
  const warnings: string[] = [];

  if (energyBand === "low_energy" || energyBand === "drained") {
    warnings.push("Low energy is slowing stamina recovery.");
  }
  if (proteinBand === "thin_diet" || proteinBand === "deficient") {
    warnings.push("Low protein is reducing recovery quality.");
  }
  if (hydrationBand === "dehydrated" || hydrationBand === "severely_dehydrated") {
    warnings.push("Dehydration is accelerating fatigue.");
  }
  if (fatigueBand === "fatigued" || fatigueBand === "exhausted") {
    warnings.push("Fatigue is cutting stamina and action efficiency.");
  }
  if (intoxicationBand === "drunk" || intoxicationBand === "heavily_intoxicated" || intoxicationBand === "blackout_risk") {
    warnings.push("Intoxication is worsening hydration loss and control.");
  }
  if (starvationLoad >= 1) {
    warnings.push("Sustained underfeeding is building long-term starvation pressure.");
  }

  return warnings;
}

function scalePenaltyFromNeutral(value: number, severityScalar: number): number {
  if (value < 1) {
    return 1 - (1 - value) * severityScalar;
  }

  if (value > 1) {
    return 1 + (value - 1) * severityScalar;
  }

  return value;
}

export function resolveBodyState(
  bodyState: Pick<
    PlayerBodyState,
    | "energyReserve"
    | "proteinSufficiency"
    | "hydrationLevel"
    | "fatigue"
    | "fatigueDebt"
    | "intoxicationLevel"
    | "dailyHighIntensityLoad"
    | "starvationLoad"
    | "proteinDeficitLoad"
  >,
  lineageId?: string | null,
  runDifficulty?: Partial<RunDifficultyState> | null
): ResolvedBodyState {
  const rule = loadBodyStateBalanceRule();
  const difficulty = resolveRunDifficultyModifiers(runDifficulty);
  const lineage = loadMetabolicProfile(lineageId);
  const effectiveEnergy = round(
    bodyState.energyReserve.quick * rule.energy.quickWeight +
      bodyState.energyReserve.stored * rule.energy.storedWeight
  );
  const requiredProtein = round(
    rule.targets.proteinBaseline + bodyState.dailyHighIntensityLoad * rule.targets.proteinLoadScale
  );
  const proteinCoverage = round(clamp(0, 1.5, bodyState.proteinSufficiency / 100));
  const energyBand = resolveEnergyBand(rule, effectiveEnergy);
  const proteinBand = resolveProteinBand(bodyState.proteinSufficiency);
  const hydrationBand = resolveHydrationBand(rule, bodyState.hydrationLevel);
  const fatigueBand = resolveFatigueBand(bodyState.fatigue);
  const intoxicationBand = resolveIntoxicationBand(rule, bodyState.intoxicationLevel);

  let staminaMaxMultiplier = clamp(
    0.65,
    1,
    1 -
      bodyState.fatigue * rule.fatigue.staminaMaxPerPoint -
      bodyState.fatigueDebt * rule.fatigue.staminaDebtMaxPerPoint
  );
  let staminaRegenMultiplier =
    rule.energy.staminaRegenMultipliers[energyBand] *
    rule.hydration.staminaRegenMultipliers[hydrationBand] *
    clamp(
      0.4,
      1,
      1 -
        bodyState.fatigue * rule.fatigue.staminaRegenPerPoint -
        bodyState.fatigueDebt * rule.fatigue.staminaDebtRegenPerPoint
    );
  let actionEfficiencyMultiplier =
    rule.hydration.actionEfficiencyMultipliers[hydrationBand] *
    clamp(0.75, 1, 1 - bodyState.fatigue * rule.fatigue.actionEfficiencyPerPoint);
  let fatigueGainMultiplier =
    rule.energy.fatigueGainMultipliers[energyBand] *
    rule.hydration.fatigueGainMultipliers[hydrationBand];
  let recoveryEffectivenessMultiplier =
    rule.energy.recoveryMultipliers[energyBand] *
    rule.protein.recoveryMultipliers[proteinBand] *
    rule.hydration.staminaRegenMultipliers[hydrationBand] *
    difficulty.bodyState.recoveryEffectivenessScalar;

  let strengthEfficiencyMultiplier = 1;
  let hydrationLossMultiplier = clamp(
    0.75,
    1.3,
    (2 - lineage.hydrationRetention) * lineage.dehydrationSensitivity
  );

  if (intoxicationBand === "drunk") {
    actionEfficiencyMultiplier *= 1 - rule.intoxication.mediumActionPenalty;
    hydrationLossMultiplier *= rule.intoxication.mediumHydrationLossMultiplier;
    fatigueGainMultiplier *= 1.08;
  } else if (intoxicationBand === "heavily_intoxicated" || intoxicationBand === "blackout_risk") {
    actionEfficiencyMultiplier *= 1 - rule.intoxication.highActionPenalty;
    staminaRegenMultiplier *= 1 - rule.intoxication.highStaminaPenalty;
    hydrationLossMultiplier *= rule.intoxication.highHydrationLossMultiplier;
    fatigueGainMultiplier *= 1.14;
  }

  if (bodyState.starvationLoad >= 1) {
    staminaRegenMultiplier *= 0.94 * (2 - lineage.deficiencyPenaltyScale);
    fatigueGainMultiplier *= 1.06 * lineage.deficiencyPenaltyScale;
  }
  if (bodyState.starvationLoad >= rule.starvation.stageTwoThreshold) {
    staminaMaxMultiplier *= 0.92;
    recoveryEffectivenessMultiplier *= 0.92;
    actionEfficiencyMultiplier *= 0.96;
  }
  if (bodyState.starvationLoad >= rule.starvation.stageThreeThreshold) {
    staminaMaxMultiplier *= 0.88;
    actionEfficiencyMultiplier *= 0.9;
  }

  if (bodyState.proteinDeficitLoad >= 2) {
    strengthEfficiencyMultiplier *= 1 - rule.protein.strengthPenaltyByLoad.mild;
  }
  if (
    bodyState.starvationLoad >= rule.starvation.stageTwoThreshold &&
    bodyState.proteinDeficitLoad >= 2 &&
    bodyState.dailyHighIntensityLoad >= 2
  ) {
    strengthEfficiencyMultiplier *= 1 - rule.protein.strengthPenaltyByLoad.moderate * lineage.atrophySensitivity;
  }
  if (
    bodyState.starvationLoad >= rule.starvation.stageThreeThreshold &&
    bodyState.proteinDeficitLoad >= 4 &&
    bodyState.dailyHighIntensityLoad >= 4
  ) {
    strengthEfficiencyMultiplier *= 1 - rule.protein.strengthPenaltyByLoad.severe * lineage.atrophySensitivity;
  }

  const severityScalar = difficulty.bodyState.penaltySeverityScalar;
  const hasEnergyPenalty = energyBand === "low_energy" || energyBand === "drained";
  const hasProteinPenalty = proteinBand === "thin_diet" || proteinBand === "deficient";
  const hasHydrationPenalty = hydrationBand !== "optimal";
  const hasFatiguePenalty = fatigueBand !== "fresh";
  const hasIntoxicationPenalty =
    intoxicationBand === "drunk" || intoxicationBand === "heavily_intoxicated" || intoxicationBand === "blackout_risk";
  const hasStarvationPenalty = bodyState.starvationLoad >= 1;
  const hasStrengthPenalty = bodyState.proteinDeficitLoad >= 2;

  if (hasFatiguePenalty || hasStarvationPenalty) {
    staminaMaxMultiplier = scalePenaltyFromNeutral(staminaMaxMultiplier, severityScalar);
  }
  if (hasEnergyPenalty || hasHydrationPenalty || hasFatiguePenalty || hasIntoxicationPenalty || hasStarvationPenalty) {
    staminaRegenMultiplier = scalePenaltyFromNeutral(staminaRegenMultiplier, severityScalar);
  }
  if (hasHydrationPenalty || hasFatiguePenalty || hasIntoxicationPenalty || hasStarvationPenalty) {
    actionEfficiencyMultiplier = scalePenaltyFromNeutral(actionEfficiencyMultiplier, severityScalar);
  }
  if (hasEnergyPenalty || hasHydrationPenalty || hasIntoxicationPenalty || hasStarvationPenalty) {
    fatigueGainMultiplier = scalePenaltyFromNeutral(fatigueGainMultiplier, severityScalar);
  }
  if (hasEnergyPenalty || hasProteinPenalty || hasHydrationPenalty || hasStarvationPenalty) {
    recoveryEffectivenessMultiplier = scalePenaltyFromNeutral(recoveryEffectivenessMultiplier, severityScalar);
  }
  if (hasStrengthPenalty || hasStarvationPenalty) {
    strengthEfficiencyMultiplier = scalePenaltyFromNeutral(strengthEfficiencyMultiplier, severityScalar);
  }

  const clampFloor = difficulty.hardcore?.removeForgivenessCaps
    ? {
        staminaMax: 0.5,
        staminaRegen: 0.2,
        actionEfficiency: 0.6,
        fatigueGain: 1.9,
        recovery: 0.25,
        strength: 0.6,
        hydrationLoss: 1.65
      }
    : {
        staminaMax: 0.55,
        staminaRegen: 0.25,
        actionEfficiency: 0.65,
        fatigueGain: 1.75,
        recovery: 0.35,
        strength: 0.65,
        hydrationLoss: 1.5
      };

  return {
    energyBand,
    proteinBand,
    hydrationBand,
    fatigueBand,
    intoxicationBand,
    effectiveEnergy,
    requiredProtein,
    proteinCoverage,
    staminaMaxMultiplier: round(clamp(clampFloor.staminaMax, 1, staminaMaxMultiplier)),
    staminaRegenMultiplier: round(clamp(clampFloor.staminaRegen, 1.15, staminaRegenMultiplier)),
    actionEfficiencyMultiplier: round(clamp(clampFloor.actionEfficiency, 1, actionEfficiencyMultiplier)),
    fatigueGainMultiplier: round(clamp(0.8, clampFloor.fatigueGain, fatigueGainMultiplier)),
    recoveryEffectivenessMultiplier: round(clamp(clampFloor.recovery, 1.15, recoveryEffectivenessMultiplier)),
    strengthEfficiencyMultiplier: round(clamp(clampFloor.strength, 1, strengthEfficiencyMultiplier)),
    hydrationLossMultiplier: round(clamp(0.7, clampFloor.hydrationLoss, hydrationLossMultiplier)),
    warnings: buildWarnings(
      energyBand,
      proteinBand,
      hydrationBand,
      fatigueBand,
      intoxicationBand,
      bodyState.starvationLoad
    )
  };
}

export function createDefaultResolvedBodyState(
  lineageId?: string | null,
  runDifficulty?: Partial<RunDifficultyState> | null
): ResolvedBodyState {
  return resolveBodyState(
    {
      energyReserve: { quick: 70, stored: 70 },
      proteinSufficiency: 70,
      hydrationLevel: 80,
      fatigue: 15,
      fatigueDebt: 10,
      intoxicationLevel: 0,
      dailyHighIntensityLoad: 0,
      starvationLoad: 0,
      proteinDeficitLoad: 0
    },
    lineageId,
    runDifficulty
  );
}

export function createDefaultPlayerBodyState(params: {
  tick?: number | undefined;
  day?: number | undefined;
  lineageId?: string | null | undefined;
  runDifficulty?: Partial<RunDifficultyState> | null | undefined;
} = {}): PlayerBodyState {
  return {
    energyReserve: { quick: 70, stored: 70 },
    energyBalance: 0,
    proteinSufficiency: 70,
    hydrationLevel: 80,
    fatigue: 15,
    fatigueDebt: 10,
    intoxicationLevel: 0,
    dailyCaloriesConsumed: 0,
    dailyProteinConsumed: 0,
    dailyCarbsConsumed: 0,
    dailyFatConsumed: 0,
    dailyHydrationConsumed: 0,
    dailyEnergyDemand: 0,
    dailyHighIntensityLoad: 0,
    energyDeficitDays: 0,
    starvationLoad: 0,
    proteinDeficitLoad: 0,
    lastAdvancedTick: params.tick ?? 0,
    lastDailyRolloverDay: params.day ?? 1,
    resolved: createDefaultResolvedBodyState(params.lineageId, params.runDifficulty)
  };
}

export function normalizePlayerBodyState(
  bodyState: Partial<PlayerBodyState> | null | undefined,
  params: {
    tick?: number | undefined;
    day?: number | undefined;
    lineageId?: string | null | undefined;
    runDifficulty?: Partial<RunDifficultyState> | null | undefined;
  } = {}
): PlayerBodyState {
  const rule = loadBodyStateBalanceRule();
  const fallback = createDefaultPlayerBodyState(params);
  const normalized: PlayerBodyState = {
    energyReserve: {
      quick: clamp(normalizeFinite(bodyState?.energyReserve?.quick, fallback.energyReserve.quick), 0, 100),
      stored: clamp(normalizeFinite(bodyState?.energyReserve?.stored, fallback.energyReserve.stored), 0, 100)
    },
    energyBalance: normalizeFinite(bodyState?.energyBalance, fallback.energyBalance),
    proteinSufficiency: clamp(normalizeFinite(bodyState?.proteinSufficiency, fallback.proteinSufficiency), 0, 100),
    hydrationLevel: clamp(normalizeFinite(bodyState?.hydrationLevel, fallback.hydrationLevel), 0, 100),
    fatigue: clamp(normalizeFinite(bodyState?.fatigue, fallback.fatigue), 0, 100),
    fatigueDebt: clamp(normalizeFinite(bodyState?.fatigueDebt, fallback.fatigueDebt), 0, 100),
    intoxicationLevel: clamp(normalizeFinite(bodyState?.intoxicationLevel, fallback.intoxicationLevel), 0, 100),
    dailyCaloriesConsumed: Math.max(0, normalizeFinite(bodyState?.dailyCaloriesConsumed, 0)),
    dailyProteinConsumed: Math.max(0, normalizeFinite(bodyState?.dailyProteinConsumed, 0)),
    dailyCarbsConsumed: Math.max(0, normalizeFinite(bodyState?.dailyCarbsConsumed, 0)),
    dailyFatConsumed: Math.max(0, normalizeFinite(bodyState?.dailyFatConsumed, 0)),
    dailyHydrationConsumed: Math.max(0, normalizeFinite(bodyState?.dailyHydrationConsumed, 0)),
    dailyEnergyDemand: Math.max(0, normalizeFinite(bodyState?.dailyEnergyDemand, 0)),
    dailyHighIntensityLoad: Math.max(0, normalizeFinite(bodyState?.dailyHighIntensityLoad, 0)),
    energyDeficitDays: clamp(normalizeFinite(bodyState?.energyDeficitDays, 0), 0, rule.starvation.maxDeficitDays),
    starvationLoad: clamp(normalizeFinite(bodyState?.starvationLoad, 0), 0, rule.starvation.maxDeficitDays),
    proteinDeficitLoad: clamp(normalizeFinite(bodyState?.proteinDeficitLoad, 0), 0, 7),
    lastAdvancedTick: normalizeInteger(bodyState?.lastAdvancedTick, params.tick ?? fallback.lastAdvancedTick),
    lastDailyRolloverDay: Math.max(
      1,
      normalizeInteger(bodyState?.lastDailyRolloverDay, params.day ?? fallback.lastDailyRolloverDay)
    ),
    resolved: createDefaultResolvedBodyState(params.lineageId, params.runDifficulty)
  };

  normalized.resolved = resolveBodyState(normalized, params.lineageId, params.runDifficulty);
  return normalized;
}

export function rollBodyStateDay(
  bodyState: PlayerBodyState,
  params: {
    lineageId?: string | null | undefined;
    runDifficulty?: Partial<RunDifficultyState> | null | undefined;
  } = {}
): PlayerBodyState {
  const rule = loadBodyStateBalanceRule();
  const difficulty = resolveRunDifficultyModifiers(params.runDifficulty);
  const lineage = loadMetabolicProfile(params.lineageId);
  const requiredProtein =
    rule.targets.proteinBaseline + bodyState.dailyHighIntensityLoad * rule.targets.proteinLoadScale;
  const proteinCoverage = clamp(0, 1.25, bodyState.dailyProteinConsumed / Math.max(1, requiredProtein));
  const dailyRequiredEnergy = rule.targets.dailyCalories + bodyState.dailyEnergyDemand;
  const dailyEnergyCoverage = clamp(0, 1.25, bodyState.dailyCaloriesConsumed / Math.max(1, dailyRequiredEnergy));
  const effectiveEnergyCoverage = clamp(0, 1.25, dailyEnergyCoverage * difficulty.bodyState.deficitOnsetScalar);
  const effectiveProteinCoverage = clamp(0, 1.25, proteinCoverage * difficulty.bodyState.deficitOnsetScalar);
  const dailyEnergyDeficitRatio = clamp(0, 1, 1 - effectiveEnergyCoverage);
  const proteinDeficitRatio = clamp(0, 1, 1 - effectiveProteinCoverage);
  const recoveryPenalty =
    (bodyState.resolved.recoveryEffectivenessMultiplier < 0.9 ? 1.15 : 1) *
    (bodyState.hydrationLevel < rule.hydration.bands.slightlyDehydrated ? 1.1 : 1);
  const deficitRecovery =
    rule.starvation.dailyRecoveryWhenCovered *
    difficulty.bodyState.recoveryEffectivenessScalar *
    (difficulty.hardcoreEnabled ? (difficulty.hardcore?.deficitRecoveryScalar ?? 1) : 1);

  const nextEnergyDeficitDays =
    effectiveEnergyCoverage >= 1
      ? Math.max(0, bodyState.energyDeficitDays - deficitRecovery)
      : Math.min(
          rule.starvation.maxDeficitDays,
          bodyState.energyDeficitDays + dailyEnergyDeficitRatio * difficulty.bodyState.starvationEscalationScalar
        );

  const nextProteinDeficitLoad =
    effectiveProteinCoverage >= 1
      ? Math.max(0, bodyState.proteinDeficitLoad - deficitRecovery)
      : Math.min(7, bodyState.proteinDeficitLoad + proteinDeficitRatio * difficulty.bodyState.starvationEscalationScalar);

  const nextFatigueDebt = clamp(
    bodyState.intoxicationLevel >= rule.intoxication.heavilyIntoxicatedThreshold
      ? bodyState.fatigueDebt + rule.intoxication.nextDayFatigueDebt
      : bodyState.fatigueDebt +
          Math.max(0, bodyState.fatigue - rule.fatigue.carryoverThreshold) *
            rule.fatigue.carryoverScale *
            recoveryPenalty,
    0,
    100
  );

  const next: PlayerBodyState = {
    ...bodyState,
    energyBalance: round((dailyEnergyCoverage - 1) * 100),
    proteinSufficiency: clamp(
      round(
        bodyState.proteinSufficiency +
          (effectiveProteinCoverage * 100 * lineage.proteinRecoveryEfficiency - bodyState.proteinSufficiency) *
            rule.protein.smoothing
      ),
      0,
      100
    ),
    fatigueDebt: nextFatigueDebt,
    energyDeficitDays: round(nextEnergyDeficitDays),
    starvationLoad: round(nextEnergyDeficitDays),
    proteinDeficitLoad: round(nextProteinDeficitLoad),
    dailyCaloriesConsumed: 0,
    dailyProteinConsumed: 0,
    dailyCarbsConsumed: 0,
    dailyFatConsumed: 0,
    dailyHydrationConsumed: 0,
    dailyEnergyDemand: 0,
    dailyHighIntensityLoad: 0
  };

  next.resolved = resolveBodyState(next, params.lineageId, params.runDifficulty);
  return next;
}

function applyRecoveryContextPerTick(
  state: PlayerBodyState,
  context: RecoveryContextState,
  rule: BodyStateBalanceRuleState,
  lineage: PlayerLineageMetabolicProfileRecord,
  runDifficulty?: Partial<RunDifficultyState> | null,
  recoveryAssessment?: RecoveryAssessmentState | null
) {
  const difficulty = resolveRunDifficultyModifiers(runDifficulty);
  const recoveryGate = resolveRecoveryGate({
    runDifficulty,
    recoveryAssessment,
    statGrowthRule: loadStatGrowthBalanceRule()
  });
  const mealSupport = clamp(context.mealSupport ?? 0, 0, 1);
  const waterSupport = clamp(context.waterSupport ?? 0, 0, 1);
  const recoveryEffectiveness =
    rule.recovery.campMultipliers[context.campTier] *
    rule.recovery.safetyMultipliers[context.safetyTier] *
    state.resolved.recoveryEffectivenessMultiplier *
    recoveryGate.bodyStateRecoveryScalar;

  state.fatigue = clamp(
    state.fatigue -
      rule.fatigue.sleepRecoveryPerUnit * context.sleepUnits * recoveryEffectiveness,
    0,
    100
  );
  state.fatigueDebt = clamp(
    state.fatigueDebt -
      (0.35 * recoveryEffectiveness) / difficulty.bodyState.fatigueDebtPersistenceScalar,
    0,
    100
  );
  state.energyReserve.quick = clamp(
    state.energyReserve.quick +
      rule.targets.dailyCalories *
        0.05 *
        mealSupport *
        lineage.calorieEfficiency *
        recoveryGate.bodyStateRecoveryScalar,
    0,
    100
  );
  state.energyReserve.stored = clamp(
    state.energyReserve.stored +
      rule.targets.dailyCalories *
        0.025 *
        mealSupport *
        lineage.fatToReserveEfficiency *
        0.1 *
        recoveryGate.bodyStateRecoveryScalar,
    0,
    100
  );
  state.dailyCaloriesConsumed +=
    rule.targets.dailyCalories *
    0.12 *
    mealSupport *
    lineage.calorieEfficiency *
    recoveryGate.bodyStateRecoveryScalar;
  state.dailyProteinConsumed +=
    rule.targets.proteinBaseline *
    0.3 *
    mealSupport *
    lineage.proteinRecoveryEfficiency *
    recoveryGate.bodyStateRecoveryScalar;
  state.dailyHydrationConsumed +=
    rule.targets.dailyHydration *
    0.14 *
    waterSupport *
    lineage.hydrationRetention *
    recoveryGate.bodyStateRecoveryScalar;
  state.hydrationLevel = clamp(
    state.hydrationLevel +
      rule.hydration.recoveryGainPerTick *
        waterSupport *
        lineage.hydrationRetention *
        recoveryGate.bodyStateRecoveryScalar,
    0,
    100
  );
}

export function advancePlayerBodyState(
  bodyState: Partial<PlayerBodyState> | null | undefined,
  ticks: number,
  options: BodyStateAdvanceOptions
): PlayerBodyState {
  const rule = loadBodyStateBalanceRule();
  const difficulty = resolveRunDifficultyModifiers(options.runDifficulty);
  const lineage = loadMetabolicProfile(options.lineageId);
  let next = normalizePlayerBodyState(bodyState, {
    tick: options.tick,
    day: options.day,
    lineageId: options.lineageId,
    runDifficulty: options.runDifficulty
  });

  const stepCount = Math.max(1, Math.round(ticks));
  const perTickFatigueGain = (options.metabolicProfile?.fatigueGain ?? 0) / stepCount;
  const perTickEnergyDemand = (options.metabolicProfile?.energyDemand ?? 0) / stepCount;
  const perTickHydrationDemand = (options.metabolicProfile?.hydrationDemand ?? 0) / stepCount;
  const perTickHighIntensityLoad = (options.metabolicProfile?.highIntensityLoad ?? 0) / stepCount;
  const intensity = options.metabolicProfile?.intensity ?? "low";

  for (let index = 0; index < stepCount; index += 1) {
    if (options.day > next.lastDailyRolloverDay) {
      while (next.lastDailyRolloverDay < options.day) {
        next = rollBodyStateDay(next, {
          lineageId: options.lineageId,
          runDifficulty: options.runDifficulty
        });
        next.lastDailyRolloverDay += 1;
      }
    }

    next.resolved = resolveBodyState(next, options.lineageId, options.runDifficulty);

    const demandScalar = difficulty.bodyState.resourceDrainScalar / difficulty.bodyState.surplusPersistenceScalar;
    const dehydrationEscalation =
      next.hydrationLevel < rule.hydration.bands.slightlyDehydrated
        ? difficulty.bodyState.dehydrationEscalationScalar
        : 1;
    const quickLoss =
      (rule.energy.quickDecayByIntensity[intensity] * (options.recoveryContext ? 0.45 : 1) + perTickEnergyDemand * 0.35) *
      demandScalar;
    const storedLoss =
      (rule.energy.storedDecayByIntensity[intensity] * (options.recoveryContext ? 0.45 : 1) + perTickEnergyDemand * 0.16) *
      demandScalar;
    const hydrationLoss =
      ((rule.hydration.passiveLossPerTick + perTickHydrationDemand) * demandScalar * dehydrationEscalation) *
      next.resolved.hydrationLossMultiplier *
      lineage.dehydrationSensitivity;
    const fatigueGain =
      perTickFatigueGain *
      next.resolved.fatigueGainMultiplier *
      (1 + (next.starvationLoad >= 1 ? 0.04 * lineage.deficiencyPenaltyScale : 0));

    next.energyReserve.quick = clamp(next.energyReserve.quick - quickLoss, 0, 100);
    next.energyReserve.stored = clamp(next.energyReserve.stored - storedLoss, 0, 100);
    next.hydrationLevel = clamp(next.hydrationLevel - hydrationLoss, 0, 100);
    next.fatigue = clamp(
      next.fatigue + fatigueGain - (options.recoveryContext ? 0 : rule.fatigue.passiveRecoveryPerTick),
      0,
      100
    );
    next.intoxicationLevel = clamp(next.intoxicationLevel - rule.intoxication.decayPerTick, 0, 100);
    next.dailyEnergyDemand += perTickEnergyDemand * difficulty.bodyState.resourceDrainScalar;
    next.dailyHighIntensityLoad += perTickHighIntensityLoad;

    if (options.recoveryContext) {
      applyRecoveryContextPerTick(
        next,
        options.recoveryContext,
        rule,
        lineage,
        options.runDifficulty,
        options.recoveryAssessment
      );
    }

    next.lastAdvancedTick = options.tick;
    next.resolved = resolveBodyState(next, options.lineageId, options.runDifficulty);
  }

  return next;
}

export function applyConsumableToBodyState(
  bodyState: Partial<PlayerBodyState> | null | undefined,
  consumableProfile: ConsumableProfileState,
  options: ConsumableApplicationOptions = {}
): PlayerBodyState {
  const rule = loadBodyStateBalanceRule();
  const lineage = loadMetabolicProfile(options.lineageId);
  const itemTagBias = resolveFoodTagBias(options.itemTags, lineage);
  const next = normalizePlayerBodyState(bodyState, {
    tick: options.tick,
    day: options.day,
    lineageId: options.lineageId,
    runDifficulty: options.runDifficulty
  });
  const effectiveCalories = consumableProfile.calories * lineage.calorieEfficiency * itemTagBias;
  const effectiveProtein = consumableProfile.protein * lineage.proteinRecoveryEfficiency * itemTagBias;
  const effectiveCarbs = consumableProfile.carbs * lineage.carbToStaminaEfficiency * itemTagBias;
  const effectiveFat = consumableProfile.fat * lineage.fatToReserveEfficiency * itemTagBias;
  const effectiveHydration = (consumableProfile.hydration ?? 0) * lineage.hydrationRetention * itemTagBias;

  next.dailyCaloriesConsumed += effectiveCalories;
  next.dailyProteinConsumed += effectiveProtein;
  next.dailyCarbsConsumed += effectiveCarbs;
  next.dailyFatConsumed += effectiveFat;
  next.dailyHydrationConsumed += effectiveHydration;
  next.energyReserve.quick = clamp(
    next.energyReserve.quick +
      effectiveCarbs +
      effectiveCalories * rule.energy.quickGainPerCalorie,
    0,
    100
  );
  next.energyReserve.stored = clamp(
    next.energyReserve.stored +
      effectiveFat +
      effectiveCalories * rule.energy.storedGainPerCalorie,
    0,
    100
  );
  next.hydrationLevel = clamp(next.hydrationLevel + effectiveHydration, 0, 100);
  next.intoxicationLevel = clamp(
    next.intoxicationLevel + (consumableProfile.intoxication ?? 0) * lineage.intoxicationSensitivity,
    0,
    100
  );
  next.resolved = resolveBodyState(next, options.lineageId, options.runDifficulty);
  next.lastAdvancedTick = options.tick ?? next.lastAdvancedTick;
  next.lastDailyRolloverDay = options.day ?? next.lastDailyRolloverDay;
  return next;
}

export function syncPlayerBodyState(
  playerState: PlayerState,
  tick: number,
  day: number,
  runDifficulty?: Partial<RunDifficultyState> | null
): PlayerBodyState {
  const normalized = normalizePlayerBodyState(playerState.bodyState, {
    tick,
    day,
    lineageId: playerState.coreData.lineageId,
    runDifficulty
  });
  playerState.bodyState = normalized;
  return normalized;
}
