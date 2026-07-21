# Current Codex Prompt

## Run Identity

`Culinary Integration Results Repair And Contract Acceptance Audit`

Run classification: unversioned documentation-only repair, coordination, and acceptance audit

Milestone impact: `supports_current_band`

Parent version: none

Run this as one bounded repair of the completed culinary integration artifacts. Reconcile the audit at commit `a78b10714b5a6e587989d9c52f02f0d66fb9ea6a` with the accepted ration, serving, percentage, calorie, preparation, mystery-assortment, stock-window, contextual-quality, container-labeling, owner-boundary, and version-class corrections. Do not implement content, schemas, validators, runtime, UI, saves, economy, balance, or gameplay.

Suggested commit:

`docs(food): repair culinary integration results and contracts`

## Route Context

The completed integration audit produced useful repository evidence and historical sourcing, but GPT/human inspection found blocking contradictions and omissions:

- a meal-composition `0-100%` control was confused with the live `dailyCalories: 100` body-state scale;
- `serving` was both a physical dimension and a culinary reference amount;
- preparation methods were assigned to competing crafting and item owners;
- static food profiles and consumable-profile nutrition expansion overlapped;
- container visibility depended backwards on character observation;
- two candidate packages used the invalid phrase `three-segment support package`;
- size/coverage ration recommendations were presented as accepted when they were not;
- the audit did not include the accepted multi-serving preparation, party-ration, mystery-assortment, contextual-quality, finite-stock, stock-window, cross-domain producer, and custom-container-label direction.

The controlling focused corrections are:

- `docs/design/culinary-ration-serving-preparation-and-container-labeling-decision.md`;
- `docs/design/artisan-mystery-assortment-stock-and-quality-decision.md`.

They supplement:

- `docs/design/culinary-preparation-portion-meal-composition-and-food-knowledge-decision.md`;
- `docs/design/regional-ration-manifest-and-container-knowledge-decision.md`;
- `docs/design/packed-food-ration-and-provisions-content-plan.md`;
- `docs/design/item-equipment-inventory-authority-boundary-decision.md`;
- `docs/design/economy-authority-boundary-decision.md`;
- `docs/design/recipe-and-production-schema-decision.md`;
- `docs/design/crafting-authority-boundary-decision.md`;
- `docs/design/internal-versioning-and-release-milestone-policy.md`.

The original culinary research completed at commit `cd12ee015b11d96d93df05cc2911c7525e1133c2`. The first repair completed at commit `9b73c80e5fc28b3f0951a0d308c0f693ce1493c5`. The integration audit completed at commit `a78b10714b5a6e587989d9c52f02f0d66fb9ea6a`.

`Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains paused, not canceled. Its exact prompt remains recoverable from `docs/dev/held-0.6.6-monster-ecology-loot-prompt.md` and source blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

After this repair completes, stop for GPT/human inspection. Do not install an implementation prompt, create the future durable contract-acceptance decision, assign a primary version, restore `0.6.6`, or modify the held prompt.

## Execution Gate

1. Read:
   - `AGENTS.md`;
   - `README.md`;
   - `docs/dev/current-codex-output.md`;
   - `docs/dev/current-gpt-handoff.md`;
   - `docs/dev/current-codex-prompt.md`;
   - `docs/dev/historical-version-and-deferred-route-register.md`;
   - `docs/design/internal-versioning-and-release-milestone-policy.md`;
   - `docs/design/culinary-preparation-portion-meal-composition-and-food-knowledge-decision.md`;
   - `docs/design/culinary-ration-serving-preparation-and-container-labeling-decision.md`;
   - `docs/design/artisan-mystery-assortment-stock-and-quality-decision.md`;
   - `docs/design/regional-ration-manifest-and-container-knowledge-decision.md`;
   - `docs/design/packed-food-ration-and-provisions-content-plan.md`;
   - `docs/design/item-equipment-inventory-authority-boundary-decision.md`;
   - `docs/design/economy-authority-boundary-decision.md`;
   - `docs/design/recipe-and-production-schema-decision.md`;
   - `docs/design/crafting-authority-boundary-decision.md`;
   - the three temporary integration artifacts named under Allowed Tracked Files;
   - the earlier repaired culinary artifacts as read-only context where needed.
2. Run `git status`, fetch, and fast-forward pull. Record branch, starting commit, and clean/dirty state. Preserve unrelated work.
3. Confirm the active prompt is this repair-and-acceptance audit.
4. Confirm commit `a78b10714b5a6e587989d9c52f02f0d66fb9ea6a` is an ancestor of the current branch.
5. Confirm both focused correction decisions exist and are unchanged before starting.
6. Confirm held `0.6.6` still resolves to blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
7. Confirm retained Gate 1-5 and Gate 7 artifacts remain solely assigned to `0.6.7`; do not edit, delete, consume, or repurpose them.
8. Stop without editing if a live repository fact materially contradicts either focused correction. Report the smallest coordination repair required.

## Repair 1: Percentage And Nutrition Semantics

Remove every implication that the meal-preparation `0-100%` control defines a daily calorie scale or that ration energy should be authored as percentages of the live `dailyCalories: 100` value.

Record two distinct percentage views:

1. **Source allocation** — how much of an available ingredient source is allocated across selected servings. Allocations must not exceed the available physical amount.
2. **Serving composition** — a normalized presentation of the completed serving's ingredient shares using an explicitly labeled physical basis.

The backend remains authoritative in count, mass, or volume. Percentages are UI controls or derived presentation, not stored nutritional truth.

Nutrition must be calculated as:

```text
ingredient contribution
  = amount consumed
  / nutrition basis amount
  * nutrient value per basis amount

