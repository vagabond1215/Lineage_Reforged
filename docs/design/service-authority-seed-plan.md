# Service Authority Seed Plan

Source version/run: Version 0.5.295 - Service Authority Seed Plan
Date: 2026-07-08
Status: documentation-only seed plan; no live service content

## 1. Plan Summary

This run selects the first tiny future `civilization.services` seed set for a later live content implementation.

The selected records are provider-independent vocabulary only. They define service names, families, tags, broad public posture, type-level future owner posture, observed building descriptor links, source notes, and non-execution guardrails. They do not define providers, provider availability, access checks, prices, payment, stock, inventory, storage contents, effects, UI, runtime state, save/account state, or gameplay behavior.

This run does not create `packages/content/base/civilization/services.json`, register normal content lint, edit schemas, edit validators, edit tests, edit content, or change behavior.

## 2. Current Completed-State Posture

Latest completed primary before this run:

- `Version 0.5.294 - Service Authority Schema And Validator`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Current run:

- `Version 0.5.295 - Service Authority Seed Plan`

Current posture:

- `0.5.294` completed future service schema, focused validator/helper, focused tests, and schema-file parse coverage.
- The Highcrown settlement Knowledge lane remains closed from `Version 0.5.285 - Highcrown Settlement Knowledge Lane Closure Review`.
- A generic `world.pois` authority remains rejected by `Version 0.5.292 - Discovery And POI Boundary Decision`.
- Future `world.resources`, `world.commodities`, and typed status/condition/injury catalog work remains deferred behind separate plans.

## 3. Schema And Validator Posture

Current service authority support:

- Schema: `packages/schemas/civilization/service.schema.json`
- Focused validator/helper: `tools/content-lint/services.mjs`
- Focused test path: `tests/unit/service-authority-validation.test.mjs`
- Schema parse coverage: `tests/unit/schema-files.test.mjs`

No live service content exists yet:

- `packages/content/base/civilization/services.json` remains absent.
- Normal content-lint registration remains absent.
- Existing `civilization.buildings.serviceFunctions` remain source-local descriptors and are not migrated by this plan.

The schema requires service ids to use `service.<slug>`, so the future record for the observed descriptor `storage.warehouse` must use `id: "service.storage_warehouse"` and `slug: "storage_warehouse"` while linking back through `relatedBuildingServiceFunctions: ["storage.warehouse"]`.

## 4. Fresh Service-Like Descriptor Audit

Observed current building `serviceFunctions` include:

- `archives`
- `boat_landing`
- `bulk_container_storage`
- `cask_cellaring`
- `clinic`
- `cloth_storage`
- `coal_storage`
- `construction_stockyard`
- `contract_board`
- `controlled_storage`
- `draft_yard`
- `dry_storage`
- `drying_loft`
- `escort_staging`
- `ferry_berth`
- `fish_handling`
- `food_storage`
- `fragile_goods_storage`
- `frontier_store`
- `fuel_storage`
- `garrison`
- `guild_hall`
- `haulage_staging`
- `hide_drying`
- `ingot_stockyard`
- `laundering`
- `lodging`
- `market_exchange`
- `market_food_stalls`
- `merchant_exchange`
- `military_storage`
- `ore_sorting`
- `port_handling`
- `public_hygiene`
- `record_storage`
- `reed_drying`
- `reserve_stock`
- `stone_stockyard`
- `storage.warehouse`
- `timber_sorting`
- `waste_handling`

Relevant building categories observed:

- `agrarian`
- `civic`
- `extractive`
- `hospitality`
- `industrial`
- `maritime`
- `military`
- `service`
- `storage`

Relevant selected-candidate building evidence:

| Descriptor | Observed building | Building category | Evidence summary |
| --- | --- | --- | --- |
| `lodging` | `building.drinkhouse_cellar` | `hospitality` | Public-house block with `workplace.inn` and lodging descriptor. |
| `market_exchange` | `building.warehouse_block` | `storage` | Large-volume dry storage supporting trade turnover, reserves, and caravan staging. |
| `storage.warehouse` | `building.warehouse_block` | `storage` | Warehouse block also exposes warehouse storage profile. |
| `archives` | `building.scriptoria_quarter` | `civic` | Paper, binding, copying, administration, contracts, and long-form record context. |
| `contract_board` | `building.guildhall_row` | `civic` | Guild halls, exchanges, and contract counters context. |

Storage profile types observed on buildings:

- `cellar`
- `granary`
- `vault`
- `warehouse`

Storage profile types describe capacity posture and goods focus. They do not define storage contents, inventory, stock, item instances, cargo movement, or player storage behavior.

Service-facing runtime/UI terms remain forbidden to this seed:

- Shared contracts and UI/runtime surfaces already contain market stock, price views, inventory, access status, settlement service availability, transport availability, caravans, cargo manifests, route/travel state, and lodging labels.
- Those surfaces are current or future runtime/UI/save/economy/travel owners, not static service vocabulary.
- The live seed must not copy those fields into service records.

Vendor/shop/market and access/provider/pricing/stock/effects language remains out of scope:

- Economy rules and market values own price/value posture.
- Market states and transport state own stock, cargo, route, and caravan runtime data.
- UI start-flow surfaces own current presentation of lodging/access labels.
- Service authority may name `market_exchange` only as vocabulary, not as a transaction, price, stock, vendor, shop, or market UI implementation.

## 5. Candidate Selection Criteria

First seed candidates must:

- be observed in current `civilization.buildings.serviceFunctions`;
- be semantically common across future adjacent owner families;
- be provider-independent and safe as static vocabulary;
- have exact field values under the 0.5.294 schema;
- use `status: "planned"` unless an existing validated consumer requires `active`;
- avoid provider ids, provider availability, access checks, prices, payment, stock, effects, UI, runtime, save/account state, or gameplay behavior;
- avoid migrating building records or replacing source-local descriptors;
- avoid reopening Highcrown Knowledge, generic POI authority, resource/commodity content, or combat-health vocabulary.

## 6. Candidates Considered

Strong candidates considered:

- `lodging`
- `market_exchange`
- `storage.warehouse`
- `archives`
- `contract_board`
- `public_hygiene`
- `laundering`

Higher-risk candidates considered but rejected for the first seed:

- `clinic`
- `ferry_berth`
- `port_handling`
- `merchant_exchange`
- `guild_hall`
- `record_storage`
- `reserve_stock`
- `dry_storage`
- `boat_landing`
- `escort_staging`
- `garrison`

## 7. Selected First Seed Set

Select exactly five future service records:

1. `service.lodging`
2. `service.market_exchange`
3. `service.storage_warehouse`
4. `service.archives`
5. `service.contract_board`

Rationale:

- All five are directly observed in current building `serviceFunctions`.
- They cover common service families without needing new schema vocabulary.
- They are useful across building, settlement-site/district, workplace, guild, institution, or market-context owner families later.
- They can remain `planned` vocabulary records until future consumers explicitly need active service references.
- They avoid the highest-risk runtime domains: healing execution, ferry traversal, port/cargo execution, prices, stock, access checks, and effects.

## 8. Exact Future Record Table

The live seed should create exactly these records in `packages/content/base/civilization/services.json`.

### `service.lodging`

| Field | Value |
| --- | --- |
| `id` | `service.lodging` |
| `slug` | `lodging` |
| `name` | `Lodging` |
| `status` | `planned` |
| `family` | `lodging` |
| `summary` | `Provider-independent vocabulary for places or templates that identify lodging as an offered stay or room-and-board capability.` |
| `tags` | `["lodging", "hospitality", "rooms", "rest"]` |
| `publicPosture` | `public` |
| `providerAnchorTypes` | `["building_template", "settlement_site", "settlement_district", "workplace"]` |
| `allowedOwnerTypes` | `["civilization.buildings", "civilization.workplaces", "world.settlement_sites", "world.settlement_districts"]` |
| `relatedBuildingServiceFunctions` | `["lodging"]` |
| `sourceAuthorityNotes` | `["Observed current building serviceFunctions value on building.drinkhouse_cellar."]` |
| `notes` | `["Static provider-independent service vocabulary only.", "Does not define provider availability, access checks, prices, payment, stock, inventory, lodging effects, UI, runtime, save/account state, or gameplay behavior."]` |

### `service.market_exchange`

| Field | Value |
| --- | --- |
| `id` | `service.market_exchange` |
| `slug` | `market_exchange` |
| `name` | `Market Exchange` |
| `status` | `planned` |
| `family` | `market_exchange` |
| `summary` | `Provider-independent vocabulary for exchange-facing service identity without prices, stock, vendors, or transaction behavior.` |
| `tags` | `["market", "exchange", "commerce", "counter"]` |
| `publicPosture` | `public` |
| `providerAnchorTypes` | `["building_template", "settlement_district", "settlement", "market_context", "guild"]` |
| `allowedOwnerTypes` | `["civilization.buildings", "world.settlements", "world.settlement_districts", "civilization.guilds"]` |
| `relatedBuildingServiceFunctions` | `["market_exchange"]` |
| `sourceAuthorityNotes` | `["Observed current building serviceFunctions value on building.warehouse_block."]` |
| `notes` | `["Static provider-independent service vocabulary only.", "Does not define provider availability, access checks, prices, payment, stock, inventory, vendor/shop behavior, market transactions, UI, runtime, save/account state, or gameplay behavior."]` |

### `service.storage_warehouse`

