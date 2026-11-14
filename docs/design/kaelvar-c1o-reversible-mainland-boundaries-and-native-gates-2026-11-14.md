# Kaelvar C1-O: reversible source-grounded mainland boundary reconstruction

Date: 2026-11-14
Status: **FOUR ACTUAL SOURCE-INDEXED POLYGON CANDIDATES AUTHORED; NATIVE RASTER ACCEPTANCE NOT YET REPORTED; CANONICAL PUBLICATION HELD**
Parent: `8c317d48ef405ca29830d4dc4959ce21f07693bb`
Branch: `connector/c1o-kaelvar-regional-boundary-candidates-2026-11-14`

## Corrected C1-N entry gate

The exact C1-N branch has been compared to commit
`8c317d48ef405ca29830d4dc4959ce21f07693bb` and returned
**identical**. That commit changes one test assertion from
`/index specification drift/` to the actual validator wording
`/indexed source-contour segment specification drift/`.
The repository API exposed **no CI statuses and no workflow runs**
for that SHA. Therefore the source/test-text correction is confirmed,
but the corrected **C1-N native Node pass is not independently attested**.
The acceptance command below runs the full C1-N tests before the new C1-O
cases; a local pass is a required gate, not a claim already made.

## What was actually authored

C1-O adds four **noncanonical, unequal, irregular and reversible**
mainland polygon rings. Each is assembled from an exact consecutive run
of the 599 committed source vertices and a short list of plainly marked,
unapproved inland return waypoints. The new boundaries are **not**
derived from a rectangular source-review sector, an equal-area tiling,
a raster color label or a distance buffer along the coast.

| Region | Inclusive original source EDGE run in polygon | Inland status | Review confidence |
| --- | --- | --- | --- |
| Auric Marches | 420–454, western perimeter | Core inland bends provisional; northern transition preserved | Medium |
| Kharuun Drylands | **35–58**, inner northern bay | Central arid basin and western/escarpment seams provisional | **Low on both shore endpoints** |
| Verdant Thalos | 195–348, southern/eastern coast and SE promontory | North seam provisional; 3 SE peninsula inclusion anchors preserved | Medium |
| Veyrholm Shore | 475–598 then 0–23 | Coast-aligned, **variable-depth** northern mainland, no uniform ribbon; dryland exclusions preserved | Medium source, low inland |

In the source-vector polygon geometry, these use 43 / 38 / 161 / 162
outer-ring vertices respectively. Their total pixel count is **not**
equal to the raster terrain-candidate count. A source-contour-only
geometric preview is not a certified terrain map.

**Kharuun shoreline:** The highest-priority candidate starts at source
vertex **35 = (326,194)** and ends at vertex **59** (edges 35–58,
inclusive). The alternative wider review interval is vertices
30–60; the narrower fallback is vertices 40–55. Neither alternative
has been auto-granted political ownership. The candidate is on the
original inner bay bend that passes into the central dryland guide
vicinity, rather than claiming the entirety of the northeastern source
sector. Kharuun's actual sea access, harbor, drinkable water and future
port location remain open.

**Veyrholm:** The northwestern original contour runs through the
source-index wrap at 598 → 0, then ends at vertex 24 before Kharuun's
bay-frontage hypothesis. Its inland return uses geographically
varying turns and depths and does not enter the three C1-F interior
exclusion anchors. This is a materially different footprint from the
rejected uniform blue corridor. The 75–115 headland is still physically
complex and is **not** colored as an approved Veyrholm or Kharuun
territory. Veyrholm's prospective extension into that area must be
resolved from whole-coast continuity, not sector labels.

**Verdant:** The authored southern source arc follows the eastern and
southeastern promontory rather than mistaking it for Kharuun northern
coast. Anchors (345,388), (430,423) and (488,448) remain inside the
candidate. The existing river source remains uncalibrated; no river or
freshwater geometry was added.

**Auric:** The western source arc plus a broader, but still incomplete,
western-interior proposed footprint is distinct from Kharuun. Its
northern margin and central inland transitions are still partly
unassigned, not force-filled.

The vector geometry was read independently from immutable source Git
blob `9cd6752e9dbca00796e5f7c013066bb0e5a96175`, and all four
rings were evaluated against the same 599 vertices. A strict
source-vector geometry dry run reported **zero self-intersections,
zero pairwise crossing/ownership overlaps, zero interior return-edge
crossings through the original source contour** and all C1-F anchors
preserved. That does not constitute a native acceptance run.

