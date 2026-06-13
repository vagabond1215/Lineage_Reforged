# Knowledge Progress Application Plan

Source version/run: Version 0.5.141 - Knowledge Progress Application Plan
Date: 2026-06-13
Status: planning-only progress-application boundary

## 1. Purpose And Status

This document defines the future pure boundary for applying one inert Knowledge evidence-to-progress proposal to one existing Knowledge progress record.

This run is documentation only. It implements no application helper, fixture file, fixture loader, progress or evidence JSON state, storage, persistence, save/session/database shape, runtime integration, migration, normal content-lint registration, schema edit, validator edit, evidence/progress/proposal/producer/initialization/acceptance helper edit, UI, generated output, completion, trial, event, reward, ownership mutation, Skill Trial behavior, Spell/Magic Study behavior, or gameplay behavior.

## 2. Current State Recap

The current Knowledge foundation provides:

- authored snippets and a broad domain registry with structural and semantic validation;
- a strict evidence schema and pure evidence semantic validator;
- a pure observation evidence producer that returns candidate evidence only;
- a pure evidence acceptance helper that returns inert accepted-evidence decisions only;
- a strict progress schema and pure progress semantic validator;
- a pure progress initialization helper that proposes explicit zero-state progress only;
- a pure evidence-to-progress helper that returns inert progress proposals;
- a storage and persistence boundary plan;
- a storage fixture boundary plan that recommends future fixtures but creates none.

The repository does not provide:

- an accepted-evidence collection;
- a progress collection;
- a progress application helper;
- a canonical character owner authority;
- a canonical acquisition or update sequence authority;
- canonical storage or persistence ownership;
- completion, Knowledge trial, Skill Trial, Spell/Magic Study trial, UI, generated-output, or runtime mutation behavior.

Current evidence and progress records are in-memory focused-test values. They are not canonical or persisted state.

## 3. Application Problem Statement

The evidence-to-progress helper returns an inert proposal. Its `proposedProgressRecord`, accepted ids, deltas, and sequence are not applied state.

The remaining gap is explicit application:

- accepted evidence may be eligible for progress but does not mutate progress;
- initialized zero-state progress may exist but does not consume evidence;
- a proposal must be checked against the exact current progress snapshot;
- accepted-evidence posture must be explicit;
- duplicate consumption must be rejected;
- the proposed sequence must be checked;
- the resulting record must pass the current progress validator.

Application must not be hidden inside the producer, evidence validator, evidence acceptance helper, progress validator, progress initialization helper, evidence-to-progress helper, UI, normal content lint, or passive runtime state.

## 4. Application Terminology

- **Progress proposal:** the inert output from `proposeKnowledgeProgressFromEvidence(...)`.
- **Applied progress:** a validated next progress value returned by the future application helper.
- **Application operation:** one explicit request to evaluate and apply one proposal to one current progress target.
- **Application candidate:** the supplied current progress state, proposal envelope, accepted evidence, and authorities considered together.
- **Applied progress record:** the immutable schema-compatible next record returned after successful application.
- **Consumed evidence:** accepted evidence ids already credited in current or successfully applied progress.
- **Pending evidence:** accepted evidence that has not yet been credited to progress.
- **Duplicate consumption:** an attempted application of an id already consumed by the current target, another supplied current record, or more than once in the proposal.
- **Application sequence:** the proposal's explicit `updatedSequence` accepted for the next record.
- **Application envelope:** the inert applied/rejected decision returned by the helper.
- **Application safety flags:** explicit true-valued claims that the helper performed no mutation, persistence, acceptance, initialization, completion, trial, UI, runtime, or generated-output behavior.

Proposed progress is not applied progress. Applied progress is not persisted progress until a storage owner commits it. Application does not accept evidence, initialize missing progress, complete snippets, or unlock trials.

## 5. Recommended First Helper Posture

The first future helper should be pure, deterministic, in-memory, filesystem-free, and unregistered.

It should:

- apply one inert proposal to one existing progress target;
- validate current and applied progress through the unchanged current progress validator;
- require explicit accepted evidence matching every proposed accepted id;
- return a deep copied applied record or deterministic rejection;
- leave all inputs unchanged.

It must not persist, initialize progress, call the evidence acceptance helper, call the evidence producer, call the evidence-to-progress helper, create UI/runtime/generated output, or register with normal content lint.

## 6. Input Authority

The first helper should receive explicit:

- `relativePath`;
- `targetProgressId`;
- `currentProgressWrapper`;
- one inert `proposal`;
- `currentAcceptedEvidenceWrapper`;
- the progress and evidence schemas;
- snippet, domain, region, and settlement authorities required by the current validators.

The helper should not call the evidence-to-progress helper. It consumes and verifies its output.

Application must not be inferred from evidence presence, UI, location, inventory, skills, spells, account, family, institution, session, runtime state, fixture order, or file order. The helper must not read files.

## 7. Proposal Authority

The proposal must match the current evidence-to-progress envelope:

```text
acceptedEvidenceIds
rejectedEvidence
proposedProgressRecord
deltaTotal
appliedDeltas
issues
safety
```

The first application helper should reject a proposal when:

- the envelope is missing, malformed, or has unsupported fields;
- `issues` is non-empty;
- `proposedProgressRecord` is absent;
- `acceptedEvidenceIds` is empty, duplicated, or not in deterministic ascending order;
- `deltaTotal` is not a positive integer equal to the number of accepted ids;
- `appliedDeltas` is not exactly one `+1` entry per accepted id and target;
- the target differs from current progress;
- the proposal does not represent current progress plus its exact accepted ids;
- an accepted id was already consumed;
- the proposal claims mutation or persistence.

`rejectedEvidence` may describe candidates that received no credit. It must not affect application.

## 8. Current Progress Authority

Current progress must be supplied explicitly as a wrapper containing exactly one selected target and any additional current records needed for collection-level consumption checks.

The wrapper must validate through `validateKnowledgeProgress(...)` with the supplied accepted evidence and current authorities. `allowZeroStateRecords: true` is required so explicit zero-state targets remain valid.

The selected `targetProgressId` must resolve exactly once. Missing progress is an initialization concern. Invalid progress blocks application. The helper must not repair or create progress.

## 9. Accepted Evidence Relationship

Application may consume only evidence present in the explicit `currentAcceptedEvidenceWrapper`.

The helper should validate that wrapper through the unchanged evidence validator with empty records allowed, then require every `proposal.acceptedEvidenceIds` entry to resolve exactly once in it.

Acceptance helper output may be used by a future caller to construct accepted in-memory state, but the application helper must not call acceptance. Candidate evidence and merely validated but unaccepted evidence must not be consumed.

The proposal helper has already checked eligibility. Application verifies that every credited id remains present in accepted state and retains exact owner and target parity; it does not repeat source eligibility or delta calculation.

## 10. Target Parity

Current progress, proposed progress, applied deltas, and every consumed accepted evidence record must agree on:

- `ownerScope`;
- `ownerId`;
- `snippetId`;
- `domainId`;
- `subjectType`;
- `subjectId`.

Any mismatch rejects deterministically. Cross-owner, cross-snippet, cross-domain, cross-subject-type, and cross-subject application are forbidden.

The proposed and current records must also retain the same `progressId`.

## 11. progressValue Policy

The first application helper should accept only:

```text
proposedProgressRecord.progressValue =
  currentProgressRecord.progressValue + proposal.deltaTotal
```

The current proposal helper supplies one positive integer point per eligible evidence id. Application must not recompute or broaden that math.

Application must not use `completionWeight`, `trialUnlockWeight`, percentages, thresholds, tiers, negative progress, fractional deltas, arbitrary caller-supplied values, caps, decay, or weighting.

## 12. consumedEvidenceIds Policy

The first application should require:

```text
proposedProgressRecord.consumedEvidenceIds =
  currentProgressRecord.consumedEvidenceIds + proposal.acceptedEvidenceIds
```

