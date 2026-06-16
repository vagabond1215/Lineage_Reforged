# Survival Builder RPG MMO Content Gap Audit

Source route: ChatGPT via GitHub Connector  
Date: 2026-06-16  
Status: durable design audit; documentation only; not an implementation handoff

## Purpose

This audit preserves a curated gap review for the broader fantasy medieval survival / builder / RPG / MMO ambition of Lineage: Reforged.

It exists so the design findings from the June 2026 gap review are not lost, while avoiding a raw conversation dump, duplicated roadmap entries, or accidental permission to implement broad systems.

Use this document to identify missing or under-addressed content and system lanes before future roadmap passes, especially when deciding what must exist before the project can safely move from `v0.5.x` foundation stabilization into later runtime ownership and integrated gameplay phases.

This document is not:

- a source of runtime data;
- a schema;
- content JSON;
- a backlog replacement;
- a current implementation handoff;
- permission to implement every listed system;
- permission to broaden a narrow Codex prompt.

## Current Design Authority Context

Current repo direction emphasizes:

- grounded medieval fantasy;
- lineage, legacy, dynasty continuity, and persistent history;
- classless character development where current systems support it;
- durable world state, authored content integrity, and validated systems before broad runtime expansion;
- ownership before behavior;
- evidence before access;
- presentation before mutation;
- current-data-first pre-release development.

The active project phase remains `v0.5.x` foundation stabilization / ownership hardening. Broad runtime expansion belongs later, after data owners, validation, state boundaries, and UI/read-only projections are clear.

## Audit Method

This audit reviewed the current roadmap, backlog, strategic continuity brief, and recent design plans to distinguish:

- live implementation;
- schema-only authority;
- content-only authority;
- pure helper/projection work;
- documentation-only planning;
- intentionally deferred systems;
- missing or under-addressed genre expectations.

The goal is not to add every expected MMO/survival feature. The goal is to preserve a scoped map of expected lanes so future plans can choose deliberately.

## Priority Summary

Highest-priority missing or under-addressed pillars:

1. Survival needs, exposure, rest, injury, disease, and recovery.
2. Inventory, containers, storage, item ownership, and logistics.
3. Homestead, building, construction, and settlement builder authority.
4. NPC population, households, jobs, schedules, and settlement roles.
5. Factions, guilds, institutions, orders, and membership authority.
6. Reputation, Renown, favorability, and local memory ledgers.
7. Quest, contract, bounty, and work-order authority.
8. Travel, exploration, routes, hazards, and points of interest.
9. Law, crime, justice, punishment, and bounty authority.
10. Estate, death trigger, succession, custody, and inheritance runtime authority.

These lanes should be treated as candidate planning targets, not immediate implementation permission.

## 1. Core Survival Loop

Expected content and systems:

- hunger;
- thirst;
- fatigue;
- sleep quality;
- shelter exposure;
- warmth, cold, heat, and wetness;
- disease, wounds, infection, poison, and recovery;
- morale, stress, fear, and hardship;
- sanitation and clean water;
- food spoilage;
- cooking safety;
- campfires, beds, camps, and rest sites;
- travel rations;
- encumbrance;
- tool durability;
- clothing warmth and protection.

Current posture:

- Some related authority exists in ecology, climate, cooking/crafting, and disease/blight planning notes.
- A unified survival-state model does not yet exist.
- Runtime survival mutation should wait for explicit state ownership, persistence, UI, and validation.

Recommended future planning pass:

- `Survival Needs, Exposure, And Rest State Plan`

Open questions:

- Should survival use exact meters, bands, or hidden state with descriptive output?
- Should hunger/thirst be character-owned only, or also party/household scoped?
- Should sleep/rest be tied to beds, shelter quality, safety, weather, and active threats?
- Should disease and wounds be part of one health model or separate systems?

## 2. Inventory, Containers, Storage, And Logistics

Expected content and systems:

