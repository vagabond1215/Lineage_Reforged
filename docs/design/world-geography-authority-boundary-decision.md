# World Geography Authority Boundary Decision

Version: `0.5.197 - World Geography Authority Boundary Decision`
Status: completed documentation-only decision
Date: 2026-06-19

## 1. Decision Summary

Approve a docs-first geography authority route centered on a future geometry-free `world.map_features` collection. Keep the existing place hierarchy as the canonical location anchor, separate physical geography from political claims, keep route topology in a later authority lane, and treat ecology and biome profiles as descriptive authority before any runtime consumption.

Do not introduce `macro_region` now. Do not require coordinates in first-pass authorities. Do not expand or make new systems depend on square, hex, or grid overlays before `0.6+`. All new geography and map authority records remain descriptive-only.

This run consumes `docs/dev/tmp-world-map-spatial-systems-research-2026-06-19.md` as planning input. It creates no schema, validator, content record, test, runtime system, UI, storage, travel, pathfinding, POI placement, trade, or gameplay behavior.

## 2. Current Repository Reality

The research artifact supplied useful layer boundaries, but several absence claims are stale against the current checkout. This decision uses live repository state where they differ.

- `world.regions` already represents five continents, four island systems, four oceans, and 28 subregions through `regionType`.
- `world.region_localities`, settlements, religious hotspots, and sacred sites already provide narrower place anchors.
- `world.world_map_features` already exists as `world_map_features.json`, with one geometry-heavy record tied to a 2048x1152 reference map. It aggregates region footprints, coastlines, rivers, mountains, passes, crossings, climate zones, and biome zones.
- `world.world_hexes` and `world.world_hex_edges` already exist and are validated. They are also referenced by current travel-network content.
- `world.travel_networks` already contains route records, ship routes, travel modes, timing estimates, and hex/edge references.
- `world.regional_ecology_profiles`, biomes, climate profiles, habitats, flora, fauna, encounter templates, and spawn profiles already exist.

These existing collections remain unchanged. This decision does not declare them invalid or authorize migration. It distinguishes their present map-reference, topology, simulation-input, or profile roles from the future semantic authority boundary.

## 3. Canonical Ownership Boundary

| Layer | Canonical owner | Boundary |
| --- | --- | --- |
| Place hierarchy | existing `world.regions`, `world.region_localities`, settlements, and approved named-site collections | Owns where an authority belongs and its parent/anchor relationships. |
| Named physical features | future `world.map_features` | Owns stable feature identity, type, descriptive meaning, lifecycle status, and place anchors without requiring geometry. |
| Visual geometry | existing `world.world_map_features` until a later integration decision | Owns reference-image footprints, lines, points, and visual zones; it must not silently become semantic named-feature authority. |
| Route topology | future `world.routes`, `world.route_segments`, `world.crossings`, and qualified `world.ports` | Owns named connections and graph structure after a separate route authority decision. |
| Trade corridors | later `world.trade_routes` | Owns economic use of route/port topology; it must not define physical connectivity. |
| Political geography | future `world.polities` and political overlay authority | Owns claims, control, contest, and administration separately from physical place identity. |
| Biome/ecology | existing profiles now, later refinement decisions as needed | Owns descriptive environmental compatibility and assemblages; it does not spawn runtime entities. |
| Canonical POIs | the specific named authority collection for each POI family | Owns authored persistent identities such as sacred sites, ruins, forts, caves, mines, ports, or landmarks. |
| POI placement rules | separate future planning/rule authority | Owns constraints for generated or suggested placement; it never creates canonical authored POIs by implication. |
| Grid overlays | existing hex data remains untouched; new overlay authority is deferred to `0.6+` | May later support exploration, discovery, procedural placement, or saves, but does not define place or feature identity. |

## 4. Required Decisions

### 4.1 Macro Region

Defer a new `macro_region` subject type or collection.

Current `world.regions` already distinguishes `continent`, `island_system`, `ocean`, and `subregion`. Existing `macroRegionId` fields are role names for anchors that resolve to the accepted continent or island-system region records; they do not prove a missing canonical type. A later place-hierarchy decision may introduce a shared macro grouping only if live content needs one parent vocabulary that current `regionType` values cannot express.

### 4.2 Geometry-Free Map Features

Approve future `world.map_features` as the first new implementation candidate.

It should be a semantic named-feature authority, not a rename of the existing `world.world_map_features` visual aggregate. The next schema decision must define identity, place anchoring, feature vocabulary, lifecycle status, provenance, and the relationship to existing geometry without duplicating identity or silently migrating content.

### 4.3 Route Authority Split

Approve this eventual conceptual split, subject to a later route authority decision:

- `world.routes` for named route or corridor identity;
- `world.route_segments` for ordered graph edges between canonical anchors;
- `world.crossings` for bridges, fords, ferries, passes, causeways, and comparable chokepoints;
- `world.ports` only where a named port authority is distinct from its settlement and harbor metadata;
- later `world.trade_routes` as an economic overlay on validated route and port topology.

Keep graph-first thinking, but implement none of these collections now. The route decision must audit and reconcile existing `world.travel_networks`, route records, ship routes, hexes, edges, settlement harbor metadata, and map crossings before selecting schemas or transition scope.

### 4.4 Coordinates

Coordinates are not required in first-pass semantic authorities.

`placeAnchor` and canonical references provide the minimum location contract. Existing pixel points and polygons remain valid in the current visual/reference layer. A future semantic record may eventually carry an optional visual cross-reference, but coordinates must not become required until a concrete map UI, geometry-validation, travel, or placement consumer justifies them.

