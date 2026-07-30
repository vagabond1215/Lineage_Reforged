# Version 0.6.9.2 - Normal Campaign Publication Recovery Repair

## Run Identity

`Version 0.6.9.2 - Normal Campaign Publication Recovery Repair`

Label class: support suffix

Parent version: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`

Milestone impact: `supports_current_band`

Suggested commit:

`fix(save): repair Normal campaign publication recovery`

## Purpose

Repair every currently proven parent-specific authority defect found during and after `0.6.9.1`: post-publication address failure, durable account-consumer recovery, separately loaded legacy HP-zero repair, missing/invalid/closed campaign-control rejection, `recovery_pending` gameplay admission, and duplicate-mutation retained-result semantics. Address recovery must also verify the playable address against the immutable artifact it identifies.

This is a narrow repair. Do not add survey behavior, later Stakes modes, checkpoint UI, cloud synchronization, actual death/succession, a generic transaction framework, dependencies, content, assets, or unrelated cleanup.

## Required Reading

Read:

- `AGENTS.md`;
- `docs/design/normal-stakes-campaign-persistence-foundation-acceptance-audit.md`;
- the current output, prompt, handoff, roadmap, sequenced plan, continuity brief, historical/deferred register, planning-anchor reconciliation, backlog, static-content program, and branch register;
- `docs/dev/branch-lifecycle-and-integration-policy.md`;
- `docs/design/normal-stakes-activation-first-mutation-continuity-and-account-value-publication-dependency-closure-decision.md`;
- `docs/design/ashen-reef-survey-minimum-save-identity-and-accepted-state-publication-decision.md`;
- `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md`;
- the complete `0.6.9` and `0.6.9.1` ranges;
- the protected readiness branch through read-only Git inspection only.

## Execution Gate

1. Verify clean `master`, upstream, current head, parent/audit commits, and this prompt.
2. Run `git fetch --all --prune`; inventory all branches and open PRs; refresh dispositions only from live evidence.
3. Reproduce the 120-test baseline before repair.
4. Keep every production edit inside the campaign/save/account/Normal-defeat admission repair boundary.
5. If a defect requires a broader account-store redesign, generic transaction system, general command replay service, or recovery UI redesign, stop and install the smallest exact follow-up support prompt instead of broadening.

## Required Repair

### A. Recover publication after address failure

- Inject failure after campaign-control publication verifies but before the selected slot address verifies.
- Preserve the verified head; do not roll gameplay truth back.
- Persist or deterministically reconstruct stable pending address/account projection evidence before the caller can lose the publication identity.
- Make retry recover the exact artifact/publication without minting another gameplay head.
- Return or reload coherent session control after recovery.
- For new game, ordinary save, quick save, and terminal retirement, never strand a verified head without a discoverable recovery path.
- Report success only when required playable-address projection completes; otherwise report a specific repair-pending result.

### B. Make account repair durable across account-store failure

- Prepare the exact registered consumer plan before campaign publication.
- Anchor pending consumer kinds, stable publication-plus-kind ids, and payload fingerprints in campaign/save-owned durable evidence that does not depend on the failing account-profile write.
- Do not duplicate account value when the account write actually committed but the caller observed failure.
- On startup and account selection, discover pending work from durable campaign authority, reconcile it with any account receipts, apply each consumer idempotently, and mark it complete.
- Mandatory preparation, inheritance, and retirement work must block ordinary entry and further preparation/inheritance use until repaired.
- Preserve active history, account achievements, Legacy rewards, `lastPlayedAt`, retirement settlement, and estate as verified-publication-only consumers.

### C. Repair legacy HP-zero slots only when separately loaded

- Preserve the accepted rule that migration repairs only the loaded slot; other grouped slots remain unchanged until loaded.
- When a separately loaded migrated target artifact still has HP zero and active history, apply exactly one typed `unknown_or_legacy` repair and persist it before ordinary play.
- A repaired certified head may advance only that campaign head.
- A repaired non-head must remain non-head and must not replace the campaign head.
- Retry, reload, or interruption must not duplicate ticks, relocation, resources, receipt, Chronicle, or notice.
- Archived/deleted history remains blocked and cannot re-enter.

### D. Fail closed on lost or invalid control

- A session-owned publication must reject missing, invalid, closed, or mismatched live campaign control.
- Preserve the current stale-revision and wrong-artifact guards.
- Do not recreate revision 1 from a session that was admitted against an earlier verified head.
- Developer-fixture creation without a prior session may retain its current bounded path only where it cannot reopen closed authority.

### E. Enforce `recovery_pending` admission and repair posture

- Preserve `recovery_pending` as nonterminal authority when no valid recovery destination exists.
- Retain one defeat receipt and all already-resolved deterministic facts without rerolling destination, time, resource, Chronicle, or notice results.
- Block ordinary gameplay commands, legacy snapshot mutation bridges, and save-success claims until deterministic repair completes.
- Surface a clear diagnostic before ordinary play can resume.
- Do not archive, delete, settle terminal value, or reinterpret `recovery_pending` as actual death.
- Keep the run recoverable; if the bounded package cannot provide a complete repair owner, fail closed and install the smallest exact follow-up instead of silently allowing play.

### F. Return retained results for duplicate mutation submissions

- Retain enough bounded accepted-admission data to return the original accepted snapshot/control/result correlation for a duplicate mutation id.
- A duplicate submitted after later accepted mutations must not return the caller's current source snapshot as though it were the original result.
- Reuse of one mutation id with a conflicting source revision, owner, result id, or proposed payload must fail closed.
- Do not create a generic command replay framework; keep this storage scoped to campaign-session mutation admission.

### G. Verify playable addresses against immutable artifact authority

- On target-save load and post-publication recovery, read and verify the immutable artifact identified by the address envelope.
- Reject or repair address records whose artifact identity, publication identity, generation identity, campaign/continuity/character identity, head revision, terminal posture, or serialized snapshot bytes conflict with immutable artifact authority.
- Do not admit play from an address copy that cannot prove its immutable artifact.
- Preserve the prior verified head and retained artifacts during any address repair.

## Required Tests

Add executable focused tests for:

- address write/readback failure after verified control publication and exact retry recovery;
- target address tampering or divergence from its immutable artifact, including identity and serialized-byte mismatch;
- new-game or equivalent mandatory consumer failure where account profile persistence rejects the first post-publication write and durable pending evidence remains discoverable;
- restart/account-selection repair for preparation and inheritance, including already-applied-but-observed-failed idempotency;
- terminal retirement repair with hidden closed authority retained and playable addresses removed only after mandatory consumers;
- migrating through a healthy head, then separately loading an HP-zero non-head;
- migrating through a healthy non-head, then separately loading an HP-zero head;
- exactly-one repair receipts and preserved head/non-head posture;
- missing, malformed, closed, and changed control rejection;
- live and loaded `recovery_pending` states blocking ordinary commands and legacy mutation bridges until deterministic repair;
- duplicate mutation replay returning the original accepted result after one or more later accepted mutations;
- conflicting reuse of a mutation id failing closed;
- existing candidate failure, campaign-control failure, migration interruption/retry, ambiguity quarantine, first-mutation continuity, Normal defeat, retirement ordering, browser build, mirror checks, and stale-head behavior.

Prefer testing exported owner helpers over source-string ordering. Keep TypeScript/JavaScript mirrors and public exports aligned.

## Prescribed Checks

Run:

```text
node --test tests\simulation\save-load-roundtrip.test.mjs tests\unit\achievements.test.mjs tests\unit\account-profile-storage.test.mjs tests\unit\run-lifecycle.test.mjs tests\unit\player-travel-command.test.mjs tests\unit\player-quest-acceptance-command.test.mjs tests\unit\player-quest-tracking-command.test.mjs tests\unit\player-activity-selection-command.test.mjs tests\unit\combat-hook-support.test.mjs tests\unit\combat-spawn-foundation.test.mjs tests\unit\campaign-persistence-foundation.test.mjs
```

Run the RPG UI Vite production build with temporary output outside tracked paths, then remove that output.

Run the bounded TypeScript audit only as classified by repository policy. Run `git diff --check` and inspect the complete repair diff.

## Completion

If every repair and prescribed check passes:

- update the existing acceptance audit with exact repaired evidence;
- run a fresh parent-specific acceptance decision;
- mark `0.6.9`, `0.6.9.1`, and `0.6.9.2` complete only if all original audit obligations and every additional proven defect above are green;
- update all live coordination surfaces;
- install the smallest unversioned post-parent route decision required before survey implementation;
- do not install survey implementation unless that decision closes its remaining prerequisites.

If a material defect remains:

- do not accept the parent;
- document the exact failure;
- install the smallest further `0.6.9.S` repair or audit prompt.

Report starting/final commits, exact files changed, branch/PR lifecycle, tests and counts, injected-failure evidence, remaining risks, and the installed next prompt.