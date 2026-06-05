# Knowledge Domain Registry Plan

Source version/run: Version 0.5.107 - Knowledge Domain Registry Plan
Date: 2026-06-05
Status: planning-only registry definition; no runtime, schema, content, state, UI, or generated-output implementation

## 1. Purpose And Status

This document defines the planned stable shape, vocabulary, ownership boundaries, initial domain set, rollout waves, validation rules, and implementation sequence for a future knowledge-domain registry.

This pass does not implement:

- runtime behavior or runtime loading
- knowledge-domain or knowledge-snippet content JSON
- generated output
- UI or presentation behavior
- save, account, family, character, or session state
- evidence records or study events
- knowledge trials
- completion math or tier unlock math
- Chronicle, Renown, reputation, or quest events
- schema migrations or enum expansion

The plan is an authoring and validation contract only.

## 2. Registry Purpose

The knowledge-domain registry is the stable authored catalog of domain definitions. It answers:

- which domain ids exist
- what each domain means
- which group and rollout wave own it
- which snippet subjects, categories, and discovery sources it normally supports
- which skills, magic schools, and content collections are related references
- which future policy records may govern completion, trials, and visibility
- which known schema gaps must be resolved before content authoring expands

### Registry Records Versus Knowledge Snippets

A registry record defines a domain such as `knowledge_domain.flora`. It does not define a learnable fact.

A knowledge snippet defines one learnable fragment inside a domain. The existing planning schema owns snippet fields such as:

- `domainId`
- `subjectType`
- `subjectId`
- `tier`
- `category`
- `discoverySources`
- `progression`
- `visibility`

Many snippets may reference one registry record. Registry records must not duplicate snippet subjects, titles, prerequisites, progression weights, or visibility text.

### Registry Records Versus Runtime State

A registry record is deterministic authored metadata. It must not contain:

- discovered or completed snippet ids
- completion percentages
- unlocked tiers
- trial attempts or results
- evidence references
- study progress
- observation progress
- character, account, family, or session ownership state

Those concepts belong to future runtime/player-state contracts.

## 3. Current Repository Reality

The repository already has a narrow legacy resource-identification shape:

- `packages/content/base/player/knowledge_domains.json`
- `KnowledgeDomainRecord` in `packages/engines/civilization-engine/src/content.ts`
- `loadKnowledgeDomainContent()`

The current JSON contains:

- `knowledge_domain.flora`
- `knowledge_domain.fauna`
- `knowledge_domain.minerals`
- `knowledge_domain.general_lore`

Those records own skill support weights, identification difficulty, and automatic-identification thresholds. They are narrower than the broader domain registry planned here.

`knowledge_domain.arcane_lore` is a Wave 0 target because `skill.knowledge.arcane_lore` and the planning sources establish it as a current foundational domain. It is not currently present in `knowledge_domains.json`, and the Arcane Lore skill does not currently declare `knowledgeDomainId`.

This pass does not alter any of those files or relationships. A later schema plan must decide whether the broader registry:

- evolves the existing `knowledge_domains.json` current-data shape
- separates registry metadata from legacy resource-identification policy
- replaces the legacy interface in a dedicated implementation pass

No coexistence or migration mechanism is authorized here.

## 4. Planned Registry Record Shape

The future registry should use one record per stable domain id.

