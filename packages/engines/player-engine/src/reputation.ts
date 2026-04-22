import globalRuleCatalog from "../../../content/base/game/global_rules.json" with { type: "json" };
import regionCatalog from "../../../content/base/world/regions.json" with { type: "json" };
import settlementCatalog from "../../../content/base/world/settlements.json" with { type: "json" };
import type {
  FameBranchId,
  FameRecognitionBandId,
  FameReputationAwardDefinitionState,
  FameRecognitionBandThresholdState,
  GeographicKnowledgeScope,
  NotorietyAttributionState,
  NotorietyCategoryId,
  NotorietyExposureState,
  NotorietyModifierId,
  NotorietyReputationAwardDefinitionState,
  NotorietySeriousnessClassId,
  NotorietySeriousnessThresholdState,
  NotorietySeverityId,
  PlayerFameBranchState,
  PlayerGeographicKnowledgeState,
  PlayerNotorietyCategoryState,
  PlayerNotorietyEventState,
  PlayerReputationState,
  PlayerSaveMetadata,
  PlayerState,
  ReputationAwardDefinitionState,
  ReputationBalanceRuleState,
  ReputationHistoricalTierId,
  ReputationScope,
  ReputationVectorWeightState,
  ResolvedFameScopeState,
  ResolvedNotorietyScopeState,
} from "../../../shared/types/src/index.js";

const REPUTATION_BALANCE_RULE_ID = "rule.reputation_balance";
const FLOAT_TOLERANCE = 0.000001;
const SCOPE_ORDER: ReputationScope[] = ["local", "regional", "continental", "world"];
const SEVERITY_ORDER: NotorietySeverityId[] = ["minor", "standard", "major"];
const FAME_BAND_ORDER: FameRecognitionBandId[] = ["known", "admired", "renowned", "legendary", "mythic"];
const SERIOUSNESS_ORDER: NotorietySeriousnessClassId[] = [
  "nuisance",
  "offender",
  "outlaw",
  "menace",
  "infamous",
  "atrocity_marked"
];
const MODIFIER_CANONICAL_ORDER: NotorietyModifierId[] = [
  "mass",
  "organized",
  "repeat",
  "public",
  "against_nobility",
  "against_temple",
  "wartime",
  "ritual"
];
const ACTIVE_FAME_BRANCHES_BY_SCOPE: Record<ReputationScope, FameBranchId[]> = {
  local: ["civic", "folk", "trade", "martial"],
  regional: ["heroic", "martial", "political", "commercial"],
  continental: ["historical", "legendary", "political"],
  world: ["legendary", "mythic"]
};
const ACTIVE_NOTORIETY_CATEGORIES: NotorietyCategoryId[] = [
  "theft",
  "fraud",
  "violent",
  "murder",
  "arson",
  "banditry",
  "treason"
];
const VIOLENT_NOTORIETY_CATEGORIES = new Set<NotorietyCategoryId>([
  "violent",
  "murder",
  "arson",
  "banditry"
]);
const ACTIVE_NOTORIETY_MODIFIERS: NotorietyModifierId[] = ["mass", "organized", "repeat", "public"];

type RegionLookupCatalog = {
  regionsById: Map<string, RegionRecord>;
  settlementsById: Map<string, SettlementRecord>;
  settlementsByRegionId: Map<string, SettlementRecord[]>;
};

type GlobalRuleRecord = {
  id: string;
  value: unknown;
};

type RegionRecord = {
  id: string;
  parentRegionId?: string | null;
  regionType: string;
};

type SettlementRecord = {
  id: string;
  regionId: string;
  administrativeRole?: string;
};

type ReputationAwardEvaluationState = {
  meaningful: boolean;
  exposureSatisfied: boolean;
  attributionSatisfied: boolean;
  sociallyValued?: boolean;
  condemnedAct?: boolean;
  credibleLinkSatisfied?: boolean;
  tick?: number | null;
  occurredAtTick?: number | null;
  unresolved?: boolean;
  exposureState?: NotorietyExposureState;
  attributionState?: NotorietyAttributionState;
  sourceId?: string | null;
};

type AggregatedFameScopeState = {
  earned: number;
  currentEarned: number;
  historical: number;
  branches: Map<FameBranchId, { earned: number; currentEarned: number; historical: number }>;
};

type NotorietySourceState = {
  categoryId: NotorietyCategoryId;
  severity: NotorietySeverityId;
  modifiers: NotorietyModifierId[];
  currentEarned: number;
  historical: number;
  earned: number;
  repeatCount: number;
};

type AggregatedNotorietyScopeState = {
  earned: number;
  currentEarned: number;
  historical: number;
  categoryWeights: Map<NotorietyCategoryId, number>;
  highestSeverity: NotorietySeverityId | null;
  activeFlags: Set<NotorietyModifierId>;
  directSources: NotorietySourceState[];
};

let reputationBalanceCache: ReputationBalanceRuleState | null = null;
let regionLookupCache: RegionLookupCatalog | null = null;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function round(value: number, digits = 4): number {
  return Number(value.toFixed(digits));
}

