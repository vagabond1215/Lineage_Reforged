# Knowledge Trial Policy Semantic Validator Plan

Source version/run: Version 0.5.153 - Knowledge Trial Policy Semantic Validator Plan
Date: 2026-06-14
Status: documentation-only semantic validator planning

## 1. Purpose And Status

This document defines the future pure semantic validation boundary for authored static Knowledge trial eligibility-policy content.

This run is documentation only. It adds no semantic validator, content-lint registration, schema edit, content edit, test, fixture, helper change, content-to-helper adapter, storage, persistence, save/account/session/database shape, UI, runtime, generated output, event, reward, ownership mutation, or gameplay behavior.

The current completion, eligibility, and readiness helpers remain unchanged and must not be called by static content validation.

## 2. Current Authority Recap

- `packages/schemas/player/knowledge_trial_policy.schema.json` owns structural validation for one static authored policy record.
- `packages/content/base/player/knowledge_trial_policies.json` owns the exact current one-record Flora Tier 1 content skeleton.
- `docs/design/knowledge-trial-policy-content-plan.md` owns the selected content path, wrapper, first record, registry-null posture, and semantic-validation expectations.
- `docs/design/knowledge-trial-schema-plan.md` owns the static-policy boundary, mutable-state exclusions, and deferred readiness posture.
- `packages/content/base/player/knowledge_domain_registry.json` owns domain status and nullable `trialPolicyRef` values.
- `packages/content/base/player/knowledge_snippets.json` owns authored Knowledge snippets.
- `tools/content-lint/knowledge-domain-registry.mjs` and `tools/content-lint/knowledge-snippets.mjs` show the current pure, schema-first, fail-closed validation style and reference-validation conventions.
- `tools/content-lint/index.mjs` owns normal content-lint orchestration, but the Knowledge trial policy file is not currently registered.
- `tools/content-lint/knowledge-completion.mjs`, `tools/content-lint/knowledge-trial-eligibility.mjs`, and `tools/content-lint/knowledge-trial-readiness.mjs` remain operation-local decision helpers, not static content validators.

The prompt's referenced `tools/content-lint/knowledge-domains.mjs` path does not exist. The current broad registry validator is `tools/content-lint/knowledge-domain-registry.mjs`.

## 3. Semantic Validator Purpose

The future validator should validate authored static Knowledge trial policy content beyond record-schema structure.

It must fail closed on:

- malformed wrappers;
- schema-invalid records;
- duplicate or misleading policy ids;
- unresolved, duplicate, inactive, planned, or Arcane Lore domain authority;
- incoherent policy scope, domain, tier, and completion targets;
- duplicate requirements;
- unresolved or cross-domain snippets;
- premature readiness or reward references;
- premature registry activation;
- forbidden mutable, runtime, persistence, UI, or cross-family authority.

It should produce deterministic lint-style failures only. It must never create helper inputs, completion decisions, eligibility envelopes, readiness envelopes, attempts, checkpoints, outcomes, cooldowns, rewards, unlocks, events, UI, runtime behavior, storage writes, or gameplay behavior.

## 4. Future Location And Entry Point

Recommended future module:

- `tools/content-lint/knowledge-trial-policies.mjs`

Recommended pure entry point:

```js
validateKnowledgeTrialPolicies({
  relativePath,
  wrapper,
  policySchema,
  domainRegistryWrapper,
  snippetWrapper
})
```

The module should perform no file reads or writes. The implementation test should pass parsed in-memory inputs explicitly.

Version 0.5.154 should add the module and focused tests only. It should remain unregistered in `tools/content-lint/index.mjs`.

Normal registration should wait for a separate run that confirms:

1. the validator accepts the unchanged canonical content;
2. focused negative tests cover every fail-closed authority boundary;
3. source audits prove no helper, runtime, storage, or environment dependency;
4. the normal lint orchestration can load the schema, policy content, registry, and snippets without duplicating authority;
5. the checked-file count and integration expectations are updated explicitly.

## 5. Input Contract

Required explicit inputs:

- `relativePath`: stable path text for diagnostics;
- `wrapper`: parsed `knowledge_trial_policies.json`;
- `policySchema`: parsed `knowledge_trial_policy.schema.json`;
- `domainRegistryWrapper`: parsed broad domain registry wrapper;
- `snippetWrapper`: parsed authored snippet wrapper.

