# Codex Atlas: Single-Source Location Authoring, Profiles, and Derived Map Projection

Date: 2026-10-31 (America/New_York)
Status: **CONNECTOR-ONLY PREIMPLEMENTATION RECONCILIATION / HOLD_NAMED_CONSUMER / NOT INSTALLED.** No map renderer, location database schema, authoring tool, settlement seed, travel migration, selected Save, UI, gameplay or Game-version acceptance.
Inspected selected `master`: `a596112acf3945f2bf7c625e943f2511d12aa710`. This independent new document is on held Area/Atlas draft PR #45; the installed Codex equipment/non-fungible Save prompt and parallel gear PR stack remain unchanged.

## 1. User requirement and controlling architecture

**User-directed requirement:** names, editable descriptions and profiles for mapped places must come from the existing canonical world-location data; map locations must be derived from that same data, and any duplicate/conflicting information systems must be reconciled rather than developed in parallel. An eventual controlled location authoring workflow should edit existing authoritative records; it must not create a second Atlas-owned world or place database.

Controlling previous owner-direction: held PR #24 `current-area-default-gameplay-and-codex-atlas-separation-2026-10-26.md`, reconciled by held PR #45 `area-atlas-owner-direction-and-source-to-consumer-reconciliation-2026-10-29.md`. **Current Area** is the eventual default *immediate gameplay* surface; **existing Codex → Atlas** is the sole broad map and place-reference browser. No new Home, no World → Area/Atlas sibling UI and no second Atlas. This document complements `codex-atlas-cartographic-layer-preflight-2026-10-31.md`; its image registration, disclosure and CM test gates remain binding.

The Stories Story 1 interactive HTML geography and racial-settlement overlays remain **read-only conceptual inspiration**. Do not import Story coordinates, `HUB` proposal IDs, new racial demographics or narrative canon. Only deliberately approved new Lineage world records can become canonical map places.

## 2. Actual data authority, not a hypothetical universal location database

Lineage's canonical authored location information exists mainly in **strict, typed JSON content registries**, not one general `locations` SQL table. `packages/db/migrations/001_world.sql` creates biome, habitat, flora, fauna and mineral tables, **not** a universal place table. Do not introduce a second editable `locations.json` or SQL `locations` master merely to drive Atlas.

| Existing owner | What an editor may change, within current schema | Atlas consumption and limits |
| --- | --- | --- |
| `packages/content/base/world/regions.json` | Stable `region.*` ID, name, aliases, region type, parent, map reference, summary, descriptive/environmental and other permitted authored profiles | Region/continent/island/ocean labels and descriptions. A record's presence is not itself proof of an accurate point/polygon or of the player's awareness. |
| `region_localities.json` | `region_locality.*` ID, name, macro/region chain, locality classification, summary, approved ecological/economic suitability descriptors | Locality reference, parent region and known-place profile; no invented world coordinate. |
| `settlements.json` | `settlement.*` ID, name, `summary`, `siteContext`, tags, settlement type, population, economy/survival/trade/infrastructure/resource/racial-mix descriptions, semantic region/locality/hex/parent anchors, optional `visualMapRef` | **Primary source for settlement pins and settlement profile.** The strict settlement schema permits these already-established descriptive fields; do not invent an extra `mapProfile` or duplicate metadata. `visualMapRef` is visual support, not travel topology. |
| `settlement_districts.json` and `settlement_sites.json` | Individually owned `settlement_district.*` and `settlement_site.*` IDs, names, parent bindings, summaries, approved tags/status | Show only if active/disclosed and if explicitly **registered local geometry** exists; no automatic pin at the parent's settlement coordinate. |
| `map_features.json` | `map_feature.*` named semantic physical feature identity and descriptive place anchors | Display names/profiles *as semantic records*. Coordinates/geometry come **only** from proven `world_map_features` visual references, not from these feature records. |
| `world_maps.json`, `world_map_features.json` | Map identity, raster layers/grid/frame, already-authored visual geometry and reference-only spatial masks | Own raster/visual registration, not settlement names, politics, Knowledge, simulation identity or route permissions. Existing visual summary labels and polygons are not an independent place catalog. |
| Family-specific future owners, including sacred sites, religious hotspots, ruins, caves, dungeons, ports, routes, leyline nodes | Each has or needs its own accepted semantic owner and stable place/feature reference | Atlas is a **read-only federated consumer** of approved identities, not the owner of those objects. No generic `world.pois` table: `discovery-poi-boundary-decision.md` explicitly rejects duplicate POI authority. |

