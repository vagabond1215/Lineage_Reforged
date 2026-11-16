# First World Option 2: 16K rendered land connectivity and three-layer coastline witness

Date: 2026-11-16  
Status: **DIRECT ORIGINAL 16K RASTER REVIEW, NONCANONICAL; SOURCE REGISTRATION AND SAVE LINK HELD**  
[Machine-readable evidence](first-world-option2-16k-rendered-connectivity-evidence-2026-11-16.json) · [16K source manifest](first-world-option2-16k-export-triad-manifest-2026-11-15.json) · [Owner-approved macro lore](first-world-macro-geography-lore-revision-v1-2026-11-15.md)

## What was inspected

The three **actual 16384×9421 PNGs**, State, Height, Biome, from the owner's original [Option 2 archive](../../packages/content/base/world/map_assets/first_world_simulator_option2_2026_11_15/) (now checked into master with Git LFS). The current C1-P native workflow for the repaired Voronoi guard, [run 43915175838](https://github.com/vagabond1215/Lineage_Reforged/actions/runs/43915175838), completed **successfully** on C1 head `ca804820297fd2f4d86a67e213eecb408a02f774`.

The direct raster analysis **did not** use a decoded simulator save, load an original First World source raster from the Windows repo, reclassify the original source polygons, accept real Voronoi cells, modify any saved images, edit region content, or publish coordinate geometry.

## Reproducible image-level method

1. Verify all exact original PNG SHA-256 values against the committed 16K source manifest. Never use the separate 2048×1177 conversation previews as though they were the 16K input.
2. For each layer, exclude the map's drawn outer frame by taking `x=240..16143`, `y=240..9175` inclusive, a **15904×8936** image. This is an *observed export-frame crop*, not yet a registered old-world coordinate transform.
3. Define an exploratory **rendered ocean** mask for pixels with exact RGB `R=64` and `B=255`, independent of the green channel. Open-ocean blue and its cyan shore glow share these values; rivers, drawn shoreline ink and land fills generally do not.
4. Treat every other pixel in that crop as a potential rendered land pixel. Run 4-neighbor and 8-neighbor connected-component analysis independently. Do **not** use the color-fill components or their pixel labels as island/province identities.
5. Associate each major 4-neighbor rendered-land component with **exact** interior State fills for the nine geographic-parent colors, while recognizing that a shared landmass can have several distinct geographic parents.
6. Compare the ocean-mask classifications at exactly matched 16K coordinates across State, Height and Biome. Keep the tiny mismatches explicit, rather than saying the whole RGB layers are equal.

The classification is intentionally strict and very simple. It can include a river or painted coastal line as render-land and can confuse corner-touching, glow edges, small dots or holes. Consequently the component counts are **not an authoritative independent-island inventory**.

## Measurements from the original 16K files

| Witness | Result |
| --- | --- |
| Original PNG size per layer | 16384 × 9421 |
| Interior image rectangle | `[240,240,16144,9176)` |
| Rendered water-color pixels (State) | 106,022,308 |
| Other/rendered-land pixels (State) | 36,095,836 |
| Four-connected components (excluding background) | **169**, of which 163 have ≥100 pixels |
| Eight-connected components (excluding background) | **161**, all 161 ≥100 pixels |
| State vs Height rendered-water mask differences | **7 pixel locations** |
| State vs Biome rendered-water mask differences | **7 pixel locations** |
| Height vs Biome rendered-water mask differences | **0 pixel locations** |

`R=64, B=255` is an interpretation of the **rendered visual palette**, not native simulator water classification. The seven differences are **not** a count of all RGB differences between the layers. The exact seven pixel locations are in the JSON evidence, along with source hashes and independent sample coordinates.

### Most important new observation: Draemor and Talmyra share rendered land continuity

Using a strict four-connected non-ocean-pixel mask on **each of the three original layers**, a point in orange Draemor `(7428,6552)` and one in brown Talmyra `(9240,7436)` lie in the **same connected component**. With the State layer's ephemeral component labeling, this is ID **110**, with **6,745,062** rendered-land pixels and bounding box `[5964,4948,10030,8666)`.

That same component contains **4,181,465** exact orange interior fill pixels and **1,585,206** exact brown fill pixels. Across the nine macro-parent fills, this is the only **large dual-parent** rendered component detected in the current report.

This is a valuable direct raster witness for the owner-approved **natural Draemor–Talmyra tidal stone isthmus**. It is notably stronger than merely asserting those colored coastlines approach each other. But **it still does not prove** the widths, tidal arches, flood mechanics, breeding habitat, transit permissions or exact registered route. A one- or few-pixel painted connection is not automatically a walkable world-scale crossing. Do not synthesize a route, ferry or polity border from this component.

### Northern islands and detached Myridian surface island

The white northern Dawnreach Option 2 and red Myridian islands are visibly independent *colored geographic groups*. The crop prevents confusing the white paper/frame with the white polar islands. The detached red jellyfish-shaped island remains **Myridian geographic-parent** evidence only; the nearby sovereign underwater merfolk city receives no surface-derived claim. Neither `region.nacre_shelf` nor any internal child region is reassigned.

Prior exact-core color probes reported multiple disconnected samples for both groups. **Do not cite those color-core counts as approved physical-island counts** because rivers, coastal outline strokes and gaps split colors; different contact models merge differently.

### What this analysis does NOT establish

- The full 16K exports' exact transform into `world_map.first_world.reference` (2048×1152) or any physical geodetic projection.
- That the 2026-11-15 rendered State map corresponds *exactly* to the opaque `.save` currently loaded by the simulator.
- Stable Voronoi cell IDs, province-to-cell membership, district assignments or approved Lineage region polygons.
- A semantic land/water mask from source gameplay data, numeric elevation in meters, exact climate categories or all tiny islands.
- Routes or legal navigation permissions across the natural tidal neck.

## Source-registration acceptance gate

**Next: use the user's local authenticated checkout** to inspect both old baseline PNG bytes and the three Git LFS PNGs together. Detect actual old PNG dimensions rather than blindly assuming a 2048×1152 source raster; prior source provenance refers to original **4096×2355** framed PNGs and a registered **2048×1152** *reference*, which are different concepts. Resolve this from exact loaded file headers.

An optional **display-frame normalized hypothesis** maps
`u ≈ (x16−240)×2048/15904` and
`v ≈ (y16−240)×1152/8936`.
This is **not** a proven original-raster registration; it merely maps the visually inferred inner 16K frame onto the reference rectangle for initial feature search. Do not publish geometries based on it.

The actual pass should fit and freeze the source transformation with original shoreline landmarks and held-out residuals; compare land-connected component topology at both resolutions, especially the narrow tidal crossing, the white/red northern boundary, large northeastern Kaelvar island and detached Myridian island. Produce an unmatched-island ledger instead of auto-assigning tiny components. The corresponding local-only [Codex handoff](../dev/first-world-option2-16k-registration-next-native-handoff-2026-11-16.md) spells out exact gates.

**Disposition: evidence preserved; C1 geometry and canonical region publication remain HELD.**
