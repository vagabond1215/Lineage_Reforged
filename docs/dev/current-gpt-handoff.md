# Current GPT Handoff

## Status

- `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` is complete and validated.
- Original culinary research completed at commit `cd12ee015b11d96d93df05cc2911c7525e1133c2`.
- The first culinary results repair completed at commit `9b73c80e5fc28b3f0951a0d308c0f693ce1493c5`.
- The culinary preparation/portion/meal integration audit completed at commit `a78b10714b5a6e587989d9c52f02f0d66fb9ea6a`.
- The bounded integration-results repair completed at commit `b92b1344613669114641230a2e67f8ed77e7ae00`.
- Deep Research `GPT-DR.nutrition.protein-recovery-muscle-adaptation` completed at commit `462547fa64faa87d5d36cd5bf4d918b6c103002d`.
- Unified physical-attribute integration authority was added at commit `53e39e24cc5ccb26f38272def10d7b7f80cc55b2` and revised at commit `e1255aecb8a89cab5ac9628c2b61e912f00f9d97`.
- The temporary research artifact is evidence support only and may be deleted after its conclusions are durably integrated.
- `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains paused, not canceled, and recoverable from `docs/dev/held-0.6.6-monster-ecology-loot-prompt.md` and blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

## Most Specific Controlling Decision

Read first:

`docs/design/unified-physical-attribute-growth-and-nutrition-band-integration-decision.md`

It controls attribute, growth, structural-loss, current-stat, nutrition-band, and difficulty semantics where older documents overlap.

Additional authorities remain:

1. `docs/design/protein-recovery-muscle-adaptation-and-nutrition-integration-decision.md`;
2. `docs/design/fat-mobilization-body-stat-and-climate-effects-decision.md`;
3. `docs/design/metabolic-energy-stamina-fat-storage-and-atrophy-decision.md`;
4. `docs/design/contextual-action-surfaces-inventory-crafting-and-trade-decision.md`;
5. `docs/design/culinary-ration-serving-preparation-and-container-labeling-decision.md`;
6. `docs/design/artisan-mystery-assortment-stock-and-quality-decision.md`.

## Canonical Attribute Model

### Immutable base

A base attribute is the immutable foundational character value.

Ordinary gameplay never rewrites it. Training, nutrition, Fatigue, Lean Condition, structural atrophy, injury, illness, equipment, magic, climate, and disuse are adjustments around the base.

### Persistent development

The existing stat-growth owner remains authoritative for persistent development of STR, DEX, AGI, CON, VIT, WIS, INT, SPT, and CHA.

It retains:

- per-attribute thresholds;
- daily soft caps;
- diminishing returns;
- recovery gating;
- bounded deterministic variation;
- anti-farming controls;
- progression accumulation.

There is no parallel persistent `muscleAdaptation` currency.

### Persistent structural loss

Structural loss is enabled by default but requires significant sustained neglect, disuse, severe deficit, illness, injury, or an accepted combination.

It is represented as a persistent negative adjustment, not deletion of the base attribute.

Structural loss:

- occurs only after reversible consequences and a configurable prolonged gate;
- accumulates slowly and under strict caps;
- may stop when nutrition, rest, health, and activity normalize;
- does not passively recover;
- must be rebuilt through qualifying activity and the ordinary stat-growth pipeline.

The loss is therefore persistent, but not unrecoverable. The character rebuilds destroyed capacity rather than merely waiting for short-term recovery.

### Current attribute

The current attribute is the gameplay value resolved from all authorized functions:

```text
currentAttribute = resolveAttribute(
  immutableBase,
  developedAdjustment,
  structuralLossAdjustment,
  Fatigue,
  RecoveryDebt,
  Energy,
  hydration,
  LeanCondition,
  injury,
  illness,
  climate,
  burden,
  equipment,
  magic,
  status,
  context
)
```

The exact additive/multiplicative ordering remains a later contract decision.

## Nutrition And Metabolism Direction

- Canonical authored food energy is kilocalories.
- Live `dailyCalories: 100` is compatibility-only.
- Nutrients derive from physical amount consumed and per-basis values.
- Food enters digestion and absorption rather than instantly becoming Energy or Stamina.
- Energy is a continuous metabolic balance distinct from Stamina and long-term reserve.
- Fat is a normal rate-limited reserve.
- Protein supports maintenance, repair, and growth consolidation; it is not an instant buff.
- Nutrition gates stat growth and rebuilding but does not directly award attributes.

```text
food consumed
  -> digestion pool
  -> absorbed kcal and nutrients over time
  -> metabolic balance
       -> basal expenditure
       -> activity expenditure
       -> stamina-restoration support
       -> deficit or surplus
            -> reserve use or storage
            -> fatigue and recovery consequences
            -> prolonged atrophy pressure when severe and sustained