- inventory capacity, slots, or weight;
- item stacks;
- carried containers;
- chests, barrels, crates, sacks, warehouses, and cellars;
- storage ownership and access rights;
- spoilage and preservation;
- damaged items;
- item quality;
- fuel;
- ammunition;
- tools;
- materials;
- carts, pack animals, boats, and hauling;
- item reservations for crafting, building, jobs, and trade;
- dropped-world item persistence;
- loot ownership and stolen flags.

Current posture:

- Crafting and recipe plans already expect missing ingredients, tools, stations, skill, quality, and familiarity checks.
- Mutating storage, inventory persistence, reservation, and logistics systems remain under-addressed.

Recommended future planning pass:

- `Inventory, Storage, And Item Ownership Authority Plan`

Open questions:

- Should inventory be item-instance based from the start, or mixed stack/item-instance?
- Which items require durability and provenance?
- Should storage access be character, family, estate, guild, settlement, or institution owned?
- Should stolen ownership be universal, local, or faction-specific?

## 3. Homestead, Building, And Settlement Construction

Expected content and systems:

- buildable structures;
- foundations, walls, roofs, floors, doors, gates, fences;
- beds, hearths, kitchens, wells, storage, crafting stations, and workshops;
- farms, pens, orchards, irrigation, roads, paths, and defensive structures;
- construction materials and blueprints;
- room and station requirements;
- worker assignment;
- maintenance, decay, repair, and damage;
- fire risk and weather damage;
- building ownership and permissions;
- settlement zoning and expansion.

Current posture:

- Workplace, building, and infrastructure concepts exist in validation and content fragments.
- The builder loop is not yet an authored authority layer or runtime system.
- This should depend on inventory/storage, ownership, settlement authority, and worker/job modeling.

Recommended future planning pass:

- `Homestead, Building, And Settlement Construction Authority Plan`

Open questions:

- Should the first builder scope be personal camp, homestead, family estate, village, or guild/workshop?
- Should buildings be tile/grid based, slot based, or authored-place based?
- Should decay and repair exist before full construction?

## 4. NPC Population, Households, Jobs, And Schedules

Expected content and systems:

- NPC identities;
- households;
- jobs and settlement roles;
- schedules and routines;
- needs and local obligations;
- relationships and family ties;
- faction, guild, religious, and civic membership;
- migration, births, deaths, aging, injury, and illness;
- merchants, guards, clergy, nobles, craftsmen, farmers, laborers, criminals, travelers, and children;
- apprentices, wards, orphans, and retainers.

Current posture:

- Family, heir, maturation, wardship, civil institutions, marriage, and estate concepts exist as plans.
- A general NPC population authority is missing.
- Many future systems need NPCs as owners, witnesses, trainers, merchants, quest givers, workers, relatives, rivals, clergy, or faction representatives.

Recommended future planning pass:

- `NPC Population, Household, And Settlement Role Authority Plan`

Open questions:

- Should early NPCs be authored named records, generated persistent records, or role placeholders?
- Should households be part of settlement content or a separate population collection?
- Should schedules be runtime simulation or authored availability windows first?

## 5. Factions, Guilds, Institutions, Orders, And Membership

Expected content and systems:

- guild records;
- religious order records;
- noble houses;
- civic institutions;
- criminal factions;
- military orders;
- merchant leagues;
- cults, temples, monasteries, shrines, schools, and academies;
- admission requirements;
- rank/title ladders;
- expulsion rules;
- services offered;
- protected territories;
- contracts issued;
- allies and enemies;
- law or custom enforcement;
- faction memory.

Current posture:

- World religion content has nested religious organizations, but direct subject and institution authority remains deferred.
- Religion plans repeatedly defer temple/order/cult implementation until settlement and region authority exists.
- Civil institutions are discussed, but not represented as live authority.

Recommended future planning pass:

- `Faction, Guild, And Institution Authority Plan`

Open questions:

- Should guilds, religious orders, institutions, and factions share a base schema?
- Should institutions be place-owned, region-owned, faction-owned, or independent?
- Should rank ladders be generic or per organization type?

