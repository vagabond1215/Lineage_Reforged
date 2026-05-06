import legacyUnlockCatalog from "../../../content/base/player/legacy_unlocks.json" with { type: "json" };
import type {
  AccountProfileState,
  AccountRunArchiveReason,
  AccountRunHistoryOutcome,
  AccountRunHistoryRecord,
  LegacyTransactionState,
  LegacyRenownTier,
  LegacyUnlockCategory,
  LegacyUnlockClassification,
  LegacyUnlockCostState,
  LegacyUnlockDefinitionState,
  LegacyUnlockDuration,
  LegacyUnlockEffectKind,
  LegacyUnlockEffectState,
  LegacyUnlockCurrency,
  LegacyUnlockImplementationPriority,
  LegacyUnlockKind,
  LegacyUnlockPurchaseMode,
  LegacyUnlockRequirementResolutionState,
  LegacyUnlockRequirementState,
  LegacyUnlockScope,
  LegacyUnlockState,
  PlayerAttributeKey,
  PlayerCurrencyState,
  PlayerPartialResourceVector,
  PlayerResourceModifierState,
  PlayerResourceKey
} from "../../../shared/types/src/index.js";
import { recordLegacyTransaction } from "./legacy-account.js";

const CATEGORY_ORDER: LegacyUnlockCategory[] = [
  "Lineage",
  "Renown",
  "Fortune",
  "Craft",
  "Destiny",
  "Chronicle",
  "Preparations"
];

const KNOWN_CATEGORIES = new Set<LegacyUnlockCategory>(CATEGORY_ORDER);
const KNOWN_KINDS = new Set<LegacyUnlockKind>(["binary", "tiered", "incremental"]);
const KNOWN_CLASSIFICATIONS = new Set<LegacyUnlockClassification>(["permanent", "preparation"]);
const KNOWN_PURCHASE_MODES = new Set<LegacyUnlockPurchaseMode>([
  "permanent",
  "unlock_only",
  "preparation"
]);
const KNOWN_LEGACY_CURRENCIES = new Set<LegacyUnlockCurrency>([
  "account_legacy",
  "family_prestige",
  "regional_renown",
  "knowledge_marks",
  "chronicle_milestones",
  "skill_marks"
]);
const KNOWN_LEGACY_SCOPES = new Set<LegacyUnlockScope>([
  "account",
  "family",
  "region",
  "character_start",
  "next_run",
  "heir_only",
  "catalog_only"
]);
const KNOWN_LEGACY_DURATIONS = new Set<LegacyUnlockDuration>([
  "permanent",
  "next_character",
  "current_run",
  "limited_days"
]);
const KNOWN_IMPLEMENTATION_PRIORITIES = new Set<LegacyUnlockImplementationPriority>([
  "live",
  "catalog_only",
  "backlog"
]);
const KNOWN_RENOWN_TIERS = new Set<LegacyRenownTier>([
  "settlement",
  "region",
  "continent",
  "universal"
]);
const LEGACY_METADATA_IDENTIFIER_PATTERN = /^[a-z0-9]+(?:[._][a-z0-9]+)*$/;
const KNOWN_EFFECT_KINDS = new Set<LegacyUnlockEffectKind>([
  "account_flag",
  "profile_title",
  "chronicle_presentation",
  "future_heir_start",
  "future_inheritance_uses",
  "preparation_capacity",
  "next_run_preparation",
  "future_starting_item",
  "future_attribute_preparation",
  "future_resource_preparation",
  "future_lineage_retention",
  "future_renown",
  "future_preparation_discount"
]);

const FUTURE_REQUIREMENT_TYPES = new Set(["character_skill", "role_rank", "wealth"]);

export type LegacyUnlockAffordability = "affordable" | "unaffordable" | "no_cost";
export type LegacyUnlockOwnershipState = "locked" | "unlocked" | "maxed";
export type LegacyUnlockResolvedClassification =
  | "permanent"
  | "tiered_permanent"
  | "preparation";

export type LegacyUnlockRequirementResult = {
  requirement: LegacyUnlockRequirementState;
  state: LegacyUnlockRequirementResolutionState;
  label: string;
};

export type LegacyUnlockResolvedState = {
  id: string;
  definition: LegacyUnlockDefinitionState | null;
  category: LegacyUnlockCategory;
  kind: LegacyUnlockKind;
  classification: LegacyUnlockResolvedClassification;
  title: string;
  description: string;
  currentRank: number;
  nextRank: number | null;
  maxRank: number;
  isOwned: boolean;
  isKnown: boolean;
  state: LegacyUnlockOwnershipState;
  nextCost: number | null;
  eligible: boolean;
  affordability: LegacyUnlockAffordability;
  requirementResults: LegacyUnlockRequirementResult[];
  effects: LegacyUnlockEffectState[];
  renownTier: LegacyRenownTier | null;
  renownNodeId: string | null;
  renownParentNodeId: string | null;
  renownDisplayName: string | null;
  renownSupportUnlockIds: string[];
  canPurchase: boolean;
  purchaseBlockedReason: string | null;
};

export type LegacyUnlockPurchaseFailureReason =
  | "unknown_unlock"
  | "max_rank"
  | "unsupported_requirement"
  | "ineligible"
  | "insufficient_legacy"
  | "invalid_cost";

export type LegacyUnlockPurchaseFailure = {
  ok: false;
  profile: AccountProfileState;
  error: LegacyUnlockPurchaseFailureReason;
};

export type LegacyUnlockPurchaseSuccess = {
  ok: true;
  profile: AccountProfileState;
  transaction: LegacyTransactionState;
  unlock: LegacyUnlockState;
};

export type LegacyPreparationChoiceOption = {
  id: string;
  label: string;
};

export type LegacyPreparationSelectionFailureReason =
  | "unknown_unlock"
  | "not_preparation"
  | "not_owned"
  | "choice_required"
  | "invalid_choice"
  | "selection_unavailable"
  | "duplicate_selection"
  | "capacity_full";

export type LegacyPreparationSelectionFailure = {
  ok: false;
  profile: AccountProfileState;
  error: LegacyPreparationSelectionFailureReason;
};

export type LegacyPreparationSelectionSuccess = {
  ok: true;
  profile: AccountProfileState;
  selectedPreparationUnlockIds: string[];
  selectedPreparationChoicePayloads: Record<string, string>;
};

export type LegacyPreparationSelectionResolution = {
  capacity: number;
  selectedUnlockIds: string[];
  selectedChoicePayloads: Record<string, string>;
  droppedInvalidUnlockIds: string[];
  droppedExcessUnlockIds: string[];
  incompleteChoiceUnlockIds: string[];
  choiceRequiredUnlockIds: string[];
};

export type LegacyRenownMatchState = {
  tier: "settlement" | "region" | "continent";
  nodeId: string;
  displayName: string;
  rank: number;
};

export type LegacyRenownFlavorFlags = {
  villageName: boolean;
  bannerRightsRank: number;
  veteranReputation: boolean;
};

export type LegacyRenownPresenceState = {
  settlement: LegacyRenownMatchState | null;
  region: LegacyRenownMatchState | null;
  continent: LegacyRenownMatchState | null;
  universalRank: number;
  activeTiers: LegacyRenownTier[];
  primaryTier: LegacyRenownTier | null;
  flavorFlags: LegacyRenownFlavorFlags;
};

const CHOICE_REQUIRED_PREPARATION_IDS = new Set([
  "legacy.unlock.preparation.martial_legacy",
  "legacy.unlock.preparation.learned_legacy",
  "legacy.unlock.preparation.noble_legacy",
  "legacy.unlock.preparation.vital_legacy"
]);

const MARTIAL_LEGACY_ATTRIBUTE_CHOICES = [
  "STR",
  "DEX",
  "AGI",
  "CON"
] as const satisfies readonly PlayerAttributeKey[];
const LEARNED_LEGACY_ATTRIBUTE_CHOICES = [
  "INT",
  "WIS",
  "SPT"
] as const satisfies readonly PlayerAttributeKey[];
const VITAL_LEGACY_RESOURCE_CHOICES = [
  "hp",
  "stamina",
  "mp"
] as const satisfies readonly PlayerResourceKey[];

