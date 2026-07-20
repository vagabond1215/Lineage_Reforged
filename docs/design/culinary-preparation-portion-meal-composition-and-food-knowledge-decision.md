# Culinary Preparation, Portion, Meal Composition, And Food Knowledge Decision

Date: 2026-07-20
Status: accepted documentation-only design authority; no content, schema, validator, runtime, UI, save, economy, balance, or gameplay implementation permission
Run classification: unversioned cross-cutting design decision
Milestone impact: `supports_current_band`

## 1. Purpose And Precedence

This decision records the user's accepted direction after the repaired culinary research audit and expands the focused ration authority into preparation state, partial consumption, meal composition, physical containers, food variety, character knowledge, fraud, inspection, nutrition, and food-safety posture.

It supplements:

- `docs/design/packed-food-ration-and-provisions-content-plan.md`;
- `docs/design/regional-ration-manifest-and-container-knowledge-decision.md`;
- `docs/design/item-equipment-inventory-authority-boundary-decision.md`;
- `docs/design/recipe-and-production-schema-decision.md`.

Where this document is more specific, it controls the design topics named above. It does not authorize implementation. Historical calorie requirements, exact ration quantities, exact field names, and owner-specific schemas remain subject to the next research-and-integration audit.

## 2. Food State Must Be Multi-Axis

Do not force food identity into one mutually exclusive branch such as `raw`, `cooked`, or `preserved` when real processes overlap.

Use separate conceptual axes:

1. **Edibility/readiness state** — whether the item may be eaten as presented, requires ordinary preparation, or requires specialist processing.
2. **Preparation methods** — how the food was transformed, such as smoking, boiling, baking, poaching, frying, steaming, roasting, grilling, drying, curing, pickling, fermenting, or canning/jarring.
3. **Preservation effect** — whether the actual process materially extends storage life and under which conditions.
4. **Safety/risk posture** — whether the food is safe, conditionally safe, hazardous, or skill-dependent.
5. **Authored display name** — the character-facing name, including regional, luxury, ingredient, fuel, or technique descriptors.

A method may affect more than one axis. Smoking may cook and preserve. Canning or jarring may use heat, make food directly edible, and preserve it. Drying may preserve without cooking. Fermentation may preserve and transform edibility without ordinary cooking.

Do not encode a lone manually authored `isPreserved` flag as the only truth. Prefer a derived or validated preservation result from the process/method authority so method metadata and storage behavior cannot silently disagree.

## 3. Raw, Uncooked, Cooked, And Specialty Naming

Character-facing names should explicitly distinguish materially different food states.

Examples of acceptable authored naming patterns include:

- Raw Sausage Coil;
- Uncooked Sausage Links;
- Cooked Sausage Links;
- Smoked Sausage Links;
- Applewood-Smoked Sausage Links;
- Boiled Sausage Links;
- Baked Meat Pie;
- Poached River Fish;
- Fried Root Cakes;
- Steamed Carrots.

`raw` and `uncooked` may both be used for lexical variety where the distinction is understandable and consistent within an item family, region, trade, or authored item. Mechanical meaning must come from controlled state/method fields rather than parsing the displayed name.

Regional, specialty, quality, and luxury variants may add descriptors without losing the underlying state. For example, `Applewood-Smoked Sausage Links` remains a smoked, ready-to-eat or process-qualified sausage identity; the fuel/wood descriptor does not replace the preparation method.

Do not automatically generate names from tags. Names remain authored so grammar, lore, regional language, trade conventions, and item-specific nuance remain controllable.

## 4. Ration And Provision Meaning

### Personal ration

A ration is a relatively small, portable package intended for use or carriage by one person, with the largest ordinary ration still capable of fitting in a large basket or comparable personal container.

The provisional interpretation of a **small ration** is accepted as:

> one meal for one person.

This is a semantic starting point, not an accepted calorie number.

Exact medium, large, and possible extra-large meanings require historical energy and ration research before implementation. The next audit must compare at minimum:

