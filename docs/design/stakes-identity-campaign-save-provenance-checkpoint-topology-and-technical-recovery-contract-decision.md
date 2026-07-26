# Stakes Identity, Campaign/Save Provenance, Checkpoint Topology, And Technical-Recovery Contract Decision

Date: 2026-07-25

Run: `Stakes Identity, Campaign/Save Provenance, Checkpoint Topology, And Technical-Recovery Contract Decision`

Classification: unversioned durable documentation-only contract decision

Status: accepted design authority; implementation remains unauthorized

Milestone impact: `supports_current_band`

## 1. Status, Scope, And Source Verification

This decision accepts the smallest durable save-side contract needed by the already accepted Normal, Committed, and Ironbound Stakes authority. It establishes conceptual identity, provenance, topology, migration, write/recovery, copied-state, and consumer boundaries. It does not implement them.

Repository verification:

- branch: `master`;
- upstream: `origin/master`;
- starting and ending pre-edit commit: `8a67597143798841b53c4857e5ccd5dae5acb923`;
- pre-edit worktree: clean;
- `HEAD` and `origin/master`: synchronized after fetch/prune;
- completed Mortal Crisis/Stakes commit `b55b9d5e2656d62644251c289038aa19f5eebe7f` is an ancestor of `HEAD`;
- every pinned authority, evidence, coordination, live-source, and held-route blob matched exactly;
- no pinned live save-system source changed after the baseline;
- held `Version 0.6.6` remains available as blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

The live repository was inspected as migration evidence, not target architecture. It currently has account-scoped manual and quick-save addresses, one bare-JSON snapshot envelope per address, separate account-profile persistence, legacy difficulty/Hardcore fields, and terminal HP-zero archival. It has no accepted campaign, continuity, artifact, checkpoint, generation, closure, or correction identity graph.

## 2. Executive Decision

The accepted Stakes registry remains exactly:

```text
Normal Stakes     -> normal_stakes
Committed Stakes  -> committed_stakes
Ironbound Stakes  -> ironbound_stakes
```

The target campaign-rules semantic version is **2**. Version 1 remains readable migration input and contains only the accepted Normal-era contract. Version 2 adds the three-entry Stakes registry and the provenance/topology boundaries accepted here. The Stakes registry’s initial semantic policy revision is **1**, versioned independently from display labels and snapshot format.

Canonical authority vocabulary is:

- **campaign**, not legacy `run`, for the durable playable world/history identity;
- **continuity**, not `timeline`, for one authoritative or selected playable history chain;
- **timeline** only as descriptive language for a continuity lineage or an abandoned branch;
- **run record** only as a compatibility/account-history projection of a character’s participation, never campaign identity.

The identity graph is:

```text
account
  -> campaign
       -> continuity
            -> character identities
            -> current continuation head
            -> save artifacts or selectable checkpoints
            -> hidden write/recovery generations
            -> correction/supersession lineage
       -> closure, checkpoint-retirement, and consumed-value authority
```

A storage address points to an artifact. A snapshot is captured gameplay state within an artifact or generation. A checkpoint is an owner-qualified selectable boundary. A continuation head is the latest authoritative resume state. A write generation is a hidden persistence attempt/revision. None is interchangeable.

Normal forks a new child continuity at the **first accepted gameplay mutation after loading an earlier artifact whose state is not the current continuation head**. Selection/load alone does not fork. Committed uses the same mutation boundary after selecting an earlier checkpoint, while retaining later occurrence-commitment links. Ironbound never permits a player-created branch.

Technical recovery is a save-owner operation that selects the newest verified compatible generation inside the same account/campaign/continuity/policy boundary. It is not checkpoint selection, chosen rollback, correction, resurrection, or settlement.

## 3. Accepted Vocabulary

| Term | Accepted meaning |
| --- | --- |
| Stakes policy registry | Campaign/save-owned semantic policies keyed by stable Stakes machine id. |
| campaign-rules semantic version | Version of the campaign identity/policy contract; target version 2. |
| Stakes policy revision | Semantic revision of the registry entries; initial accepted revision 1. |
| account identity | Owner of credentials/profile/account-scoped ledgers; not a campaign. |
| campaign identity | Stable identity of one durable playable world/history. |
| continuity identity | Stable identity of one authoritative or selected playable history chain within a campaign. |
| continuity lineage | Parent/child relation among forked or superseded continuities. |
| character identity | Stable identity of one character; multiple characters may participate in one campaign. |
| storage address | Platform/store locator such as a slot or key; never causal identity. |
| save artifact | Stable identity-bearing accepted save envelope/capture exposed or retained under a Stakes policy. |
| snapshot | Captured authoritative domain state inside an artifact or generation. |
| selectable checkpoint | Owner-qualified Committed rollback artifact. |
| continuation head | Latest authoritative state used for ordinary session resume. |
| head revision | Monotonic or otherwise ordered accepted change to a continuation head. |
| write generation | Hidden candidate/verified persistence revision used to publish an artifact or head. |
| recovery generation | Prior verified hidden generation retained solely for technical recovery. |
| correction | Authorized replacement of invalid authority with explicit cause and lineage. |
| closure identity | Stable idempotency identity for terminal character closure. |
| retirement | Valid artifact/checkpoint intentionally made ineligible for selection. |
| projection/index | Derived metadata or lookup surface that can be repaired from authority. |

