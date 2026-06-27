import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

function stripBom(raw) {
  return raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
}

const schemaFiles = [
  "packages/schemas/world/biome.schema.json",
  "packages/schemas/world/habitat.schema.json",
  "packages/schemas/world/flora.schema.json",
  "packages/schemas/world/fauna.schema.json",
  "packages/schemas/world/monster.schema.json",
  "packages/schemas/world/mineral.schema.json",
  "packages/schemas/world/climate-profile.schema.json",
  "packages/schemas/world/region.schema.json",
  "packages/schemas/world/region-locality.schema.json",
  "packages/schemas/world/regional-ecology.schema.json",
  "packages/schemas/world/religion.schema.json",
  "packages/schemas/world/religious-hotspot.schema.json",
  "packages/schemas/world/sacred-site.schema.json",
  "packages/schemas/world/polity.schema.json",
  "packages/schemas/world/settlement-economy.schema.json",
  "packages/schemas/world/map-feature.schema.json",
  "packages/schemas/world/hazard-profile.schema.json",
  "packages/schemas/world/settlement.schema.json",
  "packages/schemas/world/travel-network.schema.json",
  "packages/schemas/world/transport-profile.schema.json",
  "packages/schemas/world/magic-infrastructure.schema.json",
  "packages/schemas/world/crystal-catalog.schema.json",
  "packages/schemas/world/world-hex.schema.json",
  "packages/schemas/world/world-hex-edge.schema.json",
  "packages/schemas/world/world-map.schema.json",
  "packages/schemas/world/world-map-feature.schema.json",
  "packages/schemas/civilization/workplace.schema.json",
  "packages/schemas/civilization/workplace-abstraction.schema.json",
  "packages/schemas/civilization/building.schema.json",
  "packages/schemas/civilization/infrastructure.schema.json",
  "packages/schemas/civilization/market-item-value.schema.json",
  "packages/schemas/civilization/guild.schema.json",
  "packages/schemas/civilization/person.schema.json",
  "packages/schemas/civilization/npc.schema.json",
  "packages/schemas/civilization/household.schema.json",
  "packages/schemas/civilization/family.schema.json",
  "packages/schemas/civilization/quest-archetype.schema.json",
  "packages/schemas/civilization/quest-definition.schema.json",
  "packages/schemas/civilization/quest-template.schema.json",
  "packages/schemas/player/player-attribute.schema.json",
  "packages/schemas/player/equipment.schema.json",
  "packages/schemas/player/skill.schema.json",
  "packages/schemas/player/progression-track.schema.json",
  "packages/schemas/player/knowledge-domain.schema.json",
  "packages/schemas/player/knowledge-domain-registry.schema.json",
  "packages/schemas/player/knowledge_evidence.schema.json",
  "packages/schemas/player/knowledge_progress.schema.json",
  "packages/schemas/player/knowledge_snippet.schema.json",
  "packages/schemas/player/knowledge_trial_policy.schema.json",
  "packages/schemas/player/knowledge_trial_readiness_policy.schema.json",
  "packages/schemas/player/skill-effect.schema.json",
  "packages/schemas/player/title.schema.json",
  "packages/schemas/player/spell.schema.json",
  "packages/schemas/player/magic_study_source.schema.json",
  "packages/schemas/player/ability.schema.json",
  "packages/schemas/player/trait.schema.json",
  "packages/schemas/player/backstory.schema.json",
  "packages/schemas/player/starting-bundle.schema.json",
  "packages/schemas/player/trial.schema.json",
  "packages/schemas/player/resource.schema.json",
  "packages/schemas/game/combat-role.schema.json",
  "packages/schemas/game/tactics-preset.schema.json",
  "packages/schemas/game/global-rule.schema.json",
  "packages/schemas/world/encounter-template.schema.json",
  "packages/schemas/items/item.schema.json",
  "packages/schemas/items/consumable-profile.schema.json",
  "packages/schemas/items/weapon-profile.schema.json",
  "packages/schemas/items/armor-profile.schema.json",
  "packages/schemas/crafting/recipe.schema.json",
  "packages/schemas/world/spawn-profile.schema.json"
];

for (const schemaFile of schemaFiles) {
  test(`schema file is parseable and has type: ${schemaFile}`, async () => {
    const raw = await readFile(schemaFile, "utf8");
    const parsed = JSON.parse(stripBom(raw));

    assert.equal(typeof parsed.$schema, "string");
    assert.equal(typeof parsed.type, "string");
  });
}

