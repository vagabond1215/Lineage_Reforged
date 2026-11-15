# C1-AA: qualitative relief review and regional coverage decision

Date: 2026-11-15. Unversioned geography review; development and game-version impacts `none`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`.

**Result: KEEP_C1P_UNCHANGED for both interfaces; final geographic selection HOLD (INSUFFICIENT_SOURCE_EVIDENCE).** This is a conservative authoring disposition, not proof that the existing returns are natural boundaries. Adopt eventual touching primary regions on finalized land as the design direction; do not convert current reserves into permanent regionless belts.

Source checkout: `faaf6dc94fad157e960bac6d0eb21b4237954348` on the existing `connector/c1o-kaelvar-regional-boundary-candidates-2026-11-14` lineage. This completes the visual/native work left by the [C1-AA resume packet](kaelvar-c1aa-connector-safe-prework-and-codex-resume-handoff-2026-11-14.md). The installed Starfall/L2 prompt remains separate and unchanged.

## 1. What the elevation source supports

Both original PNGs are 4096 x 2355, 8-bit RGBA. Direct PNG chunk inspection found only IHDR, IDAT and IEND: no embedded textual legend, palette table or height calibration. The registered crop is `(60,60,3976,2235)` in the original image, mapped to the 2048 x 1152 reference frame. Pixel-center sampling and image-edge overlay registration remain distinct.

The elevation image visibly contains cream/peach/orange irregular filled cells, blue water-like areas, cyan linework, black outlines and a decorative border. It is a rendered color image, not a directly identified numeric height raster. **Whether its fills encode discrete elevation classes, a continuous height ramp, or stylized terrain remains unverified.** An 8-bit channel and the filename do not settle that question. No numeric elevation, relative height ordering, slope, flow direction or watershed is reported.

Repository searches for generator names, heightmaps, palettes, legends and calibration found no original mapping. The source asset's history leads to import commit `0d9f83db59475f86f68468982d227e1c9115cef7`; the duplicate under `unused assets/continents` has the same elevation SHA256. Neither supplies a legend. Existing C1-G/H interpretation code explicitly treats colors as uncalibrated. `scripts/generate_world_map_assets.ps1` does contain tag-based decorative colors, but writes **different** `first_world_elevation.png` / `first_world_biome.png` assets at the vector reference size. Its colors are not provenance for `First World Elevation.png`; the generator was not run.

The existing vector `feature.mountains_auric_highlands` ends at `(270,295)` and `feature.river_thalos_run` follows `(250,300)..(315,425)`. Neither identifies a feature through either seam checkpoint. Thalos Run clips the southwest edge of the southern review window, away from the central interface; it does not identify the cyan mark east of `(319,326)`. Horizontal world scale does not calibrate vertical relief.

Preserved source fingerprints:

| Source | SHA256 / Git blob |
| --- | --- |
| Original elevation PNG | `02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d` |
| Original biome PNG | `9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12` |
| Original vectors, including 599 mainland coastline edges | `9cd6752e9dbca00796e5f7c013066bb0e5a96175` |

To resolve the HOLD, obtain the original project/export settings and palette semantics, or an independently registered contour/landform source with provenance. Qualitative feature identification need not wait for meters if reliable ordinal classes or authored landforms exist. Quantitative slope/hydrology would additionally need justified heights, scale, treatment of painted ink and adequate spatial resolution.

## 2. Northern interface: Veyrholm–Kharuun

Inspected reference window `(265,165,72,61)` and original full-image context around `(292,190)`, with elevation first and biome second. Pale irregular texture continues across the accepted returns and both two-pixel trials. The small differences move piecewise straight lines within the same broad visual texture. No continuous ridge crest, escarpment, plateau edge, ravine or valley is identifiable with sufficient confidence to anchor the seam. Nearby blue/black shoreline artwork supplies coastal context, not an inland dividing line. The biome underlay is predominantly the same green around the checkpoint; the more yellow patches lie farther south in the window.

`NORTH_VEYRHOLM_SOUTH_TWO` moves `(284,190)` to `(284,192)` and changes the local bend. `NORTH_KHARUUN_NORTH_TWO` moves `(301,193)` to `(301,191)` and changes the opposing bend. Neither demonstrates improved relief alignment or a coherent wider natural feature. No independently justified new polyline is authored.

**Recommendation:** retain C1-P now; investigate a future approximate shared inland edge with an optional gradual environmental transition once the source meaning is established. The ten-sample gap is measured provisional polygon reserve, not evidence of a distinct geographic belt. There is no basis to name it, certify its ecology or preserve its exact width indefinitely. Kharuun option B edges 35–58 and Veyrholm's three inland exclusions remain fixed.

## 3. Southern interface: Kharuun–Verdant

Inspected reference window `(291,298,82,71)` around `(319,326)` with wider original-image context. Peach cells span both the gap and the adjacent returns; stronger orange patches appear farther south. Without a legend, this cannot establish which side is higher. Neither baseline nor three-pixel shift follows a demonstrable continuous slope break, plateau boundary or watershed. A cyan irregular line lies east of the checkpoint, between the returns in part of the window; its visible course does not span the complete interface and does not prove a suitable river boundary or valley system.

`SOUTH_KHARUUN_SOUTH_THREE` moves `(314,320)` to `(314,323)` within the textured area. `SOUTH_VERDANT_NORTH_THREE` moves `(320,334)` to `(320,331)` along the northern side of the stronger orange patchwork. Both retain angular inland returns; neither has demonstrated relief superiority. The yellow-to-green biome change reinforces a possible gradual environmental change, but cannot determine the primary edge. A new river-following or contour-following return would be invented with current evidence, so none is proposed.

**Recommendation:** retain C1-P now; provisionally favor the *design concept* of one shared geographic edge plus an optional broader environmental transition, with location and extent held. The fifteen-sample reserve is authoring geometry, not a measured transition width. Preserve all three southeastern Verdant peninsula anchors and the other protected source anchors.

## 4. Comparison matrix in decision-priority order

`INSUFFICIENT` below means `INSUFFICIENT_SOURCE_EVIDENCE`. Source registration is STRONG for every row; topographic semantics are INSUFFICIENT for every row. These are categorical judgments, not weighted scores. A geometry pass cannot override the first criterion.

| Interface / alternative | Relief coherence | Geographic continuity | Transition realism | Eventual coverage | Biome compatibility (secondary) | Geometric validity | Minimality / concern |
| --- | --- | --- | --- | --- | --- | --- | --- |
| North KEEP_C1P_UNCHANGED | INSUFFICIENT; no supported divide | WEAK as a natural line; angular returns lack feature support | PLAUSIBLE gradual context; gap itself unproven | WEAK as final coverage; reserve remains | PLAUSIBLE; shared green context does not divide regions | STRONG existing noncanonical gate | STRONG; no unsupported edit; HOLD final edge |
| NORTH_VEYRHOLM_SOUTH_TWO | INSUFFICIENT; same pale texture | WEAK; shifts bend without regional feature continuity | PLAUSIBLE; no environmental width established | WEAK; still two separate returns | PLAUSIBLE; no new biome evidence | STRONG independently tested | WEAK justification for edit; no relief gain demonstrated |
| NORTH_KHARUUN_NORTH_TWO | INSUFFICIENT; same pale texture | WEAK; opposing bend has no confirmed feature | PLAUSIBLE; no hard frontier implied | WEAK; still two separate returns | PLAUSIBLE; same ambiguity | STRONG independently tested | WEAK justification for edit; no relief gain demonstrated |
| South KEEP_C1P_UNCHANGED | INSUFFICIENT; peach texture crosses seam | WEAK as a natural line; no continuous divide | PLAUSIBLE gradual transition concept | WEAK as final coverage; reserve remains | PLAUSIBLE mixed color belt, not a boundary | STRONG existing noncanonical gate | STRONG; preserve until feature evidence improves |
| SOUTH_KHARUUN_SOUTH_THREE | INSUFFICIENT; move stays within texture | WEAK; does not follow the eastern cyan mark or proven divide | PLAUSIBLE; broad influences remain possible | WEAK; still a gap | PLAUSIBLE; yellow alone cannot justify expansion | STRONG independently tested | WEAK justification for edit; HOLD |
| SOUTH_VERDANT_NORTH_THREE | INSUFFICIENT; orange patchwork has no known height meaning | WEAK; shifted vertex is not a continuous terrain edge | PLAUSIBLE; broad influences remain possible | WEAK; still a gap | PLAUSIBLE; green approach cannot select winner | STRONG independently tested | WEAK justification for edit; HOLD |
| New relief-following line, either interface | INSUFFICIENT | INSUFFICIENT | PLAUSIBLE only as future concept | Potential shared coverage, untested | Not decisive | NOT_EVALUATED: no geometry authored | REJECTED for authoring now: no independently identified feature |

C1-Z residual counts (north 8/9, south 13/12) and gains (30/29/53/54) remain diagnostic evidence only. They did not select a winner. The four trials were not combined. Prior rejected full Verdant extension (coast-edge-70 crossing and 530 Kharuun overlaps) and C1-X black/teal experiments remain preserved, without relaxed constraints.

## 5. Coverage and minimal backend proposal

The [regional architecture](kaelvar-c1aa-relief-first-regional-topology-and-transition-prework-2026-11-14.md) now has a concrete future resolution contract. Regions describe geography independently of political control. Prefer supported crests, divides, ravines, passes, escarpments and plateau edges; use a river only when its course and surrounding landscape support the choice. Gradual terrain can use an approximate shared edge without fences, checkpoints or a named frontier.

Finalized land should have one primary geographic region; unresolved source/authoring areas have explicit status and reason. Environmental transitions retain a primary region, with optional secondary neighboring influences. **Relax the permanent-gap premise, not the present source/physical holds or C1-Z trial constraints.** No gap is filled in this run.

## 6. Previews and native evidence

Generated and visually inspected `north-review.png` and `south-review.png`: three independent cases each, original elevation over identically registered biome, solid C1-P raw review rings, dashed individual C1-Z return and checkpoint. Captions identify visible texture/linework separately from unsupported landform interpretations. An explicitly unlocated schematic shows potential influences across a future shared edge. No geographical transition band is drawn with fabricated width. Raw envelope strokes are not candidate land membership; the original terrain mask remains authoritative for counts.

Large previews stay outside Git. The local artifact bundle contains the render helper, reports and execution log; exact hashes are in [the evidence receipt](kaelvar-c1aa-qualitative-review-evidence-2026-11-15.json). Native SVGs can be reproduced from the unchanged CLI using `--relief-prework-elevation-svg` and `--relief-prework-biome-svg`; `--relief-prework-check` reproduces the report.

**Hosted rerun:** [run 43672993858, job 132716937122](https://github.com/vagabond1215/Lineage_Reforged/actions/runs/43672993858/job/132716937122), Ubuntu / Node 22, exact tested SHA `dc4a94f95762c52fec1ec1ce5a3016999b8bcb98`: 71/71, all C1-O/P through C1-AA gates passed, 894 code files scanned, zero new legacy-hex dependencies. New seven-day artifact `14149127344` is `c1p-noncanonical-native-terrain-review`.

**Windows-native execution:** exact `faaf6dc94fad157e960bac6d0eb21b4237954348`, Node `v24.14.1`: 71/71 plus all 83 workflow commands/assertion groups passed. A disposable Python standard-library driver ran the existing workflow's Node commands and unchanged embedded assertion blocks; shell file-size/text/hash checks were translated directly. It did not install dependencies or alter workflow/source code. All P–AA source reports and SVG generation passed. C1-AA report and both SVG hashes exactly match hosted output. Git comparison proved only three documentation files differ between hosted and Windows tested commits; scripts, tests, workflow and content are identical.

This closes the previously outstanding Windows **executable** gate for this unchanged evidence implementation. It does not constitute owner visual approval, palette calibration, canonical acceptance or proof that all earlier draft PRs are mergeable. No UI/build/runtime tests were needed for this docs-only review.

## 7. Preserved baseline, lifecycle and bounded next stage

Component 30 remains **79,419** candidates: **52,449** provisionally assigned, **26,970** unassigned; Auric **5,632**, Kharuun **18,624**, Verdant **19,182**, Veyrholm **9,011**. Native checks preserve zero polygon collisions, original 599 coastline edges, option B 35–58, all protected inclusion/exclusion anchors and no detached-component claims.

Northeastern headland edges 75–115, component 51, Shattercap, the large northeastern island, other detached islands, Coast 40 and foreign Serathyl Windward remain held. No source images, physical labels, accepted C1-P geometry, canonical catalog, settlements or gameplay changed.

Fetched/pruned all refs and inventoried worktrees/open PRs. Geography source was 164 ahead / 2 behind `origin/master` `a3dd0057` with merge base `831e15f5`. Relevant geography draft PRs #82–#87 remain open and retained; their heads are in the receipt. No merge, rebase, deletion or new PR was due. Revisit each retained geography dependency only at an explicitly authorized source/geometry acceptance and integration pass; independently reconcile its unique changes and consumers then. Other inventoried branches remain outside this review and retain their existing review triggers.

The original checkout has unrelated untracked worktrees/dependencies and was not switched or edited. This pass used one disposable detached checkout, with a fast-forward push back to the existing geography branch after review; no permanent worktree/branch was created. Task session `c1aa-20261115-relief` registered its validation process; StopSession verified it had already exited. The initial external-working-directory launch was refused by process-control before launch; retry used the owning root, while child commands explicitly targeted the disposable checkout. No source constraint was relaxed.

Applied FP-002 (automated gates versus geography/owner acceptance), FP-007 (bounded append-only coordination), FP-009 (base/test/push identities). Suggested commit: `docs(map): complete C1-AA qualitative seam review and native evidence`.

**Next bounded stage:** source-semantic clarification and independent owner review of these two seams. Obtain source palette/project or registered landform evidence first; then, if defensible, author one separate reversible shared-edge candidate per interface and validate source, anchors, full topology, coverage and detached islands, including combined-candidate checks if both change. Kharuun/Veyrholm canonical registration and a production shared-boundary resolver remain later approval dependencies. No narrative, combat, resource, monster, settlement or political-system implementation is authorized by this result.
