# Inventory Stack And Item Instance Identity Audit

Date: 2026-08-27

Status: `AUDIT_COMPLETE_CURRENT_STACKS_FUNGIBLE_INSTANCE_MODEL_DEFERRED`

Execution surface: ChatGPT via GitHub Connector; documentation-only/read-only

Source baseline: `5d6468ec4523564affdd4c1b5eb1a85c682cf519`

Active route protected: `Integrated Gameplay 0.7 Band-Entry Readiness Decision`

## 1. Result

Current player inventory is a **fungible stack model**, not an item-instance model.

The live runtime stack contract is:

```ts
export interface InventoryStack {
  itemId: string;
  itemKey: string;
  quantity: number;
}
```

A carried stack has no runtime field for:

- unique stack id;
- item-instance id;
- durability/condition;
- quality;
- provenance;
- owner;
- stolen/legal state;
- binding;
- crafter;
- custom name;
- enchantment/affix;
- charges;
- spoilage/age;
- repair history;
- acquisition occurrence.

Current carried-stack identity is therefore effectively the pair:

`itemId + itemKey`

plus its current container/list position for UI addressing.

That is sufficient for current fungible starter items and simple consumables. It is not sufficient for durable individualized equipment, crafted-quality outputs, provenance-bearing rewards, heirlooms, stolen goods, unique loot, repair/salvage, or other differentiated-item systems.

No runtime/schema change is authorized by this audit.

## 2. Static Item Identity Versus Runtime Inventory Identity

The accepted item boundary remains:

- static canonical item identity: `packages/content/base/items/items.json`;
- runtime player inventory: `PlayerInventoryState`;
- runtime equipment: `EquipmentState`.

Static item records answer **what an item type is**.

Runtime stacks/equipment answer **what this player currently carries or equips**.

Static item/profile fields must not be used as mutable ownership, condition, durability, quality, provenance, or item-instance state.

## 3. Current Player Inventory Contract

`PlayerInventoryState` contains:

- `bags: InventoryBag[]`;
- `overflow: InventoryStack[]`.

Each bag contains:

- `id`;
- `label`;
- `slotCapacity`;
- `stacks`.

Each `InventoryStack` contains only:

- `itemId`;
- `itemKey`;
- `quantity`.

There is no durable `stackId`.

UI constructs presentation ids such as:

`inventory.<bagId>.<itemId>.<stackIndex>`

Those ids are derived from position and must **not** be promoted into canonical stack identity. Reordering or stack insertion can change the index.

## 4. Current Merge Semantics

The current inventory helpers in both gameplay-shell and character-panel paths merge stacks when:

- `entry.itemId === stack.itemId`; and
- `entry.itemKey === stack.itemKey`.

If a matching stack exists in any bag, quantity is added there.

Otherwise:
- a new stack is placed in the first bag with open stack capacity;
- if no bag has room, overflow is searched for the same `itemId + itemKey`;
- otherwise a new overflow stack is appended.

Therefore the current system assumes all units with the same canonical item identity are interchangeable.

Disposition:

`FUNGIBLE_STACK_BY_CANONICAL_ITEM_PAIR`.

## 5. Current Removal Semantics

The legacy quest/gameplay helper `removeInventoryQuantity(...)` removes by:

`itemKey`

rather than by a durable stack or instance identity.

It walks:
1. bags;
2. overflow;

and subtracts quantity until the requested amount is met.

Implications:

- physical source stack is not part of the command identity;
- no reservation occurs;
- no consumption receipt identifies which stacks supplied the quantity;
- differentiated copies cannot be selected;
- if inconsistent data contained more than one `itemId` for the same `itemKey`, removal would not distinguish them.

This is acceptable only for fungible compatibility behavior.

It is not safe as the future owner for differentiated quest handoff, crafting ingredients, unique loot, or provenance-sensitive goods.

## 6. Equipment Is Already More Differentiated Than Inventory

`EquippedItemRef` currently contains:

- `itemId`;
- `itemKey`;
- `quantity`;
- optional `durability`;
- optional `resourceModifiers`.

Starter equipment is created with:

`durability: 1`.

This means equipment already carries mutable/per-copy data that ordinary inventory stacks cannot represent.

### Current compatibility workaround

When equipment is unequipped, the carried stack receives only:

- itemId;
- itemKey;
- quantity.

The richer equipped record is serialized into a session flag:

`ui.character.item-stash.<itemId>.<encoded JSON>`

and later restored by matching `itemId`.

This is explicitly presentation/session compatibility scaffolding.

It demonstrates a real identity gap:

- two copies with the same `itemId` cannot be independently represented by that stash key;
- carried inventory does not own durability/modifier state;
- session flags are temporarily carrying item metadata that belongs in a future inventory/item-instance owner.

