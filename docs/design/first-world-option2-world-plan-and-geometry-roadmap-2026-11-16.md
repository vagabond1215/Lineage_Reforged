# First World Option 2: Map plan, geography layers and implementation roadmap

Date: 2026-11-16  
Status: **GEOGRAPHIC-PARENT DIRECTION APPROVED; IMAGE REGISTRATION REVIEWED; ALL NEW CANONICAL GEOMETRY HELD**  
Planning image: owner-exported Option 2 State preview, plus a source-based nine-parent/18-window planning atlas generated outside Git from the original owner ZIP.  
Evidence: [original 16K triad](first-world-option2-16k-export-triad-manifest-2026-11-15.json), [rendered connectivity review](first-world-option2-16k-rendered-connectivity-review-2026-11-16.md), [registration review](first-world-option2-legacy-16k-preview-registration-review-2026-11-16.md), [18-window audit](first-world-option2-fixed-window-coast-audit-2026-11-16.json).  
Authority contract: [coordinate-first](coordinate-first-world-geography-migration-contract-2026-11-13.md), [owner-approved macro lore](first-world-macro-geography-lore-revision-v1-2026-11-15.md).

## 1. Map design objective

Build a single First World that looks and behaves geographically coherent: connected shorelines and natural features, distinct physical islands, landforms and watersheds, contiguous regional subdivision where appropriate, separate geographic and political claims, and route edges confirmed by source terrain and authored crossings.

The approved simulator map is **Voronoi-derived**. Keep these distinct levels: `RENDERED_RASTER` / `PHYSICAL_LAND_COMPONENT` / `SIMULATOR_VORONOI_CELL` / `SIMULATOR_PROVINCE` / `SIMULATOR_DISTRICT` / `LINEAGE_GEOGRAPHIC_REGION` / `POLITICAL_SOVEREIGNTY` / `TRAVEL_GRAPH`. Neither color-pixel connectedness nor adjacency between different levels can promote data into an approved higher authority.

**New geography uses coordinate-first explicit polygons**, versioned 2048 × 1152 reference registration and stable area IDs. The existing legacy hex-dependent runtime and save compatibility remain intact until a later migration approval. There is no approved global geodetic projection, underwater claim inferred from a surface island, pixel-to-elevation calibration or direct real-world travel distance.

## 2. Nine approved geographic parents

| Parent | Position / color in Option 2 State | Geographic and lore character | Priority holds |
| --- | --- | --- | --- |
| `region.kaelvar` | NW dark green mainland | Upland hinterland, complex northern coast, greener southern peninsulas | The large NE island is whole until ownership resolved; Shattercap and Coast 40 holds |
| `region.valtherion` | Great NE violet mainland | Largest continent; rivers, fertile basins, diverse ecosystems | Do not annex white northern islands or infer basin province boundaries |
| `region.serathyl` | SW pink mainland | Wooded/maritime continent, indented western shores | Windward Spine remains a separate locality/geometry audit |
| `region.draemor` | South-central orange mainland | Agricultural river basins, wet-temperate plains, grain export | Narrow rock neck with Talmyra, wetland/flood and shared administration details |
| `region.talmyra` | Southern brown mainland immediately SE of Draemor | Hotter tropical/savanna/forest frontier; spices, timber and mineral export | Independent ecology and identity despite continuous rendered land |
| `region.myridian_chain` | Red intercontinental/northern islands, detached red center island | Naval, pilotage and maritime-service network; trade rivalry with Lantern | Surface-only geographic parent; independent merfolk undersea city not absorbed |
| `region.lantern_isles` | Yellow central/east-central island systems | Warm-sea merchant and transshipment economy | Exact island boundaries and legal ownership held |
| `region.serpents_wake` | Remote eastern teal serpentine chain | Decentralized fishing, tourism, commerce and confederated local fleets; covert piracy not a universal identity | Reefs, storm exposure and local inter-island passages held |
| `region.dawnreach_isles` | White northern U-shaped Option 2 arc | Cold polar/subpolar island chain with winter ice, fisheries and seasonally constrained harbors | Distinct from red Myridian and violet Valtherion; Nacre Shelf attribution held |

