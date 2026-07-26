# Current Codex Prompt

## Run Identity

`Stakes Identity, Campaign/Save Provenance, Checkpoint Topology, And Technical-Recovery Contract Decision`

Run classification: unversioned durable documentation-only contract decision

Milestone impact: `supports_current_band`

Parent version: none

Suggested commit:

`docs(design): define stakes save and recovery contracts`

## Purpose

Accept the smallest durable save-side contract needed to support the already accepted Normal, Committed, and Ironbound Stakes authority without implementing persistence.

This decision must establish exact conceptual ownership and provenance for:

- the three canonical Stakes policy identities and their semantic policy version;
- account, campaign, continuity/timeline, character, save artifact, checkpoint, write generation, closure, and correction identity;
- storage addresses versus authoritative state identities;
- Normal manual/quick-save topology and branch abandonment;
- Committed continuation-head persistence, qualifying selectable checkpoints, rollback, checkpoint retirement, and session resume;
- Ironbound one-authoritative-continuity persistence and hidden technical-recovery generations;
- technical recovery, latest-verified selection, partial-write safety, and correction provenance;
- legacy/current save migration into the accepted campaign-rules model;
- copied-slot, copied-save, stale-generation, archived/deleted-history, closed-character, and duplicate-value protection;
- the boundary with the later occurrence/uncertainty commitment contract.

The decision must inspect current repository seams and accept contracts sufficient for a later first implementation package. It must not remain a broad options survey.

This run is documentation-only. It does not implement shared types, schemas, storage, serialization, saves, migrations, UI, tests, runtime, account settlement, checkpoints, journals, hashes, technical recovery, content, balance, or gameplay.

## Why This Decision Is Ready

The controlling Mortal Crisis/Stakes authority has already accepted:

- `normal_stakes`, `committed_stakes`, and `ironbound_stakes`;
- broad selected rollback for Normal;
- qualifying checkpoint rollback plus committed uncertain outcomes for Committed;
- one authoritative continuity and no selected rollback for Ironbound;
- technical recovery as distinct from player rollback;
- final-closure-before-settlement ordering;
- creation locks and production availability gates.

The live repository provides a concrete migration baseline:

- 128 manual save addresses plus one quick-save address;
- one localStorage envelope per account and slot;
- bare JSON snapshot serialization;
- a snapshot containing account, version, tick, and domain state but no accepted campaign, continuity, checkpoint, generation, branch, policy, or correction identity;
- legacy `easy | normal | hard | brutal` plus a Boolean `hardcore` rather than the accepted three-axis campaign contract;
- account history, payout, estate, and save-slot projections keyed through current character/run seams;
- HP-zero terminal archival and save deletion that remain known implementation defects.

No further broad research is needed. The unresolved work is repository-specific contract acceptance.

## Route Precedence

This prompt controls the active run.

The most specific controlling authority is:

`docs/design/checkpoint-commitment-mortal-crisis-resurrection-aftereffects-final-closure-and-stakes-authority-revision.md`

The following remain controlling where not explicitly narrowed by that authority or this decision:

1. `docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md`;
2. `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md`;
3. `docs/design/restricted-stakes-continuity-death-closure-and-prestige-decision.md`;
4. `docs/design/difficulty-presets-grim-world-rules-and-stakes-separation-decision.md`;
5. `docs/design/injury-recovery-trauma-and-magical-restoration-decision.md`;
6. `docs/design/narrative-realization-referential-grammar-appearance-and-fact-projection-decision.md`;
7. `docs/design/elemental-alignment-environmental-manifestation-temperament-and-magic-stimulus-decision.md`.

This decision may define save-side identities and transaction boundaries. It may not revise Mortal Crisis phases, resurrection-per-tier policy, Ironbound finality, injury truth, narrative authority, elemental capability, reward formulas, succession selection, or gameplay outcomes.

Held `Version 0.6.6` remains paused. Retained `0.6.7` artifacts remain untouched.

## Required Repository Reading

Read first:

- `docs/design/checkpoint-commitment-mortal-crisis-resurrection-aftereffects-final-closure-and-stakes-authority-revision.md`;
- `docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md`;
- `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md`;
- `docs/design/restricted-stakes-continuity-death-closure-and-prestige-decision.md`;
- `docs/design/difficulty-presets-grim-world-rules-and-stakes-separation-decision.md`;
- `docs/dev/tmp-comparative-checkpoint-mortality-rescue-and-stakes-research-2026-07-23.md` only where needed to preserve load/commitment/recovery distinctions;
- `docs/dev/tmp-normal-stakes-defeat-injury-trauma-and-restoration-audit-2026-07-22.md` only where needed to preserve live migration and terminal-flow evidence;
- `docs/dev/current-codex-output.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/historical-version-and-deferred-route-register.md`;
- `packages/shared/types/src/contracts.ts`;
- `packages/shared/persistence/src/index.ts`;
- `packages/engines/game-engine/src/save-snapshot.ts`;
- `packages/engines/player-engine/src/difficulty.ts`;
- `apps/rpg-ui/src/game-shell/state.ts`;
- `apps/rpg-ui/src/game-shell/saveManager.ts`;
- `apps/rpg-ui/src/game-shell/runLifecycle.ts`;
- `apps/rpg-ui/src/game-shell/accountProfileManager.ts`;
- `apps/rpg-ui/src/game-shell/newGameSnapshot.ts`;
- `apps/rpg-ui/src/runtime/GameSessionContext.tsx`;
- `apps/rpg-ui/src/App.tsx` and `apps/rpg-ui/src/game-shell/InGameShell.tsx` only for current orchestration and UI ownership seams;
- relevant account-history, achievement, estate, Prestige, legacy-payout, retirement, save-manager, snapshot, and run-lifecycle tests;
- package manifests only to verify current package ownership;
- `AGENTS.md`;
- `README.md`.

Do not reopen completed mortality, narrative, elemental, injury, or setting-canon questions.

## Pinned Source Identities

- completed Mortal Crisis/Stakes authority commit: `b55b9d5e2656d62644251c289038aa19f5eebe7f`;
- controlling authority artifact blob: `615c5da8f9bf2c7ef210a44227bdcbb1f5f89a78`;
- pre-contract current output blob: `7ee5aaf7ad95266834ba8273a2b238f048f2adde`;
- reconciled pre-contract handoff blob: `5b4b3b74a894c3b875266f9cd0bffc3e7eb4dcae`;
- reconciled pre-contract route-register blob: `bc2e02df68a4033f2fcd3e21def42b5ad7d35a24`;
- campaign-rules decision blob: `20e72fb280fd67351135e195f75195a592bce9c9`;
- Normal Stakes fallback decision blob: `e32ee0eb7a64777e2ca1134600b189d80fd0eafe`;
- restricted-Stakes decision blob: `e1d2ec6b087eb9be7f9222763e25fee86c2f5329`;
- comparative mortality research blob: `26ce50958f348f316ab98bcafe31282393709fd6`;
- defeat/injury/restoration audit blob: `ad5b66157f61e25223e2abd7b2a7f4ef560366e3`;
- live shared contracts blob: `5534d83cd70ceb2127175fe45482262d0cdfb4bc`;
- live persistence blob: `ecdd486bc2fcf9fea8c045ee2a70849991d41fbf`;
- live save-snapshot blob: `3989297047e0ca2f15208375039e124069f9c50c`;
- live difficulty blob: `a34f000f938f53b2d43990a2f87fefcddb86e5ca`;
- live game-shell state blob: `52bc7015a993c0852f8d427baabf58b5151d5ba2`;
- live save-manager blob: `069010cff74b8d23f16f626b77e9f68bc91092f1`;
- live run-lifecycle blob: `ec67c0ec8b4955bd54808c9eef4674858792085e`;
- held `Version 0.6.6` prompt blob: `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

## Execution Gate

1. Record branch, upstream, starting commit, ending pre-edit commit, and clean/dirty state.
2. Fetch and fast-forward pull, then reload this prompt.
3. Confirm commit `b55b9d5e2656d62644251c289038aa19f5eebe7f` is an ancestor of `HEAD`.
4. Confirm every pinned authority, evidence, coordination, live-source, and held-route blob.
5. Confirm no runtime or save-system change after the pinned live-source state materially alters the baseline. If one exists, inspect it and record whether the decision can continue.
6. Preserve unrelated work.
7. If a controlling authority or coordination pin fails, update only `docs/dev/current-codex-output.md` with the contradiction and stop.
8. If a live-source pin changes but the new source is compatible, record the new fact in the decision. If it creates a material ownership contradiction, update only current output and stop.

## Decision Standard

Use this precedence:

1. explicit user direction;
2. the completed Mortal Crisis/Stakes authority;
3. accepted campaign, Normal, and Ironbound authorities;
4. current repository ownership and migration facts;
5. comparative evidence only for already accepted principles;
6. implementation convenience last.

Where the conceptual contract is sufficiently supported, decide. Defer exact field names, TypeScript interfaces, algorithms, storage engines, hash functions, byte formats, checkpoint counts, timers, UI layouts, and migration code.

Do not turn a current localStorage key, slot id, `sourceRunId`, character id, snapshot version, account-history record, or legacy difficulty flag into a new authority merely because it already exists.

## Mandatory Canonical Stakes Registry Decision

Retain exactly:

```text
Normal Stakes     -> normal_stakes
Committed Stakes  -> committed_stakes
Ironbound Stakes  -> ironbound_stakes
```

The decision must accept a conceptual Stakes policy registry that is:

- keyed by stable machine id;
- versioned independently from display labels;
- append-only or explicitly migrated;
- creation-locked in campaign identity;
- unavailable in production until all required owners are complete;
- descriptive of load topology, checkpoint selection, event-commitment posture, technical recovery, ordinary defeat persistence, actual/final death, resurrection policy, closure, and warnings;
- consumed by save/campaign owners rather than UI text or legacy difficulty.

The decision must decide the target campaign-rules semantic version needed to add Committed and Ironbound to the previously accepted version-1 Normal-only contract. Unless a fresh controlling contradiction exists, accept semantic campaign-rules version 2 while leaving exact runtime field placement deferred.

Legacy `RunDifficultyState`, `hardcore`, `hardcore_stakes`, `dead`, `hardcore_dead`, and combat-profile `hardcore` remain migration or historical inputs, not policy identities.

## Mandatory Identity Graph

Accept or explicitly refine this conceptual graph:

```text
account identity
  -> campaign identity
       -> authoritative continuity or timeline identity
            -> character identities active in that campaign history
            -> current continuation head
            -> user-visible save artifacts or selectable checkpoints
            -> hidden write/recovery generations
            -> correction and supersession lineage
