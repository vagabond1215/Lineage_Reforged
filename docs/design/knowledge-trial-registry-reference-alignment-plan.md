# Knowledge Trial Registry Reference Alignment Plan

Source version/run: Version 0.5.157 - Knowledge Trial Registry Reference Alignment Plan
Date: 2026-06-15
Status: documentation-only alignment plan

## 1. Purpose And Status

This plan defines the first narrow alignment between the broad Knowledge domain registry and the registered static Knowledge trial policy catalog.

This run changes documentation only. It does not change:

- registry, policy, or snippet content;
- registry, policy, or snippet validators;
- schemas, tests, fixtures, helpers, or adapters;
- readiness policy schema or content;
- attempts, checkpoints, outcomes, cooldowns, rewards, unlocks, events, or ownership;
- storage, persistence, save, account, session, database, runtime, UI, generated output, or gameplay behavior;
- Skill Trial or Spell/Magic Study files;
- family, religion, ecology, or recipe design documents.

Every current registry `trialPolicyRef` remains null in this planning run.

## 2. Current Authority Recap

- `packages/content/base/player/knowledge_domain_registry.json` owns the broad Knowledge domain registry.
- `packages/content/base/player/knowledge_trial_policies.json` owns the exact one-record Flora Tier 1 static eligibility-policy catalog.
- `packages/content/base/player/knowledge_snippets.json` owns current authored snippet content.
- `packages/schemas/player/knowledge-domain-registry.schema.json` already permits a null or canonical `knowledge_trial_policy.*` reference.
- `packages/schemas/player/knowledge_trial_policy.schema.json` owns policy structure, including domain/tier scope.
- `tools/content-lint/knowledge-domain-registry.mjs` owns registry-local semantic validation.
- `tools/content-lint/knowledge-trial-policies.mjs` owns policy semantics and already receives registry and snippet wrappers.
- `tools/content-lint/index.mjs` registers registry, snippet, and policy validation in normal content lint.
- Normal content lint currently succeeds with 56 checked files.

Both current validators still reject every non-null registry `trialPolicyRef`. The registered Flora Tier 1 policy is therefore valid but not referenced by registry content.

## 3. Alignment Problem

The logical first link is:

- registry domain: `knowledge_domain.flora`;
- policy: `knowledge_trial_policy.flora_tier_1`;
- policy scope: `tier`;
- policy tier: `1`.

The current null-only checks block that content change.

The registry record has one domain-level `trialPolicyRef` and no independent tier field or tier-to-policy map. The policy record itself carries the authoritative scope and tier. Therefore:

- the current shape can cleanly represent one selected static eligibility policy for a domain;
- it cannot enumerate multiple tier policies for the same domain;
- lint must not infer tier from policy-id text;
- a second active policy for Flora must remain blocked until a separate schema/content plan selects an array, keyed tier map, or dedicated policy index.

This plan uses the existing single-reference shape for the first Flora Tier 1 slice. It does not claim that the shape is sufficient for a complete multi-tier catalog.

## 4. Proposed Alignment Model

For the first implementation, `trialPolicyRef` means:

> The single registry-selected static Knowledge trial eligibility policy for this domain. The referenced policy record owns its scope, tier, requirements, and inert metadata.

Required rules:

- the registry reference must be a canonical policy id, never a name-derived match;
- the policy id must exist exactly once in `knowledge_trial_policies.json`;
- the referenced policy must be `active`;
- the registry domain must be `active` and must not be Arcane Lore;
- the policy `domainId` must equal the registry record `id`;
- policy scope/tier coherence remains owned by the policy schema and policy validator;
- one policy id may be referenced by at most one registry record;
- every active policy must be referenced exactly once under the current single-policy-per-domain posture;
- deferred policies may remain unreferenced;
- `completionPolicyRef` and `visibilityPolicyRef` remain null.

A non-null `trialPolicyRef` is content-lint authority only. It does not:

- call completion, eligibility, or readiness helpers;
- make a trial ready or executable;
- create an attempt, checkpoint, outcome, cooldown, reward, event, or unlock;
- grant ownership or mutate state;
- authorize runtime, UI, storage, or persistence behavior.

## 5. Exact First Alignment Candidate

The future content edit should be exactly:

```json
{
  "id": "knowledge_domain.flora",
  "trialPolicyRef": "knowledge_trial_policy.flora_tier_1"
}
```

This excerpt is illustrative; the future run should edit only the existing Flora record field and preserve every other field.

The referenced policy already declares:

```json
{
  "policyId": "knowledge_trial_policy.flora_tier_1",
  "status": "active",
  "scope": "tier",
  "domainId": "knowledge_domain.flora",
  "tier": 1
}
```

No policy edit is required. The policy's Tier 1 declaration and matching Tier 1 completion target remain the tier authority.

All Fauna, Minerals, Arcane Lore, and General Lore `trialPolicyRef` values remain null. Arcane Lore remains planned, blocked, and deferred.

## 6. Future Validator Changes

### Registry Validator

`tools/content-lint/knowledge-domain-registry.mjs` should:

- stop applying the generic null-only rule to `trialPolicyRef`;
- continue requiring `completionPolicyRef` and `visibilityPolicyRef` to remain null;
- accept a schema-valid non-null `trialPolicyRef` only on an active domain;
- reject non-null trial references on planned, draft, deferred, or Arcane Lore records;
- remain registry-local and file-I/O-free;
- not load policy content or duplicate cross-file policy validation.

The registry schema already permits the planned canonical reference, so no schema edit is needed.

### Policy Validator

`tools/content-lint/knowledge-trial-policies.mjs` should replace its registry-null loop with bidirectional cross-file validation:

