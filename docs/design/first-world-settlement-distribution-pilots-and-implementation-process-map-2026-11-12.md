# First World settlement distribution: Starfall and Highcrown pilots, consolidation ledger, implementation process map

Date: 2026-11-12
Source baseline: `master` `343d14ce79b17b5ad9badc06c65f986ebfd7ecf2` / canonical 88-settlement blob `7e00f4243e96909e161ec09a2e8a4c3395f89216`.
Status: **CONNECTOR-PREPARED IMPLEMENTATION PLAN, NOT EXECUTABLE ACCEPTANCE OR CONTENT APPROVAL**.
Policy dependency: [SDT v1.0 draft](first-world-settlement-distribution-and-territorial-ecology-policy-v1-draft-2026-11-12.md).
Active independent functional route: [Starfall geography-to-World economy contract](starfall-geography-to-world-economy-owner-contract-2026-11-12.md) and `docs/dev/current-codex-prompt.md`. This plan does **not** displace L2.

## 1. Purpose and noninterference

Convert the 2026-11-12 [comprehensive location/culture audit](first-world-settlement-geography-and-cultural-distribution-audit-2026-11-12.md) into an evidence-backed, *small-scope* settlement-distribution delivery sequence. Compare an island constrained by habitable footprint, food/water and vessels (Starfall) against an intensely urbanized river/floodplain capital with a wide rural catchment and naturally empty distant territory (Highcrown).

Maintain all 88 existing named settlement anchors, percentages, resident totals, source polygons, roads, Save data, player identity, economy state and feature gates during the initial evidence/policy stages. No immediate global cultural census rebalancing, generator, procedural placement, map icon batch, World runtime activation or Game version increment.

## 2. Consolidated source inventory and stale/active classification

| Input | Current source / conclusion | Reuse or needed update |
| --- | --- | --- |
| Comprehensive audit + `scripts/audit-settlement-map-consistency.mjs` | 88 sites, 0 hard, 61 advisories (connector in-memory witness); exact negative coordinate rejected | Reuse as source baseline; native Node + actual raster proof still missing |
| `settlements.json` | Named settlements, `racialMix`, `populationTotal`, economy/trade, macro anchor; **18 optional `parentSettlementId` / `dependencyRole` examples** | Preserve; audit existing optional parent direction, ID consistency and roll-up semantics before new schemas |
| `regions.json` | 41 region records, macro population/density, distribution patterns, 878 target slots across 28 subregions | Keep target values; classify aspirational, unverified island/river capacity; do not auto-fill |
| `region_localities.json` | 47 locality bands, resource catchments and favored class / max population band | Reuse for candidate suitability; one Watcher's Gate band discrepancy merits exception review |
| `world_hexes.json` / `world_hex_edges.json` | 47 semantic hexes, 49 edges; anchors/hazards/terrain; several ferry/marine topology hazards | Reuse as macro relation; no automatic player travel or local-neighbor equivalence |
| `world_map_features.json`, `world_maps.json`, original PNGs | Macro land/biome/climate geometry and 9.765625 km/pixel scale | Polygon alignment tested; original pixel/elevation/coastline truth needs native evidence |
| `travel_networks.json` and embedded `domesticTradeFlows` | 12 ordinary routes + 8 sea lanes, 155 authored trade-flow rows | Treat commerce as conceptual; verify transfer nodes and volume/preservation before physical traversal |
| `settlement_sites.json` / `settlement_districts.json` | 20 named sites, 14 districts, static place identities | Reuse identity only; never imply staffed services, walkable interiors, spawn zones or economy |
| `starfall_port_chronicle_v1.json` + Starfall area tests | 28×18 **authored** local grid and an empty World template seed, not a georeferenced raster crop | Guard existing local seed; separate World owner and runtime registration stages |
| Old settlement expansion, heuristics, shape, gap, pilot selection plans | Valuable placement/classification/checklist methodology; historic assumptions about parent shape and scale | Retain as planning references, but reconcile actual existing optional parent fields and newer macro-vs-local scale |
| Old Highcrown site-readiness notes | Documented planning/activation history, not necessarily live record status | Fetch current `settlement_sites.json` first: Barge Quays and Palace Terraces now have `status: active`, but remain **static identity only** |

**Editorial consolidation rule:** keep primary authority and historical reports discoverable, do not bulk delete or overwrite old plans. Add supersession/clarification links only after an exact-source review. Do not copy old implementation permission or versions into new authority.

