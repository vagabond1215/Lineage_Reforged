# Knowledge Trial Boundary Plan

Source version/run: Version 0.5.145 - Knowledge Trial Boundary Plan
Date: 2026-06-14
Status: planning-only Knowledge trial eligibility and readiness boundary

## 1. Purpose And Status

This document defines the future boundary between read-only Knowledge completion candidates and separately authorized Knowledge trial eligibility and readiness decisions.

This run is documentation only. It implements no trial helper, schema, content JSON, validator, test, fixture, storage, persistence, trial state, attempt, checkpoint, outcome, cooldown, reward, unlock, UI, runtime, generated output, event, ownership mutation, or gameplay behavior.

## 2. Current State Recap

The current Knowledge foundation provides:

- authored active Knowledge snippets for Flora, Fauna, Minerals, and General Lore;
- pure evidence, progress, initialization, acceptance, proposal, application, and completion helpers;
- `evaluateKnowledgeCompletion(...)`, which returns read-only `candidate`, `incomplete`, or `blocked` envelopes for explicit snippet, tier, or domain targets;
- exact completion safety flags proving that completion performs no mutation, persistence, trial unlock, Skill Trial behavior, Spell/Magic Study behavior, UI, runtime, generated output, event, reward, ownership mutation, or gameplay mutation;
- a separate general Skill Mastery Trial Framework Plan that describes future narrative checkpoints without implementing them.

The repository does not provide:

- persisted completion state;
- canonical Knowledge completion policy content;
- a canonical Knowledge trial schema or content collection;
- Knowledge trial eligibility or readiness policy;
- a Knowledge trial helper;
- a Knowledge trial attempt, checkpoint, outcome, cooldown, or reward owner;
- canonical trial storage, persistence, save, account, session, runtime, or database placement;
- Knowledge trial UI or runtime behavior.

The current `trialUnlockWeight` values do not establish trial eligibility or readiness.

## 3. Terminology

- **Completion candidate:** a well-formed read-only Knowledge completion envelope whose decision is `candidate` for one exact owner and snippet, tier, or domain target. It is input to later policy, not persisted completion state.
- **Trial eligibility candidate:** a read-only decision that explicit completion envelopes satisfy one exact Knowledge trial eligibility policy for one owner and target. It does not grant readiness or permission to attempt.
- **Trial readiness:** a later read-only decision that an eligible candidate also satisfies separately authored attempt, cooldown, availability, and other readiness gates.
- **Trial attempt:** one future authorized trial execution instance. An eligibility or readiness helper must not create it.
- **Trial checkpoint:** one authored stage inside a future attempt. It may later produce pass, soft-fail, hard-fail, branch, or recovery information under a separate checkpoint contract.
- **Trial outcome:** the future resolved result of an attempt or checkpoint sequence. It is not produced by completion, eligibility, or readiness evaluation.
- **Trial cooldown:** a future owner-scoped restriction controlling when another attempt may be considered. It requires explicit policy plus authoritative attempt history and sequence or time input.
- **Trial reward:** a future separately owned grant resulting from an authorized outcome. A reward reference in policy is inert metadata and is not a grant.
- **Trial envelope:** a newly constructed read-only eligibility or readiness result containing the phase, decision, exact target, observed policy inputs, deterministic issues, and inert safety flags.

The terms are intentionally separate:

```text
completion candidate
  -> eligibility candidate
  -> readiness candidate
  -> authorized attempt
  -> checkpoint resolution
  -> outcome
  -> cooldown/reward application
```

No arrow in this sequence is automatic.

## 4. Core Boundary Decision

Knowledge trial evaluation should use two separate phases.

### Phase 1: Eligibility

The first future helper should answer only:

- `eligible_candidate`;
- `not_eligible`;
- `blocked`.

It should consume explicit completion envelopes and explicit eligibility policy. It must not evaluate readiness, create an attempt, resolve a checkpoint, produce an outcome, start a cooldown, or grant a reward.

### Phase 2: Readiness