Forbidden inputs:

- owner ids or owner-specific state;
- completion, eligibility, or readiness envelopes;
- applied progress or evidence;
- attempts, cooldowns, availability facts, checkpoints, or outcomes;
- runtime, session, save, account, database, or persistence state;
- wall-clock values, randomness, environment variables, hidden counters, or runtime globals.

The validator must not derive or invoke operation-local helper inputs.

The supplied domain and snippet authorities must also use exact non-empty `records` wrappers. Their record schemas and existing semantic validators remain the owners of their full contracts; this validator should only fail closed when the minimum identity, status, domain, tier, and duplicate-reference fields needed for policy validation are missing or ambiguous. It must not duplicate the full registry or snippet validator.

## 6. Wrapper And Structural Validation

The validator must require:

- `wrapper` is a non-array object;
- the wrapper contains exactly one key, `records`;
- `records` is an array;
- `records` is non-empty;
- every record passes the live policy schema before semantic checks run.

The wrapper must contain no metadata, version, defaults, notes, owner state, registry state, runtime state, or generated-output fields.

The future module should use a narrow fail-closed structural adapter driven by the live schema, following current Knowledge lint conventions. It may reuse implementation-local adapter utilities only if doing so does not broaden scope or alter existing validators. Unsupported schema keywords must fail rather than be ignored.

Structural failures should stop semantic validation for the affected catalog and identify the record path, such as `records[0].domainId`.

## 7. Policy Identity Validation

- `policyId` must be unique across records.
- Schema validation remains the owner of the canonical id pattern.
- The current first record must remain `knowledge_trial_policy.flora_tier_1`.
- Id suffix tokens must not imply readiness, attempts, rewards, unlocks, checkpoints, outcomes, runtime execution, success, or failure.
- The initial blocked token set should include `readiness`, `attempt`, `reward`, `unlock`, `checkpoint`, `outcome`, `runtime`, `success`, and `failure`.
- Id validation is descriptive only; it creates no trial state or behavior.

Record order is not semantic authority. The validator should not require alphabetical sorting.

## 8. Domain Validation

Every policy and completion-target `domainId` must:

- resolve to exactly one domain registry record;
- reference a domain whose status is exactly `active`;
- not reference `knowledge_domain.arcane_lore`;
- match the containing policy's `domainId`.

Missing, duplicate, planned, inactive, deferred, or ambiguous domain records fail.

The validator must build a duplicate-aware domain index. A simple map that silently overwrites duplicate ids is insufficient.

No Skill Trial, Spell/Magic Study, known-spell, or magic-school authority may substitute for a Knowledge domain.

## 9. Scope, Domain, And Tier Coherence

Schema validation owns the basic domain/tier shape:

- domain policy omits `tier`;
- tier policy requires a positive integer `tier`.

The first semantic validator adds these coherence rules:

- every completion target must use the policy's exact `domainId`;
- a domain-scoped policy must contain at least one required domain target for the same domain;
- a tier-scoped policy must contain at least one required tier target for the same domain and exact policy tier;
- snippet requirements may supplement a policy but cannot alone prove domain or tier scope;
- prerequisite targets do not satisfy the primary matching-target requirement;
- a tier target under a tier policy must use the exact top-level tier;
- domain targets under tier policies and tier targets under domain policies are blocked in the first validator unless a later plan explicitly authorizes mixed-scope policy semantics.

The current record must remain tier-scoped to `knowledge_domain.flora`, tier `1`, with an exact required Flora Tier 1 target.

The validator must not infer tier from snippet ids, snippet records, completion envelopes, file order, or catalog order.

## 10. Completion Target Validation

Both requirement arrays use the schema's exact snippet, tier, and domain variants.

Semantic rules:

- `requiredCompletionTargets` must be non-empty;
- `prerequisiteCompletionTargets` may be empty;
- `requiredDecision` must remain exactly `candidate`;
- every target domain must resolve active, non-Arcane, and match the policy domain;
- duplicate targets within either array fail;
- a target repeated across required and prerequisite arrays fails;
- no Skill Trial or Spell/Magic Study requirement is accepted.

