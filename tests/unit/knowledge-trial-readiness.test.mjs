import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { evaluateKnowledgeTrialReadiness } from "../../tools/content-lint/knowledge-trial-readiness.mjs";

const ROOT = process.cwd();
const OPERATION_PATH = "tests/in-memory/knowledge-trial-readiness";
const OWNER_ID = "character.test_subject";
const READINESS_POLICY_ID = "knowledge_trial_readiness_policy.flora.tier_1";
const ELIGIBILITY_POLICY_ID = "knowledge_trial_policy.flora.tier_1";
const DOMAIN_ID = "knowledge_domain.flora";

const ELIGIBILITY_SAFETY = {
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
};

const READINESS_SAFETY = {
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
};

const DOMAIN_REGISTRY = {
  records: [
    { id: DOMAIN_ID, status: "active" },
    { id: "knowledge_domain.fauna", status: "active" },
    { id: "knowledge_domain.inactive", status: "planned" },
    { id: "knowledge_domain.arcane_lore", status: "planned" }
  ]
};

function target({
  ownerScope = "character",
  ownerId = OWNER_ID,
  readinessPolicyId = READINESS_POLICY_ID,
  eligibilityPolicyId = ELIGIBILITY_POLICY_ID,
  scope = "tier",
  domainId = DOMAIN_ID,
  tier = 1
} = {}) {
  const value = {
    ownerScope,
    ownerId,
    readinessPolicyId,
    eligibilityPolicyId,
    scope,
    domainId
  };
  if (scope === "tier") {
    value.tier = tier;
  }
  return value;
}

function requirement({
  scope = "tier",
  domainId = DOMAIN_ID,
  tier = 1
} = {}) {
  if (scope === "domain") {
    return { scope, domainId, requiredDecision: "candidate" };
  }
  return { scope, domainId, tier, requiredDecision: "candidate" };
}

function eligibilityEnvelope({
  selectedTarget = target(),
  decision = "eligible_candidate",
  phase = "eligibility",
  safety = ELIGIBILITY_SAFETY
} = {}) {
  const required = [requirement({
    scope: selectedTarget.scope,
    domainId: selectedTarget.domainId,
    tier: selectedTarget.tier
  })];
  return {
    phase,
    decision,
    target: {
      ownerScope: selectedTarget.ownerScope,
      ownerId: selectedTarget.ownerId,
      policyId: selectedTarget.eligibilityPolicyId,
      scope: selectedTarget.scope,
      domainId: selectedTarget.domainId,
      tier: selectedTarget.scope === "domain" ? null : selectedTarget.tier
    },
    observed: {
      requiredCompletionTargets: required,
      satisfiedCompletionTargets:
        decision === "eligible_candidate" ? structuredClone(required) : [],
      failedCompletionTargets:
        decision === "not_eligible" ? structuredClone(required) : [],
      readinessPolicyStatus: "not_evaluated",
      attemptConstraintStatus: "not_evaluated",
      cooldownConstraintStatus: "not_evaluated",
      rewardRefs: []
    },
    issues:
      decision === "eligible_candidate"
        ? []
        : [{ code: "eligibility_blocked", message: "Eligibility did not pass." }],
    safety: structuredClone(safety)
  };
}

function policyRecord({
  selectedTarget = target(),
  status = "active",
  attemptPolicy = { mode: "none" },
  cooldownPolicy = { mode: "none" },
  availabilityPolicy = { mode: "always" },
  sequenceTimePolicy = { mode: "none" },
  rewardRefs = []
} = {}) {
  const record = {
    readinessPolicyId: selectedTarget.readinessPolicyId,
    eligibilityPolicyId: selectedTarget.eligibilityPolicyId,
    status,
    ownerScope: selectedTarget.ownerScope,
    ownerId: selectedTarget.ownerId,
    scope: selectedTarget.scope,
    domainId: selectedTarget.domainId,
    requiredEligibilityDecision: "eligible_candidate",
    attemptPolicy: structuredClone(attemptPolicy),
    cooldownPolicy: structuredClone(cooldownPolicy),
    availabilityPolicy: structuredClone(availabilityPolicy),
    prerequisiteReadinessGates: [],
    sequenceTimePolicy: structuredClone(sequenceTimePolicy),
    rewardRefs: structuredClone(rewardRefs)
  };
  if (selectedTarget.scope === "tier") {
    record.tier = selectedTarget.tier;
  }
  return record;
}

