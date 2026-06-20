# Travel Authority Boundary Decision

Version: `Version 0.5.203 - Travel Authority Boundary Decision`

Status: approved documentation-only authority boundary

## 1. Decision Summary

Preserve the live world-map, hex, edge, travel-network, encounter-template, and spawn-profile owners. Keep `world.travel_networks` as the transitional route, mode, benchmark, and lane authority through `0.5.x`; do not split it without a later dedicated schema decision.

Explicitly separate pixel, hex, and graph responsibilities. Prefer future `world.route_security_profiles` and `world.hazard_profiles` as separate descriptive overlays, distinct from each other and from encounter/spawn authority. Camp/rest authority is deferred as a later separate descriptive layer.

Player travel events, journey state, discovery state, map reveal, runtime weather, pathfinding, travel simulation, camping/survival state, encounter generation expansion, and travel UI remain deferred to `0.6+`. New first-pass travel authorities must reject runtime, gameplay, player-state, storage, and UI fields.

This document consumes `docs/dev/tmp-travel-exploration-systems-research-2026-06-20.md` as planning input, corrects it against the live repository, and does not make that temporary artifact canon.

## 2. Live Repo Reality

The live repository already has substantial travel authority and validation:

- `world.world_maps` defines the world display frame, scale/reference geometry, layer assets, region groupings, population/density summaries, and broad embedded trade-route/conflict-zone summaries.
- `world.world_hexes` defines semantic terrain cells with region/locality anchors, biome/elevation/terrain/freshwater identity, habitability, mode friction, barriers, hazards, resources, and settlement anchors.
- `world.world_hex_edges` defines connections between hexes, edge/crossing type, span, quality, difficulty, barriers, allowed travel modes, directions, and corridor names.
- `world.travel_networks` currently bundles mode profiles, travel benchmarks, terrain/feature variance rules, route records, and inter-port ship routes.
- semantic lint already checks travel map references, endpoints, mode references, route distances, ordered hex/edge chains, settlement hex anchors, edge continuity, and coastal-harbor constraints for sea routes and lanes.
- `world.encounter_templates` defines encounter compositions and scope; `world.spawn_profiles` defines region/hex/settlement/site/habitat targeting, hazard ranges, rates, density, hostility, movement, and encounter weighting. Existing engine/test behavior already consumes spawn profiles to resolve encounter candidates.
- Knowledge already uses `travel_observation` evidence and includes `travel_event` as source/event vocabulary. Those vocabularies do not establish a canonical player journey or travel-event state owner.

There is no separate route-security, hazard-profile, camp/rest, travel, exploration, encounter, survival, or journey-state content directory. Proposed new collections remain future authorities.

## 3. Travel Authority Ownership Boundary

Travel authority is layered:

- world maps own display/reference space;
- hexes own semantic terrain and exploration-cell identity;
- hex edges own traversal topology and crossing semantics;
- travel networks own current route/mode/lane bundles;
- route-security overlays describe civic and human security context;
- hazard profiles describe reusable non-security hazard identity;
- encounter templates and spawn profiles retain encounter composition and selection-envelope ownership;
- future camps/rest sites and POIs own authored stopping/discovery identities;
- future player/runtime state owns actual journeys, discoveries, events, consumption, conditions, and reveal.

Graph-first travel and hex-first exploration are complementary. Cross-references do not transfer authority, and no new descriptive overlay may execute another layer's behavior.

## 4. World Map / Pixel Geometry Boundary

For travel authority, `world.world_maps` owns display-scale placement and authoring/reference geometry only. Pixels, asset rectangles, scale conversions, layer assets, labels, markers, and route polylines may support display or authored alignment; they are not traversal topology, pathfinding nodes, player position, or simulation truth.

Existing map-level `majorTradeRoutes` and `conflictZones` remain broad legacy summaries. They are not canonical travel routes, route-security profiles, hazards, civic conflicts, or mutable conditions, and this decision does not migrate or remove them.

Travel runtime must not infer authoritative connectivity from pixel proximity or drawn lines.

## 5. World Hex Boundary

`world.world_hexes` owns semantic terrain and exploration cells. Its current biome, elevation, terrain, freshwater, habitability, friction, barrier, hazard-tag, resource-affinity, and settlement-anchor fields remain canonical for that cell-level meaning.

Hex hazard tags are classification anchors, not full hazard profiles, encounter instructions, current weather, current danger, discovery flags, route security, player position, or survival state. Hexes must not absorb named route identity or duplicate edge topology.

Hex-first exploration means future discovery/hazard/foraging overlays may target hexes; it does not authorize player discovery state or exploration runtime in `0.5.x`.

## 6. World Hex Edge / Traversal Graph Boundary

