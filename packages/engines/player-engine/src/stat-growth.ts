import globalRuleCatalog from "../../../content/base/game/global_rules.json" with { type: "json" };
import { getPlayerLineageProfile } from "../../../shared/types/src/player-origins.js";
import { resolveRecoveryGate, resolveRunDifficultyModifiers } from "./difficulty.js";
import type { GlobalRuleContentRecord } from "../../civilization-engine/src/content.js";
import type {
  ActionAttributeLoadProfileState,
  ActionIntensityTier,
  PlayerAttributeKey,
  PlayerState,
  PlayerStatGrowthState,
  RecoveryAssessmentState,
  ResolvedAttributeTensionState,
  RunDifficultyState,
  StatGrowthBalanceRuleState,
  StatGrowthThresholdState
} from "../../../shared/types/src/index.js";

const STAT_GROWTH_BALANCE_RULE_ID = "rule.stat_growth_balance";
const ATTRIBUTE_KEYS: PlayerAttributeKey[] = ["STR", "DEX", "AGI", "CON", "VIT", "WIS", "INT", "SPT", "CHA"];
const PHYSICAL_ATTRIBUTES = new Set<PlayerAttributeKey>(["STR", "DEX", "AGI", "CON", "VIT"]);
const PRECISION_SOURCE_TAGS = new Set(["precision_crafting"]);
const MOBILITY_SOURCE_TAGS = new Set(["travel", "survey", "mobility", "procurement_field"]);
const STABILITY_SOURCE_TAGS = new Set(["magic_control", "ritual"]);

type ContentCatalog<TRecord> = {
  records: TRecord[];
};

type StatGrowthConversionResult = {
  gainedAttributes: PlayerAttributeKey[];
  changedAttributes: PlayerAttributeKey[];
};

let statGrowthBalanceRuleCache: StatGrowthBalanceRuleState | null = null;

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

function normalizeInteger(value: unknown, fallback: number, minimum = 0): number {
  return Math.max(minimum, Math.round(normalizeFinite(value, fallback)));
}

function createZeroAttributeRecord(): Record<PlayerAttributeKey, number> {
  return ATTRIBUTE_KEYS.reduce<Record<PlayerAttributeKey, number>>((result, key) => {
    result[key] = 0;
    return result;
  }, {} as Record<PlayerAttributeKey, number>);
}

function createEmptyVarietySources(): Record<PlayerAttributeKey, string[]> {
  return ATTRIBUTE_KEYS.reduce<Record<PlayerAttributeKey, string[]>>((result, key) => {
    result[key] = [];
    return result;
  }, {} as Record<PlayerAttributeKey, string[]>);
}

function requirePositiveNumber(value: unknown, fieldPath: string): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`${STAT_GROWTH_BALANCE_RULE_ID} ${fieldPath} must be a positive number`);
  }
  return value;
}

function validateThreshold(value: unknown, attributeKey: PlayerAttributeKey): StatGrowthThresholdState {
  if (!isObject(value)) {
    throw new Error(`${STAT_GROWTH_BALANCE_RULE_ID} thresholds.${attributeKey} must be an object`);
  }

  return {
    loadThreshold: requirePositiveNumber(value.loadThreshold, `thresholds.${attributeKey}.loadThreshold`),
    progressPerPoint: requirePositiveNumber(value.progressPerPoint, `thresholds.${attributeKey}.progressPerPoint`),
    dailySoftCap: requirePositiveNumber(value.dailySoftCap, `thresholds.${attributeKey}.dailySoftCap`),
    growthScale: requirePositiveNumber(value.growthScale, `thresholds.${attributeKey}.growthScale`),
    growthExponent: requirePositiveNumber(value.growthExponent, `thresholds.${attributeKey}.growthExponent`)
  };
}

