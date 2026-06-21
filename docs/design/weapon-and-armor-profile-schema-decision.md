# Weapon And Armor Profile Schema Decision

Source version/run: Version 0.5.221 - Weapon And Armor Profile Schema Decision
Date: 2026-06-21
Status: approved documentation-only schema posture; no implementation permission

## 1. Decision Summary

Approve separate future `items.weapon_profiles` and `items.armor_profiles` static collections. Keep `items.items` as canonical item identity and keep all current item-local `useProfiles` unchanged as live action/use metadata.

The split is justified because current `useProfiles` mix active weapon attacks, passive armor handling, shield actions/reactions, utility tools, and magic channeling, while coverage is intentionally sparse: only 7 of 35 weapon items and 6 of 18 armor items have profiles. Expanding `useProfiles` into a complete equipment-classification authority would conflate what an item structurally supports with what actions it currently grants.

Future equipment profiles are additive one-to-one static descriptors keyed by canonical `itemKey`. They must not duplicate item identity, values, item-local action/use data, resolution hooks, crafting/market/reward data, or runtime item-instance state. Existing item records are not migrated, edited, aliased, or made to reference profiles in this decision.

Weapon profiles may later own weapon family, handedness, compatible weapon slots, delivery/range posture, and narrow equipment compatibility tags. Armor profiles may later own armor kind/family, compatible equipment slots, coverage, weight/encumbrance posture, mobility posture, and narrow equipment compatibility tags. Damage hooks, mitigation hooks, action timing, target profiles, skill action requirements, and effect channels remain current `useProfiles` authority for now.

No schema, validator, content, test, runtime, UI, storage, migration, equipment, combat, inventory, item-instance, or gameplay change is approved by this decision.

## 2. Live Repo Reality

Live inspection confirms and narrows the temporary item/equipment research:

- `packages/content/base/items/items.json` contains 1,372 canonical item records. Every item id equals `item.<itemKey>`; ids and item keys are unique.
- `packages/schemas/items/item.schema.json` is a strict record schema with 20 properties and 11 required identity/value fields. Content lint validates the records-only wrapper and cross-file semantics.
- The catalog contains 35 `weapon` items and 18 `armor` items. No weapon-profile or armor-profile collection/schema exists.
- Sixteen items contain 22 embedded `useProfiles`: seven weapon items, six armor items, two tool items, and one clothing item. Tools may have both utility and combat profiles; shields may have block and shield-bash profiles; a staff may have combat and magic-channeling profiles.
- Every live use profile contains action type, primary/support skills, rank requirements, mastery rank, effect channels, handling type, proficiency/hybrid skill metadata, combat tags, resolution hooks, and grant tags. Nineteen also contain target and activation profiles.
- Current handling types include `weapon`, `shield`, `armor`, and `hybrid`; the schema also permits `tool`. Current action types include melee/ranged attacks, shield defense/interrupts, passive armor, utility extraction, and magic focus.
- Shared runtime state defines weapon-left/right and eight armor-body equipment slots. Equipped references carry item identity plus mutable instance/state data; no static item-to-slot compatibility authority currently exists.
- Combat runtime consumes item `useProfiles` to build actions and armor/shield handling grants. Resolution hooks, activation timing/costs, targeting, effect channels, and skill identities are live behavior inputs.
- Market values, production chains, recipe planning, monster drops/loot, and quest rewards use canonical item references and retain their own authorities.
- No general durability/condition, quality/rarity/affix, enchantment-state, ammo-instance, container, loot-table, or item-instance content authority exists.

The temporary artifact's general recommendation for separate equipment profiles is sound. Its broader uncertainty about live item identity, consumable profiles, market ownership, and runtime inventory has already been resolved by permanent decisions and live code.

## 3. Existing Item and UseProfile Inventory

`items.items` currently owns:

- `id`, `itemKey`, `name`, `itemClass`, `itemBranch`, and `itemSubBranch`;
- base value, currency/value unit, marketability, and value profile;
- optional material difficulty, roles, tags, processing groups, production stage, and aliases;
- consumable/spoilage profile references;
- current embedded `useProfiles`;
- separately validated catalyst/conduit metadata in live content where applicable.

The `useProfiles` contract owns item-local use/action descriptors:

- action type and activation timing/cost posture;
- target disposition/shape/range/accuracy posture;
- primary, support, proficiency, and hybrid skill references plus rank thresholds;
- handling type;
- effect channels;
- combat tags, resolution hooks, and grant tags.

