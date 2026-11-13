# C1-A through C1-D: coordinate-first geography review registry and source intake

Date: 2026-11-13  
Status: **CONNECTOR COMMITTED, NATIVE VERIFICATION PENDING; C1 SOURCE/REGION APPROVAL HELD**  
Scope: Additive, review-only registry, source audit, and original-source SVG. Does not revise active authority.

## C0 acceptance and repository audit

The owner accepted C0 at 831e15f5cf7504a30208daa54949db7789954f81:
234/234 native Node tests, zero additions in the frozen legacy dependency gate
(832 source files), candidate authoring and protected catalog checks all passed.
This document supersedes the old "native pending" statement in the
coordinate-first migration contract, without rewriting historical records.

GitHub master at C0 holds **201** original region footprints and 68 coastlines,
blob 9cd6752e9dbca00796e5f7c013066bb0e5a96175. The unmerged R3 draft
PR #81 holds **159** effective footprints and 68 coastlines, blob
ec59ed66b7eaee4502dc56709a2f266b17b3cb17, after its 42 excluded
offshore artifact candidates. The two states are different; neither is
permission to rewrite or publish the other. The new reader recognizes
both exact variants and NEVER automatically deletes source footprints.
One version-specific approval/reconciliation is needed before drawing
geographic claims against a branch's source.

Source evidence from draft PRs #80/#81 remains review evidence only:
source PNGs were 4096x2355 with registered crop (60,60,3976,2235);
First World authoring reference is 2048x1152, with 9.765625 planar
reference kilometers per pixel. Neither planar distance nor image
adjacency proves routes or sovereignty. The old Layout A 38,695/40,724
assigned/unassigned candidate counts are NOT five-region boundaries.

## Authority and disposition

- **Retain:** world.regions place IDs, current geometry, settlement and
  resource catalogs, original source images, active travel/encounter/save
  contracts, the frozen forward dependency gate.
- **Reuse without changing ownership:** C0 coordinate primitives and polygon
  containment, existing source hashes, R3 immutable crosswalks, 18-component
  terrain-candidate witness and authored five-region ecological descriptions.
- **Supersede for future authoring:** any new grid-first, source-color-as-biome,
  nearest-area political assignment, equal-area region distribution or
  adjacency-implies-route advice. Historical draft evidence is not destroyed.
- **Keep separate:** visual source footprints, physical connected components,
  parent continent, regional child identity, ecology areas, and political
  sovereignty. An ecological polygon can cross regional borders.
- **HOLD:** all five candidate geometry refs; the northeast large island
  until its component identity and whole-island sovereignty are verified;
  Coast 40, Serathyl's Windward Spine, 18 detached source-terrain candidate
  components (3,693 cells), semantic PNG legend and coast/river ink.

The registry at
docs/design/kaelvar-c1-coordinate-geography-review-2026-11-13.json
registers nineteen physical terrain-candidate witnesses (main reference
component 30 plus eighteen detached), five child placement intents,
original-feature crosswalks, and explicit NULL geography/sovereignty.
It is NOT a landmass polygon catalog. The former draft's component counts
have not been revalidated as a source-aligned inventory on master.

scripts/lib/world-geographic-authority.mjs validates multipolygons with
holes, forbids overlapping/touching pieces inside one area, keeps ecology
independent of region ownership, requires geometry source/version, rejects
multiple regional hits and insists that any whole-component ownership
claim reference exactly its registered physical geometry. Since the
detached candidates have no certified geometry ref, this review ledger
cannot allocate them.

## Stage gates

| Stage | Entry | Action / evidence | Pass exit | HOLD / failure |
| --- | --- | --- | --- | --- |
| C1-A audit | C0 native acceptance, master exact SHA | compare canonical and draft source snapshots; record authority disposition | 201 vs 159 divergence documented, originals untouched | source drift, overwrite, or draft merge |
| C1-B registry | C1-A evidence, C0 polygon primitives | add pure geometry and ownership validators, synthetic tests | fail-closed geometry and whole-island claims | unversioned shape, multi-piece overlap, orphan or split island |
| C1-C crosswalk | five region intents, source feature IDs, known component witness | explicitly register unplaced five regions, physical witnesses and holds | five intents, 19 witnesses, zero allocations | guessed parent, claimed northeast island or automatic gap fill |
| C1-D source preview | original PNG hashes, current vector source fingerprint | stdout-only SVG of original biome, elevation and disputed source outlines | visually inspect original source layers and holds | asserting five-region proposal borders from this intake alone |
| C1-E native | exact detached SHA, read-only code/data | syntax, unit suite, CLI, original SHA and forward dependency gate | owner-native result plus shared SVG review | unverified native run, image drift, gate failure |

