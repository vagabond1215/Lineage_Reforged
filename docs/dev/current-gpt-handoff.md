# Current GPT Handoff

Source route: Codex local implementation after `Version 0.5.115 - Skill Knowledge Domain Reference Realignment`
Date: 2026-06-07
Branch/status assumption: `master` at commit `07c92de` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/skill-knowledge-domain-reference-realignment-plan.md` retains the deferred Folk Lore and Civic Lore link decisions and metadata boundaries.
- `packages/schemas/player/knowledge_snippet.schema.json` is the current structural vocabulary authority for future snippet planning.
- `docs/design/knowledge-domain-registry-plan.md` owns domain purpose, groups, waves, and ownership boundaries.
- `packages/content/base/player/knowledge_domain_registry.json` is the broad catalog.
- `packages/content/base/player/knowledge_domains.json` remains the narrow identification-policy subset.
- `tools/content-lint/knowledge-domain-registry.mjs` is the live validator.
- `tests/unit/knowledge-domain-registry-validation.test.mjs` is the focused mutation-test authority.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.115 - Skill Knowledge Domain Reference Realignment`

Immediate next version:

- `Version 0.5.116 - Knowledge Snippet Content Authoring Plan`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.115 Result

- Added `knowledgeDomainId: "knowledge_domain.arcane_lore"` to `skill.knowledge.arcane_lore`.
- Left Folk Lore and Civic Lore unlinked.
- Changed the positive optional-reference test to remove Arcane references in a cloned fixture before validation.
- Preserved the unknown skill-domain rejection test and validator behavior.
- Changed no registry content, legacy policy, schema, runtime, persistence, UI, generated output, state, snippet, trial, event, or ownership behavior.

## Active Guardrails For 0.5.116

Knowledge Snippet Content Authoring Plan:

- Planning-only pass.
- Audit `knowledge_snippet.schema.json` and the five broad registry domains.
- Define the first narrow authored snippet set, content path and wrapper, reference authorities, validation ownership, and later implementation sequence.
- Keep domain metadata, snippet definitions, player evidence, progress state, completion math, trials, runtime loading, and UI as separate owners.
- Do not create snippet JSON, schemas, validators, runtime loaders, persistence, UI, events, or generated output.
- Do not treat skill rank, known spells, document possession, access, observation, or registry relationships as completion.

Current follow-up risks:

- The broad Arcane Lore record retains a now-stale note that says a later skill-link pass must decide the link. Do not edit it without explicit registry-content authorization.
- Folk Lore awaits a cultures-domain authority.
- Civic Lore awaits a focused domain-ownership decision.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.114` | Skill Knowledge Domain Reference Realignment Plan | `docs/design/skill-knowledge-domain-reference-realignment-plan.md` | Completed |
| 2 | `0.5.115` | Skill Knowledge Domain Reference Realignment | `packages/content/base/player/skills.json` | Completed |
| 3 | `0.5.116` | Knowledge Snippet Content Authoring Plan | `packages/schemas/player/knowledge_snippet.schema.json` | Next |
| 4 | `0.5.x` | Knowledge Snippet Content Authoring | Future plan | Deferred |
| 5 | `0.5.x` | Knowledge Evidence Contract Plan | Future focused plan | Deferred |
| 6 | `0.5.x` | Knowledge Progress State Plan | Future focused plan | Deferred |
| 7 | `0.5.x` | Knowledge Trial Plan | Future focused plan | Deferred |
| 8 | `0.5.x` | Knowledge UI Plan | Future focused plan | Deferred |

## Next Prompt Source Stack

For `Version 0.5.116 - Knowledge Snippet Content Authoring Plan`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-domain-registry-plan.md`
- `docs/design/knowledge-domain-registry-schema-plan.md`
- `docs/design/knowledge-domain-registry-seed-data-plan.md`
- `docs/design/skill-knowledge-domain-reference-realignment-plan.md`
- `packages/schemas/player/knowledge_snippet.schema.json`
- `packages/content/base/player/knowledge_domain_registry.json`
- `packages/content/base/player/skills.json`
- `docs/future_content_backlog.md`
