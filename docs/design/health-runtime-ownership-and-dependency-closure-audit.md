# Health Runtime Ownership And Dependency Closure Audit

Date: 2026-07-28

Run: unversioned `Health Runtime Ownership And Dependency Closure Audit`

Status: accepted documentation audit; one narrower documentation prerequisite is ready; static and executable implementation remain `NO_PACKAGE`

## Decision Summary

The repository has working combat-resource, metabolic-body, inventory, travel-command, save, notification, Chronicle, and account-archive seams. It does not have a live functional-state, lethal-process, care-requirement, care-attempt, assessment, qualitative-urgency, Mortal Crisis, actual-death, restoration, closure, health persistence, or correction owner.

The first dependency is not mutable runtime state. It is an exact documentation decision for:

- collision-safe lethal-process definition identity;
- one declared definition owner per process family;
- owner-specific catalog partitioning;
- a shared static-only structural envelope;
- definition lifecycle distinct from instance lifecycle;
- directional, non-owning reference posture;
- exact schema/validator/test/package boundaries.

That prerequisite is ready for documentation because:

1. grounded research integration is complete;
2. the six-process conceptual scope is accepted;
3. care capability/process-effect boundaries are accepted;
4. observer-safe assessment/presentation boundaries are accepted;
5. the current `combat_health_vocabulary` incompatibility is proven;
6. no executable or save migration is required to decide the static owner boundary.

The exact next route is unversioned `Lethal-Process Definition Owner Namespace And Shared Envelope Schema Plan`.

## 1. Live Runtime Baseline

### 1.1 Authoritative current behavior

| Surface | Exact live authority | Current writer/resolver | Validation/tests | Health-runtime limit |
| --- | --- | --- | --- | --- |
| Player resources | `PlayerResources` owns HP, MP, stamina, and XP; `PlayerResourceRuntimeState` owns modifiers, pending changes, last breakdown, and history | player/resource and gameplay paths | player-resource and save roundtrip coverage | HP is a resource, not life state, diagnosis, or process |
| Metabolic body state | `PlayerBodyState` owns energy, nutrition/protein, hydration, fatigue, intoxication, accumulated loads, and resolved multipliers | `packages/engines/player-engine/src/body-state.ts` | `tests/unit/player-body-state.test.mjs` | no injury, lethal process, care requirement, or death |
| Combat state | `CombatantState` owns combat HP/MP/stamina, `CombatStatusEffectState[]`, `incapacitated`, and `defeated` | `packages/engines/game-engine/src/combat/index.ts` | combat foundation/hook/equipment tests | encounter authority only |
| Combat damage/healing | damage hooks change combat HP and call `markCombatantDefeated`; `heal.hp` restores combat HP through combat math | combat resolver | combat hook/spawn tests | no process, care, assessment, or restoration semantics |
| Combat statuses | id, label, source, stacks, magnitude, start/expiry ticks, and tags | combat hook realization | combat hook/status tests | labels and tags are not process definitions |
| Inventory | `PlayerInventoryState` owns bags, stacks, and overflow | inventory/gameplay owners | inventory and roundtrip coverage | no care consumption receipt |
| Travel/location | player travel command/result/event and snapshot synchronization are engine-owned | `player-travel.ts` | travel characterization/command tests | no patient transport or crisis adapter |
| Quest/activity commands | command-specific plan, command, rejection, accepted result, event, and snapshot patterns | quest/activity engine modules | focused command/characterization tests | patterns are not generic occurrence authority |
| Save/load | JSON serialization of `SaveSnapshot`; UI manager accepts snapshot version `0.6.0` and adds narrow Echo/body defaults | shared persistence and `saveManager.ts` | save-load roundtrip tests | no health occurrence/result/receipt/correction persistence |
| Account run archive | HP at zero maps to `dead` or `hardcore_dead`, archives account history, grants/settles legacy outputs, and deletes associated saves | `runLifecycle.ts` | run lifecycle/account tests | rejected target behavior, not actual-death authority |

`GameEventEnvelope` remains a generic id/type/domain/tick/payload/tags carrier. `GameDelta` remains a broad orchestration/events/combat payload. They can transport owner-certified facts but do not provide occurrence, result, consequence-receipt, replay, or correction semantics.

