# Campaign Rules Identity, Migration, Story, And Normal Stakes Decision

Date: 2026-07-22

Status: accepted documentation-only campaign-rules authority; contract accepted; implementation unauthorized

Scope: canonical campaign-rule identity, creation locks, availability gates, Normal Stakes defeat semantics, legacy difficulty migration, Story abstraction, typed compatibility overrides, campaign-history identity, and implementation dependency order

Implementation authorization: none. This decision does not authorize runtime, schema, save, migration, UI, test, balance, nutrition, attribute, Grim module, restricted-Stakes, death, succession, Prestige, content, or gameplay changes.

## 1. Purpose And Source Evidence

This decision consumes the completed `Difficulty Preset, Grim World, And Stakes Separation Contract Planning Audit` and accepts one owner-aware contract for the initial campaign-rules identity.

Source evidence:

- accepted audit source commit: `e60c6e6b6df6b418d2a1497a7725b4ad8d30a694`;
- consumed temporary audit blob: `b08c5b2ba418e8a3a4effea80984888c2b4fc10e`;
- live source review at `c53b000077c90bfa821125adf11fe9d7e2b0c58f`;
- no runtime or shared-contract path changed between the accepted audit commit and the live source review;
- the only intervening repository changes were coordination documents and the focused restricted-Stakes decision;
- live repository paths and git history retain the exact evidence for later implementation audits.

The audit was planning evidence, not implementation authority. Its useful findings are transferred here, and its temporary artifact is removed by this acceptance run.

## 2. Precedence And Supersession Boundaries

This decision is more specific than `docs/design/difficulty-presets-grim-world-rules-and-stakes-separation-decision.md` for:

- canonical machine ids and the initial state shape;
- creation locking and future change posture;
- production availability gates;
- Normal Stakes HP-zero behavior;
- legacy `easy | normal | hard | brutal` and `hardcore` migration;
- Story technical-state abstraction;
- compatibility-override availability and provenance;
- Chronicle, achievement, and Legacy identity posture;
- implementation atomicity gates and package order.

The general difficulty/world/stakes decision remains controlling for:

- Story, Favored, Mortal, and Forsaken meanings;
- Heroic World and Grim World semantics;
- Grim module families and their causal, local, counterplay, and anti-frustration guardrails;
- separation of Difficulty, World Rules, and Stakes;
- physical nutrient truth.

The accepted nutrition and attribute decisions remain controlling for:

- immutable base attributes;
- persistent developed and structural-loss adjustments;
- current-attribute resolution;
- one stat-growth owner;
- one nutrition, metabolism, body-state, and recovery ownership architecture.

`docs/design/restricted-stakes-continuity-death-closure-and-prestige-decision.md` remains controlling for the future restricted-Stakes mode's continuity save, rollback prohibition, technical recovery, irreversible actual death, terminal closure, read-only post-death access, and nonzero circumstance-sensitive Prestige direction. This decision neither reproduces nor supersedes that future authority.

## 3. Canonical Vocabulary And Identifiers

The three campaign axes are orthogonal:

```text
Difficulty
  -> forgiveness, thresholds, rates, recovery, warnings, and assistance

World Rules
  -> the systemic reality simulated by the campaign

Stakes
  -> saving, rollback, defeat, death, and campaign permanence
```

Accepted initial identifiers:

```ts
type DifficultyPresetId = "story" | "favored" | "mortal" | "forsaken";
type WorldRulesId = "heroic_world" | "grim_world";
type StakesRulesId = "normal_stakes";
```

Stable machine ids are distinct from localized labels. The player-facing labels are Story, Favored, Mortal, Forsaken, Heroic World, Grim World, and Normal Stakes.

No `ironbound`, `hardcore_stakes`, or other restricted-Stakes id is accepted here. The final future mode name and machine id remain deferred.

Defining an id does not make it selectable in production. Availability depends on implemented, persistent, tested owner policies.

## 4. Target Campaign Rules Contract

The initial authoritative shape is equivalent to:

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

Typed override entries must retain at least:

```ts
interface CampaignRuleOverrideState {
  owner: CampaignRuleOwnerId;
  key: CampaignRuleOverrideKey;
  value: CampaignRuleOverrideValue;
  source: "legacy_migration" | "developer_fixture";
  basePreset: DifficultyPresetId;
  rulesVersion: 1;
}
```

