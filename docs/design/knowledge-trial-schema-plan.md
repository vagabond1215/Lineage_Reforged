# Knowledge Trial Schema Plan

Source version/run: Version 0.5.149 - Knowledge Trial Schema Plan
Date: 2026-06-14
Status: documentation-only Knowledge trial static-policy schema planning

## 1. Purpose And Status

This document reconciles the current operation-local Knowledge trial eligibility and readiness helpers with future authored schema and content authority.

This run is documentation only. It adds no schema, content JSON, validator, helper change, test, fixture, adapter, normal content-lint registration, storage, persistence, save/account/session/database shape, UI, runtime, generated output, event, reward, ownership mutation, or gameplay behavior.

The current completion, eligibility, and readiness helpers remain unchanged.

## 2. Current State Recap

The repository currently provides:

- `evaluateKnowledgeCompletion(...)`, a separate pure completion helper;
- `evaluateKnowledgeTrialEligibility(...)`, which consumes explicit completion envelopes and an operation-local eligibility-policy wrapper;
- `evaluateKnowledgeTrialReadiness(...)`, which consumes one exact eligibility envelope plus operation-local readiness policy, attempt, cooldown, availability, sequence/time, and domain authority;
- exact character-owner, domain, tier, policy-id, and snippet-requirement isolation;
- read-only eligibility and readiness envelopes with explicit no-effect safety flags.

The repository does not provide:

- a canonical Knowledge trial eligibility-policy schema;
- a canonical Knowledge trial policy content path;
- a canonical readiness-policy schema or content path;
- canonical attempt-history, cooldown, availability, or sequence/time schemas;
- canonical trial storage or persistence ownership;
- a content-to-helper adapter;
- authored Knowledge trial checkpoint content;
- active Knowledge trial runtime behavior.

Eligibility and readiness decisions remain in-memory outputs. They are not authored content, persisted state, unlocks, attempt permission, attempts, or outcomes.

The broad domain registry already reserves nullable `trialPolicyRef` values with the `knowledge_trial_policy.*` prefix. All current values remain `null`.

The existing `packages/content/base/player/trials.json` and `packages/schemas/player/trial.schema.json` are early cross-family trial records containing progress, potential, checkpoints, rewards, and penalties. They are not suitable as the canonical Knowledge eligibility/readiness policy authority and must not be expanded by this plan.

## 3. Terminology

- **Authored trial policy:** static repository content declaring which Knowledge completion candidates are required for eligibility.
- **Authored readiness policy:** static repository content declaring which readiness gates apply after eligibility.
- **Operation-local policy:** explicit in-memory policy supplied directly to a current helper. It is test and operation authority, not canonical content.
- **Content authority:** validated static repository data that may later be adapted into helper inputs.
- **Mutable authority:** owner-specific facts that can change, such as attempts, cooldowns, availability, and sequence/time values.
- **State authority:** the future storage/runtime owner authorized to supply mutable authority.
- **Attempt history:** owner-scoped records of prior authorized attempts and lifecycle statuses.
- **Cooldown state:** owner-scoped current or historical cooldown facts.
- **Availability authority:** a separately owned fact stating whether an exact trial is open or closed.
- **Sequence/time authority:** a deterministic owner-scoped source of the value and unit used by readiness gates.
- **Schema candidate:** a proposed structural contract that is not implemented or canonical until a later authorized run.
- **Validation helper:** a future pure structural or semantic validator for canonical authored policy.
- **Normal content-lint registration:** wiring a canonical authored content path into `tools/content-lint/index.mjs`.
- **Runtime/storage boundary:** the ownership line after which mutable state, commands, persistence, events, and gameplay behavior may exist.

## 4. Core Schema And Content Boundary

Authored schemas and base content may define static policy only.

Authored policy may define:

- stable policy identity;
- active or deferred status;
- supported owner scope;
- exact domain or tier target;
- exact completion requirements;
- static attempt, cooldown, availability, and sequence/time policy modes in a later readiness schema;
- inert reward references;
- design notes.

Authored policy must not contain:

- concrete `ownerId` values;
- eligibility or readiness envelopes;
- attempt records or attempt history;
- cooldown records or current expiry facts;
- availability facts;
- current sequence/time snapshots;
- completion, eligibility, or readiness state;
- attempt creation or checkpoint/outcome results;
- reward ownership or grant state;
- UI, runtime, event, generated-output, save, session, or persistence state.

Static content can declare what a future operation should require. It cannot prove that a specific character currently satisfies that requirement.

