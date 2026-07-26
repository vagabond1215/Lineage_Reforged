# Current GPT Handoff

Date: 2026-07-25

## Status

- `Stakes Identity, Campaign/Save Provenance, Checkpoint Topology, And Technical-Recovery Contract Decision` is complete and controlling for save-side identity, topology, provenance, migration, and recovery.
- Controlling artifact: `docs/design/stakes-identity-campaign-save-provenance-checkpoint-topology-and-technical-recovery-contract-decision.md`, blob `86f10b6fbdc4fc7fdce3f50673556930b9d35999`.
- The preceding Mortal Crisis/Stakes authority remains controlling for gameplay, death, resurrection, finality, settlement ordering, and warnings.
- Run classification: unversioned durable documentation-only contract decision.
- Milestone impact: `supports_current_band`.
- Implementation remains unauthorized.
- No next prompt was installed.
- Held `Version 0.6.6` remains paused/recoverable; retained `0.6.7` remains unchanged.

## Most Specific Accepted Authorities

Use:

1. `docs/design/stakes-identity-campaign-save-provenance-checkpoint-topology-and-technical-recovery-contract-decision.md` for campaign-rules semantic version, Stakes registry ownership, campaign/save identities, artifact topology, branch/checkpoint/generation behavior, migration, write/recovery ordering, and copied-state protection.
2. `docs/design/checkpoint-commitment-mortal-crisis-resurrection-aftereffects-final-closure-and-stakes-authority-revision.md` for Stakes gameplay semantics, event-commitment direction, Mortal Crisis, actual/final death, restoration, convalescence, closure, and settlement/succession order.
3. `docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md` for orthogonal campaign axes, creation locks, legacy mapping, Story/Grim, and availability where not narrowed by newer authority.
4. `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md` for the minimum Normal defeat fallback and same-slot legacy repair.
5. `docs/design/restricted-stakes-continuity-death-closure-and-prestige-decision.md` for retained Ironbound continuity/read-only/Prestige details as narrowed by newer authorities.
6. Narrative, elemental, injury/restoration, and Difficulty/World/Stakes decisions for their unchanged domains.

Live code remains implementation evidence, not authority.

## Semantic Version And Stakes Registry

Accepted:

- campaign-rules semantic version **2** is the target;
- version 1 remains readable Normal-only migration input;
- the initial three-policy Stakes registry semantic revision is **1**.

```text
Normal Stakes     -> normal_stakes
Committed Stakes  -> committed_stakes
Ironbound Stakes  -> ironbound_stakes
```

Campaign/save policy authority owns the registry. It is creation-locked, append-only or explicitly migrated, and independent from display labels and snapshot format.

Committed and Ironbound remain unavailable in production until all required owners, persistence, migration, warnings, recovery, and tests exist.

Legacy `RunDifficultyState`, `hardcore`, `hardcore_stakes`, `dead`, `hardcore_dead`, and combat-profile `hardcore` are migration/history inputs only.

## Canonical Identity Vocabulary

Canonical terms:

- **campaign**: durable playable world/history identity;
- **continuity**: one authoritative or selected playable history chain;
- **run**: scoped compatibility/account-history term only;
- **timeline**: descriptive continuity lineage/abandoned branch language.

```text
account
  -> campaign
       -> continuity
            -> character identities
            -> current continuation head
            -> save artifacts / checkpoints
            -> hidden write/recovery generations
            -> correction lineage
       -> closure, checkpoint-retirement, and consumed-value authority
```

Distinct identities:

- account;
- campaign;
- continuity and parent continuity;
- character;
- storage address;
- save artifact;
- snapshot;
- checkpoint;
- continuation head/revision;
- write/recovery generation;
- correction/supersession;
- terminal closure.

A successor is a new character in the same campaign and may continue its authoritative continuity. A slot/key or copied envelope cannot mint identity.

## Live Baseline Classification

Current facts remain migration inputs:

- 128 manual plus one quick-save address;
- one account/slot localStorage envelope;
- bare JSON snapshot serialization;
- snapshot account/format/tick/domain state;
- legacy difficulty and Hardcore;
- optional `sourceRunId`;
- account-history slot indexes;
- current payout/estate/achievement receipts;
- HP-zero archival and deletion.

Target classifications:

- slot ids and keys are storage/UI addresses;
- envelope is a migration source artifact;
- `accountId` is account association;
- `snapshotVersion` is format compatibility;
- `capturedAtTick` is ordering evidence;
- `sourceRunId` is scoped lineage/migration evidence;
- history/metadata/UI are projections/indexes;
- bare JSON/localStorage/save-then-profile ordering is not final architecture;
- HP-zero archival is a known defect.

