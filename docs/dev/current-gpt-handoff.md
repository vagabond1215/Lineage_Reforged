# Current GPT Handoff

Source route: Codex local planning after `Version 0.5.129 - Knowledge Progress Semantic Validator Plan`
Date: 2026-06-10
Branch/status assumption: `master` at commit `111885a` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-progress-state-plan.md` owns progress identity, character ownership, snippet/evidence relationships, integer-value posture, and broad validation boundaries.
- `docs/design/knowledge-progress-schema-plan.md` owns first-schema rationale.
- `packages/schemas/player/knowledge_progress.schema.json` owns the strict structural contract for one progress record.
- `docs/design/knowledge-progress-semantic-validator-plan.md` now owns the first progress semantic-validator wrapper, authority, parity, duplicate-consumption, zero-state, test, acceptance, and sequencing decisions.
- `packages/schemas/player/knowledge_evidence.schema.json` owns the structural contract for one evidence record.
- `tools/content-lint/knowledge-evidence.mjs` owns the current pure evidence semantic-validation boundary.
- `packages/content/base/player/knowledge_snippets.json` remains the authored snippet authority.
- `packages/content/base/player/knowledge_domain_registry.json` remains broad domain compatibility metadata.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.129 - Knowledge Progress Semantic Validator Plan`

Immediate next version:

- `Version 0.5.130 - Knowledge Progress Semantic Validator`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.129 Result

- Added `docs/design/knowledge-progress-semantic-validator-plan.md`.
- Selected `tools/content-lint/knowledge-progress.mjs` as the future pure, deterministic, side-effect-free, in-memory helper.
- Defined the exact `{ records: [...] }` wrapper and schema-first progress-record gate.
- Required consumed evidence to pass the live evidence schema and `tools/content-lint/knowledge-evidence.mjs`.
- Defined active snippet/domain checks and exact domain, subject, owner, and consumed-evidence parity.
- Selected duplicate `progressId`, duplicate owner-and-snippet identity, and same-wrapper cross-record evidence consumption as invalid.
- Defined explicit out-of-band empty-state and zero-state test posture.
- Kept positive progress calculation, weights, repeatability, stacking, occurrence equivalence, authorized non-evidence operations, completion, trials, runtime, persistence, UI, generated output, and ownership behavior deferred.
- Added no validator, tests, progress/evidence content or state, schema edits, runtime code, persistence, UI/main-menu work, or gameplay behavior.

## Active Guardrails For 0.5.130

Knowledge Progress Semantic Validator:

- Implement only `tools/content-lint/knowledge-progress.mjs` and `tests/unit/knowledge-progress-validation.test.mjs`, plus normal docs/handoff updates.
- Keep the helper pure, deterministic, side-effect-free, and driven by in-memory fixtures.
- Validate the exact wrapper and every progress record against `knowledge_progress.schema.json` before progress semantics.
- Do not run progress semantics when progress structure or consumed evidence validation fails.
- Validate supplied evidence through the current evidence semantic validator or a behavior-preserving shared pure path.
- Fail closed on duplicate snippet, domain, and evidence authority ids.
- Enforce active snippet/domain resolution, snapshot parity, character-only owner posture, evidence owner parity, and evidence target parity.
- Reject duplicate progress ids, duplicate owner/scope/snippet tuples, and the same evidence id consumed by more than one progress record in one wrapper.
- Permit empty wrappers and zero-value/empty-evidence records only through explicit out-of-band test options.
- Reject nonzero progress with no consumed evidence and zero progress with consumed evidence.
- Do not verify progress calculation, evidence weights, repeatability, stacking, occurrence equivalence, or non-evidence progress operations.
- Do not create canonical progress/evidence JSON, content, state, persistence, save/account/session shape, runtime producers, or generated output.
- Do not register the helper in normal content lint without an explicitly selected progress path.
- Do not edit progress/evidence/snippet schemas, evidence/snippet validators, authored snippets, registry content, skills, spells, UI/main-menu files, or gameplay systems.

Current follow-up risks:

- No canonical evidence or progress storage path exists.
- Character owner authority remains pattern-only.
- Evidence-to-progress weights and calculation remain undefined.
- Duplicate credit, repeatability, stacking, occurrence equivalence, and authorized non-evidence operations remain undefined.
- Zero-state persistence policy remains undefined.
- `progressSources` remains deferred.
- Completion thresholds, tier aggregation, trial readiness, persistence, and UI remain undefined.
- Arcane Lore progress remains blocked while the domain is planned.
- Retain evidence and progress planning guardrails through progress validation and evidence-to-progress planning, then make an explicit cleanup decision.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.125` | Knowledge Evidence Semantic Validator | `tools/content-lint/knowledge-evidence.mjs` | Completed |
| 2 | `0.5.126` | Knowledge Progress State Plan | `docs/design/knowledge-progress-state-plan.md` | Completed |
| 3 | `0.5.127` | Knowledge Progress Schema Plan | `docs/design/knowledge-progress-schema-plan.md` | Completed |
| 4 | `0.5.128` | Knowledge Progress Schema | `packages/schemas/player/knowledge_progress.schema.json` | Completed |
| 5 | `0.5.129` | Knowledge Progress Semantic Validator Plan | `docs/design/knowledge-progress-semantic-validator-plan.md` | Completed |
| 6 | `0.5.130` | Knowledge Progress Semantic Validator | Validator plan | Next |
| 7 | `0.5.x` | Knowledge Evidence-to-Progress Rules Plan | Progress authorities | Deferred |
| 8 | `0.5.x` | Knowledge Evidence Producers Plan | Future focused plan | Deferred |
| 9 | `0.5.x` | Knowledge Completion Rules Plan | Future focused plan | Deferred |
| 10 | `0.5.x` | Knowledge Trials Plan | Future focused plan | Deferred |
| 11 | `0.5.x` | Knowledge UI Plan | Future focused plan | Deferred |

## Next Prompt Source Stack

For `Version 0.5.130 - Knowledge Progress Semantic Validator`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-progress-state-plan.md`
- `docs/design/knowledge-progress-schema-plan.md`
- `docs/design/knowledge-progress-semantic-validator-plan.md`
- `packages/schemas/player/knowledge_progress.schema.json`
- `packages/schemas/player/knowledge_evidence.schema.json`
- `tools/content-lint/knowledge-evidence.mjs`
- `tests/unit/knowledge-evidence-validation.test.mjs`
- `packages/schemas/player/knowledge_snippet.schema.json`
- `packages/content/base/player/knowledge_snippets.json`
- `packages/content/base/player/knowledge_domain_registry.json`
- `docs/future_content_backlog.md`
