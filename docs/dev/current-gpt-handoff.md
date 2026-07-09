# Current GPT Handoff

Source version/run: Version 0.5.301 - Resource And Commodity Schema And Validator
Date: 2026-07-09

## Status

`Version 0.5.301 - Resource And Commodity Schema And Validator` completed as a schema/validator/test implementation only.

Latest completed primary:

- `Version 0.5.301 - Resource And Commodity Schema And Validator`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.302 - Resource And Commodity Seed Plan`

## Resource And Commodity Implementation Posture

The resource/commodity authority plan remains:

- `docs/design/resource-commodity-authority-schema-plan.md`

Implemented future schema paths:

- `packages/schemas/world/resource.schema.json`
- `packages/schemas/world/commodity.schema.json`

Implemented focused validator paths:

- `tools/content-lint/resources.mjs`
- `tools/content-lint/commodities.mjs`

Implemented focused test path:

- `tests/unit/resource-commodity-authority-validation.test.mjs`

Schema-file parse coverage now includes both new schema paths in:

- `tests/unit/schema-files.test.mjs`

Live content remains intentionally absent:

- `packages/content/base/world/resources.json`
- `packages/content/base/world/commodities.json`

Normal content-lint registration remains intentionally absent:

- `tools/content-lint/index.mjs` does not import or register the resource/commodity validators.

Validator posture:

- Records-only wrappers with strict wrapper-key checks.
- Strict record schemas with `resource.<slug>` and `commodity.<slug>` identity patterns.
- Duplicate id, slug, and name rejection.
- Id/slug coherence checks.
- Lifecycle, family, source-domain, trade-category, handling-tag, and allowed-owner vocabularies.
- Recursive forbidden-field rejection for prices, values, stock, cargo, storage, runtime, UI, save/account, commands, events, rewards, migrations, and gameplay state.
- Descriptive tag validation with generic-tag rejection and forbidden-intent guardrails.
- `relatedItemKeys` resolution against canonical `items.items` records.
- Market-only key rejection when market value records are supplied.
- Peer resource/commodity relationship resolution when peer authority records are supplied.
- Optional resource ecology/geography/production-stage reference checks when those relationship fields are populated.
- Optional commodity production-chain and recipe reference checks when those relationship fields are populated.

Key boundaries remain:

- `items.items` is canonical item-key authority.
- `civilization.market_item_values` remains value/pricing owner.
- Resources describe source-material identity and source/environment compatibility.
- Commodities describe bulk trade and economic-class identity.
- Settlement goods, domestic resource descriptors, world hex resource-affinity tags, production `extract.*` refs, ecology descriptors, service vocabulary, markets, vendors, cargo, storage, and runtime economy state remain with their current or future owner layers.

## Service Authority Posture

The live `civilization.services` lane remains stable after normal content-lint registration.

No immediate service follow-up is needed. Do not expand service content, providers, descriptors, availability, access checks, prices, payment, stock, effects, runtime, UI, save/account behavior, route/travel behavior, legal/reputation behavior, or gameplay unless a later prompt explicitly scopes it.

## Remaining Deferred Authority Guardrails

Do not treat the new resource/commodity schemas and validators as permission to add:

- live resource or commodity content;
- normal content-lint registration;
- settlement goods normalization;
- item or market migrations;
- ecology integration;
- production/crafting integration;
- prices, stock, cargo, storage, gathering, trading, crafting execution, service execution, runtime, UI, save/account state, commands, events, rewards, migrations, or gameplay.

The Highcrown settlement Knowledge lane remains closed from `Version 0.5.285 - Highcrown Settlement Knowledge Lane Closure Review`.

A generic `world.pois` authority remains rejected by `Version 0.5.292 - Discovery And POI Boundary Decision`.

Typed status/condition/injury catalog implementation remains deferred behind its own schema plan, fresh live-repo audit, seed plan, and focused implementation prompt.

## Next Route Guardrail

`Version 0.5.302 - Resource And Commodity Seed Plan` is the immediate next primary route.

That run should be docs-first. It should select only a tiny future resource/commodity seed candidate set, prove each selected candidate against current authority records, and keep live content plus normal lint registration deferred unless a later implementation prompt explicitly scopes them.

## Deep Research And Support-Suffix Posture

No nonstandard support-suffix run is needed before `Version 0.5.302 - Resource And Commodity Seed Plan`.

`GPT-DR.resources.gathering-extraction` remains the relevant future Deep Research gate for deeper gathering/extraction or resource-node work. It does not need to run before the immediate seed-plan route unless the seed plan intentionally broadens into resource-node, gathering, extraction, or simulation policy.

Suggested next commit:

`feat(content): add resource commodity schemas`
