# Current GPT Handoff

Source version/run: Version 0.5.295 - Service Authority Seed Plan
Date: 2026-07-08

## Status

`Version 0.5.295 - Service Authority Seed Plan` completed as a documentation-only seed plan.

Latest completed primary:

- `Version 0.5.295 - Service Authority Seed Plan`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.296 - Service Authority Seed`

## Service Seed Plan Posture

Seed plan authority:

- `docs/design/service-authority-seed-plan.md`

Current schema/validator support remains:

- Schema: `packages/schemas/civilization/service.schema.json`
- Focused validator/helper: `tools/content-lint/services.mjs`
- Focused tests: `tests/unit/service-authority-validation.test.mjs`
- Schema parse coverage: `tests/unit/schema-files.test.mjs`

No live service content exists yet:

- `packages/content/base/civilization/services.json` remains absent.
- Normal content-lint registration remains absent.
- Existing `civilization.buildings.serviceFunctions` remain source-local descriptors and were not migrated.

## Exact Selected Candidates

The next live seed should create exactly these five planned records:

| Future id | Status | Family | Related building descriptor |
| --- | --- | --- | --- |
| `service.lodging` | `planned` | `lodging` | `lodging` |
| `service.market_exchange` | `planned` | `market_exchange` | `market_exchange` |
| `service.storage_warehouse` | `planned` | `storage_handling` | `storage.warehouse` |
| `service.archives` | `planned` | `archive_record` | `archives` |
| `service.contract_board` | `planned` | `contract_brokerage` | `contract_board` |

Use the exact field values in `docs/design/service-authority-seed-plan.md`.

Do not add `relationshipNotes` in the first live seed. The plan intentionally omits that optional field for all selected records.

## Live-Content Guardrails

`Version 0.5.296 - Service Authority Seed` should be narrow:

- create `packages/content/base/civilization/services.json`;
- add exactly the five selected planned records;
- use the existing schema and focused validator;
- add or update focused tests only if needed for live seed validation;
- prove every `relatedBuildingServiceFunctions` value is observed in current building content;
- keep normal content-lint registration deferred unless explicitly scoped by the prompt.

The live seed must not:

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

`Version 0.5.296 - Service Authority Seed` is the immediate next primary route because `0.5.295` selected exact candidates and found no blocker requiring a readiness follow-up.

Suggested next commit:

`docs(roadmap): plan service authority seed`
