# Settlement Identity Schema Decision

Source version/run: Version 0.5.218 - Settlement Identity Schema Decision
Date: 2026-06-21
Status: approved documentation-only schema posture; no implementation permission

## 1. Decision Summary

Keep the existing `world.settlements` collection as the canonical world-owned authority for settlement identity, inhabited-place classification, semantic geography, settlement hierarchy, and its current descriptive profiles. Do not create a replacement collection, split the schema, move fields, normalize content, or introduce aliases.

The current contract is sufficient for this phase. Identity and place fields remain intrinsic. Population, economy, survival, trade, infrastructure, racial-mix, resource, trade-flow, and guild-presence fields remain embedded descriptive current-data authority until a dedicated normalization decision proves that a separate owner is necessary and defines a non-duplicating transition.

Keep `macroRegionId`, `regionId`, `localityBandId`, and `hexAnchorId` required and coherent. Keep `parentSettlementId` plus `dependencyRole` as the optional settlement hierarchy. Keep `visualMapRef` optional visual/reference support only, even though all current records provide it. Do not add district, local-site, building, infrastructure, workplace, or service references to settlement records now.

No schema, validator, content, test, runtime, UI, storage, migration, or gameplay change is approved by this decision. A later settlement schema/validator hardening pass may strengthen existing reference validation without changing authority boundaries or content shape.

## 2. Live Repo Reality

Live inspection supersedes uncertain claims in the temporary settlement research:

- `packages/content/base/world/settlements.json` is an existing records-only authority with 88 records, not a future seed target.
- `packages/schemas/world/settlement.schema.json` is strict, rejects additional properties, and defines 28 record properties. Twenty-five are required; `parentSettlementId`, `dependencyRole`, and `visualMapRef` are optional at schema level.
- All 88 live records provide the required geography chain and `visualMapRef`; 18 provide the paired parent/dependency fields.
- Content lint validates ids/slugs, controlled vocabularies, descriptive profile shapes, percentage totals, item-key-like values, paired parent/dependency fields, dependent types, and visual-map shape.
- Cross-file lint resolves macro regions, regions, locality bands, world hexes, parent settlements, guild definitions, and domestic trade partners. It enforces geography, site-class, terrain, hex-anchor, hierarchy, population-size, guild, and trade-partner coherence.
- World hexes reciprocally list anchored settlements. Travel networks consume settlement endpoints and their hex anchors. Sacred sites, religious hotspots, spawn profiles, quests, Knowledge, player/account state, civilization systems, creator/UI surfaces, and tests also consume settlement ids.
- `civilization.buildings`, `civilization.infrastructure`, and `civilization.workplaces` already exist as separate reusable authorities. None is a settlement identity or placed local-site collection.
- No canonical settlement district, placed building, general local-site, service, property, or construction authority exists.

The temporary artifact's possible "settlement identity gap" and proposed first creation of `world.settlements` are stale. The live authority is established and broadly referenced.

## 3. Existing Settlement Schema Inventory

The record contract currently contains:

| Group | Existing fields | Current posture |
| --- | --- | --- |
| Stable identity | `id`, `slug`, `name` | Intrinsic settlement identity. |
| Semantic place | `macroRegionId`, `regionId`, `localityBandId`, `hexAnchorId` | Intrinsic authored placement; required and cross-validated. |
| Classification | `settlementType`, `siteClass`, `terrainContext` | Intrinsic inhabited-place classification. |
| Scale and administration | `populationBand`, `populationTotal`, `administrativeRole` | Current embedded descriptive authority. |
| Settlement hierarchy | optional paired `parentSettlementId`, `dependencyRole` | Intrinsic settlement-to-settlement dependency hierarchy. |
| Description | `summary`, `siteContext`, `identityTags`, `purposeTags` | Intrinsic descriptive identity/context. |
| Embedded profiles | `economicModel`, `survivalModel`, `tradeDependencyProfile`, `infrastructureProfile`, `racialMix`, `domesticResourceProfile`, `domesticTradeFlows`, `guildPresence` | Preserve as current embedded descriptive authority. |
| Visual support | optional `visualMapRef` | Visual/reference support only; not semantic placement or runtime coordinates. |

The wrapper remains `{ "records": [...] }`. This decision does not recommend a wrapper, id, path, or namespace change.

## 4. Intrinsic Settlement Identity Fields

The intrinsic settlement identity/place contract is:

- `id`, `slug`, and `name` for stable canonical identity;
- `macroRegionId`, `regionId`, `localityBandId`, and `hexAnchorId` for semantic world placement;
- `settlementType`, `siteClass`, and `terrainContext` for authored place classification;
- optional paired `parentSettlementId` and `dependencyRole` for dependent-settlement hierarchy;
- `summary`, `siteContext`, `identityTags`, and `purposeTags` for stable descriptive character and purpose.

`administrativeRole` is useful settlement description but does not establish polity, government, jurisdiction, office, legal authority, or political ownership. `populationBand` and `populationTotal` describe authored scale but do not establish runtime population state.

No current field grants route ownership, pathfinding, services, production, government, guild operation, NPC presence, property ownership, quest state, or gameplay behavior.

## 5. Embedded Descriptive Fields To Preserve

Preserve these fields in settlement records without modification:

- `populationBand` and `populationTotal`;
- `administrativeRole`;
- `economicModel`;
- `survivalModel`;
- `tradeDependencyProfile`;
- `infrastructureProfile`;
- `racialMix`;
- `domesticResourceProfile`;
- `domesticTradeFlows`;
- `guildPresence`.

They are authored baseline descriptions used by current content, validation, simulation projections, and presentation. Their overlap with future authorities is not itself sufficient reason to move them. A future authority may reference or derive from these values, but it must not silently duplicate them as competing canonical facts.

These fields remain descriptive. They do not represent current population, stock, prices, production, route traffic, infrastructure condition, guild membership, staffing, services, transactions, or mutable simulation state.

## 6. Later Normalization Candidates

The following are candidates for later review, not approved moves:

| Current settlement data | Possible later owner | Required proof before normalization |
| --- | --- | --- |
| `populationBand`, `populationTotal`, `racialMix` | future population/demography authority | A dedicated authority needs history, composition, or independent reuse that embedded baselines cannot support. |
| `administrativeRole` | future polity/civic authority | Polity, jurisdiction, and government contracts exist and distinguish place description from political control. |
| `economicModel`, `domesticResourceProfile` | future `world.settlement_economies` and resource/commodity authorities | The economy schema decision defines one canonical owner and a non-duplicating transition. |
| `tradeDependencyProfile`, `domesticTradeFlows` | future settlement economy or trade-route overlay | Static economic relationships can be separated from travel topology and runtime trade simulation. |
| `infrastructureProfile` | future placed infrastructure/capability authority | Reusable definitions are connected to authored placed instances without converting settlement identity into construction state. |
| `guildPresence` | future guild/institution presence authority | A presence model needs stable identity or relationships beyond the current descriptive entries. |
| `survivalModel` | future ecology/hazard/population-capacity authority | A later decision proves reusable canonical profiles and resolves settlement-specific authored values. |

Until those conditions are met, the settlement fields remain canonical current-data descriptions. No dual writing, compatibility alias, migration, inferred replacement, or eager normalization is approved.

## 7. Region, Locality, Hex, Parent, and Visual Map Reference Posture

The current geography chain is sufficient:

- `macroRegionId` identifies a continent or island-system region;
- `regionId` identifies the local region/subregion within that macro region;
- `localityBandId` supplies the semantic terrain/locality band;
- `hexAnchorId` supplies the canonical authored world-hex anchor;
- lint enforces that all four references agree and that the hex reciprocally anchors the settlement.

No additional map-feature id, coordinate pair, district id, route node id, or geometry field is required in first-pass settlement authority.

The current parent/dependent posture is sufficient. `parentSettlementId` and `dependencyRole` must remain paired; the parent must exist, be primary, be larger, and share region and macro region. This expresses settlement hierarchy and support dependency only. It does not express political sovereignty, economic ownership, property ownership, route control, service provision, or automatic district membership.

`visualMapRef` remains optional visual/reference support. Its `mapId`, pixel coordinates, climate-zone id, and biome-zone id may support authored rendering and inspection, but pixels do not supersede semantic geography and must not drive pathfinding, travel distance, occupancy, encounters, or simulation. Current universal population of this optional field does not make it mandatory.

## 8. Settlement Type, Site, Terrain, and Profile Vocabulary Posture

Current controlled vocabularies are sufficient for all live settlement records:

- `settlementType` supports 15 values; 14 are currently used. Unused `waystation` remains a valid intentional option.
- `siteClass` supports and currently uses `surface`, `subterranean`, and `underwater`.
- `populationBand`, `administrativeRole`, `dependencyRole`, trade, infrastructure, guild-presence, and related nested enums cover current content.
- `terrainContext` is slug-shaped rather than a schema enum, but lint requires exact equality with the referenced locality's `localityType`; 47 current values therefore remain locality-owned rather than duplicated in the settlement schema.

