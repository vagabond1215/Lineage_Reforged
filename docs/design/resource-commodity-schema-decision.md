# Resource And Commodity Schema Decision

Source version/run: Version 0.5.288 - Resource And Commodity Schema Decision
Date: 2026-07-07

## 1. Decision summary

Select Option C: approve separate future static authorities for `world.resources` and `world.commodities` in principle, with implementation deferred.

This run is documentation-only. It does not create resource content, commodity content, schemas, validators, tests, runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, or gameplay behavior.

The distinction is:

- `items.items` owns individual inventory item identity and canonical item keys.
- Future `world.resources` may own natural/source material identity and environmental compatibility.
- Future `world.commodities` may own bulk trade or economic class identity.

Future resource and commodity records may relate to canonical item keys, but they must not replace item keys, rename items, copy item values, create stock, set prices, move cargo, execute gathering, execute crafting, run trading, or imply services.

The immediate next route remains `Version 0.5.289 - Combat Status Condition And Injury Boundary Decision`. A later resource/commodity implementation still requires a separate docs-first schema plan and seed plan.

## 2. Current completed-state posture

Latest completed primary before this run:

- `Version 0.5.287 - Service Authority Boundary Decision`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Current run:

- `Version 0.5.288 - Resource And Commodity Schema Decision`

Next primary route selected by this decision:

- `Version 0.5.289 - Combat Status Condition And Injury Boundary Decision`

Deferred:

- `Version 0.5.290 - Static Authority Validation Consolidation Audit`

The Highcrown settlement Knowledge lane remains closed from `Version 0.5.285 - Highcrown Settlement Knowledge Lane Closure Review`. This decision does not reopen it.

## 3. Existing resource and commodity-like surfaces

Current docs and content already contain resource and commodity-like concepts without separate resource or commodity authorities:

- `items.items` contains 1,372 canonical item records. Item classes include `commodity`, `consumable`, `tool`, `armor`, `weapon`, `vehicle`, `clothing`, and `accessory`. Item roles include `material`, `ingredient`, `reagent`, `trade_good`, `fuel`, and `consumable`; item stages include `raw`, `refined`, `processed`, and `finished`.
- `civilization.market_item_values` contains 1,617 economy-owned value records keyed by canonical item keys. It remains the current value/price metadata owner.
- `civilization.production_chains` contains 121 macro-production records with 274 distinct item-key strings, all resolving to current item keys. It also uses 49 workplace stage references and 22 extraction-like stage references. These are macro-production and source-stage descriptors, not resource authority.
- `crafting.recipes` currently has 12 planned standard recipes using 20 distinct item keys, all resolving to current item keys. Recipes remain player-facing static transformations, not resource or commodity definitions.
- `world.settlements` has embedded settlement economy fields with free-form local supply, demand, import, export, and domestic trade-flow goods strings. A read-only scan found 194 distinct settlement goods terms, with many terms not resolving to current item keys, such as service, repair, route, raw-good, and bulk-good phrases.
- `world.regional_ecology_profiles` contains nine records with descriptive supply strengths, demand pressures, domestic strengths/gaps, native flora/fauna references, climate/biome/habitat references, and resource diversity bands. These records describe environmental/economic context; they do not define resource ids.
- Current environmental content includes 36 biomes, 93 habitats, 117 flora records, and 132 fauna records. Flora and fauna records contain harvest/output/ecology descriptors, but they are species/profile authorities, not canonical resource nodes or commodity classes.
- `world.world_hexes`, map features, travel networks, route/security, settlement sites, buildings, workplaces, and service decisions all contain adjacent references or implications, but none currently owns static resource or commodity identity.

## 4. What "resource" means

A resource is a stable natural, ecological, geological, agricultural, or primary source material identity.

Examples include timber, hardwood, reeds, flax, wool, hides, grain, herbs, fish, clay, stone, salt, iron ore, copper ore, coal, resin, dye plants, pearls, and comparable source materials.

A future static resource record answers:

- what the source material is;
- which broad resource family it belongs to;
- which ecological, geographic, biome, habitat, flora, fauna, mineral, or settlement-economy contexts may reference it;
- which canonical item keys can represent it when inventoried, processed, or traded;
- what provenance supports the identity.

