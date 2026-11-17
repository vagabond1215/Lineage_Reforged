# First World Option 2 G2-E2: Seven-site original-image coastline review

Date: 2026-11-16  
Status: **SOURCE_RENDER_REVIEW_READY / SEVEN OWNER DECISIONS PENDING / CANONICAL_GEOMETRY HELD**  
Sources: [G2-E1 Valtherion owner decisions](first-world-option2-g2e1-valtherion-owner-review-2026-11-16.md), [G2-E source authority](first-world-option2-g2e-image-history-derived-geography-gate-2026-11-16.md), [G2 component inventory](first-world-option2-g2-native-physical-component-review-2026-11-16.md), [machine evidence](first-world-option2-g2e2-seven-site-source-review-2026-11-16.json).  
Reproducer: [Original-16K read-only source review](../../scripts/first-world-option2-g2e2-source-review.py).

## Scope and source authority

This is a bounded implementation of the next geography review stage **without consuming Codex tokens or accessing occupied Windows worktrees**. The owner confirmed the installed Fantasy Map Simulator exposes Image and History exports rather than native semantic land-cell geometry. We therefore present **owner-authored derived-cartography candidates** grounded in the three original 16384×9421 State/Height/Biome source images, each SHA-256-verified before generating evidence.

The two land/water classifiers are:
- **A**: State rendered ocean pixels with red exactly 64 and blue exactly 255.
- **B**: Biome AND Height share-rendered broad-blue chromatic consensus using HSV H93..125, S≥125, V≥195 and BGR blue≥195, red≤135, green≥70.

Both classifiers derive from **the simulator's visual render**, so even strong agreement is not independently decoded physical terrain. Pixel-component IDs, exact State colors, coast ink, rivers, holes and connectivity observations do **not** supply native Voronoi province/district polygons or approved sovereign political boundaries.

## Seven source-native bounded review areas

All coordinates are full original 16K `[x0,y0,x1,y1)` pixel rectangles. Each source ROI is a review window, **not** the outline of an approved physical island or subregion.

| Key | Geographic review focus | Native source window | A/B pixels differing |
| --- | --- | --- | ---: |
| `G2E2_DAWNREACH_U_ARC` | Dawnreach white northern U-shaped polar island arc | `[6150,710,8040,2350)` | **286** |
| `G2E2_MYRIDIAN_NORTH` | Northern red Myridian chain adjacent to Dawnreach | `[5180,1340,6980,2910)` | **83** |
| `G2E2_MYRIDIAN_DETACHED_CENTER` | Detached red jellyfish-shaped central Myridian land | `[7080,3230,7960,4510)` | **47** |
| `G2E2_KAELVAR_NE_ISLAND` | Kaelvar NE whole island and unresolved Shattercap/Coast 40 review | `[3910,1020,5190,1850)` | **60** |
| `G2E2_SERPENTS_NORTH` | Northern remote teal Serpent's Wake chain | `[13910,3760,14970,5810)` | **73** |
| `G2E2_SERPENTS_SOUTH` | Southern remote teal Serpent's Wake pieces | `[13260,5830,14590,7480)` | **53** |
| `G2E2_DRAEMOR_TALMYRA_NECK` | The owner-described natural tidal stone neck | `[8300,5740,9000,6670)` | **39** |

Across these **separate, selected review windows**, exactly **641 native pixels** are classified differently by A and B. All are A-only rendered-land pixels in the selected windows; none is B-only. **This is not a worldwide difference count**, and 641 is not a number of disputed islands or coast points.

The local land-mask candidate pixels per window are recorded alongside coast-edge proxies and exact State interior color-fill counts in JSON. Each contact panel presents original State, Height and Biome; mask A and B; and an amplified-color uncertainty halo. The **halo is magnified for display only**, whereas every reported count uses raw native-source pixels.

### Owner review instructions

Every item has `ownerDecision:null` and `ownerReviewStatus:PENDING_OWNER`. Reviewing the images can approve an **authored candidate coast direction** or request a precise correction, but it should never be described as recovering simulator-native cell geometry.

The decisions to keep separate from coastline pixel appearance are:

- **Dawnreach versus northern Myridian:** white northern U-arc is a distinct geographic parent from adjacent red Myridian clusters. Whole-island identity and unresolved Nacre Shelf attribution are held.
- **Detached central Myridian island:** source-based outline can be reviewed independently of the nearby **sovereign merfolk underwater city**, which does not inherit island ownership.
- **Kaelvar NE / Shattercap:** preserve the candidate whole detached island until source-matched ownership and local island identity are explicitly approved. Do not use a colored pixel to annex the island.
- **Serpent's Wake north/south:** inspect independent island groups and coastlines without assigning every island the same political command or labeling the population as uniformly piratical.
- **Draemor–Talmyra:** render continuity supports owner lore of a natural tidal rock neck with limited small-craft arches. No image analysis establishes minimum geological passage width, large-vessel clearance, tides, predator closures, paved road or a route graph edge. The owner-approved neck *design intent* is retained, while **exact shoreline and traversability remain held**.

The G2-E1 Valtherion V1/V2 owner decisions are also still pending. This batch does not resolve or overwrite them. The owner has not selected between alternate island geometries, and nobody has issued permanent physical island IDs.

## Reproducibility and artifact contract

The script:
1. Checks the original SHA-256 for all three 16K files and their full pixel dimensions.
2. Crops seven immutable full-resolution boxes using their explicit coordinate contract, never a guessed inverse 2048 reference transform.
3. Produces two rendered-water masks and compares exact per-ROI pixels without smoothing or threshold optimization.
4. Records exact State parent-color core pixels as **placement hints only**, not sovereign claims.
5. Writes a machine ledger, seven individual six-view PNG panels and a vertically stacked atlas **outside Git and source directories**. It refuses prepopulated output directories.
6. Never reads, mutates, writes or publishes save files or original PNGs.

A separate source-based locator chart, the seven panels, local run receipt and ledger are bundled in **`FirstWorld_Option2_G2E2_Seven_Site_Owner_Review.zip`**, SHA-256 `88ae16795d90269cd620b40695bfece051add3b155e9591294321507fe5fa45e`, 2,261,945 bytes, CRC-verified, outside Git. The repository workflow reproduces the seven panels and raw numerical evidence directly from original scoped LFS images and uploads only **generated review evidence**, not the full PNG originals.

### Windows command

```powershell
$py = "$env:LOCALAPPDATA\LineageReborn\first-world-registration-venv\Scripts\python.exe"
$repo = "C:\Codex\EoL"
$src = Join-Path $repo "packages\content\base\world\map_assets\first_world_simulator_option2_2026_11_15"
$out = "C:\Users\vagab\OneDrive\Desktop\FirstWorld_Option2_G2E2_Review"
& $py "$repo\scripts\first-world-option2-g2e2-source-review.py" --self-test
& $py "$repo\scripts\first-world-option2-g2e2-source-review.py" --source-dir $src --output-dir $out
```

Use a new empty output path outside all Git worktrees and the original simulator Saves tree. Do not change any active checkout just to run this; the review archive contains the executable standalone script.

## Disposition and next safe step

**G2-E2_SOURCE_REVIEW_READY**, not geography publication. Seven review windows prepared; **seven owner decisions pending**, plus two previous Valtherion choices. Owners can adjudicate specific whole-island/coastline questions, after which later separate source geometry authoring work must pass polygon closure/winding, all-island membership and shared-boundary validation.

No `regions.json`, `world_maps.json`, `world_map_features.json`, terrain/ecology, political ownership, travel, legacy hex, runtime, original raster or save modifications. Active C1 and held draft PR chains remain untouched.
