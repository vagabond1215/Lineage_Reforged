# Combat Equipment And Ranged Ammunition Interface Prework

Date: 2026-10-20. Repository: `vagabond1215/Lineage_Reforged`. Independent connector-only documentation pass, source orientation after `bfa1ccc8033d60893d963873c17dfbfd7f61773f`. **EQUIPMENT/AMMO_PREWORK_ONLY; NO ACTION, EQUIPMENT, INVENTORY OR AMMUNITION RUNTIME DECISION.** Development impact `none`; Game-version impact `none`. Neither this document nor the prior feedback prework changes the installed `DEV-0.7.2.1 Combat Terminal Owner And Durability Slice`.

## Existing ownership and source facts

- Canonical **item identity** remains `packages/content/base/items/items.json`; embedded item `useProfiles` currently carry individual melee/ranged/shield actions, timing, costs, effect hooks and skill/proficiency references. Combat currently derives item grants from equipped `PlayerState.equipment` item IDs, not from every inventory stack.
- Shared equipment state uses separate weapon-hand and armor/accessory slots, while ordinary new-game assembly in `apps/rpg-ui/src/game-shell/newGameSnapshot.ts::buildStarterEquipment` still infers some slot assignments from item-key substrings. No present static profile/slot validation should be invented by combat.
- Both `item.short_bow` and `item.composite_bow` have current `combat.ranged.primary` + `skill.combat.weapon.archery` + `damage.ranged` use profiles. `tests/unit/combat-equipment-mapping.test.mjs` expressly asserts that the Hunter's equipped Short Bow profile matches the current composite-bow ranged profile. The older `combat-equipment-mapping-audit-plan.md` claim that Short Bow has no profile is superseded by live content.
- The Hunter starter bundle authors an `item.arrow_bundle` alongside `item.short_bow`, but **having an arrow bundle is not evidence of ammo reservation, per-shot consumption, compatible projectile selection, quiver capacity, hit/recovery or return of expended ammunition**.
- The approved `weapon-and-armor-profile-schema-decision.md` chooses **future** optional structural weapon and armor profiles distinct from item action `useProfiles`. Proposed static fields may describe handedness, compatible slot, delivery/range and coverage. They may **not** own current ammo counts, durability state, equipped instances, damage formulas, action execution, or inventory movement.
- The approved `item-equipment-inventory-authority-boundary-decision.md` preserves runtime inventory/slot/quantity/durability-like state separately from static item/profile content. The linked August `item-use-profile-grant-charge-dose-and-effect-ownership-audit.md` classifies universal item activation and quantity/effect ownership as absent. No new inventory/instance/ammo owner is created here.
- DEV-0.7.2 self-target Block is real owner/caller code with explicitly bounded equipped-shield validation; the independent selected UI check is still open. This is not proof of hand-conflict rules, shield training or shield breakage.

## Separation of questions before any runtime change

| Question | Existing owner or missing owner | Safe subsequent decision |
| --- | --- | --- |
| Which item record is this? | Canonical `items.items` item ID/key | Preserve it; no parallel weapon identity |
| What actions does this weapon/shield grant? | Item-local `useProfiles` and combat engine exact action resolution | Verify current equipped grant, skill source, action/target, resource payment and blocked states |
| Is the item eligible for a slot or both hands? | Present starter/equip UI heuristics plus shared slots; future structural profile planned | Separate item/equipment profile and runtime equip-compatibility policy, independent of action damage hooks |
| Is a bow action executable against this foe? | Existing combat action owner can project damage hooks/current target under its implemented legality | First verify ordinary owner/caller ranged action, cost, execution and resolved outcome; do not silently invent range/ammo rules |
| Which arrows/projectiles are compatible, equipped, owned, reserved and consumed? | Not established as a complete ammunition/runtime transaction owner | Dedicated ammo/quantity/instance decision, including quiver/container and identity semantics, if/when feature is promoted |
| What if ammo changes while an attack is queued? | Combat queue exists; future ammo reservation policy unspecified | Decide reservation vs execution-time debit, cancellations and failed action semantics **before** enabling consumption |
| Which state takes wear or breaks? | Equipped ref has durability-like field; general durability/condition/repair owner incomplete | Dedicated combat mutation/repair policy, not a static profile field or auto-decrement on every action |
| What about offhand, shield, dual wield or two-handed conflicts? | Distinct slots exist; full handedness/compatibility authority not complete | Separate equip/slot/hand-use validation, consistent with creator changes and existing shield action identity |
| How should skill gain be attributed? | Combat weapon-profile `combat.melee.primary` / `combat.ranged.primary` candidate path and item profile skill IDs | Retain actual supported source/rank and separate from future balance or unimplemented armor/shield training |

