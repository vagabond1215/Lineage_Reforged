# Checkpoint Commitment, Mortal Crisis, Resurrection Aftereffects, Final Closure, And Stakes Authority Revision

Date: 2026-07-25

Run: `Checkpoint Commitment, Mortal Crisis Sequence, Resurrection Aftereffects, Final Closure, And Stakes Authority Revision`

Classification: unversioned durable documentation-only design-authority revision

Status: accepted design authority; implementation remains unauthorized

Milestone impact: `supports_current_band`

## 1. Status, Scope, And Source Verification

This decision accepts the public Stakes taxonomy and the conceptual ownership boundaries for checkpoint commitment, Mortal Crisis, actual death, resurrection, convalescence, final closure, settlement, and succession ordering. It authorizes no runtime, schema, save, migration, UI, content, formula, probability, timer, reward, or gameplay work.

Repository verification:

- branch: `master`;
- upstream: `origin/master`;
- starting commit before fetch: `7734f07971ffbe7d66403c3d4267619f6cccf03b`;
- ending pre-edit commit after fast-forward pull: `fea042ab914f3da0b2db0a89648fcaf5c07d774c`;
- starting and post-pull worktree: clean;
- completed elemental-authority commit `7734f07971ffbe7d66403c3d4267619f6cccf03b` is an ancestor of the pre-edit commit;
- every prompt-pinned authority, audit, research, coordination artifact, and held-route blob matched exactly;
- held `Version 0.6.6` remains available as blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

The controlling evidence was the accepted campaign-rules, Normal Stakes fallback, restricted-Stakes, injury/restoration, Difficulty/World/Stakes, narrative-realization, and elemental decisions; the completed mortality research and defeat audit; and the live save, run-lifecycle, account, estate, Prestige, combat, player-state, and presentation seams. Live implementation remains incomplete and does not override this decision.

## 2. Executive Decision

Lineage: Reforged accepts three public Stakes choices:

1. **Normal Stakes** — `normal_stakes`;
2. **Committed Stakes** — `committed_stakes`;
3. **Ironbound Stakes** — `ironbound_stakes`.

The three tiers are materially distinct:

- Normal permits ordinary manual and quick saving, broad selected rollback, and outcome rerolling where no narrower owner has already committed a result.
- Committed limits selected rollback to retained qualifying checkpoints and commits named uncertain outcomes across materially identical replay.
- Ironbound maintains one authoritative continuity, permits no selected rollback, commits outcomes, and atomically closes a character at accepted actual death.

`Ironbound` is accepted as the final label for the previously unnamed restricted-Stakes contract. It is not a Difficulty, World Rules, legacy `hardcore` flag, or combat-profile mode. `Committed` is a descriptive Stakes label, not a claim that every event is irreversible. `Mortal` remains exclusively a Difficulty label.

The accepted mortal model separates functional state, independently owned lethal processes, derived care requirements, life state, and observer-facing urgency. Mortal Crisis is a six-phase orchestration and presentation framework:

```text
Threat Resolution
  -> Immediate Stabilization
  -> Extraction
  -> Transit
  -> Treatment Or Restoration
  -> Closure
```

Actual death is accepted only by a death owner from authoritative causes. Normal and Committed may permit restoration-eligible actual death. Ironbound collapses actual death, final death, and terminal character closure into one committed transaction and does not permit resurrection after that boundary.

Successful resurrection restores life state, not full health. Typed Post-Restoration Convalescence retains restoration strain, unresolved injuries, body-condition consequences, method-specific complications, and optional owner-accepted trauma effects.

Terminal Prestige, estate, Chronicle, account reward, achievement, and succession consequences settle only after authoritative final closure, never at reversible actual death.

## 3. Accepted Vocabulary

| Term | Accepted meaning |
| --- | --- |
| load topology | Historical states a player may select under the active Stakes contract. |
| checkpoint | An accepted save-owner state boundary with stable provenance; it is not inherently an outcome reroll. |
| event commitment | Retention of an accepted result for materially identical causal replay. |
| technical recovery | Nonselectable restoration of the latest verified authoritative state after failed or corrupt persistence. |
| occurrence identity | Stable identity of a causal event or transition. |
| uncertainty channel | A named causal draw family or equivalent identity; not one global ordered random stream. |
| functional state | Whether a living character is `active`, `downed`, or `unconscious`. |
| lethal process | An independently owned, causally sourced process capable of producing actual death if unresolved. |
| care requirement | Derived level of intervention needed: none, basic stabilization, professional care, or exceptional magic. |
| life state | Alive, actually dead but restoration-eligible, or final death. |
| urgency projection | Observer-facing `stable`, `unstable`, `aid required`, `resurrection possible`, or `closure imminent` evidence derived from authority. |
| Mortal Crisis | Cross-owner orchestration receipt and player-facing sequence; not a health, injury, travel, magic, party, institution, or AI owner. |
| actual death | An accepted death-owner transition from alive to dead, separate from HP zero or incapacity. |
| body identity | The unique retained physical remains and their accepted location/condition/provenance after death. |
| restoration eligibility | Deterministic policy result that actual death may still be reversed by an applicable accepted capability. |
| eligibility closure | Idempotent transaction ending restoration eligibility for an accepted cause. |
| final death | Death that no accepted current authority may reverse. |
| terminal character closure | Idempotent end of live character commands with read-only historical access retained. |
| Post-Restoration Convalescence | Typed owner-linked consequences after life is restored; never one generic debuff. |

## 4. Authority Precedence And Supersession Summary

This decision is now the most specific authority for public Stakes identities; checkpoint and event commitment; Mortal Crisis orchestration; actual-versus-final death; body and resurrection eligibility; post-restoration convalescence; and final settlement ordering.

It retains:

- orthogonal Difficulty, World Rules, and Stakes axes;
- creation locking and production availability gates;
- `normal_stakes` identity and ordinary manual/quick-save topology;
- Normal Stakes nonterminal HP-zero and generic fallback invariants;
- one-authoritative-continuity and no-chosen-rollback restricted posture;
- restricted immediate terminal actual death;
- nonzero circumstance-sensitive restricted Prestige direction;
- injury severity, recoverability, `Shaken Spirit`, restoration scarcity, and immutable-base-attribute boundaries;
- narrative-realization and elemental capability authorities.

It narrows or clarifies:

- context-specific Mortal Crisis outcomes control before the Normal generic fallback when sufficient owner facts exist;
- `recovery_pending` remains the Normal minimum repair posture and is not actual death;
- resurrection eligibility is decided separately by Stakes tier;
- terminal settlement occurs after final closure, not merely after actual death;
- restricted Stakes is now named Ironbound and uses committed occurrence/draw identity.

It supersedes:

- the deferral of the final restricted label and machine id;
- the deferral of the public Stakes tier count;
- any implication that a public checkpoint tier can be merely “fewer saves” without event commitment;
- any implication that terminal account settlement may occur at restoration-eligible actual death.

No existing authority file is edited in place. This artifact records the exact replacement clauses.

## 5. Public Stakes Tier Count, Labels, And Identities

The accepted stable identities are:

```text
Normal Stakes     -> normal_stakes
Committed Stakes  -> committed_stakes
Ironbound Stakes  -> ironbound_stakes
```

The ids are canonical policy identities, not proof of runtime availability. Production creation must expose a tier only after its save, commitment, death, closure, migration, warning, and validation contracts exist. Existing active and legacy campaigns do not migrate into Committed or Ironbound by inference.

`hardcore`, `hardcore_stakes`, `mortal`, and combat-profile `preferredMode: "hardcore"` are rejected as Stakes ids. Historical `dead` and `hardcore_dead` records remain historical facts rather than tier identities.

## 6. Complete Per-Tier Stakes Matrix

| Concern | Normal Stakes (`normal_stakes`) | Committed Stakes (`committed_stakes`) | Ironbound Stakes (`ironbound_stakes`) |
| --- | --- | --- | --- |
| manual save | ordinary manual slots retained | no free-form slot creation; an explicit request may create a checkpoint only at an owner-approved qualifying boundary | no manual historical slot |
| quick save/load | available | unavailable | unavailable |
| automatic/checkpoint saves | existing save-owner behavior; no defeat-forced save | qualifying major sleep and other explicitly authored checkpoint boundaries; retention policy deferred | live or semi-live authoritative checkpoints in one continuity |
| player-selected rollback | any valid retained save | only a retained qualifying checkpoint while no terminal commitment has retired it | none |
| technical recovery | normal validation/recovery may expose ordinary saves because rollback is allowed | hidden latest-verified recovery, never a favorable checkpoint picker | hidden latest-verified recovery, never a favorable generation picker |
| event/draw commitment | not generally required; owner-specific committed facts remain honored | required for named uncertain outcomes | required for named uncertain outcomes and accepted commands |
| ordinary defeat persistence | accepted in session; no save forced merely by defeat | result and causal identity persist in continuity and across checkpoint replay | result persists promptly in authoritative continuity |
| generic Normal fallback | accepted minimum when no context result exists | not inherited automatically; later tier adapter must preserve nonterminal safety unless an owner accepts death | not inherited automatically; HP zero still cannot imply death |
| actual death | may remain restoration-eligible | may remain restoration-eligible | atomically final when accepted |
| loaded earlier state may avoid death | yes | yes while an eligible prior checkpoint remains, but identical causes retain committed results | no |
| resurrection | permitted only when deterministic eligibility and an explicit capability exist | permitted on the same gates while eligibility remains open | unavailable after accepted actual death |
| final closure | final in the active timeline; an earlier selected save may abandon that timeline | finality retires the tier’s prior checkpoint ladder and becomes irreversible after warning/accepted closure | atomic with actual death |
| terminal settlement | timeline-local/reversible until no rollback-based abandonment can retain value | once after final closure commits and checkpoint retirement succeeds | once in the atomic death/closure transaction |
| successor control | only after final closure in the active timeline; abandoned timelines revoke it | only after committed final closure | only after atomic closure and settlement ordering |
| warning | ordinary rollback and timeline-abandonment effects | checkpoint-only rollback, committed outcomes, and checkpoint retirement at final closure | one continuity, no chosen rollback, actual death final, no resurrection |
| availability gate | current accepted tier, subject to existing implementation | unavailable until full policy/persistence/migration/UI/tests | unavailable until full policy/persistence/migration/UI/tests |

Committed checkpoint cadence, retention count, exact qualifying sleep rules, and storage strategy remain implementation decisions. The semantic distinctions above are not deferred.

## 7. Load Topology Boundary

Load topology answers only which accepted historical states the player may select.

- Normal exposes ordinary valid manual and quick saves under the existing save owner.
- Committed exposes only retained qualifying checkpoints. A save request outside a qualifying boundary cannot manufacture a branch.
- Ironbound exposes only continuation from the latest authoritative state.

Loading a prior Normal or Committed state abandons the later active-play timeline. Projections may preserve explicitly marked personal or superseded text, but abandoned state cannot remain authoritative gameplay history.

## 8. Technical Recovery Boundary

Technical recovery restores the latest verified authoritative state after corruption, interruption, or incomplete persistence. It never expresses player preference.

- Normal may use the same validation machinery as ordinary load because player rollback is already permitted.
- Committed and Ironbound may keep hidden journals or rotating generations, but recovery selects the newest valid authoritative generation, not the most favorable state.
- Recovery provenance records the failed generation, selected verified source, policy/version, correction reason, and resulting continuity where later implementation supports it.

