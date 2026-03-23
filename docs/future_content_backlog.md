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
  - keep the browser centered on `world_maps` as the player-facing map surface while lower-level geometry data remains an internal support layer for rendering and route validation

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
- Prerequisite: authored settlement data now exists; remaining prerequisites are runtime population-consumption rules, route throughput, migration/urban growth logic, automated terrain-aware pathfinding, and region-aware infrastructure service effects
- Intended owner: region data, economy simulation, settlement simulation, and infrastructure routing systems
- Intended implementation:
  - authored settlement records now live in `packages/content/base/world/settlements.json`
  - authored map scale benchmarks and route metadata now live in `packages/content/base/world/world_maps.json` and `packages/content/base/world/travel_networks.json`
  - settlement records now carry pixel-coordinate map locations with climate and biome zone bindings on the shared 2048x1152 map grid
  - world-map features now define coastlines, rivers, mountains, passes, crossings, and region footprints for the authored map
  - browser-facing raster map layers now exist, and authored route data is now constrained so land corridors cannot use sea terrain without crossing/pass mechanisms and sea lanes must terminate at coastal harbor settlements
  - the settlement layer now includes both primary centers and a first dependent-settlement layer of estates, hamlets, monasteries, ferry posts, camps, and similar support sites
  - settlement records now include authored guild-building presence for major human trade, craft, logistics, and adventuring nodes
  - use those records as the canonical layer for domestic production, regional trade links, infrastructure level, and population-center identity
  - add runtime settlement demand, storage pressure, migration, and urban growth instead of leaving settlement sizes as static authored values
  - convert authored route geometry and travel timings into simulated throughput across roads, rivers, coasts, and canals once transport systems consume route data directly
  - if route authoring needs to become more automatic later, add path generation against the shared pixel terrain model instead of continuing to hand-author every corridor

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

### Frontend UI

#### Live RPG UI data bindings and persistence

- Status: partially deferred
- Prerequisite: shared player/session snapshot fields and a browser-safe UI projection layer now exist; remaining prerequisite is runtime generation of those session records from actual simulation systems
- Intended owner: `apps/rpg-ui`, `packages/shared`, and engine/session runtime layers
- Intended implementation:
  - the React/Tailwind shell now reads from a save/session snapshot bridge instead of the earlier freeform mock-data module
  - shared contracts now carry location, currency, reputation, titles, tracked activity, notifications, codex records, quest journal records, chronicle records, operations, origin profiles, inventory/equipment, and the player discovery chronicle in a session-facing shape the UI can project directly
  - `packages/engines/game-engine/src/save-snapshot.ts` now provides a runtime-side snapshot helper, and `apps/rpg-ui/src/runtime/uiViewModel.ts` projects that snapshot shape into panel data
  - the detail column now also exposes per-section standard field audits and missing-reference callouts so each submenu window documents what data it expects to receive
  - the character tab now surfaces origin growth, wallet/inventory state, equipped gear refs, and discovery-chronicle records from the snapshot bridge instead of treating those windows as placeholders
  - remaining work is to have the simulation produce `worldRecords`, `activityRecords`, `questJournal`, `chronicle`, `codexEntries`, and notification/operation feeds dynamically instead of relying on demo session payloads
  - pinned items are still persisted locally in the UI app; move that ownership into the player/session layer once save/update semantics are finalized

#### RPG UI section field coverage and missing references

- Status: partially deferred
- Prerequisite: section-level UI audit scaffolding now exists; remaining prerequisites are canonical content ids plus live runtime adapters that can populate those refs
- Intended owner: `apps/rpg-ui` with follow-on work in `packages/shared`, engine/session adapters, and authored content layers
- Intended implementation:
  - the UI menus now surface per-section descriptions and record counts, and each submenu detail window now lists its standard fields, current data source refs, and missing or empty references
  - remaining character refs include raw base-attribute provenance, derived combat/encumbrance formulas, authored equipment stat payloads, canonical item metadata refs for inventory rows, canonical spell/food/potion/aura modifier payloads, trait modifier tables, faction threshold tables, title equip/unlock ownership rules, runtime ownership for discovery-chronicle writes, and full combat/resource event emitters
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
