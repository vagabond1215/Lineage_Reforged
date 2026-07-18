# Current Codex Prompt

## Run Identity

`Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`

Run this as one narrow static-content implementation package. The accepted research integration is complete. Preserve accepted engine-owned behavior and do not broaden into crafting execution, production-chain correction, inventory, economy, equipment-profile work, magic, or cleanup.

Suggested commit:

`content(crafting): add research-informed planned recipes`

## Execution Gate

1. Read `AGENTS.md`, `README.md`, current output/handoff/prompt, roadmap, sequenced plan, continuity brief, backlog, historical/deferred register, `docs/design/static-content-expansion-program.md`, `docs/design/0.6.5-research-prerequisite-and-recipe-authority-reconciliation.md`, `docs/design/cross-domain-production-research-synthesis.md`, `docs/design/recipe-and-production-schema-decision.md`, `docs/design/crafting-authority-boundary-decision.md`, and `docs/design/location-recognition-and-geographic-knowledge-taxonomy.md`.
2. Read the retained Gate 6 artifact and production audit because this run is their sole named consumer:
   - `docs/dev/tmp-crafting-tools-workplaces-production-research-2026-07-14.md`;
   - `docs/dev/tmp-production-chain-workplace-runtime-authority-audit-2026-07-15.md`.
3. Run branch status, fetch, and fast-forward pull. Record the starting commit and clean/dirty state. Preserve unrelated work.
4. Confirm the unversioned integration is accepted, `docs/design/cross-domain-production-research-synthesis.md` exists, the live baseline remains 12 planned standard recipes across 8 families, and the audit decision remains `NO_NARROW_CORRECTION_REQUIRED_BEFORE_REVISED_0_6_5`.
5. Confirm no recipe/test content changed during the failed earlier `0.6.5` attempt or the documentation-only research/integration sequence.
6. Confirm `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` has not been implemented and remains reserved after this run.
7. Confirm the docs-first Geographic Knowledge Taxonomy And Location Recognition Contract Plan remains queued immediately after `0.6.7`; current `Recognizing ...` snippets remain structural lore, not executable recognition criteria.
8. Stop without editing if newer committed authority invalidates an exact row, if any selected canonical reference is missing, or if implementation would consume a quarantined chain/workplace resolver field.

## Purpose

Add the exact research-informed, dependency-closed batch of 16 planned standard recipes defined by the accepted synthesis. Increase the live catalog from 12 to 28 records and from 8 to 10 represented families by adding `cooperage` and `forging`.

This package adds explicit static relationships only. It does not make recipes executable, discoverable, available, craftable, buyable, ownable, or visible in UI.

## Mandatory Pre-Authoring Inventory

Reproduce and report:

- items: 1,372, including 131 `tool` records;
- item-class distribution: 24 accessory, 18 armor, 14 clothing, 1,114 commodity, 26 consumable, 131 tool, 10 vehicle, 35 weapon;
- market item values: 1,617 unique item keys;
- consumable profiles: 9;
- weapon profiles: no live collection, 0;
- armor profiles: no live collection, 0;
- recipes: 12 planned standard records across 8 families;
- workplaces: 58;
- production chains: 121;
- skills: 121;
- resources: 2 planned;
- commodities: 2 planned;
- normal content lint registration: 67 checked files on the accepted baseline.

Confirm there is no separate material registry: canonical material identity remains in `items.items`. Search every proposed recipe id, slug, input, output, tool, workplace, skill, and optional chain reference before authoring. Confirm each item/tool has static value closure and every required tool is item class `tool`.

If a count differs, inspect and record newer evidence. Do not silently substitute identities or broaden scope.

## Exact Target

Add exactly 16 records to `packages/content/base/crafting/recipes.json`. Every record uses `status: "planned"`, `recipeSubtype: "standard"`, the exact positive integers and roles below, no `prerequisiteRefs`, exactly one primary output, and the existing non-inheriting optional chain field.

