# Queued GPT Deep Research Prompt

## Run Identity

`GPT-DR.nutrition.protein-recovery-muscle-adaptation`

Preferred mode: **Ultra** when available; otherwise **Extra High**

Run classification: unversioned external research and game-model translation

Milestone impact: `supports_current_band`

Parent version: none

Required output artifact:

`docs/dev/tmp-protein-recovery-muscle-adaptation-research-YYYY-MM-DD.md`

Suggested research-output commit:

`docs(research): analyze protein recovery and muscle adaptation`

## Purpose

Research how real-world caloric intake, protein intake, digestion, activity, recovery, lean-tissue loss, fat use, and muscle adaptation can inform a meaningful but manageable game system for Lineage: Reforged.

The research must compare two models explicitly:

1. **real-world physiology and nutrition evidence** — what current high-quality research supports, where findings are population-specific, and where uncertainty remains;
2. **game abstraction** — what should be retained, simplified, combined, made optional, or rejected to create understandable decisions without turning play into dietary accounting.

Do not merely summarize sports-nutrition recommendations. Produce an integration framework suitable for a systemic survival-builder RPG in which characters travel, work, fight, craft, rest, eat, gain or lose body condition, and persist across long periods.

## Repository Context

Before external research, inspect and ground the work in:

- `AGENTS.md`;
- `README.md`;
- `docs/design/protein-recovery-muscle-adaptation-and-nutrition-integration-decision.md`;
- `docs/design/metabolic-energy-stamina-fat-storage-and-atrophy-decision.md`;
- `docs/design/fat-mobilization-body-stat-and-climate-effects-decision.md`;
- `docs/design/culinary-ration-serving-preparation-and-container-labeling-decision.md`;
- `docs/design/culinary-preparation-portion-meal-composition-and-food-knowledge-decision.md`;
- `docs/design/contextual-action-surfaces-inventory-crafting-and-trade-decision.md`;
- `docs/design/activity-resolution-depth-and-attempt-state-contract-plan.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/historical-version-and-deferred-route-register.md`.

Repository authority controls game ownership and terminology. External research may correct factual assumptions, expose missing distinctions, and recommend abstractions, but must not silently override accepted repository boundaries.

## Controlling Game Direction

Preserve these accepted directions unless evidence proves a narrow factual correction is required:

- canonical nutritional energy is expressed in kilocalories;
- food enters a digestion and absorption pipeline rather than instantly becoming Energy or Stamina;
- Energy is a zero-centered short-term metabolic balance, distinct from Stamina and total body-fat reserve;
- each character later has an individual BMR with a candidate generated base around `1,800-2,000 kcal/day`, minor bounded physical-stat effects, and broader daily expenditure driven by activity;
- ordinary active daily expenditure may use about `2,500 kcal/day` as a user-authored game-design anchor;
- sustained high-intensity labor or loaded military activity may approach `3,500-4,000 kcal/day` as a user-authored game-design anchor;
- every meaningful time-advancing activity provides duration and intensity context to one shared metabolic-expenditure resolver;
- mild deficits draw on rate-limited fat reserve before severe starvation;
- fat does not become instant Stamina and cannot cover unlimited burst demand;
- fat contributes to Constitution/Vitality-adjacent resilience and climate response only through diminishing-return tradeoffs;
- protein supports lean-tissue maintenance, recovery, and slow adaptation;
- protein alone does not grant Strength or create muscle without meaningful activity and recovery;
- short-term fatigue, recovery debt, reversible lean-condition loss, structural atrophy, and base-attribute change remain distinct;
- muscle development is slow, rate-limited, and exploit-resistant;
- ordinary players should not be forced to perform grams-per-kilogram calculations.

## Central Research Question

What is the smallest coherent set of nutritional, metabolic, recovery, and adaptation rules that preserves meaningful real-world relationships among calories, protein, activity, sleep, fat reserve, fatigue, lean tissue, and muscle development while remaining understandable, balanceable, and computationally manageable in a game?

## Required Research Domains

### 1. Energy availability and recovery

Research:

- the relationship among energy intake, energy expenditure, recovery, fatigue, and training adaptation;
- the distinction between acute energy shortage, chronic low energy availability, starvation, and ordinary mild deficit;
- how energy deficit changes muscle-protein synthesis, recovery, performance, and lean-mass retention;
- when a modest surplus materially assists muscle gain and when additional surplus mainly increases fat;
- whether energy availability is more useful than simple daily calorie balance for game abstraction;
- practical timescales: minutes, hours, days, weeks, and months.

Translate findings into a manageable game posture without requiring endocrine or organ-level simulation.

### 2. Protein maintenance and recovery

Research:

- protein requirements for maintenance across ordinary adults, active adults, heavy labor, resistance training, endurance work, caloric deficit, illness, injury, and older populations;
- the strongest evidence for absolute grams, grams per kilogram, lean-mass normalization, and activity-adjusted needs;
- how much benefit occurs when moving from deficient to adequate intake;
- where diminishing returns begin;
- how protein interacts with total calories;
- the role of protein in preserving lean tissue during mild and severe deficits;
- whether short-term low intake meaningfully affects performance or primarily affects recovery over longer periods;
- appropriate recovery timescales.

Do not turn supplement-industry marketing ranges into universal physiological truth.

### 3. Protein timing, distribution, quality, and digestibility

Research whether the following distinctions are important enough to model:

- total daily protein versus distribution across meals;
- per-meal thresholds or saturation effects;
- post-activity timing;
- animal, plant, mixed, and processed protein sources;
- digestibility and amino-acid quality;
- preparation and food safety;
- age, illness, and activity effects;
- fasting and long gaps between meals.

For each distinction, classify it as:

- essential to retain;
- useful as a coarse modifier;
- optional high-difficulty depth;
- too complex or low-value for the game;
- unsupported or contested.

### 4. Temporary strength loss and reversible lean-condition decline

Research distinctions among:

- acute fatigue;
- reduced voluntary force after exertion;
- glycogen or substrate depletion where relevant to gameplay;
- sleep-deprivation effects;
- dehydration and heat effects;
- short-term disuse or detraining;
- illness-related weakness;
- true lean-tissue loss;
- neural and skill-related detraining;
- structural atrophy.

Determine which states can reasonably recover over:

- minutes to hours;
- one to several days;
- one to several weeks;
- months.

Explain where protein materially helps and where it does not. The game must not use protein as an instant cure for Stamina loss, dehydration, heat illness, injury, or sleep deprivation.

### 5. Muscle development and adaptation

Research:

- the role of resistance or loading stimulus;
- progressive overload and adaptation;
- differences between deliberate training and occupational physical work;
- expected muscle-gain rates for untrained, trained, detrained, and highly trained people;
- the influence of energy balance and protein intake;
- recovery and sleep requirements;
- age, body size, sex, genetics, and training history as evidence, while avoiding unnecessary demographic simulation;
- plateaus and diminishing returns;
- detraining and retraining or muscle-memory effects;
- the difference between muscle size, strength, work capacity, endurance, coordination, and skill.

Recommend how much of this should affect:

- effective Strength;
- carrying and sustained work;
- Stamina maximum or recovery;
- BMR;
- body mass and burden;
- heat stress;
- injury risk;
- appearance;
- long-term progression.

### 6. Protein excess and tradeoffs

Research:

- whether excess protein above useful intake provides meaningful additional recovery or muscle gain;
- thermic effect and energy contribution;
- satiety effects;
- displacement of other nutrients;
- hydration considerations without overstating common myths;
- relevant health risks only to the extent they support a game abstraction;
- whether excess should be represented as calories, waste, digestive burden, or simply diminishing returns.

Avoid creating a punitive medical simulator. The goal is to prevent a dominant `eat maximum protein` strategy.

### 7. Carbohydrate and fat interactions

Because the game should not falsely imply that protein alone determines performance, research the minimum distinctions needed for:

- high-intensity versus sustained activity;
- Stamina recovery;
- caloric density;
- digestion speed;
- fat mobilization during mild deficit;
- protein sparing;
- satiety;
- heat production from digestion;
- recovery from repeated heavy work.

Determine whether carbohydrate availability or a coarse fast-energy concept is necessary, optional, or safely abstracted into the digestion/Energy/Stamina model.

Do not require biochemical glycogen, insulin, ketone, or blood-glucose simulation unless evidence proves a simpler proxy is misleading.

### 8. Fat reserve, body composition, and climate

Integrate the existing accepted direction with evidence on:

- fat use during mild deficits;
- practical rate limits on fat-derived energy availability;
- preservation of lean tissue;
- body-fat and cold tolerance;
- body-fat and heat burden;
- hydration and thermoregulation;
- muscle mass and heat generation;
- body mass, mobility, and carrying costs;
- whether body composition should influence Constitution, Vitality, or derived checks rather than base attributes.

Recommend game abstractions, not exact medical body-fat categories.

### 9. Sleep, rest, illness, injury, and age

Research how recovery and adaptation depend on:

- sleep duration and quality;
- rest between demanding sessions;
- illness and inflammation;
- injury and immobilization;
- age or life stage;
- repeated daily heavy labor;
- underfeeding;
- rehabilitation.

Recommend which variables deserve direct mechanics, coarse modifiers, or omission.

### 10. Historical and premodern applicability

The game is grounded medieval fantasy rather than a modern gym simulation.

