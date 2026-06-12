# Current GPT Handoff

Source route: Codex local planning after `Version 0.5.133 - Knowledge Evidence Producers Plan`
Date: 2026-06-12
Branch/status assumption: `master` at commit `f6f8cbb` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-progress-state-plan.md` owns progress identity, character ownership, snippet/evidence relationships, integer-value posture, and broad validation boundaries.
- `packages/schemas/player/knowledge_progress.schema.json` owns the strict structural contract for one progress record.
- `docs/design/knowledge-progress-semantic-validator-plan.md` owns the first progress semantic-validator decisions.
- `tools/content-lint/knowledge-progress.mjs` now owns the pure progress semantic-validation boundary.
- `docs/design/knowledge-evidence-to-progress-rules-plan.md` owns evidence eligibility, additive integer deltas, duplicate-credit posture, deterministic ordering, and inert proposal boundaries.
- `tools/content-lint/knowledge-evidence-to-progress.mjs` now owns the pure evidence-to-progress proposal boundary.
- `docs/design/knowledge-evidence-producers-plan.md` owns producer categories, candidate-only output, deterministic identity and explicit sequence posture, current source/context limits, and the first observation-producer acceptance criteria.
- `packages/schemas/player/knowledge_evidence.schema.json` owns the structural contract for one evidence record.
- `tools/content-lint/knowledge-evidence.mjs` owns the pure evidence semantic-validation boundary.
- `packages/content/base/player/knowledge_snippets.json` remains the authored snippet authority.
- `packages/content/base/player/knowledge_domain_registry.json` remains broad domain compatibility metadata.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.133 - Knowledge Evidence Producers Plan`

Immediate next version:

- `Version 0.5.134 - Knowledge Observation Evidence Producer`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.133 Result

- Added `docs/design/knowledge-evidence-producers-plan.md` as a planning-only producer authority.
- Defined observation, travel/context, study/training, teacher/institution, document, and quest/event producer categories.
- Kept producer output to exactly the current 12 evidence fields and separated candidate proposal from validation, progress proposal, acceptance, and persistence.
- Required deterministic evidence identity, explicit character ownership, and explicit acquisition sequence without clocks, randomness, UI state, or hidden counters.
- Preserved the current null-only `sourceId` and supported source/context posture.
- Selected `Version 0.5.134 - Knowledge Observation Evidence Producer` as a pure, in-memory, unregistered helper with focused tests.
- Added no producer, tests, schema, validator, content, state, persistence, runtime, progress invocation or mutation, completion, trials, UI/main-menu, generated output, ownership mutation, or gameplay behavior.

## Active Guardrails For 0.5.134

Knowledge Observation Evidence Producer:

- Add only `tools/content-lint/knowledge-evidence-producers.mjs` and `tests/unit/knowledge-evidence-producers.test.mjs`.
- Keep the helper pure, deterministic, in-memory, filesystem-free, and unregistered.
- Support only the current Aloe, Badger, Iron Ore, and validator-supported Kaelvar examples; keep Arcane blocked.
- Require explicit owner, subject, occurrence identity, acquisition context, and acquisition sequence.
- Emit exactly the current evidence fields and validate every candidate with the existing evidence helper.
- Freeze and test a narrow deterministic evidence-id suffix rule without randomness, wall-clock time, UI state, or an implicit counter.
- Do not invoke the evidence-to-progress helper or create, mutate, accept, store, or persist evidence or progress.
- Do not add runtime wiring, lint-index registration, source authority, completion, trials, rewards, UI, generated output, schema changes, or validator changes.
- Do not edit snippets, registry content, skills, spells, main-menu files, or unrelated runtime code.

Current follow-up risks:

- No canonical evidence or progress storage path exists.
- Character owner authority remains pattern-only.
- Progress-record initialization remains undefined.
- Occurrence equivalence still depends on a producer-issued stable event, action, or occurrence identity.
- Canonical acquired-sequence and character identity authorities remain undefined.
- Storage acceptance, duplicate handling, stacking limits, anti-farming, and persistent replay remain undefined.
- Non-evidence operations remain unauthorized.
- Zero-state persistence policy remains undefined.
- `progressSources`, persistent audit history, replay, and reason vocabularies remain deferred.
- Completion thresholds, tier aggregation, trial readiness, persistence, and UI remain undefined.
- Arcane Lore progress remains blocked while the domain is planned.
- Retain evidence and progress planning guardrails through `0.5.134`; the observation helper remains a candidate producer only.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.126` | Knowledge Progress State Plan | `docs/design/knowledge-progress-state-plan.md` | Completed |
| 2 | `0.5.127` | Knowledge Progress Schema Plan | `docs/design/knowledge-progress-schema-plan.md` | Completed |
| 3 | `0.5.128` | Knowledge Progress Schema | `packages/schemas/player/knowledge_progress.schema.json` | Completed |
| 4 | `0.5.129` | Knowledge Progress Semantic Validator Plan | `docs/design/knowledge-progress-semantic-validator-plan.md` | Completed |
| 5 | `0.5.130` | Knowledge Progress Semantic Validator | `tools/content-lint/knowledge-progress.mjs` | Completed |
| 6 | `0.5.131` | Knowledge Evidence-to-Progress Rules Plan | `docs/design/knowledge-evidence-to-progress-rules-plan.md` | Completed |
| 7 | `0.5.132` | Knowledge Evidence-to-Progress Rules | `tools/content-lint/knowledge-evidence-to-progress.mjs` | Completed |
| 8 | `0.5.133` | Knowledge Evidence Producers Plan | `docs/design/knowledge-evidence-producers-plan.md` | Completed |
| 9 | `0.5.134` | Knowledge Observation Evidence Producer | `docs/design/knowledge-evidence-producers-plan.md` | Next |
| 10 | `0.5.x` | Knowledge Storage And Persistence Boundary Plan | Future focused plan | Deferred |
| 11 | `0.5.x` | Knowledge Progress Record Initialization Plan | Future focused plan | Deferred |
| 12 | `0.5.x` | Knowledge Completion Rules Plan | Future focused plan | Deferred |
| 13 | `0.5.x` | Knowledge Trials Plan | Future focused plan | Deferred |
| 14 | `0.5.x` | Knowledge UI Plan | Future focused plan | Deferred |

## Next Prompt Source Stack

For `Version 0.5.134 - Knowledge Observation Evidence Producer`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-evidence-contract-plan.md`
- `docs/design/knowledge-evidence-semantic-validator-plan.md`
- `docs/design/knowledge-progress-state-plan.md`
- `docs/design/knowledge-progress-schema-plan.md`
- `docs/design/knowledge-progress-semantic-validator-plan.md`
- `docs/design/knowledge-evidence-to-progress-rules-plan.md`
- `docs/design/knowledge-evidence-producers-plan.md`
- `packages/schemas/player/knowledge_evidence.schema.json`
- `packages/schemas/player/knowledge_progress.schema.json`
- `tools/content-lint/knowledge-evidence.mjs`
- `tools/content-lint/knowledge-progress.mjs`
- `tools/content-lint/knowledge-evidence-to-progress.mjs`
- `tests/unit/knowledge-evidence-validation.test.mjs`
- `tests/unit/knowledge-progress-validation.test.mjs`
- `tests/unit/knowledge-evidence-to-progress.test.mjs`
- `packages/content/base/player/knowledge_snippets.json`
- `packages/content/base/player/knowledge_domain_registry.json`
- `docs/future_content_backlog.md`
