# Version 0.6.9.5 - Pending-Defeat Completion Authority And Provenance Repair

## Run Identity

`Version 0.6.9.5 - Pending-Defeat Completion Authority And Provenance Repair`

Label class: support suffix

Parent version: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`

Milestone impact: `supports_current_band`

Suggested commit:

`fix(save): harden pending-defeat completion authority`

## Purpose

Repair exactly the three defects independently reproduced by `Version 0.6.9.4 - Normal Campaign Retry And Recovery Completion Acceptance Audit`:

1. more than one pending Normal-defeat receipt is selected by receipt-array order and partially repaired;
2. a current-location `settlementId` can be accepted without exact authoritative settlement evidence;
3. completion appends no distinct correction/supersession provenance to the campaign authority ledger.

Preserve every passing `0.6.9.2` and `0.6.9.3` boundary. Do not implement the Ashen Reef survey receipt decision.

## Required Reading

Read:

- `AGENTS.md`;
- `docs/dev/codex-failure-patterns-and-verification-guardrails.md`;
- `docs/design/normal-stakes-campaign-persistence-foundation-acceptance-audit.md`;
- `docs/design/normal-campaign-new-game-retry-and-recovery-collision-audit.md`;
- `docs/design/normal-stakes-activation-first-mutation-continuity-and-account-value-publication-dependency-closure-decision.md`;
- `docs/dev/current-codex-output.md`;
- `packages/shared/types/src/contracts.ts`;
- `packages/engines/game-engine/src/normal-defeat.ts` and its JavaScript mirror;
- `packages/engines/game-engine/src/campaign-session.ts` and its JavaScript mirror;
- `packages/engines/game-engine/src/index.ts`;
- `apps/rpg-ui/src/App.tsx`;
- `apps/rpg-ui/src/game-shell/saveManager.ts`;
- `tests/unit/campaign-persistence-foundation.test.mjs`;
- current handoff, historical/deferred register, planning reconciliation, branch policy, and branch register;
- the protected integrated-gameplay readiness branch through read-only Git inspection only.

## Applicable Verification Guardrails

Apply and report:

- `FP-001` through `FP-006`;
- `FP-008` through `FP-010`;
- `FP-007` only if a large documentation file is rewritten.

## Execution Gate

1. Verify clean synchronized `master`, upstream, current head, and this exact prompt.
2. Fetch/prune and refresh every local/remote branch and open PR disposition.
3. Reproduce all three defects before editing with fresh constructed snapshots.
4. Keep the patch within the Normal-defeat completion owner, its existing export/mirror surfaces, focused tests, and required coordination documents.
5. Do not add dependencies or a generic recovery, transaction, correction, receipt, or replay framework.

## Exact Repair Contract

### 1. Unique pending-receipt authority

- Completion must enumerate pending Normal-defeat receipts.
- Exactly one pending receipt is required for a new completion.
- More than one pending receipt must throw a deterministic conflict before destination selection, snapshot cloning, receipt mutation, clock advancement, resource change, relocation, Chronicle/notification change, ledger append, or session revision.
- The result and error must not depend on receipt-array order.
- Lower-level repair entry points must enforce the same invariant; no direct caller may retain first-match behavior.
- `hasPendingNormalDefeat(...)` may remain a non-throwing blocking predicate.
- Existing duplicate completion after later accepted mutations must still return the retained result without rolling back newer snapshot/control state.

### 2. Exact safe-settlement authority

- A repair destination is safe only when the snapshot contains exact, internally consistent authoritative settlement evidence.
- A nonempty current-location `settlementId` is not sufficient by itself.
- Any current-location candidate must have an exact matching known-location record with `known === true`, `type === "settlement"`, and the same normalized `settlementId`.
- Reject blank, whitespace-padded, unknown, non-settlement, or contradictory current-location settlement authority. Do not silently fall through from corrupt current authority to a different candidate.
- Explicit and automatically derived destinations must use the same validator.
- Campaign-start and known-location candidates must be normalized, nonempty, and free of contradictory matching location records; accepted automatic repair must resolve deterministically.
- When more than one distinct safe destination remains and no accepted precedence source selects one, fail closed rather than choosing by array order.
- Preserve the production `App.tsx` launcher owner: safe completion enters play with an unsaved-repair notice; invalid or ambiguous authority remains blocked with diagnostics.

### 3. Exactly-once repair provenance

- Preserve the original defeat receipt id, source mutation, original ledger entry, HP/Stamina restoration facts, Chronicle id, and notification id.
- Completing pending recovery must append exactly one deterministic authority-ledger correction/supersession entry.
- Use the existing `normal_defeat` ledger kind and `supersedesEntryId` seam unless executable type constraints prove a new kind is strictly required.
- The repair entry must identify the stable recovery mutation/result source and supersede the original defeat ledger entry.
- Validate that the original receipt has one matching original ledger entry before applying completion; missing, duplicate, or conflicting provenance fails closed.
- Duplicate completion must not append another ledger entry or reapply any effect.
- Do not rewrite or delete the original ledger entry.

### 4. Effect and publication preservation

- Across the original pending resolution plus completion, HP and Stamina restore only at original defeat resolution; completion must not restore them again.
- Completion advances exactly four recovery ticks once, relocates once, updates the retained Chronicle and notification once, changes the retained receipt once, appends one repair ledger entry, and advances the campaign session revision once.
- Invalid, ambiguous, or duplicate submissions must not partially apply these effects.
- Ordinary mutation, manual save, quick-save, and retirement remain blocked before repair.
- Repaired state remains unpublished until an explicit later manual or quick save.
- Add executable proof that a normal explicit save succeeds after completion without duplicating the repair ledger entry or projections.

## Required Tests

Add focused executable coverage for:

- two pending receipts in original and reversed array order, both rejecting with the same deterministic diagnostic and byte-equivalent unchanged input;
- no receipt, projection, ledger, time, resource, relocation, or session effect after multiple-pending rejection;
- blank, whitespace-padded, unknown, and non-settlement current-location `settlementId` values;
- a current-location id with one matching `ruin`, one unknown id, and contradictory settlement/non-settlement records;
- explicit and automatic destination validation parity;
- one valid known settlement completing through the production owner;
- one original defeat ledger entry plus one deterministic superseding repair entry;
- duplicate completion after a later accepted mutation returning retained current state with exactly two relevant ledger entries total;
- exactly-once HP, Stamina, ticks, relocation, Chronicle, notification, receipt, ledger, and session-revision effects;
- ordinary mutation/publication/manual-save/quick-save/retirement blocking before repair;
- successful explicit save after repair with no duplicate completion effects;
- all production new-campaign retry, caller-loss, restart, slot-collision, consumer-idempotency, immutable-address, migration, control-guard, terminal, and `0.6.9.2` preservation cases.

Keep TypeScript and JavaScript mirrors aligned.

## Validation Commands

Run:

```text
node --test tests\unit\campaign-persistence-foundation.test.mjs
```

Run the prescribed group:

```text
node --test tests\simulation\save-load-roundtrip.test.mjs tests\unit\achievements.test.mjs tests\unit\account-profile-storage.test.mjs tests\unit\run-lifecycle.test.mjs tests\unit\player-travel-command.test.mjs tests\unit\player-quest-acceptance-command.test.mjs tests\unit\player-quest-tracking-command.test.mjs tests\unit\player-activity-selection-command.test.mjs tests\unit\combat-hook-support.test.mjs tests\unit\combat-spawn-foundation.test.mjs tests\unit\campaign-persistence-foundation.test.mjs
```

Run the RPG UI production build, bounded TypeScript audit, mirror checks, `git diff --check`, and complete diff inspection. Report the repository diagnostic total and any diagnostic naming a changed production file; do not claim the known repository-wide TypeScript baseline is green.

## Acceptance And Successor

This implementation run does not accept its own parent.

On complete green implementation:

- report `IMPLEMENTED_PENDING_PARENT_AUDIT`;
- keep `0.6.9` unaccepted;
- install `Version 0.6.9.6 - Pending-Defeat Completion Authority And Provenance Acceptance Audit`;
- keep the Ashen Reef survey receipt decision blocked.

If any exact defect remains:

- stop fail closed;
- keep this prompt installed or install the smallest exact continuation suffix;
- do not advance to survey work.

## Scope Exclusions

Do not:

- implement survey occurrences, results, consequences, commands, UI, or migrations;
- add Committed or Ironbound Stakes;
- redesign slots, launcher, recovery UI, defeat, death, succession, injury, care, or account systems;
- change Normal recovery balance;
- add a generic workflow, transaction, retry, correction, event, command, or replay framework;
- add dependencies, assets, generated output, or unrelated cleanup;
- merge, modify, rebase, force-update, or delete protected branches;
- merge or close PR #2.

## Completion Report

Report:

- pre-edit reproduction;
- finding-to-test and failure-boundary matrices;
- applicable guardrail IDs and evidence;
- exact files changed;
- commands and counts;
- TypeScript posture;
- inspected-base, starting, final, and live-head identities;
- branch/PR lifecycle and retained review triggers;
- risks;
- `IMPLEMENTED_PENDING_PARENT_AUDIT` or exact fail-closed status;
- installed next route.
