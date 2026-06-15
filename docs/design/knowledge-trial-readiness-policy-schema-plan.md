# Knowledge Trial Readiness Policy Schema Plan

Source version/run: Version 0.5.160 - Knowledge Trial Readiness Policy Schema Plan
Date: 2026-06-15
Status: documentation-only readiness-policy schema and content-authority planning

## 1. Purpose And Status

This plan defines the first future static authored Knowledge trial readiness-policy boundary.

This run changes documentation only. It adds no schema, content JSON, validator, test, fixture, helper, adapter, storage, persistence, save/account/session/database shape, runtime, UI, generated output, command, event, reward, ownership mutation, trial attempt, checkpoint, outcome, cooldown, unlock, or gameplay behavior.

Readiness policy is future static authoring authority only. It may declare which eligibility policy and target a readiness rule governs and which static gate posture applies. It cannot evaluate a character, create a readiness envelope, make a trial runnable, or authorize an attempt.

Knowledge, Skill Trial, and Spell/Magic Study readiness remain separate families.

## 2. Current Authority Recap

- `packages/content/base/player/knowledge_domain_registry.json` now aligns only `knowledge_domain.flora.trialPolicyRef` to `knowledge_trial_policy.flora_tier_1`.
- `packages/schemas/player/knowledge_trial_policy.schema.json` owns the strict static eligibility-policy record shape.
- `packages/content/base/player/knowledge_trial_policies.json` owns the exact current active Flora Tier 1 eligibility policy.
- The current Flora policy retains `readinessPolicyId: null`.
- `tools/content-lint/knowledge-trial-policies.mjs` requires every current `readinessPolicyId` to remain null.
- Normal content lint succeeds with `content-lint: ok (56 files checked)`.
- Registry alignment is content-lint authority only and does not make a Knowledge trial runnable.
- `tools/content-lint/knowledge-trial-readiness.mjs` is a pure explicit-input helper with implementation-local readiness policy. It is not authored-content authority and is not a runtime owner.
- No content-to-helper adapter exists.
- No canonical mutable trial authority, attempt history, outcome state, reward state, cooldown state, availability authority, sequence/time authority, storage owner, or persistence owner exists.

## 3. Readiness Policy Concept

A future authored readiness policy answers only:

- which exact static Knowledge eligibility policy must produce an `eligible_candidate`;
- which exact active Knowledge domain and domain/tier scope the readiness policy governs;
- whether the first static availability posture is always available or deferred;
- which stable policy identity future validators and an explicitly planned adapter may resolve;
- which authoring notes explain deliberately deferred authority.

Readiness policy does not independently inspect or duplicate:

- raw evidence;
- progress records;
- consumed evidence;
- known-snippet state;
- completion weights;
- completion targets already owned by the eligibility policy;
- snippet source families;
- `trialUnlockWeight`;
- owner-specific facts.

Those inputs must first produce separately validated completion and eligibility decisions through their own owners. A future readiness adapter may consume an explicit eligibility envelope; authored readiness content must not bypass that phase ordering.

Readiness policy must not:

- create or reserve attempts;
- apply progress or consume evidence;
- resolve checkpoints or outcomes;
- start, clear, or evaluate cooldown state;
- grant rewards or unlock content;
- mutate ownership or state;
- read storage or persistence;
- call helpers;
- invoke UI, runtime, command, event, or gameplay behavior.

## 4. Recommended Schema And Content Paths

Recommended future record-level schema:

- `packages/schemas/player/knowledge_trial_readiness_policy.schema.json`

Recommended future authored content wrapper:

- `packages/content/base/player/knowledge_trial_readiness_policies.json`

The schema should remain record-level. The content file should later use the exact wrapper:

```json
{
  "records": []
}
```

The split preserves eligibility/readiness separation and keeps both policy families separate from mutable trial state.

## 5. First Schema Decision

The first schema should support:

| Field | Initial contract |
| --- | --- |
| `readinessPolicyId` | Required canonical `knowledge_trial_readiness_policy.*` id. |
| `status` | Required `active` or `deferred`. |
| `ownerScope` | Required and exactly `character`; no concrete owner id. |
| `trialPolicyId` | Required singular canonical `knowledge_trial_policy.*` reference. |
| `scope` | Required `domain` or `tier`. |
| `domainId` | Required canonical `knowledge_domain.*` id. |
| `tier` | Required positive integer only for tier scope; absent for domain scope. |
| `requiredEligibilityDecision` | Required and exactly `eligible_candidate`. |
| `availabilityPolicy` | Required strict object; first schema permits only `{ "mode": "always" }`. |
| `prerequisiteReadinessGates` | Required empty array only. |
| `notes` | Required unique non-empty strings. |