Disposition:

`EQUIPMENT_METADATA_STASH_IS_COMPATIBILITY_DEBT`.

Do not expand this flag mechanism.

## 7. Starter Inventory Behavior

New-game construction:

1. builds canonical starter stacks;
2. selects equipment from those stacks;
3. subtracts one unit from the corresponding `itemId + itemKey` quantity;
4. places remaining quantities in the traveler satchel;
5. gives equipped copies durability `1`.

This works because starter items are treated as fungible until equipped.

It does not establish unique item creation.

## 8. Favorites And UI Selection

Current item favorites are keyed by:

`itemKey`

through session flags.

That means “favorite” currently applies to the item type, not one physical copy.

Inventory UI selection uses container/index-derived presentation identity.

Neither is item-instance authority.

## 9. Existing Related Runtime/Static Concepts

### Durability

Runtime durability exists on `EquippedItemRef`.

It does **not** exist on `InventoryStack`.

Static weapon/armor profile durability metadata, where present, describes item-type behavior/capability and is not current durability.

### Resource modifiers

Runtime equipment can retain `resourceModifiers`.

Inventory cannot carry them except indirectly through the session-flag stash workaround.

### Quality

Crafting/economy resolution already contains quality-related calculation concepts.

Those are macro/static/projection results and do not create player-owned quality-bearing item instances.

Future player crafting authority explicitly anticipates:
- selected input item instances;
- output creation;
- quality/affix results;
- repair/salvage changes.

### Provenance / ownership

No ordinary carried stack owns provenance or ownership fields.

Account estate structures can record item references and source-run/deposit context, but they are estate-transfer records, not a general player item-instance model.

### Containers

Current `InventoryBag` is player runtime storage.

Future static container templates remain separate and deferred.

Bag identity must not be treated as item-instance identity.

## 10. Three Identity Classes Recommended For Future Design

This is a design recommendation for a future owner contract, not an implemented schema.

### A. Fungible stack

Use when every unit is operationally interchangeable.

Examples likely include:
- basic currency-like commodities where not modeled as wallet currency;
- identical raw materials;
- ordinary ammunition/consumables when no freshness/quality/provenance difference matters;
- common standardized supplies.

Required identity can remain:
- canonical item type;
- quantity;
- container placement.

A future durable `stackId` may still be useful for transaction/replay identity, but it need not imply unique items.

### B. Differentiated stack

Use when several units can stack only because all members share the same relevant mutable characteristics.

Possible future split keys:
- quality tier;
- condition band;
- provenance/legal state;
- crafted batch;
- freshness/spoilage band;
- enchantment/affix set;
- ownership/binding state.

Do not include every imaginable field in one universal stack fingerprint. Only fields owned by accepted systems should participate.

### C. Unique item instance

Use when one physical item must retain its own history/state.

Likely triggers:
- equipment durability;
- named/masterwork items;
- heirlooms;
- unique quest objects;
- individualized enchantments;
- repair history;
- custom naming;
- per-item ownership/provenance;
- stolen/legal evidence;
- one-off artifacts.

A unique item should have a durable stable `instanceId` unrelated to list index or UI ordering.

## 11. Why One Universal Item-Instance Model Should Not Be Prebuilt

Not every item needs a UUID and full provenance ledger.

Forcing common commodities into one-record-per-object identity would:
- inflate saves;
- complicate quantities;
- increase transaction/merge overhead;
- make simple consumption unnecessarily expensive;
- create fields for systems that do not yet exist.

Conversely, treating all items as fungible stacks loses identity needed for equipment and future higher-value systems.

Recommended posture:

`FUNGIBLE_BY_DEFAULT; PROMOTE_TO_DIFFERENTIATED_OR_UNIQUE_WHEN_AN_ACCEPTED_OWNER_REQUIRES_IT`.

## 12. Future Mutation Requirements

A proper inventory owner eventually needs explicit operations such as:

- add/create stack;
- split stack;
- merge compatible stacks;
- move stack;
- reserve quantity;
- consume reserved quantity;
- create unique instance;
- equip/unequip while preserving identity;
- update condition/durability;
- transfer ownership;
- destroy/salvage;
- correct/reconcile after restart.

The exact command set should be derived from the first real consumer rather than invented generically.

## 13. Persistence And Migration Implications

A stronger identity model affects serialized player state.

Future migration must define:

### Existing fungible stacks

Current records can normally migrate as fungible stacks without inventing per-unit histories.

If durable stack ids are introduced, migration must generate them deterministically or through a versioned migration identity rule—not from current array index alone.

### Equipped items

Current equipped records already contain durability/modifiers.

Migration must preserve those facts and stop relying on session flags as metadata escrow.

### Stashed equipment flags

`ui.character.item-stash.*` needs a dedicated migration/retirement rule once inventory can own the richer item state.

