# First World landmass-first reconstruction contract and Kaelvar R0–R3 pilot

Date: 2026-11-13
Status: CONTROLLING PLANNING CONTRACT; NO REGIONAL MASK APPROVAL; CANONICAL PUBLICATION HELD
Parent evidence: draft PR #79, head da45c0d21c15f403bcd173016ed2e88149e98f30
Companion machine-readable review-only file: docs/design/first-world-kaelvar-landmass-reconstruction-ledger-2026-11-13.json

## 1. Decision and branch ownership

Physical geography determines candidate landmasses; authored region hierarchy, placement qualifiers, descriptions and independently anchored features guide provisional region placement; independent environment, hydrology and dependency evidence validates proposals; only owner approval publishes canonical geography. This landmass-first order replaces calibration-first *sequencing*, not the calibration and verification requirements.

PR #79 is a frozen-in-purpose, separate, draft, unmerged evidence branch. This new stacked draft branch is based on that exact evidence head and should be reviewed against it, not mixed into that PR or master. No changes in this slice to map PNGs, world_map_features.json, regions.json, exclusions, biome zones, settlements, travel networks, hexes, world loading, generation, runtime or Saves. The ledger and pure validation helper are proposal-only. Do not merge the planning PR merely because its synthetic checks pass.

Existing sources remain independently authoritative in their lanes:
- World place identity and hierarchy: packages/content/base/world/regions.json; never delete or rename a region to retire an incorrect visual footprint.
- Existing reference visual geometry: packages/content/base/world/world_map_features.json; original nested feature IDs are immutable provenance for this exercise, not physical or political truth.
- Source geography inputs: original biome/elevation PNG bytes, the audited registration crop, source-pair classifier and physical component witnesses.
- Original shoreline, river, coast, mountain and pass records: independent source/visual observations requiring interpretation, not automatic regional ownership.
- Descriptive ecology and settlement/locality/route data: constraints and downstream dependencies, not alternative land/water classifiers.
- Proposed future semantic map_features authority: a different named-feature collection; do not repurpose its schema for temporary territory.
- Owner-reviewed masks and approvals: future separate noncanonical proposal artifacts first, canonical geometry only at R6.

Keep the existing 42 approved offshore source exclusions exactly; Part 1 Shattercap is a *review*, not exclusion #43. Preserve every physical component regardless of size.

## 2. Documentation authority and disposition audit

| Source | Disposition | What survives / what changes |
| --- | --- | --- |
| world-geography-authority-boundary-decision.md | CURRENT | Place hierarchy, visual geometry, polity and ecology separation govern this work. |
| world-map-feature-schema-decision.md and first-world-map-feature-content-seed-plan.md | CURRENT, SEPARATE LANE | Future geometry-free named features must not be used as proposed polygon owners. |
| first-world-macro-reconstruction-pass0-2026-11-12.md and first-world-macro-ownership-review-2026-11-12.json | REUSABLE EVIDENCE; SEQUENCING SUPERSEDED | Reuse source audit and pending macro ledger; do not make approved calibrated macro masks a prerequisite to writing a **reversible proposal**. Existing canonical publication still demands approvals. |
| first-world-source-pair-palette-qa-2026-11-12.md and first-world-source-pair-connectivity-sensitivity-2026-11-12.md | CURRENT EVIDENCE | Distinguish terrain candidate, blue, shared ink, connectedness and numeric scenario namespaces. |
| first-world-regional-environment-suitability-audit-gate-2026-11-12.md | REUSABLE; CALIBRATION-FIRST ORDER SUPERSEDED | Color/relief/hydrology validation still required at R5, and uncertainty must be marked during R3. |
| first-world-kaelvar-regional-locality-review-2026-11-12.md; first-world-shattercap-dedup-island-retention-gate-2026-11-13.md | CURRENT EVIDENCE | Preserve all Shattercap source parts and 18 terrain-only detached components; no automatic sovereign allocation. |
| first-world-kaelvar-layout-a-b-source-review-gate-2026-11-13.md | CURRENT EVIDENCE, PROPOSALS NOT DRAWN | K1 native 51/51 and four-panel render accepted; K3 calibration-before-first-border order replaced by this R0–R3 proposal method. Layout B remains eligibility-only. |
| first-world-kaelvar-k2-source-calibration-evidence-gate-2026-11-13.md | CURRENT VISUAL EVIDENCE; SEMANTICS HELD | Three-panel rendering seen; native K2 JSON/TAP and ecological legend not independently accepted. |
| first-world-settlement-geography-and-cultural-distribution-audit-2026-11-12.md, core-world-entry-exact-geography-anchor-candidate-inventory-2026-11-09.md, Starfall/world-entry plans | DEPENDENCY REFERENCES, NOT TERRITORY AUTHORITY | Recheck all applicable localities, culture, ports, travel and starting-area invariants at R5; no edits now. |
| Old nearest-anchor and equal-area heuristic proposals, generated biomeZones and political overlays as biome proof | SUPERSEDED/UNSAFE FOR THIS TASK | Never run to allocate disputed regions, physical islands or the eastern candidate. |

