# Current Codex Prompt

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run:

`Version 0.6.0.2 - Residual UI Snapshot Authority Repair`

## Accepted State

- Latest completed primary: `Version 0.6.0 - Engine-Owned Player Travel Command`.
- Latest completed support/audit run: `Version 0.6.0.1 - Engine-Owned Player Travel Post-Transition Audit`.
- The landed travel implementation is commit `ce61cbc8ac7c5a0cb7c550b279ed7051f69b2757` unless branch sync shows a newer superseding commit.
- Focused travel behavior, command/revision validation, atomicity, current state parity, event emission, persistence, browser imports, TS/JS peers, and the active UI adapter passed the audit.
- The audit failed only the no-residual-authority gate: five dead synchronization helper copies remain in `apps/rpg-ui/src/game-shell/gameplayLoop.ts` after their live ownership moved to `packages/engines/game-engine/src/gameplay-snapshot-sync.ts`.
- No user decision or Deep Research is required.

## Purpose

Apply the smallest coherent repair that removes proven duplicate UI gameplay authority without changing runtime behavior.

Delete exactly the dead UI implementations of:

- `syncQuestJournal(...)`;
- `syncWorldRecords(...)`;
- `syncActivityRecords(...)`;
- `syncCodexEntries(...)`;
- `syncQuestIds(...)`.

Preserve the live `syncSnapshot(...)` wrapper and its delegation to `synchronizeGameplaySnapshot(...)`. Current UI-authored quest and activity actions still call that bridge; moving those actions is not part of this support repair.

## Required First Steps

1. Run branch status, fetch, and fast-forward pull. Record the starting commit and dirty/clean state. Preserve unrelated changes.
2. Read:
   - `AGENTS.md` and `README.md`;
   - `docs/dev/current-codex-output.md`;
   - `docs/dev/current-gpt-handoff.md`;
   - `docs/dev/current-codex-prompt.md`;
   - `docs/dev/codex-sequenced-implementation-plan.md`;
   - `docs/dev/project-roadmap.md`;
   - `docs/dev/project-vision-and-continuity-brief.md`;
   - `docs/design/runtime-ownership-transition-readiness-consolidation.md`;
   - `docs/design/player-travel-boundary-clarification.md`;
   - `docs/future_content_backlog.md`.
3. Reproduce the audit finding with exact reference searches in `gameplayLoop.ts` and confirm the engine-owned implementations remain live in `gameplay-snapshot-sync.ts`.
4. Inspect the current diff and stop if branch sync already removed or materially changed the five helper definitions.

## Allowed Production And Test Changes

### `apps/rpg-ui/src/game-shell/gameplayLoop.ts`

- Remove only the five dead helper definitions named above.
- Remove only imports that become unused because of those deletions. The audit identified `CodexEntryState` and `PanelRecordState` as deletion candidates; verify current usage before editing. Keep `QuestJournalEntryState`, which is still used by `findQuest(...)` unless current source proves otherwise.
- Keep `syncSnapshot(...)` as the narrow delegate to `synchronizeGameplaySnapshot(...)`.
- Do not rename, reorder, refactor, or move adjacent quest/activity helpers.

### `tests/unit/player-travel-command.test.mjs`

- Extend the existing UI authority source test with exact negative guards proving `gameplayLoop.ts` does not declare the five removed synchronization helpers.
- Retain the existing guards for no `LOCATION_TEMPLATES`, no direct UI travel mutation, engine command use, and accepted-only `WorldPanel` application.
- Do not add broad snapshots or unrelated UI tests.

## Required Behavior Preservation

The repair must not change:

- destination facts, travel timing, costs, preview, mitigation, or accepted snapshots;
- command construction, sequence defaults, revision validation, rejection codes, or event identity/payload;
- synchronization behavior or the engine implementation of it;
- quest acceptance/tracking/turn-in, activity selection/advancement, rest, notifications, Chronicle, records, Codex, progression, or tracked-quest cleanup;
- save fields, snapshot version, schemas, migrations, compatibility behavior, content, dependencies, or package configuration.

Exact command replay currently produces the same deterministic command/event and identical replacement snapshot. Do not add replay ledgers, command buses, external event dispatch, or idempotency redesign in this repair.

## Required Validation

Run:

`node --test tests/unit/player-travel-command.test.mjs tests/unit/player-travel-characterization.test.mjs tests/unit/gameplay-loop-skill-gating.test.mjs tests/simulation/save-load-roundtrip.test.mjs tests/simulation/deterministic-scenario.test.mjs`

Also run:

- direct searches proving the five UI helper declarations and `LOCATION_TEMPLATES` are absent;
- direct searches proving `syncSnapshot(...)` still delegates to `synchronizeGameplaySnapshot(...)` and current callers remain;
- direct searches for direct UI travel mutation and duplicate destination rule values;
- `git diff --check`;
- conflict-marker, changed-path, temporary-artifact, and final branch-status checks.

Run a focused typecheck only if the edit creates a touched-file diagnostic that the source/test checks cannot explain. Do not run the full suite, DB build, UI build, package installation, servers, generated-output refresh, or broad cleanup.

## Stop Conditions

Stop and report rather than broaden if:

- any named helper has a live caller after branch sync;
- removing a helper changes runtime output or requires changing engine synchronization behavior;
- the focused tests expose a travel, quest/activity, persistence, or browser defect beyond stale UI duplication;
- cleanup requires touching another production module;
- unrelated worktree changes overlap the exact removal blocks.

Do not extract the next quest/activity consumer, redesign command sequencing, add a generic command bus, fix unrelated typecheck debt, or clean other UI helpers in this run.

## Documentation And Handoff

Update only the smallest necessary coordination set:

- overwrite `docs/dev/current-codex-output.md` with the repair result;
- replace/prune `docs/dev/current-gpt-handoff.md` with the repaired authority state and remaining risk;
- update current anchors in the sequenced plan, roadmap, and continuity brief only as needed;
- update `docs/future_content_backlog.md` to close the exact residual-authority repair;
- overwrite `docs/dev/current-codex-prompt.md` with a decision-complete read-only `Version 0.6.0.3 - Engine-Owned Player Travel Post-Repair Audit` prompt.

Do not create a new design or temporary audit document.

## Current Codex Output Requirements

Record:

- source version/run and date;
- starting commit, branch, and status assumption;
- exact helper/import/test changes;
- checks run, outcomes, and intentionally omitted checks;
- confirmation that behavior and synchronization ownership did not change;
- residual risks and accepted unrelated debt;
- Deep Research decision;
- next recommended version/run;
- suggested commit message.

Suggested commit message:

`fix(runtime): remove residual UI snapshot authority`
