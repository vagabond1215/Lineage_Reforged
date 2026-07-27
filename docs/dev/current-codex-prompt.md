# Current Codex Prompt

## Run Identity

`Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion`

Run this as one narrow static-content implementation package. Preserve the accepted `0.6.5` recipe package and all engine-owned behavior. Do not broaden into encounter execution, spawn logic, dynamic loot, population simulation, harvesting, combat mechanics, magic, or cleanup.

Suggested commit:

`content(world): expand regional monster ecology`

## Execution Gate

1. Read `AGENTS.md`, `README.md`, current output/handoff/prompt, roadmap, sequenced plan, continuity brief, backlog, route register, `docs/design/static-content-expansion-program.md`, `docs/design/cross-domain-production-research-synthesis.md`, `docs/design/monster-record-schema-decision.md`, and the retained Gate 1-5 and Gate 7 artifacts named in synthesis Section 14.
2. Run branch status, fetch, and fast-forward pull. Record the starting commit and clean/dirty state; preserve unrelated work.
3. Confirm accepted `0.6.5` remains exactly 28 planned standard recipes across 10 families and the Gate 6/production-audit artifacts were removed only after their conditions passed.
4. Confirm the live baseline remains 24 monsters, 132 fauna, 9 regional ecology profiles, 41 regions, 36 biomes, 9 combat roles, 9 tactics presets, and the eight engine action-package mappings listed below.
5. Confirm `Version 0.6.7 - Cross-Content Coherence And Coverage Audit` has not been implemented.
6. Confirm the docs-first Geographic Knowledge Taxonomy And Location Recognition Contract Plan remains immediately after `0.6.7`; current `Recognizing ...` snippets remain structural lore only.
7. Stop without editing if any exact fauna, ecology, region, biome, role, enemy tactics preset, action package, item, market value, or combat-template reference below is absent or materially changed.

## Purpose

Add exactly nine encounter-scale beast records backed by nine existing fauna identities and add each base fauna to exactly one existing macroregional ecology profile. Increase monsters from 24 to 33, explicit monster-to-fauna lineages from 0 to 9, and source-local drop rows from 49 to 77 while preserving 20 loot rows.

These are static identity, ecology, combat-descriptor, and source-local drop relationships. They do not make monsters spawn, fight, migrate, reproduce, get harvested, create items, roll loot, or enter encounters.

## Mandatory Fresh Inventory

Reproduce and report:

- monsters: 24 = 9 beast, 6 humanoid, 3 ooze, 2 elemental, 3 undead, 1 giantkin;
- threat distribution: 5 low, 12 moderate, 6 high, 1 severe;
- roles: 5 debuffer controller, 4 disruptor, 4 frontliner, 6 opportunist, 4 ranged pressure, 1 tank protector;
- source-local descriptors: 49 drops / 37 unique keys, 20 loot rows / 6 unique keys, 12 empty `loot` arrays;
- explicit fauna/monster lineage fields: 0;
- fauna: 132 across 7 types;
- regional ecology: 9, one per macro region;
- regions: 41; biomes: 36; habitats: 93;
- combat roles: 9; tactics presets: 9, including the six current enemy presets used by monsters;
- action packages in live monster content: `melee_skirmisher`, `melee_brute`, `ranged_harrier`, `disruptor_bash`, `elemental_burst`, and `enfeebling_burst`;
- engine action-package library: the six preceding ids plus `support_ward` and `healing_cast`;
- items: 1,372; market item values: 1,617 unique keys; and
- normal content lint registration: 67 checked files before this package.

Search every proposed id, slug, name, base fauna, ecology profile, region, biome, habitat tag, role, enemy preset, action package, drop item, market value, and combat-template id before authoring. Confirm each selected fauna output and every new drop item resolves to both item and market-value authority.

## Exact Region / Biome / Role / Threat Matrix

Add exactly these records and ecology links. `species_only` means the monster record is the encounter-scale authority for the same canonical fauna species; it does not create a biological mutation, subspecies, or spawn rule.

