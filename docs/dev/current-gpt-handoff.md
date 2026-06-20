# Current GPT Handoff

Source route: Codex local planning through `Version 0.5.203 - Travel Authority Boundary Decision`
Date: 2026-06-20
Branch/status assumption: `master`; latest numbered run is documentation-only after a successful origin fetch and fast-forward pull check.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest numbered Codex handoff.
- `docs/design/travel-authority-boundary-decision.md` is the permanent authority for map/hex/edge/travel-network, route-security, hazard, encounter/spawn, camp/rest, POI/discovery, and player-journey boundaries.
- `docs/dev/tmp-travel-exploration-systems-research-2026-06-20.md` is temporary planning input, not design canon.
- Existing `world.world_maps`, `world.world_hexes`, `world.world_hex_edges`, `world.travel_networks`, `world.encounter_templates`, and `world.spawn_profiles` retain their current owners.
- Pixels are display/reference geometry; hexes are semantic terrain/exploration cells; edges are traversal topology; travel networks are the transitional route/mode/lane bundle through `0.5.x`.
- Existing spawn candidate resolution remains unchanged and must not be duplicated by future hazard/security overlays.
- Economy, family, civic, geography, and religion prerequisites remain owned by their existing boundary decisions.

## Current Anchor

Latest completed numbered run:

- `Version 0.5.203 - Travel Authority Boundary Decision`

Immediate next numbered Codex run:

- `Version 0.5.204 - Hazard And Route Security Boundary Decision`

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.203 Result

- Kept `world.travel_networks` as the transitional route, mode, benchmark, and lane owner through `0.5.x` without splitting it.
- Separated pixel display/reference geometry, semantic hex cells, and edge traversal topology.
- Selected future `world.route_security_profiles` and `world.hazard_profiles` as separate descriptive overlays.
- Kept encounter templates, spawn profiles, route security, and hazard authority distinct while preserving current spawn behavior.
- Deferred camp/rest authority as a later separate descriptive layer.
- Preserved distributed port/crossing/ferry/ford/bridge/pass ownership pending a dedicated semantic feature/route decision.
- Deferred player travel events/journey state, discovery/map reveal, runtime weather, pathfinding, travel simulation, camp/survival state, encounter-generation expansion, and travel UI to `0.6+`.
- Required new first-pass travel authorities to reject runtime, gameplay, player-state, storage, and UI fields.
- Changed no content, schema, validator, test, Knowledge, runtime, UI, storage, or gameplay behavior.

## Next Route Boundary

`Version 0.5.204 - Hazard And Route Security Boundary Decision` should remain documentation-only. It must decide separate overlay target models, reusable-vs-place-specific hazards, route-security scope, overlap/precedence, existing hazard/spawn/civic references, forbidden fields, later schema order, and implementation sequence without creating schemas or content.

The temporary travel research artifact should be deleted after that run if its remaining useful guidance has been promoted; otherwise the handoff must name its next concrete consumer and removal condition.

The displaced `Polity Schema Decision`, `Household vs Family Schema Decision`, deferred `Settlement Economy Schema Decision`, and `World Map Feature Authority Schema Decision` remain valid later roadmap items.
