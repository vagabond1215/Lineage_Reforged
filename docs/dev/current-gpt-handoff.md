# Current GPT Handoff

## Status

- `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` is complete and validated.
- The culinary, nutrition, metabolism, fat, protein, recovery, muscle, and unified-attribute design sequence is complete as design input.
- Deep Research `GPT-DR.nutrition.protein-recovery-muscle-adaptation` completed at commit `462547fa64faa87d5d36cd5bf4d918b6c103002d`.
- Difficulty, World Rules, and Stakes were separated by `docs/design/difficulty-presets-grim-world-rules-and-stakes-separation-decision.md`.
- The repository audit `Difficulty Preset, Grim World, And Stakes Separation Contract Planning Audit` completed at commit `e60c6e6b6df6b418d2a1497a7725b4ad8d30a694`.
- The audit changed exactly `docs/dev/current-codex-output.md` and `docs/dev/tmp-difficulty-grim-world-and-stakes-audit-2026-07-21.md`.
- GPT inspection accepted the audit as decision-ready and source-verified the universal HP-zero archival/save-deletion conflict.
- The active Codex run is now `Campaign Rules Identity, Legacy Migration, Story Abstraction, And Normal Stakes Acceptance Decision` in `docs/dev/current-codex-prompt.md`.
- The active run is documentation-only. On success it may create one durable decision, update current output, and delete the consumed temporary difficulty audit.
- No runtime, schema, save, migration, UI, balance, test, content, Grim module, death, or Stakes implementation is authorized.
- `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains paused, not canceled, and byte-recoverable from `docs/dev/held-0.6.6-monster-ecology-loot-prompt.md` and blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
- Retained Gate 1-5 and Gate 7 artifacts remain solely assigned to `0.6.7`.

## Most Specific Current Authorities

1. `docs/design/difficulty-presets-grim-world-rules-and-stakes-separation-decision.md`
2. `docs/design/unified-physical-attribute-growth-and-nutrition-band-integration-decision.md`
3. `docs/design/protein-recovery-muscle-adaptation-and-nutrition-integration-decision.md`
4. `docs/design/fat-mobilization-body-stat-and-climate-effects-decision.md`
5. `docs/design/metabolic-energy-stamina-fat-storage-and-atrophy-decision.md`
6. `docs/design/contextual-action-surfaces-inventory-crafting-and-trade-decision.md`

The active acceptance run must create:

`docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md`

After acceptance, that new focused decision will control canonical campaign ids, lock policy, Normal Stakes HP-zero behavior, legacy migration, Story abstraction, override availability, Chronicle identity, and package-order gates where older documents overlap.

## Accepted Campaign Axes

```text
difficulty preset
  -> forgiveness, thresholds, rates, warnings, recovery, assistance

world rules
  -> which systemic reality the campaign simulates

stakes rules
  -> saving, rollback, defeat, death, and campaign permanence
```

The axes remain orthogonal.

Canonical player-facing difficulty names:

- Story
- Favored
- Mortal
- Forsaken

Canonical world-rule names:

- Heroic World
- Grim World

`Mortal + Heroic World + Normal Stakes` is the intended default identity.

## Required Campaign Identity Direction

The active acceptance prompt requires a contract equivalent to:

```ts
type DifficultyPresetId = "story" | "favored" | "mortal" | "forsaken";
type WorldRulesId = "heroic_world" | "grim_world";
type StakesRulesId = "normal_stakes";

