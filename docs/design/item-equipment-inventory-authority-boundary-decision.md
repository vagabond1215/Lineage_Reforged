# Item Equipment Inventory Authority Boundary Decision

Version: `Version 0.5.209 - Item Equipment Inventory Authority Boundary Decision`

Status: approved documentation-only authority boundary

## 1. Decision Summary

Preserve `items.items` at `packages/content/base/items/items.json` as the canonical static item identity authority. Preserve `items.consumable_profiles` as a separate profile authority referenced by item records.

Prefer separate future `items.weapon_profiles` and `items.armor_profiles` authorities rather than adding more profile objects directly to canonical item records. Any later split must reconcile the existing embedded `useProfiles`; it must not duplicate or silently replace them.

Prefer separate future `items.container_templates` and `items.loot_tables` authorities. Keep currency definitions and market values economy-owned. Reward envelopes, NPC gear, vendor stock, magic-item references, crafting inputs/outputs, combat drops, and encounter references remain non-mutating references.

Static item/profile/template/table content must remain separate from player inventory, equipment, item instances, container contents, wallet balances, ownership, quantity, current durability, reward payout, vendor transactions, and runtime/UI state. This document consumes `docs/dev/tmp-item-equipment-inventory-systems-research-2026-06-20.md` as planning input, corrects it against the live repository, and does not make that temporary artifact canon.

## 2. Live Repo Reality

Live inspection found:

- `items.items` contains 1,372 canonical item records with strict schema/lint coverage and stable `id` plus `itemKey` identities.
- `items.consumable_profiles` exists separately with nine records; item records reference it through `consumableProfileId`. The temporary research claim is confirmed.
- No weapon-profile, armor-profile, container-template, general loot-table, item-instance, ownership, or static inventory collection exists.
- Sixteen item records currently embed `useProfiles`, including weapons, armor/shields, tools, and clothing. These profiles already carry action/skill/effect/handling/combat-hook metadata.
- Seven items carry conduit metadata and three carry catalyst metadata. Those profiles are validated magic metadata, not ownership or consumption state.
- World monster records currently embed `drops` and `loot` entries. Quest definitions/templates embed item reward references. These existing source-local envelopes are not a general loot-table authority.
- `civilization.currency_system` already defines the Crown Standard and denominations. Player runtime state separately stores current gold/silver/copper wallet balances.
- `civilization.market_item_values` is economy-owned and currently references canonical `itemKey`, not item ids. Content lint validates those keys against canonical item/economy sources.
- Shared/player/UI state already owns inventory bags/stacks, overflow, equipped item refs/slots, quantity, optional current durability, and wallet balances.

The artifact came from a requested combat research run but produced item/inventory-focused findings. It is not a complete combat authority report.

## 3. Item / Equipment / Inventory Authority Ownership Boundary

Authority remains layered:

- item definitions own stable item identity and broad classification;
- consumable profiles own reusable consumption/nutrition descriptors;
- future weapon and armor profiles own static equipment/combat descriptors;
- future container templates own static container capabilities;
- future loot tables own possible item outcomes;
- currency systems and market values remain economy authority;
- reward, NPC/vendor, crafting, magic, combat, and encounter content reference item authorities;
- runtime/save owners track actual stacks, equipped refs, item instances, contents, owner, location, quantity, condition/durability, wallet, and transactions.

References do not create an item instance, transfer ownership, move inventory, equip an item, consume it, or execute behavior.

## 4. Canonical Item Identity Boundary

`items.items` remains the canonical static item identity authority. It owns `item.*` identity, `itemKey`, aliases, name, class/branch/sub-branch, stage/roles/tags, marketability/value references, processing/material difficulty metadata, profile references, existing use metadata, and supported magic metadata.

Static item definitions must not own current owner, current quantity, current slot/container/location, item-instance id, current durability/condition, stolen/bound/contraband state on a copy, reward claim, vendor stock, wallet balance, inventory state, UI state, or storage state.

No item registry/schema/content migration, category rewrite, profile extraction, or current-data compatibility work is authorized here.

## 5. Consumable Profile Boundary

`items.consumable_profiles` remains separate from canonical item identity. It owns reusable static calorie, protein, carbohydrate, fat, hydration, and use-verb descriptors; item records link through `consumableProfileId`.

Consumable profiles must not track quantity, consumption history, freshness on a particular stack, current spoilage, hunger/thirst state, effect duration, inventory mutation, item deletion, healing, buffs, or gameplay execution.

Existing spoilage/profile references retain their current ownership. No consumable schema, validator, content, survival, or consumption behavior changes are authorized.

## 6. Weapon Profile Boundary

Future `items.weapon_profiles` should be a separate static authority rather than new embedded weapon-profile objects on item definitions. It may later own item reference, weapon class/family, handedness/slot posture, range/delivery posture, static damage/effect descriptors, proficiency/skill references, compatibility tags, provenance, and notes.

