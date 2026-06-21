# Temporary Deep Research: Crafting, Production, Recipes, Workshops, Quality, Repair, Salvage, Alchemy, and Enchanting

Status: temporary research artifact for Codex planning
Date: 2026-06-20
Source: Deep Research Light run from the user-provided crafting/production specification.
Intended use: staging reference for a later narrow Codex planning pass.

> Temporary-file policy: this file is not final design canon. It should either be converted into one or more permanent `docs/design/**` decision documents or deleted after the relevant Codex planning passes land.

## 1. Executive Summary

Lineage Reforged currently has no dedicated crafting authority. Items, workplaces, production chains, market values, guilds, and some quest templates already contain adjacent production or crafting-like data, but there is no canonical `crafting` content root, no standalone recipe schema, no workshop/station schema, no profession authority, no repair/salvage authority, and no player crafting runtime-state authority.

The strongest current repo foundation is economic production:

- `items.items` is the canonical item identity catalog.
- `civilization.workplaces` defines workplaces with workforce jobs and input/output profiles.
- `civilization.production_chains` defines generic production stages and embedded `recipeProfile`-like data.
- `civilization.guilds` exists as a broad guild authority.
- `civilization.market_item_values` owns market/value data.
- Magic item metadata already includes conduit and catalyst profiles.
- Quest data includes crafting-like templates and staged masterwork production examples.

The strongest recommendation is to create a docs-only crafting authority decision before adding schemas. Crafting should become a static recipe/transformation authority that references items, workplaces/stations, tools, materials, professions, Knowledge, trials, magic metadata, quests, and economy content without owning runtime inventory consumption, item creation, quality rolls, repair execution, salvage execution, recipe unlock state, market prices, vendor stock, or crafting UI.

Recommended next Codex pass:

`Version 0.5.214 - Crafting Authority Boundary Decision`

That pass should be documentation-only, should verify all live repo facts again, should correct any assumptions from this temporary report, and should not implement schemas, content, validators, tests, runtime crafting, item mutation, UI, storage, or gameplay behavior.

## 2. Current Repo State

### Confirmed from inspected repository context

- No dedicated `packages/content/base/crafting/**` content area exists.
- No dedicated `packages/content/base/professions/**` content area exists.
- No dedicated `packages/content/base/economy/**` content area exists.
- `world.settlements` already contains settlement economic descriptors.
- `civilization.workplaces` contains dozens of records with workforce jobs and input/output profile concepts.
- `civilization.production_chains` contains over one hundred records with stages, outputs, and embedded production/recipe-profile-like data.
- `civilization.guilds` already exists as a broad guild authority.
- `items.items` is a large canonical item identity catalog.
- `civilization.market_item_values` owns value records and currently references the item-key space.
- Item metadata already supports selected magic conduits and catalysts.
- Quest documentation/data already includes crafting templates and staged masterwork-style production examples.

### Inferred from adjacent docs and types

- Crafting transformation is currently adjacent to economy/production-chain content, but should not stay permanently inside macroeconomic authority if player-facing recipes become a feature.
- Workplaces can likely be reused as station/facility anchors, but a later decision must clarify whether recipes reference workplaces, a new station authority, or both.
- Tools likely belong to item identity plus future tool/profile metadata rather than a separate runtime crafting owner.
- Professions are probably needed as a static authority distinct from guilds, jobs, institutions, and player skill state.
- Resource and commodity concepts are planned or implied by economy decisions, but not yet implemented as concrete content authorities.

### Unverified candidate assumptions

Codex should verify these before creating permanent docs:

- Whether any hidden tests or engine code already treats production-chain `recipeProfile` fields as recipe-like authority.
- Whether item records already contain consistent enough material/tool tags to support recipe references.
- Whether any current quest records directly reference item outputs in ways that could become crafting contracts.
- Whether current market item value records should ever be referenced from crafting recipes or remain fully economy-owned.
- Whether any current magic catalyst/conduit metadata can be safely reused by alchemy/enchanting recipes.

## 3. Current Gaps and Risks

### 3.1 No canonical recipe authority

There is no dedicated schema or collection for recipes, ingredients, tools, stations, transformations, byproducts, quality outputs, or crafting prerequisites. Future recipe-like content could remain buried in production chains or quests unless a new authority boundary is created.

### 3.2 Overlapping production owners

Workplaces, production chains, settlements, items, market values, and quests all touch production-like concepts. A new crafting authority could duplicate input/output lists, costs, values, jobs, facilities, or quest stages unless the boundaries are clearly documented first.

