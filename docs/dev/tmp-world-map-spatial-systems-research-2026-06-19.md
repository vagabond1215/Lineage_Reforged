# Temporary Deep Research: World Map and Spatial Systems

Status: temporary research artifact for Codex planning
Date: 2026-06-19
Source: Deep Research run from the user-provided world map/grid/geography prompt.
Intended use: staging reference for a later narrow Codex planning pass.

> Temporary-file policy: this file is not final design canon. It should either be converted into a permanent `docs/design/**` decision document or deleted after the relevant Codex planning pass lands.

## 1. Executive Summary

The research pass examined the requested world-map and spatial-system scope for Lineage Reforged: map hierarchy, grid/coordinate systems, geography, settlements, ecology, biomes, elevation, flora/fauna, points of interest, roads, bridges, ports, routes, trade, and future map UI/discovery behavior.

The strongest conclusion is that Lineage Reforged should **not** begin with a runtime map, full tile grid, pathfinding system, or procedural POI generator. The project should first define descriptive authority boundaries, schema vocabulary, and validation rules. This follows the current Lineage Reforged pattern: authored content, strict schema/validator passes, focused unit tests, normal content lint, and clear separation between descriptive authority and runtime/gameplay behavior.

Recommended foundation:

1. Place hierarchy remains the anchor: world -> macro-region/continent/island system -> region -> region locality -> settlement -> site/feature/POI.
2. Named map features should be authored as descriptive authority before runtime use.
3. Routes should be graph-first: endpoints, segments, crossings, ports, and route networks.
4. Coordinates and grid overlays should be deferred until there is a concrete UI, travel, or procedural placement need.
5. Biomes/ecology should be profile-based and validated against climate/elevation/hydrology later, not hardwired as mechanics now.
6. Political geography should be separate from physical geography.
7. POI placement should distinguish canonical authored sites from future generated/spawned instances.
8. Knowledge integration should reveal/identify map subjects later without granting runtime effects.

## 2. Repo-State Reading From Available Context

The research prompt asked for a repo-first audit across world content, civilization content, player Knowledge content, schemas, validators, tests, and design docs.

The current visible project trajectory shows:

- `sacred_site.glasswake_shrine_lantern_gardens.glasswake_shrine` exists as an active named world authority.
- That sacred-site record anchors to:
  - `region.lantern_isles`
  - `region.glasswake_quay`
  - `region_locality.lantern_shrine_gardens`
  - `settlement.glasswake_shrine`
- The project already uses parent/anchor relationships for religious hotspots and sacred sites.
- The current foundation strongly separates descriptive world authority from gameplay behavior.
- Normal content lint remains the enforcement mechanism for live content authority.
- Knowledge snippets can reference active world authorities only when the registry advertises the subject type and authority collection.

What remains absent or not yet proven by the available context:

- explicit map grid or coordinate collections;
- tile/hex/cell authorities;
- dedicated macro-region/continent collections;
- dedicated kingdom/polity/border collections;
- dedicated route/road/bridge/port/trade-route collections;
- hydrology/elevation/biome/ecology schemas;
- generalized POI/spawn placement rules;
- runtime map UI, fog-of-war, or generated placement systems.

## 3. Current Gaps and Risks

### Main gaps

- No durable boundary between physical geography, political geography, map features, routes, ecology, and runtime map state.
- No explicit route graph or transport topology.
- No coordinate/grid decision.
- No biome/climate/elevation/hydrology authority model.
- No POI placement model.
- No settlement placement validation beyond current place-anchor conventions.
- No map UI/discovery model beyond general Knowledge patterns.

### Main risks

1. **Premature grid commitment**
   A full square/hex/tile grid too early will lock the project into geometry before the semantic model is stable.

2. **Authority/runtime conflation**
   Geography records must not start granting travel speed, encounters, services, rewards, access, or spawn behavior.

3. **Route and geometry confusion**
   Roads, ferries, sea lanes, crossings, ports, and trade routes are best modeled as graph/topology first, not as raw coordinate art.