Exact depth, journal format, snapshots, canonicalization, storage, and repair UI are deferred.

## 9. Event/Draw Commitment And Replay Equivalence

Committed and Ironbound require occurrence-scoped outcome commitment where uncertainty is authorized. Normal does not impose this globally, although any narrower owner’s already committed facts remain authoritative.

A materially identical cause preserves:

- the same source occurrence and owner;
- the same relevant participants and roles;
- the same accepted choices and causally relevant ordering;
- materially equivalent equipment, resources, capabilities, conditions, relationships, and permissions;
- the same locality, route segment, relevant environment, threat, and target state;
- the same governing content/rules/policy versions;
- the same named uncertainty channel and correction lineage.

Changed preparation, equipment, route, timing, participants, environment, accepted action, target, or other owner-certified causal input may create a new occurrence or draw identity. Reload, re-entry, trivial menu order, harmless unrelated actions, renderer variation, camera/UI state, or reordered noncausal queries do not.

One global ordered random stream is rejected as authority. Later implementations must use named uncertainty channels or an equivalent causal identity so unrelated actions cannot shape a desired result. No algorithm, seed, hash, serialization, or channel catalog is selected here.

## 10. Checkpoint, Source, Policy, And Correction Provenance

Later contracts must retain enough provenance to explain and replay accepted outcomes:

- campaign, continuity, save/checkpoint, and occurrence identity;
- causal source and owner;
- governing Stakes and policy versions;
- material input identity or equivalent normalized evidence;
- uncertainty channel and accepted draw/result identity where applicable;
- prior result consumed or superseded;
- correction authority, reason, and lineage;
- downstream consequences already applied.

A correction may replace invalid state through explicit authority. It is not ordinary rollback, resurrection, or a new draw. Replay after correction cannot duplicate injury, body, Chronicle, Prestige, estate, reward, or succession consequences.

## 11. Mortal-State Authority

The accepted conceptual model is:

```text
functional state
  active | downed | unconscious

lethal processes
  zero or more independently owned progressing conditions

care requirement
  none | basic stabilization | professional care | exceptional magic

life state
  alive | actually dead but restoration-eligible | final death

derived presentation
  stable | unstable | aid required | resurrection possible | closure imminent
```

Functional state does not own life state. A conscious character may carry a lethal process; a downed or unconscious character may be stable. HP zero, defeat, unconsciousness, immobility, or encounter closure does not establish actual death.

Lethal processes remain owned by the health, injury, condition, hazard, magic, environment, combat, or other domain that created them. The first catalog remains deferred, but future contracts must support bleeding, poison, exposure, suffocation, progressive magical harm, continued attack, and other separately accepted processes without one universal timer.

Care requirement and urgency language are deterministic projections from current processes, capabilities, body facts, and knowledge. They are not duplicate mutable statuses. No generic `critical`, `near death`, or `stable-critical` flag may become a parallel owner.

## 12. Mortal Crisis Owner Graph

```text
combat / hazard / health / injury / condition / magic owners
  -> functional state, threats, processes, body and capability facts
party / relationship / inventory / travel / institution / world owners
  -> helpers, permission, supplies, routes, access and care facts
Stakes / death / body / restoration owners
  -> tier policy, actual death, eligibility and closure facts
Mortal Crisis orchestrator
  -> accepted phase transitions, choices, receipts and unresolved blockers
narrative realization
  -> observer-safe presentation and explicit decision surfaces
Chronicle / Manuscript / UI
  -> projections only
```

The orchestrator consumes owner-certified facts and records reasons. It cannot invent an injury, process, rescuer, route, institution, capability, body, death, resurrection, or outcome.

## 13. Phase Sequence And Stage-Skipping Rules

The accepted sequence is:

1. Threat Resolution;
2. Immediate Stabilization;
3. Extraction;
4. Transit;
5. Treatment Or Restoration;
6. Closure.

A phase may be skipped only when an accepted reason proves it unnecessary or already complete. Examples include no remaining threat, stabilization not required, treatment available at the incident site, no transport required, direct authorized magical transport, actual death with no tier eligibility, or an already accepted closure.

Every skip records the owner fact and policy that justified it. A skip cannot silently create safety, a helper, transport, treatment, restoration, or finality.

## 14. Threat Resolution

Threat Resolution determines whether hostile actors, predators, legal actors, hazards, curses, weather, fire, exposure, or other active threats remain.

It consumes accepted goals, disposition, encounter outcome, hazard state, law, world facts, and relevant causal memory. Downing does not universally end hostility. An accepted withdrawal, capture, feeding goal, surrender, intervention, obstruction, or threat removal may end or change the phase.

Mortal Crisis does not create one hostility meter or assume “combat ended, therefore safe.”

## 15. Immediate Stabilization

Immediate Stabilization applies authorized process-specific interventions such as pressure, protection, airway support, antidote, warming/cooling, magical suppression, or another owner-approved action.

Basic stabilization:

- stops, bounds, or reduces only the named process the capability addresses;
- may improve derived urgency;
- does not imply consciousness, mobility, complete recovery, safety, extraction, definitive care, or life restoration;
- requires an eligible actor, capability/item/environment, access, knowledge, permission, and resources.

A downed conscious patient may choose only actions its owners still permit. An unconscious or actually dead patient cannot perform reflex choices. Choices instead belong to a conscious party member, campaign controller, authorized rescuer, institution, house/line controller, or other accepted actor.

## 16. Extraction

Extraction resolves carrying, dragging, assisted movement, mounts, vehicles, magical transport, sheltering, route opening, interception, or inability to move.

It consumes:

- patient/body transportability;
- helper capability, condition, permission, relationship, and carrying capacity;
- mounts, vehicles, tools, wards, and supplies;
- route, terrain, weather, visibility, obstruction, exposure, law, and remaining threat;
- destination and intermediate-site facts.

No opaque rescue percentage may replace these facts.

## 17. Transit And Reassessment

Transit belongs to accepted time, travel, hazard, body, and process owners. Independently progressing processes continue according to their own rules. Changed weather, delay, route, pursuit, supplies, patient state, or available helpers may trigger reassessment and a new accepted intervention.

Committed and Ironbound preserve occurrence and uncertainty identity across reload, checkpoint replay, re-entry, and technical recovery. A materially changed route or intervention may create a new causal event; a presentation refresh does not.

## 18. Treatment And Restoration Routing

Treatment Or Restoration distinguishes:

- ordinary rest and biological recovery;
- basic or professional treatment;
- exceptional anatomical restoration;
- corpse recovery and preservation;
- resurrection.

An intermediate caregiver or shelter may stabilize processes, provide supplies, improve transport, or refer the patient without possessing definitive capability. A definitive institution has the accepted capability and access needed for the unresolved condition, but arrival still does not guarantee willingness, legality, compatibility, resources, consent, or success.

This supports:

```text
incident
  -> field stabilization
  -> intermediate shelter or caregiver
  -> stronger stabilization, supply, transport, or referral
  -> definitive institution
```

The pattern authorizes no healer, institution, spell, item, or location content.

## 19. Rescue Inputs, Choices, And Uncertainty

Rescue consumes factual owner inputs:

- threat goals, disposition, pursuit, capture, legal duty, predation, and disengagement;
- active hazards and lethal processes;
- conscious helpers, loyalties, permissions, relationships, skills, knowledge, injuries, and conditions;
- supplies, tools, antidotes, catalysts, wards, mounts, vehicles, and capacity;
- patient/body state and transportability;
- route, terrain, weather, visibility, distance, time, exposure, and obstruction;
- site and institution capability, access, willingness, law, cost posture, standing, obligation, and resources;
- explicitly gated magical-entity aid.

Named uncertain events are allowed only with stable occurrence/channel identity, retained inputs, accepted result, and replay policy. One omnibus rescue roll is rejected. Forecasts and decisions may expose known contributors and blockers without promising hidden results.

## 20. Relationship To The Normal Stakes Fallback

Context-specific accepted Mortal Crisis outcomes control when sufficient owner facts exist. Otherwise, the accepted generic Normal Stakes fallback remains the minimum safe nonterminal result:

- HP zero alone does not infer rescue, capture, injury, trauma, loss, magic, actual death, or resurrection;
- ordinary fallback defeat remains deterministic, nonterminal, and consequence-light;
- no defeat-forced save is added to Normal;
- `recovery_pending` remains available when the destination chain or legacy repair cannot safely resume play;
- terminal archive, save deletion, estate, Prestige, and succession actions remain absent.

Mortal Crisis does not make injury, trauma, loss, or convalescence a mandatory repeated defeat tax.

Committed and Ironbound require later tier-specific defeat adapters before production availability. They do not automatically inherit a Normal rollback receipt, but they retain the universal rule that HP zero cannot imply actual death.

## 21. Actual Death Authority

Actual death occurs only when the death owner accepts that authoritative causal facts ended life. A lethal process, direct attack, execution, environmental cause, magical effect, or another accepted owner may propose the result; the death owner validates the life-state transition under the active Stakes policy.

Actual death records stable:

- character and occurrence identity;
- cause, source, place, and time/order;
- governing policy/version;
- body identity, initial location, and relevant condition;
- witnesses/evidence and observer permissions where accepted;
- restoration eligibility result or immediate tier finality;
- correction lineage.

Actual death is never inferred solely from HP zero, defeat, downing, unconsciousness, immobility, encounter closure, a UI notice, or prose.

## 22. Body Identity, Condition, Recovery, Transport, Preservation, And Loss

When actual death occurs, the body remains a unique identity-bearing world fact, not a generic item stack.

Body recovery, transport, preservation, theft, concealment, alteration, destruction, burial, loss, and correction require accepted owner transitions. Runtime unloading, scene exit, save/load, source recreation, or missing presentation cannot move, destroy, bury, duplicate, or lose a body.

Body condition and time matter only through accepted death, body, preservation, and magic policies. A missing, inaccessible, destroyed, transformed, invalid, or otherwise ineligible body closes restoration only through an accepted fact and closure transaction.

The actually dead character cannot act or choose. Authorized survivors, institutions, house/line controllers, or campaign-level actors make recovery, preservation, restoration, abandonment, and funeral choices.

## 23. Per-Tier Resurrection Eligibility

### Normal Stakes

Actual death may be restoration-eligible when deterministic body, identity, capability, policy, and causal requirements pass. A loaded earlier save may avoid the death. Body recovery and preservation matter in the active timeline where the accepted capability requires them.

An authorized controller may abandon eligibility after an informed warning. Closure is irreversible within that active timeline, but loading an allowed earlier save abandons the later timeline and its nonauthoritative account consequences.

### Committed Stakes

Actual death may be restoration-eligible on the same explicit gates. An eligible retained checkpoint may be selected while restoration remains open, but replaying materially identical causes retains committed results.

Accepted final closure retires the pre-closure checkpoint ladder atomically. Informed abandonment is irreversible when that checkpoint-retirement/closure transaction succeeds. Automatic closure from body or capability facts follows the same committed finality and warning posture where the player could reasonably act.

### Ironbound Stakes

Accepted actual death is immediately final. It atomically closes the character under the one-authoritative-continuity rule. Resurrection eligibility is unavailable after commitment, no prior save may avoid the death, and no hidden rare-magic exception exists.

