# Travel Knowledge And Route Source Map

Source route: ChatGPT via GitHub Connector
Date: 2026-06-05
Status: connector-only prep for future travel/geography/route/knowledge work; no source, schema, content JSON, UI implementation, generated output, roadmap advancement, or runtime behavior changes

## Purpose

Map travel, geography, route, locality, biome, and sea-lane boundaries that support both the knowledge-domain framework and future travel gameplay.

This document is a planning source. It does not authorize implementation.

## Current Planning Relationship

This source map supports future work around:

- `knowledge_domain.geography`
- `knowledge_domain.regional_geography`
- `knowledge_domain.routes_and_passes`
- `knowledge_domain.locality_lore`
- `knowledge_domain.biomes`
- `knowledge_domain.habitats`
- `knowledge_domain.climate`
- `knowledge_domain.seasonal_patterns`
- `knowledge_domain.caravan_routes`
- `knowledge_domain.ocean_lanes`
- travel observation discovery sources
- geography/travel command boundaries
- map/route/locality UI boundaries

It also connects to existing connector prep docs:

- `docs/design/knowledge-framework-source-map.md`
- `docs/design/knowledge-domain-backlog-normalization.md`
- `docs/design/knowledge-discovery-source-vocabulary.md`
- `docs/design/economy-command-surface-source-map.md`
- `docs/design/gameplay-shell-unification-source-map.md`
- `docs/design/runtime-state-ownership-ledger-prep.md`

## Core Boundary Rule

Travel visibility is not travel authority or knowledge completion.

A revealed region, visible route, known settlement, displayed biome, weather/climate hint, or sea-lane record may support future observation evidence or route proposals, but it must not silently grant geography knowledge, dispatch travel, mutate session state, complete route mastery, create caravan outcomes, or generate Chronicle/Renown events.

## Travel/Geography Source Vocabulary

| Source concept | Planning meaning | Boundary |
| --- | --- | --- |
| `region` | Broad world area or administrative/geographic unit. | Region visibility does not complete regional knowledge. |
| `locality` | Specific place, feature, ruin, pass, ford, landmark, or encounter-relevant site. | Seeing a locality does not reveal all lore. |
| `settlement` | Town, city, village, outpost, or civic node. | Settlement presence does not grant settlement lore or economy access. |
| `route` | Overland or local path between places. | Route visibility does not dispatch travel/caravan. |
| `pass` | Route through difficult terrain or chokepoint. | Discovery does not grant safe traversal. |
| `ford` | River crossing point. | Crossing visibility does not resolve travel action. |
| `hex` | Map-cell/world-cell address or spatial partition. | Hex reveal does not create knowledge completion. |
| `edge` | Link or boundary between cells/regions/localities. | Edge existence does not authorize traversal. |
| `biome` | Ecological environment category. | Biome display does not grant ecology/habitat knowledge. |
| `habitat` | Flora/fauna/resource environment. | Habitat visibility does not identify all resources. |
| `climate` | Weather/seasonal/long-term conditions. | Climate popup/display is read-only until travel/weather mechanics are scoped. |
| `sea_lane` | Ocean/coastal route between ports/regions. | Sea-lane record does not create a ship/caravan command. |
| `caravan_route` | Trade/logistics path. | Route projection is not trade/caravan mutation. |

## Knowledge Source Interactions

Travel-related knowledge should use explicit evidence later.

| Knowledge area | Likely evidence source | Must not infer from |
| --- | --- | --- |
| geography | travel observation, study, instruction, quest/Chronicle evidence | map visibility alone |
| regional geography | route/locality/region observation | entering a region alone |
| routes and passes | route traversal, guide instruction, map/tome study | route displayed in UI |
| locality lore | visit, study, local instruction, quest record | locality marker visible |
| biomes | travel/field observation, study | biome label shown |
| habitats | field observation, flora/fauna/resource use | habitat entry visible |
| climate | travel observation, seasonal record, study | climate popup display |
| seasonal patterns | repeated observation, study, source record | current date alone |
| caravan routes | trade route records, caravan events, settlement/economy study | market/trade projection alone |
| ocean lanes | sea travel, port records, nautical study | sea region visible |

