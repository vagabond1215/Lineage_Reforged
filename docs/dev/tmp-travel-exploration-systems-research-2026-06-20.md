# Temporary Deep Research: Travel, Exploration, Survival, Encounters, and Journey Systems

Status: temporary research artifact for Codex planning
Date: 2026-06-20
Source: Deep Research run from the user-provided travel/exploration/survival prompt.
Intended use: staging reference for a later narrow Codex planning pass.

> Temporary-file policy: this file is not final design canon. It should either be converted into one or more permanent `docs/design/**` decision documents or deleted after the relevant Codex planning passes land.

## 1. Executive Summary

The research pass examined travel, exploration, survival, encounters, camping/rest, route security, environmental danger, wilderness traversal, discovery, expeditions, map movement, journey preparation, route choice, and player-facing exploration loops for Lineage Reforged.

The strongest finding is that Lineage Reforged already has more authored travel foundation than a blank-slate project. The live content layer already includes:

- canonical world map data with scale assumptions, continent/ocean grouping, distance benchmarks, conflict-zone descriptors, and map-aligned authored entities;
- travel networks with travel-mode profiles, terrain/feature variance, overland route records, and maritime lanes;
- world hexes with biome, elevation, terrain, freshwater, friction, barriers, hazards, resource affinity, and settlement anchors;
- world hex edges with roads, trails, rivers, passes, ferries, sea lanes, crossing difficulty, route quality, and allowed travel modes;
- encounter templates and spawn profiles with region/habitat/hazard/density weighting;
- ecology, climate, biome, flora, fauna, consumable/ration, guild, and Knowledge hooks that already support future travel and exploration gameplay.

The core recommendation is not to start with pathfinding, travel-time simulation, survival meters, camping mechanics, encounter spawning, player discovery state, map UI, or weather runtime. Instead, formalize a dual-layer model:

1. **Graph-first travel authority** for routes, edges, route modes, route segments, and ETA logic.
2. **Hex-first exploration overlay** for discovery, hazard pressure, foraging opportunity, ecology, and wilderness identity.

The safest next Codex pass is a docs-only `Travel Authority Boundary Decision`.

## 2. Repo-State Boundary

The Deep Research report had strong direct evidence for major world/travel files, but the connector did not provide a complete filename census of all lint/test files. Codex must inspect the live checkout before creating any permanent design document.

Important live areas to verify again:

- `packages/content/base/world/world_maps.json`
- `packages/content/base/world/travel_networks.json`
- `packages/content/base/world/world_hexes.json`
- `packages/content/base/world/world_hex_edges.json`
- `packages/content/base/world/encounter_templates.json`
- `packages/content/base/world/spawn_profiles.json`
- `packages/content/base/world/biomes.json`
- `packages/content/base/world/climate_profiles.json`
- `packages/content/base/world/regional_ecology_profiles.json`
- Knowledge snippets / registry using travel observation or travel-event vocabulary
- content-lint and tests touching map/travel/hex/encounter/spawn systems

## 3. Current Gaps And Risks

### 3.1 Responsibility mixing

`travel_networks.json` currently appears to bundle travel-mode authority, ETA tuning, overland-route records, and maritime-lane records. That is serviceable now, but it will become brittle when ports, patrols, border checkpoints, tolls, convoy contracts, seasonal closures, camps, or journey-state references are added.

### 3.2 Graph / hex / pixel ambiguity

`world_maps.json` uses pixel coordinates for authored display and anchors. World hexes and hex edges already provide semantic movement topology. The repo needs a durable boundary:

- pixels are authored display geometry;
- hexes are semantic terrain/exploration cells;
- hex edges are traversal graph links;
- routes are named corridors or lanes;
- player journey/discovery state is future runtime/save state.

### 3.3 Danger duplication

Danger currently appears across multiple layers:

- hex hazard tags;
- ecology hazard pressure;
- map conflict zones;
- encounter-template tags;
- spawn-profile hazard bands;
- guild/adventurer/merchant route-security context.

