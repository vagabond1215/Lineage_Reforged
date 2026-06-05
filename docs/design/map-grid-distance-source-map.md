# Map Grid Distance Source Map

Source route: ChatGPT via GitHub Connector
Date: 2026-06-05
Status: connector-only prep for future map scale, grid, route distance, travel-time, and regional population-center expansion work; no source, schema, content JSON, UI implementation, generated output, roadmap advancement, or runtime behavior changes

## Purpose

Map the current world grid, distance, route, travel, and population-center source relationships before any future map/grid recalculation, route validation, settlement expansion, UI scale pass, or runtime travel command work.

This document is a planning source. It does not authorize implementation.

## Source Files Inspected

- `packages/engines/civilization-engine/src/spatial-world.ts`
- `packages/engines/civilization-engine/src/content.ts`
- `docs/design/travel-knowledge-route-source-map.md`
- `docs/design/economy-command-surface-source-map.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

## Current Grid And Distance Reality

`packages/engines/civilization-engine/src/spatial-world.ts` currently defines:

- `HEX_DISTANCE_KILOMETERS = 24`
- `KILOMETERS_PER_MILE = 1.60934`

It also provides helper behavior for:

- rounding numeric outputs
- converting mode `baseMilesPerDay` to kilometers where `baseKilometersPerDay` is absent
- route/travel mode cost weighting
- barrier penalties for cliffs, marshes, river crossings, ferry requirements, mountain passes, pass country, dense forest, switchbacks, toll gates, open sea, bad weather, and water-only routes

The 24 km hex constant is the current implied grid scale. Future passes should not change this constant without a dedicated map-scale/route-distance audit and validation plan.

## Current Spatial Context

The current spatial world context loads and caches:

- regions
- localities
- settlements
- world hexes
- world hex edges
- travel routes
- travel network
- travel mode profiles
- habitats
- biomes
- derived resource sources
- hex adjacency
- hex resource availability cache
- settlement resource access cache

This means map/grid/distance planning is already tied to settlement access, resources, travel modes, terrain, barriers, and route networks.

## Current Content Shapes

### Regions

`RegionContentRecord` supports:

- `id`, `slug`, `name`
- `regionType`: `continent`, `subregion`, `island_system`, `ocean`
- parent region relationship
- environment profile
- simulation profile
- population profile
- economic profile
- settlement distribution model

The settlement distribution model already includes target counts for:

- city
- town
- village
- outpost
- strategic_site

This is the key existing hook for regional population-center expansion planning.

### Settlements

`SettlementContentRecord` supports:

- macro region, region, locality band, and hex anchor ids
- settlement type
- site class: surface, subterranean, underwater
- terrain context
- population band and population total
- administrative role
- parent/dependency relationships
- identity and purpose tags
- economic model
- survival model
- trade dependency profile
- infrastructure profile
- domestic resource profile
- domestic trade flows
- guild presence
- optional visual map reference with pixel coordinates, climate zone id, biome zone id, and notes

This is the main content shape for expanding population centers.

### Localities

`RegionLocalityContentRecord` supports:

- macro region and region ids
- locality type
- habitation score modifier
- resource catchment
- settlement suitability
- route access modifiers
- dominant industries
- supported site classes

This is the strongest existing placement heuristic source for future population-center expansion.

### Hexes

`WorldHexContentRecord` supports:

- region id
- locality band id
- biome family
- elevation band
- terrain type
- freshwater type
- habitability score
- friction by travel mode
- barrier tags
- hazard tags
- resource affinity tags
- anchored settlement ids

This shape can support future validation that settlements are anchored to plausible hexes.

### Hex Edges

`WorldHexEdgeContentRecord` supports:

- from/to hex ids
- edge type
- hex span
- route quality
- crossing difficulty
- barrier tags
- allowed travel modes
- directions
- corridor name
- optional terrain and feature tags

This shape can support future distance/route validation and travel cost planning.

### Travel Routes

`TravelRouteRecord` supports:

- from/to settlement ids
- route class and optional route type
- available mode ids
- terrain tags
- feature tags
- distance miles
- travel time estimates
- optional ordered hex ids
- optional edge ids
- optional access requirements
- signage
- optional intra-hex distance km
- optional sea region ids

This is the key authored route-distance surface.

### Travel Network

`TravelNetworkContentRecord` supports:

- mode profiles
- travel benchmarks
- terrain variance rules
- feature variance rules
- route records
- inter-port ship routes

This is the likely future owner for validating travel-time estimates and route mode compatibility.

## Current Population-Center Expansion Hooks

The repo already contains the content-field hooks needed to plan population-center expansion without adding records yet.

Relevant existing fields:

| Content shape | Existing expansion hook |
| --- | --- |
| Region | `populationProfile`, `settlementDistributionModel.targetCounts` |
| Region | `simulationProfile.populationCapacity`, `densityBand`, food/water/climate/hazard scores |
| Region | `economicProfile.supplyStrengths`, `demandPressures`, import/export bias |
| Locality | `settlementSuitability.settlementWeight`, `maxPopulationBand`, `strategicSiteWeight`, favored settlement types |
| Locality | `resourceCatchment` and dominant industries |
| Locality | route access modifiers for road, river, coastal, caravan, pass, sea lane |
| Hex | `habitabilityScore`, freshwater type, terrain, barriers, hazards, anchored settlement ids |
| Settlement | parent/dependency role, administrative role, population band/total, trade dependency, infrastructure |
| Route | from/to settlement ids, route class/type, mode ids, distance, edge/hex references |

## Expansion Planning Questions

Future population-center expansion should answer:

1. Does each region's `settlementDistributionModel.targetCounts` define desired total records or minimum scaffold counts?
2. Should target counts be enforced strictly, treated as guidance, or allowed to vary by region maturity?
3. Which settlement types correspond to city/town/village/outpost/strategic_site?
4. What population-band and population-total ranges are allowed for each settlement type?
5. How should region density, food/water availability, climate burden, hazard pressure, and infrastructure difficulty influence count and size?
6. Which locality types are allowed to host each settlement type?
7. How should route access modifiers affect town, port, outpost, pass, caravan, and strategic-site placement?
8. How should coastal/river/pass/sea-lane access influence administrative role and market/harbor tiers?
9. How should parent/dependency roles represent hamlets, satellite villages, forts, mines, ports, waystations, and religious sites?
10. What validation proves settlements anchor to valid hexes and compatible localities?
11. What validation proves route endpoints exist and distances are plausible for the 24 km hex scale?
12. What UI scale assumptions are needed before visual-map pixel positions are trusted?

## Population-Center Candidate Vocabulary

Future expansion should consider these population-center classes before content creation:

| Class | Intended meaning | Likely owner fields |
| --- | --- | --- |
| `city` | major regional/administrative/market center | settlement type, population band, administrative role, market/road/fortification tiers |
| `town` | local market/craft/route node | settlement type, trade dependency, route access, guild presence |
| `village` | rural food/resource population center | local resource catchment, food/water security, parent settlement |
| `outpost` | frontier, military, guild, extraction, route support node | hazard pressure, strategic site weight, route access, purpose tags |
| `strategic_site` | pass, ford, mine, fort, harbor, temple, ruin-adjacent site | locality type, strategicSiteWeight, route/barrier/freshwater/coastal tags |
| `port` | coastal/river/sea-lane trade center | harbor tier, water tier, coastal/sea-lane access |
| `fort` | defensive/military chokepoint | fortification tier, pass/barrier/corridor context |
| `mine` | extractive resource site | mineral/resource catchment, upland/alpine/interior basin context |
| `waystation` | route support settlement | route class/type, pass/caravan/road/river access |
| `monastery_temple_academy` | institution-centered site | institution/guild/religion/magic infrastructure links |

## Distance And Route Validation Rules To Plan Later

Future validation should eventually check:

- `HEX_DISTANCE_KILOMETERS` is the accepted grid-distance basis unless a map-scale pass changes it
- every `WorldHexEdgeContentRecord.fromHexId` and `toHexId` exists
- every edge `hexSpan` is positive
- every route endpoint settlement exists
- every route `orderedHexIds` entry exists
- every route `edgeIds` entry exists
- route `distanceMiles` is plausible from ordered hex count, edge span, or intra-hex distance
- travel time estimates match route distance and mode speed within accepted variance
- route mode ids exist in the travel network mode profiles
- allowed edge travel modes are compatible with route available modes
- sea routes declare sea region ids where needed
- settlements anchor to valid hex ids
- settlement `regionId` matches anchored hex region or has an explicit exception
- settlement `localityBandId` matches an expected locality or has an explicit exception
- visual map refs use known map/climate/biome ids when UI scale is active

## Non-Mutation Rules

- Route distance validation does not recalculate routes automatically.
- Grid scale documentation does not authorize changing map scale.
- Population target counts do not create settlements automatically.
- Settlement suitability does not place new settlements automatically.
- Hex anchoring does not imply route connectivity.
- Route visibility does not authorize travel commands.
- Map pixel coordinates do not override region/hex/locality ownership.
- Population-center expansion must not modify content JSON until explicitly scoped.

## Recommended Future Pass Order

Recommended sequence when this area becomes active:

1. `Map Grid Distance Audit`
   - inspect hexes, edges, routes, travel modes, benchmarks, and settlement anchors
   - read-only/docs-first
2. `Regional Population Center Expansion Plan`
   - define count/tier/type rules using region/locality/hex suitability fields
   - planning only
3. `Settlement Placement Heuristics Plan`
   - define water/route/resource/hazard/market/institution placement rules
   - planning only
4. `Route Distance Validation Plan`
   - define exact distance/time validation tolerances
   - planning only
5. `Settlement Expansion Draft Content Pass`
   - only after schema/content rules are stable; content-only and validation-backed
6. `Map Scale UI Plan`
   - display-first; no travel command dispatch
7. `Travel Route Readiness Helper`
   - pure helper over explicit route/travel inputs; no mutation

## Forbidden Until Explicitly Scoped

Do not add or change:

- map scale constants
- spatial-world runtime calculations
- region/settlement/locality/hex/edge/route content JSON
- generated output
- settlement creation
- route recalculation
- travel time recalculation
- map UI scale or pixel-coordinate behavior
- travel command dispatch
- caravan dispatch/resolution
- knowledge completion from travel visibility
- Chronicle/Renown event output from travel

## Recommended Next Connector Work

The best next connector pass for this specific map/population area is:

- `Regional Population Center Expansion Audit`

Rationale: the repo already has settlement distribution target counts, locality settlement suitability, hex anchoring, and settlement population fields. A focused audit can prepare expansion rules without creating or editing settlement content.

## Recommended Future Codex Work

Do not schedule map/population work ahead of active knowledge-domain work unless explicitly requested.

When ready, the safest first Codex pass is:

- `Version 0.5.x - Map Grid Distance Audit`

It should remain docs-only/read-only and should not alter runtime, content JSON, generated output, UI, or travel/session behavior.
