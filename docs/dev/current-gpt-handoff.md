# Current GPT Handoff

Source version/run: Version 0.5.221 - Weapon And Armor Profile Schema Decision
Date: 2026-06-21
Branch/status assumption: `master`; latest numbered Codex run is documentation-only.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest handoff.
- `docs/dev/gpt-codex-tooling-instructions.md` remains the active operational guide.
- `docs/design/weapon-and-armor-profile-schema-decision.md` is the permanent equipment-profile schema-posture authority.
- `docs/design/item-equipment-inventory-authority-boundary-decision.md` remains the broader item/equipment/inventory ownership authority.
- `docs/design/monster-record-schema-decision.md` owns current monster/source-local loot boundaries.
- `docs/design/recipe-and-production-schema-decision.md` owns future crafting transformations and item-key references.
- `docs/design/gpt-deep-research-prompt-pack-decision.md` remains permanent later research guidance and does not interrupt the numbered queue.
- GPT-DR labels do not consume `0.5.x` version numbers.
- Runtime equipment, inventory, item instances, combat execution, UI, and save state remain outside this decision queue.

## Current Anchor

Latest completed numbered Codex run:

- `Version 0.5.221 - Weapon And Armor Profile Schema Decision`

Immediate next numbered Codex run:

- `Version 0.5.222 - Quest Objective And Condition Schema Decision`

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Equipment Profile Decision Result

- `items.items` remains canonical static item identity.
- All 22 current item-local `useProfiles` remain unchanged as live action/use/activation/skill/hook metadata.
- Separate future `items.weapon_profiles` and `items.armor_profiles` are approved as additive structural descriptor collections.
- Profiles use canonical `itemKey` references and one-to-one reverse lookup; item records do not gain profile-id fields initially.
- Weapon profiles may own family, handedness, compatible weapon slots, delivery/range posture, and equipment tags.
- Armor profiles may own kind/family, compatible slots, coverage, weight/encumbrance/mobility posture, and equipment tags.
- Damage/mitigation hooks and action skill/timing/target/effect data remain in `useProfiles`.
- Durability, condition, quality, rarity, affixes, enchantment state, charges, ammo counts, stacks, ownership, inventory location, and equipped state remain future/runtime/item-instance concerns.
- Loot/drop/reward relationships remain source-local pending a dedicated item-owned loot-table decision.
- The temporary item/equipment research artifact was deleted after full promotion and has no remaining consumer.
- No schema, content, validator, test, runtime, UI, storage, gameplay, equipment, combat, inventory, item-instance, or migration change occurred.

## Consolidated Near-Term Queue

1. `0.5.222 - Quest Objective And Condition Schema Decision`
2. `0.5.223 - Person vs NPC Schema Decision`
3. `0.5.224 - Magic Study Source Schema Decision`
4. `0.5.225 - Polity Schema Decision`
5. `0.5.226 - Household vs Family Schema Decision`
6. `0.5.227 - Settlement Economy Schema Decision`
7. `0.5.228 - World Map Feature Authority Schema Decision`
8. `0.5.229 - Hazard And Route Security Boundary Decision`

No new Deep Research is required before this queue.

## Next Route Boundary

`Version 0.5.222 - Quest Objective And Condition Schema Decision` remains documentation-only. It must reconcile embedded objectives and conditions across quest definitions, archetypes, and templates, preserve generated-offer/player/Chronicle runtime owners, and decide the quest/event research artifact's retirement.

It must not implement schemas, validators, content, tests, quest runtime, rewards, events, Chronicle mutation, UI, storage, or gameplay behavior.
