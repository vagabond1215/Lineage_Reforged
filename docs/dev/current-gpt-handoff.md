# Current GPT Handoff

## Status

- `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` is complete and validated.
- The rich culinary, ration, container, contextual-action, metabolism, fat, protein, and muscle research/decision sequence is complete as design input.
- The protein Deep Research run completed at commit `462547fa64faa87d5d36cd5bf4d918b6c103002d`.
- Its temporary bibliography is not player-facing authority and may be deleted after durable conclusions are transferred.
- One authoritative stat-growth system and one authoritative current-attribute resolver are accepted.
- Base attributes are immutable.
- Training changes persistent developed adjustments.
- Long-duration structural deterioration may create persistent structural-loss adjustments.
- Structural loss is recoverable only through qualifying rebuilding and ordinary stat growth, not passive recovery.
- Difficulty naming and Hardcore semantics are controlled by `docs/design/difficulty-presets-grim-world-rules-and-stakes-separation-decision.md`.
- The active Codex run is `Difficulty Preset, Grim World, And Stakes Separation Contract Planning Audit` in `docs/dev/current-codex-prompt.md`.
- The active run is documentation-only and may modify exactly two files.
- `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains paused, not canceled, and recoverable from `docs/dev/held-0.6.6-monster-ecology-loot-prompt.md` and blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
- Retained Gate 1-5 and Gate 7 artifacts remain solely assigned to `0.6.7`.

## Most Specific Current Authorities

1. `docs/design/difficulty-presets-grim-world-rules-and-stakes-separation-decision.md`
2. `docs/design/unified-physical-attribute-growth-and-nutrition-band-integration-decision.md`
3. `docs/design/protein-recovery-muscle-adaptation-and-nutrition-integration-decision.md`
4. `docs/design/fat-mobilization-body-stat-and-climate-effects-decision.md`
5. `docs/design/metabolic-energy-stamina-fat-storage-and-atrophy-decision.md`
6. `docs/design/contextual-action-surfaces-inventory-crafting-and-trade-decision.md`

The newest focused decision controls difficulty and Hardcore semantics where older documents use `Accessible`, `Standard`, `Simulation`, or an overloaded `Hardcore` term.

## Accepted Campaign Axes

Lineage: Reforged separates:

```text
difficulty preset
  -> forgiveness, thresholds, rates, warnings, recovery, assistance

world rules
  -> which systemic reality the campaign simulates

stakes rules
  -> saving, rollback, defeat, death, and campaign permanence
