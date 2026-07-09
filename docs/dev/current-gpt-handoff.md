# Current GPT Handoff

Source version/run: Version 0.5.300 - Resource And Commodity Authority Schema Plan
Date: 2026-07-09

## Status

`Version 0.5.300 - Resource And Commodity Authority Schema Plan` completed as a documentation-only schema plan.

Latest completed primary:

- `Version 0.5.300 - Resource And Commodity Authority Schema Plan`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.301 - Resource And Commodity Schema And Validator`

## Resource And Commodity Plan Posture

The resource/commodity schema plan lives at:

- `docs/design/resource-commodity-authority-schema-plan.md`

The plan selects separate future static authorities:

- `world.resources`
- `world.commodities`

Future content paths:

- `packages/content/base/world/resources.json`
- `packages/content/base/world/commodities.json`

Future schema paths:

- `packages/schemas/world/resource.schema.json`
- `packages/schemas/world/commodity.schema.json`

Future focused validator paths:

- `tools/content-lint/resources.mjs`
- `tools/content-lint/commodities.mjs`

The first implementation should be `Version 0.5.301 - Resource And Commodity Schema And Validator`, limited to schemas, pure focused validators, focused tests, and schema-file parse coverage. It should not add live `resources.json` or `commodities.json` content and should not register normal content lint.

Key boundaries:

- `items.items` remains canonical item-key authority.
- Resource/commodity `relatedItemKeys` must resolve to `items.items`, not market-only keys.
- `civilization.market_item_values` remains value/pricing owner.
- Resources describe source-material identity and environmental/source compatibility vocabulary.
- Commodities describe bulk trade/economic-class identity.
- Settlement goods, domestic resource descriptors, world hex resource-affinity tags, production `extract.*` refs, ecology descriptors, service vocabulary, markets, vendors, cargo, storage, and runtime economy state remain with their current or future owner layers.

Forbidden for resource/commodity records:

- prices, base values, value profiles, pricing profiles, demand bands, stock, supply, demand, pressure, vendor/shop inventory, cargo contents, storage contents, item instances, quantities, ownership, depletion, respawn, harvest rolls, extraction rates, skill/tool checks, access checks, effects, commands, events, rewards, UI, runtime, save/account state, and gameplay.

## Service Authority Posture

The live `civilization.services` lane is stable after normal content-lint registration.

Current service authority files:

- Live content: `packages/content/base/civilization/services.json`
- Schema: `packages/schemas/civilization/service.schema.json`
- Focused validator/helper: `tools/content-lint/services.mjs`
- Normal registration: `tools/content-lint/index.mjs`
- Focused tests: `tests/unit/service-authority-validation.test.mjs`

Registration posture:

- `tools/content-lint/index.mjs` imports `validateServicesContent(...)`.
- The normal `checks` array includes `packages/content/base/civilization/services.json` exactly once.
- The service dependency validator loads services, the service schema, and `packages/content/base/civilization/buildings.json`.
- The dependency validator passes `buildingsWrapper.records` into `validateServicesContent(...)`.
- Normal content lint reports `content-lint: ok (64 files checked)`.

The live seed still contains exactly five planned provider-independent service vocabulary records:

| Service id | Status | Family | Related building descriptor |
| --- | --- | --- | --- |
| `service.lodging` | `planned` | `lodging` | `lodging` |
| `service.market_exchange` | `planned` | `market_exchange` | `market_exchange` |
| `service.storage_warehouse` | `planned` | `storage_handling` | `storage.warehouse` |
| `service.archives` | `planned` | `archive_record` | `archives` |
| `service.contract_board` | `planned` | `contract_brokerage` | `contract_board` |

The `service.contract_board` tag `charters` remains intentional. It avoids the forbidden `ui` fragment in `guild` while preserving neutral charter/contract-board meaning.

No service content expansion, service schema change, validator change, building descriptor migration, provider modeling, runtime, UI, save/account, or gameplay work is needed immediately.

## Remaining Deferred Authority Guardrails

Do not treat the stable service lane as permission to add:

- service content expansion;
- provider records;
- provider availability, schedules, access checks, prices, payment, stock, inventory, storage contents, effects, UI, runtime, save/account state, commands, events, rewards, route/travel behavior, legal/reputation behavior, or gameplay;
- building descriptor migration;
- generic `world.pois`;
- typed status/condition/injury catalog content.

The Highcrown settlement Knowledge lane remains closed from `Version 0.5.285 - Highcrown Settlement Knowledge Lane Closure Review`.

A generic `world.pois` authority remains rejected by `Version 0.5.292 - Discovery And POI Boundary Decision`.

Typed status/condition/injury catalog implementation remains deferred behind its own schema plan, fresh live-repo audit, seed plan, and focused implementation prompt.

## Next Route Guardrail

`Version 0.5.301 - Resource And Commodity Schema And Validator` is the immediate next primary route.

That run should implement only the future `world.resources` and `world.commodities` schemas, pure focused validators, focused tests, and schema-file parse coverage described in `docs/design/resource-commodity-authority-schema-plan.md`.

It should not implement resource or commodity live content, normal lint registration, runtime, UI, save/account behavior, storage, commands, events, rewards, migrations, prices, stock, cargo, gathering, trading, crafting execution, service execution, or gameplay.

## Deep Research And Support-Suffix Posture

No nonstandard support-suffix run is needed before `Version 0.5.301 - Resource And Commodity Schema And Validator`.

`GPT-DR.resources.gathering-extraction` is the relevant future Deep Research gate for deeper resource/gathering/extraction work. It does not need to run before `0.5.301` because the 0.5.300 schema plan is sufficient for a schema/validator-only pass. If a later run selects that gate, use ChatGPT Deep Research, artifact pattern `docs/dev/tmp-resources-gathering-extraction-research-YYYY-MM-DD.md`, and a named Codex integration consumer.

No explicit user question is required before proceeding to the selected next numbered route.

Suggested next commit:

`docs(roadmap): plan resource commodity authority schemas`