## Artifact And Generation Taxonomy

| Class | Contract |
| --- | --- |
| Normal manual/quick artifact | visible/selectable; address may point to a new artifact revision |
| Committed selectable checkpoint | visible/selectable only after owner qualification and verified publication |
| Committed continuation head | latest Continue state; may be newer than checkpoint ladder; not selectable rollback |
| Ironbound continuation head | sole continuable state |
| technical recovery generation | hidden, nonselectable, failure recovery only |
| correction artifact/generation | explicit authorized supersession |

A snapshot is gameplay payload inside an artifact/generation. It does not establish policy, checkpoint qualification, selectability, head status, generation order, correction, retirement, or closure.

## Minimum Provenance

Every authoritative artifact/generation must retain or resolve:

- account/campaign/continuity/parent/character identities;
- Difficulty, World Rules, Stakes id, campaign-rules version, policy revision;
- artifact/generation kind and stable identity;
- source artifact/checkpoint/head;
- separate address binding;
- capture order/source/reason;
- snapshot/content/format compatibility;
- checkpoint qualification receipt;
- continuation-head identity/revision;
- generation identity/order/verification;
- current/superseded/invalid/corrupt/incompatible/retired/closed posture;
- correction authority/cause/lineage;
- closure and checkpoint-retirement links;
- consumed downstream receipts;
- reserved occurrence/result/correction links.

Exact fields, ids, serialization, and storage remain deferred.

## Normal Topology

Normal retains manual/quick saves, broad rollback, no defeat-forced save, unsaved fallback, same-slot legacy repair exception, and no general event commitment.

Branch rule:

1. loading an earlier artifact selects state but does not fork;
2. the **first accepted gameplay mutation** after loading a non-head artifact creates one child continuity;
3. saving later captures that continuity and does not mint another branch.

The later abandoned continuity becomes nonauthoritative for active play. Its closure, estate, account, achievement, successor, and other durable claims cannot newly post.

Because Normal preserves rollback, closure-derived durable value remains provisional until a separately accepted branch-finalization/rollback-retirement transaction exists. No cross-timeline entitlement is accepted.

Copies under another address retain artifact/continuity/receipt identity.

## Committed Topology

Committed separates:

```text
continuation head
  -> ordinary resume

qualified checkpoints
  -> only selectable rollback

hidden generations
  -> technical recovery only
```

The continuation head may be newer than the last checkpoint.

Save-and-exit or an arbitrary save request can persist/confirm the head but cannot create a checkpoint.

Minimum checkpoint qualifiers:

1. campaign creation/start;
2. completed qualifying major sleep or secure rest accepted by rest/time authority;
3. explicit owner-registered authored milestone/transition.

Menus, incomplete rest, rest-screen entry, UI state, quit, and save requests do not qualify.

Selecting an earlier checkpoint creates a child continuity at the first accepted mutation. Later commitment authority preserves materially identical accepted results.

Final closure transaction:

```text
verify closure
  -> bind closure id
  -> retire complete checkpoint ladder
  -> publish/verify closed head
  -> permit terminal settlement
```

Retirement is checkpoint-identity based, so copied bytes cannot evade it. Ordinary pruning and terminal retirement remain distinct.

## Ironbound Topology

Ironbound has:

- one player-continuable head;
- no selectable history or player fork;
- hidden prior verified generations only for recovery;
- save-and-exit as head confirmation;
- atomic actual/final death and closure;
- read-only history after closure.

Older copies are same-campaign/same-continuity superseded material. Verified terminal closure prevents reopening through another address or generation.

An invalid/incomplete newest write falls back only to the newest prior verified compatible generation. No generation picker is exposed.

## Technical Write And Recovery Contract

Accepted order:

```text
prepare candidate
  -> validate identities/policy/snapshot/source
  -> durable write
  -> verify
  -> publish artifact/head
  -> verify publication
  -> retain/retire previous verified generation
  -> update projections/account indexes idempotently
```

The previous verified state survives until replacement is verified/published. UI reports success only after publication.

Projection/index failure after publication is repairable. Account transactions have separate authoritative receipts and consume verified closure/consequence ids.

Recovery selects the newest verified generation inside the same account/campaign/continuity/policy/closure boundary. It never selects a favorable state.

Distinct state postures:

- current;
- superseded;
- invalid;
- corrupt;
- incompatible;
- retired;
- closed.

## Account, Save, And Projection Authority

Verified gameplay/campaign-control authority wins over slot metadata, history indexes, and UI summaries.

Account reward, estate, achievement, Prestige, and entitlement ledgers remain separately authoritative for their transactions. They consume gameplay receipts but cannot author gameplay state.

