# First World continent reconstruction: Pass 0 implementation and Coast 10/40 hold

Date: 2026-11-12  
Branch: `connector/first-world-raster-macro-evidence-pilot-2026-11-12`  
Base: draft PR #78 head `41a8ab1dd8c35cae12c8b392fa12da55c74401db`  
State: **CODE_READY / NATIVE_RASTER_WITNESS_NOT_YET_RUN / BOUNDARY_APPROVAL_HELD**

## Authority and constraints

This is the first isolated engineering slice from the full continent–region–biome
revision audit of Nov 12, not a canonically accepted redraw. The companion
`first-world-macro-ownership-review-2026-11-12.json` records all 15
foreign-landmass candidates (74,072 **2px-vector-sampled** px², *not*
independently proven wrong area). It includes Coast 10 and Coast 40 as one
Kaelvar–Serathyl approval cluster, not two independent automatic edits.

Existing vector coastlines and generated biome zones must **not** certify a
physical landmass. The PNG files under
`packages/content/base/world/map_assets/` are independent input. Neither
the old global nearest-anchor partition nor any reviewed-looking map overlay
has authority to move Serathyl land, merge island chains or rename biomes.

No source PNG, canonical polygon JSON, region hierarchy, settlement,
route, hex, Save, runtime, launcher or master branch file is edited here.

## Contents

- `scripts/lib/first-world-source-png.mjs`: strict, dependency-free,
  noninterlaced 8/16-bit PNG decoding; original generator RGB sea/water
  threshold; source crop and nearest-center projection to 2048×1152;
  4-neighbor and 8-neighbor component enumeration without size cutoffs.
- `scripts/lib/first-world-reviewed-macro-planner.mjs`: explicitly approved
  **spatial mask** ownership only; forbids water, overlaps, foreign child anchors
  and local child claims across separate 4-neighbor physical components.
  Unreviewed mainland and islands stay **unassigned**.
- `scripts/first-world-raster-evidence.mjs`: read-only native evidence report
  for all 68 traced coasts, all 159 effective footprints, all 15 foreign-owner
  candidates, full 4/8 component catalogs, and the joint Coast 10/40 pilot.
  The script checks the audited PR head geometry Git blob SHA before working.
- `docs/design/first-world-macro-ownership-review-2026-11-12.json`:
  pending-only reviewer ledger. There are **no approved masks** in this version.
- `tests/unit/first-world-raster-macro-evidence.test.mjs`: synthetic PNG,
  connectivity, unassigned island, approved-mask, water/overlap and cross-macro
  anchor tests.

## Reproduce in a separate local worktree

Do not run the old `regenerate_world_map_features.ps1` against canonical data.

```powershell
git fetch origin connector/first-world-raster-macro-evidence-pilot-2026-11-12
git worktree add --detach ..\EoL-macro-raster-pass0 origin/connector/first-world-raster-macro-evidence-pilot-2026-11-12
Set-Location ..\EoL-macro-raster-pass0
node --test tests/unit/first-world-raster-macro-evidence.test.mjs
node scripts/remove-verified-offshore-footprints.mjs --check --json
node scripts/first-world-raster-evidence.mjs --check > first-world-pass0-evidence.json
node scripts/first-world-raster-evidence.mjs --svg-pilot > first-world-coast10-40-baseline.svg
```

The two generated outputs in this example are *untracked local review files*.
Do not add them as canonical map geometry. The existing 42-square `--check`
may report SOURCE_ALREADY_CLEAN or fail with the known 201-record physical
source not yet rewritten; this is a separate gate. This read-only witness
applies the accepted 42 ID exclusions in memory, always expecting 159 effective
parts. It does not falsely claim physical deletion.

### Independent terrain witness

1. Record the SHA-256 of both original PNG bytes and the image natural dimensions.
   Verify the declared source crop (x=60, y=60, width=3976, height=2235)
   is within each raster and projects to the 2048×1152 canonical reference.
2. Note that this tool samples *nearest source pixel centers*, whereas the
   previous PowerShell generator used high-quality bicubic downscaling to
   1024×576. Disagreements at coast pixels are **evidence for review**, not
   an excuse to overwrite the existing map.
3. Inspect every 4-neighbor component and every 8-neighbor diagonal join,
   including tiny legitimate islands. Never omit a component for area alone.
4. Compare raster land/water classifications to the 68 existing vector coasts
   and 159 retained region parts. Keep coast 64's unmapped island and
   the off-coast remainder as unresolved rather than silently adding/removing.
