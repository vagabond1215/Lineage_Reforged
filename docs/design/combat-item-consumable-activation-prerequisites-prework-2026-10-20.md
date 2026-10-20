# Combat Item And Consumable Activation Prerequisites Prework

Date: 2026-10-20. Repository: `vagabond1215/Lineage_Reforged`. Connector-only independent documentation pass following equipment/ammunition prework at `e36ca04e0014b8d4bbae8f7815286cc11c39f8a2`. **ITEM_ACTIVATION_PREREQUISITES_ONLY; NO EXECUTABLE COMBAT USE AUTHORIZED.** Development impact `none`, Game-version impact `none`. The active Codex `DEV-0.7.2.1 Combat Terminal Owner And Durability Slice` is untouched.

## Problem statement and current live seams

The project wants eventual contextual combat choices involving healing, medicine, antidotes, poisons, food, thrown/used items and enchanted equipment. That desired breadth must not be mistaken for current executable breadth.

1. `packages/content/base/items/items.json` owns canonical item records, including optional `useProfiles` for some action-bearing equipment and `consumableProfileId` for eligible consumables. `items.consumable_profiles` is a separate static/nutrition descriptor authority, **not** a generic healing potion or dose effect engine.
2. `apps/rpg-ui/src/features/CharacterPanel.tsx` currently exposes `Use Consumable` on selected inventory entries labeled consumable. `characterPanelState.ts::consumeInventoryItem` validates an authored `consumableProfileId`, decrements one eligible stack quantity and applies `applyConsumableToBodyState` through a Character-panel state helper. It is **not** `player-nearby-encounter.ts::executeNearbyEncounterStep` and does not establish combat timing, queue, target, combat result/ledger, enemy interruption, or per-dose/charge semantics.
3. Combat item-granted actions are currently derived from **equipped** item use profiles via `buildPlayerHooks` and resolved through the combat action template path. This does not prove that an inventory-held potion may be activated, whether an item is consumed on queue/start/resolve, or whether a supported effect owner applies it.
4. The accepted [Item/Equipment/Inventory Authority Boundary](item-equipment-inventory-authority-boundary-decision.md) and [Item-Use Grant/Charge/Dose Audit](../dev/evidence/branch-consolidation-2026-09-07/audits/item-use-profile-grant-charge-dose-and-effect-ownership-audit.md) explicitly distinguish item definition, possession, activation, consumption, instance/stack, and effect owner. They reject inferred universal use or inventory quantity behavior.
5. The accepted [Contextual Action Surfaces Decision](contextual-action-surfaces-inventory-crafting-and-trade-decision.md) says the player may **select an item in inventory**, but an appropriate domain owner must execute the actual action. Combat context can alter availability and method; it does not convert inventory UI into a combat-authoritative resolver.

This is a later design problem even if the UI currently permits navigation to Character while a battle is active. The existence of a visible item button in another panel does **not** establish that its behavior is admitted as a combat action or that it observes action economy. A later integration review should decide whether that route must be blocked, delegated or explicitly supported during active encounters, without asserting a defect before a focused live test.

## Required owner contract questions before activating an item

| Concern | Explicit owner question and proposed guard |
| --- | --- |
| Actor/context | Which actual player/companion/foe owns activation, and is the encounter active, paused, recovering or out of combat? Do not permit a UI menu to bypass combat status. |
| Item reference | Which canonical item ID plus **current owned stack/instance and container** is selected, with what actual quantity/charges/dose? Never identify a mutable copy solely by display name or static `itemKey`. |
| Access and equipment | Is the item in reach, possessed or properly equipped/held; can both hands perform the action; does current source validate item eligibility? |
| Action identity | Is there an explicit domain-owned combat-item command distinct from equipped weapon action/grant and Character-panel nutrition use? Do not silently alias `combat.ranged.primary` or generic consume. |
| Target | Self, ally, enemy, item, place or no target as supported by **the exact** item/effect owner, not by generic combat UI family grouping. |
| Time/cost | Queue/start/resolution/recovery, HP/MP/Stamina/resource costs, interruption and whether use consumes a beat or an activity. Exact payment moment must be owner-defined. |
| Quantity posture | Whole stack unit, serving, dose, charge, durability, nonconsuming reusable use or loaded ammunition. No universal “subtract one” across categories. |
| Effect semantics | Dedicated healing/health/body-state, condition, status, poison, alchemy, magic or other approved owner validates potency, target resistance, timing, stacking and effect. Metadata channels are not execution. |
| Atomicity | Inventory quantity/state mutation and effect apply together under admitted owner transaction, or neither does. Rejected/duplicate/stale/conflict actions cannot charge twice or deliver duplicate effects. |
| Failure/rollback | Invalid owner, unavailable target, empty stack, unsupported effect, interrupted cast/use, insufficient turn resources, failed admission, reload and undo/correction policies must be explicit. |
| Observability | Separate “available for use”, “command accepted”, “item spent” and “effect resolved” receipts. Chronicle/log may display only accepted facts. |
| Persistence | Current stack/charge, target state, action/ledger identity and reload/restart outcomes must remain coherent across the actual save owner. Any new item-instance representation needs its own migration decision. |

