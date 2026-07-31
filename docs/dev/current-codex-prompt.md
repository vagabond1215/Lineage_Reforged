# Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair

## Run Identity

`Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair`

Label class: support suffix

Parent version: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`

Milestone impact: `supports_current_band`

Suggested commit:

`fix(save): close defeat recovery restart authority`

## Purpose

Repair the three primary findings independently proved by `Version 0.6.9.6 - Pending-Defeat Completion Authority And Provenance Acceptance Audit`:

1. initial automatic defeat resolution bypasses exact current-location and campaign-start settlement validation;
2. a completed recovery cannot return retained duplicate state after restart;
3. pending repair accepts corrupted original resource/tick receipt facts and a conflicting original ledger acceptance tick.

Also close the adjacent failure boundaries confirmed by the pre-implementation live-source review in the same two production owners:

4. valid explicit authority is contaminated by corrupt lower-priority current/start evidence;
5. initial duplicate defeat handling trusts first-match and partial retained evidence;
6. initial defeat admission accepts invalid nonzero-equivalent or out-of-bounds resource state;
7. campaign-session control identity is not fully reconciled with snapshot and receipt authority;
8. non-head continuity can be rewritten before pending receipt provenance is validated;
9. pending completion always records `destinationSource: "explicit_context"`, including automatic authority.

Preserve every accepted `0.6.9.2` through `0.6.9.5` boundary. Do not implement the Ashen Reef survey receipt decision and do not accept the parent during this implementation run.

## Required Reading

Read the complete current versions of:

- `AGENTS.md`;
- `docs/dev/repository-first-agent-work-protocol.md`;
- `docs/dev/repository-wide-review-2026-07-31.md`;
- `docs/dev/version-0.6.9.7-pre-implementation-source-review-2026-07-31.md`;
- `docs/dev/codex-failure-patterns-and-verification-guardrails.md`;
- `docs/design/normal-stakes-campaign-persistence-foundation-acceptance-audit.md`;
- `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md`;
- `docs/design/normal-stakes-activation-first-mutation-continuity-and-account-value-publication-dependency-closure-decision.md`;
- `docs/design/normal-campaign-new-game-retry-and-recovery-collision-audit.md`;
- `docs/dev/current-codex-output.md`;
- `packages/shared/types/src/contracts.ts` around campaign identity, rules, authority ledger, Normal defeat receipts, resources, locations, and save snapshots;
- `packages/engines/game-engine/src/normal-defeat.ts` and its JavaScript mirror;
- `packages/engines/game-engine/src/campaign-session.ts` and its JavaScript mirror;
- `packages/engines/game-engine/src/campaign-rules.ts` target-snapshot validation;
- save-manager, `App.tsx`, new-campaign coordinator, account-publication, lifecycle, and focused persistence tests;
- current handoff, historical/deferred register, planning reconciliation, branch policy, and branch register;
- the protected integrated-gameplay readiness branch through read-only Git inspection only.

## Required Evidence Input

During the mandatory live branch and pull-request inventory, inspect draft PR #3:

`Evidence only: associate 0.6.9.7 repair bundle with active Codex route`

Required identity at prompt installation:

- PR: `#3`;
- branch: `parallel/0.6.9.7-repair-bundle`;
- branch head: `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`;
- source base: `b6422118567a79a23be3377f035dd3a6905d4d8b`;
- repository path: `docs/dev/repair-bundles/version-0.6.9.7/`;
- reconstructed ZIP SHA-256: `c5d536b10580877191fc9dc730b5f4f5e5571dc18d15bc7b7200871bf912b3fe`.

Handling requirements:

1. Resolve the live PR and branch identities after fetch/prune and report any drift from the installed identities above.
2. Read the branch README before reconstructing the bundle and verify the reconstructed ZIP hash before inspection.
3. Treat the candidate source replacements, probes, matrices, and report as evidence only.
4. Independently reproduce all nine numbered findings against untouched live source before applying any candidate change.
5. Treat the bundle as incomplete for Findings 4 through 9 unless its contents independently prove otherwise; passing the retained probes does not close the fresh source-review matrix.
6. Compare every candidate change against current `master`, current contracts, current callers, and current tests; do not assume the source-base snapshot is still authoritative.
7. Do not merge, cherry-pick, rebase, force-update, or close PR #3 or its branch as part of implementation. Its divergence from current `master` is intentional evidence posture, not a request to make it merge-ready.
8. Implement only independently reviewed changes in the synchronized repository worktree and leave the evidence branch under `HOLD_NAMED_CONSUMER` until the active implementation and its independent successor audit complete.

