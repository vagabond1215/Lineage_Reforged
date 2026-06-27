# Current GPT Handoff

Source version/run: Version 0.5.242 - Hazard Profile Schema And Validator
Date: 2026-06-27
Status: future target-free hazard-profile schema and focused validator completed; no live hazard-profile content, normal content-lint registration, hazard overlays, route-security schema/content, route topology mutation, travel runtime, encounter/spawn behavior, Knowledge behavior, UI, storage, commands, events, rewards, services, access, or gameplay change

## Authority Rules

- `world.hazard_profiles` now has a strict future schema and isolated pure validator for reusable non-security hazard vocabulary only.
- Hazard profile ids use `hazard_profile.<slug>`, strict lower-snake-case slug coherence, required `status`, category/severity/exposure/place-posture vocabulary, applicable terrain and season tags, warning signs, mitigation notes, source authority notes, and optional notes/descriptive tags.
- First-pass hazard profiles must not include target refs, place refs, route refs, edge refs, spawn refs, encounter refs, current conditions, runtime effects, travel costs, pathfinding, discovery, UI, storage, commands, events, rewards, services, access, or gameplay fields.
- `world.route_security_profiles` is approved as a separate future descriptive security-posture authority. It should be implemented after hazard vocabulary, with strict `route_security.<slug>` ids and explicit target resolution.
- Route-security targets may resolve only to current `travel_networks.routeRecords[].id`, `travel_networks.interPortShipRoutes[].id`, `world_hex_edges`, `region_localities`, `settlements`, and limited `world_hex` approach/security-zone context. Unsupported routes, route segments, crossings, ports, trade routes, jurisdictions, polities, forces, roads, bridges, ferries, checkpoints, laws, and logistics are forbidden until dedicated authorities exist.
- Route security owns patrol, maintenance, checkpoint, toll, escort, bandit/piracy pressure, conflict disruption, and public reliability posture only. It does not own topology, law/economy mechanics, spawn/encounter behavior, travel runtime, player state, UI, storage, commands, rewards, services, access, or gameplay.
- Hazard target overlays are deferred to a later docs-only decision after hazard vocabulary and route/lane target policy are stable.

## Current Anchor

Latest completed:

- `Version 0.5.242 - Hazard Profile Schema And Validator`

Immediate next:

- `Version 0.5.243 - Route Security Profile Schema And Validator`

## Hazard Profile Validation Result

- Added `packages/schemas/world/hazard-profile.schema.json`.
- Added `tools/content-lint/hazard-profiles.mjs` as a pure in-memory structural and semantic validator helper.
- Added `tests/unit/hazard-profile-validation.test.mjs`.
- Registered the new schema in `tests/unit/schema-files.test.mjs`.
- No `packages/content/base/world/hazard_profiles.json` file was created.
- No hazard target overlay content or schema was created.
- No `packages/schemas/world/route-security-profile.schema.json` file was created.
- No `packages/content/base/world/route_security_profiles.json` file was created.
- No normal content-lint registration was added.
- Current world maps, hexes, hex edges, travel networks, encounter templates, spawn profiles, ecology/biome/climate/habitat/flora/fauna, settlements, and Knowledge travel vocabulary remain current owners.
- `docs/dev/tmp-travel-exploration-systems-research-2026-06-20.md` remains absent.

## Known Test Notes

- `node --test tests\unit\hazard-profile-validation.test.mjs` passes with 131 tests.
- `npm.cmd run tool:content-lint` passes and remains `content-lint: ok (58 files checked)`.
- `node --test tests\unit\schema-files.test.mjs` parses the new hazard-profile schema, then still fails on the unrelated pre-existing Knowledge subject vocabulary assertion around `sacred_site`.
- `git diff --check` passes.
- Conflict-marker scan, trailing-whitespace scan, changed-path scope audit, implementation-scope audit, hazard authority audit, absence audit, and version-tracking audit pass.
- `tests/unit/region-first-world-data.test.mjs` still has the unrelated direct-run BOM parsing issue noted by prior handoffs.

## Next Route

`Version 0.5.243 - Route Security Profile Schema And Validator` is the next queued run. It should use `docs/design/hazard-route-security-schema-decision.md`, stay route-security schema/validator scoped, and avoid live content, normal lint registration, route/crossing/port/trade-route authorities, topology migration, civic/law/economy records, travel runtime, encounter/spawn behavior, UI, storage, commands, events, rewards, services, access, or gameplay behavior.
