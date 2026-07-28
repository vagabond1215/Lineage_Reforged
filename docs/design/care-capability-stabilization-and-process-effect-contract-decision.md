# Care Capability, Stabilization, And Process-Effect Contract Decision

Date: 2026-07-28

Source run: unversioned `Care Capability, Stabilization, And Process-Effect Contract Decision`

Status: accepted documentation-only decision

Milestone impact: `supports_current_band`

## Decision Summary

Accept one future shared care-capability identity vocabulary with owner-specific grants, availability assessments, care-attempt resolvers, and consequence receipts.

A capability identity describes a stable kind of competence or effect that may be relevant to care. It does not prove that any actor, item, spell, service, institution, or location grants it. A grant does not prove that it is currently available. Availability does not prove access, consent, admissibility, success, stabilization, process resolution, recovery, restoration, or resurrection.

An admitted care attempt is an occurrence owned by the applicable care/action domain. Its accepted result may propose bounded effects to one or more affected owners. Each process, body, injury, inventory, magic, travel, economy, institution, or other owner independently accepts and records its own consequence receipt. The care owner never directly mutates an owner-specific lethal process.

The care semantics remain distinct:

- stabilization;
- suppression;
- supportive care;
- definitive treatment;
- process resolution;
- functional recovery;
- ordinary injury recovery;
- convalescence;
- anatomical restoration;
- resurrection.

Qualitative reassessment follows owner-certified material change, not a universal timer or clinical schedule. Magic supplies only capabilities explicitly granted by an accepted magic owner and does not imply omniscient diagnosis or universal healing.

The implementation result is `NO_PACKAGE`. There is no live lethal-process definition or instance, care-requirement persistence, care-capability catalog, grant contract, destination capability owner, care occurrence/receipt schema, consent/access policy, material-input normalization policy, or correction implementation.

The exact next route is the unversioned `Observer-Safe Crisis Assessment And Presentation Contract Decision`.

## 1. Live Authority Baseline

### 1.1 Healing spell and combat-hook surfaces

`packages/content/base/player/spells.json` contains 55 spell records. Exactly 12 use the `healing` school:

| Spell | Compatibility | Governing skill | Relevant hooks |
| --- | --- | --- | --- |
| `spell.fire.healing.warmth` | `deferred` | `skill.magic.school.healing` | `heal.hp`, `buff.warmth` |
| `spell.water.healing.mend` | `ready` | `skill.magic.school.healing` | `heal.hp` |
| `spell.air.healing.breath` | `deferred` | `skill.magic.school.healing` | `heal.hp`, `restore.stamina` |
| `spell.earth.healing.renew` | `deferred` | `skill.magic.school.healing` | `heal.hp`, `buff.regeneration` |
| `spell.lightning.healing.surge` | `ready` | `skill.magic.school.healing` | `heal.hp` |
| `spell.ice.healing.preserve` | `deferred` | `skill.magic.school.healing` | `heal.hp`, `buff.preserve` |
| `spell.light.healing.restore` | `ready` | `skill.magic.school.healing` | `heal.hp` |
| `spell.shadow.healing.drain` | `partial` | `skill.magic.school.healing` | `heal.hp`, `damage.magic` |
| `spell.druidic.healing.berry` | `partial` | `skill.magic.school.druidic` | `support.berry` |
| `spell.druidic.healing.bloom` | `partial` | `skill.magic.school.druidic` | `heal.hp`, `buff.regeneration` |
| `spell.performance.healing.regen_song` | `deferred` | `skill.magic.school.performance` | `heal.hp`, `buff.regeneration` |
| `spell.performance.healing.mana_song` | `deferred` | `skill.magic.school.performance` | `restore.mp` |

Exactly 10 spell records carry `heal.hp`.

`packages/shared/types/src/spell-hook-support.ts` and `tools/content-lint/combat-hook-support.mjs` classify `heal.hp` as runtime-consumed.

