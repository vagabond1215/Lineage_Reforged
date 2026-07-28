# Activity Resolution Existing-System Reuse Audit

Date: 2026-07-28

Status: accepted documentation-only repository audit; no implementation permission

Source run: unversioned `Activity Resolution Existing-System Reuse Audit`

Milestone impact: `supports_current_band`

## 1. Exact Live Baseline

The audit was reproduced on clean synchronized `master` at `3d77171ca2034c8b2fb8d19f374cef5df9605053`.

### 1.1 Skills and legacy Skill Trials

- The skill catalog has 121 records: combat 34, crafting 20, knowledge 7, leadership 10, magic 14, resource 18, settlement 7, and survival 11.
- Every skill declares maximum rank 125.
- Five overlapping progression bands are live: Clumsy 1-30, Familiar 25-55, Proficient 50-80, Skilled 75-100, and Mastery 100-125.
- Breakthrough gates are 30, 55, 80, and 100. Rank gain stops at a locked gate.
- Four trial records exist: sword, blacksmithing, elemental magic, and Flora Knowledge. Together they have 12 checkpoints, 8 rewards, and 8 penalties.
- Trial content stores one threshold-to-pass, current/default progress, maximum potential, an Echo requirement, cumulative checkpoint thresholds, opaque reward/penalty objects, and an associated skill.
- `canAttemptTrial(...)` checks only the Echo requirement.
- `evaluateTrialOutcome(...)` accepts caller-supplied success progress, potential loss, and checkpoint ids; unions checkpoints; adds non-negative progress; passes at the threshold; and fails when reduced potential drops below the threshold.
- `PlayerTrialProgressState` persists trial id, skill id, progress, potential, completed checkpoint ids, and passed/failed flags through optional `playerState.activeTrials`.
- No attempt id, phase/node state, choice, check result, continuous margin, result band, cooldown, recovery state, participant aggregation, occurrence, command, event, or replay evidence is owned.
- `accumulateBreakthroughProgress(...)` also accepts an unowned `rngBonus`; that parameter is not named uncertainty-channel authority.

### 1.2 Knowledge trial foundation

- One active Flora tier-1 eligibility policy exists.
- Knowledge completion, eligibility, and readiness evaluators are pure explicit-input helpers.
- The strict readiness-policy schema and readiness evaluator already exist.
- The readiness evaluator can characterize explicit attempt, cooldown, sequence/time, and availability records when a caller supplies complete authority. Tests explicitly prevent attempt creation and checkpoint resolution.
- The live Flora policy has `readinessPolicyId: null`; there is no authored readiness-policy content wrapper or normal-lint registration for one.
- No content-to-helper adapter, attempt creator, checkpoint resolver, outcome owner, cooldown owner, reward applier, mutable Knowledge trial state, persistence contract, runtime command, or UI exists.
- Reward references are inert reported metadata.

### 1.3 Quest action trees

| Collection | Records | Nodes | Checks | Authored outcome branches | Effect tokens |
| --- | ---: | ---: | ---: | ---: | ---: |
| Quest archetypes | 8 | 35 | 137 | 111 | 180 |
| Quest definitions | 5 | 20 | 54 | 44 | 68 |
| Quest templates | 36 | not applicable | not applicable | not applicable | not applicable |

Archetype nodes use planning, execution, and resolution phases. Checks use attribute, skill, ability, spell, tool, item, party-size, and `rng` kinds. Branches use critical-success, success, partial, failure, and critical-failure slots with next-node id, quest-state, summary, and opaque string effects.

Schemas and semantic validators enforce strict shapes, unique/local node identity, entry/completion closure, next-node closure, participant ranges, supported check kinds, and selected target references. They do not define:

- a continuous check formula;
- result-band thresholds;
- participant contribution or aggregation;
- typed effects;
- effect idempotency;
- attempt identity or mutable node state;
- seed/channel evidence;
- runtime execution.

The civilization engine loads archetypes and definitions, but current offer generation uses quest templates. Current quest acceptance and tracking are engine-owned commands; action-tree resolution is not a runtime consumer.

