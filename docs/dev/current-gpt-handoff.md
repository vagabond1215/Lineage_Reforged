# Current GPT Handoff

Source route: Codex local documentation after `Version 0.5.127 - Knowledge Progress Schema Plan`
Date: 2026-06-08
Branch/status assumption: `master` at commit `d7852c2` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-progress-state-plan.md` owns progress identity, character ownership, snippet/evidence relationships, integer-value posture, validation boundary, and sequence.
- `docs/design/knowledge-progress-schema-plan.md` owns the exact first-schema path, required fields, patterns, enums, array and notes posture, forbidden fields, schema tests, and `0.5.128` acceptance criteria.
- `docs/design/knowledge-evidence-contract-plan.md`, `docs/design/knowledge-evidence-schema-plan.md`, and `docs/design/knowledge-evidence-semantic-validator-plan.md` remain evidence boundary guardrails through progress semantic validation and evidence-to-progress planning.
- `packages/schemas/player/knowledge_evidence.schema.json` owns the structural contract for one evidence record.
- `tools/content-lint/knowledge-evidence.mjs` owns the current pure evidence validation boundary.
- `packages/content/base/player/knowledge_snippets.json` remains the authored snippet authority.
- `packages/content/base/player/knowledge_domain_registry.json` remains broad domain compatibility metadata.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.127 - Knowledge Progress Schema Plan`

Immediate next version:

- `Version 0.5.128 - Knowledge Progress Schema`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.127 Result

- Added `docs/design/knowledge-progress-schema-plan.md` as the exact first-schema authority.
- Selected `packages/schemas/player/knowledge_progress.schema.json` as a strict record-level schema only.
- Required the 11 approved progress identity, snippet snapshot, owner, value, consumed-evidence, sequence, and notes fields.
- Selected exact progress, snippet, domain, subject, owner, and evidence id patterns.
- Preserved the live snippet `subjectType` enum and character-only `ownerScope`.
- Selected integer `progressValue` and `updatedSequence` with minimum zero and no progress maximum.
- Allowed an empty `consumedEvidenceIds` array structurally while deferring zero-state persistence and value consistency to semantic/storage policy.
- Required at least one unique non-empty note.
- Kept `progressSources`, completion, trial, UI, event, generated-output, and persistence fields out of the first schema.
- Added no schema, state, validator, source, content, test, runtime, UI/main-menu, persistence, generated, or gameplay change.

## Active Guardrails For 0.5.128

Knowledge Progress Schema:

- Create only `packages/schemas/player/knowledge_progress.schema.json`.
- Update only the focused schema-file registration needed in `tests/unit/schema-files.test.mjs`, plus normal handoff docs.
- Use `docs/design/knowledge-progress-schema-plan.md` as the exact contract.
- Require all 11 planned fields.
- Use `type: "object"`, `additionalProperties: false`, and no defaults.
- Use exact planned patterns and enums.
- Allow `consumedEvidenceIds: []` structurally; do not add conditional zero-state behavior.
- Require `notes` with `minItems: 1`, `uniqueItems: true`, and non-empty strings.
- Keep `progressSources` and all completion, trial, UI, event, generated-output, persistence, and owner-shortcut fields absent.
- Do not create progress or evidence JSON/content/state.
- Do not implement a progress semantic validator, evidence-to-progress rules, runtime producers, persistence, UI, events, completion, trials, ownership behavior, or gameplay behavior.
- Do not edit evidence/snippet schemas or validators, authored snippets, registry content, skills, spells, or main-menu files.

Current follow-up risks:

- No canonical evidence or progress storage path exists.
- Character owner authority remains pattern-only.
- Empty consumed-evidence arrays are structurally allowed, but zero-state persistence policy remains undefined.
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
| 6 | `0.5.128` | Knowledge Progress Schema | `docs/design/knowledge-progress-schema-plan.md` | Next |
| 7 | `0.5.x` | Knowledge Progress Semantic Validator Plan | Progress plans and schema | Deferred |
| 8 | `0.5.x` | Knowledge Progress Semantic Validator | Future validator plan | Deferred |
| 9 | `0.5.x` | Knowledge Evidence-to-Progress Rules Plan | Progress authorities | Deferred |
| 10 | `0.5.x` | Knowledge Evidence Producers Plan | Future focused plan | Deferred |
| 11 | `0.5.x` | Knowledge Completion Rules Plan | Future focused plan | Deferred |
| 12 | `0.5.x` | Knowledge Trials Plan | Future focused plan | Deferred |
| 13 | `0.5.x` | Knowledge UI Plan | Future focused plan | Deferred |

## Next Prompt Source Stack

For `Version 0.5.128 - Knowledge Progress Schema`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-progress-state-plan.md`
- `docs/design/knowledge-progress-schema-plan.md`
- `packages/schemas/player/knowledge_evidence.schema.json`
- `packages/schemas/player/knowledge_snippet.schema.json`
- `tests/unit/schema-files.test.mjs`
- `docs/future_content_backlog.md`
