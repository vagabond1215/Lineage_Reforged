# First World: post-square-removal continent, subregion and coastline topology audit

Date: 2026-11-12  
Authority: owner manually verified all **42 exact 8×8 offshore footprint squares** and authorized their removal.  
Baseline world source blob: `9cd6752e9dbca00796e5f7c013066bb0e5a96175` (9.3 MB).  
Change scope: **42 accepted footprint removals, no location movement, no coastline rewriting, no macro reparenting and no executable travel change.**  
Status: **EFFECTIVE_MAP_CLEANUP_AND_CONNECTOR_AUDIT_COMPLETE / PHYSICAL_LARGE_JSON_WRITE_AND_NATIVE_ACCEPTANCE_HELD.**

## 1. Verified removal and implementation boundary

The accepted IDs are stored in [the single source-removal manifest](first-world-offshore-square-artifact-removal-2026-11-12.json), which is used to filter the map's effective footprint set before drawing **both** macro/continent and subregion overlays. All 42 ID centers are outside all 68 source coastline polygons, and their centers lie approximately **1.4–4.3 world-map pixels** from an authored settlement coordinate; this independently corroborates the user's visual verification and the historical settlement-buffer issue.

- Original physical JSON: **201 footprint polygons**. Effective viewer/audit set: **159** after approved exclusions. Zero exact 8×8 squares survive in the effective set.
- The generator had stamped settlement-centered land buffers into both region and biome masks. The review-branch generator removes that behavior. Its stale `settlement.mapLocation` references were replaced with current `visualMapRef`/site-class evidence; offshore settlement coordinates are not inserted as land-partition anchors.
- **GitHub connector payload restriction:** the 9.3 MB physical `world_map_features.json` rewrite did not succeed via the remote upload interface; the original blob remains unchanged on the remote branch. The repository now contains `scripts/remove-verified-offshore-footprints.mjs --write`, a deterministic, formatting-preserving, exact-42-ID source cleanup command. **It must be executed, tested, committed and pushed from the local map-review worktree before claiming the physical JSON deletion.** It checks source feature IDs, 8×8 geometry, coastline nonmembership, exact counts and prevents partial deletion. `--check` fails while original artifacts remain. Do not label this physical cleanup complete until the new blob and native test witness exist.
- The coastline, elevation and biome original raster assets are not modified. The review-only geographic masking is not a substitute for new accepted physical landmask raster.
- The 42 settlements whose land footprints were artificially manufactured remain authored with unchanged coordinates. **44** of 86 non-underwater settlement anchors have a valid retained footprint; **42** no longer do. The two underwater sites retain independent handling. A full settlement audit is expected to expose those 42 as placement failures, **not** to fabricate land or silently reclassify them as valid.

## 2. Repeatable region-to-continent geometry audit

Reproduction: `node scripts/audit-first-world-continent-region-footprints.mjs --json`.

The checked-in audit raster-samples the authoritative polygon vertices at **2×2 reference-pixel cells** (one sample at each cell center) and assigns each region polygon to its declared macro parent in `regions.json`. It separately samples the 68 coastline polygons. This is **vector source geometry**, not an independently decoded biome/elevation PNG threshold and not a passability model.

In-memory evaluation of the exact same audit code with the current source blobs and owner exclusion manifest produced:

| Measure | Result |
| --- | ---: |
| Source / effective footprint polygons | 201 / **159** |
| Continent / island-system parents | **5 / 4** |
| Named subregions | **28** |
| Island subregions without independent footprint geometry | **12** |
| Samples covered by 2+ different macro owners | **5 cells = ~20 reference px²** |
| Macro owner pairs with actual sampled overlap | **1** |
| Source coastline components with 2+ materially present macro owners | **10**, including two map-edge strip artifacts |
| Effective footprint area sampled outside all coastline parts | ~**10,924 reference px²** |
| Source coastline area sampled without footprint coverage | ~**9,588 reference px²** |
| Additional possible wholly offshore small footprint parts (not owner-accepted) | **41** under the current 2px sample rule |

The sampling figures are diagnostics and may move with raster threshold, polygon boundary winding/holes, connectivity or source-art crop decisions. In particular, **do not delete the 41 other small offshore candidates automatically**; they are not part of the user's verified 42.

### A. Direct cross-parent overlap: Valtherion / Dawnreach

The only measurable inter-macro polygon overlap at 2px resolution is:

| Macro pair | Approximate shared area | Reproduction point |
| --- | ---: | --- |
| `region.valtherion` × `region.dawnreach_isles` | **20 reference px²**, five grid cells | (1691–1699, 491) |

Contributing regions are Sapphire Rivers and the directly owned Dawnreach Isles footprint. This is a **narrow boundary collision**, not evidence that all of Dawnreach belongs to Valtherion. Treat as a localized candidate and inspect actual image connectivity / ownership before any shape revision.

### B. Single coastline components assigned to several macro owners

