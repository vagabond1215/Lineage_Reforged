# First World Option 2 G2: native physical-component review and topology sensitivity

Date: 2026-11-16  
Result: **G2_AMBIGUITY_HELD** (component inventory prepared, *physical island identity not approved*)  
Owner intent: use nine approved geographic parents with contiguous variable-sized future subregions, distinct from political sovereignty and traversable routes.  
[Machine measurements](first-world-option2-g2-native-physical-component-review-2026-11-16.json) · [World plan](first-world-option2-world-plan-and-geometry-roadmap-2026-11-16.md) · [Next technical G2 prompt](../dev/first-world-option2-g2-physical-components-implementation-prompt-2026-11-16.md)

## Source and reproducibility

The original owner-provided ZIP `WorldMap_20261115_201735_State.zip` passed CRC and original SHA-256 `4e0563a71fa225c5433e69c55131275f3fa49c831fbd3091c1eda3dd2575c87d`. Extracted PNGs were byte-verified, **not modified**, and decoded in full **16384 × 9421** source resolution:

| Original layer | Original SHA-256 |
| --- | --- |
| State | `419f48be8991dd682fe5bbce601408ed1832b73e679b104a0c7f082abd6295de` |
| Height | `776bb1dd3d708265741b6433b3152adb098696f60d8bf4ce85205c649bb6d8ce` |
| Biome | `c6904f0f23c2a7cf7fd880b38a4a9a8fa51f5bb6260605ff53ccd8a20b324fe2` |

The provisional rendered-frame crop is `[x:240..16143,y:240..9175]` inclusive, or 142,118,144 inspected pixels. It is **not** a registered canonical region geometry. All output was generated outside the repository.

The review package `FirstWorld_Option2_G2_Physical_Component_Review.zip`, ZIP SHA-256 `e0f8d86addbf6d7a1d27bb09fb2de4cca7aef714807b5f65b3823e35381ffa47`, contains the complete 664-row provisional ledger across four classifier/connectivity combinations, a reproducible full local Python/OpenCV audit source, local native run log, report JSON, source-based component atlas, and a native-coordinate Draemor–Talmyra triptych plus classifier disagreement panel. **Original 16K images are not duplicated in the package**, since they are already preserved in scoped Git LFS. The full row-level ledger SHA-256 is `8b330a30bd10dea6bba1b1ed989f64225efa79df080a4fd9dff150cb56eaef8f`. It is a review artifact, not a production island-ID registry.

A streamlined fail-closed [repository audit tool](../../scripts/first-world-option2-g2-component-audit.py) reproduces the original source hash checks, both land-mask definitions, 4-/8-neighbor component ledgers, four-neighbor erosions of 1, 2 and 3 source pixels, sampled exact State parent fills, perimeter proxies and the contact witness. [Scoped source-native CI](../../.github/workflows/first-world-option2-g2-native-component-review.yml) separately hydrates the original LFS files and validates exact pixel totals and read-only result status.

## Classifiers: two useful probes, not independent land semantics

**A, existing strict rendered ocean:** `State R==64 && B==255`, green unconstrained. Every other cropped pixel is a **rendered non-ocean candidate**, potentially including shoreline outlines, inland rivers and map strokes.

**B, broad chromatic Biome+Height consensus:** Each original layer is converted to OpenCV HSV and requires hue 93..125, saturation ≥125, value ≥195; BGR blue ≥195, red ≤135 and green ≥70. Only pixels accepted by **both** layers are classified water. B is not derived from State parent colors and intentionally tests wider coastal-blue shades, but Height and Biome use a **shared visual water rendering pipeline**. Their broad-blue votes disagree at **zero** pixels across the crop. Thus B is a second render-color classifier, **not independent simulator-native land/water ground truth**.

A calls **106,022,308** pixels water and **36,095,836** pixels rendered non-ocean. B calls **106,067,024** pixels water and **36,051,120** non-ocean. Their classifications differ at exactly **44,716 pixels**, about **0.0315%** of the crop, all within an already visually consistent coastline frame. Even this small disagreement can create or remove thin land components.

| Classifier | 4-neighbor candidates | 8-neighbor candidates | 4-neighbor count after 1 / 2 / 3 pixel cross erosion |
| --- | ---: | ---: | --- |
| A exact State RGB | **169** | **161** | 166 / 166 / 170 |
| B Biome + Height chromatic | **171** | **163** | 167 / 166 / 172 |