Do not delete these flags before equivalent state is proven preserved.

### Save/restart

Inventory transaction identity will eventually need:
- durable mutation/request identity;
- duplicate/retry behavior;
- atomic transfer/consumption;
- correction posture;
- restart equivalence.

A journal flag or post-state quantity alone is not a delivery/consumption receipt.

## 14. Consumer Readiness Matrix

| Future consumer | Current stack model sufficient? | Stronger identity likely needed? | Reason |
| --- | --- | --- | --- |
| ordinary identical consumable use | mostly yes | not necessarily | quantity-only fungible use |
| current starter inventory | yes | no immediate need | homogeneous stacks |
| current equipment | partially | **yes** | durability/modifiers already exceed stack schema |
| quest currency reward | separate wallet | no inventory instance | wallet owner |
| quest ordinary fungible item reward | limited | durable add receipt first | duplicate/restart delivery |
| quest unique/provenance item | no | **unique instance** | one physical reward identity |
| cargo/item handoff | weak | reservation/receipt, possibly stack id | exact consumption evidence |
| player crafting inputs | weak | differentiated/instance selection when relevant | quality/provenance/tools |
| crafted outputs | no for quality-bearing outputs | differentiated/unique | quality/affixes/crafter |
| repair | no | **unique/differentiated** | condition history |
| salvage | no | **unique/differentiated** | exact source object |
| loot | fungible only | varies | unique drops/provenance |
| heirloom/inheritance | no | **unique instance** | lineage continuity/history |
| stolen/legal goods | no | differentiated/unique | legal provenance |
| vendor stock | static/market layer only | future transaction identity | ownership/quantity transfer |

## 15. Relationship To Quest Turn-In

Pass 10 established that quest turn-in/reward delivery needs a real consequence receipt owner.

This audit sharpens that boundary:

- a future Soundings monetary payout can remain wallet-only and does not require item instances;
- a fungible item reward requires a replay-safe inventory add/receipt but may not need unique instances;
- a unique item/service/access reward must use the corresponding specific downstream owner;
- legacy `removeInventoryQuantity(itemKey, quantity)` is not sufficient evidence for provenance-sensitive handoff.

Do not build item instances solely because quest turn-in exists.

## 16. Relationship To 0.7 Band Entry

The accepted current representative survey loop explicitly declares inventory as:

`no_proposal`.

Therefore this audit does **not** establish inventory as a mandatory prerequisite for the active `0.7` band-entry decision.

The milestone decision must interpret its own “required inventory/resource ownership for included interactions” criterion against the actual included survey interaction.

Do not use this future inventory gap to prejudge `BAND_ENTRY_NOT_READY`.

## 17. Findings

### F-01 — Runtime inventory is fungible

`InventoryStack = itemId + itemKey + quantity`.

### F-02 — Current merge identity is itemId + itemKey

No mutable state participates in stack compatibility.

### F-03 — Legacy quantity removal is itemKey-only

This is insufficient for differentiated consumption.

### F-04 — Equipment already has richer per-copy state

Durability and resource modifiers exist on equipped refs.

### F-05 — Session flags temporarily escrow equipment metadata

This is compatibility debt and cannot scale to multiple same-id differentiated copies.

### F-06 — UI ids are positional

Container/stack-index ids are presentation only, not durable stack identity.

### F-07 — Crafting/reward/repair/heirloom consumers will require stronger identity selectively

Do not universalize before a concrete consumer.

## 18. Future Product Decisions

Repository evidence cannot decide all policy.

Before a differentiated-item implementation, the user/product authority should eventually decide:

1. Which item families should remain fully fungible even when quality systems exist?
2. Should quality be continuous, tiered, or owner-specific by system?
3. Should provenance affect stacking only when gameplay-relevant, or always?
4. Which legal/ownership facts should physically follow an item?
5. Should repaired equipment retain repair history or only current condition?
6. Which crafted goods retain crafter/batch identity?
7. At what point does an heirloom/masterwork become a named unique instance?
8. Should identical unique equipment ever recombine into a stack when unequipped? Recommended default: no.

These do not block the current milestone decision.

## 19. Recommended Future Owner Decision

When a real consumer requires stronger item identity, open:

**Inventory Stack Identity, Item Instance, And Transaction Receipt Owner Contract Decision**

The first implementation should be tied to one concrete consumer, likely:
- equip/unequip identity preservation;
- a quest item handoff/reward;
- or player crafting input/output.

Do not build all three at once.

## 20. Decision

`CURRENT_STACKS_FUNGIBLE_INSTANCE_MODEL_DEFERRED`

Preserve current compatibility behavior until a concrete runtime consumer justifies the versioned migration.

No source/schema/content/test/save change is authorized here.
