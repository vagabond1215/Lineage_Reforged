# Kaelvar source-aligned reconstruction A/B: first read-only candidate gate

Date: 2026-11-13
Branch: `connector/first-world-raster-macro-evidence-pilot-2026-11-12`
Status: **REVIEW-WINDOW IMPLEMENTATION COMMITTED; ORIGINAL-SOURCE NATIVE TESTS AND POLITICAL BORDERS HELD**
PR: #79, draft. Source basis: audited geometry at `41a8ab1d`; 2048×1152 paired original biome/elevation rasters within crop (60,60,3976,2235).

## Intent and epistemic boundary

This is the **first source-aligned A-versus-B reconstruction proposal stage**, not another physical-component inventory and not a canonical polygon revision. The existing Shattercap union is an exact **30,938 candidate-terrain-cell** union: 27,245 on the Auric-referenced terrain-only mainland and 3,693 on 18 detached terrain components, with no same-Shattercap terrain-polygon overlaps. The 88 Coast 10 original child-overlap cells derive from the **ink-inclusive** old land scenario; do not confuse those with terrain-only components or square kilometers.

The biome image has **no approved exact-RGB-to-ecology legend**, elevation image brightness is **not calibrated to elevation or relief**, shared nonblue ink may be coast, river or artwork, and blue is a candidate water class. Consequently, a data-backed *replacement political border* cannot be computed defensibly yet. The correct first deliverable is a native review window and a scored/dispositionable provenance ledger that **declines to draw false borders**. The new tools put all unresolved cells in an explicit HOLD state rather than deciding that color, nearest anchor or existing polygon area determines new ownership.

## Existing baseline versus two proposed layouts

| Evidence dimension | Existing geometry | Layout A: 3 authored children | Layout B: possible 4th eastern child |
|---|---|---|---|
| Authoritative children | Auric Marches, Verdant Thalos, Shattercap Isles | Same three, no new canonical region | Three remain; **UNAPPROVED_EASTERN_MAINLAND_CANDIDATE** only a working label |
| Auric | Broad western/interior candidate labels | Test dry western interior and compatible uplands; keep existing boundaries provisional | Identical western test, subject to eastern ecotone/catchment findings |
| Verdant | Southern coastal peninsula, incomplete far southeast | Test Mediterranean woodland/coastal lowlands, low hills and agricultural corridors; farmland is **land use**, not an assumed RGB class | Same coastal test unless independent ecology isolates east |
| Shattercap | 27,245 source-terrain candidates on mainland plus 3,693 detached | Limit *future proposed sovereignty* to independently justified northern maritime islands, coast and bridgeheads; all current inland/eastern mainland samples remain pending | Same northern-island constraint; eastern mainland may become a new child **only if separately demonstrated** |
| Windward Part 1 | Foreign Serathyl label on southeastern Kaelvar peninsula (3,661 main + 12 separate terrain candidates) | Must be re-examined for Kaelvar parent and *unknown child*; do not force Verdant | Same parent review; test whether eastern mainland is ecologically distinct enough, not merely uncovered |
| Coast 40 | Windward 2 / Verdant 6 separate island case | Independent political/ecological determination | Independent political/ecological determination |
| Borders | Existing polygon provenance, not certified dry-land or ecology | **No proposed spatial polygons while E0–E4 open** | **No proposed spatial polygons while E0–E4 open** |
| Primary failure | Foreign placement and implausible Shattercap distribution, plus legacy 88 overlap/1,362 uncovered | Requires coherent fit of all three authored ecological profiles, including broad east | Requires independently supported contiguous eastern landscape, not equal-area balance or visual tidiness |
| Burden of proof | Already demonstrably inconsistent with authored positions | Independent RGB biome, elevation, shore/river, continuity and ecotones | All A requirements, PLUS positive proof of a distinct fourth region and dependent content impact |

