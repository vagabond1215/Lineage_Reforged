# Settlement Economy Schema Decision

Version: `Version 0.5.227 - Settlement Economy Schema Decision`

Status: approved documentation-only schema posture

## 1. Decision Summary

Approve future `world.settlement_economies` as the canonical authored descriptive settlement-level economy collection.

`Version 0.5.199 - Settlement Economy Schema Decision` is a historical unlanded label remapped by the consolidated pipeline. This completed decision is `Version 0.5.227`; future coordination must not present `0.5.199` as current guidance.

The first implementation candidate is a strict records-only identity and posture schema at `packages/schemas/world/settlement-economy.schema.json`, with eventual content at `packages/content/base/world/settlement_economies.json`. Records use `settlement_economy.<settlement_slug>`, reference exactly one canonical settlement, and follow a one-record-per-settlement rule.

The initial schema must land content-free and remain outside normal content-lint registration. A later seed plan must select explicit records and authorize content creation and registration. No current settlement fields move in the schema pass.

Future settlement-economy authority owns economic identity, specialization, market organization, descriptive bands, non-topological import/export posture, supported canonical item posture, and references to existing production authorities. Settlement infrastructure retains `marketTier`; route/trade authority must eventually own trade topology; local guild/institution presence remains outside this collection. Validators must prohibit dual ownership when a later migration is explicitly approved.

All records remain descriptive-only. No exact prices, stock, current supply/demand, production execution, market/trade simulation, transaction, runtime, UI, storage, command, event, reward, service, property, law, tax, or gameplay behavior is authorized.

## 2. Live Repo Reality

Live inspection establishes:

- `world.settlements` contains 88 records. Every record currently requires `economicModel`, `tradeDependencyProfile`, `domesticResourceProfile`, `domesticTradeFlows`, `guildPresence`, and `infrastructureProfile.marketTier`.
- Those records contain 155 domestic trade-flow entries and 244 local guild-presence entries.
- Settlements have no lifecycle `status`. Under current-data policy, a validated present settlement is the resolvable active authority.
- `civilization.workplaces` contains 58 records with workforce jobs, tools, input/output profiles, tiers, upgrades, market/integration metadata, and execution-oriented rates.
- `civilization.production_chains` contains 121 records with stages, inputs, outputs, variants, and embedded recipe profiles. It is live content with custom semantic lint rather than a dedicated JSON Schema file.
- `civilization.guilds` contains 18 broad guild identities. Settlement `guildPresence.guildType` is validated against them, while local names and presence details remain embedded settlement claims.
- `items.items` contains 1,372 canonical item records. `civilization.market_item_values` contains 1,617 value records with canonical item keys where required, `baseValue`, currency, marketability, and pricing profiles.
- `civilization.economy_rules` contains six exact price-rule records with floors, ceilings, volatility, and elasticity.
- Nine regional ecology profiles contain descriptive supply strengths, demand pressures, imports, exports, and resource context. No separate `world.resources` or `world.commodities` authority exists.
- One authored travel network owns current paths, routes, lanes, modes, distances, and travel estimates.
- Civilization engine modules already own economy aggregation, supply/demand, settlement market state, stock pressure, price views, trade opportunities, caravan transport, stock adjustments, and production/crafting estimates.
- The UI economy-clarity projection presents prices, scarcity, trade, and crafting estimates without becoming authority.
- No Economy Knowledge domain, registry entry, or shortcut subject authority exists.

This pass does not remove, rename, copy, migrate, or reinterpret any live field or owner.

## 3. Existing Settlement, Workplace, Production, Guild, Item, Market Value, Economy Rule, Trade, Travel, Runtime, and Knowledge Surface Inventory

Current owners remain authoritative for their existing responsibilities:

- `world.settlements` owns settlement identity, hierarchy, geography, site/population context, infrastructure, and the current embedded descriptive economy bundle;
- `civilization.workplaces` owns generic facility, workforce, tool, input/output, tier, upgrade, and job posture;
- `civilization.production_chains` owns generic staged transformations and current embedded macro recipe profiles;
- `civilization.guilds` owns broad guild identity, remit, membership posture, facilities, and quest-board posture;
- `items.items` owns item identity and item-local values where present;
- `civilization.market_item_values` owns the current centralized item value snapshots and pricing-profile metadata;
- `civilization.economy_rules` owns current exact pricing constraints and elasticity/volatility inputs;
- regional ecology owns environmental supply/demand context, not settlement economy records;
- `world.travel_networks` owns current route and lane topology;
- civilization runtime owns stock, pressure, prices, ticks, aggregation, trade selection/execution, transport, market state, and crafting estimates;
- economy-clarity presentation owns read-only labels and warnings derived from explicit runtime/value inputs;
- Knowledge remains informational and has no Economy authority.

