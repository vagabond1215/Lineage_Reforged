# First World: geographic evidence, interconnectivity and interactive-map reconciliation

Date: 2026-11-12
Baseline: exact public `master` `343d14ce79b17b5ad9badc06c65f986ebfd7ecf2`; canonical settlement blob `7e00f4243e96909e161ec09a2e8a4c3395f89216`; visual feature aggregate blob `9cd6752e9dbca00796e5f7c013066bb0e5a96175`.
Scope: **READ-ONLY SOURCE GEOGRAPHY / VECTOR-OVERLAY COMPARISON.** No player-facing map renderer or original PNG was launched or pixel-decoded. No settlement, travel, biome, climate, terrain, economy, Save or runtime implementation mutation.
Status: **MAP_SOURCE_CONFLICTS_IDENTIFIED; HTML_RENDER_AND_RASTER_WITNESS_HELD.**
Related policy: [SDT v1 draft](first-world-settlement-distribution-and-territorial-ecology-policy-v1-draft-2026-11-12.md), [two-pilot process map](first-world-settlement-distribution-pilots-and-implementation-process-map-2026-11-12.md), and [88-settlement audit](first-world-settlement-geography-and-cultural-distribution-audit-2026-11-12.md).

## 1. What was and was not inspected

- Inspected the complete current `world_maps.json` map metadata; the exact 9.3 MB `world_map_features.json` visual source; exact 1.26 MB `settlements.json`; `regions.json`, `region_localities.json`, `world_hexes.json`, `world_hex_edges.json`, `travel_networks.json`; planned semantic `map_features.json`; relevant static sites/districts, sacred/hotspot/polity, ecology and transport sources; `WorldPanel.tsx`, `uiViewModel.ts`, `newGameSnapshot.ts`, `player-travel-rules.ts`, and the `KnownLocationState` type. Inspection used the connected GitHub textual source and in-memory JavaScript geometry calculations on exact blobs.
- Recursive tree inventory of current `master` returned **2,184 files, untruncated**. There was **no standalone geographic interactive HTML map**: `apps/rpg-ui/index.html` and numerous QA fixtures exist, but not a separate map-viewer HTML asset in the repository. The actual in-game `WorldPanel` calls its drawing an `Interactive map placeholder`. A different private/external HTML viewer, if one exists, must be supplied as an exact URL/file to compare its layer toggles, rendering, clipping, labels and routes.
- The original `First World Biome.png` and `First World Elevation.png` are recorded under `packages/content/base/world/map_assets/`, but binary PNG fetch and actual visual/browser inspection were unavailable in this connector inspection. No statement here certifies true raster shoreline, elevations, sea level, dock frontage or rendered pixel outcomes.
- The previous 88-site in-memory auditor witness was **88 records, zero hard failures, 61 advisories**, with a corrupted coordinate rejected. This pass adds relational/geometric comparison; it did **not** run the native Node CLI or original raster validation. Source-geometric candidates below are not upgraded to hard physical-world failures.

## 2. Canonical geographic identity / source ownership catalog

