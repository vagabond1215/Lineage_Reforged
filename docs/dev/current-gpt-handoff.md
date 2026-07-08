# Current GPT Handoff

Source version/run: Version 0.5.297 - Service Authority Lint Registration Decision
Date: 2026-07-08

## Status

`Version 0.5.297 - Service Authority Lint Registration Decision` completed as a docs-only decision.

Latest completed primary:

- `Version 0.5.297 - Service Authority Lint Registration Decision`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.298 - Service Authority Lint Registration`

## Service Lint Registration Decision Posture

Decision authority:

- `docs/design/service-authority-lint-registration-decision.md`

Current schema/validator/content support:

- Schema: `packages/schemas/civilization/service.schema.json`
- Focused validator/helper: `tools/content-lint/services.mjs`
- Focused tests: `tests/unit/service-authority-validation.test.mjs`
- Schema parse coverage: `tests/unit/schema-files.test.mjs`
- Live seed content: `packages/content/base/civilization/services.json`

Live service content now exists:

- `packages/content/base/civilization/services.json` contains exactly five planned provider-independent service vocabulary records.
- Normal content-lint registration remains absent.
- Existing `civilization.buildings.serviceFunctions` remain source-local descriptors and were not migrated.

Decision result:

- Normal content-lint registration is approved in principle for the live service seed.
- Registration must happen in a separate narrow implementation run.
- The existing `tools/content-lint/services.mjs` helper is compatible with normal lint orchestration as-is.
- The future registration should load services, the service schema, and `civilization.buildings` and call `validateServicesContent(...)`.
- The future registration should fail closed if `relatedBuildingServiceFunctions` values stop resolving to observed building descriptors.

## Exact Seeded Records

The live seed contains exactly these five planned records:

| Future id | Status | Family | Related building descriptor |
| --- | --- | --- | --- |
| `service.lodging` | `planned` | `lodging` | `lodging` |
| `service.market_exchange` | `planned` | `market_exchange` | `market_exchange` |
| `service.storage_warehouse` | `planned` | `storage_handling` | `storage.warehouse` |
| `service.archives` | `planned` | `archive_record` | `archives` |
| `service.contract_board` | `planned` | `contract_brokerage` | `contract_board` |

The `service.contract_board` record uses the neutral tag `charters` instead of the seed-plan candidate tag `guild` because the existing focused validator rejects any tag containing the forbidden `ui` fragment.

No record defines `relationshipNotes`. No service record should change during registration.

## Next Registration Guardrails

`Version 0.5.298 - Service Authority Lint Registration` should be a narrow implementation.

The next run should:

- edit `tools/content-lint/index.mjs` to register `packages/content/base/civilization/services.json`;
- import and call `validateServicesContent(...)`;
- load `packages/schemas/civilization/service.schema.json`;
- load `packages/content/base/civilization/buildings.json`;
- run normal content lint and focused service validation.

The next run must not:

- migrate or edit `civilization.buildings.serviceFunctions`;
- edit building, workplace, settlement, district, site, route, travel, vendor, shop, market, cargo, or storage records;
- add provider records;
- add provider availability, schedules, access checks, prices, payment, stock, inventory, storage contents, effects, UI, runtime, save/account state, events, rewards, legal/reputation behavior, route/travel behavior, or gameplay;
- reopen Highcrown Knowledge;
- implement generic `world.pois`;
- implement resources, commodities, or combat status/condition/injury vocabulary.

## Remaining Deferred Authority Guardrails

The Highcrown settlement Knowledge lane remains closed from `Version 0.5.285 - Highcrown Settlement Knowledge Lane Closure Review`.

A generic `world.pois` authority remains rejected by `Version 0.5.292 - Discovery And POI Boundary Decision`.

Future `world.resources`, `world.commodities`, and typed status/condition/injury catalog implementation remain deferred behind their own schema plans, fresh live-repo audits, seed plans, and focused implementation prompts.

Provider availability, schedules, access checks, prices, payment, stock, inventory, storage contents, training/healing/repair/lodging effects, route traversal, legal/reputation mutation, UI, runtime, commands, events, rewards, save/account state, and gameplay remain outside static service authority.

## Next Route Guardrail

`Version 0.5.298 - Service Authority Lint Registration` is the immediate next primary route because the service vocabulary seed is live, focused validation passes, and this decision approved normal lint registration in a separate implementation run.

Suggested next commit:

`docs(roadmap): decide service lint registration`
