# C1-J: exact-source vector coastline review, north sector crosswalk and hydrography hold

Date: 2026-11-13
Status: **READ-ONLY SOURCE CONTOURS, NOT APPROVED COASTLINES OR REGIONAL BORDERS**

## Accepted predecessor

C1-I owner-native PowerShell verified at exact detached SHA
`78dca6f777fbec1423ffdd0229b8c432cb30a388`:
**58/58 tests passed**, 851 code files scanned with **zero new
hex dependencies**, original source image and vector hash audits
passed, diagnostic SVG generated, and the detached worktree was clean.
This accepts C1-I's source classification and guardrails but NOT
the unverified sea, river, coast or salt-basin semantics. C1-H's
separate Windows-native acceptance was not provided; preserve its
CI evidence without silently upgrading its native status.

## Key discovery in original source records

The original `packages/content/base/world/world_map_features.json`
contains **68 coastline features**, *all* associated with
`region.azure_vast`. This is an ocean-facing catalog association,
not Kaelvar political ownership. Never auto-set parent or sovereignty.

`feature.coastline.first_world.part_10` is a single 599-vertex
originally traced contour with bounds x64..538, y130..482, covering
the relevant mainland visual extent. This is stronger source
provenance than an RGB threshold, but **still not certified dry land,
shoreline semantics or political border**. No smoothing, resampling
or invented vertices. Its closing segment is preserved.

Three explicitly noncanonical review windows partition *original
edges by midpoint*, with no new line vertices:
- NW source sector: x70..280, y120..235, **90 original edges**
- North-central source sector: x280..420, y120..235,
  **106 original edges**
- NE mainland source sector: x420..540, y185..315,
  **114 original edges**, possible Veyrholm / Kharuun natural contact
- **289 original edges remain outside the northern sector review**.

These are *windows of source-coastline inspection*, not approved
Veyrholm territory, buffers or new political border coordinates.
Window boundaries cut across the trace only as review selection
logic. Exact original line segments are always retained.

Separately: original `part_7` (28 vertices), `part_8` (134),
and `part_31` (312) show offshore contour candidates.
Part 8 visually corresponds to a northeastern island candidate, but
**whole-island physical ownership is NOT established** by vertex
proximity. All 18 detached terrain candidates and the large NE
island remain held. This is not a declaration that the offshore
vector contour and any terrain component are identical.

The source `feature.river_thalos_run` (5 vertices) is a
separate river feature associated with Kaelvar/Verdant Thalos.
Its trace may be shown as a distinct river provenance witness, but
neither actual flow, navigability nor a sea mouth is certified.

**Do not conflate** `feature.coastline.first_world.part_40`
with the historical **Coast 40 source-conflict hold**, or original
Serathyl Windward with any Kaelvar region. Both remain protected.

## Technical and epistemic guardrails

- Exact original vector Git blob from C1 hash allowlist is read using
  verified immutable committed bytes. Windows CRLF cannot silently
  change verification. Both original source PNGs are SHA-256 verified,
  dimensional and cropped registration is unchanged.
- Source coastline count 68, river count 8, main contour 599 edges
  and 3 offshore contour witnesses are hard gates. The mainland
  sector witness must be **90/106/114 original edges plus 289 other**.
- Original source vector coordinates are not new canonical region
  polygons, not approved physical area boundaries and not automatic
  sea/river/ink semantic truth. Old `azure_vast` association is
  never used to set a region parent.
- For source corroboration, original contour vertices may be compared
  to registered terrain-only component labels within three reference
  pixels. A tied-nearest component, missing component, and multiple
  candidate components must be reported. **No source contour becomes
  a political island ID as a result.**
- C1-F colored terrain candidate cores remain unapproved and
  leave 26,795 mainland candidate cells unassigned. Veyrholm is
  the preferred variable-width northern coast; Kharuun may acquire
  a limited dry shore only if independent geography supports it.
  Kharuun salt-flat basins, wells, rivers, ports and travel routes
  remain unplaced and unapproved.
- Drafts are stacked on C1-I; **no merge or canonical content write**.

## Process gates

| Gate | Pass evidence | HOLD |
| --- | --- | --- |
| J0 C1-I native | 58/58, 851 scans, original hashes | treating C1-H native as proven or any C1-I political authority |
| J1 source vector integrity | 68 coast records, 8 river records, 599 mainland vertices, exact blob | source changes or auto-shaping |
| J2 sector source witness | 90 NW / 106 north-central / 114 NE / 289 other original edges | interpolation, region ownership or missing edges |
| J3 detached witness | 3 original island contours, nearest-component report | splitting or assigning islands automatically |
| J4 river and source semantics | Thalos Run remains separately sourced, no coastal certification | blue, painted ink or river vectors silently become ocean |
| J5 native | exact SHA, Node tests, CLI SVG/report, zero new hex dependency, clean worktree | failed audit, changed protected world data |
| J6 semantic boundary approval | *future only*: owner-reviewed coast contour and calibrated river/sea/ink separation | direct political publication from original contour |

