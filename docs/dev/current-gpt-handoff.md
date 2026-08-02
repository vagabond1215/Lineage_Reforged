# Current GPT Handoff

Date: 2026-08-02

## Status

- Latest completed unversioned coordination run: `Repository Roadmap, Pipeline, Backlog, And Active-Prompt Reconciliation Audit`, outcome `AUDIT_ALIGNED_CURRENT_ROUTE`; the active prompt was preserved unchanged and lower-precedence live headers were reconciled.
- Latest implemented primary: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`.
- Latest completed repair implementation: `Version 0.6.9.5 - Pending-Defeat Completion Authority And Provenance Repair`.
- Latest completed acceptance audit: `Version 0.6.9.6 - Pending-Defeat Completion Authority And Provenance Acceptance Audit`.
- Stopped repair attempt: `Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair`; all nine findings reproduced and no production files changed.
- Latest focused decision: `Normal Defeat Recovery Continuity And Destination Provenance Contract Decision`.
- Decision disposition: `DECISION_ACCEPTED_REPAIR_REAUTHORIZED`.
- Parent `0.6.9` status: `REPAIR_REAUTHORIZED_PENDING_0.6.9.7`.
- Active route: revised `Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair`.
- Reserved successor: `Version 0.6.9.8 - Initial Defeat And Durable Recovery Completion Acceptance Audit`; do not install before the repair succeeds.
- Draft PR #3 and `parallel/0.6.9.7-repair-bundle` remain evidence-only `HOLD_NAMED_CONSUMER` inputs.
- The Ashen Reef survey receipt decision and `0.7.0` remain blocked.

## Current Planning Precedence

Use current execution sources in this order:

1. `docs/dev/current-codex-prompt.md`;
2. this handoff;
3. `docs/dev/current-codex-output.md`;
4. `docs/dev/historical-version-and-deferred-route-register.md`;
5. `docs/design/normal-defeat-recovery-continuity-and-destination-provenance-contract-decision.md`;
6. the parent acceptance audit and earlier focused decisions;
7. `docs/design/current-planning-anchor-reconciliation.md` for stale historical-header conflicts;
8. roadmap and sequenced plan for non-conflicting history and long-term context.

Repository workflow authority also includes `AGENTS.md`, the repository-first protocol, failure-pattern register, branch policy/register, and hardened `0.6.9.7` source review.

## Accepted Contract

### Original versus completion continuity

- `NormalDefeatReceiptState.continuityId` permanently records the original defeat continuity.
- Additive `recoveryCompletionContinuityId?: string | null` records the continuity that accepted playable recovery.
- New pending receipts explicitly write null; new playable receipts explicitly write their completion continuity.
- Existing missing-field pending receipts infer null; existing missing-field playable receipts infer `receipt.continuityId` only after all other evidence validates.
- At-head completion creates no fork and records the current continuity.
- Non-head ordinary completion validates the untouched source first, creates exactly one child, keeps the receipt source continuity, and records the child completion continuity.
- Later descendants and copied artifacts never rewrite either receipt field.
- Owner-certified version-6 repair creates no child and must verify repaired same-slot persistence before play.

### Correction and stable replay

- One deterministic correction entry remains sufficient: id `normal_defeat_recovery.<receiptId>`, source `mutation.recovery_repair.<receiptId>`, superseding the original receipt at completed `resolvedTick`.
- Completed replay after restart requires explicit stable receipt targeting; no first/last/latest array selection.
- Duplicate success requires one complete unique receipt, original ledger, correction ledger, Chronicle, notification, identity, resource, tick, destination, and completion-continuity evidence set.
- Exact duplicate returns current state without rollback or repeated effects.

### Destination provenance

- Add `sole_known_settlement` to `destinationSource`.
- Completion precedence is strict explicit, current, campaign start, sole-known, then fail on none or ambiguity.
- A supplied explicit claim never falls back, and valid explicit authority never inspects lower-priority corruption.
- The sole-known literal is for pending completion; it does not expand automatic initial resolution.
- Existing stored literals are preserved without invented relabeling; every new write must be truthful.

### Compatibility

- Target snapshot format remains `lineage.save_snapshot.v2`.
- JSON serializer/deserializer requires no change.
- Existing target snapshots remain readable without load-time rewrite.
- New version-6 migrations emit the new field/source directly and preserve source bytes.
- No new ledger kind, dependency, generic replay framework, or persistence-format revision is authorized.

## Revised `0.6.9.7` Scope

The active prompt retains all nine findings:

1. unsafe automatic initial current/start authority;
2. completed restart replay unavailable;
3. corrupt pending resource/tick/original-ledger facts accepted;
4. valid explicit authority vetoed by corrupt lower evidence;
5. partial or array-order initial duplicate accepted;
6. invalid initial resource state admitted;
7. campaign-session control identity not reconciled;
8. non-head continuity rewritten before source validation;
9. automatic completion mislabeled `explicit_context`.

The authorized production surface is narrowly expanded to:

- `packages/shared/types/src/contracts.ts`;
- `packages/engines/game-engine/src/normal-defeat.ts`;
- `packages/engines/game-engine/src/campaign-session.ts`;
- engine index/re-export mirror only if a new public helper is required;
- `apps/rpg-ui/src/game-shell/saveManager.ts` only for exact owner-certified version-6 completion persistence;
- `apps/rpg-ui/src/App.tsx` only for real caller and legacy-owner routing;
- `tests/unit/campaign-persistence-foundation.test.mjs`;
- required coordination/focused authority files.

Do not change shared persistence JSON pass-through, snapshot/envelope version, ledger kinds, dependencies, content, assets, survey behavior, protected branches, or unrelated UI.

## Evidence And Baseline

The stopped attempt at source head `6820ab8175f6b4d0b447b589045bc0a934663257` independently reproduced all nine findings. Its temporary probe reported `9 / 9`; rejected cases compared serialized source snapshots and remained byte-stable. The unchanged focused persistence suite passed `26 / 26`.

PR #3 identity remains:

- branch: `parallel/0.6.9.7-repair-bundle`;
- head: `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`;
- source/merge base: `b6422118567a79a23be3377f035dd3a6905d4d8b`;
- ZIP SHA-256: `c5d536b10580877191fc9dc730b5f4f5e5571dc18d15bc7b7200871bf912b3fe`.

The bundle remains incomplete evidence. It contains useful candidate logic but does not implement the accepted continuity field, truthful sole-known provenance, or complete nine-finding matrix. Do not merge or cherry-pick it.

## Failure-Pattern Posture

`FP-001` through `FP-012` remain applicable. Highest-risk guards are:

- real `App.tsx` caller and owner-certified legacy persistence;
- failure, restart, caller-loss, stale, competing, copied, and order-reversed matrices;
- strict authority short-circuit and full source validation before fork/effects;
- explicit stable targeting plus unique complete durable evidence;
- no rollback of later accepted mutations;
- exact inspected/starting/final/live head terminology;
- complete current coordination-file reads and semantic branch review.

## Branch Lifecycle Posture

The accepted decision run refreshed live state at synchronized `a54ed83688c7a08d292c2b75ec7af3abac75ed52`:

- one local branch: `master`;
- eighteen non-default remote branches;
- two open pull requests;
- PR #2 remains `SUPERSEDED_PRESERVE_EVIDENCE`;
- PR #3 remains `HOLD_NAMED_CONSUMER` through revised `0.6.9.7` and `0.6.9.8`;
- twelve one-document branches remain `CANDIDATE_INTEGRATION` at their named owner triggers;
- two protected references remain read-only;
- no integration, deletion, rebase, force update, or PR closure was due.

Refresh all dynamic facts before action.

## Preserved Boundaries

- Parent `0.6.9` is not accepted.
- Do not run or install `0.6.9.8` before complete revised `0.6.9.7` validation.
- Keep ordinary completion unsaved until explicit manual/quick publication; preserve the owner-certified version-6 same-slot persistence exception.
- Preserve immutable artifacts, publication-before-account-value ordering, collision safety, terminal separation, and all `0.6.9.2` through `0.6.9.5` regressions.
- Do not implement survey behavior, restricted Stakes, injury/trauma/death, broad recovery UI, slot redesign, cloud sync, or generic transaction/replay infrastructure.
- The known broad TypeScript baseline remains a separate route.

## Near-Term Sequence

1. run revised `Version 0.6.9.7` under the accepted focused contract;
2. if and only if complete, install and run independent `Version 0.6.9.8`;
3. accept or further repair parent `0.6.9` from that audit;
4. only then run the unversioned Ashen Reef survey receipt-foundation decision;
5. keep `0.7.0` behind representative-loop acceptance.

## Active Prompt

`Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair`