Historical K1/K2 notes are not rewritten to pretend old native evidence has been rerun. This newer decision controls sequencing where older plans conflict.

## 3. Immutable source and evidence contract

- 4096×2355 original biome/elevation PNGs; audited crop (x=60,y=60,width=3976,height=2235) mapped to 2048×1152.
- PNG SHA-256: biome 9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12; elevation 02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d.
- Existing vector-source Git blob: ec59ed66b7eaee4502dc56709a2f266b17b3cb17; accepted exclusions: 42; effective footprints: 159; coastlines: 68.
- Terrain-only Auric-referenced four-neighbor component 30: 79,419 candidate cells, 204 unclaimed, 84 internal child overlap; older shared-ink-inclusive component 25: 86,417 candidate cells, 1,362 unclaimed, 88 overlap.
- Shattercap deduplicated candidate terrain: 30,938 unique, 27,245 on terrain-only component 30, 3,693 on 18 independently retained detached components, 0 same-Shattercap terrain overlap. These are source-classification measurements, not jurisdiction.
- Windward Part 1: 3,661 terrain-only mainland candidates and 12 detached; preserve both. Shattercap Part 1: 684 shared-blue, 0 terrain; hold as source blue-edge artifact candidate.
- K1 51/51 native tests and original four-panel SVG visual passed. K2 three-panel render visually passed; native K2 TAP/JSON and palette semantics are not claimed.

Every new candidate must name source image hashes, geometry blob, classification scenario, grid registration, evidence provenance, reviewer and version. Physical component IDs always require an explicit namespace and source hash; never reuse as political IDs. Candidate cells are not certified physical land until coast/ink judgment.

## 4. Staged, reversible proposal model

Never mutate the canonical geometry as a substitute for an intermediate drawing. Store proposed region masks separately and make gaps visible. The ledger distinguishes **region identity state**, **source footprint disposition**, **physical component claim**, **proposed spatial mask**, and **approval**. These are not one enum.

Provisional region states: PLACEMENT_SPEC_PENDING, PROPOSED_PLACEMENT_REVIEW, UNPLACED_PENDING_PARENT_RECONCILIATION, DISPUTED_PARENT, APPROVED_CANDIDATE_NOT_PUBLISHED. A bad footprint is WITHHELD_FROM_PROPOSAL, not deleted. Terrain can be UNASSIGNED_PROPOSAL, INK_OR_COAST_UNRESOLVED, or ISLAND_SOVEREIGNTY_PENDING. A new mask can be ECOLOGICAL_REVIEW_PENDING or READY_FOR_OWNER_REVIEW. Schema names here are planning contracts, not new canonical fields.

Each candidate mask must carry maskId, regionId, parentId, physical component namespace, sourceHashes, 2048×1152 grid/crop, originalFeatureIds (one-to-many and many-to-one allowed), rasterized cells or versioned explicit vector coordinates, unknown/ink exclusion treatment, confidence/uncertainty bands, reviewer decisions and a reversible before/after ledger. Empty masks do not imply an empty region. An explicit empty/unknown placement must not escape this workspace into gameplay. Displaced identities remain canonical records and acquire queued tasks under their *authored parent*, not a guessed recipient.