### 1.4 Crafting, production, workplaces, and jobs

- 28 planned recipe records span 10 families.
- 121 production chains contain 311 processing steps: 35 easy, 216 moderate, and 60 hard.
- 58 workplaces contain 208 job rows across 110 unique job ids.
- 15 workplace-abstraction records exist.
- Recipes own bounded static transformations and required workplace/tool/skill references.
- Production chains own descriptive processing steps, stage refs, intensities, difficulty tiers, variants, and value-propagation inputs.
- Workplaces own capability, workforce-role, tool-tag, and input/output descriptors. Job ids are nested local role vocabulary, not a canonical selected-worker or employment runtime owner.
- `resolveCraftAtSettlement(...)` is a synchronous deterministic estimate. It derives input/output quantities, time, cost, waste, quality/quantity factors, and explanations from production-chain/workplace/market/skill inputs.
- The craft estimate creates no attempt, work order, item instance, reservation, inventory consumption, output ownership, progress, interruption, failure, recovery, command, event, or save mutation.

### 1.5 Activity selection and advancement

Engine-owned activity selection has a command, deterministic command identity, snapshot revision, stale checks, atomic accepted transition, typed event, and accepted-only UI application. It writes only the current activity descriptor.

`previewAdvanceCurrentActivity(...)` and `advanceCurrentActivity(...)` remain in `apps/rpg-ui/src/game-shell/gameplayLoop.ts`.

- Preview projects two clock ticks and body-state consequences for one of two tracked-quest special cases or a generic shift.
- Execution directly mutates clock/body/resources, flags, skills, operations, inventory, discoveries, current activity, notifications, Chronicle, and synchronized projections.
- Survey, rivet procurement, and generic work shifts are hard-coded branches.
- Preview does not represent the full execution consequence set.
- No command/result/event, occurrence, attempt id, stale command boundary, typed effect proposal, or replay receipt exists for advancement.

Rest and quest turn-in are adjacent bespoke UI-owned mutation paths and are not activity-resolution authority.

### 1.6 Difficulty

Persisted run difficulty is tier `easy | normal | hard | brutal` plus Hardcore boolean. `rule.run_difficulty_balance` resolves global scalars for stat growth, skill progression, Knowledge progression, body state, Echo, Prestige, and Hardcore.

These are domain-wide balance modifiers. They do not own target difficulty, method difficulty, minimum/recommended competence, result bands, uncertainty width, activity depth, familiarity, or compression.

### 1.7 Magic

- 55 spells exist: 23 runtime-compatibility `ready`, 5 `partial`, and 27 `deferred`.
- Four descriptive magic-infrastructure records exist.
- Known-spell ownership/evidence, read-only projections, hook-support classification, cast readiness, resolver-readiness validation, and inert resolver envelopes exist.
- Inert envelopes always report `effectsApplied: false`.
- There is no live cast resolver applying general spell costs/effects.
- Narrow combat-hook support remains combat-owned and does not make magic a shared activity resolver.
- Magic-study source identity and study attempt/progress/cooldown/outcome owners remain separate and incomplete.

### 1.8 Determinism, synchronization, and persistence

Travel, quest acceptance, quest tracking, and activity selection provide the reusable engine-command pattern:

- normalized command intent;
- player and snapshot-revision facts;
- deterministic command id including a domain discriminator;
- plan/execution parity;
- stale rejection;
- clone-then-apply atomicity;
- typed accepted event;
- accepted-only UI application;
- full snapshot synchronization.

Current event ids remain compatibility projections derived from command id and tick. The local FNV-like snapshot hashes are deterministic revision/identity inputs, not uncertainty. `DeterministicRng` is an unversioned stateful algorithm utility with no domain/channel authorization, occurrence identity, retained draw receipt, or live consumer in this lane. `Math.random` uses are UI/auth/character-creation concerns and are nonauthoritative here.

