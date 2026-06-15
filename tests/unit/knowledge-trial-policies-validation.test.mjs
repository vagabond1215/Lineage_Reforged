import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { validateKnowledgeTrialPolicies } from "../../tools/content-lint/knowledge-trial-policies.mjs";

const ROOT = process.cwd();
const POLICY_PATH = "packages/content/base/player/knowledge_trial_policies.json";
const VALIDATOR_PATH = "tools/content-lint/knowledge-trial-policies.mjs";

async function readText(relativePath) {
  return readFile(path.join(ROOT, relativePath), "utf8");
}

async function readJson(relativePath) {
  const raw = await readText(relativePath);
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
}

const policyWrapper = await readJson(POLICY_PATH);
const policySchema = await readJson(
  "packages/schemas/player/knowledge_trial_policy.schema.json"
);
const domainRegistryWrapper = await readJson(
  "packages/content/base/player/knowledge_domain_registry.json"
);
const snippetWrapper = await readJson(
  "packages/content/base/player/knowledge_snippets.json"
);

function makeInput() {
  return {
    relativePath: POLICY_PATH,
    wrapper: structuredClone(policyWrapper),
    policySchema: structuredClone(policySchema),
    domainRegistryWrapper: structuredClone(domainRegistryWrapper),
    snippetWrapper: structuredClone(snippetWrapper)
  };
}

function validate(input = makeInput()) {
  return validateKnowledgeTrialPolicies(input);
}

function expectFailure(mutate, expected) {
  const input = makeInput();
  mutate(input);
  assert.throws(() => validate(input), expected);
}

function policy(input) {
  return input.wrapper.records[0];
}

function tierTarget(domainId = "knowledge_domain.flora", tier = 1) {
  return {
    scope: "tier",
    domainId,
    tier,
    requiredDecision: "candidate"
  };
}

function domainTarget(domainId = "knowledge_domain.flora") {
  return {
    scope: "domain",
    domainId,
    requiredDecision: "candidate"
  };
}

function snippetTarget(
  snippetId = "knowledge_snippet.flora.aloe.identification",
  domainId = "knowledge_domain.flora"
) {
  return {
    scope: "snippet",
    domainId,
    snippetId,
    requiredDecision: "candidate"
  };
}

test("accepts the current one-record wrapper with deterministic output", () => {
  const expected = {
    ok: true,
    policyIds: ["knowledge_trial_policy.flora_tier_1"]
  };
  assert.deepEqual(validate(), expected);
  assert.deepEqual(validate(), expected);
});

test("accepts exact Flora Tier 1 authority with inert downstream fields", () => {
  const input = makeInput();
  const record = policy(input);
  assert.equal(record.scope, "tier");
  assert.equal(record.domainId, "knowledge_domain.flora");
  assert.equal(record.tier, 1);
  assert.deepEqual(record.requiredCompletionTargets, [tierTarget()]);
  assert.deepEqual(record.prerequisiteCompletionTargets, []);
  assert.equal(record.readinessPolicyId, null);
  assert.deepEqual(record.rewardRefs, []);
  assert.equal(validate(input).ok, true);
});

test("does not mutate any input", () => {
  const input = makeInput();
  const before = structuredClone(input);
  validate(input);
  assert.deepEqual(input, before);
});

test("accepts record order without treating it as authority", () => {
  const input = makeInput();
  const second = structuredClone(policy(input));
  second.policyId = "knowledge_trial_policy.flora_tier_2";
  second.tier = 2;
  second.requiredCompletionTargets = [tierTarget("knowledge_domain.flora", 2)];
  input.wrapper.records.unshift(second);
  assert.deepEqual(validate(input).policyIds, [
    "knowledge_trial_policy.flora_tier_1",
    "knowledge_trial_policy.flora_tier_2"
  ]);
});

