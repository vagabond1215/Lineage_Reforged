# Economy Authority Boundary Decision

Version: `0.5.198 - Economy Authority Boundary Decision`
Status: completed documentation-only decision
Date: 2026-06-20

## 1. Decision Summary

Approve a docs-first economy authority route with future `world.settlement_economies` as the first implementation candidate. The first pass must normalize descriptive settlement-level economic identity without creating a second competing source beside the economy fields already embedded in `world.settlements`.

Future `world.market_profiles` remain descriptive, price-free, and band-based throughout `0.5.x`. Resources and commodities are separate semantic authorities, professions remain separate from guilds and institutions, trade-route economy overlays wait for stable route authority, and crafting transformations remain outside macroeconomic authority.

All first-pass economy authority records must reject runtime behavior, gameplay effects, stock counts, merchant AI, exact prices, ownership mutation, and executable law or tax behavior. Economy Knowledge remains informational until a dedicated subject decision.

This run consumes `docs/dev/tmp-economy-systems-research-2026-06-20.md` as planning input. It implements no schema, validator, content, test, runtime, UI, storage, simulation, ownership, or gameplay change.

## 2. Live Repo Reality

The temporary research correctly recommends authority-first planning but does not prove repository state. Live inspection establishes:

- `packages/content/base/economy`, `packages/content/base/professions`, and `packages/content/base/crafting` do not exist.
- `world.settlements` already has 88 records with required `economicModel`, `tradeDependencyProfile`, `domesticResourceProfile`, `domesticTradeFlows`, `guildPresence`, and infrastructure `marketTier` fields.
- `civilization.workplaces` has 58 records with workforce jobs and input/output profiles; some records also use market, integration, tier, and variant metadata.
- `civilization.production_chains` has 121 records with stages, outputs, and embedded `recipeProfile` data.
- `civilization.guilds` has 18 validated broad guild authorities. Settlement `guildPresence` records are local named instances or presences and are not a replacement for the broad guild catalog.
- No separate canonical profession or institution content collection exists. Job ids are embedded in workplace workforce profiles, and derived institution/guild runtime projections exist elsewhere.
- `items.items` has 1,372 item identities, while `civilization.market_item_values` has 1,617 value records with `baseValue`, currency, units, marketability, and pricing profiles.
- `civilization.economy_rules` already contains price floors, ceilings, volatility, and elasticity.
- Regional ecology and settlement records already carry supply, demand, import, export, and trade-context metadata.
- Travel networks, settlement trade flows, runtime economy, runtime trade, transport, market states, stock pressure, price views, crafting estimates, and economy clarity projections already exist.

This decision does not remove, rename, migrate, or weaken those systems. It defines the boundary for new canonical descriptive authority and requires the next schema decision to resolve overlap before implementation.

## 3. Economy Authority Ownership Boundary

| Layer | Canonical owner | Boundary |
| --- | --- | --- |
| Natural resources | future `world.resources` | Identifies source materials and their geography/ecology compatibility; does not own item instances, stock, depletion, harvesting, or prices. |
| Tradable commodities | future `world.commodities` | Identifies bulk trade classes and forms; maps to current item keys where supported without replacing inventory items. |
| Generic production transformation | existing civilization workplaces and production chains; later normalization only through a dedicated decision | Owns declarative inputs, outputs, stages, facilities, and occupational context; first-pass authority does not run ticks. |
| Settlement economy | future `world.settlement_economies` | Owns descriptive local specialization, dependencies, imports, exports, industries, market posture, and authority references after embedded settlement overlap is resolved. |
| Market profile | future `world.market_profiles` | Owns descriptive availability, scarcity, seasonality, prestige, restriction, and perishability bands; owns no exact price or runtime state. |
| Profession | future `civilization.professions` | Owns occupational identity and industry/tool associations; does not own jobs, worker state, membership, or services. |
| Guild | existing `civilization.guilds` plus later local-presence normalization if approved | Owns guild identity, remit, and descriptive membership posture; it is not a profession, shop, or generic institution. |
| Institution | future separate civilization authority | Owns civic, religious, mercantile, scholarly, or administrative identity not covered by a guild; does not inherit guild behavior. |
| Trade-route economy overlay | later `world.trade_routes` or a separately approved economy overlay | Owns descriptive cargo/corridor significance only after physical route and port authority stabilizes. |
| Crafting transformation | existing production-chain recipe profiles until a dedicated crafting authority decision | Owns recipe inputs/outputs and requirements, not settlement supply, market demand, or prices. |
| Runtime economy | existing civilization engine owners | Owns stock, pressure, price resolution, ticks, trade opportunities, transport, and execution; descriptive authority must not duplicate runtime state. |