Migration provenance must retain the source rules identity, source value or absence/invalidity, migration reason, target rules version, and any legacy-Hardcore marker needed to explain approved compatibility overrides. A free-form override object is prohibited.

The contract reserves future append-only rule-change history without authorizing any initial rule change.

## 5. Ownership And Projection Boundaries

Campaign/save authority owns `CampaignRulesState` and supplies it to domain owners. Domain owners resolve their own policy and remain the only authorities allowed to mutate their domain state.

Required boundaries:

- the authoritative identity is stored in campaign/save state;
- save metadata, Chronicle, account history, analytics, and UI only project that identity;
- difficulty policy does not toggle World Rules or Stakes;
- World Rules do not manufacture difficulty scalars or save permanence;
- Stakes do not rewrite authored physical truth or select simulated world modules;
- overrides reference an owner-approved typed registry;
- UI labels and localization never become deterministic identifiers;
- deterministic execution consumes stable ids, rules version, and overrides;
- physical item truth, manifests, immutable base attributes, world facts, and authored content remain domain truth outside the settings taxonomy.

Encounter, process, material, infrastructure, route, and authored-content `difficultyTier` fields are not campaign difficulty and do not migrate.

## 6. Creation Lock, Availability, And Future Changes

For the first implementation:

- Difficulty is creation-locked;
- World Rules are creation-locked;
- Stakes are creation-locked;
- mechanical overrides are creation-locked;
- accessibility, presentation, input, localization, and nonmechanical information formatting remain changeable.

No initial mid-campaign transition among Story, Favored, Mortal, or Forsaken is supported. No Heroic-to-Grim or Grim-to-Heroic transition is supported. No Stakes transition is supported.

A later focused contract may allow difficulty-only changes if it defines append-only provenance and eligibility effects. World Rules and Stakes remain locked unless a dedicated migration proves closure for every persistent state owner.

Production campaign creation exposes only combinations whose required owner policies, persistence, migrations, and tests exist. Canonical ids may exist in types, fixtures, and future contracts before ordinary players can select them. No production UI may present an option merely because its id exists.

## 7. Normal Stakes And The HP-Zero Boundary

`normal_stakes` is the only accepted initial Stakes identity.

Normal Stakes preserves the existing ordinary manual and quick-save topology until a later save-owner decision changes it. It does not accept the current implicit terminal HP-zero behavior.

Accepted semantic boundary:

```text
HP reaches zero
  -> defeated or incapacitated state
  -> dedicated context-owned defeat resolution
       -> retreat, rescue, capture, injury, loss, recovery,
          or another separately accepted consequence
  -> campaign identity and saves remain intact
```

Under Normal Stakes, ordinary HP zero is not:

- automatic actual death;
- campaign archival;
- character deletion;
- save deletion;
- Legacy or Prestige settlement;
- proof of permanent death;
- retirement.

`resolveTerminalArchiveReason` cannot remain the authority for ordinary HP-zero resolution. `archiveActiveRun` and save deletion require an explicit terminal outcome owned by a later death, retirement, or campaign-end contract. Actual death, permanent death, succession, and campaign termination require separate explicit authority.

Critical implementation gate: runtime migration to `normal_stakes` is prohibited while ordinary HP zero automatically archives the run and clears saves. The nonterminal defeat boundary must land before or atomically with the runtime campaign-rules migration.

This decision establishes the boundary but does not select every context-specific defeat outcome or frequency.

## 8. Exact Legacy Tier Migration

Accepted mapping:

| Legacy state | Difficulty | World Rules | Stakes |
| --- | --- | --- | --- |
| missing or invalid | Mortal | Heroic World | Normal Stakes |
| `easy` | Favored | Heroic World | Normal Stakes |
| `normal` | Mortal | Heroic World | Normal Stakes |
| `hard` | Forsaken | Heroic World | Normal Stakes |
| `brutal` | Forsaken | Heroic World | Normal Stakes |

Every migration records source identity and target rules version.

`brutal` preserves materially distinct, owner-approved legacy scalar behavior through typed compatibility overrides wherever those values remain meaningful. It is not a fifth public preset.

Story is not a migration target for Easy. Missing and invalid legacy state conservatively becomes Mortal/Heroic/Normal.

## 9. Legacy Hardcore Disposition

