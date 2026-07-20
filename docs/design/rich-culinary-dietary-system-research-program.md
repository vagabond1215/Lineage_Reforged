# Rich Culinary And Dietary System Research Program

Date: 2026-07-19
Status: active documentation-only research authority; no content, schema, runtime, UI, save, economy, or gameplay implementation permission
Run classification: unversioned cross-cutting audit and research program
Milestone impact: `supports_current_band`

## 1. Purpose

Define a deep, evidence-backed audit and research pass for a rich flora, fauna, ingredient, recipe, preservation, nutrition, satiety, cuisine, and dietary system appropriate to Lineage: Reforged.

The pass must determine what the repository already owns, what is underused, what is mislabeled or contradictory, what can be safely reused, what requires new authored authority, and what should remain abstract or omitted.

The research must support a later reviewed implementation package. It must not implement that package itself.

## 2. Game Intent

The culinary and dietary system should support the project’s grounded medieval-fantasy identity and systemic RPG goals:

- travel, survival, preparation, provisioning, and recovery;
- regional ecology, agriculture, hunting, fishing, gathering, trade, and seasonality;
- workplaces, inns, taverns, households, markets, guilds, military supply, hospitality, feasts, and scarcity;
- lineage, culture, status, taboo, tradition, and persistent world history;
- meaningful choices without turning ordinary eating into repetitive nutritional bookkeeping;
- clear authority boundaries between static content, recipes, inventory instances, body state, economy, services, world simulation, and UI.

Richness should come from coherent relationships and consequences, not from adding every possible cut, seed, shell, dish, residue, nutrient, or regional synonym.

## 3. Existing Decisions To Preserve

The research must preserve these accepted decisions unless it finds a concrete contradiction and reports it for later review:

1. Recipes own complete explicit bounded transformations.
2. Production chains own macroeconomic and institutional context and do not donate recipe fields.
3. Source organisms, harvested parts, ingredients, processed states, prepared foods, market values, recipes, inventory instances, and runtime actions remain separate owners.
4. Generic ration identities such as `ration_bundle`, `trail_meal`, and `traveler_ration` must not remain the primary identities of directly consumed food.
5. Named foods are consumed; provisions packs are opened into explicit named contents.
6. A provisions pack is not edible and must not own a nutrition profile.
7. `hearty` means filling value and nutritional completeness; `luxury` means variety, quality, rarity, labor, prestige, origin, packaging, or value and does not automatically mean maximum nutrition.
8. Biological output names and `ingredient` classifications do not independently prove edibility, safety, cultural acceptance, or direct consumption.
9. Magic must not provide free food, instant universal cooking, automatic toxin removal, perpetual preservation, universal refrigeration, or consequence-free scarcity bypass.
10. The current consumable-profile values are game-scale abstractions, not declared real-world kilocalories or complete nutritional science.

Primary existing authorities include:

- `docs/design/packed-food-ration-and-provisions-content-plan.md`;
- `docs/design/cross-domain-production-research-synthesis.md`;
- `docs/design/internal-versioning-and-release-milestone-policy.md`;
- current item, recipe, flora, fauna, monster, regional ecology, production, body-state, inventory, and UI owners.

The retained Gate 1-5 and Gate 7 temporary research artifacts remain assigned to `Version 0.6.7`. This program must not consume, delete, or broaden their artifact-disposition contract. Use the durable synthesis rather than reassigning those files.

## 4. Scope

### 4.1 Repository inventory and authority

Audit at minimum:

- every item with food, beverage, ingredient, consumable, dairy, grain, fruit, vegetable, fungus, herb, spice, meat, fish, shellfish, egg, oil, fat, salt, sugar, preserve, ration, meal, stew, bread, pastry, sausage, tea, ale, or related semantics;
- every `roles` assignment involving `ingredient` or `consumable`;
- every `consumableProfileId` and every orphan or misapplied consumable profile;
- every recipe input and output relevant to food, drink, preservation, containers, and preparation;
- flora and fauna outputs that may be culinary, medicinal, toxic, material, feed, or unresolved;
- monster drops that expose biological ingredients without proving food use;
- regional ecology, habitats, biomes, regions, agriculture, livestock, fishing, hunting, gathering, workplaces, production chains, services, starting bundles, storage, spoilage, body state, inventory, and character-panel consumption paths;
- naming and taxonomy collisions that make food-looking identities unsafe to use.