## Travel Command Boundary

Future travel or caravan commands should require explicit command contracts and owners.

Potential command families:

- `travel.plan_route`
- `travel.start_route`
- `travel.resolve_segment`
- `travel.enter_locality`
- `travel.cross_pass`
- `travel.cross_ford`
- `travel.use_sea_lane`
- `caravan.assign_goods`
- `caravan.dispatch`
- `caravan.resolve_arrival`

Required owner questions:

1. Who owns the traveler or caravan?
2. Who owns the session/run route state?
3. What map/route/locality record is being referenced?
4. What proof exists that the route is available?
5. What resources, time, risk, or permissions are required?
6. What output owner records success/failure?
7. Does travel create observation evidence, and for which owner scope?
8. Does any observation affect knowledge, and under what explicit rules?
9. Which UI surfaces are read-only vs command-dispatching?
10. What tests prove visible routes do not mutate travel state?

## Non-Grant / Non-Mutation Rules

- Map visibility does not grant geography knowledge.
- Route visibility does not start travel.
- Entering a region does not complete regional geography.
- Seeing a settlement does not complete settlement lore.
- Seeing a biome does not grant ecology knowledge.
- Seeing a habitat does not identify resources.
- Seeing a ford/pass does not guarantee safe traversal.
- Climate display does not mutate travel conditions.
- Seasonal display does not create seasonal-pattern knowledge.
- Trade route display does not dispatch caravan commands.
- Sea-lane visibility does not create ship travel.
- UI map selections do not create travel, Chronicle, Renown, or knowledge evidence.

## Validation Rules To Plan Later

Future validation should protect:

- known geography/travel subject ids
- stable route/locality/region/settlement id formats
- route endpoint references exist
- sea-lane endpoint references exist
- caravan route references settlement/market/route owners correctly
- knowledge snippets using travel sources declare valid subject/location scope
- travel observation source types do not imply completion
- map UI ids are not accepted as command authority
- route projections cannot mutate session state
- travel output events require explicit owner scope and owner id

## Recommended Future Pass Order

Recommended sequence when this pillar becomes active:

1. `Travel Geography Source Audit`
   - inspect region, locality, route, hex, edge, settlement, biome, climate, and sea-lane content/source shapes
   - docs-only
2. `Travel Knowledge Subject Plan`
   - decide which subject types remain `region`/`settlement`/`custom` and which need future `route`, `biome`, `climate`, `sea_lane`, or `locality` subject types
   - planning only
3. `Travel Observation Evidence Plan`
   - define evidence owner/scopes for travel observation before knowledge progress
   - planning only
4. `Travel Command Contract Plan`
   - define travel/caravan request/result boundaries
   - planning only
5. `Travel Route Readiness Helper`
   - pure helper returning blockers/proposals without mutation
6. `Read-Only Map/Route UI Plan`
   - display-first; no command dispatch
7. `Narrow Travel Integration`
   - only after route/session/event/knowledge owners are explicit

## Forbidden Until Explicitly Scoped

Do not add or change:

- travel command handlers
- map/route UI command dispatch
- session route state
- travel mutation
- caravan dispatch/resolution
- knowledge completion from travel
- Chronicle/Renown output from travel
- climate/weather mutation
- content JSON records
- schema enum expansion
- generated output
- route/settlement/economy rebalance

## Recommended Next Connector Work

The broad deferred-pillar prep set is now complete enough for waiting time.

Optional remaining connector-only passes, if needed:

1. `Main Menu Theme Asset Source Map`
2. `Content Generation Boundary Map`
3. `Save Load Reliability Source Map`

Recommended stop point:

- Return to `Version 0.5.107 - Knowledge Domain Registry Plan` after Codex tokens reset.

## Recommended Future Codex Work

Do not schedule travel gameplay ahead of active knowledge-domain work unless explicitly requested.

When ready, the safest first Codex pass is:

- `Version 0.5.x - Travel Geography Source Audit`

It should remain docs-only/read-only and should not alter travel runtime, route content, UI, knowledge state, generated output, or save/session behavior.