**Decision posture:** A is the default *minimum-change hypothesis* pending source ecology. B is a real falsifiable alternative, **not** a fourth-region recommendation or a placeholder filled with artificial polygons. If source evidence supports no distinct eastern landscape, B fails; if existing three regions cannot describe the independent eastern ecology without a large interior contradiction, A fails. Neither can be approved from raw color overlap, geography of an anchor, or the apparent footprint shape.

## Read-only deliverables committed

- `scripts/lib/first-world-kaelvar-candidate-comparison.mjs`: region-by-region raw exact RGB top swatches, relative elevation luminance quantiles, original per-feature IDs, class counts, component memberships, in-source review-window membership and unique terrain hold accounting. The designated B test windows are **existing** Shattercap Parts 7/15 and Windward Part 1. They are deliberately broader than a proposed fourth region and include some northern terrain. They are *inputs for investigation, never proposed political masks*.
- `scripts/first-world-kaelvar-candidate-comparison.mjs --compare`: reproduces original-source registration and geometry guard, 42 exclusions, 159 retained parts and 68 coasts, the exact Shattercap witness and the ink-inclusive Coast 10 **86,417/1,362/88** baseline. Reports also the current terrain-only mainland component and all 18 detached Shattercap component rows. The two component namespaces are named separately. Output only to stdout.
- `scripts/first-world-kaelvar-candidate-comparison.mjs --svg`: four aligned panels on the **actual registered PNG content**: original biome with current source ownership highlights, Layout A test windows, Layout B dashed eastern-eligibility source windows, and original elevation. No approved new border is drawn. All colored/outlined features are current-source footprint intersections with candidate terrain; shared ink, water and other map artwork remain visible in the underlying source.
- `tests/unit/first-world-kaelvar-candidate-comparison.test.mjs`: synthetic tests for A/B no-border behavior, 15-part and detached retention, ecological unknowns, source-embedded images and input/no-write guard.

Neither report computes biome compatibility percentages, elevation meters, political area, approved unassigned replacement cells, or ecotone score before calibration. `approvedUnassignedArea=null` is intentional, not a zero.

## Region suitability report: what can and cannot yet be concluded

| Authored region | Expected landscape to test against original rasters | Available independent observations now | Gate before suitability score |
|---|---|---|---|
| `region.auric_marches` | West/interior, dry scrub, steppe, upland meadow, broken uplands | Location and existing footprint; raw source-RGB distribution, luminance p10/median/p90 and terrain-component overlaps in the new native report | Prove source colors/relief match extensive interior, then locate dry-to-wet ecotones |
| `region.verdant_thalos` | Southern peninsula, mixed/Mediterranean woodland, scrub, low coastal hills, agricultural water access | Southern current footprint and southeastern gap; source swatches/relative brightness for all retained Verdant footprints | Calibrate forest categories, coastal elevation and estuary/rivers; separately investigate agriculture/ports from authored land use |
| `region.shattercap_isles` | Northern rugged cool/conifer maritime island fringe, possible coast bridgeheads | Exact deduplicated 27,245 mainland / 3,693 detached candidate terrain; all 15 source parts, 18 detached components and source swatches | Validate latitude/coast proximity **within this authored world**, island relief, cold-maritime biome, interior dissonance and legitimacy of each northern mainland bridgehead |
| `region.windward_spine` | Serathyl northern alpine/cloud/high-conifer mountain spine | Southeastern Kaelvar foreign placement, candidate river/coast source ink, 3,661 + 12 terrain candidates in Part 1 | Independent mountain/highland evidence, physical parent assignment; then child-region review, never automatic transfer |

The native report separates **authored ecological expectations** from exact source RGBs and uncalibrated luminance. Do not convert RGB histogram overlap into a suitability grade. No source height grade, relief model, watercourse geography, ecological contradiction rate or ecotone width is certified yet.

## Original feature-ID / candidate-border provenance ledger

