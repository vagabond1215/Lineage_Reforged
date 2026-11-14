# First World cartographic review workbench (Vite, review-only)

Date: 2026-11-12
Status: **CONNECTOR-PREPARED / LOCAL EXECUTION AND RASTER WITNESS REQUIRED**
Base: master `343d14ce79b17b5ad9badc06c65f986ebfd7ecf2`.
Parent evidence: [First World geographic reconciliation](https://github.com/vagabond1215/Lineage_Reforged/blob/connector/first-world-settlement-distribution-policy-pilots-2026-11-12/docs/design/first-world-map-geography-interconnectivity-and-viewer-reconciliation-2026-11-12.md), presently in [draft PR #76](https://github.com/vagabond1215/Lineage_Reforged/pull/76).
No content source, world simulation, Save, runtime, world_map image, active L2 contract or game version is edited.

## Why a local Vite page

The repository did not contain a dedicated standalone geographic viewer; the game World panel is a placeholder, and the source maps are existing multi-megabyte PNG assets. This viewer is deliberately separate from the RPG World panel. It needs local module imports of the canonical source JSON plus the actual supplied biome and elevation PNGs. A raw `file://` HTML launch does not support those imports and is not an acceptable witness.

Files:
- `apps/rpg-ui/world-map-review.html`: viewer shell
- `apps/rpg-ui/world-map-review.js`: dynamically fetched source JSON, geographic layer drawing and draft-only editing
- `apps/rpg-ui/world-map-review-boundaries.mjs`: read-only region/macro hierarchy, artifact classification, sanitized draft geometry
- `apps/rpg-ui/world-map-review.css`: layout
- `apps/rpg-ui/vite.world-map-review.config.mjs`: isolated server and build config, Vite root scoped to RPG UI and repository-wide source reads

## Run without changing the active checkout (PowerShell)

From a repo checkout, use an adjacent worktree so the current gameplay or L2 working tree is unaffected:

```powershell
Set-Location 'C:\Codex\EoL'
git fetch origin connector/first-world-map-review-vite-2026-11-12
git worktree add --detach '..\EoL-map-review' 'origin/connector/first-world-map-review-vite-2026-11-12'
Set-Location '..\EoL-map-review\apps\rpg-ui'
npm ci
npx vite --config vite.world-map-review.config.mjs --host 127.0.0.1 --port 5174
```

Open **http://127.0.0.1:5174/world-map-review.html**.

### Update an existing review worktree

Stop the current Vite process with Ctrl+C, then:

```powershell
Set-Location 'C:\Codex\EoL'
git fetch origin connector/first-world-map-review-vite-2026-11-12
git -C '..\EoL-map-review' switch --detach 'origin/connector/first-world-map-review-vite-2026-11-12'
Set-Location '..\EoL-map-review\apps\rpg-ui'
npx vite --config vite.world-map-review.config.mjs --host 127.0.0.1 --port 5174
```

Do not force the worktree checkout if it has uncommitted local edits. Export map review JSON first, and reconcile any manual source changes before updating.

## Map contract

- The original `First World Biome.png` or `First World Elevation.png` is registered to the exact 2048×1152 canonical frame. Native-size 2048×1152 assets are presented uncropped. Only when an asset is demonstrably larger and contains the stored `assetReferenceRectPx` source-art rectangle does the reviewer apply that rectangle as a **provisional, explicitly labeled** source-to-reference display transform; its coastline alignment remains a visual acceptance hold. No double crop, 16:10 stretch or CSS pixel-as-percent conversion is applied. Pan/zoom acts on the resulting full-frame art.
- Cursor status displays original reference pixels and normalized percentages. Mouse wheel zooms around the pointer; drag blank map to pan; F to fit; +/- to zoom. Image dimensions are checked in-browser; native normalized assets and candidates using the historical source rectangle are visibly distinguished. Any other dimension mismatch is a **hold**, not silently corrected.
- 88 settlement identities are plotted from `visualMapRef.pixelX/pixelY`; marker colors distinguish local draft overrides, and source coordinates always remain inspectable.
- 20 named routes (12 route records, 8 interport ship routes) are initially **dashed straight endpoint chords**, never claimed as authored actual geometry, shoreline-safe navigation or active travel. Select one, enable checkpoint insertion, click the map to add and drag a waypoint. Local route geometry can be reset.
- Optional 155 embedded domestic trade relationships are shown as economic relationship lines, not travel routes.
- Optional 49 hex edges are shown between **inferred settlement-anchor centroids**, not physical path centerlines.
- **Continent / island-system layer:** Five continent identities are drawn as the original polygons of their child subregions, while four island systems use their directly owned footprint parts. This is a display grouping of the **159 retained footprint parts**, not a computed solid union or geographical bounding box. Each macro-layer part is editable in an independent draft.
- **Subregion layer:** The 28 authored subregions are separately selectable; 16 continental subregions have direct footprint parts, while the 12 island-system subregions currently lack independent polygons. Review-only polygons can be manually drawn for these unbounded identities. The four oceans have no source ocean polygons and are intentionally not drawn as territories.
- **Accepted offshore-square cleanup (2026-11-12):** User visually confirmed every one of the **42 exact 8×8 source footprint parts** was outside the landmass; all 42 are excluded from the **effective viewer footprint set**, reducing **201 raw to 159 displayed**. GitHub's connected editor could not push the 9.3 MB canonical source change, so the physical JSON deletion remains a **local execution gate** using the checked-in deterministic cleanup command. Both continent and subregion overlays exclude them now. The review queue now reports **0 residual squares** and remains available to catch regressions. No other small islands were removed. Accepted removed IDs and the originating blob are listed in `docs/design/first-world-offshore-square-artifact-removal-2026-11-12.json`.
- **Boundary editing:** Select Continent or Region, select an owner and individual part, enable Edit, and zoom in. In vertex mode drag handles, Shift-click the selected edge to insert a vertex, or Alt-click a handle to remove one (minimum three vertices). Translate mode drags the whole selected polygon. Draw mode collects map clicks into a new manual polygon, finished from the sidebar. Exclude/Restore hides a part from the *effective draft* while leaving a faint review ghost; Reset discards the selected part's draft changes. The two layers are intentionally independent to avoid an accidental propagation or new land claim.
- **Optional independent landmask:** Load a local prepared 2048×1152 PNG/WebP with the sidebar's file picker. It appears over the atlas with adjustable opacity; other sizes are rejected rather than stretched or implicitly cropped. The imported image is kept in browser memory and is neither uploaded nor saved in the review JSON. This is a visual comparison input, never an input to settlement validation or canonical geography generation.
- The effective viewer geometry has 159 retained region footprint parts (the large raw source still needs the deletion command), 68 separate coastline polygon parts, 8 rivers, 5 mountain line features, 4 pass markers and 6 crossing markers. The source coastline layer can be shown **unaltered** to compare against edited boundaries. Region label points and 47 locality display positions are derived from member settlement centroids when available; they are never promoted to source coordinates.
- Planned semantic features without a reference visual geometry remain in an **unplaced list**. A label or descriptive place relation cannot conjure a point or coastline.
- Local marker repositioning, route checkpoints, continent/region draft shapes, individual part exclusions and notes persist in browser `localStorage`. Export/import schema v2 JSON to share them, with backward-compatible v1 review imports. The optional local landmask image itself is not persisted or exported. There is no write path to canonical image masks, region feature data, runtime state or Saves.

## Required local witness before map/route acceptance

1. Inspect the browser developer console and confirm that the nine canonical JSON sources, the accepted-removal manifest, and both original image layers load without parse, CORS or asset errors. Confirm actual natural image width and height match 2048×1152, or stop at a raster-transform gate.
2. Check source anchor pixels: Aurelis (300,395), Starfall Port (825,245), Seabanner (345,825), Highcrown (1560,255). After zooming and resizing, hover cursor coordinates must match the marker under the pointer within one image pixel.
3. Confirm 88 settlements, 20 named routes, 47 source-locality records, **159 retained region footprint parts**, 5 continent + 4 island macro owners and 28 subregion identities (12 without direct polygons). The residual 8×8 square candidate counter must be **zero** and the removal manifest must list exactly 42 original IDs. No label derived from an inferred centroid may be mistaken for a declared geographic marker.
4. Enable the continent outline on its own, then enable the region outline. Verify source coastlines remain aligned when toggled and that continent preview edits do not rewrite the region preview or source coastline.
5. Confirm none of the 42 accepted IDs appears in either effective boundary view; after the local cleanup command, also confirm none remains in the raw source; the coastline should remain visually unchanged. Drag a retained polygon vertex in region mode, Shift-click an edge to add one, then reset. Repeat in macro scope and prove the edits are isolated.
6. Draw a three-or-more-vertex *proposed* island-subregion polygon under Starfall Isle, then export, import and reset; verify no independent source polygon was inferred automatically. Load a 2048×1152 independent landmask and adjust opacity; test rejection of a mismatched-size file.
7. On **both original layers**, compare the coastlines and route chords at Seabanner/Tidecrown, Aurora/Icehook, Aurelis/Brineharbor/Redcliff, Starfall/Harbormast/Foammarket/Pearlwake/Chainlight. Starfall-to-Blueflow sea access and three Myridian `road` hex links must remain held until verified.
8. Add a waypoint to a selected sea lane, drag it, reposition a settlement with the move toggle, record a note, export JSON, reload, and import. Confirm endpoints track only local draft marker moves and the repository's canonical contents remain byte-identical.
9. Run `node --test tests/unit/first-world-map-review-witness.test.mjs tests/unit/first-world-map-boundary-review.test.mjs`, then `npm --prefix apps/rpg-ui run typecheck` and `npm --prefix apps/rpg-ui exec -- vite build --config vite.world-map-review.config.mjs` from repository root (or run the corresponding commands from `apps/rpg-ui`). A successful build is a separate witness from true georegistration and route validity.
10. Resolve conflicts through explicit source-owner decisions. Do not copy draft waypoint or relocation JSON into `settlements.json` or `travel_networks.json` automatically.

**Held:** Native/local proof of the user-accepted square cleanup and any remaining offshore settlement anchors, actual raster/browser session, independent landmask acceptance, route clearance, image legend/sea level, physical travel modes and approval for any relocation. Connector-authored files have not been locally executed or browser-validated at creation time.

## Accepted source removal and regeneration prevention (2026-11-12)

The owner's direct manual review accepts all 42 exact 8×8 squares as offshore artifacts. The effective map overlays now omit all 42 IDs via the accepted manifest. The canonical 9.3 MB `world_map_features.json` **still requires physical removal from a local checkout**. `scripts/regenerate_world_map_features.ps1` no longer stamps settlement-centered buffers into region masks or biome-zone masks, preventing the known artificial-land source path from reappearing. The accepted-ID manifest provides provenance for the exact deletion set. The coastline extraction remains untouched. Existing offshore settlement anchors and legal travel access remain separate unresolved placement issues; don't reinterpret a cleaned landmask as approving them.

After pulling the branch, rerun both focused Node tests and visually compare source coastlines and the base image. If a broader settlement-to-region audit surfaces new misses, report them instead of manufacturing land under the offending marker. No runtime/Save migration or map-scale change is approved here.


## Canonical source cleanup gate (required before accepting the patch)

Run from the review worktree root, not from the protected gameplay checkout:

```powershell
node scripts/remove-verified-offshore-footprints.mjs --write --json
node scripts/remove-verified-offshore-footprints.mjs --check --json
node scripts/audit-first-world-continent-region-footprints.mjs --json
node --test tests/unit/first-world-map-review-witness.test.mjs tests/unit/first-world-map-boundary-review.test.mjs
git diff --check
git diff --stat
```

The first command performs **exact 42-ID targeted, formatting-preserving JSON removal** with geometry/landmask preconditions; the second fails until the removal is done. This data-file step has not yet been executed/pushed from this connector. Commit and push it only after local validation. Existing coastline shapes, biome/climate layers, settlements, routes, Save and original images must remain unchanged.

The continent/region audit is read-only; it evaluates effective 159-part geometry whether the physical source cleanup has run or not. Mixed-ownership coastline components and overlapping macro boundaries are **review candidates**, not authority to redraw the world automatically.
