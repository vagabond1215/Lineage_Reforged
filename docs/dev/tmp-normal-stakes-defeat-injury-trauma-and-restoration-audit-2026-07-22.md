# Normal Stakes Defeat, Injury, Trauma, And Restoration Audit

Date: 2026-07-22

Run: `Normal Stakes Defeat, Injury, Trauma, And Magical Restoration Repository Audit And Contract Planning`

Classification: unversioned documentation-only repository audit and implementation-contract planning

Milestone impact: `supports_current_band`

Status: audit complete; implementation and contract acceptance remain unauthorized

## 1. Execution And Source-State Confirmation

- Branch: `master`.
- Starting and ending commit before documentation edits: `d11c270bfeaa75a9a36ebe1302303e61b9384491`.
- Starting worktree: clean.
- `git fetch --all --prune` and `git pull --ff-only`: successful; already up to date.
- The active prompt is this audit.
- Accepted campaign-rules decision commit `764f7ef5e4028e82fc76af6ae0381cc1eab00e20` is an ancestor of `HEAD`.
- `docs/design/injury-recovery-trauma-and-magical-restoration-decision.md` exists and was unmodified before this audit.
- Held `Version 0.6.6` still identifies blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`; the object resolves as a blob.
- The diff from the accepted campaign-rules decision to `HEAD` changes only coordination and decision documentation. The audited runtime did not change after that authority was accepted.
- No live fact materially contradicts an accepted authority. The temporary audit may therefore be created.

Controlling authorities were read in the order required by the prompt. Live sources and focused tests were then traced for combat resolution, player snapshots, run lifecycle, saves, travel/rest, health vocabulary, spells, services, magic hooks, and tracked TypeScript/JavaScript mirrors.

## 2. Live HP-Zero And Defeat Call Flow

### Combat path

The combat engine owns combat damage and combatant defeat:

1. `packages/engines/game-engine/src/combat/index.ts` resolves action damage.
2. `markCombatantDefeated` clamps hit points to zero and sets both `incapacitated = true` and `defeated = true`.
3. `evaluateEncounterOutcome` resolves `enemies_victorious` when no undefeated allied combatants remain.
4. `syncEncounterToPlayerState` copies the player combatant's HP, MP, and Stamina into `PlayerState.resources` and projects combat status labels into `PlayerState.activeEffects`.
5. A resolved encounter is appended to `combatHistory`, `combat.encounter.ended` is emitted, encounter-to-party bindings are cleared, and `activeEncounter` becomes `null`.

Combat can therefore finish its own encounter lifecycle without calling run archival. It nevertheless publishes an HP-zero player snapshot that the application shell interprets as terminal.

Current combat construction materially supports the player and enemies. Party members have metadata and transient `combatantId` bindings, but current encounter setup does not create a durable party-health or party-injury owner; allied guest ids are empty in the ordinary flow. Cleanup clears member bindings. The repository therefore cannot yet promise a persisted companion injury/death consequence.

### Exact current terminal flow

```text
combat action or another resource mutation
  -> authoritative PlayerState.resources.hp.current becomes 0
  -> snapshot reaches apps/rpg-ui/src/App.tsx
  -> InGameShell.onSnapshotChange
  -> evaluateSnapshotWithAccount
  -> resolveTerminalArchiveReason(snapshot)
  -> "dead" or "hardcore_dead"
  -> archiveActiveRun
       -> achievement/history evaluation
       -> Legacy/Prestige payout resolution
       -> account run-history archival
       -> estate deposit
       -> account-profile persistence
       -> deletion of every discovered/recorded character save slot
  -> SHOW_MAIN_MENU and terminal death notice
