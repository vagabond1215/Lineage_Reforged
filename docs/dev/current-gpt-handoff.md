# Current GPT Handoff

Source version/run: Version 0.5.239 - Settlement Economy Schema And Validator
Date: 2026-06-27
Status: future settlement-economy schema and focused validator completed; no live settlement-economy content, normal content-lint registration, settlement migration, exact pricing, runtime economy simulation, trade mutation, UI, storage, rewards, commands, events, or gameplay change

## Authority Rules

- `world.settlement_economies` is approved as future static authored descriptive settlement-level economy identity/posture only.
- Settlement-economy records use `settlement_economy.<settlement_slug>` ids, strict records-only wrapper shape, `slug` equal to the settlement slug, and `settlementId` equal to `settlement.<settlement_slug>`.
- At most one settlement-economy record may exist per settlement; referenced settlements resolve against current `world.settlements`.
- Item posture uses canonical `items.items` `itemKey` values only, not `item.<key>` ids, and does not copy item identity, values, pricing, inventory, marketability, or crafting behavior.
- Industry posture may reference existing `workplace.<slug>` and `chain.*` ids only as durable descriptive relevance; it does not instantiate workplaces, execute chains, assign labor, consume inputs, produce outputs, select variants, or authorize crafting.
- `guildRefs` may reference existing broad `guild.<slug>` ids only and must not copy or infer local settlement guild presence, professions, institutions, services, ranks, access, discounts, or behavior.
- `routeDependenceNotes` remains descriptive prose only and must not contain route, road, river, lane, path, crossing, port, travel-network, distance, mode, cargo, warehouse, logistics, or pathfinding refs.
- Current settlement embedded economy fields remain authoritative until a separate migration/removal pass is explicitly approved; do not move, copy, normalize, reinterpret, or dual-own them in future seed work.
- Market profiles, resources, commodities, professions, institutions, trade-route overlays, property/law/tax/service/access, Economy Knowledge, runtime economy state, UI, storage, commands, events, rewards, and gameplay remain separate future owners.

## Current Anchor

Latest completed:

- `Version 0.5.239 - Settlement Economy Schema And Validator`

Immediate next:

- `Version 0.5.240 - World Map Feature Schema And Validator`

## Settlement Economy Validation Result

- Added `packages/schemas/world/settlement-economy.schema.json`.
- Added `tools/content-lint/settlement-economies.mjs` as a pure in-memory structural and semantic validator helper.
- Added `tests/unit/settlement-economy-validation.test.mjs`.
- Registered the new schema in `tests/unit/schema-files.test.mjs`.
- No `packages/content/base/world/settlement_economies.json` file was created.
- No normal content-lint registration for future settlement-economy content was added.
- `docs/dev/tmp-economy-systems-research-2026-06-20.md` remains absent.

## Known Test Notes

- `node --test tests\unit\settlement-economy-validation.test.mjs` passes.
- `npm.cmd run tool:content-lint` passes and remains `content-lint: ok (58 files checked)`.
- `node --test tests\unit\schema-files.test.mjs` parses the new schema, then still fails on the unrelated pre-existing Knowledge subject vocabulary assertion around `sacred_site`.
- `tests/unit/region-first-world-data.test.mjs` still has the unrelated direct-run BOM parsing issue noted by prior handoffs.

## Next Route

`Version 0.5.240 - World Map Feature Schema And Validator` is the next queued run. It should use the `0.5.228` World Map Feature Authority Schema Decision, keep the map-feature authority semantic/geometry-free, and avoid live content, normal lint registration, route topology mutation, visual geometry migration, runtime, UI, storage, commands, events, rewards, or gameplay behavior unless a later prompt explicitly authorizes them.
