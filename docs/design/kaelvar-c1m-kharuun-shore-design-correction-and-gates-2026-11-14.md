# C1-M: correct the Kharuun northern coastline and reject the Veyrholm ribbon

Date: 2026-11-14
Status: **OWNER DESIGN CORRECTION ACCEPTED; EXACT FRONTAGE, CITY AND CANONICAL GEOMETRY HELD**

## What C1-L established

The owner ran C1-L at exact detached SHA
7f42edd5dd2d7e87bf434091df610352956d4316
in a clean PowerShell 7 worktree. All **79/79 unit tests passed**,
860 files were scanned with **zero new legacy hex dependencies**,
original source edges remained fully accounted, and read-only
JSON/SVG outputs were generated. This accepts the technical source
crosswalk but not the political-geography interpretation.

The owner's new visual inspection of that SVG identifies a
specific misrepresentation: the legacy Veyrholm northern corridor
is not the geographic shoreline. Its guide rim and the white
guide-to-guide dashed connectors are review scaffolding, not
the north mainland political border.

**New positive design decision:** Kharuun Drylands DOES HAVE a
small real northern shoreline. A coastal city or port is an
acceptable future **concept** on that coast, subject to geographic,
freshwater, harbor and travel evidence. This **supersedes the old
C1-G default that Kharuun has no sea frontage at the design-intent
level only**. Exact coast source segments, extent, boundaries,
harbor site and political publication are still pending.

This owner acceptance must not be turned into the automatic
claim that all 114 northeastern vector edges are Kharuun, or
into coordinates for a port. The coastline source still
requires independent interpretation; old vector association
with the ocean region is not sovereign identity.

## What changes in this branch

The stage is an explicit **semantic correction**, not a redraw
of accepted source bytes or a runtime feature launch.

- The correction contract is
  docs/design/kaelvar-c1m-owner-shore-correction-2026-11-14.json.
  It records Kharuun shore existence as approved *design intent*,
  rejects the old Veyrholm corridor as a political border,
  and keeps all geometry and port placement fields null.
- The library is scripts/lib/kaelvar-c1m-shore-intent-review.mjs.
  It rejects reverting the owner's Kharuun shoreline decision
  or publishing invented coast segments, settlement, route,
  ownership or islands.
- The CLI is scripts/kaelvar-c1m-shore-intent-review.mjs.
  It first reruns C1-L native source verification. The JSON
  report distinguishes positive owner geography from missing
  exact coastline. The SVG uses the original C1-J registered
  biome image and source contours, *without displaying the
  inaccurate blue/yellow C1-F preview masks or C1-K ribbon
  guides as territory*. Its coastal concept text is intentionally
  **not pinned to any map coordinate**.
- The unit tests are
  tests/unit/kaelvar-c1m-shore-intent-review.test.mjs.
  They test positive shore existence, retired ribbon,
  missing source indices, port and ferry locks, foreign
  Windward identity, 26,795 unassigned terrain candidates
  and original 599-edge accounting.

## Five-region geography at this checkpoint

| Region | Owner geographic role | Status |
| --- | --- | --- |
| Auric Marches | Western steppe, mineral frontier | Earlier placement intent unchanged |
| Kharuun Drylands | Central arid mainland **with a small real northern seacoast** | Shore exists as design; frontage and port unplaced |
| Verdant Thalos | Southern wooded and fertile peninsula, including SE promontory | Southern anchor safeguards preserved |
| Veyrholm Shore | Northern coastal landforms with variable inland reach, **not a continuous uniform ribbon** | Previous corridor rejected, actual border undrawn |
| Shattercap Isles | Separately identifiable detached whole islands | All island ownership still held |

Unassigned terrain candidates remain **26,795** of 79,419
mainland source candidates. All 18 detached terrain candidates
remain unclaimed. The northeastern large island stays a whole
unclaimed geographic unit. Coast 40 remains a separate disputed
historical region-source interpretation, and Windward Spine
remains Serathyl-owned.

No sea route, fishing harbor, coastal city coordinate, shipyard,
freshwater source, salt basin, ocean certification or new population
center is approved or published. Kharuun's existing conceptual
Tirash Saltworks remains an *inland salt-basin hypothesis*, not
the coastal port. No change to world regions, world geometry,
localities, settlements, runtime, saves, routes, spawns or legacy
hex infrastructure.

## What must happen before proposing new polygons