The body and death facts remain historically and narratively relevant, but they cannot reopen play.

## 24. Restoration Capability And Access Gates

Resurrection eligibility requires deterministic explainable facts, including where applicable:

- a Stakes tier that permits restoration-eligible death;
- correct stable character, death, body, and occurrence identities;
- an explicit compatible resurrection capability;
- valid body condition, preservation, locality, and access required by that capability;
- eligible actor/institution, knowledge, permission, willingness, law, relationship, and consent posture;
- required resource, catalyst, site, cost, obligation, risk, and time posture;
- no accepted prior final closure;
- acceptance by death, magic, body, health, Chronicle, save, and other affected owners.

Eligibility may be deterministic even when access is rare. Randomly deciding after death whether resurrection exists is rejected.

## 25. Eligibility Abandonment And Closure

Eligibility may close through:

- successful resurrection;
- accepted irreversible body destruction or transformation;
- accepted permanent loss or inaccessibility;
- accepted expiration under body-condition, preservation, time, or capability policy;
- failure of an explicitly final restoration attempt;
- accepted absence of any compatible capability;
- informed authorized abandonment, funeral, or closure;
- Ironbound immediate finality;
- another explicitly accepted terminal cause.

Abandonment is permitted only in Normal or Committed while eligibility is open. The decision actor must be an authorized living controller or institution, receive sufficient nonspoiler information, and explicitly confirm the consequence. An unconscious/dead patient, accidental dismissal, timeout caused by UI failure, or missing information cannot silently finalize death.

Closure records cause, authority, decision actor, evidence, checkpoint/source identity, policy/version, and time/order. It is idempotent. Once authoritative final closure is accepted, duplicate delivery, copied saves, recovery, projection, or correction cannot pay consequences again.

## 26. Successful Resurrection

Successful resurrection:

- returns life state to alive;
- consumes or resolves restoration eligibility exactly once;
- records capability, actor, method, body, cost/resource, cause, occurrence, and outcome provenance;
- applies only owner-accepted immediate restoration effects;
- enters Post-Restoration Convalescence unless an explicit capability proves no remaining burden.

It does not automatically restore consciousness, mobility, full HP/MP/Stamina, destroyed anatomy, unresolved injuries, impairments, poison, disease, curses, trauma, inventory, equipment, location, quests, relationships, or world state.

## 27. Post-Restoration Convalescence

```text
Post-Restoration Convalescence
  = restoration strain
  + unresolved injuries
  + body-condition consequences
  + method-specific complications
  + optional owner-accepted trauma consequences
```

Possible owner-certified effects include delayed consciousness, required rest, temporary Stamina ceiling or regeneration limits, exertion or travel restrictions, continued treatment, vulnerability, and no immediate combat return.

Consequences follow death cause, body condition, restoration method, and explicit capability. They are not a detached random punishment table. Exact effects, durations, probabilities, formulas, methods, and balance remain deferred.

Immutable base attributes are never reduced. Current-state, injury, condition, body, trauma, magic, equipment, and contextual owners supply adjustments. Generic resurrection cannot erase normally irreversible harm unless its capability explicitly includes that restoration.

## 28. Final Death And Terminal Character Closure

For Normal and Committed:

```text
actual death
  -> provisional body and restoration eligibility
  -> successful resurrection OR eligibility closure
  -> final death
  -> terminal character closure
```

For Ironbound:

```text
accepted actual death
  -> final death + terminal character closure atomically
```

Terminal closure:

- stops all live character commands;
- preserves read-only historical access;
- records source, checkpoint/continuity, policy, body/death, and correction provenance;
- is idempotent;
- never physically deletes the final character record merely because play closed;
- survives restart, discovery, copied slots, and technical recovery according to the tier’s authority.

Final death closes the character. It does not automatically close the account, house, lineage, world, or campaign; those continuities proceed only through their own accepted owners and the settlement/succession order below.

Correction may supersede invalid closure through explicit provenance. It cannot masquerade as resurrection or chosen rollback.

## 29. Rollback Provenance And Timeline Integrity

Every loadable state has stable save/checkpoint provenance. Loading an earlier Normal or Committed state abandons later timeline-local gameplay outcomes.

An abandoned timeline cannot retain irreversible account reward, estate transfer, achievement, successor control, or other durable value unless a separate account authority explicitly accepts a nonexploitative cross-timeline rule. Current authority accepts no such rule.

Normal final closure remains final only within its active timeline; selected rollback may abandon it. Any resulting account effects must therefore be timeline-local and reversible or withheld.

Committed final closure atomically retires earlier selectable checkpoints. If checkpoint retirement fails, closure and downstream settlement do not partially apply.

Ironbound final closure is authoritative across its one continuity. Technical recovery restores that closure rather than selecting a pre-death branch.

## 30. Prestige, Estate, Chronicle, Account, Achievement, And Succession Ordering

For every resurrection-permitting tier:

```text
actual death
  -> provisional nonpaying death/body/eligibility notice
  -> restoration OR eligibility closure
  -> final death
  -> terminal character closure
  -> terminal Chronicle / Prestige / estate / account / achievement settlement
  -> successor or heir availability
```

Ironbound performs actual death, final death, and closure atomically, then applies the same downstream settlement order.

Rules:

- Prestige and Legacy do not settle at reversible actual death.
- Estate transfer does not settle at reversible actual death.
- Terminal Chronicle closure and irreversible achievements/rewards do not settle at reversible actual death.
- Successor control does not begin while eligibility remains open.
- Provisional notices are nonpaying and nonterminal.
- Final settlements use stable closure, source, checkpoint/continuity, and consumed-evidence identities.
- Duplicate delivery, load, replay, technical recovery, copied save, campaign replay, and correction cannot pay twice.
- Normal rollback abandons later timeline-local settlement and successor state.
- Committed settlement occurs only after checkpoint retirement and closure commit.
- Ironbound settlement occurs once after its atomic closure.