### 4.5 Square, Hex, And Grid Overlays

Defer any new or expanded square, hex, cell, or general grid-overlay authority and any new runtime reliance on it to `0.6+`.

This is a forward boundary, not a claim that the repository lacks grids. Existing `world_hexes`, `world_hex_edges`, and their current travel references remain untouched. They do not force the first semantic map-feature authority to require cells, coordinates, adjacency, pathfinding, fog-of-war, or deterministic spatial state.

### 4.6 Political Geography

Keep political geography separate from physical geography.

Regions and map features describe physical place. Future polity and political-overlay authorities may reference those places for claims, control, disputed borders, administration, or cultural reach. Political ownership must not redefine continent, ocean, subregion, locality, settlement, or physical-feature identity.

### 4.7 Ecology And Biome Profiles

Keep ecology and biome authority descriptive first. Existing regional ecology, biome, climate, habitat, flora, and fauna content remains the current source material, but future refinement must separate plausibility and compatibility from runtime spawning, foraging, hunting, encounter placement, resource refresh, and trade simulation.

No ecology or biome record gains spawn instructions or gameplay effects through this decision.

### 4.8 POI Placement

Plan POI placement rules separately from canonical authored POI records.

Named persistent places belong to explicit authority collections. Future placement rules may express biome, elevation, route, water, settlement-distance, political, danger, rarity, or uniqueness constraints for generated candidates. They must not generate, activate, or overwrite canonical POIs without a separate owner and persistence decision.

### 4.9 Descriptive-Only Posture

All future geography/map authority records introduced under this lane must remain descriptive-only. They may identify and relate places, features, profiles, or topology, but they must not grant or execute travel speed, pathfinding, encounters, spawns, services, access, rewards, trade effects, law, favorability, alignment, commands, events, UI state, storage state, or gameplay behavior.

Existing collections with simulation-oriented fields are not broadened, removed, or reclassified by this docs-only decision. A later migration or ownership cleanup requires its own explicit audit and prompt.

### 4.10 First Implementation Candidate

The first implementation candidate is `world.map_features`, beginning with a documentation-only schema decision rather than a schema file.

The next run should be:

`Version 0.5.198 - World Map Feature Authority Schema Decision`

It should decide the future path, collection id, record identity, strict geometry-free contract, feature vocabulary, anchor rules, provenance, visual cross-reference boundary, validation ownership, and transition relationship with `world_map_features.json`. It must not implement or migrate content.

## 5. First Map Feature Scope

The future semantic collection should cover named physical or culturally recognized geographic features that are not already owned as settlements, sacred sites, religious hotspots, routes, polities, or another dedicated POI family.

Candidate feature families include rivers, lakes, wetlands, coastlines, harbors, estuaries, mountain ranges, passes, cliffs, forests, groves, deserts, swamps, plains, and landmarks. The next schema decision must keep the first enum conservative and avoid a generic `custom` escape hatch.

`sacred_site_reference` should not be a feature type. A map feature may later cross-reference a sacred site, but it must not duplicate sacred-site identity or authority.

## 6. Validation Direction

Later schema and validator work should be staged separately and should eventually enforce:

1. strict records-only structure and canonical id/slug agreement;
2. unique feature identities;
3. supported feature and extent vocabulary;
4. canonical place-anchor resolution and active-parent coherence;
5. explicit provenance notes;
6. cross-reference validity without copied authority;
7. rejection of runtime, UI, storage, command, event, reward, service, access, economy, spawn, pathfinding, and gameplay fields;
8. optional visual-reference coherence only after that boundary is explicitly designed.

No validator or test change is authorized by this decision.

## 7. Sequencing

1. `0.5.197` - this completed authority-boundary decision.
2. `0.5.198` - geometry-free `world.map_features` schema decision, including the existing visual-layer relationship.
3. Later narrow schema/validator pass - only after the schema decision is complete.
4. Later content seed plan - select at most one source-backed named feature.
5. Later route authority decision - audit existing travel networks, routes, ports, crossings, hexes, and edges before any split.
6. Later political geography decision.
7. Later ecology/biome refinement decision.
8. `0.6+` - new grid overlays, map UI, travel/pathfinding runtime, generated POI placement, and dynamic spatial state.

Religious-order placeholder planning and favorability/alignment remain deferred roadmap candidates. This user-prioritized geography run supersedes them only in immediate sequence, not in durable backlog intent.

## 8. Temporary Research Artifact

`docs/dev/tmp-world-map-spatial-systems-research-2026-06-19.md` was consumed as planning input and remains a temporary guardrail, not design authority.

Keep it through the next map-feature schema decision because it contains field candidates and later route, political, ecology, and POI questions not fully owned by this boundary document. That next run must make an explicit cleanup decision: delete it if all useful guidance has moved into permanent design documents, or retain it only with a concrete remaining consumer and removal condition.

## 9. Non-Goals

- no schema or validator changes;
- no content JSON or Knowledge registry/snippet changes;
- no tests or content-lint changes;
- no map UI, travel, pathfinding, or procedural generation;
- no POI spawning or combat encounter placement;
- no trade-route mechanics or economy behavior;
- no runtime, storage, command, event, reward, service, access, favorability, alignment, law, or gameplay behavior;
- no migration, compatibility alias, rename, or deletion of existing map, feature, route, hex, edge, ecology, biome, spawn, or encounter content;
- no transition to `0.6.0`.