5. Use the SVG preview to compare Coast 10 + Coast 40 together: yellow old
   coast outlines, blue Kaelvar edges, red Serathyl edges, white selected
   Windward and Verdant witness footprints, and underlying raster land/water.
   This is a **baseline review**. No corrected candidate is yet authorized.

### Review and planned transfer gate

- Confirm the Coast 10 land now attributed to
  `feature.region_windward_spine.part_1` belongs physically and politically
  to Kaelvar, and inspect the Coast 40 split involving Windward `part_2` and
  Verdant Thalos `part_6` individually. The 4,404 px² Coast 10 value in the
  prior audit is a *2px-vector sample*, not the native raster verdict.
- Choose a specific Kaelvar Verdant Thalos / Shattercap child boundary for
  recovered land; never assign to the nearest continent-wide anchor.
- Author nonoverlapping *approved* macro mask polygons with a recorded
  `approvalRef` and the exact biome PNG SHA-256 as `evidenceSha256`.
  Re-run the independent witness; no mask may include raster water or
  overlap another accepted macro mask.
- Give every approved physical island its own recorded macro decision and
  place in-component child anchors before any local subregion partition.
- Recheck all 15 foreign-majority candidates, Coast 31/8, 3/41/53,
  45, 51/58, 40 and 64, and the 12 unpolygonized island subregions in later
  passes. No biome interpretation or maritime jurisdiction changes yet.

## Entry / exit / failure

**Entry:** draft PR #78 at the audited 41a8ab1 head; original map PNGs,
world-map registration and 42-ID exclusion manifest present.

**Pass 0 code exit:** scripts and synthetic tests reviewed; no canonical
changes; held decision ledger preserves all 15 candidates.

**Raster witness exit (not yet met):** native tests pass, both PNG images
decode and register, sha+dimensions are recorded, all components are
enumerated, Coast 10/40 SVG is visually inspected against the original
map, and every contested pixel has a reviewable raster explanation.

**Macro ownership exit (not yet met):** reviewed exclusive masks cover
intended land; unresolved or multi-parent physical landmasses are explicit
and blocked; children cannot cross macros or physical island components;
all accepted splits have source provenance. At that point a *separate*
canonical reconstruction branch or explicitly gated write path may be
considered.

**Failure / HOLD triggers:** original PNG cannot decode, native dimension or
crop mismatch, audited source blob changed, any of 42 exclusion IDs
reappearing in effective footprints, missing polygon/candidate, water in an
approved mask, overlapping macro masks, no in-component child anchors,
unapproved islands, or browser mismatch. These must not be bypassed by
vector-majority ownership or generic nearest-anchor behavior.

## Live connector limitation

The GitHub connector could inspect source code and confirm the original
raster files are in the tree, but it cannot supply raw binary PNG pixels to
this session, and it does not execute Node, PowerShell or the Vite viewer.
Therefore the checked-in source and synthetic test suite are **not**
proof that the real source rasters have decoded or Coast 10/40 has been
visually corrected. Keep the PR draft and do not merge.

## Follow-up: native component ownership review (after first local witness)

The first local witness confirmed the geometry checkout differs from the
audited Git blob only in CRLF-to-LF line endings. Native source-raster evidence
reported **167 four-neighbor** versus **160 eight-neighbor** land components,
with **six groups of diagonal-only joins** and **585,834 raster land pixels**.

The owner's read-only component summary showed:

| Native four-component | Native land pixels | Existing labels seen |
| --- | ---: | --- |
| **25** | **86,417** | Kaelvar Auric Marches, Shattercap Isles, Verdant Thalos; Serathyl Windward Spine Part 1 |
| **82** | **68** | Kaelvar Verdant Thalos |
| **91** | **229** | Kaelvar Verdant Thalos Part 6 and Serathyl Windward Spine Part 2 |

Component 25 is the known southeastern Kaelvar intrusion candidate.
Component 82 is detached land near Coast 10 and is **not** part of
component 25. Component 91 is the physically separate Coast 40 island;
shared 4-neighbor connectivity does **not** confer political ownership.
The previous report listed whole-footprint totals even in the per-component
selection, so those values cannot be treated as component-specific areas.

### Next read-only commands

After fetching the latest draft branch in the detached local worktree,
run the unit tests, then re-run the source witness:

```powershell
node --test tests/unit/first-world-raster-macro-evidence.test.mjs
node scripts/first-world-raster-evidence.mjs --check > first-world-pass0-evidence.json
node scripts/first-world-raster-evidence.mjs --svg-coast40 > first-world-coast40-closeup.svg
```

The JSON `pilot.componentOwnershipEvidence` now contains exact
**reference-pixel** intersections of every selected source polygon on
each Coast 10/40 4-connected land component. It separately identifies:

- Current owner labels per component, with per-feature
  `landPixelsOnComponent` values.
- Unique footprint-covered land pixels versus land without any source
  region footprint.
- Direct cross-macro polygon overlap and same-macro child-region overlap.
- Detached land components that must not inherit mainland ownership.

These values are counts of **2048×1152 grid pixels**. Existing names ending
in `Px2` in legacy report sections are retained for backward compatibility
but must not be interpreted as physical square kilometers or pixels squared.

The additional `--svg-coast40` output crops and magnifies the Coast 40
island at 12× using the same independent land/water raster and existing
region outlines. It is a baseline preview, not an approved boundary
or a proposal to move all of the island into either macro.

**Gate remains held:** no approved replacement political masks; neither
the mainland's recovered land nor the island's administrative split has a
signed destination subregion. Do not treat the owner's component report
as permission for automatic polygon transfer or overwrite the canonical map.

### Coast 40 SVG visibility correction

The first owner-viewed 12x Coast 40 close-up displayed thick white selected-region
strokes over much of the island and browser white outside the SVG canvas.
This is a **presentation issue**, not evidence of missing land or an accepted
ownership transfer. The close-up now uses screen-pixel-consistent,
`vector-effect="non-scaling-stroke"` blue/red region and gold coastline
hairlines and omits the broad white selection border. Re-generate the SVG
after fetching the latest draft commit; do not use the earlier white-filled
preview as proof of source terrain or polygon overlap. The exact component
ownership matrix remains the required next evidence gate.

## Owner-reported exact native component intersection witness (2026-11-12)

The owner ran the newer per-component evidence report with the original
`First World Biome.png` and the verified source geometry. The figures below
are **reference-grid land pixels**, not coordinates, px² or square kilometers.
These are observations of existing source polygons, not an authorized
political transfer.

| 4-neighbor component | Land | Footprint-covered union | Unclaimed land | Direct cross-macro overlapping cells |
| --- | ---: | ---: | ---: | ---: |
| 25, Kaelvar mainland | 86,417 | 85,055 | 1,362 | **0** |
| 91, separate Coast 40 island | 229 | 207 | 22 | **0** |

**Component 25 current source assignments (exact per-component raster cells):**

- `feature.region_auric_marches.part_4`: Kaelvar, 26,271
- `feature.region_shattercap_isles.part_7`: Kaelvar, 25,342
- `feature.region_verdant_thalos.part_1`: Kaelvar, 24,740
- `feature.region_shattercap_isles.part_15`: Kaelvar, 4,464
- `feature.region_windward_spine.part_1`: Serathyl, **4,326**

The feature-cell totals sum to **85,143**, 88 higher than the
**85,055 unique covered cells**. This is multiple-coverage accounting
within the current continental labels. The source report records
`directCrossMacroOverlapLandPixels=0`; examine
`directSameMacroChildOverlapLandPixels` and
`anyChildOverlapLandPixels` before treating the 88 as a particular
pair or number of overlapping cells.

**Component 91 current source assignments:**

- `feature.region_windward_spine.part_2`: Serathyl, **110**
- `feature.region_verdant_thalos.part_6`: Kaelvar, **97**
- Exactly **22** currently unclaimed raster-land cells; **0**
  direct cross-macro overlapping cells.

**Decision classification:**

1. **Coast 10 / component 25:** the previously confirmed geographic
   Serathyl intrusion is now independently shown to share the large
   Kaelvar mainland's native 4-neighbor physical component. Prepare
   the 4,326-pixel Windward Part 1 for *proposed* Kaelvar macro
   reassignment, but hold exact recipient child-region split between
   Auric Marches / Verdant Thalos / Shattercap Isles pending geographic
   evidence and explicit owner approval. Preserve the 1,362 unlabeled
   cells as a separate coverage-repair gate.
2. **Coast 40 / component 91:** source ownership is a disjoint 110/97
   Serathyl–Kaelvar split over continuous island land. Raster
   connectivity does not establish political jurisdiction. Preserve
   the coastline and defer whole-island transfer, split-border policy,
   and allocation of its 22 unlabeled pixels to explicit owner review.
3. **Component 82:** a separate 68-pixel land component near Coast 10
   labeled Verdant Thalos in the prior witness; never silently merge
   it into mainland component 25 or infer marine connectivity.

**Exit still held:** no approved territorial masks, child
split provenance, island sovereignty decision, or canonical source write.
The absence of direct cross-macro overlap proves this is an ownership
partition issue, not simply duplicate overlaid polygon fills.
