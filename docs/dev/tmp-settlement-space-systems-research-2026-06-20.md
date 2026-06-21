# Temporary Deep Research: Settlements, Buildings, Districts, Services, Housing, Facilities, Infrastructure, and Settlement-Space Authority

Status: temporary research artifact for Codex planning
Date: 2026-06-20
Source: Deep Research Light run from the user-provided settlement-space specification.
Intended use: staging reference for a later narrow Codex planning pass.

> Temporary-file policy: this file is not final design canon. It should either be converted into one or more permanent `docs/design/**` decision documents or deleted after the relevant Codex planning passes land.

## 1. Executive Summary

The research pass examined settlement-space authority, buildings, districts, services, housing, facilities, civic/religious/guild spaces, local infrastructure, travel anchors, workplace placement, property anchors, quest/event locations, and settlement runtime boundaries.

The report concludes that settlement-space content should be treated as a world/place authority problem before any schema implementation. Settlement records should define stable inhabited places and their map/region anchors. Subordinate layers may later define districts/wards, buildings/facilities, service anchors, housing/property anchors, civic/religious/guild spaces, and local infrastructure. Static content must not execute services, simulate population, mutate markets, own vendor stock, run construction, transfer property, store player housing state, execute NPC schedules, trigger quests/events, or drive travel/pathfinding/runtime behavior.

Recommended next Codex pass:

`Version 0.5.216 - Settlement Authority Boundary Decision`

That pass should be documentation-only, should inspect the live repo again, should correct any stale assumptions in this temporary report, and should not implement schemas, validators, content, tests, runtime settlement behavior, map/UI, services, vendors, construction, storage, property, or gameplay behavior.

## 2. Research Scope Note

This artifact is about settlement-space authority and local infrastructure. It should not replace or absorb economy, crafting, travel, civic, family, NPC/social, sacred-site, quest/event, or runtime-state decisions.

Adjacent systems may reference settlements, districts, buildings, workplaces, services, or local sites, but each adjacent system must retain its own authority:

- economy owns settlement economies, market values, prices, stock, and transactions;
- crafting owns future recipes and references workplaces/stations descriptively;
- travel owns travel networks, route runtime, hazards, pathfinding, encounter selection, and map discovery;
- civic owns polity/law/jurisdiction/public-order authority;
- family owns future households/kinship/estate facts;
- NPC/social owns people, NPC overlays, schedules, dialogue, relationships, rumors, and runtime social state;
- religion/sacred-site/magic-study/Knowledge own their own sacred, study, and information authorities;
- quests/events/Chronicles own authored narrative references and runtime state separately.

## 3. Current Repo-State Findings From Research

### Confirmed or strongly indicated by the report

- The repo has a world map layer with pixel coordinates used as canonical anchors for settlements, regional geometry, and authored travel routes.
- Existing world-map content describes settlement logic based on rivers, fertility, forests, mountains, marginal lands, and navigable seas.
- Existing travel content includes canonical layers such as world maps, hexes, hex edges, travel networks, encounter templates, and spawn profiles.
- Existing civilization content includes workplaces and production chains that already model facilities, input/output profiles, workforce, tools, and production-stage references.
- Existing crafting authority work selected future `crafting.recipes` while preserving existing civilization production chains and workplaces.
- Existing economy authority work selected future `world.settlement_economies` as a first implementation candidate.
- Existing family authority work selected future `civilization.households` and deferred property transfer, inheritance, full player heirs, and legacy continuation.
- Existing civic authority work selected future `world.polities` and kept law/status/public-order descriptive-only.
- Existing sacred-site planning keeps named sacred sites separate from religious hotspots and physical settlement/building authority.

### Findings requiring live verification

The report made several claims that Codex must verify before permanent docs:

- Whether `packages/content/base/world/settlements.json` currently exists or is only implied by scripts/backlog/docs.
- Whether settlement records are already strict live content or absent.
- Whether any existing settlement data already has map anchors, region ids, locality ids, or economy references.
- Whether buildings, districts, local sites, POIs, housing, estates, civic buildings, religious buildings, guild halls, roads, docks, ports, gates, bridges, or walls already have dedicated content authorities.
- Whether `civilization.workplaces` already has settlement/place anchors or only abstract facility authority.
- Whether quests, travel routes, Knowledge snippets, sacred sites, NPC/social docs, or economy records already reference settlement ids that can be validated.
- Whether content-lint already validates settlement/place/building/service references.

