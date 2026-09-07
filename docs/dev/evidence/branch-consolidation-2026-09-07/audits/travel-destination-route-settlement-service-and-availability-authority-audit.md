# Travel Destination, Route, Settlement Service, And Availability Authority Audit

Source route: ChatGPT via GitHub Connector

Date: 2026-08-03

Inspected master: `8a0065b7a72a6fc8193b502251e9020a1e4ca360`

Status: `CANDIDATE_INTEGRATION`; connector-only, documentation-only evidence audit; no local tests, builds, typechecks, content lint, travel execution, or balance validation

## Purpose

Separate current destination, route, known-location, settlement, site, service, access, cost, admission, and risk authorities before any travel expansion, rest/service integration, world-map implementation, or representative-loop world claim.

This audit does not authorize new destinations, routes, costs, services, map behavior, discovery rules, travel balance, rest behavior, or content changes.

## Current Classification

`BOUNDED_ENGINE_TRAVEL_COMMAND_EXISTS; DESTINATION_AND_SERVICE INTEGRATION_REMAINS_COMPATIBILITY_SCOPED`

## Current Travel Authority

The current game engine provides:

- a typed travel plan and rejection vocabulary;
- command/result identity and stale-origin/source checks;
- known-destination admission;
- projected body-state timeline;
- deterministic travel ticks and direct resource costs;
- arrival location and current-activity mutation;
- accepted-only UI submission through the campaign mutation gateway.

The current destination facts are held in a bounded hard-coded table in `player-travel-rules.ts`, covering four compatibility destinations. The table includes location, settlement, site, region, map, travel cost, metabolic profile, attribute load, and arrival activity.

## Distinct Wider Authorities

The repository separately contains broader authored authorities for:

- world regions and maps;
- settlements, districts, and sites;
- route and edge records;
- travel modes and transport context;
- services and civic/economic structures;
- known locations and geographic Knowledge;
- map features and visibility/provenance;
- activity, quest, market, and rest presentation.

Those records are not automatically consumed by the bounded travel command.

## Current Boundary Matrix

| Concern | Current live owner | Boundary/gap |
| --- | --- | --- |
| Destination identity | hard-coded engine table | not derived from all authored places |
| Current location | player location mapped to compatibility location ids | unknown authored settlements can become incoherent for this command |
| Known destination | session known-location evidence | not equivalent to geographic Knowledge, map visibility, route knowledge, or service access |
| Route selection | one destination fact with fixed ticks/costs | no authored-route choice, transport mode, condition, closure, or multi-leg plan |
| Travel risk | body/resource projection | no encounter, weather, route hazard, cargo, crew, or interruption owner |
| Arrival | direct location/current-activity result | no service admission, route receipt, or destination occurrence identity beyond travel result |
| World panel | read-only map/list projection plus command dispatch | visual markers are not reveal or travel authority |
| Settlement service | static service records exist | not consumed by travel admission or rest availability |
| Rest availability | UI compatibility check treats recognized destination as settlement rest stop | no exact inn, shelter, bed, meal, water, price, capacity, access, or closure owner |
| Map zoom/selection | local UI state | not route or geographic authority |

## Notable Compatibility Mismatches

- Compatibility location ids and display names do not form a universal authored-place registry.
- `location.saltmere` maps to `settlement.aurelis` and displays `Aurelis`, preserving legacy/compatibility naming rather than one canonical location taxonomy.
- Known-location presence is sufficient for current travel admission, but broader geographic recognition and provenance have separate accepted contracts.
- Rest currently assumes every recognized compatibility destination supplies a secure indoor bunk, meal, and water for a fixed price.
- The world map renders projected locations and travel actions but does not prove authored route connectivity, service availability, or current closure state.

## Minimum Future Expansion Questions

1. Which authored record owns a travel destination?
2. Which route, edge, mode, vehicle, crew, cargo, weather, and hazard facts are required?
3. How are route knowledge, place recognition, map visibility, and destination discovery distinguished?
4. Which service record admits rest, care, lodging, trade, transport, or quest turn-in?
5. How are price, capacity, opening, faction, standing, and access checked?
6. Which occurrence/result records travel completion, interruption, failure, and arrival consequences?
7. How do preview and execution share one authoritative plan?
8. How are duplicate, replay, correction, and copied-artifact cases handled?
9. Which UI facts are projections rather than authority?
10. How does the bounded compatibility table retire or coexist with authored routing?

## Named Consumers

Future work must inspect this audit when it covers:

- destination or route expansion;
- world map or geographic recognition;
- settlement services, lodging, care, or rest admission;
- transport, caravan, cargo, or travel risk;
- known-location or discovery behavior;
- representative-loop or `0.7.0` world integration.

## Review Trigger

Re-review at any package adding destinations, route selection, service availability, travel admission, authored route consumption, or broader world-loop integration.

## Exclusions

No destination, route, settlement, service, map, cost, body/resource rule, source, test, schema, content, UI, active prompt, roadmap, backlog, or branch register changed in this pass.
