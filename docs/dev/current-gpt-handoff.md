# Current GPT Handoff

Source route: Codex local implementation after `Version 0.5.120 - Knowledge Snippet Semantic Validator`
Date: 2026-06-07
Branch/status assumption: `master` at commit `daa9972` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `tools/content-lint/knowledge-snippets.mjs` owns pure authored snippet structural and semantic validation.
- `tools/content-lint/index.mjs` owns executable lint orchestration and checked-file registration.
- `tests/unit/knowledge-snippets-validation.test.mjs` owns focused validator regression coverage.
- `docs/design/knowledge-snippet-semantic-validator-plan.md` remains the validator authority and test-contract reference.
- `packages/schemas/player/knowledge_snippet.schema.json` remains the authored-record structural contract.
- `packages/content/base/player/knowledge_snippets.json` remains the authored snippet catalog.
- `packages/content/base/player/knowledge_domain_registry.json` remains broad domain compatibility authority.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.120 - Knowledge Snippet Semantic Validator`

Immediate next version:

- `Version 0.5.121 - Knowledge Evidence Contract Plan`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.120 Result

- Added a snippet-scoped fail-closed structural adapter covering the exact live schema keywords, including `description`, `minimum`, and `maximum`.
- Added active-domain, subject-authority, domain-collection, discovery-source, location, visibility, prerequisite-reference, duplicate-skill, and cycle checks.
- Kept settlement, spell, item, culture, institution, ruin, historical-event, and custom subject mappings blocked or deferred.
- Added 49 focused tests covering the current catalog and required negative mutations.
- Added `knowledge_snippets.json` to normal content lint; the command now reports 55 files checked.
- Preserved the exact four-record catalog and all content/schema/registry/skill/runtime/UI/main-menu/generated/persistence/state/gameplay files outside lint tooling and tests.

## Active Guardrails For 0.5.121

Knowledge Evidence Contract Plan:

- Keep the next run planning-only.
- Define what constitutes evidence versus a possible discovery route.
- Define stable evidence identity, source type, source record, subject/snippet link, owner scope, acquisition context, and validation boundaries.
- Preserve the separation between authored snippet metadata, evidence instances, progress state, completion math, trials, and UI.
- Do not implement runtime loading, evidence storage, progress state, completion math, trials, UI, events, persistence, ownership mutation, or gameplay behavior.
- Do not broaden blocked snippet authorities or activate Arcane Lore snippets.

Current follow-up risks:

- Discovery source declarations are routes only; they must not be reused as evidence instances.
- Broad-registry `relatedSkillIds` and knowledge-domain links do not grant evidence, snippets, or completion.
- Source authority for non-null `sourceId` remains unplanned and therefore rejected.
- Evidence owner scopes need an explicit contract before any state shape or persistence work.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.118` | Knowledge Snippet Seed Data | `packages/content/base/player/knowledge_snippets.json` | Completed |
| 2 | `0.5.119` | Knowledge Snippet Semantic Validator Plan | `docs/design/knowledge-snippet-semantic-validator-plan.md` | Completed |
| 3 | `0.5.120` | Knowledge Snippet Semantic Validator | `tools/content-lint/knowledge-snippets.mjs` | Completed |
| 4 | `0.5.121` | Knowledge Evidence Contract Plan | Future focused plan | Next |
| 5 | `0.5.x` | Knowledge Progress State Plan | Future focused plan | Deferred |
| 6 | `0.5.x` | Knowledge Trial Plan | Future focused plan | Deferred |
| 7 | `0.5.x` | Knowledge UI Plan | Future focused plan | Deferred |

## Next Prompt Source Stack

For `Version 0.5.121 - Knowledge Evidence Contract Plan`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
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
- `docs/future_content_backlog.md`