`packages/engines/game-engine/src/combat/index.ts` executes `heal.hp` by calculating a combat healing amount from attributes, skill-effect grant values, titles, and HP urgency, then adding HP up to the target maximum. It does not:

- establish care capability;
- inspect an injury or lethal process;
- satisfy a care requirement;
- stabilize or resolve a process;
- consume an item or catalyst;
- establish provider access or consent;
- restore anatomy;
- reverse actual death.

The combat engine also treats healing-school actions as tactical healing and selects wounded allies by HP ratio. This is combat-resource behavior, not a care contract.

The broader known-spell resolver in `packages/engines/game-engine/src/known-spells.ts` emits a `magic_resolver_inert_envelope` in `planning_only` mode. That planning envelope does not execute casting. The live combat hook and the planning-only general magic resolver are separate seams; neither may be generalized into process care.

### 1.2 Skills, roles, items, and services

`packages/content/base/player/skills.json` contains 121 records. Relevant identity evidence includes:

- `skill.survival.field_medicine`;
- `skill.survival.water_safety`;
- `skill.magic.school.healing`;
- `skill.crafting.alchemy`.

Related survival identities such as fire control, sheltercraft, campcraft, swimming, and endurance may later provide owner-certified contextual evidence. None currently grants a care capability or executes care.

`packages/content/base/game/combat_roles.json` contains nine records. `healer` and `support_buffer` prefer healing actions. The healer role summary and tactics use HP-focused language and urgency weights. Role identity is tactical metadata; it is not training, access, care capability, diagnosis, or process authority.

`packages/content/base/items/items.json` contains 1,372 records. Six names are directly care-like:

- `item.antidote_phial`;
- `item.field_bandage`;
- `item.healing_tonic`;
- `item.household_remedy_kit`;
- `item.traveler_remedy_kit`;
- `item.utility_salve`.

None has `useProfiles` or a `consumableProfileId`. Their names, branches, sub-branches, and tags are static item identity only. In particular, `item.antidote_phial` does not prove a universal antidote or a matching poison family.

`packages/content/base/items/consumable_profiles.json` contains nine food/drink profiles. They define calories, macronutrients, hydration, optional intoxication, and a use verb. They do not define medicine, stabilization, injury treatment, poison response, or lethal-process effects.

`packages/content/base/civilization/services.json` contains five planned services:

- lodging;
- market exchange;
- warehouse storage;
- archives;
- contract board.

There is no care or healing service. The service validator explicitly forbids `healingEffects`, so current service identity cannot execute treatment.

Buildings, workplaces, guilds, quests, and prose mention healers, alchemists, medicines, remedies, treatment, or rescue. Those mentions are setting, quest, role, or static-source evidence only.

### 1.3 Body recovery, inventory, save, and presentation

`PlayerBodyState` owns metabolic energy, protein, hydration, fatigue, intoxication, starvation load, and recovery multipliers.

`RecoveryContextState` carries:

- sleep units;
- camp tier;
- safety tier;
- optional meal support;
- optional water support.

`RecoveryAssessmentState` carries numeric recovery quality and duration hours. `packages/engines/player-engine/src/body-state.ts` applies that context to metabolic recovery. It does not own injuries, lethal processes, care requirements, treatment, restoration, or death.

`applyConsumableToBodyState` applies the nine metabolic consumable profiles. It is not medicine or care resolution.

`apps/rpg-ui/src/runtime/bodyStatePresentation.ts` simulates body-state windows, previews food/drink effects, and recommends eating, drinking, or resting for metabolic warnings. It does not assess crisis processes or provider capability.

`apps/rpg-ui/src/game-shell/gameplayLoop.ts` still contains a UI-owned rest path that restores HP, MP, and stamina to full and writes Chronicle/presentation text. This is a known compatibility seam, not accepted care, process resolution, or injury recovery.

