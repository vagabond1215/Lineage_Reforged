# Current Codex Prompt

## Run Identity

`Culinary Integration Final Contract, Metabolism, Protein, And Action-Surface Repair Audit`

Run classification: unversioned documentation-only final repair, coordination, and acceptance audit

Milestone impact: `supports_current_band`

Parent version: none

Run this as one final bounded repair of the completed culinary integration artifacts at commit `b92b1344613669114641230a2e67f8ed77e7ae00`.

Reconcile the remaining command-owner, generic item-instance dependency, selected-package prerequisite, canonical nutrition, metabolism, stamina, body composition, fat mobilization, climate response, protein recovery, muscle-adaptation, artifact-metadata, and contextual action-surface defects.

Do not implement content, schemas, validators, runtime, UI, saves, economy, balance, dependencies, or gameplay.

Suggested commit:

`docs(food): finalize culinary metabolism protein and action contracts`

## Route Context

The integration audit and first bounded repair produced useful evidence and a largely coherent model. GPT/human inspection accepts the repaired percentage, quantity, ration, preparation-method, container, mystery-assortment, stock-window, contextual-quality, and historical-source direction.

The remaining blockers are bounded:

1. food actions and assortment commands both claim generic `Open`, `Transfer`, and `Inspect` operations;
2. generic item-instance truth incorrectly depends on static food profiles despite cross-domain use;
3. the selected acceptance package uses stale non-contiguous open-decision prerequisite language;
4. canonical nutritional energy and owner boundaries remain ambiguous;
5. repaired artifact metadata carries earlier dates/classifications in places;
6. contextual inventory, crafting, workplace, location, NPC, and storefront action surfaces are incomplete;
7. digestion, BMR, action expenditure, zero-centered Energy, Stamina recovery, fat storage, fatigue, and atrophy are not fully integrated;
8. mild deficits must draw on rate-limited fat reserve, with diminishing Constitution/Vitality and climate tradeoffs;
9. protein must support lean-tissue preservation, recovery from reversible short-term condition loss, and slow activity-gated muscle adaptation without becoming an instant Strength or Stamina consumable.

## Controlling Decisions

Read and follow, with the more specific decision controlling where they overlap:

- `docs/design/protein-recovery-muscle-adaptation-and-nutrition-integration-decision.md`;
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

The queued research prompt `docs/dev/queued-protein-recovery-muscle-adaptation-deep-research-prompt.md` is research-only. This Codex repair may cite its existence and open questions but must not execute it, invent its findings, or consume a nonexistent result.

After this repair, stop for GPT/human inspection. Do not install an implementation prompt, create the future durable contract-acceptance decision, assign a version, restore `0.6.6`, or modify the held prompt.

## Execution Gate

1. Read `AGENTS.md`, `README.md`, current output/handoff/prompt/route register, every controlling decision above, and the three temporary artifacts under Allowed Tracked Files.
2. Run `git status`, fetch, and fast-forward pull. Record branch, starting commit, and clean/dirty state. Preserve unrelated work.
3. Confirm this is the active prompt.
4. Confirm commit `b92b1344613669114641230a2e67f8ed77e7ae00` is an ancestor of the current branch.
5. Confirm all three metabolism/protein decisions and the contextual-action decision exist unchanged before starting.
6. Confirm the focused culinary correction decisions exist unchanged.
7. Confirm held `0.6.6` still resolves to blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
8. Confirm retained Gate 1-5 and Gate 7 artifacts remain solely assigned to `0.6.7`.
9. Stop without editing if live repository fact materially contradicts a controlling decision. Report the smallest coordination repair required.

## Repair 1: Contextual Action Surfaces

Record the preferred contextual item-, entity-, workplace-, and location-driven action model rather than permanent global Food, Crafting, Trade, or character-action menus.

A filtered ready-food inventory view may exist for convenience but is not a separate command owner.

Selecting a physical inventory item may expose only valid actions such as:

- `Eat` or `Drink`;
- `Open` or `Close`;
- `Inspect`;
- `Split`, `Combine`, `Pour`, or `Transfer`;
- `Store`, `Take Out`, or `Drop`;
- `Label`;
- an eligible hand-crafting action.

The item/inventory UI is an invocation surface only. It does not calculate nutrition, metabolism, protein recovery, muscle adaptation, fat burn, or Stamina.

Do not place universal `Give`, `Trade`, `Buy`, `Sell`, or `Barter` actions in the ordinary item menu.

