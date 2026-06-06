# Current GPT Handoff

Source route: Codex local planning pass after `Version 0.5.108 - Knowledge Domain Registry Schema Plan`
Date: 2026-06-05
Branch/status assumption: `master` at commit `5f9e78c` before edits; the worktree was clean.

## Purpose

This is the short current handoff for future ChatGPT/GitHub Connector, Deep Research, Agent Mode, or Codex prompt preparation. It records immediate authority, guardrails, and direction; it is not a transcript or backlog.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/project-roadmap.md` owns version order and maturity direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue.
- `docs/design/knowledge-domain-registry-plan.md` owns domain purpose, groups, waves, source/evidence vocabulary, ownership boundaries, and the five-domain Wave 0 target.
- `docs/design/knowledge-domain-registry-schema-plan.md` owns future registry paths, exact fields/enums, reference authorities, semantic validation ownership, current-data transition rules, and implementation acceptance criteria.
- `packages/schemas/player/knowledge_snippet.schema.json` remains the current planning authority for snippet subject, category, source, progression, and visibility fields.
- `packages/schemas/player/knowledge-domain.schema.json`, `packages/content/base/player/knowledge_domains.json`, and `KnowledgeDomainRecord` remain the current narrow identification-policy shape.
- `docs/future_content_backlog.md` owns deferred-work and run notes.

## Current Anchor

Latest landed Codex version:

- `Version 0.5.108 - Knowledge Domain Registry Schema Plan`

Immediate next version:

- `Version 0.5.109 - Knowledge Domain Registry Seed Data Plan`

Versioning note:

- Patch numbers may exceed two digits inside the active band.
- Do not roll from `0.5.108` to `0.6.0` unless the roadmap explicitly declares the runtime-ownership milestone reached.

## Version 0.5.108 Result

- Added the planning-only `docs/design/knowledge-domain-registry-schema-plan.md`.
- Selected a separate broad registry schema at `packages/schemas/player/knowledge-domain-registry.schema.json`.
- Selected a separate broad registry content file at `packages/content/base/player/knowledge_domain_registry.json`.
- Defined the exact required field list, patterns, enums, array constraints, nullable policy-reference namespaces, and wrapper contract.
- Selected `skill.magic.school.*` skill records as the current magic-school reference authority.
- Defined file-derived content-collection ids from canonical JSON under `packages/content/base`.
- Assigned structural rules to JSON Schema and cross-file/semantic rules to `tools/content-lint/index.mjs`.
- Made the future broad registry the canonical domain-id authority while preserving the current legacy file as an identification-policy subset.
- Defined a no-alias current-data transition and left runtime loading, DB storage, identification behavior, content, schemas, state, UI, trials, and events unchanged.

## Active Guardrails For 0.5.109

Knowledge Domain Registry Seed Data Plan:

- Planning-only pass.
- Define the exact five Wave 0 records under the approved schema contract.
- Specify every required field for flora, fauna, minerals, arcane lore, and general lore.
- Use only current snippet subject/category/source enum values.
- Use only existing skill ids and `skill.magic.school.*` ids.
- Use only file-derived canonical content-collection ids.
- Keep `trialPolicyRef`, `completionPolicyRef`, and `visibilityPolicyRef` explicitly `null`.
- Keep `knowledge_domain.arcane_lore` status `planned`.
- Decide explicitly whether a later implementation should add `knowledgeDomainId` to `skill.knowledge.arcane_lore`.
- Do not create schemas or content JSON, edit skills, change legacy identification policies, add runtime loaders, change DB/persistence, add snippets/state/completion/trials/UI/events, or generate output.

Boundary rules:

- The broad registry is catalog metadata, not identification math.
- Legacy policy ids are a subset of broad registry ids.
- Skill and magic-school references do not grant knowledge.
- Content-collection references do not imply runtime loading.
- Status, wave, and source declarations do not grant access, evidence, discovery, or completion.
- `custom` requires explicit notes and is not a validation bypass.

## Near-Term Sequence

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.107` | Knowledge Domain Registry Plan | `docs/design/knowledge-domain-registry-plan.md` | Landed |
| 2 | `0.5.108` | Knowledge Domain Registry Schema Plan | `docs/design/knowledge-domain-registry-schema-plan.md` | Landed |
| 3 | `0.5.109` | Knowledge Domain Registry Seed Data Plan | `docs/design/knowledge-domain-registry-schema-plan.md` | Next |

## Next Prompt Source Stack

For `Version 0.5.109 - Knowledge Domain Registry Seed Data Plan`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/knowledge-domain-registry-plan.md`
- `docs/design/knowledge-domain-registry-schema-plan.md`
- `packages/schemas/player/knowledge_snippet.schema.json`
- `packages/schemas/player/knowledge-domain.schema.json`
- `packages/content/base/player/knowledge_domains.json`
- `packages/content/base/player/skills.json`
- `packages/content/base/player/spells.json`
- `tools/content-lint/index.mjs`
- `docs/future_content_backlog.md`
