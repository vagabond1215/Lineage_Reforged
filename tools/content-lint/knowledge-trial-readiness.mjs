const INPUT_FIELDS = new Set([
  "relativePath",
  "target",
  "eligibilityEnvelope",
  "trialReadinessPolicyWrapper",
  "attemptAuthorityWrapper",
  "cooldownAuthorityWrapper",
  "availabilityAuthorityWrapper",
  "sequenceTimeAuthority",
  "domainRegistryWrapper"
]);

const TARGET_FIELDS = {
  domain: [
    "ownerScope",
    "ownerId",
    "readinessPolicyId",
    "eligibilityPolicyId",
    "scope",
    "domainId"
  ],
  tier: [
    "ownerScope",
    "ownerId",
    "readinessPolicyId",
    "eligibilityPolicyId",
    "scope",
    "domainId",
    "tier"
  ]
};

const ELIGIBILITY_TARGET_FIELDS = [
  "ownerScope",
  "ownerId",
  "policyId",
  "scope",
  "domainId",
  "tier"
];

const ELIGIBILITY_OBSERVED_FIELDS = [
  "requiredCompletionTargets",
  "satisfiedCompletionTargets",
  "failedCompletionTargets",
  "readinessPolicyStatus",
  "attemptConstraintStatus",
  "cooldownConstraintStatus",
  "rewardRefs"
];

const REQUIREMENT_FIELDS = {
  snippet: ["scope", "domainId", "snippetId", "requiredDecision"],
  tier: ["scope", "domainId", "tier", "requiredDecision"],
  domain: ["scope", "domainId", "requiredDecision"]
};

const POLICY_FIELDS = {
  domain: [
    "readinessPolicyId",
    "eligibilityPolicyId",
    "status",
    "ownerScope",
    "ownerId",
    "scope",
    "domainId",
    "requiredEligibilityDecision",
    "attemptPolicy",
    "cooldownPolicy",
    "availabilityPolicy",
    "prerequisiteReadinessGates",
    "sequenceTimePolicy",
    "rewardRefs"
  ],
  tier: [
    "readinessPolicyId",
    "eligibilityPolicyId",
    "status",
    "ownerScope",
    "ownerId",
    "scope",
    "domainId",
    "tier",
    "requiredEligibilityDecision",
    "attemptPolicy",
    "cooldownPolicy",
    "availabilityPolicy",
    "prerequisiteReadinessGates",
    "sequenceTimePolicy",
    "rewardRefs"
  ]
};

const AUTHORITY_RECORD_FIELDS = {
  attempt: [
    "attemptId",
    "ownerScope",
    "ownerId",
    "readinessPolicyId",
    "eligibilityPolicyId",
    "scope",
    "domainId",
    "tier",
    "status",
    "sequenceValue",
    "timeValue"
  ],
  cooldown: [
    "cooldownId",
    "ownerScope",
    "ownerId",
    "readinessPolicyId",
    "eligibilityPolicyId",
    "scope",
    "domainId",
    "tier",
    "sourceAttemptId",
    "unit",
    "startValue",
    "endValue"
  ],
  availability: [
    "availabilityId",
    "ownerScope",
    "ownerId",
    "readinessPolicyId",
    "eligibilityPolicyId",
    "scope",
    "domainId",
    "tier",
    "status"
  ]
};

const ELIGIBILITY_SAFETY_FLAGS = Object.freeze({
  noMutation: true,
  noPersistence: true,
  noStorage: true,
  noCompletionEvaluation: true,
  noCompletionStateWrite: true,
  noTrialStateWrite: true,
  noTrialAttemptCreation: true,
  noCheckpointResolution: true,
  noOutcomeResolution: true,
  noCooldownMutation: true,
  noRewardGrant: true,
  noUnlock: true,
  noSkillTrialBehavior: true,
  noSpellMagicStudyBehavior: true,
  noUiOutput: true,
  noRuntimeEffect: true,
  noGeneratedOutput: true,
  noEvents: true,
  noOwnershipMutation: true,
  noGameplayMutation: true
});

const SAFETY_FLAGS = Object.freeze({
  noMutation: true,
  noPersistence: true,
  noStorage: true,
  noCompletionEvaluation: true,
  noEligibilityEvaluation: true,
  noCompletionStateWrite: true,
  noEligibilityStateWrite: true,
  noReadinessStateWrite: true,
  noTrialStateWrite: true,
  noTrialAttemptCreation: true,
  noCheckpointResolution: true,
  noOutcomeResolution: true,
  noCooldownMutation: true,
  noRewardGrant: true,
  noUnlock: true,
  noSkillTrialBehavior: true,
  noSpellMagicStudyBehavior: true,
  noUiOutput: true,
  noRuntimeEffect: true,
  noGeneratedOutput: true,
  noEvents: true,
  noOwnershipMutation: true,
  noGameplayMutation: true
});

const OWNER_ID_PATTERN =
  /^character\.[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)*$/;
const DOTTED_ID_PATTERN =
  /^[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)+$/;
const DOMAIN_ID_PATTERN =
  /^knowledge_domain\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const SNIPPET_ID_PATTERN =
  /^knowledge_snippet\.[a-z0-9]+(?:_[a-z0-9]+)*\.[a-z0-9]+(?:_[a-z0-9]+)*\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const STATUS_PATTERN = /^[a-z][a-z0-9_]*$/;