meal total
  = sum of all ingredient contributions
```

Apply this to kilocalories, protein, fat, carbohydrate, hydration, and later accepted nutrition fields.

Treat the live `dailyCalories: 100` value as an observed legacy game-scale body-state rule, not accepted future calorie authority.

## Repair 2: Provisional Kilocalorie Posture

Record these as user-authored game-design approximations, not universal historical facts:

- approximately `2,500 kcal/day` for an ordinary healthy active adult;
- approximately `3,500-4,000 kcal/day` for sustained high-intensity labor, loaded marching, armored military activity, heavy farming, threshing, construction, or comparable exertion.

Retain activity, body, climate, injury, illness, age/life-stage, load, terrain, pace, combat, training, and recovery as future modifiers under accepted owners.

Do not invent exact ration kilocalorie bands in this repair. Exact manifests and balance remain later work.

The historical source index may retain its scoped evidence and limitations. Clearly separate historical evidence from the accepted user-authored balance posture.

## Repair 3: Ration And Provision Nomenclature

Use these accepted primary ration names:

- `Small Ration`;
- `Medium Ration`;
- `Large Ration`;
- `Party Ration`;
- `Large Party Ration`.

Do not recommend the following as ordinary item names:

- `Day Ration`;
- `Multi-Day Ration`;
- `Group Meal Provisions`;
- `Group Meal Container`;
- `Extra-Large Group Meal Container`;
- redundant generic `Meal Pack` or `Ration Pack` suffixes.

Small, medium, and large are logical portable package sizes, not exclusive eater counts. Preserve `Small Ration` as approximately one ordinary meal-sized package, but state that any ration may be shared or divided according to circumstances.

A medium ration may serve multiple people during a short outing depending on appetite, activity, other food carried, and actual manifest. Do not turn medium or large into a one-person day or multi-day ledger by name.

A `Party Ration` and `Large Party Ration` are convenient short-duration multi-serving assortments. They reduce inventory clutter and preparation time but do not replace expedition provisions.

Provisions remain the multi-container logistics supply for sustained travel, households, guilds, military forces, expeditions, caravans, or vessels. Prefer actual container/content identities for the constituent goods.

Party rations may be repacked from bulk provisions, and multiple nonperishable party rations may be placed in crates, wagons, pack-animal loads, or other logistics storage.

## Repair 4: Multi-Serving Prepare Action

Add the accepted extension of the future `Prepare` action without proposing a separate infrastructure system.

The number of selected serving vessels determines the number of servings created:

- one bowl creates one serving;
- two bowls create two servings;
- two bowls and one plate create three servings;
- another compatible vessel combination creates the corresponding number of servings.

The action defaults to `Uniform Servings` and may toggle to `Individual Servings`.

### Uniform Servings

Divide selected ingredients equally among compatible selected vessels, subject to available physical amounts, capacity, whole-only constraints, minimum portions, physical form, and dietary exclusions.

Example: a source sack containing an amount equal to `90%` of its capacity divided among three equal servings contributes an amount equal to `30%` of the sack's capacity to each. The backend stores the physical amount.

### Individual Servings

Permit per-vessel allocation, including:

- more protein and less fruit;
- no meat;
- reduced dairy;
- different portion sizes;
- supported substitutions or omissions.

Describe the candidate UI as ingredient-source rows and selected-vessel columns with deterministic amount controls. Do not implement UI.

Prepared servings may be consumed, given to party members, stored where supported, or handled by another accepted action.

## Repair 5: Quantity Contract

Use:

- physical dimensions: `count`, `mass`, `volume`;
- serving: an authored culinary reference resolving to count, mass, or volume;
- bundle, batch, contained lot, and package: aggregation or packaging kinds;
- capacity: dimension plus maximum canonical amount;
- amount: integer or fixed-point canonical basis units;
- display unit: presentation only;
- density: explicit optional conversion only.

Remove every statement that lists `serving` as a fourth physical dimension.

OD-02 or its equivalent should be resolved as accepted, not left as an unresolved binary question.

## Repair 6: Preparation Method Owner

Use one canonical owner direction:

- future `crafting.food_process_methods` owns reusable method identities;
- item food-state profiles reference methods and own resulting readiness, preservation effect, hazard outcome, and presentation relationship;
- recipes and production chains reference the same method identities without inheritance or duplicate registries.

Remove proposed canonical `items.food_process_methods` paths and any competing owner language.

The exact first vocabulary may remain an acceptance question, but the owner family is no longer open.

## Repair 7: Static Food Versus Nutrition Boundary

The static food-profile package owns:

- readiness;
- process-method references;
- preservation outcomes;
- hazard profiles;
- portionability.

It does not own consumable-profile v2 nutrient/satiety fields.

The later meal/nutrition/difficulty package owns:

- serving-basis nutrition;
- satiety amount and duration;
- meal aggregation result contracts;
- dietary exposure and monotony contracts;
- body-state integration;
- difficulty controls.

Repair package scopes, dependencies, proposed files, and rollback boundaries accordingly.

## Repair 8: Container Visibility Dependency

Static container templates own visibility and access capabilities such as open-view, translucent, opaque, sample-accessible, non-destructively openable, destructively inspectable, sealable, and lockable.

These capabilities do not depend on character observation state.

Later observation and inspection systems consume the capabilities. Reverse any dependency that makes static container visibility depend on `knowledge.observation` and verify the corrected package graph remains acyclic.

## Repair 9: Artisan And Producer Mystery Assortments

Replace the previous treatment of artisan assortments as merely themed names with the accepted constrained randomized-manifest model.

### Direct known lots

Record that direct known store lots coexist with mystery assortments. Examples include a single loaf, half-dozen or dozen rolls or muffins, a measured sack, a known bolt of cloth, a known hide, stated boards, or stated metal stock. These have exact known manifests unless fraud separately creates a discrepancy.

### Mystery manifests

An artisan or producer assortment is a physical package with a true manifest resolved and persisted when merchant stock is generated. If future stock remains abstract until purchase, resolution may occur during the sale transaction immediately before ownership transfer. Opening-time RNG remains prohibited.

Opening reveals existing truth. Save/load, transfer, inspection, value, weight, fraud, and provenance operate against that persisted truth.

### Three-tier template

Record one reusable default three-tier assortment template. A producer may expose only two tiers when appropriate, but every exposed tier must map explicitly.

Use contextual selection bands rather than one universal quality meaning:

- `band_0`: clearance, scrap, day-old, irregular, seconds, or least desirable but honestly saleable goods;
- `band_1`: ordinary, standard, fresh, or serviceable trade quality;
- `band_2`: fine, select, premium, specialty, or unusually useful/expensive quality;
- `band_3`: rare, exceptional, prestige, luxury, or masterwork-adjacent outcome.

Candidate default per-slot weights:

| Offer tier | `band_0` | `band_1` | `band_2` | `band_3` | Floor |
| --- | ---: | ---: | ---: | ---: | --- |
| Clearance | 68% | 27% | 4% | 1% | `band_0` |
| Standard Artisan | 0% | 72% | 23% | 5% | `band_1` |
| Select | 0% | 0% | 80% | 20% | `band_2` |

Treat these as accepted candidate defaults for later balancing, not implemented values. Preserve increasing minimum band and rare chance by tier.

The future profile must define constrained slot pools, quantities, duplicate rules, value bounds, producer/trade eligibility, region/season/event conditions, package identity, and knowledge posture. Do not select arbitrary items from the entire catalog.

### Contextual quality

Assortment bands do not replace domain-specific quality. Record category-specific examples:

- baker/pastrymaker/confectioner: freshness, flour refinement, enrichment, bake quality, decoration, ingredient rarity, size and consistency;
- butcher/fishmonger/cheesemaker: freshness, cut, yield, fat/cure/smoke/aging, source rarity, condition;
- apothecary/herbalist/spice merchant/alchemist: purity, freshness, potency, rarity, provenance, processing, contamination/adulteration, seals/documents;
- tailor/weaver/leatherworker: fiber/hide, usable dimensions, weave/tan/dye/finish, condition, consistency, rarity;
- carpenter/joiner/woodworker: species, dryness, straightness, dimensions, defects, finish, scarcity;
- smith/foundry/metalworker: material/alloy, purity, usable mass/dimensions, defects, processing stage, finish, scarcity, workmanship.

### Culinary and nonculinary scope

Include broader culinary producer examples such as baker, pastrymaker or patisserie-equivalent, confectioner, chocolatier or lore-native equivalent, butcher, fishmonger, cheesemaker, brewer, spice merchant, grocer, farmer, orchardist, herbalist, apothecary, alchemist, and specialty preserver where live authority later supports them.

Include nonculinary reuse examples such as:

- `Scrap Textiles`, `Tailor's Scrap Bundle`, `Leather Scraps`, `Assorted Textiles`, `Fine Cloth Selection`, or `Fine Tanned Leather Selection`;
- wood scraps, carpenter's offcuts, ordinary wood stock, and select joinery wood;
- metal scrap, smith's scrap crate, ordinary metal stock, and selected processed or fine forged stock;
- potter's seconds, glassworker's cullet/offcuts, cooper, fletcher, chandler, scribe/bookbinder, mason, jeweler, lapidary, enchanter, or magitech assortments only where later authority permits.

