# World Map Feature Authority Schema Decision

Version: `Version 0.5.228 - World Map Feature Authority Schema Decision`

Status: approved documentation-only schema posture

## 1. Decision Summary

Approve future `world.map_features` as the canonical authored semantic, geometry-free named physical/cultural feature collection.

The future collection is distinct from existing `world.world_map_features`. The existing collection remains the current visual/reference geometry aggregate with its current content, schema, validation, map assets, and UI consumers. This pass does not rename, migrate, split, delete, copy, normalize, or reinterpret it.

Future semantic records use `map_feature.<slug>`, do not encode feature type in the id, require descriptive place anchors, and allow optional non-authoritative visual references without copying geometry. Coordinates, pixels, polygons, lines, points, hexes, edges, grids, adjacency, routes, crossings, ports, political claims, ecology profiles, POI placement, discovery, runtime, UI, storage, and gameplay fields are forbidden.

The first implementation must be schema, pure validator, and focused tests only. It starts without content or normal content-lint registration; a later seed plan must approve explicit named features.

Historical proposed map-feature schema labels under `0.5.198` and `0.5.199` are unlanded/remapped references. This completed decision is `Version 0.5.228`; current guidance must use that label.

## 2. Live Repo Reality

Live inspection establishes:

- `world.regions` contains 41 records: five continents, four island systems, four oceans, and 28 subregions.
- `world.region_localities` contains 47 locality-band place records, and `world.settlements` contains 88 settlement records.
- `world.sacred_sites` contains one active named site, and `world.religious_hotspots` contains two descriptive hotspot records.
- Existing `world.world_map_features` contains one `world_map_feature.first_world` aggregate for `world_map.first_world` at 2048x1152 pixels.
- That aggregate contains two source layers, 201 region footprints, 68 coastline lines, eight river lines, five mountain lines, four pass points, six crossing points, 19 climate zones, and 230 biome zones.
- `world.world_hexes` contains 47 semantic hex records; `world.world_hex_edges` contains 49 edge records.
- `world.travel_networks` contains one network with six modes, six benchmarks, 12 route records, and eight inter-port ship routes plus explicit hex/edge references.
- Current environmental content includes nine regional ecology profiles, 36 biomes, 18 climate profiles, 93 habitats, 117 flora records, and 132 fauna records.
- Current encounter/spawn content includes six encounter templates and five spawn profiles.
- Two source map assets exist: the First World biome and elevation PNGs.
- The content browser/UI renders those raster layers plus stored polygons, labels, settlement points, and route lines as display/debug aids.
- The existing world-map feature schema, normal lint registration, semantic geometry checks, schema-file tests, renderer references, and content remain live.
- Knowledge has Flora, Fauna, Minerals, and General Lore domains. It has no Geography domain or map-feature subject authority.

This pass changes none of those owners.

## 3. Existing Place, Visual Map, Geometry, Hex, Route, Travel, Ecology, Biome, POI, Knowledge, Runtime, and UI Surface Inventory

Current authority remains divided as follows:

- `world.regions`, `world.region_localities`, settlements, and explicit named-site collections own canonical place identity and hierarchy;
- `world.world_maps` owns map metadata, scale assumptions, image asset references, broad route summaries, and conflict-zone summaries;
- `world.world_map_features` owns current reference-image footprints, lines, points, climate/biome zones, source layers, and image dimensions;
- `world.world_hexes` owns current semantic hex environment/friction/barrier/resource-affinity posture;
- `world.world_hex_edges` owns current adjacency, route quality, crossing difficulty, allowed modes, and named corridors;
- `world.travel_networks` owns current route/ship-route topology, travel modes, timing estimates, and hex/edge paths;
- regional ecology, biome, climate, habitat, flora, and fauna collections own descriptive environmental profiles and compatibility;
- encounter templates and spawn profiles own current encounter composition and spawn-candidate descriptors;
- settlements, sacred sites, religious hotspots, and future dedicated site families own persistent named POI identity;
- Knowledge owns only its approved domains, registry vocabulary, snippets, evidence, and player progress boundaries;
- the browser renderer owns visual/debug presentation, not semantic feature identity;
- runtime and player state own travel, discovery, spawning, effects, and persistence where implemented.

Future `world.map_features` adds stable semantic named-feature identity without absorbing any of these contracts.

## 4. Map Feature Collection Posture

Future `world.map_features` owns authored named physical features and culturally recognized geographic landscapes that need stable identity independent of map drawing.

