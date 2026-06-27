# Hazard Route Security Schema Decision

Source version/run: Version 0.5.241 - Hazard And Route Security Schema Decision
Date: 2026-06-27
Status: approved documentation-only schema decision; no schema, validator, content, loader, lint registration, runtime, UI, storage, command, event, reward, or gameplay change

## Decision Summary

Approve two separate future descriptive authorities:

- `world.hazard_profiles` for reusable non-security hazard vocabulary.
- `world.route_security_profiles` for route, lane, edge, locality, settlement, and limited approach-zone security posture.

Implement them in stages, not as one combined schema pass:

1. `world.hazard_profiles` schema and validator first.
2. `world.route_security_profiles` schema and validator second.
3. Explicit hazard target overlays only after target policy and hazard vocabulary validation are stable.

This decision creates no files under `packages/schemas`, no files under `packages/content/base`, no validators, no tests, and no lint registration. It defines the future contracts only.

## Current Repo Reality

The current live owners remain unchanged:

- `packages/content/base/world/world_maps.json` has one records-wrapped map record with broad `majorTradeRoutes` and `conflictZones` summaries. It does not own route security, hazard profiles, target overlays, route topology, or runtime state.
- `packages/content/base/world/world_hexes.json` has 47 semantic hex records with `regionId`, `localityBandId`, `biomeFamily`, `elevationBand`, `terrainType`, `freshwaterType`, `frictionByMode`, `barrierTags`, `hazardTags`, `resourceAffinityTags`, and settlement anchors. Current `hazardTags` are `bandit_risk`, `miasma`, `rockfall`, `weather_risk`, and `wildlife_risk`; these are descriptive tags, not hazard-profile authority.
- `packages/content/base/world/world_hex_edges.json` has 49 traversal edges. Current edge types are `road`, `trail`, `river`, `pass`, `ferry`, and `sea_lane`; route qualities are `medium` and `high`; allowed modes reference the current travel modes. Edges own adjacency and crossing posture, not security or hazard overlay behavior.
- `packages/content/base/world/travel_networks.json` has one records-wrapped travel-network record with six mode profiles, six travel benchmarks, 12 `routeRecords`, and eight `interPortShipRoutes`. It remains the `0.5.x` transitional route, lane, mode, benchmark, and estimate owner.
- `packages/content/base/world/encounter_templates.json` has six encounter templates. It owns encounter composition, disposition, members, movement, regions, habitats, and descriptive tags.
- `packages/content/base/world/spawn_profiles.json` has five spawn profiles with region/hex/settlement/site/habitat targeting, min/max hazard pressure bands, spawn rates, density bands, hostility weights, allowed movement modes, and encounter weighting. It owns spawn selection envelopes and hazard-pressure bands, not reusable hazard identity.
- Ecology, biome, climate, habitat, flora, and fauna content remains descriptive environmental source material. Current counts are nine regional ecology profiles, 36 biomes, 18 climate profiles, 93 habitats, 117 flora records, and 132 fauna records.
- `packages/content/base/world/settlements.json` has 88 settlement records with embedded economy, survival, trade dependency, route access, infrastructure, guild presence, and local notes. Those fields remain settlement-local descriptors until later migration authority exists.
- Knowledge supports `travel_observation` and `travel_event` evidence/source vocabulary. That does not create travel-event state, route-security authority, hazard-profile authority, discovery state, map reveal, or player journey ownership.

No `world.route_security_profiles`, `world.hazard_profiles`, hazard overlay, route, route segment, crossing, port, trade-route, camp/rest, player journey, or travel runtime authority exists today.

## Route Security Profile Contract

Future collection id:

- Logical authority: `world.route_security_profiles`
- Content path: `packages/content/base/world/route_security_profiles.json`
- Schema path: `packages/schemas/world/route-security-profile.schema.json`
- Wrapper: strict object with exactly `records`
- First implementation posture: schema, pure validator, focused tests, and schema-file parse registration only; no live content and no normal content-lint registration until a later seed plan

Identity and lifecycle:

- `id`: required, unique, exact `route_security.<slug>`
- `slug`: required lower snake case, unique, and exactly equal to the suffix of `id`
- `name`: required non-empty display name
- `summary`: required non-empty descriptive summary
- `status`: required enum `planned`, `active`, `retired`
- `sourceAuthorityNotes`: required non-empty string array
- `notes`: optional non-empty string array

Required target shape:

- `primaryTarget`: required object
- `relatedTargets`: optional array of target objects
- Target objects contain:
  - `targetType`
  - `targetId`
  - `targetRole`
  - optional `notes`
- `targetType` first-pass enum:
  - `travel_route`
  - `travel_lane`
  - `world_hex_edge`
  - `region_locality`
  - `settlement`
  - `world_hex`
- `targetRole` first-pass enum:
  - `primary_corridor`
  - `affected_segment`
  - `approach_zone`
  - `local_context`
  - `context_only`

Target resolution policy:

