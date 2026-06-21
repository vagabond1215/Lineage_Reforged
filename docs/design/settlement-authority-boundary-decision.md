# Settlement Authority Boundary Decision

Source version/run: Version 0.5.216 - Settlement Authority Boundary Decision
Date: 2026-06-20
Status: approved documentation-only authority boundary; no implementation permission

## 1. Decision Summary

Preserve existing `world.settlements` as the canonical settlement identity and inhabited-place authority. It is not a future collection: 88 live settlement records, a strict schema, semantic validators, region/locality/hex coherence checks, map references, engine consumers, Knowledge/reputation references, creator/UI consumers, and focused tests already depend on it.

Keep settlements world-owned. Defer districts as optional separate future records for settlements that need internal zones; do not embed them into every settlement. Preserve `civilization.buildings` as generic building/facility templates, `civilization.infrastructure` as infrastructure definitions, and `civilization.workplaces` as production/workplace authority. A future placed `world.settlement_sites` layer may reference those templates after a separate decision.

Keep services as descriptive building/site functions first, not a new service authority or execution layer. Keep housing/property anchors static and separate from ownership, inheritance, rent, tax, storage, and player housing state. Civic, guild, institution, religion, sacred-site, magic-study, Knowledge, economy, crafting, NPC, quest, and travel layers reference settlement/place anchors without duplicating their authorities.

Ports, docks, gates, and bridges may later be named settlement-site anchors; travel owns route topology and traversal, while civilization infrastructure owns reusable infrastructure definitions/capability. Exact placement modeling is deferred until the site/infrastructure boundary is decided.

All new first-pass settlement-space records must reject runtime, executable service, construction state, ownership, storage contents, mutable economy/vendor state, journey/pathfinding, quest/event state, NPC schedule, map UI, command, reward, and gameplay fields. Existing descriptive settlement economy, population, infrastructure, guild-presence, and route-access fields remain unchanged pending dedicated ownership decisions.

This document consumes `docs/dev/tmp-settlement-space-systems-research-2026-06-20.md` as planning input, not canon. It changes no schema, validator, content, test, runtime, UI, storage, or behavior.

## 2. Live Repo Reality

Live inspection corrects the temporary research's central ambiguity:

- `packages/content/base/world/settlements.json` exists with 88 records. Eighteen are dependent settlements with `parentSettlementId`; all 88 have region/locality/hex anchors and visual map references.
- `packages/schemas/world/settlement.schema.json` is strict and currently requires identity, macro-region, region, locality, hex, type, site/terrain, population, administrative, descriptive economy/survival/trade/infrastructure, racial-mix, domestic-resource/trade-flow, and guild-presence fields. `visualMapRef`, parent, and dependency fields are optional.
- Content lint validates settlement structure, ids, parent/dependency hierarchy, region/locality/hex coherence, site and terrain support, guild references, and domestic trade partners. Other validators resolve settlement ids for sacred sites, religious hotspots, Knowledge, spawn profiles, travel, quests, and related authorities.
- `world.settlements` is consumed by civilization spatial-world, settlement simulation, institutions, economy, trade/transport, player reputation/geographic knowledge, creator selection, UI presentation, and tests.
- `packages/content/base/civilization/buildings.json` exists with 22 generic records. These define categories, hosted workplace ids, service functions, compatible settlement types, infrastructure requirements, placeability, and optional storage capacity profiles. They do not identify placed buildings or contain settlement ids.
- `packages/content/base/civilization/infrastructure.json` exists with seven reusable infrastructure definitions, construction-policy descriptors, tiers, material/labor requirements, and service outputs. These are not placed infrastructure instances.
- `civilization.workplaces` remains a 58-record production/workforce authority. Workplaces do not become settlement identities or placed building instances.
- No canonical district, ward, neighborhood, placed building, general local-site, service, housing/property-anchor, or player settlement-state collection exists.
- `world.sacred_sites`, `world.religious_hotspots`, and `world.magic_infrastructure` already own specialized named/reference layers and must not be copied into settlement records.
- Settlement simulation derives mutable/development/economy projections from static content. Those projections are runtime state, not additional authored settlement identity.

The temporary report's proposed creation/seed sequence for `world.settlements` is stale. The safe next work is an ownership/schema review of the existing collection.

## 3. Settlement Authority Ownership Boundary

