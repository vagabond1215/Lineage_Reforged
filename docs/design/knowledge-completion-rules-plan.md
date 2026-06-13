# Knowledge Completion Rules Plan

Source version/run: Version 0.5.143 - Knowledge Completion Rules Plan
Date: 2026-06-13
Status: planning-only completion interpretation authority

## 1. Purpose And Status

This document defines how a future pure Knowledge completion helper should interpret already-applied progress against authored Knowledge snippet metadata and separately supplied completion-policy authority.

This run is documentation only. It implements no completion helper, threshold data, schema, content JSON, validator, test, fixture, storage, persistence, trial readiness, UI, runtime, generated output, event, reward, ownership mutation, or gameplay behavior.

## 2. Current State Recap

The current Knowledge foundation provides:

- authored snippets with `tier`, `progression.completionWeight`, `progression.countsTowardTierCompletion`, and `progression.trialUnlockWeight`;
- strict evidence and progress record schemas;
- pure evidence and progress semantic validators;
- pure candidate production, evidence acceptance, zero-state progress initialization, evidence-to-progress proposal, and progress application helpers;
- an applied progress record whose `progressValue` and `consumedEvidenceIds` have been checked against explicit current evidence and progress inputs.

The repository does not provide:

- a canonical accepted-evidence or progress collection;
- a persisted applied-progress owner;
- an authored snippet completion threshold field;
- authored tier completion thresholds;
- authored domain completion rules;
- completion state or a completion helper;
- Knowledge trial readiness or attempt behavior;
- Skill Trial or Spell/Magic Study behavior.

The four current Tier 1 snippets each use `completionWeight: 1` and `countsTowardTierCompletion: true`. Those current values are examples of authored aggregation metadata. They do not establish a snippet threshold, a tier threshold, a domain threshold, or a general rule that one progress point completes a snippet.

## 3. Completion Terminology

- **Applied progress:** a validator-compatible next progress record returned by the Knowledge progress application helper. It is an explicit completion input, not persisted state and not completion.
- **Completed snippet:** a read-only decision that one applied progress record meets an explicit authored snippet completion threshold. It is not a stored flag, reward, reveal, or ownership change.
- **Completed tier:** a read-only decision that completed, tier-counting snippets in one exact owner/domain/tier group meet an explicit authored tier completion rule.
- **Completed domain:** a read-only decision that completed tiers in one exact owner/domain group meet an explicit authored domain completion rule.
- **Completion candidate:** a snippet, tier, or domain whose validated inputs satisfy the applicable explicit completion rule and may be considered by a future separately authorized owner.
- **Completion decision:** one deterministic `candidate`, `incomplete`, or `blocked` interpretation for an explicit target.
- **Completion envelope:** the read-only output carrying the decision, observed values, applied authority, issues, and exact safety flags.

`candidate` does not mean persisted, granted, revealed, rewarded, trial-ready, or runtime-active.

## 4. Authority Boundaries

Completion must observe these boundaries:

- Applied progress is input only. The completion helper must not treat it as persisted state.
- `packages/content/base/player/knowledge_snippets.json`, validated under the current snippet schema and semantic rules, is the current content authority for snippet identity, domain, subject, tier, and progression metadata.
- The applied progress record remains the authority for `progressValue`, `consumedEvidenceIds`, owner, target snapshots, and update sequence supplied to completion.
- Completion thresholds remain authored/planned policy. They must not be inferred from runtime state, UI labels, progress bars, evidence counts, current sample values, file order, or helper defaults.
- The current snippet schema has no snippet threshold field. Therefore a future helper must require a separate explicit completion-policy authority or return `blocked`.
- The canonical file, schema, storage, and persistence owner for completion policy and completion results remains deferred.
- Current validators retain structural and semantic validation ownership. Completion must not weaken, repair, or replace them.
- Arcane Lore remains blocked because `knowledge_domain.arcane_lore` is `planned` and has no active authored snippet route.

## 5. Threshold Authority

The future helper must fail closed unless the requested scope has explicit completion-policy authority.

Conceptual policy inputs are:

- snippet rule: exact `snippetId` plus a positive integer `requiredProgressValue`;
- tier rule: exact `domainId` and `tier` plus a non-negative finite `requiredCompletionWeight`;
- domain rule: exact `domainId` plus an explicit set of required tiers or another separately authored deterministic tier requirement.

These are conceptual inputs, not approved schema fields or content paths.

Rules:

- `completionWeight` must not be reused as `requiredProgressValue`.
- `trialUnlockWeight` must not be reused as a completion threshold.
- The number of `consumedEvidenceIds` must not become a threshold.
- The number of currently authored snippets must not become a tier or domain threshold.
- A missing, duplicate, malformed, conflicting, or unresolved policy record blocks the requested decision.
- Threshold zero must not be used to auto-complete a snippet. The first snippet threshold posture is a positive integer.
- No default threshold is allowed.

