# C1-N: exact source-edge index atlas for the limited Kharuun north coast

Date: 2026-11-14
Status: **REVIEW-ONLY ATLASES, OWNER EXACT-FRONTAGE SELECTION PENDING**

## Accepted entry

Owner-native verification at the exact C1-M commit
95e871700ef0e1b992990bbd9e942092293520ea reported
**87/87 tests passed**, **zero new hex dependencies**
in 863 scanned source files, successful JSON/SVG generation and a clean
detached worktree. The owner supplied a screenshot of the C1-M SVG.
The screenshot verifies that the false blue Veyrholm ribbon is absent;
it does **not** show authored political boundary geometry or pick a
specific source-vector segment for Kharuun.

The browser tab connector's current available tabs did not include
the owner's local file:// SVG. The source vector was independently
read from its immutable Git blob, and the exact source contour
begins at reference coordinate (394,130). The original source
C1-J/K/L/M safeguards remain binding.

## Purpose

The owner's accepted geographic intent is **positive**: Kharuun
Drylands has a *small northern shoreline*, and a future coastal
city or port is possible. The rejected old Veyrholm band was only
an inland corridor guide and does not approximate the true coast.
However, a correct political border requires deciding which actual
original coast edges Kharuun reaches, and where the real inland
Veyrholm/Kharuun transition occurs.

C1-N provides a **read-only index atlas** in three views:

1. Whole original mainland and protected detached islands.
2. Wide northern original source coast with every tenth source
   vertex/edge index marked in the viewport.
3. Magnified northeast with every fifth original source
   vertex/edge index marked in the viewport.

The full original vector contour has **599 edges**, including
the closing edge 598 -> 0. It is never smoothed, clipped,
interpolated or rewritten. The map background is the original,
Git-registered biome PNG read through the already verified C1-J
review. All three views retain the registered coordinate frame
without distorting their aspect ratio. The original detached
source traces are visually distinct and never claimed.

## Exact review-sector indices

The old C1-J rectangle-defined review sectors cross the cyclic
original source coastline. C1-N recovers and verifies the actual
source-edge index ranges:

| Source review class | Original edge indices | Count |
| --- | --- | ---: |
| Northwest | 459–466, 471–552 | 90 |
| North-central | 553–598, then 0–59 (single cyclic run) | 106 |
| Northeast | 60–149 and 154–177 | 114 |
| Other / not reviewed as northern coast | Remaining edges | 289 |
| Total | All indices 0–598, exactly once | **599** |

**Crucial:** The source-window category is a descriptive inspection
classification, not a Kharuun, Veyrholm, ocean or mainland political
claim. The northeastern 114-edge set is NOT an approved Kharuun coast.
The owner's accepted limited Kharuun shore is not represented by a
guessed start/end point or source index list here.

## Added files

- docs/design/kaelvar-c1n-indexed-north-coast-atlas-2026-11-14.json:
  frozen source counts, viewports, zoom-label cadence, owner design
  and all political publication holds.
- scripts/lib/kaelvar-c1n-source-edge-atlas.mjs: source-native index
  crosswalk, cyclic run verification and unmodified coordinate rows.
- scripts/kaelvar-c1n-source-edge-atlas.mjs: read-only JSON report
  and source-backed three-panel SVG with original edge numbers.
- tests/unit/kaelvar-c1n-source-edge-atlas.test.mjs: exact index
  continuity, original endpoints, zoom markers, island/port/region holds.
- This design and native handoff document.

## Unchanged inherited restrictions

The C1-M accepted Kharuun coast existence and rejection of the
fake Veyrholm ribbon remain true. The exact coast source-edge
ownership, inland regional divisions and coastal city/port
coordinates remain **null**. Do not infer potable water, a sheltered
harbor, ocean calibration, trade route, ferry or port settlement.

Of the 79,419 source terrain candidate mainland cells,
**26,795 remain unassigned**. The 18 detached candidates remain
unclaimed and the large northeastern island must remain whole.
Keep foreign Windward under Serathyl; Coast 40 remains disputed;
no salt-basin geometry, wells or rivers can be generated.
No active world catalog, region, settlement, route, spawn, Save or
legacy hex file changes in C1-N.

## Stage gates

| Gate | Pass | Failure / hold |
| --- | --- | --- |
| N0 parent | Exact verified C1-M source audit and PNG fingerprint | C1-M owner shore acceptance or old ribbon policy regresses |
| N1 trace | Original 599 source edges indexed once and unchanged | Missing, duplicate or modified endpoints |
| N2 source windows | 90/106/114/289 with exact cyclic NC and two NE runs | Assumed index monotonicity or automated Kharuun claim |
| N3 atlas | Three aspect-preserved image panels, exact vertex labels | Invented points, distorted image or unverified background |
| N4 sovereignty | Null Kharuun/Veyrholm edge indices; no port, island, salt or region claims | Any geographic publication |
| N5 native | Node syntax and targeted tests, JSON, SVG, zero new hex dependency, exact HEAD clean | Failed process or source drift |
| N6 owner review | Annotate precise original edge start/end of short Kharuun north frontage | Unreviewed owner choice |
| N7 true draft region polygons | Future source-following unequal four-mainland-region proposal, plus separate Shattercap islands | Auto-snapping or forcing unassigned land |

### PowerShell 7 exact-HEAD native verification