Current saves can persist trial accumulator state, current activity, quest journal, operations, inventory, skills, body state, difficulty, and other applied consequences. They do not persist shared activity definitions, attempts, nodes, check evidence, result bands, effect proposals, uncertainty receipts, or consequence receipts.

## 2. Authority Matrix

| Concept | Static owner | Mutable owner | Current consumer | Validation | Tests | Persistence | UI owner | Missing owner | Promotion posture |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Eligibility | Skill Trial Echo requirement; Knowledge eligibility policy | Player progression facts supplied by caller | `canAttemptTrial(...)`; Knowledge eligibility helper | Trial schema/content lint; Knowledge policy schema/semantic lint | Player progression; Knowledge policy/helper tests | Skill/Knowledge inputs only; no activity eligibility record | None | Shared vocabulary and adapter | `reuse_via_adapter` |
| Readiness | Knowledge readiness schema; magic readiness contracts | Caller-supplied Knowledge facts; known-spell/cast context | Pure Knowledge and magic readiness helpers | Strict schemas and helper input checks | Knowledge readiness and magic contract tests | No authored Knowledge readiness record or shared readiness state | None | Domain adapters and live Knowledge readiness authority | `domain_owned` |
| Depth selection | Planning document only | None | None | None | None | None | None | Static policy and selector | `missing_static_authority` |
| Attempt identity | None; engine command identity is distinct | None | None | Command ids have domain-specific validators | Command collision/parity tests only | None | None | Definition inputs, mutable attempt owner, persistence | `missing_mutable_owner` |
| Phase/node | Quest-local action trees | None | Validation/load only | Quest schema and graph closure validator | Quest content validation | Authored content only | None | Shared grammar and mutable cursor | `reuse_via_adapter` |
| Check | Quest-local check descriptors | None | Validation/load only | Check-kind/reference validation | Quest content validation | Authored content only | None | Formula, evidence, margin, resolver | `reuse_via_adapter` |
| Continuous margin | None | None | None | None | None | None | None | Formula and typed result | `missing_static_authority` |
| Result band | Quest branch slot vocabulary | None | Validation/load only | Slot and branch closure validation | Quest content validation | Authored content only | None | Shared thresholds and semantics | `reuse_via_adapter` |
| Branch | Quest-local next-node and quest-state branch | Quest journal owns only current live offer/tracking facts | No action-tree executor | Quest graph closure validation | Quest content and engine quest-command tests | Quest journal, not action-tree cursor | Quest panels project journal state | Action-tree execution boundary | `domain_owned` |
| Recovery | Body recovery gate and planning vocabulary | Player body state | UI gameplay loop for body consequences | Domain-specific guards | Gameplay-loop/body tests | Body state only | Activity/rest presentation | Activity recovery node/state | `reuse_via_adapter` |
| Consecutive soft failure | None | None | None | None | None | None | None | Counter semantics and owner | `missing_mutable_owner` |
| Participant role | Quest assigned-role ranges; workplace job roles | Party/workforce facts are owner-local | Validation and craft estimate context | Quest/workplace validators | Quest/workplace/craft tests | No attempt contribution record | None | Contribution authority and aggregation | `reuse_via_adapter` |
| Aggregation | None | None | None | None | None | None | None | Rule vocabulary and evidence | `missing_static_authority` |
| Metric/accumulator | Trial thresholds; production-chain/workplace factors | `PlayerTrialProgressState`; no craft work order | Trial outcome helper; craft estimate | Trial/craft content validation | `tests/unit/player-progression.test.mjs`; civilization economy tests | Trial accumulator only | Activity panel indirectly shows applied skill state | Adapter contracts; craft mutable owner | `domain_owned` |
| Familiarity | None | None | None | None | None | None | None | Target/method/process dimensions and character state | `missing_static_authority` + `missing_mutable_owner` |
| Reliability/compression | Planning document only | None | None | None | None | None | None | Evidence, threshold, invalidation, projection | `missing_static_authority` |
| Typed effect | Quest strings and owner-local domain operations | Domain state owners | UI advancement applies direct mutations | Domain-specific only | Gameplay-loop and domain tests | Applied domain state, no effect receipt | UI currently initiates advancement | Shared envelope and owner routing | `blocked_by_owner` |
| Terminal status | Trial pass/fail; quest state vocabulary | Trial accumulator; quest journal | Trial helper; quest commands for journal state only | Domain schemas/validators | Progression and quest tests | Trial and journal state | Quest/activity panels | Shared terminal vocabulary and occurrence receipt | `reuse_via_adapter` |
| Cooldown | Knowledge readiness schema can describe policy | Caller-supplied fixtures only | Knowledge readiness helper | Input/schema checks | `tests/unit/knowledge-trial-readiness.test.mjs` | None | None | Authored policy content and mutable cooldown owner | `missing_mutable_owner` |
| Reward/progression proposal | Trial reward objects; inert Knowledge reward refs | Progression and other domain owners | No generic proposal consumer | Structural/domain validation only | Current progression tests do not apply authored rewards | No proposal or receipt | None | Typed proposal, acceptance, and application owners | `blocked_by_owner` |
| Deterministic seed/randomness evidence | Domain command-id inputs; unversioned RNG utility | RNG utility state only | Command identity/revision; no activity uncertainty consumer | Domain command guards | Command collision/parity tests | No channel/draw/result evidence | None | Named channel, seed owner, occurrence-scoped receipt | `reject_generalization` |

