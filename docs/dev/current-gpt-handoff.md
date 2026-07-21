# Current GPT Handoff

## Status

- `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` is complete and validated.
- Original culinary research completed at commit `cd12ee015b11d96d93df05cc2911c7525e1133c2`.
- The first culinary results repair completed at commit `9b73c80e5fc28b3f0951a0d308c0f693ce1493c5` and remains accepted documentation input.
- The culinary preparation/portion/meal integration audit completed at commit `a78b10714b5a6e587989d9c52f02f0d66fb9ea6a`.
- The bounded integration-results repair completed at commit `b92b1344613669114641230a2e67f8ed77e7ae00`.
- GPT/human inspection accepts the repaired percentage, quantity, ration, food-state, preparation-method, container, multi-serving, mystery-assortment, stock-window, contextual-quality, historical-source, and cross-domain directions.
- One final four-file documentation repair remains active for command ownership, generic item-instance dependencies, canonical nutrition, metabolism/body composition, protein recovery, muscle adaptation, metadata, and contextual action surfaces.
- The active prompt is `Culinary Integration Final Contract, Metabolism, Protein, And Action-Surface Repair Audit` in `docs/dev/current-codex-prompt.md`.
- The queued research gate is `GPT-DR.nutrition.protein-recovery-muscle-adaptation` in `docs/dev/queued-protein-recovery-muscle-adaptation-deep-research-prompt.md`.
- The research gate is queued, not completed, and does not replace the active Codex repair.
- `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains paused, not canceled, and recoverable from the held prompt and blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

## Controlling Decisions

Most specific current authorities:

1. `docs/design/protein-recovery-muscle-adaptation-and-nutrition-integration-decision.md`;
2. `docs/design/fat-mobilization-body-stat-and-climate-effects-decision.md`;
3. `docs/design/metabolic-energy-stamina-fat-storage-and-atrophy-decision.md`;
4. `docs/design/contextual-action-surfaces-inventory-crafting-and-trade-decision.md`;
5. `docs/design/culinary-ration-serving-preparation-and-container-labeling-decision.md`;
6. `docs/design/artisan-mystery-assortment-stock-and-quality-decision.md`.

The queued research prompt may correct factual assumptions and recommend candidate abstractions, but it cannot override repository owner boundaries or become implementation authority without a later integration decision.

## Canonical Nutrition And Metabolism Direction

### Nutrition truth

- Canonical authored nutritional energy is kilocalories unless a later durable exact-conversion contract is accepted.
- Live `dailyCalories: 100` is compatibility-only.
- Nutrients derive from physical amount consumed and per-basis values.
- Percentages in preparation are allocation/composition controls, not calorie points.
- Static nutrition profiles own per-basis kcal, protein, fat, carbohydrate, hydration, and later accepted digestion/satiety descriptors.
- Consumption emits an intake result; it does not directly mutate long-term body state.

### Metabolic pipeline

```text
food consumed
  -> digestion pool
  -> usable absorbed kilocalories over time
  -> continuous metabolic balance
       -> basal body-function expenditure
       -> activity expenditure
       -> Stamina-restoration support
       -> deficit or surplus
            -> sustained surplus may become rate-limited fat storage
            -> mild and deeper deficits draw on rate-limited reserves
            -> uncovered prolonged deficit may cause fatigue and atrophy