1. validate and index policy records by exact `policyId`;
2. inspect each non-null registry `trialPolicyRef`;
3. resolve the exact policy id;
4. require active non-Arcane registry authority;
5. require referenced policy status `active`;
6. require exact registry-domain/policy-domain parity;
7. reject a policy id referenced by more than one registry record;
8. require each active policy to be referenced exactly once;
9. preserve existing policy scope, tier, completion-target, readiness-null, reward-empty, snippet, and purity rules.

Cross-file alignment belongs here because this validator already receives both policy and registry wrappers. `tools/content-lint/index.mjs` does not need a new file load, checked-file entry, or orchestration function.

### Focused Tests

Future registry-validator tests should:

- accept the exact Flora non-null trial reference;
- reject a trial reference on a non-active or Arcane domain;
- continue rejecting non-null completion and visibility policy references;
- preserve all unrelated registry checks.

Future policy-validator tests should:

- accept the exact Flora-to-Flora-Tier-1 alignment;
- reject an unknown policy id;
- reject registry/policy domain mismatch;
- reject a reference to a deferred policy;
- reject duplicate references to one policy id;
- reject an active policy with no registry reference;
- preserve existing policy tier/target mismatch failures;
- preserve readiness-null, reward-empty, Arcane, purity, and helper-isolation checks.

`tests/unit/schema-files.test.mjs` should replace the all-null registry assertion with:

- exact Flora reference equals `knowledge_trial_policy.flora_tier_1`;
- every other registry `trialPolicyRef` remains null;
- policy content remains unchanged.

`tests/integration/tool-surfaces.test.mjs` needs no change unless the implementation alters an existing assertion. Normal lint must still report 56 files checked.

## 7. Future Content Change

`Version 0.5.158` may change only this authored content field:

- `packages/content/base/player/knowledge_domain_registry.json`
  - set the Flora record's `trialPolicyRef` to `knowledge_trial_policy.flora_tier_1`.

The future run should not change:

- `knowledge_trial_policies.json`;
- `knowledge_snippets.json`;
- either schema;
- registry notes or unrelated metadata;
- any other domain reference.

Validator support must land in the same narrow run before normal lint can accept the content edit.

## 8. Failure Modes

Future normal lint must reject:

- a non-null reference to an unknown policy id;
- a reference resolved from display text, slug, or naming convention instead of exact id;
- registry-domain/policy-domain mismatch;
- policy tier/required-target mismatch;
- a reference on an inactive domain;
- any Arcane Lore policy reference;
- a reference to a deferred policy;
- duplicate use of one policy id by multiple registry records;
- more than one active policy for a domain while the registry has only one pointer;
- an active policy that is not represented by a registry reference;
- readiness, reward, helper, runtime, state, or persistence fields used as alignment authority.

The registry has no independent tier declaration. Therefore alignment lint compares the registry domain to the policy domain, then relies on existing policy-internal scope/tier validation. It must not parse `_tier_1` from the policy id.

## 9. Checked-File And Normal-Lint Posture

- Normal content lint remains at 56 checked files.
- Registry and policy content remain checked exactly once each.
- Snippets remain checked exactly once.
- Schema files remain dependency or focused-test inputs and do not add checked-content counts.
- No fixture, generated output, runtime content, or additional content file is introduced.
- Existing registry, snippet, and policy orchestration order remains unchanged.

## 10. Non-Goals

This alignment does not add:

- readiness policy schema or content;
- a content-to-helper adapter;
- trial attempts, checkpoints, outcomes, cooldowns, rewards, or unlock processing;
- completion, eligibility, or readiness helper calls;
- state, storage, persistence, save, account, session, or database ownership;
- runtime, UI, generated output, commands, or events;
- Skill Trial or Spell/Magic Study changes;
- family, religion, ecology, recipe, heir, or offspring pipeline integration;
- multi-tier registry schema expansion.

## 11. Acceptance Criteria For Version 0.5.158

`Version 0.5.158 - Knowledge Trial Registry Reference Alignment` is complete only when:

- the Flora registry record references `knowledge_trial_policy.flora_tier_1`;
- every other registry `trialPolicyRef` remains null;
- policy and snippet content remain unchanged;
- the registry validator permits the exact active Flora reference while retaining null-only completion/visibility policy rules;
- the policy validator resolves registry references by exact id and enforces active status, domain parity, uniqueness, and active-policy representation;
- existing policy scope/tier and required-target coherence remains enforced;
- invalid, unknown, duplicate, inactive, Arcane, deferred, and domain-mismatched references fail focused tests;
- normal content lint succeeds with 56 files checked;
- no schema or index change is required;
- no helper, adapter, readiness, attempt, checkpoint, outcome, cooldown, reward, unlock, state, storage, persistence, UI, runtime, generated output, event, ownership mutation, or gameplay behavior is introduced.

## 12. Risks And Deferred Work

- The current registry supports one selected policy reference per domain, not a complete tier map.
- A second active policy for one domain requires a separate registry-shape plan before implementation.
- Registry alignment does not make the trial runnable.
- Readiness policy schema/content remains deferred.
- Flora Tier 1 still has one authored counting snippet.
- Rewards remain inert and empty.
- `trialUnlockWeight` remains uninterpreted.
- Mutable trial authority and persistence remain undefined.
- No content-to-helper adapter exists.
- Knowledge, Skill, and Spell/Magic Study trial families remain separate.
- Family, religion, ecology, and recipe expansion documents remain future roadmap material.

## 13. Next Recommended Run

`Version 0.5.158 - Knowledge Trial Registry Reference Alignment`

That run should implement only the exact Flora reference, minimal registry/policy validator reconciliation, and focused tests defined above.
