# Future Content Backlog

This file tracks content and systems that are intentionally deferred.

## Update Policy

- Review this file alongside `README.md` before substantial Codex command runs or content edits so deferred intent is considered up front.
- Update this file on every Codex run that adds, defers, narrows, or re-scopes future content.
- Add new backlog items as soon as they are deferred.
- Revise prerequisites and implementation notes when the plan changes.
- Remove items only when the underlying content and wiring are actually implemented.

## Deferred Systems

### Arcane Documents

#### Magical books and tomes

- Status: deferred
- Prerequisite: establish the canonical spell database and spell metadata first; the current starter FFXI-style placeholder catalog is not yet enough to author stable tome items
- Intended owner: `enchanters`, with follow-on support from `scriptorium` and `bookbindery` content
- Intended implementation:
  - define spell-bearing book item families after spells have stable tiers, schools, and storage rules
  - add arcane copy, binding, and attunement rules after mundane book production is settled

#### Magical scrolls

- Status: deferred
- Prerequisite: establish the canonical spell database and spell metadata first; the current starter FFXI-style placeholder catalog is not yet enough to author stable scroll items
- Intended owner: `enchanters`, with scroll substrate support from `scriptorium`
- Intended implementation:
  - define spell scroll payloads after spell data can describe charges, decay, and inscription limits
  - layer magical scroll production onto the non-magical scroll pipeline instead of duplicating it

### Cartography

#### Region-based maps

- Status: partially deferred
- Prerequisite: region metadata, polygon boundaries, and source raster base layers now exist; remaining prerequisites are cartography item families and physical map-item ownership rules
- Intended owner: future cartography/mapmaking content
- Intended implementation:
  - the first authored world geography pass now lives in `packages/content/base/world/regions.json` and `packages/content/base/world/world_maps.json`
  - `world_maps.json` now carries source-raster asset paths plus an authored source-rect so the browser can align overlays to the canonical map coordinate grid even when the source art includes framing or margins
  - coordinate-backed feature geometry now lives in `packages/content/base/world/world_map_features.json`, including region footprints, climate zones, biome zones, rivers, mountain belts, passes, and crossings
  - `scripts/regenerate_world_map_features.ps1` now regenerates source-aligned coastlines plus region/biome polygon families from the source biome raster so future map-boundary corrections do not require hand-editing every polygon
  - source full-size raster base layers now live under `packages/content/base/world/map_assets/`, and the content browser now uses those layers while overlaying region polygons, continent names, region names, settlements, and route lines against the authored pixel grid
  - add map item families now that region data can anchor them
  - keep future map generation tied to real region records rather than placeholder generic maps
  - keep the browser centered on `world_maps` as the player-facing map surface while lower-level geometry data remains an internal support layer for rendering and optional debug overlays

### Regional Economies

#### Regionally updated supply and demand

- Status: partially deferred
- Prerequisite: hierarchy ledgers, settlement market states, transport runtime, and first-pass autonomous trade dispatch now exist; remaining prerequisites are longer-horizon storage fulfillment, kingdom definitions, and broader market-service consumers
- Intended owner: economy simulation, market systems, and region data
- Intended implementation:
  - first-pass macro-region ecology, region survivability, locality catchment, and import/export baselines now exist for the authored world
  - the civilization tick now builds per-tick supply/demand ledgers and shortfall/surplus summaries across `workplace`, `building`, `settlement`, `region`, and top-level continent ledger nodes
  - guild halls now contribute building-level supply/demand pressure and can issue quests from those ledgers, including synthesized adventurers-guild fallback presence when a settlement has other guild business but no explicit adventurers hall
  - the civilization tick now performs first-pass deterministic trade dispatch from protected surplus into real caravan movement, with stock removal at origin, delivery at destination, and local price pressure updates routed through the transport system
  - remaining work is to deepen stockpile fulfillment beyond first-pass dispatch, reconcile longer-horizon storage drawdown/replenishment, and layer kingdom-level aggregation once kingdoms exist
  - tie shortages, surpluses, and trade specialization to local ecology, infrastructure, workplace density, and route throughput instead of treating ledgers as descriptive totals only

#### Settlement consumption, growth, and routing

- Status: partially deferred
- Prerequisite: authored region-first settlement and locality data, the hex spatial layer, deterministic corridor routing, first-pass caravan runtime, settlement population/business/infrastructure derivation, and autonomous trade dispatch now exist; remaining prerequisites are household consumption drawdown, migration and urban-growth logic, business lifecycle simulation, and richer seasonal route-throughput effects
- Intended owner: region data, economy simulation, settlement simulation, and infrastructure routing systems
- Intended implementation:
  - authored settlement records now live in `packages/content/base/world/settlements.json`
  - authored locality-band records now live in `packages/content/base/world/region_localities.json`
  - settlement records now derive simulation truth from `macroRegionId`, `regionId`, `localityBandId`, `hexAnchorId`, `siteClass`, `terrainContext`, survivability, and trade dependency rather than `mapLocation`
  - authored map scale benchmarks and optional route geometry still live in `packages/content/base/world/world_maps.json` and `packages/content/base/world/travel_networks.json`, but they are no longer settlement-placement or travel-truth ownership
  - browser-facing raster map layers and feature overlays remain useful for display/debug/reference ownership
  - the settlement layer now includes both primary centers and a first dependent-settlement layer of estates, hamlets, monasteries, ferry posts, camps, and similar support sites
  - settlement records now include authored guild-building presence for major human trade, craft, logistics, and adventuring nodes
  - the spatial world layer now lives in `packages/content/base/world/world_hexes.json`, `packages/content/base/world/world_hex_edges.json`, and hex/corridor-aware travel records, with runtime consumers deriving settlement resource access and infrastructure-gated supply from nearby reachable hexes
  - `packages/engines/civilization-engine/src/settlement-simulation.ts` now derives population structure, labor classes, infrastructure throughput/storage/security, transport availability, and business composition from settlement scale, ecology, and route context
  - `packages/engines/civilization-engine/src/trade-runtime.ts` now detects surplus-demand opportunities, enforces protected reserves, dispatch cadence, throughput slots, fill-ratio and profit thresholds, destination absorption, and asset reservations, then dispatches caravans automatically through the existing segment-based transport runtime
  - `packages/engines/civilization-engine/src/index.ts` now emits settlement and trade deltas alongside economy, market, logistics, and quest updates
  - use those records plus region/locality/hex data as the canonical layer for domestic production, regional trade links, infrastructure level, and population-center identity
  - remaining work is to add explicit household consumption drawdown, long-horizon storage depletion/replenishment, migration, urban growth, business opening/closure, and infrastructure-service degradation instead of leaving settlement sizes and enterprise counts mostly static between ticks