Legacy `hardcore: true` never implies Grim World and never implies the future restricted-Stakes mode.

An active legacy Hardcore save:

1. maps its ordinary tier using the migration table;
2. receives `heroic_world`;
3. receives `normal_stakes`;
4. records explicit `legacy_hardcore` migration provenance;
5. preserves only owner-approved non-Stakes tuning through typed compatibility overrides where practical;
6. does not preserve automatic save deletion or implicit HP-zero terminal archival;
7. does not automatically preserve `deathZeroesPrestige`;
8. does not automatically preserve the Hardcore-specific Prestige multiplier.

Historical archived `dead` and `hardcore_dead` records remain unchanged historical data. They do not prove that a future restricted-Stakes option was selected.

The ordinary tier's existing Prestige weighting may inform later difficulty policy, but this decision accepts no new reward multiplier, exclusion, or eligibility rule.

## 10. Story Owner Policy And Availability Gate

Story is a narrative-first RPG abstraction. It is not legacy Easy and is not required to run a complete hidden simulation behind a simplified UI.

Use one authoritative owner architecture with a Story policy adapter.

| Owner or truth | Accepted Story posture |
| --- | --- |
| item identity and manifests | always preserved |
| physical quantities, kcal, protein, and other authored nutrient truth | always preserved |
| consumption events and consumed amounts | always preserved |
| campaign time and deterministic save/load | always preserved |
| ordinary HP, MP, Stamina, combat, quest, inventory, equipment, and RPG state | preserved unless a later accepted Story rule explicitly changes it |
| detailed metabolism and digestion ledgers | may be absent, inert, or internal compatibility caches |
| Protein Support, fat mobilization, detailed recovery, and body-composition ledgers | may be absent, inert, or internal compatibility caches |
| player-facing body state | broad conditions such as nourished/well-fed, hungry, dehydrated, tired/exhausted, and ill where needed |
| recovery and feedback | generous recovery and clear causal explanation |
| persistent structural atrophy and structural-loss accumulation | disabled |
| macro optimization | never required |
| Grim module | requires an explicit coarse Story adapter |

One meal cannot corrupt authored physical truth because Story consequences are simplified.

Story plus Grim World remains conceptually valid. A Grim module without an explicit coarse Story adapter is unavailable in Story; it must not silently run at full detail or become hidden random punishment.

Because all axes are initially creation-locked and no legacy campaign maps to Story, this decision does not define conversion of pre-existing technical or structural state into Story.

Production creation must not expose Story until every core owner active under the selected World Rules has a tested Story adapter.

## 11. Typed Overrides And Initial Availability

The schema direction reserves typed compatibility overrides. The first implementation does not ship player-facing custom mechanical overrides.

Initially accepted sources are limited to:

- `legacy_migration`;
- `developer_fixture` or an equivalent test/development-only source.

Every exposed key must be registered by its owner with a stable type, validation, and interaction posture. Override entries preserve owner, key, value, source, base preset, and rules version through save/load and Chronicle projection.

`player_customization` requires a later owner-aware decision covering validated bounds, interactions, UI explanation, persistence, deterministic behavior, and achievement/Chronicle eligibility.

## 12. Chronicle, Achievements, And Legacy

New and active campaign records preserve:

- all three campaign-rule ids;
- campaign-rules version;
- migration provenance;
- compatibility overrides;
- any future append-only rule-change history.

Initial policy is record identity first:

- achievements remain rules-agnostic unless an individual achievement later declares explicit eligibility predicates;
- no Favored, Mortal, Forsaken, Heroic, Grim, migrated, or override-based reward multiplier is accepted;
- no new achievement exclusion is accepted;
- no new Legacy multiplier is accepted;
- historical run-end labels remain historical;
- difficulty and World Rules do not determine death or save permanence.

Legacy `deathZeroesPrestige` is not accepted as a future restricted-Stakes rule. The focused restricted-Stakes authority controls future death-time Prestige direction.

## 13. Combat-Profile Naming Quarantine

`PlayerCombatProfileState.preferredMode: "normal" | "hardcore"` is not campaign Difficulty, World Rules, or Stakes.

Accepted disposition:

- quarantine it from campaign migration;
- never deserialize or project it as campaign Hardcore;
- mark `hardcore` as overloaded terminology to be deprecated;
- require a later combat-owned rename based on actual behavior, such as pause policy, command strictness, or automation;
- defer the replacement identifier because current live behavior does not establish one unambiguously.

