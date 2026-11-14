# Kaelvar C1-Q: northeastern mainland headland connection, source-candidate-only

Date: 2026-11-14  
Status: **C1-Q HOSTED NATIVE SOURCE TEST PASSED; CONNECTED VERDANT POLITICAL POLYGON HELD**  
Parent: C1-P accepted hosted-native review (C1-P proposal and all four polygons unchanged)  
Exact test-bearing commit: `62c2b48c17369e62fe2202a98ba3907db2b63cba`

## Owner intent and geographic identity

This work continues the owner's Kharuun **option B**, original source coastline
edges **35–58**, and protects the three approved **southeastern Verdant**
peninsula anchors. The owner's cropped shoreline at index dots **75** and
**116**, however, is a *different* attached **northeastern mainland
headland**. It belongs to the original mainland source vector contour
`feature.coastline.first_world.part_10` and is **not** the detached
large northeastern island or any Shattercap archipelago component.

The two options examined were:

1. **HOLD_UNASSIGNED:** keep headland and eastern source-coast flank
   unassigned. This is the unchanged C1-P candidate geography.
2. **VERDANT_CORRIDOR_EVIDENCE_ONLY:** search for a 4-connected source
   terrain-candidate path from inside the existing provisional Verdant
   polygon to the unassigned northeastern headland, without extending
   Verdant ownership, claiming offshore regions, or defining a route.

Neither is a political approval. Option 2 is not a valid closed new region
polygon and must not be emitted as an active region feature.

## Native original-source probe

Evidence: [C1-Q hosted-native ledger](kaelvar-c1q-hosted-source-connectivity-evidence-2026-11-14.json)
and [successful GitHub Actions run #43637208036](https://github.com/vagabond1215/Lineage_Reforged/actions/runs/43637208036).
The exact run used hosted Ubuntu and Node 22, **not owner Windows
PowerShell native acceptance**. Its proof artifact was
`c1p-noncanonical-native-terrain-review`, artifact ID `14130960291`,
with seven-day retention. The artifact includes source-underlaid
C1-Q options SVG and full JSON witness. Avoid checking the multi-megabyte
generated SVGs into Git.

**25/25** C1-O, C1-P and C1-Q tests passed.
No-new-legacy-hex scanning checked **874** code files, finding **zero**
new dependencies. The original source vector Git blob and PNG fingerprints
were verified by the native command; all **599** source mainland coastline
edges were conserved. The headland investigation takes original edges
**75–115** (41 exact edges, end vertex 116) and does not mutate them.

The bounded test uses original source crop registration, *both original PNGs*
and the existing `registeredTerrainCandidates` rule, not painted green alone.
Only raster component-30 pixels inside the original vector contour are
allowed, with current provisional C1-P ownership limited to **Verdant or
unassigned**. Auric, Kharuun, Veyrholm, and detached component cells are
ineligible. The C1-F/C1-O/C1-P source and native gates execute before
the new probe.

| Source-candidate clearance | Observed connectivity |
| --- | --- |
| 0 pixels (exact 4-neighbor samples) | **Found**: 223 source-reference-pixel steps |
| 1 pixel Manhattan clearance on every path sample | **Not found** |
| 2 pixel Manhattan clearance on every path sample | **Not found** |

The start is **(390,336)** in provisional Verdant and the target is
**(492,215)** in the unassigned mainland headland. Both endpoints were
permitted even at clearance 2. The bounded window is source reference
`x=375..540, y=190..350`. The 0-clearance path fingerprint is
`0147077f649823002cb7ef7a0d40d6617c0fc699ee3b34337fcfb8ff82b1b01a`.
These are raster sampling units, **not kilometers or authorized travel**.

**Interpretation:** candidate-source connectivity exists at at least
a single sample wide, but the same search found no continuous path with
even one-pixel clearance. This is positive evidence for an *investigation*
of a Verdant-connected headland and negative evidence for
confidently drawing a thick Verdant-controlled land bridge. It does
not prove the passage is physically narrow: source ink, blue-water
interpretation, registration and candidate-mask construction are
themselves uncalibrated.

## Accepted C1-P territory totals are unchanged

| C1-P review ownership | Component-30 cells |
| --- | ---: |
| Auric Marches | 5,632 |
| Kharuun Drylands | 18,624 |
| Verdant Thalos | 19,182 |
| Veyrholm Shore | 9,011 |
| **Assigned candidates** | **52,449** |
| **Still unassigned** | **26,970** |
| **Original mainland terrain-candidate total** | **79,419** |

Additional C1-Q territorial allocation is **zero**; all 18 earlier
unclaimed detached physical components, three protected original-source
offshore source contours, the large northeastern island, Shattercap,
Coast 40, and foreign Serathyl Windward parent remain unchanged and
independently held. The source-color water/land interpretation remains
uncalibrated. No ports, wells, river routes, salt basins or canon were
published.

## Next gate: evidence before a Verdant headland annex

1. **Identify the clearance bottleneck:** inspect original biome/elevation
   pair samples and black-ink/blue-water separations where the
   zero-clearance route cannot be widened. Do not alter source images.
2. **Compare an alternate eastern mainland connection** beyond the
   current bounded window, remaining source-safe and avoiding all
   already-assigned regions. Keep explicit sample reference and provenance.
3. **Prove a well-formed region geometry before drawing sovereignty:**
   the full outer source contour self-touches in the eastern bay/inlet
   vicinity, so naively using original coastal vertices 75..349 in one
   Verdant ring risks self-intersections. Do not silently repair the
   original vector or use an unverified multiring workaround.
4. **Review Verdant vs unassigned political choice** only after a real
   geographic passage and valid reversible polygon are demonstrated.
   Shattercap's maritime influence may be a future narrative distinction
   without granting it the mainland headland.
5. Rerun the exact source fingerprints, 599-edge preservation,
   native component-30 accounting, polygon collision/anchor checks,
   no-new-hex gate, and full SVG previews after any proposed geometry
   change. Keep canonical publication held.

**Repository lifecycle:** Reused the existing
`connector/c1o-kaelvar-regional-boundary-candidates-2026-11-14` branch;
no new permanent local checkout, branch, or draft PR was created. The
GitHub Connector cannot inspect or close Windows worktrees. Generated
previews remain short-lived hosted artifacts, with a compact permanent
evidence ledger retained in-repo.
