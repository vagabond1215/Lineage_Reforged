# Current GPT Handoff

Source route: Codex local implementation after `Version 0.5.128 - Knowledge Progress Schema`
Date: 2026-06-09
Branch/status assumption: `master` at commit `bd782ec` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-progress-state-plan.md` owns progress identity, character ownership, snippet/evidence relationships, integer-value posture, validation boundary, and sequence.
- `docs/design/knowledge-progress-schema-plan.md` remains the implementation rationale and first-schema acceptance authority.
- `packages/schemas/player/knowledge_progress.schema.json` now owns the strict structural contract for one progress record.
- `docs/design/knowledge-evidence-contract-plan.md`, `docs/design/knowledge-evidence-schema-plan.md`, and `docs/design/knowledge-evidence-semantic-validator-plan.md` remain evidence boundary guardrails through progress semantic validation and evidence-to-progress planning.
- `packages/schemas/player/knowledge_evidence.schema.json` owns the structural contract for one evidence record.
- `tools/content-lint/knowledge-evidence.mjs` owns the current pure evidence validation boundary.
- `packages/content/base/player/knowledge_snippets.json` remains the authored snippet authority.
- `packages/content/base/player/knowledge_domain_registry.json` remains broad domain compatibility metadata.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.128 - Knowledge Progress Schema`

Immediate next version:

- `Version 0.5.129 - Knowledge Progress Semantic Validator Plan`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.128 Result

- Added `packages/schemas/player/knowledge_progress.schema.json` as a strict record-level schema only.
- Required the 11 approved progress identity, snippet snapshot, character owner, value, consumed-evidence, sequence, and notes fields.
- Applied exact progress, snippet, domain, subject, owner, and evidence id patterns.
- Preserved the live snippet `subjectType` enum and character-only `ownerScope`.
- Defined integer `progressValue` and `updatedSequence` with minimum zero and no progress maximum.
- Allowed an empty `consumedEvidenceIds` array structurally while deferring evidence existence, eligibility, parity, credit, and cross-record policy.
- Required at least one unique non-empty note.
- Kept `progressSources`, completion, trial, UI, event, generated-output, persistence, and owner-shortcut fields out of the schema.
- Registered the schema in `tests/unit/schema-files.test.mjs`.
- Added no progress/evidence content or state, semantic validator, runtime producer, persistence, completion, trial, UI/main-menu, generated, ownership, or gameplay change.

## Active Guardrails For 0.5.129

Knowledge Progress Semantic Validator Plan:

- Produce a planning document only; do not implement the validator or tests.
- Treat `packages/schemas/player/knowledge_progress.schema.json` as the structural authority.
- Define a schema-first pure-helper boundary using in-memory fixture wrappers, without selecting canonical progress storage or normal content-lint registration.
- Plan exact wrapper shape, duplicate progress identity checks, one-record-per-owner-and-snippet semantics, active snippet/domain reference checks, and snapshot parity for `domainId`, `subjectType`, and `subjectId`.
- Plan character-only owner enforcement while keeping `ownerId` pattern-only unless a current authority is explicitly selected.
- Plan consumed evidence existence, character owner parity, snippet/domain/subject target parity, and duplicate or cross-record consumption policy without defining evidence-to-progress weights.
- Keep `progressValue` as a non-negative integer state value, not a percentage, completion flag, or calculation result.
- Decide the first validator posture for empty consumed-evidence arrays and zero/nonzero progress consistency without creating persistence policy.
- Keep `progressSources`, evidence-credit weights, repeatability, stacking, completion, trials, UI, events, runtime producers, persistence, generated output, ownership mutation, and gameplay behavior deferred.
- Do not edit progress/evidence/snippet schemas, authored content, current validators, registry content, skills, spells, or main-menu files.

Current follow-up risks:

- No canonical evidence or progress storage path exists.
- Character owner authority remains pattern-only.
- Empty consumed-evidence arrays are structurally allowed, but semantic consistency is not yet defined.
- Evidence-to-progress weights, duplicate credit, repeatability, stacking, and cross-record consumption remain undefined.
- `progressSources` remains deferred.
- Completion thresholds, tier aggregation, trial readiness, persistence, and UI remain undefined.
- Arcane Lore progress remains blocked while the domain is planned.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.123` | Knowledge Evidence Schema | `packages/schemas/player/knowledge_evidence.schema.json` | Completed |
| 2 | `0.5.124` | Knowledge Evidence Semantic Validator Plan | `docs/design/knowledge-evidence-semantic-validator-plan.md` | Completed |
| 3 | `0.5.125` | Knowledge Evidence Semantic Validator | `tools/content-lint/knowledge-evidence.mjs` | Completed |
| 4 | `0.5.126` | Knowledge Progress State Plan | `docs/design/knowledge-progress-state-plan.md` | Completed |
| 5 | `0.5.127` | Knowledge Progress Schema Plan | `docs/design/knowledge-progress-schema-plan.md` | Completed |
| 6 | `0.5.128` | Knowledge Progress Schema | `packages/schemas/player/knowledge_progress.schema.json` | Completed |
| 7 | `0.5.129` | Knowledge Progress Semantic Validator Plan | Progress plans and live schema | Next |
| 8 | `0.5.x` | Knowledge Progress Semantic Validator | Future validator plan | Deferred |
| 9 | `0.5.x` | Knowledge Evidence-to-Progress Rules Plan | Progress authorities | Deferred |
| 10 | `0.5.x` | Knowledge Evidence Producers Plan | Future focused plan | Deferred |
| 11 | `0.5.x` | Knowledge Completion Rules Plan | Future focused plan | Deferred |
| 12 | `0.5.x` | Knowledge Trials Plan | Future focused plan | Deferred |
| 13 | `0.5.x` | Knowledge UI Plan | Future focused plan | Deferred |

## Next Prompt Source Stack

For `Version 0.5.129 - Knowledge Progress Semantic Validator Plan`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-progress-state-plan.md`
- `docs/design/knowledge-progress-schema-plan.md`
- `packages/schemas/player/knowledge_progress.schema.json`
- `packages/schemas/player/knowledge_evidence.schema.json`
- `tools/content-lint/knowledge-evidence.mjs`
- `tests/unit/knowledge-evidence-validation.test.mjs`
- `packages/schemas/player/knowledge_snippet.schema.json`
- `packages/content/base/player/knowledge_snippets.json`
- `packages/content/base/player/knowledge_domain_registry.json`
- `docs/future_content_backlog.md`