Status/coverage can differ among these families; never imply all possible on-map features are already named, positioned, or approved. A proposed Story hub, drawn shape, biome, plot icon, or generator candidate is **not** a new canonical settlement.

## 3. Confirmed cross-surface duplication and compatibility debt

The concern is **real**, but it is not proof that canonical world JSON files themselves are competing stores. The duplication is at *projection/runtime/presentation* boundaries.

1. `apps/rpg-ui/src/game-shell/newGameSnapshot.ts` currently copies selected authored settlement `id`, `name`, `regionLabel`, `settlementId`, `regionId`, `type`, `visualMapRef.pixelX/pixelY` (or **0** fallback) and `summary` into a durable `sessionState.knownLocations` entry. This is a character/session snapshot, **not** a second authority to edit settlement names, descriptions or positions. The `0` fallback can misleadingly imply a real map point; it must not become a rendered pin if an anchor is absent.
2. `packages/shared/types/src/contracts.ts` defines `KnownLocationState` with independent `id/name/regionLabel/type/x/y/note/known`; `PlayerGeographicKnowledgeState` separately carries `scope/geographyId/level`. `uiViewModel.ts` currently uses the former for World pins/list, and the latter for existing Codex Atlas. In particular, the existence of `knownLocations` display fields or a world record is not evidence of disclosure/recognition.
3. `packages/engines/game-engine/src/player-travel-rules.ts` has hard-coded `PLAYER_TRAVEL_DESTINATIONS`, with its own `name/regionLabel/siteLabel`, travel costs, origin mappings and arrival activity strings. **Three compatibility destination keys** `location.saltmere`, `location.westreach`, `location.crown_bastion` refer to canonical `settlement.aurelis`, `settlement.stonevein`, `settlement.sunspire_reach` respectively, despite historical labels. `location.ashen_reef` is a distinct *survey-approach* destination in Starfall's settlement context, **not** a synonym for `settlement.starfall_port`. `travel-compatibility-identity-and-migration-intent-audit.md` already documents this as intentionally deferred and migration-sensitive. Do not mass-rename, delete, or collapse these keys.
4. `WorldPanel.tsx` uses `worldData.locations.x/y` as CSS **percentages**; `newGameSnapshot.ts` initializes those values from authored `visualMapRef.pixelX/pixelY` in the **2048×1152** reference map. This is a coordinate-space mismatch unless an explicit scaling transform exists in the consumer. The current World placeholder is not an authority to reuse coordinates without adapting them.
5. `apps/rpg-ui/src/game-shell/worldSelectionCatalog.ts` already imports region/locality/settlement content. `packages/engines/civilization-engine/src/content.ts` has corresponding official content loaders. `scripts/regenerate_world_map_features.ps1` already reads `world_maps.json`, `world_map_features.json`, `regions.json`, and `settlements.json` to derive some visual geometry. A future Atlas renderer must not introduce an unrelated hand-edited list that bypasses these sources.
6. Existing `tools/content-lint/settlement-visual-map-refs.mjs` validates map ID, coordinate upper bounds, climate/biome-zone links, and uniqueness of the visual map record. It does **not** by itself prove coastal alignment, visibility, all place types, image crop or global place-name uniqueness. Keep those as additional *tests*, not assumptions about current proof.
7. Broad `world_maps.json` trade/conflict summaries, historic `worldRecords` UI rows, `story/reference/locations/*.md`, map-region text labels and game `KnownLocationState` must not silently become alternative location masters. Each must either derive from the proper canonical owner, remain an explicitly bounded reference/example, or be independently reconciled by its owner.

**Conclusion:** preserve existing semantic authorities. Consolidate duplicate *reads and projections* into one source-keyed location resolution path; do not merge unrelated record families or flatten real site-vs-settlement distinctions.

## 4. Proposed authoritative authoring and derived map pipeline

```text
Author edits existing, schema-owned canonical records (stable IDs)
  -> strict schema + reference/parent/semantic validation
  -> authoritative place-identity index (federated typed view, NOT new content owner)
  -> location profile view / registered image geometry / explicit disclosure policy
  -> versioned, reproducible, ephemeral cartographic projection
  -> Codex Atlas [same IDs, names, profile facts, validated pins]
           and Current Area [actual player location, current legal actions]
  -> engine-owned Travel only after its separate authorization
```

A future authoring/editor UI is an **admin/developer tool** to update the correct existing JSON file (or a formally migrated storage equivalent) under validation and review. It is **not a player action** to rewrite world canon, and does not autonomously edit Save, weather, live populations, player Knowledge, quest state or gameplay. Until a safe tool exists, the same workflow can be done through reviewed repository changes.

