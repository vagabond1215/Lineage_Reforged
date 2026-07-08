# Current GPT Handoff

Source version/run: Version 0.5.296 - Service Authority Seed
Date: 2026-07-08

## Status

`Version 0.5.296 - Service Authority Seed` completed as a narrow live-content seed.

Latest completed primary:

- `Version 0.5.296 - Service Authority Seed`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.297 - Service Authority Lint Registration Decision`

## Service Seed Posture

Seed plan authority:

- `docs/design/service-authority-seed-plan.md`

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

No record defines `relationshipNotes`.

## Next Lint Decision Guardrails

`Version 0.5.297 - Service Authority Lint Registration Decision` should be docs-first unless the prompt explicitly scopes implementation.

The next run should decide whether and when to register `packages/content/base/civilization/services.json` in normal content lint, including expected validation command coverage and any risk from promoting focused validation into the standard lint surface.

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

`Version 0.5.297 - Service Authority Lint Registration Decision` is the immediate next primary route because the service vocabulary seed is now live but intentionally remains outside normal content lint.

Suggested next commit:

`feat(content): seed service authority vocabulary`
