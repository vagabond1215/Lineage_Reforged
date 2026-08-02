# Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair

## Run Identity

`Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair`

Label class: support suffix

Parent version: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`

Milestone impact: `supports_current_band`

Suggested commit:

`fix(save): harden Normal defeat recovery authority`

## Purpose

Implement the complete nine-finding repair independently reproduced by the stopped `0.6.9.7` attempt, using the accepted contract in:

`docs/design/normal-defeat-recovery-continuity-and-destination-provenance-contract-decision.md`

This revised route is reauthorized to add the exact completion-continuity field and sole-known destination-source literal decided there. Preserve all accepted `0.6.9.2` through `0.6.9.5` behavior. Do not accept parent `0.6.9`; install `0.6.9.8` only after complete implementation and validation.

## Required Reading

Read the complete current versions of:

- `AGENTS.md`;
- `docs/dev/repository-first-agent-work-protocol.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/current-codex-output.md`;
- `docs/dev/historical-version-and-deferred-route-register.md`;
- `docs/design/current-planning-anchor-reconciliation.md`;
- `docs/dev/codex-failure-patterns-and-verification-guardrails.md`;
- `docs/dev/branch-lifecycle-and-integration-policy.md`;
- `docs/dev/branch-disposition-register.md`;
- `docs/dev/version-0.6.9.7-pre-implementation-source-review-2026-07-31.md`;
- `docs/design/normal-defeat-recovery-continuity-and-destination-provenance-contract-decision.md`;
- `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md`;
- `docs/design/normal-stakes-activation-first-mutation-continuity-and-account-value-publication-dependency-closure-decision.md`;
- `docs/design/normal-stakes-campaign-persistence-foundation-acceptance-audit.md`;
- the complete current receipt, campaign identity, continuity, authority-ledger, save snapshot, migration, load, repair, publication, and real `App.tsx` caller paths;
- focused and adjacent tests, manifests, build scripts, TypeScript configuration, and JavaScript/TypeScript mirror posture.

## Evidence Bundle

Inspect draft PR #3 and `parallel/0.6.9.7-repair-bundle` during the mandatory live branch/PR inventory.

- Read its README before reconstruction.
- Verify branch head, source/merge base, ZIP SHA-256 `c5d536b10580877191fc9dc730b5f4f5e5571dc18d15bc7b7200871bf912b3fe`, and member hashes.
- Treat every candidate file, probe, and report as evidence only.
- Independently reproduce all nine findings against untouched synchronized source.
- Compare every candidate line against live contracts, callers, and tests.
- Do not merge, cherry-pick, rebase, force-update, modify, or close the PR/branch as implementation.
- Keep disposition `HOLD_NAMED_CONSUMER` through this repair and its independent successor audit.

## Accepted Contract To Implement

### Original and completion continuity

- `NormalDefeatReceiptState.continuityId` always remains the original defeat continuity.
- Add `recoveryCompletionContinuityId?: string | null` for stored compatibility.
- Every new pending receipt explicitly writes `null`.
- Every new playable receipt explicitly writes the continuity that completed recovery.
- Existing missing-field pending receipts infer `null`; existing missing-field playable receipts infer `receipt.continuityId` only after all other exact durable facts validate.
- At-head completion records the current continuity and creates no fork.
- Non-head ordinary completion validates against untouched source first, creates exactly one child, retains the receipt source continuity, and records the child as completion continuity.
- Later descendants and copied artifacts preserve both receipt fields unchanged.
- Owner-certified version-6 repair creates no child; original and completion continuity remain the migrated continuity, and completed repair must be verified in the loaded slot before play.

### Completion correction authority

- Use one correction entry with id `normal_defeat_recovery.<receiptId>`.
- Its kind is `normal_defeat`, source id is `mutation.recovery_repair.<receiptId>`, `supersedesEntryId` is the original `receiptId`, and accepted tick equals completed `resolvedTick`.
- Do not add a new receipt kind, ledger kind, or generic correction framework.

### Destination source

Add `sole_known_settlement` to the shared union. Strict completion precedence is:

1. supplied and exactly validated explicit -> `explicit_context`;
2. exactly validated current -> `current_settlement`;
3. exactly validated campaign start -> `campaign_start`;
4. exactly one known safe settlement -> `sole_known_settlement`;
5. none or multiple -> fail closed.

A supplied explicit claim never falls back. Valid explicit authority never inspects or is vetoed by lower-priority corruption. The new literal is authorized for pending completion, not as a new automatic initial-resolution fallback.

### Stable targeting

- Infer a target only when exactly one pending receipt exists.
- Completed replay after restart requires an explicit target receipt id.
- Never choose first, last, latest, slot order, or array order.
- Exact duplicate replay returns current snapshot/control and the targeted receipt without rollback, fork, tick, resource, relocation, projection, ledger, revision, or publication effects.

## Pre-Edit Gate

Before editing:

1. fetch/prune and verify clean synchronized `master`, upstream, head, and this exact prompt;
2. inventory every local/remote branch and open PR with merge bases, unique commits, paths, semantic overlap, and dispositions;
3. read and hash-verify PR #3 evidence as required;
4. trace the complete real caller, engine, shared contract, persistence/migration, save/load/publication, export/mirror, and test paths;
5. reproduce all nine findings below against untouched source and record exact effect boundary plus serialized source/control stability;
6. distinguish inspected base, implementation starting head, final committed head, and live post-fetch head.

If the correct implementation requires a new snapshot-format/envelope revision, new dependency, new ledger kind, broad schema/migration rewrite, generic replay/event/transaction framework, or another unlisted production owner, stop and report `IMPLEMENTATION_INCOMPLETE` rather than guessing.

## Nine Findings

### Finding 1 - Unsafe automatic initial destination authority

Initial automatic current and campaign-start candidates must use the exact known-safe-settlement predicate. Malformed, padded, unknown, duplicate, non-settlement, ruin, wilderness, or contradictory evidence must produce the accepted deterministic `recovery_pending` result, not playable relocation. Valid explicit initial authority short-circuits lower evidence and records `explicit_context`.

### Finding 2 - Restart-safe completed duplicate

After in-memory retained mutation results are lost, a caller that explicitly targets a completed receipt must reconstruct one exact durable duplicate from the receipt, original ledger, correction ledger, projections, completion continuity, control, and snapshot. It must return current state without rolling back later accepted mutations.

### Finding 3 - Pending original-effect provenance

Before completion effects, validate the unique pending receipt and all derivable original facts:

- rules version 2, policy revision 1, `normal_stakes`;
- `sourceTick === resolvedTick === clock.tick === capturedAtTick`;
- destination null, source `none`, zero recovery ticks, and completion continuity null/inferred null;
- finite integer resource maxima/currents within bounds;
- HP current equals retained restored HP and is positive;
- MP current equals retained preserved MP;
- Stamina equals retained restored Stamina and satisfies the accepted bounded formula without inventing pre-defeat Stamina;
- exactly one original ledger, Chronicle entry, and notification with matching ids/ticks/posture;
- no duplicate receipt, orphan correction, or supersession.

### Finding 4 - Strict explicit completion precedence

A supplied explicit destination is normalized and validated before current, campaign-start, or sole-known evidence. A valid explicit destination succeeds with corrupt lower-priority evidence; an invalid explicit destination fails without fallback. Rejection is byte-stable.

### Finding 5 - Initial duplicate integrity

A duplicate initial source mutation returns only one uniquely complete receipt/original-ledger/projection evidence set. Missing, duplicate, conflicting, orphaned, or order-dependent evidence fails before effects. Reversed arrays cannot change the result.

### Finding 6 - Exact initial resource admission

Before cloning or effects require finite integer `hp.current === 0`, finite integer maxima/currents, `hp.max >= 1`, nonnegative Stamina/MP maxima, and every current within bounds. Preserve accepted HP/Stamina formulas and MP/body truth. Negative, fractional, nonfinite, or out-of-bounds input fails before cleanup or mutation.

### Finding 7 - Campaign-control identity

Recovery and replay must reconcile control account, campaign, loaded artifact, publication/revision, loaded continuity, pending continuity, source snapshot, receipt campaign/character/continuity, and target mutation id. Matching artifact/revision alone is insufficient.

### Finding 8 - Non-head provenance-before-fork ordering

Validate the exact target, source authority, pending facts, and destination against the untouched source before child-id creation. An accepted non-head ordinary completion creates one child with:

- parent = loaded source continuity;
- current continuity = new child;
- forked artifact/publication from control;
- first mutation = `mutation.recovery_repair.<receiptId>`;
- one matching continuity-fork ledger entry at source tick;
- receipt source continuity unchanged;
- receipt completion continuity = child.

Every rejection creates no child and leaves snapshot/control byte-stable.

### Finding 9 - Truthful completion destination provenance

Carry a source-aware resolved destination through completion. Record explicit/current/campaign-start/sole-known exactly. Do not pre-resolve an automatic destination and pass it back as explicit. Preserve historical pre-decision stored literals without guessing; all new writes must be truthful.

## Exact Transaction Order

For target-format ordinary completion:

1. uniquely select pending target or explicitly target completed replay;
2. validate control, artifact, revision, account, campaign, character, loaded continuity, and mutation identity;
3. validate all retained receipt/ledger/projection/resource/tick facts against untouched source;
4. resolve and classify destination against untouched source;
5. return an exact completed duplicate before any fork;
6. for accepted pending work, clone; create one child only for non-head ordinary completion;
7. update only the target receipt and append one correction entry;
8. advance four ticks, relocate, and apply accepted resources once;
9. update the target Chronicle and notification once;
10. advance session revision and retain result once;
11. leave ordinary result unsaved until explicit manual/quick save.

Every rejection is before child creation and effect application. A thrown partial clone is never returned or persisted.

Owner-certified version-6 repair follows the accepted special path: no child, source-first validation, same continuity, repaired head or non-head address verification before play, and no head replacement from a non-head source.

## Required Tests

Extend `tests/unit/campaign-persistence-foundation.test.mjs` to cover at least:

- all nine untouched-source reproductions becoming closed tests;
- valid explicit/current/campaign-start initial resolution and invalid automatic initial evidence becoming pending;
- initial exact resources, complete duplicate, partial/orphan/duplicate evidence, and reversed arrays;
- at-head pending completion;
- non-head completion through the real run-entry caller;
- every rejection before child creation and one exact accepted child/completion;
- restart before completion, restart after completion, and explicit completed target replay;
- duplicate after later accepted mutation without rollback;
- multiple historical receipts, explicit stable targeting, copied artifacts, and reversed receipt/ledger arrays;
- missing/duplicate/conflicting original and correction ledger evidence;
- corrupt control account/campaign/artifact/revision/continuity and receipt campaign/character/continuity;
- every pending tick, resource, rules, policy, source, posture, Chronicle, notification, and completion-continuity corruption;
- explicit with each corrupt lower source; invalid explicit without fallback;
- current, campaign-start, sole-known, no-known, and multiple-known completion cases with exact source labels;
- old target snapshots with missing completion field in pending and playable postures;
- version-6 head and non-head HP-zero repair, pending block, no-child correction, verified persistence, retry, and source-byte retention;
- publication blocked pending, ordinary completion unsaved, explicit later save, and exactly-once account publication;
- all existing accepted persistence, migration, collision, publication, lifecycle, terminal, and command regressions.

Fresh adversarial probes must independently vary array order, caller-state loss, restart, copied artifacts, identity conflicts, partial evidence, and rejection boundaries. Green focused tests alone do not accept the repair.

## Authorized Surface

Production changes are limited to the smallest coherent subset of:

- `packages/shared/types/src/contracts.ts`;
- `packages/engines/game-engine/src/normal-defeat.ts`;
- `packages/engines/game-engine/src/campaign-session.ts`;
- `packages/engines/game-engine/src/index.ts` and the exact `.js` re-export mirror only if a new public helper is required;
- `apps/rpg-ui/src/game-shell/saveManager.ts` only for the exact owner-certified version-6 completion/persistence path;
- `apps/rpg-ui/src/App.tsx` only for the real caller and legacy-owner routing required by this contract;
- `tests/unit/campaign-persistence-foundation.test.mjs`;
- exact current coordination and focused authority documents required by repository protocol.

Do not change `packages/shared/persistence/src/index.ts`, snapshot format identity, envelope version, ledger kinds, dependencies, content, assets, survey behavior, or unrelated UI.

## Validation Commands

Run:

```powershell
node --test tests\unit\campaign-persistence-foundation.test.mjs
```

```powershell
node --test tests\simulation\save-load-roundtrip.test.mjs tests\unit\achievements.test.mjs tests\unit\account-profile-storage.test.mjs tests\unit\run-lifecycle.test.mjs tests\unit\player-travel-command.test.mjs tests\unit\player-quest-acceptance-command.test.mjs tests\unit\player-quest-tracking-command.test.mjs tests\unit\player-activity-selection-command.test.mjs tests\unit\combat-hook-support.test.mjs tests\unit\combat-spawn-foundation.test.mjs tests\unit\campaign-persistence-foundation.test.mjs
```

```powershell
npx.cmd vite build
```

Run the repository's prescribed bounded TypeScript audit and report total diagnostics plus whether any changed production file is named. Do not weaken configuration or absorb the known broad baseline into this repair.

Also run:

- fresh adversarial probes for every finding and contract row;
- real `App.tsx` caller execution/inspection;
- target serialization/deserialization compatibility and public export/mirror checks;
- `git diff --check`;
- complete unstaged, staged, post-commit, and hygiene review.

## Applicable Verification Guardrails

Apply and report `FP-001` through `FP-012`, with special attention to:

- `FP-001`: real `App.tsx` caller;
- `FP-002`: independent failure-boundary matrix beyond green totals;
- `FP-003`: reachable completion and blocked legacy exit;
- `FP-005`: caller loss and restart;
- `FP-006`: no newer-truth rollback;
- `FP-008`: semantic PR/branch review;
- `FP-009`: exact head terminology;
- `FP-010`: all nine findings mapped;
- `FP-011`: strict precedence and provenance before child/effects;
- `FP-012`: stable target plus unique complete durable evidence.

## Completion Decision

On complete implementation:

- report `IMPLEMENTED_PENDING_PARENT_AUDIT`;
- preserve parent `0.6.9` as unaccepted;
- update focused acceptance authority and all current coordination files;
- install `Version 0.6.9.8 - Initial Defeat And Durable Recovery Completion Acceptance Audit` as the next prompt;
- retain PR #3 through that independent audit;
- keep the Ashen Reef survey route blocked.

If any finding, caller, compatibility row, migration row, validation gate, or contract remains incomplete:

- report `IMPLEMENTATION_INCOMPLETE`;
- do not install `0.6.9.8`;
- record the exact smallest blocker and preserve the current repair route.

## Scope Exclusions

Do not implement survey behavior, Committed/Ironbound Stakes, injury/trauma/death/succession, broad recovery UI, slot redesign, cloud synchronization, generic replay/event/transaction/correction frameworks, dependency changes, content/assets, protected-branch changes, unrelated cleanup, or broad TypeScript repair.

## Completion Report

Report:

- all nine pre-edit reproductions and finding-to-code-to-test dispositions;
- exact continuity and destination-source behavior;
- head/non-head/legacy ordering and rollback evidence;
- compatibility and migration evidence;
- test/build/type/probe/mirror/diff results with exact counts;
- `FP-001` through `FP-012` evidence;
- live branch/PR inventory, dispositions, actions, and retained triggers;
- files changed, risks, exact final commit, and live remote head;
- exact installed next route.
