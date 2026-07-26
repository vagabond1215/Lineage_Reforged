# Current Codex Output

Date: 2026-07-25

Source run: `Stakes Identity, Campaign/Save Provenance, Checkpoint Topology, And Technical-Recovery Contract Decision`

Run classification: unversioned durable documentation-only contract decision

Parent version: none

Milestone impact: `supports_current_band`

Branch/status assumption: `master`, tracking `origin/master`; pre-edit worktree clean; documentation edits remain unstaged

Starting commit before fetch: `8a67597143798841b53c4857e5ccd5dae5acb923`

Ending pre-edit commit after fetch: `8a67597143798841b53c4857e5ccd5dae5acb923`

Ending commit before requested completion commit: `8a67597143798841b53c4857e5ccd5dae5acb923`

Suggested commit: `docs(design): define stakes save and recovery contracts`

## Files Changed

1. Created `docs/design/stakes-identity-campaign-save-provenance-checkpoint-topology-and-technical-recovery-contract-decision.md`.
2. Replaced `docs/dev/current-codex-output.md`.
3. Updated `docs/dev/current-gpt-handoff.md`.
4. Updated materially affected rows in `docs/dev/historical-version-and-deferred-route-register.md`.

No prompt, completed authority, audit, research, roadmap, sequenced plan, runtime, shared type, schema, validator, package, dependency, persistence, save manager, lifecycle, migration, account, test, UI, content, generated, held-route, or retained-route file changed.

## Repository And Pinned Source Verification

- Fetched/pruned `origin`; local `master` was already synchronized with `origin/master`.
- Reloaded the full active prompt after fetch.
- Confirmed Mortal Crisis/Stakes commit `b55b9d5e2656d62644251c289038aa19f5eebe7f` is an ancestor of `HEAD`.
- Confirmed every pinned authority, evidence, coordination, and live-source blob exactly.
- Confirmed no pinned live save-system source changed after the controlling commit.
- Confirmed held `Version 0.6.6` blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
- The new contract artifact resolves to blob `86f10b6fbdc4fc7fdce3f50673556930b9d35999`.
- No execution-gate contradiction was found.

## Accepted Semantic Version And Registry

- Target campaign-rules semantic version: **2**.
- Version 1: readable Normal-only migration input.
- Initial three-policy Stakes registry semantic revision: **1**.

| Label | Machine id |
| --- | --- |
| Normal Stakes | `normal_stakes` |
| Committed Stakes | `committed_stakes` |
| Ironbound Stakes | `ironbound_stakes` |

Campaign/save policy authority owns the registry. Display/localization labels version independently. Policies remain creation-locked, append-only or explicitly migrated, and unavailable until all required owners are complete.

Legacy difficulty, `hardcore`, `hardcore_stakes`, `dead`, `hardcore_dead`, and combat-profile `hardcore` remain migration/history inputs, never policy identities.

## Canonical Identity Graph And Vocabulary

Canonical terms:

- `campaign` is the durable playable world/history identity;
- `continuity` is one authoritative or selected playable history chain;
- `run` is a scoped compatibility/account-history term;
- `timeline` is descriptive continuity-lineage language, not a second authority id.

```text
account
  -> campaign
       -> continuity
            -> character identities
            -> continuation head
            -> artifacts/checkpoints
            -> hidden write/recovery generations
            -> correction lineage
       -> closure, retirement, and consumed-value authority
```

Account, campaign, continuity, character, storage address, artifact, snapshot, checkpoint, head revision, write/recovery generation, correction, and closure identities are distinct.

A successor is a new character in the same campaign and may continue its authoritative continuity. Copying bytes or moving an address cannot mint identity.

## Live Baseline Classification

- Current manual/quick slot ids and localStorage keys are addresses.
- Version-6 envelopes are migration source artifacts.
- `SaveSnapshot.accountId` is valid account association, not campaign identity.
- `snapshotVersion` is format compatibility only.
- `capturedAtTick` is ordering evidence, not head revision.
- Current `RunDifficultyState` is migration input.
- `sourceRunId` is scoped lineage/migration evidence.
- history `saveSlotIds`, metadata, and UI summaries are projections/indexes.
- current payout/estate/achievement receipts are consumer evidence requiring future campaign/continuity/closure links.
- bare JSON and current save-then-profile ordering are implementation facts, not accepted architecture.
- current HP-zero archival/deletion remains a known defect.

## Artifact And Generation Taxonomy

