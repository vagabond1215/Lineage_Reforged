# Current GPT Handoff

Source version/run: Version 0.5.231 - Crafting Recipe Schema And Validator
Date: 2026-06-25
Status: crafting recipe schema and isolated validator completed; no content, runtime, UI, storage, or gameplay change

## Authority Rules

- Future `crafting.recipes` now has a strict schema at `packages/schemas/crafting/recipe.schema.json`.
- The recipe validator helper at `tools/content-lint/crafting-recipes.mjs` is pure and in-memory. It is not registered in normal content lint because no live recipe content exists.
- Recipes are descriptive static item transformations using canonical `itemKey` inputs/outputs, `requiredToolItemKeys`, `requiredWorkplaceIds`, skill requirements, optional prerequisite refs, and optional non-inheriting `relatedProductionChainId`.
- Existing `civilization.production_chains` and embedded `recipeProfile` data remain macro-production authority. No extraction, inheritance, migration, aliasing, or production-chain edit occurred.
- Workplaces remain the only first-pass fixed station anchors. `extract.*`, `building.*`, `infrastructure.*`, and `settlement.*` anchors are rejected by recipe validation.
- Tools remain item-owned and must resolve to `items.items` records with `itemClass: "tool"`.
- Alchemy and enchanting are reserved recipe subtypes under the same static transformation contract only; there is no subtype execution behavior.
- Recipe content, normal content-lint registration, recipe learning/unlocks, crafting execution, inventory mutation, quality/affix rolls, repair/salvage, UI, storage, commands, events, rewards, economy, Knowledge, magic behavior, and gameplay remain deferred.

## Current Anchor

Latest completed:

- `Version 0.5.231 - Crafting Recipe Schema And Validator`

Immediate next:

- `Version 0.5.232 - Monster Schema And Validator Hardening`

## Crafting Recipe Result

- Added `packages/schemas/crafting/recipe.schema.json`.
- Added `tools/content-lint/crafting-recipes.mjs`.
- Added `tests/unit/crafting-recipes-validation.test.mjs`.
- Registered the schema in `tests/unit/schema-files.test.mjs`.
- Did not create `packages/content/base/crafting/recipes.json`.
- Did not import or register recipe validation in `tools/content-lint/index.mjs`.
- Normal content lint still reports `content-lint: ok (58 files checked)`.

## Known Test Notes

- `node --test tests/unit/crafting-recipes-validation.test.mjs` passes.
- `npm.cmd run tool:content-lint` passes.
- `node --test tests/unit/schema-files.test.mjs` parses the new recipe schema, then fails on the unrelated existing Knowledge subject vocabulary assertion that expects `sacred_site` to be absent.

## Next Route

`Version 0.5.232 - Monster Schema And Validator Hardening` is the next queued run. It must use the `0.5.220` Monster Record Schema Decision, preserve encounter/spawn/role/tactics owners, and stay within approved schema/validator/focused-test scope.
