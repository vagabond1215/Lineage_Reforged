# Current GPT Handoff

Date: 2026-07-31

## Status

- Latest implemented primary: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`.
- Latest completed support implementation: `Version 0.6.9.3 - New-Campaign Retry, Slot-Recovery Collision, And Pending-Defeat Repair Completion`.
- Latest completed support audit: `Version 0.6.9.4 - Normal Campaign Retry And Recovery Completion Acceptance Audit`.
- Latest completed repair implementation: `Version 0.6.9.5 - Pending-Defeat Completion Authority And Provenance Repair`.
- Latest completed acceptance audit: `Version 0.6.9.6 - Pending-Defeat Completion Authority And Provenance Acceptance Audit`, committed at `0c69ef295874eb6227d2062e3a6b2d9db97a9d61`.
- Latest completed unversioned run: `Normal Stakes Activation, First-Mutation Continuity, And Account-Value Publication Dependency Closure Decision`.
- Latest completed connector coordination review: `Repository-Wide Review — 2026-07-31`, recorded in `docs/dev/repository-wide-review-2026-07-31.md`.
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
- Draft PR #3 and `parallel/0.6.9.7-repair-bundle` are evidence-only `HOLD_NAMED_CONSUMER` inputs for the active route, not implementation authority.
- The unversioned Ashen Reef survey occurrence/result/consequence receipt decision remains blocked until the repair is independently accepted.
- The durable failure-pattern register is active and the current prompt requires `FP-001` through `FP-010`.

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
- `docs/dev/repository-first-agent-work-protocol.md`;
- `docs/dev/repository-wide-review-2026-07-31.md`;
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

`0.6.9.3` closed the three real application boundaries, but independent `0.6.9.4` found three exact completion-authority defects.

### New-campaign retry identity

The real character-creation handler now uses a durable account-and-slot attempt coordinator that retains normalized input, the prepared snapshot, identities, consumer plans, and attempt correlation across retry and restart.

### Same-slot recovery collision

Startup recovery now inspects at account-and-slot scope, preserves a different verified address, admits only proven same-campaign forward supersession, and deterministically rejects multiple contenders.

### Pending-defeat completion

The launcher now calls a campaign-admitted exactly-once repair owner. Recovery destinations must be authoritative current, campaign-start, or known settlement facts; invalid locations remain blocked.

`0.6.9.4` proved the implementation did not satisfy that claim at all boundaries:

- multiple pending receipts selected the first receipt and partially repaired;
- a current-location id backed by a `ruin` was accepted;
- repair completion appended no correction/supersession ledger entry.

`0.6.9.5` reports those boundaries repaired with 26/26 focused tests, 133/133 prescribed tests, a passing 209-module build, and explicit-save-after-repair evidence. Independent `0.6.9.6` preserved that baseline and the three exact repairs but proved three further gaps:

- initial automatic current/start destinations bypass exact settlement validation;
- completed repair cannot return retained duplicate state after restart;
- original receipt resource/tick plus ledger-tick facts are not validated.

The `0.6.9.7` prompt was connector-hardened after the audit so invalid automatic current/start authority cannot be “repaired” by deleting defeat truth. Such cases must create one retained `recovery_pending` defeat result with restored HP/Stamina, receipt, original ledger entry, Chronicle, and notification, but no relocation or recovery-time advancement. A malformed or invalid explicitly supplied destination must reject before partial effects and may not fall through.

The controlling audit is:

`docs/design/normal-campaign-new-game-retry-and-recovery-collision-audit.md`

## Active Evidence Posture

Draft PR #3 is the required evidence surface for the active repair:

- PR title: `Evidence only: associate 0.6.9.7 repair bundle with active Codex route`;
- branch: `parallel/0.6.9.7-repair-bundle`;
- installed head: `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`;
- source base: `b6422118567a79a23be3377f035dd3a6905d4d8b`;
- bundle path: `docs/dev/repair-bundles/version-0.6.9.7/`;
- reconstructed ZIP SHA-256: `c5d536b10580877191fc9dc730b5f4f5e5571dc18d15bc7b7200871bf912b3fe`.

The active repository agent must fetch/prune, resolve the live PR identity, read the branch README, reconstruct and hash-verify the bundle, reproduce all three findings against untouched current source, and reconcile the candidate replacements and probes against live `master`.

The branch is intentionally allowed to diverge from `master`. Do not merge, cherry-pick, rebase, force-update, or close it during implementation. Keep it under `HOLD_NAMED_CONSUMER` until `0.6.9.7` and its independent successor audit complete.

## Failure-Pattern Guardrail Posture

The active implementation must report evidence for `FP-001` through `FP-010`.

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

Do not run the survey receipt decision while `0.6.9.7` and `0.6.9.8` remain open.

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

The latest connector review at inspected `master` head `55c5610de72d2837f151a044442d23f47977b0bb` found:

- eighteen non-default remote branches;
- two open pull requests;
- PR #2 / `main-menu-asset-contract-pass` retained as `SUPERSEDED_PRESERVE_EVIDENCE`;
- PR #3 / `parallel/0.6.9.7-repair-bundle` retained as `HOLD_NAMED_CONSUMER` evidence for the active repair;
- twelve one-document audit branches retained as `CANDIDATE_INTEGRATION` at their named triggers;
- two protected references retained read-only;
- no integration, deletion, rebase, force update, or PR closure due inside the active repair.

The active Codex run must:

- fetch and prune;
- inventory relevant local and remote branches and open PRs;
- inspect merge bases, unique commits, changed paths, semantic overlap, and current authority;
- refresh `docs/dev/branch-disposition-register.md` from live refs;
- state whether any integration, PR closure, or branch deletion is due inside the active run;
- perform no integration or deletion without policy-required review and validation;
- preserve protected branches read-only;
- preserve PR #3 and its evidence branch without making them merge-ready;
- leave exact next review triggers for retained branches.

Known protected branches:

- `prep/integrated-gameplay-0-7-readiness-audit`;
- `parallel/prompt-packaging-integrity-audit`.

Twelve one-document audit branches are registered as `CANDIDATE_INTEGRATION`. Review them at named triggers or in a dedicated documentation integration pass, then delete only after accepted content is reachable or equivalently preserved on `master`.

PR #2 / `main-menu-asset-contract-pass` remains `SUPERSEDED_PRESERVE_EVIDENCE` and must not be merged as-is. PR #1 is historically merged and should be verified for branch retirement.

No candidate integration branch implements or supersedes the active three-finding repair. PR #3 contains candidate evidence only and must be independently reconciled.

## Active Repair Guardrails

Run `Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair`.

- Work from a synchronized authenticated repository checkout and complete the repository-wide orientation required by the repository-first protocol.
- Inspect PR #3, verify its exact branch identity and reconstructed ZIP hash, and treat every included candidate as non-authoritative evidence.
- Route initial explicit, current, and campaign-start candidates through one exact known-safe-settlement validator.
- Reject an invalid explicitly supplied destination before partial effects and never fall through from that claimed authority.
- Resolve invalid or absent automatic current/start authority once into `recovery_pending`: retain the defeat receipt, original ledger entry, HP/Stamina restoration, Chronicle, and notification, while applying no relocation and no recovery ticks.
- Make completed-repair duplicate handling restart-safe and deterministic through exact receipt identity, without selecting completed history by array order.
- Validate pending receipt HP, Stamina, MP, source/resolution tick, snapshot/captured tick, and original ledger acceptance-tick facts before repair effects.
- Preserve the accepted multiple-pending, completion-destination, original/correction ledger, exactly-once, publication, and launcher boundaries.
- Preserve all new-campaign, slot-collision, consumer-idempotency, migration, immutable-address, and control-guard behavior.
- Report `FP-001` through `FP-010`.
- Do not accept the parent during implementation; install `0.6.9.8` as a separate independent audit.
- Do not implement survey behavior or the survey receipt decision.

## Preserved Boundaries

- Do not implement the survey command, survey receipt storage, or survey UI adapter.
- Do not broaden into Committed/Ironbound Stakes, checkpoint/death policy, cloud synchronization, broad recovery UI redesign, slot redesign, or broad account work.
- Do not build a generic activity resolver, transaction framework, or command replay service.
- Existing travel, quest acceptance/tracking, activity selection, and unrelated save behavior remain protected except for exact parent-specific admission and recovery fixes.
- Static lethal-process definitions remain separate from mutable health.
- Protected branches remain unmerged and untouched except for required read-only inspection.
- PR #3 and its evidence branch remain unmerged, unre-based, and unmodified except for read-only verification.
- Weighted combat tactics AI remains separate from any future ordered-gambit authority.
- Workspace typecheck remains a separate known-failing 137-diagnostic audit.

## Near-Term Sequence

1. run `Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair`;
2. run `Version 0.6.9.8 - Initial Defeat And Durable Recovery Completion Acceptance Audit`;
3. only after that audit accepts the parent, run the unversioned survey occurrence/result/consequence receipt foundation decision;
4. implement only a dependency-closed receipt package selected by that decision;
5. implement the bounded survey command and accepted-only UI after receipt prerequisites close;
6. review and integrate candidate documentation branches at named triggers or through a dedicated branch-integration pass;
7. reassess `0.7.0` only after the representative loop and every entry criterion are independently accepted.

## Active Prompt

`Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair`