| Class | Player posture |
| --- | --- |
| Normal manual/quick artifact | visible and selectable; address may be rebound to a new accepted artifact revision |
| Committed selectable checkpoint | visible/selectable only after owner qualification and verified publication |
| Committed continuation head | ordinary Continue state; may be newer than the last checkpoint; not rollback history |
| Ironbound continuation head | sole continuable state |
| technical recovery generation | hidden and never selectable |
| correction artifact/generation | authorized supersession, not ordinary selection |

A snapshot is the captured gameplay payload, not artifact kind, checkpoint qualification, head status, generation, closure, or policy.

## Minimum Provenance

Every authoritative artifact/generation must retain or resolve:

- account, campaign, continuity/parent, and relevant character identity;
- Difficulty, World Rules, Stakes id, campaign-rules version, and policy revision;
- artifact/generation kind and identity;
- parent/source artifact, checkpoint, or head;
- separate address binding;
- capture order/source/reason;
- snapshot/content/format compatibility;
- qualifying-boundary receipt where applicable;
- head identity/revision;
- generation identity/order/verification;
- state posture;
- correction cause/lineage;
- closure and checkpoint-retirement links;
- downstream consumed receipts;
- reserved occurrence/result/correction links.

Exact fields and storage remain deferred.

## Normal Topology And Branch Decision

Normal retains manual/quick saves, broad rollback, no defeat-forced save, unsaved generic fallback, legacy repair exception, and no general event commitment.

Loading an earlier artifact does not create a branch. A new child continuity is created at the **first accepted gameplay mutation after loading an artifact that is not the current head**. Saving later only captures that already-selected/created continuity.

When the child becomes active, later history on the abandoned continuity is nonauthoritative. It cannot newly post durable closure, estate, account, achievement, or successor value.

Because Normal preserves rollback, closure-derived durable value remains provisional until a separately accepted branch-finalization transaction retires conflicting rollback artifacts. No cross-timeline entitlement is accepted.

Copies retain artifact, continuity, closure, and receipt identity regardless of address.

## Committed Topology

Committed separates:

```text
latest continuation head
  -> ordinary quit/restart continuation

retained qualifying checkpoints
  -> only player-selectable rollback

hidden verified generations
  -> technical recovery only
```

Save-and-exit and arbitrary save requests may persist/confirm the head but never create checkpoints.

Minimum qualifying boundaries:

1. campaign creation/start;
2. completed qualifying major sleep or secure-rest transaction;
3. owner-registered authored milestone or transition.

Menus, rest-screen entry, incomplete sleep, UI changes, quit, and save requests do not qualify.

Selecting an earlier checkpoint creates a child continuity only on the first accepted mutation. Later occurrence commitment retains materially identical results.

Final closure binds closure identity, retires the complete checkpoint ladder, publishes/verifies the closed head, and only then permits terminal settlement. Retirement follows checkpoint identity, so copies cannot bypass it.

## Ironbound Topology

Ironbound retains:

- one player-continuable head;
- no historical selection or player fork;
- hidden prior verified generations for recovery only;
- save-and-exit as head confirmation, not a checkpoint;
- atomic actual/final death and closure;
- read-only history afterward.

Older copies remain same-campaign/same-continuity superseded material. A verified terminal closure blocks reopening through another address or generation.

If the newest attempted write is invalid/incomplete, recovery selects the newest prior verified compatible generation. The player never chooses.

## Technical-Recovery And Write Ordering

Accepted order:

```text
prepare
  -> validate identity/policy/snapshot/source
  -> durably write candidate
  -> verify
  -> publish as artifact/head
  -> verify publication
  -> retain/retire prior verified generation
  -> update indexes/account/UI projections idempotently
```

The last verified state remains recoverable until replacement publication succeeds. UI cannot report success earlier.

Projection failure after publication is repairable without rewriting gameplay. Account transactions have separate authoritative receipts and consume verified closure/consequence identity.

Recovery stays within account/campaign/continuity/policy/closure boundaries and selects newest verified state, never favorable state.

Accepted distinct postures: current, superseded, invalid, corrupt, incompatible, retired, and closed.

## Account, Save, And Index Authority

Verified gameplay/campaign-control authority wins over slot metadata, account-history indexes, and UI summaries.

Separately authoritative account reward/estate/achievement/Prestige ledgers still prevent duplicate transactions. They consume gameplay receipts but cannot rewrite gameplay.

Stale metadata/indexes are repaired. A failed profile update cannot make an absent save authoritative. Competing purported authoritative heads are quarantined for correction rather than resolved by timestamp, address, or UI choice.

## Migration Decisions

