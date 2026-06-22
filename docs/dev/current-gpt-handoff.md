# Current GPT Handoff

Source version/run: Version 0.5.228 - World Map Feature Authority Schema Decision
Date: 2026-06-22
Status: documentation-only decision completed; no implementation occurred

## Authority Rules

- Future `world.map_features` owns stable semantic, geometry-free named physical/cultural feature identity.
- Future paths are `packages/content/base/world/map_features.json` and `packages/schemas/world/map-feature.schema.json`.
- Records use `map_feature.<slug>`, strict records-only wrapping, and `planned`/`active`/`retired` lifecycle. Feature type is not encoded in the id.
- First-pass anchors resolve only regions, region localities, and settlements; at least one region/locality anchor is required.
- First-pass types are rivers, lakes, wetlands, coastlines, estuaries, mountain ranges/passes, cliffs, forests, groves, deserts, swamps, plains, natural harbors/landmarks, and cultural landscapes.
- Extent kinds are descriptive only: point-like, linear, area-like, corridor-like, or distributed.
- Existing `world.world_map_features`, its schema/content/lint, map dimensions/assets, geometry, zones, and renderer consumers remain unchanged.
- Optional semantic-to-visual references are non-authoritative pointers only. They cannot copy geometry or establish equality.
- Existing place hierarchy, hexes/edges, travel networks, routes, ecology/biomes, POIs, encounters/spawns, Knowledge, runtime, UI, and storage retain ownership.
- Macro regions, coordinates, new grids, routes/crossings/ports/trade routes, political overlays, ecology integration, POI placement, and Knowledge subjects remain separate/deferred.
- All first-pass map-feature records remain descriptive-only.

## Current Anchor

Latest completed:

- `Version 0.5.228 - World Map Feature Authority Schema Decision`

Immediate next:

- `Version 0.5.229 - Hazard And Route Security Boundary Decision`

## Map Feature Decision Result

- Live inventory confirmed 41 regions, 47 localities, 88 settlements, one visual aggregate, 47 hexes, 49 edges, one travel network, nine ecology profiles, 36 biomes, 18 climates, 93 habitats, 117 flora, 132 fauna, six encounter templates, and five spawn profiles.
- The exact semantic contract and forbidden geometry/topology/runtime fields are fixed in `docs/design/world-map-feature-schema-decision.md`.
- Conditional implementation remains `0.5.240 - World Map Feature Schema And Validator` and is not pre-approved beyond the documented scope.
- `docs/dev/tmp-world-map-spatial-systems-research-2026-06-19.md` was deleted after full promotion and has no remaining consumer.

## Consolidated Near-Term Queue

1. `0.5.229 - Hazard And Route Security Boundary Decision`

No new Deep Research is required before this run. GPT-DR labels remain non-Codex labels and do not consume `0.5.x` numbers.

## Next Route Boundary

`Version 0.5.229 - Hazard And Route Security Boundary Decision` remains documentation-only. It must separate hazard and route-security descriptive authorities from current travel topology, ecology, encounter/spawn, civic/law, economy, and runtime owners and decide the temporary travel research artifact's disposition.

It must not implement schemas, validators, content, tests, travel/security/hazard behavior, encounter generation, spawning, pathfinding, runtime, UI, storage, or gameplay behavior.