| Source | Current inventory | The geographic fact it may legitimately anchor |
| --- | --- | --- |
| `world_maps.json` | 1 First World map; 2048 × 1152 reference px, 20,000 × 11,250 km; 9.765625 km/px | Shared map identity, reference frame, broad trade/conflict summaries |
| `regions.json` | **41**: five continents, 4 island systems, 4 oceans, 28 subregions | Named geographic/administrative hierarchy, directional labels, climate, culture, history, economic/carrying-capacity assumptions |
| `region_localities.json` | **47** locality bands | Locality type, environment, resource catchment, settlement weight, supported site classes, route bias |
| `world_hexes.json` | **47** coarse semantic hex/locality nodes | Biome family, elevation band, water type, terrain barriers, hazard/resource tags, all **88** reverse settlement anchors |
| `world_hex_edges.json` | **49** edges: 16 ferry, 11 sea_lane, 9 road, 6 river, 4 trail, 3 pass | Coarse directed pair of locality/hex identities and allowed travel-mode hints; not a measured player footpath |
| `settlements.json` | **88** named markers, 1,763,400 total marker inhabitants | Named site, precise map reference pixel, macro/subregion/locality/hex, function, descriptive economy/census, optional parent/dependency |
| `world_map_features.json` | **201** region footprint polygons, **68** coastline parts, **230** biome parts, **19** climate zones, 23 named linear/point features | Approximate *visual/debug* geometry, not authoritative physical passability, underwater oxygen, or site-level local navigation |
| `travel_networks.json` | **12** route records, **8** interport ship lanes | Named long-distance corridor and mode/time assumptions, not complete waypointed nautical or pedestrian paths |
| Embedded `domesticTradeFlows` | **155** rows in 88 settlement records | Goods/provenance and trade counterpart hypotheses; not confirmed player-usable direct connections |
| `regional_ecology_profiles.json` | **9** broad ecology profiles | Biome/fauna/flora/resource expectations, not observed local spawns |
| `map_features.json` | **8** planned static semantic features | Named feature identity and authored place relationships; **no executable or geometric authority**. Five have visual references, three intentionally do not |
| `settlement_sites.json` / `settlement_districts.json` | **20** named static sites / **14** districts | Settlement-relative named parts; may be active *identity* without an individual world coordinate, worker, market or travel access |
| `polities.json`, `sacred_sites.json`, `religious_hotspots.json` | **2** planned polities, **1** active sacred site, **2** hotspots (one active/one planned) | Named polity/culture/faith and parent-place relationship, not map polygons or border/control/faith mechanics |

**Authoritative join chain:** `world_map.first_world` ↔ (macro continent / island system) ↔ subregion ↔ locality band ↔ coarse world hex ↔ named settlement ↔ optional dependent settlement / district / site. A territory, watershed, range, camp or named beach needs its own supported identity/anchor; do not invent coordinates merely because prose says “near Highcrown.”

## 3. Spatial reference, scale, and viewer projection

The world map's intended source frame is 2048 (x, west to east) × 1152 (y, north to south), about **9.765625 km per reference pixel**. This is a macro atlas, **not** a 24-km gameplay hex grid or a 28×18 Starfall local area. `world_maps.records[0].assetReferenceRectPx` additionally retains a `(60,60,3976,2235)` source-art rectangle; it must **not** be reapplied to already normalized 2048×1152 images without a proven source-to-output transform.

### Confirmed UI mismatch (code-path, not selected-browser proof)

`apps/rpg-ui/src/game-shell/newGameSnapshot.ts` writes `knownLocations[].x/y` from `settlement.visualMapRef.pixelX/pixelY`, and `packages/engines/game-engine/src/player-travel-rules.ts` does the same for the Starfall arrival. `uiViewModel.ts` passes these through unchanged. `WorldPanel.tsx` places the pin using CSS `left: ${location.x}%` / `top: ${location.y}%` inside a clipped panel. **825 map pixels therefore render as 825%, not as a position ~40% across the atlas**. The WorldPanel also uses a 16:10 aspect ratio, whereas the geographic source is 16:9, and displays a gradient/grid placeholder instead of the original raster. No live HTML/browser screenshot was taken.

Expected full-frame percentages for illustration only:

| Location | Canonical pixel | Full 2048×1152 normalized position |
| --- | --- | --- |
| Aurelis | (300,395) | (14.65%,34.29%) |
| Starfall Port | (825,245) | (40.28%,21.27%) |
| Seabanner | (345,825) | (16.85%,71.61%) |
| Highcrown | (1560,255) | (76.17%,22.14%) |

**Corrective contract:** keep canonical map pixels in source and historical Saves, normalize only at presentation against the accepted image/content rectangle, preserve aspect ratio and any letterboxing, use source fingerprint/dimensions for the active layer, and verify bounding/zoom/pins in a real selected browser. Do not “fix” this by changing authored settlement coordinates or silently editing durable Save format.

