export const BACKSTORY_ELIGIBILITY_POLICY_STATUSES = [
  "always_available",
  "default_available",
  "early_legacy",
  "locked",
  "hidden",
  "special",
  "deferred"
] as const;

export type BackstoryEligibilityAvailabilityStatus =
  (typeof BACKSTORY_ELIGIBILITY_POLICY_STATUSES)[number];

export const BACKSTORY_ELIGIBILITY_TIERS = [
  "tier_1",
  "tier_2",
  "tier_3",
  "special",
  "deferred"
] as const;

export type BackstoryEligibilityTier = (typeof BACKSTORY_ELIGIBILITY_TIERS)[number];

export const BACKSTORY_ELIGIBILITY_SCOPES = [
  "account",
  "family",
  "lineage",
  "character",
  "source_run",
  "region",
  "faction",
  "institution",
  "estate_title",
  "special_manual"
] as const;

export type BackstoryEligibilityScope = (typeof BACKSTORY_ELIGIBILITY_SCOPES)[number];

export const BACKSTORY_ELIGIBILITY_SOURCE_TYPES = [
  "starter_backstory",
  "starter_bundle",
  "earned_play",
  "legacy_purchase",
  "achievement",
  "source_run",
  "family_ledger",
  "chronicle_flag",
  "story_outcome"
] as const;

export type BackstoryEligibilitySourceType =
  (typeof BACKSTORY_ELIGIBILITY_SOURCE_TYPES)[number];

export const BACKSTORY_ELIGIBILITY_MISSING_BEHAVIORS = [
  "treat_as_unmet",
  "hide",
  "defer",
  "use_default_fallback",
  "manual_review"
] as const;

export type BackstoryEligibilityMissingBehavior =
  (typeof BACKSTORY_ELIGIBILITY_MISSING_BEHAVIORS)[number];

export const BACKSTORY_BLOCKED_EVIDENCE_KINDS = [
  "family_skill_maximum",
  "family_backstory_history",
  "heir_legitimacy_status",
  "estate_title_ownership",
  "regional_renown_storage",
  "institutional_membership",
  "patronage_contact_system",
  "adoption",
  "marriage",
  "mounted_behavior",
  "market_economy_effect",
  "magic_licensing_acquisition",
  "medical_injury_system",
  "oath_paladin_behavior"
] as const;

export type BackstoryBlockedEvidenceKind = (typeof BACKSTORY_BLOCKED_EVIDENCE_KINDS)[number];

export const BACKSTORY_REQUIREMENT_KINDS = [
  "achievement",
  "activity_tag",
  "source_run_evidence",
  "chronicle_flag",
  "earned_skill_maximum",
  "skill_threshold",
  "legacy_purchase",
  "echo_requirement",
  "prestige_requirement",
  "profession_history",
  "faction_or_region_reputation",
  "renown_milestone",
  "lineage_title",
  "estate_milestone",
  "institution_acceptance",
  "patronage",
  "adoption",
  "marriage",
  "story_outcome",
  "family_skill_maximum",
  "family_backstory_history",
  "special_case",
  ...BACKSTORY_BLOCKED_EVIDENCE_KINDS
] as const;

export type BackstoryEligibilityRequirementKind =
  (typeof BACKSTORY_REQUIREMENT_KINDS)[number];

export type BackstoryEligibilityScopePolicy = {
  primaryScope: BackstoryEligibilityScope;
  allowedEvidenceScopes?: BackstoryEligibilityScope[];
  accountWideAllowed?: boolean;
};

export type BackstoryEligibilityRequirement = {
  kind: BackstoryEligibilityRequirementKind;
  scope?: BackstoryEligibilityScope;
  scopeId?: string;
  skillId?: string;
  tag?: string;
  achievementId?: string;
  backstoryId?: string;
  minValue?: number;
  sourceTypesAllowed?: BackstoryEligibilitySourceType[];
  starterGrantedAllowed?: boolean;
  requiresEarnedSource?: boolean;
  ownerReadiness?: "ready" | "partial" | "needs_owner" | "blocked" | "manual_only";
  missingBehavior?: BackstoryEligibilityMissingBehavior;
  blockedBehavior?: BackstoryEligibilityMissingBehavior;
  explain?: string;
};