| Concern | Canonical owner | Boundary |
| --- | --- | --- |
| Settlement identity | existing `world.settlements` | Stable inhabited-place identity and world anchors, plus current descriptive fields. |
| Region/locality/hex/map | existing world authorities | Parent physical geography, semantic placement, and optional visual reference. |
| District/ward | future optional world authority | Internal authored zone identity for settlements that need it; deferred. |
| Building/facility template | existing `civilization.buildings` | Reusable capability/template, not a placed structure. |
| Placed local structure/site | future `world.settlement_sites`, if approved | Named physical anchor linked to settlement and optional templates/authorities. |
| Infrastructure definition | existing `civilization.infrastructure` | Reusable infrastructure type/tier requirements; not construction instance state. |
| Workplace | existing `civilization.workplaces` | Production/workforce semantics; may be hosted/referenced by building/site layers. |
| Service descriptor | existing building/service tags initially | Descriptive availability/capability only. |
| Property/housing | future static place anchors plus separate runtime/property owners | Physical identity is not ownership, storage, rent, or transfer. |
| Settlement runtime | existing/future engine/save owners | Mutable economy, population projections, construction, occupancy, services, state, and history. |

References never imply ownership, access, occupancy, operation, service execution, construction, travel, or state mutation.

## 4. Settlement Identity Boundary

`world.settlements` remains the settlement identity owner under `world`, not `civilization`, `travel`, or `economy`. Settlements are places first. Civilization, travel, economy, crafting, NPC, family, quest, and other systems consume their ids.

Settlement identity may own stable id/slug/name, settlement type, site/terrain context, region/locality/hex anchors, parent/dependency posture, administrative role, summary/site context, descriptive tags, and current authored descriptive profiles. The existing schema's population totals, economy/survival/trade/infrastructure profiles, racial mix, domestic flows, guild presence, and optional visual map reference remain live and unchanged.

Those embedded fields are current-data authority, not permission to expand settlement records indefinitely. Future settlement-economy, civic, population, guild-presence, or infrastructure decisions must explicitly resolve overlap before moving or duplicating them. No migration, alias, compatibility layer, or schema split is authorized here.

Settlement records must not own current player location beyond being referenced, current occupants, NPC schedules, vendor stock, construction progress, property ownership, storage contents, active quests/events, map UI state, or service execution.

## 5. Region, Locality, Map, and Travel Anchor Boundary

Canonical semantic placement remains the existing `macroRegionId`, `regionId`, `localityBandId`, and `hexAnchorId` chain, with lint-enforced coherence. Parent settlement dependencies add settlement hierarchy but do not replace physical geography.

`visualMapRef` remains optional visual/reference support. Pixel coordinates do not supersede region/locality/hex authority and must not become pathfinding, distance, occupancy, or simulation coordinates.

World maps, map features, hexes, edges, and travel networks retain their existing owners. A settlement id may be a route endpoint, spawn context, Knowledge location, or UI selection without making the settlement record owner of route topology, travel time, map discovery, pathfinding, or encounter selection.

## 6. District, Ward, Neighborhood, and Layout Boundary

Defer districts, wards, neighborhoods, quarters, and other internal layout zones as optional separate future records. Do not require them for all settlements, do not create an implicit district record for every settlement, and do not embed district arrays into current settlement records.

A future `world.settlement_districts` authority may be justified for large towns/cities where stable named internal zones support several placed sites. It may later own identity, parent settlement, descriptive type/tags, summary, and optional non-runtime anchor/bounds posture.

Districts must not own current population, NPC occupancy, crime/security, wealth, property ownership, services, pathfinding graphs, discovery, construction, events, or map UI state. Small settlements may remain district-free.

## 7. Building, Facility, and Local Site Boundary

Preserve `civilization.buildings` as generic building/facility templates. Their hosted workplace ids, service functions, compatible settlement types, infrastructure requirements, placeability, and storage-capacity descriptors remain reusable capability metadata, not placed structures.

Defer authored placement to a later separate `world.settlement_sites` decision after the settlement identity schema review. That future authority may cover named buildings, facilities, ordinary religious/civic/guild spaces, housing anchors, landmarks, docks, gates, bridges, and other important local sites. It should reference a settlement, optional district, and optional building/infrastructure/workplace/specialized authority rather than copy their semantics.

Do not add a placed-building/site collection, fields, schema, or content in this pass. Ordinary unnamed building stock remains unmodeled or runtime/generated later.

## 8. Service, Vendor, and Access Point Boundary

Keep services as descriptive functions/tags on current building templates and future placed site anchors. Do not create a separate `civilization.services` authority in the first settlement-space pass.