Future settlement-economy records consume stable references from these owners. They do not replace their identity, transformation, value, topology, state, or presentation contracts.

## 4. Settlement Economy Collection Posture

Future `world.settlement_economies` owns one optional authored descriptive economy profile for a canonical settlement.

Its purpose is to state durable economic character: role, specialization, market organization, broad wealth/resilience/scarcity/seasonality posture, import/export dependence, explicitly supported item posture, and associations with existing generic workplaces, production chains, and broad guilds.

Absence of a record means no separate authored settlement-economy profile exists. It must not trigger inference from settlement type, population, infrastructure, ecology, guilds, workplaces, prose, map position, route access, or runtime state.

The collection is not a market-state snapshot, production plan, trade graph, shop catalog, tax code, property ledger, service registry, or simulation configuration.

## 5. Candidate Paths, Wrapper, Ids, Slugs, Settlement References, and Record Lifecycle

Approve this future contract:

- content path: `packages/content/base/world/settlement_economies.json`;
- schema path: `packages/schemas/world/settlement-economy.schema.json`;
- logical collection: `world.settlement_economies`;
- wrapper: strict object with exactly `records`;
- record id: `settlement_economy.<settlement_slug>`;
- slug: lower snake case exactly matching the referenced settlement slug;
- settlement reference: required `settlementId` using `settlement.<slug>`;
- cardinality: at most one settlement-economy record per settlement;
- lifecycle: required `status` with `planned`, `active`, or `retired`.

The record id suffix, record slug, referenced settlement id suffix, and canonical settlement slug must agree. The referenced settlement must exist. Because settlements currently lack lifecycle status, present validated settlements count as active references; if settlement lifecycle is added later, only active settlements may support active settlement-economy records.

The reference does not copy settlement name, hierarchy, region/locality/hex anchors, population, geography, infrastructure, travel nodes, ownership, or runtime state.

## 6. Minimum Settlement Economy Record Contract

Approve this first-pass record posture:

- `id`: required `settlement_economy.<settlement_slug>`;
- `slug`: required matching lower-snake-case settlement slug;
- `settlementId`: required canonical settlement reference;
- `summary`: required concise descriptive economic identity;
- `economicRole`: required object with one controlled `dominantRole` and duplicate-free `secondaryRoles`;
- `specializationTags`: required duplicate-free conservative snake-case tags;
- `marketScale`: required `minimal`, `local`, `district`, `regional`, or `major`;
- `marketOrder`: required `informal_exchange`, `periodic_market`, `permanent_market`, or `regional_exchange`;
- `economicBands`: required wealth, resilience, scarcity, and seasonality bands;
- `tradePosture`: required descriptive import/export/dependency bands and notes, without partners or routes;
- `itemPostures`: required array, empty when none, using canonical supported item keys and controlled descriptive roles;
- `industryPosture`: required object containing duplicate-free existing workplace/production-chain references and conservative industry tags;
- `guildRefs`: required array, empty when no exact broad guild association is explicitly supported;
- `routeDependenceNotes`: required descriptive array, empty when none, with no topology references;
- `status`: required `planned`, `active`, or `retired`;
- `sourceAuthorityNotes`: required non-empty provenance notes;
- `notes`: required descriptive array, empty when none.

First-pass wealth, resilience, scarcity, seasonality, import, export, and dependency vocabularies use controlled qualitative bands rather than numeric scores. The schema decision does not authorize settlement-economy content or settle seed values.

## 7. Embedded Settlement Economy Field Transition Boundary

Current settlement data remains authoritative until a separate migration/removal pass is explicitly approved. Future ownership is divided as follows:

- `economicModel`: its durable role and specialization claims move conceptually to `world.settlement_economies`. A later migration must translate and authority-check them rather than copy the object unchanged.
- `tradeDependencyProfile`: import/export/dependency posture moves conceptually to settlement economies. Numeric biases and `routeAccess` do not. Route access belongs to travel/route authority; exact numeric simulation inputs remain current until separately redesigned or retired.
- `domesticResourceProfile`: supported item-level local specialty, import, export, and constrained-supply claims may move only when they resolve to canonical item keys. Resource/commodity-like free-form strings must wait for `world.resources` or `world.commodities` and cannot be copied into the new collection.
- `domesticTradeFlows`: remains current embedded transitional authority. Partner, direction, goods, and route-mode claims must later move to stable route/trade overlay authority, not settlement economies.
- `guildPresence`: remains current embedded settlement-local presence authority. A settlement economy may reference an existing broad `guild.<slug>` only when explicit canon supports association; it must not copy local names/functions/presence levels or infer institutions.
- `infrastructureProfile.marketTier`: remains settlement-owned physical/civic market infrastructure. Settlement-economy `marketScale` and `marketOrder` describe economic reach and organization and must not duplicate or calculate the infrastructure tier.

