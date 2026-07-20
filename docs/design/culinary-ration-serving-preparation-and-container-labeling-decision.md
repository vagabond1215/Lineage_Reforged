# Culinary Ration, Serving Preparation, And Container Labeling Decision

Date: 2026-07-20

Status: accepted documentation-only design authority; no content, schema, validator, runtime, UI, save, economy, balance, or gameplay implementation permission

Run classification: unversioned focused design decision

Milestone impact: `supports_current_band`

## 1. Purpose And Precedence

This decision records the user's accepted corrections after inspection of the `Culinary Preparation, Portion, Meal Composition, Food Knowledge, And Historical Ration Integration Audit` at commit `a78b10714b5a6e587989d9c52f02f0d66fb9ea6a`.

It supplements:

- `docs/design/culinary-preparation-portion-meal-composition-and-food-knowledge-decision.md`;
- `docs/design/regional-ration-manifest-and-container-knowledge-decision.md`;
- `docs/design/packed-food-ration-and-provisions-content-plan.md`;
- `docs/design/item-equipment-inventory-authority-boundary-decision.md`;
- `docs/design/recipe-and-production-schema-decision.md`.

Where this document is more specific, it controls ration naming, calorie interpretation, meal-composition percentages, multi-serving preparation, artisan assortment naming, custom container labels, quantity vocabulary, process ownership, and package classification.

No implementation is authorized.

## 2. Meal Percentages Are Not A Daily-Calorie Scale

The intended `0-100%` controls in meal preparation describe ingredient allocation and composition. They do not establish a normalized daily-calorie scale.

Do not use a proposed ration value such as `22-38 points` merely because the live body-state rule currently uses `dailyCalories: 100`. That live value is an existing game-scale implementation detail requiring later migration or explicit conversion; it is not the accepted meaning of the preparation slider.

Authoritative nutrition should derive from physical amounts:

```text
ingredient nutrient contribution
  = amount consumed
  / nutrition basis amount
  * nutrient value per basis amount

meal nutrient total
  = sum of all ingredient contributions
```

This applies to:

- kilocalories;
- protein;
- fat;
- carbohydrate;
- hydration;
- later accepted nutrient or recovery properties.

The backend should use actual kilocalorie-scale values or a clearly documented exact conversion from them. It must not silently treat ingredient percentages as calories.

## 3. Provisional Daily Energy Posture

For later balance work, accept these user-authored approximations as practical game-design targets rather than universal historical facts:

- approximately `2,500 kcal/day` for an ordinary healthy active adult;
- approximately `3,500-4,000 kcal/day` for sustained high-intensity labor, loaded marching, armored military activity, heavy farming, threshing, construction, or comparable exertion;
- lower or higher demand may result from body size/composition, rest, injury, illness, age/life stage, climate, terrain, carried load, pace, combat, training, and recovery through accepted owners.

Historical evidence should inform context and uncertainty, but ordinary human physiology is sufficiently comparable for these bounded gameplay baselines. Exact balance values remain later work.

## 4. Ration Naming And Meaning

Retain these primary ration names:

- `Small Ration`;
- `Medium Ration`;
- `Large Ration`;
- `Party Ration`;
- `Large Party Ration`.

Do not prefer the following as ordinary item names:

- `Day Ration`;
- `Multi-Day Ration`;
- `Group Meal Provisions`;
- `Group Meal Container`;
- `Extra-Large Group Meal Container`;
- generic `Meal Pack` or `Ration Pack` suffixes when `Ration` already expresses the package.

### 4.1 Small, medium, and large rations

Small, medium, and large are logical portable package sizes. They are not mechanically exclusive to one eater.

- A `Small Ration` retains the semantic baseline of approximately one ordinary meal-sized package.
- A `Medium Ration` is a larger convenient food package and may be enough for several people during a short outing depending on appetite, activity, other food carried, and how it is divided.
- A `Large Ration` is a still larger portable package, not automatically a one-person day ledger or multi-day entitlement.

Every authored ration profile must eventually state its actual manifest, amount, energy, serving potential, preparation needs, and container requirements. Display size alone must not determine those mechanics.

### 4.2 Party rations

A `Party Ration` or `Large Party Ration` is a convenient short-duration assortment intended to be divided into several servings. It remains one inventory package or container manifest even though the display name does not include `container` or `pack`.

Party rations are intended to reduce inventory clutter and preparation time for short travel, camp meals, or brief quests. They do not replace expedition provisioning.

A party may reasonably carry multiple large party rations. For example, two large party rations plus personal snacks may cover several meal occasions for four to six travelers depending on exact manifests, activity, and appetite. Do not infer an exact duration from the name alone.

Party rations may be assembled or repacked from bulk provisions. Multiple nonperishable party rations may be placed into crates, wagons, pack-animal loads, or other logistics storage for longer travel.

