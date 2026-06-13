import { validateKnowledgeProgress } from "./knowledge-progress.mjs";

const INPUT_FIELDS = new Set([
  "relativePath",
  "target",
  "appliedProgressWrapper",
  "currentAcceptedEvidenceWrapper",
  "completionPolicyWrapper",
  "progressSchema",
  "evidenceSchema",
  "snippetsWrapper",
  "domainRegistryWrapper",
  "regionsWrapper",
  "settlementsWrapper"
]);

const POLICY_FIELDS = ["snippetRules", "tierRules", "domainRules"];
const SNIPPET_RULE_FIELDS = ["snippetId", "requiredProgressValue"];
const TIER_RULE_FIELDS = [
  "domainId",
  "tier",
  "requiredCompletionWeight"
];
const DOMAIN_RULE_FIELDS = ["domainId", "requiredTiers"];
const TARGET_FIELDS = {
  snippet: ["scope", "ownerScope", "ownerId", "snippetId"],
  tier: ["scope", "ownerScope", "ownerId", "domainId", "tier"],
  domain: ["scope", "ownerScope", "ownerId", "domainId"]
};

const OWNER_ID_PATTERN = /^[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)+$/;
const SNIPPET_ID_PATTERN =
  /^knowledge_snippet\.[a-z0-9]+(?:_[a-z0-9]+)*\.[a-z0-9]+(?:_[a-z0-9]+)*\.[a-z0-9]+(?:_[a-z0-9]+)*$/;
const DOMAIN_ID_PATTERN =
  /^knowledge_domain\.[a-z0-9]+(?:_[a-z0-9]+)*$/;