## 14. Grim World Sequencing And Availability

The canonical contract may reserve `grim_world` before any Grim module is implemented. Production campaign creation must not expose Grim World until at least one accepted Grim module has:

- real typed state;
- an authoritative owner resolver;
- deterministic persistence and save/load;
- representative tests;
- required Story adapters.

The preferred first future vertical-slice family is health/sanitation, later narrowed to:

- one traceable exposure path;
- one environmental or settlement source;
- one treatment or counterplay path;
- deterministic persistence and save/load;
- a Story adapter;
- no hidden random illness.

This is sequencing direction, not implementation authorization. Core-versus-optional classification for other Grim module families remains owner-specific future work.

## 15. Future Restricted-Stakes Authority Boundary

The initial contract contains only `normal_stakes`. The future restricted-Stakes direction is controlled by `docs/design/restricted-stakes-continuity-death-closure-and-prestige-decision.md`.

Preserved future invariants include:

- one authoritative continuity save or save stream;
- current-state continuity and technical recovery rather than player-chosen rollback;
- no manual prior-save loading, quick-load rollback, or save-scumming;
- live or semi-live deterministic owner-approved checkpoints;
- hidden technical generations only for latest verified-state recovery;
- irreversible actual death distinct from ordinary defeat or incapacitation;
- atomic terminal closure and prohibition of further character mutation;
- retained read-only character and Chronicle access rather than deletion;
- exactly one deterministic, nonzero Prestige or Legacy settlement;
- completed-life significance plus circumstance-sensitive public, legal, publicity, disgrace, sacrifice, and martyrdom inputs;
- possible disagreement between public and legal perception.

The final name and id, cadence, storage mechanism, recovery depth, actual-death contexts, party/NPC permanence, succession, estate transfer, publicity system, and Prestige formula remain deferred.

## 16. Migration Invariants

Later migration must satisfy all of the following:

1. `CampaignRulesState` becomes the sole authoritative campaign identity after migration; legacy `runDifficulty` is not indefinitely dual-written.
2. Missing and invalid legacy identity becomes Mortal/Heroic/Normal with provenance.
3. Easy, Normal, Hard, and Brutal map exactly as accepted.
4. Brutal's retained differences use only registered owner-approved overrides.
5. Legacy Hardcore never selects Grim World or restricted Stakes.
6. Active legacy Hardcore does not preserve implicit terminal HP-zero archival or save deletion.
7. Historical archive records remain unchanged.
8. Existing body state is not reinterpreted as physical kcal, new digestion state, fat state, or structural loss.
9. Current mutable attributes are not relabeled as immutable base attributes.
10. Encounter, process, material, infrastructure, route, and authored-content difficulty remains domain-owned.
11. Rules version, migration provenance, and overrides survive deterministic roundtrip.
12. Tracked TypeScript and JavaScript mirrors remain synchronized in any later implementation.

## 17. Accepted Implementation Package Order And Atomicity Gates

No release number is assigned.

1. Add campaign-rules types, owner, save/Chronicle identity, migration provenance, and typed internal override registry, initially defaulting to Mortal/Heroic/Normal without broad player selection.
2. Add the nonterminal Normal Stakes defeat boundary that replaces implicit HP-zero archival and save deletion.
3. Migrate legacy `runDifficulty` atomically into canonical campaign rules.
4. Add read-only in-game campaign identity projection and conservative old-save migration visibility.
5. Add Favored/Mortal/Forsaken owner adapters, then production creation selection only among implemented presets under Heroic World and Normal Stakes.
6. Land immutable-base/current-attribute and physical-nutrition prerequisites.
7. Add the Story owner adapter across every active core owner.
8. Expose Story in production creation only after its required adapters and tests exist.
9. Accept a focused Grim health/sanitation decision and implement one bounded vertical slice.
10. Expose Grim World in production creation only after a real persisted module, tests, and required Story adapter exist.
11. Add later owner-specific Grim modules.
12. Run a separate restricted-Stakes sequence: continuity/recovery contract; actual-death, terminal-closure, and succession contract; Prestige/Legacy settlement contract; final name/id acceptance; then runtime implementation and opt-in UI.

Steps 1 through 3 may be one atomic versioned package when necessary. They must not leave live `normal_stakes` identity coexisting with automatic HP-zero save deletion.

