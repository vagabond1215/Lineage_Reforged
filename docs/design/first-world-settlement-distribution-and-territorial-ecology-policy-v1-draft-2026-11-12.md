# First World settlement distribution and territorial ecology policy (SDT v1.0 draft)

Date: 2026-11-12
Baseline: `master` `343d14ce79b17b5ad9badc06c65f986ebfd7ecf2` (audit evidence commit); settlement blob `7e00f4243e96909e161ec09a2e8a4c3395f89216`.
Status: **PROPOSED VERSIONED DESIGN POLICY; review required; not an accepted content/schema/runtime change**.
Owner: First World authored content. Game version, development milestone, World Save format, and policy revision are distinct identities.

## 1. Decision to be approved

Establish an asymmetric, layered settlement-distribution policy that preserves the existing authored world and aligns resident population, cultural territory, movement, local resource capacity, and travel access. Do **not** evenly distribute mapped cities, confuse cultural access with ethnicity, or turn every regional target into a map pin.

This draft is a design gate for the two pilots described in [the companion pilot/process map](first-world-settlement-distribution-pilots-and-implementation-process-map-2026-11-12.md). It is **not** authorization to move canonical cities, rewrite the census, generate 878 settlements, change climate/elevation imagery, unlock routes, execute World creation, migrate Saves, alter live players, or deploy.

## 2. Source hierarchy and ownership

| Concern | Current authoritative source | SDT posture |
| --- | --- | --- |
| Named macro settlements and embedded descriptive census | `packages/content/base/world/settlements.json` (`world.settlements`) | Keep all 88 IDs, macro coordinates, `populationTotal`, `racialMix`, economic/trade descriptions stable during policy/pilot planning |
| Macro and subregion population / distribution targets | `regions.json` (`populationProfile`, `settlementDistributionModel`) | Aspirational planning context, **not** settlement-count or census truth |
| Resource plausibility and local suitability | `region_localities.json` (`resourceCatchment`, `settlementSuitability`); `world_hexes.json` | Use as filters and evidence; they do not assert exact local tiles or ownership |
| Map polygons, climates, global reference pixels | `world_map_features.json`, `world_maps.json`, source raster assets | Macro placement reference; raster/shoreline checks remain independently required |
| Routes, adjacency, ferries and trade | `world_hex_edges.json`, `travel_networks.json`, embedded trade flows | Economic exchange is not proof of a traversable player route |
| Districts and sites | `settlement_districts.json`, `settlement_sites.json` | Static identity only, not populated services, facilities, workers, interiors or playable paths |
| Polities, culture, clan reach and border law | Existing region notes and limited polity authority | Propose territorial descriptions separately; no new automatic political control or access checks |
| Mutable economy, population, clocks and persistence | Existing civilization/World/Save owners and their future accepted contracts | No parallel population store, stock generator, Save migration or gameplay owner here |

Specific older planning sources remain **heuristic**: `regional-population-center-expansion-audit.md`, `settlement-placement-heuristics-plan.md`, `settlement-expansion-content-shape-plan.md`, `settlement-target-gap-report-plan.md`, and `pilot-region-selection-criteria-plan.md`. Later decisions and live source win on conflicting field or activation claims.

## 3. Population vocabulary: never silently add unlike quantities

A future versioned census needs mutually explicit categories:

| Category | Meaning | Counting rule in an approved future model |
| --- | --- | --- |
| `permanent_resident` | People whose normal domicile is a named settlement | Count once in the settlement resident census, including resident minorities |
| `rural_hinterland` | Dispersed households and satellite hamlets outside the named city boundary | Count in the region/population ledger, not assumed to be inside the metropolis marker |
| `temporary_visitor` | Merchants, pilgrims, guests, diplomats, itinerant workers | Presence/occupancy, **not** automatic resident `racialMix` |
| `rotating_garrison` | Military staff stationed temporarily | Report assigned headcount separately unless separately established as permanent domicile |
| `mobile_or_seasonal` | Nomadic clan, pastoral camp, seasonal fishing, shifting forest band | Attribute to a home-range/season ledger, not every camp visited |
| `dependent_site` | Outpost, ferry, mine, estate, hamlet, lookout, watch, resource camp | May have resident or temporary headcount; avoid double-counting parent/catchment populations |
| `uninstantiated_population` | Macro demographic estimate not represented as individually authored places | Remains an estimate, not a roster of generated settlements |

**Current data caveat:** existing `populationTotal` and `racialMix` are authored descriptive settlement fields. They do not yet carry those distinct census categories. Existing totals remain unchanged until a separate schema/compatibility owner decision defines whether they represent strictly permanent residents, inhabited marker totals, or a different legacy baseline. No retroactive interpretation or additive arithmetic is approved by this draft.

