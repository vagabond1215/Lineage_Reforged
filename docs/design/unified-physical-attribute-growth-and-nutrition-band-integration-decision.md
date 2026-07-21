# Unified Physical Attribute Growth And Nutrition-Band Integration Decision

Status: accepted documentation-only integration authority  
Date: 2026-07-21  
Scope: reconcile the live stat-growth framework with the metabolism, protein, recovery, body-composition, and atrophy direction  
Implementation authorization: none

## 1. Decision Summary

Lineage: Reforged will use one authoritative base-attribute growth system.

The existing stat-growth framework remains the sole owner of permanent or long-term base STR, DEX, AGI, CON, VIT, WIS, INT, SPT, and CHA progression. The metabolism and body-state model does not create a second muscle-growth progression track.

For physical attributes, the newer nutrition and body-state model supplies physiological inputs, gates, temporary modifiers, and loss pressure to the existing stat-growth owner:

```text
activity or training event
  -> normalized load and skill/context description
  -> shared body-state resolution
       -> expenditure
       -> stamina use
       -> fatigue and recovery demand
       -> meaningful physical stimulus
  -> existing stat-growth resolver
       -> attribute-relevant load
       -> nutrition/recovery gate
       -> daily caps and diminishing returns
       -> long-term base-stat progress

body state
  -> temporary effective-attribute modifiers
       -> fatigue
       -> energy deficit
       -> lean-condition loss
       -> injury or illness
       -> climate burden
```

The result is one progression system with a richer physiological gate, not two systems that both grant Strength.

## 2. Research Artifact Disposition

The temporary deep-research artifact is evidence support and design exploration only. It is not a player-facing publication, a permanent source ledger, or a canonical bibliography.

The artifact may be deleted after its accepted conclusions are transferred into durable decisions. Bibliographic formatting and author-name polish are therefore not a prerequisite for this integration decision unless a later audit depends on a specific source claim.

No player-facing content, UI, codex entry, marketing copy, or lore may cite or represent the temporary research paper list as game authority.

Durable design decisions must preserve the accepted relationship and confidence posture without carrying unnecessary academic citation detail.

## 3. Why The Existing Stat-Growth Framework Remains

The existing stat-growth framework provides functions that the proposed nutrition/body-state model does not replace:

1. one general progression owner for all nine base attributes;
2. per-attribute load thresholds;
3. daily soft caps;
4. diminishing returns and saturation;
5. recovery-quality gating;
6. bounded deterministic or seeded variation;
7. progression accumulation and conversion into base-stat gains;
8. consistent handling of mental, social, agility, dexterity, physical, and resilience growth;
9. one location for long-term progression tuning and anti-farming controls.

The nutrition research model primarily describes physical physiology. Replacing the general stat-growth framework with it would either leave the nonphysical attributes without an owner or duplicate common progression functions inside body state.

The preferred approach is therefore to preserve the existing progression skeleton and improve its physical inputs and recovery gate.

A later implementation may refactor or rename the existing code, but the functional contract above remains necessary.

## 4. One Physical Event, Multiple Distinct Outputs

An activity may produce several related outputs, but each output has one owner and one meaning.

| Output | Meaning | Owner |
|---|---|---|
| stamina demand | immediate action capacity spent | stamina/body-state owner |
| calorie demand | metabolic expenditure caused by duration and context | shared expenditure resolver |
| fatigue load | short-term exertion and physiological strain | recovery/body-state owner |
| recovery demand | persistent stress that must be repaired | recovery/body-state owner |
| physical stimulus | capacity-relative challenge eligible to inform growth | shared activity-to-growth input contract |
| attribute load | STR, CON, VIT, AGI, DEX, or other progression relevance | stat-growth owner |
| skill practice | domain knowledge or technique practice | skill progression owner |

The same activity may legitimately produce several of these outputs. It must not independently calculate several competing versions of Strength gain.

Activity owners describe what happened. They do not award muscle, delete lean tissue, or directly mutate base attributes.

## 5. Unified STR Growth

### 5.1 Permanent or long-term Strength

Long-term Strength development uses the existing stat-growth owner.

Candidate conceptual relationship:

```text
STR progression contribution
  = qualifying_strength_load
  * capacity_relative_stimulus
  * physiological_growth_gate
  * recovery_completion
  * existing_daily_cap_and_diminishing_rules
```

This is a contract shape, not an accepted formula.

The physiological growth gate may consume:

- rolling energy coverage;
- protein support;
- hydration;
- sleep and rest;
- fatigue and recovery debt;
- injury and illness;
- current Lean Condition;
- excessive-stress or overreach state.

Moving from nutritional deficiency to adequacy should materially improve the chance that qualifying load becomes useful progress. Excess nutrition above the useful range cannot multiply Strength gain without limit.

### 5.2 No separate muscle-adaptation stat

The research candidate `adaptationCondition` must not become a second persistent Strength progression currency.

The functions originally proposed for it divide as follows:

| Proposed function | Final owner |
|---|---|
| lasting physical development from repeated qualifying load | existing stat-growth owner |
| current reversible weakness or robustness | Lean Condition/body state |
| recent detraining before tissue loss | Lean Condition plus effective-attribute resolution |
| structural atrophy | body-composition state producing loss pressure |
| faster reacquisition of recently lost development | stat-growth modifier bounded by recent stable peak/history |
| appearance thresholds | body-state presentation consuming base STR, Lean Condition, fat, and body-size context |

No action may grant both independent muscle-adaptation progress and full STR progression from the same physiological stimulus.

### 5.3 Temporary effective Strength

Temporary performance is resolved separately from base Strength:

```text
effective STR
  = base STR
  + permitted equipment, magic, or status additions
  * or through the repository's accepted effective-attribute composition rule
  then modified by:
      stamina state
      fatigue
      recovery debt
      energy availability
      Lean Condition
      injury and illness
      climate burden
      encumbrance and movement context
```

The exact additive or multiplicative composition remains an attribute-resolution contract decision. Body state must not silently overwrite the saved base attribute.

## 6. Unified CON And VIT Growth

CON and VIT remain base attributes owned by the existing stat-growth system.

They should not receive Strength load merely because physical work occurred.

Candidate distinction:

- STR load represents force production, resistance, lifting, carrying, climbing, striking, grappling, and comparable capacity-relative muscular demand.
- CON load represents sustained tolerance of exertion, hardship, burden, environmental stress, and repeated work without immediate failure.
- VIT load represents recovery resilience, bodily maintenance, restoration from physiological stress, and survival-oriented endurance where the repository's attribute definitions support that interpretation.

Nutrition and body state influence whether these loads are safely consolidated into growth. They do not create free CON or VIT progress from eating.

Body fat may contribute bounded Constitution- or Vitality-adjacent derived resilience and climate response, but it does not directly grant base CON or VIT growth.

## 7. Lean Condition, Fatigue, And Atrophy Invariants

The following states must remain nonoverlapping:

| State | Timescale | Meaning | May directly change base STR? |
|---|---|---|---|
| stamina | seconds to hours | immediate exertion capacity | no |
| fatigue | minutes to days | short-term physiological burden | no |
| recovery debt | hours to days | unresolved accumulated recovery demand | no |
| Lean Condition | days to weeks | reversible current physical condition and functional tissue support | no |
| structural atrophy | weeks to months | persistent tissue-loss state or pressure requiring rehabilitation | only through the stat-growth owner and an explicit permanence rule |
| base STR | long-term | permanent/trained attribute progression | yes, but only through stat growth |

Lean Condition may apply temporary effective-Strength, carrying, work-efficiency, or recovery modifiers. It should return toward the character's maintained baseline faster than new base-stat growth occurs.

Structural atrophy may suppress progress, create negative progression pressure, reduce the recoverable ceiling, or—only when explicitly authorized—cause base-stat loss through the stat-growth owner.

One missed meal, one difficult day, or several ordinary rest days cannot cause structural base-stat loss.

## 8. Recommended Base-Stat Loss Posture

The recommended default is:

- Accessible and Standard difficulties: ordinary nutritional deficits and disuse do not directly delete base attributes. They affect Fatigue, Recovery Debt, Lean Condition, and structural-atropy pressure first.
- Severe structural atrophy can create a persistent recoverable condition penalty.
- Direct base-stat loss remains disabled unless a later difficulty or story contract explicitly enables it.
- When enabled, base-stat loss must be executed by the existing stat-growth owner as negative progression or a controlled decrement, with strong grace periods, warnings, floors, hysteresis, and rehabilitation support.

This preserves meaningful consequences without making routine food management erase long-term character progression.

## 9. Nutrition As A Variable In Existing Growth

Nutrition and body state should enter the existing progression system as bounded factors, not as a second reward ledger.

Recommended conceptual inputs:

```text
physiological_growth_gate = combine(
  energy_support,
  protein_support,
  hydration_support,
  sleep_rest_support,
  injury_health_support,
  fatigue_recovery_support
)
```

