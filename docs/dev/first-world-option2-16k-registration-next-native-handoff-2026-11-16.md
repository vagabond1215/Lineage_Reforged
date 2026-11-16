# Codex handoff: First World Option 2 16K native source-registration pass

Date: 2026-11-16  
Lane: **READ-ONLY native evidence; no canonical writes, map redistribution or runtime changes**  
Source review: [16K connectivity report](../design/first-world-option2-16k-rendered-connectivity-review-2026-11-16.md) and [JSON witness](../design/first-world-option2-16k-rendered-connectivity-evidence-2026-11-16.json).

## User-approved objective

Use the **original three 16,384×9,421 Fantasy Map Simulator exports now archived in Git LFS on master** and the existing original First World rasters to establish a *verified coordinate transform* and an *owner-reviewable physical-island/component inventory*. Prefer actual source/province/Voronoi data if readably available, but never claim a recovered mesh without schema and source verification. The world map is Voronoi-derived, while simulator provinces, districts, nine geographic parents and political states are distinct layers.

### Critical latest facts

- `master` contains the original 16K State/Height/Biome PNGs under `packages/content/base/world/map_assets/first_world_simulator_option2_2026_11_15/`, with directory-scoped Git LFS and existing hashes.
- The C1-P native workflow **passed** on merged C1-AE guard `ca804820297fd2f4d86a67e213eecb408a02f774`; this repair is **in the active C1 source branch, not master**.
- Source evidence proves a *rendered-pixel* continuous Draemor/Talmyra component on all three 16K layers. It does **not** prove exact tidal arches or a gameplay route.
- Source-export correspondence to the opaque simulator save, source registration and every real Voronoi cell remain **HELD**.

## 1. Non-mutating inventory

Before action, inspect `git status --porcelain=v1`, `git branch --show-current`, `git worktree list --porcelain`, the exact current `master` and C1 heads, and active PRs. Codex may find the primary checkout currently follows the previous source-intake branch; do not reset or forcibly switch it. Reuse an existing clean, appropriate checkout. If no such checkout is safe, make **one disposable isolated worktree**, prove the parent head and remove it cleanly after saving reports; do not create another persistent C1 checkout.

Confirm Git LFS hydration in the selected source checkout. If Git has only pointers, run the narrowly scoped `git lfs pull` there. Do not change LFS tracking, source image contents, or legacy originals.

Validate **exact bytes**:

| Source | SHA-256 |
| --- | --- |
| 16K State | `419f48be8991dd682fe5bbce601408ed1832b73e679b104a0c7f082abd6295de` |
| 16K Height | `776bb1dd3d708265741b6433b3152adb098696f60d8bf4ce85205c649bb6d8ce` |
| 16K Biome | `c6904f0f23c2a7cf7fd880b38a4a9a8fa51f5bb6260605ff53ccd8a20b324fe2` |
| Original First World Biome | `9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12` |
| Original First World Elevation | `02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d` |

Record actual dimensions from **PNG IHDR**, rather than deriving them from filenames or `world_maps.json`. Earlier documentation describes 4096×2355 original framed rasters cropped to a 2048×1152 reference. These are not the same coordinate space. Stop if unexpectedly different bytes/dimensions are found; do not "correct" image hashes to fit.

## 2. Registration: measured, reviewable, reversible

- Treat the proposed 16K inner rectangle `[240,240,16144,9176)` as a **render frame** candidate, not a registered geometry map.
- Independently derive the old framed source raster's actual artwork rectangle and any old crop `(60,60,3976,2235)` metadata. Verify the crop tuple semantics against source code.
- Start with the non-authoritative frame-normalized hypothesis:
  `u=(x16−240)*2048/15904`, `v=(y16−240)*1152/8936`.
  It is only an initialization for landmark search.
