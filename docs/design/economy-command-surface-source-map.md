# Economy Command Surface Source Map

Source route: ChatGPT via GitHub Connector
Date: 2026-06-05
Status: connector-only prep for future economy/shop/trade/craft/caravan command work; no source, schema, content JSON, UI, generated output, roadmap advancement, or runtime behavior changes

## Purpose

Map current and deferred economy command-surface boundaries before any future shop, trade, craft, caravan, market, inventory, item-transfer, pricing, or UI command behavior is implemented.

This document is a planning source. It does not authorize implementation.

## Current Deferred Economy Areas

Roadmap-deferred or not-yet-implemented economy areas include:

- shop command UI
- trade command UI
- craft command UI
- caravan command UI
- economy clarity React UI
- command dispatch for buying/selling/crafting/caravan actions
- inventory mutation from economy actions
- item-instance persistence and transfer
- estate transfer/claim execution
- market simulation mutation
- generated output

Existing landed boundaries include:

- economy price clarity planning has landed
- pure economy projections and focused tests have landed
- settlement economy, domestic trade flows, market values, item value profiles, workplaces, recipes, production chains, and route/travel profiles exist as content/source shapes
- no active shop/trade/craft/caravan command UI or command mutation is authorized

## Core Boundary Rule

A price or projection is not a command.

Read-only economy clarity, market values, content records, settlement supply/demand, route availability, or recipe data may inform future command proposals, but they must not silently mutate inventory, currency, workplaces, caravans, settlements, markets, estate claims, or account/session state.

## Command Surface Vocabulary

Future economy commands should distinguish these command families.

| Command family | Future examples | Required owner boundary |
| --- | --- | --- |
| `shop` | buy, sell, inspect offer, reserve offer | market/vendor/inventory/currency owners explicit |
| `trade` | trade route offer, settlement exchange, guild contract | settlement/route/guild/currency/inventory owners explicit |
| `craft` | start recipe, consume inputs, produce outputs, salvage | character/workplace/input/output/item-instance owners explicit |
| `caravan` | create caravan, assign goods, choose route, dispatch, resolve arrival | settlement/route/vehicle/animal/goods/risk owners explicit |
| `workplace` | assign job, run cycle, inspect output | workplace/worker/input/output/time owners explicit |
| `estate` | claim, transfer, store, withdraw, deliver | estate/family/account/item-instance owner explicit |
| `market` | quote, adjust price, record demand, settlement import/export | market/simulation owner explicit |

## Current Source Relationships

| Source area | Current relationship to economy commands | Boundary |
| --- | --- | --- |
| Item value profiles | Can inform future pricing and item value display. | Do not mutate currency or inventory. |
| Market value records | Can inform read-only price projections. | Not a transaction ledger. |
| Settlement economic models | Can inform local supply/demand and market context. | Not a shop owner by itself. |
| Domestic trade flows | Can inform route and exchange context. | Not a caravan command. |
| Guild quest boards/contracts | Can inform future trade/contract access. | Not a trade execution path. |
| Workplaces | Can inform production capability. | Not crafting mutation without command owner. |
| Recipes/production chains | Can inform craft proposals. | Recipe existence does not consume or produce items. |
| Travel routes/caravan modes | Can inform caravan feasibility. | Route existence does not dispatch caravans. |
| Inventory/equipment/player state | Can provide future input ownership. | UI selection cannot mutate inventory. |
| Family/estate plans | Can provide future estate ownership. | Estate vocabulary is not transfer authority. |

## Owner Questions For Future Commands

Future implementation must answer:

1. Who owns the command request?
2. Which state owner is allowed to mutate?
3. Which inventory or item instance owns inputs and outputs?
4. Which currency account is charged or credited?
5. Which market/vendor/workplace/settlement/guild/estate owns the offer?
6. Which route/vehicle/animal/crew owner is required for caravans?
7. Which validation proves the offer is still current?
8. Which event envelope records success/failure?
9. Which UI surfaces are read-only and which can dispatch commands?
10. Which tests prove display-only prices cannot mutate state?

## Non-Grant / Non-Mutation Rules

- Price display does not reserve or spend currency.
- Item value does not create an offer.
- Market presence does not create a vendor inventory.
- Route visibility does not create a caravan.
- Recipe visibility does not start crafting.
- Workplace presence does not consume inputs.
- Settlement demand does not buy items automatically.
- Guild membership does not create trade rights automatically.
- Estate text does not transfer items or property.
- UI selection does not mutate inventory, currency, market, route, or workplace state.
- Generated output must not be introduced until explicitly scoped.

## Future Validation Rules

Future economy command validation should eventually protect:

- known command family and command type
- command actor/owner scope
- valid inventory owner and item-instance ids
- valid currency owner and sufficient funds
- valid market/vendor/workplace/settlement/route owner
- offer still available at execution time
- recipe input ownership and quantities
- output destination ownership
- caravan route feasibility and risk context
- no read-only projection used as mutation authority
- wrong-owner commands fail
- stale offers fail
- UI-only ids are not accepted as authority

## Recommended Future Pass Order

Recommended sequence when this pillar becomes active:

1. `Economy Command Surface Audit`
   - inspect current economy projections, market/content shapes, UI surfaces, and command gaps
   - docs-only
2. `Economy Command Contract Plan`
   - define shop/trade/craft/caravan command request/result shapes
   - planning only
3. `Economy Ownership And Offer Validation Plan`
   - define inventory/currency/market/vendor/workplace/route owners
   - planning only
4. `Economy Command Readiness Helper`
   - pure helper returning blockers/proposals without mutation
5. `Economy Inert Output Envelope Plan`
   - define inert transaction/result envelopes before event creation
6. `Shop/Craft/Trade Read-Only UI Plan`
   - presentation-first; no command dispatch
7. `Narrow Economy Command Integration`
   - only after owners, event outputs, inventory, currency, and save/session mutation boundaries are explicit

## Forbidden Until Explicitly Scoped

Do not add or change:

- shop/trade/craft/caravan command handlers
- UI command dispatch
- currency mutation
- inventory mutation
- item-instance creation/transfer
- market simulation mutation
- workplace cycle execution
- recipe input consumption or output production
- caravan dispatch or arrival resolution
- estate claim/transfer execution
- save/account/session schema
- generated output
- content JSON records
- broad economy rebalance

## Recommended Next Connector Work

The next useful connector-only pass is:

- `Gameplay Shell Unification Source Map`

Rationale: launcher/creator shell work landed, but gameplay shell unification remains deferred. A source map can prepare UI routing without touching React now.

## Recommended Future Codex Work

Do not schedule this pillar ahead of the active knowledge-domain sequence unless explicitly requested.

When ready, the safest first Codex pass is:

- `Version 0.5.x - Economy Command Surface Audit`

It should remain docs-only and should not alter economy runtime, inventory, currency, content, UI, save/account/session, or generated output.
