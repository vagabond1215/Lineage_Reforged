# C1-I: registered source-blue connectivity and unresolved-ink separation

Date: 2026-11-13
Status: **READ-ONLY SOURCE DIAGNOSTICS, OWNER-NATIVE C1-H AND C1-I HELD; NO POLITICAL COASTLINE**

## Entry and geographic intent

C1-G is owner-native accepted at `ccbdcd41a48e48ffdd558a027bc55e808813e18f`:
44/44 native Node tests; 845 code files scanned; zero new hex
dependencies. C1-H is **CI verified only** at
`4295621d7ead2d4b0659604268b7ac16af6feb39`;
its 51/51 suite and 848-file no-hex scan passed. No owner-native
C1-H acceptance has been supplied in this thread, so C1-I work
proceeds in a separate stacked review branch and cannot imply it.

The owner prefers a variable-width Veyrholm north-coast corridor,
allows an exceptional Kharuun dry coastline only if justified by
independent physical geography, and wants plausible Kharuun salt flats
in verified inland basins. The owner's sketch remains the *placement
intent*, never a substitute for original map features.

## Source finding motivating this stage

C1-H measured 79,419 main terrain candidate cells in source
component 30 and only **17 pixels adjacent to any shared-blue source
pixels**. This is a strict source classification, not proof of a
17-pixel-long coastline: real shorelines may be separated by common
river/coast ink or other unresolved shared-nonblue image pixels.

## C1-I measures and limits

1. Re-register original biome/elevation PNGs with SHA-256, source crop
   and exact original vector Git blob, preserving mainline's 201
   footprints and the separate unmerged 159-footprint witness.
2. Classify identical-blue pixels in *both images*, same source
   alpha, into two groups by **four-neighbor pixel topology**:
   - `boundaryConnectedBlue`: connected to any outer SOURCE
     reference-frame edge, not automatically certified ocean
   - `enclosedBlue`: not connected to that frame edge;
     these might be lakes, rivers or isolated artwork, never
     automatically hydrologic basins
3. Classify pixels with identical nonblue RGB/alpha in both
   source images as **shared-nonblue unresolved**; this is not
   proof of a black-line coastline. It can include other
   terrain/ink/illustration effects.
4. Starting only from boundary-connected blue, test shortest paths
   through **0, 1, 2 or 3** shared-nonblue source pixels to
   component-30 terrain candidates. No path crosses the different-RGB
   land candidate, an offshore component, unknown alpha or more than
   three unresolved pixels. The sensitivity horizon is a
   diagnostic parameter, **not a fixed-width political boundary**.
5. Count contacts for all four current C1-F source-clipped
   guide candidates plus the explicitly unassigned mainland; preserve
   all 79,419 cells, 26,795 unassigned, **zero island claims**.
6. Render three panels: untouched source image, isolated enclosed-blue
   patches, and C1-F north-coast/dryland guides with contact
   sensitivity. No magenta old Windward claim, sea port, salt flat
   dot, fabricated river or generated border.

### Non-promotable interpretations

A frame-connected blue pixel can include ocean-connected rivers or
coastal artwork; an enclosed blue patch need not be an inland lake;
shared-nonblue pixels can include rocks, letters or contour ink. No
blue/ink crossing proves water depth, elevation, physical land
ownership or weather.

Consequently: no Kharuun direct sea frontage, certified Veyrholm
continuous coastline, salt-flat basin, watershed, fresh water, route
connection, settlement, resource or whole-island allocation is
approved by C1-I. The existing 16 C1-G source/ecology gates remain
UNVERIFIED. The next physical hydrology step needs independently
reviewed water/river/ink separation and a defensible height/elevation
scale.

## Entry, pass and HOLD gates

| Gate | Entry | Pass | HOLD |
| --- | --- | --- | --- |
| I0 preserved C1-H | exact C1-H head | CI passes, C1-H owner-native still pending | falsely mark C1-H native accepted |
| I1 exact source | original PNGs, crop, exact vector blob | all checked; no unapproved source exclusion | source drift |
| I2 blue connectivity | registered paired PNG shared-blue mask | reproducible four-neighbor connected/enclosed inventory | call a graph group ocean/lake |
| I3 unresolved ink | paired identical nonblue pixels | max 3 steps and no mainland/ink overlap | infer coastal width or fill gaps |
| I4 noncanonical guide review | approved five child *identities*, C1-F review-only guides | per-guide counts with 26,795 mainland cells unassigned | island allocation or political publication |
| I5 native/CI | detached pinned head | new Node tests, no-new-hex gate, report+SVG and worktree clean | failing diagnostic or source fingerprint |
| I6 true coast/hydrology | **NOT entered** | separate water/ink semantic calibration, height/drainage + owner approval | every attempt to publish from pixel connectivity alone |

