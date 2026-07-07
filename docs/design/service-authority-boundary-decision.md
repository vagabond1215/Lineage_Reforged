# Service Authority Boundary Decision

Source version/run: Version 0.5.287 - Service Authority Boundary Decision
Date: 2026-07-07

## 1. Decision summary

Select Option C: a hybrid service model.

Current service-like data remains controlled descriptive descriptors on existing and future owners. Do not add service content, a service schema, validation, runtime, UI, storage, or gameplay behavior in this run.

A future narrow static service authority is justified in principle, but deferred. Its only approved purpose is provider-independent service identity and vocabulary: what a service category means, which stable descriptors it uses, which adjacent owners may reference it, and which execution domains it must never own.

The likely future collection name is `civilization.services`, but this decision does not create it. Any implementation requires a separate schema decision, a fresh live-repo audit, and a seed plan before content.

Next route: `Version 0.5.288 - Resource And Commodity Schema Decision`.

## 2. Current completed-state posture

Latest completed primary before this run:

- `Version 0.5.286 - Service Resource Combat Boundary Queue Review`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Current run:

- `Version 0.5.287 - Service Authority Boundary Decision`

Next primary route selected by this decision:

- `Version 0.5.288 - Resource And Commodity Schema Decision`

The Highcrown settlement Knowledge lane remains closed from `Version 0.5.285 - Highcrown Settlement Knowledge Lane Closure Review`. This decision does not reopen it.

## 3. What "service" means

A service is a stable offered capability or public-facing function that a place, provider, institution, shop, route-facing facility, or runtime interaction may later expose to a player or world actor.

Examples include lodging, market exchange, ferry berth, storage or warehousing, training, healing, repair, civic counter service, religious service, guild service, library/archive access, stable/draft-yard use, escort staging, port handling, clinic treatment, laundering, and public hygiene.

A static service descriptor answers "what kind of capability is represented." It does not answer:

- who is currently available;
- whether the player can access it;
- what it costs;
- what stock exists;
- what inventory moves;
- what effects occur;
- what UI menu opens;
- what command executes;
- what history or save state changes.

## 4. Existing service-like surfaces

Current docs and content already expose service-like surfaces without a dedicated service authority:

- `civilization.buildings` has 22 generic building/facility templates. Current records use `serviceFunctions`, `hostedWorkplaceIds`, categories, compatible settlement types, infrastructure requirements, and optional storage profiles. Unique current building categories include `agrarian`, `civic`, `extractive`, `hospitality`, `industrial`, `maritime`, `military`, `service`, and `storage`.
- Current building `serviceFunctions` include descriptors such as `lodging`, `clinic`, `market_exchange`, `market_food_stalls`, `merchant_exchange`, `ferry_berth`, `port_handling`, `boat_landing`, `contract_board`, `guild_hall`, `archives`, `record_storage`, `controlled_storage`, `storage.warehouse`, `bulk_container_storage`, `dry_storage`, `haulage_staging`, `escort_staging`, `public_hygiene`, and `laundering`.
- Current building storage profiles use storage types such as `cellar`, `granary`, `vault`, and `warehouse`. They are capacity descriptors, not storage contents.
- `civilization.workplaces` owns workforce jobs, tools, production/workforce behavior, and economy facility semantics. It does not own service access or provider identity.
- `world.settlements` owns settlement identity and current descriptive economic, infrastructure, guild-presence, and route-access posture. It does not own service execution.
- `world.settlement_districts` and `world.settlement_sites` own optional static district/site identity. They may provide physical anchors for future service references but must not execute service behavior.
- Settlement-economy decisions keep services, vendors, shops, lodging, training, repair, and access outside settlement-economy records.
- NPC/social decisions allow future people/NPC records to reference service/vendor anchors, but only as reference-only links.
- Item/inventory decisions keep vendor stock, item instances, wallet balances, ownership, containers, durability, repair, and inventory mutation outside static item definitions.
- Travel decisions keep route topology, ferry/crossing access, journey state, traversal, pathfinding, transport behavior, tolls, security, and travel UI outside local service descriptors.
- Civic decisions keep law, courts, taxes, tolls, customs, legal status, wanted/bounty state, enforcement, reputation, and access consequences outside static civic records.

