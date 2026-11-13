# First World Kaelvar K2: original-source palette/elevation/ink probe gate

Date: 2026-11-13
PR: #79 (draft, unmerged)
Branch: `connector/first-world-raster-macro-evidence-pilot-2026-11-12`
Status: **K2 THREE-PANEL OWNER VISUAL REVIEW PASS; NATIVE JSON/TAP RESULTS NOT YET PROVIDED; ECOLOGICAL CALIBRATION UNAPPROVED**

## Prerequisite and exact scope

K1 native JSON passed **51/51** unit tests; the owner supplied registered
four-panel biome/elevation SVG screenshots, visually accepted as
`SOURCE_RENDER_PASS__REGIONAL_BOUNDARIES_HOLD`. Existing old ink-inclusive
Coast 10: 86,417/1,362/88; terrain-only Kaelvar reference component 30:
79,419/204/84. Deduplicated Shattercap: 30,938 total,
27,245 on terrain-only mainland / 3,693 over 18 detached components,
no Shattercap self-overlap. Windward Part 1: 3,661 mainland + 12
separate terrain candidates. Shattercap Part 1: 684 all blue candidates,
not an approved 43rd excluded source artifact.

K2 targets **the next evidence step only**: extract reproducible,
coordinate-exact, original-PNG source observations to support independent
judgment about biome palette, relative image color/height, and the
ambiguous black/blue ink of coastlines and apparent watercourses.
Do **not** infer the answer from generated biome zones or region
footprint colors, and do **not** rename, transfer or redraw a region.

The original paired source assets are 4096×2355 PNGs, registered with the
approved crop `{x:60,y:60,width:3976,height:2235}` to a
2048×1152 working reference. K2 native execution fails closed unless
their original byte SHA-256s match the previously owner-verified:
- Biome: `9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12`
- Elevation: `02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d`

The original geometry blob identity, 42 in-memory source exclusions,
159 effective retained footprints, 68 coastline records and 79,419-cell
reference terrain component remain guarded. No original image, polygon
or manifest is modified.

## New read-only source tools

Extends the existing vetted source-pair codepath, rather than adding a
competing generator:

- `scripts/lib/first-world-kaelvar-k2-source-probes.mjs`:
  nine source-ID-specific candidate-terrain sample anchors and 37×37
  nominal source-grid windows (18-pixel radius; edge-clipped).
  Each anchor is chosen deterministically as the native candidate-terrain
  cell nearest the **source terrain centroid** of the original footprint.
  The five mainland samples require the Auric-referenced terrain-only
  4-neighbor component; the other four preserve distinct original island
  cases without presuming shared sovereignty.
- Source window JSON retains all five existing independent source-pair
  classes, exact top RGB swatches for both original images, raw elevation
  brightness quantiles, channel range/chroma and 4-neighbor context
  for the first twelve candidate shared-ink pixels that touch a blue
  and/or terrain neighbor. The ink context distinguishes touching both,
  only blue, only terrain, or neither. **This describes adjacency, not
  the identity of a river, pass, lake, coast or traversable land.**
- Seven Bresenham straight-grid diagnostic transects record all traversed
  source-pair classes and compact exact RGB samples every four path cells,
  including final endpoint. Straight transect lines can cut across water:
  they are **not** roads, river networks, height gradients, coastlines or
  future regional borders.
- `scripts/first-world-kaelvar-candidate-comparison.mjs --k2-evidence`:
  stdout JSON with raw-coordinate anchors, sample windows,
  class counts, original RGB, original PNG hashes, identity and explicit
  null approved biome/height/hydrology/borders.
- `scripts/first-world-kaelvar-candidate-comparison.mjs --k2-svg`:
  stdout three-panel SVG: source biome with numbered anchors/transects;
  source elevation with same anchors/transects; source biome with
  **shared nonblue unresolved ink highlighted magenta**.
  The same cropped PNG bytes are embedded locally in each relevant panel;
  no external image URLs. The highlight is **not a resolved water mask**.
- `tests/unit/first-world-kaelvar-k2-source-probes.test.mjs`:
  six synthetic regression checks for original provenance and detachment,
  class counts and ink ambiguity, full transect accounting, source-image
  embedded SVG, invalid inputs and the read-only CLI contract.

### Selected original features and intended observation