Use a new detached worktree, not the dirty primary C:\Codex\EoL.

    $ErrorActionPreference='Stop'
    $Repo='C:\Codex\EoL'
    $Branch='connector/c1n-kaelvar-indexed-north-coast-atlas-2026-11-14'
    $Sha='<PIN_C1N_FINAL_SHA>'
    $Parent='95e871700ef0e1b992990bbd9e942092293520ea'
    $Wt=Join-Path $env:TEMP "lr-c1n-native-$($Sha.Substring(0,12))"
    $Out=Join-Path $env:TEMP "lr-c1n-review-$($Sha.Substring(0,12))"
    git -C $Repo fetch --no-tags origin "refs/heads/$Branch"
    if ($LASTEXITCODE) { throw 'Fetch failed' }
    if ((git -C $Repo rev-parse FETCH_HEAD).Trim() -ne $Sha) { throw 'Remote SHA drift' }
    if (Test-Path $Wt) { throw 'Worktree exists' }
    git -C $Repo worktree add --detach $Wt $Sha
    if ($LASTEXITCODE) { throw 'Worktree add failed' }
    Push-Location $Wt
    try {
      node --check scripts/lib/kaelvar-c1n-source-edge-atlas.mjs
      if ($LASTEXITCODE) { throw 'Library syntax failed' }
      node --check scripts/kaelvar-c1n-source-edge-atlas.mjs
      if ($LASTEXITCODE) { throw 'CLI syntax failed' }
      $Tests=@(
        'tests/unit/kaelvar-c1f-placement-intent.test.mjs'
        'tests/unit/kaelvar-c1g-ecology-evidence.test.mjs'
        'tests/unit/kaelvar-c1h-source-diagnostics.test.mjs'
        'tests/unit/kaelvar-c1i-source-ink-separation.test.mjs'
        'tests/unit/kaelvar-c1j-vector-coastline-review.test.mjs'
        'tests/unit/kaelvar-c1k-coast-informed-boundary-review.test.mjs'
        'tests/unit/kaelvar-c1l-landmass-source-arc-review.test.mjs'
        'tests/unit/kaelvar-c1m-shore-intent-review.test.mjs'
        'tests/unit/kaelvar-c1n-source-edge-atlas.test.mjs'
        'tests/unit/kaelvar-five-region-candidate-audit.test.mjs'
        'tests/unit/legacy-hex-forward-gate.test.mjs'
        'tests/unit/world-coordinate-geometry.test.mjs'
        'tests/unit/world-geographic-authority.test.mjs'
        'tests/unit/world-source-git-witness.test.mjs'
      )
      node --test @Tests
      if ($LASTEXITCODE) { throw 'Tests failed' }
      node scripts/check-no-new-hex-dependencies.mjs --check
      if ($LASTEXITCODE) { throw 'New hex coupling found' }
      git diff --quiet $Parent $Sha -- packages/content/base/world
      if ($LASTEXITCODE) { throw 'Protected active world data changed' }
      New-Item -ItemType Directory -Force -Path $Out | Out-Null
      $Json=Join-Path $Out 'kaelvar-c1n-source-edge-report.json'
      $Svg=Join-Path $Out 'kaelvar-c1n-source-edge-atlas.svg'
      node scripts/kaelvar-c1n-source-edge-atlas.mjs --check > $Json
      if ($LASTEXITCODE) { throw 'Source edge report failed' }
      node scripts/kaelvar-c1n-source-edge-atlas.mjs --svg > $Svg
      if ($LASTEXITCODE) { throw 'Source edge SVG failed' }
      $Report=Get-Content -Raw $Json | ConvertFrom-Json
      if ($Report.status -ne 'C1N_EXACT_SOURCE_EDGE_ATLAS_COMPLETE_FRONTAGE_REVIEW_HELD' -or
          $Report.originalEdgesAccounted -ne 599 -or
          $Report.closingEdgeReturnsToFirstVertex -ne $true -or
          $Report.countsBySourceInspectionSector.NORTHEAST_ORIGINAL_SOURCE_REVIEW -ne 114 -or
          @($Report.labelsForReviewPanels).Count -ne 3 -or
          $Report.acceptedDesignIntent.kharuunHasLimitedNorthernShore -ne $true -or
          $Report.holds.canonicalWritable -ne $false) {
        throw 'C1-N source indexing or hold gate failed'
      }
      if ((Get-Item $Svg).Length -lt 100000) { throw 'Source SVG unexpectedly small' }
      if (@(git status --porcelain).Count -ne 0) { throw 'Detached worktree dirty' }
      if ((git rev-parse HEAD).Trim() -ne $Sha) { throw 'HEAD drift' }
      Write-Host 'C1-N EXACT SOURCE INDEX ATLAS GATES PASSED'
      Write-Host 'KHARUUN SHORE EXISTENCE ACCEPTED; EXACT FRONTAGE AND CANONICAL BORDERS HELD'
      Write-Host "Report: $Json"
      Write-Host "SVG: $Svg"
    } finally { Pop-Location }

The **next real authoring decision** is now tractable: mark the
desired short Kharuun coastal frontage by edge numbers on the
N panel, then inspect the Kharuun/Veyrholm inland region transition.
Only after source/owner review should these vertices be converted
into reversible draft polygons. An approved port site is a later
and separate decision.