The current JSON ledger intentionally has no regional masks or approved region transfers. It is an auditable R0–R2 hold record, not an illustration of completed R3.

### R0 – Physical landmass inventory

Entry: exact original source files and registration, complete effective footprint/exclusion/coast inventory, source-pair topology reports.
Process: freeze bytes and component namespace; inventory candidate mainland, detached cells, unresolved ink and water channels; retain all source IDs; crosswalk historical component 25 to current terrain-only 30 without equating them.
Exit/success: invariant hashes and counts verified; every detached piece has a durable witness and all unknown terrain is explicitly reported.
Failure/HOLD: missing original PNG, changed source SHA, missing retained component, exclusion drift, ambiguous ink treated as land/water.
Rollback/handoff: discard generated diagnostics only; preserve canonical source. Hand off source-indexed physical components and unresolved categories to R1.

### R1 – Parent landmass identification

Entry: R0 component inventory and canonical macro-region catalog.
Process: compare geographic continuity, maritime separation, relative placement and authorial macro descriptions. Record candidate parent with evidence and uncertainty; coast proximity alone never assigns islands.
Exit/success: every selected physical component has either owner-reviewed candidate macro parent or PARENT_PENDING/DISPUTED_PARENT. No silent automatic sovereignty.
Failure/HOLD: inferred islands by proximity, unreviewed Serathyl/Kaelvar transfer, missing Coast 40 case.
Rollback/handoff: revert only proposal assignments; leave physical inventory intact. Hand off parent candidates plus unowned queue to R2.

### R2 – Authored region intent reconciliation

Entry: R1 candidate parent and actual child catalog, authored environment, cultural/settlement and directional descriptions.
Process: record west/east/north/south, inland/coast/island, mountain/rivers, neighbor and settlement constraints. Explicitly mark stale or contradictory document claims; do not change authorship silently.
Exit/success: one reviewed placement specification per child, with conflicts, exceptions and source citations. Resolve whether candidate physical landmass plausibly belongs to Kaelvar; unresolved islands remain R1 pending.
Failure/HOLD: fabricated fourth child, treating existing source footprint as intent, unsupported biome conversion or missing opposing-parent identities.
Rollback/handoff: revise specifications only. Hand off constraints and exceptions to R3 without demanding completed color calibration.

### R3 – Provisional region reconstruction

Entry: R0 physical candidate grid, R1 provisional parent, R2 child specs, and versioned noncanonical proposal workspace.
Process: trace region-shaped polygons on actual source geography using authored placement/landform qualifiers; use existing scanline mask rasterization and physical components for checks. Do not use the existing automatic nearest-child-anchor owner distribution. Support explicit unassigned terrain and withheld source claims. Link each new proposed piece to original feature IDs and record old source claims retired from the **proposal** only; never delete the original.
Exit/success: reviewable Layout A candidate masks or an explicit defensible R3 HOLD, full-grid assignment/overlap/unassigned counts, source-part crosswalk, boundary uncertainty annotations, every detached component held/placed/rejected with evidence, zero accidental overlaps or off-terrain claims. Environmental uncertainty is visible and allowed.
Failure/HOLD: invented borders to eliminate gaps, unreviewed island owner, automatic Windward transfer, missing provenance, shared-ink fabricated land, inherited biomeZones used as proof.
Rollback/handoff: delete/revert only provisional proposal files; unchanged canonical assets and original source IDs. Send proposal and open exceptions to R4 and R5.

### R4 – Cross-landmass reconciliation

Entry: R3 proposal(s) and queued displaced region identities.
Process: consider misplaced Windward on **Serathyl** reconstruction and other displaced regions on their actual authored parents. Resolve contested R1 parent claims and cross-landmass nonoverlap with explicit review.
Exit/success: queue entries closed by evidence-backed placement or remain explicitly pending; no orphan canonical identities.
Failure/HOLD: forced claim on a continent not yet reconstructed, lost original polygon source identities.
Rollback/handoff: revert proposal association only; send traceable reconciliation results to R5.

### R5 – Environmental and dependency validation

