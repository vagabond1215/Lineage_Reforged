# Quick-access tools, layered Back mounts, and shield readiness

Date: 2026-10-28
Status: User-direction design preflight; docs only; no item, schema, runtime, Save, UI, combat, balance or game-version change.
Source: master a596112acf3945f2bf7c625e943f2511d12aa710; unselected native gear PR #39 ed351578f57a6f44a257c79715b55b46c3c9617b.
Companions: [T0 tool census](../data-dictionary/tool-class-census-and-recipe-station-crosswalk-2026-10-28.md), [T1 portable-tool classification](../data-dictionary/tool-portable-t1-capability-classification-2026-10-28.md), [held tools and station use](tool-held-use-and-station-supplied-equipment-expansion-plan-2026-10-28.md), [layered loadouts](character-layered-loadouts-and-sided-slots-preflight-2026-10-26.md).

## 1. Product direction and key rule

**The selected primary weapon, worn/carried physical location, drawn/held state, and carrier mount capacity are independent.** Selecting a sheathed sword as Primary Weapon does not occupy a hand. A tool may be physically carried, mounted on a belt, held for work, or separately selected as a usable weapon if it has an accepted combat profile. Do not create duplicate item instances when moving between these states.

**Unlock an available Tool attachment position through a worn, eligible carrier** such as an authored utility belt, tool harness or backpack with an exterior tool mount. A normal backpack's interior is not an instant-access Tool slot. A carrier provides actual named mount points with size, fit, location, access and capacity; the UI reflects these derived points only while the carrier is genuinely equipped.

**Recommended Back policy:** one core structural back load (backpack, frame or other large primary load) plus independently validated attached mounts, and a separate compatible cloak/garment layer. Do not make the whole Back exclusive to one item including attachments, and do not let it hold infinite bows, swords and shields. The Back area is an actual constrained physical arrangement, not just one broad item-class label.

**Shield policy:** a hand-gripped buckler, forearm-strapped guard, side/back-stowed shield, and a drawn shield are different use/attachment states. The forearm case does not grant unlimited free shield defense and a completely unrestricted hand. A shield stored on the back cannot use active block or bash until legitimately ready.

## 2. Repo evidence and what does not exist yet

- The canonical item catalog has backpack, pack_frame, utility_belt, coin_belt, casual_cloak, formal_cloak, travel_cloak, buckler_shield, kite_shield, tower_shield, pickaxe, lumber_axe, swords and bows. Their names do not prove straps, quick access or mount capacity.
- In source item records, those belts and backpacks have no declared quick-tool position or mount topology. The unselected native fit table contains neither backpack, pack_frame nor utility_belt fit rows.
- Native candidate `GEAR_SLOT_IDS` includes `slot.equipment.back`, `slot.clothing.back`, `slot.equipment.weapon.left/right`, arm and waist positions. It does not have an actually parented tool mount, independent drawn/held/forearm position or carrier-derived dynamic Tool slot. Its physical `GearLocation` is `worn | bag | overflow`, one location per instance.
- Native v3 fits place buckler_shield, kite_shield and tower_shield in `slot.equipment.weapon.left`. Their item records have active block and bash use profiles, but **do not specify strapped forearm versus gripped buckler**. The common historical buckler is typically hand-gripped. Do not quietly reinterpret the existing item as hands-free.
- The pickaxe has both `utility.mining` and `combat.melee.improvised`, while the lumber_axe has `utility.woodcutting` and `combat.melee.primary`. Both fit the right weapon position. Other weapon-eligible legacy tool exceptions, such as butcher_knife and skinning_knife, have no authored combat useProfiles. Weapon-slot fit does not imply damage or action permission.
- Older 17-position selected equipment/Save and the unselected native v3 stack require owner-led versioning, selected save/restart and survey replay validation. This document authorizes no direct mutation of either.

## 3. Conditional Tool slot, retrieval and timing

Candidate first pilot: one quick-access position provided by an actually equipped and suitable carrier; more positions depend on explicit capability and limits. A tool physically attached to the carrier uses the carrier's mounted slot, not a second copy of the tool in a bag. Tool capacity must be re-evaluated if the carrier is removed, damaged, unavailable or replaced.

