# First Crafting Recipe Content Seed Plan

Source version/run: Version 0.5.244 - First Crafting Recipe Content Seed Plan
Date: 2026-06-28
Status: approved documentation-only seed plan; no live recipe content

## 1. Decision Summary

`Version 0.5.244` is documentation-only. It approves a future first recipe-content seed pass for `crafting.recipes`, but it does not create recipe content now.

The first future seed should be small, conservative, deterministic, and limited to `recipeSubtype: "standard"` unless a later prompt explicitly justifies a narrower exception. The recommended first batch is roughly 8-20 records after a fresh item, workplace, tool, skill, and optional production-chain audit proves every reference.

This pass does not approve live recipe content, normal content-lint registration, production-chain migration, recipe execution, inventory mutation, item-instance creation, runtime behavior, UI, storage, commands, events, rewards, economy behavior, or gameplay implementation.

## 2. Current Schema And Validator Reality

Current landed contract:

- `crafting.recipes` is the future collection.
- Future content path remains `packages/content/base/crafting/recipes.json`.
- Schema exists at `packages/schemas/crafting/recipe.schema.json`.
- Pure validator helper exists at `tools/content-lint/crafting-recipes.mjs`.
- Focused recipe tests exist at `tests/unit/crafting-recipes-validation.test.mjs`.
- Schema-file parse registration exists in `tests/unit/schema-files.test.mjs`.
- No live `packages/content/base/crafting/recipes.json` exists.
- No normal content-lint registration exists in `tools/content-lint/index.mjs`.
- Recipes remain future-contract validation only.

The current schema requires a strict object wrapper with `records`. Record ids use `recipe.<slug>` and must match a lower snake case `slug`. Status values are `planned`, `active`, and `retired`. Input roles are `ingredient`, `material`, `reagent`, `catalyst`, and `conduit`; output roles are `primary` and `byproduct`. Subtypes are `standard`, `alchemy`, and `enchanting`. `sourceAuthorityNotes` and `notes` are required non-empty note lists. Item references use canonical `itemKey` values, not `item.<key>` ids. Quantities are positive integers.

The validator currently proves strict wrappers, schema-supported structure, duplicate id/slug rejection, exact id/slug coherence, item-key resolution, exactly one primary output, duplicate same-role item rejection, direct self-transform rejection, workplace id resolution, tool-class item enforcement for required tools, skill resolution and duplicate skill rejection, optional `relatedProductionChainId` resolution, and optional guild/Knowledge/trial prerequisite reference resolution when authority records are provided.

## 3. Current Content Audit Summary

This pass inspected the current recipe schema, validator helper, focused tests, schema registration, normal content-lint index posture, item catalog, workplaces, production chains, crafting skills, guilds, Knowledge records, trial records, market values, and relevant runtime/economy references.

Current audited counts:

- `items.items`: 1,372 records, including 131 tool-class item records.
- Item-owned magic metadata: 3 catalyst-profile items and 7 conduit-profile items.
- `civilization.workplaces`: 58 records.
- `civilization.production_chains`: 121 records with embedded `recipeProfile` macro-production data.
- `player.skills`: 121 records, including 20 `skill.crafting.*` records.
- `civilization.guilds`: 18 records.
- Knowledge content: 4 domain records, 11 snippet records, and 4 trial records.
- `civilization.market_item_values`: 1,617 records.

The future recipe path is absent, and the retired temporary artifact `docs/dev/tmp-crafting-production-systems-research-2026-06-20.md` is also absent. Its useful guidance was already promoted into permanent crafting authority and recipe/production decision docs.

## 4. First Seed Scope

The first actual recipe-content seed should include only:

- `recipeSubtype: "standard"`;
- deterministic fixed item-key transformations;
- simple one-input or two-input recipes;
- exactly one primary output;
- an optional byproduct only when it is already obvious and canonical;
- existing canonical item keys only;
- existing workplace ids only when a fixed station need is explicit;
- existing tool item keys only when the tool need is clear;
- existing skill ids only when the skill authority is current and validator-supported;
- optional `relatedProductionChainId` only after an explicit audit proves a macro analogue and confirms no inheritance.

Avoid in the first seed:

- alchemy;
- enchanting;
- repair;
- salvage;
- quality, rarity, affix, masterwork, or item-improvement behavior;
- flexible substitutions;
- generated variants;
- no-op transformations;
- cyclic transformations;
- place-specific recipes;
- guild, Knowledge, or trial prerequisites unless validator support and active authority are proven and the record clearly needs them;
- recipes whose only support is market value, economy projection, prose, or production-chain `recipeProfile`.

## 5. Candidate Recipe Family Lanes

The conservative candidate lanes for later first seed planning are:

- `milling`;
- `baking`;
- `cooking`;
- `preserving`;
- `woodworking`;
- `leatherworking`;
- `tailoring`;
- `forging`;
- `metalsmithing`;
- `assembly`.

