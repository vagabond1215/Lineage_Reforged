# Current Codex Prompt

## Run Identity

`Difficulty Preset, Grim World, And Stakes Separation Contract Planning Audit`

Run classification: unversioned documentation-only repository audit and implementation-contract planning

Milestone impact: `supports_current_band`

Parent version: none

Suggested commit:

`docs(difficulty): audit presets world rules and stakes`

## Purpose

Inspect the live repository and produce the smallest implementation-ready contract plan for three orthogonal campaign axes:

1. difficulty preset;
2. world rules;
3. stakes rules.

The accepted difficulty presets are:

- `Story`;
- `Favored`;
- `Mortal`;
- `Forsaken`.

The accepted world-rule choices are:

- `Heroic World`;
- `Grim World`.

`Mortal` is the expected default. `Grim World` is the Hardcore world-simulation ruleset. Restricted saves and permanent death are a separate future Stakes axis and must not be silently bundled into Forsaken or Grim World.

Do not implement runtime, schemas, saves, validators, UI, balance values, content, commands, disease, crime, taxation, conscription, corruption, or gameplay.

## Most Specific Authority

Read first and treat as controlling where older documents overlap:

`docs/design/difficulty-presets-grim-world-rules-and-stakes-separation-decision.md`

Also read:

- `docs/design/unified-physical-attribute-growth-and-nutrition-band-integration-decision.md`;
- `docs/design/protein-recovery-muscle-adaptation-and-nutrition-integration-decision.md`;
- `docs/design/fat-mobilization-body-stat-and-climate-effects-decision.md`;
- `docs/design/metabolic-energy-stamina-fat-storage-and-atrophy-decision.md`;
- `docs/design/contextual-action-surfaces-inventory-crafting-and-trade-decision.md`;
- `docs/design/activity-resolution-depth-and-attempt-state-contract-plan.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/historical-version-and-deferred-route-register.md`;
- `AGENTS.md`;
- `README.md`.

The temporary protein Deep Research artifact is evidence support only. Do not repair its bibliography, cite it as player-facing authority, or make its preservation a prerequisite.

## Accepted Invariants

1. Difficulty, World Rules, and Stakes are separate axes.
2. `Story` is a narrative-first RPG abstraction, not merely weaker enemies.
3. `Favored` retains selected systems with benevolent tuning.
4. `Mortal` is the intended default and enables every mechanic selected by World Rules.
5. `Forsaken` is harsher tuning and does not itself enable Grim World.
6. `Heroic World` retains the core nutrition, recovery, body-state, economy, social, and legal systems without universally simulating every harsh externality.
7. `Grim World` adds or materially deepens systemic reality; it cannot be a scalar bundle.
8. Core nutrition remains part of Mortal Heroic World.
9. Story may bypass, neutralize, or collapse technical nutrition and structural-loss consequences through explicit difficulty rules.
10. Grim health, sanitation, crime, institutional, economic, and information systems require distinct owner contracts.
11. Save restrictions and permanent death require a separate Stakes contract.
12. Physical nutrient truth does not change across Favored, Mortal, and Forsaken.
13. Base attributes remain immutable; current attributes consume persistent and reversible adjustments.
14. Held Version `0.6.6` remains paused and byte-recoverable.

## Execution Gate

1. Read all authorities above.
2. Run `git status`, fetch, and fast-forward pull. Record branch, starting commit, and clean/dirty state.
3. Confirm this is the active prompt.
4. Confirm `docs/design/difficulty-presets-grim-world-rules-and-stakes-separation-decision.md` exists unchanged.
5. Confirm the held `Version 0.6.6` prompt still resolves to blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
6. Preserve unrelated work.
7. Stop without editing if live repository facts materially contradict the controlling decision; report the smallest coordination repair required.

## Audit 1: Existing Difficulty Representation

Inspect all live definitions and uses of:

- difficulty enums and labels;
- difficulty selection during character or campaign creation;
- global difficulty rules;
- combat tuning;
- economy tuning;
- travel and activity tuning;
- body-state and nutrition tuning;
- failure and retry assistance;
- tutorial, warning, forecast, and information-precision settings;
- custom difficulty support;
- difficulty persistence in saves;
- UI projections and settings migration.

