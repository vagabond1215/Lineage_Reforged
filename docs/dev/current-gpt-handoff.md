# Current GPT Handoff

Source route: Codex local implementation after `Version 0.5.113 - Knowledge Domain Registry Semantic Validator`
Date: 2026-06-06
Branch/status assumption: `master` at commit `4a4ab06` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future ChatGPT/GitHub Connector, Deep Research, Agent Mode, or Codex prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-domain-registry-plan.md` owns domain purpose, groups, waves, source/evidence vocabulary, ownership boundaries, and the five-domain Wave 0 target.
- `docs/design/knowledge-domain-registry-schema-plan.md` owns registry paths, reference authorities, semantic validation ownership, current-data transition rules, and implementation acceptance criteria.
- `docs/design/knowledge-domain-registry-seed-data-plan.md` owns the approved five Wave 0 record definitions, constrained `custom` use, Arcane Lore transition, and implementation sequence.
- `docs/design/knowledge-domain-registry-semantic-validator-plan.md` owns the future lint entrypoint, exact semantic checks, test matrix, and validator acceptance criteria.
- `tools/content-lint/knowledge-domain-registry.mjs` is the live pure structural and semantic validation unit.
- `tests/unit/knowledge-domain-registry-validation.test.mjs` is the focused mutation-test authority for the validator.
- `packages/schemas/player/knowledge-domain-registry.schema.json` is the live structural authority for broad registry records.
- `packages/content/base/player/knowledge_domain_registry.json` is the live authored broad registry catalog.
- `packages/schemas/player/knowledge_snippet.schema.json` remains the current authority for snippet subject, category, source, progression, and visibility fields.
- `packages/schemas/player/knowledge-domain.schema.json`, `packages/content/base/player/knowledge_domains.json`, and `KnowledgeDomainRecord` remain the current narrow identification-policy shape.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest completed Codex version:

- `Version 0.5.113 - Knowledge Domain Registry Semantic Validator`

Immediate next version:

- `Version 0.5.114 - Skill Knowledge Domain Reference Realignment Plan`

Versioning note:

- Patch numbers may exceed two digits inside the active band.
- Do not roll from `0.5.113` to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.113 Result

- Added the broad registry to normal content-lint coverage.
- Added a narrow fail-closed structural adapter driven by the live registry schema.
- Added semantic checks for wrapper identity, source families, custom notes, skills, magic-school records, content collections, policy references, legacy-policy subset membership, and skill `knowledgeDomainId` resolution.
- Switched existing skill `knowledgeDomainId` dependency checks from the legacy subset to the broad registry.
- Added 37 focused positive and negative tests.
- Changed no content, schema, skill, spell, runtime, persistence, UI, generated output, state, trial, event, or ownership behavior.

## Active Guardrails For 0.5.114

Skill Knowledge Domain Reference Realignment Plan:

- Planning-only pass.
- Audit current `skills[].knowledgeDomainId` values against the broad registry.
- Decide the exact intended link for `skill.knowledge.arcane_lore` and whether any other current knowledge skills require a registered domain before implementation.
- Preserve the semantic validator and legacy identification-policy subset boundary.
- Do not edit skills, registry content, schemas, runtime loaders, persistence, snippets, UI, or gameplay behavior.

Boundary rules:

- The broad registry is authored catalog metadata and is not runtime-loaded.
- The legacy four-record file remains identification policy only.
- Arcane Lore has no legacy identification policy and no automatic skill link.
- Semantic validator implementation is complete; skill-reference realignment planning and implementation remain separate runs.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.107` | Knowledge Domain Registry Plan | `docs/design/knowledge-domain-registry-plan.md` | Landed |
| 2 | `0.5.108` | Knowledge Domain Registry Schema Plan | `docs/design/knowledge-domain-registry-schema-plan.md` | Landed |
| 3 | `0.5.109` | Knowledge Domain Registry Seed Data Plan | `docs/design/knowledge-domain-registry-seed-data-plan.md` | Landed |
| 4 | `0.5.110` | Knowledge Domain Registry Schema File | `packages/schemas/player/knowledge-domain-registry.schema.json` | Landed |
| 5 | `0.5.111` | Knowledge Domain Registry Seed Data | `packages/content/base/player/knowledge_domain_registry.json` | Landed |
| 6 | `0.5.112` | Knowledge Domain Registry Semantic Validator Plan | `docs/design/knowledge-domain-registry-semantic-validator-plan.md` | Completed |
| 7 | `0.5.113` | Knowledge Domain Registry Semantic Validator | `tools/content-lint/knowledge-domain-registry.mjs` | Completed |
| 8 | `0.5.114` | Skill Knowledge Domain Reference Realignment Plan | `docs/design/knowledge-domain-registry-semantic-validator-plan.md` | Next |

## Next Prompt Source Stack

For `Version 0.5.114 - Skill Knowledge Domain Reference Realignment Plan`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-domain-registry-plan.md`
- `docs/design/knowledge-domain-registry-schema-plan.md`
- `docs/design/knowledge-domain-registry-seed-data-plan.md`
- `docs/design/knowledge-domain-registry-semantic-validator-plan.md`
- `packages/schemas/player/knowledge-domain-registry.schema.json`
- `packages/content/base/player/knowledge_domain_registry.json`
- `packages/content/base/player/knowledge_domains.json`
- `packages/content/base/player/skills.json`
- `tools/content-lint/index.mjs`
- `tools/content-lint/knowledge-domain-registry.mjs`
- `tests/unit/knowledge-domain-registry-validation.test.mjs`
- `docs/future_content_backlog.md`
