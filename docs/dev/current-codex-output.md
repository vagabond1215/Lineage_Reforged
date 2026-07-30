# Current Codex Output

## Inspection Identity

- Inspection: connector post-repair review of `Version 0.6.9.2 - Normal Campaign Publication Recovery Repair`
- Date: 2026-07-30
- Inspected live head: `cdfe4b51c8c0e19517d02d3d11aa4c63f7d2cb6b`
- Commit: `fix(save): repair Normal campaign publication recovery`
- Label class: parent-support inspection
- Parent version: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`
- Milestone impact: `supports_current_band`

## Outcome

`REPAIR_REQUIRED`

`0.6.9.2` repaired the six defects recorded by `0.6.9.1` and added immutable playable-address verification. The reported focused persistence suite passes 20/20, the prescribed group passes 127/127, and the RPG UI production build passes.

Independent inspection found that parent acceptance remains premature because the real launcher character-creation retry path does not reuse the retained publication after a post-head address failure. The low-level same-snapshot retry test passes, but the application generates new character, campaign, and continuity ids on each user submission. A second click can therefore publish campaign B while campaign A remains hidden in durable recovery evidence. Startup recovery can later rewrite the same slot back to campaign A.

The implementation also blocks `recovery_pending` play but exposes no production-reachable, authority-valid completion owner. The engine helper accepts any nonempty destination string rather than proving a valid safe destination from current world facts.

The parent `0.6.9`, audit `0.6.9.1`, and repairs `0.6.9.2` remain unaccepted pending exact support repair `0.6.9.3` and its independent successor acceptance audit.

## Confirmed Passing `0.6.9.2` Evidence

The implementation provides:

- durable publication recovery evidence before campaign-head and address transitions;
- same-snapshot low-level retry without minting another head;
- immutable artifact verification for target addresses and recovery;
- durable account-consumer plans outside account storage;
- terminal campaign closure while mandatory consumer work repairs;
- deferred same-slot migrated HP-zero head and non-head repair;
- missing, invalid, closed, stale, changed, and wrong-artifact campaign-control rejection;
- ordinary mutation and publication blocking under `recovery_pending`;
- retained duplicate mutation snapshot/control/result correlation;
- conflicting mutation-id rejection.

These foundations should be preserved by the next repair.

## Blocking Findings

### 1. New-campaign UI retry regenerates authority

The character-creation handler calls `createNewGameSnapshot(...)` on every submission. That function creates a new character id and initializes new campaign and continuity ids.

If publication verifies a campaign head and then address projection fails, `publishSave(...)` throws before returning. The handler retains no publication or prepared snapshot and only displays an error. The next click creates a distinct campaign rather than recovering the hidden verified publication.

### 2. Pending recovery can overwrite a later valid slot address

Publication recovery is keyed by campaign id but retains a slot id. Startup recovery enumerates pending recoveries and projects each retained envelope back to its slot.

A later valid campaign in the same slot can therefore be replaced by an older hidden recovery. Multiple recoveries for one slot are effectively ordered by storage enumeration, which is not accepted authority.

### 3. `recovery_pending` has no reachable validated completion path

Campaign mutation admission blocks ordinary mutations while a pending defeat receipt exists. `App.tsx` blocks saving and retirement and displays a notice, but no production caller submits `recovery_repair`.

The repair helper accepts any nonempty destination id and does not prove that it is a known, safe settlement. A real pending campaign can remain soft-locked or later be repaired with unvalidated destination input.

## Repository Updates From This Inspection

Added:

- `docs/design/normal-campaign-new-game-retry-and-recovery-collision-audit.md`

Installed:

- `Version 0.6.9.3 - New-Campaign Retry, Slot-Recovery Collision, And Pending-Defeat Repair Completion`

Corrected current acceptance and routing documentation so the Ashen Reef survey receipt decision is blocked until `0.6.9.3` is implemented and independently accepted.

No production source or tests were changed by the connector inspection.

## Subsequent Workflow Synchronization

After the inspection:

- `docs/dev/codex-failure-patterns-and-verification-guardrails.md` was added as durable project-specific workflow authority;
- `AGENTS.md` now requires applicable pattern IDs and verification evidence in implementation, repair, and acceptance completion reports;
- the active `0.6.9.3` prompt explicitly applies `FP-001` through `FP-006` and `FP-008` through `FP-010`, with `FP-007` conditional on large documentation replacement;
- the prompt now includes `apps/rpg-ui/src/game-shell/runLifecycle.ts` in the bounded production surface because current new-game lifecycle authority resides there;
- the prompt requires finding-to-test and failure-boundary matrices;
- a green implementation must report `IMPLEMENTED_PENDING_PARENT_AUDIT` and install `Version 0.6.9.4 - Normal Campaign Retry And Recovery Completion Acceptance Audit`;
- the implementation run may not accept its own parent or advance to survey work.

These workflow updates are documentation-only and did not rerun the prior implementation tests.

## Prior Validation Evidence

Codex reported for `0.6.9.2`:

- baseline prescribed Node group before repair: 120/120;
- focused persistence suite after repair: 20/20;
- fresh prescribed Node group after repair: 127/127;
- RPG UI Vite production build: passed with 207 modules transformed;
- bounded TypeScript audit: known 173-diagnostic repository baseline, with zero diagnostics naming changed files;
- `git diff --check`: passed.

No hosted GitHub Actions run or commit status was attached to `cdfe4b51`; those are local Codex results.

## Applicable Verification Guardrails For `0.6.9.3`

- `FP-001`: actual application caller path;
- `FP-002`: automated validation plus failure-boundary review;
- `FP-003`: production-reachable validated blocked-state completion;
- `FP-004`: account-and-slot recovery scope;
- `FP-005`: lost or regenerated caller state and restart;
- `FP-006`: stale and competing projection protection;
- `FP-008`: semantic branch compatibility if integration is considered;
- `FP-009`: exact inspected-base, starting, final, and live-head terminology;
- `FP-010`: complete finding-to-test reconciliation;
- `FP-007`: conditional only if a large documentation file is replaced.

## Branch And PR Lifecycle

At the latest completed Codex inventory:

- local branches: only `master`;
- non-default remote branches: 17;
- open pull requests: PR #2 only;
- two protected references remain read-only;
- twelve one-document connector audit branches retain named integration triggers;
- PR #2 remains `SUPERSEDED_PRESERVE_EVIDENCE`;
- no registered branch implements the required `0.6.9.3` repair.

The next run must fetch and prune, refresh all live facts, and report whether any integration, closure, or deletion is due. No unrelated branch work should be folded into the parent-specific repair.

## Risks And Follow-Up

- Existing local-storage recovery evidence may already contain same-slot collisions; the repair must define deterministic quarantine or explicit resolution rather than silently choosing one.
- New-campaign attempt identity must remain bounded and must not become a generic workflow framework.
- The pending-defeat completion owner must validate destination authority without broad recovery UI redesign.
- Green implementation evidence does not independently accept the parent; `0.6.9.4` remains mandatory.
- Workspace typecheck remains a separate known-failing 173-diagnostic audit.
- `0.7.0` remains `NOT_READY`.

## Next Required Run

`Version 0.6.9.3 - New-Campaign Retry, Slot-Recovery Collision, And Pending-Defeat Repair Completion`

Classification: parent-specific support suffix.

On green implementation, install:

`Version 0.6.9.4 - Normal Campaign Retry And Recovery Completion Acceptance Audit`

The Ashen Reef survey occurrence/result/consequence receipt decision must not run until that independent audit accepts the parent.
