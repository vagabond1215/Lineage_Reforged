# Service Resource Combat Boundary Queue Review

Source version/run: Version 0.5.286 - Service Resource Combat Boundary Queue Review
Date: 2026-07-07

## 1. Decision summary

Select the existing conservative queue order:

1. `Version 0.5.287 - Service Authority Boundary Decision`
2. `Version 0.5.288 - Resource And Commodity Schema Decision`
3. `Version 0.5.289 - Combat Status Condition And Injury Boundary Decision`
4. `Version 0.5.290 - Static Authority Validation Consolidation Audit`

This review changes no content, schema, validator, test, runtime, UI, storage, command, event, reward, migration, save/account, route/travel, building/workplace/economy, court/law, vendor/market, cargo/storage, settlement/district/site, anchor, sacred-site/religious-hotspot, service, resource, combat, or gameplay behavior.

## 2. Current completed-state posture

Latest completed primary before this run:

- `Version 0.5.285 - Highcrown Settlement Knowledge Lane Closure Review`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Current run:

- `Version 0.5.286 - Service Resource Combat Boundary Queue Review`

Next primary route selected by this review:

- `Version 0.5.287 - Service Authority Boundary Decision`

The Highcrown settlement Knowledge lane is closed. It should remain closed unless a later owner decision deliberately reopens it. Future work should move into service/resource/combat boundary decisions rather than additional Highcrown settlement, district, or site snippets.

## 3. Service boundary review

Services are currently the most cross-cutting unanswered boundary in the active queue.

Existing settlement authority keeps services as descriptive functions/tags on current building templates and future placed site anchors. It explicitly rejects a first-pass service authority until a later decision proves stable service identity, provider-independent rules, or reuse across several site types cannot be represented safely by controlled descriptors.

Existing NPC/social authority also preserves service/vendor references as reference-only. People and NPC records may later point at service, shop, vendor, workplace, building, or settlement anchors, but those references must not execute services, create stock, set prices, grant access, collect payment, mutate inventories, assign workers, or create runtime availability.

Existing settlement-economy and economy decisions keep services, vendors, shops, lodging, training, repair, healing, storage, and access separate from settlement-economy records. Economy records may describe durable local posture, but they must not become service registries or executable market/shop state.

Service work therefore needs a focused authority decision before any service content or schema work. That decision should determine whether services remain controlled descriptors on building/site/NPC/economy records for now, or whether a narrow future static authority is justified. It must also pin ownership of provider identity, provider availability, access gates, pricing, payment, stock, training/healing/repair effects, storage/banking, legal/reputation gates, UI menus, and runtime execution.

## 4. Resource and commodity boundary review

Resource and commodity work is important, but it depends on already documented economy and item boundaries.

The economy authority decision approves separate future `world.resources` and `world.commodities` semantic authorities, but not immediate implementation. Resources identify source materials and geography/ecology compatibility; commodities identify bulk tradable forms or economic classes; existing `items.items` remains the individual inventory identity owner.

The settlement-economy schema decision forbids implicit resource or commodity creation through free-form names, pseudo-ids, aliases, or unrestricted goods strings. Settlement-economy `itemPostures` may use only canonical item keys under current policy. Resource/commodity-like free-form strings from embedded settlement fields must wait for real `world.resources` or `world.commodities` authority.

The resource/commodity decision should therefore follow the service boundary decision. It needs a schema-level decision, not a content seed, and should define ids, vocabularies, item-key mapping rules, resource-versus-commodity distinction, geography/ecology compatibility posture, market/profile interaction, crafting/production references, validation failure modes, and explicit runtime exclusions.

## 5. Combat boundary review

Combat status, condition, and injury work remains higher risk and should stay behind service and resource decisions.

The combat authority decision preserves existing owners:

- `world.monsters` for static enemy archetypes;
- `world.encounter_templates` for authored encounter compositions;
- `world.spawn_profiles` for descriptive world selection envelopes;
- `game.combat_roles` and `game.tactics_presets` for tactical defaults;
- runtime game-engine state for combat sessions, combatants, active statuses, resources, actions, targeting, outcomes, and history.

