# Knowledge Trial Readiness Boundary Plan

Source version/run: Version 0.5.147 - Knowledge Trial Readiness Boundary Plan
Date: 2026-06-14
Status: planning-only Knowledge trial readiness boundary

## 1. Purpose And Status

This document defines the future boundary between read-only Knowledge trial eligibility candidates and separately authorized Knowledge trial readiness decisions.

This run is documentation only. It implements no readiness helper, schema, content JSON, validator, test, fixture, storage, persistence, readiness state, trial state, attempt, checkpoint, outcome, cooldown, reward, unlock, UI, runtime, generated output, event, ownership mutation, or gameplay behavior.

## 2. Current State

The current repository provides:

- `evaluateKnowledgeCompletion(...)`, a separate pure helper returning read-only `candidate`, `incomplete`, or `blocked` completion envelopes;
- `evaluateKnowledgeTrialEligibility(...)`, a separate pure helper returning read-only `eligible_candidate`, `not_eligible`, or `blocked` eligibility envelopes;
- exact eligibility target, observed, issue, and safety fields;
- exact character-owner and domain/tier isolation;
- explicit implementation-local eligibility policy;
- active-domain checks that keep Arcane Lore blocked;
- inert reward references and `not_evaluated` readiness, attempt, and cooldown observations.

The current repository does not provide:

- a readiness helper;
- an authored or canonical readiness policy;
- a readiness schema or content path;
- authoritative attempt history;
- an attempt-limit authority;
- a cooldown collection or cooldown authority;
- an availability source;
- a sequence or time authority for trials;
- readiness storage, persistence, save, account, session, runtime, or database ownership;
- a trial-attempt creation owner;
- checkpoint or outcome resolution;
- reward resolution or grant behavior.

The current repository readiness posture is `not_ready`. Eligibility can be evaluated, but no readiness policy or authoritative attempt, cooldown, availability, or sequence/time input exists.

## 3. Terminology

- **Eligibility candidate:** one well-formed read-only eligibility envelope whose decision is `eligible_candidate` for one exact character owner, eligibility policy, domain, and optional tier. It is input authority, not persisted eligibility state.
- **Readiness candidate:** a read-only `ready_candidate` decision showing that one exact eligibility candidate and every explicitly authored readiness gate align. It is not attempt permission or an attempt.
- **Readiness policy:** separate authored or implementation-local authority declaring which eligibility policy and target it governs and which readiness gates must be evaluated.
- **Attempt authority:** the future authority that defines valid attempt identities, ownership, target parity, lifecycle, and relationship to attempt history.
- **Attempt history:** authoritative prior-attempt records used only to evaluate explicit attempt-limit, prerequisite, or cooldown gates.
- **Attempt limit:** an explicit readiness-policy rule limiting attempts in an identified scope. It must not be inferred from history length or UI state.
- **Cooldown authority:** the future authority supplying the applicable cooldown record or deterministic cooldown facts for one exact owner and target.
- **Cooldown gate:** an explicit policy check comparing authoritative cooldown facts with explicit sequence/time authority.
- **Availability gate:** an explicit policy check against a separately authorized source stating whether the exact trial is available.
- **Prerequisite readiness gate:** an explicitly authored dependency on another readiness-related fact, attempt, outcome, or authorization. No prerequisite is implicit.
- **Sequence/time authority:** a future explicit deterministic authority supplying the sequence or time value and unit used for attempt windows, cooldowns, and availability. The helper must not obtain current time itself.
- **Readiness envelope:** a newly constructed read-only result containing phase, decision, exact target, observed gate statuses, blockers, issues, and inert safety flags.
- **Readiness blocker:** a deterministic explanation for a valid but unsatisfied readiness gate.
- **Deferred readiness authority:** policy or authority intentionally marked unavailable for current evaluation. When structurally valid and expected, it produces `not_ready`; malformed or ambiguous authority produces `blocked`.

The ordered boundary remains:

```text
completion candidate
  -> eligibility candidate
  -> readiness candidate
  -> separately authorized attempt creation
  -> checkpoint resolution
  -> outcome resolution
  -> cooldown/reward application
```

