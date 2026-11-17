# First World Option 2 G2-E4: representative world atlas and later local map-square boundary

Date: 2026-11-16  
Status: **OWNER-APPROVED WORLD-OVERVIEW LEVEL OF DETAIL / G2-E3 NINE SOURCE DIRECTIONS ACCEPTED / G2-E4 OVERVIEW CANDIDATE NOT GENERATED / CANONICAL GEOGRAPHY HELD**  
Scope: first-world cartographic **level of detail and next source-only execution slice**, not a new approved geometry, map transform, movement system, or local-area implementation.

Sources and existing authority:
- [Nine G2-E3 owner directions](first-world-option2-g2e3-owner-direction-record-2026-11-16.md) and [their machine-readable noncanonical ledger](first-world-option2-g2e3-owner-direction-record-2026-11-16.json).
- [First World nine-parent/geometry roadmap](first-world-option2-world-plan-and-geometry-roadmap-2026-11-16.md) and [image/history derived-geography gate](first-world-option2-g2e-image-history-derived-geography-gate-2026-11-16.md).
- [Coordinate-first geography and legacy-hex retirement contract](coordinate-first-world-geography-migration-contract-2026-11-13.md); [Starfall geography/local-area evidence boundary](starfall-geography-to-world-economy-owner-contract-2026-11-12.md).
- Exact original owner-provided Option 2 16384×9421 **State** `419f48be8991dd682fe5bbce601408ed1832b73e679b104a0c7f082abd6295de`, **Height** `776bb1dd3d708265741b6433b3152adb098696f60d8bf4ce85205c649bb6d8ce`, **Biome** `c6904f0f23c2a7cf7fd880b38a4a9a8fa51f5bb6260605ff53ccd8a20b324fe2` SHA-256 witnesses.

## 1. Owner scope clarification: one world overview, many possible local maps

The world map **may be representative**. It is an atlas for recognizing continents, island groups, general coastline shapes, major straits, terrain/ecology bands and geographic parent placement. It is **not** intended to be navigated at footstep, building, beach, tidepool or harbor-collision zoom. Later, separately authored **local map squares/areas** can present higher-resolution coastline, paths, features, resources and playable movement.

This clarification reduces the expected world-map **visual fidelity** burden; it does **not** permit an overview contour to falsify island membership, merge a detached island into a mainland, invent political sovereignty, imply a walkable crossing, or overwrite the original 16K images.

The current `world_map.first_world.reference` frame is 2048×1152, defined at approximately **9.765625 km per display-reference pixel**. It is an image-coordinate and approximate world-scale reference, **not** a metric collision grid, verified global geodetic projection or authoritative 16K→2048 registration. A single displayed pixel can conceal more local variation than the intended gameplay features require.

### Three products, three separate authorities

| Layer | Purpose | What can be decided at this level | What it must never silently authorize |
| --- | --- | --- | --- |
| **Overview display candidate** | Source-grounded, recognizable First World at world-map zoom | Approximate silhouettes, major detached islands, broad parent shading, prominent geological relationships, optional noninteractive uncertainty cues | Gameplay collision, time-to-travel, safe foot/vehicle/ship passage, resource spawn or polygon-based political assignment |
| **Reviewed source-registered macro geometry** | Later coordinate-first parent/island proposals with stable provenance and validated topological relationships | Whole-island membership, major shoreline/holes, named geographic-parent candidate and explicit held seams after the existing G2-E4/G3 approval gates | Recovered simulator Voronoi or per-meter shoreline precision; automatic settlement, ecology, sovereignty or route graph |
| **Local authored map square/area** | Later appropriately scaled explorable scene(s), potentially covering a harbor, shore, town, forest, island part or tidal connection | Local land/water obstacles, stairs, beaches, tide windows, entrances/exits, resource habitats and path affordances after dedicated owner/evidence reviews | Automatic ownership simply because a local square overlaps a world-map color, or automatic conversion of atlas pixels into walkable tiles |

A local *square* is an **authored scene footprint/render or implementation chunk**, not a new mandatory equal-sized geographic-political grid and **not** a new legacy-hex dependency. Use stable local area IDs, an independently specified scale and coordinate frame, and an approved map-to-local anchor/transform. Local squares may overlap or meet where intentionally authored; geometric rendering tiles must not mint new sovereign place IDs.

## 2. What the macro coastline must preserve, versus simplify