| Sample key | Provenance source feature ID | Candidate focus |
|---|---|---|
| `auric_west` | `feature.region_auric_marches.part_4` | Western source candidate terrain |
| `shattercap_main` | `feature.region_shattercap_isles.part_7` | Northern/eastern mainland source claim |
| `verdant_south` | `feature.region_verdant_thalos.part_1` | Southern peninsula source candidate |
| `shattercap_southeast` | `feature.region_shattercap_isles.part_15` | Southeastern existing source label |
| `windward_southeast` | `feature.region_windward_spine.part_1` | Foreign-labeled southeastern Kaelvar peninsula |
| `shattercap_north_island` | `feature.region_shattercap_isles.part_4` | Distinct northern offshore component |
| `shattercap_east_island` | `feature.region_shattercap_isles.part_17` | Separate eastern/southeastern offshore case |
| `coast40_verdant` | `feature.region_verdant_thalos.part_6` | One of the two Coast 40 source claims |
| `coast40_windward` | `feature.region_windward_spine.part_2` | Other Coast 40 claim |

**Transect pairs:** Auric→Shattercap 7; Shattercap 7→15;
Verdant 1→Shattercap 15; Verdant 1→Windward 1;
Shattercap 4→7; Windward 1→Shattercap 17;
Verdant 6→Windward 2 (Coast 40).

**Bias caution:** These are deliberately selected source-footprint
probes for contested areas. They are not an unbiased whole-region
ecology sampling plan. Overlapping square windows can count the same
source pixels in multiple windows. Do not sum all window pixel counts
as deduplicated area. K1's separately reported **2,697 connected raw
RGB4 patches** remain the independent whole-physical-component
color-continuity reference, also not certified biomes.

## Stage entry/exit/failure gates

| Stage | Entry | Successful exit | Failure/HOLD |
|---|---|---|---|
| K2.0 Source invariants | K1 51/51, four-panel rendering pass | Native original PNG hashes, geometry SHA/EOL identity, 42/159/68, current K1 physical component reproduce | Any source drift, missing sampled source ID, unapproved original PNG mutation |
| K2.1 Raw color/ink evidence (this patch) | K2.0 | New six unit tests + prior seven suites all pass; JSON + 3-panel source SVG generated outside repo; every sample has valid grid coordinate, exact RGB and source class; all windows/transects class counts reconcile | Bad SVG/image registration; any RGB treated as biome name; ink reclassified as water/land by proximity; missing islands |
| K2.2 Source semantic calibration | K2.1 screenshots inspected | Independently documented source-map legend or explicitly reviewed RGB color-to-biome, mixed, art, unknown table; height color ramp interpretation and confidence; separate river/coast/lake and uncertain artwork evidence | Lacking source legend and no approved fallback, brightness called meters, farmland inferred from biome PNG, watercourse traced from graphic color alone |
| K2.3 Independent spatial/ecotone patches | K2.2 | Pixel-resolution source classes, connected topographic/ecological regions, confidence and transect sensitivity, unknown/ecotone bands quantified | Administrative polygons used as ground truth, gradients misread as biome edges, islands lost, unknowns forcibly assigned |
| K3 A/B boundary construction | K2.3 approved | Two genuinely different, source-backed non-overlap masks with source IDs, physical continuity and dependency ledger; owner approval before writes | Preapproval borders, fourth region invented from area balance, blanket Windward/Coast40 transfer |

K2.1 is a **probe-gathering** gate. K2.2 and K2.3 are not complete merely
because the images render or a raw color cluster is large. The user
must explicitly approve ecological labels and interpretation before
candidate boundary masks can be built.

## PowerShell 7 native execution, no Codex

Run only in the existing detached clean worktree. Fetch the draft
branch, require the expected head to match the **latest PR #79 readback**,
execute source-probe unit tests and the previous seven source suites, and
redirect both output files outside the repo. The following snippet
intentionally requires the operator to set the latest expected SHA
using the PR head readback; do not guess if the branch moved.