| Where the tool is | Access posture | Timing principle |
| --- | --- | --- |
| Ordinary bag interior | Needs lawful reach into bag and free hands | Small bag retrieval overhead; amount owner-balanced later |
| Belt loop, sheath, external pocket | Only when a compatible worn carrier supplies exact mounting position | No *additional backpack rummage* time for normal tool use |
| Backpack exterior harness | Requires actual attachment capacity, size, clearance and tool retention | Quick if mounted access is legal; not all packs qualify |
| Selected primary weapon's sheath | Assignment alone not drawn | Draw/readiness timing separate from changing selected weapon |
| Authorized workplace-provided item | Requires real station equipment, permission and reach | Tool requirement met without taking tool as personal inventory |

Waived backpack overhead is not zero action time. Mining, crafting, changing attachments, clearing drawn swords, equipping in combat and two-handed work still observe their legitimate activity and body/clock costs. Do not reinterpret the previously directed one-watch full loadout-apply action as zero-time quick tool use. During combat, a "quick" tool is still subject to draw/recovery and action rules.

No container item identity automatically unlocks Tool. In particular, `coin_belt` is not automatically a tool belt, and generic backpack capacity is not an exterior tool loop.

## 4. Back, side and shoulder coexistence matrix

Model a core Back carrier, Back clothing, and accessory attachment points separately. A cloak can generally coexist with one back carrier *only where garment/strap coverage is compatible*. A pack frame plus backpack is one intentionally supported framed assembly, or two conflicting core loads, not two independent free slots.

| Example | Preferred disposition | Constraint |
| --- | --- | --- |
| Backpack + cloak | Normally compatible when authored | Separate garment and structural load layer; check straps/coverage |
| Backpack + shoulder-slung short bow | Conditional yes | Independent sling with no strap conflict, or compatible pack bow mount |
| Backpack + back-mounted long/composite bow | Conditional with rated mount | Size, draw clearance, projections, pack straps, retrieval |
| Backpack + sword on back | Only specialized sheath/harness | Back draw may be impractical for some lengths; hip sheath alternative |
| Backpack + side/hip-sheathed sword | Usually possible with separate compatible waist mount | Hip strap, armor and buckle interference checked |
| Ordinary backpack + kite shield on back | No by default | Explicit compatible shield mount required, no defense while stowed |
| Backpack + tower shield | No by default | Exceptional bulky transport owner and capacity required |
| Cloak + bow sling but no backpack | Conditional yes | Garment coverage and shoulder-sling fit |
| Backpack + pack frame separately | No by default | One core load, unless approved integrated frame-pack assembly |
| Utility belt + small tool | Only if item-specific belt mount fit | One first-pilot tool slot, condition/capacity |
| Standard backpack + shovel inside | Carryable only if bulk/capacity allow | Not instant-access, and may not physically fit |
| Specialized backpack + shovel exterior | Conditional yes | Required loop/harness, balance and access |
| Backpack + two attached weapons | Only if the same carrier authorizes both mounts | Aggregate bulk, overlapping attachment volume and access |

The **visual** Back slot can show the main carrier, cloak and nested mounted-gear icons. These are not extra permanent saved global slots. The core back attachment and subordinate mount provider hierarchy should be explicit, not inferred from UI positions.

## 5. Shield mounting and availability

| Shield form | Physical mode | Hand / arm constraint | Defense eligibility |
| --- | --- | --- | --- |
| Existing buckler_shield | Gripped by default until authoring decision | Gripping hand occupied | Existing small shield block/bash when drawn/readied |
| Future forearm-strapped guard/buckler variant | Worn on actual forearm mount | Forearm commits; hand may be usable for **some** tasks, not all | Limited passive/active brace only if separately authored |
| Kite/standard shield ready | Held or correctly strapped and braced | Usually occupies or restricts offhand | Existing medium shield actions when valid |
| Shield on side/back mount | Stowed, not blocking | No blocking hand committed; carrier capacity consumed | No active block/bash until drawn |
| Tower shield | Large and physically demanding | Strong stance/hand/arm/bulk constraints | Not a free backpack ornament |

A future shield capability contract must specify `mountingStyle`, bracing/readiness, permitted forearm armor layering, allowed hands-on-shield and hand-other-task combinations, reach/block action validity and storage size. Consider a distinct item/profile for a true forearm-strapped guard instead of changing the existing buckler's meaning silently. A forearm strap should not enable shield blocking, two-handed archery, dual wield, and full-strength grappling all at once. Tests must cover these conflicts.