const ARCANE_DOMAIN_ID = "knowledge_domain.arcane_lore";
const UNITS = new Set(["sequence", "turn", "day", "timestamp"]);

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stableValueKey(value) {
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return `[${value.map(stableValueKey).join(",")}]`;
  }
  if (isObject(value)) {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableValueKey(value[key])}`)
      .join(",")}}`;
  }
  if (typeof value === "number" && !Number.isFinite(value)) {
    return `number:${String(value)}`;
  }
  return `${typeof value}:${JSON.stringify(value)}`;
}

function sameValue(left, right) {
  return stableValueKey(left) === stableValueKey(right);
}

function compareStable(left, right) {
  return stableValueKey(left).localeCompare(stableValueKey(right));
}

function exactObjectFields(value, expectedFields) {
  return (
    isObject(value) &&
    sameValue(Object.keys(value).sort(), [...expectedFields].sort())
  );
}

function canonicalDottedId(value) {
  return typeof value === "string" && DOTTED_ID_PATTERN.test(value);
}

function canonicalOwner(ownerScope, ownerId) {
  return (
    ownerScope === "character" &&
    typeof ownerId === "string" &&
    OWNER_ID_PATTERN.test(ownerId)
  );
}

function canonicalDomainId(value) {
  return typeof value === "string" && DOMAIN_ID_PATTERN.test(value);
}

function canonicalStatus(value) {
  return typeof value === "string" && STATUS_PATTERN.test(value);
}

function nonNegativeInteger(value) {
  return Number.isInteger(value) && value >= 0;
}

function nullableNonNegativeInteger(value) {
  return value === null || nonNegativeInteger(value);
}

function issue(code, message) {
  return { code, message };
}

function blocker(code, message) {
  return { code, message };
}

function emptyObserved() {
  return {
    eligibilityDecision: null,
    readinessPolicyStatus: "not_evaluated",
    attemptConstraintStatus: "not_evaluated",
    cooldownConstraintStatus: "not_evaluated",
    availabilityStatus: "not_evaluated",
    sequenceOrTimeStatus: "not_evaluated",
    readinessBlockers: [],
    rewardRefs: []
  };
}

function result({
  decision = "blocked",
  target = null,
  observed = emptyObserved(),
  issues = []
} = {}) {
  return {
    phase: "readiness",
    decision,
    target: target === null ? null : structuredClone(target),
    observed: structuredClone(observed),
    issues: structuredClone(issues),
    safety: { ...SAFETY_FLAGS }
  };
}

function blocked(code, message, context = {}) {
  return result({
    ...context,
    decision: "blocked",
    issues: [issue(code, message)]
  });
}

function outputTarget(target) {
  return target.scope === "domain"
    ? { ...target, tier: null }
    : structuredClone(target);
}

function contextFor(target, eligibilityDecision = null) {
  return {
    target: outputTarget(target),
    observed: {
      ...emptyObserved(),
      eligibilityDecision
    }
  };
}

function validateTarget(target, relativePath) {
  if (!isObject(target)) {
    return { issue: issue("invalid_target", `${relativePath} target must be an object`) };
  }
  const expectedFields = TARGET_FIELDS[target.scope];
  if (!expectedFields || !exactObjectFields(target, expectedFields)) {
    return {
      issue: issue(
        "invalid_target",
        `${relativePath} target must declare exactly one supported domain or tier readiness target`
      )
    };
  }
  if (!canonicalOwner(target.ownerScope, target.ownerId)) {
    return {
      issue: issue(
        "unsupported_owner_scope",
        `${relativePath} target must use ownerScope 'character' and a canonical character ownerId`
      )
    };
  }
  if (
    !canonicalDottedId(target.readinessPolicyId) ||
    !canonicalDottedId(target.eligibilityPolicyId)
  ) {
    return {
      issue: issue(
        "invalid_target",
        `${relativePath} target policy ids must be canonical dotted identifiers`
      )
    };
  }
  if (!canonicalDomainId(target.domainId)) {
    return {
      issue: issue(
        "invalid_target",
        `${relativePath} target.domainId must be a canonical Knowledge domain id`
      )
    };
  }
  if (
    target.scope === "tier" &&
    (!Number.isInteger(target.tier) || target.tier < 1)
  ) {
    return {
      issue: issue(
        "invalid_target",
        `${relativePath} target.tier must be a positive integer`
      )
    };
  }
  return { target: structuredClone(target) };
}

function buildDomainAuthority(wrapper, relativePath) {
  if (!exactObjectFields(wrapper, ["records"]) || !Array.isArray(wrapper.records)) {
    return {
      issue: issue(
        "invalid_domain_authority",
        `${relativePath} domainRegistryWrapper must contain exactly a records array`
      )
    };
  }
  const byId = new Map();
  for (const [index, record] of wrapper.records.entries()) {
    if (
      !isObject(record) ||
      !canonicalDomainId(record.id) ||
      typeof record.status !== "string"
    ) {
      return {
        issue: issue(
          "invalid_domain_authority",
          `${relativePath} domain record index ${index} must provide a canonical id and string status`
        )
      };
    }
    if (byId.has(record.id)) {
      return {
        issue: issue(
          "invalid_domain_authority",
          `${relativePath} domain authority has duplicate id '${record.id}'`
        )
      };
    }
    byId.set(record.id, structuredClone(record));
  }
  return { byId };
}

