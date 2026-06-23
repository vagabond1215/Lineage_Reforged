# Hazard And Route Security Boundary Decision

Version: `Version 0.5.229 - Hazard And Route Security Boundary Decision`

Status: approved documentation-only authority boundary

## 1. Decision Summary

Approve separate future descriptive authorities for `world.route_security_profiles` and `world.hazard_profiles`.

Route security owns authored human, civic, organized-route safety context: patrol presence, maintenance posture, checkpoint/toll posture, escort availability, bandit or piracy pressure, conflict disruption, controlling-authority references after those owners exist, provenance, and notes. Hazard profiles own reusable and targetable non-security hazard identity: environmental, terrain, seasonal, weather-adjacent, exposure, wilderness, navigational, and place/route hazard posture without damage, effects, current conditions, or runtime behavior.

Hazards should use a staged combination model. First create reusable descriptive hazard vocabulary, then allow explicit place or route overlays that reference that vocabulary. Do not duplicate hex hazard tags, ecology/climate pressure, spawn-profile hazard bands, route topology, or encounter generation fields.

`world.travel_networks` remains the transitional route, mode, benchmark, route-record, and inter-port-lane authority through `0.5.x`. `world.world_hexes` remains semantic terrain and exploration-cell authority. `world.world_hex_edges` remains traversal topology and crossing authority. Encounter templates, spawn profiles, civic/law/economy overlays, camp/rest, discovery, Knowledge, runtime, UI, storage, commands, events, rewards, services, access, and gameplay remain separate.

The hazard/security lane should use a combined documentation-only schema decision next, currently queued as `Version 0.5.241 - Hazard And Route Security Schema Decision`. No schema, validator, content, test, runtime, UI, storage, travel, encounter, spawn, or gameplay implementation is approved here.

Historical `0.5.204 - Hazard And Route Security Boundary Decision` labels are remapped history only. This completed pass is `Version 0.5.229`.

## 2. Live Repo Reality

Live inspection found:

- `world.world_maps` has one record with map metadata, scale/profile assumptions, asset paths, four `majorTradeRoutes`, and four broad `conflictZones`.
- `world.world_hexes` has 47 records with region/locality anchors, biome/elevation/terrain/freshwater identity, friction by six travel modes, barrier tags, hazard tags, resource affinity tags, and settlement anchors.
- `world.world_hex_edges` has 49 records with endpoint hex ids, edge type, span, route quality, crossing difficulty, barriers, allowed modes, directions, and corridor names.
- `world.travel_networks` has one `travel_network.first_world` record with six mode profiles, six benchmarks, 12 `routeRecords`, and eight `interPortShipRoutes`.
- Route and lane records already own ids, names, from/to settlements, route class/type, available modes, terrain/feature tags, distances, travel-time estimates, ordered hex ids, edge ids, access requirements, signage, and notes.
- `world.encounter_templates` has six records. `world.spawn_profiles` has five records with region/hex/settlement/site/habitat targeting, hazard-pressure bands, spawn rate, density, hostility weights, movement modes, and encounter weights.
- Environmental authority includes nine regional ecology profiles, 36 biomes, 18 climate profiles, 93 habitats, 117 flora records, and 132 fauna records.
- Hex hazard tags currently include `bandit_risk`, `miasma`, `rockfall`, `weather_risk`, and `wildlife_risk`.
- Edge types currently include `road`, `trail`, `river`, `pass`, `ferry`, and `sea_lane`; route qualities are `medium` and `high`.
- Spawn profile hazard bands currently range from 15-50 through 45-80, and regional ecology profiles expose `simulationProfile.hazardPressure`.
- Knowledge tooling supports `travel_observation` evidence/source vocabulary and `travel_event` source/event vocabulary, but there is no travel, hazard, route-security, discovery-state, or player-journey authority.
- Runtime surfaces already consume hazard pressure for spawn candidate selection and economy/settlement projections. Those consumers do not create static hazard/security authority.
- No `world.route_security_profiles`, `world.hazard_profiles`, route-security schema, hazard-profile schema, camp/rest collection, discovery collection, player travel-state collection, route split, crossing split, port collection, or trade-route collection exists.