No existing collection is a shared activity-definition or shared mutable-attempt owner.

## 3. Quest Action-Tree Reuse Decision

Decision: quest action trees remain quest-owned while a separate shared grammar is authored.

Selected posture:

- phase labels, check-kind names, result-band names, local graph closure, and participant-range concepts are `reuse_via_adapter` evidence;
- quest node ids, branches, quest-state transitions, summaries, and effect strings remain `domain_owned`;
- action trees are not promoted wholesale.

Reasons:

1. check fields do not define calculation or continuous margin;
2. `rng` is an authored check label without channel authority;
3. result slots have no shared thresholds;
4. effect strings combine presentation, proposed consequences, and owner-local shorthand;
5. graph identity is record-local;
6. participant roles have no contribution/aggregation semantics;
7. there is no runtime executor or persisted attempt state.

A later quest adapter may translate validated shared results into quest-owned branch proposals. It must never let a generic resolver apply quest effects directly.

## 4. Legacy Trial Adapter Decision

The current trial model is `state_accumulator`.

Preserve:

- 125-rank maximum and gates 30/55/80/100;
- four accepted trial records;
- cumulative progress;
- maximum-potential reduction;
- checkpoint-id union;
- pass when progress reaches threshold;
- fail when remaining potential falls below threshold;
- persisted `PlayerTrialProgressState`.

Current checkpoint thresholds are descriptive cumulative milestones. `evaluateTrialOutcome(...)` does not calculate checkpoint completion from progress; callers supply ids. Pass and potential-exhaustion failure can coexist with future node outcomes only through an adapter that translates accepted node results into the existing accumulator inputs.

Select a read-only adapter first:

`legacy_skill_trial_state_accumulator_adapter`

It may project definition, current accumulator, checkpoint milestones, and terminal state into future simulation inputs. It may not mutate state, invent attempt identity, award rewards, or reinterpret opaque penalty/reward content.

No content migration is justified now. Migration requires accepted shared node/result vocabulary, attempt identity, typed effects, and parity tests. Existing progression and trial tests remain the behavior lock.

## 5. Knowledge Attempt Gap Decision

| Layer | Current state |
| --- | --- |
| Completion | pure helper exists |
| Eligibility | strict policy content, semantic validator, normal-lint registration, and pure helper exist |
| Readiness schema/helper | exists |
| Authored readiness content | absent; live eligibility reference is null |
| Content-to-helper adapter | absent |
| Attempt creation | absent |
| Checkpoint resolution | absent |
| Outcome | absent |
| Cooldown authority/state | absent; evaluator accepts explicit fixtures only |
| Reward | references inert; no owner or applier |
| Storage/persistence | no Knowledge trial attempt/readiness state owner |
| Runtime/UI | absent |

