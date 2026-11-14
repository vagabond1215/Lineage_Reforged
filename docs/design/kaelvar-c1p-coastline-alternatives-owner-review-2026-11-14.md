# Kaelvar C1-P: original-source Kharuun frontage alternatives and held NE headland

Date: 2026-11-14  
Status: **C1-P OWNER VISUAL ADJUDICATION OPEN; NO NEW REGION OR CANONICAL GEOMETRY**  
Parent accepted source/native-review SHA: `7b1092c0aa71eb744182d4293859fb4b15fb5571` (C1-O)  
Source original vector Git blob: `9cd6752e9dbca00796e5f7c013066bb0e5a96175`  
Source contour: `feature.coastline.first_world.part_10` (599 exact cyclic original edges)

## Entry gate and scope

The owner supplied a Windows detached-checkout C1-O run on the pinned SHA:
105/105 relevant Node tests passed; zero added legacy-hex dependencies; source
PNG fingerprints matched; all 599 source edges remained unchanged; four
nonoverlapping mainland polygon candidates were measured against the source
terrain-candidate raster; no detached physical component was claimed.
These are **supplied native logs**, not a newly rerun Windows acceptance.

This C1-P continuation is **only** an indexed shoreline choice comparison.
It does not modify C1-O code, source polygons, C1-F anchors, source PNGs,
vector records, active regions, islands, rivers, settlements or ports.

## Kharuun inner northern bay, side-by-side alternatives

The source-indexed vertices below were checked against the uploaded exact
C1-N edge report and C1-O source contour. An interval of source vertices
`a..b` means inclusive exact source **edges** `a..(b-1)`.
No vertices are interpolated and the source trace is not modified.

| Alternative | Original source vertices | Exact source edges | Count | Approx. vector arc length | Disposition |
| --- | --- | --- | ---: | ---: | --- |
| A, wider review | 30..60 | 30..59 | 30 | 132.62 source units | Proposed, not approved |
| **B, C1-O primary** | **35..59** | **35..58** | **24** | **108.86 source units** | Existing low-confidence candidate, not approved |
| C, narrow fallback | 40..55 | 40..54 | 15 | 66.34 source units | Proposed, not approved |

Vector arc lengths are sums of Euclidean segment lengths in the **original
uncalibrated source-coordinate frame**. They do not establish kilometers,
traversal cost, navigability, freshwater availability or sovereign coastline.

The C1-O primary ends are vertex 35 = (326, 194) and vertex 59 = (418, 230).
The wider pair is vertex 30 = (338, 182), vertex 60 = (420, 228).
The narrow pair is vertex 40 = (346, 204), vertex 55 = (406, 222).

**Working review preference:** retain B rather than automatically widen the
Kharuun shore. The original premise is a **short north-facing frontage**,
not the entire northeastern coast. A and C are diagnostic alternatives
to be judged against the source-backed preview and owner direction, not
replacement full polygons. Because the inland returns have not been
reconstructed for A or C, none of those alternatives has a computed
polygon-collision or terrain reassignment acceptance.

## Northeastern headland independently held

The complex original mainland headland is source **edges 75..115**
(inclusive, 41 original edges; endpoints source vertices 75 and 116).

The headland is part of the physical main-contour source witness, but the
original vector outline does not prove a political owner or certify water
versus painted ink. Do not extend Veyrholm or Kharuun ownership into it
based on north-sector window labels, visual color or proximity. Keep the
large detached northeastern island, small offshore contours and all
Shattercap components separately unowned.

An isolated source-underlaid owner view accompanies the C1-P conversation.
Its orange outline is **an investigation arc, not a granted boundary**.

## C1-O terrain accounting remains baseline only

Source component-30: **79,419** candidate mainland cells. Four current
provisional rings occupy **53,158**; **26,261 remain unassigned**. Breakdown:
Auric 6,050; Kharuun 19,265; Verdant 19,783; Veyrholm 8,060.

