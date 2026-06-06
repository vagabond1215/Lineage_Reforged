# Knowledge Domain Registry Seed Data Plan

Source version/run: Version 0.5.109 - Knowledge Domain Registry Seed Data Plan
Date: 2026-06-06
Status: planning-only Wave 0 seed-data contract; no schema, content, runtime, persistence, UI, or generated-output implementation

## 1. Purpose And Status

This document defines the exact five Wave 0 broad knowledge-domain registry records to author in later implementation passes.

This pass does not implement or change:

- schema files
- broad registry content JSON
- legacy knowledge-domain content
- skills or skill references
- runtime loaders or gameplay behavior
- content-lint validators
- migrations or database behavior
- UI or generated output
- save, account, family, character, or session state
- evidence or progress state
- completion or tier math
- knowledge trials
- Chronicle, Renown, reputation, or quest events
- item, spell, skill, or knowledge ownership

The records below are deterministic authored metadata drafts. They create no access, discovery, evidence, completion, ownership, or runtime state.

## 2. Source Authority Recap

`docs/design/knowledge-domain-registry-plan.md` owns:

- registry purpose
- domain groups and waves
- source-family and evidence-owner vocabulary
- registry, snippet, runtime, validation, and presentation boundaries
- the five-domain Wave 0 target

`docs/design/knowledge-domain-registry-schema-plan.md` owns:

- the future schema and content paths
- the exact required fields, enums, patterns, and nullable references
- the wrapper contract
- skill, magic-school, and content-collection reference authorities
- structural and semantic validation ownership
- current-data transition rules

`packages/schemas/player/knowledge_snippet.schema.json` remains the current authority for snippet subject, category, and discovery-source enum values.

## 3. Target Future Files

A later implementation should create:

- `packages/schemas/player/knowledge-domain-registry.schema.json`
- `packages/content/base/player/knowledge_domain_registry.json`

This planning pass must not create either file.

## 4. Wrapper Contract

The future content file uses this wrapper and no other top-level fields:

```json
{
  "records": []
}
```

The first seed-data implementation should replace the empty array with exactly the five Wave 0 records in Section 5 unless a later approved plan explicitly changes the set.

## 5. Exact Wave 0 Records

### Flora

```json
{
  "id": "knowledge_domain.flora",
  "slug": "flora",
  "name": "Flora",
  "summary": "Plants, fungi, and other botanical subjects, including identification, habitats, uses, hazards, and regional variation.",
  "group": "natural_world",
  "wave": 0,
  "status": "active",
  "canonicalSubjectTypes": [
    "flora",
    "item",
    "region"
  ],
  "supportedSnippetCategories": [
    "identification",
    "habitat",
    "use",
    "byproduct",
    "processing",
    "danger",
    "lookalike",
    "regional_variant",
    "seasonality",
    "trade_value",
    "ritual_use",
    "cultural_context",
    "mechanical_application"
  ],
  "supportedDiscoverySourceFamilies": [
    "field_observation",
    "practical_use",
    "textual_study",
    "instruction",
    "event_record"
  ],
  "supportedDiscoverySourceTypes": [
    "field_identification",
    "resource_use",
    "crafting_use",
    "travel_observation",
    "book_study",
    "teacher_instruction",
    "institutional_study",
    "scroll_study",
    "tome_study",
    "quest_event",
    "chronicle_record"
  ],
  "defaultEvidenceOwnerScopes": [
    "character",
    "institution",
    "region",
    "settlement",
    "quest_event",
    "chronicle_record",
    "item_instance",
    "document_instance",
    "teacher",
    "study_event",
    "travel_event"
  ],
  "relatedSkillIds": [
    "skill.resource.spotting.flora",
    "skill.resource.identify.flora",
    "skill.knowledge.flora_lore",
    "skill.knowledge.general_lore"
  ],
  "relatedMagicSchoolIds": [],
  "relatedContentCollections": [
    "items.consumable_profiles",
    "items.items",
    "world.biomes",
    "world.flora",
    "world.habitats",
    "world.regional_ecology_profiles",
    "world.regions"
  ],
  "trialPolicyRef": null,
  "completionPolicyRef": null,
  "visibilityPolicyRef": null,
  "schemaGapNotes": [
    "Future biome, habitat, and material subject types may reduce indirect region and item references."
  ],
  "notes": [
    "Field observation, possession, and practical use are discovery opportunities, not automatic completion.",
    "The legacy Flora identification policy remains separate and owns support weights and thresholds."
  ]
}
```