Another stale presentation discrepancy: `world_maps.scaleProfile.notes` lists descriptive foot/mount/sail baselines of **30/60/200 km/day**, while current `travel_networks.modeProfiles` gives **24/48/150 km/day** for foot/horseback/sea vessel. A viewer must label the former as historic/descriptive benchmarks and use the latter only where the accepted runtime travel owner permits it, not mix the two.

## 4. Region / continent coverage and label anchoring

There are **20 distinct owners of visible region-footprint polygon parts**: all **16 continental subregions** and the **four top-level island systems**. The other **21 named regions have no directly keyed footprint** in this visual aggregate: five parent continents, 12 island-system *subregions*, and four oceans. Thus:
- a continent may be displayed by **union of its child subregion parts**, never by claiming a direct `region.kaelvar` polygon that is not present;
- island administrative subregions (e.g. `region.starfall_isle` or `region.pearlwake_keys`) cannot yet be shaded or exactly label-anchored from their own independent footprints;
- ocean names, including Gilded Sea, Tempest Expanse and Shattered Gulf, have descriptive identities but no individual ocean polygons;
- an island system's many disjoint polygons do not imply that its administrative subregion is a single landmass.

**Approximate source polygon *bounding extents* (not solid continent fills):**

| Top-level area | Reference extent, x/y | Child subregions / direct visual footprint | Geographic context |
| --- | --- | --- | --- |
| Kaelvar | x 0–614, y 0–610 | 3 child regions; no direct continental footprint | Northwest: Verdant Thalos coasts, Auric mineral uplands, Shattercap islands |
| Valtherion | x 1038–2047, y 0–658 | 4 child regions; no direct continental footprint | Northeast: Crownlands, Embersteppe, Sapphire Rivers, Jade agricultural lowlands |
| Serathyl | x 0–662, y 404–1150 | 3 child regions; no direct continental footprint | Southwest: Windward mountain spine, Green Reach forest, Sailor's Verge ports |
| Draemor | x 632–1174, y 682–1108 | 3 child regions; no direct continental footprint | South-central: Heart Basin, Emerald Mantle, Stormcap Coast |
| Talmyra | x 1102–1506, y 654–1096 | 3 child regions; no direct continental footprint | Southeast: Silver Valleys, Thorn Peninsula, Watcher Coast |
| Myridian Chain | x 554–1166, y 0–448 | 40 direct island-system polygon parts | Northern archipelago: Starfall, Pearlwake, Chainlight, Harbormast, Foammarket |
| Lantern Isles | x 552–1092, y 348–768 | 13 direct island-system parts | Mid-ocean: Lantern surface harbor, shrine, reef/deep-water city |
| Serpent's Wake | x 1172–1470, y 878–1018 | 5 direct island-system parts | Southern piracy/storm arc and mixed frontier ports |
| Dawnreach Isles | x 1658–1874, y 488–1042 | 12 direct island-system parts | Far-eastern cold-water harbors, watches and underwater Nacredeep |

Extents are bbox unions of often-disjoint polygons and can include substantial water; do not calculate territory population density or draw a territorial border from a bbox alone. Verify each label inside an accepted footprint or use an explicitly authored anchor; a bbox center may lie in the sea.

### Canonical hierarchy notes with concrete geographic anchors

