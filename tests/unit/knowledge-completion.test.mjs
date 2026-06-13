import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { evaluateKnowledgeCompletion } from "../../tools/content-lint/knowledge-completion.mjs";

const ROOT = process.cwd();
const OPERATION_PATH = "tests/in-memory/knowledge-completion";

async function readText(relativePath) {
  return readFile(path.join(ROOT, relativePath), "utf8");
}

async function readJson(relativePath) {
  const raw = await readText(relativePath);
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

const progressSchema = await readJson(
  "packages/schemas/player/knowledge_progress.schema.json"
);
const evidenceSchema = await readJson(
  "packages/schemas/player/knowledge_evidence.schema.json"
);
const snippetsWrapper = await readJson(
  "packages/content/base/player/knowledge_snippets.json"
);
const domainRegistryWrapper = await readJson(
  "packages/content/base/player/knowledge_domain_registry.json"
);
const regionsWrapper = await readJson("packages/content/base/world/regions.json");
const settlementsWrapper = await readJson(
  "packages/content/base/world/settlements.json"
);

const SNIPPET_IDS = {
  aloe: "knowledge_snippet.flora.aloe.identification",
  badger: "knowledge_snippet.fauna.badger.identification",
  ironOre: "knowledge_snippet.minerals.iron_ore.identification",
  kaelvar: "knowledge_snippet.general_lore.kaelvar.cultural_context"
};

const SAFETY = {
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

function snippetForId(snippetId, wrapper = snippetsWrapper) {
  return wrapper.records.find((record) => record.id === snippetId);
}

function snippetForKey(snippetKey, wrapper = snippetsWrapper) {
  return snippetForId(SNIPPET_IDS[snippetKey], wrapper);
}

function idToken(snippet) {
  return snippet.id.split(".").slice(2, 4).join("_");
}

function evidenceForSnippet(
  snippet,
  {
    ownerId = "character.test_subject",
    suffix = "entry_001",
    acquiredSequence = 1,
    overrides = {}
  } = {}
) {
  const sourceType = snippet.discoverySources[0].sourceType;
  const isTravel = sourceType === "travel_observation";

  return {
    evidenceId: `knowledge_evidence.${idToken(snippet)}.completion.${suffix}`,
    snippetId: snippet.id,
    domainId: snippet.domainId,
    subjectType: snippet.subjectType,
    subjectId: snippet.subjectId,
    sourceType,
    sourceId: null,
    ownerScope: "character",
    ownerId,
    acquiredSequence,
    acquisitionContext: isTravel
      ? {
          contextType: "travel_observation",
          continentId: "region.kaelvar"
        }
      : {
          contextType: "field_observation"
        },
    notes: ["Focused in-memory completion evidence."],
    ...overrides
  };
}

function progressBundle(
  snippet,
  {
    ownerId = "character.test_subject",
    progressValue = 1,
    suffix = "entry_001",
    progressOverrides = {},
    evidenceOverrides = {}
  } = {}
) {
  const evidence =
    progressValue > 0
      ? evidenceForSnippet(snippet, {
          ownerId,
          suffix,
          overrides: evidenceOverrides
        })
      : null;

  return {
    progress: {
      progressId: `knowledge_progress.${idToken(snippet)}.completion.${suffix}`,
      snippetId: snippet.id,
      domainId: snippet.domainId,
      subjectType: snippet.subjectType,
      subjectId: snippet.subjectId,
      ownerScope: "character",
      ownerId,
      progressValue,
      consumedEvidenceIds: evidence ? [evidence.evidenceId] : [],
      updatedSequence: evidence ? 2 : 0,
      notes: ["Focused in-memory completion progress."],
      ...progressOverrides
    },
    evidence
  };
}

function policyFor(wrapper = snippetsWrapper) {
  const tierKeys = new Map();
  const domainTiers = new Map();

  for (const snippet of wrapper.records) {
    const tierKey = `${snippet.domainId}\u0000${snippet.tier}`;
    if (!tierKeys.has(tierKey)) {
      tierKeys.set(tierKey, {
        domainId: snippet.domainId,
        tier: snippet.tier,
        requiredCompletionWeight: 1
      });
    }
    const tiers = domainTiers.get(snippet.domainId) ?? new Set();
    tiers.add(snippet.tier);
    domainTiers.set(snippet.domainId, tiers);
  }

  return {
    snippetRules: wrapper.records.map((snippet) => ({
      snippetId: snippet.id,
      requiredProgressValue: 1
    })),
    tierRules: [...tierKeys.values()],
    domainRules: [...domainTiers.entries()].map(([domainId, tiers]) => ({
      domainId,
      requiredTiers: [...tiers].sort((left, right) => left - right)
    }))
  };
}

function targetFor({
  scope = "snippet",
  ownerId = "character.test_subject",
  snippetId = SNIPPET_IDS.aloe,
  domainId,
  tier
} = {}) {
  const snippet = snippetForId(snippetId);
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
      domainId: domainId ?? snippet.domainId,
      tier: tier ?? snippet.tier
    };
  }
  return {
    scope,
    ownerScope: "character",
    ownerId,
    domainId: domainId ?? snippet.domainId
  };
}