### Fauna

```json
{
  "id": "knowledge_domain.fauna",
  "slug": "fauna",
  "name": "Fauna",
  "summary": "Animals and other natural fauna, including identification, habitats, behavior, uses, hazards, and regional variation.",
  "group": "natural_world",
  "wave": 0,
  "status": "active",
  "canonicalSubjectTypes": [
    "fauna",
    "item",
    "region"
  ],
  "supportedSnippetCategories": [
    "identification",
    "habitat",
    "behavior",
    "use",
    "byproduct",
    "processing",
    "danger",
    "lookalike",
    "regional_variant",
    "seasonality",
    "trade_value",
    "cultural_context",
    "mechanical_application"
  ],
  "supportedDiscoverySourceFamilies": [
    "field_observation",
    "practical_use",
    "textual_study",
    "instruction",
    "event_record"
  ],
  "supportedDiscoverySourceTypes": [
    "field_identification",
    "resource_use",
    "crafting_use",
    "combat_observation",
    "travel_observation",
    "book_study",
    "teacher_instruction",
    "institutional_study",
    "scroll_study",
    "tome_study",
    "quest_event",
    "chronicle_record"
  ],
  "defaultEvidenceOwnerScopes": [
    "character",
    "institution",
    "region",
    "settlement",
    "quest_event",
    "chronicle_record",
    "item_instance",
    "document_instance",
    "teacher",
    "study_event",
    "travel_event",
    "combat_event"
  ],
  "relatedSkillIds": [
    "skill.resource.spotting.fauna",
    "skill.resource.identify.fauna",
    "skill.knowledge.fauna_lore",
    "skill.knowledge.general_lore"
  ],
  "relatedMagicSchoolIds": [],
  "relatedContentCollections": [
    "civilization.meat_cut_standards",
    "items.consumable_profiles",
    "items.items",
    "world.biomes",
    "world.fauna",
    "world.habitats",
    "world.regional_ecology_profiles",
    "world.regions"
  ],
  "trialPolicyRef": null,
  "completionPolicyRef": null,
  "visibilityPolicyRef": null,
  "schemaGapNotes": [
    "Future monster, habitat, and anatomy subject types may be needed before broader creature knowledge is authored."
  ],
  "notes": [
    "Observation, combat contact, possession, and practical use are evidence opportunities, not automatic completion.",
    "The legacy Fauna identification policy remains separate and owns support weights and thresholds."
  ]
}
```

### Minerals