## 4. Authority Precedence And Supersession

This decision is now the most specific authority for:

- campaign-rules semantic version 2;
- the Stakes policy registry contract;
- canonical campaign/save identity and provenance;
- Normal branch creation;
- Committed head/checkpoint qualification, selection, and retirement;
- Ironbound head/recovery-generation separation;
- technical write/recovery ordering;
- legacy/current migration;
- copied/stale/closed-state protection;
- save/account/index authority.

The Mortal Crisis/Stakes decision remains controlling for gameplay, actual/final death, resurrection-per-tier, closure-before-settlement, and warnings. Campaign, Normal fallback, restricted-Stakes, injury, narrative, and elemental decisions remain controlling outside the save-side seams explicitly narrowed here.

This decision supersedes:

- the campaign-rules version-1 Normal-only target as the final semantic target; version 1 becomes readable migration input;
- deferral of campaign/continuity/artifact/checkpoint/generation identity;
- any treatment of a slot, storage key, snapshot version, character id, `sourceRunId`, history record, or legacy difficulty as campaign identity;
- any implication that a save write is accepted before verification/publication;
- any implication that copied bytes can evade branch abandonment, checkpoint retirement, closure, or consumed-value evidence.

It does not supersede existing live code. That code remains an implementation baseline and known gap until a separately authorized package replaces it.

## 5. Stakes Policy Registry And Semantic Version

Campaign/save authority owns a conceptual registry keyed by:

```text
normal_stakes
committed_stakes
ironbound_stakes
```

The registry:

- belongs to campaign/save policy authority, not UI, Difficulty, World Rules, or legacy difficulty;
- is creation-locked in campaign identity;
- is append-only or explicitly migrated;
- has semantic policy revision 1 for this accepted three-policy set;
- is consumed with campaign-rules semantic version 2;
- versions display/localization labels separately;
- defines load topology, selectable artifacts, event-commitment posture, technical recovery, defeat persistence, actual/final death, resurrection, closure, and warnings;
- keeps Committed and Ironbound unavailable until every required owner is implemented and validated.

Campaign-rules version 1 remains readable source material. Version 2 is the only target authority for new or migrated target-form campaigns. Exact runtime field placement and serialized representation remain deferred.

Legacy `RunDifficultyState`, `hardcore`, `hardcore_stakes`, `dead`, `hardcore_dead`, and combat-profile `hardcore` are migration or historical inputs only.

## 6. Canonical Identity Graph

### Account identity

Account authority establishes the account. It owns account-scoped credentials, profile, and separate account ledgers. It does not establish campaign gameplay history.

### Campaign identity

Campaign/save authority establishes one campaign at creation or exactly once during migration. It persists across character death, resurrection, successor participation, ordinary save copies, and storage relocation.

### Continuity identity

Campaign/save authority establishes the initial continuity with campaign creation/migration. A continuity is one selected playable causal history. Normal and Committed may create child continuities at the accepted divergence boundary. Ironbound has one non-player-forkable continuity.

### Character identity

Character authority establishes each character. A successor is a new character identity in the same campaign and may continue the same authoritative continuity after closure/settlement ordering. A character id is not a campaign or continuity id.

### Artifact, checkpoint, head, and generation identity

Save authority establishes artifacts, checkpoints, heads, and write/recovery generations. Storage binds addresses to those identities but cannot mint them.

### Correction and closure identity

The authorized correction owner establishes correction/supersession identity. Final-closure authority establishes closure identity. Campaign/save authority records their relation to artifacts, continuities, checkpoint retirement, and consumed consequences without authoring the underlying gameplay facts.

## 7. Live Baseline And Migration Classification

| Current seam | Current fact | Target classification |
| --- | --- | --- |
| manual/quick slot ids | 128 manual addresses and one quick-save address | storage/UI addresses and compatibility projections |
| localStorage keys | account/slot-addressed envelopes | storage addresses, not final architecture |
| version-6 envelope | account, slot, metadata, time, serialized snapshot | migration source envelope |
| `SaveSnapshot.accountId` | account association | valid account evidence, insufficient campaign identity |
| `snapshotVersion` | current format compatibility | format version only |
| `capturedAtTick` | capture ordering evidence | provenance input, insufficient head revision |
| `RunDifficultyState` | `easy|normal|hard|brutal` plus `hardcore` | legacy campaign-rules migration input |
| `sourceRunId` | optional lineage/account source linkage | scoped migration evidence/compatibility alias |
| history `saveSlotIds` | indexes by current addresses | projection/index only |
| `dead`/`hardcore_dead` | historical archive reasons | retained history, not Stakes identity |
| account payout/estate receipts | current idempotency evidence | consumer transactions requiring future campaign/continuity/closure links |
| bare JSON serialization | no integrity/generation contract | implementation baseline, not accepted architecture |
| HP-zero archival/deletion | current live behavior | known defect; never target authority |

