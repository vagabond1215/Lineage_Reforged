# GPT-DR.food.processing-preservation Research

- Date: 2026-07-14
- Gate: `GPT-DR.food.processing-preservation`
- Repository baseline: `2264bbd5ac96b99b56dd5fe174cabe4a0d8e646d` on clean, remote-aligned `master`
- Status: temporary cited research artifact; non-canonical until the cross-domain research integration dispositions it
- Scope: research and documentation only; no content, schema, validator, test, runtime, UI, save, migration, dependency, asset, economy, crafting, food, preservation, or gameplay implementation

## 1. Gate Result

Gate 5 passes as a research gate. The evidence is sufficient to define dependency-closed food-processing lanes, preserve food/material/feed/medicine/poison boundaries, identify current repository owners, and add substantial evidence relevant to the conditional production-authority audit. It does not authorize an item, profile, recipe, chain, quantity, food effect, preservation rule, action, or mutable state.

The strongest repository conclusion concerns live authority. A reproducible core predicate - production-chain namespace root in `beverage`, `brewing`, `farming`, `food`, `forage`, `hunting`, `riverside`, or `sugar` - selects 41 food-source/processing chains and all 19 explicitly authored processing-step input arrays. Those chains have 81 steps: 19 nonempty and 62 empty input arrays, plus 52 nonempty and 29 empty output arrays. Runtime supplies every empty output through workplace or requested-target fallback. It can also override nonempty inputs when a step uses variant inputs. Six default steps do so, including grain-to-flour, meat/fish preservation, sausage smoking, berry preserving, and sausage-roll baking. Seventeen declared stages across six chains have no processing step. Nine core variant chains do not return the requested generic primary output, and the nonvariant bread chain drops declared `bran` because only last-step outputs are returned. These are live cost, value, market, and explanation effects, not descriptive-only metadata ([production chains](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/production_chains.json), [runtime economy](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/engines/civilization-engine/src/runtime-economy.ts)).

The bounded recipe owner is narrower. Twelve planned recipes across eight families are static and non-executing; only three are food-related: dough to loaf, butchered meat plus salt to smoked meat, and grain bundle to flour. Their chain links are explicitly non-inheriting. The live flour and preserved-meat chains nevertheless substitute variant inputs for the recipe inputs, while the bread macro chain has a broader topology. Gate 5 therefore strengthens several audit-trigger criteria: important inputs and outputs depend on fallback; declared stages are skipped; recipe and live-chain semantics diverge; variants disagree with generic requests; workplace tool blocking is ineffective; and current tests do not isolate these food behaviors. Gate 6 must make the final trigger decision ([recipes](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/crafting/recipes.json), [audit trigger](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/design/production-chain-workplace-runtime-authority-audit-trigger.md)).

The strongest food-state conclusion is that a living source, carcass or catch, anatomical part, raw edible output, cleaned food, stabilized stock, preserved form, ingredient, fermenting substrate, intermediate, finished dish or drink, process aid, container, coproduct, recoverable material, feed, ordinary waste, hazardous residue, market identity, chain output, recipe output, and runtime item instance require separate authority. External evidence supports these distinctions across all required lanes, but only repository-canonical sources and identities can seed later content. The selected external corpus contains 68 distinct works: 25 A1, 11 A2, 28 B1, and 4 B2 sources.

