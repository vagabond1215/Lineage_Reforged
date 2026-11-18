# Weapon affinity: normalized STR/DEX/AGI style weights and handling efficiency

Date: **2026-11-18** (America/New_York)  
Status: **OWNER-DIRECTED DESIGN PROPOSAL / CREATOR DISPLAY INTENT ONLY / COMBAT AND ITEM SCHEMAS NOT_MODIFIED**  
Grounded repo posture: [approved weapon/armor profile schema boundary](weapon-and-armor-profile-schema-decision.md), [current combat equipment / ranged ammunition interface prework](combat-equipment-and-ranged-ammunition-interface-prework-2026-10-20.md), `packages/schemas/items/weapon-profile.schema.json`, `packages/content/base/items/items.json`, `apps/rpg-ui/src/game-shell/characterAttributes.ts`. Companion [compact Creator UI contract](creator-compact-navigation-three-column-attributes-ten-lineages-2026-11-18.md). Source reviewed at `master` `f4db089d95f3cd62d8d95804706ca2a8f6a2b23d` before this doc series.

## 1. Problem and source reality

A power-oriented character should be able to use a finesse weapon, and a high-Dexterity character should be able to land blows with a heavy weapon, **without every weapon receiving identical benefit from raw Strength or only one magic “weapon style” bucket**. Three distinct concerns need separate attribution:

- **Damage potential:** delivered force, energy and effective contact; not merely “Melee STR damage”. A bow can demand STR for draw tension, while DEX matters for aim and release; actual mechanics deferred.
- **Accuracy/control:** precision, timing, balance, target handling, skill and weapon demands.
- **Efficiency:** the degree to which the character can use the weapon's leverage, momentum, rhythm and effort economically; potentially relevant to stamina cost, action tempo, damage conversion and recovery, but no approved formula yet.

The approved `weapon-and-armor-profile-schema-decision.md` permits future **descriptive-only** `items.weapon_profiles` attached to canonical `itemKey`. `weapon-profile.schema.json` currently includes family, handedness, slots, delivery/range posture, and `finesse` as one possible equipment tag. It **does NOT** define stat weights, damage, accuracy, efficiency or combat effects. Existing `items.items[*].useProfiles` and combat action owner retain current action/damage-hook authority. Any stat-weight extension requires a separate schema and owner approval, never be inserted in the present static schema without its own versioning/validation. This document does not expand current combat authority.

The checked-in item catalog includes `item.maul`, `item.chakram`, `item.chain_whip`, `item.exotic_whip`, `item.dirk_dagger`, `item.greatsword` and existing bows. That proves item identity, **not** an accepted set of damage/weight coefficients.

## 2. Proposed canonical representation for later review

**Prefer one normalized weight vector per *weapon and relevant attack/use mode*:** `{ STR, DEX, AGI }` with each finite number `0 ≤ weight ≤ 1` and exact `STR + DEX + AGI = 1` (appropriate integer basis points, e.g. sum exactly 1000, is safer for durable authored storage than floating rounding). The vector labels the weapon's **handling emphasis**, not a damage multiplier yet.

Why this beats only two hard buckets:

- A `Power` versus `Prowess` binary would conceal a bow's draw-strength requirement and a dagger's difference between precision and quick tempo.
- A full vector can be read as a **player-friendly derived badge**: “Power”, “Technique”, “Agility”, “Hybrid / Balanced”, with stronger and secondary contributing stats, without changing canonical weapon or item identity.
- A short authored source entry can add **minimum draw/handling demands**, `two_handed`, `thrown`, `reach`, `finesse`, ranged needs, attack-mode compatibility **only when separate current source owners support them**. Do not turn a generic stylistic tag into an ammo or equip bypass.
- The creator's **Power / Prowess / Mind** visual attribute groups are deliberately **not** these combat score buckets. Power includes CON/VIT, Prowess includes CHA; the physical weapon weights cover only STR/DEX/AGI. A group label must not automatically aggregate its three visible stats to increase attack damage.

**Illustrative weight candidates, not approved content.** All sum to 1.00 and should be tested later against real canonical item families/use modes:

| Existing candidate item (verify exact active use before any promotion) | STR | DEX | AGI | Conceptual handling |
| --- | ---: | ---: | ---: | --- |
| Maul | 0.80 | 0.10 | 0.10 | Power: moving and controlling high mass |
| Club | 0.70 | 0.20 | 0.10 | Power: physical impact with modest technique |
| Whip | 0.10 | 0.65 | 0.25 | Technique: wave timing and distance control |
| Chakram | 0.15 | 0.55 | 0.30 | Precision plus movement and trajectory |
| Dirk dagger | 0.15 | 0.40 | 0.45 | Quick positioning plus precise placement |
| Short bow | 0.35 | 0.50 | 0.15 | **STR draw tension** plus aimed release |
| Greatsword | 0.55 | 0.25 | 0.20 | Physical leverage with technique and footwork |
| Neutral/balanced sword variant | 0.34 | 0.33 | 0.33 | Mixed contribution, pending actual item/attack identity |

`Club` and “neutral sword variant” are **category examples**, not claims about confirmed item records or current use profiles. A single item may need different vectors for thrust versus cut versus thrown use if the **actual existing action source** supports those distinctions. Do not invent selectable action modes in Creator merely to fill the table.

**Mind weapons?** An enchanted staff, magical focus, wand or conduit may have a **separate spell/channel affinity** under INT/WIS/SPT (or use-mode rules) in the future. Do not cram spell effects into STR/DEX/AGI or pretend that three physical weights capture a spell's inner control. A staff may have a physical strike vector and an independently approved magic-channel profile; profile coexistence requires the real `useProfiles` / skill / effect owner. No “Mind = magic damage” shortcut.

