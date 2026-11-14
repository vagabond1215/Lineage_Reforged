# C1-K: source coastline exterior reference and separate inland guide review

Date: 2026-11-14
Status: **REVIEW-ONLY / CANONICAL REGION BORDERS HELD**

## Entry

The owner verified C1-J at exact detached commit
9ece169f29c4560603060607aeb3d66abf09e08d, reporting **66/66 native
tests passing**, zero new legacy-hex dependencies, and a successful
source vector/PNG audit. This accepts *source provenance*, not regional
ownership or ocean, river, elevation, salt or inland boundary semantics.

The original immutable mainland vector
feature.coastline.first_world.part_10 preserves **599 source edges**.
Three north review windows account for **90 NW / 106 north-central /
114 northeast** original segments; **289** remain outside those
windows. The vector association with region.azure_vast describes a
source ocean-region association, not Kaelvar sovereignty.

## C1-K review method

The next boundary step has two deliberately separate layers.

**Exterior evidence layer:** preserve all 599 original edge indices,
endpoints and the closing edge without smoothing or new vertices.
For each northern sector, count exact source edge midpoints inside
each C1-F draft guide polygon; explicitly list unmatched edge indices.
These intersections are *raw guide coincidences*, not approved
shoreline, coast ownership, ocean contact or terrain certification.
The northeastern segment remains a Veyrholm/Kharuun competition even
if one guide currently intersects the vector.

**Inland interface layer:** keep the four existing nonoverlapping
mainland authoring guides. Measure shortest gaps between their
original guide outlines for these review pairs:
Auric/Veyrholm, Kharuun/Veyrholm, Auric/Kharuun and Kharuun/Verdant.
The reported points are closest-points-on-guide witnesses, not a
straight political boundary, approved adjacency or a route.
The source contour is *not* made a regional boundary by this step.

**Artifacts on this isolated branch:**

- docs/design/kaelvar-c1k-coast-informed-boundary-review-2026-11-14.json
  pins the source hierarchy, four interface pairs and all holds.
- scripts/lib/kaelvar-c1k-coast-informed-boundary-review.mjs
  checks the contract and performs read-only source/guide measurements.
- scripts/kaelvar-c1k-boundary-review.mjs emits JSON or a review SVG,
  inheriting C1-J's original source PNG, full coast outline, held
  offshore contours and distinct Thalos river witness. The center
  panel highlights unmatched NW/NC original source edges. The right
  panel adds the dashed mainland guide rims and gap connectors.
- tests/unit/kaelvar-c1k-coast-informed-boundary-review.test.mjs
  rejects shoreline/region promotion, island attribution,
  altered adjacency and missing/duplicated original source edges.

C1-F's **79,419** terrain-only mainland candidate cells and
**26,795 unassigned** cells remain unchanged. No topology-based
fill is attempted. Island ownership and any canonical footprint
geometry remain null.

## Hard holds and decision sequence

| Stage | Success condition | Failure or continued hold |
| --- | --- | --- |
| K0 predecessor | Exact pinned C1-J artifact and native evidence | Source, trace or PNG hash drift |
| K1 exterior | All 599 original source edges accounted 90/106/114/289 | Smoothing, clipping or source edge promotion to approved shore |
| K2 northern review | Draft midpoint counts and unmatched original indices | NE competition classified as final Kharuun/Veyrholm shore |
| K3 inland seam review | Four measured disjoint guide gaps | Shortest witnesses mistaken for authored borders or routes |
| K4 inherited geometry | Unassigned mainland, original islands, foreign source and salt holds survive | Forced gap fill, arbitrary island split, direct Kharuun port, salt basin |
| K5 native acceptance | Unit tests, JSON, SVG, legacy gate, clean detached worktree | Failed run or unapproved active world publication |

Continue visually by marking on the C1-K SVG which original
coast segments plausibly bound Veyrholm, whether Kharuun receives
an independently supported dry shore, and where the four inland
interfaces must bend along real terrain. **Do not use an equal-width
coast buffer or shortest guide-gap connectors as borders.**
The remaining 289 source edges include large portions of the
mainland exterior; they are not absent or assigned by default.

The large northeastern island remains an **unclaimed whole-unit
hypothesis**. Shattercap's detached candidates likewise remain
unallocated. Keep the historic Coast 40 conflict distinct from
vector coastline part_40; Serathyl Windward stays Serathyl.
Salt pans remain design intent without confirmed closed-basin
drainage, relief, water or basin coordinates. No new active
region/locality/settlement/route/spawn/Save record or hex catalog
is created or modified.

