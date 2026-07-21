# Current Codex Prompt

## Run Identity

`Culinary Integration Final Contract And Action-Surface Repair Audit`

Run classification: unversioned documentation-only final repair, coordination, and acceptance audit

Milestone impact: `supports_current_band`

Parent version: none

Run this as one final bounded repair of the completed culinary integration artifacts at commit `b92b1344613669114641230a2e67f8ed77e7ae00`.

Reconcile the remaining command-owner, generic item-instance dependency, selected-package prerequisite, kilocalorie/nutrition-owner, artifact-metadata, and contextual action-surface defects. Do not implement content, schemas, validators, runtime, UI, saves, economy, balance, dependencies, or gameplay.

Suggested commit:

`docs(food): finalize culinary integration contracts and action surfaces`

## Route Context

The integration audit and first bounded repair produced useful evidence and a largely coherent model. GPT/human inspection accepts the repaired percentage, quantity, ration, preparation-method, container, mystery-assortment, stock-window, contextual-quality, and historical-source direction.

The remaining blockers are narrow:

1. food actions and assortment commands both claim generic `Open`, `Transfer`, and `Inspect` operations;
2. generic item-instance truth incorrectly depends on static food profiles, despite cross-domain use by textiles, wood, metal, seeds, apothecary goods, containers, and merchant assortments;
3. the selected acceptance package uses a stale `OD-01 through OD-06` prerequisite range even though OD-02 was removed and observation persistence must be considered;
4. canonical nutritional energy and owner boundaries remain ambiguous because some text still says `game-scale energy` and makes static consumable profiles appear to own aggregation, exposure, body-state effects, and difficulty controls;
5. repaired artifact metadata still carries the earlier date/classification in places;
6. the temporary artifacts do not yet reflect the accepted contextual inventory, crafting, workplace, location, NPC, and storefront action-surface direction.

## Controlling Decisions

Read and follow:

- `docs/design/contextual-action-surfaces-inventory-crafting-and-trade-decision.md`;
- `docs/design/culinary-ration-serving-preparation-and-container-labeling-decision.md`;
- `docs/design/artisan-mystery-assortment-stock-and-quality-decision.md`;
- `docs/design/culinary-preparation-portion-meal-composition-and-food-knowledge-decision.md`;
- `docs/design/regional-ration-manifest-and-container-knowledge-decision.md`;
- `docs/design/packed-food-ration-and-provisions-content-plan.md`;
- `docs/design/item-equipment-inventory-authority-boundary-decision.md`;
- `docs/design/crafting-authority-boundary-decision.md`;
- `docs/design/recipe-and-production-schema-decision.md`;
- `docs/design/economy-authority-boundary-decision.md`;
- `docs/design/activity-resolution-depth-and-attempt-state-contract-plan.md`;
- `docs/design/player-travel-boundary-clarification.md`;
- `docs/design/internal-versioning-and-release-milestone-policy.md`.

The exact held `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` prompt remains paused and recoverable from `docs/dev/held-0.6.6-monster-ecology-loot-prompt.md` and blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

After this repair, stop for GPT/human inspection. Do not install an implementation prompt, create the future durable contract-acceptance decision, assign a version, restore `0.6.6`, or modify the held prompt.

## Execution Gate

1. Read:
   - `AGENTS.md`;
   - `README.md`;
   - `docs/dev/current-codex-output.md`;
   - `docs/dev/current-gpt-handoff.md`;
   - `docs/dev/current-codex-prompt.md`;
   - `docs/dev/historical-version-and-deferred-route-register.md`;
   - every controlling decision listed above;
   - the three temporary artifacts named under Allowed Tracked Files.