const SAFETY_FLAGS = Object.freeze({
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

function exactObjectFields(value, expectedFields) {
  return (
    isObject(value) &&
    sameValue(Object.keys(value).sort(), [...expectedFields].sort())
  );
}

function emptyObserved() {
  return {
    progressValue: null,
    consumedEvidenceIds: null,
    requiredProgressValue: null,
    earnedCompletionWeight: null,
    availableCompletionWeight: null,
    requiredCompletionWeight: null
  };
}

function result({
  decision = "blocked",
  scope = null,
  target = null,
  observed = emptyObserved(),
  issues = []
} = {}) {
  return {
    decision,
    scope,
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

function completedDecision(decision, scope, target, observed) {
  return result({
    decision,
    scope,
    target,
    observed,
    issues: []
  });
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

function sortedRecords(records) {
  return [...records].sort((left, right) =>
    compareStrings(stableValueKey(left), stableValueKey(right))
  );
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
        message: `${relativePath} target must declare exactly one supported snippet, tier, or domain scope`
      }
    };
  }

  if (target.ownerScope !== "character") {
    return {
      issue: {
        code: "invalid_target",
        message: `${relativePath} target.ownerScope must remain 'character'`
      }
    };
  }
  if (
    typeof target.ownerId !== "string" ||
    !OWNER_ID_PATTERN.test(target.ownerId)
  ) {
    return {
      issue: {
        code: "invalid_target",
        message: `${relativePath} target.ownerId must be a canonical dotted identifier`
      }
    };
  }
  if (
    "snippetId" in target &&
    (typeof target.snippetId !== "string" ||
      !SNIPPET_ID_PATTERN.test(target.snippetId))
  ) {
    return {
      issue: {
        code: "invalid_target",
        message: `${relativePath} target.snippetId must be a canonical Knowledge snippet id`
      }
    };
  }
  if (
    "domainId" in target &&
    (typeof target.domainId !== "string" ||
      !DOMAIN_ID_PATTERN.test(target.domainId))
  ) {
    return {
      issue: {
        code: "invalid_target",
        message: `${relativePath} target.domainId must be a canonical Knowledge domain id`
      }
    };
  }
  if (
    "tier" in target &&
    (!Number.isInteger(target.tier) || target.tier < 1)
  ) {
    return {
      issue: {
        code: "invalid_target",
        message: `${relativePath} target.tier must be a positive integer`
      }
    };
  }

  return {
    target: structuredClone(target)
  };
}

function validatePolicyRecord(record, fields, description, relativePath) {
  if (!exactObjectFields(record, fields)) {
    return {
      code: "invalid_completion_policy",
      message: `${relativePath} ${description} must contain exactly: ${fields.join(", ")}`
    };
  }
  return null;
}

function buildPolicyAuthority(completionPolicyWrapper, relativePath) {
  if (!exactObjectFields(completionPolicyWrapper, POLICY_FIELDS)) {
    return {
      issue: {
        code: "invalid_completion_policy",
        message: `${relativePath} completionPolicyWrapper must contain exactly: ${POLICY_FIELDS.join(", ")}`
      }
    };
  }

  for (const field of POLICY_FIELDS) {
    if (!Array.isArray(completionPolicyWrapper[field])) {
      return {
        issue: {
          code: "invalid_completion_policy",
          message: `${relativePath} completionPolicyWrapper.${field} must be an array`
        }
      };
    }
  }

  const snippetRulesById = new Map();
  for (const record of sortedRecords(completionPolicyWrapper.snippetRules)) {
    const shapeIssue = validatePolicyRecord(
      record,
      SNIPPET_RULE_FIELDS,
      "snippet rule",
      relativePath
    );
    if (shapeIssue) {
      return { issue: shapeIssue };
    }
    if (
      typeof record.snippetId !== "string" ||
      !SNIPPET_ID_PATTERN.test(record.snippetId) ||
      !Number.isInteger(record.requiredProgressValue) ||
      record.requiredProgressValue <= 0
    ) {
      return {
        issue: {
          code: "invalid_snippet_rule",
          message: `${relativePath} snippet rule requires a canonical snippetId and positive integer requiredProgressValue`
        }
      };
    }
    const prior = snippetRulesById.get(record.snippetId);
    if (prior) {
      return {
        issue: {
          code:
            prior.requiredProgressValue === record.requiredProgressValue
              ? "duplicate_snippet_rule"
              : "conflicting_snippet_rule",
          message: `${relativePath} snippetId '${record.snippetId}' has more than one completion rule`
        }
      };
    }
    snippetRulesById.set(record.snippetId, structuredClone(record));
  }

  const tierRulesByKey = new Map();
  for (const record of sortedRecords(completionPolicyWrapper.tierRules)) {
    const shapeIssue = validatePolicyRecord(
      record,
      TIER_RULE_FIELDS,
      "tier rule",
      relativePath
    );
    if (shapeIssue) {
      return { issue: shapeIssue };
    }
    if (
      typeof record.domainId !== "string" ||
      !DOMAIN_ID_PATTERN.test(record.domainId) ||
      !Number.isInteger(record.tier) ||
      record.tier < 1 ||
      typeof record.requiredCompletionWeight !== "number" ||
      !Number.isFinite(record.requiredCompletionWeight) ||
      record.requiredCompletionWeight < 0
    ) {
      return {
        issue: {
          code: "invalid_tier_rule",
          message: `${relativePath} tier rule requires a canonical domainId, positive integer tier, and non-negative finite requiredCompletionWeight`
        }
      };
    }
    const key = `${record.domainId}\u0000${record.tier}`;
    const prior = tierRulesByKey.get(key);
    if (prior) {
      return {
        issue: {
          code:
            prior.requiredCompletionWeight === record.requiredCompletionWeight
              ? "duplicate_tier_rule"
              : "conflicting_tier_rule",
          message: `${relativePath} domainId '${record.domainId}' tier ${record.tier} has more than one completion rule`
        }
      };
    }
    tierRulesByKey.set(key, structuredClone(record));
  }

  const domainRulesById = new Map();
  for (const record of sortedRecords(completionPolicyWrapper.domainRules)) {
    const shapeIssue = validatePolicyRecord(
      record,
      DOMAIN_RULE_FIELDS,
      "domain rule",
      relativePath
    );
    if (shapeIssue) {
      return { issue: shapeIssue };
    }
    if (
      typeof record.domainId !== "string" ||
      !DOMAIN_ID_PATTERN.test(record.domainId) ||
      !Array.isArray(record.requiredTiers) ||
      record.requiredTiers.length === 0 ||
      record.requiredTiers.some(
        (tier) => !Number.isInteger(tier) || tier < 1
      ) ||
      new Set(record.requiredTiers).size !== record.requiredTiers.length
    ) {
      return {
        issue: {
          code: "invalid_domain_rule",
          message: `${relativePath} domain rule requires a canonical domainId and a non-empty unique set of positive integer requiredTiers`
        }
      };
    }

    const normalizedRecord = {
      domainId: record.domainId,
      requiredTiers: [...record.requiredTiers].sort((left, right) => left - right)
    };
    const prior = domainRulesById.get(record.domainId);
    if (prior) {
      return {
        issue: {
          code: sameValue(prior.requiredTiers, normalizedRecord.requiredTiers)
            ? "duplicate_domain_rule"
            : "conflicting_domain_rule",
          message: `${relativePath} domainId '${record.domainId}' has more than one completion rule`
        }
      };
    }
    domainRulesById.set(record.domainId, normalizedRecord);
  }

  return {
    authority: {
      snippetRulesById,
      tierRulesByKey,
      domainRulesById
    }
  };
}

function authorityMap(wrapper, authorityName, relativePath) {
  if (!isObject(wrapper) || !Array.isArray(wrapper.records)) {
    return {
      issue: {
        code: `invalid_${authorityName}_authority`,
        message: `${relativePath} ${authorityName} authority must provide a records array`
      }
    };
  }

  const recordsById = new Map();
  for (const [index, record] of wrapper.records.entries()) {
    if (!isObject(record) || typeof record.id !== "string") {
      return {
        issue: {
          code: `invalid_${authorityName}_authority`,
          message: `${relativePath} ${authorityName} authority record index ${index} must provide a string id`
        }
      };
    }
    if (recordsById.has(record.id)) {
      return {
        issue: {
          code: `invalid_${authorityName}_authority`,
          message: `${relativePath} ${authorityName} authority has duplicate id '${record.id}'`
        }
      };
    }
    recordsById.set(record.id, record);
  }

  return { recordsById };
}

function validateSnippetMetadata(snippet, relativePath) {
  if (
    !Number.isInteger(snippet.tier) ||
    snippet.tier < 1 ||
    !isObject(snippet.progression) ||
    typeof snippet.progression.completionWeight !== "number" ||
    !Number.isFinite(snippet.progression.completionWeight) ||
    snippet.progression.completionWeight < 0 ||
    typeof snippet.progression.countsTowardTierCompletion !== "boolean" ||
    typeof snippet.progression.trialUnlockWeight !== "number" ||
    !Number.isFinite(snippet.progression.trialUnlockWeight) ||
    snippet.progression.trialUnlockWeight < 0
  ) {
    return {
      code: "invalid_snippet_authority",
      message: `${relativePath} snippet '${snippet.id}' has invalid tier or progression metadata`
    };
  }
  return null;
}

function activeDomain(domainId, domainsById, relativePath) {
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

function progressForOwnerAndSnippet(
  appliedProgressWrapper,
  ownerScope,
  ownerId,
  snippetId
) {
  return appliedProgressWrapper.records.filter(
    (record) =>
      record.ownerScope === ownerScope &&
      record.ownerId === ownerId &&
      record.snippetId === snippetId
  );
}

function snippetDecision({
  relativePath,
  target,
  appliedProgressWrapper,
  policyAuthority,
  snippetsById,
  domainsById
}) {
  const snippet = snippetsById.get(target.snippetId);
  if (!snippet) {
    return blocked(
      "snippet_not_found",
      `${relativePath} snippetId '${target.snippetId}' is unresolved`,
      { scope: "snippet", target }
    );
  }
  const snippetMetadataIssue = validateSnippetMetadata(snippet, relativePath);
  if (snippetMetadataIssue) {
    return blocked(snippetMetadataIssue.code, snippetMetadataIssue.message, {
      scope: "snippet",
      target
    });
  }
  const domainResult = activeDomain(snippet.domainId, domainsById, relativePath);
  if (domainResult.issue) {
    return blocked(domainResult.issue.code, domainResult.issue.message, {
      scope: "snippet",
      target
    });
  }

  const matchingProgress = progressForOwnerAndSnippet(
    appliedProgressWrapper,
    target.ownerScope,
    target.ownerId,
    target.snippetId
  );
  if (matchingProgress.length !== 1) {
    return blocked(
      "target_progress_not_found",
      `${relativePath} snippet target must resolve to exactly one applied progress record`,
      { scope: "snippet", target }
    );
  }

  const progressRecord = matchingProgress[0];
  const observed = {
    ...emptyObserved(),
    progressValue: progressRecord.progressValue,
    consumedEvidenceIds: structuredClone(progressRecord.consumedEvidenceIds)
  };
  const snippetRule = policyAuthority.snippetRulesById.get(target.snippetId);
  if (!snippetRule) {
    return blocked(
      "missing_snippet_rule",
      `${relativePath} snippetId '${target.snippetId}' has no explicit completion rule`,
      { scope: "snippet", target, observed }
    );
  }

  observed.requiredProgressValue = snippetRule.requiredProgressValue;
  return completedDecision(
    progressRecord.progressValue >= snippetRule.requiredProgressValue
      ? "candidate"
      : "incomplete",
    "snippet",
    target,
    observed
  );
}

function tierDecision({
  relativePath,
  target,
  appliedProgressWrapper,
  policyAuthority,
  snippetsById,
  domainsById
}) {
  const domainResult = activeDomain(target.domainId, domainsById, relativePath);
  if (domainResult.issue) {
    return blocked(domainResult.issue.code, domainResult.issue.message, {
      scope: "tier",
      target
    });
  }

  const tierRule = policyAuthority.tierRulesByKey.get(
    `${target.domainId}\u0000${target.tier}`
  );
  if (!tierRule) {
    return blocked(
      "missing_tier_rule",
      `${relativePath} domainId '${target.domainId}' tier ${target.tier} has no explicit completion rule`,
      { scope: "tier", target }
    );
  }

  const tierSnippets = [...snippetsById.values()]
    .filter(
      (snippet) =>
        snippet.domainId === target.domainId && snippet.tier === target.tier
    )
    .sort((left, right) => compareStrings(left.id, right.id));
  const countingSnippets = [];
  for (const snippet of tierSnippets) {
    const snippetMetadataIssue = validateSnippetMetadata(snippet, relativePath);
    if (snippetMetadataIssue) {
      return blocked(snippetMetadataIssue.code, snippetMetadataIssue.message, {
        scope: "tier",
        target
      });
    }
    if (snippet.progression.countsTowardTierCompletion) {
      countingSnippets.push(snippet);
    }
  }
  if (countingSnippets.length === 0) {
    return blocked(
      "no_counting_snippets",
      `${relativePath} domainId '${target.domainId}' tier ${target.tier} has no authored tier-counting snippets`,
      { scope: "tier", target }
    );
  }

  let earnedCompletionWeight = 0;
  let availableCompletionWeight = 0;
  for (const snippet of countingSnippets) {
    availableCompletionWeight += snippet.progression.completionWeight;

    const snippetRule = policyAuthority.snippetRulesById.get(snippet.id);
    if (!snippetRule) {
      return blocked(
        "missing_snippet_rule",
        `${relativePath} tier-counting snippetId '${snippet.id}' has no explicit completion rule`,
        { scope: "tier", target }
      );
    }

    const matchingProgress = progressForOwnerAndSnippet(
      appliedProgressWrapper,
      target.ownerScope,
      target.ownerId,
      snippet.id
    );
    if (matchingProgress.length !== 1) {
      return blocked(
        "target_progress_not_found",
        `${relativePath} tier-counting snippetId '${snippet.id}' must resolve to exactly one applied progress record for the target owner`,
        { scope: "tier", target }
      );
    }
    if (
      matchingProgress[0].progressValue >= snippetRule.requiredProgressValue
    ) {
      earnedCompletionWeight += snippet.progression.completionWeight;
    }
  }
  if (availableCompletionWeight === 0) {
    return blocked(
      "no_available_completion_weight",
      `${relativePath} domainId '${target.domainId}' tier ${target.tier} has no positive authored completion weight`,
      { scope: "tier", target }
    );
  }

  const observed = {
    ...emptyObserved(),
    earnedCompletionWeight,
    availableCompletionWeight,
    requiredCompletionWeight: tierRule.requiredCompletionWeight
  };
  return completedDecision(
    earnedCompletionWeight >= tierRule.requiredCompletionWeight
      ? "candidate"
      : "incomplete",
    "tier",
    target,
    observed
  );
}

function domainDecision({
  relativePath,
  target,
  appliedProgressWrapper,
  policyAuthority,
  snippetsById,
  domainsById
}) {
  const domainResult = activeDomain(target.domainId, domainsById, relativePath);
  if (domainResult.issue) {
    return blocked(domainResult.issue.code, domainResult.issue.message, {
      scope: "domain",
      target
    });
  }

  const domainRule = policyAuthority.domainRulesById.get(target.domainId);
  if (!domainRule) {
    return blocked(
      "missing_domain_rule",
      `${relativePath} domainId '${target.domainId}' has no explicit completion rule`,
      { scope: "domain", target }
    );
  }

  let hasIncompleteTier = false;
  for (const tier of domainRule.requiredTiers) {
    const tierResult = tierDecision({
      relativePath,
      target: {
        scope: "tier",
        ownerScope: target.ownerScope,
        ownerId: target.ownerId,
        domainId: target.domainId,
        tier
      },
      appliedProgressWrapper,
      policyAuthority,
      snippetsById,
      domainsById
    });
    if (tierResult.decision === "blocked") {
      return blocked(tierResult.issues[0].code, tierResult.issues[0].message, {
        scope: "domain",
        target
      });
    }
    if (tierResult.decision === "incomplete") {
      hasIncompleteTier = true;
    }
  }

  return completedDecision(
    hasIncompleteTier ? "incomplete" : "candidate",
    "domain",
    target,
    emptyObserved()
  );
}

export function evaluateKnowledgeCompletion(input = {}) {
  if (!isObject(input)) {
    return blocked(
      "invalid_invocation",
      "knowledge completion input must be an object"
    );
  }

  const unsupportedFields = Object.keys(input)
    .filter((field) => !INPUT_FIELDS.has(field))
    .sort();
  if (unsupportedFields.length > 0) {
    return blocked(
      "unsupported_input_fields",
      `knowledge completion does not accept fields: ${unsupportedFields.join(", ")}`
    );
  }

  const {
    relativePath = "knowledge-completion-operation",
    target,
    appliedProgressWrapper,
    currentAcceptedEvidenceWrapper,
    completionPolicyWrapper,
    progressSchema,
    evidenceSchema,
    snippetsWrapper,
    domainRegistryWrapper,
    regionsWrapper,
    settlementsWrapper
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
  const context = {
    scope: normalizedTarget.scope,
    target: normalizedTarget
  };

  if (appliedProgressWrapper === undefined) {
    return blocked(
      "missing_applied_progress",
      `${relativePath} appliedProgressWrapper is required`,
      context
    );
  }
  if (currentAcceptedEvidenceWrapper === undefined) {
    return blocked(
      "missing_current_accepted_evidence",
      `${relativePath} currentAcceptedEvidenceWrapper is required`,
      context
    );
  }
  if (completionPolicyWrapper === undefined) {
    return blocked(
      "missing_completion_policy",
      `${relativePath} completionPolicyWrapper is required`,
      context
    );
  }

  try {
    validateKnowledgeProgress({
      relativePath: `${relativePath} applied progress`,
      wrapper: appliedProgressWrapper,
      progressSchema,
      evidenceSchema,
      snippetsWrapper,
      domainRegistryWrapper,
      evidenceWrapper: currentAcceptedEvidenceWrapper,
      evidenceAuthorities: {
        regionsWrapper,
        settlementsWrapper
      },
      allowZeroStateRecords: true
    });
  } catch (error) {
    return blocked("invalid_applied_progress", error.message, context);
  }

  const policyResult = buildPolicyAuthority(
    completionPolicyWrapper,
    relativePath
  );
  if (policyResult.issue) {
    return blocked(policyResult.issue.code, policyResult.issue.message, context);
  }

  const snippetAuthority = authorityMap(
    snippetsWrapper,
    "snippet",
    relativePath
  );
  if (snippetAuthority.issue) {
    return blocked(
      snippetAuthority.issue.code,
      snippetAuthority.issue.message,
      context
    );
  }
  const domainAuthority = authorityMap(
    domainRegistryWrapper,
    "domain",
    relativePath
  );
  if (domainAuthority.issue) {
    return blocked(
      domainAuthority.issue.code,
      domainAuthority.issue.message,
      context
    );
  }

  const shared = {
    relativePath,
    target: normalizedTarget,
    appliedProgressWrapper,
    policyAuthority: policyResult.authority,
    snippetsById: snippetAuthority.recordsById,
    domainsById: domainAuthority.recordsById
  };

  if (normalizedTarget.scope === "snippet") {
    return snippetDecision(shared);
  }
  if (normalizedTarget.scope === "tier") {
    return tierDecision(shared);
  }
  return domainDecision(shared);
}
