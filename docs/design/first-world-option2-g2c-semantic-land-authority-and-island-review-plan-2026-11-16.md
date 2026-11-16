# First World Option 2 G2-C: Island correspondence, native-semantic gate and review plan

Date: 2026-11-16  
Status: **G2C_RENDERED_CORRESPONDENCE_MEASURED_SEMANTIC_LAND_AUTHORITY_HELD**  
Sources: [G2 16K source study](first-world-option2-g2-native-physical-component-review-2026-11-16.md), [G2-C machine readback](first-world-option2-g2c-native-classifier-correspondence-2026-11-16.json), [G2 geography roadmap](first-world-option2-world-plan-and-geometry-roadmap-2026-11-16.md), [next execution prompt](../dev/first-world-option2-g2d-source-semantic-and-island-certification-prompt-2026-11-16.md).

## Decision: a source continuity lead, not 171 official islands

A new independent **pixel-overlap crosswalk** was run on all original 16384×9421 State/Height/Biome PNGs, comparing the existing exact-State rendered-water mask A with the wider Biome+Height chromatic mask B. Both mask algorithms were already recorded in G2. For each of 4-neighbor and 8-neighbor connectivity, exact overlapping pixels were counted between component labels using source-coordinate bands, not nearest-centroid guesses, ephemeral index equality, source State parent coloring or transformed 2048×1152 preview coordinates.

On the 15904×8936 inner image, B rendered land is **strictly a subset** of A: B removes 44,716 land-colored/stroke pixels from A and adds none. This is 0.031464% of the entire crop and 0.123881% of A's land mask. There are no unmatched rendered components in either direction.

| Statistic | 4-neighbor | 8-neighbor |
| --- | ---: | ---: |
| A rendered components | 169 | 161 |
| B rendered components | 171 | 163 |
| A components that split into multiple B components | **1** | **1** |
| B components that fuse several A components | **0** | **0** |
| A components with no B overlap / B components with no A overlap | 0 / 0 | 0 / 0 |
| A components matching exactly one B with ≥99% mutual pixel retention | 138 | 130 |

The strict 99%-one-to-one stable group covers 52.366% of A land pixels, **not because the other 47.634% vanishes**: the giant Valtherion component is not classified one-to-one at all because B subdivides it into three pieces. Its main B fragment still retains 99.7666% of that source A component's pixels. A single A component losing a thin rendered bridge can create multiple visually distinct B pieces.

### Two specific unresolved Valtherion coastal pieces

A 4-neighbor Valtherion main component A label 1 (17,003,582 rendered pixels; full-source bbox `[8060,318,14872,5373)`) becomes B mainland label 1 plus two small B fragments:

| Review lead | A/B fragment pixels | B 4-neighbor label | Full 16K bbox `[x0,y0,x1,y1)` | Visual review center |
| --- | ---: | ---: | --- | --- |
| V1 | 2,916 | 37 | `[8164,1592,8223,1658)` | `(8192,1626)` |
| V2 | 3,169 | 60 | `[8744,2391,8823,2452)` | `(8780,2422)` |

Eight-neighbor B labels for the same pieces are 36 and 59. Both image ROIs visually show offshore-looking land with a narrow coast-ink/glow junction. **They are review locations, not certified independent islands or sovereign claims**. An administrative map-color stroke cannot serve as an island landbridge, and an ocean pixel cannot certify a navigable channel without native terrain evidence.

Under both render masks, major sampled Kaelvar, Serathyl, Draemor–Talmyra, Lantern, Dawnreach, Myridian and Serpent's Wake components show unique B matches retaining at least 99% of A's pixels. This makes them useful *source-image review anchors*, not approved physical island IDs or child Lineage regions. The Draemor–Talmyra joint component is retained at **99.993951%** under the stricter crosswalk, which reinforces rendered continuity without certifying tides, stone arch widths, walkability or routes.

### Machine integrity and private save limitation