## 5. Options considered

Option A: descriptors only for now.

Services would remain only as controlled descriptors/tags on building, site, NPC, economy, travel, and civic records. This is the safest current-data posture, but it leaves no central place to define service vocabulary or prevent drift across owners.

Option B: approve an immediate static service authority.

This would create a new service schema/content lane now. It is rejected for this run because the prompt is docs-only, provider references are not stable enough, and immediate implementation risks duplicating building/site/NPC/economy/vendor/runtime owners.

Option C: hybrid model.

Current records keep their descriptor fields. A later narrow static service authority is justified only as a non-executing service vocabulary/catalog, while providers, availability, access, pricing, stock, effects, storage, UI, and runtime execution remain with their own owners.

## 6. Selected option and rationale

Option C is selected.

The repo already has useful service-like descriptors on buildings, infrastructure, settlements, districts/sites, economy posture, travel, NPC/social plans, and item/economy surfaces. Those descriptors should not be migrated or replaced now.

However, a future static service catalog is justified because service terms are cross-cutting and already appear in multiple domains. Without a central vocabulary, future service references could drift, imply behavior inconsistently, or duplicate vendor/shop/storage/travel/civic owners.

The future authority is deferred because provider identity, provider availability, access gates, payment, stock, inventory mutation, training/healing/repair effects, storage/banking behavior, law/reputation gates, and UI/runtime execution are not static service identity. They need stable adjacent owners and concrete consumers before any schema/content pass.

## 7. Static service authority boundary

A future static service authority may define:

- stable service id, likely `service.<slug>`;
- slug and display name;
- service family/category;
- non-executing summary;
- controlled descriptive tags;
- allowed provider-anchor types after those authorities exist;
- adjacent owner references that may be valid in future records;
- public/limited/restricted posture as descriptive vocabulary only;
- provenance notes;
- explicit forbidden behavior notes.

A future static service authority must never define:

- provider current availability;
- schedules, opening hours, appointment state, queues, or staffing;
- access checks or player eligibility;
- prices, fees, discounts, taxes, tolls, fines, payment, wallet mutation, or credit;
- stock, shop inventory, restock timing, item instances, item movement, ownership, theft, or storage contents;
- training, healing, repair, spell, crafting, lodging, banking, travel, or court effects;
- route traversal, ferry execution, cargo movement, pathfinding, transport state, or journey state;
- legal status, faction standing, reputation, favorability, court outcomes, warrants, or law enforcement;
- UI menus, command handlers, events, rewards, save state, runtime state, history, or gameplay execution.

## 8. Ownership matrix

| Concern | Static service authority posture | Current or future owner |
| --- | --- | --- |
| Service identity | Future `civilization.services` may own stable provider-independent service vocabulary only. | Service catalog, if later implemented. |
| Service category/tags | May define controlled descriptive families/tags and cross-owner vocabulary. | Service catalog plus existing descriptor fields until migration is explicitly approved. |
| Building/site descriptors | May reference a future service id after schema support exists. | `civilization.buildings`, `world.settlement_sites`, and related place/template owners. |
| Provider identity | Must not own providers. | Future people/NPC, guild, institution, workplace, building/site, or generated/runtime owners depending on provider type. |
| Provider availability | Must not own current availability, shifts, queues, appointments, or opening state. | Runtime/save/service execution systems; future schedules only as descriptive routine plans. |
| Access gates | May describe broad public/limited/restricted posture only if later approved. | Runtime/player/social/civic/guild/religion/legal owners evaluate real access. |
| Prices and payment | Forbidden. | Economy value/price owners plus runtime transaction/wallet owners. |
| Stock and inventory | Forbidden. | Item/economy/vendor/shop/runtime inventory owners. |
| Training effects | Forbidden. | Skill, Knowledge, magic-study, trial, known-spell, evidence, and runtime progression owners. |
| Healing effects | Forbidden. | Runtime health/combat/status/injury/magic/item owners after dedicated decisions. |
| Repair effects | Forbidden. | Future repair/salvage/item-instance/crafting runtime owners after dedicated decisions. |
| Lodging effects | Service catalog may name lodging as a service category only. | Runtime rest, room, occupancy, payment, storage, travel, and save owners. |
| Storage and banking | May name storage/banking service categories only. | Item/container/storage runtime, property, economy, wallet/ledger, and save owners. |
| Route/travel interaction | May name ferry, port handling, stable, or escort service categories only. | Travel networks, hex edges, route/security, transport, journey, cargo, and runtime owners. |
| Legal/reputation gates | May describe that a service is commonly restricted only as non-executing context. | Civic/law/jurisdiction, guild/institution, reputation/social, and runtime access owners. |
| UI menus and runtime execution | Forbidden. | UI, command, runtime service/shop/travel/crafting/magic/combat/health systems. |

