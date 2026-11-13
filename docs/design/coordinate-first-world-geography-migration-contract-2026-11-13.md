# Coordinate-first First World geography and legacy hex retirement contract

Date: 2026-11-13  
Decision: **Coordinate-first for all new geography and spatial authoring. Legacy grid-related authority frozen for migration only.**  
Implementation status: **Stage C0 foundation and forward gate authored on `master`; full native verification pending.**

## Decision

New continents, islands, physical landmasses, subregions, localities, environmental zones, settlements, routes, spawn areas and resource areas must be defined by **stable place IDs plus registered coordinates and explicit geometries**, rather than tessellation or arbitrary fixed-size hex cells. Geographic region sizes are allowed to vary. A region's identity and political parent are distinct from its geometry; biome and ecological zones may overlap administrative borders. Every new island ownership decision is at the level of independently audited connected physical islands. Kaelvar's large northeastern island must remain a **single whole physical unit** until one sovereign owner is approved. The 18 pending Shattercap-connected detached source-terrain components, Coast 40 and Serathyl's Windward Spine are not resolved by this decision.

An internal spatial index, image pixel grid, geographic tile, raster sample, procedural chunk, or navigation mesh may still be used as a **derived implementation structure**. None is permitted to create or redefine canonical place identity, political sovereignty, source habitat labels, or implied traversable routes.

## Coordinate and geometry contract

Initial reference frame: `world_map.first_world.reference`, 2048 × 1152 source pixels with x increasing eastward and y increasing southward from the top-left image corner. The existing map metadata defines 9.765625 km per reference pixel, so the planar display-reference rectangle spans 20,000 × 11,250 km. Fractional coordinates are allowed, and map display pixels are not the minimum possible position granularity. Boundary geometry uses polygons with an outer ring and optional holes; areas can contain separately enumerated polygons. The geometry primitives are in `scripts/lib/world-coordinate-geometry.mjs`.

**Important:** the planar mapping is currently a source-image approximation. It is not geographic latitude/longitude and not a proof of geodesic surface distance, roads, ferry availability or walking time. Do not use flat pixel-distance alone as a world-wide navigation path. Local maps need versioned transforms from reference coordinates to appropriately scaled local frames, and a later dedicated decision for projection/distortion and persistent save compatibility.

The future published geographic-area authority should have versioned, reviewed `geometryRef` records with `mapId`, `coordinateSpaceId`, parent/region references, source-feature and physical-component provenance, polygon rings, holes, potentially several *approved* disconnected pieces, and explicit state such as `DRAFT`, `APPROVED` or `WITHHELD`. Do not infer that every polygon belongs to a named region or that a connected piece is politically approved because it is physically adjacent. **This document does not publish such a schema or any new region geometry.**

A settlement's future location should use a stable ID, `regionId`, `regionLocalityId`, and a coordinate object with a resolution/source reference. Travel topology should be a directed, explicitly traversable **route graph** of place or crossing IDs, with route polylines and environmental barriers, validated transport modes, and route-specific length and hazard calculation. Nearby coordinate proximity cannot establish a road, pass, ford, bridge, ferry or sea connection.

## Why immediate hex removal is unsafe

The current 47 `world.world_hexes` records are primarily semantic terrain/locality zones: the active JSON schema requires no regular hex-axis coordinates or polygon corners. The 49 `world.world_hex_edges` records own graph connectivity and transport barriers. The live content and runtime still depend on them:

| Current dependency | Current consequence | Required replacement |
| --- | --- | --- |
| `settlements.hexAnchorId`, active hex reverse `anchoredSettlementIds` | All 88 settlements and settlement/lint/consistency schemas reference hex identity | Stable settlement coordinate + `regionLocalityId` + approved environment-area lookup; maintain old-ID compatibility while saves transition |
| `civilization-engine/src/spatial-world.ts` | Resource affinity, local access, reachability, route segments and the current `HEX_DISTANCE_KILOMETERS = 24` estimate use hex geometry and edges | Environment-zone queries over coordinates and area polygons; connected path graph with measured route segment lengths |
| `world.travel_networks` | Named corridors, ordered hex/edge references, mode and route time profiles | Named route IDs and directed coordinate/polyline segments, retaining explicit crossing and travel-mode restrictions |
| `game-engine/player-nearby-exploration.ts`, encounter action contexts | Nearby exploration validates settlement-to-hex-to-edge chains | Settlement or character coordinate + explicitly accessible nearby zones and approved connections |
| `world-engine/spawn/index.ts`, spawn profiles and encounter state | Spawn scope can target region and world-hex IDs; some save and combat context uses those fields | Habitat/region/site/spatial-area targets with migration adapter for existing world-hex contexts |
| `tools/content-lint`, schemas, content tests | Actively require legacy keys and referential coherence | Coordinate, shape, source provenance, route and save migration validators with no silent fallback |
| Existing world saves, starting settlements and scenario templates | Old IDs and snapshots may be persisted | Versioned up-conversion, replay tests and rollback/witness of old behavior |

