# Current GPT Handoff

Source route: Codex local planning after `Version 0.5.136 - Knowledge Storage Fixture Boundary Plan`
Date: 2026-06-12
Branch/status assumption: `master` at commit `79ae418` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-storage-fixture-boundary-plan.md` owns the planned test-only fixture path family, wrapper posture, scenario matrix, non-authority boundary, lint isolation, and future fixture implementation criteria.
- `docs/design/knowledge-storage-persistence-boundary-plan.md` owns the candidate/accepted/persisted distinction, future acceptance pipeline, collection responsibilities, duplicate/replay posture, atomicity recommendation, sequence authority requirements, and deferred storage-owner decision.
- `docs/design/knowledge-progress-state-plan.md` owns progress identity, character ownership, snippet/evidence relationships, integer-value posture, and broad validation boundaries.
- `packages/schemas/player/knowledge_progress.schema.json` owns the strict structural contract for one progress record.
- `tools/content-lint/knowledge-progress.mjs` owns the pure progress semantic-validation boundary.
- `tools/content-lint/knowledge-evidence-to-progress.mjs` owns the pure evidence-to-progress proposal boundary.
- `tools/content-lint/knowledge-evidence-producers.mjs` owns the pure observation evidence candidate boundary.
- `packages/schemas/player/knowledge_evidence.schema.json` owns the structural contract for one evidence record.
- `tools/content-lint/knowledge-evidence.mjs` owns the pure evidence semantic-validation boundary.
- `packages/content/base/player/knowledge_snippets.json` remains the authored snippet authority.
- `packages/content/base/player/knowledge_domain_registry.json` remains broad domain compatibility metadata.
- `docs/design/skill-mastery-trial-framework-plan.md` owns the separate Skill-trial and Magic-study planning posture.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.136 - Knowledge Storage Fixture Boundary Plan`

Immediate next version:

- `Version 0.5.137 - Knowledge Progress Record Initialization Plan`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.136 Result

- Added `docs/design/knowledge-storage-fixture-boundary-plan.md` as the planning authority for future test-only Knowledge fixture documents and storage scenarios.
- Recommended the planned-only `tests/fixtures/knowledge/` path family without creating it.
- Defined separate accepted-evidence and progress fixture envelopes using test-only collection identity, fixture version, and records.
- Kept fixture metadata outside the exact current `{ records }` validator wrappers; future tests must project cloned records into unchanged current helpers.
- Defined combined scenario identity, current-authority, sequence, owner, positive, negative, duplicate, replay, immutability, lint-isolation, and non-persistence boundaries.
- Kept Knowledge, Skill, and Spell/Magic Study trials separate.
- Selected `Version 0.5.137 - Knowledge Progress Record Initialization Plan` as the next docs-only run.
- Added no fixtures, fixture directories, loaders, adapters, schemas, tests, helpers, content, registration, storage, persistence, runtime, mutation, completion, trials, UI/main-menu, generated output, or gameplay behavior.

## Active Guardrails For 0.5.137

Knowledge Progress Record Initialization Plan:

- Produce a planning document only; do not create progress records, fixture files, helpers, or tests.
- Define exactly when a character-owned progress record may be initialized.
- Require current active snippet/domain/subject authority and exact character-owner parity.
- Freeze zero-point, empty-consumed-evidence, note, and explicit initial-sequence posture.
- Decide whether initialization may be proposed from accepted evidence, an explicit request, or both.
- Reject duplicate initialization for an existing character/snippet target.
- Keep initialization output pure and inert; do not accept evidence, apply progress, persist state, or mutate storage.
- Do not choose canonical save/session/account/runtime/database ownership.
- Keep current producers, proposal helper, validators, schemas, snippets, registry, skills, spells, fixtures, content lint registration, and main-menu unchanged.

Current follow-up risks:

- No canonical evidence or progress storage owner or acceptance implementation exists.
- Character owner authority remains pattern-only.
- Progress-record initialization is still undefined until `0.5.137`.
- Occurrence equivalence still depends on a producer-issued stable event, action, or occurrence identity.
- Canonical acquired-sequence and character identity authorities remain undefined.
- Persistent replay infrastructure, stacking limits, anti-farming, and source-specific equivalence remain undefined.
- Atomic evidence/progress handling is recommended but not implemented.
- Fixture paths and wrappers are planned only and must not be treated as production contracts.
- Zero-state persistence policy remains undefined.
- `progressSources`, persistent audit history, replay, and reason vocabularies remain deferred.
- Completion thresholds, tier aggregation, trial readiness, persistence, and UI remain undefined.
- Arcane Lore progress remains blocked while no active Arcane snippet exists.
- Retain evidence, progress, proposal, producer, storage-boundary, and fixture-boundary guardrails through initialization and acceptance planning.

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
| 11 | `0.5.136` | Knowledge Storage Fixture Boundary Plan | `docs/design/knowledge-storage-fixture-boundary-plan.md` | Completed |
| 12 | `0.5.137` | Knowledge Progress Record Initialization Plan | Future focused plan | Next |
| 13 | `0.5.x` | Knowledge Progress Record Initialization Helper Plan | Future focused plan | Deferred |
| 14 | `0.5.x` | Knowledge Progress Record Initialization Helper | Future focused implementation | Deferred |
| 15 | `0.5.x` | Knowledge Evidence Acceptance Helper Plan | Future focused plan | Deferred |
| 16 | `0.5.x` | Knowledge Evidence Acceptance Helper | Future focused implementation | Deferred |
| 17 | `0.5.x` | Knowledge Progress Application Helper Plan | Future focused plan | Deferred |
| 18 | `0.5.x` | Knowledge Progress Application Helper | Future focused implementation | Deferred |
| 19 | `0.5.x` | Knowledge Completion Rules Plan | Future focused plan | Deferred |
| 20 | `0.5.x` | Knowledge Trial Rules Plan | Future focused plan | Deferred |
| 21 | `0.5.x` | Knowledge Read-Model Plan | Future focused plan | Deferred |

## Next Prompt Source Stack

For `Version 0.5.137 - Knowledge Progress Record Initialization Plan`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-progress-state-plan.md`
- `docs/design/knowledge-progress-schema-plan.md`
- `docs/design/knowledge-progress-semantic-validator-plan.md`
- `docs/design/knowledge-evidence-to-progress-rules-plan.md`
- `docs/design/knowledge-storage-persistence-boundary-plan.md`
- `docs/design/knowledge-storage-fixture-boundary-plan.md`
- `packages/schemas/player/knowledge_progress.schema.json`
- `packages/schemas/player/knowledge_evidence.schema.json`
- `tools/content-lint/knowledge-progress.mjs`
- `tools/content-lint/knowledge-evidence.mjs`
- `tools/content-lint/knowledge-evidence-to-progress.mjs`
- `tests/unit/knowledge-progress-validation.test.mjs`
- `tests/unit/knowledge-evidence-validation.test.mjs`
- `tests/unit/knowledge-evidence-to-progress.test.mjs`
- `packages/content/base/player/knowledge_snippets.json`
- `packages/content/base/player/knowledge_domain_registry.json`
- `docs/future_content_backlog.md`