`deathZeroesPrestige` remains rejected. Where terminal Prestige applies, completed-life significance and distinct public, legal, religious, household, companion, faction, regional, legendary, publicity, disgrace, and sacrifice evidence remain eligible owner inputs. Exact currencies, formulas, inheritance, successor selection, rewards, and availability remain deferred.

Terminal settlement belongs to a character/timeline only when final closure is authoritative under that tier. Separate campaign-completion rewards remain governed by their own authority.

## 31. Read-Only Historical Access

Final closure removes live mutation, not history. Read-only projections may include identity, relationships, Chronicle, body/death facts, achievements, failures, property, estate disposition, public/legal assessments, Prestige settlement, and successor links where observer and inheritance rules allow them.

Normal projections must identify history from an abandoned timeline as superseded or omit it from authoritative history. Committed and Ironbound retain their committed closure history. Chronicle, Manuscript, and UI never reopen character authority.

## 32. Narrative And Observer Integration

The accepted narrative pipeline remains:

```text
authoritative crisis, body, care, restoration, and closure facts
  -> owner-certified event-time evidence
  -> observer projection
  -> scene and beat planning
  -> referent and grammar resolution
  -> locale-specific deterministic realization
  -> validation and fallback
  -> Mortal Crisis UI / Chronicle / Manuscript
```

Presentation uses structured exact backend facts and an observer-limited surface. It may show qualitative urgency, visible changes, recognized diagnoses, available actions, blockers, and explicit decisions. It does not reveal raw timers, percentages, seeds, draw ids, hidden processes, future outcomes, or validator-only facts by default.

Prose cannot invent motive, emotion, dialogue, diagnosis, capability, rescuer, institution, object, route, choice, or outcome. It must preserve identity, grammar, appearance, equipment, held objects, chronology, locality, recognition, and observer access. Validation failure produces deterministic simplification/fallback, never a parallel battle-log authority.

## 33. Elemental And Magical-Entity Integration

An elemental, fae, nature spirit, guardian, construct, magical animal, summoned/bound entity, or other being may assist only through:

1. present accepted identity;
2. explicit applicable capability;
3. qualifying trigger or direct interaction;
4. disposition, relationship, role, consent, binding, and policy eligibility;
5. range, access, environment, knowledge, and condition;
6. cost, risk, resource, sacrifice, cooldown, or comparable constraint;
7. deterministic response selection;
8. affected-owner acceptance;
9. retained causal evidence.

Benevolence, elemental alignment, fae identity, guardian role, deity association, narrative importance, or convenient proximity cannot create diagnosis, supplies, transport, healing, regrowth, anatomical restoration, resurrection, or rescue.

Elemental response provenance remains separate from Mortal Crisis uncertainty and cannot become an unowned crisis draw.

## 34. Authority Retention And Supersession Matrix

| Authority | Disposition | Exact result |
| --- | --- | --- |
| Difficulty/World/Stakes separation | retained | Axes remain orthogonal; Difficulty and Grim World never silently select Stakes. |
| campaign identity, locks, and availability | retained and extended | Existing `normal_stakes` remains; two future ids are accepted but unavailable until complete owner packages pass gates. |
| Normal manual/quick-save topology | retained | No change to current broad selected rollback. |
| Normal generic fallback | retained and narrowed | It remains minimum safe nonterminal behavior; context-specific Mortal Crisis outcomes control when certified facts exist. |
| Normal no-forced-save defeat behavior | retained | Ordinary defeat does not force a save or checkpoint. |
| restricted one-continuity/no-rollback posture | retained | Now named Ironbound Stakes. |
| restricted immediate actual-death terminal closure | retained and clarified | Ironbound actual death, final death, and closure are one atomic boundary; no resurrection. |
| restricted nonzero Prestige direction | retained and reordered | Settlement follows atomic final closure and remains idempotent; `deathZeroesPrestige` stays rejected. |
| injury severity/recoverability | retained | Lethal processes and convalescence do not collapse Minor/Moderate/Major or irreversible-harm distinctions. |
| `Shaken Spirit` | retained | It is a trauma condition, not a universal crisis or resurrection tax. |
| ordinary healing vs restoration/resurrection | retained and clarified | Stabilization, treatment, anatomical restoration, and resurrection remain separate capabilities. |
| resurrection-per-tier boundary | supersedes prior deferral | Normal and Committed may permit deterministic eligibility; Ironbound prohibits it after accepted actual death. |
| public Stakes count/name deferral | superseded | Three tiers are accepted; Committed and Ironbound ids/labels are final authority. |
| checkpoint scarcity alone | superseded/rejected | Committed requires event/draw commitment, not merely fewer saves. |
| narrative realization | retained | Mortal Crisis is a downstream consumer of the accepted evidence/projection/realization pipeline. |
| elemental capability | retained | Crisis aid remains capability-gated and effect-owner accepted. |
| campaign defeat/death/finality | clarified | HP zero remains nonterminal by default; actual and final death use explicit owners and tier policy. |
| Chronicle/Manuscript | retained | They project history and cannot reconstruct active crisis, body, death, or eligibility state. |
| estate/account/achievement/succession | narrowed | Irreversible consequences follow final closure only. |
| held `0.6.6` / retained `0.6.7` | retained unchanged | No restoration, regeneration, or implementation authorization. |

## 35. Future Implementation-Package Order Without Permission

If later authorized, the required conceptual sequence is:

1. final Stakes identities, policy registry, creation locks, availability gates, and campaign/save provenance;
2. checkpoint/load topology and technical-recovery contracts;
3. occurrence, named uncertainty channel, commitment, correction, and replay-equivalence contracts;
4. functional-state and lethal-process owner boundaries;
5. active injury/condition/process instances and care-requirement derivation;
6. Mortal Crisis receipts and phase transitions;
7. rescue/extraction/transport capability and route adapters;
8. treatment/institution capability and access adapters;
9. actual-death and body-state contracts;
10. restoration-eligibility and exceptional-magic capability contracts;
11. Post-Restoration Convalescence and health/body/trauma adapters;
12. final-closure transaction, including Committed checkpoint retirement;
13. Prestige, estate, Chronicle, account, achievement, and succession settlement;
14. narrative evidence, observer projection, deterministic realization, validation, and decision surfaces;
15. migrations, saves, copied-slot protection, correction, idempotency, and representative integration tests;
16. content, balance, formulas, timers, probabilities, rewards, and production availability only through separate authorization.

No release version, package path, schema, implementation prompt, dependency, storage strategy, or algorithm is assigned.

## 36. Future Test And Validation Matrix

Future noncanonical fixtures must cover:

### Stakes, checkpoints, and commitment

- all three ids/labels and no collision with Difficulty `mortal`, legacy `hardcore`, or combat modes;
- creation locks and availability gates;
- Normal manual/quick rollback, Committed checkpoint rollback, and Ironbound no rollback;
- hidden recovery never becoming favorable selection;
- identical causes retaining committed results in Committed/Ironbound;
- material preparation changes producing valid new identities;
- trivial action/menu/presentation order not producing rerolls;
- no global-sequence manipulation;
- correction provenance and duplicate-consequence prevention;
- Committed final closure retiring the checkpoint ladder atomically.

### Functional and lethal state

- active, downed, unconscious, alive, restoration-eligible actual death, and final death remain distinct;
- downed without lethal process and conscious with a lethal process;
- multiple independent processes;
- stabilization resolving one process but not another;
- derived stable/unstable/aid-required presentation;
- no duplicate critical flag or universal bleed-out timer.

### Mortal Crisis

- continued and resolved threats with owner-certified reasons;
- process-specific first aid and no qualified helper;
- extraction with capacity, route, weather, and threat constraints;
- intermediate care before definitive treatment;
- transit reassessment;
- every valid phase skip and missing-reason rejection;
- no reflex decision by an unconscious/dead patient;
- no omnibus rescue roll.

### Actual death and body

- actual death distinct from HP zero;
- stable body identity/location;
- recovery, transport, preservation, theft, burial, loss, destruction, unloading, and correction remain distinct;
- source recreation cannot duplicate a body;
- Normal/Committed eligibility versus Ironbound atomic finality.

### Resurrection and convalescence

- deterministic eligibility with rare access;
- capability, body, target, consent, law, resource, and institution gates;
- informed abandonment by a valid actor;
- dismissal/UI failure cannot close eligibility;
- successful resurrection does not erase unrelated injury, trauma, or irreversible harm;
- cause/method-specific convalescence;
- delayed consciousness/no immediate combat return where accepted;
- no immutable-base loss, generic full heal, or resurrection after final death.

### Settlement and succession

- provisional actual-death notices are nonpaying;
- settlement follows final closure once;
- Prestige does not zero;
- estate/successor ordering;
- replay, rollback, copied save, recovery, duplicate delivery, campaign replay, and correction cannot duplicate value;
- Normal abandoned timeline loses account value;
- Committed closure pays only after checkpoint retirement;
- read-only access remains.

### Narrative and magical aid

- qualitative urgency without hidden timer/draw leakage;
- observer-limited diagnosis and reassessment;
- correct grammar, appearance, equipment, locality, chronology, and recognition;
- accepted aid/failure without invented motive;
- deterministic fallback;
- Chronicle/Manuscript never reconstruct authority;
- helpful Darkness-aligned and hazardous Light-aligned fixtures;
- explicit capability/effect-owner acceptance and separate elemental provenance.

## 37. Temporary-Evidence Retention And Removal Conditions

Retain:

- `docs/dev/tmp-comparative-checkpoint-mortality-rescue-and-stakes-research-2026-07-23.md` until every checkpoint, commitment, Mortal Crisis, resurrection, settlement, and succession implementation consumer has recorded consumption;
- `docs/dev/tmp-normal-stakes-defeat-injury-trauma-and-restoration-audit-2026-07-22.md` until this decision and the first relevant runtime replacement/repair package have recorded consumption;
- narrative audit/research until Mortal Crisis and narrative implementation consumers have recorded consumption;
- elemental audit/research until their remaining elemental implementations and any crisis-capability consumer have recorded consumption.

No temporary artifact is deleted by this run. Removal requires verification that all named consumers have consumed the evidence and that durable decisions retain the necessary conclusions.

## 38. Unresolved Implementation Questions

The following remain implementation-only:

- checkpoint cadence, qualifying major-sleep predicate, checkpoint count, retention, and UI;
- persistence, journal, snapshot, canonicalization, hashing, recovery depth, and copied-slot detection;
- occurrence normalization, uncertainty-channel catalog, algorithm, and correction mechanics;
- exact lethal-process catalog, progression, treatment effects, and observer projections;
- rescue resolver interfaces, route/institution adapters, and uncertainty policy;
- body storage/location/condition representation and preservation mechanics;
- resurrection capabilities, sites, actors, access, cost, risk, and setting content;
- convalescence effect catalog, duration, formula, and balance;
- final-closure, account, estate, achievement, and succession transaction mechanics;
- reward currencies, formulas, inheritance law, successor selection, and campaign-completion relationship;
- exact schemas, packages, migrations, saves, UI, content, and tests;
- production availability and compatibility combinations.

These questions do not reopen the three-tier taxonomy, owner graph, actual/final death relationship, per-tier resurrection policy, convalescence boundary, or settlement ordering.