| Field | Type | Requirement | Ownership and rule |
| --- | --- | --- | --- |
| `id` | string | required | Stable canonical id in `knowledge_domain.<slug>` form. |
| `slug` | string | required | Stable route-safe slug matching the id suffix. |
| `name` | string | required | Human-readable domain name. |
| `summary` | string | required | Concise authored scope; never runtime progress. |
| `group` | enum | required | One planned domain group from Section 5. |
| `wave` | integer enum | required | `0`, `1`, `2`, or `3`; rollout metadata, not player progress. |
| `status` | enum | required | `active`, `planned`, `draft`, or `deferred`. |
| `canonicalSubjectTypes` | string[] | required | Current snippet subject types normally supported by the domain. Planned types require `schemaGapNotes`. |
| `supportedSnippetCategories` | string[] | required | Current snippet categories normally supported by the domain. Planned categories require `schemaGapNotes`. |
| `supportedDiscoverySourceFamilies` | string[] | required | Allowed families from Section 8. |
| `supportedDiscoverySourceTypes` | string[] | required | Allowed current schema source types; each must belong to a declared family. |
| `defaultEvidenceOwnerScopes` | string[] | required | Planning-only likely evidence owners from Section 9. |
| `relatedSkillIds` | string[] | required | References to supporting skills. Skill rank never grants completion. |
| `relatedMagicSchoolIds` | string[] | required | References only. Empty until a stable magic-school id authority is selected. |
| `relatedContentCollections` | string[] | required | Canonical content collections that may provide subjects or references. |
| `trialPolicyRef` | string or null | required | Future policy reference only; no trial behavior. |
| `completionPolicyRef` | string or null | required | Future policy reference only; no completion math. |
| `visibilityPolicyRef` | string or null | required | Future policy reference only; no reveal or UI behavior. |
| `schemaGapNotes` | string[] | required | Explicit subject, category, source, or reference gaps. |
| `notes` | string[] | required | Non-runtime design notes and authoring cautions. |

### Status Vocabulary

| Status | Meaning |
| --- | --- |
| `active` | Seeded and approved for registry-backed snippet authoring and validation. |
| `planned` | Approved stable id and scope, but not yet seeded as live registry content. |
| `draft` | Shape is under review and should not be referenced by new snippets. |
| `deferred` | Reserved for a later wave and not open for current content authoring. |

This plan approves ids and target metadata. It does not make any record `active` in runtime or content.

## 5. Domain Groups

The registry group vocabulary is:

- `natural_world`
- `geography_travel`
- `settlement_society`
- `monster_combat`
- `economy_materials`
- `medicine_body`
- `magic_arcana`
- `religion_myth`
- `history_culture`
- `military_tactics`
- `general`

Groups are authored taxonomy. They do not grant access, set UI order, calculate completion, or establish runtime ownership.

## 6. Initial Domain Set

The first registry seed-data pass should formalize these five Wave 0 records. The target status below describes the intended first seed posture, not a change made by this plan.

| Domain id | Slug | Name | Group | Target status | Current repository posture |
| --- | --- | --- | --- | --- | --- |
| `knowledge_domain.flora` | `flora` | Flora | `natural_world` | `active` | Legacy current record and linked skills exist. |
| `knowledge_domain.fauna` | `fauna` | Fauna | `natural_world` | `active` | Legacy current record and linked skills exist. |
| `knowledge_domain.minerals` | `minerals` | Minerals | `natural_world` | `active` | Legacy current record and linked skills exist. |
| `knowledge_domain.arcane_lore` | `arcane_lore` | Arcane Lore | `magic_arcana` | `planned` | Arcane Lore skill exists; no registry record or `knowledgeDomainId` link exists. |
| `knowledge_domain.general_lore` | `general_lore` | General Lore | `general` | `active` | Legacy current record and linked skill exist. |

### Wave 0 Record Profiles