```json
{
  "id": "knowledge_domain.minerals",
  "slug": "minerals",
  "name": "Minerals",
  "summary": "Minerals and naturally occurring material deposits, including identification, extraction context, processing, uses, hazards, and trade relevance.",
  "group": "natural_world",
  "wave": 0,
  "status": "active",
  "canonicalSubjectTypes": [
    "mineral",
    "item",
    "region"
  ],
  "supportedSnippetCategories": [
    "identification",
    "use",
    "byproduct",
    "processing",
    "danger",
    "lookalike",
    "regional_variant",
    "trade_value",
    "ritual_use",
    "mechanical_application"
  ],
  "supportedDiscoverySourceFamilies": [
    "field_observation",
    "practical_use",
    "textual_study",
    "instruction",
    "event_record"
  ],
  "supportedDiscoverySourceTypes": [
    "field_identification",
    "resource_use",
    "crafting_use",
    "travel_observation",
    "book_study",
    "teacher_instruction",
    "institutional_study",
    "scroll_study",
    "tome_study",
    "quest_event",
    "chronicle_record"
  ],
  "defaultEvidenceOwnerScopes": [
    "character",
    "institution",
    "region",
    "settlement",
    "quest_event",
    "chronicle_record",
    "item_instance",
    "document_instance",
    "teacher",
    "study_event",
    "travel_event"
  ],
  "relatedSkillIds": [
    "skill.resource.spotting.minerals",
    "skill.resource.identify.minerals",
    "skill.knowledge.mineral_lore",
    "skill.knowledge.general_lore"
  ],
  "relatedMagicSchoolIds": [],
  "relatedContentCollections": [
    "civilization.extraction_methods",
    "civilization.production_chains",
    "items.items",
    "world.crystal_catalog",
    "world.minerals",
    "world.regions"
  ],
  "trialPolicyRef": null,
  "completionPolicyRef": null,
  "visibilityPolicyRef": null,
  "schemaGapNotes": [
    "Future material, deposit, and production_chain subject types may reduce indirect item and region references."
  ],
  "notes": [
    "Field discovery, extraction, possession, processing, and trade exposure are evidence opportunities, not automatic completion.",
    "The legacy Minerals identification policy remains separate and owns support weights and thresholds."
  ]
}
```

### Arcane Lore

```json
{
  "id": "knowledge_domain.arcane_lore",
  "slug": "arcane_lore",
  "name": "Arcane Lore",
  "summary": "Spells, magical materials, institutions, and historical arcane practice, including identification, hazards, ritual context, and practical theory.",
  "group": "magic_arcana",
  "wave": 0,
  "status": "planned",
  "canonicalSubjectTypes": [
    "institution",
    "spell",
    "item",
    "historical_event"
  ],
  "supportedSnippetCategories": [
    "identification",
    "use",
    "processing",
    "danger",
    "ritual_use",
    "historical_context",
    "cultural_context",
    "mechanical_application"
  ],
  "supportedDiscoverySourceFamilies": [
    "field_observation",
    "practical_use",
    "textual_study",
    "instruction",
    "event_record"
  ],
  "supportedDiscoverySourceTypes": [
    "field_identification",
    "resource_use",
    "crafting_use",
    "combat_observation",
    "travel_observation",
    "book_study",
    "teacher_instruction",
    "institutional_study",
    "scroll_study",
    "tome_study",
    "quest_event",
    "chronicle_record"
  ],
  "defaultEvidenceOwnerScopes": [
    "character",
    "institution",
    "region",
    "settlement",
    "quest_event",
    "chronicle_record",
    "item_instance",
    "document_instance",
    "teacher",
    "study_event",
    "travel_event",
    "combat_event"
  ],
  "relatedSkillIds": [
    "skill.knowledge.arcane_lore"
  ],
  "relatedMagicSchoolIds": [
    "skill.magic.school.elemental",
    "skill.magic.school.enfeebling",
    "skill.magic.school.enhancing",
    "skill.magic.school.healing",
    "skill.magic.school.divine",
    "skill.magic.school.dark",
    "skill.magic.school.summoning",
    "skill.magic.school.druidic",
    "skill.magic.school.enchantment",
    "skill.magic.school.utility",
    "skill.magic.school.ninjutsu",
    "skill.magic.school.performance"
  ],
  "relatedContentCollections": [
    "civilization.guilds",
    "items.items",
    "player.spells",
    "world.crystal_catalog",
    "world.magic_infrastructure",
    "world.religions"
  ],
  "trialPolicyRef": null,
  "completionPolicyRef": null,
  "visibilityPolicyRef": null,
  "schemaGapNotes": [
    "Future magic_school, conduit, catalyst, ritual, and theory_principle subject types may be needed before specialized arcane snippets are authored."
  ],
  "notes": [
    "Arcane Lore is planned registry metadata only; it does not create identification-policy thresholds or runtime loading.",
    "A later skill-link pass must decide whether skill.knowledge.arcane_lore gains knowledgeDomainId; this plan does not edit the skill.",
    "Known-spell ownership, magic-study completion, and spell access remain separate authorities."
  ]
}
```

