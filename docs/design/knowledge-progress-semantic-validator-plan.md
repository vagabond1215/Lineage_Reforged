# Knowledge Progress Semantic Validator Plan

Source version/run: Version 0.5.129 - Knowledge Progress Semantic Validator Plan
Date: 2026-06-10
Status: planning-only knowledge progress semantic-validator design

## 1. Purpose And Status

This document defines the future pure, schema-first semantic-validation boundary for knowledge progress wrappers and records. It selects helper ownership, wrapper rules, reference authorities, owner and consumed-evidence parity, duplicate identity policy, zero-state posture, focused tests, acceptance criteria, and implementation order.

This run implements documentation only. It implements no progress semantic validator, validator tests, progress JSON/content/state, evidence JSON/content/state, runtime loader or producer, database or persistence behavior, UI, generated output, evidence-to-progress rules, completion math, trials, Chronicle or Renown events, ownership behavior, snippet content, schemas, validators, registry content, skills, spells, or gameplay behavior.

## 2. Current State Recap

The current knowledge foundation is:

- The progress state plan exists at `docs/design/knowledge-progress-state-plan.md`.
- The progress schema plan exists at `docs/design/knowledge-progress-schema-plan.md`.
- The strict progress record schema exists at `packages/schemas/player/knowledge_progress.schema.json`.
- The strict evidence record schema exists at `packages/schemas/player/knowledge_evidence.schema.json`.
- Pure evidence semantic validation exists at `tools/content-lint/knowledge-evidence.mjs`.
- The evidence validator is test-fixture-only and is not registered in normal content lint because no canonical evidence collection exists.
- Authored snippets exist at `packages/content/base/player/knowledge_snippets.json`.
- Snippet semantic validation exists at `tools/content-lint/knowledge-snippets.mjs`.
- The broad domain registry exists at `packages/content/base/player/knowledge_domain_registry.json`.
- No canonical evidence or progress storage path exists.
- No progress semantic validator, evidence-to-progress rules, completion math, trials, UI, runtime producer, persistence contract, or save-state shape exists.

The progress schema validates one record's structure only. It does not prove that snippet or evidence references resolve, snapshot fields match, owners match, evidence is consumed only once, or a stored `progressValue` is semantically consistent with an empty or non-empty evidence set.

## 3. Validation Ownership Decision

The future helper path is:

- `tools/content-lint/knowledge-progress.mjs`

The helper should be pure, deterministic, side-effect-free, and driven by in-memory fixtures. It should accept candidate progress input and explicit authority inputs, return success or deterministic validation errors, and never mutate any input.

It should not be registered in `tools/content-lint/index.mjs` until a canonical progress fixture, catalog, or state path is explicitly selected. The helper must not invent progress storage, compute progress, create or mutate evidence or progress records, or own persistence, runtime production, UI, completion, trials, ownership behavior, or gameplay behavior.

## 4. Wrapper Gate

The exact future wrapper input is:

```json
{
  "records": []
}
```

Wrapper rules:

- The top-level value is an object.
- It has exactly one key: `records`.
- `records` is an array.
- An empty `records` array is valid only when the test invocation explicitly enables the named empty-state posture, such as `allowEmptyRecords: true`.
- Production-like positive fixtures must contain at least one record.
- Every record must pass `packages/schemas/player/knowledge_progress.schema.json` before semantic checks.
- Semantic checks must not run for structurally invalid records.
- `progressId` values must be unique within the wrapper.
- There must be at most one current progress record for each `ownerScope`/`ownerId`/`snippetId` tuple.

The wrapper is a validation input contract. It does not approve a canonical progress JSON, content, fixture, save, account, session, or runtime-state path.

## 5. Schema-First Validation Flow

The future helper should:

1. Parse or receive the candidate progress wrapper.
2. Require the exact `{ records: [...] }` wrapper.
3. Validate every progress record against `knowledge_progress.schema.json`.
4. Stop before progress semantics if any progress record is structurally invalid.
5. Load or receive authored snippets, broad domains, and an evidence wrapper plus the evidence validator's required authorities.
6. Validate the evidence input through `tools/content-lint/knowledge-evidence.mjs` or a shared pure path that preserves its current behavior.
7. Stop before progress semantics if any consumed-evidence input is structurally or semantically invalid.
8. Build fail-closed lookup maps for snippets, broad domains, and evidence.
9. Reject duplicate authority ids wherever an authority map is built.
10. Run progress semantic checks only after schema-valid progress records and semantically valid evidence records exist.
11. Return deterministic errors containing the relative input path, `progressId` or record index, field, and offending value where possible.

