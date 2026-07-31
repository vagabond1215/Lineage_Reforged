# Version 0.6.9.6 - Pending-Defeat Completion Authority And Provenance Acceptance Audit

## Run Identity

`Version 0.6.9.6 - Pending-Defeat Completion Authority And Provenance Acceptance Audit`

Label class: support suffix

Parent version: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`

Milestone impact: `supports_current_band`

Suggested commit:

`docs(save): audit pending-defeat completion authority`

## Purpose

Independently audit `Version 0.6.9.5 - Pending-Defeat Completion Authority And Provenance Repair`.

Do not accept the parent from inherited totals. Reconstruct the pending-receipt ambiguity, destination-authority, correction-provenance, exactly-once effect, production-caller, publication, duplicate, and restart boundaries from fresh snapshots and storage.

This run is read-only inspection and validation unless independent reproduction proves one exact remaining defect. Do not implement the Ashen Reef survey receipt decision.

## Required Reading

Read:

- `AGENTS.md`;
- `docs/dev/codex-failure-patterns-and-verification-guardrails.md`;
- `docs/design/normal-stakes-campaign-persistence-foundation-acceptance-audit.md`;
- `docs/design/normal-campaign-new-game-retry-and-recovery-collision-audit.md`;
- `docs/design/normal-stakes-activation-first-mutation-continuity-and-account-value-publication-dependency-closure-decision.md`;
- `docs/dev/current-codex-output.md`;
- `packages/shared/types/src/contracts.ts`;
- Normal-defeat, campaign-session, save-manager, `App.tsx`, coordinator, run-lifecycle, account-publication, and focused persistence code/tests;
- current handoff, historical/deferred register, planning reconciliation, branch policy, and branch register;
- the protected integrated-gameplay readiness branch through read-only Git inspection only.

## Applicable Verification Guardrails

Apply and report:

- `FP-001` through `FP-006`;
- `FP-008` through `FP-010`;
- `FP-007` only if a large documentation file is rewritten.

## Execution Gate

1. Verify clean synchronized `master`, upstream, current head, and this exact prompt.
2. Fetch/prune and refresh all branches and open PR dispositions.
3. Distinguish inspected base, audit starting head, any final committed head, and live post-fetch head.
4. Independently construct every required boundary below; do not reuse the implementation run's in-memory fixtures or accept only its totals.

## Required Independent Boundaries

### Pending-receipt uniqueness

- Construct two distinct pending receipts and test original and reversed receipt-array order.
- Prove both the production completion owner and lower-level repair reject with the same stable diagnostic.
- Prove rejection occurs before destination selection, cloning, receipt mutation, clock/resource/relocation changes, Chronicle/notification changes, ledger append, retained mutation result, or session revision.
- Construct zero pending receipts, one pending receipt, and completed historical receipts; verify no first/last-array fallback creates authority.

### Settlement authority

- Test blank, whitespace-padded, unknown, known non-settlement, known-but-false, duplicate, and contradictory current-location ids.
- Test the same malformed/unsafe classes as explicit destinations.
- Independently prove explicit and automatic validation use the same accepted known-settlement evidence.
- Prove one exact valid current settlement, one exact valid campaign-start settlement, and one exact sole known-settlement fallback.
- Prove corrupt current authority does not fall through to another otherwise-safe candidate.
- Prove multiple safe fallback settlements without current/start precedence fail closed independent of location-array order.

### Provenance and effects

- Require exactly one receipt matching campaign, continuity, character, rules, policy, pending posture, and original effect facts.
- Require exactly one original `normal_defeat` ledger entry with matching source mutation.
- Reject missing, duplicate, conflicting, or already-superseded provenance before effects.
- Complete one valid pending receipt and prove the original receipt and original ledger entry remain stable.
- Prove exactly one deterministic `normal_defeat_recovery.<receiptId>` ledger entry exists, uses the stable recovery mutation source, and supersedes the original entry.
- Prove HP and Stamina were restored only at original defeat resolution; completion does not restore them again.
- Prove completion advances four ticks, relocates, updates the retained receipt, Chronicle, notification, ledger, and session revision exactly once.
- Submit duplicate repair after a later accepted mutation and after restart; prove current snapshot/control are not rolled back and no second effect or ledger entry appears.

### Production and publication

- Exercise the completion owner called by the launcher and inspect the actual `App.tsx` caller.
- Prove invalid or ambiguous authority remains blocked with diagnostic state.
- Prove ordinary mutation, manual save, quick-save, and retirement remain blocked before repair.
- Prove repaired state remains unpublished until an explicit save.
- Perform a normal explicit save and reload after repair; verify the correction entry, receipt, projections, session facts, and exactly-once effects survive roundtrip.
- Preserve the production new-campaign coordinator, pre-head/post-head failures, caller loss, restart, changed input, account-and-slot collisions, consumer idempotency, immutable addresses, migration, control guards, and terminal behavior.

## Required Matrices

Provide fresh:

- finding-to-test matrix;
- failure-boundary matrix;
- receipt/provenance/effect matrix;
- branch/PR disposition summary.

Green totals without those matrices are insufficient.

## Validation Commands

Run:

```text
node --test tests\unit\campaign-persistence-foundation.test.mjs
```

Run the prescribed group:

```text
node --test tests\simulation\save-load-roundtrip.test.mjs tests\unit\achievements.test.mjs tests\unit\account-profile-storage.test.mjs tests\unit\run-lifecycle.test.mjs tests\unit\player-travel-command.test.mjs tests\unit\player-quest-acceptance-command.test.mjs tests\unit\player-quest-tracking-command.test.mjs tests\unit\player-activity-selection-command.test.mjs tests\unit\combat-hook-support.test.mjs tests\unit\combat-spawn-foundation.test.mjs tests\unit\campaign-persistence-foundation.test.mjs
```

Run the RPG UI production build, bounded TypeScript audit, mirror checks, `git diff --check`, and complete diff inspection. Report the repository diagnostic total and whether any diagnostic names an audited repair file; do not claim the known repository-wide baseline is green.

## Acceptance Decision

Accept the parent only if every original `0.6.9.1`, post-`0.6.9.2`, post-`0.6.9.3`, and post-`0.6.9.4` boundary has fresh executable closure.

On acceptance:

- update the parent audit to `ACCEPTED_AFTER_REPAIR`;
- record `0.6.9.5` as accepted by independent `0.6.9.6`;
- report `AUDIT_ACCEPTED`;
- unlock, but do not run, the unversioned Ashen Reef survey occurrence/result/consequence receipt foundation decision;
- install that exact unversioned decision prompt as the next route.

On failure:

- report `AUDIT_REPAIR_REQUIRED`;
- leave the parent unaccepted;
- install the smallest exact `Version 0.6.9.7 - ...` repair prompt;
- keep the survey route blocked.

## Scope Exclusions

Do not:

- implement survey behavior, receipts, commands, UI, or migrations;
- add Committed or Ironbound Stakes;
- redesign slots, launcher, recovery UI, defeat, death, succession, injury, care, or account systems;
- add a generic workflow, transaction, retry, correction, event, command, or replay framework;
- add dependencies, assets, generated output, or unrelated cleanup;
- merge, modify, rebase, force-update, or delete protected branches;
- merge or close PR #2.

## Completion Report

Report:

- independently reproduced boundaries and matrices;
- applicable guardrail IDs and evidence;
- exact commands and counts;
- TypeScript posture;
- inspected-base, starting, final, and live-head identities;
- branch/PR lifecycle and retained review triggers;
- remaining risks;
- `AUDIT_ACCEPTED` or `AUDIT_REPAIR_REQUIRED`;
- parent acceptance status;
- installed next route.
