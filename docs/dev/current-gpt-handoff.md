# Current GPT Handoff

Source route: Codex local documentation after `Version 0.5.126 - Knowledge Progress State Plan`
Date: 2026-06-08
Branch/status assumption: `master` at commit `9a107a7` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-progress-state-plan.md` owns progress identity, character ownership, snippet/evidence relationships, integer-value posture, schema boundary, validation boundary, and sequence.
- `docs/design/knowledge-evidence-contract-plan.md` owns evidence identity, beneficiary ownership, source/context relationships, validation boundaries, and sequence.
- `docs/design/knowledge-evidence-schema-plan.md` owns the evidence record schema design and structural boundary.
- `docs/design/knowledge-evidence-semantic-validator-plan.md` remains the consumed validator guardrail and should be retained through progress schema and evidence-to-progress planning.
- `packages/schemas/player/knowledge_evidence.schema.json` owns the structural contract for one evidence record.
- `tools/content-lint/knowledge-evidence.mjs` owns the current pure evidence wrapper, schema-first, reference, source/context, and duplicate-identity validation boundary.
- `tests/unit/knowledge-evidence-validation.test.mjs` owns focused in-memory evidence-validator coverage.
- `packages/content/base/player/knowledge_snippets.json` remains the authored snippet authority.
- `packages/content/base/player/knowledge_domain_registry.json` remains broad domain compatibility metadata.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.126 - Knowledge Progress State Plan`

Immediate next version:

- `Version 0.5.127 - Knowledge Progress Schema Plan`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.126 Result

- Added `docs/design/knowledge-progress-state-plan.md` as a planning-only authority.
- Defined progress as character-owned state for one authored snippet, separate from authored content, evidence, completion, trials, and UI.
- Selected finite non-negative integer progress points without percentage or threshold semantics.
- Planned strict snippet/domain/subject snapshots, character-only owner scope, pattern-only owner ids, unique consumed evidence ids, and deterministic update sequences.
- Kept `consumedEvidenceIds` as the first audit boundary.
- Deferred `progressSources` from the first schema until source kinds, integer deltas, reason vocabulary, and replay expectations are defined.
- Recommended `packages/schemas/player/knowledge_progress.schema.json` as the future strict record-level schema path.
- Kept storage, persistence, save/session state, evidence producers, evidence-to-progress computation, completion, trials, UI, events, and gameplay behavior deferred.
- Changed no source, schema, content, validator, test, runtime, UI/main-menu, generated, persistence, or gameplay file.

## Active Guardrails For 0.5.127

Knowledge Progress Schema Plan:

- Keep the next run planning-only.
- Use `docs/design/knowledge-progress-state-plan.md` as the primary authority.
- Freeze the exact first-schema required fields, identifier patterns, enum and integer constraints, consumed-evidence array posture, notes posture, and schema-file test expectations.
- Keep `progressSources` out of the first schema unless the plan identifies a narrow contract that does not invent delta policy.
- Preserve character-only ownership and pattern-only `ownerId`.
- Keep the future schema strict, record-level, and free of defaults, wrappers, UI, completion, trial, event, persistence, and generated-output fields.
- Do not create progress JSON/content/state or canonical evidence state.
- Do not edit evidence, snippet, registry, skill, spell, runtime, UI/main-menu, persistence, save/account/session, generated, or gameplay files.

Current follow-up risks:

- No canonical evidence or progress storage path exists.
- Character owner authority remains pattern-only.
- Evidence-to-progress weights, duplicate credit, repeatability, stacking, and authorized non-evidence operations remain undefined.
- `progressSources` remains deferred.
- Completion thresholds, tier aggregation, trial readiness, persistence, and UI remain undefined.
- Arcane Lore snippets, evidence, and progress remain blocked while the domain is planned.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.121` | Knowledge Evidence Contract Plan | `docs/design/knowledge-evidence-contract-plan.md` | Completed |
| 2 | `0.5.122` | Knowledge Evidence Schema Plan | `docs/design/knowledge-evidence-schema-plan.md` | Completed |
| 3 | `0.5.123` | Knowledge Evidence Schema | `packages/schemas/player/knowledge_evidence.schema.json` | Completed |
| 4 | `0.5.124` | Knowledge Evidence Semantic Validator Plan | `docs/design/knowledge-evidence-semantic-validator-plan.md` | Completed |
| 5 | `0.5.125` | Knowledge Evidence Semantic Validator | `tools/content-lint/knowledge-evidence.mjs` | Completed |
| 6 | `0.5.126` | Knowledge Progress State Plan | `docs/design/knowledge-progress-state-plan.md` | Completed |
| 7 | `0.5.127` | Knowledge Progress Schema Plan | `docs/design/knowledge-progress-state-plan.md` | Next |
| 8 | `0.5.x` | Knowledge Progress Schema | Future schema plan | Deferred |
| 9 | `0.5.x` | Knowledge Progress Semantic Validator Plan | Future schema and state plans | Deferred |
| 10 | `0.5.x` | Knowledge Progress Semantic Validator | Future validator plan | Deferred |
| 11 | `0.5.x` | Knowledge Evidence-to-Progress Rules Plan | Progress authorities | Deferred |
| 12 | `0.5.x` | Knowledge Evidence Producers Plan | Future focused plan | Deferred |
| 13 | `0.5.x` | Knowledge Completion Rules Plan | Future focused plan | Deferred |
| 14 | `0.5.x` | Knowledge Trials Plan | Future focused plan | Deferred |
| 15 | `0.5.x` | Knowledge UI Plan | Future focused plan | Deferred |

## Next Prompt Source Stack

For `Version 0.5.127 - Knowledge Progress Schema Plan`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-progress-state-plan.md`
- `docs/design/knowledge-evidence-contract-plan.md`
- `docs/design/knowledge-evidence-schema-plan.md`
- `docs/design/knowledge-evidence-semantic-validator-plan.md`
- `packages/schemas/player/knowledge_evidence.schema.json`
- `tools/content-lint/knowledge-evidence.mjs`
- `tests/unit/knowledge-evidence-validation.test.mjs`
- `packages/schemas/player/knowledge_snippet.schema.json`
- `packages/content/base/player/knowledge_snippets.json`
- `packages/content/base/player/knowledge_domain_registry.json`
- `tests/unit/schema-files.test.mjs`
- `docs/future_content_backlog.md`