function validateActiveDomain(domainId, byId, relativePath) {
  if (domainId === ARCANE_DOMAIN_ID) {
    return {
      issue: issue(
        "arcane_lore_blocked",
        `${relativePath} Arcane Lore remains blocked for Knowledge trial readiness`
      )
    };
  }
  const domain = byId.get(domainId);
  if (!domain) {
    return {
      issue: issue(
        "domain_not_found",
        `${relativePath} domainId '${domainId}' is unresolved`
      )
    };
  }
  if (domain.status !== "active") {
    return {
      issue: issue(
        "domain_not_active",
        `${relativePath} domainId '${domainId}' must reference status 'active'`
      )
    };
  }
  return {};
}

function validateRequirement(record, relativePath, description) {
  if (!isObject(record)) {
    return issue("invalid_eligibility_envelope", `${relativePath} ${description} must be an object`);
  }
  const expectedFields = REQUIREMENT_FIELDS[record.scope];
  if (!expectedFields || !exactObjectFields(record, expectedFields)) {
    return issue(
      "invalid_eligibility_envelope",
      `${relativePath} ${description} has an unsupported completion target shape`
    );
  }
  if (!canonicalDomainId(record.domainId) || record.requiredDecision !== "candidate") {
    return issue(
      "invalid_eligibility_envelope",
      `${relativePath} ${description} has invalid domain or required decision authority`
    );
  }
  if (
    record.scope === "tier" &&
    (!Number.isInteger(record.tier) || record.tier < 1)
  ) {
    return issue(
      "invalid_eligibility_envelope",
      `${relativePath} ${description}.tier must be a positive integer`
    );
  }
  if (
    record.scope === "snippet" &&
    (typeof record.snippetId !== "string" ||
      !SNIPPET_ID_PATTERN.test(record.snippetId))
  ) {
    return issue(
      "invalid_eligibility_envelope",
      `${relativePath} ${description}.snippetId must be canonical`
    );
  }
  return null;
}

function validateRequirementArray(records, relativePath, fieldName) {
  if (!Array.isArray(records)) {
    return issue(
      "invalid_eligibility_envelope",
      `${relativePath} eligibility observed.${fieldName} must be an array`
    );
  }
  const keys = new Set();
  for (const [index, record] of records.entries()) {
    const recordIssue = validateRequirement(
      record,
      relativePath,
      `eligibility observed.${fieldName}[${index}]`
    );
    if (recordIssue) {
      return recordIssue;
    }
    const key = stableValueKey(record);
    if (keys.has(key)) {
      return issue(
        "invalid_eligibility_envelope",
        `${relativePath} eligibility observed.${fieldName} contains a duplicate target`
      );
    }
    keys.add(key);
  }
  return null;
}

function validateIssueArray(issues, decision, relativePath) {
  if (
    !Array.isArray(issues) ||
    issues.some(
      (entry) =>
        !exactObjectFields(entry, ["code", "message"]) ||
        typeof entry.code !== "string" ||
        entry.code.length === 0 ||
        typeof entry.message !== "string" ||
        entry.message.length === 0
    )
  ) {
    return issue(
      "invalid_eligibility_envelope",
      `${relativePath} eligibility issues must contain exact code and message entries`
    );
  }
  if (
    (decision === "eligible_candidate" && issues.length !== 0) ||
    (decision !== "eligible_candidate" && issues.length === 0)
  ) {
    return issue(
      "invalid_eligibility_envelope",
      `${relativePath} eligibility issues do not match decision '${decision}'`
    );
  }
  return null;
}

