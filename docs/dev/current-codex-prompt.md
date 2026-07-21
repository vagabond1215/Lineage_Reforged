# Current Codex Prompt

## Run Identity

`Culinary Integration Final Contract, Metabolism, And Action-Surface Repair Audit`

Run classification: unversioned documentation-only final repair, coordination, and acceptance audit

Milestone impact: `supports_current_band`

Parent version: none

Run this as one final bounded repair of the completed culinary integration artifacts at commit `b92b1344613669114641230a2e67f8ed77e7ae00`.

Reconcile the remaining command-owner, generic item-instance dependency, selected-package prerequisite, canonical nutrition, metabolism/stamina/body-composition, fat-mobilization, climate-effect, artifact-metadata, and contextual action-surface defects. Do not implement content, schemas, validators, runtime, UI, saves, economy, balance, dependencies, or gameplay.

Suggested commit:

`docs(food): finalize culinary metabolism and action-surface contracts`

## Route Context

The integration audit and first bounded repair produced useful evidence and a largely coherent model. GPT/human inspection accepts the repaired percentage, quantity, ration, preparation-method, container, mystery-assortment, stock-window, contextual-quality, and historical-source direction.

The remaining blockers are narrow:

1. food actions and assortment commands both claim generic `Open`, `Transfer`, and `Inspect` operations;
2. generic item-instance truth incorrectly depends on static food profiles despite cross-domain use;
3. the selected acceptance package uses stale non-contiguous open-decision prerequisite language;
4. canonical nutritional energy and owner boundaries remain ambiguous;
5. repaired artifact metadata carries earlier dates/classifications in places;
6. contextual inventory, crafting, workplace, location, NPC, and storefront action surfaces are not fully incorporated;
7. digestion, BMR, action expenditure, zero-centered energy balance, stamina recovery, fat storage, protein pressure, fatigue, and atrophy are not fully integrated;
8. fat use must explicitly occur during mild deficits, remain rate-limited, affect Constitution/Vitality and climate only through diminishing-return tradeoffs, and never behave as instant stamina storage.

## Controlling Decisions

Read and follow, in precedence order where more specific:

- `docs/design/fat-mobilization-body-stat-and-climate-effects-decision.md`;
- `docs/design/metabolic-energy-stamina-fat-storage-and-atrophy-decision.md`;
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

1. Read `AGENTS.md`, `README.md`, the current prompt/output/handoff/route register, every controlling decision above, and the three temporary artifacts named under Allowed Tracked Files.
2. Run `git status`, fetch, and fast-forward pull. Record branch, starting commit, and clean/dirty state. Preserve unrelated work.
3. Confirm the active prompt is this final repair audit.
4. Confirm commit `b92b1344613669114641230a2e67f8ed77e7ae00` is an ancestor of the current branch.
5. Confirm both metabolism decisions and the contextual-action decision exist unchanged before starting.
6. Confirm the two earlier focused culinary correction decisions exist unchanged.
7. Confirm held `0.6.6` still resolves to blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
8. Confirm retained Gate 1-5 and Gate 7 artifacts remain solely assigned to `0.6.7`; do not edit, delete, consume, or repurpose them.
9. Stop without editing if a live repository fact materially contradicts a controlling decision. Report the smallest coordination repair required.

## Repair 1: Contextual Action Surfaces

Record that the preferred player-facing direction is contextual item-, entity-, workplace-, and location-driven action exposure rather than permanent global food, crafting, trade, or character-action menus.

A filtered ready-food inventory view may later exist for convenience, but it is not a separate command owner.

Selecting a physical inventory item may expose only currently valid actions such as:

- `Eat` or `Drink`;
- `Open` or `Close`;
- `Inspect`;
- `Split`, `Combine`, `Pour`, or `Transfer`;
- `Store`, `Take Out`, or `Drop`;
- `Label`;
- an eligible hand-crafting action.

The item or inventory UI is an invocation surface only. It does not calculate nutrition or metabolism, execute crafting, invent observations, resolve trade, reroll manifests, burn fat, or mutate stamina.

Do not place universal `Give`, `Trade`, `Buy`, `Sell`, or `Barter` buttons in the ordinary item menu.

Giving begins through a party-member or NPC interaction. Buying, selling, and bartering begin through a storefront, merchant, market, or NPC transaction context.

