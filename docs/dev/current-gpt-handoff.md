# Current GPT Handoff

Date: 2026-07-25

## Status

- `Checkpoint Commitment, Mortal Crisis Sequence, Resurrection Aftereffects, Final Closure, And Stakes Authority Revision` is complete.
- The controlling artifact is `docs/design/checkpoint-commitment-mortal-crisis-resurrection-aftereffects-final-closure-and-stakes-authority-revision.md`, blob `615c5da8f9bf2c7ef210a44227bdcbb1f5f89a78`.
- Run classification: unversioned durable documentation-only design-authority revision.
- Milestone impact: `supports_current_band`.
- Implementation remains unauthorized.
- No next prompt was installed by the completed decision.
- Held `Version 0.6.6` remains paused and recoverable; retained `0.6.7` remains unchanged.

## Most Specific Accepted Authorities

Use these in precedence order for the affected seams:

1. `docs/design/checkpoint-commitment-mortal-crisis-resurrection-aftereffects-final-closure-and-stakes-authority-revision.md` for public Stakes identities, load/commitment/recovery separation, Mortal Crisis, actual/final death, body/restoration eligibility, convalescence, final closure, settlement, and succession ordering.
2. `docs/design/narrative-realization-referential-grammar-appearance-and-fact-projection-decision.md` for event-time evidence, observer projection, grammar, deterministic realization, validation, fallback, and downstream presentation.
3. `docs/design/elemental-alignment-environmental-manifestation-temperament-and-magic-stimulus-decision.md` for elemental identity, manifestation, temperament/disposition, stimuli, deterministic response, capability gates, and magical-entity aid.
4. `docs/design/injury-recovery-trauma-and-magical-restoration-decision.md` for injury severity/recoverability, `Shaken Spirit`, normally irreversible harm, anatomical restoration, and immutable-base-attribute boundaries.
5. `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md` for the minimum generic Normal Stakes fallback where no context-specific crisis result exists.
6. `docs/design/restricted-stakes-continuity-death-closure-and-prestige-decision.md` for retained one-continuity, technical-recovery, read-only-history, and circumstance-sensitive Prestige details now named and narrowed by the new decision.
7. `docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md` and `docs/design/difficulty-presets-grim-world-rules-and-stakes-separation-decision.md` for orthogonal axes, locks, current identity/migration, Story/Grim, and production availability.

The new decision does not edit older authority files. Its explicit retention/supersession matrix controls conflicts.

## Final Public Stakes Taxonomy

Exactly three choices are accepted:

| Label | Machine id | Load and commitment | Death/finality |
| --- | --- | --- | --- |
| Normal Stakes | `normal_stakes` | ordinary manual/quick saves; broad selected rollback; no general event commitment | may permit restoration-eligible death; closure is timeline-local while earlier saves remain selectable |
| Committed Stakes | `committed_stakes` | qualifying checkpoints only; checkpoint-selected rollback; named uncertain outcomes remain committed across materially identical replay | may permit restoration-eligible death; final closure atomically retires the prior checkpoint ladder |
| Ironbound Stakes | `ironbound_stakes` | one authoritative continuity; no selected rollback; committed outcomes | accepted actual death is final and closes the character atomically; no resurrection afterward |

`Ironbound` is now the accepted final restricted-Stakes name. `Committed` is a distinct checkpoint tier, not merely fewer manual saves. `Mortal` remains a Difficulty label. Legacy `hardcore`, `hardcore_stakes`, historical `dead`/`hardcore_dead`, and combat-profile `hardcore` do not become Stakes ids.

The new ids remain unavailable in production until their owner policies, persistence, migrations, warnings, and tests exist.

## Campaign-Axis And Availability Boundary

The axes remain orthogonal:

```text
Difficulty
  -> forgiveness, tuning, warnings, assistance, recovery rates, owner-approved weighting

World Rules
  -> which systemic realities exist

Stakes
  -> saving, rollback, event commitment, defeat, actual death, restoration/finality, permanence
```

