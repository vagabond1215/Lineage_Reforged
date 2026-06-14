import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { evaluateKnowledgeTrialEligibility } from "../../tools/content-lint/knowledge-trial-eligibility.mjs";

const ROOT = process.cwd();
const OPERATION_PATH = "tests/in-memory/knowledge-trial-eligibility";
const OWNER_ID = "character.test_subject";
const POLICY_ID = "knowledge_trial_policy.flora.tier_1";

const DOMAIN_IDS = {
  flora: "knowledge_domain.flora",
  fauna: "knowledge_domain.fauna",
  generalLore: "knowledge_domain.general_lore",
  inactive: "knowledge_domain.inactive",
  arcaneLore: "knowledge_domain.arcane_lore"
};

const SNIPPET_IDS = {
  aloe: "knowledge_snippet.flora.aloe.identification",
  badger: "knowledge_snippet.fauna.badger.identification",
  kaelvar: "knowledge_snippet.general_lore.kaelvar.cultural_context",
  arcane: "knowledge_snippet.arcane_lore.spark.identification"
};

const COMPLETION_SAFETY = {
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
};

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

const DOMAIN_REGISTRY = {
  records: [
    { id: DOMAIN_IDS.flora, status: "active" },
    { id: DOMAIN_IDS.fauna, status: "active" },
    { id: DOMAIN_IDS.generalLore, status: "active" },
    { id: DOMAIN_IDS.inactive, status: "planned" },
    { id: DOMAIN_IDS.arcaneLore, status: "planned" }
  ]
};

function emptyCompletionObserved() {
  return {
    progressValue: null,
    consumedEvidenceIds: null,
    requiredProgressValue: null,
    earnedCompletionWeight: null,
    availableCompletionWeight: null,
    requiredCompletionWeight: null
  };
}

function completionTarget({
  scope = "tier",
  ownerId = OWNER_ID,
  domainId = DOMAIN_IDS.flora,
  tier = 1,
  snippetId = SNIPPET_IDS.aloe
} = {}) {
  if (scope === "snippet") {
    return {
      scope,
      ownerScope: "character",
      ownerId,
      snippetId
    };
  }
  if (scope === "tier") {
    return {
      scope,
      ownerScope: "character",
      ownerId,
      domainId,
      tier
    };
  }
  return {
    scope,
    ownerScope: "character",
    ownerId,
    domainId
  };
}

function completionEnvelope({
  decision = "candidate",
  scope = "tier",
  ownerId = OWNER_ID,
  domainId = DOMAIN_IDS.flora,
  tier = 1,
  snippetId = SNIPPET_IDS.aloe,
  observed,
  issues,
  safety = COMPLETION_SAFETY
} = {}) {
  let selectedObserved = observed;
  if (selectedObserved === undefined) {
    selectedObserved = emptyCompletionObserved();
    if (scope === "snippet") {
      selectedObserved.progressValue = decision === "incomplete" ? 0 : 1;
      selectedObserved.consumedEvidenceIds =
        selectedObserved.progressValue > 0
          ? ["knowledge_evidence.flora.aloe.entry_001"]
          : [];
      selectedObserved.requiredProgressValue = 1;
    } else if (scope === "tier") {
      selectedObserved.earnedCompletionWeight =
        decision === "incomplete" ? 0 : 1;
      selectedObserved.availableCompletionWeight = 1;
      selectedObserved.requiredCompletionWeight = 1;
    }
  }

  return {
    decision,
    scope,
    target: completionTarget({
      scope,
      ownerId,
      domainId,
      tier,
      snippetId
    }),
    observed: structuredClone(selectedObserved),
    issues:
      issues ??
      (decision === "blocked"
        ? [{ code: "completion_blocked", message: "Completion is blocked." }]
        : []),
    safety: structuredClone(safety)
  };
}

function requirement({
  scope = "tier",
  domainId = DOMAIN_IDS.flora,
  tier = 1,
  snippetId = SNIPPET_IDS.aloe
} = {}) {
  if (scope === "snippet") {
    return {
      scope,
      domainId,
      snippetId,
      requiredDecision: "candidate"
    };
  }
  if (scope === "tier") {
    return {
      scope,
      domainId,
      tier,
      requiredDecision: "candidate"
    };
  }
  return {
    scope,
    domainId,
    requiredDecision: "candidate"
  };
}

