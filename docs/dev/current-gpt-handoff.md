# Current GPT Handoff

Source route: Codex local planning after `Version 0.5.131 - Knowledge Evidence-to-Progress Rules Plan`
Date: 2026-06-11
Branch/status assumption: `master` at commit `bcaf7f1` before edits; the worktree was clean.

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
- `packages/schemas/player/knowledge_evidence.schema.json` owns the structural contract for one evidence record.
- `tools/content-lint/knowledge-evidence.mjs` owns the pure evidence semantic-validation boundary.
- `packages/content/base/player/knowledge_snippets.json` remains the authored snippet authority.
- `packages/content/base/player/knowledge_domain_registry.json` remains broad domain compatibility metadata.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.131 - Knowledge Evidence-to-Progress Rules Plan`

Immediate next version:

- `Version 0.5.132 - Knowledge Evidence-to-Progress Rules`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.131 Result

- Added the planning-only authority at `docs/design/knowledge-evidence-to-progress-rules-plan.md`.
- Selected `tools/content-lint/knowledge-evidence-to-progress.mjs` as the future pure in-memory helper.
- Required existing semantically valid evidence and one existing semantically valid target progress record.
- Selected exact character owner and snippet/domain/subject parity plus active-domain eligibility.
- Selected one positive integer point per eligible evidence id with no weights, percentages, decay, caps, thresholds, completion, or trials.
- Blocked duplicate candidate ids, already consumed ids, and ids consumed by another supplied progress record.
- Kept distinct valid evidence ids independently eligible because occurrence equivalence has no current authority.
- Selected deterministic evidence-id ordering and explicit numeric sequence proposals without clocks or hidden state.
- Required an inert proposal envelope with no mutation, persistence, completion, trial unlock, UI output, event, reward, or ownership effect.
- Prohibited automatic progress-record creation, non-evidence credit, `progressSources`, persisted delta history, normal lint registration, and canonical evidence/progress storage.
- Added no implementation, tests, schema, validator, content, runtime, persistence, UI, generated output, ownership, or gameplay behavior.

## Active Guardrails For 0.5.132

Knowledge Evidence-to-Progress Rules:

- Implement only `tools/content-lint/knowledge-evidence-to-progress.mjs` and `tests/unit/knowledge-evidence-to-progress.test.mjs`.
- Keep the helper pure, deterministic, side-effect-free, filesystem-free, and in-memory fixture driven.
- Gate inputs through the existing evidence and progress semantic validators.
- Require one existing valid target progress record; do not auto-create progress.
- Preserve exact character owner and snippet/domain/subject parity.
- Award exactly `+1` per eligible evidence id.
- Reject duplicate, already consumed, cross-record-consumed, unsupported-source/context, planned-domain, and mismatched evidence.
- Sort evidence ids deterministically and derive sequence only from explicit numeric inputs.
- Return an inert proposal envelope; never mutate, persist, emit events, calculate completion, unlock trials, or produce UI.
- Do not add normal content-lint registration, canonical state paths, `progressSources`, persisted delta history, non-evidence operations, occurrence equivalence, caps, anti-farming, thresholds, completion, trials, producers, or runtime behavior.
- Do not edit evidence/progress/snippet schemas or existing validators, authored snippets, registry content, skills, spells, or main-menu files.

Current follow-up risks:

- No canonical evidence or progress storage path exists.
- Character owner authority remains pattern-only.
- Progress-record initialization remains undefined.
- Occurrence equivalence, stacking limits, anti-farming, and producer-issued grouping identity remain undefined.
- Non-evidence operations remain unauthorized.
- Zero-state persistence policy remains undefined.
- `progressSources`, persistent audit history, replay, and reason vocabularies remain deferred.
- Completion thresholds, tier aggregation, trial readiness, persistence, and UI remain undefined.
- Arcane Lore progress remains blocked while the domain is planned.
- Retain evidence and progress planning guardrails through `0.5.132`, then make an explicit cleanup decision.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.126` | Knowledge Progress State Plan | `docs/design/knowledge-progress-state-plan.md` | Completed |
| 2 | `0.5.127` | Knowledge Progress Schema Plan | `docs/design/knowledge-progress-schema-plan.md` | Completed |
| 3 | `0.5.128` | Knowledge Progress Schema | `packages/schemas/player/knowledge_progress.schema.json` | Completed |
| 4 | `0.5.129` | Knowledge Progress Semantic Validator Plan | `docs/design/knowledge-progress-semantic-validator-plan.md` | Completed |
| 5 | `0.5.130` | Knowledge Progress Semantic Validator | `tools/content-lint/knowledge-progress.mjs` | Completed |
| 6 | `0.5.131` | Knowledge Evidence-to-Progress Rules Plan | `docs/design/knowledge-evidence-to-progress-rules-plan.md` | Completed |
| 7 | `0.5.132` | Knowledge Evidence-to-Progress Rules | `docs/design/knowledge-evidence-to-progress-rules-plan.md` | Next |
| 8 | `0.5.x` | Knowledge Evidence Producers Plan | Future focused plan | Deferred |
| 9 | `0.5.x` | Knowledge Completion Rules Plan | Future focused plan | Deferred |
| 10 | `0.5.x` | Knowledge Trials Plan | Future focused plan | Deferred |
| 11 | `0.5.x` | Knowledge UI Plan | Future focused plan | Deferred |

## Next Prompt Source Stack

For `Version 0.5.132 - Knowledge Evidence-to-Progress Rules`, inspect:

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
- `packages/schemas/player/knowledge_evidence.schema.json`
- `packages/schemas/player/knowledge_progress.schema.json`
- `tools/content-lint/knowledge-evidence.mjs`
- `tools/content-lint/knowledge-progress.mjs`
- `tests/unit/knowledge-evidence-validation.test.mjs`
- `tests/unit/knowledge-progress-validation.test.mjs`
- `packages/content/base/player/knowledge_snippets.json`
- `packages/content/base/player/knowledge_domain_registry.json`
- `docs/future_content_backlog.md`
