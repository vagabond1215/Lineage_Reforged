# Fat Mobilization, Body-Stat, And Climate Effects Decision

Date: 2026-07-21

Status: accepted documentation-only metabolism and body-composition refinement; no schema, validator, runtime, UI, save, balance, content, test, or gameplay implementation permission

Run classification: unversioned focused fat-reserve, body-stat, and thermoregulation decision

Milestone impact: `supports_current_band`

## 1. Purpose And Precedence

This decision refines `docs/design/metabolic-energy-stamina-fat-storage-and-atrophy-decision.md` around three accepted requirements:

1. ordinary mild caloric deficits draw on body-fat reserve rather than waiting for severe starvation;
2. body fat contributes to Constitution- and Vitality-adjacent physiological resilience with diminishing returns and tradeoffs;
3. body-fat storage and mobilization are time-limited processes and cannot be exploited as immediate stamina storage.

Where this decision is more specific, it controls fat mobilization, thermoregulation, and body-stat interaction. It does not assign exact coefficients, thresholds, paths, or implementation values.

## 2. Mild Deficits Must Burn Fat

Fat reserve is a normal long-term energy source, not an emergency-only starvation resource.

When absorbed intake and the accepted short-term accessible-energy buffer are insufficient to meet current basal and activity expenditure, the body-state/metabolism resolver should begin drawing a bounded share of the deficit from fat reserve whenever usable fat reserve exists.

This applies to mild deficits as well as deeper deficits. Examples include:

- ordinary time between meals;
- sleeping after a modestly underfed day;
- a routine walk or work period that pushes expenditure slightly above absorbed intake;
- sustained daily intake that is moderately below total expenditure.

A mild deficit should therefore normally produce a small amount of fat use without immediately causing severe fatigue, lean-tissue loss, or stat damage.

The system must not require a character to enter a severe or dangerous deficit before any fat is burned.

## 3. Reserve-Use Order

The exact biochemical order remains intentionally simplified, but the accepted gameplay direction is:

```text
current demand
  -> recently absorbed usable energy
  -> bounded short-term accessible reserve
  -> rate-limited fat mobilization
  -> uncovered deficit pressure
       -> reduced stamina recovery and fatigue
       -> deeper reserve and lean-tissue pressure only when prolonged or severe
```

This ordering is conceptual rather than a claim of exact human biochemistry.

Fat mobilization may occur alongside use of a bounded short-term reserve rather than only after that reserve reaches an absolute zero. The final resolver may blend sources smoothly to avoid sharp threshold behavior.

Lean tissue should remain protected while meaningful fat reserve, adequate protein, and tolerable deficit severity permit it. Fat availability does not provide complete protection when protein is inadequate, illness is severe, or exertion exceeds sustainable recovery.

## 4. Rate-Limited Fat Mobilization

Fat reserve must not behave like an instantly withdrawable battery.

The body may mobilize only a bounded amount of fat-derived energy per unit time. The future contract should define a maximum mobilization rate using a simple authored or derived rule rather than allowing the entire reserve to cover one short action.

Candidate factors include:

- current usable fat reserve;
- body size and composition;
- deficit duration and severity;
- activity intensity;
- recent intake and digestion state;
- hydration;
- illness, injury, fatigue, and metabolic condition;
- temperature and thermoregulatory demand;
- difficulty settings.

Exact formulas remain open.

The mobilization limit must satisfy all of the following:

- it is calculated over elapsed time, not on demand from a single button press;
- it cannot exceed the actual metabolic deficit being covered;
- it cannot instantly refill stamina;
- it cannot convert the entire fat reserve during a burst action;
- it cannot be rerolled through repeated micro-actions, cancellation, saving, or reloading;
- it remains deterministic or seeded under the body-state/time owner;
- it permits ordinary low-intensity deficits to be partially or fully covered;
- it may fail to cover high short-term demand even when substantial fat reserve remains.

When demand exceeds the maximum rate at which absorbed energy, short-term reserve, and fat mobilization can support it, the uncovered portion should contribute to stamina-recovery reduction, fatigue, reduced sustained output, and later deficit consequences.

## 5. Fat Does Not Directly Become Stamina

Fat-derived energy enters the metabolic support flow over time.

It may support:

- basal body functions;
- thermoregulation;
- gradual stamina recovery;
- low- or moderate-intensity sustained activity;
- healing and tissue maintenance where other requirements are met.

It must not provide an immediate combat-style stamina refill, burst-action resource, or player-triggered conversion command.

The player cannot deliberately create a brief deficit, press an action, and receive a short-term performance bonus from fat. Fat burning only helps cover existing expenditure and recovery demand within the mobilization rate.

## 6. Rate-Limited Fat Storage

Fat gain should use the same common-sense time posture.