### Unverified or potentially stale assumptions

The report sometimes states that the repo lacks a central settlement table while also noting script/backlog signals implying one. Treat those claims as unverified until Codex inspects the live checkout.

## 4. Current Gaps And Risks

### 4.1 Settlement identity gap

If there is no current `world.settlements` authority, then quests, economy, travel, NPCs, Knowledge, crafting, and services cannot reliably validate settlement references.

### 4.2 Building/facility anchor gap

Workplaces and services need spatial anchors, but there may not yet be a canonical building/facility/local-site authority. Without one, quest locations, vendors, NPC homes/workplaces, temples, guildhalls, markets, docks, gates, and workshops may be described ad hoc.

### 4.3 District/layout ambiguity

Districts, wards, neighborhoods, quarters, docksides, markets, temple districts, craft districts, farmland outskirts, and defensive zones are not clearly separated from settlements or localities. First-pass decisions must decide whether districts are separate records, embedded sections, or deferred.

### 4.4 Overlap with workplaces and sacred sites

`civilization.workplaces` already owns production/workplace facilities, and `world.sacred_sites` owns named sacred-site identity. Settlement buildings must not duplicate those authorities. A building can anchor or reference a workplace or sacred site, but it must not absorb their semantics.

### 4.5 Runtime-state leakage risk

Settlement-space content is vulnerable to runtime leakage: population counts, taxes, rent, ownership, construction progress, vendor stock, service access, NPC schedules, storage contents, quest boards, board refreshes, events, map UI, and pathfinding must remain outside static records.

### 4.6 Service/vendor ambiguity

Services and vendors are likely anchored by buildings/facilities, but transactions, prices, stock, discounts, reputation gates, legal access, and UI state remain economy/NPC/runtime owners.

### 4.7 Housing/property ambiguity

Static homes, estates, workshops, farms, manors, and rented rooms may be place anchors, but ownership, transfer, inheritance, rent, taxes, storage, upgrades, and player housing state are runtime/family/economy/property concerns.

## 5. Recommended Settlement / Building / Facility Hierarchy

Recommended hierarchy:

```text
World Map / Region / Locality
  -> Settlement
    -> District / Ward / Neighborhood (optional early; likely separate later)
      -> Building / Facility / Local Site
        -> Service Anchor / Workplace Anchor / Household Anchor / Institution Anchor

Adjacent Static References
  -> Economy / Settlement Economy
  -> Civilization Workplace / Guild / Institution
  -> Sacred Site / Religion / Magic Study / Knowledge
  -> Travel Network / Port / Gate / Route Anchor
  -> Quest / Event / Chronicle / Rumor Hook

Runtime / Save State Later
  -> Construction State
  -> Ownership / Rent / Tax / Property Transfer
  -> Vendor Stock / Transactions / Service Execution
  -> NPC Location / Schedule Execution
  -> Player Housing / Storage Contents
  -> Quest/Event/Chronicle State
  -> Map/UI/Travel/Pathfinding State
```

## 6. Settlement Authority Model

A settlement authority should own stable inhabited-place identity and map/region anchoring.

A future settlement record may own:

- stable id/slug/name;
- status;
- settlement type such as hamlet, village, town, city, fortress, port, outpost, monastery-settlement, or ruin if canon-supported;
- map anchor coordinates or canonical map anchor reference;
- parent region/locality references;
- summary;
- broad tags such as port, river, walled, market, frontier, agricultural, mining, sacred, civic, or craft center;
- descriptive notes and sourceAuthorityNotes.

A settlement record must not own:

- current population simulation;
- mutable economy state;
- current imports/exports/stock/prices;
- vendor inventory;
- taxes/rents/payments;
- ownership transfers;
- quest/event state;
- NPC schedule state;
- construction progress;
- storage contents;
- pathfinding/travel-time state;
- map UI state;
- service execution;
- runtime gameplay fields.

## 7. District, Ward, Neighborhood, And Layout Boundary

Districts are useful for larger towns and cities, but first-pass work should decide whether they are immediate records or deferred.

Districts may later own:

- id/slug/name/status;
- parent settlement id;
- type/category such as residential, market, harbor, craft, temple, civic, noble, industrial, agricultural, defensive, or outskirts;
- summary;
- building references or district-to-building membership posture;
- optional local anchor/bounds descriptors if approved.

Districts must not own:

- active NPC occupancy;
- pathfinding graph state;
- service transactions;
- crime/security runtime;
- wealth/reputation mutation;
- event progress;
- map discovery state.