```powershell
$ErrorActionPreference = 'Stop'
$worktree = 'C:\Codex\EoL-macro-raster-pass0'
$branch = 'connector/first-world-raster-macro-evidence-pilot-2026-11-12'
$expectedHead = '<COPY_EXACT_LATEST_PR_79_HEAD_FROM_REVIEW>'
$dir = Join-Path $env:TEMP 'first-world-pass0-review'
if ($expectedHead -notmatch '^[a-f0-9]{40}$') { throw 'Set exact PR #79 head SHA' }
if (-not (Test-Path $worktree)) { throw 'Missing detached verification worktree' }
Set-Location $worktree
if (@(git status --porcelain).Count) { throw 'Worktree must be clean' }
git fetch --no-tags origin $branch
if ($LASTEXITCODE -ne 0) { throw 'Fetch failed' }
$remote = (git rev-parse "refs/remotes/origin/$branch").Trim()
if ($remote -ne $expectedHead) { throw "Unexpected branch head: $remote" }
git switch --detach $expectedHead
if ($LASTEXITCODE -ne 0) { throw 'Detached checkout failed' }
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$files = @(
 'tests/unit/first-world-raster-macro-evidence.test.mjs',
 'tests/unit/first-world-environment-evidence.test.mjs',
 'tests/unit/first-world-source-pair-qa.test.mjs',
 'tests/unit/first-world-coast10-ecology-review.test.mjs',
 'tests/unit/first-world-kaelvar-locality-review.test.mjs',
 'tests/unit/first-world-shattercap-union.test.mjs',
 'tests/unit/first-world-kaelvar-candidate-comparison.test.mjs',
 'tests/unit/first-world-kaelvar-k2-source-probes.test.mjs'
)
node --check scripts/lib/first-world-kaelvar-k2-source-probes.mjs
if ($LASTEXITCODE -ne 0) { throw 'K2 syntax failed' }
node --check scripts/first-world-kaelvar-candidate-comparison.mjs
if ($LASTEXITCODE -ne 0) { throw 'K2 CLI syntax failed' }
$tap = Join-Path $dir 'kaelvar-K2-source-probes-tests.txt'
node --test @files 2>&1 | Tee-Object -FilePath $tap
if ($LASTEXITCODE -ne 0) { throw 'K2 native Node suite failed' }
$json = Join-Path $dir 'kaelvar-K2-source-probes.json'
$svg = Join-Path $dir 'kaelvar-K2-source-probes.svg'
node scripts/first-world-kaelvar-candidate-comparison.mjs --k2-evidence > $json
if ($LASTEXITCODE -ne 0) { Remove-Item $json -ErrorAction SilentlyContinue; throw 'K2 JSON failed' }
node scripts/first-world-kaelvar-candidate-comparison.mjs --k2-svg > $svg
if ($LASTEXITCODE -ne 0) { Remove-Item $svg -ErrorAction SilentlyContinue; throw 'K2 SVG failed' }
$r = Get-Content $json -Raw | ConvertFrom-Json
if ($r.status -ne 'K2_RAW_SOURCE_PROBES_NOT_CALIBRATION_APPROVAL') { throw 'Wrong K2 status' }
if ($r.anchors.Count -ne 9 -or $r.transects.Count -ne 7 -or $r.windows.Count -ne 9) { throw 'K2 inventory drift' }
if ($null -ne $r.biomePaletteLegend -or $null -ne $r.elevationTransferFunction -or
    $null -ne $r.hydrologyClassification -or $null -ne $r.approvedBorders) {
 throw 'K2 unexpected semantic or political approval'
}
if ($r.sourceWritable -ne $false -or $r.ownerApprovalRequired -ne $true) {
 throw 'K2 review-only contract failed'
}
$r.sourceImages
$r.anchors | Select-Object key,id,sourcePixel,terrainOnlyComponentId | Format-Table -AutoSize
$r.windows | Select-Object key,pixelCount,sourcePairClasses,sharedInkFourNeighborContext | Format-Table -AutoSize
$r.transects | Select-Object id,originalGridCells,fullPathClassTransitions,sharedInkCellsTouchingBothTerrainAndBlue | Format-Table -AutoSize
[xml]$image = Get-Content $svg -Raw
$panels = @($image.SelectNodes('//*[local-name()="image"]'))
if ($panels.Count -ne 3) { throw "Expected three embedded original PNG panels, found $($panels.Count)" }
if (@(git status --porcelain).Count) { throw 'Native K2 changed worktree' }
if ((git rev-parse HEAD).Trim() -ne $expectedHead) { throw 'K2 HEAD changed' }
Write-Host "K2 JSON=$json"
Write-Host "K2 SVG=$svg"
Write-Host "K2 TESTS=$tap"
Write-Host "K2 HEAD=$expectedHead"
Write-Host 'K2 NATIVE STRUCTURE PASS - SOURCE SEMANTIC CALIBRATION HELD'
Invoke-Item $svg
```

**Return:** exact HEAD, TAP passing/failing counts, original PNG
hashes, anchor coordinates with original IDs and physical components,
all window source-class/ink-contact counts, RGB/elevation diagnostic
swatches and transect counts from the JSON, and a screenshot of the
full 3-panel SVG including the legend. If source hashes or baseline
component identity changed, halt rather than amending the source.

## Owner-rendered K2 source-probe SVG: visual review (2026-11-13)