A record may identify a named river, lake, wetland, coastline, estuary, mountain range, pass, cliff, forest, grove, desert, swamp, plain, natural harbor, natural landmark, or cultural landscape. It describes what the feature is, its broad extent posture, canonical place associations, provenance, and lifecycle.

It is not a generic container for every map label or POI. Do not create a semantic record merely because a visual feature id, settlement string, region `notableFeatures` phrase, raster shape, hex tag, route name, or UI label exists. First content requires explicit canon and a seed plan.

Map features remain descriptive-only. They do not create locations, boundaries, routes, navigation, ecology, spawning, resources, ownership, services, discovery, or effects.

## 5. Candidate Paths, Wrapper, Ids, Slugs, Feature Types, Extent Kinds, and Record Lifecycle

Approve this future contract:

- content path: `packages/content/base/world/map_features.json`;
- schema path: `packages/schemas/world/map-feature.schema.json`;
- logical collection: `world.map_features`;
- wrapper: strict object with exactly `records`;
- record id: `map_feature.<slug>`;
- slug: lower snake case exactly matching the id suffix;
- lifecycle: required `status` with `planned`, `active`, or `retired`.

Feature type is not encoded as an id prefix, middle segment, or suffix. A stable feature may be classified more precisely later without changing its identity. The `map_feature.*` namespace is intentionally distinct from the current aggregate `world_map_feature.*` and nested visual `feature.*` ids. No compatibility alias or automatic equality exists between them.

Approve this conservative first-pass `featureType` vocabulary:

- `river`, `lake`, `wetland`, `coastline`, `estuary`;
- `mountain_range`, `mountain_pass`, `cliff`;
- `forest`, `grove`, `desert`, `swamp`, `plain`;
- `natural_harbor`, `natural_landmark`, `cultural_landscape`.

Do not use generic `landmark`, `ruin`, `fort`, `cave`, `mine`, `port`, `road`, `bridge`, `ford`, `ferry`, or `route` types in the first pass. Those can collide with explicit POI or topology owners. `natural_harbor` describes sheltered physical geography only; it is not a port.

Approve `extentKind`: `point_like`, `linear`, `area_like`, `corridor_like`, or `distributed`. Extent is descriptive classification only and carries no geometry or topology.

## 6. Minimum Map Feature Record Contract

Approve this first-pass record posture:

- `id`: required `map_feature.<slug>`;
- `slug`: required matching lower-snake-case slug;
- `name`: required canonical authored name;
- `aliases`: required array, empty when none;
- `summary`: required concise physical/cultural description;
- `featureType`: required controlled first-pass type;
- `extentKind`: required controlled descriptive extent;
- `placeAnchors`: required non-empty typed array;
- `descriptiveTags`: required duplicate-free conservative tags;
- `visualReferences`: required array, empty when none, containing only non-authoritative current visual pointers;
- `status`: required `planned`, `active`, or `retired`;
- `sourceAuthorityNotes`: required non-empty provenance notes;
- `notes`: required descriptive array, empty when none.

Do not add geometry, dimensions, navigation, ecology, political, POI-placement, Knowledge, runtime, UI, storage, or gameplay fields.

## 7. Place Anchor and Semantic Identity Boundary

First-pass place anchors may target only canonical `region`, `region_locality`, or `settlement` records. Each anchor contains `placeType`, `placeId`, and `anchorRole`.

Approve anchor roles `contains_feature`, `feature_crosses`, `feature_borders`, `feature_near`, and `named_context`. Roles are descriptive and do not calculate containment, intersection, border geometry, adjacency, distance, jurisdiction, or travel access.

At least one region or region-locality anchor is required. Settlement anchors may provide named context but cannot make the feature settlement-owned or duplicate settlement identity.

Sacred sites and religious hotspots are not first-pass anchors. If a physical feature provides context for such a site, the specific site authority may later reference the map feature after a dedicated relationship decision. This avoids making a sacred site or hotspot the parent of physical geography.

Map features do not redefine region hierarchy, `macroRegionId`, locality bands, settlements, region borders, named sites, or POIs.

Do not introduce a `macro_region` collection or subject now. Existing `world.regions` already represents continent, island-system, ocean, and subregion roles. Current `macroRegionId` fields are historical/current anchor naming for continent or island-system region records, not evidence of a missing authority.

## 8. Existing `world.world_map_features` Visual Geometry Boundary

Preserve existing `world.world_map_features` as the current visual/reference geometry aggregate.