### 1.2 Static metadata

The current static inventory reproduces:

- 55 spells;
- 12 healing-school spells;
- 10 spells with `heal.hp`;
- 121 skills, including Field Medicine, Water Safety, Healing Magic, and Alchemy identities;
- 9 combat roles, including healer and support metadata;
- 1,372 items;
- 6 care-like item identities with no `useProfiles` or `consumableProfileId`;
- 9 food/drink metabolic consumable profiles;
- 5 provider-independent planned services with no care service.

These records may later be referenced by accepted owner contracts. Names, roles, schools, tags, summaries, and item/service identities do not grant care capability, availability, access, admission, success, diagnosis, or process truth.

The known-spell owner can persist character-scoped acquisition evidence and read-only availability. General spell planning remains non-executing outside the combat paths already accepted. Known spell identity is not a care-capability grant or magical assessment result.

### 1.3 Current combat-health vocabulary

Current paths:

- content: `packages/content/base/game/combat_health_vocabulary.json`;
- schema: `packages/schemas/game/combat-health-vocabulary.schema.json`;
- pure validator: `tools/content-lint/combat-health-vocabulary.mjs`;
- normal-lint registration: `tools/content-lint/index.mjs`;
- focused tests: `tests/unit/combat-status-condition-injury-authority-validation.test.mjs`.

The live content has exactly two planned status records:

- `combat_status.stagger`;
- `combat_status.bind`.

The strict eleven-field record schema supports `status`, `condition`, and `injury`; `planned`, `active`, and `retired`; family and allowed-owner metadata; prose/provenance; and tags. It rejects relationship, class, mutable, formula, duration, stack, runtime, save, event, migration, UI, and gameplay fields.

This is valid non-executing combat vocabulary. It cannot host lethal-process definitions because:

- its identity namespaces are combat status/condition/injury only;
- `future_health_runtime` is a compatibility label, not an accepted owner;
- it has no owner-attributed process namespace;
- it intentionally rejects the directional static references a process definition needs;
- catalog `active` would be confused with mutable instance activity;
- it is combat-scoped while cold, heat, post-submersion, and other processes are not;
- it cannot express independent process meaning without violating its accepted boundary.

No widening or migration of this catalog is justified.

### 1.4 Presentation and compatibility projections

`apps/rpg-ui/src/runtime/bodyStatePresentation.ts` projects exactly energy, hydration, fatigue, protein, and intoxication into:

- condition strip;
- readiness card;
- metabolic recovery projection;
- stamina visual state;
- alert levels and warning streaks;
- sustained flags;
- notifications and toasts;
- consumable/action previews.

`TopStatusBar.tsx` and `uiViewModel.ts` display those projections with HP/MP/stamina and `activeEffects`/resource-modifier labels.

Current `critical`, `Compromised`, `recovery`, and `urgencyBonus` wording is local implementation terminology. It is not accepted qualitative crisis urgency, process stage, diagnosis, or observer knowledge.

Notifications, Chronicle entries, combat deltas, run-end summaries, and display prose remain projections. They cannot reconstruct missing authority.

### 1.5 UI-owned mutation and rejected target behavior

`restAtCurrentSettlement(...)` in `apps/rpg-ui/src/game-shell/gameplayLoop.ts`:

- advances four ticks with a metabolic recovery context;
- sets HP, MP, and stamina to maximum;
- clears pending resource changes;
- charges currency;
- updates activity;
- appends notification and Chronicle prose.

That remains a legacy UI-owned mutation seam. It is not care, stabilization, process resolution, convalescence, restoration, or proof of health.

`resolveTerminalArchiveReason(...)` maps HP zero to `dead`/`hardcore_dead`, and archival deletes run saves. Accepted Stakes/death authority classifies this as `rejected_target_behavior`. Historical records remain historical facts but cannot migrate into accepted actual-death results.

### 1.6 Accepted conceptual authority with no implementation

Entirely absent:

- functional-state policy, instances, and assessment results;
- lethal-process definition owner namespaces and catalogs;
- lethal-process instances and transitions;
- care requirements and reassessment;
- care-capability catalog/grants/availability/access;
- care-attempt commands, results, and owner receipts;
- Mortal Crisis episode/phase state;
- health-specific observer/viewpoint/access/assessment;
- qualitative urgency;
- renderer-safe health claims and validator isolation;
- accepted actual death and restoration eligibility;
- body-after-death and final closure;
- health-specific persistence, replay, migration, and correction.