The live consumption boundary is also material. Nine static profiles describe nutritional, hydration, and intoxication values; only five items link to them, three links are semantic mismatches, and four profiles are unreferenced. The player engine applies real energy, nutrient, hydration, intoxication, and starvation-related effects, but the UI currently decrements the inventory stack and assembles the consumption update. No lot, freshness, temperature, contamination, cooking, or spoilage owner exists. Gate 5 records that boundary without changing or authorizing any effect ([consumable profiles](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/items/consumable_profiles.json), [body-state owner](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/engines/player-engine/src/body-state.ts), [UI consumption](https://github.com/vagabond1215/Lineage_Reforged/blob/master/apps/rpg-ui/src/features/characterPanelState.ts)).

Ordinary processing and storage remain the baseline. The repository has real abstract settlement storage but no food-lot conditions. Magic provides a generic small-scale-preservation service, yet that service excludes ice from its allowed elements; ice-capable services do not authorize preservation. An ice-conditioned container is therefore a conditional Gate 7 question, not current canon or runtime.

The next executable gate is `GPT-DR.crafting.tools-workplaces-production`. The seven-artifact integration hold and the block on revised `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` remain unchanged.

## 2. Method, Authority, Source Quality, And Safety Boundary

### Route and repository verification

The run began from clean, remote-aligned `master` at `2264bbd5ac96b99b56dd5fe174cabe4a0d8e646d`, exactly matching the prompt. Gates 1-4 were accepted, Gate 5 was the immediate next gate, no accepted Gate 5 artifact existed, and the conditional post-Gate-6 audit remained installed but undecided. The active and queued cross-domain integration prompts remained byte-identical Git blobs at `9ce61594efe498c78b0b6d0d08fdafccf7cc0c54`; neither is Gate 5 implementation authority ([current handoff](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/current-gpt-handoff.md), [current output](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/current-codex-output.md), [active prompt](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/current-codex-prompt.md), [queued prompt](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/queued-cross-domain-production-research-integration-prompt.md)).

### Claim authority

- **Repository fact:** directly observed in current content, schema, validator, test, or runtime code; controlling for project state.
- **External evidence:** a cited physical, microbiological, archaeological, heritage, or technical relationship; informative but never canonical.
- **Design inference:** an explicitly marked repository-compatible interpretation.
- **Integration candidate:** a possible principle, correction, identity, relationship, precondition, or authored question awaiting later disposition.
- **Runtime reservation:** mutable action, lot, quantity, effect, condition, time, cost, quality, hazard, item creation, inventory mutation, or persistence that static research cannot own.

Authority order is live repository content and consumers, focused current decisions, current coordination, accepted Gates 1-4, external evidence, then explicit inference. Similar names do not establish aliases, edibility, source, food grade, recipe inheritance, or runtime behavior.

### Method

- Read the mandatory coordination, route, prior-gate, recipe, crafting, economy, storage, magic, roadmap, backlog, and deferred-route authorities.
- Parsed live JSON to reproduce exact catalog, stage, role, source-output, profile, recipe, chain, workplace, storage, region, and magic counts.
- Inspected item and recipe schemas, semantic validation, content lint, runtime economy, settlement simulation, market and transport consumers, body-state application, UI consumption, and focused tests.
- Executed read-only probes over all chains and the 41-chain core set to compare declared stages, explicit fields, variant substitution, fallback-derived inputs/outputs, generic requested outputs, declared byproducts, final returned outputs, tools, fuel, and live explanations.
- Researched every required food lane using international standards, peer-reviewed work, official technical guidance, extension evidence, archaeology, heritage, and living-tradition evidence. Search snippets were not used as evidence.
- Applied source, food-grade, collision, repeated-consumer, regional-support, technology, safety, later-gate, and runtime-owner filters before classifying candidates.

### Source quality

- **A1 - primary authority:** first-party standard, code, or official normative/control authority.
- **A2 - peer reviewed:** peer-reviewed primary research or scholarly synthesis.
- **B1 - official evidence:** government, intergovernmental, extension, or formal official technical guidance.
- **B2 - institutional evidence:** university, museum, heritage, conservation, or comparable institutional evidence with narrower authority.

The external register contains 68 works across 68 direct URLs: 25 A1, 11 A2, 28 B1, and 4 B2. Modern safety and industrial sources support dependencies, distinctions, and hazards only. Archaeological, heritage, and living-tradition sources demonstrate possibility and variation, not universal adoption, an exact chronology, or repository canon.

### Safety boundary

This report provides no slaughter procedure, preservation formula, cure, brine, starter, culture, cooking schedule, alcohol strength, yield, ratio, concentration, capacity, temperature, duration, shelf life, toxin-removal method, pathogen-control procedure, caustic chemistry, or executable food-safety instruction. It does not classify any fictional organism or part as safe to eat. Heat, cold, water, smoke, dust, ventilation, drainage, contamination, toxins, pests, and residues appear only as qualitative owner and infrastructure requirements.

## 3. Live Repository Baseline And Owners

### Exact catalog baseline

| Catalog or owner | Exact live state | Gate 5 authority and limit |
|---|---:|---|
| Items | 1,372 | Canonical portable identities; item class, branch, subbranch, stage, role, and tag are separate signals |
| Item classes | 1,114 commodity; 131 tool; 35 weapon; 26 consumable; 24 accessory; 18 armor; 14 clothing; 10 vehicle | `consumable` class is not the same as a linked consume profile |
| Food-facing branches | 148 food; 21 beverage; 3 meal; 184 flora; 455 fauna; 4 fungal; 2 livestock; 6 animal; 13 botanical; 10 alchemy; 5 fuel | Branch is catalog organization, not source, edibility, grade, or effect |
| Food branch states | 56 preserved; 38 raw; 23 food; 8 prepared; 7 milled; 5 baked; 5 processed; 4 intermediate; 2 ingredient; stages 113 finished, 23 processed, 12 raw | Existing preparation breadth is substantial but uneven and sometimes noisy |
| Item stages | 409 records: 183 finished, 138 processed, 49 raw, 39 refined; 963 unstaged | Coarse optional state metadata, not a complete transformation graph |
| Item roles | 1,025 assignments on the 409 staged records: 405 trade good, 224 material, 186 ingredient, 144 consumable, 52 reagent, 14 fuel | Roles may co-occur; no food-grade, lot, spoilage, residue, feed, or container-safety role |
| Perishable tag | 144 records | Static tag only; no freshness or spoilage owner |
| Market values | 1,617 | All 1,372 item keys plus 245 market-only biological identities: 113 flora and 132 fauna |
| Consumable profiles | 9 | Static energy/nutrient/hydration records; one also has intoxication |
| Linked consume items | 5 | `ale_cask`, `bread_loaf`, `breast_cut`, `candied_peel`, `crusty_sausage_roll`; only a linked profile reaches current UI consumption |
| Planned recipes | 12 across 8 families | Static bounded transformations; no engine or app recipe executor |
| Food-related planned recipes | 3 | Dough to loaf, butchered meat plus salt to smoked meat, grain bundle to flour |
| Production chains | 121 | All directly craft-resolvable as macro economic calculations |
| Core food-source/processing chains | 41 | Namespace predicate: beverage 10, brewing 1, farming 1, food 22, forage 3, hunting 2, riverside 1, sugar 1 |
| Core declared stages | 92: 62 workplace / 21 unique IDs; 30 extraction / 11 unique IDs | Seventeen declarations across six chains lack a processing step |
| Core processing steps | 81: 60 workplace, 21 extraction | 19 explicit / 62 empty inputs; 52 explicit / 29 empty outputs |
| Core variants | 24 chains / 154 variant records | Variant fields can replace explicit fields and generic targets |
| Core declared byproducts | 85 references / 41 unique keys | Economic secondary outputs; not synonymous with waste |
| Workplaces | 58 | Static capabilities and live fallback input/output/tool evidence |
| Core workplaces | 21 | 212 input refs / 146 unique; 174 output refs / 159 unique; all resolve |
| Core workplace jobs | 82 jobs / 54 unique IDs | Every job/tier numeric requirement in this set is an empty-object placeholder |
| Core progression and upgrades | 13 progression profiles / 65 tiers; 14 upgrade profiles / 69 upgrades | Descriptive; ignored by current resolver |
| Core workplace tool tags | 122 occurrences / 53 unique | Resolver aggregates every job's tags rather than selecting an active job/tier |
| Tools / skills / extraction | 131 tool items; 121 skills; 22 extraction methods | Core chain skill refs use Cooking and Carpentry; 11 extraction IDs appear in declared core stages |
| Flora | 117 records / 199 unique outputs / 1,394 occurrences | All outputs item/value-resolved; part and output arrays are not structurally paired |
| Fauna | 132 records / 459 unique outputs / 484 occurrences | All outputs item/value-resolved; static passive/slaughter topology only |
| Aquatic taxonomic core | 12 fish, 8 mollusks; plus 4 aquatic arthropods and 4 marine mammals by explicit identity review | No authoritative generic `aquatic` field; avoid habitat-string inference |
| Fungi | 4 records typed fungi | Existing fungal outputs have no planned recipe consumer; edibility is not inferred |
| Monsters | 24; 49 drop refs / 37 unique; 20 loot refs / 6 unique | Static possibilities only; food-looking outputs do not prove edible anatomy |
| Buildings and storage | 22 buildings; 7 storage-bearing buildings / 8 profiles: 2 each granary, cellar, warehouse, vault | Real abstract settlement capacity/load/utilization, not perishable lots |
| Spatial authority | 9 regional ecology profiles, 41 regions, 47 localities, 88 settlements | Supply, demand, identity, and geography context; not recipes or mutable food stock |
| Knowledge | 28 snippets | Lore/recognition only; no food-process authority |
| Magic | 4 service records; 27 crystal records / nine affinities by three tiers | Bounded service metadata; no food or cold-container execution |

Counts and owners were reproduced from the connected [items](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/items/items.json), [item schema](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/schemas/items/item.schema.json), [market values](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/market_item_values.json), [profiles](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/items/consumable_profiles.json), [recipes](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/crafting/recipes.json), [chains](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/production_chains.json), [workplaces](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/workplaces.json), [buildings](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/buildings.json), [flora](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/flora.json), [fauna](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/fauna.json), [monsters](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/monsters.json), [regions](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/regions.json), [regional ecology](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/regional_ecology_profiles.json), [settlements](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/settlements.json), [skills](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/player/skills.json), [Knowledge](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/player/knowledge_snippets.json), [magic services](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/magic_infrastructure.json), and [crystals](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/crystal_catalog.json).

### Current consumption, storage, recipe, and runtime owners

All nine consumable profiles contain calories, protein, carbohydrates, fat, and hydration; eight say `Eat`, while `consume.ale_cask` says `Drink` and carries intoxication. Five item references resolve. Three are semantically mismatched: `breast_cut` links to `consume.game_stew`, `candied_peel` to `consume.inn_hearty_meal`, and `crusty_sausage_roll` to `consume.traveler_ration`. Four profiles - ration bundle, trail meal, seafood stew, and tavern fish plate - are unreferenced. `cream` and `fresh_cheese` point to `spoilage.dairy_fresh`, but no spoilage-profile catalog or runtime exists. Current lint does not establish profile referential closure.

`applyConsumableToBodyState` changes real energy, nutrient, hydration, intoxication, fatigue, and starvation-related state. `consumeInventoryItem` in the UI decrements or removes the stack, applies the profile, and recalculates the snapshot. Inventory stacks have item id, item key, and quantity only. There is no lot, batch, freshness, quality, temperature, contamination, disease, or perishable-state field. There is no cooking or food-preparation executor. This is not an absence of nutrition runtime; it is an incomplete and UI-coupled consumption authority boundary ([body-state tests](https://github.com/vagabond1215/Lineage_Reforged/blob/master/tests/unit/player-body-state.test.mjs), [shared contracts](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/shared/types/src/contracts.ts)).

The recipe validator resolves item, workplace, tool, skill, and optional chain references and preserves chain links as non-inheriting. No engine or app consumes planned recipes as executable transformations. Conversely, the civilization runtime consumes production chains and workplaces to calculate inputs, outputs, quantity, quality, time, labor, material cost, processing cost, waste cost, item values, market prices, and transport pricing. It does not create physical inventory or execute kitchen work.

Settlement simulation derives storage capacity, load, utilization, type, supported-goods lists, and condition-adjusted capacity for all 88 settlements from buildings or a fallback type. It apportions aggregate market stock load; it does not store item lots or apply food-condition rules ([settlement simulation](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/engines/civilization-engine/src/settlement-simulation.ts)).

### Existing identities, source gaps, and catalog noise

The catalog already contains extensive raw, preserved, milled, prepared, baked, beverage, ration, cask, ingredient, byproduct, container, and process-aid vocabulary. All 658 unique flora/fauna output keys resolve to item and value records, with no overlap between the flora and fauna sets. The additional 245 market-only biological identities are source-market records, not item aliases. A finished food need not be a biological output, but it requires an explicit chain or recipe relationship before a source can be claimed. Conversely, the broad source catalogs contain many outputs with no bounded food recipe consumer; absence of a recipe does not authorize adding one.

Catalog semantics are noisy enough to forbid name-based inference. `sausage_link` and `smoked_sausage_link` are stationery/ink records, `sausage_coil` is lighting/oil-wax, `snail_shell` is a finished perishable food ingredient with metal difficulty, `meat_trimmings` is raw-subbranch but tagged finished, and `quicklime` and `mineral_brine` carry fuel roles. `mash_spent`, `bagasse`, `straw_bundle`, `river_reed`, dishes, rations, and `tea_ceremony` all appear as top-level chain byproducts despite radically different destinations. These are audit findings, not correction permission.

## 4. Continuity With Gates 1-4

### Preserved from Gate 1

Source identity, source entity, source site, recovered output, initial preparation, prepared stock, market commodity, production chain, runtime action, and mutable state remain separate. Gate 5 creates no harvesting, hunting, fishing, source placement, depletion, recovery, yield, access, ownership, or item instance.

### Preserved and qualified from Gate 2

Organism, anatomical part, naturally shed or secreted output, slaughter output, raw biological material, stabilized material, ingredient, finished food, loot possibility, and generated item instance remain separate. Gate 5 carries forward the shared bird egg/feather state, garter-snake egg, milk-producing ox and `ox_milk`, slaughter-only antler, shell/scute/scale ambiguity, passive roe, and direct tissue-to-oil collapse as repository issues. It does not declare an animal, mushroom, monster part, gland, blood, fat, offal, shell, roe, or oil safe to eat.

### Preserved and qualified from Gate 3

Crop or animal identity, producing state, harvest, seed/fodder stock, stabilized lot, ingredient, commodity, farm process, food process, bounded recipe, workplace, and execution remain separate. Seed grain versus food grain, producing-state milk and eggs, feed/food competition, crop residues, contamination, water, season, and storage remain unresolved owner questions. Gate 5 confirms that the macro chain `chain.farming.mixed_crop` and related workplaces do not create crop runtime.

### Preserved and qualified from Gate 4

Raw material, stabilized stock, prepared/refined material, intermediate, component, process aid, fuel, finished good, residue, waste, market identity, chain output, recipe output, and runtime instance remain separate. Gate 5 resolves the conceptual food/material boundary by requiring explicit food-grade authority for oils, fats, salts, alcohols, acids, brines, smoke exposure, containers, cookware, and animal/aquatic byproducts. It confirms and extends Gate 4's live-resolver findings with food-specific probes, but Gate 6 retains the final audit-trigger decision.

### Deferred forward

Gate 6 owns final production-authority audit disposition and exact tool/workplace/production reconciliation. Gate 7 owns detailed magic substitution. Integration owns promotions, corrections, schema decisions, authored regional questions, and collision review. Later runtime work owns food actions, lot state, consumption command authority, effects, spoilage, contamination, disease, temperature, inventory mutation, and persistence.

## 5. Required Food-State And Authority Separation

| State or authority | Meaning | Current owner or future need | Prohibited collapse |
|---|---|---|---|
| Living source | Canonical organism or managed/wild population | Flora/fauna identity; population state absent | Not carcass, crop lot, or item |
| Carcass / whole catch | Post-recovery whole biological body | No general item/action owner | Not meat, fillet, oil, hide, shell, or dish |
| Anatomical part | Species-specific tissue, organ, shell, bone, roe, skin, fat, gland | Fauna output relation or future explicit owner | Not automatically edible, medicinal, or material-grade |
| Raw edible output | Food-intended material before cleaning/cooking | Item plus canonical source and food-grade decision | Not equivalent to biological origin alone |
| Raw non-edible byproduct | Material stream not authorized as food | Item/material authority if justified | Not feed, ingredient, or waste by default |
| Cleaned / trimmed food | Dirt, shell, gut, peel, bone, damaged tissue, or other incompatible material separated | Missing relationship or bounded recipe | Not raw source or fully stabilized stock |
| Stabilized food | Qualitatively prepared for short holding or next handoff | Missing lot/condition owner; identity only if valuable | Not necessarily preserved, cooked, or safe |
| Preserved food | Food transformed by a supported preservation route | Items/chains/recipes, subject to source closure | Not a guarantee of indefinite safety |
| Milled / ground food | Particle-size or fraction transformation | Items plus milling relationship | Whole grain, groats, meal, flour, bran, and germ remain distinct |
| Fermenting substrate | Prepared input before or during biological transformation | Missing recipe/runtime state | Not starter, active ferment, finished drink, vinegar, or spoilage |
| Active ferment / starter | Living or carried inoculum/process state | No current owner | Not a generic ingredient or automatic safety mechanism |
| Ingredient | Input accepted by an exact bounded transformation | Item role plus recipe relationship | Source output or workplace input is not sufficient |
| Process aid | Salt, brine, acid, smoke, sugar, culture, cloth, filter medium, or similar enabling input | Exact relationship required | Not fuel, ingredient, container, or finished food by default |
| Intermediate | Output intentionally consumed by a later step | Items/chains/recipes | Not a market-ready finished food unless separately authorized |
| Finished dish / beverage | Player- or market-facing prepared product | Item; effect only through consume-profile owner | Not proof of ingredients or preparation route |
| Medicinal / poison preparation | Product whose intended authority is therapeutic or toxic | Medicine/alchemy/poison owner | Culinary use and health effects may not be inferred |
| Feed destination | Material intentionally suitable for animals | No general feed-grade role/owner | Human-food rejection is not feed authorization |
| Coproduct / byproduct | Secondary output with a repeated destination | Chain plus consumer/value review | Not synonymous with residue or waste |
| Recoverable material | Non-food stream usable in a material chain | Material authority and consumer required | Not edible because biologically sourced |
| Contamination / spoilage | Unwanted hazard or deterioration state | No current food-lot owner | Not an item identity, ordinary ingredient, or sensory safety test |
| Hazardous residue / ordinary waste | Unsafe managed stream / low-value discard | Future runtime or prose unless gameplay-relevant | Not automatically recoverable or marketable |
| Cookware / container / storage | Tool for heating / vessel / facility | Tools, items, workplaces, buildings; condition absent | None is an ingredient, preservation guarantee, or lot |
| Market / chain / recipe output | Economic identity / macro output / bounded descriptive transformation | Market, chain, recipe owners respectively | None alone creates a runtime item instance |
| Runtime item instance | Mutable quantity with location and eventual condition | Inventory exists; food-lot condition does not | Static content must not simulate it |

The required 37 conceptual distinctions are all represented above or as refinements within them: living source; carcass/catch; anatomical part; raw edible and non-edible outputs; cleaned, trimmed, stabilized, preserved, milled, and fermented states; active ferment; ingredient; process aid; starter; preservation input; fuel; cookware; container; storage; intermediate; dish; beverage; medicine; poison; feed; coproduct; byproduct; contamination; spoilage; hazardous residue; ordinary waste; market identity; chain output; recipe output; and runtime item instance.

Specific non-collapses include whole grain / cleaned grain / groats / meal / flour / bran / germ / dough; carcass / cut / mince / offal / fat / bone / stock / dish; whole fish / fillet / roe / liver / oil / skin / shell / offal; milk / cream / skim / butter / buttermilk / curd / whey / fresh cheese / aged cheese; egg / yolk / white / shell / preserved or cooked egg; fruit / juice / must / pomace / syrup / preserve / vinegar / fermented drink; vegetable / dried / pickled / fermented / mash / puree / dish; edible oil / lamp oil / lubricant / binder oil / alchemical oil; food salt / curing salt / technical salt / mineral brine / preserved-food brine; and smoke exposure / smoked food / soot / ash / tar / fuel residue.

## 6. Recipe, Production-Chain, Workplace, And Live-Resolver Authority Audit

### Planned recipe authority

The 12 records have status `planned` and eight families: assembly 1, baking 1, leatherworking 2, metalsmithing 2, milling 1, preserving 1, tailoring 1, and woodworking 3. Three food recipes are exact descriptive transforms:

- `recipe.bread_dough_to_bread_loaf`: `bread_dough` to `bread_loaf`, Bakehouse, `bread_peel`, Cooking, related to `chain.food.bread`.
- `recipe.butchered_meat_to_smoked_meat`: `butchered_meat` plus `salt_crystal` to `smoked_meat`, Smokehouse, Cooking, related to `chain.food.preserved_meat`.
- `recipe.grain_bundle_to_flour`: `grain_bundle` to `flour`, Millhouse, `mill_rake`, Milling, related to `chain.food.flour`.

Their notes explicitly deny runtime, inventory, item creation, storage, reward, and chain inheritance. Thirteen focused validator tests check record shape and reference closure; no current engine or app executes recipes ([recipe schema](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/schemas/crafting/recipe.schema.json), [recipe validator tests](https://github.com/vagabond1215/Lineage_Reforged/blob/master/tests/unit/crafting-recipes-validation.test.mjs)).

### Core chain topology

The 41-chain core has 92 declared stage references but 81 processing steps. Seventeen stage occurrences have no corresponding step:

- `chain.food.bakery_goods`: grain harvest, Millhouse, Butchers Block, Smokehouse.
- `chain.food.berry_preserves`: woodland foraging, Hive Keeper, Sugar Boilers House, Pottery Kiln.
- `chain.food.citrus_marmalade`: orchard, Hive Keeper, Sugar Boilers House.
- `chain.food.preserved_fish`: River Netter, Brine Evaporator.
- `chain.food.preserved_meat`: Trapper, Brine Evaporator, Butchers Block.
- `chain.food.smoked_sausage`: Butchers Block.

All 19 nonempty input arrays occur in food namespace chains. They define parts of pastry, preserve, bread, flour, fresh-cheese, preserved-fish, preserved-meat, and smoked-sausage routes. They do not close all dependencies. For example, the bakery-goods final step consumes pastry dough but not the declared meat, fish, or sausage ingredients; citrus marmalade has no fruit input; and the fresh-cheese route has no whey output.

### Explicit fields, variants, and fallback

`resolveStepInputs` returns variant inputs ahead of a nonempty authored `step.inputs` array when `usesVariantInputs` is true. Six default core steps therefore differ from their explicit arrays:

| Chain / step | Authored input posture | Default live posture |
|---|---|---|
| Sausage-roll baking | `pastry_dough` | sausage link, wheat flour, honeycomb |
| Berry-preserve reduction | cane sugar, honeycomb | blackberry berry |
| Flour milling | grain bundle | wheat seed |
| Preserved fish seasoning | salt crystal | trout meat |
| Preserved meat seasoning | salt crystal | deer meat |
| Smoked sausage seasoning | salt crystal | sausage link plus salt |

Empty inputs first consult broad workplace I/O, then chain fallback. This produces material dependencies that are wider than bounded recipe authority: Butchers Block can select dozens of terrestrial and aquatic inputs at once; Kitchen selects broad protein sets; coffee/cocoa roasting can consume a clay vessel without a source crop; and the Sheepfold can consume cheese curd to output raw milk. Empty extraction outputs resolve to the requested finished target, so ale, wine, and other finished outputs can appear at extraction stages before processing. These are cost/value calculations, not physical item creation, but they remain live consumers.

All 29 empty core outputs return nonempty fallback results. Last-step-only output assembly then hides earlier outputs. `chain.food.bread` returns loaf and hardtack but omits declared `bran`. Nine core variant chains fail to return their requested generic primary: three wine chains, berry preserves, flour, preserved fish, preserved meat, hunting camp, and hunting guild. The generic request instead returns the default source-specific variant.

### Workplace, job, tier, tool, skill, fuel, and cost behavior

The 21 declared core workplaces expose 82 jobs, 65 progression tiers, 69 upgrades, 212 input references, 174 output references, and 122 required-tool-tag occurrences. Every item reference resolves, but relevant job/tier/workforce numbers are empty-object placeholders. The resolver does not select an active job or tier. It unions tool tags from every job, takes missing-tool mode from the primary job, computes `blocked`, and never consumes that flag. Tiers and upgrades are ignored. Fuel is a boolean surcharge input, not a fuel-item relationship or consumption path.

Core chain skill references are overwhelmingly Cooking and also Carpentry, including ale and wine chains whose final coopering stage controls primary skill. The planned flour recipe instead references Milling. Runtime computes time, labor, material, processing, waste, quality, quantity, and explanations from macro-chain data. These are economy calculations; no current owner consumes exact recipe quantities, fuel items, tool items, work queues, or food inventory.

### Evidence relevant to the conditional audit

Gate 5 adds high-confidence evidence for the conditional production-authority audit:

1. Explicit food inputs are overridden by variants in six default steps.
2. Sixty-two core steps have fallback-derived inputs and 29 have fallback-derived outputs.
3. Seventeen declared food stages are skipped entirely by processing-step execution.
4. Important routes can reverse dependencies or select implausibly broad inputs.
5. Nine core generic output requests disagree with returned variants.
6. Last-step output assembly omits an earlier declared food coproduct.
7. The three planned food recipes are not inherited and diverge from live chain inputs/skills/outputs.
8. All-job tool aggregation, unused blocking, placeholder tiers, ignored upgrades, and boolean fuel affect food calculations.
9. The five runtime-economy tests are not food-specific and do not isolate variant override, fallback, skipped stages, generic-output mismatch, or ineffective tool blocking ([focused runtime tests](https://github.com/vagabond1215/Lineage_Reforged/blob/master/tests/unit/civilization-runtime-economy.test.mjs)).

Gate 6 retains the final decision. Gate 5 implements no correction.

## 7. Slaughter, Carcass, Meat, Fat, Bone, Offal, And Stock

**Repository fact.** Canonical fauna output arrays contain many species-specific meat, hide, bone, blood, horn, antler, feather, shell, and other biological identities, while the wider catalog also contains specialized oils, glands, and tissues. Production chains and workplaces contain butchered meat, cuts, trimmings, sausages, smoked meat, stock-like goods, hides, and material destinations. The repository has no general carcass item, slaughter action, edible-offal grade, clean/dirty-zone state, or source-to-cut runtime. Static fauna outputs are possible passive or slaughter outputs; they do not execute slaughter or prove that a tissue is edible.

**External evidence.** Small- and medium-scale meat-processing evidence separates fresh raw material, processing spaces, equipment, hygiene, and cold holding rather than treating an animal as a ready food ([FAO meat-processing technologies](https://www.fao.org/sustainable-food-value-chains/training-and-learning-center/details-materials/en/c/276926/)). Official byproduct evidence distinguishes edible byproducts, inedible recovery streams, rendered destinations, feed/material uses, and managed waste ([FAO animal-product byproducts](https://www.fao.org/4/x6114e/x6114e07.htm)). Peer-reviewed synthesis likewise treats offal and meat byproducts as heterogeneous, with status varying by tissue, culture, handling, and institution rather than biological origin alone ([Toldra et al.](https://doi.org/10.1016/j.meatsci.2012.04.004)).

**Design inference.** A dependency-closed terrestrial lane is live animal -> separately authorized slaughter/recovery boundary -> carcass or named output -> initial separation -> food-intended cut or non-food stream -> cleaned/trimmed stock -> optional mince, preservation, rendering, or stock intermediate -> ingredient -> dish. Blood, fat, bone, hide, organs, intestines, trimmings, smoke residue, wastewater, and rejected tissue remain separately classified. Casings, edible offal, and broth/stock inputs require repository identities and repeated consumers; they cannot be inferred from anatomy. Slaughter execution, contamination state, quantity, loss, and food-safety effects are runtime reservations.

Current chain relationships are incomplete and sometimes fallback-derived. `chain.food.preserved_meat`, `chain.food.smoked_sausage`, the Butchers Block, Smokehouse, Kitchen, and the planned smoked-meat recipe provide partial authority, but they do not jointly establish a bounded carcass-to-dish graph. The live preserved-meat step substitutes a species-specific default input for authored salt, while broad workplace fallback can select many terrestrial and aquatic inputs. Gate 6 must reconcile those authorities before later food recipes rely on them.

## 8. Fish, Shellfish, Aquatic Foods, Roe, Oils, Shells, And Offal

**Repository fact.** The reviewed aquatic core contains 12 fish, 8 mollusks, 4 explicitly aquatic arthropods, and 4 marine mammals, with species-specific outputs already resolving to item and value records. Existing chains cover fishing, preserved fish, some seafood dishes, and material outputs, but there is no general whole-catch, dispatch, gutting, filleting, harvest-area, cold-lot, parasite, toxin, or food-grade owner. `chain.food.preserved_fish` skips declared source and salt stages in live processing, and its default seasoning step replaces authored salt with trout meat.

**External evidence.** Fresh-fish quality begins changing at catch and differs by species and handling ([FAO fresh fish](https://www.fao.org/4/V7180E/V7180E00.htm)); seafood authority must separately consider water and ice quality, parasites, natural toxins, chemical hazards, cross-contamination, storage, and traceability ([FAO seafood safety and quality](https://www.fao.org/4/y4743e/y4743e00.htm)). Live versus raw/shucked bivalves and harvest-area sanitation are distinct authorities ([Codex bivalve molluscs](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/es/?lnk=1&url=https%253A%252F%252Fworkspace.fao.org%252Fsites%252Fcodex%252FStandards%252FCXS%2B292-2008%252FCXS_292e.pdf)); environmental marine toxins may accumulate without a reliable sensory warning ([Farabegoli et al.](https://doi.org/10.3390/md16060188)). No repository shellfish is therefore declared safe merely because it is fresh-looking or canonical.

Roe must remain species-labelled: the international caviar standard is specific to sturgeon identity and treatment, not a generic alias for fish eggs ([Codex sturgeon caviar](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/ua/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+291-2010%2FCXS_291e.pdf)). Fish oils likewise require source and grade distinctions among crude, refined, edible, and technical destinations ([Codex fish oils](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/es/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+329-2017%2FCXS_329e.pdf)); they are unusually oxidation-sensitive ([Miyashita](https://doi.org/10.5650/jos.ess18144)). Fish spoilage is product-specific, and organisms present are not necessarily the organisms driving deterioration ([Gram and Dalgaard](https://doi.org/10.1016/S0958-1669(02)00309-9)).

Heads, shells, skin, bone, viscera, and processing residues can support separate meal, oil, feed, material, or waste lanes, but industrial evidence does not make them edible or appropriate to repository technology ([FAO fish meal and oil](https://www.fao.org/4/X6899E/X6899E00.htm), [Roy et al.](https://doi.org/10.3390/md21090485)). **Design inference:** whole catch -> categorical dispatch/cleaning -> species-specific food cut plus separately routed roe/liver/oil/skin/bone/shell/offal -> stabilized or preserved stock -> ingredient -> dish is the safe authority topology. Exact safety control, cold state, toxin status, and runtime processing remain reserved.

## 9. Grain, Milling, Meal, Flour, Bran, Dough, Bread, Pastry, And Porridge

**Repository fact.** Grain, seed, flour, meal-like goods, doughs, breads, pastries, mills, bakehouses, ovens, and associated tools already have substantial catalog coverage. A distinct porridge identity was not verified. The planned milling recipe says `grain_bundle` -> `flour` with Milling at the Millhouse; the live flour chain defaults to `wheat_seed`, while the nonvariant bread chain returns final bread outputs but omits its declared `bran`. `chain.food.bakery_goods` declares upstream harvest, milling, butchery, and smoking stages that no processing step executes. These are authority conflicts, not permission to choose a preferred formula.

**External evidence.** Wheat handling separates threshing, cleaning, drying, storage, milling, and byproduct streams ([FAO wheat post-harvest](https://www.fao.org/fileadmin/user_upload/inpho/docs/Post_Harvest_Compendium_-_WHEAT.pdf)). Small mills make hulling, meal, flour, power, site, dust control, maintenance, and storage separately relevant ([FAO small mills](https://www.fao.org/fileadmin/user_upload/ags/publications/J8482E.pdf)). Flour identity depends on separation and treatment of grain fractions and cannot silently stand for whole grain, bran, or germ ([Codex wheat flour](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+152-1985%2FCXS_152e.pdf)). Archaeological evidence demonstrates ground cereal or tuber preparation and bread-like foods at one site, not a universal recipe ([Arranz-Otaegui et al.](https://doi.org/10.1073/pnas.1801071115)); pottery residues can support water-cooked cereal or malt-related processing while remaining site-specific inference ([Kubiak-Martens et al.](https://doi.org/10.1371/journal.pone.0296986)).

**Design inference.** Seed stock, food grain, cleaned grain, dehusked grain, groats, meal, flour, bran, germ, dough, batter, porridge, bread, pastry, and any noodle-like identity are distinct nodes. A closed route needs canonical crop/source, harvest handoff, cleaning and stabilization, mill fraction output, food-safe water, optional starter/leavening authority, cookware or oven, fuel/heat, workplace, storage, and destinations for bran/dust/damaged stock. Noodles or analogous staples should not be promoted without current canon and repeated consumers. Exact grind fractions, leavening behavior, baking state, quantities, and consumption effects remain unauthorized.

## 10. Legumes, Roots, Tubers, Vegetables, Fungi, And Plant Foods

**Repository fact.** Canonical flora and food catalogs include legumes, roots, vegetables, fungi, herbs, pickled/dried plant foods, and prepared dishes, but source-output presence does not prove edibility, necessary treatment, or an exact dish relationship. Four flora records are typed fungi; none has a planned recipe consumer. The live catalog has no generic food-safety treatment or identification owner.

**External evidence.** Dry pulses have whole, shelled, and split identities with storage-quality dependencies ([Codex pulses](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+171-1989%2FCXS_171e.pdf)). Root and tuber evidence separates living perishable roots from cured/stored stocks and chip, flour, grit, or bread routes, with crop-specific hazards that cannot be generalized ([FAO roots and tubers](https://www.fao.org/4/x5415e/x5415e00.htm)). Horticultural handling makes sorting, cleaning, containers, water, climate, and crop-specific storage meaningful ([FAO small-scale horticultural handling](https://www.fao.org/4/ae075e/ae075e00.htm)). Dried-fungi standards require species identity and distinguish fresh/dried condition, defects, and contamination; drying does not establish edibility ([Codex dried fungi](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+39-1981%2FCXS_039e.pdf)).

**Design inference.** Each lane needs canonical plant/fungus source -> harvest output -> crop-specific cleaning/shelling/peeling or trimming -> any required stabilization or hazard-aware preparation -> ingredient or preservation route -> dish, with peels, husks, cooking water, damaged pieces, and rejects separately dispositioned. Soaking, sprouting, fermenting, grinding, drying, roasting, boiling, mashing, and pickling are optional relationships, not universal sequential steps. Toxin removal, lookalike identification, antinutritional effects, and player health effects remain prohibited runtime/safety claims.

## 11. Fruits, Nuts, Honey, Sweeteners, Syrups, Preserves, And Pressed Products

**Repository fact.** Canon contains fruits, berries, citrus, honeycomb/honey-facing goods, sugar routes, pressed or preserved goods, beverages, oils, and pomace-like byproducts. The live berry-preserve step replaces its authored cane-sugar and honeycomb inputs with a default berry, while citrus marmalade has no fruit input in the executed step sequence. Chain presence therefore does not provide a closed preserve recipe.

**External evidence.** Fruit processing distinguishes sorting, washing, pressing, pulping, drying, preserving, containers, water, equipment, and scale ([FAO fruit and vegetable processing](https://www.fao.org/4/V5030E/V5030E00.htm)). Fruit, juice, puree, concentrate, and nectar are distinct product identities ([Codex fruit juices and nectars](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+247-2005%2FCXS_247e.pdf)); jam, jelly, marmalade, fruit forms, and sweeteners are likewise not interchangeable ([Codex jams and jellies](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+296-2009%2FCXS_296e.pdf)).

Honey is bee-made and distinct from plant syrup or refined sugar, with comb, extracted, and pressed presentations requiring separate handling ([Codex honey](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+12-1981%2FCXS_012e.pdf)); comb and wax remain separable coproducts ([FAO value-added bee products](https://www.fao.org/4/w0076e/w0076e00.htm)). Tree-sap syrup needs a suitable canonical tree, seasonal collection, concentration, fuel/equipment, and storage rather than a generic `sap` substitution ([Cornell Maple Program](https://blogs.cornell.edu/cornellmaple/aboutmaplesyrup/)). Nuts require species-, climate-, harvest-, drying-, and storage-aware handling and retain contamination risk ([Codex tree-nut code](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXC+59-2005%2FCXC_059e.pdf)).

**Design inference.** Fruit/berry/nut or bee/tree source -> harvested raw output -> sorting/cleaning/shelling -> juice, puree, meal, pressed liquid, or clarified sweetener intermediate -> preserve, syrup, oil, vinegar, beverage, ingredient, or dish is a family of alternate routes, not one chain. Pits, skins, shells, pomace, comb, wax, press cake, scum, spent matter, and contaminated stock require separate feed/material/waste review. Sweetener identity and preservation function require exact recipe authority; neither sweetness nor biological origin proves safe preservation.

## 12. Milk, Dairy, Eggs, Curds, Whey, Butter, And Cheese

**Repository fact.** Fauna outputs include milk- and egg-facing identities, but producing-state issues from Gates 2-3 remain unresolved. Catalog entries include `cream` and `fresh_cheese` with an unresolved `spoilage.dairy_fresh` string but no live spoilage catalog or owner. The fresh-cheese macro route can fall back from `cheese_curd` to raw milk at the Sheepfold, reversing a plausible dependency; it does not author a whey output. No planned dairy or egg recipe exists.

**External evidence.** Village-scale evidence supports processing near milk production, collection pressure, hygiene/water dependencies, and cheese, butter, and fermented goods as differentiated outputs ([FAO village milk processing](https://www.fao.org/4/t0045e/T0045E01.htm)). Milk can branch through separation toward cream/butter and through coagulation toward curd plus whey ([FAO milk producer groups](https://www.fao.org/sustainable-food-value-chains/training-and-learning-center/details-materials/en/c/276966/)). Cheese identity includes coagulation, whey drainage, and ripened/unripened distinctions ([Codex cheese](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+283-1978%2FCXS_283e.pdf)); butter is a milk-derived fatty emulsion, not generic milk, cream, animal fat, or oil ([Codex butter](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/es/?lnk=1&url=https%253A%252F%252Fworkspace.fao.org%252Fsites%252Fcodex%252FStandards%252FCXS%2B279-1971%252FCXS_279e.pdf)).

Milk can carry pathogens, spoilage organisms, and beneficial fermenters, with contamination before or after processing ([Boor et al.](https://doi.org/10.3168/jds.2017-12969)). Egg authority must separately address contamination during formation and after laying, plus shell handling, collection, storage, transport, and any processing ([Codex eggs and egg products](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/es/?lnk=1&url=https%253A%252F%252Fworkspace.fao.org%252Fsites%252Fcodex%252FStandards%252FCXC%2B15-1976%252FCXC_015e.pdf)).

**Design inference.** Producing animal/state -> milk collection or egg recovery -> source-labelled raw output -> hygienic handoff -> milk separation or coagulation/culture branch, or egg shell/yolk/white/whole branch -> cream, skim, butter, buttermilk, curd, whey, fresh/aged cheese, preserved/cooked egg, ingredient, or dish. Every branch is conditional on canonical source, food-safe authority, vessel, water, workplace, storage, and exact transformation. Culture identity, maturation, contamination, cold state, shell condition, yield, and consumption effect remain unowned.

## 13. Fats, Oils, Rendering, Frying, Lighting, Soap, And Industrial Boundaries

**Repository fact.** Items and biological outputs use fat, tallow, oil, wax, lamp, lubricant, binder, fuel, alchemy, and food-facing vocabulary, but roles and branches do not establish grade. `snail_shell`, `sausage_coil`, `quicklime`, `mineral_brine`, and similar noisy records show why names and tags cannot safely infer destination. No generic frying, rendering, soap-making, or oil-lot runtime exists.

**External evidence.** Named edible animal fats are source- and tissue-specific and must remain separate from industrial grease ([Codex named animal fats](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/hu/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+211-1999%2FCXS_211e.pdf)). Named vegetable oils depend on source identity and meaningful virgin, cold-pressed, or refined grade distinctions ([Codex named vegetable oils](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/zh/?lnk=1&url=https%253A%252F%252Fworkspace.fao.org%252Fsites%252Fcodex%252FStandards%252FCXS%2B210-1999%252FCXS_210e.pdf)). Small-scale oilseed evidence separates cleaning, pressing, settling/filtering, storage, and possible food versus fuel/industrial destinations without making all repository seeds suitable ([Northeast SARE oilseed processing](https://northeast.sare.org/resources/small-scale-oilseed-processing-guide/)).

**Design inference.** Each fat/oil requires canonical biological or plant source, tissue/seed output, initial cleaning or rendering/pressing relationship, grade decision, vessel and storage compatibility, and a declared consumer. Edible fat/oil, frying medium, lamp oil, lubricant, binder, soap input, alchemical oil, technical grease, wax, press cake, cracklings, sludge, wastewater, ash, and spent medium remain distinct. Reuse, degradation, smoke, fire, caustic soap chemistry, and contamination are runtime or safety reservations, not static recipe claims.

## 14. Salt, Brine, Sugar, Acid, Smoke, Drying, Pickling, And Combined Preservation

**Repository fact.** Salt crystals, mineral brine, sugars, honey, smokehouses, dried/smoked/salted foods, pickling-facing vocabulary, fuels, casks, jars, and preservation chains exist, but no static grade field or mutable preservation state links them. A distinct canonical pickled-food state was not verified. `mineral_brine` carrying a fuel role and the preserved-meat/fish variant substitutions demonstrate that a named material or explicit step input may not match live resolution. A preserved identity is not proof of indefinite safety.

**External evidence.** Food-grade salt can derive from sea, rock, or brine but must remain distinct from raw or technical salt ([Codex food-grade salt](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+150-1985%2FCXS_150e.pdf)). Multiple sugar identities differ from honey, sap, syrup, and molasses ([Codex sugars](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+212-1999%2FCXS_212e.pdf)). Pickling can be fermented or acidified and can use different packing media; these are not interchangeable routes ([Codex pickled produce](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+260-2007%2FCXS_260e.pdf)).

Smoking, smoke flavouring, and smoke-drying are distinct even within fish processing ([Codex smoked fish](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+311-2013%2FCXS_311e.pdf)). Fuel, combustion, smoke contact, airflow, and ventilation affect contamination posture ([Codex smoking and direct-drying code](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXC+68-2009%2FCXC_068e.pdf)). Dry foods still need dry-zone, container, storage, cleaning, and recontamination controls ([Codex low-moisture foods](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXC+75-2015%2FCXC_075e.pdf)); low moisture can permit microbial persistence and does not itself prove safety ([FAO/WHO low-moisture review](https://www.who.int/publications/i/item/9789240044036)). General hygiene evidence supports clean water, process-flow separation, storage, personnel, and site layout as distinct dependencies ([Codex food hygiene](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXC+1-1969%2FCXC_001e.pdf)).

**Design inference.** Raw food -> cleaned/stabilized food -> one or more explicitly compatible salt/brine, sweetener, acid, smoke, drying, or fermentation relationships -> preserved identity -> condition-appropriate container/storage is the topology. Combined methods require authored compatibility; the report supplies no preservation formula or control parameter. Food salt, curing input, technical salt, mineral brine, used brine, edible acid, vinegar, smoke exposure, smoked food, soot, ash, tar, fuel residue, and contaminated waste remain separate.

## 15. Fermentation, Malting, Brewing, Beverages, Vinegar, And Cultured Foods

**Repository fact.** The catalog and macro chains contain ale, wines, casks, infusions, coffee/cocoa-facing routes, brewing, sugar, vinegar-like or fermented goods, malt-facing vocabulary, and culture-adjacent processes. The 21 beverage items include cask and infusion subbranches, while the 41-chain core includes 10 beverage and 1 brewing chain. Empty extraction outputs can emit a finished beverage before its declared brewery stage; wine variants can ignore a generic target; coffee/cocoa fallback can consume a clay vessel without a source crop. There is no active-ferment, starter, mash, alcohol-strength, contamination, vessel-condition, or beverage-production runtime.

**External evidence.** Fermented cereal traditions can involve cleaning, milling, cooking, starter or saccharification, dough, porridge, bread, and beverage variants, with no universal sequence ([FAO fermented cereals](https://www.fao.org/4/x2184e/x2184e00.htm)). Fruit and vegetable fermentation distinguishes lactic, alcoholic, acetic, and mold-associated routes and their brining, pickling, or vinegar products ([FAO fermented fruits and vegetables](https://www.fao.org/4/x0560e/x0560e00.htm)). Fermented milk requires a distinct cultured-product and starter-status authority ([Codex fermented milks](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+243-2003%2FCXS_243e.pdf)).

Archaeological evidence supports site-specific combinations of malting/brewing tools, mixed substrates, vessels, and hearth context ([Wang et al.](https://doi.org/10.1073/pnas.1601465113)) and mixed cereal, fruit, and honey fermentation residues ([McGovern et al.](https://doi.org/10.1073/pnas.0407921102)); neither authorizes a repository formula. Modern extension guidance reinforces the distinction between lactic vegetable fermentation, acetic fermentation, and vinegar, with container and sanitation dependencies ([University of Minnesota fermentation guidance](https://extension.umn.edu/preserve-your-own-food/fermentation)). Historic maltings separate cleaning, steeping, germination, kilning, and storage and require space, ventilation, fuel, transport, and scale ([Historic England maltings](https://historicengland.org.uk/images-books/publications/maltings/)). Kimjang evidence shows a fermented-vegetable practice shaped by season, climate, community, region, and ingredients ([UNESCO Kimjang](https://ich.unesco.org/en/RL/kimjang-making-and-sharing-kimchi-in-the-republic-of-korea-00881?RL=00881&lang=en)); it demonstrates variation, not repository canon.

**Design inference.** Canonical substrate -> cleaned/milled/pressed or otherwise prepared stock -> mash, must, wort, dairy substrate, or vegetable intermediate -> explicitly authorized starter/process environment -> active ferment -> separated, conditioned, acidified, cultured, or finished beverage/food -> cask/jar/bottle/storage is a branching graph. Spent grain, lees, pomace, cultures, vinegar mother-like material, wastewater, spoiled batches, and hazardous contamination remain separate. Instant fermentation, automatic detoxification, alcohol distillation, exact strength, and any operational formula are excluded.

## 16. Herbs, Spices, Sauces, Condiments, Broths, Stocks, And Compound Foods

**Repository fact.** Canon contains herbs, aromatics, spices, salts, sauces, broths/stocks, soups, stews, teas/infusions, medicine, alchemy, poison, and reagent identities, but catalog adjacency does not transfer authority among them. `tea_ceremony` appearing as a chain byproduct and semantically mismatched consumption links illustrate that compound-food meaning cannot be inferred from a secondary-output slot or profile name.

**External evidence.** Plant-material processing requires identity, cutting/cleaning, drying, storage, and contamination controls, but medicinal-herb guidance does not prove culinary suitability or effect ([WHO herbal processing](https://www.who.int/docs/default-source/medicines/norms-and-standards/guidelines/production/trs1010-annex1-herbal-processing.pdf)). Fermented fish sauce is a derived condiment distinct from fish, brine, and broth and requires its own species/process authority ([Codex fish sauce](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+302-2011%2FCXS_302e.pdf)). Liquid, concentrated, and dehydrated bouillon forms also preserve different protein, water, seasoning, and fat relationships ([Codex bouillons](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+117-1981%2FCXS_117e.pdf)).

**Design inference.** Named botanical/anatomical source and food-grade identity must precede culinary use. Herb/spice -> cleaned/dried/ground ingredient; bone/meat/fish/vegetable -> stock or broth; fruit/vegetable/fish/dairy substrate -> sauce or condiment; and multiple ingredients -> soup, stew, pastry, ration, or meal each need exact bounded relationships. Culinary, medicinal, toxic, alchemical, ritual, and lore-only destinations remain separate. Taste, potency, nutrition, healing, poison, and status effects remain outside this gate.

## 17. Storage, Cellars, Granaries, Smokehouses, Dairies, Kitchens, Mills, Presses, And Breweries

**Repository fact.** Twenty-two buildings include seven storage-bearing buildings and eight profiles: two each for granary, cellar, warehouse, and vault. Settlement simulation gives all 88 settlements abstract capacity, load, utilization, type, and supported-goods posture, including fallback storage. It does not store perishable item lots, enforce commodity compatibility, or track seals, moisture, pests, ventilation, drainage, temperature, contamination, age, or opening. Fifty-eight workplaces include mills, kitchens, smokehouses, dairies, presses, breweries, kilns, and source-facing sites, but four gathering workplaces have empty static I/O and core jobs/tiers remain placeholder-rich.

**External evidence.** Cold delays fish quality loss but cannot restore poor raw material and remains product/handling dependent ([FAO refrigerated fisheries storage](https://www.fao.org/4/v3630e/v3630e00.htm)). A documented icehouse ties subterranean seasonal ice storage to ponds, labor, wealth, and estate status rather than universal access ([Historic England Hanbury Hall icehouse](https://historicengland.org.uk/listing/the-list/list-entry/1019500)). A partly underground produce cellar demonstrates passive cool holding for durable crops, not safe storage for every food ([National Park Service Oxon Hill root cellar](https://www.nps.gov/places/000/oxon-hill-root-cellar.htm)).

Mills depend on power source, gearing, buildings, access, period, and use ([Historic England mills](https://historicengland.org.uk/images-books/publications/iha-mills/heag212-mills/)). Brewing facilities distinguish malt, grist, mash, wort, fermentation, storage, water, heat, vessels, casks, transport, and specialist spaces ([Historic England brewing industry](https://historicengland.org.uk/images-books/publications/brewing-industry/bhs-brewing-ind-shier/)). Living flatbread traditions show varied ovens, plates, cauldrons, coordinated labor, and household versus bakery scale ([UNESCO flatbread culture](https://ich.unesco.org/en/RL/flatbread-making-and-sharing-culture-lavash-katyrma-jupka-yufka-01181?RL=01181)); Belgian beer culture shows institution, training, water, reuse, regional style, and production-scale variation ([UNESCO Belgian beer culture](https://ich.unesco.org/en/RL/beer-culture-in-belgium-01062?RL=01062)). Small rural food-industry evidence makes workplace flow, clean water, ventilation, containers, fuel, equipment, maintenance, packaging, and scale distinct dependencies ([FAO small-scale food quality assurance](https://www.fao.org/4/v5380e/v5380e00.htm)).

**Design inference.** Granary, cellar, smokehouse, dairy, kitchen, mill, press, brewery, icehouse, warehouse, and transport container are capabilities with different goods, utilities, airflow, drainage, pest, heat, cold, labor, maintenance, and failure needs. Existing building/workplace IDs control exact canon. A future lot/condition owner must integrate, not overwrite, aggregate settlement storage.

## 18. Food Safety, Spoilage, Contamination, Toxins, And Static-Versus-Runtime Boundary

**Repository fact.** The `perishable` tag appears on 144 item records and two item strings reference an absent dairy spoilage profile, but inventory stacks contain only id/key/quantity. There is no lot, freshness, spoilage, contamination, pathogen, disease, temperature, water-quality, toxin, harvest-area, or food-grade runtime. Current body-state consumption applies real nutritional/hydration/intoxication consequences, but that does not make item-profile links semantically correct or supply safety state.

**External evidence.** Pathogens, parasites, viruses, and natural toxins are distinct hazards across meat, seafood, dairy, eggs, and plants; visible spoilage is not a complete safety test ([FDA Bad Bug Book](https://www.fda.gov/food/foodborne-pathogens/bad-bug-book-second-edition)). Spoilage ecology varies by food and can arise from raw materials, equipment, environments, and post-process contamination; sensory deterioration and safety remain different questions ([Snyder, Martin, and Wiedmann](https://doi.org/10.1038/s41579-024-01037-x)). Natural toxins can arise from molds, plants, algae, or food-chain accumulation and may persist without sensory warning, while local prevalence still requires source/ecology evidence ([WHO natural toxins in food](https://www.who.int/news-room/fact-sheets/detail/natural-toxins-in-food)).

**Static boundary.** Static content may identify a food, ingredient, container, process relation, preservation family, workplace capability, and qualitative caution when repository authority supports it. It must not claim that a batch is safe, fresh, contaminated, spoiled, cooked, cured, cold, or detoxified.

**Runtime reservation.** Lot identity, condition, time, temperature, moisture, opening, contamination, toxin exposure, pest damage, storage compatibility, processing action, fuel/water use, item mutation, inventory consumption, health effect, persistence, and player-facing warnings need a dedicated validated runtime owner. Gate 5 supplies no thresholds or executable guidance.

## 19. Dependency-Closed Source-To-Finished Food Matrix

`Absent` means no reviewed canonical identity or owner was found; it does not authorize creating one. Capability words such as cleaning, cooling, drainage, or contamination control identify dependencies only.

### Terrestrial meat, carcass, cuts, offal, and stock

- **Source through finished food:** source = canonical fauna or separately reviewed monster output; raw output = species meat/hide/bone/blood and related outputs; initial preparation = hunting/butchery implication only; cleaned form = absent; stabilized form = absent; preserved form = smoked/salted/dried meat identities; intermediate = butchered meat, cuts, trimmings, sausage link; ingredient = declared meat/salt identities only; finished = stews, roasts, platters, pastries, rations. No general carcass, offal, intestine, stock, or broth owner exists.
- **Secondary destinations:** coproduct/byproduct = blood, bone, hide, drippings, trimmings where declared; feed = absent; material = hide/bone and explicitly routed outputs; ordinary waste = absent; hazardous residue = absent. A chain byproduct is not waste or edible authority.
- **Enablers:** tools = hunting/skinning/butcher/curing/smoking/kitchen tags; cookware = cooking pot and ladle; containers = no food-lot/casing owner; workplaces = Hunters Camp, Butchers Block, Smokehouse, Kitchen, Inn, Tavern; infrastructure = site/shop/service descriptions only; heat/fuel = fuel-heavy metadata and boolean surcharge; water/ventilation/cold = absent; storage = abstract settlement profiles; scale = authored tier prose not selected by runtime.
- **Authority:** live chains = hunting, butchery, sausage, preservation, kitchen/service routes; recipe = only `recipe.butchered_meat_to_smoked_meat`; runtime = economic calculation, no inventory production; disposition = preserve sources and reserve resolver correction; later gate = Gate 6 production authority, integration identity/safety.

### Fish, shellfish, aquatic foods, roe, oils, shells, and offal

- **Source through finished food:** source = canonical fish/mollusk/aquatic arthropod/marine mammal; raw output = uneven species meat/roe/liver/oil/skin/scale/bone/scute/ink/shell; initial preparation = fishing/extraction implication; cleaned form and stabilized form = absent; preserved = species/generic smoked or salted foods; intermediate/ingredient = raw fish/species meat where declared; finished = seafood stew, fish plate, preserved foods. Whole catch, fillet, and generic cleaned-fish identities are absent.
- **Secondary destinations:** coproduct/byproduct = species bones, scales, skins, shells, liver, oil, ink, drippings; feed = absent; material = only explicit shell/skin/bone/oil consumers; ordinary waste and hazardous residue = absent. `snail_shell` and `river_reed` are noise requiring collision review.
- **Enablers:** tools = fishing/extraction, smoking, fire, and kitchen tags; cookware = pot/ladle; containers = no catch-lot/cold-box owner; workplaces = Riverbank Gatherers, Smokehouse, Kitchen, Tavern; infrastructure = source/workplace descriptions; heat/fuel = qualitative/boolean; water = source context, not wash state; ventilation/cold = absent; storage = abstract cellar/warehouse; scale = unselected.
- **Authority:** live chains = riverside and preserved-fish routes; recipe = absent; runtime = macro economy only; disposition = reserve variant/fallback correction and source-to-cleaned relationships; later gate = Gate 6, Gate 7 for magical cold, integration for identities.

### Grain, milling, meal, flour, bran, dough, bread, pastry, and porridge

- **Source through finished food:** source = canonical grain flora/extraction; raw output = grain bundle, grain, species seeds; initial preparation = harvest/thresh/clean implications; cleaned form/groats = absent; stabilized = stored grain only as inference; preserved = hardtack; intermediate = flour variants, flour, bran, doughs; ingredient = exact recipe inputs; finished = loaf, hardtack, pies, rolls, pastries. Distinct porridge, batter, noodle, and grain-meal identities were not verified.
- **Secondary destinations:** coproduct/byproduct = bran and straw bundle; feed = absent; material = straw where explicitly classified; ordinary waste = no chaff/spoiled-grain identity; hazardous residue = no contaminated flour/dust owner.
- **Enablers:** tools = mill rake, winnowing set, bread/oven peel; cookware = no general dough bowl or porridge vessel owner; containers = bundle/sack terms are not instances; workplaces = Millhouse, Bakery, Bakehouse; infrastructure = mill drive/oven descriptions; heat/fuel = baking metadata/boolean fuel; water/ventilation/cold = absent; storage = abstract granary; scale = tier prose only.
- **Authority:** live chains = flour, bread, bakery goods/specials; recipes = grain-to-flour and dough-to-loaf; runtime = chain economics only; disposition = preserve bounded recipes and flag live conflicts/omitted bran; later gate = Gate 6 and integration.

### Legumes, roots, tubers, vegetables, fungi, and plant foods

- **Source through finished food:** source = canonical flora, including four fungus records; raw output = species plant/fungal outputs and generic raw herbs/caps; initial preparation = mixed-crop/foraging implication; cleaned, trimmed, stabilized, preserved, puree, cooked vegetable states = generally absent; intermediate/ingredient = only exact catalog/chain identities; finished = only specifically canonical dishes. No bounded recipe closes this lane.
- **Secondary destinations:** coproduct/byproduct = bark, fiber, mycelium, spores, compost-facing vocabulary where explicit; feed = absent; material = explicit plant-fiber/extract routes only; ordinary waste = absent; hazardous residue = no unsafe-fungus or contaminated-water owner.
- **Enablers:** tools = foraging knife and transport/kitchen capability; cookware = pot/ladle; containers = absent as lots; workplaces = Gatherers Hut, Garden Plots, Kitchen and tea services; infrastructure = generic capability only; heat/fuel/water/ventilation/cold = unowned for lots; storage = abstract cellar/cool-cellar prose; scale = unselected.
- **Authority:** live chains = mixed crop and wild harvest, heavily fallback-derived; recipe = absent; runtime = macro economy only; disposition = treat food/preparation links as missing, never infer fungal edibility; later gate = Gate 6/integration.

### Fruits, nuts, honey, sweeteners, syrups, preserves, and pressed products

- **Source through finished food:** source = canonical flora and bee/source extraction; raw output = fruit, berry, nut, honeycomb, cane, coffee/cacao identities; initial preparation = orchard/forage/hive implications; cleaned/stabilized = absent; preserved = jars, marmalade, candied product; intermediate = preserve base, fruit must, juice/puree only where canonical; ingredient = named fruit/sugar/honey; finished = preserves, syrups, cider/wine, coffee/cocoa outputs. Generic dried fruit, juice, and vinegar were not verified as owned states.
- **Secondary destinations:** coproduct/byproduct = pomace, husks, cocoa butter, molasses, bagasse, wax; feed = absent; material = only explicit bagasse/wax/residue uses; ordinary waste and hazardous residue = absent.
- **Enablers:** tools = preserving/boiling kettles, wax stamp, roasting drums, press/cellar/cooper tags; cookware = kettles; containers = limited clay-vessel/cask inputs and product jars, no lot system; workplaces = Preservers Hearth, Roasters Kilnhouse, Sugar Boilers, Vintner Press, Coopers Shop, Bakery, Pottery Kiln; infrastructure = workplace descriptions; heat/fuel = qualitative/boolean; water/ventilation/cold = absent; storage = abstract cellar/warehouse; scale = ignored tiers.
- **Authority:** live chains = preserves, marmalade, sugar, cider/wine, coffee/cocoa; recipe = absent; runtime = macro economy; disposition = source/container/food-grade closure required and fallback corrections reserved; later gate = Gate 6/integration.

### Milk, dairy, eggs, curds, whey, butter, and cheese

- **Source through finished food:** source = canonical producing fauna/state where actually supported; raw output = species milk/eggs and generic raw milk; initial preparation/cleaned/stabilized = absent; preserved = no owned aged/preserved state; intermediate = cheese curd; ingredient = exact milk/egg identity only; finished = cream/fresh cheese and any specifically canonical dish. Skim milk, butter, buttermilk, whey, aged cheese, yolk, white, shell, and preserved/cooked egg identities were not verified.
- **Secondary destinations:** coproduct/byproduct = cream/wool in current chain/workplace posture; whey/egg shell = absent; feed/material/ordinary waste/hazardous residue = absent unless independently explicit.
- **Enablers:** tools = husbandry, basket/transport, kitchen tags; cookware = pot/ladle; containers = no dairy/egg lot, churn, or aging-vessel owner; workplaces = Sheepfold and Kitchen; infrastructure = absent beyond descriptions; heat/fuel/water/ventilation/cold = no batch state; storage = abstract cellar; scale = unowned.
- **Authority:** live chain = fresh cheese with reversed fallback dependency; recipe = absent; runtime = macro economy and separate body-state consumption only; disposition = preserve producing-state blocker and unresolved spoilage strings; later gate = Gate 6/integration.

### Fats, oils, rendering, frying, lighting, soap, and industrial boundaries

- **Source through finished food:** source = canonical animal tissue/fish/seed/fruit/bee source; raw output = named oils, drippings, fat- or wax-facing outputs; initial preparation = rendering/pressing implication only; cleaned/stabilized/preserved edible grades = absent; intermediate = cocoa butter/rendered tallow only in their authored roles; ingredient/finished food = no generic food-grade oil or frying-fat owner.
- **Secondary destinations:** coproduct/byproduct = drippings, pomace, husks, wax, press-facing residues; feed = absent; material = explicit lighting/binder/soap/alchemy consumers only; ordinary waste = absent; hazardous residue = no spent oil/grease owner.
- **Enablers:** tools/cookware = pots, ladles, drums, press capability; containers = no food-oil lot owner; workplaces = Kitchen, Roasters, presses, chandlery/soap-facing sites; infrastructure = descriptive; heat/fuel = qualitative/boolean; water/ventilation/cold/storage/scale = unowned or abstract.
- **Authority:** live chain = limited cocoa/service/material calculations; recipe = absent; runtime = no rendering/frying/soap execution; disposition = preserve edible/technical/alchemical grade separation; later gate = Gate 6/integration.

### Salt, brine, sugar, acid, smoke, drying, pickling, and combined preservation

- **Source through finished food:** source = canonical mineral/plant/bee/fuel source; raw output = salt crystal/salt, sugar/honey, smoke-producing fuel; initial preparation and cleaned food = lane-specific; stabilized/intermediate = preserve base and only exact brines/acids; preserved = dried/salted/smoked foods, hardtack, preserves; ingredient = named exact preservation inputs; finished = specific preserved products. Food brine, pickled-food, vinegar, curing grade, and generic acid identities are absent or unverified.
- **Secondary destinations:** coproduct/byproduct = drippings, reeds, wax, syrup, pomace, husks, molasses, bagasse, bone/blood/hide where declared; feed = absent; material = explicit only; ordinary waste = no spent brine/ash/soot owner; hazardous residue = absent.
- **Enablers:** tools/cookware = curing/smoking racks, fire striker, preserving/boiling kettles, skimmer, wax stamp; containers = limited cask/clay-vessel/product jars; workplaces = Preservers, Smokehouse, Sugar Boilers, Kitchen, Bakery, Kiln; infrastructure = qualitative; heat/fuel = boolean surcharge; water/ventilation/cold = absent; storage = abstract; scale = ignored tiers.
- **Authority:** live chains = meat/fish preservation, sausage, preserves, marmalade, bread, sugar; recipe = only bounded smoked-meat recipe; runtime = macro economy; disposition = correct variant/fallback only after Gate 6, retain food-grade blockers; later gate = Gate 6/integration.

### Fermentation, malting, brewing, beverages, vinegar, and cultured foods

- **Source through finished food/drink:** source = canonical grain, fruit, honey, tea, coffee/cacao, milk; raw output = exact source outputs; initial preparation/cleaned/stabilized = incompletely represented; preserved = finished fermented/cask goods where canonical; intermediate = fruit must and only exact mash-like identities; ingredient = named substrates; finished = ale, cider, wine variants, teas, coffee/cocoa products. Starter, active ferment, malt, cultured-food state, vinegar, and distilled/concentrated alcohol are absent.
- **Secondary destinations:** coproduct/byproduct = spent mash, pomace, pitch seal, husks, ceremony record; feed = absent; material = only explicit residue roles; ordinary waste and hazardous residue = no contaminated/spoiled-batch owner.
- **Enablers:** tools = kettles, malting rake, drums, press/cellar/testing/bottling/cooper/service tags; cookware = process vessels; containers = cask/clay vessel, no batch condition; workplaces = Brewery, Vintner Press, Coopers, Roasters, Tea House, Inn/Tavern; infrastructure = descriptive; heat/fuel = macro cost only; water/ventilation/cold = absent; storage = abstract cellar; scale = ignored tiers.
- **Authority:** live chains = ale, cider, wine, coffee/cocoa, tea; recipe = absent; runtime = macro economy only; disposition = reserve pre-final output and generic-target conflicts; later gate = Gate 6, Gate 7 for bounded magic, integration.

### Herbs, spices, sauces, condiments, broths, stocks, and compound foods

- **Source through finished food/drink:** source = canonical flora/fauna; raw output = exact herbs/spices/meat/bone/vegetable; initial preparation = foraging/butchery implications; cleaned/stabilized/preserved = only named records; intermediate/ingredient = herbs, tea blend, doughs, exact food inputs; finished = specific teas, stews, pies, platters, rations, meals. Generic sauce, condiment, broth, stock, and puree ownership was not verified.
- **Secondary destinations:** coproduct/byproduct = drippings plus some finished dishes in secondary-output fields; feed/material/ordinary waste/hazardous residue = absent unless separately explicit.
- **Enablers:** tools = foraging/reference/kitchen/serving tags; cookware = knife, pot, ladle, kettle; containers = no sauce/stock lot owner; workplaces = Gatherers, Kitchen, Bakery, Tea House, Inn, Tavern; infrastructure = descriptive; heat/fuel/water/ventilation/cold/storage/scale = qualitative or absent.
- **Authority:** live chains = harvest, service, bakery, kitchen, preserves; recipe = no planned compound-food recipe; runtime = economy plus separately owned profile/body-state path; disposition = preserve culinary/medicine/poison separation and profile-link issues; later gate = Gate 6/integration.

Across every lane, a missing source, producing state, food-grade decision, tool, vessel, workplace, fuel, water, ventilation, storage, or consumer is a blocker, not an invitation to let chain fallback invent dependency closure.

## 20. Technology Compatibility Without A Century Label

Food technology should be evaluated by capability rather than an asserted century:

1. **Household or subsistence:** portable/domestic tools, direct hearth or ambient processing, small stores, household knowledge, and limited specialization.
2. **Village or ordinary town craft:** shared mills, ovens, presses, smokehouses, dairies, or brewhouses with repeatable maintenance and local supply.
3. **Urban specialist:** dedicated rooms, specialist vessels, controlled workflow, trained labor, and broader market access.
4. **Institutional:** guild, temple, academy, military, estate, or major-merchant support with sustained procurement, storage, repair, and oversight.
5. **Elite, strategic, or capital-scale:** extensive transport, specialist construction, storage networks, dependable fuel and water, and coordinated labor.
6. **Rare, exceptional, relic, or legendary:** scarce infrastructure or knowledge whose access, maintenance, failure, and security stay explicit.

Compatibility tests should ask whether canonical source material, preparation state, food-grade inputs, water, fuel, heat, airflow, drainage, cold, storage, containers, tools, maintenance, skill, transport, waste handling, and an operating institution all exist. Mill, maltings, and brewing evidence shows that short process labels conceal building, power, utility, vessel, and transport dependencies ([Historic England mills](https://historicengland.org.uk/images-books/publications/iha-mills/heag212-mills/), [Historic England maltings](https://historicengland.org.uk/images-books/publications/maltings/), [Historic England brewing industry](https://historicengland.org.uk/images-books/publications/brewing-industry/bhs-brewing-ind-shier/)). Small scale still requires siting, cleaning, storage, repair, and operator competence ([FAO small mills](https://www.fao.org/fileadmin/user_upload/ags/publications/J8482E.pdf), [FAO small-scale food quality assurance](https://www.fao.org/4/v5380e/v5380e00.htm)). Historical existence never proves universal availability, affordability, portability, safety, or regional suitability.

## 21. Regional And Cultural Variation

The nine live ecology profiles provide a food-production posture but not a cuisine. Their exact coverage bands are:

| Region profile | Staple crops | Herd and game | Maritime foods | Canonical processing questions, not additions |
|---|---|---|---|---|
| Kaelvar | moderate | strong | moderate | Dry-upland/coastal grain reliability, pastoral goods, wine, salt, orchard processing, imported bulk staples, water and fuel posture |
| Valtherion | surplus | strong | moderate | River-basin grain/orchard scale, herd/dairy questions, storage and transport pressure, luxury imports |
| Serathyl | limited | moderate | strong | Wet-coast fish/citrus/vineyard preservation, humidity, smoke/drying pressure, imported grain and minerals |
| Draemor | surplus | strong | moderate | Grain/beer/cattle/vegetable processing scale, basin water, granary/mill/brewery capability, higher-tier imports |
| Talmyra | limited | moderate | moderate | Tropical fruit/sugar/aromatic routes, heat/humidity and storage pressure, weak bulk grain, frontier infrastructure |
| Myridian Chain | limited | limited | strong | Fisheries, shellfish and harbor storage, limited land/grain/herds, convoy/container dependence |
| Lantern Isles | limited | limited | strong | Fragmented-island fish/citrus supply, wet heat, harbor logistics, grain/iron/draft-animal imports |
| Serpent's Wake | scarce | limited | strong | Storm exposure, salt fish, unstable logistics, water/storage resilience, persistent staple imports |
| Dawnreach Isles | scarce | limited | strong | Cold fisheries, seasonal cold opportunity, grain/textile/metal imports, transport and fuel constraints |

These are repository facts from regional ecology, not conclusions about dishes, rituals, taboos, laws, or institutional ownership. Each later regional decision must verify native sources, supply descriptions, settlements, likely imports, climate, water, fuel, storage, transport, workplace availability, and household versus institutional scale. A generic food package would erase meaningful differences in crop reliability, herd access, fisheries, humidity, cold, storms, trade dependence, and infrastructure.

External living-tradition evidence demonstrates possibility and variation only. Related flatbreads can use different heated surfaces, ovens, cookware, labor organization, and household/specialist settings ([UNESCO flatbread culture](https://ich.unesco.org/en/RL/flatbread-making-and-sharing-culture-lavash-katyrma-jupka-yufka-01181?RL=01181)); fermented-vegetable practices can be seasonal, climatic, communal, and regional ([UNESCO Kimjang](https://ich.unesco.org/en/RL/kimjang-making-and-sharing-kimchi-in-the-republic-of-korea-00881?RL=00881&lang=en)); beer cultures can vary in methods, institutions, training, styles, water concerns, and scale ([UNESCO Belgian beer culture](https://ich.unesco.org/en/RL/beer-culture-in-belgium-01062?RL=01062)). Tree-sap processing is source- and climate-specific ([Cornell Maple Program](https://blogs.cornell.edu/cornellmaple/aboutmaplesyrup/)), while root/tuber and fermentation evidence likewise shows substrate- and region-specific routes ([FAO roots and tubers](https://www.fao.org/4/x5415e/x5415e00.htm), [FAO fermented cereals](https://www.fao.org/4/x2184e/x2184e00.htm), [FAO fermented fruits and vegetables](https://www.fao.org/4/x0560e/x0560e00.htm)). None creates a new repository cuisine, crop, animal, tradition, institution, placement, or trade route. Those require authored input.

## 22. Tools, Cookware, Containers, Workplaces, Infrastructure, Energy, Water, Environment, Maintenance, And Scale

Exact repository IDs control tools, cookware, containers, workplaces, skills, services, and buildings. External evidence supports generic capabilities - sorting, cleaning, cutting, grinding, sifting, pressing, mixing, heating, baking, drying, smoking, fermenting, cooling, storing, transporting, and cleaning - but does not authorize records or aliases. A tool is not a workplace; cookware is not a shipping container; a consumed fuel is not reusable equipment; a service is not automatically an item; and a settlement capability is not a bounded recipe.

The live core uses 21 workplaces and 53 unique required-tool tags, but aggregates tools across all 82 jobs and does not select a job, tier, or upgrade. Food skills resolve overwhelmingly to Cooking plus some Carpentry; the planned flour recipe instead names Milling. Fuel is a boolean cost input. Water quality, drainage, ventilation, dust/smoke exhaust, container condition, cold, maintenance inventory, and production scale have no exact runtime owner.

Milling evidence connects process capability to power, dust control, storage, repair, and operator skill ([FAO small mills](https://www.fao.org/fileadmin/user_upload/ags/publications/J8482E.pdf)). Fruit/vegetable processing connects water, containers, pressing, pulping, drying, and equipment to the source material ([FAO fruit and vegetable processing](https://www.fao.org/4/V5030E/V5030E00.htm)). Heritage evidence supports dedicated mill, maltings, and brewery buildings, power/heat, ventilation, storage, transport, and maintenance ([Historic England mills](https://historicengland.org.uk/images-books/publications/iha-mills/heag212-mills/), [Historic England maltings](https://historicengland.org.uk/images-books/publications/maltings/), [Historic England brewing industry](https://historicengland.org.uk/images-books/publications/brewing-industry/bhs-brewing-ind-shier/)). Rural quality-assurance evidence adds clean water, drainage, workflow separation, containers, maintenance, packaging, and raw-material control ([FAO small-scale food quality assurance](https://www.fao.org/4/v5380e/v5380e00.htm)).

A dependency is closed only when canonical source, process state, appropriate tool capability, cookware/vessel where needed, container, workplace, utilities, environmental support, skill, maintenance route, storage destination, scale, and consumer are explicit. Any missing element should be recorded as absent, authored input required, or runtime reservation, never silently supplied by prose or fallback.

## 23. Coproducts, Byproducts, Feed, Material Recovery, Waste, And Catalog-Noise Filter

The 41 core chains declare 85 top-level `byProducts` references covering 41 unique item keys. These span food, beverage, animal, botanical, textile, lumber, lighting, and masonry branches. The field is secondary-output vocabulary, not a waste taxonomy. Marketability or `trade_good` role proves value identity only, not edibility, safe recovery, food grade, or a physical destination.

Apply five tests before retaining or promoting a secondary output:

1. **Repeated consumer:** require an explicit later recipe, chain/workplace input, material/feed use, consumable link, quest/lore use, or other repeated consumer.
2. **Hazard:** preserve source, contamination, spoilage, toxicity, fire, caustic, biological, and mixed-waste boundaries; composition-unknown residue is not safely recoverable because it has value.
3. **Trade:** distinguish a stored/traded identity from a transient relationship or description; a market row is only supporting evidence.
4. **Narrative:** retain a rare residue only with concrete quest, ritual, institutional, or regional use.
5. **Gameplay value:** require a decision, bottleneck, tradeoff, recovery loop, storage burden, maintenance consequence, scarcity effect, or meaningful destination; otherwise prefer a relationship, tag, or omission.

Definitions follow from those tests: a **coproduct** is a deliberately retained secondary product with an explicit consumer; **feed** needs an authored source-to-species relationship and safety posture; **recoverable material** needs known compatibility and a repeated consumer; **ordinary waste** lacks a safe repeated gameplay destination; **hazardous residue** requires separate containment; **catalog noise** fails source, consumer, value, state/role, regional, collision, and gameplay tests. Bran, spent mash, pomace, husks, press cake, trimmings, and similar materials are not automatically feed.

Current noise requiring collision review includes stationery/ink `sausage_link` and `smoked_sausage_link`; lighting/oil-wax `sausage_coil`; food/finished/perishable `snail_shell` with metal difficulty; fuel-branch `quicklime` and `mineral_brine`; service-like `tea_service` and `tea_ceremony`; raw-subbranch but finished-stage `meat_trimmings`; masonry/residue `mash_spent`; textile `river_reed` appearing in a fish chain; and material/fuel `straw_bundle`. Later integration should correct confirmed collisions and promote only source- and consumer-closed relationships. Gate 6 must first decide whether variant expansion and last-step output selection require the audit.

## 24. Magic Interaction And Ice-Conditioned Container Classification

Ordinary food sourcing, processing, containment, and storage remain the baseline. The four magic services and 27 crystals provide static availability/use-case evidence, not food-lot execution.

| Class | Gate 5 disposition | Live posture |
|---|---|---|
| `mundane_only` | Default for sourcing, cleaning, milling, cooking, preservation, containers, drainage, ventilation, maintenance, and storage | Chains, workplaces, and storage are mundane abstractions |
| `mundane_baseline_magic_assisted` | Conditional for bounded indication, warning, temporary cooling/preservation, vessel stabilization, or warded storage while ordinary housing/handling remain necessary | Utility enchantment names warded storage and small-scale preservation but only as availability metadata |
| `parallel_magical_specialty` | Conditional scarce specialist product/service with separate cost, access, maintenance, and failure | No food/container identity owns this route |
| `magic_equivalent_institutional` | Conditional fixed service only if Gate 7 establishes infrastructure, staffing, crystal supply, recharge, security, and failure | Institutions can report service availability; no cold-room execution exists |
| `magic_exclusive` | No accepted ordinary-food case; only later canon could establish necessity | No reviewed food chain, recipe, item, or storage profile requires magic |
| `unstable_or_prohibited` | Reject free food, instant cooking/fermentation, infinite preservation, universal refrigeration/sterilization, automatic toxin/pathogen removal, zero-loss storage, and mundane-dependency bypass | Adventurer magic prohibits `free_food`; project guardrails reject unbounded bypass |

### Ice-conditioned container case study

The mundane comparison is cellar, icehouse, insulation, evaporative cooling, cold water, seasonal ice, drainage, ventilation, compatible containers, and prompt transport. The repository has abstract cellar storage and upgrade vocabulary such as an ice house or cool cellar, but no icehouse storage type, cold-container state, temperature, freshness, or lot runtime; upgrades are ignored by the craft resolver.

`crystal.ice_shard`, `crystal.ice_crystal`, and `crystal.ice_cluster` use `cold_soak` and support channeling focus, temporary ward, and permanent enchanting. They do not authorize refrigeration. More importantly, `magic_service.utility_enchantment`, the only service naming small-scale preservation, excludes ice from `allowedElements`. Ice-capable adventurer and affinity-binding services do not support preservation. This is a canonical relationship gap, not permission to bridge files by name.

A small ice-assisted case remains a conditional `mundane_baseline_magic_assisted` candidate only if Gate 7 resolves affinity, vessel route, finite capacity, recharge, target scope, ambient conditions, mundane insulation/housing, seals, drainage, ventilation, compatibility, skill, installation, maintenance, failure, scarcity, transport, security, and institutional access. A permanent chest could instead be `parallel_magical_specialty`; a fixed cold room could be `magic_equivalent_institutional`. Neither is current canon. `magic_exclusive` has no established food case, and consequence-free cold is `unstable_or_prohibited`.

Gate 5 assigns no temperature, volume, duration, capacity, throughput, crystal tier, recharge interval, or preservation effect. Gate 7 may reject every ice-conditioned proposal.

## 25. Content Candidate And Authority Matrix

These are integration candidates and reservations only. No row authorizes creating or editing any record, validator, test, runtime, UI, save, or behavior.

| # | Candidate | Classification | Proposed authority | Gameplay value | Confidence | Disposition | Dependencies | Blockers | Relevant later gate | Production-authority audit relevance |
|---:|---|---|---|---|---|---|---|---|---|---|
| 1 | Preserve source, carcass/catch, part, raw edible/non-edible, cleaned, stabilized, preserved, intermediate, ingredient, dish, byproduct, waste, market, recipe, chain, and runtime-instance separation | `factual_correction` | Durable design/validation principle | `critical` | high | accept | State/role review | Four-stage vocabulary is coarse | integration | Prevents fallback state collapse |
| 2 | Require explicit source and food-safe relationship before a biological output is edible | `schema_or_validator_precondition` | Source catalog plus relationship validation | `critical` | high | promote | Source authority, item/value coverage | Fragmented owners; market-only biology | integration | Detects inferred inputs |
| 3 | Preserve planned recipe quantities as bounded descriptive authority separate from chains/runtime | `factual_correction` | Crafting recipe authority | `critical` | high | accept | Recipe validation and execution decision | No recipe runtime consumer | Gate 6 | Defines audited authority boundary |
| 4 | Add carcass/whole-catch, cleaned, trimmed, stabilized states only for repeated consumers | `missing_static_identity`; `missing_static_relationship` | Conditional item and source/recipe relations | `high` | medium | defer | Source, consumer, storage, value, food safety | No general carcass/catch identities | integration | Prevents source-to-finished fallback |
| 5 | Close species aquatic source-to-preserved relations without aliasing meat, roe, liver, oil, skin, bone, scale, shell, ink | `missing_static_relationship` | Fauna-to-food and recipe authority | `high` | high | verify | Species outputs, consumers, material destinations | Uneven outputs; no aquatic recipe | integration | Limits preserved-fish variant overreach |
| 6 | Distinguish whole/cleaned grain, groat, meal, flour, bran, and dough | `factual_correction`; `missing_static_relationship` | Grain source and recipe authority | `high` | high | promote | Source, mill, consumers, storage | Missing cleaned/groat/meal states | integration | Exposes flour fallback mismatch |
| 7 | Treat fungal outputs as sources, not automatically safe foods | `factual_correction` | Flora relation plus authored food safety | `high` | high | accept | Fungus source, edible authority, preparation | Generic outputs; no bounded recipe | integration | Prevents generic forage inference |
| 8 | Separate milk, cream, skim, curd, whey, butter, buttermilk, fresh and aged cheese | `factual_correction`; `missing_static_relationship` | Dairy source and recipe authority | `high` | high | defer | Milk sources, vessels, storage, consumers | Sparse states; no spoilage owner | integration | Reveals reversed cheese fallback |
| 9 | Separate whole egg, yolk, white, shell, preserved/cooked egg where canon needs them | `missing_static_relationship`; `optional_depth` | Fauna/food relation and recipe authority | `medium` | medium | defer | Egg source, consumers, safety, storage | No egg chain/recipe | integration | None unless production is added |
| 10 | Separate edible, lighting, lubricant, binder, alchemical, and combat oils/fats | `factual_correction`; `missing_static_relationship` | Food/material item and recipe authority | `high` | high | collision-audit | Source, grade, consumer, storage, value | Direct oils and conflicting branches | integration | Prevents food/material fallback |
| 11 | Qualify food/curing/technical salt, mineral/food brine, sugar, acid, and smoke inputs | `missing_static_relationship` | Source-qualified preservation relation | `critical` | high | verify | Source, grade, recipe, container, storage | Fuel brine; absent acid/pickle/vinegar states | integration | Directly affects chain inputs |
| 12 | Author feed only after species, safety, and consumer checks | `authored_input_required`; `missing_static_relationship` | Livestock/feed relation | `medium` | high | reserve | Bran/mash/pomace/husk/trimming source and consumer | No live feed relationships | integration | Prevents byproduct overproduction |
| 13 | Add waste, contamination, spoilage, hazardous-residue ownership only for runtime/repeated gameplay | `runtime_owner_required`; `schema_or_validator_precondition` | Future lot/storage/waste authority | `high` | high | reserve | Item-instance state, persistence, storage policy | No lot/condition/residue state | Gate 6/integration | Tests whether broad byproducts are tenable |
| 14 | Correct three mismatched consumable links and decide four orphan profiles | `factual_correction` | Item-to-profile relation | `high` | high | correct | Intended effects, validator, UI tests | Effects outside Gate 5 | integration | Exposes owner fragmentation |
| 15 | Validate consumable/spoilage profile references and define spoilage owner | `schema_or_validator_precondition`; `runtime_owner_required` | Item validation and future spoilage contract | `critical` | high | reserve | Profile catalog, tests, persistence decision | Lint checks strings only | Gate 6/integration | Runtime ownership may join audit |
| 16 | Distinguish service outputs from inventory commodities for tea service/ceremony | `factual_correction`; `missing_static_relationship` | Service/item/market authority | `medium` | high | verify | Workplace output contract, consumers | Service unit versus item commodity | Gate 6/integration | Tests output-kind authority |
| 17 | Ask authors about regional dishes, taboos, feasts, preservation and service norms | `authored_input_required`; `lore_or_description_only` | Regional/lore authorship | `medium` | high | defer | Ecology profiles and cultural review | External examples cannot create canon | integration | None unless production-linked |
| 18 | Reconcile six explicit food-step inputs overridden by default variants | `runtime_owner_required` | Chain/runtime contract | `critical` | high | reserve | Recipe/chain precedence and tests | Gate 6 owns trigger decision | Gate 6 | Direct trigger evidence |
| 19 | Reconcile 17 declared stages absent from processing steps | `schema_or_validator_precondition`; `runtime_owner_required` | Chain validation/production contract | `critical` | high | reserve | Stage/step topology | No closure validation | Gate 6 | Direct trigger evidence |
| 20 | Define generic requested-output behavior for nine core variant chains | `runtime_owner_required` | Runtime output-selection contract | `critical` | high | reserve | Generic/variant identity policy and tests | Generic request returns default variant | Gate 6 | Direct trigger evidence |
| 21 | Decide last-step-only versus carried-forward outputs | `runtime_owner_required` | Runtime/chain output contract | `high` | high | reserve | Byproduct carry-forward semantics and tests | Bread omits bran | Gate 6 | Direct trigger evidence |
| 22 | Replace implausible fallback with explicit dependencies where required | `runtime_owner_required`; `schema_or_validator_precondition` | Chain/workplace/runtime authority | `critical` | high | reserve | Explicit I/O, selection rules, tests | 62 empty inputs; 29 empty outputs | Gate 6 | Direct trigger evidence |
| 23 | Consume critical-tool blocking or redefine `no_output`; avoid unintended all-job aggregation | `runtime_owner_required` | Workplace/job runtime contract | `critical` | high | reserve | Job selection, tool availability, tests | `blocked` is unused | Gate 6 | Direct trigger evidence |
| 24 | Select or explicitly ignore jobs, tiers, and upgrades before production claims use them | `runtime_owner_required` | Workplace/runtime contract | `high` | high | defer | Staffing/tier/upgrade semantics | Ignored fields and placeholders | Gate 6 | Direct trigger evidence |
| 25 | Replace boolean fuel only after fuel ownership is decided | `runtime_owner_required` | Recipe/runtime/inventory contract | `high` | high | defer | Fuel stock, compatibility, residue, persistence | Only `fuelAvailable` exists | Gate 6 | Direct trigger evidence |
| 26 | Reserve lot, batch, freshness, temperature, contamination and storage mutation | `runtime_owner_required` | Future inventory/storage/persistence contract | `critical` | high | reserve | Save contract and abstract-storage reconciliation | Stack has only id/key/quantity | Gate 6/integration | Determines audit scope |
| 27 | Evaluate ice-assisted containers without assuming an ice-preservation link | `missing_static_relationship`; `authored_input_required` | Magic infrastructure and container authority | `medium` | high | defer | Affinity, vessel, recharge, housing, failure, access | Preservation excludes ice; no cold state | Gate 7 | None until production integration |
| 28 | Correct or quarantine sausage, shell, brine, quicklime, service, raw/finished and similar collisions | `factual_correction`; `conflicts_with_canon` | Item taxonomy/validation | `high` | high | collision-audit | Consumer/value/chain/profile audit | Current cross-domain consumers | integration | Prevents faulty fallback scoring |
| 29 | Do not add every cut, dust, wash, spoiled state, residue, vessel grade, or regional dish | `rejected_complexity` | Catalog-noise policy | `high` | high | reject | Repeated-consumer/gameplay exception | Already broad catalog and collisions | integration | Reduces fallback/validation surface |
| 30 | Reject instant cooking/fermentation, universal cold/sterilization, toxin removal, zero loss and free-food magic | `rejected_complexity`; `conflicts_with_canon` | Safety/magic guardrail | `critical` | high | reject | None | Canon and scarcity guardrails | Gate 7 | Prevents magical bypass |
| 31 | Record food resolver defects as post-Gate-6 audit evidence | `runtime_owner_required` | Audit-trigger decision | `critical` | high | accept | Gates 4-6 evidence and focused tests | Gate 6 has final decision | Gate 6 | Direct trigger evidence |

Every conditional identity or relationship remains dependent on canonical source, edible/food-safe authority, collision audit, repeated consumers, item/value coverage, stage/role compatibility, chain and recipe ownership, workplace/tool/skill/fuel/vessel/storage closure, regional support, Gate 6, Gate 7 where magic is involved, and final integration disposition.

## 26. Uncertainty And Confidence

### High confidence

- Fixed counts, IDs, catalog metadata, the 41-chain predicate, 81 steps, 19 explicit/62 empty inputs, 52 explicit/29 empty outputs, 24 variant-bearing chains/154 variants, 85 byproduct refs, 17 omitted stages, recipe boundary, storage abstractions, profile links, and call sites are reproducible.
- Chains/workplaces are live economy inputs; planned recipes are non-inheriting and no reviewed owner executes them against inventory.
- Body-state nutrition, hydration, starvation-related, and intoxication effects are real; cooking, spoilage, temperature, contamination, lot, and food-storage mutation owners are absent.
- Current resolver behavior supplies conflicting dependencies and adds evidence relevant to the conditional audit.
- Ordinary processing is baseline; no current magic path refrigerates or preserves an inventory item.

### Medium confidence

- Missing cleaned, stabilized, fermented, dairy, egg, oil-grade, feed, and waste relationships may be useful, but repeated consumers/integration must decide item versus relationship versus omission.
- A small ice-assisted case may fit `mundane_baseline_magic_assisted`; Gate 7 may revise or reject it.
- Some broad food identities may be intentional abstractions; Gate 6 determines whether their live behavior is defective.

### Low or unresolved

- Which flora/fauna/monster outputs are edible, accepted, restricted, medicinal, toxic, or feed-safe.
- Which regions own cuisines, dishes, preservation customs, feast practices, taboos, or service norms.
- Whether absent carcass, catch, cleaned, stabilized, ferment, dairy, egg, broth, stock, vinegar, pickle, and waste states deserve records.
- Final lot, spoilage, contamination, temperature, preservation, vessel, magic affinity, recharge, access, failure, and scale semantics.

### Source cautions

- External evidence supplies distinctions, dependencies, and hazards, not canon, placement, recipes, or balance.
- Output, drop, market row, name, byproduct, tool tag, upgrade, lore, or magic string alone proves neither edibility nor runtime production.
- Similar names are not aliases, especially meats, flour variants, salt/brine, oils, services, sausage records, shells, and raw/finished collisions.
- No conclusion transfers exact yields, ratios, temperatures, durations, concentrations, strengths, capacities, magic effects, or implementation permission.

### Repository claims requiring later verification

- Reproduce counts, IDs, collisions, call sites, and focused probes at the integration head.
- Recheck consumers, values, sources, roles/stages, recipe links, workplace I/O, tools, skills, regions, storage, profiles, and magic compatibility before promotion.
- Confirm whether Gate 6/intervening work changes fallback, requested output, blocking, fuel, job/tier, or final-output behavior.
- Preserve inline citation/source-register parity in the accepted artifact.

### Issues deferred to Gate 6

- Final production-authority audit-trigger decision.
- Variant-versus-explicit precedence, fallback, generic output, omitted stages, last-step outputs, all-job tools, unused blocking, jobs/tiers/upgrades, fuel, chain/recipe/runtime precedence, and focused regression coverage.
- Whether crafting execution, inventory mutation, or lot ownership belongs in the same audit or a later runtime pass.

### Issues deferred to Gate 7

- Magic substitution, preservation service classes, ice affinity, crystal choice, vessel route, recharge, scarcity, access, failure, and mundane comparison.
- Permanent cold-container classification; every proposed form may be rejected.

### Issues reserved for integration

- Item/state promotion, source-food relations, food/material grades, feed/residue destinations, profile corrections, spoilage authority, regional authorship, storage reconciliation, validation posture, backlog, and revised `0.6.5` scope.
- Cross-gate collision review across ecology, agriculture, materials, food, crafting, and magic.

### Issues potentially triggering the production-authority audit

- Six default resolutions override explicit input arrays; 17 stages lack steps; nine generic requests fail under default variants.
- Fallback can reverse sources, omit required sources, select finished inputs, or combine broad workplace inputs.
- Last-step output can omit carried-forward outputs such as bread `bran`.
- Blocking is unused, all-job tools are aggregated, jobs/tiers/upgrades ignored, and fuel is boolean.
- Three food recipes diverge from live chain defaults; five runtime-economy tests do not isolate these behaviors.

These are evidence for the decision, not the decision itself.

## 27. Integration Disposition

Later integration should:

- **Accept** source/state/ingredient/process-aid/container/byproduct/waste/market/recipe/chain/runtime separation, ordinary processing, bounded non-inheriting recipe authority, and live economic chain participation.
- **Verify** counts, IDs, sources, consumers, collisions, relations, call sites, regional support, profiles, storage owners, and magic compatibility at the integration head.
- **Correct** confirmed taxonomy/profile/production relationships only after the responsible owner and Gate 6 route are settled.
- **Promote** an identity or relationship only with source, food-safe authority, consumers, value, state/role, chain/recipe, tools, workplace, skill, fuel, vessel, storage, region, and later-gate closure.
- **Defer** production corrections to Gate 6, magic/cold detail to Gate 7, and regional culture to authored integration.
- **Reject** unsafe operational detail, inferred aliases, automatic edibility, exhaustive low-value catalogs, universal magic, zero-loss storage, and dependency/scarcity bypass.
- **Collision-audit** sausage, shell, salt/brine, edible/industrial oil/fat, tea services, raw/finished meat, market-only biology, profiles, generic/variant outputs, and all cross-gate candidate IDs.
- **Reserve** lot, batch, freshness, temperature, contamination, spoilage, waste, storage mutation, cooking/recipe execution, feed suitability, and final audit authority for later owners.

Gate 5 adds substantial evidence relevant to the post-Gate-6 production-authority audit trigger: explicit input overrides, omitted stages, generic-target failures, implausible fallback, last-step output loss, ignored blocking/tier/upgrade semantics, boolean fuel, recipe divergence, and missing focused tests. Gate 5 does **not** make the final trigger decision; Gate 6 owns it.

The next gate is `GPT-DR.crafting.tools-workplaces-production`. Cross-domain integration remains on hold. `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` remains blocked pending remaining gates and the Gate 6 trigger decision.

## 28. Sources

### Repository sources

These local authorities were read with `AGENTS.md`, `README.md`, the four accepted prior-gate artifacts, the `0.6.5` prerequisite decision, cross-domain program, audit-trigger decision, backlog, roadmaps, historical/deferred route registers, and relevant economy/crafting/storage/magic decisions. The linked files below are the sources directly cited in the report.

| Source | Supported findings | Limitation |
|---|---|---|
| [Current GPT handoff](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/current-gpt-handoff.md) | Accepted-gate route and blockers | Coordination, not content/runtime authority |
| [Current Codex output](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/current-codex-output.md) | Latest accepted local-state evidence | Replaced each run |
| [Active prompt](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/current-codex-prompt.md) | Integration hold identity | Held; not executed by Gate 5 |
| [Queued integration prompt](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/dev/queued-cross-domain-production-research-integration-prompt.md) | Byte-identical held route | Held; not implementation authority |
| [Audit-trigger decision](https://github.com/vagabond1215/Lineage_Reforged/blob/master/docs/design/production-chain-workplace-runtime-authority-audit-trigger.md) | Conditional trigger tests and Gate 6 ownership | Decision framework, not the final outcome |
| [Items](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/items/items.json) | Exact identities, classes, stages, roles, tags, profile refs | Metadata does not prove source, grade, safety, or execution |
| [Item schema](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/schemas/items/item.schema.json) | Current item field contract | Coarse optional metadata; no food-lot semantics |
| [Consumable profiles](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/items/consumable_profiles.json) | Nine profile identities and effect metadata | No item source/preparation/safety authority |
| [Market values](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/market_item_values.json) | Item and market-only biological value coverage | Value is not item, food, or production authority |
| [Recipes](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/crafting/recipes.json) | Twelve planned bounded transformations | Non-executing and non-inheriting |
| [Recipe schema](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/schemas/crafting/recipe.schema.json) | Planned recipe contract | No runtime owner or balance authority |
| [Recipe validation tests](https://github.com/vagabond1215/Lineage_Reforged/blob/master/tests/unit/crafting-recipes-validation.test.mjs) | Current referential/shape coverage | Does not execute recipes or test food chains |
| [Production chains](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/production_chains.json) | Stages, steps, variants, byproducts, explicit/fallback fields | Macro economic data, not bounded recipe inheritance |
| [Workplaces](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/workplaces.json) | Jobs, tiers, I/O, tools, skills, upgrades, services | Capability and fallback evidence; no physical work execution |
| [Runtime economy](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/engines/civilization-engine/src/runtime-economy.ts) | Live fallback, variant, cost, value, output and blocking behavior | Calculates economy; does not mutate food inventory |
| [Runtime-economy tests](https://github.com/vagabond1215/Lineage_Reforged/blob/master/tests/unit/civilization-runtime-economy.test.mjs) | Existing five-case regression surface | Not food-specific; missing key fallback/variant cases |
| [Buildings](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/civilization/buildings.json) | Storage-bearing building/profile topology | Static capacities, not perishable lots |
| [Settlement simulation](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/engines/civilization-engine/src/settlement-simulation.ts) | Aggregate storage capacity/load/utilization | No item condition, compatibility, or spoilage |
| [Flora](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/flora.json) | Canonical plant/fungus sources and outputs | Output relation does not prove edibility or recipe |
| [Fauna](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/fauna.json) | Canonical animals and passive/slaughter outputs | No action, yield, carcass, grade, or item creation |
| [Monsters](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/monsters.json) | Drop/loot possibilities | Food-looking loot is not edible anatomy authority |
| [Regional ecology](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/regional_ecology_profiles.json) | Nine source/supply/climate profiles | No cuisine, recipe, or mutable supply execution |
| [Regions](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/regions.json) | Forty-one region identities | Geography identity, not food placement permission |
| [Settlements](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/settlements.json) | Eighty-eight settlement identities and context | No lot-level food owner |
| [Skills](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/player/skills.json) | Canonical skill IDs | Existence does not select runtime production skill |
| [Knowledge](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/player/knowledge_snippets.json) | Lore/recognition count and scope | No processing or safety authority |
| [Magic infrastructure](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/magic_infrastructure.json) | Four service records and preservation/element compatibility | Availability metadata; no food/cold execution |
| [Crystal catalog](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/content/base/world/crystal_catalog.json) | Twenty-seven affinity/tier identities and use cases | No automatic preservation or refrigeration relation |
| [Body-state owner](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/engines/player-engine/src/body-state.ts) | Live consumable effects | No source, cooking, safety, lot, or storage authority |
| [Body-state tests](https://github.com/vagabond1215/Lineage_Reforged/blob/master/tests/unit/player-body-state.test.mjs) | Existing effect behavior coverage | Does not validate food-profile semantics or UI inventory links |
| [UI consumption](https://github.com/vagabond1215/Lineage_Reforged/blob/master/apps/rpg-ui/src/features/characterPanelState.ts) | Inventory decrement and engine call path | UI-coupled mutation; no cooking or lot state |
| [Shared contracts](https://github.com/vagabond1215/Lineage_Reforged/blob/master/packages/shared/types/src/contracts.ts) | Inventory stack shape | Contract evidence only; no permission to add fields |

### External source register

The selected corpus contains 68 works across 68 direct URLs: 25 A1, 11 A2, 28 B1, and 4 B2. Every entry is cited inline above. Class means source authority for this research, not repository implementation authority.

#### Terrestrial, aquatic, dairy, fats, cold, and cross-cutting safety sources

| ID | Title and author/organization | Class | Supported findings | Transferability limitation |
|---|---|---:|---|---|
| S01 | [*Meat Processing Technologies - For Small-to Medium-Scale Producers*](https://www.fao.org/sustainable-food-value-chains/training-and-learning-center/details-materials/en/c/276926/), Gunter Heinz and Peter Hautzinger, FAO | B1 | Meat states, hygiene, equipment, facilities, cold dependencies | Modern processors; no machinery, formula, yield, or controls transfer |
| S03 | [*Animal Product Processing Industries*, byproducts chapter](https://www.fao.org/4/x6114e/x6114e07.htm), FAO | B1 | Edible, inedible, rendering, feed, material, reject, waste streams | Older industrial overview; not edibility/technology authority |
| S05 | [*Innovations in Value-addition of Edible Meat By-products*](https://doi.org/10.1016/j.meatsci.2012.04.004), Toldra et al. | A2 | Offal heterogeneity and cultural/institutional destinations | Modern review; cannot authorize canon foods/anatomy |
| S06 | [*Quality and Quality Changes in Fresh Fish*](https://www.fao.org/4/V7180E/V7180E00.htm), H.H. Huss, FAO | B1 | Post-catch product/species-sensitive deterioration | Older manual; no universal shelf life |
| S07 | [*Assessment and Management of Seafood Safety and Quality*](https://www.fao.org/4/y4743e/y4743e00.htm), Huss, Ababouch, and Gram, FAO | B1 | Seafood biological, toxin, chemical, water, ice, storage hazards | Modern risk framework; no exact controls or in-world regulation |
| S09 | [*Standard for Live and Raw Bivalve Molluscs*, CXS 292-2008](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/es/?lnk=1&url=https%253A%252F%252Fworkspace.fao.org%252Fsites%252Fcodex%252FStandards%252FCXS%2B292-2008%252FCXS_292e.pdf), Codex Alimentarius Commission | A1 | Live/raw/shucked states, harvest-area sanitation, shellfish hazards | Bivalve-specific modern standard |
| S10 | [*Standard for Sturgeon Caviar*, CXS 291-2010](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/ua/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+291-2010%2FCXS_291e.pdf), Codex Alimentarius Commission | A1 | Fish, ovary, roe, caviar identity separation | Sturgeon-specific; no generic roe alias/recipe |
| S11 | [*Standard for Fish Oils*, CXS 329-2017](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/es/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+329-2017%2FCXS_329e.pdf), Codex Alimentarius Commission | A1 | Source and crude/refined/edible oil distinctions | Modern standard; no historic refining or automatic edibility |
| S12 | [*The Production of Fish Meal and Oil*](https://www.fao.org/4/X6899E/X6899E00.htm), FAO Fishery Industries Division | B1 | Fish/residue routes to meal/oil and grade destinations | Older industrial manual; no machinery/scale/parameters transfer |
| S13 | [*Fish Spoilage Bacteria - Problems and Solutions*](https://doi.org/10.1016/S0958-1669(02)00309-9), Lone Gram and Paw Dalgaard | A2 | Product-specific spoilage organisms | Not a safety test or shelf-life authority |
| S14 | [*Prevention of Fish Oil Oxidation*](https://doi.org/10.5650/jos.ess18144), Kazuo Miyashita | A2 | Oil oxidation and storage exposure | Modern chemistry; no formulation transfer |
| S15 | [*Phycotoxins in Marine Shellfish*](https://doi.org/10.3390/md16060188), Farabegoli et al. | A2 | Environmental toxin accumulation and sensory limits | Local occurrence needs canonical ecology |
| S17 | [*Trash to Treasure: Valorization of Seafood By-products*](https://doi.org/10.3390/md21090485), Roy et al. | A2 | Heads, shells, skin, bone, viscera as distinct streams | Modern biorefinery; complex extraction/edibility do not transfer |
| S18 | [*Village Milk Processing*](https://www.fao.org/4/t0045e/T0045E01.htm), FAO | B1 | Collection, hygiene, water, vessels, differentiated dairy outputs | Older development manual; no exact/historical process authority |
| S19 | [*Milk Producer Group Resource Book*](https://www.fao.org/sustainable-food-value-chains/training-and-learning-center/details-materials/en/c/276966/), Jurjen Draaijer, FAO | B1 | Milk collection and cream/butter/curd/whey branches | Modern rural-development context; no numerical transfer |
| S20 | [*General Standard for Cheese*, CXS 283-1978](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+283-1978%2FCXS_283e.pdf), Codex Alimentarius Commission | A1 | Coagulation, whey drainage, fresh/ripened distinctions | No culture, recipe, or maturation schedule |
| S21 | [*Standard for Butter*, CXS 279-1971](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/es/?lnk=1&url=https%253A%252F%252Fworkspace.fao.org%252Fsites%252Fcodex%252FStandards%252FCXS%2B279-1971%252FCXS_279e.pdf), Codex Alimentarius Commission | A1 | Butter distinct from milk, cream, generic fat/oil | No churning method or yield |
| S23 | [*A 100-Year Review: Microbiology and Safety of Milk Handling*](https://doi.org/10.3168/jds.2017-12969), Boor et al. | A2 | Milk pathogens, spoilage, fermenters, recontamination | Modern dairy systems; no exact/historic controls |
| S25 | [*Code of Hygienic Practice for Eggs and Egg Products*, CXC 15-1976](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/es/?lnk=1&url=https%253A%252F%252Fworkspace.fao.org%252Fsites%252Fcodex%252FStandards%252FCXC%2B15-1976%252FCXC_015e.pdf), Codex Alimentarius Commission | A1 | Internal/post-laying contamination and shell handling | Modern risk code; no exact or life-stage transfer |
| S26 | [*Standard for Named Animal Fats*, CXS 211-1999](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/hu/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+211-1999%2FCXS_211e.pdf), Codex Alimentarius Commission | A1 | Source/tissue-specific edible fat identities | No rendering technology or automatic food grade |
| S27 | [*Standard for Named Vegetable Oils*, CXS 210-1999](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/zh/?lnk=1&url=https%253A%252F%252Fworkspace.fao.org%252Fsites%252Fcodex%252FStandards%252FCXS%2B210-1999%252FCXS_210e.pdf), Codex Alimentarius Commission | A1 | Source-specific and virgin/cold-pressed/refined identities | Global crop list; no new crops/processes |
| S28 | [*Small-Scale Oilseed Processing Guide*](https://northeast.sare.org/resources/small-scale-oilseed-processing-guide/), Schaufler and Schaufler, Northeast SARE | B1 | Cleaning, pressing, filtering, storage, grade destinations | Modern US equipment/regulation; no parameters transfer |
| S29 | [*Freezing and Refrigerated Storage in Fisheries*](https://www.fao.org/4/v3630e/v3630e00.htm), Johnston et al., FAO | B1 | Cold delays loss but does not restore quality | Mechanical refrigeration; qualitative analogue only |
| S30 | [*Icehouse and Ponds at Hanbury Hall*](https://historicengland.org.uk/listing/the-list/list-entry/1019500), Historic England | B2 | Seasonal ice, subterranean storage, labor/status | Early-modern/later estate; not common medieval household |
| S31 | [*Oxon Hill Root Cellar*](https://www.nps.gov/places/000/oxon-hill-root-cellar.htm), US National Park Service | B2 | Passive cool storage for suitable durable produce | Nineteenth-century US farm; not all-food authority |
| S33 | [*Bad Bug Book, Second Edition*](https://www.fda.gov/food/foodborne-pathogens/bad-bug-book-second-edition), US Food and Drug Administration | B1 | Pathogens, parasites, viruses, toxins versus spoilage | Modern general handbook; no control formula |
| S34 | [*Microbial Food Spoilage*](https://doi.org/10.1038/s41579-024-01037-x), Snyder, Martin, and Wiedmann | A2 | Food/environment-specific spoilage ecology | Modern review; signs are not a safety test |
| S35 | [*Natural Toxins in Food*](https://www.who.int/news-room/fact-sheets/detail/natural-toxins-in-food), World Health Organization | B1 | Mold, plant, algal, and food-chain toxins | Global overview; local occurrence requires canon evidence |

#### Grains, plants, fruit, preservation, fermentation, culture, and infrastructure sources

| ID | Title and author/organization | Class | Supported findings | Transferability limitation |
|---|---|---:|---|---|
| P01 | [*Wheat: Post-harvest Operations*](https://www.fao.org/fileadmin/user_upload/inpho/docs/Post_Harvest_Compendium_-_WHEAT.pdf), Umar K. Baloch / Pakistan Agricultural Research Council and FAO | B1 | Threshing, cleaning, drying, storage, milling, byproduct stages | Pakistan-focused modern manual; no parameters transfer |
| P02 | [*Small Mills in Africa*](https://www.fao.org/fileadmin/user_upload/ags/publications/J8482E.pdf), Brian Clarke and Alexandra Rottger, FAO | B1 | Hulling, meal/flour, power, dust, storage, maintenance | Modern African small-mill context; no equipment assumptions |
| P03 | [*Standard for Wheat Flour*, CXS 152-1985](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+152-1985%2FCXS_152e.pdf), Codex Alimentarius Commission | A1 | Flour identity and grain-fraction separation | Modern trade identity; no historic milling/recipe authority |
| P04 | [*Archaeobotanical Evidence Reveals the Origins of Bread*](https://doi.org/10.1073/pnas.1801071115), Amaia Arranz-Otaegui et al. | A2 | Ground cereal/tuber inputs and bread-like preparation | One archaeological site; no universal ingredients/recipe |
| P05 | [*Transformation of Cereal Grains*](https://doi.org/10.1371/journal.pone.0296986), Lucy Kubiak-Martens et al. | A2 | Processed grain and water-cooked/malt-related vessel evidence | Site-specific residue inference |
| P06 | [*Standard for Certain Pulses*, CXS 171-1989](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+171-1989%2FCXS_171e.pdf), Codex Alimentarius Commission | A1 | Whole, shelled, split pulse identities and storage quality | Trade identity; no cooking-route authority |
| P07 | [*Storage and Processing of Roots and Tubers in the Tropics*](https://www.fao.org/4/x5415e/x5415e00.htm), Aliou Diop, FAO | B1 | Perishability and crop-specific storage/processed states | Tropical crops; hazards/routes do not generalize |
| P08 | [*Small-Scale Postharvest Handling Practices*](https://www.fao.org/4/ae075e/ae075e00.htm), Lisa Kitinoja and Adel Kader, FAO | B1 | Sorting, cleaning, containers, water, climate, crop handling | Modern horticulture; not a universal vegetable route |
| P09 | [*Standard for Dried Edible Fungi*, CXS 39-1981](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+39-1981%2FCXS_039e.pdf), Codex Alimentarius Commission | A1 | Fresh/dried distinction, species identity, defects, contamination | Does not make any repository fungus edible/safe |
| P10 | [*Fruit and Vegetable Processing*](https://www.fao.org/4/V5030E/V5030E00.htm), FAO Agricultural Services Bulletin 119 | B1 | Sorting, washing, pressing, pulping, drying, vessels, scale | Modern operational manual; topology only |
| P11 | [*General Standard for Fruit Juices and Nectars*, CXS 247-2005](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+247-2005%2FCXS_247e.pdf), Codex Alimentarius Commission | A1 | Fruit, juice, puree, concentrate, nectar identities | Modern identity standard; no press/recipe authority |
| P12 | [*Standard for Jams, Jellies and Marmalades*, CXS 296-2009](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+296-2009%2FCXS_296e.pdf), Codex Alimentarius Commission | A1 | Preserve identities and fruit/sweetener relationships | No historical batch or shelf-life authority |
| P13 | [*Standard for Honey*, CXS 12-1981](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+12-1981%2FCXS_012e.pdf), Codex Alimentarius Commission | A1 | Bee-made honey and comb/extracted/pressed forms | No fictional species or recipe authority |
| P14 | [*Value-Added Products from Beekeeping*](https://www.fao.org/4/w0076e/w0076e00.htm), R. Krell, FAO | B1 | Honey, comb, wax and handling/destination separation | Apis-focused operational manual; qualitative relations only |
| P15 | [*About Maple Syrup*](https://blogs.cornell.edu/cornellmaple/aboutmaplesyrup/), Cornell Maple Program | B2 | Suitable trees, seasonal collection, fuel/equipment, storage | Modern North American ecology; not generic sap authority |
| P16 | [*Tree-Nut Aflatoxin Code*, CXC 59-2005](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXC+59-2005%2FCXC_059e.pdf), Codex Alimentarius Commission | A1 | Climate/harvest/drying/storage-sensitive nut handling | Hazard code; no canonical nut or guaranteed process |
| P17 | [*Standard for Food-Grade Salt*, CXS 150-1985](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+150-1985%2FCXS_150e.pdf), Codex Alimentarius Commission | A1 | Sea/rock/brine source routes and food-grade distinction | No saltworks design or recipe quantity |
| P18 | [*Standard for Sugars*, CXS 212-1999](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+212-1999%2FCXS_212e.pdf), Codex Alimentarius Commission | A1 | Sugar identities distinct from honey/sap/syrup/molasses | No crop/refining technology/preservation formula |
| P19 | [*Standard for Pickled Fruits and Vegetables*, CXS 260-2007](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+260-2007%2FCXS_260e.pdf), Codex Alimentarius Commission | A1 | Fermented/acidified pickling and packing distinctions | Modern standard; no thresholds/ratios transfer |
| P20 | [*Standard for Smoked Fish*, CXS 311-2013](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+311-2013%2FCXS_311e.pdf), Codex Alimentarius Commission | A1 | Smoking, smoke-flavouring, smoke-drying separation | Fish-specific modern standard; no universal meat process |
| P21 | [*Code for PAH Reduction from Smoking and Direct Drying*, CXC 68-2009](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXC+68-2009%2FCXC_068e.pdf), Codex Alimentarius Commission | A1 | Fuel, combustion, smoke contact, ventilation, airflow | Hazard code; no operating instructions/fuel list |
| P22 | [*Code of Hygienic Practice for Low-Moisture Foods*, CXC 75-2015](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXC+75-2015%2FCXC_075e.pdf), Codex Alimentarius Commission | A1 | Dry zoning, cleaning, containers, storage, recontamination | Low moisture does not imply safety |
| P23 | [*Ranking of Low-Moisture Foods*](https://www.who.int/publications/i/item/9789240044036), FAO/WHO JEMRA | B1 | Microbial persistence and material-specific differences | No spoilage timers or process parameters |
| P24 | [*General Principles of Food Hygiene*, CXC 1-1969](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXC+1-1969%2FCXC_001e.pdf), Codex Alimentarius Commission | A1 | Site layout, water, cleaning, storage, personnel, flow | Modern framework; not in-world institutional authority |
| P25 | [*Fermented Cereals: A Global Perspective*](https://www.fao.org/4/x2184e/x2184e00.htm), Norman F. Haard et al., FAO | B1 | Diverse cereal preparation/fermentation product routes | No universal starter, recipe, safety, or availability |
| P26 | [*Fermented Fruits and Vegetables: A Global Perspective*](https://www.fao.org/4/x0560e/x0560e00.htm), Mike Battcock and Sue Azam-Ali, FAO | B1 | Lactic/alcoholic/acetic/mold routes and product distinctions | Comparative manual; no operational formula |
| P27 | [*Standard for Fermented Milks*, CXS 243-2003](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+243-2003%2FCXS_243e.pdf), Codex Alimentarius Commission | A1 | Cultured product, starter, post-fermentation distinctions | No historic culture/livestock/process inference |
| P28 | [*Revealing a 5,000-y-old Beer Recipe in China*](https://doi.org/10.1073/pnas.1601465113), Jiajing Wang et al. | A2 | Archaeological malting/brewing tools, substrates, vessels, hearth | One site; title does not authorize ingredients/recipe |
| P29 | [*Fermented Beverages of Pre- and Proto-Historic China*](https://doi.org/10.1073/pnas.0407921102), Patrick E. McGovern et al. | A2 | Residue evidence for mixed cereal/fruit/honey fermentation | Site/period-specific chemical inference |
| P30 | [*Preserving Food at Home: Fermentation*](https://extension.umn.edu/preserve-your-own-food/fermentation), University of Minnesota Extension | B2 | Lactic versus acetic/vinegar distinctions and vessel/sanitation needs | Modern household safety guidance; no parameters transfer |
| P31 | [*Maltings in England*](https://historicengland.org.uk/images-books/publications/maltings/), Historic England | B1 | Cleaning, steeping, germination, kilning, storage, specialist space | English building history, often later periods |
| P32 | [*Kimjang, Making and Sharing Kimchi*](https://ich.unesco.org/en/RL/kimjang-making-and-sharing-kimchi-in-the-republic-of-korea-00881?RL=00881&lang=en), UNESCO Intangible Cultural Heritage | B1 | Seasonal, climatic, communal, regional fermentation practice | Living Korean tradition; possibility, not canon |
| P33 | [*WHO Guidelines on Good Herbal Processing Practices*](https://www.who.int/docs/default-source/medicines/norms-and-standards/guidelines/production/trs1010-annex1-herbal-processing.pdf), World Health Organization | B1 | Identification, cutting, cleaning, drying, storage, contamination | Medicinal framework; no culinary suitability/effects |
| P34 | [*Standard for Fish Sauce*, CXS 302-2011](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+302-2011%2FCXS_302e.pdf), Codex Alimentarius Commission | A1 | Derived condiment distinct from fish, brine, broth | No species, duration, recipe, or generic sauce identity |
| P35 | [*Standard for Bouillons and Consommes*, CXS 117-1981](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+117-1981%2FCXS_117e.pdf), Codex Alimentarius Commission | A1 | Liquid/concentrated/dehydrated product relationships | Modern composition standard; no historic kitchen recipe |
| P36 | [*Mills: Introductions to Heritage Assets*](https://historicengland.org.uk/images-books/publications/iha-mills/heag212-mills/), Magnus Alexander, Historic England | B1 | Power, gearing, buildings, access, period/use variation | English archaeology; no universal mill/throughput |
| P37 | [*The Brewing Industry*](https://historicengland.org.uk/images-books/publications/brewing-industry/bhs-brewing-ind-shier/), Historic England | B1 | Malt/grist/mash/wort/ferment/storage utilities and spaces | English industrial history, often post-medieval |
| P38 | [*Flatbread Making and Sharing Culture*](https://ich.unesco.org/en/RL/flatbread-making-and-sharing-culture-lavash-katyrma-jupka-yufka-01181?RL=01181), UNESCO Intangible Cultural Heritage | B1 | Diverse ovens/cookware/labor/household-specialist settings | Named living traditions; not generic bread canon |
| P39 | [*Beer Culture in Belgium*](https://ich.unesco.org/en/RL/beer-culture-in-belgium-01062?RL=01062), UNESCO Intangible Cultural Heritage | B1 | Methods, institutions, training, water, reuse, regional scale | Living Belgian tradition; not historical universality |
| P40 | [*Quality Assurance for Small-Scale Rural Food Industries*](https://www.fao.org/4/v5380e/v5380e00.htm), P. Fellows, B. Axtell, and M. Dillon, FAO | B1 | Flow, water, cleaning, ventilation, containers, fuel, maintenance | Modern rural industry; no exact/universal infrastructure |
