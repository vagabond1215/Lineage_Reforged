# Normalized Metabolic Units, Food Conversion, And Save Migration: Connector Preflight

Date: 2026-10-21. Scope: `vagabond1215/Lineage_Reforged`, source baseline `master` `f56229dde859b9374a54368bd8a8fd2a9872daa1`. Status: **read-only source inventory published as documentation; no numerical owner approval, no save migration, no runtime/UI tests or modification**. This is a Codex preparation packet for the next **Normalized Metabolic Units, Food Conversion And Save Migration Decision**, not a substitute for that decision.

## Authority and branch reconciliation

- Read [the isolated Human-normalized owner contract](https://github.com/vagabond1215/Lineage_Reforged/blob/codex/human-metabolic-reserve-contract/docs/design/human-normalized-metabolic-reserve-owner-contract-2026-10-21.md) at commit [`80c97049`](https://github.com/vagabond1215/Lineage_Reforged/commit/80c970493c29f2f076312cad07aaf0aca121c1c7) **before** deciding units. It reports `STRUCTURAL_CONTRACT_DEFINED; IMPLEMENTATION_HELD_ON_CALIBRATION_AND_SAVE_MIGRATION`; it is on a separate branch and not yet merged or formally accepted.
- The [reserve-based nourishment design proposal](metabolic-reserve-and-nourishment-quick-glance-design-decision-2026-10-21.md) in draft PR #6 is presentation intent, not authorization for engine constants, save schema, metabolic effects or a full UI rebuild.
- Draft PR #5 holds the UI source-index work. Installed [DEV-0.7.2.13](../dev/current-codex-prompt.md) remains the combat result-disclosure route on `master`. Do not change its current prompt/output/handoff or claim the branch contracts are merged.
- Latest checked `master` head `f56229dd`. The isolated Codex branch is **one documentation-only commit ahead** of this base; the nutrition draft branch has different documentation-only changes. Compare both refs to live HEAD before any integration. Retained protected/held branches remain out of scope.

## Exact authored food-profile inventory

Source: [`packages/content/base/items/consumable_profiles.json`](../../packages/content/base/items/consumable_profiles.json). Values below are **authored game units**, *not* literal Earth kcal/grams, user-intake recommendations or an approved conversion. No new item quantities, per-meal ratios or nutrient quotas are established.

| Consumable profile | Authored Calories | Protein | Carbs | Fat | Hydration | Additional |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `consume.ration_bundle` | 24 | 6 | 10 | 5 | 4 | Eat |
| `consume.traveler_ration` | 22 | 5 | 9 | 5 | 3 | Eat |
| `consume.trail_meal` | 30 | 7 | 12 | 6 | 5 | Eat |
| `consume.bread_loaf` | 18 | 2 | 12 | 1 | 1 | Eat |
| `consume.game_stew` | 34 | 10 | 9 | 7 | 10 | Eat |
| `consume.seafood_stew` | 32 | 10 | 8 | 6 | 11 | Eat |
| `consume.inn_hearty_meal` | 38 | 11 | 13 | 8 | 12 | Eat |
| `consume.tavern_fish_plate` | 28 | 9 | 7 | 5 | 8 | Eat |
| `consume.ale_cask` | 10 | 0 | 5 | 0 | 8 | Drink; intoxication 22 |

**Do not infer calories from the arithmetic sum of macro numbers.** `consume.bread_loaf` has Calories 18, Protein 2, Carbs 12, Fat 1; `consume.inn_hearty_meal` has 38, 11, 13, 8. Their macronutrient numbers are not in calibrated Earth grams, and their calories cannot be reconstructed by an unaccepted `4/4/9` formula. The current structural proposal treats Calories as the **single food-energy authority** and the three macros as normalized nutrient quantities; the exact allocation/conversion under lineage/item bias is the next owner decision.

## Current game-balance rules and physiology

Source: [`global_rules.json`](../../packages/content/base/game/global_rules.json), `rule.body_state_balance` version 1:

| Existing rule | Current value or policy | New contract caution |
| --- | --- | --- |
| `targets.dailyCalories` | 100 | Provisional **Human scale anchor only**, not literal kcal/day or an accepted basal demand formula |
| `targets.proteinBaseline` | 18 | Baseline protein adequacy target, not an available protein stock |
| `targets.proteinLoadScale` | 4 | Extra required protein per daily high-intensity load, not reserve decay per action |
| `targets.dailyHydration` | 72 | Reporting/coverage rule; separate hydrationLevel has its own per-tick losses and gain |
| `energy.quickWeight/storedWeight` | 0.6 / 0.4 | Abstract energy band calculation, not physical carb:fat ratio |
| `quickGainPerCalorie` / `storedGainPerCalorie` | 0.15 / 0.1 | Current immediate benefit multipliers, **not** conserved macro-to-energy conversion factors |
| `protein.smoothing` | 0.35 | Daily sufficiency smoothing, not a protein digestion rate |
| `quickDecayByIntensity` | low 1.2, moderate 2.4, high 4.1, extreme 6.4 | Existing abstract per-tick drain, not yet a basal NEU allocation |
| `storedDecayByIntensity` | low 0.35, moderate 0.7, high 1.3, extreme 2.2 | Existing abstract per-tick drain, not rate-limited body-fat mobilization |

From [`body-state.ts`](../../packages/engines/player-engine/src/body-state.ts): `effectiveCalories = profile.calories × lineage.calorieEfficiency × itemTagBias`; `effectiveProtein / Carbs / Fat` each use their separate lineage coefficients and the same tag bias. That bias is an average of the highest two applicable item-tag multipliers, bounded to 0.9–1.1. The engine currently increases `energyReserve.quick` by `effectiveCarbs + effectiveCalories × 0.15`, and `energyReserve.stored` by `effectiveFat + effectiveCalories × 0.1`; both clamp 0–100. **Existing instant grants must not be silently reinterpreted as additive energy and independently spendable fuel in the proposed owner.**

`advancePlayerBodyState` currently applies time/intensity-based quick and stored reserve drain, daily energy demand, hydration/fatigue changes and separate recovery support. `rollBodyStateDay` computes the **previous day's** caloric/protein coverage and resets daily intake counters, with `energyBalance = (coverage−1) × 100`, rather than tracking continuously available signed fuel balance. Calorie demand based on the 100-unit anchor must not also be charged through a newly invented basal per-tick rule without a deliberate replacement/migration boundary.

`applyRecoveryContextPerTick` can add `mealSupport` as abstract quick/stored energy and daily calories/protein without an item decrement, carbohydrate/fat record or durable food origin. Owner must classify this as `legacy_support`, provisioned food with provenance, or a separated transitional modifier **before** representing these grants in the conserved food ledger.

## Existing lineage reference facts

Source: [`player-origins.ts`](../../packages/shared/types/src/player-origins.ts). The default and general Human metabolic coefficients are `1.0`; Human food tag biases for grain/protein/fruit remain non-neutral. Illustrative **already-authored** differences, not new target conversion coefficients:

| Lineage | Existing relevant coefficients | Integration case |
| --- | --- | --- |
| Human | global coefficients 1.0; grain 1.04, protein 1.02, fruit 1.02 food tag biases | Baseline plus explicit tag influence |
| Elf | carb-to-stamina 1.08, hydration retention 1.08 | Same meal/elapsed work as Human |
| Dwarf | protein recovery 1.08, fat-to-reserve 1.08, hydration retention 1.05 | Fat/protein handling without duplicate food energy |
| Orc | protein recovery 1.06, fat-to-reserve 1.04, hydration retention 0.96 | Contrast high physical profile without inferring demand from HP |
| Gnome | calorie efficiency 0.98, carb-to-stamina 1.04, protein recovery 0.98 | Difference in utilization without double-applying multipliers |
| Halfling | calorie efficiency 1.03, carb-to-stamina 1.08, protein recovery 0.98 | Small efficiency delta; same human reference |

Other authored lineages and mixed ancestry require the same single-engine policy; `player-origins.ts` interpolates ancestry profile coefficients where supported. No unsupported base metabolic demand may be inferred from MP, Intelligence, race labels alone, or a future mage diet proposal.

## Save and time authority inventory

Source: [`PlayerBodyState`](../../packages/shared/types/src/contracts.ts), [`SaveSnapshot`](../../packages/shared/types/src/contracts.ts) and [`body-state.ts`](../../packages/engines/player-engine/src/body-state.ts).

- Persisted current body state contains `energyReserve.quick/stored`, rollover `energyBalance`, `proteinSufficiency`, `hydrationLevel`, `fatigue/fatigueDebt`, `intoxicationLevel`, the daily intake and activity demand counters, starvation/protein-deficit loads, `lastAdvancedTick`, `lastDailyRolloverDay` and a resolved read model.
- It **does not** contain a digestion queue, nonnegative currently available nutrient subpools, item-origin food consumption receipt, separate stored body-fat energy or a short-term signed energy **ledger**. An old snapshot cannot tell what nutrient composition is *actually still available* or how much stored body fat exists.
- The Inventory consume caller `consumeInventoryItem` decrements one inventory stack and applies `applyConsumableToBodyState` to the snapshot in the same call. This is a real entry point, but the new cross-caller receipt identity, retry policy and replacement save schema still need a contract.
- Time is advanced in exploration, travel, survey/activity and rest through the body-state owner; nearby combat has a clock advance not yet connected to that same metabolic path, per the separately verified Codex owner-contract audit. Reverify exact currently checked source before changing any caller.
- **Migration choice cannot be guessed from old gauges**: choose a versioned default/provisional state, explicit compatibility dual-read, or a bounded one-time migration, and label any missing historical data as **unknown** rather than displaying fictional current nutrient stocks.

## Fixed-point examples the next Codex pass must work (not preselected outcomes)

1. **Bread versus hearty meal:** calculate one accepted meal receipt for `consume.bread_loaf` (18/2/12/1) and `consume.inn_hearty_meal` (38/11/13/8), with Human tag modifiers. Show the same released NEU total cannot be spent twice through an available Carbs pool.
2. **Ale without protein/fat:** 10 NEU, 0 protein, 5 carbs, 0 fat, hydration 8, intoxication 22. Confirm zero Protein/Fat does not create a negative pool or infer nonexistent protein adequacy.
3. **Human, Elf, Dwarf/Orc with identical input:** author-specific efficiency applied once, without creating extra calorie credit through independent macro coefficients.
4. **Midnight:** daily counters roll over, while digestion, existing usable pools and signed rolling balance retain their own duration semantics.
5. **Rest with abstract mealSupport:** decide provenance/compatibility, not an invented physical food serving.
6. **Repeated selected consumption or duplicate tick:** inventory decremented exactly once and metabolism advanced exactly once; Save/restart/readback cannot release a meal twice.
7. **Deficit with body-fat reserves:** rate-limited draw can cover modest demand over elapsed time, not instant Stamina or a full one-tick refund.
8. **Old snapshot:** no fictionally known macro/body-fat quantities from `energyReserve.quick/stored`; correct legacy effects and compatibility preserved.

## Pending numerical/product decisions for owner acceptance

The structural direction is already expressed in [the Codex owner contract](https://github.com/vagabond1215/Lineage_Reforged/blob/codex/human-metabolic-reserve-contract/docs/design/human-normalized-metabolic-reserve-owner-contract-2026-10-21.md). The next run must explicitly decide or hold: NEU↔NNQ allocation/conversion and truncation, digestion release rate, basal and sleep expenditure in 24-tick game day, short-term balance horizon, usable macro caps, long-term body-fat initial state and rate bounds, protein maintenance allocation, difficulty impact, individual/lineage order, older SaveSnapshot compatibility, abstract meal support and exactly-once caller behavior.

**No new numeric values or save migration have been accepted here.** Do not turn this packet into a green-but-isolated parallel metabolism. A subsequent runtime pass needs owner-backed pre-edit failing tests and actual reader/caller/save verification.

## Validated scope

Connector read-through inspected authored foods, global rule, actual consumption formula, state shape, consumption caller and published Codex contract. Source numbers were copied as current authored values. No local tests/build/typecheck were possible via connector; Codex's earlier 51/51 is **historical current-behavior evidence only**, not validation of the target. This document may be merged or re-authored after independent source review, but is not approval to implement new simulation, nourishment HUD, Home, magic physiology, combat features or Game-version promotion.