function authorityIdentity(selectedTarget = target()) {
  return {
    ownerScope: selectedTarget.ownerScope,
    ownerId: selectedTarget.ownerId,
    readinessPolicyId: selectedTarget.readinessPolicyId,
    eligibilityPolicyId: selectedTarget.eligibilityPolicyId,
    scope: selectedTarget.scope,
    domainId: selectedTarget.domainId,
    tier: selectedTarget.scope === "domain" ? null : selectedTarget.tier
  };
}

function attemptRecord({
  selectedTarget = target(),
  attemptId = "knowledge_trial_attempt.flora.first",
  status = "failed"
} = {}) {
  return {
    attemptId,
    ...authorityIdentity(selectedTarget),
    status,
    sequenceValue: 4,
    timeValue: null
  };
}

function cooldownRecord({
  selectedTarget = target(),
  cooldownId = "knowledge_trial_cooldown.flora.first",
  unit = "sequence",
  startValue = 4,
  endValue = 7
} = {}) {
  return {
    cooldownId,
    ...authorityIdentity(selectedTarget),
    sourceAttemptId: "knowledge_trial_attempt.flora.first",
    unit,
    startValue,
    endValue
  };
}

function availabilityRecord({
  selectedTarget = target(),
  availabilityId = "knowledge_trial_availability.flora.current",
  status = "open"
} = {}) {
  return {
    availabilityId,
    ...authorityIdentity(selectedTarget),
    status
  };
}

function makeInput({
  selectedTarget = target(),
  envelope,
  policies,
  attempts,
  cooldowns,
  availability,
  sequenceTimeAuthority,
  domainRegistryWrapper = DOMAIN_REGISTRY,
  overrides = {}
} = {}) {
  return {
    relativePath: OPERATION_PATH,
    target: structuredClone(selectedTarget),
    eligibilityEnvelope: structuredClone(
      envelope ?? eligibilityEnvelope({ selectedTarget })
    ),
    trialReadinessPolicyWrapper: {
      records: structuredClone(
        policies ?? [policyRecord({ selectedTarget })]
      )
    },
    domainRegistryWrapper: structuredClone(domainRegistryWrapper),
    ...(attempts === undefined
      ? {}
      : { attemptAuthorityWrapper: { records: structuredClone(attempts) } }),
    ...(cooldowns === undefined
      ? {}
      : { cooldownAuthorityWrapper: { records: structuredClone(cooldowns) } }),
    ...(availability === undefined
      ? {}
      : {
          availabilityAuthorityWrapper: {
            records: structuredClone(availability)
          }
        }),
    ...(sequenceTimeAuthority === undefined
      ? {}
      : { sequenceTimeAuthority: structuredClone(sequenceTimeAuthority) }),
    ...structuredClone(overrides)
  };
}

test("aligned authority returns ready_candidate", () => {
  const result = evaluateKnowledgeTrialReadiness(makeInput());

  assert.equal(result.phase, "readiness");
  assert.equal(result.decision, "ready_candidate");
  assert.equal(result.observed.readinessPolicyStatus, "active");
  assert.equal(result.observed.attemptConstraintStatus, "pass");
  assert.equal(result.observed.cooldownConstraintStatus, "pass");
  assert.equal(result.observed.availabilityStatus, "pass");
  assert.equal(result.observed.sequenceOrTimeStatus, "pass");
  assert.deepEqual(result.issues, []);
});

test("domain readiness preserves tier null", () => {
  const selectedTarget = target({
    scope: "domain",
    readinessPolicyId: "knowledge_trial_readiness_policy.flora.domain",
    eligibilityPolicyId: "knowledge_trial_policy.flora.domain"
  });
  const result = evaluateKnowledgeTrialReadiness(
    makeInput({ selectedTarget })
  );

  assert.equal(result.decision, "ready_candidate");
  assert.equal(result.target.tier, null);
});