## 5. Provisions Remain A Logistics Concept

Provisions describe the broader supply allocated to a journey, household, guild, military force, expedition, caravan, vessel, or other sustained purpose.

They should normally be represented by actual goods and containers, such as:

- sacks of grain or legumes;
- baskets of fruit;
- crates of smoked fish or meat;
- barrels of salted goods;
- casks of drink;
- cooking fats, spices, fuel, cookware, and serving ware;
- personal and party rations.

`Party Ration` is not a replacement for multi-day provisions. Longer journeys should rely on bulk goods, multiple containers, planned stops, reserves, and an assigned or rotating cook where appropriate.

This creates meaningful noncombat roles for cooks, porters, quartermasters, pack handlers, and other support characters without requiring combat specialization.

## 6. Multi-Serving Prepare Action

Do not create a separate new infrastructure system merely to split prepared food. Extend the accepted future `Prepare` action concept to support multiple servings.

The number of selected serving dishes or serving containers determines the number of outputs:

- one bowl normally represents one serving;
- two bowls represent two servings;
- a bowl and a plate represent two servings;
- two bowls and one plate represent three servings;
- another compatible combination creates the corresponding number of servings.

Serving vessels remain physical containers. Capacity, liquid-tightness, food-contact posture, and other compatibility checks still apply.

After preparation, servings may be:

- consumed by the preparer;
- given to party members;
- stored where physically and safely supported;
- discarded or otherwise handled through an accepted action.

## 7. Uniform And Individual Servings

The preparation interface should default to `Uniform Servings`.

### Uniform Servings

The selected ingredient amount is divided equally among all selected dishes, subject to:

- available amount;
- each vessel's capacity;
- minimum meaningful portions;
- whole-only constraints;
- physical compatibility;
- dietary exclusions selected for the preparation.

If a source sack contains an amount equal to `90%` of that sack's capacity and three equal servings use all of it, each serving receives an amount equal to `30%` of the sack's capacity. The backend stores physical amounts, not percentages.

### Individual Servings

An `Individual Servings` toggle permits different allocation per dish. Examples include:

- more protein and less fruit for one serving;
- no meat for one serving;
- reduced dairy for one serving;
- different portion sizes;
- different ingredients where the recipe or preparation permits substitution or omission.

The UI may use a matrix:

```text
Ingredient source | Bowl 1 | Bowl 2 | Plate 1
Smoked meat       | slider | slider | slider
Dried berries     | slider | slider | slider
Bread             | slider | slider | slider
Cheese            | slider | slider | slider
```

Ingredient sources are rows. Selected dishes are columns. Each allocation must resolve to deterministic physical units.

## 8. Two Distinct Percentage Views

Do not conflate source allocation and meal composition.

### 8.1 Source allocation

For each ingredient source, allocations across all servings must not exceed the available physical amount.

A UI may display each allocation as a percentage of:

- the source container's canonical capacity;
- the source's current remaining amount;
- or another clearly labeled reference.

The backend remains authoritative in count, mass, or volume.

### 8.2 Serving composition

Each completed serving may display a normalized composition totaling `100%`, calculated from the selected physical amounts using the chosen presentation basis.

The UI must label whether the composition is based on:

- mass;
- volume;
- another accepted physical basis.

Do not imply that composition percentage equals calorie percentage. A small amount of fat may contribute more calories than a larger amount of fruit or vegetables.

## 9. Quantity Vocabulary Correction

Accept the following separation:

- physical dimensions: `count`, `mass`, and `volume`;
- serving: an authored culinary reference amount that resolves to count, mass, or volume;
- bundle, batch, contained lot, and package: aggregation or packaging kinds, not physical dimensions;
- capacity: a physical dimension plus maximum canonical amount;
- amount: integer or fixed-point canonical basis units;
- display unit: localized or lore-facing presentation only;
- density: explicit optional conversion metadata, never a global assumption.

`Serving` is not a fourth physical dimension.

## 10. Preparation-Method Ownership Correction

Use one canonical reusable method owner.

Recommended authority direction:

- future `crafting.food_process_methods` owns reusable method identities such as baking, boiling, frying, smoking, drying, curing, fermenting, pickling, salting, sugaring, steaming, poaching, roasting, grilling, and specialist preparation;
- item food-state profiles reference those methods and own the resulting readiness, preservation effect, hazard outcome, and presentation relationship;
- recipes and production chains reference the same methods without copying or inheriting competing method definitions.

Do not create both `crafting.food_process_methods` and `items.food_process_methods` as canonical registries.

## 11. Static Food And Nutrition Package Boundary

The future static food-profile package should own:

- readiness;
- process-method references;
- preservation outcomes;
- hazard profiles;
- portionability.

It should not simultaneously own the later consumable-profile nutrition/satiety expansion.

A later meal/nutrition/difficulty package should own:

- serving-basis nutrient values;
- satiety amount and duration;
- meal aggregation result contracts;
- dietary exposure and monotony state contracts;
- body-state integration;
- difficulty controls.

## 12. Container Visibility Dependency Correction

Static container templates may own visibility and access capabilities such as:

- open-view;
- translucent;
- opaque;
- sample-accessible;
- non-destructively openable;
- destructively inspectable;
- sealed or lockable capability.

Those capabilities do not depend on character observation state. Later observation and inspection systems consume the capabilities.

Character-relative knowledge must not become a prerequisite for defining a container's static visibility.

## 13. Artisan Assortments

Artisan-themed baskets, bundles, bushels, bags, boxes, or packages are accepted where they identify a specialty producer or trade.

Examples of naming direction include:

- `Baker's Basket`;
- `Butcher's Bundle`;
- `Fisher's Basket`;
- `Cheesemaker's Basket`;
- another lore-native producer-specific assortment.

These names are examples and do not authorize adding content.

Artisan assortments are not automatically complete meals. A baker's basket may contain rolls, loaves, pastries, or other bakery goods. A butcher's bundle may contain cuts or preserved meat. An artisan assortment is a meal only when its authored manifest and preparation establish that it is one.

Do not create venue-based ration identities merely because an inn, tavern, restaurant-like establishment, or ordinary kitchen prepared them. Ordinary kitchens use the shared ration and meal naming conventions.

Perishable artisan assortments may provide variety and morale value during town stays or at the beginning or end of travel. Their likely short useful life does not authorize spoilage runtime before that owner exists.

## 14. Physical Container Identity And Custom Labels

Preparation and inventory screens should show the actual physical container identity by default, for example:

- `Burlap Sack`;
- `Hemp Sack`;
- `Wooden Crate`;
- `Wicker Basket`;
- `Glass Jar`;
- `Wooden Cask`.

A character may apply a custom label only when the required materials, tools, access, literacy or symbol knowledge, and relevant ability are available.

Possible labeling methods include:

- written tag or painted mark;
- engraving;
- carving;
- burning or branding;
- stamping;
- attached plaque or seal;
- another contextual method supported by the container and materials.

Examples:

```text
True identity: Wooden Crate
Custom label: Smoked Meats

True identity: Hemp Sack
Custom label: Grains
```

The custom label is mutable item-instance presentation metadata. It must not replace:

- the true container identity;
- contents manifest;
- origin;
- condition;
- ownership;
- character-relative knowledge.

Illiterate characters may still use accepted symbols, colors, brands, or recognized marks where supported. Exact literacy, crafting, labeling, fraud, and recognition checks remain later owner decisions.

## 15. Package Classification Correction

There is no valid `three-segment support package`.

- `Version X.Y.Z - Name` is a three-segment primary capability.
- `Version X.Y.Z.S - Name` is a four-segment support run attached to exactly one named primary parent.

Correct future classification posture:

- shared quantity foundation: candidate primary;
- static food-state/process/hazard/portion profiles: candidate primary;
- static container templates: candidate primary or an explicitly bounded part of another accepted primary;
- culinary catalog integrity repair: candidate support suffix attached to the exact static food-profile primary after that parent exists;
- item-instance truth and heterogeneous groups: candidate primary;
- starting-food manifest work: primary when it moves construction/ownership from UI to engine, or support only when it merely seeds content under an already implemented exact parent.

No numbers are assigned here.

## 16. Required Repair Of The Completed Audit

The temporary integration artifacts at commit `a78b10714b5a6e587989d9c52f02f0d66fb9ea6a` remain useful but require repair before durable promotion.

The repair must at minimum:

1. remove 100-point ration-energy recommendations;
2. distinguish composition percentages from physical nutrition calculations;
3. record the provisional 2,500 kcal active baseline and 3,500-4,000 kcal high-intensity band as user-authored balance posture, not universal history;
4. replace `Day Ration`, `Multi-Day Ration`, and `Group Meal Provisions` as preferred item names with the accepted size and party ration vocabulary;
5. distinguish party rations from sustained expedition provisions;
6. add uniform and individual multi-serving preparation;
7. model selected dishes as the number of servings created;
8. correct serving, process-owner, package-boundary, container-visibility, and label-class contradictions;
9. add artisan assortments and custom physical-container labels;
10. preserve no-opening-time RNG, per-unit truth, physical inventory, fraud/inspection, nutrition, and historical safety decisions.

## 17. Route And Non-Goals

The completed integration audit is not accepted for durable promotion until its contradictions are repaired and inspected.

`Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains paused and recoverable. Do not restore, modify, or consume it from this decision.

This document changes no item, recipe, consumable profile, source, ration, provision, container, starting bundle, schema, validator, test, runtime, inventory state, UI, save, economy, Knowledge, merchant, reputation, difficulty, dependency, asset, or gameplay behavior.