The requirement for **eventual ammunition semantics** is not permission to silently add a universal ammo counter, projectiles-as-currency, or an inventory write inside the existing `combat.ranged.primary` branch.

## Conservative later-slice ordering (not an active Codex task)

1. **Ranged weapon owner/caller verification, no new ammo system.** Use a legitimate equipped bow in a controlled source/caller fixture; inspect legal target, action type/provenance, costs, queue, outcome, skill hooks and exact ledger. Prove missing constraints truthfully. When UI/browser available, separately verify selected label/target and accepted action; no claim of naturally winnable encounter.
2. **Equipment-compatibility decision.** Read the held character-creator branch and live equipment consumers *when* its named review trigger occurs. Decide canonical slot/handedness, shield/weapon conflicts, equip/unequip invalidation, source changes during an active encounter and save compatibility. Do not import held branch or reconstruct it here.
3. **Ammo/quantity transaction decision.** Identify real stack/container/instance owner, projectile-weapon compatibility, ranged action target context, timing/reservation and what is returned on cancellation/interrupt/miss. Require replay/idempotency and admission rollback invariants before modifying inventory in combat.
4. **Durability and special equipment later.** Only after a condition/repair owner is accepted, define per-action wear and breaking, separate from current static metadata, magic channels and loot.
5. **Reassess actual ranged difficulty after future creator/equipment/skill allocations stabilize.** No current character's death/win rate governs skeleton correctness.

## Future acceptance scenarios (not executed)

| ID | Set-up | Required invariant and evidence class |
| --- | --- | --- |
| R1 | Hunter with Short Bow | Exact equipped `combat.ranged.primary` origin, archer skill hooks, enemy target and legal resource cost through ordinary caller; selected UI a separate proof |
| R2 | Composite Bow | Same owner-sourced grant and damage-family logic, without assuming starter availability |
| R3 | No ranged weapon equipped | No borrowed bow action or unowned item source; preserve valid engine basic action |
| R4 | Bow held in inventory only | Possession alone does not create an equipped weapon profile action |
| R5 | Bow equipped, arrow bundle absent/present | Record **current actual behavior** before declaring ammo as consumed or gated; metadata alone cannot be upgraded to ammo truth |
| R6 | Later supported ammo owner | Insufficient/missing ammo rejects before commitment; exactly-once stack/instance debit and effect; duplicate/stale/failed admission byte-stable |
| R7 | Queued shot, cancellation/interrupt, ammo change | Action result, ammo reservations and refunds follow explicitly approved timing policy, with no double spend |
| R8 | Shield in offhand, two-handed or incompatible loadout | Equip legality comes from slot/hand owner; no special exception that alters shield Block identity by UI label |
| R9 | Equip/unequip mid-encounter | Previously queued grant validity and source provenance are revalidated under a separately accepted equipment-change policy |
| R10 | Reload current/historical campaign | Canonical item IDs, equipped refs, stack quantities, combat grants and terminal ledger preserve exact owner truth; no invented migration |

## Dependency and protected-route note

This note is subordinate to [Combat Skeleton First](combat-skeleton-first-priority-and-acceptance-boundary-decision.md), [Combat Capability Audit](combat-skeleton-capability-and-owner-contract-audit-2026-10-20.md), [Weapon And Armor Profile Schema Decision](weapon-and-armor-profile-schema-decision.md), [Item/Equipment/Inventory Boundary](item-equipment-inventory-authority-boundary-decision.md), and [Creator-to-Combat Input Prework](creator-to-combat-input-compatibility-prework-2026-10-20.md). It can be consumed later by ranged/equipment implementation planning **after** the currently installed combat-terminal run completes or explicitly delegates a non-overlapping slice.

**Pass limitation:** one new Markdown note only. No edits to active prompts, current output/handoff, combat or creator production, weapon/armor schemas, content, ammo quantities, tests, rewards, snapshots, Game version, branches or Site source. No executed tests, builds or browser checks claimed.