| Field | Value |
| --- | --- |
| `id` | `service.storage_warehouse` |
| `slug` | `storage_warehouse` |
| `name` | `Warehouse Storage` |
| `status` | `planned` |
| `family` | `storage_handling` |
| `summary` | `Provider-independent vocabulary for warehouse-style storage and handling identity without contents, stock, or item movement.` |
| `tags` | `["storage", "warehouse", "bulk_goods", "handling"]` |
| `publicPosture` | `limited` |
| `providerAnchorTypes` | `["building_template", "settlement_site", "settlement_district", "workplace"]` |
| `allowedOwnerTypes` | `["civilization.buildings", "civilization.workplaces", "world.settlement_sites", "world.settlement_districts"]` |
| `relatedBuildingServiceFunctions` | `["storage.warehouse"]` |
| `sourceAuthorityNotes` | `["Observed current building serviceFunctions value on building.warehouse_block; schema id uses storage_warehouse because service ids require lower snake-case after service."]` |
| `notes` | `["Static provider-independent service vocabulary only.", "Does not define storage contents, provider availability, access checks, prices, payment, stock, inventory, item instances, cargo movement, UI, runtime, save/account state, or gameplay behavior."]` |

### `service.archives`

| Field | Value |
| --- | --- |
| `id` | `service.archives` |
| `slug` | `archives` |
| `name` | `Archives` |
| `status` | `planned` |
| `family` | `archive_record` |
| `summary` | `Provider-independent vocabulary for archive or record-service identity without record browsing, Knowledge unlocks, or access behavior.` |
| `tags` | `["archives", "records", "civic", "reference"]` |
| `publicPosture` | `institutional` |
| `providerAnchorTypes` | `["building_template", "settlement_district", "institution", "civic_authority"]` |
| `allowedOwnerTypes` | `["civilization.buildings", "world.settlement_districts", "future.institutions"]` |
| `relatedBuildingServiceFunctions` | `["archives"]` |
| `sourceAuthorityNotes` | `["Observed current building serviceFunctions value on building.scriptoria_quarter."]` |
| `notes` | `["Static provider-independent service vocabulary only.", "Does not define archive access, record browsing, Knowledge progress, provider availability, access checks, prices, payment, stock, inventory, effects, UI, runtime, save/account state, or gameplay behavior."]` |

### `service.contract_board`

| Field | Value |
| --- | --- |
| `id` | `service.contract_board` |
| `slug` | `contract_board` |
| `name` | `Contract Board` |
| `status` | `planned` |
| `family` | `contract_brokerage` |
| `summary` | `Provider-independent vocabulary for contract-board service identity without quest generation, offer state, rewards, or access behavior.` |
| `tags` | `["contracts", "brokerage", "guild", "notices"]` |
| `publicPosture` | `regulated` |
| `providerAnchorTypes` | `["building_template", "settlement_site", "settlement_district", "guild", "civic_authority"]` |
| `allowedOwnerTypes` | `["civilization.buildings", "civilization.guilds", "world.settlement_sites", "world.settlement_districts", "civilization.quest_templates", "civilization.quest_definitions"]` |
| `relatedBuildingServiceFunctions` | `["contract_board"]` |
| `sourceAuthorityNotes` | `["Observed current building serviceFunctions value on building.guildhall_row."]` |
| `notes` | `["Static provider-independent service vocabulary only.", "Does not define provider availability, access checks, prices, payment, stock, quest generation, offer state, rewards, effects, UI, runtime, save/account state, or gameplay behavior."]` |

No selected candidate should use `relationshipNotes` in the first live seed. The field is not needed because every selected relationship is already captured by a single observed building descriptor in `relatedBuildingServiceFunctions` plus source notes.

## 9. Rejected Candidates

| Candidate | Rejection rationale for first seed |
| --- | --- |
| `clinic` | Useful later, but too close to healing/treatment effects and health runtime behavior for the first service seed. |
| `ferry_berth` | Useful later, but too close to route traversal, ferry execution, destination eligibility, tolls, and travel state. |
| `port_handling` | Useful later, but too close to cargo execution, customs, storage contents, route/travel, and port operations. |
| `public_hygiene` | Safe as vocabulary, but less immediately cross-domain than the selected five and risks implying body-state effects. |
| `laundering` | Safe as vocabulary, but less foundational than selected records and may imply item cleaning or service effects. |
| `merchant_exchange` | Overlaps `market_exchange` and may pull in merchant/provider identity too early. |
| `guild_hall` | More institution/place identity than service vocabulary; keep source-local for now. |
| `record_storage` | Covered by `archives` for first seed; storage-specific archive handling can wait. |
| `reserve_stock` | Rejected because stock is explicitly forbidden to service records. |
| `dry_storage` | Covered by broader `storage_warehouse` for first seed; exact storage variants can wait. |
| `boat_landing` | More place/route facility posture than service vocabulary for the first seed. |
| `escort_staging` | Too close to security/travel execution and generated route behavior. |
| `garrison` | More military place/institution posture than service vocabulary. |

