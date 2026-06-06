# Current GPT Handoff

Source route: Codex local planning pass after `Version 0.5.109 - Knowledge Domain Registry Seed Data Plan`
Date: 2026-06-06
Branch/status assumption: `master` at commit `6aa4d4d` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future ChatGPT/GitHub Connector, Deep Research, Agent Mode, or Codex prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-domain-registry-plan.md` owns domain purpose, groups, waves, source/evidence vocabulary, ownership boundaries, and the five-domain Wave 0 target.
- `docs/design/knowledge-domain-registry-schema-plan.md` owns future registry paths, exact fields/enums, reference authorities, semantic validation ownership, current-data transition rules, and implementation acceptance criteria.
- `docs/design/knowledge-domain-registry-seed-data-plan.md` owns the exact five Wave 0 record drafts, constrained `custom` use, Arcane Lore transition, and schema-first implementation sequence.
- `packages/schemas/player/knowledge_snippet.schema.json` remains the current planning authority for snippet subject, category, source, progression, and visibility fields.
- `packages/schemas/player/knowledge-domain.schema.json`, `packages/content/base/player/knowledge_domains.json`, and `KnowledgeDomainRecord` remain the current narrow identification-policy shape.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest landed Codex version:

- `Version 0.5.109 - Knowledge Domain Registry Seed Data Plan`

Immediate next version:

- `Version 0.5.110 - Knowledge Domain Registry Schema File`

Versioning note:

- Patch numbers may exceed two digits inside the active band.
- Do not roll from `0.5.109` to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.109 Result

- Added `docs/design/knowledge-domain-registry-seed-data-plan.md`.
- Defined complete drafts for Flora, Fauna, Minerals, Arcane Lore, and General Lore with every required registry field.
- Kept Flora, Fauna, Minerals, and General Lore `active`; kept Arcane Lore `planned`; set all records to Wave 0.
- Kept all policy references `null`.
- Verified every related skill and magic-school id against current skills.
- Used only file-derived current base-content collection ids.
- Used only current snippet subject, category, and source enums.
- Limited `custom` to General Lore with explicit authoring and semantic-review constraints.
- Kept the legacy four-record identification-policy subset separate.
- Deferred the Arcane Lore skill link to a later explicit reference-realignment plan.
- Changed no schema, content JSON, skill, lint, runtime, persistence, UI, generated output, state, trial, event, or ownership behavior.

## Active Guardrails For 0.5.110

Knowledge Domain Registry Schema File:

- Implement only `packages/schemas/player/knowledge-domain-registry.schema.json` under the exact contract in `docs/design/knowledge-domain-registry-schema-plan.md`.
- Add the new schema path to the focused schema-file test if required by the repository test convention.
- Keep the record schema at JSON Schema Draft 2020-12, record-level `type: object`, and `additionalProperties: false`.
- Include exactly the approved required fields, enum values, patterns, uniqueness rules, and nullable policy-reference shapes.
- Do not create `packages/content/base/player/knowledge_domain_registry.json`.
- Do not implement content-lint registry validation.
- Do not edit legacy knowledge policies, skills, spells, loaders, DB/persistence, runtime, UI, generated output, snippets, evidence/progress state, completion, trials, or events.

Boundary rules:

- The broad registry remains catalog metadata, not identification math.
- The schema must not grant behavior or introduce runtime defaults.
- Planned subject/category/source gaps remain notes until a dedicated snippet-schema pass.
- The schema file and seed data remain separate implementation runs.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.107` | Knowledge Domain Registry Plan | `docs/design/knowledge-domain-registry-plan.md` | Landed |
| 2 | `0.5.108` | Knowledge Domain Registry Schema Plan | `docs/design/knowledge-domain-registry-schema-plan.md` | Landed |
| 3 | `0.5.109` | Knowledge Domain Registry Seed Data Plan | `docs/design/knowledge-domain-registry-seed-data-plan.md` | Landed |
| 4 | `0.5.110` | Knowledge Domain Registry Schema File | `docs/design/knowledge-domain-registry-schema-plan.md` | Next |

## Next Prompt Source Stack

For `Version 0.5.110 - Knowledge Domain Registry Schema File`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-domain-registry-plan.md`
- `docs/design/knowledge-domain-registry-schema-plan.md`
- `docs/design/knowledge-domain-registry-seed-data-plan.md`
- `packages/schemas/player/knowledge_snippet.schema.json`
- `packages/schemas/player/knowledge-domain.schema.json`
- `tests/unit/schema-files.test.mjs`
- `docs/future_content_backlog.md`
