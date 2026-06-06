# Knowledge Domain Registry Schema Plan

Source version/run: Version 0.5.108 - Knowledge Domain Registry Schema Plan
Date: 2026-06-05
Status: planning-only schema and validation contract; no schema, content, runtime, persistence, UI, or generated-output implementation

## 1. Purpose And Status

This document makes the future broad knowledge-domain registry schema decision-complete.

It defines:

- the registry schema and content-file locations
- the separation from the existing resource-identification policy shape
- the exact required fields, types, enums, patterns, and nullable references
- canonical skill, magic-school, and content-collection reference authorities
- structural and semantic validation ownership
- current-data transition rules for the four existing legacy records
- acceptance criteria and the safe implementation sequence

This pass does not create or edit a schema file, content JSON, runtime loader, database table, generated output, UI, save/account/session state, evidence state, completion behavior, trials, or events.

## 2. Decision Summary

The broad registry will be a separate canonical catalog.

| Decision | Selected direction |
| --- | --- |
| Broad record schema | New `packages/schemas/player/knowledge-domain-registry.schema.json`. |
| Broad content file | New `packages/content/base/player/knowledge_domain_registry.json`. |
| Wrapper | One top-level `records` array and no other top-level fields. |
| Existing `knowledge-domain.schema.json` | Remains the legacy identification-policy schema until a dedicated naming/extraction pass. |
| Existing `knowledge_domains.json` | Remains the legacy identification-policy content file during the first registry seed implementation. |
| Canonical domain-id authority after implementation | `knowledge_domain_registry.json`. |
| Skill `knowledgeDomainId` validation | Must resolve against the broad registry, not the legacy policy subset. |
| Legacy policy id validation | Every legacy policy id must resolve to a broad registry id. |
| Runtime loading | Deferred. The broad registry is content-lint-only until explicitly scoped. |
| Database/persistence | Deferred. `player_knowledge_domains` remains legacy identification-policy storage. |
| Magic-school reference authority | Existing `skill.magic.school.*` records in `player.skills`. |
| Content-collection vocabulary | File-derived ids from canonical JSON under `packages/content/base`. |
| Structural authority | The new JSON Schema record contract. |
| Semantic/cross-file authority | `tools/content-lint/index.mjs`. |

The new registry does not extend the legacy record with metadata fields. Mixing stable catalog metadata with identification weights and thresholds would preserve the current ownership ambiguity.

## 3. Current Repository Constraints

### Existing Narrow Schema And Content

The repository already contains:

- `packages/schemas/player/knowledge-domain.schema.json`
- `packages/content/base/player/knowledge_domains.json`
- `KnowledgeDomainRecord`
- `loadKnowledgeDomainContent()`
- `validateKnowledgeDomains(...)`
- the `player_knowledge_domains` database table

That shape owns:

- supporting skill ids
- support weights
- identification difficulties
- automatic-identification thresholds

It currently contains policy records for:

- `knowledge_domain.flora`
- `knowledge_domain.fauna`
- `knowledge_domain.minerals`
- `knowledge_domain.general_lore`

This is identification policy, not a broad domain catalog.

### Existing Validation Coupling

Current content lint uses `knowledge_domains.json` as the domain-id set for `skills[].knowledgeDomainId`.

That coupling blocks domains that need registry identity but do not need natural-resource identification math, including `knowledge_domain.arcane_lore`.

After the broad registry is implemented:

- skill domain references must use the broad registry id set
- legacy policy records must become an optional subset of registry domains
- a domain must not require an identification-policy record merely to exist

### Existing Schema Enforcement

The repository's schema test verifies that listed schema files are parseable and declare a top-level `type`.

Content lint performs the effective structural and cross-file checks through explicit validation functions. The future implementation must not assume that adding a JSON Schema file automatically validates content.

## 4. Ownership Separation

### Broad Registry

The broad registry owns:

- stable domain identity
- authored scope and taxonomy
- allowed snippet subject/category/source vocabulary
- planning-only evidence-owner defaults
- related skill, magic-school, and content-collection references
- future policy references
- schema-gap and authoring notes

### Legacy Identification Policy

The legacy shape owns:

- knowledge skill used by identification assistance
- spotting and identify skill support
- general-lore support
- support weights
- rarity difficulty thresholds
- automatic-identification thresholds

It must not remain the canonical source for domain name, group, wave, status, snippet compatibility, evidence scopes, or policy references after the broad registry lands.

### Runtime And Persistence

Neither authored collection owns:

- discovered or completed snippets
- progress percentages
- unlocked tiers
- evidence instances
- trial state
- character/account/family/session state

The broad registry must not be added to engine loaders, DB seeds, or persistence in its first schema-and-seed implementation.

## 5. Future Artifact Locations

### Record Schema

Path:

- `packages/schemas/player/knowledge-domain-registry.schema.json`