interface CampaignRulesState {
  version: 1;
  difficultyPreset: DifficultyPresetId;
  worldRules: WorldRulesId;
  stakesRules: StakesRulesId;
  overrides?: CampaignRuleOverrideState[];
  migration?: CampaignRuleMigrationProvenanceState;
}
```

Requirements:

- machine ids are stable and distinct from localized labels;
- campaign/save state is authoritative;
- UI, save metadata, and Chronicle are projections;
- overrides are typed, owner-approved, versioned, and provenance-bearing;
- item nutrient truth, manifests, world facts, and immutable base attributes are not settings.

`Ironbound` remains only a working title. No restricted-Stakes id is accepted in the active run.

## Initial Lock Policy

The active acceptance prompt requires:

- Difficulty creation-locked;
- World Rules creation-locked;
- Stakes creation-locked;
- mechanical overrides creation-locked;
- accessibility, presentation, input, localization, and nonmechanical information formatting changeable.

No mid-campaign Story/Favored/Mortal/Forsaken changes are initially supported.

No Heroic/Grim transition is initially supported.

No Stakes transition is initially supported.

A later focused contract may allow difficulty-only changes with append-only provenance. World Rules and Stakes require dedicated state-closure migrations before any change is allowed.

## Normal Stakes And HP Zero

The live repository currently does this for every campaign:

```text
HP <= 0
  -> dead or hardcore_dead
  -> archive run
  -> resolve Legacy/estate
  -> delete all character saves
```

That behavior is not accepted Normal Stakes.

The active acceptance prompt requires:

```text
HP reaches zero
  -> defeated or incapacitated
  -> context-owned defeat resolution
  -> campaign and saves remain intact