function resolveLocalRef(rootSchema, reference) {
  assert.match(reference, /^#\//);
  return reference
    .slice(2)
    .split("/")
    .reduce((value, segment) => value[segment], rootSchema);
}

function matchesSchema(value, schema, rootSchema) {
  if (schema.$ref) {
    return matchesSchema(value, resolveLocalRef(rootSchema, schema.$ref), rootSchema);
  }

  if (schema.oneOf) {
    return schema.oneOf.filter((branch) =>
      matchesSchema(value, branch, rootSchema)
    ).length === 1;
  }

  if (schema.type === "null") {
    return value === null;
  }
  if (schema.type === "object") {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return false;
    }
    if (
      schema.required?.some(
        (requiredProperty) => !Object.hasOwn(value, requiredProperty)
      )
    ) {
      return false;
    }
    if (
      schema.additionalProperties === false &&
      Object.keys(value).some(
        (property) => !Object.hasOwn(schema.properties ?? {}, property)
      )
    ) {
      return false;
    }
    return Object.entries(schema.properties ?? {}).every(
      ([property, propertySchema]) =>
        !Object.hasOwn(value, property) ||
        matchesSchema(value[property], propertySchema, rootSchema)
    );
  }
  if (schema.type === "array") {
    if (!Array.isArray(value)) {
      return false;
    }
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      return false;
    }
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      return false;
    }
    if (
      schema.uniqueItems === true &&
      new Set(value.map((item) => JSON.stringify(item))).size !== value.length
    ) {
      return false;
    }
    return !schema.items ||
      value.every((item) => matchesSchema(item, schema.items, rootSchema));
  }
  if (schema.type === "string") {
    if (typeof value !== "string") {
      return false;
    }
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      return false;
    }
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
      return false;
    }
  }
  if (
    schema.type === "integer" &&
    (!Number.isInteger(value) ||
      (schema.minimum !== undefined && value < schema.minimum))
  ) {
    return false;
  }
  return !schema.enum || schema.enum.includes(value);
}

const knowledgeTrialPolicySchema = JSON.parse(
  stripBom(
    await readFile(
      "packages/schemas/player/knowledge_trial_policy.schema.json",
      "utf8"
    )
  )
);
const knowledgeTrialReadinessPolicySchema = JSON.parse(
  stripBom(
    await readFile(
      "packages/schemas/player/knowledge_trial_readiness_policy.schema.json",
      "utf8"
    )
  )
);
const knowledgeTrialPolicies = JSON.parse(
  stripBom(
    await readFile(
      "packages/content/base/player/knowledge_trial_policies.json",
      "utf8"
    )
  )
);
const knowledgeDomainRegistry = JSON.parse(
  stripBom(
    await readFile(
      "packages/content/base/player/knowledge_domain_registry.json",
      "utf8"
    )
  )
);
const knowledgeSnippetSchema = JSON.parse(
  stripBom(
    await readFile(
      "packages/schemas/player/knowledge_snippet.schema.json",
      "utf8"
    )
  )
);
const knowledgeDomainRegistrySchema = JSON.parse(
  stripBom(
    await readFile(
      "packages/schemas/player/knowledge-domain-registry.schema.json",
      "utf8"
    )
  )
);

function snippetRequirement(overrides = {}) {
  return {
    scope: "snippet",
    domainId: "knowledge_domain.flora",
    snippetId: "knowledge_snippet.flora.aloe.identification",
    requiredDecision: "candidate",
    ...overrides
  };
}

function tierRequirement(overrides = {}) {
  return {
    scope: "tier",
    domainId: "knowledge_domain.flora",
    tier: 1,
    requiredDecision: "candidate",
    ...overrides
  };
}

function domainRequirement(overrides = {}) {
  return {
    scope: "domain",
    domainId: "knowledge_domain.flora",
    requiredDecision: "candidate",
    ...overrides
  };
}

function knowledgeTrialPolicy(overrides = {}) {
  return {
    policyId: "knowledge_trial_policy.flora_tier_1",
    status: "active",
    ownerScope: "character",
    scope: "tier",
    domainId: "knowledge_domain.flora",
    tier: 1,
    requiredCompletionTargets: [tierRequirement()],
    prerequisiteCompletionTargets: [],
    readinessPolicyId: null,
    rewardRefs: [],
    notes: ["Static eligibility policy only."],
    ...overrides
  };
}

