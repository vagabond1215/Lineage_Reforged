# Unified Physical Attribute Growth And Nutrition-Band Integration Decision

Status: accepted documentation-only integration authority  
Date: 2026-07-21  
Scope: reconcile stat growth, immutable base attributes, current attributes, nutrition, recovery, body composition, structural atrophy, and difficulty controls  
Implementation authorization: none

## 1. Decision Summary

Lineage: Reforged will use one authoritative attribute-growth system and one authoritative current-attribute resolver.

The term **base attribute** means the character's immutable foundational value. Ordinary training, nutrition, fatigue, injury, disease, recovery, disuse, and structural atrophy never rewrite it.

Long-term development and long-term loss are persistent adjustments resolved around that immutable base:

```text
immutable base attribute
  + persistent developed adjustment
  + persistent structural-loss adjustment
  + reversible body-condition adjustments
  + injury, illness, climate, equipment, magic, status, and contextual adjustments
  -> current attribute
```

The exact additive and multiplicative ordering remains an implementation contract, but the ownership invariant is accepted:

- base attributes do not change;
- the existing stat-growth owner changes persistent developed adjustments;
- structural atrophy may create persistent negative adjustments through that same owner;
- body state supplies nutrition, recovery, fatigue, Lean Condition, and atrophy pressure;
- the attribute resolver computes the current stat from every authorized adjustment;
- no second muscle-growth or Strength-progression ledger exists.

A so-called permanent Strength loss is therefore **persistent structural loss**, not deletion of the base attribute and not an unrecoverable character penalty. It persists until the character rebuilds the lost capacity through qualifying activity, adequate nutrition, recovery, and the ordinary stat-growth process.

## 2. Research Artifact Disposition

The temporary deep-research artifact is evidence support and design exploration only. It is not a player-facing publication, permanent source ledger, canonical bibliography, lore authority, or marketing source.

The artifact may be deleted after its accepted conclusions are transferred into durable decisions. Bibliographic formatting and author-name polish are not prerequisites for this integration unless a later audit depends on a disputed source-specific claim.

No player-facing content, UI, codex entry, marketing copy, or lore may cite or represent the temporary research-paper list as game authority.

## 3. Canonical Attribute Vocabulary

### 3.1 Base attribute

`baseAttribute` is the immutable foundational value established by character creation and the accepted character-foundation rules.

It does not change through:

- training;
- ordinary aging or inactivity;
- food intake or deprivation;
- Fatigue or Recovery Debt;
- Lean Condition;
- structural atrophy;
- injury, illness, climate, equipment, or magic.

A later transformation, curse, blessing, lineage expression, or story effect must also be represented as an adjustment unless a future explicit character-foundation decision deliberately changes this invariant.

### 3.2 Persistent developed adjustment

`developedAdjustment` is the persistent capacity created by qualifying use, training, adaptation, and consolidation.

The existing stat-growth framework remains its sole owner. It provides:

1. one progression owner for all nine attributes;
2. per-attribute load thresholds;
3. daily soft caps;
4. diminishing returns and saturation;
5. recovery-quality gating;
6. bounded deterministic or seeded variation;
7. progression accumulation;
8. anti-farming controls;
9. conversion of qualifying load into persistent adjustment changes.

Nutrition and body state do not create a parallel `muscleAdaptation` currency.

### 3.3 Persistent structural-loss adjustment

`structuralLossAdjustment` is a persistent negative adjustment caused only by sufficiently prolonged and severe structural deterioration.

It is not ordinary Fatigue, one bad day, a missed meal, a temporary Energy deficit, or reversible Lean Condition decline.

Structural loss:

- is enabled by default;
- begins only after configurable severity and duration gates;
- accumulates slowly and under hard rate limits;
- is bounded by floors and safety rules;
- is applied through the stat-growth owner;
- cannot passively recover merely because the character starts eating and resting;
- is removed only through qualifying rebuilding activity and the normal growth pipeline.

The player can regain the lost current Strength, but must rebuild it rather than merely wait for recovery.