Editing rules:
- **Rename:** keep immutable canonical `id` and existing references. Change the owned `name` and allowed `aliases/summary` in the right record; do not mechanically regenerate the ID from the new spelling. Validate uniqueness/intent and references. Derive Atlas labels from the updated canonical source. Historical accepted receipts and authored historical dialogue retain their preserved context; only *current* projections update.
- **Profile changes:** edit allowed fields only; e.g., settlement economics/population/racial mix are authored descriptive profiles, not runtime current stocks, borders or actual simultaneous presence of named NPCs. Region ecology belongs in its designated profile owners where separate. A region's race distribution does not generate specific racial city pins without distinct accepted place records.
- **New place:** choose the correct owner type first (continent/region/locality/settlement/district/site/physical feature/other), assign stable typed ID, parent chain, documented provenance, and any schema-required fields. Stage *proposals* separately from accepted authored content. No automatic promotion of Story candidates or unverified procedural settlements into live canonical records.
- **Relocation:** change a settlement's approved `visualMapRef` and reconcile parent region/locality/hex, biome/climate reference, visual layer, and relevant authoritative route/topology evidence. Never infer a real journey from pixel movement. A district/site without independent geometry inherits **context**, not a fake exact point.
- **Delete/retire/merge:** produce explicit conflict and referential-integrity report first. Preserve historical names/events and character state. True duplicates may be consolidated only after owner-accepted identity-equivalence proof and migration across travel, Knowledge, quest, Save and UI. Distinct Ashen/Starfall-like places must remain distinct even if sharing a parent/settlement context.
- **Saved display rows:** long-term prefer canonical `placeType + placeId` (or explicitly typed destination reference) for *current descriptive resolution*, with versioned compatibility for existing `KnownLocationState` fields. Keep character-specific `known` and geographic-knowledge level in their own persisted owners. A read-through adapter can first detect stale display strings versus canonical labels without destructive save mutation. Do not perform a schema/Save cutover until all callers, historical witnesses, normal defeat/recovery, restart, selected clients and retries are validated.
- **Travel destination keys:** use a separately reviewed **typed mapping** from existing `location.*` compatibility destination to canonical place target plus specific approach/site semantics. Do not infer identity equivalence from equal `settlementId`, string similarity, or equal pixel point. Keep travel time/cost/permission engine-owned.
- **Map renderer:** consume canonical IDs/names/approved profiles via a source-revision-bound projection, with optional *registered* visual geometry. Marker metadata must not duplicate editable settlement descriptions. Regeneration deterministically reflects approved content changes and rejects dangling/stale IDs or schema violations; no manual overrides of names, race maps or coordinates in UI source.

## 5. Source-owner conflict audit and reconciliation procedure

Before selecting any implementation, run a *complete authenticated-checkout audit* of:

(a) typed region/locality/settlement/district/site/map feature registries, names, aliases and ownership; (b) exact `visualMapRef` map and pixel registration; (c) visual feature generator and image-asset inputs; (d) new-game/creator data hydrations and `worldSelectionCatalog`; (e) `knownLocations` and `geographicKnowledge`; (f) `uiViewModel.ts`, `WorldPanel.tsx`, `CodexPanel.tsx` and prospective Area; (g) `PLAYER_TRAVEL_DESTINATIONS`, normal-defeat, quest/survey/Chronicle/Save and all runtime `location.*` consumers; (h) historic `story/reference/locations` docs as reference-only; (i) current branch/PR conflicts and generated assets.

Produce a **machine-readable evidence report**, not a new authoritative content catalog:
`{sourceFamily, canonicalPlaceId, parentId, currentName, mapRefStatus, mapId, geometryRefStatus, runtimeAliasIds, knowledgeVisibilityOwner, dependentConsumers, conflictClass, recommendedAction}`.
The report must identify, at minimum, ambiguous aliases, duplicated display names, stale snapshot label/coordinate, missing map registration, impossible/inaccurate pixels, ownership collisions, missing/proposed parent references, runtime-string mismatches and hidden-data leakage. Any compatibility aliases in reports are **read-only cross references**, not new live canonical `location.*` identities.