State-map colors are **geographic parents, not nine political kingdoms**. Keep political jurisdiction and trade/war diplomacy independently versioned. The Draemor–Talmyra rock passage is naturally land-connecting with tidal arches for small craft only as owner-approved design intent; no unrestricted ship canal, bridge, ferry or walking edge is implicit in this raster.

## 3. Hierarchical geographic plan

1. **Source images:** preserve two original 4096 × 2355 First World Biome/Elevation PNGs and all three original 16384 × 9421 Option 2 PNGs. Do not redraw, recolor or downsample the archived authority.
2. **Coordinate registration:** validate the mapping from 16K export to the old source crop `(x=60,y=60,width=3976,height=2235)` and then authored `world_map.first_world.reference` 2048 × 1152. Record pixel-center/interpolation convention and residuals. The archived SIFT fit is a candidate, not approved calibration.
3. **Physical landmass registry:** classify actual land/water independently of administrative parent colors, preserve island connected-component topology with four-/eight-neighbor and erosion sensitivity, holes, detached land, offshore rock, river mouths and ambiguous shore ink. Assign stable component IDs only after source-supported acceptance. The previous 169/161 counts are heuristic rendered-component counts, not approved islands.
4. **Geographic parent membership:** overlay the nine approved macro-parent memberships over whole physical components where supported. Draw exception ledgers for disputed, detached, mixed or unassigned components. No physical island is silently split for one pixel's administrative color.
5. **Internal Lineage geographic regions:** regions may differ in area; fit to coasts, watersheds, landforms, biome transitions and source Voronoi province/district evidence where verified. **Adjacent regions should meet cleanly**, with matching reciprocal seams unless a named river, no-man's-land, protected habitat or legal buffer is deliberately modeled. No accidental gaps, slivers, unexplained overlaps or disconnected ownership.
6. **Ecology, settlements and resources:** derive climate, terrain, watershed, habitat suitability and site relationships from independent ecological evidence, not administrative State RGB. Preserve current settlements and economy until the coordinate migration gate.
7. **Political and maritime authority:** separately review settlements, sovereign governments, shared crossing management, merfolk undersea independence, customs zones, maritime seasons and conflict/treaty systems. Geographic labels do not grant legal sovereignty.
8. **Travel graph and runtime:** explicitly author road, pass, harbor, ferry, channel, walking/craft movement and seasonal closure edges after topology and physical dimensions are grounded. Retain the existing legacy hex compatibility interface until tested migration.

## 4. Phased delivery and exit gates

| Stage | Deliverable | Required evidence / release gate | Status |
| --- | --- | --- | --- |
| G0 Source archive | Five original PNG identities, source manifest and save inventory | Exact SHA-256, IHDR, LFS hydration and no source writes | **DONE** |
| G1 Reference alignment | Candidate raw16K→reference transform and fixed geographic coastline-review set | SIFT candidate plus independent Biome/Height coast windows, legacy crop semantics, then separately chosen human-certified landmarks and pixel-center parity | **SOURCE REVIEW PASS, REGISTRATION NOT APPROVED** |
| G2 Physical terrain topology | Stable island/component ledger with holes and coast confidence | Two distinct land/water classifiers; 4-/8-neighbor/erosion checks; tiny island and tidal neck audit; source overlay; no color-only islands | **NEXT** |
| G3 Geographic parents | Nine top-level geographic membership polygons | Whole-island component review, accepted source IDs, ambiguous shoreline and undersea exclusions | **HELD** |
| G4 Voronoi and child regions | Source-linked cell→province→district→Lineage polygon hierarchy | Exactly matched simulator save or independently certified geometry; reciprocal seams; variable sizes, explicit named borders where needed | **HELD** |
| G5 Biomes and locality layers | Watersheds, relief, land-use, settlement and spawn-area candidate geometries | Ecological provenance, river directions, elevations ordinal unless calibrated, no retroactive settlement changes | **HELD** |
| G6 Route and sovereign overlays | Separately approved crossing graph and political layers | Validated passes and shipping classes, seasonal closures, local hazards, authority treaties | **HELD** |
| G7 Runtime integration | Versioned published geometry + compatibility migration | Schema/lint, tests, save replay and rollback, owner approval | **HELD** |