**M0**: verify the exact C1-L predecessor and locked source hashes.
**M1**: render an uncluttered original source coastline without
the rejected Veyrholm ribbon.
**M2**: confirm the owner accepts Kharuun's small shore, while
rejecting automatic attribution of all northeastern coast.
**M3**: mark the Kharuun frontage's actual source-edge start/end
on the *source-derived coast*, with a visually reviewed
land/sea and physical parent interpretation.
**M4**: separately draw the true uneven Veyrholm inland limits
and Kharuun/Veyrholm transition, accounting for relief and
other existing regional guides. Do not generate equal-width
shoreline bands or connect shortest gap witnesses as borders.
**M5**: produce reversible four-mainland-region polygon proposals
after M3-M4, only with verified source reference and explicit
owner review. The fifth child, Shattercap, requires a separate
whole-island ownership review.
**M6**: a coastal port is an unplaced option until its shoreline
location, sheltered landing, reliable freshwater, settlement
viability and explicit travel routes are approved.

## PowerShell 7 native acceptance

Pin the final commit SHA and create a new *detached* worktree.
Do not alter the existing dirty checkout at C:\Codex\EoL.

    $ErrorActionPreference='Stop'
    $Repo='C:\Codex\EoL'
    $Branch='connector/c1m-kharuun-shore-design-correction-2026-11-14'
    $Sha='<EXACT_C1M_SHA>'
    $Parent='7f42edd5dd2d7e87bf434091df610352956d4316'
    $Wt=Join-Path $env:TEMP "lr-c1m-native-$($Sha.Substring(0,12))"
    $Out=Join-Path $env:TEMP "lr-c1m-review-$($Sha.Substring(0,12))"
    git -C $Repo fetch --no-tags origin "refs/heads/$Branch"
    if ($LASTEXITCODE) { throw 'Fetch failed' }
    if ((git -C $Repo rev-parse FETCH_HEAD).Trim() -ne $Sha) { throw 'Remote drift' }
    if (Test-Path $Wt) { throw 'Worktree exists' }
    git -C $Repo worktree add --detach $Wt $Sha
    if ($LASTEXITCODE) { throw 'Worktree add failed' }
    Push-Location $Wt
    try {
      node --check scripts/lib/kaelvar-c1m-shore-intent-review.mjs
      if ($LASTEXITCODE) { throw 'Library syntax failed' }
      node --check scripts/kaelvar-c1m-shore-intent-review.mjs
      if ($LASTEXITCODE) { throw 'CLI syntax failed' }
      node --test tests/unit/kaelvar-c1m-shore-intent-review.test.mjs
      if ($LASTEXITCODE) { throw 'New unit tests failed' }
      node scripts/check-no-new-hex-dependencies.mjs --check
      if ($LASTEXITCODE) { throw 'Legacy-hex gate failed' }
      git diff --quiet $Parent $Sha -- packages/content/base/world
      if ($LASTEXITCODE) { throw 'Active world content changed' }
      New-Item -ItemType Directory -Force -Path $Out | Out-Null
      $Json=Join-Path $Out 'kaelvar-c1m-shore-review.json'
      $Svg=Join-Path $Out 'kaelvar-c1m-shore-review.svg'
      node scripts/kaelvar-c1m-shore-intent-review.mjs --check > $Json
      if ($LASTEXITCODE) { throw 'Review JSON failed' }
      node scripts/kaelvar-c1m-shore-intent-review.mjs --svg > $Svg
      if ($LASTEXITCODE) { throw 'Review SVG failed' }
      $R=Get-Content -Raw $Json | ConvertFrom-Json
      if ($R.status -ne 'C1M_KHARUUN_SHORE_INTENT_RECORDED_MAP_FRONTAGE_UNPLACED' -or
          $R.kharuunShoreExistence -ne 'OWNER_ACCEPTED_DESIGN_GEOGRAPHY' -or
          $R.coastlineSourceEdgeInventory -ne 599 -or
          $R.historicNortheasternCompetingSourceEdges -ne 114 -or
          $R.oldVeyrholmCorridor -ne 'REJECTED_AS_POLITICAL_BOUNDARY' -or
          $R.approval.canonicalWritable -ne $false) {
        throw 'Shoreline design/geometry boundary drift'
      }
      if ((Get-Item $Svg).Length -lt 100000) { throw 'SVG too small' }
      if (@(git status --porcelain).Count -ne 0) { throw 'Worktree dirty' }
      if ((git rev-parse HEAD).Trim() -ne $Sha) { throw 'HEAD drift' }
      Write-Host 'C1-M KHARUUN NORTHERN SHORE DESIGN CORRECTION PASSED'
      Write-Host 'EXACT COAST, VYERHOLM BORDERS AND PORT STILL UNPLACED'
      Write-Host "Report: $Json"
      Write-Host "SVG: $Svg"
    } finally { Pop-Location }

The branch is intentionally not merged or published.
The next geometric decision uses actual reviewed source coasts,
not a line across the water or a narrow ribbon sketched by coordinates.