Contract:

- JSON Schema Draft 2020-12
- title `KnowledgeDomainRegistryRecord`
- record-level schema, matching current repository convention
- top-level record `type: object`
- `additionalProperties: false`

The existing `packages/schemas/player/knowledge-domain.schema.json` must not be repurposed in place during the first registry implementation.

### Content File

Path:

- `packages/content/base/player/knowledge_domain_registry.json`

Wrapper:

```json
{
  "records": []
}
```

Wrapper rules:

- top level must be an object
- `records` is required
- no additional top-level fields
- `records` must be a non-empty array once seed data is implemented
- every record must satisfy the record schema and semantic lint

No `version`, generated metadata, timestamps, runtime state, or migration fields belong in the wrapper.

## 6. Exact Record Contract

All fields in this section are required. Optional relationships use empty arrays. Future policy references use explicit `null`.

| Field | JSON type | Structural constraint |
| --- | --- | --- |
| `id` | string | Pattern `^knowledge_domain\.[a-z0-9]+(?:_[a-z0-9]+)*$`. |
| `slug` | string | Pattern `^[a-z0-9]+(?:_[a-z0-9]+)*$`; semantic lint requires `id === "knowledge_domain." + slug`. |
| `name` | string | `minLength: 1`. |
| `summary` | string | `minLength: 1`; domain scope only, never state or grant language. |
| `group` | string enum | One value from Section 7. |
| `wave` | integer enum | `0`, `1`, `2`, or `3`. |
| `status` | string enum | `active`, `planned`, `draft`, or `deferred`. |
| `canonicalSubjectTypes` | string[] | `minItems: 1`, `uniqueItems: true`, current snippet subject enum only. |
| `supportedSnippetCategories` | string[] | `minItems: 1`, `uniqueItems: true`, current snippet category enum only. |
| `supportedDiscoverySourceFamilies` | string[] | `minItems: 1`, `uniqueItems: true`, source-family enum only. |
| `supportedDiscoverySourceTypes` | string[] | `minItems: 1`, `uniqueItems: true`, current snippet source-type enum only. |
| `defaultEvidenceOwnerScopes` | string[] | `minItems: 1`, `uniqueItems: true`, evidence-owner enum only. |
| `relatedSkillIds` | string[] | `uniqueItems: true`; each item matches `^skill\.[a-z0-9_]+(?:\.[a-z0-9_]+)*$`. |
| `relatedMagicSchoolIds` | string[] | `uniqueItems: true`; each item matches `^skill\.magic\.school\.[a-z0-9_]+(?:\.[a-z0-9_]+)*$`. |
| `relatedContentCollections` | string[] | `minItems: 1`, `uniqueItems: true`; each item uses the collection-id format in Section 8. |
| `trialPolicyRef` | string or null | `null` or pattern `^knowledge_trial_policy\.[a-z0-9]+(?:_[a-z0-9]+)*$`. |
| `completionPolicyRef` | string or null | `null` or pattern `^knowledge_completion_policy\.[a-z0-9]+(?:_[a-z0-9]+)*$`. |
| `visibilityPolicyRef` | string or null | `null` or pattern `^knowledge_visibility_policy\.[a-z0-9]+(?:_[a-z0-9]+)*$`. |
| `schemaGapNotes` | string[] | `uniqueItems: true`; string items use `minLength: 1`; empty array allowed. |
| `notes` | string[] | `uniqueItems: true`; string items use `minLength: 1`; empty array allowed. |

### Required Field List

The future schema `required` array must contain exactly:

```text
id
slug
name
summary
group
wave
status
canonicalSubjectTypes
supportedSnippetCategories
supportedDiscoverySourceFamilies
supportedDiscoverySourceTypes
defaultEvidenceOwnerScopes
relatedSkillIds
relatedMagicSchoolIds
relatedContentCollections
trialPolicyRef
completionPolicyRef
visibilityPolicyRef
schemaGapNotes
notes
```

No field may default to runtime behavior. Empty arrays and explicit `null` preserve a complete, deterministic authored shape.

Every non-enum string-array item must use `minLength: 1` in addition to any field-specific pattern.

## 7. Exact Enum Vocabularies

### Domain Groups

```text
natural_world
geography_travel
settlement_society
monster_combat
economy_materials
medicine_body
magic_arcana
religion_myth
history_culture
military_tactics
general
```

### Status

```text
active
planned
draft
deferred
```

Status is authoring posture only. It must not control runtime visibility, ownership, access, discovery, or completion.

### Current Subject Types

The registry schema must use the current `knowledge_snippet.schema.json` subject enum:

```text
flora
fauna
mineral
settlement
region
culture
institution
spell
item
ruin
historical_event
custom
```

Planned subject types belong in `schemaGapNotes` until a dedicated snippet-schema pass adds them.

### Current Snippet Categories