### General Lore

```json
{
  "id": "knowledge_domain.general_lore",
  "slug": "general_lore",
  "name": "General Lore",
  "summary": "Broad historical, cultural, civic, regional, and material context that does not belong to a more specific knowledge domain.",
  "group": "general",
  "wave": 0,
  "status": "active",
  "canonicalSubjectTypes": [
    "settlement",
    "region",
    "culture",
    "institution",
    "item",
    "ruin",
    "historical_event",
    "custom"
  ],
  "supportedSnippetCategories": [
    "identification",
    "habitat",
    "behavior",
    "use",
    "byproduct",
    "processing",
    "danger",
    "lookalike",
    "regional_variant",
    "seasonality",
    "trade_value",
    "ritual_use",
    "historical_context",
    "cultural_context",
    "mechanical_application",
    "custom"
  ],
  "supportedDiscoverySourceFamilies": [
    "field_observation",
    "practical_use",
    "textual_study",
    "instruction",
    "event_record",
    "custom"
  ],
  "supportedDiscoverySourceTypes": [
    "field_identification",
    "resource_use",
    "crafting_use",
    "combat_observation",
    "travel_observation",
    "book_study",
    "teacher_instruction",
    "institutional_study",
    "scroll_study",
    "tome_study",
    "quest_event",
    "chronicle_record",
    "custom"
  ],
  "defaultEvidenceOwnerScopes": [
    "character",
    "institution",
    "region",
    "settlement",
    "quest_event",
    "chronicle_record",
    "item_instance",
    "document_instance",
    "teacher",
    "study_event",
    "travel_event",
    "combat_event"
  ],
  "relatedSkillIds": [
    "skill.knowledge.general_lore"
  ],
  "relatedMagicSchoolIds": [],
  "relatedContentCollections": [
    "civilization.guilds",
    "civilization.quest_definitions",
    "game.events",
    "items.items",
    "world.region_localities",
    "world.regions",
    "world.religions",
    "world.settlements"
  ],
  "trialPolicyRef": null,
  "completionPolicyRef": null,
  "visibilityPolicyRef": null,
  "schemaGapNotes": [
    "Custom is permitted only for broad contextual subjects, categories, or sources that no current enum can represent; each snippet use requires explicit notes and semantic review.",
    "Current base content has no dedicated culture or ruin collection; future authoring must resolve those subjects through a verified owning collection or defer them."
  ],
  "notes": [
    "Use a specific registered domain whenever one owns the subject; General Lore is not a fallback for Flora, Fauna, Minerals, or Arcane Lore.",
    "All source declarations describe possible evidence routes only and never grant discovery or completion.",
    "The legacy General Lore identification policy remains separate and owns support weights and thresholds."
  ]
}
```

## 6. Required Record Constraints

- Flora, Fauna, Minerals, and General Lore use `status: "active"`.
- Arcane Lore uses `status: "planned"`.
- All five records use `wave: 0`.
- All policy references are explicit `null`.
- `relatedSkillIds` use only current ids from `player.skills`.
- `relatedMagicSchoolIds` use only current `skill.magic.school.*` skill ids.
- Spell `school` slugs are not magic-school references.
- The current spell-family values `control` and `ranged` are not used because no matching school-skill ids exist.
- Related content collections use only file-derived ids for existing JSON under `packages/content/base`.
- Subject, category, and source values use only current `knowledge_snippet.schema.json` enums.
- `custom` appears only in General Lore and is explicitly constrained by `schemaGapNotes` and `notes`.
- Arrays describe supported authoring vocabulary; they do not grant evidence, discovery, completion, ownership, or runtime access.

## 7. Record Guidance

### Natural-World Records

Flora, Fauna, and Minerals align their ids with the current legacy policy subset but do not copy identification weights or thresholds. Their related skills preserve the current spotting, identify, domain-lore, and General Lore support relationships as metadata references only.

