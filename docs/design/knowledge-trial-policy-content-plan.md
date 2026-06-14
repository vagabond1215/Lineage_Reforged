# Knowledge Trial Policy Content Plan

Source version/run: Version 0.5.151 - Knowledge Trial Policy Content Plan
Date: 2026-06-14
Status: documentation-only authored Knowledge trial eligibility-policy content planning

## 1. Purpose And Status

This document selects the smallest safe first authored Knowledge trial eligibility-policy content slice.

This run is documentation only. It adds no policy content JSON, schema edit, semantic validator, content-to-helper adapter, helper change, test, fixture, normal content-lint registration, storage, persistence, save/account/session/database shape, UI, runtime, generated output, event, reward, ownership mutation, or gameplay behavior.

The current completion, eligibility, and readiness helpers remain unchanged.

## 2. Current Authority Recap

- `packages/schemas/player/knowledge_trial_policy.schema.json` owns the strict structure of one static eligibility-policy record.
- `docs/design/knowledge-trial-schema-plan.md` owns the static policy/content split, recommended content paths, mutable-authority exclusions, staged validation sequence, and deferred readiness posture.
- `tools/content-lint/knowledge-completion.mjs` owns current pure in-memory snippet, tier, and domain completion decisions.
- `tools/content-lint/knowledge-trial-eligibility.mjs` owns current operation-local eligibility evaluation.
- `tools/content-lint/knowledge-trial-readiness.mjs` owns current operation-local readiness evaluation.
- `packages/content/base/player/knowledge_domain_registry.json` owns current active/planned domain status and nullable `trialPolicyRef` posture.
- `packages/content/base/player/knowledge_snippets.json` owns the current authored snippet inventory.

The current active domains are Flora, Fauna, Minerals, and General Lore. Arcane Lore is planned and is not eligible for active trial policy content.

The current snippet inventory contains one Tier 1 snippet in each active domain:

- `knowledge_snippet.flora.aloe.identification`;
- `knowledge_snippet.fauna.badger.identification`;
- `knowledge_snippet.minerals.iron_ore.identification`;
- `knowledge_snippet.general_lore.kaelvar.cultural_context`.

All four snippets count toward tier completion with completion weight `1`. Their `trialUnlockWeight` values are `0` and have no approved policy interpretation.

## 3. Planned Content Boundary

The first authored content must contain static eligibility policy only.

Every record must match `packages/schemas/player/knowledge_trial_policy.schema.json`.

Authored policy may contain:

- stable policy identity;
- active or deferred status;
- character owner scope without an owner id;
- exact domain or tier policy scope;
- exact completion requirements;
- a nullable inert readiness-policy reference;
- inert reward references;
- authored notes.

Authored policy must not contain:

- `ownerId`;
- eligibility or readiness envelopes;
- completion decisions as state;
- attempts or attempt history;
- cooldown state;
- availability facts;
- sequence or time snapshots;
- checkpoints or outcomes;
- reward ownership or grant state;
- UI, runtime, generated-output, event, storage, persistence, save, account, session, database, or gameplay data;
- Skill Trial or Spell/Magic Study authority.

The first slice should use `readinessPolicyId: null` because no readiness content authority exists.

The first slice should use `rewardRefs: []` because no approved Knowledge trial reward-reference catalog or grant boundary exists. Empty references are safer than inventing inert-looking ids that could later be mistaken for reward authority.

## 4. Recommended Future Content Path And Shape

Recommended future path:

- `packages/content/base/player/knowledge_trial_policies.json`

The future file should use a wrapper object:

```json
{
  "records": []
}
```

Reasons:

- current authored player catalogs use explicit `records` wrappers;
- current Knowledge validators and helpers consume wrapper-shaped authorities;
- the record-level schema can be applied independently to every entry;
- a later semantic validator can own wrapper exactness, non-empty posture, policy-id uniqueness, references, and cross-record rules without changing the record schema;
- the wrapper leaves eligibility policy separate from readiness policy and mutable state.

The record schema remains record-level only. The future content implementation should parse the wrapper, then validate each `records[index]` against `knowledge_trial_policy.schema.json`.

This run does not create the file.

## 5. Candidate Selection Rules

The first authored policy set must:

- use only domains whose registry status is `active`;
- use only existing authored snippets when a snippet requirement is selected;
- exclude planned, draft, deferred, unresolved, or ambiguous domains;
- exclude Arcane Lore;
- avoid inferring snippet tier from a snippet id, snippet record, completion envelope, policy target, or catalog order;
- avoid unresolved or cross-domain snippet references;
- keep `readinessPolicyId` null until readiness policy content exists;
- keep `rewardRefs` empty until reward-reference authority is approved;
- avoid Skill Trial and Spell/Magic Study concepts;
- avoid `trialUnlockWeight` as an eligibility source;
- require explicit `candidate` completion decisions only.

The first content slice should not attempt broad active-domain coverage. One policy is sufficient to establish content shape without implying that every current domain is ready for authored trials.

## 6. Policy Identifier Convention

Use:

```text
knowledge_trial_policy.<domain_slug>_<policy_scope>
```

For tier policy:

```text
knowledge_trial_policy.<domain_slug>_tier_<positive_integer>
```

For domain policy:

```text
knowledge_trial_policy.<domain_slug>_domain
```

Examples:

- `knowledge_trial_policy.flora_tier_1`;
- `knowledge_trial_policy.flora_domain`.

Ids must describe static eligibility targets only. They must not imply attempts, readiness, unlocks, rewards, checkpoints, outcomes, success, failure, or runtime execution.

## 7. Requirement Conventions

Both requirement arrays use the same strict variants.

### Snippet Requirement

Exact fields:

- `scope: "snippet"`;
- exact `knowledge_domain.*` `domainId`;
- exact `knowledge_snippet.*` `snippetId`;
- `requiredDecision: "candidate"`.

No `tier` is allowed. No tier may be inferred.

### Tier Requirement

Exact fields:

- `scope: "tier"`;
- exact `knowledge_domain.*` `domainId`;
- positive integer `tier`;
- `requiredDecision: "candidate"`.

### Domain Requirement

Exact fields:

- `scope: "domain"`;
- exact `knowledge_domain.*` `domainId`;
- `requiredDecision: "candidate"`.

`requiredCompletionTargets` must be non-empty. `prerequisiteCompletionTargets` may be empty.

The planned first content must contain no duplicate target within either array and no target repeated across the two arrays. Those rules require later semantic enforcement even though the initial record schema does not enforce them.

## 8. Option A: One Domain-Scoped Policy

Candidate:

- `knowledge_trial_policy.flora_domain`;
- policy scope `domain`;
- required domain completion candidate for `knowledge_domain.flora`.

Advantages:

- minimal record shape;
- no top-level tier;
- directly consumes a domain completion envelope.

Risks:

- domain completion depends on an explicit set of required tiers;
- the current authored catalog has only one snippet and one represented tier in Flora;
- treating current narrow coverage as domain-level readiness would overstate content maturity;
- a domain trial is broader than the first safe authored policy needs to be.

Decision: do not select for the first slice.

## 9. Option B: One Tier-Scoped Policy

Candidate:

- `knowledge_trial_policy.flora_tier_1`;
- policy scope `tier`;
- required Flora Tier 1 completion candidate.

Advantages:

- matches the intended boundary that Knowledge trials follow explicit tier completion;
- uses one exact active domain and one exact positive tier;
- does not infer tier from a snippet completion envelope;
- does not claim whole-domain completion;
- aligns with the current completion helper's explicit tier decision shape;
- can remain inert with null readiness and empty rewards.

Risks:

- canonical completion-policy content still does not exist;
- current Flora Tier 1 coverage is only one authored snippet;
- no adapter currently converts static policy into owner-specific helper input.

Decision: select this option.

## 10. Option C: One Minimal Snippet-Requirement Policy

Candidate:

- tier-scoped `knowledge_trial_policy.flora_tier_1_aloe_identification`;
- required snippet candidate for `knowledge_snippet.flora.aloe.identification`.

Advantages:

- references one exact existing active-domain snippet;
- has the narrowest completion input.

Risks:

- a snippet requirement under a tier-scoped policy can be misread as proving tier completion;
- current snippet completion envelopes intentionally do not carry tier;
- the policy would make one subject-specific snippet the gate for a domain-tier trial;
- it couples the first policy to the current tiny seed inventory instead of the explicit tier completion boundary.

Decision: retain as a valid future policy pattern, but do not select it for the first slice.

## 11. Selected First Authored Policy Set

The first future content skeleton should contain exactly one record:

- policy id: `knowledge_trial_policy.flora_tier_1`;
- status: `active`;
- owner scope: `character`;
- scope: `tier`;
- domain id: `knowledge_domain.flora`;
- tier: `1`;
- one required Flora Tier 1 completion candidate;
- no prerequisite completion targets;
- null readiness policy;
- no reward references;
- notes that state the policy is static eligibility authority only.

Flora is preferred because:

- it is active;
- it has one valid authored Tier 1 counting snippet;
- its current evidence producer path includes the narrow field-identification example;
- it has no magic-school coupling;
- it provides the smallest established natural-world path without implying broader domain coverage.

Fauna, Minerals, and General Lore policies remain deferred. Arcane Lore is excluded.

## 12. Documentation-Only Selected Example

The following is documentation only. It must not be added to `packages/content` during this run.

```json
{
  "records": [
    {
      "policyId": "knowledge_trial_policy.flora_tier_1",
      "status": "active",
      "ownerScope": "character",
      "scope": "tier",
      "domainId": "knowledge_domain.flora",
      "tier": 1,
      "requiredCompletionTargets": [
        {
          "scope": "tier",
          "domainId": "knowledge_domain.flora",
          "tier": 1,
          "requiredDecision": "candidate"
        }
      ],
      "prerequisiteCompletionTargets": [],
      "readinessPolicyId": null,
      "rewardRefs": [],
      "notes": [
        "Static eligibility policy only; it does not grant readiness, create an attempt, unlock a tier, or award a reward.",
        "Readiness policy and reward references remain deferred."
      ]
    }
  ]
}
```

This record means only that an exact Flora Tier 1 completion candidate is required for eligibility evaluation. It does not mean the trial is ready, available, attempted, completed, rewarded, persisted, or exposed in UI.

## 13. Documentation-Only Alternative Examples

These examples explain supported shapes and are not selected for the first content skeleton.

### Domain-Scoped Alternative

```json
{
  "policyId": "knowledge_trial_policy.flora_domain",
  "status": "deferred",
  "ownerScope": "character",
  "scope": "domain",
  "domainId": "knowledge_domain.flora",
  "requiredCompletionTargets": [
    {
      "scope": "domain",
      "domainId": "knowledge_domain.flora",
      "requiredDecision": "candidate"
    }
  ],
  "prerequisiteCompletionTargets": [],
  "readinessPolicyId": null,
  "rewardRefs": [],
  "notes": [
    "Documentation-only alternative; domain completion coverage is not mature enough for the first content slice."
  ]
}
```

### Snippet-Requirement Alternative

```json
{
  "policyId": "knowledge_trial_policy.flora_tier_1_aloe_identification",
  "status": "deferred",
  "ownerScope": "character",
  "scope": "tier",
  "domainId": "knowledge_domain.flora",
  "tier": 1,
  "requiredCompletionTargets": [
    {
      "scope": "snippet",
      "domainId": "knowledge_domain.flora",
      "snippetId": "knowledge_snippet.flora.aloe.identification",
      "requiredDecision": "candidate"
    }
  ],
  "prerequisiteCompletionTargets": [],
  "readinessPolicyId": null,
  "rewardRefs": [],
  "notes": [
    "Documentation-only alternative; one snippet must not be treated as inferred tier completion."
  ]
}
```

## 14. Domain Registry Alignment

The future content-skeleton run must leave all `knowledge_domain_registry.json` `trialPolicyRef` values null.

Registry activation should occur only after:

1. canonical policy content exists;
2. every record passes the record schema;
3. a semantic validator exists;
4. the validator proves policy-id uniqueness and active-domain/target validity;
5. the validator proves exact registry-to-policy parity;
6. the update is separately authorized in a focused run.

For a future Flora alignment, semantic parity would require:

- registry domain `knowledge_domain.flora`;
- `trialPolicyRef: "knowledge_trial_policy.flora_tier_1"`;
- referenced policy status `active`;
- referenced policy domain exactly `knowledge_domain.flora`;
- no Arcane Lore or cross-domain substitution.

Content existence alone is not sufficient to activate the registry reference.

## 15. Future Semantic Validation Plan

Semantic validation is not implemented in this run.

A later pure validator should check:

- the content file is an object with exactly one `records` array;
- records are non-empty when active content is expected;
- each record passes `knowledge_trial_policy.schema.json`;
- policy ids are unique;
- every policy domain exists;
- every policy domain is active;
- Arcane Lore is rejected;
- every snippet requirement resolves to one authored snippet;
- snippet status is active if a future snippet status field exists;
- snippet id domain slug and `domainId` align;
- snippet authority domain equals requirement domain;
- no duplicate requirement occurs within `requiredCompletionTargets`;
- no duplicate requirement occurs within `prerequisiteCompletionTargets`;
- no target is repeated across required and prerequisite arrays;
- tier requirements use exact positive tiers;
- domain/tier policy target and primary requirements are coherent under separately approved semantic rules;
- `readinessPolicyId` is null until readiness content exists, then resolves exactly;
- `rewardRefs` remain inert and resolve only if a future reward-reference authority is approved;
- `ownerId` and mutable authority/state fields are absent;
- Skill Trial and Spell/Magic Study fields are absent;
- optional registry `trialPolicyRef` values resolve exactly and match policy domain/status.

The semantic validator must not call completion, eligibility, or readiness evaluators. It validates authored static content, not owner-specific decisions.

## 16. Future Content Skeleton Tests

The content-skeleton run may add only focused content/schema parse coverage needed to prove:

- the file exists and parses;
- the wrapper contains exactly `records`;
- the wrapper contains exactly the selected one-record slice;
- the record matches `knowledge_trial_policy.schema.json`;
- the exact selected id, scope, domain, tier, requirements, null readiness reference, empty rewards, and notes are present;
- no Arcane Lore record exists;
- registry `trialPolicyRef` values remain null;
- no normal content-lint registration is added.

Cross-file semantics beyond those exact skeleton assertions remain for the later semantic-validator plan and implementation.

## 17. Acceptance Criteria For Version 0.5.152

`Version 0.5.152 - Knowledge Trial Authored Policy Content Skeleton` is acceptable only when:

- the patch adds `packages/content/base/player/knowledge_trial_policies.json`;
- the file is a wrapper object with exactly one `records` array;
- it contains exactly the selected `knowledge_trial_policy.flora_tier_1` record from Section 12;
- the record passes `knowledge_trial_policy.schema.json`;
- `ownerId` is absent;
- the policy is tier-scoped to active Flora Tier 1;
- the required target is exactly the Flora Tier 1 completion candidate;
- prerequisites are empty;
- `readinessPolicyId` is null;
- `rewardRefs` is empty;
- notes preserve the inert eligibility-only boundary;
- focused content/schema parse tests pass;
- `knowledge_domain_registry.json` remains unchanged with null `trialPolicyRef` values;
- no readiness content, semantic validator, helper adapter, fixture, normal content-lint registration, storage, persistence, UI, runtime, generated output, reward, event, ownership mutation, or gameplay behavior is added.

## 18. Risks And Deferred Work

- No canonical Knowledge trial policy content exists yet.
- No semantic validator exists.
- No content-to-helper adapter exists.
- Readiness policy schema and content remain deferred.
- Domain and snippet references remain structural until semantic validation exists.
- Duplicate and cross-section completion targets require semantic validation.
- Canonical completion-policy content does not exist.
- Current snippet completion envelopes do not carry tier.
- The first Flora tier currently contains only one authored counting snippet.
- Reward references remain inert and the first slice keeps them empty.
- Mutable authority, persistence, attempt, checkpoint, outcome, cooldown, runtime, UI, event, and gameplay ownership remain undefined.
- `trialUnlockWeight` remains uninterpreted.
- Arcane Lore remains planned, blocked, and deferred.

## 19. Non-Goals And Forbidden Changes

This plan authorizes none of the following:

- no policy content JSON;
- no schema edit;
- no semantic validator;
- no content-to-helper adapter;
- no helper or helper-test edit;
- no test or fixture;
- no normal content-lint registration;
- no registry `trialPolicyRef` update;
- no readiness policy;
- no attempt, checkpoint, outcome, cooldown, reward, unlock, state, storage, persistence, UI, runtime, generated output, event, ownership mutation, or gameplay behavior;
- no Skill Trial or Spell/Magic Study implementation;
- no unrelated cleanup.

## 20. Next Recommended Run

The next recommended run is:

`Version 0.5.152 - Knowledge Trial Authored Policy Content Skeleton`

It should add only the selected one-record wrapper content file and focused content/schema parse tests. It must leave registry references null and add no semantic validator, adapter, readiness content, normal lint registration, state, storage, runtime, UI, events, rewards, or gameplay behavior.
