# Functional State, Lethal Process, Care Requirement, And Mortal Crisis Receipt Contract Decision

Date: 2026-07-28

Status: accepted durable documentation-only design authority; implementation and content remain unauthorized

Run classification: unversioned contract decision

Milestone impact: `supports_current_band`

## 1. Live Baseline And Precedence

The execution gate passed on clean synchronized `master` at `18e3ca6ca47ceb88260cd18521beb27e1305b209`. The Activity Resolution reuse audit is accepted, its queued prompt is absent, every named prerequisite is accepted, and all six retained evidence artifacts are present.

### Current runtime facts

- `resolveTerminalArchiveReason(...)` treats any player HP at or below zero as `dead` or `hardcore_dead`.
- Both run-entry and in-game snapshot-change paths in `apps/rpg-ui/src/App.tsx` immediately call `archiveActiveRun(...)` for that result.
- `archiveActiveRun(...)` evaluates achievements, resolves a Legacy payout, writes an archived account-history record, deposits the estate, persists the account profile, and deletes every resolved save slot for that character.
- The same archived/deleted account history later blocks those slots from play.
- Combat has transient `defeated`, `incapacitated`, resource, and status-effect fields. Player defeat is initialized from HP and combat results synchronize HP plus status labels back to player state.
- Combat healing currently applies HP directly through the narrow `heal.hp` hook. It does not own injury, lethal-process, care, anatomical restoration, resurrection, or Mortal Crisis truth.
- `PlayerBodyState` persists metabolic energy, protein, hydration, fatigue, intoxication, starvation-load, and recovery-effectiveness facts. It owns no consciousness, mobility, circulation/breathing capability, injury, trauma, lethal process, care requirement, life state, or body-after-death record.
- Current recovery context describes sleep, camp, safety, meal, and water support. Current recovery assessment describes quality and duration. These feed metabolic recovery and stat-growth gates, not crisis stabilization or treatment.
- Player inventory, current location, game-state party membership, services, spells, combat history, Chronicle, account history, estate, and save snapshots exist as separate owner seams. No current service or broad magic resolver supplies live crisis-care capability.
- Save snapshots persist current player/game/session state but no crisis episode, functional assessment, lethal-process instance, care requirement, care attempt, accepted death result, owner-specific consequence receipt, or correction lineage.
- Current event envelopes and command events are useful projections. Their tick-composed ids are not accepted occurrence identity.
- Current `RunDifficultyState.hardcore` and `deathZeroesPrestige` fields are legacy migration evidence. They are not Stakes identity or accepted death/Prestige policy.

These facts are implementation evidence, not accepted target architecture. In particular, current HP-zero archival and save deletion are a known defect against accepted Normal Stakes authority.

### Precedence

1. The occurrence clarification controls the exact request/admission/occurrence/result/consequence taxonomy.
2. The occurrence decision controls occurrence, result, uncertainty, replay, idempotency, correction, and supersession.
3. The save/Stakes decision controls account, campaign, continuity, artifact, checkpoint, head, generation, technical recovery, and closure provenance.
4. The accepted Mortal Crisis/Stakes revision controls public Stakes semantics, the six phases, actual/final death, restoration eligibility, closure, and settlement order.
5. This decision is more specific for functional-state assessment, lethal-process instance boundaries, care requirements/attempts, crisis episode/phase receipts, and their owner relations.
6. The Normal Stakes fallback controls the minimum nonterminal result when no context-specific outcome is available.
7. Injury/restoration authority controls injury, trauma, irreversible harm, ordinary healing, exceptional restoration, and resurrection separation.
8. Narrative authority controls observer-safe evidence and presentation. Elemental authority controls entity capability and response eligibility.

No material prerequisite conflict remains.

## 2. Canonical State Separation

