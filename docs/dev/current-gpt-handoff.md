# Current GPT Handoff

Source route: Codex local planning after `Version 0.5.114 - Skill Knowledge Domain Reference Realignment Plan`
Date: 2026-06-06
Branch/status assumption: `master` at commit `aa6e702` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/skill-knowledge-domain-reference-realignment-plan.md` owns the exact skill audit, Arcane Lore decision, deferred Folk/Civic decisions, implementation scope, and validation expectations.
- `docs/design/knowledge-domain-registry-plan.md` owns domain purpose, groups, waves, and ownership boundaries.
- `docs/design/knowledge-domain-registry-schema-plan.md` owns registry paths and reference authorities.
- `docs/design/knowledge-domain-registry-seed-data-plan.md` owns the five Wave 0 records.
- `tools/content-lint/knowledge-domain-registry.mjs` is the live validator.
- `tests/unit/knowledge-domain-registry-validation.test.mjs` is the focused mutation-test authority.
- `packages/content/base/player/knowledge_domain_registry.json` is the broad catalog.
- `packages/content/base/player/knowledge_domains.json` remains the narrow identification-policy subset.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.114 - Skill Knowledge Domain Reference Realignment Plan`

Immediate next version:

- `Version 0.5.115 - Skill Knowledge Domain Reference Realignment`

Do not roll to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.114 Result

- Audited all ten current skill `knowledgeDomainId` values; all resolve to broad registry ids and legacy policy ids.
- Confirmed the existing Flora, Fauna, Minerals, and General Lore knowledge-skill links need no changes.
- Selected `knowledge_domain.arcane_lore` for the later `skill.knowledge.arcane_lore` metadata link.
- Deferred `skill.knowledge.cultural_lore` until a cultures-domain authority exists.
- Deferred `skill.knowledge.civic_lore` until a focused civic-domain ownership decision and required broad domain exist.
- Identified the focused positive test that assumes Arcane Lore remains unlinked.
- Changed documentation only.

## Active Guardrails For 0.5.115

Implement exactly:

- Add `knowledgeDomainId: "knowledge_domain.arcane_lore"` to `skill.knowledge.arcane_lore` in `packages/content/base/player/skills.json`.
- Update the positive unreferenced-domain test in `tests/unit/knowledge-domain-registry-validation.test.mjs` so it constructs an unreferenced domain condition in its cloned fixture instead of depending on live Arcane Lore content.

Do not change:

- other skill records
- broad registry content or status
- legacy `knowledge_domains.json`
- schemas
- validator behavior
- runtime loaders
- persistence or state
- snippets, completion, trials, UI, events, or ownership

Boundary rules:

- The Arcane Lore field is metadata alignment only.
- It grants no spells, magic-school access, study completion, evidence, snippets, or trial progress.
- The broad registry remains non-runtime-loaded.
- Legacy identification policy remains a separate subset.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.113` | Knowledge Domain Registry Semantic Validator | `tools/content-lint/knowledge-domain-registry.mjs` | Completed |
| 2 | `0.5.114` | Skill Knowledge Domain Reference Realignment Plan | `docs/design/skill-knowledge-domain-reference-realignment-plan.md` | Completed |
| 3 | `0.5.115` | Skill Knowledge Domain Reference Realignment | `docs/design/skill-knowledge-domain-reference-realignment-plan.md` | Next |
| 4 | `0.5.x` | Knowledge Snippet Content Authoring Plan | Knowledge registry plans and snippet schema | Deferred |
| 5 | `0.5.x` | Knowledge Evidence Contract Plan | Future focused plan | Deferred |
| 6 | `0.5.x` | Knowledge Progress State Plan | Future focused plan | Deferred |
| 7 | `0.5.x` | Knowledge Trial Plan | Future focused plan | Deferred |
| 8 | `0.5.x` | Knowledge UI Plan | Future focused plan | Deferred |

## Next Prompt Source Stack

For `Version 0.5.115 - Skill Knowledge Domain Reference Realignment`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/skill-knowledge-domain-reference-realignment-plan.md`
- `packages/content/base/player/skills.json`
- `packages/content/base/player/knowledge_domain_registry.json`
- `packages/content/base/player/knowledge_domains.json`
- `tools/content-lint/knowledge-domain-registry.mjs`
- `tests/unit/knowledge-domain-registry-validation.test.mjs`
- `docs/future_content_backlog.md`
