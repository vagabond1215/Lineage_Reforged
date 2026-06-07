# Current GPT Handoff

Source route: Codex local implementation after `Version 0.5.118 - Knowledge Snippet Seed Data`
Date: 2026-06-07
Branch/status assumption: `master` at commit `a790dde` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-snippet-content-authoring-plan.md` owns the exact first seed records, schema readiness, subject authorities, semantic checks, and implementation sequence.
- `packages/schemas/player/knowledge_snippet.schema.json` is the live authored-record structural contract.
- `packages/content/base/player/knowledge_snippets.json` is the authored snippet catalog.
- `docs/design/knowledge-domain-registry-plan.md` owns domain purpose, status meaning, source vocabulary, and ownership boundaries.
- `packages/content/base/player/knowledge_domain_registry.json` is the broad domain authority.
- `docs/design/skill-knowledge-domain-reference-realignment-plan.md` retains deferred Folk Lore and Civic Lore decisions.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.118 - Knowledge Snippet Seed Data`

Immediate next version:

- `Version 0.5.119 - Knowledge Snippet Semantic Validator Plan`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.118 Result

- Added `packages/content/base/player/knowledge_snippets.json` with the exact `records` wrapper.
- Added exactly four Tier 1 records in approved order:
  - Aloe identification
  - Badger identification
  - Iron Ore identification
  - Kaelvar cultural context
- Preserved exact plan text, sources, weights, visibility, and notes.
- Confirmed all four records pass the hardened schema and reference active broad domains and current canonical subjects.
- Added no semantic validator, schema/registry/skill changes, runtime loading, state, UI, generated output, or gameplay behavior.

## Active Guardrails For 0.5.119

Knowledge Snippet Semantic Validator Plan:

- Create a planning-only validator contract from Section 8 of the authoring plan.
- Define schema-first validation ownership, wrapper checks, active-domain compatibility, subject authorities, source/category compatibility, reference resolution, prerequisite graph checks, location checks, custom/source-id posture, focused tests, and lint orchestration.
- Keep the current four-record content and hardened schema unchanged unless the audit proves a blocking defect.
- Do not implement validator code or tests during the planning pass.
- Do not add runtime loading, evidence, progress, completion, trials, UI, events, persistence, ownership, or gameplay behavior.

Current follow-up risks:

- Normal content lint does not yet validate the snippet wrapper or records.
- `hiddenSummary` when locked, duplicate discovery declarations, non-null source authority, and prerequisite graph rules remain semantic checks.
- The broad Arcane Lore record retains a stale future-link note; do not edit registry content without explicit authorization.
- Folk Lore awaits a cultures-domain authority.
- Civic Lore awaits a focused domain-ownership decision.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.115` | Skill Knowledge Domain Reference Realignment | `packages/content/base/player/skills.json` | Completed |
| 2 | `0.5.116` | Knowledge Snippet Content Authoring Plan | `docs/design/knowledge-snippet-content-authoring-plan.md` | Completed |
| 3 | `0.5.117` | Knowledge Snippet Schema Hardening | `packages/schemas/player/knowledge_snippet.schema.json` | Completed |
| 4 | `0.5.118` | Knowledge Snippet Seed Data | `packages/content/base/player/knowledge_snippets.json` | Completed |
| 5 | `0.5.119` | Knowledge Snippet Semantic Validator Plan | `docs/design/knowledge-snippet-content-authoring-plan.md` | Next |
| 6 | `0.5.120` | Knowledge Snippet Semantic Validator | Future validator plan | Planned |
| 7 | `0.5.x` | Knowledge Evidence Contract Plan | Future focused plan | Deferred |
| 8 | `0.5.x` | Knowledge Progress State Plan | Future focused plan | Deferred |
| 9 | `0.5.x` | Knowledge Completion Helper Plan | Future focused plan | Deferred |
| 10 | `0.5.x` | Knowledge Trial Plan | Future focused plan | Deferred |
| 11 | `0.5.x` | Knowledge UI Plan | Future focused plan | Deferred |

## Next Prompt Source Stack

For `Version 0.5.119 - Knowledge Snippet Semantic Validator Plan`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-snippet-content-authoring-plan.md`
- `docs/design/knowledge-domain-registry-plan.md`
- `packages/schemas/player/knowledge_snippet.schema.json`
- `packages/content/base/player/knowledge_snippets.json`
- `packages/content/base/player/knowledge_domain_registry.json`
- `tools/content-lint/index.mjs`
- `tools/content-lint/knowledge-domain-registry.mjs`
- `packages/content/base/world/flora.json`
- `packages/content/base/world/fauna.json`
- `packages/content/base/world/minerals.json`
- `packages/content/base/world/regions.json`
- `tests/unit/knowledge-domain-registry-validation.test.mjs`
- `docs/future_content_backlog.md`
