# Current Codex Prompt

## Run Identity

`Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`

Run this as one narrow static-content implementation package. Preserve accepted engine-owned runtime behavior and do not broaden the task into crafting execution, inventory, economy, equipment-profile infrastructure, or cleanup.

## Execution Gate

1. Read `AGENTS.md`, `README.md`, `docs/dev/current-codex-output.md`, `docs/dev/current-gpt-handoff.md`, `docs/dev/codex-sequenced-implementation-plan.md`, `docs/dev/project-roadmap.md`, `docs/dev/project-vision-and-continuity-brief.md`, `docs/future_content_backlog.md`, and `docs/design/static-content-expansion-program.md`.
2. Run branch status, fetch, and fast-forward pull. Record the starting commit and clean/dirty state. Preserve unrelated work.
3. Confirm `Version 0.6.4 - World And Settlement Static Content Expansion` is accepted: 14 active districts, 20 active sites, 8 planned semantic map features, 28 Knowledge snippets, 592/592 focused tests, and `content-lint: ok (67 files checked)`.
4. Confirm this exact `0.6.5` prompt is installed before editing.
5. If newer canon changes a dependency or invalidates an exact row below, stop and report the conflict. Do not silently substitute records or broaden owner scope.

## Purpose

Expand the current planned crafting authority with one substantial, coherent, dependency-closed set of standard recipes. Use existing item/material identities, static values, tools, workplaces, skills, and production chains rather than inventing duplicate catalog records.

This package adds recipe relationships only. It does not make recipes executable, discoverable, available, craftable, buyable, ownable, or visible in UI.

## Mandatory Pre-Authoring Inventory

Before editing, reproduce and report at least:

- items: 1,372;
- item-class `tool` records: 131;
- market item values: 1,617;
- consumable profiles: 9;
- weapon profiles: no live collection, 0;
- armor profiles: no live collection, 0;
- crafting recipes: 12 planned records across 8 recipe families, all `standard` subtype;
- workplaces: 58;
- production chains: 121;
- skills: 121;
- resources: 2 planned;
- commodities: 2 planned;
- normal content lint: 67 checked files.

Confirm there is no separate material registry: material identity is represented by canonical commodity records in `items.items`. Search every proposed recipe id, slug, name, input, output, tool, workplace, skill, and production-chain reference before authoring.

If any count differs, inspect and record the newer evidence. Revise this package only when a current committed authority makes an exact row impossible; otherwise preserve the target.

## Exact Target

Add exactly 18 new records to `packages/content/base/crafting/recipes.json`, increasing recipes from 12 to 30 and represented recipe families from 8 to 10 by adding `cooperage` and `forging` to the existing family set.

Every new record must use `status: "planned"` and `recipeSubtype: "standard"`.