The repo needs a clear future owner for route danger/security overlays.

### 3.4 Runtime state leakage

Knowledge already references travel observation and travel-event-like evidence. That is useful, but no canonical player journey/travel-event owner should be created in content authority. Runtime discovery, journey events, map reveal, fatigue, camp quality, supplies, and encounter outcomes must remain future runtime/save concerns.

## 4. Recommended Travel / Exploration Hierarchy

Recommended hierarchy:

```text
World
  -> World Map
    -> Region / Locality / Settlement
      -> World Hex
        -> World Hex Edge
          -> Route / Lane
            -> Future condition/security/hazard overlays
              -> Future POI/camp/rest/discovery overlays
                -> Future player journey state
```

Responsibility split:

- physical place answers where something exists;
- world map answers display-scale placement;
- world hex answers what kind of traversable area exists;
- world hex edge answers what can connect;
- route/lane answers what named corridor or travel path exists;
- overlays answer what conditions or risks apply;
- player state answers what was traveled, discovered, consumed, suffered, or revealed.

## 5. Route And Movement Model

The repo should remain graph-first at world scale.

A future route authority should describe:

- route identity;
- route type;
- ordered hex ids or segment ids;
- edge ids;
- endpoints;
- available travel modes;
- route class / route quality;
- optional display path points;
- provenance and notes.

Movement runtime should remain future-only.

Do not put these in first-pass route content:

- current travel state;
- current party position;
- live closures;
- random encounters;
- stamina drain;
- weather execution;
- pathfinding output;
- player discovery flags;
- UI state;
- gameplay rewards.

## 6. Map Grid, Graph, And Coordinate Relationship

Recommended coordinate layers:

1. **World-map pixels**
   - display layout;
   - icon/label placement;
   - authored route polylines;
   - no simulation ownership.

2. **World hexes**
   - semantic terrain cells;
   - biome/elevation/water/hazard/friction identity;
   - exploration/discovery overlay anchor.

3. **World hex edges**
   - adjacency and crossing topology;
   - allowed travel modes;
   - edge quality and crossing difficulty.

4. **Named routes / lanes**
   - named corridor identity;
   - assembled from edges and endpoints;
   - player-facing travel choices later.

5. **Future local maps**
   - separate local coordinate spaces for settlements, dungeons, camps, ports, or POIs.

Do not create broad pathfinding runtime as the next step.

## 7. Travel Modes And Vehicles

Current mode vocabulary is already a good base:

- foot;
- horseback;
- pack animal;
- wagon/caravan;
- river craft;
- sea vessel.

Recommended first-pass policy:

- keep modes descriptive and route-compatible;
- do not make them owned vehicles;
- do not attach inventory capacity, durability, or ownership mutation;
- do not add vehicle runtime state.

Future split candidate:

- keep current travel modes in `travel_networks` until a dedicated schema decision;
- later consider a `travel.mode_profiles` or similar if the bundle becomes too large.

## 8. Camping, Rest, Fatigue, And Survival

The repo appears to have provisioning/ration support but not full survival-state ownership.

Recommended approach:

- begin with descriptive rest/camp authority only;
- use bands instead of exact physiological simulation;
- do not implement hunger/thirst/sleep meters in `0.5.x` unless live repo already proves they exist.

Possible descriptive concepts:

- shelter band;
- water access;
- fire suitability;
- exposure band;
- rest quality;
- safety band;
- capacity band;
- nearby route/hex/site anchor;
- known restrictions or hazards.

Forbidden first-pass fields:

- current fatigue;
- current hunger/thirst;
- camp inventory;
- sleep timers;
- disease state;
- healing execution;
- morale mutation;
- gameplay effects.

## 9. Hazards, Weather, Seasonality, And Terrain

Recommended layered hazard model:

1. **Terrain hazard** from hexes and edges.
2. **Seasonal hazard** from climate and ecology profiles.
3. **Mutable weather overlay** later.
4. **Civic/security hazard** for raids, patrol gaps, piracy, toll abuse, war pressure, and route disruption.

Travel-facing outputs that may matter later:

- movement friction;
- route-closure risk;
- encounter weighting;
- rest quality;
- supply burn;
- route-security pressure.

In `0.5.x`, hazards should remain descriptive authority and validation input only.

## 10. Encounter And Danger Model

The repo already separates encounter templates from spawn profiles. Preserve that split.

Recommended model:

- encounter templates define what can appear;
- spawn profiles define broad regional/habitat/hazard weighting;
- route security / hazard overlays define risk context;
- runtime encounter generation happens later;
- POI placement remains separate from both encounter templates and route topology.

Do not create a monolithic encounter/travel danger record.

## 11. Route Security And Civic/Economy Integration

Route security is the strongest missing overlay.

Potential future `world.route_security_profiles` authority:

- route or edge target;
- controlling polity/government/jurisdiction/faction/guild when available;
- patrol intensity band;
- road maintenance band;
- toll/checkpoint posture;
- escort availability;
- bandit/piracy pressure;
- conflict disruption notes;
- merchant/guild route relevance;
- provenance and notes.

This must not spawn guards, collect tolls, alter faction reputation, enforce law, or run patrol AI.

## 12. Economy And Logistics Integration

Travel should integrate with economy through descriptive planning before runtime:

- provisions;
- supply availability;
- caravan logistics;
- shipping;
- market access;
- imports/exports;
- settlement economy links;
- port throughput;
- scarcity during travel;
- consumables;
- repair supplies.

Do not implement supply burn, dynamic caravan economy, market simulation, toll collection, or freight pricing in the travel pass.

## 13. Religion, Pilgrimage, And Sacred-Route Integration

Travel can later reference:

- pilgrimage routes;
- sacred roads or approaches;
- shrine/monastery/temple hospitality;
- sanctuary/shelter;
- religious protections;
- ritual route restrictions if canon supports them;
- religious route Knowledge.

Do not implement pilgrimage progress, religious favor, sacred-route rewards, access control, or favorability effects without a later dedicated decision.

## 14. Family, Companions, And Party Travel Integration

Future travel systems may eventually support:

- family travel;
- household migration;
- retainers/servants;
- companions;
- heirs;
- wards;
- caravans with family members;
- settlement relocation;
- legacy journeys.

For now, all of these remain descriptive or future-only. Player heirs, family mechanics, party simulation, and household movement must not enter first-pass travel authority.

## 15. Discovery, Map UI, And Knowledge Integration

Travel and exploration should integrate with Knowledge through evidence, not direct mechanical rewards.

Future reveal levels may include:

- name known;
- rough location known;
- exact marker known;
- route surveyed;
- hazard rumor known;
- route condition known;
- POI discovered;
- local travel advice learned.

Potential Knowledge subjects later:

- route;
- crossing;
- port;
- hazard profile;
- route security profile;
- campsite;
- waystation;
- POI;
- exploration zone;
- travel mode.

Knowledge must not grant movement, route access, safe passage, supply discounts, encounter immunity, or exploration rewards unless a later dedicated gameplay decision approves it.

## 16. Proposed Content Collections And Schema Concepts

Recommended future candidates:

| Collection | Likely Path | Priority | Purpose |
|---|---|---:|---|
| `world.travel_authority_boundary` | design doc only | 1 | boundary decision, not content |
| existing `world.travel_networks` | existing world path | current | transitional owner for modes/routes/lanes |
| existing `world.world_hexes` | existing world path | current | semantic terrain/exploration cells |
| existing `world.world_hex_edges` | existing world path | current | graph connectivity and crossings |
| `world.route_security_profiles` | `packages/content/base/world/route_security_profiles.json` | high | route/edge/locality security overlay |
| `world.hazard_profiles` | `packages/content/base/world/hazard_profiles.json` | high | reusable descriptive hazard profiles |
| `world.campsite_profiles` | `packages/content/base/world/campsite_profiles.json` | medium | rest/shelter/water/fire/safety authority |
| `world.waystations` | `packages/content/base/world/waystations.json` | medium | authored inns/waystations/stopping points |
| `world.poi_sites` | `packages/content/base/world/poi_sites.json` | later | authored exploration sites |
| `world.exploration_zones` | `packages/content/base/world/exploration_zones.json` | later | discovery/hazard/exploration scope |
| `travel.mode_profiles` | future split if needed | later | canonical travel-mode vocabulary |
| `player.travel_state` | runtime/save | 0.6+ | mutable journey state |
| `player.discovery_state` | runtime/save | 0.6+ | map reveal/POI discovery |
| `player.expeditions` | runtime/save | 0.6+ | journey plan/history |

Do not implement all of these. The immediate next decision should choose boundaries and then recommend only the narrowest safe schema-decision follow-up.

## 17. Validation And Test Strategy

High-value future validation rules:

1. `routeRecords.availableModeIds` must reference defined mode profiles.
2. Ordered route hex ids and edge ids should form a coherent chain.
3. Route endpoints must resolve to live settlements or approved anchors.
4. Maritime lanes must reference compatible coastal/port/river/lake endpoints.
5. Hex anchored settlements must match region/locality coherence.
6. Edge travel modes must be compatible with edge type, water, pass, or terrain tags.
7. Spawn profile region/habitat scope should overlap encounter template scope.
8. Spawn profile hazard bands must not invert min/max ranges.
9. Knowledge travel-observation scopes must reference live authorities.
10. Descriptive travel authority must reject runtime travel, stamina, discovery, map UI, pathfinding, encounter execution, weather runtime, and gameplay fields.

Suggested forbidden fields for descriptive route/travel authorities:

- `currentPosition`;
- `currentFatigue`;
- `currentSupplies`;
- `travelTickRate`;
- `pathfindingState`;
- `spawnEncounterNow`;
- `weatherRuntimeState`;
- `mapRevealState`;
- `discoveryState`;
- `campInventory`;
- `playerJourneyState`;
- `uiState`;
- `storageState`;
- `gameplayEffects`.

## 18. Authored-Vs-Generated Data Strategy

Fully authored:

- world maps;
- major regions/localities/settlements;
- core hexes;
- core hex edges;
- major route records;
- inter-port lanes;
- encounter templates;
- spawn envelopes;
- ecology/climate profiles;
- major hazards and route-security profiles.

Derived:

- ETA summaries;
- route accessibility rollups;
- danger/security summaries;
- map display simplifications;
- survey/known-route summaries.

Generated once and saved later:

- minor camps;
- roadside event locations;
- route advisories;
- temporary closure candidates;
- POI candidates.

Runtime/save later:

- journey history;
- player discovery state;
- fatigue/supply state;
- camp occupancy;
- encounter outcomes;
- weather snapshots;
- route incidents;
- patrol/escort events.

## 19. Gameplay Integration Roadmap

Near term:

- authority boundary decision;
- route/hazard/security schema decisions;
- descriptive validators;
- narrow content seeds.

Mid term:

- route-security profiles;
- hazard profiles;
- campsite/rest-site profiles;
- Knowledge subject decisions for travel/exploration;
- route/crossing/port refinements.

Long term:

- travel UI;
- map UI;
- route choice;
- travel time;
- camping/rest;
- provisions/supply burn;
- hazard checks;
- encounter generation;
- route discovery;
- POI discovery;
- journey logs;
- player discovery state;
- dynamic weather;
- party travel.

## 20. Recommended Versioned Implementation Sequence

Suggested sequence after current civic/polity queue:

1. `0.5.203 - Travel Authority Boundary Decision`
   - docs-only;
   - decide ownership among maps, hexes, edges, travel networks, routes, encounters, spawn profiles, route security, hazards, camps, POIs, and player journey state.