| Domain id | Canonical current subject types | Supported current categories | Source families | Related skill references | Schema-gap notes |
| --- | --- | --- | --- | --- | --- |
| `knowledge_domain.flora` | `flora`, `item`, `region` | `identification`, `habitat`, `use`, `byproduct`, `processing`, `danger`, `lookalike`, `regional_variant`, `seasonality`, `trade_value`, `ritual_use`, `cultural_context`, `mechanical_application`, `custom` | `field_observation`, `practical_use`, `textual_study`, `instruction`, `event_record`, `custom` | `skill.resource.spotting.flora`, `skill.resource.identify.flora`, `skill.knowledge.flora_lore`, `skill.knowledge.general_lore` | Future `biome`, `habitat`, and `material` subject types may reduce use of `custom`. |
| `knowledge_domain.fauna` | `fauna`, `item`, `region` | `identification`, `habitat`, `behavior`, `use`, `byproduct`, `processing`, `danger`, `lookalike`, `regional_variant`, `seasonality`, `trade_value`, `cultural_context`, `mechanical_application`, `custom` | `field_observation`, `practical_use`, `textual_study`, `instruction`, `event_record`, `custom` | `skill.resource.spotting.fauna`, `skill.resource.identify.fauna`, `skill.knowledge.fauna_lore`, `skill.knowledge.general_lore` | Future `monster`, `habitat`, and `anatomy` subject types may be needed. |
| `knowledge_domain.minerals` | `mineral`, `item`, `region` | `identification`, `use`, `byproduct`, `processing`, `danger`, `lookalike`, `regional_variant`, `trade_value`, `ritual_use`, `mechanical_application`, `custom` | `field_observation`, `practical_use`, `textual_study`, `instruction`, `event_record`, `custom` | `skill.resource.spotting.minerals`, `skill.resource.identify.minerals`, `skill.knowledge.mineral_lore`, `skill.knowledge.general_lore` | Future `material`, `deposit`, and `production_chain` subject types may be needed. |
| `knowledge_domain.arcane_lore` | `spell`, `item`, `institution`, `historical_event`, `custom` | `identification`, `use`, `processing`, `danger`, `ritual_use`, `historical_context`, `cultural_context`, `mechanical_application`, `custom` | `field_observation`, `practical_use`, `textual_study`, `instruction`, `event_record`, `custom` | `skill.knowledge.arcane_lore` | Future `magic_school`, `conduit`, `catalyst`, `ritual`, and `theory_principle` subject types may be needed. |
| `knowledge_domain.general_lore` | `historical_event`, `culture`, `region`, `settlement`, `institution`, `ruin`, `item`, `custom` | all current categories | all current source families | `skill.knowledge.general_lore` | Broad catch-all; validation should discourage use when a specific domain applies. |

The first seed plan should select exact `supportedDiscoverySourceTypes`, evidence scopes, collection references, and policy references for each record. It must use only current schema values or record an explicit gap.

`relatedMagicSchoolIds` should remain empty in the first registry shape until a dedicated schema plan identifies the canonical magic-school id authority. Current spell `school` slugs and `skill.magic.school.*` ids must not be mixed implicitly.

## 7. Domain Waves

### Wave 0 - Existing And Current Foundations

- `knowledge_domain.flora`
- `knowledge_domain.fauna`
- `knowledge_domain.minerals`
- `knowledge_domain.arcane_lore`
- `knowledge_domain.general_lore`

### Wave 1 - Foundation Domains

- `knowledge_domain.ecology`
- `knowledge_domain.geography`
- `knowledge_domain.settlement_lore`
- `knowledge_domain.monster_lore`
- `knowledge_domain.trade_goods`
- `knowledge_domain.material_processing`
- `knowledge_domain.medicine`
- `knowledge_domain.arcane_theory`
- `knowledge_domain.catalysts`
- `knowledge_domain.conduits`
- `knowledge_domain.institutions`
- `knowledge_domain.cultures`
- `knowledge_domain.history`
- `knowledge_domain.tactics`

### Wave 2 - Runtime-Readiness Domains

- `knowledge_domain.regional_geography`
- `knowledge_domain.routes_and_passes`
- `knowledge_domain.locality_lore`
- `knowledge_domain.biomes`
- `knowledge_domain.habitats`
- `knowledge_domain.climate`
- `knowledge_domain.seasonal_patterns`
- `knowledge_domain.guilds`
- `knowledge_domain.orders`
- `knowledge_domain.temples`
- `knowledge_domain.academies`
- `knowledge_domain.markets`
- `knowledge_domain.local_economy`
- `knowledge_domain.caravan_routes`
- `knowledge_domain.crafting_materials`
- `knowledge_domain.anatomy`
- `knowledge_domain.herbalism`
- `knowledge_domain.toxicology`
- `knowledge_domain.spellcraft`
- `knowledge_domain.rituals`
- `knowledge_domain.wards`
- `knowledge_domain.religion`
- `knowledge_domain.doctrine`
- `knowledge_domain.myth`
- `knowledge_domain.weapon_lore`
- `knowledge_domain.armor_lore`

### Wave 3 - Expansion Domains