## Owner native PowerShell 7 isolated verification

Replace the pinned SHA with final C1-I head from remote readback.
The source PNGs, political borders and catalogs cannot be altered
by the commands. Worktree and outputs are isolated under TEMP.

```powershell
$ErrorActionPreference = 'Stop'
$Repo = 'C:\Codex\EoL'
$Branch = 'connector/c1i-kaelvar-ink-water-separation-2026-11-13'
$Sha = '<EXACT_C1I_SHA>'
$Parent = '4295621d7ead2d4b0659604268b7ac16af6feb39'
$Wt = Join-Path $env:TEMP ('lr-c1i-native-' + $Sha.Substring(0,12))
$Out = Join-Path $env:TEMP ('lr-c1i-source-' + $Sha.Substring(0,12))
git -C $Repo fetch --no-tags origin "refs/heads/$Branch"
if ($LASTEXITCODE -ne 0) { throw 'Fetch failed' }
if ((git -C $Repo rev-parse FETCH_HEAD).Trim() -ne $Sha) {
  throw 'Remote SHA changed'
}
if (Test-Path $Wt) { throw 'Worktree already exists' }
git -C $Repo worktree add --detach $Wt $Sha
if ($LASTEXITCODE -ne 0) { throw 'Worktree creation failed' }
Push-Location $Wt
try {
  node --check scripts/lib/kaelvar-c1i-source-ink-separation.mjs
  if ($LASTEXITCODE) { throw 'Source lib parse failure' }
  node --check scripts/kaelvar-c1i-source-ink-review.mjs
  if ($LASTEXITCODE) { throw 'Source CLI parse failure' }
  node --test tests/unit/kaelvar-c1i-source-ink-separation.test.mjs
  if ($LASTEXITCODE) { throw 'C1-I unit tests failed' }
  node scripts/check-no-new-hex-dependencies.mjs --check
  if ($LASTEXITCODE) { throw 'Legacy coupling gate failed' }
  git diff --quiet $Parent $Sha -- packages/content/base/world
  if ($LASTEXITCODE) { throw 'Protected original world data changed' }
  New-Item -ItemType Directory -Force -Path $Out | Out-Null
  $Report = Join-Path $Out 'kaelvar-c1i-source-classification.json'
  $Svg = Join-Path $Out 'kaelvar-c1i-source-comparison.svg'
  node scripts/kaelvar-c1i-source-ink-review.mjs --check > $Report
  if ($LASTEXITCODE) { throw 'Source review failed' }
  node scripts/kaelvar-c1i-source-ink-review.mjs --svg > $Svg
  if ($LASTEXITCODE) { throw 'Source SVG failed' }
  $R = Get-Content -Raw $Report | ConvertFrom-Json
  if ($R.status -ne 'C1I_SOURCE_BLUE_INK_SEPARATION_COMPLETE_HYDROLOGY_STILL_HELD' -or
      $R.terrainCandidateCells -ne 79419 -or
      $R.regionalReview.regionRows[0].terrainCandidateCells -ne 26795 -or
      $R.interpretationHolds.canonicalWritable -ne $false -or
      $R.interpretationHolds.saltFlatLocationsCertified -ne 0) {
    throw 'Physical evidence or ownership hold failed'
  }
  if ((Get-Item $Svg).Length -lt 100000) {
    throw 'Source SVG unexpectedly small'
  }
  if (@(git status --porcelain).Count -ne 0) {
    throw 'Verification worktree changed'
  }
  if ((git rev-parse HEAD).Trim() -ne $Sha) { throw 'Pinned HEAD changed' }
  Write-Host 'C1-I SOURCE CLASSIFICATION NATIVE GATES PASSED'
  Write-Host 'OCEAN, RIVERS, COASTAL BORDERS AND SALT BASINS HELD'
  Write-Host "Report: $Report"
  Write-Host "SVG: $Svg"
} finally { Pop-Location }
```

Keep the older C1-H original-source report and visual for
cross-comparison. The added tests require no owner geography approval
because the entire output is clearly noncanonical.
