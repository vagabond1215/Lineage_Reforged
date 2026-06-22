# Current GPT Handoff

Source version/run: Version 0.5.227 - Settlement Economy Schema Decision
Date: 2026-06-22
Status: documentation-only decision completed; no implementation occurred

## Authority Rules

- Future `world.settlement_economies` owns optional authored descriptive settlement-economy posture.
- Future paths are `packages/content/base/world/settlement_economies.json` and `packages/schemas/world/settlement-economy.schema.json`.
- Records use `settlement_economy.<settlement_slug>`, strict records-only wrapping, one record per settlement, and `planned`/`active`/`retired` lifecycle.
- The first implementation must be schema, pure validator, and focused tests only. It starts content-free and unregistered; a later seed plan must precede live content and normal lint registration.
- Future economy authority owns durable role/specialization, market scale/order, qualitative wealth/resilience/scarcity/seasonality and import/export/dependency bands, supported canonical item posture, industry references, and exact broad guild references when proven.
- Settlement `infrastructureProfile.marketTier` remains settlement-owned. `domesticTradeFlows` waits for route/trade overlay authority. Local `guildPresence` remains settlement-owned until a separate local guild/institution decision.
- `economicModel` and supported non-topological `tradeDependencyProfile`/`domesticResourceProfile` claims conceptually move later; no data migrates until an atomic current-data pass removes dual ownership.
- Future resources, commodities, market profiles, professions, and institutions remain separate. Free-form strings cannot create those authorities.
- Existing items, market item values, economy rules, prices, stocks, production, markets, trade, transport, crafting estimates, runtime, UI, and storage retain current ownership.
- Economy Knowledge remains unimplemented and informational only.

## Current Anchor

Latest completed:

- `Version 0.5.227 - Settlement Economy Schema Decision`

Immediate next:

- `Version 0.5.228 - World Map Feature Authority Schema Decision`

## Settlement Economy Decision Result

- Live inventory confirmed 88 settlements, 58 workplaces, 121 production chains, 18 guilds, 1,372 items, 1,617 market values, six economy rules, nine ecology profiles, and one travel network plus active runtime economy/trade/transport surfaces.
- The future minimum contract and all exact-price/runtime exclusions are fixed in `docs/design/settlement-economy-schema-decision.md`.
- Conditional implementation remains `0.5.239 - Settlement Economy Schema And Validator` and is not pre-approved beyond the documented scope.
- `docs/dev/tmp-economy-systems-research-2026-06-20.md` was deleted after full promotion and has no remaining consumer.

## Consolidated Near-Term Queue

1. `0.5.228 - World Map Feature Authority Schema Decision`
2. `0.5.229 - Hazard And Route Security Boundary Decision`

No new Deep Research is required before this queue. GPT-DR labels remain non-Codex labels and do not consume `0.5.x` numbers.

## Next Route Boundary

`Version 0.5.228 - World Map Feature Authority Schema Decision` remains documentation-only. It must define the exact geometry-free map-feature collection against current place, visual-map, route, political, ecology, POI, and grid owners and decide the temporary world-map research artifact's disposition.

It must not implement schemas, validators, content, tests, geometry migration, routes, grids, map UI, runtime, storage, travel, pathfinding, spawning, or gameplay behavior.
