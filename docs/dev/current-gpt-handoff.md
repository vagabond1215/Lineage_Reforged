# Current GPT Handoff

Source route: Codex local planning pass after `Version 0.5.107 - Knowledge Domain Registry Plan`
Date: 2026-06-05
Branch/status assumption: `master` at commit `d7aebde` before edits; the worktree was clean after a fast-forward pull of connector-only prep documents.

## Purpose

This is the short current handoff for future ChatGPT/GitHub Connector, Deep Research, Agent Mode, or Codex prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-domain-registry-plan.md` owns the planned broad registry shape, Wave 0 target, Waves 1-3, groups, source/evidence vocabulary, field ownership, validation boundaries, schema gaps, and safe future sequence.
- `packages/schemas/player/knowledge_snippet.schema.json` remains the current planning authority for snippet subject, category, source, progression, and visibility fields.
- `packages/content/base/player/knowledge_domains.json` and `KnowledgeDomainRecord` in `packages/engines/civilization-engine/src/content.ts` remain the current narrow legacy resource-identification shape.
- `docs/design/knowledge-discovery-source-vocabulary.md`, `docs/design/knowledge-registry-field-ownership.md`, and `docs/design/knowledge-boundary-glossary.md` remain detailed prep references.
- `docs/design/skill-mastery-trial-framework-plan.md` owns deferred skill-trial and magic-study planning.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest landed Codex version:

- `Version 0.5.107 - Knowledge Domain Registry Plan`

Immediate next version:

- `Version 0.5.108 - Knowledge Domain Registry Schema Plan`

Versioning note:

- Patch numbers may exceed two digits inside the active band.
- Do not roll from `0.5.107` to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.107 Result

- Added the planning-only `docs/design/knowledge-domain-registry-plan.md`.
- Defined the future registry record fields, approved groups, status vocabulary, Waves 0-3, source families, evidence-owner scopes, ownership boundaries, validation rules, schema gaps, and safe future sequence.
- Formalized the five-domain Wave 0 target: flora, fauna, minerals, arcane lore, and general lore.
- Recorded current repo reality: four narrow legacy records exist; Arcane Lore is implied by a skill but is not currently registered or linked through `knowledgeDomainId`.
- Preserved the distinction between registry metadata, snippet definitions, runtime/player state, source/evidence records, validation, and presentation.
- Made no runtime, schema, content JSON, generated-output, UI, persistence, progress, trial, event, item, spell, or skill ownership changes.

## Active Guardrails For 0.5.108

Knowledge Domain Registry Schema Plan:

- Planning-only pass.
- Decide whether the broad registry evolves or separates from the legacy `KnowledgeDomainRecord` shape.
- Define the future schema location, wrapper shape, required fields, enums, nullable policy references, and semantic validation owner.
- Select a canonical related-content-collection vocabulary.
- Select or explicitly defer the canonical magic-school id authority.
- Define current-data transition rules for the four existing legacy records without implementing a migration.
- Keep `knowledge_domain.arcane_lore` planned until a later seed-data/content pass.
- Do not create or edit schemas, registry content JSON, snippet content, runtime loaders, progress state, evidence state, completion math, trials, UI, Chronicle/Renown events, or generated output.

Boundary rules:

- Access is not study.
- Observation is not mastery.
- Possession is not understanding.
- Skill rank is not knowledge completion.
- Known-spell ownership is not arcane knowledge.
- Magic study access is not known-spell ownership.
- Chronicle, reputation, Renown, region visibility, and UI visibility do not create knowledge.
- Registry records never create player state or grant access, knowledge, skills, spells, items, or evidence.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.105` | Spell Hook Support Constants Cleanup | `packages/shared/types/src/spell-hook-support.ts` | Landed |
| 2 | `0.5.106` | Pure Hook Support Projection Helper | `packages/engines/game-engine/src/known-spells.ts` | Landed |
| 3 | `0.5.107` | Knowledge Domain Registry Plan | `docs/design/knowledge-domain-registry-plan.md` | Landed |
| 4 | `0.5.108` | Knowledge Domain Registry Schema Plan | `docs/design/knowledge-domain-registry-plan.md` | Next |

## Next Prompt Source Stack

For `Version 0.5.108 - Knowledge Domain Registry Schema Plan`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-domain-registry-plan.md`
- `docs/design/knowledge-registry-field-ownership.md`
- `docs/design/knowledge-discovery-source-vocabulary.md`
- `docs/design/knowledge-boundary-glossary.md`
- `packages/schemas/player/knowledge_snippet.schema.json`
- `packages/content/base/player/knowledge_domains.json`
- `packages/engines/civilization-engine/src/content.ts`
- `docs/future_content_backlog.md`
