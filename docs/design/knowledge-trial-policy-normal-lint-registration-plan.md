# Knowledge Trial Policy Normal Lint Registration Plan

Version: `0.5.155`
Status: documentation-only registration plan
Date: 2026-06-14

## Purpose

This plan defines how the existing pure Knowledge trial policy semantic validator should enter normal content lint in a later implementation run.

This version does not:

- register the validator;
- change `tools/content-lint/index.mjs`;
- change `tools/content-lint/knowledge-trial-policies.mjs`;
- change schemas, content, registry records, snippets, tests, fixtures, or helpers;
- add a content-to-helper adapter or readiness policy;
- add storage, persistence, UI, runtime, generated output, events, rewards, ownership mutation, or gameplay behavior.

Knowledge trials remain separate from Skill Trials and Spell/Magic Study. Arcane Lore remains planned, blocked, and deferred.

## Current Authority

The current authority boundaries are:

- `tools/content-lint/knowledge-trial-policies.mjs` owns pure semantic validation for authored Knowledge trial eligibility-policy content.
- `tests/unit/knowledge-trial-policies-validation.test.mjs` owns focused validator behavior, diagnostic, purity, and helper-isolation coverage.
- `packages/content/base/player/knowledge_trial_policies.json` owns the exact current one-record Flora Tier 1 policy wrapper.
- `packages/schemas/player/knowledge_trial_policy.schema.json` owns structural record validation.
- `packages/content/base/player/knowledge_domain_registry.json` and `packages/content/base/player/knowledge_snippets.json` are semantic dependencies.
- `tools/content-lint/index.mjs` owns normal content-lint file loading, orchestration, checked-file accounting, success output, and failure output.

The validator currently accepts explicit parsed inputs and performs no file I/O. That contract must remain intact.

## Registration Goal

The later registration run should:

1. make the policy content a normal checked content file;
2. load the policy schema, policy wrapper, domain registry, and snippets in `tools/content-lint/index.mjs`;
3. call the existing validator with those explicit parsed values;
4. allow every load, parse, structural, and semantic failure to fail normal content lint;
5. prove the policy validator is not silently skipped;
6. preserve existing registry and snippet validation;
7. change no authored policy, schema, registry, snippet, helper, or runtime authority.

Registration does not make policy content an input to completion, eligibility, or readiness helpers. It establishes authored-content validation only.

All registry `trialPolicyRef` values must remain null. Registry alignment is a separate future decision.

## Current Index Orchestration

`tools/content-lint/index.mjs` currently:

- imports pure Knowledge domain-registry and snippet validators near the other validator imports;
- lists `knowledge_domain_registry.json` and `knowledge_snippets.json` in `checks`;
- validates every `checks` entry through `validateFile(...)`;
- loads cross-file Knowledge dependencies in dedicated async orchestration functions;
- awaits `validateKnowledgeDomainRegistryAgainstDependencies()` and then `validateKnowledgeSnippetsAgainstDependencies()` near the start of `main()`;
- prints `content-lint: ok (${checks.length} files checked)` only after all awaited validation succeeds;
- catches any rejected load, parse, or validation operation in `main().catch(...)`;
- reports failures as `content-lint: failed <error message>` and sets a nonzero process exit code.

The current normal lint baseline is:

```text
content-lint: ok (55 files checked)
```

## Future Import

Add this exact import beside the existing Knowledge validator imports:

```js
import { validateKnowledgeTrialPolicies } from "./knowledge-trial-policies.mjs";
```

Do not add imports from:

- `knowledge-completion.mjs`;
- `knowledge-trial-eligibility.mjs`;
- `knowledge-trial-readiness.mjs`;
- runtime, UI, storage, persistence, reward, or event modules.

## Checked-File Registration

Add this content file to the existing `checks` array, adjacent to the other Knowledge player-content files:

```js
{
  file: "packages/content/base/player/knowledge_trial_policies.json",
  requiredTopLevel: ["records"],
  requireSlug: false,
  forbidGeoQualifierInName: false
}
```

This is intentionally a checked file because it is canonical authored content and should receive the same top-level file existence, JSON parse, wrapper, and general record checks as other normal content files.

The policy file must contribute exactly one entry to `checks.length`.

## Dependency Loading

Add a dedicated orchestration function near the current Knowledge dependency validators:

```js
async function validateKnowledgeTrialPoliciesAgainstDependencies() {
  const relativePath = "packages/content/base/player/knowledge_trial_policies.json";
  const policyPath = path.join(ROOT, relativePath);
  const policySchemaPath = path.join(
    ROOT,
    "packages/schemas/player/knowledge_trial_policy.schema.json"
  );
  const domainRegistryPath = path.join(
    ROOT,
    "packages/content/base/player/knowledge_domain_registry.json"
  );
  const snippetPath = path.join(
    ROOT,
    "packages/content/base/player/knowledge_snippets.json"
  );

  const parsedPolicyWrapper = JSON.parse(await readFile(policyPath, "utf8"));
  const parsedPolicySchema = JSON.parse(await readFile(policySchemaPath, "utf8"));
  const parsedDomainRegistryWrapper = JSON.parse(
    await readFile(domainRegistryPath, "utf8")
  );
  const parsedSnippetWrapper = JSON.parse(await readFile(snippetPath, "utf8"));

  validateKnowledgeTrialPolicies({
    relativePath: "packages/content/base/player/knowledge_trial_policies.json",
    wrapper: parsedPolicyWrapper,
    policySchema: parsedPolicySchema,
    domainRegistryWrapper: parsedDomainRegistryWrapper,
    snippetWrapper: parsedSnippetWrapper
  });
}
```

Names may follow local index conventions, but the four paths and validator argument keys must remain exact.

Dependency rules:

- all file reads stay in index orchestration;
- the validator remains file-I/O-free;
- each parsed input is passed directly and treated as read-only;
- no shared mutable global cache is introduced;
- no environment, clock, random, network, runtime, or UI input is consulted;
- no helper output is used as policy authority.

## Invocation Order

Await the new orchestration function in `main()` after the existing registry and snippet validators:

```js
await validateKnowledgeDomainRegistryAgainstDependencies();
await validateKnowledgeSnippetsAgainstDependencies();
await validateKnowledgeTrialPoliciesAgainstDependencies();
```

This order makes the dependency relationship legible:

1. domain registry validates through its existing owner;
2. snippets validate through their existing owner;
3. policy semantics validate against those authored dependencies.

The policy validator must not replace or bypass either existing validator.

## Failure Surface

Do not catch or rewrite validator errors inside the new orchestration function.

The existing top-level handler should remain the normal failure owner:

```js
main().catch((error) => {
  console.error("content-lint: failed", error.message);
  process.exitCode = 1;
});
```

This means:

- missing or unreadable schema fails normal lint;
- missing or unreadable policy content fails normal lint;
- missing or unreadable registry or snippets fail normal lint;
- invalid JSON fails normal lint;
- schema-invalid policy records fail before semantic checks in the validator;
- semantic errors retain the validator's deterministic path-bearing message;
- no success count is printed after a failure.

After registration, normal lint must reject:

- non-null readiness references;
- non-empty reward references;
- non-null registry `trialPolicyRef` values;
- Arcane Lore policies;
- inactive domain references;
- duplicate policy, domain, snippet, or target identities;
- missing or incoherent snippet references;
- policy/target domain, tier, or scope mismatch.

## Checked-File Accounting

The accounting decision is:

| Input | Accounting posture | Reason |
| --- | --- | --- |
| `knowledge_trial_policies.json` | Add once to `checks` | Canonical authored content entering normal lint |
| `knowledge_trial_policy.schema.json` | Dependency only | Record schema authority is loaded by orchestration and already has focused schema-file coverage |
| `knowledge_domain_registry.json` | No new count | Already listed in `checks` and validated by its existing semantic validator |
| `knowledge_snippets.json` | No new count | Already listed in `checks` and validated by its existing semantic validator |

Expected future output:

```text
content-lint: ok (56 files checked)
```

The increase is exactly `55 -> 56`. Loading a file again as a semantic dependency does not add another checked-file count.

Tests that assert absence from normal lint must be deliberately replaced. Any exact count assertion must be updated to 56 in the same implementation run.

## Registration Posture

Use one conservative implementation run for `Version 0.5.156 - Knowledge Trial Policy Normal Lint Registration`.

That run should:

- edit `tools/content-lint/index.mjs` only as needed for import, checked-file registration, dependency loading, and invocation;
- update focused normal-lint test coverage;
- leave the validator unchanged unless registration exposes a narrowly proven bug;
- leave policy content, schema, registry, snippets, and helpers unchanged;
- run current normal content lint and focused validator/integration tests.

