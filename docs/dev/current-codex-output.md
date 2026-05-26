# Current Codex Output

Source version/run: Version 0.5.84 - Unified Shell And Creator Refinement Plan
Date: 2026-05-26
Branch/status assumption: Ran locally on `master`; preflight worktree was clean and not behind `origin/master`. Default `git pull` failed local SSL validation, then `git -c http.sslBackend=schannel pull` fast-forwarded to `851f905`; worktree was clean before docs edits.

## Result
Docs-only planning pass completed. Added the unified shell and creator refinement source plan, then re-sequenced the near-term handoff so `0.5.85` targets character creation sidebar/layout, backstory gating, full randomization, and stat preview cleanup before returning to combat audit.

## Files Inspected
- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/design/future-system-design-ledger.md`
- `docs/future_content_backlog.md`
- `apps/rpg-ui/src/game-shell/components/AppShell.tsx`
- `apps/rpg-ui/src/game-shell/components/MainMenuScreen.tsx`
- `apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx`
- `apps/rpg-ui/src/game-shell/components/ShellBrandLogo.tsx`
- `apps/rpg-ui/src/components/layout/AppLayout.tsx`
- `apps/rpg-ui/src/components/SideNav.tsx`
- `apps/rpg-ui/src/components/TopStatusBar.tsx`
- `apps/rpg-ui/src/components/ui/Tooltip.tsx`
- `apps/rpg-ui/src/game-shell/InGameShell.tsx`
- `apps/rpg-ui/src/game-shell/characterCreationForm.ts`
- `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts`
- `apps/rpg-ui/src/game-shell/characterCreationMath.ts`
- `apps/rpg-ui/src/game-shell/characterAttributes.ts`
- `apps/rpg-ui/src/game-shell/newGameSnapshot.ts`
- `apps/rpg-ui/src/game-shell/worldSelectionCatalog.ts`
- `apps/rpg-ui/src/game-shell/legacyPreparationApplication.ts`
- `packages/shared/types/src/contracts.ts`
- `tests/unit/backstory-creator-availability.test.mjs`
- `tests/unit/legacy-start-resources.test.mjs`
- `tests/unit/character-creation-profile-resolver.test.mjs`

## Files Changed
- `docs/design/unified-shell-and-creator-refinement-plan.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/future_content_backlog.md`

## Planning Boundary
Created `docs/design/unified-shell-and-creator-refinement-plan.md` as the planning source for a future creator-focused implementation. The plan inserts this refinement track before Combat Equipment Mapping Audit and keeps this run docs-only.

## Current Repo Reality
Main menu currently uses `AppShell`, launcher top bar, shell logo area, shell sub-bar, content slots, and `SidebarNav`. Character creation currently uses a bespoke sticky top bar, horizontal step rail, summary toggle, and right-side live summary column. Gameplay currently uses separate `AppLayout`, `TopStatusBar`, and `SideNav`.

Backstory is currently part of required creator validation and new-game creation. Current snapshot creation assumes a selected backstory for starter skills, abilities, flags, chronicle/session copy, and `coreData.backstoryId`, even though shared contracts allow nullable/optional `backstoryId`. Attribute math already separates lineage/identity/backstory base contributions, generated profile points, final attributes, and Legacy preparation adjustments.

## Target Implementation Boundary
Next implementation should be `Version 0.5.85 - Creator Sidebar Layout And Backstory Gating`. It should target character creation only: move the live summary into the left sidebar, remove the separate summary toggle/right column, make step indicators fixed-width and stateful, skip locked backstory only when no selectable backstory exists, add a pure full-character randomization helper, and collapse visible stat preview into one total attribute matrix with breakdown in tooltip/popover content.

Gameplay shell unification, universal shell extraction, generated output, backstory purchase UI, new backstory content ids, family/source-run/scoped Backstory evidence, source-run/heir randomization, broad typecheck cleanup, and combat audit remain deferred.

## Backstory / Randomization / Attribute Decisions
Backstory should remain required once at least one selectable backstory exists. If no selectable/unlocked backstory exists, the step should be locked, skipped by next/previous navigation, and an empty `backstoryId` should not block validation or new-game creation. The preferred no-backstory policy is no package: no invented content id, no backstory starter skills or abilities, no `player.backstory.*` or `character.backstory.*` flags, and neutral origin/session copy.

Full randomization should live in a future pure helper such as `generateRandomCharacterCreationFormState(...)`, preserve `saveSlotId`, reset `sourceRunId`, choose only valid existing ids, and choose a backstory only when at least one resolver-selectable option exists. Page-specific randomizers should keep their current field-scoped behavior.

The visible attribute preview should be one canonical total matrix in `STR DEX AGI CON VIT INT WIS SPT CHA` order. Source breakdown should move into hover/focus/long-press tooltip or popover content and include racial baseline, sex, age, height, backstory only if applied, generated build/profile, Legacy Preparation only if applied, and total.

## Behavior / Runtime Confirmation
No React/source behavior, validation behavior, randomization behavior, stat math, save creation, generated UI output, runtime behavior, JSON content, schema, clock/calendar/climate behavior, economy, combat, Chronicle, Bloodlines, Backstory Legacy, Family Prestige, Chronicle Marks, Lineage Seals, estate, heir, heirloom, or bequest behavior changed. This was a docs-only planning and sequencing pass.

## Tests / Checks
- `git status --short --branch`
- `git pull` (failed local SSL certificate validation)
- `git -c http.sslBackend=schannel pull`
- Source/document inspection with focused `Get-Content` / `rg` reads
- `git diff --check`

Runtime tests were not run because no runtime, source, content, or test files changed.

## Risks / Follow-Up
- Current live data still has selectable default backstories, so the future locked/no-backstory path needs focused fixtures or dependency injection to test no selectable options.
- No-backstory creation touches validation, snapshot copy, flags, skills, abilities, and starter state; keep that implementation narrow and test-backed.
- Existing design-ledger language says the creator applies exactly one selected backstory package. The plan narrows that rule to exactly one package when the backstory step is available; no package only when the step is locked with no selectable options.
- Gameplay shell unification should wait until the creator implementation proves whether `AppShell` can serve as shared chrome without a broad rewrite.

## Next Recommended Version
Version 0.5.85 - Creator Sidebar Layout And Backstory Gating

## Suggested Commit Message
docs(ui): plan unified shell creator refinement