function validateEligibilityEnvelope(envelope, target, relativePath) {
  if (
    !exactObjectFields(envelope, [
      "phase",
      "decision",
      "target",
      "observed",
      "issues",
      "safety"
    ])
  ) {
    return {
      issue: issue(
        "invalid_eligibility_envelope",
        `${relativePath} eligibilityEnvelope must contain exactly the current eligibility fields`
      )
    };
  }
  if (envelope.phase !== "eligibility") {
    return {
      issue: issue(
        "invalid_eligibility_envelope",
        `${relativePath} eligibilityEnvelope.phase must be 'eligibility'`
      )
    };
  }
  if (!["eligible_candidate", "not_eligible", "blocked"].includes(envelope.decision)) {
    return {
      issue: issue(
        "invalid_eligibility_envelope",
        `${relativePath} eligibilityEnvelope.decision is unsupported`
      )
    };
  }
  if (!exactObjectFields(envelope.target, ELIGIBILITY_TARGET_FIELDS)) {
    return {
      issue: issue(
        "invalid_eligibility_envelope",
        `${relativePath} eligibilityEnvelope.target has an unsupported shape`
      )
    };
  }
  const expectedEligibilityTarget = {
    ownerScope: target.ownerScope,
    ownerId: target.ownerId,
    policyId: target.eligibilityPolicyId,
    scope: target.scope,
    domainId: target.domainId,
    tier: target.scope === "domain" ? null : target.tier
  };
  if (!sameValue(envelope.target, expectedEligibilityTarget)) {
    return {
      issue: issue(
        "eligibility_target_mismatch",
        `${relativePath} eligibilityEnvelope.target must match the exact readiness target`
      )
    };
  }
  if (!exactObjectFields(envelope.observed, ELIGIBILITY_OBSERVED_FIELDS)) {
    return {
      issue: issue(
        "invalid_eligibility_envelope",
        `${relativePath} eligibilityEnvelope.observed has an unsupported shape`
      )
    };
  }
  for (const fieldName of [
    "requiredCompletionTargets",
    "satisfiedCompletionTargets",
    "failedCompletionTargets"
  ]) {
    const arrayIssue = validateRequirementArray(
      envelope.observed[fieldName],
      relativePath,
      fieldName
    );
    if (arrayIssue) {
      return { issue: arrayIssue };
    }
  }
  if (
    envelope.observed.readinessPolicyStatus !== "not_evaluated" ||
    envelope.observed.attemptConstraintStatus !== "not_evaluated" ||
    envelope.observed.cooldownConstraintStatus !== "not_evaluated"
  ) {
    return {
      issue: issue(
        "invalid_eligibility_envelope",
        `${relativePath} eligibility readiness, attempt, and cooldown statuses must remain 'not_evaluated'`
      )
    };
  }
  if (
    !Array.isArray(envelope.observed.rewardRefs) ||
    envelope.observed.rewardRefs.some((value) => !canonicalDottedId(value)) ||
    new Set(envelope.observed.rewardRefs).size !== envelope.observed.rewardRefs.length
  ) {
    return {
      issue: issue(
        "invalid_eligibility_envelope",
        `${relativePath} eligibility rewardRefs must be unique canonical dotted identifiers`
      )
    };
  }
  const issuesIssue = validateIssueArray(envelope.issues, envelope.decision, relativePath);
  if (issuesIssue) {
    return { issue: issuesIssue };
  }
  if (!exactObjectFields(envelope.safety, Object.keys(ELIGIBILITY_SAFETY_FLAGS))) {
    return {
      issue: issue(
        "unsafe_eligibility_envelope",
        `${relativePath} eligibilityEnvelope.safety must contain exactly the current safety flags`
      )
    };
  }
  for (const flag of Object.keys(ELIGIBILITY_SAFETY_FLAGS)) {
    if (envelope.safety[flag] !== true) {
      return {
        issue: issue(
          "unsafe_eligibility_envelope",
          `${relativePath} eligibilityEnvelope.safety.${flag} must be true`
        )
      };
    }
  }
  return { envelope: structuredClone(envelope) };
}

function validateAttemptPolicy(value, relativePath, policyId) {
  if (exactObjectFields(value, ["mode"]) && value.mode === "none") {
    return { policy: { mode: "none" } };
  }
  if (
    !exactObjectFields(value, ["mode", "maxAttempts", "countStatuses"]) ||
    value.mode !== "max_attempts" ||
    !Number.isInteger(value.maxAttempts) ||
    value.maxAttempts < 1 ||
    !Array.isArray(value.countStatuses) ||
    value.countStatuses.length === 0 ||
    value.countStatuses.some((status) => !canonicalStatus(status)) ||
    new Set(value.countStatuses).size !== value.countStatuses.length
  ) {
    return {
      issue: issue(
        "invalid_trial_readiness_policy",
        `${relativePath} policy '${policyId}' attemptPolicy is malformed`
      )
    };
  }
  return {
    policy: {
      mode: "max_attempts",
      maxAttempts: value.maxAttempts,
      countStatuses: [...value.countStatuses].sort()
    }
  };
}

function validateCooldownPolicy(value, relativePath, policyId) {
  if (exactObjectFields(value, ["mode"]) && value.mode === "none") {
    return { policy: { mode: "none" } };
  }
  if (
    !exactObjectFields(value, [
      "mode",
      "unit",
      "requiredElapsed",
      "sourceStatus"
    ]) ||
    !["sequence_window", "time_window"].includes(value.mode) ||
    !UNITS.has(value.unit) ||
    !nonNegativeInteger(value.requiredElapsed) ||
    !canonicalStatus(value.sourceStatus) ||
    (value.mode === "sequence_window" && value.unit !== "sequence") ||
    (value.mode === "time_window" && value.unit === "sequence")
  ) {
    return {
      issue: issue(
        "invalid_trial_readiness_policy",
        `${relativePath} policy '${policyId}' cooldownPolicy is malformed`
      )
    };
  }
  return { policy: structuredClone(value) };
}

function validateAvailabilityPolicy(value, relativePath, policyId) {
  if (
    !exactObjectFields(value, ["mode"]) ||
    !["always", "explicit_gate"].includes(value.mode)
  ) {
    return {
      issue: issue(
        "invalid_trial_readiness_policy",
        `${relativePath} policy '${policyId}' availabilityPolicy is malformed`
      )
    };
  }
  return { policy: structuredClone(value) };
}

function validateSequenceTimePolicy(value, relativePath, policyId) {
  if (exactObjectFields(value, ["mode"]) && value.mode === "none") {
    return { policy: { mode: "none" } };
  }
  if (
    !exactObjectFields(value, ["mode", "authorityId", "unit"]) ||
    value.mode !== "required" ||
    !canonicalDottedId(value.authorityId) ||
    !UNITS.has(value.unit)
  ) {
    return {
      issue: issue(
        "invalid_trial_readiness_policy",
        `${relativePath} policy '${policyId}' sequenceTimePolicy is malformed`
      )
    };
  }
  return { policy: structuredClone(value) };
}

