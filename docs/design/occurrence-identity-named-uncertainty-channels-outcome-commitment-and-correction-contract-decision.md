# Occurrence Identity, Named Uncertainty Channels, Outcome Commitment, And Correction Contract Decision

Date: 2026-07-25

Status: accepted durable design authority; documentation only

Run classification: unversioned durable contract decision

Milestone impact: `supports_current_band`

## 1. Status, Scope, And Source Verification

This decision defines the conceptual authority for gameplay occurrences, accepted results, uncertainty, materially identical replay, per-Stakes outcome commitment, correction, supersession, and downstream idempotency. It grants no implementation permission.

The execution gate passed at commit `e7aa0d694b44dc5377c80f8ea8715bc55cd4f8c5`: `master` was clean and synchronized with `origin/master`; save/Stakes commit `dcea4e42dcbbf67cecf19490923e63384027243e` was an ancestor; every prompt-pinned authority, coordination file, live source, and held-route blob matched; and no later live event/random source change contradicted the pinned baseline.

Inspected live evidence included the shared event envelope and event factory, tick seed contract, world/spawn selection, combat and quest deterministic selection, engine-owned travel/quest/activity command patterns, UI character-creation randomization, launcher account-suffix generation, save/account receipts, Chronicle projections, and downstream owner seams. Live code is migration evidence, not accepted architecture.

## 2. Executive Decision

An occurrence is an owner-certified causal event, transition, or admitted resolution attempt. It has stable authority independent of event-envelope strings, storage addresses, timestamps, renderer order, or global call order.

The accepted boundary is two-stage:

1. an initiating request/delivery identity is established before resolution;
2. a domain owner admits and reserves an occurrence identity before mutation, then atomically accepts an occurrence record and zero or more accepted result records with the authoritative transition.

A rejected pre-admission request has a rejection receipt but no gameplay occurrence. A domain may explicitly make an admitted rejection consequential; that admitted occurrence still has no accepted result unless its contract defines one.

Each domain owns material-input normalization and result meaning. Uncertainty infrastructure owns authorized named-channel and draw/result identity, never gameplay meaning. Accepted results are consumed by downstream owners through separate, idempotent consequence receipts.

Committed and Ironbound preserve accepted uncertain results across materially identical replay. Normal has no general cross-reload commitment but preserves accepted facts and consequences inside an authoritative continuity and may adopt narrower owner-specific commitment. Corrections replace proven invalid authority through retained evidence and explicit reconciliation; they are not rollback, recovery, resurrection, or favorable reroll.

## 3. Accepted Vocabulary

- **request/command**: an invocation proposed to an owning domain.
- **delivery receipt**: evidence that a particular request instance reached an owner boundary.
- **admitted attempt**: a request or source transition accepted for authoritative resolution.
- **occurrence**: one owner-certified causal event, transition, or admitted resolution attempt.
- **material-input identity**: the owner-certified normalized causal facts and semantic versions relevant to an occurrence/result opportunity.
- **result**: an accepted deterministic or uncertainty-resolved domain outcome.
- **named uncertainty channel**: a versioned, owner-governed semantic authorization for uncertainty within an occurrence.
- **uncertainty draw/result evidence**: hidden evidence used by a domain owner to interpret an uncertain outcome; it is not itself the domain result.
- **consequence receipt**: one downstream owner's authoritative record that it applied, reversed, compensated, retained, or rejected an effect of a source result.
- **projection**: an event envelope, notice, Chronicle, Manuscript, UI, logging, telemetry, or index view.
- **replay equivalence**: an owner-certified relation that two resolutions represent the same causal opportunity.
- **correction**: an authorized replacement or reconciliation of proven invalid authority.
- **supersession**: a retained relation saying which authority replaces another and why.

## 4. Authority Precedence And Supersession

