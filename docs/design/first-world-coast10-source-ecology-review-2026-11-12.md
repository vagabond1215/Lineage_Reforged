# First World Coast 10: source terrain, river-ink and ecology review pilot

Date: 2026-11-12
Source: independently registered original First World biome and elevation PNGs
Base: draft PR #79 on audited `41a8ab1dd8c35cae12c8b392fa12da55c74401db`
Implementation state: **READ-ONLY SOURCE COMPARISON CODE / NATIVE REVIEW OUTPUT NOT YET VERIFIED**
Canonical write/merge: **HELD**

## Why the target is Coast 10

Owner-executed L0/Pass 0 witness:
- Windward Spine Part 1 on Kaelvar's existing ink-inclusive
  component 25: **4,326 provisional land cells**, including
  **3,673** independent source terrain-color candidates and
  **653** unresolved shared-ink cells, plus **246** blue candidates.
- The 3,673 terrain pixels divide into **3,661** terrain-only
  component 30 cells and **12** terrain-only component 113 cells.
  With shared ink included, both are currently assigned to old
  component 25. The ink-inclusive component 25 connects **six**
  distinct terrain-only components and contains **6,839**
  ink/unresolved cells, requiring river/shore interpretation.
- Neighboring Kaelvar region labels in component 25 are
  Auric Marches, Shattercap Isles and Verdant Thalos; exactly
  88 raster pixels of same-macro child overlap and 1,362
  provisional-land cells with no region footprint.
- The prior source environment report shows materially
  different dominant **raw image colors** between Windward
  Part 1 and Verdant Thalos Part 1. Without a trusted biome
  source palette this is **not** an ecological incompatibility
  score, nor a reason to auto-assign Windward cells to a
  specific Kaelvar child.

**Do not overwrite the political boundaries by equal-sized
global nearest-anchor or biome zone masking.**

## Added read-only outputs

`scripts/lib/first-world-coast10-ecology-review.mjs` produces:

1. A **three-panel Coast 10 source SVG**, in one exact
   geographic reference crop around Windward Part 1 (plus
   38 source reference pixels), with:
   - Original biome PNG sampled colors, including full
     source RGB and transparency; **no biome labels inferred**.
   - Original elevation PNG sampled colors, **no height
     encoding/meter values inferred**.
   - Terrain-only source pair candidates and shared coastal/
     river ink; the Windward focus terrain-only components
     receive distinct bright colors to show where a source
     artwork bridge might be misleading.
   - Existing Kaelvar child-region outlines in blue,
     existing Serathyl child-region outlines in pink,
     old Coast 10 coastline in gold, and Windward Part 1
     in a dashed white line. All lines are non-scaling
     and the original crops are embedded losslessly in
     the SVG as local `data:image/png`, with no network
     requests or separate dependencies.
2. A **local ecology JSON** for each source footprint
   intersecting the review crop (only Kaelvar and Serathyl):
   - Exact source terrain/ink/blue candidate counts inside
     the review crop, preserving each polygon's ID and
     authored parent region.
   - Raw 4-bit RGB cluster histogram, top colors,
     elevation color-luminance p10/median/p90,
     and percentage of non-grayscale elevation pixels.
   - Authored `dominantBiomeMix`, elevation description,
     climate tendencies and agricultural potential,
     kept as expectations separate from measured pixels.
   - Percentage distribution overlap with the Windward
     focus's **source RGB clusters**, explicitly
     NOT a biome match or a political-region recommendation.
     The score is descriptive only and cannot choose a
     child region or create a territorial assignment.
   - The focus part's global terrain-only and
     ink-inclusive component membership crosswalk.

No alpha, source biome pixels, elevation pixels, region feature,
coastline feature, region parent, biome zone, settlement, travel
route, Save, gameplay or generator file is modified.

## Reproduce in detached local worktree

```powershell
Set-Location C:\Codex\EoL-macro-raster-pass0

if (@(git status --porcelain).Count -ne 0) {
    throw 'Review local modifications before switching test checkout'
}
git fetch origin connector/first-world-raster-macro-evidence-pilot-2026-11-12
git switch --detach origin/connector/first-world-raster-macro-evidence-pilot-2026-11-12

node --test tests/unit/first-world-raster-macro-evidence.test.mjs tests/unit/first-world-environment-evidence.test.mjs tests/unit/first-world-source-pair-qa.test.mjs tests/unit/first-world-coast10-ecology-review.test.mjs
if ($LASTEXITCODE -ne 0) { throw 'Native regression failure' }

$dir = Join-Path $env:TEMP 'first-world-pass0-review'
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$json = Join-Path $dir 'first-world-coast10-ecology-review.json'
$svg = Join-Path $dir 'first-world-coast10-ecology.svg'

node scripts/first-world-source-pair-qa.mjs --coast10-review > $json
if ($LASTEXITCODE -ne 0) {
    Remove-Item $json -ErrorAction SilentlyContinue
    throw 'Native Coast 10 ecology review failed'
}
node scripts/first-world-source-pair-qa.mjs --svg-coast10 > $svg
if ($LASTEXITCODE -ne 0) {
    Remove-Item $svg -ErrorAction SilentlyContinue
    throw 'Native Coast 10 SVG failed'
}
$r = Get-Content $json -Raw | ConvertFrom-Json
$r.focusTopology | Format-List
$r.observedExistingRegionFootprints |
    Select-Object id,regionName,macroId,cellsInReviewCrop,
        terrainCandidateCells,sharedInkUnresolvedCells,
        sourceColorHistogramOverlapWithWindwardPercent,
        rawElevationLuma | Format-Table -AutoSize
Invoke-Item $svg
```