- **Kaelvar:** Thalos Run runs from the uplands to Aurelis Bay; Sunscar Gate connects Auric Marches and Verdant Thalos; Stonevein is the dwarven upland excavation; Shattergap Strait crosses the northern coastal approaches.
- **Valtherion:** Crownwall highlands and Whitebark Gap north; Highcrown Headwater/Sapphire basin around Highcrown, Blueflow and Kingsbridge; Eastledger branch serves Ledgerford and Bridgewatch Ferry. Silvergrove belongs to the protected Crownlands forest region, not an arbitrary open metropolitan ward.
- **Serathyl:** Windward Spine / Northwind Stair / Passglass Hold mountain spine; Greenreach Fallriver toward Seabanner; southern harbor cluster includes Tidecrown and Islemarket, but actual shoreline frontage remains unproven.
- **Draemor:** Heartwater connects the grain-capital context, Southlock Branch and Southlock crossing; Stormcap Rim protects the harsh coast around Breaksail and Stormwatch.
- **Talmyra:** Silverrun valley toward Saltfang, eastern Mistfen Channel, Obsidian Stair pass and Watcher's Gate strategic belt; mobile/traditional clan ranges require distinct authority, not blanket location by ancestry.
- **Myridian:** Starfall Port (825,245), Harbormast Quay (905,270), Foammarket Ferry (760,355), Pearlwake (735,315), Chainlight Bastion (965,170) all occupy **different** region-footprint parts (7,24,36,28,11 respectively). Three share the `region.starfall_isle` / `world_hex.myridian_ports` identity, but **none share the same land-footprint part**. This is categorical administrative membership, not physical walking adjacency.
- **Lantern/Dawnreach:** Lantern Deep and Nacredeep are underwater named settlements, even when their coordinates project into the same world-view frame as surface ports. Access requires water/breathing/terminal semantics.
- **Oceans:** Azure Vast, Gilded Sea, Tempest Expanse, Shattered Gulf are region identities used in route prose; not reliable drawable sea-region polygons in the present aggregate.

## 5. Named physical reference-point inventory

The existing visual aggregate contains **8 rivers** (`Thalos Run`, `Highcrown Headwater`, `Eastledger River`, `Greenreach Fallriver`, `Heartwater`, `Southlock Branch`, `Silverrun`, `Mistfen Channel`); **5 named mountain systems** (`Auric Highlands`, `Crownwall`, `Windward Spine`, `Stormcap Rim`, `Talmyran Volcanics`); **4 passes** (`Sunscar Gate` at 235,295; `Whitebark Gap` at 1460,130; `Northwind Stair` at 320,550; `Obsidian Stair` at 1460,920); and **6 crossings** (`Kingsbridge` 1545,315; `Bridgewatch Ferry` 1690,392; `Redreed Ford` 1510,320; `Southlock` 1040,900; `Foammarket Ferry` 760,355; `Shattergap Strait` 350,240).

Crossing marks for Kingsbridge, Bridgewatch Ferry, Redreed Ford, Southlock Ferry and Foammarket Ferry coincide with their settlement reference coordinates (subpixel pixel-center differences); this is strong **authored overlay consistency**, not proof of an operable bridge/ferry. Highcrown, Blueflow, Ledgerford, Aurelis, Seabanner, Riverthrone and Sunspire Reach also lie on or very close to their intended *drawn named river polylines* in point-to-segment checks. This establishes useful cartographic anchors for labeling, but does not prove navigable channels, rainfall, port frontage, local terrain or water depth.

The eight planned semantic `map_features` references are **Windward Spine, Thalos Run, Aurelis Bay, Ochre Cliffs, Heartwater, Southlock Branch, Stormcap Rim, Breaksail Cove**. Only five have a matching referenced drawn feature; Aurelis Bay, Ochre Cliffs and Breaksail Cove have **no accepted specific visual geometry**. Do not place a new polygon for them from their names; use settlement-relative labels or keep map geometry held.

## 6. Exact connectivity layers: do not collapse into one line type

| Layer | What it says | What it does *not* say |
| --- | --- | --- |
| Region parent/subregion | A place belongs administratively to a larger geographic identity | It is walkable across all its territory |
| Region/locality/hex | Shared biome/terrain/resource context | Individual named sites physically touch |
| Hex edge | A coarse corridor has a type, allowed modes, and notional span | An actual bridge, terminal, embarkation, watertight tunnel, sea route or vehicle access has been proven |
| 12 authored routes | Selected long-distance named corridors, distance and modes | Every segment has cartographic waypoints or is enabled to the player |
| 8 interport ship routes | Named shipping connection with sea-region tags | A line from city center to city center stays entirely over water |
| 155 domestic trade-flow rows | Economic relationships and goods | Direct passenger travel, route approval, or perishable-goods feasibility |
| City district/site identities | Where a named feature belongs semantically | Local path, NPC, vendor, warehouse stock or operating service exists |
| Runtime known locations | Selected character knows a destination | It has a valid full-world map percentage, local rendering coordinate or legal travel without the runtime command owner |

