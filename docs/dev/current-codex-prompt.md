# Current Codex Prompt

## Run Identity

`Occurrence Identity, Named Uncertainty Channels, Outcome Commitment, And Correction Contract Decision`

Run classification: unversioned durable documentation-only contract decision

Milestone impact: `supports_current_band`

Parent version: none

Suggested commit:

`docs(design): define occurrence commitment and correction contracts`

## Purpose

Accept one durable repository-specific contract for occurrence identity, same-tick uniqueness, causal and material-input identity, deterministic and uncertain result receipts, named uncertainty channels, replay equivalence, outcome commitment, correction, supersession, and idempotent consequence consumption.

This decision is the next prerequisite after the accepted campaign/save provenance contract. It must define how authoritative domain actions and world changes retain identity across:

- ordinary execution and retry;
- save/load and session resume;
- Normal rollback and continuity branching;
- Committed checkpoint replay;
- Ironbound technical recovery;
- copied or relocated save artifacts;
- correction of invalid authority;
- downstream injury, body, Chronicle, account, closure, settlement, succession, narrative, and other consumers.

The run must decide the conceptual contracts where current authority and repository evidence are sufficient. It must not remain an options survey.

This run is documentation-only. It does not implement events, commands, RNG, hashing, seeds, schemas, persistence, packages, migrations, correction tooling, UI, tests, content, probabilities, balance, or gameplay.

## Why This Decision Is Ready

The repository now has accepted authority for:

- Normal, Committed, and Ironbound Stakes;
- campaign-rules semantic version 2 and Stakes policy revision 1;
- account, campaign, continuity, character, artifact, checkpoint, continuation-head, generation, correction-link, and closure identity boundaries;
- Normal branching at the first accepted mutation after loading an older non-head artifact;
- Committed continuation heads versus selectable checkpoints;
- Ironbound one-continuity technical-recovery generations;
- verified save publication and newest-verified recovery;
- outcome commitment for Committed and Ironbound as a required policy direction;
- one global ordered random stream as rejected;
- correction as distinct from player rollback and technical recovery;
- closure-before-settlement and consumed-value idempotency requirements;
- deterministic, fact-grounded narrative projection.

The live repository supplies concrete migration evidence:

- `GameEventEnvelope` currently has one free-form `id`, `type`, `domain`, `atTick`, payload, and optional tags;
- generic `createEvent` currently constructs `type:domain:tick`, which can collide when the same event type occurs more than once in one domain at one tick;
- several engines construct event ids independently rather than through one accepted occurrence contract;
- world spawn selection currently derives local deterministic choices from ad hoc seed/tick/profile/region strings;
- `TickContextBase` exposes one seed to domain execution;
- direct `Math.random` exists in non-authoritative or UI-adjacent seams that require explicit classification rather than silent adoption;
- no accepted occurrence registry, uncertainty-channel registry, result receipt, replay-equivalence contract, or correction owner graph exists.

No additional broad external research is required. This is a focused repository-contract decision.

## Route Precedence

This prompt controls the active run.

The most specific save-side authority is:

`docs/design/stakes-identity-campaign-save-provenance-checkpoint-topology-and-technical-recovery-contract-decision.md`

The most specific Stakes, mortality, and finality authority is:

`docs/design/checkpoint-commitment-mortal-crisis-resurrection-aftereffects-final-closure-and-stakes-authority-revision.md`

The following remain controlling for their domains:

1. `docs/design/quest-event-chronicle-authority-boundary-decision.md`;
2. `docs/design/combat-authority-boundary-decision.md`;
3. `docs/design/runtime-ownership-transition-readiness-consolidation.md`;
4. `docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md`;
5. `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md`;
6. `docs/design/injury-recovery-trauma-and-magical-restoration-decision.md`;
7. `docs/design/narrative-realization-referential-grammar-appearance-and-fact-projection-decision.md`;
8. `docs/design/elemental-alignment-environmental-manifestation-temperament-and-magic-stimulus-decision.md`;
9. domain-specific accepted authority for travel, quest acceptance/tracking, activity selection, combat, resources, encounters/spawn, achievements, estate, Prestige, and account history.

This decision may establish occurrence, uncertainty, result, commitment, correction, and consequence-consumption boundaries. It may not move domain truth into a generic event bus, random service, save manager, UI, Chronicle, Manuscript, or correction tool.