Only valid or meaningfully explanatory unavailable actions should appear. Prefer omitting impossible actions over permanent disabled-button clutter.

## Repair 2: Command Ownership

### Generic item-instance commands

Own open/close, seal/unseal, compatible split/combine, pour/transfer between permitted containers, movement/storage/drop, custom labels, and held-item inspection.

They do not execute recipes, calculate nutrition or physiology, resolve sales, generate manifests, or mutate body state.

### Food-consumption commands

Own Eat/Drink verbs, consumed amount, whole-only validation, exact inventory decrement/remainder, intake-result emission from physical nutrient totals, food-safety consequences, and exposure/morale inputs.

Consumption submits intake to body-state digestion/metabolism. It does not instantly convert calories or protein into Energy, Stamina, Strength, recovery, or muscle.

### Crafting and process commands

Own hand crafting, food preparation, cooking, preservation, workplace transformations, and recipe/material/tool/skill/access/fuel/time/outcome resolution.

Time-advancing crafting provides duration and activity context to shared expenditure and recovery owners. It does not privately calculate calories, fat burn, protein demand, or muscle gain.

### Character and party interaction commands

Own recipient selection and social context for giving or offering an item or prepared serving, followed by an inventory transfer after acceptance.

### Market and transaction commands

Own stock presentation, buy, sell, barter, seller-controlled inspection permission, price/funds/offer validation, ownership transfer, and commercial consequences.

### Location and travel commands

Own travel to known destinations, enter/exit, look around, context discovery, and interruption handling.

## Repair 3: Crafting, Workplaces, Stores, And Multi-Serving Preparation

Record:

- selecting a material, ingredient, component, or suitable tool may expose crafting only when a known process uses it;
- recipe views may show all known applicable recipes or only currently satisfiable recipes;
- selecting one item never implies it is the only input;
- fixed-station crafting appears through an accessible workplace, station, furnishing, location, apparatus, or selected recipe;
- workplace presence does not prove permission, vacancy, reservation, fuel, tools, ownership, or staffing;
- selected serving vessels determine prepared-serving count;
- Uniform Servings remains default;
- Individual Servings permits per-vessel allocation;
- source allocation cannot exceed available physical amount.

Preserve the documentation-only storefront flow: destination selection, tick-based local travel, possible future interruptions, contextual arrival narrative, compact Browse/Talk/Look Around/Exit actions, observable direct lots and persisted mystery assortments, and merchant-owned Buy/Sell/Barter interactions.

Do not implement any of those surfaces.

## Repair 4: Generic Item-Instance Dependency

Generic item-instance truth and heterogeneous presentation groups must not depend on static food profiles.

Generic instance truth depends on shared quantity and generic item/container contracts and owns or supports:

- instance ids;
- canonical and remaining amounts;
- container contents and mutable state;
- creation-time true manifests;
- condition and provenance references;
- per-unit truth beneath visible groups;
- save/load and transfer identity boundaries.

Food, merchant stock, textiles, leather, wood, metal, seeds, apothecary goods, mystery assortments, and later domains consume the same foundation.

## Repair 5: Canonical Nutrition And Intake

Use canonical authored nutritional energy in kilocalories unless a later durable decision accepts an exact conversion contract.

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

- static nutrition profiles: per-basis kcal, protein, fat, carbohydrate, hydration, accepted digestion-release descriptors, and static satiety parameters;
- consumption/meal resolver: physical aggregation and intake-result emission;
- dietary exposure state: monotony and variety history;
- body state: digestion, hunger, satiety, hydration, fatigue, recovery, starvation, and physiological consequences;
- difficulty: switches, rates, thresholds, forgiveness, permanence, and information precision.

Static food profiles do not own digestion, body fat, Stamina, atrophy, muscle adaptation, activity expenditure, or attribute mutation.

User-authored candidate anchors remain:

- approximately `1,800-2,000 kcal/day` generated base BMR before minor bounded adjustments;
- approximately `2,500 kcal/day` for an ordinary healthy active adult;
- approximately `3,500-4,000 kcal/day` for sustained high-intensity labor or loaded military activity.

These are design anchors, not universal historical findings or implemented values.

## Repair 6: Metabolism, Stamina, Fat, And Climate

Record:

```text
food consumed
  -> digestion pool
  -> usable absorbed kilocalories over time
  -> continuous metabolic balance
       -> basal expenditure
       -> activity expenditure
       -> Stamina-restoration support
       -> deficit or surplus
            -> sustained surplus may become rate-limited fat storage
            -> mild and deeper deficits draw on rate-limited reserves
            -> uncovered prolonged deficit may cause fatigue and atrophy
```