These figures belong to unchanged C1-O rings. They **must not** be reported
as measurements for alternative frontage endpoints or hypothetical
new inland seams until the native source-raster calculation is repeated.

## Owner gates and next implementation

1. Compare A/B/C visually. Confirm B, prefer another exact interval, or
   request endpoint adjustment using actual source vertex indices.
2. Independently inspect the NE 75..115 headland before any ownership
   proposal; first decide whether it should remain an unassigned coastal
   projection, rather than assign it to a neighbor merely to fill land.
3. Refine Veyrholm's **variable depth** without restoring its rejected
   uniform coastal ribbon or entering the three C1-F inland exclusions.
4. Revisit Auric's eastern and northern interior margins, Kharuun's
   western/central escarpment seams and Verdant's north seam. Preserve
   the three protected southeastern Verdant peninsula anchors.
5. Only after authoring revised closed rings, rerun original-source
   checks, polygon topology, owner anchors, component-30 raster cell
   accounting, unassigned gap conservation, detached-island holds,
   no-new-hex gate, source PNG hashes and native preview rendering.

**Independent holds:** Shattercap, NE detached island, Coast 40, foreign
Serathyl Windward, all new ports/wells/waterways/routes/salt placements,
and all canonical publication. No sovereignty or environmental source
classification is approved at C1-P.

## C1-P inland seam authoring continuation (2026-11-14)

The owner selected **Kharuun option B**: original source vertices
`35..59`, inclusive edges `35..58`. No endpoint change or north-coast
expansion was made. The owner also asked whether the southeastern mainland
offshoot belongs in Verdant Thalos or Shattercap. The **working design
preference** is to keep the physically attached peninsula in Verdant and
treat offshore Shattercap ownership separately; this remains a reversible
candidate, not canonical publication.

Four refined inland-return waypoint sequences are authored in
[`kaelvar-c1p-refined-mainland-seam-candidates-2026-11-14.json`](kaelvar-c1p-refined-mainland-seam-candidates-2026-11-14.json).
All original coastal arcs retain C1-O indices:

| Region | Coast source edges | Return-waypoint change | C1-P raw contour-interior samples | Change versus C1-O raw samples |
| --- | --- | --- | ---: | ---: |
| Auric Marches | 420–454 | 7 → 11 | 6,434 | −419 |
| Kharuun Drylands | 35–58 | 13 → 21 | 18,940 | −649 |
| Verdant Thalos | 195–348 | 6 → 11 | 21,464 | −601 |
| Veyrholm Shore | 475–598; 0–23 | 13 → 18 | 11,131 | +925 |

**These counts are raw pixel-center samples within source-contour rings,
not the registered component-30 terrain-candidate counts.** They do not
replace C1-O's native 79,419 mainland-candidate witness or 26,261
remaining-unassigned baseline. New assigned/unassigned terrain totals are
deliberately **unmeasured** until the C1-P native raster implementation.

An independent Python review used the exact 599 source vertices from the
owner-supplied native C1-O JSON, parsed the original verified biome PNG
embedded in C1-O's SVG and checked its SHA-256 fingerprint
`9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12`.
It reproduced **all four** C1-O raw source-outline sample counts
(6,853 / 19,589 / 22,065 / 10,206) using the C1-O parity algorithm before
evaluating the new waypoints. The revised proposal showed:

- 4 valid candidate region rings, no pairwise polygon-area intersection;
- 0 sampled pixels outside the original source mainland contour;
- 0 proper inland-segment crossings into the unchanged source coastline;
- 0 intersection claims across the 3 original detached offshore source
  contours traced in C1-O; no assignment of 18 separately registered
  terrain physical components;
- 3/3 Verdant southeastern peninsula inclusion anchors retained;
- 3/3 Veyrholm dry-interior exclusion anchors retained;
- Kharuun still exactly 24 source edges and the NE headland still held.