This decision controls occurrence identity, result receipts, named uncertainty, replay equivalence, consequence consumption, and correction. The save/Stakes decision continues to control campaign, continuity, artifact, checkpoint, head, generation, technical recovery, and branch creation. The Mortal Crisis/Stakes revision continues to control public Stakes semantics, crisis phases, actual/final death, resurrection, convalescence, closure, and settlement order.

Domain decisions continue to own gameplay meaning. Narrative authority continues to own observer-safe realization. Account, estate, achievement, Prestige, succession, body, injury, inventory, quest, combat, travel, economy, ecology, and magic owners retain their consequence truth.

This decision narrows any older implication that event ids, ticks, seeds, hashes, save slots, Chronicle records, or command ids alone establish occurrence/result authority. It supersedes no accepted domain outcome or save topology. Temporary audits and research remain evidence only.

## 5. Live Event, Random, And Identity Baseline And Migration Classification

| Live seam | Classification | Contract consequence |
| --- | --- | --- |
| generic `createEvent` id `type:domain:tick` | compatibility projection with collision defect | cannot prove same-tick occurrence uniqueness; migrate or quarantine before commitment |
| domain event ids containing command id and tick | bounded migration input | useful source evidence, but command id and envelope id are not automatically occurrence/result identity |
| engine-owned travel, quest, and activity commands | bounded request/revision migration pattern | retain as evidence; add admitted occurrence/result and retry authority only under a later package |
| `TickContextBase.seed` | legacy deterministic context input | neither global uncertainty authority nor accepted channel identity |
| spawn seed/tick/profile/region hashes | deterministic domain selection and unauthorized chance-like gameplay uncertainty for committed policy | must migrate to owner-certified material identity and, where semantically uncertain, an authorized channel/result receipt |
| combat/quest/stat-growth hashes | deterministic domain selection requiring owner review | do not automatically turn deterministic rules into uncertainty; chance-like authoritative decisions need explicit authorization |
| character-creation `Math.random` | non-authoritative UI/setup convenience until an accepted command owns the choice | cannot become committed gameplay evidence by projection |
| narrative-screen random value selection | non-authoritative presentation convenience | must not choose authoritative facts |
| launcher authentication random suffix | unrelated technical identity convenience | not gameplay uncertainty |
| tests/fixtures using controlled randomness | test/tooling | never production authority |

Current collision-prone or under-proven records remain readable migration evidence. They cannot mint new committed results, causal links, or duplicate value by inference.

## 6. Command/Request, Occurrence, Result, Consequence, And Projection Taxonomy

```text
request / command
  -> delivery and admission
       -> occurrence
            -> deterministic result
            -> uncertain result -> named channel evidence
            -> no accepted result
                 -> owner-specific consequence receipts
                      -> projections
```

A request is not an occurrence. A retry is not a new request opportunity merely because delivery repeated. An occurrence is not an event id. A random value is not a result. A consequence is not the source result. A projection never becomes authority through display or persistence.

One occurrence may produce multiple results only through an explicit owner-certified relation. One result may have many consumer receipts, one per owner and consequence kind. A projection may combine facts, but cannot collapse the source identities.

## 7. Occurrence Identity Owner Graph

```text
initiating owner
  -> request identity and normalized request intent

domain owner
  -> admission
  -> occurrence identity and causal relations
  -> material-input policy
  -> accepted domain result

uncertainty authority
  -> authorized channel and hidden draw/result evidence
  -> no domain interpretation

downstream owner
  -> one consequence truth and receipt

save authority
  -> persists links without resolving outcomes

projection owners
  -> observer-safe views without gameplay authority
```

Infrastructure may validate identity shapes, relation integrity, delivery, uniqueness, and registry authorization. It cannot decide every domain's participants, material facts, result meaning, or correction outcome.

## 8. Minimum Occurrence Provenance

Every authoritative occurrence must retain or resolve:

- owning domain, occurrence kind, campaign, continuity, and relevant character/world scope;
- initiating request, source receipt, parent, cause, correlation, aggregate, child, and supersession relations where applicable;
- accepted tick/time and causal ordering evidence;
- a stable same-tick discriminator not derived solely from global insertion order;
- simultaneity group or explicit unordered relation where applicable;
- owner-certified participants and causal objects;
- governing policy, content, resolver, occurrence-contract, and material-normalization semantic versions;
- normalized material-input identity;
- retry/idempotency posture;
- result, downstream consequence, correction, and projection-safe evidence links.

The accepted conceptual occurrence-contract semantic policy version is **1**. Exact fields, encodings, packages, and storage remain deferred.

## 9. Request Retry And Occurrence-Establishment Boundary

The initiating owner establishes request identity before delivery. The domain owner validates that identity and normalized intent, then either:

- rejects before admission, retaining a request/rejection receipt;
- recognizes a duplicate and returns the existing admission/result status;
- admits a new attempt, reserving one occurrence identity before authoritative mutation;
- quarantines the request because the same request identity carries materially different intent or provenance.

Admission is the authority boundary for occurrence identity. Accepted occurrence/result publication is atomic with the authoritative domain transition. A crash between reservation and publication resumes or resolves the reservation; it does not mint another occurrence.

A retry preserves request identity, normalized intent, causal source, and retry relation. A changed delivery token, process, address, session, or timestamp alone does not make a new attempt. A new causal choice or owner-certified material change may create a new request and occurrence opportunity.

## 10. Same-Tick Uniqueness

`type:domain:tick` is insufficient. Repeated same-kind occurrences in one tick remain distinct through stable owner scope plus an admitted-attempt discriminator or source identity that survives serialization, replay, and unrelated event insertion.

An order token may be retained when causally meaningful, but a global sequence cannot be the sole identity authority. Independent occurrences do not change identity when unrelated work is inserted before them. Collision detection must reject or quarantine ambiguity instead of merging records.

## 11. Ordering, Simultaneity, Correlation, Causation, Aggregation, And Child Relations

- **ordering** states that one accepted occurrence/result precedes another where order affects truth;
- **simultaneity** groups occurrences resolved as one unordered causal boundary;
- **correlation** groups related observations without asserting causation;
- **cause** states that one occurrence/result materially produces another;
- **parent/child** decomposes an admitted aggregate or process into separately identified components;
- **aggregate/member** summarizes multiple retained occurrences/results without replacing them;
- **supersession** links invalid and replacement authority, not causal succession.

Same tick does not imply simultaneity. Adjacent order does not imply causation. Genuine simultaneity must not acquire a fabricated causal order merely to serialize it. Aggregate events link every component rather than collapsing provenance.

## 12. Material-Input Normalization Ownership

Each domain owner certifies which normalized facts materially define an opportunity. Applicable categories include participants and permissions; accepted choices and causal action order; equipment, inventory, resources, capabilities, conditions, and relationships; location, route, terrain, weather, and environment; encounter, threat, quest, body, institution, and world state; governing content/rules/resolver versions; prior committed results; channel authorization; and correction lineage.

The identity is not a default hash of an opaque snapshot. It is an owner-certified fact set under a versioned normalization policy. Generic infrastructure verifies the owner's declaration but cannot invent domain materiality.

UI state, camera, localization, renderer variation, menu order, telemetry order, storage address, and unrelated harmless actions are immaterial unless a domain explicitly proves otherwise.

## 13. Replay-Equivalence Contract

Replay is materially identical when the domain owner certifies the same causal intent, admitted source relation, normalized material facts, governing compatible semantic versions, and prior committed dependencies. Reload, re-entry, duplicate delivery, save relocation, and technical recovery do not create new opportunities.

Changed preparation, equipment, route, timing, participants, target, environment, accepted action, or other certified causal fact may create a new occurrence/result opportunity. It does not automatically do so: the owner defines the boundary.

A normalization-policy change is explicit and versioned. Historical results remain governed by their accepted versions. Replay uses retained accepted results or a compatible historical resolver. Incompatibility requires migration, quarantine, or authorized correction—never silent reroll.