Keep intake, digestion, zero-centered Energy, Stamina, hunger/satiety, hydration, fat reserve, lean tissue, temporary penalties, and persistent consequences distinct.

Every meaningful time-advancing action incurs continuous expenditure. Candidate baseline is BMR/1,440 kcal per minute, with duration × intensity × contextual modifiers × bounded deterministic variance for actions. Do not invent coefficients.

Food does not instantly fill Energy or Stamina. Fat is a normal reserve used during mild deficits but is rate-limited by elapsed time and cannot provide instant burst performance.

Fat storage is also smoothed and rate-limited.

Body-fat contribution to Constitution/Vitality and climate response uses diminishing returns and contextual tradeoffs:

- very low reserve increases scarcity and cold vulnerability;
- functional reserve provides the largest marginal resilience benefit;
- elevated reserve provides smaller additional benefit;
- high reserve introduces growing heat, hydration, burden, mobility, and Stamina tradeoffs;
- clothing, shelter, fire, dryness, wind protection, acclimatization, armor, humidity, and exertion remain primary environmental controls.

No activity owns a private calorie/fat ledger. No weather system owns body composition. No food profile owns character fat.

## Repair 7: Protein Recovery And Muscle Adaptation

Record this accepted pipeline:

```text
meaningful activity or training
  -> physical stimulus and tissue stress
  -> recovery demand
       + protein availability
       + energy availability
       + hydration and rest
       + elapsed time
  -> repair of temporary loss
  -> restoration of reversible short-term lean-condition decline
  -> slow muscle adaptation when meaningful stimulus repeats
```

Keep distinct:

1. acute exertion fatigue;
2. recovery debt;
3. reversible short-term lean-condition loss;
4. structural atrophy;
5. base-attribute change.

Protein direction:

- protein supports lean-tissue maintenance and recovery;
- moving from deficient to adequate matters more than moving from adequate to excessive;
- adequate protein during mild deficit may help preserve lean tissue but cannot fully compensate for a large energy deficit;
- adequate calories with poor protein may preserve Energy while impairing recovery/adaptation;
- high protein with insufficient calories may reduce but not eliminate lean loss;
- protein does not instantly restore Stamina, Strength, hydration, sleep, injury, or heat/cold damage;
- exact protein bands, amounts, quality, timing, and digestion remain research questions.

Muscle-adaptation direction:

- meaningful repeated loading or demanding activity provides stimulus;
- protein, calories, rest, and elapsed time gate adaptation;
- high protein without stimulus does not create meaningful muscle;
- stimulus without recovery may create fatigue, injury risk, or deterioration;
- adaptation is slow, rate-limited, and subject to diminishing returns;
- trivial repeated micro-actions cannot farm muscle;
- highly developed condition requires more demanding stimulus and maintenance;
- detraining from prolonged inactivity is possible but not immediate;
- recovery of recently lost condition may be faster than first-time development only if later research supports a manageable rule.

Preferred attribute boundary:

- muscle condition modifies effective physical output and related derived values;
- it does not silently rewrite base Strength;
- Constitution and Vitality influence recovery/tolerance through bounded owner-approved effects;
- exact base-stat versus persistent-modifier behavior remains open.

The queued deep-research gate is:

`GPT-DR.nutrition.protein-recovery-muscle-adaptation`

from:

`docs/dev/queued-protein-recovery-muscle-adaptation-deep-research-prompt.md`

This repair records the accepted conceptual model and open questions only. It must not invent research findings or numeric protein/muscle formulas.

## Repair 8: Deficit, Recovery, And Atrophy Progression

Use staged consequences:

1. reduced Stamina recovery;
2. faster fatigue accumulation;
3. temporary penalties to sustained Strength output, carrying, pace, or work efficiency;
4. reduced Stamina maximum or increased action cost at deeper deficits;
5. recovery debt and reversible lean-condition decline;
6. chronic fatigue and impaired recovery;
7. structural atrophy only after prolonged severe conditions;
8. lasting physical-stat consequences only through an explicit later contract.

Atrophy and recovery consider deficit severity/duration, protein, exertion, illness/injury, rest, disuse, hydration, and remaining fat reserve.

One missed meal or one difficult day cannot cause structural atrophy or permanent stat loss.

## Repair 9: Owner Boundaries

Use these directions:

| Concern | Owner direction |
| --- | --- |
| Per-basis kcal/protein/macros/hydration | Static nutrition profiles |
| Meal nutrient aggregation | Consumption/meal resolver |
| Digestion and nutrient availability | Body-state nutrition/metabolism owner |
| BMR and zero-centered Energy | Body-state/metabolism owner |
| Short-term reserve and fat conversion | Body-state/metabolism/body-composition owner |
| Duration, intensity, and physical loading | Activity/travel/combat/crafting/work/training owners |
| Shared caloric expenditure | Body-state/activity expenditure resolver |
| Immediate exertion capacity | Stamina/body/activity state |
| Recovery demand and fatigue | Body-state/recovery owner |
| Lean condition and muscle adaptation | Body-state/body-composition owner |
| Constitution/Vitality contribution | Body-state plus attribute-resolution contract |
| Climate conditions | Environment/weather owner supplying context |
| Body-composition climate response | Body-state/metabolism resolver |
| Lasting attribute effects | Explicit body-state/attribute contract |
| Difficulty | Difficulty/global-rules owner |
| Presentation | UI only |

No food item owns muscle gain. No activity privately mutates lean tissue. No UI calculates physiology.

## Repair 10: Open Decisions And Package Prerequisites

Remove stale `OD-01 through OD-06` language. Use explicit ids.

The selected `Culinary Quantity, Food-State, And Instance Contract Acceptance Decision` requires at minimum:

- `OD-01` — exact mass/volume bases, scales, and display conversions;
- `OD-03` — controlled process vocabulary and parameters;
- `OD-05` — method-to-hazard reduction and residual rules;
- `OD-06` — representative schema fixtures;
- `OD-07` — item-observation persistence and Knowledge boundary.

Include `OD-04` only if that decision intentionally owns transient versus packaged ad hoc meal persistence.

Retain genuine open decisions for:

- BMR generation and stat coefficients;
- digestion curves and conversion cost;
- short-term accessible reserve;
- action intensity/modifier scales and variance seed policy;
- Stamina recovery energy cost;
- fat mobilization/storage rates and reserve normalization;
- Constitution/Vitality and climate curves;
- protein maintenance/recovery bands;
- protein timing, quality, digestibility, and player-visible precision;
- recovery of short-term lean-condition loss;
- training stimulus and aggregation;
- muscle-gain, detraining, and retraining rate caps;
- relation among muscle condition, effective Strength, BMR, mass, heat, burden, and Stamina;
- structural atrophy and lasting-attribute ownership;
- difficulty values.

Do not invent answers reserved for the queued Deep Research gate.

## Repair 11: Artifact Metadata And Package Graph

Distinguish:

- original artifact date: `2026-07-20`;
- first repair date: `2026-07-21`;
- final repair date: actual run date;
- current source run: `Culinary Integration Final Contract, Metabolism, Protein, And Action-Surface Repair Audit`;
- current classification: unversioned documentation-only final repair, coordination, and acceptance audit.

Include repaired-source commit `b92b1344613669114641230a2e67f8ed77e7ae00` in provenance.

Rebuild the candidate package graph around:

1. durable contract acceptance decision;
2. shared quantity foundation;
3. generic container templates and item-instance truth;
4. static food-state/process-reference/hazard/portion profiles;
5. reusable assortment profiles and contextual-quality mappings;
6. merchant stock instances;
7. knowledge/fraud/inspection contract;
8. canonical nutrition, intake-result, and digestion-event contract;
9. shared body-state/metabolism and activity-expenditure contract;
10. Stamina/fatigue/body-composition/climate-response contract;
11. protein-recovery and muscle-adaptation research integration, followed by a later accepted contract;
12. culinary catalog-integrity support after its exact static-food parent exists;
13. generic item-instance commands;
14. food-consumption and crafting/process commands as separate owner families;
15. market transaction commands;
16. starting-manifest work after relevant owners exist.

The graph must remain acyclic. No broad food-actions package may own inventory, trade, travel, crafting, social interaction, metabolism, Stamina, body composition, climate response, protein adaptation, and attributes.

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
- finite clearance windows, replenished standard stock, and narrow select/event stock;
- honest clearance separate from fraud;
- non-exhaustive physical-container vocabulary;
- custom labels do not replace true identity;
- one reusable cross-domain assortment-owner direction;
- valid three-segment primaries and exact-parent four-segment support suffixes only.

## Required Artifact Results

Repair exactly:

1. `docs/dev/tmp-culinary-preparation-portion-meal-integration-2026-07-20.md`
2. `docs/dev/tmp-culinary-historical-energy-ration-source-index-2026-07-20.md`
3. `docs/dev/tmp-culinary-quantity-container-knowledge-audit-2026-07-20.json`
4. `docs/dev/current-codex-output.md`

Do not create additional artifacts.

The integration Markdown must present one coherent action, command, quantity, nutrition, digestion, metabolism, fat-mobilization, Stamina, protein-recovery, muscle-adaptation, climate/body-composition, item-instance, culinary, assortment, and package model.

The source index changes only where necessary to clarify that kcal/BMR/metabolism/fat/climate/protein/adaptation directions are user-authored game design rather than historical findings.

The JSON preserves its stable top-level shape unless backward-compatible metadata is required. Reconcile all counts. Add machine-readable owner concepts and genuine open decisions without presenting future paths as live.

`current-codex-output.md` must summarize final repairs, open decisions, research dependency, package readiness, and why implementation remains unauthorized.

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
- `docs/dev/queued-protein-recovery-muscle-adaptation-deep-research-prompt.md`;
- any design authority;
- retained Gate artifacts;
- held `0.6.6`;
- any content, schema, validator, test, runtime, UI, save, economy, dependency, asset, or generated file.

## Validation

At minimum:

- parse repaired JSON strictly and reconcile all counts;
- verify local paths, live ids, and `future:` prefixes;
- verify Markdown links and exact changed-path scope;
- verify no duplicate owner claims generic Open, Transfer, or Inspect;
- verify generic item-instance truth has no food-profile dependency;
- verify held-item and merchant-permission inspection boundaries;
- verify Give and market transaction owners;
- verify contextual hand/workplace crafting and selected-item food consumption;
- verify canonical kilocalories and compatibility-only `dailyCalories: 100`;
- verify distinct nutrition, intake, digestion, metabolism, Stamina, exposure, body state, activity, adaptation, attribute, climate, and difficulty owners;
- verify consumed food does not instantly become Energy or Stamina;
- verify mild deficits use rate-limited fat and high-intensity demand may exceed mobilization;
- verify fat effects use diminishing-return Constitution/Vitality and climate tradeoffs;
- verify protein supports recovery/maintenance but is not an instant Strength/Stamina resource;
- verify muscle adaptation requires meaningful stimulus, protein, energy, rest, and elapsed time;
- verify trivial micro-actions and diet alone cannot farm muscle;
- verify short fatigue, recovery debt, reversible loss, structural atrophy, and base-stat change remain distinct;
- verify no permanent loss from one missed meal or ordinary short deficit;
- verify the Deep Research prompt is queued rather than falsely treated as completed evidence;
- verify explicit non-contiguous OD prerequisites;
- verify artifact provenance and classification;
- verify accepted ration, quantity, process, assortment, stock, fraud, label, and version rules;
- verify package graph is acyclic;
- run conflict-marker, whitespace, and `git diff --check` review.

Do not run builds, typechecks, application lint, generators, servers, dependency installation, or runtime tests unless an unexpected repository condition requires them. Implementation is prohibited.

## Required Output Summary

`docs/dev/current-codex-output.md` must state:

- source run and dates;
- branch/status assumption;
- label class, parent, and milestone impact;
- files changed and checks run;
- contradictions repaired;
- contextual action-surface and command-owner matrix;
- generic item-instance dependency;
- canonical nutrition and intake posture;
- metabolism, Stamina, fat, climate, protein-recovery, and muscle-adaptation direction;
- genuine unresolved balance/research questions;
- queued Deep Research dependency;
- explicit open-decision prerequisites;
- package graph and readiness;
- relation to held `0.6.6`;
- suggested commit message and next recommended run.

## Non-Goals

- no item, recipe, ration, provision, assortment, producer, profession, store, NPC, building, event, container, stock, or starting-bundle content;
- no calorie, BMR, digestion, Stamina, fat, protein, muscle, body-mass, atrophy, action-cost, stock, price, schedule, travel, event, or difficulty balancing;
- no schema, validator, lint, test, loader, runtime, command, save, migration, inventory, item-instance, crafting, food, metabolism, body-state, attribute, market, NPC, party, location, travel, narrative, Knowledge, reputation, fraud, training, or gameplay implementation;
- no UI or menu implementation;
- no execution or alteration of the queued Deep Research gate;
- no version assignment;
- no restoration or modification of `0.6.6`;
- no additional temporary artifacts.
