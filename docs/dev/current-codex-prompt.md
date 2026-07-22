# Current Codex Prompt

## Run Identity

`Campaign Rules Identity, Legacy Migration, Story Abstraction, And Normal Stakes Acceptance Decision`

Run classification: unversioned documentation-only acceptance and contract decision

Milestone impact: `supports_current_band`

Parent version: none

Suggested commit:

`docs(difficulty): accept campaign rules identity and migration`

## Purpose

Consume the completed repository audit and create one durable, owner-aware acceptance decision for:

1. canonical campaign-rule identity;
2. creation-time locking and later change posture;
3. Normal Stakes defeat semantics;
4. migration from `easy | normal | hard | brutal` plus legacy `hardcore`;
5. Story-mode technical-system abstraction;
6. typed compatibility overrides and provenance;
7. Chronicle, achievement, and Legacy identity posture;
8. the next safe implementation package sequence.

This run accepts contracts. It does not implement runtime, schemas, saves, migration, UI, tests, balance, nutrition, attributes, Grim modules, Stakes variants, death, succession, disease, crime, taxation, corruption, or gameplay.

## Required Source State

Read first:

- `docs/dev/tmp-difficulty-grim-world-and-stakes-audit-2026-07-21.md`;
- `docs/dev/current-codex-output.md`;
- `docs/design/difficulty-presets-grim-world-rules-and-stakes-separation-decision.md`.

Also read:

- `docs/design/unified-physical-attribute-growth-and-nutrition-band-integration-decision.md`;
- `docs/design/protein-recovery-muscle-adaptation-and-nutrition-integration-decision.md`;
- `docs/design/metabolic-energy-stamina-fat-storage-and-atrophy-decision.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/historical-version-and-deferred-route-register.md`;
- `apps/rpg-ui/src/game-shell/runLifecycle.ts`;
- `packages/engines/player-engine/src/difficulty.ts`;
- `packages/shared/types/src/contracts.ts`;
- `packages/shared/types/src/tactics.ts`;
- `AGENTS.md`;
- `README.md`.

The completed audit commit is:

`e60c6e6b6df6b418d2a1497a7725b4ad8d30a694`

The temporary audit blob expected at the start is:

`b08c5b2ba418e8a3a4effea80984888c2b4fc10e`

The audit is accepted as planning evidence. Do not rerun the broad inventory unless a live file changed after the audit in a way that materially invalidates a finding.

## Precedence

The new durable decision created by this run must be more specific than the general difficulty/world/stakes decision for:

- canonical ids and state shape;
- lock policy;
- Normal Stakes HP-zero behavior;
- legacy tier and Hardcore migration;
- Story state abstraction;
- initial override availability;
- Chronicle and achievement identity;
- implementation gates and package order.

It must not supersede the general authority for:

- Story/Favored/Mortal/Forsaken meanings;
- Heroic World versus Grim World semantics;
- Grim World module families and guardrails;
- the separation of Difficulty, World Rules, and Stakes;
- immutable base attributes and unified current-attribute resolution;
- physical nutrient truth.

## Execution Gate

1. Run `git status`, fetch, and fast-forward pull. Record branch, starting commit, and clean/dirty state.
2. Confirm this is the active prompt.
3. Confirm commit `e60c6e6b6df6b418d2a1497a7725b4ad8d30a694` is an ancestor of `HEAD`.
4. Confirm the temporary audit exists at the expected path and materially matches blob `b08c5b2ba418e8a3a4effea80984888c2b4fc10e`.
5. Confirm the held `Version 0.6.6` prompt still resolves to blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
6. Preserve unrelated work.
7. If a live repository change materially invalidates the audit, do not create a false acceptance decision. Update only `docs/dev/current-codex-output.md` with the exact contradiction and stop. Do not delete the temporary audit in that case.

## Accepted Outcomes To Encode

The following are not open recommendations in this run. Encode them as accepted decisions.

### 1. Three orthogonal axes

Canonical ids:

```ts
type DifficultyPresetId = "story" | "favored" | "mortal" | "forsaken";
type WorldRulesId = "heroic_world" | "grim_world";
type StakesRulesId = "normal_stakes";
```

The target contract should be equivalent to:

```ts
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

- stable machine ids are distinct from localized labels;
- state is authoritative in the campaign/save domain;
- save metadata, Chronicle, and UI only project it;
- overrides use an owner-approved typed registry, never a free-form object;
- override entries retain owner, key, value, source, base preset, and rules version;
- physical item truth, immutable attributes, world facts, and manifests are authoritative domain truth outside the settings taxonomy, not campaign settings.

Do not add `ironbound` or another restricted-Stakes id.

### 2. Initial lock policy

For the first implementation:

- Difficulty is creation-locked;
- World Rules are creation-locked;
- Stakes are creation-locked;
- mechanical overrides are creation-locked;
- accessibility, presentation, input, localization, and nonmechanical information formatting remain changeable.

No mid-campaign transition among Story, Favored, Mortal, or Forsaken is initially supported.

No Heroic-to-Grim or Grim-to-Heroic transition is initially supported.

No Stakes transition is initially supported.

A future focused contract may allow difficulty-only changes with append-only provenance and eligibility effects. World Rules and Stakes remain locked unless a dedicated migration proves state closure.

### 3. Normal Stakes and HP zero

`normal_stakes` is the only accepted initial Stakes identity.

Normal Stakes preserves the existing ordinary manual and quick-save topology until a later save-owner decision changes it.

HP at or below zero is **defeat**, not automatic campaign archival, character deletion, save deletion, Legacy payout, or proof of permanent death.

Required semantic boundary:

```text
HP reaches zero
  -> defeated or incapacitated state
  -> dedicated context-owned defeat resolution
       -> retreat, rescue, capture, injury, loss, recovery, or other accepted consequence
  -> campaign identity and saves remain intact