```

The same terminal predicate runs during `resolveRunEntry`, so a saved HP-zero snapshot is archived when continued or loaded. `purgeBlockedRunSlot` separately deletes stale or copied slots when account history already says the run is archived or deleted. That stale-copy protection is valid for an explicitly terminal history record; the defect is allowing ordinary HP zero to create that record.

`apps/rpg-ui/src/game-shell/runLifecycle.ts` is the current terminal classifier. `resolveTerminalArchiveReason` returns no reason only while HP is positive; otherwise it returns `dead` or `hardcore_dead` from legacy difficulty. `archiveActiveRun` is a broad terminal transaction, not a defeat transaction. Even an already-resolved payout path still clears character save slots.

Explicit retirement also calls lifecycle archival with `archiveReason: "retired"` and must remain a separately callable terminal route. Current tests in `tests/unit/run-lifecycle.test.mjs` intentionally encode retirement archival, payout idempotency, `dead`/`hardcore_dead` HP-zero classification, and stale-slot deletion. `tests/unit/combat-spawn-foundation.test.mjs` encodes combatant defeat flags and encounter behavior. These tests describe the current behavior; they do not make ordinary HP-zero archival compatible with the accepted Normal Stakes contract.

HP zero is not combat-exclusive. Resource deltas and travel costs can clamp HP to zero, including travel-engine cost application. The player engine only emits an HP-depleted warning. Consequently, a replacement cannot depend solely on a combat outcome and needs a typed source receipt or a safe legacy/unknown-source fallback.

### Smallest replacement seam

Keep combat HP and combatant flags authoritative. At the two snapshot-admission sites currently calling `resolveTerminalArchiveReason`—snapshot change and run entry—route an HP-zero active run through one deterministic engine-owned Stakes/defeat resolver. That resolver returns an accepted nonterminal defeat result or an explicit terminal outcome. Only the latter may call `archiveActiveRun`.

The application may orchestrate persistence and project notices, but it must not author defeat truth. The resolver must be idempotent and operate on the authoritative snapshot after the causing mutation. This replaces the terminal interpretation without creating another HP counter or combat-death authority.

## 3. Contradiction Table

| Topic | Live repository fact | Accepted authority | Classification / action |
| --- | --- | --- | --- |
| Ordinary HP zero | UI lifecycle turns any HP-zero snapshot into `dead` or `hardcore_dead`, archives the run, and deletes saves. | Under Normal Stakes, ordinary HP zero is nonterminal defeat/incapacitation. | Known implementation gap and first-package gate, not an authority contradiction. Do not migrate campaign rules until replaced. |
| Combat resolution | Combat already marks the actor defeated/incapacitated and can resolve/clear the encounter independently. | Defeat is distinct from actual death. | Compatible reusable seam. |
| Health vocabulary | A descriptive `combat-health-vocabulary` schema, content file, lint path, and validation test already exist with status/condition/injury categories. Only two planned status rows are populated. | The older boundary calls for descriptive static identities that do not own active state. | Compatible partial foundation. Coordination text that implies the exact schema is absent is stale; do not edit it in this run. |
| Mutable attributes | `PlayerState.attributes` is a mutable current representation without the accepted immutable-base/current split. | Injury and trauma cannot mutate immutable base attributes and must use one current-state resolver. | Migration input, not permission to treat the current field as immutable base or to add direct injury mutations. |
| Active effects | `PlayerState.activeEffects` is an array of strings populated from combat labels. | Active injury and trauma require typed persisted instances and explainable ownership. | Incomplete projection/naming risk, not an active-health owner. |
| Healing magic | Combat hooks can restore HP through `heal.hp`; static healing spells exist. | Ordinary healing does not imply regrowth or resurrection. | Compatible. Explicitly constrain the hook to resource healing. |
| Resurrection/regrowth | No live player spell/runtime capability was found for resurrection, revival, limb/organ regrowth, or anatomical restoration. | Such effects require explicit rare capability and separate death/magic authority. | Missing future decision and owner, not a contradiction. |
| Restricted Stakes | No accepted live restricted-Stakes id exists. Current legacy Hardcore alters the terminal label. | Restricted Stakes remains separate future authority and terminal closure must remain irreversible. | Legacy naming/input to migrate; do not reinterpret it as the future mode. |

No material source contradiction requires stopping the audit.

## 4. Default Normal Stakes Fallback Options And Recommendation

| Candidate component | Default fallback | Context-owned extension |
| --- | --- | --- |
| Encounter termination | Required; finish or clear the current encounter once. | A scripted owner may retain a resolved capture/rescue scene, never an active damaging loop. |
| Incapacitated/defeated | Preserve the event truth in the receipt; clear transient combat bindings during recovery. | Context may distinguish unconscious, routed, rescued, surrendered, or captured. |
| Safe placement | Required when a valid deterministic recovery location exists. | Quest, law, rescue, captivity, or encounter owner may choose an explicit destination. |
| Time | Advance a bounded deterministic amount once. | Context may specify a longer, authored interval. |
| HP/Stamina | Restore to a bounded resume floor sufficient to act, not necessarily maximum; avoid an immediate zero loop. | Context or later health owner may alter recovery subject to the same playability guard. |
| MP | No required generic full restoration. | Context or ordinary recovery owners may restore it. |
| Body state | Preserve by default in the first package; an accepted body owner may later apply one bounded typed consequence. | Owner-approved fatigue, hunger, exposure, or recovery effects. |
| Injury | None automatically. | An accepted causal consequence may create a naturally recoverable injury later. |
| `Shaken Spirit` | None automatically. | An accepted event/trigger resolver may create it later. |
| Currency/items/equipment | Preserve by default. | A specific theft, rescue cost, capture, breakage, or quest transaction may change them. |
| Party | Preserve membership and durable state by default; clear transient combat bindings. | A future party owner may resolve rescue, separation, captivity, injury, or death. |
| Quest/event state | Preserve unless a context owner emits an accepted consequence. | Scripted quest/capture/rescue outcomes. |
| Chronicle/notice | Required and derived from the accepted receipt. | Context may add authored detail without changing truth. |

The smallest coherent fallback is:

1. consume the HP-zero transition once and create a stable defeat receipt/outcome id;
2. ensure the encounter is resolved and transient bindings are cleared;
3. use a context-owned recovery location when present; otherwise resolve a deterministic safe fallback;
4. advance bounded deterministic time;
5. restore HP to an accepted resume floor and Stamina sufficiently to prevent immediate inability to act;
6. preserve inventory, equipment, currency, quests, party membership, injury state, trauma state, and immutable character truth by default;
7. write the snapshot before ordinary play resumes;
8. project one Chronicle entry and one notice from the same receipt;
9. apply a short recovery/re-entry guard so the unchanged danger cannot immediately retrigger defeat.

The repository has no authoritative “nearest safe location” or persisted last-safe-location receipt. Current travel state holds a settlement/location identity, and rest works only at recognized settlement destinations. The first package therefore needs an accepted fallback order. The recommended qualitative order is: explicit context destination, current valid recovery settlement, persisted last-safe location, campaign-start settlement. If none validates, retain the run in a nonterminal `recovery_pending` repair state with an explicit diagnostic; never archive, delete saves, choose randomly, or silently teleport.

Exact time, HP, Stamina, and guard values remain balance decisions. Before the full injury catalog exists, the fallback should use only time, safe placement, bounded resource restoration, and explanation. Injury, trauma, capture, item loss, currency loss, and permanent harm remain optional causal extensions.

## 5. Health, Injury, And Condition Inventory

| Live representation | Current role | Classification |
| --- | --- | --- |
| `CombatStatusEffectState` and combatant `statusEffects` | Typed transient combat effects on a combatant. | Reusable combat-only active-status boundary; insufficient for persisted injury/recovery. |
| Combatant `incapacitated` / `defeated` | Encounter participation/outcome truth. | Reusable defeat input; not actual-death or campaign-health authority. |
| `PlayerState.resources.hp` | Authoritative persisted player HP resource. | Reusable HP-zero input; not an injury catalog. |
| `PlayerState.resourceRuntime` histories/modifiers | Resource change history and modifier inputs. | Reusable source evidence/migration input; forbidden as parallel injury owner. |
| `PlayerState.activeEffects: string[]` | Label projection, currently synchronized from combat statuses. | Incomplete placeholder and naming conflict; projection only. |
| `PlayerState.bodyState` | Nutrition, fatigue, sleep, energy, fat/storage, and related reversible body truth. | Reusable recovery input; forbidden as injury/trauma/anatomy owner. |
| `PlayerState.attributes` | Current mutable attribute values in the pre-split model. | Migration input. Never reinterpret as accepted immutable base. |
| `combat-health-vocabulary.schema.json` and content | Descriptive identities for status/condition/injury families and allowed owners. | Reusable static vocabulary boundary. It must remain non-executing. |
| Two planned vocabulary rows (`stagger`, `bind`) | Descriptive status seeds. | Incomplete placeholder; no live physical-injury or trauma catalog. |
| Vocabulary families such as fracture, concussion, trauma, scar, impairment, maiming | Allowed descriptive categories. | Capacity only, not proof of implemented behavior. |
| `SaveSnapshot` containing player/game/world/session state | Unified persistence envelope. | Reusable persistence owner. Do not create a health save. |
| `combatHistory`, events, Chronicle surfaces | Historical/event projection. | Reusable receipt/projection seam; not active-health truth. |
| Travel location and settlement facts | Current location and known static destinations. | Partial safe-location input; no safe-location resolver or last-safe receipt. |
| Settlement rest | Charges currency, advances time, applies secure recovery, and fills resources. | Reusable time/recovery input pattern; not injury healing authority. |
| Healing spell hooks including `heal.hp` | Resource restoration. | Ordinary healing input only. |
| Healing tonics, bandages, poultices, and similar item descriptors | Static item/content vocabulary. | Potential treatment inputs; no active treatment or item-effect owner is proven. |
| Settlement morale | Settlement-scale condition. | Unrelated domain vocabulary; not player trauma. |
| Quest prose mentioning injury or wounds | Authored narrative/failure language. | Unrelated domain vocabulary unless a future typed consequence is emitted. |
| Party member metadata and transient combat bindings | Party identity/binding. | Incomplete placeholder for persistent party health. |

There is no live active injury instance, `Shaken Spirit` instance, anatomy/body-region owner, treatment course, complication owner, persistent pain/bleeding/fracture/concussion state, prosthetic contract, corpse state, or resurrection state.

## 6. Naturally Recoverable Injury Contract Plan

### Proposed instance boundary

One health/injury owner should persist an `InjuryInstance` inside authoritative player state. Conceptually it needs:

- stable instance id and static vocabulary id;
- `Minor | Moderate | Major` severity;
- recovery class, initially including `naturally_recoverable`;
- source event/receipt id, source kind, and source tick;
- optional body-region identity only when a body-region authority exists;
- current recovery progress and course state;
- injury-specific use posture: ordinary, reduced, or protected;
- treatment input/receipt state;
- complication references and causal conversion receipt;
- current effect contribution references;
- created, updated, resolved, and presentation timestamps/ticks;
- resolved/descriptive scar presentation without automatic impairment.

Severity never determines recoverability by itself. A Major naturally recoverable injury must be able to reach full functional recovery.

### Ownership and progression

- The consequence resolver creates an instance only from an accepted causal receipt. Defeat alone is not sufficient.
- The health/injury resolver exclusively advances recovery from elapsed authoritative time and typed inputs.
- Rest, activity/use, nutrition/body state, treatment, and explicitly capable magic emit inputs or receipts; none independently edits recovery progress.
- The resolver determines complete functional recovery and closes active adjustments.
- Overuse or reinjury must be an observed causal input. It may delay recovery, change use posture, or create a new injury; it cannot randomly make every injury chronic.
- A complication is a separate typed state or converted recovery class with its own causal receipt. It is not an implicit flag added by elapsed time without an accepted rule.
- Treatment may accelerate progress, reduce impairment, or prevent a complication, but natural recovery cannot require professional treatment by definition.

### Effects and stacking

Each injury emits bounded, typed contributions to the single current-attribute/context resolver. It does not mutate base attributes or write final current values directly. Multiple injuries combine through that resolver's owner-approved aggregation and caps, with body region and effect category available for deduplication. Body condition and nutrition-derived structural loss must enter through their own contributions so the resolver can prevent double counting.

Use restrictions should be capability/action-context predicates rather than universal action bans. UI explanation should identify the injury, relevant action, burden, and expected recovery state. Scars may remain a Chronicle/appearance descriptor after resolution; persistent impairment requires a separate accepted irreversible-harm state.

## 7. `Shaken Spirit` Trauma Contract Plan

`Shaken Spirit` should be a separate active condition instance under the same broad health/condition domain, not a combat string, settlement morale value, personality rewrite, or magical soul state.

The instance needs:

- stable id and static `Shaken Spirit` identity;
- source event receipt;
- trigger ids or lore-compatible trigger categories;
- current expression tags such as dread, nightmares, avoidance, vigilance, suspiciousness, startle, withdrawal, or event-linked panic;
- current burden and recovery course;
- safety, support, counsel, ritual, treatment, and elapsed-time input receipts;
- current contextual-effect contributions;
- active, dormant, resolved, or persistent status;
- last progression and any causal relapse receipt;
- Chronicle-facing explanation that preserves source and course.

Combat fear/status, body fatigue/sleep, Knowledge, relationship/household state, events, and Chronicle can supply inputs or projections. None currently owns persistent trauma. Event and quest systems should emit source/trigger receipts; the trauma resolver decides whether and how `Shaken Spirit` changes.

Lore-compatible support can come from companions, household members, mentors, healers, confessors, spiritual counsel, community ritual, or culturally specific care. Those owners provide typed support inputs. They do not directly overwrite the trauma instance.

Guardrails:

- consequences remain proportional, explainable, and tied to source or triggers;
- no immutable-attribute or authored-personality mutation;
- no diagnosis catalog;
- no assertion of soul damage, possession, insanity, or moral weakness;
- no arbitrary forced dialogue, betrayal, violence, self-harm, or destructive player action;
- expression should prefer warnings, contextual burdens, optional reactions, forecastable checks, and player-addressable support;
- recovery may occur naturally, through support, through focused care, or not during the observed campaign;
- relapse requires a causal trigger receipt and cannot reroll on load.

## 8. Irreversible-Harm And Adaptation Plan

No live anatomy or body-region authority is sufficient for normally irreversible harm. A later focused owner must distinguish:

1. anatomy truth: present, absent, destroyed, or otherwise structurally changed;
2. wound state: open, stabilized, or closed;
3. persistent impairment;
4. rehabilitation/adaptation progress;
5. prosthetic or assistive compensation;
6. current functional capability;
7. extraordinary restoration eligibility and requirements;
8. atomic restoration completion.

Time, generic rest, treatment, and ordinary healing may close wounds, stabilize the character, support rehabilitation, and improve adaptation. They cannot recreate destroyed anatomy. Equipment/inventory can later host a prosthetic item, but equipping it must contribute capability through a prosthetic/adaptation contract rather than claiming anatomical regrowth.

Current generic equipment slots, body state, item content, and descriptive health vocabulary are possible integration seams, not permission to invent an all-purpose anatomy schema in the defeat package. Normally irreversible harm must remain exceptional, strongly causal, explicitly forecast/surfaced, and absent from the generic Normal Stakes fallback.

## 9. Magical Restoration And Resurrection Boundaries

The static spell catalog contains 55 records, including 12 names/descriptions associated with healing or regeneration. Combat runtime can execute HP restoration through `heal.hp`; several other spell rows remain descriptive/deferred under the magic runtime boundary. The service catalog contains five provider-independent services—lodging, market exchange, warehouse storage, archives, and contract board—and no healer/treatment/restoration service. Static bandage, tonic, elixir, and poultice items are descriptors without a proven active injury-treatment owner.

No player content/runtime match was found for resurrection, revival, limb or organ restoration, or anatomical regrowth. There is no corpse, soul-return, sacred-site restoration, healer-rarity, or restoration-access owner. Chronicle and saves can eventually preserve results but do not define them.

The future contract must keep four capability classes distinct:

| Capability | Permitted result | Required owner boundary |
| --- | --- | --- |
| Ordinary healing | Restore HP, close or support wounds, assist naturally recoverable injuries where explicitly integrated. | Resource/health resolver; never implies anatomy creation. |
| Exceptional restoration | Reverse a specifically declared persistent condition or transformation. | Explicit magic capability plus condition/anatomy eligibility. |
| Regrowth | Recreate specifically destroyed/absent anatomy. | Extremely rare explicit capability, anatomy transaction, access/requirements authority. |
| Resurrection | Return from an accepted actual-death state. | Separate death, Stakes, magic, continuity, and persistence contract. |

The existence of resurrection in setting lore would not determine its Normal Stakes mechanics. Restricted-Stakes terminal closure cannot be bypassed. Exact spells, prices, provider counts, probabilities, materials, rituals, time windows, corpse rules, institutions, and soul rules remain deferred.

## 10. Difficulty, World, And Stakes Interaction Matrix

| Axis | May tune | Must not redefine |
| --- | --- | --- |
| Story | Coarse consequence weighting, generous recovery duration/effectiveness, reduced-use burden, complication resistance, trauma support effectiveness, and precise/early warnings. | Source event, anatomy truth, immutable base attributes, actual spell capability, or Stakes death/resurrection boundary. |
| Favored | Favorable weighting, recovery pace, treatment effectiveness, use burden, complication resistance, trauma recovery/support, and forecast clarity. | The same invariant truths. |
| Mortal | Baseline values for the authorized tunables. | The same invariant truths. |
| Forsaken | Harsher authorized tunables and less forgiving forecasts, within bounded playability. | Cannot silently become Grim World or restricted Stakes; cannot create permanent harm from generic defeat. |
| Heroic World | Initial coarse injury/trauma contracts and broad access assumptions once implemented. | Cannot make generic healing regrowth or erase source/anatomy truth. |
| Grim World | Later typed modules for infection, sanitation, access, complication, or cultural stigma; each needs an owner and Story adapter. | Cannot make all injury/trauma ubiquitous or smuggle unowned disease/permanence into defeat. |
| Normal Stakes | Nonterminal default defeat and context-owned consequences; later death/resurrection only if separately accepted. | Ordinary HP zero cannot archive/delete saves or settle terminal Legacy/Prestige. |
| Future restricted Stakes | Separate defeat versus actual-death rules, one continuity stream, terminal commitment, and accepted resurrection boundary. | Terminal closure remains irreversible; Normal Stakes fallback cannot override it. |

Difficulty is not a truth selector. World Rules select supported modules, not anatomical facts. Stakes owns continuity/death closure, not ordinary healing math.

## 11. Owner And Persistence Matrix

| Concern | Single owner | Persistence / projection |
| --- | --- | --- |
| Static injury/condition vocabulary | Content plus descriptive schema/lint authority | Content identity only; no active state. |
| Active injury instance | Player health/injury domain | Inside `PlayerState` and the existing `SaveSnapshot`. |
| Active trauma instance | Player trauma/condition resolver within the health domain | Inside `PlayerState`; Chronicle/UI are projections. |
| Source event receipt | Causing system/event ledger | Stable id referenced by consequence instances and Chronicle. |
| Body region/anatomy | Future anatomy/capability domain | Player/actor state; never inferred from equipment. |
| Recovery progression | Health/injury resolver | Persist progress and last authoritative tick/input ids. |
| Treatment | Future treatment/service/item action owner | Emits idempotent treatment receipts consumed by health. |
| Complication | Health complication resolver | Typed active state plus causal receipt. |
| Current-attribute adjustments | One central current-attribute resolver | Derived/cached projection with owner-tagged inputs; base is immutable. |
| Activity/use restrictions | Injury resolver supplies predicates; action owner enforces | Persist posture/effect identity, not duplicated action state. |
| Magic restoration | Magic execution plus health/anatomy transaction | Atomic accepted result and capability/requirement receipts. |
| Prosthetic/equipment compensation | Equipment/prosthetic capability adapter | Item remains inventory truth; capability is derived through adapter. |
| Resurrection | Future death/Stakes/magic authority | Atomic continuity and save/history transaction. |
| Actual death | Future death/Stakes authority | Separate explicit terminal receipt; not inferred from HP zero. |
| Defeat fallback | Campaign Stakes/defeat resolver | Defeat receipt and resulting authoritative snapshot. |
| Safe-location resolution | World/location recovery resolver | Destination/fallback provenance persisted in defeat receipt. |
| Time advancement | Existing authoritative gameplay clock | Defeat resolver requests one accepted advancement. |
| Save identity | Existing snapshot/save owner | Extend the existing snapshot; no parallel health save. |
| Chronicle projection | Chronicle projector | Reads receipts/state; never owns health truth. |
| UI explanation | Application projection | Reads accepted receipt/result; no rule authorship. |

The health container should be player-state-owned and extensible to actor/party domains later. Separate physical-injury and trauma instances may share receipt, persistence, and projection infrastructure while retaining distinct resolvers.

## 12. Migration And Compatibility Risks

- Existing HP-zero saves are currently terminal on load. The first package must choose an explicit one-time fallback/repair migration and persist its receipt before play.
- Current save compatibility is version-exact, and `migrateSnapshotForEcho` has no health migration. Campaign/defeat additions require synchronized schema/type/mirror/default/migration work.
- `PlayerState.attributes` lacks the accepted immutable-base/current split. Injury/trauma implementation before that resolver risks permanent mutation or double counting.
- `activeEffects: string[]` may collide with future typed instances. Treat strings as labels/projection inputs, never migrate them blindly into injuries or trauma.
- Combat status identities and persistent condition identities need stable namespace rules to prevent one transient effect becoming two authorities.
- No last-safe-location identity exists. Deriving it from the current location on every load would be nondeterministic after content changes.
- Current rest fully restores resources and advances time. Reusing it directly as defeat recovery could charge money, overrestore, or duplicate injury progression.
- Save/load must not repeat time advancement, resource restoration, relocation, consequences, Chronicle entries, or payout. Stable receipt ids and consumed-source ids are required.
- Archived/deleted account history must remain blocked. The migration must rescue only active Normal Stakes HP-zero snapshots, never reopen an explicitly terminal record.
- Legacy `dead` and `hardcore_dead` history remains historical truth. Legacy Hardcore is not a future restricted-Stakes id.
- Party health is incomplete. The first package must preserve party membership and avoid inventing companion injuries/deaths.
- Static content already accepts broad injury families, but active mechanics must not infer behavior merely from those names.
- TypeScript and tracked JavaScript mirrors must land atomically and remain synchronized.

## 13. Implementation Package Sequence

### Required for the first atomic campaign-rules/defeat implementation

1. Add campaign-rules identity, versioned save state, migration provenance, and Normal Stakes defaults as already accepted.
2. Add an engine-owned deterministic defeat receipt/result contract and route both snapshot change and run entry through it. Restrict `archiveActiveRun` to an explicit accepted terminal result.
3. Add deterministic recovery-location provenance and fallback migration, one-time time/resource recovery, encounter cleanup integration, Chronicle/notice projection, immediate persistence, repeated-loop protection, and legacy active HP-zero handling.
4. Update focused lifecycle/combat/save/travel tests and synchronized TypeScript/JavaScript mirrors in the same atomic package.

The first package does not require injury, trauma, anatomical harm, restoration, or resurrection. Steps 1-3 may need to land atomically so `normal_stakes` is never live beside automatic save deletion.

### Safe immediate follow-up

5. Add read-only campaign/defeat projection and a typed context-outcome adapter for rescue, surrender, capture, law, or quest outcomes. Preserve the default when no adapter answers.

### Later health/injury package

6. Land the immutable-base/current-attribute resolver and its single owner-tagged adjustment path if not already present.
7. Add player health/injury instances, save migration, static vocabulary expansion, recovery/use/treatment/complication input contracts, Chronicle projection, and naturally recoverable Minor/Moderate/Major tests.
8. Implement naturally recoverable injury progression without irreversible anatomy.

### Later trauma package

9. Add `Shaken Spirit` identity, active instance, source/trigger/support inputs, recovery/dormancy/relapse contract, save/Chronicle projection, attribute/context integration, and agency guardrails.

### Later magical-restoration package

10. Decide and add body-region/anatomy, persistent impairment, adaptation, prosthetic capability, and restoration eligibility contracts.
11. Decide explicit extraordinary restoration/regrowth capabilities, access owners, requirements, and atomic health/anatomy transactions.

### Later resurrection/death package

12. Decide Normal Stakes actual-death/resurrection semantics, if any, through a focused death-and-magic authority. Integrate future restricted Stakes without weakening its terminal closure.

No release number is assigned.

## 14. Validation Matrix

| Obligation | Minimum proof |
| --- | --- |
| Normal Stakes HP zero is nonterminal | Combat and noncombat HP-zero tests preserve the active run, account state, manual saves, and quick save; no payout/estate transaction occurs. |
| Explicit terminal routes remain separate | Retirement and an explicit test-only terminal receipt still exercise archival, payout idempotency, history, estate, slot deletion, and stale-copy blocking. |
| Deterministic fallback | Identical snapshot/source/context produces identical destination, time, resources, receipt id, Chronicle data, and save after reload. |
| Idempotence | Reapplying the same source receipt produces no second relocation, time advance, restoration, consequence, or Chronicle entry. |
| No soft lock | HP-zero encounter clears safely, restored resources permit an action, and danger/re-entry protection prevents immediate unchanged retrigger. |
| Missing safe location | Produces persisted nonterminal recovery-pending/diagnostic behavior, never random movement or archival. |
| Optional consequences | Baseline defeat creates neither injury nor `Shaken Spirit`; explicit context fixtures may add either independently. |
| Natural recovery | Minor, Moderate, and Major naturally recoverable instances can each reach complete functional recovery. |
| Injury-specific use | Ordinary/reduced/protected postures affect only declared actions/capabilities. |
| Treatment compatibility | Natural and treatment-assisted paths consume the same progression authority without duplicate healing. |
| Causal complications | Only accepted overuse/reinjury/complication receipts create or convert complication state, and the result roundtrips. |
| Attribute integrity | Injury, trauma, body condition, and structural loss contribute once through the central resolver; immutable base values do not change. |
| Scar boundary | Resolved scar presentation alone creates no persistent impairment. |
| `Shaken Spirit` identity | Schema/content/runtime tests reject magical soul damage and diagnosis identities as substitutions. |
| Trauma course | Fixtures prove self-resolution, support-assisted recovery, dormancy/relapse from a causal trigger, and long persistence. |
| Agency | Trauma cannot author personality or arbitrary dialogue, betrayal, violence, or self-destructive commands. |
| Irreversible harm | Time, rest, treatment, and ordinary `heal.hp` do not restore destroyed anatomy. |
| Prosthetic distinction | Assistive equipment improves declared capability while anatomy remains absent/destroyed. |
| Magic capability | Only an explicitly capable restoration action can atomically alter anatomy; generic healing is rejected. |
| Resurrection/Stakes | Resurrection requires accepted death/Stakes authority; restricted terminal records remain closed and blocked on copied saves. |
| Save/load truth | Recovery progress, consequence choice, trauma triggers, anatomy, and restoration do not reroll or reapply. |
| Story/Grim gates | Unsupported Story adapters and Grim modules remain unavailable; Story remains coarse and Grim cannot become universal consequence injection. |
| Mirrors and held route | TypeScript/JavaScript parity checks pass and held `0.6.6` remains blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`. |

