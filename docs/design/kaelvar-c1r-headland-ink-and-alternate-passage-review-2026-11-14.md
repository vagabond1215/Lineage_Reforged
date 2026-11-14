# Kaelvar C1-R: source-pair bottlenecks and alternate eastern headland passage

Date: 2026-11-14  
Status: **C1-R HOSTED NATIVE SOURCE DIAGNOSTIC PASS; POLITICAL/COASTLINE ASSIGNMENT HELD**  
Source implementation and pinned check SHA: `17e4ae8dca0e5afc232274d04f6e8037f2e48843`  
Hosted validation: [successful run #43639122650](https://github.com/vagabond1215/Lineage_Reforged/actions/runs/43639122650)  
Permanent compact witness: [C1-R JSON evidence](kaelvar-c1r-hosted-source-bottleneck-evidence-2026-11-14.json)

## Exact source and geographic scope

C1-Q found one 223-step 4-neighbor candidate-pixel path from provisional
Verdant `(390,336)` to the **unassigned original-mainland northeastern
headland** `(492,215)`; C1-R independently inspects why the same pair of
source candidate raster samples lacks a 1-pixel clearance path.

The headland is original vector `feature.coastline.first_world.part_10`
edges **75..115** (41 exact original source edges). This is **not** the
separate, already included southeastern Verdant peninsula, and **not**
any physically detached Shattercap or northeast island component.
Kharuun's provisional option B remains **35..58** inclusive.

The existing C1-P source-indexed regional polygons, 599-edge source
contour, original PNGs, and all canonical world data are unchanged.

## Results

Hosted Ubuntu Node 22 exact-source workflow passed **30/30 tests** and
the original raster/source gates; the legacy-hex guard scanned **876**
code files and found **zero new dependencies**. Both original image
fingerprints, the vector source blob and the mainland terrain component
accounting were revalidated. This is not local Windows PowerShell-native
acceptance or a political/ecological approval.

Both windows used the original `2048×1152` reference-grid registration
and `registeredTerrainCandidates` computed from the original biome
and elevation PNGs. The original C1-Q search window was
`x=375..540, y=190..350`; C1-R widened it to
`x=300..590, y=155..465`. Every tested step stayed in original
mainland **component 30**, inside the original vector contour,
with ownership limited to existing Verdant or **unassigned**.
Auric, Kharuun, Veyrholm and other physical components were forbidden.

| Review test | Source result |
| --- | --- |
| C1-Q baseline, zero clearance | Connected, 223 steps |
| Wider window, zero clearance | Connected, same 223 steps and fingerprint |
| Wider window, 1-pixel Manhattan clearance | **Not connected** |
| Wider window, 2-pixel Manhattan clearance | **Not connected** |
| Alternative after excluding **all interior pixels** of the 223-step route | Connected, 225 steps |
| Two zero-clearance routes with no common interior pixel | **Yes** |
| Newly assigned terrain | **0** |

The second path was produced by excluding the original path's interior
cells from a transient ownership mask, without mutating the actual
region allocation. Its exact path digest is
`8acf9d83cb43ac31d7085822fdd2e75859f71ffcbaa840700d2268ba8e8ee22b`.

This is an important distinction: the apparent bottleneck is not simply
an artifact of the small C1-Q search window, and it is not limited to
only one possible 4-neighbor trace. **Two independent thin traces are
not evidence of a sufficiently wide or permanently dry passage.**
Their proximity and the 1-pixel-clearance rejection still matter.

## Original source-pair RGB rejection diagnosis

Among the **224 path samples** of the original 223-step trace:

- 72 samples lacked an allowed 1-pixel Manhattan neighborhood.
- 35 consecutive-run groups contained one or more such failures.
- The 96 adjacent rejected samples were all classified
  `SOURCE_PAIR_RGB_EQUALITY`: the source biome and elevation PNGs
  had *identical RGB* at that sampled coordinate.
- None of the candidate cells **on the trace itself** tripped the
  original blue-RGB cutoff, source-pair equality or invalid alpha checks.
- The longest single flagged run was source-reference steps 187–199,
  near `(487,240)` on the eastern vertical part of the trace.

Actual original-source examples:

| Reference sample | Corresponding PNG pixel | Biome RGB | Elevation RGB | Observation |
| --- | --- | --- | --- | --- |
| (488,246) | (1008,538) | (0,0,0) | (0,0,0) | Shared black source ink |
| (394,316) | (825,674) | (4,159,169) | (4,159,169) | Shared teal source color |

The existing source-pair terrain classifier intentionally excludes
shared RGB as unresolved, even where the pixels are not blue according
to its water-color cutoff. Thus the native result isolates a **source
interpretation issue at the candidate-mask boundary**, not proof that
water, impassable cliffs or a political border occupy the rejected
pixels. The source contour and uncalibrated image legend cannot yet
certify the rejected pixels as solid land, salt water or traversable
route. Do **not** turn the shared black or teal pixels into land by
relaxing the threshold in canonical content.

## Retained world and publication holds

Source mainland candidate cells remain **79,419**. The accepted C1-P
reversible review ownership remains Auric **5,632**, Kharuun
**18,624**, Verdant **19,182**, Veyrholm **9,011**,
for **52,449 assigned** and **26,970 deliberately unassigned**.

All of the following remain untouched: Kharuun option B endpoints;
the southeastern Verdant peninsula and its three inclusion anchors;
the three Veyrholm interior exclusion anchors; the northeastern
headland; 18 detached physical components; the protected three source
offshore contours; the large northeastern island; Shattercap; Coast 40;
Serathyl Windward; ports, wells, rivers, maritime routes and salt
basins. No active region geometry, source vector, canonical World
record or legacy hex dependency changed.

## Decision and next bounded C1-S investigation

**Keep the northeastern original mainland headland UNASSIGNED.**
The present evidence warrants continued physical-source classification,
not an annexation into Verdant or Shattercap.

Recommended C1-S:

1. Cross-examine the original registered biome/elevation pixel pairs and
   coastline ink surrounding the flagged **shared-RGB** samples.
   Independently compare black vs teal shared-color categories,
   original raster alpha and local vector containment without changing
   either source asset.
2. Build strictly **noncanonical sensitivity masks** that leave uncertain
   shared-RGB cells explicitly marked; quantify how inclusion/exclusion
   changes possible 1-pixel-clearance connectivity and detached-component
   behavior. A permissive mask is an exploration, never an accepted
   land/water classification.
3. Do not assign the 75–115 headland until physical continuity is
   source-supported and a separate reversible **valid polygon** can be
   authored without crossing or rewriting the original source coastline.
4. Run exact source SHA/hash gates, 599-edge preservation, C1-P counts,
   southern peninsula anchors, original physical component exclusions
   and no-new-hex checks. Re-run native SVG render and classify hosted
   versus Windows acceptance separately.

**Branch lifecycle:** This work reused the existing
`connector/c1o-kaelvar-regional-boundary-candidates-2026-11-14` branch;
no extra development branch, physical worktree or pull request was
created. GitHub Actions generated review-only JSON and SVG artifacts
retained for seven days (run artifact ID `14130834105`). The
compact evidence JSON is retained permanently in the same branch.