## 5. Ownership Reconciliation

The current operation-local helpers require exact `ownerScope` and `ownerId` parity because they evaluate one owner-specific operation.

Canonical authored policy should instead:

- require `ownerScope: "character"` initially;
- omit `ownerId`;
- define no account, family, institution, settlement, or other owner expansion;
- rely on a later separately authorized adapter to combine static policy with an explicit operation target and owner id.

The adapter must not be implemented during schema creation. Until it exists, current helper tests and operation-local wrappers remain the executable contract.

The current eligibility policy fields `readinessPolicyStatus`, `attemptConstraintStatus`, and `cooldownConstraintStatus` are operation-envelope placeholders. They are not authored policy and must not appear in the static eligibility-policy schema.

## 6. Proposed Schema Families

### 6.1 Knowledge Trial Eligibility Policy

Recommended first schema:

- `packages/schemas/player/knowledge_trial_policy.schema.json`

This is the first and only recommended schema implementation slice for Version 0.5.150.

It should define one strict static eligibility-policy record. It should not define wrappers, content, mutable state, readiness envelopes, or helper adapters.

### 6.2 Knowledge Trial Readiness Policy

Future candidate:

- `packages/schemas/player/knowledge_trial_readiness_policy.schema.json`

This remains deferred. The current helper-local `countStatuses` and `sourceStatus` values depend on an undefined canonical attempt lifecycle vocabulary. A readiness schema must not freeze those values before attempt-state ownership is planned.

### 6.3 Knowledge Trial Checkpoint Content

Future candidate:

- a dedicated Knowledge trial/checkpoint schema after checkpoint identity, order, branch, soft-fail, hard-fail, recovery, and outcome ownership are planned.

Checkpoint content must not be added to the eligibility or readiness policy schema.

### 6.4 Reward Reference Contract

Reward references may remain unique canonical dotted strings in static policy. A dedicated reward-reference schema is deferred.

Reward references are inert. They do not prove ownership, earning, reservation, grant, unlock, or event creation.

### 6.5 Mutable Authority Schemas

The following are deferred and likely state/storage-owned rather than authored-content schemas:

- attempt history;
- cooldown state;
- availability authority;
- sequence/time authority.

Their eventual schemas must follow a separate state/storage plan and must not be placed in `packages/content/base/player/`.

## 7. Recommended Initial Schema Slice

Version 0.5.150 should add only the strict record-level static eligibility-policy schema:

- `packages/schemas/player/knowledge_trial_policy.schema.json`

That run may add the normal focused schema-file parse/contract test required by repository convention, but it should add no policy content JSON, semantic validator, helper adapter, readiness schema, mutable-state schema, fixture, or normal content-lint registration.

Reasons for starting with eligibility policy:

- the broad domain registry already reserves `knowledge_trial_policy.*` references;
- eligibility requirements have a stable current shape;
- completion decisions and requirement scopes are already explicit;
- eligibility policy has no dependency on attempt lifecycle vocabulary;
- readiness policy still depends on undefined attempt status and mutable-authority ownership;
- this preserves the current eligibility/readiness phase separation.

Operation-local helper behavior remains authoritative until canonical policy content and an adapter are separately implemented.

## 8. Proposed Eligibility Policy Record

Recommended required fields:

| Field | Contract |
| --- | --- |
| `policyId` | Canonical `knowledge_trial_policy.*` id. |
| `status` | `active` or `deferred`. |
| `ownerScope` | Initially exactly `character`. |
| `scope` | `domain` or `tier`. |
| `domainId` | Canonical `knowledge_domain.*` id. |
| `tier` | Positive integer for tier scope; absent for domain scope. |
| `requiredCompletionTargets` | Non-empty array of exact completion requirements. |
| `prerequisiteCompletionTargets` | Array of exact prerequisite requirements; empty allowed. |
| `readinessPolicyId` | Canonical `knowledge_trial_readiness_policy.*` id or `null`; initially nullable because no readiness content authority exists. |
| `rewardRefs` | Unique canonical dotted ids; inert metadata only. |
| `notes` | Unique non-empty strings explaining design or deferred authority. |

The schema should use `additionalProperties: false`.

It must not include:

- `ownerId`;
- `readinessPolicyStatus`;
- `attemptConstraintStatus`;
- `cooldownConstraintStatus`;
- eligibility/readiness decisions or envelopes;
- attempts, cooldowns, availability facts, sequence/time values, checkpoints, outcomes, reward state, UI, runtime, events, or persistence.