## 6. Reading Applied Progress

### `progressValue`

For one snippet target, the future helper should compare:

```text
appliedProgressRecord.progressValue >= snippetRule.requiredProgressValue
```

The helper must:

- treat `progressValue` as an integer point total, not a percentage;
- preserve values above the threshold without clamping or mutation;
- return `incomplete` when valid progress is below the explicit threshold;
- return `blocked` when the threshold authority is unavailable or invalid;
- never recalculate evidence deltas or apply progress.

### `consumedEvidenceIds`

Completion should read `consumedEvidenceIds` only as validated audit support for the applied progress record.

It must not:

- count ids as completion points;
- accept or reject evidence;
- infer evidence quality or occurrence equivalence;
- add, remove, reorder, or persist ids;
- require `consumedEvidenceIds.length === progressValue`;
- infer completion from a non-empty array.

The future helper should validate the supplied applied progress through the unchanged progress validator, including explicit accepted evidence and authorities needed by that validator. Invalid or unresolved consumed evidence blocks completion.

## 7. Reading Authored Snippet Progression Metadata

### `completionWeight`

Future posture:

- It is the authored aggregation contribution of a completed snippet.
- It applies only after that snippet has independently met its explicit snippet threshold.
- It is not a progress delta, percentage, snippet threshold, evidence weight, reward, or trial weight.
- A completed snippet with `completionWeight: 0` contributes zero aggregation weight and does not auto-complete a tier.

### `countsTowardTierCompletion`

Future posture:

- `true` allows a completed snippet's `completionWeight` to participate in its exact tier aggregation.
- `false` excludes the snippet from both the earned and available tier completion weight.
- A non-counting snippet may still be a completed snippet.
- A non-counting snippet must not be treated as incomplete merely because it is excluded from tier aggregation.
- The flag does not control snippet completion, domain completion directly, trial readiness, rewards, UI visibility, or ownership.

### `trialUnlockWeight`

`trialUnlockWeight` is outside completion ownership. The completion helper may carry it only as copied authored context if a later plan explicitly requires that projection. It must not sum, interpret, compare, or unlock anything from it.

## 8. Snippet Completion Decision

A snippet may be a completion candidate only when:

- one explicit applied progress record resolves to one active authored snippet;
- the progress owner and snippet/domain/subject snapshots pass the unchanged progress validator;
- the completion policy resolves exactly one valid snippet threshold;
- `progressValue` meets or exceeds that threshold.

The decision is:

- `candidate` when every authority is valid and the threshold is met;
- `incomplete` when every authority is valid and the threshold is not met;
- `blocked` when required authority or validation is missing, invalid, conflicting, planned, or unresolved.

A snippet decision must not write a `completed` field into progress, snippet content, evidence, owner state, save state, or any other record.

## 9. Tier Aggregation Boundary

Tier aggregation is owner-, domain-, and tier-scoped.

The exact group key is:

```text
ownerScope + ownerId + domainId + tier
```

For one requested tier:

- enumerate authored snippets in the exact active domain and exact tier;
- independently evaluate snippet completion for supplied applied progress;
- include only snippets with `countsTowardTierCompletion: true`;
- sum `completionWeight` for included completed snippets as `earnedCompletionWeight`;
- sum `completionWeight` for all included authored snippets as `availableCompletionWeight`;
- compare `earnedCompletionWeight` only to the explicit authored tier rule;
- return `blocked` when a required counting snippet lacks valid completion authority or applied-progress authority needed by the selected tier policy;
- return `blocked` when no counting weight or no tier rule exists rather than inventing an all-snippets or percentage rule.

Tier aggregation must not:

- cross owners, domains, or tiers;
- use non-counting snippets in numerator or denominator;
- use raw `progressValue` across snippets;
- use consumed-evidence counts;
- interpret `trialUnlockWeight`;
- infer completion because every currently authored snippet happens to be complete;
- unlock the next tier or any trial.

## 10. Domain Aggregation Boundary

Domain aggregation is owner- and domain-scoped.

The exact group key is:

```text
ownerScope + ownerId + domainId
```

Domain completion should consume completed-tier decisions, not raw progress values or a flat sum across all snippets.

The future helper must:

- require an explicit authored domain rule;
- evaluate only tiers named or deterministically selected by that rule;
- require each contributing tier decision to be valid and unblocked;
- keep active-domain authority fail-closed;
- return `blocked` when required tier content or policy is absent;
- keep domains independent.

Domain completion must not be inferred from:

- completion of all snippets currently present in a partial catalog;
- one completed tier;
- total snippet count;
- total progress points;
- total evidence count;
- registry wave, skill links, spell links, UI visibility, or trial metadata.