Held `Version 0.6.6` remains paused. Retained `0.6.7` artifacts remain untouched.

## Required Repository Reading

Read first:

- `docs/design/stakes-identity-campaign-save-provenance-checkpoint-topology-and-technical-recovery-contract-decision.md`;
- `docs/design/checkpoint-commitment-mortal-crisis-resurrection-aftereffects-final-closure-and-stakes-authority-revision.md`;
- `docs/design/quest-event-chronicle-authority-boundary-decision.md`;
- `docs/design/combat-authority-boundary-decision.md`;
- `docs/design/runtime-ownership-transition-readiness-consolidation.md`;
- `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md`;
- `docs/design/narrative-realization-referential-grammar-appearance-and-fact-projection-decision.md`;
- `docs/dev/tmp-comparative-checkpoint-mortality-rescue-and-stakes-research-2026-07-23.md` only where needed for commitment, replay, correction, and idempotency evidence;
- `docs/dev/tmp-narrative-realization-and-mortal-crisis-presentation-audit-2026-07-23.md` only where needed for event-time identity, same-tick occurrence, ordering, simultaneity, and provenance gaps;
- `docs/dev/current-codex-output.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/historical-version-and-deferred-route-register.md`;
- `packages/shared/types/src/contracts.ts`;
- `packages/shared/events/src/index.ts`;
- `packages/engines/world-engine/src/index.ts`;
- `packages/engines/world-engine/src/spawn/index.ts`;
- `packages/engines/game-engine/src/player-travel.ts`;
- `packages/engines/game-engine/src/player-quest-acceptance.ts`;
- `packages/engines/game-engine/src/player-quest-tracking.ts`;
- `packages/engines/game-engine/src/player-activity-selection.ts`;
- `packages/engines/game-engine/src/combat/index.ts`;
- resource-event and gameplay-snapshot synchronization sources;
- relevant achievement, account-history, estate, payout, closure, save, and Chronicle consumers;
- direct `Math.random`, seed, hash, roll, selection, event-id, request-id, transaction-id, correction, replay, and idempotency uses;
- focused tests that currently encode event identity, deterministic selection, command retry, duplicate protection, or same-tick behavior;
- package manifests only to verify ownership;
- `AGENTS.md`;
- `README.md`.

Do not reopen public Stakes taxonomy, save topology, Mortal Crisis phases, elemental canon, narrative grammar, injury semantics, or broad mortality research.

## Pinned Source Identities

- completed save/Stakes contract commit: `dcea4e42dcbbf67cecf19490923e63384027243e`;
- save/Stakes contract artifact blob: `86f10b6fbdc4fc7fdce3f50673556930b9d35999`;
- pre-occurrence current output blob: `784dc03ef345f0bc2704463dfdaf08820b623aa8`;
- reconciled pre-occurrence handoff blob: `8b3d2608ef03e85469b7aa68f59fdfa50cfe8815`;
- reconciled pre-occurrence route-register blob: `7f14f0936f31fc64859bdff6af783ebb6f0a16d3`;
- Mortal Crisis/Stakes authority blob: `615c5da8f9bf2c7ef210a44227bdcbb1f5f89a78`;
- comparative mortality research blob: `26ce50958f348f316ab98bcafe31282393709fd6`;
- shared contracts blob: `5534d83cd70ceb2127175fe45482262d0cdfb4bc`;
- shared events blob: `316b156013328d8fc90888b3e3ba4570a1eccd06`;
- world tick blob: `5890e4cd23cdfc12e894e8129ae4c8aca3c3c925`;
- world spawn resolver blob: `a778d6722e9643b4dac93f1afb133f5b72f8dc33`;
- player travel blob: `6b354e13bd8905287e4e838e5c2bfffebceb6ec0`;
- quest acceptance blob: `fbce310aa9431b5767cf79ce3f3151e3b9514c12`;
- quest tracking blob: `06e7881c32fd55f1087fc9db87ff390862798bd7`;
- held `Version 0.6.6` prompt blob: `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

## Execution Gate

1. Record branch, upstream, starting commit, ending pre-edit commit, and clean/dirty state.
2. Fetch and fast-forward pull, then reload this prompt.
3. Confirm commit `dcea4e42dcbbf67cecf19490923e63384027243e` is an ancestor of `HEAD`.
4. Confirm every pinned authority, coordination, live-source, evidence, and held-route blob.
5. Inspect any event, random, save, or account-consumer changes after the pinned live-source state.
6. Preserve unrelated work.
7. If a controlling authority or coordination pin fails, update only `docs/dev/current-codex-output.md` with the contradiction and stop.
8. If a live-source pin changed but remains compatible, record the new baseline. If it materially changes ownership or invalidates the decision scope, update only current output and stop.
9. Confirm the active prompt remains this exact run after pull.

## Decision Standard

Use this precedence:

1. explicit user direction;
2. accepted save/Stakes and Mortal Crisis/Stakes authorities;
3. accepted domain-owner boundaries;
4. current repository event, random, retry, persistence, and consumer facts;
5. completed comparative and audit evidence;
6. implementation convenience last.

Where the conceptual contract is sufficiently supported, decide. Defer exact field names, interfaces, package paths, algorithms, hash functions, seed derivation, byte formats, storage, channel catalogs, probabilities, and implementation code.

Current ids, ticks, seeds, hashes, event envelopes, transaction ids, and test fixtures are migration evidence. They do not become final authority merely because they exist.

## Mandatory Conceptual Taxonomy

Accept or explicitly refine a taxonomy that distinguishes:

```text
command or request
  -> an attempted instruction or owner input