function validateStatGrowthBalanceRule(value: unknown): StatGrowthBalanceRuleState {
  if (!isObject(value)) {
    throw new Error(`${STAT_GROWTH_BALANCE_RULE_ID} must define an object value`);
  }

  if (
    !isObject(value.intensityMultipliers) ||
    !isObject(value.thresholds) ||
    !isObject(value.saturation) ||
    !isObject(value.recoveryCapacity) ||
    !isObject(value.recoveryGate) ||
    !isObject(value.diminishing) ||
    !isObject(value.rng) ||
    !isObject(value.tension)
  ) {
    throw new Error(`${STAT_GROWTH_BALANCE_RULE_ID} is missing one or more required configuration blocks`);
  }

  const thresholdsBlock = value.thresholds as Record<string, unknown>;
  const thresholds = ATTRIBUTE_KEYS.reduce<Record<PlayerAttributeKey, StatGrowthThresholdState>>((result, key) => {
    result[key] = validateThreshold(thresholdsBlock[key], key);
    return result;
  }, {} as Record<PlayerAttributeKey, StatGrowthThresholdState>);

  const rngMinimum = requirePositiveNumber(value.rng.minimum, "rng.minimum");
  const rngMaximum = requirePositiveNumber(value.rng.maximum, "rng.maximum");

  if (rngMinimum > rngMaximum) {
    throw new Error(`${STAT_GROWTH_BALANCE_RULE_ID} rng.minimum must not exceed rng.maximum`);
  }

  const saturationStartMultiplier = requirePositiveNumber(value.saturation.startMultiplier, "saturation.startMultiplier");
  const saturationHardCapMultiplier = requirePositiveNumber(
    value.saturation.hardCapMultiplier,
    "saturation.hardCapMultiplier"
  );
  if (saturationStartMultiplier >= saturationHardCapMultiplier) {
    throw new Error(
      `${STAT_GROWTH_BALANCE_RULE_ID} saturation.startMultiplier must remain below saturation.hardCapMultiplier`
    );
  }

  return {
    version: normalizeInteger(value.version, 1, 1),
    intensityMultipliers: {
      low: requirePositiveNumber(value.intensityMultipliers.low, "intensityMultipliers.low"),
      moderate: requirePositiveNumber(value.intensityMultipliers.moderate, "intensityMultipliers.moderate"),
      high: requirePositiveNumber(value.intensityMultipliers.high, "intensityMultipliers.high"),
      extreme: requirePositiveNumber(value.intensityMultipliers.extreme, "intensityMultipliers.extreme")
    },
    thresholds,
    saturation: {
      startMultiplier: saturationStartMultiplier,
      hardCapMultiplier: saturationHardCapMultiplier,
      exponent: requirePositiveNumber(value.saturation.exponent, "saturation.exponent")
    },
    recoveryCapacity: {
      base: requirePositiveNumber(value.recoveryCapacity.base, "recoveryCapacity.base"),
      constitutionWeight: requirePositiveNumber(value.recoveryCapacity.constitutionWeight, "recoveryCapacity.constitutionWeight"),
      vitalityWeight: requirePositiveNumber(value.recoveryCapacity.vitalityWeight, "recoveryCapacity.vitalityWeight"),
      wisdomWeight: requirePositiveNumber(value.recoveryCapacity.wisdomWeight, "recoveryCapacity.wisdomWeight"),
      spiritWeight: requirePositiveNumber(value.recoveryCapacity.spiritWeight, "recoveryCapacity.spiritWeight")
    },
    recoveryGate: {
      minimumQuality: requirePositiveNumber(value.recoveryGate.minimumQuality, "recoveryGate.minimumQuality"),
      minimumDurationHours: requirePositiveNumber(
        value.recoveryGate.minimumDurationHours,
        "recoveryGate.minimumDurationHours"
      )
    },
    diminishing: {
      trivialCutoff: requirePositiveNumber(value.diminishing.trivialCutoff, "diminishing.trivialCutoff"),
      dailyExponent: requirePositiveNumber(value.diminishing.dailyExponent, "diminishing.dailyExponent"),
      varietyBonusPerSource: normalizeFinite(value.diminishing.varietyBonusPerSource, 0),
      maxVarietyBonus: normalizeFinite(value.diminishing.maxVarietyBonus, 0),
      loadDecayWithoutRecovery: normalizeFinite(value.diminishing.loadDecayWithoutRecovery, 0.8),
      postRecoveryRetention: normalizeFinite(value.diminishing.postRecoveryRetention, 0.9)
    },
    rng: {
      minimum: rngMinimum,
      maximum: rngMaximum
    },
    tension: {
      threshold: requirePositiveNumber(value.tension.threshold, "tension.threshold"),
      gapStart: requirePositiveNumber(value.tension.gapStart, "tension.gapStart"),
      precisionCap: requirePositiveNumber(value.tension.precisionCap, "tension.precisionCap"),
      precisionPerGap: requirePositiveNumber(value.tension.precisionPerGap, "tension.precisionPerGap"),
      mobilityCap: requirePositiveNumber(value.tension.mobilityCap, "tension.mobilityCap"),
      mobilityPerGap: requirePositiveNumber(value.tension.mobilityPerGap, "tension.mobilityPerGap"),
      stabilityCap: requirePositiveNumber(value.tension.stabilityCap, "tension.stabilityCap"),
      stabilityPerGap: requirePositiveNumber(value.tension.stabilityPerGap, "tension.stabilityPerGap")
    }
  };
}