**C1-D is source-intake preview only.** It does NOT yet produce five
color-filled source-constrained region polygons or terrain/component masks.
Those require a separate C1-F reviewed owner sketch and physical segmentation
on the same source variant. Blank mainland is left unassigned.

## Read-only preview and owner verification

In a clean exact-SHA detached worktree, run:

```powershell
$ErrorActionPreference = 'Stop'
$Repo = 'C:\Codex\EoL'
$Sha = '<REPLACE_WITH_EXACT_C1_COMMIT_SHA>'
$Branch = 'connector/c1-coordinate-geography-registry-2026-11-13'
$Wt = Join-Path $env:TEMP ('lr-c1-verify-' + $Sha.Substring(0,12))
$Out = Join-Path $env:TEMP ('lr-c1-preview-' + $Sha.Substring(0,12))
git -C $Repo fetch origin $Branch
if ($LASTEXITCODE) { throw 'C1 branch fetch failed' }
$Remote = (git -C $Repo rev-parse FETCH_HEAD).Trim()
if ($Remote -ne $Sha) { throw "C1 SHA drift: $Remote" }
if (Test-Path $Wt) { throw "Verification path already exists: $Wt" }
git -C $Repo worktree add --detach $Wt $Sha
if ($LASTEXITCODE) { throw 'Detached worktree creation failed' }
Set-Location $Wt
if ((git rev-parse HEAD).Trim() -ne $Sha) { throw 'HEAD mismatch' }
node --check scripts/lib/world-geographic-authority.mjs
if ($LASTEXITCODE) { throw 'C1 library parse failed' }
node --check scripts/kaelvar-c1-geography-review.mjs
if ($LASTEXITCODE) { throw 'C1 CLI parse failed' }
node --check tests/unit/world-geographic-authority.test.mjs
if ($LASTEXITCODE) { throw 'C1 tests parse failed' }
node --test tests/unit/world-coordinate-geometry.test.mjs tests/unit/world-geographic-authority.test.mjs
if ($LASTEXITCODE) { throw 'C1 geometry tests failed' }
node scripts/kaelvar-c1-geography-review.mjs --check
if ($LASTEXITCODE) { throw 'C1 source-integrity audit failed' }
node scripts/check-no-new-hex-dependencies.mjs --check
if ($LASTEXITCODE) { throw 'Legacy dependency forward gate failed' }
New-Item -ItemType Directory -Path $Out -Force | Out-Null
node scripts/kaelvar-c1-geography-review.mjs --svg > (Join-Path $Out 'kaelvar-c1-original-source-review.svg')
if ($LASTEXITCODE) { throw 'C1 SVG generation failed' }
$Svg = Get-Item (Join-Path $Out 'kaelvar-c1-original-source-review.svg')
if ($Svg.Length -lt 100000) { throw 'C1 SVG unexpectedly small' }
if ((git status --porcelain).Count -ne 0) { throw 'Detached worktree changed' }
if ((git rev-parse HEAD).Trim() -ne $Sha) { throw 'Pinned SHA changed' }
Write-Host 'C1 SOURCE REGISTRY NATIVE GATES PASSED; BORDERS AND ISLANDS HELD'
```

Open the temp SVG locally; verify original biome/elevation images actually
appear and the held source outlines align. The reviewer must not treat
its colored region-name key as drawn areas. Worktree removal is a
separate deliberate cleanup, not performed by this check.

## Next C1-F: source-constrained five-region reconstruction

Entry: owner reviews original-source SVG, accepts the mainline-vs-draft
vector-source choice, shares source-aligned five-region placement sketches,
and confirms northeast-island physical component identification. Reuse
raster classification and component witnesses from PRs #79–81 only after
porting them without bringing old regional owner rules. Build
noncanonical unequal-region core polygons, intersect them with
independently verified terrain-only geography and retained source IDs,
report total assigned, unassigned, disputed, offshore and ink categories,
and draw a five-color original-image comparison. No source-color biome
assertion, artificial complete coverage, parent transfer, travel path,
settlement change, save migration or canonical write may occur until
their later explicit gates.