The first implementation may use a progress-scoped schema adapter matching the current evidence helper pattern. It must fail closed on unsupported schema keywords and must not add a production dependency or refactor unrelated validators.

## 6. Reference Authorities

Initial authorities are:

| Reference | First-validator authority |
| --- | --- |
| `snippetId` | Required authored snippet authority from `packages/content/base/player/knowledge_snippets.json`. |
| `domainId` | Required broad domain authority from `packages/content/base/player/knowledge_domain_registry.json`. |
| Progress record structure | Required `packages/schemas/player/knowledge_progress.schema.json`. |
| Consumed evidence structure | Required `packages/schemas/player/knowledge_evidence.schema.json`. |
| Consumed evidence semantics | Required `tools/content-lint/knowledge-evidence.mjs`. |
| `ownerId` | Pattern-only; character authority remains deferred. |
| Progress storage or persistence | Deferred. |

The first validator must not select save, account, or session state authority; family or account sharing authority; runtime event authority; or UI/generated-output authority.

## 7. Snippet, Domain, And Subject Checks

For every structurally valid progress record:

- `snippetId` must resolve to exactly one authored snippet.
- `domainId` must equal `snippet.domainId`.
- `subjectType` must equal `snippet.subjectType`.
- `subjectId` must equal `snippet.subjectId`.
- The referenced domain must resolve exactly once and have `status: "active"`.
- Planned domains, including `knowledge_domain.arcane_lore`, remain blocked.
- Progress validation must not mutate snippets.
- Progress fields must not appear in authored snippet JSON.

The existing strict snippet schema owns rejection of undeclared progress fields in authored snippet content. A focused progress-validator test may clone the snippet wrapper to prove that existing strictness, but the progress helper must not broaden snippet-validator ownership.

## 8. Owner Posture

The first validator must enforce:

- `ownerScope` is exactly `character`.
- `ownerId` remains canonical dotted-id pattern-only until a character authority is explicitly selected.
- Family and account sharing are not inferred.
- Settlement, faction, and custom ownership remain blocked.
- Validation performs no owner mutation.
- No persistence or save-state owner shape is introduced.
- Locations or institutions from evidence acquisition context never become the progress owner.

The schema already blocks non-character scopes. The semantic helper should assert the approved posture so later schema broadening cannot silently authorize new ownership behavior.

## 9. Consumed Evidence Checks

`consumedEvidenceIds` identifies evidence records already credited to one progress summary. The first validator must enforce:

- Every consumed id resolves to exactly one semantically valid evidence record.
- Consumed evidence passes both `knowledge_evidence.schema.json` and `tools/content-lint/knowledge-evidence.mjs`.
- Evidence `ownerScope` equals progress `ownerScope`.
- Evidence `ownerId` equals progress `ownerId`.
- Evidence `snippetId` equals progress `snippetId`.
- Evidence `domainId` equals progress `domainId`.
- Evidence `subjectType` equals progress `subjectType`.
- Evidence `subjectId` equals progress `subjectId`.
- `consumedEvidenceIds` is unique within one record. The schema already enforces this, and the semantic validator should preserve the posture.
- Unresolved consumed evidence ids fail validation.
- Evidence records are not embedded inside progress records.
- Progress validation does not create or mutate evidence.

Evidence records that are present in the supplied evidence wrapper but are not consumed by a progress record may still be valid evidence. The progress validator does not grant them credit.

## 10. Duplicate And Cross-Record Consumption Policy

The first-validator posture is:

- Duplicate `progressId` values within one wrapper are invalid.
- More than one record for the same `ownerScope`/`ownerId`/`snippetId` tuple is invalid.
- The same evidence id consumed by more than one progress record in the same wrapper is invalid by default.
- Any future allowance for cross-record evidence consumption requires an explicit later plan.
- Duplicate progress credit, repeatability, stacking, and occurrence equivalence remain evidence-to-progress policy concerns.