export type BackstoryEligibilityThresholdRequirement = {
  scope: BackstoryEligibilityScope;
  minValue: number;
  scopeId?: string;
  explain?: string;
};

export type BackstoryEligibilityLegacyPurchaseRequirement = {
  unlockId: string;
  scope: BackstoryEligibilityScope;
  evidenceRequired: boolean;
  explain?: string;
};

export type BackstorySelectedBackstoryEffectPolicy = {
  appliesOnlySelectedBackstory: true;
  parentEffectsStack: false;
  previousBackstoriesAreEvidenceOnly: true;
};

export type BackstoryEligibilityRule = {
  backstoryId: string;
  availabilityStatus: BackstoryEligibilityAvailabilityStatus;
  tier: BackstoryEligibilityTier;
  scopePolicy: BackstoryEligibilityScopePolicy;
  requiresAny?: BackstoryEligibilityRequirement[];
  requiresAll?: BackstoryEligibilityRequirement[];
  requiresEvidence?: BackstoryEligibilityRequirement[];
  requiresLegacyPurchase?: BackstoryEligibilityLegacyPurchaseRequirement;
  requiresPrestige?: BackstoryEligibilityThresholdRequirement;
  requiresEcho?: BackstoryEligibilityThresholdRequirement;
  blocksIf?: BackstoryEligibilityRequirement[];
  starterSkillEvidencePolicy?: {
    starterGrantedAllowed: boolean;
    allowedSourceTypes: BackstoryEligibilitySourceType[];
  };
  selectedBackstoryEffectPolicy: BackstorySelectedBackstoryEffectPolicy;
  explainLocked: string;
  explainUnlocked: string;
};

export type BackstoryEligibilityPolicy = {
  schemaVersion: 1;
  policyVersion: string;
  status: "runtime_owned_policy";
  runtimeImportAllowed: true;
  contentVersion: string;
  defaultBackstoryIds: string[];
  availabilityRules: BackstoryEligibilityRule[];
  blockedEvidenceKinds: BackstoryBlockedEvidenceKind[];
};

export type BackstoryEligibilityPolicyValidationIssue = {
  code:
    | "invalid_status"
    | "invalid_runtime_import_flag"
    | "empty_defaults"
    | "missing_default_backstory"
    | "duplicate_rule"
    | "missing_live_rule"
    | "missing_live_backstory"
    | "invalid_availability_status"
    | "invalid_tier"
    | "invalid_scope"
    | "invalid_blocked_evidence"
    | "legacy_purchase_without_evidence"
    | "invalid_selected_effect_policy";
  message: string;
};

const SELECTED_BACKSTORY_EFFECT_POLICY: BackstorySelectedBackstoryEffectPolicy = {
  appliesOnlySelectedBackstory: true,
  parentEffectsStack: false,
  previousBackstoriesAreEvidenceOnly: true
};

export const BACKSTORY_ELIGIBILITY_DEFAULT_BACKSTORY_IDS = [
  "backstory.local",
  "backstory.vagabond",
  "backstory.exile",
  "backstory.farmhand",
  "backstory.amnesiac"
] as const;

const ACCOUNT_SCOPE: BackstoryEligibilityScopePolicy = {
  primaryScope: "account",
  allowedEvidenceScopes: ["account"],
  accountWideAllowed: true
};

const SOURCE_RUN_SCOPE: BackstoryEligibilityScopePolicy = {
  primaryScope: "account",
  allowedEvidenceScopes: ["account", "source_run"],
  accountWideAllowed: true
};