`world.world_hex_edges` owns traversal topology between semantic cells. It remains the canonical owner for endpoint connection, edge/crossing type, span, route quality, crossing difficulty, barrier/terrain/feature context, allowed travel modes, directions, and corridor label.

Edges answer whether and how two cells connect. They do not own named end-to-end route identity, route-wide security, reusable hazards, live closures, toll collection, patrols, encounter spawning, pathfinding results, or player traversal state.

Future graph validation may strengthen chain and directional coherence, but no edge-schema or validator change is authorized here.

## 7. Travel Network / Route / Lane Boundary

`world.travel_networks` remains the transitional route, travel-mode, benchmark, variance-rule, overland-route, and inter-port-lane authority through `0.5.x`.

The current bundled shape is broad but already coherent with live semantic lint. Do not split it into `world.routes`, route segments, crossings, ports, trade routes, or travel-mode collections until a dedicated schema decision reconciles the geography boundary, current route and lane records, settlement harbor authority, hex edges, and consumers.

Route records own named corridor/endpoints, ordered hex/edge references, available modes, authored distance, and existing estimate metadata. Inter-port ship routes own current maritime lane records. Neither owns current party movement, pathfinding output, route condition mutation, security enforcement, hazards, random encounters, supplies, weather, discovery, or UI state.

## 8. Route Security Overlay Boundary

Future `world.route_security_profiles` should be a separate descriptive overlay. It may eventually target supported route, edge, locality, settlement approach, crossing, or lane authorities and describe patrol-presence, maintenance, checkpoint/toll posture, escort availability, bandit/piracy pressure, conflict disruption, controlling-authority references, provenance, and notes.

Route security is human/civic access and safety context. It is not terrain/climate hazard identity, encounter composition, spawn weighting, live route condition, guard roster, law enforcement, toll collection, faction reputation, wanted state, patrol AI, or combat behavior.

The exact target model and overlap/precedence rules require a dedicated boundary decision before a route-security schema.

## 9. Hazard Profile Boundary

Future `world.hazard_profiles` should be separate from route security, hex hazard tags, ecology/climate pressure, encounter templates, and spawn profiles.

A hazard profile may define a reusable descriptive hazard identity, category, severity/exposure bands, applicable terrain/season/place anchors, warning signs, mitigation context, provenance, and notes. It must not own current weather, damage, condition application, fatigue, supply burn, encounter selection, route closure, player exposure, or gameplay effects.

The next boundary pass must decide whether profiles are reusable vocabulary, place/route overlays, or a staged combination and how they reference existing hazard tags/pressure without duplicating them.

## 10. Encounter Template and Spawn Profile Boundary

Keep `world.encounter_templates` and `world.spawn_profiles` distinct from each other and from route danger/security.

- encounter templates own what encounter composition can appear, including members, disposition, movement, difficulty, scope, and tags;
- spawn profiles own where and under which authored envelope encounter templates are candidates, including current hazard ranges, rates, density, hostility, movement, and weights;
- route security and hazard profiles may later provide descriptive context but must not duplicate template composition or spawn selection fields.

Live spawn candidate resolution already exists and is unchanged. This decision neither removes that behavior nor authorizes encounter-generation expansion, route-triggered spawning, travel events, or new runtime coupling.

## 11. Camp, Rest, Provision, and Survival Boundary

Camp/rest authority is deferred and should later be planned as a separate descriptive layer rather than embedded in routes, hazards, encounter templates, or player state.

A future campsite/rest-site authority may describe place/hex/route anchors, shelter, water/fire suitability, exposure, capacity, restrictions, safety posture, provenance, and notes. Existing items and economy/crafting authorities retain provisions, consumables, equipment, production, and value ownership.

No `0.5.x` travel authority may track fatigue, hunger, thirst, sleep, healing, morale, disease, camp inventory, provision consumption, supply burn, rest timers, occupancy, or survival effects. Camp mechanics and survival meters remain deferred to `0.6+`.

## 12. Port, Crossing, Ferry, Ford, Bridge, and Pass Boundary

Current ownership remains distributed and must be preserved:

- settlements own existing harbor/coastal place descriptors;
- hex edges own traversal crossing types such as pass and ferry plus difficulty and allowed modes;
- travel networks own current inter-port ship lanes and route corridor identity;
- map features and place content retain visual/semantic geographic descriptions where already present.

Future canonical ports, crossings, ferries, fords, bridges, locks, straits, and passes require a dedicated semantic-feature/route decision. They must reference rather than replace edge topology or settlement identity. No new authority may be inferred solely from prose, tags, pixels, or a corridor name.

## 13. Economy, Civic, Religion, and Family Integration Boundary

