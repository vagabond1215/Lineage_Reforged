# Current Codex Prompt

## Run Identity

`Physical Attribute Current-State, Structural-Loss, And Difficulty Contract Planning Audit`

Run classification: unversioned documentation-only repository audit and implementation-contract planning

Milestone impact: `supports_current_band`

Parent version: none

Suggested commit:

`docs(body): audit current attributes and structural loss contracts`

## Purpose

Inspect the live repository and produce the smallest implementation-ready contract plan for:

- immutable base attributes;
- persistent developed adjustments;
- persistent structural-loss adjustments;
- one current-attribute resolver consuming every authorized adjustment;
- default-enabled nutrition, atrophy, and structural-loss consequences;
- difficulty toggles, grace periods, rates, floors, warnings, and band forgiveness;
- migration from any live fields that currently conflate base, current, effective, growth, fatigue, or nutrition state.

Do not implement runtime, schemas, saves, validators, UI, balance values, content, commands, or gameplay.

## Most Specific Authority

Read first and treat as controlling where older documents overlap:

`docs/design/unified-physical-attribute-growth-and-nutrition-band-integration-decision.md`

Also read:

- `docs/design/protein-recovery-muscle-adaptation-and-nutrition-integration-decision.md`;
- `docs/design/fat-mobilization-body-stat-and-climate-effects-decision.md`;
- `docs/design/metabolic-energy-stamina-fat-storage-and-atrophy-decision.md`;
- `docs/design/activity-resolution-depth-and-attempt-state-contract-plan.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/historical-version-and-deferred-route-register.md`;
- `AGENTS.md`;
- `README.md`.

The temporary Deep Research artifact is evidence support only. Do not repair its bibliography, cite it as player-facing authority, or make its preservation a prerequisite.

## Accepted Invariants

1. A base attribute is immutable.
2. Ordinary gameplay never rewrites base STR, DEX, AGI, CON, VIT, WIS, INT, SPT, or CHA.
3. The existing stat-growth owner remains authoritative for persistent developed adjustments.
4. Structural atrophy may create persistent negative adjustments through that same owner.
5. Persistent structural loss is enabled by default, but begins only after substantial configurable severity and duration gates.
6. Persistent structural loss is not passive-recovery state.
7. Lost structural capacity is rebuilt through qualifying activity, nutrition, recovery, and the ordinary stat-growth pipeline.
8. No parallel `muscleAdaptation` progression currency exists.
9. The current attribute is the gameplay value resolved from all authorized persistent, reversible, external, magical, equipment, health, climate, burden, and contextual adjustments.
10. Nutrition and body state supply gates and pressure; they do not directly award attributes.
11. Difficulty changes consequence thresholds and forgiveness, not physical nutrient truth.
12. One missed meal, one difficult day, short ordinary rest, or brief illness cannot create persistent structural loss.

## Execution Gate

1. Read the authorities above.
2. Run `git status`, fetch, and fast-forward pull. Record branch, starting commit, and clean/dirty state.
3. Confirm this is the active prompt.
4. Confirm the held `Version 0.6.6` prompt still resolves to blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
5. Preserve unrelated work.
6. Stop without editing if live repository fact materially contradicts the controlling decision; report the smallest coordination repair required.

## Audit 1: Live Attribute Representation

Inspect all live definitions and uses of:

- base stats;
- current stats;
- effective stats;
- attribute growth state;
- daily growth caps;
- recovery-quality inputs;
- stat penalties and bonuses;
- equipment, magic, status, injury, illness, Fatigue, Stamina, climate, and burden modifiers;
- serialization and save fields;
- UI projections and derived-value consumers.

At minimum inspect likely owners including:

- `packages/engines/player-engine/src/stat-growth.ts` and generated/runtime counterparts;
- `packages/engines/player-engine/src/body-state.ts` and generated/runtime counterparts;
- `packages/shared/types/src/contracts.ts`;
- global rules and schemas;
- save/load and migration paths;
- representative combat, travel, work, crafting, inventory, and character-sheet consumers.

Record exact repository facts. Do not infer that a field named `base` is actually immutable or that a field named `current` already consumes every modifier.

## Audit 2: Target Attribute Contract

Produce an implementation-ready target contract equivalent to:

```text
currentAttribute = resolveAttribute(
  immutableBase,
  developedAdjustment,
  structuralLossAdjustment,
  staminaAdjustment,
  fatigueAdjustment,
  recoveryDebtAdjustment,
  energyAdjustment,
  hydrationAdjustment,
  leanConditionAdjustment,
  injuryAdjustment,
  illnessAdjustment,
  climateAdjustment,
  burdenAdjustment,
  equipmentAdjustment,
  magicAdjustment,
  statusAdjustment,
  contextualAdjustment
)
```

Do not assume every term is additive. Identify:

- canonical ordering;
- additive versus multiplicative categories;
- caps and floors;
- rounding boundaries;
- whether an intrinsic-current value should be resolved before equipment and magic;
- which value each gameplay domain should consume;
- how explanations and UI breakdowns preserve causal clarity.

