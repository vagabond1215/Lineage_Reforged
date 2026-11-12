# First World: comprehensive settlement location and cultural-geography audit

Date: 2026-11-12
Source: development master at start of audit `c158987922885a860c3132c15b0606ff54829f3a`
Content blob identity: settlements `7e00f4243e96909e161ec09a2e8a4c3395f89216`; mapped features `9cd6752e9dbca00796e5f7c013066bb0e5a96175`.
Status: **READ-ONLY SOURCE AUDIT / DESIGN CORRECTION REQUIRED; NO SETTLEMENT MOVES, RACE REWRITES, ROUTE ACTIVATION OR WORLD SAVES.**

## Audit scope and methodology

Evaluated every `88` canonical `world.settlements` record against its map pixel, region footprint, authored biome/climate layer, region/locality/hex ownership, site class, rural suitability, population, racial mix, trade neighbors, map scale, regional distribution targets, and cross-hex transport. Source is `packages/content/base/world/`; exact referenced layers include `world_map_features.json`, `world_maps.json`, `regions.json`, `region_localities.json`, `world_hexes.json`, `world_hex_edges.json` and `travel_networks.json`. The companion repeatable read-only script is `scripts/audit-settlement-map-consistency.mjs`.

Point-in-polygon uses settlement pixel centers (x+0.5,y+0.5). Matching the specifically authored zone is required; **other overlapping climate boxes are not presumed invalid**. A subterranean city may rightly overlap the terrain's surface biome and an underdark biome. An underwater settlement is expected in a marine biome with no land footprint. Visual-map pixels are **macro map references**, not local travel tiles.

### Confirmed source and completeness

- **88 settlements, 47 world hexes, 41 regions, 47 locality bands, 201 region-footprint polygon parts, 68 coastline polygons, 19 climate zones and 230 biome polygon parts.**
- Land/site relationship: 86 land-footprint anchors with a single matching footprint, plus 2 deliberately offshore underwater sites. 3 subterranean surface/underworld biome overlays; 37 expected-zone-containing climate overlaps.
- **0 map/biome/region source mismatches** in the audited geometry layer. Region, locality, hex ownership, reverse anchors, race percent totals and trade-partner IDs also resolved in the connector in-memory checks.
- All 47 semantic hexes have ≥1 settlement anchor, **but 143 of 201 region polygon parts have no settlement marker**. Some parts may be coast/artwork fragments, not habitable independent islands: do **not** equate these counts with confirmed settled/unsettled islands.
- Map scale: **9.765625 km / world pixel**. It is not a harbor street-grid scale. The source PNG elevation/biome channels and actual sea-level legend were not decoded in this connector pass.

| World system | Authored markers | Sum of these markers' residents | Region-wide population estimate | Markers ≥50,000 |
| --- | ---: | ---: | ---: | ---: |
| Kaelvar | 14 | 220,750 | 40M | 1 |
| Valtherion | 18 | 656,080 | 140M | 3 |
| Serathyl | 13 | 288,160 | 55M | 1 |
| Draemor | 13 | 375,100 | 90M | 2 |
| Talmyra | 13 | 147,630 | 25M | 1 |
| Myridian Chain | 5 | 44,430 | 8M | 0 |
| Lantern Isles | 4 | 13,490 | 4M | 0 |
| Serpent's Wake | 4 | 6,540 | 2M | 0 |
| Dawnreach Isles | 4 | 11,220 | 1M | 0 |

The full settlement marker population is **1,763,400** while the nine macro regions estimate **365 million** residents. These are NOT comparable coverage counts without specifying whether settlements are representative named nodes or a complete census. The gap strongly indicates uninstantiated hinterlands/rural communities, but it does not authorize distributing 363 million people to new individual points.

## Priority 0: map and travel safety

