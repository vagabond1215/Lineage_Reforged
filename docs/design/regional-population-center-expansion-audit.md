# Regional Population Center Expansion Audit

Source route: ChatGPT via GitHub Connector
Date: 2026-06-05
Status: connector-only prep for future regional population-center expansion work; no source, schema, content JSON, UI implementation, generated output, roadmap advancement, or runtime behavior changes

## Purpose

Audit the current content shapes and planning boundaries for expanding population centers in each region before any settlement content, generation rules, map placement, route recalculation, UI markers, or runtime travel/economy behavior is implemented.

This document is a planning source. It does not authorize settlement creation.

## Source Basis

Primary sources:

- `docs/design/map-grid-distance-source-map.md`
- `docs/design/travel-knowledge-route-source-map.md`
- `docs/design/economy-command-surface-source-map.md`
- `packages/engines/civilization-engine/src/content.ts`
- `packages/engines/civilization-engine/src/spatial-world.ts`

## Core Boundary Rule

Population targets are planning signals, not generated content.

Regional target counts, settlement suitability, hex habitability, route access, resource catchments, and population capacity can guide future settlement expansion, but they must not automatically create settlements, alter routes, mutate economy, change travel state, generate UI markers, or complete geography/settlement knowledge.

## Current Expansion Inputs

### Region-level inputs

`RegionContentRecord` already supports these expansion-relevant fields:

- `regionType`
- `parentRegionId`
- `tags`
- `environmentProfile`
- `simulationProfile`
- `populationProfile`
- `economicProfile`
- `settlementDistributionModel`

The most direct expansion hook is:

- `settlementDistributionModel.targetCounts.city`
- `settlementDistributionModel.targetCounts.town`
- `settlementDistributionModel.targetCounts.village`
- `settlementDistributionModel.targetCounts.outpost`
- `settlementDistributionModel.targetCounts.strategic_site`

These should be treated as desired content-shape guidance until a dedicated content pass scopes exact records.

### Locality-level inputs

`RegionLocalityContentRecord` supports:

- `habitationScoreModifier`
- `resourceCatchment`
- `settlementSuitability.settlementWeight`
- `settlementSuitability.maxPopulationBand`
- `settlementSuitability.strategicSiteWeight`
- `settlementSuitability.favoredSettlementTypes`
- `routeAccessModifier`
- `dominantIndustries`
- `supportedSiteClasses`

This is the preferred source for placement heuristics. Future expansion should select localities before selecting specific hex anchors.

### Hex-level inputs

`WorldHexContentRecord` supports:

- `regionId`
- `localityBandId`
- `biomeFamily`
- `elevationBand`
- `terrainType`
- `freshwaterType`
- `habitabilityScore`
- `frictionByMode`
- `barrierTags`
- `hazardTags`
- `resourceAffinityTags`
- `anchoredSettlementIds`

This is the preferred source for anchoring and validating settlement placement after a locality is chosen.

### Settlement-level inputs

`SettlementContentRecord` already supports:

- `macroRegionId`
- `regionId`
- `localityBandId`
- `hexAnchorId`
- `settlementType`
- `siteClass`
- `terrainContext`
- `populationBand`
- `populationTotal`
- `administrativeRole`
- parent/dependency relationships
- `identityTags`
- `purposeTags`
- `economicModel`
- `survivalModel`
- `tradeDependencyProfile`
- `infrastructureProfile`
- `domesticResourceProfile`
- `domesticTradeFlows`
- `guildPresence`
- optional visual map reference

This is sufficient to support city/town/village/outpost/strategic-site expansion once content rules are defined.

## Population Center Classes

Use these classes as planning vocabulary before content creation.

| Class | Core role | Likely settlement fields | Placement drivers |
| --- | --- | --- | --- |
| `city` | major administrative, market, port, capital, or fortress center | high population band, high market/road/water/fortification tiers, administrative role | high density/capacity, route convergence, water access, political role |
| `town` | local market, guild, craft, river/coastal/pass node | moderate population, market tier, route access, secondary industries | resource catchment, road/river/caravan access, trade dependency |
| `village` | rural food/resource support settlement | lower population, local supply strengths, parent settlement optional | arable land, water, pasture, timber, low hazard |
| `outpost` | frontier/extraction/military/guild/travel support | low/moderate population, purpose tags, dependency role | hazard edge, mine/forest/pass/road, strategic access |
| `strategic_site` | pass, ford, fort, harbor, mine, temple, ruin-adjacent node | may be small; strong purpose/identity tags | strategicSiteWeight, barriers, route edges, special resources |
| `port` | sea/river/coastal trade hub | harbor/water/market tiers, coastal/river route access | coast, bay, river mouth, sea lane, fish/maritime goods |
| `fort` | military chokepoint or regional defense node | fortification tier, defensive administrative role | pass, ford, border, ridge, route corridor, hazard pressure |
| `mine` | extraction site | mineral/resource purpose tags, low/moderate population | ore/stone/salt resource catchment, upland/alpine/interior basin |
| `waystation` | road/caravan/pass support | low population, dependency role, route-service tags | long-route gaps, pass/corridor/caravan access |
| `institutional_site` | temple, monastery, academy, guild hall, sacred site | institution/guild/religion/magic infrastructure links | local culture, religion, road/river access, ruins/history |