Current item `useProfiles` already own live action, skill, handling, target, activation, tag, and resolution-hook metadata for selected weapons/tools. A future weapon-profile decision must declare which fields remain embedded, move, or become references before any schema is created. No duplicate competing combat metadata is acceptable.

Weapon profiles must not calculate damage, execute attacks, equip items, consume ammunition, mutate durability, apply conditions, grant skills, or own combat/player state.

## 7. Armor Profile Boundary

Future `items.armor_profiles` should be a separate static authority rather than new embedded armor-profile objects on item definitions. It may later own item reference, armor/shield family, slot/coverage posture, static defense/mobility/encumbrance descriptors, material/quality posture, skill/compatibility tags, provenance, and notes.

Current armor/shield/clothing item `useProfiles`, item classifications, equipment slots, and combat hooks remain existing owners until the schema decision reconciles them. A profile must not duplicate or override those fields implicitly.

Armor profiles must not calculate mitigation, equip/unequip items, change resources, apply movement penalties, mutate durability/condition, repair items, or own combat/player state.

## 8. Container Template Boundary

Future `items.container_templates` should be a separate static authority. A template may later describe container class, capacity/slot/bulk posture, allowed categories/tags, portable/fixed/open/enclosed/lockable descriptors, nesting policy, provenance, and notes.

Existing runtime `InventoryBag` records with ids, labels, slot capacity, stacks, and overflow are player state, not static container-template authority. Static templates must not contain actual stacks, contents, current capacity use, owner, location, lock state, item movement, persistence, or UI state.

Whether container items reference templates or some non-item facilities reference them requires a later schema decision.

## 9. Loot Table Boundary

Future general loot tables should live under item content as `items.loot_tables`, not under combat or encounter authority. Item-owned tables can be referenced by monsters, encounters, containers, quests, world sites, vendors, or other sources without making combat the owner of possible item outcomes.

Existing monster `drops`/`loot` arrays and quest reward envelopes remain source-local descriptive authorities. A later loot-table decision must determine whether they remain embedded or migrate to references; no split or migration occurs here.

Loot tables may later define item references, quantity ranges, weights/chances, rarity/context descriptors, conditions, provenance, and notes. They must not roll results, generate instances, populate containers, mutate inventory, apply pity counters, transfer ownership, or pay rewards.

## 10. Currency and Market Value Boundary

Currency remains a separate economy authority, not an item record and not a new item-owned currency profile. `civilization.currency_system` retains denomination/base-unit authority, while runtime `PlayerCurrencyState` retains current wallet balances and transactions.

`civilization.market_item_values` remains economy-owned. It currently references canonical `itemKey`, not item ids, and this decision preserves that live contract. A future identity-normalization decision may consider id references, but item-profile work must not silently change market keys or duplicate value/price fields.

Static items may retain current base-value/currency/value-unit references. They must not own dynamic prices, wallet mutation, exchange transactions, vendor sales, taxes, discounts, or market stock.

## 11. Reward Envelope and Quest Integration Boundary

Quest definitions, quest templates, generated-offer previews, events, and future narrative authorities may reference canonical item ids/keys through their approved contracts without granting items.

Authored reward envelopes remain descriptive. They must not generate item instances, add stacks, change ownership, pay currency, mark rewards claimed, choose quality, mutate durability, write Chronicle entries, or execute quest consequences.

The deferred quest objective/condition decision and existing reward owners remain separate from item profile authority.

## 12. NPC Gear, Vendor Stock, and Service Integration Boundary

Future people/NPC, companion, encounter, faction/guild/institution, settlement, vendor, and service records may reference canonical item/profile/template ids after those authorities exist.

NPC gear references remain descriptive loadout/eligibility context and must not create equipped runtime instances or combat stats. Vendor stock references remain reference-only and must not define current stock, quantity, price, restock timing, ownership, transaction, theft, service access, or shop UI state.

Economy/shop/service runtime retains market and transaction behavior; person/NPC authority retains identity; item authority retains what the referenced item is.

## 13. Magic Item, Catalyst, Conduit, and Reagent Boundary

Existing item conduit/catalyst metadata and spell compatibility metadata remain static reference/compatibility authority. Magic-study sources, rituals, spells, items, and crafting may later cross-reference canonical items/profiles after explicit decisions.

Magic item metadata must remain non-mutating. It must not grant spell access or ownership, create study evidence, alter readiness, consume catalysts/reagents, reserve inventory, apply attunement, execute casting, create enchanted items, or change durability/charges.

Scrolls, tomes, focuses, reagents, enchanted equipment, and alchemical tools require their study/item/crafting/runtime owners before behavior is approved.

## 14. Crafting, Materials, and Production Integration Boundary

Items retain output/input identity; civilization production/workplace authorities retain jobs, production chains, recipe-profile context, tools, materials, labor, and simulation; future crafting authority owns transformations/recipes/learning; economy retains values and markets.