1. **Macro coast must be verified before moving or approving any coastal capital.** The authoring includes map-polygon containment, not an independent shoreline-distance/sea-level witness. A preliminary nearest-distance check against the `coastlines` feature polylines yields very large separations for Seabanner and Tidecrown; that could indicate incomplete coastline traces or mismatched coordinates. Verify against both ORIGINAL PNGs and coastline feature topology, rather than auto-moving either city. Also inspect Aurelis, Aurora Anchorage and Icehook Jetty. A world atlas pixel is almost 10 km wide, so the same source cannot resolve individual docks.
2. **16/49 hex edges are tagged `ferry` but enumerate only terrestrial modes** (foot/horseback/pack-animal/wagon), with no explicit vessel transfer or terminal semantics. 4 touch the underwater Lantern Deep/Nacredeep hexes: `world_hex_edge.lantern_harbors_lantern_reef_depths`, `world_hex_edge.lantern_reef_depths_lantern_shrine_gardens`, `world_hex_edge.dawnreach_aurora_harbors_dawnreach_nacre_depths`, `world_hex_edge.dawnreach_nacre_depths_dawnreach_whalebone_watches`. Treat these as potential topology hazards; this audit does **not** prove the current runtime grants walking/horseback access underwater. Establish above-water dock → boarding → vessel → underwater access gates before exposing an executable route.
3. `world_hex_edge.myridian_ports_myridian_pearl_shoals` is a **road** edge with ordinary land modes, even though Starfall/Foammarket/Pearlwake occupy distinct island footprint parts and the Foammarket crossing has no confirmed terminal pair. Resolve or explicitly disable such crossings; do not fabricate a bridge.
4. The route network has `12` ordinary route records and `8` interport sea lanes, versus **155 domestic trade-flow rows**; 87 of those flows exceed 1,000 km straight-line. Trade relationships need not equal passenger routes, but routine grains, fish and fresh produce require regional provenance, cost/time/cold-chain or preservation assumptions and intermediary staging. Some computed long-distance authored corridors already explicitly reflect multiweek journeys.
5. Starfall Port to Harbormast Quay is approximately **819 km** straight-line on this scale (existing authored sea route agrees), not an adjacent walkable neighbor. Starfall → Foammarket is roughly **1,247 km**, → Pearlwake roughly **1,112 km**. Keep these as regional maritime connections, not an immediate contiguous Starfall local-area spawn.

## Priority 1: cultural and racial geography

### Existing strong canonical enclaves to preserve

- **Elven:** Silvergrove (94% elves), Verdeward (93%), Moonwell Grove (95%) in forest/vale regions. Their physical isolation and botanical/cultural governance are credible; a 4–5% human resident minority in a city still means many hundreds or thousands of people. If the intended rule is nearly closed permanent residency, distinguish embassy/merchant visitors from residents rather than simply deleting contacts or mixed city history.
- **Dwarven:** Stonevein (94% dwarves), Passglass Hold (92%), Quarrymule Camp (93%) and Deepecho Camp (93%) have mountain/ore/subterranean or extraction context. Stonevein's 4% humans (~1,368) and Passglass Hold's 6% (~1,908) need restricted surface enclaves, temporary workers or an adjusted permanent census; no automatic rule that dwarves must reject all outsiders.
- **Underwater:** Lantern Deep and Nacredeep are 100% `half_merfolk` in the content, with marine biome and submarine site class. The fully aquatic `lineage.merfolk` exists in `player-origins.ts` but the settlement census uses no full `merfolk` key. Treat as a taxonomy/authored-canon decision before any global replace or demographic mass edit.
- **Orc/goblin frontier:** Redroot Warrens is 54% `half_orcs` and 30% `half_goblins`; Blackreef Anchorage is 46% `half_goblins` and 34% `half_orcs`; Stormfang Haven is mixed (46% humans, 24% half-orcs, 18% half-goblins). The full orc, goblin and troll lineages exist, but no full `orcs`, `goblins`, `trolls` census entries are present in these settlement records. Do not represent whole tribal civilizations exclusively as hybrid ancestry without explicit design intent.

### Systemic population-mix correction

Racial presence across 88 mapped sites: humans 86, elves 80, dwarves 83, gnomes 86, halflings 80, half-orcs 76, half-goblins 67. Most ordinary human settlements use a repetitive broad minority mix. This should be a **region + mobility + access + law + ecology** decision, NOT a fixed world-wide racial percent template.

Proposed authored distribution rules, awaiting separate content acceptance:
- Reclusive cities may have 98–100% permanent native populations, with tiny or zero resident outsiders, guarded visitor districts, controlled market days and border trading posts. Per-settlement exceptions can be explicit.
- Dwarven mountain and subterranean sites may tolerate specialized foreign craftsmen, commercial delegations or military attachés, but enduring foreign households need breathable/habitable surface access and real supply lines.
- Human metropolises can be moderately cosmopolitan and should have densely settled urban outskirts plus rural catchments and thinly populated corridors. Diversity follows trade, borders, governance and history, not geographic uniformity.
- Orc/goblin/troll societies should support separately described urban capitals, semi-sedentary villages, seasonal camps, migration corridors, clan territories and strategic raiding/trading posts. Lack of fixed city markers does not mean absence of population.
- Aquatic sites must support marine infrastructure and genuine water/air access. Do not map a full merfolk city into a purely human/hybrid town by convenience.
- Distinguish permanent inhabitants, transient visitors/traders, garrison populations, nomadic groups and uninstantiated rural population. Current `racialMix` provides one percentage per race, so richer treatment needs a versioned content/validation decision, not undocumented edits.