Its content path remains `packages/content/base/world/world_map_features.json`; its schema remains `packages/schemas/world/world-map-feature.schema.json`; its logical collection remains `world.world_map_features`; and its `world_map_feature.*` aggregate plus nested `feature.*`, `map_climate.*`, and `map_biome.*` ids retain current meaning.

The semantic collection does not replace region footprints, coastlines, river/mountain/pass/crossing geometry, climate zones, biome zones, source layers, reference dimensions, or map ids. It must not copy points or treat a matching name as identity proof.

Any future integration or migration requires a dedicated audit that establishes explicit semantic-to-visual relationships, consumer impact, and current-data policy. No rename, split, deletion, normalization, or compatibility bridge is approved here.

## 9. Coordinate, Hex, Grid, Map Asset, UI, and Visual Cross-Reference Boundary

Coordinates are not required or allowed in first-pass semantic map-feature records. Reject x/y values, latitude/longitude, pixels, points, line arrays, polygons, bounding boxes, image dimensions, source layers, asset paths, and render styles.

Existing world hexes, hex edges, and travel references retain current ownership. Semantic features must not contain hex ids, edge ids, cells, adjacency, direction, corridor paths, or friction. New square, hex, cell, general grid-overlay, fog-of-war, and exploration-grid authority remains deferred to `0.6+` unless separately approved.

Map assets and the browser renderer remain visual/UI owners. Semantic records must not select images, labels, visibility, zoom, color, icon, layer order, or UI state.

Optional `visualReferences` are allowed only as non-authoritative pointers containing:

- `visualAggregateId`: an existing `world_map_feature.*` aggregate;
- `visualFeatureId`: an existing nested physical `feature.*` id;
- `relationship`: `approximate_depiction`, `partial_depiction`, or `reference_only`;
- `notes`: required explanation of mismatch or scope.

References may target existing coastline, river, mountain, or pass geometry only. They cannot target region footprints, crossings, climate zones, or biome zones in the first pass. They do not prove shared identity, completeness, geometry accuracy, or runtime position.

## 10. Route, Crossing, Port, Trade Route, Travel, Pathfinding, and Logistics Boundary

Map features must not create or substitute for `world.routes`, `world.route_segments`, `world.crossings`, `world.ports`, or later `world.trade_routes`.

A `mountain_pass`, `river`, `coastline`, `estuary`, or `natural_harbor` is physical geography. It does not establish a traversable crossing, bridge, ford, ferry, lock, road, sea lane, route endpoint, port facility, customs point, or trade corridor.

Existing `world.world_hex_edges` and `world.travel_networks` remain current adjacency/topology owners. Map features cannot carry ordered hexes, edge ids, routes, segments, modes, distances, travel estimates, access rules, pathfinding costs, security, hazards, cargo, warehouses, caravans, ships, journeys, or transport behavior.

Operational route/crossing/port authority requires its own audit and must reconcile current visual crossings, travel routes, ship routes, harbor settlement metadata, and topology without inferring records from map-feature type.

## 11. Political Geography, Polity, Claim, Border, Conflict, Control, and Administration Boundary

Regions and map features remain physical/cultural geography. Future `world.polities` owns authored political identity; future overlays must own claims, borders, control, occupation, disputes, conflict zones, administration, jurisdiction, and political/cultural reach.

Map-feature anchors and `feature_borders` describe geographic association only. They do not establish a legal or political border.

Existing world-map conflict-zone summaries remain map descriptors, not map-feature fields or canonical political overlays. Do not add polity ids, claimant/controller ids, border lines, occupation status, jurisdiction, administrative roles, forces, taxation, enforcement, law, or player legal state.

## 12. Ecology, Biome, Climate, Hydrology, Resource, Spawn, Encounter, and POI Placement Boundary

Map features may later be referenced by environmental systems after dedicated decisions. They do not own regional ecology, biome, climate, habitat, hydrology simulation, flora/fauna compatibility, resources/commodities, gathering, depletion, refresh, foraging, hunting, fishing, spawning, encounter composition, or placement rules.

Feature types such as river, lake, wetland, forest, desert, and swamp are semantic identity classifications. They do not validate hydrology, assign biome zones, generate terrain, place resources, select species, or change spawn candidates.

Encounter templates and spawn profiles retain current responsibilities. No encounter/spawn record may be inferred from a feature record.

POI placement rules remain separate from canonical authored POIs. They may later use map-feature references as constraints, but they cannot create, activate, overwrite, or persist a named site without an approved owner.