function policyRecord({
  policyId = POLICY_ID,
  status = "active",
  ownerScope = "character",
  ownerId = OWNER_ID,
  scope = "tier",
  domainId = DOMAIN_IDS.flora,
  tier = 1,
  requiredCompletionTargets = [requirement()],
  prerequisiteCompletionTargets = [],
  readinessPolicyStatus = "not_evaluated",
  attemptConstraintStatus = "not_evaluated",
  cooldownConstraintStatus = "not_evaluated",
  rewardRefs = []
} = {}) {
  const record = {
    policyId,
    status,
    ownerScope,
    ownerId,
    scope,
    domainId,
    requiredCompletionTargets: structuredClone(requiredCompletionTargets),
    prerequisiteCompletionTargets: structuredClone(
      prerequisiteCompletionTargets
    ),
    readinessPolicyStatus,
    attemptConstraintStatus,
    cooldownConstraintStatus,
    rewardRefs: structuredClone(rewardRefs)
  };
  if (scope === "tier") {
    record.tier = tier;
  }
  return record;
}

function eligibilityTarget({
  ownerId = OWNER_ID,
  policyId = POLICY_ID,
  scope = "tier",
  domainId = DOMAIN_IDS.flora,
  tier = 1
} = {}) {
  const target = {
    ownerScope: "character",
    ownerId,
    policyId,
    scope,
    domainId
  };
  if (scope === "tier") {
    target.tier = tier;
  }
  return target;
}

function makeInput({
  target = eligibilityTarget(),
  completionEnvelopes = [completionEnvelope()],
  policyRecords = [policyRecord()],
  domainRegistryWrapper = DOMAIN_REGISTRY,
  overrides = {}
} = {}) {
  return {
    relativePath: OPERATION_PATH,
    target: structuredClone(target),
    completionEnvelopes: structuredClone(completionEnvelopes),
    trialEligibilityPolicyWrapper: {
      records: structuredClone(policyRecords)
    },
    domainRegistryWrapper: structuredClone(domainRegistryWrapper),
    ...structuredClone(overrides)
  };
}

test("matching tier completion and active policy return eligible_candidate", () => {
  const result = evaluateKnowledgeTrialEligibility(makeInput());

  assert.equal(result.phase, "eligibility");
  assert.equal(result.decision, "eligible_candidate");
  assert.deepEqual(result.target, {
    ownerScope: "character",
    ownerId: OWNER_ID,
    policyId: POLICY_ID,
    scope: "tier",
    domainId: DOMAIN_IDS.flora,
    tier: 1
  });
  assert.deepEqual(result.observed.requiredCompletionTargets, [requirement()]);
  assert.deepEqual(result.observed.satisfiedCompletionTargets, [requirement()]);
  assert.deepEqual(result.observed.failedCompletionTargets, []);
  assert.deepEqual(result.issues, []);
});

test("matching domain completion and active policy return eligible_candidate", () => {
  const target = eligibilityTarget({
    policyId: "knowledge_trial_policy.flora.domain",
    scope: "domain"
  });
  const policy = policyRecord({
    policyId: target.policyId,
    scope: "domain",
    requiredCompletionTargets: [requirement({ scope: "domain" })]
  });
  const result = evaluateKnowledgeTrialEligibility(
    makeInput({
      target,
      policyRecords: [policy],
      completionEnvelopes: [completionEnvelope({ scope: "domain" })]
    })
  );

  assert.equal(result.decision, "eligible_candidate");
  assert.equal(result.target.tier, null);
});

test("multiple required completion candidates all align", () => {
  const requirements = [
    requirement({ scope: "snippet" }),
    requirement({ scope: "tier" }),
    requirement({ scope: "domain" })
  ];
  const input = makeInput({
    policyRecords: [policyRecord({ requiredCompletionTargets: requirements })],
    completionEnvelopes: [
      completionEnvelope({ scope: "domain" }),
      completionEnvelope({ scope: "snippet" }),
      completionEnvelope({ scope: "tier" })
    ]
  });

  const result = evaluateKnowledgeTrialEligibility(input);
  assert.equal(result.decision, "eligible_candidate");
  assert.equal(result.observed.satisfiedCompletionTargets.length, 3);
});