These coastline IDs are source-derived traced land shapes, not guaranteed physically independent continents. They can include bridges or diagonal pixel connections across areas that visually look separated.

| Source coastline part | Approximate traced area, px² | Macro owners materially represented within that same traced part (approx. sampled area px²) |
| --- | ---: | --- |
| **part_3** | 288,996 | Valtherion **266,448**; Myridian Chain **9,784**; Dawnreach Isles **5,736**; Lantern Isles **1,936** |
| **part_51** | 111,260 | Draemor **73,376**; Lantern Isles **16,032**; Talmyra **15,256**; Serpent's Wake **4,712** |
| **part_10** | 88,708 | Kaelvar **82,880**; Serathyl **4,404** |
| **part_45** | 36,520 | Serathyl **24,512**; Lantern Isles **7,424**; Draemor **3,640** |
| **part_58** | 20,000 | Talmyra **17,780**; Serpent's Wake **2,220** |
| part_31 | 6,248 | Myridian **2,724**; Kaelvar **2,540**; Serathyl **984** |
| part_8 | 4,164 | Kaelvar **2,740**; Myridian **1,420** |
| part_41 | 3,040 | Dawnreach **1,732**; Valtherion **1,300** |
| part_1 / part_2 | 4,096 / 2,292 | Multiple parent labels, **but these include 2-pixel map-edge strips**, not reliably connected inland geography |

These are **connected-contour ownership candidates**, not automatically incorrect administrative assignments. They are the best explanation for the user's observation that a region/continent appears to span more than one major landmass or another continent's coast. The underlying polygon masks overlap directly in only a tiny area; the larger issue is that **one traced coastline component is shared by different parent identities**, perhaps because of thin or diagonal contacts.

### C. Subregion edges

Direct sampled subregion overlap pairs (not all on different continents):

| Pair | Approx. overlap px² |
| --- | ---: |
| Crownlands / Embersteppe | 272 |
| Jade Expanse / Sapphire Rivers | 144 |
| Crownlands / Sapphire Rivers | 136 |
| Embersteppe / Sapphire Rivers | 88 |
| Shattercap Isles / Verdant Thalos | 60 |
| Auric Marches / Shattercap Isles | 32 |
| Dawnreach Isles / Sapphire Rivers | 20 |

The 12 island-system subregions (e.g., Starfall Isle, Pearlwake Keys, Aurora Reach) still have no individually keyed footprint polygon; they cannot be precisely assigned coast geometry solely from their common parent. The map editor can hold manually proposed review shapes, but must not claim them as official boundaries.

## 3. Corrective gates and decisions

1. **Source write gate:** run exact 42-ID `--write` command in a separate local worktree; assert 159 physical features and zero manifest IDs, inspect diff (only the one large JSON footprint array changed), then rerun `--check`. No deletion of any other small polygons.
2. **Renderer gate:** verify macro and subregion overlays each draw only the 159 retained parts, with no ghost square at the original locations; source coastline remains unchanged.
3. **Generator gate:** run static checks and, separately, a disposable *copy* regeneration rehearsal. Ensure no settlement-centered land/biome buffers are reintroduced and current `visualMapRef` is used. Do not run the generator directly against production map content until the topology/geometry decisions are accepted.
4. **Contour connectivity gate:** pixel-check coastline parts 3, 51, 10 and 45 against the accepted source rectangle; determine if a one-pixel land neck or tracer artifact merged landmasses that are actually water-separated. Diagnose actual coastline ownership before assigning or moving region boundaries.
5. **Macro hierarchy gate:** resolve localized Valtherion/Dawnreach overlap at (1691–1699,491), plus all 12 unpolygonized island subregions. Do not infer that shared traced land means every administrative region has been misassigned.
6. **Residual candidate gate:** independently classify the **41** remaining possible offshore fragments with landmask/raster evidence and owner acceptance before further removal. An exact 8×8 square rule is not an authorization to trim arbitrary small islands.
7. **Settlement audit gate:** preserve 42 newly exposed missing-land-footprint findings for explicit relocation or region/shoreline decisions. The current hard-failure rule must **not** be weakened to make the post-clean test green.
8. **No gameplay integration:** keep travel, settlement records, population, World engine, historic Saves, protected branches and L2 startup/character work unchanged.

## 4. Verification disposition

**Completed in this GitHub-connected session:** exact source identities, 42 square checks, 2px scanline raster audit, five-cell macro overlap, connected-coastline multiple ownership sample and 42 failed settlement footprints after exclusion. Committed a repeatable read-only Node audit and a deterministic targeted physical cleanup script on draft PR #77.

**Not completed:** physical 9.3 MB source rewrite on the remote branch (connector transport limitation), native Node test execution in the authenticated worktree, actual original PNG pixel/sea-level inspection, browser test after latest changes, or accepted repair of multi-parent coasts. Status stays **NOT_READY_FOR_MERGE**.
