# Version 0.6.9.7 Pre-Implementation Source Review

Date: 2026-07-31

Status: `REPAIR_SCOPE_HARDENED_BEFORE_IMPLEMENTATION`

Inspected live `master` head:

`2f05f59d8db6f030427ceec3fb4e21e2243b9da7` — `docs(branches): register 0.6.9.7 evidence PR`

Active route:

`Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair`

Parent posture:

`Version 0.6.9 - Normal Stakes Campaign Persistence Foundation` remains `REPAIR_REQUIRED_AFTER_0.6.9.6`.

## 1. Review Boundary

This was a connector-side static source and coordination review. It inspected the live production owners, their real caller, shared contracts, focused tests, controlling decisions, current prompt/output/handoff, branch and PR posture, and the PR #3 evidence-bundle manifest.

No local checkout, test runner, build, typecheck, JavaScript mirror command, adversarial executable probe, or `git diff --check` was available in this review environment. The findings below are source-inspection findings and mandatory reproduction targets for the repository implementation run. They are not claims that implementation or acceptance has occurred.

No production source, test, shared contract, save format, dependency, content, asset, or generated output changed during this review.

## 2. Reviewed Production And Authority Surfaces

- `packages/engines/game-engine/src/normal-defeat.ts`;
- `packages/engines/game-engine/src/campaign-session.ts`;
- `packages/engines/game-engine/src/campaign-rules.ts`;
- `packages/shared/types/src/contracts.ts`;
- `apps/rpg-ui/src/App.tsx` run-entry recovery caller;
- `tests/unit/campaign-persistence-foundation.test.mjs`;
- `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md`;
- `docs/design/normal-stakes-activation-first-mutation-continuity-and-account-value-publication-dependency-closure-decision.md`;
- `docs/dev/current-codex-output.md`;
- `docs/dev/current-codex-prompt.md`;
- `docs/dev/current-gpt-handoff.md`;
- draft PR #3, its README, and `MANIFEST.sha256`.

## 3. Confirmed Original Findings Still Present

Live source still contains the three blocking defects established by `0.6.9.6`:

1. initial automatic current-location and campaign-start destination ids bypass the exact known-safe-settlement validator;
2. completed-repair replay after restart selects completed history by array position and cannot return a durable exact duplicate result;
3. pending repair does not validate retained resource, tick, snapshot-clock, captured-tick, or original-ledger acceptance-tick facts before effects.

These remain the primary repair findings. The additional findings below are adjacent failure boundaries in the same two production owners and must be reconciled in the same implementation rather than deferred as unrelated cleanup.

## 4. Additional Finding A — Explicit Authority Is Contaminated By Lower-Priority Current Authority

`resolvePendingNormalDefeatRecoveryDestination(...)` resolves and validates current-location authority before it validates a supplied explicit destination.

Consequences:

- a valid explicit destination can be rejected because an irrelevant lower-priority current-location id is blank, padded, unknown, non-settlement, duplicated, or contradictory;
- the accepted precedence `explicit -> current -> campaign start -> bounded fallback` is not implemented as a true short-circuit authority chain;
- production repair callers cannot reliably override corrupt retained location evidence with a valid explicit repair claim.

Required correction:

- determine whether explicit authority was supplied before inspecting current or campaign-start authority;
- validate the explicit claim exactly and either accept it or reject it without fallback;
- do not inspect lower-priority authority when a valid explicit claim controls the result.

Mandatory tests include valid explicit authority paired independently with malformed, unknown, known-false, ruin, wilderness, duplicate, and contradictory current evidence, plus corrupt campaign-start evidence. Every case must retain `destinationSource: "explicit_context"` and apply exactly once.

## 5. Additional Finding B — Initial Duplicate Defeat Selection Is Array-Order And Partial-Evidence Dependent

`resolveNormalDefeat(...)` uses the first receipt whose `sourceMutationId` matches and returns it as a duplicate without proving unique, complete, internally consistent authority.

Consequences:

- two receipts with the same source mutation can select an array-order winner;
- a receipt can be returned even when the original ledger entry is missing, duplicated, or conflicting;
- source kind, campaign, continuity, character, rules, policy, projection identity, and receipt posture are not reconciled before the duplicate result is trusted;
- an orphan ledger or projections with no matching receipt are not distinguished from a truly new defeat;
- reversing receipt or ledger order can change which retained result is returned.

Required correction:

- detect exact duplicate source authority through a unique receipt plus its unique original ledger and required projection evidence;
- require the retained receipt to agree with the current campaign identity, rules, source mutation, and source kind;
- reject zero-receipt partial evidence, multiple matching receipts, multiple matching ledgers, conflicting retained evidence, and orphan authority before any defeat effect;
- an exact duplicate returns the current snapshot and the uniquely proven retained receipt without replaying any effect.

## 6. Additional Finding C — Initial Defeat Admission Does Not Require Exact Valid Resource State

The initial owner rejects only when `hp.current > 0`. Negative, fractional, `NaN`, or otherwise invalid HP values can pass the HP-zero gate. Resource maxima and current bounds are not validated before restoration and receipt creation.

Required correction:

- require finite integer `hp.current === 0`;
- require finite integer resource maxima and current values within valid bounds before cloning or effects;
- require `hp.max >= 1`; require Stamina and MP maxima to be nonnegative and their current values to be within bounds;
- preserve the accepted deterministic HP/Stamina formulas and MP preservation;
- reject invalid resource facts before encounter cleanup, clock mutation, restoration, receipt/ledger append, relocation, Chronicle, or notification.

This is input-integrity hardening for the existing Normal defeat owner, not a balance or resource-system redesign.

## 7. Additional Finding D — Pending Provenance Requirements Need Exact Derivable Invariants

The current prompt correctly requires stronger provenance but contains two ambiguities that could produce either weak validation or invented facts.

For a retained `recovery_pending` receipt under the accepted blocking contract, the strongest derivable tick invariant is:

`sourceTick === resolvedTick === snapshot.clock.tick === snapshot.capturedAtTick`

The pending result advances zero ticks, and ordinary mutation/time advancement remains blocked.

For Stamina, pre-defeat current Stamina is not retained. The repair may prove only facts derivable from the current pending snapshot, retained receipt, maximum, and accepted formula:

- `staminaRestoredTo === current Stamina`;
- all values are finite integers within bounds;
- when `max < 12`, the restored/current value equals `max`;
- when `max >= 12`, the restored/current value is at least `12` and at most `max`.

It must not invent or claim an unavailable exact pre-defeat Stamina value above the floor.

Pending provenance must additionally prove:

- current `campaignRules` are version 2, policy revision 1, and `normal_stakes`, agreeing with the receipt;
- `destinationSource === "none"` as well as null destination and zero recovery ticks;
- resource maxima are valid, not only current values;
- exactly one matching source receipt, original ledger, Chronicle entry, and notification exists;
- no same-source duplicate receipt, orphan correction, or supersession exists.

## 8. Additional Finding E — Campaign Control Identity Is Not Reconciled With Snapshot Authority

`admitCampaignMutation(...)` checks loaded artifact id and session revision but does not establish that the supplied control account, campaign, loaded continuity, and pending continuity agree with the source/proposed snapshot and retained receipt.

Required correction for recovery completion and exact replay:

- fail closed when `control.accountId`, `control.campaignId`, loaded continuity, or pending continuity conflicts with snapshot/receipt authority;
- do not accept a repair merely because artifact and revision numbers happen to match;
- prove rejected identity combinations leave snapshot and control byte-stable.

Do not broaden this run into a generic campaign-session redesign. Add only the identity checks required by the active repair and its existing control contract.

## 9. Additional Finding F — Non-Head Continuity Is Rewritten Before Pending Receipt Validation

For `non_head_unmutated` control, `admitCampaignMutation(...)` mints and writes a child continuity before calling `repairPendingNormalDefeat(...)`.