- `travel_route` resolves only to `routeRecords[].id` inside `world.travel_networks`.
- `travel_lane` resolves only to `interPortShipRoutes[].id` inside `world.travel_networks`.
- `world_hex_edge` resolves only to current `world.world_hex_edges` record ids.
- `region_locality` resolves only to current `world.region_localities` record ids.
- `settlement` resolves only to current `world.settlements` record ids.
- `world_hex` resolves only to current `world.world_hexes` record ids and is allowed only for broad approach/security-zone descriptors, never as a route-topology substitute.
- Future routes, route segments, crossings, ports, trade routes, jurisdictions, polities, governments, laws, forces, guilds, logistics records, and dedicated road/bridge/ferry/checkpoint records are not valid target types until those authorities exist and a later decision admits them.

Required security posture:

- `securityPosture`: required object with descriptive posture fields only.
- Required first-pass fields:
  - `patrolPresence`: `none`, `rare`, `intermittent`, `regular`, `strong`
  - `maintenancePosture`: `neglected`, `poor`, `serviceable`, `maintained`, `well_maintained`
  - `checkpointPosture`: `none`, `informal`, `periodic`, `standing`, `contested`
  - `tollPosture`: `none`, `customary`, `formal`, `predatory`, `contested`
  - `escortAvailability`: `none`, `rare`, `seasonal`, `available`, `organized`
  - `banditPressure`: `none`, `low`, `moderate`, `high`, `severe`
  - `piracyPressure`: `none`, `low`, `moderate`, `high`, `severe`
  - `conflictDisruption`: `none`, `low`, `moderate`, `high`, `severe`
  - `publicReliability`: `unreliable`, `strained`, `ordinary`, `reliable`, `secured`
- Optional `descriptiveTags`: duplicate-free lower-snake-case string array.

Duplicate and overlap validation:

- Duplicate `id`, `slug`, and exact target refs are rejected.
- A record cannot use the same `targetType` + `targetId` + `targetRole` more than once.
- First-pass validation should reject multiple non-retired records with the same `primaryTarget.targetType` + `primaryTarget.targetId`.
- Broader contextual overlap is allowed only when explicit: for example, a `region_locality` context record may coexist with a `travel_route` primary record, but it does not override the route record and must not imply unlisted route targets.

Forbidden route-security fields and concepts:

- No routes, route segments, crossings, ports, trade routes, road records, bridge records, ferry records, checkpoint records, patrol units, guard rosters, military forces, jurisdictions, laws, courts, taxes, tariffs, market logistics, cargo, supply, services, access rules, permissions, prices, rewards, encounters, spawns, weather, pathfinding, travel costs, speed, ETA, fatigue, provisions, damage, conditions, current incidents, discovery, visibility, map reveal, player journey state, save state, UI state, commands, events, or gameplay effects.
- No generic free-form target strings, owner names, route names, crossing names, port names, guild names, polity names, force names, or law names as authority substitutes.
- No inference from map prose, conflict-zone prose, route names, settlement type, settlement guild presence, settlement route-access scores, hex hazard tags, edge quality, encounter tags, spawn hazard pressure, Knowledge vocabulary, UI examples, or runtime examples.

## Hazard Profile Contract

Future collection id:

- Logical authority: `world.hazard_profiles`
- Content path: `packages/content/base/world/hazard_profiles.json`
- Schema path: `packages/schemas/world/hazard-profile.schema.json`
- Wrapper: strict object with exactly `records`
- First implementation posture: reusable vocabulary records only, with schema, pure validator, focused tests, and schema-file parse registration; no live content and no normal content-lint registration until a later seed plan

Identity and lifecycle:

- `id`: required, unique, exact `hazard_profile.<slug>`
- `slug`: required lower snake case, unique, and exactly equal to the suffix of `id`
- `name`: required non-empty display name
- `summary`: required non-empty descriptive summary
- `status`: required enum `planned`, `active`, `retired`
- `sourceAuthorityNotes`: required non-empty string array
- `notes`: optional non-empty string array

Required descriptive fields:

- `hazardCategory`: required enum
  - `terrain`
  - `weather_exposure`
  - `hydrology`
  - `wildlife`
  - `disease_exposure`
  - `navigation`
  - `geologic`
  - `seasonal_surface`
  - `toxic_environment`
- `severityBand`: required enum `low`, `moderate`, `high`, `severe`, `variable`
- `exposureBand`: required enum `localized`, `intermittent`, `seasonal`, `persistent`, `widespread`
- `applicableTerrainTags`: required non-empty duplicate-free lower-snake-case string array
- `applicableSeasonTags`: required non-empty duplicate-free enum array using `year_round`, `spring`, `summer`, `autumn`, `winter`, `wet_season`, `dry_season`, `storm_season`, `thaw`, `harvest`
- `applicablePlacePosture`: required enum `localized`, `linear`, `area_like`, `region_wide`, `route_adjacent`, `waterborne`
- `warningSigns`: required non-empty string array
- `mitigationNotes`: required non-empty string array
- Optional `descriptiveTags`: duplicate-free lower-snake-case string array

Vocabulary reuse policy:

- A hazard profile describes one reusable hazard identity, not one placement.
- First-pass `hazard_profiles` must not include `targetRefs`, place ids, route ids, lane ids, edge ids, settlement ids, map-feature ids, region ids, spawn profile ids, encounter template ids, current condition ids, or runtime state ids.
- Slugs and ids must not be place-specific or route-specific, such as suffixing a general hazard with a settlement, region, lane, route, or hex name to bypass missing overlay authority.
- Existing hex `hazardTags`, biome `hazards`, spawn min/max hazard pressure, ecology pressure notes, and Knowledge `travel_observation` vocabulary may inspire authoring language, but none of them becomes a canonical hazard-profile record by inference.

Forbidden hazard fields and concepts:

- No target overlays in the first schema.
- No damage, disease mechanics, weather simulation, current condition, current severity, active incident, encounter table, spawn rate, spawn density, hostility, movement mode filter, pathfinding cost, travel speed, travel time, fatigue, hunger, thirst, supply consumption, resource yield, loot, reward, access, service, command, event, storage, UI, discovery, map reveal, player journey, save state, or gameplay effect fields.
- No free-form place, route, crossing, port, trade-route, ecology, spawn, encounter, biome, climate, or settlement strings as authority substitutes.

## Future Hazard Target Overlay Deferral

Do not add target references to first-pass `world.hazard_profiles`.

The preferred later model is a separate explicit overlay collection rather than overloading reusable vocabulary records. A later decision should name that collection, but it must not be introduced until hazard vocabulary exists and target resolution policy is stable.

Candidate future overlay targets, after explicit approval:

- `world_hex`
- `world_hex_edge`
- `region`
- `region_locality`
- `settlement`
- `regional_ecology_profile`
- `biome`
- `climate_profile`
- `habitat`
- active semantic `map_feature`
- `travel_route` and `travel_lane` only after the route/lane target policy is proven by route-security validation

Spawn profiles may later reference hazard vocabulary if a dedicated spawn/hazard integration decision approves it. Hazard profiles must not target spawn profiles as primary place authority.

## Boundary Between Route Security And Hazards

Route security owns human, civic, organized, or conflict-shaped safety posture on movement corridors and their immediate context. It can describe patrol presence, maintenance posture, checkpoints, toll posture, escort availability, bandit or piracy pressure, conflict disruption, and public reliability.

Hazard profiles own reusable non-security danger vocabulary. They can describe terrain, hydrology, weather exposure, wildlife, disease exposure, navigation, geology, seasonal surface, or toxic environmental hazards without identifying where that hazard is currently active.

If both apply, use separate records. For example, a mountain pass can later have a route-security profile for patrol/checkpoint/bandit posture and a hazard profile vocabulary record for rockfall. Neither record should collapse into the other.

## Precedence And Non-Inference

Precedence rules:

1. Current topology owners win over overlays: `world.world_hex_edges` and `world.travel_networks` define adjacency, lanes, route records, estimates, modes, and chain references.
2. Encounter and spawn owners win for encounter composition and spawn selection envelopes.
3. Ecology, biome, climate, habitat, flora, and fauna owners win for environmental compatibility and pressure descriptors.
4. Civic, law, and economy owners win for jurisdictions, laws, forces, toll/tax mechanics, markets, logistics, access, and enforcement once those authorities exist.
5. Runtime and save owners win for current conditions, discovery, journey state, weather snapshots, incidents, encounters, rewards, mutation, and player effects.
6. Missing or unresolved targets fail closed.

Non-inference rules:

- Do not infer route security from route names, map labels, conflict-zone prose, edge type, route quality, settlement guild presence, settlement route-access values, civic prose, economy prose, or Knowledge source vocabulary.
- Do not infer hazards from hex `hazardTags`, biome `hazards`, ecology notes, spawn hazard pressure, encounter tags, climate prose, map visuals, or player-facing UI examples.
- Do not infer route, crossing, port, trade-route, jurisdiction, polity, force, or law authority from descriptive strings.

## Future Implementation Sequencing

Recommended next implementation:

`Version 0.5.242 - Hazard Profile Schema And Validator`

That pass should add only the future `world.hazard_profiles` schema, isolated pure validator, focused tests, and schema-file parse registration. It should not add live `hazard_profiles.json`, normal content-lint registration, hazard overlays, route-security schema, route-security content, travel runtime, encounter/spawn behavior, UI, storage, commands, events, rewards, or gameplay behavior.

Recommended follow-up:

`Version 0.5.243 - Route Security Profile Schema And Validator`

That pass should add only the future `world.route_security_profiles` schema, isolated pure validator, focused tests, and schema-file parse registration. It should not add live route-security content, normal content-lint registration, route/crossing/port/trade-route authorities, topology migration, civic/law/economy records, travel runtime, encounter/spawn behavior, UI, storage, commands, events, rewards, or gameplay behavior.

Hazard target overlays should remain deferred until both vocabulary and route/lane target validation have landed and a later docs-only overlay decision approves exact target semantics.