## Applicable Verification Guardrails

Apply and report `FP-001` through `FP-012`.

Give particular attention to:

- `FP-001`: real `App.tsx` run-entry caller;
- `FP-003`: reachable completion from persisted pending state;
- `FP-005`: caller loss and restart;
- `FP-006`: stale and competing authority;
- `FP-007`: complete-file coordination writes;
- `FP-008`: semantic bundle and branch review;
- `FP-009`: exact head terminology;
- `FP-010`: complete finding reconciliation;
- `FP-011`: authority precedence and provenance-before-mutation ordering;
- `FP-012`: unique complete durable duplicate evidence.

## Execution Gate

1. Verify clean synchronized `master`, upstream, current head, and this exact prompt.
2. Fetch/prune and refresh every branch and open PR disposition, including draft PR #3 and its evidence-only branch.
3. Complete the whole-repository orientation required by `docs/dev/repository-first-agent-work-protocol.md` before narrowing to the edit surface.
4. Reproduce all nine findings against untouched source before editing and record exact observed behavior and byte-stability.
5. Distinguish inspected base, implementation starting head, final committed head, and live post-fetch head.
6. Stop and install a narrower support decision if the correct repair requires a shared receipt/enum change, save-format change, migration change, dependency change, or unrelated owner.
7. Preserve the distinction between a rejected explicit authority claim and an automatically resolved `recovery_pending` defeat. Do not erase retained defeat truth merely because automatic destination authority is invalid.
8. Validate retained source provenance before cloning, continuity rewrite, relocation, time advancement, correction append, or projection mutation.

## Finding 1 — Initial Destination Authority And Strict Precedence

Initial `resolveNormalDefeat(...)` destination selection must use one exact settlement-evidence predicate while preserving the accepted authority order and initial defeat sequence.

### Shared validation

- Explicit context, current-location, and campaign-start candidates require exact, unpadded, nonblank ids.
- Each accepted candidate must have exactly one matching location record with `known === true`, `type === "settlement"`, and an exact `settlementId`.
- Unknown, known-false, non-settlement, duplicate, or contradictory evidence is invalid.
- Refactor only enough internal code to share validation and prevent subtly different rules.

### Explicit destination behavior

When an explicit context destination is supplied:

- determine that explicit authority controls before inspecting current or campaign-start evidence;
- validate it before any defeat-resolution or completion side effect;
- if valid, use it and record `destinationSource: "explicit_context"`;
- if malformed, unknown, non-settlement, duplicated, or contradictory, reject deterministically before encounter cleanup, resource restoration, clock change, receipt creation/update, ledger append, Chronicle/notification projection, relocation, continuity rewrite, or source-snapshot mutation;
- never ignore an invalid explicit claim and fall through;
- never reject a valid explicit claim because lower-priority current or campaign-start evidence is corrupt.

### Automatic initial behavior

When no explicit destination is supplied:

1. If a current-location settlement id is present, validate that exact candidate.
   - If valid, use it and record `destinationSource: "current_settlement"`.
   - If invalid, do not fall through. Resolve the defeat once into `recovery_pending`.
2. Only when current-location settlement authority is absent may campaign-start authority be considered.
   - If valid, use it and record `destinationSource: "campaign_start"`.
   - If present but invalid, do not fall through. Resolve once into `recovery_pending`.
3. If both are absent, resolve once into `recovery_pending`.
4. Initial defeat resolution must not add the sole-known-settlement fallback used by bounded pending completion.

### Required automatic `recovery_pending` result

Invalid or absent automatic destination authority must preserve one accepted nonterminal defeat result:

- clear the accepted encounter and transient combat bindings once;
- restore HP and Stamina once using the accepted Normal formulas;
- preserve MP and body state;
- retain one defeat receipt, one original `normal_defeat` ledger entry, one Chronicle entry, and one notification;
- set `destinationId: null`, `destinationSource: "none"`, `recoveryTicks: 0`, and `posture: "recovery_pending"`;
- do not advance clock or total-play ticks;
- do not relocate or invent a site label;
- do not mutate the input snapshot;
- block ordinary gameplay and publication until validated completion.

