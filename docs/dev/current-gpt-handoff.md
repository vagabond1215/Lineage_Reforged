# Current GPT Handoff

Date: 2026-07-31

## Status

- Latest implemented primary: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`.
- Latest completed support implementation: `Version 0.6.9.3 - New-Campaign Retry, Slot-Recovery Collision, And Pending-Defeat Repair Completion`.
- Latest completed support audit: `Version 0.6.9.4 - Normal Campaign Retry And Recovery Completion Acceptance Audit`.
- Latest completed repair implementation: `Version 0.6.9.5 - Pending-Defeat Completion Authority And Provenance Repair`.
- Latest completed acceptance audit: `Version 0.6.9.6 - Pending-Defeat Completion Authority And Provenance Acceptance Audit`, committed at `0c69ef295874eb6227d2062e3a6b2d9db97a9d61`.
- Latest completed unversioned decision: `Normal Stakes Activation, First-Mutation Continuity, And Account-Value Publication Dependency Closure Decision`.
- Latest completed connector repository review: `Repository-Wide Review — 2026-07-31`, recorded in `docs/dev/repository-wide-review-2026-07-31.md`.
- Latest connector source review: `Version 0.6.9.7 Pre-Implementation Source Review`, recorded in `docs/dev/version-0.6.9.7-pre-implementation-source-review-2026-07-31.md` with status `REPAIR_SCOPE_HARDENED_BEFORE_IMPLEMENTATION`.
- Repository-first execution authority: `docs/dev/repository-first-agent-work-protocol.md`.
- Parent `0.6.8` remains accepted without repair.
- `0.7.0` readiness result: `NOT_READY`.
- Survey owner-contract result: `ACCEPTED`.
- Minimum save-contract result: `ACCEPTED`.
- Dependency-closure result: `PACKAGE_READY`.
- Parent `0.6.9` status: `REPAIR_REQUIRED_AFTER_0.6.9.6`.
- Active route: `Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair`.
- Active-route class: parent-specific support suffix.
- Mandatory green successor: `Version 0.6.9.8 - Initial Defeat And Durable Recovery Completion Acceptance Audit`.
- Draft PR #3 and `parallel/0.6.9.7-repair-bundle` remain evidence-only `HOLD_NAMED_CONSUMER` inputs, not implementation authority.
- The Ashen Reef survey occurrence/result/consequence receipt decision remains blocked until the repair is independently accepted.
- The durable failure-pattern register now includes `FP-001` through `FP-012`, all required by the active prompt.

## Current Planning Precedence

Use current execution sources in this order:

1. `docs/dev/current-codex-prompt.md`;
2. this handoff;
3. `docs/dev/current-codex-output.md`;
4. `docs/dev/historical-version-and-deferred-route-register.md`;
5. the most specific focused decision or audit;
6. `docs/design/current-planning-anchor-reconciliation.md` for stale historical-header conflicts;
7. roadmap and sequenced plan for non-conflicting historical and long-term context.

Repository workflow and review constraints also apply:

- `AGENTS.md`;
- `docs/dev/repository-first-agent-work-protocol.md`;
- `docs/dev/repository-wide-review-2026-07-31.md`;
- `docs/dev/version-0.6.9.7-pre-implementation-source-review-2026-07-31.md`;
- `docs/dev/codex-failure-patterns-and-verification-guardrails.md`;
- `docs/dev/gpt-connector-assistance-policy.md`;
- `docs/dev/branch-lifecycle-and-integration-policy.md`;
- `docs/dev/branch-disposition-register.md`.

## Current Normal Persistence Posture

`0.6.9.2` repaired post-head address recovery, immutable artifact verification, durable account-consumer plans, terminal cleanup ordering, separately loaded migrated HP-zero head/non-head repair, campaign-control rejection, pending ordinary-mutation/publication blocking, and retained mutation-result conflicts.

Reported validation was 20/20 focused persistence tests, 127/127 prescribed tests, and a passing 207-module RPG UI build.

`0.6.9.3` closed the real new-campaign retry, same-slot recovery collision, and pending-defeat completion caller boundaries. Independent `0.6.9.4` then found multiple-pending selection, non-settlement completion authority, and missing correction-ledger defects.

`0.6.9.5` reported those repaired with 26/26 focused tests, 133/133 prescribed tests, a passing 209-module build, and explicit-save-after-repair evidence. Independent `0.6.9.6` preserved that baseline but proved three further blockers:

1. initial automatic current/start destinations bypass exact settlement validation;
2. completed repair cannot return retained duplicate state after restart;
3. original receipt resource/tick and original-ledger acceptance-tick facts are not validated.

The current `0.6.9.7` prompt retains those primary findings and now also requires the adjacent live-source boundaries below.

## Hardened Pre-Implementation Finding Inventory

The active repository implementation must reproduce and reconcile all nine findings against untouched synchronized source.

### Primary `0.6.9.6` findings

1. initial automatic destination validation bypass;
2. durable completed-repair duplicate unavailable after restart;
3. original pending effect provenance incomplete.

### Additional live-source findings

4. **Explicit precedence contamination:** pending destination resolution validates lower-priority current authority before a supplied explicit destination, so valid explicit repair authority can be vetoed by irrelevant corrupt current/start evidence.
5. **Initial duplicate integrity:** initial defeat duplicate handling uses first-match receipt selection and does not prove one complete receipt/ledger/projection evidence set.
6. **Initial resource admission:** the HP-zero gate accepts negative, fractional, nonfinite, or otherwise invalid resource facts because it rejects only `hp.current > 0` and does not validate maxima/bounds.
7. **Control identity:** campaign-session admission checks artifact/revision but does not fully reconcile control account, campaign, continuity, and snapshot/receipt authority.
8. **Non-head ordering:** pending completion from `non_head_unmutated` control can rewrite continuity before validating the retained receipt, creating a provenance conflict or partial-order hazard.
9. **Completion source provenance:** lower-level repair always records `destinationSource: "explicit_context"`, including production automatic current/start/fallback completion.

The exact evidence, reproduction matrix, derivable tick/resource invariants, and stop gates are recorded in the pre-implementation source review.

## Provenance Clarifications

For one valid retained `recovery_pending` result, the strongest derivable tick invariant is:

`sourceTick === resolvedTick === snapshot.clock.tick === snapshot.capturedAtTick`

The result advances zero ticks and ordinary mutation/time advancement is blocked.

Pre-defeat Stamina above the accepted floor is not retained. Validation must prove only the strongest available facts:

- receipt value equals current pending Stamina;
- values and maxima are finite integers within bounds;
- if max is below 12, restored/current Stamina equals max;
- otherwise restored/current Stamina is between 12 and max.

Do not invent an unavailable exact pre-defeat Stamina value.

Pending provenance must also prove current target Normal rules, `destinationSource: "none"`, exact resource maxima/current bounds, unique receipt/ledger/Chronicle/notification evidence, and absence of same-source duplicates or retained correction.

## Active Evidence Posture

Draft PR #3 remains the required evidence surface:

- PR title: `Evidence only: associate 0.6.9.7 repair bundle with active Codex route`;
- branch: `parallel/0.6.9.7-repair-bundle`;
- installed head: `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`;
- source base: `b6422118567a79a23be3377f035dd3a6905d4d8b`;
- bundle path: `docs/dev/repair-bundles/version-0.6.9.7/`;
- reconstructed ZIP SHA-256: `c5d536b10580877191fc9dc730b5f4f5e5571dc18d15bc7b7200871bf912b3fe`.

The branch is intentionally allowed to diverge from `master`. Do not merge, cherry-pick, rebase, force-update, or close it during implementation.

The bundle was prepared before the hardened source review. Treat it as incomplete for Findings 4 through 9 unless direct inspection proves otherwise. The active repository agent must:

- fetch/prune and resolve live PR identity;
- read the bundle README;
- reconstruct and hash-verify the ZIP;
- reproduce all nine findings against untouched current source;
- reconcile every candidate replacement and probe against live contracts, callers, tests, and the pre-pass review;
- extend repository tests and fresh adversarial probes beyond the bundle matrix.

Keep PR #3 under `HOLD_NAMED_CONSUMER` until `0.6.9.7` and its independent successor audit complete.

## Failure-Pattern Guardrail Posture

The active implementation must report `FP-001` through `FP-012`.

The newly added guardrails are:

- `FP-011`: authority precedence and retained provenance must control mutation ordering;
- `FP-012`: duplicate results require one unique complete durable evidence set rather than first/latest array selection.

The highest-risk requirements remain real-caller testing, failure-boundary matrices, restart/caller-loss behavior, stale and competing authority, validated completion from blocked state, semantic branch review, exact head terminology, complete finding reconciliation, provenance-before-continuity rewrite, and exact durable duplicate evidence.

Green totals alone cannot accept the parent.

## Non-Head Completion Contract Gate

The real implementation must reproduce a persisted pending artifact loaded as `non_head_unmutated` through the `App.tsx` run-entry caller.

It must validate retained source-continuity evidence before identity rewrite, then reconcile the accepted first-mutation continuity rule and pending repair as one safe sequence. Rejection must create neither a child continuity nor partial repair effects.

If accepted decisions do not determine whether the completed receipt retains source continuity or is rewritten to the child continuity, stop and install the smallest focused contract decision. Do not weaken provenance checks, skip the required fork, or guess.

## Destination-Source Contract Gate

Completion must record truthful provenance:

- explicit authority -> `explicit_context`;
- automatic current -> `current_settlement`;
- automatic campaign start -> `campaign_start`.

The current enum has no dedicated sole-known-fallback value. Do not silently label automatic fallback as explicit. If repair-owner context cannot truthfully justify an existing value under accepted authority, stop for a focused shared-contract decision rather than changing the enum inside this repair.

## Accepted Survey Boundary

The deterministic Ashen Reef survey remains the selected first activity-advancement consumer. One admitted shift is one occurrence. Preview/execution parity, explicit resource/load effects, contiguous progress, typed affected-owner proposals and receipts, atomic application, synchronized accepted state, and accepted-only UI application remain required.

The current survey implementation still has four material defects:

- preview/execution diverge after completion;
- preview omits explicit Stamina/MP and attribute-load effects;
- malformed non-contiguous sector flags can repeat side effects without progress;
- UI applies returned snapshots without an accepted/rejected discriminator.

Do not run the survey receipt decision while `0.6.9.7` and `0.6.9.8` remain open.

## Combat AI And Gambit Posture

`docs/design/combat-ai-and-gambit-current-state-audit.md` remains controlling.

The repository has live weighted tactics AI: AI/manual modes, tactical roles and presets, action-family biases, resource thresholds, target ranking and directives, deterministic scoring/queueing, and temporary manual overrides.

Literal ordered `condition -> action` gambits remain deferred. No ordered-rule schema, runtime interpreter, editor, or complete allied NPC party owner is accepted. Do not call the existing weighted AI absent or describe it as a completed Final Fantasy XII-style gambit system.

## Branch Lifecycle Posture

The latest registered inventory contains:

- eighteen non-default remote branches;
- two open pull requests;
- PR #2 / `main-menu-asset-contract-pass` retained as `SUPERSEDED_PRESERVE_EVIDENCE`;
- PR #3 / `parallel/0.6.9.7-repair-bundle` retained as `HOLD_NAMED_CONSUMER`;
- twelve one-document audit branches retained as `CANDIDATE_INTEGRATION` at named triggers;
- two protected references retained read-only;
- no integration, deletion, rebase, force update, or PR closure due inside this active repair.

The register records a snapshot, not live action authority. The active repository agent must fetch/prune and resolve the current live head and all branch/PR divergence again after these coordination commits.

Known protected branches:

- `prep/integrated-gameplay-0-7-readiness-audit`;
- `parallel/prompt-packaging-integrity-audit`.

PR #2 must not be merged as-is. PR #3 must remain evidence only. No candidate documentation branch implements or supersedes the active repair.

## Active Repair Guardrails

Run `Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair`.

- Work from a synchronized authenticated repository checkout and complete whole-repository orientation.
- Inspect and hash-verify PR #3 but treat all candidates as incomplete non-authoritative evidence.
- Reproduce all nine findings before editing.
- Follow authority precedence as a strict short-circuit; valid explicit authority must not inspect corrupt lower-priority evidence.
- Validate retained source provenance before cloning, continuity rewrite, recovery effects, or correction append.
- Require exact finite integer resource admission and valid bounds.
- Require unique complete evidence for initial and completed duplicate results.
- Make restart duplicate handling exact and current-state preserving.
- Reconcile campaign control identity with snapshot/receipt authority.
- Exercise head and non-head persisted pending completion through the real caller.
- Record truthful completion destination source or stop for a focused contract decision.
- Preserve accepted multiple-pending, correction-ledger, publication, launcher, migration, new-campaign, slot-collision, account-consumer, immutable-address, control, and terminal behavior.
- Report `FP-001` through `FP-012`.
- Do not accept the parent during implementation or install `0.6.9.8` before success.
- Do not implement survey behavior.

## Preserved Boundaries

- Do not implement survey commands, receipt storage, or UI adapters.
- Do not broaden into Committed/Ironbound Stakes, checkpoint/death policy, cloud synchronization, broad recovery UI, slot redesign, or broad account work.
- Do not build a generic resolver, validation framework, transaction framework, command bus, event framework, or replay service.
- Do not change shared receipt types or save formats inside this repair; stop for a focused decision when necessary.
- Existing travel, quest acceptance/tracking, activity selection, and unrelated save behavior remain protected.
- Static lethal-process definitions remain separate from mutable health.
- Protected branches remain read-only.
- PR #3 remains unmerged, unre-based, and unmodified except for read-only verification.
- Weighted combat tactics AI remains separate from future ordered gambits.
- Workspace typecheck retains its known nonzero baseline until fresh execution reports the current total.

## Near-Term Sequence

1. implement the hardened `Version 0.6.9.7` finding inventory;
2. if implementation is complete, install and run `Version 0.6.9.8 - Initial Defeat And Durable Recovery Completion Acceptance Audit`;
3. only after that audit accepts the parent, run the unversioned survey occurrence/result/consequence receipt-foundation decision;
4. implement only a dependency-closed receipt package selected by that decision;
5. implement the bounded survey command and accepted-only UI after receipt prerequisites close;
6. review candidate documentation branches at their named triggers;
7. reassess `0.7.0` only after the representative loop and all entry criteria are independently accepted.

## Active Prompt

`Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair`
