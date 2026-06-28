# Current GPT Handoff

Source version/run: Version 0.5.245 - First Crafting Recipe Content Seed
Date: 2026-06-28
Status: first live `crafting.recipes` content seed completed; normal content-lint registration added; no production-chain migration, runtime, UI, storage, commands, events, rewards, economy behavior, inventory mutation, item-instance creation, or gameplay change

## Authority Rules

- `crafting.recipes` is now live as player-facing static recipe authority for descriptive item-key transformations only.
- Live content path is `packages/content/base/crafting/recipes.json`.
- The first seed has 12 records; all are `status: "planned"` and `recipeSubtype: "standard"`.
- Schema exists at `packages/schemas/crafting/recipe.schema.json`; pure validator helper exists at `tools/content-lint/crafting-recipes.mjs`; focused tests exist at `tests/unit/crafting-recipes-validation.test.mjs`; schema-file parse registration exists.
- `tools/content-lint/index.mjs` now registers recipe content through the existing pure validator and normal content lint reports `content-lint: ok (59 files checked)`.
- Optional `relatedProductionChainId` is a validated non-inheriting cross-reference only; recipes must not inherit from production chains.
- `civilization.production_chains` remains the live macro-production authority with embedded `recipeProfile` data.
- Recipes must not define execution, inventory mutation, item-instance creation, runtime state, UI, storage, commands, events, rewards, economy behavior, or gameplay.

## Current Anchor

Latest completed:

- `Version 0.5.245 - First Crafting Recipe Content Seed`

Immediate next:

- `Version 0.5.246 - First People And NPC Content Seed Plan`

## Crafting Recipe Seed Result

- Added `packages/content/base/crafting/recipes.json` with 12 planned standard recipes.
- Seeded conservative transformations for milling, baking, preserving, woodworking, leatherworking, tailoring, metalsmithing, and assembly.
- Registered recipe content in normal content lint by narrowly importing `validateCraftingRecipes` and adding `validateCraftingRecipesAgainstDependencies()`.
- Updated focused recipe tests to validate the live first seed and expect normal content-lint registration.
- No schema, recipe validator, production-chain, item, workplace, skill, guild, Knowledge, trial, market-value, loader, runtime, UI, storage, command, event, reward, economy, or gameplay file changed.

## Known Test Notes

- `node --test tests\unit\crafting-recipes-validation.test.mjs` passes with 42 tests.
- `npm.cmd run tool:content-lint` passes and reports `content-lint: ok (59 files checked)`.
- Direct recipe content audit passes for item keys, tool-class requirements, workplaces, skills, production-chain links, duplicate ids/slugs, primary output counts, standard subtype, planned status, and no-op/self-transform rejection.
- `node --test tests\unit\schema-files.test.mjs` still parses `packages/schemas/crafting/recipe.schema.json`, then fails on the unrelated pre-existing Knowledge subject vocabulary assertion around `sacred_site`.
- `tests/unit/region-first-world-data.test.mjs` still has the unrelated direct-run BOM parsing issue noted by prior handoffs.

## Next Route

`Version 0.5.246 - First People And NPC Content Seed Plan` is the next queued docs-first run. It should use the current people/NPC schemas and validators, remain seed planning only, and avoid live people/NPC content unless a later implementation prompt explicitly authorizes it.
