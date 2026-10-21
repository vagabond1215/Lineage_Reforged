# Metabolic Reserves And Nourishment Quick-Glance Design Decision

Date: 2026-10-21  
Status: **user-directed design intent recorded; metabolic owner contract and balance still open; documentation-only proposal for review**  
Classification: unversioned, cross-cutting product/design reconciliation; no Game-version, development-parent, combat, nutrition implementation, schema or UI acceptance.  
Inspected repository head: `f56229dde859b9374a54368bd8a8fd2a9872daa1`; repository: `vagabond1215/Lineage_Reforged`.

## 1. Purpose, precedence and source boundary

The desired player experience is to understand, from one compact **Nourishment** control, **(a)** whether current metabolic energy supply is in surplus or deficit, **(b)** whether usable **carbohydrate, dietary fat and protein** remain available, and **(c)** whether hydration or an actual impairment needs attention. These are *availability and metabolic-state signals*, **not** percentages of a daily diet, a Food/Water hunger pair, a new stamina mechanic or a required nutrition-optimization dashboard.

This refines player-facing intent within, but does not supersede the accepted owning decisions:

- [Metabolic Energy, Stamina, Fat Storage And Atrophy](metabolic-energy-stamina-fat-storage-and-atrophy-decision.md) (calories, absorption, continuous balance, expenditure and long-term reserve)
- [Fat Mobilization, Body-Stat And Climate Effects](fat-mobilization-body-stat-and-climate-effects-decision.md) (ordinary mild-deficit fat use, rate caps, body-fat storage)
- [Protein Recovery, Muscle Adaptation And Nutrition Integration](protein-recovery-muscle-adaptation-and-nutrition-integration-decision.md) (protein maintenance, repair, training stimulus and prolonged deficit)
- [Unified Physical Attribute Growth And Nutrition-Band Integration](unified-physical-attribute-growth-and-nutrition-band-integration-decision.md) (single stat-growth owner, derived modifiers, immutable base)
- [Culinary Preparation, Portion, Meal Composition And Food Knowledge](culinary-preparation-portion-meal-composition-and-food-knowledge-decision.md) (authored nutrient truth, knowledgeable previews, difficulty disclosure)
- [UI Information Architecture Boundary](ui-information-architecture-boundary.md) (compact global context, secondary on-demand detail, no crowded duplicated status displays)
- [Difficulty Presets And Grim-World Rules](difficulty-presets-grim-world-rules-and-stakes-separation-decision.md) (nutrition complexity and severity vary by mode).

Exact metabolic formulas, daily target redefinition, persistent state shape, units, migrations, action-cost policy, mental/magical metabolism, UI implementation and Game-version decisions remain **unapproved** by this document. The live [current Codex prompt](../dev/current-codex-prompt.md) is DEV-0.7.2.13 Combat Action Result Disclosure Contract And Repair; this independent proposal must not alter or preempt it.

## 2. Source inspection before this proposal

Inspected live [player body-state engine](../../packages/engines/player-engine/src/body-state.ts), [player runtime sync](../../packages/engines/player-engine/src/index.ts), [consumption UI caller](../../apps/rpg-ui/src/features/characterPanelState.ts), [travel tick caller](../../packages/engines/game-engine/src/player-travel.ts), [body-state UI projection](../../apps/rpg-ui/src/runtime/bodyStatePresentation.ts), [shared persisted contract](../../packages/shared/types/src/contracts.ts), [global rules](../../packages/content/base/game/global_rules.json), [nine consumable profiles](../../packages/content/base/items/consumable_profiles.json), [lineage metabolic profiles](../../packages/shared/types/src/player-origins.ts), and [body-state tests](../../tests/unit/player-body-state.test.mjs).