These are examples only and do not authorize content.

### Ingredient and production surplus

Record that producers may offer ingredient/material surplus assortments in addition to finished-goods assortments. A baker's ingredient bag may contain controlled approved inputs such as flour, eggs, sweetener, fats, fruit, nuts, or spices only when the producer actually uses or stocks them. Finished-output and input-surplus pools remain distinct.

### Stock and time windows

Separate assortment tier from stock posture:

- clearance/day-old/surplus/scrap/seconds: finite opening or rollover stock, normally no same-day replenishment, short availability window, intended to disappear quickly through future demand or deterministic withdrawal/expiry;
- fresh/standard: finite production-batch stock with authored replenishment intervals;
- select/luxury/event: very limited, may appear only during narrow hours, busy periods, market days, festivals, commissions, catering, noble/guild events, or leftovers from such work, and may be absent on ordinary days.

Do not claim simulated NPC sell-through already exists. Record deterministic finite stock and withdrawal windows as a valid interim design posture until economy/runtime demand owns sell-through.

### Honest clearance versus fraud

Low-tier assortments are not automatically unsafe, rotten, fraudulent, or useless. Honest day-old food, cosmetic seconds, short cloth, leather/wood offcuts, irregular goods, and mixed small quantities remain saleable for their stated purpose.