A later service decision is warranted only if stable service identity, provider-independent rules, or reuse across several site types cannot be represented safely by controlled descriptors. Service tags may describe lodging, market, smithing, repair, ferry, training, healing, civic, religious, guild, library, stable, or storage capability without executing it.

Runtime/NPC/economy owners retain provider availability, opening state, access checks, stock, prices, discounts, transactions, healing/repair/training effects, storage/banking contents, legal/reputation gates, appointments, menus, and history.

## 9. Workplace, Economy, Crafting, and Production Boundary

`civilization.workplaces` remains the workplace/workforce/production authority. `civilization.buildings` may host workplace ids; a future placed site may reference a building template and hosted workplace capability. Settlement records and sites must not copy workforce jobs, tool requirements, production inputs/outputs, upgrades, recipes, or production rules.

Existing settlement economic/trade/infrastructure descriptors and civilization runtime projections remain unchanged. Future `world.settlement_economies`, market profiles, resources/commodities, crafting recipes, and production normalization require their own decisions.

Settlement-space records must not run production ticks, consume inputs, create outputs, resolve crafting, mutate stock/prices/markets, assign workers, create vendors, pay wages, or execute transactions.

## 10. Housing, Household, Estate, and Player Property Boundary

Housing, farmsteads, manors, shops-with-residences, rooms, workshops, warehouses, and estates may later exist as static settlement-site/property anchors. Their physical identity and location remain separate from the person/household/family/estate/property owner.

Future households, families, estates, and property records may reference placed site ids after those authorities exist. A site reference must not infer residents, owners, tenants, heirs, storage rights, or access.

Current ownership, tenancy, inheritance, transfer, rent, tax, liens, upgrades, construction, damage, storage contents, inventory, player housing, permissions, income, and disputes remain future runtime/save/family/economy/property state.

## 11. Civic, Law, Faction, Guild, and Institution Space Boundary

Future settlement sites may physically anchor town halls, courts, guardhouses, barracks, prisons, guildhalls, faction offices, academies, embassies, and other institution spaces. They must reference canonical civic, faction, guild, institution, government, jurisdiction, or law authorities rather than duplicate identity or rules.

Existing settlement `administrativeRole`, identity/purpose tags, and `guildPresence` remain descriptive current fields. They do not execute government, membership, office, law, or services.

Settlement-space content must not mutate legal status, wanted/bounty state, faction/guild standing, reputation, offices, guard response, arrests, courts, diplomacy, public order, membership, rank, access, services, or rewards.

## 12. Religion, Sacred Site, Magic Study, and Knowledge Space Boundary

Ordinary temples, shrines, monasteries, libraries, archives, schools, laboratories, and ritual rooms may later be building templates or placed settlement sites. Specialized authorities remain separate:

- `world.religious_hotspots` owns religious concentration/context;
- `world.sacred_sites` owns canonical named sacred-site identity;
- `world.magic_infrastructure` owns current magic-infrastructure descriptors;
- future magic-study sources/policies own study authority;
- Knowledge registries/snippets/evidence/progress own informational authority and player knowledge state.

Settlement/site records may reference those ids after supported contracts exist. They must not grant favor/alignment, religion membership, spell access/ownership/readiness, study progress, trial completion, Knowledge progress, rituals, healing, services, or rewards.

## 13. Quest, Event, Chronicle, Rumor, and Storylet Boundary

Settlement and future site ids may provide stable authored locations for quests, contracts, events/storylets, rumors, dialogue, Chronicle subjects, and notice/task boards. Existing narrative authorities retain their content and runtime boundaries.

Location references must not accept/start/complete quests, progress objectives, refresh boards, execute events, propagate rumors, write Chronicle entries, reveal maps, grant rewards, mutate reputation/legal state, or persist player history.

Quest-giver names, board descriptors, and narrative prose do not establish buildings, services, people, or placed sites by inference.

## 14. Travel, Port, Gate, Bridge, Route, and Infrastructure Boundary

Named ports, docks, ferries, gates, bridges, waystations, and similar structures may later be placed settlement-site anchors when their local physical identity matters. They should reference approved building or infrastructure definitions where available.

Travel authority owns routes, edges, modes/lanes, route endpoints, traversal, travel time, pathfinding, security/hazards, discovery, journey state, encounters, and UI. A local anchor does not become a route graph node automatically; the travel contract must opt into it.