`PlayerInventoryState` persists bags, overflow, and item stacks. Equipment, spells, skills, roles, `activeEffects`, resources, body state, session UI, and Chronicle are present in `PlayerState`/`SaveSnapshot`, but there is no:

- care-capability grant;
- scene-availability assessment;
- destination capability offer;
- care requirement or attempt;
- lethal-process definition or instance;
- process-effect proposal or receipt;
- care-specific correction lineage.

### 1.4 Command, occurrence, result, event, and delta seams

`GameEventEnvelope` has generic id, type, domain, tick, payload, and optional tags. `GameDelta` has only broad orchestration, events, or combat kinds. Neither is an occurrence, result, or consequence-receipt authority.

Engine-owned player travel, quest acceptance, quest tracking, and activity selection provide partial implementation examples:

- deterministic command ids;
- expected tick, snapshot version, and revision;
- accepted/rejected result unions;
- immutable rejected snapshots;
- cloned committed snapshots;
- typed events;
- explicit emitted-event arrays.

These live command flows do not implement the complete accepted occurrence taxonomy, retained result lookup for every duplicate delivery, care attempts, named uncertainty, multi-owner consequence receipts, or correction.

`CombatCommandRequestState` identifies actor, action, targets, source, and queue mode but has no care-specific identity or process-effect contract.

Current event ids, command ids, timestamps, ticks, Chronicle ids, notification ids, and save keys cannot be reused as occurrence, result, or consequence-receipt ids.

## 2. Capability Identity

Accept one shared care-capability identity vocabulary with owner-specific grants and resolvers.

The shared vocabulary may eventually identify stable capability meaning and provenance across mundane, institutional, equipment-assisted, alchemical, and magical sources. It is not a universal care catalog, resolver, profession list, or treatment tree.

Ownership is separated as follows:

| Concern | Owner |
| --- | --- |
| Capability identity and collision prevention | Future shared care-capability vocabulary authority |
| Skill/training grant | Skill, progression, actor, or provider owner |
| Spell/magical grant | Magic owner |
| Equipment/material contribution | Item, equipment, inventory, or material owner |
| Destination offer | Institution, site, settlement, service, or provider owner |
| Current availability assessment | Applicable care/access owner consuming source-certified facts |
| Care-attempt admission and result | Applicable care/action owner |
| Lethal-process mutation | The one owner of the target process instance |
| Injury/body/function mutation | Each applicable injury, body, or functional-state owner |
| Cost and consumption | Inventory, resource, magic, economy, or institution owner |
| Projection | Observer, UI, narrative, dialogue, or Chronicle owner consuming safe accepted facts |

A capability identity does not:

- grant itself to an actor;
- prove competence or permission;
- establish diagnosis;
- prove that equipment or material exists;
- prove provider presence or destination access;
- admit an attempt;
- guarantee a result;
- mutate a process;
- imply final display wording.

Multiple unrelated capability vocabularies are rejected because collision and semantic drift would make process requirements unsafe. Inference from role, prose, profession, item name, spell name, service name, or display label is rejected because current data is descriptive and incomplete.

## 3. Scene And Destination Capability

The following concepts remain separate:

1. **Grant** — an owner has accepted that an actor, item, spell, provider, or institution can contribute a named capability under defined scope.
2. **Scene availability** — an accepted current assessment finds the grant present, reachable, usable, and relevant at the current scene.
3. **Material availability** — inventory/equipment/material owners certify required resources and their state without pre-consuming them.
4. **Destination offer** — a site, provider, service, or institution advertises a capability under authored authority.
5. **Destination availability** — current provider, infrastructure, supply, law, willingness, schedule, and operating facts support that offer now.
6. **Access** — the patient and party can reach, afford, enter, lawfully use, and be accepted by the provider under current conditions.
7. **Admission** — the care owner accepts one request as an attempt occurrence.
8. **Accepted result** — the attempt owner accepts what occurred and emits bounded owner-addressed effect proposals.