## 3. Pilot A: Starfall Isle (marine constraint)

### Existing facts

- `region.starfall_isle` is a subregion of `region.myridian_chain`. Authored regional estimate: **4 million**, with `urbanPopulationPercent: 38`, `ruralPopulationPercent: 62`, targets **1 city, 2 towns, 3 villages, 1 outpost, 2 strategic sites**. These are *not* acceptance of physically supportable island capacity; reconcile with land area, freshwater, fisheries and mainland imports.
- `region_locality.myridian_ports`: arable/pasture/timber **limited**, fishery **strong**, ore **none**, settlement maximum `large`; coastal and sea-lane bias. `world_hex.myridian_ports` has `freshwaterType: none` as a coarse source tag, not measured proof of no cistern or stream at a particular dock.
- `settlement.starfall_port`: **28,000** residents, macro pixel **(825,245)**, `port_city`, `world_hex.myridian_ports`, region `starfall_isle`. City livelihood is naval brokerage, shipbuilding/rigging, salted fish/customs; staple grain/timber/cloth import pressure.
- `settlement.harbormast_quay`: **5,200**, pixel **(905,270)**, also `myridian_ports`. Source-separated island footprint; source scale implies ~**819 km** straight-line from Starfall, so **not** a nearby city block, walk or farm belt.
- `settlement.foammarket_ferry`: **430**, pixel **(760,355)**, also `myridian_ports`, `parentSettlementId: settlement.harbormast_quay`, `dependencyRole: ferry_crossing`. Approximately **1,247 km** from Starfall at map scale. A parent/dependency link does not create a traversable or short ferry.
- Pearlwake and Chainlight Bastion are additional Myridian macro references, not Starfall starter neighborhoods. The `myridian_ports_myridian_pearl_shoals` edge is tagged `road` despite island separation; no confirmed executable ferry-terminal pair.
- The Starfall template's 28×18 local grid is a distinct authored game scale, not a 28×18 sample of the global 2048×1152 raster. The macro hex's mixed-forest-archipelago family must not override the Starfall Port point's mapped **chaparral** visual biome.

### First candidate catchment, without invented canon

| Sub-area / role | Candidate authoring, not an existing settlement record | Constraint and acceptance proof |
| --- | --- | --- |
| Within Starfall Port's inhabited local boundary | Fish landing, rigging yards, customs/market circulation, storage and repair context | Can reuse authored city economy/industry descriptions; **does not** create a stocked shop, NPC or dock command |
| Near-field coast/local basin | Tiny shore fishery, curing ground, signal/watch site, labor housing | Only after shoreline landmask, local water, correct site owner and route/path evidence; no guessed macro pixel |
| Limited island food/water catchment | Carefully located garden/terrace patch, cistern/rainwater provision, import landing | Must quantify support and dependency rather than conjure extensive fertile farmland |
| Outer islands and hazards | Rare beacon/resource/outpost or seasonal camp, otherwise uninhabited/unsafe cays | Island footprint + route/ship supply required; do **not** fill all polygon parts |
| Inter-island access | Boarding point, sea passage, disembarkation point and access checks | Fully gated on ferry/marine topology owner; no ordinary land-road traversal between detached parts |

The *first* local preview should be a **nonpersisted topology/catchment sketch**, not new settlement rows. A bounded subsequent draft might propose **0–3 named subordinate sites** in the validated immediate Starfall area, but **zero** is a valid result if original raster/carrying capacity/access remain unproven. Do not create a new port city to satisfy a target.

### Starfall failure fixtures

Reject: coast-derived dock on an interior/high-sea pixel; freshwater/farm surplus with no evidence; 800 km “adjacent” walking neighbor; ferry treated as road; underwater access by horse/wagon; NPCs or goods materializing because a guild is named; duplicate population counted as both resident and rural household; a source map anchor reprojected into the playable 28×18 grid without an approved transform.

## 4. Pilot B: Highcrown (dense hub, empty beyond catchment)

### Existing facts