The monster record schema decision keeps status, condition, injury, wound, morale, fear, death, defeat, disease, poison, and recovery systems future-only. It allows only a later dedicated static status/condition authority after a focused boundary decision. Injuries, wounds, current disease/poison exposure, morale values, death/defeat state, incapacitation, bleeding, healing, recovery timers, scars, capture, retreat, surrender, and resurrection remain runtime/save/player/NPC/combat owners as appropriate.

The combat lane should therefore remain a docs-first boundary decision, not schema or runtime work. It must not alter combat math, stat scaling, monster content, encounter content, spawn behavior, tactics, loot, rewards, item instances, save state, or gameplay behavior.

## 6. Queue ordering decision

The selected order is service first, resource/commodity second, combat status/injury third, then static validation consolidation.

Service comes first because it sits at the junction of settlement sites, building templates, NPC overlays, economy, vendors, access, storage, training, healing, repair, travel-facing facilities, law/reputation gates, and UI/runtime execution. Without a service boundary, later resource, vendor, market, NPC, site, and economy records could accidentally imply behavior they do not own.

Resource/commodity comes second because economy decisions already identify the need, but the resource lane must reconcile item keys, market/value owners, production chains, ecology/geography compatibility, and settlement-economy posture. It benefits from the service decision's access/vendor/shop boundaries.

Combat status/injury comes third because it touches high-risk combat math, runtime state, save/account posture, AI/tactics, items/spells/effects, rewards, player/NPC health, injuries, death/defeat, and persistence. It should remain behind the lower-risk static boundary decisions.

The static authority validation consolidation audit remains after these decisions because it should audit settled boundaries rather than preempt them.

## 7. Rejected alternatives

- Move directly to service implementation: rejected because current docs still treat services as descriptive functions/tags unless a focused authority decision proves a separate owner.
- Move directly to resource/commodity schema work: rejected because service boundaries still affect vendor/shop/access/service implications around resources and commodities.
- Move combat status/injury ahead of service and resource work: rejected because combat status/injury is higher risk and needs a fresher boundary pass before schema, validator, or runtime work.
- Add service, resource, or combat content now: rejected because this run is docs-only and no content authority has been approved here.
- Reopen the Highcrown settlement Knowledge lane: rejected because `0.5.285` closed that lane and this review found no reason to revisit it.
- Renumber the active queue: rejected because the existing `0.5.287` through `0.5.290` ordering is coherent and does not require correction.

## 8. Explicit non-goals

This review does not add or edit content JSON, schemas, validators, tests, runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, gameplay systems, route/travel, building/workplace/economy, court/law, vendor/market, cargo/storage, settlement/district/site records, anchors, sacred-site/religious-hotspot content, service content, resource content, combat content, or Knowledge snippets.

This review does not authorize backwards compatibility, aliases, migrations, content moves, generated content, vendor/generated artifact edits, runtime ownership transition, or transition to `0.6.0`.

## 9. Validation and audit posture

This review was documentation-only and based on existing permanent authority decisions plus current roadmap/handoff posture.

Validation should confirm:

- only docs changed;
- no content/schema/validator/test/runtime/UI/storage/gameplay files changed;
- `0.5.286` is marked complete in workflow docs;
- `0.5.287 - Service Authority Boundary Decision` is the immediate next primary route;
- `0.5.288`, `0.5.289`, and `0.5.290` remain deferred in that order;
- the Highcrown settlement Knowledge lane remains closed context, not active scope.

## 10. Next recommended version

Version 0.5.287 - Service Authority Boundary Decision

That run should be docs-first. It should decide whether services remain descriptive functions/tags on building/site/NPC/economy records for now or whether a narrow future static service authority is justified. It must not add content, schemas, validators, tests, runtime/UI/storage/commands/events/rewards/migrations/save-account behavior, or gameplay behavior unless a later focused implementation prompt explicitly scopes that work.
