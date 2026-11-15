# Kaelvar C1-Z: reversible northern and southern mainland seam trials

Date: 2026-11-14  
Status: **C1-Z HOSTED-NATIVE PASS; FOUR INDEPENDENT RESEARCH OPTIONS, NO OWNER SELECTION OR CANONICAL WRITE**  
Test-bearing commit: `5b89e2269634279a90dfef19cb2cb82e86a6fd88`  
[Native run #43656581731](https://github.com/vagabond1215/Lineage_Reforged/actions/runs/43656581731)  
[Permanent C1-Z evidence ledger](kaelvar-c1z-hosted-two-seam-reversible-waypoint-evidence-2026-11-14.json)  
[Original C1-Z noncanonical experiment specification](kaelvar-c1z-two-mainland-seam-reversible-waypoint-options-2026-11-14.json)

## Outcome

**Four small, independently evaluated inland waypoint changes pass the original source and polygon review gates.** All four reduce the minimum measured gap in the intended independent mainland interface, while leaving an unassigned reserve. None is approved as a revised C1-P polygon, assigned terrain, certified climate or hydrology, or active game content.

C1-Y previously found a **10-sample** strict original mainland gap at the **Veyrholm–Kharuun northern inland** interface around `(292,190)`, and a **15-sample** gap at the **Kharuun–Verdant southern transition** around `(319,326)`. C1-Z modified one existing inland waypoint per experiment on an in-memory clone of the source-indexed C1-P proposal.

The four experiments are **mutually independent**. The output does **not** demonstrate that simultaneously applying multiple trials will preserve nonoverlap, terrain accounting or reserve depth. Any combination requires a fresh full native review.

## Four source-grounded alternatives

| Trial ID | Only waypoint moved (original → trial) | Strict unassigned gap before → after | Changed original component-30 cells in transient owner mask | Trial candidate totals for modified region |
| --- | --- | ---: | ---: | ---: |
| `NORTH_VEYRHOLM_SOUTH_TWO` | Veyrholm waypoint 3: (284,190) → (284,192) | **10 → 8** | **30 gained**, 0 released | Veyrholm 9,011 → 9,041 |
| `NORTH_KHARUUN_NORTH_TWO` | Kharuun waypoint 19: (301,193) → (301,191) | **10 → 9** | **29 gained**, 0 released | Kharuun 18,624 → 18,653 |
| `SOUTH_KHARUUN_SOUTH_THREE` | Kharuun waypoint 9: (314,320) → (314,323) | **15 → 13** | **53 gained**, 0 released | Kharuun 18,624 → 18,677 |
| `SOUTH_VERDANT_NORTH_THREE` | Verdant waypoint 6: (320,334) → (320,331) | **15 → 12** | **54 gained**, 0 released | Verdant 19,182 → 19,236 |

All numbers in this table are **temporary trial raster measurements**; they are not added to canonical or accepted C1-P political allocation. No two changed ownership masks were merged. Gap lengths are **original source-reference-grid samples**, not kilometers or minimum physical passage width.

Each experiment retains at least four original unassigned terrain candidate samples along its measured shortest path; actual results remain 8, 9, 13 and 12. These minimum paths can change when a border moves, so the native method recomputes the whole local four-neighbor path instead of subtracting the waypoint displacement from the old gap.

### Visual reading: north and south must be adjudicated separately

**Northern interface:** The original source shows greenland tones near the Veyrholm inland return and the inland bay-side Kharuun boundary. The 10-sample gap is short but close to coastal linework. Both alternatives are small and topologically valid; the Veyrholm southward option yields the larger measured reduction, but a 2-sample shorter gap is **not itself a better natural or political border**. Preserve Veyrholm's three protected dry-inland exclusion anchors and Kharuun's intentionally short northern coastline.

**Southern interface:** Kharuun's warmer-yellow inland region meets a greener Verdant transition with irregular colored source texture and linework. The Kharuun southward and Verdant northward returns both pass the candidate geometry and strict source terrain gates. A colored line may not be assumed to be a river, stream, land-height break or certified climatic boundary. The visible transition supports comparative visual review, not automatic annexation.

The C1-Z original-source SVG shows four panels: pale dashed line for the accepted return, teal line for the trial return, pale line for the original strict mainland gap, and transient changed source samples. Its comparative overlays **do not modify the registered original biome image**.

## Exact validated source invariants

The native implementation uses the exact original `feature.coastline.first_world.part_10` contour, with **599 source coastline edges**, vector blob
`9cd6752e9dbca00796e5f7c013066bb0e5a96175`.

Source raster SHA256 values remain unchanged:

- Biome `9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12`
- Elevation `02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d`

For **each trial independently**, the original C1-O source-indexed geometry builder and the native component-30 terrain measurement pass all of the following:

1. Exact original coastal arcs and all nonedited regional inland return waypoints remain unchanged.
2. No polygon self-intersection, source-coast crossing, protected offshore contour crossing, or overlap with other regional candidate rings.
3. All three Verdant southeastern peninsula inclusion anchors and three Veyrholm protected inland exclusion anchors remain protected.
4. Every owner difference is a previously unassigned original component-30 source candidate becoming part of **only the edited trial region**, strictly inside its corresponding fixed C1-Y inspection window. No other region gains or loses cells, and no separately labeled original physical component is claimed.
5. Complete original terrain accounting stays **79,419** component-30 source candidate samples across trial owners and remaining unassigned cells. Source image/vector bytes and original label data are never changed.
6. The remaining strict source mainland gap is recomputed, stays nonzero, and the trial is accepted for **review only**. Any failed geometry or source guard is recorded as a rejected trial rather than forcibly corrected.

### Hosted execution and evidence

The exact pinned [GitHub Actions run #43656581731](https://github.com/vagabond1215/Lineage_Reforged/actions/runs/43656581731) at
`5b89e2269634279a90dfef19cb2cb82e86a6fd88` passed **67/67 Node tests**, with **zero failed**. Its no-new-legacy-hex scan covered **892 code files** with **zero new dependencies**. Native original-source raster, vector, C1-P baseline, C1-Q through C1-Y held geography, four C1-Z trial source polygons, in-memory terrain ownership and original-image-backed SVG all passed.

The short-lived hosted artifact is `c1p-noncanonical-native-terrain-review`,
ID **14138301026** with seven-day retention. Exact source-backed output fingerprints:

- `c1z-reversible-waypoint-trials.json` SHA256:
  `c88fb24050ca155d68509c1e2f4a192fa1491cab01a489f1916a0ac0a61f751f`
- `c1z-reversible-mainland-seam-options.svg` SHA256:
  `1ae94885aeffb7b279df21fa04b59d3d080340c9a3a1ef2953725cfea26a4f95`

The permanent JSON ledger contains all four trial source-grid path hashes and trial area counts. The full detailed native report carries each trial's changed original source candidate sample coordinates and source-indexed polygon ring.

This is **GitHub-hosted Ubuntu / Node 22 native verification**, not owner-local Windows PowerShell acceptance. Windows-local acceptance remains a separate gate before merging or publishing geography.

## Unchanged C1-P accounting and geography holds

| Source mainland component 30 | Accepted existing noncanonical cells |
| --- | ---: |
| Auric Marches | 5,632 |
| Kharuun Drylands | 18,624 |
| Verdant Thalos | 19,182 |
| Veyrholm Shore | 9,011 |
| **Accepted four provisional regions** | **52,449** |
| **Deliberately unassigned** | **26,970** |
| **Original source mainland total** | **79,419** |

Kharuun option **B** still retains exactly original coastal edges **35–58**. Verdant's accepted **southeastern** peninsula remains included. The separately investigated **northeastern** headland (original edges **75–115**), original physical component **51**, the large northeastern detached island, all Shattercap detached isles, all separate original physical components, Coast 40 and foreign Serathyl Windward remain independently held.

No source PNG, coastline vector, original terrain label, accepted C1-P polygon, canonical region, port, well, river, road/sea route or salt basin was written. Trial polygons never become new active geometry refs.

## Recommended C1-AA: visual and natural-boundary comparison before selection

A responsible next pass should **compare two alternatives for each interface**, not pick the greater sample gain automatically:

- For **Veyrholm–Kharuun**, inspect whether the Veyrholm southward or Kharuun northward return follows the original coastline-adjacent terrain more naturally and respects the deliberate northern transition. Recheck protected dry-inland exclusions and Kharuun's 24-edge frontage.
- For **Kharuun–Verdant**, compare the Kharuun southward and Verdant northward return against the original green/yellow transition and any unresolved source linework. Keep a substantial unassigned transition if it is the more credible geography.
- Retain **KEEP_C1P_UNCHANGED** as an explicit option for both interfaces; do not infer that all gaps need closing. Any political selection needs owner adjudication, a separate reversible candidate artifact, original source hash gates, remeasured native polygon/terrain acceptance and Windows-local verification.

**C1-Z did not select an owner-approved alternative.** The northeastern headland ink/physical debate remains independent and must not be reopened implicitly by the inland seam work.

### Lifecycle receipt

The GitHub connector reused
`connector/c1o-kaelvar-regional-boundary-candidates-2026-11-14`.
**No new branch, permanent Windows worktree, or draft PR was created**.
The connector cannot verify local `C:\Codex` disk status or perform local Windows worktree cleanup; no local cleanup is claimed. Generated large review SVGs remain in short-lived hosted artifacts instead of accumulating inside the Git repository.