for (const [name, prerequisite, envelope] of [
  [
    "snippet",
    requirement({ scope: "snippet" }),
    completionEnvelope({ scope: "snippet" })
  ],
  [
    "tier",
    requirement({ scope: "tier", domainId: DOMAIN_IDS.fauna, tier: 2 }),
    completionEnvelope({ scope: "tier", domainId: DOMAIN_IDS.fauna, tier: 2 })
  ],
  [
    "domain",
    requirement({ scope: "domain", domainId: DOMAIN_IDS.generalLore }),
    completionEnvelope({ scope: "domain", domainId: DOMAIN_IDS.generalLore })
  ]
]) {
  test(`explicitly authored ${name} prerequisite aligns`, () => {
    const result = evaluateKnowledgeTrialEligibility(
      makeInput({
        policyRecords: [
          policyRecord({ prerequisiteCompletionTargets: [prerequisite] })
        ],
        completionEnvelopes: [completionEnvelope(), envelope]
      })
    );

    assert.equal(result.decision, "eligible_candidate");
    assert.ok(
      result.observed.satisfiedCompletionTargets.some(
        (target) => target.scope === name
      )
    );
  });
}

for (const decision of ["incomplete", "blocked"]) {
  test(`well-formed ${decision} required completion returns not_eligible`, () => {
    const result = evaluateKnowledgeTrialEligibility(
      makeInput({
        completionEnvelopes: [completionEnvelope({ decision })]
      })
    );

    assert.equal(result.decision, "not_eligible");
    assert.equal(result.observed.failedCompletionTargets.length, 1);
    assert.equal(result.issues[0].code, "completion_requirement_not_satisfied");
  });
}

for (const [name, envelope] of [
  [
    "another owner",
    completionEnvelope({ ownerId: "character.other_subject" })
  ],
  [
    "another domain",
    completionEnvelope({ domainId: DOMAIN_IDS.fauna })
  ],
  ["another tier", completionEnvelope({ tier: 2 })]
]) {
  test(`required completion candidate for ${name} returns not_eligible`, () => {
    const result = evaluateKnowledgeTrialEligibility(
      makeInput({ completionEnvelopes: [envelope] })
    );

    assert.equal(result.decision, "not_eligible");
    assert.equal(result.observed.satisfiedCompletionTargets.length, 0);
  });
}

test("required snippet target mismatch returns not_eligible", () => {
  const snippetRequirement = requirement({ scope: "snippet" });
  const result = evaluateKnowledgeTrialEligibility(
    makeInput({
      policyRecords: [
        policyRecord({ requiredCompletionTargets: [snippetRequirement] })
      ],
      completionEnvelopes: [
        completionEnvelope({
          scope: "snippet",
          domainId: DOMAIN_IDS.fauna,
          snippetId: SNIPPET_IDS.badger
        })
      ]
    })
  );

  assert.equal(result.decision, "not_eligible");
});

test("missing required completion target returns not_eligible", () => {
  const result = evaluateKnowledgeTrialEligibility(
    makeInput({ completionEnvelopes: [] })
  );

  assert.equal(result.decision, "not_eligible");
  assert.equal(result.observed.failedCompletionTargets.length, 1);
});

test("extra unrelated completion envelope does not satisfy policy", () => {
  const result = evaluateKnowledgeTrialEligibility(
    makeInput({
      completionEnvelopes: [
        completionEnvelope({ domainId: DOMAIN_IDS.fauna, tier: 4 })
      ]
    })
  );

  assert.equal(result.decision, "not_eligible");
});

test("completion candidates cannot leak across owner, domain, or tier", () => {
  const result = evaluateKnowledgeTrialEligibility(
    makeInput({
      completionEnvelopes: [
        completionEnvelope({
          ownerId: "character.other_subject",
          domainId: DOMAIN_IDS.fauna,
          tier: 2
        }),
        completionEnvelope({
          ownerId: "character.third_subject",
          domainId: DOMAIN_IDS.flora,
          tier: 1
        })
      ]
    })
  );

  assert.equal(result.decision, "not_eligible");
  assert.deepEqual(result.observed.satisfiedCompletionTargets, []);
});