Preserve all 22 live profiles in place. They are not provisional schema clutter: lint and combat runtime consume them. They remain valid for combat-capable tools, shields, clothing, magic foci, and other multi-use items that may never belong in weapon/armor profile collections.

Sparse profile coverage does not authorize bulk generation. Future weapon/armor profiles require their own seed plan after schemas/validators are approved.

## 4. Future Weapon Profile Collection Posture

Approve `items.weapon_profiles` as a separate records-only authority.

Candidate future paths and identity:

- content: `packages/content/base/items/weapon_profiles.json`;
- schema: `packages/schemas/items/weapon-profile.schema.json`;
- strict wrapper: `{ "records": [...] }`;
- profile id: `weapon_profile.<itemKey>`;
- exactly one profile per canonical `weapon` item key when that item is intentionally covered.

The first schema candidate should allow:

- `id` and canonical `itemKey`;
- `weaponFamily` as a controlled equipment classification;
- `handedness` such as `one_handed`, `two_handed`, or `versatile` only where live authoring proves the term;
- `compatibleSlotIds` limited to canonical weapon slots;
- `deliveryPosture` such as melee, ranged, or hybrid;
- `rangePosture` as broad static compatibility, not distance execution;
- narrow `equipmentTags` for compatibility/classification not already represented by generic item tags;
- provenance/source-authority notes and authoring notes.

Do not admit actions, target profiles, activation timings/costs, effect channels, resolution hooks, damage formulas, damage rolls, cooldowns, ammo counts, current state, or skill progression. Existing `useProfiles` remains the action/combat-hook owner.

Tool-class items with combat use profiles do not become weapon-profile records automatically. Their combat/utility behavior remains item-local unless a later hybrid-equipment decision changes item classification.

## 5. Future Armor Profile Collection Posture

Approve `items.armor_profiles` as a separate records-only authority covering armor and shield structural descriptors.

Candidate future paths and identity:

- content: `packages/content/base/items/armor_profiles.json`;
- schema: `packages/schemas/items/armor-profile.schema.json`;
- strict wrapper: `{ "records": [...] }`;
- profile id: `armor_profile.<itemKey>`;
- exactly one profile per canonical `armor` item key when intentionally covered.

The first schema candidate should allow:

- `id` and canonical `itemKey`;
- `armorKind`, initially body armor or shield;
- `armorFamily` as controlled structural classification;
- `compatibleSlotIds` using canonical body or weapon-hand slots as appropriate;
- `coverageSlotIds` for the body areas structurally covered;
- broad `weightClass`, `encumbrancePosture`, and `mobilityPosture` descriptors;
- narrow `equipmentTags` for compatibility/classification;
- provenance/source-authority notes and authoring notes.

Do not admit block/mitigation formulas, passive actions, reactions, target/activation fields, effect channels, resolution hooks, movement penalties, stamina costs, current durability, or equipped state. Current shield and armor `useProfiles` retain the live action/handling-hook contract.

Clothing with armor-handling use profiles does not become an armor profile automatically. It remains item-local unless a later protection/clothing decision expands eligibility deliberately.

## 6. Item Identity vs Equipment Profile Boundary

`items.items` remains the only owner of:

- canonical id/item key/name;
- item class, branch, sub-branch, roles, generic tags, aliases, and production stage;
- base value, currency/value unit, marketability, and value profile;
- material difficulty and processing metadata;
- consumable/spoilage/catalyst/conduit references and metadata;
- current item-local use/action profiles.

Weapon/armor profiles own only normalized structural equipment descriptors that item identity and use/action metadata do not express cleanly. A profile reference does not rename, replace, or become the item.

Profiles reference items by canonical `itemKey`, not item id. Item keys dominate market, production, recipe, drop/loot, and related cross-file contracts, while live validation already guarantees `id === item.<itemKey>`. The profile id incorporates the same key and must resolve to exactly one eligible item.

Do not add `weaponProfileId` or `armorProfileId` to item records initially. Semantic validation can enforce one-to-one reverse lookup from profile to item without editing 1,372 item records. A later consumer may look up the profile by item key.

## 7. Weapon Static Descriptor Boundary

Weapon-profile-owned descriptors:

- weapon family/classification;
- one-handed/two-handed/versatile posture;
- compatible left/right weapon slots and any explicit both-hands requirement;
- melee/ranged/hybrid delivery posture;
- broad range posture;
- structural equipment compatibility tags.

Keep these item-local or use-profile-owned:

- generic item class/branch/sub-branch/tags and identity;
- action type, targeting, activation timing/costs, skill requirements, proficiency/hybrid action skills, effect channels, combat tags, resolution hooks, and grant tags;
- conduit/catalyst/magic metadata;
- value, crafting, production, and market metadata.

Damage families remain hook-derived under the combat decision. Do not add canonical damage-family fields until a dedicated damage taxonomy exists. Current `damage.melee`, `damage.ranged`, weapon-family, armor-break, stagger, and similar hooks remain `useProfiles` action metadata.

Do not add hard character classes or class gates. The project remains classless where supported. Proficiency and skill requirements remain current use/action descriptors; future equipment eligibility hints require a dedicated decision if use-profile skill references prove insufficient.

## 8. Armor Static Descriptor Boundary

Armor-profile-owned descriptors:

- body-armor versus shield kind;
- armor/shield family;
- compatible equipment slots;
- body-area coverage;
- broad weight, encumbrance, and mobility posture;
- structural equipment compatibility tags.

Keep these item-local or use-profile-owned:

- generic item identity/classification/tags and material/value metadata;
- armor/shield passive actions and reactions;
- proficiency/action skills and rank thresholds;
- effect channels, combat tags, resolution hooks, grant tags, target profiles, and activation;
- block, mitigation, evasion, threat, recovery, movement, or stamina execution values.

Armor categories belong in static armor profiles when they describe structural family/coverage/weight posture. Damage mitigation and defense families remain validated hooks and runtime resolution inputs until a dedicated combat taxonomy/mitigation decision proves another owner.

Compatible slots and coverage are static descriptors. Actual slot occupancy, conflicts, equipping, unequipping, layering, hand use, and penalties remain runtime equipment behavior.

## 9. Combat, Monster, Encounter, Role, Tactics, Crafting, Market, Quest, and Reward Reference Posture

Weapon/armor profiles should not directly reference combat roles, tactics presets, monsters, encounter templates, production chains, crafting recipes, market-value records, quests, or reward envelopes.

Reference direction remains:

- equipped runtime item -> canonical item key -> optional weapon/armor profile lookup;
- item-local `useProfiles` -> skills, action descriptors, and supported combat hooks;
- recipes/production chains -> item keys as transformation outputs/inputs;
- market values -> item keys;
- monster drops/loot and quest/reward envelopes -> item keys;
- monsters/encounters/roles/tactics remain independent combat/world authorities.

Crafting, markets, quests, rewards, monsters, and encounters may benefit from profile classification through the canonical item key, but they must not duplicate profile fields or cause execution. Profiles must not own prices, recipes, drop chances, quest conditions, rewards, monster loadouts, tactics, target selection, or AI behavior.

## 10. Durability, Condition, Repair, Salvage, Quality, Rarity, Affix, Enchantment, Charges, Ammo, Stack, Ownership, Inventory, and Equipped-State Boundary

Keep all item-instance and mutable fields outside static profiles:

- current/max durability, condition, damage, breakage, wear, repair state, and repair history;
- salvage execution, destruction, recovered quantities, or replacement;
- rolled/final quality, rarity, random or selected affixes, masterwork state, improvement/upgrades, and reforging;
- current enchantments, temporary effects, bound spells, charges, cooldowns, and activation state;
- loaded/current ammo, magazine/quiver state, projectile consumption, and stack counts;
- item-instance id, owner, stolen/bound/contraband state, container/inventory location, quantity, equipped flag, occupied slot, and loadout;
- runtime modifiers, generated names, provenance history, persistence, and UI state.

Future static durability, quality, enchantment, ammo-compatibility, repair, salvage, or affix authorities require dedicated decisions. Even then, static definitions must remain separate from state on a particular item instance.

Profiles must not roll damage or mitigation, equip items, consume ammo, mutate inventory, reserve hands, apply penalties, generate instances, or execute repair/salvage/enchantment behavior.

## 11. Magical, Crafted, Unique, Faction, Guild, Quest, and Lore Equipment Posture

Do not add special profile-specific references for magical, alchemical, crafted, unique, faction, guild, quest, or lore-bearing equipment in the first contract.

Keep:

- catalyst/conduit and other magic compatibility metadata item-owned;
- crafting recipes and production chains external and item-key based;
- unique/quest/faction/guild/lore identity in canonical item tags, descriptions, or future dedicated authorities when approved;
- Knowledge, spell, ritual, trial, guild, faction, quest, and provenance relationships external and descriptive.