Undisclosed rot, contamination, false origin, unusable filler, or deceptive top layers belong to fraud and inspection. A declared tier never authorizes results below its stated floor.

### Pricing posture

Record expected-value direction without exact prices:

- clearance usually discounted for age, irregularity, uncertainty, or mixed usability;
- standard near ordinary expected trade value with variance;
- select may charge a premium for the higher floor, rarity chance, scarcity, convenience, prestige, or packaging;
- expected-value bounds and duplicate caps should prevent trivial infinite-profit loops;
- appraisal, reputation, fraud, and haggling remain separate.

Do not implement stock, prices, schedules, RNG, or content.

## Repair 10: Physical Container Labels And Vocabulary

Preparation and inventory examples should use true physical identities. The list is explicitly illustrative and non-exhaustive.

Examples may include:

- pouch, packet, bag, sack, satchel, bundle;
- basket, bushel container, hamper;
- box, case, chest, crate;
- jar, bottle, flask, jug, crock, pot;
- keg, cask, barrel;
- bale, bolt, roll, rack;
- another suitable personal, storage, or transport container supported later.

The package identity must match the actual goods and capabilities. A basket is not used merely because it sounds artisanal.

Add future custom labels as mutable item-instance presentation metadata, gated later by materials, tools, access, literacy or symbol knowledge, and relevant ability.

Possible methods include written tags, paint, engraving, carving, burning, branding, stamping, plaques, and seals.

Examples:

```text
True identity: Wooden Crate
Custom label: Smoked Meats

True identity: Hemp Sack
Custom label: Grains
```

