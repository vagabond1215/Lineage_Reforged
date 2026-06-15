# Ecology Knowledge Domain Plan

Source version/run: Version 0.5.162 - Ecology Knowledge Domain Plan
Date: 2026-06-15
Status: documentation-only Knowledge domain planning

## 1. Purpose And Status

This plan defines Ecology as a future broad Knowledge domain and establishes its initial scope, relationship to current domains, candidate registry metadata, vocabulary posture, seed direction, validation expectations, and implementation sequence.

This run changes documentation only. It adds no registry record, snippet, schema, validator, test, helper, adapter, fixture, runtime loading, evidence, progress, trial state, storage, persistence, UI, event, reward, command, ownership mutation, simulation, or gameplay behavior.

No Ecology content is live. Ecology remains `v0.5.x` authored-content and validation planning, not `v0.6.x` runtime authority.

## 2. Current Authority Recap

- The broad Knowledge registry currently contains Flora, Fauna, Minerals, Arcane Lore, and General Lore.
- Flora alone has `trialPolicyRef: "knowledge_trial_policy.flora_tier_1"`. The reference is content-lint authority only and does not make a trial runnable.
- The strict Knowledge Trial Readiness Policy schema exists, but readiness content, semantic validation, reference alignment, adapters, attempts, rewards, and runtime behavior remain absent.
- Current snippets provide one first Tier 1 record each for Flora, Fauna, Minerals, and General Lore.
- Ecology is not a registry record, snippet domain, legacy identification policy, skill domain, runtime loader, or persisted state.
- Normal content lint remains `content-lint: ok (56 files checked)`.

## 3. Ecology Domain Rationale

Ecology should own knowledge about relationships among natural subjects, environments, seasons, resources, settlements, and human use. It should not duplicate the identity-focused facts owned by Flora, Fauna, or Minerals.

Ecology may cover:

- habitats and habitat suitability;
- predator/prey and food-web relationships;
- seasonal behavior and resource cycles;
- breeding patterns and migration;
- byproducts and resource outputs;
- environmental dangers and lookalike risks;
- regional variation and climate interaction;
- domestication, ranching, farming, and gardening relevance;
- disease and vector relationships;
- settlement, trade, and material relevance;
- religious and cultural interpretations of natural systems.

These are authored facts and relationships. They do not create population counts, depletion, production, disease, trade, prosperity, travel danger, or other mutable simulation state.

## 4. Domain Boundary Decision

Select one broad initial domain:

- `knowledge_domain.ecology`

Do not immediately split Ecology into habitat, flora ecology, fauna ecology, climate ecology, or resource ecology.

The broad domain is the conservative first path because:

- current authored content already crosses flora, fauna, minerals, habitats, climate, regions, settlements, and trade context;
- the current registry supports one stable broad identity without schema changes;
- narrow domains would require premature boundaries before seed snippets prove where authoring pressure exists;
- a broad record avoids duplicating facts across several incomplete domains;
- later subdivision can be based on actual snippet volume, prerequisite graphs, trial needs, and validator complexity.

Possible later domains such as `knowledge_domain.habitats`, `knowledge_domain.climate`, `knowledge_domain.seasonal_patterns`, and `knowledge_domain.disease` remain separate roadmap candidates. They must not be inferred from this plan.

## 5. Boundary With Existing Domains

### Flora

Flora owns plant and fungi subjects, identity, parts, uses, hazards, and subject-specific facts.

Ecology owns relationships such as habitat suitability, seasonal spread, pollination or mutualism, regional prevalence, cultivation context, and a plant's role in a wider resource system.

### Fauna

Fauna owns animal subjects, identity, behavior, danger, uses, and subject-specific facts.

Ecology owns predator/prey relationships, migration, breeding seasons, habitat pressure, domestication context, disease-vector relationships, and effects on regional resource systems.

### Minerals

Minerals owns mineral identity, deposits, extraction context, processing, uses, hazards, and trade facts.

Ecology may own environmental distribution or natural-system relationships involving mineral-bearing terrain, soil, water, flora, fauna, or settlement pressure. It must not become a second extraction or material-processing domain.

### General Lore

General Lore owns broad cultural, historical, civic, regional, and common background when no specific domain owns the fact.

Ecology owns natural-system relationships. General Lore should not be used as a fallback once an Ecology fact has a clear ecological subject and relationship.

### Arcane Lore

Arcane Lore remains planned and blocked.

This plan authorizes no Arcane Ecology, magical ecosystem rules, magic-school linkage, spell acquisition, Magic Study readiness, or magical runtime behavior. Any future magical ecology requires a separate domain and authority decision.

## 6. Candidate Registry Record

The following is a documentation-only draft for a future registry content run:

```json
{
  "id": "knowledge_domain.ecology",
  "slug": "ecology",
  "name": "Ecology",
  "summary": "Relationships among organisms, habitats, climate, seasons, resources, regions, and human use, including natural pressures and practical consequences.",
  "group": "natural_world",
  "wave": 1,
  "status": "active",
  "canonicalSubjectTypes": [
    "flora",
    "fauna",
    "mineral",
    "region"
  ],
  "supportedSnippetCategories": [
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
    "skill.knowledge.general_lore",
    "skill.knowledge.flora_lore",
    "skill.knowledge.fauna_lore",
    "skill.knowledge.mineral_lore",
    "skill.resource.foraging",
    "skill.resource.hunting",
    "skill.resource.trapping",
    "skill.resource.fishing",
    "skill.survival.navigation",
    "skill.survival.animal_handling",
    "skill.survival.field_medicine",
    "skill.settlement.trade"
  ],
  "relatedMagicSchoolIds": [],
  "relatedContentCollections": [
    "civilization.production_chains",
    "items.items",
    "world.biomes",
    "world.climate_profiles",
    "world.fauna",
    "world.flora",
    "world.habitats",
    "world.minerals",
    "world.regional_ecology_profiles",
    "world.regions",
    "world.religions",
    "world.settlements"
  ],
  "trialPolicyRef": null,
  "completionPolicyRef": null,
  "visibilityPolicyRef": null,
  "schemaGapNotes": [
    "The current snippet subject vocabulary has no habitat, biome, climate profile, ecological relationship, disease, domestication, or agricultural-system subject type.",
    "The current snippet validator supports live subject authority only for flora, fauna, mineral, and region records; item, settlement, culture, institution, and custom subjects remain blocked.",
    "Predator/prey, migration, breeding, disease-vector, domestication, cultivation, mutualism, and climate-interaction categories must use an existing category only when the authored meaning remains accurate; otherwise authoring stays deferred."
  ],
  "notes": [
    "Ecology describes authored relationships and does not create population, depletion, breeding, production, disease, trade, prosperity, or travel-danger state.",
    "Related skills and collections are references only; skill rank, possession, location, or collection access does not grant knowledge.",
    "The first seed should remain within current validated subject authorities unless a separate vocabulary or validator plan approves expansion."
  ]
}
```

### Candidate Posture

- `wave: 1` follows the existing registry rollout plan.
- `status: active` is the intended future seed posture so approved Ecology snippets may reference it after validation passes.
- All policy references remain null.
- No dedicated Ecology skill is invented.
- Related current skills are descriptive authoring references only.

The exact related-skill list should be confirmed in `Version 0.5.163` before content is edited. The first seed plan may narrow the list if a skill lacks a direct Ecology authoring role.

## 7. Vocabulary Reuse And Gaps

### Current Vocabulary To Reuse

Initial Ecology authoring should prefer:

- subjects: `flora`, `fauna`, `mineral`, `region`;
- categories: `habitat`, `behavior`, `use`, `byproduct`, `processing`, `danger`, `lookalike`, `regional_variant`, `seasonality`, `trade_value`, `ritual_use`, `cultural_context`, `mechanical_application`;
- source families: `field_observation`, `practical_use`, `textual_study`, `instruction`, `event_record`;
- source types: all current non-custom source types where the source is genuinely applicable;
- current base collections named in the candidate record.

`field_identification` may support an ecological fact only when observing the identified flora, fauna, or mineral plausibly reveals that relationship. Identification alone must not automatically grant broader ecological understanding.

### Current Gaps

The current schema and validator do not provide direct subjects for:

- habitats or biomes;
- climate profiles or seasonal systems;
- predator/prey pairs or food webs;
- ecological relationships such as mutualism or competition;
- disease or vector systems;
- domestication, ranching, farming, or gardening systems;
- production chains, workplaces, settlements, religions, or cultures as live snippet subjects.

The current category vocabulary also lacks exact categories for:

- predator/prey;
- migration;
- breeding;
- disease vector;
- domestication;
- cultivation;
- climate interaction;
- mutualism or competition.

Do not force these concepts into `custom` during the first seed. Use current categories only when they accurately describe the fact; otherwise record the concept as deferred schema/validator work.

## 8. Relationship To Future Systems

Ecology Knowledge may later inform, but must not implement:

- macro flora/fauna population or abundance engines;
- micro managed breeding;
- hunting or gathering depletion;
- farming or gardening production;
- ranching or domestication production;
- ecology-driven trade or economy effects;
- settlement prosperity or food-security effects;
- disease or vector runtime effects;
- religious or cultural ecology modifiers;
- travel danger mutation;
- climate or seasonal simulation;
- runtime loading or UI.

Those systems require explicit state owners, update cadence, storage, replay, balancing, and failure behavior. Authored Ecology content remains descriptive input until those owners exist.

## 9. First Seed-Content Direction

The next recommended run is:

- `Version 0.5.163 - Ecology Knowledge Domain Seed Content Plan`

That plan should first decide whether the registry record and a small snippet seed can land together or require separate implementation slices.

Candidate Tier 1 seed directions:

1. Habitat relationship: one current Flora or Fauna subject tied to an existing habitat and regional context.
2. Seasonal behavior: one Fauna subject with a current breeding or activity season expressed through `behavior` or `seasonality`.
3. Resource/byproduct ecology: one Flora or Fauna subject showing how a natural byproduct supports a wider regional or production relationship.
4. Cultivation or domestication relevance: one current Flora or Fauna subject, provided the fact can be authored without creating production behavior.
5. Disease/vector or regional variation: one Fauna, Flora, or Region subject, provided the current category accurately represents the fact.

The seed should be small enough to prove domain distinctness without becoming a general ecology encyclopedia. It should avoid duplicate versions of the current Aloe and Badger identification snippets.

## 10. Validation Expectations

A later implementation should follow this sequence:

1. Add `knowledge_domain.ecology` to the broad registry.
2. Run existing registry structural and semantic validation.
3. Change the registry validator only if a real new semantic rule is required.
4. Change schemas or schema-file tests only if new vocabulary is required.
5. Create a focused Ecology snippet content plan.
6. Add the selected snippet seed under current validated authorities.
7. Update snippet semantic validation only if a selected subject, category, source, or relationship requires new authority.

If the registry record fits the current schema and vocabularies, the implementation should avoid schema changes.

The current registry validator already supports:

- Wave 1;
- `natural_world`;
- the selected current subject/category/source values;
- current skill and content-collection references;
- null completion and visibility policies;
- a null Ecology trial policy.

The current snippet validator is stricter than the schema. It requires an active domain, current subject authority, a supported domain category and source, null source ids, and validated locations. The seed plan must account for those exact constraints.

Normal content-lint count changes must be based on actual new checked files. Editing the existing registry file alone does not add a checked file; adding snippets to the existing snippet file also does not add a checked file.

## 11. Knowledge Trial And Readiness Posture

Ecology planning creates none of the following:

- `trialPolicyRef`;
- readiness policy id or content;
- trial policy content;
- eligibility or readiness checks;
- trial attempts, checkpoints, outcomes, cooldowns, rewards, or unlocks;
- runtime trial behavior.

The future Ecology registry record must start with:

```json
{
  "trialPolicyRef": null,
  "completionPolicyRef": null,
  "visibilityPolicyRef": null
}
```

Any Ecology trial or readiness policy requires a separate plan after the Ecology registry record and sufficient snippet content exist.

## 12. Open Questions

- Should Ecology remain broad long-term or split after seed content?
- Which first Ecology subject should be seeded?
- Should disease/vector knowledge live under Ecology, Medicine, or both with distinct fact ownership?
- Should domestication/ranching knowledge live under Ecology, Craft/Trade, Settlement Lore, or multiple domains with non-duplicated snippets?
- Should religious/cultural interpretations be Ecology snippets, Religion snippets, Culture/General Lore snippets, or cross-domain prerequisites?
- Which current content collections should remain in the first Ecology registry record?
- Which current skills should relate to Ecology initially?
- Does Ecology need a dedicated skill later, or should current lore/resource/survival skills remain supporting references?
- Should Ecology eventually have Knowledge trials, or remain non-trial lore/progression first?
- Which concepts genuinely require new subject/category vocabulary instead of current Flora, Fauna, Minerals, and Region subjects?

## 13. Non-Goals

This plan authorizes none of the following:

- no registry edit;
- no snippet edit;
- no schema edit;
- no validator edit;
- no tests or fixtures;
- no runtime loading or simulation;
- no evidence, progress, completion, trial, or readiness behavior;
- no readiness content;
- no helper or adapter;
- no UI or generated output;
- no storage, persistence, save, account, session, or database behavior;
- no reward, event, command, ownership mutation, or gameplay behavior;
- no family, heir, religion, recipe, crafting, civil-society, maturation, estate, Skill Trial, or Spell/Magic Study implementation;
- no unrelated cleanup.

## 14. Future Sequence

Recommended near-term sequence:

1. `Version 0.5.163 - Ecology Knowledge Domain Seed Content Plan`
2. `Version 0.5.164 - Religion Knowledge Domain Plan`
3. `Version 0.5.165 - Religious Hotspot Knowledge Snippet Plan`
4. `Version 0.5.166 - Family Visibility And Heir Slot Projection Plan`
5. `Version 0.5.167 - Race-Specific Adult Age And Maturation Plan`
6. `Version 0.5.168 - Offspring Growth Role And Activity Build Plan`
7. `Version 0.5.169 - Recipe Ownership And Personal Learning Plan`
8. `Version 0.5.170 - 0.6.0 Runtime Ownership Transition Reassessment`

All remain `v0.5.x` planning or narrowly scoped foundation work until a later roadmap decision explicitly authorizes runtime ownership transition.

## 15. Acceptance Criteria For Version 0.5.163

The Ecology Knowledge Domain Seed Content Plan should be complete only when it:

- selects the exact future registry record fields;
- confirms the related skill and content-collection references;
- selects a small exact Tier 1 snippet seed;
- maps each snippet to current subject, category, source, and location authorities;
- identifies any required validator or vocabulary changes before implementation;
- preserves null policy references and non-runnable trials;
- keeps simulation, runtime, UI, storage, persistence, rewards, events, commands, and gameplay deferred.