#### Region-first settlement truth and map demotion

- Status: partially deferred
- Prerequisite: the region-first location refactor is now in place across `regions.json`, `regional_ecology_profiles.json`, `region_localities.json`, `settlements.json`, `world_hexes.json`, `world_hex_edges.json`, schemas, linting, and economy loaders; remaining prerequisites are route throughput, caravan/trade runtime consumers, and optional weather/season overlays on segment travel
- Intended owner: world region content, settlement schemas, travel data, content lint, and civilization runtime loaders
- Intended implementation:
  - `packages/content/base/world/regions.json` and `packages/content/base/world/regional_ecology_profiles.json` now own survivability, density, catchment, and supply/demand baseline fields used by runtime systems
  - `packages/content/base/world/region_localities.json` now formalizes the `macro region -> region -> locality band -> settlement/site` hierarchy and locality-band terrain-pocket logic
  - `packages/content/base/world/settlements.json` now uses region/locality identity, `hexAnchorId`, `siteClass`, `terrainContext`, `economicModel`, `survivalModel`, and `tradeDependencyProfile` as settlement simulation truth, with old map coordinates retained only under optional `visualMapRef`
  - `packages/content/base/world/world_hexes.json` now provides the coarse spatial continuity layer, while `packages/content/base/world/world_hex_edges.json` owns adjacency, edge barriers, route quality, and travel-mode permissions
  - `packages/content/base/world/travel_networks.json` now uses hex-ordered route records and segment-aware corridor metadata as travel truth, with `pathPoints` and similar geometry retained only as optional visual overlays
  - `tools/content-lint/index.mjs` and `packages/schemas/world/settlement.schema.json` now validate region-first settlement truth and no longer require pixel-coordinate placement or biome/climate polygon membership
  - biome and elevation influence are now expressed through region and locality simulation fields rather than brittle raster-coordinate truth
  - `packages/content/base/world/world_maps.json`, `packages/content/base/world/world_map_features.json`, and the related browser/scripts pipeline are now optional visual/debug/reference ownership instead of settlement-truth ownership
  - remaining work is to let future route throughput, import/export fulfillment, caravan routing, and trade simulation consume the region-first spatial model end to end

#### Hex-grid route throughput and caravan logistics

- Status: partially deferred
- Prerequisite: the deterministic hex grid, adjacency edges, route records, settlement resource access, mode-aware best-route resolver, transport profiles, first-pass caravan runtime, and autonomous trade dispatch now exist; remaining prerequisites are richer corridor queueing, ferry/toll consumption, weather/season overlays, return-position tracking, and convoy attrition or encounter layers
- Intended owner: travel simulation, economy fulfillment, logistics runtime, and future caravan systems
- Intended implementation:
  - use `packages/content/base/world/world_hexes.json`, `packages/content/base/world/world_hex_edges.json`, and `packages/content/base/world/travel_networks.json` as the single spatial/travel truth for convoy and caravan movement
  - `packages/content/base/world/transport_profiles.json` now owns harness, draft-animal, vehicle, and ship profiles for deterministic transport resolution
  - `packages/engines/civilization-engine/src/transport-runtime.ts` now resolves vehicle/animal compatibility, nonlinear load and pull scaling, fatigue/rest, segment-by-segment movement, stock loading/unloading, and destination delivery against the authored route network
  - `packages/engines/civilization-engine/src/index.ts` now advances caravan transport state during civilization ticks and surfaces logistics deltas alongside economy and market updates
  - `packages/engines/civilization-engine/src/trade-runtime.ts` now uses settlement-derived throughput, protected reserves, destination absorption, route validity, vehicle availability, and route-scale limits to dispatch caravans deterministically instead of requiring dispatch to be a purely explicit action
  - remaining work is to deepen corridor throughput from a first-pass route-scale limit into per-segment queueing, ferry/toll consumption, explicit return positioning, multi-unit convoy state, and richer stockpile transfer policies
  - layer optional weather/season modifiers and convoy attrition on segment travel after the deterministic baseline is exercised by settlement demand and trade fulfillment
  - keep caravan routing deterministic and explainable, using the current segment-level penalty breakdowns as the future debugging surface

### Crafting And Item Expansion

#### Prestige material outputs after the base Phase 2 material families are exercised

- Status: deferred
- Prerequisite: the new `steel`, `bronze`, `brass`, precious-metal, fantasy-ingot, cloth-grade, leather-grade, and specialty-lumber families now exist; remaining prerequisite is proving their value through live recipe use, market demand, and first-layer manufactured outputs before adding prestige breadth
- Intended owner: `packages/content/base/items`, `packages/content/base/civilization/workplaces.json`, and `packages/content/base/civilization/production_chains.json`
- Intended implementation:
  - keep the current pass focused on first-layer base apparel, armor, weapons, tools, containers, and household goods that already sit on the validated support graph
  - defer prestige-metal weapons, ceremonial armor, elite furnishings, luxury garments, and decorative household lines until the new base material families are exercised by enough real recipes to justify further splits
  - use future expansion to add material-specific visible outputs only where the material difference affects durability, weight, value, or regional trade identity instead of adding cosmetic variants

#### Magical books, magical scrolls, and enchanter-authored arcane documents remain blocked on the spell database

- Status: deferred
- Prerequisite: establish the canonical spell database and spell metadata first; the new mundane paper, binding, ink, and book production support is intentionally not a license to add magical documents early
- Intended owner: `enchanters`, with downstream support from `scriptorium`, `bookbindery`, and future spell content
- Intended implementation:
  - keep mundane books, blank ledgers, scroll stock, and stationery as the current ownership layer until spell payloads exist
  - add magical books / tomes, magical scrolls, and enchanter-authored arcane documents only after spell schools, charges, attunement, and inscription rules are authored canonically

#### Enchanter workplace wiring and lapidary production chains after runtime craft consumers exist