## Priority 2: clustered human settlement geography and defensible wilderness

Eight mapped centers have populations ≥50,000: Aurelis (142,000); Highcrown (310,000); Blueflow (128,000); Harvestrest (96,000); Seabanner (168,000); Riverthrone (205,000); Granary Crown (88,000); Sunspire Reach (74,000). **All eight have zero OTHER named settlement markers within 250 km** under the source scale; for example Highcrown's nearest marker is Kingsbridge ~604 km away, Riverthrone's nearest is Basinford ~526 km, and Seabanner's nearest is Islemarket ~526 km. A city of this size is expected to own near-field farmsteads, fisheries, mills, quarries, watch posts and satellite villages long before the next macro-map pixel marker. These local systems are **not necessarily missing from the fictional world**: they are missing from today's explicit settlement placement catalog. The fix should be **multi-resolution**: retain the canon macro anchor, then author hinterland/locality nodes at a defensible local scale.

The existing `settlementDistributionModel.targetCounts` contains proposed nonzero targets in **28** subregions totaling **878** category slots (city 40, town 148, village 472, outpost 125, strategic site 93). This is a planning surface, **not** an authorization to create 878 visible city icons or to treat every target as necessary. Revalidate high-island counts against land area, food/water and maritime access; reconcile classification of ports, forts, hamlets and dependent sites before reporting hard numeric gaps. Regional macro rows with zero targets do not negate their populated subregion targets.

The source `region_localities` resource catchments and suitability, `world_hexes` hazards/biomes, and `settlement_sites.json` and `settlement_districts.json` are reusable foundations. The older planning docs `regional-population-center-expansion-audit.md`, `settlement-placement-heuristics-plan.md`, `settlement-target-gap-report-plan.md` and `pilot-region-selection-criteria-plan.md` are still useful as heuristics but describe a planned parent/dependency field not actually present on current settlement records; do NOT assume that ownership or dependent-site schema exists in runtime.

### Continent and island-specific placement direction

| Area | Preserve | Investigate or add at next bounded content gate |
| --- | --- | --- |
| Kaelvar | Aurelis/Verdant Thalos agricultural-port hub, Stonevein mountains, Shattercap maritime watches | A small number of service belts around Aurelis; intentionally sparse plateau and nomadic orc territory; explicit forest elf enclaves or protected hidden territories if region lore requires |
| Valtherion | Highcrown/Blueflow inland river capital system, Harvestrest farms, Silvergrove elven vale, Embersteppe caravan risk | Actual tributary hinterlands and strong human clustering; isolate elven core behind border gates rather than uniform elf minorities; retain unsettled steppe beyond wells and trade roads |
| Serathyl | Seabanner merchant coast, Verdeward forest city, Passglass dwarven hold | Coastline witness for ports, forestry/extraction satellites at suitable scale, controlled access to forest core; dangerous rugged spine should be mostly trails/outposts |
| Draemor | Riverthrone/Granary grain capitals, halfling pasture belt, Stormcap fort/port chain | Vast farming villages/hinterland demographics without dozens of new metropolitan icons; sparsely populated marsh/coastal buffers and strategic crossings |
| Talmyra | Sunspire river-valley core, Redroot underhold, Thorn resource ports, Watcher frontier | Regional profile calls for much broader nonhuman populations than the named sites represent; distinguish full orc/goblin/troll clans, seasonal camps, fortified communal settlements and hostile/neutral borders |
| Myridian | Starfall's 28k port, Pearlwake pearling, Harbormast 5.2k, Foammarket small ferry, Chainlight watch | Island-scale land/food/water verification; few dense centers, uninhabited smaller islets, vessel-only routes; nearby *local* harbor amenities must be separately authored from 800–1,200 km maritime neighbors |
| Lantern Isles | Small surface harbors, isolated reef city | Restrict underwater travel correctly; preserve quiet/uninhabited cays and explicit aquatic population authority |
| Serpent's Wake | Mixed Stormfang hub, sparse Blackreef and Stormhook outposts | Clan mobility, pirate/fisher trade routes and nonhuman-majority sites, not automatic large city saturation |
| Dawnreach Isles | Aurora harbor, watch outposts, Nacredeep underwater city | Harsh climate limits ordinary land villages; food/fuel support, water/ice routes and offshore marine access must be explicit |