const FAMILY_SOURCE_SCOPE: BackstoryEligibilityScopePolicy = {
  primaryScope: "family",
  allowedEvidenceScopes: ["family", "source_run"],
  accountWideAllowed: false
};

const INSTITUTION_SCOPE: BackstoryEligibilityScopePolicy = {
  primaryScope: "institution",
  allowedEvidenceScopes: ["institution", "source_run"],
  accountWideAllowed: false
};

const ESTATE_TITLE_SCOPE: BackstoryEligibilityScopePolicy = {
  primaryScope: "estate_title",
  allowedEvidenceScopes: ["estate_title", "family", "lineage"],
  accountWideAllowed: false
};

const REGION_SCOPE: BackstoryEligibilityScopePolicy = {
  primaryScope: "region",
  allowedEvidenceScopes: ["region", "source_run"],
  accountWideAllowed: false
};

function baseRule(
  backstoryId: string,
  availabilityStatus: BackstoryEligibilityAvailabilityStatus,
  tier: BackstoryEligibilityTier,
  scopePolicy: BackstoryEligibilityScopePolicy,
  detail: Partial<Omit<BackstoryEligibilityRule, "backstoryId" | "availabilityStatus" | "tier" | "scopePolicy" | "selectedBackstoryEffectPolicy">> = {}
): BackstoryEligibilityRule {
  return {
    backstoryId,
    availabilityStatus,
    tier,
    scopePolicy,
    ...detail,
    selectedBackstoryEffectPolicy: SELECTED_BACKSTORY_EFFECT_POLICY,
    explainLocked:
      detail.explainLocked ?? "This origin needs matching current-data evidence before it can be selected.",
    explainUnlocked: detail.explainUnlocked ?? "This origin is eligible for the current evidence."
  };
}

function defaultRule(backstoryId: string): BackstoryEligibilityRule {
  return baseRule(
    backstoryId,
    "default_available",
    "tier_1",
    ACCOUNT_SCOPE,
    {
      explainLocked: "This default origin is unavailable because its live content record is missing.",
      explainUnlocked: "This default origin is available."
    }
  );
}

function alwaysRule(backstoryId: string): BackstoryEligibilityRule {
  return baseRule(
    backstoryId,
    "always_available",
    "tier_1",
    ACCOUNT_SCOPE,
    {
      explainLocked: "This origin is unavailable because its live content record is missing.",
      explainUnlocked: "This common origin is available."
    }
  );
}

function earlyLegacyRule(
  backstoryId: string,
  evidence: BackstoryEligibilityRequirement[],
  accountLegacyPurchaseAllowed = false
): BackstoryEligibilityRule {
  return baseRule(
    backstoryId,
    "early_legacy",
    "tier_1",
    SOURCE_RUN_SCOPE,
    {
      ...(accountLegacyPurchaseAllowed
        ? {
            requiresLegacyPurchase: {
              unlockId: backstoryId.replace(/^backstory\./, "legacy.backstory."),
              scope: "account" as const,
              evidenceRequired: false,
              explain: "This origin needs matching previous-play evidence that is not currently available."
            }
          }
        : {}),
      requiresAny: evidence,
      explainLocked: "This origin needs simple prior-play evidence before future resolver access.",
      explainUnlocked: "Current evidence supports this early origin."
    }
  );
}

function legacyTierRule(
  backstoryId: string,
  evidence: BackstoryEligibilityRequirement[],
  unlockId: string
): BackstoryEligibilityRule {
  return baseRule(
    backstoryId,
    "locked",
    "tier_2",
    FAMILY_SOURCE_SCOPE,
    {
      requiresLegacyPurchase: {
        unlockId,
        scope: "family",
        evidenceRequired: true,
        explain: "Legacy support is required, but it cannot replace matching evidence."
      },
      requiresAny: evidence,
      explainLocked: "This higher-tier origin needs Legacy support plus matching earned or source-run evidence.",
      explainUnlocked: "Legacy support and matching evidence make this origin eligible."
    }
  );
}