A valid playable initial destination still advances exactly four recovery ticks and applies relocation once.

## Finding 2 — Initial Defeat Input And Duplicate Integrity

### Exact resource admission

Before cloning or effects, require:

- finite integer `hp.current === 0`;
- finite integer `hp.max >= 1`;
- finite integer Stamina and MP maxima greater than or equal to zero;
- each current resource finite, integral, and within `0..max`;
- campaign identity and current target Normal rules present and internally consistent.

Reject negative, fractional, nonfinite, or out-of-bounds values before every effect. Do not change resource balance or add a general validation framework.

### Exact duplicate initial result

A repeated source mutation may return a duplicate only when one unique complete retained evidence set proves it:

- exactly one receipt for the source mutation;
- source kind, campaign, continuity, character, rules, policy, and posture agree with the current authority;
- exactly one original `normal_defeat` ledger entry agrees with receipt id, source mutation, kind, and accepted tick;
- exactly one matching Chronicle entry and notification exists;
- no same-source receipt conflict, duplicate original entry, orphan correction, or contradictory projection exists.

Do not select a first, last, or latest receipt by array order. Missing receipt with orphan ledger/projection evidence, multiple same-source receipts, partial evidence, or conflicts fail closed before effects. An exact duplicate returns the current snapshot and uniquely proven receipt without replaying cleanup, restoration, time, relocation, ledger, Chronicle, or notification.

## Finding 3 — Restart-Safe Duplicate Completion

A completed repair must carry enough durable evidence for an exact replay after save/load or process restart.

Required behavior:

- an exact replay identifies the intended receipt through an explicit stable receipt id or equivalently exact replay evidence; never select completed history by array order;
- one exact completed receipt, original ledger entry, deterministic correction entry, campaign/continuity/character identity, destination, and recovery mutation source must agree;
- campaign-session control account, campaign, continuity, artifact, and revision authority must agree with the target snapshot and receipt;
- exact replay returns `duplicate: true` with current snapshot and control unchanged;
- replay after a later accepted mutation and after explicit save/reload cannot roll state back, change session revision, append ledger entries, advance ticks, relocate, restore resources, or reproject Chronicle/notification;
- reversed receipt and ledger order must not change the result;
- multiple historical repairs are permitted only when exact target identity disambiguates one result;
- missing target identity where history is ambiguous, zero matches, multiple matches, conflicting destination, conflicting correction, conflicting control, or conflicting campaign identity fails closed with stable diagnostics;
- ordinary production entry continues to invoke repair only when recovery is pending; the explicit replay surface is for idempotency verification and exact retry, not a new ordinary UI action.

Do not persist the in-memory retained-mutation-result array or add a generic replay framework. Use existing durable receipt and authority-ledger evidence.

## Finding 4 — Original Pending Effect Provenance

Before repair effects, validate the pending receipt and original ledger as one internally consistent original defeat result.

At minimum validate:

- snapshot campaign rules are version 2, policy revision 1, `normal_stakes`, and agree with receipt rules/policy;
- campaign, continuity, character, source mutation, source kind, and pending posture;
- `recoveryTicks === 0`, `destinationId === null`, and `destinationSource === "none"`;
- finite integer resource maxima/current values within valid bounds;
- `hpRestoredTo` equals current HP and the deterministic Normal HP restoration formula for retained maximum;
- `staminaRestoredTo` equals current Stamina and satisfies the strongest derivable accepted formula invariant: when max is below 12 it equals max; otherwise it is between 12 and max;
- `mpPreservedAt` equals current MP;
- exact pending tick equality: `sourceTick === resolvedTick === snapshot.clock.tick === snapshot.capturedAtTick`;
- exactly one original `normal_defeat` ledger entry has the same receipt id and source mutation, no supersession, and `acceptedAtTick === resolvedTick`;
- exactly one matching receipt, Chronicle entry, and notification exists;
- no same-source duplicate receipt, retained correction, supersession, or orphan projection exists.

Do not invent unavailable pre-defeat Stamina facts. Validate only facts deterministically derivable from retained snapshot, receipt, ledger, current rules, and accepted formulas.