This rule prevents one supplied wrapper from crediting a single evidence identity more than once without pretending to solve equivalent-occurrence or repeatability policy.

## 11. Progress Value And Zero-State Consistency

The semantic posture is:

- `progressValue` is structurally a non-negative integer.
- It is not a percentage.
- It does not imply completion.
- It does not consume authored `completionWeight` or `trialUnlockWeight`.
- The validator does not compute `progressValue`.
- The validator does not decide evidence weights.
- `progressValue: 0` with an empty `consumedEvidenceIds` array is valid only when the test invocation explicitly enables a named zero-state posture, such as `allowZeroStateRecords: true`.
- A nonzero `progressValue` with empty `consumedEvidenceIds` is invalid until authorized non-evidence progress operations are planned.
- `progressValue: 0` with one or more consumed evidence ids is invalid unless later evidence-to-progress rules authorize zero-credit evidence.
- A positive `progressValue` with one or more consumed evidence ids may be semantically consistent, but validation does not prove that the value was calculated correctly.

The explicit zero-state option is out-of-band validator input. It must not be stored as an extra wrapper or record field.

## 12. Progress Sources Posture

`progressSources` is intentionally absent from the first schema.

The semantic validator must reject it through schema-first validation. Source audit trails, deltas, reason vocabularies, and replay semantics remain deferred. Neither this plan nor the first validator implementation authorizes adding `progressSources`.

## 13. Relationship To Evidence-To-Progress Rules

Progress semantic validation verifies shape, references, owner parity, target parity, duplicate identities, cross-record evidence consumption, and the initial zero/nonzero consistency posture.

It does not:

- compute `progressValue`;
- decide evidence weights;
- decide repeatability or stacking;
- decide occurrence equivalence;
- decide whether non-evidence operations can grant progress;
- decide how `updatedSequence` advances.

Those decisions belong to a later, separate `Knowledge Evidence-to-Progress Rules Plan`.

## 14. Relationship To Completion, Trials, UI, And Runtime

- Progress is not completion.
- Progress does not unlock trials.
- Progress does not emit Chronicle or Renown events.
- Progress does not grant rewards, ownership, discovery, or UI state.
- Progress validation does not run gameplay logic.
- UI labels, bars, badges, sorting, filtering, percentages, and unlock presentation remain deferred.
- Runtime producers and save, account, session, database, or persistence mutation remain deferred.
- Generated output remains deferred.

## 15. Focused Test Plan For Implementation

Future focused tests should live in:

- `tests/unit/knowledge-progress-validation.test.mjs`

Positive tests:

- Accept an explicit empty-state wrapper only with the empty-state option enabled.
- Accept a zero-state Aloe fixture with `progressValue: 0` and empty `consumedEvidenceIds` only with the zero-state option enabled.
- Accept Aloe progress with one consumed semantically valid evidence id and a positive integer `progressValue`.
- Accept Badger progress with one consumed semantically valid evidence id and a positive integer `progressValue`.
- Accept Iron Ore progress with one consumed semantically valid evidence id and a positive integer `progressValue`.
- Accept Kaelvar progress with one consumed semantically valid travel-observation evidence id and a positive integer `progressValue`.
- Accept `notes` according to the live schema: at least one unique non-empty string.

Negative tests:

- Reject a missing `records` wrapper.
- Reject extra top-level wrapper keys.
- Reject structurally invalid progress before semantic checks.
- Reject duplicate `progressId`.
- Reject a duplicate `ownerScope`/`ownerId`/`snippetId` tuple.
- Reject unresolved `snippetId`.
- Reject `domainId` mismatch.
- Reject `subjectType` mismatch.
- Reject `subjectId` mismatch.
- Reject an inactive or planned domain, including Arcane Lore.
- Reject non-character `ownerScope` through schema or semantic posture.
- Reject invalid `ownerId` through schema validation.
- Reject unresolved `consumedEvidenceId`.
- Reject consumed evidence that fails evidence semantic validation.
- Reject consumed evidence `ownerScope` mismatch.
- Reject consumed evidence `ownerId` mismatch.
- Reject consumed evidence `snippetId`, `domainId`, `subjectType`, or `subjectId` mismatch.
- Reject the same consumed evidence id used by more than one progress record in the same wrapper.
- Reject nonzero `progressValue` with empty `consumedEvidenceIds`.
- Reject zero `progressValue` with consumed evidence unless a future rule allows zero-credit evidence.
- Reject `progressSources`, completion, trial, UI, generated-output, persistence, event, and owner-shortcut fields through schema validation.
- Reject progress fields in authored snippet JSON through existing snippet strictness when a focused fixture clones snippets.
- Reject embedded evidence records inside progress records.

