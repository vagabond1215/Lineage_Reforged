# Protein Recovery, Muscle Adaptation, And Nutrition Integration Decision

Date: 2026-07-21

Status: accepted documentation-only nutrition, recovery, and body-adaptation authority; no schema, validator, runtime, UI, save, balance, content, test, or gameplay implementation permission

Run classification: unversioned focused protein, recovery, and muscle-adaptation decision

Milestone impact: `supports_current_band`

## 1. Purpose And Precedence

This decision refines the accepted metabolism and body-composition model around protein, recovery from temporary physical loss, reversible short-term atrophy, slow muscle development, and the interaction among diet, activity, rest, and energy availability.

It supplements, and is more specific than where applicable:

- `docs/design/metabolic-energy-stamina-fat-storage-and-atrophy-decision.md`;
- `docs/design/fat-mobilization-body-stat-and-climate-effects-decision.md`;
- `docs/design/culinary-preparation-portion-meal-composition-and-food-knowledge-decision.md`;
- `docs/design/contextual-action-surfaces-inventory-crafting-and-trade-decision.md`;
- existing body-state, attribute, activity, combat, crafting, rest, and difficulty authorities.

This decision records conceptual requirements and research questions. It does not canonize exact protein targets, muscle-gain rates, recovery coefficients, attribute formulas, or implementation paths.

## 2. Accepted High-Level Model

Protein must not behave as an instant Strength consumable or a second calorie meter.

Use a simplified adaptation pipeline:

```text
physical activity or training
  -> stimulus and tissue stress
  -> recovery demand
       + adequate protein availability
       + adequate energy availability
       + hydration and rest
       + elapsed recovery time
  -> repair of temporary loss
  -> restoration of recent reversible atrophy
  -> slow adaptation and muscle development when stimulus repeats
```

Four conditions remain distinct:

1. **training or work stimulus** — a reason for the body to adapt;
2. **protein availability** — material support for repair and lean-tissue maintenance;
3. **energy availability** — enough usable energy to support recovery rather than merely survive the deficit;
4. **recovery opportunity** — sleep, rest, low enough competing stress, and elapsed time.

Muscle gain should normally require all four. High protein without activity does not create meaningful muscle. Activity without sufficient protein, calories, or recovery may maintain, stall, or degrade physical condition rather than improve it.

## 3. Distinct Physical-Loss States

Do not treat every temporary Strength penalty as permanent muscle loss.

### 3.1 Acute exertion fatigue

A short-lived performance reduction caused by recent exertion, low stamina, heat, cold, dehydration, pain, or immediate energy shortage.

Recovery is primarily governed by stamina, rest, hydration, temperature, injury, and available metabolic energy. Protein has little immediate effect on a minute-to-minute basis.

### 3.2 Recovery debt

A longer temporary reduction caused by repeated exertion, insufficient sleep, inadequate nutrition, illness, or incomplete recovery.

Protein adequacy may improve recovery efficiency over hours and days, but cannot bypass rest, hydration, energy, or injury rules.

### 3.3 Reversible short-term lean-condition loss

A modest, recoverable decline in muscle condition or physical output after several days or weeks of underfeeding, disuse, illness, repeated recovery failure, or heavy work without adequate nutrition.

This state may present as temporary or persistent derived penalties to effective Strength, carrying, work efficiency, stamina recovery, or physical resilience. It should be recoverable faster than the original loss developed when the character resumes adequate protein, energy, rest, and progressive activity.

### 3.4 Structural atrophy

Meaningful long-term lean-tissue loss caused by prolonged severe deficit, disuse, illness, injury, inadequate protein, or sustained unsustainable exertion.

Recovery should require deliberate rehabilitation, nutrition, progressive loading, rest, and meaningful elapsed time. Severe atrophy may cause persistent or permanent consequences under accepted difficulty rules.

### 3.5 Base attribute change