4. **Political geography conflation**
   Kingdoms, polities, disputed borders, and cultural territories should overlay geography; they should not replace physical region hierarchy.

5. **Biome oversimplification**
   A flat biome string is not enough for future ecology/spawn/resource rules. Biome should eventually derive from climate, moisture, elevation, hydrology, and region context.

## 4. Recommended World Hierarchy

Recommended hierarchy:

- `world`
- `macro_region` or existing region record with `regionType: macro_region`
- `region`
- `region_locality`
- `settlement`
- `settlement_district` or `site` later
- `map_feature`
- `route_endpoint`
- `route_segment`
- `poi_site`

Do not introduce province/county/district as global concepts yet. Keep them future-only until polity/administration work requires them.

Recommended principle:

- Physical geography owns where a thing is.
- Political geography owns who claims or controls it.
- Route authority owns how places connect.
- Ecology profiles own what can plausibly live/grow/spawn there.
- Runtime systems later consume these authorities but do not define them.

## 5. Grid and Coordinate Model

Recommendation: **graph-first, coordinates-later, grid-last**.

### Now

Use existing ID anchors and place hierarchy. Add no grid-cell collection yet.

### Soon

For map features/routes, allow optional lightweight geometry:

- `anchor`: region/locality/settlement/site reference;
- `extentKind`: point, line, area, corridor;
- optional `approximatePosition` only if useful;
- optional ordered anchor chain for route segments.

### Later

Add formal geometry or grid overlay only after map features and route topology exist.

### Future 0.6+

Consider a grid overlay only when needed for:

- player-facing exploration;
- fog-of-war;
- generated POI placement;
- travel path previews;
- tactical/encounter ranges;
- region-fill generation;
- deterministic spatial saves.

Square vs hex:

- Hex is better for wilderness/exploration adjacency because neighbor distances are uniform.
- Square is easier for UI layouts and array math.
- Graph is best for roads/ports/trade routes.

For Lineage Reforged, graph should come before either square or hex.

## 6. Geography / Elevation / Hydrology / Biome Model

Separate named geography from derived environmental profiles.

### Named geography authority

Potential `world.map_features` classes:

- river
- lake
- wetland
- coastline
- harbor
- estuary
- mountain_range
- pass
- cliff
- forest
- grove
- desert
- swamp
- plain
- landmark
- ruin
- sacred_site_reference, if needed only as a cross-link, not duplicate authority

### Environmental profiles

Potential later profile fields:

- `elevationBand`: coastal, lowland, upland, highland, mountain
- `slopeClass`: flat, rolling, steep, cliffed
- `moistureClass`: arid, dry, mesic, wet, saturated
- `temperatureClass`: cold, cool, temperate, warm, hot
- `climateClass`: coarse authored category
- `dominantBiome`: forest, grassland, wetland, alpine, desert, coastal, etc.
- `transitionBiomes`: optional array
- `seasonalHazards`: flood, snowpack, drought, storm, mud, fire risk

### Hydrology validation ideas

- Rivers require upstream/downstream ordering.
- Rivers should reference source and mouth/end condition.
- Lakes/wetlands must occupy plausible lowland/basin anchors.
- Bridges/fords/ferries must reference a water feature or crossing feature.
- Ports must reference a coast, harbor, river mouth, lake, or navigable river feature.
- Active river/crossing/port records require active parent region/locality anchors.

## 7. Ecology, Flora, Fauna, and Resources

Recommendation: use **ecology profiles**, not direct spawn tables.

Potential `world.ecology_profiles` fields:

- `id`
- `slug`
- `status`
- `anchor`
- `compatibleBiomeIds`
- `elevationBands`
- `moistureClasses`
- `temperatureClasses`
- `floraAssemblages`
- `faunaAssemblages`
- `resourceAssemblages`
- `settlementPressure`: wild, rural, cultivated, urban edge
- `rarityNotes`
- `sourceAuthorityNotes`
- `notes`