```

The decision must define distinct authority for at least:

- account identity;
- campaign identity;
- continuity/timeline identity;
- character identity;
- save artifact identity;
- storage address or slot identity;
- checkpoint identity;
- continuation-head identity or revision;
- technical write/recovery generation identity;
- policy and semantic-version identity;
- correction/supersession identity;
- terminal closure identity.

Required boundaries:

- account identity is not campaign identity;
- campaign identity is not character identity;
- a successor may continue a campaign without becoming the prior character;
- a storage slot/key is an address, not the saved state’s causal identity;
- snapshot version is format compatibility, not campaign or continuity identity;
- checkpoint identity is not a write generation;
- technical recovery generation is not a player-selectable historical checkpoint;
- copying bytes or moving an envelope cannot mint a new campaign, continuity, checkpoint, closure, or reward identity;
- account history and UI metadata are projections and indexes, not the source of campaign state.

The decision must select the canonical semantic labels for `campaign` versus legacy `run` and for `continuity` versus `timeline`. Compatibility aliases may be retained, but the target conceptual vocabulary must not remain ambiguous.

## Save Artifact And Generation Taxonomy

Distinguish at minimum:

1. **Normal user save artifact** — player-addressable manual or quick-save state under permissive rollback.
2. **Committed selectable checkpoint** — owner-qualified rollback boundary with stable checkpoint provenance.
3. **Committed continuation head** — latest authoritative session-resume state; it may be newer than the last selectable checkpoint and is not automatically selectable as rollback history.
4. **Ironbound continuation head** — sole player-continuable authoritative state.
5. **Technical recovery generation** — hidden verified generation used only after persistence failure.
6. **Correction artifact or generation** — explicitly authorized replacement with retained cause and supersession lineage.

A snapshot is the captured authoritative domain state within an artifact or generation. It is not the whole save-policy identity by itself.

The decision must determine which artifact classes are player-visible, selectable, overwriteable, retainable, retired, hidden, or projection-only. It must not select exact schemas or storage paths.

## Minimum Campaign/Save Provenance

Every later authoritative artifact or generation must conceptually retain or resolve:

- account, campaign, continuity/timeline, and relevant character identity;
- selected Difficulty, World Rules, Stakes id, semantic rules version, and policy version;
- artifact kind and stable identity;
- parent/source artifact, checkpoint, or continuation-head identity where applicable;
- storage address as a separate projection;
- capture tick/order and source/reason;
- snapshot/content/format compatibility versions;
- qualifying-boundary receipt for a selectable Committed checkpoint;
- continuation-head revision;
- write/recovery generation and verification posture;
- current, superseded, invalid, corrupt, incompatible, retired, or closed posture as appropriate;
- correction authority, reason, and lineage;
- terminal closure or checkpoint-retirement relationship where applicable;
- downstream receipts or account-side consequences already consumed where needed for idempotency.

The decision must define which facts are authoritative, derived, indexed, or display-only.

## Normal Stakes Topology

Retain the accepted Normal semantics:

- ordinary manual and quick-save classes exist;
- broad player-selected rollback is permitted;
- ordinary defeat does not force a save;
- the generic fallback remains in-session and unsaved unless the player later saves;
- an active legacy HP-zero repair may persist to the loaded slot under its accepted exception;
- no general event commitment is imposed, though narrower already-committed owner facts remain authoritative.

The current 128-slot count and localStorage layout are implementation facts, not durable policy canon.

The decision must define Normal branch/timeline behavior:

- loading an earlier artifact abandons the later active-play timeline when play diverges;
- saving after divergence cannot let both branches claim the same irreversible account, estate, achievement, closure, or successor value;
- a copied slot/address is not a new campaign or timeline by itself;
- byte-for-byte duplication does not duplicate receipts or settlement entitlement;
- current and abandoned timeline provenance remains sufficient to reject stale account-side value;
- personal or locked narrative projections may be retained as explicitly non-authoritative text according to the narrative decision.

Decide when a new continuity/timeline identity is conceptually created: at load selection, at first divergent accepted mutation, at save, or another precise boundary. Do not leave branch identity undefined.

## Committed Stakes Topology

Committed must distinguish session continuation from selectable rollback.

Accept or explicitly refine:

```text
latest authoritative continuation head
  -> used for ordinary quit/restart continuation

