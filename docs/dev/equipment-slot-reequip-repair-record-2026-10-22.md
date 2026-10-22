# Equipment and Inventory Slot Eligibility, Re-Equip and State Conservation Repair

Date: 2026-10-22. Repository: `vagabond1215/Lineage_Reforged`. Source master: `f56229dde859b9374a54368bd8a8fd2a9872daa1`. Branch: `codex/equipment-slot-reequip-repair`, isolated draft implementation. Run class: unversioned bounded UI equipment-owner repair. Game: `0.1.1-prealpha`; playability: `INTEGRATED_LOOP`. Active `DEV-0.7.2.13` combat prompt/output/handoff and save schemas are unchanged. Development and Game-version impact: `none`.

## Owner trace and reproduced defect

- Canonical `items.items` records own `itemId`/`itemKey`, `itemClass`, branch and current `useProfiles`. The shared `EquipmentState` owns slot-to-`EquippedItemRef` references; inventory bags/overflow own `InventoryStack` quantities. `EquippedItemRef` alone carries current optional durability and resource modifiers. The Character action adapter stashes that metadata in existing session flags while an item is in an inventory stack. Combat derives weapon grants from the equipped canonical item, not an inventory-only copy.
- `newGameSnapshot.ts` previously assigned starter slots from key substrings. `characterPanelState.ts` had a separate substring resolver that omitted `bow`; `item.composite_bow` was correctly equipped in the live demo snapshot and had an authored ranged profile, but its inventory entry after Unequip had `preferredSlotId: null`. The pre-edit `node --test tests/equipment-slot-reequip.test.mjs` failed 0/1 at the expected `slot.weapon.right` assertion (actual `null`).
- The same action adapter used a cached UI entry's slot and stack index without rechecking canonical identity, positive quantity, or current equipment occupancy. A forged non-equippable entry could equip an arrow bundle, a replaced stack could equip the wrong item, a zero stack could mint one item, and a stale Unequip entry could repeat a transfer. Those cases were reproduced by the expanded red test before the validation repair.

## Bounded repair

- One resolver now serves starter equipment and Character inventory: canonical ID/key must agree; authored `weapon` class uses the established right weapon slot, authored `armor` shield branch uses the established left slot, torso/outerwear/wear clothing uses the existing chest slot, and a tool with an authored melee weapon use profile uses the right slot. Exact established starter/loadout references cover Leather Light Armor, Compass, Butcher Knife and Skinning Knife. This keeps all observed starter bundles in their existing slots without inferring handedness, ammunition, armor coverage or combat effects.
- Equip rechecks the live bag/overflow stack identity, location, index and positive integer quantity, then recomputes its slot. Unequip rechecks the live slot item before transfer. Stale/invalid selections leave the original snapshot unchanged. Equipped copies always take one unit, including when old stashed metadata reports a larger quantity. Occupied-slot displacement and bag/overflow placement retain their previous transaction path.
- No item catalog, schema, combat, ammunition, nutrition, creator content, or save version changed. Existing item IDs and `useProfiles` remain the source of combat action provenance.

## Checks and evidence classes

| Check | Result |
| --- | --- |
| Pre-edit Composite Bow regression | **0/1**, expected failure: inventory slot `null` instead of `slot.weapon.right` |
| `cd apps/rpg-ui; node --test tests/equipment-slot-reequip.test.mjs` | **5/5 pass**: Composite/Short Bow, Arming Sword, occupied slot, bag/overflow, stale/unsupported/zero stacks, quantity/durability, SaveSnapshot serialization and TS/JS mirror parity across all canonical items |
| `node --test tests/unit/combat-equipment-mapping.test.mjs tests/unit/equipment-profiles-validation.test.mjs tests/unit/character-creation-form.test.mjs tests/unit/legacy-start-resources.test.mjs tests/simulation/save-load-roundtrip.test.mjs` | **55/55 pass** |
| `node --test tests/unit/combat-spawn-foundation.test.mjs tests/unit/nearby-exploration-reachability.test.mjs tests/unit/combat-hook-support.test.mjs` | **59/59 pass**; includes ordinary equipped-bow caller and inventory-only negative |
| `cd apps/rpg-ui; npm run typecheck:node` | **pass** |
| `cd apps/rpg-ui; npm exec -- vite build` | **pass**, 257 client modules; existing Browserslist age and large-chunk warnings |
| `cd apps/rpg-ui; npm run typecheck` on clean master and repair worktrees | Both **exit 2, 137 diagnostics**; zero new normalized diagnostic signatures |
| `git diff --check` | **pass** |

The tests are controlled owner/caller and serialization evidence. A Vite local fixture started successfully at `127.0.0.1:5178`, but the available in-app browser timed out connecting to it; no clicked Character UI proof was obtained in this pass. No authorized authenticated selected campaign was available. Actual selected Equip/Unequip/Re-equip and Save/restart remain **SELECTED_EQUIPMENT_REEQUIP_UNVERIFIED**. No private credentials were requested or bypassed.

## Remaining ownership and integration boundary

Current content has no live static item-to-slot compatibility profiles, general handedness, armor coverage, accessory placement, or per-instance durability identity in inventory stacks. This resolver intentionally leaves unsupported items unmapped, including other armor pieces whose body coverage is not authored. The existing single metadata stash per canonical item ID preserves tested round trips; it cannot distinguish several copies of the same item with different durability while all copies are in a merged stack. A later item-instance/compatibility owner must settle that before broader eligibility or exact per-copy durability claims.

Design PR #5 and UI PRs #7, #8 and #9 were inspected at live heads and remain draft. None was merged, rebased, retargeted or overwritten. Their review triggers remain their own design/selected-client acceptance gates and later combined UI integration; this branch is a separate candidate for review after its controlled proof. The next Equipment/Inventory **presentation** slice may improve item/slot labels, eligible-action explanation and compact responsive management after this owner behavior and selected flow are accepted. It must not infer new equipment rules from the visual layer.

Applicable guardrails: FP-001 (actual `CharacterPanel` action functions and starter caller inspected; clicked browser proof unavailable), FP-002 (controlled tests do not accept selected gameplay), FP-008 (draft PR semantic isolation), FP-009 (base/final/live heads distinguished), FP-015 (eligibility recomputed from live canonical item and stack). Suggested commit: `fix(ui): restore canonical equipment re-equip and conserve item state`.