## 3. Existing World Map, Hex, Edge, Travel Network, Encounter, Spawn, Ecology, Civic, Economy, Knowledge, Runtime, and UI Surface Inventory

Current ownership remains:

- `world.world_maps` owns display/reference map metadata, asset paths, broad trade-route summaries, and broad conflict-zone summaries.
- `world.world_hexes` owns semantic terrain and exploration-cell descriptors, including current hazard tags.
- `world.world_hex_edges` owns adjacency, edge/crossing type, route quality, crossing difficulty, barriers, allowed modes, and corridor labels.
- `world.travel_networks` owns current travel modes, benchmarks, overland route records, inter-port lanes, distances, estimates, ordered hex/edge chains, and route/lane access descriptors.
- `world.encounter_templates` owns possible encounter composition, disposition, movement, place/habitat scope, and difficulty posture.
- `world.spawn_profiles` owns authored spawn selection envelopes, hazard ranges, rates, density, hostility, movement filters, and encounter weighting.
- Regions, regional ecology profiles, biomes, climate profiles, habitats, flora, and fauna own environmental descriptors and pressure context.
- Settlement records currently own settlement survival models, trade route-access posture, road/harbor/market infrastructure, and local descriptive security/economy notes where already present.
- Civic and polity decisions reserve polities, governments, jurisdictions, laws, forces, conflicts, tolls, enforcement, and diplomacy for separate future owners.
- Economy decisions reserve market state, trade simulation, prices, stock, logistics, taxes, tariffs, tolls, services, and transactions for economy/runtime owners.
- Knowledge owns evidence and source vocabulary only.
- World, civilization, game, and UI runtime surfaces may consume current hazard pressure, spawn candidates, route metadata, and map render data, but they do not define authored route-security or hazard-profile collections.

No current field is renamed, migrated, copied, normalized, or reinterpreted by this decision.

## 4. Route Security Collection Posture

Future `world.route_security_profiles` should be a separate descriptive authority for organized-route safety and civic/human pressure.

Allowed first-pass concepts:

- stable record identity, lifecycle, summary, provenance, and notes;
- supported target references that resolve to existing route/lane, hex-edge, locality, settlement-approach, or later route/crossing/port authorities;
- patrol-presence band;
- maintenance band;
- checkpoint and toll posture as descriptive posture only;
- escort availability band;
- bandit pressure and piracy pressure;
- conflict disruption notes;
- controlling-authority references only after polity, jurisdiction, force, guild, road, port, or logistics owners exist;
- public visibility or reliability notes as descriptive source context.

Route security is not terrain, weather, ecology, spawn selection, encounter composition, guard roster, patrol AI, toll collection, law enforcement, access control, reputation, wanted status, route closure execution, market simulation, or gameplay behavior.

Absence of a route-security profile means no separate authored security overlay exists. Do not infer one from route names, settlement road tiers, map conflict zones, guild presence, bandit hazard tags, spawn-profile hostility, or prose.

## 5. Hazard Profile Collection Posture

Future `world.hazard_profiles` should be separate from route security and should remain descriptive-only.

Use a staged model:

1. Reusable hazard vocabulary records first. A record names a durable hazard identity such as rockfall, miasma, weather exposure, wildlife pressure, thin ice, flood-prone crossing, sandstorm exposure, navigational fog, marsh disease pressure, avalanche risk, or similar non-security danger.
2. Explicit target overlays later. A later overlay posture may attach one or more reusable hazard ids to canonical hexes, edges, map features, routes/lanes, regions/localities, settlements, ecology profiles, biomes, climates, habitats, or future crossings/ports when those targets are supported.

The vocabulary-first stage prevents duplicate text-only hazard definitions across place records. The later target-overlay stage prevents reusable definitions from masquerading as current location-specific conditions.

Allowed first-pass concepts are identity, category, descriptive severity or exposure bands, applicable terrain/season/place posture, warning signs, mitigation context, source authority notes, lifecycle, and notes.

Hazard profiles must not own current weather, damage formulas, condition application, fatigue, supply burn, disease rolls, route closures, encounter selection, spawn weighting, pathfinding cost, player exposure, current danger, current condition, UI state, storage state, commands, events, rewards, or gameplay effects.