Use `additionalProperties: false` at every object boundary.

### Fields Not Selected

- No `slug`: policy identity is already canonical and a second derived identity creates drift.
- No `trialPolicyRefs`: the first readiness record governs exactly one eligibility policy.
- No `requiredCompletionTargets`: eligibility policy already owns completion requirements.
- No `requiredProgressState`, `requiredEvidenceState`, or `requiredKnownSnippetState`: readiness must consume eligibility authority rather than raw state.
- No `allowedSourceFamilies`: discovery/evidence routes belong to snippet and evidence authorities.
- No authored blocker codes: blockers are deterministic evaluator output, not pre-authored outcomes.
- No reward fields: readiness policy does not own rewards, and the current eligibility policy already keeps reward references inert and empty.
- No runtime, helper, adapter, storage, persistence, UI, command, event, or generated-output fields.
- No attempt, attempt-limit, cooldown, sequence/time, checkpoint, outcome, or mutable availability fields.

The strict omission of lifecycle-dependent fields resolves the earlier blocker that attempt status vocabulary and cooldown ownership are not canonical.

## 6. Availability Boundary

The first schema should permit only:

```json
{
  "mode": "always"
}
```

This is static policy posture, not a current runtime fact. It means the authored policy adds no external availability gate.

Future explicit-gate or scheduled availability modes require separate authority planning for:

- authority identity;
- owner and target parity;
- open/closed status vocabulary;
- sequence/time units;
- deterministic restoration and replay;
- storage and persistence ownership.

Those modes must not be added to the first schema.

## 7. Relationship To Eligibility Policy Content

The readiness record points to one exact eligibility policy through `trialPolicyId`.

The eligibility policy may reference readiness content through its existing `readinessPolicyId` field only after all of the following exist:

1. readiness record schema;
2. authored readiness content;
3. readiness semantic validator;
4. focused cross-file validation;
5. policy-validator support for non-null `readinessPolicyId`;
6. an explicitly authorized reference-alignment run.

Until then:

- the current Flora eligibility policy remains unchanged;
- `readinessPolicyId` remains null;
- the current policy validator retains its null-only rule;
- readiness content, if later seeded before alignment, must remain unreferenced or deferred under the selected validator posture.

Reference direction is intentionally bidirectional:

- readiness content uses `trialPolicyId` to name the eligibility policy it governs;
- eligibility content later uses `readinessPolicyId` to select the readiness policy.

Semantic validation must require exact reciprocal identity rather than infer linkage from ids, slugs, file order, domain, or tier.

## 8. First Readiness Candidate

Likely first future candidate:

- readiness policy id: `knowledge_trial_readiness_policy.flora_tier_1`;
- status: `active`;
- owner scope: `character`;
- trial policy id: `knowledge_trial_policy.flora_tier_1`;
- scope: `tier`;
- domain id: `knowledge_domain.flora`;
- tier: `1`;
- required eligibility decision: `eligible_candidate`;
- availability policy: always;
- prerequisite readiness gates: empty;
- no rewards;
- no runtime;
- no attempt authority.

Illustrative documentation-only shape:

```json
{
  "readinessPolicyId": "knowledge_trial_readiness_policy.flora_tier_1",
  "status": "active",
  "ownerScope": "character",
  "trialPolicyId": "knowledge_trial_policy.flora_tier_1",
  "scope": "tier",
  "domainId": "knowledge_domain.flora",
  "tier": 1,
  "requiredEligibilityDecision": "eligible_candidate",
  "availabilityPolicy": {
    "mode": "always"
  },
  "prerequisiteReadinessGates": [],
  "notes": [
    "Static readiness policy only; it does not evaluate a character or authorize an attempt.",
    "Attempt, cooldown, checkpoint, outcome, reward, adapter, storage, runtime, and UI authority remain deferred."
  ]
}
```

### Candidate Decision

Select a minimal but meaningful static readiness rule set, not a shape-only placeholder.