Current package ownership remains useful: shared types describe state, persistence serializes, the game engine captures snapshots, the UI save manager binds storage addresses, and account/run-lifecycle owners project/settle other concerns. No current file alone owns the future contract.

## 8. Artifact, Snapshot, Checkpoint, Head, And Generation Taxonomy

| Class | Visible | Player-selectable | Overwrite/retention posture | Authority |
| --- | --- | --- | --- | --- |
| Normal manual save artifact | yes | yes | address may be rebound; each accepted capture has artifact identity/revision; retention is player/save policy | save authority |
| Normal quick-save artifact | yes | yes | quick address may be rebound; prior capture may retire | save authority |
| Committed selectable checkpoint | yes | yes | never created by arbitrary overwrite; retained/pruned/retired by policy | save plus qualified boundary receipt |
| Committed continuation head | visible as Continue/status | continuable, not selectable as rollback history | revised as accepted play advances; may be newer than checkpoints | save authority |
| Ironbound continuation head | visible as Continue/status | sole continuable state | revised in the one continuity | save authority |
| technical recovery generation | hidden | no | prior verified generations retained/retired only for failure recovery | save authority |
| correction artifact/generation | notice may be projected | no ordinary selection | explicitly supersedes invalid authority with cause/lineage | correction plus save authority |

A snapshot is the gameplay payload captured by one of these classes. It does not by itself establish artifact kind, checkpoint qualification, selectability, head status, generation order, policy, closure, or correction.

A storage address may be rebound to a new artifact. Rebinding never causes the new artifact to inherit the old artifact’s causal identity merely because the slot label is unchanged.

## 9. Minimum Provenance Contract

Every authoritative artifact or generation must retain or deterministically resolve:

- account identity;
- campaign identity;
- continuity identity and parent continuity where applicable;
- relevant character identity or identities;
- Difficulty, World Rules, Stakes id, campaign-rules semantic version, and Stakes policy revision;
- artifact/generation kind and stable identity;
- parent/source artifact, checkpoint, or head identity where applicable;
- separate storage-address binding;
- capture tick/order and accepted source/reason;
- snapshot, content, and format compatibility versions;
- qualifying-boundary receipt for a Committed checkpoint;
- continuation-head identity and revision;
- write/recovery generation identity, ordering, and verification posture;
- current, superseded, invalid, corrupt, incompatible, retired, or closed posture;
- correction authority, cause, and supersession lineage;
- closure and checkpoint-retirement links;
- applied/consumed downstream receipt identities needed for idempotency;
- later occurrence/result/correction link reservations.

Exact field names, nesting, ids, serialization, storage, and derivation mechanisms remain deferred.

### Authority classification

Authoritative:

- campaign/continuity/character identity;
- selected policy/version;
- artifact kind/identity and snapshot;
- head/checkpoint/generation order and posture;
- qualification, correction, retirement, closure, and consumed-receipt links.

Derived/indexed:

- storage-address lookup;
- slot/checkpoint lists;
- “latest” summaries;
- account-history links;
- availability summaries and repair queues.

Display-only:

- localized labels;
- character/region/funds/date summaries;
- formatted timestamps;
- warning prose;
- Chronicle/Manuscript projections.

## 10. Normal Topology And Branch Identity

Normal retains:

- ordinary manual and quick-save artifact classes;
- broad selected rollback;
- no save forced by ordinary defeat;
- in-session unsaved generic fallback;
- the active legacy HP-zero same-slot repair exception;
- no general event commitment.

The current slot count and localStorage layout are not policy canon.

### Branch boundary

Loading an artifact only selects a candidate playable state. It does not immediately mint a new continuity because the player may inspect and exit without changing gameplay.

A new child continuity is created at the **first accepted authoritative gameplay mutation** after loading an earlier artifact that is not the current head of the selected continuity. The mutation receipt binds:

- parent campaign and continuity;
- source artifact/head;
- divergence order;
- new child continuity;
- the previously current later continuity as abandoned/superseded for active play.

Loading the current head and continuing does not fork. Saving is not the fork boundary; a save only captures the continuity already continued or created by mutation.

### Abandonment and value

When a child continuity becomes active:

- later gameplay on the abandoned continuity is no longer current campaign truth;
- its provisional Chronicle/Manuscript projections are marked abandoned/non-authoritative or omitted;
- its settlement, estate, achievement, closure, and successor claims cannot be newly posted;
- already posted durable account value must be reconciled through the account owner’s accepted branch/consumed-receipt rule rather than silently retained.

Because Normal preserves rollback, irreversible account value from a closure remains provisional unless a separate accepted branch-finalization transaction retires conflicting rollback artifacts. This decision accepts no cross-timeline entitlement.

Byte copies and additional slot bindings retain the same artifact/continuity/receipt identities. They do not mint another campaign, branch, closure, or reward.

## 11. Committed Continuation-Head Contract

Committed has one latest authoritative continuation head per active continuity. It is:

- the ordinary quit/restart resume state;
- allowed to be newer than the last selectable checkpoint;
- revised when owner-approved persistence accepts progress;
- visible as continuation status;
- not a free selectable historical checkpoint.

Quitting outside a qualifying boundary may persist or confirm the head without creating a checkpoint. Save-and-exit likewise confirms the latest head and may require an immediate accepted write, but never creates rollback history.

