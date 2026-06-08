# Current GPT Handoff

Source route: Codex local implementation after `Version 0.5.123 - Knowledge Evidence Schema`
Date: 2026-06-08
Branch/status assumption: `master` at commit `40a1150` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-evidence-contract-plan.md` owns future evidence identity, beneficiary ownership, source/context relationships, validation boundaries, and sequence.
- `docs/design/knowledge-evidence-schema-plan.md` owns the approved future evidence record schema path, exact first-schema field contract, identifier patterns, enum posture, acquisition-context shape, and schema acceptance criteria.
- `packages/schemas/player/knowledge_evidence.schema.json` owns the live structural contract for one future evidence record only.
- `docs/design/knowledge-snippet-content-authoring-plan.md` owns snippet authoring boundaries.
- `docs/design/knowledge-snippet-semantic-validator-plan.md` owns the snippet validation contract.
- `tools/content-lint/knowledge-snippets.mjs` owns current authored snippet validation.
- `packages/schemas/player/knowledge_snippet.schema.json` owns authored snippet structure only.
- `packages/content/base/player/knowledge_snippets.json` remains the authored snippet catalog.
- `packages/content/base/player/knowledge_domain_registry.json` remains broad domain compatibility metadata.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.123 - Knowledge Evidence Schema`

Immediate next version:

- `Version 0.5.124 - Knowledge Evidence Semantic Validator Plan`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.123 Result

- Added `packages/schemas/player/knowledge_evidence.schema.json`.
- Registered the schema in `tests/unit/schema-files.test.mjs`.
- Implemented the exact 12-field strict record contract with canonical identifier patterns and no undeclared properties.
- Preserved subject and source enum parity with the live snippet schema.
- Limited `ownerScope` to `character`.
- Kept `sourceId` required and nullable.
- Added the strict required `contextType` context object with only the approved optional references and biome tags.
- Required at least one unique non-empty note.
- Added no evidence collection, content, state, semantic validation, runtime loading, persistence, progress, completion, trials, UI, events, ownership behavior, or gameplay behavior.

## Active Guardrails For 0.5.124

Knowledge Evidence Semantic Validator Plan:

- Keep the next run planning-only.
- Define the future evidence wrapper gate, schema-first validation flow, reference authorities, source/context compatibility matrix, duplicate-id checks, and focused test plan.
- Keep `sourceId` non-null use blocked until source-specific authorities exist.
- Keep `character` as the only approved owner scope and define owner-id resolution without adding owner state.
- Separate duplicate record identity from duplicate progress credit.
- Do not implement a validator, evidence JSON/state, runtime producer, persistence, progress, completion, trials, UI, events, ownership mutation, or gameplay behavior.
- Do not change the evidence schema, snippet content/schema/validator, registry content, skills, spells, or main-menu files.

Current follow-up risks:

- Character owner-id resolution remains a later semantic authority concern.
- Event, action, item-instance, document, teacher, institution, quest-outcome, and Chronicle authorities remain undefined.
- A single acquisition-context object requires strict later source/context compatibility checks.
- Duplicate identity and duplicate progress credit are separate policies and must not be conflated.
- Family/account sharing can fabricate inherited knowledge if owner rules are permissive.
- Arcane Lore snippets remain blocked while the domain is planned.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.119` | Knowledge Snippet Semantic Validator Plan | `docs/design/knowledge-snippet-semantic-validator-plan.md` | Completed |
| 2 | `0.5.120` | Knowledge Snippet Semantic Validator | `tools/content-lint/knowledge-snippets.mjs` | Completed |
| 3 | `0.5.121` | Knowledge Evidence Contract Plan | `docs/design/knowledge-evidence-contract-plan.md` | Completed |
| 4 | `0.5.122` | Knowledge Evidence Schema Plan | `docs/design/knowledge-evidence-schema-plan.md` | Completed |
| 5 | `0.5.123` | Knowledge Evidence Schema | `packages/schemas/player/knowledge_evidence.schema.json` | Completed |
| 6 | `0.5.124` | Knowledge Evidence Semantic Validator Plan | `packages/schemas/player/knowledge_evidence.schema.json` | Next |
| 7 | `0.5.125` | Knowledge Evidence Semantic Validator | Future validator plan | Planned |
| 8 | `0.5.x` | Knowledge Progress State Plan | Future focused plan | Deferred |
| 9 | `0.5.x` | Knowledge Progress State Schema | Future progress plan | Deferred |
| 10 | `0.5.x` | Knowledge Evidence-to-Progress Rules Plan | Future focused plan | Deferred |
| 11 | `0.5.x` | Knowledge Trials Plan | Future focused plan | Deferred |
| 12 | `0.5.x` | Knowledge UI Plan | Future focused plan | Deferred |

## Next Prompt Source Stack

For `Version 0.5.124 - Knowledge Evidence Semantic Validator Plan`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-evidence-contract-plan.md`
- `docs/design/knowledge-evidence-schema-plan.md`
- `packages/schemas/player/knowledge_evidence.schema.json`
- `docs/design/knowledge-snippet-content-authoring-plan.md`
- `docs/design/knowledge-snippet-semantic-validator-plan.md`
- `docs/design/knowledge-domain-registry-plan.md`
- `docs/design/knowledge-boundary-glossary.md`
- `docs/design/knowledge-registry-field-ownership.md`
- `packages/schemas/player/knowledge_snippet.schema.json`
- `packages/content/base/player/knowledge_snippets.json`
- `packages/content/base/player/knowledge_domain_registry.json`
- `tools/content-lint/knowledge-snippets.mjs`
- `tests/unit/knowledge-snippets-validation.test.mjs`
- `tests/unit/schema-files.test.mjs`
- `docs/future_content_backlog.md`