Do not add speculative types, status fields, profile ids, free-standing district types, placed-site types, service categories, or construction vocabularies. Later hardening should preserve locality-owned terrain vocabulary and existing enum ownership unless live content demonstrates a real gap.

## 9. District, Site, Building, Infrastructure, Workplace, and Service Reference Posture

Do not add district or local-site references directly to settlement records. The relationship direction should be external: a future `world.settlement_districts` or `world.settlement_sites` record may reference its parent settlement. Small settlements must remain valid without districts or placed-site inventories.

Keep existing adjacent authorities separate:

- `civilization.buildings` owns reusable building/facility templates and capability metadata;
- `civilization.infrastructure` owns reusable infrastructure definitions and tier requirements;
- `civilization.workplaces` owns production/workforce semantics;
- sacred-site, religious-hotspot, magic-study, Knowledge, quest, travel, civic, family, NPC/social, economy, crafting, and combat authorities retain their established boundaries.

A future placed site may reference a settlement and, when separately approved, optional district, building, infrastructure, workplace, or specialized authority ids. That future reference must not copy template semantics or infer operation.

Services remain descriptive tags/functions on appropriate templates or future sites. Do not create a service authority or put providers, access rules, stock, prices, transactions, opening state, effects, or UI menus into settlement identity.

## 10. Validation Hardening Direction

Existing schema and validators are adequate and remain unchanged. A later `Version 0.5.230 - Settlement Schema And Validator Hardening` is conditionally appropriate after intervening schema decisions, but it is not pre-approved implementation.

That pass should first re-audit current failures and only strengthen demonstrable gaps. Candidate checks are:

1. preserve strict wrapper/record shape, unique ids/slugs, id/slug coherence, and current required fields;
2. retain region/locality/hex, terrain, site-class, parent/dependency, guild, and domestic-trade coherence;
3. resolve `visualMapRef.mapId`, `climateZoneId`, and `biomeZoneId` against their canonical authorities and enforce known map bounds where authoritative metadata makes that unambiguous;
4. ensure `dependencyRole` remains absent without `parentSettlementId` and that parent chains remain one level and acyclic;
5. consider exact uniqueness within descriptive arrays only where duplicates are semantically invalid and current data proves the rule;
6. preserve rejection of runtime, stateful, executable, migration, alias, and gameplay fields.

Do not harden by moving fields, requiring `visualMapRef`, creating new authorities, adding compatibility behavior, or changing current content solely to satisfy a speculative model.

## 11. Temporary Research Artifact Handling

Delete `docs/dev/tmp-settlement-space-systems-research-2026-06-20.md` in this pass.

Every useful concern has been promoted into permanent authority:

- broad settlement-space ownership and future district/site boundaries are in `docs/design/settlement-authority-boundary-decision.md`;
- exact settlement identity, embedded-field, reference, vocabulary, and validation posture is in this document;
- the future district/site and service decision sequence remains in `docs/design/pipeline-roadmap-consolidation-decision.md`, the roadmap, sequenced plan, and backlog.

There is no remaining consumer for the temporary artifact. Its stale uncertainty about whether `world.settlements` exists makes retention more likely to mislead than assist. Future district/site work must use the permanent decisions and perform a fresh live-repo audit.

## 12. Non-Goals

This decision does not authorize:

- schema, validator, test, content JSON, runtime, UI, storage/save-state, migration, or gameplay changes;
- settlement edits, field moves, collection splits, normalization, aliases, or backwards compatibility;
- district, placed building/site, service, property, construction, economy, population, infrastructure, or guild schemas;
- civic, family, NPC/social, quest, religion, magic, Knowledge, crafting, combat, map, travel, pathfinding, or procedural-generation changes;
- mutable population, economy, market, trade, infrastructure, guild, vendor, service, property, construction, NPC, quest/event, travel, or encounter state;
- transition to `0.6.0`.

## 13. Next Recommended Version

Proceed with `Version 0.5.219 - Recipe And Production Schema Decision`.

That pass remains documentation-only unless separately scoped otherwise. It should use the crafting authority decision and temporary crafting research artifact, preserve the consolidated sequence, and decide the future `crafting.recipes` contract against existing production-chain `recipeProfile` data.

No new GPT Deep Research is required before `0.5.219`. GPT Deep Research gates remain supplemental non-Codex labels and do not consume `0.5.x` version numbers.