Selecting an earlier qualifying checkpoint selects a historical state. A child continuity is created on the first accepted mutation after selection, using the Normal divergence boundary. Later occurrence-commitment contracts retain materially identical accepted results across the fork.

An explicit save request outside a qualifying boundary may request head persistence but cannot manufacture a checkpoint or branch.

## 12. Committed Checkpoint Qualification And Selectability

A selectable Committed checkpoint requires:

1. an eligible boundary class in the campaign/save-owned checkpoint-boundary registry;
2. an accepted boundary receipt from the domain owner;
3. a complete authoritative snapshot;
4. compatible campaign/continuity/policy identity;
5. successful write verification and checkpoint publication;
6. no retirement, closure, correction, or incompatibility blocker.

The minimum accepted boundary classes are:

1. campaign creation/start;
2. successful completion of a qualifying major sleep or secure-rest transaction accepted by the rest/time owner;
3. an explicit authored milestone or transition emitted by an owner-approved checkpoint-boundary registry.

Opening a rest screen, starting but not completing sleep, entering a menu, changing UI state, requesting a save, quitting, or save-and-exit is not qualification.

Exact rest duration, safety predicate, cadence, retention count, pruning, labels, and UI remain deferred.

Checkpoint selection cannot cross account, campaign, incompatible continuity lineage, Stakes policy, retired ladder, closure, or incompatible format/content boundaries.

## 13. Committed Checkpoint Retirement

Committed final closure uses one atomic logical transaction:

```text
verify final-closure authority
  -> bind stable closure identity to campaign/continuity
  -> retire every pre-closure selectable checkpoint in the affected ladder
  -> publish the closed continuation head
  -> verify closure + retirement publication
  -> permit terminal account settlement
```

If retirement or closed-head publication fails, terminal settlement remains unapplied. Recovery returns to the newest verified coherent pre-closure or closed transaction according to accepted transaction status; it never exposes a half-retired ladder.

Retirement is keyed by checkpoint/campaign/continuity/closure identity, not storage address. Copied checkpoint bytes remain retired wherever discovered. A copied pre-closure checkpoint cannot create a new campaign or escape the closure relation.

Pruning for ordinary retention and retirement for final closure are distinct. Pruning removes selectability under retention policy; closure retirement establishes terminal ineligibility and downstream-settlement ordering.

## 14. Ironbound Continuation And Hidden-Generation Contract

Ironbound has:

- one player-continuable authoritative head;
- no player-selectable historical artifact;
- no player-created continuity fork;
- hidden prior verified generations only for technical recovery;
- committed accepted commands/results under the later occurrence contract;
- atomic actual death/final death/closure;
- read-only history after closure.

The continuation head is the logical authoritative state. Hidden generations are persistence revisions supporting that head and are never load-menu choices.

Save-and-exit forces or confirms the latest accepted head, then exits only after the save owner reports publication success or an explicit failure. It does not create a slot or checkpoint.

Copied or stale generations retain campaign, continuity, head revision, generation order, and closure lineage. The authoritative campaign-control state recognizes them as same-continuity older material, not independent campaigns.

When the newest verified head includes terminal closure:

- older copied generations are closed/superseded for live play;
- recovery preserves the closed head when it is the newest valid generation;
- the character cannot reopen from a prior address or generation;
- missing or stale projections are repaired rather than used to erase closure.

If the newest attempted write is invalid or incomplete, recovery selects the newest prior verified authoritative generation. No player chooses among generations.

## 15. Technical-Recovery Owner Graph

```text
domain owners
  -> authoritative gameplay snapshot and accepted source receipts
campaign/save policy
  -> identity, artifact kind, head/checkpoint eligibility, provenance
persistence adapter
  -> candidate write and durable verification evidence
save authority
  -> publication, prior-generation retention, recovery selection
campaign control/closure authority
  -> current continuity, retirement, closure, consumed-receipt guards
account history / achievements / estate / Prestige / UI
  -> idempotent transactions or repairable projections
```

Save authority owns artifact selection, validation, publication, and recovery. Persistence technology supplies storage evidence but does not choose gameplay policy. UI requests operations and projects results; it cannot declare success or authority.

## 16. Write, Verification, Publication, And Projection Ordering

The accepted conceptual sequence is:

```text
1. prepare candidate generation
2. validate account/campaign/continuity/policy/artifact identity
3. validate snapshot and source receipts
4. durably write candidate
5. verify candidate
6. publish candidate as artifact revision or continuation head
7. verify publication
8. retain or retire the previous verified generation under policy
9. update indexes, metadata, account history, and UI projections idempotently
```

The prior verified authoritative generation remains recoverable until the replacement is verified and published. A failed candidate does not become current. UI success follows accepted publication, never an earlier storage call.

Terminal closure and settlement add:

```text
publish verified closure/retirement authority
  -> apply account/estate/achievement/Prestige transactions idempotently
  -> repair indexes and presentation
```

Account transactions have their own authoritative receipts. They cannot author gameplay state, and gameplay artifacts cannot silently re-pay an already consumed account transaction.