| Monster id | Base fauna / ecology addition | Region / dominant biome audit anchor | Threat / role | Exact action packages | Exact combat/scaling template | Exact habitat tags |
| --- | --- | --- | --- | --- | --- | --- |
| `monster.kaelvar_cliff_viper` | `fauna.cliff_viper` -> `regional_ecology.kaelvar` | `region.kaelvar` / `biome.shrublands.dry_scrub` | high / `disruptor` | `melee_skirmisher`, `enfeebling_burst` | `monster.cave_spider_matron` | `dry_scrub`, `sea_cliff`, `scree_run`, `ravine` |
| `monster.valtherion_brown_bear` | `fauna.bear` -> `regional_ecology.valtherion` | `region.valtherion` / `biome.temperate.mixed_forest` | high / `frontliner` | `melee_brute` | `monster.ember_boar` | `mixed_forest`, `rapids`, `estuary`, `forest_edge` |
| `monster.serathyl_ravine_wolverine` | `fauna.wolverine` -> `regional_ecology.serathyl` | `region.serathyl` / `biome.temperate.temperate_rainforest` | high / `opportunist` | `melee_skirmisher` | `monster.shadow_wolf` | `temperate_rainforest`, `talus_field`, `ravine`, `cliff` |
| `monster.draemor_marsh_alligator` | `fauna.american_alligator` -> `regional_ecology.draemor` | `region.draemor` / `biome.wetlands.marsh` | high / `tank_protector` | `melee_brute` | `monster.bog_troll` | `marsh`, `marsh_pool`, `oxbow_lake`, `estuary` |
| `monster.talmyran_savanna_scorpion` | `fauna.scorpion` -> `regional_ecology.talmyra` | `region.talmyra` / `biome.grasslands.savanna` | moderate / `disruptor` | `melee_skirmisher`, `enfeebling_burst` | `monster.dune_scorpion` | `savanna`, `talus_field`, `scree_run`, `ravine` |
| `monster.myridian_reef_lobster` | `fauna.reef_lobster` -> `regional_ecology.myridian_chain` | `region.myridian_chain` / `biome.marine.marine` | moderate / `tank_protector` | `melee_brute` | `monster.dire_boar` | `marine`, `coral_reef_fringe`, `tide_pools`, `kelp_forest_coastal` |
| `monster.lantern_glowmire_caecilian` | `fauna.glowmire_caecilian` -> `regional_ecology.lantern_isles` | `region.lantern_isles` / `biome.wetlands.mangrove_forest` | moderate / `debuffer_controller` | `melee_brute` | `monster.mire_slime` | `mangrove_forest`, `marsh_pool`, `cave_flooded`, `thicket` |
| `monster.serpents_wake_tide_lizard` | `fauna.tide_lizard` -> `regional_ecology.serpents_wake` | `region.serpents_wake` / `biome.wetlands.mangrove_forest` | low / `opportunist` | `melee_skirmisher` | `monster.granary_rat` | `mangrove_forest`, `tidal_flat`, `shoreline`, `tide_pools` |
| `monster.dawnreach_bull_walrus` | `fauna.walrus` -> `regional_ecology.dawnreach_isles` | `region.dawnreach_isles` / `biome.polar.tundra` | high / `tank_protector` | `melee_brute` | `monster.bog_troll` | `tundra`, `shoreline`, `tidal_flat`, `kelp_forest_coastal` |

Use exact slugs equal to each id suffix and grounded display names derived directly from those slugs. Use `monsterClass: "beast"`, `baseFaunaId` exactly as listed, `variantType: "species_only"`, and omit `baseMonsterId`, attunement, elements, and origin profile.

For each record, copy `combatProfile` and `difficultyScalingHooks` value-for-value from its named live template. Do not derive new combat numbers or change the template record.

Behavior tags are exact and ordered:

- cliff viper: `ambush_predator`, `territorial`, `venomous`;
- brown bear: `territorial`, `foraging`, `defensive`;
- ravine wolverine: `solitary`, `territorial`, `relentless`;
- marsh alligator: `ambush_predator`, `territorial`, `aquatic`;
- savanna scorpion: `ambush_predator`, `territorial`, `venomous`;
- reef lobster: `territorial`, `armored`, `aquatic`;
- glowmire caecilian: `ambush_predator`, `subterranean`, `aquatic`;
- tide lizard: `opportunistic`, `territorial`, `aquatic`; and
- bull walrus: `territorial`, `herd_defender`, `aquatic`.

Summaries must identify the named macroregion and terrain niche as static canon without claiming frequency, placement, spawn rules, population, attacks, status effects, or rewards.

## Exact Source-Local Drop Rule

For each new monster, author one `drops` row for every ordered item key in its base fauna's `template.output.slaughterOutput.products.ingredients`, followed by every ordered key in `byproducts`. Do not omit, add, alias, rename, or reorder keys.

Apply this exact per-record envelope by zero-based drop position:

| Position | quantityMin | quantityMax | chance |
| ---: | ---: | ---: | ---: |
| 0 | 1 | 2 | 0.82 |
| 1 | 1 | 1 | 0.68 |
| 2 | 1 | 1 | 0.54 |
| 3 | 1 | 1 | 0.40 |
| 4 | 1 | 1 | 0.26 |

All selected fauna have two to four output keys, producing exactly 28 new drop rows. Set `loot: []` on all nine new monsters. These are authored static probability envelopes local to each monster record; they are not anatomy, guaranteed harvest yields, reusable loot tables, loot execution, generated items, inventory mutation, or balance formulas.

## Exact Ecology Edits

Append exactly the listed base fauna id to the corresponding `nativeFaunaIds` array, preserving all existing entries and all other regional ecology fields. Do not add monster ids to ecology records and do not edit regions, biomes, habitats, flora, fauna, or items.