| Concept | Accepted nature | Authority requirement |
| --- | --- | --- |
| Body/resource measurement | Mutable primary domain truth | Body/resource owner accepts changes |
| Functional state | Versioned owner-accepted deterministic assessment | Functional-state owner consumes current owner-certified facts |
| Injury/trauma | Mutable causal domain instances | Injury or trauma owner accepts each instance/transition |
| Lethal process | Independently owned mutable process instance | Exactly one process owner accepts transitions |
| Care requirement | Source-linked derived need accepted for routing | Care-requirement owner references unresolved process/body facts |
| Life state | Mutable death/restoration truth | Death/restoration owner accepts transitions |
| Mortal Crisis phase state | Orchestration state and retained transition reasons | Crisis owner references, but never replaces, upstream truth |
| Actual death | Accepted life-ending result | Death owner accepts authoritative causal facts |
| Final closure | Terminal character-control transaction | Closure/save/Stakes authority accepts and publishes it |
| Convalescence/recovery | Typed health/body/injury/restoration consequences | Their domain owners accept progress and completion |

The accepted life-state separation remains:

```text
alive
  -> actually dead but restoration-eligible
  -> final death
```

Functional state remains `active | downed | unconscious`. It does not own life state. A conscious character may have an active lethal process; a downed or unconscious character may be stable and alive.

Qualitative urgency such as stable, unstable, aid required, restoration possible, or closure imminent is derived presentation. It is not a mutable parallel status.

HP, one generic critical flag, encounter closure, prose, or a UI notice cannot collapse these state families.

## 3. Functional-State Contract

The future functional-state owner is a body/health boundary that accepts a versioned functional assessment from owner-certified current facts.

The assessment covers only gameplay capability:

- consciousness and responsiveness;
- mobility and posture;
- agency and capacity to choose;
- breathing and circulation capability at a qualitative game abstraction;
- ability to participate in the current action or encounter;
- ability to move independently, move with assistance, or require transport.

Inputs may include body/resource measurements, injury and condition instances, lethal processes, combat statuses, magic effects, equipment/adaptation capability, environment, and an accepted prior assessment. Each input remains owned by its source.

Two postures are distinct:

- a preview or presentation may derive a nonauthoritative assessment from an exact accepted source set;
- any assessment that gates action, crisis admission, transport, care, or death evaluation is an accepted deterministic result with source identity, semantic policy version, causal order, and correction lineage.

The functional-state owner does not:

- create or progress injuries or lethal processes;
- diagnose an underlying cause;
- decide care requirements;
- consume inventory or cast magic;
- move a party;
- establish actual death;
- authorize closure;
- invent observer knowledge.

Reassessment occurs when an owner-certified material fact changes. A renderer refresh alone cannot create a reassessment.

## 4. Lethal-Process Contract

### Definition and instance split

A lethal-process definition is static domain vocabulary owned by the domain that understands the process family. A future catalog may use a shared structural envelope, but there is no universal medical owner and no catalog is authorized here.

An active lethal-process instance:

- has exactly one owning domain;
- references one affected body identity;
- references the accepted cause/source occurrence and result;
- identifies its governing definition and semantic versions;
- retains its current qualitative phase or stage, direction, and last accepted transition;
- links relevant injuries, conditions, hazards, magic, environment, or continued attacks without merging them;
- exposes owner-certified facts required for functional assessment, care derivation, death evaluation, and observer projection;
- retains correction and supersession lineage.

### Transition posture

Each material process transition is an admitted occurrence with an accepted deterministic or uncertain result. Uncertainty is allowed only through an authorized named channel and retained occurrence-scoped evidence.

Multiple processes may coexist and progress independently. A crisis episode may aggregate references for orchestration, but the aggregate cannot replace, average, or directly edit its member processes.

Accepted distinctions:

- **stabilized**: the named process is bounded or controlled under accepted conditions;
- **suppressed**: its expression or progression is temporarily constrained;
- **resolved**: the owner accepts that the process no longer remains active;
- **recurred or worsened**: a new accepted transition establishes renewed or increased threat;
- **terminal contribution**: the process supplies causal evidence to death authority but does not itself declare actual death unless that domain is explicitly also the death owner.

Stabilization is not consciousness, mobility, full recovery, definitive care, or life restoration. There is no universal bleed-out timer, aggregate danger meter, or omnibus lethal roll.

## 5. Care-Requirement And Intervention Contract

### Care requirement

A care requirement is an accepted, source-linked derived need. It references the process, functional, body, injury, environment, access, and policy facts that justify it.