Classify each comparison:
- `SAME_AUTHORITY_DERIVED_VIEW`: no migration; consume source via derived projection.
- `PERSISTED_PRESENTATION_COPY`: canonicalize read time, separately plan safe Save/serialization compatibility.
- `TRAVEL_COMPATIBILITY_ALIAS`: map to typed canonical target; preserve current IDs until explicit source-to-Save migration.
- `DISTINCT_PLACE_SAME_CONTEXT`: preserve distinct place identity (e.g. Ashen approach and Starfall settlement).
- `UNVERIFIED_PROPOSAL`: do not emit as canon/map pin.
- `TRUE_DUPLICATE_CANDIDATE`: require exact proven identity and full consumer impact before any merge.
- `VISUAL_ONLY_FEATURE`: keep visual geometry, do not mint a new canonical place.
- `UNRESOLVED`: fail closed for map pin and disclose exact blocker.

## 6. Prospective tests and acceptance, **not executed**

These `LC` cases add to existing `CM-01..16` and PR #45 AA/AW/AO/AF/AE tests without replacing them:

| Case | Expected evidence |
| --- | --- |
| LC-01 | Every Atlas pin and editable profile resolves by *typed, existing* canonical ID; no extra `locations` content owner. |
| LC-02 | Change canonical settlement `name` in a fixture; regenerated Atlas title, marker, search and inspector all reflect it without hand-edited UI fields. |
| LC-03 | Change canonical `summary/siteContext` in a fixture; all current reference detail fields update; historical receipts are not rewritten. |
| LC-04 | Change a validated settlement `visualMapRef`; marker moves in registered map space with correct map/region/hex/climate/biome checks, not travel simulation. |
| LC-05 | Missing/nonfinite/off-map anchor produces no origin/0,0 fake marker; list/profile fallback remains. |
| LC-06 | Entity without exact local geometry (district/site/semantic physical feature) has proper parent/context and no invented pinpoint. |
| LC-07 | Existing renderer and world feature generator use same canonical sources and deterministic transformation/provenance. |
| LC-08 | No old World percent-coordinates are used as image-pixel coordinates directly. |
| LC-09 | `known:false`, geographic tier-0, stale unknown-save row, unowned place and hidden source facts do not leak into names, map, search, tooltip or accessibility. |
| LC-10 | Old Save with stale `KnownLocationState.name/note/x/y` displays current canonical description **only if** correct typed reference and disclosure are proven; preserves player-known state and Save byte/command semantics until separately migrated. |
| LC-11 | Legacy `location.saltmere/westreach/crown_bastion` map to accepted canonical settlements without changing travel permission, duration, receipts or persisted IDs. |
| LC-12 | `location.ashen_reef` remains distinct from Starfall settlement; no same-settlement false origin/equivalence, survey flow regression or fabricated canonical site. |
| LC-13 | True duplicate detection rejects ambiguous same-name or same-coordinate identity; a name match does not trigger an automatic merge. |
| LC-14 | Proposed Story-location/race-density marker, generated geographic candidate and unknown map shape do not appear as canon. |
| LC-15 | Edited profiles pass strict schema/lint, parent/status/reference validation, content-unique-ID checks, map visual tests, selected creator/Area/Atlas tests and direct app build. |
| LC-16 | Renames/identity migration audit includes travel, quest, Knowledge, recovery/normal defeat, selected Save/restart and exact historical receipt compatibility. |
| LC-17 | Admin authoring changes have review/provenance and do not mutate player Save, player position, political control, runtime stocks, time or discovery grants. |
| LC-18 | Export/derived manifest has source revision, canonical IDs and image registration; repeated identical inputs yield byte-stable results with no second editable authority. |

## 7. Staging and acceptance boundaries

**Connector-safe now:** authority/source map, confirmed projection risks, conflict classification, review/authoring workflow and implementation test contract. No actual location database or UI mutation.

**Future bounded repo-capable packages, only after current native equipment/Save and selected Area/Codex gates:** (1) red-first source/consumer inventory + schema/reference identity checker, and stale display-copy/compatibility report; (2) typed canonical read-only place resolver and reader-safe disclosure, keeping old Save and travel IDs intact; (3) small deterministic map projection, raster registration and Codex Atlas display with evidence and performance checks; (4) separately approved canonical-authoring/editor workflow; (5) only if justified, versioned legacy travel-key/known-location migration with selected account/Save/restart/effect tests. Each may end with a negative/no-implementation result if its authority or consumer contract is absent.

**Non-negotiables:** No silent duplication, no replacing source registries with Atlas JSON, no bulk auto-generation of named places from pixels, no race-density/nation lore inference, no same-parent conflation, no arbitrary edit of accepted history, no bypass of visibility or travel, no broad Save migration during active gear work, no `GAME_VERSION` increment, no Site deploy, no master or existing draft PR auto-merge. This is a `HOLD_NAMED_CONSUMER` addendum to PR #45 until a fresh selected Codex map and location-authoring consumer explicitly admits it.