Small settlements may not need districts. The boundary decision should permit either a single implicit general district or deferred district records to avoid over-modeling small villages.

## 8. Building, Facility, And Local Site Boundary

A future building/facility/local-site authority should define important settlement-space anchors.

Building/facility records may later own:

- id/slug/name/status;
- parent settlement id;
- optional district id;
- building/facility/site type;
- service tags or service-anchor descriptors;
- workplace id reference if this physical anchor hosts a `civilization.workplace`;
- household/estate/guild/religion/civic/sacred-site reference posture where approved;
- local map anchor if approved;
- summary/sourceAuthorityNotes/notes.

They must not own:

- vendor stock;
- service execution;
- prices/discounts;
- current staff;
- NPC schedule execution;
- construction state;
- current ownership;
- storage contents;
- inventory/container state;
- quest boards refresh;
- event runtime;
- player property state;
- UI state.

Potential building/facility/local-site examples:

- homes, cottages, apartments, farmsteads;
- shops, inns, taverns, markets, stalls;
- smithies, mills, kilns, workshops, warehouses, shipyards;
- town halls, courts, guardhouses, barracks, gates, watchtowers;
- temples, shrines, monasteries, ritual spaces;
- guildhalls, offices, academies, libraries;
- docks, harbors, ferries, bridges, wells, granaries;
- notice boards, task boards, contract boards as local anchors if approved later.

## 9. Service And Vendor Boundary

Service availability can be described by buildings or future service descriptors. Runtime owns actual service execution.

A static service anchor may describe:

- service category such as inn, lodging, smith, repair, market, ferry, temple, healer, trainer, scribe, stable, port, guild, civic office, legal office, magic study, library, or storage if canon-supported;
- service provider reference posture, if NPC/social authority exists;
- service building/facility anchor;
- summary and notes.

Static service anchors must not execute:

- stock generation;
- transactions;
- prices/discounts;
- reputation/legal/faction gates;
- healing or repair effects;
- storage/banking runtime;
- training or spell/Knowledge grants;
- quest progress;
- UI/service menus.

## 10. Housing, Households, Estates, And Player Property Boundary

Housing and property should separate static place identity from ownership and storage state.

Static settlement-space content may define:

- homes, cottages, shops-with-living-space, apartments, farms, manors, estates, rented-room anchors, workshops, businesses, and storage-building anchors;
- descriptive property type and settlement/district location;
- optional future household reference posture.

Runtime/family/economy/property owners retain:

- current owner/tenant;
- inheritance;
- property transfer;
- player ownership;
- rent/taxes/payments;
- upgrades/construction progress;
- storage contents;
- estate income;
- legal disputes;
- access permissions.

## 11. Civic, Law, Faction, Guild, And Institution Spaces

Settlement-space content may define physical anchors for civic and institutional spaces, but not their legal or political behavior.

Possible anchors:

- town halls;
- courts;
- guardhouses;
- barracks;
- gates;
- watch posts;
- prisons only if canon-supported;
- guildhalls;
- faction offices;
- schools, academies, administrative buildings;
- embassies if canon-supported.

Civic/faction/guild/institution spaces must not mutate:

- legal status;
- wanted/bounty state;
- faction standing;
- reputation/favorability;
- guard response;
- arrests/courts;
- services/rank access;
- diplomacy/conflict state.

## 12. Religion, Magic, Knowledge, And Sacred Spaces

Settlement-space content may anchor ordinary religious or magical buildings, but it must preserve dedicated sacred-site and magic-study authorities.

Recommended split:

- ordinary temple/shrine/monastery/library/academy building: building/facility/local-site authority;
- named pilgrimage-grade sacred site: `world.sacred_sites` authority;
- religious hotspot/cluster: `world.religious_hotspots` authority;
- magic study source: future magic-study authority;
- Knowledge archive/lore subject: Knowledge authority.

Buildings may reference religious, sacred-site, magic-study, or Knowledge ids only after those reference contracts are approved. They must not grant favor, spell access, study progress, trial completion, Knowledge progress, healing effects, or ritual outcomes.

## 13. Travel, Routes, Ports, Gates, And Infrastructure Boundary

Settlements are map/travel anchors, but travel stays travel-owned.

Static settlement-space content may define:

- map anchor;
- port/dock/ferry/gate/bridge/waystation local anchors;
- settlement travel tags like river, coast, port, road, mountain pass, frontier, caravan, or ferry if approved;
- local landmarks useful for navigation.