```

Keep separate:

- consumed intake;
- digestion and absorption;
- zero-centered metabolic Energy;
- Stamina;
- hunger and satiety;
- hydration;
- fat reserve and body mass;
- protein availability;
- lean condition and muscle adaptation;
- temporary fatigue penalties;
- reversible short-term condition loss;
- structural atrophy;
- persistent or permanent physical-stat consequences.

### BMR and expenditure

Accepted candidate posture:

- generated base BMR approximately `1,800-2,000 kcal/day`;
- deterministic seeded variation;
- small bounded Strength, Constitution, and Vitality effects;
- ordinary active daily expenditure around the user-authored `2,500 kcal/day` anchor;
- sustained high-intensity labor or loaded military activity around the user-authored `3,500-4,000 kcal/day` anchor;
- continuous expenditure during sleep, waiting, travel, crafting, combat, and other time advancement;
- candidate baseline `BMR / 1,440` kcal per minute;
- action expenditure based on duration, intensity, context, and small deterministic variance;
- no activity domain creates its own private calorie ledger.

Exact values beyond these anchors remain open.

## Fat Mobilization And Climate Direction

- Fat is a normal long-term reserve, not an emergency-only starvation resource.
- Mild deficits begin drawing a bounded amount from usable fat reserve when absorbed energy and the short-term reserve are insufficient.
- Fat mobilization is rate-limited by elapsed time.
- Fat cannot instantly refill Stamina or cover unlimited burst demand.
- High short-term demand may exceed fat-mobilization capacity even when significant reserve remains.
- Fat storage is also smoothed and rate-limited.
- Fat contributes to Constitution/Vitality-adjacent resilience through derived diminishing-return effects, not unlimited base-stat bonuses.
- Functional reserve provides the largest marginal benefit.
- Additional reserve provides diminishing benefit and increasing heat, hydration, burden, mobility, and Stamina tradeoffs.
- Useful reserve marginally helps cold resilience, but clothing, shelter, fire, dryness, wind protection, activity, and acclimatization remain more important.
- Elevated reserve worsens heat/humidity management in combination with temperature, sunlight, ventilation, clothing, armor, burden, and exertion.
- One authoritative body-state resolver owns fat storage, mobilization, and climate interaction.

## Protein Recovery And Muscle Adaptation Direction

### Four required factors

Muscle repair and development depend on four distinct requirements:

1. meaningful physical stimulus;
2. protein availability;
3. energy availability;
4. rest and elapsed recovery time.

Protein alone does not create muscle or grant Strength.

### Physical-loss distinctions

Keep separate:

1. **acute exertion fatigue** — immediate Stamina/performance loss, usually recovering over minutes or hours;
2. **recovery debt** — accumulated incomplete recovery over hours or days;
3. **reversible short-term lean-condition loss** — recoverable decline after underfeeding, disuse, illness, or repeated recovery failure;
4. **structural atrophy** — meaningful long-term tissue loss requiring rehabilitation and substantial time;
5. **base-attribute change** — prohibited without a later explicit attribute contract.

Protein is most relevant to tissue repair, maintenance, and recovery from reversible condition loss. It is not an instant cure for Stamina depletion, dehydration, sleep deprivation, heat/cold injury, disease, untreated injury, or magic/toxin effects.

### Protein and energy interaction

- Moving from protein deficiency to adequacy matters more than moving from adequate to excessive intake.
- Adequate protein during a mild calorie deficit may help preserve lean tissue.
- High protein cannot fully compensate for a large sustained energy deficit.
- Adequate calories with poor protein may preserve Energy while impairing recovery and adaptation.
- High protein with inadequate calories may reduce but not eliminate lean-tissue loss.
- A modest energy surplus may support adaptation, but large surplus should not create proportional muscle gain and may primarily become fat.
- Exact protein amounts, timing, quality, digestibility, and player-visible precision remain research questions.

### Slow adaptation

```text
meaningful loading or activity
  -> physical stimulus and tissue stress
  -> recovery demand
       + protein
       + energy
       + hydration/rest
       + elapsed time
  -> repair
  -> restoration of reversible loss
  -> slow muscle-condition adaptation
