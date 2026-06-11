# Knowledge Evidence-to-Progress Rules Plan

Source version/run: Version 0.5.131 - Knowledge Evidence-to-Progress Rules Plan
Date: 2026-06-11
Status: planning-only evidence-to-progress calculation design

## 1. Purpose And Status

This document defines the first future rules for evaluating semantically valid knowledge evidence against one semantically valid knowledge progress record. It selects eligibility, deterministic integer deltas, duplicate-credit posture, ordering, an inert proposal envelope, focused tests, acceptance criteria, and implementation order.

This run implements documentation only. It implements no helper, test, evidence or progress state, storage, mutation, persistence, runtime producer, completion behavior, trial unlock, UI, generated output, event, reward, ownership behavior, schema, validator, content, skill, spell, or gameplay behavior.

## 2. Current State Recap

The current knowledge foundation is:

- Authored snippets exist at `packages/content/base/player/knowledge_snippets.json`.
- Snippet semantic validation exists at `tools/content-lint/knowledge-snippets.mjs`.
- The broad domain registry exists at `packages/content/base/player/knowledge_domain_registry.json`, with structural and semantic validation.
- The strict evidence record schema exists at `packages/schemas/player/knowledge_evidence.schema.json`.
- Pure evidence semantic validation exists at `tools/content-lint/knowledge-evidence.mjs`.
- The strict progress record schema exists at `packages/schemas/player/knowledge_progress.schema.json`.
- Pure progress semantic validation exists at `tools/content-lint/knowledge-progress.mjs`.
- Evidence and progress helpers are fixture-driven and unregistered in normal content lint because no canonical state paths exist.
- Progress exists only as in-memory test fixtures; there is no canonical progress collection or stored record.
- No canonical evidence collection, storage, progress computation, evidence consumption, completion calculation, trial unlock, UI, runtime producer, persistence contract, or save-state shape exists.

The existing validators can prove that supplied evidence and progress inputs satisfy their current structural and semantic contracts. They do not decide whether a new evidence record is eligible for credit or what progress change should be proposed.

## 3. Future Helper Ownership

The future helper path is:

- `tools/content-lint/knowledge-evidence-to-progress.mjs`

The helper should be pure, deterministic, side-effect-free, and driven entirely by in-memory inputs. It should consume semantically valid evidence and progress inputs, evaluate one explicit operation, and return a proposed change or deterministic issues.

The helper must not:

- mutate evidence, progress, snippets, domains, owners, or any input;
- read from or write to the filesystem;
- select canonical evidence or progress storage;
- register itself in `tools/content-lint/index.mjs`;
- persist consumption or progress;
- produce runtime events;
- calculate completion;
- unlock trials;
- generate UI output;
- grant rewards, discovery, ownership, or gameplay effects.

## 4. Input Authorities

The first implementation should require explicit in-memory inputs governed by these authorities:

| Input or reference | Authority |
| --- | --- |
| Existing target progress wrapper and record | `tools/content-lint/knowledge-progress.mjs`, including its live schema and required authorities. |
| Candidate evidence wrapper and records | `tools/content-lint/knowledge-evidence.mjs`, including its live schema and required authorities. |
| Authored snippet identity and snapshots | `tools/content-lint/knowledge-snippets.mjs` or an equivalent pure validation path preserving its current behavior. |
| Domain identity and active status | The validated broad domain registry. |
| Optional future non-evidence operation | An explicit operation-context contract selected by a later plan; none is authorized initially. |

The helper must not use save, account, session, runtime, UI, family, Legacy, Chronicle, or generated-output state as an authority. Character `ownerId` remains pattern-only because no canonical character authority is selected.

## 5. Core Boundary

The responsibility split is:

- Evidence validation proves that an evidence record is structurally and semantically valid.
- Progress validation proves that an existing progress record is structurally and semantically valid.
- Evidence-to-progress rules decide whether supplied evidence is eligible for one existing progress record and what additive delta may be proposed.

The rules helper does not reclassify invalid evidence as valid, repair invalid progress, create missing records, persist consumption, calculate completion, unlock trials, emit events, or produce UI.

## 6. Evidence Eligibility Rules

Candidate evidence is eligible only when all of the following are true:

- Evidence and target progress have passed their existing semantic validators.
- `ownerScope` is exactly `character` on both records.
- Evidence `ownerScope` and `ownerId` exactly equal the target progress owner.
- Evidence `snippetId`, `domainId`, `subjectType`, and `subjectId` exactly equal the target progress fields.
- The snippet and domain resolve through validated authorities.
- The referenced domain is active.
- Planned domains, including `knowledge_domain.arcane_lore`, remain blocked.
- Evidence `sourceId` is `null` under the current evidence-validator posture.
- The source and acquisition context remain supported by the evidence validator.
- The evidence id is not already present in the target record's `consumedEvidenceIds`.
- The evidence id is not already consumed by another progress record supplied to the same operation.
- The same evidence id is not accepted more than once in the same operation.

Unsupported source, context, owner, target, domain, or consumption conditions must reject the evidence with a deterministic reason. Eligibility does not prove that the underlying world occurrence happened; that remains a producer responsibility.

## 7. Delta Rules

The first calculation posture is:

- Every eligible evidence record proposes exactly `+1` progress point.
- Deltas are positive integers only.
- Multiple eligible evidence records are additive.
- `deltaTotal` is the sum of accepted `+1` deltas.
- The proposed `progressValue` is the existing valid `progressValue` plus `deltaTotal`.

The first helper must not use:

- fractional or negative deltas;
- percentages;
- confidence values;
- source weighting;
- rarity weighting;
- repeated-source weighting;
- `completionWeight`;
- `trialUnlockWeight`;
- decay;
- maximums, caps, thresholds, tiers, completion state, or trial readiness.

The `+1` rule is a calculation policy only. It does not imply completion, discovery, mastery, or reward.

## 8. Repeatability And Duplicate Credit

The first posture distinguishes evidence identity from occurrence equivalence:

- One `evidenceId` may contribute at most once.
- An id already in the target record's `consumedEvidenceIds` is ineligible.
- An id already consumed by another supplied progress record in the same operation is ineligible.
- Duplicate candidate entries with the same `evidenceId` are ineligible after the first deterministic evaluation.
- Distinct semantically valid evidence ids remain independently eligible by default when owner and target parity hold.
- Caps, stacking limits, anti-farming rules, source cooldowns, diminishing returns, and repeated-occurrence limits remain deferred.

Illustrative outcomes:

- Aloe evidence for `character.test_subject` may propose `+1` to that character's Aloe progress when it has exact target parity and is not consumed.
- Re-supplying the same Aloe `evidenceId` proposes no additional credit and returns a duplicate or consumed reason.
- A distinct Badger evidence id cannot contribute to Aloe progress because snippet and subject parity fail.
- Kaelvar travel-observation evidence may propose `+1` only to matching Kaelvar progress for the same character owner.
- Aloe evidence owned by `character.other_subject` cannot contribute to `character.test_subject` progress.

## 9. Occurrence Equivalence Is Deferred

The current evidence schema has no stable occurrence-group identity. The validator cannot prove that two distinct evidence ids describe the same world occurrence.

The first helper must not:

- infer equivalence from matching timestamps, because no timestamp authority exists;
- infer equivalence from matching `acquiredSequence`;
- invent event, action, encounter, session, run, location-window, or source-window identities;
- collapse distinct ids based on similar acquisition context;
- enforce time windows, run windows, action windows, or per-occurrence caps.

A later occurrence-equivalence plan must select an explicit grouping authority and producer contract before distinct evidence ids can be treated as the same occurrence.

## 10. Deterministic Ordering And Sequence

The first helper should evaluate candidate evidence in ascending `evidenceId` order unless a later explicit sequence authority replaces that rule. Input order must not change accepted ids, rejected ids, deltas, or issues.

When at least one evidence record is accepted:

- the proposed `updatedSequence` should be derived deterministically from explicit numeric inputs;
- the default proposal is `max(existingProgress.updatedSequence, acceptedEvidence.acquiredSequence...) + 1`;
- no wall clock, filesystem metadata, random value, runtime tick, or hidden global counter may participate.

When no evidence is accepted, the proposed record should remain value-equivalent to the supplied progress record.

The sequence is proposal metadata only. The helper does not persist it, migrate it, or declare a save/runtime sequence authority.

## 11. Conceptual Inert Output Envelope

The future helper should return a conceptual envelope with:

```text
acceptedEvidenceIds
rejectedEvidence
proposedProgressRecord
deltaTotal
appliedDeltas
issues
safety
```

Expected meanings:

- `acceptedEvidenceIds`: deterministic evidence ids eligible for this proposal.
- `rejectedEvidence`: evidence ids plus stable rejection reasons.
- `proposedProgressRecord`: an immutable derived copy with proposed `progressValue`, `consumedEvidenceIds`, and `updatedSequence`.
- `deltaTotal`: summed positive integer proposal.
- `appliedDeltas`: preview entries identifying evidence id, target progress id, and `+1`.
- `issues`: deterministic input or policy errors.
- `safety`: explicit flags such as `noMutation`, `noPersistence`, `noCompletion`, `noTrialUnlock`, and `noUiOutput`, all true.

This envelope is inert. It performs no write, consumption, persistence, event emission, reward, ownership change, completion transition, trial unlock, or UI generation. Exact property names remain implementation-local unless a later schema plan promotes them.

## 12. Missing Progress Record Posture

The first helper requires one existing semantically valid target progress record.

It must not:

- auto-create a progress record;
- invent `progressId`, notes, owner, target snapshots, or initial sequence;
- select canonical storage;
- write a zero-state record.

Progress-record initialization requires a separate plan because it must define identity construction, notes, initial sequence, storage ownership, and duplicate handling.

## 13. Zero-State And Zero-Credit Posture

The current zero-state option remains a validator and test posture only. It is not a storage or initialization contract.

For calculation:

- Eligible evidence always proposes a positive `+1` delta.
- Zero-credit evidence is unsupported.
- A supplied progress record that violates current zero/nonzero consistency remains invalid before the rules helper runs.
- The helper must not convert consumed evidence into zero credit or preserve an invalid zero-with-consumed state.
- Any future zero-credit, informational-only, confidence-only, or rejected-after-consumption policy requires explicit schema, validator, and rules changes.

## 14. No Initial Non-Evidence Operations

The first rules implementation authorizes no non-evidence progress operation.

The following do not grant progress unless a future authorized producer first creates semantically valid evidence:

- skill rank or skill use;
- known spells or spell use;
- registry relationships;
- item, book, scroll, tome, or document possession;
- travel or location presence;
- teacher or institution access;
- quest, Chronicle, Renown, family, Legacy, account, or UI state.

A later non-evidence-operation plan may introduce an explicit operation context, but it must not bypass evidence and progress authority accidentally.

## 15. Progress Sources And Audit Detail

`progressSources` remains absent from the progress schema and must not be added by the first implementation.

`appliedDeltas` belongs only to the inert proposal preview. It is not persisted in `proposedProgressRecord` and is not a new source-history contract.

Persistent audit trails, reason vocabularies, replay records, operation ids, provenance, migration, and rollback remain deferred. They require a separate schema and persistence decision.

## 16. Completion, Trials, UI, And Runtime Boundary

The first helper must not:

- compare progress against authored `completionWeight`;
- calculate domain, tier, or subject completion;
- consume or interpret `trialUnlockWeight`;
- unlock or evaluate trials;
- emit Chronicle, Renown, quest, combat, save, account, session, or UI events;
- produce bars, percentages, badges, notifications, sorting data, generated codex entries, or map output;
- mutate runtime, database, save, account, session, inventory, skill, spell, owner, or world state.

Progress remains an integer proposal, not completion or presentation state.

## 17. Focused Test Plan For Implementation

Future focused tests should live in:

- `tests/unit/knowledge-evidence-to-progress.test.mjs`

Positive tests:

- Accept one eligible Aloe evidence record and propose exactly `+1`.
- Accept distinct eligible Aloe evidence ids and add one point per id.
- Accept eligible Badger evidence only for matching Badger progress.
- Accept eligible Kaelvar travel-observation evidence only for matching Kaelvar progress.
- Preserve character owner and exact target parity.
- Sort accepted evidence ids deterministically.
- Produce the same result for equivalent candidate inputs in different orders.
- Derive `updatedSequence` deterministically from explicit progress and accepted evidence sequence values.
- Return an immutable proposed progress copy and leave every input unchanged.
- Return all safety flags as true.

Negative tests:

- Reject structurally or semantically invalid evidence before calculation.
- Reject structurally or semantically invalid progress before calculation.
- Reject missing target progress rather than auto-create it.
- Reject owner-scope or owner-id mismatch.
- Reject snippet, domain, subject-type, or subject-id mismatch.
- Reject planned or inactive domains, including Arcane Lore.
- Reject unsupported source or context conditions and non-null `sourceId` under the current validator posture.
- Reject an evidence id already consumed by the target record.
- Reject an evidence id consumed by another supplied progress record in the operation.
- Reject duplicate candidate entries with the same evidence id.
- Do not infer occurrence equivalence between distinct ids.
- Reject or ignore every non-evidence operation because none is authorized.
- Never produce fractional, negative, weighted, percentage, zero-credit, decayed, capped, threshold, completion, or trial deltas.
- Never add `progressSources` or persisted `appliedDeltas` to the proposed progress record.
- Never mutate inputs, persist data, read files, register normal lint, emit events, unlock trials, or produce UI.

