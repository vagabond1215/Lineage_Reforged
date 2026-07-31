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

Read:

- `AGENTS.md`;
- `docs/dev/codex-failure-patterns-and-verification-guardrails.md`;
- `docs/design/normal-stakes-campaign-persistence-foundation-acceptance-audit.md`;
- `docs/design/normal-campaign-new-game-retry-and-recovery-collision-audit.md`;
- `docs/dev/current-codex-output.md`;
- `packages/shared/types/src/contracts.ts` around campaign identity, authority ledger, Normal defeat receipts, resources, locations, and save snapshots;
- `packages/engines/game-engine/src/normal-defeat.ts` and its JavaScript mirror;
- `packages/engines/game-engine/src/campaign-session.ts` and its JavaScript mirror;
- save-manager, `App.tsx`, new-campaign coordinator, account-publication, lifecycle, and focused persistence tests;
- current handoff, historical/deferred register, planning reconciliation, branch policy, and branch register;
- the protected integrated-gameplay readiness branch through read-only Git inspection only.

## Applicable Verification Guardrails

Apply and report `FP-001` through `FP-010`. Apply `FP-007` when rewriting the large current output or prompt and verify each complete replacement after writing.

## Execution Gate

1. Verify clean synchronized `master`, upstream, current head, and this exact prompt.
2. Fetch/prune and refresh every branch and open PR disposition.
3. Reproduce all three findings against untouched source before editing.
4. Distinguish inspected base, implementation starting head, final committed head, and live post-fetch head.
5. Stop and install a narrower support prompt if the required repair would change shared types, save format, dependencies, or unrelated owners.

## Finding 1 - Initial Automatic Destination Authority

Initial `resolveNormalDefeat(...)` automatic destination selection must use the same exact settlement-evidence rules as pending recovery completion.

Required behavior:

- explicit context, current location, and campaign-start candidates require exact, unpadded, nonblank ids;
- each accepted candidate must have exactly one matching `known === true`, `type === "settlement"` location record with an exact `settlementId`;
- unknown, known-false, non-settlement, duplicate, or contradictory evidence fails closed;
- corrupt current authority cannot fall through to campaign-start or another known settlement;
- corrupt campaign-start authority cannot fall through;
- valid precedence remains explicit context, valid current settlement, valid campaign-start settlement, then `recovery_pending`;
- initial resolution must not add the sole-known-settlement fallback used only by bounded pending completion;
- no invalid initial destination may produce four recovery ticks, relocation, or a playable receipt.

Refactor only enough internal code to share validation and avoid two subtly different authority rules.

## Finding 2 - Restart-Safe Duplicate Completion

A completed repair must carry enough durable evidence for an exact replay after save/load or process restart.

Required behavior:

- an exact replay identifies the intended receipt through a stable receipt identity or equivalently explicit replay evidence; never select the first or latest completed receipt by array order;
- one exact completed receipt, original ledger entry, deterministic correction entry, campaign/continuity/character identity, destination, and source mutation must agree;
- an exact replay returns `duplicate: true` with the current snapshot and control unchanged;
- replay after a later accepted mutation and replay after explicit save/reload cannot roll state back, change session revision, append ledger entries, advance ticks, relocate, restore resources, or reproject Chronicle/notification;
- missing target identity, zero matches, multiple matches, conflicting destination, conflicting correction, or ambiguous completed history fails closed with stable diagnostics;
- ordinary production entry continues to invoke repair only when recovery is pending.

Do not persist the in-memory retained-mutation-result array or add a generic replay framework. Use the existing durable receipt and authority-ledger evidence.

## Finding 3 - Original Effect Provenance

Before repair effects, validate the pending receipt and original ledger as one internally consistent original defeat result.

At minimum validate:

- campaign, continuity, character, rules, policy, source mutation, source kind, and pending posture;
- `recoveryTicks === 0`, `destinationId === null`, and `destinationSource === "none"`;
- integer, ordered source/resolution ticks and the pending snapshot's unchanged current tick posture;
- `hpRestoredTo`, `staminaRestoredTo`, and `mpPreservedAt` against current resource facts, valid maxima, and the deterministic HP floor/formula where derivable;
- exactly one original `normal_defeat` ledger entry with the same source mutation and `acceptedAtTick` equal to the original resolved tick;
- exactly one matching receipt, Chronicle entry, and notification, and no retained correction/supersession entry.

Corrupt any one resource fact, tick fact, ledger tick, identity, posture, receipt count, Chronicle count, notification count, or correction fact and prove rejection occurs before cloning or effects.

## Required Tests

Extend the focused persistence suite with executable coverage for:

- initial valid explicit/current/campaign-start destinations;
- initial blank, padded, unknown, known-false, ruin, wilderness, duplicate, contradictory, corrupt-current-with-safe-fallback, and corrupt-start cases;
- proof invalid initial authority creates no time, relocation, receipt, projection, ledger, session, or source-snapshot effect;
- exact duplicate completion after later mutation;
- exact duplicate completion after explicit save/reload using stable receipt identity;
- reversed completed-receipt and ledger ordering;
- multiple historical repaired defeats without first/latest selection;
- missing, unknown, and conflicting replay identity/destination/provenance;
- corrupted HP, Stamina, MP, source tick, resolved tick, original ledger tick, identity, posture, Chronicle, notification, and correction evidence;
- one valid pending completion still performs exactly one four-tick relocation, receipt update, Chronicle update, notification update, correction append, and session revision;
- pending ordinary mutation, publication, manual save, quick-save, and retirement blocking;
- production `App.tsx` caller and explicit-save-after-repair roundtrip;
- all existing new-campaign retry, restart, slot-collision, account-consumer, migration, control, and terminal behavior.

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
- perform unrelated cleanup.

## Completion Report

Report:

- pre-edit reproduction for all three findings;
- numbered finding-to-code-to-test matrix;
- failure-boundary and receipt/provenance/effect matrices;
- applicable guardrail IDs and evidence;
- exact commands and counts;
- TypeScript posture;
- inspected-base, starting, final, and live-head identities;
- branch/PR lifecycle and exact retained review triggers;
- files changed, risks, and suggested commit;
- `IMPLEMENTED_PENDING_PARENT_AUDIT` or `IMPLEMENTATION_INCOMPLETE`;
- installed next route.
