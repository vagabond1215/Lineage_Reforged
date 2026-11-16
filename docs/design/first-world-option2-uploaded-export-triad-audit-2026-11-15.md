# First World Option 2: uploaded State / Height / Biome export triad audit

Date: 2026-11-15  
Status: **MATCHED CHAT-UPLOADED IMAGE EVIDENCE / NOT FULL SOURCE REGISTRATION / SAVE LINKAGE HELD**  
Related: [macro geography lore revision](first-world-macro-geography-lore-revision-v1-2026-11-15.md), [Option 2 source registration gate](first-world-macro-geography-option2-source-registration-gate-2026-11-15.md).

## Source and limitations

The owner supplied three PNG export copies named below after the Codex live-app inspection reported the simulator was paused and the new Option 2 geography was displayed. This audit opened and inspected the **exact uploaded copies**; it did **not** inspect or hash the Windows originals, confirm what resolution the export selector was set to, read the native `.save`, or decode province/Voronoi data. The PNGs are **not** checked into the repository; the hashes are preservation identifiers for these exact conversation-uploaded bytes.

| Export | Filename | Dimensions | Size (bytes) | SHA-256 |
| --- | --- | --- | ---: | --- |
| State | `WorldMap_20261115_201735_State.png` | 2048 × 1177 | 765966 | `2ebf5f5eb13b5bb54fb27e7c4753dfee68a8cfd1da2b1b4ff425a81f28975f65` |
| Height | `WorldMap_20261115_201753_Height.png` | 2048 × 1177 | 1207558 | `62aa95ea0aa64639e22ca576019a7b760f7b85f081f38473301397263b54adf2` |
| Biome | `WorldMap_20261115_201806_Biome.png` | 2048 × 1177 | 1035459 | `d3661da113ac6ebbb4281b08c6f6c415d1b7745eec62a9b7f3a203b081d09355` |

The uploaded copies are **2K-class** even though the export UI reportedly offers up to 16K. The originals may have been downscaled before or during upload. Codex must confirm the raw files' local dimensions and bytes independently; these numbers cannot identify any other file.

## Shared canvas registration witness

All three copies are RGBA with opaque alpha. Direct pixel inspection finds an identical map rectangle **x = 30..2017 inclusive, y = 30..1146 inclusive**, corresponding to crop rectangle `[30,30,2018,1147)` and an inner picture of **1988 × 1117**. The surrounding gray/black/white frame must not be interpreted as terrain or polar ice.

The base ocean RGB `(64,126,255)` occurs at exactly **1,293,437 pixel coordinates in each image**, and **its full binary mask is exactly identical across all three exports**. Also, **1,916,984** image pixels have exactly identical RGB across all three layers, chiefly ocean, outlines and framing. This is strong evidence of common canvas placement and unchanged coastline presentation, but does **not** independently bind the images to a particular simulator save or prove local polygon topology.

The original Lineage map contract uses a **2048 × 1152** reference raster obtained through registration/cropping of older biome/elevation assets. The new exports have a **different full-image frame**. Any registration must first exclude the 30-pixel display border, then independently align inner land/coast features with the original source; **do not simply index uploaded (x,y) as current canonical (x,y)**.

## Owner-approved macro geometry visible in State image

| Macro parent | Principal visible State fill RGB | Observation |
| --- | --- | --- |
| Kaelvar | `(13,109,0)` | Dark green northwest continent |
| Valtherion | `(170,0,255)` | Purple northeastern supercontinent |
| Serathyl | `(255,142,210)` | Pink southwestern continent |
| Draemor | `(255,169,76)` | Orange south-central continent |
| Talmyra | `(120,87,0)` | Brown landmass east of Draemor |
| Myridian Chain | `(251,128,114)` | Coral-red island network, including detached jellyfish-shaped island |
| Lantern Isles | `(255,208,0)` | Yellow east-central network |
| Serpent's Wake | `(0,214,141)` | Remote eastern teal/light-green island chain |
| Dawnreach Isles | `(255,255,255)` | Northern white islands, including **Option 2** eastern connecting arc |

