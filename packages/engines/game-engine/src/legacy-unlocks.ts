import legacyUnlockCatalog from "../../../content/base/player/legacy_unlocks.json" with { type: "json" };
import type {
  AccountProfileState,
  AccountRunArchiveReason,
  AccountRunHistoryOutcome,
  AccountRunHistoryRecord,
  LegacyTransactionState,
  LegacyUnlockCategory,
  LegacyUnlockCostState,
  LegacyUnlockDefinitionState,
  LegacyUnlockEffectKind,
  LegacyUnlockEffectState,
  LegacyUnlockKind,
  LegacyUnlockRequirementResolutionState,
  LegacyUnlockRequirementState,
  LegacyUnlockState
} from "../../../shared/types/src/index.js";
import { recordLegacyTransaction } from "./legacy-account.js";

const CATEGORY_ORDER: LegacyUnlockCategory[] = [
  "Origins",
  "Titles",
  "Perks",
  "Traits",
  "Account",
  "Chronicle",
  "Heir"
];

const KNOWN_CATEGORIES = new Set<LegacyUnlockCategory>(CATEGORY_ORDER);
const KNOWN_KINDS = new Set<LegacyUnlockKind>(["binary", "tiered", "incremental"]);
const KNOWN_EFFECT_KINDS = new Set<LegacyUnlockEffectKind>([
  "account_flag",
  "profile_title",
  "chronicle_presentation",
  "future_heir_start",
  "future_inheritance_uses"
]);

const FUTURE_REQUIREMENT_TYPES = new Set(["character_skill", "role_rank", "wealth"]);

export type LegacyUnlockAffordability = "affordable" | "unaffordable" | "no_cost";
export type LegacyUnlockOwnershipState = "locked" | "unlocked" | "maxed";

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
    default:
      throw new Error(`Legacy unlock '${definitionId}' has unsupported cost type '${cost.type}'.`);
  }

  return cost as LegacyUnlockCostState;
}

function validateEffects(
  effects: unknown,
  definitionId: string
): LegacyUnlockEffectState[] {
  if (!Array.isArray(effects) || effects.length === 0) {
    throw new Error(`Legacy unlock '${definitionId}' must define at least one metadata effect.`);
  }

  return effects.map((effect) => {
    if (!isRecord(effect) || typeof effect.type !== "string") {
      throw new Error(`Legacy unlock '${definitionId}' has an invalid effect.`);
    }

    if (!KNOWN_EFFECT_KINDS.has(effect.type as LegacyUnlockEffectKind)) {
      throw new Error(`Legacy unlock '${definitionId}' uses non-metadata effect '${effect.type}'.`);
    }

    assertValidId(effect.key, `${definitionId}.effect.key`);
    return effect as unknown as LegacyUnlockEffectState;
  });
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

function resolveNextCost(
  cost: LegacyUnlockCostState,
  nextRank: number | null
): number | null {
  if (nextRank === null) {
    return null;
  }

  if (cost.type === "per_rank") {
    return cost.amounts[nextRank - 1] ?? null;
  }

  if (cost.type === "fixed") {
    return cost.amount;
  }

  let multiplier = 1;
  for (const jump of cost.thresholdJumps ?? []) {
    if (nextRank >= jump.rank) {
      multiplier *= jump.multiplier;
    }
  }

  return Math.max(0, Math.ceil(cost.baseAmount * cost.growthFactor ** (nextRank - 1) * multiplier));
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

function formatRequirementLabel(requirement: LegacyUnlockRequirementState): string {
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
    case "character_skill":
      return `Future requirement: ${requirement.skillId} rank ${requirement.rank}`;
    case "role_rank":
      return `Future requirement: ${requirement.roleId} rank ${requirement.rank}`;
    case "wealth":
      return `Future requirement: ${requirement.amount} wealth`;
  }
}

function resolveRequirement(
  profile: AccountProfileState,
  requirement: LegacyUnlockRequirementState
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
    default:
      state = FUTURE_REQUIREMENT_TYPES.has(requirement.type) ? "unsupported" : "unsupported";
      break;
  }

  return {
    requirement,
    state,
    label: formatRequirementLabel(requirement)
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

function resolveDefinitionState(
  profile: AccountProfileState,
  definition: LegacyUnlockDefinitionState
): LegacyUnlockResolvedState {
  const storedUnlock = getStoredUnlock(profile, definition.id);
  const maxRank = normalizeMaxRank(definition);
  const currentRank = getCurrentRank(storedUnlock, definition);
  const nextRank = currentRank >= maxRank ? null : currentRank + 1;
  const requirementResults = getRequirementsForRank(definition, nextRank).map((requirement) =>
    resolveRequirement(profile, requirement)
  );
  const eligible = requirementResults.every((result) => result.state === "eligible");
  const nextCost = resolveNextCost(definition.cost, nextRank);
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
          : affordability !== "affordable"
            ? "Insufficient Prestige"
            : null;

  return {
    id: definition.id,
    definition,
    category: definition.category,
    kind: definition.kind,
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
    category: "Account",
    kind: "binary",
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
    canPurchase: false,
    purchaseBlockedReason: "Historical unlock"
  };
}

export function resolveLegacyUnlockStates(
  profile: AccountProfileState
): LegacyUnlockResolvedState[] {
  const definitions = getLegacyUnlockDefinitions();
  const definitionIds = new Set(definitions.map((definition) => definition.id));
  const knownStates = definitions.map((definition) => resolveDefinitionState(profile, definition));
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

  const resolved = resolveDefinitionState(profile, definition);
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