2. `0.5.204 - Hazard And Route Security Boundary Decision`
   - docs-only;
   - decide whether security and hazard overlays are separate.

3. `0.5.205 - Route Security Schema Decision`
   - docs-only.

4. `0.5.206 - Hazard Profile Schema Decision`
   - docs-only.

5. `0.5.207 - Route Security Schema And Validator`
   - schema/validator/tests;
   - no broad content seed.

6. `0.5.208 - Hazard Profile Schema And Validator`
   - schema/validator/tests.

7. `0.5.209 - Route Security And Hazard Content Seed Plan`
   - docs-only.

8. `0.5.210 - First Route Security And Hazard Content Seed`
   - narrow seed only.

9. Later `0.5.x`
   - campsite/rest-site planning;
   - travel Knowledge subject decision;
   - route/crossing/port refinement decisions.

10. `0.6+`
    - journey events;
    - discovery state;
    - map UI;
    - runtime travel;
    - survival/camping;
    - encounter generation.

## 21. Open Questions

- Should `travel_networks.json` stay bundled through `0.5.x`, or split into dedicated route/mode/lane collections?
- Should route security anchor to route ids, edge ids, localities, settlements, polities, jurisdictions, or a mixed target model?
- Should camps be POIs with rest metadata or dedicated campsite profile records?
- Should hazard profiles be reusable vocabulary or place-specific overlays?
- Which current validator already checks route continuity, if any?
- Should `travel_event` become a future player-owned evidence record or remain only a Knowledge source/evidence vocabulary?
- Which single route/security/hazard candidate is safest for a first content seed?

## 22. Recommended Next Codex Prompt

Next recommended narrow Codex prompt:

`Version 0.5.203 - Travel Authority Boundary Decision`

Goal:
Create a docs-only decision defining exact authored authority boundaries among `world.world_maps`, `world.world_hexes`, `world.world_hex_edges`, `world.travel_networks`, `world.encounter_templates`, `world.spawn_profiles`, future `world.route_security_profiles`, future `world.hazard_profiles`, future camp/rest authorities, future POI authorities, and future player-owned `travel_event` / journey state.

Primary task:
Inspect the live repo, correct this research artifact where repo-state assumptions are stale, and create a permanent design decision:

`docs/design/travel-authority-boundary-decision.md`

Required posture:

- docs-only;
- resolve graph-vs-hex-vs-pixel responsibilities;
- define what remains descriptive in `0.5.x`;
- prohibit runtime/player-state leakage into content JSON;
- preserve existing travel-network, hex, edge, encounter-template, and spawn-profile owners;
- identify the narrowest safe next schema-decision after the document lands.

Suggested commit message:

`docs(travel): decide travel authority boundaries`

## External References Used By Deep Research

- Red Blob Games, Hexagonal Grids: https://www.redblobgames.com/grids/hexagons/
- The Alexandrian, Pointcrawls: https://thealexandrian.net/wordpress/48666/roleplaying-games/pointcrawls
- GeoJSON specification overview: https://en.wikipedia.org/wiki/GeoJSON
- Leave No Trace, Plan Ahead and Prepare: https://lnt.org/why/7-principles/plan-ahead-and-prepare/
- Design and Implementation of Global Path Planning System for Unmanned Surface Vehicle among Multiple Task Points: https://arxiv.org/abs/1807.08106
- Two-step Constructive Approaches for Dungeon Generation: https://arxiv.org/abs/1906.04660
- Exploration in NetHack With Secret Discovery: https://arxiv.org/abs/1711.03087
- Designing a Reliable Inland Waterway Transportation Network under Uncertainty: https://arxiv.org/abs/2101.10120
- From the Historical Roman Road Network to Modern Infrastructure in Italy: https://arxiv.org/abs/2208.06675
- Heat and Worker Health: https://arxiv.org/abs/2301.11554
