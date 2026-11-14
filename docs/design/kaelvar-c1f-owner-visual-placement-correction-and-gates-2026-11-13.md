# C1-F owner placement corrections: north coast, southern peninsula and foreign source hold

Date: 2026-11-13
Status: **DRAFT SOURCE-CONSTRAINED REVIEW ONLY; NO BORDERS APPROVED**

## Owner review of C1

Owner native Windows PowerShell verification at exact C1 head
`6efb4a81583911c13657eb87d2c0ab009048c909`
passed **29/29 native Node tests**, five-region candidate audit (40m
scenario), 837 scanned files / zero new legacy dependencies, read-only
original-source audit, verified original PNGs, and stdout-only SVG
generation. The reported verdict was
`C1 NATIVE SOURCE REGISTRY GATES PASSED; GEOGRAPHIC BORDERS AND ISLAND OWNERSHIP STILL HELD`.
The owner supplied and visually reviewed the C1 three-panel source-intake
screenshot. **Source registration and C1 native handoff are accepted.**
The previous magenta dashed outline is historical Windward source
provenance only, not an approved Kaelvar border. No five-region masks
or calibrated biome semantics were accepted.

## Geographic corrections from owner visual feedback

1. **Veyrholm Shore** remains on the *northern mainland coast* and follows
   the inlets, headlands and narrow greenish littoral seen in the original
   source. Do NOT extend it into the deeper-yellow interior. This draft
   uses a long, unequal-width curved shoreline guide, not a north-south
   rectangle. A source RGB tone remains a visual hint, not an independently
   calibrated biome name or political boundary.
2. **Verdant Thalos** centers on the *southern wooded and rivered
   peninsula*, including its southeastern green promontory. The
   preliminary sketch is not allowed to float inland as a rectangular
   block or stop at the old Windward source line.
3. **Serathyl Windward Spine** original Part 1 and Part 2 were the
   magenta outlined source-conflict evidence. Do not show them as
   a Kaelvar proposal. The old diagnostic is retained separately as
   immutable cross-continent source provenance, without allocating its
   region ID to Verdant or any other Kaelvar child. Coast 40 remains held.
4. **Auric and Kharuun** are separate western steppe and central dryland
   preview cores. Do not split the coast by equal areas or fill the spaces
   between the guide shapes.
5. **Shattercap Isles** remain a distinct offshore island intent with
   NO island-shaped candidate guide, no component claims, and no automatic
   ownership of the large northeastern island or the 18 detached component
   witnesses (3,693 candidate cells).

## Technical scope

`docs/design/kaelvar-c1f-owner-corrected-placement-guides-2026-11-13.json`
contains only reproducible *guide envelopes*, never canonical polygons
or approved geographyRefs. They were drafted visually against the
original 2048x1152 map source and can be revised after this owner's
comparison. Their coast-border vertices are NOT asserted to be
source-exact. All four mainland guides are disjoint and preserve gaps.

`scripts/lib/kaelvar-c1f-placement-intent.mjs` validates
five child identities, parent frame, Shattercap null geometry, explicitly
held Windward and Coast 40 source claims, outer-ring validity,
disjoint guides, a few owner-marked interior/peninsula coordinate
witnesses, and the publication lock.

`scripts/lib/kaelvar-c1f-source-raster.mjs` performs
strictly independent comparison of original biome/elevation PNG pixels
at the registered crop and uses old-reviewed four-neighbor connectivity
to identify terrain-only component 30 (79,419 *candidate* cells).
The raster is derived **only** to clip and count the review image,
not a grid-based geographic identity or new canonical map catalog.
Blue, shared linework/ink, all detached physical candidates and
unassigned mainland remain outside the colored review mask. This
does not certify whether a sampled pixel is real land, water, desert,
woodland, high mountain, road or jurisdiction.

`scripts/kaelvar-c1f-placement-preview.mjs` produces a
machine-readable report and reproducible three-panel original-source
SVG. Panel 1 is untouched biome, panel 2 shows four independently
clipped candidate cores against the biome image, panel 3 shows the
same guides against original elevation. There is **no magenta
Windward region** in either proposal panel; historical source
conflicts are visible only through the earlier independent C1
diagnostic script. Color is only a review cue.

## Exact native retest

Run in a newly created clean detached worktree pinned to the exact
C1-F branch SHA (replace the placeholder with SHA returned on commit).
Never reset, stash, clean, switch or overwrite the primary
`C:CodexEoL` checkout.