A static resource record does not answer:

- where the current node is;
- how much is available;
- whether it is depleted;
- whether a player can harvest it;
- what tool is used right now;
- what item instances are created;
- what it costs;
- what cargo moves;
- what crafting/trading/service action executes.

## 5. What "commodity" means

A commodity is a stable bulk trade form, market class, or economic aggregation of goods.

Examples include grain sacks, timber lots, ore loads, wool bales, cloth bolts, stone blocks, dried fish, cured hides, lamp oil, pottery crates, trade livestock, arms, tools, and prestige-goods classes.

A future static commodity record answers:

- what bulk or trade class is being described;
- what broad commodity family it belongs to;
- which resource ids, item keys, production chains, settlement-economy profiles, or market contexts may reference it;
- what general handling or perishability posture describes it;
- what provenance supports the identity.

A static commodity record does not answer:

- current stock;
- vendor inventory;
- cargo location;
- shipment state;
- exact price;
- payment;
- route execution;
- transaction results;
- delivery completion;
- runtime market behavior.

## 6. Resources, commodities, and items

`items.items` remains the canonical item identity owner. It owns item id, item key, name, item class, roles, tags, stage, base value, value profile, marketability, material difficulty metadata, consumable/spoilage references, and current item-local use metadata.

Resources and commodities must not duplicate item records.

Future resource and commodity records may reference item keys in carefully scoped mapping fields:

- resource to raw/refined/processed item keys, when a resource can become inventory;
- commodity to representative item keys, when a trade class is represented by concrete items;
- commodity to resource ids, when a bulk trade class aggregates source materials.

Those mappings are descriptive relationships. They do not migrate item identity, authorize item-key aliases, create new item keys, copy item values, infer market coverage, or create item instances.

Because live settlement and ecology strings include free-form terms that do not all resolve to item keys, implementation must wait for a separate schema plan that defines id patterns, mapping cardinality, failure modes, and seed rules.

## 7. Resources, commodities, and services

Resources and commodities identify materials and trade classes. Services identify offered capabilities.

Examples:

- timber is a resource;
- timber lots are a commodity;
- hauling, warehousing, ferrying, repairing, trading, and market exchange are services.

Future resource and commodity records must not own service provider identity, provider availability, access gates, fees, stock, transactions, storage contents, repair/training/healing effects, route traversal, law/reputation checks, UI menus, runtime commands, or gameplay behavior.

The deferred future service catalog from `Version 0.5.287` remains separate and may only own provider-independent service vocabulary if later implemented.

## 8. Options considered

Option A: defer both resource and commodity authorities entirely.

This is safest in the short term because item keys already support recipes, production chains, and market values. It is rejected as the long-term posture because current settlement and ecology records already use many resource/commodity-like terms without one stable vocabulary.

Option B: approve one combined resource/commodity authority.

This would create a single collection for source materials and trade forms. It is rejected because natural/source identity and bulk market/trade class identity have different owners, references, and validation needs. Combining them would blur ecology/gathering with markets/cargo.

Option C: approve separate future `world.resources` and `world.commodities` static authorities, implementation deferred.

This keeps item keys canonical, gives future ecology/economy/crafting/trade records stable vocabulary, and avoids putting stock, prices, cargo, services, or runtime behavior into static records.

## 9. Selected option and rationale

Option C is selected.

Separate resource and commodity authorities match the existing economy boundary: resources identify source materials and geography/ecology compatibility; commodities identify bulk tradable forms or economic classes; items remain individual inventory identity.

Implementation remains deferred because the live repo has mixed forms:

- canonical item keys in items, recipes, production chains, and market values;
- free-form settlement goods strings;
- ecology supply/demand prose and broad terms;
- extraction-stage references in production chains;
- service-like terms mixed into settlement economy strings.

A schema/content pass before a dedicated schema plan would risk creating aliases, duplicating item keys, baking in free-form goods names, or implying trade/service behavior.

## 10. Static resource authority boundary

A future `world.resources` record may define:

- stable id, likely `resource.<slug>`;
- slug and display name;
- resource family/category;
- non-executing summary;
- controlled tags;
- source nature, such as wild, cultivated, husbanded, mined, quarried, harvested, fished, gathered, or magical-natural, if later approved;
- broad ecological/geographic compatibility references after those validation contracts are chosen;
- optional flora, fauna, mineral, habitat, biome, regional ecology, or map-feature references where exact authorities exist;
- descriptive extraction/gathering posture;
- canonical item-key mappings for inventory forms, if unambiguous;
- provenance and notes.

A future `world.resources` record must never define:

- current node locations, quantities, depletion, regrowth timers, refresh rates, harvest rolls, or player discovery state;
- runtime gathering, mining, hunting, fishing, farming, cutting, quarrying, or extraction behavior;
- required current tools, owned tools, tool durability, player skill checks, or active labor state;
- item instances, current inventory, ownership, storage, cargo, or settlement stock;
- production/crafting execution, recipe steps, output generation, quality rolls, repair/salvage, or item mutation;
- prices, values, payment, market pressure, vendor stock, shop offers, taxes, tolls, or transaction behavior;
- service provider identity, access rules, UI menus, commands, events, rewards, save state, or gameplay effects.

## 11. Static commodity authority boundary

A future `world.commodities` record may define:

- stable id, likely `commodity.<slug>`;
- slug and display name;
- commodity family/category;
- non-executing summary;
- controlled tags;
- broad trade form, such as bulk raw good, processed lot, refined material, food staple, preserved good, livestock class, manufactured good, luxury good, reagent class, or fuel class, if later approved;
- optional related resource ids;
- optional canonical item-key mappings for representative inventory forms;
- optional production-chain or settlement-economy reference posture after those contracts are chosen;
- broad handling descriptors such as perishable, fragile, bulky, regulated, hazardous, prestige, staple, or seasonal, as descriptive vocabulary only;
- provenance and notes.

A future `world.commodities` record must never define:

- exact prices, price formulas, price floors/ceilings, discounts, taxes, tariffs, tolls, payment, or wallet mutation;
- current supply, current demand, stock counts, reserves, vendor inventory, shop offers, restock timing, or merchant AI;
- cargo location, shipment state, caravan/ship contents, warehouse contents, storage occupancy, transport execution, or delivery state;
- trade-route topology, route traversal, travel time, pathfinding, toll collection, customs enforcement, or smuggling execution;
- item instances, ownership, stack movement, container contents, consumption, crafting execution, production ticks, or output creation;
- service execution, access checks, UI menus, commands, events, rewards, save state, runtime state, or gameplay effects.

## 12. Ownership matrix

| Concern | Resource authority posture | Commodity authority posture | Current or future owner |
| --- | --- | --- | --- |
| Item identity | References item keys only. | References item keys only. | `items.items`. |
| Item instances | Forbidden. | Forbidden. | Runtime/save inventory and item-instance owners. |
| Resource identity | Owns static source material vocabulary if implemented. | May reference resource ids only. | Future `world.resources`. |
| Commodity identity | Does not own bulk trade classes. | Owns static trade/economic class vocabulary if implemented. | Future `world.commodities`. |
| Tags/categories | Controlled descriptive vocabulary only. | Controlled descriptive vocabulary only. | Future resource/commodity schemas. |
| Ecology/geography compatibility | May describe broad compatibility and references. | May reference resource/ecology context only descriptively. | Regional ecology, biomes, habitats, flora/fauna, map features, future resource records. |
| Extraction/gathering descriptors | May describe source posture only. | Usually not owned except broad sourcing notes. | Future gathering/extraction/runtime owners execute behavior. |
| Production/crafting references | May be referenced as inputs/source context. | May reference production-chain or item posture descriptively. | `civilization.production_chains`, `civilization.workplaces`, `crafting.recipes`. |
| Recipe execution | Forbidden. | Forbidden. | Future player crafting runtime/save owners. |
| Market/value posture | May inform descriptive availability only. | May describe broad market class only. | Settlement economy, market profiles, market values, economy rules, runtime economy. |
| Vendor/shop stock | Forbidden. | Forbidden. | Future vendor/shop/runtime owners. |
| Cargo/storage descriptors | May describe bulk/handling context only if later approved. | May describe handling posture only. | Future cargo/storage authorities and runtime storage owners. |
| Cargo/storage contents and movement | Forbidden. | Forbidden. | Runtime storage, transport, trade, and save owners. |
| Service interactions | May be consumed by service descriptors only as material context. | May be consumed by services only as goods context. | Future `civilization.services` or descriptor owners, if implemented. |
| Pricing/payment | Forbidden. | Forbidden. | `civilization.market_item_values`, economy rules, runtime transactions. |
| UI/runtime execution | Forbidden. | Forbidden. | UI, command, economy, travel, crafting, inventory, storage, and runtime systems. |

