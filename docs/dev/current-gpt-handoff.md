# Current GPT Handoff

Source version/run: Version 0.5.288 - Resource And Commodity Schema Decision
Date: 2026-07-07

## Status

`Version 0.5.288 - Resource And Commodity Schema Decision` completed as a docs-only decision.

Decision: approve separate future static authorities for `world.resources` and `world.commodities` in principle, with implementation deferred. `items.items` remains canonical item identity. Future resource and commodity records may relate to item keys but must not replace them or own prices, stock, item instances, cargo movement, storage contents, services, extraction, trading, crafting execution, runtime, UI, or gameplay behavior.

Latest completed primary:

- `Version 0.5.288 - Resource And Commodity Schema Decision`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.289 - Combat Status Condition And Injury Boundary Decision`

## Current Versioning Posture

Three-segment labels such as `0.5.288` are primary roadmap versions. Four-segment labels such as `0.5.276.1` are support-run suffixes and do not consume planned primary roadmap slots.

`0.5.288` completed as the next primary after `0.5.287`.

## Highcrown Knowledge Lane Posture

The Highcrown settlement Knowledge lane remains closed from `Version 0.5.285 - Highcrown Settlement Knowledge Lane Closure Review`.

Do not plan additional Highcrown settlement/district/site General Lore snippets unless a later owner decision explicitly reopens that lane.

## Service Boundary Posture

`Version 0.5.287 - Service Authority Boundary Decision` selected a hybrid service model.

Current service-like descriptors remain on existing and future owner records. A future narrow static service catalog, likely `civilization.services`, is justified in principle only for provider-independent identity/vocabulary and requires a separate schema decision, fresh live-repo audit, and seed plan before implementation.

Resources and commodities do not own services. Hauling, warehousing, ferrying, repairing, market exchange, trading access, provider availability, prices, stock, transactions, storage contents, UI, runtime, and gameplay remain outside static resource/commodity authority.

## Resource / Commodity Posture

Selected model:

- Future `world.resources` may own static natural/source material identity and ecology/geography compatibility.
- Future `world.commodities` may own static bulk trade or economic class identity.
- `items.items` continues to own individual inventory item identity and canonical item keys.
- Future resources and commodities may map to item keys only as descriptive relationships.
- Implementation is deferred until a separate schema plan resolves paths, wrappers, ids, lifecycle, vocabularies, mapping cardinality, unresolved free-form goods terms, and validation failure modes.

Static resource/commodity authority must not own exact prices, value formulas, stock, shop inventory, item instances, item movement, cargo location, storage contents, shipment state, gathering/mining/hunting/fishing execution, crafting execution, production ticks, trading execution, payment, wallet mutation, service access, route traversal, UI menus, commands, events, rewards, save state, runtime state, or gameplay behavior.

## Next Route Guardrail

`Version 0.5.289 - Combat Status Condition And Injury Boundary Decision` should be docs-first.

It must not add combat status/injury content, resource content, commodity content, service content, Knowledge snippets, Knowledge registry/domain/trial-policy content, content JSON files, schemas, validators, tests, runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, route/travel behavior, building/workplace/economy behavior, court/law behavior, vendor/market behavior, cargo/storage behavior, settlement/district/site content, anchors, sacred-site/religious-hotspot content, or gameplay behavior unless a later focused implementation prompt explicitly scopes that work.

Suggested next commit:

`docs(roadmap): decide resource commodity schema boundary`