A shield hung from the back does not need to occupy the old left-weapon position as an actual **hand**; the selected offhand preference can remain a reference. Its physical position must be the real carrier mount, and block eligibility follows actual readiness.

## 6. Tool as Primary Weapon: source evidence and combat balance

Preserve `itemClass: tool` and each item's exact identity. A combat-capable tool may be assigned as Primary Weapon for convenience if (a) it has an explicit approved combat action/use profile; (b) weapon assignment eligibility/fit is authored; (c) it can lawfully be drawn/held in real hands; (d) its combat numbers and resource hooks are accepted. A tool assigned as a weapon should still work as its functional tool and return to its legitimate mount/container without producing a second item.

Start with the actual pickaxe and lumber_axe profiles as evidence. Potential follow-up tool candidates include hammer, blacksmith_hammer, maul, sledge_hammer, shovel, spade, pitchfork, sickle, skinning_knife, butcher_knife, saw and chisel. This is a **review list**, not authorization to attack with them. Do not create `combat.melee` actions for all 70 grip candidates.

Combat comparison must account for damage type, reach, one/two-hand posture, accuracy, recovery, stamina, timing, proficiency/skills, durability under combat, improvised penalties, special hazards and utility advantage. Do not use price/valueProfile as an offensive stat. No numeric damage or new skill ranks are assigned in this docs-only pass. Reconcile future `items.weapon_profiles` with existing embedded `useProfiles` to avoid a second combat owner.

## 7. Possible runtime/Save contract, explicitly illustrative

- **Carrier static capabilities**: allowed attachment types, mount IDs scoped to exact carrier instance, dimensions/weight/shape/retention, permitted body locations and optional quick-access descriptor. Future container templates must be reconciled rather than duplicating container authority.
- **Physical item location**: an eventual exact `attached` reference to `carrierInstanceId + mountId`, or `held` position with left/right/both hand claims, in addition to existing supported locations. These are *conceptual candidate fields*, NOT the current schema.
- **Assignment references**: selected Primary Weapon, secondary/offhand preference and preset references are non-owning and independent of physical state.
- **Forearm occupancy**: separate constraint from a full hand grip. A two-hand tool can reserve both hands without cloning item location; a forearm guard can conflict with two-hand activities even when finger manipulation is allowed.
- **Transactions**: atomic attach/detach, draw/hold, use/return, carrier removal/replacement, interrupted action and loss of access with a unique request receipt, stale revision and failed-request no-op. An attached item must not also occupy a bag slot or another worn slot.
- **Containers**: carrier plus mounted items form a cycle-free physical graph. Transfer/removal conserves exact contents and total bulk; never silently drop, duplicate or leave a detached phantom mount.
- **UI**: dynamically show Tool and mounted bow/shield/sword only for real legal positions, and explain why an otherwise owned tool is not quickly accessible.

## 8. Activation gates and required acceptance proofs

1. T1 candidate evidence reviewed, per-item combat/holder eligibility approved, bounded first carrier selected; no inferred flags.
2. Decide true static item/carrier/fit/armor-shield profile ownership and validate schemas/tests in an authenticated checkout.
3. Reconcile the selected native gear/Save and historical Ashen Reef survey witness, account/descendant recovery, typed revisions, versioned round-trip and restart. No parallel old 17-slot map.
4. Implement one working vertical slice: sheathed assigned sword plus a carried eligible tool, first through bag and then through a single actual belt/pack mount; identical tool instance and lawful timing, with Save persistence.
5. Test back-core conflicts, cloak compatibility, backpack plus fitted bow/sword/shield mounts, full capacity, illegal double occupancy, carrier removal/transfer, shield stow versus active block, true forearm restraint, two-handed tools, improvised tool combat, negative/failure paths and cross-domain resource parity.
6. Only then expand to backpack harness varieties, multiple Tool mounts, specialized shield guard modes, detailed combat balance, travel encumbrance and NPC/workstation equipment.

**Scope and disposition:** documentation only on draft PR #40, `HOLD_NAMED_CONSUMER`; no data, schema, tests, runtime, UI, Save or version modification. Native PRs #20 through #39 and active Codex coordination files remain untouched. Next implementation consumer is the post-native-v3 owner/schema preflight, not a direct item catalog patch.