## 13. Required blockers before implementation

Before any resource or commodity schema/content implementation, a fresh docs-first schema plan must resolve:

- exact collection paths, wrappers, id patterns, slug rules, and lifecycle/status vocabulary for both authorities;
- whether both authorities should be planned in one schema plan or split into two schema plans;
- first-pass resource and commodity family vocabularies;
- whether records may be active before complete item-key mappings exist;
- mapping cardinality: one resource/commodity to one item key, many item keys, or none;
- rules for unresolved settlement goods and ecology supply/demand terms;
- relationship to current item `itemClass: commodity`, item roles, item stages, and material difficulty metadata;
- relationship to `civilization.market_item_values` and whether every mapped item key needs value coverage;
- relationship to `crafting.recipes`, production chains, workplaces, and extraction-stage references;
- relationship to regional ecology, flora, fauna, habitats, biomes, minerals, and future gathering/extraction nodes;
- relationship to settlement economies, market profiles, vendors, shops, cargo/storage, travel routes, and service descriptors;
- explicit validation failures for price/payment, stock, item instances, cargo movement, storage contents, runtime extraction, runtime trading, runtime crafting, UI, commands, rewards, save state, and gameplay fields;
- a seed plan proving the first records are small, source-backed, and do not encode free-form aliases or runtime behavior.

## 14. Rejected alternatives

- Jump to resource or commodity schemas/content now: rejected because this run is docs-only and current goods terms require a separate schema plan.
- Combine resources and commodities: rejected because source material authority and bulk trade class authority need different validation and reference boundaries.
- Make resources or commodities replace item keys: rejected because item keys are the current stable contract for inventory, recipes, production chains, and market values.
- Put prices, vendor stock, settlement stock, cargo movement, runtime extraction, runtime trading, or crafting execution into static records: rejected because those are economy/runtime/storage/crafting owners.
- Treat services as commodities: rejected because services are offered capabilities, not goods.
- Reopen Highcrown Knowledge work: rejected because the Highcrown settlement Knowledge lane is closed.

## 15. Explicit non-goals

This decision does not add or edit resource content, commodity content, service content, combat content, Knowledge snippets, Knowledge registry/domain/trial-policy content, content JSON files, schemas, validators, tests, runtime code, UI, storage, commands, events, rewards, migrations, save/account behavior, route/travel behavior, building/workplace/economy behavior, court/law behavior, vendor/market behavior, cargo/storage behavior, settlement/district/site content, anchors, sacred-site/religious-hotspot content, or gameplay behavior.

This decision does not implement `world.resources`, `world.commodities`, or `civilization.services`. It does not authorize migrations, compatibility aliases, item-key conversion, item renames, generated content, normal content-lint registration, or transition to `0.6.0`.

## 16. Validation and audit posture

This run should validate docs-only scope:

- only docs changed;
- no package content, schema, validator, test, runtime, UI, storage, command, event, reward, migration, save/account, route/travel, building/workplace/economy, court/law, vendor/market, cargo/storage, settlement/district/site, sacred-site/religious-hotspot, service/resource/combat, Knowledge, or gameplay files changed;
- `0.5.288` is marked complete in workflow docs;
- `0.5.289 - Combat Status Condition And Injury Boundary Decision` is the immediate next primary route;
- `0.5.290` remains deferred;
- the Highcrown settlement Knowledge lane remains closed context.

## 17. Next recommended version

Version 0.5.289 - Combat Status Condition And Injury Boundary Decision

That run should remain docs-first. It should decide static status, condition, and injury boundaries against current combat, item/equipment, magic, health/resource, save/account, reward, and runtime owners. It must not implement combat status/injury content, schemas, validators, tests, runtime/UI/storage/commands/events/rewards/migrations/save-account behavior, or gameplay behavior unless a later focused implementation prompt explicitly scopes that work.