The owner provided a screenshot of the complete three-panel `--k2-svg`
source-probe visualization. It visibly shows all nine original
feature-derived numbered anchors and the straight diagnostic transects
in (1) original biome RGB, (2) original elevation RGB and
(3) original biome RGB with magenta highlighted
`SHARED_NONBLUE_UNRESOLVED` ink. The same coastline silhouettes,
islands and sampling points occupy corresponding locations in all
three panels. No gross crop/registration inconsistency is evident at
the screenshot zoom.

**Visual status: `K2_SOURCE_PROBE_RENDER_PASS__SEMANTIC_CALIBRATION_HOLD`.**
This is only a rendered-image inspection. The screenshot does **not**
include native TAP counts, K2 JSON swatches, complete full-path
source-class counts, raw PNG SHA verification output, nor final clean
worktree confirmation. Do not claim those gates completed from the
visual alone.

### Supported visual observations

- Auric west (#1): dominant pale yellow with scattered orange/green
  original biome-image areas. Not independently verified dry scrub,
  steppe, soil or altitude.
- Large Shattercap mainland source part (#2): an extensive yellow
  and green transition. A source-polygon label does not establish
  an ecological edge.
- Verdant south (#3): broad green and darker-green source-image
  concentrations, with original image watercourse-like markings.
  These are not yet classified forests, cropland or hydrology.
- Shattercap southeastern Part 15 (#4): image color transition
  from darker green toward yellow-green and largely paler
  elevation-source color at its anchor. Its cold-maritime suitability
  has **not** been demonstrated by the image.
- Windward southeastern Part 1 (#5): visibly green source biome
  image and largely pale elevation-image color near the sample
  anchor. Earlier red/magenta political overlay was **not**
  original red surface biome. Nor does the uncalibrated elevation
  panel independently prove a mountain spine or its absence.
- Northern detached Shattercap and eastern island cases (#6, #7):
  visible as distinct island geography. Coast 40's two nearby
  source claims (#8, #9) remain a separate shared-island review,
  not approved sovereignty.
- The greatest conspicuous salmon/peach patches on the elevation
  source appear across a more central/southern inland band than
  the Windward southeast anchor. Color cannot be equated with
  meters, slope, relief, catchment or drainage direction until
  the elevation-encoding authority is established.
- Magenta `SHARED_NONBLUE_UNRESOLVED` occurs extensively along
  shores and island perimeters. Some interior blue river-like lines
  do not visibly receive the same magenta overlay. Do **not**
  merge black shoreline art and blue linework into a certified
  single river/land class.
- Straight sample transects deliberately cross terrain/water
  and source-image color transitions. They are **not** ecological,
  political, transport or river boundaries.

### Remaining evidence needed for next calibration decision

1. Native K2 TAP summary plus `--k2-evidence` JSON including
   source image SHA-256s, nine anchor coordinates/components,
   exact source RGB histogram snippets and shared-ink window counts.
   Do not claim a complete K2.1 native pass without these.
2. Confirm any original source-map biome legend, elevation-ramp
   encoding and intent of coast/river art. If absent, retain
   `SEMANTIC_CALIBRATION_HELD` and prepare the smallest
   explicitly reviewable sample color/height table for owner
   classification rather than assigning biomes by screenshot hue.
3. Preserve all physically detached Shattercap components and
   Coast 40 review; never infer Shattercap northern sovereignty
   from source IDs or auto-transfer Windward Part 1 to Verdant.
4. No A/B candidate political masks, fourth region, source PNG,
   canonical JSON, route, hex, Save or gameplay changes until
   ecological, hydrological and owner review gates are independently
   satisfied.

## Decision protocol after visual review

The next human interpretation review should focus on a *few specific
original-image source coordinates and RGBs*, not generic color names.
For each candidate RGB group: original source legend or explicit
owner mapping; uncertainty for color blending and shared artwork;
independent terrain context; whether sources indicate a continuous
habitat or an image gradient. For elevation: verify original encoding
and meaning of salmon/peach versus light colors without assuming
`height = brightness`. For black/blue watercourse-like lines:
separate shoreline boundaries, river/lake candidates, coastline art
and ambiguous strokes, with explicit no-decision cells where needed.

If the source map lacks a defensible palette/height legend, record
`SEMANTIC_CALIBRATION_HELD` and ask for source author provenance or
owner-adjudicated categories before fitting Layout A/B. Do not infer
a fourth region or transfer Windward, Shattercap islands or Coast 40
from those diagnostic RGB swatches alone.

**Scope exclusions:** never edit original PNGs, old 42 exclusion
manifest, canonical `world_map_features.json`, `regions.json`,
settlements, routes, hexes, travel, world generation, runtime, Saves
or master; never merge PR #79 without authorization.
