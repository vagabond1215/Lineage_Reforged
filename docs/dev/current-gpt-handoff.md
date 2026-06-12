# Current GPT Handoff

Source route: Codex local implementation after `Version 0.5.134 - Knowledge Observation Evidence Producer`
Date: 2026-06-12
Branch/status assumption: `master` at commit `5b4f85f` before edits; the worktree was clean.

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
- `tools/content-lint/knowledge-evidence-producers.mjs` now owns the pure observation evidence candidate boundary.
- `packages/schemas/player/knowledge_evidence.schema.json` owns the structural contract for one evidence record.
- `tools/content-lint/knowledge-evidence.mjs` owns the pure evidence semantic-validation boundary.
- `packages/content/base/player/knowledge_snippets.json` remains the authored snippet authority.
- `packages/content/base/player/knowledge_domain_registry.json` remains broad domain compatibility metadata.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.134 - Knowledge Observation Evidence Producer`

Immediate next version:

- `Version 0.5.135 - Knowledge Storage And Persistence Boundary Plan`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.134 Result

- Added `tools/content-lint/knowledge-evidence-producers.mjs` as a pure, deterministic, filesystem-free candidate helper.
- Added `tests/unit/knowledge-evidence-producers.test.mjs` with 29 focused in-memory tests.
- Derived domain, subject type, subject id, and source type from one explicitly selected current snippet.
- Supported current Aloe, Badger, and Iron Ore field-identification candidates plus Kaelvar travel-observation candidates with its authored continent scope.
- Required explicit character owner, stable producer-issued occurrence identity, acquisition context, and non-negative integer acquisition sequence.
- Froze the deterministic id shape as snippet domain, subject, category, occurrence kind, and occurrence token under the live evidence-id schema.
- Validated every successful candidate through the existing evidence schema and semantic helper.
- Returned only candidate evidence, deterministic issues, and candidate-only safety flags.
- Added no evidence/progress content or state, canonical storage, normal lint registration, schema/validator/proposal-helper edit, persistence, runtime, progress invocation or mutation, completion, trials, UI/main-menu, generated output, ownership mutation, or gameplay behavior.

## Active Guardrails For 0.5.135

Knowledge Storage And Persistence Boundary Plan:

- Produce a planning document only; do not implement evidence or progress storage.
- Define the future acceptance boundary between producer candidates, validated evidence, evidence-to-progress proposals, and persisted records.
- Define collection ownership, duplicate and replay posture, occurrence identity responsibility, acquisition/update sequence authority, and atomic evidence/progress handling.
- Decide future save/session placement conceptually without editing save, account, session, database, schema, or migration files.
- Keep the observation producer pure, unregistered, and unchanged.
- Do not add runtime wiring, normal lint registration, mutation, progress-record initialization, completion, trials, rewards, UI, generated output, or gameplay behavior.
- Do not edit current schemas, validators, helpers, focused tests, snippets, registry content, skills, spells, main-menu files, or unrelated runtime code.

Current follow-up risks:

- No canonical evidence or progress storage or acceptance path exists.
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
- Retain evidence, progress, proposal, and producer guardrails through `0.5.135`; the observation helper remains a candidate producer only.

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
| 9 | `0.5.134` | Knowledge Observation Evidence Producer | `tools/content-lint/knowledge-evidence-producers.mjs` | Completed |
| 10 | `0.5.135` | Knowledge Storage And Persistence Boundary Plan | Current Knowledge authorities | Next |
| 11 | `0.5.x` | Knowledge Progress Record Initialization Plan | Future focused plan | Deferred |
| 12 | `0.5.x` | Knowledge Completion Rules Plan | Future focused plan | Deferred |
| 13 | `0.5.x` | Knowledge Trials Plan | Future focused plan | Deferred |
| 14 | `0.5.x` | Knowledge UI Plan | Future focused plan | Deferred |

## Next Prompt Source Stack

For `Version 0.5.135 - Knowledge Storage And Persistence Boundary Plan`, inspect:

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
- `tools/content-lint/knowledge-evidence-producers.mjs`
- `tests/unit/knowledge-evidence-producers.test.mjs`
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
