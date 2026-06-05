# Settlement Placement Heuristics Plan

Source route: ChatGPT via GitHub Connector
Date: 2026-06-05
Status: connector-only prep for future settlement placement and population-center expansion work; no source, schema, content JSON, UI implementation, generated output, roadmap advancement, or runtime behavior changes

## Purpose

Convert current region, locality, hex, settlement, route, and economy fields into explicit planning heuristics for future population-center placement before any content records, generated output, map markers, route recalculation, or runtime behavior are added.

This document is a planning source. It does not authorize settlement creation.

## Source Basis

Primary connector prep sources:

- `docs/design/map-grid-distance-source-map.md`
- `docs/design/regional-population-center-expansion-audit.md`
- `docs/design/travel-knowledge-route-source-map.md`
- `docs/design/economy-command-surface-source-map.md`

Primary code/content shape sources:

- `packages/engines/civilization-engine/src/content.ts`
- `packages/engines/civilization-engine/src/spatial-world.ts`

## Core Boundary Rule

Placement heuristics are advisory, not generation.

A high settlement weight, high habitability score, strong resource catchment, route access modifier, water access, or regional target count may rank a candidate site, but it must not create settlement content, map markers, travel routes, economy links, knowledge discovery, or Chronicle/Renown output without an explicit future content pass.

## Placement Pipeline

Future placement work should stage decisions in this order:

1. Choose region.
2. Read region density, population capacity, population profile, economic profile, and target counts.
3. Inventory existing settlements by class and role.
4. Compute class gaps: city, town, village, outpost, strategic site, and optional subclasses.
5. Rank localities by settlement suitability and role fit.
6. Rank hexes inside locality by habitability, water, terrain, hazards, barriers, and existing anchors.
7. Match settlement class to locality/hex profile.
8. Assign provisional role, population band, population total range, site class, and parent/dependency relationship.
9. Check route, economy, survival, and infrastructure plausibility.
10. Draft content only in a separate explicitly scoped content pass.

## Region-Level Heuristics

Use region fields to determine target pressure and settlement mix.

| Region signal | Suggested planning effect | Boundary |
| --- | --- | --- |
| `simulationProfile.densityBand` | More cities/towns/villages in high-density regions; more outposts/strategic sites in low-density regions. | Does not alter target counts automatically. |
| `populationCapacity` | Caps total settlement scale and population bands. | Does not recalculate population totals. |
| `foodProductionCapacity` | Increases village and town suitability. | Does not create food settlements. |
| `waterAvailability` | Increases village/town/city viability. | Does not override hex freshwater checks. |
| `climateBurden` | Reduces village density; increases outpost/strategic-site selectivity. | Does not block all settlement content. |
| `hazardPressure` | Favors forts, outposts, watch posts, and concentrated settlements. | Does not create combat encounters. |
| `infrastructureDifficulty` | Reduces city/town count; increases waystations and isolated outposts. | Does not change route records. |
| `economicProfile.supplyStrengths` | Suggests towns, ports, mines, markets, or processing sites. | Does not create economy behavior. |
| `economicProfile.demandPressures` | Suggests import-dependent towns, ports, caravan nodes. | Does not create trade flows automatically. |
| `settlementDistributionModel.targetCounts` | Guides content gap planning by class. | Target count is not generated content. |

## Locality-Level Heuristics

Use locality fields to rank candidate placement zones.

| Locality signal | Suggested planning effect | Strong fits |
| --- | --- | --- |
| high `settlementWeight` | preferred for cities/towns/villages | city, town, village |
| high `strategicSiteWeight` | preferred for forts, passes, outposts, chokepoints | strategic_site, fort, waystation |
| high `arableLand` catchment | rural population support | village, town, city support belt |
| high `pasture` catchment | herding settlements and caravan support | village, town, outpost |
| high `timber` catchment | logging, shipbuilding, frontier towns | village, outpost, town |
| high `fishery` catchment | ports, river villages, coastal towns | port, village, town |
| high `stone` catchment | quarry towns, forts, construction centers | mine, outpost, town |
| high `ore` catchment | mining camps and metal towns | mine, outpost, town |
| high `salt` catchment | salt towns, trade nodes, preservers | town, port, outpost |
| high `herbs` catchment | temples, apothecary towns, druidic sites | village, institutional_site, town |
| high road access | market/administrative viability | town, city, waystation |
| high river access | water security/trade viability | village, town, city, port |
| high coastal access | maritime settlement viability | port, city, town |
| high caravan access | inland trade and waystation viability | town, waystation, outpost |
| high pass access | chokepoint and defensive viability | fort, waystation, strategic_site |
| high seaLane access | maritime trade viability | port, city |

## Hex-Level Heuristics

Use hex fields to validate specific anchors after a locality is ranked.

| Hex signal | Suggested planning effect | Boundary |
| --- | --- | --- |
| high `habitabilityScore` | preferred for villages/towns/cities | Does not create settlement. |
| `freshwaterType: river` | strong for villages, towns, cities, fords | Does not imply route crossing. |
| `freshwaterType: coast` | strong for ports/coastal towns | Requires harbor/sea-lane support later. |
| `freshwaterType: stream` | supports villages/outposts | Lower city support unless otherwise justified. |
| `freshwaterType: marsh` | supports specialty sites; adds burden | Requires hazard/industry justification. |
| low friction by road/wagon | good for towns/cities/waystations | Does not create roads. |
| water-mode friction support | good for river/coastal routes | Does not create travel mode availability. |
| barrier tags | supports forts/passes/fords; burdens villages | Does not imply safety. |
| hazard tags | supports outposts/forts; lowers dense settlement | Does not create encounter content. |
| resource affinity tags | supports mines/camps/resource villages | Requires settlement role justification. |
| existing anchored settlements | avoid over-clustering unless planned as satellite/dependency | Does not block parent/child settlement design. |