- `knowledge_domain.ocean_lanes`
- `knowledge_domain.beast_lore`
- `knowledge_domain.undead_lore`
- `knowledge_domain.aberration_lore`
- `knowledge_domain.draconic_lore`
- `knowledge_domain.customs`
- `knowledge_domain.law`
- `knowledge_domain.nobility`
- `knowledge_domain.local_politics`
- `knowledge_domain.heraldry`
- `knowledge_domain.underworld`
- `knowledge_domain.smithing_materials`
- `knowledge_domain.alchemy_reagents`
- `knowledge_domain.textiles`
- `knowledge_domain.woodworking_materials`
- `knowledge_domain.leatherworking_materials`
- `knowledge_domain.disease`
- `knowledge_domain.field_surgery`
- `knowledge_domain.elemental_lore`
- `knowledge_domain.divine_lore`
- `knowledge_domain.dark_lore`
- `knowledge_domain.druidic_lore`
- `knowledge_domain.saints_and_relics`
- `knowledge_domain.cults`
- `knowledge_domain.archaeology`
- `knowledge_domain.ancient_languages`
- `knowledge_domain.genealogy`
- `knowledge_domain.bloodline_lore`
- `knowledge_domain.relic_lore`
- `knowledge_domain.siegecraft`
- `knowledge_domain.military_orders`

Wave assignment controls planning and content rollout only. It does not unlock runtime systems or authorize broad content creation.

## 8. Discovery And Source Vocabulary

### Source Families

| Family | Current snippet source types |
| --- | --- |
| `field_observation` | `field_identification`, `travel_observation`, `combat_observation` |
| `practical_use` | `resource_use`, `crafting_use` |
| `textual_study` | `book_study`, `scroll_study`, `tome_study` |
| `instruction` | `teacher_instruction`, `institutional_study` |
| `event_record` | `quest_event`, `chronicle_record` |
| `custom` | `custom` |

The registry may constrain both families and exact source types. A snippet source type must belong to one of the domain's supported families and must appear in its exact source-type list.

### Non-Grant Rules

All registry records inherit these boundaries:

- access is not study
- observation is not mastery
- possession is not understanding
- Chronicle visibility is not knowledge
- reputation or Renown is not knowledge
- region or map visibility is not geography knowledge
- known-spell ownership is not arcane knowledge
- magic study access is not known-spell ownership
- skill rank is not knowledge completion
- quest visibility or acceptance is not knowledge
- UI visibility is not evidence

Sources describe possible routes. Only future scoped evidence and progression rules may credit discovery or completion.

## 9. Evidence Owner Scopes

The planned evidence-owner vocabulary is:

| Scope | Planning meaning |
| --- | --- |
| `character` | Character-owned observation, use, study, or instruction evidence. |
| `account` | Explicit account-scoped evidence only; never an automatic projection from character knowledge. |
| `family` | Explicit family-scoped evidence only; lineage does not fabricate knowledge. |
| `institution` | Institution-authored or institution-owned study/evidence context. |
| `region` | Region-scoped evidence or authority reference. |
| `settlement` | Settlement-scoped evidence or authority reference. |
| `quest_event` | Explicit quest outcome evidence. |
| `chronicle_record` | Explicit Chronicle record reference with a compatible owner scope. |
| `item_instance` | A specific item instance used or studied; generic possession is insufficient. |
| `document_instance` | A specific book, scroll, tome, grimoire, tablet, or document instance. |
| `teacher` | A specific teacher or mentor source. |
| `study_event` | A future explicit study event. |
| `travel_event` | A future explicit travel observation event. |
| `combat_event` | A future explicit combat observation event. |
| `custom` | Explicit special owner requiring notes and validation review. |

These values are planning vocabulary only. This pass creates no evidence record, owner state, or persistence shape.

## 10. Registry, Snippet, Runtime, And Presentation Boundaries

| Boundary | Owns | Must not own |
| --- | --- | --- |
| Registry | Stable domain identity, taxonomy, supported vocabularies, relationship references, policy references, schema-gap notes. | Per-player progress, evidence instances, snippet facts, UI state. |
| Snippet | Subject, tier, category, title, summary, prerequisites, discovery source declarations, authored weights, visibility hints. | Current discovery/completion state or domain-wide policy. |
| Runtime/player state | Discovered/completed snippets, derived completion, unlocked tiers, trials, evidence refs, study/observation progress. | Canonical domain or snippet definitions. |
| Source/evidence | Source record id, owner scope/id, location, subject observation, item/document instance, teacher/institution, quest outcome, Chronicle record. | Domain catalog metadata or unconditional grants. |
| Validation | Id format, uniqueness, reference integrity, vocabulary compatibility, custom-value notes, no-state/no-grant boundaries. | Gameplay mutation or progress calculation. |
| Presentation | Display order, icons/themes, filtering, hidden/locked rendering, progress display. | Registry truth, evidence creation, completion calculation. |
| Deferred | Completion math, tier policy behavior, trial behavior, persistence, study runtime, event integration, UI implementation. | Any implementation in this version. |

