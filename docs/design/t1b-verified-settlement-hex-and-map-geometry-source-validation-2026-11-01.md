# T1-B: Verified Settlement, Hex, and World Map Geometry Source Validation

Date: 2026-11-01 (America/New_York)
Track: **T1 / P0**, following the completed T1-A smaller typed-place registry census.
Status: **EIGHT-FILE DATA AUDIT COMPLETE; SELECTED RENDERER SOURCE MISMATCH CONFIRMED (SECTION 6); PNG-PIXEL ALIGNMENT AND GIS REPAIR HELD; NO GAMEPLAY OR SOURCE EDITS**.
Home: held [PR #45](https://github.com/vagabond1215/Lineage_Reforged/pull/45), [live one-register parallel checkpoint](https://github.com/vagabond1215/Lineage_Reforged/blob/connector/barebones-playable-ui-planning-2026-10-26/docs/dev/connector-safe-parallel-progression-register-2026-10-31.md).
Selected repository baseline: `master` `a596112acf3945f2bf7c625e943f2511d12aa710`; live native-v3 Codex PR #57 still draft/unselected. No tests run in the repository; all observations are **read-only Python JSON/graph/geometry checks on the uploaded original data**.

## 1. Input provenance and method, including the previously blocked files

The user provided the eight exact **world** JSON files as conversation attachments, making the two oversized files independently readable with Python. All eight parse successfully. The largest files were originally exported using mixed CRLF line endings. For source identity, **replacing only CRLF with LF** in the supplied byte arrays (and **preserving the original UTF-8 BOM** where present) yields **Git blob SHA-1 matching the live GitHub connector blob SHA for every file**. This is strong exact-content verification against the selected repository, not a merely similar-name snapshot. **No input contents were rewritten or committed.**

| Canonical owner file under `packages/content/base/world/` | Records | Inspected Git blob SHA-1 after newline normalization | Audit scope |
| --- | ---: | --- | --- |
| `settlements.json` | **88** | `7e00f4243e96909e161ec09a2e8a4c3395f89216` | Every canonical settlement profile, parent, visual point, hex, trade partner |
| `world_map_features.json` | **1** aggregate | `9cd6752e9dbca00796e5f7c013066bb0e5a96175` | All internal geometry groups and point coordinates |
| `world_maps.json` | **1** map | `139ed99bd858535bb6a072eee58b697bfcdaa9bd` | Reference dimensions, raster-asset paths, scale, source-rect |
| `world_hexes.json` | **47** | `75dd6f54855fadcff46758cd8847a458c672e0f5` | Anchors, reverse membership, locality/region agreement |
| `world_hex_edges.json` | **49** | `d844906fcd7265281af2317a8c7f60025177a8be` | Endpoint existence, duplicate pairs, connected components, modes |
| `settlement_districts.json` | **14** | `26cc988639eed57185325b5184e7cb8f3fd325bc` | Settlement parent integrity; descriptive-only districts |
| `settlement_sites.json` | **20** | `3cfd0fd8dafc99c61f3be076cfd955b5d69def78` | Settlement/district parents; no invented services |
| `map_features.json` | **8** | `1442e834a5dc38f0fd32db5cea66e4de170881e8` | Named **planned** semantic map features and existing visual pointers |

**Independently revalidated upstream:** canonical `regions.json` has **41** records at blob `04516952ad97d830d2f49d915137197947e22b3a`; T1-A already confirmed **47** region-locality records. No separate universal location owner or outside map canon was added.

**Method:** parse every provided JSON record; enforce unique IDs, nonblank settlement primary fields, finite/in-frame points, settlement→hex and hex→settlement membership, settlement→parent, district/site hierarchy, trade partner existence, climate/biome feature-key resolution, authored zone point containment and semantic-feature visual resolution. Inspect all geometry vertices with finite/bounds checks. Interpret region footprints/climate/biome shapes as candidate **polygons** and coastlines as **lines**, with GEOS/Shapely validity checks; this is stronger than merely counting vertices and is **not** proof that a production renderer uses polygon operations.

## 2. Measured positive result (source-only, not gameplay assertions)

| Check | Measured finding | Truth boundary |
| --- | --- | --- |
| 88 settlement `id/name/summary/siteContext` and visual refs | **88/88 populated**; 88/88 have a `visualMapRef` to `world_map.first_world` | These are authored descriptions and map *anchor pixels*, not independently operating towns or player-visible discoveries |
| Settlement world-map position | **88/88 finite and within 0≤x<2048, 0≤y<1152** | Five are **not surface sites**: 3 subterranean and 2 underwater, with notes explicitly saying surface-coordinate anchor. Do **not** treat as a visible entrance, travel target or observed POI |
| Settlement-to-hex and reverse membership | **88/88 links valid in both directions**; each source hex anchor has matching region and locality band | Hex ID is a semantic travel/locality anchor, not automatically a polygon or a player's route |
| Settlement parent/dependency | **18** settlements carry an existing `parentSettlementId`; **0 missing parents** and **0 cross-region parents** | No new dependencies or relocation authorized |
| Settlement domestic trade flows | **155** partner links in the 88 records, **0 missing partner settlement IDs** | Static authored flow descriptions are not executable routes, dynamic prices or current market stock |
| Districts and sites | **14/14 district parents** resolve; **20/20 site settlement parents** resolve; every non-null site district belongs to its site settlement | 9 distinct settlements have a district, 10 have a site. Sites/districts are descriptive; no separately registered exact pin geometry |
| Settlement `racialMix` | **88/88** percentages total 100 | Descriptive population profile, not live individual NPC/race presence |
| Climate and biome visual refs | **88/88** `climateZoneId` match exact 19 climate feature IDs; 88/88 biome references match documented base IDs of `.part_N` biome polygon parts | **88/88** points geometrically fall within their declared climate and at least one biome polygon under this check; does not prove local weather |
| Semantic map feature references | All **5** existing named `visualReferences` resolve to exactly one feature in the aggregate. The **other 3 of 8** planned semantic records intentionally have **no visual reference** | No invented map geometry for Aurelis Bay, the Ochre Cliffs or Breaksail Cove |
| All stored visual vertices | **30,295** points across 541 internal geometries. **0** nonfinite and **0** outside the 2048×1152 coordinate grid | Pixel fit is not the same as full validity, source-raster overlay or player disclosure |
| Map metadata | Both map owners say **2048×1152**, same `world_map.first_world`; source raster asset-reference rectangle `(60,60,3976,2235)` is separately declared | That rectangle applies to the **source image registration**, not a substitute for the 2048×1152 derived geometry coordinates |

**Internal geometry counts:** 201 region-footprint pieces (12,302 vertices), 68 coastline lines (5,807), 8 rivers (35), 5 mountain paths (17), 4 pass points, 6 crossing points, 19 climate polygons (76), 230 biome polygon pieces (12,048). Do not count 201 footprint parts or 230 biome pieces as independent canonical regions/biomes.

## 3. Source-backed gaps and future validation gates

### GAP-1: 42 candidate polygon-topology errors, not 42 missing settlements

A standard polygon-validity check finds **21/201** polygon-typed `regionFootprints` and **21/230** polygon-typed `biomeZones` **invalid**, primarily **ring self-intersections** (20 in each family, plus one crossing self-intersection in each). The **19 climate polygons are valid**. All recorded vertices still fall inside the source grid.

**Examples with exact existing IDs:** `feature.region_crownlands.part_2`, `feature.region_heart_basin.part_1`, `feature.region_verdant_thalos.part_1`, `feature.region_myridian_chain.part_17`, `map_biome.first_world.verdant_thalos_woodland.part_1`, `map_biome.first_world.jade_expanse_prairie.part_2`, `map_biome.first_world.shattercap_isles_conifer.part_9`.

For developer/source-owner triage, the full failing **region footprint part IDs** are:
`feature.region_crownlands.part_2`, `feature.region_emerald_mantle.part_3`, `feature.region_green_reach.part_4`, `feature.region_heart_basin.part_1`, `feature.region_jade_expanse.part_2`, `feature.region_jade_expanse.part_3`, `feature.region_jade_expanse.part_6`, `feature.region_lantern_isles.part_2`, `feature.region_lantern_isles.part_7`, `feature.region_myridian_chain.part_5`, `feature.region_myridian_chain.part_17`, `feature.region_sailors_verge.part_1`, `feature.region_sapphire_rivers.part_2`, `feature.region_shattercap_isles.part_4`, `feature.region_shattercap_isles.part_8`, `feature.region_shattercap_isles.part_17`, `feature.region_silver_valleys.part_4`, `feature.region_verdant_thalos.part_1`, `feature.region_verdant_thalos.part_5`, `feature.region_windward_spine.part_1`, `feature.region_windward_spine.part_6`.

The full failing **biome part IDs** are:
`map_biome.first_world.silver_valleys_seasonal_forest.part_4`, `map_biome.first_world.windward_spine_alpine.part_1`, `map_biome.first_world.windward_spine_alpine.part_7`, `map_biome.first_world.jade_expanse_prairie.part_2`, `map_biome.first_world.jade_expanse_prairie.part_4`, `map_biome.first_world.jade_expanse_prairie.part_7`, `map_biome.first_world.sailors_verge_chaparral.part_1`, `map_biome.first_world.shattercap_isles_conifer.part_5`, `map_biome.first_world.shattercap_isles_conifer.part_9`, `map_biome.first_world.shattercap_isles_conifer.part_19`, `map_biome.first_world.emerald_mantle_deciduous.part_4`, `map_biome.first_world.verdant_thalos_woodland.part_1`, `map_biome.first_world.verdant_thalos_woodland.part_5`, `map_biome.first_world.crownlands_taiga.part_2`, `map_biome.first_world.myridian_chain_chaparral.part_6`, `map_biome.first_world.myridian_chain_chaparral.part_19`, `map_biome.first_world.sapphire_rivers_mixed.part_2`, `map_biome.first_world.heart_basin_prairie.part_1`, `map_biome.first_world.lantern_isles_chaparral.part_2`, `map_biome.first_world.lantern_isles_chaparral.part_8`, `map_biome.first_world.green_reach_rainforest.part_5`.

**Action gate:** determine actual target rendering/point-in-polygon contract; if polygons must be valid, select a **separate reviewed derived-geometry repair** that preserves canonical IDs and visual provenance. Do not auto-`buffer(0)` whole regions, silently cut outlines, rewrite source asset traces, grant map discovery or alter world routes. Invalid polygon topology is a **future polygon consumer risk**, not proof the current map image is wrong.

The 68 coastlines are open **lines**, not filled polygons. Seven are non-simple as lines (self-touching or crossing); **do not erroneously label them as invalid polygon features**. Review only if a selected consumer requires simple coastline paths.

### GAP-2: 17 settlements have no separately authored polygon for their precise `regionId`

**71/88** settlement anchor pixels fall within an existing footprint for their exact `regionId`. **0** of those 71 sit outside its footprint. The other **17/88** belong to smaller island/coastal regions for which no separate `regionFootprints.regionIds` polygon is registered (the aggregate currently covers 20 region IDs, not every 41 canonical region IDs). They still have verified visual points, valid climate/biome zones and correct hex/locality anchors. This is **missing region-shape coverage, not wrong settlement placement**.

Affected settlement IDs:
`settlement.starfall_port`, `settlement.pearlwake`, `settlement.chainlight_bastion`, `settlement.harbormast_quay`, `settlement.lantern_key`, `settlement.driftglass_outpost`, `settlement.lantern_deep`, `settlement.stormfang_haven`, `settlement.blackreef_anchorage`, `settlement.squallhook_refuge`, `settlement.aurora_anchorage`, `settlement.whalebone_watch`, `settlement.nacredeep`, `settlement.icehook_jetty`, `settlement.glasswake_shrine`, `settlement.foammarket_ferry`, `settlement.stormhook_watch`.

**Action gate:** do not synthesize exact region boundaries from settlement pixels or parent region shape. Until actual author-reviewed polygon geometry exists, show these as valid **typed point/profile references only if character discovery permits**; disallow an exact unproven region-fill overlay. Where sea/underwater contexts apply, do not expose subterranean/underwater details simply because their surface anchor is registered.

### GAP-3: connected hex graph is not continuous in all regions, nor does a shared pair mean a duplicate route

The **47-hex, 49-edge** authored graph has **eight disconnected components** (sizes **32, 3, and six of 2**); no isolated single hex, no unresolved edge endpoint, and no duplicate edge **IDs**. This may be expected with separate island contexts; no land/sea connectivity can be invented from a map projection alone.

Three unordered hex pairs have **parallel authored edges**, with meaningful distinct IDs and sometimes travel modes: **Aurelis/Vinecross** coastal-bays↔inland-estates (`ferry` and `road`), **Lantern Key/Driftglass** lantern-harbors↔shrine-gardens (`ferry` and `sea_lane`), and **Brineharbor–Aurelis / Redcliff Quay–Brineharbor** shattercap-deep-harbors↔verdant-coastal-bays (two `sea_lane` records). Distinguish multiple routes between the same hexes from unique edge ID and exact supported journey. **Do not** automatically dedupe or promote a corridor to available service.

### GAP-4: raw source raster/image overlay not independently verified

The uploaded data **does not include the actual PNG images** referenced by `world_maps.json`:
- `packages/content/base/world/map_assets/First World Biome.png`
- `packages/content/base/world/map_assets/First World Elevation.png`

Thus this audit proves **map metadata and authored coordinate/zone consistency**, not an image-level overlay, coast-mask accuracy, semantic landmark placement against pixels, visual readability or transform correctness in the selected UI. The source rect `(60,60,3976,2235)`, input raster dimensions and displayed canvas coordinate math must still be checked with the actual image assets and selected render consumer. The existing `WorldPanel.tsx` percentage-coordinate mismatch noted in T1-A/Atlas preflight remains a **future selected-client owner issue**, not resolved by the data being in bounds.

## 4. Recommendations and future tests (not implemented/executed)

| ID | Required later assurance |
| --- | --- |
| **GEO-01** | Every uploaded source Git blob identity matches selected repository after harmless newline normalization; refuse silent drift. |
| **GEO-02** | All 88 settlement IDs, human names, summaries and sites resolve to one canonical owner, without duplicate `locations.json`. |
| **GEO-03** | Hex anchor, locality, region and reciprocal anchored settlement set stay consistent. |
| **GEO-04** | 18 settlement parent refs and 14 district/20 site refs resolve without inventing child geometry/behavior. |
| **GEO-05** | All 155 authored settlement trade partner IDs resolve; descriptive trade is not a live travel or stock execution. |
| **GEO-06** | 88 settlement visual refs are finite, in-frame, use canonical map ID and preserve **surface/subterranean/underwater** distinction. |
| **GEO-07** | Climate zone polygon covers each declared anchor without implying local measured weather. |
| **GEO-08** | Each base `map_biome.*` settlement zone ref resolves to its actual `.part_N` polygon family and covers the point, without treating each part as a distinct biome. |
| **GEO-09** | Polygon-operating consumer explicitly rejects/repairs 42 invalid region/biome polygon parts before geospatial overlay; source data untouched pending review. |
| **GEO-10** | For 17 exact-region shape gaps, no fabricated region fill or secret Atlas reveal; location remains a known-only point/profile projection. |
| **GEO-11** | Resolve semantic visual reference for 5 planned named features, leave 3 visual-less entries unpinned/ungenerated. |
| **GEO-12** | Coastlines are open line features; only validate line simplicity if the actual selected renderer requires it. |
| **GEO-13** | Preserve parallel hex edges with distinct IDs/modes; don't infer all-region graph connectivity, destination availability or route permission. |
| **GEO-14** | With actual reference PNGs, verify 2048×1152 grid transform against source asset-reference rectangle, sample visual landmark/shoreline alignment, image layer registration, legend and zoom. |
| **GEO-15** | Selected Codex→Atlas viewport only receives character-authorized discovered geometry. Never leak raw world geometry, even behind fog styling. |
| **GEO-16** | Pixel anchor transforms cannot convert subterranean/underwater surface markers to guaranteed walkable arrivals or world event canon. |

## 5. Disposition and next safe owners

- **T1-B SOURCE-DATA VERIFIED, BLOCKER REMOVED:** The prior "oversized files cannot be read" gate is now **resolved by user-supplied blob-verified files**, not by a successful GitHub connector read. No need for another local checkout solely to count/check the eight current world JSON files. This closes the outstanding **settlement/hex/geometry source-coverage audit**.
- **T1-B IMAGE VALIDATION HELD:** Actual source biome/elevation PNG overlays and selected UI raster-coordinate transform remain **unverified**. Require the two images (or an independently authenticated local image/renderer inspection) before claiming full visual alignment. No map geometry reauthoring is approved.
- **T1-C EDITORIAL PILOT NOT AUTOMATICALLY AUTHORIZED:** All 88 current settlement names, summaries and site contexts are populated, and their 155 trade partners resolve. **No evidence-based missing descriptive record justifies a spontaneous content enrichment**. An author may later select a particular existing settlement for approved quality editing; do not invent locations or NPC/service interactions.
- **T2 dependent implementation still held:** Player-specific revealed geography and safe filtered delivery must precede live Atlas; static source geometry is not player knowledge.
- **T4/T6/T9 not unlocked by mere place data:** Hex resource affinity tags, a site named “Medicinal Terraces,” guild presence and an edge named “ferry” are not live harvestable resource instances, staffed service providers, or real workshop action/stock/permissions. Native v3 item/Save and exact domain owner gates still apply.

**No source JSON, content/schema, UI, selected Save, runtime, clock, physical game item, Codex prompt or master branch changed.** The only repository updates authorized in this connector pass are this held documentation audit, cross-reference in the earlier T1-A report and one central manifest update on held PR #24. **Do not repeat T1-B** on these unchanged SHA-verified data blobs.

## 6. Selected renderer source-only delta and exact next visual gate (2026-11-01)

Status: **SOURCE-VERIFIED CONSUMER MISMATCH; PNG-PIXEL REGISTRATION UNVERIFIED; NO EXECUTABLE TEST OR LIVE UI ACCEPTANCE**. This is a narrowly bounded continuation of T1-B rather than another world-data census. Source is selected `master` `a596112acf3945f2bf7c625e943f2511d12aa710`; all eight original JSON blob findings and the 42/17 geometry findings above remain unchanged. Active native-v3 draft PR #57 (`636ffa5cef6f971ea8b6f02be5b4dd2a2305a848`) stays unselected.

### Exact source-to-consumer proof

| Source and blob | Source-observed behavior | Admission consequence |
| --- | --- | --- |
| `apps/rpg-ui/src/game-shell/newGameSnapshot.ts` | A new character's `sessionState.knownLocations` starts with `x: settlement.visualMapRef?.pixelX ?? 0` and matching `pixelY`; `known: true`. | These are authored **reference-grid pixels**, not CSS percentages. An absent visual coordinate defaults to `0`, which is not an affirmative surveyed marker. |
| `apps/rpg-ui/src/runtime/demoSnapshot.ts` | Demo `location.saltmere` has `x:58, y:44` and `location.westreach` has `x:31, y:39`. | Demo values are percentage-shaped fixtures, not proof of the real starting-character coordinate convention. A fixture-only visual pass can mask the real pixel/percent collision. |
| `apps/rpg-ui/src/runtime/uiViewModel.ts` blob `c152412ebc19511f2e394619c8ee3c979e64b119` | `mappedWorldLocations` copies `location.x/y` unchanged to `world.locations`. `lists['world-map']` and map locations are built from **all** `sessionState.knownLocations`, including `known:false`; the latter is shown as a Status value rather than filtered. | Projection neither converts units nor provides a selected-viewer disclosure gate. This is a **source-visible conditional path**, not proof of a real selected-account leak. |
| `apps/rpg-ui/src/features/WorldPanel.tsx` blob `578dd1399969d3a16be3aaf11b81ac0f0d98c23f` | Marker style is `left: ${location.x}%`, `top: ${location.y}%`; every `worldData.locations` entry is rendered as a button. The placeholder container is `aspect-[16/10]`, with a decorative `soft-grid` and blobs, no source biome/elevation raster, and only an in-container scale of 0.8–1.6. | The current canvas cannot be used as evidence that canonical `2048×1152` map points, source artwork and labels align. The real pixel-coordinate UI path is arithmetically inconsistent with CSS percentage units. |
| `apps/rpg-ui/src/features/CodexPanel.tsx` blob `955a8ee42f4cb94dcb59d29bce29dedc1668c3ef` | Existing `Codex → Atlas` is a searchable `character.lists.geographicKnowledge` list and inspector, not the map canvas. | Do not port the old World map component wholesale. The **chosen destination** remains character-discovered Codex Atlas, with Current Area as default gameplay (held PR #24). |
| `packages/content/base/world/world_maps.json` blob `139ed99bd858535bb6a072eee58b697bfcdaa9bd` | `world_map.first_world` declares `2048×1152` reference map, two raster source paths, and distinct source-art `assetReferenceRectPx={x:60,y:60,width:3976,height:2235}`. | This is source registration metadata, **not** proof of original PNG dimensions, crop, object-fit, coastal pixel correctness, or final display transform. |

**Deterministic numeric illustration, not a real settlement:** a valid reference-grid centre `(1024,576)` should map to `(50%,50%)` of a correctly matched 2048×1152 image. The selected old World renderer instead emits `left:1024%; top:576%` if given those pixel fields, putting the marker far outside its clipping container. An ordinary `(58,44)` demo fixture happens to fit percent CSS, but is not a valid test for the live pixel path.

**Aspect/frame distinction:** the currently styled `16:10` panel differs from the source map's `16:9` ratio. **Only if** a future renderer uses a full-width `object-fit:contain` for the 16:9 image inside a 16:10 panel will its letterboxing be 5% of panel height at each vertical edge; under that *conditional* layout, overlay panel coordinates would be `xPanel%=100*x/2048`, `yPanel%=5+90*y/1152`. This is a *test oracle for that one chosen layout*, not a selected display transform. A crop, non-full-width fit, zoom matrix or actual source-art rectangle requires a different proven mapping. Image and overlays must share one transform.

### Retrieval and evidence boundary

The repository's selected tree contains `First World Biome.png` (Git blob `aad25d02340e3794df0495a1c79bc5a1929eae23`, 2,562,408 bytes) and `First World Elevation.png` (blob `40a42dcd10d72e31c93f48fe5dd0c1f593784ac1`, 2,840,400 bytes). The authenticated GitHub text/blob connector could list the binary files but did **not** provide image pixels: `fetch_blob` failed UTF-8 decoding and `fetch_file` with `encoding:base64` returned empty content. No raster image was inspected, no original PNG dimensions were asserted, no overlays were generated, and no authenticated local checkout, tests, browser check or build was performed in this continuation.

### Smallest next owner package (not an active Codex instruction)

1. **Exact-image evidence only:** locally read both PNGs and verify Git blob identity, decoded dimensions, asset-reference crop, and three or more existing source-backed shoreline/landmark/settlement anchor samples against both layers. Provide selected coordinate origin/y-direction and registration; if ambiguous, **keep list-only/unpinned reference mode**.
2. **Red-first projection cases, only when selected UI consumer is authorized:** (R-01) new-game real pixel point remains on-canvas at fit/zoom/resize without trusting percentage-shaped demo data; (R-02) `known:false` is absent from *every* marker, map list, search, detail, keyboard and accessible-name surface under a confirmed knowledge-authority policy; (R-03) mismatched map ID, absent/zero-fallback/unverified point and nonfinite/out-of-frame coordinates fail closed; (R-04) 16:9 art inside responsive 16:10/portrait frames keeps markers and raster in lockstep after pan/zoom; (R-05) biome/elevation switch keeps same proven registration and respects personal discovery and background disclosure.
3. **Selected destination:** implement a read-only, revision-bound and **viewer-filtered** Codex Atlas adapter; preserve existing list/inspector and Current Area travel command owner. Never ship a full hidden map and assume CSS fog suffices, use the 9.3 MB visual aggregate unfiltered, infer surface entry from underwater/subterranean points, or turn pixel projection into movement authorization.
4. **Geometry repair remains separate:** the 42 invalid polygon pieces and 17 precise-region footprint gaps require a named polygon consumer and approved derived-geometry/authoring action after image registration. No automatic self-intersection fix, world-route addition or original-data rewrite is authorized.

**T1-B source/renderer investigation is now connector-saturated on unchanged refs.** The visual/pixel gate cannot be honestly completed with text-only connector access. Continue only on actual binary PNG/selected renderer evidence or a material source revision. No Codex coordination documents, `master`, runtime, tests, schemas, assets, Save, world clocks, Game version or other PR branches were changed by this addendum.
