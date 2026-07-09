# Current GPT Handoff

Source version/run: Version 0.5.302 - Resource And Commodity Seed Plan
Date: 2026-07-09

## Status

`Version 0.5.302 - Resource And Commodity Seed Plan` completed as a documentation-only seed plan.

Latest completed primary:

- `Version 0.5.302 - Resource And Commodity Seed Plan`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.303 - Resource And Commodity Seed`

## Resource And Commodity Seed-Plan Posture

Seed plan:

- `docs/design/resource-commodity-seed-plan.md`

Implemented support already exists:

- Resource schema: `packages/schemas/world/resource.schema.json`
- Commodity schema: `packages/schemas/world/commodity.schema.json`
- Resource validator: `tools/content-lint/resources.mjs`
- Commodity validator: `tools/content-lint/commodities.mjs`
- Focused test: `tests/unit/resource-commodity-authority-validation.test.mjs`
- Schema parse coverage: `tests/unit/schema-files.test.mjs`

Live content remains intentionally absent:

- `packages/content/base/world/resources.json`
- `packages/content/base/world/commodities.json`

Normal content-lint registration remains intentionally absent:

- `tools/content-lint/index.mjs` should not import or register resource/commodity validators in the next seed run.

## Selected Candidate Summary

The seed plan selects exactly four future planned records:

| Authority | Future id | Related item key | Peer ref |
| --- | --- | --- | --- |
| `world.resources` | `resource.iron_ore` | `iron_ore` | `commodity.iron_ore_lots` |
| `world.resources` | `resource.grain` | `grain_bundle` | `commodity.grain_bundles` |
| `world.commodities` | `commodity.iron_ore_lots` | `iron_ore` | `resource.iron_ore` |
| `world.commodities` | `commodity.grain_bundles` | `grain_bundle` | `resource.grain` |

Evidence posture:

- `iron_ore` resolves to `item.iron_ore` and has `market.item.iron_ore`.
- `grain_bundle` resolves to `item.grain_bundle` and has `market.item.grain_bundle`.
- Selected keys are not market-only.
- Market-only keys remain rejected for `relatedItemKeys`.
- Production-chain and recipe refs are intentionally omitted from the first seed.
- Ecology/geography refs are intentionally omitted from the first seed.
- Settlement goods terms are evidence only and intentionally omitted from the exact first records.

## Next Route Guardrail

`Version 0.5.303 - Resource And Commodity Seed` should:

- create only `packages/content/base/world/resources.json`;
- create only `packages/content/base/world/commodities.json`;
- use exactly the record shapes selected in `docs/design/resource-commodity-seed-plan.md`;
- keep every record `planned`;
- update focused validation to read the live seed if appropriate;
- keep normal content-lint registration deferred;
- avoid adding production/recipe/ecology/geography refs, extra records, prices, stock, cargo, storage, gathering, trading, crafting execution, service execution, runtime, UI, save/account, or gameplay behavior.

## Remaining Deferred Authority Guardrails

Do not treat the seed plan as permission to add:

- normal content-lint registration;
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

No nonstandard support-suffix run is needed before `Version 0.5.303 - Resource And Commodity Seed`.

No explicit user question is required before the next numbered route if the user accepts the seed plan.

`GPT-DR.resources.gathering-extraction` remains the relevant future Deep Research gate for resource-node, gathering, extraction, agriculture, or broad resource expansion work. It is not required before the immediate seed implementation because the planned seed is descriptive, tiny, and item-key-backed.

Suggested next commit:

`docs(content): plan resource commodity seed`