No arrow is automatic.

## 4. Core Boundary Decision

Readiness must remain a separate phase after eligibility.

The future helper may return only:

- `ready_candidate`;
- `not_ready`;
- `blocked`.

It must consume an explicit eligibility envelope. It must not call completion or eligibility helpers, inspect raw progress or evidence, create an attempt, resolve a checkpoint or outcome, mutate cooldowns, or grant rewards.

## 5. Authority Boundaries

- Eligibility envelopes are explicit read-only inputs, not persisted eligibility state.
- An `eligible_candidate` does not imply readiness, attempt permission, unlock, reward, UI visibility, runtime availability, or gameplay behavior.
- Readiness policy is separate authored/planned authority.
- A `ready_candidate` requires explicit attempt, cooldown, availability, and sequence/time authority for every gate selected by policy.
- Readiness must never call completion or eligibility helpers.
- Readiness must never inspect raw progress, consumed evidence, completion policy, completion weights, or snippet progression metadata.
- Readiness must validate the exact eligibility envelope shape and safety flags rather than trust caller claims.
- No canonical readiness schema, content path, storage owner, persistence owner, attempt history, cooldown collection, availability source, or sequence/time authority exists.
- Character is the only initially supported owner scope.
- Knowledge readiness remains separate from Skill Trial and Spell/Magic Study readiness.
- Arcane Lore remains planned, blocked, and deferred.

## 6. Eligibility Envelope Input Contract

The future readiness helper should accept one exact output from `evaluateKnowledgeTrialEligibility(...)`.

The eligibility envelope must contain exactly:

- `phase`;
- `decision`;
- `target`;
- `observed`;
- `issues`;
- `safety`.

Required values and shapes:

- `phase` must be `"eligibility"`;
- `decision` must be `eligible_candidate`, `not_eligible`, or `blocked`;
- target must contain exact character owner, eligibility `policyId`, scope, domain, and tier;
- domain-scoped eligibility output must retain `tier: null`;
- observed must contain exact required, satisfied, and failed completion-target arrays;
- observed readiness, attempt, and cooldown statuses must remain `"not_evaluated"`;
- observed reward references remain inert;
- issues must match the eligibility decision contract;
- every current eligibility safety flag must exist with value `true`;
- no extra readiness, attempt, runtime, UI, storage, reward, event, or gameplay claim is permitted.

Current eligibility safety authority is:

```js
{
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
}
```

A malformed or unsafe eligibility envelope blocks readiness evaluation.

A well-formed `not_eligible` or `blocked` envelope cannot produce `ready_candidate`. The later implementation should return `blocked` when active readiness policy requires `eligible_candidate`, because the supplied upstream decision does not meet the required input contract. Missing readiness policy remains a separate valid `not_ready` case.

Current snippet completion envelopes carry `snippetId` but not tier. Eligibility policy therefore uses exact `domainId + snippetId` snippet requirements. Readiness must not infer snippet-tier authority from eligibility observed targets.

## 7. Future Readiness Policy Concepts

The first readiness policy should be an explicit implementation-local in-memory wrapper. This plan does not authorize a schema or content JSON.

Each readiness policy should declare:

- exact `readinessPolicyId`;
- exact `eligibilityPolicyId`;
- status such as `active` or `deferred`;
- exact owner scope and owner id;
- exact domain or tier scope;
- exact `knowledge_domain.*` id;
- exact tier for tier scope;
- required eligibility decision, initially `eligible_candidate` only;
- explicit attempt-limit policy or an explicit no-limit posture;
- explicit cooldown policy or an explicit no-cooldown posture;
- explicit availability policy or an explicit always-available posture;
- explicit prerequisite readiness gates, including an empty array when none exist;
- explicit sequence/time authority requirements and units for any temporal or sequence gate;
- optional reward references as inert metadata only;
- explicit Arcane Lore exclusion.

No default policy, fallback target, implicit limit, implicit cooldown, implicit availability, or inferred prerequisite is allowed.

### Attempt-Limit Policy

Attempt limits may be evaluated only when:

- the policy declares the counting scope and maximum;
- authoritative attempt history exists for the same owner and exact target;
- the history defines which attempt statuses count;
- duplicate and replay posture is explicit.

Array length alone is not authority.

### Cooldown Policy

Cooldown evaluation requires:

- explicit cooldown policy;
- exact owner and target;
- authoritative prior-attempt or cooldown facts;
- explicit sequence/time input and unit;
- deterministic comparison rules.

Readiness must not start, clear, extend, expire, or mutate a cooldown.

### Availability Policy

Availability requires a separately authorized input describing the exact policy/owner/target and a deterministic open/closed fact or explicit interval. UI visibility, menu selection, content presence, or runtime globals are not availability authority.

### Prerequisite Readiness Gates

Prerequisites must name exact authority, owner, target, and required decision or status. Skill Trial, Spell/Magic Study, reward, catalog, and Arcane Lore metadata cannot become implicit prerequisites.

## 8. Attempt, Cooldown, Availability, And Sequence/Time Inputs

The first helper should require explicit wrappers for every selected authority.

### Attempt Authority And History

Future attempt input should provide exact attempt records or a validated projection containing:

- stable attempt identity;
- owner scope and owner id;
- readiness and eligibility policy ids;
- domain and optional tier;
- attempt sequence/time snapshot;
- lifecycle status needed by the selected policy;
- no checkpoint result or reward mutation claim beyond separately authorized facts.

Missing required attempt authority is `not_ready` only when policy explicitly treats the authority as deferred or unavailable. Malformed, duplicate, conflicting, ambiguous, cross-owner, cross-domain, or cross-tier attempt authority is `blocked`.

### Cooldown Authority

Future cooldown input should provide exact target identity, source attempt or cooldown identity, start and end sequence/time facts where policy requires them, and the same sequence/time unit as policy.

Valid active cooldown produces `not_ready`. Malformed or mismatched cooldown authority produces `blocked`.

### Availability Authority

Future availability input should identify exact readiness policy, owner, target, status, and any explicit sequence/time window. A valid closed gate produces `not_ready`; malformed or mismatched authority produces `blocked`.

### Sequence/Time Authority

The caller must explicitly supply the authoritative current sequence or time value, authority id, scope, and unit.

The helper must not use:

- `Date.now`;
- `new Date`;
- wall-clock access;
- filesystem timestamps;
- randomness;
- hidden counters;
- `process.env`;
- runtime globals;
- array or file order.

Missing required sequence/time authority produces `not_ready` only when safely represented as deferred. Malformed, cross-scope, unsupported, or caller-convenience values without authority identity produce `blocked`.

## 9. Exact Matching And Isolation

The readiness grouping key is:

```text
ownerScope
  + ownerId
  + readinessPolicyId
  + eligibilityPolicyId
  + domainId
  + optional tier
```

Rules:

- owner scope and owner id must match exactly across target, eligibility envelope, readiness policy, and every authority;
- readiness and eligibility policy ids must match exactly;
- domain id must match exactly;
- tier must match exactly for tier scope;
- a domain-scoped target must not acquire a tier through inference;
- additional authority for another owner, domain, tier, or policy must not satisfy a gate;
- cross-owner, cross-domain, cross-tier, Skill Trial, and Spell/Magic Study data must not leak into the decision;
- equivalent input order must not change output.

## 10. Decision Semantics

### `ready_candidate`

Return only when:

- invocation and every required authority are valid and unambiguous;
- one exact eligibility envelope is well formed, inert, and `eligible_candidate`;
- one exact active readiness policy matches the eligibility policy, owner, domain, and tier;
- target domain is active and is not Arcane Lore;
- attempt authority and history are valid and the attempt limit passes;
- cooldown authority is valid and the cooldown gate passes;
- availability authority is valid and the availability gate passes;
- explicit sequence/time authority is valid and every sequence/time gate passes;
- every authored prerequisite readiness gate passes.

This decision means only that a separate attempt owner may consider an attempt-creation request.

### `not_ready`

Return when authority is safe to interpret but readiness is not satisfied, including:

- readiness policy is absent;
- readiness policy is explicitly deferred;
- required readiness authority is explicitly deferred;
- attempt limit is reached;
- cooldown is active;
- availability gate is closed;
- sequence/time authority is valid but outside an allowed gate;
- an explicit prerequisite gate fails;
- active policy is valid but another readiness condition safely fails.

`not_ready` should include deterministic readiness blockers. It must not create state or change any gate.

### `blocked`

Return when readiness cannot safely interpret authority, including:

- malformed or unsafe eligibility envelope;
- active policy requires `eligible_candidate` but the supplied envelope is `not_eligible` or `blocked`;
- missing, malformed, duplicate, conflicting, ambiguous, unsupported, or unresolved active policy authority;
- malformed, duplicate, conflicting, ambiguous, unsupported, or mismatched attempt, cooldown, availability, or sequence/time authority;
- cross-owner, cross-domain, cross-tier, or cross-policy data;
- unsupported owner scope;
- non-active unresolved domain;
- Arcane Lore;
- Skill Trial, Spell/Magic Study, UI, runtime, storage, reward, event, generated-output, or gameplay shortcut inputs.

## 11. Readiness Envelope

Recommended future shape:

```js
{
  phase: "readiness",
  decision: "ready_candidate" | "not_ready" | "blocked",
  target: {
    ownerScope: "character",
    ownerId: "character.example",
    readinessPolicyId: "knowledge_trial_readiness_policy.example",
    eligibilityPolicyId: "knowledge_trial_policy.example",
    scope: "tier",
    domainId: "knowledge_domain.flora",
    tier: 1
  } | null,
  observed: {
    eligibilityDecision:
      "eligible_candidate" | "not_eligible" | "blocked" | null,
    readinessPolicyStatus:
      "active" | "deferred" | "missing" | "not_evaluated",
    attemptConstraintStatus: "pass" | "fail" | "not_evaluated",
    cooldownConstraintStatus: "pass" | "fail" | "not_evaluated",
    availabilityStatus: "pass" | "fail" | "not_evaluated",
    sequenceOrTimeStatus: "pass" | "fail" | "not_evaluated",
    readinessBlockers: [],
    rewardRefs: []
  },
  issues: [],
  safety: {
    noMutation: true,
    noPersistence: true,
    noStorage: true,
    noCompletionEvaluation: true,
    noEligibilityEvaluation: true,
    noCompletionStateWrite: true,
    noEligibilityStateWrite: true,
    noReadinessStateWrite: true,
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
  }
}
```

For domain scope, `tier` should be consistently `null`, matching the current eligibility output posture.

`readinessBlockers` describe safe gate failures. `issues` describe malformed or unsafe authority. Reward references are copied or reported only and never interpreted as owned, earned, or granted.

## 12. Proposed Future Helper Shape

Recommended path:

- `tools/content-lint/knowledge-trial-readiness.mjs`

Recommended export:

```js
export function evaluateKnowledgeTrialReadiness(input = {}) {
  // Pure read-only readiness decision.
}
```

Recommended explicit inputs:

- `relativePath`;
- exact readiness target;
- one eligibility envelope;
- implementation-local readiness-policy wrapper;
- explicit attempt authority/history wrapper;
- explicit cooldown authority wrapper;
- explicit availability authority wrapper;
- explicit sequence/time authority;
- domain registry authority.

The helper should:

- be pure, deterministic, in-memory, filesystem-free, and immutable;
- accept explicit inputs only;
- validate exact eligibility envelope shape and safety;
- require exact implementation-local policy;
- construct a new read-only readiness envelope;
- remain unregistered from normal content lint.

It must not call completion, eligibility, progress, evidence, application, attempt, checkpoint, outcome, cooldown, reward, UI, or runtime helpers.

## 13. Forbidden Inference Sources

Readiness must not be inferred from:

- completion candidates directly;
- raw progress;
- consumed evidence;
- completion policy;
- `completionWeight`;
- `trialUnlockWeight`;
- `countsTowardTierCompletion`;
- catalog, snippet, tier, domain, attempt-array, or file size;
- file order or array order;
- wall-clock time, `Date.now`, or `new Date`;
- randomness;
- hidden or process-global counters;
- `process.env`;
- runtime globals;
- UI visibility, selection, badges, buttons, or menus;
- generated output;
- Skill Trial metadata;
- Spell/Magic Study metadata;
- Arcane Lore skill references;
- reward references;
- account, family, institution, inventory, save, session, or gameplay state outside an explicitly authorized future contract.

## 14. Attempt, Checkpoint, Outcome, Cooldown, And Reward Boundaries

Readiness must not:

- create or persist a trial attempt;
- select, choose, start, or advance a checkpoint;
- resolve pass, fail, soft-fail, hard-fail, branch, or recovery;
- resolve an attempt or trial outcome;
- start, clear, extend, expire, reserve, or mutate a cooldown;
- resolve, preview as earned, create, reserve, or grant a reward;
- emit an event, unlock content, or mutate ownership.

Reward references remain inert planned metadata only.

## 15. Family Separation

Knowledge, Skill, and Spell/Magic Study may share vocabulary, but they do not share authority or behavior.

- Knowledge readiness consumes a Knowledge eligibility envelope and Knowledge readiness authorities.
- Skill Trial readiness consumes skill rank, band, breakthrough, and separately authored Skill Trial authority.
- Spell/Magic Study readiness consumes study access, study policy, and separately authorized study facts.

No readiness helper may use one family's metadata as another family's authority.

## 16. Normal Content-Lint Posture

The future readiness helper should not be registered in `tools/content-lint/index.mjs`.

Eligibility envelopes, attempt history, cooldowns, availability, and sequence/time facts are explicit operation inputs or future mutable state, not current authored content. Registration requires separate authorization and canonical authored policy ownership.

## 17. Arcane Lore Posture

Arcane Lore remains planned, blocked, and deferred.

- `knowledge_domain.arcane_lore` is not active.
- A forged eligibility envelope must not bypass domain authority.
- Arcane Lore skill metadata, spell ownership, study access, magic-school metadata, scroll/tome access, or UI visibility must not create readiness.
- Future Arcane Lore readiness requires separately authorized active domain, eligibility policy, readiness policy, attempts, cooldowns, availability, sequence/time, storage, persistence, and runtime behavior.

## 18. Future Focused Test Matrix

### Ready Candidate

- exact `eligible_candidate`, active readiness policy, valid attempt authority, passing attempt limit, passing cooldown, open availability, valid sequence/time authority, and satisfied prerequisites return `ready_candidate`;
- exact domain-scoped readiness preserves `tier: null`;
- exact tier-scoped readiness preserves the tier;
- equivalent reordered authority returns deterministic output;
- inputs remain immutable and outputs are deep copied;
- exact readiness safety flags are returned.

### Not Ready

- valid eligibility with absent readiness policy returns `not_ready`;
- deferred readiness policy returns `not_ready`;
- explicitly deferred required authority returns `not_ready`;
- reached attempt limit returns `not_ready`;
- active cooldown returns `not_ready`;
- closed availability gate returns `not_ready`;
- valid sequence/time authority outside the allowed gate returns `not_ready`;
- valid policy with an unsatisfied prerequisite returns `not_ready`;
- reward references do not change readiness.

### Blocked

- malformed eligibility envelope;
- missing or false eligibility safety flag;
- unsupported eligibility phase, decision, target, observed, issue, or safety field;
- active policy requires eligibility but receives `not_eligible` or `blocked`;
- duplicate, conflicting, malformed, unresolved, unsafe, unsupported, or Arcane Lore readiness policy;
- malformed, ambiguous, duplicate, cross-owner, cross-domain, cross-tier, or unsupported attempt authority;
- malformed, ambiguous, duplicate, cross-owner, cross-domain, cross-tier, or unsupported cooldown authority;
- malformed, ambiguous, duplicate, cross-owner, cross-domain, cross-tier, or unsupported availability authority;
- missing required, malformed, wall-clock-derived, random, hidden, cross-owner, cross-domain, cross-tier, or unsupported sequence/time authority;
- unsupported Skill Trial, Spell/Magic Study, UI, runtime, storage, reward, event, generated-output, or gameplay shortcut input.