The future seed does not need all lanes. It should prefer a small representative set with the clearest item identities and fewest prerequisites.

## 6. Candidate Transformation Examples

These are planning candidates only. They are not live records and do not authorize content creation by themselves. Exact item keys and ids below were observed in current content during this pass, but every candidate still needs fresh validation in the future seed implementation.

| Lane | Planning candidate | Verified current references to audit again |
| --- | --- | --- |
| `milling` | `grain_bundle` to `flour` | Items exist; `workplace.millhouse`, `skill.crafting.milling`, and optional `chain.food.flour` exist. |
| `baking` | `flour` or `bread_dough` to `bread_loaf` | Items exist; `workplace.bakehouse`, `workplace.bakery`, `skill.crafting.cooking`, and optional `chain.food.bread` exist. |
| `dairy_processing` as deferred lane outside the preferred list | `milk_raw` to `fresh_cheese` | Items exist; optional `chain.food.fresh_cheese` exists. Keep out of the first seed unless the seed explicitly expands beyond the preferred lanes. |
| `preserving` | `butchered_meat` plus `salt_crystal` to `smoked_meat` | Items exist; `workplace.smokehouse`, `workplace.preservers_hearth`, and optional `chain.food.preserved_meat` exist. |
| `preserving` | fruit or berries plus jar/sweetener to preserve jar | `fruit`, `berry_preserve_jar`, `clay_vessel`, `cane_sugar`, and `honeycomb` exist; optional `chain.food.berry_preserves` exists. Exact input choice needs a future audit. |
| `woodworking` | `log` to `plank` | Items exist; `workplace.sawmill`, `skill.crafting.carpentry`, and optional `chain.lumber.plank` exist. |
| `woodworking` | `plank` to `wood_shaft` or `tool_handle` | Items exist; `workplace.sawmill` and optional `chain.lumber.components` exist. |
| `leatherworking` | `hide_raw` to `cured_leather` | Items exist; `workplace.tannery`, `skill.crafting.tanning`, and optional `chain.leather.cured` exist. |
| `leatherworking` | `cured_leather` to `leather_panel` | Items exist; `workplace.tannery`, `skill.crafting.leatherworking`, and optional `chain.leather.components` exist. |
| `tailoring` | `fiber` to `cloth` or `coarse_cloth` | Items exist; `workplace.loomhouse`, `workplace.tailors_hall`, and `skill.crafting.weaving` exist. Exact output should be chosen by future audit. |
| `metalsmithing` | `iron_ore` to `iron_ingot` | Items exist; `workplace.bloomery_forge`, `skill.crafting.smelting`, `blacksmith_hammer`, and optional `chain.metal.iron_ingot` exist. |
| `metalsmithing` | `iron_ingot` to `metal_rod` | Items exist; `workplace.weaponsmith_forge`, `blacksmith_hammer`, and optional `chain.metal.components` exist. |
| `assembly` | `metal_rod` plus `tool_handle` to `hammer` | Items exist; `hammer` is a tool-class item; optional `chain.utility.tools` exists. Exact workplace/tool policy needs future audit because the output itself is a tool. |
| `assembly` | `wood_shaft` plus a metal component to a simple tool or simple weapon component | `wood_shaft`, `metal_rod`, `short_bow`, `arrow_bundle`, and `iron_blade` exist. This lane needs careful future audit to avoid combat/equipment expansion. |
| `cooking` | common ingredient or herb bundle to prepared food or beverage | `herb_bundle` and `herbal_tea_blend` exist. Keep non-effect-bearing and avoid alchemy, medicine, Knowledge progress, or runtime effects. |

For each candidate category, the future seed must prove:

- every input item key resolves;
- every output item key resolves;
- the transformation is not a direct no-op or self-transform;
- every workplace id resolves if used;
- every required tool item key resolves and is tool-class if used;
- every skill id resolves if used;
- any production-chain relationship is optional, audited, and non-inheriting.

## 7. Future Recipe Authoring Rules

Every future recipe record must:

- be complete under `packages/schemas/crafting/recipe.schema.json`;
- use `recipe.<slug>` id and matching `slug`;
- use `status: "planned"` unless the future seed explicitly decides `active`;
- declare exactly one primary output;
- use positive integer quantities only;
- avoid repeating the same `itemKey + role` within inputs or outputs;
- avoid direct self-transform or no-op recipes;
- avoid macro-production fields;
- avoid price, value, market, vendor, stock, demand, or economy fields;
- avoid runtime execution fields;
- avoid inventory mutation fields;
- avoid item-instance fields;
- avoid UI, storage, command, event, reward, and gameplay fields;
- avoid production-chain inheritance;
- avoid settlement, building, infrastructure, extraction-stage, service, route, or property anchors;
- use `sourceAuthorityNotes` to state why the recipe is authored and why every reference is descriptive and non-executing.

