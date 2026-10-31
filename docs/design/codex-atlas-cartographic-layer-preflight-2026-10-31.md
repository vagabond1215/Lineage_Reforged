# Codex Atlas Cartographic Layer: Connector-Safe Implementation Preflight

Date: 2026-10-31 (America/New_York)
Status: **CONNECTOR_ONLY / HOLD_NAMED_CONSUMER / NOT_INSTALLED / NO_RUNTIME_OR_CANON_ACCEPTANCE**.
Source selected `master`: `a596112acf3945f2bf7c625e943f2511d12aa710`. This is an addendum to held Area/Atlas design PR #45, not an update to the installed Codex prompt or running native gear/equipment work.

## 1. Precedence and intent

The explicit user-selected **Current Area as default gameplay screen, Codex → Atlas for broad world geography** is documented on held PR #24 (`current-area-default-gameplay-and-codex-atlas-separation-2026-10-26.md`) and reconciled in held PR #45 (`area-atlas-owner-direction-and-source-to-consumer-reconciliation-2026-10-29.md`). Do **not** create a second World Atlas, World → Area/Atlas sibling views, a new Home, or a new map command system.

The Stories Story 1 HTML map is a user-identified **read-only conceptual reference** for image-plus-interactive-overlays design, not a source of Lineage coordinates, locations, racial demographics, political borders, `HUB` identifiers, source code, or task state. Its 1536x1024 normalized world points must never be imported into the Lineage world map.

This note narrows previously recorded PR #24/#26/#45 plans to **map asset registration, native coordinate correctness, disclosure/knowledge, performance, and red-first cartography tests**. Do not re-run their existing navigation/Area action/observation discovery decisions.

## 2. Verified selected-source matrix

| Surface | Exact source evidence | Contract |
| --- | --- | --- |
| Existing Codex Atlas | `apps/rpg-ui/src/features/CodexPanel.tsx` implements `atlas` as searchable `viewModel.character.lists.geographicKnowledge` with detail view; no map canvas or travel executor | Keep the same Atlas, known-place semantics, list and accessible fallback. A map is an optional read-only presentation of these authorized records. |
| Old World map | `WorldPanel.tsx` has stylized grid, decorative blobs, `worldData.locations` percent `x/y`, zoom-only 0.8–1.6, and separate engine-backed Explore/Encounter/Travel controls | Percent positions are **not** proved to be map-image pixels. Retire old broad World geography in the future Area migration, but preserve real owner-backed local actions. |
| Selected shell | `InGameShell.tsx` initializes `activeTab='character'`, not the proposed default Current Area; `TabId` still includes `world` | Future selected UI consumer owns routing and re-entry verification. This connector note does not change navigation or active session code. |
| Knowledge projections | `uiViewModel.ts` maps `sessionState.knownLocations` to World pins/list, while Codex Atlas uses `playerState.geographicKnowledge` with Unaware through Intimate presentation tiers | Separate sources are **not interchangeable**. Do not combine them with guessed `known || tier>0` policy. Existing PR #45 G-01 `known:false` disclosure risk needs selected-source visibility semantics and red-first tests. |
| Map metadata | `packages/content/base/world/world_maps.json` has `world_map.first_world`, reference grid **2048x1152**, map scale/descriptive notes, `layerAssetPaths` and separate `assetReferenceRectPx={x:60,y:60,width:3976,height:2235}` | Grid and source-art reference rectangle are **different coordinate descriptions**. Never assume their transform or use the CSS viewport as the source grid without proving registration. Pixel distance is reference metadata, not pathfinding or travel permission. |
| Raster layers | `packages/content/base/world/map_assets/First World Biome.png` (**2,562,408 bytes**) and `First World Elevation.png` (**2,840,400 bytes**) in selected Git tree | Neither is currently under `apps/rpg-ui/public`. Future local build must prove approved source URL, dimensions, crop, Sites/Vite preview and lazy loading; no connector copy or invented URL. |
| Visual geometry | `packages/content/base/world/world_map_features.json` (**9,318,631 bytes**) contains one `world_map_feature.first_world` aggregate. `world-map-feature.schema.json` contains region footprint, coastline, river, mountain, pass, crossing, climate and biome geometry families | Full aggregate was **not** streamed/render-validated by connector due size. Local checkout must validate selected subset, not import 9.3 MB of source geometry into normal client or infer movement from a polyline. |
| Semantic identity | `packages/content/base/world/map_features.json` contains geometry-free `map_feature.*` semantic identities with reference-only visual pointers | Do not use semantic records as polygon coordinates, transit topology, fog state, or world action authority. |
| Place anchors | `regions.json`, `region_localities.json`, `settlements.json`; `worldSelectionCatalog.ts` knows optional settlement `visualMapRef:{mapId,pixelX,pixelY}`; selected `settlements.json` is **1,260,425 bytes** | Require exact canonical place IDs, verified map ID/geometry/bounds, and reader knowledge permission. Derive only a small display projection; don't duplicate authoritative place registries. |
| Tests | `apps/rpg-ui/tests/atlas-codex-render.test.mjs` verifies known geography, hidden/empty state and lack of commands | Preserve this suite and extend with cartography-specific negative tests. |