### Boundary Audits

- no completion or eligibility helper calls;
- no filesystem, clock, randomness, environment, network, or hidden-counter access;
- no storage or persistence imports;
- no attempt creation;
- no checkpoint or outcome resolution;
- no cooldown mutation;
- no reward grant;
- no normal content-lint registration;
- no fixtures;
- no UI, runtime, generated-output, event, ownership, or gameplay coupling.

## 19. Acceptance Criteria For Version 0.5.148

`Version 0.5.148 - Knowledge Trial Readiness Helper` is acceptable only when:

- the patch adds only a pure readiness helper, focused inline tests, and required coordination documents;
- no schema, content JSON, validator, existing helper/test, fixture, storage, persistence, UI, runtime, generated-output, event, reward, ownership, or gameplay file changes occur;
- the helper consumes an explicit eligibility envelope rather than calling eligibility or completion;
- the eligibility envelope must retain the exact current shape and safety flags;
- readiness policy and every selected authority are explicit and implementation-local;
- exact owner, readiness policy, eligibility policy, domain, and tier parity are enforced;
- missing or deferred readiness policy produces `not_ready`;
- safely failed attempt, cooldown, availability, sequence/time, or prerequisite gates produce `not_ready`;
- malformed, unsafe, ambiguous, conflicting, cross-scope, unsupported, unresolved, or Arcane Lore authority produces `blocked`;
- valid aligned authority produces `ready_candidate`;
- reward references remain inert;
- exact readiness safety flags are returned;
- the helper remains unregistered from normal content lint;
- focused tests cover Section 18;
- no downstream trial behavior is implemented.

The helper must not create attempts or implement checkpoint, outcome, cooldown, reward, UI, runtime, or persistence behavior.

## 20. Risks And Deferred Work

- No canonical readiness policy schema, content path, or id pattern exists.
- Eligibility policy remains implementation-local.
- Eligibility and readiness envelopes are in-memory decisions, not persisted state.
- Current snippet completion envelopes do not carry snippet-tier authority.
- No canonical attempt schema, history collection, lifecycle status, counting rule, or owner exists.
- No canonical cooldown record, unit, duration, start, expiry, override, or owner exists.
- No canonical availability source or scheduling owner exists.
- No canonical sequence/time authority, unit, restoration, replay, or collision rule exists.
- Attempt idempotency, concurrency, reservation, and persistence remain undefined.
- Checkpoint scoring, soft-fail recovery, hard-fail behavior, and outcome ownership remain undefined.
- Reward reference authority, outcome-to-reward ownership, and atomic grant behavior remain undefined.
- Readiness storage, save/account/session/database placement, runtime commands, UI, generated output, Chronicle, Renown, Legacy, and gameplay integration remain deferred.
- `trialUnlockWeight` has no approved readiness interpretation.
- Arcane Lore remains blocked.

## 21. Non-Goals And Forbidden Changes

This plan authorizes none of the following:

- no readiness helper or test;
- no schema, content JSON, fixture, fixture loader, or validator;
- no existing completion or eligibility helper edit;
- no normal content-lint registration;
- no completion, eligibility, readiness, attempt, checkpoint, outcome, cooldown, or reward state;
- no storage, persistence, save, account, session, character, database, migration, or compatibility shape;
- no readiness evaluation implementation;
- no attempt creation or reservation;
- no checkpoint or outcome resolution;
- no cooldown mutation;
- no reward resolution or grant;
- no unlock;
- no Skill Trial behavior;
- no Spell/Magic Study behavior;
- no UI, main-menu, runtime, generated output, event, Chronicle, Renown, Legacy, ownership mutation, or gameplay behavior;
- no unrelated cleanup.

## 22. Next Recommended Run

The next recommended run is:

`Version 0.5.148 - Knowledge Trial Readiness Helper`

It should add only a pure deterministic in-memory readiness helper and focused inline tests over an exact eligibility envelope plus explicit implementation-local readiness, attempt, cooldown, availability, sequence/time, and domain authority. It must not create attempts or implement any downstream trial behavior.
