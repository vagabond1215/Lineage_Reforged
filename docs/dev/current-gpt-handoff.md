# Current GPT Handoff

Source route: Codex local schema implementation after `Version 0.5.110 - Knowledge Domain Registry Schema File`
Date: 2026-06-06
Branch/status assumption: `master` at commit `f93c25d` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future ChatGPT/GitHub Connector, Deep Research, Agent Mode, or Codex prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-domain-registry-plan.md` owns domain purpose, groups, waves, source/evidence vocabulary, ownership boundaries, and the five-domain Wave 0 target.
- `docs/design/knowledge-domain-registry-schema-plan.md` owns registry paths, reference authorities, semantic validation ownership, current-data transition rules, and implementation acceptance criteria.
- `docs/design/knowledge-domain-registry-seed-data-plan.md` owns the exact five Wave 0 record drafts, constrained `custom` use, Arcane Lore transition, and implementation sequence.
- `packages/schemas/player/knowledge-domain-registry.schema.json` is the live structural authority for broad registry records.
- `packages/schemas/player/knowledge_snippet.schema.json` remains the current authority for snippet subject, category, source, progression, and visibility fields.
- `packages/schemas/player/knowledge-domain.schema.json`, `packages/content/base/player/knowledge_domains.json`, and `KnowledgeDomainRecord` remain the current narrow identification-policy shape.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest landed Codex version:

- `Version 0.5.110 - Knowledge Domain Registry Schema File`

Immediate next version:

- `Version 0.5.111 - Knowledge Domain Registry Seed Data`

Versioning note:

- Patch numbers may exceed two digits inside the active band.
- Do not roll from `0.5.110` to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.110 Result

- Added `packages/schemas/player/knowledge-domain-registry.schema.json`.
- Implemented the exact 20-field record-level contract from the schema plan.
- Inlined the current snippet subject, category, and discovery-source enums.
- Added structural group, wave, status, source-family, evidence-scope, reference-pattern, policy-reference, array, and note constraints.
- Kept id/slug equality, source-family mapping, cross-file references, `custom` note requirements, and legacy-subset validation out of JSON Schema for later semantic validation.
- Registered the new schema in `tests/unit/schema-files.test.mjs`.
- Created no broad registry content JSON and changed no legacy content, skills, content lint, loaders, persistence, runtime, UI, generated output, state, trial, event, or ownership behavior.

## Active Guardrails For 0.5.111

Knowledge Domain Registry Seed Data:

- Create only `packages/content/base/player/knowledge_domain_registry.json`.
- Use the exact wrapper `{ "records": [] }` shape with exactly five records.
- Copy the complete Flora, Fauna, Minerals, Arcane Lore, and General Lore drafts from `docs/design/knowledge-domain-registry-seed-data-plan.md`.
- Validate every record against `packages/schemas/player/knowledge-domain-registry.schema.json`.
- Keep all policy references `null`, all waves `0`, and statuses exactly as planned.
- Do not implement semantic content-lint validation in the seed-data run.
- Do not edit `skill.knowledge.arcane_lore`, legacy `knowledge_domains.json`, existing schemas, runtime loaders, DB/persistence, UI, generated output, snippets, evidence/progress state, completion, trials, or events.

Boundary rules:

- The broad registry content is authored catalog metadata only.
- The legacy four-record file remains the identification-policy subset.
- Arcane Lore receives no legacy identification policy or automatic skill link.
- Seed content, semantic validator planning, semantic validator implementation, and skill-reference realignment remain separate runs.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.107` | Knowledge Domain Registry Plan | `docs/design/knowledge-domain-registry-plan.md` | Landed |
| 2 | `0.5.108` | Knowledge Domain Registry Schema Plan | `docs/design/knowledge-domain-registry-schema-plan.md` | Landed |
| 3 | `0.5.109` | Knowledge Domain Registry Seed Data Plan | `docs/design/knowledge-domain-registry-seed-data-plan.md` | Landed |
| 4 | `0.5.110` | Knowledge Domain Registry Schema File | `packages/schemas/player/knowledge-domain-registry.schema.json` | Landed |
| 5 | `0.5.111` | Knowledge Domain Registry Seed Data | `docs/design/knowledge-domain-registry-seed-data-plan.md` | Next |

## Next Prompt Source Stack

For `Version 0.5.111 - Knowledge Domain Registry Seed Data`, inspect:

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
- `packages/schemas/player/knowledge_snippet.schema.json`
- `packages/content/base/player/knowledge_domains.json`
- `packages/content/base/player/skills.json`
- `packages/content/base/player/spells.json`
- `docs/future_content_backlog.md`
