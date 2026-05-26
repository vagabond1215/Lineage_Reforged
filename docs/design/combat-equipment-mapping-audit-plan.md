# Combat Equipment Mapping Audit

Date: 2026-05-26
Source version/run: Version 0.5.86 - Combat Equipment Mapping Audit
Status: audit result and focused follow-up source

## Purpose

Audit current combat/equipment mapping before combat formulas, equipment behavior, or balance changes.

This audit does not:

- change combat math
- edit combat source
- edit item/weapon/armor content
- edit skill progression policy
- add combat UI
- add equipment, durability, item-instance, loot, crafting, economy, save, generated-output, or active magic behavior

## Current Source Owner Map

| Area | Current owner | Observed behavior |
| --- | --- | --- |
| Equipment slot ids | `EquipmentSlotId` in `packages/shared/types/src/contracts.ts`; mirrored by `packages/content/base/player/equipment_slots.json`; creator-local `EMPTY_EQUIPMENT` in `apps/rpg-ui/src/game-shell/newGameSnapshot.ts` | Two weapon slots, eight armor slots, and seven accessory slots. No current handedness, two-handed, offhand category, slot compatibility, or item-to-slot schema. |
| Item/equipment records | `packages/content/base/items/items.json`; schema in `packages/schemas/items/item.schema.json` | Item records own `itemClass`, `itemBranch`, optional `useProfiles`, and descriptive tags. Use profiles own action ids, skills, effect channels, handling type, proficiency skill, combat tags, resolution hooks, target profile, and activation timing. |
| Starter bundles | `packages/content/base/player/starting_bundles.json`; projected by `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts` | Bundles list fixed item ids and choice groups. They do not declare equip slots. `characterCreationCatalog.ts` resolves item labels and stack `itemKey`s from item ids. |
| Starter equipment mapping | `buildStarterEquipment(...)` in `apps/rpg-ui/src/game-shell/newGameSnapshot.ts` | UI-side heuristic equips shields to `slot.weapon.left`, first armor/tunic/cloak to `slot.armor.chest`, compass to `slot.accessory.waist`, and item keys containing sword/spear/bow/axe/knife/staff to `slot.weapon.right`. |
| Combat runtime | `packages/engines/game-engine/src/combat/index.ts` | Runtime builds combatants from equipped item ids, item use profiles, skills, abilities, spells, and titles. It resolves actions from item/spell/ability grants, built-in action templates, action packages, or a melee fallback. |
| Combat content loading | `packages/engines/game-engine/src/combat/index.ts`; `packages/engines/civilization-engine/src/content.ts`; `packages/engines/game-engine/src/combat/content.ts` | Combat runtime imports Node content loaders; browser-facing UI must not import this path. Combat foundation content loads roles and tactics presets separately. |
| Combat actions and command ids | `ACTION_LIBRARY`, `ACTION_PACKAGE_LIBRARY`, `queueManualCombatCommand(...)`, `CombatCommandRequestState.actionType` | Built-ins cover melee basic, ranged basic, shield block, shield bash, elemental/control attack, and spell cast lanes. Item use profiles add `combat.melee.primary`, `combat.ranged.primary`, `combat.melee.improvised`, `combat.armor.*`, and shield actions. |
| Damage family mapping | `resolveActionFamily(...)`, item/spell/ability `resolutionHooks`, and action templates | No explicit damage-type enum. Current family is inferred from hooks such as `damage.melee`, `damage.ranged`, `damage.magic`, spell school, ranged weapon skill, shield skill, item handling, or target disposition. |
| Defensive mitigation | `resolveEquipmentReduction(...)`, `resolveDefensiveSkillReduction(...)`, `resolveMitigationFromStatuses(...)` | Armor/shield handling grants feed equipment reduction. Defensive skills feed separate reduction. Active shield block creates a status reduction. Total reduction clamps in `resolveCombatDamagePreview(...)`. |
| Skill/stat mapping | `packages/content/base/player/skills.json`, `skill_effects.json`, and combat runtime helpers | Weapon skills provide damage/accuracy effects through action-tag aliases. Armor/shield/defense skills provide mitigation, block, evasion, or stagger-resistance effects. Combat damage preview uses STR/DEX/AGI for melee, DEX/AGI/WIS for ranged, STR/CON/WIS for shield, INT/SPT/WIS for magic, and CON/VIT/AGI/WIS on defense. |
| Skill gain candidates | `deriveCombatSkillGainCandidates(...)`, `resolveCombatSkillGainAttempts(...)`, `applyCombatSkillGainAttempt(...)` | Only resolved player-owned `combat.melee.primary` or `combat.ranged.primary` actions with `itemHandlingType: "weapon"` and `damage.melee`/`damage.ranged` produce `weapon_attack` candidates. Shield, armor, defense, tactics, magic, basic, fallback, improvised, and hybrid actions do not currently train. |