## 2. Contract Reconciliation

### 2.1 Body/resources and functional state

Current body/resource owners are real and reusable only within their existing meanings. Accepted functional state is a separate derived owner covering present consciousness, breathing, circulation/perfusion, mobility, communication, agency, and related actionable function where later defined.

Dependency:

```text
body/resource/process/injury owner-certified facts
  -> admitted functional assessment
  -> accepted functional-state result
  -> care, transport, crisis, action, death, and observer consumers
```

Functional state may consume accepted facts. It cannot reinterpret HP, body bands, or combat labels by itself and cannot mutate their owners.

### 2.2 Injury and lethal processes

Injury vocabulary, causal injuries, environmental hazards, body state, poison, magic, and combat outcomes remain separate source owners.

A lethal-process definition is static. An active instance is mutable, belongs to exactly one process owner, affects one body, references accepted cause/result identity, progresses through owner-specific occurrences/results, and supplies bounded facts to function, care, death, crisis, and observer projections.

The static definition identity must exist before a mutable instance can reference it. This is the first unresolved dependency.

### 2.3 Care requirements, capabilities, attempts, and receipts

Accepted order:

```text
owner-certified process/function/body/injury facts
  -> care-requirement derivation
  -> capability requirement identity
  -> grant + scene/destination availability + access
  -> care-attempt request/admission/result
  -> process/body/injury/function/inventory/magic/travel/institution receipts
  -> reassessment
```

No existing item, spell, role, skill, service, rest action, or `heal.hp` hook can skip those edges.

### 2.4 Mortal Crisis

Mortal Crisis may own episode admission, phase identity/history, decisions, blockers, and accepted transitions. It cannot own the facts that admit or resolve a phase.

It depends on accepted:

- threat/hazard facts;
- function/process/care requirements;
- care attempt and consequence receipts;
- party/travel/destination results;
- death/restoration/closure facts;
- persistent occurrence identity and correction.

It therefore cannot be the first implementation owner.

### 2.5 Assessment, observer-safe evidence, urgency, and rendering

Assessment changes observer knowledge only. Qualitative urgency is an upstream observer-specific projection over accepted facts. Renderer-safe claims and validator-only evidence are closed separate channels.

These consumers require owner-certified source facts and admitted assessment results. They cannot create process truth to unblock missing runtime owners.

### 2.6 Death, restoration, closure, and Stakes

HP zero, combat defeat, archive reason, account outcome, and save deletion are not accepted actual death.

Actual death requires a dedicated result owner consuming accepted body/process/function/restoration evidence under Stakes. Restoration eligibility and actual restoration are separate. Final closure and account settlement follow accepted death/closure authority and owner-specific receipts.

No migration may manufacture these results from legacy account history.

### 2.7 Occurrence identity, replay, and correction

Current travel, quest, and activity modules demonstrate useful command-specific patterns:

- normalized plan facts;
- explicit command shape;
- deterministic command identity;
- stale-snapshot/revision rejection;
- accepted/rejected result unions;
- typed completion events;
- accepted-only snapshot application;
- focused characterization and command tests.

They do not implement the accepted general taxonomy:

```text
request/command
  -> delivery/admission
  -> occurrence
  -> accepted deterministic or named-uncertain result
  -> owner-specific consequence receipts
  -> projections
```

Their command ids, event ids, ticks, snapshot hashes, Chronicle ids, and notification ids cannot be reused as health occurrence/result/receipt identities. Health owners must adopt owner-specific identity, persistence, replay, and correction contracts together rather than bolt them on after mutation.

## 3. Dependency Graph

### 3.1 Ordered graph