## 6. Route Security vs Hazard Profile Boundary

The boundary is source and cause:

- route security covers human, civic, organized, social, political, criminal, or institutional safety context along movement corridors;
- hazard profiles cover non-security environmental, terrain, seasonal, weather-adjacent, exposure, wilderness, or navigation dangers.

Examples:

- bandit pressure, piracy, patrol gaps, checkpoint abuse, escort availability, conflict disruption, road neglect, toll posture, and controlled-route access are route-security concepts.
- rockfall, miasma, storm exposure, flooding, heat, cold, wildlife pressure, marsh illness, cave-in, navigational fog, and treacherous terrain are hazard concepts.

Some words can appear in both layers with different ownership. `bandit_risk` currently exists as a hex hazard tag, but an authored banditry overlay belongs to route security, not hazard profiles. `weather_risk` can remain a hex tag while reusable weather-exposure vocabulary belongs to hazard profiles and current weather snapshots remain runtime-owned.

When a case mixes both, keep two records or references: one security profile for organized danger and one hazard profile for environmental danger. Do not create a combined danger record.

## 7. Candidate Target Models and Reference Boundaries

Route-security targets should fail closed:

- Current allowed candidates for a future first schema decision: `routeRecord.id` values inside `world.travel_networks`, `interPortShipRoutes.id` lane values inside `world.travel_networks`, `world_hex_edge.*`, `world.region_localities`, and `world.settlements`.
- `world.world_hexes` may be allowed only for broad approach/security-zone descriptors when no edge or route/lane target exists; it must not become a substitute for route topology.
- Future `world.routes`, `world.route_segments`, `world.crossings`, `world.ports`, `world.trade_routes`, jurisdictions, polities, guard forces, guilds, and logistics owners may become valid references only after those authorities exist.
- Unsupported route, crossing, port, force, jurisdiction, polity, road, bridge, ferry, or checkpoint strings are forbidden.

Hazard-profile targets should also fail closed:

- First schema decision should start with reusable vocabulary records that do not require targets.
- Later overlays may target existing `world_hex.*`, `world_hex_edge.*`, regions, region localities, settlements, regional ecology profiles, biomes, climate profiles, habitats, and approved semantic `map_feature.*` records after those collections exist.
- Travel route/lane targets may be supported only by resolving existing `route.*` or `lane.*` ids within `world.travel_networks` or later canonical route authorities.
- Spawn profiles may reference hazard vocabulary later if explicitly approved, but hazard profiles must not target spawn profiles as their primary place authority.
- Unsupported route/crossing/port/map-feature strings are forbidden. Do not smuggle missing authorities through notes or tags.

## 8. World Map, Pixel Geometry, Hex, Edge, Travel Network, Route, Lane, Crossing, Port, and Pathfinding Boundary

Preserve `world.world_maps` as display/reference map metadata. Map-level `majorTradeRoutes` and `conflictZones` remain broad summaries, not canonical route-security, hazard, trade-route, conflict, or current-condition authority.

Preserve `world.world_hexes` as semantic terrain and exploration-cell authority. Route-security and hazard overlays must not duplicate hex region/locality anchors, biome/elevation/terrain/freshwater identity, friction, barrier tags, resource affinity, or settlement anchors. Hex hazard tags remain lightweight classification anchors until a later migration is explicitly approved.

Preserve `world.world_hex_edges` as traversal topology and crossing authority. Overlays must not duplicate endpoint topology, allowed modes, edge type, span, route quality, crossing difficulty, barriers, directions, or corridor chains.

Preserve `world.travel_networks` as the transitional route/mode/benchmark/lane authority through `0.5.x`. Do not split it into `world.routes`, `world.route_segments`, `world.crossings`, `world.ports`, `world.trade_routes`, or travel-mode collections in this pass.

Future route-security and hazard records may reference valid route/lane/edge/hex/place ids where approved. They must not own pathfinding output, pathfinding costs, current closures, detours, route availability, ETA, current party location, travel tick, vehicle state, supplies, or journey progress.