2. Run `git status`, fetch, and fast-forward pull. Record branch, starting commit, and clean/dirty state. Preserve unrelated work.
3. Confirm the active prompt is this final repair audit.
4. Confirm commit `b92b1344613669114641230a2e67f8ed77e7ae00` is an ancestor of the current branch.
5. Confirm `docs/design/contextual-action-surfaces-inventory-crafting-and-trade-decision.md` exists unchanged before starting.
6. Confirm the two earlier focused culinary correction decisions exist unchanged.
7. Confirm held `0.6.6` still resolves to blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
8. Confirm retained Gate 1-5 and Gate 7 artifacts remain solely assigned to `0.6.7`; do not edit, delete, consume, or repurpose them.
9. Stop without editing if a live repository fact materially contradicts the controlling decisions. Report the smallest coordination repair required.

## Repair 1: Contextual Action-Surface Direction

Record that the preferred player-facing direction is contextual item-, entity-, workplace-, and location-driven action exposure rather than a permanent global food or crafting menu.

A filtered food inventory view may later exist for convenience, but it is not a separate command owner.

Selecting a physical inventory item may expose only currently valid actions such as:

- `Eat` or `Drink`;
- `Open` or `Close`;
- `Inspect`;
- `Split`, `Combine`, `Pour`, or `Transfer`;
- `Store`, `Take Out`, or `Drop`;
- `Label`;
- an eligible hand-crafting action.

The item or inventory UI is the invocation surface only. It does not calculate nutrition, execute crafting, invent observations, resolve trade, or reroll manifests.

Do not place universal `Give`, `Trade`, `Buy`, `Sell`, or `Barter` buttons in the ordinary item menu.

Giving is initiated through a party-member or NPC interaction. Buying, selling, and bartering are initiated through a storefront, merchant, market, or NPC transaction context.

Only valid or meaningfully explainable unavailable actions should appear. Prefer omitting impossible actions over persistent disabled-button clutter.

## Repair 2: Command Ownership

Replace duplicate command ownership with these command families.

### Generic item-instance commands

Own:

- open and close;
- seal and unseal;
- split and combine compatible lots;
- pour or transfer between owned or permitted containers;
- move, store, take out, and drop;
- apply or remove custom labels;
- inspect a lawfully held or accessible item and record contextually available observations.

Generic item commands operate against item-instance truth, container capabilities, permissions, and observation rules. They do not execute recipes, calculate nutrition, or resolve sales.

### Food consumption commands

Own:

- Eat, Drink, and other item-appropriate consumption verbs;
- consumed amount and whole-only validation;
- exact decrement or remaining amount;
- aggregated nutrient and satiety application;
- food-safety consequences and character-facing uncertainty;
- dietary exposure and morale effects where enabled.

They are invoked from a selected ready-to-eat item or convenience ready-food filter.

Do not make the food-actions package own generic Open, Close, Transfer, Inspect, Give, Buy, Sell, or Barter.

### Crafting and process commands

Own:

- hand crafting from selected materials or components;
- non-heated food preparation;
- cooking;
- preservation processes;
- workplace and station transformations;
- recipe, material, tool, skill, access, fuel, time, and outcome resolution.

`Prepare`, `Cook`, `Preserve`, `Smoke`, `Dry`, `Pickle`, `Ferment`, `Bake`, `Boil`, `Fry`, `Steam`, and comparable transformations surface through selected ingredients, tools, portable apparatus, recipes, or accessible workplaces. They are not permanent global food-menu buttons.

### Character and party interaction commands

Own recipient selection and social context for giving or offering an item or prepared serving. They invoke an inventory transfer after the recipient and amount are accepted.

### Market and transaction commands

Own:

- browse stock presentation;
- buy;
- sell;
- barter;
- seller-controlled inspection permission;
- price/funds/offer validation;
- transaction ownership transfer;
- commercial consequences such as refusal, offense, deposit, claim, fraud, and reputation context.

Market inspection may invoke the generic item observation resolver after access is granted. Market commands must not duplicate generic held-item Open, Transfer, or Inspect execution.

### Location and travel commands

Own:

- travel to a known building or destination;
- enter and exit;
- look around;
- context discovery and interruption handling.

Do not make food, inventory, crafting, or market packages own local travel.

## Repair 3: Inventory-Selected Hand Crafting