**One concrete suitability conflict:** `settlement.watchers_gate` is authored `populationBand=modest`, while its locality `region_locality.watcher_coast_gate_citadels` caps `maxPopulationBand=small`. Review whether a strategic fortified exception is intended. 20 settlement types are not on their locality's favored list; this is an advisory preference, not necessarily a data defect.

## Full canonical placement roster

**Key:** geometry column identifies a source-aligned macro land/marine point, NOT audited meter-height, harbor frontage or a playable local tile. "Climate overlap" indicates a legitimate recorded zone that shares coverage with broad climate polygons; it is not an error by itself. "Hinterland missing" means today's macro marker catalog has no nearby named satellites.


### Kaelvar

| Settlement | Map pixel | Class | Population | Leading ancestry | Geometry / review flag |
| --- | --- | --- | ---: | --- | --- |
| Aurelis | 300, 395 | city | 142,000 | humans 77% | land anchor; hinterland missing |
| Vinecross | 315, 348 | market_town | 9,200 | humans 78% | land anchor; climate overlap |
| Oliveford | 270, 335 | village | 2,300 | humans 82% | land anchor; climate overlap |
| Sunmeadow | 355, 362 | town | 6,400 | humans 79% | land anchor |
| Redcliff Quay | 255, 430 | harbor_town | 5,100 | humans 77% | land anchor |
| Stonevein | 195, 225 | subterranean | 34,200 | dwarves 94% | subterranean overlay |
| Coppergate | 250, 285 | town | 8,700 | humans 68% | land anchor; climate overlap |
| Sunscar Watch | 120, 240 | fort | 900 | humans 83% | land anchor |
| Brineharbor | 360, 180 | harbor_town | 8,300 | humans 76% | land anchor |
| Northhook Keep | 475, 145 | fort | 650 | humans 82% | land anchor |
| Gullsreach | 415, 220 | village | 900 | humans 84% | land anchor; type advisory |
| Quarrymule Camp | 210, 260 | camp | 420 | dwarves 93% | land anchor; climate overlap |
| Kelpnet Hamlet | 330, 235 | hamlet | 640 | humans 78% | land anchor; climate overlap; type advisory |
| Caskbank Estate | 335, 325 | estate | 1,040 | humans 82% | land anchor; climate overlap |

### Valtherion

| Settlement | Map pixel | Class | Population | Leading ancestry | Geometry / review flag |
| --- | --- | --- | ---: | --- | --- |
| Highcrown | 1560, 255 | city | 310,000 | humans 79% | land anchor; climate overlap; hinterland missing |
| Blueflow | 1490, 360 | city | 128,000 | humans 78% | land anchor; climate overlap; hinterland missing |
| Ledgerford | 1655, 345 | town | 24,000 | humans 76% | land anchor |
| Kingsbridge | 1545, 315 | town | 10,400 | humans 74% | land anchor; climate overlap |
| Harvestrest | 1310, 405 | city | 96,000 | humans 76% | land anchor; hinterland missing |
| Greenharrow | 1255, 455 | village | 2,400 | humans 74% | land anchor |
| Golden Barrow | 1390, 435 | town | 16,600 | humans 72% | land anchor |
| Orchardhome | 1480, 420 | market_town | 9,600 | humans 71% | land anchor; climate overlap |
| Silvergrove | 1370, 155 | city | 24,800 | elves 94% | land anchor |
| Headwater Bastion | 1515, 110 | fort | 1,600 | humans 78% | land anchor |
| Whitebark Gate | 1320, 210 | town | 5,600 | humans 72% | land anchor; climate overlap |
| Ashsaddle | 1325, 270 | market_town | 14,500 | humans 74% | land anchor; climate overlap |
| Coalspur | 1450, 255 | town | 8,400 | humans 61% | land anchor; climate overlap |
| Stepwell Redoubt | 1260, 235 | fort | 1,300 | humans 84% | land anchor; climate overlap |
| Moonwell Grove | 1250, 170 | hamlet | 760 | elves 95% | land anchor; type advisory |
| Redreed Ford | 1510, 320 | ferry_post | 460 | humans 79% | land anchor; climate overlap |
| Barleyhearth Estate | 1345, 470 | estate | 1,180 | humans 74% | land anchor; type advisory |
| Bridgewatch Ferry | 1690, 392 | ferry_post | 480 | humans 80% | land anchor; type advisory |

