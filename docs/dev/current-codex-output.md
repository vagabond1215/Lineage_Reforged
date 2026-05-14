# Current Codex Output

Source version/run: Version 0.5.37 - Launcher Save Area Flush Padding Fix
Date: 2026-05-14
Branch/status assumption: Current local branch reality; `git status --short` was clean before edits.

## Result

Removed the launcher Characters view padding gap caused by the shared `ShellContent` inner wrapper.

The root cause was the default inner wrapper class `mx-auto w-full max-w-7xl p-4 sm:p-5 lg:p-6`. `AppShell` now supports an optional `contentInnerClassName` override while preserving that default for all existing callers. `MainMenuScreen` uses the override only for the Characters save-slot surface, passing `w-full p-0` so the existing textured save-slot field can meet the top/subbar and sidebar chrome without the former outer padding gap.

## Files Changed

- `apps/rpg-ui/src/game-shell/components/AppShell.tsx`
- `apps/rpg-ui/src/game-shell/components/MainMenuScreen.tsx`
- `docs/dev/current-codex-output.md`

## Checks Run

- `git status --short`: run before edits; clean.
- `npm.cmd run tool:content-lint`: passed.
- `node --test tests\unit\*presentation*.mjs`: passed.
- App-local TSX syntax/transpile probe for `AppShell.tsx` and `MainMenuScreen.tsx`: passed from `apps/rpg-ui`.
- `git diff --check`: passed.

## Behavior / Runtime Confirmation

Runtime behavior did not change. Save/account state, save-slot routing, deletion logic, pagination logic, clock logic, content JSON, schemas, combat, magic, Legacy, progression, creator logic, sidebar art, logo, sprite clock, account menu behavior, page button logic, and image assets were untouched.

This run changed launcher/main-menu layout styling only through a narrow AppShell content-inner override.

## Risks / Follow-Up

- No browser visual QA was run in this pass; validation was code inspection plus focused lint/test/diff checks.
- Notices on the Characters surface now share the flush content wrapper if present; the save-slot field itself retains internal spacing for row readability.

## Next Recommended Version

Version 0.5.38 - Launcher Browser Visual QA

## Suggested Commit Message

style(ui): remove launcher save area padding gap