Identify every existing name equivalent to:

- Story;
- Easy;
- Normal or Standard;
- Hard;
- Simulation;
- Hardcore;
- Survival;
- Ironman;
- permadeath;
- custom difficulty.

Do not assume similarly named fields share the same authority.

## Audit 2: Three-Axis Target Contract

Propose the smallest coherent contract shape equivalent to:

```text
campaignRules = {
  difficultyPreset: Story | Favored | Mortal | Forsaken,
  worldRules: HeroicWorld | GrimWorld,
  stakesRules: NormalStakes | future explicit stakes option,
  customOverrides?: owner-approved values
}
```

Determine:

- canonical enum and identifier names;
- campaign-creation ownership;
- save identity and migration;
- whether each axis may change after campaign creation;
- which changes are safe, unsafe, or one-way;
- achievement and Chronicle identity implications;
- how custom overrides record provenance;
- how UI explains each axis without conflating them.

Do not accept `Ironbound` as a final identifier unless repository naming evidence supports it. Record it only as the current working title.

## Audit 3: Preset Migration

Map existing presets into:

### Story

- standard-RPG abstraction;
- technical nutrition and body-state management collapsed, bypassed, hidden, or neutralized;
- persistent structural loss disabled;
- generous recovery and assistance;
- Grim systems, if selected, projected through broad and forgiving states.

### Favored

- all systems selected by World Rules remain enabled;
- wider consequence thresholds;
- longer grace periods;
- slower harmful accumulation;
- faster recovery and rebuilding;
- earlier warnings and better forecasts;
- no change to physical item truth.

### Mortal

- intended default;
- all selected mechanics enabled;
- baseline bands, rates, grace periods, and recovery;
- gentle onboarding through presentation, not disabled systems.

### Forsaken

- all selected mechanics enabled;
- stricter thresholds;
- shorter but meaningful grace periods;
- stronger accumulation and slower recovery;
- no automatic Grim World or Stakes activation.

Inventory exact repository fields that can be reused, renamed, deprecated, or migrated.

## Audit 4: Core Nutrition Placement

Preserve this direction:

- Story does not require technical kcal, protein, fat, atrophy, or rebuilding management.
- Favored, Mortal, and Forsaken retain exact internal food truth and coherent body-state architecture.
- Mortal Heroic World includes core digestion, Energy, Stamina, hunger, satiety, hydration, Protein Support, fat reserve, recovery, current attributes, and long-duration structural loss.
- Grim World adds contamination, sanitation, parasite, food-borne, water-borne, outbreak, and related systemic layers only after separate owner contracts.

Audit whether the live body-state implementation can support:

- explicit bypass or neutralization in Story;
- consequence tuning without changing physical truth;
- campaign-rule identity in saves;
- later Grim extensions without a parallel nutrition system.

Do not select exact balance values.

## Audit 5: Grim World System Classification

Inventory live foundations and missing contracts for these module families:

1. health, sanitation, contamination, parasites, and wound infection;
2. water, fuel, shelter, storage, spoilage, vermin, equipment care, and logistics;
3. violent crime, burglary, extortion, kidnapping, protection, and personal security;
4. tolls, taxation, levies, military or labor service, requisition, debt, and confiscation;
5. corruption, bribery, adulteration, false measures, counterfeiting, contract fraud, and market uncertainty;
6. imperfect maps, rumors, misinformation, stock uncertainty, legal uncertainty, and navigation friction;
7. persistent shortages, outbreaks, displacement, institutional memory, NPC vulnerability, and world recovery.

For each module family classify:

- existing owner;
- existing schema/runtime/content foundation;
- missing authority decision;
- whether it belongs in core Grim World, an optional Grim submodule, or later content;
- player decisions created;
- counterplay;
- anti-frustration requirements;
- persistence and save needs;
- tests;
- dependency order.

Do not design one universal disease, crime, tax, conscription, or corruption mechanic. Preserve polity, law, class, status, economy, environment, and local variation.

## Audit 6: Stakes Separation

Inspect live save, defeat, death, companion-death, campaign-failure, and rollback behavior.

Produce a separate Stakes contract plan covering:

- normal saves;
- restricted save count;
- save-and-exit;
- Ironman-style single save;
- permanent player death;
- permanent party or NPC death;
- lineage or succession continuation;
- campaign deletion or retirement;
- crash/corruption recovery;
- opt-in warnings;
- achievement integrity;
- whether stakes may be changed after campaign creation.

The audit must keep these separate from:

- Favored, Mortal, and Forsaken tuning;
- Heroic World and Grim World system selection.

Do not authorize or implement permanent death.

## Audit 7: Combination Matrix

Validate these combinations conceptually:

| Difficulty | World Rules | Required posture |
|---|---|---|
| Story | Heroic World | conventional narrative RPG |
| Story | Grim World | harsh world themes through coarse, forgiving abstraction |
| Favored | Heroic World | complete core game with favorable tuning |
| Favored | Grim World | complete Grim systems with favorable tuning |
| Mortal | Heroic World | default intended game |
| Mortal | Grim World | default full harsh-world simulation |
| Forsaken | Heroic World | demanding core game without Grim additions |
| Forsaken | Grim World | most demanding systemic game without automatic save/death changes |

Identify contradictions, unsupported combinations, migration hazards, and UI requirements.

## Audit 8: Owner And Setting Classification

Classify each relevant setting as exactly one of:

- difficulty scalar or threshold;
- world-rule module toggle;
- stakes rule;
- accessibility or information setting;
- presentation-only setting;
- content or campaign-selection rule;
- custom override.

Examples that must not be conflated:

- enemy damage versus sanitation simulation;
- nutrition forgiveness versus food-borne disease existence;
- map assistance versus map truth;
- save frequency versus campaign death permanence;
- merchant price tuning versus corruption or fraud systems;
- structural-loss rate versus structural-loss system existence.

## Audit 9: Migration And Compatibility

Identify migration requirements for:

- existing difficulty names and stored enum values;
- existing custom difficulty values;
- saves created before World Rules and Stakes axes exist;
- achievements and analytics keyed to old presets;
- current body-state difficulty switches;
- UI and localization;
- deterministic replay;
- multiplayer or shared-world assumptions if any;
- generated JavaScript or built artifacts mirroring TypeScript sources.

Recommend conservative defaults for old saves. Do not silently place existing campaigns into Grim World or restricted Stakes.

## Audit 10: Test Matrix

Specify tests proving:

- Story bypasses technical nutrition management without corrupting item truth;
- Favored, Mortal, and Forsaken share identical authored food values;
- Mortal enables every system selected by World Rules;
- Forsaken does not enable Grim World;
- Grim World adds systemic modules instead of only scalar changes;
- Story plus Grim World uses coarse abstraction;
- nutrition remains core in Mortal Heroic World;
- Grim disease and sanitation do not leak into Heroic World as universal systems;
- Stakes remain independent from difficulty and world rules;
- old saves migrate to conservative campaign rules;
- campaign identity persists all selected axes;
- custom overrides retain provenance;
- held `0.6.6` remains untouched.

## Required Output

Modify only:

- `docs/dev/current-codex-output.md`;
- one new temporary audit artifact at `docs/dev/tmp-difficulty-grim-world-and-stakes-audit-2026-07-21.md`.

The temporary artifact must contain:

1. live repository inventory;
2. contradiction table;
3. three-axis target contract;
4. preset migration map;
5. nutrition placement analysis;
6. Grim module classification;
7. Stakes separation plan;
8. combination matrix;
9. owner matrix;
10. migration map;
11. test matrix;
12. exact remaining user decisions;
13. recommended package sequence;
14. explicit non-decisions.

Do not modify the controlling decisions, handoff, route register, held prompt, runtime, schemas, tests, saves, UI, content, or gameplay in this run.

## Stop Conditions

Stop after producing the two allowed documentation files.

Do not:

- implement the three axes;
- assign exact balance values;
- create Grim disease, crime, tax, service, corruption, fraud, save, or death mechanics;
- assign a release version;
- restore `0.6.6`;
- alter retained `0.6.7` artifacts;
- create a follow-on implementation prompt;
- modify any file outside the exact allowed pair.

Report the ending commit, exact changed paths, repository state, unresolved owner conflicts, and user decisions still required.