## Class Assignment Heuristics

| Class | Minimum strong signals | Avoid unless justified |
| --- | --- | --- |
| `city` | high regional density/capacity, strong water, strong road/river/coastal access, high settlement weight, administrative/economic role | high hazard, low water, weak route access, low population capacity |
| `town` | moderate/high settlement weight, route access, resource catchment, market/craft/trade role | isolated high-friction hexes without resource/strategic reason |
| `village` | arable/pasture/fishery/timber support, water access, manageable hazards | severe climate/hazard with no survival reason |
| `outpost` | resource extraction, frontier, hazard, pass, road, or strategic access | dense core zones better served by towns/villages |
| `strategic_site` | high strategicSiteWeight, barrier/pass/ford/harbor/ruin/resource feature | ordinary low-value rural localities |
| `port` | coast/river/sea-lane access, harbor potential, maritime goods/fishery/trade | inland hexes without explicit water route |
| `fort` | pass, ford, border, ridge, hazard, corridor, military role | safe interior without defensive reason |
| `mine` | ore/stone/salt/mineral/resource affinity, upland/alpine/interior basin | low-resource agricultural areas |
| `waystation` | long-route gap, caravan/pass/road support, low/moderate population | high-density city cores unless district-like |
| `institutional_site` | religion/magic/history/culture tags, road/river access, special locality | no institutional/cultural reason |

## Parent And Dependency Heuristics

Use parent/dependency relationships to avoid inflating independent settlement counts.

Good dependency candidates:

- hamlet under a town
- village under a city food belt
- mine under a town/city
- fort under a city/region authority
- waystation under a town, guild, or caravan route owner
- port district under a coastal city
- monastery/academy under a settlement or institution owner

Rules to plan later:

- dependent settlements should still have valid hex/locality anchors
- dependency role should clarify why the child exists
- parent id should not replace route/economy/owner validation
- dependent sites should count separately only if regional target-count policy says so

## Population Band Heuristics

Future content rules should define exact numeric ranges, but planning can follow:

| Class | Relative population band expectation |
| --- | --- |
| city | highest bands in region; must fit population capacity and urban percent |
| town | moderate bands; local market/trade/craft/resource center |
| village | low to moderate bands; rural production and survival support |
| outpost | low bands unless major fortress/extraction camp |
| strategic_site | low to moderate; role importance may exceed population |
| port | town/city range depending on harbor/sea-lane importance |
| fort | low to moderate; depends on garrison/civilian support |
| mine | low to moderate; depends on extraction scale |
| waystation | low; service population |
| institutional_site | low to moderate; depends on institution scale |

## Validation Questions For Future Content Passes

Before adding new settlement records, ask:

1. Does the class fill a region target-count or narrative gap?
2. Does the locality favor this settlement type?
3. Does the hex support the required terrain, water, hazard, and resource assumptions?
4. Does population band fit locality max population band?
5. Does the administrative role match region and parent/dependency logic?
6. Does route access claim match existing routes/edges or remain intentionally future-facing?
7. Does economy model fit resource catchment and route access?
8. Does survival model fit hex/locality/region scores?
9. Does infrastructure profile fit population band and role?
10. Does visual map placement wait for a map-scale UI pass?

## Non-Mutation Rules

- Do not create settlements from this plan.
- Do not modify target counts from this plan.
- Do not modify localities, hexes, routes, or region profiles from this plan.
- Do not generate map markers from this plan.
- Do not infer knowledge discovery from planned placement.
- Do not create Chronicle/Renown output from planned placement.
- Do not update economy/trade flows until settlement records exist and route/economy linkage is scoped.

## Recommended Future Pass Order

Recommended sequence for this area:

1. `Settlement Placement Source Audit`
   - inspect actual content records and count gaps
   - read-only/docs-first
2. `Settlement Target Gap Report`
   - compare existing settlements to regional target counts
   - read-only/generated report only if explicitly scoped
3. `Settlement Content Shape Plan`
   - define id, naming, population, role, parent/dependency, economy, survival, infrastructure field rules
4. `Pilot Region Settlement Expansion Draft`
   - content-only for one region; no route/economy/UI mutation
5. `Pilot Region Settlement Validation Pass`
   - validate anchors, locality fit, population, parent/dependency, and role coherence
6. `Route And Economy Linkage Plan`
   - connect stable settlements to route/trade surfaces later
7. `Map Marker/UI Scale Plan`
   - display-only and separate from content creation

## Forbidden Until Explicitly Scoped

Do not add or change:

- settlement content JSON
- region/locality/hex/edge/route content JSON
- generated output
- spatial-world runtime
- map scale constants
- route calculations
- travel/session state
- economy mutation
- map UI markers
- knowledge completion/discovery from settlement visibility
- Chronicle/Renown output

## Recommended Next Connector Work

The next useful connector-only pass for this area is:

- `Settlement Expansion Content Shape Plan`

Rationale: placement heuristics define where and why a settlement should exist. The next pass should define the minimum safe content shape and authoring rules before any settlement content is drafted.

## Recommended Future Codex Work

Do not schedule settlement expansion ahead of active knowledge-domain work unless explicitly requested.

When ready, the safest first Codex pass is:

- `Version 0.5.x - Settlement Placement Source Audit`

It should remain docs-only/read-only and should not alter content JSON, generated output, runtime, UI, travel/session behavior, economy, or knowledge state.
