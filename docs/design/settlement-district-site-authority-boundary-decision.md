# Settlement District And Site Authority Boundary Decision

Source version/run: Version 0.5.252 - Settlement District And Site Authority Boundary Decision
Date: 2026-06-28
Status: approved documentation-only authority boundary; no implementation permission

## 1. Decision Summary

Approve separate future static authored authorities for settlement districts and placed settlement sites, but do not create schemas, validators, content files, lint registration, runtime behavior, UI, storage, commands, events, rewards, migrations, or gameplay behavior in this run.

`world.settlements` remains the canonical settlement identity authority. It owns settlement id, slug, name, settlement type, broad region/locality/hex anchoring, site class, terrain context, summary, site context, role, current descriptive profiles, and non-executing identity. It must not grow ad hoc district arrays or placed-site inventories.

Future districts, if approved, should live in a separate optional collection such as `packages/content/base/world/settlement_districts.json`. Future placed sites, if approved, should live in a separate optional collection such as `packages/content/base/world/settlement_sites.json`. These paths are candidate future paths only.

Building, workplace, infrastructure, settlement economy, route/travel, map/visual, Knowledge, sacred-site, religious-hotspot, runtime, and UI systems may reference districts or sites later only through explicit contracts. They must not create district/site authority by inference.

## 2. Current Authority Inventory

Current local inspection confirms:

- `packages/content/base/world/settlements.json` exists with 88 live settlement records and 18 dependent settlements.
- The settlement schema has `siteClass` and `siteContext` identity fields, but no district, ward, placed-building, service-instance, or placed-site record fields.
- `packages/schemas/world/settlement.schema.json` remains the strict live settlement contract.
- `packages/schemas/world/settlement-economy.schema.json` exists for future descriptive settlement-economy records; no live settlement-economy content file is created by this decision.
- `civilization.buildings`, `civilization.infrastructure`, and `civilization.workplaces` are reusable template/definition authorities, not placed settlement instances.
- `packages/shared/types/src/contracts.ts` and `packages/shared/types/src/settlement-institutions.ts` contain runtime-derived district, plot, building, property, religion, magic, and access state. Those projections are not static authored district/site content authority.
- `packages/content/base/world/map_features.json` exists from `0.5.251` with exactly `map_feature.windward_spine` and `map_feature.thalos_run`; it is unrelated to district/site placement.

## 3. District Definition

A settlement district is a stable authored intra-settlement area or zone used when a settlement is large or complex enough to need internal place identity.

Future examples may include:

- market quarter;
- harbor ward;
- temple quarter;
- palace or citadel ward;
- craft district;
- farm fringe;
- gate district;
- riverfront district;
- noble terrace;
- outer camp or sprawl.

A district is not a building, route node, property ledger, service provider, exact map polygon, NPC schedule area, runtime population bucket, UI panel, or quest trigger. Small settlements may remain district-free.

## 4. Placed Site Definition

A placed settlement site is a discrete authored point-of-interest, facility, landmark, or local anchor within or adjacent to a settlement.

Future examples may include:

- named market;
- palace or citadel;
- gatehouse;
- dock or wharf;
- shrine or temple compound;
- guildhall;
- mill;
- bridgehead;
- caravanserai;
- workshop cluster;
- civic hall;
- landmark plaza.

A placed site is not a generic building template, building simulation output, inventory/storage state, NPC ownership record, quest state, runtime access-control state, exact coordinate, pathfinding node, service availability calculation, spawned encounter, UI marker state, or discovery/unlock state.

## 5. Ownership Matrix

| Authority | Owns | Does not own |
| --- | --- | --- |
| `world.settlements` | Settlement identity, broad place anchors, settlement type, site class, terrain context, summary, site context, current descriptive settlement profiles. | District identity, placed site identity, building inventories, service inventories, route topology, runtime state, UI placement. |
| Future `world.settlement_districts` | Optional authored district identity, parent settlement reference, district type/tags, summary, source notes, lifecycle. | Coordinates, polygons, pathfinding, population simulation, property ownership, services, law/tax/control, quests, Knowledge unlocks, gameplay effects. |
| Future `world.settlement_sites` | Optional authored placed site identity, parent settlement reference, optional district reference, site type/tags, summary, source notes, lifecycle. | Building simulation output, stock/storage, NPC ownership, quest state, access execution, exact coordinates, pathfinding costs, service calculations, encounters, UI marker state. |
| Settlement economy content | Descriptive economic role, market posture, industry and item posture where explicitly authored. | Canonical district/site identity, placed buildings, exact services, prices, stock, trade execution, property, tax, runtime economy. |
| Building/workplace content | Generic building/facility templates, placeability metadata, hosted workplace capability, workforce/production definitions. | Canonical placed site instances, named local sites, settlement-specific building inventories, runtime operation. |
| Region/region-locality content | Broad geography, terrain, locality context, resource and settlement suitability support. | Intra-settlement district/site placement or identity. |
| Route/travel content | Routes, lanes, modes, endpoints, traversal, travel estimates, security/hazard/travel context. | District/site identity, local street layout, pathfinding inside settlements, automatic access to placed sites. |
| Map/visual geometry content | Visual/reference map layers, pixels, regions, features, optional settlement visual refs. | Authoritative district/site coordinates, local geometry, UI marker state, placement proof by itself. |
| Knowledge snippets/evidence | Informational discovery text and player knowledge progression. | Canonical district/site creation, site status, access, rewards, or unlock behavior. |
| Sacred site / religious hotspot authorities | Specialized religious place/context identity where explicitly authored. | Generic settlement district/site authority or ordinary temple/shrine placement. |
| Runtime/UI/storage/gameplay systems | Derived simulation state, presentation, interaction, persistence, commands, events, rewards, effects. | Static authored district/site canon. |