## 14. Deterministic Result Receipt

A deterministic result receipt records an accepted domain outcome produced without an authorized uncertainty channel. It links occurrence, owner/result kind, material identity/version, resolver/policy/content versions, accepted payload/evidence boundary, downstream receipts, correction lineage, and presentation-safe evidence.

Deterministic does not mean unversioned, reconstructible forever, or safe to recalculate from current content. Retaining the accepted result is authoritative. Deterministic rules do not require channels merely because their implementation uses hashing for stable selection.

## 15. Uncertain Result Receipt

An uncertain result receipt has the same provenance discipline plus explicit named-channel and occurrence-scoped draw/result evidence. The domain owner interprets that evidence and accepts the gameplay result.

A random number, seed, hash, channel response, or probability check is not the domain result. Rejected or unresolved attempts have no accepted result and no downstream consequences unless the owning contract explicitly defines a rejection consequence.

Corrected results retain the original record, correction reason/evidence, supersession relation, replacement result, and reconciliation status.

## 16. Named Uncertainty-Channel Contract

A named uncertainty channel is a stable semantic authorization scoped to an owning domain and uncertainty family under a policy revision. It is separate from event type, UI label, global seed, occurrence id, result id, and implementation algorithm.

Each authorized use is occurrence-scoped and independently identified. Its reproduction or retained evidence cannot depend on unrelated call order or one global ordered stream. Different semantic decisions do not share a channel merely because they use similar probabilities.

The registry is owner-governed and append-only or explicitly migrated. It retains audit/correction identity while keeping seed, raw draw, hidden weights, validator facts, spoilers, and exploitable internals outside narrative and ordinary UI.

## 17. Multi-Channel And Multi-Result Boundary

One occurrence may use multiple channels only when the domain owner names distinct semantic roles and declares their relation. Multiple uses within one channel require owner-certified cardinality and order/unordered posture. Unrelated channel use cannot perturb another.

One occurrence may yield multiple results only when each result kind, dependency, and shared or separate channel evidence is explicit. An aggregate result references its component results; it cannot substitute for them. Infrastructure must reject undeclared extra draws or result multiplication.

## 18. Normal Commitment Posture

Normal has no general cross-reload outcome commitment. A noncommitted uncertain owner may resolve again after permitted rollback when the replay is on a different authoritative continuity opportunity.

Within an authoritative continuity, accepted results and applied consequences are idempotent. Repeated delivery, restart, or technical recovery cannot duplicate them. An owner may explicitly designate a narrow result family as committed in Normal. Normal rollback creates permitted history selection/branching under the save contract; it is not correction.

## 19. Committed Commitment Posture

Committed retains each accepted uncertain result identity across materially identical checkpoint replay, restart, relocation, and technical recovery. Selection of an earlier checkpoint does not itself create a new opportunity.

On the first divergent accepted mutation, a child continuity is created. Source results whose causes remain materially equivalent are linked/inherited into the child and remain committed. Owner-certified material changes may establish new occurrences or result opportunities. Final closure retains results and consumed receipts needed for idempotent settlement.

## 20. Ironbound Commitment Posture

Ironbound commits accepted commands, occurrences, uncertain results, and consequences in its one continuity. Retry, reconnect, copied bytes, technical recovery, or an older hidden generation cannot reroll or undo them.

Actual death, final death, and closure retain their accepted terminal authority. Only proven defect correction may supersede invalid authority. No correction surface may expose save selection, ordinary replay, resurrection, or favorable-state choice.

## 21. Continuity Branch And Checkpoint Replay Relation

A loaded artifact remains linked to its source continuity. The first accepted divergent mutation creates a child continuity under save authority. Source occurrences/results are:

- referenced directly when they predate the branch and remain shared history;
- linked as committed equivalents when their opportunity is replayed materially identically;
- replaced by new occurrences only after owner-certified material divergence;
- never copied as new value-bearing results merely because bytes were copied.