### 3.4 Reversible condition adjustments

Reversible adjustments include:

- Stamina state;
- Fatigue;
- Recovery Debt;
- short-term Energy availability;
- hydration;
- Lean Condition;
- acute illness and injury effects;
- temporary heat, cold, burden, and environmental effects.

These may improve through time, food, rest, treatment, shelter, and resumed ordinary use without requiring full stat-growth progression.

### 3.5 Current attribute

`currentAttribute` is the canonical gameplay value after every authorized adjustment is resolved.

Conceptual contract:

```text
currentAttribute = resolveAttribute(
  baseAttribute,
  developedAdjustment,
  structuralLossAdjustment,
  reversibleConditionAdjustments,
  injuryIllnessAdjustments,
  climateAndBurdenAdjustments,
  equipmentAdjustments,
  magicAndStatusAdjustments,
  contextualAdjustments
)
```

The game should ordinarily use and display the current attribute for checks and derived values. The immutable base and individual adjustments may be shown in detailed views, debugging, character analysis, or explanatory breakdowns.

## 4. One Physical Event, Distinct Outputs

An activity may legitimately produce several related outputs, but each output has one owner and one meaning.

| Output | Meaning | Owner |
|---|---|---|
| stamina demand | immediate action capacity spent | stamina/body-state owner |
| calorie demand | metabolic expenditure from duration and context | shared expenditure resolver |
| fatigue load | short-term physiological burden | recovery/body-state owner |
| recovery demand | persistent stress requiring repair | recovery/body-state owner |
| physical stimulus | capacity-relative challenge eligible to inform growth | shared activity-to-growth input contract |
| attribute load | STR, CON, VIT, AGI, DEX, or other progression relevance | stat-growth owner |
| skill practice | domain knowledge or technique practice | skill-progression owner |

The same event must not independently grant both full STR progress and a second muscle-adaptation reward.

Activity owners describe what happened. They do not directly mutate base attributes, persistent developed adjustments, structural-loss adjustments, or body tissue.

## 5. Unified Strength Growth

### 5.1 Development

Persistent Strength development uses the existing stat-growth owner.

Candidate conceptual relationship:

```text
STR developed-adjustment change
  = qualifying_strength_load
  * capacity_relative_stimulus
  * physiological_growth_gate
  * recovery_completion
  * existing_daily_cap_and_diminishing_rules
```

This is a contract shape, not an accepted formula.

The physiological gate may consume:

- rolling Energy coverage;
- Protein Support;
- hydration;
- sleep and rest;
- Fatigue and Recovery Debt;
- injury and illness;
- current Lean Condition;
- excessive-stress or overreach state.

Moving from deficiency to adequacy should materially improve consolidation. Excess food or protein cannot multiply growth without limit or bypass existing daily caps.

### 5.2 No separate muscle-adaptation stat

The research candidate `adaptationCondition` must not become a second persistent Strength currency.

| Proposed function | Final owner |
|---|---|
| lasting development from repeated qualifying load | stat-growth developed adjustment |
| current reversible weakness or robustness | Lean Condition and current-attribute resolution |
| recent detraining before tissue destruction | Lean Condition and reduced maintenance support |
| structural muscle destruction | structural atrophy pressure plus persistent structural-loss adjustment |
| rebuilding destroyed muscle | ordinary stat-growth pipeline, not passive recovery |
| appearance thresholds | presentation consuming base, persistent development, structural loss, Lean Condition, fat, and body-size context |

### 5.3 Structural loss and rebuilding

Structural loss occurs only after prolonged neglect, disuse, severe deficit, illness, injury, or combinations defined by the body-state and difficulty contracts.

The staged default is:

1. reduced Stamina recovery and increased Fatigue;
2. Recovery Debt;
3. reversible Lean Condition decline;
4. sustained structural-atrophy pressure;
5. slow persistent structural-loss adjustment;
6. rebuilding through qualifying effort and normal stat growth.

Restoring adequate nutrition and rest:

- stops or reduces further loss when the causal conditions end;
- restores Fatigue, Recovery Debt, and Lean Condition through their own recovery rules;
- does not automatically erase structural-loss adjustment.

Rebuilding requires:

- resumed qualifying Strength load;
- adequate Energy and Protein Support;
- hydration and rest;
- elapsed recovery time;
- progression caps and diminishing returns;
- the same anti-farming protections used for new development.

Default rebuilding uses the ordinary growth process. No automatic accelerated retraining or passive muscle-memory restoration is assumed. A future difficulty or trait option may authorize bounded retraining assistance without creating a second progression ledger.

## 6. Unified CON, VIT, And Other Attribute Growth

All persistent attribute development remains stat-growth-owned.

Candidate physical distinctions:

- STR load represents force production, resistance, lifting, carrying, climbing, striking, grappling, and comparable capacity-relative muscular demand.
- CON load represents sustained tolerance of exertion, hardship, burden, environmental stress, and repeated work without immediate failure.
- VIT load represents recovery resilience, bodily maintenance, restoration from physiological stress, and survival-oriented endurance where accepted attribute definitions support that interpretation.
- AGI and DEX load remain coordination-, movement-, balance-, precision-, and technique-specific rather than automatic rewards for generic hard work.

Nutrition and body state gate consolidation. Eating does not directly grant STR, CON, VIT, AGI, or DEX development.

Structural loss is most directly relevant to physical attributes. Any persistent loss for mental or social attributes requires a separate explicit contract and cannot be inferred from the nutrition model.

## 7. State And Timescale Invariants

| State | Typical timescale | Meaning | Recovery path |
|---|---|---|---|
| stamina | seconds to hours | immediate exertion capacity | rest and supported restoration |
| fatigue | minutes to days | acute physiological burden | rest, nutrition, treatment, time |
| recovery debt | hours to days | unresolved accumulated demand | sustained adequate recovery |
| Lean Condition | days to weeks | reversible physical condition | adequate intake, rest, health, resumed use |
| structural atrophy pressure | weeks or longer | risk and accumulation toward persistent loss | remove causes; may halt before adjustment loss |
| structural-loss adjustment | long-term persistent | destroyed capacity requiring rebuilding | qualifying stat growth only |
| developed adjustment | long-term persistent | trained or adapted capacity | qualifying stat growth |
| base attribute | immutable | foundational character value | never recovered because never changed |
| current attribute | immediate resolution | actual value used now | recomputed from all adjustments |

One missed meal, one difficult day, several ordinary rest days, or a short illness cannot create structural-loss adjustment.

## 8. Default Difficulty Posture

Nutrition, recovery, structural atrophy, and persistent structural loss are enabled by default.

Difficulty and custom rules own the harshness, timing, and visibility of consequences. Required controls include:

- master nutrition-consequence toggle;
- structural-atrophy toggle;
- persistent structural-loss toggle;
- minimum deficit severity required for atrophy pressure;
- duration or grace period before structural loss may begin;
- disuse contribution and grace period;
- illness and injury contribution;
- structural-loss accumulation rate;
- maximum loss per update and per longer interval;
- persistent-loss floor;
- rebuilding rate multiplier;
- Energy and Protein band-forgiveness percentage or threshold offset;
- hysteresis and sustained-crossing requirements;
- warning lead time and forecast precision;
- optional bounded retraining assistance;
- player-visible information precision.

Recommended preset direction:

| Preset | Default posture |
|---|---|
| Accessible | systems enabled; long grace periods, forgiving bands, slow loss, strong warnings, faster rebuilding |
| Standard | systems enabled; substantial grace period, baseline bands, slow capped loss, ordinary rebuilding |
| Simulation | systems enabled; stricter bands, shorter but still meaningful grace periods, stronger cumulative effects, ordinary or slower rebuilding |
| Custom Off | nutrition and structural-loss effects may be disabled independently |

Enabling structural loss by default does not authorize rapid punishment. The normal character must be significantly neglected or impaired for a sustained period before current Strength loses persistent structural capacity.