The contour itself may self-touch at native source resolution; this check
uses the original C1-O even-odd pixel inclusion rule, not a fabricated
replacement land polygon. The visual underlay is original registered
imagery, not a biome/sea/hydrology certification.

### Remaining native acceptance gate

No Node C1-P suite or native component-30 remeasurement has yet been run
for these revised returns. Before any owner approval of political boundaries,
extend the existing C1-O validator in a **bounded existing development
checkout** to load this separate reversible proposal, reject input drift,
rerun all C1-N/C1-O/physical component and no-new-hex checks, conservatively
measure exact new source terrain-candidate counts and regenerate native
review overlays. Do not overwrite C1-O's accepted candidate spec, mutate
active catalogs or assign islands. Preserve all C1-P holds in the review JSON.

The side-by-side and southeast owner visuals were produced outside the
repository as review artifacts. They are not generated runtime assets.

## C1-P hosted native raster acceptance (2026-11-14)

The previously pending **native Node source-terrain remeasurement passed on
GitHub Actions** at exact implementation SHA
`4065dc6d5d00d2662a356d857082de1bd2f9d72f`.
The successful run is
[workflow #43627816681](https://github.com/vagabond1215/Lineage_Reforged/actions/runs/43627816681)
and its 7-day retained noncanonical artifact has ID `14127067241`
(`c1p-noncanonical-native-terrain-review`).
The machine-readable accepted evidence is
[`kaelvar-c1p-hosted-native-terrain-acceptance-2026-11-14.json`](kaelvar-c1p-hosted-native-terrain-acceptance-2026-11-14.json).
This was a **hosted Ubuntu Node 22 run**, not the owner's Windows native
PowerShell detached-checkout acceptance. Do not promote a hosted pass into
Windows-native proof.

The workflow passed 18/18 C1-O plus C1-P unit tests; 872 files were scanned
with zero new legacy-hex dependencies. The original biome and elevation
fingerprints and source vector blob were verified; all 599 original source
edges were conserved, no old catalog source was modified, and both
full-size original-raster-underlaid SVG preview exports completed.

Exact component-30 source terrain-candidate inventory:

| Region/assignment | C1-O accepted baseline | C1-P revised | Delta |
| --- | ---: | ---: | ---: |
| Auric Marches | 6,050 | 5,632 | −418 |
| Kharuun Drylands | 19,265 | 18,624 | −641 |
| Verdant Thalos | 19,783 | 19,182 | −601 |
| Veyrholm Shore | 8,060 | 9,011 | +951 |
| **Total assigned** | **53,158** | **52,449** | **−709** |
| **Still unassigned** | **26,261** | **26,970** | **+709** |
| **Mainland component-30 total** | **79,419** | **79,419** | **0** |

Four closed candidate rings retain zero regional collisions and zero proper
source contour crossings. No detached physical component or protected
original-source offshore contour was claimed. Kharuun continues to use
the exact option B 35–58 edge interval. Verdant retains all three
southeastern peninsula anchors. Veyrholm retains all three dryland
exclusion anchors. The NE mainland headland remains unassigned.

**Native review accepted; political and ecological publication still HELD.**
The source's colors do not certify a land/water body, biome,
topographic height, watershed, salt basin, potable well or navigable route.
Shattercap and the large detached NE island remain whole and separately
withheld. No canonical region geometry was published.

### Next owner-visible C1-P to C1-Q decision

Inspect the **native source-clipped** C1-O vs C1-P preview and enlarged
north view, focusing on whether Veyrholm's additional 951 candidate cells
produce the right northern width and whether Auric/Kharuun/Verdant losing
418/641/601 cells leaves reasonable unclaimed transitions. Owner approval
of each inland seam is distinct from the geometry/raster verification pass.
After owner visual adjudication, either freeze these provisional rings or
make a bounded revision and rerun the same native test/raster/preview
gate on that exact SHA. No detached island, Shattercap, NE headland or
canonical boundary may be filled to reduce unassigned pixels.
