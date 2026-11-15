# Kaelvar C1-AC: owner simulator district screenshot and source-registered relief review

Date: 2026-11-15  
Status: **OWNER-PROPOSED REGIONAL VISUAL CAPTURED; EXACT ORIGINAL SOURCE REGISTRATION PASSES; CANONICAL GEOMETRY, ISLAND MEMBERSHIP AND GEOGRAPHIC ADOPTION HELD**  
Base geography branch: `connector/c1o-kaelvar-regional-boundary-candidates-2026-11-14`  
Previous stage: [C1-AB exact shared-seam endpoint audit](kaelvar-c1ab-endpoint-continuity-review-and-c1ac-handoff-2026-11-15.md)  
Permanent capture ledger: [C1-AC eleven original screenshots and affine source registration](kaelvar-c1ac-owner-fantasy-map-simulator-screenshot-evidence-2026-11-15.json)

## New owner evidence and its authority

The owner supplied **eleven screenshots from Fantasy Map Simulator on Steam**, covering multiple First World biome/outline and grayscale relief views, four Kaelvar detail views and a final **Map Editor / Edit District** screen showing an explicitly proposed regional breakdown.

This is stronger design evidence than an arbitrary color-only interpretation of the committed biome PNG. It directly expresses the owner's intended geographic identities and approximate interfaces. It is still **provisional screenshot ink**: this screen alone does not prove precise source-indexed polygon vertices, physical terrain membership, river names, numeric heights, cadastral boundaries or canonical island parentage.

The editor's visible labels and exact screenshot ink colors:

| Editor label | Approximate ink RGB | How to treat it |
| --- | --- | --- |
| Veyrholm Shore | (6, 0, 112), dark indigo | Owner-proposed broad northern coastal region |
| Auric Marches | (191, 71, 0), dark orange | Owner-proposed irregular western/southwestern region |
| Kharuun Drylands | (191, 0, 0), red | Owner-proposed central and eastern inland region |
| Verdant Thalos | (0, 89, 15), dark green | Owner-proposed southeast including wooded highland terrain |
| Shattercap Isles | (188, 16, 107), magenta | Proposed offshore collection, **physical claims remain independently held** |

The interface says **Edit District** and **Page 11 of 11**. The five visible legend items are not proof that only five districts exist across the entire First World. These are *geographic regions in the Lineage design*, not political territories. Do not imply walls, patrol boundaries, customs posts, fences or a visible game-world demarcation.

The owner screenshot shows Shattercap-colored outlines on northern and northeastern detached features. That is **explicit candidate design intent** and should be compared with the independent physical component ledger. It does **not** close the component-51 / headland / large NE island / detached-island/source-evidence holds by itself.

## Distinguish the view variants

The owner provided three full-world *biome* screens with different ink-weight modes, three full-world *grayscale relief* screens with different ink-weight modes, two small Kaelvar grayscale/biome pair images, two larger Kaelvar grayscale/biome pair images and the owner district-editor screen. These are multiple representations of the **same map**, not eleven alternative worlds.

The grayscale source shows relative terrain texture more clearly than the biome-only rendering. In Kaelvar, a darker-looking southern-central interior and several branching cyan courses provide qualitative support for a substantial upland/drainage region. The proposed Verdant Thalos should **not** be treated as lowlands everywhere; higher ground may fall within its final extent. The screenshots do not provide a known height legend, elevation in meters, certified watershed or proof of a volcanic cone.

Original code/source fingerprints remain frozen:

- Original source biome SHA256: `9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12`.
- Original source elevation SHA256: `02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d`.
- Original vector blob: `9cd6752e9dbca00796e5f7c013066bb0e5a96175`.
- Original raster dimensions: 4096×2355; crop `(60,60,3976,2235)`; authoring reference grid 2048×1152.
- User's qualitative height convention: **orange/red comparatively higher, cream comparatively lower**. This remains ordinal, not metrically calibrated.

## Strong, measured screenshot registration

Instead of guessing which screenshot location corresponds to a source contour, the eleven-image review aligns the owner editor against the already hashed original source image:

1. Editor Kaelvar screenshot #11 to enlarged biome screenshot #9 by SIFT/RANSAC: **188 inliers**, median **0.531 px**, 95th-percentile **1.837 px** residual.
2. Kaelvar biome screenshot #9 to full-world biome screenshot #3: **362 inliers**, median **0.165 px**, 95th-percentile **1.123 px**.
3. Full-world biome screenshot #3 to original hashed First World biome PNG, scaled uniformly for review: **1,915 inliers**, median **0.197 px**, 95th-percentile **0.886 px**.
4. Full-world grayscale relief screenshot #4 to same-view biome screenshot #3: **884 inliers**, median **0.097 px**, 95th-percentile **0.871 px**.

The approximate affine mapping from a screenshot #11 editor pixel `(x,y)` to original authoring reference sample `(u,v)` is:

```text
u ≈ 0.363452*x - 0.000010*y + 30.606672
v ≈ 0.000010*x + 0.363805*y + 99.900773
```

This is a **reference overlay transform**, not a promise that a one-pixel screenshot outline is an exact canonical boundary. Registration residuals are stage-local image-pixel estimates; image scaling, aliasing, varying screenshot modes and crop edges remain sources of uncertainty. Recheck the original source contour whenever a source-grid candidate is authored.

The evidence packet includes exact-color district-ink extraction from screenshot #11 (UI panel excluded), an overlay registered to the **original First World biome**, the same district ink on the grayscale relief source view, and a comparative screenshot with both C1-AA shared subchains. Derived previews preserve underlying original source assets and carry no terrain ownership claims.

