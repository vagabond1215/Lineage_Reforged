# DEV-0.7.1 Slice G9A — Epoch Lifecycle And Destructive Transition Authority Decision

Date: 2026-10-02. Source hosted `master` `418fba0e3e356608fbed550a0849e359e80724f3`. Documentation-only internal decision slice of planned `DEV-0.7.1`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`. Parent acceptance and deployment activation remain held.

## Disposition

**LIFECYCLE_DESTRUCTIVE_CONTRACT_ACCEPTED; G9_IMPLEMENTATION_HELD.**

G8 established the live async clean-epoch ordinary route. G9 must not route any lifecycle or destructive action back through the retained localStorage implementation. Existing pure gameplay/account calculations may be reused, but IndexedDB must own durable acceptance, recovery, CAS, receipts and readback.

The durable boundary is:

1. ordinary recoverable campaign mutation;
2. terminal campaign settlement;
3. slot-address closure/deletion;
4. account-profile/credential mutation;
5. explicit account reset/delete.

These are different operations and must not be collapsed into one generic delete/reset helper.

## Authority rules common to G9

- Every mutation starts from an exact retained account revision and, when campaign-bearing, exact campaign head plus source/destination address identity.
- A pending first/descendant publication blocks unrelated account mutation until its exact recovery completes. Existing account-store revision fencing remains authoritative.
- Accepted publication or lifecycle settlement is restartable by a stable durable recovery identity. Lost callers resume; they do not mint replacement terminal publications, payouts, estate deposits or deletion identities.
- Two tabs use optimistic CAS. A stale account/head/address/lifecycle generation loses without partial writes.
- Soundings witness, immutable artifacts, non-head/fork history, Chronicle/history and existing publication receipts remain durable through ordinary recovery, retirement and slot-address deletion. They disappear only under explicit whole-account reset/delete according to that operation's contract.
- UI success requires exact durable readback. Unavailable, malformed, stale or conflicting authority is blocked, never represented as empty/playable/successful.
- Quota/abort before transaction commit leaves prior authority unchanged. Failure after an accepted transaction exposes a durable pending recovery and resumes it.
- No lifecycle owner may infer authority from presentation status alone. It must resolve the exact durable recovery/settlement record that owns the transition.

## Action matrix

| Production action | Durable owner / contract | Exit |
| --- | --- | --- |
| Normal-Stakes defeat recovery | Campaign mutation + descendant publication owner. Start from exact ready retained source and pending receipt; call the existing campaign-session recovery authority, then publish the resulting playable descendant through the same one-head/multiple-address CAS and ordinary consumers. | Exact ready descendant; duplicate receipt reuses retained result. |
| Profile edit | Account CAS owner using `updateProfile`; no campaign rewrite. Pending publication/recovery fence remains active. | Account revision +1 exact readback. |
| Password change | Existing account adapter credential verification + account CAS. | Credential/account revision exact readback; sessions are hints and must revalidate durable account. |
| Legacy purchase/preparation selection | Pure accepted Legacy resolver followed by account CAS. No direct localStorage write and no fabricated reward. | Exact profile/revision readback; stale account retries from fresh profile, not replayed effects. |
| Sign out | Remove only the epoch session hint, then bootstrap against durable accounts. | Account data unchanged; no campaign mutation. |
| Retirement / terminal death settlement | New lifecycle transaction owner. First accept one terminal descendant publication, then exactly-once settlement of run history, achievements, run payout, estate deposit and terminal receipts before any address closure. Existing payout/estate calculators are inputs, not persistence owners. | Campaign control closed; terminal settlement completed; retained immutable history remains readable as closed authority. |
| Retired inheritance use | Account/lifecycle CAS tied to exact retained retired source record and stable source-run identity. Consumption and any auto-archive transition are one exactly-once account settlement. | Updated inheritance-use count/readback; no duplicate consumption. |
| Slot deletion | Explicit address deletion owner, not campaign-history deletion. Validate expected account revision and exact addressed artifact/publication. Remove only that address and update run-history address membership atomically. Never delete immutable artifacts merely because an address is removed. | Slot is empty by explicit deletion receipt; other addresses/history remain. |
| Closed/blocked-run cleanup | Lifecycle address-close owner after terminal settlement is complete. It may remove active addresses for that character but must preserve terminal artifact, settlement receipts, run history, estate and provenance. | Closed history remains durable; ordinary load is blocked. |
| Account reset | Explicit destructive account transition preserving account identity/credential but replacing profile with a fresh default and deleting all account-scoped campaign/attempt/recovery/artifact/address/witness/lifecycle data atomically. Revision/generation advances; old session hints/tabs fail revalidation. | Same account can sign in; zero campaign addresses; fresh profile; reset receipt/generation proves the boundary. |
| Account delete | Explicit destructive account transition requiring current credential verification and expected account revision. Atomically remove account plus all account-scoped epoch data and retain a deletion-generation/tombstone sufficient to reject stale-tab resurrection of that account identity. Clear matching session hint only after durable deletion. | Account no longer selectable; stale hints/tabs block. |

## Normal defeat contract

The existing `completePendingNormalDefeatRecovery` is the gameplay authority. G9 must not reproduce its destination, receipt or continuity rules in UI code.

The epoch caller must load an exact retained ready address, prove exactly one pending receipt, retain the source artifact/publication/session control, and invoke the campaign-session recovery owner. The accepted result is unpublished gameplay state and must immediately use the descendant publication path. The descendant target is no longer pending defeat, so the existing ordinary publication prohibition against persisting `recovery_pending` remains intact.

Recovery publication uses the same source/destination address CAS as G8. Same-slot is the first implementation. A non-head source follows the already accepted fork rules. Account consumers complete before play resumes. Restart between publication and consumers resumes the destination-owned descendant recovery. Duplicate completion with the exact receipt identity is idempotent; a different destination/receipt or stale source fails closed.

## Terminal settlement contract

Retirement, ordinary death archive and hardcore death share one durable terminal settlement shape, while their archive reason and payout inputs remain distinct.

A terminal operation must:
1. validate exact ready source/account/head/address and no unresolved Normal defeat recovery;
2. derive the terminal snapshot from accepted gameplay state;
3. publish exactly one terminal descendant with `control.closed=true`;
4. create a durable lifecycle recovery in the same transaction, keyed by account/campaign/terminal publication;
5. complete account settlement exactly once: achievement/history projection, authoritative archive reason, run Legacy payout, payout transaction, estate deposit, last-played and lifecycle receipts;
6. only after settlement is complete, close/remove active slot addresses according to the selected lifecycle action;
7. read back closed campaign authority plus completed settlement.

No slot address may be cleared before terminal publication and settlement are durable. Existing `archiveActiveRun`, `resolveRunLegacyPayout`, `depositEstateFromArchivedSnapshot` and achievement helpers provide accepted calculation semantics, but their localStorage writes/deletes are not reusable persistence ownership.

The terminal publication and settlement recovery must carry stable fingerprints for archive reason, terminal artifact/publication, payout result, estate source-run identity and affected addresses. A retry must either reproduce that exact settlement or conflict.

## Retired lineage and inheritance

Retirement does not mean deletion. The retired run record, terminal artifact, payout metadata, estate and Soundings provenance remain durable.

If retirement grants inheritance uses under the existing accepted rule, the exact count is recorded by terminal settlement. A later heir consumption binds the retained source-run identity and expected account revision. It decrements once. If the existing rule says zero remaining uses becomes auto-archive eligible, that state transition is recorded in the same account transaction; it does not erase terminal artifacts or estate evidence.

No new inheritance payout, count or eligibility rule is invented by G9.

## Slot closure and explicit deletion

A slot address is a pointer, not the campaign.

Deleting a manual or quick address:
- CASes the exact addressed artifact/publication and account revision;
- updates the corresponding run-history `saveSlotIds` exactly once;
- removes that address only;
- preserves all immutable artifacts, descendant recoveries, first-publication recovery, Soundings witness and other addresses;
- does not mark a run deleted while another retained address or terminal history still owns it.

A terminal lifecycle may close/remove every active address for the character only after completed terminal settlement. This differs from player-requested deletion of one address.

The existing localStorage `markRunDeleted` behavior is calculation evidence only and must be adapted to the multiple-address/singular-head epoch model rather than copied mechanically.

## Account mutation and destructive-account boundary

Profile, password and Legacy changes are ordinary revisioned account edits. Existing `CleanEpochAccountStore.updateProfile/updateCredential` already fences prepared/pending publication authority and is the persistence base.

Reset/delete are stronger epoch transitions and require a new owner spanning every account-scoped store. They must not be implemented as a loop of per-slot deletes.

Reset:
- credential/account identity retained;
- profile recreated from accepted default account state;
- account revision and lifecycle generation advance monotonically;
- all campaign, attempt, recovery, artifact, control, slot, witness and lifecycle rows for that account are removed in the same transaction;
- session hint is reissued only after exact readback.

Delete:
- current password/credential and expected revision required;
- all account-scoped durable rows removed atomically;
- a durable deletion generation/tombstone prevents an already-open stale caller from recreating or mutating the deleted identity;
- matching session hint is cleared after commit;
- a future new account receives a new random account ID.

Browser quota/eviction is never treated as reset/delete. Missing data after unexpected storage loss is an unavailable/corrupt posture, not successful deletion.

## Session invalidation

The localStorage session value remains a non-authoritative hint. Sign-out may clear it without touching IndexedDB.

Reset/delete must invalidate already-open callers through durable revision/generation checks, not by assuming another tab observed the hint change. Every subsequent mutation/load revalidates the account record. Deleted/tombstoned identity blocks. Reset stale revisions block. A stale tab may not republish an old campaign after reset.

## Implementation order

### G9B — Normal Defeat Recovery Publication Owner

First package. This restores the currently blocked ordinary nonterminal defeat path with the smallest new authority surface.

Implement an epoch adapter/caller that:
- resolves an exact retained ready source;
- invokes `completePendingNormalDefeatRecovery`;
- publishes the repaired snapshot through descendant authority;
- completes consumers and exact ready readback;
- proves restart, duplicate receipt, non-head fork, stale account/head/address, bad destination, quota/abort and two-tab contention in native Chromium;
- wires the selected `EpochApp` defeat-recovery path only after owner proof.

Exclusions: retirement/death terminal settlement, slot delete, account reset/delete, Legacy/profile UI expansion, G10 activation.

### G9C — Revisioned Account And Legacy Actions

Wire profile/password and existing Legacy purchase/preparation pure resolvers through account CAS. Prove pending-publication fence, stale revision, duplicate user action and restart/readback. No campaign mutation.

### G9D — Terminal Publication And Lifecycle Settlement

Add terminal descendant + durable lifecycle recovery + exactly-once archive/payout/estate/history settlement. Prove retirement first; ordinary/hardcore death may join only where existing gameplay already supplies authoritative terminal state. No address deletion before settlement.

### G9E — Slot Closure/Delete And Inheritance Consumption

Add explicit address deletion/closed-run cleanup and exact inheritance-use consumption. Preserve immutable history and other addresses.

### G9F — Account Reset/Delete And Session Invalidation

Add account-wide destructive transaction, monotonic reset generation and deletion tombstone/generation. Prove stale tabs, restart, abort/quota and no partial deletion.

G10 remains responsible for coordinated clean-development activation/reset procedure, built-output/legacy-storage audit, long-running/two-context capacity, quota/eviction posture and complete verifiable backup/restore.

## Acceptance and exclusions

G9A changes no production code, schema, dependency, browser storage, branch disposition, Game version, DEV acceptance or deployment state. It does not accept G9, G10, combat or `DEV-0.7.1`.

The next executable package is **DEV-0.7.1 Slice G9B — Normal Defeat Recovery Publication Owner Implementation**.
