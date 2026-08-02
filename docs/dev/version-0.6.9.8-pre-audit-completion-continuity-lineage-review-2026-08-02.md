# Version 0.6.9.8 Pre-Audit Completion-Continuity Lineage Review

Date: 2026-08-02

Run class: connector-side read-only audit preparation

Source head inspected: `337e2490c93213d3514ef34f9e0de640936e459b`

Implementation under review: `ba35dacd852304cd0804b131c8d3045c1f74b755` - `fix(save): harden defeat recovery authority`

Disposition: `AUDIT_CRITICAL_REPRODUCTION_REQUIRED`

## Purpose

Record one audit-critical continuity-provenance concern found during static inspection after `Version 0.6.9.8 - Initial Defeat And Durable Recovery Completion Acceptance Audit` was installed.

This document is evidence for the independent audit. It is not acceptance authority, does not itself report `REPAIR_REQUIRED`, and does not authorize production changes. The `0.6.9.8` repository run must reproduce or disprove the concern against untouched synchronized source using executable probes and the full required validation gate.

Parent `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation` remains unaccepted. The Ashen Reef survey receipt decision and `0.7.0` remain blocked.

## Controlling Contract

The accepted continuity decision requires:

- `receipt.continuityId` to remain the original defeat continuity;
- non-head ordinary completion to create one child continuity;
- `receipt.recoveryCompletionContinuityId` to record that exact completion child;
- one exact source-tick `continuity_fork` authority entry for the recovery mutation;
- later accepted mutations and later forks to preserve both receipt continuity fields unchanged;
- copied artifacts to preserve the embedded original continuity, completion continuity, correction entry, projections, and lineage evidence;
- completed replay to require one complete, internally consistent durable evidence set.

The implementation must therefore distinguish three concepts without collapsing them:

1. original defeat continuity;
2. recovery-completion continuity;
3. current descendant continuity at replay time.

## Static Concern

In `validateCompletedNormalDefeatRecoveryProvenance(...)`, the implementation currently treats completion continuity as compatible when it equals any member of a set composed of:

- `receipt.continuityId`;
- `snapshot.campaignIdentity.continuityId`;
- `snapshot.campaignIdentity.parentContinuityId`.

The same completed-replay validator proves the original defeat ledger and deterministic correction ledger, but it does not require the exact recovery `continuity_fork` entry or use durable lineage evidence to prove that the recorded completion continuity is the continuity created by the recovery mutation.

Static inspection therefore identifies two opposing risks.

### Risk A - False acceptance of original continuity

For a valid non-head completion:

```text
C0 = original defeat continuity
C1 = recovery-completion child continuity
```

The accepted receipt must retain:

```text
continuityId = C0
recoveryCompletionContinuityId = C1
```

If the stored completion field is corrupted back to `C0`, membership in the current compatibility set may still succeed because `receipt.continuityId` is included. Without exact recovery-fork evidence, the replay validator may accept a receipt that no longer records the actual completion continuity.

### Risk B - False rejection after deeper descendant forks

For a valid later history:

```text
C0 original defeat
└─ C1 recovery completion
   └─ C2 later accepted fork
      └─ C3 later accepted fork
```

At replay from `C3`, the legitimate stored completion continuity is still `C1`. It is neither the current continuity `C3` nor the immediate parent `C2`, and it differs from original continuity `C0`. A validator limited to original/current/immediate-parent membership may reject valid durable replay after arbitrary-depth descendants even though the accepted contract requires later forks to preserve the completion field unchanged.

### Risk C - Missing recovery-fork proof

A valid non-head completion requires exactly one `continuity_fork` entry whose:

- kind is `continuity_fork`;
- source id is `mutation.recovery_repair.<receiptId>`;
- accepted tick is the untouched source tick;
- surrounding campaign identity proves the child lineage created by that mutation.

Completed duplicate proof should fail closed when that evidence is missing, duplicated, orphaned, wrong-source, wrong-tick, or contradictory. The current static validator does not visibly make this entry part of the completed durable evidence set.