The existing order of consumed ids is preserved. New ids retain the current proposal helper's deterministic ascending order.

Application rejects:

- duplicate proposed ids;
- ids already consumed by the target;
- ids consumed by another record in the supplied current progress wrapper;
- ids absent from explicit accepted evidence;
- any proposed replacement, removal, or reordering of existing consumed ids.

When the full current collection is not supplied, cross-record consumption outside the supplied wrapper cannot be proved. A future storage owner must repeat collection-level checks at commit time.

## 13. updatedSequence Policy

The first application should use exactly `proposal.proposedProgressRecord.updatedSequence`.

It must be a non-negative integer and, because the first application requires a positive delta, must be strictly greater than `currentProgressRecord.updatedSequence`.

Application does not recalculate the proposal helper's `max(current, accepted evidence sequences) + 1` rule. It verifies that every applied evidence record is the accepted record used by the proposal posture and that the supplied next sequence is monotonic.

No wall clock, filesystem order, randomness, hidden counter, UI order, fixture order, or array order may provide sequence authority. Canonical sequence ownership remains deferred.

## 14. Notes Policy

The first application helper should preserve `proposal.proposedProgressRecord.notes` exactly.

The current proposal helper already preserves the current progress notes. Adding an application note would make the applied record differ from the validated proposal, create duplicate-note edge cases, and introduce application metadata without a durable audit contract.

Therefore the first helper must require proposed notes to equal current notes and must not append or replace notes. Future deterministic application audit notes require a separate schema, proposal, and persistence decision.

Notes must not claim persistence, completion, trial readiness, UI reveal, reward, event emission, runtime mutation, or generated output.

## 15. Applied Progress Output Record

On success, `appliedProgressRecord` should be a deep value copy of `proposal.proposedProgressRecord`.

It must:

- contain exactly the live progress schema fields;
- pass the unchanged progress schema and semantic validator;
- preserve target identity and notes;
- contain the verified progress value, consumed ids, and sequence;
- add no storage metadata, timestamp, transaction id, application id, UI/runtime/generated-output field, completion field, or trial field.

The returned copy is eligible for a future storage owner to consider. It is not persisted state.

## 16. Application Envelope

The recommended stable output is:

```js
{
  decision: "applied" | "rejected",
  appliedProgressRecord: object | null,
  rejectedApplication: {
    targetProgressId: string | null,
    code: string,
    reason: string
  } | null,
  consumedEvidenceIdsApplied: string[],
  issues: Array<{ code: string, message: string }>,
  safety: {
    noMutation: true,
    noPersistence: true,
    noEvidenceAcceptance: true,
    noProgressInitialization: true,
    noCompletion: true,
    noTrialUnlock: true,
    noUiOutput: true,
    noRuntimeEffect: true,
    noGeneratedOutput: true
  }
}
```

Invocation and authority failures use `issues`. A structurally valid application candidate rejected by application policy uses `rejectedApplication`. Exact names may remain implementation-local, but stable names are recommended.

## 17. Relationship To Evidence-To-Progress Helper

The evidence-to-progress helper owns evidence eligibility, deterministic ordering, one-point deltas, and proposal construction.

The application helper consumes that proposal. It must not:

- call or edit the proposal helper;
- recreate source eligibility;
- broaden source, target, order, or delta rules;
- infer additional eligible evidence;
- apply rejected evidence.

It must reject malformed, stale, or mismatched proposals.

## 18. Relationship To Progress Validator

`validateKnowledgeProgress(...)` remains the shape and semantic authority.

The application helper should delegate:

- current wrapper validation before policy evaluation;
- a cloned wrapper with the selected target replaced by the proposed record after policy evaluation.

The full replacement wrapper allows the unchanged validator to retain duplicate progress identity and cross-record consumed-evidence checks.

The application helper must not edit validator behavior, repair invalid progress, weaken target parity, or weaken duplicate-consumption checks.

## 19. Relationship To Progress Initialization Helper

Initialization proposes one missing zero-state target. Application requires an existing target.

The application helper must not call initialization. A missing target remains a separate explicit initialization operation, and `first_evidence` initialization remains deferred.