- Status: deferred
- Prerequisite: the elemental combat rules, vessel lifecycle rules, crystal item economy, gemstone expansion, magical-metal affinities, and starter enchanter-facing accessory outputs now exist; remaining prerequisites are stable workplace or recipe runtime consumers plus a decision on how lapidary and enchantment stations should be represented alongside the current placeholder-heavy workplace catalog
- Intended owner: `packages/content/base/civilization/workplaces.json`, `packages/content/base/civilization/production_chains.json`, future crafting runtime consumers, and enchanter content
- Intended implementation:
  - the current pass adds the material, vessel, and item-economy foundations for enchanter and jewelry work without forcing large speculative workplace records into the current unfinished production runtime
  - add dedicated lapidary, jewelry, and enchanter workplaces once real craft execution can consume station distinctions, quality drivers, and vessel consumption rules
  - wire cut-gem processing, component fabrication, affinity attunement, and permanent-bind recipes into production chains after that station/runtime decision is stable
  - keep permanent enchanting explicitly vessel-consuming when those chains are added so the later implementation does not accidentally reintroduce infinite crystal loops

#### Guild institutions and contract systems

- Status: partially deferred
- Prerequisite: authored guild definitions, settlement guild presence, ownership derivation, religion catalogs, bounded magic service catalogs, crystal catalogs, and baseline quest generation now exist; remaining prerequisites are runtime contract acceptance/completion, warehousing, banking, apprenticeship, tax/rent collection, and market-service consumers
- Intended owner: economy simulation, civic institutions, settlement services, property systems, and market systems
- Intended implementation:
  - shared guild definitions now live in `packages/content/base/civilization/guilds.json`
  - settlement records now include `guildPresence` to describe merchant, adventurer, agricultural, mining, shipwright, teamster, scribal, and similar human guild buildings
  - settlement ownership, district restrictions, property valuation, religion, bounded magic-service availability, crystal reserves, and legal start-access derivation now live in `packages/shared/types/src/settlement-institutions.ts`, with engine-facing resolution in `packages/engines/civilization-engine/src/institutions-runtime.ts`
  - elemental religion, bounded magic-service, and crystal catalogs now live in `packages/content/base/world/religions.json`, `packages/content/base/world/magic_infrastructure.json`, and `packages/content/base/world/crystal_catalog.json`
  - merchant buy-in rules, task-trial entry models, and broad trade ownership splits are now authored as data definitions rather than implied only by settlement notes
  - the civilization tick now generates baseline guild-issued quest offers from settlement and guild-building ledgers, with adventurers-guild fallback behavior enforced in runtime
  - add runtime behavior for accepting, completing, expiring, and paying out guild-backed contracts instead of leaving quest offers as generated notices only
  - add bonded storage, credit, apprenticeship progression, rent/tax collection, title transfer, and guild-backed service demand when runtime consumers exist
  - let future civic and faction systems react to guild density, specializations, and regional concentration

#### Ownership, religion, and bounded magic institutions beyond the foundation pass

- Status: partially deferred
- Prerequisite: settlement ownership/property derivation, district restrictions, elemental religion catalogs, bounded magic-service catalogs, crystal catalogs, and class/background-aware start-access rules now exist; remaining prerequisites are canonical NPC/household/company registries, spell database ownership, crystal-charge runtime consumers, and legal/financial lifecycle systems
- Intended owner: settlement institutions, player-start systems, religion content, magic systems, and economy simulation
- Intended implementation:
  - keep the current pass focused on deterministic derivation of land authority, district permissions, plot/building ownership, property valuation, repair scaling, guild presence, religion sites, bounded magic availability, crystal reserves, and legal start-access
  - add real owner registries for individuals, households, companies, temples, nobles, and civic offices before ownership becomes a live transaction system instead of a derived legal layer
  - add rent, tax delinquency progression, foreclosure, condemnation, disputes, charters, and title transfer only after those owner registries and civic ledgers exist
  - keep magic infrastructure bounded to support, ritual, and licensed utility roles until the spell database exists and runtime charge consumption can be enforced on real spell services
  - keep magical books, magical scrolls, and other spell-bearing documents blocked behind the spell database even though religion/magic/crystal infrastructure foundations now exist

### Monsters and Encounters

#### Monster encounter distribution and lairs

- Status: partially deferred
- Prerequisite: baseline monster catalog and quest-facing drops now exist; remaining prerequisites are encounter tables, lair ownership, habitat weighting, and combat/runtime consumers
- Intended owner: world simulation, encounter generation, quest systems, and regional ecology
- Intended implementation:
  - `packages/content/base/world/monsters.json` now includes a broader starter set of kobolds, slimes, wolves, vermin, scorpions, centipedes, elementals, undead, and newer affinity-aware fauna-linked monsters with saleable drops and vessel outputs
  - monster records now also carry first-pass origin metadata for appearance rate, terrain sources, entry vectors, and secure-settlement restrictions so later spawn systems do not treat cities and wilderness as equivalent
  - use that catalog later for real spawn tables, hazard pressure around settlements, lair placement, and route danger instead of relying only on authored quest references
  - connect monster drops to broader crafting, alchemy, and economy consumers once those downstream systems are formalized

#### Full fauna-monster codex merge and lineage backfill

- Status: deferred
- Prerequisite: monster lineage metadata now exists on the new affinity-aware additions, but the broader fauna and monster catalogs still need a full backfill plus a codex presentation layer that can consume those links
- Intended owner: `packages/content/base/world/fauna.json`, `packages/content/base/world/monsters.json`, codex data consumers, and future UI or browser presentation layers
- Intended implementation:
  - keep the current pass focused on adding the merged-fauna design direction, new monster lineage fields, and realistic progression examples instead of rewriting every existing fauna and monster record at once
  - backfill `baseFaunaId`, variant typing, attunement metadata, and related codex links across the rest of the monster catalog in a dedicated normalization pass
  - add merged fauna-page presentation later so species, fantasy fauna branches, and hostile escalations read as one biological line rather than disconnected record lists

#### Tertiary sites below the authored dependent layer

- Status: partially deferred
- Prerequisite: the current primary-plus-dependent settlement layer is now authored; remaining prerequisite is deciding how tertiary hamlets, isolated shrines, tribal camps, ferry slips, and seasonal micro-sites should aggregate into simulation without exploding record count
- Intended owner: world region content, settlement simulation, and map population passes
- Intended implementation:
  - the current pass covers primary named population centers plus a first dependent layer of support settlements
  - add a lighter tertiary layer later so dense regions feel fuller without turning every farm lane, shrine, or fishing cove into a full authored settlement record
  - use that lower layer to represent the many non-urban tribal, rural, and seasonal populations that still sit below the current authored granularity

### Civil Infrastructure

