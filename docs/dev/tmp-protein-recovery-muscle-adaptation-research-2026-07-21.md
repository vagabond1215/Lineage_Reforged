# Protein Recovery, Muscle Adaptation, And Nutrition Integration Research

Run: `GPT-DR.nutrition.protein-recovery-muscle-adaptation`  
Date: 2026-07-21  
Run class: unversioned external research and game-model translation  
Milestone impact: `supports_current_band`  
Status: research candidate for GPT/human inspection; no implementation is authorized

## 1. Executive Conclusion

The smallest coherent model is a shared body-state resolver that receives physical food intake, time, activity demand, climate, sleep/rest, illness, and injury context. It should keep exact kilocalories and protein grams internally, release nutrients through digestion, and translate them into broad player-facing Energy, Protein Support, Recovery, Fatigue, and Body Condition bands. Protein is a limiting support factor, not a buff. Activity is a stimulus, not direct muscle gain. Meaningful adaptation occurs only when stimulus, energy, protein, and recovery coincide over repeated days and weeks.

Plain answers to the required questions:

| Question | Research answer |
|---|---|
| How should protein influence short-term recovery? | As a bounded recovery-quality modifier over roughly one to several days after meaningful exertion, tissue stress, illness, or injury. Moving from deficient to adequate matters most. It must not restore Stamina immediately, erase soreness, cure dehydration, or replace sleep. Evidence for faster restoration of force after resistance exercise is modest and inconsistent, while evidence for an instant effect is absent. |
| How should protein influence reversal of recent lean-condition loss? | Adequate available protein should increase the rate and completeness of recovery only when energy and rest are also adequate and the character resumes tolerable loading. Recent reversible decline may improve across several well-fed, well-rested days to several weeks. |
| How should structural atrophy recovery differ? | Structural atrophy requires progressive reloading or rehabilitation plus sustained nutrition and recovery over weeks to months. Food alone cannot reverse it. Restoration should be slower than clearing Fatigue and should not directly rewrite base attributes. |
| What conditions should be required for muscle gain? | Repeated meaningful loading above maintenance, adequate energy availability, at least adequate protein availability, and adequate recovery. Gains must be rate-limited by current condition, training history, injury/illness, and adaptation headroom. Excess food or trivial actions cannot substitute for stimulus. |
| How should high protein without activity behave? | Protein contributes ordinary dietary energy, satiety, and maintenance support, then reaches diminishing recovery/adaptation benefit. Without meaningful loading it does not create muscle or Strength. Persistent calorie surplus may increase fat reserve regardless of protein source. |
| How should activity without enough calories or protein behave? | The action may still occur if Stamina and context permit, but Fatigue and Recovery Debt rise, recovery worsens, adaptation is suppressed, and prolonged deficit can reduce reversible Lean Condition. Severe or extended stress plus disuse/illness can later create Structural Atrophy pressure. |
| How quickly may meaningful muscle condition change? | Acute performance changes occur in minutes to days; reversible condition changes in days to weeks; meaningful positive muscle adaptation and structural restoration in weeks to months. No ordinary meal, action, or single day should visibly create structural muscle. |
| Should exact protein grams exist internally, visibly, both, or neither? | Internally: yes, because future per-basis food nutrition and partial consumption require additive physical truth. Standard UI: no mandatory gram arithmetic; show qualitative bands and meal contribution. Optional detailed/simulation UI may expose grams and estimates. |
| What is the recommended standard-difficulty abstraction? | Tier B: exact internal kcal/macros, time-aware digestion, rolling Energy and Protein Support bands, Fatigue/Recovery Debt, reversible Lean Condition, slow Muscle Adaptation, and delayed Structural Atrophy, with descriptive forecasts and configurable forgiveness. |
| Which real-world mechanisms should deliberately not be modeled? | Amino-acid-by-amino-acid metabolism, anabolic windows, per-meal leucine thresholds, endocrine signaling, nitrogen balance, blood glucose, insulin, ketones, biochemical glycogen stores, organ pathology, exact thermic-effect accounting, microscopic muscle groups, and medical body-fat categories. |

