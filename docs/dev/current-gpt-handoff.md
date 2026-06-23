# Current GPT Handoff

Source version/run: Version 0.5.229 - Hazard And Route Security Boundary Decision
Date: 2026-06-22
Status: documentation-only decision completed; no implementation occurred

## Authority Rules

- Future `world.route_security_profiles` and `world.hazard_profiles` are separate descriptive authorities.
- Route security owns human/civic/organized-route safety context: patrol presence, maintenance posture, checkpoint/toll posture, escort availability, bandit/piracy pressure, conflict disruption, controlling-authority references after their owners exist, provenance, and notes.
- Hazard profiles own non-security environmental, terrain, seasonal, weather-adjacent, exposure, wilderness, and navigational hazard identity without damage, effects, current conditions, or runtime behavior.
- Hazard posture is staged: reusable hazard vocabulary first, explicit target overlays later.
- Existing `world.world_maps`, `world.world_hexes`, `world.world_hex_edges`, and `world.travel_networks` retain current map, semantic cell, traversal topology, mode, route, benchmark, route-record, and inter-port-lane authority through `0.5.x`.
- Existing encounter templates and spawn profiles retain encounter composition and spawn-envelope authority. Hazard/security profiles must not duplicate spawn rates, density, hostility, weights, hazard-pressure bands, or encounter generation.
- Civic/law/economy owners retain jurisdictions, laws, forces, patrol execution, tolls, taxes, markets, logistics, access, enforcement, and transactions. Route security may reference those owners only after they exist.
- Camp/rest, provision, survival, discovery, map reveal, Knowledge subjects, player journey state, runtime, UI, storage, commands, events, rewards, services, access, and gameplay remain separate/deferred.
- Missing target authorities fail closed. Do not smuggle unsupported routes, crossings, ports, forces, jurisdictions, or hazards through strings, tags, notes, prose, or Knowledge vocabulary.

## Current Anchor

Latest completed:

- `Version 0.5.229 - Hazard And Route Security Boundary Decision`

Immediate next:

- `Version 0.5.230 - Settlement Schema And Validator Hardening`

## Hazard And Route Security Result

- Added `docs/design/hazard-and-route-security-boundary-decision.md`.
- Confirmed live map/travel reality: one world map, 47 hexes, 49 edges, one travel network with six modes, six benchmarks, 12 routes, eight inter-port lanes, six encounter templates, five spawn profiles, nine ecology profiles, 36 biomes, 18 climate profiles, 93 habitats, 117 flora records, and 132 fauna records.
- Confirmed no live `world.route_security_profiles` or `world.hazard_profiles` collection/schema exists.
- Deleted `docs/dev/tmp-travel-exploration-systems-research-2026-06-20.md` after full promotion; no remaining temporary research artifact consumer exists.
- Historical `0.5.204 - Hazard And Route Security Boundary Decision` labels are remapped history only; current guidance must use `0.5.229`.

## Consolidated Near-Term Queue

1. `0.5.230 - Settlement Schema And Validator Hardening`

The hazard/security lane resumes later at conditional `0.5.241 - Hazard And Route Security Schema Decision`, which remains documentation-only. No new Deep Research is required before `0.5.230`; GPT-DR labels remain non-Codex labels and do not consume `0.5.x` numbers.

## Next Route

`Version 0.5.230 - Settlement Schema And Validator Hardening` is the next queued run in the consolidated roadmap. It must use the existing `0.5.218` settlement identity decision and remain within whatever scope that decision approved.
