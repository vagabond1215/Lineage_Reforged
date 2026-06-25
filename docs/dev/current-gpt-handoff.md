# Current GPT Handoff

Source version/run: Version 0.5.230 - Settlement Schema And Validator Hardening
Date: 2026-06-25
Status: settlement validator hardening completed; no schema, content, runtime, UI, storage, or gameplay change

## Authority Rules

- Existing `world.settlements` remains the canonical settlement identity and inhabited-place authority.
- `visualMapRef` remains optional visual/reference support. It does not supersede `macroRegionId`, `regionId`, `localityBandId`, or `hexAnchorId`, and it must not become simulation, pathfinding, occupancy, route, encounter, or gameplay coordinate authority.
- Content lint now resolves settlement `visualMapRef.mapId` against `world_maps`, resolves `visualMapRef.climateZoneId` against current `world_map_features.climateZones`, resolves `visualMapRef.biomeZoneId` against current `world_map_features.biomeZones` or their split `.part_N` family, and enforces known map pixel bounds from `world_maps.scaleProfile`.
- Current settlement embedded descriptive fields remain in place: population, economy, survival, trade, infrastructure, racial mix, domestic resources/trade flows, and guild presence. No normalization or new authority was introduced.
- Future settlement districts, settlement sites, services, property, placed infrastructure, settlement economies, guild/institution presence, route/trade overlays, and runtime settlement state remain separate/deferred.

## Current Anchor

Latest completed:

- `Version 0.5.230 - Settlement Schema And Validator Hardening`

Immediate next:

- `Version 0.5.231 - Crafting Recipe Schema And Validator`

## Settlement Hardening Result

- Added `tools/content-lint/settlement-visual-map-refs.mjs` as a pure semantic validator helper.
- Wired that helper into the existing settlement cross-file content-lint pass.
- Added focused in-memory tests for valid references, optional `visualMapRef`, missing maps, missing visual aggregates, missing climate/biome refs, split biome-zone families, bounds, and registration.
- Did not change settlement schema or settlement content.
- Full normal content lint passes at 58 checked files.

## Known Test Notes

- `node --test tests/unit/region-first-world-data.test.mjs tests/unit/schema-files.test.mjs tests/unit/settlement-visual-map-refs.test.mjs` currently fails for unrelated existing reasons: BOM parsing in `region-first-world-data.test.mjs` and a stale Knowledge subject assertion in `schema-files.test.mjs`.
- The focused settlement visual-map reference test passes.

## Next Route

`Version 0.5.231 - Crafting Recipe Schema And Validator` is the next queued run. It must use the `0.5.219` Recipe And Production Schema Decision and stay within that decision's approved schema, validator, and focused-test scope.