## 11. Validation Boundaries

A future registry schema and semantic validator should enforce:

1. Domain ids are stable, unique, and match `knowledge_domain.<slug>`.
2. `slug` matches the id suffix.
3. `group`, `wave`, and `status` use approved values.
4. Snippet `domainId` values reference registry ids.
5. Supported source types are current schema source types or are explicitly recorded as schema gaps.
6. Every supported source type maps to a declared supported source family.
7. Canonical subject types and supported categories are current schema values or have explicit `schemaGapNotes`.
8. `relatedSkillIds` are valid references only and never imply completion.
9. `relatedMagicSchoolIds` use one future canonical authority and never imply spell ownership.
10. Related content collections use a future validated collection vocabulary.
11. Policy references are references only and may remain `null` until their owners exist.
12. `custom` subject, category, source, or evidence-owner use requires notes.
13. Registry records contain no character, account, family, save, session, evidence, or completion state.
14. Registry records grant no access, knowledge, skills, spells, items, evidence, reputation, Renown, Chronicle records, or map visibility.
15. Source declarations do not treat access, possession, observation, membership, visibility, or rank as completion.

Validation is read-only authoring protection. It must not create or mutate runtime state.

## 12. Schema Gaps

The current `knowledge_snippet.schema.json` remains authoritative for current planning values. No enum changes are made in this pass.

### Subject-Type Gaps

Likely future subject types include:

- `route`
- `locality`
- `biome`
- `habitat`
- `climate`
- `market`
- `trade_good`
- `material`
- `production_chain`
- `monster`
- `magic_school`
- `conduit`
- `catalyst`
- `ritual`
- `doctrine`
- `law`
- `tactic`
- `weapon_profile`
- `armor_profile`
- `disease`
- `anatomy`
- `genealogy`
- `relic`
- `sea_lane`

### Category Gaps

Likely future categories include:

- `route_condition`
- `access_requirement`
- `market_pattern`
- `legal_status`
- `doctrine`
- `social_protocol`
- `tactical_counter`
- `anatomy_detail`
- `disease_symptom`
- `treatment_protocol`
- `genealogy_line`
- `relic_provenance`
- `language_fragment`
- `siege_use`

### Source Gaps

Potential future source distinctions include supervised ritual, oral tradition, archival research, social observation, market observation, medical practice, and archaeology/ruin investigation.

`custom` remains the escape hatch until a dedicated schema pass. It must not become a generic bypass: each use should carry explicit notes and later review.

## 13. Future Sequence

Recommended next safe sequence:

1. `Version 0.5.108 - Knowledge Domain Registry Schema Plan`
2. Knowledge Domain Registry Seed Data Plan
3. Knowledge Snippet Content Authoring Plan
4. Knowledge Evidence Contract Plan
5. Knowledge Progress State Plan
6. Knowledge Trial Plan
7. Knowledge UI Plan

The schema plan should decide:

- whether the broad registry evolves or separates from the legacy `KnowledgeDomainRecord`
- the registry schema location and wrapper shape
- exact required fields and enums
- policy-reference format
- related-content-collection vocabulary
- magic-school reference authority
- semantic validation ownership
- current-data transition rules for the four existing legacy records

Seed data, snippets, evidence, progress state, trials, and UI should remain separate runs.

## 14. Non-Goals And Forbidden Changes

This plan does not authorize:

- no runtime logic
- no content JSON records
- no schema enum expansion
- no generated output
- no save/account/session state
- no UI
- no completion math
- no trials
- no Chronicle/Renown events
- no item/spell/skill ownership changes
- no settlement/map/travel/economy implementation
- no evidence or persistence state
- no legacy interface refactoring
- no broad content authoring
- no unrelated cleanup