Initialization output must be accepted into whatever future current-progress state owner exists before an application operation may use it.

## 20. Relationship To Evidence Acceptance Helper

Acceptance changes one candidate into an inert accepted-evidence decision. Application does not accept evidence and must not call the acceptance helper.

A future caller may use accepted output to construct explicit accepted in-memory state. The application helper then verifies proposal ids against that state.

A future storage owner must coordinate accepted-evidence append and progress application atomically or through replayable, idempotent operations. This plan does not select that mechanism.

## 21. Relationship To Storage And Persistence

Applied by the helper does not mean persisted.

A future storage owner must decide:

- durable progress collection placement;
- stale-snapshot and concurrency handling;
- commit-time duplicate checks;
- canonical sequence authority;
- atomic evidence append and progress update;
- retry and replay behavior.

This plan selects no save, session, account, character, database, repository, migration, compatibility, or transaction shape. The helper remains unregistered from normal content lint.

## 22. Relationship To Fixtures

The future fixture boundary may later include application examples, but fixtures remain test inputs rather than runtime storage.

Potential separately authorized fixture scenarios include:

- accepted evidence plus initialized zero-state progress plus a matching proposal;
- duplicate consumed evidence rejection;
- target mismatch rejection;
- an applied progress preview.

No fixture file, directory, loader, or adapter is created by this run or required for the first helper's inline focused tests.

## 23. Relationship To Completion, Trials, UI, Generated Output, And Runtime

Applied progress is not completion and is not trial readiness.

It does not:

- unlock Knowledge, Skill, or Spell/Magic Study trials;
- emit Chronicle or Renown events;
- change UI, main-menu state, codex entries, map pins, notifications, or generated output;
- grant rewards or ownership;
- change skills, spells, inventory, combat, travel, economy, world, or gameplay state.

Future UI must consume authorized read-only projections. Knowledge, Skill, and Spell/Magic Study trial families remain separate.

## 24. Future Helper Shape

The recommended paths are:

- `tools/content-lint/knowledge-progress-application.mjs`;
- `tests/unit/knowledge-progress-application.test.mjs`.

Recommended public export:

```js
export function proposeKnowledgeProgressApplication(inputs) {
  // Pure application decision.
}
```

The helper should accept the explicit inputs in Section 6 and return the envelope in Section 16.

It must not read or write files, persist, call the producer, call evidence acceptance, call progress initialization, call evidence-to-progress proposal, mutate inputs, create evidence, initialize progress, complete snippets, unlock trials, or emit UI/runtime/generated output.

## 25. Future Helper Focused Test Plan

Positive cases:

- apply one Aloe proposal to initialized zero-state Aloe progress;
- apply matching Badger, Iron Ore, and Kaelvar proposals;
- apply multiple eligible evidence ids deterministically;
- preserve all target fields and `progressId`;
- increment `progressValue` by the exact proposal delta;
- append consumed ids in current proposal order;
- accept a strictly increasing proposed `updatedSequence`;
- preserve notes exactly;
- validate the replacement wrapper through the unchanged progress helper;
- leave proposal, progress, evidence, schemas, and authorities unchanged;
- return deterministic envelope and complete safety flags;
- prove no producer, acceptance, initialization, or proposal-helper invocation.

Negative cases:

- reject missing current progress;
- reject invalid current progress;
- reject missing or malformed proposal;
- reject non-empty proposal issues;
- reject target or `progressId` mismatch;
- reject stale proposal current-state assumptions;
- reject already consumed or duplicate proposed evidence ids;
- reject cross-record consumption within the supplied wrapper;
- reject absent accepted evidence;
- reject zero, negative, fractional, or inconsistent delta;
- reject sequence equality, regression, or invalid sequence;
- reject proposed value, consumed-id, notes, or target drift;
- reject an applied replacement wrapper that fails current progress validation;
- reject passive UI, location, inventory, skill, spell, account, family, institution, session, or runtime inputs;
- prove no filesystem, clock, randomness, hidden counter, normal-lint registration, mutation, persistence, fixture, completion, trial, UI, runtime, or generated-output coupling.