## Evidence and open uncertainties

- The original `feature.coastline.first_world.part_10` is 599 edges
  exactly, with north-sector counts 90 / 106 / 114, and 289 other edges.
  The sector bins are descriptive source search windows only.
- The source-origin NE headland edges 75–114, bay transition 59–74
  and east/south edges 135–175 remain explicit investigation arcs.
  The index 135–175 segment is **not** Kharuun's presumed northern coast.
- Kharuun's tentative original coast start/end can still move after
  owner review. Red endpoint dots mark them in both SVG views.
- Mainland component-30's **79,419** terrain candidates and original
  C1-F's **26,795** unassigned candidates are preserved as baseline
  witnesses, not silently carried forward as new metrics. The C1-O
  native CLI reclassifies only component-30 cells by the new polygons
  and reports **new per-region counts, new remaining unassigned cells,
  any collision/out-of-source samples, and held detached cells**.
  These new exact raster totals are intentionally not guessed here.
- The 18 detached components, the large NE island as a whole unit,
  Shattercap, Coast 40 and the foreign Serathyl Windward parent are
  all unclaimed. No new region was added.
- Uncalibrated source colors do not certify biomes, elevation, land,
  ocean, streams, rivers, salt basins, wells, harbors or routes.
  The original source contour is a noncanonical geometric reference.
- The proposal does not modify world catalog files, saves, gameplay,
  legacy-hex infrastructure, routes, settlements, generation or
  regional production geometry. Publication remains disabled.

## Review artifacts

Committed source-vector review outputs (available even before native
rendering):

- `docs/design/kaelvar-c1o-regional-boundary-candidates-2026-11-14.json`
  contains original edge ranges, each inland waypoint, geographic
  justification, uncertainty and all holds.
- `docs/design/kaelvar-c1o-expanded-vector-review-2026-11-14.json`
  expands the original source-coordinate vertices for all four
  polygon rings and all investigative arcs. The new raster terrain
  totals are explicitly **null**, not invented.
- `docs/design/kaelvar-c1o-source-vector-review.svg`: vector-only
  overall candidate overview, original source mainland and held islands,
  anchor-guided region labels and north bay zoom.
- `docs/design/kaelvar-c1o-northern-source-index-review.svg`:
  separate enlarged exact-index view; candidate endpoints highlighted.

Native outputs from
`scripts/kaelvar-c1o-regional-boundaries.mjs`:

1. `kaelvar-c1o-regional-review.json` (**source raster candidate counts
   and expanded original edges**, requires native source PNG checks).
2. `kaelvar-c1o-regional-preview.svg` (large, source biome PNG embedded
   underneath transparent region polygons and vector coast).
3. `kaelvar-c1o-north-coast.svg` (separate enlarged, numbered original
   northern coast with source PNG and disputed boundaries).
4. `kaelvar-c1o-regional-preview.png` (2400 × 1858 source-biome-underlaid
   terrain-component preview, created with Node standard library PNG
   encoder without a third-party renderer).

The committed vector-only SVG is useful immediately, but does not
replace the **native source-PNG-underlaid** visual acceptance required
to judge ecology, relief, region placement or the disputed headland.

## Exact PowerShell 7 detached-worktree acceptance

Substitute the final reported C1-O SHA for
`<PIN_FINAL_C1O_SHA>`. Execute in PowerShell 7 on the Windows machine.
It neither switches nor cleans `C:\Codex\EoL`.

~~~powershell
$ErrorActionPreference = 'Stop'
$Repo = 'C:\Codex\EoL'
$Branch = 'connector/c1o-kaelvar-regional-boundary-candidates-2026-11-14'
$Parent = '8c317d48ef405ca29830d4dc4959ce21f07693bb'
$Sha = '<PIN_FINAL_C1O_SHA>'
$Wt = Join-Path $env:TEMP "lr-c1o-native-$($Sha.Substring(0,12))"
$Out = Join-Path $env:TEMP "lr-c1o-review-$($Sha.Substring(0,12))"

