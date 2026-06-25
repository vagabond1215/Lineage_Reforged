# Current GPT Handoff

Source version/run: Version 0.5.233 - Weapon And Armor Profile Schemas And Validators
Date: 2026-06-25
Status: equipment profile schema/validator pass completed; no live profile content, normal lint registration, item edits, runtime, UI, storage, combat execution, inventory, or gameplay change

## Authority Rules

- Existing `items.items` remains canonical item identity. No `weaponProfileId` or `armorProfileId` was added to item records.
- Existing item-local `useProfiles` remain the current live action/use/combat-hook authority. They were not migrated, extracted, normalized, or replaced.
- Future `items.weapon_profiles` and `items.armor_profiles` are additive descriptive authorities only.
- Profile records reference canonical `itemKey` and enforce exact profile ids:
  - `weapon_profile.<itemKey>`;
  - `armor_profile.<itemKey>`.
- Weapon profiles are restricted to item records with `itemClass: "weapon"`.
- Armor profiles are restricted to item records with `itemClass: "armor"`, including shield records.
- Tool-class combat use profiles and clothing armor-handling use profiles do not become equipment-profile authority.
- Shield profiles remain armor identity while using canonical weapon-hand compatible slots.
- Profiles do not own actions, target profiles, activation timing/costs, effect channels, resolution hooks, damage, mitigation, durability, quality, rarity, affixes, enchantments, ammo, stacks, ownership, inventory, equipped state, rewards, UI, storage, runtime, or gameplay behavior.

## Current Anchor

Latest completed:

- `Version 0.5.233 - Weapon And Armor Profile Schemas And Validators`

Immediate next:

- `Version 0.5.234 - Quest Objective And Condition Validation Pass`

## Equipment Profile Result

- Added `packages/schemas/items/weapon-profile.schema.json`.
- Added `packages/schemas/items/armor-profile.schema.json`.
- Added `tools/content-lint/equipment-profiles.mjs`.
- Added `tests/unit/equipment-profiles-validation.test.mjs`.
- Registered both schema files in `tests/unit/schema-files.test.mjs`.
- Did not create `packages/content/base/items/weapon_profiles.json`.
- Did not create `packages/content/base/items/armor_profiles.json`.
- Did not register profile content in normal content lint.
- Normal content lint still reports `content-lint: ok (58 files checked)`.

## Known Test Notes

- `node --test tests/unit/equipment-profiles-validation.test.mjs` passes.
- `npm.cmd run tool:content-lint` passes.
- `node --test tests/unit/schema-files.test.mjs` parses both new profile schemas successfully, then still fails on the unrelated pre-existing Knowledge subject vocabulary assertion around `sacred_site`.

## Next Route

`Version 0.5.234 - Quest Objective And Condition Validation Pass` is the next queued run. It should use the `0.5.222` Quest Objective And Condition Schema Decision, preserve current embedded quest objective/condition posture unless that decision explicitly authorizes helper/schema hardening, and avoid narrative runtime, reward payout, journal/Chronicle mutation, UI, storage, command, event, or gameplay behavior.
