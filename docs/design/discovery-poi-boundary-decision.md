# Discovery And POI Boundary Decision

Source version/run: Version 0.5.292 - Discovery And POI Boundary Decision
Date: 2026-07-08
Status: documentation-only boundary decision; no implementation

## 1. Decision Summary

Select Option A: keep POI-like authored identity on specific owner families, and define discovery state as future runtime/save ownership.

This decision keeps a generic static `world.pois` authority rejected for the current roadmap posture. The repo already owns persistent place identity through specific authorities such as settlements, settlement districts, settlement sites, sacred sites, religious hotspots, semantic map features, and future family-specific records such as ruins, forts, caves, mines, ports, and landmarks. A generic POI collection would duplicate those owners unless a later decision proves a narrow non-duplicative role.

This run is documentation-only. It does not add POI content, discovery content, schemas, validators, tests, runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, route/travel behavior, map reveal, Knowledge state, quest discovery, settlement/site discovery, encounter/spawn behavior, or gameplay behavior.

The immediate next route is `Version 0.5.293 - Service Authority Schema Plan`.

## 2. Current Completed-State Posture

Latest completed primary before this run:

- `Version 0.5.291 - Discovery And POI Gate Intake Audit`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Current run:

- `Version 0.5.292 - Discovery And POI Boundary Decision`

The Highcrown settlement Knowledge lane remains closed from `Version 0.5.285 - Highcrown Settlement Knowledge Lane Closure Review`.

Service authority remains deferred after `Version 0.5.287 - Service Authority Boundary Decision`. That decision justified a future narrow provider-independent static service vocabulary in principle, but no schema/content/validator implementation exists.

Resource/commodity authority remains deferred after `Version 0.5.288 - Resource And Commodity Schema Decision`.

Combat status/condition/injury vocabulary remains deferred after `Version 0.5.289 - Combat Status Condition And Injury Boundary Decision`.

Static authority validation consolidation completed in `Version 0.5.290 - Static Authority Validation Consolidation Audit`.

Discovery/POI intake completed in `Version 0.5.291 - Discovery And POI Gate Intake Audit`.

## 3. Current Evidence From 0.5.291

The intake audit found no live generic POI authority:

- no `world.pois`;
- no `point_of_interest`;
- no `points_of_interest`;
- no equivalent generic canonical POI content, schema, validator, runtime, test, or UI source.

Current relevant surfaces remain distributed:

| Surface | Current posture |
| --- | --- |
| `world.map_features` | 2 static semantic map-feature records; descriptive only; explicitly reject POI placement, Knowledge, runtime, UI, storage, commands, events, rewards, and gameplay. |
| `world.world_map_features` | 1 visual/reference geometry aggregate; not semantic place authority or reveal state. |
| `world.world_maps` | 1 map metadata record; not player reveal state. |
| `world.world_hexes` | 47 semantic terrain/exploration-cell records; not discovery state or place identity. |
| `world.world_hex_edges` | 49 traversal topology records; not discovery state. |
| `world.travel_networks` | 1 transitional route/travel authority; not current party movement, pathfinding, route visibility, reveal, or visit state. |
| `world.settlements` | 88 canonical settlement records; possible POI-like anchors, but settlement-owned. |
| `world.settlement_districts` | 2 static district records; district-owned. |
| `world.settlement_sites` | 2 static site records; site-owned. |
| `world.sacred_sites` | 1 named sacred-site record; religion/site-owned. |
| `world.religious_hotspots` | 2 religious hotspot records; religion/place context, not map reveal. |
| `world.encounter_templates` | 6 encounter composition records; not POI identity or reveal state. |
| `world.spawn_profiles` | 5 spawn selection/context records; not POI identity or discovery state. |
| `civilization.quest_definitions` | 5 authored quest records; narrative hooks/objectives, not global POI authority. |
| `civilization.quest_templates` | 36 repeatable offer inputs; not persistent POI state. |
| `civilization.quest_archetypes` | 8 quest structure records; not POI state. |
| `player.knowledge_snippets` | 16 authored Knowledge snippets with `discoverySources`; possible evidence routes only. |
| `player.knowledge_domain_registry` | 7 domains; source vocabularies such as `travel_observation` and `travel_event` do not create journey, POI, route, or reveal authority. |