occurrence
  -> one authoritative causal event, transition, or resolution attempt

result
  -> an accepted deterministic or uncertainty-resolved domain outcome

consequence receipt
  -> an owner-specific applied downstream effect

projection
  -> event envelope, notice, Chronicle, Manuscript, UI, telemetry, or index view
```

Required boundaries:

- a command/request id is not automatically an occurrence id;
- retrying delivery does not mint a new occurrence;
- an occurrence is not merely an event-envelope string;
- a result is not merely a random draw;
- a consequence receipt is not the source result;
- projection ids cannot become gameplay authority;
- one occurrence may produce multiple results or consequences only under explicit owner-certified relations;
- one result may be consumed by multiple owners, each with its own idempotent consequence receipt;
- deterministic results and uncertain results use the same provenance discipline but not necessarily a draw/channel record;
- correction is not a new ordinary command, rollback, resurrection, or technical recovery.

## Mandatory Occurrence Identity Decision

The decision must establish conceptual occurrence identity sufficient to distinguish repeated and concurrent events.

At minimum, an authoritative occurrence must retain or resolve:

- owning domain and occurrence kind;
- campaign and continuity identity;
- initiating request/command or source receipt where applicable;
- parent, cause, correlation, and supersession relations where applicable;
- accepted time/order evidence;
- same-tick uniqueness;
- simultaneity-group or explicit unordered relation where events are genuinely simultaneous;
- relevant actor, target, object, location, route, encounter, quest, process, or other owner-certified participants;
- governing policy, content, and resolver semantic versions;
- material-input normalization policy version;
- retry/idempotency posture;
- result and downstream-consumption links;
- correction lineage.

The decision must determine:

- whether occurrence identity is established before resolution, at accepted resolution, or through a two-stage attempt/accepted-occurrence boundary;
- how an owner distinguishes a retry from a new attempt;
- how multiple same-type, same-domain, same-tick occurrences remain distinct;
- how an aggregate occurrence relates to child occurrences;
- how simultaneous occurrences differ from merely adjacent ordered occurrences;
- how source recreation, save/load, replay, and technical recovery preserve identity;
- how a child continuity relates to source occurrences from its parent continuity;
- how legacy event ids that cannot prove uniqueness are classified.

Do not require one global sequence as the sole identity authority. A sequence/order may be retained as evidence, but identity must remain stable across serialization, replay, and unrelated event insertion.

## Mandatory Material-Cause And Replay-Equivalence Decision

Accept a conceptual owner-certified material-input identity rather than hashing an entire opaque snapshot by default.

The decision must establish which categories may be materially relevant, including where applicable:

- participants, roles, actor, target, and permissions;
- accepted player or AI choices;
- causally relevant action order;
- equipment, inventory, resources, capabilities, conditions, and relationships;
- location, route, terrain, weather, locality, and environment;
- threat, encounter, quest, body, institution, or world state;
- governing content, rules, policy, and resolver versions;
- prior committed results required by the owner;
- uncertainty channel and correction lineage.

Required conclusions:

- each domain owner certifies its relevant material inputs;
- UI state, renderer variation, menu order, camera state, localization, telemetry order, and unrelated harmless actions do not create a new draw opportunity;
- reload, re-entry, repeated delivery, or storage relocation do not create a new occurrence when the causal attempt is unchanged;
- changed preparation, equipment, route, timing, participants, target, environment, accepted action, or other owner-certified causal input may establish a new occurrence or result opportunity;
- the decision must distinguish a new occurrence from a corrected occurrence and from replay of the same occurrence;
- normalization policy changes require explicit versioning and migration/correction posture;
- no generic infrastructure owner may decide every domain’s materiality.

## Mandatory Deterministic And Uncertain Result Decision

Distinguish:

1. **deterministic result receipt** — accepted outcome derived without an authorized uncertainty draw;
2. **uncertain result receipt** — accepted outcome derived through one or more explicitly authorized named uncertainty channels;
3. **rejected or unresolved attempt** — no accepted result and no downstream consequences unless an owner explicitly defines a rejection consequence;
4. **corrected/superseded result** — prior accepted result replaced by authorized correction while retaining history and reconciliation state.

A random value is not a domain result. The domain owner must interpret an authorized uncertainty result and accept the resulting domain outcome.

Every accepted result must conceptually link:

- occurrence identity;
- owner and result kind;
- deterministic versus uncertain posture;
- governing resolver/policy/content version;
- material-input identity/version;
- accepted result identity and payload/evidence boundary;
- uncertainty-channel and draw/result identity when applicable;
- prior/superseded result where applicable;
- downstream consequence-consumption receipts;
- correction lineage;
- presentation-safe evidence projection.

## Mandatory Named Uncertainty-Channel Decision

Accept a conceptual named uncertainty-channel registry or equivalent owner-governed identity boundary.

Required properties:

- stable channel identity scoped to an owning domain and uncertainty family;
- explicit authorization for uncertainty rather than random use by default;
- separation from event type, UI label, global seed, and result identity;
- occurrence-scoped draw/result identity;
- policy and semantic versioning;
- deterministic reproduction or retained accepted result sufficient for committed replay;
- no dependence on unrelated call order;
- no one global ordered random stream as authority;
- no automatic reuse of one channel for semantically different decisions;
- multiple draws/channels in one occurrence only through explicit owner-certified relations;
- hidden seed/draw/internal evidence separated from renderer-visible and player-visible facts;
- channel identity retained for audit and correction without exposing spoiler or exploitable internals.

The decision must classify current seed/tick/hash patterns and direct `Math.random` use as one of:

- non-authoritative UI/development convenience;
- deterministic domain selection requiring later migration;
- unauthorized gameplay uncertainty requiring replacement;
- test fixture or tooling;
- unrelated use.

Do not select an RNG family, algorithm, hash, seed format, cryptographic posture, library, or exact channel ids.

## Mandatory Stakes Commitment Decision

Retain the accepted tier posture:

### Normal Stakes

- no general cross-reload outcome-commitment policy;
- already accepted domain facts and applied consequences remain idempotent within their authoritative continuity;
- a narrower owner may explicitly require commitment for a specific result family;
- loading an earlier artifact and making the first divergent mutation creates a child continuity under the save contract;
- abandoned continuity value cannot leak into the active branch;
- Normal rollback is not correction.

### Committed Stakes

- named uncertain results are committed across materially identical replay;
- checkpoint selection, session restart, save relocation, and technical recovery do not create a new draw opportunity;
- selecting an earlier checkpoint creates a child continuity only on first divergent mutation;
- committed results whose causal identity remains materially identical follow the accepted replay relation into the child continuity;
- material changes certified by the owner may create a new occurrence/result opportunity;
- final closure and checkpoint retirement preserve all committed result and consumed-consequence evidence needed for settlement idempotency.

### Ironbound Stakes

- named uncertain results and accepted command/occurrence consequences remain committed in the one continuity;
- retry, reconnect, technical recovery, older hidden generation, or copied bytes cannot reroll or undo accepted results;
- accepted actual death/final closure remains terminal and cannot be corrected by ordinary replay or recovery;
- only an explicitly authorized defect correction may supersede invalid authority, and it cannot become a player rollback surface.

The decision must define the conceptual difference between:

- accepting a command;
- establishing an occurrence;
- committing an uncertain result;
- applying consequences;
- persisting a save generation;
- correcting invalid authority.

## Mandatory Retry And Idempotency Decision

The decision must establish retry rules for:

- duplicate command delivery;
- repeated resolver invocation;
- save/load replay;
- checkpoint replay;
- technical recovery;
- application restart;
- copied artifacts;
- partial downstream failure;
- projection repair;
- correction replay.

Required conclusions:

- the same accepted request/occurrence cannot create duplicate accepted results;
- the same result cannot create duplicate owner-specific consequences;
- a failed projection does not invalidate an accepted result;
- a failed downstream owner may retry only its unconsumed consequence under the same receipt identity;
- downstream owners retain their own consequence truth and cannot mutate the source result;
- one generic event bus or command bus is not required to establish idempotency;
- account rewards, estate, achievements, Prestige, closure, succession, Chronicle, body, injury, inventory, quest, and other consequences need stable consumed-receipt links appropriate to their owners;
- copied bytes and abandoned branches cannot duplicate value;
- correction reconciliation must not silently reapply every downstream consequence.

## Mandatory Correction And Supersession Decision

Define correction as an authorized replacement of invalid authority, not ordinary player preference.

The decision must establish:

- who may request, approve, and apply a correction conceptually;
- which owner corrects occurrence identity, result truth, or downstream consequences;
- required defect/reason classification and evidence;
- relation to campaign, continuity, source artifact/checkpoint/head, occurrence, result, and consumed consequences;
- whether the original record remains retained as invalid/superseded evidence;
- when correction preserves the prior occurrence identity versus establishes a corrected replacement occurrence;
- when an uncertainty result is reused, invalidated, or recomputed under a versioned correction policy;
- how material-input or policy-version errors are represented;
- how downstream owners reconcile, reverse, compensate, or retain consequences according to their own authority;
- how correction is idempotent and replay-safe;
- how corrections propagate across copies and technical-recovery generations;
- how closed Ironbound state is corrected only for proven invalid authority without creating a rollback menu;
- how correction notices are projected without exposing hidden seeds, draws, diagnoses, or validator-only facts.

Required boundaries:

- technical recovery restores verified authority; correction changes invalid authority;
- player rollback selects permitted history; correction does not;
- resurrection changes life state through gameplay authority; correction does not;
- content/rule updates do not silently reroll historical accepted outcomes;
- a renderer, Chronicle, Manuscript, account index, save slot, timestamp, or UI cannot authorize correction;
- no result is simply deleted to hide the correction trail;
- correction does not automatically reverse irreversible real-world account transactions without an owner-approved reconciliation receipt.

## Mandatory Ordering, Simultaneity, And Event Projection Decision

The decision must address current same-tick and event-envelope gaps.

Required conclusions:

- `type:domain:tick` is insufficient as a unique authoritative occurrence identity;
- repeated same-type events at one tick must remain distinguishable;
- authoritative order must be retained where causally relevant;
- genuine simultaneity must be representable without inventing an arbitrary causal order;
- an event envelope is a transport/projection of accepted identity and facts, not the sole authority merely because it contains an id;
- event type is vocabulary, not occurrence identity;
- aggregate events must link their component occurrences/results rather than collapse provenance;
- event-time narrative evidence must bind to exact occurrence/result/order or simultaneity identity;
- same-tick collisions in current live sources are migration defects or compatibility limitations, not proof that the events were identical;
- legacy records without sufficient uniqueness must be retained conservatively and must not mint new committed results or duplicated consequences by inference.

## Mandatory Consumer Boundaries

The contract must preserve:

- domain resolvers own gameplay truth;
- event/occurrence infrastructure owns identity, relation, and delivery contracts only;
- uncertainty infrastructure owns authorized channel/draw identity, not domain outcome meaning;
- save authority stores occurrence/result/correction links but does not resolve outcomes;
- Chronicle and Manuscript project retained facts and never reconstruct authority;
- narrative realization receives observer-safe facts, never seeds or hidden draws;
- UI presents decisions, outcomes, correction notices, and provenance summaries but does not own them;
- account, estate, Prestige, achievement, and succession owners consume final authoritative receipts;
- injury, body, health, quest, combat, inventory, travel, economy, ecology, magic, and other owners retain their consequence authority;
- logs, telemetry, and debugging records are not gameplay authority unless explicitly accepted through the owner contract.

## Required Conclusions

Answer at least:

1. What is the canonical command/request, occurrence, result, consequence, and projection taxonomy?
2. When is occurrence identity established?
3. How is retry distinguished from a new attempt?
4. How are repeated same-type, same-domain, same-tick occurrences distinguished?
5. How are order and simultaneity represented conceptually?
6. How do parent, cause, correlation, aggregate, and child occurrence relations differ?
7. What minimum occurrence provenance is required?
8. What is material-input identity and who owns it?
9. What makes replay materially identical?
10. Which changes create a new occurrence or result opportunity?
11. How do policy/content/resolver version changes affect equivalence?
12. What distinguishes deterministic, uncertain, rejected, unresolved, and corrected results?
13. What owns the meaning of a random draw?
14. What is a named uncertainty channel?
15. How is a channel scoped and versioned?
16. How can one occurrence use multiple channels safely?
17. Which current random/seed/hash uses are migration inputs, non-authoritative, or defects?
18. What result identity is retained for committed replay?
19. What does Normal commit and not commit?
20. What does Committed commit across checkpoint replay?
21. What does Ironbound commit across technical recovery?
22. How do committed results relate to a new child continuity after checkpoint replay?
23. How are duplicate commands and resolver retries made idempotent?
24. How are downstream consequences consumed exactly once?
25. How are partial downstream failures retried?
26. What is correction?
27. Who authorizes occurrence, result, and consequence correction?
28. When does correction preserve versus replace occurrence identity?
29. When is a prior uncertain result reused versus invalidated?
30. How are corrected downstream consequences reconciled?
31. How do corrections propagate across copies, checkpoints, and recovery generations?
32. How is closed Ironbound authority corrected without becoming rollback?
33. How are hidden draw facts separated from narrative and UI?
34. How are current `type:domain:tick` event ids classified and migrated?
35. Which authorities are retained, narrowed, rejected, or superseded?
36. What future package order follows?
37. What remains implementation-only?
38. What is the next recommended route?

## Required Decision Artifact

Create:

`docs/design/occurrence-identity-named-uncertainty-channels-outcome-commitment-and-correction-contract-decision.md`

It must contain:

1. status, scope, and source verification;
2. executive decision;
3. accepted vocabulary;
4. authority precedence and supersession;
5. live event/random/id baseline and migration classification;
6. command/request, occurrence, result, consequence, and projection taxonomy;
7. occurrence identity owner graph;
8. minimum occurrence provenance;
9. request retry and occurrence-establishment boundary;
10. same-tick uniqueness;
11. ordering, simultaneity, correlation, causation, aggregation, and child relations;
12. material-input normalization ownership;
13. replay-equivalence contract;
14. deterministic result receipt;
15. uncertain result receipt;
16. named uncertainty-channel contract;
17. multi-channel and multi-result boundary;
18. Normal commitment posture;
19. Committed commitment posture;
20. Ironbound commitment posture;
21. continuity branch and checkpoint replay relation;
22. technical-recovery relation;
23. consequence-consumption and idempotency graph;
24. partial downstream failure and retry;
25. correction authority graph;
26. correction reasons, evidence, and permission;
27. occurrence/result supersession;
28. uncertainty reuse, invalidation, and recomputation boundary;
29. downstream reconciliation;
30. closed-Ironbound correction boundary;
31. event-envelope and projection boundary;
32. narrative, Chronicle, Manuscript, UI, logging, and telemetry boundary;
33. legacy/current migration and quarantine;
34. explicit retention/rejection/supersession matrix;
35. future implementation-package order without permission;
36. future test and validation matrix;
37. temporary-evidence retention;
38. unresolved implementation questions;
39. explicit non-decisions;
40. answers to all required conclusions;
41. next recommended route.

## Future Implementation-Order Requirement

Recommend a conceptual order without authorizing implementation. Test at least:

1. occurrence vocabulary and semantic policy version;
2. request/delivery identity and retry boundary;
3. occurrence identity, same-tick uniqueness, order, simultaneity, and relation contracts;
4. material-input normalization owner contracts;
5. deterministic result receipts;
6. uncertainty-channel registry and uncertain result receipts;
7. per-Stakes commitment policy adapters;
8. save/checkpoint/continuity link integration;
9. consequence-consumption receipts and owner idempotency;
10. correction authority, supersession, and reconciliation;
11. event-envelope compatibility adapter;
12. domain adapters in a narrow representative order;
13. Chronicle/narrative/UI projections;
14. migration, quarantine, diagnostics, tests, and production availability only after separate authorization.

The decision may revise this sequence with evidence. It must not assign a release version, exact package, schema, algorithm, hash, RNG, dependency, storage, or implementation prompt.

## Future Test Matrix Requirement

Require future non-canonical fixtures for at least:

### Occurrence identity

- two same-type, same-domain events in the same tick remain distinct;
- aggregate occurrence with multiple child occurrences;
- simultaneous events without false causality;
- ordered events with preserved causal order;
- duplicate delivery retains one occurrence;
- same request id with materially different payload is rejected/quarantined;
- serialization/reload preserves identity;
- source recreation cannot mint a duplicate occurrence.

### Material equivalence

- identical causal inputs replay as the same committed opportunity;
- UI/menu/camera/localization differences do not create new identity;
- changed equipment, route, participant, timing, environment, or accepted choice may create a new identity when owner-certified;
- unrelated harmless action order does not reroll;
- policy/content version change is explicit rather than silent;
- Normal child continuity after divergent mutation has correct parent relation;
- Committed child continuity retains linked committed results when causes remain equivalent.

### Deterministic and uncertain results

- deterministic result uses no uncertainty channel;
- uncertain result links one authorized channel and retained accepted result;
- multiple channels in one occurrence remain distinct;
- unauthorized random call cannot become accepted gameplay result;
- unrelated channel use cannot perturb another channel;
- result retry does not create a second result;
- one global stream is not required.

### Stakes commitment

- Normal reload may rerun a noncommitted uncertain owner where policy permits;
- Normal owner-specific committed result remains binding;
- Committed checkpoint replay retains materially identical uncertain result;
- Committed material preparation change may create a new opportunity;
- Ironbound reconnect/technical recovery retains accepted result;
- copied artifact or generation cannot reroll;
- final closure retains commitment and consumed consequences.

### Consequence idempotency

- one result creates one injury consequence receipt;
- one result creates one Chronicle projection without becoming Chronicle authority;
- partial downstream failure retries only the missing consequence;
- duplicate delivery cannot duplicate inventory, reward, estate, achievement, Prestige, closure, or successor value;
- abandoned Normal continuity cannot retain later value;
- checkpoint replay cannot duplicate consumed consequences.

### Correction

- invalid result is superseded with reason and evidence retained;
- correction replay is idempotent;
- correction is distinct from rollback and recovery;
- corrected uncertainty result follows explicit reuse/invalidation policy;
- downstream compensation does not blindly reapply all effects;
- copied artifacts observe the same correction lineage;
- closed Ironbound defect correction cannot expose historical selection;
- content update does not silently reroll history;
- projection-only error repairs without gameplay correction.

### Migration and privacy

- current `type:domain:tick` collisions are detected or quarantined;
- legacy unique events remain readable without pretending stronger provenance;
- ad hoc spawn hash use is classified without becoming final channel design;
- direct UI randomization remains non-authoritative;
- hidden seeds/draws are absent from player narrative and ordinary UI;
- event envelope, Chronicle, and Manuscript cannot reconstruct hidden authority.

## Coordination Updates

### `docs/dev/current-codex-output.md`

Replace with a detailed completion summary including:

- run identity and classification;
- repository state and exact changed paths;
- pinned source verification;
- live event/random baseline;
- accepted taxonomy and owner graph;
- occurrence, equivalence, result, channel, commitment, correction, and idempotency decisions;
- per-Stakes posture;
- migration and consumer boundaries;
- retained/rejected/superseded authorities;
- unresolved implementation questions;
- checks, risks, evidence retention, held routes, and next route.

### `docs/dev/current-gpt-handoff.md`

Update to:

- mark this contract complete and controlling;
- add its exact artifact blob;
- preserve save/Stakes and Mortal Crisis/Stakes authorities;
- summarize occurrence identity, named channels, result receipts, replay equivalence, per-Stakes commitment, correction, and consequence-consumption boundaries;
- recommend the next focused route from the accepted package order, expected to be `Functional State, Lethal Process, Care Requirement, And Mortal Crisis Receipt Contract Decision` unless the completed inspection identifies a narrower prerequisite;
- preserve implementation prohibition, held `0.6.6`, and retained `0.6.7`;
- state that no next prompt was installed by the completed decision.

### `docs/dev/historical-version-and-deferred-route-register.md`

Update only materially changed rows:

- mark this occurrence contract complete design authority;
- add its artifact to history;
- update Difficulty/Stakes, injury/Mortal Crisis, Ironbound, Generic command delivery/replay, combat-health, and other direct consumers;
- advance the next recommended route without assigning a release version;
- preserve unrelated history, held `0.6.6`, and retained `0.6.7`.

## Temporary Evidence Retention

Retain:

- comparative mortality research through checkpoint, occurrence commitment, Mortal Crisis, resurrection, settlement, and succession implementation consumers;
- the defeat/injury audit through the first relevant runtime repair;
- narrative audit/research through occurrence-aware narrative and Mortal Crisis consumers;
- elemental audit/research through elemental implementations and crisis-capability consumers;
- completed save/Stakes and Mortal Crisis/Stakes authorities permanently.

Do not delete temporary evidence in this run.

## Authorized Output

On successful completion, modify exactly:

1. create `docs/design/occurrence-identity-named-uncertainty-channels-outcome-commitment-and-correction-contract-decision.md`;
2. update `docs/dev/current-codex-output.md`;
3. update `docs/dev/current-gpt-handoff.md`;
4. update `docs/dev/historical-version-and-deferred-route-register.md`.

Do not modify this prompt.

## Forbidden Scope

Do not modify:

- `docs/dev/current-codex-prompt.md`;
- completed authorities, audits, or research;
- roadmap, sequenced plan, or project continuity brief;
- held `0.6.6`;
- retained `0.6.7` artifacts;
- runtime;
- shared types;
- event libraries;
- schemas;
- validators;
- package manifests or lockfiles;
- dependencies;
- persistence, save manager, lifecycle, account profile/history, or migrations;
- tests;
- UI;
- content;
- generated files;
- gameplay.

Do not:

- implement occurrence ids, events, commands, channels, RNG, seeds, hashes, commitment, correction, receipts, persistence, migration, or UI;
- accept exact TypeScript fields, interfaces, package paths, storage keys, algorithms, RNG families, hash functions, seed derivation, channel ids, byte formats, probabilities, or values;
- add an event-bus, command-bus, random, journal, transaction, serialization, cryptographic, database, cloud, or other dependency;
- make one global sequence or random stream the sole occurrence/uncertainty authority;
- treat event type, tick, event-envelope id, request id, seed, hash, slot, timestamp, Chronicle id, or UI id as sufficient occurrence identity;
- turn every deterministic resolver into a random-channel consumer;
- let random infrastructure interpret domain outcome meaning;
- let save code resolve or reroll gameplay outcomes;
- let correction become a player rollback, save picker, resurrection, or favorable reroll;
- silently delete or rewrite historical accepted results;
- silently reroll history after content/rule updates;
- duplicate consequences during retry, replay, branch, copy, recovery, or correction;
- expose seeds, draws, hidden channels, validator-only facts, diagnoses, or future outcomes through narrative or ordinary UI;
- make Chronicle, Manuscript, logs, telemetry, or projections authoritative state;
- reopen final Ironbound death through replay, recovery, or inferred correction;
- restore `0.6.6`;
- assign a release version;
- create an implementation prompt.

## Stop Conditions

Stop after the exact four documentation outputs.

If a controlling pin fails, update only `docs/dev/current-codex-output.md` with the contradiction and stop.

If live event/random sources materially changed beyond the pinned baseline, determine whether the new state is compatible. Continue only when the ownership and migration conclusions remain valid; otherwise record the blocking contradiction in current output and stop.

Occurrence taxonomy, same-tick uniqueness, material replay equivalence, deterministic/uncertain result receipts, named-channel semantics, per-Stakes commitment, consequence idempotency, correction authority, and legacy event-id classification must not remain deferred. Exact implementation details remain deferred.

Report the ending commit, exact changed paths, accepted taxonomy, owner graph, same-tick/order/simultaneity posture, material-equivalence rules, named-channel contract, per-Stakes commitment, correction and consequence-consumption decisions, retained/rejected authorities, unresolved implementation questions, evidence posture, held-route status, and next recommended route.