- one-person meal ration;
- one-person day ration;
- one-person multi-day ration;
- shared meal for two or three people;
- shared meal for four to six people.

Do not rely on size adjectives alone. Any future archetype must carry explicit intended eater count, intended meal or day coverage, and an authored energy/portion band. The audit must determine whether `medium`, `large`, and `extra_large` remain useful display labels or should be paired with clearer names such as `Meal Ration`, `Day Ration`, or `Group Ration`.

### Provisions

Provisions are bulk food supplies packaged by actual type for group, household, military, expedition, workplace, trade, or transport use over time.

Prefer concrete names such as:

- Small Sack of Wheat Berries;
- Large Sack of Barley;
- Crate of Smoked Fish;
- Basket of Apples;
- Cask of Ale;
- Barrel of Salted Meat.

Do not use `provisions` as a vague replacement for the contained commodity when a concrete container-and-content name is available.

A `Crate of Provisions` may exist when it contains a mixed authored manifest, including multiple personal rations, but it is a bulk logistics container rather than a personal ration.

## 5. Quantity And Unit Standardization

Culinary implementation must not invent a private quantity model that conflicts with cultivation, harvest, gathering, recipes, trade, crafting, and inventory.

The current recipe contract uses authored positive integer quantities, but integer counts alone do not define whether a quantity means one object, one serving, one handful, one pound-equivalent, one cup-equivalent, one bundle, one sack, or one deterministic batch.

The next audit must determine the smallest extensible quantity contract across:

- cultivation and expected yield;
- harvest and gathering;
- butchery and source parts;
- cooking and preparation recipes;
- direct consumption and portions;
- container capacity;
- trade and bulk packaging;
- nonculinary crafting recipes and material transformations.

Culinary quantity closure may proceed first if the contract is explicitly extensible. Nonculinary conversion and migration may be deferred when no immediate consumer requires it.

Candidate semantic dimensions to evaluate include:

- count;
- mass;
- volume;
- serving;
- divisible unit;
- bundle;
- batch;
- container capacity;
- density or fill posture where necessary.

Do not infer historical or physical equivalence from current authored integer recipe quantities.

## 6. Partial Consumption

Directly consumable items need an authored portionability posture.

Candidate conceptual states include:

- **whole-only** — may only be consumed as one complete unit;
- **portionable** — may be consumed in meaningful fractions and retained;
- **pourable** — liquid, granular, or loose contents may be transferred or consumed by amount;
- **stack-divisible** — multiple identical small units may be consumed by count.

The UI may present a `0-100%` slider, but backend state should not rely on an imprecise floating-point percentage as the sole authority. Prefer positive integer remaining units, fixed-point basis units, or another deterministic portion contract. Whole-only items expose only `0` or `100%`.

The static item or serving authority should define whether partial consumption is reasonable. The runtime item instance owns the actual remaining amount, opened state, contamination exposure, and later freshness/condition effects.

A whole apple may be carried and eaten directly. Loose nuts, berries, grain, flour, liquids, and similar goods normally require a suitable container. A partially eaten apple may be retained if the inventory and freshness systems can represent the physical consequences; otherwise the first implementation may constrain selected whole foods to whole-only consumption until that state exists.

## 7. Meal Creation And Food Actions

The intended player-facing food action surface should be organized around one food/eating entry point with at least three conceptual paths:

1. **Ready To Eat** — list directly edible items currently accessible to the character.
2. **Prepare** — assemble non-heated meals or portions, including salads, sandwiches, mixed rations, bowls, and combinations of existing ready-to-eat foods.
3. **Cook** — execute a recipe using a suitable station, tools, ingredients, skill, and process.

### Ready To Eat

Ready-to-eat selection should allow the character to compose one eating occasion from multiple accessible foods rather than forcing repeated single-item clicks.

### Prepare

Preparation begins by selecting a dish or container, then selecting compatible ready-to-eat ingredients and amounts.

Container checks must account for capabilities such as:

- usable capacity;
- liquid-tightness;
- food-safe posture;
- heat tolerance where relevant;
- open, closed, sealed, or resealable state;
- allowed physical forms;
- nesting and transfer constraints.

