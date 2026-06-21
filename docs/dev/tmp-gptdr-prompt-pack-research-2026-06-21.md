# GPT Deep Research Prompt Pack Research

Source route: GPT Deep Research prompt-pack pass after `Version 0.5.219 - Recipe And Production Schema Decision`
Date: 2026-06-21
Status: temporary non-canonical research artifact
Next intended consumer: a future Codex/GPT integration pass that promotes the durable ordering, prompt-pack pattern, and artifact naming guidance into permanent planning or tooling docs, then retires this file.

## 1. Executive Summary

This Deep Research pass confirms that the next 10 outstanding GPT Deep Research gates are the same 10 topics already listed by the pipeline roadmap and GPT-DR tracking policy:

1. `GPT-DR.discovery.poi-map-reveal`
2. `GPT-DR.services.vendor-service-access`
3. `GPT-DR.resources.gathering-extraction`
4. `GPT-DR.health.injury-recovery`
5. `GPT-DR.agriculture.land-food-livestock`
6. `GPT-DR.maritime.ships-ports-sea-trade`
7. `GPT-DR.time.calendar-weather-festivals`
8. `GPT-DR.property.ownership-storage-housing`
9. `GPT-DR.construction.upgrades-infrastructure`
10. `GPT-DR.progression.character-creation-skills`

No new GPT Deep Research is required before the current immediate numbered Codex queue. This prompt-pack research exists to prepare later GPT-DR gates so future research runs remain narrow and feed one later authority or schema lane at a time.

The recommended first GPT-DR to run later is `GPT-DR.discovery.poi-map-reveal`, because it informs map-feature seed planning and later settlement-site decisions. Services, resources, and health are the next highest-value gates because they feed near-future boundary or schema decisions after the immediate schema-decision queue.

## 2. Confirmed Current Roadmap Context

The consolidated roadmap already identifies the 10 topics as future research gates and states their associated future lanes. This research pass confirms that the list remains valid and should not be merged into one broad research report or one authority lane.

Each prompt should produce one temporary report under `docs/dev/tmp-*-research-YYYY-MM-DD.md`. The later integration pass must then either promote the useful guidance into permanent design docs and delete the temporary file, or retain the temporary file with exactly one named next consumer and removal condition.

## 3. Recommended Priority Order For The 10 GPT-DR Gates

| Priority | GPT-DR label | Recommended associated future lane | Reason |
| --- | --- | --- | --- |
| 1 | `GPT-DR.discovery.poi-map-reveal` | Map-feature seed planning and settlement-site/district work | Needed by POI, landmark, discovery, map reveal, and site placement questions. |
| 2 | `GPT-DR.services.vendor-service-access` | Service authority boundary | Needed before shops, vendors, training, lodging, repair, temple, and access-gate modeling. |
| 3 | `GPT-DR.resources.gathering-extraction` | Resource/commodity schema or gathering authority | Needed before node, extraction, mining, fishing, forestry, foraging, and resource-source modeling. |
| 4 | `GPT-DR.health.injury-recovery` | Combat status/condition/injury boundary | Needed before long-term injury, disease, recovery, fatigue, poison, morale, and condition boundaries. |
| 5 | `GPT-DR.agriculture.land-food-livestock` | Agriculture/resource-production lane | Needed after core economy/resource/map decisions to address farms, livestock, food cycles, and harvests. |
| 6 | `GPT-DR.maritime.ships-ports-sea-trade` | Maritime/port/sea-route authority | Needed after map/route decisions for ships, ports, sea trade, fishing, piracy, ferries, and naval travel. |
| 7 | `GPT-DR.time.calendar-weather-festivals` | Temporal/weather/festival authority | Useful after static authority stabilization; avoid runtime weather/UI until later. |
| 8 | `GPT-DR.property.ownership-storage-housing` | Property/housing/storage authority | Depends on people/household/site decisions; should keep physical anchors separate from runtime ownership. |
| 9 | `GPT-DR.construction.upgrades-infrastructure` | Construction/project/infrastructure authority | Depends on site/infrastructure distinctions; should not become settlement runtime. |
| 10 | `GPT-DR.progression.character-creation-skills` | Later character creation/skills/progression consolidation | Can wait until current static-authority queue is more mature. |

## 4. Dependency Map