Their collection lists are deliberately limited to existing base-content files that can provide subjects or supporting references. A collection reference does not add a runtime loader or make every record in that collection valid for every snippet category.

### Arcane Lore

Arcane Lore references the current Arcane Lore skill and all current `skill.magic.school.*` records. It does not use spell-school slugs and excludes `control` and `ranged`.

The relation to school skills, spells, magical infrastructure, crystals, religions, guilds, and items is descriptive only. It does not grant spells, training, study completion, institution membership, item ownership, or magical capability.

### General Lore

General Lore supports broad contextual subjects and all current categories and source types, including constrained `custom` use. Semantic validation and authoring review must reject General Lore when a more specific registered domain owns the subject.

General Lore must not become a bypass for missing domain design. Future specialized domains should narrow its practical authoring footprint over time.

## 8. Future Implementation Checklist

- [ ] The wrapper has one `records` array and no other top-level fields.
- [ ] The array contains exactly five records.
- [ ] Record ids are unique.
- [ ] Each slug matches its id suffix.
- [ ] Every wave value is `0`.
- [ ] Status values match this plan.
- [ ] Every policy reference is `null`.
- [ ] Every subject, category, and source value exists in `knowledge_snippet.schema.json`.
- [ ] Every source type belongs to a declared source family.
- [ ] Every declared source family has at least one source type.
- [ ] Every related skill id resolves to a current skill.
- [ ] Every related magic-school id resolves to a current `skill.magic.school.*` record with `category: "magic"` and a `school.` domain.
- [ ] No spell-school slug, `control`, or `ranged` value is used as a magic-school reference.
- [ ] Every related content collection resolves to an existing JSON path under `packages/content/base`.
- [ ] Every `custom` use has an explicit gap note or authoring note.
- [ ] No legacy identification-policy content changes.
- [ ] No runtime or database loading changes.

## 9. Arcane Lore Transition

`knowledge_domain.arcane_lore` is planned Wave 0 registry metadata only.

- It must not be added to `packages/content/base/player/knowledge_domains.json` during seed-data planning.
- It must not receive identification-policy weights or thresholds by default.
- A later seed-data implementation may add it to the broad registry content file.
- A later skill-reference realignment pass may decide whether `skill.knowledge.arcane_lore` should gain `knowledgeDomainId`.
- Neither change implies known-spell ownership, magic-study completion, spell access, evidence, discovery, or completion.

## 10. Legacy Identification-Policy Subset

`packages/content/base/player/knowledge_domains.json` remains the legacy identification-policy subset for:

- `knowledge_domain.flora`
- `knowledge_domain.fauna`
- `knowledge_domain.minerals`
- `knowledge_domain.general_lore`

The future broad registry must use the same ids for those domains. It must not duplicate or absorb the legacy support weights, identification difficulties, or automatic-identification thresholds.

## 11. Future Implementation Sequence

1. Knowledge Domain Registry Schema File
2. Knowledge Domain Registry Seed Data
3. Knowledge Domain Registry Semantic Validator Plan
4. Knowledge Domain Registry Semantic Validator
5. Skill Knowledge Domain Reference Realignment Plan
6. Knowledge Snippet Content Authoring Plan
7. Knowledge Evidence Contract Plan
8. Knowledge Progress State Plan
9. Knowledge Trial Plan
10. Knowledge UI Plan

The next recommended run is `Version 0.5.110 - Knowledge Domain Registry Schema File`.

## 12. Non-Goals And Forbidden Changes

This plan does not authorize:

- no schema files
- no content JSON edits
- no legacy `knowledge_domains.json` edits
- no skill edits
- no content-lint implementation
- no runtime loaders
- no migration code
- no generated output
- no UI
- no save/account/session state
- no snippet content
- no completion math
- no trials
- no evidence records
- no Chronicle/Renown events
- no item/spell/skill ownership changes
- no settlement/map/travel/economy implementation
- no unrelated cleanup