- Source image dimensions are exactly 16384×9421; original State, Height, Biome hashes are recorded in G2-C JSON. Source images and saved game files were **not modified**.
- The owner-provided archival G2 component ledger remains outside Git. The local new crosswalk ZIP `FirstWorld_Option2_G2C_CrossClassifier_Review.zip` is 102,474 bytes, SHA-256 `a9ce35eed24240cfe13c97e9bc998b75600357c170a5ac5bc3c2b7c1644d5edf`; it contains exact row-level correspondence, a source-only Valtherion two-ROI image, reproducible source script, native report, and a **private-only safe save fingerprint**. It **does not contain the raw game save or original full-size PNGs**, and is not a canonical repository binary.
- A locally available historical `20260315141309.save` has a readable `NFW_SAVE_BIN` prefix and a version integer of 1 at offset 12. Its remaining bytes are high entropy and **undecoded**. It has 1,182,168 bytes while the prior owner Windows audit receipt listed a same-named file of **1,235,224 bytes**. Neither same-name identity nor correspondence to the November Option 2 exports is established. Do not publish private save binary or automatically parse uncertain encrypted/compressed bytes.
- The simulator developer's public Steam announcements discuss **binary-save migration, staged decryption/decompression and a possible future redesign beyond Voronoi**. These are software-development intentions, not proof of the format of this exact installed build or a public supported decoder: https://steamcommunity.com/app/3035500/announcements/

## G2-D detailed path to actual authority

**D1. Freeze exact simulator/export pairing.** In the user's Windows machine, inventory actual active Fantasy Map Simulator version/build and currently loaded save's path, timestamp, size and SHA-256. Do not assume that a March-named save corresponds to November exports. Prefer UI evidence that the Option 2 state was loaded when each of the three known PNG exports was generated. Preserve original Saves and export files. Never overwrite or convert an existing save just to satisfy the audit.

**D2. Ask for native land semantics, not alternative blue thresholds.** Look for official/current simulator export or Map Editor functions that expose cell land/water, source height threshold or terrain mesh together with a versioned coordinate map. Only if an actual matching land mask / verified cell-geometry schema is available, register classifier C. A new threshold on the same PNGs **does not** count. If an official export is unavailable, outcome `SEMANTIC_LAND_AUTHORITY_HELD` is correct.

**D3. Whole-island review using G2-C lead ledger.** For each physical-land candidate, compare A/B and any certified C on source coordinates; record component overlap, holes, river/shore ambiguity and actual geometry. Prioritize V1 and V2 Valtherion, Dawnreach white U-arc, detached red Myridian jellyfish island, Kaelvar NE whole island/Shattercap, Serpent's Wake, southern radial-river candidate, and any mixed-parent piece. If uncertified, keep island owner `UNKNOWN` with a review reference, not new production IDs.

**D4. Local Draemor–Talmyra terrain and vessel-class verification.** Owner-approved natural tidal stone isthmus with small-craft stone arches is design intent. Native imagery confirms rendered land continuity, but only a source-linked local terrain description can ground exact shore, arch clearances, monsoon risk, breeding-ground closures and route segmentation. Do **not** create an always-open road or large-ship channel from a pixel connection.

**D5. Source registration.** Candidate raw16K→2048×1152 transform remains review-only until independently declared landmark locations, inverse/pixel-center details and residuals pass for all quadrants. Preserve the current `Rectangle(60,60,3976,2235)` legacy source-crop contract, including its *width/height* semantics.

**D6. Integration and gameplay.** Only after C, island ownership and geometry review should Lineage publish stable whole-island IDs, variable-sized child-region polygons with exact reciprocal seams, political overlays, environment zones and directed transport edges. Tests must cover compatibility of the legacy hex-based runtime and persistent saves.

## Exit status and proof

**Achieved:** exact A/B source component crosswalk; one Valtherion three-part split localized to two bounded source ROIs; candidate whole-island review queue; read-only save-format fingerprint that refuses to pretend to decode.  
**Still held:** native semantic land class, paired current simulator save identity, certified 16K reference registration, actual physical-island IDs, undersea merfolk sovereignty assignment, exact isthmus arch/route geometry, political governments, region child boundaries and runtime publication.

**Disposition:** `G2C_REVIEW_READY_AS_RENDERED_EVIDENCE`; `G2D_SEMANTIC_LAND_AUTHORITY_HELD`. No new islands or routes were published by the review.
