# Current GPT Handoff

## Status

- `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` is complete and validated.
- The culinary, nutrition, metabolism, fat, protein, recovery, muscle, and unified-attribute design sequence is complete as design input.
- Deep Research `GPT-DR.nutrition.protein-recovery-muscle-adaptation` completed at commit `462547fa64faa87d5d36cd5bf4d918b6c103002d`.
- Difficulty, World Rules, and Stakes were separated by `docs/design/difficulty-presets-grim-world-rules-and-stakes-separation-decision.md`.
- The repository audit `Difficulty Preset, Grim World, And Stakes Separation Contract Planning Audit` completed at commit `e60c6e6b6df6b418d2a1497a7725b4ad8d30a694`.
- GPT inspection accepted the audit as decision-ready and source-verified the universal HP-zero archival/save-deletion conflict.
- The future restricted-Stakes save, death-closure, and Prestige direction is now controlled by `docs/design/restricted-stakes-continuity-death-closure-and-prestige-decision.md`.
- The active Codex run is `Campaign Rules Identity, Legacy Migration, Story Abstraction, And Normal Stakes Acceptance Decision` in `docs/dev/current-codex-prompt.md`.
- The active run is documentation-only. On success it may create one durable decision, update current output, and delete the consumed temporary difficulty audit.
- No runtime, schema, save, migration, UI, balance, test, content, Grim module, restricted-Stakes runtime, death, succession, or Prestige implementation is authorized.
- `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains paused, not canceled, and byte-recoverable from `docs/dev/held-0.6.6-monster-ecology-loot-prompt.md` and blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
- Retained Gate 1-5 and Gate 7 artifacts remain solely assigned to `0.6.7`.

## Most Specific Current Authorities

1. `docs/design/restricted-stakes-continuity-death-closure-and-prestige-decision.md`
2. `docs/design/difficulty-presets-grim-world-rules-and-stakes-separation-decision.md`
3. `docs/design/unified-physical-attribute-growth-and-nutrition-band-integration-decision.md`
4. `docs/design/protein-recovery-muscle-adaptation-and-nutrition-integration-decision.md`
5. `docs/design/fat-mobilization-body-stat-and-climate-effects-decision.md`
6. `docs/design/metabolic-energy-stamina-fat-storage-and-atrophy-decision.md`
7. `docs/design/contextual-action-surfaces-inventory-crafting-and-trade-decision.md`

The restricted-Stakes decision is more specific only for future restricted save continuity, rollback, terminal death closure, read-only post-death access, and death-time Prestige direction. It does not change the active initial contract, which remains limited to `normal_stakes`.

The active acceptance run must create:

`docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md`

After acceptance, that new focused decision will control canonical campaign ids, lock and availability policy, Normal Stakes HP-zero behavior, legacy migration, Story abstraction, override availability, Chronicle identity, and package-order gates where older documents overlap.

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
- item nutrient truth, manifests, world facts, and immutable base attributes are not settings;
- an id may exist in contracts before ordinary production campaign creation is allowed to select it.

No restricted-Stakes machine id is accepted in the active run. `Ironbound` remains only a working title.

## Initial Lock And Availability Policy

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

Production campaign creation exposes only combinations whose required owner policies and modules are implemented and tested. Canonical ids may be reserved in types or fixtures without being selectable by ordinary players.

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
- never maps to the future restricted-Stakes mode;
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

Production campaign creation must not expose Story until its adapter exists for every core owner active in the selected world-rules combination.

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

Legacy `deathZeroesPrestige` is not accepted as the future restricted-Stakes rule.

## Future Restricted-Stakes Direction

The future mode remains a separate Stakes rule whose final player-facing name and machine id are open.

Accepted save posture:

- one authoritative campaign continuity save or save stream;
- autosaving exists for current-state continuity, session resumption, and technical recovery;
- manual prior-save loading, quick-load rollback, and save-scumming are unavailable;
- accepted state changes become durable through live or semi-live deterministic checkpoints;
- save-and-exit may force the latest authoritative checkpoint without creating a branch;
- hidden technical generations may recover the latest verified state after corruption or interrupted writes;
- technical recovery is not a player-selectable rollback history.

Accepted death posture:

- the mode makes actual death irreversible;
- it does not require every HP-zero event to be death;
- actual death is committed atomically;
- the character is immediately flagged terminal and closed to gameplay mutation;
- closing the application cannot escape a verified death;
- dead characters remain available for informational and Chronicle access;
- the terminal character record is retained rather than deleted;
- succession, house/line continuation, and campaign continuation remain later owner decisions.

Accepted Prestige posture:

- death does not zero Prestige;
- every dead restricted-Stakes character receives a positive Prestige or Legacy floor;
- a disgraced death may reduce the final settlement substantially;
- a martyring, sacrificial, celebrated, or heroic death may increase it;
- completed-life significance remains relevant;
- manner of death, conduct, public perception, legal perception, publicity, witnesses, evidence, audience, house/line impact, disgrace, and martyrdom are distinct inputs;
- legal condemnation and public admiration may coexist, including outlaw, vigilante, or Robin Hood-like cases;
- exact formulas, floors, caps, publicity mechanics, and thresholds remain deferred;
- settlement occurs exactly once and must be deterministic.

The active acceptance run must cite the focused restricted-Stakes decision and avoid contradicting it, but it must keep only `normal_stakes` in the initial contract.

## Combat-Profile Naming

`PlayerCombatProfileState.preferredMode: normal | hardcore` is not campaign difficulty, World Rules, or Stakes.

The active acceptance prompt requires:

- quarantine from campaign migration;
- deprecate the overloaded `hardcore` wording;
- defer replacement naming to a combat-owned decision based on actual behavior.

## Grim World Sequencing

The canonical contract may reserve `grim_world` before a module exists, but production campaign creation must not expose Grim World until at least one accepted Grim module has typed state, owner resolution, persistence, tests, and required Story adapters.

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
- older decisions, including the restricted-Stakes decision;
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

1. campaign-rules types, owner, save/Chronicle identity, provenance, and internal override registry, defaulting to Mortal/Heroic/Normal without broad player selection;
2. nonterminal Normal Stakes defeat boundary;
3. atomic migration from legacy `runDifficulty`;
4. read-only identity projection and migration visibility;
5. Favored/Mortal/Forsaken owner adapters, then production selection among implemented difficulty presets under Heroic World and Normal Stakes;
6. immutable-base/current-attribute and physical-nutrition prerequisites;
7. Story adapter across every active core owner;
8. expose Story only after its required adapters and tests exist;
9. focused Grim health/sanitation decision and slice;
10. expose Grim World only after a real persisted module and required Story adapter exist;
11. later Grim owner modules;
12. restricted-Stakes sequence: authoritative save continuity/recovery contract, actual-death/terminal-closure and succession contract, Prestige/Legacy settlement contract, final name/id acceptance, then runtime and opt-in UI.

Steps 1-3 may need to be one atomic versioned package so `normal_stakes` never coexists with automatic save deletion.

No production UI may present a canonical option merely because its id exists in types.

## Deferred Decisions

- exact preset values and formulas;
- exact contextual Normal Stakes defeat outcomes;
- final restricted-Stakes name and machine id;
- exact restricted-Stakes autosave cadence, save architecture, and technical recovery depth;
- exact actual-death contexts and lethality rules;
- party/NPC permanence;
- succession and same-world continuation;
- estate and inheritance transfer;
- exact Prestige base, floor, caps, curves, publicity model, disgrace thresholds, and martyrdom thresholds;
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
- The future restricted-Stakes decision is accepted design direction but not an initial live campaign id.
- Held `0.6.6` remains paused and byte-recoverable.
- Retained `0.6.7` artifacts remain untouched.
- No prior temporary culinary or research artifact is reopened by this run.