The record has meaningful identity, exact eligibility linkage, exact target parity, and an explicit no-external-availability-gate posture. It remains non-executable because no content-to-helper adapter, owner-specific input authority, attempt owner, storage owner, or runtime owner exists.

Do not defer this schema until Ecology seed content. Flora already supplies one exact active domain, one exact aligned eligibility policy, and one exact tier target. Ecology is not a prerequisite for defining readiness structure.

## 9. Structural Validation Plan

The future schema implementation run should:

- add only the record-level schema;
- register it in `tests/unit/schema-files.test.mjs`;
- prove the exact domain and tier branches;
- require every selected field;
- reject unsupported top-level fields;
- reject `ownerId`;
- reject plural eligibility-policy references;
- reject raw evidence/progress/snippet-state gates;
- reject non-empty prerequisite readiness gates;
- reject availability modes other than `always`;
- reject attempt, cooldown, sequence/time, checkpoint, outcome, reward, runtime, UI, event, storage, and persistence fields;
- add no content file or normal content-lint registration.

Schema-file registration does not change the normal checked-content count.

## 10. Readiness Semantic Validator Plan

Recommended future validator:

- `tools/content-lint/knowledge-trial-readiness-policies.mjs`

Recommended pure entry point:

```js
validateKnowledgeTrialReadinessPolicies({
  relativePath,
  wrapper,
  readinessPolicySchema,
  trialPolicyWrapper,
  domainRegistryWrapper
})
```

It must remain file-I/O-free and helper-free.

Future semantic validation should reject:

- malformed wrappers or schema-invalid records;
- duplicate readiness policy ids;
- unknown, duplicate, inactive, planned, deferred, or Arcane domains when active readiness is authored;
- unknown or duplicate eligibility policy ids;
- readiness/eligibility domain mismatch;
- readiness/eligibility scope mismatch;
- tier mismatch;
- owner-scope mismatch;
- referenced readiness policy status other than active;
- active readiness policy left unreferenced once exact representation is selected;
- one readiness policy referenced by more than one eligibility policy;
- one eligibility policy linked to more than one readiness policy under the initial one-to-one posture;
- non-empty prerequisite gates;
- unsupported availability modes;
- raw snippet, evidence, progress, or completion authority;
- attempt, cooldown, sequence/time, checkpoint, outcome, reward, helper, runtime, UI, storage, persistence, event, or gameplay fields.

The validator must not infer tier from policy ids.

## 11. Policy Validator Reference Alignment

A later focused alignment run should update `tools/content-lint/knowledge-trial-policies.mjs` to replace the readiness-null rule with exact cross-file validation.

That run should:

- explicitly load or receive readiness policy content;
- resolve non-null `readinessPolicyId` by exact id;
- require exact reciprocal `trialPolicyId`;
- require both policies active;
- require exact owner-scope, domain, scope, and tier parity;
- reject Arcane Lore;
- reject duplicate, missing, ambiguous, deferred, or mismatched references;
- require exact active readiness-policy representation under the selected one-to-one posture;
- preserve every existing registry, completion-target, reward-empty, snippet, purity, and helper-isolation rule.

The current eligibility policy and validator remain unchanged during this planning run.

## 12. Content-To-Helper Adapter Boundary

Content is static authority. Helpers remain pure and explicit-input driven.

- No helper should read authored content directly.
- No validator should call the readiness helper.
- No runtime should invoke readiness from content until adapter, owner-specific authority, storage, and runtime ownership are separately planned.
- The current helper's implementation-local policy includes concrete `ownerId` and lifecycle-gate structures that must not be copied directly into authored content.
- A future adapter must combine validated owner-free authored policy with an explicit character owner, explicit eligibility envelope, and separately authorized operation inputs.
- Adapter planning must decide how the authored always-available posture maps into helper-local policy without silently creating attempt, cooldown, or sequence/time authority.

Any content-to-helper adapter requires a separate documentation-only plan before implementation.

## 13. Normal Content-Lint Registration

This planning run changes no content-lint count. The baseline remains:

```text
content-lint: ok (56 files checked)
```

Future count posture:

- adding the schema and focused schema tests does not add a checked content file;
- adding readiness content should not enter normal lint until its semantic validator is proven;
- registering `knowledge_trial_readiness_policies.json` as canonical checked content would normally increase the count from 56 to 57;
- count changes must be explicit in the registration run and corresponding integration assertion;
- schema dependencies should not be counted as authored content.