function normalizePolicy(policy) {
  const normalized = structuredClone(policy);
  normalized.rewardRefs.sort();
  return normalized;
}

function validatePolicyRecord(record, relativePath, index) {
  if (!isObject(record)) {
    return {
      issue: issue(
        "invalid_trial_readiness_policy",
        `${relativePath} policy record index ${index} must be an object`
      )
    };
  }
  const expectedFields = POLICY_FIELDS[record.scope];
  if (!expectedFields || !exactObjectFields(record, expectedFields)) {
    return {
      issue: issue(
        "invalid_trial_readiness_policy",
        `${relativePath} policy record index ${index} has an unsupported shape`
      )
    };
  }
  if (
    !canonicalDottedId(record.readinessPolicyId) ||
    !canonicalDottedId(record.eligibilityPolicyId)
  ) {
    return {
      issue: issue(
        "invalid_trial_readiness_policy",
        `${relativePath} policy record index ${index} requires canonical policy ids`
      )
    };
  }
  if (!["active", "deferred"].includes(record.status)) {
    return {
      issue: issue(
        "unsupported_trial_readiness_policy_status",
        `${relativePath} policy '${record.readinessPolicyId}' status is unsupported`
      )
    };
  }
  if (!canonicalOwner(record.ownerScope, record.ownerId)) {
    return {
      issue: issue(
        "unsupported_owner_scope",
        `${relativePath} policy '${record.readinessPolicyId}' must use a canonical character owner`
      )
    };
  }
  if (!canonicalDomainId(record.domainId)) {
    return {
      issue: issue(
        "invalid_trial_readiness_policy",
        `${relativePath} policy '${record.readinessPolicyId}' domainId is malformed`
      )
    };
  }
  if (
    record.scope === "tier" &&
    (!Number.isInteger(record.tier) || record.tier < 1)
  ) {
    return {
      issue: issue(
        "invalid_trial_readiness_policy",
        `${relativePath} policy '${record.readinessPolicyId}' tier must be positive`
      )
    };
  }
  if (record.requiredEligibilityDecision !== "eligible_candidate") {
    return {
      issue: issue(
        "invalid_trial_readiness_policy",
        `${relativePath} policy '${record.readinessPolicyId}' must require 'eligible_candidate'`
      )
    };
  }
  if (
    !Array.isArray(record.prerequisiteReadinessGates) ||
    record.prerequisiteReadinessGates.length !== 0
  ) {
    return {
      issue: issue(
        "unsupported_prerequisite_readiness_gates",
        `${relativePath} policy '${record.readinessPolicyId}' supports only an empty prerequisiteReadinessGates array`
      )
    };
  }
  if (
    !Array.isArray(record.rewardRefs) ||
    record.rewardRefs.some((value) => !canonicalDottedId(value)) ||
    new Set(record.rewardRefs).size !== record.rewardRefs.length
  ) {
    return {
      issue: issue(
        "invalid_trial_readiness_policy",
        `${relativePath} policy '${record.readinessPolicyId}' rewardRefs must be unique canonical dotted identifiers`
      )
    };
  }

  const attempt = validateAttemptPolicy(
    record.attemptPolicy,
    relativePath,
    record.readinessPolicyId
  );
  if (attempt.issue) {
    return attempt;
  }
  const cooldown = validateCooldownPolicy(
    record.cooldownPolicy,
    relativePath,
    record.readinessPolicyId
  );
  if (cooldown.issue) {
    return cooldown;
  }
  const availability = validateAvailabilityPolicy(
    record.availabilityPolicy,
    relativePath,
    record.readinessPolicyId
  );
  if (availability.issue) {
    return availability;
  }
  const sequence = validateSequenceTimePolicy(
    record.sequenceTimePolicy,
    relativePath,
    record.readinessPolicyId
  );
  if (sequence.issue) {
    return sequence;
  }
  if (
    cooldown.policy.mode !== "none" &&
    (sequence.policy.mode !== "required" ||
      sequence.policy.unit !== cooldown.policy.unit)
  ) {
    return {
      issue: issue(
        "invalid_trial_readiness_policy",
        `${relativePath} policy '${record.readinessPolicyId}' cooldown and sequence/time policies must use matching required authority`
      )
    };
  }

  return {
    policy: normalizePolicy({
      ...record,
      attemptPolicy: attempt.policy,
      cooldownPolicy: cooldown.policy,
      availabilityPolicy: availability.policy,
      sequenceTimePolicy: sequence.policy
    })
  };
}

function buildPolicyAuthority(wrapper, relativePath) {
  if (!exactObjectFields(wrapper, ["records"]) || !Array.isArray(wrapper.records)) {
    return {
      issue: issue(
        "invalid_trial_readiness_policy",
        `${relativePath} trialReadinessPolicyWrapper must contain exactly a records array`
      )
    };
  }
  const byId = new Map();
  for (const [index, record] of wrapper.records.entries()) {
    const validation = validatePolicyRecord(record, relativePath, index);
    if (validation.issue) {
      return validation;
    }
    const prior = byId.get(validation.policy.readinessPolicyId);
    if (prior) {
      return {
        issue: issue(
          sameValue(prior, validation.policy)
            ? "duplicate_trial_readiness_policy"
            : "conflicting_trial_readiness_policy",
          `${relativePath} readinessPolicyId '${validation.policy.readinessPolicyId}' has more than one policy`
        )
      };
    }
    byId.set(validation.policy.readinessPolicyId, validation.policy);
  }
  return { byId };
}