function makeInput({
  scope = "snippet",
  snippetKey = "aloe",
  ownerId = "character.test_subject",
  progressValue = 1,
  snippetsValue = snippetsWrapper,
  domainsValue = domainRegistryWrapper,
  bundles,
  policyValue,
  targetValue,
  progressRecords,
  evidenceRecords
} = {}) {
  const snippet = snippetForKey(snippetKey, snippetsValue);
  const defaultBundle = progressBundle(snippet, {
    ownerId,
    progressValue
  });
  const selectedBundles = bundles ?? [defaultBundle];
  const selectedProgress =
    progressRecords ?? selectedBundles.map((bundle) => bundle.progress);
  const selectedEvidence =
    evidenceRecords ??
    selectedBundles
      .map((bundle) => bundle.evidence)
      .filter((record) => record !== null);

  return {
    relativePath: OPERATION_PATH,
    target:
      targetValue ??
      targetFor({
        scope,
        ownerId,
        snippetId: snippet.id
      }),
    appliedProgressWrapper: {
      records: structuredClone(selectedProgress)
    },
    currentAcceptedEvidenceWrapper: {
      records: structuredClone(selectedEvidence)
    },
    completionPolicyWrapper: structuredClone(
      policyValue ?? policyFor(snippetsValue)
    ),
    progressSchema: structuredClone(progressSchema),
    evidenceSchema: structuredClone(evidenceSchema),
    snippetsWrapper: structuredClone(snippetsValue),
    domainRegistryWrapper: structuredClone(domainsValue),
    regionsWrapper: structuredClone(regionsWrapper),
    settlementsWrapper: structuredClone(settlementsWrapper)
  };
}

function evaluate(input = makeInput()) {
  return evaluateKnowledgeCompletion(input);
}

function assertDecision(result, decision, scope) {
  assert.equal(result.decision, decision);
  assert.equal(result.scope, scope);
  assert.deepEqual(result.issues, []);
  assert.deepEqual(result.safety, SAFETY);
}

function assertBlocked(result, code) {
  assert.equal(result.decision, "blocked");
  assert.equal(result.issues.length, 1);
  assert.equal(result.issues[0].code, code);
  assert.deepEqual(result.safety, SAFETY);
}

function cloneSnippet(base, overrides = {}) {
  const clone = structuredClone(base);
  return Object.assign(clone, overrides);
}

for (const snippetKey of ["aloe", "badger", "ironOre", "kaelvar"]) {
  test(`${snippetKey} is a snippet candidate under an explicit threshold`, () => {
    const result = evaluate(makeInput({ snippetKey }));

    assertDecision(result, "candidate", "snippet");
    assert.equal(result.observed.progressValue, 1);
    assert.equal(result.observed.requiredProgressValue, 1);
    assert.equal(result.observed.consumedEvidenceIds.length, 1);
  });
}

test("snippet progress exactly equal to its threshold is a candidate", () => {
  const input = makeInput({ progressValue: 3 });
  input.completionPolicyWrapper.snippetRules.find(
    (rule) => rule.snippetId === SNIPPET_IDS.aloe
  ).requiredProgressValue = 3;

  assertDecision(evaluate(input), "candidate", "snippet");
});

