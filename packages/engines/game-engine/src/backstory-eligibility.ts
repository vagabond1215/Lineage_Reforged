import {
  BACKSTORY_ELIGIBILITY_POLICY,
  type BackstoryEligibilityAvailabilityStatus,
  type BackstoryEligibilityMissingBehavior,
  type BackstoryEligibilityPolicy,
  type BackstoryEligibilityRequirement,
  type BackstoryEligibilityRequirementKind,
  type BackstoryEligibilityScope,
  type BackstoryEligibilitySourceType,
  type BackstoryEligibilityThresholdRequirement,
  type BackstorySelectedBackstoryEffectPolicy,
  validateBackstoryEligibilityPolicy
} from "./backstory-eligibility-policy.js";

export type BackstoryEligibilityEvidenceRecord = {
  kind: BackstoryEligibilityRequirementKind;
  scope: BackstoryEligibilityScope;
  value?: number;
  scopeId?: string;
  skillId?: string;
  tag?: string;
  achievementId?: string;
  backstoryId?: string;
  sourceType?: BackstoryEligibilitySourceType;
  accountId?: string;
  familyId?: string;
  lineageId?: string;
  sourceRunId?: string;
  regionId?: string;
  factionId?: string;
  institutionId?: string;
  estateTitleId?: string;
};

export type BackstoryEligibilityThresholdRecord = {
  scope: BackstoryEligibilityScope;
  value: number;
  scopeId?: string;
  accountId?: string;
  familyId?: string;
  lineageId?: string;
  sourceRunId?: string;
  regionId?: string;
  factionId?: string;
  institutionId?: string;
  estateTitleId?: string;
};

export type BackstoryEligibilityEvidenceInput = {
  accountId?: string;
  familyId?: string;
  lineageId?: string;
  sourceRunIds?: string[];
  regionId?: string;
  factionId?: string;
  institutionId?: string;
  estateTitleId?: string;
  legacyPurchaseIds?: string[];
  evidenceRecords?: BackstoryEligibilityEvidenceRecord[];
  prestigeRecords?: BackstoryEligibilityThresholdRecord[];
  echoRecords?: BackstoryEligibilityThresholdRecord[];
  selectedBackstoryId?: string;
};

export type BackstoryEligibilityState =
  | "eligible"
  | "locked"
  | "hidden"
  | "deferred"
  | "special";

export type BackstoryEligibilityRecordResult = {
  backstoryId: string;
  availabilityStatus: BackstoryEligibilityAvailabilityStatus;
  tier: string;
  state: BackstoryEligibilityState;
  selectable: boolean;
  visible: boolean;
  reasons: string[];
  selectedBackstoryEffectPolicy: BackstorySelectedBackstoryEffectPolicy;
};

export type BackstoryEligibilityResolution = {
  eligibleBackstoryIds: string[];
  lockedBackstories: BackstoryEligibilityRecordResult[];
  hiddenBackstoryIds: string[];
  deferredBackstoryIds: string[];
  specialBackstoryIds: string[];
  defaultBackstoryIds: string[];
  records: BackstoryEligibilityRecordResult[];
  warnings: string[];
};

type RequirementEvaluation = {
  satisfied: boolean;
  blocked: boolean;
  missingBehavior: BackstoryEligibilityMissingBehavior;
  reason: string;
};

const STARTER_SOURCE_TYPES: ReadonlySet<BackstoryEligibilitySourceType> = new Set([
  "starter_backstory",
  "starter_bundle"
]);

function unique(values: Iterable<string>): string[] {
  return [...new Set(values)];
}

function scopeOwnerPresent(
  scope: BackstoryEligibilityScope,
  input: BackstoryEligibilityEvidenceInput
): boolean {
  switch (scope) {
    case "family":
      return typeof input.familyId === "string" && input.familyId.trim().length > 0;
    case "lineage":
      return typeof input.lineageId === "string" && input.lineageId.trim().length > 0;
    case "source_run":
      return Array.isArray(input.sourceRunIds) && input.sourceRunIds.length > 0;
    case "region":
      return typeof input.regionId === "string" && input.regionId.trim().length > 0;
    case "faction":
      return typeof input.factionId === "string" && input.factionId.trim().length > 0;
    case "institution":
      return typeof input.institutionId === "string" && input.institutionId.trim().length > 0;
    case "estate_title":
      return typeof input.estateTitleId === "string" && input.estateTitleId.trim().length > 0;
    case "account":
    case "character":
    case "special_manual":
      return true;
  }
}