Reproduce exact counts with scripts or one-off commands and document the method. Do not estimate large catalog totals manually.

### 4.2 Ingredient authority

For each candidate ingredient, distinguish:

- biological source or harvested part;
- food-grade ingredient;
- culinary preparation aid;
- seasoning or preservative;
- direct-consumption food;
- medicinal or alchemical ingredient;
- toxic or hazardous material;
- animal feed;
- industrial/material use;
- unresolved or conflicting identity.

Determine whether each relationship is explicit, inferable only by name, contradicted, or absent.

### 4.3 Food-state vocabulary

Audit whether the repository can coherently distinguish states such as:

- whole or uncleaned source;
- cleaned, gutted, shelled, peeled, trimmed, butchered, or filleted;
- raw edible versus raw unsafe;
- cut, ground, mashed, milled, pressed, rendered, mixed, or fermented;
- cooked, baked, boiled, roasted, fried, grilled, or stewed;
- dried, salted, smoked, pickled, candied, preserved, cured, or sealed;
- component, dough, batter, stock, broth, sauce, filling, or finished dish;
- serving, portion, loaf, cake, wheel, jar, cask, packet, board, platter, or pack.

Do not recommend separate records for every state unless repeated consumers, gameplay decisions, value differences, safety requirements, or lore significance justify them.

### 4.4 Recipes and culinary topology

Audit:

- complete versus incomplete recipe transformations;
- unused and underutilized ingredients;
- outputs with no downstream consumer;
- prepared foods with no recipe;
- recipes whose result name is too generic;
- source-specific versus interchangeable ingredient authority;
- portion and batch abstraction;
- required workplace, tool, skill, vessel, fuel, water, salt, sweetener, fat, binder, starter, and preservation dependencies;
- byproducts and residues only where repeated consumers justify them;
- compound foods, multi-stage recipes, substitution groups, regional variants, and quality tiers;
- the boundary between a recipe, service meal, provisions pack, and household or institutional production chain.

No relationship may be admitted merely because a production chain, item name, tag, or market value looks compatible.

### 4.5 Nutrition and satiety

Research a game-appropriate model that begins with the current fields:

- calories or energy;
- protein;
- carbohydrates;
- fat;
- hydration;
- intoxication where relevant.

Evaluate whether later authority should add or derive any of the following:

- immediate satiety or fullness;
- satiety duration or hunger-delay effect;
- fiber or bulk;
- digestibility;
- food volume or water content;
- preservation and processing effects;
- portion size;
- meal balance or dietary diversity;
- repeated-food monotony;
- short-term recovery versus long-term diet quality;
- micronutrient or deficiency abstractions only where they create meaningful gameplay rather than medical micromanagement.

The research must separate:

1. real-world nutritional evidence;
2. game-scale abstraction;
3. balance placeholders;
4. unsupported or rejected complexity.

Do not convert the existing small integer `calories` values into real kilocalories by assumption.

### 4.6 Dietary patterns and restrictions

Audit whether current canon supports any meaningful dietary patterns, restrictions, or preferences based on:

- culture, region, religion, institution, class, occupation, travel mode, season, or scarcity;
- character biology or lineage only where the repository explicitly establishes it;
- ethical, taboo, medicinal, allergenic, toxic, or preparation-dependent restrictions;
- vegetarian, fish-based, pastoral, grain-heavy, coastal, arctic, marsh, forest, desert, or elite foodways as setting patterns rather than modern labels when appropriate.

Do not invent racial biology, allergies, religious rules, or moral systems from genre convention.

### 4.7 Regional cuisine and food lore

Determine how cuisine can be grounded in:

- native flora and fauna;
- agriculture and livestock;
- climate, biome, water access, fuel, vessels, and preservation conditions;
- trade routes, imports, scarcity, taxation, military supply, ports, markets, and institutions;
- household, tavern, inn, guild, religious, military, noble, festival, funeral, wedding, and travel contexts;
- class and status differences without reducing cultures to one signature dish;
- seasonal availability and regional variants.

Regional cuisine recommendations must be traceable to existing canon or explicitly marked as authored-input proposals.

### 4.8 Lore-friendly naming

Develop naming rules and examples for:

- raw ingredients;
- prepared ingredients;
- preserved foods;
- breads, porridges, stews, pies, roasts, sausages, cheeses, drinks, sweets, and condiments;
- service meals and feast courses;
- provisions packs;
- regional, institutional, occupational, and prestige variants.

Prefer names based on source, preparation, form, place, institution, maker, season, or cultural use.

Avoid modern consumer-product language unless deliberately translated into setting vocabulary, including terms such as `protein bar`, `energy snack`, `meal prep`, `sports drink`, `superfood`, and generic marketing tiers presented as edible identities.

Generic logistics language may remain on containers and packs. Directly consumed foods should identify what is eaten.

### 4.9 Provisions and packed meals

Research exact content principles for:

- light snacks;
- standard preserved meals;
- hearty provisions packs;
- luxury provisions packs;
- regional, military, maritime, caravan, hunter, laborer, scholar, or institutional packs.

A pack should contain explicit named foods spanning authored nutritional roles. Opening remains a future inventory command, not crafting and not direct consumption.

### 4.10 Food safety, storage, and spoilage

Audit preparation-dependent edibility, contamination, toxins, parasites, rancidity, fermentation, water quality, storage, vessel compatibility, temperature, humidity, pests, and spoilage only to the depth justified by intended gameplay.

Separate:

- static safety and preparation metadata;
- mutable item-instance condition;
- storage environment;
- elapsed time;
- body-state consequences;
- inspection or Knowledge requirements;
- runtime ownership and persistence.

Do not claim that a static item or recipe currently executes spoilage, contamination, cooking, preservation, or safety checks.

### 4.11 Economy, availability, and services

Audit how ingredients and foods relate to:

- base value and value derivation;
- perishability and portability;
- labor and fuel intensity;
- rarity and regional availability;
- household versus institutional scale;
- market, inn, tavern, guild, military, temple, ship, caravan, and festival service;
- luxury versus subsistence demand;
- waste, coproducts, feed, and reusable containers.

Do not invent stock, prices, transactions, or service execution.

### 4.12 Gameplay and owner boundaries

Identify which future behavior belongs to:

- static item content;
- source relationships;
- recipe content;
- consumable profiles;
- a future nutrition or satiety profile;
- bundle profiles;
- inventory commands;
- body-state engine;
- storage/spoilage state;
- gathering, hunting, fishing, butchery, cooking, and crafting attempts;
- economy and services;
- Knowledge and inspection;
- regional simulation;
- UI presentation.

Recommend only the smallest reusable owners necessary for the intended system.

## 5. Research Standards

Use current repository evidence as the source of truth for existing canon and behavior.

For external research, prefer authoritative and primary sources:

- FAO, WHO, USDA FoodData Central, FDA, EFSA, and comparable official nutrition or food-safety authorities;
- peer-reviewed research and consensus reviews for satiety, food processing, protein, fiber, water content, energy density, and dietary diversity;
- Kew Plants of the World Online, GBIF, FishBase, IUCN, USDA plant resources, and comparable taxonomic/ecological authorities where relevant;
- university, museum, archival, archaeological, and scholarly food-history sources for historical processing, storage, preservation, vessels, terminology, and foodways;
- translated or edited historical culinary texts only as evidence of patterns, not automatic world canon.

Avoid using commercial recipe blogs, unsourced listicles, fandom wikis, or modern marketing copy as factual authority.

Every important external claim must have a source citation. Distinguish direct source evidence from game-design inference.