A destination offer is not scene availability. Reaching a destination is not admission. Admission is not success. Success at one effect is not process resolution or full recovery.

Remote advice or magical communication may contribute information or coordination only when communication, observer, and capability owners accept it. It does not automatically supply hands-on access, materials, examination, diagnosis, or physical effect.

Consent, emergency exception, guardianship, command authority, or legal authority is owned by the applicable social/law/actor contract. This decision does not invent an exception policy.

## 4. Requirements And Evidence

A later care resolver may consume only owner-certified evidence relevant to its versioned material-input policy:

- actor identity, agency, permission, training, skill, and capability grants;
- patient/body identity and accepted target relationship;
- target process, care requirement, injury, body, or functional facts;
- current equipment, material, inventory, catalyst, spell, and resource facts;
- scene threat, safety, physical access, distance, posture, and environmental facts;
- consent or accepted exception evidence;
- destination/provider offer, availability, willingness, legality, affordability, and access;
- transport, route, timing, shelter, contamination, and communication facts;
- accepted prior attempt, result, consequence-receipt, and reassessment facts;
- governing policy, content, resolver, and normalization versions.

Each fact remains owned by its producer. The care resolver may verify references and interpret them for attempt admission; it cannot:

- rewrite actor training;
- invent diagnosis;
- reserve or consume inventory directly;
- cast a spell;
- move the party;
- change institutional access;
- mutate injury/body/process truth;
- decide actual death;
- widen observer knowledge.

An omnibus patient or medical-truth object is rejected. An aggregate view may reference source facts but cannot replace their identities or owners.

## 5. Request, Admission, Occurrence, And Result

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

explicitly owner-defined admitted rejection consequence
  -> owner-specific consequence receipt
       -> projection
```

### Request

The initiating actor/controller owner establishes stable request identity and normalized intent. Conceptually the request identifies the actor, patient, target requirement/process, proposed capability, causal source, and declared material inputs without claiming they are valid.

### Pre-admission validation

The care owner validates request identity, normalized intent, authority, target existence, capability grant, scene/destination posture, access, consent, and material-input references.

A malformed, unauthorized, stale, duplicate-with-different-intent, or otherwise pre-admission-rejected request creates no gameplay occurrence or consequence. Request/rejection evidence may be retained for audit without becoming care truth.

### Admission

Admission reserves one care-attempt occurrence identity before mutation. It fixes the owner-certified material-input identity and governing semantic versions.

Duplicate delivery of materially identical intent returns the existing admission/result status. It does not mint a second attempt, reroll uncertainty, or consume materials again. Reuse of one request id with materially different intent is rejected or quarantined.

### Accepted result

The care/action owner accepts a deterministic result or an uncertain result tied to an authorized named channel. A raw random value is not the result.

The accepted result records what attempt occurred and which bounded effect proposals are addressed to which owners. It does not assert that every proposal was applied.

A no-result occurrence ordinarily creates no downstream consequences. An admitted rejection or no-result consequence exists only where the owning contract explicitly defines it.

### Consequence receipts

Each downstream owner consumes the source result under one stable owner-and-consequence identity. It records applied, pending, failed/retryable, rejected, reversed, compensated, retained-with-exception, or superseded posture as applicable.

Partial failure retries only the missing receipt. Applied siblings remain applied. Presentation failure never retries care or process mutation.

## 6. Care Semantic Boundaries

| Term | Accepted meaning | Does not imply |
| --- | --- | --- |
| Stabilization | The target owner accepts that one named process is bounded or controlled under stated current conditions. | Resolution, consciousness, mobility, survival guarantee, full recovery, or definitive care. |
| Suppression | The target owner accepts that process expression or progression is constrained while stated capability/material/environment conditions hold. | Permanent control, source removal, cure, or immunity. |
| Supportive care | An accepted result supports body function, comfort, access, observation, or safe continuation without claiming causal control. | Stabilization or resolution of the source process. |
| Definitive treatment | An applicable owner accepts an intervention aimed at causal control or repair beyond immediate stabilization. | Guaranteed success, functional recovery, or restoration. |
| Process resolution | The one process owner accepts that the named process is no longer active. | Injury recovery, restored function, anatomical repair, or immunity to recurrence. |
| Functional recovery | The functional-state owner accepts restored current capability from source-owner facts. | Process resolution, healed injury, or anatomical restoration. |
| Ordinary injury recovery | The injury owner accepts the natural or treated recovery course of a recoverable injury. | Process resolution, regrowth, resurrection, or generic HP restoration. |
| Convalescence | A recovery owner coordinates ongoing limitation, support, and return-to-activity facts after acute threat. | Continued lethal process, full function, or erased history. |
| Anatomical restoration | Injury/body/restoration owners accept repair or recreation beyond ordinary healing. | Resurrection or reversal of actual death. |
| Resurrection | Death and magic owners accept restoration from actual death while eligibility remains open under Stakes. | Ordinary healing, injury treatment, or automatic eligibility. |

`heal.hp`, generic healing, resource restoration, rest, a healer role, a service label, a named item, and magic cannot substitute for these distinctions.

## 7. Process-Effect Proposals And Receipts

The accepted conceptual flow is:

```text
care-attempt accepted result
  -> bounded proposal addressed to one target owner
       -> target owner validates source result and current target truth
            -> target-owner consequence receipt
                 -> owner-certified process/body/injury/function transition
                      -> observer-safe projection