Entry: coherent provisional masks and R4 conflict register.
Process: independently check exact-source color legend, calibrated elevation transfer function, source coast/river/ink/lake separation, ecology and ecotones, disconnected islands, settlements, locality bands, resources, hex/edge/route corridors, starting-site and world generation/loading/Save impact.
Exit/success: signed suitability and dependency matrix, border revisions with reason and provenance, migration-safe publication plan, owner-visible exception disposition.
Failure/HOLD: habitat/height interpretation guessed from RGB, settlement or path falls onto water, cross-parent route breaks, gameplay/save impact not accounted for.
Rollback/handoff: return candidate to R3 with reason; canonical/runtime remains unchanged. Hand off only approved candidate set to R6.

### R6 – Canonical publication

Entry: R0–R5 accepted, separate owner sign-off for exact polygons/islands/new-region choice, explicit dependency and Save migration approval.
Process: separate authorized implementation branch with staged geometry updates, reversible source-to-new crosswalk, tests, visual comparison and migration safety review.
Exit/success: exact approved source identity and landmass geometry published with verified tests, builds, maps and gameplay regression, no lost region identities.
Failure/HOLD: any missing approval, unresolved island, physical drift, broken gameplay/saves, PR still draft/unreviewed.
Rollback/handoff: revert publication commit/migration under approved recovery plan; preserve original snapshot and evidence. No automatic merge.

## 5. Kaelvar fine-detail R0–R3 pilot, ordered gates

**R0.0 freeze:** Read current PR #79 and source hashes. Reuse first-world-kaelvar-candidate-comparison.mjs --compare and --k2-evidence; do not repeat old topology audit unnecessarily. Require the exact native witnesses above, plus the all-Shattercap 15-part source rows. Source hash drift blocks all candidate masks.

**R0.1 mainland and islands:** Terrain-only component 30 is a *physical reference*, not an approved political Kaelvar outline. Preserve 18 Shattercap detached component IDs with nonzero pixel counts: 24(1893), 90(1013), 91(220), 34(118), 21(115), 25(80), 28(64), 47(37), 38(22), 20(20), 71(18), 26(17), 55(16), 95(16), 35(14), 51(13), 96(9), 78(8). Sum: 3693. Coast 40 is a separate two-source-claim decision, not included by blanket ownership rule. Shattercap Part 1 remains 684 blue/0 terrain, in the source ledger but not a candidate dry-land mask.

**R1.0 parent review:** Kaelvar's northwestern continental identity is authored; candidate mainland parent requires owner review against coasts/physical map. No distant island chain is adopted automatically. Keep East/SE islands, Coast 40, Windward 12-cell fragment and all unresolved ink separately traceable.

**R2.0 Auric:** region.auric_marches, parent region.kaelvar, kaelvar_western_interior; test western dry scrub, steppe, golden plains, broken mineral uplands, ore ridges, sparse mining settlements, caravan forts and source water breaks. It is not a blanket owner of everything west of a convenient line.

**R2.1 Verdant:** region.verdant_thalos, parent region.kaelvar, kaelvar_southern_peninsula; test fertile south and coast, Mediterranean woodland/mixed forests, low hills, rivers, farmland, vineyard corridors, ports and managed woodland. Green source biome is a qualitative observation, not yet a mapped biome legend.

**R2.2 Shattercap:** region.shattercap_isles, parent region.kaelvar, kaelvar_northern_coast; test rugged broken northern maritime fringe with cooler shoals, conifer islands, harbors and beacon cliffs; mainland bridgeheads require explicit descriptive/physical justification. Parts 7 and 15's 27,245 shared mainland-footprint cells cannot automatically remain Shattercap. Do not assume every distant detached island belongs to Shattercap.

**R2.3 Windward conflict:** region.windward_spine remains region.serathyl / serathyl_northern_mountains. Its southeastern Kaelvar source Part 1 is WITHHELD_FROM_KAELVAR_PROPOSAL; identity UNPLACED_PENDING_PARENT_RECONCILIATION for this displaced footprint only. Existing canonical region and its Serathyl context remain intact; 3661 mainland and 12 detached source candidates remain traceable. Do not hand these pixels directly to Verdant.

**R2.4 Coast 40:** feature.region_windward_spine.part_2 and feature.region_verdant_thalos.part_6 form a separate contested island review. Neither source feature can certify the island's physical macro sovereignty.