```

- Repeated heavy work, travel under load, climbing, rowing, farming, construction, mining, military drill, combat exertion, or deliberate training may provide stimulus when later owners describe it.
- Not every action provides useful stimulus.
- Activity without recovery can cause fatigue, injury risk, or deterioration instead of gain.
- Muscle development is slow, rate-limited, and subject to diminishing returns.
- Trivial micro-actions cannot farm adaptation.
- High-condition characters require more demanding and specific stimulus.
- Prolonged inactivity may cause detraining, but short rest does not.
- Previously developed condition may recover faster than first-time gain only if the queued research supports a manageable rule.

### Attribute boundary

- Muscle condition primarily affects effective physical output and derived values.
- It does not silently rewrite base Strength.
- Constitution and Vitality may affect recovery tolerance through bounded owner-approved modifiers.
- The model distinguishes base attributes, temporary condition penalties, reversible body-condition modifiers, persistent adaptation modifiers, and injury/illness/climate/equipment effects.

## Contextual Action Direction

- Prefer contextual item-, entity-, workplace-, and location-driven actions over permanent global Food, Crafting, Trade, or character-action menus.
- Inventory is an invocation surface, not the owner of nutrition, crafting, inspection evidence, trade, or body state.
- Ready items expose Eat or Drink from the selected item.
- Generic item commands own Open, Close, Seal, Split, Combine, Pour, Transfer, Store, Drop, Label, and held-item inspection.
- Crafting/process owners execute Prepare, Cook, Preserve, and other transformations from selected materials, tools, recipes, and accessible workplaces.
- Give/Offer starts from party or NPC interaction.
- Buy/Sell/Barter starts from merchant or storefront interaction.
- Local travel and location actions remain travel/activity-owned.
- Show only contextually valid actions or selectively useful unavailable actions with concise reasons.

## Rations, Servings, And Assortments To Preserve

- Accepted ration names: Small Ration, Medium Ration, Large Ration, Party Ration, Large Party Ration.
- Size labels are packaging conventions, not exclusive eater/day counts.
- Provisions are broader multi-container logistics.
- Selected serving vessels determine prepared-serving count.
- Uniform Servings is default; Individual Servings permits per-vessel allocation.
- Source allocations cannot exceed physical amounts.
- Mystery assortments resolve and persist before opening.
- Direct known lots coexist with mystery assortments.
- Clearance, Standard Artisan, and Select candidate tiers remain documentation-only balance direction.
- Contextual quality, finite stock windows, honest-clearance/fraud separation, cross-domain producer reuse, non-exhaustive container vocabulary, and mutable custom labels remain accepted.

## Owner Matrix

| Concern | Owner direction |
| --- | --- |
| Static kcal/protein/macros/hydration | Static nutrition profiles |
| Meal aggregation | Consumption/meal resolver |
| Digestion and nutrient availability | Body-state nutrition/metabolism owner |
| BMR and zero-centered Energy | Body-state/metabolism owner |
| Short-term reserve and fat conversion | Body-state/metabolism/body-composition owner |
| Duration/intensity/loading | Activity/travel/combat/crafting/work/training owners |
| Shared caloric expenditure | Body-state/activity expenditure resolver |
| Immediate exertion capacity | Stamina/body/activity owner |
| Recovery debt and fatigue | Body-state/recovery owner |
| Lean condition and muscle adaptation | Body-state/body-composition owner |
| Effective Strength contribution | Body-state plus attribute-resolution contract |
| Constitution/Vitality contribution | Body-state plus attribute-resolution contract |
| Climate conditions | Environment/weather owner |
| Body-composition climate response | Body-state/metabolism owner |
| Lasting attribute effects | Explicit later body-state/attribute contract |
| Difficulty | Difficulty/global-rules owner |
| Presentation | UI only |

No food item owns muscle gain. No activity privately mutates lean tissue. No weather system owns body composition. No UI calculates physiology.

## Active Final Repair

The active Codex run may modify only:

- `docs/dev/tmp-culinary-preparation-portion-meal-integration-2026-07-20.md`;
- `docs/dev/tmp-culinary-historical-energy-ration-source-index-2026-07-20.md`;
- `docs/dev/tmp-culinary-quantity-container-knowledge-audit-2026-07-20.json`;
- `docs/dev/current-codex-output.md`.

It must integrate conceptual protein recovery and muscle adaptation without inventing numerical findings from the queued research.

It must also repair:

1. duplicate command ownership;
2. food coupling in generic item-instance truth;
3. stale open-decision prerequisites;
4. canonical kcal and owner ambiguity;
5. metabolism, Stamina, fat, climate, protein, recovery, and adaptation boundaries;
6. artifact metadata;
7. contextual action surfaces;
8. candidate package graph and readiness.

Implementation remains unauthorized.

## Queued Deep Research Gate

Run identity:

`GPT-DR.nutrition.protein-recovery-muscle-adaptation`

Prompt:

`docs/dev/queued-protein-recovery-muscle-adaptation-deep-research-prompt.md`

Required artifact:

`docs/dev/tmp-protein-recovery-muscle-adaptation-research-YYYY-MM-DD.md`

Purpose:

- compare real-world nutrition/physiology evidence with manageable game abstractions;
- research protein maintenance, recovery, reversible loss, structural atrophy, slow adaptation, detraining, energy interaction, fat/climate integration, and premodern applicability;
- recommend Accessible, Standard, and Simulation complexity tiers;
- identify candidate ranges and confidence without canonizing them;
- test anti-exploit scenarios;
- preserve owner boundaries.

The research gate creates one temporary artifact only. It does not modify the active prompt, implementation, held `0.6.6`, or retained `0.6.7` artifacts.

After research, a separate unversioned integration decision is required before any body-state/protein/muscle implementation package.

## Route Guardrails

- The active Codex repair and queued Deep Research gate are unversioned.
- No implementation number is assigned.
- Three-segment labels remain primaries; four-segment labels are exact-parent support only.
- Held `0.6.6` remains paused and byte-recoverable.
- Retained Gate 1-5 and Gate 7 artifacts remain solely assigned to `0.6.7`.
- No item, recipe, ration, body, attribute, activity, training, store, schema, validator, test, runtime, command, save, UI, economy, difficulty, or gameplay change is authorized.
- After the final repair, stop for GPT/human inspection.
- After Deep Research, stop for GPT/human inspection and a separate research-integration decision.