Validation ideas:

- No alpine-only flora in lowland wetlands unless explicitly justified.
- No deep-forest predator assemblage in dense urban settlement center.
- Aquatic resources require water feature or wetland/coastal anchor.
- Mineral resources should require geology/elevation/region compatibility later.
- Ecology profiles remain descriptive until runtime foraging/hunting/spawning exists.

## 8. Settlement and Political Geography

### Settlement placement

Settlement validation should eventually consider:

- parent region/locality;
- water access;
- route access;
- port access where relevant;
- farmland/hinterland plausibility;
- elevation/defense;
- nearby resources;
- cultural/religious anchors;
- distance to other settlements;
- polity/control overlays;
- active parent requirements.

Settlement types:

- hamlet
- village
- town
- city
- port
- fort
- shrine-community
- monastery
- trade_post
- seasonal_camp
- ruin / abandoned_site as condition/state, not size

### Political geography

Do not make regions equal kingdoms.

Recommended future split:

- `world.polities`: kingdoms, city-states, leagues, confederacies, tribes, orders if political, etc.
- `world.political_regions`: control overlays, contested zones, borderlands, vassal territories.

Political overlays should reference physical anchors but remain separable from them.

## 9. Roads, Ports, Bridges, Trade Routes, and Travel Graphs

Recommended route model:

- `world.routes`: named route/network authority.
- `world.route_segments`: ordered graph edges.
- `world.crossings`: bridge, ford, ferry, mountain pass, gate.
- `world.ports`: coastal/river/lake port authorities.
- `world.trade_routes`: economic overlay on route/port graph.

Route segment fields:

- `id`
- `routeId`
- `sequence`
- `fromAnchor`
- `toAnchor`
- `segmentType`: road, trail, ferry, sea_lane, river_route, pass
- `status`
- `condition`: maintained, rough, seasonal, ruined, dangerous
- `requiredCrossingId`, optional
- `sourceAuthorityNotes`
- `notes`

Validation ideas:

- Segment endpoints must exist.
- Sea lanes require ports/coastal anchors.
- Ferries require a crossing/water feature.
- Bridges/fords require a water feature.
- Roads crossing water require crossing/ferry/bridge reference.
- Trade routes require settlement/port endpoints.
- Route graph should not imply travel runtime yet.

## 10. POI Placement and Spawn Rules

Use two layers:

1. **Canonical POI authorities**
   Authored named locations: forts, ruins, sacred sites, named mines, bridges, ports, caves, major landmarks.

2. **Future spawn rules**
   Rules for generated temporary or repeatable sites: monster lairs, camps, forage nodes, resource nodes, patrols, minor ruins.

POI placement constraints should consider:

- biome;
- elevation;
- distance from settlement;
- distance from roads;
- distance from water;
- route intersections;
- borderlands;
- wilderness score;
- danger rating;
- resource abundance;
- cultural/religious context;
- polity/faction ownership;
- existing nearby POIs;
- rarity and uniqueness constraints.

Do not create runtime spawn tables now. First create descriptive rules and validation concepts.

## 11. Map UI and Discovery Implications

Future map UI should use layers:

- base geography;
- region/locality labels;
- settlement icons;
- ports;
- roads/routes;
- river/lake/coast features;
- biome tinting;
- elevation shading;
- political borders;
- POI icons;
- discovered/undiscovered state;
- Knowledge-gated labels;
- future fog-of-war.

UI should consume world authority and discovery state. It should not own canonical geography.

## 12. Proposed Content Collections and Schema Concepts

### `world.map_features`

Path: `packages/content/base/world/map_features.json`

Purpose: named physical/cultural map features that are not settlements, routes, or polities.

ID pattern: `map_feature.<feature_type>.<slug>`

Required fields:

- `id`
- `slug`
- `name`
- `summary`
- `status`
- `featureType`
- `placeAnchor`
- `extentKind`
- `sourceAuthorityNotes`
- `notes`