```text
identification
habitat
behavior
use
byproduct
processing
danger
lookalike
regional_variant
seasonality
trade_value
ritual_use
historical_context
cultural_context
mechanical_application
custom
```

### Discovery Source Families

```text
field_observation
practical_use
textual_study
instruction
event_record
custom
```

### Current Discovery Source Types

```text
field_identification
resource_use
crafting_use
combat_observation
travel_observation
book_study
teacher_instruction
institutional_study
scroll_study
tome_study
quest_event
chronicle_record
custom
```

### Evidence Owner Scopes

```text
character
account
family
institution
region
settlement
quest_event
chronicle_record
item_instance
document_instance
teacher
study_event
travel_event
combat_event
custom
```

These are planning values. Their presence in a registry record creates no evidence state.

## 8. Reference Authorities

### Related Skills

Authority:

- `packages/content/base/player/skills.json`

Rules:

- every `relatedSkillIds` value must resolve to a current skill id
- these references support authoring, checks, study, or future trial weighting only
- skill rank must not grant discovery or completion

### Related Magic Schools

Canonical authority:

- skill records with ids matching `skill.magic.school.*`

Semantic rules:

- every value must resolve to a current skill record
- the record must have `category: "magic"`
- the record `domain` must begin with `school.`
- spell `school` slugs are not valid `relatedMagicSchoolIds`
- `control` and `ranged` are current spell-family values without corresponding school-skill ids and must not be used
- values listed in `relatedMagicSchoolIds` must not be duplicated in `relatedSkillIds`

No dedicated magic-school registry is introduced in this pass.

### Related Content Collections

Canonical vocabulary is derived from JSON files under:

- `packages/content/base`

Collection-id derivation:

1. Take the path relative to `packages/content/base`.
2. Remove `.json`.
3. Replace path separators with `.`.

Examples:

| Content path | Collection id |
| --- | --- |
| `world/flora.json` | `world.flora` |
| `world/regions.json` | `world.regions` |
| `player/spells.json` | `player.spells` |
| `civilization/production_chains.json` | `civilization.production_chains` |
| `items/items.json` | `items.items` |

Item pattern:

- `^[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)+$`

Semantic rules:

- each id must resolve to an existing canonical base-content JSON file
- generated files, schemas, packs, docs, runtime modules, and directories are not collection ids
- `player.knowledge_domain_registry` must not self-reference
- a collection reference does not grant knowledge or imply a runtime loader

This file-derived vocabulary avoids a second hand-maintained collection enum.

### Future Policy References

The three policy fields are required and nullable.

Seed-data rule:

- all Wave 0 seed records use `null` until the corresponding policy owner and content collection exist

Future non-null validation:

- a later policy plan must define the referenced collection
- semantic lint must resolve non-null ids before any policy reference is accepted
- missing policy records are errors, not soft fallbacks

## 9. Source-Family Mapping

Semantic lint must own one exact source-type-to-family map:

| Source type | Family |
| --- | --- |
| `field_identification` | `field_observation` |
| `travel_observation` | `field_observation` |
| `combat_observation` | `field_observation` |
| `resource_use` | `practical_use` |
| `crafting_use` | `practical_use` |
| `book_study` | `textual_study` |
| `scroll_study` | `textual_study` |
| `tome_study` | `textual_study` |
| `teacher_instruction` | `instruction` |
| `institutional_study` | `instruction` |
| `quest_event` | `event_record` |
| `chronicle_record` | `event_record` |
| `custom` | `custom` |

Validation must enforce both directions:

- every supported source type belongs to a declared supported family
- every declared supported family has at least one supported source type

`custom` in a subject, category, source type, source family, or evidence scope requires at least one explanatory entry in `schemaGapNotes` or `notes`.

## 10. Validation Ownership

### JSON Schema

The new schema owns:

- required fields
- primitive types
- enum membership
- string patterns
- array minimums
- array uniqueness
- nullable policy-reference format
- rejection of unknown record fields

The schema should inline the approved enums. Do not add external `$ref` coupling to `knowledge_snippet.schema.json` in the first pass.

### Content Lint

`tools/content-lint/index.mjs` owns:

- the exact wrapper shape
- duplicate domain ids and slugs
- id/slug equality
- source type/family compatibility
- custom-value note requirements
- skill reference existence
- magic-school skill classification
- content-collection existence
- policy references remaining null until policy authorities exist
- legacy policy ids resolving to registry ids
- skill `knowledgeDomainId` values resolving to registry ids
- no overlap between `relatedSkillIds` and `relatedMagicSchoolIds`
- no self-reference through `relatedContentCollections`

The future check entry should use:

```text
file: packages/content/base/player/knowledge_domain_registry.json
requiredTopLevel: records
validateKnowledgeDomainRegistry: true
```