test("snippet progress above its threshold is a candidate", () => {
  const input = makeInput({ progressValue: 4 });
  input.completionPolicyWrapper.snippetRules.find(
    (rule) => rule.snippetId === SNIPPET_IDS.aloe
  ).requiredProgressValue = 3;

  assertDecision(evaluate(input), "candidate", "snippet");
});

test("valid zero-state progress below a positive threshold is incomplete", () => {
  const result = evaluate(makeInput({ progressValue: 0 }));

  assertDecision(result, "incomplete", "snippet");
  assert.equal(result.observed.progressValue, 0);
  assert.deepEqual(result.observed.consumedEvidenceIds, []);
  assert.equal(result.observed.requiredProgressValue, 1);
});

test("valid positive progress below a threshold is incomplete", () => {
  const input = makeInput({ progressValue: 2 });
  input.completionPolicyWrapper.snippetRules.find(
    (rule) => rule.snippetId === SNIPPET_IDS.aloe
  ).requiredProgressValue = 3;

  assertDecision(evaluate(input), "incomplete", "snippet");
});

test("missing snippet threshold blocks without a default", () => {
  const input = makeInput();
  input.completionPolicyWrapper.snippetRules =
    input.completionPolicyWrapper.snippetRules.filter(
      (rule) => rule.snippetId !== SNIPPET_IDS.aloe
    );

  assertBlocked(evaluate(input), "missing_snippet_rule");
});

test("duplicate snippet threshold blocks", () => {
  const input = makeInput();
  const rule = input.completionPolicyWrapper.snippetRules.find(
    (entry) => entry.snippetId === SNIPPET_IDS.aloe
  );
  input.completionPolicyWrapper.snippetRules.push(structuredClone(rule));

  assertBlocked(evaluate(input), "duplicate_snippet_rule");
});

test("malformed snippet threshold blocks", () => {
  const input = makeInput();
  input.completionPolicyWrapper.snippetRules.find(
    (rule) => rule.snippetId === SNIPPET_IDS.aloe
  ).unexpected = true;

  assertBlocked(evaluate(input), "invalid_completion_policy");
});

for (const [label, requiredProgressValue] of [
  ["zero", 0],
  ["negative", -1],
  ["fractional", 1.5]
]) {
  test(`${label} snippet threshold blocks`, () => {
    const input = makeInput();
    input.completionPolicyWrapper.snippetRules.find(
      (rule) => rule.snippetId === SNIPPET_IDS.aloe
    ).requiredProgressValue = requiredProgressValue;

    assertBlocked(evaluate(input), "invalid_snippet_rule");
  });
}

test("conflicting snippet thresholds block", () => {
  const input = makeInput();
  input.completionPolicyWrapper.snippetRules.push({
    snippetId: SNIPPET_IDS.aloe,
    requiredProgressValue: 2
  });

  assertBlocked(evaluate(input), "conflicting_snippet_rule");
});

test("an unresolved authored snippet blocks its target decision", () => {
  const input = makeInput();
  const missingSnippetId = "knowledge_snippet.flora.missing.identification";
  input.target.snippetId = missingSnippetId;
  input.completionPolicyWrapper.snippetRules.push({
    snippetId: missingSnippetId,
    requiredProgressValue: 1
  });

  assertBlocked(evaluate(input), "snippet_not_found");
});

test("completionWeight is not used as the snippet threshold", () => {
  const snippetsValue = structuredClone(snippetsWrapper);
  snippetForKey("aloe", snippetsValue).progression.completionWeight = 99;
  const input = makeInput({
    snippetsValue,
    progressValue: 1
  });
  input.completionPolicyWrapper.snippetRules.find(
    (rule) => rule.snippetId === SNIPPET_IDS.aloe
  ).requiredProgressValue = 2;

  assertDecision(evaluate(input), "incomplete", "snippet");
});

test("consumedEvidenceIds length is not used as the snippet threshold", () => {
  const input = makeInput({ progressValue: 5 });
  input.completionPolicyWrapper.snippetRules.find(
    (rule) => rule.snippetId === SNIPPET_IDS.aloe
  ).requiredProgressValue = 6;

  const result = evaluate(input);
  assertDecision(result, "incomplete", "snippet");
  assert.equal(result.observed.consumedEvidenceIds.length, 1);
});