```

These axes must not be silently conflated.

## Difficulty Presets

### Story

Narrative-first standard-RPG abstraction.

- Technical nutrition and body-state management may be collapsed, bypassed, hidden, or neutralized.
- Persistent structural loss is disabled.
- Food may use broad healing, morale, benefit, or `Well Fed` behavior.
- Grim World content may appear through broad events and forgiving checks rather than technical meters.
- Tutorials, forecasts, and recovery assistance are maximally clear and generous.

### Favored

Easier full-system mode, framed as divine or metaphysical benevolence.

- Every system selected by World Rules remains enabled.
- Healthy thresholds are more forgiving.
- Grace periods are longer.
- Harmful accumulation is slower.
- Recovery and rebuilding are faster.
- Warnings and forecasts are earlier and clearer.
- Physical food truth remains unchanged.

### Mortal

Expected default and player-facing replacement for `Standard`.

- Every system selected by World Rules is enabled.
- Core nutrition, metabolism, recovery, current attributes, and long-duration structural loss are active in Heroic World.
- Baseline bands, grace periods, rates, and recovery apply.
- Onboarding is gentle through presentation, warnings, and progressive explanation rather than disabled mechanics.

### Forsaken

Difficult full-system mode and thematic opposite of Favored.

- Every system selected by World Rules remains enabled.
- Thresholds are stricter.
- Grace periods are shorter but meaningful.
- Harm accumulates faster and recovery is slower.
- It does not automatically enable Grim World, permanent death, or restricted saves.

## World Rules

### Heroic World

Default fantasy-world posture.

Heroic World contains the accepted core systems without universally simulating every historical, biological, criminal, legal, and institutional burden.

It may include authored crime, disease, politics, fraud, scarcity, law, and social consequences where content and existing owners require them.

### Grim World

Hardcore world-simulation ruleset.

Grim World changes what systems exist. It is not a scalar package.

Candidate module families:

1. food- and water-borne illness, parasites, contamination, sanitation, waste, vermin, wound infection, and outbreaks;
2. water, fuel, shelter, washing, storage, spoilage, pack-animal, weather, transport, and equipment-maintenance logistics;
3. violent crime, burglary, robbery, extortion, kidnapping, protection, unsafe districts, and unreliable enforcement;
4. tolls, taxation, levies, military or labor service, requisition, debt, billeting, confiscation, and negotiated exemptions;
5. corruption, bribery, adulteration, false measures, counterfeiting, manipulated scarcity, and contract fraud;
6. imperfect maps, rumors, misinformation, stock uncertainty, legal uncertainty, and reduced perfect HUD knowledge;
7. persistent shortages, outbreaks, displacement, NPC vulnerability, institutional memory, and slower world recovery.

Grim World requirements:

- causal consequences;
- telegraphing;
- counterplay;
- local and institutional variation;
- persistence;
- proportionality;
- no universal grimdark assumption;
- no scalar duplication of Forsaken;
- distinct owners;
- manageable player presentation.

## Stakes

Saving and death permanence are separate from difficulty and world rules.

A future Stakes contract may define:

- normal saving;
- restricted saves;
- save-and-exit;
- one-save Ironman behavior;
- permanent character or party death;
- lineage or succession continuation;
- campaign retirement or deletion;
- crash/corruption recovery.

`Ironbound` is the current working title for a possible restricted-save/permanent-death option. It is not yet accepted implementation identity.

Neither Forsaken nor Grim World activates permanent death or restricted saving by itself.

## Combination Matrix

| Difficulty | World Rules | Intended result |
|---|---|---|
| Story | Heroic World | conventional narrative RPG |
| Story | Grim World | harsh themes through coarse, forgiving abstraction |
| Favored | Heroic World | complete core game with favorable tuning |
| Favored | Grim World | complete Grim systems with favorable tuning |
| Mortal | Heroic World | default intended game |
| Mortal | Grim World | default full harsh-world simulation |
| Forsaken | Heroic World | demanding core game without Grim additions |
| Forsaken | Grim World | most demanding systemic game without automatic save/death changes |

## Nutrition Placement

Core nutrition remains part of Mortal Heroic World.

Do not move all nutrition into Grim World.

- Story may disable or abstract kcal, Protein Support, fat, atrophy, and rebuilding management.
- Favored, Mortal, and Forsaken preserve exact internal food truth.
- Difficulty changes consequences and forgiveness, not authored nutrient values.
- Grim World adds contamination, sanitation, parasites, food/water-borne illness, outbreaks, and related interaction only after separate owner contracts.
- Persistent structural loss remains default-enabled in Favored, Mortal, and Forsaken, with preset-controlled grace and rates.

## Attribute Direction To Preserve

```text
currentAttribute = resolveAttribute(
  immutableBase,
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

- Base values never change.
- Developed and structural-loss adjustments are stat-growth-owned.
- Body state supplies nutrition, recovery, Fatigue, Lean Condition, and atrophy pressure.
- Rebuilding structural loss uses qualifying activity, nutrition, recovery, elapsed time, daily caps, and diminishing returns.
- No parallel muscle-adaptation progression currency exists.

## Active Codex Audit

The active run may modify only:

- `docs/dev/tmp-difficulty-grim-world-and-stakes-audit-2026-07-21.md`;
- `docs/dev/current-codex-output.md`.

It must inspect:

- live difficulty enums, labels, settings, and persistence;
- migration into Story/Favored/Mortal/Forsaken;
- Heroic World/Grim World campaign-rule identity;
- Story abstraction of technical nutrition;
- Grim module foundations and missing owners;
- separate save/death Stakes architecture;
- combination support;
- migration and test requirements.

It must not implement or modify runtime, schemas, saves, tests, UI, content, disease, crime, law, taxation, conscription, corruption, or gameplay.

## Recommended Route After Audit

After GPT/human inspection of the two-file audit:

1. accept or repair the three-axis contract;
2. select the first implementation package;
3. prefer difficulty/world-rule schema and migration before any Grim subsystem;
4. implement Story/Favored/Mortal/Forsaken and Heroic/Grim identity before adding systemic modules;
5. add Grim World through separate vertical slices, not one monolithic package;
6. keep Stakes/Ironbound separate until explicitly accepted;
7. do not restore `0.6.6` without an explicit route decision.

## Explicit Guardrails

- No implementation version is assigned.
- No current runtime or save work is authorized.
- No broad disease, crime, tax, conscription, corruption, fraud, or permadeath mechanic is authorized.
- Ordinary cultures, peoples, or fantasy lineages are not inherently criminal, diseased, corrupt, or violent.
- Grim systems must derive from local institutions, conditions, events, and authored physiology.
- `0.6.6` remains held and recoverable.
- `0.6.7` remains reserved for its retained artifacts and later cross-content audit.