| Recipe id | Family | Exact inputs | Exact outputs | Workplace | Tools | Skill / minimum rank | Optional chain |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `recipe.flax_bundle_to_linen_thread` | `tailoring` | `flax_bundle` 1 `material` | `linen_thread` 2 `primary` | `workplace.loomhouse` | `spindle` | `skill.crafting.weaving` / 1 | `chain.textile.linen` |
| `recipe.wool_fleece_to_yarn` | `tailoring` | `wool_fleece` 1 `material` | `yarn` 2 `primary` | `workplace.loomhouse` | `spindle` | `skill.crafting.weaving` / 1 | `chain.textile.components` |
| `recipe.yarn_to_wool_cloth` | `tailoring` | `yarn` 2 `material` | `wool_cloth` 1 `primary` | `workplace.loomhouse` | `weaving_shuttle` | `skill.crafting.weaving` / 1 | `chain.textile.wool` |
| `recipe.linen_thread_to_fine_cloth` | `tailoring` | `linen_thread` 2 `material` | `fine_cloth` 1 `primary` | `workplace.loomhouse` | `weaving_shuttle` | `skill.crafting.weaving` / 1 | `chain.textile.cloth_grades` |
| `recipe.flour_to_bread_dough` | `baking` | `flour` 1 `ingredient` | `bread_dough` 1 `primary` | `workplace.bakery` | `mixing_spoon` | `skill.crafting.cooking` / 1 | `chain.food.bread` |
| `recipe.fish_raw_and_salt_crystal_to_smoked_fish` | `preserving` | `fish_raw` 1 `ingredient`; `salt_crystal` 1 `ingredient` | `smoked_fish` 1 `primary` | `workplace.smokehouse` | `smoking_rack` | `skill.crafting.cooking` / 1 | `chain.food.preserved_fish` |
| `recipe.plank_to_barrel_stave` | `cooperage` | `plank` 1 `material` | `barrel_stave` 2 `primary` | `workplace.coopers_shop` | `cooper_adze` | `skill.crafting.carpentry` / 1 | `chain.cooperage.components` |
| `recipe.barrel_stave_metal_ring_and_resin_pitch_to_cask` | `cooperage` | `barrel_stave` 4 `material`; `metal_ring` 2 `material`; `resin_pitch` 1 `material` | `cask` 1 `primary` | `workplace.coopers_shop` | `cooper_adze`, `hoop_anvil` | `skill.crafting.carpentry` / 1 | `chain.cooperage.cask` |
| `recipe.copper_ore_to_copper_ingot` | `forging` | `copper_ore` 2 `material` | `copper_ingot` 1 `primary` | `workplace.smelter_hall` | `crucible_tongs` | `skill.crafting.smelting` / 1 | `chain.metal.copper_ingot` |
| `recipe.copper_ore_and_tin_ore_to_bronze_ingot` | `forging` | `copper_ore` 2 `material`; `tin_ore` 1 `material` | `bronze_ingot` 2 `primary` | `workplace.smelter_hall` | `crucible_tongs` | `skill.crafting.smelting` / 1 | `chain.metal.bronze_ingot` |
| `recipe.iron_ingot_to_metal_plate` | `metalsmithing` | `iron_ingot` 1 `material` | `metal_plate` 1 `primary` | `workplace.armorers_forge` | `blacksmith_hammer` | `skill.crafting.blacksmithing` / 1 | `chain.metal.components` |
| `recipe.iron_ingot_to_blade_blank` | `metalsmithing` | `iron_ingot` 1 `material` | `blade_blank` 1 `primary` | `workplace.weaponsmith_forge` | `blacksmith_hammer` | `skill.crafting.blacksmithing` / 1 | `chain.metal.components` |
| `recipe.blade_blank_tool_handle_and_leather_strap_to_arming_sword` | `assembly` | `blade_blank` 1 `material`; `tool_handle` 1 `material`; `leather_strap` 1 `material` | `arming_sword` 1 `primary` | `workplace.weaponsmith_forge` | `blacksmith_hammer` | `skill.crafting.blacksmithing` / 1 | `chain.warfare.weapons` |
| `recipe.cured_leather_to_leather_strap` | `leatherworking` | `cured_leather` 1 `material` | `leather_strap` 2 `primary` | `workplace.tannery` | `tanning_scraper` | `skill.crafting.leatherworking` / 1 | `chain.leather.components` |
| `recipe.cured_leather_to_hardened_leather_panel` | `leatherworking` | `cured_leather` 1 `material` | `hardened_leather_panel` 1 `primary` | `workplace.tannery` | `tanning_scraper` | `skill.crafting.leatherworking` / 1 | `chain.leather.components` |
| `recipe.metal_ring_and_leather_strap_to_mail_coif` | `assembly` | `metal_ring` 2 `material`; `leather_strap` 1 `material` | `mail_coif` 1 `primary` | `workplace.armorers_forge` | `blacksmith_hammer` | `skill.crafting.armoring` / 1 | `chain.warfare.armor` |

