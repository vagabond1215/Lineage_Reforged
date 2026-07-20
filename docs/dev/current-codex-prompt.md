# Current Codex Prompt

## Run Identity

`Rich Flora, Fauna, Culinary, Nutrition, And Dietary Systems Audit And Research`

Run classification: unversioned cross-cutting audit and research
Milestone impact: `supports_current_band`

Run this as a deep documentation-only repository audit and externally sourced research pass. Produce decision-ready temporary artifacts for a later GPT/human review. Do not implement content, schemas, validators, runtime, UI, saves, economy, or gameplay.

Suggested commit:

`docs(food): research rich culinary and dietary systems`

## Route Context

This pass temporarily precedes `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` by explicit user direction.

`0.6.6` is paused, not canceled. Its exact prior prompt is preserved through `docs/dev/held-0.6.6-monster-ecology-loot-prompt.md` and the recorded source commit/blob. Do not implement, rewrite, or consume `0.6.6` during this run.

After this research completes, stop. The next action is a GPT/human audit of the research artifacts. Do not install an implementation prompt and do not assign a new primary version number.

## Execution Gate

1. Read:
   - `AGENTS.md`;
   - `README.md`;
   - `docs/dev/current-codex-output.md`;
   - `docs/dev/current-gpt-handoff.md`;
   - `docs/dev/current-codex-prompt.md`;
   - `docs/dev/codex-sequenced-implementation-plan.md`;
   - `docs/dev/historical-version-and-deferred-route-register.md`;
   - `docs/future_content_backlog.md`;
   - `docs/design/internal-versioning-and-release-milestone-policy.md`;
   - `docs/design/rich-culinary-dietary-system-research-program.md`;
   - `docs/design/packed-food-ration-and-provisions-content-plan.md`;
   - `docs/design/cross-domain-production-research-synthesis.md`;
   - the current item, recipe, flora, fauna, monster, ecology, production, starting-bundle, body-state, inventory, and consumption owners discovered below.
2. Run `git status`, fetch, and fast-forward pull. Record starting commit, branch, and clean/dirty state. Preserve unrelated work.
3. Confirm the active prompt is this unversioned research run and the exact `0.6.6` hold file resolves to source blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
4. Confirm accepted `0.6.5` still contains 28 planned standard recipes across 10 families and no recipe runtime consumer.
5. Confirm the packed-food plan still distinguishes named foods, prepared composite foods, provisions packs, and consumable profiles.
6. Confirm the retained Gate 1-5 and Gate 7 temporary research artifacts remain assigned solely to `0.6.7`. Do not consume, delete, edit, or broaden their disposition contract. Use the durable synthesis instead.
7. Stop without writing research artifacts if repository authority has materially changed so that the program’s owner map or route assumptions are false. Report the smallest coordination repair needed.

## Purpose

Audit and research the ingredients, recipes, nutrition, satiety, dietary patterns, food safety, preservation, storage, provisioning, regional cuisine, lore-friendly naming, ecology relationships, economy context, and gameplay ownership needed for a rich but coherent culinary system appropriate to Lineage: Reforged.

The pass must answer:

- what exists;
- what is unused or underutilized;
- what is contradictory or mislabeled;
- what is safe to reuse;
- what needs new authored authority;
- what should remain abstract;
- what should be rejected as catalog noise or unsupported complexity;
- what the smallest coherent implementation packages should be after review.

## Project Intent To Preserve

Design for a grounded medieval-fantasy systemic RPG centered on travel, survival, provisioning, regional ecology, agriculture, gathering, hunting, fishing, trade, workplaces, hospitality, scarcity, culture, lineage, status, and persistent history.

The system should create meaningful preparation and dietary choices without requiring repetitive meal micromanagement. Richness should come from relationships, regional identity, preparation, quality, scarcity, and consequences rather than thousands of disconnected food records.

Preserve these rules:

- named foods are directly consumed;
- generic ration/provisions identities are containers or logistical bundles, not edible food names;
- provisions packs open into explicit named contents through a future inventory command;
- `hearty` means more filling and nutritionally complete;
- `luxury` means greater variety, quality, rarity, labor, prestige, origin, packaging, or value and not automatically maximum calories;
- biological outputs are not automatically edible;
- recipes own explicit bounded transformations;
- production chains do not donate recipe fields;
- static content does not execute gathering, cooking, spoilage, consumption, opening, inventory mutation, or economy behavior;
- magic cannot create free food, universal preservation, automatic toxin removal, or scarcity bypass.

## Mandatory Fresh Repository Inventory

Use scripts or one-off commands to reproduce exact current counts and paths. Do not estimate manually.

At minimum report:

1. total items and item-class distribution;
2. items with `ingredient` roles;
3. items with `consumable` roles;
4. items with both roles;
5. items with `consumableProfileId`;
6. consumable profiles and orphan profiles;
7. semantically mismatched item/profile links;
8. food-, drink-, ration-, meal-, preserve-, dairy-, grain-, fruit-, vegetable-, fungus-, herb-, spice-, meat-, fish-, shellfish-, egg-, oil-, fat-, salt-, sugar-, tea-, ale-, bread-, stew-, sausage-, pastry-, and container-facing item identities;
9. recipes by family and all food/beverage/preservation-related inputs and outputs;
10. recipe inputs with no other recipe consumer and outputs with no downstream recipe consumer;
11. prepared/preserved food items with no recipe;
12. flora and fauna records and all output item keys with culinary-looking semantics;
13. monster drops exposing ingredient-looking biological outputs;
14. regional ecology profiles, regions, biomes, habitats, and any agriculture/livestock/fishing/hunting/gathering anchors;
15. starting bundles containing ration or food identities;
16. body-state fields and consume application paths;
17. storage, spoilage, freshness, contamination, temperature, and food-safety authorities or confirmed absences;
18. workplaces, tools, skills, production chains, and services relevant to food production or sale;
19. taxonomy/name collisions, including records whose food-looking name conflicts with a non-food branch or difficulty profile.

Record commands or method summaries sufficient to reproduce the counts.

## Repository Files And Owners To Inspect

Search first and use current paths rather than assuming every owner. At minimum inspect or locate:

- `packages/content/base/items/items.json`;
- `packages/content/base/items/consumable_profiles.json`;
- item and consumable schemas/validators/tests;
- `packages/content/base/crafting/recipes.json`;
- recipe schema, validation, and tests;
- flora, fauna, monsters, regional ecology, regions, biomes, and habitats;
- production chains, workplaces, jobs, extraction methods, services, market values, and starting bundles;
- player body-state, hunger, hydration, starvation, intoxication, inventory stack, consume resolver/application, and save synchronization owners;
- UI inventory categorization, consume previews, use-action labels, and accepted consumption application;
- data dictionaries and durable design decisions relevant to food, ecology, crafting, economy, magic, Knowledge, storage, and activities.

Do not treat a name, role, tag, branch, market value, chain, or UI category as proof of execution or semantic correctness.

## Audit Domain 1: Ingredient And Edibility Authority

For every meaningful culinary-looking identity, classify whether it is:

- a biological source or harvested part;
- a food-grade ingredient;
- a seasoning, preservative, starter, binder, fat, sweetener, acid, salt, smoke, or preparation aid;
- a direct-consumption food;
- a prepared composite food;
- medicinal or alchemical;
- toxic or hazardous;
- animal feed;
- industrial/material use;
- unresolved or conflicting.

For each classification, determine whether the relationship is explicit, source-backed, bounded design inference, authored input required, contradicted, or absent.

Do not infer that meat, milk, eggs, roe, fungi, berries, seeds, leaves, glands, oils, venoms, shells, or monster parts are safe foods merely because their item subbranch says `ingredient`.

## Audit Domain 2: Food-State And Preparation Vocabulary

