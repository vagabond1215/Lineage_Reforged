# Temporary Deep Research: Economy, Trade, Production, Markets, and Settlement Economy

Status: temporary research artifact for Codex planning
Date: 2026-06-20
Source: Deep Research run from the user-provided economy/trade/production prompt.
Intended use: staging reference for a later narrow Codex planning pass.

> Temporary-file policy: this file is not final design canon. It should either be converted into one or more permanent `docs/design/**` decision documents or deleted after the relevant Codex planning passes land.

## 1. Executive Summary

The research pass examined economy, trade, resources, production chains, professions, markets, settlement economies, ports, routes, crafting supply chains, guilds, institutions, property overlap, law/tax overlap, and future Knowledge integration for Lineage Reforged.

The strongest conclusion is architectural: Lineage Reforged should not begin its economy lane with exact prices, simulation ticks, merchant AI, dynamic inventories, or runtime trade flows. It should begin with descriptive authority records that can be schema-validated and linted:

1. resources and commodities;
2. production profiles;
3. settlement economies;
4. market profiles;
5. route/trade overlays after route authority stabilizes;
6. professions, guilds, and institutions as separate authority layers;
7. crafting integration only after item/material/category boundaries are clear.

The safest first Codex pass after this research is a docs-only `Economy Authority Boundary Decision`. The first likely implementation candidate after that is `world.settlement_economies`, with `world.market_profiles` as the next companion layer.

## 2. Source Caveat And Repo-State Boundary

This research was launched with GitHub connector access to `vagabond1215/Lineage_Reforged`, but the final report notes that direct repository file retrieval was not reliable during the run. Therefore, this artifact separates:

- brief-confirmed repo scope;
- external research-backed recommendations;
- assumptions that must be verified by Codex in the local checkout before implementation.

Codex must not treat this artifact as proof that a path or collection exists. It should inspect the live repository before creating any permanent design document.

The user-provided research specification explicitly targeted these repo areas:

- `packages/content/base/world/**`
- `packages/content/base/civilization/**`
- `packages/content/base/player/**`
- `packages/content/base/items/**`
- `packages/content/base/crafting/**`
- `packages/content/base/professions/**`
- `packages/content/base/economy/**`
- `packages/schemas/**`
- `tools/content-lint/**`
- `tests/unit/**`
- `docs/design/**`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/future_content_backlog.md`

Systems to verify locally include resources, commodities, trade goods, materials, recipes, tools, equipment, food, ecology/resource profiles, settlements, settlement markets, ports, roads, routes, travel networks, trade routes, guilds, institutions, professions, jobs, labor, shops/vendors, storage/warehouses, ownership/estates/property, taxes/laws/polities, and Knowledge related to economy/crafting/trade/resources.

## 3. Current Gaps And Risks

### Confirmed design risks

1. **Premature price simulation**
   Exact prices, dynamic demand curves, stock counts, merchant AI, and simulation ticks should not appear in first-pass economy content.

2. **Authority/runtime conflation**
   Economy records must not grant discounts, spawn goods, create shops, run trade, assign labor, collect taxes, or execute gameplay behavior.

3. **Spatial incoherence**
   Economy content will be unreliable if it references ports, roads, settlements, resources, or routes that do not resolve to canonical authorities.

4. **Overloaded crafting**
   Crafting recipes should not become an implicit macroeconomy. Recipes transform inputs into outputs; settlement economies describe availability and specialization.

5. **Guild/institution ambiguity**
   Professions, guilds, civic institutions, religious institutions, merchant houses, and family businesses need separate authority boundaries before gameplay use.

6. **Property and law overlap**
   Estates, taxes, tariffs, monopolies, leases, inheritance, and restricted goods should remain descriptive until family, law, polity, and ownership systems are ready.

## 4. Recommended Economy Hierarchy

Recommended hierarchy:

- raw resources;
- processed materials;
- components;
- staple commodities;
- trade goods;
- finished goods;
- production profiles;
- settlement economies;
- market profiles;
- professions;
- guilds and institutions;
- trade-route overlays;
- future runtime market/trade systems.

This lets Lineage Reforged express world identity first:

- what a region produces;
- what a settlement imports/exports;
- what industries are present;
- what goods are common, scarce, prestigious, restricted, or perishable;
- what institutions shape local economy;
- what routes or ports matter later.

Do not require exact prices in the first phase.

## 5. Resource And Commodity Model

Recommended split:

### Resources

Natural or primary outputs:

- timber;
- fish;
- ore;
- stone;
- clay;
- herbs;
- wool;
- grain;
- salt;
- flax;
- hides;
- dyes;
- fruit;
- pitch;
- reeds.

Resources should usually be geography/ecology-compatible and may be referenced by production profiles.

### Commodities

Bulk or tradable forms:

- grain sacks;
- dried fish;
- wool bales;
- timber lots;
- lamp oil;
- salt blocks;
- iron blooms;
- cloth bolts;
- pottery crates;
- cured hides.

Commodities may be raw, processed, bulk, rare, luxury, strategic, perishable, religious/cultural, or restricted.

### Items

Individual interactable inventory objects should remain separate from macroeconomic commodity authority unless current repo conventions already collapse them.

Recommended principle: not everything economic should become an item first.

## 6. Production Chains

Production chains should initially be descriptive and declarative.

Recommended chain families:

- extraction;
- farming;
- herding;
- fishing;
- hunting;
- forestry;
- mining;
- milling;
- smelting;
- weaving;
- tanning;
- brewing;
- cooking;
- medicine/herbalism;
- shipbuilding;
- toolmaking;
- weapon/armor making;
- luxury crafting;
- religious or sacred production;
- future alchemical/magical production if supported.

Recommended data shape for a future production profile:

```json
{
  "id": "production_profile.<place>.<industry>",
  "slug": "<place>_<industry>",
  "name": "<Industry name>",
  "status": "planned",
  "placeAnchor": {},
  "industryType": "milling",
  "inputRefs": [],
  "outputRefs": [],
  "summary": "Descriptive production authority only.",
  "sourceAuthorityNotes": [],
  "notes": []
}
```

No profile should execute production in 0.5.x.

## 7. Settlement Economies And Markets

The recommended first implementation candidate is `world.settlement_economies`.

A settlement economy record should express:

- settlement economic role;
- market order/scale;
- imports;
- exports;
- local industries;
- local resource links;
- port/road/route posture;
- guild/institution presence;
- storage/warehouse posture if known;
- wealth band;
- scarcity notes;
- legal/religious/cultural economic boundaries if descriptive only.

Recommended future settlement economy fields:

```json
{
  "id": "settlement_economy.<settlement_slug>",
  "slug": "<settlement_slug>",
  "settlementId": "settlement.<slug>",
  "status": "planned",
  "marketOrder": "local",
  "economicRoleTags": [],
  "importRefs": [],
  "exportRefs": [],
  "industryRefs": [],
  "summary": "Descriptive settlement economy authority only.",
  "sourceAuthorityNotes": [],
  "notes": []
}
```

Market profiles should remain price-free and descriptive in 0.5.x. Use bands instead of exact prices.

Suggested bands:

- abundant;
- common;
- normal;
- scarce;
- restricted;
- prestigious;
- seasonal;
- perishable;
- imported;
- local specialty.

## 8. Trade Routes, Ports, Roads, And Logistics

Economy should consume route authority; it should not define physical route topology first.

A future trade-route authority should wait until the geography/route lane has clarified:

- route records;
- route segments;
- crossings;
- ports;
- sea lanes;
- river routes;
- roads/trails;
- travel-network relationships.

Economic route data that can exist before runtime:

- named corridor identity;
- endpoint references;
- dominant cargo categories;
- route class;
- seasonality notes;
- disruption risks;
- port/road/river dependency notes;
- toll or customs posture as descriptive text.

No route record should perform pathfinding or trade simulation in 0.5.x.

## 9. Professions, Labor, Guilds, And Institutions

Recommended boundary:

- **professions** are occupational vocabulary;
- **jobs/labor roles** are future gameplay/runtime concepts;
- **guilds** are social-economic authorities for standards, membership, training, or market influence;
- **institutions** are broader civic/religious/mercantile bodies that can own economic context but should not run behavior yet.

Future profession record example:

```json
{
  "id": "profession.<slug>",
  "slug": "<slug>",
  "name": "<Profession>",
  "status": "planned",
  "occupationClass": "craft",
  "industryTags": [],
  "toolTags": [],
  "summary": "Descriptive profession authority only.",
  "notes": []
}
```

Future guild record example:

```json
{
  "id": "guild.<place>.<slug>",
  "slug": "<place>_<slug>",
  "name": "<Guild name>",
  "status": "planned",
  "placeAnchor": {},
  "industryTags": [],
  "membershipModel": "unknown",
  "summary": "Descriptive guild authority only.",
  "sourceAuthorityNotes": [],
  "notes": []
}
```

Do not collapse guilds into professions or shops.

## 10. Crafting Integration

Crafting should be integrated carefully.

Recommended separation:

- resources/commodities describe economic availability;
- material categories describe substitution classes;
- recipes describe transformations;
- professions describe occupational identity;
- stations/tools describe requirements;
- Knowledge may later reveal recipes or techniques;
- markets may later source inputs.

Recipes should not create dynamic demand, supply, or market prices.

Future recipe checks:

- input/output refs resolve;
- tool/station refs resolve;
- recipe category is supported;
- material substitution is explicit;
- no planned/inactive authority unless fixture-only;
- no runtime stock or merchant fields.

## 11. Ownership, Property, Estates, And Inheritance Overlap

Economy will eventually touch:

- farms;
- mines;
- shops;
- workshops;
- ships;
- warehouses;
- estates;
- homes;
- family businesses;
- tax obligations;
- rent/leases;
- bequests;
- noble/domain ownership.

Do not implement this through first-pass economy records. Use descriptive references only until family/estate/ownership authority is defined.

Examples of safe descriptive fields:

- `ownershipNotes`;
- `estateInfluenceNotes`;
- `taxationNotes`;
- `guildRestrictionNotes`.

Forbidden in first-pass records:

- rent collection;
- income ticks;
- inheritance transfer logic;
- ownership commands;
- property storage;
- shop inventory behavior;
- estate gameplay effects.

## 12. Law, Taxation, Restrictions, And Political Economy

Economic systems may later interact with:

- polities;
- local laws;
- tariffs;
- tolls;
- customs;
- guild monopolies;
- restricted goods;
- smuggling;
- religious prohibitions;
- wartime shortages;
- reputation/favorability/alignment.

In 0.5.x, keep these descriptive.

Do not add legal enforcement, taxes, tariffs, toll calculations, smuggling mechanics, embargo behavior, or favorability effects through economy authority records.

## 13. Ecology And Resource Placement

Resource placement should validate against geography and ecology.

Examples:

- timber requires forest/woodland authority or ecology compatibility;
- fish requires coast, river, lake, wetland, or water-route context;
- ore requires geology/elevation/mountain or mine authority later;
- pasture requires land and water suitability;
- herbs require biome/climate/habitat compatibility;
- salt requires coast, salt marsh, mine, or salt-flat authority;
- crop outputs require farmland or climate suitability.

Validation should prevent impossible resource/industry pairings once the needed upstream authorities are stable.

## 14. Knowledge System Integration

Possible future Knowledge subjects:

- resource;
- commodity;
- settlement_economy;
- market_profile;
- trade_route;
- profession;
- guild;
- institution;
- recipe;
- material_category.

Knowledge snippets should remain informational.

They may reveal:

- what a resource is;
- what a settlement exports;
- why a route matters;
- what a guild controls;
- what a recipe requires;
- where a good is common or scarce.

They must not automatically grant:

- discounts;
- crafting bonuses;
- shop access;
- route permissions;
- production output;
- income;
- favorability;
- law exemptions;
- gameplay rewards.

## 15. Proposed Collections And Schema Concepts

Recommended collection candidates:

| Collection | Likely Path | First-Pass Priority | Purpose |
|---|---|---:|---|
| `world.settlement_economies` | `packages/content/base/world/settlement_economies.json` | 1 | settlement-level economic identity |
| `world.market_profiles` | `packages/content/base/world/market_profiles.json` | 2 | availability/scarcity/value bands, no prices |
| `world.resources` | `packages/content/base/world/resources.json` | 3 | raw resource authority |
| `world.commodities` | `packages/content/base/world/commodities.json` | 4 | tradeable good classes |
| `world.production_profiles` | `packages/content/base/world/production_profiles.json` | 5 | descriptive production chains |
| `civilization.professions` | `packages/content/base/civilization/professions.json` | 6 | occupational vocabulary |
| `civilization.guilds` | `packages/content/base/civilization/guilds.json` | 7 | economic institutions and guilds |
| `civilization.institutions` | `packages/content/base/civilization/institutions.json` | 8 | civic/religious/mercantile bodies |
| `crafting.material_categories` | `packages/content/base/crafting/material_categories.json` | later | substitution and material family rules |
| `crafting.recipes` | `packages/content/base/crafting/recipes.json` | later | transform rules, not economy simulation |
| `world.trade_routes` | `packages/content/base/world/trade_routes.json` | later | economic overlay on route/port topology |
| `economy.scarcity_profiles` | `packages/content/base/economy/scarcity_profiles.json` | later | shared band vocabulary |
| `economy.price_bands` | `packages/content/base/economy/price_bands.json` | defer | optional relative value vocabulary, not exact prices |

Recommended first implementation route:

1. docs-only economy authority boundary;
2. settlement economy schema decision;
3. settlement economy schema and validator;
4. settlement economy content seed plan;
5. first settlement economy content seed.

## 16. Validation And Content-Lint Roadmap

Core validation rules:

1. strict records-only wrappers;
2. unique IDs and slugs;
3. ID/slug agreement;
4. active parent authority checks;
5. settlement-market anchor coherence;
6. resource-site biome/elevation/climate coherence later;
7. production input/output coherence;
8. trade-route endpoint coherence;
9. port/road/river dependency checks;
10. guild/institution settlement coherence;
11. recipe input/output authority;
12. no unsupported runtime/gameplay fields;
13. no exact price simulation in content-only phases unless explicitly approved.

Forbidden first-pass fields:

- `currentStock`;
- `basePrice`;
- `dynamicPriceFormula`;
- `merchantAi`;
- `productionTickRate`;
- `incomePerDay`;
- `shopInventory`;
- `runtimeDemand`;
- `runtimeSupply`;
- `playerDiscount`;
- `questReward`;
- `eventTrigger`;
- `storageState`;
- `uiState`;
- `gameplayEffects`.

## 17. Authored-Vs-Generated Strategy

Fully authored now/later in 0.5.x:

- settlement economies;
- market profiles;
- resource/commodity vocabularies;
- production profiles;
- profession vocabulary;
- guild/institution authorities;
- first content seeds.

Derived later:

- common/rare availability summaries;
- trade catchment hints;
- port/route relevance;
- settlement economic tags derived from approved records.

Generated once and saved later:

- suggested route trade corridors;
- regional market catchment areas;
- broad scarcity overlays.

Runtime-generated much later:

- dynamic price changes;
- caravan events;
- market shortages;
- resource replenishment;
- shop inventories;
- merchant behavior.

## 18. Gameplay Integration Roadmap

Future economy gameplay can consume authorities in stages:

1. player can identify local goods;
2. market UI shows availability bands;
3. crafting uses local material availability;
4. settlements expose imports/exports;
5. trade routes shape availability and scarcity;
6. professions and guilds unlock story/context;
7. later systems add shops, prices, trade contracts, caravans, taxes, property, and estate income.

No runtime economy should be implemented before descriptive authority and validation exist.

## 19. Recommended Versioned Implementation Sequence

Suggested sequence after current geography work:

1. `0.5.198 - Economy Authority Boundary Decision`
   - docs-only;
   - decides boundaries among resources, commodities, production profiles, settlement economies, market profiles, professions, guilds, institutions, trade-route overlays, and crafting.

2. `0.5.199 - Settlement Economy Schema Decision`
   - docs-only;
   - chooses first record shape and validation boundary.

3. `0.5.200 - Settlement Economy Schema And Validator`
   - schema/validator/tests;
   - no live content seed unless explicitly narrow.

4. `0.5.201 - Settlement Economy Content Seed Plan`
   - docs-only;
   - picks one settlement economy seed.

5. `0.5.202 - First Settlement Economy Content Seed`
   - add one active/planned seed;
   - content lint registration if needed;
   - focused tests.

6. `0.5.203 - Market Profile Schema Decision`
   - price-free market profile boundary.

7. `0.5.204 - Resource And Commodity Vocabulary Decision`
   - docs-only;
   - decide item/resource/commodity/material split.

8. `0.5.205 - Profession Guild Institution Boundary Decision`
   - docs-only.

9. `0.5.206 - Crafting Economy Integration Decision`
   - docs-only.

10. Later `0.5.x`
    - market profile schema;
    - resource/commodity schema;
    - production profile schema;
    - guild/institution schema;
    - economy Knowledge subject decisions.

11. `0.6+`
    - dynamic markets;
    - trade simulation;
    - merchant AI;
    - stock counts;
    - player shops;
    - estate income;
    - runtime property behavior.

## 20. Open Questions

- Does `packages/content/base/economy/**` already exist?
- Are items, recipes, professions, shops, vendors, and crafting materials already schema-backed?
- Does any existing route/travel-network authority already include trade-route semantics?
- Are ports represented as settlements, map features, travel nodes, or absent?
- Should `world.resources` be separate from `items.materials`?
- Should `world.commodities` exist before itemization?
- Should exact prices ever be authored, or only relative bands?
- Should professions be a player progression system, a civilization authority, or both?
- Which settlement is safest for the first economy seed?
- Should Knowledge expose economy subjects under an existing domain or a future `knowledge_domain.economy`?

## 21. Recommended Next Codex Prompt

Next recommended narrow Codex prompt:

`Version 0.5.198 - Economy Authority Boundary Decision`

Goal:
Create a docs-only decision defining the canonical boundary between resources, commodities, production profiles, settlement economies, market profiles, professions, guilds, institutions, trade-route overlays, and crafting integration for Lineage Reforged.

Primary task:
Inspect the live repo, correct this research artifact where repo-state assumptions are stale, and create a permanent design decision:

`docs/design/economy-authority-boundary-decision.md`

Recommended posture:

- prefer `world.settlement_economies` as the first implementation candidate;
- keep `world.market_profiles` price-free and descriptive-only in 0.5.x;
- separate resources from commodities unless live repo conventions say otherwise;
- separate professions from guilds and institutions;
- defer trade-route economy overlays until route authority stabilizes;
- keep crafting integration separate from macroeconomic authority;
- reject runtime/gameplay/stock-count/merchant-AI fields in first-pass content.

Suggested commit message:

`docs(economy): decide authority boundaries`

## External References Used By Deep Research

- JSON Schema getting started: https://json-schema.org/learn/getting-started-step-by-step
- Ajv JSON Schema validator guide: https://ajv.js.org/guide/getting-started.html
- Central-place theory, Britannica: https://www.britannica.com/topic/central-place-theory
- BEA Input-Output Accounts: https://www.bea.gov/industry/input-output-accounts-data
- World Bank Logistics Performance Index: https://lpi.worldbank.org/
- Britannica guild overview: https://www.britannica.com/topic/guild-trade-association
- FAO Food Loss and Waste data platform: https://www.fao.org/platform-food-loss-waste/flw-data/en/
- Routing Model for Multicommodity Freight in an Intermodal Network under Disruptions: https://arxiv.org/abs/2402.00992
- Explainable PCGML via Game Design Patterns: https://arxiv.org/abs/1809.09419