function loadStatGrowthBalanceRuleFromCatalog(): StatGrowthBalanceRuleState {
  const catalog = globalRuleCatalog as ContentCatalog<GlobalRuleContentRecord>;
  const record = catalog.records.find((entry) => entry.id === STAT_GROWTH_BALANCE_RULE_ID);
  if (!record) {
    throw new Error(`Missing required global rule ${STAT_GROWTH_BALANCE_RULE_ID}`);
  }
  return validateStatGrowthBalanceRule(record.value);
}

function getIntensityMultiplier(
  rule: StatGrowthBalanceRuleState,
  intensity: ActionIntensityTier
): number {
  return rule.intensityMultipliers[intensity];
}

function createStableSeed(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function deterministicVariance(
  playerId: string,
  tick: number,
  attributeKey: PlayerAttributeKey,
  rule: StatGrowthBalanceRuleState
): number {
  const seed = createStableSeed(`${playerId}:${tick}:${attributeKey}`);
  const normalized = (seed % 10_000) / 10_000;
  return round(rule.rng.minimum + normalized * (rule.rng.maximum - rule.rng.minimum));
}

function getLineageGrowthBias(playerState: Pick<PlayerState, "coreData">, attributeKey: PlayerAttributeKey): number {
  return getPlayerLineageProfile(playerState.coreData.lineageId)?.attributeGrowthBiases?.[attributeKey] ?? 1;
}

function getPhysicalFamilyModifier(playerState: Pick<PlayerState, "bodyState">): number {
  switch (playerState.bodyState.resolved.proteinBand) {
    case "protein_rich":
      return 1.05;
    case "supported":
      return 1;
    case "thin_diet":
      return 0.8;
    case "deficient":
    default:
      return 0.55;
  }
}

function getFocusFamilyModifier(playerState: Pick<PlayerState, "bodyState">): number {
  return clamp(
    playerState.bodyState.resolved.actionEfficiencyMultiplier /
      Math.max(1, playerState.bodyState.resolved.fatigueGainMultiplier),
    0.4,
    1
  );
}

function markVarietySource(state: PlayerStatGrowthState, attributeKey: PlayerAttributeKey, sourceTag: string) {
  if (state.dailyVarietySources[attributeKey].includes(sourceTag)) {
    return;
  }
  state.dailyVarietySources[attributeKey] = [...state.dailyVarietySources[attributeKey], sourceTag];
  state.dailyVarietyCount[attributeKey] += 1;
}

function getActionPerformanceMultiplier(sourceTag: string, tension: ResolvedAttributeTensionState): number {
  if (PRECISION_SOURCE_TAGS.has(sourceTag)) {
    return tension.precisionPenalty;
  }
  if (MOBILITY_SOURCE_TAGS.has(sourceTag)) {
    return tension.mobilityPenalty;
  }
  if (STABILITY_SOURCE_TAGS.has(sourceTag)) {
    return tension.stabilityPenalty;
  }
  return 1;
}

function resolveEffectiveThreshold(
  threshold: StatGrowthThresholdState,
  loadThresholdScalar: number
): StatGrowthThresholdState {
  return {
    ...threshold,
    loadThreshold: round(threshold.loadThreshold * loadThresholdScalar)
  };
}

function applyDayRollover(state: PlayerStatGrowthState, day: number, rule: StatGrowthBalanceRuleState): PlayerStatGrowthState {
  if (!Number.isFinite(day) || day <= state.lastDailyResetDay) {
    return state;
  }

  const daysPassed = Math.max(1, day - state.lastDailyResetDay);
  const decayFactor = Math.pow(rule.diminishing.loadDecayWithoutRecovery, daysPassed);

  for (const attributeKey of ATTRIBUTE_KEYS) {
    state.load[attributeKey] = round(state.load[attributeKey] * decayFactor);
    state.dailyConvertedLoad[attributeKey] = 0;
    state.dailyVarietyCount[attributeKey] = 0;
    state.dailyVarietySources[attributeKey] = [];
  }

  state.lastDailyResetDay = day;
  return state;
}

export function loadStatGrowthBalanceRule(): StatGrowthBalanceRuleState {
  if (!statGrowthBalanceRuleCache) {
    statGrowthBalanceRuleCache = loadStatGrowthBalanceRuleFromCatalog();
  }
  return statGrowthBalanceRuleCache;
}

export function createDefaultResolvedAttributeTensionState(): ResolvedAttributeTensionState {
  return {
    precisionPenalty: 1,
    mobilityPenalty: 1,
    stabilityPenalty: 1,
    loadGenerationModifiers: ATTRIBUTE_KEYS.reduce<Record<PlayerAttributeKey, number>>((result, key) => {
      result[key] = 1;
      return result;
    }, {} as Record<PlayerAttributeKey, number>),
    warnings: []
  };
}

export function createDefaultPlayerStatGrowthState(day = 0): PlayerStatGrowthState {
  return {
    load: createZeroAttributeRecord(),
    progress: createZeroAttributeRecord(),
    dailyConvertedLoad: createZeroAttributeRecord(),
    dailyVarietyCount: createZeroAttributeRecord(),
    dailyVarietySources: createEmptyVarietySources(),
    lastRecoveryTick: null,
    lastDailyResetDay: normalizeInteger(day, 0, 0)
  };
}

export function normalizePlayerStatGrowth(
  statGrowth?: Partial<PlayerStatGrowthState> | null,
  day = 0
): PlayerStatGrowthState {
  const normalized = createDefaultPlayerStatGrowthState(day);

  for (const attributeKey of ATTRIBUTE_KEYS) {
    normalized.load[attributeKey] = round(Math.max(0, normalizeFinite(statGrowth?.load?.[attributeKey], 0)));
    normalized.progress[attributeKey] = round(Math.max(0, normalizeFinite(statGrowth?.progress?.[attributeKey], 0)));
    normalized.dailyConvertedLoad[attributeKey] = round(
      Math.max(0, normalizeFinite(statGrowth?.dailyConvertedLoad?.[attributeKey], 0))
    );
    normalized.dailyVarietyCount[attributeKey] = normalizeInteger(
      statGrowth?.dailyVarietyCount?.[attributeKey],
      0,
      0
    );
    normalized.dailyVarietySources[attributeKey] = Array.isArray(statGrowth?.dailyVarietySources?.[attributeKey])
      ? [...new Set(statGrowth?.dailyVarietySources?.[attributeKey].filter((entry) => typeof entry === "string"))]
      : [];
  }

  normalized.lastRecoveryTick =
    typeof statGrowth?.lastRecoveryTick === "number" && Number.isFinite(statGrowth.lastRecoveryTick)
      ? Math.round(statGrowth.lastRecoveryTick)
      : null;
  normalized.lastDailyResetDay = normalizeInteger(statGrowth?.lastDailyResetDay, day, 0);

  return applyDayRollover(normalized, day, loadStatGrowthBalanceRule());
}

export function syncPlayerStatGrowth(playerState: Pick<PlayerState, "statGrowth">, day: number): PlayerStatGrowthState {
  const normalized = normalizePlayerStatGrowth(playerState.statGrowth, day);
  playerState.statGrowth = normalized;
  return normalized;
}

export function resolveAttributeTension(
  attributes: Pick<PlayerState, "attributes">["attributes"]
): ResolvedAttributeTensionState {
  const rule = loadStatGrowthBalanceRule();
  const resolved = createDefaultResolvedAttributeTensionState();
  const gapThreshold = rule.tension.gapStart;
  const highThreshold = rule.tension.threshold;

  if (attributes.STR >= highThreshold && attributes.STR - attributes.DEX > gapThreshold) {
    const gap = attributes.STR - attributes.DEX - gapThreshold;
    resolved.precisionPenalty = round(1 - Math.min(rule.tension.precisionCap, gap * rule.tension.precisionPerGap));
    resolved.loadGenerationModifiers.DEX = resolved.precisionPenalty;
    resolved.loadGenerationModifiers.INT = round(1 - (1 - resolved.precisionPenalty) * 0.5);
    resolved.loadGenerationModifiers.WIS = round(1 - (1 - resolved.precisionPenalty) * 0.5);
    resolved.warnings.push("Raw power is straining precise control.");
  }

  const bulk = Math.round((attributes.CON + attributes.VIT) / 2);
  if (bulk >= highThreshold && bulk - attributes.AGI > gapThreshold) {
    const gap = bulk - attributes.AGI - gapThreshold;
    resolved.mobilityPenalty = round(1 - Math.min(rule.tension.mobilityCap, gap * rule.tension.mobilityPerGap));
    resolved.loadGenerationModifiers.AGI = resolved.mobilityPenalty;
    resolved.loadGenerationModifiers.WIS = Math.min(
      resolved.loadGenerationModifiers.WIS,
      round(1 - (1 - resolved.mobilityPenalty) * 0.35)
    );
    resolved.warnings.push("Bulk is straining peak mobility.");
  }

  if (attributes.SPT >= highThreshold && attributes.SPT - attributes.WIS > gapThreshold) {
    const gap = attributes.SPT - attributes.WIS - gapThreshold;
    resolved.stabilityPenalty = round(1 - Math.min(rule.tension.stabilityCap, gap * rule.tension.stabilityPerGap));
    resolved.loadGenerationModifiers.SPT = resolved.stabilityPenalty;
    resolved.loadGenerationModifiers.WIS = Math.min(
      resolved.loadGenerationModifiers.WIS,
      round(1 - (1 - resolved.stabilityPenalty) * 0.5)
    );
    resolved.warnings.push("Spirit is outrunning judgment and stability.");
  }

  return resolved;
}

export function applyAttributeTensionToActionProfile<
  TProfile extends Pick<ActionAttributeLoadProfileState, "sourceTag">
>(
  attributes: Pick<PlayerState, "attributes">["attributes"],
  profile: TProfile
): number {
  return getActionPerformanceMultiplier(profile.sourceTag, resolveAttributeTension(attributes));
}

export function applyActionAttributeLoad(
  playerState: Pick<PlayerState, "attributes" | "bodyState" | "coreData" | "statGrowth">,
  profile: ActionAttributeLoadProfileState,
  durationHours = 1,
  day = 0,
  runDifficulty?: Partial<RunDifficultyState> | null
): PlayerStatGrowthState {
  const rule = loadStatGrowthBalanceRule();
  const difficulty = resolveRunDifficultyModifiers(runDifficulty);
  const statGrowth = normalizePlayerStatGrowth(playerState.statGrowth, day);
  const intensityMultiplier = getIntensityMultiplier(rule, profile.intensity);

  if (profile.meaningfulInteraction === false || durationHours <= 0) {
    playerState.statGrowth = statGrowth;
    return statGrowth;
  }

  const tension = resolveAttributeTension(playerState.attributes);
  const conditionModifier = clamp(
    playerState.bodyState.resolved.actionEfficiencyMultiplier *
      Math.sqrt(playerState.bodyState.resolved.staminaRegenMultiplier),
    0.25,
    1.05
  );

  for (const attributeKey of ATTRIBUTE_KEYS) {
    const relevanceWeight = profile.weights[attributeKey] ?? 0;
    if (intensityMultiplier * relevanceWeight < rule.diminishing.trivialCutoff) {
      continue;
    }

    const threshold = rule.thresholds[attributeKey];
    const currentLoad = statGrowth.load[attributeKey];
    const rawLoad =
      durationHours *
      intensityMultiplier *
      relevanceWeight *
      conditionModifier *
      getLineageGrowthBias(playerState, attributeKey) *
      tension.loadGenerationModifiers[attributeKey];
    const saturationStart = threshold.loadThreshold * rule.saturation.startMultiplier * difficulty.statGrowth.saturationScalar;
    const hardLoadCap = Math.max(
      saturationStart + 0.01,
      threshold.loadThreshold * rule.saturation.hardCapMultiplier * difficulty.statGrowth.saturationScalar
    );
    const storedGain =
      rawLoad /
      (1 + Math.pow(currentLoad / Math.max(saturationStart, Number.EPSILON), rule.saturation.exponent));

    if (storedGain <= 0.0001) {
      continue;
    }

    statGrowth.load[attributeKey] = round(Math.min(hardLoadCap, currentLoad + storedGain));
    markVarietySource(statGrowth, attributeKey, profile.sourceTag);
  }

  playerState.statGrowth = statGrowth;
  return statGrowth;
}

export function convertPlayerStatGrowthOnRecovery(
  playerState: Pick<PlayerState, "playerId" | "attributes" | "bodyState" | "statGrowth">,
  tick: number,
  day: number,
  recoveryAssessment?: RecoveryAssessmentState | null,
  runDifficulty?: Partial<RunDifficultyState> | null
): StatGrowthConversionResult {
  const rule = loadStatGrowthBalanceRule();
  const difficulty = resolveRunDifficultyModifiers(runDifficulty);
  const statGrowth = normalizePlayerStatGrowth(playerState.statGrowth, day);
  const recoveryGate = resolveRecoveryGate({
    runDifficulty,
    recoveryAssessment,
    statGrowthRule: rule
  });
  if (!recoveryGate.passesGate) {
    statGrowth.lastRecoveryTick = Math.round(tick);
    playerState.statGrowth = statGrowth;
    return {
      gainedAttributes: [],
      changedAttributes: []
    };
  }

  const recoveryQuality = clamp(playerState.bodyState.resolved.recoveryEffectivenessMultiplier, 0, 1.15);
  const tension = resolveAttributeTension(playerState.attributes);
  const recoveryCapacity =
    (
      rule.recoveryCapacity.base +
      playerState.attributes.CON * rule.recoveryCapacity.constitutionWeight +
      playerState.attributes.VIT * rule.recoveryCapacity.vitalityWeight +
      playerState.attributes.WIS * rule.recoveryCapacity.wisdomWeight +
      playerState.attributes.SPT * rule.recoveryCapacity.spiritWeight
    ) *
    recoveryQuality *
    difficulty.statGrowth.recoveryCapacityScalar;
  const convertibleLoads = ATTRIBUTE_KEYS.reduce<Record<PlayerAttributeKey, number>>((result, key) => {
    const effectiveThreshold = resolveEffectiveThreshold(
      rule.thresholds[key],
      difficulty.statGrowth.loadThresholdScalar
    );
    result[key] = Math.max(0, statGrowth.load[key] - effectiveThreshold.loadThreshold);
    return result;
  }, {} as Record<PlayerAttributeKey, number>);
  const totalConvertibleLoad = ATTRIBUTE_KEYS.reduce((total, key) => total + convertibleLoads[key], 0);
  const capacityScalar = Math.min(1, recoveryCapacity / Math.max(1, totalConvertibleLoad));
  const gainedAttributes: PlayerAttributeKey[] = [];
  const changedAttributes: PlayerAttributeKey[] = [];
  const physicalModifier = getPhysicalFamilyModifier(playerState);
  const focusModifier = getFocusFamilyModifier(playerState);

  for (const attributeKey of ATTRIBUTE_KEYS) {
    const convertibleLoad = convertibleLoads[attributeKey];
    if (convertibleLoad <= 0) {
      continue;
    }

    const threshold = rule.thresholds[attributeKey];
    const dailyScalar =
      1 /
      (1 +
        Math.pow(
          statGrowth.dailyConvertedLoad[attributeKey] / Math.max(threshold.dailySoftCap, Number.EPSILON),
          rule.diminishing.dailyExponent
        ));
    const varietyScalar =
      1 +
      Math.min(
        rule.diminishing.maxVarietyBonus,
        rule.diminishing.varietyBonusPerSource * Math.max(0, statGrowth.dailyVarietyCount[attributeKey] - 1)
      );
    const statScalar =
      1 /
      (1 +
        Math.pow(
          Math.max(0, playerState.attributes[attributeKey] - 10) / Math.max(threshold.growthScale, Number.EPSILON),
          threshold.growthExponent
        ));
    const familyModifier = PHYSICAL_ATTRIBUTES.has(attributeKey) ? physicalModifier : focusModifier;
    const tensionLoadModifier = tension.loadGenerationModifiers[attributeKey];
    const rngVariance = deterministicVariance(playerState.playerId, tick, attributeKey, rule);
    const gain =
      convertibleLoad *
      recoveryQuality *
      capacityScalar *
      dailyScalar *
      varietyScalar *
      statScalar *
      familyModifier *
      tensionLoadModifier *
      rngVariance *
      recoveryGate.statConversionScalar;

    if (gain <= 0.0001) {
      continue;
    }

    statGrowth.progress[attributeKey] = round(statGrowth.progress[attributeKey] + gain / threshold.progressPerPoint);
    statGrowth.dailyConvertedLoad[attributeKey] = round(statGrowth.dailyConvertedLoad[attributeKey] + convertibleLoad);
    statGrowth.load[attributeKey] = round(statGrowth.load[attributeKey] * rule.diminishing.postRecoveryRetention);
    changedAttributes.push(attributeKey);

    while (statGrowth.progress[attributeKey] >= 1) {
      statGrowth.progress[attributeKey] = round(statGrowth.progress[attributeKey] - 1);
      playerState.attributes[attributeKey] += 1;
      if (!gainedAttributes.includes(attributeKey)) {
        gainedAttributes.push(attributeKey);
      }
    }
  }

  statGrowth.lastRecoveryTick = Math.round(tick);
  playerState.statGrowth = statGrowth;

  return {
    gainedAttributes,
    changedAttributes
  };
}