### 3.3 Tool and station ambiguity

There is no stable crafting station or portable tool authority. Recipes need a way to state that they require a forge, saw, loom, alchemy bench, enchanting chamber, kiln, kitchen, or repair bench without embedding runtime access or facility ownership.

### 3.4 Material and commodity ambiguity

Natural resources, commodities, material items, ingredients, reagents, catalysts, and processed goods are not yet clearly separated. Recipes need stable input references, but those references should not duplicate item identity, market values, or future resource/commodity records.

### 3.5 Quality, rarity, affixes, and enchantment risk

Crafted quality, material quality, affixes, enchantments, and masterwork outputs can easily become runtime-heavy. First-pass static records should define possible descriptors and outputs without rolling quality, generating random affixes, or mutating item instances.

### 3.6 Repair and salvage risk

Repair and salvage are item-state operations. Static content can describe repair/salvage profiles, but current durability, broken state, consumed inputs, recovered outputs, and ownership changes must remain runtime/save state.

### 3.7 Alchemy and enchanting risk

Alchemy and enchanting require crossing item, magic, Knowledge, catalyst/conduit, spell, ritual, and crafting boundaries. These should be planned as recipe-like descriptive authorities only, without granting spell access, consuming reagents, altering readiness, or executing enchantment runtime.

### 3.8 Quest and commission integration risk

Crafting commissions and quest objectives may reference crafted item outputs or recipe ids, but quest progress, reward payout, recipe unlocks, and item grants must stay in quest/runtime owners.

## 4. Recommended Crafting / Production / Item Transformation Hierarchy

Recommended hierarchy:

```text
Item Identity (`items.items`)
  -> Material / Tool / Consumable / Catalyst / Conduit / Product identity

Economy / World Production
  -> Workplaces
  -> Production Chains
  -> Future Resources
  -> Future Commodities

Crafting Static Authority
  -> Recipe Definition
  -> Recipe Family / Category
  -> Required Inputs
  -> Required Tools
  -> Required Station / Workshop / Workplace Reference
  -> Required Profession / Skill / Knowledge / Trial Descriptor
  -> Output Descriptors
  -> Byproduct Descriptors
  -> Quality / Repair / Salvage / Alchemy / Enchanting Descriptor

Runtime / Save State Later
  -> Player Inventory State
  -> Item Instance State
  -> Player Crafting State
  -> Recipe Unlock / Known Recipe State
  -> Active Crafting Order State
  -> Item Consumption / Creation / Quality Roll
  -> Repair / Salvage / Enchanting Execution
```

## 5. Crafting Authority Model

A future static crafting authority should work like a validated recipe book. It should define what transformations are possible and what static references those transformations require.

Static recipe records may own:

- stable id/slug/name/summary/status;
- recipe family/category;
- input item references and quantities;
- output item references and quantities;
- byproduct references;
- required tool profile references;
- required station/workshop/workplace references;
- required profession/skill/Knowledge/trial descriptors;
- quality posture;
- repair/salvage/alchemy/enchanting subtype flags;
- sourceAuthorityNotes;
- notes.

Static recipe records must not own:

- current player inventory;
- actual ingredient consumption;
- generated item instances;
- quality rolls;
- random affixes;
- current durability;
- repair execution;
- salvage execution;
- recipe unlock state;
- player skill progression;
- market prices;
- vendor stock;
- quest progress;
- reward payout;
- runtime orders;
- UI state;
- storage state;
- gameplay execution.

## 6. Recipes and Transformations

Recipes should support simple and staged transformations without becoming runtime scripts.

Recommended supported forms:

- one input to one output;
- many inputs to one output;
- one input to many outputs;
- byproducts;
- batch outputs;
- repair-like transformations;
- salvage-like transformations;
- alchemy transformations;
- enchantment transformations;
- strongly defined fixed recipes;
- limited ingredient substitution only after a boundary decision permits it.

The research recommends mostly strongly-defined recipes because they are easier to validate and balance. Flexible recipes may be useful later, but first-pass schema work should avoid open-ended free-form crafting.

Recipe definitions should remain declarative. If a recipe says two ingots and one plank make one sword, it does not consume the ingots, create the sword, roll quality, or equip the result. It only describes a valid transformation.

## 7. Workplaces, Stations, Workshops, and Tools

Existing `civilization.workplaces` is the strongest candidate for early station/workshop anchors. A later boundary decision should determine whether recipes reference:

- workplace ids directly;
- future station ids;
- station categories hosted by workplaces;
- portable tool profiles on item records;
- both fixed stations and portable tools.

Potential station/workshop concepts:

- forge;
- anvil;
- kitchen;
- alchemy lab;
- enchanting chamber;
- loom;
- tailoring bench;
- sawmill;
- mill;
- farm facility;
- shipyard;
- repair bench;
- kiln;
- tannery;
- workbench.

Tools should probably remain items with future tool-profile metadata. Recipes can reference tool profiles; runtime determines whether the player has a valid item and whether it is consumed, worn, damaged, or retained.

## 8. Materials, Ingredients, Reagents, and Commodities

Material identity should remain item-owned unless a future resource/commodity authority is approved.

Recommended distinctions:

- **item**: individual inventory identity already owned by `items.items`;
- **resource**: natural or primary source category such as timber, ore, fish, stone, clay, herbs, wool, grain, salt, flax, hides, or reeds;
- **commodity**: standardized bulk tradable form such as timber lots, ore loads, grain sacks, dried fish, wool bales, cloth bolts, pottery crates, lamp oil, or cured hides;
- **ingredient**: an input role within a recipe;
- **reagent**: a special recipe input, often alchemical or magical;
- **catalyst/conduit**: existing magic-oriented item metadata that may later be used by alchemy/enchanting recipes.

Recipes should initially reference item ids or item keys directly. Resource/commodity references should wait until resource/commodity authority decisions exist.

## 9. Quality, Rarity, Affixes, and Item Improvement

The research identifies three viable levels:

1. Fixed output quality: simplest and safest for first pass.
2. Static quality-profile descriptors: possible quality range or deterministic quality tier.
3. Runtime quality roll/affix assignment: later gameplay feature.

Recommended first-pass posture:

- recipes can describe output quality posture if needed;
- named masterwork outputs should be separate item identities;
- affixes and random qualities should not be generated by static content;
- any future `crafting.quality_profiles` should remain descriptive;
- item-improvement recipes should output a known target item or descriptor, not mutate an existing runtime item instance directly.

## 10. Repair, Durability, and Salvage

Repair and salvage should be treated as future recipe-like descriptors with runtime execution deferred.

A repair profile may later describe:

- target item category or item reference;
- required materials;
- required station/tool;
- supported condition bands;
- notes/provenance.

A salvage profile may later describe:

- source item/category;
- possible recovered outputs;
- loss ratio or yield posture;
- required tool/station;
- notes/provenance.

Runtime owns:

- current durability;
- broken state;
- actual item consumption;
- recovered quantities;
- repair completion;
- inventory mutation;
- item ownership;
- item deletion or replacement.

## 11. Alchemy and Enchanting

Alchemy and enchanting can start as specialized recipe categories.

Alchemy may cover:

- potions;
- elixirs;
- oils;
- medicinal preparations;
- reagents;
- catalysts;
- bottles/vessels;
- alchemy lab requirements.

Enchanting may cover:

- base item plus catalyst/conduit;
- spell-linked or ritual-linked recipe descriptors;
- magical tool/station requirements;
- output enchanted item identity;
- required Knowledge/magic/trial references.

Do not allow alchemy/enchanting recipe records to grant spell ownership, alter spell readiness, consume reagents, execute casting, create study evidence, mutate item instances, or apply enchantments directly.

## 12. Economy, Professions, Guilds, and Commissions

The research supports a future `civilization.professions` authority distinct from guilds, jobs, institutions, workplaces, and player skill state.

Crafting may eventually reference:

- profession ids;
- guild ids;
- workplace ids;
- production-chain ids;
- commission template ids;
- market item values;
- settlement economy descriptors.

Do not put prices, stock, wages, job counts, market pressure, production ticks, or transactions into recipe definitions. Market value remains economy-owned.

Crafting commissions should probably be a later contract/quest-adjacent authority that references item outputs or recipe ids. Commission progress and rewards remain runtime/quest state.

## 13. Quests, Contracts, Trials, and Knowledge Integration

Quests and contracts may reference:

- recipe ids;
- output item ids;
- material ids;
- commission template ids;
- Knowledge prerequisites;
- trial prerequisites;
- guild/profession references.

Static crafting content must not own:

- quest state;
- objective progress;
- recipe unlock state;
- reward payout;
- Knowledge progress;
- trial completion;
- item grants;
- Chronicle writing.

