# Knowledge Storage And Persistence Boundary Plan

Source version/run: Version 0.5.135 - Knowledge Storage And Persistence Boundary Plan
Date: 2026-06-12
Status: planning-only knowledge acceptance, storage, and persistence boundary

## 1. Purpose And Status

This document defines the future boundary between Knowledge evidence candidates, accepted evidence, rejected candidates, persisted evidence, progress proposals, and applied progress mutations. It also defines the responsibilities that a future storage owner, sequence authority, and acceptance operation must satisfy before any Knowledge state is created or changed.

This run is documentation only. It implements no evidence collection, progress collection, storage path, fixture catalog, acceptance helper, mutation helper, persistence adapter, save shape, account shape, session shape, database table, migration, runtime wiring, normal content-lint registration, generated output, UI, completion rules, trials, rewards, events, ownership changes, or gameplay behavior.

## 2. Current State Recap

The current Knowledge foundation is:

- Authored snippets exist and are structurally and semantically validated.
- The strict evidence record schema and pure evidence semantic helper exist.
- The strict progress record schema and pure progress semantic helper exist.
- The evidence-to-progress helper returns an inert proposal for one existing progress record.
- The observation producer returns a validated evidence candidate only.
- Producer output is not accepted evidence merely because it passes current schema and semantic validation.
- Proposal output does not create, update, consume, or persist progress.
- No accepted evidence collection exists.
- No progress collection exists.
- No acceptance sequence, storage owner, save/session placement, database representation, runtime integration, or UI exists.

The current helpers are pure and in-memory. Their focused fixtures demonstrate contracts; they are not canonical state or persistence.

## 3. Boundary Terminology

- **Candidate evidence:** a producer result that has the structural and semantic shape of evidence but has not crossed an owning acceptance boundary.
- **Accepted evidence:** candidate evidence that an authorized future acceptance operation has validated against current state, owner authority, sequence authority, duplicate/replay policy, and storage policy.
- **Rejected candidate:** candidate evidence that the acceptance operation refuses. Rejection must be deterministic for the same authoritative inputs and must not mutate evidence or progress state.
- **Persisted evidence:** accepted evidence durably recorded by the selected storage owner. Acceptance and persistence may be one atomic operation, but the terms are not interchangeable.
- **Progress record:** the current character-scoped summary for one snippet under `knowledge_progress.schema.json`.
- **Progress proposal:** the inert output of the current evidence-to-progress helper. It describes eligible evidence, delta, consumed ids, and a proposed update sequence without applying them.
- **Applied progress mutation:** an authorized state transition that has committed the approved proposal to the owning progress collection.
- **Storage owner:** the future component or state boundary authorized to retain evidence and progress records and enforce collection invariants.
- **Sequence authority:** the future component that assigns or validates monotonic ordering values for accepted evidence and applied progress updates.
- **Replay:** resubmission or reprocessing of a previously handled occurrence, candidate, accepted record, or operation.
- **Duplicate:** a conflict under a defined identity rule, including repeated `evidenceId`, repeated `progressId`, repeated owner/snippet progress identity, or repeated consumed evidence.
- **Occurrence identity:** the stable producer-owned identity of the real action, observation, travel event, or other source occurrence from which candidate evidence was derived.

Candidate evidence is not accepted evidence. Accepted evidence is not necessarily persisted evidence until the selected storage owner commits it. A progress proposal is not an applied progress mutation. Duplicate evidence identity is distinct from two different evidence ids that claim the same occurrence.

## 4. Storage Ownership Decision

Canonical storage ownership remains deferred.

Candidate future locations include:

- character data inside a save or authoritative session state;
- a character-scoped runtime collection later serialized by a save owner;
- account data, only if a later ownership plan explicitly changes the current character-only boundary;
- a database collection or table under a future server or persistence owner;
- a test-only fixture catalog used to exercise acceptance contracts without becoming runtime state.

The following are not selected:

- a save-file field;
- a session-state field;
- an account field;
- a character record field;
- a runtime singleton or global collection;
- a database table or repository;
- a production fixture path.

Authored content JSON is inappropriate for evidence or progress because these records are mutable, owner-specific state. Registering them as base content would confuse authored definitions with per-character history, imply normal content-lint ownership, and create invalid lifecycle and packaging semantics.

The next step after this plan should remain documentation-first unless a later prompt explicitly authorizes a narrow pure helper. No canonical state path should be inferred from existing in-memory test fixtures.