## 5. G1 implementation performed in this review

A read-only audit compares **18 fixed geographic windows** chosen from the owner-supplied State preview against original and Option 2 Biome and Height previews, using a rendered-water test `R=64,B=255` (green unconstrained), 3 × 3 coast edge extraction and symmetric distance-to-shore statistics.

**Measured:** 18/18 windows informative in both image pairs. On all 18 windows, both old→new and new→old coast-edge directions have at least **99.3096%** of edge samples within **2 preview pixels**; the 95th-percentile edge distance never exceeds **0.955 preview pixels**. Counts are based on rendered visual coasts; preview interpolation, outlines and rivers still matter.

A corresponding source-based atlas numbers the 18 windows and shows the actual nine macro colors; it is **not a new map drawing**. The audit does not use SIFT match coordinates, but was performed after the existing candidate registration work and is not independently preregistered original-source landmark correspondence.

**Acceptance interpretation:** `PREVIEW_COAST_REVIEW_PASS`, `SOURCE_MATCHED_VORONOI_MESH_FALSE`, `REGISTERED_AUTHORITATIVE_TRANSFORM_FALSE`, `CANONICAL_WRITABLE_FALSE`. No coordinate remapping or region rewrite is authorized.

## 6. G2: exact next technical work

**Input:** archived five source PNGs, verified image-preview ZIP, G1 audit JSON and proposed frame mapping. **Output:** an owner-reviewable one-row-per-physical-candidate component ledger and review overlays.

Required work units:

- **G2-A Coast semantics:** independently compare (i) existing exact rendered ocean RGB heuristic; (ii) a second coastline classifier grounded in Biome/Height palette and shoreline gradient, with river/ink sensitivity. Prove which pixels are ambiguous instead of forcing a single true water mask.
- **G2-B Component identity:** compute separate 4-/8-neighbor connected components, border-contact sets, bounding boxes, whole islands and pixel areas for both classifiers at **native 16K**, not just the 2048 preview. Export masked ROI references and provisional source IDs; avoid claiming the existing 169/161 counts are unique islands.
- **G2-C Owner review queue:** prioritize the Dawnreach white U-arc, red Myridian intercontinental and detached jellyfish island, Kaelvar NE island and Shattercap holds, Serpent's Wake teal chain, southern volcanic-island / radial-river candidate, and every mixed-parent component. Preserve unknown and disputed islands rather than inventing owners.
- **G2-D Draemor–Talmyra neck:** measure rendered connectedness at 4/8 neighbors and after 1-/2-/3-pixel erosion on each original layer; record source coordinates, local coast/color uncertainty, minimum bottleneck in pixels (only if robust). Keep small-craft natural arches, wet-season closure, predator-breeding restrictions and joint management as design intent until a local-scale study supports a route graph.
- **G2-E Geography QA:** boundary-polygons must have consistent winding and holes, non-self-intersection, reciprocal adjacency, no unexplained micro-gap/overlap. Parent region crossings or disconnected features are escalated for owner decision. Do not infer child Lineage regions from province or district colors.

**G2 can finish as `COMPONENT_INVENTORY_REVIEW_READY` or `COMPONENT_AMBIGUITY_HELD`**, but never as silent canonical ownership. A clean source-grounded exception ledger is a successful result.

## 7. Controls

Preserve existing originals, archived LFS bytes, C1 active source branch, simulator saves, game saves, settlement anchors, region/economy/ecology JSON and travel graph. Use a fresh evidence-only PR, with exact changed-path readback, local native commands and CI review before integrating into master. No assets from unrelated fantasy maps; all planning visuals must derive from the owner's First World source.

**Next prompt:** [G2 implementation handoff](../dev/first-world-option2-g2-physical-components-implementation-prompt-2026-11-16.md).