test("trialUnlockWeight has no effect on snippet completion", () => {
  const snippetsValue = structuredClone(snippetsWrapper);
  snippetForKey("aloe", snippetsValue).progression.trialUnlockWeight = 999;

  assertDecision(
    evaluate(makeInput({ snippetsValue })),
    "candidate",
    "snippet"
  );
});

test("a completed counting snippet contributes completionWeight to its tier", () => {
  const input = makeInput({ scope: "tier" });
  const result = evaluate(input);

  assertDecision(result, "candidate", "tier");
  assert.equal(result.observed.earnedCompletionWeight, 1);
  assert.equal(result.observed.availableCompletionWeight, 1);
  assert.equal(result.observed.requiredCompletionWeight, 1);
});

test("a non-counting completed snippet remains a candidate but adds no tier weight", () => {
  const base = snippetForKey("aloe");
  const nonCounting = cloneSnippet(base, {
    progression: {
      completionWeight: 9,
      countsTowardTierCompletion: false,
      trialUnlockWeight: 0
    }
  });
  const counting = cloneSnippet(base, {
    id: "knowledge_snippet.flora.aloe.use",
    category: "use",
    title: "Using Aloe",
    progression: {
      completionWeight: 2,
      countsTowardTierCompletion: true,
      trialUnlockWeight: 0
    }
  });
  const snippetsValue = {
    records: snippetsWrapper.records.map((record) =>
      record.id === base.id ? nonCounting : structuredClone(record)
    )
  };
  snippetsValue.records.push(counting);
  const bundles = [
    progressBundle(nonCounting),
    progressBundle(counting, { suffix: "entry_002" })
  ];
  const policyValue = policyFor(snippetsValue);
  policyValue.tierRules.find(
    (rule) => rule.domainId === base.domainId && rule.tier === 1
  ).requiredCompletionWeight = 2;

  const snippetResult = evaluate(
    makeInput({
      snippetsValue,
      bundles,
      policyValue,
      targetValue: targetFor({ snippetId: nonCounting.id })
    })
  );
  assertDecision(snippetResult, "candidate", "snippet");

  const tierResult = evaluate(
    makeInput({
      scope: "tier",
      snippetsValue,
      bundles,
      policyValue
    })
  );
  assertDecision(tierResult, "candidate", "tier");
  assert.equal(tierResult.observed.earnedCompletionWeight, 2);
  assert.equal(tierResult.observed.availableCompletionWeight, 2);
});

test("completionWeight zero creates no positive tier credit", () => {
  const base = snippetForKey("aloe");
  const zeroWeight = cloneSnippet(base, {
    progression: {
      completionWeight: 0,
      countsTowardTierCompletion: true,
      trialUnlockWeight: 0
    }
  });
  const incompleteCounting = cloneSnippet(base, {
    id: "knowledge_snippet.flora.aloe.use",
    category: "use",
    title: "Using Aloe",
    progression: {
      completionWeight: 1,
      countsTowardTierCompletion: true,
      trialUnlockWeight: 0
    }
  });
  const snippetsValue = {
    records: snippetsWrapper.records.map((record) =>
      record.id === base.id ? zeroWeight : structuredClone(record)
    )
  };
  snippetsValue.records.push(incompleteCounting);
  const bundles = [
    progressBundle(zeroWeight),
    progressBundle(incompleteCounting, {
      progressValue: 0,
      suffix: "entry_002"
    })
  ];

  const result = evaluate(
    makeInput({
      scope: "tier",
      snippetsValue,
      bundles
    })
  );
  assertDecision(result, "incomplete", "tier");
  assert.equal(result.observed.earnedCompletionWeight, 0);
  assert.equal(result.observed.availableCompletionWeight, 1);
});

test("a tier is a candidate only under its explicit required weight", () => {
  const input = makeInput({ scope: "tier" });
  input.completionPolicyWrapper.tierRules.find(
    (rule) => rule.domainId === "knowledge_domain.flora" && rule.tier === 1
  ).requiredCompletionWeight = 1;

  assertDecision(evaluate(input), "candidate", "tier");
});