test("tier readiness preserves tier", () => {
  assert.equal(
    evaluateKnowledgeTrialReadiness(makeInput()).target.tier,
    1
  );
});

test("passing explicit attempt authority returns ready_candidate", () => {
  const attemptPolicy = {
    mode: "max_attempts",
    maxAttempts: 2,
    countStatuses: ["failed"]
  };
  const result = evaluateKnowledgeTrialReadiness(
    makeInput({
      policies: [policyRecord({ attemptPolicy })],
      attempts: [attemptRecord()]
    })
  );

  assert.equal(result.decision, "ready_candidate");
});

test("expired cooldown with sequence authority returns ready_candidate", () => {
  const cooldownPolicy = {
    mode: "sequence_window",
    unit: "sequence",
    requiredElapsed: 3,
    sourceStatus: "failed"
  };
  const sequenceTimePolicy = {
    mode: "required",
    authorityId: "knowledge_sequence.character",
    unit: "sequence"
  };
  const result = evaluateKnowledgeTrialReadiness(
    makeInput({
      policies: [policyRecord({ cooldownPolicy, sequenceTimePolicy })],
      cooldowns: [cooldownRecord()],
      sequenceTimeAuthority: {
        authorityId: "knowledge_sequence.character",
        ownerScope: "character",
        ownerId: OWNER_ID,
        unit: "sequence",
        value: 7
      }
    })
  );

  assert.equal(result.decision, "ready_candidate");
});

test("open explicit availability returns ready_candidate", () => {
  const result = evaluateKnowledgeTrialReadiness(
    makeInput({
      policies: [
        policyRecord({ availabilityPolicy: { mode: "explicit_gate" } })
      ],
      availability: [availabilityRecord()]
    })
  );

  assert.equal(result.decision, "ready_candidate");
});

for (const [name, input, blockerCode] of [
  [
    "missing readiness policy",
    makeInput({ policies: [] }),
    "readiness_policy_missing"
  ],
  [
    "deferred readiness policy",
    makeInput({ policies: [policyRecord({ status: "deferred" })] }),
    "readiness_policy_deferred"
  ],
  [
    "reached attempt limit",
    makeInput({
      policies: [
        policyRecord({
          attemptPolicy: {
            mode: "max_attempts",
            maxAttempts: 1,
            countStatuses: ["failed"]
          }
        })
      ],
      attempts: [attemptRecord()]
    }),
    "attempt_limit_reached"
  ],
  [
    "closed availability",
    makeInput({
      policies: [
        policyRecord({ availabilityPolicy: { mode: "explicit_gate" } })
      ],
      availability: [availabilityRecord({ status: "closed" })]
    }),
    "availability_closed"
  ],
  [
    "missing required attempt authority",
    makeInput({
      policies: [
        policyRecord({
          attemptPolicy: {
            mode: "max_attempts",
            maxAttempts: 1,
            countStatuses: ["failed"]
          }
        })
      ]
    }),
    "attempt_authority_missing"
  ],
  [
    "missing required sequence authority",
    makeInput({
      policies: [
        policyRecord({
          sequenceTimePolicy: {
            mode: "required",
            authorityId: "knowledge_sequence.character",
            unit: "sequence"
          }
        })
      ]
    }),
    "sequence_time_authority_missing"
  ]
]) {
  test(`${name} returns not_ready`, () => {
    const result = evaluateKnowledgeTrialReadiness(input);
    assert.equal(result.decision, "not_ready");
    assert.ok(
      result.observed.readinessBlockers.some(
        (entry) => entry.code === blockerCode
      )
    );
  });
}

test("active cooldown and sequence outside the gate return not_ready", () => {
  const result = evaluateKnowledgeTrialReadiness(
    makeInput({
      policies: [
        policyRecord({
          cooldownPolicy: {
            mode: "sequence_window",
            unit: "sequence",
            requiredElapsed: 3,
            sourceStatus: "failed"
          },
          sequenceTimePolicy: {
            mode: "required",
            authorityId: "knowledge_sequence.character",
            unit: "sequence"
          }
        })
      ],
      cooldowns: [cooldownRecord()],
      sequenceTimeAuthority: {
        authorityId: "knowledge_sequence.character",
        ownerScope: "character",
        ownerId: OWNER_ID,
        unit: "sequence",
        value: 6
      }
    })
  );

  assert.equal(result.decision, "not_ready");
  assert.equal(result.observed.cooldownConstraintStatus, "fail");
  assert.equal(result.observed.readinessBlockers[0].code, "cooldown_active");
});