git -C $Repo fetch --no-tags origin "refs/heads/$Branch"
if ($LASTEXITCODE) { throw 'C1-O branch fetch failed' }
if ((git -C $Repo rev-parse FETCH_HEAD).Trim() -ne $Sha) {
  throw 'C1-O remote branch SHA drift'
}
if (Test-Path $Wt) { throw 'Detached worktree path already exists' }
git -C $Repo worktree add --detach $Wt $Sha
if ($LASTEXITCODE) { throw 'Detached worktree creation failed' }
New-Item -ItemType Directory -Force -Path $Out | Out-Null

Push-Location $Wt
try {
  foreach ($File in @(
    'scripts/lib/kaelvar-c1o-regional-boundaries.mjs'
    'scripts/kaelvar-c1o-regional-boundaries.mjs'
    'tests/unit/kaelvar-c1o-regional-boundaries.test.mjs'
    'scripts/lib/kaelvar-c1n-source-edge-atlas.mjs'
    'scripts/kaelvar-c1n-source-edge-atlas.mjs'
  )) {
    node --check $File
    if ($LASTEXITCODE) { throw "Syntax check failed: $File" }
  }

  $Tests = @(
    'tests/unit/kaelvar-c1f-placement-intent.test.mjs'
    'tests/unit/kaelvar-c1g-ecology-evidence.test.mjs'
    'tests/unit/kaelvar-c1h-source-diagnostics.test.mjs'
    'tests/unit/kaelvar-c1i-source-ink-separation.test.mjs'
    'tests/unit/kaelvar-c1j-vector-coastline-review.test.mjs'
    'tests/unit/kaelvar-c1k-coast-informed-boundary-review.test.mjs'
    'tests/unit/kaelvar-c1l-landmass-source-arc-review.test.mjs'
    'tests/unit/kaelvar-c1m-shore-intent-review.test.mjs'
    'tests/unit/kaelvar-c1n-source-edge-atlas.test.mjs'
    'tests/unit/kaelvar-c1o-regional-boundaries.test.mjs'
    'tests/unit/kaelvar-five-region-candidate-audit.test.mjs'
    'tests/unit/legacy-hex-forward-gate.test.mjs'
    'tests/unit/world-coordinate-geometry.test.mjs'
    'tests/unit/world-geographic-authority.test.mjs'
    'tests/unit/world-source-git-witness.test.mjs'
  )
  node --test @Tests
  if ($LASTEXITCODE) { throw 'C1-F through C1-O native test suite failed' }

  node scripts/check-no-new-hex-dependencies.mjs --check
  if ($LASTEXITCODE) { throw 'Zero-new-hex-dependency gate failed' }

  $Protected = @(
    'packages/content/base/world'
    'apps/rpg-ui/src'
    'packages/legacy-hex'
  )
  git diff --quiet $Parent $Sha -- @Protected
  if ($LASTEXITCODE) { throw 'Protected runtime or catalog paths changed' }

  $N = Join-Path $Out 'kaelvar-c1n-verified-report.json'
  $Json = Join-Path $Out 'kaelvar-c1o-regional-review.json'
  $Svg = Join-Path $Out 'kaelvar-c1o-regional-preview.svg'
  $North = Join-Path $Out 'kaelvar-c1o-north-coast.svg'
  $Png = Join-Path $Out 'kaelvar-c1o-regional-preview.png'
  node scripts/kaelvar-c1n-source-edge-atlas.mjs --check > $N
  if ($LASTEXITCODE) { throw 'Corrected C1-N native source verification failed' }
  node scripts/kaelvar-c1o-regional-boundaries.mjs --check > $Json
  if ($LASTEXITCODE) { throw 'C1-O raster/geometry report failed' }
  node scripts/kaelvar-c1o-regional-boundaries.mjs --svg > $Svg
  if ($LASTEXITCODE) { throw 'C1-O full source-backed SVG failed' }
  node scripts/kaelvar-c1o-regional-boundaries.mjs --north-svg > $North
  if ($LASTEXITCODE) { throw 'C1-O enlarged north SVG failed' }
  node scripts/kaelvar-c1o-regional-boundaries.mjs --png $Png
  if ($LASTEXITCODE) { throw 'C1-O high resolution PNG generation failed' }

  $Prior = Get-Content -Raw $N | ConvertFrom-Json
  $R = Get-Content -Raw $Json | ConvertFrom-Json
  if ($Prior.status -ne 'C1N_EXACT_SOURCE_EDGE_ATLAS_COMPLETE_FRONTAGE_REVIEW_HELD' -or
      $Prior.originalEdgesAccounted -ne 599 -or
      $Prior.closingEdgeReturnsToFirstVertex -ne $true -or
      $Prior.holds.canonicalWritable -ne $false) {
    throw 'Corrected C1-N acceptance report failed'
  }
  if ($R.status -ne 'C1O_REVERSIBLE_MAINLAND_POLYGON_CANDIDATES_BUILT_CANONICAL_HELD' -or
      $R.originalSourceEdgesConserved -ne 599 -or
      $R.sourcePngFingerprintsVerified -ne $true -or
      @($R.regionPolygonCandidates).Count -ne 4 -or
      $R.measurements.candidateMainlandTerrainCells -ne 79419 -or
      $R.measurements.remainingUnassignedMainlandTerrainCells -le 0 -or
      $R.measurements.previewAssignedMainlandTerrainCells -le 0 -or
      $R.diagnostics.polygonSelfIntersections -ne 0 -or
      $R.diagnostics.polygonOwnershipCollisions -ne 0 -or
      $R.diagnostics.polygonInlandSourceContourCrossings -ne 0 -or
      $R.diagnostics.reportedSourceContourCellsOutside -ne 0 -or
      $R.measurements.detachedPhysicalComponentsClaimed -ne 0 -or
      $R.holds.publication.canonicalWritable -ne $false) {
    throw 'C1-O geometric/terrain inventory or publication gate failed'
  }
  $K = @($R.regionPolygonCandidates |
    Where-Object { $_.regionId -eq 'region.kharuun_drylands' })[0]
  if (@($K.originalSourceEdgeIndices).Count -ne 24 -or
      $K.originalSourceEdgeIndices[0] -ne 35 -or
      $K.originalSourceEdgeIndices[-1] -ne 58) {
    throw 'Kharuun short north coast missing or changed'
  }
  foreach ($File in @($Svg,$North,$Png)) {
    if ((Get-Item $File).Length -lt 20000) {
      throw "Unexpectedly small visual artifact: $File"
    }
  }
  if (@(git status --porcelain).Count -ne 0) {
    throw 'Detached review worktree dirty'
  }
  if ((git rev-parse HEAD).Trim() -ne $Sha) {
    throw 'Detached review HEAD drift'
  }
  Write-Host 'C1-N CORRECTED NATIVE CHECK PASSED'
  Write-Host 'C1-O SOURCE-GROUNDED NONCANONICAL REGIONAL CANDIDATE GATES PASSED'
  $R.measurements | Format-List
  Write-Host "JSON:  $Json"
  Write-Host "SVG:   $Svg"
  Write-Host "NORTH: $North"
  Write-Host "PNG:   $Png"
} finally {
  Pop-Location
}
~~~

