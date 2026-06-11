# Current GPT Handoff

Source route: Codex local implementation after `Version 0.5.130 - Knowledge Progress Semantic Validator`
Date: 2026-06-11
Branch/status assumption: `master` at commit `fa4d0f2` before edits; the worktree was clean.

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
- `packages/schemas/player/knowledge_evidence.schema.json` owns the structural contract for one evidence record.
- `tools/content-lint/knowledge-evidence.mjs` owns the pure evidence semantic-validation boundary.
- `packages/content/base/player/knowledge_snippets.json` remains the authored snippet authority.
- `packages/content/base/player/knowledge_domain_registry.json` remains broad domain compatibility metadata.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.130 - Knowledge Progress Semantic Validator`

Immediate next version:

- `Version 0.5.131 - Knowledge Evidence-to-Progress Rules Plan`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.130 Result

- Added `tools/content-lint/knowledge-progress.mjs` as a pure, deterministic, side-effect-free helper.
- Added `tests/unit/knowledge-progress-validation.test.mjs` with 59 in-memory tests.
- Enforced the exact `{ records: [...] }` wrapper and progress schema before semantics.
- Delegated supplied evidence validation to `tools/content-lint/knowledge-evidence.mjs`.
- Rejected duplicate progress ids, duplicate owner-and-snippet identities, duplicate supplied evidence ids, duplicate authority ids, and same-wrapper cross-record evidence consumption.
- Enforced active snippet/domain resolution, character-only owner posture, and exact consumed-evidence owner and target parity.
- Allowed empty wrappers and zero-value/empty-evidence records only through explicit out-of-band options.
- Rejected positive progress without evidence and zero progress with consumed evidence.
- Preserved existing snippet strictness and rejected deferred progress, completion, trial, UI, event, persistence, owner-shortcut, embedded-evidence, and generated fields through schema-first validation.
- Added no progress/evidence JSON, content, state, normal content-lint registration, schema edit, existing-validator behavior edit, runtime producer, persistence, UI/main-menu work, generated output, completion, trial, ownership, or gameplay behavior.

## Active Guardrails For 0.5.131

Knowledge Evidence-to-Progress Rules Plan:

- Produce a planning document only; do not implement calculation or mutation behavior.
- Treat the evidence schema and validator plus progress schema and validator as current boundary authorities.
- Define which semantically valid evidence may contribute to one progress record.
- Define deterministic integer delta posture without treating `progressValue` as a percentage or completion.
- Decide repeatability, stacking, duplicate credit, occurrence equivalence, ordering, and same-evidence consumption policy.
- Decide whether any non-evidence operation may grant progress; default to none unless explicitly justified.
- Define how `updatedSequence` relates to accepted operations without selecting persistence or a runtime producer.
- Preserve character-only owner parity and exact snippet/domain/subject parity.
- Keep `progressSources`, audit deltas, replay records, and reason vocabularies deferred unless the plan explicitly selects them.
- Do not create evidence or progress JSON/content/state, runtime producers/loaders, persistence, save/account/session shape, normal lint registration, completion, trials, UI, generated output, ownership behavior, or gameplay behavior.
- Do not edit evidence/progress/snippet schemas or validators, authored snippets, registry content, skills, spells, or main-menu files.

Current follow-up risks:

- No canonical evidence or progress storage path exists.
- Character owner authority remains pattern-only.
- Evidence weights, repeatability, stacking, occurrence equivalence, and authorized non-evidence operations remain undefined.
- Cross-record evidence-consumption policy may need refinement when calculation rules are planned.
- Zero-state persistence policy remains undefined.
- `progressSources` remains deferred.
- Completion thresholds, tier aggregation, trial readiness, persistence, and UI remain undefined.
- Arcane Lore progress remains blocked while the domain is planned.
- Retain evidence and progress planning guardrails through evidence-to-progress planning, then make an explicit cleanup decision.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.126` | Knowledge Progress State Plan | `docs/design/knowledge-progress-state-plan.md` | Completed |
| 2 | `0.5.127` | Knowledge Progress Schema Plan | `docs/design/knowledge-progress-schema-plan.md` | Completed |
| 3 | `0.5.128` | Knowledge Progress Schema | `packages/schemas/player/knowledge_progress.schema.json` | Completed |
| 4 | `0.5.129` | Knowledge Progress Semantic Validator Plan | `docs/design/knowledge-progress-semantic-validator-plan.md` | Completed |
| 5 | `0.5.130` | Knowledge Progress Semantic Validator | `tools/content-lint/knowledge-progress.mjs` | Completed |
| 6 | `0.5.131` | Knowledge Evidence-to-Progress Rules Plan | Evidence and progress authorities | Next |
| 7 | `0.5.x` | Knowledge Evidence Producers Plan | Future focused plan | Deferred |
| 8 | `0.5.x` | Knowledge Completion Rules Plan | Future focused plan | Deferred |
| 9 | `0.5.x` | Knowledge Trials Plan | Future focused plan | Deferred |
| 10 | `0.5.x` | Knowledge UI Plan | Future focused plan | Deferred |

## Next Prompt Source Stack

For `Version 0.5.131 - Knowledge Evidence-to-Progress Rules Plan`, inspect:

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
- `packages/schemas/player/knowledge_evidence.schema.json`
- `packages/schemas/player/knowledge_progress.schema.json`
- `tools/content-lint/knowledge-evidence.mjs`
- `tools/content-lint/knowledge-progress.mjs`
- `tests/unit/knowledge-evidence-validation.test.mjs`
- `tests/unit/knowledge-progress-validation.test.mjs`
- `packages/content/base/player/knowledge_snippets.json`
- `packages/content/base/player/knowledge_domain_registry.json`
- `docs/future_content_backlog.md`