function policyMatchesTarget(policy, target) {
  return (
    policy.readinessPolicyId === target.readinessPolicyId &&
    policy.eligibilityPolicyId === target.eligibilityPolicyId &&
    policy.ownerScope === target.ownerScope &&
    policy.ownerId === target.ownerId &&
    policy.scope === target.scope &&
    policy.domainId === target.domainId &&
    (target.scope === "domain" || policy.tier === target.tier)
  );
}

function authorityRecordMatchesTarget(record, target) {
  return (
    record.ownerScope === target.ownerScope &&
    record.ownerId === target.ownerId &&
    record.readinessPolicyId === target.readinessPolicyId &&
    record.eligibilityPolicyId === target.eligibilityPolicyId &&
    record.scope === target.scope &&
    record.domainId === target.domainId &&
    record.tier === (target.scope === "domain" ? null : target.tier)
  );
}

function validateAuthorityRecord(record, kind, target, relativePath, index) {
  if (!exactObjectFields(record, AUTHORITY_RECORD_FIELDS[kind])) {
    return {
      issue: issue(
        `invalid_${kind}_authority`,
        `${relativePath} ${kind} record index ${index} has an unsupported shape`
      )
    };
  }
  const idField = `${kind}Id`;
  if (
    !canonicalDottedId(record[idField]) ||
    !canonicalOwner(record.ownerScope, record.ownerId) ||
    !canonicalDottedId(record.readinessPolicyId) ||
    !canonicalDottedId(record.eligibilityPolicyId) ||
    !canonicalDomainId(record.domainId) ||
    !["domain", "tier"].includes(record.scope) ||
    (record.scope === "domain" && record.tier !== null) ||
    (record.scope === "tier" &&
      (!Number.isInteger(record.tier) || record.tier < 1))
  ) {
    return {
      issue: issue(
        `invalid_${kind}_authority`,
        `${relativePath} ${kind} record index ${index} has malformed identity authority`
      )
    };
  }
  if (!authorityRecordMatchesTarget(record, target)) {
    return {
      issue: issue(
        `${kind}_authority_target_mismatch`,
        `${relativePath} ${kind} record index ${index} does not match the exact readiness target`
      )
    };
  }

  if (
    kind === "attempt" &&
    (!canonicalStatus(record.status) ||
      !nullableNonNegativeInteger(record.sequenceValue) ||
      !nullableNonNegativeInteger(record.timeValue))
  ) {
    return {
      issue: issue(
        "invalid_attempt_authority",
        `${relativePath} attempt record index ${index} has malformed status or sequence/time values`
      )
    };
  }
  if (
    kind === "cooldown" &&
    (!canonicalDottedId(record.sourceAttemptId) ||
      !UNITS.has(record.unit) ||
      !nonNegativeInteger(record.startValue) ||
      !nonNegativeInteger(record.endValue) ||
      record.endValue < record.startValue)
  ) {
    return {
      issue: issue(
        "invalid_cooldown_authority",
        `${relativePath} cooldown record index ${index} has malformed source, unit, or range`
      )
    };
  }
  if (
    kind === "availability" &&
    !["open", "closed"].includes(record.status)
  ) {
    return {
      issue: issue(
        "invalid_availability_authority",
        `${relativePath} availability record index ${index} status must be 'open' or 'closed'`
      )
    };
  }
  return { record: structuredClone(record) };
}

function buildRecordAuthority(wrapper, kind, target, relativePath) {
  if (wrapper === undefined) {
    return { missing: true, records: [] };
  }
  if (!exactObjectFields(wrapper, ["records"]) || !Array.isArray(wrapper.records)) {
    return {
      issue: issue(
        `invalid_${kind}_authority`,
        `${relativePath} ${kind}AuthorityWrapper must contain exactly a records array`
      )
    };
  }
  const records = [];
  const ids = new Set();
  for (const [index, record] of wrapper.records.entries()) {
    const validation = validateAuthorityRecord(
      record,
      kind,
      target,
      relativePath,
      index
    );
    if (validation.issue) {
      return validation;
    }
    const id = validation.record[`${kind}Id`];
    if (ids.has(id)) {
      return {
        issue: issue(
          `duplicate_${kind}_authority`,
          `${relativePath} ${kind} authority contains duplicate id '${id}'`
        )
      };
    }
    ids.add(id);
    records.push(validation.record);
  }
  records.sort(compareStable);
  return { missing: false, records };
}