A later separately authorized helper may answer only:

- `ready_candidate`;
- `not_ready`;
- `blocked`.

It should require an explicit eligible-candidate envelope plus explicit readiness policy and authoritative attempt/cooldown inputs. It must not create an attempt or mutate cooldown state.

Eligibility and readiness should not be collapsed into one boolean or one implicit unlock.

## 5. Authority Boundaries

The future boundary must observe these rules:

- Completion candidates are explicit read-only inputs, not persisted completion state.
- A completion candidate does not imply trial eligibility, readiness, attempt permission, unlock, reward, UI visibility, runtime availability, or gameplay behavior.
- Knowledge trial eligibility policy is separate authored/planned authority.
- Knowledge trial readiness policy is separate from eligibility policy.
- No canonical trial schema, content path, storage owner, persistence owner, attempt owner, cooldown owner, outcome owner, or reward owner exists.
- The completion helper retains completion interpretation ownership. A trial helper must consume completion envelopes rather than recalculate progress or completion.
- The current completion envelope target and safety flags are authority inputs and must validate exactly.
- Character is the only currently supported owner scope. Broader owner scopes remain deferred.
- Knowledge trials remain separate from Skill Trials and Spell/Magic Study.
- Arcane Lore remains planned, blocked, and unavailable for Knowledge trial policy.

UI state, runtime state, generated output, current menu selection, and caller convenience fields are not authorities.

## 6. Completion Envelope Input Contract

The first eligibility helper should consume one or more explicit outputs from `evaluateKnowledgeCompletion(...)`.

Each supplied completion envelope must:

- be an object with the exact current completion envelope fields;
- declare `decision`, `scope`, `target`, `observed`, `issues`, and `safety`;
- use a supported completion decision: `candidate`, `incomplete`, or `blocked`;
- use a supported scope: `snippet`, `tier`, or `domain`;
- contain the exact scope-specific target fields;
- retain exact owner, domain, tier, and snippet identity where applicable;
- contain all current completion safety flags with value `true`;
- contain no unsupported trial, runtime, UI, reward, event, storage, or gameplay claim;
- remain unchanged by eligibility evaluation.

Safety validation is mandatory. A missing or false completion safety flag blocks eligibility evaluation because the caller has not supplied a trustworthy inert completion decision.

A well-formed completion envelope whose decision is `incomplete` or `blocked` does not satisfy eligibility and should produce `not_eligible`, except that any Arcane Lore target remains a hard `blocked` boundary.

The eligibility helper must not:

- call the completion helper;
- inspect raw applied progress;
- inspect consumed evidence;
- recompute completion thresholds or weights;
- repair a malformed completion envelope;
- persist or mark completion.

## 7. Required Future Trial Policy Concepts

The first trial policy should remain an explicit implementation-local in-memory wrapper. This plan does not authorize a schema or content file.

Each conceptual eligibility policy needs:

- one stable policy identity or caller-owned operation identity;
- exact primary target scope;
- exact `knowledge_domain.*` target;
- exact tier when the target is tier-scoped;
- exact required owner scope, initially `character`;
- exact required owner id for the evaluated policy instance;
- an explicit set of required completion targets;
- deterministic handling for optional prerequisite completion targets;
- explicit policy status, including active or deferred;
- explicit Arcane Lore exclusion.

Required completion targets should identify exact:

- completion scope: `snippet`, `tier`, or `domain`;
- domain id;
- tier when applicable;
- snippet id when applicable;
- required completion decision, initially `candidate` only.

Optional prerequisites may include additional domains, tiers, or snippets only when the policy names each exact target. No prerequisite may be inferred from catalog order, current content coverage, related skills, magic schools, UI visibility, or registry wave.

Conceptual readiness policy may later declare:

- attempt-limit policy;
- cooldown policy;
- current-availability policy;
- prerequisite attempt or outcome policy;
- optional preparation requirements;
- optional reward references.

Cooldown and attempt constraints are inert planned policy until authoritative attempt history and sequence or time inputs exist.

