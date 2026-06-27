# Current GPT Handoff

Source version/run: Version 0.5.241 - Hazard And Route Security Schema Decision
Date: 2026-06-27
Status: documentation-only hazard and route-security schema decision completed; no schema, validator, test, live content, normal content-lint registration, route topology mutation, travel runtime, encounter/spawn behavior, UI, storage, commands, events, rewards, services, access, or gameplay change

## Authority Rules

- `world.hazard_profiles` is approved as future reusable non-security hazard vocabulary only. First implementation should be schema, pure validator, focused tests, and schema-file parse registration with no live content and no normal content-lint registration.
- Hazard profile ids must use `hazard_profile.<slug>`, strict lower-snake-case slug coherence, required `status`, category/severity/exposure/place-posture vocabulary, applicable terrain and season tags, warning signs, mitigation notes, source authority notes, and descriptive notes.
- First-pass hazard profiles must not include target refs, place refs, route refs, edge refs, spawn refs, encounter refs, current conditions, runtime effects, travel costs, pathfinding, discovery, UI, storage, commands, events, rewards, services, access, or gameplay fields.
- `world.route_security_profiles` is approved as a separate future descriptive security-posture authority. It should be implemented after hazard vocabulary, with strict `route_security.<slug>` ids and explicit target resolution.
- Route-security targets may resolve only to current `travel_networks.routeRecords[].id`, `travel_networks.interPortShipRoutes[].id`, `world_hex_edges`, `region_localities`, `settlements`, and limited `world_hex` approach/security-zone context. Unsupported routes, route segments, crossings, ports, trade routes, jurisdictions, polities, forces, roads, bridges, ferries, checkpoints, laws, and logistics are forbidden until dedicated authorities exist.
- Route security owns patrol, maintenance, checkpoint, toll, escort, bandit/piracy pressure, conflict disruption, and public reliability posture only. It does not own topology, law/economy mechanics, spawn/encounter behavior, travel runtime, player state, UI, storage, commands, rewards, services, access, or gameplay.
- Hazard target overlays are deferred to a later docs-only decision after hazard vocabulary and route/lane target policy are stable.

## Current Anchor

Latest completed:

- `Version 0.5.241 - Hazard And Route Security Schema Decision`

Immediate next:

- `Version 0.5.242 - Hazard Profile Schema And Validator`

## Hazard / Route Security Decision Result

- Added `docs/design/hazard-route-security-schema-decision.md`.
- Selected staged implementation: hazard profile schema/validator first, route-security profile schema/validator second, hazard target overlays later.
- No `packages/schemas/world/hazard-profile.schema.json` file was created.
- No `packages/schemas/world/route-security-profile.schema.json` file was created.
- No `packages/content/base/world/hazard_profiles.json` or `packages/content/base/world/route_security_profiles.json` file was created.
- No normal content-lint registration was added.
- Current world maps, hexes, hex edges, travel networks, encounter templates, spawn profiles, ecology/biome/climate/habitat/flora/fauna, settlements, and Knowledge travel vocabulary remain current owners.
- `docs/dev/tmp-travel-exploration-systems-research-2026-06-20.md` remains absent.

## Known Test Notes

- `git diff --check` passes.
- Conflict-marker scan, trailing-whitespace scan, documentation scope audit, forbidden implementation audit, separate-authority audit, temp-artifact audit, and version-tracking audit pass.
- `node --test tests\unit\schema-files.test.mjs` was not rerun because no schema changed; it still has the unrelated pre-existing Knowledge subject vocabulary assertion around `sacred_site`.
- `tests/unit/region-first-world-data.test.mjs` still has the unrelated direct-run BOM parsing issue noted by prior handoffs.

## Next Route

`Version 0.5.242 - Hazard Profile Schema And Validator` is the next queued run. It should use `docs/design/hazard-route-security-schema-decision.md`, stay target-free hazard vocabulary scoped, and avoid live content, normal lint registration, hazard overlays, route security, route topology mutation, travel runtime, encounter/spawn behavior, UI, storage, commands, events, rewards, services, access, or gameplay behavior.