function validatesKnowledgeTrialPolicy(record) {
  return matchesSchema(
    record,
    knowledgeTrialPolicySchema,
    knowledgeTrialPolicySchema
  );
}

test("knowledge subject schemas share direct religion, deity, and religious hotspot vocabulary", () => {
  const snippetSubjectTypes = knowledgeSnippetSchema.properties.subjectType.enum;
  const registrySubjectTypes =
    knowledgeDomainRegistrySchema.properties.canonicalSubjectTypes.items.enum;

  assert.ok(snippetSubjectTypes.includes("religion"));
  assert.ok(snippetSubjectTypes.includes("deity"));
  assert.ok(snippetSubjectTypes.includes("religious_hotspot"));
  assert.equal(snippetSubjectTypes.includes("shrine"), false);
  assert.equal(snippetSubjectTypes.includes("sacred_site"), false);
  assert.deepEqual(registrySubjectTypes, snippetSubjectTypes);
});

test("Knowledge trial policy schema accepts exact domain and tier policies", () => {
  const domainPolicy = knowledgeTrialPolicy({
    policyId: "knowledge_trial_policy.flora_domain",
    scope: "domain",
    requiredCompletionTargets: [domainRequirement()]
  });
  delete domainPolicy.tier;

  assert.equal(validatesKnowledgeTrialPolicy(domainPolicy), true);
  assert.equal(validatesKnowledgeTrialPolicy(knowledgeTrialPolicy()), true);
});

test("Knowledge trial policy schema requires every static top-level field", () => {
  for (const field of knowledgeTrialPolicySchema.required) {
    const record = knowledgeTrialPolicy();
    delete record[field];
    assert.equal(validatesKnowledgeTrialPolicy(record), false, field);
  }
});

test("Knowledge trial policy schema rejects unsupported top-level authority", () => {
  for (const field of [
    "ownerId",
    "readinessPolicyStatus",
    "attemptConstraintStatus",
    "cooldownConstraintStatus",
    "eligibilityDecision",
    "readinessDecision",
    "eligibilityEnvelope",
    "readinessEnvelope",
    "attemptPolicy",
    "cooldownPolicy",
    "availabilityPolicy",
    "sequenceTimePolicy",
    "attemptHistory",
    "cooldownState",
    "availabilityFacts",
    "sequenceValue",
    "checkpointResults",
    "outcome",
    "rewardState",
    "uiState",
    "runtimeState",
    "generatedOutput",
    "events",
    "persistence",
    "saveState",
    "accountState",
    "sessionState",
    "databaseState",
    "skillTrialPolicy",
    "magicStudyPolicy"
  ]) {
    assert.equal(
      validatesKnowledgeTrialPolicy(
        knowledgeTrialPolicy({ [field]: {} })
      ),
      false,
      field
    );
  }
});

test("Knowledge trial policy schema enforces identity, status, owner, and scope", () => {
  assert.equal(
    validatesKnowledgeTrialPolicy(
      knowledgeTrialPolicy({ status: "deferred" })
    ),
    true
  );

  for (const overrides of [
    { policyId: "trial_policy.flora" },
    { status: "retired" },
    { ownerScope: "account" },
    { scope: "snippet" },
    { domainId: "domain.flora" }
  ]) {
    assert.equal(
      validatesKnowledgeTrialPolicy(knowledgeTrialPolicy(overrides)),
      false,
      JSON.stringify(overrides)
    );
  }
});

test("Knowledge trial policy schema enforces domain and tier shapes", () => {
  const domainWithTier = knowledgeTrialPolicy({
    scope: "domain",
    requiredCompletionTargets: [domainRequirement()]
  });
  assert.equal(validatesKnowledgeTrialPolicy(domainWithTier), false);

  for (const tier of [undefined, 0, -1, 1.5]) {
    const record = knowledgeTrialPolicy({ tier });
    if (tier === undefined) {
      delete record.tier;
    }
    assert.equal(validatesKnowledgeTrialPolicy(record), false, String(tier));
  }
});

test("Knowledge trial policy schema enforces completion target arrays", () => {
  assert.equal(
    validatesKnowledgeTrialPolicy(
      knowledgeTrialPolicy({ requiredCompletionTargets: [] })
    ),
    false
  );
  assert.equal(
    validatesKnowledgeTrialPolicy(
      knowledgeTrialPolicy({ prerequisiteCompletionTargets: [] })
    ),
    true
  );
});