Base Strength, Constitution, or Vitality must not be mutated casually by short-term nutrition state. The preferred posture is to use body-condition and adaptation modifiers unless a later explicit attribute contract authorizes permanent base-stat change.

## 4. Protein Intake And Availability

Static nutrition profiles own per-basis protein values. Consumed protein enters the body-state nutrition and recovery pipeline rather than directly modifying attributes.

The future model should distinguish:

- protein consumed;
- protein digested or made available over time;
- current recovery demand;
- maintenance demand;
- tissue-repair demand;
- adaptation opportunity;
- excess protein beyond useful demand.

A bounded simplified protein-availability pool or rolling adequacy window may be used. It should not require amino-acid-level simulation.

Protein quality, digestibility, meal distribution, and source variety may influence results only where research demonstrates a meaningful game-scale distinction. The system should avoid requiring players to manage a laboratory nutrition plan.

## 5. Protein And Energy Must Work Together

Protein adequacy cannot compensate fully for a large caloric deficit.

Accepted direction:

- adequate protein during a mild deficit may help preserve lean tissue and support recovery;
- inadequate protein increases lean-tissue pressure during sustained deficit or heavy activity;
- sufficient calories with inadequate protein may maintain Energy while impairing repair and adaptation;
- high protein with inadequate calories may reduce, but not eliminate, muscle loss;
- muscle development is easier near energy balance or with a modest sustained surplus than during a deep deficit;
- large surpluses should not produce proportionally faster muscle gain and may primarily increase fat storage;
- protein itself contributes calories, but its energy contribution and digestive cost remain part of the metabolism model rather than a separate free resource.

## 6. Recovery From Temporary Strength Loss

Protein should support recovery from reversible nutrition- or exertion-related physical penalties over time.

A candidate recovery relationship is:

```text
recoverable physical loss
  -> determine cause and severity
  -> determine current protein adequacy
  -> determine current energy availability
  -> determine rest, sleep, hydration, injury, illness, and activity load
  -> apply bounded recovery progress over elapsed time
```

Protein is most relevant when the temporary loss includes tissue stress, lean-condition decline, repeated heavy exertion, or recent underfeeding. It should not instantly cure:

- acute stamina depletion;
- dehydration;
- heat or cold injury;
- untreated physical injury;
- disease;
- sleep deprivation;
- magical or toxic effects;
- severe structural atrophy.

Recovery should use diminishing returns. Moving from deficient to adequate protein should matter more than moving from adequate to excessive protein.

## 7. Slow Muscle Development

A consistently active character with sufficient protein, energy, and recovery may slowly increase muscle condition and derived physical capability.

### 7.1 Required stimulus

Muscle adaptation requires repeated meaningful loading or activity. Candidate stimulus sources may include:

- strength training;
- loaded travel;
- climbing;
- rowing;
- heavy farming;
- construction;
- mining;
- smithing or other heavy craft;
- military drill;
- repeated combat exertion;
- other physically demanding work.

Not every action should provide useful training stimulus. The future activity owner should describe duration, intensity, muscle-use or loading posture, and novelty or adaptation relevance where justified.

### 7.2 Adaptation ledger

Use an accumulated, time-aware adaptation ledger rather than direct experience from eating protein.

Candidate conceptual flow:

```text
meaningful physical stimulus
  -> recoverable tissue stress
  -> recovery window
  -> protein + energy + rest gate
  -> bounded adaptation progress
  -> gradual muscle-condition increase
```

Repeated appropriate stimulus followed by recovery can create progress. Repeated overload without recovery can accumulate fatigue, injury risk, or deterioration instead.

### 7.3 Rate limits

Muscle development must be slow and rate-limited.

The future resolver should prevent:

- gaining Strength from one large protein meal;
- stacking many tiny actions to farm adaptation;
- repeating trivial actions indefinitely for muscle gain;
- save/reload rerolls;
- gaining full adaptation without elapsed recovery time;
- simultaneous full muscle gain and unresolved severe fatigue;
- unlimited growth from linear protein intake;
- rapid oscillation between atrophy and muscle gain.