Existing 49 hex edges split into 16 `ferry`, 11 `sea_lane`, 9 `road`, 6 `river`, 4 `trail`, and 3 `pass`. The route IDs and edge IDs in the 20 named route records resolve to existing coarse edge/hex IDs, but **a cross-referenced edge ID does not validate geometry**. Distances and mode access belong to their owning travel systems, not necessarily the raster overlay.

### Source contradictions / map-display risk

**A. Island-crossing land roads.** Three Myridian hex-to-hex records are tagged `road`, `hexSpan:3`, with only foot/horse/pack/wagon modes:
- `myridian_ports_myridian_pearl_shoals`
- `myridian_ports_myridian_beacon_bastions`
- `myridian_pearl_shoals_myridian_beacon_bastions`

The named settlement anchors for these hexes belong to distinct island footprint parts. A fixed-distance road symbol is not a verified land bridge. Stop before enabling/drawing walkable connections; investigate islands, terminal pairs, vessel transitions and acceptable detours. In particular, `region.starfall_isle` is not a proof that Starfall Port, Harbormast and Foammarket share one walkable landmass.

**B. Ferry modes and submarine access.** All **16** `ferry` edge rows list only foot/horse/pack/wagon modes. Four edges touch Lantern Deep/Nacredeep undersea hexes:
`lantern_harbors_lantern_reef_depths`, `lantern_reef_depths_lantern_shrine_gardens`, `dawnreach_aurora_harbors_dawnreach_nacre_depths`, `dawnreach_nacre_depths_dawnreach_whalebone_watches`. This is an inconsistency requiring a mode/transition contract, not proof that live gameplay grants horses under water.

**C. Direct sea-to-inland destination.** `lane.starfall_port_blueflow` declares a sea_vessel route directly from Starfall Port to Blueflow, an inland Sapphire Rivers city. The straight line crosses Jade/Embersteppe/Sapphire polygon land interiors. Require a navigable estuary/river-vessel transfer, downstream port or waypointed marine passage before presenting it as a direct sea-capable arrival at Blueflow.

**D. Straight-line chord hazards, geometric *candidates*.** The original overlay holds polygon parts, and the route content provides endpoint settlements/distance but no independently verified maritime waypoint curve. For each route the read-only comparison sampled 39 evenly spaced interior points on the direct endpoint chord and tested point-in-polygon against all 201 region parts. Fractions are **approximate portions of the drawn straight chord over land polygons**, **not route feasibility, collision validation or actual PNG shoreline**:

| Named route | Direct chord samples over mapped land | Authored distance vs straight-line ratio | Presentation / source decision |
| --- | ---: | ---: | --- |
| Brineharbor → Aurelis, sea lane | ~90% | 1.00× | Do not draw a straight navigable sea line through coastal land |
| Redcliff Quay → Brineharbor, sea lane | ~90% | 1.00× | Coast-hugging route likely needs a much more specific curve |
| Breaksail → Lantern Key, sea lane | ~69% | 1.00× | Cross-continent/archipelago waterway geometry needs verification |
| Starfall Port → Blueflow, sea lane | ~56% | 1.03× | Coastal+inland transfer and possible waypoint/river interface missing |
| Lantern Key → Stormfang Haven, sea lane | ~28% | 1.00× | Check path around basin/peninsula instead of straight chord |
| Breaksail → Saltfang Anchorage, sea lane | ~28% | 1.00× | Add compatible sea waypoint/harbor truth |
| Starfall Port → Harbormast Quay, sea lane | ~26% | 1.00× | Canonical **819 km** sea distance, not local adjacency; verify island routing |
| Spicehook → Watcher's Gate, land trail | ~28% | 1.49× | Chord includes unmapped water gap; detour plausible but requires real passable route |
| Sunspire Reach → Silvermere, road | ~59% | 1.00× | Chord partly outside land polygons; review bridges/detours/geometry |
| Breaksail → Riverthrone, land trail | ~54% | 1.02× | Chord partly outside land polygons; check water barrier and road-path definition |