Outputs are local temporary files only. The original source
PNGs are not recropped or rewritten.

## Acceptance and failure conditions

**Entry:** earlier 29 native tests passed; full-resolution source pair
counts of 525,910 terrain + 59,924 unresolved ink = 585,834 old
threshold land cells; 167/160 old scenario counts reproduced;
Coast 40 remains physically separate and not part of this slice.

**Code acceptance:** all related tests pass; crop is within the
2048×1152 registered reference; embedded source PNGs decode
losslessly; no remote resource; all IDs remain canonical; the
JSON and SVG work under Node 24/PowerShell 7 without writing
the repository.

**Visual acceptance:** review the 12-cell outlier and each
river/waterway ink strip where components 30 and 113 connect to
the larger Kaelvar mainland. Distinguish estuaries, thin rivers,
offshore islands, coastline outlines and traversable terrain
at pixel-scale, with the original map views side by side.

**Ecological acceptance (not yet met):** independently approve
source biome-color legend and colored elevation ramp; compare
the recovered land's interior to each relevant Kaelvar
subregion's authored mixed-biome and elevation descriptions,
allowing physically justified transition belts. Agricultural
potential and farmland are land-use, not direct source RGB
terrain labels. Document if a region description needs lore
revision rather than forcing incompatible geography.

**Political approval (not yet met):** explicit reviewed Kaelvar
macro mask and child-region boundaries, including treatment
of the 12-pixel fragment, nearshore islands, and previously
unclaimed cells. A source-independent island policy is
required for Coast 40 before its own political redraw.

**HOLD:** any source/crop/hash drift, actual pigment meaning
unverified, missing river/shore geometry, clipped source PNG,
test failure, or a proposed region polygon based on RGB
similarity / nearest-anchor ownership without source
geography and explicit review.

This completes a **diagnostic source layer**, not the
continent-region-biome suitability audit or physical
boundary reconstruction.

## Owner-rendered Coast 10 visual review, 2026-11-12

The owner supplied a Brave screenshot of the three-panel
`--svg-coast10` output. The original biome, original elevation, and
source-pair terrain/ink views are visibly aligned in the selected crop.
This confirms the SVG preview **rendered** in the browser, not that
the independent ecological calibration is complete. The accompanying
`--coast10-review` JSON numeric profile has **not yet been supplied**.

**Observed directly from the screenshot:**

- The Windward Spine Part 1 dashed white source border traverses a
  coherent southeastern coastal peninsula in a long diagonal, meeting
  the shore at either end. No conspicuous continuous deep-water channel
  follows that administrative divider.
- The original biome panel shows a mostly green peninsula with
  variation toward deeper greens in the southeast. Those source
  colors are **not calibrated habitat categories**.
- The elevation panel is comparatively light/cream over much of the
  peninsula and warmer salmon/peach farther northwest. This suggests
  a relative topographic contrast **only if** the source colored
  ramp maps to relative height as intended. There is no evident
  sharp ridge exactly along the dotted regional boundary, but no
  calibrated slope/height proof yet.
- Shared magenta source artwork follows shore edges and several
  interior water/ink features. These must remain uncertain rather
  than erased as water or filled as land.
- The highlighted southeastern source terrain is substantial, not
  merely shoreline ink. A separate 12-terrain-pixel piece already
  measured in the earlier crosswalk needs focused pixel review and
  must not be pruned.

**Visual QA disposition:** `RENDER_PASS__POLITICAL_AND_ECOLOGICAL_HOLD`.
The screenshot supports a proposed *review* of the diagonal Windward
partition, not a definitive biome identity, numerical terrain height,
or destination Kaelvar child. Do not assume bright candidate-terrain
fill equals a particular forest biome or that every coastal
administrative border must track an ecotone.

**Next evidence gate:** inspect native `--coast10-review` JSON for the
per-footprint source-color distribution overlap, raw elevation
brightness percentiles, authored profiles, and exact crosswalk. Then
calibrate the source palette and colored elevation ramp. Plan a
candidate Kaelvar child-region boundary using contiguous geography,
river/estuary features and realistic ecotone margins, with a
before/after visual and explicit owner approval. Keep Coast 40 as a
separate island jurisdiction case.

No source rasters, polygons, generator, routes or game runtime were
changed during this screenshot review.

## Owner-reported local source ecology profiles (2026-11-12)