The non-monotonic component counts after erosion are possible: very small pieces can vanish while narrow connecting strips can break apart. Neither 169 nor 171 is an audited count of real islands. Parent pixels sampled every fourth original pixel are only *candidate colored interior associations*. Components can have holes, intersect river strokes and join through a shaded border.

### Largest observed rendered land components

Under A four-neighbor, the six largest *ephemeral* components are:

| Provisional component | Area in 16K rendered pixels | Candidate geographic parent(s) |
| --- | ---: | --- |
| 1 | 17,003,582 | Valtherion |
| 110 | 6,745,062 | Draemor **and** Talmyra |
| 25 | 5,300,293 | Kaelvar |
| 98 | 2,167,485 | Serathyl |
| 138 | 1,224,319 | Lantern Isles |
| 60 | 411,053 | Valtherion offshore |

Other owner-review leads include Kaelvar candidate index **21** (249,557 rendered pixels, bounds `[4080,1155,5015,1700)`) for the large NE island, detached Myridian candidate **85** (234,732 pixels, bounds `[7212,3394,7816,4381)`), a Myridian chain candidate **70** (383,672 pixels), a Serpent's Wake chain candidate **89** (194,391 pixels), and Dawnreach northern candidate **28** (179,875 pixels). These are **map review locations**, not approved island names, ownership divisions or stable IDs. The exact sample-ledger also contains six sub-100-pixel components under each four-neighbor classifier and eight components without sampled exact parent cores. Preserve them in an unknown/review queue.

## Draemor–Talmyra natural isthmus: current evidence

Two interior State samples, orange `(7428,6552)` and brown `(9240,7436)`, map to the **same rendered-land component** under both A and B and both 4-/8-neighbor rules. This remains true after 1, 2 and 3 native-source-pixel four-neighbor erosion. Under strict A four-neighbor the combined component has area **6,745,062** and full-resolution bounding box `[5964,4948,10030,8666)`; exact-color stride-four sampled cores are 261,310 Draemor and 99,054 Talmyra pixels. It is the **only substantial two-parent** component identified by this preliminary exact-fill sampling.

This supports the owner's design of a naturally continuous tidal stone connection, but does **not** prove a traversable crossing, minimum passage width, stable shoreline under monsoons, predator safety, a waterway or the geometry of natural arches. The screenshot ink, shore glow and small cyan rivers may affect apparent contact. **No land-route or shipping edge was created.**

## Source review queue

1. **Draemor/Talmyra:** local choke point, shoreline and river-stroke sensitivity, actual land connection semantics, small-craft arch clearance versus large vessels, seasonal closure.
2. **Dawnreach U-arc / Myridian northern chain:** avoid white export border and do not reassign polar pieces by color; keep the groups geographically distinct.
3. **Detached central Myridian island:** preserve jellyfish-shaped land and independent nearby merfolk undersea sovereignty.
4. **Kaelvar large NE island, Shattercap and Coast 40:** whole physical units remain held without owner-approved ownership.
5. **Serpent's Wake teal chain:** retain decentralized ecological/trade identities, not a uniform piracy attribution.
6. **Valtherion, Serathyl, Lantern, tropical Talmyra and southern radial-river volcanic-island candidate:** validate detached islets, river-mouth masks and whole-island membership; do not infer political control.

## G2 exit gate and disposition

**Completed now:** source integrity, two explicit chromatic render-mask probes, full native component ledgers for four combinations, 1–3 pixel sensitivity, source-based atlas, native neck ROI, reproducible code and CI.

**HELD:** a truly independent semantic ocean/terrain source, save-to-export identity, native Voronoi topology, reliably enumerated *physical* islands, source-to-2048 pixel-center registration, tidal-neck minimum reliable width, geographic child regions, political ownership, traversable routes and save-safe runtime integration.

**Outcome: `G2_AMBIGUITY_HELD`, not `G2_COMPONENT_INVENTORY_APPROVED`.** Continue with native simulator land/water semantics or an independently certified terrain/mask authority before promoting components into stable geographic identities. A carefully documented held candidate is preferable to inventing islands from render pixels.