```text
A. definition owner namespaces + shared static envelope
  -> B. owner-specific lethal-process definition catalogs
       -> C. source-reference contracts and owner-specific mutable instances
            -> D. functional-state assessment and care-requirement derivation
                 -> E. care capabilities/grants/availability/access
                      -> F. care-attempt commands/results + consequence receipts
                           -> G. Mortal Crisis adapters and orchestration

C + D -> H. actual-death evidence and restoration eligibility
H + owner receipts -> I. closure, Stakes publication, and account settlement

Every mutable node C-I
  -> occurrence identity + named uncertainty
  -> persistence/migration
  -> replay/correction

C + D + E + F + G + H
  -> observer/viewpoint/access + assessment
  -> qualitative urgency
  -> renderer-safe projection / validator-only isolation
  -> deterministic UI/narrative/Chronicle consumers
```

### 3.2 Edge classification

| Edge | Classification | Reason |
| --- | --- | --- |
| A -> B | required before implementation | Definitions need collision-safe identity and one declared owner |
| B -> C | required before implementation and persistence | Instances require stable definition identity/version |
| Source owners -> C | required before implementation | Process creation cannot invent cause/source truth |
| C -> D | required before care/crisis/death integration | Function and care must consume owner-certified process facts |
| D -> E | required before care routing | Requirements must precede capability matching |
| E -> F | required before care implementation | Grant, availability, access, and admission precede attempt |
| F -> affected-owner receipts | required before cross-owner mutation | No direct multi-domain mutation |
| C-F -> G | required before crisis implementation | Orchestration needs real accepted inputs/results |
| C + D -> H | required before death implementation | HP/labels cannot substitute |
| H -> I | required before settlement | Closure and account payout must follow accepted death/closure |
| Mutable owners -> occurrence/persistence/correction | required before persistence | Identity and replay cannot be reconstructed later |
| Source results -> assessment/urgency | required before presentation | Renderer cannot calculate truth |
| Safe projection -> UI/narrative/Chronicle | required before presentation | Consumers receive only closed safe claims |
| Existing command patterns -> health commands | optional later integration | Reuse structure only after owner contracts exist |
| Current Knowledge evidence -> health assessment | optional later integration | General evidence patterns do not grant health knowledge |
| Existing events/deltas -> health transport | optional later integration | Envelopes may carry accepted facts, not own them |
| `combat_health_vocabulary` -> lethal-process definitions | rejected coupling | Wrong identity, scope, lifecycle, reference, and owner model |
| HP zero -> actual death | rejected coupling | Violates accepted Stakes/death authority |
| Rest/full HP -> process resolution | rejected coupling | Resource restoration is not care or process truth |
| Role/item/spell/service labels -> capability | rejected coupling | Metadata does not grant or prove availability |
| Save/UI/Chronicle/Mortal Crisis -> health mutation | rejected coupling | These are persistence, consumer, or orchestration layers |

## 4. Owner-Readiness Matrix