These values describe **sampled interior fill pixels**, not the complete antialiased palettes or shape boundaries. Geographic colors are **not nine political-state borders**. White Dawnreach requires special masking to distinguish its true island interiors from the white image frame.

### Northern Option 2

The exported State image visually supports the approved white U-shaped northern Dawnreach grouping and the adjacent red Myridian maritime islands. Fine northern-island segmentation and Nacre Shelf ownership are still deferred. In the Biome layer the same Dawnreach land pixels are predominantly **green**, without an obvious snow/tundra sign in this palette. The simulator biome legend and climate generation semantics must be checked before either claiming the arctic lore is disproved or automatically rewriting the ecology.

### Detached Myridian island

The jellyfish-shaped island in the central sea is visibly coral-red, consistent with macro parent `region.myridian_chain`, in the same state export. Its future neighboring merfolk city remains an **independent submerged polity**. A red surface island is not evidence of Myridian sovereignty below the sea.

### Draemor–Talmyra contact

The coast-adjacent cores of orange Draemor and brown Talmyra approach to approximately **6.32 uploaded pixels** (closest pure interior fill pixels near State image `(x=1070,y=760)` and `(x=1072,y=766)`; border/antialiasing and coast occupy the intervening pixels). The contact/narrow water geometry must be inspected in a **higher-resolution, native, local source** before classifying a connected land bridge, island chain or water channel.

The height and biome exports preserve the same coastline area. The two sides show substantial green biomes locally, consistent with a plausible ecological transition, but the images do not establish seasonal monsoons, actual passability, tidal arches, giant fauna, administrative treaty details or a continent-spanning route.

## Exact acceptance and hold dispositions

- **PASS: upload integrity**: all three PNG copies open, dimensions and SHA-256 recorded; canvas/ocean masks align exactly at uploaded pixel resolution.
- **PASS: broad visual geography**: nine intended coarse parent assignments, northern Dawnreach Option 2, detached Myridian island, and Draemor–Talmyra narrow contact are visible.
- **HOLD: full-resolution provenance**: these uploaded files are 2048 × 1177; confirm whether 16K raw originals exist and record their original hashes rather than inferring export selector resolution.
- **HOLD: save state link**: raw `.save` has not been proven to encode these exact exported State/Height/Biome positions; historical save hash is in prior MG-0 gate, not a new identity.
- **HOLD: source geometry**: no independent 2048 × 1152 transform, Voronoi decoding, complete connected-island component inventory or old/new coastline residual study was performed.
- **HOLD: local isthmus**: natural tidal arches, reliable land passage and small-boat conditions are approved lore, not yet demonstrated by this raster.
- **HOLD: detailed ecology**: no simulator biome palette legend, numeric elevation mapping or latitude projection corroborates precise arctic/temperate/tropical claims; honor the owner's canonical lore intention and keep exact biome revision separate.

## Smallest next safe Codex task

1. Inspect the **raw** Windows PNG export files and fresh save; report actual widths/heights, hashes, game export settings and timestamps. If large originals exist, preserve them unmodified.
2. Bind the paused loaded session/save and matching export triad by repeatable evidence; do not equate a same date with a proven binary match.
3. Register the exported **inner 1988 × 1117** image to the original First World biome/elevation references using a versioned transform and landmark residuals, not an assumed identical grid.
4. Produce read-only nine-parent candidate masks with *each disconnected island separately auditable*, preserving uncertainty near white islands, narrow colored boundaries and the natural crossing.
5. At a separately scaled local source, inspect the Draemor–Talmyra neck, ecology legend and tidal constraints; do not infer those structures from the 2K images.
6. Deliver a source-backed discrepancy/owner-review ledger before any canonical region, route, engine, Save or source PNG changes.

**No canonical geography or lore data is updated by this audit.** Its conclusions describe the exported image evidence only.