No dual ownership is permitted after a future transition. The later schema/validator pass may validate only the new collection in isolation. A later current-data migration must atomically add approved records, remove migrated embedded claims from the settlement schema/content, update consumers, and add cross-collection checks. Compatibility aliases and indefinite mirrored fields are prohibited.

## 8. Descriptive Economy Fields, Bands, Market Scale, Imports, Exports, Industries, Scarcity, Seasonality, and Resilience Posture

Allowed descriptive concepts are:

- controlled dominant and secondary economic roles;
- conservative specialization and industry tags;
- market scale and market order;
- qualitative wealth, resilience, scarcity, and seasonality bands;
- qualitative import, export, and dependency bands;
- canonical item posture roles such as `local_specialty`, `regular_import`, `regular_export`, and `constrained_supply`;
- existing workplace and production-chain references;
- exact broad guild references where authored evidence exists;
- route/port dependence prose that does not identify topology or assert unsupported infrastructure;
- provenance and notes.

Bands describe durable authored posture, not current calculated state. `scarcity` cannot mean current stock shortage, `wealth` cannot mean treasury/income, `resilience` cannot drive failure or recovery, and `seasonality` cannot run a calendar tick.

Do not add numeric specialization weights, import/export biases, stock thresholds, rates, capacities, price bands expressed as currency, or free-form goods catalogs.

## 9. Price, Stock, Supply, Demand, Transaction, Runtime Market, and Trade Simulation Boundary

First-pass settlement-economy records must reject:

- stock counts, reserves, current inventory, shop inventory, or merchant offers;
- current or dynamic supply/demand, pressure sources, shortages, surpluses, or trade opportunities;
- `baseValue`, base/buy/sell prices, price floors/ceilings, formulas, volatility, elasticity, discounts, or currency amounts;
- worker assignments, labor state, throughput, production rates/ticks, consumption, outputs, income, expenses, or treasury state;
- current caravans, cargo, journeys, transport state, trade state, or transactions;
- UI/view-model state, storage/save state, commands, events, rewards, or effects.

Existing runtime/value systems retain all such ownership. Qualitative authored bands may inform a future runtime only after a dedicated integration decision; they have no behavior in `0.5.x`.

## 10. Resource, Commodity, Item, Market Value, Economy Rule, and Market Profile Boundary

Future `world.resources` and `world.commodities` remain separate semantic authorities. Neither exists now. Settlement economies must not create them implicitly through resource names, commodity names, pseudo-ids, aliases, or unrestricted goods strings.

`itemPostures` may use only canonical item keys proven by `items.items` under existing canonical-item validation policy. An item reference states descriptive local posture only. It does not copy item identity, `baseValue`, marketability, currency, pricing profile, inventory metadata, or crafting behavior.

Existing `civilization.market_item_values`, item-local values, currencies, `civilization.economy_rules`, and runtime price views remain current value/price owners.

Future `world.market_profiles` remains a separate price-free descriptive layer. Settlement economies must not embed market-profile definitions or create `marketProfileId` until that authority exists. `marketScale` and `marketOrder` are narrow settlement-level posture, not a bundled market profile.

## 11. Workplace, Production Chain, Profession, Guild, Institution, Crafting, Recipe, and Service Boundary

Settlement economies may reference existing `workplace.<slug>` and `chain.*` authorities in `industryPosture`. Those references indicate durable local relevance only. They do not instantiate workplaces, execute chains, assign workers, consume inputs, produce outputs, select variants, or authorize crafting.

Conservative industry tags may cover explicit canon that lacks a precise current reference. They must not masquerade as workplace, profession, guild, institution, resource, commodity, recipe, or service ids.

Existing `civilization.guilds` remains broad guild authority. `guildRefs` cannot be derived from workplace `job.*` ids, settlement prose, local guild names, or shared activities. Existing jobs remain workforce-role identifiers, not professions. Future `civilization.professions` and institutions require separate decisions.