## 14. Arcane Lore And Family Separation

Arcane Lore remains planned, blocked, and deferred.

- No active Arcane Lore readiness policy is authorized.
- Magic-school metadata, known spells, spell access, scrolls, tomes, teachers, institutions, or Magic Study data do not create Knowledge readiness authority.
- Knowledge readiness must not consume Skill Trial or Spell/Magic Study policy or state.

Family, heir, religion, ecology, recipe, crafting, civil-society, maturation, and estate documents remain future roadmap material only and do not authorize readiness implementation.

## 15. Non-Goals

This plan authorizes none of the following:

- no readiness schema file;
- no readiness content file;
- no readiness validator;
- no trial policy content or registry edit;
- no snippet, evidence, progress, or completion edit;
- no test or fixture;
- no helper or adapter;
- no attempt, checkpoint, outcome, cooldown, reward, unlock, state, storage, persistence, UI, runtime, generated output, command, event, ownership mutation, or gameplay behavior;
- no Skill Trial or Spell/Magic Study readiness;
- no family, heir, religion, ecology, or recipe implementation;
- no unrelated cleanup.

## 16. Future Implementation Sequence

Recommended narrow sequence:

1. `Version 0.5.161 - Knowledge Trial Readiness Policy Schema`
2. Later `0.5.x - Knowledge Trial Readiness Policy Content Plan`
3. Later `0.5.x - Knowledge Trial Readiness Policy Seed Content`
4. Later `0.5.x - Knowledge Trial Readiness Policy Semantic Validator Plan`
5. Later `0.5.x - Knowledge Trial Readiness Policy Semantic Validator`
6. Later `0.5.x - Knowledge Trial Readiness Policy Normal Lint Registration`
7. Later `0.5.x - Knowledge Trial Policy Readiness Reference Alignment`
8. Later `0.5.x - Knowledge Trial Content-To-Helper Adapter Plan`

Ecology Knowledge Domain planning shifts to `Version 0.5.162` so the selected schema implementation can land first. Readiness content and downstream readiness work do not need to block later Ecology planning unless a future roadmap decision explicitly reprioritizes them.

## 17. Risks And Deferred Work

- The domain registry supports one trial-policy pointer per domain and cannot represent multiple tier policies.
- Initial readiness policy is one-to-one with one eligibility policy; multi-policy or tier-map expansion requires a separate shape decision.
- No content-to-helper adapter exists.
- The authored schema intentionally excludes the current helper's attempt, cooldown, availability-gate, and sequence/time lifecycle structures.
- Mutable trial authority and persistence remain undefined.
- Rewards remain inert and empty.
- `trialUnlockWeight` remains uninterpreted.
- Flora Tier 1 still has one authored counting snippet.
- The first always-available posture may need expansion after canonical availability authority exists.
- Knowledge, Skill, and Spell/Magic Study trial families remain separate.
- Family, religion, ecology, recipe, crafting, civil-society, maturation, and estate documents remain future roadmap material.

## 18. Acceptance Criteria For Version 0.5.161

`Version 0.5.161 - Knowledge Trial Readiness Policy Schema` should be complete only when:

- it adds exactly one strict record-level readiness-policy schema;
- the schema implements the field decisions in Section 5;
- exact domain and tier branches are enforced;
- owner scope is character-only and `ownerId` is rejected;
- one singular eligibility policy reference is required;
- required eligibility decision is exactly `eligible_candidate`;
- availability is explicitly always-only;
- prerequisite readiness gates are empty-only;
- raw evidence, progress, known-snippet, completion, source-family, blocker-output, attempt, cooldown, sequence/time, checkpoint, outcome, reward, runtime, UI, storage, persistence, event, and gameplay fields are rejected;
- focused schema-file tests are the only test changes;
- no readiness content, validator, policy reference, helper, adapter, runtime behavior, or mutable authority is added;
- normal content lint remains at 56 checked files.

## 19. Next Recommended Run

`Version 0.5.161 - Knowledge Trial Readiness Policy Schema`

That run should add only the strict record-level schema and focused schema contract coverage. It must not add readiness content, semantic validation, normal-lint registration, eligibility-policy reference alignment, adapters, owner-specific state, runtime behavior, or downstream trial behavior.