The native JSON contains `sourcePartProvenance` with **every existing Kaelvar Auric, Verdant and Shattercap source polygon plus Windward Parts 1/2**, preserving `sourcePartId`, authored region/location, polygon cells, terrain counts, component memberships and unresolved ink/water counts. Especially review:

| Original ID or physical set | Candidate disposition in both layouts | Required decision |
|---|---|---|
| `feature.region_auric_marches.part_4` | Mainland physical reference and western authored label, not a fixed border | Approve dry-interior ecological extent |
| `feature.region_verdant_thalos.part_1` | Southern authored label, not an automatic eastern recipient | Confirm coastal woodland, low hills, river/estuary transition |
| `feature.region_shattercap_isles.part_7` | Extensive northern/eastern mainland test window; physical mainland does not imply island sovereignty | Distinguish legitimate northern coast/bridgeheads from east/inland misplacement |
| `feature.region_shattercap_isles.part_15` | Southeastern mainland test window | Test A southern/coastal fit vs B distinct eastern ecology |
| `feature.region_windward_spine.part_1` | Southeastern foreign source footprint; 12-pixel second component explicitly retained | Confirm mainland parent and possible child without crossing a river/ink ambiguity |
| `feature.region_shattercap_isles.part_1` | All 684 source cells shared blue, 0 terrain; exclude from **proposed terrestrial claims only** | Independently approve or reject probable edge artifact, preserve source and unchanged 42 exclusions |
| Shattercap remaining 12 source parts / all 18 detached components | Each separately cataloged in report; all kept in source candidate ledger | Review per-island ecological and maritime sovereignty, including eastern/southeastern components 90/91 |
| `feature.region_windward_spine.part_2` + `feature.region_verdant_thalos.part_6` | Coast 40, independent island case | Approve joint Coast 40 land/sea and parent/child review, not whole-island reassignment |
| Existing Kaelvar 88 ink-inclusive internal overlaps | Historical real source membership conflicts, untouched | Recompute in approved terrain/ink scheme, eliminate in any *future* accepted mask |
| Old Coast 10 1,362 ink-inclusive uncovered pixels | Unassigned in existing footprint coverage; not B territory by default | Resolve after coast, river and border calibration |

A proposed new border must eventually have a separate provenance map from **every changed original feature ID** to exact source-raster cell ranges/masks, exclusions, consent reference, RGB legend and elevation calibration versions. Current `layoutA.proposedPolygons` and `layoutB.proposedPolygons` intentionally remain `null`.

## Stage gates, failure/rollback criteria, entry and exit

### K0. Source and identity freeze (entry: existing Shattercap union pass)

- **Entry:** original source rasters and geometry audit, Shattercap exact union, 42 exclusions, PR #79 draft.
- **Exit:** branch head read back, unchanged registered crop, source SHA-256 metadata, 159/68 inventories, immutable 42-list; no canonical write.
- **Fail/HOLD:** PNG unreadable, source geometry SHA drift, deleted island, duplicate source ID, unknown component namespace. Stop; do not automatically amend source authority.
- **Current:** connector review PASS, local binary/hash revalidation pending.

### K1. Native A/B review windows (this commit set)

- **Entry:** K0 and original biome/elevation full bytes available in native detached worktree.
- **Exit:** new tests and six prior suites pass, JSON and four-panel SVG generate from actual original PNGs, prior Shattercap 30,938/27,245/18 and ink-inclusive Coast 10 86,417/1,362/88 reproduce. Read report source part rows for all 15 Shattercap records, Coast 40 distinct, 12-pixel Windward fragment held.
- **Fail/HOLD:** incorrect PNG panel, mismatch with owner witnesses, missing original features, unapproved new-border rendering, all-blue Part 1 silently deleted, native suite failures.
- **Current:** scripts committed; native results NOT CLAIMED.

### K2. Source water / biome / elevation calibration