Other named sea lanes can cross narrow endpoint coasts even when largely open-water; first prioritize the high-fraction rows. A well-founded sailing route can follow a curved coast or safe sound while a straight chord hits land. Never turn sampled fractions into a ban on the underlying authored commerce. Route-distance assumptions close to the chord deserve recalculation only after true waypoint/access topology is accepted.

## 7. Coastline / raster mismatch requiring independent proof

**All 68 `coastlines` parts are tagged `region.azure_vast`**, not to specific Gilded Sea / Tempest Expanse / Shattered Gulf. Their shapes are coarse traced polygon boundaries, not a trusted nearest-shore distance index or proof of which ocean a particular harbor faces. A point-to-closest-segment diagnostic returned surprisingly large gaps from certain port/cold-harbor labels: Tidecrown ~2,573 km, Seabanner ~1,911 km, Icehook Jetty ~1,467 km, Aurora Anchorage ~1,231 km, Aurelis ~415 km, Harbormast Quay ~232 km, Starfall Port ~34 km. The figures are distances to the **current 68 drawn coastline outlines**, not necessarily to the real shoreline in the source PNG. These anomalies might mean incomplete/incorrect contours, wrong projected frame, or mislabeled harbor positions; the connector cannot distinguish without original raster+legend at exact coordinates. **Do not relocate any city automatically.**

Priority raster witnesses: Seabanner/Tidecrown; Aurora/Icehook; Aurelis/Redcliff/Brineharbor; Starfall/Harbormast/Foammarket/Pearlwake/Chainlight; and cross-continent maritime corridors. Record decoded PNG pixel samples, land/sea threshold, source rectangle transform, nearest water access, waterfront orientation and uncertainty. The legacy `assetReferenceRectPx` must be reconciled before interpreting raster-vs-vector offsets.

## 8. Population, culture, economy and ecological location context

The 88 named settlement populations sum to **1,763,400**, while nine top-level region estimates sum to **365 million**. These are **different coverage levels**; no map can place the remaining population until census/region-catchment ownership is defined. The currently authored 878 aspirational distribution targets are **not** 878 missing icons.

Present evidence indicates:
- Starfall Port (28,000) is a fish/rigging/customs harbor tied to strong fishery and restricted island arable/timber, requiring provenance for water and staple imports. `region.starfall_isle` estimates 4M but has no independent footprint and currently maps Starfall, Harbormast (5,200), Foammarket (430) to distinct islands.
- Highcrown (310,000) is a Sapphire royal-floodplain river capital and supports a logically dense *local* farm/mill/service catchment, while Kingsbridge is ~604 km distant at world scale and is not an immediate suburb. Its associated sites/districts are static place identities.
- Serathyl/Kaelvar coastal capitals need shoreline/port witnesses; dwarven and elven core geography follows mountains, valleys, protected forests, and controlled trade gates rather than uniform settlement mix.
- Talmyra and certain island systems require mobile clan ranges, marine cities, treaty access and cultural-territory overlays outside a single city-race percentage.
- Regional ecology, flora/fauna, spawn and resource affinities describe likely ecosystems and production feasibility; they do not establish exact tile-level monster zones, individual plants, staffed crafters or persistent resource nodes.

Keep the versioned resident/visitor/seasonal/garrison/rural distinctions and non-double-counting design gates from SDT v1. **18** current settlement records already carry optional `parentSettlementId`/`dependencyRole` references, but no source-backed runtime population roll-up or adjacency can be inferred.

## 9. Ranked reconciliation / implementation gates

