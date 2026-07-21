# Current GPT Handoff

## Status

- `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` is complete and validated.
- Original culinary research completed at commit `cd12ee015b11d96d93df05cc2911c7525e1133c2`.
- The first culinary results repair completed at commit `9b73c80e5fc28b3f0951a0d308c0f693ce1493c5` and remains accepted documentation input.
- The culinary preparation/portion/meal integration audit completed at commit `a78b10714b5a6e587989d9c52f02f0d66fb9ea6a`.
- The bounded integration-results repair completed at commit `b92b1344613669114641230a2e67f8ed77e7ae00`.
- GPT/human inspection accepts the repaired percentage, quantity, ration, food-state, preparation-method, container, multi-serving, mystery-assortment, stock-window, contextual-quality, historical-source, and cross-domain directions.
- One final four-file documentation repair remains active for command ownership, generic item-instance dependencies, canonical nutrition, metabolism/body composition, metadata, and contextual action surfaces.
- `docs/design/fat-mobilization-body-stat-and-climate-effects-decision.md` is the newest and most specific metabolism refinement.
- `docs/design/metabolic-energy-stamina-fat-storage-and-atrophy-decision.md` remains the broader controlling body-state authority.
- `docs/design/contextual-action-surfaces-inventory-crafting-and-trade-decision.md` controls contextual invocation and command boundaries.
- The active prompt is `Culinary Integration Final Contract, Metabolism, And Action-Surface Repair Audit` in `docs/dev/current-codex-prompt.md`.
- `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains paused, not canceled, and recoverable from the held prompt and blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

## Controlling Metabolic Direction

### Pipeline

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

Keep separate:

- consumed intake;
- digestion and absorption;
- zero-centered metabolic Energy;
- Stamina;
- hunger and satiety;
- hydration;
- fat reserve and body mass;
- lean tissue and atrophy;
- temporary fatigue penalties;
- persistent physical-stat consequences.

### Canonical nutrition

- Static nutrition profiles use per-basis kilocalories unless a later durable decision accepts an exact conversion contract.
- Live `dailyCalories: 100` is legacy compatibility only.
- Nutrition derives from physical amount consumed and per-basis values.
- Consumption emits an intake result; it does not instantly convert all calories into Energy or Stamina.
- Calories, protein, dietary fat, carbohydrate, hydration, hunger, satiety, Stamina, body fat, and lean tissue are separate concerns.

### BMR and expenditure

Accepted candidate posture:

- generated BMR base approximately `1,800-2,000 kcal/day`;
- deterministic seeded variation;
- small bounded effects from Strength, Constitution, Vitality, and later accepted body-state factors;
- stat effects remain minor relative to the base.

Broader activity anchors remain approximately:

- `2,500 kcal/day` for an ordinary healthy active adult;
- `3,500-4,000 kcal/day` for sustained high-intensity labor or loaded military activity.

Every meaningful time-advancing action incurs expenditure. Candidate direction:

```text
baseline kcal per minute = BMR / 1,440

action expenditure
  = duration
  * baseline
  * intensity
  * contextual modifiers
  * small bounded variance
```

Context may include pace, terrain, slope, temperature, weather, burden, armor, body mass, injury, illness, fatigue, hydration, tool/workstation efficiency, movement constraints, combat intensity, and recovery state.

Activity, travel, combat, crafting, work, and rest owners provide duration and intensity. They do not own private calorie or fat ledgers.

### Digestion and Stamina

- Food enters a digestion pool rather than instantly refilling Energy or Stamina.
- Simplified release may later use fast, ordinary, slow, or prolonged categories.
- Digestion includes a bounded conversion cost.
- Stamina is immediate exertion capacity.
- Calories and fat support Stamina recovery only through time-based metabolism and recovery rules.
- Fat never converts directly into an immediate Stamina refill.

## Mild Deficits And Fat Mobilization

Fat is a normal long-term energy source, not emergency-only starvation fuel.

When absorbed intake and the short-term accessible reserve do not cover demand, mild deficits begin drawing a bounded amount from fat reserve when usable reserve exists.

Accepted conceptual order:

```text
current demand
  -> recently absorbed usable energy
  -> bounded short-term accessible reserve
  -> rate-limited fat mobilization
  -> uncovered deficit pressure
       -> reduced Stamina recovery and fatigue
       -> lean-tissue pressure only when prolonged or severe
