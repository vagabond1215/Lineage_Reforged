# Current GPT Handoff

Source route: Codex local planning after `Version 0.5.116 - Knowledge Snippet Content Authoring Plan`
Date: 2026-06-07
Branch/status assumption: `master` at commit `5a83420` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-snippet-content-authoring-plan.md` owns the exact first seed records, schema readiness, subject authorities, semantic checks, and implementation sequence.
- `packages/schemas/player/knowledge_snippet.schema.json` is the current planning schema to harden next.
- `docs/design/knowledge-domain-registry-plan.md` owns domain purpose, status meaning, source vocabulary, and ownership boundaries.
- `packages/content/base/player/knowledge_domain_registry.json` is the broad domain authority.
- `docs/design/skill-knowledge-domain-reference-realignment-plan.md` retains deferred Folk Lore and Civic Lore decisions.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.116 - Knowledge Snippet Content Authoring Plan`

Immediate next version:

- `Version 0.5.117 - Knowledge Snippet Schema Hardening`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.116 Result

- Selected `packages/content/base/player/knowledge_snippets.json` with an exact `records` wrapper.
- Defined exactly four Tier 1 records:
  - Aloe identification
  - Badger identification
  - Iron Ore identification
  - Kaelvar cultural context
- Limited the first seed to active Flora, Fauna, Minerals, and General Lore domains.
- Excluded planned Arcane Lore.
- Defined schema hardening requirements, initial subject authorities, semantic validation rules, and the later implementation sequence.
- Changed documentation only.

## Active Guardrails For 0.5.117

Knowledge Snippet Schema Hardening:

- Edit only `packages/schemas/player/knowledge_snippet.schema.json`, its focused schema-file registration/test, and required handoff documentation.
- Register the schema in `tests/unit/schema-files.test.mjs`.
- Require `summary` and all three progression fields.
- Add canonical snippet, domain, subject, skill, location, and tag patterns.
- Add non-empty string and exact duplicate protections described by the authoring plan.
- Preserve current Tier 1-10, rank 0-125, subject, category, and source vocabularies.
- Keep prerequisites and `hiddenSummary` optional.
- Do not add snippet content JSON.
- Do not add semantic validator behavior, runtime loading, evidence, progress, completion, trials, UI, events, persistence, or ownership.
- Do not add a general JSON Schema dependency.

Current follow-up risks:

- The broad Arcane Lore record retains a stale future-link note; do not edit registry content without explicit authorization.
- Folk Lore awaits a cultures-domain authority.
- Civic Lore awaits a focused domain-ownership decision.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.115` | Skill Knowledge Domain Reference Realignment | `packages/content/base/player/skills.json` | Completed |
| 2 | `0.5.116` | Knowledge Snippet Content Authoring Plan | `docs/design/knowledge-snippet-content-authoring-plan.md` | Completed |
| 3 | `0.5.117` | Knowledge Snippet Schema Hardening | `docs/design/knowledge-snippet-content-authoring-plan.md` | Next |
| 4 | `0.5.118` | Knowledge Snippet Seed Data | `docs/design/knowledge-snippet-content-authoring-plan.md` | Planned |
| 5 | `0.5.119` | Knowledge Snippet Semantic Validator Plan | `docs/design/knowledge-snippet-content-authoring-plan.md` | Planned |
| 6 | `0.5.120` | Knowledge Snippet Semantic Validator | Future validator plan | Planned |
| 7 | `0.5.x` | Knowledge Evidence Contract Plan | Future focused plan | Deferred |
| 8 | `0.5.x` | Knowledge Progress State Plan | Future focused plan | Deferred |
| 9 | `0.5.x` | Knowledge Completion Helper Plan | Future focused plan | Deferred |
| 10 | `0.5.x` | Knowledge Trial Plan | Future focused plan | Deferred |
| 11 | `0.5.x` | Knowledge UI Plan | Future focused plan | Deferred |

## Next Prompt Source Stack

For `Version 0.5.117 - Knowledge Snippet Schema Hardening`, inspect:

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
- `tests/unit/schema-files.test.mjs`
- `docs/future_content_backlog.md`