Abandoned continuity consequences cannot leak into the active branch. Correction lineage follows identity across parent/child relations where the corrected authority is shared or linked.

## 22. Technical-Recovery Relation

Technical recovery selects verified authority inside the same campaign, continuity, policy, and closure boundary. It restores occurrence/result/consequence/correction records exactly; it does not invoke the resolver to seek a better result.

Missing projections may be rebuilt from authoritative facts. Missing or contradictory authority is quarantined for recovery/correction rather than guessed from timestamps, UI summaries, event ids, seeds, or logs.

## 23. Consequence-Consumption And Idempotency Graph

```text
accepted result
  -> injury/body receipt
  -> inventory/quest/travel/economy receipt
  -> Chronicle/narrative projection receipt
  -> closure/settlement/succession receipt
  -> account/reward/estate/achievement/Prestige receipt
```

Every downstream owner consumes a source result under its own stable consequence identity and records applied posture. The same result cannot produce the same owner-specific consequence twice. Different owners may consume the same result without sharing mutable state.

Downstream owners cannot edit the source result. Source correction triggers owner-specific reconciliation requests. A generic event or command bus is not required; stable source and consumer receipts are sufficient.

## 24. Partial Downstream Failure And Retry

Accepted source truth survives projection or consumer failure. A failed consumer retries only its unconsumed consequence under the same receipt identity. Successfully consumed sibling consequences are not replayed.

States must distinguish at least pending, applied, failed/retryable, rejected, reversed, compensated, retained-with-exception, and superseded conceptually. Exact encoding is deferred. Application restart, copied artifacts, and checkpoint replay consult receipt authority rather than repeating side effects.

## 25. Correction Authority Graph

```text
validator / domain owner / migration or support authority
  -> correction request with evidence

owner of affected truth
  -> approve or reject occurrence/result correction

campaign/save correction authority
  -> verify continuity, artifact, closure, and propagation permission

downstream owners
  -> approve and apply their own reconciliation

projection owners
  -> publish safe correction notices
```

Only the owner of the affected truth may approve its correction. A renderer, Chronicle, Manuscript, log, account index, slot, timestamp, or UI cannot authorize one.

## 26. Correction Reasons, Evidence, And Permission

Accepted reason families include malformed or colliding legacy identity; wrong causal/material inputs; invalid policy/content/resolver/normalization version; unauthorized or defective channel evidence; resolver defect; duplicate or missing consequence; source corruption; and projection-only error.

A request identifies campaign/continuity, source artifact/head/generation where relevant, occurrence/result/consequence targets, reason, evidence, requester authority, proposed scope, and reconciliation needs. Approval records the governing correction policy and affected owner permissions.

Content or rule evolution alone is not a defect. Player preference, unfavorable outcome, ordinary rollback, resurrection desire, or a newer balance value cannot authorize correction.

## 27. Occurrence/Result Supersession

The original authority is never silently deleted. It remains retained with invalid/superseded posture, reason, evidence, replacement link, and reconciliation state.

Correction preserves occurrence identity when the causal event genuinely happened and its result, evidence, or projection was wrong. It establishes a replacement occurrence when the original merged distinct events, represented the wrong causal event, lacked valid admission, or should not have existed. Replacement and original remain linked.

Correcting a result does not automatically replace the occurrence. Correcting one downstream consequence does not mutate the occurrence or result.

## 28. Uncertainty Reuse, Invalidation, And Recomputation Boundary

Reuse prior channel evidence when the occurrence/material inputs/channel authorization were valid and only interpretation, projection, or a downstream consequence was defective.

Invalidate channel evidence when the draw belonged to the wrong occurrence/channel, used unauthorized semantics, depended on invalid material inputs, or is proven corrupt. Recompute only under an explicitly approved, versioned correction policy after invalidation; retain both histories and the reason.

Resolver/content updates do not silently recompute historical uncertainty. When exact reproduction is unavailable, the retained accepted result remains controlling unless proven invalid.

