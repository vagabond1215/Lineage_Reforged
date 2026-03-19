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
- Prerequisite: establish the spell database and spell metadata first
- Intended owner: `enchanters`, with follow-on support from `scriptorium` and `bookbindery` content
- Intended implementation:
  - define spell-bearing book item families after spells have stable tiers, schools, and storage rules
  - add arcane copy, binding, and attunement rules after mundane book production is settled

#### Magical scrolls

- Status: deferred
- Prerequisite: establish the spell database and spell metadata first
- Intended owner: `enchanters`, with scroll substrate support from `scriptorium`
- Intended implementation:
  - define spell scroll payloads after spell data can describe charges, decay, and inscription limits
  - layer magical scroll production onto the non-magical scroll pipeline instead of duplicating it

### Cartography

#### Region-based maps

- Status: partially deferred
- Prerequisite: region metadata and authored boundary/polygon data now exist; remaining prerequisites are cartography item families, stored map-art assets in the repo, and physical map-item ownership rules
- Intended owner: future cartography/mapmaking content
- Intended implementation:
  - the first authored world geography pass now lives in `packages/content/base/world/regions.json` and `packages/content/base/world/world_maps.json`
  - coordinate-backed feature geometry now lives in `packages/content/base/world/world_map_features.json`, including region footprints, climate zones, biome zones, rivers, mountain belts, passes, and crossings
  - add map item families now that region data can anchor them
  - keep future map generation tied to real region records rather than placeholder generic maps
  - add stored raster assets and boundary geometry when cartography content needs visual/physical map ownership instead of metadata only

### Regional Economies

#### Regionally updated supply and demand

- Status: partially deferred
- Prerequisite: hierarchy ledgers now exist; remaining prerequisites are trade-lane throughput resolution, storage fulfillment, settlement stockpiles, and kingdom definitions
- Intended owner: economy simulation, market systems, and region data
- Intended implementation:
  - first-pass macro-region ecology and a manual domestic production / trade-gap report now exist for the authored world map
  - the civilization tick now builds per-tick supply/demand ledgers and shortfall/surplus summaries across `workplace`, `building`, `settlement`, `subregion`, `region`, and top-level world-map ledger nodes
  - guild halls now contribute building-level supply/demand pressure and can issue quests from those ledgers, including synthesized adventurers-guild fallback presence when a settlement has other guild business but no explicit adventurers hall
  - remaining work is to resolve actual fulfillment across travel lanes, move goods between stockpiles, and layer kingdom-level aggregation once kingdoms exist
  - tie shortages, surpluses, and trade specialization to local ecology, infrastructure, workplace density, and route throughput instead of treating ledgers as descriptive totals only

#### Settlement consumption, growth, and routing

- Status: partially deferred
- Prerequisite: authored settlement data now exists; remaining prerequisites are runtime population-consumption rules, route throughput, migration/urban growth logic, and region-aware infrastructure service effects
- Intended owner: region data, economy simulation, settlement simulation, and infrastructure routing systems
- Intended implementation:
  - authored settlement records now live in `packages/content/base/world/settlements.json`
  - authored map scale benchmarks and route metadata now live in `packages/content/base/world/world_maps.json` and `packages/content/base/world/travel_networks.json`
  - settlement records now carry pixel-coordinate map locations with climate and biome zone bindings on the shared 2048x1152 map grid
  - world-map features now define coastlines, rivers, mountains, passes, crossings, and region footprints for the authored map
  - the settlement layer now includes both primary centers and a first dependent-settlement layer of estates, hamlets, monasteries, ferry posts, camps, and similar support sites
  - settlement records now include authored guild-building presence for major human trade, craft, logistics, and adventuring nodes
  - use those records as the canonical layer for domestic production, regional trade links, infrastructure level, and population-center identity
  - add runtime settlement demand, storage pressure, migration, and urban growth instead of leaving settlement sizes as static authored values
  - convert authored route geometry and travel timings into simulated throughput across roads, rivers, coasts, and canals once transport systems consume route data directly

#### Guild institutions and contract systems

- Status: partially deferred
- Prerequisite: authored guild definitions, settlement guild presence, and baseline quest generation now exist; remaining prerequisites are runtime contract acceptance/completion, warehousing, banking, apprenticeship, and market-service consumers
- Intended owner: economy simulation, civic institutions, settlement services, and market systems
- Intended implementation:
  - shared guild definitions now live in `packages/content/base/civilization/guilds.json`
  - settlement records now include `guildPresence` to describe merchant, adventurer, agricultural, mining, shipwright, teamster, scribal, and similar human guild buildings
  - merchant buy-in rules, task-trial entry models, and broad trade ownership splits are now authored as data definitions rather than implied only by settlement notes
  - the civilization tick now generates baseline guild-issued quest offers from settlement and guild-building ledgers, with adventurers-guild fallback behavior enforced in runtime
  - add runtime behavior for accepting, completing, expiring, and paying out guild-backed contracts instead of leaving quest offers as generated notices only
  - add bonded storage, credit, apprenticeship progression, and guild-backed service demand when runtime consumers exist
  - let future civic and faction systems react to guild density, specializations, and regional concentration

### Monsters and Encounters

#### Monster encounter distribution and lairs

- Status: partially deferred
- Prerequisite: baseline monster catalog and quest-facing drops now exist; remaining prerequisites are encounter tables, lair ownership, habitat weighting, and combat/runtime consumers
- Intended owner: world simulation, encounter generation, quest systems, and regional ecology
- Intended implementation:
  - `packages/content/base/world/monsters.json` now includes a broader starter set of kobolds, slimes, wolves, vermin, scorpions, centipedes, elementals, and undead with saleable drops/loot
  - use that catalog later for real spawn tables, hazard pressure around settlements, lair placement, and route danger instead of relying only on authored quest references
  - connect monster drops to broader crafting, alchemy, and economy consumers once those downstream systems are formalized

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