Forsaken and Grim World do not imply Committed or Ironbound. Campaign-rule mechanical identities remain creation-locked. An accepted id is not a production availability grant.

## Load Topology, Commitment, And Recovery

- Load topology determines which historical state the player may select.
- Event commitment determines whether materially identical causal replay retains the accepted uncertain result.
- Technical recovery restores the latest verified authoritative state after persistence failure and is never a favorable-state picker in Committed or Ironbound.
- Normal retains current broad selected rollback.
- Committed exposes only qualifying retained checkpoints.
- Ironbound exposes only continuation from the latest authoritative state.
- Committed and Ironbound use stable occurrence identity plus named uncertainty channels or an equivalent causal identity.
- One global ordered random stream is rejected.

Materially identical cause includes the same occurrence/source, participants/roles, relevant accepted choices/order, equipment/resources/capabilities/conditions, locality/environment/threat, policy/content versions, and uncertainty channel. Material changes may create a new event identity. Reload, re-entry, menu order, renderer changes, and unrelated harmless action order do not.

Checkpoint, source, policy, draw/result, correction, and consumed-consequence provenance must be traceable. Correction cannot masquerade as rollback or produce duplicate consequences.

## Mortal-State Authority

Accepted model:

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

Functional state is not life state. A downed/unconscious character may be stable; a conscious character may carry a lethal process. HP zero, defeat, downing, immobility, encounter closure, prose, or UI cannot establish actual death.

Lethal processes remain owned by their health, injury, condition, hazard, environment, magic, combat, or other source domains. No universal bleed-out timer, `critical`, `near death`, or mutable stable-critical duplicate owner is accepted. Care requirement and urgency are derived.

## Mortal Crisis Sequence And Ownership

The accepted sequence is:

1. Threat Resolution;
2. Immediate Stabilization;
3. Extraction;
4. Transit;
5. Treatment Or Restoration;
6. Closure.

Mortal Crisis is an orchestrator and presentation framework. It consumes facts and records decisions/transitions; it is not a health, injury, travel, party, institution, magic, death, body, Stakes, Chronicle, narrative, or AI owner.

Phases may be skipped only when an explicit owner-certified reason proves them unnecessary or complete. A skip cannot invent safety, helpers, transport, care, resurrection, or finality.

## Rescue, Stabilization, And Care

- Basic stabilization stops, bounds, or reduces only a named process.
- It does not imply consciousness, mobility, complete recovery, safety, extraction, or definitive care.
- An unconscious or actually dead patient cannot make reflex choices.
- Authorized party members, campaign/house controllers, rescuers, or institutions make decisions when the patient lacks agency.
- Rescue consumes factual threat, helper, permission, relationship, capability, supply, patient/body, route, terrain, weather, time, destination, institution, law, cost, access, and willingness inputs.
- One opaque rescue percentage is rejected.
- Named uncertain events require retained occurrence/channel identity and causal inputs.
- Intermediate care can stabilize, resupply, transport, or refer; definitive treatment still requires applicable capability and access.

Context-specific accepted Mortal Crisis outcomes control when sufficient facts exist. Otherwise the Normal generic fallback remains the minimum safe nonterminal outcome, and `recovery_pending` remains available. Ordinary defeat still does not force a Normal save or impose automatic injury, trauma, loss, magic, actual death, or convalescence.

## Actual Death And Body Authority

Actual death occurs only when a death owner accepts authoritative causal facts. It retains stable character, occurrence, cause/source, place/order, policy, body identity/location/condition, evidence, restoration-policy, and correction provenance.

A body is a unique identity-bearing world fact, not a generic item. Recovery, transport, preservation, theft, concealment, transformation, burial, loss, destruction, and correction require accepted transitions. Runtime unloading, scene exit, save/load, or source recreation cannot move, lose, destroy, or duplicate it.

