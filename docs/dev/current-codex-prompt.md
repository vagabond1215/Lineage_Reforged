# Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair

## Run Identity

`Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair`

Label class: support suffix

Parent version: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`

Milestone impact: `supports_current_band`

Suggested commit:

`fix(save): close defeat recovery restart authority`

## Purpose

Repair only the three findings independently proved by `Version 0.6.9.6 - Pending-Defeat Completion Authority And Provenance Acceptance Audit`:

1. initial automatic defeat resolution bypasses exact current-location and campaign-start settlement validation;
2. a completed recovery cannot return retained duplicate state after restart;
3. pending repair accepts corrupted original resource/tick receipt facts and a conflicting original ledger acceptance tick.

Preserve every accepted `0.6.9.2` through `0.6.9.5` boundary. Do not implement the Ashen Reef survey receipt decision and do not accept the parent during this implementation run.

## Required Reading

Read the complete current versions of:

- `AGENTS.md`;
- `docs/dev/repository-first-agent-work-protocol.md`;
- `docs/dev/repository-wide-review-2026-07-31.md`;
- `docs/dev/codex-failure-patterns-and-verification-guardrails.md`;
- `docs/design/normal-stakes-campaign-persistence-foundation-acceptance-audit.md`;
- `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md`;
- `docs/design/normal-stakes-activation-first-mutation-continuity-and-account-value-publication-dependency-closure-decision.md`;
- `docs/design/normal-campaign-new-game-retry-and-recovery-collision-audit.md`;
- `docs/dev/current-codex-output.md`;
- `packages/shared/types/src/contracts.ts` around campaign identity, authority ledger, Normal defeat receipts, resources, locations, and save snapshots;
- `packages/engines/game-engine/src/normal-defeat.ts` and its JavaScript mirror;
- `packages/engines/game-engine/src/campaign-session.ts` and its JavaScript mirror;
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
4. Independently reproduce all three findings against untouched live source before applying any candidate change.
5. Compare every candidate change against current `master`, current contracts, current callers, and current tests; do not assume the source-base snapshot is still authoritative.
6. Do not merge, cherry-pick, rebase, force-update, or close PR #3 or its branch as part of implementation. Its divergence from current `master` is intentional evidence posture, not a request to make it merge-ready.
7. Implement only independently reviewed changes in the synchronized repository worktree and leave the evidence branch under `HOLD_NAMED_CONSUMER` until the active implementation and its independent successor audit complete.

## Applicable Verification Guardrails

Apply and report `FP-001` through `FP-010`. Apply `FP-007` when rewriting the large current output or prompt and verify each complete replacement after writing.

## Execution Gate

1. Verify clean synchronized `master`, upstream, current head, and this exact prompt.
2. Fetch/prune and refresh every branch and open PR disposition, including draft PR #3 and its evidence-only branch.
3. Complete the whole-repository orientation required by `docs/dev/repository-first-agent-work-protocol.md` before narrowing to the edit surface.
4. Reproduce all three findings against untouched source before editing.
5. Distinguish inspected base, implementation starting head, final committed head, and live post-fetch head.
6. Stop and install a narrower support prompt if the required repair would change shared types, save format, dependencies, or unrelated owners.
7. Preserve the accepted distinction between a rejected explicit authority claim and an automatically resolved `recovery_pending` defeat. Do not erase retained defeat truth merely because automatic destination authority is invalid.

## Finding 1 - Initial Automatic Destination Authority

Initial `resolveNormalDefeat(...)` destination selection must use the same exact settlement-evidence predicate as pending recovery completion while preserving the accepted initial defeat sequence.

### Shared validation

- Explicit context, current-location, and campaign-start candidates require exact, unpadded, nonblank ids.
- Each accepted candidate must have exactly one matching location record with `known === true`, `type === "settlement"`, and an exact `settlementId`.
- Unknown, known-false, non-settlement, duplicate, or contradictory evidence is invalid.
- Refactor only enough internal code to share validation and prevent subtly different authority rules.

### Explicit destination behavior

When an explicit context destination is supplied:

- validate it before any defeat-resolution side effect;
- if valid, use it and record `destinationSource: "explicit_context"`;
- if malformed, unknown, non-settlement, duplicated, or contradictory, reject deterministically before encounter cleanup, resource restoration, clock change, receipt creation, ledger append, Chronicle/notification projection, relocation, or source-snapshot mutation;
- never ignore an invalid explicit authority claim and fall through to current, campaign-start, or another location.

### Automatic destination behavior

When no explicit destination is supplied:

1. If a current-location settlement id is present, validate that exact candidate.
   - If valid, use it and record `destinationSource: "current_settlement"`.
   - If invalid, do not fall through to campaign start or another known settlement. Resolve the defeat once into `recovery_pending`.
2. Only when the current-location settlement id is absent may campaign-start authority be considered.
   - If valid, use it and record `destinationSource: "campaign_start"`.
   - If present but invalid, do not fall through. Resolve the defeat once into `recovery_pending`.
3. If both current and campaign-start authority are absent, resolve once into `recovery_pending`.
4. Initial defeat resolution must not add the sole-known-settlement fallback used by bounded pending completion.

### Required `recovery_pending` result

Invalid or absent automatic destination authority must not abort or erase the accepted defeat occurrence. It must produce exactly one retained nonterminal `recovery_pending` result:

- clear the accepted encounter and transient combat bindings once;
- restore HP and Stamina once using the accepted Normal formula;
- preserve MP and body state;
- retain one defeat receipt, one original `normal_defeat` ledger entry, one Chronicle entry, and one notification;
- set `destinationId: null`, `destinationSource: "none"`, `recoveryTicks: 0`, and `posture: "recovery_pending"`;
- do not advance the clock or total-play ticks;
- do not relocate or invent a site label;
- do not mutate the input snapshot;
- block ordinary gameplay and publication through the existing pending posture until validated completion.

A valid playable initial destination still advances exactly four recovery ticks and applies the accepted relocation once. An invalid automatic destination may never produce a playable receipt, relocation, or recovery-time advancement.

## Finding 2 - Restart-Safe Duplicate Completion

A completed repair must carry enough durable evidence for an exact replay after save/load or process restart.

Required behavior:

- an exact replay identifies the intended receipt through an explicit stable receipt id or equivalently exact replay evidence; never select the first, last, or latest completed receipt by array order;
- one exact completed receipt, original ledger entry, deterministic correction entry, campaign/continuity/character identity, destination, and recovery mutation source must agree;
- an exact replay returns `duplicate: true` with the current snapshot and control unchanged;
- replay after a later accepted mutation and replay after explicit save/reload cannot roll state back, change session revision, append ledger entries, advance ticks, relocate, restore resources, or reproject Chronicle/notification;
- reversed receipt and ledger order must not change the result;
- multiple historical completed repairs are permitted only when the exact target identity disambiguates one result;
- missing target identity where completed history is ambiguous, zero matches, multiple matches, conflicting destination, conflicting correction, or conflicting campaign identity fails closed with stable diagnostics;
- ordinary production entry continues to invoke repair only when recovery is pending; the explicit replay surface exists for idempotency verification and exact retry, not as a new ordinary UI action.

Do not persist the in-memory retained-mutation-result array or add a generic replay framework. Use the existing durable receipt and authority-ledger evidence.

## Finding 3 - Original Effect Provenance

Before repair effects, validate the pending receipt and original ledger as one internally consistent original defeat result.

At minimum validate:

- campaign, continuity, character, rules, policy, source mutation, source kind, and pending posture;
- `recoveryTicks === 0`, `destinationId === null`, and `destinationSource === "none"`;
- integer and ordered source/resolution ticks;
- `sourceTick <= resolvedTick`;
- the pending snapshot clock and `capturedAtTick` equal the retained pending `resolvedTick`, because ordinary mutation and time advancement are blocked while recovery is pending;
- `hpRestoredTo` equals current HP and the deterministic Normal HP restoration formula for the retained maximum;
- `staminaRestoredTo` equals current Stamina and the deterministic Normal Stamina restoration formula for the retained maximum and preexisting result;
- `mpPreservedAt` equals current MP and remains within the retained maximum;
- current HP, Stamina, and MP are finite integers within valid bounds;
- exactly one original `normal_defeat` ledger entry has the same receipt id, source mutation, no supersession, and `acceptedAtTick === resolvedTick`;
- exactly one matching receipt, Chronicle entry, and notification exists;
- no retained correction or supersession entry already exists for a pending receipt.

Corrupt any one resource fact, tick fact, ledger tick, identity, posture, receipt count, Chronicle count, notification count, or correction fact and prove rejection occurs before cloning or effects.

Do not invent unavailable pre-defeat facts. Validate only facts deterministically derivable from the retained snapshot, receipt, ledger, and accepted Normal formulas. If one required invariant cannot be established without changing a shared contract or save format, stop and install a narrower contract decision instead of weakening validation.

## Required Tests

Extend the focused persistence suite with executable coverage for:

### Initial resolution

- valid explicit, current, and campaign-start destinations with correct `destinationSource`;
- invalid explicit blank, padded, unknown, known-false, ruin, wilderness, duplicate, and contradictory authority rejecting before every side effect;
- automatic blank, padded, unknown, known-false, ruin, wilderness, duplicate, contradictory, corrupt-current-with-valid-start, and corrupt-start cases producing one exact `recovery_pending` result;
- automatic absence of current and campaign-start authority producing one exact `recovery_pending` result;
- proof every automatic invalid/absent case restores HP/Stamina and creates receipt, original ledger, Chronicle, and notification exactly once while applying zero recovery ticks and zero relocation;
- proof the input snapshot remains byte-equivalent after both rejected explicit and automatically resolved cases;
- duplicate source-mutation replay returning the retained initial result without repeating any effect.

### Durable duplicate completion

- exact duplicate completion after a later accepted mutation;
- exact duplicate completion after explicit save/reload using stable receipt identity;
- reversed completed-receipt and ledger ordering;
- multiple historical repaired defeats without first/latest selection;
- missing, unknown, duplicate, and conflicting replay identity, destination, campaign identity, original entry, and correction entry;
- byte-stable current snapshot/control, session revision, clock, resources, location, projections, and ledger on duplicate replay.

### Original provenance and preservation

- corrupted HP, Stamina, MP, source tick, resolved tick, snapshot clock, captured tick, original ledger tick, identity, posture, Chronicle, notification, and correction evidence;
- one valid pending completion still performs exactly one four-tick relocation, receipt update, Chronicle update, notification update, correction append, and session revision;
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

Do not change shared contracts, save formats, dependencies, account schemas, content, assets, generated output, or unrelated UI behavior. If a shared contract change becomes necessary, stop and report the exact blocker.

## Validation Commands

Run:

```text
node --test tests\unit\campaign-persistence-foundation.test.mjs
```

Run the prescribed group:

```text
node --test tests\simulation\save-load-roundtrip.test.mjs tests\unit\achievements.test.mjs tests\unit\account-profile-storage.test.mjs tests\unit\run-lifecycle.test.mjs tests\unit\player-travel-command.test.mjs tests\unit\player-quest-acceptance-command.test.mjs tests\unit\player-quest-tracking-command.test.mjs tests\unit\player-activity-selection-command.test.mjs tests\unit\combat-hook-support.test.mjs tests\unit\combat-spawn-foundation.test.mjs tests\unit\campaign-persistence-foundation.test.mjs
```

Run the RPG UI production build, bounded UI TypeScript audit, mirror checks, fresh adversarial replay, `git diff --check`, and complete diff inspection. Report the TypeScript diagnostic total and whether any diagnostic names a changed repair file; do not claim the known repository-wide baseline is green.

## Completion Decision

On complete implementation:

- report `IMPLEMENTED_PENDING_PARENT_AUDIT`;
- leave the parent unaccepted;
- update the parent audit and current coordination documents;
- install `Version 0.6.9.8 - Initial Defeat And Durable Recovery Completion Acceptance Audit` as a separate read-only audit unless fresh evidence requires a narrower exact successor;
- keep the Ashen Reef survey receipt decision blocked.

If any finding remains:

- report `IMPLEMENTATION_INCOMPLETE`;
- do not accept or partially waive it;
- install the smallest exact successor repair prompt.

## Scope Exclusions

Do not:

- implement survey behavior, receipts, commands, UI, or migrations;
- add Committed or Ironbound Stakes;
- redesign slots, launcher, recovery UI, defeat, death, succession, injury, care, account, or retirement systems;
- add a generic workflow, transaction, replay, event, command, correction, or effect framework;
- merge, modify, rebase, force-update, or delete protected branches;
- merge or close PR #2;
- merge, cherry-pick, rebase, force-update, or close PR #3 or `parallel/0.6.9.7-repair-bundle` during implementation;
- perform unrelated cleanup.

## Completion Report

Report:

- pre-edit reproduction for all three findings;
- numbered finding-to-code-to-test matrix;
- failure-boundary and receipt/provenance/effect matrices;
- PR #3 evidence identity, hash verification, candidate reconciliation, and retained disposition;
- applicable guardrail IDs and evidence;
- exact commands and counts;
- TypeScript posture;
- inspected-base, starting, final, and live-head identities;
- branch/PR lifecycle and exact retained review triggers;
- files changed, risks, and suggested commit;
- `IMPLEMENTED_PENDING_PARENT_AUDIT` or `IMPLEMENTATION_INCOMPLETE`;
- installed next route.