### Serathyl

| Settlement | Map pixel | Class | Population | Leading ancestry | Geometry / review flag |
| --- | --- | --- | ---: | --- | --- |
| Passglass Hold | 330, 585 | subterranean | 31,800 | dwarves 92% | subterranean overlay |
| Northpass Redoubt | 305, 515 | fort | 1,100 | humans 76% | land anchor |
| Slatewake | 380, 620 | town | 6,400 | humans 63% | land anchor; type advisory |
| Verdeward | 385, 690 | city | 22,700 | elves 93% | land anchor; climate overlap |
| Timbercross | 340, 730 | town | 15,500 | humans 77% | land anchor; climate overlap |
| Dyehollow | 300, 760 | village | 1,900 | humans 73% | land anchor; climate overlap |
| Seabanner | 345, 825 | port_city | 168,000 | humans 78% | land anchor; climate overlap; hinterland missing |
| Tidecrown | 280, 860 | harbor_town | 21,000 | humans 75% | land anchor |
| Islemarket | 395, 845 | market_town | 9,800 | humans 72% | land anchor; type advisory |
| Mastfield | 460, 810 | town | 7,600 | humans 75% | land anchor; climate overlap |
| Barkmill Hamlet | 415, 770 | hamlet | 680 | humans 79% | land anchor; climate overlap; type advisory |
| Dockreed Estate | 425, 875 | estate | 1,420 | humans 78% | land anchor |
| Deepecho Camp | 345, 665 | camp | 260 | dwarves 93% | land anchor; climate overlap; type advisory |

### Draemor

| Settlement | Map pixel | Class | Population | Leading ancestry | Geometry / review flag |
| --- | --- | --- | ---: | --- | --- |
| Riverthrone | 950, 825 | city | 205,000 | humans 80% | land anchor; hinterland missing |
| Granary Crown | 915, 780 | city | 88,000 | humans 74% | land anchor; hinterland missing |
| Millrun | 885, 855 | market_town | 14,000 | humans 73% | land anchor |
| Basinford | 1000, 845 | town | 14,800 | humans 72% | land anchor |
| Pasturemeet | 880, 915 | town | 22,000 | humans 64% | land anchor |
| Longmeadow | 820, 870 | market_town | 7,800 | humans 66% | land anchor |
| Applemarsh | 1010, 890 | village | 1,800 | halflings 56% | land anchor |
| Breaksail | 860, 1015 | harbor_town | 16,500 | humans 78% | land anchor; climate overlap |
| Stormwatch Citadel | 1015, 1040 | citadel | 1,800 | humans 72% | land anchor |
| Southlight | 935, 1075 | village | 1,400 | humans 77% | land anchor; type advisory |
| Haywarden Estate | 930, 965 | estate | 950 | humans 82% | land anchor; type advisory |
| Southlock Ferry | 1040, 900 | ferry_post | 490 | humans 80% | land anchor; type advisory |
| Cliffsalt Priory | 800, 1060 | monastery | 560 | humans 78% | land anchor; type advisory |

### Talmyra

| Settlement | Map pixel | Class | Population | Leading ancestry | Geometry / review flag |
| --- | --- | --- | ---: | --- | --- |
| Sunspire Reach | 1295, 820 | city | 74,000 | humans 72% | land anchor; hinterland missing |
| Silvermere | 1235, 875 | market_town | 16,800 | humans 66% | land anchor; climate overlap; type advisory |
| Confederate Ford | 1360, 850 | town | 9,800 | humans 62% | land anchor; climate overlap |
| Redroot Warrens | 1390, 790 | subterranean | 12,600 | half_orcs 54% | subterranean overlay; climate overlap |
| Saltfang Anchorage | 1360, 1015 | harbor_town | 6,900 | humans 70% | land anchor; climate overlap |
| Thornwatch | 1345, 1090 | fort | 2,200 | humans 74% | land anchor |
| Spicehook | 1290, 965 | market_town | 7,100 | humans 74% | land anchor; climate overlap |
| Watcher's Gate | 1500, 820 | citadel | 3,400 | humans 71% | land anchor; band conflict |
| Obsidian Stair | 1460, 920 | town | 6,800 | dwarves 48% | land anchor; climate overlap |
| Mistfen Landing | 1425, 1010 | harbor_town | 5,800 | humans 74% | land anchor; climate overlap |
| Sunpasture Estate | 1265, 915 | estate | 1,120 | humans 79% | land anchor; climate overlap; type advisory |
| Pepperfield Estate | 1410, 955 | estate | 880 | humans 79% | land anchor; climate overlap; type advisory |
| Blackglass Camp | 1490, 990 | camp | 230 | humans 68% | land anchor; climate overlap |