test("malformed completion envelope blocks", () => {
  const envelope = completionEnvelope();
  delete envelope.observed;

  const result = evaluateKnowledgeTrialEligibility(
    makeInput({ completionEnvelopes: [envelope] })
  );
  assert.equal(result.decision, "blocked");
  assert.equal(result.issues[0].code, "invalid_completion_envelope");
});

test("missing completion safety flag blocks", () => {
  const envelope = completionEnvelope();
  delete envelope.safety.noRewards;

  const result = evaluateKnowledgeTrialEligibility(
    makeInput({ completionEnvelopes: [envelope] })
  );
  assert.equal(result.decision, "blocked");
  assert.equal(result.issues[0].code, "unsafe_completion_envelope");
});

test("false completion safety flag blocks", () => {
  const envelope = completionEnvelope();
  envelope.safety.noRuntimeEffect = false;

  const result = evaluateKnowledgeTrialEligibility(
    makeInput({ completionEnvelopes: [envelope] })
  );
  assert.equal(result.decision, "blocked");
  assert.equal(result.issues[0].code, "unsafe_completion_envelope");
});

test("unsupported completion decision blocks", () => {
  const envelope = completionEnvelope();
  envelope.decision = "complete";

  const result = evaluateKnowledgeTrialEligibility(
    makeInput({ completionEnvelopes: [envelope] })
  );
  assert.equal(result.decision, "blocked");
});

test("unsupported completion scope blocks", () => {
  const envelope = completionEnvelope();
  envelope.scope = "skill";

  const result = evaluateKnowledgeTrialEligibility(
    makeInput({ completionEnvelopes: [envelope] })
  );
  assert.equal(result.decision, "blocked");
});

test("missing eligibility policy blocks", () => {
  const result = evaluateKnowledgeTrialEligibility(
    makeInput({ policyRecords: [] })
  );

  assert.equal(result.decision, "blocked");
  assert.equal(result.issues[0].code, "missing_trial_eligibility_policy");
});

test("duplicate matching policy blocks", () => {
  const policy = policyRecord();
  const result = evaluateKnowledgeTrialEligibility(
    makeInput({ policyRecords: [policy, structuredClone(policy)] })
  );

  assert.equal(result.decision, "blocked");
  assert.equal(result.issues[0].code, "duplicate_trial_eligibility_policy");
});

test("conflicting matching policy blocks", () => {
  const first = policyRecord();
  const second = policyRecord({
    requiredCompletionTargets: [requirement({ scope: "domain" })]
  });
  const result = evaluateKnowledgeTrialEligibility(
    makeInput({ policyRecords: [first, second] })
  );

  assert.equal(result.decision, "blocked");
  assert.equal(result.issues[0].code, "conflicting_trial_eligibility_policy");
});

test("malformed policy blocks", () => {
  const policy = policyRecord();
  policy.runtimeState = {};

  const result = evaluateKnowledgeTrialEligibility(
    makeInput({ policyRecords: [policy] })
  );
  assert.equal(result.decision, "blocked");
  assert.equal(result.issues[0].code, "invalid_trial_eligibility_policy");
});

test("deferred policy blocks", () => {
  const result = evaluateKnowledgeTrialEligibility(
    makeInput({ policyRecords: [policyRecord({ status: "deferred" })] })
  );

  assert.equal(result.decision, "blocked");
  assert.equal(result.issues[0].code, "trial_eligibility_policy_deferred");
});

test("unsupported policy status blocks", () => {
  const result = evaluateKnowledgeTrialEligibility(
    makeInput({ policyRecords: [policyRecord({ status: "retired" })] })
  );

  assert.equal(result.decision, "blocked");
  assert.equal(
    result.issues[0].code,
    "unsupported_trial_eligibility_policy_status"
  );
});

