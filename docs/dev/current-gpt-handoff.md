# Current GPT Handoff

Source route: Codex local planning after `Version 0.5.135 - Knowledge Storage And Persistence Boundary Plan`
Date: 2026-06-12
Branch/status assumption: `master` at commit `ec7d7ab` before edits; the worktree was clean.

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
- `docs/design/knowledge-storage-persistence-boundary-plan.md` owns the candidate/accepted/persisted distinction, future acceptance pipeline, collection responsibilities, duplicate/replay posture, atomicity recommendation, sequence authority requirements, and deferred storage-owner decision.
- `packages/schemas/player/knowledge_evidence.schema.json` owns the structural contract for one evidence record.
- `tools/content-lint/knowledge-evidence.mjs` owns the pure evidence semantic-validation boundary.
- `packages/content/base/player/knowledge_snippets.json` remains the authored snippet authority.
- `packages/content/base/player/knowledge_domain_registry.json` remains broad domain compatibility metadata.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.135 - Knowledge Storage And Persistence Boundary Plan`

Immediate next version:

- `Version 0.5.136 - Knowledge Storage Fixture Boundary Plan`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.135 Result

- Added `docs/design/knowledge-storage-persistence-boundary-plan.md` as the planning authority for future Knowledge acceptance, storage, and persistence boundaries.
- Distinguished candidate, accepted, rejected, and persisted evidence plus proposed and applied progress.
- Kept canonical evidence/progress storage ownership deferred across save, session, character, account, runtime, database, and fixture candidates.
- Defined conceptual evidence/progress collection responsibilities without creating paths or wrappers.
- Recommended no progress mutation before an explicit owner exists; later handling should be atomic when one transactional owner exists or replayable and idempotent from durable accepted evidence.
- Defined deterministic duplicate, replay, occurrence identity, sequence-authority, owner-authority, and missing-progress-record boundaries.
- Selected `Version 0.5.136 - Knowledge Storage Fixture Boundary Plan` as the next docs-only run.
- Added no implementation, tests, schemas, fixtures, content, validators, helpers, registration, state, persistence, runtime, completion, trials, UI/main-menu, generated output, ownership mutation, or gameplay behavior.

## Active Guardrails For 0.5.136

Knowledge Storage Fixture Boundary Plan:

- Produce a planning document only; do not create evidence or progress fixtures.
- Define a test-only collection fixture contract, exact wrapper posture, authority inputs, fixture identities, and positive/negative acceptance scenarios.
- Keep fixture data isolated from authored content, normal content lint, runtime state, save/account/session state, and persistence.
- Do not choose a production storage owner or canonical save/session/database path.
- Do not implement acceptance, mutation, progress-record initialization, replay infrastructure, or sequence generation.
- Keep the producer, proposal helper, validators, schemas, focused tests, snippets, registry, skills, spells, and main-menu unchanged.

Current follow-up risks:

- No canonical evidence or progress storage owner or acceptance implementation exists.
- Character owner authority remains pattern-only.
- Progress-record initialization remains undefined.
- Occurrence equivalence still depends on a producer-issued stable event, action, or occurrence identity.
- Canonical acquired-sequence and character identity authorities remain undefined.
- The plan defines duplicate/replay posture, but persistent replay infrastructure, stacking limits, anti-farming, and source-specific equivalence remain undefined.
- Atomic evidence/progress handling is recommended but not implemented.
- Non-evidence operations remain unauthorized.
- Zero-state persistence policy remains undefined.
- `progressSources`, persistent audit history, replay, and reason vocabularies remain deferred.
- Completion thresholds, tier aggregation, trial readiness, persistence, and UI remain undefined.
- Arcane Lore progress remains blocked while the domain is planned.
- Retain evidence, progress, proposal, producer, and storage-boundary guardrails through fixture, initialization, and acceptance planning.

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
| 10 | `0.5.135` | Knowledge Storage And Persistence Boundary Plan | `docs/design/knowledge-storage-persistence-boundary-plan.md` | Completed |
| 11 | `0.5.136` | Knowledge Storage Fixture Boundary Plan | `docs/design/knowledge-storage-persistence-boundary-plan.md` | Next |
| 12 | `0.5.x` | Knowledge Progress Record Initialization Plan | Future focused plan | Deferred |
| 13 | `0.5.x` | Knowledge Evidence Acceptance Helper Plan | Future focused plan | Deferred |
| 14 | `0.5.x` | Knowledge Evidence Acceptance Helper | Future focused implementation | Deferred |
| 15 | `0.5.x` | Knowledge Completion Rules Plan | Future focused plan | Deferred |
| 16 | `0.5.x` | Knowledge Trials Plan | Future focused plan | Deferred |
| 17 | `0.5.x` | Knowledge UI Plan | Future focused plan | Deferred |

## Next Prompt Source Stack

For `Version 0.5.136 - Knowledge Storage Fixture Boundary Plan`, inspect:

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
- `docs/design/knowledge-storage-persistence-boundary-plan.md`
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