test("a valid tier below its explicit required weight is incomplete", () => {
  const input = makeInput({ scope: "tier" });
  input.completionPolicyWrapper.tierRules.find(
    (rule) => rule.domainId === "knowledge_domain.flora" && rule.tier === 1
  ).requiredCompletionWeight = 2;

  const result = evaluate(input);
  assertDecision(result, "incomplete", "tier");
  assert.equal(result.observed.earnedCompletionWeight, 1);
  assert.equal(result.observed.requiredCompletionWeight, 2);
});

test("missing tier rule blocks", () => {
  const input = makeInput({ scope: "tier" });
  input.completionPolicyWrapper.tierRules =
    input.completionPolicyWrapper.tierRules.filter(
      (rule) =>
        !(
          rule.domainId === "knowledge_domain.flora" &&
          rule.tier === 1
        )
    );

  assertBlocked(evaluate(input), "missing_tier_rule");
});

test("conflicting tier rules block", () => {
  const input = makeInput({ scope: "tier" });
  input.completionPolicyWrapper.tierRules.push({
    domainId: "knowledge_domain.flora",
    tier: 1,
    requiredCompletionWeight: 2
  });

  assertBlocked(evaluate(input), "conflicting_tier_rule");
});

test("a tier with no counting snippets blocks", () => {
  const snippetsValue = structuredClone(snippetsWrapper);
  snippetForKey("aloe", snippetsValue).progression.countsTowardTierCompletion =
    false;

  assertBlocked(
    evaluate(makeInput({ scope: "tier", snippetsValue })),
    "no_counting_snippets"
  );
});

test("a tier with no positive available completion weight blocks", () => {
  const snippetsValue = structuredClone(snippetsWrapper);
  snippetForKey("aloe", snippetsValue).progression.completionWeight = 0;

  assertBlocked(
    evaluate(makeInput({ scope: "tier", snippetsValue })),
    "no_available_completion_weight"
  );
});

test("progress from another tier does not leak into the target tier", () => {
  const base = snippetForKey("aloe");
  const tierTwo = cloneSnippet(base, {
    id: "knowledge_snippet.flora.aloe.use",
    tier: 2,
    category: "use",
    title: "Using Aloe",
    progression: {
      completionWeight: 99,
      countsTowardTierCompletion: true,
      trialUnlockWeight: 0
    }
  });
  const snippetsValue = {
    records: [...structuredClone(snippetsWrapper.records), tierTwo]
  };
  const bundles = [
    progressBundle(base, { progressValue: 0 }),
    progressBundle(tierTwo, { suffix: "entry_002" })
  ];

  const result = evaluate(
    makeInput({
      scope: "tier",
      snippetsValue,
      bundles
    })
  );
  assertDecision(result, "incomplete", "tier");
  assert.equal(result.observed.earnedCompletionWeight, 0);
  assert.equal(result.observed.availableCompletionWeight, 1);
});

test("a domain is a candidate under an explicit required-tier rule", () => {
  assertDecision(
    evaluate(makeInput({ scope: "domain" })),
    "candidate",
    "domain"
  );
});

test("a domain is incomplete when a required tier is incomplete", () => {
  assertDecision(
    evaluate(makeInput({ scope: "domain", progressValue: 0 })),
    "incomplete",
    "domain"
  );
});

test("missing domain rule blocks", () => {
  const input = makeInput({ scope: "domain" });
  input.completionPolicyWrapper.domainRules =
    input.completionPolicyWrapper.domainRules.filter(
      (rule) => rule.domainId !== "knowledge_domain.flora"
    );

  assertBlocked(evaluate(input), "missing_domain_rule");
});

test("conflicting domain rules block", () => {
  const input = makeInput({ scope: "domain" });
  input.completionPolicyWrapper.domainRules.push({
    domainId: "knowledge_domain.flora",
    requiredTiers: [1, 2]
  });

  assertBlocked(evaluate(input), "conflicting_domain_rule");
});