test("rejects invalid policy wrappers", async (t) => {
  const cases = [
    ["non-object", (input) => { input.wrapper = null; }, /wrapper must be an object/],
    ["array", (input) => { input.wrapper = []; }, /wrapper must be an object/],
    ["extra key", (input) => { input.wrapper.version = 1; }, /exactly one top-level key/],
    ["missing records", (input) => { input.wrapper = {}; }, /exactly one top-level key/],
    ["non-array records", (input) => { input.wrapper.records = {}; }, /records must be an array/],
    ["empty records", (input) => { input.wrapper.records = []; }, /records must be non-empty/]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects invalid authority wrappers", async (t) => {
  const cases = [
    [
      "domain wrapper",
      (input) => { input.domainRegistryWrapper = []; },
      /knowledge domain registry wrapper must be an object/
    ],
    [
      "domain records",
      (input) => { input.domainRegistryWrapper.records = []; },
      /knowledge domain registry records must be non-empty/
    ],
    [
      "snippet wrapper",
      (input) => { input.snippetWrapper = {}; },
      /knowledge snippets wrapper must contain exactly one top-level key/
    ],
    [
      "snippet records",
      (input) => { input.snippetWrapper.records = {}; },
      /knowledge snippets records must be an array/
    ]
  ];

  for (const [name, mutate, expected] of cases) {
    await t.test(name, () => expectFailure(mutate, expected));
  }
});

test("rejects schema-invalid records before semantic checks", () => {
  expectFailure(
    (input) => {
      delete policy(input).ownerScope;
      policy(input).domainId = "knowledge_domain.missing";
    },
    /structural validation failed: records\[0\] is missing required property 'ownerScope'/
  );
});

test("rejects unsupported schema keywords and references", async (t) => {
  await t.test("keyword", () => {
    expectFailure(
      (input) => { input.policySchema.default = {}; },
      /schema \$ uses unsupported keyword 'default'/
    );
  });
  await t.test("reference", () => {
    expectFailure(
      (input) => {
        input.policySchema.properties.domainId.$ref = "#/$defs/missing";
      },
      /references missing location '#\/\$defs\/missing'/
    );
  });
});

test("rejects duplicate and misleading policy ids", async (t) => {
  await t.test("duplicate", () => {
    expectFailure(
      (input) => {
        input.wrapper.records.push(structuredClone(policy(input)));
      },
      /records\[1\]\.policyId duplicates 'knowledge_trial_policy\.flora_tier_1'/
    );
  });
  await t.test("misleading suffix", () => {
    expectFailure(
      (input) => {
        policy(input).policyId = "knowledge_trial_policy.flora_readiness";
      },
      /contains blocked authority token 'readiness'/
    );
  });
  await t.test("missing current policy", () => {
    expectFailure(
      (input) => {
        policy(input).policyId = "knowledge_trial_policy.flora_tier_2";
      },
      /must include current policy 'knowledge_trial_policy\.flora_tier_1'/
    );
  });
});

test("rejects missing and duplicate domain authority", async (t) => {
  await t.test("missing", () => {
    expectFailure(
      (input) => {
        input.domainRegistryWrapper.records =
          input.domainRegistryWrapper.records.filter(
            (record) => record.id !== "knowledge_domain.flora"
          );
      },
      /domainId 'knowledge_domain\.flora' is missing from domain registry/
    );
  });
  await t.test("duplicate", () => {
    expectFailure(
      (input) => {
        input.domainRegistryWrapper.records.push(
          structuredClone(input.domainRegistryWrapper.records[0])
        );
      },
      /duplicates domain id 'knowledge_domain\.flora'/
    );
  });
});

test("rejects non-active and Arcane domains", async (t) => {
  for (const status of ["planned", "inactive", "deferred"]) {
    await t.test(status, () => {
      expectFailure(
        (input) => {
          input.domainRegistryWrapper.records.find(
            (record) => record.id === "knowledge_domain.flora"
          ).status = status;
        },
        /must reference an active non-Arcane domain/
      );
    });
  }

  await t.test("Arcane Lore", () => {
    expectFailure(
      (input) => {
        const record = policy(input);
        record.domainId = "knowledge_domain.arcane_lore";
        record.requiredCompletionTargets = [
          tierTarget("knowledge_domain.arcane_lore", 1)
        ];
        input.domainRegistryWrapper.records.find(
          (domain) => domain.id === "knowledge_domain.arcane_lore"
        ).status = "active";
      },
      /knowledge_domain\.arcane_lore' must reference an active non-Arcane domain/
    );
  });
});

test("rejects policy and target domain mismatch", () => {
  expectFailure(
    (input) => {
      policy(input).requiredCompletionTargets[0].domainId =
        "knowledge_domain.fauna";
    },
    /must match policy domainId 'knowledge_domain\.flora'/
  );
});

test("enforces tier and domain policy coherence", async (t) => {
  await t.test("tier without matching target", () => {
    expectFailure(
      (input) => {
        policy(input).requiredCompletionTargets = [snippetTarget()];
      },
      /must contain a matching tier target/
    );
  });
  await t.test("domain without matching target", () => {
    expectFailure(
      (input) => {
        const record = policy(input);
        record.scope = "domain";
        delete record.tier;
        record.requiredCompletionTargets = [snippetTarget()];
      },
      /must contain a matching domain target/
    );
  });
  await t.test("domain target under tier policy", () => {
    expectFailure(
      (input) => {
        policy(input).requiredCompletionTargets = [domainTarget()];
      },
      /scope 'domain' is incompatible with policy scope 'tier'/
    );
  });
  await t.test("tier target under domain policy", () => {
    expectFailure(
      (input) => {
        const record = policy(input);
        record.scope = "domain";
        delete record.tier;
        record.requiredCompletionTargets = [tierTarget()];
      },
      /scope 'tier' is incompatible with policy scope 'domain'/
    );
  });
  await t.test("tier mismatch", () => {
    expectFailure(
      (input) => {
        policy(input).requiredCompletionTargets[0].tier = 2;
      },
      /tier '2' must match policy tier '1'/
    );
  });
});

test("rejects duplicate completion targets", async (t) => {
  await t.test("required", () => {
    expectFailure(
      (input) => {
        policy(input).requiredCompletionTargets.push({
          requiredDecision: "candidate",
          tier: 1,
          domainId: "knowledge_domain.flora",
          scope: "tier"
        });
      },
      /requiredCompletionTargets\[1\] duplicates target/
    );
  });
  await t.test("prerequisite", () => {
    expectFailure(
      (input) => {
        policy(input).prerequisiteCompletionTargets = [
          snippetTarget(),
          {
            requiredDecision: "candidate",
            snippetId: "knowledge_snippet.flora.aloe.identification",
            domainId: "knowledge_domain.flora",
            scope: "snippet"
          }
        ];
      },
      /prerequisiteCompletionTargets\[1\] duplicates target/
    );
  });
  await t.test("across arrays", () => {
    expectFailure(
      (input) => {
        policy(input).prerequisiteCompletionTargets = [tierTarget()];
      },
      /repeats required target/
    );
  });
});

test("accepts a same-domain snippet supplement with a matching tier target", () => {
  const input = makeInput();
  policy(input).requiredCompletionTargets.push(snippetTarget());
  assert.equal(validate(input).ok, true);
});

test("rejects invalid snippet authority", async (t) => {
  await t.test("unresolved snippet", () => {
    expectFailure(
      (input) => {
        policy(input).requiredCompletionTargets.push(
          snippetTarget("knowledge_snippet.flora.missing.identification")
        );
      },
      /is missing from snippet authority/
    );
  });
  await t.test("duplicate snippet id", () => {
    expectFailure(
      (input) => {
        input.snippetWrapper.records.push(
          structuredClone(input.snippetWrapper.records[0])
        );
      },
      /duplicates snippet id 'knowledge_snippet\.flora\.aloe\.identification'/
    );
  });
  await t.test("snippet id slug mismatch", () => {
    expectFailure(
      (input) => {
        const snippet = structuredClone(input.snippetWrapper.records[0]);
        snippet.id = "knowledge_snippet.fauna.aloe.identification";
        input.snippetWrapper.records.push(snippet);
        policy(input).requiredCompletionTargets.push(
          snippetTarget(snippet.id, "knowledge_domain.flora")
        );
      },
      /does not align with domainId 'knowledge_domain\.flora'/
    );
  });
  await t.test("snippet record domain mismatch", () => {
    expectFailure(
      (input) => {
        input.snippetWrapper.records[0].domainId = "knowledge_domain.fauna";
        policy(input).requiredCompletionTargets.push(snippetTarget());
      },
      /has domainId 'knowledge_domain\.fauna' that does not match policy domainId/
    );
  });
  await t.test("inactive future snippet", () => {
    expectFailure(
      (input) => {
        input.snippetWrapper.records[0].status = "deferred";
        policy(input).requiredCompletionTargets.push(snippetTarget());
      },
      /must reference status 'active'/
    );
  });
});

test("rejects deferred readiness, rewards, and registry activation", async (t) => {
  await t.test("readiness", () => {
    expectFailure(
      (input) => {
        policy(input).readinessPolicyId =
          "knowledge_trial_readiness_policy.flora_tier_1";
      },
      /readinessPolicyId must remain null/
    );
  });
  await t.test("rewards", () => {
    expectFailure(
      (input) => {
        policy(input).rewardRefs = ["reward.knowledge.flora"];
      },
      /rewardRefs must remain empty/
    );
  });
  await t.test("registry reference", () => {
    expectFailure(
      (input) => {
        input.domainRegistryWrapper.records[0].trialPolicyRef =
          "knowledge_trial_policy.flora_tier_1";
      },
      /trialPolicyRef must remain null/
    );
  });
});

test("rejects forbidden authority fields structurally", async (t) => {
  const fields = [
    "ownerId",
    "eligibilityEnvelope",
    "readinessEnvelope",
    "attemptHistory",
    "cooldownState",
    "availabilityFacts",
    "checkpointResults",
    "outcome",
    "rewardState",
    "unlockState",
    "uiState",
    "generatedOutput",
    "events",
    "accountState",
    "sessionState",
    "storage",
    "persistence",
    "skillTrialPolicy",
    "magicStudyPolicy"
  ];
  for (const field of fields) {
    await t.test(field, () => {
      expectFailure(
        (input) => {
          policy(input)[field] = {};
        },
        new RegExp(`unsupported property '${field}'`)
      );
    });
  }
});

test("validator source preserves purity and helper isolation", async () => {
  const source = await readText(VALIDATOR_PATH);
  for (const forbidden of [
    "knowledge-completion",
    "knowledge-trial-eligibility",
    "knowledge-trial-readiness",
    "evaluateKnowledgeCompletion",
    "evaluateKnowledgeTrialEligibility",
    "evaluateKnowledgeTrialReadiness",
    "Date.now",
    "new Date",
    "Math.random",
    "process.env",
    "fetch(",
    "writeFile",
    "appendFile",
    "localStorage",
    "sessionStorage",
    "database",
    "save",
    "runtime",
    "generatedOutput"
  ]) {
    assert.doesNotMatch(source, new RegExp(forbidden.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("normal content lint registers the validator with explicit dependencies", async () => {
  const source = await readText("tools/content-lint/index.mjs");
  const functionStart = source.indexOf(
    "async function validateKnowledgeTrialPoliciesAgainstDependencies()"
  );
  const functionEnd = source.indexOf(
    "async function validatePlayerContentAgainstDependencies()",
    functionStart
  );
  const orchestrationSource = source.slice(functionStart, functionEnd);

  assert.match(
    source,
    /import \{ validateKnowledgeTrialPolicies \} from "\.\/knowledge-trial-policies\.mjs";/
  );
  assert.ok(functionStart >= 0);
  assert.ok(functionEnd > functionStart);
  for (const dependencyPath of [
    "packages/content/base/player/knowledge_trial_policies.json",
    "packages/schemas/player/knowledge_trial_policy.schema.json",
    "packages/content/base/player/knowledge_domain_registry.json",
    "packages/content/base/player/knowledge_snippets.json"
  ]) {
    assert.match(orchestrationSource, new RegExp(dependencyPath.replaceAll(".", "\\.")));
  }
  assert.match(
    orchestrationSource,
    /validateKnowledgeTrialPolicies\(\{\s*relativePath: "packages\/content\/base\/player\/knowledge_trial_policies\.json",\s*wrapper: parsedPolicyWrapper,\s*policySchema: parsedPolicySchema,\s*domainRegistryWrapper: parsedDomainRegistryWrapper,\s*snippetWrapper: parsedSnippetWrapper\s*\}\);/
  );
  assert.doesNotMatch(orchestrationSource, /catch\s*\(/);

  const registryCall = source.indexOf(
    "await validateKnowledgeDomainRegistryAgainstDependencies();"
  );
  const snippetCall = source.indexOf(
    "await validateKnowledgeSnippetsAgainstDependencies();"
  );
  const policyCall = source.indexOf(
    "await validateKnowledgeTrialPoliciesAgainstDependencies();"
  );
  const successLog = source.indexOf(
    "console.log(`content-lint: ok (${checks.length} files checked)`);"
  );

  assert.ok(registryCall >= 0);
  assert.ok(snippetCall > registryCall);
  assert.ok(policyCall > snippetCall);
  assert.ok(successLog > policyCall);
  assert.match(
    source,
    /main\(\)\.catch\(\(error\) => \{\s*console\.error\("content-lint: failed", error\.message\);\s*process\.exitCode = 1;\s*\}\);/
  );
});