## PowerShell 7 native verification

Use a **new** detached worktree at exact remote C1-K head.
Do not clean, reset, stash or switch the existing primary
checkout at C:\Codex\EoL.

    $ErrorActionPreference='Stop'
    $Repo='C:\Codex\EoL'
    $Branch='connector/c1k-kaelvar-coast-informed-boundary-review-2026-11-14'
    $Sha='<PIN_FINAL_C1K_SHA>'
    $Parent='9ece169f29c4560603060607aeb3d66abf09e08d'
    $Wt=Join-Path $env:TEMP "lr-c1k-native-$($Sha.Substring(0,12))"
    $Out=Join-Path $env:TEMP "lr-c1k-review-$($Sha.Substring(0,12))"
    git -C $Repo fetch --no-tags origin "refs/heads/$Branch"
    if ($LASTEXITCODE) { throw 'Fetch failed' }
    if ((git -C $Repo rev-parse FETCH_HEAD).Trim() -ne $Sha) { throw 'Remote SHA drift' }
    if (Test-Path $Wt) { throw 'Worktree already exists' }
    git -C $Repo worktree add --detach $Wt $Sha
    if ($LASTEXITCODE) { throw 'Worktree creation failed' }
    Push-Location $Wt
    try {
      node --check scripts/lib/kaelvar-c1k-coast-informed-boundary-review.mjs
      if ($LASTEXITCODE) { throw 'Library syntax failed' }
      node --check scripts/kaelvar-c1k-boundary-review.mjs
      if ($LASTEXITCODE) { throw 'CLI syntax failed' }
      node --test tests/unit/kaelvar-c1k-coast-informed-boundary-review.test.mjs
      if ($LASTEXITCODE) { throw 'C1-K unit tests failed' }
      node scripts/check-no-new-hex-dependencies.mjs --check
      if ($LASTEXITCODE) { throw 'New legacy-hex dependency' }
      git diff --quiet $Parent $Sha -- packages/content/base/world
      if ($LASTEXITCODE) { throw 'Protected active world data changed' }
      New-Item -ItemType Directory -Force -Path $Out | Out-Null
      $ReportPath=Join-Path $Out 'kaelvar-c1k-boundary-report.json'
      $SvgPath=Join-Path $Out 'kaelvar-c1k-boundary-review.svg'
      node scripts/kaelvar-c1k-boundary-review.mjs --check > $ReportPath
      if ($LASTEXITCODE) { throw 'C1-K report generation failed' }
      node scripts/kaelvar-c1k-boundary-review.mjs --svg > $SvgPath
      if ($LASTEXITCODE) { throw 'C1-K SVG generation failed' }
      $Report=Get-Content -Raw $ReportPath | ConvertFrom-Json
      if ($Report.status -ne 'C1K_COAST_REFERENCED_INLAND_REVIEW_COMPLETE_PUBLICATION_HELD' -or
          $Report.originalSourceEdges -ne 599 -or
          $Report.northernSourceEdges -ne 310 -or
          $Report.remainingOriginalSourceEdges -ne 289 -or
          $Report.inheritedUnassignedMainlandCandidateCells -ne 26795 -or
          @($Report.provisionalInlandInterfaceGaps).Count -ne 4 -or
          $Report.geographicPublication.canonicalWritable -ne $false) {
        throw 'C1-K source or publication gate failed'
      }
      if ((Get-Item $SvgPath).Length -lt 100000) { throw 'SVG unexpectedly small' }
      if (@(git status --porcelain).Count -ne 0) { throw 'Detached worktree dirty' }
      if ((git rev-parse HEAD).Trim() -ne $Sha) { throw 'Pinned HEAD drift' }
      Write-Host 'C1-K NATIVE SOURCE-COAST / INLAND REVIEW GATES PASSED'
      Write-Host 'ALL REGION, RIVER, SALT, ISLAND AND CANONICAL HOLDS RETAINED'
      Write-Host "Report: $ReportPath"
      Write-Host "SVG: $SvgPath"
    } finally { Pop-Location }

No source contour or guide correlation is permission to publish
a canonical political border. Owner review of the new SVG is
the next semantic gate.