function validateSequenceTimeAuthority(value, policy, target, relativePath) {
  if (value === undefined) {
    return { missing: true };
  }
  if (
    !exactObjectFields(value, [
      "authorityId",
      "ownerScope",
      "ownerId",
      "unit",
      "value"
    ]) ||
    !canonicalDottedId(value.authorityId) ||
    !canonicalOwner(value.ownerScope, value.ownerId) ||
    !UNITS.has(value.unit) ||
    !nonNegativeInteger(value.value)
  ) {
    return {
      issue: issue(
        "invalid_sequence_time_authority",
        `${relativePath} sequenceTimeAuthority is malformed`
      )
    };
  }
  if (
    value.ownerScope !== target.ownerScope ||
    value.ownerId !== target.ownerId
  ) {
    return {
      issue: issue(
        "sequence_time_authority_target_mismatch",
        `${relativePath} sequenceTimeAuthority does not match the exact readiness owner`
      )
    };
  }
  if (
    policy.mode === "required" &&
    (value.authorityId !== policy.authorityId || value.unit !== policy.unit)
  ) {
    return {
      issue: issue(
        "sequence_time_authority_mismatch",
        `${relativePath} sequenceTimeAuthority does not match the required authority id and unit`
      )
    };
  }
  return { missing: false, authority: structuredClone(value) };
}

function notReady(target, eligibilityDecision, policyStatus, blockers, statuses = {}) {
  return result({
    decision: "not_ready",
    target: outputTarget(target),
    observed: {
      ...emptyObserved(),
      eligibilityDecision,
      readinessPolicyStatus: policyStatus,
      ...statuses,
      readinessBlockers: structuredClone(blockers)
    }
  });
}