## 6. Reputation, Renown, Favorability, And Local Memory

Expected content and systems:

- local reputation;
- regional Renown;
- family Renown;
- religious favorability;
- faction favorability;
- criminal notoriety;
- civic trust;
- guild standing;
- settlement memory;
- rumor and witness systems;
- evidence and record provenance;
- apology, restitution, service, or atonement;
- decay and checkpoints;
- bounties, exile, forgiveness, and amnesty;
- generational inheritance of scoped recognition.

Current posture:

- The project north star depends heavily on remembered actions, family ownership, local recognition, and limited carry-forward.
- User-requested Religious Favorability And Elemental Alignment belongs in this lane.
- Existing religion/hotspot plans keep favorability deferred until a dedicated design pass.

Recommended future planning passes:

- `Reputation, Renown, And Relationship Ledger Plan`
- `Religious Favorability And Elemental Alignment Plan`

Open questions:

- Should reputation be one ledger with typed scopes or separate ledgers per system?
- Should favorability use numeric scores with display bands, or only bands?
- Which actions create irreversible debt rather than ordinary score loss?
- Which standings can decay, and which require trials/checkpoints to preserve?

## 7. Quest, Contract, Bounty, And Work Order Authority

Expected content and systems:

- notice boards;
- guild contracts;
- religious quests;
- delivery, escort, gathering, hunting, building, crafting, and exploration jobs;
- noble errands;
- criminal contracts;
- pilgrimage tasks;
- faction tasks;
- monster extermination;
- disaster-response tasks;
- quest expiry and failure;
- reward tables;
- reputation/favor outcomes;
- work-order ownership and fulfillment evidence.

Current posture:

- Quest events appear as possible knowledge discovery or recipe-learning sources.
- A general quest/contract authority model is missing.

Recommended future planning pass:

- `Quest, Contract, And Work Order Authority Plan`

Open questions:

- Should first quests be authored static content, generated contracts, or both?
- Should quest rewards be content-defined, economy-derived, or faction-derived?
- Should failure create persistent local memory?

## 8. Travel, Exploration, Routes, Hazards, And Points Of Interest

Expected content and systems:

- roads, trails, passes, ferries, sea lanes, and river routes;
- travel speed and travel modes;
- weather and terrain hazards;
- campsites and water sources;
- foraging zones;
- ambush and monster risk;
- map discovery;
- landmarks;
- ruins, caves, crypts, mines, temples, bandit camps, lairs, sacred sites, cursed places, and old battlefields;
- traps, locks, puzzles, and treasure;
- historical and knowledge hooks.

Current posture:

- Some route, region, locality, ecology, and knowledge discovery pieces exist.
- A unified travel/exploration/POI authority is missing.
- `ruin` exists in vocabulary but remains blocked by snippet validation.

Recommended future planning passes:

- `Travel, Exploration, Route, And Hazard Authority Plan`
- `Points Of Interest, Ruins, Lairs, And Dungeon Authority Plan`

Open questions:

- Should POIs be permanent authored records, generated instances, or both?
- Should travel be simulated step-by-step, event-based, or route abstraction first?
- Should maps reveal exact positions or approximate discovered knowledge?

## 9. Law, Crime, Bounty, And Punishment

Expected content and systems:

- theft, trespass, assault, murder, poaching, contraband, smuggling, and religious crimes where supported;
- witnesses and evidence;
- guard response;
- fines, prison, exile, bounties, outlaw status, pardons, and sanctuary;
- local law variation;
- noble privilege;
- religious and civic courts;
- bribery, corruption, and false accusation;
- confiscation and estate consequences.

Current posture:

- Civil institution and religious hotspot notes imply law/crime risk, but no law authority exists.
- Do not let hotspot or favorability content accidentally create law behavior before this owner exists.

Recommended future planning pass:

- `Law, Crime, Bounty, And Punishment Authority Plan`

Open questions:

- Should law be settlement-owned, regional, kingdom-level, religious, factional, or layered?
- Should bounties require witnesses/evidence or can factions issue them directly?
- Should imprisonment be playable, time skip, or failure-state content?