## 4. Resources vs Commodities

Approve separate future `world.resources` and `world.commodities` collections, but do not implement either before an item-identity reconciliation decision.

- A resource is a natural or primary source authority such as timber, ore, fish, stone, clay, herbs, wool, grain, salt, flax, hides, or reeds.
- A commodity is a standardized bulk tradable form or economic class such as timber lots, ore loads, grain sacks, dried fish, wool bales, cloth bolts, pottery crates, lamp oil, or cured hides.
- An item is an individual inventory identity in the existing item-key space.

Resource and commodity records must reference supported item keys or category mappings rather than copy item names, values, inventory properties, or crafting definitions. The later vocabulary decision must determine whether one resource or commodity can map to multiple item keys and must reject ambiguous duplication.

This separation is semantic, not permission to create parallel catalogs immediately.

## 5. Production Profiles

Do not introduce `world.production_profiles` as a new parallel owner.

Current production authority already lives under civilization workplaces and production chains, including workforce jobs, input/output profiles, stages, variants, and recipe profiles. A later production normalization decision may add a focused `civilization.production_profiles` layer only if it removes meaningful duplication or separates place-specific production posture from generic transformation rules.

First-pass production authority may describe industry type, required facility/workplace references, supported inputs, outputs, and provenance. It must reject production ticks, worker assignments, current throughput, stock consumption, output mutation, merchant behavior, prices, ownership, and gameplay effects.

Settlement economy records should reference production/workplace authority or conservative industry tags; they must not embed executable production chains.

## 6. Settlement Economies

Approve `world.settlement_economies` as the first implementation candidate and the next schema-decision target.

Its purpose is to become the canonical descriptive settlement-economy layer for:

- settlement economic roles and specialization;
- local resource and commodity posture;
- descriptive import/export dependencies;
- industry and workplace references;
- market scale and market-profile references;
- guild/institution presence references;
- route/port dependence notes after those authorities stabilize;
- wealth, scarcity, seasonality, and resilience bands;
- provenance and explicit non-runtime notes.

The next decision must not simply copy existing settlement fields into another file. It must choose a current-data transition: which embedded `economicModel`, `tradeDependencyProfile`, `domesticResourceProfile`, `domesticTradeFlows`, `guildPresence`, and `marketTier` claims remain settlement-owned, which move to the new authority, and how validators prevent dual ownership. No compatibility aliases or migration-only behavior are authorized.

Settlement economy records must not contain stock counts, current supply/demand, prices, merchant offers, shop inventories, worker state, production rates, income, runtime trade state, or gameplay effects.

## 7. Market Profiles

Keep future `world.market_profiles` descriptive-only and price-free throughout `0.5.x`.

Allowed first-pass concepts include availability, abundance, scarcity, import dependence, local specialty, seasonality, perishability, prestige, restriction, market scale, and market-access posture as enums, bands, references, or prose.

Exact prices and price formulas are forbidden in the first implementation phase. New market-profile and settlement-economy schemas must reject fields such as `basePrice`, `buyPrice`, `sellPrice`, `priceFloor`, `priceCeiling`, `dynamicPriceFormula`, and equivalent exact-value fields.

This boundary is prospective. Existing item `baseValue`, `market_item_values`, economy rules, runtime price views, and economy clarity projections remain live and unchanged. They are current value/runtime owners and must not be copied into new descriptive profiles.

## 8. Professions, Guilds, and Institutions

Model professions, guilds, and institutions as separate authority layers.

- Professions own occupational vocabulary, not worker instances, jobs, guild membership, services, or unlock behavior.
- Workplace `job.*` ids remain workforce/runtime-role vocabulary until a dedicated profession-to-job mapping decision.
- Guilds retain their existing broad `civilization.guilds` authority. Local settlement guild presence must reference that authority in any future normalization rather than inventing new guild types.
- Institutions require a separate future authority decision for civic, religious, mercantile, scholarly, or administrative bodies not owned by guilds.

None of these authorities may grant membership, rank, wages, training, shop access, discounts, contracts, services, law powers, favorability, alignment, ownership, or gameplay effects in their first pass.

## 9. Crafting Integration Boundary

Keep crafting recipes separate from macroeconomic authorities.

Current recipe-like authority is embedded in civilization production chains. No standalone crafting content/schema directory exists. A later crafting authority decision must determine whether recipe profiles should remain embedded or move to a dedicated crafting collection; this economy decision does not choose or implement that transition.

