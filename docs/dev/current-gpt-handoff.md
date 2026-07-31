# Current GPT Handoff

Date: 2026-07-30

## Status

- Latest implemented primary: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`.
- Latest completed support implementation: `Version 0.6.9.3 - New-Campaign Retry, Slot-Recovery Collision, And Pending-Defeat Repair Completion`.
- Latest completed unversioned run: `Normal Stakes Activation, First-Mutation Continuity, And Account-Value Publication Dependency Closure Decision`.
- Parent `0.6.8` remains accepted without repair.
- `0.7.0` readiness result: `NOT_READY`.
- Survey owner-contract result: `ACCEPTED`.
- Minimum save-contract result: `ACCEPTED`.
- Dependency-closure result: `PACKAGE_READY`.
- Parent `0.6.9` status: `IMPLEMENTED_PENDING_0.6.9.4_AUDIT`.
- Active route: `Version 0.6.9.4 - Normal Campaign Retry And Recovery Completion Acceptance Audit`.
- Active-route class: parent-specific support suffix.
- Mandatory green successor: the unversioned Ashen Reef survey occurrence/result/consequence receipt foundation decision, only if `0.6.9.4` accepts the parent.
- The Ashen Reef survey occurrence/result/consequence receipt decision is blocked until the independent `0.6.9.4` audit accepts the parent.
- The durable failure-pattern register is active and the current prompt identifies the exact applicable pattern IDs.

## Current Planning Precedence

Use current execution sources in this order:

1. `docs/dev/current-codex-prompt.md`;
2. this handoff;
3. `docs/dev/current-codex-output.md`;
4. `docs/dev/historical-version-and-deferred-route-register.md`;
5. the most specific focused decision or audit;
6. `docs/design/current-planning-anchor-reconciliation.md` for stale historical-header conflicts;
7. roadmap and sequenced plan for non-conflicting historical and long-term context.

Repository workflow constraints also apply:

- `AGENTS.md`;
- `docs/dev/codex-failure-patterns-and-verification-guardrails.md`;
- `docs/dev/gpt-connector-assistance-policy.md`;
- `docs/dev/branch-lifecycle-and-integration-policy.md`;
- `docs/dev/branch-disposition-register.md`.

## Current Normal Persistence Posture

`0.6.9.2` successfully repaired:

- post-head address recovery for the same prepared snapshot;
- immutable artifact verification for playable addresses;
- durable account-consumer plans outside account storage;
- terminal consumer cleanup ordering;
- separately loaded migrated HP-zero head and non-head repair;
- missing, malformed, closed, stale, changed, and wrong-artifact campaign-control rejection;
- ordinary mutation and publication blocking under `recovery_pending`;
- retained duplicate mutation results and conflicting-id rejection.

Reported validation was 20/20 focused persistence tests, 127/127 prescribed tests, and a passing 207-module RPG UI build.

`0.6.9.3` reports implementation closure for the three real application boundaries, but parent acceptance remains deferred to independent `0.6.9.4`.

### New-campaign retry identity

The real character-creation handler now uses a durable account-and-slot attempt coordinator that retains normalized input, the prepared snapshot, identities, consumer plans, and attempt correlation across retry and restart.

### Same-slot recovery collision

Startup recovery now inspects at account-and-slot scope, preserves a different verified address, admits only proven same-campaign forward supersession, and deterministically rejects multiple contenders.

### Pending-defeat completion

The launcher now calls a campaign-admitted exactly-once repair owner. Recovery destinations must be authoritative current, campaign-start, or known settlement facts; invalid locations remain blocked.

The controlling audit is:

`docs/design/normal-campaign-new-game-retry-and-recovery-collision-audit.md`

## Failure-Pattern Guardrail Posture

The active implementation must report evidence for:

- `FP-001` through `FP-006`;
- `FP-008` through `FP-010`;
- `FP-007` only if a large documentation file is rewritten.

The highest-risk requirements are real-caller testing, failure-boundary and finding-to-test matrices, caller-state loss and restart, account-and-slot collision scope, stale-projection protection, reachable validated blocked-state completion, semantic branch review, exact head terminology, and full finding reconciliation.

Green test totals alone cannot accept the parent.

## Accepted Survey Boundary

The deterministic Ashen Reef survey remains the selected first activity-advancement consumer. One admitted shift is one occurrence. One pure plan must drive preview and execution; typed affected-owner proposals and receipts, distinct command/occurrence/result/event/projection identities, atomic application, synchronized accepted state, and accepted-only UI application are required.

The current survey implementation still has four material defects:

- preview/execution diverge after completion;
- preview omits explicit stamina/MP and attribute-load effects;
- malformed non-contiguous sector flags can repeat side effects without progress;
- the UI applies the returned snapshot without an accepted/rejected discriminator.

General activity resolution, uncertainty, result bands, and balance changes are not required for the deterministic parity slice.

Do not run the survey receipt decision while the parent persistence repair and independent acceptance audit remain open.

## Combat AI And Gambit Posture

`docs/design/combat-ai-and-gambit-current-state-audit.md` records the current state.

The repository already has live weighted tactics AI:

- AI/manual control modes;
- tactical roles and static presets;
- action-family biases;
- healing, interrupt, conservation, buff, debuff, melee, ranged, and magic preferences;
- spell preferences and resource thresholds;
- target rules and weighted target ranking;
- focus, ignore, priority, and deprioritized directives;
- deterministic action scoring and AI queueing every active combat tick;
- temporary manual overrides.

Literal ordered `condition -> action` gambits remain deferred. No ordered-rule schema, validation, conflict-resolution contract, runtime interpreter, editor, or complete NPC-party combat owner is accepted. Ordinary encounter creation currently builds the player plus enemies, not a durable full allied NPC roster.

Do not treat the existing weighted AI as absent, and do not describe it as a completed Final Fantasy XII-style gambit system.

## Branch Lifecycle Posture

Branch handling is a required completion concern.

The active Codex run must:

- fetch and prune;
- inventory relevant local and remote branches and open PRs;
- inspect merge bases, unique commits, changed paths, semantic overlap, and current authority;
- refresh `docs/dev/branch-disposition-register.md`;
- state whether any integration, PR closure, or branch deletion is due inside the active run;
- perform no integration or deletion without policy-required review and validation;
- preserve protected branches read-only;
- leave exact next review triggers for retained branches.

Known protected branches:

- `prep/integrated-gameplay-0-7-readiness-audit`;
- `parallel/prompt-packaging-integrity-audit`.

Twelve one-document audit branches are registered as `CANDIDATE_INTEGRATION`. Review them at named triggers or in a dedicated documentation integration pass, then delete only after accepted content is reachable or equivalently preserved on `master`.

PR #2 / `main-menu-asset-contract-pass` remains `SUPERSEDED_PRESERVE_EVIDENCE` and must not be merged as-is. PR #1 is historically merged and should be verified for branch retirement.

No registered branch contributed to or overlaps the completed `0.6.9.3` repair.

## Active Acceptance-Audit Guardrails

Run `Version 0.6.9.4 - Normal Campaign Retry And Recovery Completion Acceptance Audit`.

- Independently reproduce the actual application caller, pre-head and post-head failures, caller-state loss, restart, and changed-input rejection.
- Independently reproduce compatible, incompatible, newer-address, and reordered multiple-contender slot recovery.
- Prove preparation, inheritance, active history, achievements, and account value remain exactly once.
- Exercise the launcher-reachable pending-defeat completion owner with valid, malformed, unknown, unsafe, conflicting, and duplicate inputs.
- Produce fresh finding-to-test and failure-boundary matrices.
- Preserve every accepted `0.6.9.2` repair and report `FP-001` through `FP-006`, `FP-008` through `FP-010`.
- Accept the parent only from fresh complete evidence; otherwise install the smallest exact `0.6.9.5` repair.
- Do not implement survey behavior or the survey receipt decision.

## Preserved Boundaries

- Do not implement the survey command, survey receipt storage, or survey UI adapter.
- Do not broaden into Committed/Ironbound Stakes, checkpoint/death policy, cloud synchronization, broad recovery UI redesign, slot redesign, or broad account work.
- Do not build a generic activity resolver, transaction framework, or command replay service.
- Existing travel, quest acceptance/tracking, activity selection, and unrelated save behavior remain protected except for exact parent-specific admission and recovery fixes.
- Static lethal-process definitions remain separate from mutable health.
- Protected branches remain unmerged and untouched except for required read-only inspection.
- Weighted combat tactics AI remains separate from any future ordered-gambit authority.
- Workspace typecheck remains a separate known-failing 137-diagnostic audit.

## Near-Term Sequence

1. run `Version 0.6.9.4 - Normal Campaign Retry And Recovery Completion Acceptance Audit`;
2. only after that independent audit accepts the parent, run the unversioned survey occurrence/result/consequence receipt foundation decision;
3. implement only a dependency-closed receipt package selected by that decision;
4. implement the bounded survey command and accepted-only UI after receipt prerequisites close;
5. review and integrate candidate documentation branches at named triggers or through a dedicated branch-integration pass;
6. reassess `0.7.0` only after the representative loop and every entry criterion are independently accepted.

## Active Prompt

`Version 0.6.9.4 - Normal Campaign Retry And Recovery Completion Acceptance Audit`