Only valid or meaningfully explainable unavailable actions should appear. Prefer omitting impossible actions over persistent disabled-button clutter.

## Repair 2: Command Ownership

Use these command families.

### Generic item-instance commands

Own:

- open and close;
- seal and unseal;
- split and combine compatible lots;
- pour or transfer between owned or permitted containers;
- move, store, take out, and drop;
- apply or remove custom labels;
- inspect a lawfully held or accessible item and record contextually available observations.

They do not execute recipes, calculate nutrition or metabolism, resolve sales, generate manifests, or apply body-state effects.

### Food-consumption commands

Own:

- Eat, Drink, and other item-appropriate consumption verbs;
- consumed amount and whole-only validation;
- exact inventory decrement or remaining amount;
- emission of a consumed-meal/intake result containing physical amounts and nutrient totals;
- food-safety consequences and character-facing uncertainty;
- dietary exposure and morale inputs where enabled.

Food consumption submits intake to the digestion/metabolism owner. It does not instantly convert kilocalories into available energy or stamina.

Do not make food actions own generic Open, Close, Transfer, Inspect, Give, Buy, Sell, or Barter.

### Crafting and process commands

Own hand crafting, non-heated preparation, cooking, preservation, workplace transformations, and recipe/material/tool/skill/access/fuel/time/outcome resolution.

`Prepare`, `Cook`, `Preserve`, `Smoke`, `Dry`, `Pickle`, `Ferment`, `Bake`, `Boil`, `Fry`, `Steam`, and comparable transformations surface through selected ingredients, tools, apparatus, recipes, or accessible workplaces. They are not permanent global food-menu buttons.

Time-advancing crafting provides duration and intensity context to the shared expenditure resolver. It does not privately calculate calories or fat burn.

### Character and party interaction commands

Own recipient selection and social context for giving or offering an item or prepared serving. Invoke an inventory transfer only after recipient and amount are accepted.

### Market and transaction commands

Own browse-stock presentation, buy, sell, barter, seller-controlled inspection permission, price/funds/offer validation, ownership transfer, refusal, offense, deposit, claim, fraud, and reputation context.

Market inspection may invoke the generic item-observation resolver after access is granted. It must not duplicate generic held-item Open, Transfer, or Inspect execution.

### Location and travel commands

Own travel to known destinations, enter/exit, look around, context discovery, and interruption handling. Food, inventory, crafting, market, and metabolism packages do not own local travel.

## Repair 3: Hand Crafting, Workplaces, And Stores

Record:

- selecting a material, ingredient, component, or suitable tool may expose crafting only when at least one known process uses it;
- the recipe view may show all known applicable recipes or only those currently satisfiable;
- selecting one item never implies it is the only input;
- fixed-station crafting appears through an accessible workplace, station, furnishing, location, apparatus, or selected recipe;
- workplace presence does not prove permission, vacancy, reservation, fuel, tools, ownership, or staffing;
- selected serving vessels determine prepared-serving count;
- Uniform Servings remains default and Individual Servings permits per-vessel allocation;
- source allocation cannot exceed available physical amount.

Storefront direction remains documentation-only:

1. select a known building through a district, coordinate, map, or known-building directory;
2. resolve local travel by distance/ticks;
3. permit future contextual interruptions without designing them here;
4. enter when open and accessible;
5. present a short entity-aware arrival description without inventing facts;
6. expose a compact first level such as `Browse Goods`, `Talk to [NPC]`, `Look Around`, and `Exit`;
7. let `Look Around` reveal additional selectable people, displays, furniture, goods, and exits;
8. present direct lots and persisted mystery assortments through browsing;
9. expose Buy, Sell, Barter, Converse, Request Service/Inspection, or Leave through merchant interaction where valid.

Do not implement travel, events, narrative generation, stores, NPC behavior, stock, or UI.

## Repair 4: Generic Item-Instance Dependency

Correct the package graph so generic item-instance truth and heterogeneous presentation groups do not depend on static food profiles.

Generic item-instance truth depends on the shared quantity foundation and generic item/container instance contracts where required.

It owns or supports:

- instance ids;
- canonical and remaining amount;
- container contents and mutable state;
- creation-time true manifests;
- condition and provenance references;
- per-unit truth beneath visible groups;
- save/load and transfer identity boundaries.

Food, merchant stock, textiles, leather, wood, metal, seeds, apothecary goods, mystery assortments, and later domains consume the same generic instance truth.