function scopedRecordMatchesInput(
  scope: BackstoryEligibilityScope,
  record: BackstoryEligibilityEvidenceRecord | BackstoryEligibilityThresholdRecord,
  input: BackstoryEligibilityEvidenceInput
): boolean {
  if (record.scope !== scope) {
    return false;
  }

  switch (scope) {
    case "account":
      return !record.accountId || !input.accountId || record.accountId === input.accountId;
    case "family":
      return Boolean(input.familyId && record.familyId === input.familyId);
    case "lineage":
      return Boolean(input.lineageId && record.lineageId === input.lineageId);
    case "source_run":
      return Boolean(
        record.sourceRunId &&
          input.sourceRunIds?.some((sourceRunId) => sourceRunId === record.sourceRunId)
      );
    case "region":
      return Boolean(input.regionId && (record.regionId ?? record.scopeId) === input.regionId);
    case "faction":
      return Boolean(input.factionId && (record.factionId ?? record.scopeId) === input.factionId);
    case "institution":
      return Boolean(
        input.institutionId && (record.institutionId ?? record.scopeId) === input.institutionId
      );
    case "estate_title":
      return Boolean(
        input.estateTitleId && (record.estateTitleId ?? record.scopeId) === input.estateTitleId
      );
    case "character":
    case "special_manual":
      return true;
  }
}

function valueMeetsMinimum(value: number | undefined, minValue: number | undefined): boolean {
  return minValue === undefined || (typeof value === "number" && value >= minValue);
}

function recordMatchesRequirementIdentity(
  record: BackstoryEligibilityEvidenceRecord,
  requirement: BackstoryEligibilityRequirement
): boolean {
  return (
    (requirement.skillId === undefined || record.skillId === requirement.skillId) &&
    (requirement.tag === undefined || record.tag === requirement.tag) &&
    (requirement.achievementId === undefined ||
      record.achievementId === requirement.achievementId) &&
    (requirement.backstoryId === undefined || record.backstoryId === requirement.backstoryId)
  );
}

function sourceAllowed(
  record: BackstoryEligibilityEvidenceRecord,
  requirement: BackstoryEligibilityRequirement
): boolean {
  if (requirement.starterGrantedAllowed !== true && record.sourceType) {
    if (STARTER_SOURCE_TYPES.has(record.sourceType)) {
      return false;
    }
  }

  if (requirement.requiresEarnedSource === true) {
    if (!record.sourceType || STARTER_SOURCE_TYPES.has(record.sourceType)) {
      return false;
    }
  }

  if (requirement.sourceTypesAllowed && requirement.sourceTypesAllowed.length > 0) {
    return Boolean(
      record.sourceType && requirement.sourceTypesAllowed.includes(record.sourceType)
    );
  }

  return true;
}

function evaluateRequirement(
  requirement: BackstoryEligibilityRequirement,
  input: BackstoryEligibilityEvidenceInput,
  policy: BackstoryEligibilityPolicy
): RequirementEvaluation {
  const missingBehavior = requirement.missingBehavior ?? "treat_as_unmet";
  const blockedBehavior = requirement.blockedBehavior ?? "defer";

  if (
    requirement.ownerReadiness === "blocked" ||
    policy.blockedEvidenceKinds.some((kind) => kind === requirement.kind)
  ) {
    return {
      satisfied: false,
      blocked: true,
      missingBehavior: blockedBehavior,
      reason: requirement.explain ?? `Evidence '${requirement.kind}' is blocked.`
    };
  }

  const scope = requirement.scope ?? "account";
  if (!scopeOwnerPresent(scope, input)) {
    return {
      satisfied: false,
      blocked: false,
      missingBehavior,
      reason: requirement.explain ?? `Missing ${scope} evidence owner.`
    };
  }

  const match = (input.evidenceRecords ?? []).some(
    (record) =>
      record.kind === requirement.kind &&
      scopedRecordMatchesInput(scope, record, input) &&
      recordMatchesRequirementIdentity(record, requirement) &&
      valueMeetsMinimum(record.value, requirement.minValue) &&
      sourceAllowed(record, requirement)
  );

  return {
    satisfied: match,
    blocked: false,
    missingBehavior,
    reason: requirement.explain ?? `Missing ${requirement.kind} evidence.`
  };
}