| Gate | Finding and actionable artifact | Success condition | Hold/failure condition |
| --- | --- | --- | --- |
| **MAP-0 HTML source identity** | Obtain actual standalone HTML interactive map (if external), runtime URL/version, enabled layers, asset hashes, screenshot coordinates | Viewer and canonical source mapped to one revision | Viewer absent or stale: no claim of visual screenshot acceptance |
| **MAP-1 projection** | Correct `KnownLocationState` display projection, 16:9 framing/letterbox, 2048×1152 vs historic 3976×2235 source rectangle | Starfall/Highcrown/Aurelis/Seabanner correct and clickable within bounds at min/max zoom; no Save/coordinate rewrite | Off-map pins, mismatched frame, doubled crop, selected-browser failure |
| **MAP-2 polygons/labels** | Produce continent unions, explicit valid label anchors and island *subregion* extent design; mark four oceans as unpolygonized | Every shown region label traces to a suitable visual geometry or accepted anchor | Bbox-center in sea, one island-system treated as continuous land, fictional ocean boundary |
| **MAP-3 coastline/raster** | Inspect original biome/elevation binary, shorelines, sea-level/legend and coastal-port samples | Coastline geometry and port/water access independently witnessed or clearly marked unknown | Raster/legend mismatch; keep original coordinates and feature gate held |
| **MAP-4 named reference features** | Verify 8 river / 5 mountain / 4 pass / 6 crossing overlays and missing named bay/cliff/cove geometry | Named features have coherent exact references, safe display hierarchy and status | Made-up geometry or map mark treated as a live facility |
| **MAP-5 travel topology** | Separate named route identity, actual path waypoints, ferry/sea transfer, foot bridges and underwater access | 20 named route classes plus 49 coarse edges reconciled, no sea route crossing mapped land in accepted draw mode, travel mode legality explicit | Island road/undersea ferry ambiguity, inland marine endpoint unresolved |
| **MAP-6 cultural/ecology/population layers** | SDT resident/catchment/nomad/territory and habitat/supply source crosswalk | Provenance and scale on each displayed zone, no phantom 878 markers | Duplicate census, unsupported resources/spawns, automatic territory laws |
| **MAP-7 integration/acceptance** | Task-owned native Node tests/raster witness and browser selected map smoke; preserve active L2 World contract | Exact head/source hashes, deterministic readback, real renderer selected proof and clean rollback | Running tests absent, edits outside owner scope, migration/Save or feature leakage |

The immediate **connector-safe** product is this source-based discrepancy register and the linked policy/pilot draft. The next **local executable** action should prove original raster + actual viewer and map pixel transform, then repair only the task-owned presentation projection on an accepted Codex runtime branch. Route/landscape corrections require their own owner decisions; do not silently activate passage, move settlements or retcon cultural geography.

## 10. Repeatable validation checklist

1. Pin commit, original raster SHA/dimensions, `world_maps.scaleProfile`, visual aggregate blob SHA, settlement blob SHA and viewer build identity.
2. Run `node scripts/audit-settlement-map-consistency.mjs --json`; separately run `node scripts/audit-starfall-raster.mjs` and focused Starfall tests, capture full output and raw PNG checks.
3. Assert all 88 settlement `visualMapRef` pixels are in bounds and source-aligned; retain 37 climate and 3 subterranean overlaps as legitimate advisories; review 20 type preferences and Watcher's Gate band exception.
4. Test five Myridian point-in-island identities and adversarial inter-island travel attempt; confirm no disconnected island road becomes walkable.
5. Recompute named route chord-vs-land sample checks with the exact polygon orientation/holes and independent true PNG landmask; distinguish *straight display path* from actual route.
6. Verify named crossings/river proximity; do not conclude water flow/sea level/port viability from labels alone.
7. Test map frame at ordinary zoom and narrow viewport: normalized pins, clipping, keyboard focus, selection and label collision without changing Save `x/y`.
8. Record every discrepancy as `SOURCE_PASS`, `VISUAL_CONFLICT_CANDIDATE`, `GEO_RASTER_HOLD`, `ROUTE_OWNER_HOLD`, `UI_PROJECTION_DEFECT`, `EXPECTED_SCALE_LIMIT` or `ACCEPTED_EXCEPTION`, with exact source references.
9. Keep current Starfall L2 World/account/Save implementation and protected non-default branches unaffected.

This document is **evidence and a proposed repair route**, not permission to alter existing world locations or enable routes.