- Discovery depends on world geography, travel, settlement, map feature, and future settlement-site decisions.
- Services depend on settlements, building templates, workplaces, economy, NPC/people, property, and future sites, but should not absorb economy transactions or service execution.
- Resources depend on geography, crafting, economy, travel, item identity, and future commodities, but should not mutate production-chain authority.
- Health depends on combat, monsters, status/condition boundaries, services/medicine, NPC/player state, and future runtime decisions.
- Agriculture depends on resources, economy, settlement, time/weather, property, construction, and livestock but should not force immediate simulation.
- Maritime depends on travel, map features, settlements/sites, economy, resources, ships/ports, fishing, piracy, and route security.
- Time/weather/festivals depend on calendar, events, agriculture, travel, religious/civic cycles, and runtime-readiness but should stay static/descriptive until approved.
- Property depends on settlement sites, households/families, people/NPCs, economy, construction, storage, and runtime ownership but should not enter settlement identity records.
- Construction depends on infrastructure definitions, settlement sites, resources, economy, property, and runtime project state but should keep template vs placed/project state separate.
- Progression depends on player identity, skills, Knowledge, trials, magic study, guilds, services/training, and quests but can wait.

## 5. Research Gate Summaries

### 5.1 `GPT-DR.discovery.poi-map-reveal`

Associated lane: map-feature seed planning and settlement-site/district decisions.

Goal: research how discoveries, POIs, landmarks, secrets, authored map reveal, fog-of-war analogues, and exploration records should be authored and staged.

Must respect: world geography, travel, settlement, and map-feature authority boundaries.

Avoid absorbing: runtime travel state, pathfinding, travel UI, save state, encounter generation, procedural generation, quest state, and automatic map rendering.

Recommended mode: GPT Deep Research Light is sufficient.

### 5.2 `GPT-DR.services.vendor-service-access`

Associated lane: service authority boundary.

Goal: research how vendors, shops, training, lodging, repair, temples, healers, guides, ferries, transport services, and access gates should be represented as static/descriptive services before runtime execution exists.

Must respect: settlement, buildings, workplaces, economy, NPC/social, property, crafting, health, and religion boundaries.

Avoid absorbing: vendor inventory, stock, prices, transactions, shop UI, opening hours runtime, NPC schedules, ownership transfer, service effects, or quest-state mutation.

Recommended mode: GPT Deep Research Light; High if the user wants extensive source comparison.

### 5.3 `GPT-DR.resources.gathering-extraction`

Associated lane: resource/commodity schema or gathering authority.

Goal: research node placement, extraction sources, harvestability, depletion posture, gathering requirements, tool/skill references, fish/ore/wood/forage resource classes, and relationship to item keys and production chains.

Must respect: crafting, economy, travel, world geography, item identity, and production-chain boundaries.

Avoid absorbing: crafting execution, production-chain migration, market pricing, settlement stock, agriculture simulation, map reveal, travel execution, and runtime depletion.

Recommended mode: GPT Deep Research High.

### 5.4 `GPT-DR.health.injury-recovery`

Associated lane: combat status/condition/injury boundary.

Goal: research health models, conditions, injuries, disease, medicine, fatigue, aging, poison, long-term recovery, death/defeat, and healing service boundaries.

Must respect: combat, monster, item, service, NPC/player state, and future runtime boundaries.

Avoid absorbing: combat execution, injury runtime, mutable health state, UI, storage, loot/reward, crafting medicines, or service execution.

Recommended mode: GPT Deep Research High.

### 5.5 `GPT-DR.agriculture.land-food-livestock`

Associated lane: agriculture/resource-production authority.

Goal: research land use, farms, crop cycles, livestock, food production, harvest windows, field/site anchors, and how static agriculture relates to resource/economy/time/weather systems.

Must respect: resource, economy, settlement, property, construction, time/weather, and item boundaries.

Avoid absorbing: live crop simulation, weather execution, settlement runtime, food stock mutation, market pricing, property transfer, NPC labor schedules, and construction execution.

Recommended mode: GPT Deep Research High.

### 5.6 `GPT-DR.maritime.ships-ports-sea-trade`

Associated lane: maritime/port/sea-route authority.

Goal: research ships, ship templates, ports, docks, ferries, sea routes, fishing, piracy, naval travel, maritime trade, and static shipping lanes.

Must respect: travel, map feature, settlement sites, economy, resource/fishing, route security, and combat boundaries.

Avoid absorbing: runtime sailing, pathfinding, naval combat, cargo mutation, market transactions, ship construction, crew/NPC simulation, and UI.

Recommended mode: GPT Deep Research High.

### 5.7 `GPT-DR.time.calendar-weather-festivals`

Associated lane: temporal/weather/festival authority.

Goal: research calendar structure, seasons, weather definitions, recurring festivals, holidays, civic/religious cycles, and static schedule records.

Must respect: events/quests, religion, civic, agriculture, travel, resources, settlement, and runtime boundaries.

Avoid absorbing: runtime weather simulation, event execution, UI calendar, save-state time advancement, festival rewards, quest state, or agricultural production mutation.

Recommended mode: GPT Deep Research Light.

### 5.8 `GPT-DR.property.ownership-storage-housing`

Associated lane: property/housing/storage authority.