function requirementsAllPass(
  requirements: BackstoryEligibilityRequirement[] | undefined,
  input: BackstoryEligibilityEvidenceInput,
  policy: BackstoryEligibilityPolicy
): RequirementEvaluation {
  const entries = requirements ?? [];
  for (const requirement of entries) {
    const result = evaluateRequirement(requirement, input, policy);
    if (!result.satisfied) {
      return result;
    }
  }

  return {
    satisfied: true,
    blocked: false,
    missingBehavior: "treat_as_unmet",
    reason: "All requirements satisfied."
  };
}

function requirementsAnyPass(
  requirements: BackstoryEligibilityRequirement[] | undefined,
  input: BackstoryEligibilityEvidenceInput,
  policy: BackstoryEligibilityPolicy
): RequirementEvaluation {
  const entries = requirements ?? [];
  if (entries.length === 0) {
    return {
      satisfied: true,
      blocked: false,
      missingBehavior: "treat_as_unmet",
      reason: "No alternative requirements."
    };
  }

  let firstFailure: RequirementEvaluation | null = null;

  for (const requirement of entries) {
    const result = evaluateRequirement(requirement, input, policy);
    if (result.satisfied) {
      return result;
    }
    firstFailure ??= result;
  }

  return (
    firstFailure ?? {
      satisfied: false,
      blocked: false,
      missingBehavior: "treat_as_unmet",
      reason: "No alternative requirement satisfied."
    }
  );
}

function thresholdPasses(
  requirement: BackstoryEligibilityThresholdRequirement | undefined,
  records: BackstoryEligibilityThresholdRecord[] | undefined,
  input: BackstoryEligibilityEvidenceInput
): boolean {
  if (!requirement) {
    return true;
  }

  if (!scopeOwnerPresent(requirement.scope, input)) {
    return false;
  }

  return (records ?? []).some(
    (record) =>
      scopedRecordMatchesInput(requirement.scope, record, input) &&
      (requirement.scopeId === undefined || record.scopeId === requirement.scopeId) &&
      record.value >= requirement.minValue
  );
}

function legacyPurchasePasses(
  rule: { requiresLegacyPurchase?: { unlockId: string; scope: BackstoryEligibilityScope } },
  input: BackstoryEligibilityEvidenceInput
): boolean {
  const requirement = rule.requiresLegacyPurchase;
  if (!requirement) {
    return true;
  }

  if (!scopeOwnerPresent(requirement.scope, input)) {
    return false;
  }

  return (input.legacyPurchaseIds ?? []).includes(requirement.unlockId);
}

function hasNonCurrencyEvidence(rule: {
  requiresAny?: BackstoryEligibilityRequirement[];
  requiresAll?: BackstoryEligibilityRequirement[];
  requiresEvidence?: BackstoryEligibilityRequirement[];
}): boolean {
  return (
    (rule.requiresAny?.length ?? 0) > 0 ||
    (rule.requiresAll?.length ?? 0) > 0 ||
    (rule.requiresEvidence?.length ?? 0) > 0
  );
}

function applyMissingBehavior(
  behavior: BackstoryEligibilityMissingBehavior
): BackstoryEligibilityState {
  switch (behavior) {
    case "hide":
      return "hidden";
    case "defer":
      return "deferred";
    case "manual_review":
      return "special";
    case "use_default_fallback":
    case "treat_as_unmet":
    default:
      return "locked";
  }
}

function stateVisible(state: BackstoryEligibilityState): boolean {
  return state === "eligible" || state === "locked" || state === "special";
}

