# Current Codex Prompt

## Run Identity

`Culinary Integration Results Repair And Contract Acceptance Audit`

Run classification: unversioned documentation-only repair, coordination, and acceptance audit

Milestone impact: `supports_current_band`

Parent version: none

Run this as one bounded repair of the completed culinary integration artifacts. Reconcile the audit at commit `a78b10714b5a6e587989d9c52f02f0d66fb9ea6a` with the accepted ration, serving, percentage, calorie, preparation, artisan-assortment, container-labeling, owner-boundary, and version-class corrections. Do not implement content, schemas, validators, runtime, UI, saves, economy, balance, or gameplay.

Suggested commit:

`docs(food): repair culinary integration results and contracts`

## Route Context

The completed integration audit produced useful repository evidence and historical sourcing, but GPT/human inspection found blocking contradictions:

- a meal-composition `0-100%` control was confused with the live `dailyCalories: 100` body-state scale;
- `serving` was both a physical dimension and a culinary reference amount;
- preparation methods were assigned to competing crafting and item owners;
- static food profiles and consumable-profile nutrition expansion overlapped;
- container visibility depended backwards on character observation;
- two candidate packages used the invalid phrase `three-segment support package`;
- size/coverage ration recommendations were presented as accepted when they were not;
- the audit did not include the accepted multi-serving preparation, party-ration, artisan-assortment, and custom-container-label direction.

The controlling focused correction is:

- `docs/design/culinary-ration-serving-preparation-and-container-labeling-decision.md`.

It supplements:

- `docs/design/culinary-preparation-portion-meal-composition-and-food-knowledge-decision.md`;
- `docs/design/regional-ration-manifest-and-container-knowledge-decision.md`;
- `docs/design/packed-food-ration-and-provisions-content-plan.md`;
- `docs/design/item-equipment-inventory-authority-boundary-decision.md`;
- `docs/design/recipe-and-production-schema-decision.md`;
- `docs/design/crafting-authority-boundary-decision.md`;
- `docs/design/internal-versioning-and-release-milestone-policy.md`.

The original culinary research completed at commit `cd12ee015b11d96d93df05cc2911c7525e1133c2`. The first repair completed at commit `9b73c80e5fc28b3f0951a0d308c0f693ce1493c5`. The integration audit completed at commit `a78b10714b5a6e587989d9c52f02f0d66fb9ea6a`.

`Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains paused, not canceled. Its exact prompt remains recoverable from `docs/dev/held-0.6.6-monster-ecology-loot-prompt.md` and source blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

After this repair completes, stop for GPT/human inspection. Do not install an implementation prompt, create the future durable acceptance decision, assign a primary version, restore `0.6.6`, or modify the held prompt.

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
   - `docs/design/regional-ration-manifest-and-container-knowledge-decision.md`;
   - `docs/design/packed-food-ration-and-provisions-content-plan.md`;
   - `docs/design/item-equipment-inventory-authority-boundary-decision.md`;
   - `docs/design/recipe-and-production-schema-decision.md`;
   - `docs/design/crafting-authority-boundary-decision.md`;
   - the three temporary integration artifacts named under Allowed Tracked Files;
   - the earlier repaired culinary artifacts as read-only context where needed.
2. Run `git status`, fetch, and fast-forward pull. Record branch, starting commit, and clean/dirty state. Preserve unrelated work.
3. Confirm the active prompt is this repair-and-acceptance audit.
4. Confirm commit `a78b10714b5a6e587989d9c52f02f0d66fb9ea6a` is an ancestor of the current branch.
5. Confirm the focused correction decision exists and is unchanged before starting.
6. Confirm held `0.6.6` still resolves to blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
7. Confirm retained Gate 1-5 and Gate 7 artifacts remain solely assigned to `0.6.7`; do not edit, delete, consume, or repurpose them.
8. Stop without editing if a live repository fact materially contradicts the focused correction. Report the smallest coordination repair required.

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

## Repair 9: Artisan Assortments

Add the accepted direction for specialty producer assortments, including examples such as:

- `Baker's Basket`;
- `Butcher's Bundle`;
- `Fisher's Basket`;
- `Cheesemaker's Basket`.