### 7.4 Diminishing returns

The largest gains should occur when a character moves from undertrained or detrained toward a functional conditioned state.

Further gains should become progressively slower as the character approaches limits set by:

- body frame and ancestry where later accepted;
- age or life stage;
- base attributes;
- current muscle condition;
- training quality and novelty;
- recovery capacity;
- injury and illness;
- energy and protein availability;
- difficulty and progression rules.

A high-Strength character should require more demanding and specialized stimulus to improve than an untrained character.

## 8. Strength, Constitution, And Vitality Boundaries

Protein and muscle condition may contribute to derived physical outcomes, but must not silently replace the attribute system.

Preferred direction:

- **Strength** is the primary attribute most directly reflected in muscle output, but body condition modifies effective output rather than automatically rewriting base Strength;
- **Constitution** may influence training tolerance, tissue repair, fatigue resistance, and the ability to sustain a program;
- **Vitality** may influence general recovery, adaptation resilience, illness interaction, and restoration from nutritional stress;
- protein availability modifies repair and adaptation efficiency rather than granting a flat attribute bonus;
- high muscle condition may increase BMR and body mass modestly through later accepted contracts;
- excessive loading or muscle mass may introduce mobility, heat, energy, or recovery costs where later research supports a meaningful abstraction.

The model must distinguish:

- inherited or trained base attribute;
- current effective attribute;
- temporary fatigue penalty;
- reversible body-condition modifier;
- persistent muscle-adaptation modifier;
- injury, illness, climate, and equipment modifiers.

## 9. Disuse, Detraining, And Maintenance

Muscle condition should require a modest maintenance posture rather than remaining permanently maximized without activity.

Accepted direction:

- ordinary active living may maintain a functional baseline;
- highly developed muscle condition requires continued meaningful use;
- short rest periods do not cause immediate loss;
- prolonged inactivity, immobilization, severe illness, or underfeeding may cause detraining;
- adequate protein may slow but not fully prevent disuse-related loss;
- reconditioning previously developed capacity may be faster than first-time development if later research supports a manageable memory abstraction;
- exact detraining and retraining rates remain open.

## 10. Manageable Player-Facing Model

The ordinary player should not need to calculate grams per kilogram or meal-by-meal amino-acid timing.

Candidate presentation may use:

- protein intake or adequacy bands;
- recovery status;
- training stimulus status;
- muscle-condition or conditioning bands;
- warnings such as `Protein-limited recovery`, `Energy-limited recovery`, `Insufficient rest`, or `No meaningful training stimulus`;
- optional exact values on higher-information settings.

Possible descriptive protein states:

- deficient;
- low;
- adequate;
- recovery-supporting;
- excessive or no additional benefit.

Possible adaptation states:

- detraining;
- recovering;
- maintaining;
- adapting;
- overreached;
- plateaued.

These are candidate presentation labels, not implemented values.

## 11. Difficulty And Accessibility

Difficulty may independently tune:

- protein-pressure severity;
- recovery speed;
- atrophy and detraining speed;
- adaptation rate;
- permanent-loss posture;
- information precision;
- tolerance for imperfect meal timing;
- whether detailed protein quality or distribution matters at all.

A standard mode should preserve meaningful protein and activity decisions without requiring constant micromanagement. Easier modes may collapse protein into broad adequacy bands and prevent permanent loss. Harder modes may make sustained deficits, illness, heavy training, and poor recovery more consequential.

## 12. Owner Boundaries