Evaluate repository coverage and necessary distinctions for:

- whole, uncleaned, carcass, catch, bunch, bundle, pod, husk, shell, rind, or root source states;
- cleaned, washed, gutted, shelled, peeled, trimmed, butchered, filleted, deboned, or sorted states;
- raw edible versus raw unsafe;
- cut, ground, milled, mashed, pressed, rendered, mixed, cultured, or fermented states;
- cooked, baked, boiled, roasted, fried, grilled, steamed, or stewed states;
- dried, salted, smoked, cured, pickled, candied, preserved, sealed, or aged states;
- dough, batter, stock, broth, sauce, filling, curd, whey, cream, oil, meal, flour, groat, and other intermediates;
- portion, serving, loaf, cake, wheel, wedge, jar, crock, cask, packet, board, platter, pack, and service identities.

Recommend a record only when repeated consumers, safety, gameplay, value, quality, regional identity, or lore justify it. Prefer a relationship or tag over a new item when identity adds no durable value.

## Audit Domain 3: Recipes And Culinary Topology

Audit:

- complete and incomplete transformations;
- unused and underutilized ingredients;
- output dead ends;
- prepared foods with no recipe;
- generic or misleading result names;
- compound and multi-stage foods;
- source-specific and substitution-capable ingredients;
- preservation routes;
- workplace, tool, skill, vessel, fuel, water, salt, fat, sweetener, binder, starter, and storage dependencies;
- game-scale portions and batches;
- byproducts only where repeated consumers exist;
- household, service, institutional, and production-chain scale distinctions;
- provisions-pack assembly versus recipe crafting.

Do not restore the rejected flour-only pastry or partially author the blocked savory-meat-pie relation without new exact evidence.

For each high-readiness recipe candidate, specify exact proposed inputs, positive integer quantities, roles, output, workplace, tools, skill/rank, optional non-inheriting chain reference, evidence class, and unresolved dependencies. These are recommendations only.

## Audit Domain 4: Nutrition And Satiety

Research authoritative evidence for a game-appropriate model beginning with the current profile fields:

- energy/current `calories` abstraction;
- protein;
- carbohydrates;
- fat;
- hydration;
- intoxication.

Evaluate separately:

- immediate fullness;
- duration before hunger returns;
- protein effect;
- fiber/bulk effect;
- water content and food volume;
- fat and energy density;
- processing and food form;
- digestibility;
- portion size;
- meal balance and dietary variety;
- preserved versus fresh posture;
- repeated-food monotony;
- short-term recovery versus long-term diet quality;
- whether micronutrients or deficiency groups create meaningful gameplay or only medical bookkeeping.

Do not assume current values represent real kilocalories. Determine whether they should remain abstract points, be renamed, normalized, derived, or replaced in a future authority.

Provide at least three candidate models:

1. minimal extension of current profiles;
2. moderate satiety and meal-balance model;
3. richer long-term dietary model.

For each model, report fields, calculation posture, owner, persistence needs, UI burden, gameplay value, exploit risks, testing burden, and recommendation.

Any formulas must be labeled as external evidence, bounded design inference, or balance placeholder. Do not present a speculative equation as scientific fact.

## Audit Domain 5: Dietary Patterns And Restrictions

Inspect existing canon for dietary patterns or restrictions based on:

- region, climate, culture, religion, institution, class, occupation, travel, season, scarcity, trade, and status;
- character biology or lineage only where explicitly established;
- taboo, ethical, medicinal, toxic, preparation-dependent, or allergenic concerns;
- coastal, pastoral, grain-heavy, forest, marsh, arctic, desert, maritime, military, caravan, noble, temple, or subsistence foodways.

Do not invent species biology, racial diets, allergies, religious prohibitions, or moral rules from genre convention.

Classify proposed cultural foodways as repository fact, external historical pattern, bounded setting inference, or authored input required.

## Audit Domain 6: Regional Cuisine And Food Lore