Travel/runtime owns:

- actual routes/edges;
- route mode/lane semantics;
- travel time;
- pathfinding;
- map discovery;
- weather effects;
- route security;
- encounter spawning;
- travel UI;
- player journey state.

## 14. Economy, Crafting, Production, And Workplace Integration

Settlement-space records should anchor economy/crafting places but not execute economy/crafting behavior.

Potential references:

- workplace ids for hosted facilities;
- future settlement-economy ids;
- market-profile ids if approved;
- crafting station/workplace anchors;
- production facility anchors;
- warehouses, material yards, farms, mills, shipyards, workshops, markets.

Static settlement-space records must not own:

- production ticks;
- stock quantities;
- prices;
- workforce state;
- service transactions;
- crafting execution;
- recipe runtime;
- settlement supply/demand state;
- market mutation.

## 15. Quest, Event, Chronicle, And Storylet Integration

Settlement-space content should provide canonical place anchors for narrative systems.

Allowed descriptive uses:

- quest location references;
- event/storylet site references;
- Chronicle place names;
- rumor origin locations;
- notice-board/task-board/contract-board anchors if approved;
- civic/religious/guild request locations;
- local incident anchors.

Forbidden in settlement-space content:

- quest state;
- event execution;
- board refresh;
- contract generation;
- rumor propagation;
- Chronicle writing;
- reward payout;
- objective progress;
- player discovery state.

## 16. Proposed Future Collections

Candidate future authorities and rough timing:

| Collection | Candidate path | Purpose | Timing |
|---|---|---|---|
| `world.settlements` | `packages/content/base/world/settlements.json` | canonical inhabited-place identity and map/region anchors | first candidate |
| `world.settlement_districts` or `world.districts` | decide later | optional internal settlement zones | after settlement decision |
| `world.buildings` or `world.settlement_sites` | decide later | important local structures/facilities/sites | after district/building decision |
| `world.local_sites` | decide later | local POIs if not modeled as buildings | later/deferred |
| `world.infrastructure` | decide later | local gates/docks/bridges if not modeled as buildings or travel | later/deferred |
| `civilization.workplaces` | existing path | production/workplace authority and possible fixed station anchors | existing owner |
| `civilization.services` | future or not needed | service descriptors if building tags are insufficient | later |
| `civilization.households` | future path | households tied to homes/families | family lane |
| `civilization.estates` | future path | estates/property facts | family/economy/property lane |
| `player.property_state` | runtime/save | player ownership/transfer/storage state | 0.6+ |
| `player.housing_state` | runtime/save | player housing runtime state | 0.6+ |

The next decision must first verify whether `world.settlements` is already live or still only planned/implied.

## 17. Validation Direction

Future validators should eventually enforce:

1. strict records-only wrappers and id/slug consistency;
2. active parent region/locality/map references;
3. valid map anchors within known map bounds, if feasible;
4. settlement type enum validity;
5. district parent settlement references;
6. building parent settlement/district references;
7. service tags from an approved controlled vocabulary;
8. workplace references resolve without duplicating workplace authority;
9. household/home/estate references resolve only after family/property owners exist;
10. guild/institution/civic/religion/sacred-site/Knowledge/travel references resolve only where approved;
11. no duplicate authority over workplaces, sacred sites, market values, travel routes, quest/event state, NPC schedules, or player property;
12. rejection of runtime construction, population simulation, stock, ownership, storage, transaction, service execution, quest state, event state, travel/pathfinding, map UI, service UI, player property, inventory, or gameplay fields.

## 18. Authored vs Generated Strategy

Recommended authored content:

- major settlements;
- canonical towns/villages/cities/ports/outposts;
- important districts and landmark buildings;
- civic, religious, guild, market, and travel anchor sites;
- settlement-specific lore and map anchors.

Potential generated-once content:

- minor hamlets;
- ordinary residential buildings;
- simple district shells;
- generic shops/services for small towns;
- farm/outskirt anchors.

Runtime/generated later:

- service stock;
- NPC placement/schedules;
- construction/upgrade state;
- ownership/property state;
- player storage;
- quest/event board refreshes;
- town damage/burning/recovery;
- map reveal and local navigation.

## 19. Recommended Versioned Sequence

Suggested sequence if this settlement-space lane is prioritized:

1. `0.5.216 - Settlement Authority Boundary Decision`
   - docs-only;
   - define settlement/district/building/local-site authority boundaries vs world geography, travel, civilization workplaces, economy, civic, religion, family, NPC, quest/event, and runtime state.

2. `0.5.217 - Settlement Schema Decision`
   - docs-only;
   - decide exact `world.settlements` path, wrapper, id pattern, region/map/locality refs, anchor model, settlement type enum, allowed tags, and forbidden fields.

3. `0.5.218 - Settlement Schema And Validator`
   - schema/validator/tests only if approved.

4. `0.5.219 - Settlement Content Seed Plan`
   - docs-only seed plan for a small number of canonical settlements.

5. `0.5.220 - First Settlement Content Seed`
   - narrow content seed after schema/validator is in place.

6. `0.5.221 - District And Building Boundary Decision`
   - docs-only decision on districts/buildings/local sites.

7. `0.5.222 - District And Building Schema Decision`
   - docs-only.

8. `0.5.223 - District And Building Schema And Validator`
   - schema/validator/tests only if approved.

9. `0.5.224 - First District And Building Content Seed Plan`
   - docs-only.

10. `0.5.225 - First District And Building Content Seed`
    - narrow content seed.

11. `0.6+`
    - service runtime;
    - vendor stock;
    - construction/property state;
    - housing runtime;
    - storage contents;
    - NPC schedule execution;
    - settlement map/UI;
    - event/quest board refreshes;
    - dynamic town state.

## 20. Open Questions

- Does `world.settlements` already exist in live content, or is it only implied by docs/scripts?
- If it exists, what exact schema/content/validator behavior already applies?
- Should districts be required for all settlements or deferred/optional for towns and cities only?
- Should ordinary buildings and local POIs share one authority or separate `world.buildings` and `world.local_sites`?
- Should services be service tags on buildings or a separate future `civilization.services` authority?
- Should settlement buildings reference `civilization.workplaces`, or should workplaces gain settlement/building anchors?
- Should ordinary temples/shrines be buildings while pilgrimage-grade sites remain `world.sacred_sites`?
- Should ports/docks/gates/bridges be buildings, infrastructure records, or travel-network nodes?
- Should player property be anchored by building ids or by a separate estate/property authority?
- Should population be entirely omitted, descriptive band only, or future runtime state?
- What is the safest first settlement content seed?

## 21. Recommended Next Codex Prompt

Next recommended narrow Codex prompt:

`Version 0.5.216 - Settlement Authority Boundary Decision`

Goal:
Create a docs-only design decision defining the boundary among settlement identity, map/region/locality anchors, districts/wards, buildings/facilities/local sites, services, housing/property anchors, civic/religious/guild spaces, infrastructure, workplaces, economy/crafting/travel/NPC/family/quest references, and future settlement runtime state.

Primary task:
Inspect the live repo, correct this research artifact where repo-state assumptions are stale, and create a permanent design decision:

`docs/design/settlement-authority-boundary-decision.md`

Required decisions:

1. Whether `world.settlements` already exists and remains the settlement identity owner, or whether it is a new future authority.
2. Whether settlements belong under `world` rather than `civilization`, `travel`, or `economy`.
3. Whether districts are separate future records, embedded sections, optional, or deferred.
4. Whether buildings/facilities/local sites should be separate future authority or deferred after settlement schema.
5. Whether services are building tags/descriptors or a later service authority.
6. Whether workplaces remain `civilization.workplaces` and are referenced by settlement-space anchors.
7. Whether housing/property anchors stay static while ownership/storage/runtime remains future state.
8. Whether civic/religious/guild/sacred/magic/Knowledge spaces use references rather than duplicated authority.
9. Whether ports/docks/gates/bridges are settlement-space anchors, travel anchors, or deferred infrastructure.
10. Whether all first-pass records reject runtime, service, construction, ownership, storage, economy, vendor, travel, quest, event, NPC schedule, map UI, and gameplay fields.
11. Which schema decision should come next after the boundary document.

Suggested commit message:

`docs(world): decide settlement authority boundaries`

## External References Used By Deep Research

- Lineage Reforged world map and travel backlog guidance.
- Lineage Reforged economy, family, civic, travel, sacred-site, crafting, combat, NPC/social, quest/event, and Knowledge design decisions.
- 2-Minute Tabletop town design guidance on districts, settlement purpose, housing placement, and industry-driven town layout.
- GameDeveloper city-builder analysis around interconnected population, services, taxes, and beautification systems as runtime concerns.