## 3. Damage, accuracy, efficiency: separate levers for future combat review

A future combat system can project a weapon's normalized vector into a **fit** relative to character STR/DEX/AGI. The fit may express whether the player is able to exploit its strengths efficiently, not simply whether the weapon is equippable. Proposed separate conceptual levers:

- **Damage**: weapon's validated attack source + contact/impact potential + learned technique, with appropriate draw-energy floor or movement; don't rewrite all ranged output as STR damage.
- **Accuracy**: supported weapon handling, timing and target status; high DEX can mean reliably landing a heavy blow, but cannot erase the need to control heavy momentum.
- **Efficiency**: how well the user converts relevant attributes and skills into controlled output with sustainable effort, perhaps changing stamina/action recovery or a bounded technique multiplier. A strong wielder with a whip might generate force but waste its advantage unless DEX/AGI produce controlled wave propagation; a nimble maul wielder might land hits but handle follow-through inefficiently.
- **Skill/mastery/handling/weight**: must remain independent, bounded and source-verified. Direct attribute-affinity fit does not substitute for the current `skill.combat.weapon.*` owner or grant new actions.
- **Caps and monotonic behavior**: a stronger character should not get *worse* absolute damage just because DEX is relatively lower; relative fit is a comparison between equivalent attributes/weapons, not a stat-growth penalty. The eventual equations need explicit bounds, baseline comparisons, no dominant stat exploit and tests against extremes.
- **No double count**: if STR contributes draw tension or raw impact, ensure it is not multiplied unchecked again in efficiency, handling, and base damage. DEX/AGI should not each grant the same accuracy benefit through three adjacent projections.

**No numerical combat, accuracy, stamina, crit, armor, skill, range or economy formula is approved here.** The vector is a proposed classification and future fitting input only; combat is an independent owner and acceptance route.

## 4. What the user should see now in Character Creator

The current task permits **Creator UI menu/description changes only**:

1. Revise STR's **creator-facing explanation** from narrow “melee impact” to **physical impact, carrying/lifting and bow-draw capability**. Clarify it describes intended broader stat meaning; actual bow scaling is not yet implemented. Source `characterAttributes.ts` tooltip currently presents melee emphasis. Any published in-game UI must avoid claiming a live draw/damage formula until verified.
2. In eventual **World Entry gear/character build preview**, show a weapon's accepted `Power / Technique / Agile / Hybrid` handling badge and optionally a tiny 3-segment STR/DEX/AGI weight visualization **only when real authored data exists**. If no accepted data exists, omit the badge; do not compute fake stat bonuses from item names (`contains('whip')`, etc.).
3. Keep the creator's Power/Prowess/Mind category explanations as UI taxonomy and the present nine-stat values intact. **No interactive weapon modifier slider, damage/accuracy/efficiency prediction, fake equip bonus or automatic weapon reward** until actual owner/item/source/Save semantics are accepted.
4. Do not add the proposed weights to `CharacterCreationFormState`, `SaveSnapshot`, `items.items`, `weapon-profile.schema.json`, existing `useProfiles` or combat resolution in this UI-only slice. Avoid new global “Prowess” points affecting every weapon.
5. If future attribute allocation (90 base + 10 discretionary) is approved, display relevant weapon emphasis help without using weapon type to grant character build points.

## 5. Separate later owner review: decisions and acceptance tests

**Decision questions:** Author weights at weapon family, item, action/attack mode, or combination? What are bow draw requirements, what if strength is insufficient, what part of DEX/AGI relates to range/attack speed, how does skill mastery interact with low-efficiency weapon, are enchanted/Mind weapons separate source profiles, and how does item quality/condition influence practical effects?

**Required later unit/math/property tests:** reject weight totals other than one, NaN/negative/nonportable values, and missing canonical item/mode; no invented weapon IDs; nominal maul/whip/bow/neutral comparison; source-safe 0/low/extreme stat vectors; 90+10 character generation parity; no negative/no overflow resource or damage; maxed STR/low DEX whip not outperform equal-strength high DEX by technique alone unless deliberately accepted; high-DEX maul can hit without all-power damage; pure STR draw-bow potential does not grant magical precision; never overwrite old accepted Save or alter existing item grants on migration.

**Real caller tests (later):** equipment slot/hand conflicts, melee/ranged target legality, current `useProfiles` identity, ammo reservation/consumption status, spell-channel actions, stamina/action queue, interruptions, readback/retry, duplicate prevention, backward compatibility and feature-off parity. Separate active Combat owner reviews these; **none** are modified or proven by the Creator preview or documentation. Existing combat and first-World activation holds remain.

## 6. Current disposition and next allowed implementation

Owner-selected product direction: **Normalized STR/DEX/AGI per-weapon weighting is the preferred design candidate**, with easy-to-read derived style names, distinct potential damage/accuracy/efficiency, broad STR physical draw/impact intent and a separate later magic-channel concept. **No numerical weights or future formulas are content-accepted**; the table is illustrative. The safe Creator UI slice can change *labeling/layout/help text* once synchronized repo tests are available; it cannot activate combat effects, item schema extension, damage previews or skill rules.

Related preview `lineage-creator-clean-attribute-weapon-intent-preview.html` in this conversation contains no real weapon score UI or fake combat state; it adjusts the STR explanatory line and improves the Creator layout and source lineage options only. The work remains a **standalone in-memory mock + docs-only repository handoff**, not production implementation. Run no damage-combat test and claim no save approval from it.