for (const [name, mutate, expectedCode] of [
  [
    "malformed eligibility envelope",
    (input) => {
      delete input.eligibilityEnvelope.observed;
    },
    "invalid_eligibility_envelope"
  ],
  [
    "missing eligibility safety flag",
    (input) => {
      delete input.eligibilityEnvelope.safety.noRewardGrant;
    },
    "unsafe_eligibility_envelope"
  ],
  [
    "false eligibility safety flag",
    (input) => {
      input.eligibilityEnvelope.safety.noRuntimeEffect = false;
    },
    "unsafe_eligibility_envelope"
  ],
  [
    "unsupported eligibility phase",
    (input) => {
      input.eligibilityEnvelope.phase = "readiness";
    },
    "invalid_eligibility_envelope"
  ],
  [
    "unsupported eligibility decision",
    (input) => {
      input.eligibilityEnvelope.decision = "ready";
    },
    "invalid_eligibility_envelope"
  ],
  [
    "malformed readiness policy",
    (input) => {
      input.trialReadinessPolicyWrapper.records[0].runtimeState = {};
    },
    "invalid_trial_readiness_policy"
  ],
  [
    "unsupported readiness policy status",
    (input) => {
      input.trialReadinessPolicyWrapper.records[0].status = "retired";
    },
    "unsupported_trial_readiness_policy_status"
  ],
  [
    "unsupported owner scope",
    (input) => {
      input.target.ownerScope = "institution";
    },
    "unsupported_owner_scope"
  ],
  [
    "malformed sequence authority",
    (input) => {
      input.sequenceTimeAuthority = { authorityId: "bad" };
    },
    "invalid_sequence_time_authority"
  ],
  [
    "sequence authority id mismatch",
    (input) => {
      input.trialReadinessPolicyWrapper.records[0].sequenceTimePolicy = {
        mode: "required",
        authorityId: "knowledge_sequence.required",
        unit: "sequence"
      };
      input.sequenceTimeAuthority = {
        authorityId: "knowledge_sequence.other",
        ownerScope: "character",
        ownerId: OWNER_ID,
        unit: "sequence",
        value: 1
      };
    },
    "sequence_time_authority_mismatch"
  ],
  [
    "unsupported sequence unit",
    (input) => {
      input.sequenceTimeAuthority = {
        authorityId: "knowledge_sequence.character",
        ownerScope: "character",
        ownerId: OWNER_ID,
        unit: "week",
        value: 1
      };
    },
    "invalid_sequence_time_authority"
  ]
]) {
  test(`${name} blocks`, () => {
    const input = makeInput();
    mutate(input);
    const result = evaluateKnowledgeTrialReadiness(input);
    assert.equal(result.decision, "blocked");
    assert.equal(result.issues[0].code, expectedCode);
  });
}

for (const decision of ["not_eligible", "blocked"]) {
  test(`active policy blocks ${decision} eligibility`, () => {
    const result = evaluateKnowledgeTrialReadiness(
      makeInput({ envelope: eligibilityEnvelope({ decision }) })
    );
    assert.equal(result.decision, "blocked");
    assert.equal(result.issues[0].code, "eligibility_decision_not_accepted");
  });
}

test("duplicate and conflicting readiness policies block", () => {
  const first = policyRecord();
  let result = evaluateKnowledgeTrialReadiness(
    makeInput({ policies: [first, structuredClone(first)] })
  );
  assert.equal(result.issues[0].code, "duplicate_trial_readiness_policy");

  const second = policyRecord({ rewardRefs: ["reward.knowledge.flora"] });
  result = evaluateKnowledgeTrialReadiness(
    makeInput({ policies: [first, second] })
  );
  assert.equal(result.issues[0].code, "conflicting_trial_readiness_policy");
});