The retained pending receipt still names the loaded source continuity. The lower-level repair then compares the receipt with the already rewritten campaign identity and can reject a valid pending recovery because admission changed the identity before provenance validation.

Required next-pass handling:

1. reproduce a persisted `recovery_pending` artifact loaded as `non_head_unmutated` through the real run-entry path;
2. validate all retained pending evidence against the source snapshot before any continuity rewrite or other effect;
3. reconcile the accepted first-mutation continuity rule with the completion result;
4. prove exactly one child continuity and one repair result when the contract authorizes that sequence, with no partial fork or repair on rejection.

If current accepted decisions do not determine whether the completed receipt remains on the source continuity or is rewritten to the new child continuity, stop and install the smallest focused contract decision. Do not weaken receipt validation, silently skip the required fork, or guess a provenance rule.

## 10. Additional Finding G — Completion Destination Provenance Is Always Recorded As Explicit

`repairPendingNormalDefeat(...)` writes `destinationSource: "explicit_context"` for every completion, including the production caller that supplies no explicit destination.

Required correction:

- carry source-aware destination resolution through completion;
- explicit caller authority records `explicit_context`;
- automatic validated current authority records `current_settlement`;
- automatic validated campaign-start authority records `campaign_start`.

The bounded sole-known-settlement completion fallback has no dedicated value in the current shared enum. The implementation must reconcile this honestly with accepted authority. It may not silently label an automatic fallback as explicit merely to avoid a contract question. If no existing enum value truthfully represents that provenance under the accepted owner model, stop and install a focused shared-contract decision rather than changing the contract inside this repair.

## 11. Evidence Bundle Disposition

Draft PR #3 remains useful evidence, but its candidate replacements and probes were prepared from source base `b6422118567a79a23be3377f035dd3a6905d4d8b` before this review enumerated Findings A through G.

Therefore:

- the bundle is not a complete acceptance matrix for the live repair;
- passing its retained probes cannot close the newly recorded boundaries;
- candidate files must be compared against live source and extended or rejected as necessary;
- PR #3 remains `HOLD_NAMED_CONSUMER` and must not be merged, cherry-picked, rebased, force-updated, or closed as implementation.

## 12. Required Pre-Edit Reproduction Matrix

The repository implementation must reproduce, against untouched synchronized source:

1. all three `0.6.9.6` findings;
2. valid explicit destination rejected by corrupt lower-priority current/start evidence;
3. duplicate same-source initial receipts and partial receipt/ledger/projection evidence selecting or returning an unproven result;
4. negative, fractional, nonfinite, or out-of-bounds initial resource state entering defeat resolution;
5. pending receipt accepted despite rules, destination-source, exact tick, maxima, or same-source evidence conflict;
6. mismatched campaign-session control accepted or reaching mutation logic;
7. non-head pending completion rewriting continuity before provenance validation;
8. automatic pending completion recording `explicit_context` provenance.

Each reproduction must record the exact observed result, source owner, side-effect boundary, and input byte-stability.

## 13. Scope And Stop Gates

Authorized production and test surfaces remain limited to:

- `packages/engines/game-engine/src/normal-defeat.ts`;
- `packages/engines/game-engine/src/campaign-session.ts`;
- exact JavaScript re-export mirrors only if required;
- `tests/unit/campaign-persistence-foundation.test.mjs`;
- required current coordination documents.

Stop and install a narrower decision if the correct repair requires:

- a new or changed shared receipt field or enum value;
- a save-format or migration change;
- a new dependency;
- a generic replay, command, event, transaction, correction, or workflow framework;
- unrelated UI, account, content, asset, or survey work.

## 14. Next-Pass Acceptance Boundary

`0.6.9.7` may report `IMPLEMENTED_PENDING_PARENT_AUDIT` only when every original and additional finding is reproduced, reconciled, implemented or decision-blocked, covered through repository tests and real callers, and validated under the active prompt.

The parent remains unaccepted. Do not install or run `0.6.9.8` until the complete implementation succeeds. The Ashen Reef survey route remains blocked.