#### Broader non-manned infrastructure families

- Status: partially deferred
- Prerequisite: decide how region data should influence route placement, civic maintenance, and settlement-scale infrastructure prioritization
- Intended owner: civilization infrastructure content, economy simulation, and browser/reporting tools
- Intended implementation:
  - roads, walls, gates, aqueducts, bridges, and canals are now seeded in `packages/content/base/civilization/infrastructure.json`
  - authored travel-network variance rules now account for roads, rivers, mountain passes, canal locks, and open-sea weather at the data layer
  - continue with utilities, harbor works, and other unmanned civic works in the same data model instead of introducing workplace stand-ins
  - keep infrastructure tiers gated by technology, materials, and labor rather than staffing
  - preserve the direct-build rule for higher tiers and the higher-labor retrofit rule for upgrades so infrastructure remains distinct from workplaces
  - add runtime-aware canal routing, lock throughput, and drydock usage after transport simulation can consume infrastructure service outputs directly

#### Settlement plot and building instantiation

- Status: partially complete
- Prerequisite: runtime district, plot, building-condition, repair, and morale initialization now exist; remaining prerequisite is player-facing construction/repair interaction and long-horizon building turnover
- Intended owner: settlement spatial simulation, building placement, plot/building gameplay, and future construction systems
- Intended implementation:
  - use `packages/content/base/civilization/buildings.json` as the canonical building-capability layer, including hosted workplaces, service functions, storage types, and terrain/placeability constraints
  - keep the current building layer as simulation truth for capacity and function; runtime settlement initialization now derives districts, plots, building instances, vacancy, decay, repair pressure, and morale directly from that layer
  - add player-facing construction, redevelopment, frontage choice, and repair prioritization later on top of the current runtime plot/building state instead of replacing it
  - let future placeability consume `hexAnchorId`, `terrainContext`, locality route access, and settlement infrastructure instead of reintroducing pixel placement or arbitrary building slots

### Knowledge and Research

#### Research and administrative book use

- Status: partially deferred
- Prerequisite: formalize record-keeping, research, and technology-advance consumers
- Intended owner: civic/research/workplace systems
- Intended implementation:
  - reuse `record_book`, `reference_book`, and `ledger` as tools for administration, archives, and technology progression
  - add dedicated consumers before introducing broader library or scholastic progression loops

### Botanical Aggregates

#### Mixed-harvest herb and flower deaggregation

- Status: partially deferred
- Prerequisite: define fuller crop, orchard, and forage decomposition rules for broad harvest sources
- Intended owner: flora extraction, agriculture, and foraging content
- Intended implementation:
  - use explicit seeded furrows and per-furrow yields for managed agriculture where the player or settlement chooses what is planted
  - use percent-distribution mixed yields for wild gathering, hedgerow byproducts, orchard understory, and other intentionally broad harvest sources
  - keep `herbs_raw` and `flower_bloom` as aggregate byproducts for mixed farms and wild harvest loops where the source is intentionally broad
  - continue replacing aggregate botanicals inside specific processing recipes and workplaces once named herb and flower inputs exist
  - remove the aggregate harvest buckets only after broad extraction outputs can be split into stable specific species yields

### Item and Economy Data

#### Canonical commodity identity rollout beyond the first pass

- Status: partially deferred
- Prerequisite: the first canonical commodity item cohort, alias-backed flora compatibility, and market overlay schema now exist; remaining prerequisites are broader item catalog coverage, recipe/workplace consumers that can target processing groups, and deliberate provenance rules for aggregate goods
- Intended owner: `packages/content/base/items`, `packages/content/base/civilization`, extraction/workplace content, and future inventory/codex consumers
- Intended implementation:
  - `packages/content/base/items/items.json` now owns the first canonical multi-role commodity records for core raw and processed goods such as wood, bark, sap, resin, herb bundles, compost, hides, leather, dairy, eggs, feathers, blood, bone, ore, and ingots
  - `packages/content/base/civilization/market_item_values.json` now has a dedicated schema and remains the valuation overlay keyed to canonical `itemKey`
  - the Step 2 canonicalization pass now removes `ingredient.*`, `material.*`, and `mineral.*` pseudo-identities from live item usage, promotes the remaining world-source outputs into canonical item records, and normalizes flora/fauna/mineral/monster outputs plus market rows onto one unprefixed item graph
  - remaining work is to migrate more of the market catalog into canonical item records instead of leaving many tradable goods defined only in the market layer
  - the Step 3 workplace IO normalization pass now separates non-inventory access concepts such as `forest_access`, `ore_vein`, and `grazing_pasture` into `packages/content/base/civilization/workplace_abstractions.json`, with workplaces consuming them through `siteTags`, `ioProfile.siteRequirements`, and `progressionProfile.tiers[].siteLaborWeights` instead of `itemKey`
  - extraction-heavy workplace yield pools now use explicit `ioProfile.yieldGroups` instead of flattened access-driven output lists, while manufacturing workplaces remain strict item-only IO
  - remaining work is to replace generic aggregate items such as `hide_raw` with deliberate provenance-aware item families where species distinctions materially matter
  - remaining work is to let recipes, workplaces, crafting, and codex systems consume `roles`, `tags`, and `processingGroups` directly instead of treating those fields as catalog metadata only
  - remaining work is to add canonical consumable and spoilage profile ownership before `consumableProfileId` and `spoilageProfileId` become populated broadly

#### Crafting dependency closure and intermediate material completion

