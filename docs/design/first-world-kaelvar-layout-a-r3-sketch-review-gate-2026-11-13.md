# Kaelvar Layout A: R3 first reversible geographic sketch and native review gate

Date: 2026-11-13
Status: **PROPOSAL CODE READY; NATIVE TESTS AND SOURCE-IMAGE SVG REVIEW PENDING**
Parent: accepted planning-only [PR #80](https://github.com/vagabond1215/Lineage_Reforged/pull/80) at \`8731864d809bb8a18d6d74f4003b9cc941eb0e00\` (owner-native Gates 1–3 all passed).
Evidence parent: separate, draft, unmerged PR #79. Neither PR #79 nor PR #80 is part of this new draft diff.

## 1. Exact aim and lane distinction

This segment **actually draws three hand-authored, source-aligned test sketches**. It is deliberately not a redistribution of all Kaelvar land or an approval of any political boundary. The source geometry already contains bad Shattercap mainland and foreign Windward claims; therefore retaining full source polygons as proposed jurisdictions would repeat the original defect. Instead, every test shape is an **explicit polygon** intersected with its historical feature, with independent source-pair candidate-terrain classification and the specific terrain-only four-neighbor physical component.

The proposal derives **no owner from a terrain-only connected component**. Component 30 means a physical observation in the K1 scenario, not a confirmed \`region.kaelvar\` parent. A human-review overlay is allowed before formal parent approval; passing a topology test is not permission to call \`auditProvisionalRegionMasks\` with \`confirmedParentByComponent: {30:'region.kaelvar'}\` or to write a replacement \`world_map_features.json\`. The output explicitly has \`confirmedParentByComponent:null\`.

Three existing child identities only; zero fourth-region identities. The default Layout B stays eligibility-only. The master, source PNGs, source geometry, exclusions, \`regions.json\`, semantic future \`map_features\`, world-generation state, settlements, travel, world hexes, UI, launcher, runtime and Saves are unchanged.

## 2. Explicit sketch windows, not certified borders

Coordinates are in the *audited 2048 × 1152 reference frame*. A cell can join a draft only if (a) inside the explicitly hand-authored sketch polygon, (b) inside the named existing original source footprint, (c) classified \`DIVERGENT_TERRAIN_CANDIDATE\` on the exact source PNG pair, (d) in terrain-only component 30, (e) not multiply claimed by competing original region source footprints, (f) not claimed by another sketch, and (g) one 4-neighbor raster cell away from the edge of its exclusive source-consistent draft. Any failed condition leaves the cell **unassigned**. The extra one-cell guard band is a conservative visual sensitivity margin, **not** an ecotone width or hydrology classification.

| Draft preview | Source part and window | Placement intent; unresolved |
| --- | --- | --- |
| Auric western core | \`feature.region_auric_marches.part_4\`, window starting (66,146), reaching roughly x234/y352 | Western interior, not a blanket owner of eastern or Shattercap-overlapping terrain; dry steppe/upland compatibility not established |
| Verdant southern core | \`feature.region_verdant_thalos.part_1\`, window starting (202,313), reaching roughly x411/y451 | Southern peninsula, not automatic recipient of Windward or Coast 40; coastal forest/relief/river suitability not established |
| Shattercap northern coastal strip | \`feature.region_shattercap_isles.part_7\`, partial sketch from (228,132) through northern y~200 | Northern maritime *hypothesis* only. Entire original Part 7 remains withheld from ownership; this does not validate its older huge mainland area or any offshore island |

Exact vertices, provenance, source integrity and all hold flags live in \`docs/design/first-world-kaelvar-layout-a-r3-sketch-2026-11-13.json\`. The windows were drawn from available original vector bounds and authored region placement qualifiers. **No approved RGB palette, elevation transfer function or coastline/river adjudication currently supports their ecological accuracy**, and they should be corrected visually rather than promoted. Some visual-boundary cells are deliberately lost to the conservative guard band.

Original source parts and 42 accepted exclusions remain unchanged. The six original source hold records remain: Shattercap 1 (684 blue, zero source terrain, NOT artifact exclusion #43), Shattercap 7 (whole source part withheld, bounded north test only), Shattercap 15 (southeastern source held), Windward 1 (Serathyl child with 3,661+12 terrain candidates), and distinct Windward 2/Verdant 6 Coast 40 claims.

All 18 Shattercap-overlapping detached physical-terrain components, including components 24, 90, 91 and component 78 (8 candidate cells), are *independently retained* and exactly checked against the parent ledger for **3,693** unique candidate terrain cells. None joins a child preview mask. The original physical mainland reference **79,419** candidate cells is measured, not designated a sovereign Kaelvar parcel. Unsketched mainland cells, source-claim conflicts, sketch collisions and one-cell guard pixels stay unassigned, with separate counts in JSON.

## 3. Evidence outputs and visual interpretation

The new read-only entrypoint is \`scripts/first-world-kaelvar-layout-a-r3-sketch.mjs\`:
- \`--report\`: JSON with original source PNG SHA-256, source geometry Git blob readback, clean 159-footprint / 68-coast / 42-exclusion inventories, preview cells by child/source ID, unassigned original-mainland candidates, conflicts, boundary guard, and full retained 18-island table.
- \`--svg\`: a self-contained three-panel SVG. Panel 1: original registered biome source. Panel 2: the same original biome with gold (Auric), green (Verdant), orange (Shattercap) **tentative preview**; grey unassigned mainland; pink contested source/sketch cells; cyan detached-island candidates. Panel 3: original registered elevation RGB with pink/amber conflict/guard overlays. Dashed lines are the manually drawn *sketch windows*, never accepted political boundaries.

The SVG panels do not certify water, ink, elevation or biome semantics. They are only the first shape review. The original source behind every panel is preserved and embedded locally, with no external URL dependency. All generated files should be written under \`$env:TEMP\`, never added as canonical content.

The pure library \`scripts/lib/first-world-kaelvar-layout-a-r3-sketch.mjs\` also fails closed if a fourth child is added, a source part is missing, a source ID is reassigned, a region parent/position changes, a held original source disposition changes, source island identity/count changes, or an owner approval/ecology flag is prematurely asserted. It never uses nearest-anchor, equal-area or automatic gap filling.

## 4. Stage entry, exit and explicit HOLD

| Stage | Entry | Exit/success | Failure / next action |
| --- | --- | --- | --- |
| R3-A0 isolate | PR #80's exact accepted SHA, all Gates 1–3 owner passed, same original map source hashes | New draft branch based exactly on accepted SHA; no canonical changed paths | Unexpected parent HEAD, dirty detached test worktree, changed PR state: stop |
| R3-A1 source sketch | Three explicit sketch windows and original feature-ID provenance | All three previews intersect source-consistent component-30 terrain, with no overlap, no off-mainland transfer, unassigned gaps counted | Any empty/corrupt source window, unexpected island identity, automatic fourth region, source drift: HOLD |
| R3-A2 native reproduction | Clean detached worktree at exact new branch SHA; original PNGs present | All 69 previously accepted tests plus new focused suite pass, JSON report exact 159/68/18/3693/79419, 3 self-contained SVG panels, no writes | Any syntax, test, source, hash, SVG or count mismatch: HOLD; return logs |
| R3-A3 visual review | Native A2 pass and three-panel SVG opened | Review each west/south/north window against original biome and elevation, inspect pink/grey/cyan areas and all remaining islands, record specific revised vertices/source IDs | If north strip crosses an ineligible island/river, or west/south ecological fit is unclear, keep areas unassigned and issue a new *proposal-only* revision |
| R3-A4 later authority | A3 explicit region-by-region review, macro/child parent sovereignty, coast/ink/hydrology/ecology evidence, settlement/route dependency gate | Separate owner-approved masks on a separate later authorized branch | Not entered; never inferred from preview pixel counts or current user approval of tests |

The only acceptance available now is **native integrity of the review proposal**, not borders. No canonical edits or merge are permitted by passing R3-A2.

## 5. Precise PowerShell 7 owner verification

Use **another** detached verification worktree, separate from both the dirty primary \`C:\Codex\EoL\` and the already-accepted R0–R3 witness at \`C:\Codex\EoL-landmass-r0r3-verify\`. The prompt returning this PR must supply the exact full new branch commit SHA to fill into \`$expected\`. No \`git reset\`, \`git clean\` or \`stash\` on either active worktree.

~~~powershell
$ErrorActionPreference = 'Stop'
$repo = 'C:\Codex\EoL'
$branch = 'connector/first-world-kaelvar-layout-a-r3-sketch-2026-11-13'
$expected = '<INSERT_EXACT_SHA_FROM_PR_HANDOFF>'
$worktree = 'C:\Codex\EoL-kaelvar-layout-a-r3-verify'
$out = Join-Path $env:TEMP 'first-world-kaelvar-layout-a-r3'
if ($expected -notmatch '^[0-9a-f]{40}$') { throw 'Insert the verified full PR SHA' }
git -C $repo fetch --no-tags origin $branch
if ($LASTEXITCODE -ne 0) { throw 'Fetch failed' }
$remote = (git -C $repo rev-parse "refs/remotes/origin/$branch").Trim()
if ($remote -ne $expected) { throw "Remote SHA drift: $remote" }
if (-not (Test-Path -LiteralPath $worktree)) {
  git -C $repo worktree add --detach $worktree $expected
  if ($LASTEXITCODE -ne 0) { throw 'New worktree setup failed' }
} else {
  if ((git -C $worktree rev-parse HEAD).Trim() -ne $expected -or
      @(git -C $worktree status --porcelain).Count) {
    throw 'Existing R3 worktree not exact/clean; preserving it'
  }
}
Set-Location $worktree
New-Item -ItemType Directory -Force -Path $out | Out-Null
$syntax = @(
 'scripts/lib/first-world-kaelvar-layout-a-r3-sketch.mjs',
 'scripts/first-world-kaelvar-layout-a-r3-sketch.mjs',
 'tests/unit/first-world-kaelvar-layout-a-r3-sketch.test.mjs'
)
foreach ($path in $syntax) {
  node --check $path
  if ($LASTEXITCODE -ne 0) { throw "Syntax failure: $path" }
}
node --test tests/unit/first-world-kaelvar-layout-a-r3-sketch.test.mjs 2>&1 |
  Tee-Object -FilePath (Join-Path $out 'focused-tests.txt')
if ($LASTEXITCODE -ne 0) { throw 'R3 focused tests failed' }
$tests = @(
 'first-world-raster-macro-evidence',
 'first-world-environment-evidence',
 'first-world-source-pair-qa',
 'first-world-coast10-ecology-review',
 'first-world-kaelvar-locality-review',
 'first-world-shattercap-union',
 'first-world-kaelvar-candidate-comparison',
 'first-world-kaelvar-k2-source-probes',
 'first-world-landmass-proposal-ledger',
 'first-world-kaelvar-layout-a-r3-sketch'
) | ForEach-Object { "tests/unit/$_.test.mjs" }
node --test @tests 2>&1 |
  Tee-Object -FilePath (Join-Path $out 'all-tests.txt')
if ($LASTEXITCODE -ne 0) { throw 'Full ten-suite test gate failed' }
node scripts/first-world-kaelvar-layout-a-r3-sketch.mjs --report > (Join-Path $out 'layout-a-r3.json')
if ($LASTEXITCODE -ne 0) { throw 'R3 report failed' }
node scripts/first-world-kaelvar-layout-a-r3-sketch.mjs --svg > (Join-Path $out 'layout-a-r3.svg')
if ($LASTEXITCODE -ne 0) { throw 'R3 SVG failed' }
$r = Get-Content (Join-Path $out 'layout-a-r3.json') -Raw | ConvertFrom-Json
[xml]$svg = Get-Content (Join-Path $out 'layout-a-r3.svg') -Raw
if ($r.status -ne 'LAYOUT_A_R3_PREVIEW_ONLY_NO_APPROVED_BORDERS' -or
    $r.physicalMainlandCandidateTerrainCells -ne 79419 -or
    $r.sourceFootprintCount -ne 159 -or
    $r.detachedShattercapRows.Count -ne 18 -or
    $r.heldDetachedShattercapCandidateCells -ne 3693 -or
    $r.sourcePartCrosswalk.Count -ne 3 -or
    @($r.sourcePartCrosswalk | Where-Object { $_.previewCells -le 0 }).Count -ne 0 -or
    $r.unassignedAfterPreviewMainlandCandidateCells -le 0 -or
    $r.sourcePreviewDoesNotAssignPoliticalParent -ne $true -or
    $r.canonicalSourceWritable -ne $false -or
    $r.ownerApprovalRef -ne $null -or
    $r.proposedFourthRegionId -ne $null) {
  throw 'R3 source/topology or safety invariant drift'
}
if (@($svg.SelectNodes('//*[local-name()="image"]')).Count -ne 3) {
  throw 'R3 three-panel original-source SVG mismatch'
}
if (@(git status --porcelain).Count -or
    (git rev-parse HEAD).Trim() -ne $expected) {
  throw 'Detached verification worktree mutated'
}
Write-Host 'R3-A2 NATIVE REVIEW-SKETCH GATE PASSED'
Write-Host 'R3 BORDER/ISLAND/ECOLOGICAL APPROVAL HELD'
Write-Host "HEAD=$expected"
Write-Host "OUTPUT=$out"
$r | Select-Object status,previewCandidateCells,
  unassignedAfterPreviewMainlandCandidateCells,
  heldMultiSketchCells,heldOriginalSourceConflictCells,
  heldOneCellBoundaryGuardCells,heldDetachedShattercapCandidateCells,
  sourcePreviewDoesNotAssignPoliticalParent,canonicalSourceWritable |
  Format-List
~~~

Use the output's \`layout-a-r3.svg\` as a **visual review artifact** and return both a screenshot and counts before proposing any revised borders. Pixel masks are temporary arrays computed in memory and are never emitted into the canonical source tree.