## Weapon / Equipment Mapping Table

| Item/profile | Current action(s) | Handling | Primary skill(s) | Damage hook | Starter slot | Trains today? | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `item.arming_sword` | `combat.melee.primary` | `weapon` | `skill.combat.weapon.sword` | `damage.melee` | Warrior `slot.weapon.right` | Yes | Clean current melee starter mapping. |
| `item.war_spear` | `combat.melee.primary` | `weapon` | `skill.combat.weapon.polearm` | `damage.melee` | Warrior choice `slot.weapon.right` | Yes | Clean current melee starter mapping. |
| `item.lumber_axe` | `utility.woodcutting`, `combat.melee.primary` | `hybrid`, `weapon` | `skill.resource.woodcutting`, `skill.combat.weapon.axe` | `damage.melee` on combat profile | Laborer `slot.weapon.right` | Yes for combat profile | Utility profile is separate; combat profile is candidate-eligible. |
| `item.pickaxe` | `utility.mining`, `combat.melee.improvised` | `hybrid`, `weapon` | `skill.resource.mining`, `skill.combat.weapon.axe` | `damage.melee` on improvised profile | Crafter choice `slot.weapon.right` | No | Runtime can map damage, but skill-gain candidates exclude `combat.melee.improvised`. |
| `item.battle_staff` | `combat.melee.primary`, `magic.focus.channeling` | `hybrid`, `hybrid` | `skill.combat.weapon.staff`, `skill.magic.mana_control` | `damage.melee` on combat profile | Arcanist `slot.weapon.right` | No | Runtime maps staff damage/skill effects, but skill-gain candidates require `itemHandlingType: "weapon"`, not `hybrid`. |
| `item.composite_bow` | `combat.ranged.primary` | `weapon` | `skill.combat.weapon.archery` | `damage.ranged` | Not a starter item | Yes | Existing tests cover ranged skill-gain behavior with this bow. |
| `item.short_bow` | none | none | none | none | Hunter `slot.weapon.right` | No | Confirmed starter mapping bug: equipped by creator heuristic but no combat use profile, so runtime does not grant ranged action/skill mapping. |
| `item.butcher_knife` | none | none | none | none | Traveler `slot.weapon.right` | No | Confirmed starter mapping gap: equipped as weapon because key contains `knife`, but no combat profile exists. Decide whether it should stop equipping or gain a knife/dagger profile. |
| `item.battle_axe` | `combat.melee.primary` | `weapon` | `skill.combat.weapon.axe` | `damage.melee` | Not starter | Yes | Clean profiled non-starter weapon. |
| `item.dirk_dagger` | `combat.melee.primary` | `weapon` | `skill.combat.weapon.dagger` | `damage.melee` | Not starter | Yes | Clean profiled non-starter weapon. |
| Other `itemClass: "weapon"` records | none | none | none | none | Some non-starter only | No | 29 weapon-class records have no use profile yet, including short/long bows, crossbows, thrown weapons, greatswords, maces, fans, flails, and whips. This is broad content coverage, not a formula issue. |

## Armor / Shield Mapping Table

| Item/profile | Current action(s) | Handling | Proficiency skill | Runtime mitigation path | Starter slot | Skill gain today? | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `item.buckler_shield` | `combat.defense.block`, `combat.interrupt.shield_bash` | `shield` | `skill.combat.armor.small_shields`; primary `skill.combat.defense.shield_handling` | Armor handling grant, shield base reduction, active block status, shield skill effect aliases | Warrior `slot.weapon.left` | No | Shield effects are visible to combat mapping, but shield block/bash do not derive skill-gain candidates. |
| `item.kite_shield` | `combat.defense.block`, `combat.interrupt.shield_bash` | `shield` | `skill.combat.armor.medium_shields` | Same as shield path with medium tags | Not starter | No | Content profile exists but not starter. |
| `item.tower_shield` | `combat.defense.block`, `combat.interrupt.shield_bash` | `shield` | `skill.combat.armor.large_shields` | Same as shield path with large tags | Not starter | No | Content profile exists but not starter. |
| `item.leather_light_armor` | `combat.armor.light` | `armor` | `skill.combat.armor.light_armor` | Armor handling grant plus light armor base/skill reduction | Warrior `slot.armor.chest` | No | Existing tests confirm armor profile contributes deterministic reduction. |
| `item.travel_cloak` | `combat.armor.light` | `armor` | `skill.combat.armor.cloth_armor` | Armor handling grant plus cloth armor base/skill reduction | Traveler `slot.armor.chest` | No | Clothing item has armor handling profile. |
| `item.plate_cuirass` | `combat.armor.plate` | `armor` | `skill.combat.armor.plate_armor` | Armor handling grant plus plate base/skill reduction | Not starter | No | Existing tests use this for higher mitigation. |
| `item.ring_mail_hauberk` | `combat.armor.medium` | `armor` | `skill.combat.armor.medium_armor` | Armor handling grant plus medium base/skill reduction | Not starter | No | Content profile exists but not starter. |
| `item.casual_tunic` | none | none | none | none | Laborer/Crafter/Arcanist/Trader `slot.armor.chest` | No | Equipped as chest apparel by starter heuristic but intentionally/non-currently non-mitigating. |
| Other armor/clothing records | partial/no profiles | varies | varies | only if a use profile exists | mostly not starter | No | 12 armor-class records and 13 clothing records have no mitigation profile. This is content coverage, not combat math. |

