# G2-E: owner-authored derived cartography from available History and Image exports

Status: **NEXT IMPLEMENTATION PROMPT; OWNER-CONFIRMED_HISTORY_AND_IMAGE_ONLY; CANONICAL_HELD**  
Current source authority: [G2-E image/history decision](../design/first-world-option2-g2e-image-history-derived-geography-gate-2026-11-16.md), [G2-C native comparison](../design/first-world-option2-g2c-semantic-land-authority-and-island-review-plan-2026-11-16.md), [nine-parent world roadmap](../design/first-world-option2-world-plan-and-geometry-roadmap-2026-11-16.md).

## Copyable execution prompt: G2-E1 owner-review coast and component alternatives

> Continue First World Option 2 G2-E in `vagabond1215/Lineage_Reforged`, using current `origin/master` only in a safe isolated worktree. Preserve active C1, all original map assets, old simulator save files, Lineage canonical regions, routes and runtime.
>
> **Export reality:** the owner confirms that the installed Fantasy Map Simulator UI exports **History** and **Image** only. Do not ask for an official native terrain/cell/province polygon export. Do not decode unknown `NFW_SAVE_BIN` payloads or claim a recovered Voronoi mesh. Available images are sufficient for **owner-authored derived cartography**, but not native semantic topology. A History export, if provided, is optional narrative provenance, **not a geometry source**.
>
> **1. Verify source bytes.** Read the three original archived 16384×9421 PNGs from scoped Git LFS, confirm original SHA-256: State `419f48be8991dd682fe5bbce601408ed1832b73e679b104a0c7f082abd6295de`; Height `776bb1dd3d708265741b6433b3152adb098696f60d8bf4ce85205c649bb6d8ce`; Biome `c6904f0f23c2a7cf7fd880b38a4a9a8fa51f5bb6260605ff53ccd8a20b324fe2`. Preserve original 4096×2355 Biome/Elevation as well, with known crop `Rectangle(60,60,3976,2235)`. The 16K→2048×1152 numerical registration remains a candidate until independently selected shoreline landmarks and pixel-center rules validate it.
>
> **2. Produce two review-only coast candidates.** Implement a reproducible, read-only generator for A (State exact rendered ocean `R=64,B=255`) and B (Biome+Height broad blue-water chromatic consensus). Treat source coast ink and rivers as uncertain. Overlay both outlines on State, Height and Biome ROIs. Record where A/B disagree and where a disconnected component exists only under one. Log per-contour area, bbox, holes, source bytes and simplification scale. Store all generated outputs outside Git and mark `OWNER_AUTHORED_DERIVED_CANDIDATE`.
>
> **3. Prepare an owner-review queue.** The first two bounded issues are Valtherion V1 source bbox `[8164,1592,8223,1658)` and V2 `[8744,2391,8823,2452)`, which attach under A and detach under B. Do not infer an approved island. Next inspect Dawnreach U-arc, northern and detached central Myridian island, Kaelvar northeast/Shattercap, Serpent's Wake and Draemor–Talmyra tidal stone neck. Preserve disputed or sub-100-pixel candidates as `HELD`, not discarded noise. State colors indicate geographic parent groups, **never political sovereignty**. Nearby merfolk undersea city remains independent.
>
> **4. Record owner decisions, without preselecting them.** For every bounded ROI produce a source-native contact sheet, `separate_island | connected_land | held` options, evidence notes, potential narrow ink bridge and mask difference coordinates. Include source hash, immutable decision key, review status `PENDING_OWNER`, source pixel geometry and a field for future owner approval. The owner chooses physical identity; the tool may propose but cannot approve.
>
> **5. Validate topology and content safety.** Test exact hash gating, image registration provenance, ring closure and winding, polygon holes, self-intersections, edge reciprocal symmetry, duplicate IDs, one- and three-pixel erosion sensitivity and zero modifications of original images or canonical files. Confirm no world component is inferred from state-color islands alone. Do not create land/sea routes, small-craft arch clearances or political borders.
>
> **6. Deliver source-only PR.** Put reproducible generator, unit/CI, review ledger schema, README and sourced summary into an isolated PR against latest master. Keep generated heavy images and full provisional contours in a downloadable external evidence ZIP; do not republish the original large source PNGs. Run the exact-head source-native CI and existing coordinate-first guard. Accept `DERIVED_COAST_REVIEW_READY` or `AMBIGUITY_HELD`, not canon.
>
> Only in a **later separately owner-approved geometry PR** may the reviewed mask be promoted to `OWNER_AUTHORED_DERIVED` stable islands and child-region base polygons; do not claim it reconstructs the simulator's original Voronoi graph. Preserve legacy save and hex compatibility.

## Manual now without Codex

The previously published G2 and G2-C Python tools already run from the existing NumPy/OpenCV venv. They can produce source-only counts and contact evidence without requiring any unavailable simulator export. Prefer the original 16K images and the already validated G2-C owner-review ZIP, and keep files outside the repository.

G2-D's private save provenance command is **optional** to support history/asset linkage and should not block E1. History export text should only be used after explicit owner upload and a separate narrative/source provenance review. Never treat it as a polygon export.

**Gate:** `OWNER_CONFIRMED_IMAGE_HISTORY_EXPORT_ONLY`; `NATIVE_MESH_NOT_RECOVERED`; `DERIVED_GEOGRAPHY_REVIEW_PENDING`; `CANONICAL_WRITABLE_FALSE`.