Existing `knownLocations` and discovery Chronicle surfaces exist in shared contracts, runtime fixtures, UI projection, and gameplay shell code, but they are limited current runtime/session/player surfaces. They do not establish a generic static POI authority or full map-reveal implementation.

Static validators already reject discovery/map-reveal ownership in multiple lanes. Map features, settlement districts, settlement sites, hazards, and route-security profiles forbid fields such as `discoveryState`, `mapRevealState`, `knowledgeDiscoveryState`, event/reward references, and gameplay effects where those fields would imply runtime behavior.

## 4. Definitions

### Discovery

Discovery is not one authority in the current model. It is an umbrella term that must be split into separate ownership layers:

- authored discoverability posture, if a static owner later needs stable vocabulary such as public, hidden, secret, surveyable, rumored, or locked;
- player/session/account state indicating that a thing is known, discovered, visited, revealed, completed, or otherwise exposed;
- map reveal state showing which spatial areas, routes, labels, markers, or details are visible to a player;
- Knowledge evidence, progress, and completion;
- quest, Chronicle, narrative, encounter, spawn, and reward outputs from their own systems;
- UI presentation of known or eligible records.

Static content may describe a stable authored posture only when its own authority has explicit field support. Static content must not store player-specific discovery state.

### POI

A POI is a player-facing label for a place, site, feature, or contextual target that may become interesting to show, visit, learn about, or use.

In the authority model, POI is not a generic source collection. It is a cross-cutting presentation concept over specific authored owners:

- settlements;
- settlement districts;
- settlement sites;
- sacred sites;
- religious hotspots;
- semantic map features;
- route/crossing/port/camp/rest-site families if later approved;
- future ruins, forts, caves, mines, ports, landmarks, and comparable site families.

The owning family defines the record. Future UI or runtime can present a record as a POI only by deriving marker eligibility from that owner plus player discovery state. UI presentation does not create authority.

## 5. Options Considered

### Option A - Specific Owner Families Plus Future Runtime/Save State

Keep POI-like authored identity on specific owner families. Let each static owner define only its own stable identity and, if later approved, broad authored posture. Keep known/discovered/visited/revealed/completed and map-reveal state with future runtime/save owners.

Selected.

### Option B - Approve Future Generic `world.pois`

Create a future generic static POI authority for authored persistent points of interest.

Rejected for the current roadmap posture. It would duplicate current owners and conflict with prior world-geography and map-feature decisions that keep canonical POIs in their specific named authority families.

### Option C - Narrow Static POI Category/Vocabulary Only

Approve a future vocabulary-only catalog for POI categories while records remain on specific owners.

Not selected now. A vocabulary-only catalog may be reconsidered later, but current family-specific owners and local descriptors are sufficient. The first need is not a category catalog; it is keeping state, reveal, Knowledge, quest, encounter, and UI boundaries separate.

### Option D - Defer All POI/Discovery Decisions

Move to the next later gate without a boundary decision.

Rejected because the repo already has enough cross-surface language to require a durable boundary: map features reject POI placement, travel docs mention future POIs and discovery state, Knowledge uses discovery-source vocabulary, runtime/save contracts expose known-location/discovery surfaces, and user design notes expect known/visited POI behavior later.

## 6. Selected Option And Rationale

Option A is selected.

Rationale:

- Current content already has explicit owners for POI-like records.
- A generic `world.pois` authority would duplicate settlements, sites, sacred sites, hotspots, map features, and future named place families.
- Discovery state, visited state, reveal state, and completion are inherently player/session/account-specific and must not be stored in static authored records.
- Knowledge discovery is evidence/progress/completion, not map reveal.
- Quest/narrative discovery is quest/event/Chronicle ownership, not POI identity.
- Encounter/spawn exposure is context and selection, not POI identity.
- UI markers are presentation over authored records plus player-known state, not authority.
- Existing validators already guard against discovery/map-reveal fields in static records.