A small [transparent original-source-reference district-ink SVG](assets/kaelvar-c1ac-owner-simulator-district-ink-reference-only-2026-11-15.svg) is **committed to Git** (17,203 bytes, SHA256 `6a0aaedfb4a4551dcbff6103bb5ca8405d1d923c0496577956af05a0657d2a8d`). It preserves the five approximate colored screenshot stroke groups in the 2048×1152 authoring frame and is intentionally **not a polygon set**. This lightweight reference layer does not change or include the original biome/elevation PNGs.

The full eleven-image **original PNG screenshot** packet remains **outside Git** for now, while its compact derived coordinate-reference SVG, source ledger and regression checks are committed without adding large screenshot binaries to the growing repository. The owner's downloadable packet includes original screenshot PNGs, SHA256 hashes, derived inspection previews and optional local registration scripts. Its exact ZIP SHA256 is
`b3f564438c3f18bc802818e4667024fc2e0654dd0f3387ff94a0308f77473be4`.
The repo's [manifest](kaelvar-c1ac-owner-fantasy-map-simulator-screenshot-evidence-2026-11-15.json) pins every original screenshot filename, dimensions, byte count and SHA256 so Codex can import the packet without ambiguity.

Verify the eleven extracted original captures with:

```powershell
node scripts/kaelvar-c1ac-simulator-evidence.mjs --verify-dir "C:\\path\\to\\extracted-simulator-packet"
```

Metadata and original registered repository PNGs can be checked without screenshot bytes using:

```powershell
node scripts/kaelvar-c1ac-simulator-evidence.mjs --check
```

No imagery should be auto-imported into the source rasters or `regions.json`.

## Immediate consequence for C1-AA / C1-AB

The direct owner editor capture **does not trace the same boundaries as the prior two four-waypoint C1-AA scratch chains**.

Using the registered screen positions, distance from each C1-AA northern trial waypoint to the nearest original *indigo Veyrholm editor ink* is approximately **68.1, 41.0, 20.0 and 11.0 screenshot pixels**. The southern C1-AA trial points lie approximately **44.0, 5.8, 9.4 and 3.2 screenshot pixels** from the nearest original *green Verdant editor ink*. This is a proximity measurement to *any matching-colored ink*, **not a point-to-point certified correspondence or an elevation difference**.

Thus:

- **North:** the editor's broader Veyrholm–Kharuun geographic interpretation substantially diverges from the earlier coast-adjacent shared-chain sketch. The existing C1-AA chain should remain as one *alternative* for comparison, not receive default priority for adoption simply because it passed source geometry checks.
- **South:** the earlier shared apron is partially close to the new drawn Verdant boundary, but its western approach and eastern drainage-course continuation still merit whole-interface review. Do not silently snap the earlier chain to the nearest colored screenshot pixel.
- **Auric/Kharuun:** the editor proposes a more irregular western/southwestern interface than a simple four-region envelope. Analyze the **whole source-registered edge**; the source may support longer natural transitions and feature turns.
- **Shattercap:** the owner-visible magenta proposals should inform later island adjudication, but the separately resolved original physical components and retained headland/island holds remain authoritative until their named source review completes.

There is now stronger justification to prioritize **large connected regional silhouettes and entire shared interfaces** over dozens of two- or three-reference-pixel waypoint microadjustments.

The current C1-P candidate accounting remains **79,419** mainland component-30 samples, **52,449** provisionally assigned and **26,970** unassigned. C1-AA/C1-AB scratch coverage `54,195/25,224` is still a reversible test outcome, not published ownership. No source image, island claim, canonical region polygon, transition width or settlement was changed by this evidence intake.

## Next bounded C1-AD action

1. **Use the owner screenshot proposal as the primary visual design alternative.** Compare it against the full C1-P outlines and each C1-AA local shared chain, on identical original-elevation and biome source views. The screenshot provides provenance and approximate alignment, but not independently verified polygon rings.
2. **Digitize only supported mainland shared interfaces**, favoring terrain- and drainage-coherent full returns. Where there is no strong topographic break, choose a reasonable shared primary boundary and leave an optional secondary environmental influence idea for later. Avoid permanent regionless ribbons in finalized land.
3. For **Veyrholm–Kharuun**, start with the editor's broad northern/southern geographic boundary instead of automatically extending the C1-AA northern chain. For **Kharuun–Verdant**, inspect its entire western/eastern approach and source drainage context. Compare **Auric–Kharuun** in the same whole-region pass.
4. Keep separate **original-physical-component interpretation**, **owner-proposed editor district ink**, **provisional geometric ownership** and **canonical publication** stages. A magenta island outline is not source-proof that Shattercap owns that land.
5. Produce one **reversible owner-screenshot-informed regional coverage proposal**, then apply the original coastline, label-30-only, shared-edge direction, excluded anchors, no-foreign-region, no-detached-component and full four-region combination gates. Record original screenshot hashes and source registration in the native report.
6. If conflicts occur, reject or keep a review HOLD without changing source masks or deleting original evidence. Region/UI/settlement/gameplay implementation and canonical population migration are outside this pass.

### Preserved lifecycle

Use the existing geography branch. No new permanent worktree, branch, PR, canonical edits, region catalog writes or island claims are justified by the screenshots. The local simulator save remains opaque/unmatched, and it was not read or uploaded during this connector pass.
