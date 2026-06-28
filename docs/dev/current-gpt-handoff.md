# Current GPT Handoff

Source version/run: Version 0.5.251 - First World Map Feature Content Seed
Date: 2026-06-28
Status: first live semantic map-feature seed completed; no visual geometry, route topology, pathfinding, ecology, POI, Knowledge, runtime, UI, storage, commands, events, rewards, migrations, or gameplay behavior changed

## Current Map Feature Authority

- `world.map_features` now has a tiny live planned-only seed at `packages/content/base/world/map_features.json`.
- Live semantic map-feature records are exactly `map_feature.windward_spine` and `map_feature.thalos_run`.
- Normal content lint now registers semantic map-feature content through `tools/content-lint/map-features.mjs`.
- Existing `packages/content/base/world/world_map_features.json` remains the separate visual/reference geometry aggregate authority.
- Semantic map-feature records remain planned-only static identities and must not define geometry, coordinates, route topology, pathfinding, ecology execution, POI placement, Knowledge, runtime, UI, storage, command, event, reward, or gameplay behavior.

## Latest Result

Latest completed:

- `Version 0.5.251 - First World Map Feature Content Seed`

Immediate next:

- `Version 0.5.252 - Settlement District And Site Authority Boundary Decision`

## Map Feature Seed Result

- A fresh local audit reconfirmed both approved candidates from `docs/design/first-world-map-feature-content-seed-plan.md`.
- `map_feature.windward_spine` is anchored to current `region.windward_spine` and references `world_map_feature.first_world` / `feature.mountains_windward_spine` as a non-authoritative visual pointer.
- `map_feature.thalos_run` is anchored to current `region.verdant_thalos` and `region_locality.verdant_thalos_coastal_bays`, and references `world_map_feature.first_world` / `feature.river_thalos_run` as a non-authoritative visual pointer.
- The seed did not copy visual points, coordinates, route ids, travel-network data, crossing/port authority, climate/biome data, settlement roles, polity records, Knowledge metadata, quest metadata, generated operators, or runtime/UI strings into semantic map-feature authority.

## Validation Notes

- Focused map-feature validation passed.
- Normal content lint passed and now reports `content-lint: ok (61 files checked)`.
- `node --test tests\unit\schema-files.test.mjs` may still parse the map-feature schema, then fail on the unrelated pre-existing Knowledge subject vocabulary assertion around `sacred_site`.
- Read `docs/dev/current-codex-output.md` for the exact latest command results.

## Next Route Guardrail

`Version 0.5.252 - Settlement District And Site Authority Boundary Decision` should be docs-first. It should decide ownership boundaries for settlement districts and placed sites without adding schema, live content, runtime behavior, UI, storage, commands, events, rewards, or gameplay behavior unless a newer prompt explicitly scopes implementation.