- `region.sapphire_rivers`, Valtherion subregion: authored estimate **52 million** (not the city's residents), **24% urban / 76% rural** and targets **6 cities, 18 towns, 70 villages, 8 outposts, 6 strategic sites**. Reassess against watershed land and actual represented versus unrepresented populations, not as a mass icon-generation order.
- `region_locality.sapphire_rivers_royal_floodplain` has **surplus** arable land, **strong** pasture/fishery, `maxPopulationBand: major`, strong road and river access. `world_hex.sapphire_rivers_royal_floodplain` is river lowland, habitability **95**.
- `settlement.highcrown`: **310,000**, pixel **(1560,255)**, `city`, `populationBand: major`, continental administration, public finance/archives, manufacturing, crown-road/barge access and explicit grain, beer, livestock, timber and fish supply dependencies.
- Other canonical settlements in the same macro hex include Blueflow and Ledgerford, **not** proof of near-field neighborhoods. Kingsbridge is approximately **604 km** straight-line and is a legitimate regional crossing town, not Highcrown's immediate suburb.
- Highcrown's active Barge Quays and Palace Terraces static site identities, plus named districts, can anchor descriptive local-area plans but currently do not execute markets, ferry routes, staffed production, court access or traversal.

### First candidate catchment, without inventing a dense global map

| Belt | Expected geography | Minimum role/evidence |
| --- | --- | --- |
| Urban core | Existing Highcrown, river bluffs, bridges, archive districts, quays | Preserve single macro city; validate local river and district access at proper scale |
| Near-field food/service belt | Farmsteads, mills, orchards, livestock stations, ferry/service checkpoints and hamlets | Floodplain suitability, seasonal flood hazards, road/river carrying capacity, parent/headcount ledger; *local-layer* nodes, not new metro icons |
| Intermediate corridors | Market village, river port, repair/warehouse stop at bottlenecks | Route demand and travel time, jurisdiction, goods transport, no fabricated existing bridge |
| Frontier and uplands | Quarries, forest resource outposts, towers, guarded passes and sparse small settlements | Resource/hazard purpose, constrained water/supply and reason for distance from main population |
| Intentionally sparse territory | Flood-prone ground, guarded forest, dangerous steppe/buffer or treaty domain as supported by canonical locality | Evidence for **not placing** people; protect race/territorial access and wilderness |

Draft **2–6** *candidate* local support nodes only after the non-overlap and exact-scale gate, with no new canonical city. Test a deliberate “no-settlement” polygon/zone alongside productive sites. Avoid choosing exact pixel coordinates or inventing unrelated names until geography accepts them.

### Highcrown failure fixtures

Reject: rural villages assigned 310k city residents again without defined boundary; all grassland filled by identical hamlets; a remote resource site lacking water, worker transport or extraction purpose; elves/dwarves uniformly sprinkled across every rural place; trade partner equated with navigable neighbor; a planned site assumed to be staffed/actionable; a new settlement type exceeding locality max without a documented exception.

## 5. Shared proposed candidate ledger (not a content schema)

A review-only tabular/JSON report should capture **one row per potential node or territorial zone**, with:
`candidateId`, `pilot`, `candidateKind` (named site / rural catchment / seasonal range / hazardous empty area / route transfer), `scale`, `currentCanonicalIds`, `regionId`, `localityBandId`, `hexAnchorId`, `geometryEvidence` (source reference and proof type), `waterFoodFuelEvidence`, `purpose`, `mobility`, `residenceAndVisitorAssumption`, `territorialPosture`, `accessPosture`, `transportEvidence`, `populationOwnership`, `parentOrDependency`, `sourceAuthority`, `confidence`, `exception`, `gateStatus`, and `doNotRenderMacroMarker`.

This is a proposed **offline evidence manifest**, not a valid existing `settlements.json` record or a new game schema. Reviewable reports should include source file/blob/version, rule revision, deterministic ordering by ID, provenance per row, unresolved decision/owner, and no invented census amounts. Separate:
1. **Observed:** canonical field and polygon/test evidence.
2. **Candidate:** a proposed role or placement, with uncertain values left blank.
3. **Accepted:** only after a named reviewer, approved owner/schema and proper validation.
4. **Rejected/held:** reason and explicit release condition.

Do not double-write owners. If a future field becomes necessary, first decide whether it belongs in existing embedded settlement identity, a separate static territory/population authority, a local-site collection, a region/locality plan, or the World runtime. Until then, keep evidence outside runtime source.

## 6. Detailed process map with entry, exit, success and failure

| Stage | Entry | Work + reusable infrastructure | Success/exit | Failure/hold and rollback |
| --- | --- | --- | --- | --- |
| **P0 Source lock and orientation** (connector docs) | Live `master`, audit and current route available | Pin source SHAs, inventory branches/open PRs, read current Codex handoff and pertinent authority; record 18 optional parent/dependency examples and current Highcrown site statuses | Named exact source baseline and source/authority discrepancy register | Changed head or partial file: refetch, do not guess or overwrite |
| **P1 Executable geographic baseline** (local Codex) | Clean synced checkout, Node, original PNGs and tests available | Run settlement CLI, Starfall geography/base-economy/template tests, raster CLI, original PNG legend/landmask checks; retain raw output and hashes | 88 checked, no new hard failures, corrupted-coordinate negative rejected, coastline/elevation facts explicitly witnessed or bounded as unknown | Any hard source mismatch blocks content; if raster decode inconclusive keep `GEO-1`; no relocation to force pass |
| **P2 Policy/census approval** (design decision) | P0 and exact census taxonomy/provenance available; P1 constraints recorded | Review SDT v1, immigrant vs visitor vs nomad vs garrison/catchment, ancestry taxonomy and explicit exceptions | `SDT_V1_ACCEPTED` with unresolved exemptions or `SDT_V1_HELD`; versioned policy freeze | Unresolved source meaning / indigenous-full vs hybrid lineage conflict: hold demographic edits |
| **P3 Starfall dry-run** (read-only mapping) | P1 shoreline evidence adequate to support specific claims, P2 rule or marked provisional assumptions | Derive island separated-footprint vs local area, carrying-capacity/supply sketch and 0–3 candidate local sites from existing resources; mark no-build areas | Every candidate has source, scale, water, purpose, transport, cultural permission and population ownership; 0 new macro city markers | Missing coast/water/access or insufficient land: zero-site result or hold; keep original seed |
| **P4 Highcrown dry-run** (read-only mapping) | P2 policy and exact Sapphire region/locality/hex source | Design urban core, food-service belt, intermediate corridors, resource frontier, empty buffer; 2–6 candidate local nodes, 1 empty-zone test | Cluster/asymmetry demonstrated, node scale and population accounting explicit, existing city unchanged | Uniform-fill / duplicate census / unsupported road: reject candidate, do not move macro city |
| **P5 Data-owner/schema decision** (separate acceptance) | Pilots compared, duplicate-count/parent constraints enumerated | Select embedded descriptive extension vs new static authority vs local sites; define version, validation, deterministic IDs, reference ownership, migration and deprecation rules | Reviewed schema/data decision and compatibility plan, explicit failure fixtures; only then bounded implementation authorization | Unclear Save or loader impact: hold new fields and activation |
| **P6 Tiny content pilot implementation** (Codex checkout) | P5 accepted, task-owned branch/checkout and tests | Add only accepted site/territory candidates at approved resolution; no broad demographic retcon; add validators and fixtures; test parent graph/capacity/water/route consistency | Source compiles/lints; controlled tests cover every accepted row; no duplicate authority; all old anchors/Saves preserved | Revert scoped candidate patch, not existing authored canon; preserve original hash and evidence |
| **P7 Travel, World and local runtime ownership** (independent functional gates) | Original elevation/coast + L2 World registry/clock/economy contract and route/scene owners accepted | Integrate only authorized local, passable terrain and contextual economy/spawn data with explicit world/save lifecycle tests | Deterministic create/load/restart, no fabricated actors or markets, bounded route transfer and non-regression | Runtime/Save/transfer failure: feature OFF, rollback candidate activation, preserve accounts and Saves |
| **P8 Expansion and cleanup** (after accepted pilots) | P6/P7 acceptance evidence and focused review | Extend region by region, update target gap reports, classify stale plans, add source indexes, narrow deprecations | Reviewed capacity-ledger/reuse patterns, all 61 advisories categorized, provenance retained | Any underdetermined cultural or physical geography remains hold; never batch rewrite |

**Order note:** P2 policy review can proceed as documentation while P1 is held, but no physical-placement acceptance (P3) or runtime source change (P6–P7) may bypass the relevant earlier evidence. The active L2 World path and settlement distribution are separate coordinated tracks; P7 is not a surprise blocker imposed on the current L2 design contract.

## 7. Tests and evidence matrix

| Check | Positive case | Negative case | Owner |
| --- | --- | --- | --- |
| Macro referential integrity | All 88 IDs, pixels, region/locality/hex/biome/climate and race-percent sums | x=2048 out-of-map settlement rejected | Existing read-only CLI / local Node |
| Climate/biome interpretation | Legitimate 37 broad climate overlaps and 3 subterranean overlays remain advisories | Wrong expected zone or actual out-of-footprint anchor fails | Geography validator |
| Coast/height | Original PNG channels, legend, sea-level and polygon align at a tested location | Wrong shoreline or crop transform fails; unsupported units stay unknown | Native raster witness |
| Island and transport | Starfall near-field local route proven only at local scale; sea passage uses terminals | Foamy/Harbormast 800+ km shown as walkable neighbor, island `road` treated as bridge, underwater ferry by wagon | Route owner |
| Census conservation | Permanent resident, visitors, garrison, roaming range and dependent site accounted exactly once | Parent + child double counted or transient merchant permanently added | Future census/owner decision |
| Territorial culture | Reclusive core + open border trade can coexist; mobile clan home range | Uniform every-town minority mix or global 100% rule overriding canon | Policy and future content validator |
| Carrying capacity | Starfall fish/import reliance and Highcrown surplus floodplain are supported | Unsupported food/water cities, uninhabitable marine/altitude land site | Locality/hex/raster tests |
| Scale and visual density | Highcrown local support belt but one macro city marker; sparse dangerous buffers | 878 automatic map icons or local 28×18 terrain inferred from 9.7-km pixels | Map/authoring owner |
| Runtime compatibility | Old World/Character/Save paths remain unchanged in docs stages | Modified real player Save, duplicate economy owner or auto-activated spawns | Active L2 and later Codex |

Minimum report must distinguish `PASS`, `DESIGN_ADVISORY`, `EVIDENCE_HOLD`, and `HARD_FAIL`. A test's existence is not evidence that it ran. Preserve the original 61 advisory baseline; deviations require source-specific explanation, not merely a smaller warning count.

## 8. Next bounded Codex segment (copy-ready execution contract)

**Run name:** `First World SDT-G0 Source/Raster and Parent-Graph Witness` (unversioned cross-cutting support, unless current milestone owner explicitly attaches a support suffix).
**Platform:** authenticated local Codex/repository-capable agent with Node and original asset bytes; GitHub text connector is insufficient for native test and raster evidence.

**Entry:** synchronize `origin/master`; confirm exact source SHA, clean task-owned worktree, current handoff/prompt/branch disposition and separate active L2 owner. Read both SDT draft docs and all references listed here. Keep unrelated worktrees, browser profiles, live user accounts and Saves unchanged.

**Allowed first execution:** read-only `node scripts/audit-settlement-map-consistency.mjs --json`; `node scripts/audit-starfall-raster.mjs`; `node --test tests/unit/starfall-map-geography.test.mjs tests/unit/starfall-base-economy.test.mjs tests/unit/starfall-world-template.test.mjs`; inspect actual PNG pixel decoding/legend/sea level and separately record settled footprint/island area uncertainty; enumerate/check 18 optional parent/dependency references, self/cycle/region relation, missing authoritatively described roll-up, and the relevant 16 ferry edges. Use existing content lint/typecheck only if required by the repo protocol and feasible in the synchronized checkout. Keep raw command output, exact paths, hashes, node version and source SHA. Negative coordinate fixture remains part of auditable evidence, not a canonical-file edit.

**Expected exit:** a committed/pushed focused **evidence report only** in the appropriate repository workflow, with exact confirmed/held classification, no relocation, racial/census rewrite, new settlement, travel change, generator, gameplay activation, schema/storage change, production build claim or Game-version change. Stop with `SDT_G0_RASTER_HOLD` or `SDT_G0_SOURCE_HOLD` if provenance or reproducibility fails. On success, hand back a narrow P2 acceptance question and P3/P4 dry-run artifact specification. Never declare P2 policy approved solely because P1 source checks pass.

## 9. Completion checklist and next review trigger

- [ ] Source head/asset SHA and Node/raster witnesses reproduced locally
- [ ] 18 current optional parent/dependency records inspected against schema and actual population counting
- [ ] Full vs hybrid nonhuman taxonomy decision recorded
- [ ] Permanent residents/visitors/garrison/mobility/rural ledger contract accepted
- [ ] Starfall island area/water/harbor transfer and Highcrown floodplain/watershed truth classified
- [ ] Approved small pilot candidate manifest shows **occupied and deliberately unoccupied** locations
- [ ] Versioned data/schema ownership and compatibility decision made before new content fields
- [ ] Original 88 settlements, original Saves/World data, active L2 route and protected branches retained
- [ ] Future route continuation documented with checks, explicit stops and exact source/commit identities

This document is preparatory; none of these unchecked items are claimed completed.