These are naming examples only and do not authorize content.

Artisan assortments are not automatically meals. Their manifest determines whether they are ingredients, ready foods, preserved goods, perishables, or a complete meal.

Do not reintroduce inn-, tavern-, restaurant-, or ordinary-kitchen-specific ration identities. Ordinary kitchens use shared meal and ration naming.

Perishable artisan assortments may provide variety or morale value during town stays or near the start/end of travel, but do not implement spoilage.

## Repair 10: Physical Container Labels

Preparation and inventory examples should use true physical identities such as:

- `Burlap Sack`;
- `Hemp Sack`;
- `Wooden Crate`;
- `Wicker Basket`;
- `Glass Jar`;
- `Wooden Cask`.

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
- starting-food manifests: primary if ownership moves from UI to engine, or support only if it merely seeds content under an implemented exact parent.

Do not assign version numbers.

## Repair 12: Open Decisions

Resolve or remove questions already answered by the focused correction:

- serving is a culinary reference, not a physical dimension;
- process-method owner is crafting;
- meal percentages are not calorie points;
- accepted ration names are Small, Medium, Large, Party, and Large Party Ration;
- party rations and expedition provisions are distinct;
- multi-serving preparation uses selected vessels plus uniform/individual allocation;
- package classification cannot use three-segment support.

Retain only genuine open decisions, such as:

- exact mass and volume basis units and fixed-point scales;
- exact first process vocabulary and method parameters;
- method-to-hazard reduction and residual rules;
- exact representative fixtures;
- transient versus packaged ad hoc meal persistence;
- item-observation persistence and Knowledge integration;
- appraisal/inspection skills and Knowledge domains;
- diversity thresholds and decay bands;
- difficulty mappings;
- exact ration manifests, sizes, calories, serving potential, and balance.

## Required Artifact Results

Repair exactly these existing files:

1. `docs/dev/tmp-culinary-preparation-portion-meal-integration-2026-07-20.md`
2. `docs/dev/tmp-culinary-historical-energy-ration-source-index-2026-07-20.md`
3. `docs/dev/tmp-culinary-quantity-container-knowledge-audit-2026-07-20.json`
4. `docs/dev/current-codex-output.md`

Do not create additional artifacts.

The Markdown integration artifact must present one coherent corrected model and package sequence.

The source index must preserve source quality, scope, limitations, and links. It may add a clearly separated user-authored game-balance posture but must not misrepresent 2,500 or 3,500-4,000 kcal as universal medieval findings.

The JSON must preserve its stable top-level shape unless a correction requires a backward-compatible field addition. All counts must reconcile.

`current-codex-output.md` must summarize the repair, remaining open decisions, package readiness, and why no implementation is yet authorized.

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
- verify artisan assortments are not automatically meals or venue-based ration identities;
- verify no opening-time RNG is required;
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
- remaining open decisions;
- selected smallest later package and readiness;
- relation to held `0.6.6`;
- suggested commit message;
- next recommended run.

## Non-Goals

- no item, recipe, consumable-profile, ration, provision, artisan-assortment, container, starting-bundle, source, or region content edits;
- no calorie, nutrition, ration, ingredient, portion, container, or difficulty balance implementation;
- no schema, validator, content-lint, or test changes;
- no runtime, inventory, item-instance, meal, cooking, preparation, consumption, transfer, labeling, inspection, fraud, Knowledge, reputation, or body-state behavior;
- no UI/menu implementation;
- no save or migration changes;
- no version number assignment;
- no restoration of `0.6.6`;
- no new temporary artifact;
- no deletion or promotion of existing temporary artifacts.