| Current executable owner fact | Exact boundary; do not mistake it for the proposed model |
| --- | --- |
| `applyConsumableToBodyState` increments `dailyCaloriesConsumed`, `dailyProteinConsumed`, `dailyCarbsConsumed`, `dailyFatConsumed`, `dailyHydrationConsumed` and immediately changes quick/stored energy reserves | No digestion/absorption queue or durable available-macro pools; UI Inventory consumes an authored stack and calls this synchronously |
| `energyReserve.quick` and `energyReserve.stored` are both clamped 0–100 | They are simplified energy reserves, **not** respectively a literal carbohydrate reservoir and dietary-/body-fat pool |
| `proteinSufficiency` is smoothed daily from protein intake versus `proteinBaseline + dailyHighIntensityLoad × proteinLoadScale`; deficiency debt and recovery multipliers exist | A percentage-like adequacy index, **not** current available protein quantity; cannot be relabeled as a protein-reserve bar |
| `energyBalance` is assigned on day rollover from daily energy coverage as a normalized `(coverage−1) × 100` value | Neither a continuously updated signed kcal balance nor something that increases immediately by food's authored calorie amount |
| Daily intake/demand counters reset at rollover; energy reserves, protein sufficiency and deficit history persist | Never display current-day intake (especially a fresh zero) as hunger, depletion or current fuel availability |
| Existing authored global targets: `dailyCalories: 100`, `dailyHydration: 72`, `proteinBaseline: 18`, `proteinLoadScale: 4` | Current **game-scale** balance units, not verified real kcal/grams; no authoritative independent carb or fat daily quota |
| Consumables contain calories, protein, carbs, fat and sometimes hydration/intoxication; lineage and item tag multipliers change their effective contributions | Static authoring mixes game-scale values; a conversion/conservation and unit contract must be decided before a physical nutrient ledger |
| `resolveBodyState` applies energy/protein/hydration/fatigue/intoxication/deficit modifiers to stamina/recovery/action effectiveness | Effects exist, but the full designed digestion, body-fat mass, rate-limited mobilization/storage, sustained muscle adaptation and brain/magic nutrient demand do not |
| `bodyStatePresentation` exposes effective energy, protein sufficiency, hydration, fatigue and intoxication bands | It cannot project a true signed rolling balance and three persistent usable-nutrient reservoirs from current save facts |

The source tests include short underfeeding, multi-day starvation load, water recovery, protein-deficiency progression, difficulty and rest/recovery coverage. **No new test or live gameplay run is claimed here.**

## 3. Desired owner-backed state, not three daily quota bars

An eventual single authoritative metabolism/body-state owner should distinguish these concepts:

| State / proposed role | Sign and scope | UI meaning | Not the same as |
| --- | --- | --- | --- |
| **Energy Balance** | Signed, zero-centered, bounded rolling/short-term net supply after accepted absorption and expenditure; owner-selected unit | Deficit to the left of zero, surplus to the right; `0` means current balance | Today's calories eaten, lifetime debt, total body fat, current Stamina or HP |
| **Available Carbohydrate** | Nonnegative, capacity-bounded usable carbohydrate-derived short-term fuel | How much fast/replenishable substrate is presently available for suitable demands | Percentage of today's carb intake, total calories or remaining Stamina |
| **Available Dietary Fat** | Nonnegative, bounded fat-origin energy/substrate available after digestion, *separate from persistent body fat* | How much dietary fat remains available for ordinary metabolism/storage | Percent of a daily fat target or all stored adipose tissue |
| **Available Protein** | Nonnegative, bounded usable pool or rolling available adequacy measured against legitimate maintenance/repair demand | Capacity to support upkeep/recovery/adaptation; alerts if inadequate | Instant Strength increase, a second energy bar, or current-day intake percentage |
| **Stored Body Fat** | Persisted, nonnegative, long-term reserve/body composition | Secondary expanded reserve band / trend, available only at bounded mobilization rates | The dietary Fat microbar; an instant Stamina battery |
| **Hydration** | Current owner-backed water state | Distinct Water/Drinking indicator beside Nourishment | A carbohydrate/fat/protein component |
| **Intake and digestion in progress** | Durable, time-attributed ingestion and unreleased nutrients | Exact consumption receipt and, if supported, `Digesting`/expected supply | Already available nutrients or already realized Energy Balance |

This is a **target semantic separation**, not a mandate to add each named field in the shared schema now. The implementation contract must choose any normalized basis, storage strategy, provenance, bounds, release cadence and compatibility migration.

A depleted carb, fat or protein microbar means **that specific available pool is low**, not that the body has zero calories, water or long-term fat. A deficit indicator with sizable stored body fat can be legitimate because mobilization is rate-limited.

## 3A. Human-reference calibration and simple lineage variation (2026-10-21 refinement)