- **Entry:** K1 visually accepted.
- **Exit:** owner-approved category table for each relevant RGB or color cluster (including mixed/unknown and art); independent shoreline/river/estuary annotation adjudication; approved elevation ramp or justified qualitative class with uncertainty; versioned per-pixel evidence masks/legend hashes.
- **Fail/HOLD:** using generated administrative `biomeZones` as proof; using brightness as meters; counting shared black/blue linework as land; snapping borders across wet channels; changing raster PNGs.
- **Current:** BLOCKED, no approved palette or ramp.

### K3. Ecological segmentation and layout test

- **Entry:** K2.
- **Exit:** build connected **independent** biome/relief/coast/hydrology source patches; compute 4-neighbor continuity, ecotone uncertainty bands, patch adjacency, island-specific field notes, interior-incompatible fraction and raw RGB/elevation comparators. Produce genuinely proposed border masks for A and B with exact original IDs, new unique candidate-terrain coverage, overlaps, gaps, river/coast exceptions, unknown shares, multi-scale transition sensitivity. If B is not independently distinct and contiguous, retire it; if A cannot fit the eastern zone, hold A. Nothing selected based on equal area or nearest anchor.
- **Fail/HOLD:** ecology inferred from the political footprint itself; disconnected land claimed as contiguous; islands erased, unknown cells force-labeled, unreviewed coastline.
- **Current:** NOT ENTERED. Current SVG is a **pre-boundary comparison**, not the K3 exit artifact.

### K4. Island and macro sovereignty gate

- **Entry:** K3 draft masks and independent coast decisions.
- **Exit:** every one of 18 detached Shattercap terrain components addressed by identity, including eastern/southeastern ones; Coast 40 separately resolved; 12-pixel Windward secondary component reviewed; no cross-parent physical misassignment or implicit sovereignty by detached shape.
- **Fail/HOLD:** blanket transfer of Coast 40 or all northern islands, dropping small terrain pieces or treating terrain-only component IDs as political IDs.
- **Current:** NOT ENTERED.

### K5. Settlement, travel, map-generation and save-impact review

- **Entry:** independently defensible K3–K4 draft territorial masks; before any canonical write.
- **Exit:** rerun `scripts/audit-settlement-map-consistency.mjs` and inspect `settlements.json` (88 records in existing audit), `region_localities.json`, `world_hexes.json` (47 semantic hexes), `world_hex_edges.json` (49 edges), `travel_networks.json`, `world_maps.json`, `regions.json`, `world_map_features.json`, biome/climate zones, region context for spawn/crafting/travel, world generation, persistence and migration. Record every impacted region ID/anchor/edge/settlement before any edit.
- **Fail/HOLD:** unreviewed settlement shifted to water/another biome/region, broken edge or named corridor, mismatch between world-loading/local generation and canonical macro geography, Save identity or route changed silently.
- **Current:** authorities inspected at file/schema level; **no native dependency audit or simulation run**.

### K6. Approval and canonical implementation (separate authorized branch)

- **Entry:** K0–K5 all PASS with owner written approval of exact polygons, new region count, island cases and migration plan.
- **Exit:** separate implementation change using existing infrastructure, measured accepted masks, old-to-new ID ledger, tests and map render reviewed; stale proposals marked superseded without deleting evidence. PR #79 remains a read-only evidence draft unless explicitly authorized otherwise.
- **Fail/HOLD:** approval missing, any island or overlap unresolved, edited source PNGs, premature merge, changes to runtime/settlements/Saves in this read-only branch.
- **Current:** BLOCKED.

## PowerShell native verification: exact commands

In the already-existing detached test worktree `C:\Codex\EoL-macro-raster-pass0`, after confirming it has **no local changes**, use:

```powershell
$ErrorActionPreference = 'Stop'
$worktree = 'C:\Codex\EoL-macro-raster-pass0'
$branch = 'connector/first-world-raster-macro-evidence-pilot-2026-11-12'
$dir = Join-Path $env:TEMP 'first-world-pass0-review'
if (-not (Test-Path $worktree)) { throw "Missing detached worktree: $worktree" }
Set-Location $worktree
if ((git status --porcelain).Length -gt 0) { throw 'Worktree not clean; stop before fetching' }
git fetch origin $branch
if ($LASTEXITCODE -ne 0) { throw 'Fetch failed' }
git switch --detach "origin/$branch"
if ($LASTEXITCODE -ne 0) { throw 'Detached checkout failed' }
$head = git rev-parse HEAD
"HEAD=$head"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$tests = @(
 'tests/unit/first-world-raster-macro-evidence.test.mjs',
 'tests/unit/first-world-environment-evidence.test.mjs',
 'tests/unit/first-world-source-pair-qa.test.mjs',
 'tests/unit/first-world-coast10-ecology-review.test.mjs',
 'tests/unit/first-world-kaelvar-locality-review.test.mjs',
 'tests/unit/first-world-shattercap-union.test.mjs',
 'tests/unit/first-world-kaelvar-candidate-comparison.test.mjs'
)
node --test @tests
if ($LASTEXITCODE -ne 0) { throw 'Native unit tests failed' }
$json = Join-Path $dir 'kaelvar-layout-A-B-source-comparison.json'
$svg = Join-Path $dir 'kaelvar-layout-A-B-source-comparison.svg'
node scripts/first-world-kaelvar-candidate-comparison.mjs --compare > $json
if ($LASTEXITCODE -ne 0) {
 Remove-Item $json -ErrorAction SilentlyContinue
 throw 'Kaelvar comparison JSON failed'
}
node scripts/first-world-kaelvar-candidate-comparison.mjs --svg > $svg
if ($LASTEXITCODE -ne 0) {
 Remove-Item $svg -ErrorAction SilentlyContinue
 throw 'Kaelvar comparison SVG failed'
}
$r = Get-Content $json -Raw | ConvertFrom-Json
$r.status
$r.sourceImages
$r.oldInkIncludedComponent |
 Select-Object componentId,landPixels,unclaimedLandPixels,directSameMacroChildOverlapLandPixels
$r.shattercapUnion |
 Select-Object deduplicatedTerrainCells,mainlandTerrainCells,detachedTerrainCells,
   overlappingTerrainCells
$r.shattercapUnion.retainedDetachedComponents |
 Select-Object componentId,uniqueTerrainCells,terrainCentroid | Format-Table -AutoSize
$r.layoutA
$r.layoutB
$r.sourcePartProvenance |
 Select-Object sourcePartId,terrainCandidateCells,mainlandTerrainCells,
   detachedTerrainCells | Format-Table -AutoSize
"SVG=$svg"
Invoke-Item $svg
git status --short
```

Return **HEAD SHA**, Node TAP test totals/failures, `$r.sourceImages` with the two hashes, current `oldInkIncludedComponent` and `terrainOnlyMainlandComponent` summaries, Shattercap retained component rows and full source ID ledger, the Layout A/B output, and a screenshot of the four-panel SVG with its legend visible. The JSON/SVG stay outside the repository; the worktree should remain clean.

## Subsequent handoff after native K1 pass

1. Inspect a source-crop RGB/relief transect through northern Shattercap versus the southeast and the Windward peninsula, with exact source grid coordinates. Note whether continuous color clusters track actual terrain, river ink or map decoration.
2. Locate any authentic source-map legend or original generation specification. Without one, flag derived ecological terms **unknown** and request owner judgment on swatch labels and elevation-ramp semantics.
3. Only after E0–E2 pass, calculate contiguous habitat patches plus ecotone-width sensitivity; do not paint a territory merely because a former child footprint covers that cell.
4. Convert K3 approved A/B landscape evidence into actual nonoverlapping candidate masks with full original feature provenance; compare environmental contradictions and dependency impacts. Do not merge PR #79 until all approvals exist.

**Safety:** no existing PNG/JSON canonical region/settlement/route/hex, game runtime, generator, Save or master-branch content was authorized to change here. No region count decision, fourth-region name, coast or island sovereignty decision has been made.