Optional later fields:

- `parentFeatureId`
- `hydrologyRole`
- `elevationBand`
- `biomeProfileIds`
- `relatedSettlementIds`
- `relatedRouteIds`

### `world.routes`

Path: `packages/content/base/world/routes.json`

ID pattern: `route.<route_type>.<slug>`

Required fields:

- `id`
- `slug`
- `name`
- `summary`
- `status`
- `routeType`
- `scopeAnchor`
- `sourceAuthorityNotes`
- `notes`

### `world.route_segments`

Path: `packages/content/base/world/route_segments.json`

ID pattern: `route_segment.<route_slug>.<segment_slug_or_number>`

Required fields:

- `id`
- `routeId`
- `sequence`
- `fromAnchor`
- `toAnchor`
- `segmentType`
- `status`
- `sourceAuthorityNotes`
- `notes`

### `world.crossings`

Path: `packages/content/base/world/crossings.json`

ID pattern: `crossing.<crossing_type>.<slug>`

Feature types:

- bridge
- ford
- ferry
- pass
- causeway

### `world.ports`

Path: `packages/content/base/world/ports.json`

ID pattern: `port.<slug>`

Required anchor:

- settlement, coast, harbor, river, lake, or route endpoint.

### `world.polities`

Path: `packages/content/base/world/polities.json`

ID pattern: `polity.<slug>`

### `world.political_regions`

Path: `packages/content/base/world/political_regions.json`

ID pattern: `political_region.<polity_slug>.<slug>`

### `world.biome_profiles`

Path: `packages/content/base/world/biome_profiles.json`

ID pattern: `biome_profile.<slug>`

### `world.ecology_profiles`

Path: `packages/content/base/world/ecology_profiles.json`

ID pattern: `ecology_profile.<slug>`

### Deferred `world.grid_overlays`

Path: `packages/content/base/world/grid_overlays.json`

Timeline: future 0.6+ unless map UI needs it earlier.

## 13. Validation and Test Strategy

Recommended validation layers:

1. Schema shape validation.
2. ID/slug consistency validation.
3. Parent/anchor existence validation.
4. Active-parent validation.
5. Cross-collection semantic validation.
6. Forbidden behavior-field validation.
7. Focused live seed tests.
8. Normal content lint registration.

Core rules:

- Active records require active parents unless explicitly allowed.
- Route endpoints must exist.
- Ports require water/coast access.
- Crossings require water/chokepoint authority.
- Roads cannot cross water without crossing/ferry/bridge authority.
- Flora/fauna/resource profiles must match biome/climate/elevation constraints.
- Descriptive records must reject runtime, UI, storage, command, event, reward, access, service, and gameplay fields.

## 14. Authored-vs-Generated Data Strategy

Fully authored now:

- macro regions;
- regions/localities;
- settlements;
- named map features;
- named routes;
- major crossings;
- ports;
- unique POIs;
- political authority;
- biome/ecology profiles.

Generated once and saved later:

- route geometry traces;
- coarse settlement influence zones;
- watershed/basin assignments;
- wilderness/danger gradients.

Generated dynamically much later:

- temporary camps;
- encounter sites;
- resource-node refreshes;
- monster lairs;
- patrols/caravans;
- fog-of-war state.

## 15. Knowledge System Integration

Future Knowledge integration should mirror current Religion behavior:

- Knowledge subjects reference active authority records.
- Registry alignment advertises subject type and authority collection.
- Snippets remain descriptive and do not grant mechanics.
- Map labels and POI identity can be Knowledge-gated later.
- Undiscovered features can appear as generic markers or remain hidden depending on future UI policy.

Potential future Knowledge subjects:

- `region`
- `region_locality`
- `settlement`
- `map_feature`
- `route`
- `port`
- `crossing`
- `polity`
- `biome_profile`
- `ecology_profile`

Do not create `knowledge_domain.geography` until enough canonical subjects exist to justify it.