export const BACKSTORY_ELIGIBILITY_POLICY: BackstoryEligibilityPolicy = {
  schemaVersion: 1,
  policyVersion: "0.5.56",
  status: "runtime_owned_policy",
  runtimeImportAllowed: true,
  contentVersion: "current-live-backstories-27",
  defaultBackstoryIds: [...BACKSTORY_ELIGIBILITY_DEFAULT_BACKSTORY_IDS],
  blockedEvidenceKinds: [...BACKSTORY_BLOCKED_EVIDENCE_KINDS],
  availabilityRules: [
    defaultRule("backstory.local"),
    defaultRule("backstory.vagabond"),
    defaultRule("backstory.exile"),
    legacyTierRule(
      "backstory.merchants_child",
      [
        { kind: "source_run_evidence", scope: "source_run", tag: "trade_history" },
        {
          kind: "earned_skill_maximum",
          scope: "source_run",
          skillId: "skill.settlement.trade",
          minValue: 25,
          sourceTypesAllowed: ["earned_play", "source_run"],
          starterGrantedAllowed: false,
          requiresEarnedSource: true
        }
      ],
      "legacy.backstory.merchant_family"
    ),
    alwaysRule("backstory.craftsmans_child"),
    baseRule(
      "backstory.performer",
      "deferred",
      "deferred",
      INSTITUTION_SCOPE,
      {
        blocksIf: [{ kind: "magic_licensing_acquisition", blockedBehavior: "defer" }],
        explainLocked: "Performance magic ownership is not ready for resolver use.",
        explainUnlocked: "Performance institution ownership is available."
      }
    ),
    baseRule(
      "backstory.minor_noble",
      "deferred",
      "tier_3",
      ESTATE_TITLE_SCOPE,
      {
        requiresPrestige: { scope: "family", minValue: 3 },
        blocksIf: [
          { kind: "estate_title_ownership", blockedBehavior: "defer" },
          { kind: "heir_legitimacy_status", blockedBehavior: "defer" }
        ],
        explainLocked: "Noble status needs estate, title, family, or lineage ownership before resolver use.",
        explainUnlocked: "Estate or title evidence supports this origin."
      }
    ),
    legacyTierRule(
      "backstory.carpenters_child",
      [
        { kind: "source_run_evidence", scope: "source_run", tag: "carpentry_history" },
        {
          kind: "earned_skill_maximum",
          scope: "source_run",
          skillId: "skill.crafting.carpentry",
          minValue: 25,
          sourceTypesAllowed: ["earned_play", "source_run"],
          starterGrantedAllowed: false,
          requiresEarnedSource: true
        }
      ],
      "legacy.backstory.carpenter_household"
    ),
    legacyTierRule(
      "backstory.village_hunter",
      [
        { kind: "source_run_evidence", scope: "source_run", tag: "hunting_history" },
        {
          kind: "earned_skill_maximum",
          scope: "source_run",
          skillId: "skill.resource.hunting",
          minValue: 25,
          sourceTypesAllowed: ["earned_play", "source_run"],
          starterGrantedAllowed: false,
          requiresEarnedSource: true
        }
      ],
      "legacy.backstory.village_hunter"
    ),
    legacyTierRule(
      "backstory.miners_kin",
      [
        { kind: "source_run_evidence", scope: "source_run", tag: "mining_history" },
        {
          kind: "earned_skill_maximum",
          scope: "source_run",
          skillId: "skill.resource.mining",
          minValue: 25,
          sourceTypesAllowed: ["earned_play", "source_run"],
          starterGrantedAllowed: false,
          requiresEarnedSource: true
        }
      ],
      "legacy.backstory.miners_kin"
    ),
    defaultRule("backstory.farmhand"),
    legacyTierRule(
      "backstory.military_brat",
      [
        { kind: "source_run_evidence", scope: "source_run", tag: "militia_service" },
        {
          kind: "earned_skill_maximum",
          scope: "source_run",
          skillId: "skill.combat.tactics.formation_discipline",
          minValue: 25,
          sourceTypesAllowed: ["earned_play", "source_run"],
          starterGrantedAllowed: false,
          requiresEarnedSource: true
        }
      ],
      "legacy.backstory.garrison_ward"
    ),
    alwaysRule("backstory.gutter_rat"),
    legacyTierRule(
      "backstory.scouts_ward",
      [
        { kind: "source_run_evidence", scope: "source_run", tag: "scouting_history" },
        {
          kind: "earned_skill_maximum",
          scope: "source_run",
          skillId: "skill.survival.navigation",
          minValue: 25,
          sourceTypesAllowed: ["earned_play", "source_run"],
          starterGrantedAllowed: false,
          requiresEarnedSource: true
        }
      ],
      "legacy.backstory.scouts_ward"
    ),
    baseRule(
      "backstory.scholars_apprentice",
      "deferred",
      "deferred",
      INSTITUTION_SCOPE,
      {
        blocksIf: [
          { kind: "institutional_membership", blockedBehavior: "defer" },
          { kind: "magic_licensing_acquisition", blockedBehavior: "defer" }
        ],
        explainLocked: "Scholar institution and magic ownership are not ready for resolver use.",
        explainUnlocked: "Scholar institution evidence supports this origin."
      }
    ),
    baseRule(
      "backstory.temple_acolyte",
      "deferred",
      "deferred",
      INSTITUTION_SCOPE,
      {
        blocksIf: [
          { kind: "institutional_membership", blockedBehavior: "defer" },
          { kind: "magic_licensing_acquisition", blockedBehavior: "defer" },
          { kind: "oath_paladin_behavior", blockedBehavior: "defer" }
        ],
        explainLocked: "Temple, divine magic, and oath ownership are not ready for resolver use.",
        explainUnlocked: "Temple institution evidence supports this origin."
      }
    ),
    baseRule(
      "backstory.hedge_adept",
      "deferred",
      "deferred",
      INSTITUTION_SCOPE,
      {
        blocksIf: [{ kind: "magic_licensing_acquisition", blockedBehavior: "defer" }],
        explainLocked: "Magic acquisition ownership is not ready for resolver use.",
        explainUnlocked: "Magic ownership supports this origin."
      }
    ),
    baseRule(
      "backstory.isekai_outcast",
      "special",
      "special",
      { primaryScope: "special_manual", allowedEvidenceScopes: ["special_manual"], accountWideAllowed: false },
      {
        blocksIf: [{ kind: "special_case", missingBehavior: "manual_review" }],
        explainLocked: "This special narrative origin needs manual narrative ownership.",
        explainUnlocked: "A narrative owner allows this special origin."
      }
    ),
    defaultRule("backstory.amnesiac"),
    earlyLegacyRule("backstory.militia_levy", [
      { kind: "source_run_evidence", scope: "source_run", tag: "civic_alarm_or_formation_drill" },
      { kind: "achievement", scope: "account", achievementId: "achievement.account.first_chronicle" }
    ]),
    earlyLegacyRule("backstory.street_vendor", [
      { kind: "achievement", scope: "account", achievementId: "achievement.account.market_memory" },
      { kind: "source_run_evidence", scope: "source_run", tag: "market_service" }
    ], true),
    earlyLegacyRule("backstory.net_tender", [
      { kind: "source_run_evidence", scope: "source_run", tag: "water_work" },
      {
        kind: "earned_skill_maximum",
        scope: "source_run",
        skillId: "skill.resource.fishing",
        minValue: 15,
        sourceTypesAllowed: ["earned_play", "source_run"],
        starterGrantedAllowed: false,
        requiresEarnedSource: true
      }
    ], true),
    earlyLegacyRule("backstory.gatherer", [
      { kind: "source_run_evidence", scope: "source_run", tag: "field_gathering" },
      {
        kind: "earned_skill_maximum",
        scope: "source_run",
        skillId: "skill.resource.gathering",
        minValue: 15,
        sourceTypesAllowed: ["earned_play", "source_run"],
        starterGrantedAllowed: false,
        requiresEarnedSource: true
      }
    ], true),
    earlyLegacyRule("backstory.scribes_apprentice", [
      { kind: "source_run_evidence", scope: "source_run", tag: "records_work" },
      {
        kind: "earned_skill_maximum",
        scope: "source_run",
        skillId: "skill.settlement.administration",
        minValue: 15,
        sourceTypesAllowed: ["earned_play", "source_run"],
        starterGrantedAllowed: false,
        requiresEarnedSource: true
      }
    ], true),
    earlyLegacyRule("backstory.drovers_hand", [
      { kind: "source_run_evidence", scope: "source_run", tag: "animal_labor" },
      {
        kind: "earned_skill_maximum",
        scope: "source_run",
        skillId: "skill.survival.animal_handling",
        minValue: 15,
        sourceTypesAllowed: ["earned_play", "source_run"],
        starterGrantedAllowed: false,
        requiresEarnedSource: true
      }
    ]),
    earlyLegacyRule("backstory.kitchen_hand", [
      { kind: "source_run_evidence", scope: "source_run", tag: "kitchen_service" },
      {
        kind: "earned_skill_maximum",
        scope: "source_run",
        skillId: "skill.crafting.cooking",
        minValue: 15,
        sourceTypesAllowed: ["earned_play", "source_run"],
        starterGrantedAllowed: false,
        requiresEarnedSource: true
      }
    ], true),
    baseRule(
      "backstory.local_hero",
      "special",
      "special",
      REGION_SCOPE,
      {
        requiresAny: [
          { kind: "renown_milestone", scope: "region", tag: "local_champion", ownerReadiness: "partial" },
          { kind: "story_outcome", scope: "region", tag: "local_champion", ownerReadiness: "needs_owner" }
        ],
        explainLocked: "Local champion status needs region-scoped renown or story ownership.",
        explainUnlocked: "Region-scoped evidence supports this special origin."
      }
    )
  ]
};