## 9. Encounter Template, Spawn Profile, Ecology, Biome, Climate, Weather, Terrain, and Environmental Pressure Boundary

Encounter templates and spawn profiles remain distinct owners.

Route-security and hazard profiles must not duplicate:

- encounter member composition, member counts, roles, dispositions, movement, difficulty, or encounter tags;
- spawn-profile region/hex/settlement/site/habitat targeting;
- spawn rates, density bands, hostility weights, allowed movement modes, encounter weights, or min/max hazard pressure;
- runtime spawn candidates, random selection, cooldowns, positions, encounter outcomes, or combat state.

Ecology, biome, climate, habitat, flora, and fauna records remain environmental descriptors. `regional_ecology_profiles.simulationProfile.hazardPressure`, biome `hazards`, and climate/season data are pressure/context inputs, not full hazard-profile authority. A future hazard vocabulary may reference or align with those descriptors only through explicit validation and without moving their fields.

Weather runtime remains separate. Hazard profiles may describe weather-adjacent exposure vocabulary; they must not store current weather, forecasts, active storms, damage/effect rules, or runtime snapshots.

## 10. Civic, Law, Polity, Conflict, Guard, Patrol, Banditry, Piracy, Toll, Checkpoint, Economy, Guild, Settlement, Trade, and Logistics Boundary

Route security may later reference polities, jurisdictions, laws, guard/public-order forces, guilds, settlement economies, markets, roads, ports, logistics, and conflict overlays only after those authorities exist.

Until then:

- `world.polities` is future political identity only and cannot be inferred from settlements, regions, route names, or map conflict summaries.
- Governments, jurisdictions, law, force, guard, patrol, conflict, toll, customs, tax, access, and enforcement authorities remain future civic/law owners.
- Existing settlement road/harbor/market tiers, trade dependency, domestic trade flows, and guild presence remain settlement/economy descriptors where currently defined.
- Existing map `conflictZones` remain map summaries, not canonical conflict or route-security records.

Route security must not enforce law, collect tolls, alter faction reputation, grant access, run patrol AI, mutate legal/economy state, spawn guards, create bandit/piracy behavior, execute customs checks, change prices, move goods, resolve escorts, or mutate trade/logistics state.

## 11. Camp, Rest, Provision, Survival, Discovery, Map UI, Knowledge, Player Journey, Runtime, Storage, Command, Event, Reward, Service, Access, and Gameplay Boundary

Camp/rest, campsite, waystation, provision, fatigue, hunger, thirst, sleep, healing, morale, disease, supply-burn, shelter, and rest-quality authorities remain separate and deferred. A later decision should decide campsite/rest-site posture before any schema or content work.

Discovery, map reveal, route-known, hazard-known, security-known, route-surveyed, POI-discovered, player-travel events, journey history, and travel UI remain future runtime/save/UI topics in `0.6+`.

Knowledge `travel_observation` and `travel_event` remain evidence/source vocabulary only. They do not establish canonical journey, discovery, hazard-known, route-known, map-reveal, hazard-profile, route-security, route, crossing, or port authority. Future Knowledge subjects require content authorities and a separate subject/schema/registry decision.

Player journey/runtime state owns party location, current route, ETA, elapsed time, travel mode or vehicle state, supplies, fatigue, hunger, thirst, weather snapshots, encounter outcomes, route incidents, discoveries, POI visits, and map reveal. Static route-security and hazard authority must not store or mutate any of those fields.

No service, access, reward, command, event, UI, storage, save-state, migration, or gameplay behavior is approved.

## 12. Overlap, Precedence, and Non-Inference Rules

Use these precedence rules until later schemas refine them:

1. Topology wins over overlays. Hexes, edges, and travel networks define cells, connections, routes, lanes, modes, distances, and estimates.
2. Encounter/spawn owners win over overlays for encounter composition and spawn envelopes.
3. Ecology/biome/climate owners win over overlays for environmental compatibility and pressure descriptors.
4. Civic/law/economy owners win over route security for jurisdictions, law, forces, tolls, taxes, markets, logistics, access, and enforcement.
5. Runtime/save owners win over every static authority for current condition, discovery, journey, weather, incidents, encounters, rewards, and mutation.
6. If a target authority does not exist or a reference cannot be resolved canonically, the future record is invalid.
7. Do not infer hazard/security records from tags, prose, map labels, conflict summaries, route names, settlement type, guild presence, ecology pressure, spawn bands, Knowledge vocabulary, UI labels, or runtime examples.
8. When both security and non-security danger apply to the same place or route, use separate records with explicit references rather than a merged danger record.

Hex hazard tags, ecology hazard pressure, map conflict summaries, spawn profile hazard ranges, settlement survival/trade posture, and future route-security/hazard overlays may coexist only as distinct descriptive layers. None automatically overrides or calculates another.

## 13. Future Schema and Validator Direction

The next hazard/security lane pass should be `Version 0.5.241 - Hazard And Route Security Schema Decision`, a combined documentation-only schema decision.

Use a combined schema decision because the two future authorities must share target-resolution, overlap, forbidden-field, and validation policy while remaining separate collections. That pass should decide exact paths, wrappers, ids, statuses, target model, field vocabulary, overlap rules, and whether the first actual implementation creates one schema at a time or both together.

Provisional future paths remain:

- `packages/content/base/world/route_security_profiles.json`;
- `packages/schemas/world/route-security-profile.schema.json`;
- `packages/content/base/world/hazard_profiles.json`;
- `packages/schemas/world/hazard-profile.schema.json`.

Future validation should enforce:

- strict records-only wrappers and stable ids;
- target resolution against approved current authorities;
- duplicate and overlap rules for route/lane/edge/hex/place targets;
- hazard vocabulary reuse before repeated place-specific descriptions;
- provenance and lifecycle fields;
- descriptive-only posture;
- rejection of topology, encounter/spawn, civic/law/economy execution, runtime, UI, storage, command, event, reward, service, access, and gameplay fields.

No schema, validator, test, loader, normal content-lint registration, or content seed is approved by this decision.

## 14. Temporary Research Artifact Handling

Delete `docs/dev/tmp-travel-exploration-systems-research-2026-06-20.md` in this pass.

Its useful route-security, hazard, graph/hex/pixel, route-mode, camp/rest, economy/logistics, discovery, Knowledge, authored/generated, validation, and sequencing guidance has been promoted into `docs/design/travel-authority-boundary-decision.md`, this decision, `docs/design/pipeline-roadmap-consolidation-decision.md`, and `docs/future_content_backlog.md`.

No named future consumer remains. Future route-security, hazard, camp/rest, route/crossing/port, discovery, Knowledge, and travel-runtime work must start from permanent decisions and a fresh live-repo audit.

## 15. Non-Goals

- no schema files, validators, tests, loaders, normal content-lint registration, or content JSON;
- no route-security records, hazard-profile records, route records, route segments, crossing records, port records, trade-route records, camp/rest records, travel-network records, world-hex records, or world-hex-edge records;
- no encounter-template, spawn-profile, ecology, biome, climate, habitat, flora, fauna, weather, map-feature, Knowledge, civic, law, polity, economy, guild, settlement, combat, quest, Chronicle, item, service, religion, family, household, person/NPC, UI, storage, runtime, or gameplay authority changes;
- no pathfinding, travel-time simulation, route closure, patrol AI, guard spawning, toll collection, law enforcement, bandit/piracy behavior, encounter generation, spawn weighting, weather runtime, survival meters, fatigue, hunger, thirst, camp/rest mechanics, provision consumption, discovery state, map reveal, journey state, party travel, commands, events, rewards, access, migrations, compatibility aliases, new Deep Research, or transition to `0.6.0`.

## 16. Next Recommended Version

Proceed with the existing overall queue: `Version 0.5.230 - Settlement Schema And Validator Hardening`.

The hazard/security lane's next candidate remains conditional and documentation-only: `Version 0.5.241 - Hazard And Route Security Schema Decision`. That future pass should keep `world.route_security_profiles` and `world.hazard_profiles` separate, decide exact schema contracts, and preserve the descriptive-only boundary before any schema, validator, content, or normal lint work is approved.