Build a region-by-region opportunity matrix using existing ecology and world authority. Evaluate:

- native and cultivated flora;
- fauna, livestock, hunting, fishing, and shellfish;
- grain, fruit, vegetable, herb, spice, oil, salt, sugar, dairy, and beverage access;
- climate, water, fuel, vessels, preservation, and storage;
- ports, roads, trade, institutions, markets, military supply, inns, taverns, households, guilds, temples, feasts, weddings, funerals, festivals, and travel;
- subsistence, common, specialty, and luxury distinctions;
- seasonal and imported foods;
- regional variants without reducing a culture to one signature dish.

Do not create regional canon. Produce authored-input candidates and identify the exact evidence each would need.

## Audit Domain 7: Lore-Friendly Naming

Produce a naming guide and candidate naming matrices for:

- raw and prepared ingredients;
- preserved foods;
- breads, porridges, stews, pies, roasts, sausages, cheeses, drinks, sweets, condiments, and service meals;
- packs and provisions;
- regional, institutional, occupational, seasonal, and prestige variants.

Prefer names built from source, preparation, form, place, institution, maker, season, or cultural use.

Directly consumed foods should identify what is eaten. Generic logistical names are acceptable only for containers or packs.

Avoid modern consumer-product and wellness language unless deliberately translated into setting vocabulary, including:

- protein bar;
- energy snack;
- sports drink;
- meal prep;
- superfood;
- trail mix as an unexplained modern label;
- generic `standard`, `hearty`, or `luxury` meal names without explicit composition.

Test names for collision with existing ids, slugs, branches, services, tools, materials, and non-food meanings.

## Audit Domain 8: Provisions Packs

Research and recommend exact composition principles for:

- light snacks;
- standard preserved meals;
- hearty provisions packs;
- luxury provisions packs;
- hunter, laborer, traveler, trader, scholar, military, maritime, caravan, regional, and institutional packs.

Every proposed pack must contain explicit named food ids or clearly marked future identities and positive quantities.

A hearty pack should span multiple nutritional roles. A luxury pack should distinguish quality, variety, rarity, prestige, origin, labor, or packaging rather than simply having the highest nutrition.

Opening is a future atomic inventory command, not a recipe and not direct consumption. Do not design or implement runtime beyond identifying owner requirements.

## Audit Domain 9: Food Safety, Storage, And Spoilage

Research appropriate depth for:

- preparation-dependent edibility;
- toxins and poisonous lookalikes;
- parasites and contamination;
- fermentation and preservation failure;
- rancidity;
- potable water;
- vessel compatibility;
- temperature, humidity, pests, drainage, ventilation, and elapsed time;
- inspection, Knowledge, and skill requirements;
- mutable freshness, spoilage, contamination, and condition.

Separate static metadata from mutable item-instance state, storage environment, time, body-state effects, persistence, and UI.

Reject false claims that current static items or recipes execute safety, cooking, spoilage, or preservation.

## Audit Domain 10: Economy, Services, And Gameplay Ownership

Map food-system responsibilities to the smallest appropriate owners:

- item identity and market posture;
- source relationships;
- recipes;
- consumable profiles;
- future nutrition/satiety profiles;
- bundle profiles;
- inventory commands;
- body-state engine;
- storage/spoilage state;
- gathering, hunting, fishing, butchery, cooking, and crafting attempts;
- economy, stock, pricing, services, inns, taverns, markets, and institutions;
- Knowledge and inspection;
- regional simulation;
- UI presentation.

Audit value, portability, labor, fuel, perishability, scarcity, rarity, prestige, service scale, reusable containers, coproducts, feed, and waste without inventing transactions or runtime stock.

## External Research Requirements

Use current repository evidence as the source of truth for current canon and behavior.

Use authoritative external sources for factual claims. Prefer:

- FAO, WHO, USDA FoodData Central, FDA, EFSA, and comparable official nutrition or food-safety authorities;
- peer-reviewed studies and consensus reviews for satiety, protein, fiber, water content, food volume, energy density, processing, dietary diversity, and meal composition;
- Kew Plants of the World Online, GBIF, FishBase, IUCN, USDA plant resources, and comparable taxonomic/ecological authorities where relevant;
- university, museum, archival, archaeological, and scholarly food-history sources for processing, preservation, storage, vessels, naming, cuisine, and foodways;
- edited or translated historical culinary texts only as evidence of patterns, never automatic game canon.

Avoid commercial recipe blogs, unsourced listicles, modern diet marketing, fandom wikis, and SEO summaries as authority.

For every important external claim:

- cite the source in the narrative report;
- add the source to the source index;
- record source type and limitations;
- distinguish direct evidence from game-design inference;
- paraphrase rather than copying long passages.

## Required Classification Vocabulary

Assign every audited identity or proposal one primary disposition:

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

Record confidence as `high`, `medium`, or `low`.

Record provenance as:

- `repository_fact`;
- `external_fact`;
- `bounded_design_inference`;
- `authored_input_required`;
- `unresolved`.

## Required Temporary Artifacts

Create exactly these research artifacts:

### 1. Narrative synthesis

`docs/dev/tmp-rich-culinary-dietary-system-research-2026-07-19.md`

It must contain:

- executive summary;
- exact repository baseline and methods;
- authority map;
- findings for all ten audit domains;
- unused/underutilized ingredient and recipe analysis;
- profile mismatch and collision analysis;
- nutrition/satiety evidence and three candidate models;
- food-state vocabulary recommendation;
- naming guide and examples;
- provisions-pack principles and candidate compositions;
- regional cuisine opportunity matrix;
- safety/storage/spoilage depth recommendation;
- owner/dependency matrix;
- candidate implementation packages;
- rejected complexity;
- uncertainties and explicit questions for GPT/human review;
- no implementation claims.

### 2. Machine-readable audit matrix

`docs/dev/tmp-rich-culinary-dietary-audit-matrix-2026-07-19.json`

Use a top-level object with:

- `generatedAt`;
- `startingCommit`;
- `methodNotes`;
- `summaryCounts`;
- `records`;
- `candidatePackages`;
- `openQuestions`.

Each `records` row should include where applicable:

- `entityType`;
- `id`;
- `itemKey`;
- `name`;
- `ownerPath`;
- `currentRoles`;
- `currentStage`;
- `currentConsumers`;
- `sourcePosture`;
- `edibilityPosture`;
- `preparationPosture`;
- `nutritionPosture`;
- `satietyPosture`;
- `safetyPosture`;
- `regionalPosture`;
- `namingPosture`;
- `collisionPosture`;
- `disposition`;
- `requiredAuthorities`;
- `confidence`;
- `provenance`;
- `evidenceNotes`.

Keep values explicit and JSON-valid. Use empty arrays or `null` rather than omitting fields inconsistently when a stable matrix shape is practical.

### 3. Source index

`docs/dev/tmp-rich-culinary-dietary-source-index-2026-07-19.md`

For each external source record:

- title;
- organization or authors;
- publication/update date;
- URL;
- source type;
- topic;
- supported claims;
- limitations;
- where used in the narrative report.

Also list important repository paths and what authority each provides.

Do not include long copyrighted quotations.

## Required Candidate Package Analysis

Recommend a bounded sequence and evaluate at least:

1. factual item/profile/taxonomy corrections;
2. generic ration and consumable-profile reconciliation;
3. named preserved-food and ingredient content;
4. bounded recipe expansion;
5. nutrition and satiety authority;
6. bundle-profile schema and validation;
7. open-pack inventory command;
8. regional cuisine and food-lore content;
9. storage, spoilage, and food-safety runtime only if justified.

For each package state:

- recommended label class under the versioning policy, without assigning a number;
- exact owner and scope;
- prerequisites;
- proposed files;
- required validation;
- risks;
- rollback boundary;
- whether it blocks or can remain independent of queued `0.6.6`;
- recommended order.

Select one smallest recommended first implementation package, but do not write its prompt and do not implement it.

## Allowed Tracked Files

Create or replace only:

- `docs/dev/tmp-rich-culinary-dietary-system-research-2026-07-19.md`;
- `docs/dev/tmp-rich-culinary-dietary-audit-matrix-2026-07-19.json`;
- `docs/dev/tmp-rich-culinary-dietary-source-index-2026-07-19.md`;
- `docs/dev/current-codex-output.md`.

Do not edit the research program, packed-food plan, current prompt, handoff, route register, sequenced plan, backlog, held `0.6.6` prompt, source content, schemas, validators, tests, runtime, UI, saves, dependencies, assets, or generated outputs.

Untracked local scratch scripts or command output may be used for analysis but must not be committed. Remove them before completion.

## Prohibited Scope

Do not add, remove, rename, or modify:

- items, market values, consumable profiles, spoilage profiles, recipes, flora, fauna, monsters, ecology, regions, biomes, habitats, workplaces, jobs, production chains, services, resources, commodities, skills, Knowledge, magic, starting bundles, or lore content;
- schemas, validators, lint registration, tests, engines, commands, events, inventory, body-state behavior, storage, economy, services, UI, saves, migrations, dependencies, assets, or gameplay;
- version labels or milestone gates;
- `0.6.6` or `0.6.7` content;
- retained Gate 1-5 or Gate 7 artifacts.

Do not infer nutritional numbers, recipe quantities, regional canon, edibility, toxicity, or cultural rules as implemented facts.

## Validation

1. Parse the JSON audit matrix with a strict JSON parser.
2. Verify every repository id/key/path cited in the matrix against the live repository.
3. Verify all dispositions use the required vocabulary and all confidence/provenance values use the required enums.
4. Verify summary counts reconcile with the matrix and narrative.
5. Verify every major external factual claim has a corresponding source-index entry.
6. Check for broken local markdown paths where feasible.
7. Run conflict-marker and trailing-whitespace searches.
8. Run `git diff --check`.
9. Review the complete changed-path set and full diff.
10. Confirm only the four allowed tracked files changed.

Do not run builds, typechecks, package installation, servers, generators, content lint, or the full test suite. This is a documentation research pass, not content validation or implementation.

## Stop Conditions

Stop and report rather than infer when:

- an ingredient’s source, safety, or edibility is ambiguous;
- a recipe lacks complete bounded authority;
- a food-looking name collides with another taxonomy;
- real-world evidence conflicts with current canon;
- a field has no clear owner;
- regional cuisine requires new cultural authorship;
- nutrition values would be invented without an accepted abstraction;
- the proposed system creates bookkeeping without meaningful gameplay;
- external source access is insufficient for a deep evidence-backed pass.

A partial, clearly bounded research report is preferable to fabricated completeness.

## Documentation And Completion

Overwrite `docs/dev/current-codex-output.md` with:

- run identity and date;
- branch and starting commit;
- label class `unversioned`;
- parent version `none`;
- milestone impact `supports_current_band`;
- files changed;
- commands and checks run;
- exact inventory highlights;
- research artifact paths;
- major findings;
- selected first implementation-package recommendation;
- unresolved questions;
- risks and limitations;
- confirmation that no content or behavior changed;
- next recommended run: `Rich Culinary And Dietary Research Results Audit`;
- suggested commit.

Do not overwrite this current prompt. Do not install the audit or implementation prompt. Leave route advancement to the next GPT/human review.

## Completion Report

Report starting commit/state, research method, exact artifact paths, inventory highlights, major authority/collision findings, nutrition/satiety model recommendation, naming and provisions direction, selected first implementation-package recommendation, source quality, files changed, checks, unchanged content/runtime behavior, unresolved questions, and suggested commit.