One body may have multiple simultaneous requirements. A display may derive a highest qualitative care tier, but that projection cannot erase individual requirements.

The accepted coarse requirement vocabulary remains:

```text
none
basic stabilization
professional or definitive care
exceptional magic
```

A requirement remains open, partially met, satisfied, superseded, or no longer applicable only through owner-certified reassessment. It never directly consumes supplies, moves a party, heals a body, closes an injury, changes a process, casts a spell, or decides death.

### Intervention

An intervention begins as a request from an actor or authorized controller. Admission requires:

- an actor with agency and permission;
- an applicable capability;
- patient/target and requirement identity;
- access, range, environment, and current condition;
- supplies, tools, catalysts, transport, institution, or other prerequisites;
- consent or an accepted exception where applicable;
- cost/resource authority;
- governing policy and material-input identity.

An admitted care attempt is its own occurrence. Its accepted result reports what was attempted and what outcome proposals were accepted. Separate owners then apply consequences:

- the process owner accepts stabilization, suppression, worsening, recurrence, or resolution;
- the body/injury owner accepts functional or health changes;
- inventory accepts consumption;
- magic accepts casting, catalyst, cost, and effect;
- travel/party accepts movement or extraction;
- economy/institution accepts access, service, or transaction;
- Chronicle/UI project only accepted facts.

Partial application retries only the missing owner receipt. Successful sibling receipts remain applied.

Reassessment after intervention is a new accepted result linked to the attempt. It does not rewrite what the earlier observer knew.

## 6. Mortal Crisis Orchestration

A Mortal Crisis episode is admitted when an owning domain presents an accepted qualifying fact such as material functional loss, an unresolved lethal process/care requirement, or an actual-death/restoration-eligibility transition that requires the accepted phase sequence.

Episode identity is reserved at admission and accepted atomically with its initial orchestration state. A UI opening, HP threshold, combat ending, or prose line cannot create an episode.

| Phase | Owner-certified admission/input | Allowed orchestration result | Skip/transition authority | Retry and projection |
| --- | --- | --- | --- | --- |
| Threat Resolution | Active threat/hazard/disposition and patient/helper facts | threat unresolved, changed, or accepted ended | Threat/hazard/law/world owner | Retry same request id; show only observer-known threat facts |
| Immediate Stabilization | Open care requirements, agency, capability, access, supplies | attempt admitted/rejected; requirement unchanged, partly met, met, or superseded | Process/body/care owners through receipts | Duplicate returns existing result; show visible intervention and safe effect |
| Extraction | Transportability, helper/capacity, route, threat, tool/vehicle facts | remain, move, block, intercept, or reach intermediate site | Party/travel/world owners | Failed consumer retries movement receipt only |
| Transit | Accepted route, time, process, weather, supplies, pursuit | advance, pause, reroute, reassess, or arrive | Time/travel/process/hazard owners | Material change creates linked occurrence; refresh does not |
| Treatment Or Restoration | Requirement, provider/capability, access, law, consent, cost, body/life facts | treat, stabilize, refer, restore, fail, remain pending | Health/injury/magic/institution/death owners | No arrival guarantee; accepted result survives presentation failure |
| Closure | Life/eligibility, unresolved consequences, Stakes/save facts | return to play, enter convalescence, keep crisis pending, accept final closure | Health/restoration/death/closure/save owners | Terminal settlement occurs only after verified closure |

A phase skip requires an accepted owner fact and policy proving the phase unnecessary or complete. The skip is itself retained orchestration evidence.

Mortal Crisis owns:

- episode admission and identity;
- current open phase and phase history;
- references to owner-certified facts and accepted results;
- pending decision authority;
- explicit blockers;
- accepted skip/transition reasons;
- completion or unresolved posture.

It does not own health, body, injury, process progression, care effects, inventory, magic, routes, institutions, actual death, restoration eligibility, closure, settlement, narrative, or AI. It is not a medical minigame, planner, generic resolver, or mutation shortcut.

## 7. Identity And Receipt Taxonomy

The controlling taxonomy is:

```text
request / command
  -> delivery and admission
       -> occurrence
            -> deterministic accepted result
            -> uncertain accepted result -> named channel evidence
            -> no accepted result

accepted result
  -> owner-specific consequence receipts
       -> projections
```