```powershell
$ErrorActionPreference = 'Stop'
$Repo = 'C:\Codex\EoL'
$Branch = 'connector/c1f-kaelvar-placement-revision-2026-11-13'
$Sha = '<PIN_EXACT_C1F_SHA>'
$Wt = Join-Path $env:TEMP ('lr-c1f-native-' + $Sha.Substring(0,12))
$Out = Join-Path $env:TEMP ('lr-c1f-preview-' + $Sha.Substring(0,12))
git -C $Repo fetch origin $Branch
if ($LASTEXITCODE) { throw 'Fetch failed' }
if ((git -C $Repo rev-parse FETCH_HEAD).Trim() -ne $Sha) { throw 'SHA mismatch' }
if (Test-Path $Wt) { throw 'Worktree already exists' }
git -C $Repo worktree add --detach $Wt $Sha
if ($LASTEXITCODE) { throw 'Worktree add failed' }
Push-Location $Wt
try {
  node --check scripts/lib/kaelvar-c1f-source-raster.mjs
  if ($LASTEXITCODE) { throw 'Source raster syntax failed' }
  node --check scripts/lib/kaelvar-c1f-placement-intent.mjs
  if ($LASTEXITCODE) { throw 'Guide schema syntax failed' }
  node --check scripts/kaelvar-c1f-placement-preview.mjs
  if ($LASTEXITCODE) { throw 'CLI syntax failed' }
  node --test tests/unit/kaelvar-c1f-placement-intent.test.mjs
  if ($LASTEXITCODE) { throw 'C1-F unit tests failed' }
  node scripts/check-no-new-hex-dependencies.mjs --check
  if ($LASTEXITCODE) { throw 'Legacy dependency gate failed' }
  New-Item -ItemType Directory -Force -Path $Out | Out-Null
  $ReportFile = Join-Path $Out 'kaelvar-c1f-placement-report.json'
  $SvgFile = Join-Path $Out 'kaelvar-c1f-placement-review.svg'
  node scripts/kaelvar-c1f-placement-preview.mjs --report > $ReportFile
  if ($LASTEXITCODE) { throw 'Source clip report failed' }
  node scripts/kaelvar-c1f-placement-preview.mjs --svg > $SvgFile
  if ($LASTEXITCODE) { throw 'Source clip SVG failed' }
  $Result = Get-Content -Raw $ReportFile | ConvertFrom-Json
  if ($Result.status -ne 'C1F_NONCANONICAL_SOURCE_CLIPPED_PREVIEW_ONLY' -or
      $Result.totalMainlandTerrainCandidateCells -ne 79419 -or
      $Result.islandAssignedCells -ne 0 -or
      $Result.canonicalWritable -ne $false) {
    throw 'C1-F accounting or sovereignty hold failed'
  }
  if ((Get-Item $SvgFile).Length -lt 100000) {
    throw 'SVG unexpectedly small'
  }
  if (@(git status --porcelain).Count -ne 0) {
    throw 'Detached worktree changed'
  }
  if ((git rev-parse HEAD).Trim() -ne $Sha) {
    throw 'Pinned HEAD changed'
  }
  Write-Host 'C1-F NATIVE PREVIEW GATES PASSED; GEOGRAPHIC APPROVAL HELD'
  Write-Host "Report: $ReportFile"
  Write-Host "SVG: $SvgFile"
} finally { Pop-Location }
```

### Follow-up gate

The owner should inspect both the revised region envelope SVG and its
masked candidate render. Confirm Veyrholm's inland limit, Verdant's exact
western and eastern peninsular edges, Kharuun's central reach, and which
northern detached islands belong to Shattercap as whole physical
units. Until those are independently source-certified and approved,
do not publish any regional polygons or old-source transfers.

## CI visual handoff

The stacked draft PR's C1-F GitHub Actions run now uploads the
`kaelvar-c1f-noncanonical-source-review` artifact containing the
three-panel source-aligned SVG and machine-readable report. This is
review convenience only: owner-native PowerShell verification and
independent visual geography review are still required before any
boundary or island approval. The diagnostic magenta historical source
view remains in the older, separate C1 SVG command.

## Owner-preview visual clarity refinement

The exported review SVG draws **only source-clipped candidate-terrain pixels** as colored region cores. Raw guide envelope polygon borders are no longer drawn across water or unresolved ink, avoiding false shoreline/sovereignty cues. Region labels use neutral readable background plates and Shattercap's northeastern island remains explicitly held. The guide envelope coordinates remain machine-readable in the separate review JSON but cannot be published or interpreted as approved land boundaries.