A positive energy balance may contribute to fat storage only after current metabolic demand, digestion costs, recovery, and the accepted short-term surplus buffer are accounted for.

Storage must be accumulated and smoothed over meaningful elapsed time. A single meal should not instantly produce a large body-composition change.

Future rules should therefore define:

- a surplus accumulation window or buffer;
- a maximum storage rate per unit time;
- conversion loss or inefficiency where accepted;
- body-composition update intervals;
- minimum meaningful change thresholds.

Exact values remain open.

## 7. Constitution And Vitality Interaction

Body fat should contribute to Constitution- and Vitality-adjacent outcomes, but not as an unlimited direct attribute bonus.

Preferred direction:

- a useful reserve range modestly supports resilience during underfeeding, illness, exposure, and recovery interruption;
- very low reserve reduces protection against prolonged deficit and cold exposure;
- additional reserve above a useful range provides progressively smaller resilience gains;
- excessive reserve may introduce countervailing heat, burden, mobility, stamina, and recovery costs;
- the result uses diminishing returns and may become neutral or negative at high levels depending on context.

The safest future implementation posture is a derived physiological modifier or contribution to relevant Constitution/Vitality checks, recovery calculations, and thresholds—not silent permanent mutation of the character's base attributes.

If a later decision allows body composition to modify displayed effective Constitution or Vitality, it must preserve the distinction between:

- inherited or trained base attribute;
- temporary condition modifier;
- persistent body-composition modifier;
- injury, illness, fatigue, and environmental modifiers.

No amount of fat reserve should make a character universally tougher, immune to starvation, or superior in every Constitution or Vitality use.

## 8. Diminishing-Return Shape

The future body-composition resolver should use a bounded nonlinear or banded relationship rather than a linear bonus per unit of fat.

A candidate conceptual shape is:

```text
very low reserve
  -> meaningful vulnerability

low-to-functional reserve
  -> largest marginal resilience improvement

functional-to-elevated reserve
  -> smaller additional benefit

elevated-to-high reserve
  -> little added reserve benefit and increasing tradeoffs

very high reserve
  -> no further resilience gain; heat, burden, mobility, and stamina costs may dominate
```

The exact bands, curve, and character-frame normalization remain open. Do not use one universal raw kilogram threshold for every ancestry, body size, age, or physiology without a later accepted normalization contract.

## 9. Cold-Climate Effects

Body fat provides a modest insulation and reserve benefit in cold conditions.

Accepted direction:

- higher fat reserve may reduce cold-stress accumulation slightly;
- it may marginally reduce thermoregulatory calorie expenditure in cold conditions;
- it may slow the onset of some cold-related fatigue or Constitution/Vitality pressure;
- benefits use diminishing returns;
- clothing, shelter, fire, dryness, wind protection, activity, acclimatization, health, and exposure duration remain more important controls;
- body fat never grants immunity to cold, frostbite, hypothermia, wet exposure, or magical cold.

The effect should be noticeable over long exposure or population-scale comparison without becoming the dominant cold-survival strategy.

## 10. Hot-Climate Effects

Additional body fat makes heat management progressively more difficult.

Accepted direction:

- elevated fat reserve may increase heat-stress accumulation;
- it may increase thermoregulatory cost and hydration pressure;
- it may reduce sustained-work tolerance in hot or humid conditions;
- heavy clothing, armor, direct sun, humidity, poor ventilation, burden, and exertion may compound the effect;
- the penalty should also use a bounded nonlinear relationship rather than a flat punishment per unit.

A useful reserve should not make ordinary warm weather intolerable. Heat penalties should become more material as reserve, temperature, humidity, clothing/armor, and exertion combine.

## 11. Climate Tradeoff

Fat reserve creates a contextual tradeoff rather than a universally optimal target:

| Context | Lower reserve | Functional reserve | Elevated reserve |
| --- | --- | --- | --- |
| Mild deficit | Less reserve protection | Normal bounded fat use | More total reserve, same rate limits |
| Prolonged scarcity | Earlier severe pressure | Better resilience | More reserve duration, diminishing benefit |
| Cold | Higher vulnerability | Modest insulation | Slightly greater insulation, diminishing returns |
| Heat/humidity | Easier heat shedding | Normal posture | Increasing heat and hydration pressure |
| Burden/movement | Lower body-mass cost | Normal posture | Potential mass, stamina, and mobility costs |
| Recovery | Less energy reserve | Useful reserve support | No unlimited recovery bonus; tradeoffs may offset |

Exact balance remains later work.

## 12. Exploit Prevention

The future resolver must prevent common manipulation patterns.

Prohibited behavior includes:

- deliberately oscillating the energy bar around zero to receive repeated conversion bonuses;
- converting fat directly into stamina on command;
- using one high-intensity action to mobilize an unlimited amount of stored fat;
- canceling or replaying actions to reroll fat burn;
- gaining both stored fat and full unspent surplus from the same calories;
- reversing already elapsed fat burn merely by eating immediately afterward;
- treating body fat as a weightless reserve with no mass or climate consequences;
- using high fat reserve to avoid protein requirements or all atrophy risk.

Fat storage, mobilization, metabolic expenditure, and body-composition updates should be owned by one time-aware body-state resolver so all actions consume the same authoritative ledger.

## 13. Player-Facing Presentation

The central zero-based Energy bar remains the preferred short-term display. Fat reserve should not be shown as part of that bar.

Possible later presentation includes:

- a body-condition or reserve descriptor;
- approximate fat-reserve bands;
- cold-resilience and heat-burden indicators;
- a statement that current deficit is being partly supported by reserves;
- warnings when expenditure exceeds current mobilization and recovery capacity.

The UI does not need to expose an exact maximum fat-mobilization equation on ordinary difficulty. Higher-information settings may show estimated reserve contribution or sustainable-deficit ranges.

## 14. Owner Boundaries

| Concern | Owner direction | Boundary |
| --- | --- | --- |
| Fat amount and body composition | Player body-state/body-composition owner | Persistent reserve and body-mass truth |
| Fat storage and mobilization | Body-state/metabolism resolver | Time-based, rate-limited conversion; no player-triggered command |
| Current deficit | Body-state/metabolism owner | Absorption and expenditure difference |
| Activity demand | Activity/travel/combat/crafting/rest owners | Duration and intensity context only |
| Stamina | Stamina/body-state owner | Immediate capacity; consumes metabolic support only through recovery rules |
| Constitution/Vitality contribution | Body-state plus attribute-resolution contract | Derived diminishing-return modifier; no silent base-stat rewrite |
| Cold and heat context | Environment/weather plus body-state resolver | Environment supplies conditions; body state applies composition interaction |
| Difficulty | Difficulty/global-rules owner | Rates, thresholds, permanence, and information precision |
| Presentation | UI | Displays authoritative state without calculating it |

No activity domain should privately burn fat. No weather domain should directly mutate body composition. No food profile should own character fat storage or mobilization.

## 15. Accepted Direction And Open Balance

Accepted:

- mild deficits normally draw on fat reserve;
- fat use begins before severe starvation when usable reserve exists;
- mobilization is rate-limited by elapsed time and cannot instantly cover burst demand;
- fat supports metabolic demand and stamina recovery indirectly, never as an instant stamina resource;
- storage is also smoothed and time-limited;
- fat contributes to Constitution/Vitality-adjacent resilience with diminishing returns and contextual tradeoffs;
- useful fat reserve marginally improves cold tolerance;
- higher fat reserve makes heat and humidity more difficult;
- fat cannot replace protein, rest, hydration, shelter, clothing, or acclimatization;
- one authoritative body-state resolver owns the ledger.

Open:

- exact usable-reserve normalization;
- exact mild-deficit blending between short-term reserve and fat;
- maximum fat-mobilization rate and its modifiers;
- maximum storage rate and conversion loss;
- Constitution/Vitality contribution shape and caps;
- cold insulation and thermoregulatory-expenditure coefficients;
- heat, humidity, armor, and hydration interaction;
- body-mass, movement, stamina, appearance, and encumbrance effects;
- ancestry, age/life-stage, and body-frame normalization;
- difficulty and information-precision values.

## 16. Package And Prompt Direction

The active final culinary repair should incorporate this decision into its four authorized result artifacts.

A future metabolism/body-composition contract must explicitly define:

- the short-term accessible reserve;
- mild-deficit fat draw;
- maximum mobilization and storage rates;
- uncovered-deficit behavior;
- Constitution/Vitality-derived modifiers;
- climate interactions;
- body-mass and stamina tradeoffs;
- persistence and deterministic time advancement;
- exploit-resistant validation.

This work remains separate from static food profiles, generic item instances, crafting execution, market commands, and UI.

## 17. Non-Goals

- no exact medical claim or biochemical simulation;
- no fixed fat-mobilization kcal/hour value;
- no body-fat percentage bands;
- no Constitution or Vitality coefficient;
- no climate coefficient;
- no schema, validator, test, runtime, save, UI, content, or balance implementation;
- no live attribute, body-state, stamina, weather, travel, combat, food, or difficulty changes;
- no version assignment;
- no restoration of held `0.6.6`.

## 18. Next Consumer

The immediate consumer is the active unversioned `Culinary Integration Final Contract, Metabolism, And Action-Surface Repair Audit` in `docs/dev/current-codex-prompt.md`.

That run may repair only its authorized four documentation artifacts and must stop for GPT/human inspection.