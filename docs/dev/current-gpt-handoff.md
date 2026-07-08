# Current GPT Handoff

Source version/run: Version 0.5.293 - Service Authority Schema Plan
Date: 2026-07-08

## Status

`Version 0.5.293 - Service Authority Schema Plan` completed as a docs-only plan.

Latest completed primary:

- `Version 0.5.293 - Service Authority Schema Plan`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.294 - Service Authority Schema And Validator`

## Service Authority Schema Posture

`docs/design/service-authority-schema-plan.md` is the current schema-plan source for future service vocabulary.

Current posture:

- A future `civilization.services` vocabulary is planned at `packages/content/base/civilization/services.json`.
- The future schema path is `packages/schemas/civilization/service.schema.json`; the future focused validator path is `tools/content-lint/services.mjs`.
- Planned service ids use `service.<slug>` and a records-only wrapper.
- Required future fields are `id`, `slug`, `name`, `status`, `family`, `summary`, `tags`, `publicPosture`, `providerAnchorTypes`, `allowedOwnerTypes`, `sourceAuthorityNotes`, and `notes`.
- Optional future fields are `relatedBuildingServiceFunctions` and `relationshipNotes`.
- Status vocabulary is `planned`, `active`, and `retired`. Active service records may exist before canonical providers only when they remain pure vocabulary with no provider refs or execution/state fields.
- Existing `civilization.buildings.serviceFunctions` remain source-local descriptors. `relatedBuildingServiceFunctions` may later bridge to observed descriptor strings but must not migrate building records.
- `providerAnchorTypes` and `allowedOwnerTypes` are type vocabularies only. They must not contain concrete provider ids.
- The plan rejects aliases, migration compatibility, provider refs, availability, schedules, access checks, prices, stock, item instances, storage contents, effects, UI, runtime, save/account state, and gameplay fields.
- The first seed still requires a separate seed plan with a fresh live-repo audit and exact candidates.

## Discovery And POI Boundary Posture

`docs/design/discovery-poi-boundary-decision.md` remains the current boundary source for discovery/POI ownership. A generic `world.pois` authority remains rejected for the current roadmap posture. Known/discovered/visited/revealed/completed state, route visibility, map reveal, player-specific marker visibility, quest discovery, encounter/spawn exposure, UI markers, and save/session/account persistence remain outside static authored records.

## Remaining Deferred Authority Guardrails

The Highcrown settlement Knowledge lane remains closed from `Version 0.5.285 - Highcrown Settlement Knowledge Lane Closure Review`.

`Version 0.5.287 - Service Authority Boundary Decision` selected a hybrid service model. `Version 0.5.293 - Service Authority Schema Plan` now defines the future schema posture, but service implementation remains deferred until a focused schema/validator prompt.

`Version 0.5.288 - Resource And Commodity Schema Decision` approved future separate static `world.resources` and `world.commodities` authorities in principle. They must not replace item keys or own prices, stock, item instances, cargo movement, storage contents, service execution, gathering/extraction, trading, crafting execution, runtime, UI, or gameplay.

`Version 0.5.289 - Combat Status Condition And Injury Boundary Decision` approved a future typed, non-executing status/condition/injury vocabulary in principle. It must not own active status instances, stacks, magnitudes, actor references, timers, HP/MP/stamina changes, body-state math, wounds, injury instances, disease/poison exposure, treatment, recovery, scars, death, defeat, save/account state, commands, events, rewards, UI, storage, runtime, or gameplay.

`Version 0.5.290 - Static Authority Validation Consolidation Audit` confirmed those recent static authority lanes remain coherent and deferred.

`Version 0.5.291 - Discovery And POI Gate Intake Audit` found no approved generic POI authority and selected the now-completed boundary decision.

## Next Route Guardrail

`Version 0.5.294 - Service Authority Schema And Validator` should be narrow implementation only.

Reason: service authority was justified in principle in `0.5.287`, and `0.5.293` now resolves the future `civilization.services` schema posture, field list, provider-reference boundaries, forbidden fields, validation expectations, and seed prerequisites.

The next run may implement only the schema, focused pure validator, and focused in-memory tests if explicitly requested. It must not add live service content, normal content-lint registration unless explicitly scoped, runtime/UI/storage/commands/events/rewards/migrations/save-account behavior, provider availability, prices, stock, access checks, effects, or gameplay.

Suggested next commit:

`docs(roadmap): plan service authority schema`