Tests should assert stable accepted order, rejection reasons, issue order, deltas, sequence proposals, and input immutability.

## 18. Acceptance Criteria For Version 0.5.132

`Version 0.5.132 - Knowledge Evidence-to-Progress Rules` is accepted only when:

- `tools/content-lint/knowledge-evidence-to-progress.mjs` exists.
- `tests/unit/knowledge-evidence-to-progress.test.mjs` exists.
- The helper is pure, deterministic, side-effect-free, and in-memory fixture driven.
- Existing evidence and progress validators gate inputs before calculation.
- The helper requires one existing valid target progress record.
- Exact character owner and snippet/domain/subject parity is enforced.
- Every eligible evidence id proposes exactly `+1`.
- Duplicate, already consumed, and cross-record-consumed evidence ids receive no credit.
- Distinct valid ids remain independently eligible without inferred occurrence equivalence.
- Accepted ids and issues have deterministic ordering.
- The result is an inert proposal envelope with no mutation or persistence.
- No progress record is auto-created.
- No normal content-lint registration is added.
- No canonical evidence or progress storage path is created.
- No `progressSources`, persisted delta history, schema, validator, content, producer, runtime, persistence, completion, trial, UI, generated-output, ownership, or gameplay change is bundled.

## 19. Future Implementation Sequence

Recommended sequence:

1. `Version 0.5.131 - Knowledge Evidence-to-Progress Rules Plan` - this document.
2. `Version 0.5.132 - Knowledge Evidence-to-Progress Rules`.
3. `0.5.x - Knowledge Evidence Producers Plan`.
4. `0.5.x - Knowledge Completion Rules Plan`.
5. `0.5.x - Knowledge Trials Plan`.
6. `0.5.x - Knowledge UI Plan`.
7. Later evidence/progress temporary-guardrail cleanup decision.

Each item remains a separate scoped run.

## 20. Risks And Deferred Work

- No canonical evidence or progress storage path exists.
- Character owner authority remains unresolved.
- Progress-record initialization and identity construction are unresolved.
- Occurrence equivalence and producer-issued grouping identity are unresolved.
- Repetition caps, stacking limits, anti-farming, cooldowns, and diminishing returns are unresolved.
- Non-evidence progress operations are unsupported.
- Persistent source audit, replay, provenance, and reason vocabularies are unresolved.
- Zero-state persistence and zero-credit evidence are unresolved.
- Runtime evidence producers and occurrence authenticity are unresolved.
- Completion thresholds, tier aggregation, trial readiness, and rewards are unresolved.
- Persistence, save shape, migration, concurrency, atomic consumption, and rollback are deferred.
- UI and generated output are deferred.
- Arcane Lore progress remains blocked while `knowledge_domain.arcane_lore` is planned.
- Evidence and progress guardrail documents should remain through `0.5.132`; after implementation, make an explicit retain, consolidate, promote, or remove decision.

## 21. Non-Goals And Forbidden Changes

This planning run authorizes none of the following:

- No evidence-to-progress helper implementation.
- No evidence-to-progress tests.
- No edits to existing evidence or progress helpers or tests.
- No evidence or progress JSON, content, state, or storage.
- No evidence, progress, snippet, or registry schema edits.
- No evidence, progress, snippet, or registry validator edits.
- No normal content-lint registration.
- No authored snippet or registry content edits.
- No skill, spell, item, document, teacher, institution, travel, map, settlement, economy, or magic runtime changes.
- No runtime loaders or producers.
- No database or persistence changes.
- No save, account, session, family, Legacy, or owner-state changes.
- No generated output.
- No UI or main-menu work.
- No progress-record initialization.
- No `progressSources` or persisted delta history.
- No occurrence-equivalence implementation.
- No completion math.
- No trials.
- No Chronicle, Renown, quest, combat, or UI events.
- No rewards, discovery, mastery, or ownership behavior.
- No backwards compatibility or migration behavior.
- No unrelated cleanup.