The actually dead character cannot act. Authorized survivors, institutions, house/line controllers, or campaign actors make body, restoration, abandonment, and closure decisions.

## Resurrection Policy By Tier

### Normal

- May retain restoration eligibility when deterministic body/capability/policy gates pass.
- An allowed earlier save may avoid the death.
- Informed abandonment/final closure is binding in the current timeline, but selecting an earlier valid save abandons that later timeline and its durable-value claims.

### Committed

- May retain restoration eligibility on the same explicit gates.
- A retained checkpoint may be selected while eligibility remains open, but identical causes retain committed results.
- Final closure retires the pre-closure checkpoint ladder atomically and is then irreversible.

### Ironbound

- Accepted actual death is immediately final.
- Actual death, final death, and terminal closure are one atomic transaction.
- No selected rollback and no resurrection after commitment.
- Rare magic, deity favor, alignment, benevolence, or narrative convenience creates no exception.

Eligibility requires the permitting tier, stable death/body identity, explicit compatible capability, applicable body condition and access, valid actor/institution, knowledge, permission, willingness, law, consent, resources, site/time/cost/risk posture, and no prior final closure.

Randomly deciding after death whether resurrection exists is rejected.

## Eligibility Closure And Informed Abandonment

Eligibility may close through successful restoration, accepted body destruction/transformation/loss, failure of an explicitly final attempt, accepted lack of compatible capability, informed abandonment/funeral, Ironbound finality, or another accepted terminal cause.

Abandonment is allowed only in Normal/Committed by an authorized living controller after sufficient nonspoiler warning. An unconscious/dead patient, accidental dismissal, UI failure, or unavailable information cannot finalize death.

Closure is an idempotent transaction retaining cause, authority, actor, evidence, checkpoint/source, policy, and time/order.

## Successful Resurrection And Convalescence

Successful resurrection restores life state and consumes eligibility once. It does not automatically restore:

- consciousness or mobility;
- HP, Stamina, or MP;
- unresolved injury, impairment, poison, disease, curse, trauma, or body burden;
- destroyed anatomy unless the capability explicitly includes it;
- inventory, equipment, location, quest, relationship, or world state.

Post-Restoration Convalescence is typed:

```text
restoration strain
  + unresolved injuries
  + body-condition consequences
  + method-specific complications
  + optional owner-accepted trauma consequences
```

Possible later effects include delayed consciousness, rest/treatment requirements, temporary Stamina/exertion/travel restrictions, vulnerability, and no immediate combat return. Exact effects, durations, probabilities, formulas, methods, and balance remain deferred. Immutable base attributes never decrease.

## Final Closure, Settlement, And Succession

For Normal and Committed:

```text
actual death
  -> provisional nonpaying body/restoration state
  -> restoration OR eligibility closure
  -> final death
  -> terminal character closure
  -> terminal Chronicle / Prestige / estate / account / achievement settlement
  -> successor availability
```

Ironbound collapses actual death through closure atomically, then follows the same settlement order.

Live commands stop and read-only historical access begins at closure. Final records are retained rather than deleted. Settlement is idempotent and tied to stable closure/source/checkpoint and consumed-evidence identities.

- No terminal payout or successor control at reversible actual death.
- Normal abandoned timelines lose later account/estate/achievement/successor value.
- Committed pays only after checkpoint retirement and closure commit.
- Ironbound pays only after atomic closure.
- `deathZeroesPrestige` remains rejected.
- Existing public, legal, religious, household, companion, faction, regional, publicity, disgrace, sacrifice, and martyrdom evidence remains distinct.

Exact currencies, formulas, inheritance, estate distribution, successor selection, and reward catalogs remain deferred.

## Narrative And Observer Boundary

The accepted narrative owner graph remains controlling:

```text
authoritative crisis/body/care/restoration/closure facts
  -> owner-certified event-time evidence
  -> observer projection
  -> planning
  -> referent/grammar resolution
  -> deterministic realization
  -> validation/fallback
  -> UI / Chronicle / Manuscript
```

Presentation may show qualitative urgency, known diagnoses, visible changes, blockers, and explicit decisions. Raw timers, percentages, seeds, draw ids, hidden processes, future outcomes, and validator-only facts remain hidden by default.

Narrative cannot invent motive, emotion, dialogue, diagnosis, capability, rescuer, institution, item, route, action, or outcome. Chronicle and Manuscript never reconstruct active authority.

## Elemental And Magical-Entity Crisis Boundary

Elemental and magical-entity aid still requires present accepted identity, explicit applicable capability, qualifying trigger, relationship/consent/policy eligibility, range/access/environment/knowledge/condition, cost/resource/risk, deterministic response, affected-owner acceptance, and retained evidence.

Alignment, benevolence, fae identity, guardian role, deity association, narrative importance, or proximity cannot create diagnosis, supplies, transport, healing, regrowth, restoration, resurrection, or rescue.

Elemental response provenance remains separate from Mortal Crisis uncertainty.

## Exact Retention And Supersession

Retained:

- Difficulty/World Rules/Stakes orthogonality;
- campaign locks and availability gates;
- Normal manual/quick saving, permissive rollback, no-forced-save defeat, generic fallback, and `recovery_pending`;
- restricted one-continuity, no-rollback, technical recovery, immediate terminal actual death, read-only history, and nonzero Prestige direction;
- injury/recoverability, `Shaken Spirit`, immutable attributes, and ordinary-healing/restoration separation;
- narrative and elemental authorities.

Narrowed/clarified:

- context-specific Mortal Crisis controls before fallback;
- resurrection is tier-specific;
- settlement follows final closure;
- restricted Stakes is Ironbound and adds event commitment.

Superseded:

- final tier-count deferral;
- restricted label/id deferral;
- checkpoint scarcity without event commitment;
- any terminal settlement at restoration-eligible death.

Campaign, Normal Stakes, restricted-Stakes, and injury/restoration files remain historical accepted authorities except where this newer focused decision explicitly replaces a clause.

## Implementation And Authorization

Implementation remains unauthorized.

The accepted future order begins with:

1. Stakes identities/policy registry and campaign/save provenance;
2. checkpoint/load topology and technical recovery;
3. occurrence/uncertainty commitment and correction;
4. functional/lethal-process owners;
5. active process/care derivation;
6. Mortal Crisis receipts;
7. rescue/transport;
8. treatment/institution;
9. death/body;
10. restoration capability/eligibility;
11. convalescence;
12. closure;
13. settlement/succession;
14. narrative/UI;
15. migrations/save/idempotency/tests;
16. content/balance/production availability only after separate authorization.

Do not infer schemas, packages, fields, algorithms, saves, migrations, content, formulas, probabilities, timers, rewards, UI, or runtime work from this authority.

## Temporary Evidence And Held Routes

- Retain comparative mortality research through checkpoint, crisis, resurrection, settlement, and succession implementation consumers.
- Retain the defeat/injury audit through the first relevant runtime replacement/repair package.
- Retain narrative evidence through Mortal Crisis and narrative implementation consumers.
- Retain elemental evidence through remaining elemental implementations and any crisis-capability consumer.
- No temporary artifact was deleted.
- Held `Version 0.6.6` remains paused and recoverable as blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
- Retained `0.6.7` remains unchanged.

## Next Recommended Route

Run an unversioned documentation-only:

`Stakes Identity, Campaign/Save Provenance, Checkpoint Topology, And Technical-Recovery Contract Decision`

It should define the smallest first package’s exact conceptual boundary without implementing schemas, persistence, migrations, UI, or gameplay.

No next Codex prompt is installed. The current prompt remains the completed authority-revision prompt until coordination explicitly advances it.