## 17. Partial Failure And Latest-Verified Recovery

Required behavior:

- write failure before verification leaves the prior verified generation current;
- verification failure marks the candidate invalid or corrupt and leaves prior authority current;
- publication failure leaves the candidate unpublished and noncontinuable;
- projection/index failure after publication queues repair without rolling back gameplay truth;
- account transaction failure after verified closure remains retryable by stable closure/transaction identity;
- account transaction success with stale save/profile projection remains consumed and is reconciled, never re-paid;
- technical recovery selects the highest accepted verified generation order within identical account/campaign/continuity/policy identity;
- recovery never crosses policy, campaign, continuity, incompatible version, retirement, or closure boundaries.

No storage engine, journal, lock, checksum, hash, canonicalization, transaction mechanism, or dependency is accepted.

### State postures

| Posture | Meaning |
| --- | --- |
| current | verified and published authoritative artifact/head revision |
| superseded | valid older artifact/generation replaced by newer authority |
| invalid | parseable but fails identity, semantic, source, or policy validation |
| corrupt | unreadable, incomplete, or fails future integrity verification |
| incompatible | valid source whose format/content/policy cannot be read or migrated by the current contract |
| retired | valid checkpoint/artifact intentionally no longer selectable |
| closed | valid terminal campaign/character authority; read-only where applicable |

These postures are not interchangeable. “Corrupt” is not a generic label for incompatible or retired data.

## 18. Account, Save, And Index Authority Boundary

Authoritative gameplay snapshot and campaign-control provenance win over slot metadata, account-history indexes, and UI summaries when they disagree and the authoritative state verifies.

Account-side reward, estate, achievement, Prestige, and entitlement ledgers remain separately authoritative for their transactions. They consume closure/consequence receipts but cannot reconstruct or rewrite gameplay.

Consequences:

- stale slot metadata is repaired from verified artifacts;
- a stale or missing history index does not invalidate a verified open save, but cannot override a verified closure;
- a profile/index update cannot make a failed or absent save authoritative;
- an authoritative account transaction receipt prevents duplicate payment even when a projection is missing;
- ambiguous disagreement between two purported authoritative campaign heads is quarantined for correction rather than resolved by timestamp, slot label, or UI preference;
- correction requires explicit authority and supersession lineage.

The current save-then-profile localStorage ordering is migration evidence only. The target contract orders authoritative save publication first, then idempotent consumer/index updates, without selecting a storage architecture.

## 19. Legacy And Current Migration

Campaign-rules semantic version 1 remains readable migration input. Version 2 is the target.

Every active current or legacy campaign:

- migrates to `normal_stakes`;
- never selects Committed or Ironbound by inference;
- maps legacy difficulty/World Rules under the accepted campaign-rules decision;
- records legacy tier and `hardcore` source provenance;
- treats `hardcore: true` as historical/migration evidence only;
- does not preserve terminal HP-zero archival or `deathZeroesPrestige`;
- receives one campaign identity and initial continuity identity exactly once;
- receives target artifact/provenance identity exactly once;
- retains current slot/address and metadata as compatibility projections;
- treats `sourceRunId` only as scoped lineage/migration evidence.

Migration is idempotent: a stable migration receipt binds the verified source artifact to the target campaign/continuity/artifact identities. Re-entry returns the already accepted result rather than minting identities again. Exact receipt shape and identity derivation are deferred.

Failed migration:

- preserves the original verified source data;
- does not publish a partial target;
- does not enter ordinary play;
- exposes a repairable incompatible/migration-failed posture;
- never deletes the source before target verification/publication.

Historical archived, deleted, `dead`, and `hardcore_dead` records remain historical and blocked under accepted account-history rules. They do not migrate into active campaigns.

Active legacy HP-zero repair order is:

```text
validate source and blocked-history posture
  -> migrate campaign rules and provenance to version 2 / Normal
  -> apply accepted Normal fallback repair
  -> verify and publish same-address target artifact
  -> retain migration/repair receipt idempotently
```

The same address is a compatibility binding, not preservation of old causal identity.

## 20. Copied, Stale, Closed, And Duplicate-State Protection

Identity and consumed receipts, not storage location, determine duplication.

### Copied artifact or generation

Byte-for-byte copies retain the same artifact, campaign, continuity, checkpoint/head, generation, closure, and consumed-receipt identities. A new slot/key is an additional address binding only.

A copy with altered identity/provenance that lacks an authorized migration/correction receipt is invalid or quarantined; it is not a new campaign.

### Stale Normal branch

An artifact from an abandoned continuity may be selected under Normal only if policy still permits it. On first mutation it creates a child continuity. It cannot retain or replay durable account value from another continuity. Closure/account receipts are checked by campaign/continuity lineage and consumed identity.

### Retired Committed checkpoint

A copied checkpoint whose stable identity appears in a verified retirement/closure set is retired at every address. It cannot be selected, rebound as a fresh checkpoint, or migrated into a new campaign merely to evade retirement.

### Closed Ironbound generation

An older Ironbound generation discovered after verified terminal closure remains superseded/closed for live play. The campaign-control closure identity and head lineage block reopening even when the copy appears under another address or its profile projection is stale.