Reward references are inert planned metadata. Eligibility or readiness must not resolve, validate as owned, create, grant, preview as earned, or emit them.

## 8. Exact Target And Owner Matching

Eligibility is owner-scoped and target-scoped.

The primary group keys are:

```text
ownerScope + ownerId + domainId
```

and, for tier-scoped policy:

```text
ownerScope + ownerId + domainId + tier
```

Snippet prerequisites additionally include exact `snippetId`.

Rules:

- Every required completion envelope must belong to the requested owner.
- Every required completion envelope must match the policy's exact domain.
- Tier requirements must match the exact tier.
- Snippet requirements must match the exact snippet.
- Additional completion envelopes for other owners, domains, tiers, or snippets must not satisfy a requirement.
- One completion envelope must not satisfy two distinct required targets unless policy explicitly names the same target once; duplicate policy requirements should block as malformed.
- Cross-owner, cross-domain, cross-tier, Skill Trial, and Spell/Magic Study data must not leak into the decision.

A valid but mismatched completion envelope produces `not_eligible`, not an inferred substitute.

## 9. Eligibility Decision Rules

The first future eligibility helper should return:

### `eligible_candidate`

Return only when:

- the invocation and policy are valid and unambiguous;
- the policy is active;
- the target domain is active and is not Arcane Lore;
- required policy owner scope, required policy owner id, requested owner, and completion-envelope owner match exactly;
- every required completion target resolves exactly once;
- every required completion envelope is well formed and inert;
- every required completion decision is `candidate`;
- every explicitly authored prerequisite completion target is satisfied.

This decision means only that readiness may be considered later.

### `not_eligible`

Return when authority is valid but the policy is not satisfied, including:

- a required completion envelope is well formed but `incomplete`;
- a required completion envelope is well formed but `blocked`;
- a required completion target is supplied for another owner;
- a completion target belongs to another domain or tier;
- a required snippet or prerequisite target does not align;
- an active policy's explicit prerequisite completion is not a candidate.

The output should explain which exact requirement failed without mutating any input.

### `blocked`

Return when evaluation cannot safely interpret authority, including:

- missing, malformed, duplicate, conflicting, or ambiguous trial policy;
- malformed completion envelope;
- missing or false completion safety flags;
- unsupported target or owner scope;
- unresolved policy target;
- deferred or inactive policy when the caller requests an active eligibility decision;
- planned or referenced Arcane Lore;
- unsupported Skill Trial, Spell/Magic Study, runtime, UI, storage, reward, event, or gameplay shortcut inputs.

No default policy or fallback target is allowed.

## 10. Readiness Decision Rules

Readiness remains a separate later phase.

### `ready_candidate`

A later helper may return this only when:

- one valid `eligible_candidate` envelope is supplied;
- explicit readiness policy exists and is active;
- owner and target identity match exactly;
- every explicit attempt, cooldown, availability, and prerequisite gate has authoritative input;
- every readiness gate passes.

`ready_candidate` is still not an attempt, unlock, UI action, or gameplay mutation.

### `not_ready`

Return when eligibility is valid but readiness cannot yet pass, including:

- readiness policy is absent or explicitly deferred;
- an explicit cooldown gate is not satisfied;
- an explicit attempt limit is reached;
- required attempt history or readiness authority is valid but does not satisfy policy;
- a separately authored availability gate is closed.

The current repository posture is `not_ready` because no readiness policy or authoritative attempt/cooldown state exists.

### `blocked`

Return when readiness inputs or policy are malformed, ambiguous, conflicting, unsafe, unresolved, cross-owner, cross-domain, or Arcane Lore scoped.

Readiness must not use wall-clock time, filesystem order, random values, hidden counters, UI state, or runtime globals as authority.

## 11. Attempt, Checkpoint, Outcome, Cooldown, And Reward Boundaries

Eligibility and readiness helpers must create none of these.

### Trial Attempt

A future attempt owner must define:

- stable attempt identity;
- owner and policy target;
- authorized start sequence or time;
- selected authored trial content;
- current checkpoint;
- prior attempts and cooldown relationship;
- persistence and replay behavior.

### Trial Checkpoint

A future checkpoint contract must define:

- exact checkpoint identity and order;
- required inputs;
- deterministic pass, soft-fail, hard-fail, and recovery rules;
- any approved character, environment, tool, teacher, or institution modifiers;
- no hidden UI-authored score or runtime mutation.

### Trial Outcome

Outcome resolution must remain separate from eligibility and readiness. It must not be inferred from completion candidates, readiness, catalog size, or reward metadata.

### Trial Cooldown

Cooldown requires explicit authored policy and authoritative attempt history plus sequence or time ownership. No current helper or plan selects that authority.

### Trial Reward

Reward references may be carried as inert policy metadata only. Reward resolution and grant require separate content authority, outcome authority, ownership, mutation, event, and persistence plans.

## 12. Forbidden Inference Sources

Knowledge trial eligibility and readiness must not be inferred from:

- `trialUnlockWeight`;
- `completionWeight`;
- `countsTowardTierCompletion`;
- raw `progressValue`;
- consumed-evidence count;
- current snippet, tier, domain, or catalog size;
- UI visibility, selection, badge, button, or progress-bar state;
- runtime, save, account, family, session, institution, inventory, or gameplay state not supplied under an explicitly authorized future contract;
- generated output;
- Skill Trial metadata;
- Spell/Magic Study metadata;
- magic-school or spell ownership;
- Arcane Lore skill references;
- registry wave or related-skill links;
- file order, array order, clock time, randomness, or hidden counters.

The current `trialUnlockWeight` field remains authored metadata without an approved Knowledge trial interpretation.

## 13. Family Separation

Knowledge, Skill, and Spell/Magic Study may share general words such as eligibility, readiness, attempt, checkpoint, outcome, cooldown, and reward, but they do not share authority or behavior.

### Knowledge Trials

Consume explicit Knowledge completion envelopes and Knowledge trial policy.

### Skill Trials

Consume skill rank, breakthrough, band, and separately authored Skill Trial policy under the Skill Mastery Trial Framework.

### Spell/Magic Study

Consumes study access, study policy, checkpoint results, and later acquisition evidence. Study completion does not automatically grant known-spell ownership.

No helper may use one family's metadata as another family's authority.

## 14. Proposed Future Helper Shape

Recommended first path:

- `tools/content-lint/knowledge-trial-eligibility.mjs`

Recommended first export:

```js
export function evaluateKnowledgeTrialEligibility(input = {}) {
  // Pure read-only eligibility decision.
}
```

Recommended explicit inputs:

- `relativePath`;
- one exact requested owner and Knowledge trial target;
- `completionEnvelopes`;
- `trialEligibilityPolicyWrapper`;
- domain registry authority needed to block planned or unresolved domains.

The first helper should:

- be pure, deterministic, in-memory, filesystem-free, and immutable;
- accept explicit inputs only;
- validate exact completion-envelope shape and safety;
- require exact implementation-local eligibility policy;
- return a newly constructed read-only eligibility envelope;
- remain unregistered from normal content lint.

It must not:

- call completion, progress, evidence, application, attempt, checkpoint, reward, UI, or runtime helpers;
- read files;
- create or mutate trial state;
- evaluate readiness;
- create an attempt;
- resolve checkpoints or outcomes;
- start or clear cooldowns;
- grant or resolve rewards;
- emit events or generated output.

A later readiness helper requires separate authorization.

## 15. Proposed Trial Envelope

Recommended shared shape:

```js
{
  phase: "eligibility" | "readiness",
  decision:
    | "eligible_candidate"
    | "not_eligible"
    | "ready_candidate"
    | "not_ready"
    | "blocked",
  target: {
    ownerScope: "character",
    ownerId: "character.example",
    policyId: "knowledge_trial_policy.example",
    scope: "tier",
    domainId: "knowledge_domain.flora",
    tier: 1
  } | null,
  observed: {
    requiredCompletionTargets: [],
    satisfiedCompletionTargets: [],
    failedCompletionTargets: [],
    readinessPolicyStatus: "not_evaluated",
    attemptConstraintStatus: "not_evaluated",
    cooldownConstraintStatus: "not_evaluated",
    rewardRefs: []
  },
  issues: [],
  safety: {
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
}
```

The first eligibility helper should return only eligibility decisions and use `not_evaluated` for readiness, attempt, and cooldown fields. Exact policy identity and observed projection names may remain implementation-local, but the phase separation and safety posture should remain exact.

## 16. Normal Content-Lint Posture

The first Knowledge trial eligibility helper should not be registered in `tools/content-lint/index.mjs`.

Reasons:

- completion envelopes are in-memory decisions, not canonical authored content;
- no canonical Knowledge trial policy file exists;
- no canonical eligibility, readiness, attempt, or cooldown state exists;
- registration would misrepresent an explicit operation helper as repository content validation.

Any later registration requires separate authorization and a canonical authored policy source.

## 17. Arcane Lore Posture

Arcane Lore remains blocked and deferred.

- `knowledge_domain.arcane_lore` remains `planned`.
- No active Arcane Lore snippet route exists.
- No valid Arcane Lore completion candidate can be produced from current active content.
- The Arcane Lore skill reference is metadata only.
- Spell ownership, spell study, scroll/tome access, magic-school metadata, Arcane Compendium visibility, or related-skill links must not create Knowledge trial eligibility or readiness.
- A forged or caller-supplied Arcane Lore completion candidate must not bypass active-domain authority.

Future Arcane Lore trials require separate active-domain, snippet, evidence, progress, completion-policy, trial-policy, readiness, attempt, checkpoint, outcome, cooldown, reward, storage, and runtime authorization.

## 18. Future Focused Test Matrix

### Eligibility Candidates

- exact owner/domain/tier completion candidate plus matching active trial policy returns `eligible_candidate`;
- exact domain completion candidate under matching domain-scoped policy;
- multiple explicitly required completion candidates all align;
- explicitly authored snippet, tier, or domain prerequisite candidates align;
- deterministic result under reordered equivalent inputs;
- input immutability and deep-copy output;
- exact safety flags.

### Not Eligible

- required completion envelope is well formed but `incomplete`;
- required completion envelope is well formed but `blocked`;
- completion candidate belongs to another owner;
- completion candidate belongs to another domain;
- completion candidate belongs to another tier;
- required snippet or prerequisite target does not match;
- no cross-owner, cross-domain, or cross-tier leakage.

### Blocked Authority

- malformed completion envelope;
- missing or false completion safety flag;
- missing completion target fields;
- unsupported completion decision or scope;
- missing eligibility policy;
- duplicate policy;
- conflicting policy;
- malformed policy;
- duplicate required completion target;
- unsupported owner scope;
- unresolved or deferred policy target;
- Arcane Lore target or prerequisite;
- attempted Skill Trial, Spell/Magic Study, UI, runtime, storage, reward, event, generated-output, or gameplay shortcut input.

### Readiness Boundary

- valid eligibility candidate plus absent readiness policy returns `not_ready`;
- explicitly deferred readiness policy returns `not_ready`;
- valid but unsatisfied cooldown input returns `not_ready`;
- valid but exhausted attempt constraint returns `not_ready`;
- malformed or ambiguous readiness authority returns `blocked`;
- readiness never creates an attempt or mutates cooldown state.

### Inert Policy Metadata

- cooldown policy remains copied or reported only;
- attempt constraints remain copied or reported only;
- reward references remain inert planned metadata;
- no reward reference changes eligibility unless explicitly authored as a prerequisite by a later approved policy;
- no reward grant, unlock, event, or ownership mutation occurs.

### Safety Audits

