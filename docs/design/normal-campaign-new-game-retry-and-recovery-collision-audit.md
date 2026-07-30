# Normal Campaign New-Game Retry And Recovery Collision Audit

Date: 2026-07-30

Run: connector post-repair inspection of `Version 0.6.9.2 - Normal Campaign Publication Recovery Repair`

Parent: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`

Label class: support-chain audit

Milestone impact: `supports_current_band`

Status: `REPAIR_REQUIRED`

## Decision

`Version 0.6.9.2` repaired the six defects recorded by the parent acceptance audit and added immutable playable-address verification. The focused persistence and prescribed regression groups were reported green, and the RPG UI production build passed.

Parent acceptance is nevertheless withdrawn because the real launcher new-campaign retry path does not reuse the retained publication identity after a post-head address failure. A second click can create a distinct campaign for the same intended character-creation attempt, while startup recovery can later rewrite the slot back to the hidden first campaign. `recovery_pending` also has no production-accessible, authority-valid completion path.

The next run is exact parent support repair:

`Version 0.6.9.3 - New-Campaign Retry, Slot-Recovery Collision, And Pending-Defeat Repair Completion`

The Ashen Reef survey receipt decision remains blocked until this repair is implemented and independently accepted.

## Confirmed Passing Repair Evidence

The `0.6.9.2` implementation provides:

- publication recovery evidence persisted before campaign-head and address transitions;
- same-snapshot low-level retry of a post-head address failure without minting a second head;
- immutable artifact verification for playable addresses and recovery;
- durable account-consumer plans outside the account store;
- deferred migrated HP-zero repair for separately loaded head and non-head artifacts;
- missing, invalid, closed, stale, and changed campaign-control rejection;
- ordinary mutation and publication blocking while Normal recovery is pending;
- retained duplicate-mutation result semantics and conflicting-id rejection.

These foundations must be preserved.

## Blocking Finding 1: Real New-Campaign Retry Regenerates Authority

The character-creation handler creates a fresh target snapshot for every submission. `createNewGameSnapshot(...)` creates a new character id, and campaign initialization creates new campaign and continuity ids when no identity is supplied.

If `publishSave(...)` verifies the first campaign head and then fails while projecting the playable slot address, it throws before returning. The handler therefore retains no publication, snapshot, campaign identity, or retry token. Its catch path displays a storage error but cannot correlate the next click with the hidden verified publication.

A second click creates a fresh character, campaign, continuity, artifact, generation, and publication chain. The pending recovery for the first campaign is keyed by the first campaign id and does not intercept the second campaign publication.

This violates the accepted requirement that retry recover the exact verified gameplay truth rather than minting a second campaign.

## Blocking Finding 2: Slot Recovery Can Overwrite A Later Valid Campaign

Publication recovery records retain a target slot id. Startup recovery enumerates retained recoveries and reprojects each verified artifact to that slot.

If the user successfully creates campaign B in the same slot after campaign A was hidden by an address failure, later recovery for campaign A can overwrite campaign B's playable address. Both campaigns may retain valid immutable artifacts and campaign controls, but only the last projected address is visible through the launcher.

If more than one pending recovery targets one slot, sequential recovery order is storage-enumeration dependent. Account-consumer repair then searches currently visible slots for matching publications, so an overwritten campaign can remain unresolved.

The repair must prevent an older pending recovery from silently replacing a newer valid address and must fail closed on ambiguous multiple-recovery collisions.

## Blocking Finding 3: Pending Defeat Has No Reachable Validated Completion Owner

The engine now exposes `recovery_repair` mutation admission and blocks ordinary mutations while `recovery_pending` exists. The application shell only imports and uses the pending check to display blocking notices. It does not provide a production caller for the repair admission.

The repair helper currently accepts any nonempty destination string. It does not itself prove that the destination is a valid, known, safe settlement under current world facts.

A live or loaded pending campaign can therefore remain permanently blocked, while a future direct caller could supply an unvalidated destination.

The repair must provide one bounded, production-reachable recovery owner that derives or validates a safe destination, submits the exact retained pending receipt through campaign mutation admission, and proves exactly-once completion.

## Required `0.6.9.3` Contract

### New-campaign attempt identity

Before creating campaign authority, the application must establish a stable new-campaign attempt identity and retain enough exact prepared state to resume the same attempt after a post-head failure. Equivalent retry must reuse the original character, campaign, continuity, consumer-plan, and target-slot evidence.

The attempt may be session-scoped before publication, but once a campaign head is verified its retry correlation must be durable or deterministically discoverable from publication recovery authority.

### Slot-level pending-publication gate

Before creating or publishing a new campaign into a slot, inspect all pending publication recoveries for the account and slot.

- One compatible pending new-campaign publication must be recovered and resumed.
- One incompatible pending publication must block overwrite and present an explicit recovery/conflict diagnostic.
- Multiple pending recoveries for one slot must fail closed into deterministic quarantine or owner-selected resolution; storage enumeration order must never choose authority.
- A newer valid playable address must not be replaced by an older recovery without an explicit, validated equivalence or supersession decision.

### Account consumer preservation

The exact original consumer plans and fingerprints must remain attached to the recovered publication. Retrying the launcher action must not consume preparation or inheritance twice and must not create two active history records for one intended start.

### Pending-defeat completion

Provide a bounded production path that:

1. loads the retained pending defeat receipt;
2. derives or validates one safe destination from current authoritative world/location facts;
3. rejects arbitrary, unknown, or unsafe destination ids;
4. submits one `recovery_repair` campaign mutation using the retained session and receipt evidence;
5. preserves the original defeat result and applies recovery time, destination, HP/Stamina, Chronicle, notification, and ledger changes exactly once;
6. leaves the repaired snapshot unpublished until an explicit later save unless the accepted contract explicitly requires publication;
7. exposes a clear shell state and diagnostic throughout repair.

## Required Tests

Add executable coverage for:

- the actual character-creation handler or an extracted production coordinator, with injected post-head address failure followed by a second user submission;
- proof that the second submission recovers the original character, campaign, continuity, artifact, publication, and consumer plan rather than creating new authority;
- restart after hidden new-campaign publication;
- an older pending recovery competing with a newer valid address in the same slot;
- two pending recoveries targeting one slot, with deterministic fail-closed behavior;
- preparation and inheritance consumption exactly once across retry and restart;
- active-history creation exactly once;
- production-reachable pending-defeat repair with valid destination evidence;
- rejection of unknown or unsafe recovery destinations;
- duplicate repair submission after later mutations;
- preservation of the existing 127-test prescribed baseline, focused persistence tests, UI production build, immutable-address verification, account-consumer repair, migration repair, control guards, and duplicate-mutation behavior.

## Scope Boundary

The repair may change only the narrow campaign/save/session/new-game/recovery shell surfaces and focused tests required for these findings.

Do not:

- implement the Ashen Reef survey command or receipt foundation;
- redesign save slots, character creation, the launcher, or general recovery UI;
- add Committed or Ironbound Stakes;
- add cloud synchronization;
- build a generic transaction, retry, workflow, or replay framework;
- alter gameplay balance beyond the already accepted Normal recovery contract;
- merge unrelated branches or PR #2.

## Branch And PR Posture

No registered connector audit branch implements this repair. Protected branches remain read-only. PR #2 remains unrelated and semantically superseded. The repair run must fetch, prune, refresh all branch and PR dispositions, and state explicitly whether any lifecycle action is due.

## Next Run

`Version 0.6.9.3 - New-Campaign Retry, Slot-Recovery Collision, And Pending-Defeat Repair Completion`