Corrupt any one resource, maximum, tick, rules, identity, posture, destination-source, receipt count, ledger, Chronicle, notification, or correction fact and prove rejection occurs before cloning or effects.

## Finding 5 — Campaign-Control Identity And Non-Head Completion Ordering

Recovery completion and durable replay must validate control authority against source snapshot and receipt before mutation.

Required checks include:

- `control.accountId` agrees with snapshot account;
- `control.campaignId` agrees with snapshot and receipt campaign;
- loaded or pending continuity facts agree with the source snapshot under the current posture;
- loaded artifact and session revision checks remain intact;
- proposed snapshot identity cannot switch account, campaign, or character authority under the repair owner.

For a persisted pending artifact loaded as `non_head_unmutated`:

1. reproduce the real `App.tsx` run-entry path;
2. validate retained pending evidence against the loaded source continuity before any child continuity rewrite;
3. apply the accepted first-mutation continuity rule and repair in a transactionally safe order;
4. prove exactly one child continuity and one repair result when authorized;
5. prove rejection creates neither a child nor partial repair effects.

If accepted authority does not determine whether the completed receipt retains source continuity or is rewritten to the new child continuity, stop and install the smallest focused contract decision. Do not weaken receipt validation, skip the required fork, or guess.

## Finding 6 — Completion Destination Provenance

Pending completion must carry source-aware destination resolution through the receipt update:

- explicit caller authority -> `explicit_context`;
- automatic validated current authority -> `current_settlement`;
- automatic validated campaign-start authority -> `campaign_start`.

The bounded sole-known-settlement fallback has no dedicated value in the current shared enum. Do not silently label an automatic fallback as explicit. Reconcile whether the repair owner itself constitutes truthful explicit context under accepted authority; if not, stop and install a focused shared-contract decision instead of changing the enum in this repair.

Every accepted completion must retain exact destination provenance, update one receipt, one Chronicle entry, one notification, and append one deterministic correction entry while applying one four-tick relocation and one session revision.

## Required Tests

Extend the focused persistence suite with executable coverage for all rows below.

### Initial destination, resources, and duplicate evidence

- valid explicit, current, and campaign-start destinations with correct source;
- valid explicit destination with corrupt blank, padded, unknown, known-false, ruin, wilderness, duplicate, and contradictory lower-priority current/start evidence;
- invalid explicit authority rejecting before every side effect and without fallback;
- automatic invalid/absent current/start cases producing one exact pending result;
- corrupt current with valid start still producing pending, not fallback;
- exact finite HP-zero and valid resource bounds;
- negative, positive, fractional, nonfinite, invalid maximum, and out-of-bounds resource rejection before effects;
- exact duplicate same-source replay;
- duplicate same-source receipts, reversed arrays, missing/duplicate original ledger, orphan ledger/projections, conflicting source kind/identity/rules/posture, and partial evidence rejection;
- input snapshot byte-equivalence after rejected cases.

### Durable completion duplicate and control

- exact duplicate completion after a later accepted mutation;
- exact duplicate completion after explicit save/reload using stable receipt identity;
- reversed completed-receipt and ledger ordering;
- multiple historical repaired defeats without first/latest selection;
- missing, unknown, duplicate, and conflicting target receipt, destination, campaign, continuity, original entry, correction entry, control account/campaign, artifact, and revision;
- byte-stable current snapshot/control, session revision, clock, resources, location, projections, and ledger on duplicate replay.

### Pending provenance, ordering, and source labels

- corrupted HP, Stamina, MP, every maximum, source/resolved/snapshot/captured tick, rules/policy, destination source, original ledger tick, identity, posture, Chronicle, notification, and correction evidence;
- exact tick equality and strongest derivable Stamina invariant tests;
- valid explicit/current/campaign-start completion source labels;
- sole-known fallback provenance resolved honestly or a focused contract blocker installed;
- non-head persisted pending completion through real run-entry caller;
- control/snapshot identity mismatch rejection before continuity or repair effects;
- one valid completion performs exactly one continuity transition when required, four-tick relocation, receipt/projection update, correction append, and session revision;
- rejected non-head completion leaves source snapshot/control byte-stable and creates no child continuity;
- pending ordinary mutation, publication, manual save, quick-save, and retirement blocking;
- production `App.tsx` caller and explicit-save-after-repair roundtrip;
- all existing new-campaign retry, restart, slot-collision, account-consumer, migration, control, immutable-address, and terminal behavior.