The strongest relevant evidence is conditional rather than absolute. Resistance training is the necessary stimulus; extra protein produces small additional lean-mass benefit mainly when paired with resistance exercise, and a meta-regression found no further average fat-free-mass benefit beyond an estimated breakpoint near `1.62 g/kg/day` in healthy resistance-training adults ([Morton et al., 2018](https://pubmed.ncbi.nlm.nih.gov/28698222/)). Across broader trials, protein above the RDA protected lean mass during energy restriction and supported gains during resistance training but offered no meaningful lean-mass advantage in otherwise unstressed conditions ([Hudson et al., 2020](https://pubmed.ncbi.nlm.nih.gov/31794597/)). Energy deficit independently impairs lean-mass response to resistance training; one meta-regression predicted that a deficit around `500 kcal/day` prevented average lean-mass gain, but that is a modern-study estimate, not a proposed game threshold ([Murphy and Koehler, 2022](https://pubmed.ncbi.nlm.nih.gov/34623696/)).

The recommended model therefore represents opportunity and constraints, not bodybuilding arithmetic:

```text
physical food amount -> digestion -> absorbed kcal and protein
time + activity + climate -> expenditure, Stamina use, stimulus, and fatigue
rolling energy + protein + rest + health -> recovery quality
meaningful stimulus + recovery quality + adaptation headroom
    -> slow lean-condition restoration or muscle adaptation
prolonged disuse / severe deficit / illness / injury
    -> delayed structural-atrophy pressure
```

## 2. Repository Baseline And Accepted Constraints

### 2.1 Live implementation baseline

The repository already has a game-scale body-state implementation, not the intended physical nutrition model:

| Live concern | Current repository posture | Research implication |
|---|---|---|
| Food nutrition | Nine consumable profiles carry game-scale `calories`, `protein`, `carbohydrate`, `fat`, and `hydration`. | Do not reinterpret those values as physical grams or kcal. A future migration must be explicit. |
| Daily energy | `global_rules.json` currently uses `dailyCalories: 100`. | This is legacy game-scale authority, not the future kcal target. |
| Protein target | Current rules use `proteinBaseline: 18` plus high-intensity load scaling. | Preserve behavior until a separate contract/migration replaces it; do not treat 18 as grams. |
| Body state | The player engine tracks consumed values, Energy bands/reserves, hydration, Fatigue, Fatigue Debt, starvation load, and protein-deficit load. | Several useful concepts exist, but their semantics and units are not the future model. |
| Immediate effects | Current derived effects include Stamina maximum/regen, recovery multipliers, and effective-strength penalties. | Future work should preserve owner separation while removing any implication that a meal instantly becomes Stamina or Strength. |
| Long-term composition | No authoritative digestion queue, physical fat reserve, Lean Condition, structural atrophy, or muscle-adaptation state exists. | These remain research candidates only. |

Relevant live files:

- `packages/engines/player-engine/src/body-state.ts`
- `packages/content/base/game/global_rules.json`
- `packages/content/base/items/consumable_profiles.json`
- `packages/schemas/items/consumable-profile.schema.json`
- `packages/shared/types/src/contracts.ts`

### 2.2 Accepted design constraints

Repository authority requires all of the following:

- Canonical food energy is expressed in kilocalories and is calculated from physical consumed amount and per-basis nutrition.
- Ingredient allocation percentages are composition controls, not calorie points.
- Food enters digestion and absorption rather than instantly becoming Energy or Stamina.
- Energy is zero-centered short-term metabolic balance, distinct from immediate Stamina and long-term fat reserve.
- The candidate individual BMR base of roughly `1,800-2,000 kcal/day`, the ordinary active anchor around `2,500 kcal/day`, and the heavy-labor anchor around `3,500-4,000 kcal/day` are user-authored design anchors, not findings established by this review.
- Each time-advancing activity supplies duration and intensity to one shared expenditure resolver.
- Mild deficit first draws on a bounded short-term reserve and rate-limited fat availability; fat cannot provide unlimited burst output or instant Stamina.
- Temporary Fatigue, Recovery Debt, reversible Lean Condition, Structural Atrophy, and base-attribute loss remain separate.
- Static food nutrition, meal aggregation, digestion, activity expenditure, recovery, body composition, attributes, climate, difficulty, UI, and saves remain separate owners.
- Ordinary players must not calculate grams per kilogram.

### 2.3 Precedence and route

This artifact fulfills the queued evidence gate named by `docs/design/protein-recovery-muscle-adaptation-and-nutrition-integration-decision.md`. It does not supersede the accepted culinary, metabolism, fat-mobilization, climate, contextual-action, or activity-resolution decisions. Where research suggests a candidate numerical band, that band remains configurable and noncanonical until a separate integration decision accepts it.

The active culinary final-repair files were already modified before this run and were left untouched. `Version 0.6.6` remains held, `0.6.7` remains reserved, and no implementation route is advanced here.

## 3. Source Methodology And Evidence Grading

### 3.1 Method

The review prioritized systematic reviews, meta-analyses, consensus statements, government occupational guidance, national reference material, and academic historical syntheses. Modern sports evidence is used as a physiological analogue, not as evidence that medieval people optimized macros or training. Estimates from athletes, healthy young adults, older adults, hospitalized people, and immobilization studies are explicitly population-limited.

Confidence labels mean:

- `high`: consistent review/consensus evidence for the direction of effect;
- `moderate`: credible evidence with meaningful population, measurement, or heterogeneity limits;
- `low`: narrow population, small samples, indirect endpoints, or inconsistent findings;
- `insufficient`: no stable basis for an authoritative mechanic or numerical rule.

### 3.2 Evidence ledger

| Finding | Source type and population | Exposure / outcome / magnitude | Confidence | Game applicability and disposition |
|---|---|---|---|---|
| Resistance/loading is the principal muscle-growth stimulus; protein adds a small benefit. | Meta-analysis, 49 studies and 1,863 healthy adults doing resistance training. | Supplementation improved fat-free mass and strength modestly; modeled protein breakpoint `1.62 g/kg/day`, 95% CI `1.03-2.20`. | High for direction; moderate for exact breakpoint. | Require stimulus; use protein adequacy with diminishing returns. `retain_directly` and `retain_as_band`. ([Morton 2018](https://pubmed.ncbi.nlm.nih.gov/28698222/)) |
| Extra protein helps lean mass mainly under resistance exercise or energy restriction, not unstressed maintenance. | Systematic review/meta-analysis of controlled feeding/supplementation trials in adults. | Protein above RDA improved lean-mass retention in energy restriction and gain with resistance training; not in nonstressed conditions. | Moderate to high. | Protein is contextual support, never passive muscle gain. `retain_directly`. ([Hudson 2020](https://pubmed.ncbi.nlm.nih.gov/31794597/)) |
| Increasing protein has small average lean-mass effects and context-specific thresholds. | Meta-analysis of 74 RCTs in healthy non-obese adults, most with resistance exercise. | Lean-mass SMD `0.22`; age- and training-stratified benefits at different intake ranges. | Moderate. | Use activity/life-stage target modifiers, not one universal requirement. `retain_as_modifier`. ([Nunes 2022](https://pubmed.ncbi.nlm.nih.gov/35187864/)) |
| Energy deficit impairs lean-mass response to resistance training. | Meta-analysis/meta-regression of resistance-training interventions. | Deficit impaired lean-mass gain; modeled `~500 kcal/day` deficit predicted no average gain, while strength effects differed. | Moderate; exact number is study-model dependent. | Deep/continued deficit suppresses adaptation before directly deleting Strength. `retain_as_band`. ([Murphy 2022](https://pubmed.ncbi.nlm.nih.gov/34623696/)) |
| Low energy availability is a severity-and-duration continuum, not a one-day switch. | IOC consensus reviewing athlete evidence. | Prolonged/severe problematic low availability affects multiple systems; thresholds and individual response vary. | High for continuum; low for universal numeric cutoffs. | Use rolling deficit severity/duration; reject endocrine simulation. `retain_as_band`. ([IOC REDs 2023](https://bjsm.bmj.com/content/57/17/1073)) |
| A surplus may help hypertrophy, but its exact optimal size is not established. | Narrative evidence review of energy surplus and hypertrophy. | Physiological rationale exists; controlled evidence does not define one reliable sweet spot. | Low to moderate. | A small surplus can remove a constraint; larger surplus mainly raises storage pressure. No muscle conversion ratio. `retain_as_band`. ([Slater 2019](https://pubmed.ncbi.nlm.nih.gov/31482093/)) |
| Protein timing has little evidence of independent long-term benefit when total intake is controlled. | Meta-analysis of 65 studies, 2,907 participants. | No significant benefit from a specific timing strategy for lean mass or strength. | Moderate. | Do not model an anabolic window. `reject_as_low_value_complexity`. ([Wirth 2020](https://pubmed.ncbi.nlm.nih.gov/32232404/)) |
| Meal distribution evidence is limited and inconsistent. | Systematic reviews in adults. | Insufficient evidence for a robust strength or muscle outcome from even distribution. | Low. | At most a simulation-mode prolonged-fasting modifier; no per-meal threshold. `difficulty_optional`. ([Schoenfeld 2021](https://pubmed.ncbi.nlm.nih.gov/33550490/); [Hudson 2020](https://pubmed.ncbi.nlm.nih.gov/32429355/)) |
| Protein can modestly support force recovery after damaging resistance exercise but does not reliably reduce soreness. | Meta-analysis, resistance-exercise trials in mostly healthy adults. | Some MVC preservation at `24-96 h`; no soreness effect; methodological conflict. | Low to moderate. | Small recovery-quality modifier over days, capped. `retain_as_modifier`. ([Pearson 2023](https://pubmed.ncbi.nlm.nih.gov/36513777/)) |
| Carbohydrate matters most for rapid replenishment after depletion and repeated high-volume work. | Meta-analysis of exercise glycogen restoration and systematic review of strength performance. | Carbohydrate improves glycogen restoration within `<=8 h`; strength benefit is most likely when fasted, depleted, or doing high volume. | Moderate, athlete-specific. | Coarse fast-energy/repeated-work support; no glycogen meter. `merge_with_existing_state`. ([Craven 2021](https://pubmed.ncbi.nlm.nih.gov/33507402/); [Henselmans 2022](https://pubmed.ncbi.nlm.nih.gov/35215506/)) |
| Acute sleep loss reduces physical performance, but effects are heterogeneous. | Meta-analyses of exercise studies. | Average performance decline around `7.6%` in one review, with large variation by task and protocol. | Moderate. | Sleep quality directly affects recovery and Fatigue; protein cannot cancel it. `retain_as_modifier`. ([Lopes 2022](https://pubmed.ncbi.nlm.nih.gov/35708888/); [Endurance review](https://pubmed.ncbi.nlm.nih.gov/36472094/)) |
| Disuse decreases strength faster and often more than measured muscle size. | Systematic reviews/meta-analyses of bed rest, immobilization, and unilateral disuse. | Detectable losses can begin within days; strength decline exceeds size decline, and lower-limb effects are prominent. | Moderate to high for ordering; low for one universal rate. | Separate Fatigue/coordination/condition from Structural Atrophy; include a grace period. `retain_directly`. ([Campbell 2023](https://pubmed.ncbi.nlm.nih.gov/36883219/); [Berg 2021](https://pubmed.ncbi.nlm.nih.gov/33703945/)) |
| Muscle protein synthesis drops under disuse. | Meta-analysis of adult bed-rest and immobilization models. | Significant reductions across disuse models; substantial heterogeneity. | Moderate. | Adequate food alone cannot equal loading; maintenance stimulus matters. `retain_directly`. ([Disuse MPS review 2025](https://pubmed.ncbi.nlm.nih.gov/41166041/)) |
| Resistance training produces muscle gain across multiweek interventions, but no stable per-day universal rate exists. | Meta-analysis of 111 studies, 1,927 healthy adult men. | Mean whole-body muscle increase about `1.53 kg` across interventions longer than two weeks; protocols and durations varied. | Moderate for slow change; insufficient for a universal rate. | Update adaptation over weeks; use normalized condition, headroom, and caps rather than kg/day. `retain_as_band`. ([Benito 2020](https://pubmed.ncbi.nlm.nih.gov/32079265/)) |
| Heat burden combines metabolic heat, environment, clothing, workload, hydration, and acclimatization. | NIOSH occupational guidance. | Acclimatization generally develops across `7-14 days`; rest, hydration, workload, and clothing are core controls. | High for direction; occupational context. | Environment owns exposure; body state resolves response. Body composition is secondary. `retain_as_modifier`. ([NIOSH overview](https://www.cdc.gov/niosh/heat-stress/about/); [acclimatization](https://www.cdc.gov/niosh/heat-stress/recommendations/acclimatization.html)) |
| Higher body fat may affect heat response, but fitness and body size confound the association. | Systematic review of thermoregulation. | Evidence does not justify a simple linear fat-to-heat penalty. | Low to moderate. | Bounded nonlinear body-composition modifier only. `retain_as_modifier`. ([Alele 2021](https://pubmed.ncbi.nlm.nih.gov/34175202/)) |
| Premodern diets varied by region, status, institution, season, and access. | Academic archaeological/historical syntheses. | Grains/legumes, dairy, fish, meat, and other foods varied materially across groups and places. | Moderate for variability; low for exact intake reconstruction. | Support diverse regional diets and scarcity patterns; never assign one medieval macro template. `presentation_only` plus content guidance. ([Food in Medieval England](https://academic.oup.com/book/47620); [Cambridge isotope study](https://www.cambridge.org/core/journals/antiquity/article/detecting-social-differences-in-diet-in-medieval-towns-isotopic-evidence-from-cambridge-england-c-ad-9401538/41CEEE983BA1D973752C0031B8663922)) |

### 3.3 Evidence limits that constrain design

- Most muscle-gain and protein-threshold studies involve modern adults with structured resistance exercise, reliable food access, and short interventions. They do not establish exact responses for medieval laborers, injured adventurers, fantasy lineages, or multi-year play.
- Lean body mass measurements include water and other nonmuscle components. They cannot be translated directly into a visible muscle-stat increment.
- Study averages hide large individual variation. Sex, age, training history, body size, health, and measurement method matter, but simulating each separately would add little gameplay value.
- Clinical and immobilization evidence identifies direction and timescale, not a safe universal atrophy coefficient.
- Historical sources establish diet diversity and social patterning more reliably than daily protein grams.

## 4. Real-World Energy And Protein Model

### 4.1 Energy is a budget across timescales

Real physiology does not use one interchangeable energy pool. Recently absorbed substrates support ongoing metabolism; stored carbohydrate and fat contribute on different timescales; immediate exercise output depends on local and systemic processes; and chronic energy shortage changes recovery and tissue maintenance. The game does not need those biochemical compartments, but it does need the distinction among:

1. food consumed but not yet absorbed;
2. short-term absorbed/accessible energy;
3. zero-centered rolling Energy balance;
4. immediate Stamina;
5. long-term fat reserve;
6. chronic deficit consequences.

The IOC consensus treats low energy availability as a continuum whose severity and duration matter, while also warning that athlete thresholds are not universal ([IOC 2023](https://bjsm.bmj.com/content/57/17/1073)). The correct game translation is not an endocrine or organ system. It is a rolling energy-coverage state in which one short deficit mostly affects accessible energy and Fatigue, while repeated or deep deficits impair recovery and eventually body condition.

### 4.2 Protein has several roles but one useful game function

Dietary protein supplies amino acids for tissue turnover. For game purposes, its useful roles can be collapsed into one `protein availability` factor that supports:

- routine lean-tissue maintenance;
- recovery after meaningful physical stress;
- preservation during energy deficit;
- restoration after recent reversible condition loss;
- slow adaptation when meaningful loading and adequate recovery are present.

The adult RDA is a population reference for healthy maintenance, not an athletic optimum and not a deficiency cliff. The National Academies/USDA DRI system emphasizes that individual needs vary ([USDA DRI calculator](https://www.nal.usda.gov/human-nutrition-and-food-safety/dri-calculator); [NIH DRI definitions](https://ods.od.nih.gov/HealthInformation/nutrientrecommendations/)). Modern sport guidance commonly places active people above basic maintenance, but the strongest game-relevant finding is the shape of the curve: large value from correcting low intake, smaller value beyond adequacy, and little additional hypertrophy benefit beyond the high end of the studied useful range ([Morton 2018](https://pubmed.ncbi.nlm.nih.gov/28698222/)).

### 4.3 Energy and protein constrain each other

- Adequate calories plus chronically low protein can preserve short-term Energy while weakening recovery and lean maintenance.
- Adequate protein plus too few calories does not eliminate energy deficit. Protein may help preserve lean mass, but severe or sustained shortage still suppresses adaptation and raises loss risk.
- A modest surplus may make adaptation easier, but current evidence does not justify converting a fixed surplus into muscle. Excess is increasingly stored as fat ([Slater 2019](https://pubmed.ncbi.nlm.nih.gov/31482093/)).
- Protein eaten above useful availability remains food energy and may affect satiety and thermogenesis, but it should not accumulate as a separate permanent protein reserve.

### 4.4 Absolute grams versus body-size normalization

Per-kilogram evidence is useful for internal target generation because a large adult usually needs more total protein than a small adult. It is unsuitable as required player arithmetic. A future internal resolver can generate a context-adjusted target from a bounded `metabolic body-size factor`, activity/recovery demand, life-stage modifier, and health modifier. The UI can show `Deficient`, `Low`, `Adequate`, `Recovery Supporting`, or `No Added Benefit`.

This research does not accept a universal exact target. Evidence anchors for later tuning are:

- approximately `0.8 g/kg/day` as the adult healthy-maintenance RDA context, not a cliff ([National Academies DRI source data](https://nap.nationalacademies.org/resource/26818/supplemental-appendixes/Appendix-T-IOM-Data-Extracted-from-2002_2005-DRI-Report.pdf));
- roughly `1.2-1.6 g/kg/day` as a common active/recovery evidence region in modern guidance and reviews;
- around `1.6 g/kg/day` as the central modeled breakpoint for additional lean-mass benefit during resistance training, with a wide `1.03-2.20` confidence interval ([Morton 2018](https://pubmed.ncbi.nlm.nih.gov/28698222/));
- higher clinical, older-adult, energy-restriction, or athlete recommendations are population-specific and should inform a modifier or cap, not standard universal play.

## 5. Temporary Loss, Recovery, And Atrophy Distinctions

The body model needs separate state because the same visible symptom - "I feel weaker" - can arise from very different causes.

| Layer | Cause examples | Expected timescale | Protein relevance | Recommended game state |
|---|---|---|---|---|
| Stamina depletion | Recent exertion or combat | Seconds to hours | None immediately | Existing Stamina owner |
| Acute Fatigue | Hard exertion, heat, dehydration, inadequate rest | Minutes to one or several days | Small indirect recovery support only | Fatigue |
| Substrate/accessible-energy limitation | Long work bout, missed meals, repeated high-volume effort | Hours to days | Protein is not the primary fix | Accessible Energy band merged with Energy/Stamina recovery |
| Recovery Debt | Repeated work with insufficient rest, energy, hydration, or protein | One to several days | Adequacy improves recovery quality; excess cannot erase debt | Persistent Recovery Debt |
| Reversible Lean Condition decline | Several days/weeks of underfeeding, illness, disuse, or overwork | Days to weeks; recovery over days/weeks | Material when energy, rest, and reloading also improve | Lean Condition |
| Structural Atrophy | Prolonged disuse, immobilization, severe shortage, chronic illness | Weeks to months | Necessary support but insufficient without loading/rehab | Structural Atrophy or structural condition |
| Base-attribute loss | Only extreme prolonged accepted conditions | Months or longer | No direct restoration | Separate later attribute contract |

Bed-rest and disuse reviews show that force can decline faster than measured size and that early loss can begin within days ([Berg 2021](https://pubmed.ncbi.nlm.nih.gov/33703945/); [Campbell 2023](https://pubmed.ncbi.nlm.nih.gov/36883219/)). The game should therefore apply early penalties through Fatigue, Recovery Debt, coordination/condition, or effective-attribute resolution rather than declaring immediate structural muscle destruction.

### 5.1 Recovery ordering

Expected recovery order after ordinary underfeeding or overwork:

1. food and sleep improve digestion, accessible energy, and Stamina recovery;
2. Fatigue clears;
3. Recovery Debt declines across additional good rest periods;
4. reversible Lean Condition improves with adequate nutrition and resumed tolerable activity;
5. Structural Atrophy recovers only through sustained rehabilitation/adaptation;
6. any lasting base-attribute effect uses a separate explicitly accepted rule.

Protein can assist steps 3-5. It cannot skip steps 1-2 or substitute for rehabilitation.

## 6. Muscle Adaptation And Detraining Evidence

### 6.1 Conditions for adaptation

Resistance/loading stimulus is the necessary signal. Protein supplementation produces a small additional effect when training is present, while protein alone does not reliably increase lean mass in unstressed adults ([Hudson 2020](https://pubmed.ncbi.nlm.nih.gov/31794597/); [Nunes 2022](https://pubmed.ncbi.nlm.nih.gov/35187864/)). The game should require four gates:

1. `meaningful stimulus`: loading or work above the character's current maintenance threshold;
2. `energy availability`: no unresolved deep deficit across the recovery window;
3. `protein availability`: at least adequate relative to current maintenance/recovery demand;
4. `recovery`: sufficient rest/sleep and no overwhelming illness, injury, heat, or Fatigue.

The gates multiply or cap one another. They are not additive currencies. Eating twice the protein cannot replace missing stimulus, and doing twice the work cannot replace sleep.

### 6.2 Occupational work versus deliberate training

Heavy farming, mining, construction, rowing, climbing, marching under load, military drill, and repeated combat can provide maintenance or adaptation stimulus when they meaningfully load the character. They differ from deliberate progressive training because:

- work may repeat the same submaximal pattern;
- task skill and efficiency can lower physiological stimulus over time;
- long duration raises fatigue and energy demand;
- recovery may be constrained by daily necessity;
- excessive volume can become overreach rather than growth.

The resolver should therefore judge stimulus relative to current capacity, load, duration, movement/work domain, and recent exposure. It should not privilege a menu labeled `Train`; nor should every movement count.

### 6.3 Rate and plateau

A meta-analysis in healthy adult men found an average whole-body muscle gain near `1.53 kg` across resistance-training interventions longer than two weeks, but variation in duration, measurement, and training makes that unsuitable as a universal weekly rate ([Benito 2020](https://pubmed.ncbi.nlm.nih.gov/32079265/)). The safe game translation is:

- no structural change from one meal, one action, or one day;
- early untrained/retraining progress is faster than advanced progress;
- positive change is evaluated over rolling weeks;
- adaptation headroom shrinks as condition approaches the character's current potential;
- excessive stress increases Fatigue/injury pressure and can reduce net adaptation;
- visible appearance and derived physical capacity move only after accumulated thresholds.

### 6.4 Detraining and retraining

Disuse evidence supports a delayed, progressive decline, not instant decay. Strength/function can change sooner than structure, so the model should use:

- a maintenance-stimulus grace window;
- early `detraining` presentation without immediate Structural Atrophy;
- later Lean Condition decline;
- Structural Atrophy only after longer or more severe disuse/illness/deficit;
- faster reacquisition of recently lost condition as a bounded `retraining familiarity` modifier, not a separate molecular simulation.

Exact muscle-memory rates remain insufficient for canon. The gameplay value is that recent loss can be restored faster than building beyond a previous stable condition, while never instantly snapping back.

### 6.5 What adaptation may affect

| Consumer | Recommended relationship |
|---|---|
| Effective Strength | Small derived contribution from current Lean Condition and muscle adaptation; never a meal buff and never silent base-Strength mutation. |
| Carrying / sustained work | Bounded improvement in load tolerance and work efficiency, with body mass and energy costs. |
| Stamina | At most small changes to maximum or recovery efficiency; skill/endurance may need a separate owner. |
| BMR | Later body-composition contract may add a modest bounded contribution. |
| Body mass / burden | Slowly reflect material composition change; extra mass also has movement and heat costs. |
| Heat stress | Greater work and body mass can raise metabolic heat; clothing, climate, acclimatization, hydration, and workload dominate. |
| Injury risk | Excess stress plus poor recovery may raise risk through the injury owner; adaptation itself is not immunity. |
| Appearance | Descriptive thresholds, not continuous body-builder sliders by default. |
| Long-term progression | Condition and adaptation are persistent history, but base attributes remain separately governed. |

## 7. Calories, Protein, Carbohydrate, Fat, Sleep, And Activity Interactions

### 7.1 Minimal retained relationships

| Factor | Essential game role | Deliberate simplification |
|---|---|---|
| Calories | Feed digestion, Energy balance, fat storage/use, and recovery constraints. | No metabolic organ simulation. |
| Protein | Maintenance/recovery/adaptation adequacy. | No amino-acid ledger or supplement mechanics. |
| Carbohydrate | Faster accessible-energy support and value in repeated high-volume/high-intensity work. | Merge glycogen/blood glucose into digestion and accessible energy. |
| Dietary fat | Dense slower energy, satiety context, and eventual storage contribution. | No fatty-acid classes unless a later food-quality system proves value. |
| Sleep/rest | Clear Fatigue and Recovery Debt; gate adaptation. | Use quality/duration bands rather than sleep-stage simulation. |
| Activity | Spend Stamina, incur expenditure, create context-scaled fatigue and possible stimulus. | Activity owners report context; they never mutate body composition. |
| Hydration | Modify Stamina recovery, fatigue, and climate tolerance. | Remains separate from protein; ordinary high-protein intake is not an automatic dehydration penalty. |

Carbohydrate replenishes glycogen faster in short recovery windows after depletion, but adding protein to already adequate carbohydrate did not add glycogen benefit in a meta-analysis ([Craven 2021](https://pubmed.ncbi.nlm.nih.gov/33507402/)). A strength-training review found carbohydrate effects mainly in fasted, depleted, or high-volume contexts ([Henselmans 2022](https://pubmed.ncbi.nlm.nih.gov/35215506/)). That supports an accessible-energy modifier for repeated work, not a biochemical glycogen meter.

### 7.2 Sleep and recovery

Sleep loss has a moderate but heterogeneous negative performance effect in modern studies ([Lopes 2022](https://pubmed.ncbi.nlm.nih.gov/35708888/)). One small controlled study found one night of total deprivation reduced post-meal muscle-protein synthesis, but its sample of 13 people is too narrow for a dedicated molecular rule ([Saner 2020](https://pubmed.ncbi.nlm.nih.gov/33400856/)). Retain the robust relationship: poor sleep raises Fatigue, slows Recovery Debt clearance, and caps adaptation. Do not allow extra protein to offset it.

### 7.3 Protein excess

Protein above the useful range should:

- still contribute dietary energy under the static nutrition truth;
- produce no additional Muscle Adaptation factor after the cap;
- have modest satiety and thermic-effect implications only if the general digestion/satiety owner needs them;
- risk displacing faster energy or dietary variety through ordinary inventory and meal composition, not a punitive disease system;
- not create an automatic dehydration penalty in a normally hydrated healthy character.

Protein has a higher thermic effect than carbohydrate or fat, but exact diet-induced thermogenesis varies and is small relative to the desired gameplay loop ([Halton and Hu 2004](https://pubmed.ncbi.nlm.nih.gov/15466943/); [2024 meta-analysis](https://pubmed.ncbi.nlm.nih.gov/39486625/)). Satiety evidence is heterogeneous ([Kohanmoo 2020](https://pubmed.ncbi.nlm.nih.gov/32648023/)). Default Tier B should merge both into general meal satiety/digestion rather than adding `protein waste` or digestive damage.

## 8. Body Composition And Climate Integration

### 8.1 Fat mobilization

The repository's accepted direction is compatible with the evidence at the abstraction level:

- mild deficit may draw from fat reserve;
- fat-derived support is rate-limited and cannot cover unlimited burst demand;
- severe demand above absorbed energy, accessible reserve, and mobilization capacity reduces Stamina recovery and raises Fatigue;
- adequate protein may improve lean preservation but does not make deep deficit harmless;
- prolonged or severe shortage can eventually increase Lean Condition and Structural Atrophy pressure.

This review does not identify a defensible universal `kcal/hour from fat` value for gameplay. Mobilization should be a configurable curve based on available fat reserve, deficit severity, duration, recent intake, health, and activity intensity. It should be resolved by body state, not by individual activities.

### 8.2 Cold

Subcutaneous fat can provide insulation, particularly in cold-water physiology, but clothing, shelter, dryness, wind protection, activity, and acclimatization usually dominate practical land exposure. Shivering raises energy demand, and cold acclimation biology is too complex and sparsely quantified for a detailed default mechanic ([National Academies environmental physiology](https://nap.nationalacademies.org/read/2031/chapter/15); [shivering review](https://pubmed.ncbi.nlm.nih.gov/28944268/); [brown-fat review](https://pubmed.ncbi.nlm.nih.gov/38540150/)).

Recommended translation: moderate fat reserve supplies a small diminishing cold-resilience modifier, never immunity. Low accessible energy, wet clothing, wind, exhaustion, or poor shelter can overwhelm it.

### 8.3 Heat

NIOSH frames heat strain as the combination of environmental heat, metabolic heat, clothing, and work demand, with hydration, rest, and acclimatization as core controls ([NIOSH](https://www.cdc.gov/niosh/heat-stress/about/)). Body-fat associations are confounded by fitness and body size ([Alele 2021](https://pubmed.ncbi.nlm.nih.gov/34175202/)).

Recommended translation: high total body mass, high fat, and high muscle/work output can add bounded heat burden, but weather, humidity, clothing/armor, pace, shade, hydration, and acclimatization remain stronger. No linear `fat percentage = heat damage` formula is justified.

### 8.4 Attributes

Fat reserve and Lean Condition should influence Constitution/Vitality-adjacent derived checks, recovery capacity, burden, and climate response through bounded nonlinear modifiers. They should not silently mutate base Constitution or Vitality. Base attributes may affect tolerance and recovery slightly, but cannot generate energy or protein.

## 9. Premodern Diet And Labor Applicability

### 9.1 What the evidence supports

There was no single medieval diet. Agricultural systems, wealth, religious rules, urban access, coast/rivers, pastoralism, trade, season, harvest success, war, and institutional provision all changed food availability. Academic syntheses for England document important roles for crops, meat, dairy, and fish, while isotope evidence from medieval Cambridge shows social differences in diet ([Food in Medieval England](https://academic.oup.com/book/47620); [Cambridge isotope study](https://www.cambridge.org/core/journals/antiquity/article/detecting-social-differences-in-diet-in-medieval-towns-isotopic-evidence-from-cambridge-england-c-ad-9401538/41CEEE983BA1D973752C0031B8663922)).

Game-relevant patterns:

- grain and legume dishes can provide substantial calories and meaningful protein in combination;
- dairy, eggs, fish, and meat provide regionally and socially variable protein sources;
- nuts and mixed dishes add energy and variety where available;
- preserved fish/meat, cheese, dried legumes, and grains support travel and winter logistics;
- seasonal heavy labor can raise demand at the same time food access varies;
- elite abundance, monastic/institutional rules, military issue, urban markets, subsistence households, fishing communities, and famine conditions should not share one ration template;
- feast-and-scarcity cycles matter more to play than precise historical macro tracking.

English Heritage's reconstructed noble household shows the diversity and labor of elite provisioning, while monastic scholarship shows that institutional rules and practice changed over time ([Goodrich household](https://www.english-heritage.org.uk/medievalhousehold); [monastic diet](https://academic.oup.com/book/2769/chapter-abstract/143269067)). These are content references, not universal intake evidence.

### 9.2 Modern evidence as analogue only

Modern athlete studies can establish that loading, energy, protein, and recovery interact. They cannot establish that premodern workers followed modern exercise programs, ate standardized protein targets, or had predictable muscle-gain rates. The game should use physiological relationships internally while presenting food through portions, meals, availability, culture, condition, and character knowledge.

## 10. Direct Real-World-To-Game Translation Table

| Real-world finding | Disposition | Gameplay value | Complexity cost | Exploit risk and safeguard | Owner boundary |
|---|---|---|---|---|---|
| Energy intake minus ongoing expenditure changes recovery and storage over time. | `retain_directly` | Makes rations, labor, travel, and rest meaningful. | Moderate. | Feast/starve cycling; use digestion, rolling balance, and rate limits. | Body-state metabolism. |
| Severity and duration distinguish mild deficit from chronic underfueling. | `retain_as_band` | Prevents one missed meal from causing atrophy. | Low. | Threshold hovering; use rolling weighted exposure and hysteresis. | Body-state metabolism/recovery. |
| Protein supports maintenance, repair, and adaptation. | `retain_directly` | Makes diet composition matter without direct buffs. | Low to moderate. | Maximum-protein dominance; cap benefits after adequacy. | Digestion plus recovery/adaptation resolver. |
| Body size and activity affect protein need. | `retain_as_modifier` | Large/high-demand characters need more food plausibly. | Moderate. | Min-maxing tiny bodies; bound modifiers and keep character identity owner-controlled. | Metabolism profile and difficulty. |
| Daily total matters more than exact timing for long-term outcomes. | `retain_directly` | Supports flexible meals and premodern play. | Low. | One giant meal exploit; digestion capacity/time prevents instant availability. | Meal aggregation and digestion. |
| Even meal distribution may modestly affect acute synthesis. | `difficulty_optional` | Adds depth for simulation players. | High UI burden. | Meal-clock optimization; use only a coarse long-fasting penalty if ever enabled. | Difficulty plus digestion. |
| Narrow anabolic window. | `reject_as_unsupported_or_contested` | Little durable decision value. | High. | Encourages repetitive meal timing. | None. |
| Protein quality/digestibility differs among foods. | `retain_as_modifier` | Supports preparation and diverse food profiles. | Moderate content burden. | One best animal food; use coarse digestibility/preparation and mixed-diet convergence. | Static nutrition/preparation, consumed by digestion. |
| Individual amino acids and leucine thresholds. | `reject_as_low_value_complexity` | Minimal improvement over protein adequacy. | Very high. | Supplement farming. | None. |
| Carbohydrate supports rapid recovery after depletion. | `merge_with_existing_state` | Makes mixed meals and repeated hard work sensible. | Low if folded into accessible energy. | Sugar spam; digestion, satiety, and capacity caps. | Digestion and Energy/Stamina recovery. |
| Biochemical glycogen, glucose, insulin, ketones. | `reject_as_low_value_complexity` | Little added decision value over accessible energy. | Very high. | Micromanagement and medical edge cases. | None. |
| Dietary fat is dense energy and stored surplus contributes to reserve. | `retain_directly` | Supports logistics and body-condition tradeoffs. | Moderate. | Pure-fat optimum; satiety, digestion, variety, protein, and rapid-energy needs. | Static nutrition, digestion, body composition. |
| Protein has higher thermic effect. | `presentation_only` | Explains slight meal differences if needed. | Exact accounting is noisy. | Protein as calorie-burning exploit; no separate default multiplier. | General digestion presentation. |
| Protein often increases satiety. | `retain_as_modifier` | Supports hearty meal identity. | Evidence heterogeneous. | Protein becomes universal best food; cap within general satiety. | Meal/satiety owner. |
| Sleep loss reduces performance and recovery. | `retain_as_modifier` | Connects rest to work and adaptation. | Low. | Nap spam; use duration, quality, circadian/rest rules from rest owner. | Rest reports; body recovery resolves. |
| Strength can decline faster than structural size during disuse. | `retain_directly` | Justifies reversible condition before atrophy. | Moderate. | Intentional inactivity cycling; grace plus progressive detraining. | Body condition/effective attributes. |
| Disuse lowers muscle protein synthesis. | `retain_as_band` | Protein alone cannot preserve peak muscle indefinitely. | Low. | Passive protein maintenance exploit; require maintenance stimulus. | Body adaptation. |
| Retraining may restore recent loss faster than novel gain. | `retain_as_modifier` | Rewards rehabilitation and persistent history. | Moderate save state. | Bank-and-regain loops; bounded historical peak and decay. | Body adaptation/save. |
| Body fat can modestly affect cold/heat response. | `retain_as_modifier` | Creates composition tradeoff. | Moderate. | Extreme fat-temperature builds; diminishing returns and stronger equipment/environment factors. | Body response; environment only reports exposure. |
| Heat acclimatization develops over days. | `retain_as_band` | Rewards staged travel and acclimation. | Moderate. | Rapid climate hopping; time-aware decay/reacquisition. | Body-state climate response. |
| Premodern diets were regionally/socially varied. | `presentation_only` | Supports authored culture, markets, and scarcity. | Content burden rather than runtime burden. | One universal optimal ration; regional food diversity. | Content/economy/culinary authors. |

## 11. Tier A, Tier B, And Tier C Candidate Abstractions

| Dimension | Tier A - Accessible | Tier B - Standard (recommended) | Tier C - Simulation |
|---|---|---|---|
| Internal nutrition | Exact consumed kcal/protein may still exist for content integrity, collapsed quickly to bands. | Exact kcal/macros and digestion entries; rolling availability bands drive effects. | Same authority plus more detailed digestion rate, fasting, and source-quality options. |
| Player-visible information | `Fed`, `Hungry`, `Protein Supported`, `Needs Rest`, `Condition Stable/Recovering`. | Energy trend, Protein Support, Fatigue/Recovery, Lean Condition, and clear causal forecasts; optional numeric food detail. | Estimated kcal/protein intake and demand ranges, deficit history, recovery window, and detailed condition trend. |
| State variables | Digestion summary, Energy band, Stamina, Fatigue, broad Body Condition. | Digestion queue, zero-centered Energy, accessible reserve, protein coverage, Stamina, Fatigue, Recovery Debt, fat reserve, Lean Condition, stimulus/adaptation, Structural Atrophy pressure. | Tier B plus coarse fasting/distribution, source-quality, regional condition detail, and more precise historical trends. |
| Update cadence | Meal/action/rest/day events; long-term loss highly forgiving. | Ingestion and activity events; fixed metabolism ticks; rest resolution; daily rolling summaries; weekly adaptation evaluation. | Smaller fixed ticks and detailed logs, without organ simulation. |
| Difficulty knobs | Permanent structural loss disabled or story-only; wide grace; strong warnings. | Deficit forgiveness, atrophy delay/rate, information precision, recovery speed, stimulus cap, climate strength. | Tighter windows, less forecasting certainty, optional meal-distribution and digestibility depth. |
| Expected decisions | Eat a varied meal, rest, avoid prolonged starvation. | Match food quantity/composition to work; alternate hard work and recovery; rehabilitate after loss; plan climate/logistics. | Plan exact rations and timing during expeditions and rehabilitation. |
| Failure consequences | Temporary Fatigue and broad condition decline; recovery quick. | Stamina recovery loss, Fatigue, Recovery Debt, reversible Lean Condition, then delayed Structural Atrophy. | Same state ordering with narrower margins and more information-rich consequences. |
| Anti-exploit | Hard caps and automatic averaging. | Rolling windows, digestion limits, nontrivial stimulus threshold, adaptation headroom, hysteresis, and rate-limited reserve flows. | Same safeguards; more detail must never create uncapped optimization. |
| Computational burden | Low. | Moderate and bounded: one shared resolver and small ledgers. | Moderate-high: more state, logs, and content metadata. |
| Content burden | Existing foods can map to broad tags after physical nutrition migration. | Per-basis kcal/macros plus preparation/digestibility/satiety posture. | Optional source-quality/digestibility nuance requires wider authored coverage. |

### 11.1 Recommendation

Tier B is the default because it preserves the high-value causal chain - food amount and composition, work demand, recovery, body reserve, and slow adaptation - while hiding grams-per-kilogram and biochemical accounting. Tier A should be a genuine difficulty/accessibility profile using the same owner contracts, not a separate implementation. Tier C may reveal more information and activate a few coarse modifiers, but must use the same authoritative state and never become a medical simulator.

## 12. Recommended Default Game Model

### 12.1 Ingestion and digestion

1. A food/item instance provides physical consumed amount.
2. Meal aggregation calculates nutrients from per-basis static nutrition.
3. Consumption creates one or more digestion entries containing kcal, protein, carbohydrate, fat, hydration contribution, digestibility/preparation modifier, and remaining release time.
4. Digestion releases nutrients over time into accessible energy and rolling protein availability.
5. Capacity and time prevent one huge meal from instantly supporting combat or a full day of recovery.

### 12.2 Energy, Stamina, and fat

1. BMR provides continuous baseline expenditure.
2. Activity owners report duration, intensity, loading, locomotion, environment, and interruption/result context.
3. The shared resolver adds contextual activity and climate expenditure.
4. Absorbed energy first supports current metabolism and short-term accessible reserve.
5. Zero-centered Energy tracks rolling surplus/deficit, distinct from immediate Stamina.
6. A mild uncovered deficit can be supported by rate-limited fat mobilization.
7. Demand above accessible support lowers Stamina recovery and raises Fatigue; fat does not instantly refill Stamina.
8. Sustained surplus can be stored as fat at a bounded rate; it does not directly become muscle.

### 12.3 Recovery and condition

1. Each meaningful activity creates Fatigue and possibly Recovery Demand and stimulus.
2. Rest/sleep clears Fatigue; adequate energy, hydration, protein, and health improve Recovery Debt clearance.
3. Continued recovery failure lowers reversible Lean Condition after a grace period.
4. Longer disuse, immobilization, severe deficit, or illness creates Structural Atrophy pressure.
5. Returning to adequate intake clears immediate constraints first, then restores Lean Condition, then allows slower structural rehabilitation.

### 12.4 Adaptation

1. Only meaningful, capacity-relative loading produces stimulus.
2. Similar trivial actions are aggregated and capped.
3. Daily stimulus enters a short rolling ledger by broad work domain, not microscopic muscle.
4. At the adaptation cadence, the resolver checks stimulus, energy, protein, recovery, health, and current headroom.
5. Maintenance stimulus prevents detraining; adaptation stimulus may produce slow positive change; excessive stress produces overreach and may create negative net recovery.
6. Derived effects update only after accumulated condition thresholds.

### 12.5 Difficulty and accessibility

All modes use the same saved truth. Difficulty changes only configured thresholds, forgiveness, information, and permanence:

- grace before Lean Condition or atrophy loss;
- severity needed for structural consequences;
- recovery rate;
- magnitude of nutrition/climate modifiers;
- whether lasting base-attribute loss is disabled;
- forecast accuracy and numeric detail;
- optional digestibility/distribution nuance.

## 13. Candidate State Variables And Update Cadence

All names are conceptual, not schema proposals.

| Candidate internal state | Unit / shape | Authority | Cadence | Standard player view |
|---|---|---|---|---|
| `digestionEntries` | Bounded entries with remaining kcal/macros and release profile | Body nutrition/metabolism | On consumption and fixed ticks | `Digesting`, meal fullness, expected support |
| `rollingEnergyBalanceKcal` | Signed kcal over a configurable rolling window | Metabolism | Fixed ticks / activity completion | Energy trend band around neutral |
| `accessibleEnergyReserve` | Normalized bounded reserve | Metabolism | Fixed ticks | `Ready`, `Running Low`, `Depleted` |
| `rollingProteinAvailableG` | Absorbed grams over a rolling recovery window | Nutrition/recovery | Fixed ticks / daily summary | Protein Support band |
| `contextProteinTargetG` | Internal generated target, not saved if derivable | Metabolism/recovery | Daily or demand change | Hidden; optional detailed estimate |
| `stamina` | Existing immediate capacity scale | Stamina owner | Action/tick | Exact familiar bar |
| `fatigue` | Short-lived exertion/physiological burden | Recovery | Action/tick/rest | Descriptive band plus sources |
| `recoveryDebt` | Persistent unmet recovery demand | Recovery | Activity/rest/daily | `Recovered`, `Strained`, `Overreached` |
| `fatReserve` | Physical or normalized persistent reserve | Body composition | Daily/long interval | Broad body-reserve/condition band |
| `leanCondition` | Normalized reversible functional/tissue condition around personal baseline | Body composition | Daily | `Reduced`, `Stable`, `Recovering`, `Robust` |
| `structuralAtrophy` | Slow persistent loss pressure/state | Body composition | Daily/weekly | Only material warnings/status |
| `stimulusLedger` | Bounded domain totals plus timestamps | Adaptation | Activity completion; daily aggregation | `Maintaining`, `Adapting`, `Excessive Stress` |
| `adaptationCondition` | Slow normalized development relative to current potential | Body composition | Weekly or accumulated long tick | Thresholded description/appearance |
| `recentStablePeak` | Bounded prior maintained condition for retraining | Body composition/save | Long interval | Usually hidden |
| `heatAcclimatization` / `coldAcclimatization` | Broad time-aware bands | Body climate response | Daily/exposure | `Unacclimatized` etc. |

### 13.1 Update cadence rules

- `event`: consumption, activity start/completion, injury/illness change, rest start/completion.
- `metabolism tick`: fixed deterministic interval that releases digestion and charges baseline expenditure; exact tick length is open.
- `daily summary`: rolling energy/protein coverage, Fatigue carryover, Recovery Debt, fat flow, and Lean Condition pressure.
- `adaptation interval`: at least several in-game days, preferably a rolling weekly evaluation; never action-by-action visible gain.
- `structural interval`: daily pressure accumulation with multiweek consequences and strong hysteresis.
- offline/large time skips: deterministic batch integration using the same equations and bounded substeps, not a separate result path.

## 14. Candidate Formulas, Bands, And Configurable Ranges

Every value below is a candidate translation, not implemented or accepted canon.

### 14.1 Physical food aggregation

```text
nutrient_consumed
  = consumed_physical_amount
  / nutrition_basis_amount
  * nutrient_per_basis
```

Classification: physical accounting identity; high confidence; all populations; `retain_directly`. Amount units, rounding, preparation yield, and edible fraction remain configurable/owner-specific. Exploit safeguard: consume only persisted physical amount and derive all nutrients from one canonical profile.

### 14.2 Expenditure

```text
baseline_kcal_per_minute = individual_BMR_kcal_per_day / 1440

activity_kcal = baseline_kcal_per_minute
              * duration_minutes
              * intensity_factor
              * bounded_context_modifier
```

Classification: game-design translation consistent with the accepted metabolism decision; moderate confidence for structure, insufficient for coefficients. `individual_BMR` candidate base `1,800-2,000 kcal/day`, ordinary active `~2,500`, and sustained heavy work `~3,500-4,000` are repository design anchors, not results of this review. All factors remain configurable. Safeguard: one shared resolver; activity domains cannot author arbitrary calorie rewards or costs.

### 14.3 Rolling energy coverage

```text
energy_coverage = absorbed_kcal_available_over_window
                / expenditure_kcal_over_same_window
```

Candidate bands for tuning trials, expressed relative to individual demand rather than fixed calories:

| Band | Candidate coverage region | Effect posture | Evidence classification |
|---|---:|---|---|
| Recovery surplus | `~1.02-1.12` | Removes energy constraint; extra beyond bounded storage/adaptation support increasingly becomes fat. | Game translation; low confidence in exact range. |
| Maintenance | `~0.95-1.05` | Normal recovery and maintenance. | Game translation; moderate confidence in concept. |
| Mild deficit | `~0.80-0.95` | Rate-limited reserve use; modest recovery pressure if repeated. | Game translation; low confidence in thresholds. |
| Deep deficit | `<~0.80` or unresolved demand above mobilization capacity | Strong Fatigue/recovery penalty; adaptation suppressed; condition pressure if sustained. | Game translation; moderate confidence in direction. |

Do not hard-switch at one boundary. Use a rolling window, hysteresis, and severity-duration accumulation. The values should be tuned against the accepted BMR/activity anchors and gameplay pace. The `~500 kcal/day` study-model estimate from resistance-training trials supports suppressing adaptation under a meaningful persistent deficit, but it must not become a universal game threshold ([Murphy 2022](https://pubmed.ncbi.nlm.nih.gov/34623696/)).

### 14.4 Context protein target and coverage

```text
context_protein_target_g
  = reference_body_size_component
  * activity_recovery_factor
  * life_stage_health_factor

protein_coverage
  = absorbed_protein_g_over_window / context_protein_target_g
```

Evidence anchors for later target calibration:

- healthy adult maintenance reference near `0.8 g/kg/day` ([National Academies DRI source data](https://nap.nationalacademies.org/resource/26818/supplemental-appendixes/Appendix-T-IOM-Data-Extracted-from-2002_2005-DRI-Report.pdf));
- modern active/recovery evidence commonly around `1.2-1.6 g/kg/day`;
- resistance-training meta-regression breakpoint centered at `1.62 g/kg/day`, with wide `1.03-2.20` CI ([Morton 2018](https://pubmed.ncbi.nlm.nih.gov/28698222/));
- higher needs under older age, illness, injury, or energy restriction should be bounded modifiers, not one universal rule ([Nunes 2022](https://pubmed.ncbi.nlm.nih.gov/35187864/)).

Candidate UI/logic bands relative to the generated target:

| Protein Support band | Candidate coverage | Recovery/adaptation multiplier posture |
|---|---:|---|
| Deficient | `<0.60` | Strongly limits recovery and raises lean-loss pressure if sustained. |
| Low | `0.60-0.85` | Noticeable limitation; no sudden stat penalty from a single day. |
| Adequate | `0.85-1.15` | Full maintenance and ordinary recovery support. |
| Recovery Supporting | `1.15-1.40` | Small capped benefit where meaningful recovery/stimulus demand exists. |
| No Added Benefit | `>1.40` | Nutrition still supplies kcal/satiety; adaptation factor remains capped. |

Classification: evidence-informed game translation; moderate confidence in the curve, low in exact thresholds. The top cap is intentionally lower than treating `1.6 g/kg` as 160% of every contextual target, because the target itself already rises with activity/recovery demand. All ranges must remain configurable. Exploit safeguard: cap the factor and require energy, stimulus, and rest.

### 14.5 Recovery quality

```text
recovery_quality
  = min(
      energy_recovery_factor,
      protein_recovery_factor,
      hydration_factor,
      sleep_rest_factor,
      health_injury_factor
    )
```

Alternative implementation may use a bounded weighted geometric mean, but a `min`-like limiter is easiest to explain: one severe missing requirement cannot be bought off with excess elsewhere. Classification: game inference; moderate confidence in causal structure, low in exact aggregation. Configurable factors and floors. Safeguard: no additive protein points that erase dehydration or sleep loss.

### 14.6 Stimulus

```text
effective_stimulus
  = meaningful_load_above_maintenance
  * duration_quality
  * novelty_or_progression
  * movement_domain_relevance
  - excessive_stress_penalty
```

Candidate bands:

- `none`: ordinary trivial movement or activity below maintenance relevance;
- `maintenance`: enough recurring load to preserve current condition;
- `adaptation`: bounded challenge above current accustomed demand;
- `excessive stress`: volume/intensity beyond recoverable capacity, raising Fatigue/injury pressure;
- `plateaued`: repeated stimulus no longer exceeds current maintenance threshold.

Classification: game translation from resistance-training and occupational principles; high confidence in direction, low in coefficients. Safeguard: same-domain stimulus is aggregated per interval with diminishing returns and a hard cap; repeated zero-duration or negligible-load actions contribute nothing.

### 14.7 Adaptation opportunity

```text
adaptation_opportunity
  = stimulus_factor
  * recovery_quality
  * adaptation_headroom
  * retraining_or_life_stage_modifier

net_adaptation_change
  = clamp(-loss_cap, gain_cap,
          adaptation_opportunity - detraining_or_atrophy_pressure)
```

Positive structural change is evaluated only across a multi-day/week window. `adaptation_headroom` declines nonlinearly near current potential. `retraining` may increase reacquisition rate only up to a decaying recent stable peak. Classification: game inference; moderate confidence in shape, insufficient for exact rate. The systematic review average `~1.53 kg` across varied interventions confirms weeks-scale change but is not a coefficient ([Benito 2020](https://pubmed.ncbi.nlm.nih.gov/32079265/)).

Recommended game-safe pacing bands:

- early functional/reversible improvement: noticeable after several good recovery cycles;
- ordinary new Muscle Adaptation: thresholded feedback after roughly `2-6` in-game weeks of consistent qualifying exposure;
- advanced adaptation: slower, potentially `6-16+` weeks per material threshold;
- structural rehabilitation: several weeks to months depending on severity;
- base-attribute consequences: outside this contract.

These are pacing candidates, not human medical predictions. Configure against the game's calendar compression. Safeguard: normalize elapsed physiological time so sleeping/skipping, reloads, or high action frequency cannot accelerate beyond caps.

### 14.8 Detraining and atrophy pressure

```text
detraining_pressure
  = max(0, maintenance_requirement - recent_meaningful_stimulus)

structural_atrophy_pressure
  = prolonged_disuse
  + immobilization_or_illness
  + sustained_deep_deficit
  + sustained_protein_deficiency
  - protected_grace_and_rehabilitation
```

Candidate game-safe grace:

- no structural loss during ordinary `1-3` rest days;
- early detraining/condition signals after roughly `1-2` weeks of near-total disuse or sooner under immobilization/severe illness;
- Structural Atrophy only after multiweek accumulated pressure, with faster pressure under combined severe causes.

Classification: evidence-informed game translation; moderate confidence in ordering, low in exact time. Disuse studies show early force and size changes but not one universal rate ([Campbell 2023](https://pubmed.ncbi.nlm.nih.gov/36883219/); [Immobilization review](https://pubmed.ncbi.nlm.nih.gov/34081160/)). Difficulty can extend the grace or disable lasting consequences.

### 14.9 Fat mobilization and storage

```text
fat_energy_available_this_interval
  = min(
      uncovered_energy_demand,
      configurable_mobilization_cap(
        fat_reserve, interval, deficit_severity, activity_intensity, health
      )
    )
```

No fixed kcal/hour cap is recommended by this research. Classification: accepted game direction plus evidence-informed physiology; high confidence in the need for a rate limit, insufficient for a universal coefficient. Safeguard: neither a very large reserve nor time-slice manipulation can cover unlimited burst demand.

## 15. Player-Facing UI And Feedback Recommendations

### 15.1 Standard HUD and character view

Do not add five permanent bars to the top HUD. Immediate Stamina remains visible. Nutrition/body information belongs in a compact condition view and action/meal forecasts:

- `Energy`: Deep Deficit / Drawing On Reserves / Balanced / Recovery Surplus;
- `Protein Support`: Deficient / Low / Adequate / Recovery Supporting;
- `Recovery`: Recovered / Recovering / Strained / Overreached;
- `Body Condition`: Reduced / Stable / Recovering / Robust;
- `Adaptation`: Detraining / Maintaining / Adapting / Plateaued / Excessive Stress;
- causal warnings such as `Hard labor is outpacing food and rest` or `Adequate food; protein remains low`.

### 15.2 Meal and ration preview

Show physical amount, servings, kcal, and qualitative contribution. Standard mode can say:

- `substantial energy, modest protein`;
- `supports recovery for current workload`;
- `slow-digesting and filling`;
- `helpful for repeated hard work after digestion`.

Optional detailed view may show exact per-basis and consumed kcal/macros plus an estimated daily range. Never require g/kg calculations.

### 15.3 Activity preview

Activity UI reports owner-provided duration/intensity and resolver forecasts:

- Stamina cost range;
- Energy demand band;
- expected Fatigue;
- `maintenance`, `adaptation`, or `excessive` stimulus when known;
- warnings for heat, dehydration, deep deficit, injury, or Recovery Debt.

The UI displays authoritative resolver output; it does not recalculate physiology.

### 15.4 Uncertainty and knowledge

Exact demand and outcome may be shown as ranges. Character knowledge may affect food identification and observed nutrition, but hidden truth remains static/content- and instance-owned. Difficulty controls information precision, not competing physiological state.

## 16. Anti-Exploit Requirements

1. **No protein buff:** consumption queues digestion; it never grants immediate Strength or Stamina.
2. **Diminishing return cap:** Protein Support stops increasing adaptation beyond the capped band.
3. **Stimulus threshold:** zero-duration, trivial-load, or already-trivialized actions create no adaptation stimulus.
4. **Domain aggregation:** repeated micro-actions aggregate into one daily/domain exposure with diminishing returns and a hard cap.
5. **Recovery gate:** excessive work creates Fatigue/Recovery Debt and can turn additional volume negative.
6. **Rolling windows:** energy/protein/recovery use weighted history, preventing midnight resets and feast/starve switching.
7. **Hysteresis:** entering and leaving deficit/condition bands uses different thresholds or sustained duration, preventing boundary flicker.
8. **Digestion limits:** one huge meal cannot become instantly available before combat or repair weeks of deficit immediately.
9. **Rate-limited fat:** reserve cannot cover unlimited burst output or be stored/mobilized repeatedly through tiny time slices.
10. **No passive muscle gain:** calorie/protein surplus without meaningful stimulus supports maintenance and storage only.
11. **Headroom and plateau:** adaptation slows near current potential; identical stimulus becomes maintenance.
12. **Elapsed-time normalization:** action count, frame rate, save/load, and offline batching yield the same bounded result.
13. **Retraining ceiling:** faster restoration stops at a decaying recent stable peak; deliberate loss cannot produce net progression.
14. **Climate ownership:** weather cannot mutate body fat, and body fat cannot nullify equipment, hydration, exposure, or acclimatization.
15. **One resolver:** activities, foods, UI, and difficulty cannot privately grant muscle, delete lean tissue, or maintain separate calorie ledgers.

## 17. Scenario-Test Results

| # | Scenario | Expected state changes | Player feedback | Exploit safeguard |
|---:|---|---|---|---|
| 1 | Active, enough calories, chronically low protein | Energy remains near balance; Protein Support becomes Low; Recovery Debt clears slowly; adaptation stops; Lean Condition pressure rises only after sustained exposure. | `Energy needs met; diet lacks recovery support.` | No immediate Strength loss from one meal/day; rolling protein window. |
| 2 | Active, high protein, too few calories | Protein Support adequate/high; Energy deficit and reserve draw increase; Fatigue/Recovery Debt rise; adaptation suppressed; prolonged loss possible. | `Protein is sufficient, but total food is not covering the work.` | Recovery uses limiting factor; excess protein cannot buy off energy deficit. |
| 3 | Sedentary, high protein, surplus calories | Maintenance supported; no adaptation stimulus; surplus storage pressure increases fat over time. | `Well fed; current activity maintains little additional muscle.` | No stimulus means zero positive adaptation factor. |
| 4 | Heavily active, adequate protein, mild deficit | Accessible reserve/fat contribute within caps; modest recovery pressure; maintenance possible; adaptation limited depending on duration. | `Drawing on reserves; recovery is becoming harder.` | Rolling deficit prevents indefinite consequence-free cutting. |
| 5 | Heavily active, adequate calories, inadequate rest | Energy/protein good; Fatigue and Recovery Debt accumulate; effective output drops; adaptation becomes excessive stress. | `Food is sufficient; rest is limiting recovery.` | Min-like recovery gate; protein/calories cannot cancel sleep. |
| 6 | Recovering from several days underfeeding and temporary Strength loss | Digestion and Energy improve first, then Fatigue; Recovery Debt and Lean Condition recover across days/weeks with food, sleep, and tolerable activity. | Layered forecast: `Fed`, then `Recovering`, then `Condition improving`. | No instant restoration from feast; rate and state ordering. |
| 7 | Recovering from prolonged Structural Atrophy | Energy/protein adequacy prevents further loss; graded rehab creates stimulus; Lean Condition improves before structural restoration. | `Rehabilitation is working; structural recovery will take time.` | Nutrition alone cannot restore; weekly caps and injury tolerance. |
| 8 | Repeated heavy labor with adequate mixed diet | High expenditure and stimulus; adequate carb/energy supports repeated work; protein/rest permit maintenance or slow adaptation; Fatigue still accumulates within a day. | `Demanding but sustainable` with meal/rest planning prompts. | Work stimulus plateaus and caps; more hours can become overreach. |
| 9 | Farming muscle with trivial micro-actions | Stamina/energy cost negligible or normal; stimulus ledger rejects or aggregates actions below threshold; no gain. | `This activity is no longer a meaningful physical challenge.` | Capacity-relative threshold, duration floor, daily/domain cap. |
| 10 | One huge protein meal before combat | Digestion queue becomes full; little protein immediately available; combat uses existing Stamina/accessibility; later recovery may benefit. | `Digesting - recovery support arrives over time.` | Time-aware digestion and no instant protein effect. |
| 11 | Cold weather, moderate fat reserve | Small cold-resilience modifier; activity/shivering demand rises; clothing, shelter, wind, wetness, and energy dominate. | `Reserve helps slightly; exposure remains dangerous.` | Diminishing modifier cannot negate exposure systems. |
| 12 | Humid heat, high fat and muscle mass | Work creates high metabolic heat; body mass adds bounded burden; hydration/Fatigue pressure rises; acclimatization helps over days. | Heat warning names humidity, armor, pace, hydration, and body burden. | Body composition is secondary and capped; no weather-owned composition. |
| 13 | Older or injured character in rehabilitation | Health/life-stage modifier raises recovery demand or lowers rate; adequate protein/energy plus graded activity supports recovery. | `Recovery support adequate; increase load gradually.` | Injury owner controls safe loading; protein cannot bypass injury. Population evidence remains optional/bounded. |
| 14 | Alternating starvation and feasting | Deficit history, Recovery Debt, and digestion persist; feast first replenishes energy and may store excess, but cannot instantly repair condition. | Trend display shows `Recovering from sustained deficit`. | Rolling weighted windows, hysteresis, storage/mobilization rate limits. |
| 15 | Maintaining high muscle condition during prolonged inactivity | Maintenance stimulus falls; early detraining affects effective condition, then Lean Condition; Structural Atrophy after prolonged grace. High protein slows but does not prevent it indefinitely. | `Inactivity is reducing conditioning; meaningful loading is required.` | No passive diet maintenance at peak; long grace avoids punishing ordinary rest. |

## 18. Owner And Dependency Matrix

| Concern | Single proposed authority | Inputs | Outputs / consumers | Duplicate authority rejected |
|---|---|---|---|---|
| Static food nutrients | Static nutrition profile owner | Authored per-basis kcal, protein, carbohydrate, fat, hydration, optional digestibility posture | Meal aggregation | Food item must not own body mutation or muscle gain. |
| Meal aggregation | Culinary/meal instance owner | Physical ingredient amounts, preparation yield, static profiles | Consumed nutrient payload | UI and body state do not recalculate recipe truth. |
| Digestion and nutrient availability | Player body-state nutrition/metabolism owner | Consumed payload, time, preparation/digestibility | Absorbed kcal/macros, satiety/availability bands | Consumables do not grant immediate Energy/Stamina. |
| Energy balance | Player body-state metabolism owner | Absorption, BMR, shared expenditure | Signed Energy trend, reserve/fat flow, recovery factor | No activity-local calorie ledger. |
| Stamina | Stamina/body-state owner | Action demand, current condition, recovery context | Immediate action capacity and recovery | Energy and fat do not directly refill it on demand. |
| Body fat | Body-state/body-composition owner | Sustained surplus/deficit, rate limits, time | Reserve, body-mass and climate modifiers | Weather and food items do not mutate it. |
| Lean Condition and muscle adaptation | Body-state/body-composition owner | Stimulus ledger, energy, protein, recovery, health, time | Slow condition and derived contributions | No food/activity/private mutation. |
| Training stimulus | Shared adaptation input contract; activity domains only describe events | Duration, intensity, loading, work domain, result | Bounded stimulus events | Activity owners do not calculate muscle gain. |
| Activity expenditure | Shared body-state/activity expenditure resolver | BMR, duration, intensity, load, terrain, climate, injury | Kcal demand and forecast | Travel/combat/crafting do not own separate formulas. |
| Fatigue and recovery | Body-state/recovery owner | Activity stress, sleep/rest, hydration, energy, protein, health | Fatigue, Recovery Debt, recovery quality | Protein and rest menus do not erase state directly. |
| Effective attributes | Attribute-resolution contract consuming body-state modifiers | Base attributes, Fatigue, Lean Condition, injury, magic/toxin context | Effective Strength/Constitution/Vitality checks | Body state does not silently rewrite bases. |
| Climate response | Environment reports exposure; body-state climate response resolves character effect | Temperature, humidity, wind, wetness, clothing, shelter, activity, acclimatization, composition | Heat/cold burden, expenditure, Fatigue | Environment does not own body composition. |
| Difficulty | Difficulty/global-rules owner | Chosen profile | Thresholds, forgiveness, permanence, information precision | No duplicate easy-mode physiology. |
| UI presentation | UI projection of authoritative results | Resolved bands, forecasts, causes | Player displays and notices | UI does not calculate physiology. |
| Save persistence | Authoritative session/save owner serializes body state and ledgers | Validated state/version | Deterministic load and migration | UI/local caches do not become truth. |

### 18.1 Dependency order for any later implementation route

1. physical quantity and per-basis nutrition authority;
2. meal/consumption payload contract;
3. digestion and kcal-scale metabolism contract plus legacy migration;
4. shared activity expenditure inputs;
5. Fatigue/Recovery Debt and Energy/Stamina integration;
6. fat reserve/body composition;
7. stimulus and Lean Condition/Structural Atrophy;
8. effective-attribute, climate, difficulty, UI, and save projections;
9. representative integration and save/load tests.

This order is a research dependency recommendation only. It does not authorize a prompt or implementation.

## 19. Rejected Complexity And Reasons

| Rejected mechanic | Reason |
|---|---|
| Mandatory grams-per-kilogram UI | Correctly normalizes some research but creates arithmetic and false precision for players. |
| Per-meal anabolic window | Long-term timing evidence does not support a strong independent mechanic; invites schedule gaming. |
| Leucine/amino-acid profiles | High content and calculation cost; little extra decision value over protein quality/adequacy. |
| Detailed nitrogen balance | Clinical/research construct, not legible gameplay. |
| Biochemical glycogen meter | Accessible Energy and repeated-work recovery provide the useful decision without metabolic micromanagement. |
| Blood glucose, insulin, ketones | Medical simulation with poor fit to the intended loop. |
| Exact thermic effect by macro | Real but variable and too small to justify a second expenditure ledger or protein-burning exploit. |
| Automatic digestive illness from high protein | Punitive, health-context dependent, and unnecessary once benefits cap. |
| Protein-specific dehydration penalty | Common overstatement; hydration should be governed by total context, climate, and exertion. |
| One muscle state per anatomical group | Large save/UI/content burden; work-domain stimulus plus overall condition is sufficient. |
| Direct kg-of-muscle progression | Measurements and rates are too variable; conflicts with classless attributes and fantasy lineages. |
| Calories-to-muscle conversion ratio | Evidence does not establish one; would reward overeating and create deterministic farming. |
| One universal medieval diet or ration macro | Historically false across region, status, season, institution, and subsistence mode. |
| Hormones, inflammation pathways, and molecular signaling | Explain physiology but do not create clear player decisions. Illness/injury can provide coarse modifiers. |
| Permanent loss after ordinary missed meals or rest | Contradicts timescale evidence and creates punitive maintenance play. |
| Diet-only muscle preservation forever | Disuse evidence shows loading remains necessary; creates passive maximum-condition exploit. |

## 20. Unresolved Decisions

The research supports direction but leaves these for a separate integration/acceptance pass:

1. Exact physical nutrition unit/basis and migration from current game-scale consumable profiles.
2. Exact digestion tick, queue representation, release curves, meal capacity, and preparation/digestibility modifiers.
3. BMR generation method and whether body size, sex/life stage, lineage, Constitution, Vitality, and Lean Condition contribute.
4. Exact Energy rolling-window length, reserve size, band thresholds, and hysteresis.
5. Exact protein-target generator and whether internal body weight or a bounded metabolic-size proxy is preferable.
6. Whether `rollingProteinAvailableG` or a normalized availability pool is saved, derived, or both.
7. Whether Tier C includes a coarse prolonged-fasting/distribution modifier; Tier B should not.
8. Whether protein source quality is a static digestibility factor, preparation effect, mixed-meal modifier, or omitted initially.
9. Exact fat-storage and mobilization curves and physical reserve units.
10. Exact boundary among Fatigue, Recovery Debt, Lean Condition, Structural Atrophy, and injury/illness state.
11. Work-domain taxonomy for stimulus and how combat, travel, crafting, labor, and deliberate training report comparable loading.
12. Adaptation/atrophy pacing under the game's calendar compression and time skipping.
13. Recent-stable-peak representation, decay, and retraining cap.
14. Magnitude of derived effective-Strength, carrying, Stamina, BMR, body-mass, appearance, heat, and injury-risk effects.
15. Life-stage and rehabilitation modifiers, especially for older/injured characters, without demographic or medical overreach.
16. Climate acclimatization persistence, decay, and relationship to clothing/shelter/environment owners.
17. Difficulty defaults, including whether base-attribute loss is disabled outside simulation or story-authored conditions.
18. UI placement, forecast precision, and optional detailed numeric nutrition view.
19. Save versioning, migration, offline time integration, and deterministic replay.
20. Validation and integration-test matrix required before any live replacement of the legacy `dailyCalories: 100` and `proteinBaseline: 18` rules.

## 21. Complete Bibliography

### Energy, protein, and adaptation

- Academy of Nutrition and Dietetics, Dietitians of Canada, and American College of Sports Medicine. *Nutrition and Athletic Performance* (2016). Position statement; athlete-specific. https://pubmed.ncbi.nlm.nih.gov/26891166/
- Benito PJ et al. *A Systematic Review with Meta-Analysis of the Effect of Resistance Training on Whole-Body Muscle Growth in Healthy Adult Males* (2020). https://pubmed.ncbi.nlm.nih.gov/32079265/
- Hudson JL et al. *Protein Intake Greater than the RDA Differentially Influences Whole-Body Lean Mass Responses to Purposeful Catabolic and Anabolic Stressors* (2020). https://pubmed.ncbi.nlm.nih.gov/31794597/
- Morton RW et al. *A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains* (2018). https://pubmed.ncbi.nlm.nih.gov/28698222/
- Murphy C and Koehler K. *Energy deficiency impairs resistance training gains in lean mass but not strength* (2022). https://pubmed.ncbi.nlm.nih.gov/34623696/
- Nunes EA et al. *Systematic review and meta-analysis of protein intake to support muscle mass and function in healthy adults* (2022). https://pubmed.ncbi.nlm.nih.gov/35187864/
- Slater GJ et al. *Is an Energy Surplus Required to Maximize Skeletal Muscle Hypertrophy Associated With Resistance Training* (2019). https://pubmed.ncbi.nlm.nih.gov/31482093/
- Tagawa R et al. *Dose-response relationship between protein intake and muscle mass increase* (2020). https://pubmed.ncbi.nlm.nih.gov/33300582/
- Mountjoy M et al. *2023 International Olympic Committee consensus statement on Relative Energy Deficiency in Sport* (2023). https://bjsm.bmj.com/content/57/17/1073
- USDA National Agricultural Library. *DRI Calculator for Healthcare Professionals*. https://www.nal.usda.gov/human-nutrition-and-food-safety/dri-calculator
- NIH Office of Dietary Supplements. *Nutrient Recommendations and Databases*. https://ods.od.nih.gov/HealthInformation/nutrientrecommendations/
- National Academies. *IOM Data Extracted from the 2002/2005 Dietary Reference Intake Report*, Appendix T. https://nap.nationalacademies.org/resource/26818/supplemental-appendixes/Appendix-T-IOM-Data-Extracted-from-2002_2005-DRI-Report.pdf

### Timing, distribution, quality, excess, and recovery

- Halton TL and Hu FB. *The effects of high protein diets on thermogenesis, satiety and weight loss* (2004). https://pubmed.ncbi.nlm.nih.gov/15466943/
- Hudson JL et al. *Protein distribution and muscle-related outcomes: a systematic review* (2020). https://pubmed.ncbi.nlm.nih.gov/32429355/
- Kim IY et al. *The effect of protein distribution on muscle mass and function: a systematic review* (2021). https://pubmed.ncbi.nlm.nih.gov/33550490/
- Kohanmoo A et al. *Effect of short- and long-term protein consumption on appetite and appetite-regulating gastrointestinal hormones* (2020). https://pubmed.ncbi.nlm.nih.gov/32648023/
- Pearson AG et al. *The impact of dietary protein supplementation on recovery from resistance exercise-induced muscle damage* (2023). https://pubmed.ncbi.nlm.nih.gov/36513777/
- Wirth J et al. *The Role of Protein Intake and its Timing on Body Composition and Muscle Function in Healthy Adults* (2020). https://pubmed.ncbi.nlm.nih.gov/32232404/
- Wolfe RR et al. *Protein quality as determined by the Digestible Indispensable Amino Acid Score* (2020). https://pubmed.ncbi.nlm.nih.gov/33133540/
- *Effects of protein intake on energy expenditure: a systematic review and meta-analysis* (2024). https://pubmed.ncbi.nlm.nih.gov/39486625/

### Carbohydrate, sleep, disuse, and rehabilitation

- Craven J et al. *Effects of carbohydrate and protein co-ingestion on glycogen restoration* (2021). https://pubmed.ncbi.nlm.nih.gov/33507402/
- Henselmans M et al. *The Effect of Carbohydrate Intake on Strength and Resistance Training Performance* (2022). https://pubmed.ncbi.nlm.nih.gov/35215506/
- Lopes TR et al. *Effects of Acute Sleep Loss on Physical Performance: A Systematic and Meta-Analytical Review* (2022). https://pubmed.ncbi.nlm.nih.gov/35708888/
- Lopes TR et al. *How much does sleep deprivation impair endurance performance? A systematic review and meta-analysis* (2023). https://pubmed.ncbi.nlm.nih.gov/36472094/
- Saner NJ et al. *The effect of sleep deprivation on skeletal muscle protein synthesis* (2020). Narrow controlled study. https://pubmed.ncbi.nlm.nih.gov/33400856/
- Campbell EL et al. *The effects of single-leg disuse on skeletal muscle strength and size: a meta-analysis* (2023). https://pubmed.ncbi.nlm.nih.gov/36883219/
- Berg HE et al. *Nonuniform loss of muscle strength and atrophy during bed rest: a systematic review* (2021). https://pubmed.ncbi.nlm.nih.gov/33703945/
- Oikawa SY et al. *The effect of bed rest, unilateral limb immobilization and head-down tilt on muscle protein synthesis* (2025). https://pubmed.ncbi.nlm.nih.gov/41166041/
- *The effect of limb immobilization on muscle mass, strength, and function: a systematic review* (2021). https://pubmed.ncbi.nlm.nih.gov/34081160/
- *Effects of protein supplementation on muscle mass, muscle strength, and physical performance in older adults with physical inactivity* (2025). https://pubmed.ncbi.nlm.nih.gov/40200135/

### Climate and body composition

- CDC/NIOSH. *Heat Stress and Workers*. https://www.cdc.gov/niosh/heat-stress/about/
- CDC/NIOSH. *Acclimatization*. https://www.cdc.gov/niosh/heat-stress/recommendations/acclimatization.html
- CDC/NIOSH. *Workplace Recommendations for Heat Stress*. https://www.cdc.gov/niosh/heat-stress/recommendations/
- Alele FO et al. *The role of body fat in thermoregulation during exercise: a systematic review* (2021). https://pubmed.ncbi.nlm.nih.gov/34175202/
- National Research Council. *Impact of Body Weight and Body Composition on Environmental Fitness* in *Body Composition and Physical Performance* (1992). https://nap.nationalacademies.org/read/2031/chapter/15
- Haman F. *Shivering in the cold: from mechanisms of fuel selection to survival* (review). https://pubmed.ncbi.nlm.nih.gov/28944268/
- *Human brown adipose tissue and cold-induced thermogenesis: a systematic review and meta-analysis* (2024). https://pubmed.ncbi.nlm.nih.gov/38540150/

### Premodern diet and provisioning

- Woolgar CM, Serjeantson D, and Waldron T, eds. *Food in Medieval England: Diet and Nutrition*. Oxford University Press. https://academic.oup.com/book/47620
- Craig-Atkins E et al. *Detecting social differences in diet in medieval towns: isotopic evidence from Cambridge, England, c. AD 940-1538*. *Antiquity*. https://www.cambridge.org/core/journals/antiquity/article/detecting-social-differences-in-diet-in-medieval-towns-isotopic-evidence-from-cambridge-england-c-ad-9401538/41CEEE983BA1D973752C0031B8663922
- English Heritage. *How to Cook a Medieval Feast: The Medieval Household of Goodrich Castle*. https://www.english-heritage.org.uk/medievalhousehold
- Harvey B. *Living and Dying in England 1100-1540: The Monastic Experience*, dietary chapter. Oxford University Press. https://academic.oup.com/book/2769/chapter-abstract/143269067
- Albala K. *The Culture of Food in Early Modern Europe*. Yale University Press. https://academic.oup.com/yale-scholarship-online/book/29936

## Gate Disposition

This research gate is complete as a candidate evidence artifact. It recommends Tier B for later integration, but it does not accept the candidate bands, formulas, state names, coefficients, UI, persistence shape, or migration route as canon. The next safe step is GPT/human inspection followed, only if explicitly authorized, by a separate owner-aware integration decision. No implementation prompt should be installed from this artifact directly.