## Repair 5: Canonical Nutrition And Intake

Use canonical authored nutritional energy in kilocalories unless a later durable decision accepts an explicit exact conversion contract.

Treat live `dailyCalories: 100` as legacy compatibility only.

Preserve:

```text
ingredient contribution
  = amount consumed
  / nutrition basis amount
  * nutrient value per basis amount

meal total
  = sum of all ingredient contributions
```

Separate owners:

- static nutrition profiles: per-basis kilocalories, protein, fat, carbohydrate, hydration, accepted digestion-release descriptors, and static satiety parameters;
- meal/consumption resolver: physical aggregation and intake-result emission;
- dietary exposure state: monotony and variety history;
- body state: hunger, satiety, hydration, fatigue, recovery, starvation, and physiological consequences;
- difficulty: switches, rates, thresholds, forgiveness, permanence, and information precision.

Static food or consumable profiles do not own digestion, body fat, stamina, atrophy, activity expenditure, or attribute mutation.

User-authored candidate anchors remain:

- approximately `1,800-2,000 kcal/day` generated base BMR before minor bounded adjustments;
- approximately `2,500 kcal/day` for an ordinary healthy active adult;
- approximately `3,500-4,000 kcal/day` for sustained high-intensity labor or loaded military activity.

These are design anchors, not universal historical findings or implemented values.

## Repair 6: Simplified Metabolism And Stamina

Record:

```text
food consumed
  -> digestion pool
  -> usable absorbed kilocalories over time
  -> continuous metabolic balance
       -> basal body-function expenditure
       -> activity expenditure
       -> stamina restoration support
       -> short-term deficit or surplus
            -> sustained surplus may become fat reserve
            -> mild and deeper deficits draw on rate-limited reserves
            -> uncovered prolonged deficit may cause fatigue and atrophy
```

Keep distinct:

- consumed intake;
- digestion/absorption pool;
- zero-centered metabolic energy balance;
- stamina;
- hunger and satiety;
- hydration;
- fat reserve and body mass;
- lean tissue and atrophy;
- temporary fatigue penalties;
- persistent physical-stat consequences.

### BMR and continuous expenditure

Each character later receives a deterministic individual BMR with a candidate `1,800-2,000 kcal/day` base, seeded bounded variation, and small measurable Strength/Constitution/Vitality effects. Exact coefficients remain open.

The body spends energy during sleep, waiting, walking, travel, crafting, combat, unconsciousness, and other time advancement.

Candidate basis:

```text
baseline kcal per minute
  = character BMR kcal per day / 1,440
```

Candidate action form:

```text
action kcal expenditure
  = duration
  * character baseline kcal per unit time
  * action intensity
  * contextual modifiers
  * bounded variance
```

Modifiers may include pace, terrain, slope, temperature, weather, burden, armor, body mass, injury, illness, fatigue, hydration, tool/workstation efficiency, movement constraints, combat intensity, and recovery state.

Minor variance must be narrow, deterministic or seeded where possible, planning-friendly, and resistant to reroll abuse.

### Digestion and stamina

Eating adds calories to a time-based digestion pool rather than instantly filling Energy or Stamina.

Support a bounded simplified release posture such as fast, ordinary, slow, or prolonged. Account for digestive conversion cost through a simple rule; do not invent exact values.

Stamina remains immediate action capacity. Calories and fat support stamina recovery only through the metabolism/body-state update over time and are never directly interchangeable with stamina points.

## Repair 7: Mild-Deficit Fat Use And Rate Limits

Record as accepted, not open:

- fat is a normal long-term energy source, not an emergency-only starvation resource;
- when absorbed intake and the short-term accessible reserve do not cover demand, mild deficits begin drawing a bounded amount from fat reserve when usable reserve exists;
- the body does not need to reach a severe deficit before any fat is burned;
- mild fat use should normally protect against immediate severe fatigue or lean-tissue loss;
- lean tissue remains protected where deficit severity, protein, rest, illness, exertion, and remaining reserve permit.

Use the conceptual order:

```text
current demand
  -> recently absorbed usable energy
  -> bounded short-term accessible reserve
  -> rate-limited fat mobilization
  -> uncovered deficit pressure
       -> reduced stamina recovery and fatigue
       -> lean-tissue pressure only when prolonged or severe
```