test("the same tier for different owners remains isolated", () => {
  const aloe = snippetForKey("aloe");
  const ownerA = progressBundle(aloe, {
    ownerId: "character.owner_a",
    suffix: "owner_a"
  });
  const ownerB = progressBundle(aloe, {
    ownerId: "character.owner_b",
    progressValue: 0,
    suffix: "owner_b"
  });
  const bundles = [ownerA, ownerB];

  const ownerAResult = evaluate(
    makeInput({
      scope: "tier",
      bundles,
      targetValue: targetFor({
        scope: "tier",
        ownerId: "character.owner_a"
      })
    })
  );
  assertDecision(ownerAResult, "candidate", "tier");

  const ownerBResult = evaluate(
    makeInput({
      scope: "tier",
      bundles,
      targetValue: targetFor({
        scope: "tier",
        ownerId: "character.owner_b"
      })
    })
  );
  assertDecision(ownerBResult, "incomplete", "tier");
});

test("the same tier number for different domains remains isolated", () => {
  const aloe = snippetForKey("aloe");
  const badger = snippetForKey("badger");
  const bundles = [
    progressBundle(aloe),
    progressBundle(badger, {
      progressValue: 0,
      suffix: "entry_002"
    })
  ];

  const floraResult = evaluate(
    makeInput({
      scope: "tier",
      bundles,
      targetValue: targetFor({
        scope: "tier",
        snippetId: aloe.id
      })
    })
  );
  assertDecision(floraResult, "candidate", "tier");

  const faunaResult = evaluate(
    makeInput({
      scope: "tier",
      bundles,
      targetValue: targetFor({
        scope: "tier",
        snippetId: badger.id
      })
    })
  );
  assertDecision(faunaResult, "incomplete", "tier");
});

test("partial catalog contents do not imply domain completion", () => {
  const input = makeInput({ scope: "domain" });
  input.completionPolicyWrapper.tierRules.push({
    domainId: "knowledge_domain.flora",
    tier: 2,
    requiredCompletionWeight: 1
  });
  input.completionPolicyWrapper.domainRules.find(
    (rule) => rule.domainId === "knowledge_domain.flora"
  ).requiredTiers = [1, 2];

  assertBlocked(evaluate(input), "no_counting_snippets");
});

test("invalid applied progress blocks through the unchanged validator", () => {
  const input = makeInput();
  delete input.appliedProgressWrapper.records[0].notes;

  assertBlocked(evaluate(input), "invalid_applied_progress");
});

test("unresolved consumed evidence blocks through current validation", () => {
  const input = makeInput();
  input.currentAcceptedEvidenceWrapper.records = [];

  const result = evaluate(input);
  assertBlocked(result, "invalid_applied_progress");
  assert.match(result.issues[0].message, /is unresolved/);
});

test("a progress and snippet target mismatch blocks", () => {
  const input = makeInput();
  input.target = targetFor({
    snippetId: SNIPPET_IDS.badger
  });

  assertBlocked(evaluate(input), "target_progress_not_found");
});

test("a planned domain blocks completion decisions", () => {
  const input = makeInput({
    scope: "domain",
    targetValue: targetFor({
      scope: "domain",
      domainId: "knowledge_domain.arcane_lore"
    })
  });
  input.completionPolicyWrapper.domainRules.push({
    domainId: "knowledge_domain.arcane_lore",
    requiredTiers: [1]
  });
  input.completionPolicyWrapper.tierRules.push({
    domainId: "knowledge_domain.arcane_lore",
    tier: 1,
    requiredCompletionWeight: 1
  });

  assertBlocked(evaluate(input), "domain_not_active");
});

test("Arcane Lore remains blocked", () => {
  const input = makeInput({
    scope: "domain",
    targetValue: targetFor({
      scope: "domain",
      domainId: "knowledge_domain.arcane_lore"
    })
  });
  input.completionPolicyWrapper.domainRules.push({
    domainId: "knowledge_domain.arcane_lore",
    requiredTiers: [1]
  });

  const result = evaluate(input);
  assertBlocked(result, "domain_not_active");
  assert.match(result.issues[0].message, /planned/);
});

for (const field of [
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
  "generatedOutput",
  "gameplay"
]) {
  test(`unsupported input field ${field} blocks`, () => {
    const input = makeInput();
    input[field] = {};

    assertBlocked(evaluate(input), "unsupported_input_fields");
  });
}

test("ambiguous target fields block", () => {
  const input = makeInput();
  input.target.domainId = "knowledge_domain.flora";

  assertBlocked(evaluate(input), "invalid_target");
});