The roadmap entries that still call `0.5.161 - Knowledge Trial Readiness Policy Schema` "next" are `documentation_stale`: the schema and focused contract are landed. The unassigned `0.5.x` checkpoint/cooldown/study rows are historical placeholders, not executable versions.

The smallest future Knowledge lane is still authored readiness content plus an explicit content-to-helper adapter plan. It is not the immediate shared-activity implementation.

## 6. Crafting Process-Profile Decision

Recipes, production chains, workplaces, item instances, and mutable work orders remain separate.

The minimum future static crafting process authority is:

`crafting.activity_process_profiles`

One record should reference one canonical recipe or approved chain path and own only crafting-specific activity structure:

- typed phase/node identities;
- phase objective;
- allowed preparation/choice families;
- crafting metrics such as conformance, quality, progress, waste, safety, tool condition, and recoverability;
- minimum/recommended competence references;
- allowed recovery edges;
- terminal output proposal categories;
- adapter/version/provenance notes.

A separate shared activity grammar should own neutral node, check, margin, result-band, aggregation, and recovery vocabularies. The crafting profile composes that grammar and supplies domain metrics; it does not duplicate it.

`resolveCraftAtSettlement(...)` may later be reused through an estimate adapter for deterministic material/time/cost context. It must not be treated as a work-order, attempt, inventory, or output resolver.

## 7. Gathering Difficulty And Familiarity Gap

No live authority owns the required gathering execution facts.

| Required concept | Current posture |
| --- | --- |
| Target difficulty | absent; quest and production difficulty are owner-local |
| Minimum/recommended competence | absent |
| Method identity | absent |
| Target/method familiarity | absent |
| Yield/condition/safety/site-impact dimensions | quest strings and ecology descriptors only |
| Source depletion/regrowth | authored flora/fauna/ecology descriptors exist, but no gathering-node state |
| Item creation | no gathering command/output owner |
| Automation/compression reliability | absent |

Flora/fauna output and regrowth metadata remain ecology/source descriptors. Production-chain difficulty remains process-local. Neither may be inferred into a gathering resolver.

Gathering stays `blocked_by_owner` until the competence/difficulty/familiarity/compression plan decides identities and a later gathering-source/method profile owns domain inputs.

## 8. Activity Advancement Integration Decision

Future shared attempt resolution should integrate through domain-owned commands that call pure shared planning/resolution components.

Do not make `advanceCurrentActivity(...)` the generic resolver.

Required transition:

1. characterize each current advancement branch;
2. give each domain normalized intent and authoritative facts;
3. create a domain-owned command/plan/result/event boundary;
4. allow a pure shared resolver to return proposals only;
5. route typed proposals to explicit owners;
6. atomically apply accepted consequences;
7. synchronize and project afterward.

Engine-owned activity selection remains separate. `currentActivity` is a presentation/selection pointer, not an attempt, work order, node cursor, or consequence owner.

## 9. Determinism And RNG Decision

Reuse the accepted command discipline through adapters:

- canonical normalized intent;
- snapshot revision and stale checks;
- explicit domain discriminator;
- preview and execution from one material-fact plan;
- clone/validate/apply atomicity;
- typed accepted result/event;
- accepted-only UI application.

Do not reuse current hashes as uncertainty, use event-envelope ids as occurrence identity, or consume `DeterministicRng` directly as committed authority.

Future uncertainty requires:

- domain-named channel id and semantic role;
- occurrence/attempt identity;
- channel/policy/algorithm version;
- owner-certified material inputs;
- occurrence-scoped draw ordinal/cardinality;
- retained private draw/result evidence;
- accepted domain result;
- replay and correction policy.

Deterministic graph simulation uses no uncertainty channel. Test fixtures should exercise zero-width deterministic cases, explicit named-channel evidence, replay equality, reordered unrelated channels, stale input, duplicate delivery, and correction.

## 10. Typed Effect Ownership Matrix