## 9. Difficulty-Adjusted Coverage Bands

Energy and protein remain continuous physical truth internally.

Difficulty changes consequence thresholds and forgiveness, not the authored kcal or protein contained in food.

Conceptual separation:

```text
rawCoverage = absorbedAmount / individualDemand
adjustedCoverage = applyDifficultyForgiveness(rawCoverage, difficultyRules)
```

The raw ratio remains available for simulation, auditing, and detailed UI. The adjusted ratio or adjusted thresholds drive difficulty-specific bands and consequences.

### 9.1 Standard Energy coverage candidates

| Exclusive band | Candidate region | Standard posture |
|---|---:|---|
| Deep Deficit | `< 0.80` | strong recovery pressure; sustained exposure may contribute to atrophy |
| Deficit | `0.80 to < 0.95` | reserve use and mild recovery pressure |
| Balanced | `0.95 to < 1.05` | normal maintenance and recovery support |
| Surplus | `1.05 to < 1.15` | removes energy constraint; modest storage support |
| Excess | `>= 1.15` | little additional growth value; increasing storage pressure |

### 9.2 Standard Protein coverage candidates

| Exclusive band | Candidate region | Standard posture |
|---|---:|---|
| Deficient | `< 0.60` | strong recovery limitation and sustained lean-loss pressure |
| Low | `0.60 to < 0.85` | noticeable recovery limitation |
| Adequate | `0.85 to < 1.10` | full maintenance and ordinary recovery support |
| Recovery Supporting | `1.10 to < 1.30` | small capped benefit when real recovery demand exists |
| Saturated | `>= 1.30` | no further development multiplier |

Difficulty may make these bands more or less forgiving through percentage shifts, target multipliers, or threshold offsets. It must not create overlapping mechanical ranges.

Effects use continuous curves. Bands are presentation, warning, AI-planning, and coarse-rule labels.

## 10. Hysteresis, Windows, And Anti-Gaming

The eventual implementation must:

- use rolling weighted windows rather than midnight resets;
- use a shorter Energy window and a longer Protein/recovery window;
- require sustained severity before structural effects advance;
- require a separate prolonged gate before persistent structural loss begins;
- use entry and exit hysteresis around band boundaries;
- preserve exact underlying ratios;
- prevent one meal from restoring long-term condition;
- prevent one missed meal from causing long-term loss;
- prevent repeated boundary crossing from triggering rewards or penalties;
- prevent trivial micro-actions from farming rebuilding;
- prevent excessive intake from bypassing progression caps;
- prevent intentional loss-and-regain loops from outperforming ordinary development.

## 11. Nutrition As A Growth Variable

Nutrition and body state enter stat growth as bounded support factors, not as a second reward ledger.

```text
physiologicalGrowthGate = combine(
  energySupport,
  proteinSupport,
  hydrationSupport,
  sleepRestSupport,
  injuryHealthSupport,
  fatigueRecoverySupport
)
```

Recommended combination posture:

- use a limiting-factor model with smoothing;
- severe deficiency in one essential factor cannot be purchased away through excess in another;
- use a soft minimum or bounded geometric combination rather than a raw hard minimum;
- cap the result near normal support;
- permit only a small benefit above adequacy when real recovery demand exists;
- excess food cannot exceed existing stat-growth caps;
- poor recovery can suppress consolidation even after valid load.

Exact coefficients remain balance work.

## 12. Accuracy Versus Simplicity

The recommended Standard model uses:

1. exact physical kcal and macro truth internally;
2. time-aware digestion;
3. continuous normalized Energy and Protein coverage;
4. mutually exclusive descriptive bands;
5. difficulty-controlled threshold forgiveness;
6. one recovery-quality factor;
7. one stat-growth owner;
8. one immutable base attribute;
9. persistent developed and structural-loss adjustments;
10. reversible Lean Condition;
11. current-attribute resolution from all adjustments;
12. no biochemical glycogen, amino-acid, hormone, or organ simulation;
13. no requirement that ordinary players calculate grams per kilogram.