### Missing or stale projections

Verified campaign/save authority repairs safe indexes and metadata. It does not allow stale projections to overwrite newer gameplay truth. If the authoritative campaign-control record needed to disambiguate competing heads or closure is missing, ordinary play stops for correction; the system does not guess from timestamp or address.

## 21. Account Value And Terminal Settlement Integration

Terminal settlement remains downstream of final closure.

Every terminal or durable account transaction conceptually links:

- account, campaign, continuity, character, and closure identity;
- source consequence/settlement identity;
- Stakes and semantic policy versions;
- consumed evidence and prior transaction identity;
- correction/supersession lineage.

Normal:

- abandoned timelines cannot newly post durable value;
- closure-derived value remains provisional while conflicting rollback artifacts remain selectable;
- durable posting requires a separately accepted branch-finalization/rollback-retirement boundary or another explicit account rule; none is implemented here.

Committed:

- final closure must retire the checkpoint ladder and publish the closed head before terminal settlement;
- copied retired checkpoints cannot re-open eligibility or re-pay settlement.

Ironbound:

- atomic closure publishes on the one continuity before settlement;
- older generations cannot re-open the character or re-pay value.

Exact settlement mechanics, rollback retirement UI, reversals, currencies, formulas, estate rules, achievements, and successor selection remain deferred to their owners.

## 22. Occurrence-Commitment Boundary

This decision reserves provenance links for:

- occurrence identity;
- named uncertainty-channel identity;
- accepted result identity;
- material-input normalization version;
- correction/supersession lineage;
- consumed consequence identities.

Campaign, continuity, artifact, checkpoint, head revision, generation, policy, and correction provenance supply the save-side context for later commitment. They do not define event semantic equivalence.

This decision does not choose:

- occurrence normalization;
- uncertainty-channel catalog;
- random algorithm or seed;
- hash or derivation;
- domain replay-equivalence rules;
- committed-result storage;
- per-owner correction authorization.

The next route is the focused occurrence/uncertainty commitment decision.

## 23. Consumer Boundaries

| Concern | Authority |
| --- | --- |
| gameplay state | domain owners captured in authoritative snapshot |
| Stakes registry/campaign/continuity | campaign/save policy owner |
| artifact/checkpoint/head selection | save owner |
| durable byte/storage operation | persistence adapter |
| qualification receipt | rest/time or authored milestone owner, accepted by checkpoint registry/save owner |
| technical recovery | save owner using persistence verification |
| final closure fact | death/closure authority |
| checkpoint retirement relation | save/campaign-control authority consuming closure |
| account reward/estate/Prestige/achievement | separate account transaction owners |
| account history/slot summaries | projections/indexes |
| Chronicle/Manuscript/UI | projections |
| correction | explicitly authorized owner plus save supersession |

Save code cannot author death, injury, resurrection, rewards, successor eligibility, narrative facts, or checkpoint qualification. Account history cannot retroactively invent gameplay. A boundary owner cannot write a checkpoint without save-owner validation/publication.

## 24. Retention And Supersession Matrix

| Existing authority or seam | Disposition | Exact result |
| --- | --- | --- |
| three Stakes ids/semantics | retained | Registry is Normal/Committed/Ironbound exactly. |
| campaign-rules version 1 | narrowed | Readable Normal-only migration input; version 2 is target authority. |
| creation locks/availability gates | retained | Ids do not expose Committed/Ironbound in production. |
| Normal manual/quick topology | retained | Addresses remain compatible; branch identity is accepted at first divergent mutation. |
| Normal no-forced-save defeat | retained | Generic defeat remains unsaved unless later saved; legacy repair exception remains. |
| Committed checkpoint direction | clarified | Head is distinct from selectable qualified checkpoint; minimum qualifiers accepted. |
| Committed final closure | clarified | Verified checkpoint retirement/closed head precedes settlement. |
| Ironbound one continuity/no rollback | retained | One continuable head; hidden generations are recovery-only. |
| Ironbound terminal closure | retained | Older copies/generations cannot reopen the character. |
| technical recovery separation | retained and specified | Newest verified same-boundary generation only; no choice menu. |
| current slots/localStorage envelope | migration input only | Address/projection and source artifact, not target identity/architecture. |
| bare JSON persistence | implementation baseline only | No accepted integrity or transaction architecture. |
| `snapshotVersion` | narrowed | Format compatibility only. |
| legacy `RunDifficultyState`/Hardcore | retained as migration input | Maps to Normal with provenance; never Ironbound. |
| `sourceRunId` | narrowed | Scoped lineage/migration evidence, never universal campaign id. |
| account history/slot metadata | retained as projection/index | Cannot override verified gameplay or closure. |
| current HP-zero archival/deletion | rejected as target | Known defect; does not control migration or save policy. |
| closure-before-settlement | retained | Save publication/retirement must verify before account transactions. |
| occurrence commitment | explicitly deferred | Save-side links reserved; semantics belong to next decision. |
| narrative/elemental/injury/Mortal Crisis | retained | No gameplay or presentation rule changes. |
| held `0.6.6` / retained `0.6.7` | retained unchanged | No restoration or implementation authorization. |

