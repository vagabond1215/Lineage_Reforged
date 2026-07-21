# Metabolic Energy, Stamina, Fat Storage, And Atrophy Decision

Date: 2026-07-21

Status: accepted documentation-only body-state and activity-design authority; no schema, validator, runtime, UI, save, balance, content, test, or gameplay implementation permission

Run classification: unversioned focused metabolism, stamina, and body-composition decision

Milestone impact: `supports_current_band`

## 1. Purpose And Precedence

This decision records the accepted simplified human-like model for caloric intake, digestion, metabolic expenditure, short-term energy balance, stamina recovery, fat storage, fatigue, and long-term atrophy.

It supplements:

- `docs/design/culinary-preparation-portion-meal-composition-and-food-knowledge-decision.md`;
- `docs/design/culinary-ration-serving-preparation-and-container-labeling-decision.md`;
- `docs/design/contextual-action-surfaces-inventory-crafting-and-trade-decision.md`;
- `docs/design/activity-resolution-depth-and-attempt-state-contract-plan.md`;
- `docs/design/player-travel-boundary-clarification.md`;
- existing player/body-state, difficulty, combat, crafting, and inventory authority decisions.

Where this decision is more specific, it controls the conceptual relationship among nutritional kilocalories, digestion, metabolic balance, stamina, fat, lean tissue, and action expenditure. It does not assign implementation paths or authorize balance values beyond the accepted candidate anchors below.

## 2. Accepted High-Level Model

Use a simplified pipeline rather than treating food calories, energy, stamina, hunger, and body composition as one meter:

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
            -> sustained deficit draws on reserves
            -> prolonged severe deficit may cause fatigue and atrophy
```

The model deliberately avoids biochemical simulation, blood-glucose chemistry, micronutrient detail, organ-by-organ metabolism, exact hormonal modeling, or laboratory-level nutritional precision.

## 3. Distinct State Layers

The following states must remain distinct even when one UI groups them together.

### 3.1 Consumed intake

Records the physical amount and nutrient contribution actually consumed.

Static food profiles own per-basis:

- kilocalories;
- protein;
- fat;
- carbohydrate;
- hydration;
- digestion or release posture where later accepted;
- satiety parameters where later accepted.

Consumption does not instantly convert every calorie into available metabolic energy.

### 3.2 Digestion pool

Recently consumed food enters a time-based digestion and absorption pool.

The pool should support a bounded simplified release model such as:

- fast;
- ordinary;
- slow;
- prolonged.

The exact categories or curves remain open. They may be authored directly or derived from accepted food composition and preparation fields, but mechanics must not parse item names.

Digestion should account for a bounded conversion cost so that not every labeled kilocalorie becomes immediately usable energy. This may later use one simple absorption/thermic coefficient or a coarse macro-weighted rule. Detailed digestive chemistry is not required.

### 3.3 Metabolic energy balance

The preferred player-facing abstraction is a zero-centered energy balance expressed in kilocalories or an exact accepted derivative:

- `0` represents the character's short-term balanced metabolic position;
- positive values represent usable surplus not yet committed to long-term storage;
- negative values represent a metabolic deficit being covered from bodily reserves or debt;
- the value changes continuously with absorption and expenditure.

A negative value does not mean the body contains no energy. It means current demand exceeds recently available intake and short-term accessible reserve, so the body is compensating from longer-term stores.

A positive value does not mean unlimited stamina. It means absorbed calories currently exceed immediate demand and may support recovery or later storage.

### 3.4 Stamina

Stamina remains a separate short-term action-capacity meter.

It represents immediately usable exertion capacity in muscles, circulation, breathing, and short-term physiological readiness rather than total stored calories.

Actions may consume stamina immediately. Stamina recovery depends on:

- rest or reduced exertion;
- available metabolic energy;
- hydration;
- fatigue and injury;
- environment;
- relevant body and difficulty rules.

Calories therefore support stamina recovery over time but do not become one interchangeable stamina point on consumption.

### 3.5 Fat reserve and body mass

Sustained meaningful caloric surplus may convert into fat reserve after immediate metabolic needs and short-term recovery demands are satisfied.

Fat reserve is a long-term energy store and contributes to body mass. Exact conversion efficiency, body-mass effects, insulation effects, encumbrance interaction, appearance, and thresholds remain later balance work.

Short ordinary surpluses must not produce visibly large body changes. Weight change should require accumulated energy imbalance across meaningful time.

### 3.6 Lean tissue and atrophy

Lean tissue and muscle condition remain distinct from fat reserve.

Prolonged severe deficit may eventually consume lean tissue, especially when combined with:

- inadequate protein;
- sustained heavy exertion;
- illness or injury;
- insufficient rest;
- disuse;
- very low remaining fat reserve;
- repeated recovery failure.

Short deficits should cause temporary fatigue and performance loss first. Persistent atrophy and permanent or persistent attribute loss must require substantially longer and more severe conditions than an ordinary missed meal or one hard day.

## 4. Basal Metabolic Requirement

Each character should have an individual basal metabolic requirement measured in kilocalories per day.

Accepted candidate posture:

- generated base range approximately `1,800-2,000 kcal/day`;
- deterministic seeded variation within the accepted range or a later bounded equivalent;
- minor but measurable adjustments from relevant physical attributes and body state;
- body size, lean mass, age/life stage, illness, injury, climate, and other physiological factors may become more direct modifiers only through later accepted contracts.

Strength, Constitution, and Vitality may each have a small bounded influence:

- Strength may act as a partial proxy for metabolically active muscle;
- Constitution may influence maintenance and recovery demands;
- Vitality may influence general metabolic resilience, repair, and baseline demand.

These stat effects must remain minor relative to the base value. They should be visible across long periods without allowing attributes to multiply BMR into implausible extremes.

Exact formulas, coefficients, clamping, inheritance, and RNG ranges remain balance decisions.

## 5. Continuous Baseline Expenditure

The body spends energy continuously, including during sleep, unconsciousness, waiting, and low-activity travel.

A candidate normalized basis is:

```text
baseline kcal per minute
  = character BMR kcal per day / 1,440
