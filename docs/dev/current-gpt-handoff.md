# Current GPT Handoff

Source version/run: Version 0.5.291 - Discovery And POI Gate Intake Audit
Date: 2026-07-08

## Status

`Version 0.5.291 - Discovery And POI Gate Intake Audit` completed as a docs-only audit.

The audit found no current generic canonical POI authority such as `world.pois`, `point_of_interest`, or `points_of_interest`. Current POI-like identity is distributed across specific owner collections: settlements, settlement districts, settlement sites, sacred sites, religious hotspots, semantic map features, and future family-specific authorities.

Latest completed primary:

- `Version 0.5.291 - Discovery And POI Gate Intake Audit`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.292 - Discovery And POI Boundary Decision`

## Discovery And POI Intake Posture

`docs/design/discovery-poi-gate-intake-audit.md` is the current intake source for discovery/POI gate posture.

Current posture:

- POI-like authored identity remains descriptors and records on existing or future specific authority families.
- A generic `world.pois` authority remains unapproved.
- Knowledge `discoverySources`, `travel_observation`, and `travel_event` remain possible evidence/source vocabulary only.
- Actual known, discovered, visited, revealed, completed, and map-reveal state belongs to future runtime/save owners, not static world content.
- Existing `knownLocations` and discovery Chronicle surfaces are limited contract/fixture surfaces and must not be treated as a full discovery/map-reveal implementation.

## Deferred Authority Posture

The Highcrown settlement Knowledge lane remains closed from `Version 0.5.285 - Highcrown Settlement Knowledge Lane Closure Review`.

`Version 0.5.287 - Service Authority Boundary Decision` selected a hybrid service model. A future `civilization.services` catalog is justified only in principle for provider-independent identity/vocabulary. It must not own provider availability, access, prices, stock, storage contents, effects, UI, runtime, or gameplay.

`Version 0.5.288 - Resource And Commodity Schema Decision` approved future separate static `world.resources` and `world.commodities` authorities in principle. They must not replace item keys or own prices, stock, item instances, cargo movement, storage contents, service execution, gathering/extraction, trading, crafting execution, runtime, UI, or gameplay.

`Version 0.5.289 - Combat Status Condition And Injury Boundary Decision` approved a future typed, non-executing status/condition/injury vocabulary in principle. It must not own active status instances, stacks, magnitudes, actor references, timers, HP/MP/stamina changes, body-state math, wounds, injury instances, disease/poison exposure, treatment, recovery, scars, death, defeat, save/account state, commands, events, rewards, UI, storage, runtime, or gameplay.

`Version 0.5.290 - Static Authority Validation Consolidation Audit` confirmed those recent static authority lanes remain coherent and deferred.

## Next Route Guardrail

`Version 0.5.292 - Discovery And POI Boundary Decision` should be docs-first.

Reason: the intake found no safe generic POI authority to implement, but it did find enough cross-surface ambiguity to clarify boundaries before any schema or seed route. The next run should define ownership for authored public/hidden/surveyable posture if any, known/discovered/visited/revealed/completed state, map reveal versus Knowledge discovery, route/hex/map-feature/place references, UI marker eligibility, and save/session/account persistence.

It must not implement POI content, discovery state, map reveal, travel behavior, schemas, validators, tests, runtime/UI/storage/commands/events/rewards/migrations/save-account behavior, or gameplay.

Suggested next commit:

`docs(roadmap): audit discovery poi gate posture`