## 9. Required blockers before implementation

Before any future service schema/content implementation, a fresh run must resolve:

- exact collection path, wrapper, id pattern, and lifecycle/status vocabulary;
- whether `civilization.services` is the right namespace or whether service vocabulary should stay split by owning domain;
- first-pass service family/category vocabulary;
- allowed provider-anchor types and fail-closed behavior for missing providers;
- whether service records can be active before canonical providers exist;
- relationship to `civilization.buildings.serviceFunctions` and whether existing descriptors remain source-local or may reference service ids later;
- relationship to future `world.settlement_sites`;
- relationship to people/NPC overlays, schedules, guilds, institutions, workplaces, and settlement economy;
- explicit exclusion tests for price/payment, stock/inventory, training/healing/repair effects, storage contents, route traversal, legal/reputation mutation, UI, commands, rewards, save state, and gameplay;
- a seed plan proving a tiny initial catalog will not imply provider availability or runtime behavior.

## 10. Rejected alternatives

- Jump to service schema/content now: rejected because this run is docs-only and implementation prerequisites are unresolved.
- Keep descriptors forever with no future catalog: rejected because service vocabulary is already cross-cutting enough to need a possible central definition later.
- Bundle service authority with resource/commodity work: rejected because resources/commodities identify materials and trade classes, while services identify offered capabilities.
- Bundle service authority with vendors/markets: rejected because vendors, shops, stock, prices, and transactions are economy/runtime concerns, not static service identity.
- Implement UI/runtime service behavior: rejected because menus, commands, effects, persistence, and gameplay execution remain future runtime work.
- Reopen Highcrown Knowledge work: rejected because the Highcrown settlement Knowledge lane is closed.

## 11. Explicit non-goals

This decision does not add or edit service content, resource content, combat content, Knowledge snippets, Knowledge registry/domain/trial-policy content, content JSON files, schemas, validators, tests, runtime code, UI, storage, commands, events, rewards, migrations, save/account behavior, route/travel behavior, building/workplace/economy behavior, court/law behavior, vendor/market behavior, cargo/storage behavior, settlement/district/site content, anchors, sacred-site/religious-hotspot content, or gameplay behavior.

This decision does not authorize migrations, compatibility aliases, data renames, provider generation, service provider content, service schema implementation, normal content-lint registration, or transition to `0.6.0`.

## 12. Validation and audit posture

This run should validate docs-only scope:

- only docs changed;
- no package content, schema, validator, test, runtime, UI, storage, command, event, reward, migration, save/account, route/travel, building/workplace/economy, court/law, vendor/market, cargo/storage, settlement/district/site, sacred-site/religious-hotspot, service/resource/combat, or gameplay files changed;
- `0.5.287` is marked complete in workflow docs;
- `0.5.288 - Resource And Commodity Schema Decision` is the immediate next primary route;
- `0.5.289` and `0.5.290` remain deferred in order;
- the Highcrown settlement Knowledge lane remains closed context.

## 13. Next recommended version

Version 0.5.288 - Resource And Commodity Schema Decision

That run should remain docs-first. It should decide the future `world.resources` and `world.commodities` schema posture against current economy, item, ecology/geography, crafting/production, market/value, settlement-economy, service, and runtime boundaries. It must not implement resources, commodities, service content, combat content, schemas, validators, tests, runtime/UI/storage/commands/events/rewards/migrations/save-account behavior, or gameplay behavior unless a later focused implementation prompt explicitly scopes that work.
