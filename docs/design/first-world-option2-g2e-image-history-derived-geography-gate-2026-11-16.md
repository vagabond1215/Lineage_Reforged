# First World Option 2 G2-E: image/history export reality and derived-geography gate

Date: 2026-11-16  
Status: **OWNER-CONFIRMED_EXPORT_UI_HISTORY_AND_IMAGE; DERIVED_CARTOGRAPHY_REVIEW_READY; CANONICAL_GEOMETRY_HELD**  
Predecessors: [G2-D native provenance](first-world-option2-g2d-native-source-provenance-and-certification-plan-2026-11-16.md), [G2-C pixel crosswalk](first-world-option2-g2c-semantic-land-authority-and-island-review-plan-2026-11-16.md), [nine-parent roadmap](first-world-option2-world-plan-and-geometry-roadmap-2026-11-16.md). Implementation handoff: [G2-E prompt](../dev/first-world-option2-g2e-authoritative-terrain-acquisition-prompt-2026-11-16.md).

## Owner-confirmed limitation

The owner reports that the installed **Fantasy Map Simulator** export UI provides **History** and **Image** exports only. Do **not** instruct the owner to find a nonexistent built-in land/water, Voronoi cell or province geometry export. The existing `.save` files are *internal persistence*, not a user-exported, documented geometry schema. They need not be decoded for the next geography pass. The recorded historical save and current Option 2 export pairing remain unverified.

**Practical implication:** Treat the already SHA-256-verified original State, Biome and Height images as immutable **rendered source evidence**. History export may explain named states, dates, borders and events **only where the text actually supports them**; it does not encode missing polygon coordinates or overwrite approved geographic parent ownership. Only owner-reviewed derived geometry can become Lineage's authored cartography. Never label it as recovered native simulator topology.

## Authority and publication hierarchy

| Layer | Evidence | Allowable use today | Release restriction |
| --- | --- | --- | --- |
| `RENDERED_SOURCE_IMAGE` | 16K State/Height/Biome SHA-256 originals | Placement, colored parent hints, coast and island candidate shapes | Do not interpret ink or color alone as semantic land class or sovereignty |
| `RENDERED_MASK_A_B` | 169/161 vs 171/163 rendered connected components | Provisional coastal topology, uncertainty detection, Valtherion V1/V2 review | No stable island IDs, routes, or source Voronoi claims |
| `HISTORY_TEXT` | Owner's available History export, if supplied | Narrative timeline or simulation-provenance notes | No pixel geometry inference; distinguish simulator history from Lineage canon |
| `OWNER_AUTHORED_DERIVED` | Source-registered, owner-approved drawn/cleaned coast + island ledger | Future authored Lineage geographic base layer | Requires explicit per-issue owner review and geometry validation |
| `SIMULATOR_NATIVE_MESH` | No supported UI export | None | Remains `NOT_RECOVERED`; not required for owner-authored path |
| `LINEAGE_POLITICAL / ROUTE` | Separate treaty, settlement and path approvals | No automatic adoption from colors | Keep sovereign merfolk independent; tidal neck passage class is not inferred from pixels |

## Next execution (G2-E1 through G2-E4)

**E1. Derive a noncanonical coast candidate.** Use the unmodified verified 16K images, exact crop assumptions and explicit 16K→2048 reference candidate mapping. For classifiers A and B, generate a pair of coast contours and a **difference/uncertainty band**, with polygon holes, closure, winding, source hash, and contour simplification tolerance. Save new outputs *outside Git* initially. A single chosen blue threshold is **not** an owner-approved world coast.

**E2. Ground the review queue in specific original coordinates.** Preserve Valtherion V1 `[8164,1592,8223,1658)` and V2 `[8744,2391,8823,2452)` as **AMBIGUOUS_OFFSHORE_CONTACT**, not two automatically created islands. Include Kaelvar NE island/Shattercap, Dawnreach white U-arc, detached red Myridian jellyfish island and northern chains, Serpent's Wake, disputed small pieces, and Draemor–Talmyra. For each, show State, Height and Biome crops with both mask contours and **uncertainty pixels**. Keep all unknown parent affiliations `UNASSIGNED_PENDING_OWNER`.

**E3. Record bounded owner decisions.** For each review entry, ask whether to keep its physical boundary as one connected landmass, mark as separate island, or keep unresolved. Require a source ROI, annotated alternatives, geometry evidence, reviewer/date, chosen boundary, and confidence; allow `HELD` without inventing a result. The nine established geographic parents are retained, but **not** used as automatic political sovereignty. The neighboring merfolk city is independently sovereign.

**E4. Promote only after review.** A *separate future PR*, not this one, may publish stable `OWNER_AUTHORED_DERIVED` geographic component IDs and child-region candidate polygons once the source transform, coast seam topology, holes, component correspondence, QA and explicit owner decisions pass. The terrain is then Lineage's **authored interpretation of Fantasy Map Simulator images**, not recovered simulator Voronoi province/district data. Preserve source images, legacy compatibility, save replay and rollback. Do not write routes, bridge clearances, tide closures or political states based on rendered adjacency.

## Acceptance record

- **DONE:** Five original SHA-256 source witnesses; old crop semantics; 18-window coastline preview review; G2 and G2-C native 16K mask comparison and uncertainty localization.
- **OWNER-CONFIRMED:** Installed simulator's user export UI offers History and Image, not direct semantic terrain.
- **NEXT IMPLEMENTABLE:** Review-ready **dual-mask coast candidates and owner decision ledger**, with explicit hold flags and no canonical map write.
- **HELD:** Original `NFW_SAVE_BIN` decoding, independent native cell data, authoritative save-to-image pairing, registered geographic base layer, permanent island ownership, children, political sovereignty and travel graph.

The absence of a native export is **not a requirement to wait indefinitely**. The proper alternative is to author a new, openly labeled cartographic layer under explicit owner review.
