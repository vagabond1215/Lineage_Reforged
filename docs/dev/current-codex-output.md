# Current Codex Output

Source version/run: `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` pre-authoring gate
Date: 2026-07-14
Branch/status assumption: `master`; started clean and aligned with `origin/master` at `e40f94971f082dbb92ce776b1a2c856543b42aeb`; this blocker report is uncommitted.

## Result

Blocked before production editing. The installed `0.6.5` prompt requires every proposed recipe to derive exact transformations and quantities from its named production-chain `recipeProfile` plus current item evidence, and requires the run to stop rather than invent missing data.

All 18 proposed recipe ids are available, and every named item, tool, workplace, skill, and production-chain identity resolves. All named workplace input/output tags accept the proposed items, all tools are tool-class items, and all marketable proposed items and tools have value closure. Those identity checks do not provide the missing transformation authority:

- Fifteen rows name one or more inputs absent from the named chain's complete `recipeProfile` input, intermediate, processing-step, and variant vocabulary.
- `recipe.flour_to_pastry_dough` proposes only `flour`, but `chain.food.bakery_specials` defines the matching step as `flour` plus `honeycomb` to `pastry_dough`.
- `recipe.pastry_dough_and_smoked_meat_to_savory_meat_pie` proposes `pastry_dough` plus `smoked_meat`, but the named chain's output step consumes only `pastry_dough` and emits three goods; it does not define the proposed exact transformation.
- Only `recipe.flour_to_bread_dough` has an exact input/output step shape. Neither that chain profile nor the item records define a transformation quantity ratio, so its quantities also cannot be derived without invention.

The 15 rows whose proposed inputs are absent from their named chain profile are:

- `recipe.flax_bundle_to_linen_thread`
- `recipe.wool_fleece_to_yarn`
- `recipe.yarn_to_wool_cloth`
- `recipe.linen_thread_to_fine_cloth`
- `recipe.fish_raw_and_salt_crystal_to_smoked_fish`
- `recipe.plank_to_barrel_stave`
- `recipe.barrel_stave_metal_ring_and_resin_pitch_to_cask`
- `recipe.copper_ore_to_copper_ingot`
- `recipe.copper_ore_and_tin_ore_to_bronze_ingot`
- `recipe.iron_ingot_to_metal_plate`
- `recipe.iron_ingot_to_blade_blank`
- `recipe.blade_blank_tool_handle_and_leather_strap_to_arming_sword`
- `recipe.cured_leather_to_leather_strap`
- `recipe.cured_leather_to_hardened_leather_panel`
- `recipe.metal_ring_and_leather_strap_to_mail_coif`

No recipe, test, runtime, schema, validator, or other implementation file changed. The exact `0.6.6` prompt was not installed because `0.6.5` did not pass its pre-authoring gate.

## Baseline Counts

- Items: 1,372; item-class tools: 131.
- Market item values: 1,617.
- Consumable profiles: 9; live weapon profiles: 0; live armor profiles: 0.
- Crafting recipes: 12 planned standard records across 8 families.
- Workplaces: 58; production chains: 121; skills: 121.
- Resources: 2 planned; commodities: 2 planned.
- No separate material registry exists; canonical material identities remain item keys in `items.items`.

## Files Changed

- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/historical-version-and-deferred-route-register.md`
- `docs/future_content_backlog.md`

## Checks Run

- Fetched and fast-forward checked the branch; already up to date.
- Read the installed prompt and required coordination/design authorities.
- Reproduced every mandatory baseline inventory count.
- Confirmed the accepted `0.6.4` content remains unchanged after commit `44dfb0a79bdd9941ca45e39d83b125b3ced6d9ca`; later committed paths are documentation only.
- Re-ran the six `0.6.4` focused files: 592/592 passed.
- Ran normal content lint: `content-lint: ok (67 files checked)`.
- Ran the prescribed crafting/equipment/resource/schema focused group against the unchanged baseline: 310/310 passed.
- Audited all 18 proposed ids, items, values, tools, workplaces and their tag contracts, skills, production chains, and exact chain-profile transformations.
- Ran conflict-marker, trailing-whitespace, `git diff --check`, and complete changed-path review for this blocker report.

## Behavior / Runtime Confirmation

Documentation only. No content JSON, tests, runtime, UI, save, migration, schema, validator, lint registration, dependency, generated output, asset, economy, Knowledge, recognition, geography-taxonomy, or gameplay behavior changed.

## Risks / Follow-Up

- Do not partially author the one structurally matching row or guess 1:1 quantities; that would violate the installed prompt's dependency-closure gate.
- `0.6.5` needs a corrected docs-first target whose exact transformations and quantities are supported by current authority, or a separately approved production-chain authority change. Do not silently combine those alternatives with recipe authoring.
- The user-directed `Geographic Knowledge Taxonomy And Location Recognition Contract Plan` remains queued immediately after `0.6.7`; existing `Recognizing ...` snippets remain structural authored lore only.

## Next Recommended Version

Blocked `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` target reconciliation; do not advance to `0.6.6`.

## Suggested Commit Message

`docs(crafting): record 0.6.5 chain authority blocker`