- Campaign-rules version 1 remains readable input; version 2 is target.
- Every active current/legacy campaign migrates to Normal only.
- Legacy Hardcore records provenance but never selects Ironbound or preserves terminal HP-zero/zero-Prestige behavior.
- Migration establishes one campaign, initial continuity, and target artifact identity exactly once through an idempotent receipt.
- Current addresses/metadata remain compatibility projections.
- `sourceRunId` remains scoped evidence.
- Failed migration preserves the verified source, publishes no partial target, and blocks ordinary play pending repair.
- Archived/deleted/dead/hardcore-dead history remains historical and blocked.
- Active legacy HP-zero repair runs after campaign identity migration through the accepted Normal fallback and same-address repair boundary.

## Copied, Stale, Closed, And Duplicate Protection

- Stable identities and consumed receipts, not location, reveal duplication.
- New addresses do not mint campaigns, checkpoints, closures, or value.
- Altered identity without migration/correction authority is invalid/quarantined.
- Abandoned Normal state cannot retain another continuity’s durable value.
- Copied Committed checkpoint identity remains retired everywhere after closure.
- Older Ironbound generations remain superseded/closed after terminal closure.
- Stale projections repair from authority.
- Missing authority needed to distinguish heads/closure blocks play for correction rather than guessing.

## Retained, Narrowed, And Superseded Boundaries

Retained:

- three Stakes ids and gameplay semantics;
- creation locks/availability gates;
- Normal manual/quick and no-forced-save behavior;
- Committed qualified-checkpoint direction;
- Ironbound one continuity/no rollback/finality;
- closure before settlement;
- Mortal Crisis, injury, narrative, and elemental authority;
- held `0.6.6` and retained `0.6.7`.

Narrowed/clarified:

- campaign-rules version 1 is migration input; version 2 is target;
- slots/localStorage/sourceRunId/snapshotVersion/history are address, evidence, compatibility, or projection seams;
- Normal branch creation occurs at first divergent mutation;
- Committed head/checkpoint and pruning/closure-retirement are distinct;
- Ironbound generations are recovery-only;
- technical recovery uses verified publication ordering.

Rejected/superseded:

- address-as-identity;
- write-before-verification success;
- copied-state authority/value minting;
- current HP-zero archival as target behavior.

Occurrence normalization, uncertainty channels, RNG, and replay equivalence remain explicitly deferred.

## Unresolved Implementation Questions

- exact ids, fields, interfaces, packages, and serialization;
- identity/migration-receipt generation;
- storage, integrity, verification, locking, journaling, atomicity, and recovery depth;
- head revision ordering;
- Normal branch finalization/provisional value mechanics;
- Committed rest predicates, checkpoint cadence/count/pruning/labels/UI;
- Ironbound autosave cadence and operational recovery;
- campaign-control/closure representation and replication;
- copied/cloud/offline conflict and anti-tamper posture;
- compatibility/migration support windows;
- correction permissions/tooling;
- account transaction reconciliation and downstream consumers;
- tests, rollout, diagnostics, support, and production availability.

## Checks Run

- `git fetch --prune origin`
- branch/upstream/HEAD and ahead/behind inspection
- complete prompt reload
- ancestor verification
- exact pinned-file `git hash-object` verification
- held-blob `git cat-file` verification
- post-authority live-source change inspection
- required authority/live-source/test inspection with `rg` and focused file reads
- required section/conclusion coverage checks
- document-reference existence scan
- trailing-whitespace scan
- exact changed-path/forbidden-path review
- `git diff --check`
- final repository status review

No runtime tests were run because the authorized work is documentation-only.

## Risks / Follow-Up Notes

- The contract intentionally does not choose storage, hashing, transactions, or exact schemas.
- Normal durable settlement still needs a later branch-finalization/provisional-value contract.
- Cross-device/cloud/offline conflict resolution needs a later architecture decision.
- Current HP-zero archival and nontransactional save/profile ordering remain live implementation gaps.
- Committed and Ironbound remain unavailable in production.
- No next prompt was installed.

## Temporary Evidence And Held Routes

- Comparative mortality research remains retained for all named implementation consumers.
- The defeat/injury audit remains through the first relevant runtime repair.
- The Mortal Crisis/Stakes decision remains permanent controlling authority.
- Narrative and elemental evidence remains for named consumers.
- Held `Version 0.6.6` remains paused/recoverable.
- Retained `0.6.7` remains unchanged.

## Next Recommended Run

Unversioned documentation-only:

`Occurrence Identity, Named Uncertainty Channels, Outcome Commitment, And Correction Contract Decision`