Existing production-chain recipe profiles and future `crafting.recipes` retain their owners. Settlement economies cannot embed recipes, requirements, unlocks, quality, repair/salvage, commissions, or crafting estimates.

Services, vendors, shops, lodging, training, repair, and access remain separate future authorities/runtime behavior.

## 12. Route, Port, Road, River, Travel, Logistics, Property, Estate, Law, Tax, Polity, Family, Knowledge, Quest, Chronicle, Player-State, UI, Storage, Command, Event, Reward, and Gameplay Boundary

Settlement economies may contain descriptive route/port dependence notes only. They must not define or reference topology until stable route, crossing, port, and later trade-route authorities exist. Roads, rivers, lanes, paths, travel modes, distance, pathfinding, journeys, security, hazards, cargo, warehouses, transport, and logistics execution remain separate.

Property, estates, ownership, businesses, storage, rent, law, taxes, tariffs, tolls, customs, restricted goods, smuggling, licenses, discounts, favorability, alignment, access, and political economy remain descriptive/deferred topics requiring their own owners. No current polity, family, household, guild, or settlement reference grants these claims.

Economy Knowledge remains informational and unimplemented. This decision does not approve `knowledge_domain.economy`, an Economy registry entry, shortcut subjects, snippets, evidence, unlocks, or effects.

Quests and Chronicles may later describe economic context but cannot mutate economy authority. Player/account state, reputation, rewards, services, UI, storage, commands, events, and gameplay behavior remain outside this collection.

## 13. Future Schema and Validator Direction

`Version 0.5.239 - Settlement Economy Schema And Validator` remains the conditional implementation candidate after the docs-first queue.

That pass should create only:

- `packages/schemas/world/settlement-economy.schema.json`;
- a pure focused semantic validator;
- focused in-memory tests and schema-file registration if required by repository convention.

It must not create `settlement_economies.json`, migrate settlements, register a live collection in normal content lint, load runtime data, add market profiles/resources/commodities/professions/institutions, or change behavior.

Future validation should enforce strict wrapping, unique ids/slugs, exact settlement suffix agreement, one record per settlement, active settlement resolution under current-data policy, controlled vocabularies, duplicate-free references, canonical item-key resolution, existing workplace/chain/guild resolution, and rejection of all forbidden value/runtime fields.

Cross-owner validation must fail closed: no free-form resource/commodity ids, no inferred profession/institution/guild, no route topology, no settlement identity duplication, and no market/profile/value duplication. A later seed plan must precede content and normal registration.

## 14. Temporary Research Artifact Handling

Delete `docs/dev/tmp-economy-systems-research-2026-06-20.md` in this pass.

Its useful economy-layer taxonomy, settlement overlap questions, resources/commodities distinction, production/workplace boundaries, market-profile posture, profession/guild/institution separation, trade/logistics boundary, exact-price/runtime exclusions, Knowledge posture, and sequencing guidance are now permanently owned by `docs/design/economy-authority-boundary-decision.md`, this decision, the pipeline authority, and the future-content backlog.

No named future consumer remains. Future economy work must start from permanent decisions and a fresh live-repo audit.

## 15. Non-Goals

- no schema, validator, content JSON, test, loader, normal content-lint registration, migration, compatibility alias, or settlement record change;
- no settlement-economy seed, market profile, resource, commodity, profession, institution, workplace, production-chain, crafting, recipe, item, market-value, economy-rule, currency, or price-view change;
- no trade-route, port, crossing, road, river, lane, journey, travel-network, route-security, hazard, warehouse, logistics, transport, or pathfinding authority change;
- no Knowledge registry/domain/snippet/evidence behavior;
- no property, estate, ownership, business, law, tax, tariff, toll, customs, restricted-goods, smuggling, discount, favorability, alignment, access, service, reward, transaction, command, event, UI, storage, runtime, or gameplay behavior;
- no dynamic price, stock, supply/demand, market/trade/production tick, merchant AI, shop inventory, caravan, cargo, or simulation change;
- no new Deep Research and no transition to `0.6.0`.

## 16. Next Recommended Version

Proceed with `Version 0.5.228 - World Map Feature Authority Schema Decision`.

That pass remains documentation-only. It should define the exact geometry-free `world.map_features` contract, preserve visual geometry/place/route/political/ecology/POI/grid boundaries, and decide the temporary world-map research artifact's retirement.

No new GPT Deep Research is required before `0.5.228`. GPT-DR labels remain non-Codex labels and do not consume numbered `0.5.x` versions.
