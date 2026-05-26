# Current Codex Output

Source version/run: Version 0.5.85 - Creator Sidebar Layout And Backstory Gating
Date: 2026-05-26
Branch/status assumption: Ran locally on `master`; preflight worktree was clean and `master` was not behind `origin/master`. Default `git pull` failed local SSL validation, then `git -c http.sslBackend=schannel pull` reported `Already up to date.`

## Result
Implemented the creator-only sidebar refinement pass. Character creation now uses the launcher `AppShell` with a left sidebar summary, fixed-width step navigation, full-character randomization, locked/skipped backstory behavior when no selectable backstories exist, and a total attribute matrix with source breakdown tooltips.

## Files Inspected
- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/unified-shell-and-creator-refinement-plan.md`
- `docs/design/future-system-design-ledger.md`
- `docs/future_content_backlog.md`
- `apps/rpg-ui/src/App.tsx`
- `apps/rpg-ui/src/game-shell/components/AppShell.tsx`
- `apps/rpg-ui/src/game-shell/components/MainMenuScreen.tsx`
- `apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx`
- `apps/rpg-ui/src/game-shell/components/ShellBrandLogo.tsx`
- `apps/rpg-ui/src/components/ui/Tooltip.tsx`
- `apps/rpg-ui/src/game-shell/characterCreationForm.ts`
- `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts`
- `apps/rpg-ui/src/game-shell/characterCreationMath.ts`
- `apps/rpg-ui/src/game-shell/characterAttributes.ts`
- `apps/rpg-ui/src/game-shell/newGameSnapshot.ts`
- `apps/rpg-ui/src/game-shell/worldSelectionCatalog.ts`
- `apps/rpg-ui/src/game-shell/legacyPreparationApplication.ts`
- `tests/unit/backstory-creator-availability.test.mjs`
- `tests/unit/legacy-start-resources.test.mjs`
- `tests/unit/character-creation-profile-resolver.test.mjs`
- `tests/unit/legacy-ledger-presentation.test.mjs`

## Files Changed
- `apps/rpg-ui/src/App.tsx`
- `apps/rpg-ui/src/game-shell/calendarClimatePresentation.js`
- `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts`
- `apps/rpg-ui/src/game-shell/characterCreationForm.ts`
- `apps/rpg-ui/src/game-shell/characterCreationRandomization.ts`
- `apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx`
- `apps/rpg-ui/src/game-shell/newGameSnapshot.ts`
- `tests/unit/character-creation-attribute-preview.test.mjs`
- `tests/unit/character-creation-form.test.mjs`
- `tests/unit/character-creation-randomization.test.mjs`
- `tests/unit/legacy-ledger-presentation.test.mjs`
- `docs/dev/current-codex-output.md`
- `docs/future_content_backlog.md`

## Creator Sidebar / Layout
Character creation now renders inside `AppShell` with `ShellBrandLogo`, a top action area, notice rendering, and a left sidebar. The old separate live summary toggle and right summary column are removed. The sidebar contains the identity/live summary, fixed-width step navigation, full randomize button, compact start context, total attributes, and resource bars. The main pane is now the focused step content area.

Return to menu, previous-step navigation, theme toggle, notice rendering, overwrite confirmation, and Begin Journey flow were preserved. Gameplay shell layout was not changed.

## Step Navigation / Backstory
Added creator step-state helpers in `characterCreationForm.ts`:
- `buildCharacterCreationStepStates`
- `getNextAvailableCharacterCreationStepId`
- `getPreviousAvailableCharacterCreationStepId`

Region remains locked until continent is selected, settlement remains locked until region is selected, and backstory is locked and skipped only when no selectable backstory exists. Locked steps are disabled and show a lock icon. Available incomplete, active, completed, and recently unlocked states are visually distinct in the sidebar.

Backstory remains required once at least one selectable backstory exists. When no selectable backstory exists, an empty `backstoryId` no longer blocks validation, review, or new-game creation. Forced unavailable backstory ids still fail validation.

## Full Randomize
Added `generateRandomCharacterCreationFormState(...)` in `characterCreationRandomization.ts`. It preserves `saveSlotId`, clears `sourceRunId`, chooses valid existing lineage, identity, world, settlement, starting bundle, and bundle-choice ids, and chooses a backstory only when one is selectable. Page-specific randomizers keep their scoped behavior.

## Attribute Matrix
Added typed attribute preview rows in `newGameSnapshot.ts` with canonical `STR DEX AGI CON VIT INT WIS SPT CHA` ordering. The visible stat preview now shows total values only. Source contributions move into the existing tooltip content and include racial baseline, sex, age, height, backstory only when applied, generated build/profile, Legacy Preparation only when applied, and total. Attribute labels are keyboard-focusable for tooltip access.

## Behavior / Runtime Confirmation
Character creation UI behavior changed. Creator validation and new-game snapshot creation now support the explicit no-selectable-backstory path by creating no backstory package: no invented placeholder id, no backstory starter skills or abilities, no backstory flags, nullable `coreData.backstoryId`, and neutral session/chronicle copy.

No gameplay shell layout, generated UI output, combat source/tests/content, economy source/tests/content, calendar/climate behavior, clock progression, month-to-season mapping, climate content, Chronicle behavior, Bloodlines behavior, Backstory Legacy purchase behavior, Family Prestige, Chronicle Marks, Lineage Seals, estate, heir, heirloom, bequest behavior, save migration, or old-save compatibility changed.

`apps/rpg-ui/src/game-shell/calendarClimatePresentation.js` is a one-line module bridge for the existing calendar projection TS module so the touched Node source-assertion test can resolve the existing app import. It does not change calendar/climate logic, load content, or add UI behavior.

## Tests Added / Updated
- Added `tests/unit/character-creation-form.test.mjs` for optional backstory validation, forced unavailable backstory rejection, locked/skipped navigation, and no-backstory snapshot creation.
- Added `tests/unit/character-creation-randomization.test.mjs` for full randomization with selectable backstories and with no selectable backstories.
- Added `tests/unit/character-creation-attribute-preview.test.mjs` for canonical total attribute rows and contribution breakdown behavior.
- Updated `tests/unit/legacy-ledger-presentation.test.mjs` source assertions to reflect the creator sidebar/AppShell layout and removed summary toggle.

## Checks Run
- `git status --short --branch`
- `git pull` (failed local SSL certificate validation)
- `git -c http.sslBackend=schannel pull`
- `node --test tests/unit/character-creation-form.test.mjs`
- `node --test tests/unit/character-creation-randomization.test.mjs`
- `node --test tests/unit/character-creation-attribute-preview.test.mjs`
- `node --test tests/unit/backstory-creator-availability.test.mjs`
- `node --test tests/unit/legacy-start-resources.test.mjs`
- `node --test tests/unit/character-creation-profile-resolver.test.mjs`
- `node --test tests/unit/legacy-ledger-presentation.test.mjs`
- `node --test tests/unit/calendar-climate-presentation.test.mjs`
- `node --test tests/unit/clock-season-map.test.mjs`
- `rg -n "game-engine/src/index|civilization-engine/src/index|civilization-engine/src/content|load.*Content|node:fs|readFileSync" apps/rpg-ui/src` (no matches)
- `git diff --check` (passed; Git reported expected LF-to-CRLF working-copy warnings)

Broad typecheck and browser render verification were not run per scope.

## Risks / Follow-Up
- Current live content still has selectable default backstories, so the no-backstory start path is protected by focused test fixtures/options until content actually locks all backstory choices.
- Tooltip breakdowns are available through hover and keyboard focus. Dedicated touch long-press behavior was not added to the shared tooltip component in this pass and is recorded in `docs/future_content_backlog.md`.
- No universal gameplay shell extraction was attempted; gameplay shell unification remains a later scoped pass.

## Next Recommended Version
Version 0.5.86 - Combat Equipment Mapping Audit

## Suggested Commit Message
feat(creator): add sidebar flow and backstory gating