## 5. Acceptance Boundary

A future acceptance operation should conceptually perform these steps:

1. Receive one producer candidate plus explicit current evidence and progress state.
2. Validate the candidate through the current evidence schema and semantic helper.
3. Resolve the authoritative character owner rather than relying only on the current id pattern.
4. Validate or assign the acceptance sequence through the selected sequence authority.
5. Check duplicate `evidenceId`, occurrence replay, and any selected occurrence-equivalence policy.
6. Decide whether the candidate is rejected, accepted without immediate progress application, or accepted with an authorized progress proposal.
7. If progress is considered, call the current proposal helper only against one existing valid target progress record.
8. Validate the proposed next progress record before application.
9. Commit the accepted evidence and any authorized progress mutation under the selected atomicity policy.
10. Return a deterministic accepted/rejected result with no hidden side effects.

This sequence is a future contract, not an implementation. The operation must not treat producer validation as acceptance, must not let UI code own acceptance, and must not silently store evidence or mutate progress.

## 6. Evidence Collection Boundary

A future evidence collection should:

- store records that conform to `knowledge_evidence.schema.json`;
- enforce unique `evidenceId` values within the owning scope;
- preserve explicit character owner, snippet, domain, subject, source, acquisition context, and sequence snapshots;
- reject structurally or semantically invalid records;
- keep evidence separate from authored snippet and domain content;
- expose enough current state for duplicate, replay, and progress-consumption decisions;
- define whether accepted but not yet durable records can exist.

The collection should not embed progress records, completion state, trial state, UI state, rewards, or authored content.

This plan defers:

- canonical path and wrapper;
- initialization and empty-state representation;
- indexing strategy;
- migration policy;
- save serialization;
- database representation;
- retention and pruning;
- cross-save or cross-character transfer.

## 7. Progress Collection Boundary

A future progress collection should:

- store records that conform to `knowledge_progress.schema.json`;
- enforce unique `progressId` values;
- enforce at most one current record for each character owner and snippet;
- retain unique `consumedEvidenceIds`;
- permit updates only through an explicitly authorized flow;
- preserve an explicit `updatedSequence`;
- reject invalid proposed or applied records;
- remain separate from authored snippet and domain content.

The collection must not infer progress from evidence count, accept arbitrary direct edits, or permit the same evidence id to be credited across multiple current progress records.

This plan defers:

- canonical path and wrapper;
- initialization policy;
- zero-state persistence policy;
- indexing strategy;
- migration policy;
- save serialization;
- database representation;
- historical revisions or audit-log shape.

## 8. Atomicity Boundary

The central risk is divergence: evidence may be accepted while progress fails to update, or progress may consume evidence that was not durably accepted.

Candidate future models are:

- accept and persist evidence first, then apply progress later;
- atomically commit evidence and progress together;
- enqueue an accepted-evidence operation for a later progress consumer;
- rebuild progress deterministically from accepted evidence.

Initial recommendation:

- Do not apply progress until an explicit storage owner and acceptance operation exist.
- When evidence and progress share one transactional owner, prefer one atomic commit.
- When one transaction is unavailable, use persisted accepted evidence as the durable fact and make progress application replayable, idempotent, and traceable.
- Evidence-only acceptance is allowed only when the state explicitly records that progress is pending or intentionally not applicable.
- Never mark evidence consumed when its accepted record was not committed.
- Never silently discard a failed progress application.

The exact transaction, queue, journal, or rebuild mechanism remains deferred.

## 9. Duplicate, Replay, And Occurrence Identity

Initial future posture:

- Reusing an existing `evidenceId` must be idempotent only when the submitted record is exactly equivalent to the already accepted record; otherwise it must be rejected as an identity conflict.
- Replaying a previously rejected candidate against unchanged authoritative inputs should produce the same rejection.
- Replaying a previously applied progress operation must not increase `progressValue` or append consumed evidence again.
- An evidence id already present in `consumedEvidenceIds` must not be consumed again.
- Producer-issued occurrence identity remains the source occurrence key.
- Different evidence ids that claim the same occurrence require an authority-level equivalence check before both can be accepted or credited.

The current producer's deterministic evidence id reduces accidental replay but does not by itself prove global occurrence uniqueness. The future acceptance owner must decide which occurrence namespace is authoritative and whether one occurrence may produce more than one snippet-targeted evidence record.