**Must preserve even when visualized small:** orientation and recognizable shape of each of the nine named geographic parents; broad placement of continental landmasses; distinct significant islands and archipelagos; major open-water separation; the main Draemor–Talmyra natural land connection; prominent shoreline bays, peninsulas and choke points that carry author-approved geography meaning; the held Kaelvar NE whole-island exception; Myridian's detached-center island and independent nearby merfolk undersea polity; and explicit ambiguity when a source-rendered bridge/ink is not verified land.

**May simplify at overview scale:** minor coastline noise, subpixel bays, small creek mouths, surf and shoreline decoration, detailed cliff/rock outlines, beaches, estuaries and tiny tidal features **if** the simplified result is identified as cartographic display and does not change important component identity or an accepted owner decision. Simplification is not a license to delete meaningful small islands or close narrow sea channels. In ambiguous cases preserve an exception/marker rather than infer topology.

**Not required to make an overview:** exact shoreline meters, full tiny Voronoi provinces/districts, harbor depths, measured tides, local climate/habitat truth, high-resolution traversable meshes, road/craft clearance, local encounter/resource placement, or a playable seamless global zoom. Those belong to scoped downstream work when needed.

Use native-source trace/provenance even when the output intentionally uses simpler **display geometry**. Record the simplification method and tolerance; choose tolerance by rendered visual/topology review at 2048 output scale, not by a fabricated pixel-to-meter accuracy claim. Preserve the unsimplified *candidate* separately from its display version where feasible so future local authors are not forced to reverse-engineer a smoothed screenshot.

## 3. Owner-specific overview treatment

| G2-E3 source issue | Approved world-scale treatment | Local or later held treatment |
| --- | --- | --- |
| **Valtherion V1** | Show as a **separate tidal island at ordinary overview waterline**. A conceptual low-tide foot connection may be described in an information note but must **not** draw a permanent dry-land bridge or enable a clickable route. | Exceptionally low-tide foot passage only; mud/sand or rocky exposure; **never carts, wagons or caravans**. Safe window, substrate, path, tide timing and any rare cold-water pearl/coral/shellfish/seafood placement all require local hydrology, habitat and gameplay checks. |
| **Valtherion V2** | Draw as distinct detached offshore island candidate, not connected to Valtherion mainland. | Exact contour, island ID and access remain held. |
| **Dawnreach U-arc** | Preserve recognizably separate white polar island system. Current derived coast is accepted as adequate overview direction. | Small-island splitting, Nacre Shelf and exact source contours may remain unresolved. |
| **Northern Myridian and detached central Myridian** | Keep the owner's accepted red **geographic-parent shading** and recognizable detached island(s). Do not merge red islands to adjacent Dawnreach. | Exact whole-feature polygons and separate merfolk sovereignty held. |
| **Kaelvar NE island** | Show as an intact detached island in the owner's accepted derived silhouette, with no forced Shattercap/Coast 40 solution. | Exact identity and disputed owner/region relationships remain held. |
| **Serpent's Wake north/south** | Preserve both island-chain silhouettes and their individual major islands to the extent visible at the selected zoom. | No inferred unified political rule, routes, dock locations or sea clearance. |
| **Draemor–Talmyra tidal neck** | Show the two southern land areas **naturally connected** by a narrow macro neck, consistent with accepted design intent. No need to resolve meter-scale arches in the world map. | Limited small-craft arches, weather closures, usable crossing edges, local relief, and any road/trail/craft graph remain separately gated. |

The **nine geographic parent colors describe geography**, not nine political kingdoms. The merfolk undersea city is independent of nearby Myridian surface shading. No other island, resource, or parent ownership is approved merely by this table.

## 4. G2-E4a: next bounded executable candidate pass

Deliver a **noncanonical macro-atlas candidate** before attempting detailed local scenes or canonical parent polygons:

1. **Freeze/reproduce source:** use original hydrated State/Height/Biome LFS PNGs, verify all three SHA-256s and native 16384×9421 dimensions, and identify the exact `master` source SHA. Do not edit originals, history/save blobs, archived exports or current game content.
2. **Re-use G2-E1/E2 source classifiers only as visual evidence:** retain A versus B uncertainty and existing nine G2-E3 decisions without threshold-fitting them to an approval narrative. Work at full 16K for source provenance and component inspection, then create a separate **presentation** at an intended overview zoom. Do not infer semantic land solely from blue State/Biome/Height pixels.
3. **Produce at least two presentation treatments from the same evidence:** (A) a lower-simplification recognizable shoreline and (B) a cleaner world-atlas shoreline. For each, record the actual polygon/path simplification tolerance, area/vertex changes and whether any detached components, holes, peninsulas, bridges or sea channels were affected. If they differ in major topology, mark as **exceptions for review**, not invisible cleanup.
4. **Preserve source-to-view identity:** capture full 16K bounds and the candidate 2048-frame transform, residual/uncertainty and pixel-center convention. If registration is not yet accepted, label every transformed coordinate **PREVIEW_ONLY_UNREGISTERED**, and keep the output distinct from canonical `geometryRef` records.
5. **Produce preview deliverables outside Git:** a full world-atlas State/Height/Biome source-context sheet, both simplified overview contour alternatives, a visible nine-item decision checklist, exceptions ledger for altered/uncertain straits and islands, and a compact JSON machine report with source hashes, method/tolerances, held choices and source SHA. Do not republish full original source PNGs. Large output belongs in task-owned external evidence or expiring CI artifacts, not binary files committed in the repo.
6. **Prove the meaningful overview gates:** no source mutation; no unreviewed landmass mergers/splits; source ROI-to-view identifiers stable; all 9 accepted directions represented; explicit exception treatment for V1, V2, Kaelvar NE, the Draemor–Talmyra neck, overlapping Dawnreach/Myridian windows and north/south Serpent's Wake; polygon closure, bounds, winding/holes and self-intersection checks for whichever new vector candidate is produced; no unjustified ocean/land fill; no new routes, resources, political authority, saves, runtime or legacy-hex consumers.
7. **Present one bounded review:** compare two source-grounded **overview** alternatives at the actual display scale. Ask the owner only about a material inconsistency with already accepted shape/landmass intent. Do not re-request the nine accepted G2-E3 choices simply because an atlas uses fewer coastline vertices.

**Success label:** `G2E4A_REPRESENTATIVE_OVERVIEW_CANDIDATE_READY_FOR_REVIEW`, **not** `CANONICAL_GEOGRAPHY_ACCEPTED`. An overview may be visually accepted while the exact 16K→reference transform, stable physical IDs, child-region seams, ecosystem and gameplay remains held. A published authoritative coordinate geometry layer still needs the separate registration/topology/owner gates already required by the coordinate-first and G2-E4 contracts.

### Efficient execution surface and branch discipline

- This policy/acceptance brief is **connector-safe documentation** and may be maintained directly on clean remote `master` under the owner-approved branch-minimization rule.
- G2-E4a's actual image processing, topology inspection, executable tests and binary-output proof require an **authenticated repository checkout, the original LFS images and local or runner execution**. No connector document write can claim those tests ran.
- Prefer one **single bounded run** using an already clean purpose-matched checkout or disposable detached worktree, and the existing appropriate development branch/lane if code isolation is required. Do **not** spin up a new branch/PR/worktree for each island, simplification setting, or atlas variant. If remote code integration needs a PR, keep it source-only and limited to this G2-E4a coherent work.
- Do not update the currently installed Starfall L2 Codex prompt, change C1 branches/drafts, merge C1 material or activate routes merely to create the macro atlas. Preserve any occupied Windows worktree.

## 5. Local map-square follow-up when a named place is ready

A future local area must be able to identify:
- a stable `localAreaId`, source `mapId` and geographic/settlement *candidate* association where approved;
- a versioned **local coordinate frame, tile/scene extent, origin, orientation and scale** appropriate to gameplay;
- an independently checked **world reference footprint and anchor transform** with positional uncertainty (do not fabricate exact georeferencing if the atlas transform remains provisional);
- authored collision, water, elevation, tide/weather and resources **only after their own owner and local evidence passes**;
- explicit and validated transitions to adjacent local areas or named sites, and separately authorized movement-mode/time-dependent route rules;
- save and region/locality provenance sufficient to preserve identity through future redraws and map upgrades.

Starfall's already prepared **28×18 local harbor template** is a worked example of a *separately authored area*, **not** something derivable from one 2048 world-map pixel. It must not be quietly scaled or published as validated local coast from the Option 2 overview.

### Outcome of this connector pass

**Accepted design scope:** representative world cartography now, separately detailed local map squares later. **Still pending:** actual G2-E4a contour extraction, two variants, topology QA, reviewed source registration and any authoritative geometry publication. No new island ID, polygon, body of water, ecology record, game route, local scene, canonical asset or gameplay/save mutation is authorized here.