```

A process-effect proposal must conceptually preserve:

- source care-attempt result identity;
- target process or care-requirement identity;
- proposed semantic effect such as stabilize, suppress, reassess, or resolve;
- capability and material-evidence references;
- governing policy/semantic versions;
- conditional or expiry posture where the proposal depends on continuing facts;
- named uncertainty evidence reference where authorized;
- correction/supersession lineage.

This is an invariant list, not an accepted schema.

The target process owner may:

- accept the proposed effect;
- accept a narrower or conditional effect allowed by its contract;
- reject it as inapplicable, stale, or unsupported;
- require owner-certified reassessment before deciding;
- retain the process unchanged while another owner accepts a supportive consequence.

The care owner cannot write `stabilized`, `suppressed`, `resolved`, severity, stage, direction, or death contribution into the process instance. There is no universal stabilization flag, care-success roll, medical resolver, or “all conditions cured” receipt.

## 8. Reassessment

Reassessment is a new accepted assessment/result linked to prior source facts. It does not rewrite what occurred or what an observer previously knew.

Accepted qualitative triggers are owner-certified material changes in:

- movement, extraction, or transport posture;
- meaningful delay under the applicable owner policy;
- environment, exposure, shelter, weather, water, heat, or cold;
- observed worsening, improvement, recurrence, or new evidence;
- accepted response, partial response, failure, or expiry of a care effect;
- destination, provider, capability, access, equipment, supply, or helper posture;
- injury, body, process, hazard, magic, or functional-state truth.

A trigger creates an opportunity for the applicable owner to reassess. It does not itself worsen a process, start a global check, reveal hidden truth, or guarantee a new result.

Universal reassessment timers, clinical schedules, probabilities, deterioration curves, and automatic diagnosis are rejected.

## 9. Magic Boundary

Magic may contribute extraordinary:

- observation;
- communication;
- stabilization;
- suppression;
- supportive care;
- definitive treatment;
- anatomical restoration;
- resurrection.

Each capability exists only when the magic owner explicitly grants that scope and accepts the cast/resource/catalyst result. A spell's name, school, tag, `heal.hp` hook, or compatibility status is insufficient.

Magic does not automatically:

- diagnose hidden processes;
- make all healers equivalent;
- satisfy access, consent, range, target, material, catalyst, law, or cost requirements;
- make one generic healing effect stabilize every process;
- resolve an injury or process because HP increased;
- restore destroyed anatomy;
- reverse actual death;
- reopen terminal closure;
- expose validator-only or owner-private evidence;
- justify modern-scientific dialogue or pseudo-scientific technobabble.

An accepted magic result may propose effects to process/body/injury owners. Those owners still accept their own consequences.

## 10. Player-Facing Language Boundary

Internal ids, owner contracts, validation, and design documents may use precise technical language. Internal terminology is not automatic display text.

Future presentation must:

- use brief, concrete, everyday language plausible for the setting;
- distinguish direct observation, attributed report, trained judgment, and magical sensing;
- show only capability- and evidence-supported certainty;
- prefer phrases such as `the bleeding has slowed`, `breathing is easier`, `still faint and cold`, `stable for now`, `needs a healer`, or `must be taken somewhere safer`;
- avoid ordinary display use of `hypovolemic`, `respiratory compromise`, `cyanosis`, `perfusion`, `neurological deficit`, `syndrome`, or `triage`;
- keep healer, alchemist, scholar, and magical-diagnostician speech understandable;
- distinguish an attempt, visible response, qualified assessment, accepted owner effect, and unresolved need;
- never derive labels mechanically from internal ids.

Magic may support setting-appropriate extraordinary knowledge but not modern medical exposition. This decision does not author final UI, dialogue, narrative, or Chronicle strings.

## 11. First-Scope Compatibility

| First-scope process | Capability/process-effect boundary |
| --- | --- |
| External hemorrhage | Requires an explicitly applicable capability and owner-certified source facts. The care result may propose stabilization, suppression, or later resolution; the hemorrhage-process owner decides. A generic `bleeding` label or bandage item name is insufficient. |
| Confirmed internal hemorrhage | Requires accepted actual process truth, not observer suspicion. Capability may be scene-limited, supportive, transport-oriented, destination-only, or definitive, but this decision assigns no treatment. |
| Airway obstruction | Remains separate from other respiratory processes. Its owner may accept stabilization or resolution from an applicable result; no generic healing hook proves either. |
| Post-submersion respiratory compromise | Supports process-specific observation, support, transport, destination capability, and reassessment without a hidden delayed-death mechanic or automatic public diagnosis. |
| Systemic hypothermia | Consumes owner-certified thermal, environment, shelter, body, capability, and access facts. Local freezing injury remains a separate injury owner. |
| Hot-altered heat crisis | Consumes owner-certified heat, environment, body/function, capability, and access facts. Contextual non-stroke heat illness does not become this process automatically. |

Outside this scope:

- suspected internal bleeding remains observer/assessment evidence only;
- shock-like circulatory deterioration awaits an exact process-versus-assessment owner;
- poison families and selective countermeasures remain a research/design gap; `item.antidote_phial` proves neither;
- local freezing and superficial burns remain injury-owned by default;
- non-stroke heat illness remains contextual unless an accepted transition creates the systemic process;
- serious burns retain separate injury, body, respiratory, mechanism, care, and restoration owners;
- chemical, electrical, and inhalation distinctions remain hazard/mechanism inputs unless affected-domain owners accept distinct consequences.

No procedures, treatment instructions, material lists, recipes, dosages, durations, checks, formulas, probabilities, or balance values are defined.

## 12. Persistence, Replay, Correction, And Migration

Future persistence must preserve, under the applicable Stakes posture:

- initiating request/rejection audit evidence where required;
- admitted care-attempt identity and normalized material-input policy/version;
- accepted deterministic or uncertain result;
- named-channel evidence reference without exposing secret internals;
- owner-addressed effect proposals;
- each owner-specific consequence receipt and application posture;
- linked reassessments;
- correction, supersession, compensation, and reconciliation status;
- renderer-safe evidence separately from private validation facts.

Replay uses retained accepted results and receipts. It does not recalculate from current skills, items, content, spells, services, or balance. Duplicate delivery cannot repeat consumption, process mutation, magic cost, movement, payment, Chronicle writing, or rewards.

Correction authority remains with the owner of the affected truth plus campaign/save propagation authority. Correcting a care result requests owner-specific reconciliation; it does not directly edit downstream process, inventory, magic, or narrative state.

No current data migrates:

| Current surface | Classification |
| --- | --- |
| `heal.hp` and combat healing formulas | retained combat-resource authority; not care truth |
| Healing-school spells and tags | compatibility/source evidence only |
| Field Medicine, Water Safety, Healing Magic, and Alchemy skills | identity evidence only; no capability grant |
| Healer/support combat roles | tactical metadata; rejected capability inference |
| Six care-like item names | static identity; rejected effect or material inference |
| Nine consumable profiles | retained metabolic food/drink behavior |
| Five planned services | retained unrelated static service identity |
| Body recovery context/assessment | retained metabolic recovery authority |
| UI rest full-resource restoration | compatibility behavior; rejected care/process inference |
| HP, combat defeat/incapacitation, `activeEffects`, labels, prose | projection or adjacent state; rejected process/care inference |
| Current saves, events, deltas, commands, Chronicle | compatibility evidence; no silent backfill |

There is no canonical care truth to migrate, alias, or backfill.

## 13. Validation And Test Plan

Because implementation is `NO_PACKAGE`, no schema, catalog, validator, helper, registration, test, runtime, or migration path is authorized.

A later package-readiness review must prove:

- collision-safe shared capability identity;
- one explicit grant owner and source per grant;
- no inference from roles, professions, names, prose, or tags;
- separation of grant, scene availability, destination offer, destination availability, access, admission, and result;
- versioned owner-certified material inputs;
- no capability-as-diagnosis, access, or success;
- no direct cross-owner mutation;
- one stable care-attempt occurrence and accepted result per admitted intent;
- duplicate-delivery idempotency;
- named uncertainty only where explicitly authorized;
- owner-specific receipts with partial retry;
- no generic healing as universal stabilization;
- no universal timer, roll, diagnosis, process, remedy, antidote, or stabilization flag;
- no treatment protocol or player-facing medical advice;
- deterministic replay from retained accepted facts;
- owner-authorized correction and downstream reconciliation;
- renderer-safe evidence separated from hidden process and validator facts;
- internal technical identity separated from plain in-world display language.

Negative fixtures must eventually reject role-derived capability, item-name-derived material effects, spell-name-derived process effects, HP-derived stabilization, service-name-derived access, observer suspicion as diagnosis, duplicate consumption, direct process mutation, and clinical display leakage.

## 14. Research Consumption And Retention

This decision is the third named consumer of:

`docs/dev/tmp-grounded-lethal-process-stabilization-and-first-aid-research-2026-07-28.md`

Verified retained integrity:

- UTF-8 byte length: `58943`;
- SHA-256: `95760de325004f7e19c030e0177e2022873ff8ff1690a0924974bd3b9674da6d`.

This decision consumed:

- stabilization, temporary suppression, supportive care, definitive treatment, resolution, functional recovery, anatomical restoration, and resurrection as distinct semantics;
- process-specific capability rather than a universal intervention;
- actor, equipment, material, environment, provider, destination, and access constraints;
- selective countermeasures rather than universal antidotes;
- qualitative reassessment after movement, delay, environment, symptom, response, destination, or capability change;
- observer evidence and capability-bounded certainty;
- rejection of clinical protocols, dosages, exact timers, universal rolls, diagnosis from one sign, and modern institutional assumptions.

The decoded artifact remains byte-identical and retained.

The only outstanding named consumer is now:

1. the first observer-safe crisis assessment/presentation package.

## 15. Package Readiness

`NO_PACKAGE`

Exact missing authority:

- exact shared care-capability catalog owner, path, fields, ids, lifecycle, and validation;
- exact grant owners and grant representation for actor, skill, spell, item, provider, and institution sources;
- live lethal-process definitions and owner-specific mutable instances;
- live care requirements and their derivation/persistence;
- exact care/action owner and care-attempt occurrence/result contract;
- exact material-input normalization policies;
- exact scene and destination capability assessment owners;
- access, consent, exception, law, provider-willingness, and affordability contracts;
- inventory reservation/consumption and partial-receipt behavior;
- general magic cast/effect execution beyond current HP combat behavior;
- persistence, replay, migration, named-channel, and correction schemas;
- observer-safe assessment and presentation authority;
- poison-family and serious-burn owner closure.

No executable, treatment-bearing, balance-bearing, schema, content, test, runtime, save, migration, service, item, spell, UI, or gameplay package is authorized.

## 16. Exact Follow-Up Route

Next:

Unversioned `Observer-Safe Crisis Assessment And Presentation Contract Decision`

That documentation-only run is the fourth and final named research consumer. It must decide:

- observer, viewpoint, visibility, recognition, assessment, diagnosis-confidence, and urgency ownership;
- direct observation, attributed report, trained judgment, magical sensing, and hidden truth boundaries;
- renderer-safe versus validator-only evidence;
- qualitative trend and reassessment presentation;
- process, care-attempt, effect-receipt, transport, destination, and unresolved-need projections;
- plain, setting-appropriate language and deterministic fallback;
- persistence/regeneration/correction posture for presentation without making prose authority;
- final research-artifact retention or removal conditions.

It must not implement UI, narrative generation, schemas, runtime, medical advice, treatment protocols, balance, or gameplay.

## Explicit Answers

1. **What owns care-capability identity?** A future shared vocabulary authority; grants and resolvers remain owner-specific.
2. **How are grant, availability, access, and result separated?** Grant, scene availability, material availability, destination offer, destination availability, access, admission, and accepted result are distinct owner-certified facts.
3. **What evidence may be consumed?** Only versioned source-owner facts for actor, patient, process/requirement, equipment/material, scene, consent, environment, destination, access, and prior results.
4. **What is the occurrence boundary?** The initiating owner creates request identity; the care owner validates and admits one occurrence; an accepted result emits owner-addressed proposals; each downstream owner records its own receipt.
5. **How do care semantics differ?** Stabilization bounds, suppression conditionally constrains, support sustains without source control, definitive treatment targets cause/repair, process resolution ends one process, and recovery/restoration/resurrection remain separately owned.
6. **How may care affect a process?** Only by an accepted care result proposing a bounded effect that the process owner independently accepts through its consequence receipt.
7. **What triggers reassessment?** Owner-certified movement, delay, environment, observation/trend, intervention response, destination/capability, or upstream state change.
8. **What can magic do?** Only explicitly granted observation, communication, care, restoration, or resurrection work; it implies no omniscience or universal healing.
9. **What language applies?** Precise internal authority stays hidden; player-facing text is plain, concrete, setting-appropriate, attributed, and capability-bounded.
10. **What migrates?** No current surface becomes care truth. Existing hooks, skills, roles, items, services, body recovery, saves, and prose retain their current owners.
11. **Is a package ready?** No: `NO_PACKAGE`.
12. **What research was consumed?** Care semantic distinctions, capability/access constraints, process specificity, reassessment triggers, observer bounds, and unsafe-transfer rejections.
13. **What follows?** Unversioned `Observer-Safe Crisis Assessment And Presentation Contract Decision`.

## Non-Implementation Confirmation

This decision changes no content, schema, validator, test, helper, type, runtime, command, event, engine, UI, save, migration, dependency, generated output, medical protocol, treatment instruction, balance value, or gameplay behavior.