**R3.0 Layout A first:** Use three *existing* child identities, drawing reversible western Auric, southern Verdant and justified northern Shattercap proposals. Explicitly expose unclaimed eastern/inland terrain where authored evidence is insufficient, instead of forcing coverage. Source polygon retirement is a proposal-layer disposition, not a deletion or automatically accepted ownership swap.

**R3.1 topology and provenance:** For each candidate noncanonical mask, check source registration, zero off-candidate terrain pixels unless specifically reviewed ink/coast, mutually exclusive child cells, parent compatibility, each detached component's independent disposition, adjacency and no foreign disconnected component merged by proximity. Keep the 159/68/42 source inventory and source-to-mask crosswalk. Record gap counts by physical component rather than treating any gap as an error that must be filled.

**R3.2 Layout B eligibility only:** An unnamed eastern-mainland child is permitted *only* if distinct, contiguous physical/ecological landscape, hydrology, historical/settlement purpose, boundary logic and owner approval genuinely require it. The existing 30,906-cell Shattercap 7/15 + Windward 1 source **test window** is not the area of a new child or an accepted polygon. Do not create an ID, catalog record or fourth mask for tidy partitioning.

**R3.3 candidate review:** Compare before/source and after/proposed masks over original PNGs with uncertainty overlay. Package coverage/overlap tables, islands, source IDs, cultural/ecological fit and proposed displaced/unknown record ledger. Hold canonical write and move to R4/R5 only with a reviewable result and stated known limitations.

## 6. Bounded engineering scope of this first planning slice

Add only this contract, the pending-only JSON ledger, pure validator, read-only --check CLI and synthetic test. The CLI must check current region parent identity, source feature existence/original membership, source geometry Git blob, PNG SHA-256, 42 exclusions, island count/area arithmetic, no proposal masks, no owner approval and no automatic reassignment. It is a ledger/source-integrity check, **not** a K2 semantic acceptance or R3 mask generator.

At next executable gate, first run this CLI and the prior native suites, review the K2 JSON and rendered SVG; then begin manual source-aligned Layout A proposal only in a noncanonical workspace. When interpreting the environment, call unknown land/ink/hydrology honestly and preserve holes. A proposed child can have zero provisional assigned cells without deleting its region identity.

## 7. PowerShell 7 native handoff (safe, no repo artifacts)

Use an isolated detached worktree, pin the branch SHA shown in the PR, and write results under TEMP. Do not use git reset/clean, do not check out into a dirty worktree, and do not launch canonical regeneration. The final PR handoff must supply the exact new branch SHA.