```

## Physical-Loss Distinctions

Keep separate:

1. Stamina depletion;
2. acute Fatigue;
3. Recovery Debt;
4. reversible Lean Condition decline;
5. structural-atrophy pressure;
6. persistent structural-loss adjustment;
7. immutable base attribute;
8. current attribute.

One missed meal, one difficult day, short ordinary rest, or a brief illness cannot cause persistent structural loss.

Restoring food and rest can repair the first four states. Persistent structural loss requires active rebuilding.

## Unified Physical Growth Pipeline

```text
meaningful activity
  -> duration, intensity, load, context
  -> shared body-state resolution
       -> expenditure
       -> stamina use
       -> fatigue and recovery demand
       -> meaningful physical stimulus
  -> stat-growth owner
       -> attribute-relevant load
       -> nutrition/recovery gate
       -> caps and diminishing returns
       -> developed-adjustment or rebuilding progress
```

The same event must not grant independent STR growth and muscle-adaptation growth.

## Difficulty Direction

Nutrition consequences, structural atrophy, and persistent structural loss are enabled by default.

Difficulty/global rules must support:

- nutrition-consequence toggle;
- structural-atrophy toggle;
- persistent structural-loss toggle;
- severity threshold;
- deficit and disuse grace periods;
- illness/injury contribution;
- loss accumulation rate;
- maximum interval loss;
- loss floor;
- rebuilding multiplier;
- percentage or threshold adjustments making Energy and Protein bands more or less forgiving;
- hysteresis and sustained-crossing requirements;
- warning lead time;
- information precision;
- optional bounded retraining assistance.

Preset direction:

- Accessible: enabled, long grace, forgiving bands, very slow loss, strong warning, faster rebuild.
- Standard: enabled, substantial grace, baseline bands, slow loss, ordinary rebuild.
- Simulation: enabled, stricter bands, shorter but meaningful grace, stronger cumulative consequences.
- Custom: each major consequence may be independently disabled.

Difficulty changes consequence thresholds, not physical nutrient truth.

## Standard Candidate Coverage Bands

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

Effects remain continuous. Bands are exclusive presentation and planning labels. Exact thresholds remain balance candidates.

## Cultural And Lineage Direction

Ordinary cultural or ancestry categories do not receive distinct metabolic equations.

Culture, class, occupation, politics, religion, region, season, war, trade, wealth, and habit matter through food access, actual diet, preparation, preservation, activity, and body condition.

Fantasy lineages differ only through explicit physiological traits such as body size, digestive anatomy, thermoregulation, magical metabolism, hibernation, or nonhuman tissue requirements.

## Owner Matrix

| Concern | Owner direction |
|---|---|
| immutable base attributes | character-foundation/attribute authority |
| persistent developed adjustment | stat-growth owner |
| atrophy pressure and tissue state | body-state/body-composition owner |
| persistent structural-loss adjustment | stat-growth owner consuming atrophy pressure |
| current-attribute calculation | attribute-resolution owner |
| duration, intensity, and loading | activity owners |
| shared expenditure | body-state/activity expenditure resolver |
| digestion and nutrient availability | body-state nutrition/metabolism owner |
| Fatigue and Recovery Debt | body-state recovery owner |
| Lean Condition | body-state/body-composition owner |
| food nutrient truth | static nutrition and meal owners |
| difficulty toggles, rates, grace, floors, and band forgiveness | difficulty/global-rules owner |
| presentation | UI only |

## Remaining Contract Work

Later work must decide:

1. exact current-attribute combination order;
2. exact difficulty grace periods, severity thresholds, rates, floors, and warnings;
3. activity-to-attribute load mapping;
4. Energy and Protein rolling windows and hysteresis;
5. physiological growth-gate formula;
6. whether optional bounded retraining assistance exists;
7. BMR generation inputs and coefficients;
8. legacy nutrition and stat-field migration;
9. implementation milestone and package sequence.

These are tuning and implementation-contract questions. The following are no longer open:

- structural loss exists and is enabled by default;
- it requires prolonged significant neglect;
- it never changes the immutable base attribute;
- it changes persistent adjustment state;
- it is rebuilt through active stat growth rather than passive recovery.

## Route Guardrails

- No implementation version is assigned.
- Held `0.6.6` remains paused and byte-recoverable.
- Retained Gate 1-5 and Gate 7 artifacts remain solely assigned to `0.6.7`.
- No item, recipe, ration, body, attribute, activity, training, schema, validator, runtime, command, save, UI, economy, difficulty, or gameplay implementation is authorized by this handoff.
- The next repository run should be a focused documentation and implementation-planning alignment pass unless the user explicitly authorizes implementation.