```

Possible later contextual consequences include retreat, rescue, capture, injury, loss, recovery, or another explicitly accepted result.

The acceptance decision must establish:

- HP zero is not automatic death;
- HP zero is not automatic campaign archival;
- HP zero does not delete saves;
- HP zero does not pay terminal Legacy rewards;
- actual death, permanent death, succession, or campaign termination require a later explicit Stakes/death contract;
- retirement remains separate.

Critical implementation gate:

**Runtime migration to `normal_stakes` cannot ship while HP zero still automatically archives the run and deletes saves.** The nonterminal defeat boundary must land first or atomically with campaign-rules migration.

## Legacy Migration Direction

Accepted mapping to encode:

| Legacy | Difficulty | World Rules | Stakes |
|---|---|---|---|
| missing/invalid | Mortal | Heroic World | Normal Stakes |
| easy | Favored | Heroic World | Normal Stakes |
| normal | Mortal | Heroic World | Normal Stakes |
| hard | Forsaken | Heroic World | Normal Stakes |
| brutal | Forsaken | Heroic World | Normal Stakes |

All migration records include source identity and rules version.

Legacy Brutal:

- becomes Forsaken;
- preserves materially distinct owner-approved tuning through typed compatibility overrides;
- remains migration provenance, not a fifth public preset.

Legacy `hardcore: true`:

- never maps to Grim World;
- never maps to a future restricted Stakes mode;
- maps its tier normally;
- receives Heroic World and Normal Stakes;
- records `legacy_hardcore` provenance;
- may preserve owner-approved non-Stakes tuning through typed compatibility overrides;
- does not preserve automatic save deletion or implicit HP-zero terminal archival;
- does not automatically preserve `deathZeroesPrestige` or the Hardcore-specific Prestige multiplier;
- preserves historical `dead` and `hardcore_dead` archive labels as historical data only.

Encounter, process, material, infrastructure, route, and content `difficultyTier` fields remain separate authorities.

## Story Policy To Accept

Story is a narrative-first RPG abstraction, not legacy Easy.

Always preserve:

- authored item identity and manifests;
- physical quantities and nutrient truth;
- consumption events;
- campaign time;
- deterministic save/load;
- ordinary RPG HP, MP, Stamina, combat, quest, inventory, and equipment state unless separately decided.

Story body-state direction:

- one shared owner architecture with a Story adapter;
- detailed metabolism, digestion, Protein Support, fat, body composition, and recovery ledgers may be absent, inert, or internal compatibility caches;
- broad conditions such as well-fed/nourished, hungry, dehydrated, tired/exhausted, and ill provide the ordinary player-facing model;
- generous recovery and clear feedback;
- persistent structural atrophy and structural-loss accumulation disabled;
- no detailed macro optimization requirement.

Story plus Grim remains conceptually valid only where each selected Grim module has an explicit coarse Story adapter. A module without an adapter is unavailable in Story.

Because campaign axes are creation-locked and no legacy campaign maps to Story, the first decision does not need a mid-campaign conversion policy for existing technical or structural state.

## Overrides And Customization

The campaign-rules contract reserves typed overrides.

The first implementation must not expose player-facing custom mechanical overrides.

Initially accepted sources:

- legacy migration;
- developer/test fixtures.

Player customization requires a later owner-aware decision with validated bounds, interactions, UI explanations, persistence, and eligibility policy.

## Chronicle, Achievements, And Legacy

New and active campaign records must store:

- all three ids;
- campaign-rules version;
- migration provenance;
- compatibility overrides;
- any future append-only rule-change history.

Initial posture:

- record identity first;
- achievements remain rules-agnostic unless an individual achievement later declares predicates;
- no new difficulty/world/migration/custom reward multiplier is accepted;
- no new achievement exclusion is accepted;
- no new Legacy multiplier is accepted;
- historical run-end labels remain historical;
- difficulty and world rules do not determine death or save permanence.

## Combat-Profile Naming

`PlayerCombatProfileState.preferredMode: normal | hardcore` is not campaign difficulty, World Rules, or Stakes.

The active acceptance prompt requires:

- quarantine from campaign migration;
- deprecate the overloaded `hardcore` wording;
- defer replacement naming to a combat-owned decision based on actual behavior.

## Grim World Sequencing

The campaign identity may define `grim_world` before a module exists, but UI must not imply a complete harsh-world implementation.

Preferred first future Grim slice:

- health/sanitation;
- one traceable exposure;
- one environmental or settlement source;
- one treatment/counterplay path;
- deterministic persistence;
- Story adapter;
- no hidden random illness.

This is sequencing direction only. The active acceptance run does not implement or authorize a Grim module.

## Active Codex Scope

On success the active run may modify exactly:

1. create `docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md`;
2. update `docs/dev/current-codex-output.md`;
3. delete `docs/dev/tmp-difficulty-grim-world-and-stakes-audit-2026-07-21.md` after complete durable transfer.

It must not modify:

- current prompt;
- this handoff;
- route register;
- older decisions;
- runtime;
- schemas;
- saves;
- tests;
- UI;
- content;
- generated files;
- held `0.6.6`;
- retained `0.6.7` artifacts.

If live facts materially contradict the audit, it must update only current output, retain the temporary audit, and stop.

## Accepted Package Order Direction

No release number is assigned.

1. campaign-rules identity, owner, save/Chronicle projection, provenance, and internal override registry;
2. nonterminal Normal Stakes defeat boundary;
3. atomic migration from legacy `runDifficulty`;
4. campaign creation and read-only identity display;
5. Favored/Mortal/Forsaken owner adapters;
6. immutable-base/current-attribute and physical-nutrition prerequisites;
7. Story adapter;
8. focused Grim health/sanitation decision and slice;
9. later Grim owner modules;
10. separate Stakes decision before restricted saves, permanent death, or succession.

Steps 1-3 may need to be one atomic versioned package so `normal_stakes` never coexists with automatic save deletion.

## Deferred Decisions

- exact preset values and formulas;
- exact contextual defeat outcomes;
- actual death and permanent death;
- party/NPC permanence;
- succession and campaign termination;
- final restricted-Stakes name;
- restricted-save, save-and-exit, rollback, checkpoint, and crash-recovery topology;
- player-facing custom difficulty;
- Story adapters for owners not yet implemented;
- replacement combat-profile identifier;
- exact Grim disease/content catalog;
- core-versus-optional classification of later Grim modules;
- implementation version and milestone.

## Route Guardrails

- The active run is contract acceptance only.
- Do not call the result implementation-ready.
- No implementation prompt may be created by Codex.
- Held `0.6.6` remains paused and byte-recoverable.
- Retained `0.6.7` artifacts remain untouched.
- No prior temporary culinary or research artifact is reopened by this run.