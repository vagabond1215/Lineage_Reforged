# Current GPT Handoff

Source route: Codex local planning after `Version 0.5.122 - Knowledge Evidence Schema Plan`
Date: 2026-06-08
Branch/status assumption: `master` at commit `458a250` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-evidence-contract-plan.md` owns future evidence identity, beneficiary ownership, source/context relationships, validation boundaries, and sequence.
- `docs/design/knowledge-evidence-schema-plan.md` owns the approved future evidence record schema path, exact first-schema field contract, identifier patterns, enum posture, acquisition-context shape, and schema acceptance criteria.
- `docs/design/knowledge-snippet-content-authoring-plan.md` owns snippet authoring boundaries.
- `docs/design/knowledge-snippet-semantic-validator-plan.md` owns the snippet validation contract.
- `tools/content-lint/knowledge-snippets.mjs` owns current authored snippet validation.
- `packages/schemas/player/knowledge_snippet.schema.json` owns authored snippet structure only.
- `packages/content/base/player/knowledge_snippets.json` remains the authored snippet catalog.
- `packages/content/base/player/knowledge_domain_registry.json` remains broad domain compatibility metadata.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.122 - Knowledge Evidence Schema Plan`

Immediate next version:

- `Version 0.5.123 - Knowledge Evidence Schema`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.122 Result

- Added `docs/design/knowledge-evidence-schema-plan.md`.
- Selected `packages/schemas/player/knowledge_evidence.schema.json` as the future strict record-level schema.
- Kept evidence as future runtime/state data rather than authored base content and selected no evidence JSON path.
- Required explicit identity, snippet/domain/subject/source, character owner, deterministic sequence, strict acquisition context, and notes fields.
- Selected `character` as the only first-schema owner scope; family/account remain blocked and settlement/faction remain deferred.
- Kept `sourceId` nullable and semantically blocked from non-null use until authorities exist.
- Selected a closed acquisition-context object with a required context type and strict nullable reference fields.
- Deferred source-specific context compatibility to a separate semantic-validator plan.
- Changed documentation only.

## Active Guardrails For 0.5.123

Knowledge Evidence Schema:

- Implement only `packages/schemas/player/knowledge_evidence.schema.json`, focused schema-file registration, and normal handoff updates.
- Use a strict record-level schema with all fields and patterns selected by `docs/design/knowledge-evidence-schema-plan.md`.
- Keep `character` as the only `ownerScope` enum value.
- Keep `sourceId` required and nullable.
- Keep deferred acquired time, confidence, weight, progress, completion, trial, UI, generated-output, and consumer-state fields out.
- Do not create evidence JSON, evidence state, a wrapper schema, semantic validator, runtime loader, persistence, UI, events, ownership mutation, or gameplay behavior.
- Do not change snippet content, snippet schema, snippet validator, registry content, skills, spells, or main-menu files.

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
| 5 | `0.5.123` | Knowledge Evidence Schema | `docs/design/knowledge-evidence-schema-plan.md` | Next |
| 6 | `0.5.x` | Knowledge Evidence Semantic Validator Plan | Future focused plan | Deferred |
| 7 | `0.5.x` | Knowledge Evidence Semantic Validator | Future validator plan | Deferred |
| 8 | `0.5.x` | Knowledge Progress State Plan | Future focused plan | Deferred |
| 9 | `0.5.x` | Knowledge Progress State Schema | Future progress plan | Deferred |
| 10 | `0.5.x` | Knowledge Evidence-to-Progress Rules Plan | Future focused plan | Deferred |
| 11 | `0.5.x` | Knowledge Trials Plan | Future focused plan | Deferred |
| 12 | `0.5.x` | Knowledge UI Plan | Future focused plan | Deferred |

## Next Prompt Source Stack

For `Version 0.5.123 - Knowledge Evidence Schema`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-evidence-contract-plan.md`
- `docs/design/knowledge-evidence-schema-plan.md`
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