The nine macro-region estimates sum to **365 million**, while the 88 named marker populations sum to **1,763,400** in the Nov 12 audit. Do not interpret the gap as 363+ million missing map icons or resolve it by duplicating city residents in generated villages. Create a non-overlapping coverage ledger and explicitly tag uncertainty before any population conservation claim.

## 4. Cultural territory is not an ancestry percentage

Propose future authored *territory/access* descriptors independent from census and polity:
- `territorial_posture`: protected enclave, metropolitan catchment, negotiated frontier, mobile home range, mixed trading zone, marine domain, sparsely inhabited exclusion/hazard area, or disputed zone;
- `mobility_posture`: sedentary, semi-sedentary, seasonal, migratory, or mixed;
- `access_posture`: open, customs-controlled, escorted, treaty-limited, resident-only, physically restricted, or currently unknown;
- `residence_posture`: accepted outsiders, controlled exemptions, rare permanent outsiders, or unverified;
- `evidence`: named canonical sources plus optional exceptional treaty/historical reason; `confidence`: sourced, inferred/plausible, or unresolved.

These are **candidate design descriptors**, not fields to insert into current JSON or runtime. A group can trade freely from a border market while keeping its core city closed to settlement. Polity allegiance, ethnic identity, language, law, legal residency and actual path access remain different questions.

### Default cultural geography, subject to authored exceptions

- **Elven forest/grove cores:** strongly protected, concentrated and usually reclusive. A working *illustrative* aim for an explicitly closed core may be 98–100% permanent native residency, with most outside contact in gateway posts, seasonal markets and embassies. This is **not** a global numerical validator or an instruction to overwrite Silvergrove (94%), Verdeward (93%), or Moonwell Grove (95%).
- **Dwarven mountain and subterranean settlements:** strong ancestral majorities, harsh/underground living limits casual migration; quarry, surface exchange gate, mining contractor and diplomatic quarter can plausibly differ. Stonevein (94%) and Passglass Hold (92%) should not be globally homogenized; their permanent human households need explicit suitability/exception evidence.
- **Merfolk and other fully aquatic societies:** marine depth, breathing/access and vessel transition are primary constraints, not merely cultural preference. Lantern Deep and Nacredeep presently say 100% `half_merfolk`; full `merfolk` character lineage exists. Reconcile authoring taxonomy **before** changing either census or allowing land-only travel.
- **Human kingdoms and cities:** dominant metro hubs, satellite food/service belts, uneven river/coastal corridors, thin unsettled intervals and purposeful frontier watch/resource sites. Cosmopolitan minorities cluster around law, work, sea/river traffic and borders, not a repeated world-wide mix.
- **Orc, goblin and troll populations:** permit closed fortified cores, towns, small villages, nomadic/semi-nomadic clans, temporary camps, controlled trade posts, seasonal pastures and broad cultural range without a large visible city in each hex. Existing records such as Redroot Warrens use hybrid ancestry keys; reconcile full-versus-hybrid lineages and clan identity before census conversion. Avoid treating entire peoples as invariably hostile or universally nomadic.
- **Halflings, gnomes, mixed and other settlements:** use local livelihood, history, trade and governance; do not mandate either isolation or mixing by race alone.

Any percentage-based change requires a named source/accepted exception, proposed permanent-resident numerator and denominator, reconciliation against marker population and surroundings, and approval. Visitors may be numerous even where permanent non-native households are rare.

## 5. Multi-resolution placement and deliberate emptiness

| Spatial level | What it may express | What it must not imply |
| --- | --- | --- |
| Whole-world pixel atlas (~9.765625 km/reference pixel) | Canonical macro anchors and named distant systems | Individual docks, farm plots, walkable paths or precise coastlines |
| Subregion/locality/hex | Watersheds, agricultural belts, passes, cultural reach, strategic routes, sparse lands | Exhaustive survey of every household or landmass |
| Settlement catchment plan | Rural producing hinterland, service villages, satellite workshops, defense, dependencies | Automatically independent city records on the macro map |
| Authored local area | Deterministic traversable environment once exact site/scene owner accepted | A raster crop invented from macro imagery |
| Runtime entities and mutable state | Only in later accepted World, encounter, crafting, economy and persistence owners | Never created by static geography metadata alone |

A legitimate large human capital can have many local farms and workshops with **zero additional macro-scale settlement markers within 250 km**. This is a scale mismatch to resolve, not necessarily missing canonical history. Conversely, a strategically useful isolated fort can sit far from any city if its function, supply and access make sense. Define deliberate unoccupied buffers and avoid uniform fill.

For new candidate nodes require a **purpose** (`residential`, `food`, `fishing`, `material_extraction`, `defense`, `passage`, `religion`, `trade`, `seasonal`, `other explicit`), an appropriately scoped spatial owner, a parent/independence decision, and a stated reason not to render a world-map icon.