- Status: partially deferred
- Prerequisite: canonical commodity identity rollout, workplace IO normalization, the first component-layer pass, and the Step 5 support-craft closure pass now exist; remaining prerequisites are dependency-closure validation and any provenance-aware splits that materially affect downstream recipes
- Intended owner: `packages/content/base/items`, `packages/content/base/civilization`, world extraction content, schema/lint tooling, and future crafting/runtime consumers
- Intended implementation:
  - Tier 1 canonicalization now promotes the missing `civilization` and `economy.generic` market rows into `packages/content/base/items/items.json`, covering the current economy-owned processed goods, intermediates, byproducts, food products, stationery goods, ammunition bundles, and trade aggregates without waiting on world-source normalization
  - `tools/content-lint/index.mjs` now enforces that Tier 1 economy-owned refs from `market_item_values`, `production_chains`, and `workplaces` must exist in the canonical item registry rather than remaining market-only strings
  - the Step 2 graph pass now closes the main identity gap by canonicalizing all remaining `world.flora`, `world.fauna`, `world.minerals`, and `world.monster` outputs onto canonical item keys and removing the remaining item and market identity collisions
  - the Step 3 workplace IO normalization pass is now complete: workplaces no longer store site/access abstractions in item-bearing fields, access inputs are separated into `siteRequirements`, and extraction yield pools are represented structurally instead of as flattened item-only output lists
  - malformed whitespace-delimited workplace IO rows were already cleared before the current pass; the remaining Step 3 cleanup was structural normalization of access-bearing extraction records and progression labor weights
  - the Step 4 component-layer pass is now complete inside the current workplace roster: sawmill, loomhouse, tannery, chandlery, coopers, fletchers, armorers, cartwrights, weaponsmiths, bookbindery, and the alchemist atelier now produce or consume the first assembly-critical parts such as shafts, staves, handles, poles, wheel parts, rods, wire, rings, rivets, nails, buckles, hinges, ferrules, blade blanks, yarn, cord, binding strips, leather parts, wick, glue, resin pitch, and adhesive
  - the current component pass intentionally reuses existing `timber_beam` and `linen_thread` ownership instead of adding duplicate generic `wood_beam` or `thread` identities
  - the Step 5 support-craft closure pass is now complete inside the existing workplace roster: chandlery now consumes rendered tallow and wick, tannery now emits rendered tallow alongside leather parts and glue, fletching now depends on explicit heads plus quill/binding inputs, cartwrights and bookbinders now consume cord, and weaponsmiths now emit ammunition heads while consuming leather strap for hafted assembly
  - the current support-craft pass intentionally deepens the existing roster instead of adding new workplaces or broad new visible-output families
  - ensure every crafted output has upstream canonical inputs, every upstream input has a logical source path, and every byproduct is either canonicalized or intentionally abstracted
  - remaining work is to replace broad aggregate goods with deliberate provenance-aware families where the distinction materially affects crafting, cooking, or trade behavior
  - add new supporting workplaces or infrastructure families only after dependency-closure validation shows the current roster still cannot complete the normalized graph with disciplined component outputs and support-part chains
  - tighten validation so workplace inputs/outputs, production-chain primary outputs/byproducts/variant inputs, and market overlays are checked for canonical item backing and intentional abstraction instead of market-only existence

#### Derived recipe valuation and runtime cost resolution

- Status: partially deferred
- Prerequisite: recipe standardization, component/support-part closure, and the new item/market valuation metadata now exist; remaining prerequisites are stockpile fulfillment, broader trade routing, and UI/session consumers that can use the new runtime outputs directly
- Intended owner: `packages/content/base/items`, `packages/content/base/civilization/production_chains.json`, `packages/content/base/civilization/market_item_values.json`, runtime crafting systems, and economy simulation
- Intended implementation:
  - `packages/content/base/items/items.json` now carries `valueProfile` on every item plus `materialDifficultyProfile` on authored material families so value and processing are no longer modeled as flat category assumptions
  - `packages/content/base/civilization/market_item_values.json` now carries `pricingProfile` on every market row so the market layer can consume derived value inputs without hard-coding final price logic yet
  - `packages/content/base/civilization/production_chains.json` now carries `recipeProfile` with explicit processing steps, chain value-propagation rules, and step-level skill thresholds so food and non-food crafting share one authored recipe surface
  - the first deterministic runtime pass now lives in `packages/engines/civilization-engine/src/runtime-economy.ts`, where settlement markets derive local buy/sell prices, craft resolution derives time/cost/waste from recipe metadata, and value now carries forward through chain stages instead of resetting at each output
  - `packages/shared/types/src/contracts.ts` now exposes explainable settlement market state, pressure contributions, craft-resolution breakdowns, and item value-resolution outputs so runtime and UI layers can consume one typed surface
  - `packages/engines/civilization-engine/src/index.ts` now builds per-settlement market states each tick and emits market updates from the same deterministic runtime layer instead of leaving pricing as static descriptive content
  - remaining work is to replace the remaining authored `baseValue` fields as active runtime anchors once stockpile fulfillment, throughput, and settlement trade movement can price goods from live inventory rather than fallback source anchors
  - remaining work is to project the new runtime market/craft explanations into UI/session records and player-facing trade screens instead of leaving them inside engine state only
  - remaining work is to connect runtime craft resolution to actual workplace throughput, worker assignments, inventory consumption, and future quality outcomes instead of using it only for deterministic estimates and price derivation
  - avoid adding broader price simulation, auction dynamics, speculative trading, or random failure before stockpile fulfillment and direct runtime consumers exist for the current deterministic model

### Runtime Enforcement

#### Workplace progression simulation rules

- Status: deferred in runtime
- Prerequisite: implement simulation-engine support for progression tiers, variant slot caps, switch labor costs, and upgrade unlock effects
- Intended owner: runtime simulation / workplace engine
- Intended implementation:
  - current content/schema/lint work defines progression data
  - runtime should later enforce throughput, slot, and switching constraints instead of treating them as descriptive only

#### Infrastructure construction and retrofit rules

- Status: deferred in runtime
- Prerequisite: add runtime systems for infrastructure placement, construction jobs, and civic maintenance
- Intended owner: runtime simulation / settlement construction systems
- Intended implementation:
  - enforce infrastructure tier gates from technology, labor, and materials during actual build decisions
  - allow direct construction of higher tiers without requiring lower tiers first
  - model retrofits as more labor-intensive than fresh builds because teardown and rerouting cost extra work

### Ecology and Content Expansion

#### Region-aware cartographic and ecology follow-through

- Status: partially deferred
- Prerequisite: region metadata exists; remaining prerequisite is broader regional ecology ownership and runtime consumers
- Intended owner: world/region content passes
- Intended implementation:
  - first-pass macro-region climate and ecology overlays now live in `packages/content/base/world/regional_ecology_profiles.json`
  - tie future maps, flora distribution, and fauna distribution more tightly to region-specific identities
  - expand deferred regional realism passes using the authored region records now in place
  - add finer subregion-level ecology overlays and runtime weighting after the major trade regions are stable

### Player Systems

#### Discovery chronicle, inventory metadata, and origin growth ownership