## Conservative future scope boundaries

- **Food/drink**: existing `consumableProfileId` nutrition/body-state behavior is one narrow supported Character-panel path; its exact legality **during combat** must be separately checked and approved. It is not a general healing/antidote/poison system.
- **Field bandages, medicine, antidotes and potions**: authored item names, descriptors or inventory quantity are not proof of supported combat heal, cure, dose or HP mutation. Require actual effect and health/care owner before advertising them as actions.
- **Poisons and coatings**: cannot be modeled by granting a generic “poison” tag and decrementing any stack; weapon coating, persistence, target/status effects and expiry need explicit owner semantics.
- **Thrown/projectile objects**: distinguish a carried throwable item action from a weapon's ranged profile and from the separate ammo owner described in [Ranged Equipment/Ammo Prework](combat-equipment-and-ranged-ammunition-interface-prework-2026-10-20.md).
- **Magic items, scrolls, conduits and catalysts**: possession and spell metadata cannot bypass known-spell/cast resolver requirements or substitute for charges/attunement ownership.
- **Equipment damage/durability**: belongs to a later item-condition transaction, not generic use/consume.
- **Presentation**: eventual inventory/context item card can offer only owner-supplied legal item actions; a Combat “Use Item” expansion may select an item and target, but cannot implement legality, quantity or effects itself.

## Candidate minimum slice to evaluate *after* active combat-terminal and creator decisions

Do not implement a universal combat-item framework first. Pick **one** real item category with a fully supported owner for both quantity and effect (for example, a specifically authored supported consumption action if actual owner/caller inspection confirms it). Then produce a dedicated decision that selects exact command/target/quantity semantics, rejects everything else by default and proves real campaign admission.

If no candidate provides both effect and quantity ownership, the safe result is a **missing-owner decision**, not fake activation or an unlogged UI shortcut.

## Future owner/caller acceptance scenarios (not executed)

| ID | Intended later fixture | Invariant to prove |
| --- | --- | --- |
| I1 | Player owns supported eligible stack | Exact item/stack reference, legal context and correct owner action offered |
| I2 | Only item definition exists, no owned copy | No command activation, charge or effect |
| I3 | Owned item with unsupported combat effect | Safely omitted or owner-explained blocked; no invented healing |
| I4 | Self/ally/enemy target mix | Only item's approved target disposition can be chosen and revalidated |
| I5 | Busy, paused, incapacitated or pending recovery actor | Owner gates the command without mutation |
| I6 | Stack one, stack many, charged/reusable item | Quantity/dose/charge debit agrees with approved posture, not a generic decrement |
| I7 | Successful accepted action and effect | Exactly one inventory-state change, correct effect and single result/receipt |
| I8 | Duplicate, conflict, stale, reordered or wrong-owner request | No second quantity/effect; coherent existing ledger |
| I9 | Interrupted/cancelled after reservation | Refund/consumption follows explicit timing rules; no duplicated item |
| I10 | Admission fails or serialization/restart | Inventory/effect/resource state remains transactionally consistent |
| I11 | Navigate to Character item surface mid-combat | Check actual selected behavior and whether combat action-economy bypass exists; do not presume either answer |
| I12 | A later medical, alchemical or magical item | Do not promote until its separate health/condition/spell/item owner is executable |

## Reuse and safeguards

This prework consumes [Combat Skeleton First](combat-skeleton-first-priority-and-acceptance-boundary-decision.md), [Item/Equipment Boundary](item-equipment-inventory-authority-boundary-decision.md), [Contextual Item Actions](contextual-action-surfaces-inventory-crafting-and-trade-decision.md), [Creator-to-Combat Compatibility](creator-to-combat-input-compatibility-prework-2026-10-20.md) and [Ranged Ammo Prework](combat-equipment-and-ranged-ammunition-interface-prework-2026-10-20.md). It is not an implementation schedule override for the active Codex run.

**Pass limit:** one new document only. No runtime/schema/content/UI/test/save/migration changes, no selected browser/protected account/hosted site/branch operations, no Game/DEV acceptance, no active prompt/handoff edits. Further work requires a fresh source check and an explicitly chosen owner/action.