export function evaluateKnowledgeTrialReadiness(input = {}) {
  if (!isObject(input)) {
    return blocked(
      "invalid_invocation",
      "knowledge trial readiness input must be an object"
    );
  }

  const unsupportedFields = Object.keys(input)
    .filter((field) => !INPUT_FIELDS.has(field))
    .sort();
  if (unsupportedFields.length > 0) {
    return blocked(
      "unsupported_input_fields",
      `knowledge trial readiness does not accept fields: ${unsupportedFields.join(", ")}`
    );
  }

  const {
    relativePath = "knowledge-trial-readiness-operation",
    target,
    eligibilityEnvelope,
    trialReadinessPolicyWrapper,
    attemptAuthorityWrapper,
    cooldownAuthorityWrapper,
    availabilityAuthorityWrapper,
    sequenceTimeAuthority,
    domainRegistryWrapper
  } = input;

  if (typeof relativePath !== "string" || relativePath.length === 0) {
    return blocked(
      "invalid_relative_path",
      "relativePath must be a non-empty string"
    );
  }

  const targetValidation = validateTarget(target, relativePath);
  if (targetValidation.issue) {
    return blocked(
      targetValidation.issue.code,
      targetValidation.issue.message
    );
  }
  const normalizedTarget = targetValidation.target;
  let context = contextFor(normalizedTarget);

  const domainAuthority = buildDomainAuthority(
    domainRegistryWrapper,
    relativePath
  );
  if (domainAuthority.issue) {
    return blocked(
      domainAuthority.issue.code,
      domainAuthority.issue.message,
      context
    );
  }
  const domainValidation = validateActiveDomain(
    normalizedTarget.domainId,
    domainAuthority.byId,
    relativePath
  );
  if (domainValidation.issue) {
    return blocked(
      domainValidation.issue.code,
      domainValidation.issue.message,
      context
    );
  }

  const eligibilityValidation = validateEligibilityEnvelope(
    eligibilityEnvelope,
    normalizedTarget,
    relativePath
  );
  if (eligibilityValidation.issue) {
    return blocked(
      eligibilityValidation.issue.code,
      eligibilityValidation.issue.message,
      context
    );
  }
  const normalizedEligibility = eligibilityValidation.envelope;
  context = contextFor(normalizedTarget, normalizedEligibility.decision);

  const policyAuthority = buildPolicyAuthority(
    trialReadinessPolicyWrapper,
    relativePath
  );
  if (policyAuthority.issue) {
    return blocked(
      policyAuthority.issue.code,
      policyAuthority.issue.message,
      context
    );
  }
  const policy = policyAuthority.byId.get(normalizedTarget.readinessPolicyId);
  if (!policy) {
    return notReady(
      normalizedTarget,
      normalizedEligibility.decision,
      "missing",
      [
        blocker(
          "readiness_policy_missing",
          `${relativePath} has no matching readiness policy`
        )
      ]
    );
  }
  if (!policyMatchesTarget(policy, normalizedTarget)) {
    return blocked(
      "trial_readiness_policy_target_mismatch",
      `${relativePath} readiness policy does not match the exact requested owner and target`,
      context
    );
  }
  if (policy.domainId === ARCANE_DOMAIN_ID) {
    return blocked(
      "arcane_lore_blocked",
      `${relativePath} Arcane Lore remains blocked for Knowledge trial readiness`,
      context
    );
  }
  if (policy.status === "deferred") {
    return notReady(
      normalizedTarget,
      normalizedEligibility.decision,
      "deferred",
      [
        blocker(
          "readiness_policy_deferred",
          `${relativePath} matching readiness policy is deferred`
        )
      ],
      { rewardRefs: [...policy.rewardRefs] }
    );
  }
  if (normalizedEligibility.decision !== policy.requiredEligibilityDecision) {
    return blocked(
      "eligibility_decision_not_accepted",
      `${relativePath} active readiness policy requires 'eligible_candidate', not '${normalizedEligibility.decision}'`,
      {
        ...context,
        observed: {
          ...context.observed,
          readinessPolicyStatus: "active",
          rewardRefs: [...policy.rewardRefs]
        }
      }
    );
  }

  const attemptAuthority = buildRecordAuthority(
    attemptAuthorityWrapper,
    "attempt",
    normalizedTarget,
    relativePath
  );
  if (attemptAuthority.issue) {
    return blocked(
      attemptAuthority.issue.code,
      attemptAuthority.issue.message,
      context
    );
  }
  const cooldownAuthority = buildRecordAuthority(
    cooldownAuthorityWrapper,
    "cooldown",
    normalizedTarget,
    relativePath
  );
  if (cooldownAuthority.issue) {
    return blocked(
      cooldownAuthority.issue.code,
      cooldownAuthority.issue.message,
      context
    );
  }
  const availabilityAuthority = buildRecordAuthority(
    availabilityAuthorityWrapper,
    "availability",
    normalizedTarget,
    relativePath
  );
  if (availabilityAuthority.issue) {
    return blocked(
      availabilityAuthority.issue.code,
      availabilityAuthority.issue.message,
      context
    );
  }
  const sequenceAuthority = validateSequenceTimeAuthority(
    sequenceTimeAuthority,
    policy.sequenceTimePolicy,
    normalizedTarget,
    relativePath
  );
  if (sequenceAuthority.issue) {
    return blocked(
      sequenceAuthority.issue.code,
      sequenceAuthority.issue.message,
      context
    );
  }
  if (cooldownAuthority.records.length > 1) {
    return blocked(
      "ambiguous_cooldown_authority",
      `${relativePath} cooldown authority must resolve to at most one exact record`,
      context
    );
  }
  if (availabilityAuthority.records.length > 1) {
    return blocked(
      "ambiguous_availability_authority",
      `${relativePath} availability authority must resolve to at most one exact record`,
      context
    );
  }

  const blockers = [];
  const statuses = {
    attemptConstraintStatus: "pass",
    cooldownConstraintStatus: "pass",
    availabilityStatus: "pass",
    sequenceOrTimeStatus: "pass",
    rewardRefs: [...policy.rewardRefs]
  };

  if (policy.attemptPolicy.mode === "max_attempts") {
    if (attemptAuthority.missing) {
      statuses.attemptConstraintStatus = "fail";
      blockers.push(
        blocker(
          "attempt_authority_missing",
          `${relativePath} required attempt authority is not available`
        )
      );
    } else {
      const countedAttempts = attemptAuthority.records.filter((record) =>
        policy.attemptPolicy.countStatuses.includes(record.status)
      ).length;
      if (countedAttempts >= policy.attemptPolicy.maxAttempts) {
        statuses.attemptConstraintStatus = "fail";
        blockers.push(
          blocker(
            "attempt_limit_reached",
            `${relativePath} counted attempts have reached the explicit maximum`
          )
        );
      }
    }
  }

  if (policy.sequenceTimePolicy.mode === "required" && sequenceAuthority.missing) {
    statuses.sequenceOrTimeStatus = "fail";
    blockers.push(
      blocker(
        "sequence_time_authority_missing",
        `${relativePath} required sequence/time authority is not available`
      )
    );
  }

  if (policy.cooldownPolicy.mode !== "none") {
    if (cooldownAuthority.missing) {
      statuses.cooldownConstraintStatus = "fail";
      blockers.push(
        blocker(
          "cooldown_authority_missing",
          `${relativePath} required cooldown authority is not available`
        )
      );
    } else if (!sequenceAuthority.missing) {
      const cooldown = cooldownAuthority.records[0];
      if (cooldown) {
        if (
          cooldown.unit !== policy.cooldownPolicy.unit ||
          cooldown.endValue - cooldown.startValue <
            policy.cooldownPolicy.requiredElapsed
        ) {
          return blocked(
            "cooldown_authority_policy_mismatch",
            `${relativePath} cooldown authority does not satisfy the explicit policy unit and elapsed window`,
            context
          );
        }
        if (sequenceAuthority.authority.value < cooldown.endValue) {
          statuses.cooldownConstraintStatus = "fail";
          blockers.push(
            blocker(
              "cooldown_active",
              `${relativePath} explicit cooldown remains active`
            )
          );
        }
      }
    } else {
      statuses.cooldownConstraintStatus = "not_evaluated";
    }
  }

  if (policy.availabilityPolicy.mode === "explicit_gate") {
    if (availabilityAuthority.missing || availabilityAuthority.records.length === 0) {
      statuses.availabilityStatus = "fail";
      blockers.push(
        blocker(
          "availability_authority_missing",
          `${relativePath} explicit availability authority is not available`
        )
      );
    } else if (availabilityAuthority.records[0].status === "closed") {
      statuses.availabilityStatus = "fail";
      blockers.push(
        blocker(
          "availability_closed",
          `${relativePath} explicit availability gate is closed`
        )
      );
    }
  }

  if (blockers.length > 0) {
    return notReady(
      normalizedTarget,
      normalizedEligibility.decision,
      "active",
      blockers,
      statuses
    );
  }

  return result({
    decision: "ready_candidate",
    target: outputTarget(normalizedTarget),
    observed: {
      ...emptyObserved(),
      eligibilityDecision: normalizedEligibility.decision,
      readinessPolicyStatus: "active",
      ...statuses
    }
  });
}
