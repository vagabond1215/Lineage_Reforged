# Ecology Knowledge Domain Seed Content Plan

Source version/run: Version 0.5.163 - Ecology Knowledge Domain Seed Content Plan
Date: 2026-06-15
Status: documentation-only registry and snippet seed planning

## 1. Decision

The next implementation should add the Ecology registry record and three Tier 1 Ecology snippets in one narrow content-only run:

- `Version 0.5.164 - Ecology Knowledge Domain Registry And Snippet Seed`

The combined slice is safe because the exact proposed record and snippets pass the current registry and snippet schemas and semantic validators in memory without schema, validator, test, or vocabulary changes.

This plan changes documentation only. Ecology remains absent from live registry and snippet content until the implementation run.

## 2. Exact Future Registry Record

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
    "skill.resource.spotting.flora",
    "skill.resource.identify.flora",
    "skill.resource.spotting.fauna",
    "skill.resource.identify.fauna",
    "skill.resource.spotting.minerals",
    "skill.resource.identify.minerals",
    "skill.resource.foraging",
    "skill.resource.hunting",
    "skill.resource.trapping",
    "skill.resource.fishing",
    "skill.survival.navigation"
  ],
  "relatedMagicSchoolIds": [],
  "relatedContentCollections": [
    "world.biomes",
    "world.climate_profiles",
    "world.fauna",
    "world.flora",
    "world.habitats",
    "world.minerals",
    "world.regional_ecology_profiles",
    "world.regions"
  ],
  "trialPolicyRef": null,
  "completionPolicyRef": null,
  "visibilityPolicyRef": null,
  "schemaGapNotes": [
    "The current snippet subject vocabulary has no habitat, biome, climate profile, ecological relationship, disease, domestication, or agricultural-system subject type.",
    "The current snippet validator supports live subject authority only for flora, fauna, mineral, and region records; item, settlement, culture, institution, ruin, historical_event, and custom subjects remain blocked.",
    "Predator/prey, migration, breeding, disease-vector, domestication, cultivation, mutualism, and climate-interaction categories must use an existing category only when the authored meaning remains accurate; otherwise authoring stays deferred."
  ],
  "notes": [
    "Ecology describes authored relationships and does not create population, depletion, breeding, production, disease, trade, prosperity, or travel-danger state.",
    "Related skills and collections are references only; skill rank, possession, location, or collection access does not grant knowledge.",
    "The first seed remains within current validated subject authorities and adds no trial, completion, visibility, runtime, or simulation policy."
  ]
}
```

### Reference Decisions

- All 15 skill ids resolve in the current skill catalog.
- The skill list retains subject identification/lore, natural-resource practice, and navigation references that have a direct Ecology authoring role.
- `skill.survival.animal_handling`, `skill.survival.field_medicine`, and `skill.settlement.trade` are removed from the earlier sketch because domestication, disease, and economic effects remain deferred.
- All eight collection ids resolve through the current file-derived base-content collection authority.
- Civilization, item, religion, and settlement collections are removed from the first record because the first seed does not use those authorities and their Ecology role remains broader future work.
- All policy references remain null. The record creates no runnable Ecology trial or readiness path.

## 3. Exact Tier 1 Snippet Seed

### Regional Ecology

```json
{
  "id": "knowledge_snippet.ecology.kaelvar.regional_variant",
  "domainId": "knowledge_domain.ecology",
  "subjectType": "region",
  "subjectId": "region.kaelvar",
  "tier": 1,
  "category": "regional_variant",
  "title": "Natural Pattern of Kaelvar",
  "summary": "Kaelvar combines dry uplands and Mediterranean-style coasts, supporting strong pastoral goods, wine, and minerals while making bulk staple output less reliable.",
  "discoverySources": [
    {
      "sourceType": "travel_observation",
      "sourceId": null,
      "locationScope": {
        "continentId": "region.kaelvar",
        "regionId": null,
        "settlementId": null,
        "biomeTags": []
      }
    }
  ],
  "progression": {
    "completionWeight": 1,
    "countsTowardTierCompletion": true,
    "trialUnlockWeight": 0
  },
  "visibility": {
    "lockedUntilDiscovered": true,
    "revealsSubjectIdentity": false,
    "hiddenSummary": "A regional natural pattern remains undiscovered."
  },
  "notes": [
    "Travel observation is a possible discovery route only; entering or revealing Kaelvar does not grant completion."
  ]
}
```

Authority basis:

- `region.kaelvar` exists and is a continent.
- The summary is derived from `regional_ecology.kaelvar` and the Kaelvar environment profile.
- `region`, `regional_variant`, and `travel_observation` are current schema values supported by the proposed domain.
- The location scope passes current continent authority.
- This does not duplicate the General Lore settlement-pattern snippet because it owns natural-system and resource suitability rather than settlement form.

### Fauna Seasonality

```json
{
  "id": "knowledge_snippet.ecology.sheep.seasonality",
  "domainId": "knowledge_domain.ecology",
  "subjectType": "fauna",
  "subjectId": "fauna.sheep",
  "tier": 1,
  "category": "seasonality",
  "title": "Seasonal Pattern of Sheep",
  "summary": "Sheep are sedentary, diurnal herbivores whose breeding seasons occur in spring and summer.",
  "discoverySources": [
    {
      "sourceType": "travel_observation",
      "sourceId": null,
      "locationScope": {
        "continentId": "region.kaelvar",
        "regionId": null,
        "settlementId": null,
        "biomeTags": []
      }
    }
  ],
  "progression": {
    "completionWeight": 1,
    "countsTowardTierCompletion": true,
    "trialUnlockWeight": 0
  },
  "visibility": {
    "lockedUntilDiscovered": true,
    "revealsSubjectIdentity": false,
    "hiddenSummary": "A seasonal animal pattern remains undiscovered."
  },
  "notes": [
    "Kaelvar lists sheep among its native fauna, but travel observation remains only a possible discovery route and does not grant completion."
  ]
}
```

Authority basis:

- `fauna.sheep` exists and records sedentary movement, diurnal activity, herbivorous diet, and spring/summer breeding seasons.
- `regional_ecology.kaelvar` lists sheep as native fauna.
- `fauna`, `seasonality`, and `travel_observation` pass current schema and semantic authority.
- No breeding simulation, population update, domestication behavior, or production effect is created.

### Flora Habitat

```json
{
  "id": "knowledge_snippet.ecology.grape_vine.habitat",
  "domainId": "knowledge_domain.ecology",
  "subjectType": "flora",
  "subjectId": "flora.grape_vine",
  "tier": 1,
  "category": "habitat",
  "title": "Habitat Needs of Grape Vine",
  "summary": "Grape vines favor temperate coastal conditions with high light, medium water needs, and silt, loam, or sandy-loam soils.",
  "discoverySources": [
    {
      "sourceType": "travel_observation",
      "sourceId": null,
      "locationScope": {
        "continentId": "region.kaelvar",
        "regionId": null,
        "settlementId": null,
        "biomeTags": []
      }
    }
  ],
  "progression": {
    "completionWeight": 1,
    "countsTowardTierCompletion": true,
    "trialUnlockWeight": 0
  },
  "visibility": {
    "lockedUntilDiscovered": true,
    "revealsSubjectIdentity": false,
    "hiddenSummary": "A plant habitat pattern remains undiscovered."
  },
  "notes": [
    "Kaelvar lists grape vine among its native flora, but travel observation remains only a possible discovery route and does not grant completion."
  ]
}
```

Authority basis:

- `flora.grape_vine` exists and records temperate-coastal climate, high light, medium water, and silt/loam/sandy-loam soil needs.
- `regional_ecology.kaelvar` lists grape vine as native flora.
- `flora`, `habitat`, and `travel_observation` pass current schema and semantic authority.
- No cultivation, harvest, farming, production, or economic behavior is created.

## 4. Validation And Implementation Shape

The exact future record plus all three snippets were appended to cloned in-memory wrappers and passed:

- the current registry record schema;
- `validateKnowledgeDomainRegistry(...)`;
- the current snippet record schema;
- `validateKnowledgeSnippets(...)`;
- current skill-id authority;
- current file-derived content-collection authority;
- current Flora, Fauna, Region, and location authority.

No schema, validator, vocabulary, or test change is required for the selected seed.

The implementation should edit only:

- `packages/content/base/player/knowledge_domain_registry.json`;
- `packages/content/base/player/knowledge_snippets.json`;
- required coordination/handoff documentation.

The implementation should run normal content lint. Because both target content files are already counted, the successful count should remain 56 checked files.

## 5. Deferred Work

Do not add during the seed implementation:

- habitat, biome, climate, ecological-relationship, disease, domestication, agriculture, production-chain, settlement, culture, institution, or custom subject support;
- predator/prey, migration, disease-vector, domestication, cultivation, mutualism, or climate-interaction categories;
- Ecology trial, readiness, completion, or visibility policy content;
- dedicated Ecology skills;
- evidence producers, progress state, storage, persistence, runtime loading, UI, simulation, population, breeding, depletion, production, trade, prosperity, disease, travel danger, rewards, events, commands, ownership mutation, or gameplay behavior.

The selected snippets are authored content only. Their discovery sources remain possible future evidence routes and do not grant discovery or completion.

## 6. Temporary Guardrail Decision

Retain both Ecology planning documents through the immediate implementation:

- `docs/design/ecology-knowledge-domain-plan.md` remains the durable domain-boundary source.
- This seed-content plan remains the exact implementation source.

After `0.5.164`, review this seed plan for cleanup or promotion. Keep it only while it prevents repeated analysis or supports a near-term validator/vocabulary follow-up.

## 7. Acceptance Criteria For Version 0.5.164

The implementation is complete only when:

- the exact Ecology registry record is added unchanged;
- the exact three snippets are added unchanged;
- all Ecology policy references remain null;
- current registry and snippet semantic validation passes;
- normal content lint remains 56 checked files;
- no schema, validator, test, helper, adapter, runtime, UI, storage, persistence, simulation, event, reward, command, ownership, or gameplay behavior changes;
- coordination docs record Ecology as live authored metadata/content only, not runtime authority.

## 8. Next Sequence

1. `Version 0.5.164 - Ecology Knowledge Domain Registry And Snippet Seed`
2. `Version 0.5.165 - Religion Knowledge Domain Plan`
3. `Version 0.5.166 - Religious Hotspot Knowledge Snippet Plan`
4. `Version 0.5.167 - Family Visibility And Heir Slot Projection Plan`
5. `Version 0.5.168 - Race-Specific Adult Age And Maturation Plan`
6. `Version 0.5.169 - Offspring Growth Role And Activity Build Plan`
7. `Version 0.5.170 - Recipe Ownership And Personal Learning Plan`
8. `Version 0.5.171 - 0.6.0 Runtime Ownership Transition Reassessment`
