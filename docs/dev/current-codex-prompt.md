# Version 0.6.9.8 - Initial Defeat And Durable Recovery Completion Acceptance Audit

Date: 2026-08-02

Label class: support suffix

Parent version: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`

Milestone impact: `supports_current_band`

Execution posture: independent read-only production audit; coordination documents may be updated only after the conclusion

## Objective

Independently audit `Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair` at implementation commit:

`ba35dacd852304cd0804b131c8d3045c1f74b755`

Accept parent `0.6.9` only if every contract, caller, failure-boundary, restart, persistence, compatibility, continuity-lineage, and validation gate is independently proven. Do not use the `0.6.9.7` implementation report, green counts, connector repair bundle, or connector-side pre-audit review as acceptance authority.

A connector-side static review identified an audit-critical concern around completed-replay continuity lineage and recovery-fork proof. Independently reproduce or disprove it against untouched synchronized source. Do not treat the concern as established merely because it is documented.

## Required Repository Orientation

Follow `AGENTS.md` and `docs/dev/repository-first-agent-work-protocol.md` completely before narrowing scope.

Fetch/prune and record:

- local/remote head and worktree status;
- ancestry of `ba35dacd852304cd0804b131c8d3045c1f74b755`;
- every successor commit and whether it changes the audited runtime/test surface;
- all local and remote branches, open PRs, merge bases, unique commits, changed paths, semantic overlap, and current disposition;
- hosted combined status and workflow-run availability for the implementation and final audit commits.

Read the complete current versions of:

- `docs/dev/current-codex-prompt.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/current-codex-output.md`;
- `docs/dev/version-0.6.9.8-pre-audit-completion-continuity-lineage-review-2026-08-02.md`;
- `docs/dev/historical-version-and-deferred-route-register.md`;
- `docs/design/current-planning-anchor-reconciliation.md`;
- `docs/dev/codex-failure-patterns-and-verification-guardrails.md`;
- `docs/dev/branch-lifecycle-and-integration-policy.md`;
- `docs/dev/branch-disposition-register.md`;
- `docs/dev/repository-roadmap-pipeline-backlog-active-prompt-reconciliation-audit-2026-08-02.md`;
- `docs/design/normal-stakes-campaign-persistence-foundation-acceptance-audit.md`;
- `docs/design/normal-defeat-recovery-continuity-and-destination-provenance-contract-decision.md`;
- the hardened `0.6.9.7` preimplementation source review and all focused Normal persistence decisions/audits it cites.

Inspect PR #3 and its reconstructed archive as evidence only. Verify its hashes again if it remains a named consumer; never merge, cherry-pick, or substitute its candidate files for live source.

## Audit Boundary

Do not edit production source, tests, schemas, persistence formats, content, assets, dependencies, or generated outputs in this run.

If a blocking defect is found:

1. reproduce it independently against untouched live source;
2. identify the exact caller, authority mismatch, failure boundary, and smallest repair surface;
3. report `REPAIR_REQUIRED`;
4. install a decision-complete support repair prompt without implementing it.

If every gate passes, report `PARENT_ACCEPTED`, update the focused parent acceptance authority and current coordination surfaces, and install the already-planned unversioned Ashen Reef survey receipt-foundation decision as the next route. Do not implement survey behavior in this audit.

## Exact Contract To Verify

### Continuity

- `NormalDefeatReceiptState.continuityId` is immutable original defeat continuity.
- New pending receipts write `recoveryCompletionContinuityId: null`.
- New immediately playable receipts write original/current completion continuity.
- Missing-field stored pending receipts infer null without byte rewrite.
- Missing-field stored playable receipts infer original receipt continuity only after every other durable fact validates.
- At-head completion creates no fork and records the current continuity.
- Non-head ordinary completion validates untouched source first, creates exactly one child and one source-tick fork entry, preserves original receipt continuity, and records that exact child as completion continuity.
- Later accepted mutations, arbitrary-depth descendant forks, copied artifacts, and slot copies preserve both receipt continuity fields unchanged.
- Completed replay must distinguish original defeat continuity, exact recovery-completion continuity, and current descendant continuity. It must not treat mere equality with the original, current, or immediate-parent continuity as sufficient proof.
- Non-head completed replay must prove exactly one recovery `continuity_fork` entry and compatible durable lineage from the original defeat continuity through the recorded completion child to the current descendant artifact.

### Destination authority

Completion precedence must be strict and source-aware:

1. supplied and exactly validated explicit -> `explicit_context`;
2. exactly validated current -> `current_settlement`;
3. exactly validated campaign start -> `campaign_start`;
4. exactly one known safe settlement -> `sole_known_settlement`;
5. none or multiple -> fail closed.

A valid explicit claim must not inspect or be vetoed by lower-priority corruption. An invalid explicit claim must not fall back. Initial automatic resolution must not use the sole-known fallback and must become deterministic pending on malformed, padded, unknown, duplicate, contradictory, ruin, wilderness, or other non-settlement current/campaign-start evidence.

### Original and completed evidence

Verify exact finite integer resource admission and every derivable receipt, rules, policy, source, tick, destination, posture, original ledger, correction ledger, recovery fork ledger, Chronicle, notification, campaign, character, account, artifact, publication/revision, loaded continuity, pending continuity, completion continuity, current descendant continuity, and mutation identity fact.

The correction entry must be uniquely:

- id `normal_defeat_recovery.<receiptId>`;
- kind `normal_defeat`;
- source `mutation.recovery_repair.<receiptId>`;
- superseding the original receipt;
- accepted at completed `resolvedTick`.

For non-head ordinary completion, the recovery fork entry must be uniquely:

- kind `continuity_fork`;
- source `mutation.recovery_repair.<receiptId>`;
- accepted at the untouched source tick;
- consistent with the source continuity, created completion child, campaign identity fork metadata, and later descendant lineage.

Completed replay after caller-state loss/restart requires an explicit receipt id, exact durable evidence, and a compatible control/snapshot. It returns the current snapshot/control without rolling back later mutations, repeating effects, creating a fork, or depending on array order. Pending targeting may be inferred only when exactly one pending receipt exists.

### Mandatory completion-lineage gate

Independently execute all of the following through production owners. Parent acceptance is prohibited without explicit evidence for every case.

#### Original-continuity substitution

1. Produce a valid non-head recovery with original continuity `C0` and recovery-completion child `C1`.
2. Change only `recoveryCompletionContinuityId` from `C1` to `C0`.
3. Preserve all other receipt, original-ledger, correction-ledger, projection, control, and snapshot evidence.
4. Attempt explicit completed replay.

Required result: rejection before effects. Acceptance is a blocking defect.

#### Recovery-fork corruption matrix

Starting from a valid non-head completed snapshot, test independently:

- missing recovery fork entry;
- duplicate recovery fork entry;
- wrong fork source id;
- wrong fork accepted tick;
- unrelated fork entry substituted for the recovery fork;
- campaign identity parent, child, forked artifact/publication, or first-divergent mutation conflicting with the fork evidence.

Required result: every corruption fails closed and leaves snapshot/control byte-stable.

#### Arbitrary-depth descendant replay

1. Produce valid non-head recovery lineage `C0 -> C1`.
2. Through ordinary accepted repository owners, create at least two later descendant forks `C1 -> C2 -> C3`.
3. Preserve `receipt.continuityId = C0` and `recoveryCompletionContinuityId = C1` unchanged.
4. Reconstruct compatible caller control at `C3` after caller-state loss or restart.
5. Explicitly replay the completed receipt.

Required result: deterministic duplicate success returning current `C3` state without rollback, new fork, repeated effects, tick/resource/projection/ledger mutation, revision change, or publication.

#### Copied deep descendant and order independence

Copy the valid deep descendant artifact, reverse receipt, authority-ledger, Chronicle, and notification arrays, preserve exact facts otherwise, reconstruct compatible control, and replay by explicit receipt id.

Required result: deterministic duplicate success independent of array and slot position.

The audit must identify the exact existing durable mechanism that proves arbitrary-depth ancestry. If repository authority cannot prove both the exact recovery child and the current artifact's legitimate descent from it, report `REPAIR_REQUIRED`. Do not weaken validation to accept any merely well-formed original, current, immediate-parent, or unrelated continuity id.

### Transaction and persistence boundary

Every rejection must occur before clone effects and non-head child-id creation. Accepted ordinary completion advances exactly four ticks, relocates once, updates only the target receipt/projections, appends one correction, advances session revision once, retains one result, and remains unsaved until explicit manual/quick save.

Owner-certified version-6 repair creates no child, retains source bytes, uses exact safe destination authority, verifies repaired head or non-head persistence before play, retries idempotently, and never promotes a repaired non-head artifact to head.

Snapshot format remains `lineage.save_snapshot.v2`. No envelope version, ledger kind, dependency, generic replay/event/transaction/lineage framework, survey behavior, or unrelated runtime authority may have changed.

## Independent Evidence Matrix

At minimum reproduce and verify:

- all nine `0.6.9.7` findings against the repaired behavior;
- every mandatory completion-lineage case above;
- valid explicit/current/campaign-start initial resolution and every invalid automatic initial class becoming pending;
- negative, fractional, nonfinite, zero/negative maximum, and out-of-bounds resource rejection before effects;
- complete initial duplicate plus missing, duplicate, orphaned, conflicting, and reversed evidence;
- pending source corruption across rules, policy, stakes, ticks, resources, receipt fields, ledger, Chronicle, notification, posture, and completion continuity;
- explicit completion with every corrupt lower source and invalid explicit without fallback;
- current, campaign-start, sole-known, none, and ambiguous completion with exact source labels;
- at-head and non-head completion through the real run-entry route;
- rejection before non-head child creation and one exact child/completion sequence;
- restart before completion, restart after completion, completed replay after later accepted mutation, and replay after at least two later descendant forks;
- multiple historical receipts, stable explicit targeting, copied artifacts, and reversed receipt/ledger/projection arrays;
- corrupt account/campaign/artifact/publication/revision/loaded-continuity/pending-continuity/control and receipt campaign/character/original/completion continuity;
- missing, duplicate, wrong-source, wrong-tick, and identity-conflicting recovery fork evidence;
- old target snapshots missing the additive completion field in pending and playable postures;
- version-6 head and non-head HP-zero repair, blocked pending, retry, source-byte retention, verified persistence, and no child;
- publication blocked pending, ordinary completion unsaved, explicit later save, and exactly-once account publication;
- JavaScript mirror/public export parity and serialization compatibility.

Use fresh probes that are independent of the focused test additions. Vary array order, copied caller state, restart boundaries, arbitrary-depth forks, identity conflicts, partial evidence, and failure-before-fork behavior.

## Required Validation

Run focused persistence:

```powershell
node --test tests\unit\campaign-persistence-foundation.test.mjs
```

Run the prescribed regression group:

```powershell
node --test tests\simulation\save-load-roundtrip.test.mjs tests\unit\achievements.test.mjs tests\unit\account-profile-storage.test.mjs tests\unit\run-lifecycle.test.mjs tests\unit\player-travel-command.test.mjs tests\unit\player-quest-acceptance-command.test.mjs tests\unit\player-quest-tracking-command.test.mjs tests\unit\player-activity-selection-command.test.mjs tests\unit\combat-hook-support.test.mjs tests\unit\combat-spawn-foundation.test.mjs tests\unit\campaign-persistence-foundation.test.mjs
```

Run the RPG UI production build:

```powershell
npx.cmd vite build
```

Run a bounded TypeScript audit using the installed RPG UI compiler. Report total diagnostics and whether any audited production file is named; do not repair the broad backlog or weaken configuration.

Also run:

- fresh independent adversarial probes, including the complete mandatory completion-lineage gate;
- real `App.tsx` caller/source inspection;
- version-6 owner and persistence inspection;
- serialization/export/mirror checks;
- `git diff --check`;
- complete diff/staged/post-commit inspection;
- generated/log/temp/build-output hygiene;
- post-push combined-status and workflow-run availability checks.

Apply and report `FP-001` through `FP-012` with exact evidence.

## Completion Outcomes

### Accepted

Use only if every gate, including arbitrary-depth continuity lineage and exact recovery-fork proof, passes:

`PARENT_ACCEPTED`

Then:

- mark `Version 0.6.9` accepted in the focused authority and current coordination surfaces;
- record exact audit commit/push identity and validation evidence;
- refresh branch/PR dispositions and named-consumer triggers;
- install the unversioned `Ashen Reef Survey Occurrence, Result, And Consequence Receipt Foundation Decision` as the next prompt;
- keep `0.7.0` blocked until its separate readiness criteria are satisfied.

### Rejected

Use if any blocking defect remains:

`REPAIR_REQUIRED`

Then:

- keep parent `0.6.9`, the survey route, and `0.7.0` blocked;
- document every independently reproduced defect and its exact source/caller boundary;
- state whether existing persisted authority can prove arbitrary-depth completion ancestry;
- install the smallest decision-complete support repair prompt;
- do not implement the repair during this audit.

## Completion Report

Report:

1. source and final commit identities;
2. successor/runtime-scope classification;
3. branch/PR inventory and every disposition change or retained trigger;
4. findings mapped to exact files/callers;
5. independent probe matrix and results, including every mandatory completion-lineage case;
6. exact durable evidence used to prove the recovery child and arbitrary-depth current descendant lineage;
7. focused/regression/build/type/mirror/serialization/diff/hygiene results;
8. applicable failure-pattern ids and proof;
9. hosted combined-status/workflow availability;
10. exact conclusion: `PARENT_ACCEPTED` or `REPAIR_REQUIRED`;
11. files changed, suggested commit message, risks, and next run.