Knowledge snippets can describe techniques, recipes, materials, or plant/mineral identification, but player-known state remains runtime/save state.

## 14. Travel, Gathering, Agriculture, and Resource Nodes

Crafting depends on future or adjacent gathering systems:

- forests produce wood/timber materials;
- mines produce ores/stones/clays;
- farms produce grains, flax, wool, herbs, foods;
- flora/fauna content can provide herbs, hides, meat, bones, oils, venoms only if canon-supported;
- routes and caravans move commodities;
- camps may support field crafting later.

Crafting records should not own resource depletion, harvest state, map discovery, gathering rolls, survival spoilage, travel state, or weather/time effects. Those remain travel/world/runtime concerns.

## 15. Proposed Content Collections and Schema Concepts

Candidate future authorities:

| Collection | Candidate path | Purpose | Timing |
|---|---|---|---|
| `crafting.recipes` or `civilization.recipes` | decide later | player-facing recipe definitions | after boundary decision |
| `crafting.recipe_families` | decide later | smithing, tailoring, alchemy, enchanting, cooking categories | later |
| `crafting.tool_profiles` | item-adjacent or crafting path | portable tool categories used by recipes | later |
| `crafting.station_profiles` | crafting path or workplace extension | station/workshop requirements | later |
| `crafting.quality_profiles` | crafting path | quality descriptors and output posture | later |
| `crafting.repair_profiles` | crafting path | descriptive repair requirements | later |
| `crafting.salvage_profiles` | crafting path | descriptive salvage outputs | later |
| `crafting.alchemy_recipes` | separate or tagged recipe subset | alchemy-specific transformations | later |
| `crafting.enchanting_recipes` | separate or tagged recipe subset | enchanting-specific transformations | later |
| `crafting.commission_templates` | crafting or quest/contract path | repeatable crafted-good requests | later |
| `world.resources` | world path | source material identity | future economy/world decision |
| `world.commodities` | world path | bulk trade classes/forms | future economy/world decision |
| `civilization.professions` | civilization path | occupational identity | future civic/economy decision |
| `player.crafting_state` | runtime/save | active/known crafting state | 0.6+ |
| `player.recipe_knowledge_state` | runtime/save | known/unlocked recipes | 0.6+ |
| `player.crafting_order_state` | runtime/save | active orders/commissions | 0.6+ |

The next boundary decision must choose whether initial recipes should live under `crafting`, `civilization`, or another existing namespace.

## 16. Validation and Test Strategy

Future validators should eventually enforce:

1. strict records-only wrappers;
2. id/slug consistency;
3. valid item input/output references;
4. no missing outputs;
5. positive quantities;
6. valid tool/station/workplace references;
7. valid profession/guild/Knowledge/trial references where supported;
8. valid alchemy/enchanting catalyst/conduit references where supported;
9. no recipe cycles without explicit approval;
10. no impossible input/output loops;
11. resource/commodity records reference item keys or category mappings without copying item names, values, inventory properties, or crafting definitions;
12. no current stock, price, owner, container, durability, player-known, progress, reward, UI, storage, runtime, or gameplay fields;
13. no recipe-driven item grants, item consumption, market mutation, vendor stock mutation, spell access, Knowledge progress, trial completion, reputation change, or quest-state mutation.

## 17. Authored-vs-Generated Data Strategy

Recommended authored content:

- core recipe families;
- major recipes;
- signature regional crafts;
- masterwork and named-item recipes;
- alchemy/enchanting recipes;
- important repair/salvage profiles;
- commission templates tied to major factions/guilds.

Potential generated-once content:

- bulk basic recipes for common material variants;
- simple resource/commodity mappings;
- basic repair profiles by item category;
- standard salvage profiles derived from known recipe inputs;
- mundane commission templates.

Runtime/generated later:

- quality rolls;
- random affixes;
- active crafting orders;
- actual item instances;
- inventory consumption;
- material recovery;
- recipe unlock state;
- crafting history;
- vendor transactions;
- player crafting progress.

## 18. Gameplay Integration Roadmap

Long-term gameplay integration can eventually include:

- crafting UI;
- recipe book UI;
- inventory/equipment integration;
- item-instance creation;
- workshop/station access checks;
- skill/profession progression;
- guild commissions;
- quest/contract objectives;
- market/economy integration;
- magic/alchemy/enchanting interaction;
- repair/durability;
- salvage;
- travel/gathering/resource nodes;
- NPC crafting services.