| Effect family | Authoritative owner | Shared-resolver posture |
| --- | --- | --- |
| Time/body/resource cost | clock/player body/resource owners | propose only |
| Inventory consume/create/move | future inventory transaction owner | blocked |
| Craft output/quality/work order | future crafting work-order owner | blocked |
| Gathering yield/depletion/site impact | future gathering/source-state owners | blocked |
| Skill rank/progress | player progression owner with breakthrough gates | propose only |
| Knowledge evidence/progress | Knowledge acceptance/application owners | propose only |
| Quest node/state/objective | quest owner | propose branch result only |
| Currency/market/service | economy/domain transaction owner | propose only |
| Standing/reputation/Renown | their dedicated owners | propose only |
| Spell cost/catalyst/effect/cooldown | magic casting owner | blocked |
| Combat damage/status | combat owner | reject generic mutation |
| Injury/Mortal Crisis/care | body, lethal-process, care, and crisis receipt owners | blocked pending receipt contract |
| World/ecology mutation | world/ecology owner | blocked |
| Chronicle/notification/UI | event-to-presentation projectors | project accepted facts only |

A generic resolver never mutates these owners directly.

## 11. Documentation Contradictions

1. Two roadmap rows still described the already-landed `0.5.161` readiness-policy schema as "next." Correct them to completed.
2. The subsequent anonymous `0.5.x` checkpoint/cooldown/magic-study rows are historical placeholders. Mark them non-executable rather than assigning current versions.
3. Current coordination correctly names this audit as active and the Mortal Crisis receipt contract as the restored next route.
4. The current activity-depth plan correctly calls the readiness schema/helper landed and the content/adapter/attempt layers missing.
5. The seven production research artifacts and production audit are already consumed/removed under the durable synthesis. No removed temporary artifact is required by this audit.
6. The queued Activity audit prompt is fully consumed by this accepted run and has no later consumer; remove it after installing the next active prompt.

No runtime defect was found merely because planning-only vocabularies lack implementation. The material runtime concern is the already-known UI ownership of activity advancement; this audit classifies it but does not repair it.

## 12. Exact Follow-Up Sequence

### 12.1 Immediate repository route

The later accepted restoration/mortality sequencing decision controls the immediate route:

1. `Functional State, Lethal Process, Care Requirement, And Mortal Crisis Receipt Contract Decision`;
2. bounded physiology/first-aid research only before the first executable or balance-bearing lethal-process catalog.

This audit does not displace that restored user-directed sequence.

### 12.2 Activity-resolution lane after the immediate mortality decision

1. unversioned `Competence, Difficulty, Familiarity, And Compression Authority Decision`;
2. shared node/check/margin/result-band/recovery/aggregation vocabulary;
3. attempt identity, occurrence relation, determinism, preview, replay, and persistence;
4. typed effect proposal and owner-routing contracts;
5. domain adapters, beginning read-only with legacy Skill Trials and craft estimation;
6. pure helpers and simulation-only slices;
7. read-only presentation and authoring tools;
8. separately approved mutation owners and engine commands.

Knowledge, quest, crafting, gathering, magic, travel, services, leadership, and other domains each require their own adapter/package. No shared framework implementation package is ready from this audit alone.

## 13. Acceptance Summary

Accepted:

- selected vocabulary reuse is adapter-only;
- quest action trees remain quest-owned;
- legacy trials remain a preserved `state_accumulator`;
- Knowledge readiness foundations are landed but inert;
- crafting estimates remain estimates;
- gathering remains blocked by missing difficulty/familiarity/source state;
- activity selection stays separate;
- advancement must transition through domain-owned commands;
- command determinism is reusable; current RNG/hash mechanisms are not uncertainty authority;
- typed effects remain owner-routed proposals;
- the immediate next route is the Mortal Crisis receipt contract.

This audit changes no content, schema, validator, test, helper, runtime, command/event, UI, save/persistence, progression math, economy, inventory, crafting/gathering/Knowledge/magic/combat execution, dependency, asset, generated output, or gameplay behavior.