- Use **non-waterlandmark** coast features and source-matched river or isolated island centers covering west, east, north and south, not one local Kaelvar fit. Prefer registration on original 4K raster images and transform **once** into the 2048×1152 authored frame. Record control-point coordinates, transformation matrix, inverse, held-out points, residuals and any outliers.
- Check whether a simple scale/offset, affine or more complex nonrigid warp is actually supported. Do not force a near-perfect single affine fit when source images are generated with different extents or cropping.
- Explicitly distinguish render anti-aliasing, old source feature ink, biome palettes and uncertain cartographic boundaries. Never infer pixel-perfect province boundaries from soft source pixels.
- Give a reproducible read-only command and machine report. A fit is **REVIEW-READY**, not `APPROVED`; no canonical `world_maps.json` or polygon change.

## 3. Physical/component review at original 16K scale

Repeat the existing report's strict read-only **rendered-water hypothesis** (RGB red =64, blue=255 in cropped image). Its acceptance witnesses are:

- State rendered-land total **36,095,836** pixels; water **106,022,308**.
- **169** 4-connected and **161** 8-connected rendered-land components (exclude background).
- Height and Biome match each other under this water-pattern rule; State differs at **exactly seven pixel locations**, recorded in the JSON.
- Both orange Draemor and brown Talmyra fall in the **same four-connected rendered-land component**, measured on *each* of all three exported layers. Pure State fill sampling points: `(7428,6552)` and `(9240,7436)`.
- Corresponding 4-connected component State label **110** (ephemeral); 6,745,062 pixels, bounding box `[5964,4948,10030,8666)`.

Then derive *at least one independent* coast/terrain semantic classifier, with sensitivity analysis. Do not publish "169 islands" as a conclusion without both image-level methods and a physical-island inventory with uncertainty. Preserve every detached component's geometry/area/parent candidate and review status in a local generated report. Focus the owner-review queue on: Dawnreach Option 2 white polar arc vs red Myridian, the detached Myridian jellyfish island, northern Kaelvar large NE island and Shattercap holds, the Serpent's Wake teal chain, Draemor–Talmyra touching boundary and any disputed coast pixels. Cross-layer check on Height and Biome should be independent where feasible.

**Ownership hold:** nine State colors identify geographic parents, not nine political sovereignties. The independently sovereign neighboring merfolk city is not a Myridian underwater claim. No proposed child-region seam is automatically approved.

## 4. Separate local isthmus report

Produce a 16K source ROI around the Draemor–Talmyra narrow seam showing aligned State, Height and Biome pixels with native coordinates and measured minimum passage/gap width **only where the render permits it**. Explain whether the land bridge is connected under 4-neighbor, 8-neighbor, erosion/smoothing variants and across all layers. Identify river/shoreline pixels that could create a false-positive link. The natural tidal stone arches remain authored lore, not proved by a raster.

## 5. Simulator save relationship

Inventory the current local loaded save non-destructively with exact path, timestamp, size and SHA-256; don't upload full saves to Git and don't overwrite older March-named saves. The older historical March save hash is not sufficient evidence for the current Option 2 state. A match to a 16K raster export needs actual state identity/data corroboration, not the filename or UI time alone. Decoding Voronoi mesh remains a separate held task.

## 6. Reporting and integration

Create a compact new **draft evidence-only PR** from current `master` if needed, but do not directly merge new source-registration outputs into the active C1 branch or `master` without owner review. Reuse the existing documentation PR if this is a clearly compatible follow-up; otherwise keep separate. Include:
1. Original file hashes, actual dimensions and verified image pairings.
2. Candidate transform and robust held-out residuals, and counterexamples if registration does not fit.
3. Physical component ledger and the nine-parent assignment sensitivity/confidence.
4. Before/after source-aligned visual comparison with river and coastline reference marks.
5. Clearly named `APPROVED`, `HELD`, `REJECTED`, `SOURCE_ONLY` status distinctions.
6. Native command evidence and branch/worktree disposition.

Do **not** edit `regions.json`, `world_map_features.json`, `regional_ecology_profiles.json`, settlements, travel, runtime, `.save`, original PNGs, active C1 source candidates or deployment. No broad PR merge/branch deletion/worktree cleanup during this registration pass.

## Completion expectation

Return exact commits, changed paths, hashes, source geometries, overlay/transform confidence and unresolved held points. A well-evidenced `SOURCE_ALIGNMENT_HELD` outcome is better than manufacturing an authoritative affine transform or fabricated physical island counts.
