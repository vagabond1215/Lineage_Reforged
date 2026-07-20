# Current Codex Prompt

## Run Identity

`Culinary Preparation, Portion, Meal Composition, Food Knowledge, And Historical Ration Integration Audit`

Run classification: unversioned documentation-only research, repository audit, and design integration
Milestone impact: `supports_current_band`
Parent version: none

Run this as one bounded research-and-integration audit. Reconcile the accepted culinary research with the user's expanded decisions on preparation state, smoking and preservation, quantity units, ration scale, partial consumption, composed meals, physical containers, variety morale, fraud, inspection, nutrition, and historical food safety. Produce decision-ready temporary artifacts for GPT/human review. Do not implement content, schemas, validators, runtime, UI, saves, economy, balance, or gameplay.

Suggested commit:

`docs(food): audit culinary preparation portions and meal systems`

## Route Context

The original culinary research completed at commit `cd12ee015b11d96d93df05cc2911c7525e1133c2`.

The repair-and-acceptance audit completed at commit `9b73c80e5fc28b3f0951a0d308c0f693ce1493c5` and is accepted as corrected documentation input.

The controlling expanded user decision is:

- `docs/design/culinary-preparation-portion-meal-composition-and-food-knowledge-decision.md`.

It supplements:

- `docs/design/packed-food-ration-and-provisions-content-plan.md`;
- `docs/design/regional-ration-manifest-and-container-knowledge-decision.md`;
- `docs/design/item-equipment-inventory-authority-boundary-decision.md`;
- `docs/design/recipe-and-production-schema-decision.md`.

The earlier narrow `Food-Named Taxonomy And Consumable-Profile Integrity` package is no longer automatically implementation-ready. Sausage and comparable foods now require an accepted preparation/readiness/preservation model rather than a branch-only rename.

`Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains paused, not canceled. Its exact prompt remains recoverable from `docs/dev/held-0.6.6-monster-ecology-loot-prompt.md` and source blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

After this audit completes, stop for GPT/human review. Do not install an implementation prompt, assign a primary version, restore `0.6.6`, or modify the held prompt.

## Execution Gate

1. Read:
   - `AGENTS.md`;
   - `README.md`;
   - `docs/dev/current-codex-output.md`;
   - `docs/dev/current-gpt-handoff.md`;
   - `docs/dev/current-codex-prompt.md`;
   - `docs/dev/historical-version-and-deferred-route-register.md`;
   - `docs/design/internal-versioning-and-release-milestone-policy.md`;
   - `docs/design/rich-culinary-dietary-system-research-program.md`;
   - `docs/design/packed-food-ration-and-provisions-content-plan.md`;
   - `docs/design/regional-ration-manifest-and-container-knowledge-decision.md`;
   - `docs/design/culinary-preparation-portion-meal-composition-and-food-knowledge-decision.md`;
   - `docs/design/item-equipment-inventory-authority-boundary-decision.md`;
   - `docs/design/recipe-and-production-schema-decision.md`;
   - `docs/design/crafting-authority-boundary-decision.md`;
   - `docs/design/activity-resolution-depth-and-attempt-state-contract-plan.md`;
   - `docs/design/knowledge-framework-source-map.md`;
   - the three repaired culinary research artifacts;
   - the live owners named below.
2. Run `git status`, fetch, and fast-forward pull. Record starting commit, branch, and clean/dirty state. Preserve unrelated work.
3. Confirm the active prompt is this integration audit.
4. Confirm commit `9b73c80e5fc28b3f0951a0d308c0f693ce1493c5` is an ancestor of the current branch.
5. Confirm the expanded culinary decision exists and is unchanged before starting.
6. Confirm held `0.6.6` still resolves to blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
7. Confirm retained Gate 1-5 and Gate 7 artifacts remain solely assigned to `0.6.7`; do not edit, delete, consume, or repurpose them.
8. Inspect live repository owners before proposing fields or paths, including at minimum:
   - item definitions and consumable profiles;
   - recipes, production chains, workplaces, extraction, flora, fauna, and monsters;
   - inventory bags/stacks/overflow and shared item/inventory contracts;
   - body state and consumable application;
   - run difficulty and global difficulty rules;
   - skills, Knowledge, reputation, social/NPC, service/vendor, and economy boundaries;
   - new-game and starting inventory construction;
   - existing content lint and schema conventions.
9. Stop without editing if live authority materially contradicts this prompt. Report the smallest coordination repair required.

## Purpose

Produce an evidence-backed, owner-aware design integration that decides what must be static content, what must be item-instance state, what must be character-relative knowledge, and what must be an engine-owned action for the intended culinary system.

The result must distinguish:

- item identity from food state and display name;
- preparation method from preservation effect;
- readiness from biological or toxin risk;
- authored quantities from physical units and servings;
- static portionability from an instance's remaining amount;
- one physical package from an inventory presentation group;
- true manifest/origin/quality from character-observed identity;
- direct eating from non-heated preparation and cooking;
- personal rations from bulk provisions;
- meal diversity from total calories;
- historical character knowledge from hidden engine truth;
- accepted design from implementation permission.

## Required Workstream 1: Preparation, Readiness, Preservation, And Naming

Audit current item taxonomy and recommend an orthogonal food-state model.

At minimum evaluate:

- readiness/edibility state;
- preparation method identities;
- preservation effects;
- safety/risk requirements;
- character-facing authored names;
- regional, specialty, quality, luxury, fuel, and technique descriptors.

The model must support methods that overlap:

- smoking may cook and preserve;
- canning/jarring may use heat, make food ready to eat, and preserve;
- drying may preserve without cooking;
- fermenting, curing, salting, sugaring, and pickling may transform edibility and storage differently.

Do not recommend one mutually exclusive `raw/cooked/preserved` branch as the whole model.

Do not rely on display-name parsing.

Do not use a lone manually authored `isPreserved` flag when preservation can be derived or validated from controlled process metadata.

Propose how authored lexical variation such as `raw`, `uncooked`, `cooked`, `smoked`, `boiled`, `baked`, `poached`, `fried`, `steamed`, and specialty names such as `Applewood-Smoked Sausage Links` should map to controlled mechanics without auto-generating names.

Re-evaluate the three sausage collisions and similar item families under the recommended model. Do not edit item content.

## Required Workstream 2: Historical Energy Use And Ration Scale

Research historical energy requirements and provisioning using authoritative and appropriately limited sources.

Distinguish at minimum:

- baseline needs by body size, age, sex where relevant to the game model, climate, season, and health;
- heavy agricultural, construction, military, travel, hunting, gathering, craft, and sedentary activity;
- calories issued, carried, prepared, edible after waste, and actually consumed;
- household, military, maritime, pilgrimage, travel, market, noble, and institutional provisioning;
- variation across medieval and early-modern places and periods;
- preparation losses, inedible parts, spoilage, and unequal household distribution;
- modern MREs, protein bars, granola packs, bentos, packed lunches, and picnics as comparison only.

Do not claim one universal medieval calorie number.

The accepted provisional semantic is:

- a `small ration` is one meal for one person.

Research and recommend whether the later catalog should use:

- medium as one-person day ration;
- large as one-person multi-day ration;
- large as a shared meal for two or three people;
- extra-large as a shared meal for four to six people;
- clearer names such as Meal Ration, Day Ration, Multi-Day Ration, or Group Ration instead of relying on size alone.

Every recommendation must include intended eater count, intended meal/day coverage, and a bounded game-scale energy/portion band. Preserve uncertainty and do not finalize balance values as historical facts.

## Required Workstream 3: Cross-Domain Quantity And Unit Audit

Audit how quantities are currently represented across:

- cultivation and harvest;
- flora/fauna/monster outputs;
- extraction and gathering;
- production chains;
- player-facing recipes;
- inventory stacks;
- consumable profiles;
- market values and bulk containers;
- starting bundles.

Current recipe integers do not establish physical units. Determine whether the smallest coherent future contract needs controlled dimensions such as:

- count;
- mass;
- volume;
- serving;
- divisible unit;
- bundle;
- batch;
- container capacity;
- density/fill posture.

Recommend the owner and migration boundary. Culinary closure may lead if the contract remains extensible. Explicitly identify which nonculinary adjustments may be deferred and what compatibility debt that creates.

Do not alter current recipe quantities or infer historical conversion ratios from them.

## Required Workstream 4: Partial Consumption And Remaining Amount

Recommend a static and runtime contract for:

- whole-only consumables;
- portionable solids;
- pourable liquids or loose goods;
- stack-divisible small units;
- canonical total amount;
- minimum meaningful portion;
- remaining amount on an instance;
- opened state and later freshness/contamination interaction.

The UI may use a percentage slider, but recommend deterministic backend storage such as integer units or fixed-point basis units rather than free floating-point percentages.

Whole-only items must allow only none/all. Explain how apples, loaves, meat cuts, bowls of food, drinks, loose nuts, berries, sweets, and other representative foods should differ without inventing content changes.

## Required Workstream 5: Meal Action And Composition Flow

Design, but do not implement, one coherent food action surface with:

- Ready To Eat;
- Prepare;
- Cook.

Ready To Eat must support selecting multiple available foods and amounts in one eating occasion.

Prepare must cover non-heated composition such as salads, sandwiches, mixed rations, bowls, and combinations of ready-to-eat food. It must require selecting a compatible dish/container when one is physically required.

Cook must use the accepted recipe/workplace/tool/skill boundaries and identify the later owner for fuel, time, access, quality, failure, inventory mutation, and output creation.

The proposed preview must show:

- ingredients and amounts;
- calories/energy;
- protein, fat, carbohydrate, and hydration;
- hunger reduction;
- satiety and duration;
- morale and diversity effects;
- stamina/energy/recovery effects only where an accepted owner exists;
- safety and uncertainty known to the character;
- container capacity and compatibility.

Recommend a lore-friendly presentation layer without replacing backend carbohydrate truth with `grain` or `starch` when the food is fruit, honey, milk, roots, or another non-grain source.

## Required Workstream 6: Variety Morale And Food Fatigue

Propose a bounded model where:

- varied meals may improve morale;
- tiny token ingredients cannot be exploited;
- repeated high exposure to the same food gradually causes aversion or a morale penalty;
- dose matters;
- dominant ingredients matter more than minor ingredients;
- recency and repeated days matter;
- exposure decays over time;
- difficulty may reduce or disable the system.

Evaluate identity tracking by exact item, ingredient/source, food family, preparation method, meal role, and dominant share. Recommend the smallest model that prevents trivial renaming or preparation-method exploits while avoiding excessive simulation.

## Required Workstream 7: Containers, Gathering, And Physical Inventory

Audit the future container-template boundary and recommend capabilities needed for food and gathering, including:

- capacity;
- slot/bulk posture;
- liquid-tightness;
- food-safe posture;
- heat tolerance;
- open, closed, sealed, lockable, and resealable descriptors;
- allowed physical forms;
- nesting;
- visibility/inspectability;
- transfer and contamination posture.

Preserve physical inventory intent:

- loose berries, nuts, seeds, grain, flour, powders, and similar goods normally require a suitable container;
- liquids require liquid-tight containers;
- some whole items may be carried in a hand, pocket, belt, or pouch;
- bulk goods require sacks, baskets, crates, barrels, carts, wagons, pack animals, or storage;
- ordinary inventory is not magical;
- extradimensional containers remain later endgame/replay content.

Identify the smallest static container authority and the separate item-instance/runtime owner. Do not implement either.

## Required Workstream 8: Ration, Provision, Mixed, Hearty, Luxury, And Fresh Naming

Preserve these accepted meanings:

- ration: relatively small portable food package intended for personal use or carriage;
- provisions: bulk supplies named by actual container and content where possible;
- a provisions crate may contain personal rations but is not itself a personal ration;
- use exact names such as sacks of grain, crates of fish, baskets of fruit, barrels of meat, and casks of drink rather than generic `provisions` when contents are known.

Recommend context-sensitive mixed naming:

- Fresh Mixed Berries;
- Dried Mixed Berries;
- Mixed Nuts;
- Nuts and Berries or a lore-appropriate equivalent;
- exact two-part names such as Smoked Meat and Dried Berries;
- generic Mixed Ration only when the assortment is broader or intentionally undisclosed.

Preserve hearty as a high-energy, protein-supporting, filling, well-made cooked mixed meal with meaningful labor/skill, ingredient diversity, and morale value. Evaluate but do not require sauce/gravy for every valid hearty meal.

Preserve both luxury contexts:

- elite display luxury;
- attainable celebratory luxury for ordinary people.

The user's Earth-history list is illustrative only. Do not insert Earth proper names, regions, or recipes. Reuse live repository ingredients and lore where possible; mark new lore-native items as authored-input requirements.

Fresh/prepared naming direction:

- accept Market Fruit Bag;
- accept Fresh Produce Basket;
- accept Prepared Meal;
- accept Baker's Bundle;
- avoid Wrapped Meal, Prepared Meal Parcel, Inn Meal Parcel, and Cookshop Parcel as defaults.

Venue does not create a distinct recipe identity. Skill, ingredient quality, condition, serving, and presentation may differ.

## Required Workstream 9: Manifest Truth, Unknown Display Groups, And Stacking

Retain creation-time manifest resolution as the recommended repository-wide default. Opening-time RNG remains rejected unless the audit proves a concrete owner and benefit that outweighs replay, inspection, fraud, value, weight, and provenance costs.

Reconcile this with the accepted presentation rule:

- unknown containers that appear identical may share one visible inventory slot;
- hidden per-unit manifests may differ;
- per-unit truth must be preserved;
- identifying or opening one unit may split it into a more specific visible group;
- known units stack only when their observed/known identity is compatible;
- bulk lots may intentionally contain identical or highly correlated contents based on source context.

Distinguish physical stack identity, heterogeneous instance group, and UI presentation group. Recommend exact owner boundaries and validation without implementing them.

## Required Workstream 10: True Identity, Character Knowledge, Fraud, Inspection, And Reputation

Do not defer fraud, smuggling, substitution, counterfeit presentation, or deceptive packing as setting concepts.

Recommend an owner-aware model separating:

- true item identity, origin, manifest, quality, and condition;
- seller claim or label;
- character observation;
- knowledge/certainty;
- evidence and inspection results;
- seller deception skill/method;
- buyer Knowledge, skill, experience, and exposure;
- seller reputation and ethical tendency;
- institution, guild, market, government, or trading-commission context;
- difficulty configuration.

Ordinary recognition should be automatic when exposure and skill make the answer obvious. Altered, unfamiliar, or contested goods may require checks.

Evaluate context-sensitive inspection actions such as sample viewing, deeper sack/crate inspection, smell, taste, weight, seal/mark/document review, and consultation. Account for container access, destructive opening, seller permission, deposits, transaction timing, offense, trust, and refusal.

Difficulty must be capable of disabling fraud or controlling frequency, sophistication, magnitude, inspection forgiveness, and quality/spoilage substitution severity.

Do not invent a global omniscient merchant-reputation score visible to every new character.

## Required Workstream 11: Starting Goods And Difficulty

Audit current starting inventory and difficulty/prestige owners.

Recommend how starting food and containers may vary by:

- difficulty;
- spawn region;
- prestige/incremental legacy upgrades;
- future background;
- institution, lineage, or scenario where supported.

Do not add starting items before ration/container nomenclature and quantity semantics are accepted. Fixed starting manifests should remain known and balance-stable.

## Required Workstream 12: Nutrition, Satiety, And Difficulty

Use the moderate model as the intended direction.

At minimum retain backend posture for:

- calories/energy;
- protein;
- fat;
- carbohydrate;
- hydration;
- portion size;
- satiety amount;
- satiety duration.

Audit current body-state and difficulty owners. Recommend where later effects on recovery, sustained activity, fatigue, muscle development, strength adaptation, and coarse deficiency belong without implementing them.

Nutrition and monotony pressure must be adjustable or disableable through difficulty. Numeric macros need not always be character-facing.

Do not recommend detailed micronutrient simulation as the default.

## Required Workstream 13: Historical Food Safety And Dangerous Foods

Research historically appropriate food-safety practice and presentation without giving characters modern germ-theory knowledge.

Separate hidden engine risk from character-facing period knowledge based on smell, visible condition, tradition, preservation, season, household discipline, trust, and experience.

Evaluate higher noble-house safety as an outcome of better supply, staff, storage, inspection, water, ingredients, and waste tolerance rather than universal modern scientific knowledge.

Recommend an orthogonal risk model containing at minimum:

- safe as presented;
- requires ordinary cooking;
- requires non-heat processing;
- requires specialist preparation;
- conditionally edible;
- unknown;
- biological contamination/pathogen risk;
- parasite risk;
- toxin/poisonous-part risk;
- venom or harmful secretion where appropriate to fantasy biology;
- spoilage;
- environmental/chemical contamination;
- physical hazards;
- residual risk after processing.

The model must support foods that remain dangerous after ordinary cooking, foods safe only in selected parts or amounts, and outcomes dependent on cook skill and preparation success.

Do not infer that every poisonous, venomous, monster-derived, mushroom, fish, plant, or animal part becomes safe through heat.

## Required Workstream 14: Owner Matrix And Package Sequence

Produce an explicit owner matrix for candidate concepts, including:

- static item identity;
- preparation/readiness method authority;
- preservation effect;
- safety/hazard profile;
- consumable nutrition profile;
- portionability;
- remaining amount;
- composed meal definition/instance;
- dietary exposure history;
- container template;
- inventory instance/group;
- true/observed identity;
- seller claim and reputation;
- inspection action;
- meal preparation/cooking/opening/consumption commands;
- body state and difficulty.

For each proposed package provide:

- label-class recommendation without assigning a number;
- exact owner and scope;
- prerequisites;
- proposed files;
- validation;
- tests or research checks;
- risks;
- rollback boundary;
- relation to held `0.6.6`;
- provenance;
- readiness: implementation-ready, design-ready only, or blocked.

Rebuild the dependency sequence. Do not assume the old taxonomy/profile correction remains first. Select the smallest later package only after deciding whether the preparation-state and quantity contracts are prerequisites.

## External Evidence Discipline

Use authoritative primary or high-quality secondary sources where available.

For every historical or scientific source record:

- title;
- author/institution;
- publication date;
- access date;
- URL or stable identifier;
- source type;
- exact claim supported;
- geographic/period scope;
- limitations;
- whether it informs historical context, modern physiology comparison, or game-design inference.

Prefer archival records, academic books/articles, museum/university materials, government/health nutrition references for modern physiology comparison, and clearly scoped historical syntheses.

Do not present modern dietary guidance as medieval practice. Do not present one army, monastery, ship, estate, or city account as universal.

## Required Artifacts

Create exactly these temporary artifacts:

1. `docs/dev/tmp-culinary-preparation-portion-meal-integration-2026-07-20.md`
2. `docs/dev/tmp-culinary-historical-energy-ration-source-index-2026-07-20.md`
3. `docs/dev/tmp-culinary-quantity-container-knowledge-audit-2026-07-20.json`

Also overwrite:

4. `docs/dev/current-codex-output.md`

The artifacts remain temporary. Do not promote them into durable authority, modify the accepted decision documents, delete earlier culinary artifacts, or install an implementation prompt.

## Required JSON Shape

The quantity/container/knowledge audit JSON should use a stable top-level object containing at minimum:

- `metadata`;
- `liveOwners`;
- `quantitySystems`;
- `foodStateConcepts`;
- `portionabilitySamples`;
- `containerCapabilityNeeds`;
- `knowledgeAndFraudConcepts`;
- `candidatePackages`;
- `openDecisions`;
- `summary`.

Each proposed concept must identify:

- concept id;
- current owner or `none`;
- repository evidence;
- proposed owner;
- static versus instance versus character-relative versus command state;
- dependencies;
- implementation readiness;
- provenance/confidence;
- risk of duplication or owner conflict.

All repository paths and ids must resolve, or proposed paths must be explicitly prefixed `future:`.

## Allowed Tracked Files

Modify or create only:

- `docs/dev/tmp-culinary-preparation-portion-meal-integration-2026-07-20.md`;
- `docs/dev/tmp-culinary-historical-energy-ration-source-index-2026-07-20.md`;
- `docs/dev/tmp-culinary-quantity-container-knowledge-audit-2026-07-20.json`;
- `docs/dev/current-codex-output.md`.

Do not modify:

- `docs/dev/current-codex-prompt.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/historical-version-and-deferred-route-register.md`;
- any design authority;
- any existing culinary research artifact;
- the held `0.6.6` prompt;
- any content, schema, validator, test, runtime, UI, save, economy, dependency, asset, or generated file.

## Validation

At minimum:

- parse the new JSON strictly;
- reconcile summary counts against row data;
- verify every local path and referenced live id;
- ensure proposed non-live paths use `future:`;
- verify Markdown local links;
- sample every owner/state/readiness category;
- verify no historical claim lacks source scope and limitations;
- verify no Earth proper-name example is proposed as repository content;
- verify no display-name parsing is proposed as mechanics;
- verify no single mutually exclusive raw/cooked/preserved taxonomy is presented as sufficient;
- verify heterogeneous unknown groups preserve per-unit truth;
- verify no opening-time reroll is required;
- verify the package graph is acyclic;
- verify changed paths are exactly the four allowed files;
- run conflict-marker, trailing-whitespace, and `git diff --check` review.

Do not run builds, typechecks, application lint, generators, servers, dependency installation, or automated runtime tests unless a repository change unexpectedly makes them necessary; source implementation is prohibited.

## Stop Conditions

Stop and report rather than guessing if:

- historical evidence cannot support a bounded recommendation;
- current quantity semantics cannot be reconciled without a broader cross-domain decision;
- current inventory cannot conceptually preserve per-unit truth for heterogeneous visible groups;
- the proposed preparation model duplicates a live owner;
- a fraud/inspection concept conflicts with accepted Knowledge, reputation, or social authority;
- an exact first implementation package cannot be selected without user authorship.

## Required Output Summary

`docs/dev/current-codex-output.md` must state:

- source run;
- date;
- branch/status assumption;
- label class and parent;
- milestone impact;
- files changed;
- checks run;
- historical source quality and limitations;
- owner conflicts found;
- accepted decisions preserved;
- open user decisions;
- selected smallest later package and readiness, or why none is ready;
- relation to held `0.6.6`;
- suggested commit message;
- next recommended run.

## Non-Goals

- no item, recipe, consumable-profile, source, ration, provision, container, starting-bundle, or merchant content changes;
- no branch/subbranch taxonomy edits;
- no schema, validator, content-lint, or test changes;
- no nutrition, satiety, morale, monotony, deficiency, spoilage, contamination, fraud, inspection, reputation, inventory, stacking, gathering, cooking, preparation, consumption, or container runtime;
- no UI/menu implementation;
- no save or migration changes;
- no version number assignment;
- no restoration of `0.6.6`;
- no deletion or promotion of temporary artifacts.