## 6. Placement and capacity test, in order

1. **Physical land/water truth:** confirm location or marine site matches canonical polygons; for shoreline/elevation claims require actual raster and legend/sea-level validation. Refuse inferred harbors from global pixels.
2. **Biomes/climate/relief:** check the correct visual part and local overlaid/subterranean exception; do not flag all broad climate overlaps as errors.
3. **Survival capacity:** arable/fisheries, usable freshwater, timber/fuel, shelter and import reliability. An isolated dry resource site may be staffed but not become a self-supporting city.
4. **Economy and labor:** explicit reason to locate there (river crossing, quarry, shipyard, fishery, grain belt, defense); reuse authored goods and industry profiles; no fabricated market stock or service activation.
5. **Territory, law and mobility:** land rights, treaties, military control, migration, cultural permeability, border trading vs interior residence.
6. **Transport:** verified connected land corridor, real bridge/ferry terminal, river navigation or vessel transfer. Mere trade relation is insufficient.
7. **Population conservation and visibility:** proposed counts, which ledger owns them, whether overlap with an existing city is possible, map/icon scale.
8. **Hazards and ecological impact:** wildlife, monster habitat, raiding/migration corridors, protected forest/water, seasons; preserve wilderness.
9. **Provenance and exceptions:** every deliberate deviation has rationale, source, review status and negative fixture.

The existing regional `settlementDistributionModel.targetCounts` totals **878 aspirational category slots over 28 subregions** (40 city, 148 town, 472 village, 125 outpost, 93 strategic). Do not enforce them as deficits until physical capacity, category mapping, census and island area are independently accepted.

## 7. Advisory register and explicit holds

The Nov 12 audit outcome is `SOURCE_RELATIONSHIPS_VALID_WITH_DESIGN_WARNINGS`: **88**, **0 hard**, **61 advisories**, comprising **37 overlapping climate zones**, **3 subterranean dual-biome overlays**, **20 locality nonfavored settlement-type preferences**, and **1 Watcher's Gate locality population-band mismatch**. The first two categories are not intrinsically defects. Keep every row traceable; do not turn a preference into automatic relocation.

Separate cross-system safety holds:
- `GEO-1`: original coastline/sea-level/elevation raster proof; Starfall and candidate ports unresolved.
- `TRAVEL-1`: 16 ferry-tagged hex edges have terrestrial travel modes only, including 4 undersea-linked edges; Myridian inter-island `road` edge requires transfer topology or explicit nontraversal.
- `CULTURE-1`: census/residency taxonomy, nonhuman full-versus-hybrid identity, mobile-range ownership unresolved.
- `HINTERLAND-1`: local-scale owner, parent/catchment ledger, sparse corridors and candidate counts not yet accepted.
- `L2` World/registry/economy: follow the separate active Starfall World owner gate. SDT may inform L2 authored geography but must not silently modify it.

## 8. Existing dependent settlement reality (audit correction)

Direct source read of the exact settlement blob finds **18 records** with `parentSettlementId` and `dependencyRole`. Examples: `settlement.foammarket_ferry` → `settlement.harbormast_quay` (`ferry_crossing`), `settlement.moonwell_grove` → `settlement.silvergrove` (`satellite_hamlet`), `settlement.quarrymule_camp` → `settlement.stonevein` (`resource_camp`). Therefore, the older planning statement that such fields do not exist at all is outdated.

**Do not infer more than the field proves:** these are optional authored dependencies on a limited number of records, not a general runtime parent/child population ledger, valid physical proximity, travel route, district placement, service ownership or complete settlement hierarchy. Inspect current validators and both directionality and overlap before expanding this vocabulary.

## 9. Design approval and versioning

SDT v1.0 remains **draft** until review resolves: (a) census semantics and historical totals, (b) full ancestry vs hybrid and nonhuman sovereign/clan identity, (c) mixed-city vs closed-city exception vocabulary, (d) land/water, local-map and route evidence thresholds, (e) population and parent roll-up rules, (f) pilot authoring format and deterministic source versioning. Record an explicit `SDT_V1_ACCEPTED` or `SDT_V1_HELD` in a later review; do not infer acceptance from a PR or a green linter.

If accepted, keep a frozen policy revision and separate a data contract/version decision before adding any content fields. **No `GAME_VERSION`, Save schema, runtime, existing demographics, coordinates, travel, or economy change is approved here.**

Related: [comprehensive Nov 12 audit](first-world-settlement-geography-and-cultural-distribution-audit-2026-11-12.md), [settlement identity boundary](settlement-identity-schema-decision.md), [world geography boundary](world-geography-authority-boundary-decision.md), and the [Starfall geography/World economy owner gate](starfall-geography-to-world-economy-owner-contract-2026-11-12.md).