| Recipe id | Family | Existing inputs -> existing outputs | Existing workplace | Existing tools | Existing skill | Existing production chain |
| --- | --- | --- | --- | --- | --- | --- |
| `recipe.flax_bundle_to_linen_thread` | `tailoring` | `flax_bundle` -> `linen_thread` | `workplace.loomhouse` | `spindle` | `skill.crafting.weaving` | `chain.textile.linen` |
| `recipe.wool_fleece_to_yarn` | `tailoring` | `wool_fleece` -> `yarn` | `workplace.loomhouse` | `spindle` | `skill.crafting.weaving` | `chain.textile.components` |
| `recipe.yarn_to_wool_cloth` | `tailoring` | `yarn` -> `wool_cloth` | `workplace.loomhouse` | `weaving_shuttle` | `skill.crafting.weaving` | `chain.textile.wool` |
| `recipe.linen_thread_to_fine_cloth` | `tailoring` | `linen_thread` -> `fine_cloth` | `workplace.loomhouse` | `weaving_shuttle` | `skill.crafting.weaving` | `chain.textile.cloth_grades` |
| `recipe.flour_to_bread_dough` | `baking` | `flour` -> `bread_dough` | `workplace.bakery` | `mixing_spoon` | `skill.crafting.cooking` | `chain.food.bread` |
| `recipe.flour_to_pastry_dough` | `baking` | `flour` -> `pastry_dough` | `workplace.bakery` | `mixing_spoon` | `skill.crafting.cooking` | `chain.food.bakery_specials` |
| `recipe.pastry_dough_and_smoked_meat_to_savory_meat_pie` | `baking` | `pastry_dough` + `smoked_meat` -> `savory_meat_pie` | `workplace.bakehouse` | `oven_peel` | `skill.crafting.cooking` | `chain.food.bakery_specials` |
| `recipe.fish_raw_and_salt_crystal_to_smoked_fish` | `preserving` | `fish_raw` + `salt_crystal` -> `smoked_fish` | `workplace.smokehouse` | `smoking_rack` | `skill.crafting.cooking` | `chain.food.preserved_fish` |
| `recipe.plank_to_barrel_stave` | `cooperage` | `plank` -> `barrel_stave` | `workplace.coopers_shop` | `cooper_adze` | `skill.crafting.carpentry` | `chain.cooperage.components` |
| `recipe.barrel_stave_metal_ring_and_resin_pitch_to_cask` | `cooperage` | `barrel_stave` + `metal_ring` + `resin_pitch` -> `cask` | `workplace.coopers_shop` | `cooper_adze`, `hoop_anvil` | `skill.crafting.carpentry` | `chain.cooperage.cask` |
| `recipe.copper_ore_to_copper_ingot` | `forging` | `copper_ore` -> `copper_ingot` | `workplace.smelter_hall` | `crucible_tongs` | `skill.crafting.smelting` | `chain.metal.copper_ingot` |
| `recipe.copper_ore_and_tin_ore_to_bronze_ingot` | `forging` | `copper_ore` + `tin_ore` -> `bronze_ingot` | `workplace.smelter_hall` | `crucible_tongs` | `skill.crafting.smelting` | `chain.metal.bronze_ingot` |
| `recipe.iron_ingot_to_metal_plate` | `metalsmithing` | `iron_ingot` -> `metal_plate` | `workplace.armorers_forge` | `blacksmith_hammer` | `skill.crafting.blacksmithing` | `chain.metal.components` |
| `recipe.iron_ingot_to_blade_blank` | `metalsmithing` | `iron_ingot` -> `blade_blank` | `workplace.weaponsmith_forge` | `blacksmith_hammer` | `skill.crafting.blacksmithing` | `chain.metal.components` |
| `recipe.blade_blank_tool_handle_and_leather_strap_to_arming_sword` | `assembly` | `blade_blank` + `tool_handle` + `leather_strap` -> `arming_sword` | `workplace.weaponsmith_forge` | `blacksmith_hammer` | `skill.crafting.blacksmithing` | `chain.warfare.weapons` |
| `recipe.cured_leather_to_leather_strap` | `leatherworking` | `cured_leather` -> `leather_strap` | `workplace.tannery` | `tanning_scraper` | `skill.crafting.leatherworking` | `chain.leather.components` |
| `recipe.cured_leather_to_hardened_leather_panel` | `leatherworking` | `cured_leather` -> `hardened_leather_panel` | `workplace.tannery` | `tanning_scraper` | `skill.crafting.leatherworking` | `chain.leather.components` |
| `recipe.metal_ring_and_leather_strap_to_mail_coif` | `assembly` | `metal_ring` + `leather_strap` -> `mail_coif` | `workplace.armorers_forge` | `blacksmith_hammer` | `skill.crafting.armoring` | `chain.warfare.armor` |

Add no item, market-value, consumable-profile, weapon-profile, armor-profile, resource, commodity, workplace, tool, skill, production-chain, Knowledge, schema, validator, or lint-registration record.

## Authoring Rules

- Use the current strict recipe schema and semantic validator without weakening either.
- Derive exact quantities and input/output roles from the matching current production-chain `recipeProfile` and current item evidence. Each recipe must have exactly one `primary` output. If a listed chain does not contain a compatible exact transformation, stop and report the row rather than inventing quantities.
- Keep production-chain references non-inheriting and descriptive. Do not copy macro production behavior or imply execution.
- Use only the exact workplace, tool, skill, and chain references listed above. Confirm every reference resolves and every workplace input/output tag contract accepts the recipe items.
- Confirm every marketable input, output, and tool has current static value closure. `bread_dough` and `pastry_dough` are intentionally nonmarketable intermediates and do not require new values.
- Keep summaries and notes concise and explicit that the records are static planned transformations only.
- Omit prerequisite refs. Do not add Knowledge, guild, trial, unlock, availability, or progression claims.
- Do not alter existing recipes unless a focused validation defect introduced by this batch proves a minimal expectation update is necessary.
- Do not add weapon or armor profile content. Those families still lack live collections and normal-lint registration; profile work requires a separately approved narrow precondition before any content.
- Preserve the paused resource and commodity catalogs exactly. Existing references may inform item identity, but this package does not reopen gathering, extraction, trade, or commodity expansion.