## 6. Required Classification Vocabulary

Classify each audited identity or proposal with one primary disposition:

- `ready_existing_authority`;
- `ready_profile_link_after_correction`;
- `ready_recipe_candidate`;
- `needs_named_item`;
- `needs_source_relationship`;
- `needs_food_safety_authority`;
- `needs_recipe_authority`;
- `needs_consumable_profile`;
- `needs_nutrition_satiety_contract`;
- `needs_bundle_profile`;
- `needs_runtime_owner`;
- `needs_regional_authorship`;
- `lore_only`;
- `collision_or_misclassification`;
- `catalog_noise_reject`;
- `defer`.

Also record confidence as `high`, `medium`, or `low`, and provenance as `repository_fact`, `external_fact`, `bounded_design_inference`, `authored_input_required`, or `unresolved`.

## 7. Required Research Outputs

The active Codex pass must create exactly these temporary research artifacts:

1. `docs/dev/tmp-rich-culinary-dietary-system-research-2026-07-19.md`
   - narrative synthesis;
   - baseline counts;
   - findings by domain;
   - nutrition and satiety options;
   - naming guide;
   - regional/lore findings;
   - owner and dependency map;
   - candidate packages and sequencing;
   - rejected complexity;
   - uncertainties and questions for review.

2. `docs/dev/tmp-rich-culinary-dietary-audit-matrix-2026-07-19.json`
   - machine-readable audited records and candidates;
   - exact current ids/keys where they exist;
   - current owner/path;
   - current roles, consumers, and conflicts;
   - edibility, preparation, nutrition, satiety, naming, regional, and safety posture;
   - disposition, dependencies, confidence, and provenance.

3. `docs/dev/tmp-rich-culinary-dietary-source-index-2026-07-19.md`
   - source title, organization/authors, date, URL, source type, topic, key supported claims, and limitations;
   - repository-source inventory with exact paths;
   - no long copyrighted quotations.

The artifacts are temporary because the next pass will audit the findings before durable promotion or implementation.

## 8. Required Candidate Packages

The research must recommend a bounded sequence rather than one broad implementation dump. Evaluate at least:

1. factual item/profile/taxonomy corrections;
2. generic ration and consumable-profile reconciliation;
3. named preserved-food and ingredient content;
4. bounded recipe expansion;
5. nutrition and satiety authority;
6. bundle-profile schema and validation;
7. open-pack inventory command;
8. regional cuisine and food-lore content;
9. storage, spoilage, and food-safety runtime only if justified later.

For each package, state:

- label-class recommendation under the internal versioning policy;
- exact scope and owner;
- prerequisites;
- files likely affected;
- validation required;
- risks and rollback boundary;
- whether it blocks or can remain independent of queued `0.6.6`.

Do not assign a new primary version number during the research pass.

## 9. Stop Conditions

Stop and report rather than infer when:

- an ingredient’s source or edibility is ambiguous;
- a recipe lacks exact bounded transformation authority;
- a food name collides with a non-food taxonomy;
- real-world evidence conflicts with current canon;
- a proposed field has no clear static or runtime owner;
- a regional dish would require new cultural canon;
- a nutrition value would be invented without an accepted abstraction method;
- a proposed system would create repetitive bookkeeping without meaningful decisions.

## 10. Route And Artifact Disposition

- This unversioned research pass temporarily precedes queued `Version 0.6.6` by explicit user direction.
- `0.6.6` is paused, not canceled, and its exact previous prompt must remain recoverable.
- After the research pass, the next action is a human/GPT audit of the three temporary artifacts.
- No implementation prompt should be selected until that audit accepts or revises the findings.
- After accepted audit, select the smallest coherent implementation package and classify it under the versioning policy.
- The queued `0.6.6` route resumes after the accepted culinary package unless the audit explicitly proves a different dependency order.
- The temporary artifacts may be deleted only after their accepted findings are promoted into durable authority and every selected implementation prompt has a stable source.

This program changes no current content or behavior.