A weapon or armor profile describes structural equipment compatibility regardless of narrative source. External authorities may reference the item key; the profile must not grant spell ownership, Knowledge/trial progress, faction/guild access, quest progress, crafting rights, enchantments, rewards, or services.

## 12. Loot, Drop, Reward, and Source-Local Output Boundary

Keep monster drops/loot, encounter outputs, quest rewards, vendor stock, NPC gear, crafting outputs, and other acquisition envelopes source-local until a dedicated loot/reward authority decision.

Weapon/armor profiles do not own drop weight, chance, quantity, rarity, vendor availability, market price, quest reward, equipment grant, or item-instance generation.

The preferred future general loot-table owner remains separate item content, provisionally `items.loot_tables`, as established by the item and monster decisions. That future decision must reconcile source-local envelopes before migration. Profile existence must not make an item lootable, equippable in current state, granted, owned, or available.

## 13. Validation Hardening Direction

The conditional `Version 0.5.233 - Weapon And Armor Profile Schemas And Validators` may implement the approved additive contracts after a fresh scope check. It is not pre-approved beyond the current roadmap condition.

Candidate validation:

1. strict records-only wrappers, no additional properties, unique profile ids, and exact `*_profile.<itemKey>` coherence;
2. canonical item-key resolution and one profile per item key;
3. weapon profiles require `itemClass: weapon`; armor profiles require `itemClass: armor` unless a later decision explicitly expands eligibility;
4. controlled family, handedness, kind, delivery, range, slot, coverage, weight, encumbrance, mobility, and equipment-tag vocabularies;
5. compatible slots agree with weapon handedness or armor kind/coverage;
6. shield profiles use weapon-hand slots while retaining armor item identity;
7. profiles do not duplicate item identity/value/material/use-profile fields;
8. existing item `useProfiles` continue schema/lint/skill/hook validation unchanged;
9. any parity check between profile classification and current use-profile handling/tags reports contradictions without migrating action data;
10. reject runtime, instance, durability, quality, rarity, affix, enchantment-state, ammo-count, stack, owner, inventory, equipped-state, combat-execution, loot, reward, migration, alias, and UI fields.

The later pass should add strict schemas, pure semantic validators, focused in-memory tests, and schema-file registration without content seeds or item edits. Profile content requires a later seed plan.

## 14. Temporary Research Artifact Handling

Delete `docs/dev/tmp-item-equipment-inventory-systems-research-2026-06-20.md` in this pass.

All useful guidance has permanent ownership:

- broad item, consumable, equipment, container, loot, market, reward, magic, crafting, and runtime boundaries live in `docs/design/item-equipment-inventory-authority-boundary-decision.md`;
- exact weapon/armor collection, field, item-key, use-profile, reference, runtime, and validation posture lives in this document;
- source-local loot posture is reinforced by `docs/design/monster-record-schema-decision.md`;
- crafting/item transformation posture lives in `docs/design/recipe-and-production-schema-decision.md`;
- future container/loot/durability/quality/enchantment/item-instance work remains in permanent backlog and roadmap guidance.

There is no remaining consumer for the temporary artifact. Future container or loot-table decisions must use permanent docs and perform a fresh live-repo audit rather than retain stale research staging.

## 15. Non-Goals

This decision does not authorize:

- schema, validator, test, content JSON, runtime, UI, storage/save-state, migration, equipment, combat, inventory, item-instance, or gameplay changes;
- item edits, field moves, `useProfiles` migration, replacement collections, aliases, normalization, or compatibility behavior;
- weapon/armor/container/loot/inventory/item-instance/durability/condition/repair/salvage/quality/rarity/affix/enchantment/ammo schemas or content;
- damage/mitigation rolls, action/effect execution, AI targeting, threat, cooldown, turn state, equipping, slot resolution, inventory mutation, item creation, loot rolls, reward payout, crafting execution, or transactions;
- class gates, skill progression, quest mutation, Knowledge/trial progress, magic execution, UI, or transition to `0.6.0`.

## 16. Next Recommended Version

Proceed with `Version 0.5.222 - Quest Objective And Condition Schema Decision`.

That pass remains documentation-only. It should reconcile embedded quest objectives/conditions across definitions, archetypes, and templates, preserve offer/player/Chronicle runtime owners, and decide the quest/event research artifact's retirement.

No new GPT Deep Research is required before `0.5.222`. GPT-DR labels remain non-Codex labels, and the permanent prompt-pack guidance does not interrupt the immediate numbered queue.
