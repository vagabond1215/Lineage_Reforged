# Current GPT Handoff

Source route: Codex local content implementation after `Version 0.5.111 - Knowledge Domain Registry Seed Data`
Date: 2026-06-06
Branch/status assumption: `master` at commit `1517ddf` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future ChatGPT/GitHub Connector, Deep Research, Agent Mode, or Codex prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-domain-registry-plan.md` owns domain purpose, groups, waves, source/evidence vocabulary, ownership boundaries, and the five-domain Wave 0 target.
- `docs/design/knowledge-domain-registry-schema-plan.md` owns registry paths, reference authorities, semantic validation ownership, current-data transition rules, and implementation acceptance criteria.
- `docs/design/knowledge-domain-registry-seed-data-plan.md` owns the approved five Wave 0 record definitions, constrained `custom` use, Arcane Lore transition, and implementation sequence.
- `packages/schemas/player/knowledge-domain-registry.schema.json` is the live structural authority for broad registry records.
- `packages/content/base/player/knowledge_domain_registry.json` is the live authored broad registry catalog.
- `packages/schemas/player/knowledge_snippet.schema.json` remains the current authority for snippet subject, category, source, progression, and visibility fields.
- `packages/schemas/player/knowledge-domain.schema.json`, `packages/content/base/player/knowledge_domains.json`, and `KnowledgeDomainRecord` remain the current narrow identification-policy shape.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest landed Codex version:

- `Version 0.5.111 - Knowledge Domain Registry Seed Data`

Immediate next version:

- `Version 0.5.112 - Knowledge Domain Registry Semantic Validator Plan`

Versioning note:

- Patch numbers may exceed two digits inside the active band.
- Do not roll from `0.5.111` to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.111 Result

- Added `packages/content/base/player/knowledge_domain_registry.json`.
- Seeded exactly five Wave 0 records: Flora, Fauna, Minerals, Arcane Lore, and General Lore.
- Copied the approved records from the seed-data plan without field or ordering drift.
- Kept Flora, Fauna, Minerals, and General Lore `active`; kept Arcane Lore `planned`.
- Kept every wave at `0` and every policy reference `null`.
- Validated all records against the live broad registry record schema with a focused local validator.
- Changed no semantic content-lint behavior, legacy identification policy, skills, spells, loaders, persistence, runtime, UI, generated output, state, trial, event, or ownership behavior.

## Active Guardrails For 0.5.112

Knowledge Domain Registry Semantic Validator Plan:

- Planning-only pass.
- Define exact `tools/content-lint/index.mjs` ownership for wrapper validation, duplicate ids/slugs, id/slug equality, source-family mapping, `custom` note requirements, skill and school-skill references, content-collection references, policy-reference posture, legacy-policy subset validation, skill `knowledgeDomainId` authority, overlap checks, and self-reference rejection.
- Define focused test ownership and acceptance criteria before implementation.
- Preserve the current seed records, broad schema, legacy identification behavior, and runtime boundary.
- Do not implement semantic validation, edit content, realign skills, add runtime loaders, change persistence, add snippets, or modify UI/gameplay behavior.

Boundary rules:

- The broad registry is authored catalog metadata and is not runtime-loaded.
- The legacy four-record file remains identification policy only.
- Arcane Lore has no legacy identification policy and no automatic skill link.
- Semantic validator planning, validator implementation, and skill-reference realignment remain separate runs.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.107` | Knowledge Domain Registry Plan | `docs/design/knowledge-domain-registry-plan.md` | Landed |
| 2 | `0.5.108` | Knowledge Domain Registry Schema Plan | `docs/design/knowledge-domain-registry-schema-plan.md` | Landed |
| 3 | `0.5.109` | Knowledge Domain Registry Seed Data Plan | `docs/design/knowledge-domain-registry-seed-data-plan.md` | Landed |
| 4 | `0.5.110` | Knowledge Domain Registry Schema File | `packages/schemas/player/knowledge-domain-registry.schema.json` | Landed |
| 5 | `0.5.111` | Knowledge Domain Registry Seed Data | `packages/content/base/player/knowledge_domain_registry.json` | Landed |
| 6 | `0.5.112` | Knowledge Domain Registry Semantic Validator Plan | `docs/design/knowledge-domain-registry-schema-plan.md` | Next |

## Next Prompt Source Stack

For `Version 0.5.112 - Knowledge Domain Registry Semantic Validator Plan`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-domain-registry-plan.md`
- `docs/design/knowledge-domain-registry-schema-plan.md`
- `docs/design/knowledge-domain-registry-seed-data-plan.md`
- `packages/schemas/player/knowledge-domain-registry.schema.json`
- `packages/content/base/player/knowledge_domain_registry.json`
- `packages/content/base/player/knowledge_domains.json`
- `packages/content/base/player/skills.json`
- `packages/content/base/player/spells.json`
- `tools/content-lint/index.mjs`
- `tests/unit/schema-files.test.mjs`
- `docs/future_content_backlog.md`