A custom label must not replace true identity, manifest, origin, condition, ownership, or character-relative knowledge.

## Repair 11: Package Label Classes

Remove every use of `three-segment support package` or equivalent.

Use only:

- three-segment current-band primary capability; or
- four-segment support suffix attached to exactly one named primary parent.

Correct candidate posture:

- shared quantity foundation: candidate primary;
- static food-state/process/hazard/portion profiles: candidate primary;
- static container templates: candidate primary or explicitly bounded part of another accepted primary;
- culinary catalog integrity: candidate support suffix attached to the exact future static food-profile parent after that parent exists;
- item-instance truth and heterogeneous groups: candidate primary;
- starting-food manifests: primary if ownership moves from UI to engine, or support only if it merely seeds content under an implemented exact parent;
- cross-domain artisan mystery-assortment profiles, stock generation, or merchant inventory behavior: do not classify as culinary implementation automatically; identify the exact future owner and dependency before assigning primary/support posture.

Do not assign version numbers.

## Repair 12: Owner And Package Sequence Additions

Add the cross-domain assortment concepts to the owner matrix and package analysis without creating implementation authority.

Distinguish at minimum:

- static assortment profile: tier, slot pools, weights, floors, quantity ranges, duplicate rules, value bounds, producer/category eligibility, and package reference;
- static producer/category quality mapping: how contextual bands map to category-specific attributes;
- merchant stock instance: resolved manifest, condition, price quote, availability window, seller claim, and current stock identity;
- economy/production schedule: batch generation, replenishment, withdrawal, event release, and future demand/sell-through;
- character-relative knowledge: known tier, observed contents, appraisal evidence, and certainty;
- engine command: purchase/transfer/open/inspect without rerolling truth.

Identify whether the future assortment foundation is best owned by a reusable market/economy assortment authority with culinary and nonculinary consumers. Do not create a culinary-only random-box owner that would later be duplicated for textiles, wood, metal, apothecary goods, or other producers.

Rebuild dependencies so persisted item/lot truth exists before opening and so stock scheduling does not become a prerequisite for static assortment profile authorship.

## Repair 13: Open Decisions

Resolve or remove questions already answered by the focused corrections:

- serving is a culinary reference, not a physical dimension;
- process-method owner is crafting;
- meal percentages are not calorie points;
- accepted ration names are Small, Medium, Large, Party, and Large Party Ration;
- party rations and expedition provisions are distinct;
- multi-serving preparation uses selected vessels plus uniform/individual allocation;
- package classification cannot use three-segment support;
- artisan assortments are randomized constrained manifests, not only themed names;
- direct known lots coexist with mystery assortments;
- opening-time RNG is prohibited;
- container examples are non-exhaustive;
- assortment quality is contextual by producer/category;
- clearance, standard, and select tiers increase floor and rare chance;
- tier and stock window are separate concepts;
- the framework is reusable outside culinary trades.

Retain only genuine open decisions, such as:

- exact mass and volume basis units and fixed-point scales;
- exact first culinary process vocabulary and method parameters;
- method-to-hazard reduction and residual rules;
- exact representative culinary fixtures;
- transient versus packaged ad hoc meal persistence;
- item-observation persistence and Knowledge integration;
- appraisal/inspection skills and Knowledge domains;
- diversity thresholds and decay bands;
- difficulty mappings;
- exact ration manifests, sizes, calories, serving potential, and balance;
- exact assortment slot counts and quantity ranges;
- whether the default tier weights require later adjustment after simulation;
- exact static assortment-profile and contextual-quality owner paths;
- exact stock-generation, replenishment, event-release, and demand owners;
- exact producer/category catalogs and lore-native names;
- exact expected-value and price-variance bounds.

## Required Artifact Results

Repair exactly these existing files:

1. `docs/dev/tmp-culinary-preparation-portion-meal-integration-2026-07-20.md`
2. `docs/dev/tmp-culinary-historical-energy-ration-source-index-2026-07-20.md`
3. `docs/dev/tmp-culinary-quantity-container-knowledge-audit-2026-07-20.json`
4. `docs/dev/current-codex-output.md`

Do not create additional artifacts.

The Markdown integration artifact must present one coherent corrected model and package sequence, including the cross-domain assortment owner boundary without turning the culinary audit into nonculinary implementation.

The source index must preserve source quality, scope, limitations, and links. It may add a clearly separated user-authored game-balance posture but must not misrepresent 2,500 or 3,500-4,000 kcal as universal medieval findings. The mystery-assortment direction is user-authored game design and does not require fabricated historical sourcing.