## 25. Future Implementation-Package Order Without Permission

If separately authorized, conceptual order is:

1. campaign-rules semantic version 2 and Stakes policy registry;
2. account/campaign/continuity/character/artifact identity contracts;
3. save artifact envelope and provenance contracts;
4. legacy/current migration and Normal-only mapping;
5. Normal address adapter and branch lineage;
6. write-generation, verification, publication, and projection ordering;
7. hidden technical-recovery generation handling;
8. Committed continuation-head persistence;
9. checkpoint-boundary registry and qualifying rest/milestone adapters;
10. Committed checkpoint selection, abandonment, pruning, and retirement;
11. Ironbound continuation head and copied-generation/closure protection;
12. account-history/index repair and copied-slot blocking;
13. occurrence/uncertainty commitment contract and later implementation;
14. Mortal Crisis, death/body, closure, settlement, succession, narrative, and UI consumers;
15. migrations, tests, storage implementation, operational recovery, and production availability.

No release version, package path, interface, field layout, storage engine, library, or implementation prompt is assigned.

## 26. Future Test And Validation Matrix

Future noncanonical fixtures must cover:

### Registry and identity

- all three Stakes ids under campaign-rules version 2 and policy revision 1;
- label/localization changes without machine-id changes;
- version 1 readable as migration input;
- account, campaign, continuity, character, artifact, checkpoint, generation, closure, and correction identities remain distinct;
- successor character in one campaign;
- slot/address distinct from artifact;
- checkpoint distinct from generation;
- snapshot format distinct from policy version.

### Normal

- manual and quick-save artifacts;
- earlier artifact loaded with no mutation creates no branch;
- first accepted divergent mutation creates one child continuity;
- save after divergence captures that child and does not mint another;
- abandoned timeline loses durable account value;
- copied artifact under another slot retains identity/receipts;
- ordinary defeat remains unsaved unless later saved;
- legacy HP-zero same-slot repair is idempotent.

### Committed

- campaign-start checkpoint;
- completed qualifying major sleep/secure rest;
- authored milestone boundary;
- incomplete rest/menu/save request rejected as checkpoint qualification;
- save-and-exit updates head only;
- head newer than last checkpoint;
- selecting earlier checkpoint and mutating creates child continuity;
- committed result links survive branching;
- final closure retires ladder before settlement;
- copied checkpoint cannot bypass retirement.

### Ironbound

- one continuable head and no historical selection;
- hidden prior verified generation used only after invalid newest write;
- save-and-exit creates no rollback;
- copied older generation cannot reopen after closure;
- newest verified closure survives recovery;
- incomplete newest generation falls back to newest valid, never favorable, state.

### Write and recovery

- candidate failure before verification preserves old authority;
- verified candidate publication and head ordering;
- profile/index failure after publication repairs later;
- UI success only after publication;
- corrupt/incompatible/invalid/superseded/retired/closed distinction;
- metadata disagreement resolved from verified authority;
- recovery stays within account/campaign/continuity/policy;
- correction retains cause/lineage and no duplicate consequences.

### Migration and duplicates

- accepted legacy difficulty mappings and Hardcore-to-Normal provenance;
- no legacy/current save selects Committed/Ironbound;
- one migration receipt mints target identities once;
- failed migration preserves source;
- current slots and `sourceRunId` remain projections/evidence;
- archived/deleted history remains blocked;
- duplicate bytes do not mint entitlement;
- stale Normal/Committed/Ironbound material cannot duplicate settlement.

## 27. Temporary-Evidence Retention

Retain:

- comparative mortality research through checkpoint, commitment, crisis, resurrection, settlement, and succession implementation consumers;
- the defeat/injury audit through the first relevant runtime replacement/repair package;
- the completed Mortal Crisis/Stakes authority permanently as controlling design authority;
- narrative and elemental evidence for their named remaining consumers.

No temporary evidence is deleted. Removal remains conditional on all named consumers recording consumption and durable authority retaining the necessary conclusions.

## 28. Unresolved Implementation Questions

Implementation-only questions include:

- exact identifiers, field names, interfaces, packages, and serialization;
- identity generation and migration-receipt derivation;
- storage engine, byte format, integrity, verification, locking, journaling, atomicity, and recovery depth;
- continuation-head revision ordering;
- Normal branch-finalization and provisional account-value mechanics;
- Committed rest qualification details, checkpoint cadence/count/pruning/labels/UI;
- Ironbound autosave cadence and operational recovery;
- authoritative campaign-control/closure registry representation and replication;
- copied/cloud/offline conflict resolution and anti-tamper posture;
- format/content compatibility and migration support windows;
- correction permissions and repair tooling;
- account transaction reconciliation, estate, achievements, Prestige, succession, and UI;
- tests, migrations, rollout, production availability, diagnostics, and support.

These do not reopen semantic version 2, policy revision 1, the identity graph, Normal divergence boundary, Committed head/checkpoint distinction, checkpoint qualifiers, Ironbound generation boundary, write ordering, migration-to-Normal, or copy protections.

## 29. Explicit Non-Decisions

This decision does not:

- implement or authorize runtime, types, schemas, persistence, migrations, UI, tests, or content;
- accept an exact TypeScript name, field layout, package path, id format, slot count, checkpoint count, retention value, storage key, byte format, hash, checksum, canonicalization, lock, algorithm, or library;
- select localStorage, bare JSON, a database, journal, cloud service, cryptography, or dependency;
- define occurrence normalization, uncertainty channels, RNG, seed derivation, or domain replay equivalence;
- make save/account/UI code a gameplay owner;
- let legacy Hardcore select Ironbound;
- expose Committed or Ironbound;
- let save-and-exit create a Committed checkpoint;
- expose recovery generations as rollback;
- let copied bytes mint authority or value;
- reopen closed Ironbound state;
- pay abandoned Normal or unretired Committed terminal value;
- modify Mortal Crisis, death, resurrection, settlement formulas, injury, narrative, elemental, or successor policy;
- restore `0.6.6`, alter `0.6.7`, assign a release version, or create an implementation prompt.

## 30. Answers To Required Conclusions

| # | Accepted conclusion |
| --- | --- |
| 1 | Campaign-rules semantic version 2; version 1 remains readable migration input. |
| 2 | Campaign/save policy authority owns the three-entry Stakes registry at semantic policy revision 1. |
| 3 | Account, campaign, continuity, character, artifact, checkpoint, head/generation, correction, and closure identities are distinct as defined in Sections 3 and 6. |
| 4 | `campaign` and `continuity` are canonical; `run` is a scoped compatibility/history term and `timeline` is descriptive lineage language. |
| 5 | Slots/keys/metadata/history are projections; snapshot version is format; legacy difficulty/Hardcore and `sourceRunId` are migration/scoped evidence. |
| 6 | Section 9 defines the required identity, policy, artifact, source, order, compatibility, posture, correction, closure, retirement, and consumed-receipt provenance. |
| 7 | Address locates; artifact identifies accepted capture; snapshot is gameplay payload; checkpoint is qualified/selectable; head resumes; generation supports hidden write/recovery. |
| 8 | Normal creates a child continuity at the first accepted mutation after loading a non-head earlier artifact. |
| 9 | Abandonment/lineage and consumed receipts block value; durable closure value remains provisional until conflicting rollback is retired. |
| 10 | Committed continuation head is the latest authoritative resume state and may be newer than selectable checkpoints. |
| 11 | A Committed checkpoint is a verified owner-qualified selectable rollback artifact. |
| 12 | Campaign start, completed qualifying major sleep/secure rest, and owner-registered authored milestones qualify at minimum. |
| 13 | No. Save-and-exit may confirm the continuation head only. |
| 14 | Closure identity, complete ladder retirement, closed-head publication, and verification precede terminal settlement. |
| 15 | Ironbound has one latest authoritative player-continuable head. |
| 16 | It may retain hidden prior verified write/recovery generations only. |
| 17 | Recovery selects the newest verified compatible generation inside the same account/campaign/continuity/policy and closure boundary. |
| 18 | Prepare, validate, durable write, verify, publish, verify publication, retain/retire prior, then update projections. |
| 19 | Verified gameplay/campaign-control authority wins over metadata/indexes; separately authoritative account receipts still prevent duplicate transactions. |
| 20 | Current, superseded, invalid, corrupt, incompatible, retired, and closed have the distinct meanings in Section 17. |
| 21 | Active current/legacy saves migrate idempotently to version 2 Normal with one campaign/continuity/artifact identity set and provenance. |
| 22 | Legacy Hardcore is recorded as migration evidence, maps to Normal, and does not preserve terminal HP-zero or select Ironbound. |
| 23 | Slots remain address projections; `sourceRunId` remains scoped lineage/migration evidence, never universal identity. |
| 24 | Stable embedded/resolved artifact, campaign, continuity, checkpoint/generation, closure, and receipt identities reveal conceptual duplication regardless of address. |
| 25 | The copied checkpoint identity remains in the verified retirement/closure set and is ineligible everywhere. |
| 26 | The older generation remains same-continuity superseded/closed material under the verified Ironbound closure/head lineage. |
| 27 | Closure/consequence transaction ids plus campaign/continuity lineage and consumed receipts prevent duplicate settlement. |
| 28 | Occurrence, uncertainty channel, accepted result, normalization version, correction lineage, and consumed consequences are reserved links. |
| 29 | Section 24 explicitly retains, narrows, supersedes, or defers every affected authority/seam. |
| 30 | Section 25 accepts the fifteen-step owner-first future order. |
| 31 | All concrete fields, ids, packages, storage, algorithms, values, migration code, UI, tests, and deployment remain implementation-only. |
| 32 | Next: `Occurrence Identity, Named Uncertainty Channels, Outcome Commitment, And Correction Contract Decision`. |

## 31. Next Recommended Route

The next recommended route is the unversioned documentation-only:

`Occurrence Identity, Named Uncertainty Channels, Outcome Commitment, And Correction Contract Decision`

It should consume the campaign/continuity/artifact/checkpoint/head/generation links accepted here and define semantic event commitment without selecting RNG, hashing, serialization, packages, or implementation.

Held `Version 0.6.6` remains paused and recoverable. Retained `0.6.7` remains unchanged.