test("Knowledge trial policy schema constrains readiness and reward references", () => {
  assert.equal(
    validatesKnowledgeTrialPolicy(
      knowledgeTrialPolicy({ readinessPolicyId: null })
    ),
    true
  );
  assert.equal(
    validatesKnowledgeTrialPolicy(
      knowledgeTrialPolicy({
        readinessPolicyId: "knowledge_trial_readiness_policy.flora_tier_1"
      })
    ),
    true
  );
  assert.equal(
    validatesKnowledgeTrialPolicy(
      knowledgeTrialPolicy({ readinessPolicyId: "readiness_policy.flora" })
    ),
    false
  );
  assert.equal(
    validatesKnowledgeTrialPolicy(
      knowledgeTrialPolicy({
        rewardRefs: ["reward.knowledge.flora", "reward.knowledge.flora"]
      })
    ),
    false
  );
  assert.equal(
    validatesKnowledgeTrialPolicy(
      knowledgeTrialPolicy({ rewardRefs: ["not-canonical"] })
    ),
    false
  );
  assert.equal(
    validatesKnowledgeTrialPolicy(
      knowledgeTrialPolicy({
        rewardRefs: ["reward.knowledge.flora", "title.knowledge.flora"]
      })
    ),
    true
  );
});

test("Knowledge trial policy schema requires unique non-empty notes", () => {
  assert.equal(
    validatesKnowledgeTrialPolicy(knowledgeTrialPolicy({ notes: [""] })),
    false
  );
  assert.equal(
    validatesKnowledgeTrialPolicy(
      knowledgeTrialPolicy({ notes: ["Repeated.", "Repeated."] })
    ),
    false
  );
});

test("Knowledge trial policy schema accepts exact requirement variants", () => {
  for (const requirement of [
    snippetRequirement(),
    tierRequirement(),
    domainRequirement()
  ]) {
    assert.equal(
      validatesKnowledgeTrialPolicy(
        knowledgeTrialPolicy({ requiredCompletionTargets: [requirement] })
      ),
      true,
      requirement.scope
    );
    assert.equal(
      validatesKnowledgeTrialPolicy(
        knowledgeTrialPolicy({
          prerequisiteCompletionTargets: [requirement]
        })
      ),
      true,
      `prerequisite ${requirement.scope}`
    );
  }
});

test("Knowledge trial policy schema rejects malformed snippet requirements", () => {
  for (const requirement of [
    snippetRequirement({ tier: 1 }),
    snippetRequirement({ ownerId: "character.example" }),
    snippetRequirement({ requiredDecision: "complete" }),
    snippetRequirement({ snippetId: "snippet.flora.aloe" })
  ]) {
    assert.equal(
      validatesKnowledgeTrialPolicy(
        knowledgeTrialPolicy({ requiredCompletionTargets: [requirement] })
      ),
      false,
      JSON.stringify(requirement)
    );
  }
});

test("Knowledge trial policy schema rejects malformed tier requirements", () => {
  for (const requirement of [
    tierRequirement({ tier: 0 }),
    tierRequirement({ tier: -1 }),
    tierRequirement({ tier: 1.5 }),
    tierRequirement({ ownerId: "character.example" })
  ]) {
    assert.equal(
      validatesKnowledgeTrialPolicy(
        knowledgeTrialPolicy({ requiredCompletionTargets: [requirement] })
      ),
      false,
      JSON.stringify(requirement)
    );
  }

  const missingTier = tierRequirement();
  delete missingTier.tier;
  assert.equal(
    validatesKnowledgeTrialPolicy(
      knowledgeTrialPolicy({ requiredCompletionTargets: [missingTier] })
    ),
    false
  );
});

test("Knowledge trial policy schema rejects malformed domain requirements", () => {
  for (const requirement of [
    domainRequirement({ tier: 1 }),
    domainRequirement({ extra: true }),
    domainRequirement({ requiredDecision: "eligible_candidate" })
  ]) {
    assert.equal(
      validatesKnowledgeTrialPolicy(
        knowledgeTrialPolicy({ requiredCompletionTargets: [requirement] })
      ),
      false,
      JSON.stringify(requirement)
    );
  }
});

function knowledgeTrialReadinessPolicy(overrides = {}) {
  return {
    readinessPolicyId:
      "knowledge_trial_readiness_policy.flora_tier_1",
    status: "active",
    ownerScope: "character",
    trialPolicyId: "knowledge_trial_policy.flora_tier_1",
    scope: "tier",
    domainId: "knowledge_domain.flora",
    tier: 1,
    requiredEligibilityDecision: "eligible_candidate",
    availabilityPolicy: {
      mode: "always"
    },
    prerequisiteReadinessGates: [],
    notes: [
      "Static readiness policy only; it does not authorize an attempt."
    ],
    ...overrides
  };
}

