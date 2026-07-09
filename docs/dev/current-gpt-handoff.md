# Current GPT Handoff

Source version/run: Version 0.5.298 - Service Authority Lint Registration
Date: 2026-07-09

## Status

`Version 0.5.298 - Service Authority Lint Registration` completed as a narrow implementation.

Latest completed primary:

- `Version 0.5.298 - Service Authority Lint Registration`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.299 - Service Authority Post-Registration Audit`

## Service Normal-Lint Registration Posture

Normal content lint now registers the live service seed:

- Live content: `packages/content/base/civilization/services.json`
- Schema: `packages/schemas/civilization/service.schema.json`
- Focused validator/helper: `tools/content-lint/services.mjs`
- Normal registration: `tools/content-lint/index.mjs`
- Focused tests: `tests/unit/service-authority-validation.test.mjs`

Registration details:

- `tools/content-lint/index.mjs` imports `validateServicesContent(...)`.
- The normal `checks` array includes `packages/content/base/civilization/services.json`.
- `validateServicesAgainstDependencies()` loads services, the service schema, and `packages/content/base/civilization/buildings.json`.
- The dependency validator passes `buildingsWrapper.records` into `validateServicesContent(...)`.
- Normal content lint now reports `content-lint: ok (64 files checked)`.

## Live Service Seed Guardrails

The live seed still contains exactly five planned provider-independent service vocabulary records:

| Service id | Status | Family | Related building descriptor |
| --- | --- | --- | --- |
| `service.lodging` | `planned` | `lodging` | `lodging` |
| `service.market_exchange` | `planned` | `market_exchange` | `market_exchange` |
| `service.storage_warehouse` | `planned` | `storage_handling` | `storage.warehouse` |
| `service.archives` | `planned` | `archive_record` | `archives` |
| `service.contract_board` | `planned` | `contract_brokerage` | `contract_board` |

No service records changed during registration. No service schema or service validator behavior changed.

Existing `civilization.buildings.serviceFunctions` remain source-local descriptors and were not migrated. The registration intentionally fails closed if a service `relatedBuildingServiceFunctions` value no longer resolves to an observed building descriptor.

The `service.contract_board` record still uses the neutral tag `charters` instead of the original seed-plan candidate tag `guild` because the focused validator rejects tags containing the forbidden `ui` fragment.

## Remaining Deferred Authority Guardrails

Do not use the registration as permission to add:

- service content expansion;
- provider records;
- provider availability, schedules, access checks, prices, payment, stock, inventory, storage contents, effects, UI, runtime, save/account state, commands, events, rewards, route/travel behavior, legal/reputation behavior, or gameplay;
- building descriptor migration;
- `world.resources`;
- `world.commodities`;
- typed status/condition/injury catalog content;
- generic `world.pois`.

The Highcrown settlement Knowledge lane remains closed from `Version 0.5.285 - Highcrown Settlement Knowledge Lane Closure Review`.

A generic `world.pois` authority remains rejected by `Version 0.5.292 - Discovery And POI Boundary Decision`.

Future `world.resources`, `world.commodities`, and typed status/condition/injury catalog implementation remain deferred behind their own schema plans, fresh live-repo audits, seed plans, and focused implementation prompts.

## Next Route Guardrail

`Version 0.5.299 - Service Authority Post-Registration Audit` is the immediate next primary route.

That next run should be docs-first and should verify that service authority registration is stable before choosing whether to continue service-adjacent planning or return to the next deferred authority lane.

Suggested next commit:

`feat(content-lint): register service authority`