The project had already documented deferring any new or expanded grid-overlay authority until 0.6+, while preserving existing hex content until a later integration decision. **This narrower coordinate-first instruction supersedes grid-first expectations for new development, not the accepted current live data contracts.**

## Enforceable forward freeze

The check `node scripts/check-no-new-hex-dependencies.mjs --check` uses the frozen pre-migration ancestor `1731975e3ec3675089b12d72513b50434ef71f23`. It scans tracked and untracked executable source and JSON under `packages`, `apps`, `tools`, `scripts`, `tests` and root `package.json`. It compares normalized hex-coupled lines to that exact ancestor, allowing deletions but flagging new source lines containing legacy IDs, anchor and topology fields, imports or legacy cell vocabulary. Newly introduced files have **zero** grandfathered lines. Audit machinery itself is excluded to avoid treating its own rule patterns as new dependencies. The gate cannot prove there is no semantic dependency hidden behind a neutral name; required code review remains in force.

The source-code gate is intended to run both as a standalone npm script and as a unit test in normal test runs. Do not update its baseline casually to bypass a failure. A necessary temporary legacy migration edit can be documented as an explicit exception only after demonstrating parity, targeted tests, and owner approval. The gate makes no code or content writes.

## Kaelvar candidate authoring adjusted

The previously proposed eight new world-hex candidate records have been **re-expressed as unplaced semantic environmental zones**, one per named candidate locality band. They preserve biome-family hypotheses, elevation, terrain, freshwater, resource/hazard tags, habitation and traversal-friction values. Each has `geometryRef:null`, an explicit coordinate-space ID, no physical-component owner, and `placementStatus:UNPLACED_NO_POLYGON`. These are descriptive profiles, not cell centers or route vertices. The eight named settlement concepts remain unplaced. The five-region population scenario still conserves the existing 40-million Kaelvar parent estimate. The existing active world regions, hexes, edges, settlement, route, encounter and Save data remain intact.

## Bounded migration sequence

| Stage | Entry | Success/exit | Fail/hold |
| --- | --- | --- | --- |
| **C0: freeze new coupling** | Accepted baseline; identify all active hex consumers | Coordinate library, source freeze check, candidate environmental-zone conversion, test parity; no canonical data changes | New dependencies or existing consumer behavior altered |
| **C1: geometry registry** | C0 native pass; source calibration and Kaelvar five-region review | Reviewed coordinate frame, multi-polygons with holes, whole-island components, source-provenance witnesses, consistent point-in-area | Geographic ownership inferred from colors, equal-size regions, islands split or unresolved source ink reclassified |
| **C2: place and habitat mapping** | C1 review; preserve all settlement IDs and locality data | Coordinate-anchored settlements, environmental areas and reproducible local ecology with old-ID crosswalk; no missing starting location | Unplaced oasis, route, water source or monster habitat silently published |
| **C3: routes and economics** | C2 mapped places, explicit crossings and mode semantics | Directed route graph and path distances, resource access and economy comparisons against original route/hex behavior | A route becomes available by proximity only, mode/barrier semantics lost or 24-km fallback quietly retained |
| **C4: encounters and saves** | C3 travel parity | Nearby exploration, spawn targeting, campaign snapshots, starting regions and old saves use coordinate/habitat targets through a tested upgrade path | Unmigrated IDs, save regressions or changed encounter reachability |
| **C5: retirement** | Every C1–C4 native end-to-end gate passed | No live references to legacy hex schemas, catalogs, edges, fields or runtimes; approved deletion and permanent lint | Any unresolved dependency, old save or test requires hex identity |

**Current permission:** C0 foundation and candidate migration. **Not authorized:** deleting hex catalogs and edges, rewriting live runtime/save content, promoting coordinate geometry or unresolved five-region shapes to canonical source, or automatically assigning detached islands.

## Immediate verification commands

```powershell
node --test tests/unit/world-coordinate-geometry.test.mjs tests/unit/legacy-hex-forward-gate.test.mjs tests/unit/kaelvar-five-region-candidate-audit.test.mjs
node scripts/check-no-new-hex-dependencies.mjs --check
node scripts/kaelvar-five-region-candidate-audit.mjs --check
```

Run in a **clean, exact-HEAD detached worktree** to preserve the primary dirty checkout. The tests and commands are read-only. Full native verification, not just this document, is required before C0 is marked accepted.