## Combat Action To Skill / Stat / Damage Mapping

| Action id | Source owner | Family resolution | Offensive stats | Defensive stats | Skill/equipment mapping | Skill gain today |
| --- | --- | --- | --- | --- | --- | --- |
| `combat.attack.melee.basic` | Built-in `ACTION_LIBRARY` and no-grant fallback | Melee | STR + DEX + AGI * 0.15 | CON + VIT + AGI * 0.18 + WIS * 0.12 | No item skill by default | No |
| `combat.melee.primary` | Item use profile | Melee | STR + DEX + AGI * 0.15 | Same melee defense | `weaponSkillId` from weapon profile skill identity; item band bonus from proficiency band | Yes only when player-owned, resolved/recovering, damage hook exists, target was valid, and `itemHandlingType` is `weapon` |
| `combat.melee.improvised` | Item use profile | Melee | STR + DEX + AGI * 0.15 | Same melee defense | Can map weapon skill/effects from item profile | No because candidate derivation excludes this action id |
| `combat.attack.ranged.basic` | Built-in `ACTION_LIBRARY`, enemy package mapping | Ranged | DEX + AGI + WIS * 0.2 | CON + VIT + AGI * 0.25 + WIS * 0.15 | No item skill by default | No |
| `combat.ranged.primary` | Item use profile | Ranged | DEX + AGI + WIS * 0.2 | Same ranged defense | `weaponSkillId` from ranged weapon profile | Yes under the same player-owned weapon-profile candidate gate |
| `combat.defense.block` | Built-in and shield item profiles | Shield/support self action | STR + CON + WIS * 0.15 if previewed as shield | Same melee defense if damage previewed | Shield handling and small/medium/large shield skill tags feed grants/reduction | No |
| `combat.interrupt.shield_bash` | Built-in and shield item profiles | Shield | STR + CON + WIS * 0.15 | Same melee defense | Shield handling plus shield armor skill; `damage.melee`, `interrupt.primary`, `status.stagger` | No |
| `combat.armor.light`, `combat.armor.medium`, `combat.armor.plate`, `armor.handling.*` | Armor item profiles and skill effect aliases | Defensive handling, not ordinary attack | Not primary damage actions | Feed mitigation against incoming hooks | Armor handling grants feed `resolveEquipmentReduction(...)` | No |
| `spell.cast.*` and scripted magic/support lanes | Spell content and built-ins | Magic/support | INT + SPT/WIS blend for magic | CON/VIT/WIS/SPT blend | Spell school/scaling/effect hooks | No combat skill gain; broad magic runtime remains deferred |

## Starter Equipment Mapping Notes

| Bundle / choice | Equipped slots observed | Current combat visibility | Gap |
| --- | --- | --- | --- |
| Laborer | `slot.weapon.right: item.lumber_axe`; `slot.armor.chest: item.casual_tunic` | Axe profile grants melee action and axe training. Tunic has no mitigation profile. | Tunic is non-mitigating apparel. |
| Hunter | `slot.weapon.right: item.short_bow` | No bow profile, no item-use action grant, no ranged weapon skill mapping. | Hard starter mapping bug. |
| Warrior / arming sword | `slot.weapon.left: item.buckler_shield`; `slot.weapon.right: item.arming_sword`; `slot.armor.chest: item.leather_light_armor` | Sword trains; shield and armor mitigate but do not train. | Shield/armor training deferred. |
| Warrior / war spear | Same shield/armor plus `item.war_spear` | Spear maps to polearm and trains. | Shield/armor training deferred. |
| Crafter / agriculture kit | `slot.armor.chest: item.casual_tunic` | No weapon; tunic no mitigation. | Expected low-combat start, but slot heuristic remains content-blind. |
| Crafter / pickaxe | `slot.weapon.right: item.pickaxe`; `slot.armor.chest: item.casual_tunic` | Pickaxe has improvised melee damage mapping but no skill-gain candidate. | Improvised weapon training decision needed. |
| Crafter / awl | `slot.armor.chest: item.casual_tunic` | No weapon; tunic no mitigation. | Expected low-combat start. |
| Arcanist | `slot.weapon.right: item.battle_staff`; `slot.armor.chest: item.casual_tunic` | Staff damage and skill effects map, but hybrid handling blocks weapon skill-gain candidates. | Hybrid weapon training decision needed. |
| Traveler | `slot.weapon.right: item.butcher_knife`; `slot.armor.chest: item.travel_cloak`; `slot.accessory.waist: item.compass` | Cloak mitigates as cloth armor. Knife has no combat profile. | Knife equip/profile decision needed. |
| Trader | `slot.armor.chest: item.casual_tunic`; `slot.accessory.waist: item.compass` | No combat profile effects. | Expected non-combat start; tunic is non-mitigating. |