Goal: research physical property anchors, ownership records, housing, estates, businesses, storage, warehouses, rent, inheritance, residency, and household association.

Must respect: settlement sites, family/household, people/NPCs, economy, construction, storage/save-state, and property runtime boundaries.

Avoid absorbing: settlement identity, mutable ownership transfer, inventory storage runtime, rent payment, tax simulation, inheritance execution, player housing UI, or business operations.

Recommended mode: GPT Deep Research Light.

### 5.9 `GPT-DR.construction.upgrades-infrastructure`

Associated lane: construction/project/infrastructure authority.

Goal: research construction projects, upgrades, infrastructure build requirements, fortifications, settlement development, building project records, and template-vs-instance distinctions.

Must respect: settlement sites, infrastructure definitions, buildings, workplaces, resources, economy, property, and runtime boundaries.

Avoid absorbing: construction queues, build timers, labor assignment runtime, resource consumption execution, settlement stock mutation, damage/repair state, UI, or save state.

Recommended mode: GPT Deep Research Light.

### 5.10 `GPT-DR.progression.character-creation-skills`

Associated lane: later character creation/skills/progression consolidation.

Goal: research attributes, skills, backgrounds, classes, progression, training, ranks, advancement methods, and relationship to Knowledge/trials/guilds/services.

Must respect: player identity, Knowledge, trials, magic study, guilds, services/training, NPCs, quests, item rewards, and runtime progression boundaries.

Avoid absorbing: NPC/person schema, quest rewards, trial completion, Knowledge progression, magic learning, service execution, UI, or save-state mutation.

Recommended mode: GPT Deep Research Light.

## 6. Prompt Pack

### Prompt 1: Discovery / POI / Map Reveal

```text
Deep Research - Light is acceptable; use High only if available.

Research topic:
Discovery, exploration records, map reveal, points of interest, secrets, and landmarks for Lineage Reforged.

Repository:
Lineage_Reforged

Purpose:
Produce a narrow research report that prepares the later discovery/POI/map-reveal authority lane. The report should help decide how static POIs, authored discoveries, landmarks, secrets, map-feature content, and future discovery state should relate to world geography, travel, map features, settlement sites, and quests.

Primary repo files to inspect:
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/gpt-codex-tooling-instructions.md`
- `docs/design/pipeline-roadmap-consolidation-decision.md`
- `docs/design/gpt-deep-research-version-tracking-decision.md`
- `docs/design/world-geography-authority-boundary-decision.md`
- `docs/design/travel-authority-boundary-decision.md`
- `docs/design/settlement-authority-boundary-decision.md`
- `docs/design/settlement-identity-schema-decision.md`
- `packages/content/base/world/**`
- `packages/schemas/world/**`

External research targets:
- open-world RPG POI/landmark systems;
- map marker discovery systems;
- fog-of-war and reveal models;
- CRPG exploration journal/location discovery patterns;
- tabletop hex-crawl point-of-interest practices.

Core questions:
1. What static authorities should own POIs, landmarks, secrets, and discovered-location descriptors?
2. How should future POI records reference world hexes, regions, localities, settlements, routes, or sites?
3. What belongs in static authored POI data versus runtime discovery state?
4. How should secrets and hidden POIs be authored without implementing map reveal or UI?
5. How should POIs relate to map-feature content and settlement-site records?
6. What validation questions should a later Codex authority decision answer?

Output sections:
1. Executive Summary
2. Current Repo Boundary Context
3. External Design Patterns
4. Recommended Static Discovery/POI Authority Shape
5. Map, Hex, Region, Settlement, Route, and Site Reference Posture
6. Runtime Discovery/Map-Reveal Boundary
7. Risks And Open Questions
8. Recommended Future Codex Integration Prompt

Non-goals:
- no schema changes;
- no content JSON changes;
- no runtime map reveal;
- no pathfinding;
- no travel simulation;
- no UI;
- no save-state changes;
- no quest-state mutation;
- no implementation.

Suggested temporary artifact:
`docs/dev/tmp-discovery-poi-map-reveal-research-YYYY-MM-DD.md`
```

### Prompt 2: Services / Vendors / Access

```text
Deep Research - Light is acceptable; use High only if available.

Research topic:
Services, vendors, shops, training, lodging, repair, temples, healers, ferries, transport services, and access gates for Lineage Reforged.

Repository:
Lineage_Reforged

Purpose:
Produce a narrow research report that prepares a future service authority boundary. The report should help determine how services are authored, referenced, gated, and separated from runtime vendor inventory, transactions, service execution, NPC schedules, settlement identity, and property ownership.

