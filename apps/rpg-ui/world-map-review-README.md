# First World cartographic review workbench (Vite, review-only)

Date: 2026-11-12
Status: **CONNECTOR-PREPARED / LOCAL EXECUTION AND RASTER WITNESS REQUIRED**
Base: master `343d14ce79b17b5ad9badc06c65f986ebfd7ecf2`.
Parent evidence: [First World geographic reconciliation](../../docs/design/first-world-map-geography-interconnectivity-and-viewer-reconciliation-2026-11-12.md), presently in [draft PR #76](https://github.com/vagabond1215/Lineage_Reforged/pull/76).
No content source, world simulation, Save, runtime, world_map image, active L2 contract or game version is edited.

## Why a local Vite page

The repository did not contain a dedicated standalone geographic viewer; the game World panel is a placeholder, and the source maps are existing multi-megabyte PNG assets. This viewer is deliberately separate from the RPG World panel. It needs local module imports of the canonical source JSON plus the actual supplied biome and elevation PNGs. A raw `file://` HTML launch does not support those imports and is not an acceptable witness.

Files:
- `apps/rpg-ui/world-map-review.html`: viewer shell
- `apps/rpg-ui/world-map-review.js`: dynamically fetched source JSON, geographic layer drawing and draft-only editing
- `apps/rpg-ui/world-map-review.css`: layout
- `apps/rpg-ui/vite.world-map-review.config.mjs`: isolated server and build config, Vite root scoped to RPG UI and repository-wide source reads

## Run without changing the active checkout (PowerShell)

From a repo checkout, use an adjacent worktree so the current gameplay or L2 working tree is unaffected:

```powershell
Set-Location 'C:\Codex\EoL'
git fetch origin connector/first-world-map-review-vite-2026-11-12
git worktree add '..\EoL-map-review' 'origin/connector/first-world-map-review-vite-2026-11-12'
Set-Location '..\EoL-map-review\apps\rpg-ui'
npm ci
npx vite --config vite.world-map-review.config.mjs --host 127.0.0.1 --port 5174
```

Open **http://127.0.0.1:5174/world-map-review.html**. For an existing review worktree, skip `git worktree add` and update its branch carefully.

## Map contract

- The original `First World Biome.png` or `First World Elevation.png` is registered to the exact 2048×1152 canonical frame. Native-size 2048×1152 assets are presented uncropped. Only when an asset is demonstrably larger and contains the stored `assetReferenceRectPx` source-art rectangle does the reviewer apply that rectangle as a **provisional, explicitly labeled** source-to-reference display transform; its coastline alignment remains a visual acceptance hold. No double crop, 16:10 stretch or CSS pixel-as-percent conversion is applied. Pan/zoom acts on the resulting full-frame art.
- Cursor status displays original reference pixels and normalized percentages. Mouse wheel zooms around the pointer; drag blank map to pan; F to fit; +/- to zoom. Image dimensions are checked in-browser; native normalized assets and candidates using the historical source rectangle are visibly distinguished. Any other dimension mismatch is a **hold**, not silently corrected.
- 88 settlement identities are plotted from `visualMapRef.pixelX/pixelY`; marker colors distinguish local draft overrides, and source coordinates always remain inspectable.
- 20 named routes (12 route records, 8 interport ship routes) are initially **dashed straight endpoint chords**, never claimed as authored actual geometry, shoreline-safe navigation or active travel. Select one, enable checkpoint insertion, click the map to add and drag a waypoint. Local route geometry can be reset.
- Optional 155 embedded domestic trade relationships are shown as economic relationship lines, not travel routes.
- Optional 49 hex edges are shown between **inferred settlement-anchor centroids**, not physical path centerlines.
- The visual feature aggregate supplies the 201 approximate region polygon parts, 8 rivers, 5 mountain line features, 4 pass markers and 6 crossing markers. Region label points and 47 locality display positions are derived from member settlement centroids when available; they are never promoted to source coordinates.
- Planned semantic features without a reference visual geometry remain in an **unplaced list**. A label or descriptive place relation cannot conjure a point or coastline.
- Local marker repositioning, route checkpoints, notes and classifications persist in browser `localStorage`. Export/import a JSON review file to share them. Import only restores preview edits. There is no write path to canonical JSON, runtime state or Saves.

## Required local witness before map/route acceptance

1. Inspect the browser developer console and confirm that nine canonical JSON files and both original image layers load without parse, CORS or asset errors. Confirm actual natural image width and height match 2048×1152, or stop at a raster-transform gate.
2. Check source anchor pixels: Aurelis (300,395), Starfall Port (825,245), Seabanner (345,825), Highcrown (1560,255). After zooming and resizing, hover cursor coordinates must match the marker under the pointer within one image pixel.
3. Confirm 88 settlements, 20 named routes, 47 source-locality records, 201 region footprint parts and correct separate route classes. No label derived from an inferred centroid may be mistaken for a declared geographic marker.
4. On **both original layers**, compare the coastlines and route chords at Seabanner/Tidecrown, Aurora/Icehook, Aurelis/Brineharbor/Redcliff, Starfall/Harbormast/Foammarket/Pearlwake/Chainlight. Starfall-to-Blueflow sea access and three Myridian `road` hex links must remain held until verified.
5. Add a waypoint to a selected sea lane, drag it, reposition a settlement with the move toggle, record a note, export JSON, reload, and import. Confirm endpoints track only local draft marker moves and the repository's canonical contents remain byte-identical.
6. Run `node --test tests/unit/first-world-map-review-witness.test.mjs`, then `npm --prefix apps/rpg-ui run typecheck` and `npm --prefix apps/rpg-ui exec -- vite build --config vite.world-map-review.config.mjs` from repository root (or run the corresponding commands from `apps/rpg-ui`). A successful build is a separate witness from true georegistration and route validity.
7. Resolve conflicts through explicit source-owner decisions. Do not copy draft waypoint or relocation JSON into `settlements.json` or `travel_networks.json` automatically.

**Held:** Actual raster/browser session, route clearance, image legend/sea level, coastline truth, physical travel modes and approval for any relocation. Connector-authored files have not been locally executed or browser-validated at creation time.