test("unsupported owner scope blocks", () => {
  const result = evaluateKnowledgeTrialEligibility(
    makeInput({
      policyRecords: [
        policyRecord({
          ownerScope: "institution",
          ownerId: "character.test_subject"
        })
      ]
    })
  );

  assert.equal(result.decision, "blocked");
  assert.equal(result.issues[0].code, "unsupported_owner_scope");
});

test("unresolved domain blocks", () => {
  const target = eligibilityTarget({
    domainId: "knowledge_domain.unknown"
  });
  const result = evaluateKnowledgeTrialEligibility(
    makeInput({
      target,
      policyRecords: [
        policyRecord({ domainId: target.domainId })
      ]
    })
  );

  assert.equal(result.decision, "blocked");
  assert.equal(result.issues[0].code, "domain_not_found");
});

test("planned or inactive domain blocks", () => {
  const target = eligibilityTarget({ domainId: DOMAIN_IDS.inactive });
  const result = evaluateKnowledgeTrialEligibility(
    makeInput({
      target,
      policyRecords: [policyRecord({ domainId: DOMAIN_IDS.inactive })]
    })
  );

  assert.equal(result.decision, "blocked");
  assert.equal(result.issues[0].code, "domain_not_active");
});

test("Arcane Lore policy blocks", () => {
  const target = eligibilityTarget({ domainId: DOMAIN_IDS.arcaneLore });
  const result = evaluateKnowledgeTrialEligibility(
    makeInput({
      target,
      policyRecords: [policyRecord({ domainId: DOMAIN_IDS.arcaneLore })]
    })
  );

  assert.equal(result.decision, "blocked");
  assert.equal(result.issues[0].code, "arcane_lore_blocked");
});

test("Arcane Lore completion envelope blocks even when unrelated", () => {
  const result = evaluateKnowledgeTrialEligibility(
    makeInput({
      completionEnvelopes: [
        completionEnvelope(),
        completionEnvelope({
          scope: "snippet",
          domainId: DOMAIN_IDS.arcaneLore,
          snippetId: SNIPPET_IDS.arcane
        })
      ]
    })
  );

  assert.equal(result.decision, "blocked");
  assert.equal(result.issues[0].code, "arcane_lore_blocked");
});

test("duplicate required completion target blocks", () => {
  const repeated = requirement();
  const result = evaluateKnowledgeTrialEligibility(
    makeInput({
      policyRecords: [
        policyRecord({
          requiredCompletionTargets: [repeated, structuredClone(repeated)]
        })
      ]
    })
  );

  assert.equal(result.decision, "blocked");
  assert.equal(
    result.issues[0].code,
    "duplicate_required_completion_target"
  );
});

test("duplicate prerequisite completion target blocks", () => {
  const repeated = requirement({ scope: "domain" });
  const result = evaluateKnowledgeTrialEligibility(
    makeInput({
      policyRecords: [
        policyRecord({
          prerequisiteCompletionTargets: [
            repeated,
            structuredClone(repeated)
          ]
        })
      ]
    })
  );

  assert.equal(result.decision, "blocked");
  assert.equal(
    result.issues[0].code,
    "duplicate_prerequisite_completion_target"
  );
});

test("duplicate completion envelope blocks exact-once resolution", () => {
  const envelope = completionEnvelope();
  const result = evaluateKnowledgeTrialEligibility(
    makeInput({
      completionEnvelopes: [envelope, structuredClone(envelope)]
    })
  );

  assert.equal(result.decision, "blocked");
  assert.equal(result.issues[0].code, "duplicate_completion_envelope");
});

for (const shortcutField of [
  "appliedProgressWrapper",
  "currentAcceptedEvidenceWrapper",
  "completionPolicyWrapper",
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
  "trialState",
  "readinessState",
  "attemptState",
  "cooldownState",
  "rewardState",
  "generatedOutput",
  "gameplay"
]) {
  test(`unsupported shortcut field '${shortcutField}' blocks`, () => {
    const result = evaluateKnowledgeTrialEligibility(
      makeInput({ overrides: { [shortcutField]: {} } })
    );

    assert.equal(result.decision, "blocked");
    assert.equal(result.issues[0].code, "unsupported_input_fields");
  });
}