The exact evidence and quantity classification for every row are owned by Section 13 of `docs/design/cross-domain-production-research-synthesis.md`. Every integer is `bounded_design_inference`: an authored game-scale batch unit, not a historical yield, a balance formula, a chain-derived ratio, or a claim about physical throughput.

The prior `recipe.flour_to_pastry_dough` and `recipe.pastry_dough_and_smoked_meat_to_savory_meat_pie` rows are not part of this package. Do not add substitutes. The flour-only pastry row omitted a required bounded ingredient relationship; the meat-pie row remains `authored_input_blocked`.

## Authoring Rules

- Use the current strict recipe schema and semantic validator without weakening either.
- Recipe fields are complete and explicit. `relatedProductionChainId` is descriptive, existence-checked, and non-inheriting.
- Do not call or derive any field from `resolveCraftAtSettlement`, candidate ordering, chain/workplace fallback, variants, stage/carry behavior, last-step outputs, workplace I/O, jobs, tiers, progression, upgrades, tool tags, fuel/power modes, values, prices, rates, or costs.
- Use only the exact ids, quantities, roles, workplaces, tools, skills, ranks, and chain references above.
- Keep summaries and notes concise. Each record must say it is a planned static transformation, its integers are authored bounded game-scale units, the chain link is non-inheriting, and no execution/inventory/economy behavior is implied.
- Do not add `prerequisiteRefs`, Knowledge, guild, trial, unlock, availability, profession, progression, region, or cultural claims.
- Do not edit existing recipes unless a focused defect caused by this batch proves a minimal expectation update is necessary; stop and report before changing existing content semantics.
- Preserve resources and commodities exactly. Do not add weapon/armor profile collections or registrations.
- Preserve `docs/design/location-recognition-and-geographic-knowledge-taxonomy.md` and the post-`0.6.7` route.

## Allowed Files

Production content:

- `packages/content/base/crafting/recipes.json`

Focused test:

- `tests/unit/crafting-recipes-validation.test.mjs`

Update focused expectations from 12 to 28 recipes and assert the exact 16 new ids, exact family coverage, exact row fields, `planned`/`standard` status, and unchanged non-inheritance behavior. Do not weaken existing assertions.

Coordination documents may be updated only as required:

- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/historical-version-and-deferred-route-register.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/future_content_backlog.md`
- `docs/design/static-content-expansion-program.md`
- `docs/design/cross-domain-production-research-synthesis.md` only for a factual correction proven during implementation

The retained Gate 6 and audit artifacts may be deleted only if their Section 14 removal conditions are fully satisfied after accepted implementation; otherwise leave them unchanged and record the remaining concrete consumer/removal condition.

## Prohibited Scope

Do not add or change:

- items, values, tools, workplaces, skills, production chains, resources, commodities, flora, fauna, monsters, ecology, Knowledge, magic, services, buildings, infrastructure, schemas, validators, or lint code;
- crafting availability/execution, input consumption, output creation, work orders, labor, fuel, power, time, queues, quality, spoilage, waste, maintenance, repair, salvage, prices, stock, vendors, trade, or service behavior;
- item-instance state, provenance, ownership, storage, reservations, capacity, condition, durability, temperature, charge, recharge, catalyst/conduit behavior, or enchantment;
- weapon/armor profiles, combat, medicine, gathering, extraction, agriculture, ecology/population, loot execution, runtime, UI, commands, events, saves, migrations, dependencies, generated output, assets, or gameplay;
- location-recognition profiles or behavior, geography taxonomy, borders/claims, Knowledge evidence/progress/completion behavior, or recognition UI; or
- compatibility aliases, retired-id preservation, unrelated cleanup, renames, or formatting churn.

## Validation

1. Reproduce final counts: 1,372 items, 1,617 market values, 9 consumable profiles, 0/0 live weapon/armor profile collections, 28 planned standard recipes across 10 families, 58 workplaces, 131 tools, 121 skills, 121 production chains, 2 planned resources, and 2 planned commodities.
2. Run normal content lint: `npm.cmd run tool:content-lint`.
3. Run exactly:

   `node --test tests/unit/crafting-recipes-validation.test.mjs tests/unit/equipment-profiles-validation.test.mjs tests/unit/resource-commodity-authority-validation.test.mjs tests/unit/schema-files.test.mjs`

4. Audit duplicate recipe ids/slugs, no-op transformations, duplicate same-role input/output keys, positive integers, exactly one primary output, exact target equality, and item/value/tool/workplace/skill/chain closure.
5. Confirm each new `sourceAuthorityNotes` records `bounded_design_inference`, non-inheritance, and static-only scope.
6. Confirm no chain/workplace resolver or quarantined field was consumed.
7. Confirm no prohibited path changed and resources/commodities remain byte-identical.
8. Run conflict-marker and trailing-whitespace searches, `git diff --check`, complete changed-path review, and full diff inspection.

Do not run builds, typechecks, package installation, servers, generators, or the full test suite.

## Documentation And Next Prompt

After successful validation:

- overwrite `docs/dev/current-codex-output.md` with the exact result, counts, 16 ids, closure, checks, behavior confirmation, risks, artifact disposition, and suggested commit;
- advance current handoff, sequence, roadmap, continuity brief, backlog, static program, and route register only where the accepted package changes current direction;
- keep the user-directed Geography/recognition decision immediately after `0.6.7`;
- decide the retained Gate 6/audit artifact cleanup conditions explicitly; and
- overwrite `docs/dev/current-codex-prompt.md` with the exact research-informed `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` prompt.

The installed `0.6.6` prompt must read this synthesis and the retained Gate 1-5 and Gate 7 artifacts, reproduce fresh monster/fauna/ecology/region/biome/combat-role/tactics/action-package/item/value/loot inventories, define an exact region/biome/role/threat matrix and batch, use current executable combat/action vocabulary only, close every monster/fauna-lineage-if-used/ecology/role/tactics/action/item/value/source-local-loot reference, and prohibit generic loot tables, loot execution, spawn rules, encounter execution, population/migration/harvest simulation, new combat mechanics, magic execution, runtime, UI, saves, migrations, and gameplay.

It must require normal content lint, focused authority tests, closure/hygiene/full-diff review, explicit temporary-artifact disposition, and installation of the exact `Version 0.6.7 - Cross-Content Coherence And Coverage Audit` prompt after success. Both prompts must preserve the queued Geography/recognition plan and treat current `Recognizing ...` snippets as structural lore only.

## Completion Report

Report starting commit/state; reproduced baseline/final counts; exact 16 ids and family distribution; all reference/value closure; quantity-confidence posture; files changed; checks; resolver-quarantine confirmation; unchanged behavior/runtime/UI/save/economy/magic/Knowledge-recognition state; artifact disposition; installed `0.6.6` prompt; risks; and suggested commit.