## Region Expansion Decision Questions

Future planning/content passes should answer these before adding settlements:

1. Are region target counts strict totals, minimum targets, or aspirational density guidance?
2. Should target counts include existing settlements or only new expansion candidates?
3. Which region types may receive each population-center class?
4. How should population capacity and density band affect actual settlement counts?
5. How should `urbanPopulationPercent` and `ruralPopulationPercent` distribute city/town/village targets?
6. Should high-hazard regions trade village counts for outposts/strategic sites?
7. Should high-resource regions add mines, timber camps, fisheries, ports, and market towns beyond target counts?
8. Should route convergence increase town/city likelihood?
9. Should coastal/river/sea-lane access reserve a minimum number of port or river-market sites?
10. Should pass/ford/border conditions reserve strategic sites or forts?
11. How should parent/dependency relationships represent satellite villages, hamlets, mines, forts, and waystations?
12. What minimum narrative fields are required for a new population center?

## Placement Heuristic Outline

Future settlement placement can be staged without generation first:

1. Select target region.
2. Read region density, population capacity, settlement pattern, and target counts.
3. Inventory existing settlements for that region.
4. Compute gaps by class.
5. Rank localities by settlement suitability, route access, resource catchment, site class, and industry fit.
6. Select candidate hex anchors matching locality and region.
7. Assign class, settlement type, role, population band, and purpose tags.
8. Check route access and dependency relationships.
9. Check economy/survival model plausibility.
10. Only then draft content records in a dedicated content pass.

## Validation Rules To Plan Later

Future validation should eventually check:

- each settlement has valid `regionId`, `localityBandId`, and `hexAnchorId`
- settlement region matches hex region or has explicit exception
- settlement locality matches hex locality band or has explicit exception
- settlement site class is supported by locality
- settlement population band fits locality `maxPopulationBand` or has explicit exception
- city/town/village/outpost/strategic-site counts can be compared against regional targets
- parent settlement exists when `parentSettlementId` is used
- dependency role exists only with parent settlement or explicit exception
- domestic trade flow partner settlements exist
- route access claims match nearby routes or are explicitly justified
- harbor/sea-lane roles require coastal/river/sea-lane support or explicit exception
- fort/pass/ford roles require relevant terrain/route/barrier support or explicit exception
- mine/extraction roles require resource catchment or explicit exception
- visual map refs use known map/climate/biome ids when active

## Non-Mutation Rules

- Do not add settlements in this audit.
- Do not alter regional target counts in this audit.
- Do not recalculate population totals in this audit.
- Do not update routes in this audit.
- Do not assign map pixel positions in this audit.
- Do not generate content JSON in this audit.
- Do not update knowledge snippets/domains from settlement visibility.
- Do not create Chronicle/Renown output from settlement expansion.

## Recommended Future Pass Order

Recommended sequence for this area:

1. `Regional Population Center Source Audit`
   - inspect actual region, locality, settlement, hex, and route content records
   - read-only/docs-first
2. `Regional Settlement Target Gap Report`
   - compare existing settlement counts against region target counts
   - read-only/generated report only if explicitly scoped
3. `Settlement Placement Heuristics Plan`
   - define placement/tier/population rules
   - planning only
4. `Settlement Expansion Content Shape Plan`
   - define minimum fields, naming rules, id rules, parent/dependency rules
   - planning only
5. `Settlement Expansion Draft Content Pass`
   - content-only, small region batch, validation-backed
6. `Route And Economy Linkage Pass`
   - connect new centers to routes/trade only after settlement records are stable
7. `Map Marker/UI Scale Plan`
   - display-only and separate from content creation

## Forbidden Until Explicitly Scoped

Do not add or change:

- settlement content JSON
- region content JSON
- locality content JSON
- hex/edge/route content JSON
- generated output
- spatial-world runtime
- distance constants
- route calculations
- travel/session state
- economy mutation
- map UI markers
- knowledge completion/discovery from settlement visibility
- Chronicle/Renown output

## Recommended Next Connector Work

The next useful connector-only pass for this area is:

- `Settlement Placement Heuristics Plan`

Rationale: this audit identifies the current expansion fields. The next pass should convert those fields into an explicit non-runtime heuristic plan for placement and class assignment.

## Recommended Future Codex Work

Do not schedule population-center expansion ahead of active knowledge-domain work unless explicitly requested.

When ready, the safest first Codex pass is:

- `Version 0.5.x - Regional Population Center Source Audit`

It should remain docs-only/read-only and should not alter content JSON, generated output, runtime, UI, travel/session behavior, economy, or knowledge state.
