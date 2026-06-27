# Current GPT Handoff

Source version/run: Version 0.5.240 - World Map Feature Schema And Validator
Date: 2026-06-27
Status: future semantic map-feature schema and focused validator completed; no live map-feature content, normal content-lint registration, visual geometry migration, route topology mutation, map asset/UI, Knowledge, runtime, storage, commands, events, rewards, or gameplay change

## Authority Rules

- `world.map_features` is approved as future static authored semantic, geometry-free named physical/cultural feature identity only.
- It is distinct from existing `world.world_map_features`, which remains the current visual/reference geometry aggregate for region footprints, coastlines, rivers, mountains, passes, crossings, climate zones, biome zones, source layers, image dimensions, map assets, and UI consumers.
- Semantic map-feature records use strict `map_feature.<slug>` ids, lower-snake-case slugs, required lifecycle `status`, conservative `featureType` and `extentKind` vocabulary, duplicate-free aliases/tags, non-empty place anchors, required `visualReferences`, non-empty `sourceAuthorityNotes`, and descriptive notes.
- Place anchors may target only current `world.regions`, `world.region_localities`, or `world.settlements`; at least one region or region-locality anchor is required. Settlement anchors are context only and must not create settlement-owned feature identity.
- Sacred sites and religious hotspots are not first-pass anchors. Future named POIs, routes, crossings, ports, trade routes, topology, ecology, political overlays, Knowledge, runtime state, UI, storage, commands, events, rewards, and gameplay remain separate owners.
- Visual references are optional non-authoritative pointers only. They may resolve only to existing nested physical `feature.*` ids in allowed coastline, river, mountain, or pass groups inside current `world.world_map_features`; they must not target region footprints, crossings, climate zones, biome zones, source layers, map climate ids, or map biome ids, and they do not copy or prove geometry.
- No compatibility alias or equality bridge exists between `map_feature.*`, `world_map_feature.*`, and nested visual `feature.*` ids.

## Current Anchor

Latest completed:

- `Version 0.5.240 - World Map Feature Schema And Validator`

Immediate next:

- `Version 0.5.241 - Hazard And Route Security Schema Decision`

## World Map Feature Validation Result

- Added `packages/schemas/world/map-feature.schema.json`.
- Added `tools/content-lint/map-features.mjs` as a pure in-memory structural and semantic validator helper.
- Added `tests/unit/map-feature-validation.test.mjs`.
- Registered the new schema in `tests/unit/schema-files.test.mjs`.
- No `packages/content/base/world/map_features.json` file was created.
- No normal content-lint registration for future semantic map-feature content was added.
- Existing `packages/content/base/world/world_map_features.json`, `packages/schemas/world/world-map-feature.schema.json`, normal visual-map-feature content-lint registration, map assets, and UI/rendering code remain untouched.
- `docs/dev/tmp-world-map-spatial-systems-research-2026-06-19.md` remains absent.

## Known Test Notes

- `node --test tests\unit\map-feature-validation.test.mjs` passes.
- `npm.cmd run tool:content-lint` passes and remains `content-lint: ok (58 files checked)`.
- `node --test tests\unit\schema-files.test.mjs` parses the new schema, then still fails on the unrelated pre-existing Knowledge subject vocabulary assertion around `sacred_site`.
- `tests/unit/region-first-world-data.test.mjs` still has the unrelated direct-run BOM parsing issue noted by prior handoffs.

## Next Route

`Version 0.5.241 - Hazard And Route Security Schema Decision` is the next queued run. It should use the `0.5.229` Hazard And Route Security Boundary Decision, stay documentation/schema-decision scoped, and avoid live content, normal lint registration, route topology mutation, travel runtime, encounter/spawn behavior, UI, storage, commands, events, rewards, or gameplay behavior unless a later prompt explicitly authorizes them.