## PowerShell 7 verification

Use a **new** detached worktree at final PR head SHA, without
clean/reset/stash/switching `C:\Codex\EoL`.

```powershell
$ErrorActionPreference='Stop'
$Repo='C:\Codex\EoL'
$Branch='connector/c1j-kaelvar-vector-coastline-intake-2026-11-13'
$Sha='<PIN_EXACT_C1J_SHA>'
$Parent='78dca6f777fbec1423ffdd0229b8c432cb30a388'
$Suffix=$Sha.Substring(0,12)
$Wt=Join-Path $env:TEMP "lr-c1j-native-$Suffix"
$Out=Join-Path $env:TEMP "lr-c1j-review-$Suffix"
git -C $Repo fetch --no-tags origin "refs/heads/$Branch"
if ($LASTEXITCODE) { throw 'Fetch failed' }
if ((git -C $Repo rev-parse FETCH_HEAD).Trim() -ne $Sha) { throw 'Remote SHA drift' }
if (Test-Path $Wt) { throw 'Worktree exists' }
git -C $Repo worktree add --detach $Wt $Sha
if ($LASTEXITCODE) { throw 'Worktree add failed' }
Push-Location $Wt
try {
  node --check scripts/lib/kaelvar-c1j-vector-coastline-review.mjs
  if ($LASTEXITCODE) { throw 'C1-J lib syntax failed' }
  node --check scripts/kaelvar-c1j-coastline-review.mjs
  if ($LASTEXITCODE) { throw 'C1-J CLI syntax failed' }
  node --test tests/unit/kaelvar-c1j-vector-coastline-review.test.mjs
  if ($LASTEXITCODE) { throw 'C1-J tests failed' }
  node scripts/check-no-new-hex-dependencies.mjs --check
  if ($LASTEXITCODE) { throw 'Hex coupling changed' }
  git diff --quiet $Parent $Sha -- packages/content/base/world
  if ($LASTEXITCODE) { throw 'Protected active world data changed' }
  New-Item -ItemType Directory -Force -Path $Out | Out-Null
  $Json=Join-Path $Out 'kaelvar-c1j-vector-report.json'
  $Svg=Join-Path $Out 'kaelvar-c1j-vector-review.svg'
  node scripts/kaelvar-c1j-coastline-review.mjs --check > $Json
  if ($LASTEXITCODE) { throw 'Vector crosswalk failed' }
  node scripts/kaelvar-c1j-coastline-review.mjs --svg > $Svg
  if ($LASTEXITCODE) { throw 'Vector SVG failed' }
  $Report=Get-Content -Raw $Json | ConvertFrom-Json
  if ($Report.status -ne 'C1J_VECTOR_COASTLINE_REVIEW_COMPLETE_SEMANTICS_HELD' -or
      $Report.originalSourceCoastlineReview.originalSourceEdgesAccounted -ne 599 -or
      (@($Report.originalSourceCoastlineReview.northernSectorSourceEdgeCounts) -join ',') -ne '90,106,114' -or
      $Report.originalSourceCoastlineReview.otherSourceEdges -ne 289 -or
      $Report.interpretationHolds.canonicalWritable -ne $false -or
      $Report.interpretationHolds.saltBasinsMapped -ne 0) {
    throw 'C1-J vector inventory/sovereignty drift'
  }
  if ((Get-Item $Svg).Length -lt 100000) { throw 'Source SVG unexpectedly small' }
  if (@(git status --porcelain).Count -ne 0) { throw 'Detached worktree dirty' }
  if ((git rev-parse HEAD).Trim() -ne $Sha) { throw 'Pinned HEAD changed' }
  Write-Host 'C1-J NATIVE VECTOR SOURCE REVIEW GATES PASSED'
  Write-Host 'COAST, RIVER, REGION AND SALT AUTHORITIES STILL HELD'
  Write-Host "Report: $Json"
  Write-Host "SVG: $Svg"
} finally { Pop-Location }
```

Do not use the RGB or PNG source to invent salt flats or to
approve direct Kharuun sea access. Review the original vector trace
and northern-sector selection against the author's map sketch.