### Scope Conditional

- Domain policy requires no `tier` field.
- Tier policy requires a positive integer `tier`.
- A later schema implementation should use exact conditional structure rather than permitting a nullable or ignored tier.

## 9. Completion Requirement Records

Both `requiredCompletionTargets` and `prerequisiteCompletionTargets` should use the same strict requirement definitions.

### Snippet Requirement

Exact fields:

- `scope: "snippet"`;
- `domainId`;
- `snippetId`;
- `requiredDecision: "candidate"`.

The snippet id must use the exact `knowledge_snippet.*` pattern and its domain slug must align with `domainId`.

Current snippet completion envelopes carry `snippetId` but not tier. The schema and future validator must not infer snippet tier from the snippet catalog or from the containing policy.

### Tier Requirement

Exact fields:

- `scope: "tier"`;
- `domainId`;
- positive integer `tier`;
- `requiredDecision: "candidate"`.

### Domain Requirement

Exact fields:

- `scope: "domain"`;
- `domainId`;
- `requiredDecision: "candidate"`.

Duplicate requirements within either array and duplicate targets across required/prerequisite arrays require later semantic rejection.

## 10. Proposed Readiness Policy Record

The future readiness schema should eventually define:

| Field | Contract |
| --- | --- |
| `readinessPolicyId` | Canonical `knowledge_trial_readiness_policy.*` id. |
| `eligibilityPolicyId` | Exact canonical `knowledge_trial_policy.*` reference. |
| `status` | `active` or `deferred`. |
| `ownerScope` | Initially exactly `character`; no concrete owner id. |
| `scope` | `domain` or `tier`. |
| `domainId` | Canonical Knowledge domain id. |
| `tier` | Required only for tier scope. |
| `requiredEligibilityDecision` | Exactly `eligible_candidate`. |
| `attemptPolicy` | Static attempt-limit policy. |
| `cooldownPolicy` | Static cooldown rule. |
| `availabilityPolicy` | Static always/explicit gate selection. |
| `sequenceTimePolicy` | Static required-authority selection. |
| `prerequisiteReadinessGates` | Initially empty only; non-empty semantics remain deferred. |
| `rewardRefs` | Inert canonical references. |
| `notes` | Unique non-empty design notes. |

The future authored record must omit `ownerId`. A later adapter would combine it with an explicit character target.

The current helper fails closed on non-empty `prerequisiteReadinessGates`; the first readiness schema should preserve an empty-only posture unless prerequisite authority is separately designed first.

## 11. Readiness Subpolicy Candidates

### Attempt Policy

- `{ "mode": "none" }`; or
- `{ "mode": "max_attempts", "maxAttempts": positiveInteger, "countStatuses": [...] }`.

`countStatuses` cannot become canonical until attempt lifecycle statuses are owned and documented.

### Cooldown Policy

- `{ "mode": "none" }`; or
- `{ "mode": "sequence_window", "unit": "sequence", "requiredElapsed": nonNegativeInteger, "sourceStatus": status }`; or
- `{ "mode": "time_window", "unit": "turn" | "day" | "timestamp", "requiredElapsed": nonNegativeInteger, "sourceStatus": status }`.

`sourceStatus` remains helper-local until attempt lifecycle vocabulary exists.

### Availability Policy

- `{ "mode": "always" }`; or
- `{ "mode": "explicit_gate" }`.

The policy selects a gate. It does not contain the current open/closed fact.

### Sequence/Time Policy

- `{ "mode": "none" }`; or
- `{ "mode": "required", "authorityId": canonicalDottedId, "unit": "sequence" | "turn" | "day" | "timestamp" }`.

The policy names an expected authority. It does not contain a current sequence/time value.

## 12. Identifier And Reference Rules

- Eligibility policy ids: `knowledge_trial_policy.*`.
- Readiness policy ids: `knowledge_trial_readiness_policy.*`.
- Domain ids: `knowledge_domain.*`.
- Snippet ids: exact `knowledge_snippet.*`.
- Owner scope: initially `character` only.
- Reward and authority references: canonical dotted ids under separately owned namespaces.

No account, family, institution, region, settlement, teacher, study-event, or other owner scope is authorized by this plan.

The broad domain registry `trialPolicyRef` should eventually reference an eligibility policy id. This plan does not update registry content or activate any reference.

## 13. Content Path Options

### Recommended Split Paths

- `packages/content/base/player/knowledge_trial_policies.json`
- `packages/content/base/player/knowledge_trial_readiness_policies.json`