const RENOWN_FLAVOR_UNLOCK_IDS = {
  villageName: "legacy.unlock.renown.village_name",
  bannerRights: "legacy.unlock.renown.banner_rights",
  veteranReputation: "legacy.unlock.renown.veteran_reputation"
} as const;

const LEGACY_CHARACTER_START_BONUS_UNLOCKS = [
  {
    unlockId: "legacy.unlock.account.starting_hp",
    label: "Starting HP",
    resourceKey: "hp"
  },
  {
    unlockId: "legacy.unlock.account.starting_stamina",
    label: "Starting Stamina",
    resourceKey: "stamina"
  },
  {
    unlockId: "legacy.unlock.account.starting_coin",
    label: "Starting Coin",
    currencyKey: "silver"
  }
] as const;

export type LegacyCharacterStartBonusResolution = {
  appliedUnlockIds: string[];
  resourceMaxFlat: PlayerPartialResourceVector;
  resourceModifiers: PlayerResourceModifierState[];
  fillResourceIds: PlayerResourceKey[];
  currencyDelta: PlayerCurrencyState;
  sourceLabels: string[];
};

function formatPreparationResourceChoiceLabel(choiceId: PlayerResourceKey): string {
  switch (choiceId) {
    case "hp":
      return "HP";
    case "mp":
      return "MP";
    case "stamina":
      return "Stamina";
  }
}

export function getLegacyPreparationChoiceOptions(
  unlockId: string
): LegacyPreparationChoiceOption[] {
  switch (unlockId) {
    case "legacy.unlock.preparation.martial_legacy":
      return MARTIAL_LEGACY_ATTRIBUTE_CHOICES.map((choiceId) => ({
        id: choiceId,
        label: choiceId
      }));
    case "legacy.unlock.preparation.learned_legacy":
      return LEARNED_LEGACY_ATTRIBUTE_CHOICES.map((choiceId) => ({
        id: choiceId,
        label: choiceId
      }));
    case "legacy.unlock.preparation.vital_legacy":
      return VITAL_LEGACY_RESOURCE_CHOICES.map((choiceId) => ({
        id: choiceId,
        label: formatPreparationResourceChoiceLabel(choiceId)
      }));
    default:
      return [];
  }
}