Primary repo files to inspect:
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/gpt-codex-tooling-instructions.md`
- `docs/design/pipeline-roadmap-consolidation-decision.md`
- `docs/design/gpt-deep-research-version-tracking-decision.md`
- `docs/design/settlement-authority-boundary-decision.md`
- `docs/design/settlement-identity-schema-decision.md`
- `docs/design/economy-authority-boundary-decision.md`
- `docs/design/crafting-authority-boundary-decision.md`
- `docs/design/npc-and-social-authority-boundary-decision.md`
- `packages/content/base/civilization/buildings.json`
- `packages/content/base/civilization/workplaces.json`
- `packages/content/base/world/settlements.json`

External research targets:
- RPG vendor/shop service models;
- settlement service directory systems;
- training and trainer availability models;
- inn/lodging/temple/healer service patterns;
- tabletop town service tables.

Core questions:
1. Should services be building functions, placed-site functions, NPC-provided services, or a separate service catalog?
2. What static fields describe a service without executing it?
3. How should services reference buildings, workplaces, sites, settlements, NPCs, guilds, skills, religion, or economy authorities?
4. What belongs to vendor/shop inventory and transaction runtime, not service authority?
5. What access gates can be descriptive only?
6. What future Codex decision should follow this research?

Output sections:
1. Executive Summary
2. Current Repo Boundary Context
3. External Service/Vendor Design Patterns
4. Recommended Static Service Authority Options
5. Building, Site, NPC, Settlement, Economy, Guild, And Religion Reference Posture
6. Runtime Transaction/Execution Boundary
7. Risks And Open Questions
8. Recommended Future Codex Integration Prompt

Non-goals:
- no schema changes;
- no vendor inventory;
- no transactions;
- no price calculations;
- no runtime service effects;
- no NPC schedules;
- no UI;
- no implementation.

Suggested temporary artifact:
`docs/dev/tmp-services-vendor-service-access-research-YYYY-MM-DD.md`
```

### Prompt 3: Resources / Gathering / Extraction

```text
Deep Research - High recommended.

Research topic:
Resource nodes, gathering, extraction, mining, forestry, fishing, foraging, and source descriptors for Lineage Reforged.

Repository:
Lineage_Reforged

Purpose:
Produce a narrow research report that prepares the future resource/commodity or gathering authority lane. The report should clarify how static gatherable resources, resource nodes, extraction sources, item yields, tool/skill requirements, geography anchors, and depletion/runtime boundaries should be represented.

Primary repo files to inspect:
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/gpt-codex-tooling-instructions.md`
- `docs/design/pipeline-roadmap-consolidation-decision.md`
- `docs/design/gpt-deep-research-version-tracking-decision.md`
- `docs/design/crafting-authority-boundary-decision.md`
- `docs/design/recipe-and-production-schema-decision.md`
- `docs/design/economy-authority-boundary-decision.md`
- `docs/design/travel-authority-boundary-decision.md`
- `docs/design/world-geography-authority-boundary-decision.md`
- `packages/content/base/civilization/production_chains.json`
- `packages/content/base/items/items.json`
- `packages/content/base/world/**`

External research targets:
- survival/RPG gathering node systems;
- MMO mining/foraging/fishing nodes;
- strategy resource-source systems;
- crafting/economy resource separation patterns;
- tabletop wilderness resource procedures.

Core questions:
1. What is the difference between a static resource node, resource type, item yield, commodity, and production-chain extract stage?
2. Should resources be placed world records, geography-derived descriptors, or both?
3. How should resource nodes reference items, tools, skills, regions, hexes, settlements, travel, and economy authorities?
4. What runtime depletion, respawn, abundance, ownership, and harvest state must be deferred?
5. How should resource research avoid duplicating crafting recipes or production chains?
6. What future Codex authority or schema decision should consume this research?

Output sections:
1. Executive Summary
2. Current Repo Boundary Context
3. External Gathering/Extraction Design Patterns
4. Recommended Static Resource/Gathering Authority Options
5. Item, Tool, Skill, Geography, Economy, And Production Reference Posture
6. Runtime Depletion/Harvest Boundary
7. Risks And Open Questions
8. Recommended Future Codex Integration Prompt

Non-goals:
- no schema changes;
- no resource content seed;
- no gathering execution;
- no inventory mutation;
- no market pricing;
- no production-chain migration;
- no map reveal;
- no implementation.

Suggested temporary artifact:
`docs/dev/tmp-resources-gathering-extraction-research-YYYY-MM-DD.md`
```

### Prompt 4: Health / Injury / Recovery

```text
Deep Research - High recommended.

Research topic:
Health, injuries, disease, medicine, fatigue, aging, recovery, poison, morale, death, defeat, and long-term conditions for Lineage Reforged.

Repository:
Lineage_Reforged

Purpose:
Produce a narrow research report that prepares the future combat status/condition/injury boundary. The report should clarify static status/condition definitions, runtime health state boundaries, injury persistence, disease and poison handling, recovery systems, service/medicine references, and combat consequence ownership.