## 6. Building, Workplace, Service, Economy, Placement, Travel, and Knowledge Boundaries

Building/workplace compatibility belongs to generic civilization content. A future site may reference a building template or workplace capability, but that reference must not copy production rules, jobs, tools, service execution, storage profiles, stock, prices, or runtime availability.

Settlement economy content may describe durable economic posture. It must not author canonical districts/sites unless a later schema explicitly decides a reference contract.

Map and visual placement may support display or non-authoritative reference notes only. Pixels, visual labels, climate zones, biome zones, and geometry do not create districts or sites.

Route/travel access may support context, but route endpoints, travel estimates, lanes, pathfinding, discovery, journey state, and encounter selection stay with travel owners.

Knowledge snippets may describe facts about districts or sites after those authorities exist. They must not create authority or grant discovery, access, services, or rewards by themselves.

## 7. Forbidden Inference Sources

Future districts/sites must not be inferred from these alone:

- settlement summaries;
- settlement administrative roles;
- settlement economic roles;
- building compatibility lists;
- workplace requirements;
- site class tags;
- route/travel adjacency;
- map pixels or coordinates;
- region/locality proximity;
- visual labels or geometry;
- Knowledge snippets;
- quest metadata;
- sacred-site or religious-hotspot prose;
- runtime/demo snapshots;
- generated operators;
- generic fantasy naming.

A future candidate district/site requires explicit authored support in current content or a future approved seed plan.

## 8. Future Schema Split Recommendation

Split future schema planning into two authorities:

1. `world.settlement_districts`
   - candidate content path: `packages/content/base/world/settlement_districts.json`;
   - candidate schema path: `packages/schemas/world/settlement-district.schema.json`;
   - likely id pattern: `settlement_district.<settlement_slug>.<district_slug>`.

2. `world.settlement_sites`
   - candidate content path: `packages/content/base/world/settlement_sites.json`;
   - candidate schema path: `packages/schemas/world/settlement-site.schema.json`;
   - likely id pattern: `settlement_site.<settlement_slug>.<site_slug>`.

Districts should be optional and parented by settlement. Sites should be optional and parented by settlement, with optional district references only after district authority exists. Do not embed reverse arrays into `world.settlements`.

Recommended next sequence:

1. `Version 0.5.253 - Settlement District Schema Plan`
2. `Version 0.5.254 - Settlement Site Schema Plan`
3. `Version 0.5.255 - First Settlement District Content Seed Plan`
4. `Version 0.5.256 - First Settlement Site Content Seed Plan`

Schema/validator implementation and live content creation remain separate future approvals. If the schema plans find unresolved blockers, they should defer content seed planning rather than invent canon.

## 9. Future Seed-Readiness Rules

Future district/site seed plans must prove:

- the parent settlement exists and remains current under `world.settlements`;
- the candidate is explicitly named or explicitly typed by durable authored evidence;
- the candidate is not merely a runtime-derived district, plot, building, business, property, service, or UI artifact;
- building/workplace/infrastructure references, if any, point to existing reusable authorities and do not copy their fields;
- sacred-site, religious-hotspot, magic-infrastructure, guild, civic, route, economy, Knowledge, quest, or NPC references are optional and non-owning;
- no coordinates, polygons, pathfinding, service execution, stock, ownership, access control, quest state, discovery state, reward, command, event, UI, storage, or gameplay behavior is included.

## 10. Migration And Non-Migration Notes

No existing settlement, region, locality, map-feature, building, workplace, infrastructure, route/travel, Knowledge, sacred-site, religious-hotspot, schema, validator, or runtime file changes are authorized here.

Do not migrate `siteClass` or `siteContext` into future placed sites. They are settlement identity fields. Do not migrate runtime-derived `SettlementDistrictState`, `SettlementPlotState`, or `SettlementBuildingState` into static content. They are deterministic simulation/projection state.

If future districts/sites become live content, they must be additive and current-data-first. Do not add backwards-compatibility aliases, migrated-id compatibility, old-save preservation, or indefinite dual ownership unless explicitly requested by a later compatibility prompt.

## 11. Validation Expectations For Future Schema Plans

Future schema plans should require validators to enforce:

- strict `{ "records": [...] }` wrappers;
- id/slug coherence;
- unique ids and slugs within each collection;
- current parent settlement resolution;
- district parent-settlement coherence;
- site parent-settlement and optional parent-district coherence;
- controlled lifecycle values such as `planned`, `active`, and `retired`;
- controlled type vocabularies conservative enough for first-pass content;
- duplicate-free tags, aliases, references, and notes where used;
- no settlement identity duplication beyond the required parent reference;
- no inferred building/workplace/service/economy/travel/Knowledge authority;
- rejection of coordinates, polygons, pathfinding, runtime, UI, storage, command, event, reward, and gameplay fields.

## 12. Explicit Non-Goals

- no schema, validator, content JSON, content-lint registration, or tests;
- no settlement, region, locality, map-feature, building, workplace, infrastructure, route/travel, Knowledge, sacred-site, or religious-hotspot content edits;
- no district/site seed records;
- no visual geometry, coordinates, map markers, or UI placement;
- no runtime, storage, command, event, reward, migration, save/account, or gameplay behavior;
- no service execution, vendor stock, ownership, tax/law/control rules, NPC schedules, quest triggers, discovery state, or Knowledge unlocks;
- no transition to `0.6.0`.

## 13. Next Recommended Version

`Version 0.5.253 - Settlement District Schema Plan`

That run should remain docs-first. It should decide the exact future `world.settlement_districts` schema posture without creating schemas, validators, content, lint registration, runtime behavior, UI, storage, commands, events, rewards, migrations, or gameplay behavior unless a newer prompt explicitly changes scope.