## 7. Static Authored-Content Boundary

Static authored records may own:

- stable id, slug, display name, and summary for their own family;
- stable place anchors and parent relationships approved for their family;
- broad public/hidden/secret/surveyable/rumored/locked/landmark-like posture only if the owning schema or validated notes explicitly allow it;
- non-executing source/provenance notes;
- descriptive tags that do not imply runtime state.

Static authored records must not own:

- whether a player knows, discovered, visited, revealed, completed, surveyed, unlocked, or exhausted the record;
- map reveal masks, fog of war, visible map areas, current marker visibility, route visibility, or UI display state;
- player access checks, rewards, event emission, Chronicle output, quest state, encounter outcomes, spawn execution, service execution, pathfinding, travel behavior, storage, commands, runtime mutation, save/account data, or gameplay effects.

Existing or future static authorities may describe broad posture only inside their own boundary:

- settlements may own settlement identity and stable descriptive place context;
- districts may own static district identity;
- sites may own static placed-site identity;
- sacred sites and religious hotspots may own religion/site/hotspot identity;
- map features may own semantic physical/cultural feature identity;
- route/security/hazard authorities may own static route or overlay posture only where approved;
- future ruins, forts, caves, mines, ports, landmarks, camps, or rest sites must each receive their own authority decision before use.

## 8. Runtime And Save Discovery Boundary

Runtime/save owners must own:

- known state;
- discovered state;
- visited state;
- revealed state;
- completed or exhausted state;
- map reveal, fog, region/route/site marker reveal, and spatial visibility;
- current travel visibility, destination eligibility, route availability, route history, and journey state;
- player/session/account persistence for discovery and visibility;
- emitted discovery records, if a runtime feature creates them;
- current UI state derived from discovery, not static content.

Existing `PlayerDiscoveryChronicleState`, `KnownLocationState`, geographic knowledge state, achievement reveal state, and gameplay/UI discovery projections are current runtime/session/player/account surfaces. They are not a static POI catalog. Future work may replace, consolidate, or harden them only in a dedicated runtime/save ownership pass.

Static authored records may be inputs to these systems. They do not store the resulting player-specific state.

## 9. Knowledge Boundary

Knowledge owns authored snippets, domain support, source vocabulary, evidence, progress, completion, trials, and later UI only within its own Knowledge decisions.

Knowledge `discoverySources` define possible evidence routes. They do not:

- reveal a map;
- mark a route visible;
- mark a location visited;
- create a POI;
- unlock access;
- complete a quest;
- emit rewards;
- mutate save/account state by themselves.

`travel_observation` and `travel_event` remain source/evidence vocabulary. They do not prove route, journey, campsite, POI, map-reveal, or travel-event state authority.

Knowledge discovery can say that the character has learned or understood a snippet. Map reveal can say that a place, route, area, marker, or detail is visible. Those are different states with different owners.

## 10. Quest And Narrative Boundary

Quest definitions, quest templates, quest archetypes, future event/storylet records, rumors/hooks, Chronicle outputs, and runtime quest state remain separate owners.

They may:

- reference authored place ids descriptively;
- use known places or visible routes as eligibility inputs after a dedicated runtime decision;
- produce narrative discovery or Chronicle output through runtime systems after those owners exist.

They must not:

- create static POI identity by prose alone;
- mutate static place records;
- make quest visibility equal map reveal;
- make quest completion equal POI completion unless a future runtime/save contract explicitly defines that state;
- pay rewards or mutate Knowledge without the owning systems.

## 11. Encounter And Spawn Boundary

Encounter templates and spawn profiles may describe:

- encounter composition;
- habitat, region, hazard, route, or contextual exposure;
- selection envelopes;
- future references to place or feature ids if later validated.

They must not own:

- POI identity;
- POI placement;
- route visibility;
- map reveal;
- known/visited/discovered/completed state;
- current encounter outcomes;
- rewards;
- UI markers;
- save/account persistence.

Encounter or spawn exposure can make a place relevant to future runtime discovery, but it cannot create an authored POI record by implication.

## 12. UI Boundary

UI marker eligibility is derived, not authored authority.

Future UI may show a marker when:

- a valid static owner record exists;
- a runtime/save state says it is known, discovered, visible, relevant, or otherwise eligible;
- the UI view decides that the marker fits the current presentation mode.

UI must not:

- create place identity;
- create POI records;
- mutate static content;
- decide canonical public/hidden posture;
- become the source of map reveal, discovery state, rewards, events, quest state, Knowledge progress, or gameplay behavior.

Marker labels, filters, grouping, icons, and visibility are presentation. Authority remains with content owners and runtime/save state.

## 13. Ownership Matrix

| Concern | Owner posture |
| --- | --- |
| Static place identity | Specific authored authority families: settlements, districts, sites, sacred sites, religious hotspots, map features, and later dedicated place families. |
| Generic POI identity | Rejected for current roadmap posture; no `world.pois` authority approved. |
| Family-specific POI-like records | Owned by each specific family; future ruins/forts/caves/mines/ports/landmarks require their own decisions. |
| Map features | `world.map_features` owns semantic feature identity only. |
| Visual map geometry | `world.world_map_features`, map assets, and map metadata own visual/reference geometry. |
| World maps | `world.world_maps` owns map metadata only. |
| Hexes and hex edges | `world.world_hexes` and `world.world_hex_edges` own semantic cells and traversal topology, not player reveal state. |
| Travel networks | `world.travel_networks` owns transitional authored route/travel records, not current journeys or route visibility. |
| Route visibility | Future runtime/save/travel visibility owner; static routes may only provide stable public/hidden/surveyable posture if later approved. |
| Map reveal | Future runtime/save/map-state owner. |
| Known/discovered/visited/revealed/completed flags | Future player/session/account state owners; existing current surfaces are limited and not a full generic discovery system. |
| Knowledge sources/evidence/completion | Knowledge snippet/domain/evidence/progress/trial owners. |
| Quest/narrative discovery | Quest, event/storylet, Chronicle, and runtime quest/narrative owners. |
| Encounter/spawn exposure | Encounter and spawn owners provide context only, not POI identity or reveal state. |
| UI markers | UI presentation derived from content plus runtime/save visibility; not authority. |
| Rewards/events | Reward, event, Chronicle, quest, and runtime owners; never static POI/map-feature/place records. |
| Save/session/account persistence | Save/account/player/session owners; static content remains input only. |

## 14. Forbidden Static Fields

Static POI-like, place, route, map-feature, site, district, hazard, or overlay records must reject fields that imply runtime discovery or gameplay ownership, including:

- `knownState`;
- `discoveredState`;
- `visitedState`;
- `revealedState`;
- `completedState`;
- `discoveryState`;
- `knowledgeDiscoveryState`;
- `mapRevealState`;
- `routeVisibilityState`;
- `uiMarkerState`;
- `eventRefs`;
- `rewardRefs`;
- `saveState`;
- `accountState`;
- `runtimeState`;
- `gameplayEffects`;
- active access checks, prices, stock, current provider state, current journey state, current encounter state, current spawn state, or command handlers.

Equivalent fields with different names should be rejected by intent even if a later validator does not list the exact spelling yet.

## 15. Required Blockers Before Future Implementation

Before any future POI/discovery schema, content, validator, runtime, UI, or save/account implementation, a later run must provide:

- a focused schema plan if any new static authority or vocabulary is approved;
- exact collection path, wrapper shape, id prefix, lifecycle/status posture, and field list;
- proof that the new authority does not duplicate existing owner families;
- exact reference rules to settlements, districts, sites, sacred sites, hotspots, map features, routes, hexes, quests, encounters, and spawns;
- explicit separation of static posture from player-known and map-reveal state;
- save/session/account ownership for any stateful behavior;
- UI marker derivation rules if UI is in scope;
- focused validation expectations and forbidden-field checks;
- a small seed plan if live content is proposed;
- explicit non-goals for travel/pathfinding, Knowledge progress, quest state, encounter spawning, rewards, UI, storage, commands, events, save/account behavior, and gameplay.