Prior documented counts of continents, settlement points, and visual polygons remain *prior audit evidence*, not re-verified full-geometry parsing in this connector pass.

## 3. Proposed read-only MVP, gated by evidence

**A. One viewer and one source of place truth.** Use existing Codex Atlas. Its list, selected ID and inspector stay available without a map. Display a single background raster **only if** its character-visible disclosure policy is accepted; show an optional elevation switch only if the images have proved common registration. Optional Current Area orientation art may link to the **same** Atlas but cannot create a new map state or execute Travel.

**B. Explicit coordinate transform.** Verify actual PNG width/height, content crop, source-art rectangle and canonical 2048x1152 coordinate origin in a checkout; compare several existing authored source points and polygons against image landmarks. Store the verified transform in a *derived read-only display adapter*, never in gameplay Save. Apply a consistent viewBox/transform to image and overlays. Letterbox/crop, pan, zoom, reset and responsive resize must transform image and pins together. If source-to-image registration cannot be proved, render unpinned reference art or list-only mode.

**C. Small bounded projection.** A selected future Codex implementation may produce a compact, validated, lazy-loaded display-only manifest with: source map ID/revision, pixel frame and transform provenance, background asset references, and a limited filtered set of canonical place IDs, marker coordinates, geometry type, attribution, and descriptive-only status. It must not become a second runtime source, include hidden identities, or silently mirror the huge visual-geometry JSON. Existing content owners and validators remain unchanged. Size/bundle benchmark required in a local repo-capable run.

**D. Knowledge and imagery disclosure.** The first decision is whether the entire world raster is an explicitly out-of-character reference image or an in-world, character-visible geography chart. A full biome image reveals coastlines and environments even if every hidden marker is suppressed. No source yet proves that this disclosure is authorized by the current geographic-knowledge tiers. Until a grounded owner policy is approved, a full-world background cannot be presented as *character-known*. No synthetic fog-of-war, discovery grants, unapproved labels, hidden coordinates, search results, hover, alt text, or ARIA announcements. `known:false` and Unaware/level 0 must fail closed under the owner's actual precedence contract.

**E. Display layers, not gameplay authority.** First allowed candidates after evidence: biome/elevation background, known continent/region labels, disclosed canonically anchored settlements, and authored descriptive linework where validated. No automatic racial density, culture/polity boundaries, roads, economy, quest target, leyline, convergence, dungeon-core territory, undiscovered POIs or resource heatmaps. Future overlays need specific own content identity, provenance, display/disclosure permission, and tests. Geography asset visibility never creates a new location, command, encounter, route or player observation.