~~~powershell
$ErrorActionPreference = 'Stop'
$repoRoot = 'C:\Codex\EoL'
$branch = 'connector/first-world-landmass-first-kaelvar-r0-r3-plan-2026-11-13'
$worktree = 'C:\Codex\EoL-landmass-r0r3-verify'
$out = Join-Path $env:TEMP 'first-world-landmass-r0r3'
if (-not (Test-Path $repoRoot)) { throw 'Repository clone missing' }
if (@(git -C $repoRoot status --porcelain).Count) { throw 'Base repository dirty: do not alter' }
$remoteReadback = (git -C $repoRoot ls-remote origin "refs/heads/$branch")
if ($LASTEXITCODE -ne 0 -or -not $remoteReadback) { throw 'New branch not published' }
$expectedHead = (($remoteReadback -split "\s+")[0]).Trim()
if ($expectedHead -notmatch '^[0-9a-f]{40}$') { throw 'Invalid SHA' }
git -C $repoRoot fetch --no-tags origin $branch
if ($LASTEXITCODE -ne 0) { throw 'Fetch failed' }
if ((git -C $repoRoot rev-parse "refs/remotes/origin/$branch").Trim() -ne $expectedHead) { throw 'Branch changed after readback' }
if (-not (Test-Path $worktree)) {
  git -C $repoRoot worktree add --detach $worktree $expectedHead
  if ($LASTEXITCODE -ne 0) { throw 'Cannot create isolated worktree' }
}
if (@(git -C $worktree status --porcelain).Count) { throw 'Verification worktree dirty' }
git -C $worktree switch --detach $expectedHead
if ($LASTEXITCODE -ne 0) { throw 'Cannot checkout reviewed SHA' }
Set-Location $worktree
New-Item -ItemType Directory -Force $out | Out-Null
node --check scripts/lib/first-world-landmass-proposal-ledger.mjs
if ($LASTEXITCODE -ne 0) { throw 'Validator syntax failure' }
node --check scripts/first-world-landmass-proposal-audit.mjs
if ($LASTEXITCODE -ne 0) { throw 'Audit CLI syntax failure' }
$tests = @(
  'tests/unit/first-world-raster-macro-evidence.test.mjs',
  'tests/unit/first-world-environment-evidence.test.mjs',
  'tests/unit/first-world-source-pair-qa.test.mjs',
  'tests/unit/first-world-coast10-ecology-review.test.mjs',
  'tests/unit/first-world-kaelvar-locality-review.test.mjs',
  'tests/unit/first-world-shattercap-union.test.mjs',
  'tests/unit/first-world-kaelvar-candidate-comparison.test.mjs',
  'tests/unit/first-world-kaelvar-k2-source-probes.test.mjs',
  'tests/unit/first-world-landmass-proposal-ledger.test.mjs'
)
node --test @tests 2>&1 | Tee-Object -FilePath (Join-Path $out 'all-first-world-tests.txt')
if ($LASTEXITCODE -ne 0) { throw 'Native test failure' }
node scripts/first-world-landmass-proposal-audit.mjs --check > (Join-Path $out 'r0-r3-ledger-audit.json')
if ($LASTEXITCODE -ne 0) { throw 'R0-R3 ledger/source identity failure' }
node scripts/first-world-kaelvar-candidate-comparison.mjs --compare > (Join-Path $out 'kaelvar-k1-comparison.json')
if ($LASTEXITCODE -ne 0) { throw 'K1 source comparison failure' }
node scripts/first-world-kaelvar-candidate-comparison.mjs --k2-evidence > (Join-Path $out 'kaelvar-k2-evidence.json')
if ($LASTEXITCODE -ne 0) { throw 'K2 source JSON failure' }
node scripts/first-world-kaelvar-candidate-comparison.mjs --k2-svg > (Join-Path $out 'kaelvar-k2-source.svg')
if ($LASTEXITCODE -ne 0) { throw 'K2 SVG generation failure' }
$r = Get-Content (Join-Path $out 'r0-r3-ledger-audit.json') -Raw | ConvertFrom-Json
if ($r.status -ne 'R0_R3_LEDGER_VALID_PLACEMENT_HELD' -or $r.placementApproved -ne $false -or $r.canonicalWritable -ne $false -or $r.pendingDetachedComponents -ne 18 -or $r.pendingDetachedTerrainCells -ne 3693) { throw 'Ledger incorrectly permits publication or loses island witness' }
$k = Get-Content (Join-Path $out 'kaelvar-k2-evidence.json') -Raw | ConvertFrom-Json
if ($k.status -ne 'K2_RAW_SOURCE_PROBES_NOT_CALIBRATION_APPROVAL' -or $k.anchors.Count -ne 9 -or $k.windows.Count -ne 9 -or $k.transects.Count -ne 7) { throw 'K2 gate drift' }
[xml]$svg = Get-Content (Join-Path $out 'kaelvar-k2-source.svg') -Raw
if (@($svg.SelectNodes('//*[local-name()="image"]')).Count -ne 3) { throw 'K2 original-image panel drift' }
if (@(git status --porcelain).Count -or (git rev-parse HEAD).Trim() -ne $expectedHead) { throw 'Verification worktree mutated' }
Write-Host "R0–R3 LEDGER/PREVIOUS SOURCE GATES PASS; R3 MASKS AND K2 ECOLOGY UNAPPROVED"
Write-Host "HEAD=$expectedHead"
Write-Host "OUTPUT=$out"
~~~

Do not interpret a local JSON generator passing as source biome/height semantics or approve unresolved islands. Owner to return test totals, ledger audit, K2 output and SVG screenshot; any failure remains HOLD.