Weapon/armor/container/loot profiles may reference materials, tags, tools, or crafting authorities descriptively after supported owners exist. They must not craft, repair, upgrade, salvage, consume inputs, generate quality, mutate inventory, alter stock, calculate prices, or transfer ownership.

No crafting or production normalization is authorized by this item boundary.

## 15. Combat, Encounter, and Drop Integration Boundary

Combat and encounter systems may reference canonical items, current embedded use profiles, future weapon/armor profiles, and future loot tables. Monsters currently own embedded descriptive drop/loot envelopes; combat runtime owns actor/action/effect resolution; spawn profiles own encounter selection envelopes.

Item/equipment content must not calculate damage/mitigation, resolve hooks, equip actors, apply conditions, consume ammunition, mutate resources/durability, roll loot, spawn drops, populate corpses/containers, or award items.

Because the source artifact was item/inventory-focused rather than a complete combat report, a dedicated combat Deep Research pass should be rerun later before a broad combat/injury/death/recovery authority decision.

## 16. Player Inventory, Equipment, Container, and Item-Instance Runtime State Boundary

Existing runtime/save contracts already own inventory bags/stacks/overflow, equipment slots/equipped refs, item ids/keys, quantities, optional current durability, and player wallet balances. New-game/UI code currently constructs starter inventory/equipment/wallet state. This decision preserves those owners unchanged.

Future item-instance state may add unique instance identity, owner, current container/location/slot, condition/durability, repair, quality, stolen/bound state, charges, provenance, and movement history only through dedicated runtime/save decisions.

Static items/profiles/templates/tables must not contain mutable instance, inventory, equipment, container-content, wallet, ownership, or transaction state. Inventory/equipment runtime, durability, loot generation, reward payout, vendors, storage, and UI remain deferred from this pass.

## 17. First Implementation Candidate

The first implementation candidate is a documentation-only `Weapon And Armor Profile Schema Decision`.

Canonical item identity and consumable profiles already exist. Weapon and armor are the narrowest missing static profile authorities, but current embedded `useProfiles`, equipment slots, combat hooks, item classifications, and runtime equipment refs must be reconciled before schemas are created.

Container templates and loot tables should follow in a separate later decision. No schema, validator, content, test, runtime, UI, storage, or gameplay change is authorized here.

## 18. Future Validation Direction

Later schema and validator work should be staged separately and eventually enforce:

1. preservation of unique canonical item ids, item keys, aliases, and item classes;
2. valid consumable/profile/template/table references and category compatibility;
3. explicit ownership between existing item `useProfiles` and future weapon/armor profile fields, with no duplicate combat metadata;
4. weapon/armor item classification, slot, skill, tag, and hook coherence;
5. container-template capacity/category/nesting coherence without contents/state;
6. loot-table item reference, range/weight/chance, context, and source-reference coherence without rolls;
7. currency/value references remain economy-owned and current market `itemKey` contracts remain valid;
8. reward/NPC/vendor/magic/crafting/combat/encounter references remain non-mutating;
9. no inference of item instances, ownership, durability, inventory, equipment, stock, or payout from static references;
10. rejection of current quantity/owner/container/slot/durability/condition/stolen state, item movement, inventory/equipment/container contents, wallet mutation, loot generation, reward payout, item consumption, vendor transactions, repair, runtime, storage, UI, command, event, reward, or gameplay fields.

No schema, validator, test, content, or content-lint change is authorized by this decision.

## 19. Temporary Research Artifact Handling

`docs/dev/tmp-item-equipment-inventory-systems-research-2026-06-20.md` was consumed as planning input and remains temporary, not final canon.

Keep it through the next weapon/armor profile schema-decision pass because it contains candidate fields and later container, loot, currency, durability, quality, ownership, vendor, reward, runtime, and UI questions not fully promoted here. That pass must delete it if all useful item guidance is promoted, or retain it only with a named next concrete consumer and removal condition.

The artifact must not be treated as complete combat research. A later dedicated combat research artifact should supersede its combat-adjacent gaps.

## 20. Non-Goals

- no schema, validator, content JSON, test, Knowledge registry, or snippet changes;
- no economy, crafting, combat, quest, magic, NPC/social, travel, geography, religion, family, or civic authority changes;
- no runtime system, UI, storage, inventory/equipment/item-instance state, container contents, loot generation, reward payout/item grant, item consumption, vendor/shop transaction/stock, wallet mutation, durability/repair, ownership/stolen state, combat calculation, spellcasting consumption, command, event, reward, or gameplay behavior;
- no migration, compatibility alias, profile extraction, market-key normalization, data rename, or transition to `0.6.0`.

## 21. Next Recommended Version

`Version 0.5.210 - Weapon And Armor Profile Schema Decision`

That run should remain documentation-only and decide exact profile paths/wrappers/ids, item references, shared-vs-distinct fields, ownership against current embedded `useProfiles`, equipment-slot/combat-hook references, forbidden fields, validation ownership, future implementation order, and temporary-artifact cleanup without implementation.
