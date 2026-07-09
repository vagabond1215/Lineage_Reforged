# Current GPT Handoff

Source version/run: Version 0.5.304 - Resource And Commodity Lint Registration Decision
Date: 2026-07-09

## Status

`Version 0.5.304 - Resource And Commodity Lint Registration Decision` completed a docs-only decision for the live resource/commodity seed.

Latest completed primary:

- `Version 0.5.304 - Resource And Commodity Lint Registration Decision`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.305 - Resource And Commodity Lint Registration`

## Decision Posture

Normal content-lint registration is approved in principle for the existing live resource/commodity seed, but implementation remains deferred to the next narrow Codex run.

The implementation should register resources and commodities together because the live seed has peer cross-references:

| Authority | Live id | Related item key | Peer ref |
| --- | --- | --- | --- |
| `world.resources` | `resource.iron_ore` | `iron_ore` | `commodity.iron_ore_lots` |
| `world.resources` | `resource.grain` | `grain_bundle` | `commodity.grain_bundles` |
| `world.commodities` | `commodity.iron_ore_lots` | `iron_ore` | `resource.iron_ore` |
| `world.commodities` | `commodity.grain_bundles` | `grain_bundle` | `resource.grain` |

## Live Resource And Commodity Seed Posture

Live content exists and must remain unchanged unless a future prompt explicitly scopes content work:

- `packages/content/base/world/resources.json`
- `packages/content/base/world/commodities.json`

Implemented support:

- Resource schema: `packages/schemas/world/resource.schema.json`
- Commodity schema: `packages/schemas/world/commodity.schema.json`
- Resource validator: `tools/content-lint/resources.mjs`
- Commodity validator: `tools/content-lint/commodities.mjs`
- Focused live-seed test: `tests/unit/resource-commodity-authority-validation.test.mjs`
- Schema parse coverage: `tests/unit/schema-files.test.mjs`

Focused validation proves:

- both live wrappers validate through `validateResourcesContent(...)` and `validateCommoditiesContent(...)`;
- live resource ids are exactly `resource.grain` and `resource.iron_ore`;
- live commodity ids are exactly `commodity.grain_bundles` and `commodity.iron_ore_lots`;
- every live record status is `planned`;
- selected `relatedItemKeys` resolve through `items.items`;
- selected item keys are not market-only;
- peer resource/commodity cross-refs resolve;
- production-chain, recipe, ecology/geography, and `observedSettlementGoodsTerms` refs remain absent;
- price/value/stock/inventory/cargo/storage/extraction/execution/runtime/UI/save/account/gameplay ownership fields remain absent.

## Next Route Guardrail

`Version 0.5.305 - Resource And Commodity Lint Registration` should be a narrow implementation.

Expected implementation scope:

- edit `tools/content-lint/index.mjs` only if possible;
- import `validateResourcesContent` and `validateCommoditiesContent`;
- load `packages/content/base/world/resources.json`;
- load `packages/content/base/world/commodities.json`;
- load `packages/schemas/world/resource.schema.json`;
- load `packages/schemas/world/commodity.schema.json`;
- supply `items.items`, `civilization.market_item_values`, and peer wrappers to the validators;
- run normal content lint and report the new checked-file count;
- keep live resource/commodity content, schemas, validators, and focused tests unchanged unless a narrow proof issue requires otherwise.

Do not route to:

- broad resource/commodity expansion;
- resource-node modeling;
- gathering/extraction mechanics;
- production/recipe/ecology/geography integration;
- settlement goods normalization;
- prices, stock, cargo/storage execution, trading, crafting execution, service execution, runtime, UI, save/account, or gameplay.

## Remaining Deferred Authority Guardrails

Do not treat normal lint approval as permission to add:

- resource or commodity expansion beyond the four selected records;
- settlement goods normalization;
- item or market migrations;
- ecology integration;
- production/crafting integration;
- service content or service behavior;
- resource-node modeling;
- gathering or extraction mechanics;
- prices, stock, cargo, storage, runtime, UI, save/account state, commands, events, rewards, migrations, or gameplay.

The Highcrown settlement Knowledge lane remains closed from `Version 0.5.285 - Highcrown Settlement Knowledge Lane Closure Review`.

A generic `world.pois` authority remains rejected by `Version 0.5.292 - Discovery And POI Boundary Decision`.

Typed status/condition/injury catalog implementation remains deferred behind its own schema plan, fresh live-repo audit, seed plan, and focused implementation prompt.

## Deep Research / Question / Support-Suffix Posture

No nonstandard support-suffix run is needed before `Version 0.5.305 - Resource And Commodity Lint Registration`.

No explicit user question is required before the next numbered route if the user accepts the decision.

`GPT-DR.resources.gathering-extraction` remains the relevant future Deep Research gate for resource-node, gathering, extraction, agriculture, or broad resource expansion work. It is not required before the immediate lint-registration implementation because the current live seed is descriptive, tiny, planned-only, item-key-backed, and already covered by focused validation.

Suggested next commit:

`docs(content): decide resource commodity lint registration`
