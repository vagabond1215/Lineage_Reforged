# Current GPT Handoff

Source version/run: Version 0.5.294 - Service Authority Schema And Validator
Date: 2026-07-08

## Status

`Version 0.5.294 - Service Authority Schema And Validator` completed as a narrow schema/validator/test implementation.

Latest completed primary:

- `Version 0.5.294 - Service Authority Schema And Validator`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.295 - Service Authority Seed Plan`

## Service Schema / Validator Implementation Posture

Future service vocabulary now has schema and focused validator support:

- Schema: `packages/schemas/civilization/service.schema.json`
- Focused validator/helper: `tools/content-lint/services.mjs`
- Focused tests: `tests/unit/service-authority-validation.test.mjs`
- Schema parse coverage: `tests/unit/schema-files.test.mjs`

Implemented posture:

- `civilization.services` remains future provider-independent vocabulary only.
- Service ids use `service.<slug>`.
- The future content wrapper is records-only.
- Required fields are `id`, `slug`, `name`, `status`, `family`, `summary`, `tags`, `publicPosture`, `providerAnchorTypes`, `allowedOwnerTypes`, `sourceAuthorityNotes`, and `notes`.
- Optional fields are `relatedBuildingServiceFunctions` and `relationshipNotes`.
- `aliases` are not allowed.
- Status vocabulary is `planned`, `active`, and `retired`.
- `providerAnchorTypes` and `allowedOwnerTypes` are type vocabularies only, not concrete provider references.
- `relatedBuildingServiceFunctions` resolves only to observed current building `serviceFunctions` values or explicitly test-approved values supplied to the helper.
- Tags use lower-snake descriptive strings plus validator guardrails against obvious forbidden tag intent; they are not a hard enum in this first schema.
- The validator rejects obvious forbidden state/execution fields, including nested keys.

## Remaining Live-Content Guardrails

No live service content exists yet:

- `packages/content/base/civilization/services.json` remains absent.
- Normal content-lint registration for `civilization.services` remains absent.
- Existing `civilization.buildings.serviceFunctions` remain source-local descriptors and were not migrated.
- First live service records require a separate seed plan with a fresh audit, exact candidates, status choices, field values, and explicit non-execution notes.

The next run must not jump directly to live service content. It should plan the first tiny seed only.

## Remaining Deferred Authority Guardrails

The Highcrown settlement Knowledge lane remains closed from `Version 0.5.285 - Highcrown Settlement Knowledge Lane Closure Review`.

A generic `world.pois` authority remains rejected by `Version 0.5.292 - Discovery And POI Boundary Decision`.

Future `world.resources`, `world.commodities`, and typed status/condition/injury catalog implementation remain deferred behind their own schema plans, fresh live-repo audits, seed plans, and focused implementation prompts.

Provider availability, schedules, access checks, prices, payment, stock, inventory, storage contents, training/healing/repair/lodging effects, route traversal, legal/reputation mutation, UI, runtime, commands, events, rewards, save/account state, and gameplay remain outside static service authority.

## Next Route Guardrail

`Version 0.5.295 - Service Authority Seed Plan` should be docs-first.

Reason: service schema/validator/test support is now in place, but no live service candidates have been selected. The next safe step is to audit current service-like descriptors and choose a tiny provider-independent vocabulary seed before any content file is added.

The next run must not add live service content unless it is explicitly a seed-plan implementation run after this seed plan exists and is accepted.

Suggested next commit:

`feat(content): add service authority schema validator`