## 16. Rejected Alternatives

- Creating `world.pois` now.
- Adding POI/discovery content.
- Adding POI/discovery schemas, validators, or tests now.
- Adding discovery, known, visited, revealed, completed, or map-reveal fields to static records.
- Treating Knowledge `discoverySources`, `travel_observation`, or `travel_event` as route, journey, POI, travel visibility, or map-reveal authority.
- Treating existing `knownLocations` as a complete discovery/map-reveal implementation.
- Treating map pixels, visual geometry, route ids, hex tags, quest prose, encounter context, spawn profiles, or UI text as canonical POI records.
- Treating UI markers as POI authority.
- Reopening Highcrown Knowledge work.
- Moving directly from this boundary decision to POI/discovery implementation.

## 17. Explicit Non-Goals

This decision does not:

- add POI content;
- add discovery content;
- add or edit Knowledge snippets;
- edit Knowledge registry/domain/trial-policy content;
- edit content JSON files;
- edit map-feature, travel, route, settlement, district, site, region, world-hex, sacred-site, religious-hotspot, quest, encounter, spawn, service, resource, commodity, status, condition, or injury content;
- edit schemas, validators, tests, runtime code, UI, storage, commands, events, rewards, migrations, save/account behavior, route/travel behavior, discovery/map-reveal behavior, exploration behavior, or gameplay;
- implement `world.pois`;
- implement a POI authority;
- implement a discovery authority;
- implement map reveal;
- implement travel visibility;
- implement quest discovery;
- implement Knowledge discovery;
- implement settlement/site discovery;
- reopen the closed Highcrown settlement Knowledge lane;
- implement `civilization.services`, `world.resources`, `world.commodities`, or any status/condition/injury catalog;
- run Deep Research;
- move the project to `0.6.x`.

## 18. Validation And Checks

This decision was based on:

- required sync and status checks;
- required reads of active handoff, roadmap, backlog, sequence, intake audit, and recent authority decisions;
- targeted searches for discovery, POI, point-of-interest, landmarks, map features, routes, route visibility, travel networks, world hexes, hex edges, map reveal, exploration, known/visited/revealed/discovered locations, Knowledge `discoverySources`, `travel_observation`, `travel_event`, quest discovery, settlement/site discovery, sacred-site/religious-hotspot discovery, encounter/spawn exposure, UI markers, discovery Chronicle, and save/session/account persistence;
- targeted counts of relevant current content collections;
- targeted inspection of `knownLocations`, discovery Chronicle, and discovery timestamp contract surfaces;
- exact searches confirming no current generic POI authority under `world.pois`, `point_of_interest`, or `points_of_interest`.

Docs-only validation should confirm:

- only docs changed;
- no content/schema/validator/test/runtime/UI/storage/save/account/gameplay files changed;
- no stale active route pointer keeps `0.5.292` as next after this run;
- no language implies POI/discovery implementation;
- no language approves `world.pois` implementation;
- no language reopens Highcrown Knowledge.

## 19. Next Recommended Version

Version 0.5.293 - Service Authority Schema Plan

Reasoning: discovery/POI now has a completed intake audit and boundary decision, and the selected posture rejects a generic POI authority for the current roadmap. The next backlog gate is services. `Version 0.5.287 - Service Authority Boundary Decision` already justified a future narrow provider-independent `civilization.services` vocabulary in principle, while `Version 0.5.290 - Static Authority Validation Consolidation Audit` confirmed that service implementation remains deferred behind a separate schema plan, fresh live-repo audit, and seed plan. A docs-first service schema plan is the smallest safe next step and must not implement service content, schemas, validators, runtime, UI, storage, commands, events, rewards, save/account behavior, or gameplay.
