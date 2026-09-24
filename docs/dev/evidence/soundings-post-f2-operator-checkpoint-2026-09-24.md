# Soundings Post-F2 Operator Validation Checkpoint

Date: 2026-09-24. Repository: `vagabond1215/Lineage_Reforged` only.

Evidence class: **operator-supplied local PowerShell validation checkpoint**. This file records results supplied by the repository operator after executing the preserved independent probes in a detached worktree. It was not executed by the GitHub Connector and is not, by itself, a final acceptance decision.

## Exact Runtime

The operator reported:

```text
Preparing worktree (detached HEAD 0383cedc)
HEAD is now at 0383cedc fix(soundings): verify witness before consumer completion
0383cedc99a4c3d5e2c9b47cf0665683720aef9e
```

Checkpoint runtime: `0383cedc99a4c3d5e2c9b47cf0665683720aef9e`.

## Slice A Checkpoint

Command executed from the exact-runtime worktree:

```powershell
node docs/dev/evidence/soundings-post-repair-acceptance-2026-09-24/slice-a.mjs
```

Reported terminal result:

```json
{"status":"CORE_AUTHORITY_PROBES_PASS","runtime":"0df87bb7afaa4d7fcc9f08b79b7528d60727c370","cases":68}
```

The probe's embedded `runtime` field is a preserved historical source label. The operator separately verified the actual worktree HEAD as `0383cedc99a4c3d5e2c9b47cf0665683720aef9e` immediately before execution.

Reported cases included the ordinary accepted-state caller, legacy helper payment exclusion, legitimate retry/key-order equivalence, semantic conflict, both F1 wallet/source-ID variants in session and restart paths, version downgrade, malformed/deep-empty/orphan/duplicate/wrong-owner authority, wrong witness facts, missing/pending context, stale preparation, and durable missing/pending/wrong-first-publication evidence.

Checkpoint status: **A = 68/68 PASS / `CORE_AUTHORITY_PROBES_PASS`**.

## Slice B1 Checkpoint

Command executed from the same exact-runtime worktree:

```powershell
node docs/dev/evidence/soundings-post-repair-acceptance-2026-09-24/slice-b1.mjs
```

Reported terminal result:

```json
{"runtime":"0df87bb7afaa4d7fcc9f08b79b7528d60727c370","cases":14,"status":"B1_PARTIAL_PASS"}
```

Again, the embedded runtime label is historical; actual worktree HEAD was independently printed as `0383cedc99a4c3d5e2c9b47cf0665683720aef9e`.

The critical F2 observation was reported as:

```json
{"case":"recovery witness omission before consumer completion","recoveryStatus":"head_verified","stableWitnessBefore":"pending","stableWitnessAfter":"pending","declaredConsumerKinds":["active_history"],"completedKinds":["active_history"],"rejected":true,"recoveryRetained":true,"storageUnchanged":true,"precedingCases":13}
```

Reported prerequisite/recovery cases covered pending/head/applied interruption points, pending-witness rejection, immutable-artifact rejection, newer-head rejection, unchanged valid pre-applied recovery blocking premature consumer completion, repaired omission behavior, and malformed recovery rejection.

Checkpoint status: **B1 = 14/14 PASS / `B1_PARTIAL_PASS`**.

## Resume Rule

A later Codex run may use this checkpoint to avoid repaying for A/B1 only after it verifies:

1. the local validation target is exactly `0383cedc99a4c3d5e2c9b47cf0665683720aef9e` or an exact production/test-equivalent tree with only documentation drift;
2. the preserved probe files are unchanged from the accepted audit source;
3. no production/test/schema/dependency/content drift invalidates the checkpoint.

If those conditions hold, resume at **B2 continuity/projection/full-feed acceptance**, then C browser/storage and D mechanical regression. If any condition fails, rerun the affected checkpoint rather than assuming it.

This checkpoint does not authorize `SOUNDINGS_DURABLE_COMPLETION_ACCEPTED` without B2, C and D at the same accepted runtime target and a durable final audit disposition.
