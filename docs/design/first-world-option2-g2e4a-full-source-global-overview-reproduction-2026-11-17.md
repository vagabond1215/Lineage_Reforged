# First World Option 2 G2-E4a: original-16K complete overview preview reproducibility receipt

Date: 2026-11-17  
Status: **COMPLETE_WORLD_OVERVIEW_SOURCE_RENDER_VERIFIED / DISPLAY_CANDIDATE_READY / AUTHORITATIVE_GEOMETRY_HELD**  
Completed source-only [PR #101](https://github.com/vagabond1215/Lineage_Reforged/pull/101): head `4cb1a2318310dc19c88d365974f5d09feb51e70a`, squash-merged into `master` as `1e38eb83a3de56853ac0157d18ddd518f9f4be49`. Base `969ebb1679a17af8417c093a63f4dfebb9f6bb0f`. Changed source paths: [read-only global preview script](../../scripts/first-world-option2-g2e4a-full-atlas.py) and [bounded original-source workflow](../../.github/workflows/first-world-option2-g2e4a-full-atlas.yml), **no other files**.

## Evidence and reproducibility

- [Exact PR-head original-LFS source CI #44026768124](https://github.com/vagabond1215/Lineage_Reforged/actions/runs/44026768124): **success**; original State, Height and Biome 16384×9421 byte hashes checked, synthetic generator tests, full-crop overview, three PNGs, JSON report and negative canonical-claims gate passed.
- [Exact PR-head coordinate-first guard #44026768140](https://github.com/vagabond1215/Lineage_Reforged/actions/runs/44026768140): **success**.
- [Post-merge master original-LFS source CI #44027133627](https://github.com/vagabond1215/Lineage_Reforged/actions/runs/44027133627): **success**; downloaded artifact ID `14303726561`. **Every generated PNG and the JSON report is byte-for-byte identical** to the PR-head artifact ID `14303516296`, verified by ZIP CRC, per-member hashes and independent image decode.
- [Post-merge coordinate-first guard #44027133625](https://github.com/vagabond1215/Lineage_Reforged/actions/runs/44027133625): **success**.

The generator used the archive's immutable original 16K SHA-256s:

| Layer | Original SHA-256 |
| --- | --- |
| State | `419f48be8991dd682fe5bbce601408ed1832b73e679b104a0c7f082abd6295de` |
| Height | `776bb1dd3d708265741b6433b3152adb098696f60d8bf4ce85205c649bb6d8ce` |
| Biome | `c6904f0f23c2a7cf7fd880b38a4a9a8fa51f5bb6260605ff53ccd8a20b324fe2` |

The source-display framing `[240,240,16144,9176)` and output `2048×1152` are **provisional candidate registration**, not an approved geodetic or authored reference transform. Both visual water masks derive from the same simulator's rendered image family, so their agreement does **not** certify native semantic terrain.

### Original-image findings, with their correct scope

- On the **cropped original full-16K source frame**, A-only rendered land versus B = **44,716** pixels; B-only rendered land = **0**. This is **not** the entire uncropped 16384×9421 canvas, and must not be added to historical overlapping ROI sums as a new global island count.
- At the **2048×1152 display resolution**, B produces **146 eight-neighbor land-component instances**, including **239 display enclosed-hole instances**. These differ in meaning and resolution from historical source-native 169/161 versus 171/163 component measurements. No display components are permanent physical-island IDs.
- A contour simplification attempt was **correctly rejected** by the major-component display topology guard (`FALLBACK_MAJOR_COMPONENT_COUNT`), leaving **zero land/water mask pixels changed**. The clean atlas instead uses a **display-only vector coastline stroke** with epsilon 1.0 display pixel, reducing **16,597 → 5,992 contour vertices** (**63.9% reduction**), clipped to the existing land mask.
- Nine accepted G2-E3 owner directions remain present. This pass does not generate whole-island source vectors, certified polygon holes, reciprocal parent seams, semantic state/political boundaries or simulator Voronoi polygons.

### Exact generated preview files

| CI artifact member | SHA-256 | Intended review |
| --- | --- | --- |
| `shore_detail.png` | `4891c3bd9a41eafc89d175412ebbe9e7a340ff2fb26fe7ac62e5e7a3702f3d40` | Original source-derived geography colors, detailed display shoreline stroke |
| `atlas_clarity.png` | `1059c63b33fa792dbf7283969192ecef6d0698a868a7a4c3612430149476d42b` | Cleaner rendering and simplified visual shoreline stroke, same land mask |
| `review_windows.png` | `e3f057cad819560b3189a1e26d8bad7e2e0e7cf908b076c6bc27b75a9a1d7912` | Nine rectangular source-review locators, **not** boundaries |
| `full_world_atlas_preview_report.json` | `b57953fba9b9b488a716d611543b01b988ec7eb6f9dc14fd85243368221a9067` | Exact source witness hashes, display topology, holds and image-frame report |

The downloaded CI original-source ZIP (PR head) SHA-256 is `2262749f879a65afb602111b0bf0440546d5a8ee758d79999cecbd20c021575a`; user-facing offline viewer and review ZIP were generated **outside Git**, with review ZIP SHA-256 `9ceaac2886cb846987f6feb6d20bf9d3ca26874d8cb4fa82e9c5a4ee13d062df`. The offline files are owner-side evidence, not a stable repository binary or raw PNG reproduction. GitHub Actions artifacts have finite retention.

## Owner scale/identity boundary

The **First World global map is representative**, intended for coherent macro geography, not fine zoom, coastal collision, tide timing or harvest. Definitive local `map squares` are later independently authored places with their own scale/frame, terrain, water, crossing and collision authority; not new canonical equal-area regional grids.

- **Valtherion V1:** separate tidal island at ordinary tides, very-low-tide *foot only* crossing design, no carts/wagons/caravans. Tide windows, material, safety, resource habitats/rare pearls/coral/seafood and route activation remain separately held.
- **V2:** detached island design. **Dawnreach**, **Myridian north/center** (including approved geographic parent shading), **Kaelvar NE**, **Serpent's Wake north/south** and **Draemor–Talmyra natural tidal neck** retain the nine owner directives, but the display preview is not a certified physical-mesh overlay.
- The merfolk city remains independently sovereign; the nine geographic parent colors are not nine political state borders. The apparent Draemor–Talmyra contact cannot be used to infer exact passages or safe ship navigation.

## Integration, next gate and branch disposition

**ACCEPTED FOR G2-E4a REPRESENTATIVE WORLD DISPLAY REVIEW; NOT ACCEPTED AS CANONICAL WORLD GEOMETRY.** Only a standalone source generator and workflow landed on `master`; source originals, legacy reference and active First World content, runtime, saves, travel graph, economy, ecology, settlements and protected C1 branches/drafts were unchanged.

Next incremental work is **an explicit atlas art/label/UI acceptance or targeted owner correction**, not immediate subdivision into local tiles. Author new local area squares only when a real location needs detailed gameplay. A separate G2-E4/G3 publication gate will still require registered source transform, whole-feature/island identity, polygon closure/winding/holes, ambiguity and seam QA and accepted ownership where appropriate. The owner need not reconfirm all nine G2-E3 directions just to use this visual atlas.

Branch/PR disposition: PR #101 `MERGED_RETIRE`; remote topic branch `connector/first-world-g2e4a-full-source-overview-2026-11-17` still exists after merge, awaiting exact-ref safe deletion when a supported branch-delete operation is available. Do not create a second branch or PR to remove this one; do not alter active C1 or held drafts. No Windows worktree was created or inspected in this connector source-run; only CI test checkout provenance is claimed.