## 29. Downstream Reconciliation

Each downstream owner decides whether its applied consequence is:

- still valid and retained;
- reversed through an authoritative inverse;
- compensated because exact reversal is unsafe or impossible;
- replaced by a corrected consequence;
- quarantined pending evidence;
- retained with an explicit exception for irreversible external/account effects.

Reconciliation is receipt-based and idempotent. It never blindly replays all consumers. Real-world or separately authoritative account transactions require owner-approved reconciliation; gameplay correction alone cannot erase them.

## 30. Closed-Ironbound Correction Boundary

A closed Ironbound campaign may be corrected only for proven invalid authority under explicit owner and campaign correction approval. The operation targets the closed authoritative lineage and propagates across copied artifacts and recovery generations.

Correction may repair an invalid result, consequence, or closure fact, but cannot expose prior heads, offer state selection, reroll a valid outcome, or reopen final death by inference. If a proven defect invalidated closure itself, the closure owner must supersede it through a corrected authoritative head; no player menu or ordinary load performs that act.

## 31. Event-Envelope And Projection Boundary

An event envelope transports or projects accepted identities and safe facts. Its event type is vocabulary and its id is a projection/delivery identity unless a later contract explicitly binds it to authoritative occurrence provenance.

Current `type:domain:tick` ids are legacy compatibility evidence. Same-tick collisions are defects/limitations, not proof of identical events. Future adapters must reference exact occurrence/result/order/simultaneity identities, preserve aggregate membership, detect ambiguity, and quarantine under-proven value-bearing records.

## 32. Narrative, Chronicle, Manuscript, UI, Logging, And Telemetry Boundary

Chronicle and Manuscript record durable views of accepted facts; they do not reconstruct missing authority. Narrative realization receives event-time, observer-safe occurrence/result facts and exact order or simultaneity relations where needed.

UI may present requests, accepted outcomes, commitment posture, and safe correction notices. It cannot choose identity, draw, result, correction, or consequence truth.

Seeds, raw draws, hidden channels/weights, diagnoses, validator-only facts, and future outcomes remain private. Logs, telemetry, and debugging artifacts are nonauthoritative unless an owner explicitly accepts a fact through its contract.

## 33. Legacy/Current Migration And Quarantine

Migration classifies records as:

- sufficiently evidenced and safely linked;
- readable projection/compatibility evidence only;
- ambiguous but non-value-bearing;
- ambiguous and value-bearing, requiring quarantine;
- proven duplicate/collision requiring correction;
- invalid or corrupt.

Command ids, event ids, ticks, seeds, hashes, slot ids, timestamps, Chronicle ids, and UI ids are supporting evidence, never sufficient alone. Migration may preserve a legacy record without pretending stronger uniqueness. It cannot infer new committed results or consumed value.

## 34. Explicit Retention/Rejection/Supersession Matrix

| Item | Disposition |
| --- | --- |
| save/Stakes topology and technical-recovery authority | retained permanently |
| Mortal Crisis/Stakes gameplay and closure authority | retained permanently |
| domain owner control of gameplay meaning | retained |
| narrative observer-safe fact boundary | retained and extended with occurrence/result links |
| engine-owned command ids and snapshot revisions | retained as migration/implementation evidence |
| generic/event-specific live envelope ids | retained as compatibility projections; rejected as sufficient occurrence authority |
| tick/global order as sole identity | rejected |
| one global random stream | rejected |
| domain hashes/seeds as accepted uncertainty contract | rejected; migration review required |
| UI `Math.random` as gameplay authority | rejected |
| correction by rollback, UI choice, or record deletion | rejected |
| older ambiguity that command, event, result, and consequence are interchangeable | superseded by this taxonomy |

## 35. Future Implementation-Package Order Without Permission

If separately authorized, proceed conceptually in this order:

1. occurrence vocabulary and semantic policy version;
2. request/delivery identity and retry boundary;
3. occurrence identity, uniqueness, order, simultaneity, and relations;
4. domain material-input normalization contracts;
5. deterministic result receipts;
6. named-channel registry and uncertain result receipts;
7. per-Stakes commitment adapters;
8. save/checkpoint/continuity links;
9. consumer receipts and owner idempotency;
10. correction, supersession, and reconciliation;
11. event-envelope compatibility adapter;
12. narrow representative domain adapters;
13. Chronicle/narrative/UI projections;
14. migration, quarantine, diagnostics, tests, and availability gates.

No release version, package, schema, algorithm, dependency, or implementation prompt is assigned.

## 36. Future Test And Validation Matrix

Future non-canonical fixtures must cover:

- distinct same-kind/same-domain/same-tick occurrences, aggregate children, true simultaneity, causal order, duplicate delivery, conflicting reuse of a request id, reload stability, and source recreation;
- materially identical replay, immaterial UI differences, owner-certified preparation/route/participant/timing/environment changes, harmless unrelated action order, explicit version change, and parent/child continuity links;
- deterministic results without channels, uncertain results with authorized channels, multiple independent channels, rejected unauthorized random use, channel isolation, and result retry;
- Normal noncommitment and owner-specific commitment, Committed checkpoint replay/material divergence, and Ironbound recovery/copy/closure commitment;
- exactly-once injury, inventory, reward, estate, achievement, Prestige, closure, successor, and Chronicle consumers plus partial failure;
- retained correction evidence, idempotent correction replay, channel reuse/invalidation, owner compensation, copied-artifact propagation, closed-Ironbound protection, and projection-only repair;
- collision detection/quarantine, conservative legacy reads, spawn-hash migration, UI-random privacy, and absence of hidden evidence from ordinary projections.

## 37. Temporary-Evidence Retention

Retain comparative mortality research through checkpoint, occurrence commitment, Mortal Crisis, resurrection, settlement, and succession implementation consumers. Retain the defeat/injury audit through the first relevant runtime repair.

Retain narrative evidence through occurrence-aware narrative and Mortal Crisis consumers, elemental evidence through elemental and crisis-capability consumers, and the completed save/Stakes and Mortal Crisis/Stakes authorities permanently. Do not delete or regenerate held evidence in this run.

## 38. Unresolved Implementation Questions

Deferred implementation-only questions include exact fields and encodings; identity generation mechanics; reservation durability; registry storage; algorithms, seeds, hashes, and cryptographic posture; package ownership; persistence and migration formats; compatibility thresholds; exact correction tooling and permissions; retention duration; privacy/diagnostic access; domain adapter order inside a separately authorized package; and production availability gates.

These questions do not defer the accepted taxonomy, owner graph, uniqueness, material equivalence, result/channel semantics, Stakes commitment, consequence idempotency, correction authority, or legacy classification.

## 39. Explicit Non-Decisions

This decision does not choose TypeScript types, database schemas, file/package paths, APIs, storage keys, RNG family, hash, seed derivation, exact channel ids, probabilities, balance, content, encryption, cloud conflict policy, anti-tamper posture, UI layout, or release/version assignment.

It does not authorize runtime, save, schema, validator, migration, content, test, UI, dependency, event-bus, command-bus, random-service, journal, transaction, or serialization changes.

## 40. Answers To All Required Conclusions