## 39. Explicit Non-Decisions

This decision does not:

- implement or authorize any system;
- add field, interface, schema, package, dependency, save format, migration, algorithm, timer, probability, formula, reward, content, or UI;
- define injuries, lethal processes, healers, institutions, resurrection spells, items, entities, encounters, heirs, or quests;
- make Mortal Crisis a health owner, minigame, behavior tree, planner, or AI;
- make HP zero actual death;
- accept a universal bleed-out timer, critical flag, rescue chance, hostility value, or resurrection debuff;
- treat passive enchanted equipment as casting;
- derive capability from morality, alignment, identity, role, religion, or narrative importance;
- allow final death to be resurrected;
- pay irreversible value at reversible actual death;
- make technical recovery player rollback;
- restore `Version 0.6.6`, change retained `0.6.7`, assign a release version, or create an implementation prompt.

## 40. Answers To The Required Conclusions

| # | Accepted conclusion |
| --- | --- |
| 1 | Three public Stakes choices. |
| 2 | Normal Stakes / `normal_stakes`; Committed Stakes / `committed_stakes`; Ironbound Stakes / `ironbound_stakes`. |
| 3 | Normal has broad rollback/no general commitment; Committed has checkpoint rollback/committed outcomes; Ironbound has one continuity/no rollback/atomic death finality. |
| 4 | Normal permits manual and quick saves; Committed permits checkpoint creation only at qualifying boundaries and checkpoint selection; Ironbound permits continuation checkpoints only. |
| 5 | Committed and Ironbound use event/draw commitment; Normal does not impose it globally. |
| 6 | Material identity is the same occurrence, participants, causal choices/order, relevant state/resources/environment, policy, and uncertainty channel; trivial presentation or unrelated order is excluded. |
| 7 | Recovery is latest verified state restoration; it is nonselectable in Committed and Ironbound. |
| 8 | Functional state is active, downed, or unconscious. |
| 9 | Lethal processes are separately sourced progressing conditions owned by their health/injury/condition/hazard/magic/environment/combat domains. |
| 10 | Stable/unstable and related urgency are derived, not persisted duplicate truth. |
| 11 | Threat Resolution, Immediate Stabilization, Extraction, Transit, Treatment Or Restoration, Closure. |
| 12 | A phase may be skipped only for an explicit owner-certified reason proving it unnecessary or complete. |
| 13 | Only an authorized actor with agency may choose; unconscious/dead patients cannot. |
| 14 | Basic stabilization addresses named processes; it does not guarantee consciousness, mobility, safety, recovery, or definitive care. |
| 15 | Threat, helper, capability, supply, patient/body, route, environment, time, destination, institution, law, cost, and relationship facts control rescue. |
| 16 | Intermediate care stabilizes/enables/refers; definitive treatment has the applicable accepted capability and access, without guaranteed outcome. |
| 17 | Actual death is created only by a death-owner acceptance of authoritative causal facts. |
| 18 | Character, occurrence, cause, source, place/order, body identity/location/condition, policy, evidence, eligibility, and correction facts persist. |
| 19 | Normal and Committed may permit restoration-eligible death; Ironbound does not after accepted actual death. |
| 20 | Tier, identity, body, capability, access, actor/institution, resource, law, consent, willingness, time, and no-final-closure facts define eligibility. |
| 21 | Restoration, body destruction/transformation/loss, final attempt, capability impossibility, informed abandonment, tier finality, or another accepted terminal cause may close eligibility. |
| 22 | Informed abandonment is allowed in Normal/Committed by an authorized living controller; it becomes irreversible when the tier’s closure transaction commits. |
| 23 | Resurrection immediately restores life state and records/consumes the accepted restoration outcome. |
| 24 | Consciousness, mobility, resources, injuries, body burdens, trauma, curses, location, inventory, quests, and relationships remain owner-resolved. |
| 25 | Post-Restoration Convalescence is typed restoration strain plus unresolved injury/body/method consequences and optional accepted trauma effects. |
| 26 | Actual death becomes final on eligibility closure in Normal/Committed and immediately in Ironbound. |
| 27 | Ironbound collapses actual and final death. |
| 28 | Live commands stop and read-only access begins at terminal character closure. |
| 29 | Prestige, estate, terminal Chronicle, irreversible account/achievement value, and successor control settle after final closure, once. |
| 30 | Stable closure/source/checkpoint identities, consumed evidence, atomic ordering, correction lineage, and rollback abandonment prevent duplication. |
| 31 | Loading an earlier state abandons later gameplay history and cannot retain its durable account value. |
| 32 | Context-specific crisis results control; the Normal generic fallback remains the minimum when facts are insufficient, with `recovery_pending` retained. |
| 33 | The explicit matrix retains axes, Normal fallback/save behavior, Ironbound continuity/finality, injury, narrative, and elemental authorities; it supersedes tier/name and resurrection-policy deferrals. |
| 34 | The sixteen-step owner-first package order in Section 35 is required. |
| 35 | Exact contracts, fields, algorithms, storage, values, content, packages, migrations, UI, tests, and availability remain implementation-only. |
| 36 | The next route is a focused unversioned Stakes identities, campaign/save provenance, checkpoint topology, and technical-recovery contract decision before implementation. |

## 41. Next Recommended Route

The next recommended route is an unversioned documentation-only **Stakes Identity, Campaign/Save Provenance, Checkpoint Topology, And Technical-Recovery Contract Decision**.

It should consume this authority and decide the smallest first package’s exact conceptual contract boundaries without implementing schemas, persistence, migrations, or UI. It must not jump directly to lethal-process, resurrection, settlement, or succession runtime work.

Held `Version 0.6.6` remains paused and recoverable. Retained `0.6.7` remains unchanged.