export function getLegacyPreparationChoiceLabel(
  unlockId: string,
  choiceId: string
): string | null {
  const matched = getLegacyPreparationChoiceOptions(unlockId).find(
    (option) => option.id === choiceId
  );
  return matched?.label ?? null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function assertValidId(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Legacy unlock catalog ${label} must be a non-empty string.`);
  }

  return value;
}

function validateMetadataIdentifier(value: unknown, definitionId: string, field: string): string {
  const identifier = assertValidId(value, `${definitionId}.${field}`);
  if (!LEGACY_METADATA_IDENTIFIER_PATTERN.test(identifier)) {
    throw new Error(`Legacy unlock '${definitionId}' has invalid ${field} '${identifier}'.`);
  }

  return identifier;
}

function validateOptionalEnum<T extends string>(
  value: unknown,
  definitionId: string,
  field: string,
  allowed: ReadonlySet<T>
): T {
  if (typeof value !== "string" || !allowed.has(value as T)) {
    throw new Error(`Legacy unlock '${definitionId}' has invalid ${field} '${String(value)}'.`);
  }

  return value as T;
}

function validateBreakthroughRanks(
  ranks: unknown,
  definitionId: string,
  maxRank: number
): number[] {
  if (!Array.isArray(ranks)) {
    throw new Error(`Legacy unlock '${definitionId}' breakthroughRanks must be an array.`);
  }

  let previousRank = 0;
  return ranks.map((rank) => {
    if (!isPositiveInteger(rank)) {
      throw new Error(`Legacy unlock '${definitionId}' breakthroughRanks must contain positive integers.`);
    }
    if (rank <= previousRank) {
      throw new Error(`Legacy unlock '${definitionId}' breakthroughRanks must be unique and sorted.`);
    }
    if (rank > maxRank) {
      throw new Error(`Legacy unlock '${definitionId}' breakthroughRanks cannot exceed maxRank.`);
    }
    previousRank = rank;
    return rank;
  });
}

function validateRequirement(
  requirement: unknown,
  definitionId: string
): LegacyUnlockRequirementState {
  if (!isRecord(requirement) || typeof requirement.type !== "string") {
    throw new Error(`Legacy unlock '${definitionId}' has an invalid requirement.`);
  }

  switch (requirement.type) {
    case "achievement":
      assertValidId(requirement.achievementId, `${definitionId}.requirement.achievementId`);
      break;
    case "run_count":
      if (!isPositiveInteger(requirement.count)) {
        throw new Error(`Legacy unlock '${definitionId}' run_count requires a positive count.`);
      }
      if (
        requirement.outcome !== undefined &&
        requirement.outcome !== "active" &&
        requirement.outcome !== "retired" &&
        requirement.outcome !== "archived" &&
        requirement.outcome !== "deleted"
      ) {
        throw new Error(`Legacy unlock '${definitionId}' has an invalid run_count outcome.`);
      }
      if (
        requirement.archiveReason !== undefined &&
        requirement.archiveReason !== "retired" &&
        requirement.archiveReason !== "dead" &&
        requirement.archiveReason !== "hardcore_dead"
      ) {
        throw new Error(`Legacy unlock '${definitionId}' has an invalid archive reason.`);
      }
      break;
    case "lineage_recorded":
      assertValidId(requirement.lineageId, `${definitionId}.requirement.lineageId`);
      break;
    case "echo_peak":
      if (!isPositiveInteger(requirement.level)) {
        throw new Error(`Legacy unlock '${definitionId}' echo_peak requires a positive level.`);
      }
      break;
    case "survived_days":
      if (!isPositiveInteger(requirement.days)) {
        throw new Error(`Legacy unlock '${definitionId}' survived_days requires positive days.`);
      }
      break;
    case "lifetime_legacy":
      if (!isPositiveInteger(requirement.amount)) {
        throw new Error(`Legacy unlock '${definitionId}' lifetime_legacy requires a positive amount.`);
      }
      break;
    case "legacy_unlock_rank":
      assertValidId(requirement.unlockId, `${definitionId}.requirement.unlockId`);
      if (!isPositiveInteger(requirement.rank)) {
        throw new Error(`Legacy unlock '${definitionId}' legacy_unlock_rank requires a positive rank.`);
      }
      break;
    case "character_skill":
      assertValidId(requirement.skillId, `${definitionId}.requirement.skillId`);
      if (!isPositiveInteger(requirement.rank)) {
        throw new Error(`Legacy unlock '${definitionId}' character_skill requires a positive rank.`);
      }
      break;
    case "role_rank":
      assertValidId(requirement.roleId, `${definitionId}.requirement.roleId`);
      if (!isPositiveInteger(requirement.rank)) {
        throw new Error(`Legacy unlock '${definitionId}' role_rank requires a positive rank.`);
      }
      break;
    case "wealth":
      if (!isPositiveInteger(requirement.amount)) {
        throw new Error(`Legacy unlock '${definitionId}' wealth requires a positive amount.`);
      }
      break;
    default:
      throw new Error(`Legacy unlock '${definitionId}' has unsupported requirement type '${requirement.type}'.`);
  }

  return requirement as LegacyUnlockRequirementState;
}

function validateCost(cost: unknown, definitionId: string): LegacyUnlockCostState {
  if (!isRecord(cost) || typeof cost.type !== "string") {
    throw new Error(`Legacy unlock '${definitionId}' has an invalid cost model.`);
  }

  switch (cost.type) {
    case "fixed":
      if (!isNonNegativeInteger(cost.amount)) {
        throw new Error(`Legacy unlock '${definitionId}' fixed cost must be non-negative.`);
      }
      break;
    case "per_rank":
      if (
        !Array.isArray(cost.amounts) ||
        cost.amounts.length === 0 ||
        !cost.amounts.every(isNonNegativeInteger)
      ) {
        throw new Error(`Legacy unlock '${definitionId}' per-rank cost must list non-negative amounts.`);
      }
      break;
    case "progressive":
      if (!isNonNegativeInteger(cost.baseAmount) || typeof cost.growthFactor !== "number") {
        throw new Error(`Legacy unlock '${definitionId}' progressive cost is invalid.`);
      }
      if (cost.growthFactor < 1) {
        throw new Error(`Legacy unlock '${definitionId}' progressive growth must be at least 1.`);
      }
      if (
        cost.thresholdJumps !== undefined &&
        (!Array.isArray(cost.thresholdJumps) ||
          !cost.thresholdJumps.every(
            (jump) =>
              isRecord(jump) &&
              isPositiveInteger(jump.rank) &&
              typeof jump.multiplier === "number" &&
              Number.isFinite(jump.multiplier) &&
              jump.multiplier > 0
          ))
      ) {
        throw new Error(`Legacy unlock '${definitionId}' progressive threshold jumps are invalid.`);
      }
      break;
    case "renown_hierarchy":
      if (
        !Array.isArray(cost.supportUnlockIds) ||
        cost.supportUnlockIds.length === 0 ||
        !cost.supportUnlockIds.every(
          (supportUnlockId) =>
            typeof supportUnlockId === "string" && supportUnlockId.trim().length > 0
        )
      ) {
        throw new Error(`Legacy unlock '${definitionId}' renown hierarchy cost requires support unlock ids.`);
      }
      if (
        typeof cost.tierMultiplier !== "number" ||
        !Number.isFinite(cost.tierMultiplier) ||
        cost.tierMultiplier <= 0
      ) {
        throw new Error(`Legacy unlock '${definitionId}' renown hierarchy cost requires a positive multiplier.`);
      }
      if (cost.minimumAmount !== undefined && !isNonNegativeInteger(cost.minimumAmount)) {
        throw new Error(`Legacy unlock '${definitionId}' renown hierarchy minimum must be non-negative.`);
      }
      break;
    default:
      throw new Error(`Legacy unlock '${definitionId}' has unsupported cost type '${cost.type}'.`);
  }

  return cost as LegacyUnlockCostState;
}

function validateEffects(
  effects: unknown,
  definitionId: string,
  field = "effects",
  requireNonEmpty = true
): LegacyUnlockEffectState[] {
  if (!Array.isArray(effects)) {
    throw new Error(`Legacy unlock '${definitionId}' has invalid ${field}.`);
  }
  if (requireNonEmpty && effects.length === 0) {
    throw new Error(`Legacy unlock '${definitionId}' must define at least one metadata effect.`);
  }

  return effects.map((effect) => {
    if (!isRecord(effect) || typeof effect.type !== "string") {
      throw new Error(`Legacy unlock '${definitionId}' has an invalid ${field} entry.`);
    }

    if (!KNOWN_EFFECT_KINDS.has(effect.type as LegacyUnlockEffectKind)) {
      throw new Error(`Legacy unlock '${definitionId}' uses non-metadata effect '${effect.type}'.`);
    }

    assertValidId(effect.key, `${definitionId}.${field}.key`);
    if (
      effect.value !== undefined &&
      typeof effect.value !== "string" &&
      typeof effect.value !== "number" &&
      typeof effect.value !== "boolean"
    ) {
      throw new Error(`Legacy unlock '${definitionId}' has invalid ${field} value.`);
    }
    return effect as unknown as LegacyUnlockEffectState;
  });
}

function validateRenownNode(
  renownNode: unknown,
  definitionId: string
): NonNullable<LegacyUnlockDefinitionState["renownNode"]> {
  if (!isRecord(renownNode)) {
    throw new Error(`Legacy unlock '${definitionId}' has an invalid Renown node.`);
  }

  if (!KNOWN_RENOWN_TIERS.has(renownNode.tier as LegacyRenownTier)) {
    throw new Error(`Legacy unlock '${definitionId}' has an invalid Renown tier.`);
  }

  const nodeId = assertValidId(renownNode.nodeId, `${definitionId}.renownNode.nodeId`);
  const node: NonNullable<LegacyUnlockDefinitionState["renownNode"]> = {
    tier: renownNode.tier as LegacyRenownTier,
    nodeId
  };

  if (renownNode.parentNodeId !== undefined) {
    node.parentNodeId = assertValidId(
      renownNode.parentNodeId,
      `${definitionId}.renownNode.parentNodeId`
    );
  }

  if (renownNode.supportUnlockIds !== undefined) {
    if (
      !Array.isArray(renownNode.supportUnlockIds) ||
      !renownNode.supportUnlockIds.every(
        (supportUnlockId) =>
          typeof supportUnlockId === "string" && supportUnlockId.trim().length > 0
      )
    ) {
      throw new Error(`Legacy unlock '${definitionId}' Renown support unlock ids are invalid.`);
    }

    node.supportUnlockIds = [...renownNode.supportUnlockIds];
  }

  if (renownNode.displayName !== undefined) {
    node.displayName = assertValidId(
      renownNode.displayName,
      `${definitionId}.renownNode.displayName`
    );
  }

  return node;
}

function normalizeMaxRank(
  definition: Pick<LegacyUnlockDefinitionState, "kind" | "maxRank" | "cost">
): number {
  if (definition.kind === "binary") {
    return 1;
  }

  if (isPositiveInteger(definition.maxRank)) {
    return definition.maxRank;
  }

  if (definition.cost.type === "per_rank") {
    return definition.cost.amounts.length;
  }

  return 1;
}

function validateDefinition(record: unknown): LegacyUnlockDefinitionState {
  if (!isRecord(record)) {
    throw new Error("Legacy unlock catalog records must be objects.");
  }

  const id = assertValidId(record.id, "record.id");
  if (!KNOWN_CATEGORIES.has(record.category as LegacyUnlockCategory)) {
    throw new Error(`Legacy unlock '${id}' has invalid category '${String(record.category)}'.`);
  }
  if (!KNOWN_KINDS.has(record.kind as LegacyUnlockKind)) {
    throw new Error(`Legacy unlock '${id}' has invalid kind '${String(record.kind)}'.`);
  }
  if (
    record.classification !== undefined &&
    !KNOWN_CLASSIFICATIONS.has(record.classification as LegacyUnlockClassification)
  ) {
    throw new Error(`Legacy unlock '${id}' has invalid classification '${String(record.classification)}'.`);
  }

  const cost = validateCost(record.cost, id);
  const effects = validateEffects(record.effects, id);
  const definition: LegacyUnlockDefinitionState = {
    id,
    category: record.category as LegacyUnlockCategory,
    kind: record.kind as LegacyUnlockKind,
    title: assertValidId(record.title, `${id}.title`),
    description: assertValidId(record.description, `${id}.description`),
    cost,
    effects,
    ...(record.classification !== undefined
      ? { classification: record.classification as LegacyUnlockClassification }
      : {}),
    ...(isPositiveInteger(record.maxRank) ? { maxRank: record.maxRank } : {})
  };

  const maxRank = normalizeMaxRank(definition);
  if (definition.kind !== "binary" && maxRank <= 1) {
    throw new Error(`Legacy unlock '${id}' ranked unlocks require maxRank greater than 1.`);
  }
  if (definition.kind === "binary" && record.maxRank !== undefined && record.maxRank !== 1) {
    throw new Error(`Legacy unlock '${id}' binary unlocks cannot define multiple ranks.`);
  }
  if (definition.cost.type === "per_rank" && definition.cost.amounts.length < maxRank) {
    throw new Error(`Legacy unlock '${id}' lacks explicit per-rank costs through maxRank.`);
  }

  if (record.track !== undefined) {
    definition.track = validateMetadataIdentifier(record.track, id, "track");
  }
  if (record.purchaseMode !== undefined) {
    definition.purchaseMode = validateOptionalEnum(
      record.purchaseMode,
      id,
      "purchaseMode",
      KNOWN_PURCHASE_MODES
    );
  }
  if (record.currency !== undefined) {
    definition.currency = validateOptionalEnum(
      record.currency,
      id,
      "currency",
      KNOWN_LEGACY_CURRENCIES
    );
  }
  if (record.scope !== undefined) {
    definition.scope = validateOptionalEnum(record.scope, id, "scope", KNOWN_LEGACY_SCOPES);
  }
  if (record.duration !== undefined) {
    definition.duration = validateOptionalEnum(
      record.duration,
      id,
      "duration",
      KNOWN_LEGACY_DURATIONS
    );
  }
  if (record.breakthroughRanks !== undefined) {
    definition.breakthroughRanks = validateBreakthroughRanks(
      record.breakthroughRanks,
      id,
      maxRank
    );
  }
  if (record.breakthroughEffect !== undefined) {
    definition.breakthroughEffect = validateEffects(
      record.breakthroughEffect,
      id,
      "breakthroughEffect",
      false
    );
  }
  if (record.repeatable !== undefined) {
    if (typeof record.repeatable !== "boolean") {
      throw new Error(`Legacy unlock '${id}' has invalid repeatable value.`);
    }
    definition.repeatable = record.repeatable;
  }
  if (record.implementationPriority !== undefined) {
    definition.implementationPriority = validateOptionalEnum(
      record.implementationPriority,
      id,
      "implementationPriority",
      KNOWN_IMPLEMENTATION_PRIORITIES
    );
  }

  if (Array.isArray(record.requirements)) {
    definition.requirements = record.requirements.map((requirement) =>
      validateRequirement(requirement, id)
    );
  }

  if (Array.isArray(record.rankRequirements)) {
    definition.rankRequirements = record.rankRequirements.map((requirements, index) => {
      if (!Array.isArray(requirements)) {
        throw new Error(`Legacy unlock '${id}' rank ${index + 1} requirements are invalid.`);
      }

      return requirements.map((requirement) => validateRequirement(requirement, id));
    });
  }

  if (Array.isArray(record.tags)) {
    definition.tags = record.tags.filter((tag): tag is string => typeof tag === "string");
  }

  if (record.renownNode !== undefined) {
    definition.renownNode = validateRenownNode(record.renownNode, id);
  }

  return definition;
}

export function validateLegacyUnlockDefinitions(
  records: unknown,
  scopeLabel = "legacy_unlocks.json"
): LegacyUnlockDefinitionState[] {
  if (!Array.isArray(records)) {
    throw new Error(`${scopeLabel} must contain a records array.`);
  }

  const seen = new Set<string>();
  return records.map((record) => {
    const definition = validateDefinition(record);
    if (seen.has(definition.id)) {
      throw new Error(`${scopeLabel} contains duplicate legacy unlock id '${definition.id}'.`);
    }
    seen.add(definition.id);
    return definition;
  });
}

let cachedDefinitions: LegacyUnlockDefinitionState[] | null = null;

export function getLegacyUnlockDefinitions(): LegacyUnlockDefinitionState[] {
  if (cachedDefinitions === null) {
    const catalog = legacyUnlockCatalog as { records?: unknown };
    cachedDefinitions = validateLegacyUnlockDefinitions(catalog.records ?? [], "legacy_unlocks.json");
  }

  return cachedDefinitions.map((definition) => ({
    ...definition,
    effects: definition.effects.map((effect) => ({ ...effect })),
    ...(definition.requirements
      ? { requirements: definition.requirements.map((requirement) => ({ ...requirement })) }
      : {}),
    ...(definition.rankRequirements
      ? {
          rankRequirements: definition.rankRequirements.map((requirements) =>
            requirements.map((requirement) => ({ ...requirement }))
          )
        }
      : {}),
    ...(definition.renownNode
      ? {
          renownNode: {
            ...definition.renownNode,
            ...(definition.renownNode.supportUnlockIds
              ? { supportUnlockIds: [...definition.renownNode.supportUnlockIds] }
              : {})
          }
        }
      : {}),
    ...(definition.breakthroughRanks
      ? { breakthroughRanks: [...definition.breakthroughRanks] }
      : {}),
    ...(definition.breakthroughEffect
      ? { breakthroughEffect: definition.breakthroughEffect.map((effect) => ({ ...effect })) }
      : {}),
    ...(definition.tags ? { tags: [...definition.tags] } : {})
  }));
}

export function getLegacyUnlockDefinitionById(
  unlockId: string
): LegacyUnlockDefinitionState | null {
  return getLegacyUnlockDefinitions().find((definition) => definition.id === unlockId) ?? null;
}

function categorySortIndex(category: LegacyUnlockCategory): number {
  const index = CATEGORY_ORDER.indexOf(category);
  return index === -1 ? CATEGORY_ORDER.length : index;
}

function getStoredUnlock(
  profile: Pick<AccountProfileState, "legacy">,
  unlockId: string
): LegacyUnlockState | null {
  return profile.legacy.legacyUnlocks.find((entry) => entry.unlockId === unlockId) ?? null;
}

function getCurrentRank(
  unlock: LegacyUnlockState | null,
  definition: LegacyUnlockDefinitionState
): number {
  if (!unlock) {
    return 0;
  }

  if (definition.kind === "binary") {
    return 1;
  }

  const maxRank = normalizeMaxRank(definition);
  const rawRank = unlock.rank ?? 1;
  return Math.min(maxRank, Math.max(1, Math.trunc(rawRank)));
}

function resolveFlatCost(cost: LegacyUnlockCostState, nextRank: number): number | null {
  if (cost.type === "per_rank") {
    return cost.amounts[nextRank - 1] ?? null;
  }

  if (cost.type === "fixed") {
    return cost.amount;
  }

  if (cost.type === "renown_hierarchy") {
    return null;
  }

  let multiplier = 1;
  for (const jump of cost.thresholdJumps ?? []) {
    if (nextRank >= jump.rank) {
      multiplier *= jump.multiplier;
    }
  }

  return Math.max(0, Math.ceil(cost.baseAmount * cost.growthFactor ** (nextRank - 1) * multiplier));
}

function resolveDefinitionCostAtRank(
  definition: LegacyUnlockDefinitionState,
  rank: number,
  definitionsById: Map<string, LegacyUnlockDefinitionState>,
  activePath = new Set<string>()
): number | null {
  if (rank <= 0) {
    return null;
  }

  if (definition.cost.type !== "renown_hierarchy") {
    return resolveFlatCost(definition.cost, rank);
  }

  const pathKey = `${definition.id}:${rank}`;
  if (activePath.has(pathKey)) {
    return null;
  }

  activePath.add(pathKey);
  let supportInvestment = 0;

  for (const supportUnlockId of definition.cost.supportUnlockIds) {
    const supportDefinition = definitionsById.get(supportUnlockId);
    if (!supportDefinition) {
      activePath.delete(pathKey);
      return null;
    }

    const supportCost = resolveDefinitionCumulativeCost(
      supportDefinition,
      rank,
      definitionsById,
      activePath
    );
    if (supportCost === null) {
      activePath.delete(pathKey);
      return null;
    }

    supportInvestment += supportCost;
  }

  activePath.delete(pathKey);
  return Math.max(
    definition.cost.minimumAmount ?? 0,
    Math.ceil(supportInvestment * definition.cost.tierMultiplier)
  );
}

function resolveDefinitionCumulativeCost(
  definition: LegacyUnlockDefinitionState,
  rank: number,
  definitionsById: Map<string, LegacyUnlockDefinitionState>,
  activePath = new Set<string>()
): number | null {
  const cappedRank = Math.min(rank, normalizeMaxRank(definition));
  let total = 0;

  for (let currentRank = 1; currentRank <= cappedRank; currentRank += 1) {
    const cost = resolveDefinitionCostAtRank(
      definition,
      currentRank,
      definitionsById,
      activePath
    );
    if (cost === null) {
      return null;
    }

    total += cost;
  }

  return total;
}

function resolveNextCost(
  definition: LegacyUnlockDefinitionState,
  nextRank: number | null,
  definitionsById: Map<string, LegacyUnlockDefinitionState>
): number | null {
  if (nextRank === null) {
    return null;
  }

  return resolveDefinitionCostAtRank(definition, nextRank, definitionsById);
}

function countMatchingRuns(
  records: AccountRunHistoryRecord[],
  outcome?: AccountRunHistoryOutcome,
  archiveReason?: AccountRunArchiveReason
): number {
  return records.filter((record) => {
    if (record.outcome === "deleted") {
      return false;
    }

    if (outcome !== undefined && record.outcome !== outcome) {
      return false;
    }

    if (archiveReason !== undefined && record.archiveReason !== archiveReason) {
      return false;
    }

    return true;
  }).length;
}

function formatRomanNumeral(value: number): string {
  switch (value) {
    case 1:
      return "I";
    case 2:
      return "II";
    case 3:
      return "III";
    case 4:
      return "IV";
    case 5:
      return "V";
    default:
      return String(value);
  }
}

function fallbackTitleFromId(value: string): string {
  const segments = value.split(".");
  const lastSegment = segments.length > 0 ? (segments[segments.length - 1] ?? value) : value;
  const words = lastSegment.split(/[_-]+/).filter((word) => word.length > 0);
  return words.length === 0
    ? "Legacy"
    : words.map((word) => `${word[0]?.toUpperCase() ?? ""}${word.slice(1)}`).join(" ");
}

function formatRequirementLabel(
  requirement: LegacyUnlockRequirementState,
  definitionsById?: Map<string, LegacyUnlockDefinitionState>
): string {
  switch (requirement.type) {
    case "achievement":
      return `Requires Chronicle ${requirement.achievementId}`;
    case "run_count": {
      const archiveLabel = requirement.archiveReason ? ` ${requirement.archiveReason}` : "";
      const outcomeLabel = requirement.outcome ? ` ${requirement.outcome}` : "";
      return `Requires ${requirement.count}${archiveLabel}${outcomeLabel} run${
        requirement.count === 1 ? "" : "s"
      }`;
    }
    case "lineage_recorded":
      return `Requires recorded lineage ${requirement.lineageId}`;
    case "echo_peak":
      return `Requires Echo Peak ${requirement.level}`;
    case "survived_days":
      return `Requires ${requirement.days} survived day${requirement.days === 1 ? "" : "s"}`;
    case "lifetime_legacy":
      return `Requires ${requirement.amount} lifetime Prestige`;
    case "legacy_unlock_rank": {
      const requiredDefinition = definitionsById?.get(requirement.unlockId);
      const title = requiredDefinition?.title ?? fallbackTitleFromId(requirement.unlockId);
      return `Requires ${title} Tier ${formatRomanNumeral(requirement.rank)}`;
    }
    case "character_skill":
      return `${fallbackTitleFromId(requirement.skillId)} rank ${requirement.rank}`;
    case "role_rank":
      return `${fallbackTitleFromId(requirement.roleId)} rank ${requirement.rank}`;
    case "wealth":
      return `${requirement.amount} wealth`;
  }
}

function resolveRequirement(
  profile: AccountProfileState,
  requirement: LegacyUnlockRequirementState,
  definitionsById: Map<string, LegacyUnlockDefinitionState>
): LegacyUnlockRequirementResult {
  let state: LegacyUnlockRequirementResolutionState;

  switch (requirement.type) {
    case "achievement":
      state = profile.achievements.unlocked.some(
        (entry) => entry.achievementId === requirement.achievementId
      )
        ? "eligible"
        : "unmet";
      break;
    case "run_count":
      state =
        countMatchingRuns(
          profile.history.runRecords,
          requirement.outcome,
          requirement.archiveReason
        ) >= requirement.count
          ? "eligible"
          : "unmet";
      break;
    case "lineage_recorded":
      state = profile.history.runRecords.some(
        (record) => record.outcome !== "deleted" && record.lineageId === requirement.lineageId
      )
        ? "eligible"
        : "unmet";
      break;
    case "echo_peak":
      state =
        Math.max(
          0,
          ...profile.history.runRecords
            .filter((record) => record.outcome !== "deleted")
            .map((record) => record.echoLevelReached)
        ) >= requirement.level
          ? "eligible"
          : "unmet";
      break;
    case "survived_days":
      state =
        Math.max(
          0,
          ...profile.history.runRecords
            .filter((record) => record.outcome !== "deleted")
            .map((record) => record.survivedDays ?? 0)
        ) >= requirement.days
          ? "eligible"
          : "unmet";
      break;
    case "lifetime_legacy":
      state = profile.legacy.lifetimeLegacyEarned >= requirement.amount ? "eligible" : "unmet";
      break;
    case "legacy_unlock_rank": {
      const requiredDefinition = definitionsById.get(requirement.unlockId);
      if (!requiredDefinition) {
        state = "unsupported";
        break;
      }

      const requiredUnlock = getStoredUnlock(profile, requirement.unlockId);
      state =
        getCurrentRank(requiredUnlock, requiredDefinition) >= requirement.rank
          ? "eligible"
          : "unmet";
      break;
    }
    default:
      state = FUTURE_REQUIREMENT_TYPES.has(requirement.type) ? "unsupported" : "unsupported";
      break;
  }

  return {
    requirement,
    state,
    label: formatRequirementLabel(requirement, definitionsById)
  };
}

function getRequirementsForRank(
  definition: LegacyUnlockDefinitionState,
  nextRank: number | null
): LegacyUnlockRequirementState[] {
  const baseRequirements = definition.requirements ?? [];
  if (nextRank === null) {
    return baseRequirements;
  }

  const rankRequirements = definition.rankRequirements?.[nextRank - 1] ?? [];
  return [...baseRequirements, ...rankRequirements];
}

function resolveClassification(
  definition: LegacyUnlockDefinitionState
): LegacyUnlockResolvedClassification {
  if (definition.classification === "preparation") {
    return "preparation";
  }

  return definition.kind === "binary" ? "permanent" : "tiered_permanent";
}

function resolveRenownSupportRequirement(
  profile: AccountProfileState,
  definition: LegacyUnlockDefinitionState,
  nextRank: number | null,
  definitionsById: Map<string, LegacyUnlockDefinitionState>
): LegacyUnlockRequirementResult[] {
  const supportUnlockIds =
    definition.renownNode?.supportUnlockIds ??
    (definition.cost.type === "renown_hierarchy" ? definition.cost.supportUnlockIds : []);

  if (nextRank === null || supportUnlockIds.length === 0) {
    return [];
  }

  const hasUnknownSupport = supportUnlockIds.some(
    (supportUnlockId) => !definitionsById.has(supportUnlockId)
  );
  const supportSatisfied =
    !hasUnknownSupport &&
    supportUnlockIds.every((supportUnlockId) => {
      const supportDefinition = definitionsById.get(supportUnlockId);
      if (!supportDefinition) {
        return false;
      }

      const storedUnlock = getStoredUnlock(profile, supportUnlockId);
      return getCurrentRank(storedUnlock, supportDefinition) >= nextRank;
    });

  return [
    {
      requirement: {
        type: "legacy_unlock_rank",
        unlockId: supportUnlockIds[0] ?? definition.id,
        rank: nextRank
      },
      state: hasUnknownSupport ? "unsupported" : supportSatisfied ? "eligible" : "unmet",
      label: `All supporting Renown must reach Tier ${formatRomanNumeral(nextRank)}`
    }
  ];
}

function resolveDefinitionState(
  profile: AccountProfileState,
  definition: LegacyUnlockDefinitionState,
  definitionsById: Map<string, LegacyUnlockDefinitionState>
): LegacyUnlockResolvedState {
  const storedUnlock = getStoredUnlock(profile, definition.id);
  const maxRank = normalizeMaxRank(definition);
  const currentRank = getCurrentRank(storedUnlock, definition);
  const nextRank = currentRank >= maxRank ? null : currentRank + 1;
  const requirementResults = [
    ...getRequirementsForRank(definition, nextRank).map((requirement) =>
      resolveRequirement(profile, requirement, definitionsById)
    ),
    ...resolveRenownSupportRequirement(profile, definition, nextRank, definitionsById)
  ];
  const eligible = requirementResults.every((result) => result.state === "eligible");
  const nextCost = resolveNextCost(definition, nextRank, definitionsById);
  const affordability: LegacyUnlockAffordability =
    nextCost === null ? "no_cost" : profile.legacy.legacyPoints >= nextCost ? "affordable" : "unaffordable";
  const state: LegacyUnlockOwnershipState =
    nextRank === null ? "maxed" : currentRank > 0 ? "unlocked" : "locked";
  const unsupported = requirementResults.some((result) => result.state === "unsupported");
  const canPurchase = nextRank !== null && eligible && affordability === "affordable";
  const purchaseBlockedReason =
    nextRank === null
      ? "Maximum rank reached"
      : unsupported
        ? "Requirement not supported yet"
        : !eligible
          ? "Requirements unmet"
          : nextCost === null
            ? "Prestige cost unavailable"
            : affordability !== "affordable"
            ? "Insufficient Prestige"
            : null;

  return {
    id: definition.id,
    definition,
    category: definition.category,
    kind: definition.kind,
    classification: resolveClassification(definition),
    title: definition.title,
    description: definition.description,
    currentRank,
    nextRank,
    maxRank,
    isOwned: currentRank > 0,
    isKnown: true,
    state,
    nextCost,
    eligible,
    affordability,
    requirementResults,
    effects: definition.effects.map((effect) => ({ ...effect })),
    renownTier: definition.renownNode?.tier ?? null,
    renownNodeId: definition.renownNode?.nodeId ?? null,
    renownParentNodeId: definition.renownNode?.parentNodeId ?? null,
    renownDisplayName: definition.renownNode?.displayName ?? null,
    renownSupportUnlockIds: [...(definition.renownNode?.supportUnlockIds ?? [])],
    canPurchase,
    purchaseBlockedReason
  };
}

function conservativeLabel(value: string): string {
  const segments = value.split(".");
  const lastSegment = segments.length > 0 ? (segments[segments.length - 1] ?? value) : value;
  const words = lastSegment.split(/[_-]+/).filter((word) => word.length > 0);

  if (words.length === 0 || words.length > 4 || lastSegment.length > 28) {
    return "Historical Unlock";
  }

  if (words.some((word) => word.length > 16)) {
    return "Historical Unlock";
  }

  return words.map((word) => `${word[0]?.toUpperCase() ?? ""}${word.slice(1)}`).join(" ");
}

function resolveUnknownUnlockState(unlock: LegacyUnlockState): LegacyUnlockResolvedState {
  return {
    id: unlock.unlockId,
    definition: null,
    category: "Chronicle",
    kind: "binary",
    classification: "permanent",
    title: conservativeLabel(unlock.unlockId),
    description: "Historical account unlock preserved from earlier data.",
    currentRank: 1,
    nextRank: null,
    maxRank: 1,
    isOwned: true,
    isKnown: false,
    state: "maxed",
    nextCost: null,
    eligible: true,
    affordability: "no_cost",
    requirementResults: [],
    effects: [],
    renownTier: null,
    renownNodeId: null,
    renownParentNodeId: null,
    renownDisplayName: null,
    renownSupportUnlockIds: [],
    canPurchase: false,
    purchaseBlockedReason: "Historical unlock"
  };
}

export function resolveLegacyUnlockStates(
  profile: AccountProfileState
): LegacyUnlockResolvedState[] {
  const definitions = getLegacyUnlockDefinitions();
  const definitionsById = new Map(definitions.map((definition) => [definition.id, definition]));
  const definitionIds = new Set(definitions.map((definition) => definition.id));
  const knownStates = definitions.map((definition) =>
    resolveDefinitionState(profile, definition, definitionsById)
  );
  const unknownStates = profile.legacy.legacyUnlocks
    .filter((unlock) => !definitionIds.has(unlock.unlockId))
    .map(resolveUnknownUnlockState);

  return [...knownStates, ...unknownStates].sort((left, right) => {
    const categoryDelta = categorySortIndex(left.category) - categorySortIndex(right.category);
    if (categoryDelta !== 0) {
      return categoryDelta;
    }

    if (left.state !== right.state) {
      return left.state === "maxed" || left.state === "unlocked" ? -1 : 1;
    }

    return left.title.localeCompare(right.title);
  });
}

function resolveRenownMatch(
  states: LegacyUnlockResolvedState[],
  tier: "settlement" | "region" | "continent",
  nodeId: string | null | undefined
): LegacyRenownMatchState | null {
  if (!nodeId) {
    return null;
  }

  const match = states.find(
    (entry) =>
      entry.isKnown &&
      entry.currentRank > 0 &&
      entry.renownTier === tier &&
      entry.renownNodeId === nodeId
  );

  if (!match) {
    return null;
  }

  return {
    tier,
    nodeId,
    displayName: match.renownDisplayName ?? fallbackTitleFromId(nodeId),
    rank: match.currentRank
  };
}

function resolveRenownFlavorFlags(
  states: LegacyUnlockResolvedState[]
): LegacyRenownFlavorFlags {
  const getRank = (unlockId: string): number =>
    states.find((entry) => entry.id === unlockId && entry.isKnown)?.currentRank ?? 0;

  return {
    villageName: getRank(RENOWN_FLAVOR_UNLOCK_IDS.villageName) > 0,
    bannerRightsRank: getRank(RENOWN_FLAVOR_UNLOCK_IDS.bannerRights),
    veteranReputation: getRank(RENOWN_FLAVOR_UNLOCK_IDS.veteranReputation) > 0
  };
}

export function resolveLegacyRenownPresence(
  profile: AccountProfileState,
  geography: {
    settlementId?: string | null;
    regionId?: string | null;
    continentId?: string | null;
  }
): LegacyRenownPresenceState {
  const states = resolveLegacyUnlockStates(profile);
  const settlement = resolveRenownMatch(states, "settlement", geography.settlementId);
  const region = resolveRenownMatch(states, "region", geography.regionId);
  const continent = resolveRenownMatch(states, "continent", geography.continentId);
  const universalRank = states.reduce((highest, entry) => {
    if (!entry.isKnown || entry.currentRank <= 0 || entry.renownTier !== "universal") {
      return highest;
    }

    return Math.max(highest, entry.currentRank);
  }, 0);
  const activeTiers: LegacyRenownTier[] = [];

  if (settlement) {
    activeTiers.push("settlement");
  }
  if (region) {
    activeTiers.push("region");
  }
  if (continent) {
    activeTiers.push("continent");
  }
  if (universalRank > 0) {
    activeTiers.push("universal");
  }

  return {
    settlement,
    region,
    continent,
    universalRank,
    activeTiers,
    primaryTier:
      settlement?.tier ??
      region?.tier ??
      continent?.tier ??
      (universalRank > 0 ? "universal" : null),
    flavorFlags: resolveRenownFlavorFlags(states)
  };
}

export function resolveLegacyPreparationCapacity(profile: AccountProfileState): number {
  return resolveLegacyUnlockStates(profile).reduce((total, entry) => {
    if (!entry.isKnown || entry.currentRank <= 0) {
      return total;
    }

    return (
      total +
      entry.effects.reduce((effectTotal, effect) => {
        if (effect.type !== "preparation_capacity") {
          return effectTotal;
        }

        const rawValue = typeof effect.value === "number" ? effect.value : 1;
        const value = Math.max(0, Math.trunc(rawValue));
        return effectTotal + value * entry.currentRank;
      }, 0)
    );
  }, 0);
}

function createEmptyLegacyCharacterStartBonusResolution(): LegacyCharacterStartBonusResolution {
  return {
    appliedUnlockIds: [],
    resourceMaxFlat: {},
    resourceModifiers: [],
    fillResourceIds: [],
    currencyDelta: { gold: 0, silver: 0, copper: 0 },
    sourceLabels: []
  };
}

function isLiveAccountCharacterStartDefinition(
  definition: LegacyUnlockDefinitionState
): boolean {
  return (
    definition.classification === "permanent" &&
    definition.purchaseMode === "permanent" &&
    definition.currency === "account_legacy" &&
    definition.scope === "character_start" &&
    definition.duration === "permanent" &&
    definition.implementationPriority === "live"
  );
}

export function resolveLegacyCharacterStartBonuses(
  profile?: AccountProfileState | null
): LegacyCharacterStartBonusResolution {
  const resolution = createEmptyLegacyCharacterStartBonusResolution();

  if (!profile) {
    return resolution;
  }

  for (const bonus of LEGACY_CHARACTER_START_BONUS_UNLOCKS) {
    const definition = getLegacyUnlockDefinitionById(bonus.unlockId);

    if (!definition || !isLiveAccountCharacterStartDefinition(definition)) {
      continue;
    }

    const rank = getCurrentRank(getStoredUnlock(profile, bonus.unlockId), definition);

    if (rank <= 0) {
      continue;
    }

    resolution.appliedUnlockIds.push(bonus.unlockId);
    resolution.sourceLabels.push(
      "resourceKey" in bonus
        ? `${bonus.label} +${rank}`
        : `${bonus.label} +${rank} silver`
    );

    if ("resourceKey" in bonus) {
      const maxFlat: PlayerPartialResourceVector = {
        [bonus.resourceKey]: rank
      };

      resolution.resourceMaxFlat[bonus.resourceKey] =
        (resolution.resourceMaxFlat[bonus.resourceKey] ?? 0) + rank;
      resolution.resourceModifiers.push({
        id: `legacy.account.${bonus.resourceKey}`,
        label: bonus.label,
        sourceType: "system",
        sourceId: bonus.unlockId,
        maxFlat,
        maxPercent: {},
        tickDeltaFlat: {},
        notes: ["Permanent account Legacy applied at character creation."]
      });
      resolution.fillResourceIds.push(bonus.resourceKey);
      continue;
    }

    resolution.currencyDelta = {
      ...resolution.currencyDelta,
      [bonus.currencyKey]: resolution.currencyDelta[bonus.currencyKey] + rank
    };
  }

  return resolution;
}

export function isLegacyPreparationChoiceRequired(unlockId: string): boolean {
  return CHOICE_REQUIRED_PREPARATION_IDS.has(unlockId);
}

function getSelectablePreparationState(
  profile: AccountProfileState,
  unlockId: string
): LegacyUnlockResolvedState | null {
  const entry = resolveLegacyUnlockStates(profile).find((state) => state.id === unlockId);

  if (
    !entry ||
    !entry.isKnown ||
    entry.classification !== "preparation" ||
    entry.currentRank <= 0
  ) {
    return null;
  }

  return entry;
}

function withSelectedPreparationState(
  profile: AccountProfileState,
  selectedPreparationUnlockIds: string[],
  selectedPreparationChoicePayloads: Record<string, string>
): AccountProfileState {
  return {
    ...profile,
    legacy: {
      ...profile.legacy,
      selectedPreparationUnlockIds,
      selectedPreparationChoicePayloads
    }
  };
}

export function resolveLegacyPreparationSelection(
  profile: AccountProfileState
): LegacyPreparationSelectionResolution {
  const capacity = Math.max(0, Math.trunc(resolveLegacyPreparationCapacity(profile)));
  const rawSelectedIds = Array.isArray(profile.legacy.selectedPreparationUnlockIds)
    ? profile.legacy.selectedPreparationUnlockIds
    : [];
  const rawSelectedChoicePayloads =
    typeof profile.legacy.selectedPreparationChoicePayloads === "object" &&
    profile.legacy.selectedPreparationChoicePayloads !== null
      ? profile.legacy.selectedPreparationChoicePayloads
      : {};
  const seen = new Set<string>();
  const selectedUnlockIds: string[] = [];
  const selectedChoicePayloads: Record<string, string> = {};
  const droppedInvalidUnlockIds: string[] = [];

  for (const rawUnlockId of rawSelectedIds) {
    if (typeof rawUnlockId !== "string") {
      continue;
    }

    if (seen.has(rawUnlockId)) {
      droppedInvalidUnlockIds.push(rawUnlockId);
      continue;
    }

    seen.add(rawUnlockId);

    const entry = getSelectablePreparationState(profile, rawUnlockId);

    if (!entry) {
      droppedInvalidUnlockIds.push(rawUnlockId);
      continue;
    }

    if (isLegacyPreparationChoiceRequired(rawUnlockId)) {
      const rawChoicePayload = rawSelectedChoicePayloads[rawUnlockId];

      if (typeof rawChoicePayload !== "string") {
        droppedInvalidUnlockIds.push(rawUnlockId);
        continue;
      }

      const normalizedChoicePayload = rawChoicePayload.trim();
      const choiceOptions = getLegacyPreparationChoiceOptions(rawUnlockId);

      if (
        !normalizedChoicePayload ||
        choiceOptions.length === 0 ||
        !choiceOptions.some((option) => option.id === normalizedChoicePayload)
      ) {
        droppedInvalidUnlockIds.push(rawUnlockId);
        continue;
      }

      selectedChoicePayloads[rawUnlockId] = normalizedChoicePayload;
    }

    selectedUnlockIds.push(rawUnlockId);
  }

  const resolvedSelectedUnlockIds = selectedUnlockIds.slice(0, capacity);
  const droppedExcessUnlockIds = selectedUnlockIds.slice(capacity);
  const resolvedSelectedChoicePayloads = Object.fromEntries(
    Object.entries(selectedChoicePayloads).filter(([unlockId]) =>
      resolvedSelectedUnlockIds.includes(unlockId)
    )
  );
  const choiceRequiredUnlockIds = resolveLegacyUnlockStates(profile)
    .filter(
      (entry) =>
        entry.isKnown &&
        entry.classification === "preparation" &&
        entry.currentRank > 0 &&
        isLegacyPreparationChoiceRequired(entry.id)
    )
    .map((entry) => entry.id);
  const incompleteChoiceUnlockIds = choiceRequiredUnlockIds.filter(
    (unlockId) =>
      getLegacyPreparationChoiceOptions(unlockId).length > 0 &&
      !resolvedSelectedUnlockIds.includes(unlockId)
  );

  return {
    capacity,
    selectedUnlockIds: resolvedSelectedUnlockIds,
    selectedChoicePayloads: resolvedSelectedChoicePayloads,
    droppedInvalidUnlockIds,
    droppedExcessUnlockIds,
    incompleteChoiceUnlockIds,
    choiceRequiredUnlockIds
  };
}

export function selectLegacyPreparation(
  profile: AccountProfileState,
  unlockId: string
): LegacyPreparationSelectionSuccess | LegacyPreparationSelectionFailure {
  const entry = resolveLegacyUnlockStates(profile).find((state) => state.id === unlockId);

  if (!entry || !entry.isKnown) {
    return {
      ok: false,
      profile,
      error: "unknown_unlock"
    };
  }

  if (entry.classification !== "preparation") {
    return {
      ok: false,
      profile,
      error: "not_preparation"
    };
  }

  if (entry.currentRank <= 0) {
    return {
      ok: false,
      profile,
      error: "not_owned"
    };
  }

  if (isLegacyPreparationChoiceRequired(entry.id)) {
    return {
      ok: false,
      profile,
      error: "choice_required"
    };
  }

  const resolution = resolveLegacyPreparationSelection(profile);

  if (resolution.selectedUnlockIds.includes(unlockId)) {
    return {
      ok: false,
      profile,
      error: "duplicate_selection"
    };
  }

  if (resolution.selectedUnlockIds.length >= resolution.capacity) {
    return {
      ok: false,
      profile,
      error: "capacity_full"
    };
  }

  const selectedPreparationUnlockIds = [...resolution.selectedUnlockIds, unlockId];

  return {
    ok: true,
    profile: withSelectedPreparationState(
      profile,
      selectedPreparationUnlockIds,
      resolution.selectedChoicePayloads
    ),
    selectedPreparationUnlockIds,
    selectedPreparationChoicePayloads: resolution.selectedChoicePayloads
  };
}

export function setLegacyPreparationChoice(
  profile: AccountProfileState,
  unlockId: string,
  choiceId: string
): LegacyPreparationSelectionSuccess | LegacyPreparationSelectionFailure {
  const entry = resolveLegacyUnlockStates(profile).find((state) => state.id === unlockId);

  if (!entry || !entry.isKnown) {
    return {
      ok: false,
      profile,
      error: "unknown_unlock"
    };
  }

  if (entry.classification !== "preparation") {
    return {
      ok: false,
      profile,
      error: "not_preparation"
    };
  }

  if (entry.currentRank <= 0) {
    return {
      ok: false,
      profile,
      error: "not_owned"
    };
  }

  if (!isLegacyPreparationChoiceRequired(entry.id)) {
    return {
      ok: false,
      profile,
      error: "invalid_choice"
    };
  }

  const choiceOptions = getLegacyPreparationChoiceOptions(entry.id);

  if (choiceOptions.length === 0) {
    return {
      ok: false,
      profile,
      error: "selection_unavailable"
    };
  }

  const normalizedChoiceId = choiceId.trim();

  if (!choiceOptions.some((option) => option.id === normalizedChoiceId)) {
    return {
      ok: false,
      profile,
      error: "invalid_choice"
    };
  }

  const resolution = resolveLegacyPreparationSelection(profile);
  const isAlreadySelected = resolution.selectedUnlockIds.includes(unlockId);

  if (!isAlreadySelected && resolution.selectedUnlockIds.length >= resolution.capacity) {
    return {
      ok: false,
      profile,
      error: "capacity_full"
    };
  }

  const selectedPreparationUnlockIds = isAlreadySelected
    ? [...resolution.selectedUnlockIds]
    : [...resolution.selectedUnlockIds, unlockId];
  const selectedPreparationChoicePayloads = {
    ...resolution.selectedChoicePayloads,
    [unlockId]: normalizedChoiceId
  };

  return {
    ok: true,
    profile: withSelectedPreparationState(
      profile,
      selectedPreparationUnlockIds,
      selectedPreparationChoicePayloads
    ),
    selectedPreparationUnlockIds,
    selectedPreparationChoicePayloads
  };
}

export function removeLegacyPreparation(
  profile: AccountProfileState,
  unlockId: string
): LegacyPreparationSelectionSuccess {
  const resolution = resolveLegacyPreparationSelection(profile);
  const selectedPreparationUnlockIds = resolution.selectedUnlockIds.filter((id) => id !== unlockId);
  const selectedPreparationChoicePayloads = Object.fromEntries(
    Object.entries(resolution.selectedChoicePayloads).filter(
      ([selectedUnlockId]) => selectedUnlockId !== unlockId
    )
  );

  return {
    ok: true,
    profile: withSelectedPreparationState(
      profile,
      selectedPreparationUnlockIds,
      selectedPreparationChoicePayloads
    ),
    selectedPreparationUnlockIds,
    selectedPreparationChoicePayloads
  };
}

export function clearLegacyPreparationChoice(
  profile: AccountProfileState,
  unlockId: string
): LegacyPreparationSelectionSuccess {
  return removeLegacyPreparation(profile, unlockId);
}

export function consumeSelectedLegacyPreparations(profile: AccountProfileState): {
  profile: AccountProfileState;
  consumedPreparationUnlockIds: string[];
} {
  const resolution = resolveLegacyPreparationSelection(profile);

  return {
    profile: withSelectedPreparationState(profile, [], {}),
    consumedPreparationUnlockIds: resolution.selectedUnlockIds
  };
}

function buildUnlockState(
  existing: LegacyUnlockState | null,
  definition: LegacyUnlockDefinitionState,
  transaction: LegacyTransactionState,
  nextRank: number
): LegacyUnlockState {
  const ranked = definition.kind !== "binary";
  const base: LegacyUnlockState = existing
    ? { ...existing }
    : {
        unlockId: definition.id,
        unlockedAt: transaction.recordedAt,
        sourceTransactionId: transaction.id
      };

  if (!ranked) {
    return {
      unlockId: base.unlockId,
      unlockedAt: base.unlockedAt,
      sourceTransactionId: base.sourceTransactionId
    };
  }

  return {
    ...base,
    rank: nextRank
  };
}

export function purchaseLegacyUnlock(
  profile: AccountProfileState,
  unlockId: string,
  recordedAt = new Date().toISOString()
): LegacyUnlockPurchaseSuccess | LegacyUnlockPurchaseFailure {
  const definition = getLegacyUnlockDefinitionById(unlockId);

  if (!definition) {
    return {
      ok: false,
      profile,
      error: "unknown_unlock"
    };
  }

  const definitions = getLegacyUnlockDefinitions();
  const definitionsById = new Map(definitions.map((entry) => [entry.id, entry]));
  const resolved = resolveDefinitionState(profile, definition, definitionsById);
  if (resolved.nextRank === null) {
    return {
      ok: false,
      profile,
      error: "max_rank"
    };
  }

  if (resolved.requirementResults.some((result) => result.state === "unsupported")) {
    return {
      ok: false,
      profile,
      error: "unsupported_requirement"
    };
  }

  if (!resolved.eligible) {
    return {
      ok: false,
      profile,
      error: "ineligible"
    };
  }

  if (resolved.nextCost === null) {
    return {
      ok: false,
      profile,
      error: "invalid_cost"
    };
  }

  if (profile.legacy.legacyPoints < resolved.nextCost) {
    return {
      ok: false,
      profile,
      error: "insufficient_legacy"
    };
  }

  const nextBalance = profile.legacy.legacyPoints - resolved.nextCost;
  const rankSuffix = definition.kind === "binary" ? "" : ` Rank ${resolved.nextRank}`;
  const transactionBase: AccountProfileState = {
    ...profile,
    updatedAt: recordedAt,
    legacy: {
      ...profile.legacy,
      legacyPoints: nextBalance
    }
  };
  const recorded = recordLegacyTransaction(transactionBase, {
    kind: "spend",
    amount: resolved.nextCost,
    balanceAfter: nextBalance,
    summary: `Claimed ${definition.title}${rankSuffix}`,
    sourceType: "legacy_unlock",
    sourceId: definition.id,
    unlockId: definition.id,
    recordedAt
  });
  const existingUnlock = getStoredUnlock(profile, definition.id);
  const nextUnlock = buildUnlockState(
    existingUnlock,
    definition,
    recorded.transaction,
    resolved.nextRank
  );
  const replaced = existingUnlock !== null;
  const legacyUnlocks = replaced
    ? recorded.profile.legacy.legacyUnlocks.map((unlock) =>
        unlock.unlockId === definition.id ? nextUnlock : unlock
      )
    : [...recorded.profile.legacy.legacyUnlocks, nextUnlock];

  return {
    ok: true,
    profile: {
      ...recorded.profile,
      legacy: {
        ...recorded.profile.legacy,
        legacyUnlocks
      }
    },
    transaction: recorded.transaction,
    unlock: nextUnlock
  };
}