Fat mobilization may blend with the short-term reserve rather than waiting for one absolute threshold.

### Mobilization limit

Fat may supply only a bounded amount of energy per unit time.

The future rule must:

- operate from elapsed time;
- never exceed the actual deficit;
- never instantly refill stamina;
- never cover an entire burst merely because large fat reserve exists;
- remain deterministic or seeded under one body-state/time owner;
- resist save/reload, cancellation, retry, and micro-action reroll abuse;
- allow ordinary low-intensity deficits to be partially or fully supported;
- permit high short-term demand to exceed mobilization capacity.

When absorbed energy, short-term reserve, and maximum fat mobilization cannot cover demand, the uncovered portion contributes to reduced stamina recovery, fatigue, reduced sustainable output, and later deficit consequences.

### Storage limit

Fat storage is also smoothed and rate-limited. A single meal does not instantly create a large body-composition change.

Future rules must decide surplus buffering, maximum storage rate, conversion loss, update intervals, and minimum meaningful changes without implementing values here.

### Exploit prevention

Reject:

- direct fat-to-stamina commands;
- repeated zero-crossing bonuses;
- unlimited burst conversion;
- rerolling fat burn through micro-actions;
- counting the same calories as both stored fat and unspent surplus;
- reversing elapsed fat burn by eating afterward;
- treating fat as weightless or climate-neutral;
- using fat reserve to replace protein, hydration, rest, clothing, shelter, or acclimatization.

## Repair 8: Fat, Constitution, Vitality, And Climate

Body fat contributes to Constitution- and Vitality-adjacent physiological resilience through a derived diminishing-return modifier or calculation input, not an unlimited direct base-stat bonus.

Record:

- very low reserve increases vulnerability to prolonged deficit and cold;
- low-to-functional reserve provides the largest marginal resilience improvement;
- functional-to-elevated reserve provides smaller additional benefit;
- high reserve provides little or no additional resilience and introduces increasing tradeoffs;
- no amount of fat makes a character universally tougher or immune to starvation or exposure.

Preserve the distinction among base attribute, temporary condition modifier, persistent body-composition modifier, and injury/illness/environment modifier.

### Cold

Useful fat reserve may marginally:

- reduce cold-stress accumulation;
- reduce thermoregulatory calorie demand;
- delay some cold-related fatigue or Constitution/Vitality pressure.

Benefits use diminishing returns. Clothing, shelter, fire, dryness, wind protection, activity, acclimatization, health, and exposure duration remain more important. Fat never grants immunity to cold, wet exposure, frostbite, hypothermia, or magical cold.

### Heat

Elevated fat reserve may:

- increase heat-stress accumulation;
- increase thermoregulatory and hydration pressure;
- reduce sustained-work tolerance in hot or humid conditions.

Temperature, humidity, sunlight, ventilation, clothing, armor, burden, and exertion compound the effect. Useful reserve should not make ordinary warmth intolerable; penalties become material through combined context and diminishing/nonlinear tradeoffs.

Exact reserve bands, normalization, Constitution/Vitality curves, climate coefficients, and body-mass effects remain open.

## Repair 9: Deficit, Protein, Fatigue, And Atrophy

Temporary deficit progression should be:

1. reduced stamina recovery;
2. faster fatigue accumulation;
3. temporary penalties to sustained Strength output, carrying, pace, or work efficiency;
4. reduced stamina maximum or increased action cost at deeper deficits;
5. chronic fatigue and impaired recovery;
6. long-term atrophy only after prolonged severe conditions.

Atrophy risk considers deficit duration/severity, protein, exertion, illness/injury, rest, disuse, and remaining fat reserve.

Severe long-term atrophy may cause lasting physical-stat loss, but never from one missed meal or one difficult day. Whether this mutates base stats or applies persistent recoverable body-state modifiers remains open.

Calories, protein, hunger, satiety, hydration, stamina, fat, and lean tissue remain distinct.

## Repair 10: Owner Boundaries

Use these owner directions:

| Concern | Owner direction |
| --- | --- |
| Per-basis kcal/macros/hydration | Static nutrition profiles |
| Meal nutrient aggregation | Consumption/meal resolver |
| Digestion, absorption, BMR, zero-centered balance | Body-state/metabolism owner |
| Short-term reserve, fat storage, and fat mobilization | Body-state/metabolism and body-composition owner |
| Duration and intensity | Activity/travel/combat/crafting/rest owners |
| Contextual calorie expenditure | Shared body-state/activity expenditure resolver |
| Immediate exertion capacity | Stamina/body/activity state |
| Fat amount and lean tissue | Body-composition owner |
| Constitution/Vitality contribution | Body-state plus attribute-resolution contract |
| Cold/heat conditions | Environment/weather owner supplying context |
| Body-composition climate response | Body-state/metabolism resolver |
| Lasting attribute effects | Explicit body-state/attribute contract |
| Hunger, satiety, fatigue, recovery | Player body-state owner |
| Difficulty | Difficulty/global-rules owner |
| Presentation | UI only |

No activity domain owns a private calorie or fat ledger. No weather domain directly mutates body composition. No food profile owns character fat storage or mobilization.

## Repair 11: Selected Acceptance Package Prerequisites

Remove stale `OD-01 through OD-06` language. Use explicit ids.

The selected `Culinary Quantity, Food-State, And Instance Contract Acceptance Decision` requires at minimum:

- `OD-01` — exact mass/volume bases, scales, and display conversions;
- `OD-03` — first controlled process vocabulary and parameters;
- `OD-05` — method-to-hazard reduction and residual rules;
- `OD-06` — representative schema fixtures;
- `OD-07` — item-observation persistence and Knowledge boundary.

Include `OD-04` only if that decision intentionally owns transient versus packaged ad hoc meal persistence.

Retain genuine metabolism open decisions:

- exact BMR generation and stat coefficients;
- digestion categories, release curves, and conversion cost;
- short-term accessible reserve size and smoothing;
- action intensity and modifier scales;
- bounded variance and seed policy;
- stamina-recovery energy cost;
- maximum fat-mobilization and storage rates;
- mild-deficit blending between short-term reserve and fat;
- fat conversion efficiency and reserve normalization;
- Constitution/Vitality contribution curve and caps;
- cold, heat, humidity, armor, and hydration coefficients;
- protein and atrophy rules;
- temporary versus persistent physical penalties;
- base-stat mutation versus recoverable modifier;
- body-mass, movement, appearance, and difficulty effects.

Do not use numerical ranges for non-contiguous decision ids.

## Repair 12: Artifact Metadata And Package Graph

Distinguish:

- original artifact date: `2026-07-20`;
- first repair date: `2026-07-21`;
- final repair date: actual run date;
- current source run: `Culinary Integration Final Contract, Metabolism, And Action-Surface Repair Audit`;
- current classification: unversioned documentation-only final repair, coordination, and acceptance audit.

Include repaired-source commit `b92b1344613669114641230a2e67f8ed77e7ae00` in provenance.

Rebuild the package graph around:

1. durable contract acceptance decision;
2. shared quantity foundation;
3. generic container templates and generic item-instance truth;
4. static food-state/process-reference/hazard/portion profiles;
5. reusable assortment profiles and contextual-quality mappings;
6. merchant stock instances;
7. knowledge/fraud/inspection contract;
8. canonical nutrition, meal-result, and digestion-event contract;
9. shared body-state/metabolism and activity-expenditure contract;
10. stamina/fatigue/body-composition, climate-response, and difficulty contract or explicitly bounded continuation after owner acceptance;
11. culinary catalog-integrity support after its exact static-food parent exists;
12. generic item-instance commands;
13. food-consumption and crafting/process commands as separate owner families;
14. market transaction commands;
15. starting-manifest work only after relevant owners exist.

The graph must remain acyclic.

Do not create one broad food-actions package that owns inventory, trade, travel, crafting, social interaction, metabolism, stamina, body composition, climate response, and permanent attribute mutation.

## Preserve Previously Accepted Direction

Preserve without reopening:

- physical dimensions are count, mass, and volume;
- serving is an authored culinary reference;
- percentages are allocation/composition presentation, not calories;
- one crafting-owned process-method registry;
- orthogonal readiness, process, preservation, hazard, and authored naming;
- Small, Medium, Large, Party, and Large Party Ration names;
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

Repair exactly:

1. `docs/dev/tmp-culinary-preparation-portion-meal-integration-2026-07-20.md`
2. `docs/dev/tmp-culinary-historical-energy-ration-source-index-2026-07-20.md`
3. `docs/dev/tmp-culinary-quantity-container-knowledge-audit-2026-07-20.json`
4. `docs/dev/current-codex-output.md`