function validatesKnowledgeTrialReadinessPolicy(record) {
  return matchesSchema(
    record,
    knowledgeTrialReadinessPolicySchema,
    knowledgeTrialReadinessPolicySchema
  );
}

test("Knowledge trial readiness policy schema accepts exact domain and tier policies", () => {
  const domainPolicy = knowledgeTrialReadinessPolicy({
    readinessPolicyId: "knowledge_trial_readiness_policy.flora_domain",
    trialPolicyId: "knowledge_trial_policy.flora_domain",
    scope: "domain"
  });
  delete domainPolicy.tier;

  assert.equal(validatesKnowledgeTrialReadinessPolicy(domainPolicy), true);
  assert.equal(
    validatesKnowledgeTrialReadinessPolicy(
      knowledgeTrialReadinessPolicy()
    ),
    true
  );
});

test("Knowledge trial readiness policy schema requires every static top-level field", () => {
  for (const field of knowledgeTrialReadinessPolicySchema.required) {
    const record = knowledgeTrialReadinessPolicy();
    delete record[field];
    assert.equal(
      validatesKnowledgeTrialReadinessPolicy(record),
      false,
      field
    );
  }
});

test("Knowledge trial readiness policy schema rejects unsupported top-level authority", () => {
  for (const field of [
    "slug",
    "trialPolicyRefs",
    "ownerId",
    "requiredCompletionTargets",
    "requiredProgressState",
    "requiredEvidenceState",
    "requiredKnownSnippetState",
    "completionState",
    "progressState",
    "evidenceState",
    "knownSnippetState",
    "allowedSourceFamilies",
    "blockerCodes",
    "rewardRefs",
    "attemptPolicy",
    "attemptLimit",
    "cooldownPolicy",
    "sequencePolicy",
    "timePolicy",
    "checkpointPolicy",
    "outcomePolicy",
    "runtimePolicy",
    "uiPolicy",
    "storagePolicy",
    "persistencePolicy",
    "eventRefs",
    "commandRefs",
    "helperRefs",
    "adapterRefs",
    "generatedOutput",
    "ownershipMutation",
    "gameplayPolicy"
  ]) {
    assert.equal(
      validatesKnowledgeTrialReadinessPolicy(
        knowledgeTrialReadinessPolicy({ [field]: {} })
      ),
      false,
      field
    );
  }
});

test("Knowledge trial readiness policy schema constrains availability", () => {
  assert.equal(
    validatesKnowledgeTrialReadinessPolicy(
      knowledgeTrialReadinessPolicy({
        availabilityPolicy: {}
      })
    ),
    false
  );
  assert.equal(
    validatesKnowledgeTrialReadinessPolicy(
      knowledgeTrialReadinessPolicy({
        availabilityPolicy: {
          mode: "always",
          authorityId: "availability.example"
        }
      })
    ),
    false
  );
  assert.equal(
    validatesKnowledgeTrialReadinessPolicy(
      knowledgeTrialReadinessPolicy({
        availabilityPolicy: {
          mode: "scheduled"
        }
      })
    ),
    false
  );
});

test("Knowledge trial readiness policy schema requires empty prerequisite gates", () => {
  assert.equal(
    validatesKnowledgeTrialReadinessPolicy(
      knowledgeTrialReadinessPolicy({
        prerequisiteReadinessGates: ["readiness.gate.example"]
      })
    ),
    false
  );
});

test("Knowledge trial readiness policy schema enforces domain and tier shapes", () => {
  const missingTier = knowledgeTrialReadinessPolicy();
  delete missingTier.tier;
  assert.equal(
    validatesKnowledgeTrialReadinessPolicy(missingTier),
    false
  );

  const domainWithTier = knowledgeTrialReadinessPolicy({
    scope: "domain"
  });
  assert.equal(
    validatesKnowledgeTrialReadinessPolicy(domainWithTier),
    false
  );

  for (const tier of [0, -1, 1.5]) {
    assert.equal(
      validatesKnowledgeTrialReadinessPolicy(
        knowledgeTrialReadinessPolicy({ tier })
      ),
      false,
      String(tier)
    );
  }
});