## 10. Combat, Injury, Encounters, And Capture

Expected content and systems:

- melee and ranged attack resolution;
- armor, shields, dodge, block, and parry;
- stamina and morale;
- wounds, bleeding, fractures, burns, infection, poison, and recovery;
- monster and human enemy AI;
- ambushes;
- mounted combat;
- stealth attacks;
- surrender, flee, capture, and imprisonment;
- loot and death consequences;
- siege and raid events.

Current posture:

- Equipment mapping and narrow spell/magic readiness helpers exist.
- Runtime combat and injury behavior remain largely deferred.

Recommended future planning passes:

- `Combat Resolution, Injury, And Encounter Authority Plan`
- `Health, Injury, Disease, And Medicine Authority Plan`

Open questions:

- Should injury be granular body-part state or abstract conditions first?
- Should combat be deterministic projection plus rolls, or event-command driven from the beginning?
- Should capture be a supported failure path before law/prison systems exist?

## 11. Farming, Ranching, Gardens, And Managed Ecology

Expected content and systems:

- crop planting, growth stages, soil, irrigation, pests, blight, harvest, seed saving;
- orchards and vines;
- animal breeding, feeding, grazing, milking, shearing, eggs, manure, disease, predators;
- seasonal labor;
- storage and spoilage;
- market demand;
- laws, taboos, and religious/cultural restrictions.

Current posture:

- Macro and micro flora/fauna engine concepts are planned.
- Managed breeding waits for estate, workplace, ownership, storage, and economy seams.

Recommended future planning pass:

- `Agriculture, Husbandry, And Managed Ecology Authority Plan`

Open questions:

- Should early agriculture use abundance bands, exact counts, or hidden estimates?
- Should the first micro system be livestock, crops/gardens, orchards/vines, alchemy herbs, or apiaries?

## 12. Crafting, Recipes, Production, And Quality

Expected content and systems:

- recipes;
- tools and workstations;
- ingredient and material quality;
- crafting quality tiers;
- failures, waste, partial success, and flawed outputs;
- repair and salvage;
- experimentation;
- commissions;
- apprentices and helpers;
- family, guild, institution, book, scroll, settlement, and culture recipe ownership;
- recipe inheritance;
- bulk crafting/cooking with per-item outcomes.

Current posture:

- Strong design notes already exist for recipe ownership, learning flags, quality ladders, recipe learning events, crafting/cooking trials, and bulk preparation Prestige.
- Implementation remains deferred.

Recommended future planning passes:

- `Recipe Ownership And Personal Learning Plan`
- `Crafting, Quality, And Workshop Trial Event Plan`
- `Bulk Cooking And Crafting Prestige Unlock Plan`

Open questions:

- Should recipe learning trials apply to all recipes or only meaningful ones?
- Should food and crafting share quality labels?
- Should family recipes be visible to all family members or only access-approved members?

## 13. Markets, Trade, Taxes, And Supply Chains

Expected content and systems:

- local prices;
- supply and demand;
- shortages and surpluses;
- caravans and trade routes;
- seasonal price variation;
- merchant stalls;
- guild fees;
- taxes, tariffs, tolls, rent, debt, and loans;
- storage fees;
- wages;
- piracy, banditry, and smuggling;
- regional imports and exports;
- money sinks and exploit control.

Current posture:

- Economy price clarity planning/projection exists, but broad trade and supply-chain simulation remain deferred.

Recommended future planning passes:

- `Market, Trade Route, And Supply Chain Authority Plan`
- `Transaction, Trade, And Exploit-Safe Economy Plan`

Open questions:

- Should prices be authored, simulated, or hybrid first?
- Should trade routes mutate supply or only describe market context in early versions?
- Should player-to-player trading be planned before or after single-player ownership is stable?

## 14. Multiplayer / MMO Identity And Safety

Expected content and systems:

- account identity;
- character slots;
- family ownership across characters;
- guild membership;
- party/group membership;
- friend/ignore lists;
- chat channels;
- mail;
- trading and auction/market board;
- player settlements;
- shared storage and permissions;
- offline progression;
- PvP/PvE flags;
- instancing/sharding;
- moderation;
- anti-cheat;
- rollback/recovery;
- exploit controls.

Current posture:

- The project has account, Chronicle, Legacy, Bloodline, and family-scoped planning/components, but actual MMO runtime and shared-world systems are not in scope yet.

Recommended future planning passes:

- `Multiplayer Identity, Account, Guild, And Shared World Boundary Plan`
- `Transaction, Trade, And Exploit-Safe Economy Plan`

Open questions:

- Is the intended first playable slice single-player/local, co-op, private server, or MMO-authoritative?
- Should family state be account-local first and server-shared later?
- Should player trading exist before storage, provenance, and transaction logs are stable?

## 15. Doctrine, Rites, Holy Days, Orders, And Sacred Sites

Expected content and systems:

- doctrines;
- rites;
- prayer forms;
- holy days;
- taboos;
- pilgrimages;
- temple services;
- blessings;
- burial rites;
- conversion and apostasy paths;
- religious courts;
- order ranks;
- saint, ancestor, spirit, cult, or elemental traditions;
- relics and sacred places.

Current posture:

- Religion is active only as authored knowledge with two snippets.
- Direct subjects for doctrine, rite, holy-day, order, shrine, sacred-site, and hotspot remain deferred.

Recommended future planning passes:

- `Doctrine, Rite, Holy Day, And Religious Order Authority Plan`
- `Religious Hotspot Content Authority Plan`
- `Religious Favorability And Elemental Alignment Plan`

Open questions:

- Should religious orders become direct subjects before sacred places?
- Should rites and holy days be global religion records or local variants?
- Should conversion/apostasy be modeled as relationship state, legal status, religious state, or backstory path?

## 16. Magic Runtime And Spell Effects

Expected content and systems:

- effectful spell casting;
- target selection;
- range and line of sight;
- damage, healing, buffs, debuffs, and conditions;
- resistances and affinities;
- catalysts and reagents;
- resource payment;
- cooldowns;
- interruption and miscast;
- rituals;
- magic crimes and licensing;
- Divine, Druidic, Arcane, and other school distinctions;
- magic service economy.

Current posture:

- Known-spell ownership, acquisition helpers, cast readiness, resolver readiness, inert envelopes, and hook classification are well-developed.
- Effectful runtime casting remains deferred.

Recommended future planning pass:

- `First Effectful Magic Cast Resolver Plan`

Open questions:

- Which spell should be first effectful runtime candidate?
- Should spell penalties from religion/favorability ever affect all magic or only divine/druidic/elemental lanes?
- Should catalysts be reserved, consumed, or paid only after successful resolution?

## 17. Gameplay Shell, Journal, Map, And Core HUD

Expected content and systems:

- gameplay shell;
- inventory UI;
- character sheet;
- family tree;
- map and travel UI;
- settlement builder UI;
- crafting UI;
- quest log;
- knowledge journal;
- religion/favor ledger;
- combat log;
- calendar/weather UI;
- NPC interaction UI;
- trade UI;
- storage UI;
- reputation UI;
- skill/progression UI;
- death/inheritance UI;
- multiplayer social UI.

Current posture:

- Character creation shell work has landed.
- Gameplay shell unification and broad runtime UI remain deferred.

Recommended future planning pass:

- `Gameplay Shell, Journal, Map, And Core HUD Plan`

Open questions:

- Should the first gameplay shell present read-only state only?
- Which UI surface is required before the first narrow runtime loop?
- Should knowledge, quest, map, and reputation journals share a common record-browser UI?

## Cross-System Dependencies

Do not implement these broad systems in isolation. The safest dependency order is:

1. Inventory, storage, and item ownership.
2. Survival needs, exposure, rest, and injury state.
3. Homestead/building/construction authority.
4. NPC population, households, and settlement roles.
5. Faction/guild/institution authority.
6. Reputation/Renown/favorability ledger.
7. Quest/contract/work-order authority.
8. Travel/exploration/hazard authority.
9. Law/crime/bounty/punishment authority.
10. Estate/death/succession runtime authority.

Rationale:

- Survival needs require character state, item use, rest locations, and environmental authority.
- Builder gameplay requires inventory, ownership, materials, construction authority, and workers.
- Factions and favorability require NPCs, institutions, local memory, and consequences.
- Economy and crafting require inventory, storage, provenance, recipes, and transaction safety.
- MMO features require server-authoritative ownership, persistence, logging, and anti-exploit controls.

## Recommended Future Audit Pass

Add a future docs-only roadmap/audit pass when the current Religion/hotspot/favorability sequence stabilizes:

- `Survival Builder RPG MMO Content Gap Roadmap`

Purpose:

- classify each expected genre pillar as live, schema-only, content-only, pure-helper, documentation-only, missing, or intentionally out of scope;
- decide which pillars are prerequisites for the first playable runtime ownership transition;
- decide which pillars can wait until `0.6.x`, `0.7.x`, or later;
- prevent Religion, family, ecology, crafting, and economy systems from expanding without the required survival/builder/core ownership foundations.

## Do-Not-Drift Rules

- Do not implement listed systems just because this audit names them.
- Do not add runtime mutation before owner, evidence, scope, validation, UI boundary, and failure state are explicit.
- Do not create global reputation, law, religion, or faction consequences before scoped local owners exist.
- Do not convert family Prestige into generic account perks.
- Do not use design docs as runtime data.
- Do not use `custom`, generic strings, or broad fallback ids to bypass missing content authority.
- Do not add MMO trade or shared-world features before exploit-safe ownership and transaction boundaries exist.
- Do not add explicit sexual content; adult social systems must remain non-explicit and fade-to-black if ever implemented.
- Do not glamorize coercive institutions; treat them as serious legal/social systems with risk and local authority.

## Open Clarification Queue

The following questions should be answered in future targeted planning passes rather than guessed here:

1. Is the first intended playable slice single-player/local, co-op/private server, or MMO-authoritative?
2. Should survival state use exact meters, descriptive bands, or mostly hidden values?
3. Should the first builder scope be camp, homestead, family estate, village, or larger settlement?
4. Should inventory be stack-first, item-instance-first, or hybrid from the start?
5. Should NPC population start as authored named records, generated persistent records, or role placeholders?
6. Should factions, guilds, institutions, and religious orders share one schema family?
7. Should reputation/favorability be one scoped relationship ledger or separate ledgers per system?
8. Should religious favorability be prioritized before or after hotspot content authority?
9. Should law be settlement-owned, regional, kingdom-level, religious, factional, or layered?
10. Should quests be authored, generated from contracts/work orders, or hybrid?
11. Should travel be route-based abstraction first or step-by-step map movement?
12. Should ruins, lairs, dungeons, and sacred sites share one point-of-interest authority?
13. Should agriculture use exact counts, abundance bands, or hidden estimates?
14. Should crafting trials apply to every craft or only meaningful/high-risk/high-value work?
15. Should player-to-player trade be deferred until item provenance and transaction logs exist?
16. Which spell should be the first effectful runtime magic candidate?
17. Which UI surface is required before the first narrow runtime loop?

## Suggested Near-Term Use

This audit should not interrupt the current Religion/hotspot authority lane. The next hotspot-specific run should remain `Version 0.5.174 - Religious Hotspot Content Authority Schema Plan` unless the user explicitly redirects.

Possible later sequence options:

1. Finish the current Religion/hotspot authority lane.
2. Run `Religious Favorability And Elemental Alignment Plan` if religion/faction alignment remains the chosen priority.
3. Run `Survival Builder RPG MMO Content Gap Roadmap` to organize the broader genre gap list.
4. Use that roadmap to select the next foundational lane, likely inventory/storage or survival needs.