1. The canonical taxonomy is request/delivery, admitted occurrence, accepted deterministic or uncertain result, owner-specific consequence receipt, then projection.
2. Request identity exists before resolution; occurrence identity is reserved on domain admission and accepted atomically with authoritative transition/result publication.
3. Retry preserves request identity, normalized intent, source, and causal opportunity; materially changed reuse is rejected/quarantined.
4. Same-type/domain/tick occurrences use stable owner scope plus an admitted-attempt discriminator/source identity, never tick alone.
5. Causal order is explicit; genuine simultaneity is an explicit unordered group.
6. Parent/child decomposes, cause asserts production, correlation associates without cause, and aggregate references members without replacing them.
7. Minimum provenance is the identity, scope, causal relations, time/order/simultaneity, participants, semantic versions, material identity, retry posture, result/consequence, and correction links in section 8.
8. Material-input identity is a versioned owner-certified normalized causal fact set; each domain owns its materiality.
9. Replay is materially identical when causal intent/source, certified material facts, compatible semantic versions, and committed dependencies match.
10. Owner-certified changes to choice, preparation, equipment, route, timing, participants, target, environment, or causal state may create a new opportunity.
11. Policy/content/resolver changes are explicit/versioned; history uses retained results or compatible historical rules, otherwise migration/quarantine/correction.
12. Deterministic results use no channel; uncertain results use authorized channel evidence; rejected/unresolved attempts have no accepted result; corrected results retain supersession.
13. The domain owner owns draw interpretation and gameplay meaning.
14. A named uncertainty channel is a versioned semantic authorization for one domain-owned uncertainty family.
15. It is scoped by domain/family/policy and used through occurrence-scoped evidence, independent of global call order.
16. Multiple channels require declared roles, cardinality, and relations; they remain isolated.
17. UI randomization is nonauthoritative, launcher suffix randomness unrelated, domain hashes deterministic migration inputs, and chance-like spawn selection requires replacement for committed authority.
18. Committed replay retains accepted result identity, occurrence/equivalence, material/version evidence, and authorized channel evidence.
19. Normal has no general cross-reload commitment; it retains idempotency within authoritative continuity and allows narrow owner-specific commitment.
20. Committed preserves materially identical uncertain results across checkpoint selection, restart, relocation, and recovery.
21. Ironbound preserves accepted commands, occurrences, results, and consequences across recovery, reconnect, copies, and hidden generations.
22. A child continuity references shared history and links materially equivalent committed results; only material divergence creates a new opportunity.
23. Duplicate commands/resolver retries return existing admission/result status under the same identities.
24. Each downstream owner records one stable consequence receipt per source result and consequence kind.
25. Partial failure retries only the missing consumer receipt; successful siblings remain applied.
26. Correction is an authorized replacement/reconciliation of proven invalid authority with history retained.
27. The affected truth owner approves its correction, campaign/save authority approves lineage propagation, and each downstream owner controls reconciliation.
28. Preserve occurrence identity when the causal event happened; replace it when identity/admission/cause was invalid or merged.
29. Reuse valid channel evidence for interpretation/projection defects; invalidate/recompute only under proven channel/material/policy defect and explicit correction policy.
30. Downstream owners retain, reverse, compensate, replace, or quarantine through idempotent reconciliation receipts.
31. Correction lineage follows stable authority across addresses, checkpoints, copies, and recovery generations.
32. Closed Ironbound correction requires proven defect and owner approval, targets the closed lineage, and exposes no rollback or state picker.
33. Narrative/UI receive safe facts only; seeds, draws, hidden channels, weights, diagnoses, and validator facts remain private.
34. `type:domain:tick` ids are compatibility projections with collision limitations; migrate when evidenced and quarantine ambiguity.
35. Save/Stakes, Mortal Crisis/Stakes, domain ownership, and narrative boundaries are retained; identity shortcuts, global streams, UI authority, and silent correction are rejected; ambiguous older taxonomy is superseded.
36. Future order is the fourteen-stage conceptual sequence in section 35.
37. Exact types, algorithms, schemas, persistence, migrations, tooling, packages, tests, UI, and availability remain implementation-only.
38. The next route is `Functional State, Lethal Process, Care Requirement, And Mortal Crisis Receipt Contract Decision`.

## 41. Next Recommended Route

The next focused unversioned documentation-only route should be:

`Functional State, Lethal Process, Care Requirement, And Mortal Crisis Receipt Contract Decision`

It should consume this occurrence/result authority plus the accepted Mortal Crisis, save/Stakes, injury/restoration, narrative, and elemental boundaries. No next prompt or implementation route is installed by this decision.