Error assertions should prove:

- relative input path;
- `progressId` or record index;
- field;
- offending value where possible.

Tests should also prove deterministic results and input immutability.

## 16. Acceptance Criteria For Future Implementation

`Version 0.5.130 - Knowledge Progress Semantic Validator` is accepted only when:

- `tools/content-lint/knowledge-progress.mjs` exists.
- `tests/unit/knowledge-progress-validation.test.mjs` exists.
- The validator is pure, deterministic, side-effect-free, and in-memory fixture driven.
- Wrapper validation is exact.
- Record validation is schema-first.
- Semantic checks do not run for structurally invalid records.
- Snippet, domain, and evidence authorities are validated fail-closed.
- Consumed evidence passes the current evidence semantic validator.
- Owner and target parity checks are implemented.
- Duplicate progress identity, owner-and-snippet identity, and cross-record consumed-evidence checks are implemented.
- Zero-state and nonzero consistency posture is implemented.
- Errors identify path, progress id or index, field, and value where possible.
- No canonical progress JSON/content/state path is created.
- No normal content-lint registration is added without an explicit storage path.
- No progress schema, evidence schema, evidence validator, snippet JSON/schema/validator, registry, skill, spell, runtime, persistence, completion, trial, UI, generated-output, ownership, or gameplay change is bundled.

## 17. Future Implementation Sequence

Recommended sequence:

1. `Version 0.5.129 - Knowledge Progress Semantic Validator Plan` - this document.
2. `Version 0.5.130 - Knowledge Progress Semantic Validator`.
3. `0.5.x - Knowledge Evidence-to-Progress Rules Plan`.
4. `0.5.x - Knowledge Evidence Producers Plan`.
5. `0.5.x - Knowledge Completion Rules Plan`.
6. `0.5.x - Knowledge Trials Plan`.
7. `0.5.x - Knowledge UI Plan`.

Each item remains a separate scoped run.

## 18. Risks And Deferred Work

- No canonical evidence or progress storage path exists.
- Character owner authority is unresolved.
- Evidence-to-progress computation is deferred.
- Duplicate credit, repeatability, stacking, and occurrence equivalence are unresolved.
- Cross-record evidence consumption may need later policy refinement.
- Zero-state persistence policy is unresolved.
- `progressSources` remains deferred.
- Completion thresholds and tier aggregation are unresolved.
- Persistence, save shape, and save migration are deferred.
- UI and generated output are deferred.
- Arcane Lore progress remains blocked while `knowledge_domain.arcane_lore` is planned.
- A cleanup decision remains necessary for evidence and progress planning guardrails after evidence-to-progress planning consumes their remaining guidance.

## 19. Non-Goals And Forbidden Changes

This planning run authorizes none of the following:

- No progress semantic validator implementation.
- No progress validator tests.
- No progress JSON, content, or state.
- No progress schema edits.
- No evidence JSON, content, or state.
- No evidence schema edits.
- No evidence validator edits.
- No snippet content edits.
- No snippet schema edits.
- No snippet validator edits.
- No registry content edits.
- No skill or spell edits.
- No runtime loaders or producers.
- No database or persistence changes.
- No save, account, or session state.
- No generated output.
- No UI.
- No main-menu work.
- No evidence-to-progress rules.
- No completion math.
- No trials.
- No Chronicle or Renown events.
- No ownership behavior.
- No item, spell, or skill ownership changes.
- No settlement, map, travel, or economy implementation.
- No unrelated cleanup.