| Candidate | Accepted responsibility | Live authority | Principal missing contract | Identity / persistence / correction | Validation / projection | Readiness |
| --- | --- | --- | --- | --- | --- | --- |
| Combat health vocabulary | static combat status/condition/injury identity | strict schema, validator, 2 records | none within current scope | static only | pure validator; no runtime projection | `not_a_candidate` for lethal processes |
| Shared lethal-process definition envelope | common static structure and collision rules | conceptual only | exact namespace, owner declaration, fields, lifecycle, references, paths | stable definition/version only; no mutable persistence | exact schema/validator/test plan absent | `ready_for_docs_prerequisite` |
| Owner-specific process definitions | family meaning under named owner | six conceptual candidates | exact owner domains/catalog partition | stable ids/versions absent | validation/projection rules absent | `blocked_by_owner` |
| Process instances | independent mutable process truth | absent | instance schema/state/transitions/source references | all absent | owner tests and safe projection absent | `blocked_by_persistence` |
| Body/resources | current metabolic/resource truth | live | crisis-safe adapter and accepted cross-owner results | snapshot exists; health correction absent | strong local tests; no crisis projection | `blocked_by_owner` for crisis use |
| Functional state | derived actionable function | absent | policy, request/result, mutable state | all absent | all absent | `blocked_by_owner` |
| Care requirements | source-linked need | absent | derivation/reassessment owner | all absent | all absent | `blocked_by_owner` |
| Care capability identity | shared collision-safe capability meaning | conceptual only | exact catalog/grants/references | all absent | all absent | `blocked_by_owner` |
| Care availability/access | current scene/destination eligibility | absent | providers, consent, law, reachability, materials | all absent | all absent | `blocked_by_owner` |
| Care attempts/results | admitted care occurrence | absent | command/result/effect-proposal contracts | all absent | all absent | `blocked_by_owner` |
| Consequence receipts | one affected owner per applied consequence | absent | receipt identities and owner adapters | all absent | all absent | `blocked_by_persistence` |
| Assessment/knowledge | observer-specific capability-bounded knowledge | absent for health | grants, access, request/admission/result | all absent | safe claims/validator isolation absent | `blocked_by_owner` |
| Qualitative urgency | observer-safe upstream projection | absent | semantic owner and source contract | all absent | all absent | `blocked_by_owner` |
| Mortal Crisis | episode/phase orchestration | absent | all source adapters and phase state | all absent | safe phase projection absent | `blocked_by_owner` |
| Actual death | accepted life-state result | absent | death owner, evidence, Stakes relation | all absent | safe death projection absent | `blocked_by_owner` |
| Restoration eligibility/result | magic/death/body bounded eligibility and result | absent | capability, body/life, result/receipts | all absent | all absent | `blocked_by_owner` |
| Closure/settlement | final continuity publication and consumers | legacy archive only | accepted closure transaction | target persistence/correction absent | run-end projection is legacy | `blocked_by_migration` |
| Save/Stakes | persist accepted owner state and continuity | snapshot/hardcore/legacy archive partly live | target health identities and commitment records | health lineage absent | roundtrip exists only for current state | `blocked_by_persistence` |
| Observer-safe projection | closed renderer-safe claims | conceptual only | live source/assessment/urgency owners | lineage absent | validator isolation absent | `blocked_by_owner` |
| UI/narrative/Chronicle | consume safe facts | live generic/metabolic consumers | health adapters and safe fact set | prose ids are not result ids | presentation exists | `not_a_candidate` as truth owner |

No unresolved poison-family research blocks the six accepted first-scope definitions. Poison implementation remains `blocked_by_research` and stays outside the next prerequisite.

## 5. Current-Behavior Migration Boundary

| Current fact/surface | Compatible use | Forbidden migration/inference |
| --- | --- | --- |
| HP/MP/stamina | retained resource facts; possible future owner-certified input | process identity, diagnosis, actual death, care result |
| Resource change history | current resource audit within its owner | health occurrence/receipt history |
| PlayerBodyState | retained metabolic/body facts; possible bounded process input | backfilled injury/process/function state |
| Combat status effects | retained encounter state | lethal-process instance or diagnosis |
| `incapacitated`/`defeated` | retained combat control/outcome | persistent functional state or death |
| `activeEffects: string[]` | display/compatibility labels | canonical ids, source truth, correction evidence |
| UI-owned rest | retained legacy behavior pending separate transition | care, stabilization, resolution, convalescence, restoration |
| Item identities/stacks | retained item/inventory truth | capability, material suitability, consumption receipt |
| Spell/known-spell state | retained spell identity/acquisition | care grant, assessment result, omniscience, restoration |
| Skills | retained progression identity/rank | automatic care or assessment capability |
| Roles | retained combat tactics metadata | profession/provider capability |
| Services | retained provider-independent planned vocabulary | provider presence, availability, access, price, result |
| Notifications/toasts | current ephemeral presentation | accepted result or persistent evidence |
| Chronicle/run-end prose | historical/display output | occurrence, diagnosis, death, care, correction |
| Events/deltas | compatibility transport/input after explicit adapters | occurrence/result/receipt identity by inference |
| Save snapshots | preserve current facts exactly | silent health backfill or recasting legacy history |
| `dead`/`hardcore_dead` archive records | retained historical account facts | accepted actual-death results |
| Deleted legacy saves | remain deleted absent separate recovery authority | reconstructed process/care/death history |

There is no canonical lethal-process data to alias, migrate, or backfill.

## 6. Smallest Safe Prerequisite

Selected:

`Lethal-Process Definition Owner Namespace And Shared Envelope Schema Plan`

Why it is smallest:

- it closes node A only;
- it changes documentation only;
- it does not require mutable instance fields, balance, process progression, care behavior, diagnosis, save migration, or UI;
- it can preserve owner-specific catalogs while standardizing static identity;
- it resolves the proven incompatibility with the current combined combat-health catalog;
- it gives every later mutable owner a stable definition reference without creating an omnibus health runtime.