A non-waterproof bag cannot hold broth or another uncontained liquid. A bowl, jar, bottle, skin, sack, basket, ration bag, or other container is eligible only when its capabilities fit the selected contents.

### Cook

Cooking requires the selected cooking station and appropriate equipment for the intended recipe. Candidate stations may include a kitchen, campfire, fireplace, oven, hearth, smokehouse, boiling vessel, or other authored capability. The existing recipe/workplace boundary must be respected; a later execution owner must decide access, fuel, time, tools, skill, quality, failure, and inventory mutation.

After cooking or preparing, the result may be:

- consumed;
- given to another character;
- stored in a suitable container;
- discarded or otherwise handled by an approved action.

## 8. Meal Composition Summary

The meal-building interface should summarize before confirmation:

- exact ingredients and selected amounts;
- total energy/calories;
- protein;
- fat;
- carbohydrate;
- hydration where applicable;
- expected hunger reduction;
- expected satiety and duration;
- expected morale effect;
- expected stamina/energy or recovery relevance where owned;
- container compatibility and remaining capacity;
- safety, allergen, dietary, or uncertainty warnings known to the character.

Backend nutrition should retain meaningful macronutrient concepts. Do not rename `carbohydrate` to `grain`, because fruit sugars, honey, milk, roots, and other carbohydrates are not grains. A lore-friendly player view may use qualitative terms such as `starchy`, `sweet`, `protein-rich`, `fat-rich`, `hydrating`, or `filling`, while an optional detailed view may expose numeric macronutrients.

Difficulty or interface settings may reduce or hide nutrition detail without removing backend authority.

## 9. Variety Morale And Food Fatigue

Eating a varied meal should provide real value even when total food quantity remains the same.

The future model should include:

- a bounded meal-diversity morale benefit;
- diminishing returns so tiny token additions cannot be exploited;
- gradual aversion or morale penalty from repeated high exposure to the same food;
- dose sensitivity, so an entire day of one food matters more than a small component in a varied meal;
- recency and decay, so aversion begins slowly and fades over time;
- repeated-meal sensitivity across several days;
- difficulty controls that can reduce or disable nutrition and monotony pressure.

Exposure should not rely only on exact item id. The audit must evaluate tracking by one or more of:

- base ingredient or biological source;
- food family;
- preparation method;
- meal role;
- exact item;
- dominant share of the meal.

This prevents trivial circumvention by renaming the same ingredient or changing only one minor preparation descriptor.

## 10. Mixed Ration Naming

Use authored, context-sensitive naming.

Recommended posture:

- multiple berry varieties of the same preservation state: `Fresh Mixed Berries` or `Dried Mixed Berries`;
- multiple nut varieties: `Mixed Nuts`;
- berries plus nuts: `Nuts and Berries`, `Berry and Nut Mix`, or another lore-appropriate equivalent;
- two dominant exact ingredients: prefer the exact names when readable, such as `Smoked Meat and Dried Berries`;
- more than two materially different categories or an intentionally generic assortment: `Small Mixed Ration`, `Medium Mixed Ration`, or another accepted size/coverage name.

Do not add `mixed` merely because two categories are present when a clear two-part name is better. `Mixed` is appropriate when there are multiple variants within a category, multiple categories beyond a concise name, or the exact assortment is intentionally undisclosed.

## 11. Hearty And Luxury Food Semantics

### Hearty

A hearty meal is a well-made, calorie-dense, protein-supporting, filling cooked meal with multiple meaningful ingredients. It normally requires more than trivial field preparation and may benefit from a proper kitchen, hearth, cookware, sauce, gravy, broth, or other cohesive preparation.

A future exact threshold should consider:

- energy density;
- protein and fat contribution;
- portion size;
- satiety amount and duration;
- ingredient diversity;
- preparation labor and skill;
- meal quality;
- morale benefit.

`Hearty` should not be granted solely because an item is large or high in one nutrient.

### Luxury

Luxury has two accepted contexts:

1. **Elite display luxury** — multi-course, rare, labor-intensive, highly manipulated, imported, prestige-bearing, ceremonial, religious, noble, or courtly food designed to display wealth and status.
2. **Everyday attainable luxury** — an unusually expensive or celebratory departure from an ordinary person's routine diet, accessible occasionally to merchants, craftspeople, prosperous laborers, or wealthy peasants.

Historical Earth examples supplied by the user are illustrative research prompts only. Do not insert their proper names, regions, ingredients, or recipes directly. Reuse existing repository foods, regions, trade goods, fauna, flora, and recipe conventions where possible. Any new item or recipe must be lore-friendly, repo-native, and fantasy/RPG appropriate. An Earth-specific origin such as a named wine region or olive-producing country must be translated to an accepted in-world producer only after repository authority supports it.

Luxury does not automatically mean maximum calories or satiety. Cost, rarity, labor, quality, variety, import distance, presentation, and prestige may be more important.

## 12. Physical Inventory And Gathering Containers

The intended inventory is physical rather than an abstract magical list.

Loose harvested or gathered goods normally require a suitable container:

- berries, nuts, grain, seeds, flour, powders, and small loose goods need a bag, basket, sack, jar, box, or equivalent;
- liquids need liquid-tight containers;
- an apple, loaf, tool, or other whole item may reasonably be carried in a hand, belt, pocket, or suitable pouch when capacity permits;
- bulk goods require realistic transport and should normally move through sacks, baskets, crates, barrels, carts, wagons, pack animals, or storage facilities.

A future `container_templates` authority should define static capabilities while inventory/item-instance runtime owns actual contents, remaining capacity, owner, position, seal, damage, contamination, and movement.

Endgame or replay-value extradimensional containers may deliberately relax physical constraints, but ordinary inventory must not assume their behavior.

## 13. Manifest Truth, Display Grouping, And Stacking

The exact contents of a variable package should remain resolved when the physical instance is generated or enters the ownership graph. Opening-time generation remains rejected as the default because it weakens save/replay determinism, inspection, fraud, value, weight, provenance, and transfer behavior.

However, **physical instance identity and inventory presentation grouping are separate**.

Multiple unknown containers that appear identical to the character may be shown in one inventory slot even when their hidden manifests differ, provided the stack/group preserves per-unit truth and knowledge state.

Required behavior:

- each unit retains its own manifest, origin, quality, condition, and other hidden truth;
- the visible group represents common observed identity, not physical homogenization;
- identifying or opening one unit may split that unit into a more specific visible group;
- known units stack only with units that appear and are known to be equivalent under the accepted stack contract;
- unknown units may remain visually grouped until knowledge distinguishes them;
- a bulk lot may legitimately contain many identical units when its source context supports that, such as a harvest wagon, fish crate, nail shipment, rope shipment, or standardized institutional issue.

Seed packets, mystery assortments, sacks, crates, and other unknown containers may therefore share a visible slot without requiring identical hidden contents.

## 14. Origin, Identity, Fraud, And Inspection

True item identity, manifest, origin, quality, and condition should be known internally to the system whenever the source can establish them. Character knowledge remains separate.

Do not defer fraud, deceit, smuggling, substitution, and misrepresentation as world concepts. They are accepted parts of the setting and future gameplay, even though runtime implementation remains later.

The future model must distinguish:

- true identity and origin;
- seller claim, label, or presentation;
- character-observed identity;
- character certainty or knowledge state;
- inspection evidence;
- seller deception skill or method;
- buyer knowledge, skill, experience, and relevant exposure;
- seller reputation and ethical/moral tendency;
- transaction context and difficulty settings.

A character who has substantial experience with local fruit may recognize local goods being passed off as expensive imports. A novice may not recognize an exotic item on sight. Ordinary recognition may occur automatically when exposure and skill make the answer obvious; contested or altered goods require a check or inspection.

Further inspection may include context-appropriate actions such as:

- viewing a sample;
- opening a sack, crate, or basket;
- checking beneath the top layer;
- smelling;
- tasting when safe and socially permitted;
- weighing;
- checking seals, marks, documentation, or provenance;
- consulting another character or institution.

Inspection availability depends on the container and transaction. Open baskets, nets, bushels, and loosely closed containers may permit easy visual inspection. Sealed crates, barrels, casks, and sacks may require permission, tools, destructive opening, or purchase. Reputable institutions may sell sealed standardized goods; buying opaque goods from unknown sellers without inspection is risky.

Increasingly intrusive inspection may offend an honest seller, reduce trust, delay the transaction, require a deposit, or be denied. Those social consequences must be contextual rather than universal.

Difficulty settings may control:

- whether fraud/deceit is enabled;
- frequency;
- maximum magnitude;
- seller sophistication;
- inspection forgiveness;
- quality and spoilage substitution severity.

Low difficulty may limit losses to small price or quantity deception. High difficulty may permit hidden rot, mold, adulteration, low-quality fill, unusable goods, or a deceptive top layer when supported by the item's condition and safety systems.

## 15. Merchant Reputation And Ethics

Merchants and sellers should eventually have:

- a reputation that is not automatically known to new characters;
- an ethical/moral or unscrupulous tendency;
- context-sensitive incentives and pressures;
- relationships to guilds, markets, governments, trading commissions, factions, and settlements where those owners exist.

Reputation knowledge may come from prior dealings, gossip, tavern conversation, tips, institutional records, local Knowledge, companions, or other evidence. Reputation must not become an omniscient global score automatically visible to every character.

## 16. Starting Goods

Starting food and containers must be selected using accepted naming and archetype conventions rather than stale generic ration identities.

Starting goods may vary by:

- run difficulty;
- spawn region;
- prestige and incremental legacy upgrades;
- later background selection;
- institution, lineage, or scenario where approved.

Starting manifests should remain fixed and known for balance and character knowledge. The exact catalog must wait until ration naming, size/coverage, quantity, and container authority are accepted.

## 17. Fresh And Prepared Package Naming

Accepted naming direction includes:

- Market Fruit Bag;
- Fresh Produce Basket;
- Prepared Meal;
- Baker's Bundle;
- other trade- or craft-specific bundles proposed later.

Avoid or retire as default recommendations:

- Wrapped Meal;
- Prepared Meal Parcel;
- Inn Meal Parcel;
- Cookshop Parcel.

An inn, tavern, home, camp, or noble kitchen does not create a different recipe identity merely because of venue. The same named meal may vary by cook skill, ingredient quality, serving quality, condition, and presentation. Inns may sell standard named meals, rations, prepared meals, or bundles using the shared culinary naming system.

## 18. Nutrition And Satiety

Use the moderate portion/fullness model as the intended direction.

Backend nutrition should at minimum retain meaningful authored or derived posture for:

- energy/calories;
- protein;
- fat;
- carbohydrate;
- hydration;
- portion size;
- fullness/satiety amount;
- fullness/satiety duration.

Protein, fat, and carbohydrate may later influence wound recovery, high activity, fatigue, muscle development, strength-related adaptation, and other body-state or progression consumers only through dedicated accepted owners. A sustained lack of protein or other major nutritional imbalance should be capable of consequences when nutrition simulation is enabled.

Nutrition and food monotony pressure must be adjustable or disableable through difficulty settings. Do not require character-facing numeric macros in every interface.

Do not add a detailed micronutrient simulation by default. Any later deficiency model should remain coarse, gameplay-relevant, and difficulty-adjustable.

## 19. Historical Food Safety And Character Knowledge

World presentation and character understanding should reflect the setting's historical context rather than modern germ-theory language.

Characters may rely on:

- freshness and smell;
- visible spoilage;
- trusted preparation traditions;
- salting, drying, smoking, fermenting, pickling, and cooking;
- seasonal availability;
- household status and kitchen discipline;
- guild, temple, military, noble, or local practice;
- inherited knowledge, superstition, and experience.

