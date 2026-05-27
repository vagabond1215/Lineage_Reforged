# Current Codex Output

Source version/run: Version 0.5.86 - Combat Equipment Mapping Audit
Date: 2026-05-27
Branch/status assumption: Ran locally on `master`; preflight worktree was clean and `master` was not behind `origin/master`. Default `git pull` failed local SSL validation, then `git -c http.sslBackend=schannel pull` reported `Already up to date.`

## Result
Completed the audit-first combat/equipment mapping pass. Updated the combat equipment audit tables, kept the focused mapping test aligned with current observed behavior, and recorded newly deferred follow-up work in the backlog. No combat formulas, equipment behavior, content behavior, UI, save schema, or generated output changed.

The smallest high-value post-audit fix is to add a current-content combat use profile for starter `item.short_bow` before any combat formula rewrite or magic planning.

## Files Inspected
- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/combat-equipment-mapping-audit-plan.md`
- `docs/design/combat-audit-scoping-pass.md`
- `docs/design/future-system-design-ledger.md`
- `docs/future_content_backlog.md`
- `packages/engines/game-engine/src/combat/index.ts`
- `packages/engines/game-engine/src/combat/content.ts`
- `packages/engines/game-engine/src/combat/state.ts`
- `packages/shared/types/src/combat.ts`
- `packages/shared/types/src/contracts.ts`
- `packages/content/base/player/equipment_slots.json`
- `packages/content/base/items/items.json`
- `packages/content/base/player/starting_bundles.json`
- `packages/content/base/player/skills.json`
- `packages/content/base/player/skill_effects.json`
- `packages/schemas/items/item.schema.json`
- `packages/schemas/player/equipment.schema.json`
- `packages/schemas/player/starting-bundle.schema.json`
- `apps/rpg-ui/src/game-shell/newGameSnapshot.ts`
- `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts`
- `tests/unit/combat-equipment-mapping.test.mjs`
- `tests/unit/combat-spawn-foundation.test.mjs`
- `tests/unit/combat-hook-support.test.mjs`
- `tests/unit/combat-delta-presentation.test.mjs`
- `tests/unit/player-identity-content.test.mjs`
- `tests/unit/legacy-start-resources.test.mjs`

## Files Changed
- `docs/design/combat-equipment-mapping-audit-plan.md`
- `docs/future_content_backlog.md`
- `tests/unit/combat-equipment-mapping.test.mjs`
- `docs/dev/current-codex-output.md`

## Current Source Owner Map
| Area | Current owner | Observed behavior |
| --- | --- | --- |
| Equipment slots | `EquipmentSlotId` in `packages/shared/types/src/contracts.ts`, mirrored by `packages/content/base/player/equipment_slots.json` and creator-local `EMPTY_EQUIPMENT` in `newGameSnapshot.ts` | Two weapon slots, eight armor slots, seven accessory slots. No content-owned handedness, offhand, two-handed, or slot compatibility model. |
| Item/equipment records | `packages/content/base/items/items.json`; `packages/schemas/items/item.schema.json` | Records own `itemClass`, `itemBranch`, tags, and optional `useProfiles`. Profiles own action ids, skills, channels, hooks, handling type, combat tags, target profiles, and activation. |
| Weapon profiles | Item `useProfiles` in `items.json` | Profiled starter weapons map through item action ids and skills. Profiles do not currently define explicit reach, speed, damage type enum, handedness, ammo use, or weapon-specific scaling. |
| Starter bundles | `packages/content/base/player/starting_bundles.json`; projected by `characterCreationCatalog.ts` | Bundles list items and choices but do not declare equip slots. |
| Starter equipment mapping | `buildStarterEquipment(...)` in `apps/rpg-ui/src/game-shell/newGameSnapshot.ts` | UI heuristic equips shields left hand, first armor/tunic/cloak chest, compass waist, and item keys containing sword/spear/bow/axe/knife/staff right hand. |
| Combat actions | `ACTION_LIBRARY`, `ACTION_PACKAGE_LIBRARY`, item/spell/ability grants, and `queueManualCombatCommand(...)` in `combat/index.ts` | Built-ins cover basic melee/ranged, shield block/bash, scripted magic/control, and spell lanes. Item profiles add melee/ranged primary, improvised melee, armor handling, and shield actions. |
| Damage family mapping | `resolveActionFamily(...)` plus resolution hooks | No explicit damage-type table. Runtime infers melee/ranged/magic/shield/support families from hooks, spell school, weapon skill, shield skill, handling type, and target disposition. |
| Defensive mitigation | `resolveEquipmentReduction(...)`, `resolveDefensiveSkillReduction(...)`, `resolveMitigationFromStatuses(...)` | Armor/shield handling grants, defensive skill effects, and active shield-block status contribute reductions with clamps. |
| Skill/stat mapping | `skills.json`, `skill_effects.json`, and combat runtime helpers | Melee uses STR/DEX/AGI; ranged uses DEX/AGI/WIS; shield uses STR/CON/WIS; magic uses INT/SPT/WIS; defense uses CON/VIT plus AGI/WIS or WIS/SPT for magic defense. |
| Skill-gain candidates | `deriveCombatSkillGainCandidates(...)` and `resolveCombatSkillGainAttempts(...)` | Only resolved player-owned `combat.melee.primary` or `combat.ranged.primary` weapon actions with damage hooks and `itemHandlingType: "weapon"` currently train. Shield, armor, defense, fallback, improvised, hybrid, tactics, and magic actions do not. |

## Mapping Tables
### Weapon / Equipment Mapping
| Item/profile | Current action(s) | Handling | Skill mapping | Starter slot | Training today | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `item.arming_sword` | `combat.melee.primary` | `weapon` | `skill.combat.weapon.sword` | Warrior right hand | Yes | Clean starter melee mapping. |
| `item.war_spear` | `combat.melee.primary` | `weapon` | `skill.combat.weapon.polearm` | Warrior choice right hand | Yes | Clean starter melee mapping. |
| `item.lumber_axe` | `utility.woodcutting`, `combat.melee.primary` | `hybrid`, `weapon` | `skill.resource.woodcutting`, `skill.combat.weapon.axe` | Laborer right hand | Yes for combat profile | Utility and combat profiles are separate. |
| `item.pickaxe` | `utility.mining`, `combat.melee.improvised` | `hybrid`, `weapon` | `skill.resource.mining`, `skill.combat.weapon.axe` | Crafter choice right hand | No | Damage maps, but improvised actions are outside the current skill-gain gate. |
| `item.battle_staff` | `combat.melee.primary`, `magic.focus.channeling` | `hybrid` | `skill.combat.weapon.staff`, `skill.magic.mana_control` | Arcanist right hand | No | Damage and skill effects map, but hybrid handling blocks weapon skill-gain candidates. |
| `item.composite_bow` | `combat.ranged.primary` | `weapon` | `skill.combat.weapon.archery` | Not starter | Yes | Clean profiled ranged weapon; existing tests cover ranged skill-gain behavior. |
| `item.short_bow` | none | none | none | Hunter right hand | No | Hard starter mapping bug: equipped as a bow but has no combat use profile. |
| `item.butcher_knife` | none | none | none | Traveler right hand | No | Equipped by key substring; needs equip/profile policy decision. |
| Other profiled weapons | `combat.melee.primary` | `weapon` | axe/dagger variants | Not starter | Yes | `item.battle_axe` and `item.dirk_dagger` are clean non-starter examples. |
| Other weapon-class records | none | none | none | Mostly non-starter | No | 29 weapon-class records currently lack combat profiles. |

### Armor / Shield Mapping
| Item/profile | Current action(s) | Handling | Skill mapping | Starter slot | Mitigation visible | Training today |
| --- | --- | --- | --- | --- | --- | --- |
| `item.buckler_shield` | `combat.defense.block`, `combat.interrupt.shield_bash` | `shield` | `skill.combat.armor.small_shields`, `skill.combat.defense.shield_handling` | Warrior left hand | Yes | No |
| `item.kite_shield` | block/bash | `shield` | `skill.combat.armor.medium_shields` | Not starter | Yes | No |
| `item.tower_shield` | block/bash | `shield` | `skill.combat.armor.large_shields` | Not starter | Yes | No |
| `item.leather_light_armor` | `combat.armor.light` | `armor` | `skill.combat.armor.light_armor` | Warrior chest | Yes | No |
| `item.travel_cloak` | `combat.armor.light` | `armor` | `skill.combat.armor.cloth_armor` | Traveler chest | Yes | No |
| `item.plate_cuirass` | `combat.armor.plate` | `armor` | `skill.combat.armor.plate_armor` | Not starter | Yes | No |
| `item.ring_mail_hauberk` | `combat.armor.medium` | `armor` | `skill.combat.armor.medium_armor` | Not starter | Yes | No |
| `item.casual_tunic` | none | none | none | Several starter chest slots | No | No |

### Combat Action To Skill / Stat / Damage
| Action id | Source owner | Family | Offensive stats | Defensive stats | Skill gain today |
| --- | --- | --- | --- | --- | --- |
| `combat.attack.melee.basic` | Built-in and unknown-action fallback | Melee | STR + DEX + AGI * 0.15 | CON + VIT + AGI * 0.18 + WIS * 0.12 | No |
| `combat.melee.primary` | Item profile | Melee | STR + DEX + AGI * 0.15 | Melee defense | Yes only under current weapon profile gate |
| `combat.melee.improvised` | Item profile | Melee | STR + DEX + AGI * 0.15 | Melee defense | No |
| `combat.attack.ranged.basic` | Built-in/enemy package | Ranged | DEX + AGI + WIS * 0.2 | CON + VIT + AGI * 0.25 + WIS * 0.15 | No |
| `combat.ranged.primary` | Item profile | Ranged | DEX + AGI + WIS * 0.2 | Ranged defense | Yes only under current weapon profile gate |
| `combat.defense.block` | Built-in and shield profiles | Shield/support | STR + CON + WIS * 0.15 if previewed | Melee defense | No |
| `combat.interrupt.shield_bash` | Built-in and shield profiles | Shield | STR + CON + WIS * 0.15 | Melee defense | No |
| `combat.armor.*` / `armor.handling.*` | Armor profiles and skill effects | Defensive handling | Not an attack lane | Mitigation path | No |
| `spell.cast.*` / scripted magic | Spell/built-in lanes | Magic/support | INT + SPT/WIS blend | CON/VIT/WIS/SPT blend | No combat skill gain |

### Starter Equipment Mapping
| Bundle / choice | Equipped slots observed | Current combat visibility | Gap |
| --- | --- | --- | --- |
| Laborer | `item.lumber_axe` right hand; `item.casual_tunic` chest | Axe maps and trains; tunic does not mitigate. | Tunic is non-mitigating apparel. |
| Hunter | `item.short_bow` right hand | No ranged profile/action/skill. | Hard starter mapping bug. |
| Warrior / arming sword | `item.buckler_shield` left hand; `item.arming_sword` right hand; `item.leather_light_armor` chest | Sword trains; shield/armor mitigate. | Shield/armor training deferred. |
| Warrior / war spear | Shield/armor plus `item.war_spear` right hand | Spear maps and trains. | Shield/armor training deferred. |
| Crafter / agriculture kit | `item.casual_tunic` chest | No combat profile effects. | Expected low-combat start; heuristic remains content-blind. |
| Crafter / pickaxe | `item.pickaxe` right hand; `item.casual_tunic` chest | Pickaxe damage maps as improvised. | Improvised weapon training policy needed. |
| Crafter / awl | `item.casual_tunic` chest | No combat profile effects. | Expected low-combat start. |
| Arcanist | `item.battle_staff` right hand; `item.casual_tunic` chest | Staff damage/effects map. | Hybrid weapon training policy needed. |
| Traveler | `item.butcher_knife` right hand; `item.travel_cloak` chest; `item.compass` waist | Cloak mitigates; knife has no profile. | Knife equip/profile decision needed. |
| Trader | `item.casual_tunic` chest; `item.compass` waist | No combat profile effects. | Expected non-combat start; tunic is non-mitigating. |

## Gaps Found
Hard bugs:
- `item.short_bow` is starter-equipped into `slot.weapon.right` but has no combat use profile, so hunter starts lose expected ranged action and archery mapping.
- `getActionTemplate(...)` falls back to `combat.attack.melee.basic` for unknown action ids, which can hide missing mappings during manual command testing.

Design-deferred gaps:
- `item.battle_staff` has a valid melee profile but `handlingType: "hybrid"` blocks weapon skill-gain candidates.
- `item.pickaxe` has an improvised melee damage profile, but current skill-gain candidates exclude `combat.melee.improvised`.
- `item.buckler_shield` block/bash/mitigation is visible to combat, but shield skill-gain candidate reasons are not derived.
- Armor and defensive mitigation do not currently derive armor/defense skill-gain candidates.
- Starter equipment slotting is UI-authored and substring-based; content needs item-owned equip slot, offhand/shield, handedness, and two-handed metadata before broad equipment behavior changes.
- Damage type is inferred from hooks and metadata rather than owned by an explicit damage-type table.
- Many non-starter weapon, armor, and clothing records lack combat or mitigation profiles.

Uncertainty:
- `item.butcher_knife` may be intended as utility-only or as a future dagger/knife weapon; the current creator heuristic equips it as a weapon because its key contains `knife`.
- Shield/armor/defensive skill gain should wait for policy around caps, messaging, and abuse resistance.

## Tests Added / Updated
- Updated `tests/unit/combat-equipment-mapping.test.mjs` so current starter mapping invariants explicitly include `item.buckler_shield` as a known action-training gap and distinguish action-training gaps from weapon-profile gaps.
- The focused test file asserts current creator starter-equipment slot mapping, starter weapon-slot profile coverage or explicit known gaps, and armor-slot mitigation coverage or explicit non-mitigating apparel.
- No tests were added that require new combat behavior.

## Behavior / Runtime Confirmation
Combat formulas, equipment behavior, durability, item instances, loot, crafting, economy, UI, save schema, generated output, active magic, creator shell/sidebar, calendar/climate, Chronicle, Bloodlines, Backstory Legacy, Family Prestige, Chronicle Marks, Lineage Seals, estate, heir, heirloom, and bequest behavior were not changed.

Item content JSON, combat source, runtime source, schemas, and browser-facing app files were not changed by this audit pass. The changes are audit documentation, backlog deferral notes, focused test expectation wording, and this Codex output file.

## Checks Run
- `git status --short --branch`
- `git pull` (failed local SSL certificate validation)
- `git -c http.sslBackend=schannel pull`
- `git rev-list --left-right --count origin/master...HEAD`
- `node --test tests/unit/combat-equipment-mapping.test.mjs`
- `node --test tests/unit/combat-equipment-mapping.test.mjs tests/unit/combat-spawn-foundation.test.mjs tests/unit/combat-hook-support.test.mjs`
- `git diff --check` (passed; Git reported expected LF-to-CRLF working-copy warnings)

Not run:
- Broad workspace typecheck, per prompt.
- Browser-facing UI import safety scan, because no browser-facing app files were touched.

## Risks / Follow-Up
- Add `item.short_bow` combat profile before formula, balance, or active magic planning.
- Decide `item.butcher_knife` equip/profile policy before relying on starter weapon coverage.
- Decide whether hybrid staff and improvised pickaxe should train weapon skills before expanding skill-gain rules.
- Design shield, armor, and defensive skill-gain candidate policy before wiring candidate derivation.
- Move equipment slot/handedness/offhand/shield ownership into content before broad equipment behavior changes.
- If the short-bow follow-up lands next, move Known Spell Ownership Plan to Version 0.5.88.

## Next Recommended Version
Version 0.5.87 - Combat Equipment Mapping Follow-Up

## Suggested Commit Message
docs(combat): audit equipment mapping