## Allowed Files

Production content changes are limited to:

- `packages/content/base/crafting/recipes.json`

Focused test changes are limited to:

- `tests/unit/crafting-recipes-validation.test.mjs`

Update the focused live-catalog expectations from 12 to 30 recipes and assert the exact 18 new ids and exact family coverage. Do not weaken existing assertions.

Coordination documentation may be updated only where required:

- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/future_content_backlog.md`
- `docs/design/static-content-expansion-program.md` only for factual live-inventory/status updates.

If the current contract cannot express one of these already approved standard records, stop and report the exact blocker. Do not combine schema, validator, live-collection, or lint-registration redesign with this batch.

## Prohibited Scope

Do not add or change:

- item-instance state, provenance, ownership, reservations, storage contents, inventory capacity, durability, quality, spoilage, repair, salvage, affixes, or stack mutation;
- crafting execution, availability, unlocks, orders, timers, queues, success rolls, output creation, input consumption, labor, fuel, workers, or production simulation;
- dynamic prices, vendors, stock, transactions, gathering, extraction, cargo, trade, services, or economy behavior;
- weapon/armor profile collections or registration, consumable behavior, combat behavior, magic, alchemy, enchanting, or equipment effects;
- runtime, UI, commands, events, saves, migrations, dependencies, package metadata, generated output, assets, or gameplay;
- backwards-compatibility aliases, retired-id preservation, unrelated cleanup, renames, formatting, content, or tests.

## Validation

Run the smallest complete checks for this package:

1. Reproduce final counts: 1,372 items, 1,617 market values, 9 consumable profiles, 0/0 live weapon/armor profile collections, 30 planned recipes across 10 families, 58 workplaces, 131 tools, 121 skills, 121 production chains, 2 planned resources, and 2 planned commodities.
2. Run normal content lint: `npm.cmd run tool:content-lint`.
3. Run exactly:

   `node --test tests/unit/crafting-recipes-validation.test.mjs tests/unit/equipment-profiles-validation.test.mjs tests/unit/resource-commodity-authority-validation.test.mjs tests/unit/schema-files.test.mjs`

4. Audit duplicate recipe ids/slugs, no-op transformations, duplicate input/output keys, exactly one primary output, and item/value/tool/workplace/skill/production-chain closure.
5. Confirm no item, value, profile, resource, commodity, workplace, skill, production-chain, schema, validator, lint-index, runtime, UI, save, migration, dependency, generated-output, or asset path changed.
6. Run conflict-marker and trailing-whitespace searches.
7. Run `git diff --check`.
8. Inspect the complete changed-path set and full diff.

Do not run builds, typechecks, package installation, servers, generators, or the full test suite.

## Documentation And Next Prompt

After successful validation:

- overwrite `docs/dev/current-codex-output.md` with the exact run result, counts, files, checks, behavior confirmation, risks, and suggested commit;
- advance the current GPT handoff, sequence, roadmap, continuity brief, backlog, and static-program factual inventory only where the completed package changes current direction;
- overwrite `docs/dev/current-codex-prompt.md` with an exact implementation prompt for `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`.

The installed `0.6.6` prompt must require a fresh monster/fauna/ecology/region/biome/combat-role/tactics/item/value/loot inventory; define an exact region/biome/role/threat matrix and exact batch; use only current executable combat/action vocabulary; close monster, fauna lineage if used, regional ecology, role, tactics, item, market-value, and source-local loot references; prohibit new combat mechanics, generic loot tables, spawn rules, encounter execution, dynamic rolls, population/migration/harvest simulation, runtime, UI, saves, migrations, and gameplay; require normal content lint, focused authority tests, closure/hygiene checks, full changed-path review; and require the exact `Version 0.6.7 - Cross-Content Coherence And Coverage Audit` prompt after successful completion.

## Completion Report

Report:

- starting commit and initial worktree state;
- reproduced baseline and final counts;
- exact 18 new recipe records and family distribution;
- item/value/tool/workplace/skill/chain closure;
- files changed;
- checks run and results;
- confirmation that behavior/runtime/UI/save/economy state did not change;
- risks or deferred anomalies;
- whether the exact `0.6.6` prompt was installed;
- suggested commit message.
