# Current GPT Handoff

Source version/run: Version 0.5.250 - First World Map Feature Content Seed Plan
Date: 2026-06-28
Status: documentation-only first semantic map-feature content seed plan completed; no live semantic map-feature content, normal content-lint registration, visual geometry, route topology, pathfinding, ecology, POI, Knowledge, runtime, UI, storage, commands, events, rewards, or gameplay behavior changed

## Current Map Feature Authority

- `world.map_features` remains future static authored semantic map-feature identity authority only.
- Future content path remains absent: `packages/content/base/world/map_features.json`.
- Pure validator helper exists at `tools/content-lint/map-features.mjs`; focused tests exist at `tests/unit/map-feature-validation.test.mjs`; schema-file parse registration exists.
- Normal content lint still does not register semantic `map_features.json` or `map-features.mjs`.
- Existing `packages/content/base/world/world_map_features.json` remains the separate visual/reference geometry aggregate authority.
- Future semantic map-feature records must be planned-only by default and must not define geometry, coordinates, route topology, pathfinding, ecology execution, POI placement, Knowledge, runtime, UI, storage, command, event, reward, or gameplay behavior.

## Latest Result

Latest completed:

- `Version 0.5.250 - First World Map Feature Content Seed Plan`

Immediate next:

- `Version 0.5.251 - First World Map Feature Content Seed`

## Map Feature Seed Plan Result

- Added `docs/design/first-world-map-feature-content-seed-plan.md`.
- Selected a tiny planned-only future `world.map_features` seed posture.
- Identified `map_feature.windward_spine` and `map_feature.thalos_run` as conditional future candidates only, based on current visual aggregate evidence plus current region/locality support.
- Rejected inference from region footprints, crossings, climate zones, biome zones, world hexes, route ids, edge ids, travel networks, settlement roles, religious hotspots, sacred sites, polity records, Knowledge, quest metadata, generated operators, runtime/UI strings, map pixels, coordinates, or generic prose alone.
- No `map_features.json` was created.
- No normal content-lint registration was added for semantic map-feature content.

## Validation Notes

- Focused and normal validation should be read from `docs/dev/current-codex-output.md` for the exact latest run results.
- `node --test tests\unit\schema-files.test.mjs` may still parse the map-feature schema, then fail on the unrelated pre-existing Knowledge subject vocabulary assertion around `sacred_site`.
- `packages/content/base/world/map_features.json` remains absent.

## Next Route Guardrail

`Version 0.5.251 - First World Map Feature Content Seed` is conditional. It should create `packages/content/base/world/map_features.json` only if live content is explicitly authorized and a fresh audit reconfirms at least one approved candidate from the plan. If the evidence is too ambiguous, defer live semantic map-feature content rather than invent identities or promote visual geometry.