An explicitly owner-defined admitted rejection or no-result occurrence may be consequential only when its contract says so. A pre-admission rejection creates no gameplay occurrence or consequence.

### Required conceptual identities

| Identity | Owner and relation |
| --- | --- |
| Crisis episode | Crisis owner; admitted from one or more qualifying source results |
| Phase occurrence | Crisis owner; child of the episode and linked to the prior phase result |
| Process transition | Process owner; may cause reassessment, care, death, or phase transition |
| Care attempt | Care/action owner; references actor, patient, requirement, capability, and material inputs |
| Accepted result | Domain owner; deterministic or linked to named uncertainty evidence |
| Consequence receipt | One downstream owner plus source result and consequence kind |
| Correction/supersession | Affected truth owner plus save/campaign propagation and downstream reconciliation |

Request retry preserves request identity and normalized intent. Duplicate delivery returns existing admission/result status. Materially different reuse of one request identity is rejected or quarantined.

Occurrence, result, and receipt identities are not event-envelope ids, ticks, timestamps, save keys, slots, command ids, Chronicle ids, or prose.

## 8. Stakes Commitment Matrix

| Concern | Normal Stakes | Committed Stakes | Ironbound Stakes |
| --- | --- | --- | --- |
| Crisis admission/result commitment | Idempotent inside the active continuity; no general cross-rollback commitment | Retained across materially identical checkpoint replay | Admitted request identity, occurrences, results, and applied consequences retained in one continuity |
| Reload/replay | Valid earlier save may create a later child continuity on divergence | Earlier eligible checkpoint may load; materially identical results remain committed | Latest authoritative head only; no selected rollback |
| Named uncertainty | Owner-specific; not globally committed | Required for uncertain crisis results | Required and committed |
| Checkpoint relation | Ordinary save topology | Head may be newer than selectable checkpoints | Hidden generations are recovery-only |
| HP zero | Never actual death by inference | Never actual death by inference | Never actual death by inference |
| Actual death | May remain restoration-eligible | May remain restoration-eligible | Actual death, final death, and closure are atomic |
| Restoration/resurrection | Only with deterministic eligibility and explicit capability | Same, while eligibility remains open | Unavailable after accepted actual death |
| Final closure | Final in active timeline; rollback may abandon later timeline | Retires checkpoint ladder and publishes closed head before settlement | Published atomically with accepted death |
| Technical recovery | Ordinary valid recovery/load posture | Latest verified same-boundary state, never favorable selection | Latest verified same-boundary state, never favorable selection |
| Correction | Explicit owner correction; not rollback | Explicit owner correction retaining commitment lineage | Proven-defect correction only; no reopening or favorable state picker |
| Player inspection/choice | Ordinary saves and observer-safe crisis decisions | Eligible checkpoints and observer-safe decisions | Continuation plus observer-safe decisions; no historical state selection |

Loading an earlier Normal or Committed state cannot retain durable value from the abandoned later continuity. Terminal settlement follows final closure once.

## 9. Owner And Persistence Matrix