Record the accepted invocation direction:

- select a material, ingredient, component, or suitable tool;
- expose a crafting verb only when at least one known recipe or process can use it;
- show recipes that use the selected item as one input;
- permit a toggle between all known applicable recipes and only recipes whose materials/tools/access conditions are currently satisfied;
- gather remaining inputs through explicit selection;
- never imply the selected item is the only ingredient.

Example references such as selecting a suitable stone to reveal an eligible stone-arrowhead recipe are illustrative only and authorize no content.

The crafting resolver remains authoritative for recipe knowledge, input selection, tools, station access, time, success/failure, and inventory mutation.

## Repair 4: Workplace And Culinary Context

Record that fixed-station crafting appears from an accessible location, workplace, facility, furnishing, station, or selected recipe.

Cooking and preservation become available only when the character has the required station and contextual access, including permission or authority where relevant.

Candidate station contexts may include kitchens, hearths, campfires, fireplaces, ovens, smokehouses, drying areas, worktables, forges, anvils, looms, tanning facilities, and alchemical stations where later authority supports them.

Workplace presence does not prove permission, vacancy, reservation, staffing, fuel, tools, or ownership.

The accepted multi-serving preparation model remains intact:

- selected serving vessels determine output count;
- Uniform Servings is the default;
- Individual Servings permits per-vessel allocation;
- source allocations cannot exceed physical amount;
- prepared servings may be consumed, stored, placed, or given through a separate character interaction.

## Repair 5: Storefront And NPC Interaction Surface

Record the documentation-only interaction direction:

1. A player may select a known building from a district, coordinate, map, or known-building directory.
2. Local travel resolves by distance and ticks through the travel owner.
3. Contextual micro-events may later interrupt travel, but exact events and chances are not designed here.
4. If travel resolves and the destination is open and enterable, the character may enter.
5. Arrival may present a short entity-aware contextual narrative based on authoritative location, time, occupants, activity, stock, and relationship state.
6. A compact first-level shop context may expose:
   - `Browse Goods`;
   - `Talk to [NPC]`;
   - `Look Around`;
   - `Exit`.
7. `Look Around` may reveal additional selectable people, displays, furniture, counters, cabinets, desks, goods, and exits without putting every action in the first-level menu.
8. `Browse Goods`, `Browse Wares`, or `Browse Equipment` presents current observable stock, including direct known lots and persisted mystery assortments.
9. Talking to the merchant may expose Buy, Sell, Barter, Converse, Request Service/Inspection, or Leave where context permits.

Browsing does not transfer ownership. Narrative presentation must not invent entities, stock, relationships, or events absent from authoritative state.

Do not implement travel, events, narrative generation, shops, NPC actions, stock, or UI in this repair.

## Repair 6: Generic Item-Instance Dependency

Correct the package graph so generic item-instance truth and heterogeneous presentation groups do not depend on static food profiles.

Generic item-instance truth should depend on:

- the shared quantity foundation;
- generic item/container instance contracts where required.

It should own or support:

- instance ids;
- canonical and remaining amount;
- container contents and mutable state;
- creation-time true manifests;
- condition and provenance references;
- per-unit truth beneath visible groups;
- save/load and transfer identity boundaries.

Static food profiles, merchant stock, textiles, leather, wood, metal, seeds, apothecary goods, mystery assortments, and later domains consume generic item-instance truth. Food profiles are not a prerequisite for nonfood instances.

Food-specific consumption, readiness, hazard, spoilage, or exposure behavior may depend on both item-instance and food authorities later.

## Repair 7: Canonical Nutritional Energy And Owners

Use canonical authored nutritional energy in kilocalories unless a later durable decision accepts an explicit exact conversion contract.

Treat the live `dailyCalories: 100` body-state value as legacy compatibility only. Do not call the accepted future food value `game-scale energy` without explicitly distinguishing the adapter.

Preserve the physical-basis formula:

```text
ingredient contribution
  = amount consumed
  / nutrition basis amount
  * nutrient value per basis amount

meal total
  = sum of all ingredient contributions
```

Separate owners:

- static consumable/nutrition profiles: per-basis kilocalories, protein, fat, carbohydrate, hydration, and static satiety parameters where later accepted;
- meal resolver: aggregation of selected consumed amounts;
- dietary exposure state: monotony and variety history;
- body-state owner: intake, hunger, satiety, energy demand, recovery, fatigue, starvation, and physiological effects;
- difficulty owner: switches and scalars for nutrition pressure, monotony, food risk, and forgiveness.

Do not make one static consumable-profile concept own aggregation, exposure history, body-state mutation, and difficulty configuration.

The user-authored approximations remain:

- about `2,500 kcal/day` for an ordinary healthy active adult;
- about `3,500-4,000 kcal/day` for sustained high-intensity labor or loaded military activity.

They are design anchors, not universal historical findings.

## Repair 8: Selected Acceptance Package Prerequisites

Remove the stale phrase `OD-01 through OD-06`.

Use explicit prerequisite decision ids.

The selected `Culinary Quantity, Food-State, And Instance Contract Acceptance Decision` should require at minimum:

- `OD-01` — exact mass/volume bases, scales, and display conversions;
- `OD-03` — first controlled process vocabulary and parameters;
- `OD-05` — method-to-hazard reduction and residual rules;
- `OD-06` — representative schema fixtures;
- `OD-07` — item-observation persistence and Knowledge boundary.

Include `OD-04` only if that acceptance decision intentionally owns transient versus packaged ad hoc meal persistence. Otherwise leave OD-04 for the later food-action contract.

Do not use a numerical range when decision ids are non-contiguous.

## Repair 9: Artifact Metadata

Retain the original filenames and original artifact date where useful, but distinguish:

- original artifact date: `2026-07-20`;
- first repair date: `2026-07-21`;
- final repair date: the actual run date;
- current source run: `Culinary Integration Final Contract And Action-Surface Repair Audit`;
- current classification: unversioned documentation-only final repair, coordination, and acceptance audit.

Update JSON metadata and narrative headings consistently without changing the stable top-level JSON shape unless a backward-compatible metadata addition is required.

The `acceptedRepairCommit` or equivalent provenance should include the repaired source commit `b92b1344613669114641230a2e67f8ed77e7ae00` rather than relying only on the earlier `9b73c80...` repair.

## Repair 10: Package Sequence

Rebuild the candidate package graph with these boundaries:

1. durable contract acceptance decision;
2. shared quantity foundation;
3. generic static container templates and generic item-instance truth without food-profile coupling;
4. static food-state/process-reference/hazard/portion profiles as a culinary consumer of quantity and generic instance/container foundations;
5. reusable market/economy assortment profiles and contextual-quality mappings;
6. merchant stock instances using generic item-instance truth;
7. knowledge/fraud/inspection contract;
8. meal/nutrition/difficulty contract;
9. culinary catalog integrity support package after its exact static-food parent exists;
10. generic item-instance commands;
11. food consumption and crafting/process commands as separate owner families;
12. market transaction commands;
13. starting manifest work only after the relevant owners exist.

The exact ordering may use parallel branches where dependencies allow, but the graph must remain acyclic.

Do not create one broad food-actions package that owns generic inventory, trade, travel, crafting, and social interactions.

## Repair 11: Preserve Previously Accepted Direction

Preserve without reopening:

- physical dimensions are count, mass, and volume;
- serving is an authored culinary reference;
- percentages are allocation/composition presentation, not calories;
- one crafting-owned process-method registry;
- orthogonal readiness, process, preservation, hazard, and authored naming;
- Small, Medium, Large, Party, and Large Party Ration nomenclature;
- provisions as sustained multi-container logistics;
- selected-vessel multi-serving preparation;
- pre-opening persisted manifests and no opening-time RNG;
- direct known lots alongside mystery assortments;
- clearance/standard/select candidate tier weights and floors;
- contextual quality by producer/category;
- finite clearance windows, batch-replenished standard stock, and narrow select/event stock;
- honest clearance separate from fraud;
- non-exhaustive physical-container vocabulary;
- custom labels do not replace true identity;
- one reusable cross-domain assortment owner direction;
- valid three-segment primaries and exact-parent four-segment support suffixes only.