The existing `validateKnowledgeDomains(...)` remains the legacy identification-policy validator until the naming/extraction pass.

### Tests

The first implementation should:

- add `knowledge-domain-registry.schema.json` to `tests/unit/schema-files.test.mjs`
- run `npm.cmd run tool:content-lint`
- run `node --test tests/unit/schema-files.test.mjs`
- add focused semantic validation coverage if registry validation is extracted into a reusable helper
- scan changed files for conflict markers
- run `git diff --check`

Broad typecheck is not required for a schema-and-content-only implementation unless source code is changed.

## 11. Current-Data Transition

This pre-release project does not need compatibility aliases, dual reads, retired-id support, or migration-only behavior.

### First Registry Schema And Seed Implementation

The implementation should:

1. Add the new broad registry schema.
2. Add the new broad registry content file with the approved Wave 0 records.
3. Add registry structural and semantic lint.
4. Make the broad registry the validation authority for `skills[].knowledgeDomainId`.
5. Validate every existing legacy policy id against the broad registry.
6. Leave legacy identification behavior, helper inputs, DB storage, and runtime loading unchanged.

It must not:

- merge identification weights into registry records
- add a broad registry engine loader
- add DB tables or migration aliases
- auto-create an identification policy for every domain
- add a legacy policy for `knowledge_domain.arcane_lore`
- infer skill links from matching names or slugs

### Later Identification-Policy Naming Cleanup

A dedicated later pass may rename:

- `knowledge-domain.schema.json` to `knowledge-identification-policy.schema.json`
- `knowledge_domains.json` to `knowledge_identification_policies.json`
- `KnowledgeDomainRecord` to `KnowledgeIdentificationPolicyRecord`
- `loadKnowledgeDomainContent()` to `loadKnowledgeIdentificationPolicyContent()`
- `validateKnowledgeDomains(...)` to `validateKnowledgeIdentificationPolicies(...)`

That pass must update all references atomically and must not retain compatibility aliases unless explicitly requested.

The `player_knowledge_domains` DB table remains out of scope until a dedicated DB/runtime ownership pass decides whether it should be renamed, replaced, or removed.

## 12. Wave 0 Seed Implications

The next seed-data plan must define exactly five broad records:

- `knowledge_domain.flora`
- `knowledge_domain.fauna`
- `knowledge_domain.minerals`
- `knowledge_domain.arcane_lore`
- `knowledge_domain.general_lore`

Required posture:

- flora, fauna, minerals, and general lore may target `active`
- arcane lore remains `planned`
- every record uses only current snippet subject/category/source enums
- every policy reference is `null`
- `relatedMagicSchoolIds` use only current school-skill ids
- planned subject/category/source gaps remain text in `schemaGapNotes`
- no broad record contains identification weights or thresholds
- no seed record creates player state or grants anything

Whether `skill.knowledge.arcane_lore` gains `knowledgeDomainId` must be an explicit seed-data-plan decision. It must not be inferred by the schema.

## 13. Implementation Acceptance Criteria

The future schema-and-seed implementation is complete only when:

1. The new schema is parseable and listed in the schema-file test.
2. The new content file has exactly the approved wrapper.
3. Every seeded record has the complete required field set.
4. Domain ids and slugs are unique and consistent.
5. All enum arrays use current approved values.
6. Source families and source types agree in both directions.
7. Skill and magic-school references resolve to the selected authorities.
8. Content-collection references resolve through the file-derived vocabulary.
9. Policy references are explicitly `null`.
10. Existing skill domain references validate against the broad registry.
11. Existing legacy policy ids validate as a subset of broad registry ids.
12. Existing identification assistance behavior and tests remain unchanged.
13. No runtime loader, DB behavior, state, completion, trial, event, UI, or generated output changes.
14. Content lint, schema-file tests, conflict scans, and `git diff --check` pass.

## 14. Future Sequence

Recommended next safe sequence:

1. `Version 0.5.109 - Knowledge Domain Registry Seed Data Plan`
2. Knowledge Domain Registry Schema And Seed Implementation
3. Knowledge Identification Policy Naming Cleanup
4. Knowledge Snippet Content Authoring Plan
5. Knowledge Evidence Contract Plan
6. Knowledge Progress State Plan
7. Knowledge Trial Plan
8. Knowledge UI Plan

Each remains a separate scoped run unless a later prompt explicitly combines them.

## 15. Non-Goals And Forbidden Changes

This plan does not authorize:

- no schema file changes
- no content JSON records
- no runtime loaders or behavior
- no database or generated-output changes
- no save/account/session state
- no evidence or progress state
- no completion math
- no trials
- no UI
- no Chronicle/Renown/quest events
- no item/spell/skill ownership changes
- no automatic Arcane Lore skill link
- no legacy naming refactor
- no settlement/map/travel/economy implementation
- no compatibility aliases or migration shims
- no unrelated cleanup