```

Fat use may blend with the short-term reserve instead of waiting for one absolute threshold.

A mild deficit should normally burn a small amount of fat without immediately causing severe fatigue, atrophy, or permanent stat loss.

### Mobilization limit

Fat may supply only a bounded amount per unit time.

The future resolver must ensure:

- elapsed time controls conversion;
- mobilized energy cannot exceed the actual deficit;
- fat cannot instantly refill Stamina;
- large reserves cannot cover unlimited burst demand;
- conversion is deterministic or seeded and resistant to save/reload, cancel/retry, or micro-action rerolls;
- ordinary low-intensity deficits can be partly or fully supported;
- high short-term demand can exceed mobilization capacity.

Uncovered demand reduces recovery, increases fatigue, and reduces sustainable output even when body fat remains.

### Storage limit

- Fat gain is smoothed and rate-limited.
- A single meal does not create a large immediate body-composition change.
- Future contracts must define surplus buffering, maximum storage rate, conversion loss, update intervals, and minimum meaningful changes.

### Exploit prevention

Reject:

- direct fat-to-Stamina commands;
- repeated zero-crossing conversion bonuses;
- unlimited burst conversion;
- rerolling fat burn through micro-actions;
- counting the same calories as both stored fat and unspent surplus;
- reversing already elapsed fat use by eating afterward;
- treating fat as weightless or climate-neutral;
- using fat to replace protein, hydration, rest, clothing, shelter, or acclimatization.

## Constitution, Vitality, And Climate

Body fat contributes to Constitution- and Vitality-adjacent resilience through a derived diminishing-return modifier or calculation input, not an unlimited direct base-stat bonus.

Conceptual relationship:

```text
very low reserve
  -> meaningful vulnerability

low-to-functional reserve
  -> largest marginal resilience gain

functional-to-elevated reserve
  -> smaller additional benefit

elevated-to-high reserve
  -> little added benefit and increasing tradeoffs

very high reserve
  -> no further resilience gain; heat, burden, mobility, and Stamina costs may dominate