```

This decision does not need to select every contextual defeat outcome. It must establish:

- `resolveTerminalArchiveReason` cannot remain the authority for ordinary HP-zero resolution under Normal Stakes;
- `archiveActiveRun` and save deletion require an explicit terminal outcome owned by a later death/retirement/campaign-end contract;
- ordinary HP zero must not call terminal archival implicitly;
- actual death, permanent death, succession, or campaign termination require a later explicit Stakes/death decision;
- retirement remains distinct from defeat and death.

Critical package-order gate:

**Do not authorize runtime migration to `normal_stakes` while HP zero still automatically archives the run and clears saves.** The nonterminal defeat boundary must land before or atomically with the runtime campaign-rules migration.

### 4. Legacy tier migration

Accept this mapping:

| Legacy state | Difficulty | World Rules | Stakes |
|---|---|---|---|
| missing or invalid | Mortal | Heroic World | Normal Stakes |
| `easy` | Favored | Heroic World | Normal Stakes |
| `normal` | Mortal | Heroic World | Normal Stakes |
| `hard` | Forsaken | Heroic World | Normal Stakes |
| `brutal` | Forsaken | Heroic World | Normal Stakes |

Every migration records source identity and rules version.

`brutal` must preserve materially distinct, owner-approved legacy scalar behavior through typed compatibility overrides where those values remain meaningful. It must not become a fifth public preset.

Encounter, process, material, infrastructure, route, and authored content `difficultyTier` fields do not migrate to campaign difficulty.

### 5. Legacy `hardcore: true`

Legacy Hardcore never implies Grim World and never implies a future restricted Stakes mode.

For an active legacy Hardcore save:

- map its ordinary tier using the table above;
- assign Heroic World;
- assign Normal Stakes;
- record explicit `legacy_hardcore` migration provenance;
- preserve only owner-approved non-Stakes tuning through typed compatibility overrides where practical;
- do not preserve automatic save deletion, implicit HP-zero terminal archival, or `hardcore_dead` as active behavior;
- do not automatically preserve `deathZeroesPrestige`;
- do not automatically preserve the Hardcore-specific Prestige multiplier without a separate Legacy/achievement owner decision.

Historical archived `dead` and `hardcore_dead` records remain historical data. Do not rewrite history and do not treat those labels as proof that a future Stakes mode was selected.

The ordinary tier's existing Prestige weighting may remain a later difficulty-policy seed, but this decision must not create new reward multipliers or achievement exclusions.

### 6. Story abstraction policy

Story is not migrated from Easy and is not a full simulation hidden behind a simplified UI requirement.

Use one authoritative owner architecture with a Story policy adapter.

Always preserve:

- authored item identity, manifests, quantities, kcal, protein, and other physical truth;
- consumption events and physical amounts;
- campaign time;
- deterministic save/load;
- ordinary HP, MP, Stamina, combat, quest, inventory, equipment, and RPG state unless another accepted Story rule says otherwise.

Story body-state posture:

- technical metabolism, digestion, Protein Support, fat mobilization, detailed recovery, and body-composition ledgers may be absent, inert, or internal compatibility caches;
- they are not required as player-managed authoritative state;
- the body-state owner projects broad RPG conditions such as nourished/well-fed, hungry, dehydrated, tired/exhausted, and ill where needed;
- generous recovery and clear causal feedback apply;
- persistent structural atrophy and persistent structural-loss accumulation are disabled;
- detailed macro optimization is never required;
- one meal cannot corrupt physical truth merely because consequences are simplified.

Story plus Grim World remains conceptually valid, but each Grim module requires an explicit coarse Story adapter. A Grim module without a Story adapter is unavailable in Story rather than silently running full-detail or becoming random punishment.

Because all axes are initially creation-locked and no legacy campaign maps to Story, this run does not need to define mid-campaign conversion of pre-existing technical or structural state into Story.

### 7. Overrides and custom UI

Reserve the typed override contract in the campaign-rules schema direction.

The first implementation does **not** ship player-facing custom mechanical overrides.

Initially allowed sources are limited to:

- `legacy_migration`;
- `developer_fixture` or equivalent test/development source.

A later owner-aware customization decision may add `player_customization` after every exposed key has validated bounds, interaction rules, UI explanation, persistence, and eligibility behavior.

### 8. Chronicle, achievements, and Legacy

New and active campaign records must preserve:

- all three ids;
- campaign-rules version;
- migration provenance;
- compatibility overrides;
- any future append-only rule-change history.

Initial policy:

- record identity first;
- achievements remain rules-agnostic unless an individual achievement later declares explicit eligibility predicates;
- no new Favored, Mortal, Forsaken, Heroic, Grim, migrated, or override-based reward multiplier is accepted here;
- no new achievement exclusion is accepted here;
- no new Legacy multiplier is accepted here;
- historical run-end labels remain historical;
- difficulty and world rules do not silently determine death or save permanence.

### 9. Combat-profile vocabulary

`PlayerCombatProfileState.preferredMode: "normal" | "hardcore"` is not campaign difficulty, World Rules, or Stakes.

Accept this disposition:

- quarantine it from campaign migration;
- mark `hardcore` as overloaded terminology to be deprecated;
- require a later combat-owned rename based on actual behavior, such as pause policy, command strictness, or automation;
- do not choose the replacement identifier in this run unless live behavior establishes one unambiguously.

### 10. Grim World sequencing

Campaign-rules identity may store `grim_world` before any Grim module is implemented, but UI must clearly identify unavailable modules or defer selection until at least one real module exists.

Accept health/sanitation as the preferred first future Grim vertical-slice family, narrowed later to:

- one traceable exposure path;
- one environment or settlement source;
- one treatment or counterplay path;
- deterministic persistence and save/load;
- a Story adapter;
- no hidden random illness.

This is sequencing direction, not implementation authorization. Core-versus-optional classification for all other Grim module families remains owner-specific later work.

## Required Durable Decision

Create:

`docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md`

The decision must contain:

1. status, date, scope, and no-implementation statement;
2. precedence and supersession boundaries;
3. canonical vocabulary and identifiers;
4. target `CampaignRulesState` contract;
5. ownership and projection boundaries;
6. creation-lock and future-change policy;
7. Normal Stakes HP-zero/defeat boundary;
8. exact legacy tier migration table;
9. legacy Hardcore migration disposition;
10. Story owner-policy matrix;
11. override registry and first-package availability;
12. Chronicle, achievement, and Legacy policy;
13. combat-profile naming quarantine;
14. Grim sequencing posture;
15. migration invariants;
16. implementation package order and atomicity gates;
17. required validation matrix;
18. temporary artifact disposition;
19. exact deferred decisions;
20. explicit non-decisions.

Use accepted contract language. Do not describe the listed outcomes as mere recommendations.

## Implementation Package Order To Accept

The durable decision should accept this dependency order without assigning release numbers:

1. campaign-rules types, owner, save/Chronicle identity, migration provenance, and typed internal override registry;
2. nonterminal Normal Stakes defeat boundary replacing implicit HP-zero archival and save deletion;
3. atomic migration from legacy `runDifficulty` into canonical campaign rules;
4. campaign-creation selection and read-only in-game identity projection;
5. Favored/Mortal/Forsaken owner adapters using existing values only as candidate seeds or typed compatibility inputs;
6. immutable-base/current-attribute and physical nutrition implementation prerequisites;
7. Story owner adapter after the core owners it simplifies have stable contracts;
8. first focused Grim health/sanitation decision and vertical slice;
9. later owner-specific Grim modules;
10. separate Stakes decision before restricted saving, permanent death, or succession.

Clarify that steps 1-3 may be one atomic versioned package if necessary to prevent `normal_stakes` from coexisting with automatic save deletion.

## Validation Obligations

The durable decision must require later tests proving:

- all three axes serialize independently;
- Mortal/Heroic/Normal is the new and legacy-missing default;
- Easy maps to Favored, Normal to Mortal, Hard to Forsaken;
- Brutal maps to Forsaken with provenance and approved compatibility overrides;
- legacy Hardcore never maps to Grim World or restricted Stakes;
- legacy Hardcore active saves do not retain automatic save deletion under Normal Stakes;
- historical archive labels remain unchanged;
- HP zero under Normal Stakes does not archive the run, delete saves, or pay terminal Legacy rewards;
- explicit terminal retirement/death/campaign-end routes remain separately callable when later accepted;
- Story preserves item truth and deterministic saves while disabling structural-loss accumulation and detailed player management;
- Story plus Grim requires a coarse adapter;
- no player-facing custom override exists in the first package;
- override provenance survives roundtrip;
- Chronicle identity preserves ids, version, provenance, and overrides;
- achievements remain unchanged unless individually declared;
- combat-profile `hardcore` cannot deserialize or project as campaign Hardcore;
- tracked TypeScript and JavaScript mirrors remain synchronized in later implementation;
- held `0.6.6` remains untouched.

## Temporary Artifact Disposition

After all useful findings and exact repository evidence are transferred into the durable decision:

Delete:

`docs/dev/tmp-difficulty-grim-world-and-stakes-audit-2026-07-21.md`

The decision must record:

- source commit `e60c6e6b6df6b418d2a1497a7725b4ad8d30a694`;
- that the audit was consumed as temporary planning evidence;
- that live repository paths and git history remain available if a later implementation audit needs exact evidence.

Do not delete the artifact if a material contradiction prevents successful acceptance.

## Required Output Scope

On successful completion, modify exactly:

1. create `docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md`;
2. update `docs/dev/current-codex-output.md`;
3. delete `docs/dev/tmp-difficulty-grim-world-and-stakes-audit-2026-07-21.md`.

Do not modify:

- this prompt;
- current GPT handoff;
- route register;
- prior design authorities;
- held `0.6.6`;
- retained `0.6.7` artifacts;
- runtime;
- schemas;
- saves;
- tests;
- UI;
- content;
- generated files;
- package manifests;
- gameplay.

## Current Output Requirements

Update `docs/dev/current-codex-output.md` with:

- source run identity;
- start and end commit/state;
- exact changed paths;
- decision path and precedence;
- accepted campaign ids;
- accepted lock policy;
- accepted Normal Stakes defeat boundary;
- exact migration map;
- Story abstraction posture;
- override availability;
- Chronicle/achievement/Legacy posture;
- temporary artifact deletion confirmation;
- implementation dependency order;
- exact deferred decisions;
- checks run;
- held-route confirmation.

Do not call the result implementation-ready. Use `contract accepted; implementation unauthorized` or equivalent.

## Deferred Decisions

Keep these deferred:

- exact Favored/Mortal/Forsaken numeric values;
- exact body, progression, economy, combat, and warning tunables;
- exact contextual defeat outcomes and their frequencies;
- actual death, permanent death, party/NPC death, succession, and campaign termination;
- final restricted-Stakes name;
- save-and-exit, single-save, checkpoint, rollback, and crash-recovery topology;
- player-facing custom difficulty controls;
- exact Story adapters for owners not yet implemented;
- replacement combat-profile identifier;
- exact Grim disease/content catalog;
- core-versus-optional disposition of later Grim modules;
- release version and milestone assignment.

## Stop Conditions

Stop after the durable decision, current output, and successful temporary-artifact deletion.

Do not:

- implement any accepted contract;
- change runtime death behavior;
- create a campaign-rules schema;
- migrate a save;
- add a setting screen;
- add Grim health state;
- add `ironbound`;
- assign exact tuning;
- assign a release number;
- create a follow-on implementation prompt;
- restore `0.6.6`;
- alter `0.6.7` artifacts;
- modify any path outside the exact successful scope.

Report the ending commit, exact changed paths, artifact deletion, repository state, and any contradiction that prevented full acceptance.