Use a deterministic target key:

- snippet: `snippet|domainId|snippetId|candidate`;
- tier: `tier|domainId|tier|candidate`;
- domain: `domain|domainId|candidate`.

Object identity and source-property order must not affect duplicate detection.

## 11. Snippet Requirement Validation

For each snippet requirement:

- `snippetId` must resolve to exactly one authored Knowledge snippet;
- duplicate snippet ids in the supplied snippet authority fail closed;
- the snippet id's domain slug must align with the requirement `domainId`;
- the snippet record's `domainId` must equal the requirement and policy domain;
- if a future snippet status field exists, only `active` may be referenced;
- missing, malformed, inactive, duplicate, or cross-domain snippets fail.

A snippet requirement does not infer or satisfy policy tier or domain scope by itself. The validator does not evaluate snippet completion.

## 12. Tier And Domain Requirement Validation

Tier requirement:

- tier remains an explicit positive integer;
- domain must resolve active and non-Arcane;
- tier is static policy authority only;
- owner state and tier completion are not evaluated;
- required snippets are not inferred from tier.

Domain requirement:

- domain must resolve active and non-Arcane;
- domain scope is allowed only when explicitly authored and matched by a domain-scoped policy;
- current snippet inventory must not be used to infer a tier set or whole-domain completeness.

## 13. Readiness And Reward Posture

`readinessPolicyId`:

- must currently be `null`;
- any non-null value is a hard semantic error until readiness policy schema/content authority and exact reference-parity rules are separately approved.

`rewardRefs`:

- must currently be empty;
- non-empty references are a hard semantic error, not a warning;
- references remain inert and create no reward ownership, reservation, grant, unlock, preview, UI display, event, or runtime effect.

Hard failure is selected because no current readiness or reward-reference authority can resolve these values. Warning-only acceptance would permit unsafe authority to enter canonical content.

## 14. Registry `trialPolicyRef` Posture

All current `knowledge_domain_registry.json` `trialPolicyRef` values must remain `null`.

The semantic validator should fail if any supplied registry record has a non-null `trialPolicyRef` before a separately authorized registry-alignment run.

Future alignment must require:

- policy content exists;
- semantic validation is implemented and passing;
- the referenced policy id is unique;
- the referenced policy status is `active`;
- policy domain exactly equals registry domain;
- target-scope parity is explicitly allowed;
- Arcane Lore is excluded.

Registry alignment is not part of Version 0.5.154.

## 15. Forbidden Field And Family Validation

The schema's `additionalProperties: false` is the primary record-level guard. Focused validator tests and source audits should preserve explicit rejection of:

- `ownerId`;
- completion, eligibility, or readiness envelopes;
- attempts, attempt history, cooldowns, availability facts, sequence/time snapshots;
- checkpoints, outcomes, reward state, unlock state;
- UI, runtime, generated output, events;
- save, account, session, database, storage, or persistence fields;
- Skill Trial fields;
- Spell/Magic Study fields.

The validator must not create an alternate permissive path around schema rejection.

## 16. Diagnostic Posture

Current Knowledge lint helpers throw `Error` instances with stable path-bearing messages. The future validator should follow that convention.

Diagnostics should include:

- `relativePath`;
- `records[index]` and the relevant field or target index;
- record id when structurally available;
- the offending referenced value;
- one stable reason phrase.

Examples of stable message shape:

```text
packages/content/base/player/knowledge_trial_policies.json records[0].domainId 'knowledge_domain.arcane_lore' must reference an active non-Arcane domain
```

```text
packages/content/base/player/knowledge_trial_policies.json records[1].policyId duplicates 'knowledge_trial_policy.flora_tier_1'
```

Separate diagnostic codes are not required for the first implementation because current content-lint convention is exception-message based. Tests should assert stable meaningful message fragments rather than full incidental formatting.

There should be no warning path for ambiguous authority. Unsafe or unresolved authority fails closed.

## 17. Purity And Determinism

The validator must be a pure in-memory content check:

- deterministic for identical inputs;
- independent of record order except location indices in diagnostics;
- no `Date.now`;
- no `new Date`;
- no `Math.random`;
- no `process.env`;
- no filesystem mutation;
- no network;
- no hidden counters;
- no runtime globals;
- no completion, eligibility, or readiness helper calls.