Recommend the smallest coherent contract, but leave exact coefficients open.

## Audit 3: Persistent Development And Structural Loss

Define how the existing stat-growth owner can support both positive development and persistent structural loss without changing immutable base attributes.

The preferred direction is one persistent adjustment ledger or a clearly coordinated pair of persistent adjustment fields, not two independent progression systems.

Record:

- how positive progress accumulates;
- how atrophy pressure is submitted;
- where negative progress or structural loss is rate-limited;
- floors and maximum interval loss;
- how structural loss differs from Fatigue and Lean Condition;
- how rebuilding uses ordinary qualifying stat growth;
- how passive recovery is prevented from erasing structural loss;
- how double rewards and loss/regain farming are prevented;
- whether any optional bounded retraining assistance needs separate state.

Default rebuilding is ordinary growth from the reduced current capacity. Do not assume automatic muscle-memory acceleration.

## Audit 4: Difficulty Contract

Inventory existing difficulty/global-rule support and propose the smallest schema direction for:

- `nutritionConsequencesEnabled`;
- `structuralAtrophyEnabled`;
- `persistentStructuralLossEnabled`;
- deficit severity threshold;
- deficit grace period;
- disuse grace period;
- illness and injury contribution;
- structural-loss accumulation rate;
- maximum loss per update and longer interval;
- persistent-loss floor;
- rebuilding rate multiplier;
- Energy-band forgiveness percentage or threshold offset;
- Protein-band forgiveness percentage or threshold offset;
- hysteresis and sustained-crossing requirements;
- warning lead time;
- player information precision;
- optional retraining assistance.

Preset direction:

- Accessible: enabled, long grace, forgiving bands, very slow loss, strong warnings, faster rebuilding.
- Standard: enabled, substantial grace, baseline bands, slow capped loss, ordinary rebuilding.
- Simulation: enabled, stricter bands, shorter but meaningful grace, stronger cumulative effects.
- Custom: major consequences independently toggleable.

Do not choose exact numeric values unless an existing accepted rule already provides them.

## Audit 5: Nutrition Coverage And Band Application

Preserve exact physical truth:

```text
rawCoverage = absorbedAmount / individualDemand
adjustedCoverage = applyDifficultyForgiveness(rawCoverage, difficultyRules)
```

Determine the cleanest owner boundary for applying difficulty forgiveness while preserving raw values for saves, simulation, debugging, and detailed UI.

Preserve mutually exclusive Standard candidate bands:

Energy:

- Deep Deficit: `< 0.80`
- Deficit: `0.80 to < 0.95`
- Balanced: `0.95 to < 1.05`
- Surplus: `1.05 to < 1.15`
- Excess: `>= 1.15`

Protein:

- Deficient: `< 0.60`
- Low: `0.60 to < 0.85`
- Adequate: `0.85 to < 1.10`
- Recovery Supporting: `1.10 to < 1.30`
- Saturated: `>= 1.30`

Treat these as balance candidates, not implementation authorization.

## Audit 6: Migration And Compatibility

Identify migration requirements for:

- existing base/current/effective attribute fields;
- existing stat-growth accumulation;
- existing body-state effective-Strength penalties;
- legacy `dailyCalories: 100`;
- legacy `proteinBaseline: 18`;
- existing consumable-profile scales;
- saves created before developed and structural-loss adjustments exist;
- deterministic replay and seeded growth behavior;
- generated JavaScript or built artifacts that mirror TypeScript sources.

Recommend defaults for old saves that preserve player capability and avoid accidental loss on load.

## Audit 7: Test Matrix

Specify representative tests proving:

- base attributes never mutate;
- current attributes recompute from all authorized adjustments;
- positive development changes persistent adjustment only;
- prolonged severe neglect can eventually create structural loss when enabled;
- short deficits cannot create structural loss;
- toggles disable only their intended consequences;
- forgiving difficulty shifts consequences without altering nutrient truth;
- nutrition restoration repairs reversible states but not structural loss;
- qualifying rebuilding restores current Strength without changing base Strength;
- trivial actions cannot farm growth or rebuilding;
- one event cannot double-award STR and muscle adaptation;
- save/load preserves persistent adjustments and deterministic behavior;
- old saves receive safe migration defaults.

## Required Output

Modify only:

- `docs/dev/current-codex-output.md`;
- one new temporary audit artifact under `docs/dev/` named for this run and date.

The temporary artifact should contain:

1. live repository inventory;
2. contradiction table;
3. proposed field and owner contracts;
4. difficulty control inventory;
5. migration map;
6. test matrix;
7. exact remaining user decisions;
8. recommended package sequence;
9. explicit non-decisions.

Do not modify the controlling decision, handoff, held prompt, route register, runtime, schema, tests, saves, or UI in this run.

## Stop Conditions

Stop after producing the documentation audit and current output.

Do not:

- implement the system;
- assign a version;
- modify held `0.6.6`;
- move retained `0.6.7` artifacts;
- delete the research artifact;
- install a follow-on implementation prompt;
- invent exact balance coefficients.

Report anything requiring user input separately from matters that can be delegated to implementation balancing.