## 13. Canonical POI, Sacred Site, Religious Hotspot, Settlement, Landmark, Knowledge, Quest, Chronicle, Economy, Player-State, Runtime, Storage, Command, Event, Reward, Service, Access, Law, Favorability, Alignment, and Gameplay Boundary

Persistent POIs remain owned by explicit collections: settlements, sacred sites, religious hotspots, and future ruins, forts, caves, mines, ports, landmarks, or other site families. Map features must not duplicate those identities.

`natural_landmark` is restricted to a named physical formation lacking a more specific safe type. `cultural_landscape` identifies a broad named landscape, not a building, monument, shrine, ruin, fort, settlement, institution, or service site. Generic authored landmark POIs require a later dedicated authority.

Knowledge may reference active map features only after a dedicated subject/schema/registry decision. This pass does not approve `knowledge_domain.geography`, a `map_feature` subject, shortcut subjects, snippets, discovery state, label gating, evidence, unlocks, rewards, access, or effects.

Quests, Chronicles, and economy may later reference stable map-feature ids descriptively but cannot mutate them. No settlement effects, player geography knowledge, map reveal, runtime state, storage/save state, UI, commands, events, rewards, services, access, law, favorability, alignment, or gameplay behavior belongs in the first map-feature contract.

## 14. Future Schema and Validator Direction

`Version 0.5.240 - World Map Feature Schema And Validator` remains the conditional implementation candidate after the docs-first queue.

That pass should create only:

- `packages/schemas/world/map-feature.schema.json`;
- a pure focused semantic validator;
- focused in-memory tests and schema-file registration if required by repository convention.

It must not create `map_features.json`, migrate visual geometry, register a live collection in normal content lint, modify map assets/UI, or implement route, grid, ecology, POI, Knowledge, runtime, storage, or behavior.

Future validation should enforce strict wrapping, unique `map_feature.<slug>` ids/slugs, no type-encoded id requirement, controlled feature/extent/anchor vocabularies, duplicate-free anchors/tags/references, at least one valid region/locality anchor, canonical place resolution, and lifecycle rules.

Visual-reference validation must resolve only existing physical nested `feature.*` ids in the named aggregate, reject geometry copying, and preserve non-authoritative relationship semantics. Validators must reject every coordinate, topology, political, environmental execution, POI-placement, Knowledge, runtime, UI, storage, and gameplay field named by this decision.

A later content seed plan must prove explicit canon and non-duplication before content or normal lint registration.

## 15. Temporary Research Artifact Handling

Delete `docs/dev/tmp-world-map-spatial-systems-research-2026-06-19.md` in this pass.

Its useful layer taxonomy, semantic/visual distinction, place hierarchy, feature vocabulary, route split, coordinate/grid posture, political/ecology/POI boundaries, validation guidance, and sequencing are now permanently owned by `docs/design/world-geography-authority-boundary-decision.md`, this decision, the pipeline authority, and the future-content backlog.

No named future consumer remains. Future map-feature work must start from permanent decisions and a fresh live-repo audit.

## 16. Non-Goals

- no schema, validator, content JSON, test, loader, normal content-lint registration, seed, migration, rename, split, deletion, compatibility alias, or normalization of live authorities;
- no change to existing `world.world_map_features`, geometry, coordinates, polygons, lines, points, pixels, image dimensions, map assets, labels, renderer, or UI;
- no route, segment, crossing, port, trade route, travel network, journey, logistics, pathfinding, transport, hex, edge, square, cell, grid, overlay, fog-of-war, discovery, or exploration-state change;
- no polity, claim, border, conflict, control, occupation, jurisdiction, administration, ecology, biome, climate, hydrology, flora, fauna, resource, spawn, encounter, or POI-placement change;
- no sacred-site, religious-hotspot, settlement, Knowledge, quest, Chronicle, economy, item, service, player-state, runtime, storage, command, event, reward, access, law, favorability, alignment, or gameplay behavior;
- no new Deep Research and no transition to `0.6.0`.

## 17. Next Recommended Version

Proceed with `Version 0.5.229 - Hazard And Route Security Boundary Decision`.

That run remains documentation-only. It should define hazard and route-security ownership against current travel topology, encounter/spawn, civic, ecology, and runtime surfaces and decide the temporary travel research artifact's retirement or one remaining concrete consumer.

No new GPT Deep Research is required before `0.5.229`. GPT-DR labels remain non-Codex labels and do not consume numbered `0.5.x` versions.