- no filesystem, clock, randomness, environment, network, or hidden counter access;
- no completion, progress, evidence, application, attempt, checkpoint, outcome, cooldown, reward, UI, or runtime helper invocation;
- no storage or persistence imports;
- no normal content-lint registration;
- no fixtures;
- no Skill Trial or Spell/Magic Study coupling;
- no UI, runtime, generated output, event, reward, ownership, or gameplay coupling.

## 19. Acceptance Criteria For Version 0.5.146

`Version 0.5.146 - Knowledge Trial Eligibility Helper` is acceptable only when:

- the patch adds only the pure eligibility helper, focused tests, and required coordination documents;
- no schema, content JSON, validator, existing Knowledge helper, fixture, storage, persistence, UI, runtime, generated-output, event, reward, ownership, or gameplay file changes;
- the helper consumes explicit completion envelopes rather than raw progress or completion inputs;
- completion envelopes must retain the exact current shape and safety flags;
- the helper requires explicit implementation-local eligibility policy;
- eligibility policy identifies exact owner scope, domain, and tier or domain scope;
- optional prerequisites are explicit exact targets only;
- valid matching candidate inputs return `eligible_candidate`;
- well-formed incomplete, blocked, or mismatched completion inputs return `not_eligible`;
- malformed or unsafe completion inputs return `blocked`;
- missing, duplicate, conflicting, malformed, deferred, unresolved, or Arcane Lore policy returns `blocked`;
- readiness is not evaluated and all readiness observations remain `not_evaluated`;
- cooldown, attempt, and reward metadata remain inert;
- exact trial safety flags are returned as `true`;
- the helper remains unregistered from normal content lint;
- focused tests cover the eligibility and safety portions of Section 18.

The first implementation must not add a readiness helper.

## 20. Risks And Deferred Work

- No canonical Knowledge trial policy schema or content path exists.
- No canonical trial policy id pattern exists.
- Completion policy and completion decisions remain in-memory only.
- No canonical completion, eligibility, readiness, attempt, checkpoint, outcome, cooldown, or reward collection exists.
- Character owner authority remains pattern-only.
- Trial sequence and time authority remain undefined.
- Attempt replay, idempotency, concurrency, and persistence remain undefined.
- Cooldown duration, units, start point, expiry, and override rules remain undefined.
- Checkpoint scoring, soft-fail recovery, hard-fail behavior, and choice ownership remain undefined.
- Reward reference authority, grant ownership, and atomic outcome/reward behavior remain undefined.
- Knowledge trial UI, runtime commands, generated output, Chronicle, Renown, Legacy, and gameplay integration remain deferred.
- `trialUnlockWeight` has no approved interpretation.
- Arcane Lore remains blocked.
- The completion rules plan and this boundary plan should be retained through eligibility-helper implementation, then reviewed for consolidation or durable promotion.

## 21. Non-Goals And Forbidden Changes

This plan authorizes none of the following:

- no trial helper or test;
- no trial schema, content JSON, fixture, or fixture loader;
- no validator or existing helper edit;
- no completion, progress, or evidence behavior edit;
- no normal content-lint registration;
- no completion, eligibility, readiness, attempt, checkpoint, outcome, cooldown, or reward state;
- no storage, persistence, save, account, session, character, database, migration, or compatibility shape;
- no trial attempt creation;
- no checkpoint or outcome resolution;
- no cooldown start, update, clear, or expiry behavior;
- no reward resolution or grant;
- no unlock;
- no Skill Trial behavior;
- no Spell/Magic Study behavior;
- no UI, main-menu, runtime, generated output, event, Chronicle, Renown, Legacy, ownership mutation, or gameplay behavior;
- no unrelated cleanup.

## 22. First Recommended Next Run

The next recommended run is:

`Version 0.5.146 - Knowledge Trial Eligibility Helper`

It should add only a pure deterministic in-memory eligibility helper and focused tests using explicit completion envelopes and explicit in-memory eligibility policy. It must not evaluate readiness or implement any trial behavior.