Travel authorities may later reference economy-owned markets, goods, logistics, guilds, workplaces, or settlement-economy profiles; civic-owned polities, jurisdictions, laws, checkpoints, forces, or conflicts; religion-owned faiths, hotspots, sacred sites, or pilgrimage context; and family-owned households, estates, or lineage actors after those authorities exist.

Travel content must not calculate prices, freight, supply burn, taxes, tariffs, tolls, customs, access, reputation, legal status, patrol/enforcement behavior, religious favor, pilgrimage rewards, family movement, inheritance, party composition, or household migration. Adjacent boundary decisions retain ownership.

## 14. Discovery, Map UI, and Knowledge Integration Boundary

Discovery state and map reveal are future player/runtime state, not authored world authority. Authored records may later expose stable public/hidden/surveyable posture, but must not store whether a player has seen, visited, revealed, or completed them.

Knowledge `travel_observation` and `travel_event` vocabulary remains evidence/source vocabulary only. It does not prove a canonical route, hazard, security, campsite, POI, journey, or travel-event collection. Future Knowledge subjects require a dedicated decision after their content authorities exist.

No travel authority may reveal maps, unlock routes, grant safe passage, prevent encounters, alter movement, award exploration rewards, mutate Knowledge progress, or own map/travel UI.

## 15. Player Journey State Boundary

Player-owned `travel_event` records, journey plans/history, party location, path, elapsed time, ETA, mode/vehicle state, provisions, fatigue, hunger/thirst, camp state, encounter outcomes, weather snapshots, discoveries, POI visits, and map reveal belong to future runtime/save owners in `0.6+`.

Authored routes, hexes, edges, hazards, security, camps, and POIs are inputs to those future systems, not mutable containers for player state. Knowledge event ids or observations must not be treated as persisted journey authority.

## 16. First Implementation Candidate

No new schema is approved directly by this boundary document. The next candidate is a documentation-only `Hazard And Route Security Boundary Decision`.

That pass comes before a route-security or hazard schema because the live repo already distributes danger context across hex hazard tags, regional/ecology hazard pressure, map conflict summaries, encounter/spawn fields, travel routes, settlements, and future civic overlays. It must decide exact target models, reuse vs place-specific records, overlap/precedence, and reference ownership first.

Existing `world.travel_networks`, hexes, edges, encounter templates, and spawn profiles remain the current implemented authorities and are not migration targets in this pass.

## 17. Future Validation Direction

Later decisions may authorize narrowly staged validation that should eventually enforce:

1. preservation of current strict records wrappers and canonical ids;
2. valid map, region, locality, settlement, hex, edge, route, lane, encounter, and spawn references;
3. coherent ordered route hex/edge chains and endpoint anchors;
4. compatible edge/crossing types and allowed modes;
5. route-security target validity, overlap, precedence, provenance, and descriptive-only posture;
6. hazard-profile identity, tag/pressure reference boundaries, target validity, overlap, season/place coherence, and descriptive-only posture;
7. no duplication of encounter composition or spawn envelope fields in security/hazard records;
8. camp/rest and POI references only after their authorities exist;
9. no inference from pixels, prose, tags, Knowledge vocabulary, or map summaries where canonical references are required;
10. rejection of pathfinding, current position, travel tick, current condition/supplies, weather runtime, encounter execution, discovery/reveal, player journey, storage, UI, command, event, reward, or gameplay fields in new descriptive authorities.

No schema, validator, test, content, or content-lint change is authorized by this decision.

## 18. Temporary Research Artifact Handling

`docs/dev/tmp-travel-exploration-systems-research-2026-06-20.md` was consumed as planning input and remains temporary, not final canon.

Keep it through the next hazard/security boundary pass because it contains candidate fields and later camp/rest, POI, discovery, Knowledge, provision, party, and journey questions not fully promoted here. That pass must delete it if all useful guidance is promoted, or retain it only with a named next concrete consumer and removal condition.

## 19. Non-Goals

- no schema, validator, content JSON, test, Knowledge registry, or snippet changes;
- no economy, family, civic, geography, or religion authority changes;
- no runtime system, UI, storage, pathfinding, travel-time simulation, weather runtime, party travel, command, event, reward, or gameplay behavior;
- no survival meter, fatigue, hunger, thirst, camp, rest, provision-consumption, encounter-spawning, route-danger mutation, discovery-state, or map-reveal mechanics;
- no migration, compatibility alias, collection split, data rename, or transition to `0.6.0`.

## 20. Next Recommended Version

`Version 0.5.204 - Hazard And Route Security Boundary Decision`

That run should remain documentation-only and decide separate overlay target models, reusable-vs-place-specific hazard authority, route-security scope, overlap/precedence, current hazard/spawn/civic reference boundaries, forbidden fields, later schema order, and temporary-artifact cleanup without implementation.
