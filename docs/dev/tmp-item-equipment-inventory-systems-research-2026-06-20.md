# Temporary Deep Research: Items, Equipment, Inventory, Containers, Loot, and Item-State Boundaries

Status: temporary research artifact for Codex planning
Date: 2026-06-20
Source: Deep Research run launched from the user-provided combat/injury/encounter prompt, but the produced report focused primarily on items, equipment, inventory, containers, loot, and item-state boundaries.
Intended use: staging reference for a later narrow Codex planning pass.

> Temporary-file policy: this file is not final design canon. It should either be converted into one or more permanent `docs/design/**` decision documents or deleted after the relevant Codex planning passes land.

## 1. Executive Summary

The Deep Research report concluded that Lineage Reforged already has a rudimentary but important item foundation:

- `packages/content/base/items/items.json` appears to be the canonical base item registry.
- `packages/content/base/items/consumable_profiles.json` is used by UI/runtime presentation.
- UI/runtime code distinguishes inventory entries from equipment entries and enumerates equipment slots.
- Item categories include weapon, armor, accessory, consumable, tool, document, and material.
- Economy documentation already treats canonical item keys and market item values as core economy references.
- Magic-related item metadata exists for conduits, catalysts, and casting compatibility.

The report also found important absences or gaps:

- no dedicated content authority was identified for weapon profiles;
- no dedicated content authority was identified for armor profiles;
- no static container-template authority was identified;
- no loot-table authority was identified;
- no currency profile authority was identified;
- inventory and equipment are runtime/UI state concepts, not static content authority;
- item durability, current ownership, quantity, condition, location, and container contents are mutable state concerns.

The strongest recommendation is to separate static item definitions from mutable item ownership and inventory state. Content should define what items, equipment profiles, containers, currencies, and loot tables can exist. Runtime/save state should track which specific items exist, where they are, who owns them, their quantity, their condition/durability, and whether they are equipped.

The safest next Codex pass is:

`Version 0.5.209 - Item Equipment Inventory Authority Boundary Decision`

That pass should be documentation-only and should correct this temporary artifact against the live repository before any schema work.

## 2. Research Scope Note

The uploaded prompt requested combat, injury, death, recovery, enemies, encounter resolution, and combat-state research. The resulting Deep Research report instead emphasized item/equipment/inventory authority, loot, containers, currencies, durability, and acquisition boundaries.

Do not treat this artifact as a complete combat authority research result. It should be consumed as an item/equipment/inventory planning artifact. A later dedicated combat run may still be needed.

## 3. Current Repo-State Claims To Verify

Codex must inspect the live checkout and correct these claims before permanent docs are written:

- `packages/content/base/items/items.json` is the canonical item registry.
- `packages/content/base/items/consumable_profiles.json` exists and is used by UI/runtime code.
- UI imports item and consumable catalogs.
- UI/runtime has `InventoryEntry` and `EquipmentEntry` concepts.
- Equipment slots include left/right weapon, armor body slots, and accessories.
- Economy docs reference canonical item keys, market item values, and a copper-penny scale.
- Item metadata already supports magic conduits/catalysts/casting tags.
- There are no dedicated weapon, armor, container, currency, loot-table, ownership, durability, or static inventory-instance collections.

## 4. Current Gaps And Risks

### 4.1 Static vs runtime conflation

Item definitions must not contain current owner, current quantity, current condition, current durability, current container, current equipment slot, stolen state, quest-instance state, or player-specific values.

### 4.2 Inventory overhead

Inventory management can become tedious if capacity, category, sorting, stacking, and encumbrance are not decided deliberately. Static content should support useful UI/runtime decisions without forcing micromanagement into content.

### 4.3 Loot distribution risk

No validated loot-table authority means future combat/encounter rewards could become ad hoc, overpowered, unrewarding, or hardcoded. Loot should be described by content tables and executed by runtime.

### 4.4 Equipment profile ambiguity

Weapons and armor need clear static profile ownership so combat can later reference damage, defense, slot, material, quality, and compatibility without burying all combat logic in item records.

### 4.5 Durability and ownership risk

Static item content may define `maxDurability`, repairability, tags, or vulnerability posture, but current durability, breakage state, repair state, item instance id, ownership, theft, and binding are runtime/save concerns.

## 5. Recommended Item / Inventory Hierarchy

Recommended hierarchy:

```text
Item Definition
  -> Optional Weapon Profile
  -> Optional Armor Profile
  -> Optional Consumable Profile
  -> Optional Tool / Document / Material Metadata
  -> Optional Currency / Value Profile
  -> Optional Container Template
  -> Optional Loot Table Entry Reference
    -> Runtime Item Instance
      -> Runtime Inventory Entry
      -> Runtime Equipment Entry
      -> Runtime Container Contents
      -> Runtime Ownership / Condition / Durability
```

Parallel generation model:

```text
Loot Table / Reward Envelope / Vendor Stock Template
  -> Runtime Generated Item Instance(s)
    -> Inventory / Container / Equipment State
```

## 6. Item Definition Boundary

A static item definition may own:

- id;
- slug/name/display name;
- summary/description;
- category;
- base tags;
- base value reference;
- base weight/bulk if approved;
- static max durability if approved;
- equipment slot compatibility if approved;
- profile references;
- sourceAuthorityNotes;
- notes.

A static item definition must not own:

- current quantity;
- owner;
- container id;
- current slot;
- current durability;
- current condition;
- stolen/contraband state on a specific copy;
- inventory state;
- reward payout;
- runtime effects;
- UI state;
- storage state.

## 7. Equipment Profile Boundary

Weapon and armor profiles should be considered future static authorities or static subprofiles.

Weapon profiles may later own:

- weapon class;
- damage type descriptors;
- range posture;
- handedness/slot posture;
- base attack descriptors;
- material/quality posture;
- compatibility tags;
- sourceAuthorityNotes.

Armor profiles may later own:

- armor class;
- slot/coverage posture;
- defense type descriptors;
- material/quality posture;
- mobility/encumbrance descriptors;
- compatibility tags;
- sourceAuthorityNotes.

They must not execute damage, calculate mitigation, mutate durability, equip items, or own combat runtime state.

## 8. Container And Inventory Boundary

Container templates may later define:

- container type;
- capacity band or slot count;
- allowed item categories;
- enclosed/open posture;
- portable/fixed posture;
- lockability descriptor;
- sourceAuthorityNotes.

Runtime owns:

- specific container instances;
- container contents;
- player inventory entries;
- equipment entries;
- quantities;
- stack state;
- item movement;
- persistence.

## 9. Loot And Acquisition Boundary

Loot tables should describe possible drops or rewards. They must not create item instances.

A future loot table may own:

- source id or source type;
- item references;
- quantity ranges;
- weight/probability descriptors;
- rarity band;
- conditions as descriptors;
- sourceAuthorityNotes.

Runtime owns:

- actual rolls;
- generated item instances;
- reward payout;
- pickup state;
- chest/container population;
- pity counters;
- player inventory mutation.

## 10. Currency And Economy Boundary

Currency may be modeled as canonical item definitions or a dedicated currency profile authority after a decision. Economy owners retain market item values, value bands, and price rules.

Static content may define currency denomination and base value. Runtime owns player wallet/current balance and transaction execution.

## 11. Magic Item Boundary

Magic-related item metadata may describe:

- conduits;
- catalysts;
- focuses;
- reagents;
- scrolls;
- grimoires;
- compatibility tags;
- spell or study-source references after authority exists.

It must not grant spell access, mutate spell readiness, consume catalysts, create study evidence, or execute casting.

## 12. Quest, Combat, Travel, And NPC Integration

Items may be referenced by:

- quest reward descriptors;
- quest objective descriptors;
- combat loot envelopes;
- encounter templates;
- spawn profiles;
- vendor/service descriptors;
- crafting recipes;
- travel supply profiles;
- magic study sources;
- NPC gear descriptors.

Those references must remain descriptive until runtime owners execute inventory mutation, reward payout, item consumption, vendor transactions, crafting, or combat resolution.

## 13. Proposed Future Collections

Candidate future collections or authorities:

| Collection | Candidate path | Purpose |
|---|---|---|
| existing `items.items` | `packages/content/base/items/items.json` | canonical base item identity |
| existing `items.consumable_profiles` | `packages/content/base/items/consumable_profiles.json` | consumable nutritional/use descriptors |
| `items.weapon_profiles` | `packages/content/base/items/weapon_profiles.json` | static weapon descriptors |
| `items.armor_profiles` | `packages/content/base/items/armor_profiles.json` | static armor descriptors |
| `items.container_templates` | `packages/content/base/items/container_templates.json` | static container capacity/category descriptors |
| `items.loot_tables` | `packages/content/base/items/loot_tables.json` | possible drops/reward envelopes |
| `items.currency_profiles` | `packages/content/base/items/currency_profiles.json` | currency denomination/value descriptors |
| `player.inventory_state` | runtime/save | mutable inventory contents |
| `player.equipment_state` | runtime/save | mutable equipped items |
| `player.item_instance_state` | runtime/save | unique item copies, durability, owner, condition |

## 14. Validation Direction

Future validators should enforce:

1. strict records-only wrappers;
2. id and slug consistency;
3. valid category enum values;
4. all profile references resolve;
5. weapon/armor item categories match profile types;
6. consumable profiles reference valid consumable item ids;
7. loot tables reference valid item ids;
8. currency profile values are positive and coherent;
9. container template capacity values are valid;
10. no runtime inventory/equipment/ownership/durability/quantity fields in static item records;
11. no reward payout, item grant, item consumption, vendor transaction, crafting execution, or combat execution fields in static content.

## 15. Authored vs Generated Strategy

Fully authored:

- base item identities;
- consumable profiles;
- weapon/armor profile definitions;
- container templates;
- currency profiles;
- loot table definitions;
- item tags and compatibility descriptors.

Generated once and saved later:

- unique item variants;
- placed chest instances;
- shop stock snapshots;
- generated loot objects;
- item quality rolls.

Runtime/save later:

- player inventory;
- equipment state;
- current durability;
- item owner;
- container contents;
- item pickup/drop state;
- vendor transactions;
- reward payouts;
- item consumption;
- repair state.

## 16. Recommended Versioned Sequence

Suggested sequence if this item/inventory lane is prioritized:

1. `0.5.209 - Item Equipment Inventory Authority Boundary Decision`
   - docs-only;
   - decide static item/profile/container/loot/currency boundaries vs runtime state.

2. `0.5.210 - Item Profile Schema Decision`
   - docs-only;
   - decide whether weapon/armor/container/currency profiles are separate schemas or staged separately.

3. `0.5.211 - Weapon And Armor Profile Schema Decision`
   - docs-only.

4. `0.5.212 - Container Template And Loot Table Schema Decision`
   - docs-only.

5. `0.5.213 - Item Profile Schema And Validator`
   - schema/validator/tests only.

6. `0.5.214 - Weapon Armor Container Loot Schema And Validator`
   - staged implementation.

7. `0.5.215 - First Equipment And Loot Content Seed Plan`
   - docs-only.

8. `0.5.216 - First Equipment And Loot Content Seed`
   - narrow seed only.

9. `0.6+`
   - inventory runtime;
   - equipment runtime;
   - item instance state;
   - durability;
   - loot generation;
   - reward payout;
   - vendor transactions;
   - inventory UI.

## 17. Open Questions

- Should weapons and armor be separate profile collections or embedded profile objects on item records?
- Should containers be static item definitions with a container profile, or separate container templates?
- Should currency be an item category or a dedicated currency profile authority?
- Should loot tables live under `items`, `combat`, `world`, or `encounters`?
- Should item weight/bulk be required in first-pass item records?
- Should max durability exist now or wait for runtime item-instance state?
- How should item quality/rarity be represented?
- How should market item values align with canonical item ids?
- Which existing item is safest for a first equipment-profile seed?
- Should the broader combat Deep Research be rerun separately because this report focused on items/inventory?

## 18. Recommended Next Codex Prompt

Next recommended narrow Codex prompt:

`Version 0.5.209 - Item Equipment Inventory Authority Boundary Decision`

Goal:
Create a docs-only decision defining static item authority boundaries among canonical item definitions, consumable profiles, future weapon profiles, future armor profiles, future container templates, future loot tables, future currency profiles, market value references, reward envelopes, NPC gear references, and future player inventory/equipment/item-instance runtime state.

Suggested commit message:

`docs(items): decide equipment inventory authority boundaries`

## External References Used By Deep Research

- GameDeveloper inventory-management design articles
- GameDeveloper ARPG loot-table and loot-experience design articles
- Repo data-dictionary economy docs
- Repo UI/runtime character panel state
- Repo magic casting boundary docs around not mutating inventory/equipment during casting