```

This is a design formula direction, not an implemented contract.

Sleep reduces voluntary activity but does not reduce expenditure to zero. Sleeping energy use should include:

- baseline maintenance;
- thermoregulation;
- injury or illness where relevant;
- digestion still in progress;
- environmental exposure where later supported.

## 6. Action Energy Expenditure

Every meaningful time-advancing action should carry a reasonable metabolic expenditure, even when its cost is low.

A candidate general form is:

```text
action kcal expenditure
  = duration
  * character baseline kcal per unit time
  * action intensity
  * contextual modifiers
  * bounded variance
```

Contextual modifiers may include:

- pace and duration;
- terrain and slope;
- temperature and weather;
- carried burden and armor;
- body mass;
- injury, illness, fatigue, and hydration;
- tool or workstation efficiency;
- posture and movement constraints;
- skill efficiency where justified;
- combat intensity;
- recovery state.

A ten-minute ordinary walk should therefore have a low, fairly predictable cost. Heat, cold, rain, mud, steep grade, heavy burden, armor, injury, forced pace, or poor condition may raise it.

### 6.1 Bounded variance

Minor variation is accepted so repeated actions do not always cost one identical round number.

Variance must be:

- narrow enough for meaningful planning;
- deterministic or seeded against the action instance where possible;
- resistant to save/reload or cancel/retry reroll abuse;
- visible as a predicted range where the character or UI can reasonably estimate it;
- incapable of turning a low-intensity action into a high-intensity cost without an actual contextual cause.

Exact variance bands remain later balance work.

## 7. Digestion And Energy Release

Eating adds kilocalories to the digestion pipeline, not directly to the central energy-balance bar.

The body-state resolver should release usable energy over time based on an accepted simplified digestion profile.

Possible later factors include:

- physical form and preparation;
- carbohydrate, fat, and protein proportions;
- liquid versus solid posture;
- meal size;
- current digestive load;
- illness or food-safety consequences.

The design should support the intuitive distinction that some foods restore usable energy sooner while others provide slower or longer release, without requiring a detailed glycemic or biochemical simulation.

Digestive conversion cost should be deducted before or during absorption. Exact protein-, carbohydrate-, and fat-specific values remain open and should not be guessed into implementation by this decision.

## 8. Energy Balance, Fat Storage, And Reserve Use

### 8.1 Positive balance

Absorbed calories first support:

- continuous basal demand;
- action expenditure already incurred or occurring;
- stamina restoration and recovery where permitted;
- other accepted body-repair demands.

Meaningful sustained surplus may then convert into fat reserve.

The system should avoid converting every transient positive tick immediately. Use accumulation thresholds, time windows, or another accepted smoothing method so meals and activity remain stable and understandable.

### 8.2 Negative balance

When expenditure exceeds absorbed energy, the energy balance becomes negative.

A temporary deficit may:

- reduce stamina-recovery speed;
- increase perceived exertion;
- accelerate fatigue accumulation;
- reduce sustained-work efficiency;
- produce temporary physical penalties at larger thresholds.

The body may cover deficits from short-term reserves and fat storage. Exact reserve ordering and conversion efficiency remain later design work.

### 8.3 Severe and prolonged deficit

Only sustained severe deficit should progress toward:

- chronic fatigue;
- reduced temporary Strength or physical output;
- reduced stamina maximum or recovery;
- impaired healing and training adaptation;
- lean-tissue loss;
- persistent or permanent physical-stat loss.

The design accepts that severe long-term atrophy may cause lasting attribute loss. Such loss must be:

- clearly separated from temporary penalties;
- slow enough to avoid accidental punishment from routine play;
- driven by accumulated duration and severity rather than one threshold crossing;
- sensitive to protein, rest, illness, exertion, and remaining reserves;
- recoverable only through an intentional rehabilitation, nutrition, rest, and retraining path if later authority permits recovery.

Whether base attributes mutate directly or persistent body-composition penalties sit above them remains an exact later contract decision.

## 9. Hunger, Satiety, Calories, And Protein

Hunger and satiety must not be aliases for energy balance.

- Hunger represents desire or need to eat and may respond to stomach fullness, routine, exertion, and time.
- Satiety represents how strongly and how long a meal suppresses hunger.
- Calories determine available metabolic energy over time.
- Protein supports tissue maintenance, recovery, and lean-mass preservation.
- Fat and carbohydrate contribute energy with different food and digestion postures.
- Hydration remains separately tracked.

This allows meaningful tradeoffs:

- a high-calorie food may provide poor satiety;
- a filling food may provide modest energy;
- sufficient calories with inadequate protein may preserve energy while harming long-term recovery or lean tissue;
- adequate protein without enough total calories may still leave the character in deficit;
- a balanced meal may improve both energy availability and sustained recovery.

## 10. Temporary Fatigue And Physical Penalties

Energy deficit should affect performance in stages rather than immediately deleting attributes.

Candidate progression:

1. reduced stamina recovery;
2. faster fatigue accumulation;
3. temporary penalties to sustained Strength output, carrying, pace, or work efficiency;
4. reduced stamina maximum or increased action cost at deeper deficits;
5. chronic fatigue and recovery impairment;
6. long-term atrophy and persistent stat consequences only after prolonged severe conditions.

Exact thresholds, durations, notices, and affected derived values remain later balance work.

## 11. Player-Facing Presentation

The preferred high-level UI uses separate indicators.

### 11.1 Energy balance bar

Use a bar centered on `0`:

- left side: deficit;
- center: balanced;
- right side: surplus.

The bar may show exact kilocalories, approximate bands, or descriptive states depending on difficulty and interface decisions.

Candidate descriptive states include:

- deep deficit;
- deficit;
- balanced;
- surplus;
- sustained surplus.

The bar is not total body-fat energy and not stamina.

### 11.2 Stamina bar

Use a conventional bounded stamina meter for immediate exertion capacity.

### 11.3 Hunger and satiety

Display separately from energy and stamina so the player can understand why a character may be full but energy-poor, hungry while still in surplus, or calorically adequate but protein-deficient.

### 11.4 Action preview

Where practical, time-advancing actions may preview:

- expected duration;
- expected stamina cost;
- expected kilocalorie expenditure or a bounded range;
- major modifiers such as burden, weather, temperature, terrain, injury, or fatigue;
- whether current deficit is likely to impair completion or recovery.

The preview must not reveal hidden hazards or exact physiological certainty beyond the accepted information model.

## 12. Owner Boundaries

| Concern | Owner direction | Boundary |
| --- | --- | --- |
| Per-basis food nutrients | Static consumable/nutrition profiles | Kilocalories, macros, hydration, and accepted digestion/satiety descriptors; no body mutation |
| Meal nutrient total | Meal/consumption resolver | Sums physical consumed amounts; does not own long-term body state |
| Digestion pool and absorption | Player body-state/metabolism owner | Time-based release and digestive conversion cost |
| Character BMR | Player body-state/metabolism profile | Seeded baseline and bounded physiological modifiers |
| Activity intensity and duration | Activity, travel, combat, crafting, work, and rest owners | Describe what happened and for how long; do not directly mutate food profiles |
| Contextual energy expenditure | Shared body-state/activity expenditure resolver | Combines BMR, duration, intensity, context, and bounded variance |
| Stamina | Player body/combat/activity state | Immediate exertion capacity and recovery |
| Fat reserve and body composition | Player body-state/body-composition owner | Long-term storage, mass, reserve draw, and atrophy posture |
| Persistent attribute loss | Player attribute/progression/body-state contract | Requires explicit accepted mutation or persistent modifier boundary |
| Hunger and satiety | Player body-state owner | Distinct from calories and stamina |
| Difficulty | Difficulty/global-rules owner | Feature switches, forgiveness, rates, thresholds, and information precision |
| Presentation | UI | Displays authoritative state; does not calculate or mutate it |

Every time-advancing domain should provide duration and activity context to a shared expenditure resolver rather than implementing private calorie math.

## 13. Difficulty And Accessibility

Difficulty should be able to tune independently:

- metabolic-expenditure severity;
- digestion delay or forgiveness;
- deficit penalties;
- fat-storage rate;
- atrophy thresholds and recovery;
- protein-pressure severity;
- information precision;
- whether permanent stat loss is enabled.

An easier mode may preserve the food and stamina loop while making deficits forgiving and disabling permanent attribute loss. A harder mode may make planning, burden, weather, and long-term recovery more consequential.

Accessibility should support clear descriptive states and avoid requiring constant arithmetic from the player.

## 14. Accepted Candidate Values And Open Balance

Accepted candidate direction:

- character BMR base approximately `1,800-2,000 kcal/day` before minor bounded adjustments;
- ordinary active daily expenditure often around the previously accepted `2,500 kcal/day` design anchor;
- sustained high-intensity labor or loaded military activity may approach the previously accepted `3,500-4,000 kcal/day` design anchor;
- action expenditure uses duration, intensity, context, and small bounded variance;
- sleep still incurs baseline metabolic expenditure;
- significant sustained surplus may generate fat;
- significant sustained deficit first reduces recovery and causes fatigue before long-term atrophy.

Still open:

- exact BMR generation formula and stat coefficients;
- exact digestion categories and release curves;
- digestive conversion-cost formula;
- short-term reserve size and smoothing;
- fat conversion efficiency and thresholds;
- deficit reserve ordering;
- action intensity scales and contextual modifiers;
- bounded variance range and deterministic seed policy;
- stamina-to-energy recovery cost;
- protein thresholds and tissue-preservation rules;
- temporary penalty thresholds;
- atrophy timing and severity;
- whether persistent loss mutates base stats or applies recoverable body-state modifiers;
- body-mass, insulation, burden, and appearance effects;
- difficulty values and UI precision.

## 15. Package Direction

The active culinary final-repair audit should incorporate this authority into the same four temporary/result artifacts without implementing it.

A future body-state/metabolism package must remain separate from:

- static food-profile schema work;
- generic item-instance work;
- crafting/process execution;
- generic action delivery;
- market and inventory commands.

It will require accepted contracts for:

- canonical kilocalorie nutrition;
- digestion and meal events;
- time advancement;
- activity intensity and duration;
- stamina;
- body composition;
- persistent attribute effects;
- save/load state;
- difficulty.

Do not make every activity domain own a separate BMR, calorie ledger, digestion pool, fat reserve, or atrophy implementation.

## 16. Non-Goals

- no exact medical or historical physiology claim;
- no organ, hormone, glucose, insulin, glycogen, ketone, or micronutrient simulation;
- no schema, validator, content, test, runtime, UI, save, migration, or balance implementation;
- no changes to live `dailyCalories: 100` behavior;
- no action-cost table;
- no BMR coefficients;
- no fat, weight, appearance, stat-loss, digestion, or stamina values;
- no item, recipe, ration, meal, body, attribute, activity, travel, combat, crafting, rest, or difficulty edits;
- no version assignment;
- no restoration of held `0.6.6`.

## 17. Next Consumer

The immediate consumer is the active unversioned `Culinary Integration Final Contract, Metabolism, And Action-Surface Repair Audit` in `docs/dev/current-codex-prompt.md`.

That run may repair only its authorized four documentation artifacts and must stop for GPT/human inspection.