Recipes own transformations and requirements. Settlement economies and market profiles may later reference recipe, material, resource, commodity, workplace, or industry authority for descriptive availability only. They must not copy recipe steps, consume inputs, create outputs, assign workers, calculate craft values, or drive demand.

## 10. Trade Route Economy Overlay Boundary

Defer trade-route economy overlays until physical route authority stabilizes under `docs/design/world-geography-authority-boundary-decision.md` and its follow-up route lane.

The future overlay may describe corridor importance, endpoint markets, dominant cargo classes, seasonality, disruption risks, and port/road/river dependencies. It must reference canonical routes, route segments, crossings, and qualified ports; it must not define physical topology.

Existing settlement trade flows, travel-network route records, ship routes, trade runtime, transport runtime, and trade opportunity resolution remain unchanged. They do not authorize a new overlay before route ownership is settled.

## 11. Property, Estates, Law, Taxes, and Political Economy Boundary

Keep property, estates, inheritance, ownership, rent, taxes, tariffs, tolls, customs, monopolies, restricted goods, smuggling, discounts, favorability, and alignment outside first-pass economy authority.

Future records may include carefully scoped descriptive notes or references only after the relevant polity, law, family, estate, ownership, guild, or institution authority exists. They must not collect income, transfer ownership, impose or calculate taxes, enforce restrictions, change access, grant discounts, alter relationships, or emit commands/events/rewards.

## 12. Knowledge Integration Boundary

Economy Knowledge remains informational until a dedicated Knowledge subject decision approves exact subject types and canonical collections.

Future snippets may identify resources, commodities, settlement economies, market profiles, professions, guilds, institutions, recipes, or trade-route significance only after their authorities exist and are validator-supported. No `knowledge_domain.economy` or shortcut subject is approved here.

Economy Knowledge must not grant prices, discounts, trade access, crafting bonuses, production output, income, stock visibility, merchant behavior, law exemptions, favorability, alignment, or gameplay rewards.

## 13. First Implementation Candidate

The first implementation candidate is `world.settlement_economies`, beginning with a documentation-only schema decision rather than a schema file.

The next run should be:

`Version 0.5.199 - Settlement Economy Schema Decision`

It must decide the future path and collection id, strict record identity, settlement reference, lifecycle status, descriptive fields and bands, canonical reference families, provenance, forbidden fields, validation ownership, and current-data transition from embedded settlement economy fields. It must not create a schema, validator, content file, test, runtime adapter, compatibility alias, or migration behavior.

## 14. Future Validation Direction

Later schema and validator work should be staged separately and eventually enforce:

1. strict records-only wrappers and canonical id/slug agreement;
2. unique settlement-economy identity and one-record-per-settlement policy;
3. canonical settlement and active-parent resolution;
4. valid resource, commodity, industry, workplace, guild, institution, route, port, and market-profile references only after each authority exists;
5. no duplicate ownership with embedded settlement economy fields;
6. resource/commodity/item mapping coherence;
7. price-free market and settlement authority;
8. descriptive-only production references rather than embedded executable chains;
9. provenance and explicit boundary notes;
10. rejection of stock, merchant AI, shop inventory, production tick, price, ownership, tax, law, command, event, reward, UI, storage, runtime, and gameplay fields.

No schema, validator, test, or content-lint change is authorized by this decision.

## 15. Temporary Research Artifact Handling

`docs/dev/tmp-economy-systems-research-2026-06-20.md` was consumed as planning input and remains a temporary guardrail, not final design canon.

Keep it through `0.5.199` because it contains field candidates and later resource, commodity, market, profession, institution, crafting, property, law, and Knowledge questions not fully owned by this boundary document. The schema-decision run must delete it if all useful guidance has been promoted, or retain it only with a named next consumer and removal condition.

## 16. Non-Goals

- no schema, validator, content JSON, Knowledge registry/snippet, or test changes;
- no map or geography authority changes;
- no runtime system, UI, storage, market simulation, trade simulation, production tick, merchant AI, shop inventory, or stock-count changes;
- no dynamic prices, exact price tables, or new price formulas;
- no crafting implementation or recipe migration;
- no ownership, property, estate, inheritance, rent, tax, tariff, toll, customs, law-enforcement, discount, favorability, or alignment behavior;
- no command, event, reward, service, access, or gameplay behavior;
- no migration, compatibility alias, or deletion of existing economy content/runtime owners;
- no transition to `0.6.0`.

## 17. Next Recommended Version

`Version 0.5.199 - Settlement Economy Schema Decision`

That run should remain documentation-only and resolve the embedded-settlement ownership boundary before any schema or content implementation.
