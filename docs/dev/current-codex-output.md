# Current Codex Output

## Run Identity

- Source run: `Version 0.6.9.4 - Normal Campaign Retry And Recovery Completion Acceptance Audit`
- Date: 2026-07-31
- Branch/status assumption: synchronized `master`; audit documentation pending commit at report write
- Pre-sync inspected local base: `13b79279d07f6e1d06bf44b5b6ddba011694d57c`
- Audit starting head after required pull: `2b4090b161b4e1d4f56f40e5eb8a799c3190ef46`
- Live post-fetch head before audit documentation: `2b4090b161b4e1d4f56f40e5eb8a799c3190ef46`
- Final committed head: resolve after this self-referential report is committed; the completion response must state the exact SHA
- Label class: support suffix
- Parent version: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`
- Milestone impact: `supports_current_band`
- Suggested commit: `docs(save): audit retry and recovery completion acceptance`

## Outcome

`AUDIT_REPAIR_REQUIRED`

The `0.6.9` parent remains unaccepted. Independent execution preserved the reported `0.6.9.3` baseline, but proved all three post-commit audit targets fail:

1. completion accepts more than one pending defeat receipt and repairs the first array entry while leaving another pending;
2. an unvalidated current-location `settlementId` backed only by a known `ruin` is accepted as a safe settlement;
3. recovery completion changes the receipt and projections but appends no repair/correction authority-ledger entry.

The Ashen Reef survey receipt-foundation decision remains blocked. The installed next route is:

`Version 0.6.9.5 - Pending-Defeat Completion Authority And Provenance Repair`

## Independently Reproduced Findings

| Finding | Independent executable result | Disposition |
| --- | --- | --- |
| Multiple pending receipts | Two distinct `recovery_pending` receipts were constructed. Completion returned `accepted: true`, repaired the first receipt by array order, and left one receipt pending. | blocking defect |
| Unsafe current-location authority | A pending snapshot was given `playerState.location.settlementId = "settlement.unsafe_ruin"` and a matching known location of type `ruin`. Completion without an explicit destination accepted and relocated there. | blocking defect |
| Missing repair provenance | A valid pending repair was completed against a known settlement. Ledger entry count remained `1 -> 1`; no correction/supersession entry was appended. | blocking defect |

## Finding-To-Test Matrix

| Finding or preservation boundary | Evidence | Result |
| --- | --- | --- |
| Real new-campaign retry identity | focused test `production new-campaign coordinator retains exact authority across retry caller loss and restart`; `App.tsx` production invocation inspection | pass |
| Pre-head candidate failure | focused test `new-campaign attempt retains campaign identity across a pre-head candidate failure` | pass |
| Post-head/pre-address failure | focused low-level publication test plus production coordinator retry test | pass |
| Changed normalized input / mismatched retry | production coordinator focused assertions | pass |
| Compatible/incompatible account-slot recovery | coordinator and slot-inspection focused assertions | pass |
| Older recovery versus newer address | focused collision test | pass |
| Multiple publication contenders in different key orders | focused collision test sorts and fails closed deterministically | pass |
| Account consumer retry and exactly-once value | durable publication plan and consumer receipt focused tests | pass |
| Valid pending-defeat completion owner | focused repair test and `App.tsx` launcher caller inspection | pass for one pending receipt |
| Invalid explicit destination | malformed and known non-settlement focused assertions | pass for explicit input |
| Multiple pending defeat receipts | independent fresh-storage audit script | **fail** |
| Malformed/unsafe current-location settlement authority | independent fresh-storage audit script with matching `ruin` record | **fail** |
| Repair ledger/correction provenance exactly once | independent ledger before/after assertion | **fail** |
| Duplicate repair after later mutation | focused repair test | pass |
| Ordinary mutation/publication blocking | focused admission and publication assertions | pass |
| Manual save, quick-save, and retirement blocking | `App.tsx` production guard inspection | pass |
| Explicit save after repair | production publication gate permits repaired snapshots; dedicated executable acceptance remains required in `0.6.9.5`/its audit | not independently closed |
| Existing `0.6.9.2` preservation | focused and prescribed suites | pass |

No confirmed finding was deferred or waived. The three failures and the explicit-save evidence gap are mapped into `0.6.9.5`.

## Failure-Boundary Matrix

| Boundary | Fresh evidence | Audit result |
| --- | --- | --- |
| Before campaign-head publication | injected candidate exact-readback failure retains the prepared attempt | pass |
| After verified head before address | injected address projection failure retains exact publication authority | pass |
| Same-process retry | coordinator resumes retained attempt | pass |
| Caller-state loss/rerender | preparation callback is not reinvoked | pass |
| Restart from storage only | coordinator reloads exact attempt and publication | pass |
| Compatible recovery | matching attempt id resumes | pass |
| Incompatible recovery | mismatched account-slot recovery blocks | pass |
| Multiple same-slot publication recoveries | deterministic fail-closed result independent of storage order | pass |
| Older recovery versus newer address | newer verified address remains authoritative | pass |
| Account-consumer failure/retry | durable plans and applied receipts remain idempotent | pass |
| One valid pending repair | known settlement accepted once | pass |
| Explicit malformed/unsafe destination | rejected | pass |
| Unsafe current-location field | accepted as a ruin-backed destination | **fail** |
| Multiple pending defeat receipts | first receipt selected and partially repaired | **fail** |
| Repair provenance | no ledger append | **fail** |
| Resource/time/relocation/projection/session effects | existing single-receipt case applies one four-tick repair and one revision; must be re-proven with correction append | partial, repair audit required |
| Duplicate repair after later mutation | retained result returns without rollback | pass |
| Pending ordinary mutation/save/quick-save/retirement | blocked | pass |
| Normal explicit save after completion | structurally available; dedicated executable proof required | open acceptance evidence |

## Applicable Verification Guardrails

- `FP-001`: inspected the `App.tsx` launcher owner and ran the production new-campaign coordinator test, not only `publishSave(...)`.
- `FP-002`: fresh adversarial sequences contradicted a fully green inherited suite; the matrices above control the decision.
- `FP-003`: the production completion owner is reachable, but its validation is insufficient for malformed current-location authority.
- `FP-004`: account-and-slot publication collision coverage remains green.
- `FP-005`: same-process retry, caller loss, restart, and regenerated submission coverage remain green.
- `FP-006`: publication repair preserves newer truth; pending-defeat completion nevertheless selects receipt-array order and therefore fails closedness.
- `FP-007`: this large report was replaced only after the complete prior file was read; the complete written file must be reread before commit.
- `FP-008`: every non-default branch and PR #2 was compared semantically; none supplies or overlaps this repair.
- `FP-009`: pre-sync inspected base, post-pull audit start, pre-documentation live head, and final commit identity are kept distinct.
- `FP-010`: all three connector targets were independently executed and each maps to an exact repair contract and test gate.

## Checks Run

- remote synchronization: fetched/pruned, then fast-forwarded local `master` by three commits to `2b4090b161b4e1d4f56f40e5eb8a799c3190ef46`;
- independent adversarial Node audit: passed its assertions while demonstrating all three prohibited current behaviors;
- focused persistence suite: `23 / 23`;
- prescribed Node regression group: `130 / 130`;
- RPG UI production build: passed, `209` modules transformed; the generated audit build directory was removed afterward;
- bounded TypeScript audit: repository remains known-failing with `137` diagnostics and exit code `2`; `0` diagnostics name an audited repair surface;
- TypeScript/JavaScript mirrors: all five owner/coordinator mirrors matched;
- pre-documentation `git diff --check`: passed.

No GitHub Actions run was requested or attached. These are local audit results.

## Branch And PR Lifecycle

- Local branches: only synchronized `master`.
- Non-default remote branches: seventeen.
- Open PRs: PR #2 only; head `e78dc645cfb658685be12f45f46d34b7c0da1119`, base `master`, open, non-draft, non-mergeable.
- Live ahead/behind counts from audit start:
  - `feat/main-menu-assets`: `708 / 0`;
  - `main-menu-asset-contract-pass`: `636 / 10`, four paths;
  - `main-menu-refinement-pass`: `643 / 2`, two paths;
  - eight `bcbe658d` one-document branches: `42 / 1` each;
  - four `3006c968` one-document branches: `44 / 1` each;
  - `parallel/prompt-packaging-integrity-audit`: `71 / 1`;
  - `prep/integrated-gameplay-0-7-readiness-audit`: `124 / 2`.
- Both protected references were inspected read-only and left untouched.
- PR #2 remains `SUPERSEDED_PRESERVE_EVIDENCE`; the twelve one-document branches remain `CANDIDATE_INTEGRATION`; the two protected branches remain `PROTECTED_REFERENCE`.
- No merge, cherry-pick, rebase, PR closure, branch deletion, or disposition change was due.
- Retained review triggers remain the exact owner-specific triggers in `docs/dev/branch-disposition-register.md`; the repair does not activate any of them.

## Files Changed

- `docs/design/normal-stakes-campaign-persistence-foundation-acceptance-audit.md`
- `docs/dev/branch-disposition-register.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/historical-version-and-deferred-route-register.md`
- `docs/design/current-planning-anchor-reconciliation.md`

No production source, test, schema, dependency, content, asset, or generated file is changed by this audit.

## Risks And Follow-Up

- A stored campaign with multiple pending receipts can currently be partially repaired while remaining blocked.
- Corrupt or contradictory current-location authority can currently be promoted into relocation truth.
- The original defeat ledger entry cannot currently prove when or how pending recovery was completed.
- The repository-wide TypeScript baseline remains a separate known-failing route.

## Next Recommended Run

`Version 0.6.9.5 - Pending-Defeat Completion Authority And Provenance Repair`

Classification: parent-specific support suffix.

The survey occurrence/result/consequence receipt decision remains blocked until `0.6.9.5` is implemented and a later independent audit accepts the parent.