for (const [name, selectedTarget, registry, expectedCode] of [
  [
    "unresolved domain",
    target({ domainId: "knowledge_domain.unknown" }),
    DOMAIN_REGISTRY,
    "domain_not_found"
  ],
  [
    "inactive domain",
    target({ domainId: "knowledge_domain.inactive" }),
    DOMAIN_REGISTRY,
    "domain_not_active"
  ],
  [
    "Arcane Lore",
    target({ domainId: "knowledge_domain.arcane_lore" }),
    DOMAIN_REGISTRY,
    "arcane_lore_blocked"
  ]
]) {
  test(`${name} blocks`, () => {
    const result = evaluateKnowledgeTrialReadiness(
      makeInput({ selectedTarget, domainRegistryWrapper: registry })
    );
    assert.equal(result.decision, "blocked");
    assert.equal(result.issues[0].code, expectedCode);
  });
}

test("Arcane Lore eligibility target blocks", () => {
  const selectedTarget = target({ domainId: "knowledge_domain.arcane_lore" });
  const result = evaluateKnowledgeTrialReadiness(
    makeInput({
      selectedTarget,
      envelope: eligibilityEnvelope({ selectedTarget })
    })
  );
  assert.equal(result.issues[0].code, "arcane_lore_blocked");
});

for (const kind of ["attempt", "cooldown", "availability"]) {
  test(`malformed ${kind} authority blocks`, () => {
    const input = makeInput();
    input[`${kind}AuthorityWrapper`] = { records: [{}] };
    const result = evaluateKnowledgeTrialReadiness(input);
    assert.equal(result.decision, "blocked");
    assert.equal(result.issues[0].code, `invalid_${kind}_authority`);
  });

  test(`duplicate ${kind} authority blocks`, () => {
    const record =
      kind === "attempt"
        ? attemptRecord()
        : kind === "cooldown"
          ? cooldownRecord()
          : availabilityRecord();
    const input = makeInput();
    input[`${kind}AuthorityWrapper`] = {
      records: [record, structuredClone(record)]
    };
    const result = evaluateKnowledgeTrialReadiness(input);
    assert.equal(result.decision, "blocked");
    assert.equal(result.issues[0].code, `duplicate_${kind}_authority`);
  });

  for (const mismatch of ["owner", "domain", "tier"]) {
    test(`${kind} ${mismatch} mismatch blocks`, () => {
      const record =
        kind === "attempt"
          ? attemptRecord()
          : kind === "cooldown"
            ? cooldownRecord()
            : availabilityRecord();
      if (mismatch === "owner") {
        record.ownerId = "character.other_subject";
      } else if (mismatch === "domain") {
        record.domainId = "knowledge_domain.fauna";
      } else {
        record.tier = 2;
      }
      const input = makeInput();
      input[`${kind}AuthorityWrapper`] = { records: [record] };
      const result = evaluateKnowledgeTrialReadiness(input);
      assert.equal(result.decision, "blocked");
      assert.equal(
        result.issues[0].code,
        `${kind}_authority_target_mismatch`
      );
    });
  }
}

for (const shortcutField of [
  "completionEnvelopes",
  "completionPolicyWrapper",
  "trialEligibilityPolicyWrapper",
  "appliedProgressWrapper",
  "currentAcceptedEvidenceWrapper",
  "progressSchema",
  "evidenceSchema",
  "snippetsWrapper",
  "regionsWrapper",
  "settlementsWrapper",
  "passiveLocation",
  "inventory",
  "skillState",
  "spellState",
  "accountState",
  "familyState",
  "institutionState",
  "saveState",
  "sessionState",
  "runtimeState",
  "uiState",
  "completionState",
  "eligibilityState",
  "readinessState",
  "trialState",
  "attemptState",
  "cooldownState",
  "rewardState",
  "generatedOutput",
  "gameplay"
]) {
  test(`unsupported shortcut '${shortcutField}' blocks`, () => {
    const result = evaluateKnowledgeTrialReadiness(
      makeInput({ overrides: { [shortcutField]: {} } })
    );
    assert.equal(result.decision, "blocked");
    assert.equal(result.issues[0].code, "unsupported_input_fields");
  });
}