The matrix is the region/biome authoring audit. The monster schema does not own direct region or biome fields; do not invent them. `habitatTags` remain descriptive, while region, biome, and native-fauna existence are checked against their owning collections in the focused test.

## Allowed Files

Production content:

- `packages/content/base/world/monsters.json`
- `packages/content/base/world/regional_ecology_profiles.json`

Focused test:

- `tests/unit/monster-validation-hardening.test.mjs`

Update the focused test to assert the exact nine ids, final counts/distributions, exact lineage/ecology/region/biome/role/preset/action/drop/value/template closure, exact source-local drop arrays, and absence of unowned or executable fields. Do not weaken existing assertions.

Coordination documents may be updated only as required to report success, advance to `0.6.7`, and preserve the post-`0.6.7` routes.

## Prohibited Scope

Do not add or change fauna identities or biology scalars, items, values, generic loot tables, roles, tactics presets, action-package mappings, combat actions, status/condition/injury vocabulary, schemas, validators, lint code, recipes, resources, commodities, flora, habitats, biomes, regions, encounters, spawns, population, migration, reproduction, depletion, regrowth, harvesting, hunting, fishing, butchery, item creation, loot rolls, ownership, payout, inventory, economy, crafting, magic, Knowledge, recognition, runtime, UI, commands, events, saves, migrations, dependencies, generated output, assets, or gameplay.

Do not treat `enfeebling_burst`, venomous prose, combat templates, drops, or habitat tags as permission to add effects, attacks, AI, placement, or execution. Do not infer fauna lineage beyond the exact nine rows.

## Validation

1. Reproduce final counts: 33 monsters; 18 beast / 6 humanoid / 3 ooze / 2 elemental / 3 undead / 1 giantkin; 6 low / 15 moderate / 11 high / 1 severe; 77 drops; 20 loot rows; 21 empty `loot` arrays; 9 explicit fauna lineages; 132 fauna; 9 regional ecology profiles; all other inventories unchanged.
2. Run `npm.cmd run tool:content-lint`.
3. Run exactly:

   `node --test tests/unit/monster-validation-hardening.test.mjs tests/unit/region-first-world-data.test.mjs tests/unit/schema-files.test.mjs tests/unit/slug-content.test.mjs`

4. Audit duplicate monster ids/slugs/names, duplicate tags/drop keys, lineage cycles, exact target equality, exact ecology additions, source-output equality, chance/quantity envelopes, and item/value/fauna/ecology/region/biome/role/enemy-preset/action/template closure.
5. Confirm no generic loot table or executable/runtime field was added and no existing monster/ecology semantics changed.
6. Confirm every prohibited path is unchanged.
7. Run conflict-marker and trailing-whitespace searches, `git diff --check`, complete changed-path review, and full diff inspection.

Do not run builds, typechecks, package installation, servers, generators, or the full test suite.

## Temporary Artifact Disposition

Do not delete Gate 1-5 or Gate 7 artifacts during `0.6.6`; synthesis Section 14 assigns them solely to `0.6.7`. Record that disposition explicitly. The Gate 6 and production-audit artifacts should already be absent after accepted `0.6.5`; do not restore them.

## Documentation And Next Prompt

After successful validation:

- overwrite `docs/dev/current-codex-output.md` with exact results, counts, nine ids, closure, checks, behavior confirmation, risks, and artifact disposition;
- advance handoff, sequence, roadmap, continuity brief, backlog, static program, and route register only where completion changes current direction;
- preserve the docs-first Geography/recognition plan immediately after `0.6.7` and the later activity-resolution reuse audit after that plan; and
- overwrite `docs/dev/current-codex-prompt.md` with the exact `Version 0.6.7 - Cross-Content Coherence And Coverage Audit` prompt.

The installed `0.6.7` prompt must be a read-first, repair-only-if-proven audit of `0.6.4`-`0.6.6` plus the accepted research synthesis. It must check schemas/validators, all static references and statuses, duplicates, orphans, contradictions, generic authorities, recipe/value/tool/workplace/skill/chain closure, monster/fauna/ecology/role/tactics/action/item/value/drop closure, Knowledge and geography closure, lifecycle honesty, research drift, temporary-artifact removal conditions, route preservation, hygiene, and full diff. It must not broaden static content or runtime. After success it must install the docs-first Geographic Knowledge Taxonomy And Location Recognition Contract Plan prompt, treating current `Recognizing ...` snippets as structural lore only and keeping the later activity-resolution reuse audit behind that plan.

## Completion Report

Report starting commit/state; baseline/final inventories; exact matrix and nine ids; ecology, lineage, role, tactics, action, item, value, and source-local drop closure; files changed; checks; unchanged runtime/UI/save/economy/crafting/magic/Knowledge-recognition state; artifact disposition; installed `0.6.7` prompt; risks; and suggested commit.