## Authorized Surface

Production changes are limited to the smallest coherent subset of:

- `packages/engines/game-engine/src/normal-defeat.ts`;
- `packages/engines/game-engine/src/campaign-session.ts`;
- their exact JavaScript re-export mirrors only if required;
- `tests/unit/campaign-persistence-foundation.test.mjs`;
- required current coordination documents.

Do not change shared contracts, save formats, dependencies, account schemas, content, assets, generated output, or unrelated UI behavior. If a shared contract or save-format change becomes necessary, stop and report the exact blocker through the smallest focused successor decision.

## Validation Commands

Run:

```text
node --test tests\unit\campaign-persistence-foundation.test.mjs
```

Run the prescribed group:

```text
node --test tests\simulation\save-load-roundtrip.test.mjs tests\unit\achievements.test.mjs tests\unit\account-profile-storage.test.mjs tests\unit\run-lifecycle.test.mjs tests\unit\player-travel-command.test.mjs tests\unit\player-quest-acceptance-command.test.mjs tests\unit\player-quest-tracking-command.test.mjs tests\unit\player-activity-selection-command.test.mjs tests\unit\combat-hook-support.test.mjs tests\unit\combat-spawn-foundation.test.mjs tests\unit\campaign-persistence-foundation.test.mjs
```

Also run:

- RPG UI production build;
- bounded RPG UI TypeScript audit;
- relevant root/workspace TypeScript posture without claiming the known baseline is green;
- exact TypeScript/JavaScript mirror checks;
- fresh adversarial probes covering every finding, not only the PR #3 bundle cases;
- production caller inspection and execution;
- `git diff --check`;
- complete staged and post-commit diff inspection.

Report exact counts and whether any TypeScript diagnostic names a changed repair file.

## Completion Decision

On complete implementation:

- report `IMPLEMENTED_PENDING_PARENT_AUDIT`;
- leave the parent unaccepted;
- update the parent audit and current coordination documents;
- install `Version 0.6.9.8 - Initial Defeat And Durable Recovery Completion Acceptance Audit` as a separate read-only audit unless fresh evidence requires a narrower exact successor;
- keep the Ashen Reef survey receipt decision blocked.

If any finding remains or a contract ambiguity blocks truthful implementation:

- report `IMPLEMENTATION_INCOMPLETE`;
- do not partially waive or call the parent accepted;
- install the smallest exact successor repair or focused contract-decision prompt;
- do not install `0.6.9.8` prematurely.

## Scope Exclusions

Do not:

- implement survey behavior, receipts, commands, UI, or migrations;
- add Committed or Ironbound Stakes;
- redesign slots, launcher, recovery UI, defeat, death, succession, injury, care, account, or retirement systems;
- add a generic workflow, transaction, replay, event, command, correction, validation, or effect framework;
- change shared receipt types or save formats without stopping for a focused decision;
- merge, modify, rebase, force-update, or delete protected branches;
- merge or close PR #2;
- merge, cherry-pick, rebase, force-update, or close PR #3 or `parallel/0.6.9.7-repair-bundle` during implementation;
- perform unrelated cleanup.

## Completion Report

Report:

- pre-edit reproduction for all nine findings;
- numbered finding-to-code-to-test matrix;
- failure-boundary and receipt/provenance/effect matrices;
- authority-precedence and provenance-before-mutation evidence;
- initial and completion duplicate-evidence matrices;
- head and non-head completion ordering and continuity result;
- destination-source matrix, including sole-known fallback disposition;
- PR #3 identity, hash verification, candidate reconciliation, uncovered cases, and retained disposition;
- `FP-001` through `FP-012` evidence;
- exact commands and counts;
- TypeScript posture;
- inspected-base, starting, final, and live-head identities;
- branch/PR lifecycle and exact retained review triggers;
- files changed, risks, and suggested commit;
- `IMPLEMENTED_PENDING_PARENT_AUDIT` or `IMPLEMENTATION_INCOMPLETE`;
- installed next route.