The engine may model hidden contamination, toxin, parasite, spoilage, and preparation risk without giving characters modern scientific explanations. Noble houses may achieve higher food safety because of better ingredients, cleaner water, skilled staff, storage, rapid supply, inspection, and waste tolerance, not because all nobles possess modern microbiology.

Fresh food may be expensive or status-bearing where logistics, season, and preservation make it so, but the historical-energy audit must avoid universal claims that are false across all regions, periods, and food types.

## 20. Food Safety And Dangerous Foods

The minimum safety vocabulary requires expansion beyond a single safe/unsafe distinction.

The next audit should evaluate an orthogonal model containing at least:

### Preparation requirement

- safe as presented;
- requires ordinary cooking;
- requires non-heat processing;
- requires specialist preparation;
- conditionally edible;
- unknown.

### Hazard posture

- biological contamination/pathogen risk;
- parasite risk;
- toxin or poisonous-part risk;
- venom or harmful secretion where relevant to fantasy biology;
- spoilage risk;
- environmental or chemical contamination;
- physical hazard such as bones, shells, pits, or sharp fragments;
- residual risk after processing.

### Outcome posture

- risk removed by correct processing;
- risk reduced but not eliminated;
- risk depends on cook skill and process success;
- dangerous even after ordinary processing;
- safe only in selected parts or quantities;
- prohibited or taboo for cultural/legal reasons without implying biological danger.

Poisonous fish, animals, plants, mushrooms, monster parts, and similar foods may require specialist preparation and may remain dangerous after processing. The eventual risk must depend on the authored source, selected part, condition, process, skill, and outcome rather than a universal rule that cooking makes every toxin safe.

## 21. Historical Energy And Ration Research Requirement

Do not finalize ration calories or size bands from modern snack, protein-bar, bento, packed-lunch, MRE, or picnic analogies alone.

The next audit must research and distinguish:

- baseline energy requirements by body size, sex where relevant to the model, climate, season, health, and age;
- agricultural, construction, military, travel, hunting, gathering, craft, and sedentary activity loads;
- historical ration records versus actual intake;
- household, institutional, military, maritime, pilgrimage, and travel provisioning;
- food waste, spoilage, preparation loss, inedible portions, and social distribution;
- differences between calories issued, calories carried, calories prepared, and calories consumed;
- medieval and early-modern evidence limitations;
- modern MRE design as a comparison only, not setting authority.

Sources must be identified by quality and limitations. The result must recommend game-scale bands without claiming false historical precision.

## 22. Next Audit Requirements

Before any culinary implementation prompt, the next unversioned run must:

1. verify current repository owners for items, consumable profiles, body state, difficulty, Knowledge, skills, reputation, merchants/services, inventory stacks, containers, recipes, workplaces, gathering, and starting state;
2. research historical energy use and ration/provision practice;
3. audit quantity/unit semantics across culinary and adjacent production systems;
4. propose exact owner boundaries for preparation method, preservation effect, edibility, safety, portionability, remaining amount, composed meals, dietary exposure, and observed-versus-true item knowledge;
5. reconcile heterogeneous unknown display groups with per-unit hidden instance state;
6. define candidate meal action and UI flow without implementing it;
7. identify which decisions can remain static content, which require item-instance state, and which require engine-owned commands;
8. propose a corrected package sequence and smallest later implementation package;
9. classify that package without assigning a version number unless policy and exact scope justify it;
10. stop for GPT/human review.

## 23. Route And Non-Goals

The repaired culinary research audit at commit `9b73c80e5fc28b3f0951a0d308c0f693ce1493c5` is accepted as documentation input, subject to this more specific decision.

The previous narrow taxonomy/profile correction is no longer automatically implementation-ready because sausage and similar food identities now require an accepted preparation/readiness model rather than a branch-only rename.

`Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains paused and recoverable. Do not restore or consume it until this integration audit is accepted and the route is explicitly advanced.

This document changes no item, recipe, profile, source, region, bundle, starting loadout, schema, validator, test, runtime, inventory state, UI, save, economy, Knowledge, reputation, merchant, difficulty, dependency, asset, or gameplay behavior.