## 16. Gameplay Integration Roadmap

Later consumers:

- Travel uses route graph, crossings, ports, terrain friction.
- Foraging uses ecology profiles and seasonality.
- Hunting uses fauna profiles and settlement pressure.
- Trade uses route/port graph, resources, polities.
- Encounters use wilderness, route proximity, polity tension, ecology.
- Pilgrimage uses sacred sites and future pilgrimage route authority only after a dedicated plan.
- Map UI uses feature/route/political/ecology layers plus Knowledge discovery state.

Keep this split:

- content authority now;
- validation soon;
- runtime/gameplay much later.

## 17. Recommended Versioned Implementation Sequence

Suggested post-current sequence:

1. `0.5.197 - World Geography Authority Boundary Decision`
   - docs-only;
   - decide layers and non-goals.

2. `0.5.198 - World Place Hierarchy Scope Decision`
   - docs-only;
   - decide macro-region vs existing region vocabulary.

3. `0.5.199 - World Map Feature Schema Decision`
   - docs-only;
   - choose `world.map_features` scope.

4. `0.5.200 - World Map Feature Schema And Validator`
   - schema/validator/tests;
   - no live content seed yet.

5. `0.5.201 - World Route Authority Decision`
   - docs-only;
   - decide route/segment/crossing/port split.

6. `0.5.202 - World Route Schema And Validator`
   - schema/validator/tests;
   - no route content seed yet.

7. `0.5.203 - First Map Feature Content Seed Plan`
   - docs-only;
   - choose first safe feature, likely coast/harbor/river/landmark.

8. `0.5.204 - First Map Feature Content Seed`
   - content seed + tests + content lint.

9. `0.5.205 - Political Geography Authority Decision`
   - docs-only.

10. `0.5.206 - Polity And Political Region Schema Decision`
    - docs-only or schema depending readiness.

11. `0.5.207 - Biome And Ecology Authority Decision`
    - docs-only.

12. `0.5.208 - Biome/Ecology Schema And Validator`
    - schema/validator/tests.

13. `0.5.209 - Geography Knowledge Subject Decision`
    - docs-only.

14. `0.5.210 - Geography Registry And Snippet Seed`
    - Knowledge registry/snippet seed after authority exists.

15. `0.6+`
    - grid overlays, travel runtime, map UI, dynamic POI spawning.

## 18. Open Questions

- Are `region` and `region_locality` backed by current live collections, schemas, and validators, or only referenced through existing world authority records?
- Does the repo already have unpublished settlement schema/validator support?
- Should macro-regions be physical continents/island systems only, or can they be cultural/geographic blends?
- Should first route authority focus on roads, sea lanes, river routes, or crossings?
- Should a future `knowledge_domain.geography` exist, or should geography topics live under current domains until coverage grows?
- Is a future player-facing map intended to be grid-based, graph-based, or hybrid?
- Is procedural generation expected to create canonical saved content, runtime-only content, or both?

## 19. Recommended Next Codex Prompt

Next recommended narrow Codex prompt:

`Version 0.5.197 - World Geography Authority Boundary Decision`

Goal:
Create a docs-only decision defining the canonical boundary between place hierarchy, named map features, route authority, political overlays, ecology/biome profiles, and future grid overlays. Decide what belongs in descriptive world authority now, what belongs in later validation, and what must remain future runtime/UI behavior.

This should not implement schemas, validators, content, runtime, UI, storage, gameplay, map generation, or travel systems.

Key decisions:

- whether to introduce `macro_region` now or defer;
- whether the first geometry-free feature layer should be `world.map_features`;
- whether routes should eventually split into routes, route segments, crossings, and ports;
- whether coordinates are required in first-pass authorities;
- whether a grid overlay is explicitly deferred to 0.6+;
- whether geography content remains descriptive-only with no travel, spawn, combat, economy, route-time, UI, or reward fields.

Suggested commit message for that future Codex run:

`docs(world): decide geography authority boundaries`