## Required Artifact Results

Repair exactly these existing files:

1. `docs/dev/tmp-culinary-preparation-portion-meal-integration-2026-07-20.md`
2. `docs/dev/tmp-culinary-historical-energy-ration-source-index-2026-07-20.md`
3. `docs/dev/tmp-culinary-quantity-container-knowledge-audit-2026-07-20.json`
4. `docs/dev/current-codex-output.md`

Do not create additional artifacts.

The Markdown integration artifact must present one coherent corrected action, command, quantity, nutrition, item-instance, culinary, assortment, and package model.

The source index should change only where needed to clarify that kilocalorie anchors are user-authored and that contextual UI/action decisions are not historical findings.

The JSON must preserve its stable top-level shape unless a backward-compatible metadata field is necessary. All counts must reconcile.

`current-codex-output.md` must summarize the final repair, remaining open decisions, package readiness, and why implementation remains unauthorized.

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
- any design authority;
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
- verify exact changed-path scope;
- verify no duplicate command owner claims generic Open, Transfer, or Inspect;
- verify generic item-instance truth has no dependency on static food profiles;
- verify held-item inspection and merchant inspection permission are separated but may reuse one observation resolver;
- verify Give is character-interaction-owned and Buy/Sell/Barter are transaction-owned;
- verify hand crafting is invoked from selected materials/components and fixed crafting from accessible workplaces/stations;
- verify food consumption is invoked from selected ready items rather than requiring a global food menu;
- verify impossible actions are not recommended as permanent clutter;
- verify local travel, arrival, Browse Goods, Talk, Look Around, and Exit remain documentation-only contextual surfaces;
- verify canonical authored nutritional energy is kilocalories or explicitly deferred to an exact conversion contract;
- verify legacy `dailyCalories: 100` is compatibility-only;
- verify static nutrition, meal aggregation, exposure history, body state, and difficulty have distinct owner directions;
- verify the selected acceptance package uses explicit non-contiguous OD ids;
- verify artifact dates and classifications distinguish original and repair provenance;
- verify previously accepted ration, quantity, process, assortment, stock, fraud, label, and version rules remain intact;
- verify no opening-time RNG is required;
- verify per-unit truth remains required;
- verify the package graph is acyclic;
- run conflict-marker, trailing-whitespace, and `git diff --check` review.

Do not run builds, typechecks, application lint, generators, servers, dependency installation, or runtime tests unless an unexpected repository condition makes them necessary. Implementation is prohibited.

## Required Output Summary

`docs/dev/current-codex-output.md` must state:

- source run and dates;
- branch/status assumption;
- label class and parent;
- milestone impact;
- files changed;
- checks run;
- exact final contradictions repaired;
- contextual action-surface decisions incorporated;
- corrected command-owner matrix;
- corrected generic item-instance dependency;
- canonical kilocalorie and nutrition-owner posture;
- corrected explicit open-decision prerequisites;
- corrected package graph and readiness;
- remaining open decisions;
- relation to held `0.6.6`;
- suggested commit message;
- next recommended run.

## Non-Goals

- no item, recipe, ration, provision, assortment, producer, profession, store, NPC, building, event, container, stock, or starting-bundle content;
- no calorie, portion, assortment, chance, stock, price, schedule, travel, event, or difficulty balancing;
- no schema, validator, lint, test, loader, runtime, command, save, migration, inventory, item-instance, crafting, food, market, NPC, party, location, travel, narrative, Knowledge, reputation, fraud, or body-state implementation;
- no UI or menu implementation;
- no version assignment;
- no restoration or modification of `0.6.6`;
- no additional temporary artifacts.