test("rewardRefs are reported only and do not change eligibility", () => {
  const rewardRefs = [
    "reward.knowledge.flora_mastery",
    "reward.knowledge.flora_title"
  ];
  const result = evaluateKnowledgeTrialEligibility(
    makeInput({
      policyRecords: [policyRecord({ rewardRefs })]
    })
  );

  assert.equal(result.decision, "eligible_candidate");
  assert.deepEqual(result.observed.rewardRefs, [...rewardRefs].sort());
  assert.equal(result.safety.noRewardGrant, true);
});

test("readiness, attempt, and cooldown observations remain not_evaluated", () => {
  const result = evaluateKnowledgeTrialEligibility(makeInput());

  assert.equal(result.observed.readinessPolicyStatus, "not_evaluated");
  assert.equal(result.observed.attemptConstraintStatus, "not_evaluated");
  assert.equal(result.observed.cooldownConstraintStatus, "not_evaluated");
});

test("eligibility result returns the exact safety flags", () => {
  const result = evaluateKnowledgeTrialEligibility(makeInput());
  assert.deepEqual(result.safety, ELIGIBILITY_SAFETY);
});

test("equivalent reordered inputs return deterministic output", () => {
  const requirements = [
    requirement({ scope: "snippet" }),
    requirement({ scope: "domain" }),
    requirement({ scope: "tier" })
  ];
  const envelopes = [
    completionEnvelope({ scope: "snippet" }),
    completionEnvelope({ scope: "domain" }),
    completionEnvelope({ scope: "tier" })
  ];
  const first = makeInput({
    policyRecords: [
      policyRecord({
        requiredCompletionTargets: requirements,
        rewardRefs: ["reward.knowledge.second", "reward.knowledge.first"]
      })
    ],
    completionEnvelopes: envelopes
  });
  const second = makeInput({
    policyRecords: [
      policyRecord({
        requiredCompletionTargets: [...requirements].reverse(),
        rewardRefs: ["reward.knowledge.first", "reward.knowledge.second"]
      })
    ],
    completionEnvelopes: [...envelopes].reverse()
  });

  assert.deepEqual(
    evaluateKnowledgeTrialEligibility(first),
    evaluateKnowledgeTrialEligibility(second)
  );
});

test("evaluation is immutable and returns deep-copied output", () => {
  const input = makeInput({
    policyRecords: [
      policyRecord({ rewardRefs: ["reward.knowledge.flora_mastery"] })
    ]
  });
  const before = structuredClone(input);
  const first = evaluateKnowledgeTrialEligibility(input);

  assert.deepEqual(input, before);
  first.target.ownerId = "character.mutated";
  first.observed.rewardRefs.push("reward.knowledge.mutated");
  first.observed.requiredCompletionTargets[0].tier = 99;

  assert.deepEqual(input, before);
  assert.deepEqual(
    evaluateKnowledgeTrialEligibility(input),
    evaluateKnowledgeTrialEligibility(before)
  );
});

test("malformed domain authority blocks", () => {
  const result = evaluateKnowledgeTrialEligibility(
    makeInput({ domainRegistryWrapper: { entries: [] } })
  );

  assert.equal(result.decision, "blocked");
  assert.equal(result.issues[0].code, "invalid_domain_authority");
});

test("source audit preserves the pure eligibility-only boundary", async () => {
  const source = await readFile(
    path.join(
      ROOT,
      "tools/content-lint/knowledge-trial-eligibility.mjs"
    ),
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
    /export function evaluateKnowledgeTrialEligibility\(input = \{\}\)/
  );
});

test("normal content lint does not register the eligibility helper", async () => {
  const source = await readFile(
    path.join(ROOT, "tools/content-lint/index.mjs"),
    "utf8"
  );

  assert.doesNotMatch(source, /knowledge-trial-eligibility/);
  assert.doesNotMatch(source, /evaluateKnowledgeTrialEligibility/);
});

test("focused suite uses no Knowledge fixture directory", async () => {
  const source = await readFile(
    path.join(ROOT, "tests/unit/knowledge-trial-eligibility.test.mjs"),
    "utf8"
  );
  const forbiddenFixturePath = ["tests", "fixtures", "knowledge"].join("/");

  assert.equal(source.includes(forbiddenFixturePath), false);
});