## Confirmed Gaps

### Hard Mapping Bugs

- `item.short_bow` is a starter weapon equipped into `slot.weapon.right` but has no combat use profile. A hunter start can therefore lose expected ranged action/skill mapping before combat even reaches formula tuning.
- `getActionTemplate(...)` falls back to `combat.attack.melee.basic` for unknown action ids, which can hide missing item/action mappings during manual command testing unless focused tests inspect the resolved action type.

### Design-Deferred Or Policy Gaps

- Starter `item.battle_staff` has a valid melee damage profile but uses `handlingType: "hybrid"`, while current skill-gain candidates require `itemHandlingType: "weapon"`.
- Starter `item.pickaxe` has a valid `combat.melee.improvised` damage profile, but current skill-gain candidates only allow `combat.melee.primary` and `combat.ranged.primary`.
- Starter `item.buckler_shield` maps block/bash and mitigation, but shield block/bash skill-gain candidate reasons are not derived.
- Armor handling mitigates but armor skill-gain candidate reasons are not derived.
- Defensive skills mitigate but defensive skill-gain candidates are not derived.
- Starter equipment slotting is UI-authored and substring-based; content has no item-owned equip slot, hand use, offhand, two-handed, shield slot, or handedness model.
- Current item profiles do not model explicit reach, speed, handedness, damage type, ammo use, range cost, or weapon-specific scaling beyond `activation`, `targetProfile`, `effectChannels`, `combatTags`, and `resolutionHooks`.
- There is no explicit damage-type table. Damage family is inferred from resolution hooks and action/source metadata.
- 29 weapon-class records and many armor/clothing records have no combat/mitigation use profile. Most are non-starter coverage gaps, not immediate runtime blockers.
- Magic/support action hooks exist in combat, but broad active magic expansion remains out of scope.

## Tests Added

- `tests/unit/combat-equipment-mapping.test.mjs`
  - documents the current creator starter-equipment slot map across all starter bundles and relevant choice variants.
  - asserts starter weapon-slot items either map to current combat profiles or remain in explicit known audit gaps.
  - asserts starter armor-slot items either map to mitigation profiles or remain explicit non-mitigating apparel.

Existing focused combat tests already cover:

- melee and ranged weapon-profile skill-gain candidates
- skill-gain source caps and breakthrough-gate routing
- defensive/armor/shield actions currently not training
- armor reduction and active shield block preview behavior
- supported combat hook/channel validation

## Safe Next Implementation Slice

Recommended next version:

`Version 0.5.87 - Combat Equipment Mapping Follow-Up`

Smallest high-value fix before formula work:

1. Add a current-content combat use profile for `item.short_bow` that maps to `combat.ranged.primary`, `skill.combat.weapon.archery`, `handlingType: "weapon"`, and `damage.ranged`, following the existing `item.composite_bow` profile shape.
2. Update `tests/unit/combat-equipment-mapping.test.mjs` to remove `item.short_bow` from the known profile gap list.
3. Do not alter damage formulas, ammo behavior, ranged balance, loot, item instances, or UI.

Next narrow decisions after that:

- Decide whether `item.battle_staff` should train through hybrid weapon handling or whether its combat profile should be split into a weapon-handling profile plus separate magic focus profile.
- Decide whether `item.pickaxe` improvised attacks should train axe at a reduced/future policy rate or stay non-training.
- Decide whether `item.butcher_knife` should stop auto-equipping as a weapon or receive a dagger/knife combat profile.
- Decide shield/armor skill-gain candidate rules only after source caps and player-facing messages are designed.

## Deferred / Forbidden Work Not Touched

- combat formula rewrite or rebalance
- new combat actions
- combat UI
- equipment behavior, durability, item instances, loot, crafting, or economy behavior
- save schema changes
- generated output
- active magic behavior
- creator shell/sidebar changes
- calendar/climate, Chronicle, Bloodlines, Backstory Legacy, Family Prestige, Chronicle Marks, Lineage Seals, estate, heir, heirloom, or bequest behavior