Near-term work should remain static-authority and validation-focused only.

## 19. Recommended Versioned Implementation Sequence

Suggested sequence if this crafting lane is prioritized:

1. `0.5.214 - Crafting Authority Boundary Decision`
   - docs-only;
   - decide recipe/crafting/workshop/tool/material boundary vs economy, items, production chains, quests, Knowledge, magic, and runtime state.

2. `0.5.215 - Recipe And Production Schema Decision`
   - docs-only;
   - decide recipe path, id pattern, wrapper, input/output shape, station/tool/profession posture.

3. `0.5.216 - Resource And Commodity Schema Decision`
   - docs-only or schema-decision;
   - decide resource/commodity mapping to item keys.

4. `0.5.217 - Tool And Station Profile Schema Decision`
   - docs-only;
   - decide whether to extend items/workplaces or create crafting-specific profiles.

5. `0.5.218 - First Recipe Schema And Validator`
   - schema/validator/tests only.

6. `0.5.219 - First Recipe Content Seed Plan`
   - docs-only.

7. `0.5.220 - First Recipe Content Seed`
   - narrow content seed only.

8. `0.5.221 - Alchemy And Enchanting Recipe Decision`
   - docs-only.

9. `0.5.222 - Repair And Salvage Profile Decision`
   - docs-only.

10. `0.6+`
    - crafting runtime;
    - recipe unlock state;
    - item consumption and creation;
    - quality rolls;
    - repair/salvage execution;
    - crafting UI;
    - player crafting progression.

## 20. Open Questions

- Should recipes live under a new `crafting` namespace or under `civilization` as a civilization content authority?
- Should existing `civilization.production_chains.recipeProfile` data migrate, remain embedded, or be referenced by future recipe records?
- Should workplaces become station anchors directly, or should station profiles be a new authority?
- Should portable tool requirements be expressed through item tags, item use-profiles, or new `tool_profiles`?
- Should resources/commodities be created before recipes, or can recipes reference item ids first?
- How should recipe prerequisites reference Knowledge, trials, magic study, professions, or guilds?
- Should alchemy/enchanting be recipe subtypes or separate collections?
- Should repair and salvage be special recipes or dedicated profile authorities?
- How much flexible ingredient substitution is safe for first-pass validation?
- Should quality profiles exist before runtime crafting, or wait until item-instance quality is designed?

## 21. Recommended Next Codex Prompt

Next recommended narrow Codex prompt:

`Version 0.5.214 - Crafting Authority Boundary Decision`

Goal:
Create a docs-only design decision defining the boundary among static crafting recipes, production chains, items, materials, tools, workshops/stations, professions, guilds, quality descriptors, repair/salvage descriptors, alchemy/enchanting recipes, commissions, Knowledge/trial references, economy references, and future player crafting runtime state.

Primary task:
Inspect the live repo, correct this research artifact where repo-state assumptions are stale, and create a permanent design decision:

`docs/design/crafting-authority-boundary-decision.md`

Required decisions:

1. Whether recipes live under new `crafting` authority, `civilization`, or another existing namespace.
2. Whether existing production-chain recipe profiles remain embedded until a migration decision.
3. Whether recipes should initially reference item ids/keys directly rather than future resources/commodities.
4. Whether workplaces should act as first-pass station anchors.
5. Whether portable tools should remain item-owned and be referenced by profile/tag.
6. Whether professions are required now or deferred.
7. Whether alchemy/enchanting are recipe subtypes or separate future authorities.
8. Whether repair/salvage are recipe subtypes or separate future authorities.
9. Whether quality/affix systems remain future-only.
10. Whether all first-pass crafting records reject runtime, inventory, item-state, price, market, vendor, recipe-unlock, quest-state, Knowledge-progress, trial-completion, and gameplay fields.
11. Which schema decision should come next after the boundary document.

Suggested commit message:

`docs(crafting): decide crafting authority boundaries`

## External References Used By Deep Research

- Existing Lineage Reforged economy authority decisions.
- Existing Lineage Reforged item/equipment/inventory authority decision.
- Existing Lineage Reforged combat authority decision.
- Existing Lineage Reforged quest and Knowledge documentation.
- Digital Humanities Quarterly: Crafting in Games, especially recipe-definition and workmanship/quality dimensions.
- General RPG/MMO/survival/colony-sim crafting, production-chain, alchemy, enchanting, repair, salvage, and recipe-authoring patterns.
