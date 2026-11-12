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
- **Continent / island-system layer:** Five continent identities are drawn as the original polygons of their child subregions, while four island systems use their directly owned footprint parts. This is a display grouping of disjoint polygons, **not** a computed solid union or geographical bounding box. Each macro-layer part is editable in an independent draft.
- **Subregion layer:** The 28 authored subregions are separately selectable; 16 continental subregions have direct footprint parts, while the 12 island-system subregions currently lack independent polygons. Review-only polygons can be manually drawn for these unbounded identities. The four oceans have no source ocean polygons and are intentionally not drawn as territories.
- **Exact 8×8 square candidates:** All 42 source footprint polygons with exactly four corners enclosing an 8×8 reference-pixel square are highlighted. A global queue links to each one. Some may be settlement-generated buffer islands; **they are not automatically deleted or treated as errors**, because tiny real islands can also appear square in low-resolution extracted contours.
- **Boundary editing:** Select Continent or Region, select an owner and individual part, enable Edit, and zoom in. In vertex mode drag handles, Shift-click the selected edge to insert a vertex, or Alt-click a handle to remove one (minimum three vertices). Translate mode drags the whole selected polygon. Draw mode collects map clicks into a new manual polygon, finished from the sidebar. Exclude/Restore hides a part from the *effective draft* while leaving a faint review ghost; Reset discards the selected part's draft changes. The two layers are intentionally independent to avoid an accidental propagation or new land claim.
- **Optional independent landmask:** Load a local prepared 2048×1152 PNG/WebP with the sidebar's file picker. It appears over the atlas with adjustable opacity; other sizes are rejected rather than stretched or implicitly cropped. The imported image is kept in browser memory and is neither uploaded nor saved in the review JSON. This is a visual comparison input, never an input to settlement validation or canonical geography generation.
- The visual feature aggregate supplies 201 generated region footprint parts, 68 separate coastline polygon parts, 8 rivers, 5 mountain line features, 4 pass markers and 6 crossing markers. The source coastline layer can be shown **unaltered** to compare against edited boundaries. Region label points and 47 locality display positions are derived from member settlement centroids when available; they are never promoted to source coordinates.
- Planned semantic features without a reference visual geometry remain in an **unplaced list**. A label or descriptive place relation cannot conjure a point or coastline.
- Local marker repositioning, route checkpoints, continent/region draft shapes, individual part exclusions and notes persist in browser `localStorage`. Export/import schema v2 JSON to share them, with backward-compatible v1 review imports. The optional local landmask image itself is not persisted or exported. There is no write path to canonical image masks, region feature data, runtime state or Saves.

## Required local witness before map/route acceptance

1. Inspect the browser developer console and confirm that nine canonical JSON files and both original image layers load without parse, CORS or asset errors. Confirm actual natural image width and height match 2048×1152, or stop at a raster-transform gate.
2. Check source anchor pixels: Aurelis (300,395), Starfall Port (825,245), Seabanner (345,825), Highcrown (1560,255). After zooming and resizing, hover cursor coordinates must match the marker under the pointer within one image pixel.
3. Confirm 88 settlements, 20 named routes, 47 source-locality records, 201 region footprint parts, 5 continent + 4 island macro owners, 28 subregion identities (12 without direct polygons), and **42 flagged 8×8 square candidates**. No label derived from an inferred centroid may be mistaken for a declared geographic marker.
4. Enable the continent outline on its own, then enable the region outline. Verify source coastlines remain aligned when toggled and that continent preview edits do not rewrite the region preview or source coastline.
5. Open the square-candidate queue, select and exclude an 8×8 piece, then restore it. Drag one vertex in region mode, Shift-click an edge to add a vertex, and reset. Repeat in macro scope and prove the edits are isolated.
6. Draw a three-or-more-vertex *proposed* island-subregion polygon under Starfall Isle, then export, import and reset; verify no independent source polygon was inferred automatically. Load a 2048×1152 independent landmask and adjust opacity; test rejection of a mismatched-size file.
7. On **both original layers**, compare the coastlines and route chords at Seabanner/Tidecrown, Aurora/Icehook, Aurelis/Brineharbor/Redcliff, Starfall/Harbormast/Foammarket/Pearlwake/Chainlight. Starfall-to-Blueflow sea access and three Myridian `road` hex links must remain held until verified.
8. Add a waypoint to a selected sea lane, drag it, reposition a settlement with the move toggle, record a note, export JSON, reload, and import. Confirm endpoints track only local draft marker moves and the repository's canonical contents remain byte-identical.
9. Run `node --test tests/unit/first-world-map-review-witness.test.mjs tests/unit/first-world-map-boundary-review.test.mjs`, then `npm --prefix apps/rpg-ui run typecheck` and `npm --prefix apps/rpg-ui exec -- vite build --config vite.world-map-review.config.mjs` from repository root (or run the corresponding commands from `apps/rpg-ui`). A successful build is a separate witness from true georegistration and route validity.
10. Resolve conflicts through explicit source-owner decisions. Do not copy draft waypoint or relocation JSON into `settlements.json` or `travel_networks.json` automatically.

**Held:** Actual raster/browser session, confirmation of individual square origins, real independent landmask acceptance, route clearance, image legend/sea level, physical travel modes and approval for any relocation. Connector-authored files have not been locally executed or browser-validated at creation time.
