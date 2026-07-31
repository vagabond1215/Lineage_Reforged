# Version 0.6.9.4 - Normal Campaign Retry And Recovery Completion Acceptance Audit

## Run Identity

`Version 0.6.9.4 - Normal Campaign Retry And Recovery Completion Acceptance Audit`

Label class: support suffix

Parent version: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`

Milestone impact: `supports_current_band`

Suggested commit:

`docs(save): audit retry and recovery completion acceptance`

## Purpose

Independently audit `Version 0.6.9.3 - New-Campaign Retry, Slot-Recovery Collision, And Pending-Defeat Repair Completion`.

Do not accept the parent from inherited test totals. Reproduce the real application retry, restart, account-and-slot collision, contender ordering, exactly-once consumer, and reachable validated pending-defeat completion boundaries.

This run is read-only inspection and validation unless independent reproduction proves one exact remaining defect. Do not implement the Ashen Reef survey receipt decision.

## Required Reading

Read:

- `AGENTS.md`;
- `docs/dev/codex-failure-patterns-and-verification-guardrails.md`;
- `docs/design/normal-campaign-new-game-retry-and-recovery-collision-audit.md`;
- `docs/design/normal-stakes-campaign-persistence-foundation-acceptance-audit.md`;
- `docs/design/normal-stakes-activation-first-mutation-continuity-and-account-value-publication-dependency-closure-decision.md`;
- `docs/dev/current-codex-output.md`;
- the new-campaign coordinator, `App.tsx`, save manager, run lifecycle, campaign session, Normal defeat, account publication, and focused persistence tests;
- current handoff, historical/deferred register, planning reconciliation, branch policy, and branch register;
- the protected integrated-gameplay readiness branch through read-only Git inspection only.

## Applicable Verification Guardrails

Apply and report:

- `FP-001` through `FP-006`;
- `FP-008` through `FP-010`;
- `FP-007` only if a large documentation file is rewritten.

Green totals alone are insufficient. Include fresh finding-to-test and failure-boundary matrices.

## Post-Commit Connector Audit Targets

Independent connector inspection of committed head `13b79279d07f6e1d06bf44b5b6ddba011694d57c` identified three additional boundaries that must be decided explicitly before acceptance:

1. `completePendingNormalDefeatRecovery(...)` selects the first pending receipt and does not visibly fail closed when more than one pending defeat receipt exists;
2. safe-destination enumeration includes the current `playerState.location.settlementId` by nonempty string alone, so malformed or non-settlement current-location authority may bypass the intended validation;
3. pending-defeat completion updates the retained receipt, Chronicle, notification, time, location, and session revision, but no distinct repair/correction ledger append is visible even though the implementation contract required ledger effects exactly once.

These are audit targets, not preassigned failure conclusions. Reproduce them against the accepted dependency-closure contract and current types. If any target violates accepted authority, report `AUDIT_REPAIR_REQUIRED` and install the smallest exact `0.6.9.5` repair.

## Execution Gate

1. Verify clean synchronized `master`, upstream, current head, and this prompt.
2. Run `git fetch --all --prune`; inspect all local and remote branches and open PRs; refresh live dispositions.
3. Distinguish inspected base, audit starting head, any final committed head, and live post-fetch head.
4. Reproduce the production coordinator path used by `App.tsx`, not only direct repeated `publishSave(...)`.
5. Inject a failure before campaign-head publication and another after verified head publication but before address projection.
6. Discard caller state and repeat the same submission; then simulate restart from durable storage only.
7. Prove the original attempt, character, campaign, continuity, artifact, publication, slot, normalized input, and consumer plans are retained at the boundaries where each identity exists.
8. Prove changed normalized input and mismatched attempt reuse fail closed before new authority is prepared.
9. Independently construct one compatible pending recovery, one incompatible pending recovery, an older hidden recovery versus a newer verified same-slot address, and multiple same-slot recoveries in different storage orders.
10. Prove active history, achievements/account value, preparation consumption, and inheritance consumption remain at most once across failure, retry, and restart.
11. Reproduce a retained `recovery_pending` defeat with a valid authoritative known settlement and exercise the production completion owner called by the launcher.
12. Prove malformed, unknown, unsafe non-settlement, and conflicting destinations reject, including malformed or non-settlement ids present in the current-location `settlementId` field.
13. Submit duplicate repair after a later accepted mutation and prove the retained result returns without rolling back newer snapshot/control state.
14. Construct more than one pending defeat receipt and prove completion fails closed without selecting by receipt-array order or partially repairing one receipt.
15. Prove recovery completion has one accepted provenance trail: the original defeat receipt remains stable, completion state is exactly once, and the authority ledger or accepted correction mechanism records the repair without duplicate append.
16. Prove HP, Stamina, recovery ticks, relocation, Chronicle, notification, and session revision occur exactly once across initial pending resolution plus completion; no effect may be silently applied twice.
17. Prove ordinary mutation, manual save, quick-save, and retirement remain blocked before repair and normal explicit save remains required afterward.
18. Re-run all `0.6.9.2` preservation cases, the focused suite, prescribed Node group, production build, bounded TypeScript audit, mirror checks, `git diff --check`, and complete diff inspection.

If any required boundary is not independently reproducible or fails, keep the parent unaccepted and install the smallest exact `0.6.9.5` repair route. Do not broaden the package.

## Required Acceptance Matrices

Map executable evidence to every confirmed finding and at least:

- pre-head failure;
- post-head/pre-address failure;
- same-process retry;
- caller-state loss/rerender;
- restart;
- compatible recovery;
- incompatible recovery;
- multiple contenders in both enumeration orders;
- older recovery versus newer address;
- account-consumer failure/retry;
- valid pending repair;
- invalid and conflicting destinations;
- malformed or unsafe current-location settlement authority;
- multiple pending defeat receipts;
- repair receipt and ledger/correction provenance exactly once;
- resource, time, relocation, Chronicle, notification, and session-revision effects exactly once across pending resolution and completion;
- duplicate repair after later mutation;
- stale or conflicting attempt input;
- terminal recovery and existing `0.6.9.2` preservation.

## Validation Commands

Run:

```text
node --test tests\unit\campaign-persistence-foundation.test.mjs
```

Run the prescribed group:

```text
node --test tests\simulation\save-load-roundtrip.test.mjs tests\unit\achievements.test.mjs tests\unit\account-profile-storage.test.mjs tests\unit\run-lifecycle.test.mjs tests\unit\player-travel-command.test.mjs tests\unit\player-quest-acceptance-command.test.mjs tests\unit\player-quest-tracking-command.test.mjs tests\unit\player-activity-selection-command.test.mjs tests\unit\combat-hook-support.test.mjs tests\unit\combat-spawn-foundation.test.mjs tests\unit\campaign-persistence-foundation.test.mjs
```

Run the RPG UI production build and the existing bounded TypeScript audit. Report the repository diagnostic total and whether any diagnostic names an audited repair file; do not claim the known repository-wide baseline is green.

## Acceptance Decision

Accept the parent only if all boundaries independently pass and every original `0.6.9.1`, post-`0.6.9.2`, and post-commit connector audit target has executable closure.

On acceptance:

- update the parent audit to `ACCEPTED_AFTER_REPAIR`;
- record `0.6.9.3` as accepted by independent `0.6.9.4`;
- report `AUDIT_ACCEPTED`;
- unlock, but do not run, the unversioned Ashen Reef survey occurrence/result/consequence receipt foundation decision;
- install that exact unversioned decision prompt as the next route.

On failure:

- report `AUDIT_REPAIR_REQUIRED`;
- leave the parent unaccepted;
- install the smallest exact `Version 0.6.9.5 - ...` repair prompt;
- keep the survey route blocked.

## Scope Exclusions

Do not:

- implement survey behavior, receipts, commands, UI, or migrations;
- add Committed or Ironbound Stakes;
- redesign slots, launcher, recovery UI, death, succession, injury, care, or account systems;
- add a generic workflow, transaction, retry, event, command, or replay framework;
- add dependencies, assets, generated output, or unrelated cleanup;
- merge, modify, rebase, force-update, or delete protected branches;
- merge PR #2.

## Completion Report

Report:

- independently reproduced boundaries;
- finding-to-test matrix;
- failure-boundary matrix;
- applicable guardrail IDs and evidence;
- exact commands and counts;
- TypeScript posture;
- inspected-base, starting, final, and live-head identities;
- branch/PR lifecycle and retained review triggers;
- remaining risks;
- `AUDIT_ACCEPTED` or `AUDIT_REPAIR_REQUIRED`;
- parent acceptance status;
- installed next route.