| Fact/record | Static owner | Mutable owner | Writer | Reader/consumer | Occurrence/result source | Persistence | Idempotency relation | Correction authority | Presentation boundary | Missing implementation owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Body/resources | Body/resource rules | Player/actor body/resource owner | Body/resource commands | Functional, process, combat, recovery | Accepted body/resource result | Current snapshot exists | Source result + owner consequence | Body/resource owner | Observer-safe values/bands | Crisis-safe body adapter |
| Functional assessment | Functional policy | Functional-state owner | Assessment acceptance | Crisis, action, transport, death | Deterministic assessment result | Absent | Source fact set + policy version | Functional-state owner | Capability/visible signs only | Entire owner |
| Injury/trauma | Injury/trauma vocabulary | Injury/trauma owner | Causal consequence resolver | Function, care, convalescence | Accepted injury/trauma result | Absent | Source result + instance transition | Injury/trauma owner | Observer-known evidence only | Active instance owners |
| Lethal-process definition | Domain catalog | Not applicable | Authoring owner | Process resolver/validation | Not applicable | Absent | Stable definition/version | Definition owner | No hidden mechanics | First catalog after research |
| Lethal-process instance | Definition owner | Exactly one process owner | Process transition resolver | Function, care, death, crisis | Process occurrence/result | Absent | Instance + transition result | Process owner | Projected urgency/signs | Entire mutable owner |
| Care requirement | Care policy | Care-requirement owner | Accepted derivation/reassessment | Crisis, actor choice, provider routing | Assessment result | Absent | Source facts + requirement revision | Care owner and affected source owners | Available need/known blockers | Entire owner |
| Care attempt | Capability/action policy | Care/action owner | Actor/domain command | Process/body/inventory/magic/travel | Admitted attempt/result | Absent | Request + occurrence + result | Attempt/result owner | Action and safe outcome | Entire command/result owner |
| Crisis episode/phase | Phase policy | Mortal Crisis owner | Episode/phase command | Domain adapters, UI, Chronicle | Episode and phase occurrences | Absent | Episode + phase occurrence/result | Crisis owner | Safe phase, choices, blockers | Entire owner |
| Inventory/supplies | Item/inventory content | Inventory owner | Inventory transaction | Care/magic/economy | Accepted inventory consequence | Current snapshot exists; receipts absent | Source result + inventory consequence | Inventory owner | Known availability/consumption | Transaction receipts |
| Magic/restoration | Spell/capability content | Magic owner | Cast/restoration command | Process/body/death/care | Cast/result occurrence | Known spells persist; broad results absent | Cast/result + owner receipts | Magic and affected owners | Known capability/cost/result | Broad resolver and adapters |
| Party/transport | Party/capability rules | Party owner | Party command | Crisis/extraction/travel | Accepted party result | Coarse party state exists | Source result + party consequence | Party owner | Known helpers/capacity | Durable health/care adapter |
| Travel/location | World/route authority | Travel/location owner | Travel command | Crisis/extraction/transit | Accepted travel result | Current location persists | Travel result + consequence | Travel/world owner | Known route/destination | Crisis route adapter |
| Save/Stakes | Stakes registry/policy | Campaign/save authority | Save publication | All persistent owners | Artifact/head/checkpoint result | Current legacy snapshot only | Campaign/continuity/artifact identities | Save/campaign authority | Policy and safe status | Target identity/persistence |
| Actual death | Death/Stakes policy | Death owner | Death acceptance | Body, restoration, closure | Accepted death result | Absent | Character + occurrence + result | Death owner | Observer-safe death evidence | Entire owner |
| Body after death | Body/death policy | Body/world owner | Body transition command | Restoration, travel, closure | Accepted body result | Absent | Body identity + transition | Body/world owner | Observer-permitted condition/location | Entire owner |
| Final closure | Closure/Stakes policy | Closure/save authority | Closure transaction | Settlement/account/succession | Accepted closure result | Current archive record is legacy only | Closure + continuity/head | Closure/save owner | Read-only closed status | Target closure transaction |
| Estate/Prestige/succession | Account-domain policy | Separate account owners | Idempotent consumer transaction | Account/history/heir UI | Closure consequence | Current ledgers partly exist | Closure + owner consequence | Each account owner | Settled facts only | Closure-linked receipts |
| Chronicle | Narrative/Chronicle policy | Projection owner | Projector | UI/Manuscript | Accepted safe evidence | Current prose entries persist | Source result + projection identity | Source owner for truth; projection owner for prose | Observer-safe summary | Occurrence-linked evidence |
| UI | Presentation policy | Ephemeral view state | Renderer/user request | Player | No gameplay result authority | No gameplay authority | Request/delivery only | None for gameplay truth | Closed safe surface | Crisis adapters only |

Save authority persists links and accepted state; it does not resolve processes, care, death, or effects. Chronicle and UI cannot reconstruct missing authority.

## 10. Observer-Safe Presentation

Before admission or result acceptance, UI may show:

- the requested action;
- known prerequisites and visible blockers;
- observer-known functional signs;
- recognized or explicitly reported conditions;
- qualitative urgency supplied by an upstream projection owner;
- choices the current actor is authorized to make.

After acceptance, UI, Chronicle, and narrative may show:

- safe episode/phase/result facts;
- visible intervention and consequence;
- changed qualitative urgency;
- accepted route, care, restoration, or closure decisions;
- explicit uncertainty and unknowns;
- safe correction/supersession notices.

They must hide raw timers, percentages, seeds, draws, channel internals, validator facts, inaccessible diagnoses, unavailable choices, private motives, future outcomes, and backend identities not known to the observer.

An unconscious or actually dead patient cannot be presented as choosing. Observer uncertainty never randomizes or weakens a committed result. Presentation failure falls back to omission, explicit unknown, conservative repetition, or deterministic simplified prose.

## 11. Compatibility, Migration, Replay, And Correction

### Legacy classification

- Current HP-zero terminal archival/delete behavior is `rejected_target_behavior`.
- Historical `dead` and `hardcore_dead` records are retained historical facts.
- Current metabolic body state is compatible source evidence but cannot be reinterpreted as functional, injury, or lethal-process state.
- Current combat defeated/incapacitated/status fields are transient combat evidence, not persistent health truth.
- Current `activeEffects: string[]`, Chronicle prose, notices, account history, and event ids are projections or coarse compatibility inputs.
- Current snapshots have no accepted crisis/process/care receipt history.

### Migration posture

- Active legacy HP-zero state with no archived/deleted account outcome may later use the accepted one-time Normal fallback repair.
- Archived/deleted history remains blocked; this decision does not reopen it.
- Missing functional, process, care, death, or crisis receipts cannot be reconstructed from prose, timestamps, HP, status labels, or event ids.
- Ambiguous value-bearing state is quarantined rather than guessed.
- New identities and target records require explicit migration provenance and must not silently recast old events as accepted death or care.

### Replay and correction

Duplicate delivery returns existing admission/result status. Reapplication consults owner-specific receipts. Technical recovery restores accepted records exactly and never invokes a resolver for a better result.

Correction retains original authority, evidence, reason, supersession, and downstream reconciliation. Only the affected truth owner may approve its correction; save/campaign authority controls propagation, and each downstream owner controls its own reversal, compensation, replacement, retention, or quarantine.

## 12. Research Gate And Smallest Later Package

Bounded external research is now required before the first executable or balance-bearing lethal-process catalog.

The contract seams are decision-complete enough to ask precise questions, but repository evidence is not sufficient to select grounded process categories, stabilization distinctions, reassessment needs, or observer-safe urgency cues.

The exact research domains are:

1. hemorrhage and shock;
2. airway compromise and drowning;
3. poisoning and antidote limits;
4. cold and heat exposure;
5. burns;
6. stabilization versus definitive care;
7. transport and reassessment;
8. observer-safe qualitative urgency.

Research must distinguish evidence from game abstraction and must not import clinical protocols, exact real-world timers, medication/dosage advice, diagnostic instruction, probabilities, or proprietary game values.

Required artifact:

`docs/dev/tmp-grounded-lethal-process-stabilization-and-first-aid-research-2026-07-28.md`

Named consumers:

1. unversioned `Lethal Process And Stabilization Research Integration Decision`;
2. the first lethal-process definition/catalog plan;
3. the first care-capability and stabilization contract/package;
4. the first observer-safe crisis assessment/presentation package.

Removal requires every named consumer to record consumption and a durable authority to retain needed conclusions and source identity.

Smallest later implementation package: `NO_PACKAGE`.

The blockers are the bounded research result, its repository-corrected integration decision, exact static/mutable owner representation, persistence/migration contracts, and package-specific validation/tests.

## 13. Retained Evidence Disposition

All hashes are SHA-256 values reproduced at the start of this run.