## 11. What Completion Must Not Do

The future completion helper must perform none of the following:

- no evidence acceptance;
- no progress initialization;
- no progress proposal or application;
- no storage or persistence;
- no completion-state write;
- no Knowledge trial unlock or readiness;
- no Skill Trial behavior;
- no Spell/Magic Study behavior;
- no UI or main-menu output;
- no runtime effect;
- no generated output;
- no event emission;
- no reward grant;
- no ownership mutation;
- no gameplay mutation;
- no Chronicle or Renown output;
- no schema, content, or validator repair.

Knowledge, Skill, and Spell/Magic Study trial families remain separate.

## 12. Proposed Future Helper Shape

Recommended path:

- `tools/content-lint/knowledge-completion.mjs`

Recommended public export:

```js
export function evaluateKnowledgeCompletion(inputs) {
  // Pure read-only completion decision.
}
```

The helper should be:

- pure and deterministic;
- in-memory and filesystem-free;
- immutable;
- explicit-input only;
- read-only;
- unregistered from normal content lint unless a separate run authorizes registration.

Conceptual explicit inputs:

- `relativePath`;
- one explicit completion target: snippet, tier, or domain;
- `appliedProgressWrapper`;
- `currentAcceptedEvidenceWrapper`;
- progress and evidence schemas;
- snippet and domain authorities;
- region and settlement authorities required by current validation;
- explicit completion-policy authority.

The helper must not call the producer, acceptance, initialization, evidence-to-progress, or progress-application helpers. It may call unchanged validators to fail closed.

## 13. Completion Decision Envelope

Recommended output:

```js
{
  decision: "candidate" | "incomplete" | "blocked",
  scope: "snippet" | "tier" | "domain",
  target: {
    ownerScope: "character",
    ownerId: "character.example",
    snippetId: "knowledge_snippet.flora.aloe.identification",
    domainId: "knowledge_domain.flora",
    tier: 1
  },
  observed: {
    progressValue: 0,
    consumedEvidenceIds: [],
    requiredProgressValue: null,
    earnedCompletionWeight: null,
    availableCompletionWeight: null,
    requiredCompletionWeight: null
  },
  issues: [],
  safety: {
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
  }
}
```

Fields that do not apply to the requested scope should be `null`, not inferred. Exact target subfields may be scope-specific in implementation, but unsupported fields and ambiguous targets should fail closed.

## 14. Decision And Issue Posture

- Validation, malformed invocation, missing authority, and ambiguous target problems produce `blocked` with deterministic issues.
- A valid target below an explicit threshold produces `incomplete` with no policy rejection.
- A valid target meeting an explicit threshold produces `candidate`.
- The helper must not throw for ordinary completion outcomes.
- Programming errors may still throw, following existing repository helper conventions.
- Input order must not change the result.
- Output must be a deep value copy or newly constructed projection and must share no mutable references with inputs.

## 15. Normal Content-Lint Posture

The first completion helper should not be registered in `tools/content-lint/index.mjs`.

Reasons:

- applied progress is not canonical authored content;
- no canonical completion-policy file exists;
- no canonical progress collection exists;
- registration could misrepresent test-only in-memory decisions as normal repository content validation.

Any later registration requires a separate authorization after canonical authored completion policy exists.

## 16. Future Focused Test Matrix

### Positive Completion Candidate Cases

- Aloe, Badger, Iron Ore, and Kaelvar snippet candidates with explicit thresholds;
- progress exactly equal to threshold;
- progress above threshold;
- completed counting snippet contributes its exact `completionWeight`;
- completed non-counting snippet remains a snippet candidate but contributes no tier weight;
- tier candidate under an explicit weight rule;
- domain candidate under an explicit required-tier rule;
- deterministic results under reordered input wrappers;
- input immutability and deep-copy output;
- exact safety flags.

### Incomplete Progress Cases

- valid zero-state progress below a positive threshold;
- valid positive progress below threshold;
- incomplete snippet contributes no earned tier weight;
- valid tier below explicit required weight;
- valid domain with an incomplete required tier.

### Non-Counting Authored Metadata Cases

- `countsTowardTierCompletion: false` excludes weight from numerator and denominator;
- non-counting snippet completion remains independently reportable;
- `completionWeight: 0` does not create positive tier credit;
- `trialUnlockWeight` has no effect on snippet, tier, or domain decisions.

### Invalid Or Missing Authority Cases

- missing, duplicate, malformed, zero, negative, fractional, or conflicting snippet threshold;
- missing or conflicting tier rule;
- missing or conflicting domain rule;
- invalid applied progress;
- unresolved or semantically invalid consumed evidence;
- progress/snippet target mismatch;
- inactive or planned domain;
- missing authored snippet;
- ambiguous target;
- unsupported input fields;
- attempted UI/runtime/storage/trial shortcut input.