```

Preserve the distinction among:

- base attribute;
- temporary condition modifier;
- persistent body-composition modifier;
- injury, illness, fatigue, and environmental modifiers.

No amount of body fat makes a character universally tougher, immune to starvation, or superior in every Constitution/Vitality use.

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
- reduce sustained-work tolerance in heat or humidity.

Temperature, humidity, direct sun, ventilation, clothing, armor, burden, and exertion compound the effect. A functional reserve does not make ordinary warmth intolerable; penalties become material through combined context and nonlinear tradeoffs.

## Deficit, Protein, Fatigue, And Atrophy

Temporary deficit progression:

1. reduced Stamina recovery;
2. faster fatigue accumulation;
3. temporary penalties to sustained Strength output, carrying, pace, or work efficiency;
4. reduced Stamina maximum or increased action cost at deeper deficits;
5. chronic fatigue and impaired recovery;
6. long-term atrophy only after prolonged severe conditions.

Atrophy considers deficit duration and severity, protein, exertion, illness/injury, rest, disuse, and remaining fat reserve.

Severe long-term atrophy may cause lasting physical-stat loss. It cannot arise from an ordinary missed meal or one hard day. Whether it mutates base stats or applies persistent recoverable body-state modifiers remains open.

Adequate calories with insufficient protein may still impair recovery and lean-tissue preservation. Adequate protein with insufficient calories may still leave a deficit.

## Owner Separation

| Concern | Owner direction |
| --- | --- |
| Per-basis kcal/macros/hydration | Static nutrition profiles |
| Meal nutrient aggregation | Consumption/meal resolver |
| Digestion, absorption, BMR, zero-centered balance | Body-state/metabolism owner |
| Short-term reserve, fat storage, fat mobilization | Body-state/metabolism and body-composition owner |
| Duration and intensity | Activity/travel/combat/crafting/rest owners |
| Contextual expenditure | Shared body-state/activity expenditure resolver |
| Immediate exertion capacity | Stamina/body/activity state |
| Fat amount and lean tissue | Body-composition owner |
| Constitution/Vitality contribution | Body-state plus attribute-resolution contract |
| Environmental conditions | Weather/environment owner |
| Body-composition climate response | Body-state/metabolism resolver |
| Lasting attribute effects | Explicit body-state/attribute contract |
| Hunger, satiety, fatigue, recovery | Player body-state owner |
| Difficulty | Difficulty/global-rules owner |
| Presentation | UI only |

No food profile owns character fat. No activity privately burns fat. No weather system directly mutates body composition.

## Controlling Action-Surface Direction

- Prefer contextual item-, entity-, workplace-, and location-driven actions over permanent global menus.
- The UI surface exposing an action is not its execution owner.
- Show only valid actions plus selectively useful unavailable actions with concise reasons.
- A filtered ready-food view may exist but is not a second command owner.

Selecting a physical item may expose Eat/Drink, Open/Close, Inspect, Split/Combine/Pour/Transfer, Store/Take Out/Drop, Label, and eligible hand-crafting verbs.

Generic item commands own item operations and accessible-item inspection. Food consumption emits intake. Crafting owns transformations. Giving begins through character interaction. Buy/Sell/Barter begin through merchant interaction. Travel and location owners control building travel, entry, exit, and look-around context.

Prepared-serving count remains determined by selected vessels. Uniform Servings is default; Individual Servings permits per-vessel allocation.

## Required Final Repair

The active Codex run may modify only:

- `docs/dev/tmp-culinary-preparation-portion-meal-integration-2026-07-20.md`;
- `docs/dev/tmp-culinary-historical-energy-ration-source-index-2026-07-20.md`;
- `docs/dev/tmp-culinary-quantity-container-knowledge-audit-2026-07-20.json`;
- `docs/dev/current-codex-output.md`.

It must repair:

1. duplicate Open/Transfer/Inspect ownership;
2. static-food dependency in generic item-instance truth;
3. stale open-decision prerequisites;
4. canonical kcal and nutrition ownership;
5. original versus repair metadata;
6. contextual inventory/crafting/workplace/location/NPC/storefront invocation;
7. digestion, BMR, Energy, Stamina, action expenditure, fat storage, protein, fatigue, and atrophy ownership;
8. mild-deficit fat use, rate-limited mobilization/storage, Constitution/Vitality diminishing returns, climate tradeoffs, and exploit prevention.

Generic item-instance truth depends on shared quantity and generic container/item-instance foundations, not static food profiles.

The selected contract-acceptance decision should explicitly depend on OD-01, OD-03, OD-05, OD-06, and OD-07. Include OD-04 only if it intentionally owns transient versus packaged ad hoc meal persistence.

## Culinary And Assortment Direction To Preserve

- Food state remains orthogonal: readiness, process, preservation, hazard, and authored display name.
- Mechanics never parse display names.
- Physical dimensions are count, mass, and volume.
- Serving is an authored culinary reference.
- Percentages are allocation/composition, not calorie points.
- Accepted ration names are Small, Medium, Large, Party, and Large Party Ration.
- Party rations are short-duration multi-serving assortments; provisions are sustained multi-container logistics.
- Mystery manifests resolve before opening and never reroll.
- Direct known lots coexist with mystery assortments.
- Clearance/standard/select candidate tiers, contextual quality, finite stock windows, honest-clearance/fraud separation, and cross-domain reuse remain accepted.
- Container examples are non-exhaustive; custom labels never replace true identity.
- Three-segment labels are primaries; support uses a fourth segment and an exact parent.

## Route Guardrails

- The active run is unversioned and documentation-only.
- No implementation number is assigned.
- No item, recipe, ration, provision, assortment, producer, profession, store, NPC, building, event, container, stock, schema, validator, test, runtime, command, inventory, UI, save, economy, travel, weather, narrative, Knowledge, reputation, difficulty, attribute, body-state, or gameplay change is authorized.
- Retained Gate 1-5 and Gate 7 artifacts remain solely assigned to `0.6.7`.
- Held `0.6.6` remains recoverable and must not be restored or modified.
- After the final repair, stop for GPT/human inspection before creating a durable contract-acceptance decision or implementation prompt.