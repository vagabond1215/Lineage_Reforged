const INPUT_FIELDS = new Set([
  "relativePath",
  "target",
  "completionEnvelopes",
  "trialEligibilityPolicyWrapper",
  "domainRegistryWrapper"
]);

const TARGET_FIELDS = {
  domain: [
    "ownerScope",
    "ownerId",
    "policyId",
    "scope",
    "domainId"
  ],
  tier: [
    "ownerScope",
    "ownerId",
    "policyId",
    "scope",
    "domainId",
    "tier"
  ]
};

const POLICY_FIELDS = {
  domain: [
    "policyId",
    "status",
    "ownerScope",
    "ownerId",
    "scope",
    "domainId",
    "requiredCompletionTargets",
    "prerequisiteCompletionTargets",
    "readinessPolicyStatus",
    "attemptConstraintStatus",
    "cooldownConstraintStatus",
    "rewardRefs"
  ],
  tier: [
    "policyId",
    "status",
    "ownerScope",
    "ownerId",
    "scope",
    "domainId",
    "tier",
    "requiredCompletionTargets",
    "prerequisiteCompletionTargets",
    "readinessPolicyStatus",
    "attemptConstraintStatus",
    "cooldownConstraintStatus",
    "rewardRefs"
  ]
};

const COMPLETION_TARGET_FIELDS = {
  snippet: ["scope", "ownerScope", "ownerId", "snippetId"],
  tier: ["scope", "ownerScope", "ownerId", "domainId", "tier"],
  domain: ["scope", "ownerScope", "ownerId", "domainId"]
};

const REQUIREMENT_FIELDS = {
  snippet: ["scope", "domainId", "snippetId", "requiredDecision"],
  tier: ["scope", "domainId", "tier", "requiredDecision"],
  domain: ["scope", "domainId", "requiredDecision"]
};

const COMPLETION_ENVELOPE_FIELDS = [
  "decision",
  "scope",
  "target",
  "observed",
  "issues",
  "safety"
];

const COMPLETION_OBSERVED_FIELDS = [
  "progressValue",
  "consumedEvidenceIds",
  "requiredProgressValue",
  "earnedCompletionWeight",
  "availableCompletionWeight",
  "requiredCompletionWeight"
];

const COMPLETION_SAFETY_FLAGS = Object.freeze({
  noMutation: true,
  noPersistence: true,
  noEvidenceAcceptance: true,
  noProgressInitialization: true,
  noProgressApplication: true,
  noCompletionStateWrite: true,
  noTrialUnlock: true,
  noSkillTrialBehavior: true,
  noSpellMagicStudyBehavior: true,
  noUiOutput: true,
  noRuntimeEffect: true,
  noGeneratedOutput: true,
  noEvents: true,
  noRewards: true,
  noOwnershipMutation: true,
  noGameplayMutation: true
});