Do not create additional artifacts.

The integration Markdown must present one coherent action, command, quantity, nutrition, digestion, metabolism, fat-mobilization, stamina, climate/body-composition, item-instance, culinary, assortment, and package model.

The source index changes only where needed to clarify that kcal/BMR/metabolism/fat/climate directions are user-authored game design rather than historical findings.

The JSON preserves its stable top-level shape unless a backward-compatible metadata field is necessary. Reconcile all counts. Add machine-readable owner concepts and genuine open decisions for digestion, BMR, zero-centered balance, expenditure, stamina, mild-deficit fat use, mobilization/storage rate limits, Constitution/Vitality contribution, climate response, fat storage, and atrophy without presenting future paths as live.

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
- held `0.6.6`;
- any content, schema, validator, test, runtime, UI, save, economy, dependency, asset, or generated file.

## Validation

At minimum:

- parse repaired JSON strictly and reconcile summary counts;
- verify local paths, live ids, `future:` prefixes, Markdown links, and exact changed scope;
- verify no duplicate Open/Transfer/Inspect owner;
- verify generic item-instance truth has no static-food dependency;
- verify Give is interaction-owned and Buy/Sell/Barter are transaction-owned;
- verify contextual item/workplace/store/location surfaces remain documentation-only;
- verify canonical nutritional energy is kilocalories and legacy `dailyCalories: 100` is compatibility-only;
- verify intake enters digestion rather than instantly becoming Energy or Stamina;
- verify zero-centered Energy is distinct from Stamina and total fat reserve;
- verify BMR uses the candidate `1,800-2,000 kcal/day` posture with no invented coefficient;
- verify sleep and all meaningful time advancement incur expenditure;
- verify action cost uses duration, intensity, context, and small bounded variance;
- verify mild deficits draw on fat before severe starvation when reserve exists;
- verify fat mobilization and storage are time- and rate-limited;
- verify fat cannot directly refill Stamina or cover unlimited burst demand;
- verify uncovered demand creates fatigue/recovery pressure even when fat remains;
- verify Constitution/Vitality effects use diminishing returns and are not unlimited base-stat bonuses;
- verify fat marginally assists cold but worsens heat/humidity through contextual nonlinear effects;
- verify clothing, shelter, hydration, protein, rest, and acclimatization are not replaced by fat;
- verify protein, calories, hunger, satiety, hydration, stamina, fat, and lean tissue remain distinct;
- verify atrophy cannot arise from an ordinary short deficit;
- verify no activity domain owns a private calorie/fat ledger;
- verify explicit non-contiguous OD prerequisites;
- verify artifact provenance, accepted ration/assortment rules, no opening-time RNG, per-unit truth, and acyclic package graph;
- run conflict-marker, trailing-whitespace, and `git diff --check` review.

Do not run builds, typechecks, application lint, generators, servers, dependency installation, or runtime tests unless an unexpected repository condition makes them necessary. Implementation is prohibited.

## Required Output Summary

`docs/dev/current-codex-output.md` must state:

- source run and dates;
- branch/status assumption;
- label class, parent, and milestone impact;
- files changed and checks run;
- exact final contradictions repaired;
- contextual action-surface and command-owner corrections;
- generic item-instance dependency;
- canonical nutrition and intake ownership;
- accepted digestion, BMR, Energy, Stamina, mild-deficit fat use, mobilization/storage rate limits, Constitution/Vitality, climate, protein, fatigue, and atrophy direction;
- unresolved metabolism/body-composition balance questions;
- corrected open-decision prerequisites and package graph;
- remaining open decisions and readiness;
- relation to held `0.6.6`;
- suggested commit and next recommended run.

## Non-Goals

- no item, recipe, ration, provision, assortment, producer, profession, store, NPC, building, event, container, stock, or starting-bundle content;
- no calorie, BMR, digestion, Stamina, fat, body-mass, climate, attribute, atrophy, action-cost, assortment, stock, price, schedule, travel, event, or difficulty balancing;
- no schema, validator, lint, test, loader, runtime, command, save, migration, inventory, crafting, food, metabolism, body-state, attributes, weather, market, NPC, party, location, travel, narrative, Knowledge, reputation, fraud, or gameplay implementation;
- no UI or menu implementation;
- no version assignment;
- no restoration or modification of `0.6.6`;
- no additional temporary artifacts.