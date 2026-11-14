# C1-H: source-referenced coastal-adjacency and raw-relief diagnostics

Date: 2026-11-13
Status: **SOURCE DIAGNOSTIC ONLY, NO PHYSICAL HYDROLOGY CERTIFIED, NATIVE ACCEPTANCE PENDING**

## Entry and acceptance

C1-G owner-native result at exact detached SHA
`ccbdcd41a48e48ffdd558a027bc55e808813e18f`:
**44/44 Node tests passed**, mainline five-region candidate pack preserved
40 million population, frozen legacy-hex scan checked 845 files
and found **zero newly introduced dependencies**, and read-only
C1-G reports completed. Verdict:
`C1-G NATIVE ECOLOGY EVIDENCE GATES PASSED; BORDERS AND SALT BASIN PLACEMENTS STILL HELD`.

This explicitly records C1-G owner-native completion, not border or
salt-basin approval. Retain the accepted C1-G and earlier draft PRs.
No merge or runtime activation is implied.

## What C1-H actually verifies

This is a **source diagnostic**, not certified physical hydrology.
It reuses the original registered biome and elevation PNGs only
after checking SHA-256, crop, image dimension, and the exact committed
vector Git blob. It checks C1-F place guide source pixels and validates
C1-G ecological evidence records before any read-only reporting.

The diagnostic measures:
1. Four-neighbor adjacency from main terrain-candidate component #30
   (79,419 pixels) to **independently matched blue pixels present in BOTH
   source PNG layers**. Both layers must have identical RGB and alpha.
   These blue pixels are *unresolved*: **ocean, lakes, rivers, coastline
   artwork or linework are not distinguished**. Contact does not prove
   coastline, land/water ownership, a ford, freshwater, or navigability.
2. Optional source-pixel distance from such blue adjacency, confined to
   terrain-candidate component #30, never extended across detached
   islands. This is pixel topology for review only, **not a fixed-width
   political border** or approved travel distance.
3. Per C1-F preview region: raw source-adjacent pixels, relative
   brightness p10/median/p90 sampled from original *elevation
   illustration*. The uncalibrated brightness is neither altitude in
   meters nor evidence of a hydraulic depression.
4. Five north-coast coordinate transects, labeling source-candidate
   Veyrholm and Kharuun guide intervals for visual checking against
   the registered art. They are **descriptive samples**, not border
   coordinates, surveyed coastlines or authoritative ocean frontage.
5. An SVG comparing original biome, source-blue adjacency and candidate
   coast/dryland overlays, and original elevation art. No conjectural
   salt basin dot is drawn and no raw polygon envelope overlays water.

The owner-approved intent remains: Veyrholm normally occupies a
variable-width continuous north-coast ribbon where source landforms
allow; a short dry Kharuun ocean frontage is conditional on actual
geographic evidence. The Kharuun Salt Basins, Tirash Saltworks, and
four Veyrholm habitats remain existing unplaced C0 design records.
This stage does not materialize a new basin or coastline.

## Why this cannot yet prove drainage or a saltpan

There is no independently verified sea-vs-river layer, height ramp
(calibrated contour or height-to-meter function), hydrologic sink,
groundwater, precipitation/evaporation model, or mineral substrate.
Therefore no drainage direction, closed basin, rain shadow, evaporite
deposit, port, sea-route, freshwater source, oasis or seasonal salt
harvest site may be derived by this stage. Simple painted yellow land
is not a certified desert or salt flat.

For real basin proposal, a future source-independent calibration
workflow must first establish ocean/river/ink separation, meter-linked
elevation or defensible relative contours, inward-facing closed
drainage, geologic soluble-salt source and an actual water balance.
Until then all sixteen C1-G evidence items are still UNVERIFIED.

## Stage gates

| Gate | Entry | Pass | HOLD |
| --- | --- | --- | --- |
| H0 owner-native C1-G | exact C1-G SHA results | 44/44 tests, 845 code files, zero legacy additions | invalid prior gates |
| H1 source registration | C1/C1-F PNGs, vector Git blob | exact hashes, dimensions, crop, original 201-footprint mainline | image drift |
| H2 topology | independent blue source / terrain component #30 | reproducible, disjoint blue/terrain masks, zero island allocation | implicit ocean truth or wrong component |
| H3 raw image trend | source elevation pixels | brightness histogram with explicit 0–255 uncalibrated units | meters, flow or sink inference |
| H4 guided review | original owner C1-F placements | coast transects and compare SVG, gaps allowed | auto-filling or claimed Kharuun sea port |
| H5 native & CI | pinned C1-H commit, protected catalog | unit suites and CLI + clean worktree | drift, new hex dependency, source changes |
| H6 watershed/border placement | **future gate, NOT entered** | independent topography/river/ink/evaporite evidence + owner approval | auto lake, salt basin or sovereign border |