## Existing Test Boundary

The implemented focused suite covers:

- one non-head recovery;
- restart replay;
- replay after one later accepted mutation;
- copied snapshots and reversed arrays;
- an arbitrary unrelated completion-continuity value;
- missing and duplicated correction evidence.

Static review did not find an explicit test for:

- replacing a non-head completion child with the original receipt continuity;
- deleting only the recovery `continuity_fork` entry while retaining original and correction entries;
- duplicating the recovery fork entry;
- changing its source mutation or accepted tick;
- replaying a valid completed receipt after at least two later descendant forks.

The independent audit must not infer coverage from test names or reported green counts. It must build these exact states and execute the production replay path.

## Mandatory Independent Reproductions

`0.6.9.8` must independently run all of the following against untouched synchronized source.

### Case 1 - Original-continuity substitution

1. Produce a valid non-head pending recovery.
2. Complete it, recording original continuity `C0` and completion child `C1`.
3. Replace only `recoveryCompletionContinuityId` with `C0`.
4. Preserve the remaining original, correction, projection, control, and snapshot evidence.
5. Attempt explicit completed replay.

Required result: rejection before effects. Acceptance is a blocking defect.

### Case 2 - Recovery-fork evidence matrix

Starting from a valid non-head completed snapshot, independently test:

- missing recovery fork entry;
- duplicate recovery fork entry;
- fork entry with wrong source id;
- fork entry with wrong accepted tick;
- unrelated fork entry substituted for the recovery fork;
- campaign identity whose parent/child/fork metadata conflicts with the recovery fork.

Required result: every corruption fails closed and remains byte-stable.

### Case 3 - Deep descendant replay

1. Produce a valid non-head recovery `C0 -> C1`.
2. Persist or otherwise construct accepted repository-valid descendant forks `C1 -> C2 -> C3` through the ordinary campaign/session owner.
3. Preserve the receipt fields unchanged at `C0` and `C1`.
4. Restart or reconstruct compatible caller control at `C3`.
5. Explicitly replay the completed receipt.

Required result: exact duplicate return of current `C3` snapshot/control with no rollback, new fork, repeated effects, tick advance, resource mutation, projection mutation, ledger mutation, revision change, or publication.

### Case 4 - Copied deep descendant

Copy the valid `C3` artifact, reverse receipt/ledger/projection arrays, preserve exact bytes otherwise, reconstruct compatible control, and replay by explicit receipt id.

Required result: deterministic duplicate success independent of array or slot position.

## Decision Gate

The audit must determine what durable evidence proves arbitrary-depth completion lineage.

Acceptable outcomes include a repository-proven existing lineage mechanism that can establish the recovery child through retained campaign identity and exact fork-ledger ancestry without adding a new save format or generic framework.

If current persisted authority cannot prove both:

- that a stored completion continuity is the exact recovery child; and
- that the current artifact is a legitimate later descendant of that child,

then `0.6.9.8` must report `REPAIR_REQUIRED` and install the smallest decision-complete support route. It must not weaken validation to accept any original, current, immediate-parent, or merely well-formed continuity id.

Any required repair remains bounded to the smallest coherent existing owners. A new snapshot format, envelope version, generic ancestry service, generic replay framework, dependency, or broad migration rewrite requires a fail-closed decision gate rather than implementation by inference.

## Required Audit Reporting

The `0.6.9.8` completion report must state:

- whether each mandatory reproduction passed or exposed a defect;
- the exact durable lineage evidence used by completed replay;
- whether the recovery fork entry is required and uniquely validated;
- how arbitrary-depth descendant replay is proven;
- whether existing format-v2 and missing-field compatibility remains valid;
- the exact parent disposition: `PARENT_ACCEPTED` or `REPAIR_REQUIRED`.

Do not accept parent `0.6.9` without explicit evidence for all four mandatory cases above.