## 18. Required Validation Matrix

A later implementation must prove:

| Area | Required proof |
| --- | --- |
| axis serialization | all three initial axes serialize independently |
| defaults | new and legacy-missing campaigns resolve to Mortal/Heroic/Normal |
| tier migration | Easy -> Favored, Normal -> Mortal, Hard -> Forsaken |
| Brutal migration | Brutal -> Forsaken with provenance and approved typed compatibility overrides |
| Hardcore migration | legacy Hardcore never maps to Grim or future restricted Stakes |
| active Hardcore safety | Normal Stakes migration does not retain automatic save deletion |
| historical identity | archived `dead` and `hardcore_dead` labels remain unchanged |
| Normal Stakes defeat | HP zero does not archive, delete saves, or pay terminal rewards |
| explicit terminal routes | later accepted retirement, death, and campaign-end routes remain separately callable |
| Story truth | item identity, quantities, nutrients, consumption, time, and deterministic saves remain intact |
| Story structural policy | structural-loss accumulation is disabled and detailed management is not required |
| Story availability | Story cannot be selected before every required core adapter exists |
| Story plus Grim | every selected Grim module uses a coarse Story adapter |
| Grim availability | Grim cannot be selected before a real typed persisted module exists |
| custom UI | no player-facing mechanical overrides exist in the first package |
| override roundtrip | owner, key, value, source, base preset, and version survive roundtrip |
| Chronicle identity | ids, version, migration provenance, and overrides are retained |
| achievements | behavior is unchanged unless an individual achievement declares predicates |
| combat naming | combat-profile `hardcore` cannot deserialize or project as campaign Hardcore |
| restricted-Stakes boundary | the initial contract neither implements nor contradicts the focused future authority |
| mirror parity | tracked TypeScript and JavaScript remain synchronized |
| held route | held `0.6.6` remains untouched and blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769` remains recoverable |

## 19. Temporary Artifact Disposition

The temporary audit at `docs/dev/tmp-difficulty-grim-world-and-stakes-audit-2026-07-21.md` was consumed from source commit `e60c6e6b6df6b418d2a1497a7725b4ad8d30a694` and exact blob `b08c5b2ba418e8a3a4effea80984888c2b4fc10e`.

Its material findings, live contradictions, migration map, owner boundaries, Story posture, Grim sequencing, Stakes separation, and validation obligations are transferred into this decision. The temporary file is deleted by the successful acceptance run. Exact evidence remains recoverable from git history and the cited live paths.

## 20. Deferred Decisions

The following remain deferred:

- exact Favored, Mortal, and Forsaken numeric values;
- exact body, progression, economy, combat, warning, and information tunables;
- exact contextual Normal Stakes defeat outcomes and frequencies;
- final restricted-Stakes name and machine id;
- restricted-Stakes autosave cadence, journal/snapshot mechanism, and recovery depth;
- actual-death contexts and lethality rules;
- party and NPC permanent-death rules;
- succession and same-world continuation;
- estate and inheritance transfer;
- restricted-Stakes Prestige base, positive floor, caps, curves, publicity model, disgrace thresholds, and martyrdom thresholds;
- player-facing custom difficulty controls;
- Story adapters for owners not yet implemented;
- replacement combat-profile identifier;
- exact Grim disease and content catalog;
- core-versus-optional disposition of later Grim modules;
- release version and milestone assignment.

## 21. Explicit Non-Decisions

This decision does not:

- implement the accepted campaign-rules contract;
- add schemas, save fields, migrations, settings screens, or tests;
- change current runtime HP-zero, archival, payout, or save-deletion behavior;
- select context-specific defeat outcomes;
- expose any production campaign option;
- assign exact tuning or balance values;
- implement physical nutrition, current attributes, Story body state, or structural loss;
- add a Grim health state, disease, sanitation, crime, taxation, service, corruption, fraud, or information-friction system;
- add a restricted-Stakes id or accept `Ironbound` as final;
- implement autosave restrictions, terminal death closure, succession, or Prestige settlement;
- rewrite historical run records;
- change achievements or Legacy rewards;
- rename the combat profile;
- assign a release number or milestone;
- restore held `0.6.6` or alter retained `0.6.7` artifacts;
- create or authorize a follow-on implementation prompt.