| Concern | Owner direction | Boundary |
| --- | --- | --- |
| Per-basis protein and calories | Static nutrition profiles | Descriptive nutrient truth; no body mutation |
| Consumed nutrient totals | Meal/consumption resolver | Emits intake result from physical amounts |
| Protein digestion/availability | Body-state nutrition/metabolism owner | Time-aware availability and adequacy |
| Training/work stimulus | Activity, combat, travel, crafting, work, and training owners | Describe duration, intensity, loading, and context |
| Recovery demand | Body-state/recovery owner | Tissue stress, fatigue, injury, and recent loss |
| Muscle adaptation | Body-state/body-composition owner | Slow, rate-limited condition change |
| Effective Strength contribution | Body-state plus attribute-resolution contract | Derived modifier; no silent base-stat rewrite |
| Constitution/Vitality influence | Attribute and body-state resolution | Recovery and tolerance inputs with bounded effects |
| Detraining and atrophy | Body-state/body-composition owner | Time-aware loss and restoration |
| Difficulty | Difficulty/global-rules owner | Rates, thresholds, permanence, and information precision |
| Presentation | UI | Displays authoritative state; does not calculate it |

No food item owns muscle gain. No activity domain privately mutates lean tissue. No protein meal directly grants Strength. One body-state adaptation resolver must reconcile intake, energy, stimulus, recovery, and elapsed time.

## 13. Accepted Direction

Accepted:

- protein supports lean-tissue maintenance and recovery;
- protein is important for recovery from reversible short-term lean-condition loss and some temporary physical penalties;
- protein cannot instantly restore stamina or Strength;
- adequate energy, hydration, rest, and time remain required;
- high protein plus repeated meaningful physical activity may support slow muscle development;
- protein without stimulus does not generate meaningful muscle;
- stimulus without recovery can worsen fatigue or injury instead of producing adaptation;
- adaptation and recovery use rate limits and diminishing returns;
- short-term fatigue, reversible condition loss, structural atrophy, and base-attribute change remain distinct;
- the ordinary UI should use manageable adequacy and recovery states rather than mandatory nutritional arithmetic;
- exact formulas require focused research before implementation.

## 14. Open Research And Balance Questions

Still open:

- practical protein-maintenance and recovery ranges across body size and activity;
- whether the game should use grams, grams per kilogram, normalized protein points, or adequacy bands internally;
- digestion and availability windows;
- meaningful source-quality or digestibility distinctions;
- interaction between protein and caloric deficit;
- recovery from short-term lean-condition loss;
- adaptation stimulus thresholds;
- training-load and recovery windows;
- muscle-gain and detraining rate caps;
- diminishing-return curves and body-frame limits;
- relation between muscle condition, effective Strength, BMR, body mass, stamina, heat, and burden;
- age, ancestry, illness, injury, and sex/body-frame abstractions if any are appropriate;
- handling of ordinary work versus deliberate training;
- retraining or muscle-memory abstraction;
- anti-exploit aggregation of repeated micro-actions;
- difficulty settings and player-facing precision.

## 15. Deep Research Requirement

Before an implementation-ready body-state, protein, recovery, or muscle-adaptation contract is proposed, run:

`GPT-DR.nutrition.protein-recovery-muscle-adaptation`

using:

`docs/dev/queued-protein-recovery-muscle-adaptation-deep-research-prompt.md`

The research must compare real-world physiology with manageable game abstractions, distinguish high-confidence evidence from contested or population-specific findings, and recommend what to retain, simplify, abstract, or reject.

## 16. Non-Goals

- no medical advice or exact physiological claim encoded as game canon;
- no protein target, supplement recommendation, meal timing rule, or muscle-gain coefficient;
- no schema, validator, test, runtime, save, UI, content, balance, or gameplay implementation;
- no live Strength, Constitution, Vitality, BMR, fat, stamina, atrophy, recovery, or difficulty change;
- no item, recipe, ration, activity, training, combat, or profession content;
- no version assignment;
- no restoration of held `0.6.6`.

## 17. Next Consumers

Immediate consumers:

1. the active unversioned culinary final-repair audit, which should record the conceptual owner and open-decision direction without inventing values;
2. the queued GPT Deep Research prompt named above;
3. a later unversioned research-integration decision before any implementation package.