- Status: partially deferred
- Prerequisite: player snapshot fields and starter authored origin profiles now exist; remaining prerequisites are canonical item metadata, runtime discovery emitters, and a canonical content/database owner for expanded lineage and class growth records
- Intended owner: `packages/shared`, player-engine/runtime systems, future player/content databases, and UI/session adapters
- Intended implementation:
  - player state now carries `originProfile`, `discoveryChronicle`, `inventory`, `equipment`, and `currency` so the character UI can render a discovery log, carried items, equipped gear, wallet balances, and lineage/class growth effects
  - starter lineage and class growth rules now live in `packages/shared/types/src/player-origins.ts` for human, elf, dwarf, halfling, gnome, orc, goblin, troll, merfolk, and the current starter class set
  - move lineage/class growth definitions into the canonical content/database layer once the playable race and class roster is broad enough that authored profile coverage should not live inside shared TypeScript helpers
  - add a canonical mapping between authored world race ids and player lineage ids so settlement/region demographics, character creation, and origin growth resolve through the same taxonomy
  - add a raw-vs-derived attribute split so sex variance, lineage adjustments, equipment bonuses, effects, and temporary modifiers can be audited separately from final displayed attribute totals
  - add canonical item stat/value/weight metadata refs so inventory and equipment rows can project real authored data instead of humanized item keys and stack ids alone
  - add runtime discovery emitters, dedupe rules, and codex sync ownership so flora/fauna/mineral/item/note discoveries are written by live simulation systems instead of demo snapshot payloads

#### FFXI-style placeholder progression catalogs and canonical replacement

- Status: partially deferred
- Prerequisite: starter authored progression catalogs now exist; remaining prerequisites are a canonical class/job taxonomy, fuller BG-Wiki placeholder ingestion, player-content validation/seed tooling, and runtime consumers for unlocks and gain rules
- Intended owner: player content databases, combat systems, spell systems, craft systems, and later progression tooling
- Intended implementation:
  - player attributes, skills, abilities, spells, and traits now live as richer authored progression catalogs with SQLite storage support instead of minimal placeholder rows
  - the current pass intentionally uses FFXI-style taxonomy and representative records from BG-Wiki as a temporary stand-in while the game-native class, skill, and spell roster is still fluid
  - the current spell catalog now guarantees at least five authored spells for each supported element and each current black/white magic discipline, so downstream systems can assume basic elemental and subtype diversity
  - remaining work is to ingest broader placeholder coverage beyond that minimum-diversity floor, especially the full black-magic and white-magic line coverage referenced in the authored spell catalog metadata
  - map any placeholder job or role assumptions onto the canonical player class/job taxonomy before runtime unlock logic depends on these records
  - add content-lint or seed-pipeline validation for the richer player catalogs so progression models, unlock rules, and effect payloads are checked the same way broader world content is checked
  - replace the temporary FFXI-inspired records with organic game-native abilities, traits, spells, and skill families once the downstream combat, crafting, and progression systems stabilize

#### Canonical skill, job, workplace, and employment architecture refactor

- Status: deferred
- Prerequisite: replace the current FFXI-style placeholder skill taxonomy, freeform workplace job ids, and quest-only party/deployment assumptions with canonical cross-system registries plus runtime consumers
- Intended owner: player progression content, civilization/workplace content, quest systems, simulation runtime, and UI/session adapters
- Intended implementation:
  - replace the current `packages/content/base/player/skills.json` taxonomy with a game-native permanent skill model organized around combat, magic, crafting, gathering, trade, survival, social, and utility families instead of the current FFXI-derived weapon/magic/craft split
  - introduce a canonical `jobs.json` so professions become explicit temporary employment roles with required skills, preferred skills, workplace eligibility, progression tiers, and compensation expectations instead of remaining embedded string ids inside workplace staffing curves and player state
  - refactor `packages/content/base/civilization/workplaces.json` so workplaces own capacity, role slots, productivity rules, and multi-role burden semantics while jobs own role identity and worker-fit logic
  - generalize the current quest action/deployment concepts into a reusable context-aware action system that can power travel, gathering, trade, hiring, labor, party assignments, and building interactions outside quest trees
  - add canonical NPC/employment/hiring/negotiation data ownership so candidate discovery, wage negotiation, compensation preferences, and worker loyalty are not inferred from ad hoc settlement tags or quest givers
  - split the current flat player reputation model into local fame, regional fame, faction reputation, party reputation, and business reputation, with explicit ownership for gain/loss rules and UI projection
  - align shared snapshot contracts, simulation runtime state, and the React UI so jobs, employees, parties, workplaces, actions, and reputations resolve through the same typed registries instead of duplicating string-only references across content and session state

#### Real-time HP/MP/Stamina effect catalogs and event integration

- Status: partially deferred
- Prerequisite: the runtime calculator now exists; remaining prerequisites are canonical spell/food/equipment effect payloads, combat/runtime systems that emit resource changes, and authored rest/consumption/aura rules
- Intended owner: player-engine runtime, combat systems, spell/item content, and UI/session adapters
- Intended implementation:
  - player resource runtime now supports active modifiers, pending one-shot changes, per-tick breakdowns, and recent history so HP/MP/Stamina can be recalculated each tick instead of treated as static numbers
  - the player engine now resolves origin maxima, equipment bonuses, ongoing buff/debuff/food/aura effects, natural regeneration, assisted regeneration, degeneration, and direct change requests through one calculator path
  - remaining work is to replace fixture-authored modifier payloads with canonical equipment, spell, potion, food, rest, and aura effect data from the content/database layer
  - wire combat damage, healing, spellcasting costs, potion use, food consumption, environmental drains, and rest actions to emit `player.resource.change` and modifier-application events instead of hand-seeding pending changes in test/demo state
  - extend the UI beyond the current character-overview summary so the player can inspect the full resource history and source-by-source breakdown in dedicated views

### Quest Systems

#### Branching quest execution runtime and issuer registry ownership

- Status: partially deferred
- Prerequisite: authored `quest_definitions` and reusable `quest_archetypes` now exist; remaining prerequisites are canonical NPC/business/government entity registries, quest-branch execution runtime, party deployment ownership, and consequence writers for world/player/session state
- Intended owner: quest systems, civilization/runtime engines, faction and civic content, player deployment systems, and UI/session adapters
- Intended implementation:
  - `packages/content/base/civilization/quest_definitions.json` now stores authored quest givers, requirements, schedules, rank/risk, logistics, rewards, and branching action trees with stat/skill/ability/spell/tool/RNG checks
  - `packages/content/base/civilization/quest_archetypes.json` now stores reusable branching quest families for gathering/extraction, escort, extermination, porter, blacksmithing, masterwork smithing, menial labor, and maritime salvage
  - the starter authored set now covers government, business, guild, and individual quest-giver types, including a more operation-style scenario inspired by multi-role organized-crime structures
  - remaining work is to resolve giver ids against canonical NPC/business/government registries instead of leaving some non-guild ids provisional
  - add a runtime branch executor that can evaluate action-tree checks, apply branch effects, consume items, assign injuries/time loss, and emit chronicle/quest-journal updates
  - add party deployment semantics so extra or missing personnel can positively or negatively affect quest branches the way the authored data now describes
  - connect authored quest outcomes to downstream world changes, faction standings, unlock flags, and follow-on quest chains instead of leaving branch effects as descriptive strings only