The owner ran `--coast10-review` against the registered original maps.
Windward Spine Part 1 remains **4,572 source-footprint pixels**:
**3,673 divergent terrain**, **653 unresolved shared ink**,
**246 shared-blue candidates**, zero other unresolved. Terrain-only
component **30** has **3,661** pixels under this polygon and component
**113** has **12**; shared-ink-inclusive component 25 contains
**4,326** provisional land pixels. These belong to *different
scenario namespaces*, not multiple political regions.

The source histogram comparison within the **same Coast 10
review crop** returned:

| Existing footprint | Authored macro | Source terrain cells sampled in crop | Windward-relative 4-bit RGB histogram overlap | Uncalibrated elevation luma p10 / median / p90 |
| --- | --- | ---: | ---: | --- |
| Windward Spine Part 1 | Serathyl | 3,673 | 100% reference | 241 / **247** / 251 |
| Shattercap Isles Part 15 | Kaelvar | 3,357 | **54.32%** | 230 / **242** / 250 |
| Verdant Thalos Part 1 | Kaelvar | 2,611 | **41.95%** | 209 / **231** / 247 |
| Windward Spine Part 4 | Serathyl | 230 | 33.95% | 125 / 243 / 250 |
| Windward Spine Part 6 | Serathyl | 162 | 33.87% | 125 / 250 / 252 |
| Shattercap Isles Part 16 | Kaelvar | 83 | 40.76% | 125 / 248 / 250 |
| Windward Spine Part 2 | Serathyl | 74 | 33.87% | 250 / 252 / 252 |
| Verdant Thalos Part 6 | Kaelvar | 56 | 33.87% | 125 / 250 / 252 |
| Windward Spine Part 5 | Serathyl | 11 | 33.87% | 125 / 252 / 252 |

**Do not rank recipient political regions by RGB match.** The
overlap percentages compare coarse source image color histograms
and not labeled forest, alpine meadow, scrub, farmland or
ecological feasibility. The elevation values are RGB-derived
luminance and are not calibrated altitude or slope.

### Critical authored-geography cross-check

Direct inspection of canonical `regions.json` shows:

- **Shattercap Isles** has `positionLabel =
  kaelvar_northern_coast` and is a *broken northern island
  fringe*, with cold maritime, conifer-island and rugged-shoal
  expectations. A 54.32% RGB similarity to the southeastern
  Coast 10 peninsula is **not geographic support** for
  transferring the peninsula to Shattercap.
- **Verdant Thalos** has `positionLabel =
  kaelvar_southern_peninsula` and is authored as a
  fertile southern coastal peninsula with Mediterranean
  woodland, mixed forest, coastal scrub and low hills.
  Its 41.95% RGB overlap is not sufficient to exclude it
  from a proposed southern coastal reassignment.
- **Auric Marches** has `positionLabel =
  kaelvar_western_interior`, expecting dry scrub, steppe
  and broken uplands. It also cannot be assigned a coastal
  peninsula solely by closeness.
- **Windward Spine** has `positionLabel =
  serathyl_northern_mountains`, a high mountain-chain
  subregion. Its southeast Kaelvar footprint remains a
  plausible foreign-continent intrusion, rather than a
  confirmed author-intended southern maritime highland.

**New intra-Kaelvar QA concern:** previous source-label sampling
placed Shattercap Part 7 (**25,342** provisional land pixels)
and Part 15 (**4,464** pixels) on ink-inclusive Kaelvar
mainland component 25. Part 15 also intersects this exact
southeastern Windward Coast 10 crop, contributing **3,357**
source terrain candidates to the local table. This raises
a separate possible **same-continent northern-island-region
versus southern-mainland placement error**. The old component
25 is ink-inclusive: first check whether Shattercap Parts
7 and 15 share a terrain-only component with the inland
mainland, or whether coastline ink artificially joins true
islands. Do not declare those polygons wrong before the
native terrain-only crosswalk is reviewed.

The `--coast10-review` JSON now includes
`neighboringSourceTopologies`, an explicitly
`FULL_CANONICAL_FOOTPRINT_NOT_ONLY_REVIEW_CROP`
4-neighbor crosswalk for Shattercap Parts 7 and 15,
Verdant Part 1 and Auric Part 4. This deliberately
separates the full polygon topology from the **review-crop**
color/elevation histograms and carries each authored
positionLabel/summary for audit.

### Revised decision

1. **Do not auto-reassign Windward to Shattercap**, despite
   Shattercap's higher source-RGB histogram overlap.
2. **Prioritize actual physical southern-peninsula borders**,
   investigate Verdant/coastal-ecotone placement and any
   other authored southern Kaelvar region, and independently
   investigate whether Shattercap's current Coast 10
   footprint is misplaced.
3. **Defer any canonical child-region redraw** until
   source biome and elevation legend calibration,
   treatment of waterways and the 12-pixel fragment,
   and an explicit political/macro decision.
4. **Separate physical geography from land use:** farmland
   and vineyards require climatic, settlement and
   hydrological evidence, not merely green or yellow
   source map pixels.

**Gate status:** owner numeric source extraction VERIFIED,
local Coast 10 spatial/semantic recipient choice HELD.
No source geometry, PNG, route, settlement or runtime
files were altered.