Advantages:

- preserves eligibility/readiness separation;
- aligns names with current helper policy wrappers;
- keeps domain `trialPolicyRef` pointed at eligibility authority;
- allows readiness content to wait for attempt-lifecycle planning;
- supports independent semantic validation and staged rollout.

### Combined `knowledge_trials.json`

Not recommended for the first static policy content.

Combining eligibility, readiness, checkpoints, rewards, and mutable facts would blur ownership and create pressure to treat a trial record as both policy and state.

### Existing `trials.json`

Rejected as the Knowledge policy path.

It is an existing cross-family early trial collection with embedded progress, max potential, rewards, and penalties. Reusing it would mix Knowledge, Skill, and Magic families and would preserve state-like authored fields that conflict with the current pure Knowledge boundaries.

No content path is created or registered by this plan.

## 14. Mutable State Placement

Attempts, cooldowns, availability facts, and sequence/time snapshots do not belong in authored policy paths because they:

- differ by character and operation;
- change over time;
- require replay, idempotency, concurrency, reservation, and persistence rules;
- may require transactional or authoritative runtime ownership;
- cannot be validated as static base content;
- must not be packaged as universal authored facts.

Eligibility and readiness envelopes are transient decisions and likewise do not belong in authored content or canonical mutable storage unless a later decision-log or audit design explicitly authorizes that use.

## 15. Validator And Registration Posture

Future validation should remain staged:

1. record-schema structure and schema-file tests;
2. authored content skeleton, if approved;
3. pure semantic validator for wrapper, uniqueness, references, active domains, and cross-policy parity;
4. normal content-lint registration only after a canonical authored content path exists;
5. content-to-helper adapter only after both content and semantic authority exist.

Future schema or content validation must not call the eligibility or readiness evaluators unless separately authorized. Static validation should not require owner-specific completion envelopes or mutable state.

Current operation-local helper tests must remain valid and isolated throughout schema and content work.

## 16. Exact Matching And Isolation

Future semantic validation and adapters must preserve:

- exact owner scope and explicit operation owner id;
- exact eligibility policy id;
- exact readiness policy id;
- exact domain id;
- exact tier for tier scope;
- exact snippet id for snippet requirements;
- exact required decision values;
- no cross-owner, cross-domain, cross-tier, or cross-policy substitution.

Knowledge policy must not accept Skill Trial or Spell/Magic Study fields or references as authority.

Arcane Lore, UI state, runtime state, generated output, reward state, and storage state must not leak into eligibility or readiness authority.

## 17. Arcane Lore Posture

Arcane Lore remains planned, blocked, and deferred.

- `knowledge_domain.arcane_lore` remains non-active.
- No Arcane Lore trial policy or readiness policy is active.
- The first schema may structurally permit a canonical domain-id string, but later semantic validation must reject non-active and Arcane Lore policy references.
- Arcane skill references, known-spell ownership, spell/magic study data, scroll/tome access, and UI visibility do not create Knowledge eligibility or readiness authority.

Activating Arcane Lore requires separately approved domain, snippet, evidence, progress, completion, eligibility, readiness, attempt, checkpoint, outcome, cooldown, reward, storage, persistence, and runtime work.

## 18. Forbidden Schema And Content Mistakes

- Do not persist eligibility or readiness envelopes as authored content.
- Do not put attempts, cooldowns, availability facts, or sequence/time snapshots in base content.
- Do not infer a concrete owner from static policy.
- Do not include `ownerId` in authored policy.
- Do not treat `trialUnlockWeight` as eligibility or readiness authority.
- Do not treat `rewardRefs` as grant or ownership authority.
- Do not collapse eligibility and readiness into one boolean or one schema field.
- Do not merge Knowledge policy into Skill Trial or Spell/Magic Study content.
- Do not infer snippet tier from a snippet completion envelope.
- Do not encode attempt creation, checkpoint resolution, outcome resolution, cooldown mutation, reward grant, UI visibility, runtime commands, generated output, events, ownership mutation, or gameplay behavior.

## 19. Future Test Matrix

### Record Schema

- exact required eligibility-policy fields pass;
- extra fields fail;
- domain scope rejects `tier`;
- tier scope requires a positive integer `tier`;
- policy ids follow `knowledge_trial_policy.*`;
- owner scope is exactly `character`;
- concrete `ownerId` is rejected;
- required completion targets are non-empty;
- prerequisite completion targets may be empty;
- readiness policy reference is null or canonical;
- reward references remain unique canonical strings;
- notes are unique non-empty strings;
- mutable state and envelope fields are rejected.

