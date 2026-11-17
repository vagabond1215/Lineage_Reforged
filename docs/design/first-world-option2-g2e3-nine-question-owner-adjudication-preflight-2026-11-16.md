# First World Option 2 G2-E3: Nine-question owner adjudication preflight

> **Post-preflight owner response (2026-11-16):** The owner has now selected all nine *source-review directions*. See the [current G2-E3 decision record](first-world-option2-g2e3-owner-direction-record-2026-11-16.md) and [machine ledger](first-world-option2-g2e3-owner-direction-record-2026-11-16.json). The preflight's `ALL_NINE_UNSELECTED` and `null` examples below describe the **historical input state**, not today's owner status. Derived physical contours, tides, routes, resources, stable IDs and canonical publication remain held.

Date: 2026-11-16  
Status: **OWNER_DECISION_PREFLIGHT_READY; ALL_NINE_UNSELECTED; GEOMETRY_NOT_AUTHORED; CANONICAL_PUBLICATION_HELD**  
Source checkpoint: `master` `4624ac7c5c4c70023f360aea554c825245e728ec` (post-G2-E2 PR #100 and its documentation closeout). This is a **connector-only documentation handoff**, not an E3 source-run or a new authoring/acceptance claim.

Authority: [G2-E image/history export and derived-geography gate](first-world-option2-g2e-image-history-derived-geography-gate-2026-11-16.md), [G2-E1 Valtherion evidence](first-world-option2-g2e1-valtherion-owner-review-2026-11-16.json), [G2-E2 seven-site evidence](first-world-option2-g2e2-seven-site-source-review-2026-11-16.json), [nine geographic parents and G2–G7 roadmap](first-world-option2-world-plan-and-geometry-roadmap-2026-11-16.md), [coordinate-first geography authority](coordinate-first-world-geography-migration-contract-2026-11-13.md). For visual inspection, use the original-source G2-E1 and G2-E2 individual review panels/atlases, **not** an enlarged thumbnail or a re-sampled map screenshot.

## Why E3 needs two different decisions

The existing nine pending records do **not** ask the same question:

- **G2-E1 V1/V2** compare a possible coastal attachment against an offshore island. Their allowable choices are exactly `CONNECTED_LAND`, `SEPARATE_ISLAND`, or `HELD`. Neither source-rendered mask is certified semantic terrain.
- **G2-E2 seven-site** records ask for disposition of a **derived coastline candidate**. Six use `ACCEPT_DERIVED_COAST_CANDIDATE`, `REQUEST_BOUNDARY_REVISION`, or `HELD`; the tidal neck instead uses `RETAIN_NATURAL_NECK_LORE_PENDING_EXACT_SHORE`, `REQUEST_NECK_SHORE_REVIEW`, or `HELD`. Accepting a source-rendered coast *direction* does not independently decide every connected physical component, its permanent island ID, parent ownership, or political/route authority.

An E3 answer therefore has two fields: **source review choice** (one of the existing ledger choices) and **whole-landform topology outcome** (`CONNECTED_LAND`, `SEPARATE_ISLAND`, `MULTIPLE_CANDIDATES_NEED_SPLIT_REVIEW`, or `UNRESOLVED`). The second field is an E3 *proposal*, **not** a retroactive replacement of the existing G2-E1/E2 machine ledger. If no source-backed annotated closed boundary exists, leave topology `UNRESOLVED`, even when a source-review choice is selected. Default both fields to unselected until the owner answers.

## Exactly nine owner-review questions

All coordinates below use the **original** `16384 × 9421` PNG frame, half-open `[left,top,right,bottom)`. A review rectangle is **not** an island polygon. A/B numbers measure only two render-based pixel classifiers in their stated windows and are not a claim of native land/sea semantics.

| Review ID | Original ROI | A/B disagreement | Decision to put before the owner |
| --- | --- | ---: | --- |
| `G2E1_VALTHERION_V1` | `[8164,1592,8223,1658)` | **341 in padded review crop** | Is the thin rendered contact part of one Valtherion physical landform, a detached offshore feature, or held? |
| `G2E1_VALTHERION_V2` | `[8744,2391,8823,2452)` | **293 in padded review crop** | Same topology choice for the second rendered contact; do not force V1 and V2 to match. |
| `G2E2_DAWNREACH_U_ARC` | `[6150,710,8040,2350)` | **286 in ROI** | Is the displayed coast a useful *proposal* for the white polar U-arc? Which contact/small-island segments need additional whole-island review? |
| `G2E2_MYRIDIAN_NORTH` | `[5180,1340,6980,2910)` | **83 in ROI** | Does the red northern Myridian chain need individual component outlines or coast revisions near Dawnreach? Do not bridge unlike parent colors by default. |
| `G2E2_MYRIDIAN_DETACHED_CENTER` | `[7080,3230,7960,4510)` | **47 in ROI** | Is the jellyfish-shaped surface feature a whole detached geographic candidate? The nearby independently sovereign merfolk city is not assigned from the surface mask. |
| `G2E2_KAELVAR_NE_ISLAND` | `[3910,1020,5190,1850)` | **60 in ROI** | Review the complete NE island outline; leave Shattercap identity, Coast 40 dispute and geographic membership unselected until separately evidenced. |
| `G2E2_SERPENTS_NORTH` | `[13910,3760,14970,5810)` | **73 in ROI** | Review north-chain coast and candidate island separation; do not infer shared political control or a sea route. |
| `G2E2_SERPENTS_SOUTH` | `[13260,5830,14590,7480)` | **53 in ROI** | Review south-chain coast and candidate island separation independently, then check north/south continuity outside the local windows. |
| `G2E2_DRAEMOR_TALMYRA_NECK` | `[8300,5740,9000,6670)` | **39 in ROI** | Retain the approved *design intent* of a natural tidal stone neck, or request an exact-shore review. No rendered seam determines passage width, tidal closure, craft clearance or travel permission. |

**Counting caution:** the seven G2-E2 source windows contain **641** A-only rendered-land disagreements as a **sum of seven ROI-specific counts**, with **zero** B-only disagreements *within each window*. This is **not proven to be 641 globally distinct pixels**: Dawnreach U-arc and northern Myridian ROIs overlap on `[6150,1340,6980,2350)` (**838,300 shared window pixels**); northern Myridian and Kaelvar NE overlap on `[5180,1340,5190,1850)` (**5,100 shared window pixels**). Those window intersections are exact rectangle arithmetic, not measured duplicate-disagreement counts. V1/V2 use separately **padded** crops; their 341/293 counts must not be added to 641 as a deduplicated world statistic. Lower disagreement is **not** higher topological confidence.

**Recovered owner-review evidence (2026-11-16 CI):** The original-source [G2-E1 Valtherion source-review run](https://github.com/vagabond1215/Lineage_Reforged/actions/runs/43981564104) yielded two six-view PNG panels and a generated JSON ledger; the [G2-E2 seven-site source-review run](https://github.com/vagabond1215/Lineage_Reforged/actions/runs/44006664848) yielded seven six-view PNG panels, combined atlas, and generated ledger. Their two generated ledgers have identical original State/Height/Biome SHA-256 fingerprints; each review PNG was recovered intact from those CI artifact ZIPs. These are **display crops and rendered-mask evidence**, not original full-resolution PNGs, native simulator topology or finished annotated whole-feature polygons. GitHub artifacts have finite retention. A separate offline owner presentation can collect *provisional* choices, but must not mutate these source ledgers or imply owner approval.

## E3 evidence sheet and reply contract

For each of the nine IDs, prepare **one bounded annotated source sheet** with: the unchanged original State, Height and Biome pixels; A and B rendered-water/coast candidates; visibly distinct raw disagreement pixels (display halo labeled *visual-only*); source ROI and original SHA-256 provenance; proposed **whole-feature** contour(s) extending beyond the review crop as needed; an explicit `UNKNOWN` treatment for conflicting ink, bays, holes and narrow land contacts; and an independently reviewed alternative where topology differs. A 2048-reference contour is only a *candidate* until pixel-center mapping and registration are approved.

An owner response should use this shape in the eventual decision ledger or review record. The example is deliberately **unselected**:

```json
{
  "reviewId": "G2E2_KAELVAR_NE_ISLAND",
  "sourceReviewChoice": null,
  "topologyOutcome": "UNRESOLVED",
  "annotatedEvidenceRef": null,
  "chosenWholeFeatureContourRef": null,
  "boundaryExceptions": [],
  "reviewer": null,
  "reviewDate": null,
  "confidence": null,
  "permanentPhysicalIslandId": null,
  "geographicParentApproval": null,
  "politicalSovereigntyApproval": null,
  "routeAuthorization": null,
  "canonicalWritable": false
}
```

**A recorded owner answer must include:** exact review ID; chosen *existing* source-review option; topology status; annotated evidence and selected contour identifier if one exists; specific exceptions/revisions by source pixel coordinate; reviewer and date; confidence with rationale; and an explicit `HELD` or `UNRESOLVED` where evidence remains insufficient. The reviewer may answer only one item at a time. A conversational yes or an approval of a source-panel thumbnail is not blanket approval of all features inside a rectangle.

Do not mutate E1/E2 evidence values to simulate the owner's response. Store E3 decisions in a distinct proposed record when real signed-off evidence exists; until then, this document is merely the question and QA contract.

## Noncanonical proposal and validation sequence

1. **Freeze source witnesses.** Reuse original immutable 16K State/Height/Biome PNGs, SHA-256 and source-image CI. Never regenerate or repaint source authority; do not read or modify simulator saves for this gate.
2. **Construct bounded source-native contour alternatives.** Trace *whole physical feature candidates* from the A/B coast evidence, recording classification and source pixel coordinates, holes, disconnected islands, raw versus simplified contours, tolerance, closure/winding and ambiguity islands. Do not treat a rectangular ROI edge as shoreline. Keep A/B alternatives distinct rather than picking a single threshold by the smallest difference count.
3. **Check cross-window topology.** Explicitly reconcile Dawnreach/Myridian vicinity, both Serpent's Wake windows, full Kaelvar NE extent, Valtherion attachment neighborhoods and both shores of the Draemor–Talmyra neck. Check four-/eight-neighbor and erosion sensitivity, enclosed blue/river/shore-ink ambiguity, holes, self-intersection, source-frame bounds, seam contacts, unexplained gaps/overlaps and small-fragment retention. No coast-contour success alone creates a sovereign border.
4. **Ask for owner decisions against annotated alternatives.** Keep all nine source-review choices `null` until the owner selects them. Distinguish an acceptable *coast proposal* from a certified *physical component*; `HELD` remains a valid result without deadlines or pressure to choose.
5. **Gate downstream work separately.** Only later, after approved source registration, contour topology, whole-island identity and per-feature decisions, consider a separate G2-E4/G3 publication review. Do not touch canonical `regions.json`, `world_maps.json`, `world_map_features.json`, ecology/settlements, political claims, route edges, save/runtime compatibility, legacy hex systems or active C1 geometry in E3.

### Acceptance and responsibility boundary

- **Done in this pass:** existing seven-plus-two review records reconciled into one precise nine-question checklist, evidence/answer contract and noncanonical QA plan; zero owner choices made.
- **Not done:** original-image contour extraction, E3 polygon alternatives, source-native image execution, visual approval, local tests, official geometry release or any new stable component IDs.
- **Next executable owner:** a repository-capable agent with exact original LFS assets and local image tooling should generate the *read-only E3 contour alternatives* in an empty directory **outside Git**, prove source hashes and bounds, run dedicated topology checks and share annotated panels. This may consume a bounded Codex/local slice; connector inspection alone cannot certify original image pixels or execute the source CLI.
- **Next human owner:** review specific annotated alternatives, return choices by review ID and keep unresolved ones held.
- **Integration:** this documentation-only preflight may live directly on `master`; it is not a new branch/PR lane, does not modify any open draft, and must not be used as a basis to merge C1 or publish geography.

The approved nine macro **geographic** parents remain separate from political sovereignty, and the merfolk underwater city and tidal-neck movement restrictions retain their own authorities.