## 13. Cultural, Economic, And Lineage Posture

No additional broad historical-diet research is required for this physiological contract.

Culture, class, occupation, politics, religion, season, geography, war, trade, wealth, and habit affect food availability, customary diets, preservation, scarcity, activity, body condition, knowledge, and price. They operate through content and actual behavior, not culture-specific metabolic equations.

Ordinary human cultures or ancestry categories do not receive distinct calorie or protein mechanics by default.

Fantasy lineages may differ only through explicitly authored physiological traits such as materially different body size, thermoregulation, digestive anatomy, magical metabolism, hibernation, or nonhuman tissue requirements. Those differences must be trait-owned and bounded.

## 14. Owner Matrix

| Concern | Authority |
|---|---|
| immutable base attributes | character-foundation/attribute authority; read-only after creation |
| persistent developed adjustment | existing stat-growth owner |
| atrophy pressure and body-tissue state | body-state/body-composition owner |
| persistent structural-loss adjustment | stat-growth owner consuming authorized atrophy pressure |
| current-attribute calculation | attribute-resolution owner |
| activity description and domain results | activity owner |
| normalized physical stimulus | shared activity-to-growth contract |
| kcal expenditure | shared body-state expenditure resolver |
| digestion and nutrient availability | body-state metabolism/nutrition owner |
| Fatigue and Recovery Debt | body-state recovery owner |
| Lean Condition | body-state/body-composition owner |
| food nutrient truth | static nutrition and meal-aggregation owners |
| difficulty toggles, grace periods, rates, floors, and band forgiveness | difficulty/global-rules owner |
| presentation bands and forecasts | UI projection only |

## 15. Integration Consequences

A later implementation should extend the existing stat-growth input and recovery contracts rather than introduce a parallel muscle-progression schema.

Likely work includes:

- preserving immutable base-attribute fields;
- adding or clarifying persistent developed-adjustment fields;
- adding persistent structural-loss adjustment and atrophy-pressure state;
- adding a single current-attribute resolver;
- adding normalized physical-stimulus descriptions to time-advancing activity results;
- supplying Energy, Protein Support, hydration, rest, Fatigue, health, and Lean Condition to growth consolidation;
- retaining per-stat thresholds, daily caps, diminishing returns, and bounded RNG;
- establishing deterministic daily and long-interval updates;
- adding difficulty toggles, grace periods, rates, floors, threshold forgiveness, and warnings;
- adding save migration for any existing fields that currently conflate base and current values;
- proving that one action cannot double-award physical progression;
- proving that passive recovery cannot erase persistent structural loss;
- proving that qualifying rebuilding can restore current Strength without changing base Strength.

This decision does not authorize those changes.

## 16. Remaining Open Decisions

The architecture is accepted. Later contract or balance work must determine:

1. the exact current-attribute combination order for additive and multiplicative adjustments;
2. exact grace periods, severity thresholds, rates, floors, and warnings for each difficulty preset;
3. the exact activity-to-STR/CON/VIT/AGI/DEX load mapping;
4. exact Energy and Protein rolling windows and hysteresis margins;
5. the exact smoothed limiting-factor function;
6. whether any bounded retraining assistance exists outside the default ordinary-growth rebuilding path;
7. the exact BMR generator and accepted body-size, trait, health, age/life-stage, and composition inputs;
8. the migration route from legacy calorie, protein, base-stat, current-stat, and effective-stat fields;
9. the milestone and package sequence for implementation.

These are balance and implementation-contract decisions, not unresolved questions about whether structural loss exists or whether base attributes change.

## 17. Explicit Non-Decisions

This decision does not:

- implement metabolism, digestion, body composition, atrophy, stat growth, difficulty, saves, or current-attribute changes;
- accept exact numerical coefficients as canon;
- assign a release version;
- change the held Version 0.6.6 route;
- require preservation of the temporary research artifact after durable integration is complete.