test("repeated equivalent invocations return deterministic output", () => {
  const input = makeInput();

  assert.deepEqual(evaluate(input), evaluate(input));
});

test("input wrapper order does not change the decision", () => {
  const aloe = snippetForKey("aloe");
  const badger = snippetForKey("badger");
  const input = makeInput({
    scope: "tier",
    bundles: [
      progressBundle(aloe),
      progressBundle(badger, {
        progressValue: 0,
        suffix: "entry_002"
      })
    ]
  });
  const reordered = structuredClone(input);
  reordered.appliedProgressWrapper.records.reverse();
  reordered.currentAcceptedEvidenceWrapper.records.reverse();
  reordered.completionPolicyWrapper.snippetRules.reverse();
  reordered.completionPolicyWrapper.tierRules.reverse();
  reordered.completionPolicyWrapper.domainRules.reverse();
  reordered.snippetsWrapper.records.reverse();
  reordered.domainRegistryWrapper.records.reverse();

  assert.deepEqual(evaluate(input), evaluate(reordered));
});

test("inputs remain immutable and outputs share no mutable references", () => {
  const input = makeInput();
  const snapshot = structuredClone(input);
  const result = evaluate(input);

  assert.deepEqual(input, snapshot);
  assert.notEqual(result.target, input.target);
  assert.notEqual(
    result.observed.consumedEvidenceIds,
    input.appliedProgressWrapper.records[0].consumedEvidenceIds
  );

  result.target.ownerId = "character.mutated";
  result.observed.consumedEvidenceIds.push(
    "knowledge_evidence.aloe.mutated.entry_999"
  );
  result.issues.push({ code: "mutated", message: "mutated" });
  result.safety.noMutation = false;

  assert.deepEqual(input, snapshot);
  assertDecision(evaluate(input), "candidate", "snippet");
});

test("completion returns the exact decision envelope and safety flags", () => {
  const result = evaluate();

  assert.deepEqual(Object.keys(result).sort(), [
    "decision",
    "issues",
    "observed",
    "safety",
    "scope",
    "target"
  ]);
  assert.deepEqual(Object.keys(result.observed).sort(), [
    "availableCompletionWeight",
    "consumedEvidenceIds",
    "earnedCompletionWeight",
    "progressValue",
    "requiredCompletionWeight",
    "requiredProgressValue"
  ]);
  assert.deepEqual(result.safety, SAFETY);
  assert.deepEqual(Object.keys(result.safety).sort(), Object.keys(SAFETY).sort());
});

test("helper source remains pure, explicit-input, and boundary-only", async () => {
  const source = await readText(
    "tools/content-lint/knowledge-completion.mjs"
  );
  const imports = source.match(/^import .*;$/gm) ?? [];

  assert.deepEqual(imports, [
    'import { validateKnowledgeProgress } from "./knowledge-progress.mjs";'
  ]);
  assert.doesNotMatch(
    source,
    /node:fs|\breadFile\b|\bwriteFile\b|Date\.now|new Date|Math\.random|performance\.now|process\.env|\bfetch\s*\(/
  );
  assert.doesNotMatch(
    source,
    /\b(?:produce|accept|initialize|propose|apply)Knowledge(?:Evidence|Progress)\b/
  );
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*(?:apps\/rpg-ui|packages\/engines|storage|persistence|trial|reward|event)[^"']*["']/i
  );
  assert.doesNotMatch(
    source,
    /\b(?:dispatchEvent|eventEmitter|localStorage|sessionStorage|grantReward|unlockTrial|writeCompletionState)\b/
  );
  assert.doesNotMatch(
    source,
    /\b(?:let|var)\s+\w*(?:counter|hidden|invocation)\w*\s*=/
  );
});

test("normal content lint does not register the completion helper", async () => {
  const source = await readText("tools/content-lint/index.mjs");

  assert.doesNotMatch(
    source,
    /knowledge-completion|evaluateKnowledgeCompletion/
  );
});

test("the completion suite requires no Knowledge fixture directory", async () => {
  await assert.rejects(
    access(path.join(ROOT, "tests/fixtures/knowledge")),
    /ENOENT/
  );
});