#### Quest archetype instantiation, canonical refs, and loop execution

- Status: partially deferred
- Prerequisite: reusable quest archetypes now exist; remaining prerequisites are canonical skill/equipment/tag registries plus runtime support for repeated branch loops and material accounting
- Intended owner: quest systems, player progression content, item/equipment content, and runtime execution layers
- Intended implementation:
  - let future generated quest offers and specific `quest_definitions` reference an archetype id instead of duplicating full branch trees whenever the quest follows a standard family
  - add canonical skill/content support for the fields currently proxied through broad attributes or adjacent skills inside archetypes, especially perception, foraging, mining or extraction, hauling, labor endurance, routecraft, and fine-grained craft-stage specializations
  - normalize freeform `class_tag.*` and `gear.*` references used by the archetypes so they resolve against canonical class/job and equipment-tag registries rather than remaining string-only hints
  - add loop-aware runtime execution for repeated work stages such as fold-stack-weld passes, bulk labor cycles, repeated harvest pulls, and multi-room extermination sweeps so branch outcomes can accumulate instead of resolving as isolated text
  - add explicit material-loss, downgraded-yield, casualty, and partial-completion accounting so catastrophic craft failures, cargo damage, late deliveries, and reduced-lot gathering results can modify real inventories and ledgers

#### Universal quest-role adapter matrix and non-combat check families

- Status: deferred
- Prerequisite: the architecture pass for the modular quest-template system now exists; remaining prerequisites are canonical class or job tags, lineage tags, faith-role tags, merchant-role tags, and authored non-combat skill families
- Intended owner: quest systems, player progression content, religion and faction content, and economy systems
- Intended implementation:
  - formalize reusable quest-stage modifiers for class or job, lineage, combat role, crafter profession, merchant role, and religious office instead of leaving those relationships as freeform text notes
  - add canonical non-combat check families needed by the modular quest-template design, especially perception, foraging, mining or extraction, hauling, bargaining, appraisal, persuasion, deception, etiquette, doctrine, ritual purity, investigation, and routecraft
  - expand authored quest archetypes beyond the current combat, labor, and craft-heavy set into diplomacy, temple service, intrigue, merchant-house operations, and other social or faith-driven quest families using those canonical check families
  - resolve quest-state tracks such as suspicion, sanctity, profit margin, morale, and alert into runtime-owned systems so hybrid quests can carry meaningful consequences across stage boundaries

### Frontend UI

#### Live RPG UI data bindings and persistence

- Status: partially deferred
- Prerequisite: shared player/session snapshot fields and a browser-safe UI projection layer now exist; remaining prerequisite is runtime generation of those session records from actual simulation systems
- Intended owner: `apps/rpg-ui`, `packages/shared`, and engine/session runtime layers
- Intended implementation:
  - a player-facing root launcher now exists as `Play Cataclysm.cmd` so the current UI/browser flow can be entered from the project root without terminal knowledge
  - the React/Tailwind shell now reads from a save/session snapshot bridge instead of the earlier freeform mock-data module, and the in-game shell now owns a typed game-session provider that separates raw active snapshots, derived UI view models, and local navigation state while leaving `demoSnapshot` as development-only seed data
  - shared contracts now carry location, currency, reputation, titles, tracked activity, notifications, codex records, quest journal records, chronicle records, operations, origin profiles, inventory/equipment, and the player discovery chronicle in a session-facing shape the UI can project directly
  - `packages/engines/game-engine/src/save-snapshot.ts` now provides a runtime-side snapshot helper, and `apps/rpg-ui/src/runtime/uiViewModel.ts` projects that snapshot shape into panel data
  - `apps/rpg-ui` now has a typed top-level flow with `MAIN_MENU`, `CHARACTER_CREATION`, `LOAD_GAME`, and `IN_GAME` states so the existing shell can be entered from a real front-end game loop instead of rendering immediately on boot
  - the UI now maintains six browser-local manual save slots plus a dedicated quick-save slot backed by `localStorage`, with serialized shared `SaveSnapshot` payloads, stored save metadata, explicit save/load/overwrite/delete/reset-all controls, and corrupt-slot isolation in the front-end shell
  - the UI character creator now runs as a deterministic multi-step flow for lineage, identity, continent, region, settlement, backstory, path, manual attribute allocation, and review, with lineage-valid identity palettes, settlement-aware backstory pools, a slimmer live summary, and a snapshot factory kept separate from the screen component
  - the world, activity, and quest tabs now expose a first playable snapshot-backed loop for accepting a contract, traveling between authored locations, advancing contract work shifts, resting, turning contracts in, and applying rewards to currency, XP, skills, reputation, codex entries, chronicle events, notifications, and operations
  - the detail column now also exposes per-section standard field audits and missing-reference callouts so each submenu window documents what data it expects to receive
  - the character tab now surfaces origin growth, wallet/inventory state, equipped gear refs, and discovery-chronicle records from the snapshot bridge instead of treating those windows as placeholders
  - the character tab now also supports session-backed equip/unequip, inventory filtering and sorting, favorite-item and tracked-skill quick actions, record pinning, and item inspection against the active snapshot instead of acting as a read-only concept panel
  - the in-game shell now uses a docked top bar with centered HP/MP/Stamina bars, icon-tile system navigation, a quest flyout, a settings popover that houses save controls, and a collapsible right-side information pane so panels can reclaim more screen space without leaving the active session
  - pinned items now persist through the saved `sessionState.pinnedRecordIds` snapshot payload, but the current write path is still a UI-local adapter rather than engine-owned save/update orchestration
  - remaining work is to have the simulation produce `worldRecords`, `activityRecords`, `questJournal`, `chronicle`, `codexEntries`, and notification/operation feeds dynamically instead of relying on demo session payloads
  - remaining work is to replace the current UI-authored travel, shift-advance, rest, quest-turn-in, and reward application resolver with engine-owned command handling plus authoritative tick/event output from `packages/engines` or `apps/sim-runner`
  - remaining work is to replace session-flag-driven objective progress, cargo markers, and codex unlock triggers with canonical quest/runtime state owned by the engine layer instead of the front-end command helper
  - remaining work is to replace the current UI-side equip-slot heuristics, session-flag item metadata stashing, and disabled consumable action hook with canonical item definitions plus engine-owned equip/use semantics
  - remaining work is to promote the new shell layout state such as collapsed system tabs, right-side detail visibility, and in-game settings-panel state into canonical UI preferences or session-owned persistence if those presentation choices need to survive reloads instead of resetting per mount
  - the character creator now resolves continent, region, and settlement selection from canonical world data instead of the earlier UI-authored settlement-template catalog
  - remaining work is to replace the UI-authored character creation catalogs for identity palettes, backstories, paths, starter loadouts, and legal-start mappings with canonical content/database ownership once the player-content layer stabilizes
  - the character creator now serves lineage and continent card art from `apps/rpg-ui/public/character-creator`, brings decorative art to the foreground on hover for image-backed cards, expands selected lineage/continent/region/settlement cards into art-forward confirm surfaces, keeps a slimmer live summary behind an inline top-bar toggle that defaults collapsed on continent, region, and settlement steps, and uses a denser left-aligned step rail plus edge-mounted lineage stat panes to preserve card space
  - remaining work is to move the current UI-owned lineage/continent card art manifests, expanded lineage color palettes, sex or height or build tradeoff tables, and any future region or settlement card art into canonical player-content ownership once the player-content layer can author visual identity and starting-stat modifiers directly
  - remaining work is to extend the current region and settlement card hover-preview scaffolding with real decorative art once those image assets exist; prerequisite is authored regional and settlement art, and intended owner is `apps/rpg-ui` until canonical presentation content absorbs that responsibility
  - remaining work is to replace the current creator-side lineage-fit heuristic for uncommon city locals and nobles with canonical settlement demographics or authored lineage-presence data so those hooks do not stay UI-inferred forever
  - remaining work is to validate the richer creator catalogs against canonical skill, item, and trait registries so the UI no longer depends on mixed placeholder refs during new-game generation
  - remaining work is to replace the UI-authored new-game snapshot builder and browser-local slot manager with engine-owned character creation, canonical save-slot metadata, and session persistence once runtime save semantics are finalized
  - the launcher now persists a root light or dark theme choice through browser storage, but only the character creator currently exposes a dedicated theme toggle; remaining work is to unify theme-aware component styling across the broader launcher shell
  - the main menu now treats manual saves as five page-based game-data ledgers over forty browser-local manual slots with direct load, direct new-game targeting, and per-slot deletion; remaining work is to replace the browser-local slot manager with engine-owned profiles or account-scoped storage if save management grows beyond local ledgers
  - the character creator now uses UI-authored lineage name pools, narrative backstory accordions, heuristic region resource icon metadata, and seeded region-description prose; remaining work is to replace those with canonical cultural naming data, settlement demographics, and authored resource-presentation metadata once those content layers exist