Primary repo files to inspect:
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/gpt-codex-tooling-instructions.md`
- `docs/design/pipeline-roadmap-consolidation-decision.md`
- `docs/design/gpt-deep-research-version-tracking-decision.md`
- `docs/design/combat-authority-boundary-decision.md`
- `docs/design/monster-record-schema-decision.md` if present
- `docs/design/item-equipment-inventory-authority-boundary-decision.md`
- `packages/content/base/world/monsters.json`
- `packages/content/base/game/**`
- `packages/content/base/items/items.json`

External research targets:
- CRPG and tabletop condition systems;
- injury and wound systems;
- disease/poison/fatigue mechanics;
- recovery and medicine service patterns;
- MMO status-effect taxonomies.

Core questions:
1. What belongs in static status/condition definitions versus runtime health state?
2. How should injuries differ from statuses, diseases, poisons, fatigue, morale, and recovery states?
3. Should combat consequences be condition records, injury records, service results, item effects, or runtime-only state?
4. How should health research respect monster, combat, item, service, and player/NPC boundaries?
5. What validation questions should a future condition/injury schema decision answer?
6. What should remain deferred to runtime and save-state decisions?

Output sections:
1. Executive Summary
2. Current Repo Boundary Context
3. External Health/Injury Design Patterns
4. Recommended Static Status/Condition/Injury Authority Options
5. Combat, Monster, Item, Service, NPC, And Player-State Reference Posture
6. Runtime Health/Recovery Boundary
7. Risks And Open Questions
8. Recommended Future Codex Integration Prompt

Non-goals:
- no schema changes;
- no condition content seed;
- no combat execution;
- no injury runtime;
- no healing execution;
- no item effect execution;
- no UI;
- no save-state implementation.

Suggested temporary artifact:
`docs/dev/tmp-health-injury-recovery-research-YYYY-MM-DD.md`
```

### Prompt 5: Agriculture / Food / Livestock

```text
Deep Research - High recommended.

Research topic:
Agriculture, land use, food production, farming, crops, livestock, harvests, and agricultural settlement support for Lineage Reforged.

Repository:
Lineage_Reforged

Purpose:
Produce a narrow research report that prepares future agriculture/resource-production authority work. The report should clarify static farm/field/livestock/crop descriptors, food output references, land/site anchors, seasonal dependencies, and runtime/simulation boundaries.

Primary repo files to inspect:
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/gpt-codex-tooling-instructions.md`
- `docs/design/pipeline-roadmap-consolidation-decision.md`
- `docs/design/economy-authority-boundary-decision.md`
- `docs/design/settlement-authority-boundary-decision.md`
- `docs/design/settlement-identity-schema-decision.md`
- `docs/design/crafting-authority-boundary-decision.md`
- `docs/design/recipe-and-production-schema-decision.md`
- `packages/content/base/civilization/infrastructure.json`
- `packages/content/base/world/settlements.json`
- `packages/content/base/items/items.json`

External research targets:
- farming/livestock systems in RPGs, strategy games, and city builders;
- crop-cycle and harvest models;
- food supply and storage systems;
- tabletop domain-management agriculture procedures.

Core questions:
1. What are the static authored units: farm, field, pasture, herd, crop, livestock breed, harvest product, or land-use zone?
2. How should agriculture reference settlements, sites, infrastructure, resources, items, economy, time/seasons, and property?
3. What belongs to crop/livestock definitions versus placed farm/site records?
4. What production, growth, yield, food-stock, spoilage, labor, and weather behavior must remain runtime/deferred?
5. What later Codex lane should consume this research?

Output sections:
1. Executive Summary
2. Current Repo Boundary Context
3. External Agriculture/Food/Livestock Design Patterns
4. Recommended Static Agriculture Authority Options
5. Settlement, Site, Infrastructure, Item, Economy, Resource, And Time Reference Posture
6. Runtime Growth/Yield/Food-Stock Boundary
7. Risks And Open Questions
8. Recommended Future Codex Integration Prompt

Non-goals:
- no schema changes;
- no agriculture content seed;
- no crop simulation;
- no livestock runtime;
- no food-stock mutation;
- no market pricing;
- no weather execution;
- no implementation.

Suggested temporary artifact:
`docs/dev/tmp-agriculture-land-food-livestock-research-YYYY-MM-DD.md`
```

### Prompt 6: Maritime / Ships / Ports / Sea Trade

```text
Deep Research - High recommended.

Research topic:
Maritime systems, ships, ports, docks, ferries, fishing, sea trade, piracy, naval travel, and sea-route anchors for Lineage Reforged.

Repository:
Lineage_Reforged

Purpose:
Produce a narrow research report that prepares future maritime/port/sea-route authority work. The report should clarify how ship templates, port/site anchors, sea-route descriptors, cargo/trade posture, fishing, piracy, and runtime sailing/combat boundaries should be separated.

Primary repo files to inspect:
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/gpt-codex-tooling-instructions.md`
- `docs/design/pipeline-roadmap-consolidation-decision.md`
- `docs/design/travel-authority-boundary-decision.md`
- `docs/design/world-geography-authority-boundary-decision.md`
- `docs/design/settlement-authority-boundary-decision.md`
- `docs/design/settlement-identity-schema-decision.md`
- `docs/design/economy-authority-boundary-decision.md`
- `packages/content/base/world/**`
- `packages/content/base/civilization/buildings.json`
- `packages/content/base/civilization/infrastructure.json`

External research targets:
- RPG and strategy maritime travel models;
- port/harbor and ferry systems;
- naval trade-route systems;
- fishing and piracy systems;
- ship template/cargo-capacity models.

Core questions:
1. What should own ship templates, port anchors, sea routes, ferries, fishing grounds, and piracy descriptors?
2. How should maritime records reference settlements, settlement sites, docks, infrastructure, map features, regions, hexes, economy, and route security?
3. What belongs to static shipping/port content versus runtime sailing/cargo/crew state?
4. How should sea travel avoid absorbing land travel, combat, economy, construction, or property authority?
5. What future Codex lane should consume this research?

Output sections:
1. Executive Summary
2. Current Repo Boundary Context
3. External Maritime/Port Design Patterns
4. Recommended Static Maritime Authority Options
5. Ship, Port, Settlement, Route, Economy, Resource, And Security Reference Posture
6. Runtime Sailing/Cargo/Naval Combat Boundary
7. Risks And Open Questions
8. Recommended Future Codex Integration Prompt

Non-goals:
- no schema changes;
- no ship content seed;
- no sailing runtime;
- no cargo mutation;
- no naval combat;
- no trade simulation;
- no port UI;
- no implementation.

Suggested temporary artifact:
`docs/dev/tmp-maritime-ships-ports-sea-trade-research-YYYY-MM-DD.md`
```

### Prompt 7: Time / Calendar / Weather / Festivals

```text
Deep Research - Light is acceptable; use High only if available.

Research topic:
Time, calendar, seasons, weather, festivals, holidays, recurring events, and temporal authority for Lineage Reforged.

Repository:
Lineage_Reforged

Purpose:
Produce a narrow research report that prepares future temporal/weather/festival authority work. The report should clarify static calendar definitions, season records, weather descriptors, recurring festivals, and boundaries with runtime time advancement, event execution, UI, agriculture, travel, religion, and civic systems.

Primary repo files to inspect:
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/gpt-codex-tooling-instructions.md`
- `docs/design/pipeline-roadmap-consolidation-decision.md`
- `docs/design/quest-event-chronicle-authority-boundary-decision.md`
- `docs/design/travel-authority-boundary-decision.md`
- `docs/design/civic-authority-boundary-decision.md`
- religion, sacred-site, and quest/event docs where relevant
- `docs/future_content_backlog.md`

External research targets:
- fantasy calendar design;
- CRPG/timekeeping models;
- weather and season systems;
- festival/holiday recurrence in games;
- tabletop calendar/event procedures.

Core questions:
1. What should a static calendar authority own?
2. Should seasons, weather profiles, and festivals be separate authorities or related subrecords?
3. How should time records reference religion, civic, agriculture, travel, quests, events, and settlements?
4. What belongs in static recurring-event descriptors versus runtime schedule/event state?
5. What future Codex lane should consume this research?

Output sections:
1. Executive Summary
2. Current Repo Boundary Context
3. External Calendar/Weather/Festival Design Patterns
4. Recommended Static Temporal Authority Options
5. Religion, Civic, Agriculture, Travel, Quest, Settlement, And Event Reference Posture
6. Runtime Time/Weather/Event Boundary
7. Risks And Open Questions
8. Recommended Future Codex Integration Prompt

Non-goals:
- no schema changes;
- no calendar content seed;
- no runtime clock;
- no weather simulation;
- no event execution;
- no quest-state mutation;
- no UI;
- no implementation.

Suggested temporary artifact:
`docs/dev/tmp-time-calendar-weather-festivals-research-YYYY-MM-DD.md`
```

### Prompt 8: Property / Ownership / Storage / Housing

```text
Deep Research - Light is acceptable; use High only if available.

Research topic:
Property, ownership, estates, businesses, storage, housing, residency, warehouses, and housing runtime boundaries for Lineage Reforged.

Repository:
Lineage_Reforged

Purpose:
Produce a narrow research report that prepares future property/housing/storage authority work. The report should clarify physical property anchors, ownership records, residency, estates, businesses, storage identities, and boundaries with settlement sites, households, economy, construction, inventory, and save-state runtime.

Primary repo files to inspect:
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/gpt-codex-tooling-instructions.md`
- `docs/design/pipeline-roadmap-consolidation-decision.md`
- `docs/design/settlement-authority-boundary-decision.md`
- `docs/design/settlement-identity-schema-decision.md`
- `docs/design/family-authority-boundary-decision.md`
- `docs/design/household-vs-family-schema-decision.md` if present
- `docs/design/item-equipment-inventory-authority-boundary-decision.md`
- `packages/content/base/civilization/buildings.json`
- `packages/content/base/world/settlements.json`

External research targets:
- RPG housing/property systems;
- domain-management estate systems;
- storage and warehouse models;
- business/property ownership models;
- tabletop household/property procedures.

Core questions:
1. What should own physical property anchors versus ownership/runtime state?
2. How should property reference settlement sites, buildings, households, families, people/NPCs, economy, storage, construction, and items?
3. Should businesses, homes, estates, and storage facilities share one property model or separate authorities?
4. What belongs in static property identity versus runtime ownership, access, inventory, rent, tax, or inheritance state?
5. What future Codex lane should consume this research?

Output sections:
1. Executive Summary
2. Current Repo Boundary Context
3. External Property/Housing/Storage Design Patterns
4. Recommended Static Property Authority Options
5. Settlement Site, Building, Household, Family, People, Economy, Item, And Construction Reference Posture
6. Runtime Ownership/Storage/Housing Boundary
7. Risks And Open Questions
8. Recommended Future Codex Integration Prompt

Non-goals:
- no schema changes;
- no property content seed;
- no inventory storage runtime;
- no ownership transfer;
- no rent/tax/inheritance execution;
- no player housing UI;
- no implementation.

Suggested temporary artifact:
`docs/dev/tmp-property-ownership-storage-housing-research-YYYY-MM-DD.md`
```

### Prompt 9: Construction / Upgrades / Infrastructure Projects

```text
Deep Research - Light is acceptable; use High only if available.

Research topic:
Construction, upgrades, settlement development, infrastructure projects, fortifications, build requirements, and project-state boundaries for Lineage Reforged.

Repository:
Lineage_Reforged

Purpose:
Produce a narrow research report that prepares future construction/project/infrastructure authority work. The report should clarify how building templates, infrastructure definitions, placed construction projects, upgrades, fortifications, resource/labor requirements, and runtime build state should be separated.

Primary repo files to inspect:
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/gpt-codex-tooling-instructions.md`
- `docs/design/pipeline-roadmap-consolidation-decision.md`
- `docs/design/settlement-authority-boundary-decision.md`
- `docs/design/settlement-identity-schema-decision.md`
- `docs/design/economy-authority-boundary-decision.md`
- `docs/design/crafting-authority-boundary-decision.md`
- `packages/content/base/civilization/buildings.json`
- `packages/content/base/civilization/infrastructure.json`
- `packages/content/base/civilization/workplaces.json`
- `packages/content/base/world/settlements.json`

External research targets:
- city-builder construction systems;
- strategy upgrade/fortification systems;
- building project/state models;
- domain-management construction procedures;
- infrastructure tier/progression models.

Core questions:
1. What should own reusable building and infrastructure definitions versus placed projects?
2. How should construction projects reference settlements, settlement sites, buildings, infrastructure, workplaces, resources, economy, property, and labor?
3. What belongs in static build requirements versus runtime project progress?
4. How should upgrades differ from construction, repair, damage, and maintenance?
5. What future Codex lane should consume this research?

Output sections:
1. Executive Summary
2. Current Repo Boundary Context
3. External Construction/Upgrade Design Patterns
4. Recommended Static Construction Authority Options
5. Settlement, Site, Building, Infrastructure, Resource, Economy, Property, And Labor Reference Posture
6. Runtime Project/Queue/Progress Boundary
7. Risks And Open Questions
8. Recommended Future Codex Integration Prompt

Non-goals:
- no schema changes;
- no construction content seed;
- no build queue;
- no resource consumption execution;
- no project progress runtime;
- no settlement stock mutation;
- no UI;
- no implementation.

Suggested temporary artifact:
`docs/dev/tmp-construction-upgrades-infrastructure-research-YYYY-MM-DD.md`
```

### Prompt 10: Character Creation / Skills / Progression

```text
Deep Research - Light is acceptable; use High only if available.

Research topic:
Character creation, attributes, skills, backgrounds, classes, progression, training, ranks, advancement, and player progression boundaries for Lineage Reforged.

Repository:
Lineage_Reforged

Purpose:
Produce a narrow research report that prepares later character/progression authority work. The report should clarify static attribute/skill/background/class/training descriptors, relationships with Knowledge/trials/guilds/services/magic, and boundaries with runtime progression, save-state, UI, rewards, quests, and NPC/person authority.

Primary repo files to inspect:
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/gpt-codex-tooling-instructions.md`
- `docs/design/pipeline-roadmap-consolidation-decision.md`
- `docs/design/npc-and-social-authority-boundary-decision.md`
- `docs/design/magic-study-authority-boundary-decision.md`
- `docs/design/quest-event-chronicle-authority-boundary-decision.md`
- Knowledge, trial, guild, magic, people/NPC, quest, and service docs where present
- `packages/content/base/game/**`
- `packages/content/base/knowledge/**`
- `packages/content/base/trials/**`

External research targets:
- classless and class-based RPG progression;
- skill rank systems;
- background/origin systems;
- training/service progression models;
- tabletop attribute and skill advancement systems.

Core questions:
1. What static authorities should own attributes, skills, backgrounds, classes, training, and progression descriptors?
2. How should progression reference Knowledge, trials, magic study, guilds, services, quests, items, and NPCs?
3. What belongs to character-creation definitions versus runtime player state?
4. How should skill ranks, training requirements, and unlocks be described without executing progress?
5. What future Codex lane should consume this research?

Output sections:
1. Executive Summary
2. Current Repo Boundary Context
3. External Character/Skill/Progression Design Patterns
4. Recommended Static Progression Authority Options
5. Knowledge, Trial, Guild, Service, Magic, Quest, Item, And NPC Reference Posture
6. Runtime Progression/Save-State/UI Boundary
7. Risks And Open Questions
8. Recommended Future Codex Integration Prompt

Non-goals:
- no schema changes;
- no character-creation content seed;
- no level-up runtime;
- no save-state mutation;
- no rewards;
- no UI;
- no quest progress;
- no implementation.

Suggested temporary artifact:
`docs/dev/tmp-progression-character-creation-skills-research-YYYY-MM-DD.md`
```

## 7. Suggested Repo Artifact Names For Future Reports

Use names that match the GPT-DR label and temporary research policy:

- `docs/dev/tmp-discovery-poi-map-reveal-research-YYYY-MM-DD.md`
- `docs/dev/tmp-services-vendor-service-access-research-YYYY-MM-DD.md`
- `docs/dev/tmp-resources-gathering-extraction-research-YYYY-MM-DD.md`
- `docs/dev/tmp-health-injury-recovery-research-YYYY-MM-DD.md`
- `docs/dev/tmp-agriculture-land-food-livestock-research-YYYY-MM-DD.md`
- `docs/dev/tmp-maritime-ships-ports-sea-trade-research-YYYY-MM-DD.md`
- `docs/dev/tmp-time-calendar-weather-festivals-research-YYYY-MM-DD.md`
- `docs/dev/tmp-property-ownership-storage-housing-research-YYYY-MM-DD.md`
- `docs/dev/tmp-construction-upgrades-infrastructure-research-YYYY-MM-DD.md`
- `docs/dev/tmp-progression-character-creation-skills-research-YYYY-MM-DD.md`

## 8. Suggested Future Codex Integration Prompt Pattern

When integrating a GPT-DR artifact, use this pattern:

```text
Codex 5.5 Local - High

Task:
Integrate the temporary GPT Deep Research artifact for <topic> into permanent Lineage Reforged planning docs.

Source artifact:
`docs/dev/tmp-<topic>-research-YYYY-MM-DD.md`

Purpose:
Promote durable guidance into a permanent design/planning doc, update coordination files, and either delete the temporary artifact or retain it with one named next consumer and removal condition.

This pass is documentation-only. Do not change schemas, validators, content JSON, tests, runtime, UI, storage, migrations, or gameplay behavior.

Required output:
- create or update a permanent `docs/design/...` decision/planning doc;
- update `docs/dev/current-codex-output.md`;
- update `docs/dev/current-gpt-handoff.md`;
- update roadmap/backlog/sequence docs only if the priority order, artifact lifecycle, or next consumer changes;
- retire the temporary artifact if fully promoted.
```

## 9. Open Risks

- Scope creep: each future GPT-DR must remain narrow.
- Overlap: services/economy/property/family/construction/resource topics touch one another and need strict boundaries.
- External assumptions: future Deep Research should cite current external sources where design claims depend on outside examples.
- Dependency shifts: if future Codex decisions land out of order, priority order should be rechecked.
- Artifact lifecycle: temporary prompt-pack guidance should not become canon unless promoted into permanent docs.

## 10. Recommended Next GPT-DR To Run First

Run `GPT-DR.discovery.poi-map-reveal` first when the project is ready for another Deep Research gate.

Do not run it before the current immediate numbered Codex queue requires it. As of this artifact, the immediate Codex route continues with the current `0.5.x` schema-decision queue.