- stale metadata/indexes repair from verified authority;
- a failed profile update cannot create save authority;
- successful account receipts prevent repeat payout despite stale projections;
- competing purported authoritative heads require correction/quarantine, never timestamp or slot-label guessing.

## Migration Contract

- Version 1 is readable input; version 2 is target.
- All active current/legacy campaigns migrate to Normal only.
- Legacy Hardcore records provenance but never selects Ironbound or preserves terminal HP-zero/zero-Prestige behavior.
- Migration establishes campaign, initial continuity, and target artifact identities exactly once through an idempotent receipt.
- Current addresses remain compatibility projections.
- `sourceRunId` remains scoped evidence.
- Failed migration preserves source data, publishes no partial target, and blocks ordinary play pending repair.
- Archived/deleted/dead/hardcore-dead records remain historical and blocked.
- Active legacy HP-zero repair follows campaign migration and uses the accepted Normal fallback/same-address repair.

## Copied, Stale, Closed, And Duplicate Protection

- Stable identities and consumed receipts determine duplication, not address.
- Copying bytes cannot mint a campaign, checkpoint, closure, or entitlement.
- Unauthoritatively altered identity is invalid/quarantined.
- Abandoned Normal continuity cannot retain later durable value.
- Retired Committed checkpoint identity remains retired at every address.
- Older Ironbound generation remains superseded/closed after verified closure.
- Stale projections repair from authority.
- Missing campaign-control truth needed to distinguish heads/closure blocks play for correction rather than guessing.

## Closure And Account Value

Terminal settlement remains downstream of final closure.

Every durable transaction links account, campaign, continuity, character, closure, source consequence, policy version, consumed evidence, and correction lineage.

- Normal closure value remains provisional while conflicting rollback remains selectable.
- Committed settlement follows verified ladder retirement and closed-head publication.
- Ironbound settlement follows atomic closure publication.

Exact currencies, formulas, reversals, estate rules, achievements, succession, and UI remain owner decisions.

## Occurrence-Commitment Boundary

Reserved save-side links:

- occurrence identity;
- uncertainty-channel identity;
- accepted result identity;
- material-input normalization version;
- correction/supersession lineage;
- consumed consequences.

This decision does not define event normalization, uncertainty channels, RNG, seed/hash, replay equivalence, result storage, or per-owner correction permission.

## Retention And Supersession

Retained:

- all three Stakes ids/semantics;
- creation locks and availability gates;
- Normal manual/quick/no-forced-save behavior;
- Committed qualified checkpoint direction;
- Ironbound one-continuity/no-rollback/finality;
- technical recovery separation;
- closure-before-settlement;
- Mortal Crisis, injury, narrative, and elemental authorities.

Narrowed:

- campaign-rules version 1 to migration input;
- current slots/envelopes/snapshot version/sourceRunId/history to address/evidence/projection roles;
- Normal fork at first divergent mutation;
- Committed head versus checkpoint and pruning versus closure retirement;
- Ironbound hidden generations to recovery-only;
- write acceptance to verification/publication.

Rejected:

- address-as-identity;
- copied-value minting;
- current HP-zero archival as target;
- storage write success before authoritative publication.

## Implementation Prohibition And Order

Implementation remains unauthorized.

Future conceptual order:

1. campaign-rules version 2 and registry;
2. identity contracts;
3. artifact/provenance envelope;
4. Normal-only migration;
5. Normal address/branch adapter;
6. write/verification/publication;
7. recovery generations;
8. Committed head;
9. checkpoint-boundary registry;
10. checkpoint selection/retirement;
11. Ironbound head/closure protection;
12. index repair/copied blocking;
13. occurrence commitment;
14. downstream gameplay/settlement/narrative consumers;
15. migrations, storage, UI, tests, and production availability.

Do not infer exact fields, ids, packages, storage, algorithms, dependencies, migrations, UI, tests, or runtime.

## Temporary Evidence And Held Routes

- Retain comparative mortality research through all named implementation consumers.
- Retain the defeat/injury audit through the first relevant runtime repair.
- Retain the Mortal Crisis/Stakes authority permanently.
- Retain narrative/elemental evidence for named consumers.
- Held `Version 0.6.6` remains paused/recoverable as blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
- Retained `0.6.7` remains unchanged.

## Next Recommended Route

Run the unversioned documentation-only:

`Occurrence Identity, Named Uncertainty Channels, Outcome Commitment, And Correction Contract Decision`

No next Codex prompt is installed. The current prompt remains the completed save/Stakes contract prompt until coordination advances it.