test("Knowledge trial readiness policy schema enforces identity and decisions", () => {
  assert.equal(
    validatesKnowledgeTrialReadinessPolicy(
      knowledgeTrialReadinessPolicy({ status: "deferred" })
    ),
    true
  );

  for (const overrides of [
    { readinessPolicyId: "readiness_policy.flora" },
    { trialPolicyId: "trial_policy.flora" },
    { domainId: "domain.flora" },
    { status: "retired" },
    { ownerScope: "account" },
    { requiredEligibilityDecision: "not_eligible" }
  ]) {
    assert.equal(
      validatesKnowledgeTrialReadinessPolicy(
        knowledgeTrialReadinessPolicy(overrides)
      ),
      false,
      JSON.stringify(overrides)
    );
  }
});

test("Knowledge trial readiness policy schema requires unique non-empty notes", () => {
  for (const notes of [
    [],
    [""],
    ["Repeated.", "Repeated."]
  ]) {
    assert.equal(
      validatesKnowledgeTrialReadinessPolicy(
        knowledgeTrialReadinessPolicy({ notes })
      ),
      false,
      JSON.stringify(notes)
    );
  }
});

test("Knowledge trial authored policy skeleton parses and matches the selected exact record", () => {
  assert.deepEqual(Object.keys(knowledgeTrialPolicies), ["records"]);
  assert.deepEqual(knowledgeTrialPolicies.records, [
    {
      policyId: "knowledge_trial_policy.flora_tier_1",
      status: "active",
      ownerScope: "character",
      scope: "tier",
      domainId: "knowledge_domain.flora",
      tier: 1,
      requiredCompletionTargets: [
        {
          scope: "tier",
          domainId: "knowledge_domain.flora",
          tier: 1,
          requiredDecision: "candidate"
        }
      ],
      prerequisiteCompletionTargets: [],
      readinessPolicyId: null,
      rewardRefs: [],
      notes: [
        "Static eligibility policy only; it does not grant readiness, create an attempt, unlock a tier, or award a reward.",
        "Readiness policy and reward references remain deferred."
      ]
    }
  ]);
  assert.equal(validatesKnowledgeTrialPolicy(knowledgeTrialPolicies.records[0]), true);
});

test("Knowledge trial authored policy skeleton excludes deferred behavior fields", () => {
  const [policy] = knowledgeTrialPolicies.records;
  const forbiddenFields = [
    "ownerId",
    "progress",
    "readiness",
    "attempt",
    "result",
    "rewardState",
    "unlockState",
    "storage"
  ];

  assert.deepEqual(knowledgeTrialPolicies.records.map((record) => record.policyId), [
    "knowledge_trial_policy.flora_tier_1"
  ]);
  for (const field of forbiddenFields) {
    assert.equal(Object.hasOwn(policy, field), false);
  }
});

test("Knowledge domain registry aligns only Flora to the current trial policy", () => {
  assert.ok(knowledgeDomainRegistry.records.length > 0);
  const flora = knowledgeDomainRegistry.records.find(
    (record) => record.id === "knowledge_domain.flora"
  );
  const otherDomains = knowledgeDomainRegistry.records.filter(
    (record) => record.id !== "knowledge_domain.flora"
  );

  assert.equal(
    flora.trialPolicyRef,
    "knowledge_trial_policy.flora_tier_1"
  );
  assert.equal(
    otherDomains.every((record) => record.trialPolicyRef === null),
    true
  );
});

test("Knowledge trial authored policy content is registered exactly once in normal content lint", async () => {
  const contentLintSource = await readFile("tools/content-lint/index.mjs", "utf8");
  const checksStart = contentLintSource.indexOf("const checks = [");
  const checksEnd = contentLintSource.indexOf("\n];", checksStart);
  const checksSource = contentLintSource.slice(checksStart, checksEnd);

  assert.ok(checksStart >= 0);
  assert.ok(checksEnd > checksStart);
  assert.equal(
    checksSource.match(/packages\/content\/base\/player\/knowledge_trial_policies\.json/g)
      ?.length,
    1
  );
  assert.equal(
    checksSource.match(/packages\/content\/base\/player\/knowledge_domain_registry\.json/g)
      ?.length,
    1
  );
  assert.equal(
    checksSource.match(/packages\/content\/base\/player\/knowledge_snippets\.json/g)
      ?.length,
    1
  );
  assert.doesNotMatch(
    checksSource,
    /packages\/schemas\/player\/knowledge_trial_policy\.schema\.json/
  );
});