This plan defers anti-farming rules, cooldowns, diminishing returns, repeat windows, occurrence aggregation, source-specific equivalence, and cross-producer deduplication.

## 10. Sequence Authority

`acquiredSequence` and `updatedSequence` require a persisted authority.

Current posture:

- The producer requires an explicit non-negative integer sequence but does not own or generate it.
- The proposal helper derives a proposed update sequence only from explicit evidence and progress values.
- Neither helper establishes monotonicity across accepted state.
- Filesystem order, wall-clock time, randomness, process-global counters, and UI order must not become sequence authority.

Candidate future authorities include:

- a save-local event sequence;
- a character-local mutation sequence;
- an authoritative session event sequence;
- a server or database-issued sequence.

The selected authority must define scope, monotonicity, replay behavior, collision handling, restoration after load, and relationship between acquisition and update ordering. This plan does not implement or select one.

## 11. Character And Owner Authority

The current schemas and helpers enforce character-only scope, but `ownerId` remains pattern-only.

The future acceptance boundary should resolve the owner through an authoritative character identity supplied by the selected runtime/save/session owner. It must not infer character ownership from account, family, UI selection, location, institution, or producer context.

This plan does not authorize:

- family or account evidence sharing;
- inherited knowledge;
- cross-character progress;
- account-wide progress;
- settlement or institution ownership;
- owner aliases or migration mappings.

A character-scoped placement inside a future save or authoritative session is conceptually compatible with the current boundary, but no field, registry, or persistence contract is selected here.

## 12. Progress Record Initialization

The current proposal helper requires one existing progress record. The missing-record case is unresolved.

Candidate policies are:

- initialize a record when the first evidence is accepted;
- initialize all eligible snippet records at character creation;
- lazily initialize through a dedicated explicit operation;
- derive zero state without storing a record until positive progress exists.

Focused tests currently permit explicit zero-state fixtures, but that posture does not select runtime storage behavior.

Initialization must be a separate dedicated plan because it owns stable `progressId` construction, initial `updatedSequence`, notes policy, snippet eligibility, duplicate creation, and interaction with evidence acceptance. This plan does not choose or implement an initialization policy.

## 13. Existing Helper Integration Boundary

The future conceptual pipeline is:

1. Observation or other authorized producer proposes candidate evidence.
2. The current evidence schema and semantic helper validate the candidate.
3. The future acceptance boundary resolves owner, sequence, duplicate, replay, and storage decisions.
4. The candidate is rejected or becomes accepted evidence.
5. If an existing progress record is eligible, the current evidence-to-progress helper proposes a change.
6. The proposed progress record is validated through the current progress helper.
7. The future mutation owner applies or rejects the proposal under the selected atomicity policy.
8. The storage owner persists the authorized result.

This pipeline is not currently wired. Existing helpers remain pure, unregistered, filesystem-free, and unchanged.

## 14. Content Lint Boundary

Authored snippets and domains remain normal content-lint inputs.

Evidence and progress are future mutable state and must not be added to normal content lint merely because their record schemas and pure validators live under content-lint tooling. A test-only fixture catalog may call those helpers in focused tests, but it must not become base content, a packaged content collection, or evidence of runtime persistence.

Normal lint registration requires a separately approved canonical authored or fixture path and must not be inferred from this plan.

## 15. Completion, Trials, UI, Generated Output, And Runtime Boundaries

Accepted or persisted evidence does not by itself:

- complete a snippet or domain;
- unlock or resolve a trial;
- grant a reward;
- emit Chronicle or Renown events;
- reveal UI;
- update generated output;
- change skills, spells, inventory, maps, travel, economy, or combat;
- create account, family, or Legacy state.

Progress mutation remains distinct from completion policy. UI must eventually consume an authorized projection rather than mutate raw collections. Runtime wiring, command handling, event emission, generated output, and gameplay behavior all remain deferred.

## 16. Immediate Next Recommended Run

The exact next run should be:

- `Version 0.5.136 - Knowledge Storage Fixture Boundary Plan`

That run should be documentation only. It should define a test-only fixture contract for evidence and progress collections, exact wrapper posture, fixture identity, authority inputs, positive/negative scenarios, and how fixture data remains isolated from runtime content and persistence.

It should not create fixture files, production storage, save/account/session/database state, normal lint registration, acceptance mutation, progress initialization, or runtime wiring unless a later prompt explicitly authorizes a narrower implementation.