Research:

- protein availability and common dietary patterns in premodern subsistence, agricultural, pastoral, fishing, military, urban artisan, elite, and famine contexts;
- realistic dietary variability without assuming one universal medieval diet;
- labor intensity and seasonal cycles;
- the role of legumes, grains, dairy, eggs, fish, meat, nuts, and mixed dishes;
- feast-and-scarcity patterns;
- practical recovery under hard labor and imperfect nutrition;
- where modern sports-nutrition studies can be used only as physiological analogues rather than historical evidence.

Do not infer that historical people tracked macros or optimized meal timing.

## Required Game-Translation Framework

For every major real-world finding, classify its game disposition:

- `retain_directly` — essential relationship that can be modeled clearly;
- `retain_as_band` — important but better represented through broad states;
- `retain_as_modifier` — useful contextual influence rather than a primary meter;
- `difficulty_optional` — suitable only for higher-complexity modes;
- `presentation_only` — useful explanation or UI feedback without separate state;
- `merge_with_existing_state` — represented through Energy, Stamina, Fatigue, body condition, or another accepted owner;
- `reject_as_low_value_complexity` — true but not worth modeling;
- `reject_as_unsupported_or_contested` — insufficient evidence for game authority.

Each disposition must explain the gameplay value, complexity cost, exploit risk, and owner boundary.

## Required Complexity Tiers

Produce three coherent candidate abstractions.

### Tier A — Accessible

A low-micromanagement model using broad protein, energy, recovery, and body-condition bands. Permanent loss should be rare or disabled.

### Tier B — Standard

The recommended default model. It should create meaningful food, activity, recovery, and body-condition choices while avoiding constant arithmetic.

### Tier C — Simulation

A higher-information model that may expose more exact intake, deficits, recovery windows, or body-condition data without becoming a medical simulator.

For each tier, specify:

- state variables;
- update cadence;
- player-visible information;
- difficulty knobs;
- expected decisions;
- failure consequences;
- anti-exploit safeguards;
- computational and content burden.

Recommend one tier as the default and explain why.

## Required Candidate Game Model

The artifact must propose a bounded candidate model covering at minimum:

1. calorie intake and digestion;
2. protein intake and availability;
3. BMR and activity expenditure;
4. zero-centered Energy balance;
5. Stamina use and recovery;
6. short-term accessible energy reserve;
7. mild-deficit fat mobilization and rate limits;
8. temporary fatigue and effective-Strength loss;
9. reversible short-term lean-condition decline;
10. structural atrophy;
11. recovery from recent loss;
12. activity/training stimulus;
13. slow muscle adaptation;
14. detraining and retraining;
15. Constitution/Vitality interaction;
16. climate and body-composition effects;
17. difficulty and accessibility.

The model must distinguish authoritative internal state from player-facing presentation.

## Required Formula And Band Recommendations

Provide candidate formulas, bands, or normalized relationships only where evidence supports them.

For every proposed number or curve:

- cite the evidence;
- identify the studied population;
- state whether it is a physiological estimate, modern training recommendation, historical analogue, or game-design translation;
- provide a confidence level;
- provide a plausible game-safe range rather than false precision;
- identify which values should remain configurable;
- identify exploit risks;
- do not present a candidate value as implemented or accepted canon.

Prioritize simple relationships such as:

- deficient / low / adequate / recovery-supporting / no-additional-benefit protein bands;
- maintenance / mild deficit / deep deficit / recovery surplus energy states;
- acute fatigue / recovery debt / reversible condition loss / structural atrophy;
- no stimulus / maintenance stimulus / adaptation stimulus / excessive stress;
- detraining / maintaining / adapting / plateaued / overreached.

Evaluate whether exact grams should exist internally while broad bands are shown to the player.

## Required Scenario Tests

Test every recommended abstraction against at least these scenarios:

1. active character eating enough calories but chronically low protein;
2. active character eating high protein but too few total calories;
3. sedentary character eating high protein and surplus calories;
4. heavily active character with adequate protein and a mild deficit;
5. heavily active character with adequate calories and inadequate rest;
6. character recovering from several days of underfeeding and temporary Strength loss;
7. character recovering from prolonged structural atrophy;
8. character performing repeated heavy labor with an adequate mixed diet;
9. character attempting to farm muscle with many trivial micro-actions;
10. character eating one huge protein meal before combat;
11. character in cold weather with moderate fat reserve;
12. character in humid heat with high fat and muscle mass;
13. older or injured character undergoing rehabilitation;
14. player switching between starvation and feasting to exploit recovery;
15. character maintaining high muscle condition during prolonged inactivity.

For each scenario, explain expected state changes, player feedback, and exploit safeguards.

## Required Owner Matrix

