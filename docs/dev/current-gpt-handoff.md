# Current GPT Handoff

Source version/run: Version 0.5.232 - Monster Schema And Validator Hardening
Date: 2026-06-25
Status: monster validator hardening completed; no schema, content, runtime, UI, storage, AI, loot execution, or gameplay change

## Authority Rules

- Existing `world.monsters` remains the canonical static monster identity, archetype, descriptor, and authored combat-baseline authority.
- No `combat.enemy_archetypes`, replacement monster collection, field move, alias, migration, loot table, explicit monster `tacticsPresetId`, AI behavior, runtime combat behavior, reward payout, inventory mutation, or gameplay behavior was introduced.
- Normal content lint now includes a pure monster authority helper for additional hardening:
  - monster ids must equal `monster.<slug>`;
  - `habitatTags` and `behaviorTags` must not duplicate values;
  - `drops` and `loot` must not duplicate item keys within their own arrays;
  - drop/loot item keys must resolve to `items.items` and remain covered by market item values;
  - optional `baseFaunaId` resolves to `world.fauna`;
  - optional `baseMonsterId` resolves to another monster and rejects self-references and cycles;
  - optional lineage fields require `variantType`, and `variantType` requires a base fauna or monster authority;
  - every used monster `defaultRole` must resolve to `game.combat_roles` and have the current derived `preset.enemy.<role>` tactics preset.
- Monster `drops` and `loot` remain source-local descriptive envelopes only. They do not roll loot or create items.
- Monster combat baselines remain static descriptors. Current HP/MP/stamina, statuses, AI state, targeting, cooldowns, rewards, inventory, encounter state, spawn state, UI, storage, commands, events, and gameplay remain runtime/future-owner concerns.

## Current Anchor

Latest completed:

- `Version 0.5.232 - Monster Schema And Validator Hardening`

Immediate next:

- `Version 0.5.233 - Weapon And Armor Profile Schemas And Validators`

## Monster Hardening Result

- Added `tools/content-lint/monsters.mjs`.
- Wired `validateMonsterAuthority(...)` into `tools/content-lint/index.mjs`.
- Added `tests/unit/monster-validation-hardening.test.mjs`.
- Did not edit monster schema or monster content.
- Normal content lint still reports `content-lint: ok (58 files checked)`.

## Known Test Notes

- `node --test tests/unit/monster-validation-hardening.test.mjs` passes.
- `npm.cmd run tool:content-lint` passes.
- The broader `schema-files.test.mjs` suite still has the unrelated pre-existing Knowledge subject vocabulary assertion noted in prior handoffs.

## Next Route

`Version 0.5.233 - Weapon And Armor Profile Schemas And Validators` is the next queued run. It must use the `0.5.221` Weapon And Armor Profile Schema Decision, preserve current item identity/use-profile and item-instance owners, and stay within approved schema/validator/focused-test scope.