## 15. Exact Remaining User Decisions

1. Accept the safe-location fallback order and the nonterminal behavior when no destination validates.
2. Choose the qualitative resume-resource policy: HP floor, Stamina playability rule, MP posture, and whether any generic body/fatigue burden belongs in the default.
3. Choose the recovery/re-entry protection posture that prevents immediate repeated defeat.
4. Decide whether an active legacy HP-zero save automatically receives the fallback on load or enters a visible one-time repair flow.
5. Choose the first context-outcome extension priority and its adapter boundary: rescue, capture, surrender, law, or quest.
6. Choose the initial party/guest posture after player defeat while durable party health is absent.
7. Choose the first naturally recoverable injury vocabulary and whether body-region granularity lands with it or later.
8. Confirm a player-state health container with separate physical-injury and trauma instances as the active-state boundary.
9. Choose multiple-injury aggregation/cap policy for the future current-attribute resolver.
10. Choose initial `Shaken Spirit` trigger, expression, support, dormancy, and relapse vocabulary.
11. Decide the anatomy/capability model and the exact prosthetic-versus-anatomy ownership boundary.
12. Decide which future magical capability classes may perform exceptional restoration or regrowth and which service/access owner controls them.
13. In a later death-focused decision, decide whether Normal Stakes supports actual death and resurrection at all. This is not required for nonterminal defeat.

## 16. Explicit Non-Decisions

This audit does not:

- accept or implement any runtime contract;
- change HP-zero, archival, save deletion, retirement, estate, Legacy, or Chronicle behavior;
- select exact recovery times, resource values, penalties, rates, probabilities, costs, provider counts, or balance curves;
- make injury, trauma, capture, loss, or permanent harm automatic on defeat;
- define a complete injury, disease, anatomy, disability, treatment, healer, spell, ritual, corpse, or diagnosis catalog;
- define exact body regions, complications, prosthetic slots, restoration spells, materials, sacred sites, soul rules, or resurrection windows;
- authorize generic healing to restore anatomy or resurrect;
- authorize trauma to rewrite personality or agency;
- add a restricted-Stakes id or alter its accepted terminal closure;
- make Story or Grim selectable;
- assign a release/version number;
- create an implementation prompt;
- restore held `0.6.6` or alter retained `0.6.7` artifacts.

The next safe action is a focused human/GPT acceptance decision for the Normal Stakes defeat fallback and recovery receipt. Implementation remains unauthorized.