Map each concern to one proposed authority and reject duplicates:

- static food nutrients;
- meal aggregation;
- digestion and nutrient availability;
- Energy balance;
- Stamina;
- body fat;
- lean condition and muscle adaptation;
- training stimulus;
- activity expenditure;
- fatigue and recovery;
- effective attributes;
- climate response;
- difficulty;
- UI presentation;
- save persistence.

No food item may own muscle gain. No activity domain may privately mutate lean tissue. No weather domain may own body composition. No UI may calculate physiology.

## Source Standard

Prefer:

- systematic reviews and meta-analyses;
- peer-reviewed consensus statements and position stands;
- national or international public-health and nutrition authorities;
- university and government physiology resources;
- peer-reviewed exercise physiology, sports nutrition, rehabilitation, gerontology, occupational physiology, military nutrition, and clinical nutrition literature;
- high-quality historical diet and labor scholarship for premodern context;
- primary research only where reviews are unavailable or a narrow question requires it.

Use modern athlete research cautiously. State when evidence comes from resistance-trained adults, endurance athletes, military personnel, older adults, hospitalized patients, injured people, or another non-general population.

Avoid:

- supplement-company marketing;
- fitness influencers;
- unsourced health blogs;
- bodybuilding anecdotes;
- game wikis;
- AI-generated pages;
- single studies presented as universal truth;
- exact recommendations detached from population and context.

## Evidence Grading

For each major finding, record:

- source;
- source type;
- population;
- intervention or exposure;
- outcome;
- magnitude and uncertainty where available;
- confidence: `high`, `moderate`, `low`, or `insufficient`;
- applicability to the game;
- whether the finding supports a mechanic, modifier, presentation note, or rejection.

Clearly separate:

- established physiological relationship;
- population-specific estimate;
- contested interpretation;
- historical evidence;
- modern analogue;
- game-design inference.

## Required Artifact Structure

The research artifact must contain:

1. executive conclusion;
2. repository baseline and accepted constraints;
3. source methodology and evidence grading;
4. real-world energy and protein model;
5. temporary loss, recovery, and atrophy distinctions;
6. muscle adaptation and detraining evidence;
7. calories, protein, carbohydrate, fat, sleep, and activity interactions;
8. body composition and climate integration;
9. premodern diet and labor applicability;
10. direct real-world-to-game translation table;
11. Tier A, Tier B, and Tier C candidate abstractions;
12. recommended default game model;
13. candidate state variables and update cadence;
14. candidate formulas, bands, and configurable ranges;
15. player-facing UI and feedback recommendations;
16. anti-exploit requirements;
17. scenario-test results;
18. owner and dependency matrix;
19. rejected complexity and reasons;
20. unresolved decisions;
21. complete bibliography.

## Required Executive Answers

The opening conclusion must answer plainly:

- How should protein influence short-term recovery?
- How should protein influence reversal of recent lean-condition loss?
- How should structural atrophy recovery differ?
- What conditions should be required for muscle gain?
- How should high protein without activity behave?
- How should activity without enough calories or protein behave?
- How quickly may meaningful muscle condition change?
- Should exact protein grams exist internally, visibly, both, or neither?
- What is the recommended standard-difficulty abstraction?
- Which real-world mechanisms should deliberately not be modeled?

## Guardrails

- Do not implement anything.
- Do not edit content, schemas, validators, tests, runtime, UI, saves, dependencies, or gameplay.
- Do not assign a `0.6.x` version.
- Do not modify the active Codex prompt, the held `0.6.6` prompt, or retained `0.6.7` artifacts.
- Create only the required temporary research artifact.
- Do not turn modern sport-specific recommendations into universal rules.
- Do not provide medical advice.
- Do not canonize exact protein or muscle-gain values without later integration and acceptance.
- Do not conflate temporary fatigue, glycogen/substrate limitation, reversible lean-condition loss, structural atrophy, and base-attribute loss.
- Do not make protein an instant Strength or Stamina consumable.
- Do not permit passive muscle gain from diet alone.
- Do not permit unlimited growth from repetitive trivial actions.

## Completion Criteria

The gate is complete only when the artifact:

- uses high-quality cited sources;
- distinguishes source populations and uncertainty;
- compares real-world and game models explicitly;
- proposes a manageable recommended default;
- preserves accepted repository owner boundaries;
- addresses protein recovery and slow muscle development;
- integrates energy, fat, Stamina, climate, sleep, and activity;
- includes exploit-resistant scenario tests;
- labels all formulas and values as evidence, candidate translation, or open decision;
- leaves implementation unauthorized.

After completion, stop for GPT/human inspection. Do not install a Codex implementation prompt or promote the research directly into durable contracts without a separate integration decision.