retained qualifying checkpoints
  -> the only player-selectable rollback states

hidden verified recovery generations
  -> used only for technical failure
```

Required conclusions:

- quitting outside a qualifying checkpoint may persist the continuation head without creating a new selectable checkpoint;
- save-and-exit is not a loophole for free checkpoint creation;
- an explicit save request outside a qualifying boundary cannot manufacture a selectable branch;
- selecting an earlier checkpoint abandons the later active timeline but preserves committed outcome identities for materially identical causes;
- final closure atomically retires or makes ineligible the pre-closure checkpoint ladder before terminal settlement becomes durable;
- copied checkpoint bytes cannot escape checkpoint retirement or create extra rollback choices;
- checkpoint selection cannot reach across account, campaign, continuity, policy, or incompatible version boundaries.

The decision must accept the minimum qualifying-checkpoint authority. Unless contradicted by live owners, include:

1. campaign creation/start;
2. successful completion of a qualifying major sleep or secure-rest transaction accepted by the rest/time owner;
3. an explicit authored milestone or transition emitted by an owner-approved checkpoint-boundary registry.

Merely opening a rest screen, beginning sleep, entering a menu, changing UI state, or requesting a save is not a checkpoint boundary.

Exact cadence, rest duration, retention count, pruning, labels, and UI remain deferred. The conceptual creation, qualification, selectability, and retirement rules must be decided.

## Ironbound Stakes Topology

Retain:

- one authoritative campaign continuity;
- no player-selected historical rollback;
- continuation from the latest authoritative head;
- committed accepted commands and named uncertain results under the later commitment contract;
- hidden latest-verified technical recovery only;
- actual death, final death, and terminal character closure atomically committed;
- no resurrection after accepted actual death;
- read-only historical access after closure.

The decision must define:

- the difference between the player-continuable head and hidden prior verified generations;
- how a save-and-exit request forces or confirms the latest head without creating rollback;
- how copied or stale generations are recognized as the same or superseded continuity rather than independent active campaigns;
- how a verified terminal closure prevents older copied material from reopening the character;
- how latest-verified recovery preserves closure when the newest valid generation contains it;
- how an invalid/incomplete newest write falls back only to the newest valid authoritative generation, not a favorable choice.

Exact autosave cadence and storage mechanism remain deferred.

## Technical Recovery Contract

Technical recovery must be accepted as a save-owner function, not a UI or Stakes loophole.

Required conceptual write sequence:

```text
prepare candidate generation
  -> validate identity, compatibility, and authoritative state
  -> durably write candidate
  -> verify candidate
  -> publish it as the current head or artifact revision
  -> retain or retire prior verified generation according to policy
  -> update projections/indexes idempotently