## Exit criteria and next handoff

**Review-authoring exit (C1-O code):** Four real polygon rings and Kharuun
short northern frontage are source-indexed; old uniform Veyrholm corridor
is absent; original source bytes, C1-F owner anchors and all island/
foreign source/publication holds survive. Static source-only SVGs and
expanded vertex JSON are committed.

**Native acceptance exit (pending):** Exact corrected C1-N test suite
passes; C1-O strict coordinate validation and component-30 raster
measurements pass with no overlap, offshore claims or unexpectedly
unassigned-free mainland; original PNGs match pinned fingerprints;
review JSON, two full-resolution SVGs and PNG render successfully;
zero new hex dependencies, clean detached HEAD and no protected
changes. Any failure is a **HOLD**, not a reason to publish
unreviewed geography.

**Owner map-review exit (pending):** Inspect actual PNG-backed C1-O
overlay and enlarged north panel for candidate Kharuun 35–58,
alternative 30–59 and 40–54, realistic Veyrholm inland depth and
transition at headland 75–115. Approve/modify those preview
geometries or leave them uncertain. A port, water source and route
remain separate future decisions.

**Next C1-P:** In the same landmass-first process, adjudicate the
Kharuun/Veyrholm inner-bay endpoints using owner-visible preview;
inspect the northeast headland as a distinct physical projection;
refine disjoint inland seams against source physical evidence while
retaining unassigned gaps. Whole detached island ownership and
canonical activation remain blocked until separately reviewed.
