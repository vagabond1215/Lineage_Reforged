# Resource And Commodity Authority Schema Plan

Source version/run: Version 0.5.300 - Resource And Commodity Authority Schema Plan
Date: 2026-07-09
Status: documentation-only schema plan

## Purpose

This plan turns the approved `Version 0.5.288 - Resource And Commodity Schema Decision` into a concrete future schema and validation posture for two separate static authorities:

- `world.resources`
- `world.commodities`

This run does not add content, schemas, validators, tests, normal content-lint registration, runtime behavior, UI, save/account state, commands, events, rewards, migrations, gathering, trading, crafting execution, service execution, or gameplay.

## Current Authority Baseline

The current repo already has several nearby owners that must remain separate:

- `items.items` is the canonical individual item identity and canonical item-key authority.
- `civilization.market_item_values` owns market values, pricing profiles, marketability, and value metadata.
- `crafting.recipes` owns player-facing static transformation recipes.
- `civilization.production_chains` and `civilization.workplaces` own macro production descriptors and workplace references.
- `world.settlements` owns current descriptive settlement economy, goods, demand, and domestic-resource profile prose/arrays until a later migration is explicitly approved.
- `world.flora`, `world.fauna`, `world.biomes`, `world.habitats`, regional ecology profiles, map features, world hexes, and travel networks own their current ecology/place descriptors.
- Runtime, save/account, and shared contract types already own stock, cargo, storage, prices, markets, player resources, journey state, and mutable settlement/economy state.

A fresh targeted audit for this plan found:

- `packages/content/base/items/items.json` has 1,372 item records.
- Current item classes include 1,114 `commodity` item-class records, but those are still item records, not the future `world.commodities` authority.
- Current item roles include material, ingredient, reagent, trade good, fuel, and consumable tags.
- Current item stages include raw, refined, processed, and finished.
- `packages/content/base/civilization/market_item_values.json` has 1,617 market value records.
- Some current market value keys, such as `fauna.*` keys, do not resolve to `items.items` item keys and must not be treated as resource or commodity item aliases.
- Current production chains contain item-key-like input/output strings that resolve to item keys, plus `extract.*` stage references that are production-source descriptors, not executable gathering stations.
- A targeted scan of selected settlement goods fields found 140 distinct goods terms; the older 0.5.288 broader scan found 194 terms. Both counts confirm settlement goods language needs later normalization care.
- Current ecology content has 36 biomes, 93 habitats, 117 flora records, and 132 fauna records.
- Current world hexes use descriptive `resourceAffinityTags`; these remain hex descriptors, not canonical resources or commodities.

## Collection Paths

Future content paths:

- `packages/content/base/world/resources.json`
- `packages/content/base/world/commodities.json`

Future schema paths:

- `packages/schemas/world/resource.schema.json`
- `packages/schemas/world/commodity.schema.json`

Future focused validator paths:

- `tools/content-lint/resources.mjs`
- `tools/content-lint/commodities.mjs`

Do not register either collection in normal content lint until live content exists and a separate registration decision approves it.

## Wrapper Posture

Both future content files should use the established records-only wrapper:

```json
{
  "records": []
}
```

The wrapper should reject additional top-level properties.

## Identity Patterns

Resource ids:

- `resource.<slug>`
- Slug format: lower snake case, no aliases, no legacy ids, no migrated ids.

Commodity ids:

- `commodity.<slug>`
- Slug format: lower snake case, no aliases, no legacy ids, no migrated ids.

Each record should include both `id` and `slug`; validators should enforce exact id/slug coherence.

## Lifecycle Vocabulary

Both authorities should use the same first-pass status vocabulary:

- `planned`
- `active`
- `retired`

First seeds should normally start as `planned` unless a later seed plan proves active use and reference needs. `retired` is reserved for current-data cleanup and should not imply compatibility or migration behavior.

## Resource Authority Scope

`world.resources` should define stable source-material identity and environmental/source compatibility vocabulary.

Resources may describe:

- natural or primary source material identity;
- high-level family/category;
- broad occurrence/source domains;
- descriptive tags;
- optional relationships to canonical item keys;
- optional relationships to current ecology/place authorities where validators can resolve exact ids;
- notes about current settlement goods or production descriptors that should be normalized later.

Resources must not define:

- item instance identity;
- prices or values;
- market stock, supply, demand, or pressure;
- node quantities, depletion, respawn, harvest rolls, extraction rates, or gathering execution;
- recipe execution;
- tool requirements as gameplay checks;
- vendor, cargo, storage, ownership, wallet, inventory, or player state;
- UI, commands, events, rewards, runtime effects, or gameplay behavior.

## Resource Record Fields

The first schema should require:

- `id`
- `slug`
- `name`
- `status`
- `family`
- `summary`
- `sourceDomains`
- `allowedOwnerTypes`
- `tags`
- `sourceAuthorityNotes`
- `notes`

The first schema may allow:

- `relatedItemKeys`
- `relatedCommodityIds`
- `relatedFloraIds`
- `relatedFaunaIds`
- `relatedBiomeIds`
- `relatedHabitatIds`
- `relatedRegionIds`
- `relatedMapFeatureIds`
- `relatedProductionStageRefs`
- `observedSettlementGoodsTerms`

Optional relationship fields should stay arrays. Empty arrays are acceptable when the relationship is not yet proven. Avoid free-form object maps.

## Resource Vocabulary

First-pass resource families should be narrow and descriptive:

- `animal_product`
- `clay`
- `dye_material`
- `fiber`
- `fishery`
- `food_crop`
- `fuel`
- `herb`
- `luxury_natural`
- `magical_natural`
- `mineral`
- `reagent`
- `salt`
- `stone`
- `wood`

First-pass source domains should be broad:

- `cultivated`
- `fished`
- `foraged`
- `gathered`
- `husbanded`
- `mined`
- `quarried`
- `salvaged`
- `wild`

Do not add `other`, `misc`, or `custom` categories in the first schema.

## Commodity Authority Scope

`world.commodities` should define stable bulk trade or economic-class identity.

Commodities may describe:

- standardized bulk-trade identity;
- trade category;
- handling tags;
- optional relationships to canonical item keys;
- optional relationships to resource records;
- allowed owner types for future references;
- notes for later settlement economy, market, recipe, workplace, vendor, cargo, or storage integration.

Commodities must not define:

- exact prices, base values, pricing profiles, value profiles, fees, or payment;
- market stock, supply, demand, pressure, restock, vendor inventory, shop inventory, or cargo contents;
- item instances, stacks, current quantities, containers, ownership, durability, or quality;
- settlement runtime economy state;
- crafting execution or production execution;
- service execution;
- UI, commands, events, rewards, runtime effects, or gameplay behavior.

## Commodity Record Fields

The first schema should require:

- `id`
- `slug`
- `name`
- `status`
- `family`
- `tradeCategory`
- `summary`
- `handlingTags`
- `allowedOwnerTypes`
- `tags`
- `sourceAuthorityNotes`
- `notes`

The first schema may allow:

- `relatedItemKeys`
- `relatedResourceIds`
- `relatedProductionChainIds`
- `relatedRecipeIds`
- `observedSettlementGoodsTerms`

Concrete service, vendor, shop, cargo, storage, and settlement-economy references should be deferred until a later seed or integration plan proves exact owner-safe use. The first schema can document those owner types through `allowedOwnerTypes` and notes without adding concrete refs.

## Commodity Vocabulary

First-pass commodity families should be narrow and descriptive:

- `construction_material`
- `fuel`
- `livestock`
- `luxury_good`
- `manufactured_good`
- `maritime_good`
- `metal`
- `preserved_food`
- `raw_bulk`
- `refined_material`
- `reagent_class`
- `staple_food`
- `stone`
- `textile`

First-pass trade categories should be separate from family:

- `bulk_good`
- `crafted_good`
- `foodstuff`
- `industrial_input`
- `luxury`
- `raw_material`
- `strategic_material`

Handling tags should be descriptive:

- `bulky`
- `dry`
- `fragile`
- `hazardous`
- `live`
- `perishable`
- `prestige`
- `regulated`
- `seasonal`
- `secured`
- `staple`

Do not add `other`, `misc`, or `custom` categories in the first schema.

## Allowed Owner Types

Use allowed-owner type vocabulary to describe where future references may appear without making the resource or commodity record own those systems.

Candidate owner types for resources:

- `item`
- `flora`
- `fauna`
- `biome`
- `habitat`
- `region`
- `map_feature`
- `production_chain`
- `settlement_descriptor`

Candidate owner types for commodities:

- `item`
- `resource`
- `production_chain`
- `recipe`
- `settlement_descriptor`
- `settlement_economy`
- `market_profile`
- `vendor_profile`
- `cargo_profile`
- `storage_profile`

`allowedOwnerTypes` should be descriptive only. It must not imply live references, runtime behavior, provider availability, stock, prices, or execution.

## Item-Key Relationship

`items.items` remains canonical item-key authority.

Resource and commodity records may reference item keys only in explicit `relatedItemKeys` arrays. Those keys must resolve to live `items.items` records.

Do not:

- replace item keys with resource or commodity ids;
- copy item values, item branches, item classes, item roles, or use profiles;
- create migration aliases;
- infer resource/commodity records from item ids automatically;
- treat market-only keys as item keys.

## Market-Value Relationship

`civilization.market_item_values` remains the value and pricing owner.

Resource and commodity records must not copy:

- `baseValue`
- `currencyId`
- `valueUnit`
- `marketable`
- `valueProfile`
- `pricingProfile`
- `pricingMode`
- demand bands
- source value notes

Future validators may optionally check that item-key relationships have market coverage when a later seed plan requires it, but market coverage is not part of identity.

## Crafting And Production Relationship

`crafting.recipes` remains the player-facing recipe authority.

`civilization.production_chains` and `civilization.workplaces` remain macro-production and workplace descriptor authorities.

Resource and commodity records may later reference production chains or recipes descriptively. They must not own:

- inputs and outputs as executable transformations;
- skill checks;
- tool checks;
- station requirements;
- batch sizes;
- recipe unlocks;
- production rates;
- worker assignments;
- quality, affix, repair, salvage, alchemy, or enchanting execution.

The first schema should allow production-chain and recipe references only where the validators can resolve exact ids and the relationship remains descriptive.

## Ecology And Geography Relationship

Resource records may eventually reference flora, fauna, biomes, habitats, regions, and map features where current authorities provide exact ids.

Do not infer ecology references from prose, tags, or market-only keys. Do not make resource records own spawning, foraging, hunting, harvesting, population, seasonality, depletion, encounter, pathfinding, or map-reveal behavior.

For `Version 0.5.301`, concrete ecology/geography reference support should be implemented only if the validator can load and resolve the relevant current authority files cleanly. Otherwise, keep the field out of the first schema and use notes until a later plan.

## Settlement And Economy Relationship

Current settlement goods and domestic resource fields are descriptive settlement-owned data.

The first resource/commodity schema should not migrate settlement fields. Later seed planning may record observed settlement goods terms as evidence for candidates, but the live settlement records remain authoritative until an explicit migration/removal pass.

Settlement economy, market profiles, vendor/shop profiles, cargo profiles, and storage profiles remain separate current or future owners. Resource and commodity records may define stable vocabulary that those systems can reference later.

## Services Relationship

The live `civilization.services` authority is provider-independent service vocabulary only.

Services are not resources or commodities. Resource and commodity records should not reference services in the first schema. If a later integration needs to say a service handles a commodity, that relationship should be owned by the service/provider/settlement/market layer selected for that behavior.

## Forbidden Fields

Future resource and commodity validators should recursively reject fields whose names or shapes imply forbidden ownership.

Forbidden examples include:

- `baseValue`
- `currencyId`
- `valueUnit`
- `valueProfile`
- `pricingProfile`
- `pricingMode`
- `price`
- `priceFloor`
- `priceCeiling`
- `fee`
- `payment`
- `wallet`
- `stock`
- `supply`
- `demand`
- `pressure`
- `inventory`
- `vendorInventory`
- `shopInventory`
- `restock`
- `cargo`
- `cargoContents`
- `cargoMovement`
- `storageContents`
- `itemInstance`
- `owner`
- `quantity`
- `currentQuantity`
- `node`
- `depletion`
- `respawn`
- `harvestRoll`
- `extractionRate`
- `gatheringCheck`
- `toolRequirement`
- `skillCheck`
- `accessCheck`
- `effect`
- `command`
- `event`
- `reward`
- `runtime`
- `saveState`
- `accountState`
- `ui`
- `gameplay`

Validators should also reject lower-snake tags that smuggle runtime intent, such as `price_*`, `stock_*`, `inventory_*`, `runtime_*`, `ui_*`, `effect_*`, `command_*`, or `reward_*`.

## Validation Expectations

`Version 0.5.301 - Resource And Commodity Schema And Validator` should implement only schemas, pure focused validators, focused tests, and schema-file parse coverage.

The validators should:

- enforce records-only wrapper shape;
- reject additional properties;
- enforce unique ids and slugs;
- enforce id/slug coherence;
- enforce required field presence;
- enforce controlled status, family, source-domain, trade-category, handling-tag, and allowed-owner vocabularies;
- enforce lower-snake tag shape;
- reject forbidden fields recursively;
- resolve `relatedItemKeys` against `items.items`;
- resolve peer resource/commodity refs when both wrappers are present in focused tests;
- resolve production-chain or recipe refs only if those fields are included;
- fail closed on malformed ids, duplicates, unresolved refs, unknown vocabulary, market-only item keys, and runtime-shaped fields;
- remain pure and unregistered in normal content lint until live content exists.

Focused tests should include valid minimal resource and commodity records, duplicate ids/slugs, malformed ids, unresolved item keys, market-only keys, forbidden pricing fields, forbidden stock/cargo/storage fields, forbidden runtime/UI/effect fields, duplicate tags, unknown vocabulary, and peer relationship failures.

## Seed Prerequisites

No live resource or commodity content should be added until a later seed plan:

- reruns a fresh item/market/production/settlement/ecology audit;
- selects a very small candidate list;
- proves every item-key reference resolves through `items.items`;
- proves every resource/commodity cross-reference resolves;
- chooses `planned` or `active` status per record;
- documents exact omissions;
- keeps prices, stock, cargo, storage, gathering, trading, crafting execution, service execution, runtime, UI, save/account, and gameplay out of scope;
- decides whether resource and commodity seeds should land together or be staged.

## Deep Research Posture

No Deep Research gate is required before `Version 0.5.301 - Resource And Commodity Schema And Validator`.

`GPT-DR.resources.gathering-extraction` remains relevant later, before deeper gathering/extraction content, resource-node modeling, agriculture/mining/foraging execution, or broad seed expansion. If selected later, it should produce a temporary artifact named like `docs/dev/tmp-resources-gathering-extraction-research-YYYY-MM-DD.md` and a later Codex integration run should either promote or retire it.

## Next Recommended Version

`Version 0.5.301 - Resource And Commodity Schema And Validator`

Recommended scope:

- Add `packages/schemas/world/resource.schema.json`.
- Add `packages/schemas/world/commodity.schema.json`.
- Add `tools/content-lint/resources.mjs`.
- Add `tools/content-lint/commodities.mjs`.
- Add focused unit tests.
- Add schema-file parse coverage.
- Do not add live resource/commodity content.
- Do not register normal content lint.
- Do not edit item, market, production, settlement, ecology, service, runtime, UI, save/account, storage, command, event, reward, or gameplay files except for focused test/schema registration required by the prompt.