### Myridian Chain

| Settlement | Map pixel | Class | Population | Leading ancestry | Geometry / review flag |
| --- | --- | --- | ---: | --- | --- |
| Starfall Port | 825, 245 | port_city | 28,000 | humans 75% | land anchor |
| Pearlwake | 735, 315 | harbor_town | 9,600 | humans 75% | land anchor |
| Chainlight Bastion | 965, 170 | fort | 1,200 | humans 81% | land anchor |
| Harbormast Quay | 905, 270 | harbor_town | 5,200 | humans 73% | land anchor |
| Foammarket Ferry | 760, 355 | ferry_post | 430 | humans 78% | land anchor; type advisory |

### Lantern Isles

| Settlement | Map pixel | Class | Population | Leading ancestry | Geometry / review flag |
| --- | --- | --- | ---: | --- | --- |
| Lantern Key | 915, 610 | harbor_town | 6,200 | humans 72% | land anchor |
| Driftglass Outpost | 1010, 505 | outpost | 350 | humans 82% | land anchor; type advisory |
| Lantern Deep | 930, 655 | underwater | 6,400 | half_merfolk 100% | marine anchor |
| Glasswake Shrine | 870, 565 | village | 540 | humans 78% | land anchor; type advisory |

### Serpent's Wake

| Settlement | Map pixel | Class | Population | Leading ancestry | Geometry / review flag |
| --- | --- | --- | ---: | --- | --- |
| Stormfang Haven | 1325, 905 | harbor_town | 5,400 | humans 46% | land anchor; climate overlap |
| Blackreef Anchorage | 1405, 880 | outpost | 500 | half_goblins 46% | land anchor; climate overlap |
| Squallhook Refuge | 1465, 960 | outpost | 380 | humans 73% | land anchor; climate overlap |
| Stormhook Watch | 1280, 1005 | outpost | 260 | humans 79% | land anchor; climate overlap |

### Dawnreach Isles

| Settlement | Map pixel | Class | Population | Leading ancestry | Geometry / review flag |
| --- | --- | --- | ---: | --- | --- |
| Aurora Anchorage | 1855, 930 | harbor_town | 4,600 | humans 79% | land anchor |
| Whalebone Watch | 1825, 810 | outpost | 430 | humans 84% | land anchor |
| Nacredeep | 1890, 990 | underwater | 5,800 | half_merfolk 100% | marine anchor |
| Icehook Jetty | 1800, 1035 | ferry_post | 390 | humans 78% | land anchor; type advisory |


## Disposition, implementation gates and non-goals

- **GEO-0 source:** full 88-site macro map cross-reference and declared biome/climate identity source checked; no placement source hard failures. Runnable script created but **Node was not executed by this GitHub-only connector pass**.
- **GEO-1 coast:** original PNG pixel/landmask/sea-level witness, especially Starfall, Seabanner, Tidecrown, Aurelis, Dawnreach; keep `STARFALL_RASTER_OR_COASTLINE_HOLD` until verified.
- **TRAVEL-1:** review macro ferry/underwater transfer semantics and Myridian road crossing before allowing World travel from authored edge hints.
- **CULTURE-1:** approve permanent-resident versus visitor census, full-lineage taxonomy and nomadic group representation before racial composition changes.
- **HINTERLAND-1:** specify a small demonstrator region (prefer Starfall exterior and one human metropolis), authored local-scale food/service/resource/watch hierarchy, low-resource unoccupied buffers, parent/dependency contract and population conservation. Do not drop every hamlet into the 2048px global atlas.
- **AUDIT-REPEAT:** `node scripts/audit-settlement-map-consistency.mjs --json` on clean exact main, verify no hard errors and review every advisory. Follow with existing content-lint/typecheck/test suites under a task-owned checkout.

This audit changes only docs and a read-only script. It does not relocate any of the 88 canonical anchors, overwrite biome/elevation images, retcon demographics/population, add procedural geography, alter the Civilization economy engine, publish an executable ferry, change World/Save schemas, touch player accounts, or clear active selected/hosted holds.