`civilization.infrastructure` retains reusable infrastructure definitions, tiers, construction requirements, and service outputs. Settlement `infrastructureProfile` retains current descriptive capability levels. Future placed infrastructure, construction instances, damage/repair state, and ownership require a dedicated boundary after settlement sites are decided.

## 15. Player Settlement Runtime State Boundary

Runtime/save owners retain current player location, known/discovered settlements/sites, local map reveal, current population/development/economy projections, construction and damage state, property/housing, ownership/tenancy, storage contents, services/vendors, NPC presence/schedules, shops/markets, current quests/events/rumors, travel/pathfinding, and settlement history.

Existing civilization settlement simulation, economy, institutions, trade/transport, reputation/geographic knowledge, and creator/UI consumers remain unchanged. Their derived state and presentation do not become static settlement fields.

All new first-pass settlement, district, or site records must reject current actors/occupants, schedules, stock, prices, transactions, construction progress, owner/tenant, rent/tax payments, storage/inventory contents, active services, active quests/events, discovery flags, route/path state, UI selection, commands, events, rewards, persistence, or gameplay execution.

## 16. First Implementation Candidate

The first candidate is an ownership and hardening review of the existing `world.settlements` contract, beginning with `Version 0.5.217 - Settlement Identity Schema Decision`.

That pass must decide which existing fields are intrinsic settlement identity/place descriptors, which remain current embedded descriptive authority, which are candidates for later economy/civic/infrastructure/population normalization, how parent/dependent settlements remain modeled, and what future district/site references may eventually be admitted.

It must audit the live schema and validators rather than propose a new settlement collection or seed. It must not change schemas, validators, content, tests, loaders, migrations, aliases, runtime, UI, storage, or behavior.

## 17. Future Validation Direction

Future approved validation should preserve or strengthen:

1. strict wrappers, unique ids/slugs, and controlled settlement types/tags;
2. macro-region, region, locality, hex, site-class, and terrain coherence;
3. optional visual map references within known map/climate/biome authority without making pixels simulation-authoritative;
4. parent/dependent settlement existence, size, role, and geography coherence;
5. explicit ownership for embedded population/economy/trade/infrastructure/guild fields before any normalization;
6. optional district parent settlement coherence if districts are later approved;
7. placed site parent settlement/district, building-template, infrastructure, workplace, and specialized-authority references if later approved;
8. controlled service descriptors without execution fields;
9. no duplication of workplaces, guilds, sacred sites, civic/religion/magic/Knowledge, routes, quests, or property authorities;
10. rejection of service execution, vendor/market state, construction state, ownership/tenancy, storage/inventory contents, mutable economy, NPC schedules, quest/event/Chronicle state, travel/pathfinding, map UI, runtime, command, reward, or gameplay fields.

This is validation direction only. No schema, validator, or test change is approved here.

## 18. Temporary Research Artifact Handling

`docs/dev/tmp-settlement-space-systems-research-2026-06-20.md` was consumed as planning input and remains temporary, not final canon. This permanent document supersedes its authority decisions and corrects its stale assumption that `world.settlements` might not exist.

Keep the artifact through `Version 0.5.217 - Settlement Identity Schema Decision` because it retains district, site, service, housing/property, civic/religious, infrastructure, travel-anchor, runtime, and sequencing questions. That run must delete it if all useful guidance is promoted, or retain it only with a named next concrete consumer and removal condition.

## 19. Non-Goals

- no schema, validator, content JSON, test, Knowledge registry, or snippet changes;
- no economy, crafting, item/equipment, combat, quest, magic, NPC/social, travel, geography, religion, family, or civic authority changes;
- no district, building-placement, settlement-site, service, property, infrastructure-instance, compatibility, migration, or seed implementation;
- no runtime, UI, storage, service execution, vendor stock, market mutation, NPC schedule, construction, ownership transfer, rent/tax payment, property/player-housing state, inventory/storage contents, quest-state mutation, event execution, Chronicle writing, travel/pathfinding, map UI, command, event, reward, or gameplay behavior;
- no transition to `0.6.0`.

## 20. Next Recommended Version

`Version 0.5.217 - Settlement Identity Schema Decision`

The already recommended `Version 0.5.215 - Recipe And Production Schema Decision`, `Version 0.5.213 - Monster Record Schema Decision`, and `Version 0.5.210 - Weapon And Armor Profile Schema Decision` remain valid if unlanded. The displaced Quest Objective And Condition Schema Decision also remains valid and deferred.