**Decision for the design proposal:** use an ordinary **Human** as the normalized physiological reference, then apply modest, explainable *fantasy lineage* multipliers and individual/activity context to that shared model. Do **not** copy real-world kilocalories, grams, dietary percentage quotas, organ-level metabolic formulas or a single real-world “average person's diet” into game content or the persistent UI. The Human reference may be calibrated *offline* against broadly established human relationships, then expressed in consistent, intentionally simple **game-scale energy and nutrient units**. One authoritative owner performs every conversion.

The reason to use real human physiology as the starting reference is **behavioral plausibility**, not numerical fidelity. Human energy expenditure reflects resting needs, body size/composition, food processing and activity; macronutrients have different energy, maintenance and recovery uses. The human baseline is a *reference character profile*, not a claim that every real adult has identical needs. Good external calibration sources include [FAO/WHO/UNU Human Energy Requirements](https://www.fao.org/4/y5686e/y5686e00.htm), [National Academies Dietary Reference Intakes for Energy (2023)](https://www.ncbi.nlm.nih.gov/books/NBK591031/), and [National Academies macronutrient ranges (2023 review)](https://www.nationalacademies.org/read/27957/chapter/5). These references inform **relative directions and rough order of magnitude only**, not mandatory in-game targets. Their human “race/ethnicity” categories must never be used as a basis for fantasy lineage bonuses.

**Already implemented:** [`player-origins.ts`](../../packages/shared/types/src/player-origins.ts) defines default metabolic coefficients at `1.0` and uses that default for `lineage.human`, with small authored Human food-tag preferences; Elf, Dwarf, Orc, Gnome, Halfling, Dark Elf, Goblin, Troll and other authored playable lineages have small deviations in absorption, protein recovery, rapid-energy handling, fat handling, water retention and deficiency sensitivity. This is an **existing game-specific lineage profile**, not a validated new reserve-availability model. Do not replace these coefficients, change them to imagined biological “truth,” or multiply them twice during migration without tests.

**Simple authoring hierarchy, subject to owner decision:**

1. **Human reference:** one normalized basal/sleep/metabolic response profile, with standard available nutrient capacities, digestion/release and fuel substitution semantics expressed in game units; reference values are calibratable constants, not a player-facing dietary chart.
2. **Individual demand:** body size/build or other **already owned and validated** character inputs when useful, elapsed time, physical intensity, recovery, environment and conditions; do not assume every stat, level, sex or resource pool must alter energy needs.
3. **Playable lineage multipliers:** modest modifiers for supported biological fantasy differences in fuel use, digestive release, protein recovery, hydration and reserve response; each must have an authored explanation and observable test. Variation in daily energy need should not be automatically inferred from a race's HP, MP or class reputation.
4. **Special workloads:** future magical exertion, unusual physiologies or sustained rituals are *activity-owner inputs*, not a universal Intelligence tax or mandatory fatty-food benefit. Keep MP and metabolism separate unless a specific accepted magic contract connects them.

**Keep it deliberately small:** the initial decision should prefer a few owner-owned fuel pools, one signed rolling Energy balance, one stored-body-fat reserve and a minimal timed digestion queue over a full biochemical simulation, hormonal mechanics, per-organ models, exact amino-acid accounting or arbitrarily separate need meters. An individual nutrient pool has a **positive amount and capacity**, not an artificial daily quota. Energy is a signed **balance**, not a fourth permanently positive resource. The three nutrient strips describe available reserves; their **visual fill need not encode a human daily consumption ratio**.

**Calibration and acceptance:** use a few reference scenarios rather than an encyclopedia of real numbers: normal Human awake/resting and asleep, routine travel, short intense effort, high-protein/low-energy intake, abundant energy/low-protein intake, surplus over time and moderate deficit with stored body fat. Repeat with at least two contrasting fictional lineages at comparable body/build and activity; show an explainable difference without wildly destabilizing food consumption. Require an authored deterministic cost/conservation rule and old-save compatibility before publishing real bars. If relative race profiles or source units cannot be reconciled, publish the smallest held owner decision rather than manufacture new physics.

## 4. One conserved, time-aware metabolic pipeline

```text
selected food/amount -> accepted inventory decrement + intake receipt
                      -> digestion and absorption over accepted elapsed time
                      -> released available carbohydrates / dietary fat / protein
                      -> energy supply and maintenance/repair allocations
time + basal functions + activity/magic/environment + recovery demand
                      -> shared metabolic expenditure
supply - expenditure  -> zero-centered short-term Energy Balance
                      -> accessible short-term fuel / continued recovery support
                      -> rate-limited long-term body-fat storage (sustained surplus)
                      -> rate-limited body-fat mobilization (deficit)
                      -> uncovered pressure if supply/mobilization insufficient
                      -> fatigue, degraded recovery, protein pressure,
                         and only later prolonged lean-condition/structural effects
```

**At the instant of eating:** the consumed amount and its authored calories/macros must be recorded and acknowledged immediately; the player's available pools and Energy Balance receive only the **released/absorbed** portion when the metabolism owner advances. A temporary projected/ghost `Digesting +…` indicator can acknowledge a meal without falsely showing all consumed calories already available. Do not put both the full food-calorie number in the balance meter *and* the same calories in nutrient pools as freely spendable independent energy.

**Unit and conservation gate:** before implementation, reconcile authored `calories`, `carbs`, `fat` and `protein` units, lineage and tag multipliers, absorption losses, allocations, reservoir movement, body-fat storage and expenditure. No double counting of a calorie through separate current intake and macro credits; no negative nutrient pools, unbounded surplus, instant fat refill, profitable save/reload or arbitrarily close-to-zero action replay. Record sources, times and conversion receipts under one owner.

**Rollover:** daily *intake totals* may roll over for accounting, but an available-nutrient pool, short-term energy balance, body-fat reserve, pending digestion and accumulated injury/deficiency cannot be reset as if the character became empty at midnight. Energy may normalize by an owner-approved rolling window/short-term buffer; never accumulate infinite lifetime deficit.

## 5. Substrate use and consequences

1. **Baseline and sleep:** basal metabolism operates continuously during rest and sleep and may draw from a **mixture** of available substrates plus gradually mobilized body fat, rather than a rule that sleep always consumes only dietary fat. Sleep also enables recovery where conditions support it.
2. **Physical activity:** heavier/burst exertion increases total expenditure and the importance of readily accessible carbohydrate fuel; prolonged lower-intensity effort can draw from mixed sources. A low carb pool may constrain sustained or intense activity before total energy stores are empty. Do not subtract literal carbs per Stamina point unless a separate shared expenditure contract authorizes that conversion.
3. **Dietary fat to body fat:** after needs, digestion costs and the short-term buffer are accounted for, sustained surplus can enter **stored body fat**, whether the excess originated from fat or other nutrients. Excess carbs do **not** instantaneously or losslessly become body fat after one action; choose a deterministic, time-limited storage policy.
4. **Stored body fat to metabolic support:** a modest or severe deficit can mobilize body fat at an accepted bounded rate. It can support ongoing expenditure and subsequent recovery, **never** grant immediate Stamina. Uncovered demand produces contextual strain.
5. **Protein:** maintenance, recovery and adaptation compete for appropriately available protein. Building muscle requires **stimulus + sufficient energy + protein + recovery + elapsed time**. Protein can contribute to energy only through an explicitly reconciled energy ledger, not as a free second calorie source.
6. **Atrophy:** sustained energy inadequacy, protein deficiency, disuse, illness or excessive recovery pressure may cause progressive lean-condition decline. Carb shortage can contribute through inadequate usable energy for strenuous activity but **an empty carb bar alone must not automatically trigger structural atrophy** when energy and protein needs are otherwise met.
7. **Ancestry, difficulty and physiology:** preserve lineage-specific metabolic effects and difficulty-dependent pressure, without altering static food identity. Balance must avoid constant meal-by-meal micromanagement as the mandatory default.

These are **behavioral boundaries**; rates, substitution priorities, thresholds, reserve caps, dynamics, physical calorie units, atrophy time constants, difficulty scalars and treatment of specific nutrient deficiencies remain decision gates.

## 6. Magical exertion and intellectual work: explicitly proposed extension

The user-directed gameplay possibility is that **sustained magically demanding work** may significantly raise metabolic expenditure and may make high-energy/fat-rich provisions strategically relevant to mages. This is **a candidate fantasy-game demand profile**, not an established human brain-energy law and not current code authority.

- **Intelligence attribute** alone must not automatically increase hunger or fat use. Ordinary study or thinking is not equivalent to high-intensity physical work.
- **Mana** remains a separate resource. The magic/ritual/action owner may one day supply an explicit, observable `metabolicDemand`/duration/intensity profile, just as existing travel callers provide metabolic context. The shared metabolism owner alone determines nutrient allocation and body effects; the spell itself cannot secretly mutate carbohydrate/fat/protein.
- A specialty mage could prefer fatty foods or sustained fuel under a **specific accepted magical physiology rule**, but a forced `all spellcasting burns dietary fat` policy would be a new balance/content decision. The consumer must distinguish ordinary cognition, concentration/fatigue, magical strain, duration, rest and any magic-specific energy source.
- Do not implement spell-derived calorie loss, brain ketone rules, MP↔kcal conversion, Intelligence-based metabolic coefficients, magical-fat requirements, or special mage diet benefits from this documentation alone.

## 7. Quick-glance nourishment UI

**Location:** a compact, accessible Nutrition/Nourishment affordance adjacent to HP/MP/ST and distinct Water within the top shell. It is not another full-height Character Overview `Core Stats` block. If space is limited, collapse it behind one labeled icon with a severity affordance; never squeeze the three primary resource bars to illegibility.

**Collapsed structure:**
- **Energy**: short **zero-centered signed bar** with a conspicuous midpoint; deficit extends left, surplus right. Owner-projected `Deficit / Balanced / Surplus` and an actual signed numeric value (or an honest qualitative range under difficulty settings). Meter width is a **visual window**, not a limit on game balance; values exceeding it retain accurate text/overflow indication.
- **Food reserve microbars**: three vertically stacked, fixed-width strips in order `Carbs`, `Fat`, `Protein`. Each represents **current positive usable availability / its own owner-defined usable-capacity or healthy-band display ceiling**, *not* proportions of an intake mix or three identical daily requirements. Distinct shapes/icons and accessible names supplement subdued colors.
- **Water**: separate, owner-backed hydration meter/icon, not a fourth macronutrient strip.
- **Meaningful status**: surface `Energy deficit`, `Protein-limited recovery`, `Dehydrated`, `Fatigued` or `Intoxicated` only when supported by owner facts. Do not show neutral `Condition: Stable` or invent positive/negative effects from visual fill.

**Expanded inspector:**
- Actual current balance and what is influencing it: available/released energy, ongoing baseline/action cost and uncovered deficit **only to the precision the owner exposes**.
- Current available carb/fat/protein amounts or bands; selected capacity/reference for each; projected time-to-exhaustion only when owner-supported.
- Separate pending digestion/intake receipt, body-fat reserve (if exposed), actual protein adequacy/recovery constraint, hydration and relevant warnings.
- An explicit distinction between `Available fat` and `Stored body fat`; a character can have low dietary fat yet a substantial long-term reserve.
- No hardcoded percentage mix, daily carb/fat target, unowned hunger/satiety gauge, invented calorie equivalence or duplicate top-bar HP/MP/ST.

**Accessibility:** keyboard/focus tooltips and openable inspector, no color-only meaning, semantic labels including which reserve is low, tooltips that do not require pointer hover, reduced motion, narrow viewport fallback and identifiable owner-backed source of numerical precision.

**Sample decisions made legible:**
- `Energy: deficit; Carbs low; Protein adequate`: replenish energy, possibly choose useful carbohydrate provision for upcoming exertion.
- `Energy: surplus; Protein low`: plenty of usable energy is **not** sufficient tissue-repair nutrition; seek protein-bearing food.
- `Energy: deficit; Fat intake low; Body fat available`: buffered fat mobilization may help over time but cannot fuel an immediate burst.
- `Energy: balanced; Protein adequate; Carbs low`: ordinary activity may remain possible while sustained high-intensity performance is constrained if the owner supports that consequence.

These are **illustrative interpretation rules**, not claims that the current engine can truthfully render each today.

## 8. Implementation decision gates and acceptance matrix

Before any game/UI runtime implementation, decide and record:

1. **Exact owner state**: game-normalized Human baseline and existing lineage deltas, live versus aggregate pools, positive amounts/caps, pending digestion and meal receipt, body-fat reserve, stable ids, save/version migration and old-snapshot fallback.
2. **Metabolic accounting**: food-calorie/macronutrient consistency, absorbed energy, fuel-specific availability, expenditure, storage/mobilization, no double credit, rounding and deterministic repeat/reload.
3. **Timing**: consumption admission, release curve and daily rollover, tick versus rest/travel duration, long actions, variable difficulty and any legitimate account/run overrides.
4. **Allocation rules**: baseline versus burst demand, available carbs/dietary fat/stored body fat/protein usage, substrate substitution, overflow, caps, deficit consequences, maintenance/recovery and atrophy onset.
5. **Producer/caller contracts**: travel, rest, activity, combat and later magic each provide *duration/physical/metabolic demand facts* to one shared owner; UI never privately spends nutrients.
6. **Human-reference authoring reconciliation**: calibrate broad human relationships outside the gameplay data, then retain one consistent game-unit basis for nine consumables, existing calorie/protein/hydration rules, Human `1.0` coefficients and small authored lineage/food-tag differences; no direct import of real-world kcal, grams or diet percentages.
7. **Projection/detail permissions**: actual signed balance, three available pools, hydration, stored fat, severity and pending digestion exposed through one read-only view-model with distinct metadata for `known`, `estimated` and `not available`.
8. **Selected-client proof**: baseline/deficit/surplus, high-calorie low-protein food, carb depletion with exercise, protein recovery, hydration and food selection, rest, day rollover, save/restart, narrow/keyboard access, difficulty alternatives and no false normal-state badges.

Required regression suite includes food receipt/inventory decrement exactly once; digest-release conservation; travel/rest tick continuity; daily rollover not zeroing usable pools; no instant stamina from fat or food; rate-limited fat storage/mobilization; sustained protein and energy deficiency before adaptation loss; lineage/difficulty variance; save/deserialize/replay/idempotency; `old save` migration; conditional known/estimated/unknown UI; selected owner/caller/preview parity.

**Sequencing recommendation (not an installed task):** focused owner-contract/units decision → bounded metabolism state+save+test consumer → truthful read-only projection → compact Nourishment control → selected UI/restart and independent acceptance. Do not attach this to DEV-0.7.2.13, promote Game `0.1.1-prealpha`, reroute the live Codex prompt, enact a broad Character UI rework, or assume completion of the held magic and body-composition systems.

## 9. Open product choices that cannot be inferred from current authority

- **Choose game-normalized units, not literal Earth kcal/grams.** What stable game-unit basis, horizon and reset/buffer policy makes the signed balance intelligible, comparable and conserved?
- Which intake is instantly *registered* versus *absorbed*, which macro subpools have time-deferred release, and how are existing simplified quick/stored energy saves migrated?
- Which Human-reference reserve limits, substitution rates and small race/lineage deltas are physiologically plausible *in relative shape* and fun at game timescales? When should the UI say `Low` rather than merely show an empty strip?
- How do independent protein-demand and activity/skill-growth policies connect without forcing a high-protein diet on every character?
- Does a magic-specific physiology profile privilege dietary fat, mixed energy, or another fictional resource? Who owns the cost, and what are its observable consequences?
- Which difficulty/accessibility setting shows numeric ranges, broad qualitative bands, or conceals optional detail without hiding serious actionable danger?
- How should long-term body fat appear in a deeper character/body panel without confusing it with the short-term Fat microbar?

Until decided, these remain **explicit held decisions**, not invented numbers or new code.

**Proposed next owner-review prompt (not installed):** [Human-Normalized Metabolic Reserve Owner Contract And First Safe Slice](../dev/proposed-human-normalized-metabolic-owner-codex-prompt-2026-10-21.md). It is an isolated post-/parallel-combat handoff, not a replacement for the current DEV-0.7.2.13 prompt. Read and reconcile with live `master` and review the draft PR before using.

## 10. Disposition

**NOURISHMENT_PRESENTATION_INTENT_CAPTURED; METABOLIC_RESERVE_CONTRACT_NOT_IMPLEMENTED; NO_RUNTIME_OR_GAME_VERSION_AUTHORIZATION.**

This document is meant to be reviewed alongside the accepted prior metabolic decisions and incorporated through a separately scoped owner-driven implementation route. It changes *design navigation/intent*, not simulation truth.
