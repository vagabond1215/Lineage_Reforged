# Current GPT Handoff

Source version/run: Version 0.5.292 - Discovery And POI Boundary Decision
Date: 2026-07-08

## Status

`Version 0.5.292 - Discovery And POI Boundary Decision` completed as a docs-only decision.

Latest completed primary:

- `Version 0.5.292 - Discovery And POI Boundary Decision`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.293 - Service Authority Schema Plan`

## Discovery And POI Boundary Posture

`docs/design/discovery-poi-boundary-decision.md` is the current boundary source for discovery/POI ownership.

Current posture:

- POI-like authored identity remains records and descriptors on specific owner families.
- A generic `world.pois` authority remains rejected for the current roadmap posture.
- Static records may describe broad public/hidden/secret/surveyable/rumored/locked/landmark-like posture only when their own authority explicitly allows it.
- Known/discovered/visited/revealed/completed state, route visibility, map reveal, and player-specific marker visibility belong to future runtime/save/session/account owners.
- Knowledge `discoverySources`, `travel_observation`, and `travel_event` remain possible evidence/source vocabulary only.
- Knowledge discovery is evidence/progress/completion, not map reveal.
- Quest/narrative discovery belongs to quest/event/Chronicle/runtime owners, not POI identity.
- Encounter/spawn exposure is context and selection, not POI identity or reveal state.
- UI marker eligibility is derived presentation, not authority.
- Existing `knownLocations`, discovery Chronicle, geographic knowledge, achievement reveal, and UI discovery surfaces are limited current runtime/session/player/account surfaces, not a complete generic discovery/map-reveal implementation.

## Remaining Deferred Authority Guardrails

The Highcrown settlement Knowledge lane remains closed from `Version 0.5.285 - Highcrown Settlement Knowledge Lane Closure Review`.

`Version 0.5.287 - Service Authority Boundary Decision` selected a hybrid service model. A future `civilization.services` catalog is justified only in principle for provider-independent identity/vocabulary. It must not own provider availability, access, prices, stock, storage contents, effects, UI, runtime, or gameplay.

`Version 0.5.288 - Resource And Commodity Schema Decision` approved future separate static `world.resources` and `world.commodities` authorities in principle. They must not replace item keys or own prices, stock, item instances, cargo movement, storage contents, service execution, gathering/extraction, trading, crafting execution, runtime, UI, or gameplay.

`Version 0.5.289 - Combat Status Condition And Injury Boundary Decision` approved a future typed, non-executing status/condition/injury vocabulary in principle. It must not own active status instances, stacks, magnitudes, actor references, timers, HP/MP/stamina changes, body-state math, wounds, injury instances, disease/poison exposure, treatment, recovery, scars, death, defeat, save/account state, commands, events, rewards, UI, storage, runtime, or gameplay.

`Version 0.5.290 - Static Authority Validation Consolidation Audit` confirmed those recent static authority lanes remain coherent and deferred.

`Version 0.5.291 - Discovery And POI Gate Intake Audit` found no approved generic POI authority and selected the now-completed boundary decision.

## Next Route Guardrail

`Version 0.5.293 - Service Authority Schema Plan` should be docs-first.

Reason: discovery/POI now has a completed intake audit and boundary decision, and `world.pois` remains rejected for the current roadmap. The next backlog gate is services. Service authority was justified in principle in `0.5.287`, but a future `civilization.services` vocabulary still requires a separate schema plan, fresh live-repo audit, and seed plan before any implementation.

The next run must not implement service content, schemas, validators, tests, runtime/UI/storage/commands/events/rewards/migrations/save-account behavior, provider availability, prices, stock, access checks, effects, or gameplay.

Suggested next commit:

`docs(roadmap): decide discovery poi boundary`
