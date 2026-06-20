# Current GPT Handoff

Source route: Codex local planning through `Version 0.5.197 - World Geography Authority Boundary Decision`
Date: 2026-06-19
Branch/status assumption: `master`; latest numbered run is documentation-only.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest numbered Codex handoff.
- `docs/design/world-geography-authority-boundary-decision.md` is the permanent authority for the new geography/map layer boundaries.
- `docs/dev/tmp-world-map-spatial-systems-research-2026-06-19.md` is temporary planning input, not design canon.
- Live repository state overrides stale absence assumptions in the research artifact: geometry-backed map features, hexes, edges, travel networks, and regional ecology already exist.

## Current Anchor

Latest completed numbered run:

- `Version 0.5.197 - World Geography Authority Boundary Decision`

Immediate next numbered Codex run:

- `Version 0.5.198 - World Map Feature Authority Schema Decision`

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.197 Result

- Deferred new `macro_region` vocabulary because existing region types already cover continents, island systems, oceans, and subregions.
- Approved future geometry-free `world.map_features` as the first implementation candidate, distinct from existing `world.world_map_features` visual/reference geometry.
- Approved a later graph-first split across routes, route segments, crossings, qualified ports, and later trade routes.
- Made coordinates optional rather than required for first-pass semantic authorities.
- Deferred new or expanded grid-overlay authority and reliance to `0.6+` while preserving existing hex/edge content unchanged.
- Separated political overlays from physical geography, descriptive ecology/biome profiles from runtime spawning, and POI placement rules from canonical authored POIs.
- Kept all new geography/map authorities descriptive-only.
- Changed no content, schema, validator, test, runtime, UI, storage, travel, pathfinding, trade, or gameplay behavior.

## Next Route Boundary

`Version 0.5.198 - World Map Feature Authority Schema Decision` should remain documentation-only. It must define the future collection path/id, strict geometry-free record contract, feature vocabulary, place anchors, provenance, validation ownership, and relationship to existing `world_map_features.json` without implementing or migrating content.

The temporary research artifact should be deleted after that run if its remaining useful guidance has been promoted; otherwise the handoff must name its next concrete consumer and removal condition.