### Requirement Structure

- exact snippet, tier, and domain requirement variants pass;
- required decision is exactly `candidate`;
- snippet ids and domain ids use canonical patterns;
- snippet requirement contains no inferred tier;
- scope-incompatible fields fail.

### Later Semantic Validation

- policy ids are unique;
- domain references exist, are active, and are not Arcane Lore;
- snippet references exist, are active, and align with domain;
- duplicate and cross-section completion requirements fail;
- readiness policy references eligibility policy exactly;
- readiness owner/domain/tier parity is exact;
- malformed attempt/cooldown/availability/sequence-time subpolicies fail;
- mutable state fields fail;
- Skill Trial and Spell/Magic Study fields fail;
- reward references remain inert;
- normal content-lint registration occurs only when a canonical content path exists.

## 20. Future Implementation Sequence

1. `Version 0.5.149 - Knowledge Trial Schema Plan` - this document.
2. `Version 0.5.150 - Knowledge Trial Static Policy Schema` - add only the strict eligibility-policy record schema and focused schema contract coverage.
3. Later authored eligibility-policy content skeleton, if approved.
4. Later readiness-policy schema plan or schema after attempt lifecycle vocabulary is selected.
5. Later static policy semantic-validator plan and implementation.
6. Later normal content-lint registration after canonical content exists.
7. Later content-to-helper adapter after canonical validation exists.
8. Later checkpoint/content plan.
9. Later state/storage/persistence plan for attempts, cooldowns, availability, and sequence/time.
10. Later attempt, checkpoint, outcome, reward, UI, runtime, event, and gameplay work under separate authorization.

Each step remains independently scoped.

## 21. Acceptance Criteria For Version 0.5.150

`Version 0.5.150 - Knowledge Trial Static Policy Schema` is acceptable only when:

- the patch adds one strict record-level `knowledge_trial_policy.schema.json`;
- the schema represents static eligibility policy only;
- exact `knowledge_trial_policy.*`, `knowledge_domain.*`, and `knowledge_snippet.*` patterns are enforced;
- owner scope is character-only and `ownerId` is absent;
- domain/tier conditionals are exact;
- required and prerequisite completion-target variants are strict;
- `requiredDecision` is exactly `candidate`;
- readiness policy reference is nullable and inert;
- reward references are inert unique canonical ids;
- notes follow current strict authored-policy conventions;
- extra, mutable-state, envelope, runtime, UI, event, reward-state, persistence, Skill Trial, and Spell/Magic Study fields are rejected;
- focused schema-file/contract tests are the only test changes;
- no policy content JSON, semantic validator, helper adapter, existing-helper edit, fixture, normal content-lint registration, storage, persistence, UI, runtime, generated output, event, ownership mutation, or gameplay behavior is added.

## 22. Risks And Deferred Work

- No canonical trial policy content authority exists.
- No canonical readiness policy schema or content authority exists.
- Attempt lifecycle and status vocabulary remain implementation-local.
- Non-empty prerequisite readiness gates remain unsupported by the current helper and fail closed.
- Idempotency, replay, concurrency, reservation, persistence, and atomicity are undefined.
- Cooldown, availability, and sequence/time ownership is undefined.
- Checkpoint, outcome, reward, runtime, UI, generated-output, and event integration remain deferred.
- `trialUnlockWeight` has no approved interpretation.
- Current snippet completion envelopes do not carry snippet-tier authority.
- Character owner authority remains pattern-only at operation time.
- A later adapter must reconcile owner-free authored policy with owner-specific helper inputs without weakening exact matching.
- Existing `trials.json` remains a separate legacy/cross-family concern and is not cleaned up by this plan.

## 23. Non-Goals

This plan authorizes no schema implementation, content JSON, validator, helper adapter, helper edit, test, fixture, registration, trial state, attempt, checkpoint, outcome, cooldown mutation, reward grant, storage, persistence, save/account/session/database change, UI, runtime, generated output, event, ownership mutation, gameplay behavior, compatibility work, or unrelated cleanup.

## 24. Next Recommended Run

The next recommended run is:

`Version 0.5.150 - Knowledge Trial Static Policy Schema`

It should add only the strict record-level static eligibility-policy schema and focused schema contract coverage. It must not add policy content, readiness policy, mutable state, semantic validation, helper adapters, or downstream trial behavior.
