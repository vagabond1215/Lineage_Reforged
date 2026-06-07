# Current GPT Handoff

Source route: Codex local implementation after `Version 0.5.117 - Knowledge Snippet Schema Hardening`
Date: 2026-06-07
Branch/status assumption: `master` at commit `a2e6405` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-snippet-content-authoring-plan.md` owns the exact first seed records, schema readiness, subject authorities, semantic checks, and implementation sequence.
- `packages/schemas/player/knowledge_snippet.schema.json` is the live authored-record structural contract.
- `docs/design/knowledge-domain-registry-plan.md` owns domain purpose, status meaning, source vocabulary, and ownership boundaries.
- `packages/content/base/player/knowledge_domain_registry.json` is the broad domain authority.
- `docs/design/skill-knowledge-domain-reference-realignment-plan.md` retains deferred Folk Lore and Civic Lore decisions.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.117 - Knowledge Snippet Schema Hardening`

Immediate next version:

- `Version 0.5.118 - Knowledge Snippet Seed Data`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.117 Result

- Hardened the existing record-level schema without adding a content wrapper schema.
- Required all intended live authored fields, including `summary`, `notes`, and all three progression fields.
- Added canonical patterns for snippet, domain, subject, prerequisite skill, location, and biome-tag values.
- Added non-empty authored-string and exact-duplicate protections.
- Preserved Tier 1-10, rank 0-125, subject, category, and discovery-source vocabularies.
- Kept prerequisites and `hiddenSummary` optional, with `hiddenSummary` nullable and non-empty when non-null.
- Registered the schema in `tests/unit/schema-files.test.mjs`.
- Added no snippet JSON, semantic validation, registry/skill changes, runtime loading, state, UI, generated output, or gameplay behavior.

## Active Guardrails For 0.5.118

Knowledge Snippet Seed Data:

- Create only `packages/content/base/player/knowledge_snippets.json` plus required handoff documentation.
- Use the exact top-level `{ "records": [...] }` wrapper from the authoring plan.
- Add exactly the four approved Tier 1 records in authored order: Aloe, Badger, Iron Ore, and Kaelvar.
- Preserve the exact ids, fields, text, sources, weights, visibility values, and notes from Section 6 of the authoring plan unless canonical source inspection proves a blocker.
- Do not add Arcane Lore or other records.
- Do not edit the hardened schema, registry content, skills, or existing validators unless a blocking defect is proven and separately reported.
- Do not add semantic validator behavior, runtime loading, evidence, progress, completion, trials, UI, events, persistence, or ownership.

Current follow-up risks:

- No snippet semantic validator exists, so the seed run needs focused local structural/reference audits in addition to existing tests.
- The broad Arcane Lore record retains a stale future-link note; do not edit registry content without explicit authorization.
- Folk Lore awaits a cultures-domain authority.
- Civic Lore awaits a focused domain-ownership decision.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.115` | Skill Knowledge Domain Reference Realignment | `packages/content/base/player/skills.json` | Completed |
| 2 | `0.5.116` | Knowledge Snippet Content Authoring Plan | `docs/design/knowledge-snippet-content-authoring-plan.md` | Completed |
| 3 | `0.5.117` | Knowledge Snippet Schema Hardening | `packages/schemas/player/knowledge_snippet.schema.json` | Completed |
| 4 | `0.5.118` | Knowledge Snippet Seed Data | `docs/design/knowledge-snippet-content-authoring-plan.md` | Next |
| 5 | `0.5.119` | Knowledge Snippet Semantic Validator Plan | `docs/design/knowledge-snippet-content-authoring-plan.md` | Planned |
| 6 | `0.5.120` | Knowledge Snippet Semantic Validator | Future validator plan | Planned |
| 7 | `0.5.x` | Knowledge Evidence Contract Plan | Future focused plan | Deferred |
| 8 | `0.5.x` | Knowledge Progress State Plan | Future focused plan | Deferred |
| 9 | `0.5.x` | Knowledge Completion Helper Plan | Future focused plan | Deferred |
| 10 | `0.5.x` | Knowledge Trial Plan | Future focused plan | Deferred |
| 11 | `0.5.x` | Knowledge UI Plan | Future focused plan | Deferred |

## Next Prompt Source Stack

For `Version 0.5.118 - Knowledge Snippet Seed Data`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-snippet-content-authoring-plan.md`
- `docs/design/knowledge-domain-registry-plan.md`
- `packages/schemas/player/knowledge_snippet.schema.json`
- `packages/content/base/player/knowledge_domain_registry.json`
- `packages/content/base/world/flora.json`
- `packages/content/base/world/fauna.json`
- `packages/content/base/world/minerals.json`
- `packages/content/base/world/regions.json`
- `tests/unit/schema-files.test.mjs`
- `docs/future_content_backlog.md`