The JSON must preserve its stable top-level shape unless a correction requires a backward-compatible field addition. All counts must reconcile.

`current-codex-output.md` must summarize the repair, remaining open decisions, package readiness, cross-domain assortment boundary, and why no implementation is yet authorized.

## Allowed Tracked Files

Modify only:

- `docs/dev/tmp-culinary-preparation-portion-meal-integration-2026-07-20.md`;
- `docs/dev/tmp-culinary-historical-energy-ration-source-index-2026-07-20.md`;
- `docs/dev/tmp-culinary-quantity-container-knowledge-audit-2026-07-20.json`;
- `docs/dev/current-codex-output.md`.

Do not modify:

- `docs/dev/current-codex-prompt.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/historical-version-and-deferred-route-register.md`;
- `AGENTS.md`;
- any design authority;
- earlier culinary artifacts;
- retained Gate artifacts;
- the held `0.6.6` prompt;
- any content, schema, validator, test, runtime, UI, save, economy, dependency, asset, or generated file.

## Validation

At minimum:

- parse the repaired JSON strictly;
- reconcile every summary count against row data;
- verify all local paths and live ids;
- require `future:` prefixes for non-live paths;
- verify Markdown local links;
- verify there is no 100-point ration-energy recommendation;
- verify percentages are allocation/composition only;
- verify nutrition derives from physical amount and per-basis values;
- verify `serving` is not a physical dimension;
- verify only one canonical preparation-method owner is proposed;
- verify static food profiles do not duplicate nutrition/satiety ownership;
- verify container visibility has no backwards observation dependency;
- verify no three-segment support classification exists;
- verify Party Ration and Large Party Ration are used and Day/Multi-Day/Group Meal Provisions are not preferred item names;
- verify provisions remain sustained logistics supplies;
- verify selected dishes determine serving count and both uniform/individual allocation are represented;
- verify source allocations cannot exceed available amount;
- verify custom labels do not replace true container identity;
- verify the container vocabulary is explicitly non-exhaustive;
- verify direct known lots and mystery assortments coexist;
- verify mystery manifests resolve before opening and opening never rerolls;
- verify clearance/standard/select tiers have increasing floors and rare chances;
- verify contextual bands do not replace category-specific quality truth;
- verify tier is separate from stock/replenishment/release-window posture;
- verify day-old/surplus stock is finite and time-sensitive without falsely claiming live NPC demand;
- verify fresh stock is finite and replenishment-based;
- verify select/luxury stock may be narrow-hour, event, commission, catering, or leftover based;
- verify honest clearance is separate from fraud and unsafe goods;
- verify culinary and nonculinary assortment consumers share one proposed reusable owner direction;
- verify artisan assortments are not automatically meals or venue-based ration identities;
- verify no opening-time RNG is required anywhere;
- verify per-unit truth remains required;
- verify the package graph is acyclic;
- verify exactly the four allowed files changed;
- run conflict-marker, trailing-whitespace, and `git diff --check` review.

Do not run builds, typechecks, application lint, generators, servers, dependency installation, or runtime tests unless an unexpected repository condition makes them necessary. Implementation is prohibited.

## Required Output Summary

`docs/dev/current-codex-output.md` must state:

- source run;
- date;
- branch/status assumption;
- label class and parent;
- milestone impact;
- files changed;
- checks run;
- exact contradictions repaired;
- accepted user decisions incorporated;
- historical-source limitations;
- corrected package classifications and dependencies;
- reusable assortment owner and stock-window boundary;
- remaining open decisions;
- selected smallest later package and readiness;
- relation to held `0.6.6`;
- suggested commit message;
- next recommended run.

## Non-Goals

- no item, recipe, consumable-profile, ration, provision, direct store lot, mystery assortment, producer, profession, store stock, container, starting-bundle, source, or region content edits;
- no calorie, nutrition, ration, ingredient, portion, assortment, chance-weight, stock, price, schedule, container, or difficulty balance implementation;
- no schema, validator, content-lint, or test changes;
- no runtime, inventory, item-instance, merchant-stock, economy, meal, cooking, preparation, consumption, transfer, labeling, inspection, fraud, Knowledge, reputation, or body-state behavior;
- no UI/menu implementation;
- no save or migration changes;
- no version number assignment;
- no restoration of `0.6.6`;
- no new temporary artifact;
- no deletion or promotion of existing temporary artifacts.