function isAvailabilityStatus(value: string): value is BackstoryEligibilityAvailabilityStatus {
  return BACKSTORY_ELIGIBILITY_POLICY_STATUSES.includes(
    value as BackstoryEligibilityAvailabilityStatus
  );
}

function isTier(value: string): value is BackstoryEligibilityTier {
  return BACKSTORY_ELIGIBILITY_TIERS.includes(value as BackstoryEligibilityTier);
}

function isScope(value: string): value is BackstoryEligibilityScope {
  return BACKSTORY_ELIGIBILITY_SCOPES.includes(value as BackstoryEligibilityScope);
}

function isBlockedEvidenceKind(value: string): value is BackstoryBlockedEvidenceKind {
  return BACKSTORY_BLOCKED_EVIDENCE_KINDS.includes(value as BackstoryBlockedEvidenceKind);
}

function hasRuntimeEvidenceRequirement(rule: BackstoryEligibilityRule): boolean {
  return (
    (rule.requiresAny?.length ?? 0) > 0 ||
    (rule.requiresAll?.length ?? 0) > 0 ||
    (rule.requiresEvidence?.length ?? 0) > 0
  );
}

export function validateBackstoryEligibilityPolicy(
  policy: BackstoryEligibilityPolicy,
  liveBackstoryIds: Iterable<string>
): BackstoryEligibilityPolicyValidationIssue[] {
  const issues: BackstoryEligibilityPolicyValidationIssue[] = [];
  const liveIds = new Set(liveBackstoryIds);
  const seenRuleIds = new Set<string>();
  const ruleIds = new Set(policy.availabilityRules.map((rule) => rule.backstoryId));

  if (policy.status !== "runtime_owned_policy") {
    issues.push({
      code: "invalid_status",
      message: "Backstory eligibility policy must be runtime owned."
    });
  }

  if (policy.runtimeImportAllowed !== true) {
    issues.push({
      code: "invalid_runtime_import_flag",
      message: "Runtime-owned backstory eligibility policy must be importable by runtime."
    });
  }

  if (policy.defaultBackstoryIds.length === 0) {
    issues.push({
      code: "empty_defaults",
      message: "Backstory eligibility policy must define a non-empty default set."
    });
  }

  for (const defaultId of policy.defaultBackstoryIds) {
    if (!liveIds.has(defaultId)) {
      issues.push({
        code: "missing_default_backstory",
        message: `Default backstory '${defaultId}' is not a live backstory id.`
      });
    }
  }

  for (const blockedKind of policy.blockedEvidenceKinds) {
    if (!isBlockedEvidenceKind(blockedKind)) {
      issues.push({
        code: "invalid_blocked_evidence",
        message: `Blocked evidence kind '${blockedKind}' is not part of the approved blocked evidence vocabulary.`
      });
    }
  }

  for (const rule of policy.availabilityRules) {
    if (seenRuleIds.has(rule.backstoryId)) {
      issues.push({
        code: "duplicate_rule",
        message: `Backstory eligibility policy repeats rule '${rule.backstoryId}'.`
      });
    }
    seenRuleIds.add(rule.backstoryId);

    if (!liveIds.has(rule.backstoryId)) {
      issues.push({
        code: "missing_live_backstory",
        message: `Backstory eligibility rule '${rule.backstoryId}' is not a live backstory id.`
      });
    }

    if (!isAvailabilityStatus(rule.availabilityStatus)) {
      issues.push({
        code: "invalid_availability_status",
        message: `Backstory eligibility rule '${rule.backstoryId}' uses invalid status '${rule.availabilityStatus}'.`
      });
    }

    if (!isTier(rule.tier)) {
      issues.push({
        code: "invalid_tier",
        message: `Backstory eligibility rule '${rule.backstoryId}' uses invalid tier '${rule.tier}'.`
      });
    }

    const scopes = [
      rule.scopePolicy.primaryScope,
      ...(rule.scopePolicy.allowedEvidenceScopes ?? [])
    ];
    for (const scope of scopes) {
      if (!isScope(scope)) {
        issues.push({
          code: "invalid_scope",
          message: `Backstory eligibility rule '${rule.backstoryId}' uses invalid scope '${scope}'.`
        });
      }
    }

    if (
      (rule.tier === "tier_2" || rule.tier === "tier_3") &&
      rule.requiresLegacyPurchase &&
      !hasRuntimeEvidenceRequirement(rule)
    ) {
      issues.push({
        code: "legacy_purchase_without_evidence",
        message: `Backstory eligibility rule '${rule.backstoryId}' cannot use Legacy purchase as the only Tier 2/Tier 3 requirement.`
      });
    }

    if (
      rule.selectedBackstoryEffectPolicy.appliesOnlySelectedBackstory !== true ||
      rule.selectedBackstoryEffectPolicy.parentEffectsStack !== false ||
      rule.selectedBackstoryEffectPolicy.previousBackstoriesAreEvidenceOnly !== true
    ) {
      issues.push({
        code: "invalid_selected_effect_policy",
        message: `Backstory eligibility rule '${rule.backstoryId}' must keep selected backstory effects non-stacking.`
      });
    }
  }

  for (const liveId of liveIds) {
    if (!ruleIds.has(liveId)) {
      issues.push({
        code: "missing_live_rule",
        message: `Live backstory '${liveId}' has no eligibility rule.`
      });
    }
  }

  return issues;
}