| Retained artifact | Hash | Consumption in this run | Outstanding named implementation consumers | Disposition |
| --- | --- | --- | --- | --- |
| `tmp-comparative-checkpoint-mortality-rescue-and-stakes-research-2026-07-23.md` | `A0496AFB7C76AD3FF08F4FFD36F2A2F1C9B086577E8505AC88274EF244E81FEC` | Independent processes, derived urgency, process-specific stabilization, contextual rescue, body/eligibility separation | Checkpoint/commitment, Mortal Crisis, resurrection, settlement, and succession implementations | Preserve |
| `tmp-normal-stakes-defeat-injury-trauma-and-restoration-audit-2026-07-22.md` | `53FDEAB2D202F1A581748A2DC313EA83F5EF96034F5FDD34C6B6498EE4627C91` | Live HP-zero/noncombat seam, receipt need, safe-destination gap, idempotency, missing active-health owners | First relevant Normal fallback/runtime replacement or repair | Preserve |
| `tmp-narrative-realization-and-mortal-crisis-presentation-audit-2026-07-23.md` | `463397774F83E61E02984BAF8B3E9CB7169E292EFB1906E224BE12693BE5030D` | Crisis beat inputs, diagnosis/urgency limits, multi-stop care, presentation non-authority | Later narrative-engine implementation and crisis presentation adapter | Preserve |
| `tmp-grounded-narrative-realization-research-2026-07-23.md` | `8ED92324ABF81D35CA7B269A6B53DFC9C19C7BB77900B50436592474AFEDF19E` | Event-time evidence, observer projection, deterministic fallback, hidden-fact separation | Later narrative-engine implementation | Preserve |
| `tmp-elemental-alignment-temperament-and-magic-stimulus-audit-2026-07-23.md` | `A9752D9E546BD685C32C2BC1CF574F37E402FB0ECFD29738EBEAB90FB5ABA448` | Explicit capability gate and rejection of disposition-driven healing/rescue | Elemental ecology/spawn, magic-stimulus/AI, and crisis-capability implementations; held static route only if explicitly selected | Preserve |
| `tmp-grounded-elemental-affinity-ecology-and-magic-stimulus-research-2026-07-24.md` | `8F3855AAF50BF81493663BC77244C6496F1D226E423DE175EBE8324128A27F94` | Capability/effect-owner acceptance, retained causal evidence, observer-safe aid | Later elemental implementation and crisis-capability implementation | Preserve |

This run is not the final removal consumer for any artifact. None is edited or deleted.

## 14. Exact Follow-Up Route

The exact next route is:

`GPT-DR.health.lethal-process-stabilization`

It is an unversioned bounded external research gate producing the exact temporary artifact named in Section 12. It authorizes no repository canon, schema, catalog, runtime, UI, save, medical advice, or balance values.

After the artifact exists and passes source/claim review, the next repository route is the unversioned `Lethal Process And Stabilization Research Integration Decision`. That later run must accept, narrow, reject, or defer every proposed abstraction before any catalog or implementation prompt.

## 15. Required Decision Answers

1. Functional state is owned by a future body/health functional-state boundary that accepts versioned assessments; it owns capability assessment, not causes, care, life state, or effects.
2. Lethal-process definitions are static domain vocabulary; active instances have exactly one domain owner, one affected body, retained source/result identity, independent transitions, and correction lineage.
3. Care requirements are accepted source-linked derived needs. They route eligible attempts but never mutate process, body, inventory, magic, travel, or death state.
4. A crisis episode is admitted from an accepted qualifying owner fact. Each phase action/transition is its own child occurrence with retained source and skip/transition evidence.
5. Domain owners accept process, assessment, intervention, death, restoration, and closure results. Each affected owner consumes them through its own stable consequence receipt.
6. Duplicate delivery returns existing status; retries preserve identity; partial application retries only missing receipts; replay follows Stakes material-equivalence rules; correction retains supersession and owner-specific reconciliation.
7. Normal permits broad rollback and no general commitment; Committed permits checkpoint rollback with committed materially identical results; Ironbound has one continuity and atomic actual/final death/closure.
8. Accepted state and receipts persist within campaign/continuity/artifact authority according to Stakes. Technical recovery restores the latest verified same-boundary state; branches cannot retain abandoned value.
9. Presentation may reveal observer-safe accepted facts, visible signs, known diagnoses, qualitative urgency, available choices, blockers, and safe results. Hidden mechanics, diagnoses, channels, and future outcomes remain private.
10. Bounded research is required now. The exact next route is `GPT-DR.health.lethal-process-stabilization`; no implementation package is authorized.

This decision changes no content, schema, validator, test, helper, runtime, command/event, UI, save/persistence, migration, medical/balance value, dependency, generated output, or gameplay behavior.