## 17. Future Focused Test Plan

Later implementation phases should add focused tests for:

- exact accepted-evidence collection wrapper;
- exact progress collection wrapper;
- unique evidence and progress ids;
- one progress record per character/snippet;
- candidate validation before acceptance;
- deterministic rejection without mutation;
- exact replay of an accepted evidence id;
- conflicting reuse of an evidence id;
- different evidence ids claiming one occurrence;
- already-consumed evidence replay;
- progress proposal validation before apply;
- atomic evidence/progress success;
- progress failure without false evidence consumption;
- evidence-only pending posture when explicitly allowed;
- idempotent retry after partial infrastructure failure;
- sequence monotonicity and collision rejection;
- owner authority mismatch;
- missing progress-record behavior under the separately selected initialization policy;
- input immutability for pure planning and proposal layers;
- absence of normal lint, UI, generated-output, completion, trial, reward, and gameplay coupling.

## 18. Acceptance Criteria For Future Boundary Implementation

A future acceptance/storage implementation is acceptable only when:

- one explicit storage owner is selected;
- one explicit character authority is selected;
- one explicit sequence authority is selected;
- canonical evidence and progress collection contracts are documented;
- candidate, accepted, rejected, persisted, proposed, and applied states remain distinct;
- evidence and progress records pass current structural and semantic validation;
- duplicate identity and occurrence replay behavior are deterministic;
- progress application is atomic with evidence or explicitly replayable and idempotent;
- no evidence is marked consumed before its accepted record is durable;
- missing progress-record behavior follows a separately approved initialization contract;
- all mutation is owned outside producer, validator, proposal, UI, and authored-content layers;
- focused tests cover success, rejection, replay, conflict, and partial-failure cases;
- no completion, trials, rewards, UI, generated output, unrelated runtime, or broader ownership behavior is bundled.

## 19. Future Implementation Sequence

Recommended order:

1. `Version 0.5.135 - Knowledge Storage And Persistence Boundary Plan` - this document.
2. `Version 0.5.136 - Knowledge Storage Fixture Boundary Plan`.
3. `0.5.x - Knowledge Progress Record Initialization Plan`.
4. `0.5.x - Knowledge Evidence Acceptance Helper Plan`.
5. `0.5.x - Knowledge Evidence Acceptance Helper`.
6. `0.5.x - Knowledge Completion Rules Plan`.
7. `0.5.x - Knowledge Trials Plan`.
8. `0.5.x - Knowledge UI Plan`.
9. Later guardrail consolidation or cleanup after storage, acceptance, and initialization authorities are stable.

Each item remains a separate scoped run.

## 20. Risks And Deferred Work

- No canonical evidence or progress storage owner exists.
- No canonical save, session, account, character, runtime, or database path exists.
- Character owner authority remains pattern-only.
- Acquisition and update sequence authorities remain undefined.
- Progress-record initialization remains undefined.
- Occurrence equivalence across different evidence ids remains undefined.
- Anti-farming, cooldown, repeatability, stacking, and diminishing-return policy remain undefined.
- Atomic evidence/progress handling is not implemented.
- Partial-failure recovery, replay logs, and audit history remain undefined.
- Zero-state persistence policy remains undefined.
- Family/account sharing and cross-character behavior remain blocked.
- Completion, trials, rewards, UI, generated output, runtime wiring, and gameplay behavior remain deferred.
- Arcane Lore remains blocked while its domain and snippet route are not active.
- Existing evidence, progress, proposal, and producer plans should be retained through the fixture, initialization, and acceptance planning sequence; cleanup is deferred until their remaining rules are promoted or superseded.

## 21. Non-Goals And Forbidden Changes

This planning run authorizes none of the following:

- No evidence or progress collection implementation.
- No evidence or progress fixture file.
- No acceptance or mutation helper.
- No storage or persistence adapter.
- No save, account, session, character, or database state.
- No migration or compatibility behavior.
- No schema edits.
- No validator edits.
- No producer edits.
- No evidence-to-progress proposal edits.
- No focused test edits.
- No normal content-lint registration.
- No snippet or registry content edits.
- No skill or spell edits.
- No runtime wiring, commands, events, or gameplay behavior.
- No completion math, trials, rewards, Chronicle, Renown, or Legacy behavior.
- No generated output.
- No UI or main-menu work.
- No unrelated cleanup or guardrail deletion.