Production-chain links, when present, must be only `relatedProductionChainId`. The link must resolve, must not source fields, and must not imply aliasing, migration, inheritance, execution, or economy behavior.

## 8. Selection Criteria For First Actual Content Implementation

The first live seed must start from canonical item availability, not from production-chain convenience.

Prefer recipes that:

- have obvious player-facing meaning;
- have simple deterministic outputs;
- use canonical input and output item identities already in `items.items`;
- do not require new item creation;
- have clear optional workplace, tool, and skill references;
- can remain descriptive without runtime or economy behavior;
- can be reviewed record-by-record.

Avoid recipes that:

- require new systems or ambiguous station, tool, skill, guild, Knowledge, trial, or service ownership;
- imply economy simulation, production-chain extraction, or inventory execution;
- depend on market values as the only proof;
- depend on production-chain `recipeProfile` as field inheritance;
- require alchemy, enchanting, repair, salvage, quality, rarity, affixes, masterwork, or item-instance mutation;
- broaden into equipment, combat, medicine, Knowledge progress, quest mutation, commissions, or services.

No live recipe content should be added until this plan is approved and a separate implementation prompt explicitly authorizes live content.

## 9. Future Content Seed Implementation Plan

The next implementation candidate is `Version 0.5.245 - First Crafting Recipe Content Seed`, conditional on this seed plan being accepted.

That future pass may create `packages/content/base/crafting/recipes.json` only if explicitly authorized by the prompt. It may register recipes in normal content lint only if explicitly approved by the seed plan and the prompt. It must keep records small and auditable.

The future seed must not change runtime, inventory, UI, storage, commands, events, rewards, economy behavior, or gameplay. It must not edit production chains, item records, workplace records, skill records, guild records, Knowledge records, trial records, market values, loaders, runtime code, UI code, save-state code, or command/event/reward/gameplay code.

Recommended implementation sequence:

1. Re-run the item, workplace, tool, skill, and optional production-chain audit.
2. Pick 8-20 records from the simplest standard lanes.
3. Draft `packages/content/base/crafting/recipes.json` with `status: "planned"` unless explicitly approved otherwise.
4. Run focused recipe validation tests.
5. Register normal content lint only if the prompt explicitly approves registration.
6. Run normal content lint after registration, if registration happens.
7. Audit changed paths to prove the pass stayed content-only plus approved validation wiring.

## 10. Validation Checklist For Future Content Seed

The future seed implementation must run or document:

- focused recipe validation tests;
- schema-file test;
- normal content lint after registration, if registration is approved;
- content audit proving every item key resolves;
- tool audit proving every required tool item key resolves and is tool-class;
- workplace audit proving every workplace id resolves;
- skill audit proving every skill id resolves;
- optional production-chain link audit proving non-inheriting relationship only;
- no-op/self-transform audit;
- duplicate recipe id/slug audit;
- scope audit proving no production-chain, item, workplace, skill, runtime, UI, storage, economy, or gameplay changes;
- behavior audit proving recipes are static content only.

## 11. Deferred Topics

The following remain explicitly deferred:

- alchemy live recipes;
- enchanting live recipes;
- repair profiles;
- salvage profiles;
- quality, rarity, affix, masterwork, and improvement behavior;
- station profiles;
- tool profiles;
- resource and commodity recipes;
- flexible substitutions;
- generated variants;
- commissions and orders;
- recipe unlock state;
- crafting history;
- runtime execution;
- inventory consumption or creation;
- item-instance mutation;
- tool wear;
- station or service access;
- transactions and rewards;
- Knowledge, trial, or magic progress;
- quest mutation;
- economy simulation.

Magical books, tomes, scrolls, and enchanter-authored arcane documents remain deferred to their own magic/item/Knowledge ownership paths after the spell database and relevant authorities are established. Region-based maps remain deferred until region definitions and cartography data exist.

## 12. Temporary Or Research Artifact Handling

`docs/dev/tmp-crafting-production-systems-research-2026-06-20.md` is absent. This matches the `0.5.219` decision, which deleted it after promotion into permanent crafting authority and recipe/production schema docs.

No temporary crafting seed artifact was found in this pass. No temporary artifact is deleted or created by this plan.

## 13. Non-Goals

This plan does not authorize:

- live recipe content;
- `packages/content/base/crafting/recipes.json`;
- normal recipe content-lint registration;
- schema, validator, or focused-test changes;
- production-chain extraction, migration, aliasing, or normalization;
- edits to item, workplace, skill, guild, Knowledge, trial, or market-value records;
- loader, runtime, UI, storage, command, event, reward, economy, or gameplay changes;
- recipe execution, inventory mutation, item-instance creation, active orders, recipe unlocks, crafting history, tool wear, station access, rewards, Knowledge/trial progress, quest mutation, or economy simulation.

## 14. Next Recommended Version

`Version 0.5.245 - First Crafting Recipe Content Seed`

That future pass is conditional and should proceed only if live recipe content is explicitly authorized.
