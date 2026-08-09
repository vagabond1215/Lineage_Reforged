# Current Codex Output

## Run Identity

Source run: `Version 0.6.10 - Ashen Reef Survey Advancement Authority`

Date: 2026-08-09

Inspected base and implementation starting head: `85ad4ea9371b81f2e72d54449b6ce31c908118db`

Implementation commit: `008db9c93eb8818aea51652be07fd196df41c45f`

Coordination commit: the commit containing this output and the installed `0.6.10.1` prompt; its exact pushed SHA is resolved after commit and reported in the completion handoff.

Branch/status assumption: direct `master` implementation from a clean synchronized checkout; implementation commit clean; coordination changes only after that commit

Label class: primary

Parent version: none

Milestone impact: `advances_current_band`

Implementation result: `IMPLEMENTED_PENDING_PARENT_AUDIT`

Next route: `Version 0.6.10.1 - Ashen Reef Survey Advancement Acceptance Audit`

## Outcome

The bounded four-stage Ashen Reef survey is now engine-owned, persisted, continuity-correct, replay-safe, projection-repairable, and applied by the real UI caller only after acceptance. The permanent receipt decision's package is implemented; parent acceptance is deliberately reserved for the independent `0.6.10.1` audit.

Target snapshot remains `lineage.save_snapshot.v2`, save envelope remains `7`, and campaign ledger remains `1`. Survey turn-in/rewards, generic activity infrastructure, geographic Knowledge/map authority, other Stakes modes, content, dependencies, and unrelated runtime work remain excluded.

`0.7.0` remains `NOT_READY`. Successful `0.6.10.1` may establish representative-loop evidence, but a separate docs-first band-entry gate is still required.

## Implementation Finding Matrix

| # | Accepted finding | Implemented source | Acceptance evidence |
| --- | --- | --- | --- |
| 1 | Persisted survey authority and strict deep validation | `contracts.ts`; `campaign-rules.ts` | command corruption matrix; raw serialization; version-7 publication/readback; absent/empty compatibility |
| 2 | Stable request/occurrence/result/receipt/projection identities and durable exact retry | `player-survey-activity-advancement.ts`; shared event registry | same-process, later-state, caller-loss, restart, conflicting-intent, missing/duplicate/orphan/reordered evidence tests |
| 3 | Continuity must be selected before receipts and committed atomically | `campaign-session.ts` narrow prepare/commit seam | head/non-head reuse; exact fork provenance; changed control/source/retained-result/candidate rejection; no-mutation identity checks |
| 4 | One pure plan must own all four preview/execution stages and rejection posture | survey owner module; `gameplayLoop.ts` delegation | four-stage characterization; plan/execution parity; completion/no-fallthrough; complete rejection matrix |
| 5 | Every affected gameplay owner needs exact effect facts before acceptance | survey owner module; player time/body/stat/resource/skill/sync owners | exact two one-tick full-profile sequence, resource ordering/clamps, skill gates, quest/operation/discovery/Codex/activity receipts, semantic receipt-tamper tests |
| 6 | Projection failure is accepted truth with bounded, safe repair; correction remains append-only/pending | survey owner module; persisted repair/correction contracts | pending projection, same-source replace/insert, event-only pending repair, expiry, deterministic ordinals, duplicate terminal repair, complete correction reconciliation tests |
| 7 | Coherent pre-receipt progress gets one baseline; history is never invented | rules and survey owner | baseline-required, baseline-only, provenance mismatch, coherent/incoherent legacy-state tests |
| 8 | The real caller must retain delivery identity and apply accepted state only | `GameSessionContext.tsx`; `ActivityPanel.tsx`; legacy adapter removal | stable ref/command cache, technical-retry rule, accepted-only source guards, disabled unavailable action, production repair button |
| 9 | Mirrors, exports, serialization, migration, and nested ledger preservation must remain exact | TS/JS forwarding peers; engine index; `saveManager.ts`; `normal-defeat.ts` | mirror/export guards, v6 initialization, save/load/publication roundtrip, same-command and later defeat preservation |
| 10 | Final survey effects must stay distinct and preserve explicit non-effects | survey owner and synchronizer boundary | fresh missing-Codex and demo locked-Codex cases; discovery entry/flag/source/reference coherence; no survey-authored Knowledge, known-location, currency, standing, reputation, inventory, or reward proposal; ordinary time synchronization preserved |

Independent read-only inspection also found and this implementation closed: incomplete owner-input normalization, arbitrary-edge continuity reachability, shallow commit revalidation, malformed JSON throws, semantic receipt gaps, removable baseline provenance, partial correction reconciliation, repeatable terminal repair, applied-event re-emission, incomplete preview facts, duplicate discovery/ruins flags, stale caller retry liveness, and parent-ledger replacement that discarded nested survey authority.

## Files Changed

Production and contracts:

- `packages/shared/types/src/contracts.ts`;
- `packages/shared/events/src/index.ts`;
- `packages/engines/game-engine/src/campaign-rules.ts`;
- `packages/engines/game-engine/src/campaign-session.ts`;
- `packages/engines/game-engine/src/player-survey-activity-advancement.ts` and `.js`;
- `packages/engines/game-engine/src/index.ts`;
- `packages/engines/game-engine/src/normal-defeat.ts`;
- `apps/rpg-ui/src/game-shell/saveManager.ts`;
- `apps/rpg-ui/src/game-shell/gameplayLoop.ts`;
- `apps/rpg-ui/src/runtime/GameSessionContext.tsx`;
- `apps/rpg-ui/src/features/ActivityPanel.tsx`.

Tests:

- `tests/unit/player-survey-activity-advancement-characterization.test.mjs`;
- `tests/unit/player-survey-activity-advancement-command.test.mjs`;
- `tests/unit/player-survey-activity-advancement-persistence.test.mjs`;
- `tests/unit/gameplay-loop-skill-gating.test.mjs`;
- `tests/unit/campaign-persistence-foundation.test.mjs`;
- `tests/simulation/save-load-roundtrip.test.mjs`.

Coordination files are updated in the separate coordination commit.

## Checks Run

- pre-edit survey skill gate: `5/5` passed;
- pre-edit campaign persistence: `33/33` passed;
- pre-extraction four-stage characterization: `1/1` passed;
- final survey command and persistence suites: `24/24` passed (`18` command, `6` persistence);
- final prescribed focused/adjacent matrix: `167/167` passed;
- final RPG UI production build: Vite `5.4.21`, `211` modules transformed, success; only the existing large-chunk advisory remained;
- bounded RPG UI TypeScript audit: `137` diagnostics total, matching the starting baseline; exactly two touched-surface diagnostics, both the pre-existing `ActivityPanel` `exactOptionalPropertyTypes` findings; no new survey, campaign, contract, save, context, or defeat diagnostic;
- raw serialization, version-7 publication/restart, version-6 initialization, browser build, JS/TS forwarding mirror, public export, and real-caller source guards passed in the focused suites;
- `git diff --check`, staged diff inspection, temporary-build cleanup, debug-marker scan, and worktree hygiene passed.

An optional broad repository audit was also run before source freeze: `3607/3618` passed with `11` unrelated registered baseline failures in draft-content, settlement/transport, schema-registration, launcher, and Renown tests. The full suite is a known non-green/non-default audit surface and was not used to override the green prescribed gate.

## Failure-Pattern Evidence

- `FP-001`: migrated and guarded the actual ActivityPanel -> GameSessionContext -> App state path.
- `FP-002`: reconciled automated results with an independent adversarial failure-boundary review.
- `FP-003`: exposed a production-reachable projection repair owner and correction-pending diagnostic.
- `FP-005`: covered same-process, caller-loss, rerender identity, restart, later-state duplicate, and regenerated/conflicting transient state.
- `FP-006`: proved older repair cannot overwrite newer truth or resurrect cap-expired rows.
- `FP-008`: kept evidence/protected branches read-only despite dynamic mechanical mergeability.
- `FP-009`: distinguishes inspected base, implementation commit, containing coordination commit, and post-push live head.
- `FP-010`: reconciled every permanent-decision and independent-audit finding into the numbered implementation matrix.
- `FP-011`: validates source/control/provenance before continuity creation, owner effects, or repair.
- `FP-012`: requires one unique complete durable evidence graph before duplicate success.
- `FP-013`: preserves nested survey authority across campaign fork, v6 migration, Normal defeat, and recovery ledger rewrites, with focused regression coverage.

`FP-004` and `FP-007` were not applicable.

## Branch And PR Lifecycle

Orientation fetched/pruned from clean synchronized base `85ad4ea...`, inspected one local branch, 36 non-default remote branches, and two open PRs. The four exact Connector evidence refs remained unchanged and `CANDIDATE_INTEGRATION`; the integrated-gameplay and prompt-packaging refs remained `PROTECTED_REFERENCE`.

PR #2 remained open non-draft at `e78dc645cfb658685be12f45f46d34b7c0da1119`; PR #3 remained open draft at `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`. Both were mechanically mergeable at this inspection but remain `SUPERSEDED_PRESERVE_EVIDENCE` because semantic disposition, not textual mergeability, controls.

No disposition changed. No merge, cherry-pick, rebase, force update, PR mutation, closure, or branch deletion occurred. Every retained branch keeps its recorded review trigger.

## Risks And Follow-Up

- Independent parent acceptance remains mandatory; implementation success is not self-acceptance.
- The broad TypeScript and full-suite baselines remain separate repository debt and were not weakened or repaired.
- Projection repair is intentionally bounded; correction execution and gameplay rollback remain unsupported.
- The survey typed event is a result-derived projection, not a new generic event bus.
- `normal-defeat.ts` was narrowly authorized beyond the listed surface only to preserve the optional nested ledger through same-command/later defeat and recovery; it contains no defeat redesign.

Suggested coordination commit message: `docs(workflow): install survey advancement audit`

Next recommended version/run: `Version 0.6.10.1 - Ashen Reef Survey Advancement Acceptance Audit`