### Aggregation Boundary Cases

- same tier across different owners remains separate;
- same tier number across different domains remains separate;
- different tiers in one domain remain separate until domain aggregation;
- non-counting snippets do not affect available weight;
- partial catalog does not imply domain completion;
- blocked required snippet blocks the selected strict tier policy;
- blocked required tier blocks domain completion;
- no cross-domain or cross-owner leakage;
- no raw progress or evidence-count aggregation.

### Safety Audits

- no producer, acceptance, initialization, proposal, or application helper invocation;
- no filesystem, clock, randomness, hidden counter, environment, or network access;
- no input mutation;
- no persistence or storage imports;
- no normal content-lint registration;
- no fixture requirement;
- no trial, Skill Trial, Spell/Magic Study, UI, runtime, generated-output, event, reward, ownership, or gameplay coupling.

## 17. Acceptance Criteria For A Later Implementation

`Version 0.5.x - Knowledge Completion Helper` is acceptable only when:

- the patch adds only the pure helper, focused tests, and required handoff documents;
- no schema, content JSON, validator, existing Knowledge helper, fixture, storage, persistence, UI, runtime, generated-output, event, reward, ownership, or gameplay file changes;
- the helper consumes explicit applied progress and explicit completion-policy authority;
- current progress validation remains unchanged and fail-closed;
- snippet thresholds are never inferred from `completionWeight`, evidence ids, or current examples;
- `completionWeight` and `countsTowardTierCompletion` follow this plan exactly;
- tier and domain aggregation remain owner- and scope-isolated;
- missing authority returns `blocked`;
- valid below-threshold input returns `incomplete`;
- valid threshold-satisfying input returns `candidate`;
- the exact safety flags are returned as `true`;
- the helper remains unregistered from normal content lint;
- focused tests cover every matrix in Section 16.

## 18. Relationship To Trials

Completion decisions are possible future inputs to a separately planned Knowledge Trial boundary. They do not create trial readiness.

- Knowledge trials must have their own eligibility, readiness, attempt, checkpoint, outcome, cooldown, and reward contracts.
- Skill Trials remain governed by the skill mastery trial lane.
- Spell/Magic Study remains a parallel study and acquisition-evidence lane.
- Shared vocabulary may be planned later, but ownership and behavior must remain separate.

## 19. Arcane Lore Posture

Arcane Lore remains blocked and deferred.

- `knowledge_domain.arcane_lore` is currently `planned`.
- No active Arcane Lore snippet exists in the current authored catalog.
- Skill metadata linking to Arcane Lore does not activate the domain.
- Spell ownership, spell observation, magic study, scroll/tome access, or Arcane Compendium visibility must not create Arcane Lore completion.
- Future Arcane Lore completion requires separate active-domain, snippet-authoring, validation, evidence, progress, threshold, and completion-policy authorization.

## 20. Risks And Deferred Work

- No canonical completion-policy schema or content path exists.
- Snippet, tier, and domain threshold values remain unauthored.
- No canonical accepted-evidence or applied-progress collection exists.
- Applied progress can be mistaken for persisted state.
- Character owner and canonical sequence authorities remain unresolved.
- Storage, persistence, concurrency, replay, and atomic evidence/progress commit remain deferred.
- Completion state storage, if ever needed, has no owner.
- Tier policy must later decide whether blocked optional snippets block aggregation or are excluded through explicit authored policy.
- Domain policy must later define required tiers without using the partial current catalog as authority.
- Trial readiness, UI projections, generated output, events, rewards, and gameplay integration remain deferred.
- Temporary Knowledge guardrail documents should be retained through the completion-helper run, then reviewed for consolidation, promotion, or removal.

## 21. Non-Goals And Forbidden Changes

This plan authorizes none of the following:

- no completion helper or test;
- no fixture or fixture loader;
- no completion-policy schema or JSON;
- no progress, evidence, snippet, registry, skill, spell, item, map, travel, settlement, or economy content edit;
- no schema, validator, or existing Knowledge helper edit;
- no normal content-lint registration;
- no storage, persistence, save, account, session, character, database, migration, or compatibility shape;
- no completion state;
- no trial readiness, unlock, attempt, checkpoint, cooldown, outcome, or reward;
- no Skill Trial behavior;
- no Spell/Magic Study behavior;
- no UI or main-menu work;
- no runtime or generated output;
- no events, Chronicle, Renown, rewards, ownership mutation, or gameplay behavior;
- no unrelated cleanup.

## 22. First Recommended Next Run

The next recommended run is:

`Version 0.5.x - Knowledge Completion Helper`

It should add only a pure deterministic in-memory helper and focused tests using explicit in-memory completion-policy authority. It must retain every boundary and acceptance criterion in this plan.