## 26. Acceptance Criteria For Future Implementation

`Version 0.5.142 - Knowledge Progress Application Helper` is acceptable only when:

- only the pure helper, focused tests, and normal handoff documents change;
- the helper is deterministic, in-memory, filesystem-free, immutable, and unregistered;
- no storage, persistence, or fixture files are added;
- no existing schema, validator, producer, initializer, acceptance, or proposal behavior changes;
- current and applied progress validate through the unchanged progress helper;
- explicit accepted evidence resolves every applied id;
- proposal target and current-state parity are enforced;
- duplicate consumed evidence rejects;
- positive delta and strict sequence monotonicity are enforced;
- notes remain exactly proposal-authored;
- no evidence acceptance, progress initialization, completion, trial, UI, runtime, generated-output, or gameplay behavior is added.

## 27. First Recommended Next Run

The exact next run is:

`Version 0.5.142 - Knowledge Progress Application Helper`

Scope:

- add only the pure application helper and focused unit tests;
- use inline in-memory inputs;
- validate current and applied wrappers through existing helpers;
- add no storage, persistence, fixtures, runtime, UI, completion, trials, evidence acceptance, progress initialization, or normal content-lint registration.

## 28. Future Implementation Sequence

Recommended order:

1. Knowledge Progress Application Plan.
2. Knowledge Progress Application Helper.
3. Knowledge Completion Rules Plan.
4. Knowledge Completion Helper.
5. Knowledge Trial Boundary Plan.
6. Knowledge Trial Schema Plan.
7. Knowledge Trial Checkpoint Helper.
8. Skill Trial Schema Expansion Plan.
9. Skill Trial Checkpoint Outcome Helper.
10. Skill Trial Cooldown/Readiness Helper.
11. Magic Study Event Boundary Plan.
12. Magic Study Source Plan.
13. Magic Study Checkpoint Helper.
14. Known-Spell Acquisition Evidence Integration Plan.
15. Shared Trial Vocabulary / Envelope Plan.
16. Trial UI Presentation Plan.

Each item requires a separately scoped run. Shared vocabulary must not merge Knowledge, Skill, and Spell/Magic Study progression ownership.

## 29. Risks And Deferred Work

- An application helper could be mistaken for persistence.
- Accepted-evidence and progress collections remain unresolved.
- Character owner authority remains pattern-only.
- Canonical sequence authority remains unresolved.
- Occurrence equivalence across distinct evidence ids remains unresolved.
- Storage-level idempotent replay remains unresolved.
- Atomic evidence append and progress application are deferred.
- Storage, persistence, concurrency, rollback, and recovery remain unresolved.
- Completion, trials, UI, generated output, and runtime integration remain deferred.
- Arcane Lore remains blocked while its domain is planned and no active snippet route exists.
- Knowledge, Skill, and Spell/Magic Study trials remain separate and deferred.
- A cleanup decision remains necessary for temporary Knowledge guardrail documents after application planning and implementation consume or promote their remaining guidance.

## 30. Non-Goals And Forbidden Changes

This plan authorizes none of the following:

- no application implementation or helper creation;
- no fixture file, directory, loader, adapter, or fixture implementation;
- no storage or persistence implementation;
- no progress initialization helper changes;
- no evidence acceptance helper changes;
- no evidence-to-progress helper changes;
- no producer implementation changes;
- no progress helper changes;
- no evidence helper changes;
- no evidence or progress JSON, content, state, or canonical collection;
- no save, account, session, character, database, transaction, migration, or compatibility shape;
- no normal content-lint registration;
- no schema changes;
- no authored snippet, registry, skill, spell, item, document, domain, map, settlement, travel, or economy content changes;
- no runtime;
- no UI or main-menu;
- no generated output;
- no completion;
- no Knowledge, Skill, or Spell/Magic Study trial implementation;
- no events, rewards, ownership mutation, or gameplay behavior;
- no unrelated cleanup.