## 10. Normal Lint Registration Posture

Keep normal content-lint registration deferred until the live service seed implementation.

Reasoning:

- There is still no live `packages/content/base/civilization/services.json`.
- `tools/content-lint/services.mjs` already exists for focused validation.
- Registering normal lint without live content would add routing surface before content exists.
- The live seed run can use the focused helper first and decide whether normal content lint registration is explicitly in scope.

Default for the next run:

- create the live content file with exactly the selected records;
- use the focused validator/helper in focused validation/tests;
- keep normal content-lint registration deferred unless the prompt explicitly scopes registration for the live content file.

## 11. Live Seed Implementation Instructions

The next live seed route should be:

- `Version 0.5.296 - Service Authority Seed`

That run should:

- create `packages/content/base/civilization/services.json`;
- add exactly the five selected records in this plan;
- keep all records `status: "planned"`;
- use the existing schema at `packages/schemas/civilization/service.schema.json`;
- use the existing focused validator at `tools/content-lint/services.mjs`;
- add or update focused tests only if needed to validate the live seed content;
- prove every `relatedBuildingServiceFunctions` value resolves to observed current building descriptors;
- decide normal lint registration only if explicitly scoped;
- update current handoff, roadmap, sequence, backlog, and Codex output.

The live seed must still not:

- migrate or edit `civilization.buildings.serviceFunctions`;
- edit building, workplace, settlement, district, site, route, travel, vendor, shop, market, cargo, or storage records;
- add provider records;
- add prices, payment, stock, inventory, storage contents, access checks, effects, UI, runtime, save/account state, events, rewards, or gameplay;
- reopen Highcrown Knowledge;
- implement generic `world.pois`;
- implement resources, commodities, or combat health vocabulary.

## 12. Validation Expectations For Live Seed

The live seed should validate:

- `packages/content/base/civilization/services.json` exists only after the live seed run begins;
- wrapper has only `records`;
- exactly five records exist;
- record ids are `service.lodging`, `service.market_exchange`, `service.storage_warehouse`, `service.archives`, and `service.contract_board`;
- all five records are `planned`;
- every selected `relatedBuildingServiceFunctions` value is observed in current building content;
- no forbidden fields appear, including nested forbidden fields;
- no provider refs, provider ids, building ids, site ids, NPC ids, person ids, guild ids, or settlement ids appear in service records;
- no normal content-lint registration lands unless explicitly scoped;
- no runtime/UI/storage/save/account/gameplay files change.

Package tests are not required for this docs-only plan. If the live seed adds focused tests, report exact commands and outcomes.

## 13. Explicit Non-Goals

This plan does not:

- add `packages/content/base/civilization/services.json`;
- add live service records;
- register normal content lint;
- edit service schema, validator, or tests;
- add provider records;
- migrate building service descriptors;
- edit building, workplace, settlement, district, site, route, travel, vendor, shop, market, cargo, or storage records;
- edit Knowledge snippets, registry, domain, or trial-policy content;
- edit resource, commodity, combat status, condition, injury, POI/discovery, map-feature, sacred-site, or religious-hotspot content;
- edit runtime code, UI, storage, commands, events, rewards, migrations, save/account behavior, service execution, provider availability, access checks, prices, payment, stock, inventory, route/travel behavior, legal/reputation behavior, or gameplay.

This plan does not approve old-save compatibility, aliases, generated content, migration behavior, or a transition to `0.6.x`.

## 14. Checks Run

Read-only inspections and audits used for this plan:

- `git status --short --branch`
- `git fetch origin`
- `git pull --ff-only origin master`
- Required reads of active output, handoff, sequence, roadmap, backlog, service schema plan, service boundary, static-authority audit, discovery/POI boundary, resource/commodity decision, combat-health boundary, and Highcrown closure docs.
- Reads of `packages/schemas/civilization/service.schema.json`, `tools/content-lint/services.mjs`, and `tests/unit/service-authority-validation.test.mjs`.
- Structured extraction of current building `serviceFunctions`.
- Structured extraction of building categories.
- Structured extraction of hosted workplace ids.
- Structured extraction of storage profile types.
- Targeted service-facing scans for market, vendor, stock, price, payment, inventory, access, lodging, clinic, ferry, port, storage, archive, contract, hygiene, laundering, runtime, UI, and travel language.
- Confirmation that `packages/content/base/civilization/services.json` remains absent before edits.
- Confirmation that normal content-lint registration for services remains absent before edits.

## 15. Next Recommended Version

Version 0.5.296 - Service Authority Seed

Reasoning: this plan selects exact future records, statuses, field values, source proof, non-execution notes, live seed instructions, validation expectations, and normal-lint posture. No blocker was found that requires a readiness follow-up before the live seed.