#### RPG UI section field coverage and missing references

- Status: partially deferred
- Prerequisite: section-level UI audit scaffolding now exists; remaining prerequisites are canonical content ids plus live runtime adapters that can populate those refs
- Intended owner: `apps/rpg-ui` with follow-on work in `packages/shared`, engine/session adapters, and authored content layers
- Intended implementation:
  - the UI menus now surface per-section descriptions and record counts, and each submenu detail window now lists its standard fields, current data source refs, and missing or empty references
  - remaining character refs include raw base-attribute provenance, derived combat/encumbrance formulas, authored equipment stat payloads, canonical item metadata refs for inventory rows, canonical spell/food/potion/aura modifier payloads, trait modifier tables, faction threshold tables, title equip/unlock ownership rules, runtime ownership for discovery-chronicle writes, consumable-use execution ownership, and full combat/resource event emitters
  - remaining world refs include authored `world_maps` / `world_map_features` ids, player visibility state, region ecology/hazard bindings, settlement stockpile and service refs, route geometry/throughput refs, and live market price/stock feeds
  - remaining activity refs include employer/workplace ids, business revenue-expense ledgers, upgrade catalogs, recipe/station refs, cargo and shipment ids, contract lifecycle refs, service payroll/readiness refs, vessel/crew refs, and operation dependency / input-output refs
  - remaining codex refs include canonical content ids for flora/fauna/minerals/items/recipes/factions, habitat weighting, extraction/drop links, item stat and recipe refs, faction presence thresholds, and note-source linkage
  - remaining quest refs include issuer / giver ids, acceptance-expiry lifecycle refs, objective-state refs, reward ledger links, follow-on or failure consequence refs, and canonical tracked-objective ownership
  - remaining chronicle refs include source event ids, replay/sort indices, encounter / transaction / dialogue / route / recipe / codex / reputation linkbacks, and stable references to the systems that emitted each event

#### World-panel map rendering against authored geography data

- Status: deferred
- Prerequisite: the UI now accepts snapshot-fed known locations and world records; remaining prerequisite is exposing authored `world_maps`, `world_map_features`, route geometry, and visibility state through that snapshot layer
- Intended owner: `apps/rpg-ui` world panel plus future map/presentation adapters
- Intended implementation:
  - the world tab now consumes snapshot-fed known locations and world records for side lists/details, but the map surface remains a placeholder renderer
  - replace the placeholder with rendered authored geography layers tied to the canonical map coordinate system and live player-known-location visibility
  - layer route risk, settlement supply-demand overlays, and region tooltips onto the same map surface after the adapter contract is stable

#### Desktop packaging and embedded launch flow

- Status: deferred
- Prerequisite: a root-level player launcher now exists; remaining prerequisites are a stable production build pipeline for `apps/rpg-ui` and a clear ownership decision for running or embedding the simulation/runtime host in desktop builds
- Intended owner: desktop packaging, `apps/rpg-ui`, and future app-host/runtime integration layers
- Intended implementation:
  - keep `Play Cataclysm.cmd` as the current non-technical root entrypoint while the project remains browser-hosted in development, with the root launcher explicitly handing the UI URL to the system default browser once the dev server responds
  - package the player UI into a desktop shell once the save flow, launcher behavior, and runtime bridge are stable enough that browser-specific boot assumptions can be removed