const SAFETY_FLAGS = Object.freeze({
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

const OWNER_ID_PATTERN = /^character\.[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)*$/;
const POLICY_ID_PATTERN =
  /^[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)+$/;
const DOMAIN_ID_PATTERN =
  /^knowledge_domain\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const SNIPPET_ID_PATTERN =
  /^knowledge_snippet\.[a-z0-9]+(?:_[a-z0-9]+)*\.[a-z0-9]+(?:_[a-z0-9]+)*\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const REFERENCE_ID_PATTERN =
  /^[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)+$/;
const ARCANE_DOMAIN_ID = "knowledge_domain.arcane_lore";

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

function compareStrings(left, right) {
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
}

function sortedValues(values) {
  return [...values].sort((left, right) =>
    compareStrings(stableValueKey(left), stableValueKey(right))
  );
}

function exactObjectFields(value, expectedFields) {
  return (
    isObject(value) &&
    sameValue(Object.keys(value).sort(), [...expectedFields].sort())
  );
}

function emptyObserved() {
  return {
    requiredCompletionTargets: [],
    satisfiedCompletionTargets: [],
    failedCompletionTargets: [],
    readinessPolicyStatus: "not_evaluated",
    attemptConstraintStatus: "not_evaluated",
    cooldownConstraintStatus: "not_evaluated",
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
    phase: "eligibility",
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
    issues: [{ code, message }]
  });
}

function targetContext(target) {
  return {
    target: target.scope === "domain"
      ? { ...target, tier: null }
      : structuredClone(target)
  };
}

function validateCanonicalDomainId(domainId) {
  return typeof domainId === "string" && DOMAIN_ID_PATTERN.test(domainId);
}

function validateCanonicalOwner(ownerScope, ownerId) {
  return ownerScope === "character" &&
    typeof ownerId === "string" &&
    OWNER_ID_PATTERN.test(ownerId);
}

function validateTarget(target, relativePath) {
  if (!isObject(target)) {
    return {
      issue: {
        code: "invalid_target",
        message: `${relativePath} target must be an object`
      }
    };
  }

  const expectedFields = TARGET_FIELDS[target.scope];
  if (!expectedFields || !exactObjectFields(target, expectedFields)) {
    return {
      issue: {
        code: "invalid_target",
        message: `${relativePath} target must declare exactly one supported domain or tier scope`
      }
    };
  }

  if (!validateCanonicalOwner(target.ownerScope, target.ownerId)) {
    return {
      issue: {
        code: "invalid_target",
        message: `${relativePath} target must use ownerScope 'character' and a canonical character ownerId`
      }
    };
  }
  if (
    typeof target.policyId !== "string" ||
    !POLICY_ID_PATTERN.test(target.policyId)
  ) {
    return {
      issue: {
        code: "invalid_target",
        message: `${relativePath} target.policyId must be a canonical dotted identifier`
      }
    };
  }
  if (!validateCanonicalDomainId(target.domainId)) {
    return {
      issue: {
        code: "invalid_target",
        message: `${relativePath} target.domainId must be a canonical Knowledge domain id`
      }
    };
  }
  if (
    target.scope === "tier" &&
    (!Number.isInteger(target.tier) || target.tier < 1)
  ) {
    return {
      issue: {
        code: "invalid_target",
        message: `${relativePath} target.tier must be a positive integer`
      }
    };
  }

  return { target: structuredClone(target) };
}

function buildDomainAuthority(domainRegistryWrapper, relativePath) {
  if (!exactObjectFields(domainRegistryWrapper, ["records"])) {
    return {
      issue: {
        code: "invalid_domain_authority",
        message: `${relativePath} domainRegistryWrapper must contain exactly a records array`
      }
    };
  }
  if (!Array.isArray(domainRegistryWrapper.records)) {
    return {
      issue: {
        code: "invalid_domain_authority",
        message: `${relativePath} domainRegistryWrapper.records must be an array`
      }
    };
  }

  const domainsById = new Map();
  for (const [index, record] of domainRegistryWrapper.records.entries()) {
    if (
      !isObject(record) ||
      !validateCanonicalDomainId(record.id) ||
      typeof record.status !== "string"
    ) {
      return {
        issue: {
          code: "invalid_domain_authority",
          message: `${relativePath} domain record index ${index} must provide a canonical id and string status`
        }
      };
    }
    if (domainsById.has(record.id)) {
      return {
        issue: {
          code: "invalid_domain_authority",
          message: `${relativePath} domain authority has duplicate id '${record.id}'`
        }
      };
    }
    domainsById.set(record.id, record);
  }

  return { domainsById };
}

function activeDomain(domainId, domainsById, relativePath) {
  if (domainId === ARCANE_DOMAIN_ID) {
    return {
      issue: {
        code: "arcane_lore_blocked",
        message: `${relativePath} Arcane Lore remains blocked for Knowledge trial eligibility`
      }
    };
  }
  const domain = domainsById.get(domainId);
  if (!domain) {
    return {
      issue: {
        code: "domain_not_found",
        message: `${relativePath} domainId '${domainId}' is unresolved`
      }
    };
  }
  if (domain.status !== "active") {
    return {
      issue: {
        code: "domain_not_active",
        message: `${relativePath} domainId '${domainId}' must reference status 'active', not ${JSON.stringify(domain.status)}`
      }
    };
  }
  return { domain };
}

function domainIdForSnippetId(snippetId) {
  const domainSlug = snippetId.split(".")[1];
  return `knowledge_domain.${domainSlug}`;
}

function validateRequirement(record, relativePath, description) {
  if (!isObject(record)) {
    return {
      issue: {
        code: "invalid_trial_eligibility_policy",
        message: `${relativePath} ${description} must be an object`
      }
    };
  }

  const expectedFields = REQUIREMENT_FIELDS[record.scope];
  if (!expectedFields || !exactObjectFields(record, expectedFields)) {
    return {
      issue: {
        code: "invalid_trial_eligibility_policy",
        message: `${relativePath} ${description} must declare exactly one supported snippet, tier, or domain completion target`
      }
    };
  }
  if (!validateCanonicalDomainId(record.domainId)) {
    return {
      issue: {
        code: "invalid_trial_eligibility_policy",
        message: `${relativePath} ${description}.domainId must be a canonical Knowledge domain id`
      }
    };
  }
  if (record.requiredDecision !== "candidate") {
    return {
      issue: {
        code: "invalid_trial_eligibility_policy",
        message: `${relativePath} ${description}.requiredDecision must be 'candidate'`
      }
    };
  }
  if (
    record.scope === "tier" &&
    (!Number.isInteger(record.tier) || record.tier < 1)
  ) {
    return {
      issue: {
        code: "invalid_trial_eligibility_policy",
        message: `${relativePath} ${description}.tier must be a positive integer`
      }
    };
  }
  if (record.scope === "snippet") {
    if (
      typeof record.snippetId !== "string" ||
      !SNIPPET_ID_PATTERN.test(record.snippetId)
    ) {
      return {
        issue: {
          code: "invalid_trial_eligibility_policy",
          message: `${relativePath} ${description}.snippetId must be a canonical Knowledge snippet id`
        }
      };
    }
    if (domainIdForSnippetId(record.snippetId) !== record.domainId) {
      return {
        issue: {
          code: "invalid_trial_eligibility_policy",
          message: `${relativePath} ${description} snippetId and domainId must align`
        }
      };
    }
  }

  return { requirement: structuredClone(record) };
}

function normalizePolicyRecord(record) {
  const normalized = structuredClone(record);
  normalized.requiredCompletionTargets = sortedValues(
    normalized.requiredCompletionTargets
  );
  normalized.prerequisiteCompletionTargets = sortedValues(
    normalized.prerequisiteCompletionTargets
  );
  normalized.rewardRefs = [...normalized.rewardRefs].sort(compareStrings);
  return normalized;
}

function validatePolicyRecord(record, relativePath, index) {
  if (!isObject(record)) {
    return {
      issue: {
        code: "invalid_trial_eligibility_policy",
        message: `${relativePath} policy record index ${index} must be an object`
      }
    };
  }

  const expectedFields = POLICY_FIELDS[record.scope];
  if (!expectedFields || !exactObjectFields(record, expectedFields)) {
    return {
      issue: {
        code: "invalid_trial_eligibility_policy",
        message: `${relativePath} policy record index ${index} must declare exactly one supported domain or tier policy shape`
      }
    };
  }
  if (
    typeof record.policyId !== "string" ||
    !POLICY_ID_PATTERN.test(record.policyId)
  ) {
    return {
      issue: {
        code: "invalid_trial_eligibility_policy",
        message: `${relativePath} policy record index ${index} requires a canonical policyId`
      }
    };
  }
  if (!["active", "deferred"].includes(record.status)) {
    return {
      issue: {
        code: "unsupported_trial_eligibility_policy_status",
        message: `${relativePath} policy '${record.policyId}' status must be 'active' or 'deferred'`
      }
    };
  }
  if (!validateCanonicalOwner(record.ownerScope, record.ownerId)) {
    return {
      issue: {
        code: "unsupported_owner_scope",
        message: `${relativePath} policy '${record.policyId}' must use ownerScope 'character' and a canonical character ownerId`
      }
    };
  }
  if (!validateCanonicalDomainId(record.domainId)) {
    return {
      issue: {
        code: "invalid_trial_eligibility_policy",
        message: `${relativePath} policy '${record.policyId}' requires a canonical domainId`
      }
    };
  }
  if (
    record.scope === "tier" &&
    (!Number.isInteger(record.tier) || record.tier < 1)
  ) {
    return {
      issue: {
        code: "invalid_trial_eligibility_policy",
        message: `${relativePath} policy '${record.policyId}' tier must be a positive integer`
      }
    };
  }
  if (
    !Array.isArray(record.requiredCompletionTargets) ||
    record.requiredCompletionTargets.length === 0 ||
    !Array.isArray(record.prerequisiteCompletionTargets)
  ) {
    return {
      issue: {
        code: "invalid_trial_eligibility_policy",
        message: `${relativePath} policy '${record.policyId}' requires a non-empty requiredCompletionTargets array and a prerequisiteCompletionTargets array`
      }
    };
  }
  if (
    record.readinessPolicyStatus !== "not_evaluated" ||
    record.attemptConstraintStatus !== "not_evaluated" ||
    record.cooldownConstraintStatus !== "not_evaluated"
  ) {
    return {
      issue: {
        code: "invalid_trial_eligibility_policy",
        message: `${relativePath} policy '${record.policyId}' readiness, attempt, and cooldown statuses must remain 'not_evaluated'`
      }
    };
  }
  if (
    !Array.isArray(record.rewardRefs) ||
    record.rewardRefs.some(
      (reference) =>
        typeof reference !== "string" || !REFERENCE_ID_PATTERN.test(reference)
    ) ||
    new Set(record.rewardRefs).size !== record.rewardRefs.length
  ) {
    return {
      issue: {
        code: "invalid_trial_eligibility_policy",
        message: `${relativePath} policy '${record.policyId}' rewardRefs must be unique canonical dotted identifiers`
      }
    };
  }

  const sections = [
    ["requiredCompletionTargets", record.requiredCompletionTargets],
    ["prerequisiteCompletionTargets", record.prerequisiteCompletionTargets]
  ];
  const keysBySection = new Map();
  for (const [sectionName, records] of sections) {
    const keys = new Set();
    for (const [requirementIndex, requirement] of records.entries()) {
      const requirementResult = validateRequirement(
        requirement,
        relativePath,
        `policy '${record.policyId}' ${sectionName}[${requirementIndex}]`
      );
      if (requirementResult.issue) {
        return requirementResult;
      }
      const key = requirementKey(requirementResult.requirement);
      if (keys.has(key)) {
        return {
          issue: {
            code:
              sectionName === "requiredCompletionTargets"
                ? "duplicate_required_completion_target"
                : "duplicate_prerequisite_completion_target",
            message: `${relativePath} policy '${record.policyId}' has a duplicate ${sectionName} target`
          }
        };
      }
      keys.add(key);
    }
    keysBySection.set(sectionName, keys);
  }

  for (const key of keysBySection.get("requiredCompletionTargets")) {
    if (keysBySection.get("prerequisiteCompletionTargets").has(key)) {
      return {
        issue: {
          code: "duplicate_completion_target_across_policy_sections",
          message: `${relativePath} policy '${record.policyId}' repeats one completion target across required and prerequisite sections`
        }
      };
    }
  }

  return { policy: normalizePolicyRecord(record) };
}

function buildPolicyAuthority(trialEligibilityPolicyWrapper, relativePath) {
  if (!exactObjectFields(trialEligibilityPolicyWrapper, ["records"])) {
    return {
      issue: {
        code: "invalid_trial_eligibility_policy",
        message: `${relativePath} trialEligibilityPolicyWrapper must contain exactly a records array`
      }
    };
  }
  if (!Array.isArray(trialEligibilityPolicyWrapper.records)) {
    return {
      issue: {
        code: "invalid_trial_eligibility_policy",
        message: `${relativePath} trialEligibilityPolicyWrapper.records must be an array`
      }
    };
  }

  const policiesById = new Map();
  for (const [index, record] of trialEligibilityPolicyWrapper.records.entries()) {
    const policyResult = validatePolicyRecord(record, relativePath, index);
    if (policyResult.issue) {
      return policyResult;
    }
    const policy = policyResult.policy;
    const prior = policiesById.get(policy.policyId);
    if (prior) {
      return {
        issue: {
          code: sameValue(prior, policy)
            ? "duplicate_trial_eligibility_policy"
            : "conflicting_trial_eligibility_policy",
          message: `${relativePath} policyId '${policy.policyId}' has more than one eligibility policy`
        }
      };
    }
    policiesById.set(policy.policyId, policy);
  }

  return { policiesById };
}

function validNullableInteger(value, { positive = false } = {}) {
  return (
    value === null ||
    (Number.isInteger(value) && (positive ? value > 0 : value >= 0))
  );
}

function validNullableNumber(value) {
  return (
    value === null ||
    (typeof value === "number" && Number.isFinite(value) && value >= 0)
  );
}

function validateCompletionObserved(observed, scope, decision, relativePath) {
  if (!exactObjectFields(observed, COMPLETION_OBSERVED_FIELDS)) {
    return {
      code: "invalid_completion_envelope",
      message: `${relativePath} completion envelope observed fields are malformed`
    };
  }
  if (
    !validNullableInteger(observed.progressValue) ||
    !validNullableInteger(observed.requiredProgressValue, { positive: true }) ||
    !validNullableNumber(observed.earnedCompletionWeight) ||
    !validNullableNumber(observed.availableCompletionWeight) ||
    !validNullableNumber(observed.requiredCompletionWeight) ||
    !(
      observed.consumedEvidenceIds === null ||
      (Array.isArray(observed.consumedEvidenceIds) &&
        observed.consumedEvidenceIds.every(
          (evidenceId) =>
            typeof evidenceId === "string" &&
            REFERENCE_ID_PATTERN.test(evidenceId)
        ) &&
        new Set(observed.consumedEvidenceIds).size ===
          observed.consumedEvidenceIds.length)
    )
  ) {
    return {
      code: "invalid_completion_envelope",
      message: `${relativePath} completion envelope observed values are malformed`
    };
  }

  if (decision === "blocked") {
    return null;
  }
  if (
    scope === "snippet" &&
    (!Number.isInteger(observed.progressValue) ||
      !Array.isArray(observed.consumedEvidenceIds) ||
      !Number.isInteger(observed.requiredProgressValue) ||
      observed.earnedCompletionWeight !== null ||
      observed.availableCompletionWeight !== null ||
      observed.requiredCompletionWeight !== null)
  ) {
    return {
      code: "invalid_completion_envelope",
      message: `${relativePath} snippet completion observed values do not match the current completion envelope`
    };
  }
  if (
    scope === "tier" &&
    (observed.progressValue !== null ||
      observed.consumedEvidenceIds !== null ||
      observed.requiredProgressValue !== null ||
      typeof observed.earnedCompletionWeight !== "number" ||
      typeof observed.availableCompletionWeight !== "number" ||
      typeof observed.requiredCompletionWeight !== "number" ||
      observed.earnedCompletionWeight > observed.availableCompletionWeight)
  ) {
    return {
      code: "invalid_completion_envelope",
      message: `${relativePath} tier completion observed values do not match the current completion envelope`
    };
  }
  if (
    scope === "domain" &&
    COMPLETION_OBSERVED_FIELDS.some((field) => observed[field] !== null)
  ) {
    return {
      code: "invalid_completion_envelope",
      message: `${relativePath} domain completion observed values do not match the current completion envelope`
    };
  }

  return null;
}

function validateCompletionTarget(target, scope, relativePath) {
  const expectedFields = COMPLETION_TARGET_FIELDS[scope];
  if (!expectedFields || !exactObjectFields(target, expectedFields)) {
    return {
      issue: {
        code: "invalid_completion_envelope",
        message: `${relativePath} completion target must match its exact scope-specific shape`
      }
    };
  }
  if (target.scope !== scope) {
    return {
      issue: {
        code: "invalid_completion_envelope",
        message: `${relativePath} completion envelope scope and target.scope must match`
      }
    };
  }
  if (!validateCanonicalOwner(target.ownerScope, target.ownerId)) {
    return {
      issue: {
        code: "invalid_completion_envelope",
        message: `${relativePath} completion target must use a canonical character owner`
      }
    };
  }
  if (
    scope === "snippet" &&
    (typeof target.snippetId !== "string" ||
      !SNIPPET_ID_PATTERN.test(target.snippetId))
  ) {
    return {
      issue: {
        code: "invalid_completion_envelope",
        message: `${relativePath} completion target snippetId is malformed`
      }
    };
  }
  if (
    scope !== "snippet" &&
    !validateCanonicalDomainId(target.domainId)
  ) {
    return {
      issue: {
        code: "invalid_completion_envelope",
        message: `${relativePath} completion target domainId is malformed`
      }
    };
  }
  if (
    scope === "tier" &&
    (!Number.isInteger(target.tier) || target.tier < 1)
  ) {
    return {
      issue: {
        code: "invalid_completion_envelope",
        message: `${relativePath} completion target tier must be a positive integer`
      }
    };
  }

  return { target: structuredClone(target) };
}

function validateCompletionEnvelope(envelope, relativePath, index) {
  const description = `${relativePath} completionEnvelopes[${index}]`;
  if (!exactObjectFields(envelope, COMPLETION_ENVELOPE_FIELDS)) {
    return {
      issue: {
        code: "invalid_completion_envelope",
        message: `${description} must contain exactly the current completion envelope fields`
      }
    };
  }
  if (!["candidate", "incomplete", "blocked"].includes(envelope.decision)) {
    return {
      issue: {
        code: "invalid_completion_envelope",
        message: `${description}.decision is unsupported`
      }
    };
  }
  if (!["snippet", "tier", "domain"].includes(envelope.scope)) {
    return {
      issue: {
        code: "invalid_completion_envelope",
        message: `${description}.scope is unsupported`
      }
    };
  }

  const targetResult = validateCompletionTarget(
    envelope.target,
    envelope.scope,
    description
  );
  if (targetResult.issue) {
    return targetResult;
  }
  if (
    !Array.isArray(envelope.issues) ||
    envelope.issues.some(
      (issue) =>
        !exactObjectFields(issue, ["code", "message"]) ||
        typeof issue.code !== "string" ||
        issue.code.length === 0 ||
        typeof issue.message !== "string" ||
        issue.message.length === 0
    ) ||
    (envelope.decision === "blocked"
      ? envelope.issues.length === 0
      : envelope.issues.length !== 0)
  ) {
    return {
      issue: {
        code: "invalid_completion_envelope",
        message: `${description}.issues do not match the completion decision`
      }
    };
  }
  if (!exactObjectFields(envelope.safety, Object.keys(COMPLETION_SAFETY_FLAGS))) {
    return {
      issue: {
        code: "unsafe_completion_envelope",
        message: `${description}.safety must contain exactly the current completion safety flags`
      }
    };
  }
  for (const flag of Object.keys(COMPLETION_SAFETY_FLAGS)) {
    if (envelope.safety[flag] !== true) {
      return {
        issue: {
          code: "unsafe_completion_envelope",
          message: `${description}.safety.${flag} must be true`
        }
      };
    }
  }

  const observedIssue = validateCompletionObserved(
    envelope.observed,
    envelope.scope,
    envelope.decision,
    description
  );
  if (observedIssue) {
    return { issue: observedIssue };
  }

  const domainId =
    envelope.scope === "snippet"
      ? domainIdForSnippetId(envelope.target.snippetId)
      : envelope.target.domainId;
  if (domainId === ARCANE_DOMAIN_ID) {
    return {
      issue: {
        code: "arcane_lore_blocked",
        message: `${description} references blocked Arcane Lore`
      }
    };
  }

  return { envelope: structuredClone(envelope) };
}

function completionTargetKey(target) {
  if (target.scope === "snippet") {
    return [
      target.scope,
      target.ownerScope,
      target.ownerId,
      target.snippetId
    ].join("\u0000");
  }
  if (target.scope === "tier") {
    return [
      target.scope,
      target.ownerScope,
      target.ownerId,
      target.domainId,
      target.tier
    ].join("\u0000");
  }
  return [
    target.scope,
    target.ownerScope,
    target.ownerId,
    target.domainId
  ].join("\u0000");
}

function requirementKey(requirement) {
  if (requirement.scope === "snippet") {
    return [
      requirement.scope,
      requirement.domainId,
      requirement.snippetId
    ].join("\u0000");
  }
  if (requirement.scope === "tier") {
    return [
      requirement.scope,
      requirement.domainId,
      requirement.tier
    ].join("\u0000");
  }
  return [requirement.scope, requirement.domainId].join("\u0000");
}

function completionKeyForRequirement(requirement, ownerScope, ownerId) {
  if (requirement.scope === "snippet") {
    return [
      requirement.scope,
      ownerScope,
      ownerId,
      requirement.snippetId
    ].join("\u0000");
  }
  if (requirement.scope === "tier") {
    return [
      requirement.scope,
      ownerScope,
      ownerId,
      requirement.domainId,
      requirement.tier
    ].join("\u0000");
  }
  return [
    requirement.scope,
    ownerScope,
    ownerId,
    requirement.domainId
  ].join("\u0000");
}

function buildCompletionAuthority(completionEnvelopes, relativePath) {
  if (!Array.isArray(completionEnvelopes)) {
    return {
      issue: {
        code: "invalid_completion_envelopes",
        message: `${relativePath} completionEnvelopes must be an array`
      }
    };
  }

  const envelopesByTarget = new Map();
  for (const [index, envelope] of completionEnvelopes.entries()) {
    const envelopeResult = validateCompletionEnvelope(
      envelope,
      relativePath,
      index
    );
    if (envelopeResult.issue) {
      return envelopeResult;
    }
    const normalizedEnvelope = envelopeResult.envelope;
    const key = completionTargetKey(normalizedEnvelope.target);
    if (envelopesByTarget.has(key)) {
      return {
        issue: {
          code: "duplicate_completion_envelope",
          message: `${relativePath} completionEnvelopes contain more than one envelope for the same exact target`
        }
      };
    }
    envelopesByTarget.set(key, normalizedEnvelope);
  }

  return { envelopesByTarget };
}

function policyMatchesTarget(policy, target) {
  return (
    policy.policyId === target.policyId &&
    policy.ownerScope === target.ownerScope &&
    policy.ownerId === target.ownerId &&
    policy.scope === target.scope &&
    policy.domainId === target.domainId &&
    (target.scope !== "tier" || policy.tier === target.tier)
  );
}

function validatePolicyDomains(policy, domainsById, relativePath) {
  const domainIds = new Set([
    policy.domainId,
    ...policy.requiredCompletionTargets.map((target) => target.domainId),
    ...policy.prerequisiteCompletionTargets.map((target) => target.domainId)
  ]);
  for (const domainId of [...domainIds].sort(compareStrings)) {
    const domainResult = activeDomain(domainId, domainsById, relativePath);
    if (domainResult.issue) {
      return domainResult;
    }
  }
  return {};
}

function eligibilityDecision({
  relativePath,
  target,
  policy,
  envelopesByTarget
}) {
  const allRequirements = sortedValues([
    ...policy.requiredCompletionTargets,
    ...policy.prerequisiteCompletionTargets
  ]);
  const satisfiedCompletionTargets = [];
  const failedCompletionTargets = [];
  const issues = [];

  for (const requirement of allRequirements) {
    const key = completionKeyForRequirement(
      requirement,
      target.ownerScope,
      target.ownerId
    );
    const envelope = envelopesByTarget.get(key);
    if (envelope?.decision === requirement.requiredDecision) {
      satisfiedCompletionTargets.push(requirement);
      continue;
    }

    failedCompletionTargets.push(requirement);
    issues.push({
      code: "completion_requirement_not_satisfied",
      message: envelope
        ? `${relativePath} ${requirement.scope} completion requirement '${requirementKey(requirement)}' resolved as '${envelope.decision}', not '${requirement.requiredDecision}'`
        : `${relativePath} ${requirement.scope} completion requirement '${requirementKey(requirement)}' has no exact completion envelope for the target owner`
    });
  }

  const observed = {
    requiredCompletionTargets: structuredClone(allRequirements),
    satisfiedCompletionTargets: structuredClone(satisfiedCompletionTargets),
    failedCompletionTargets: structuredClone(failedCompletionTargets),
    readinessPolicyStatus: "not_evaluated",
    attemptConstraintStatus: "not_evaluated",
    cooldownConstraintStatus: "not_evaluated",
    rewardRefs: [...policy.rewardRefs]
  };

  return result({
    decision:
      failedCompletionTargets.length === 0
        ? "eligible_candidate"
        : "not_eligible",
    ...targetContext(target),
    observed,
    issues
  });
}

export function evaluateKnowledgeTrialEligibility(input = {}) {
  if (!isObject(input)) {
    return blocked(
      "invalid_invocation",
      "knowledge trial eligibility input must be an object"
    );
  }

  const unsupportedFields = Object.keys(input)
    .filter((field) => !INPUT_FIELDS.has(field))
    .sort();
  if (unsupportedFields.length > 0) {
    return blocked(
      "unsupported_input_fields",
      `knowledge trial eligibility does not accept fields: ${unsupportedFields.join(", ")}`
    );
  }

  const {
    relativePath = "knowledge-trial-eligibility-operation",
    target,
    completionEnvelopes,
    trialEligibilityPolicyWrapper,
    domainRegistryWrapper
  } = input;

  if (typeof relativePath !== "string" || relativePath.length === 0) {
    return blocked(
      "invalid_relative_path",
      "relativePath must be a non-empty string"
    );
  }

  const targetResult = validateTarget(target, relativePath);
  if (targetResult.issue) {
    return blocked(targetResult.issue.code, targetResult.issue.message);
  }
  const normalizedTarget = targetResult.target;
  const context = targetContext(normalizedTarget);

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

  const targetDomainResult = activeDomain(
    normalizedTarget.domainId,
    domainAuthority.domainsById,
    relativePath
  );
  if (targetDomainResult.issue) {
    return blocked(
      targetDomainResult.issue.code,
      targetDomainResult.issue.message,
      context
    );
  }

  const policyAuthority = buildPolicyAuthority(
    trialEligibilityPolicyWrapper,
    relativePath
  );
  if (policyAuthority.issue) {
    return blocked(
      policyAuthority.issue.code,
      policyAuthority.issue.message,
      context
    );
  }
  const policy = policyAuthority.policiesById.get(normalizedTarget.policyId);
  if (!policy) {
    return blocked(
      "missing_trial_eligibility_policy",
      `${relativePath} policyId '${normalizedTarget.policyId}' has no matching eligibility policy`,
      context
    );
  }
  if (!policyMatchesTarget(policy, normalizedTarget)) {
    return blocked(
      "trial_eligibility_policy_target_mismatch",
      `${relativePath} policyId '${normalizedTarget.policyId}' does not match the exact requested owner and target`,
      context
    );
  }
  if (policy.status !== "active") {
    return blocked(
      "trial_eligibility_policy_deferred",
      `${relativePath} policyId '${normalizedTarget.policyId}' is deferred`,
      context
    );
  }

  const policyDomainResult = validatePolicyDomains(
    policy,
    domainAuthority.domainsById,
    relativePath
  );
  if (policyDomainResult.issue) {
    return blocked(
      policyDomainResult.issue.code,
      policyDomainResult.issue.message,
      context
    );
  }

  const completionAuthority = buildCompletionAuthority(
    completionEnvelopes,
    relativePath
  );
  if (completionAuthority.issue) {
    return blocked(
      completionAuthority.issue.code,
      completionAuthority.issue.message,
      context
    );
  }

  return eligibilityDecision({
    relativePath,
    target: normalizedTarget,
    policy,
    envelopesByTarget: completionAuthority.envelopesByTarget
  });
}