function requireFiniteNumber(value: unknown, fieldPath: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${REPUTATION_BALANCE_RULE_ID} ${fieldPath} must be a finite number`);
  }

  return value;
}

function requireNonNegativeNumber(value: unknown, fieldPath: string): number {
  const normalized = requireFiniteNumber(value, fieldPath);
  if (normalized < 0) {
    throw new Error(`${REPUTATION_BALANCE_RULE_ID} ${fieldPath} must not be negative`);
  }

  return normalized;
}

function requireStringArray(value: unknown, fieldPath: string): string[] {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string")) {
    throw new Error(`${REPUTATION_BALANCE_RULE_ID} ${fieldPath} must be a string array`);
  }

  return value;
}

function compareStringArrays(left: string[], right: string[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((entry, index) => entry === right[index]);
}

function parseReputationVectorWeight(value: unknown, fieldPath: string): ReputationVectorWeightState {
  if (!isObject(value)) {
    throw new Error(`${REPUTATION_BALANCE_RULE_ID} ${fieldPath} must contain an object value`);
  }

  return {
    value: requireNonNegativeNumber(value.value, `${fieldPath}.value`),
    persistence: requireNonNegativeNumber(value.persistence, `${fieldPath}.persistence`),
    seriousness: requireNonNegativeNumber(value.seriousness, `${fieldPath}.seriousness`)
  };
}

function parseFameRecognitionBandThreshold(
  value: unknown,
  fieldPath: string
): FameRecognitionBandThresholdState {
  if (!isObject(value)) {
    throw new Error(`${REPUTATION_BALANCE_RULE_ID} ${fieldPath} must contain an object value`);
  }

  if (typeof value.id !== "string" || !FAME_BAND_ORDER.includes(value.id as FameRecognitionBandId)) {
    throw new Error(`${REPUTATION_BALANCE_RULE_ID} ${fieldPath}.id must be a supported fame recognition band`);
  }

  return {
    id: value.id as FameRecognitionBandId,
    minimumCurrentTotal: requireNonNegativeNumber(value.minimumCurrentTotal, `${fieldPath}.minimumCurrentTotal`),
    minimumHistorical: requireNonNegativeNumber(value.minimumHistorical, `${fieldPath}.minimumHistorical`),
    directHigherScopeBonus: requireNonNegativeNumber(
      value.directHigherScopeBonus,
      `${fieldPath}.directHigherScopeBonus`
    )
  };
}

function parseNotorietySeriousnessThreshold(
  value: unknown,
  fieldPath: string
): NotorietySeriousnessThresholdState {
  if (!isObject(value)) {
    throw new Error(`${REPUTATION_BALANCE_RULE_ID} ${fieldPath} must contain an object value`);
  }

  if (
    typeof value.id !== "string" ||
    !SERIOUSNESS_ORDER.includes(value.id as NotorietySeriousnessClassId)
  ) {
    throw new Error(`${REPUTATION_BALANCE_RULE_ID} ${fieldPath}.id must be a supported seriousness class`);
  }

  const requiredModifiers = value.requiredModifiers === undefined
    ? []
    : requireStringArray(value.requiredModifiers, `${fieldPath}.requiredModifiers`).map((entry) => {
        if (!MODIFIER_CANONICAL_ORDER.includes(entry as NotorietyModifierId)) {
          throw new Error(
            `${REPUTATION_BALANCE_RULE_ID} ${fieldPath}.requiredModifiers contains unsupported modifier '${entry}'`
          );
        }
        return entry as NotorietyModifierId;
      });

  let minimumSeverity: NotorietySeverityId | null | undefined = undefined;
  if (value.minimumSeverity === null) {
    minimumSeverity = null;
  } else if (value.minimumSeverity !== undefined) {
    if (
      typeof value.minimumSeverity !== "string" ||
      !SEVERITY_ORDER.includes(value.minimumSeverity as NotorietySeverityId)
    ) {
      throw new Error(`${REPUTATION_BALANCE_RULE_ID} ${fieldPath}.minimumSeverity must be null or a known severity`);
    }
    minimumSeverity = value.minimumSeverity as NotorietySeverityId;
  }

  let minimumDirectScope: ReputationScope | null | undefined = undefined;
  if (value.minimumDirectScope === null) {
    minimumDirectScope = null;
  } else if (value.minimumDirectScope !== undefined) {
    if (
      typeof value.minimumDirectScope !== "string" ||
      !SCOPE_ORDER.includes(value.minimumDirectScope as ReputationScope)
    ) {
      throw new Error(`${REPUTATION_BALANCE_RULE_ID} ${fieldPath}.minimumDirectScope must be null or a known scope`);
    }
    minimumDirectScope = value.minimumDirectScope as ReputationScope;
  }

  const nextThreshold: NotorietySeriousnessThresholdState = {
    id: value.id as NotorietySeriousnessClassId,
    minimumScore: requireNonNegativeNumber(value.minimumScore, `${fieldPath}.minimumScore`),
    violentOnly: value.violentOnly === true
  };

  if (minimumSeverity !== undefined) {
    nextThreshold.minimumSeverity = minimumSeverity;
  }
  if (requiredModifiers.length > 0) {
    nextThreshold.requiredModifiers = requiredModifiers;
  }
  if (minimumDirectScope !== undefined) {
    nextThreshold.minimumDirectScope = minimumDirectScope;
  }

  return nextThreshold;
}

function getGlobalRuleRecords() {
  return globalRuleCatalog.records as GlobalRuleRecord[];
}

function getRegionRecords() {
  return regionCatalog.records as RegionRecord[];
}

function getSettlementRecords() {
  return settlementCatalog.records as SettlementRecord[];
}

function validateReputationBalanceRule(value: unknown): ReputationBalanceRuleState {
  if (!isObject(value)) {
    throw new Error(`${REPUTATION_BALANCE_RULE_ID} must contain an object value`);
  }

  if (!isObject(value.fameBranchValidation)) {
    throw new Error(`${REPUTATION_BALANCE_RULE_ID} fameBranchValidation must contain an object value`);
  }

  const fameBranchValidation = {} as Record<ReputationScope, FameBranchId[]>;
  for (const scope of SCOPE_ORDER) {
    const authored = requireStringArray(value.fameBranchValidation[scope], `fameBranchValidation.${scope}`);
    if (!compareStringArrays(authored, ACTIVE_FAME_BRANCHES_BY_SCOPE[scope])) {
      throw new Error(
        `${REPUTATION_BALANCE_RULE_ID} fameBranchValidation.${scope} must match the approved fame branches for ${scope}`
      );
    }
    fameBranchValidation[scope] = authored as FameBranchId[];
  }

  if (!isObject(value.notorietyCategoryWeights)) {
    throw new Error(`${REPUTATION_BALANCE_RULE_ID} notorietyCategoryWeights must contain an object value`);
  }

  const notorietyCategoryWeights: Partial<Record<NotorietyCategoryId, ReputationVectorWeightState>> = {};
  for (const categoryId of Object.keys(value.notorietyCategoryWeights) as NotorietyCategoryId[]) {
    notorietyCategoryWeights[categoryId] = parseReputationVectorWeight(
      value.notorietyCategoryWeights[categoryId],
      `notorietyCategoryWeights.${categoryId}`
    );
  }
  for (const categoryId of ACTIVE_NOTORIETY_CATEGORIES) {
    if (!notorietyCategoryWeights[categoryId]) {
      throw new Error(`${REPUTATION_BALANCE_RULE_ID} notorietyCategoryWeights must include '${categoryId}'`);
    }
  }

  if (!isObject(value.notorietySeverityMultipliers)) {
    throw new Error(`${REPUTATION_BALANCE_RULE_ID} notorietySeverityMultipliers must contain an object value`);
  }

  const notorietySeverityMultipliers = {} as Record<NotorietySeverityId, ReputationVectorWeightState>;
  for (const severity of SEVERITY_ORDER) {
    notorietySeverityMultipliers[severity] = parseReputationVectorWeight(
      value.notorietySeverityMultipliers[severity],
      `notorietySeverityMultipliers.${severity}`
    );
  }

  if (!isObject(value.notorietyModifierMultipliers)) {
    throw new Error(`${REPUTATION_BALANCE_RULE_ID} notorietyModifierMultipliers must contain an object value`);
  }

  const notorietyModifierMultipliers: Partial<Record<NotorietyModifierId, ReputationVectorWeightState>> = {};
  for (const modifierId of Object.keys(value.notorietyModifierMultipliers) as NotorietyModifierId[]) {
    notorietyModifierMultipliers[modifierId] = parseReputationVectorWeight(
      value.notorietyModifierMultipliers[modifierId],
      `notorietyModifierMultipliers.${modifierId}`
    );
  }
  for (const modifierId of ACTIVE_NOTORIETY_MODIFIERS) {
    if (!notorietyModifierMultipliers[modifierId]) {
      throw new Error(`${REPUTATION_BALANCE_RULE_ID} notorietyModifierMultipliers must include '${modifierId}'`);
    }
  }

  if (!Array.isArray(value.fameRecognitionBandThresholds)) {
    throw new Error(`${REPUTATION_BALANCE_RULE_ID} fameRecognitionBandThresholds must contain an array`);
  }
  const fameRecognitionBandThresholds = value.fameRecognitionBandThresholds.map((entry, index) =>
    parseFameRecognitionBandThreshold(entry, `fameRecognitionBandThresholds[${index}]`)
  );
  const seenBandIds = new Set<FameRecognitionBandId>();
  for (const threshold of fameRecognitionBandThresholds) {
    if (seenBandIds.has(threshold.id)) {
      throw new Error(`${REPUTATION_BALANCE_RULE_ID} fameRecognitionBandThresholds must not repeat '${threshold.id}'`);
    }
    seenBandIds.add(threshold.id);
  }
  for (const bandId of FAME_BAND_ORDER) {
    if (!seenBandIds.has(bandId)) {
      throw new Error(`${REPUTATION_BALANCE_RULE_ID} fameRecognitionBandThresholds must include '${bandId}'`);
    }
  }

  if (!Array.isArray(value.notorietySeriousnessThresholds)) {
    throw new Error(`${REPUTATION_BALANCE_RULE_ID} notorietySeriousnessThresholds must contain an array`);
  }
  const notorietySeriousnessThresholds = value.notorietySeriousnessThresholds.map((entry, index) =>
    parseNotorietySeriousnessThreshold(entry, `notorietySeriousnessThresholds[${index}]`)
  );
  const seenSeriousnessIds = new Set<NotorietySeriousnessClassId>();
  for (const threshold of notorietySeriousnessThresholds) {
    if (seenSeriousnessIds.has(threshold.id)) {
      throw new Error(
        `${REPUTATION_BALANCE_RULE_ID} notorietySeriousnessThresholds must not repeat '${threshold.id}'`
      );
    }
    seenSeriousnessIds.add(threshold.id);
  }
  for (const seriousnessId of SERIOUSNESS_ORDER) {
    if (!seenSeriousnessIds.has(seriousnessId)) {
      throw new Error(`${REPUTATION_BALANCE_RULE_ID} notorietySeriousnessThresholds must include '${seriousnessId}'`);
    }
  }

  return {
    version: Math.max(1, Math.round(requireFiniteNumber(value.version, "version"))),
    localCurrentDirectDecayPerDay: requireNonNegativeNumber(
      value.localCurrentDirectDecayPerDay,
      "localCurrentDirectDecayPerDay"
    ),
    regionalCurrentDirectDecayPerDay: requireNonNegativeNumber(
      value.regionalCurrentDirectDecayPerDay,
      "regionalCurrentDirectDecayPerDay"
    ),
    continentalCurrentDirectDecayPerDay: requireNonNegativeNumber(
      value.continentalCurrentDirectDecayPerDay,
      "continentalCurrentDirectDecayPerDay"
    ),
    worldCurrentDirectDecayPerDay: requireNonNegativeNumber(
      value.worldCurrentDirectDecayPerDay,
      "worldCurrentDirectDecayPerDay"
    ),
    regionalThresholdFloor: requireNonNegativeNumber(value.regionalThresholdFloor, "regionalThresholdFloor"),
    continentalThresholdFloor: requireNonNegativeNumber(
      value.continentalThresholdFloor,
      "continentalThresholdFloor"
    ),
    worldThresholdFloor: requireNonNegativeNumber(value.worldThresholdFloor, "worldThresholdFloor"),
    regionalCarryoverFactor: requireNonNegativeNumber(value.regionalCarryoverFactor, "regionalCarryoverFactor"),
    continentalCarryoverFactor: requireNonNegativeNumber(
      value.continentalCarryoverFactor,
      "continentalCarryoverFactor"
    ),
    worldCarryoverFactor: requireNonNegativeNumber(value.worldCarryoverFactor, "worldCarryoverFactor"),
    meaningfulContributionFloor: requireNonNegativeNumber(
      value.meaningfulContributionFloor,
      "meaningfulContributionFloor"
    ),
    fameBranchValidation,
    notorietyCategoryWeights,
    notorietySeverityMultipliers,
    notorietyModifierMultipliers,
    simultaneousSeriousCrimePersistenceCap: requireNonNegativeNumber(
      value.simultaneousSeriousCrimePersistenceCap,
      "simultaneousSeriousCrimePersistenceCap"
    ),
    notorietySeriousnessThresholds,
    fameRecognitionBandThresholds
  };
}

export function loadReputationBalanceRule(): ReputationBalanceRuleState {
  if (reputationBalanceCache) {
    return reputationBalanceCache;
  }

  const globalRule = getGlobalRuleRecords().find((record) => record.id === REPUTATION_BALANCE_RULE_ID);
  if (!globalRule) {
    throw new Error(`Missing authored global rule '${REPUTATION_BALANCE_RULE_ID}'`);
  }

  reputationBalanceCache = validateReputationBalanceRule(globalRule.value);
  return reputationBalanceCache;
}

function loadRegionLookupCatalog(): RegionLookupCatalog {
  if (regionLookupCache) {
    return regionLookupCache;
  }

  const regionsById = new Map(getRegionRecords().map((record) => [record.id, record]));
  const settlementsById = new Map(getSettlementRecords().map((record) => [record.id, record]));
  const settlementsByRegionId = new Map<string, SettlementContentRecord[]>();

  for (const settlement of settlementsById.values()) {
    const existing = settlementsByRegionId.get(settlement.regionId) ?? [];
    existing.push(settlement);
    settlementsByRegionId.set(settlement.regionId, existing);
  }

  regionLookupCache = { regionsById, settlementsById, settlementsByRegionId };
  return regionLookupCache;
}

function requireSettlementRecord(settlementId: string): SettlementRecord {
  const record = loadRegionLookupCatalog().settlementsById.get(settlementId);
  if (!record) {
    throw new Error(`Unknown settlement id '${settlementId}' for geographic knowledge or reputation resolution`);
  }
  return record;
}

function requireRegionRecord(regionId: string): RegionRecord {
  const record = loadRegionLookupCatalog().regionsById.get(regionId);
  if (!record) {
    throw new Error(`Unknown region id '${regionId}' for geographic knowledge or reputation resolution`);
  }
  return record;
}

function resolveContinentIdForRegion(regionId: string): string {
  let current: RegionRecord | undefined = requireRegionRecord(regionId);

  while (current) {
    if (current.regionType === "continent" || current.regionType === "island_system") {
      return current.id;
    }

    if (!current.parentRegionId) {
      break;
    }

    current = loadRegionLookupCatalog().regionsById.get(current.parentRegionId);
  }

  throw new Error(`Region '${regionId}' does not resolve to a parent continent or island system`);
}

function resolveContinentIdForSettlement(settlementId: string): string {
  return resolveContinentIdForRegion(requireSettlementRecord(settlementId).regionId);
}

function getSettlementImportanceWeight(administrativeRole: string | undefined): number {
  switch (administrativeRole) {
    case "continental":
      return 1.5;
    case "regional":
      return 1.25;
    case "subregional":
      return 1.1;
    case "none":
    case "local":
    default:
      return 1;
  }
}

function getCanonicalScopeId(scope: ReputationScope, inputScopeId: string): string {
  return scope === "world" ? "world" : inputScopeId;
}

function scopeOrder(scope: ReputationScope): number {
  return SCOPE_ORDER.indexOf(scope);
}

function severityOrder(severity: NotorietySeverityId | null): number {
  return severity === null ? -1 : SEVERITY_ORDER.indexOf(severity);
}

function getReputationDecayPerDay(scope: ReputationScope, rule: ReputationBalanceRuleState): number {
  switch (scope) {
    case "local":
      return rule.localCurrentDirectDecayPerDay;
    case "regional":
      return rule.regionalCurrentDirectDecayPerDay;
    case "continental":
      return rule.continentalCurrentDirectDecayPerDay;
    case "world":
      return rule.worldCurrentDirectDecayPerDay;
  }
}

function compareContributionDescending(
  left: { total: number; order: number },
  right: { total: number; order: number }
): number {
  const delta = right.total - left.total;
  if (Math.abs(delta) <= FLOAT_TOLERANCE) {
    return left.order - right.order;
  }

  return delta;
}

function getDiversityMultiplier(contributors: number): number {
  return round(1 + Math.min(0.35, 0.08 * Math.max(0, contributors - 1)));
}

function canonicalizeNotorietyModifiers(modifiers: NotorietyModifierId[] | undefined | null): NotorietyModifierId[] {
  const deduped = Array.from(new Set((modifiers ?? []).filter(Boolean)));
  deduped.sort((left, right) => MODIFIER_CANONICAL_ORDER.indexOf(left) - MODIFIER_CANONICAL_ORDER.indexOf(right));
  return deduped;
}

function getNotorietyModifiersSignature(modifiers: NotorietyModifierId[] | undefined | null): string {
  const canonical = canonicalizeNotorietyModifiers(modifiers);
  return canonical.length === 0 ? "none" : canonical.join("|");
}

function clonePlayerReputation(reputation: PlayerReputationState | undefined | null): PlayerReputationState {
  return {
    fame: [...(reputation?.fame ?? [])],
    notoriety: [...(reputation?.notoriety ?? [])],
    notorietyEvents: [...(reputation?.notorietyEvents ?? [])]
  };
}

function sortFameEntries(entries: PlayerFameBranchState[]): PlayerFameBranchState[] {
  return [...entries].sort((left, right) => {
    const scopeDelta = scopeOrder(left.scope) - scopeOrder(right.scope);
    if (scopeDelta !== 0) {
      return scopeDelta;
    }

    const scopeIdDelta = left.scopeId.localeCompare(right.scopeId);
    if (scopeIdDelta !== 0) {
      return scopeIdDelta;
    }

    return left.branchId.localeCompare(right.branchId);
  });
}

function sortNotorietyRows(entries: PlayerNotorietyCategoryState[]): PlayerNotorietyCategoryState[] {
  return [...entries].sort((left, right) => {
    const scopeDelta = scopeOrder(left.scope) - scopeOrder(right.scope);
    if (scopeDelta !== 0) {
      return scopeDelta;
    }

    const scopeIdDelta = left.scopeId.localeCompare(right.scopeId);
    if (scopeIdDelta !== 0) {
      return scopeIdDelta;
    }

    const categoryDelta = left.categoryId.localeCompare(right.categoryId);
    if (categoryDelta !== 0) {
      return categoryDelta;
    }

    const severityDelta = severityOrder(left.severity) - severityOrder(right.severity);
    if (severityDelta !== 0) {
      return severityDelta;
    }

    return left.modifiersSignature.localeCompare(right.modifiersSignature);
  });
}

function sortNotorietyEvents(entries: PlayerNotorietyEventState[]): PlayerNotorietyEventState[] {
  return [...entries].sort((left, right) => {
    const scopeDelta = scopeOrder(left.scope) - scopeOrder(right.scope);
    if (scopeDelta !== 0) {
      return scopeDelta;
    }

    const scopeIdDelta = left.scopeId.localeCompare(right.scopeId);
    if (scopeIdDelta !== 0) {
      return scopeIdDelta;
    }

    const tickDelta = left.occurredAtTick - right.occurredAtTick;
    if (tickDelta !== 0) {
      return tickDelta;
    }

    return left.id.localeCompare(right.id);
  });
}

function normalizePlayerReputation(reputation: PlayerReputationState | undefined | null): PlayerReputationState {
  const next = clonePlayerReputation(reputation);

  return {
    fame: sortFameEntries(
      next.fame.map((entry) => ({
        ...entry,
        scopeId: getCanonicalScopeId(entry.scope, entry.scopeId),
        earned: Math.max(0, round(entry.earned)),
        currentEarned: Math.max(0, round(entry.currentEarned)),
        historical: Math.max(0, round(entry.historical))
      }))
    ),
    notoriety: sortNotorietyRows(
      next.notoriety.map((entry) => ({
        ...entry,
        scopeId: getCanonicalScopeId(entry.scope, entry.scopeId),
        modifiers: canonicalizeNotorietyModifiers(entry.modifiers),
        modifiersSignature: getNotorietyModifiersSignature(entry.modifiers),
        earned: Math.max(0, round(entry.earned)),
        currentEarned: Math.max(0, round(entry.currentEarned)),
        historical: Math.max(0, round(entry.historical)),
        repeatCount: Math.max(0, Math.round(entry.repeatCount))
      }))
    ),
    notorietyEvents: sortNotorietyEvents(
      next.notorietyEvents.map((entry) => ({
        ...entry,
        scopeId: getCanonicalScopeId(entry.scope, entry.scopeId),
        modifiers: canonicalizeNotorietyModifiers(entry.modifiers),
        earned: Math.max(0, round(entry.earned)),
        currentEarned: Math.max(0, round(entry.currentEarned)),
        historical: Math.max(0, round(entry.historical))
      }))
    )
  };
}

function upsertFameDelta(
  entries: PlayerFameBranchState[],
  target: Pick<PlayerFameBranchState, "scope" | "scopeId" | "branchId">,
  delta: {
    earned?: number;
    currentEarned?: number;
    historical?: number;
  },
  tick: number | null
): PlayerFameBranchState[] {
  const scopeId = getCanonicalScopeId(target.scope, target.scopeId);
  const nextEntries = [...entries];
  const existingIndex = nextEntries.findIndex(
    (entry) =>
      entry.scope === target.scope &&
      entry.scopeId === scopeId &&
      entry.branchId === target.branchId
  );

  const existing = existingIndex >= 0 ? nextEntries[existingIndex] : null;
  const nextEntry: PlayerFameBranchState = {
    scope: target.scope,
    scopeId,
    branchId: target.branchId,
    earned: Math.max(0, round((existing?.earned ?? 0) + (delta.earned ?? 0))),
    currentEarned: Math.max(0, round((existing?.currentEarned ?? 0) + (delta.currentEarned ?? 0))),
    historical: Math.max(0, round((existing?.historical ?? 0) + (delta.historical ?? 0))),
    lastMeaningfulGainTick:
      (delta.earned ?? 0) > 0 || (delta.currentEarned ?? 0) > 0 || (delta.historical ?? 0) > 0
        ? tick ?? existing?.lastMeaningfulGainTick ?? null
        : existing?.lastMeaningfulGainTick ?? null
  };

  if (existingIndex >= 0) {
    nextEntries[existingIndex] = nextEntry;
  } else {
    nextEntries.push(nextEntry);
  }

  return sortFameEntries(nextEntries);
}

function upsertNotorietyAggregateDelta(
  entries: PlayerNotorietyCategoryState[],
  target: Pick<PlayerNotorietyCategoryState, "scope" | "scopeId" | "categoryId" | "severity" | "modifiers">,
  delta: {
    earned?: number;
    currentEarned?: number;
    historical?: number;
  },
  tick: number | null
): PlayerNotorietyCategoryState[] {
  const scopeId = getCanonicalScopeId(target.scope, target.scopeId);
  const canonicalModifiers = canonicalizeNotorietyModifiers(target.modifiers);
  const modifiersSignature = getNotorietyModifiersSignature(canonicalModifiers);
  const nextEntries = [...entries];
  const existingIndex = nextEntries.findIndex(
    (entry) =>
      entry.scope === target.scope &&
      entry.scopeId === scopeId &&
      entry.categoryId === target.categoryId &&
      entry.severity === target.severity &&
      entry.modifiersSignature === modifiersSignature
  );

  const existing = existingIndex >= 0 ? nextEntries[existingIndex] : null;
  const nextEntry: PlayerNotorietyCategoryState = {
    scope: target.scope,
    scopeId,
    categoryId: target.categoryId,
    severity: target.severity,
    modifiers: canonicalModifiers,
    modifiersSignature,
    earned: Math.max(0, round((existing?.earned ?? 0) + (delta.earned ?? 0))),
    currentEarned: Math.max(0, round((existing?.currentEarned ?? 0) + (delta.currentEarned ?? 0))),
    historical: Math.max(0, round((existing?.historical ?? 0) + (delta.historical ?? 0))),
    lastMeaningfulGainTick:
      (delta.earned ?? 0) > 0 || (delta.currentEarned ?? 0) > 0 || (delta.historical ?? 0) > 0
        ? tick ?? existing?.lastMeaningfulGainTick ?? null
        : existing?.lastMeaningfulGainTick ?? null,
    repeatCount: (existing?.repeatCount ?? 0) + 1
  };

  if (existingIndex >= 0) {
    nextEntries[existingIndex] = nextEntry;
  } else {
    nextEntries.push(nextEntry);
  }

  return sortNotorietyRows(nextEntries);
}

function createNotorietyEventId(
  reputation: PlayerReputationState,
  award: NotorietyReputationAwardDefinitionState,
  scopeId: string,
  occurredAtTick: number
): string {
  return [
    "reputation",
    "notoriety",
    award.directEarnedScope,
    scopeId.replace(/\./g, "_"),
    award.categoryId,
    award.severity,
    occurredAtTick,
    reputation.notorietyEvents.length + 1
  ].join(".");
}

function appendNotorietyEvent(
  entries: PlayerNotorietyEventState[],
  nextEvent: PlayerNotorietyEventState
): PlayerNotorietyEventState[] {
  return sortNotorietyEvents([...entries, nextEvent]);
}

function getRelevantScopeIds(
  award: FameReputationAwardDefinitionState | NotorietyReputationAwardDefinitionState
): Array<{ scope: ReputationScope; scopeId: string; settlementId: string | null }> {
  if (award.directEarnedScope === "world") {
    return [{ scope: "world", scopeId: "world", settlementId: award.originSettlementIds?.[0] ?? null }];
  }

  const originSettlementIds = Array.from(new Set((award.originSettlementIds ?? []).filter(Boolean)));
  if (originSettlementIds.length === 0) {
    return [];
  }

  if (award.directEarnedScope === "local") {
    return originSettlementIds.map((settlementId) => ({
      scope: "local",
      scopeId: settlementId,
      settlementId
    }));
  }

  if (award.directEarnedScope === "regional") {
    const grouped = new Map<string, string>();
    for (const settlementId of originSettlementIds) {
      const regionId = requireSettlementRecord(settlementId).regionId;
      if (!grouped.has(regionId)) {
        grouped.set(regionId, settlementId);
      }
    }

    return Array.from(grouped.entries()).map(([scopeId, settlementId]) => ({
      scope: "regional",
      scopeId,
      settlementId
    }));
  }

  const grouped = new Map<string, string>();
  for (const settlementId of originSettlementIds) {
    const continentId = resolveContinentIdForSettlement(settlementId);
    if (!grouped.has(continentId)) {
      grouped.set(continentId, settlementId);
    }
  }

  return Array.from(grouped.entries()).map(([scopeId, settlementId]) => ({
    scope: "continental",
    scopeId,
    settlementId
  }));
}

function shouldPersistNotorietyEvent(
  award: NotorietyReputationAwardDefinitionState,
  unresolved: boolean
): boolean {
  const modifiers = canonicalizeNotorietyModifiers(award.modifiers);
  return (
    award.severity === "major" ||
    VIOLENT_NOTORIETY_CATEGORIES.has(award.categoryId) ||
    modifiers.includes("mass") ||
    award.directEarnedScope === "regional" ||
    award.directEarnedScope === "continental" ||
    award.directEarnedScope === "world" ||
    unresolved
  );
}

function warnSkippedReputationAward(
  reason: string,
  award: ReputationAwardDefinitionState,
  evaluation: ReputationAwardEvaluationState
): void {
  const sourceSuffix = evaluation.sourceId ? ` source=${evaluation.sourceId}` : "";
  console.warn(
    `[reputation] ${reason}; axis=${award.axis} scope=${award.directEarnedScope} baseValue=${award.baseValue}${sourceSuffix}`
  );
}

function isAllowedFameBranchForScope(
  branchId: FameBranchId,
  scope: ReputationScope,
  rule: ReputationBalanceRuleState
): boolean {
  return rule.fameBranchValidation[scope].includes(branchId);
}

function getNotorietyVectorWeight(
  value: Partial<Record<NotorietyCategoryId | NotorietyModifierId, ReputationVectorWeightState>>,
  key: NotorietyCategoryId | NotorietyModifierId
): ReputationVectorWeightState {
  return value[key] ?? { value: 1, persistence: 1, seriousness: 1 };
}

function getNotorietyPersistenceScalar(
  source: Pick<NotorietySourceState, "categoryId" | "severity" | "modifiers" | "repeatCount">,
  rule: ReputationBalanceRuleState
): number {
  const categoryScalar = getNotorietyVectorWeight(rule.notorietyCategoryWeights, source.categoryId).persistence;
  const severityScalar = rule.notorietySeverityMultipliers[source.severity].persistence;
  const modifierScalar = source.modifiers.reduce(
    (total, modifierId) => total * getNotorietyVectorWeight(rule.notorietyModifierMultipliers, modifierId).persistence,
    1
  );
  const repeatScalar = source.repeatCount > 1 ? 1 + Math.min(0.25, 0.05 * Math.max(0, source.repeatCount - 1)) : 1;
  return Math.max(1, categoryScalar * severityScalar * modifierScalar * repeatScalar);
}

function isSeriousNotorietySource(source: Pick<NotorietySourceState, "categoryId" | "severity" | "modifiers">): boolean {
  return (
    source.severity === "major" ||
    VIOLENT_NOTORIETY_CATEGORIES.has(source.categoryId) ||
    source.modifiers.includes("mass")
  );
}

export function normalizePlayerGeographicKnowledge(
  entries: PlayerGeographicKnowledgeState[] | undefined | null
): PlayerGeographicKnowledgeState[] {
  const normalized = entries ?? [];
  const seen = new Set<string>();

  return normalized.map((entry, index) => {
    if (entry.level < 0) {
      throw new Error(`geographicKnowledge[${index}] must not use a negative level`);
    }

    if (entry.scope === "continent") {
      const regionRecord = requireRegionRecord(entry.geographyId);
      if (regionRecord.regionType !== "continent" && regionRecord.regionType !== "island_system") {
        throw new Error(`geographicKnowledge[${index}] continent ids must resolve to continent or island_system regions`);
      }
    } else if (entry.scope === "region") {
      const regionRecord = requireRegionRecord(entry.geographyId);
      if (regionRecord.regionType === "continent" || regionRecord.regionType === "island_system") {
        throw new Error(`geographicKnowledge[${index}] region ids must resolve to non-continent regions`);
      }
    } else if (entry.scope === "settlement") {
      requireSettlementRecord(entry.geographyId);
    } else {
      throw new Error(`geographicKnowledge[${index}] uses unsupported scope '${String(entry.scope)}'`);
    }

    const dedupeKey = `${entry.scope}:${entry.geographyId}`;
    if (seen.has(dedupeKey)) {
      throw new Error(`geographicKnowledge must not repeat '${dedupeKey}'`);
    }
    seen.add(dedupeKey);

    return {
      scope: entry.scope,
      geographyId: entry.geographyId,
      level: Math.max(0, entry.level)
    };
  });
}

export function upsertGeographicKnowledgeEntry(
  entries: PlayerGeographicKnowledgeState[],
  scope: GeographicKnowledgeScope,
  geographyId: string,
  level = 1
): PlayerGeographicKnowledgeState[] {
  normalizePlayerGeographicKnowledge(entries);

  const nextLevel = Math.max(0, level);
  if (scope === "continent") {
    const continent = requireRegionRecord(geographyId);
    if (continent.regionType !== "continent" && continent.regionType !== "island_system") {
      throw new Error(`'${geographyId}' is not a valid continent or island system region id`);
    }
  } else if (scope === "region") {
    const region = requireRegionRecord(geographyId);
    if (region.regionType === "continent" || region.regionType === "island_system") {
      throw new Error(`'${geographyId}' is a continent id and cannot be stored as region geographic knowledge`);
    }
  } else {
    requireSettlementRecord(geographyId);
  }

  const existingIndex = entries.findIndex(
    (entry) => entry.scope === scope && entry.geographyId === geographyId
  );

  if (existingIndex < 0) {
    return [...entries, { scope, geographyId, level: nextLevel }];
  }

  const nextEntries = [...entries];
  nextEntries[existingIndex] = {
    ...nextEntries[existingIndex]!,
    level: Math.max(nextEntries[existingIndex]!.level, nextLevel)
  };
  return nextEntries;
}

export function grantContinentGeographicKnowledge(
  entries: PlayerGeographicKnowledgeState[],
  continentId: string,
  level = 1
): PlayerGeographicKnowledgeState[] {
  return upsertGeographicKnowledgeEntry(entries, "continent", continentId, level);
}

export function grantRegionGeographicKnowledge(
  entries: PlayerGeographicKnowledgeState[],
  regionId: string,
  level = 1
): PlayerGeographicKnowledgeState[] {
  const continentId = resolveContinentIdForRegion(regionId);
  let nextEntries = grantContinentGeographicKnowledge(entries, continentId, level);
  nextEntries = upsertGeographicKnowledgeEntry(nextEntries, "region", regionId, level);
  return nextEntries;
}

export function grantSettlementGeographicKnowledge(
  entries: PlayerGeographicKnowledgeState[],
  settlementId: string,
  level = 1
): PlayerGeographicKnowledgeState[] {
  const settlement = requireSettlementRecord(settlementId);
  let nextEntries = grantRegionGeographicKnowledge(entries, settlement.regionId, level);
  nextEntries = upsertGeographicKnowledgeEntry(nextEntries, "settlement", settlementId, level);
  return nextEntries;
}

export function canApplyReputationAward(
  award: ReputationAwardDefinitionState,
  evaluation: ReputationAwardEvaluationState
): boolean {
  if (!evaluation.meaningful || award.baseValue <= 0 || !evaluation.exposureSatisfied) {
    return false;
  }

  if (award.axis === "fame") {
    return Boolean(evaluation.sociallyValued) && evaluation.attributionSatisfied !== false;
  }

  if (!evaluation.condemnedAct) {
    return false;
  }

  return (
    evaluation.attributionSatisfied ||
    (award.allowCredibleLink && Boolean(evaluation.credibleLinkSatisfied))
  );
}

export function applyReputationAward(
  reputation: PlayerReputationState,
  award: ReputationAwardDefinitionState,
  evaluation: ReputationAwardEvaluationState
): PlayerReputationState {
  const normalized = normalizePlayerReputation(reputation);
  if (!canApplyReputationAward(award, evaluation)) {
    return normalized;
  }

  const tick = evaluation.tick ?? null;
  const relevantTargets = getRelevantScopeIds(award);
  if (award.axis === "fame") {
    const balanceRule = loadReputationBalanceRule();
    if (!isAllowedFameBranchForScope(award.branchId, award.directEarnedScope, balanceRule)) {
      warnSkippedReputationAward(
        `Rejected fame award with invalid branch '${award.branchId}' for scope '${award.directEarnedScope}'`,
        award,
        evaluation
      );
      return normalized;
    }

    if (award.directEarnedScope !== "world" && relevantTargets.length === 0) {
      warnSkippedReputationAward("Skipped fame award because no origin settlements resolved into concrete targets", award, evaluation);
      return normalized;
    }

    let fame = normalized.fame;
    for (const target of relevantTargets) {
      fame = upsertFameDelta(
        fame,
        {
          scope: target.scope,
          scopeId: target.scopeId,
          branchId: award.branchId
        },
        { earned: award.baseValue, currentEarned: award.baseValue, historical: award.baseValue },
        tick
      );
    }

    return {
      fame,
      notoriety: normalized.notoriety,
      notorietyEvents: normalized.notorietyEvents
    };
  }

  let notoriety = normalized.notoriety;
  let notorietyEvents = normalized.notorietyEvents;
  const canonicalModifiers = canonicalizeNotorietyModifiers(award.modifiers);
  const attributionState =
    evaluation.attributionState ??
    (evaluation.attributionSatisfied
      ? "identified"
      : award.allowCredibleLink && evaluation.credibleLinkSatisfied
        ? "credible_link"
        : "unknown");
  const exposureState = evaluation.exposureState ?? award.exposureRequirement;
  const unresolved = evaluation.unresolved === true;
  const occurredAtTick = evaluation.occurredAtTick ?? evaluation.tick ?? 0;
  const persistAsEvent = shouldPersistNotorietyEvent(award, unresolved);

  if (award.directEarnedScope !== "world" && relevantTargets.length === 0) {
    warnSkippedReputationAward("Skipped notoriety award because no origin settlements resolved into concrete targets", award, evaluation);
    return normalized;
  }

  for (const target of relevantTargets) {
    if (persistAsEvent) {
      notorietyEvents = appendNotorietyEvent(notorietyEvents, {
        id: createNotorietyEventId(normalized, award, target.scopeId, occurredAtTick),
        scope: target.scope,
        scopeId: target.scopeId,
        settlementId: target.settlementId ?? award.originSettlementIds?.[0] ?? "world",
        categoryId: award.categoryId,
        severity: award.severity,
        modifiers: canonicalModifiers,
        earned: round(award.baseValue),
        currentEarned: round(award.baseValue),
        historical: round(award.baseValue),
        occurredAtTick,
        lastMeaningfulGainTick: tick,
        exposureState,
        attributionState,
        unresolved
      });
      continue;
    }

    notoriety = upsertNotorietyAggregateDelta(
      notoriety,
      {
        scope: target.scope,
        scopeId: target.scopeId,
        categoryId: award.categoryId,
        severity: award.severity,
        modifiers: canonicalModifiers
      },
      { earned: award.baseValue, currentEarned: award.baseValue, historical: award.baseValue },
      tick
    );
  }

  return {
    fame: normalized.fame,
    notoriety,
    notorietyEvents
  };
}

export function syncPlayerReputation(
  playerState: Pick<PlayerState, "reputation" | "saveMeta">,
  currentDay: number
): PlayerReputationState {
  const balanceRule = loadReputationBalanceRule();
  const saveMeta = playerState.saveMeta as PlayerSaveMetadata & { lastReputationDecayDay?: number | null };
  const lastDecayDay = saveMeta.lastReputationDecayDay ?? currentDay;
  const elapsedDays = Math.max(0, currentDay - lastDecayDay);
  const normalized = normalizePlayerReputation(playerState.reputation);

  if (elapsedDays === 0) {
    saveMeta.lastReputationDecayDay = currentDay;
    playerState.reputation = normalized;
    return normalized;
  }

  const activeSeriousCaseCount =
    normalized.notoriety.filter((entry) => entry.currentEarned > 0 && isSeriousNotorietySource(entry)).length +
    normalized.notorietyEvents.filter((entry) => entry.currentEarned > 0 && isSeriousNotorietySource(entry)).length;
  const simultaneousSeriousBonus = Math.min(
    balanceRule.simultaneousSeriousCrimePersistenceCap,
    Math.max(0, activeSeriousCaseCount - 1) * 0.05
  );

  const fame = sortFameEntries(
    normalized.fame.map((entry) => ({
      ...entry,
      currentEarned: Math.max(
        0,
        round(entry.currentEarned - getReputationDecayPerDay(entry.scope, balanceRule) * elapsedDays)
      )
    }))
  );

  const notoriety = sortNotorietyRows(
    normalized.notoriety.map((entry) => {
      const persistenceScalar =
        getNotorietyPersistenceScalar(entry, balanceRule) * (1 + simultaneousSeriousBonus);
      const adjustedDecay =
        getReputationDecayPerDay(entry.scope, balanceRule) * elapsedDays / Math.max(1, persistenceScalar);

      return {
        ...entry,
        currentEarned: Math.max(0, round(entry.currentEarned - adjustedDecay))
      };
    })
  );

  const notorietyEvents = sortNotorietyEvents(
    normalized.notorietyEvents.map((entry) => {
      const persistenceScalar =
        getNotorietyPersistenceScalar(
          { ...entry, repeatCount: entry.modifiers.includes("repeat") ? 2 : 1 },
          balanceRule
        ) * (1 + simultaneousSeriousBonus);
      const adjustedDecay =
        getReputationDecayPerDay(entry.scope, balanceRule) * elapsedDays / Math.max(1, persistenceScalar);

      return {
        ...entry,
        currentEarned: Math.max(0, round(entry.currentEarned - adjustedDecay))
      };
    })
  );

  const nextReputation = { fame, notoriety, notorietyEvents };
  playerState.reputation = nextReputation;
  saveMeta.lastReputationDecayDay = currentDay;
  return nextReputation;
}

function aggregateFameScope(entries: PlayerFameBranchState[], scope: ReputationScope, scopeId: string): AggregatedFameScopeState {
  const relevant = entries.filter(
    (entry) => entry.scope === scope && entry.scopeId === getCanonicalScopeId(scope, scopeId)
  );
  const branches = new Map<FameBranchId, { earned: number; currentEarned: number; historical: number }>();

  let earned = 0;
  let currentEarned = 0;
  let historical = 0;
  for (const entry of relevant) {
    earned += entry.earned;
    currentEarned += entry.currentEarned;
    historical += entry.historical;
    const existing = branches.get(entry.branchId) ?? { earned: 0, currentEarned: 0, historical: 0 };
    branches.set(entry.branchId, {
      earned: existing.earned + entry.earned,
      currentEarned: existing.currentEarned + entry.currentEarned,
      historical: existing.historical + entry.historical
    });
  }

  return {
    earned: round(earned),
    currentEarned: round(currentEarned),
    historical: round(historical),
    branches
  };
}

function findTopFameBranch(branches: AggregatedFameScopeState["branches"]): FameBranchId | null {
  let bestBranch: FameBranchId | null = null;
  let bestCurrent = -1;
  let bestHistorical = -1;

  for (const [branchId, values] of branches.entries()) {
    if (
      values.currentEarned > bestCurrent + FLOAT_TOLERANCE ||
      (Math.abs(values.currentEarned - bestCurrent) <= FLOAT_TOLERANCE &&
        values.historical > bestHistorical + FLOAT_TOLERANCE) ||
      (Math.abs(values.currentEarned - bestCurrent) <= FLOAT_TOLERANCE &&
        Math.abs(values.historical - bestHistorical) <= FLOAT_TOLERANCE &&
        (bestBranch === null || branchId.localeCompare(bestBranch) < 0))
    ) {
      bestBranch = branchId;
      bestCurrent = values.currentEarned;
      bestHistorical = values.historical;
    }
  }

  return bestBranch;
}

function countRelevantHigherScopeDirectFame(
  entries: PlayerFameBranchState[],
  scope: ReputationScope,
  scopeId: string
): number {
  if (scope === "world") {
    return 0;
  }

  const canonicalScopeId = getCanonicalScopeId(scope, scopeId);
  if (scope === "continental") {
    return entries.some((entry) => entry.scope === "world" && entry.currentEarned > 0) ? 1 : 0;
  }

  if (scope === "regional") {
    const continentId = resolveContinentIdForRegion(canonicalScopeId);
    let count = 0;
    if (entries.some((entry) => entry.scope === "continental" && entry.scopeId === continentId && entry.currentEarned > 0)) {
      count += 1;
    }
    if (entries.some((entry) => entry.scope === "world" && entry.currentEarned > 0)) {
      count += 1;
    }
    return count;
  }

  const settlement = requireSettlementRecord(canonicalScopeId);
  const continentId = resolveContinentIdForRegion(settlement.regionId);
  let count = 0;
  if (entries.some((entry) => entry.scope === "regional" && entry.scopeId === settlement.regionId && entry.currentEarned > 0)) {
      count += 1;
  }
  if (entries.some((entry) => entry.scope === "continental" && entry.scopeId === continentId && entry.currentEarned > 0)) {
    count += 1;
  }
  if (entries.some((entry) => entry.scope === "world" && entry.currentEarned > 0)) {
    count += 1;
  }
  return count;
}

function resolveFameRecognitionBand(
  currentTotal: number,
  historical: number,
  higherScopeDirectCount: number,
  rule: ReputationBalanceRuleState
): FameRecognitionBandId | null {
  const thresholds = [...rule.fameRecognitionBandThresholds].sort(
    (left, right) => FAME_BAND_ORDER.indexOf(right.id) - FAME_BAND_ORDER.indexOf(left.id)
  );

  for (const threshold of thresholds) {
    const effectiveCurrentTotal = currentTotal + higherScopeDirectCount * threshold.directHigherScopeBonus;
    if (
      effectiveCurrentTotal + FLOAT_TOLERANCE >= threshold.minimumCurrentTotal &&
      historical + FLOAT_TOLERANCE >= threshold.minimumHistorical
    ) {
      return threshold.id;
    }
  }

  return null;
}

function buildResolvedFameScope(
  entries: PlayerFameBranchState[],
  scope: ReputationScope,
  scopeId: string,
  currentThreshold: number,
  rule: ReputationBalanceRuleState
): ResolvedFameScopeState {
  const aggregated = aggregateFameScope(entries, scope, scopeId);
  const currentTotal = round(aggregated.currentEarned + currentThreshold);

  return {
    scope,
    scopeId: getCanonicalScopeId(scope, scopeId),
    currentEarned: aggregated.currentEarned,
    currentThreshold: round(currentThreshold),
    currentTotal,
    historical: aggregated.historical,
    topBranchId: findTopFameBranch(aggregated.branches),
    recognitionBandId: resolveFameRecognitionBand(
      currentTotal,
      aggregated.historical,
      countRelevantHigherScopeDirectFame(entries, scope, scopeId),
      rule
    ),
    historicalTier: resolveHistoricalReputationTier(aggregated.historical)
  };
}

function collectNotorietyScopeSources(
  rows: PlayerNotorietyCategoryState[],
  events: PlayerNotorietyEventState[],
  scope: ReputationScope,
  scopeId: string
): AggregatedNotorietyScopeState {
  const canonicalScopeId = getCanonicalScopeId(scope, scopeId);
  const directSources: NotorietySourceState[] = [];
  const categoryWeights = new Map<NotorietyCategoryId, number>();
  const activeFlags = new Set<NotorietyModifierId>();
  let earned = 0;
  let currentEarned = 0;
  let historical = 0;
  let highestSeverity: NotorietySeverityId | null = null;

  const relevantRows = rows.filter((entry) => entry.scope === scope && entry.scopeId === canonicalScopeId);
  for (const entry of relevantRows) {
    directSources.push({
      categoryId: entry.categoryId,
      severity: entry.severity,
      modifiers: entry.modifiers,
      earned: entry.earned,
      currentEarned: entry.currentEarned,
      historical: entry.historical,
      repeatCount: entry.repeatCount
    });
  }

  const relevantEvents = events.filter((entry) => entry.scope === scope && entry.scopeId === canonicalScopeId);
  for (const entry of relevantEvents) {
    directSources.push({
      categoryId: entry.categoryId,
      severity: entry.severity,
      modifiers: entry.modifiers,
      earned: entry.earned,
      currentEarned: entry.currentEarned,
      historical: entry.historical,
      repeatCount: entry.modifiers.includes("repeat") ? 2 : 1
    });
  }

  for (const source of directSources) {
    earned += source.earned;
    currentEarned += source.currentEarned;
    historical += source.historical;
    if (highestSeverity === null || severityOrder(source.severity) > severityOrder(highestSeverity)) {
      highestSeverity = source.severity;
    }

    for (const modifier of source.modifiers) {
      if (source.currentEarned > 0 || source.historical > 0) {
        activeFlags.add(modifier);
      }
    }

    categoryWeights.set(
      source.categoryId,
      (categoryWeights.get(source.categoryId) ?? 0) + source.currentEarned + source.historical * 0.25
    );
  }

  return {
    earned: round(earned),
    currentEarned: round(currentEarned),
    historical: round(historical),
    categoryWeights,
    highestSeverity,
    activeFlags,
    directSources
  };
}

function findTopNotorietyCategory(
  categoryWeights: Map<NotorietyCategoryId, number>
): NotorietyCategoryId | null {
  let bestCategory: NotorietyCategoryId | null = null;
  let bestWeight = -1;

  for (const [categoryId, weight] of categoryWeights.entries()) {
    if (
      weight > bestWeight + FLOAT_TOLERANCE ||
      (Math.abs(weight - bestWeight) <= FLOAT_TOLERANCE &&
        (bestCategory === null || categoryId.localeCompare(bestCategory) < 0))
    ) {
      bestCategory = categoryId;
      bestWeight = weight;
    }
  }

  return bestCategory;
}

function getWeightedNotorietyScore(
  aggregated: AggregatedNotorietyScopeState,
  currentThreshold: number,
  rule: ReputationBalanceRuleState
): number {
  let score = currentThreshold * 0.35;

  for (const source of aggregated.directSources) {
    const categoryWeight = getNotorietyVectorWeight(rule.notorietyCategoryWeights, source.categoryId);
    const severityWeight = rule.notorietySeverityMultipliers[source.severity];
    const modifierWeight = source.modifiers.reduce(
      (total, modifierId) => {
        const modifier = getNotorietyVectorWeight(rule.notorietyModifierMultipliers, modifierId);
        return {
          value: total.value * modifier.value,
          persistence: total.persistence * modifier.persistence,
          seriousness: total.seriousness * modifier.seriousness
        };
      },
      { value: 1, persistence: 1, seriousness: 1 }
    );

    score +=
      source.currentEarned * categoryWeight.value * severityWeight.value * modifierWeight.value +
      source.historical * 0.1 * categoryWeight.seriousness * severityWeight.seriousness * modifierWeight.seriousness +
      Math.max(0, source.repeatCount - 1) * 0.5;
  }

  return round(score);
}

function resolveNotorietySeriousnessClass(
  scope: ReputationScope,
  aggregated: AggregatedNotorietyScopeState,
  currentThreshold: number,
  rule: ReputationBalanceRuleState
): NotorietySeriousnessClassId {
  const score = getWeightedNotorietyScore(aggregated, currentThreshold, rule);
  const hasViolentSource = aggregated.directSources.some((source) => VIOLENT_NOTORIETY_CATEGORIES.has(source.categoryId));
  const activeFlags = new Set(Array.from(aggregated.activeFlags));
  const directScope = aggregated.currentEarned > 0 ? scope : null;

  const thresholds = [...rule.notorietySeriousnessThresholds].sort(
    (left, right) => SERIOUSNESS_ORDER.indexOf(right.id) - SERIOUSNESS_ORDER.indexOf(left.id)
  );

  for (const threshold of thresholds) {
    if (score + FLOAT_TOLERANCE < threshold.minimumScore) {
      continue;
    }

    if (
      threshold.minimumSeverity &&
      severityOrder(aggregated.highestSeverity) < severityOrder(threshold.minimumSeverity)
    ) {
      continue;
    }

    if (threshold.violentOnly && !hasViolentSource) {
      continue;
    }

    if (
      threshold.minimumDirectScope &&
      (directScope === null || scopeOrder(directScope) < scopeOrder(threshold.minimumDirectScope))
    ) {
      continue;
    }

    if (threshold.requiredModifiers && threshold.requiredModifiers.some((modifierId) => !activeFlags.has(modifierId))) {
      continue;
    }

    return threshold.id;
  }

  return "nuisance";
}

function buildResolvedNotorietyScope(
  rows: PlayerNotorietyCategoryState[],
  events: PlayerNotorietyEventState[],
  scope: ReputationScope,
  scopeId: string,
  currentThreshold: number,
  rule: ReputationBalanceRuleState
): ResolvedNotorietyScopeState {
  const aggregated = collectNotorietyScopeSources(rows, events, scope, scopeId);
  const currentTotal = round(aggregated.currentEarned + currentThreshold);

  return {
    scope,
    scopeId: getCanonicalScopeId(scope, scopeId),
    currentEarned: aggregated.currentEarned,
    currentThreshold: round(currentThreshold),
    currentTotal,
    historical: aggregated.historical,
    topCategoryId: findTopNotorietyCategory(aggregated.categoryWeights),
    highestSeverity: aggregated.highestSeverity,
    activeFlags: Array.from(aggregated.activeFlags).sort(
      (left, right) => MODIFIER_CANONICAL_ORDER.indexOf(left) - MODIFIER_CANONICAL_ORDER.indexOf(right)
    ),
    seriousnessClass: resolveNotorietySeriousnessClass(scope, aggregated, currentThreshold, rule),
    historicalTier: resolveHistoricalReputationTier(aggregated.historical)
  };
}

export function resolveScopedReputation(
  playerState: Pick<PlayerState, "reputation">
): {
  fame: ResolvedFameScopeState[];
  notoriety: ResolvedNotorietyScopeState[];
} {
  const balanceRule = loadReputationBalanceRule();
  const reputation = normalizePlayerReputation(playerState.reputation);
  const resolvedFame: ResolvedFameScopeState[] = [];
  const resolvedNotoriety: ResolvedNotorietyScopeState[] = [];

  const localFameScopeIds = Array.from(new Set(reputation.fame.filter((entry) => entry.scope === "local").map((entry) => entry.scopeId)));
  const localFameBySettlement = new Map<string, ResolvedFameScopeState>();
  for (const settlementId of localFameScopeIds) {
    const entry = buildResolvedFameScope(reputation.fame, "local", settlementId, 0, balanceRule);
    if (entry.currentTotal > 0 || entry.historical > 0) {
      resolvedFame.push(entry);
      localFameBySettlement.set(settlementId, entry);
    }
  }

  const regionalFameScopeIds = new Set<string>(reputation.fame.filter((entry) => entry.scope === "regional").map((entry) => entry.scopeId));
  for (const settlementId of localFameBySettlement.keys()) {
    regionalFameScopeIds.add(requireSettlementRecord(settlementId).regionId);
  }
  const resolvedRegionalFame: ResolvedFameScopeState[] = [];
  for (const regionId of regionalFameScopeIds) {
    const settlements = loadRegionLookupCatalog().settlementsByRegionId.get(regionId) ?? [];
    const contributors = settlements
      .map((settlement, order) => ({
        total: localFameBySettlement.get(settlement.id)?.currentTotal ?? 0,
        order,
        weight: getSettlementImportanceWeight(settlement.administrativeRole)
      }))
      .filter((entry) => entry.total >= balanceRule.meaningfulContributionFloor)
      .sort(compareContributionDescending);
    const weightedTotal = contributors.reduce((total, entry) => total + entry.total * entry.weight, 0);
    const currentThreshold =
      contributors.length >= 2
        ? round(
            Math.max(0, weightedTotal - balanceRule.regionalThresholdFloor) *
              balanceRule.regionalCarryoverFactor *
              getDiversityMultiplier(contributors.length)
          )
        : 0;
    const entry = buildResolvedFameScope(reputation.fame, "regional", regionId, currentThreshold, balanceRule);
    if (entry.currentTotal > 0 || entry.historical > 0) {
      resolvedFame.push(entry);
      resolvedRegionalFame.push(entry);
    }
  }

  const continentalFameScopeIds = new Set<string>(
    reputation.fame.filter((entry) => entry.scope === "continental").map((entry) => entry.scopeId)
  );
  for (const entry of resolvedRegionalFame) {
    continentalFameScopeIds.add(resolveContinentIdForRegion(entry.scopeId));
  }
  const resolvedContinentalFame: ResolvedFameScopeState[] = [];
  for (const continentId of continentalFameScopeIds) {
    const contributors = resolvedRegionalFame
      .filter((entry) => resolveContinentIdForRegion(entry.scopeId) === continentId)
      .map((entry, order) => ({ total: entry.currentTotal, order }))
      .filter((entry) => entry.total >= balanceRule.meaningfulContributionFloor)
      .sort(compareContributionDescending);
    const weightedTotal = contributors.reduce((total, entry) => total + entry.total, 0);
    const currentThreshold =
      contributors.length >= 2
        ? round(
            Math.max(0, weightedTotal - balanceRule.continentalThresholdFloor) *
              balanceRule.continentalCarryoverFactor *
              getDiversityMultiplier(contributors.length)
          )
        : 0;
    const entry = buildResolvedFameScope(reputation.fame, "continental", continentId, currentThreshold, balanceRule);
    if (entry.currentTotal > 0 || entry.historical > 0) {
      resolvedFame.push(entry);
      resolvedContinentalFame.push(entry);
    }
  }

  const worldFameContributors = resolvedContinentalFame
    .map((entry, order) => ({ total: entry.currentTotal, order, scopeId: entry.scopeId }))
    .filter((entry) => entry.total >= balanceRule.meaningfulContributionFloor)
    .sort(compareContributionDescending);
  const uniqueWorldFameContributors = Array.from(new Set(worldFameContributors.map((entry) => entry.scopeId))).length;
  const worldFameThreshold =
    uniqueWorldFameContributors >= 2
      ? round(
          Math.max(
            0,
            worldFameContributors.reduce((total, entry) => total + entry.total, 0) - balanceRule.worldThresholdFloor
          ) *
            balanceRule.worldCarryoverFactor *
            getDiversityMultiplier(uniqueWorldFameContributors)
        )
      : 0;
  const worldFame = buildResolvedFameScope(reputation.fame, "world", "world", worldFameThreshold, balanceRule);
  if (worldFame.currentTotal > 0 || worldFame.historical > 0) {
    resolvedFame.push(worldFame);
  }

  const localNotorietyScopeIds = new Set<string>(reputation.notoriety.filter((entry) => entry.scope === "local").map((entry) => entry.scopeId));
  for (const event of reputation.notorietyEvents) {
    if (event.scope === "local") {
      localNotorietyScopeIds.add(event.scopeId);
    }
  }
  const localNotorietyBySettlement = new Map<string, ResolvedNotorietyScopeState>();
  for (const settlementId of localNotorietyScopeIds) {
    const entry = buildResolvedNotorietyScope(
      reputation.notoriety,
      reputation.notorietyEvents,
      "local",
      settlementId,
      0,
      balanceRule
    );
    if (entry.currentTotal > 0 || entry.historical > 0) {
      resolvedNotoriety.push(entry);
      localNotorietyBySettlement.set(settlementId, entry);
    }
  }

  const regionalNotorietyScopeIds = new Set<string>(
    reputation.notoriety.filter((entry) => entry.scope === "regional").map((entry) => entry.scopeId)
  );
  for (const event of reputation.notorietyEvents) {
    if (event.scope === "regional") {
      regionalNotorietyScopeIds.add(event.scopeId);
    }
  }
  for (const settlementId of localNotorietyBySettlement.keys()) {
    regionalNotorietyScopeIds.add(requireSettlementRecord(settlementId).regionId);
  }
  const resolvedRegionalNotoriety: ResolvedNotorietyScopeState[] = [];
  for (const regionId of regionalNotorietyScopeIds) {
    const settlements = loadRegionLookupCatalog().settlementsByRegionId.get(regionId) ?? [];
    const contributors = settlements
      .map((settlement, order) => ({
        total: localNotorietyBySettlement.get(settlement.id)?.currentTotal ?? 0,
        order,
        weight: getSettlementImportanceWeight(settlement.administrativeRole)
      }))
      .filter((entry) => entry.total >= balanceRule.meaningfulContributionFloor)
      .sort(compareContributionDescending);
    const weightedTotal = contributors.reduce((total, entry) => total + entry.total * entry.weight, 0);
    const currentThreshold =
      contributors.length >= 2
        ? round(
            Math.max(0, weightedTotal - balanceRule.regionalThresholdFloor) *
              balanceRule.regionalCarryoverFactor *
              getDiversityMultiplier(contributors.length)
          )
        : 0;
    const entry = buildResolvedNotorietyScope(
      reputation.notoriety,
      reputation.notorietyEvents,
      "regional",
      regionId,
      currentThreshold,
      balanceRule
    );
    if (entry.currentTotal > 0 || entry.historical > 0) {
      resolvedNotoriety.push(entry);
      resolvedRegionalNotoriety.push(entry);
    }
  }

  const continentalNotorietyScopeIds = new Set<string>(
    reputation.notoriety.filter((entry) => entry.scope === "continental").map((entry) => entry.scopeId)
  );
  for (const event of reputation.notorietyEvents) {
    if (event.scope === "continental") {
      continentalNotorietyScopeIds.add(event.scopeId);
    }
  }
  for (const entry of resolvedRegionalNotoriety) {
    continentalNotorietyScopeIds.add(resolveContinentIdForRegion(entry.scopeId));
  }
  const resolvedContinentalNotoriety: ResolvedNotorietyScopeState[] = [];
  for (const continentId of continentalNotorietyScopeIds) {
    const contributors = resolvedRegionalNotoriety
      .filter((entry) => resolveContinentIdForRegion(entry.scopeId) === continentId)
      .map((entry, order) => ({ total: entry.currentTotal, order }))
      .filter((entry) => entry.total >= balanceRule.meaningfulContributionFloor)
      .sort(compareContributionDescending);
    const weightedTotal = contributors.reduce((total, entry) => total + entry.total, 0);
    const currentThreshold =
      contributors.length >= 2
        ? round(
            Math.max(0, weightedTotal - balanceRule.continentalThresholdFloor) *
              balanceRule.continentalCarryoverFactor *
              getDiversityMultiplier(contributors.length)
          )
        : 0;
    const entry = buildResolvedNotorietyScope(
      reputation.notoriety,
      reputation.notorietyEvents,
      "continental",
      continentId,
      currentThreshold,
      balanceRule
    );
    if (entry.currentTotal > 0 || entry.historical > 0) {
      resolvedNotoriety.push(entry);
      resolvedContinentalNotoriety.push(entry);
    }
  }

  const worldNotorietyContributors = resolvedContinentalNotoriety
    .map((entry, order) => ({ total: entry.currentTotal, order, scopeId: entry.scopeId }))
    .filter((entry) => entry.total >= balanceRule.meaningfulContributionFloor)
    .sort(compareContributionDescending);
  const uniqueWorldNotorietyContributors = Array.from(new Set(worldNotorietyContributors.map((entry) => entry.scopeId))).length;
  const worldNotorietyThreshold =
    uniqueWorldNotorietyContributors >= 2
      ? round(
          Math.max(
            0,
            worldNotorietyContributors.reduce((total, entry) => total + entry.total, 0) -
              balanceRule.worldThresholdFloor
          ) *
            balanceRule.worldCarryoverFactor *
            getDiversityMultiplier(uniqueWorldNotorietyContributors)
        )
      : 0;
  const worldNotoriety = buildResolvedNotorietyScope(
    reputation.notoriety,
    reputation.notorietyEvents,
    "world",
    "world",
    worldNotorietyThreshold,
    balanceRule
  );
  if (worldNotoriety.currentTotal > 0 || worldNotoriety.historical > 0) {
    resolvedNotoriety.push(worldNotoriety);
  }

  const sortResolved = <T extends { scope: ReputationScope; scopeId: string }>(entries: T[]) =>
    [...entries].sort((left, right) => {
      const scopeDelta = scopeOrder(left.scope) - scopeOrder(right.scope);
      if (scopeDelta !== 0) {
        return scopeDelta;
      }

      return left.scopeId.localeCompare(right.scopeId);
    });

  return {
    fame: sortResolved(resolvedFame),
    notoriety: sortResolved(resolvedNotoriety)
  };
}

export function resolveHistoricalReputationTier(value: number): ReputationHistoricalTierId {
  if (value >= 75) {
    return "epic";
  }

  if (value >= 25) {
    return "historical";
  }

  return "common";
}