It may construct local maps and sets from explicit inputs. It must not mutate those inputs.

## 18. Future Focused Test Matrix

Positive:

- current one-record wrapper passes unchanged;
- exact Flora Tier 1 policy and target pass;
- empty prerequisites, null readiness, and empty rewards pass;
- deterministic repeated validation produces the same result.

Wrapper and structure:

- non-object wrapper fails;
- extra wrapper key fails;
- missing, non-array, or empty `records` fails;
- schema-invalid record fails before semantic checks.

Identity and domain:

- duplicate policy ids fail;
- misleading policy-id suffix fails;
- missing or duplicate domain authority fails;
- planned, inactive, deferred, or Arcane Lore domain fails;
- policy and target domain mismatch fails.

Scope and targets:

- coherent Flora Tier 1 requirement passes;
- tier policy without exact matching tier target fails;
- domain policy without exact matching domain target fails;
- mixed policy/target scope fails in the first validator;
- duplicate required target fails;
- duplicate prerequisite target fails;
- duplicate across required and prerequisite arrays fails.

Snippet:

- existing same-domain snippet requirement resolves;
- unresolved or duplicate snippet authority fails;
- snippet id slug/domain mismatch fails;
- snippet record/domain mismatch fails;
- snippet-only target does not satisfy tier or domain policy coherence.

Deferred authority:

- non-null `readinessPolicyId` fails;
- non-empty `rewardRefs` fails;
- non-null registry `trialPolicyRef` fails;
- owner, mutable, runtime, persistence, and cross-family fields fail structurally.

Safety audits:

- inputs remain unchanged;
- source contains no completion, eligibility, or readiness helper import/call;
- source contains no runtime, storage, persistence, network, clock, randomness, or environment dependency;
- normal content-lint remains unregistered in Version 0.5.154.

## 19. Version 0.5.154 Acceptance Criteria

`Version 0.5.154 - Knowledge Trial Policy Semantic Validator` is acceptable only when:

- it adds `tools/content-lint/knowledge-trial-policies.mjs`;
- it adds one focused validator test file;
- it implements a pure, schema-first, fail-closed validator over explicit inputs;
- current one-record Flora Tier 1 content passes unchanged;
- malformed wrappers, duplicate ids, invalid references, incoherent targets, premature readiness/rewards, and premature registry activation produce deterministic diagnostics;
- current content and schemas remain unchanged;
- all registry `trialPolicyRef` values remain null;
- it does not call completion, eligibility, or readiness helpers;
- it remains unregistered in normal content lint;
- it adds no adapter, readiness content, mutable authority, storage, persistence, runtime, UI, generated output, events, rewards, ownership mutation, or gameplay behavior.

Recommended implementation files:

- `tools/content-lint/knowledge-trial-policies.mjs`;
- `tests/unit/knowledge-trial-policies-validation.test.mjs`;
- required coordination docs only.

## 20. Risks And Deferred Work

- No content-to-helper adapter exists.
- Canonical completion-policy content does not exist.
- Readiness schema/content remains deferred.
- Current Flora Tier 1 has one authored counting snippet.
- Registry alignment remains deferred.
- Reward references remain inert and empty.
- `trialUnlockWeight` remains uninterpreted.
- Mutable authority and persistence ownership are undefined.
- Attempt, checkpoint, outcome, cooldown, runtime, UI, event, and gameplay ownership are undefined.
- Normal content-lint registration remains deferred until the focused validator is proven.
- Arcane Lore remains planned, blocked, and deferred.

## 21. Non-Goals

This plan authorizes no validator implementation, content-lint registration, schema or content edit, test, fixture, helper change, adapter, registry alignment, readiness content, mutable state, storage, persistence, UI, runtime, generated output, event, reward, ownership mutation, gameplay behavior, Skill Trial work, Spell/Magic Study work, or unrelated cleanup.

## 22. Next Recommended Run

The next recommended run is:

`Version 0.5.154 - Knowledge Trial Policy Semantic Validator`

It should add only the pure unregistered validator module, focused tests, and required coordination docs. Normal content-lint registration and registry alignment remain separate future runs.
