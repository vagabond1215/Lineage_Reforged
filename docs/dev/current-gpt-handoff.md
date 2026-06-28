# Current GPT Handoff

Source version/run: Version 0.5.244 - First Crafting Recipe Content Seed Plan
Date: 2026-06-28
Status: documentation-only first crafting recipe content seed plan completed; no live recipe content, normal content-lint registration, production-chain migration, runtime, UI, storage, commands, events, rewards, economy behavior, inventory mutation, item-instance creation, or gameplay change

## Authority Rules

- `crafting.recipes` remains the future player-facing static recipe authority for descriptive item-key transformations only.
- Future content path remains `packages/content/base/crafting/recipes.json`; no live file exists yet.
- Schema exists at `packages/schemas/crafting/recipe.schema.json`; pure validator helper exists at `tools/content-lint/crafting-recipes.mjs`; focused tests exist at `tests/unit/crafting-recipes-validation.test.mjs`; schema-file parse registration exists.
- `tools/content-lint/index.mjs` still has no normal recipe registration.
- First future seed should be small, conservative, deterministic, `recipeSubtype: "standard"` only, and likely 8-20 records after a fresh reference audit.
- First seed candidates should start from canonical item availability, not production-chain convenience.
- Optional `relatedProductionChainId` is a validated non-inheriting cross-reference only; recipes must not inherit from production chains.
- `civilization.production_chains` remains the live macro-production authority with embedded `recipeProfile` data.
- Recipes must not define execution, inventory mutation, item-instance creation, runtime state, UI, storage, commands, events, rewards, economy behavior, or gameplay.

## Current Anchor

Latest completed:

- `Version 0.5.244 - First Crafting Recipe Content Seed Plan`

Immediate next:

- `Version 0.5.245 - First Crafting Recipe Content Seed`

## Crafting Recipe Seed Plan Result

- Added `docs/design/first-crafting-recipe-content-seed-plan.md`.
- Selected conservative first seed lanes: `milling`, `baking`, `cooking`, `preserving`, `woodworking`, `leatherworking`, `tailoring`, `forging`, `metalsmithing`, and `assembly`.
- Verified candidate planning references from current content, including `grain_bundle`, `flour`, `bread_loaf`, `milk_raw`, `fresh_cheese`, `butchered_meat`, `salt_crystal`, `smoked_meat`, `log`, `plank`, `hide_raw`, `cured_leather`, `fiber`, `cloth`, `iron_ore`, `iron_ingot`, `metal_rod`, `tool_handle`, and `hammer`.
- Confirmed `docs/dev/tmp-crafting-production-systems-research-2026-06-20.md` remains absent after prior promotion and deletion.
- No `packages/content/base/crafting/recipes.json` file was created.
- No normal content-lint registration was added.
- No schema, validator, test, production-chain, item, workplace, skill, guild, Knowledge, trial, market-value, loader, runtime, UI, storage, command, event, reward, economy, or gameplay file changed.

## Known Test Notes

- Documentation-only checks passed for `0.5.244`: `git diff --check`, changed-file conflict marker scan, changed-file trailing whitespace scan, documentation scope audit, recipe seed-plan authority audit, recipe boundary audit, and version-tracking audit.
- Focused recipe tests were inspected but not rerun because this pass intentionally did not change schema, validator, tests, or live content.
- `tests/unit/schema-files.test.mjs` still has the unrelated pre-existing Knowledge subject vocabulary assertion around `sacred_site`.
- `tests/unit/region-first-world-data.test.mjs` still has the unrelated direct-run BOM parsing issue noted by prior handoffs.

## Next Route

`Version 0.5.245 - First Crafting Recipe Content Seed` is conditional. It should proceed only if live recipe content is explicitly authorized, should keep the seed small and planned-status by default, and must not change runtime, inventory, UI, storage, commands, events, rewards, economy behavior, or gameplay.
