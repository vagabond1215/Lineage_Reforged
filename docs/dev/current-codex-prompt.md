# Current Codex Prompt

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run:

`Version 0.6.0.3 - Engine-Owned Player Travel Post-Repair Audit`

## Accepted State

- Latest completed primary: `Version 0.6.0 - Engine-Owned Player Travel Command`.
- Latest completed support run: `Version 0.6.0.2 - Residual UI Snapshot Authority Repair`.
- The repair removed exactly the five dead UI copies of engine-owned snapshot synchronization helpers, removed only newly unused imports, preserved the live engine-delegating `syncSnapshot(...)` wrapper and its nine current callers, and added focused source guards.
- The repair's exact focused group passed 17/17.
- No user decision or Deep Research is required.

## Purpose

Perform one narrow read-only post-repair audit. Confirm the residual-authority repair is complete, behavior-preserving, browser/persistence-safe, and free of new hygiene defects. If accepted, inspect current UI-authored quest and activity mutation paths and select exactly one bounded next engine-owned consumer.

Do not edit runtime, UI, shared contracts, tests, content, schemas, persistence, package files, or generated output during this audit. If contradictory evidence identifies a real defect, package the smallest separate support repair and stop without selecting another consumer.

## Required First Steps

1. Run branch status, fetch, and fast-forward pull. Record the starting commit and dirty/clean state; preserve unrelated work.
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
3. Inspect the complete `0.6.0.2` diff and current versions of `gameplayLoop.ts`, `gameplay-snapshot-sync.ts`, `player-travel.ts`, `player-travel-rules.ts`, `WorldPanel.tsx`, and `player-travel-command.test.mjs`.
4. Map the live preview, command, execution, synchronization, accepted-commit, rejection, event, and notice paths before deciding.

## Repair Audit

Confirm with exact source/test evidence:

- `gameplayLoop.ts` declares none of `syncQuestJournal(...)`, `syncWorldRecords(...)`, `syncActivityRecords(...)`, `syncCodexEntries(...)`, or `syncQuestIds(...)`;
- the corresponding engine implementations remain live and are called by `synchronizeGameplaySnapshot(...)`;
- `syncSnapshot(...)` remains a narrow delegate and all current callers still reach the engine path;
- no needed import or helper was removed and no obsolete repair-only import remains;
- the focused source guard covers all five names while retaining existing no-catalog, no-direct-mutation, engine-command, and accepted-only UI checks;
- travel rules, command/revision identity, atomic rejection, accepted snapshot parity, event emission, persistence roundtrip, browser import graph, TS/JS peers, risky confirmation, and notice behavior remain unchanged;
- no content, schema, save field/version, migration, compatibility behavior, dependency, generated output, command bus, replay ledger, or unrelated cleanup entered the repair;
- no conflict marker, trailing whitespace, temporary artifact, stale active anchor, or unexpected changed path remains.

## Required Validation

Run:

`node --test tests/unit/player-travel-command.test.mjs tests/unit/player-travel-characterization.test.mjs tests/unit/gameplay-loop-skill-gating.test.mjs tests/simulation/save-load-roundtrip.test.mjs tests/simulation/deterministic-scenario.test.mjs`

Also run direct helper-ownership, delegation/caller, travel-catalog/value, direct-mutation, event/export/import, changed-path, conflict-marker, temporary-artifact, `git diff --check`, and final status searches.

Run typecheck only if it materially clarifies a touched-boundary diagnostic. Do not run the full suite, DB build, UI build, package installation, servers, generated-output refresh, or broad cleanup.

## Decision Rules

Accept only if the duplicate UI authority is gone, the engine synchronization path remains live, focused behavior is green, and no material touched-boundary defect appears.

If repair is still required, select the smallest `Version 0.6.0.4 - ... Repair` support route and do not select a next consumer.

## Next Consumer Selection

Only after accepting the repair, inspect current UI-authored quest/activity actions such as quest acceptance, quest tracking, activity selection, activity advancement, rest, and quest turn-in.

Select exactly one action using actual source and test evidence for:

- one clear input/result boundary and identifiable UI call site;
- stable current behavior that can be characterized before extraction;
- bounded mutation and rejection surfaces comparable to or smaller than travel;
- reuse of the landed command/result/event/snapshot pattern;
- no new content, schema, save field, migration, compatibility behavior, broad quest lifecycle, rewards redesign, inventory redesign, combat, or generic command-bus work;
- meaningful runtime-ownership value and focused deterministic/rejection coverage.

Record candidates inspected, exact mutation/call surfaces, dependencies/blockers, comparative risk/value, selected version label, allowed scope, exclusions, stop conditions, and required tests. Do not implement the consumer during this audit.

## Documentation And Handoff

Update only the smallest necessary coordination set:

- overwrite `docs/dev/current-codex-output.md`;
- replace/prune `docs/dev/current-gpt-handoff.md`;
- update current anchors in the sequenced plan, roadmap, and continuity brief only as needed;
- update `docs/future_content_backlog.md` only for the completed audit and concrete next deferral;
- overwrite `docs/dev/current-codex-prompt.md` with a decision-complete prompt for the selected next primary consumer, or the narrow `0.6.0.4` repair if the audit fails.

Do not create a new design or temporary audit document.

## Current Codex Output Requirements

Record source/run/date, starting commit/status, audit verdict, files inspected and documentation changed, checks/outcomes/omissions, authority and behavior verdicts, persistence/browser/TS-JS verdict, residual risks/debt, candidate comparison and selected route or repair, Deep Research decision, next version, and suggested commit message.

Suggested commit message when accepted:

`docs(audit): verify repaired player travel boundary`