test("rewardRefs are inert reported metadata", () => {
  const rewardRefs = [
    "reward.knowledge.flora_title",
    "reward.knowledge.flora_mastery"
  ];
  const result = evaluateKnowledgeTrialReadiness(
    makeInput({ policies: [policyRecord({ rewardRefs })] })
  );

  assert.equal(result.decision, "ready_candidate");
  assert.deepEqual(result.observed.rewardRefs, [...rewardRefs].sort());
  assert.equal(result.safety.noRewardGrant, true);
});

test("result returns exact readiness safety flags", () => {
  assert.deepEqual(
    evaluateKnowledgeTrialReadiness(makeInput()).safety,
    READINESS_SAFETY
  );
});

test("equivalent record ordering is deterministic", () => {
  const policy = policyRecord({
    attemptPolicy: {
      mode: "max_attempts",
      maxAttempts: 3,
      countStatuses: ["failed", "cancelled"]
    }
  });
  const attempts = [
    attemptRecord(),
    attemptRecord({
      attemptId: "knowledge_trial_attempt.flora.second",
      status: "cancelled"
    })
  ];
  const first = makeInput({ policies: [policy], attempts });
  const second = makeInput({
    policies: [policy],
    attempts: [...attempts].reverse()
  });

  assert.deepEqual(
    evaluateKnowledgeTrialReadiness(first),
    evaluateKnowledgeTrialReadiness(second)
  );
});

test("evaluation is immutable and returns fresh deep output", () => {
  const input = makeInput({
    policies: [
      policyRecord({ rewardRefs: ["reward.knowledge.flora_mastery"] })
    ]
  });
  const before = structuredClone(input);
  const first = evaluateKnowledgeTrialReadiness(input);

  first.target.ownerId = "character.mutated";
  first.observed.rewardRefs.push("reward.knowledge.mutated");
  assert.deepEqual(input, before);
  assert.deepEqual(
    evaluateKnowledgeTrialReadiness(input),
    evaluateKnowledgeTrialReadiness(before)
  );
});

test("source audit preserves the pure readiness-only boundary", async () => {
  const source = await readFile(
    path.join(ROOT, "tools/content-lint/knowledge-trial-readiness.mjs"),
    "utf8"
  );
  const forbiddenPatterns = [
    /\bfrom\s+["']node:fs/,
    /\bimport\s*\(\s*["']node:fs/,
    /\breadFile\b/,
    /\bwriteFile\b/,
    /\bDate\.now\b/,
    /\bnew\s+Date\b/,
    /\bMath\.random\b/,
    /\bperformance\.now\b/,
    /\bprocess\.env\b/,
    /\bfetch\s*\(/,
    /\bevaluateKnowledgeCompletion\s*\(/,
    /\bevaluateKnowledgeTrialEligibility\s*\(/,
    /\bvalidateKnowledgeProgress\s*\(/,
    /\bacceptKnowledgeEvidence\s*\(/,
    /\bapplyKnowledgeProgress\s*\(/,
    /\bcreateTrialAttempt\s*\(/,
    /\bresolveTrialCheckpoint\s*\(/,
    /\bresolveTrialOutcome\s*\(/,
    /\bmutateCooldown\s*\(/,
    /\bgrantReward\s*\(/,
    /\brender[A-Z][A-Za-z]*\s*\(/,
    /\bexecuteRuntime[A-Z][A-Za-z]*\s*\(/
  ];

  for (const pattern of forbiddenPatterns) {
    assert.doesNotMatch(source, pattern);
  }
  assert.match(
    source,
    /export function evaluateKnowledgeTrialReadiness\(input = \{\}\)/
  );
});

test("normal content lint does not register readiness", async () => {
  const source = await readFile(
    path.join(ROOT, "tools/content-lint/index.mjs"),
    "utf8"
  );
  assert.doesNotMatch(source, /knowledge-trial-readiness/);
  assert.doesNotMatch(source, /evaluateKnowledgeTrialReadiness/);
});

test("focused suite uses no Knowledge fixtures", async () => {
  const source = await readFile(
    path.join(ROOT, "tests/unit/knowledge-trial-readiness.test.mjs"),
    "utf8"
  );
  const forbiddenFixturePath = ["tests", "fixtures", "knowledge"].join("/");
  assert.equal(source.includes(forbiddenFixturePath), false);
});