The later plan must decide exact namespace/prefix policy, named owner domains for the six accepted candidates, owner-specific catalog paths, shared fields, lifecycle vocabulary, directional references, provenance, schema/validator/test paths, registration gate, and prohibitions.

Why larger candidates remain blocked:

- static content cannot be authored before exact paths/owners/fields;
- process instances cannot exist before definitions and persistence identity;
- functional state and care requirements need accepted source owners/results;
- capability implementation needs requirement/reference contracts;
- care attempts need capability/access and receipt contracts;
- Mortal Crisis needs every upstream adapter;
- assessment and urgency need source facts and live knowledge contracts;
- presentation needs renderer-safe facts and validator isolation;
- actual death, restoration, closure, and settlement need owner results plus Stakes persistence;
- no legacy migration is safe before target identity and correction authority exist.

## 7. Package Readiness

### Documentation package

`DOCUMENTATION_PACKAGE_READY`

Exact later package:

- run: unversioned `Lethal-Process Definition Owner Namespace And Shared Envelope Schema Plan`;
- create: `docs/design/lethal-process-definition-owner-namespace-and-shared-envelope-schema-plan.md`;
- update only current coordination documents for accepted route facts;
- inspect current schema/content/validator/test/registration patterns;
- select exact future paths and static fields;
- authorize no implementation.

Required checks:

- current combat-health catalog incompatibility;
- collision search across content ids and future namespaces;
- owner attribution for all six conceptual candidates;
- static-versus-mutable recursive field boundary;
- definition lifecycle versus instance lifecycle;
- directional reference ownership;
- no poison/burn/shock scope expansion;
- no runtime imports or existing catalog changes;
- documentation-only path and diff hygiene.

Prohibited:

- content, schema, validator, test, runtime, command, event, save, migration, UI, dependency, or gameplay changes;
- process values, stages, formulas, timers, probabilities, symptoms-as-proof, diagnosis, treatment, or display copy;
- reuse/widening of `combat_health_vocabulary`;
- universal health owner/resolver;
- `0.6.8` assignment.

### Static and executable package

`NO_PACKAGE`

No static content, schema, validator, test, runtime, persistence, migration, diagnosis, care, death, UI, or gameplay implementation is ready.

## 8. Exact Follow-Up Route

Install:

Unversioned `Lethal-Process Definition Owner Namespace And Shared Envelope Schema Plan`

The route remains documentation-only and must return either one exact later static schema package or `NO_PACKAGE`. It must not preassign a primary version.

## Explicit Answers

1. **What health-adjacent authority is live?** Combat resources/status/defeat, metabolic body state, inventory, command-specific travel/quest/activity flows, save/load, legacy archive, static metadata, and metabolic/UI projections.
2. **What conceptual owners are absent?** Functional state, process definitions/instances, care requirements/capabilities/attempts/receipts, assessment, urgency, Mortal Crisis, death/restoration/closure, health persistence/correction, and safe health projection.
3. **What is the dependency order?** Static owner namespace/envelope, owner catalogs, mutable instances, functional/care derivation, capability/access, attempts/receipts, crisis/death/closure, then assessment/urgency/safe consumers, with occurrence/persistence/correction designed into every mutable node.
4. **Which edges are rejected?** Combat vocabulary to lethal process, HP zero to death, rest to resolution, metadata to capability, and save/UI/Chronicle/crisis orchestration to health mutation.
5. **What may migrate?** Current facts retain current meanings and may later be bounded inputs; none may be backfilled as historical process, care, assessment, death, or correction truth.
6. **What is the smallest prerequisite?** `Lethal-Process Definition Owner Namespace And Shared Envelope Schema Plan`.
7. **Is a package ready?** One documentation package is ready; static and executable implementation remain `NO_PACKAGE`.
8. **What follows?** The exact unversioned documentation plan above.

## Non-Implementation Confirmation

This audit changes documentation only. It creates no health content, schema, validator, test, helper, runtime, command, event, save, migration, dependency, UI, diagnosis, care, death, generated presentation, or gameplay behavior.