```

Required invariants:

- the last verified authoritative generation remains recoverable until the replacement is verified;
- a failed or partial write cannot destroy the last verified state;
- UI cannot report success before the authoritative write is accepted;
- an account-profile/index update cannot make an absent or failed save authoritative;
- a projection failure after an accepted save is repairable without rewriting gameplay truth;
- recovery selects the newest valid generation within the same account/campaign/continuity/policy boundary;
- recovery provenance records the failed/current generation, selected source, reason, policy/version, and correction lineage where later implementation supports it;
- corrupt, incompatible, invalid, superseded, retired, and closed are distinct postures;
- technical recovery is not resurrection, timeline rollback, checkpoint selection, correction, or account settlement;
- no storage, journal, hash, checksum, canonicalization, locking, or transaction library is selected here.

The decision must address current cross-store ordering between save artifacts and account-profile/history projections without making localStorage, account profile, or UI the final architecture.

## Legacy And Current-Save Migration

Accept these invariants unless a fresh contradiction exists:

- every current or legacy active campaign migrates to Normal Stakes, never Committed or Ironbound by inference;
- legacy `easy | normal | hard | brutal` and `hardcore` follow the accepted campaign-rules migration and retain explicit provenance;
- legacy `hardcore: true` does not select Ironbound and does not preserve automatic terminal HP-zero archival;
- historical archived/deleted/dead/hardcore-dead records remain historical and blocked according to accepted account-history rules;
- current slot addresses and metadata may be retained as compatibility projections without becoming campaign identity;
- current `sourceRunId` may be consumed as migration evidence but cannot remain an ambiguous universal id;
- a migration creates or records accepted campaign/continuity identity exactly once;
- failed migration preserves recoverable source data and does not enter ordinary play;
- migration does not destroy the old verified artifact before the new artifact is validated;
- active legacy HP-zero repair occurs through the accepted Normal fallback and same-slot repair boundary after campaign identity migration;
- no existing campaign is silently upgraded to a new Stakes tier because its legacy settings resemble one.

The decision must state whether semantic campaign-rules version 1 remains readable migration input and version 2 becomes the target authority.

## Copied, Stale, Closed, And Duplicate State Protection

The decision must accept conceptual handling for:

- the same artifact copied to another storage address;
- the same checkpoint or generation duplicated byte-for-byte;
- a stale Normal branch saved after a different branch settled value;
- a Committed checkpoint copied before final closure and loaded after checkpoint retirement;
- an Ironbound prior generation copied before death and loaded after terminal closure;
- a closed or archived character’s old save discovered under a new slot key;
- account/profile history temporarily missing or stale relative to a verified save;
- save metadata disagreeing with snapshot authority;
- correction replacing invalid state without duplicating side effects.

Required principles:

- identity and consumed receipts, not storage location, determine duplication;
- raw copies cannot mint entitlement;
- terminal closure and consumed settlement evidence survive reload and copied-state discovery;
- Normal branch abandonment cannot retain later irreversible account value;
- Committed checkpoint retirement cannot be bypassed through copied bytes;
- Ironbound closure cannot be reopened through an older generation;
- stale projections are repaired from authority where safe, but projections do not overwrite newer verified gameplay truth;
- exact cryptographic, platform, cloud-sync, or anti-tamper mechanisms remain implementation decisions.

## Boundary With Occurrence Commitment

This decision owns the campaign/save/checkpoint identity and provenance needed by later event commitment.

It may accept placeholders or required links for:

- occurrence identity;
- uncertainty-channel identity;
- accepted result identity;
- material-input normalization version;
- correction/supersession lineage;
- consumed consequence ids.

It must not decide:

- the event semantic-normalization algorithm;
- uncertainty-channel catalog;
- random algorithm, seed derivation, or hash;
- domain-specific replay equivalence;
- committed result storage shape;
- correction authorization for every owner.

The next recommended route should be:

`Occurrence Identity, Named Uncertainty Channels, Outcome Commitment, And Correction Contract Decision`

unless the repository proves a narrower prerequisite is required.

## Consumer And Authority Boundaries

The decision must preserve:

- domain snapshots as authoritative gameplay state;
- campaign/save authority as owner of artifact selection, provenance, validation, and recovery;
- account profile/history, slot summaries, Chronicle, achievements, estate, Prestige, and UI as consumers or separately owned transactions;
- terminal settlement only after the accepted final-closure authority;
- narrative and Manuscript as projections;
- legacy difficulty and UI labels as migration/presentation inputs only.

A save manager cannot author death, injury, resurrection, rewards, successor eligibility, or narrative facts. Account history cannot retroactively invent gameplay state. A checkpoint boundary owner cannot write saves directly without the save owner accepting the artifact.

## Required Conclusions

The decision must answer at least:

1. What is the target semantic campaign-rules version?
2. What owns the three Stakes policy registry?
3. What are the canonical account, campaign, continuity/timeline, character, artifact, checkpoint, generation, correction, and closure identities?
4. Which `campaign`/`run` and `continuity`/`timeline` labels are canonical?
5. Which current fields are migration inputs, projections, or compatibility aliases?
6. What minimum provenance must every authoritative artifact retain?
7. What distinguishes a slot/address, artifact, snapshot, checkpoint, continuation head, and technical generation?
8. When does Normal create a new branch/continuity identity?
9. How are abandoned Normal timelines prevented from retaining durable value?
10. What is a Committed continuation head?
11. What is a Committed selectable checkpoint?
12. Which minimum boundary classes can qualify a checkpoint?
13. Can save-and-exit create a selectable checkpoint?
14. How is the Committed checkpoint ladder retired at final closure?
15. What is the Ironbound player-continuable head?
16. What hidden generations may Ironbound retain for recovery?
17. How is latest verified state selected?
18. What write and verification sequence prevents partial-loss failure?
19. What is authoritative when save and account-profile projections disagree?
20. How are corrupt, incompatible, invalid, superseded, retired, and closed states distinguished?
21. How do current/legacy saves migrate to Normal?
22. How is legacy Hardcore disposed?
23. How are current slots and `sourceRunId` treated?
24. How are copied artifacts and generations detected conceptually?
25. How do copied Committed checkpoints fail after retirement?
26. How do copied Ironbound generations fail after closure?
27. How is duplicate settlement prevented across branches and copies?
28. What source links are reserved for later occurrence commitment?
29. Which existing authorities are retained, narrowed, or superseded?
30. What implementation package order follows?
31. What remains implementation-only?
32. What is the next recommended route?

## Required Decision Artifact

Create:

`docs/design/stakes-identity-campaign-save-provenance-checkpoint-topology-and-technical-recovery-contract-decision.md`

It must contain:

1. status, scope, and source verification;
2. executive decision;
3. accepted vocabulary;
4. authority precedence and supersession;
5. Stakes policy registry and semantic version;
6. canonical identity graph;
7. live baseline and migration classification;
8. artifact, snapshot, checkpoint, head, and generation taxonomy;
9. minimum provenance contract;
10. Normal topology and branch identity;
11. Committed continuation-head contract;
12. Committed checkpoint qualification and selectability;
13. Committed checkpoint retirement;
14. Ironbound continuation and hidden-generation contract;
15. technical-recovery owner graph;
16. write, verification, publication, and projection ordering;
17. partial-failure and latest-verified recovery;
18. account/save/index authority boundary;
19. legacy/current migration;
20. copied/stale/closed/duplicate-state protection;
21. account-value and terminal-settlement integration;
22. occurrence-commitment boundary;
23. consumer boundaries;
24. explicit retention/supersession matrix;
25. future implementation-package order without permission;
26. future test and validation matrix;
27. temporary-evidence retention;
28. unresolved implementation questions;
29. explicit non-decisions;
30. answers to all required conclusions;
31. next recommended route.

## Future Implementation-Order Requirement

The decision must recommend conceptual order without authorizing implementation. Test at least:

1. campaign-rules semantic version and Stakes policy registry;
2. account/campaign/continuity/character/artifact identity contracts;
3. save artifact envelope and provenance contracts;
4. legacy/current migration and Normal-only mapping;
5. Normal slot/address adapter and branch lineage;
6. write-generation, verification, publication, and projection ordering;
7. hidden technical-recovery generation handling;
8. Committed continuation-head persistence;
9. checkpoint-boundary registry and qualifying rest/milestone adapters;
10. Committed checkpoint selection, abandonment, and retirement;
11. Ironbound continuation-head and copied-generation protection;
12. account-history/index repair and copied-slot blocking;
13. occurrence/uncertainty commitment contract;
14. later Mortal Crisis, death/body, closure, settlement, and narrative consumers;
15. migrations, UI, tests, storage implementation, and production availability only after separate authorization.

Do not assign a release version, package path, exact interface, field layout, storage engine, library, or implementation prompt.

## Future Test Matrix Requirement

Require future non-canonical fixtures for at least:

### Registry and identity

- all three Stakes ids and semantic versioning;
- labels changed without changing machine identity;
- campaign distinct from account and character;
- successor character within one campaign;
- slot/address distinct from artifact identity;
- checkpoint distinct from write generation;
- snapshot format version distinct from campaign policy version.

### Normal

- manual and quick-save artifacts;
- load earlier save and diverge at the accepted branch boundary;
- abandoned later timeline loses durable account value;
- same snapshot copied to another slot does not duplicate identity or rewards;
- ordinary defeat remains unsaved unless later saved;
- active legacy HP-zero same-slot repair remains idempotent.

### Committed

- campaign-start qualifying checkpoint;
- completed qualifying major sleep checkpoint;
- explicit authored milestone checkpoint;
- save request outside qualifying boundary rejected as checkpoint creation;
- save-and-exit updates continuation head but not selectable checkpoint;
- continuation head newer than last selectable checkpoint;
- selecting earlier checkpoint abandons later timeline while committed results remain linked;
- final closure retires the checkpoint ladder before settlement;
- copied checkpoint cannot bypass retirement.

### Ironbound

- one player-continuable head;
- no selectable historical state;
- hidden prior verified generation used only after invalid newest write;
- save-and-exit creates no rollback choice;
- copied older generation cannot reopen after terminal closure;
- recovery preserves latest verified terminal closure;
- incomplete newest generation falls back to latest valid, not favorable, state.

### Write and recovery

- candidate write fails before verification and old generation remains current;
- candidate verifies but account index update fails and is later repaired;
- UI never reports success before accepted publication;
- corrupt versus incompatible versus invalid distinction;
- projection metadata disagrees with snapshot and authority wins;
- recovery remains within account/campaign/continuity/policy boundary;
- correction retains supersession lineage and does not duplicate consequences.

### Migration and copies

- legacy easy/normal/hard/brutal mapping;
- legacy Hardcore maps to Normal with provenance;
- no existing save auto-selects Committed or Ironbound;
- current slot and `sourceRunId` preserved only as migration/projection facts;
- archived/deleted history remains blocked;
- failed migration preserves source data;
- duplicate bytes under another key do not mint entitlement;
- stale Normal, Committed, and Ironbound material cannot duplicate settlement.

## Coordination Updates

### `docs/dev/current-codex-output.md`

Replace with a detailed completion summary including:

- run identity and classification;
- date, branch, starting/ending pre-edit commits, and repository state;
- exact changed paths;
- pinned source verification;
- accepted semantic version and registry;
- accepted identity graph and canonical vocabulary;
- artifact/checkpoint/head/generation taxonomy;
- Normal, Committed, and Ironbound topology decisions;
- technical-recovery and write-order decisions;
- migration and copied-state decisions;
- authority retention/supersession;
- unresolved implementation questions;
- checks, risks, held routes, suggested commit, and next route.

### `docs/dev/current-gpt-handoff.md`

Update to:

- mark this contract decision complete and controlling;
- add the new artifact and exact blob;
- preserve the Mortal Crisis/Stakes authority as controlling gameplay/finality authority;
- record semantic version, registry, identity graph, provenance, per-tier topology, recovery, migration, and copied-state boundaries;
- recommend `Occurrence Identity, Named Uncertainty Channels, Outcome Commitment, And Correction Contract Decision` next unless a narrower prerequisite is found;
- preserve held `0.6.6`, retained `0.6.7`, and implementation prohibition;
- state that no next prompt was installed by the completed decision.

### `docs/dev/historical-version-and-deferred-route-register.md`

Update only materially affected rows:

- mark this contract decision complete design authority;
- add the decision artifact to history;
- update Difficulty/World/Stakes, Ironbound, Generic command delivery/replay, and directly dependent routes;
- advance the next route to the occurrence/uncertainty commitment contract;
- preserve unrelated history, held `0.6.6`, and retained `0.6.7`.

## Temporary Evidence Retention

Retain:

- comparative mortality research through checkpoint, commitment, crisis, resurrection, settlement, and succession implementation consumers;
- the defeat/injury audit through the first relevant runtime replacement/repair package;
- the completed Mortal Crisis/Stakes authority permanently as controlling design authority;
- narrative and elemental evidence for their named consumers.

Do not delete temporary evidence in this run.

## Authorized Output

On successful completion, modify exactly:

1. create `docs/design/stakes-identity-campaign-save-provenance-checkpoint-topology-and-technical-recovery-contract-decision.md`;
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
- schemas;
- validators;
- package manifests or lockfiles;
- dependencies;
- persistence code;
- save manager or run lifecycle;
- saves or migrations;
- account profile/history;
- tests;
- UI;
- content;
- generated files;
- gameplay.

Do not:

- implement the Stakes registry, campaign rules, save artifacts, checkpoints, continuation heads, journals, generations, integrity, technical recovery, migrations, UI, or tests;
- accept exact TypeScript names, field layouts, package paths, storage keys, slot counts, checkpoint counts, retention values, byte formats, hashes, checksums, canonicalization, locking, algorithms, or libraries;
- add a persistence, database, journal, transaction, random, serialization, cloud, cryptographic, or other dependency;
- treat localStorage or bare JSON as the final architecture;
- treat slot id, storage key, character id, account-history record, snapshot version, `sourceRunId`, or legacy difficulty as canonical campaign/continuity identity;
- make account profile, slot metadata, UI, Chronicle, or Manuscript authoritative gameplay state;
- let save code resolve death, injury, resurrection, Prestige, estate, achievements, successor selection, or rewards;
- allow legacy Hardcore to select Ironbound;
- expose Committed or Ironbound in production;
- let save-and-exit create a free Committed checkpoint;
- let hidden recovery generations become a rollback menu;
- let copied bytes mint campaign identity, checkpoints, closure, or value;
- reopen closed Ironbound state through an older generation;
- pay terminal value from an abandoned Normal timeline or unretired Committed ladder;
- decide occurrence normalization, uncertainty channels, RNG algorithms, or domain replay equivalence;
- restore `0.6.6`;
- assign a release version;
- create an implementation prompt.

## Stop Conditions

Stop after the exact four documentation outputs.

If a controlling pin fails, update only `docs/dev/current-codex-output.md` with the contradiction and stop.

If the live save system has materially changed beyond the pinned baseline, determine whether the new state is compatible. Continue only when ownership and migration conclusions remain valid; otherwise record the blocking contradiction in current output and stop.

The semantic campaign-rules version, canonical identity graph, Normal branch boundary, Committed continuation-head/checkpoint distinction, minimum checkpoint qualifiers, Ironbound generation boundary, technical-recovery write ordering, migration posture, and copied-state protections must not remain deferred. Exact implementation details remain deferred.

Report the ending commit, exact changed paths, accepted semantic version and registry, identity graph, per-tier topology, recovery and migration contracts, retained/superseded authorities, unresolved implementation questions, temporary-evidence posture, held-route status, and next recommended route.