## Read-only owner PowerShell 7 verification

Use a new clean, detached, exact-SHA worktree, not the primary
`C:\Codex\EoL` checkout. Fill in the final C1-H
branch SHA after remote readback.

```powershell
$ErrorActionPreference = 'Stop'
$Repo = 'C:\Codex\EoL'
$Branch = 'connector/c1h-kaelvar-source-landform-diagnostics-2026-11-13'
$Sha = '<EXACT_C1H_SHA>'
$Parent = 'ccbdcd41a48e48ffdd558a027bc55e808813e18f'
$Wt = Join-Path $env:TEMP ('lr-c1h-native-' + $Sha.Substring(0,12))
$Out = Join-Path $env:TEMP ('lr-c1h-source-' + $Sha.Substring(0,12))
git -C $Repo fetch --no-tags origin "refs/heads/$Branch"
if ($LASTEXITCODE -ne 0) { throw 'Fetch failed' }
if ((git -C $Repo rev-parse FETCH_HEAD).Trim() -ne $Sha) { throw 'Remote SHA drift' }
if (Test-Path $Wt) { throw 'Worktree already exists' }
git -C $Repo worktree add --detach $Wt $Sha
if ($LASTEXITCODE -ne 0) { throw 'Worktree creation failed' }
Push-Location $Wt
try {
  node --check scripts/lib/kaelvar-c1h-source-diagnostics.mjs
  if ($LASTEXITCODE) { throw 'Library parse failure' }
  node --check scripts/kaelvar-c1h-source-review.mjs
  if ($LASTEXITCODE) { throw 'CLI parse failure' }
  node --test tests/unit/kaelvar-c1h-source-diagnostics.test.mjs
  if ($LASTEXITCODE) { throw 'C1-H unit tests failed' }
  node scripts/kaelvar-c1h-source-review.mjs --check
  if ($LASTEXITCODE) { throw 'C1-H source registration failed' }
  node scripts/check-no-new-hex-dependencies.mjs --check
  if ($LASTEXITCODE) { throw 'No-new-hex gate failed' }
  git diff --quiet $Parent $Sha -- packages/content/base/world
  if ($LASTEXITCODE) { throw 'Protected catalog changed' }
  New-Item -ItemType Directory -Force -Path $Out | Out-Null
  $Report = Join-Path $Out 'kaelvar-c1h-source-diagnostic.json'
  $Svg = Join-Path $Out 'kaelvar-c1h-source-comparison.svg'
  node scripts/kaelvar-c1h-source-review.mjs --check > $Report
  if ($LASTEXITCODE) { throw 'Source report generation failed' }
  node scripts/kaelvar-c1h-source-review.mjs --svg > $Svg
  if ($LASTEXITCODE) { throw 'Source SVG generation failed' }
  $Result = Get-Content $Report -Raw | ConvertFrom-Json
  if ($Result.status -ne 'C1H_REGISTERED_SOURCE_DIAGNOSTIC_COMPLETE_PHYSICAL_INTERPRETATION_HELD' -or
      $Result.previewEvidence.mainCandidateCells -ne 79419 -or
      $Result.previewEvidence.unassignedCandidateCells -ne 26795 -or
      $Result.interpretationHolds.canonicalWritable -ne $false -or
      $Result.interpretationHolds.closedDrainageVerified -ne $false -or
      $Result.interpretationHolds.saltpanCoordinatesPublished -ne 0) {
    throw 'Evidence, terrain or publication hold failed'
  }
  if ((Get-Item $Svg).Length -lt 100000) { throw 'SVG unexpectedly small' }
  if (@(git status --porcelain).Count -ne 0) { throw 'Detached worktree changed' }
  if ((git rev-parse HEAD).Trim() -ne $Sha) { throw 'Verification SHA changed' }
  Write-Host 'C1-H SOURCE DIAGNOSTIC NATIVE GATES PASSED'
  Write-Host 'OCEAN FRONTAGE, WATERSHEDS AND SALT BASIN PLACEMENTS STILL HELD'
  Write-Host "Report: $Report"
  Write-Host "SVG: $Svg"
} finally { Pop-Location }
```

Do not overwrite previous verification outputs. Return the exact
report and SVG for review. This segment needs no animation or
fictional environmental shading.
