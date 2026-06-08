# Current GPT Handoff

Source route: Codex local implementation after `Version 0.5.125 - Knowledge Evidence Semantic Validator`
Date: 2026-06-08
Branch/status assumption: `master` at commit `35d0048` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-evidence-contract-plan.md` owns evidence identity, beneficiary ownership, source/context relationships, validation boundaries, and sequence.
- `docs/design/knowledge-evidence-schema-plan.md` owns the evidence record schema design and structural boundary.
- `docs/design/knowledge-evidence-semantic-validator-plan.md` remains the consumed validator guardrail and should be retained through progress-state and evidence-to-progress planning.
- `packages/schemas/player/knowledge_evidence.schema.json` owns the structural contract for one evidence record.
- `tools/content-lint/knowledge-evidence.mjs` owns the current pure evidence wrapper, schema-first, reference, source/context, and duplicate-identity validation boundary.
- `tests/unit/knowledge-evidence-validation.test.mjs` owns focused in-memory validator coverage.
- `packages/content/base/player/knowledge_snippets.json` remains the authored snippet authority.
- `packages/content/base/player/knowledge_domain_registry.json` remains broad domain compatibility metadata.
- `packages/content/base/world/regions.json` and `packages/content/base/world/settlements.json` are evidence acquisition-context authorities only.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.125 - Knowledge Evidence Semantic Validator`

Immediate next version:

- `Version 0.5.126 - Knowledge Progress State Plan`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.125 Result

- Added `tools/content-lint/knowledge-evidence.mjs`.
- Added `tests/unit/knowledge-evidence-validation.test.mjs` with 76 passing focused tests.
- Implemented exact wrapper validation with explicit empty-state opt-in.
- Implemented a narrow fail-closed adapter for the live evidence schema.
- Validated every record structurally before semantic checks.
- Rejected duplicate evidence ids and duplicate snippet, domain, region, or settlement authority ids.
- Enforced snippet snapshot parity, active-domain resolution, declared source routes, null `sourceId`, character ownership, and every approved source/context mapping.
- Enforced context-field compatibility, blocked non-null unresolved context references, and validated continent, region, settlement, and ancestry relationships.
- Preserved deterministic, side-effect-free behavior and verified input immutability.
- Added no evidence JSON/content/state and no normal content-lint registration.
- Added no runtime producer, persistence, progress, completion, trials, UI, events, ownership behavior, or gameplay behavior.

## Active Guardrails For 0.5.126

Knowledge Progress State Plan:

- Keep the next run planning-only.
- Define progress-state identity, character-first ownership, snippet/domain relationship, evidence-consumption boundary, structural schema posture, duplicate/ordering policy, validation layers, and later implementation sequence.
- Treat valid evidence as possible future progress input, not automatic credit or completion.
- Keep evidence creation, producer authorization, duplicate credit, repeatability, stacking, consumption, confidence, weight, completion math, trials, UI, persistence, and runtime mutation separate unless the plan explicitly decides their future owner.
- Do not create progress JSON/state, schemas, helpers, runtime producers, persistence, UI, or gameplay behavior.
- Do not register the evidence helper in normal content lint without a canonical evidence path.
- Do not change evidence/snippet/domain/world content, current schemas, current validators, skills, spells, or main-menu files.

Current follow-up risks:

- No canonical evidence or progress storage path exists.
- Character owner authority remains pattern-only.
- Evidence duplicate identity is validated, but duplicate progress credit and occurrence equivalence remain undefined.
- Non-null source ids and most context authorities remain blocked.
- Completion percentages, tier aggregation, trial readiness, persistence, and UI remain undefined.
- Arcane Lore snippets and evidence remain blocked while the domain is planned.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.121` | Knowledge Evidence Contract Plan | `docs/design/knowledge-evidence-contract-plan.md` | Completed |
| 2 | `0.5.122` | Knowledge Evidence Schema Plan | `docs/design/knowledge-evidence-schema-plan.md` | Completed |
| 3 | `0.5.123` | Knowledge Evidence Schema | `packages/schemas/player/knowledge_evidence.schema.json` | Completed |
| 4 | `0.5.124` | Knowledge Evidence Semantic Validator Plan | `docs/design/knowledge-evidence-semantic-validator-plan.md` | Completed |
| 5 | `0.5.125` | Knowledge Evidence Semantic Validator | `tools/content-lint/knowledge-evidence.mjs` | Completed |
| 6 | `0.5.126` | Knowledge Progress State Plan | Current evidence authorities and validator | Next |
| 7 | `0.5.x` | Knowledge Progress State Schema | Future progress-state plan | Deferred |
| 8 | `0.5.x` | Knowledge Evidence-to-Progress Rules Plan | Future progress-state plan | Deferred |
| 9 | `0.5.x` | Knowledge Evidence Producers Plan | Future focused plan | Deferred |
| 10 | `0.5.x` | Knowledge Trials Plan | Future focused plan | Deferred |
| 11 | `0.5.x` | Knowledge UI Plan | Future focused plan | Deferred |

## Next Prompt Source Stack

For `Version 0.5.126 - Knowledge Progress State Plan`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-evidence-contract-plan.md`
- `docs/design/knowledge-evidence-schema-plan.md`
- `docs/design/knowledge-evidence-semantic-validator-plan.md`
- `packages/schemas/player/knowledge_evidence.schema.json`
- `tools/content-lint/knowledge-evidence.mjs`
- `tests/unit/knowledge-evidence-validation.test.mjs`
- `packages/schemas/player/knowledge_snippet.schema.json`
- `packages/content/base/player/knowledge_snippets.json`
- `packages/content/base/player/knowledge_domain_registry.json`
- `docs/design/knowledge-boundary-glossary.md`
- `docs/design/knowledge-registry-field-ownership.md`
- `docs/future_content_backlog.md`
