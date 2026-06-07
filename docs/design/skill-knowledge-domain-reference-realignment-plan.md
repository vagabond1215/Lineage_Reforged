# Skill Knowledge Domain Reference Realignment Plan

Source version/run: Version 0.5.114 - Skill Knowledge Domain Reference Realignment Plan
Date: 2026-06-06
Status: planning-only skill-reference realignment contract; no content, validator, runtime, persistence, UI, or generated-output implementation

## 1. Purpose And Status

This document audits current skill `knowledgeDomainId` references against the authored broad knowledge-domain registry and defines the smallest safe later implementation.

This pass does not implement or change:

- skill content
- broad registry content
- legacy identification-policy content
- schemas
- validator code
- runtime loaders or gameplay behavior
- database or persistence behavior
- UI or generated output
- save, account, family, character, or session state
- knowledge snippets
- evidence or progress state
- completion or tier math
- knowledge trials
- Chronicle, Renown, reputation, or quest events
- item, spell, skill, or knowledge ownership

The decisions below are metadata-reference planning only.

## 2. Current State

The repository has the required authored and validation boundaries in place:

- `packages/schemas/player/knowledge-domain-registry.schema.json` is the broad registry record schema.
- `packages/content/base/player/knowledge_domain_registry.json` is the broad registry content catalog.
- `tools/content-lint/knowledge-domain-registry.mjs` is the focused structural and semantic validator.
- Normal content lint resolves current `skills[].knowledgeDomainId` values against broad registry ids.
- `packages/content/base/player/knowledge_domains.json` remains the separate narrow legacy identification-policy subset.
- Runtime loading of the broad registry remains deferred.

The broad registry currently contains:

- `knowledge_domain.flora`
- `knowledge_domain.fauna`
- `knowledge_domain.minerals`
- `knowledge_domain.arcane_lore`
- `knowledge_domain.general_lore`

The legacy identification-policy subset contains the same ids except `knowledge_domain.arcane_lore`.

## 3. Current Skill Reference Audit

Every current skill record with `knowledgeDomainId` resolves to the broad registry. Every referenced id also currently has a legacy identification-policy record.

| Skill id | Skill name | Current `knowledgeDomainId` | Broad registry resolves | Legacy policy id | Action |
| --- | --- | --- | --- | --- | --- |
| `skill.resource.spotting.flora` | Spotting.Flora | `knowledge_domain.flora` | Yes | Yes | None. Current reference is correct. |
| `skill.resource.spotting.fauna` | Spotting.Fauna | `knowledge_domain.fauna` | Yes | Yes | None. Current reference is correct. |
| `skill.resource.spotting.minerals` | Spotting.Minerals | `knowledge_domain.minerals` | Yes | Yes | None. Current reference is correct. |
| `skill.resource.identify.flora` | Identify.Flora | `knowledge_domain.flora` | Yes | Yes | None. Current reference is correct. |
| `skill.resource.identify.fauna` | Identify.Fauna | `knowledge_domain.fauna` | Yes | Yes | None. Current reference is correct. |
| `skill.resource.identify.minerals` | Identify.Minerals | `knowledge_domain.minerals` | Yes | Yes | None. Current reference is correct. |
| `skill.knowledge.general_lore` | Common Lore | `knowledge_domain.general_lore` | Yes | Yes | None. Current primary-domain reference is correct. |
| `skill.knowledge.flora_lore` | Herb Lore | `knowledge_domain.flora` | Yes | Yes | None. Current reference is correct. |
| `skill.knowledge.fauna_lore` | Beast Lore | `knowledge_domain.fauna` | Yes | Yes | None. Current reference is correct. |
| `skill.knowledge.mineral_lore` | Earth Lore | `knowledge_domain.minerals` | Yes | Yes | None. Current reference is correct. |

The broad Flora, Fauna, and Minerals records also list Common Lore in `relatedSkillIds`. That many-to-many authored relationship does not require Common Lore to replace its primary `knowledgeDomainId` or gain multiple domain fields.

## 4. Unlinked Knowledge Skill Audit

Three current ids matching `skill.knowledge.*` lack `knowledgeDomainId`.

| Skill id | Skill name | Decision | Required future owner |
| --- | --- | --- | --- |
| `skill.knowledge.arcane_lore` | Arcane Lore | Add `knowledgeDomainId: "knowledge_domain.arcane_lore"` in the next implementation pass. It is not intentionally unlinked. | `Version 0.5.115 - Skill Knowledge Domain Reference Realignment` |
| `skill.knowledge.cultural_lore` | Folk Lore | Defer. It requires a specific broad domain, with `knowledge_domain.cultures` the current planned Wave 1 candidate. Do not link it to General Lore as a substitute. | Future broad registry-domain expansion plus a focused link decision |
| `skill.knowledge.civic_lore` | Civic Lore | Defer. Its streets, markets, guilds, law, and settled-life scope crosses planned settlement, institution, law, local-economy, and local-politics domains. Do not choose a broad id without a dedicated planning decision, and do not link it to General Lore as a substitute. | Future broad registry-domain expansion and a focused civic-domain ownership plan |

No currently unlinked `skill.knowledge.*` record is approved as permanently or intentionally unlinked. Arcane Lore has a decided link; Folk Lore and Civic Lore remain unlinked only because their specific broad-domain authorities are not yet live.

## 5. Arcane Lore Decision

The later implementation must add this field to `skill.knowledge.arcane_lore`:

```json
"knowledgeDomainId": "knowledge_domain.arcane_lore"
```

The link is valid because the broad registry already contains `knowledge_domain.arcane_lore` and lists `skill.knowledge.arcane_lore` as a related skill.

The implementation must preserve these boundaries:

- Do not add `knowledge_domain.arcane_lore` to legacy `knowledge_domains.json`.
- Do not add support weights, identification difficulties, or automatic-identification thresholds.
- Do not change the broad registry record or its `planned` status.
- Do not grant known spells or spell ownership.
- Do not grant spell access or magic-school access.
- Do not grant magic-study completion, snippet completion, evidence, or trial progress.
- Treat the new field as metadata/reference alignment only.

## 6. Other Knowledge Skill Decisions

Current knowledge-skill alignment is already correct:

- `skill.knowledge.flora_lore` links to `knowledge_domain.flora`.
- `skill.knowledge.fauna_lore` links to `knowledge_domain.fauna`.
- `skill.knowledge.mineral_lore` links to `knowledge_domain.minerals`.
- `skill.knowledge.general_lore` links to `knowledge_domain.general_lore`.

No changes are needed for those records.

Current knowledge skills that require domains not yet present in the broad registry are:

- `skill.knowledge.cultural_lore`
- `skill.knowledge.civic_lore`

Those links remain deferred until future registry-domain expansion. This plan does not create, rename, or expand broad registry records.

## 7. Minimal Future Implementation

`Version 0.5.115 - Skill Knowledge Domain Reference Realignment` should make exactly these changes:

1. Edit `packages/content/base/player/skills.json`.
   - Add `knowledgeDomainId: "knowledge_domain.arcane_lore"` to `skill.knowledge.arcane_lore`.
   - Leave all other skill records unchanged.
2. Edit `tests/unit/knowledge-domain-registry-validation.test.mjs`.
   - Replace the current positive-test assumption that Arcane Lore is the unreferenced broad domain.
   - Preserve the rule that a broad registry id does not have to be referenced by a skill by cloning the fixture, removing all skill references to one existing broad id in that clone, and confirming validation still passes.
   - Do not weaken or remove the unknown-domain rejection test.

The focused test adjustment is necessary because the current test explicitly asserts that no skill references `knowledge_domain.arcane_lore`. It is a fixture correction, not validator behavior expansion.

The future implementation must not edit:

- `packages/content/base/player/knowledge_domain_registry.json`
- `packages/content/base/player/knowledge_domains.json`
- either knowledge-domain schema
- `tools/content-lint/index.mjs`
- `tools/content-lint/knowledge-domain-registry.mjs`
- runtime loaders

Validator code should change only if the current validator unexpectedly rejects the intended valid Arcane Lore link. Current inspection indicates it will accept the link, so no validator change is expected.

## 8. Future Validation

The implementation pass should run:

- `npm.cmd run tool:content-lint`
- `node --test tests/unit/knowledge-domain-registry-validation.test.mjs`
- `node --test tests/unit/schema-files.test.mjs`
- a focused JSON duplicate/order scan if useful
- a conflict-marker scan for touched files
- a trailing-whitespace scan for touched files
- `git diff --check`

Broad typecheck is not required for the planned JSON and focused-test change unless the implementation unexpectedly touches source outside that scope.

## 9. Boundary Rules

- Skill `knowledgeDomainId` is a reference to authored domain metadata only.
- Skill rank does not create knowledge completion.
- Skill rank does not unlock snippets.
- Skill rank does not grant evidence.
- The Arcane Lore link does not grant known spells.
- The Arcane Lore link does not grant access to magic schools.
- A broad registry `relatedSkillIds` relationship does not create player ownership or progression.
- Legacy identification policy remains a separate optional subset of the broad registry.
- A broad domain does not require a legacy identification-policy record.
- The broad registry catalog remains non-runtime-loaded.

## 10. Risks And Deferred Work

- `skill.knowledge.arcane_lore` remains unlinked until the implementation pass lands.
- The current focused validator test encodes Arcane Lore's unlinked state and must be made data-independent during implementation.
- Folk Lore needs a future cultures-domain authority before linking.
- Civic Lore needs a future domain-ownership decision before linking.
- Broad registry runtime loading remains deferred.
- Knowledge snippet authoring, evidence contracts, progress state, completion policy, trials, and UI remain separate later work.
- Future broad-domain expansion must not use General Lore as a bypass for missing specific-domain design.

## 11. Future Sequence

1. `Version 0.5.114 - Skill Knowledge Domain Reference Realignment Plan`
2. `Version 0.5.115 - Skill Knowledge Domain Reference Realignment`
3. Knowledge Snippet Content Authoring Plan
4. Knowledge Evidence Contract Plan
5. Knowledge Progress State Plan
6. Knowledge Trial Plan
7. Knowledge UI Plan

Each item remains a separate scoped run.

## 12. Non-Goals And Forbidden Changes

This plan does not authorize:

- no skill edits
- no registry content edits
- no schema edits
- no validator code edits
- no legacy `knowledge_domains.json` edits
- no runtime loaders
- no database or persistence changes
- no generated output
- no UI
- no save, account, or session state
- no snippets
- no evidence or progress state
- no completion math
- no trials
- no Chronicle or Renown events
- no item, spell, or skill ownership changes
- no settlement, map, travel, or economy implementation
- no unrelated cleanup