function resolveRuleState(
  rule: (typeof BACKSTORY_ELIGIBILITY_POLICY.availabilityRules)[number],
  input: BackstoryEligibilityEvidenceInput,
  policy: BackstoryEligibilityPolicy
): { state: BackstoryEligibilityState; reasons: string[] } {
  if (rule.availabilityStatus === "default_available" || rule.availabilityStatus === "always_available") {
    return {
      state: "eligible",
      reasons: [rule.explainUnlocked]
    };
  }

  if (rule.availabilityStatus === "hidden") {
    return {
      state: "hidden",
      reasons: [rule.explainLocked]
    };
  }

  if (rule.availabilityStatus === "deferred") {
    return {
      state: "deferred",
      reasons: [rule.explainLocked]
    };
  }

  if (rule.availabilityStatus === "special") {
    return {
      state: "special",
      reasons: [rule.explainLocked]
    };
  }

  const blockResult = requirementsAllPass(rule.blocksIf, input, policy);
  if (rule.blocksIf && rule.blocksIf.length > 0 && (blockResult.blocked || blockResult.satisfied)) {
    return {
      state: applyMissingBehavior(blockResult.missingBehavior),
      reasons: [blockResult.reason, rule.explainLocked]
    };
  }

  const legacyPassed = legacyPurchasePasses(rule, input);
  if (!legacyPassed) {
    return {
      state: "locked",
      reasons: [rule.requiresLegacyPurchase?.explain ?? rule.explainLocked]
    };
  }

  if (
    rule.requiresLegacyPurchase &&
    (rule.tier === "tier_2" || rule.tier === "tier_3") &&
    !hasNonCurrencyEvidence(rule)
  ) {
    return {
      state: "locked",
      reasons: ["Legacy purchase cannot be the only Tier 2 or Tier 3 requirement."]
    };
  }

  const allResult = requirementsAllPass(rule.requiresAll, input, policy);
  if (!allResult.satisfied) {
    return {
      state: applyMissingBehavior(allResult.missingBehavior),
      reasons: [allResult.reason, rule.explainLocked]
    };
  }

  const evidenceResult = requirementsAllPass(rule.requiresEvidence, input, policy);
  if (!evidenceResult.satisfied) {
    return {
      state: applyMissingBehavior(evidenceResult.missingBehavior),
      reasons: [evidenceResult.reason, rule.explainLocked]
    };
  }

  const anyResult = requirementsAnyPass(rule.requiresAny, input, policy);
  if (!anyResult.satisfied) {
    return {
      state: applyMissingBehavior(anyResult.missingBehavior),
      reasons: [anyResult.reason, rule.explainLocked]
    };
  }

  if (!thresholdPasses(rule.requiresPrestige, input.prestigeRecords, input)) {
    return {
      state: "locked",
      reasons: [rule.requiresPrestige?.explain ?? "Required scoped Prestige evidence is missing."]
    };
  }

  if (!thresholdPasses(rule.requiresEcho, input.echoRecords, input)) {
    return {
      state: "locked",
      reasons: [rule.requiresEcho?.explain ?? "Required scoped Echo evidence is missing."]
    };
  }

  return {
    state: "eligible",
    reasons: [rule.explainUnlocked]
  };
}

export function resolveBackstoryEligibility(params: {
  liveBackstoryIds: Iterable<string>;
  policy?: BackstoryEligibilityPolicy;
  evidence?: BackstoryEligibilityEvidenceInput;
}): BackstoryEligibilityResolution {
  const policy = params.policy ?? BACKSTORY_ELIGIBILITY_POLICY;
  const evidence = params.evidence ?? {};
  const liveIds = new Set(params.liveBackstoryIds);
  const warnings = validateBackstoryEligibilityPolicy(policy, liveIds).map(
    (issue) => issue.message
  );

  if (evidence.selectedBackstoryId && !liveIds.has(evidence.selectedBackstoryId)) {
    warnings.push(
      `Selected backstory '${evidence.selectedBackstoryId}' is not a current live backstory id.`
    );
  }

  const defaultBackstoryIds = policy.defaultBackstoryIds.filter((backstoryId) =>
    liveIds.has(backstoryId)
  );
  if (defaultBackstoryIds.length === 0) {
    warnings.push("No live default backstories are available for current-data fallback.");
  }

  const records = policy.availabilityRules
    .filter((rule) => liveIds.has(rule.backstoryId))
    .map<BackstoryEligibilityRecordResult>((rule) => {
      const resolved = resolveRuleState(rule, evidence, policy);
      return {
        backstoryId: rule.backstoryId,
        availabilityStatus: rule.availabilityStatus,
        tier: rule.tier,
        state: resolved.state,
        selectable: resolved.state === "eligible",
        visible: stateVisible(resolved.state),
        reasons: resolved.reasons,
        selectedBackstoryEffectPolicy: { ...rule.selectedBackstoryEffectPolicy }
      };
    });

  return {
    eligibleBackstoryIds: records
      .filter((record) => record.selectable)
      .map((record) => record.backstoryId),
    lockedBackstories: records.filter((record) => record.state === "locked"),
    hiddenBackstoryIds: records
      .filter((record) => record.state === "hidden")
      .map((record) => record.backstoryId),
    deferredBackstoryIds: records
      .filter((record) => record.state === "deferred")
      .map((record) => record.backstoryId),
    specialBackstoryIds: records
      .filter((record) => record.state === "special")
      .map((record) => record.backstoryId),
    defaultBackstoryIds: unique(defaultBackstoryIds),
    records,
    warnings
  };
}