Recommended combination posture:

- use a limiting-factor model with smoothing;
- severe deficiency in one essential factor cannot be purchased away through excess in another;
- use a soft-minimum or bounded geometric combination rather than a hard instantaneous minimum;
- cap the result near normal support;
- permit only a small benefit above adequacy when real recovery demand exists;
- excess protein or calories cannot exceed the existing daily progression cap;
- poor recovery can reduce consolidation even when the activity created valid load.

A suitable later implementation shape is a weighted geometric mean with a strong floor penalty, or a smoothed minimum blended with the ordinary mean. A strict raw minimum is simple but can make one marginally low factor dominate too abruptly.

## 10. Recommended Continuous Coverage Model

Energy and protein should be continuous normalized coverage values internally.

Presentation bands are labels over that continuous truth. They are not competing mechanical states and must not use overlapping validator ranges.

### 10.1 Energy coverage

```text
energy_coverage
  = usable_absorbed_energy_over_window
  / metabolic_demand_over_same_window
```

Recommended candidate presentation bands:

| Exclusive band | Candidate region | Standard posture |
|---|---:|---|
| Deep Deficit | `< 0.80` | strong recovery and sustainable-output pressure; adaptation suppressed when sustained |
| Deficit | `0.80 to < 0.95` | reserve use and mild recovery pressure |
| Balanced | `0.95 to < 1.05` | normal maintenance and recovery support |
| Surplus | `1.05 to < 1.15` | removes energy constraint; modest storage and recovery support |
| Excess | `>= 1.15` | little additional growth value; increasing fat-storage pressure |

Effects should use a continuous curve. The labels are for UI, warnings, AI planning, and coarse rules.

The exact regions remain balance candidates. Their chief value is that they are exclusive, readable, and centered on individual demand.

### 10.2 Protein coverage

```text
protein_coverage
  = absorbed_protein_over_recovery_window
  / context_adjusted_protein_target
```

Recommended candidate presentation bands:

| Exclusive band | Candidate region | Standard posture |
|---|---:|---|
| Deficient | `< 0.60` | strong recovery limitation and lean-loss pressure when sustained |
| Low | `0.60 to < 0.85` | noticeable recovery limitation |
| Adequate | `0.85 to < 1.10` | full maintenance and ordinary recovery support |
| Recovery Supporting | `1.10 to < 1.30` | small capped benefit only when qualifying recovery demand exists |
| Saturated | `>= 1.30` | no further adaptation multiplier; nutrients still retain ordinary food value |

The contextual target already rises with body-size proxy, workload, recovery demand, injury, illness, or life stage where later authorized. The upper band therefore must not be interpreted as a universal grams-per-kilogram claim.

### 10.3 Hysteresis and smoothing

To avoid label flicker and threshold gaming:

- calculate effects continuously from the ratio;
- use rolling weighted windows rather than midnight resets;
- require a small sustained crossing before changing the displayed band;
- use a modest entry/exit margin around each boundary;
- prevent one meal or one action from immediately changing long-term condition;
- preserve the exact underlying ratio even when the UI shows only a band.

Candidate implementation posture:

- Energy uses a shorter rolling window plus the separate accessible reserve.
- Protein uses a longer recovery-oriented window.
- Standard mode shows bands and causal forecasts.
- Detailed mode may show estimated ranges, not mandatory optimization arithmetic.

Exact window lengths and hysteresis margins remain balance decisions.

## 11. Accuracy Versus Simplicity Recommendation

The recommended Standard model uses:

1. exact physical kcal and macro truth internally;
2. time-aware digestion;
3. continuous normalized Energy and Protein coverage;
4. exclusive descriptive bands;
5. one shared recovery-quality factor;
6. one stat-growth owner;
7. one reversible Lean Condition state;
8. one slower structural-atrophy state;
9. no biochemical glycogen, amino-acid, hormone, or organ simulation;
10. no player requirement to calculate grams per kilogram.

This preserves the important causal relationships while keeping player decisions legible:

- eat enough for expected work;
- include sufficient protein for maintenance and recovery;
- use mixed meals when repeated hard work needs faster accessible energy;
- sleep and rest after demanding work;
- avoid prolonged severe deficit;
- resume graded loading when recovering from condition loss.

## 12. Cultural, Economic, And Lineage Posture

No additional broad historical-diet research is required for the physiological integration contract.

Culture, class, occupation, politics, religion, season, geography, war, trade, and wealth may strongly affect:

- which foods are available;
- customary meal composition;
- preservation methods;
- feast and scarcity cycles;
- habitual activity;
- body condition;
- learned preferences and knowledge;
- market price and access.

These influences operate through content, economy, habit, activity, and actual intake. They do not require culture-specific metabolic equations.

Ordinary human cultural or ancestry categories must not receive distinct calorie or protein mechanics by default.

Fantasy lineages may differ only when an explicitly authored physiological trait justifies it, such as materially different body size, thermoregulation, digestive anatomy, magical metabolism, hibernation, or nonhuman tissue requirements. Such differences must be trait-owned and bounded, not inferred from culture or appearance.

Socioeconomic, political, cultural, environmental, and habitual influences are expected to matter more to ordinary dietary outcomes than minor unmodeled population averages.

## 13. Anti-Exploit Requirements

The unified model must prevent:

- receiving separate STR and muscle-adaptation advancement from the same load;
- eating protein to gain Strength without qualifying activity;
- using excessive calories or protein to bypass progression caps;
- farming trivial micro-actions;
- performing unrecoverable work and still receiving full growth;
- crossing a band boundary repeatedly to trigger benefits;
- resetting Energy or Protein Support at midnight;
- restoring Lean Condition or structural loss instantly through one feast;
- deliberately losing condition to exploit retraining beyond the recent stable peak;
- allowing body fat to become direct STR, CON, or VIT progression;
- allowing culture or ordinary ancestry labels to modify metabolism without an authored physiological trait.

## 14. Owner Matrix

| Concern | Authority |
|---|---|
| base attribute values and long-term growth | existing stat-growth owner |
| activity description and domain-specific results | activity owner |
| normalized physical stimulus input | shared activity-to-growth contract |
| kcal expenditure | shared body-state expenditure resolver |
| digestion and nutrient availability | body-state metabolism/nutrition owner |
| Fatigue and Recovery Debt | body-state recovery owner |
| Lean Condition | body-state/body-composition owner |
| structural atrophy | body-state/body-composition owner |
| any base-stat decrement | stat-growth owner after explicit permanence authorization |
| effective attribute calculation | attribute-resolution owner |
| food nutrient truth | static nutrition and meal aggregation owners |
| difficulty thresholds and permanence | difficulty/global-rules owner |
| presentation bands and forecasts | UI projection only |

## 15. Integration Consequences

A later implementation should prefer extending the existing stat-growth input and recovery contracts rather than introducing a parallel muscle-progression schema.

Likely integration work includes:

- adding a normalized physical-stimulus description to time-advancing activity results;
- replacing or extending the existing recovery-quality input with body-state Energy, Protein Support, hydration, rest, fatigue, and health factors;
- retaining existing per-stat thresholds, daily caps, diminishing returns, and bounded RNG;
- adding Lean Condition and structural-atrophy state to body state;
- routing temporary Strength penalties through effective-attribute resolution;
- establishing deterministic daily and long-interval updates;
- migrating legacy game-scale calorie and protein values only through a separate explicit contract;
- adding tests proving that one action cannot double-award physical progression.

This decision does not authorize those changes.

## 16. Remaining Open Decisions

The architecture is sufficiently repaired to proceed to a focused contract or implementation-planning pass. The following still require explicit acceptance or later balance work:

1. Whether direct base-stat loss is entirely disabled or enabled only on a named simulation/story difficulty.
2. The exact effective-attribute composition rule for base STR plus Fatigue, Lean Condition, injury, magic, and equipment.
3. The exact mapping from activity domains into STR, CON, VIT, AGI, and DEX progression load.
4. The exact rolling windows, hysteresis margins, and tuning thresholds for Energy and Protein coverage.
5. The exact smoothed limiting-factor function used for physiological growth and recovery quality.
6. Whether recent stable peak is stored explicitly for bounded retraining or derived from progression history.
7. The exact BMR generator and which body-size, lineage-trait, STR, CON, VIT, age/life-stage, health, and body-composition inputs it accepts.
8. The migration and save-version route from `dailyCalories: 100`, `proteinBaseline: 18`, and the current consumable-profile scales.
9. The milestone and package sequence for implementation.

## 17. Explicit Non-Decisions

This decision does not:

- implement metabolism, digestion, body composition, atrophy, or stat-growth changes;
- accept exact numerical coefficients as canon;
- authorize direct base-stat loss;
- assign a release version;
- change the active culinary repair scope;
- restore held Version 0.6.6;
- require preservation of the temporary research artifact after durable integration is complete.