**F. Strict interaction boundary.** Clicking a pin, searching, panning, zooming or changing layer changes Atlas *inspection state only*. It never changes `playerState.location`, watch, resources, quest state, Chronicle, Travel estimate, route eligibility, location recognition, Save, or source game state. Actual Travel remains on Current Area through the engine-owned preview/admission methods, including failure reasons. Pixel proximity and linework are not traversal graph edges.

**G. Usability and runtime.** Keep keyboard-accessible list/selection/zoom/reset; pointer and touch pan; responsive desktop/portrait/landscape; focus/contrast/reduced-motion; error and image-load fallbacks. Lazy-load artwork/overlay only in Atlas; do not eagerly serve 2.5–2.8 MB images on unrelated tabs or drag 9.3 MB source visual geometry into the browser. Verify production Vite/Sites resolver and SSR behavior, not just local CSS.

## 4. Prospective red-first cartography tests (not run)

These **CM** scenarios are additive to PR #45's prospective AA/AW/AO/AF/AE matrix; they are not implementation or selected-client QA.

| Case | Evidence required |
| --- | --- |
| CM-01 | Atlas knowledge/list/inspector still work with no image or broken URL; no hidden-place fallback leakage. |
| CM-02 | Biome/elevation switch keeps frame and pins fixed with same verified source transform. |
| CM-03 | 2048x1152 grid vs 3976x2235 source-art reference rectangle is explicitly resolved; no invented scaling. |
| CM-04 | Selected authored on-map landmark/settlement aligns at fit, zoom, pan and responsive resize, in both aspect-ratio environments. |
| CM-05 | Wrong mapId, missing/nonfinite/out-of-range coordinates, absent geometry and stale source revisions fail closed. |
| CM-06 | Marker, searchable known-place list, selected inspector share canonical stable IDs; current position isn't inferred from selected map pin. |
| CM-07 | A `known:false` record is absent from marker, list, search, labels, tooltips, accessible names, details and preview. |
| CM-08 | Tier-0/unaware, missing tier, and conflicting knownLocation/geographicKnowledge sources follow a **confirmed** fail-closed visibility policy. |
| CM-09 | Background raster reveals only what the owner-approved *world-reference vs character-known* disclosure policy permits. |
| CM-10 | Map/list interaction is read-only: snapshot, Save, watch/time, condition, Chronicle, quest and current location do not change. |
| CM-11 | Atlas → Current Area handoff does not bypass engine travel preview or rejected destination/access guards. |
| CM-12 | Visual routes and close pixels never compute trip permission, duration, pathfinding or encounter generation. |
| CM-13 | Geometry-free `world.map_features`, visual aggregate, settlement/region sources, schemas and validators remain unmodified. |
| CM-14 | Production-preview image resolver, lazy loading, asset errors, no-eager-load-on-Character, and bounded payload/performance validated. |
| CM-15 | Keyboard/touch/pointer use, alt/ARIA, zoom/reset, mobile portrait/landscape and reduced-motion validated. |
| CM-16 | Existing Codex Atlas regression, selected Area/Travel, gear/Save/quest/combat suites and app build retain baselines. |

## 5. Remaining repo-capable gates and closeout

**Connector prep is complete for this bounded cartographic question at the inspected head.** The missing evidence requires authenticated checkout and tooling: full >9 MB geometry parse, actual raster crop/registration, map ref visual comparison, public/build asset routing, compressed payload and mobile paint measurements, accepted player-disclosure semantics, selected account/session/Save tests and exact Codex UI integration. A repo-capable owner should choose the smallest read-only `S` or small `M` Atlas package when selected Area/Codex dependencies and native gear/Save acceptance permit. If coordinates/disclosure cannot be proven, ship *only* a list and/or noninteractive illustrative reference, without fake markers.

Branch disposition: **PR #45 remains `HOLD_NAMED_CONSUMER`** for future selected Area/Codex UI review. No merge, production source, asset, content, prompt/handoff/output/register, test, Save, Game version, Site, protected branch, or separate PR #24/#26 changes are made here. The currently installed equipment Codex prompt is untouched.
