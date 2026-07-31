# Current Codex Output

## Run Identity

- Source run: `Version 0.6.9.3 - New-Campaign Retry, Slot-Recovery Collision, And Pending-Defeat Repair Completion`
- Date: 2026-07-30
- Branch/status: committed and synchronized on `master`
- Inspected base: `e873f45159a460f917ecf53b4b26091efe358764`
- Implementation starting head: `e873f45159a460f917ecf53b4b26091efe358764`
- Final committed head: `13b79279d07f6e1d06bf44b5b6ddba011694d57c`
- Live post-fetch head: `13b79279d07f6e1d06bf44b5b6ddba011694d57c`
- Commit: `fix(save): complete new-campaign and pending-defeat recovery`
- Label class: support suffix
- Parent version: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`
- Milestone impact: `supports_current_band`

## Outcome

`IMPLEMENTED_PENDING_PARENT_AUDIT`

The three post-`0.6.9.2` findings are implemented and locally green. This run does not accept the `0.6.9` parent. Independent acceptance remains assigned to:

`Version 0.6.9.4 - Normal Campaign Retry And Recovery Completion Acceptance Audit`

The Ashen Reef survey receipt decision remains blocked until that audit accepts the parent.

## Reproduced Defects

1. Repeated production character-creation preparation minted different character, campaign, and continuity identities for identical form input.
2. Account-wide recovery could project an older hidden campaign over a different newer verified same-slot address and selected multiple contenders by storage enumeration.
3. `recovery_pending` had no application caller, while direct repair accepted any nonempty destination.

## Files Changed

- `apps/rpg-ui/src/App.tsx`
- `apps/rpg-ui/src/game-shell/newCampaignAttemptCoordinator.ts`
- `apps/rpg-ui/src/game-shell/newCampaignAttemptCoordinator.js`
- `apps/rpg-ui/src/game-shell/saveManager.ts`
- `apps/rpg-ui/src/game-shell/runLifecycle.ts`
- `packages/engines/game-engine/src/campaign-session.ts`
- `packages/engines/game-engine/src/normal-defeat.ts`
- `packages/engines/game-engine/src/index.ts`
- `tests/unit/campaign-persistence-foundation.test.mjs`
- `docs/design/normal-stakes-campaign-persistence-foundation-acceptance-audit.md`
- `docs/dev/branch-disposition-register.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/historical-version-and-deferred-route-register.md`
- `docs/design/current-planning-anchor-reconciliation.md`

## Patch Summary

- Added a new-campaign-specific durable attempt coordinator keyed by account and slot. It canonicalizes normalized input, mints one attempt id, stores the exact prepared snapshot and consumer plans before publication, reuses them after caller-state loss or restart, and rejects changed input.
- Correlated new-campaign publication recovery with the attempt id. The real `App.tsx` path now uses the coordinator, resumes an already projected matching publication, replays publication-keyed consumers idempotently, and removes attempt evidence only after mandatory consumers complete.
- Added an account-and-slot recovery posture query with `none`, `compatible`, `incompatible`, and deterministic `multiple` results.
- Recovery now groups contenders by slot, sorts identities deterministically, refuses ambiguous collisions, preserves a different verified campaign address, and permits only same-campaign forward supersession proven by the current campaign head.
- Added authoritative safe-destination validation for Normal defeat repair. Only current, campaign-start, or known settlement facts qualify; malformed, unknown, and non-settlement locations fail closed.
- Added `completePendingNormalDefeatRecovery(...)` as the exactly-once campaign-admission owner. Duplicate completion after later accepted mutations returns the retained result without rolling back newer session state.
- The launcher load path now automatically repairs a pending defeat only when a deterministic safe settlement is available, enters with a clear unsaved-repair notice, and otherwise preserves the blocking diagnostic.
- Preserved legacy/developer-fixture retirement by binding terminal publication to retained target campaign authority rather than overwriting a different campaign address.

## Finding-To-Test Matrix

| Finding | Implementation owner | Executable evidence | Disposition |
| --- | --- | --- | --- |
| 1. New-campaign retry regenerates authority | `newCampaignAttemptCoordinator.ts`, invoked by `App.tsx` | production coordinator post-head retry, caller loss, restart, pre-head failure, changed-input conflict, static App caller assertions | implemented |
| 2. Same-slot recovery collision | `saveManager.ts` slot posture and guarded address recovery | compatible/incompatible classification, older recovery versus newer address, multiple contenders in reversed enumeration order, existing immutable-address and migration cases | implemented |
| 3. Pending defeat has no validated completion path | `campaign-session.ts`, `normal-defeat.ts`, `App.tsx` | valid production owner, unsafe/unknown/malformed rejection, duplicate after later mutation, ordinary admission/publication blocking, static App caller assertion | implemented |

## Failure-Boundary Matrix

| Boundary | Evidence |
| --- | --- |
| Before campaign-head publication | candidate-write/readback failure retains the same attempt, character, campaign, and continuity identity for retry |
| After verified head before address | injected address failure retains attempt, artifact, publication, slot, snapshot, and consumer plans |
| Same-process retry | exact retained attempt and low-level publication recovery |
| Caller-state loss/rerender | a second coordinator invocation does not invoke preparation again |
| Restart | storage-only coordinator re-entry finds the exact projected publication |
| Compatible recovery | matching attempt id returns `compatible` and resumes |
| Incompatible recovery | no matching durable attempt blocks before preparation |
| Multiple same-slot recoveries | sorted deterministic error remains identical after storage-key reinsertion in reverse order |
| Older recovery versus newer address | recovery throws and the newer verified publication remains loadable |
| Account-consumer failure/retry | retained consumer plans plus existing durable consumer failure tests; publication receipts and active history remain one per publication/character |
| Valid pending repair | known settlement admitted through `recovery_repair`; original receipt retained; four ticks and recovery surfaces apply once |
| Invalid pending repair | malformed, unknown, and known non-settlement ids reject |
| Duplicate completion | after a later accepted mutation, duplicate repair returns retained result while preserving current snapshot/control |
| Stale/conflicting attempt | changed normalized input and mismatched attempt recovery fail closed |

## Applicable Verification Guardrails

- `FP-001`: tests execute the production coordinator used by `App.tsx`; static source assertions prove the App caller and pending-repair caller remain wired.
- `FP-002`: the failure-boundary matrix above supplements test totals.
- `FP-003`: `completePendingNormalDefeatRecovery(...)` is restart-safe through retained snapshot/control authority, validates destinations, and is called by launcher run entry.
- `FP-004`: all recovery posture and collision decisions are made at account-and-slot scope.
- `FP-005`: repeated submission, caller loss, restart, pre-head failure, post-head failure, and changed input are executable cases.
- `FP-006`: distinct verified addresses cannot be replaced; same-campaign forward replacement requires current-head supersession evidence; multiple contenders fail closed deterministically.
- `FP-007`: this full current-output replacement was performed only after reading the complete source, and the written file is reread during final documentation verification.
- `FP-008`: all seventeen non-default remote branches and PR #2 were semantically reviewed; none overlaps the repair and none was integrated.
- `FP-009`: inspected base, implementation start, final committed head, and live post-fetch head are recorded as distinct facts above.
- `FP-010`: every confirmed finding maps to an implementation owner, executable evidence, and disposition above.

## Checks Run

- actual duplicate character-creation preparation reproduction: confirmed distinct ids before editing;
- focused persistence suite: `23 / 23`;
- prescribed Node regression group: `130 / 130`;
- RPG UI production build: passed, `209` modules transformed;
- bounded TypeScript audit: repository remains known-failing with `137` diagnostics; `0` diagnostics name a changed production file;
- `git diff --check`: passed;
- complete diff and scope inspection: passed;
- TypeScript/JavaScript mirrors: campaign owner mirrors and the new coordinator mirror verified by tests.

No GitHub Actions workflow run is attached to the final commit. The validation above is local Codex evidence and remains subject to the independent `0.6.9.4` audit.

## Branch And PR Lifecycle

- Fetch/prune completed at starting head `e873f45159a460f917ecf53b4b26091efe358764`.
- Local branches: only `master`.
- Non-default remote branches: seventeen.
- Open PRs: PR #2 only; it remains non-mergeable, unrelated, and `SUPERSEDED_PRESERVE_EVIDENCE`.
- Protected readiness and prompt-packaging branches remained read-only.
- All twelve one-document connector branches remain at their named integration triggers.
- Legacy menu branches remain at their existing retirement or evidence-preservation triggers.
- No merge, cherry-pick, rebase, closure, deletion, or disposition change was due.
- The live counts and paths are refreshed in `docs/dev/branch-disposition-register.md`.

## Risks And Follow-Up

- Existing installations with multiple same-slot recoveries now fail closed and require a later explicit resolution policy; this package intentionally does not choose a winner.
- A pending defeat with no authoritative safe settlement remains blocked, as required; the application cannot invent recovery geography.
- The repository-wide TypeScript baseline is still nonzero and remains outside this bounded package.
- Parent acceptance is intentionally deferred to the independent `0.6.9.4` audit.

## Next Recommended Run

`Version 0.6.9.4 - Normal Campaign Retry And Recovery Completion Acceptance Audit`

Classification: parent-specific support suffix; read-only audit unless independent reproduction proves one exact remaining repair.
