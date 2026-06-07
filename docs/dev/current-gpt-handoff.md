# Current GPT Handoff

Source route: Codex local planning after `Version 0.5.119 - Knowledge Snippet Semantic Validator Plan`
Date: 2026-06-07
Branch/status assumption: `master` at commit `d03846e` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-snippet-semantic-validator-plan.md` owns the exact validator contract, authority maps, semantic checks, tests, and acceptance criteria.
- `docs/design/knowledge-snippet-content-authoring-plan.md` owns the first seed records and authoring intent.
- `packages/schemas/player/knowledge_snippet.schema.json` is the live authored-record structural contract.
- `packages/content/base/player/knowledge_snippets.json` is the authored snippet catalog.
- `packages/content/base/player/knowledge_domain_registry.json` is the broad domain authority.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.119 - Knowledge Snippet Semantic Validator Plan`

Immediate next version:

- `Version 0.5.120 - Knowledge Snippet Semantic Validator`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.119 Result

- Added `docs/design/knowledge-snippet-semantic-validator-plan.md`.
- Assigned future executable ownership to `tools/content-lint/index.mjs` with an optional pure `tools/content-lint/knowledge-snippets.mjs` helper.
- Defined exact wrapper and schema-first gating, active-domain compatibility, subject and location authorities, discovery-source rules, progression metadata constraints, prerequisite graph checks, blocked values, focused tests, and acceptance criteria.
- Identified that the existing registry structural adapter lacks snippet-schema keywords such as `description`, `minimum`, and `maximum`; the snippet helper needs its own narrow fail-closed adapter.
- Changed documentation only. No snippet, schema, registry, skill, validator, test, runtime, persistence, UI, generated-output, state, ownership, or gameplay behavior changed.

## Active Guardrails For 0.5.120

Knowledge Snippet Semantic Validator:

- Implement only the contract in `docs/design/knowledge-snippet-semantic-validator-plan.md`.
- Keep `tools/content-lint/index.mjs` as the executable owner.
- Prefer a pure `tools/content-lint/knowledge-snippets.mjs` helper plus `tests/unit/knowledge-snippets-validation.test.mjs`.
- Add `knowledge_snippets.json` to normal lint registration; the current 54-file baseline should increment to 55.
- Structurally validate the complete catalog before semantic checks.
- Use a snippet-scoped fail-closed schema adapter covering the exact live snippet-schema keywords.
- Accept the current four records unchanged.
- Do not edit snippet JSON, schemas, registry content, skills, runtime loaders, UI, main-menu files, generated output, persistence, state, ownership, or gameplay behavior.
- At run end, decide whether the temporary authoring and validator plans remain useful, should be consolidated or promoted, or can be removed later.

Current follow-up risks:

- A permissive schema adapter would silently weaken the hardened schema; unsupported keywords must fail closed.
- Settlement, spell, and item subjects are deferred from the first validator even though candidate content files exist.
- Culture, institution, ruin, historical-event, and custom subject authorities remain blocked.
- Arcane Lore snippets remain blocked while `knowledge_domain.arcane_lore` is `planned`.
- General Lore must not bypass a missing specific authority.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.116` | Knowledge Snippet Content Authoring Plan | `docs/design/knowledge-snippet-content-authoring-plan.md` | Completed |
| 2 | `0.5.117` | Knowledge Snippet Schema Hardening | `packages/schemas/player/knowledge_snippet.schema.json` | Completed |
| 3 | `0.5.118` | Knowledge Snippet Seed Data | `packages/content/base/player/knowledge_snippets.json` | Completed |
| 4 | `0.5.119` | Knowledge Snippet Semantic Validator Plan | `docs/design/knowledge-snippet-semantic-validator-plan.md` | Completed |
| 5 | `0.5.120` | Knowledge Snippet Semantic Validator | `docs/design/knowledge-snippet-semantic-validator-plan.md` | Next |
| 6 | `0.5.x` | Knowledge Evidence Contract Plan | Future focused plan | Deferred |
| 7 | `0.5.x` | Knowledge Progress State Plan | Future focused plan | Deferred |
| 8 | `0.5.x` | Knowledge Trial Plan | Future focused plan | Deferred |
| 9 | `0.5.x` | Knowledge UI Plan | Future focused plan | Deferred |

## Next Prompt Source Stack

For `Version 0.5.120 - Knowledge Snippet Semantic Validator`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-snippet-semantic-validator-plan.md`
- `docs/design/knowledge-snippet-content-authoring-plan.md`
- `packages/schemas/player/knowledge_snippet.schema.json`
- `packages/content/base/player/knowledge_snippets.json`
- `packages/content/base/player/knowledge_domain_registry.json`
- `packages/content/base/player/skills.json`
- `packages/content/base/world/flora.json`
- `packages/content/base/world/fauna.json`
- `packages/content/base/world/minerals.json`
- `packages/content/base/world/regions.json`
- `packages/content/base/world/settlements.json`
- `tools/content-lint/index.mjs`
- `tools/content-lint/knowledge-domain-registry.mjs`
- `tests/unit/schema-files.test.mjs`
- `tests/unit/knowledge-domain-registry-validation.test.mjs`
- `docs/future_content_backlog.md`