A two-step import-then-invocation rollout would create an avoidable partially registered state and provides no additional safety because the validator already has focused coverage.

Registry alignment remains deferred after registration.

## Future Integration Coverage

The registration run should cover:

### Success and accounting

- normal content lint succeeds with the current exact one-record policy wrapper;
- stdout reports `content-lint: ok (56 files checked)`;
- the policy file appears exactly once in `checks`;
- the schema remains dependency-only;
- registry and snippets remain counted only through their existing entries.

### Wiring

- index imports `validateKnowledgeTrialPolicies`;
- index explicitly loads all four required paths;
- index passes the exact five validator arguments;
- index awaits policy validation before the success log;
- existing registry and snippet validator calls remain present and ordered first.

### Failure propagation

- focused validator tests continue to prove structural and semantic failure cases;
- source-level orchestration coverage proves the call is awaited without an intermediate catch;
- the normal tool-surface integration proves the CLI exits successfully for current content;
- if the existing test harness can inject alternate file roots without production behavior or fixture expansion, one narrow malformed-policy CLI case may prove nonzero failure directly;
- do not add a production environment override, mutable global seam, or content mutation solely to inject a CLI failure.

The direct awaited call plus existing validator failure coverage is sufficient if no safe injection seam already exists.

### Existing tests to update

- replace the `tests/unit/schema-files.test.mjs` assertion that policy content is absent from normal lint with exact registration assertions;
- replace the `tests/unit/knowledge-trial-policies-validation.test.mjs` "normal content lint remains unregistered" assertion with source wiring and purity-boundary assertions;
- update `tests/integration/tool-surfaces.test.mjs` only if needed to assert the expected content-lint success output and count;
- keep the remaining focused validator cases unchanged and passing.

### Safety audits

- validator source still contains no file reads;
- validator still imports no completion, eligibility, or readiness helper;
- no content-to-helper adapter exists;
- all registry `trialPolicyRef` values remain null;
- no policy content is loaded by runtime or UI code;
- Knowledge, Skill, and Spell/Magic Study trial families remain separate.

## Non-Goals

Registration must not add:

- a content-to-helper adapter;
- completion, eligibility, or readiness helper calls;
- canonical completion-policy content;
- readiness policy schema or content;
- registry `trialPolicyRef` activation;
- attempt, checkpoint, outcome, cooldown, unlock, or reward behavior;
- reward interpretation or grant behavior;
- trial execution;
- storage, persistence, save, account, session, or database ownership;
- UI, runtime, generated output, command, or event behavior;
- Skill Trial or Spell/Magic Study behavior.

## Future Implementation Acceptance Criteria

`Version 0.5.156` is complete only when:

- `tools/content-lint/index.mjs` imports the existing policy validator;
- `knowledge_trial_policies.json` is added exactly once to `checks`;
- normal checked-file output intentionally changes from 55 to 56;
- index explicitly reads and parses policy content, policy schema, registry, and snippets;
- index calls the validator with the exact explicit input contract;
- the call is awaited after existing registry and snippet semantic validation;
- load, parse, structural, and semantic errors propagate through normal lint failure output;
- normal content lint passes current content;
- all focused policy validator tests still pass;
- focused integration/source coverage proves registration is active and not silently skipped;
- obsolete unregistered assertions are replaced;
- existing domain-registry and snippet validation remains active;
- the policy validator remains pure and file-I/O-free;
- policy content, schema, registry, snippets, and existing helpers remain unchanged;
- every registry `trialPolicyRef` remains null;
- no adapter, readiness policy, state, storage, persistence, UI, runtime, generated output, event, reward, ownership mutation, or gameplay behavior is added.

## Risks And Deferred Work

- No content-to-helper adapter exists. Lint registration must not create one implicitly.
- Canonical completion-policy content does not exist. The authored trial policy cannot become executable helper authority yet.
- Readiness policy schema and content remain deferred.
- Registry alignment remains deferred and all `trialPolicyRef` values remain null.
- Current Flora Tier 1 has one authored counting snippet, so the first policy remains intentionally narrow.
- Reward references remain inert and empty.
- `trialUnlockWeight` remains uninterpreted.
- Mutable attempt, checkpoint, outcome, cooldown, and ownership authority is undefined.
- Storage and persistence ownership remains undefined.
- Arcane Lore remains planned, blocked, and deferred.

## Next Version

`Version 0.5.156 - Knowledge Trial Policy Normal Lint Registration`
