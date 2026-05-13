# Current Codex Output

Source version/run: Launcher Inactive Character Asset Replacement
Date: 2026-05-13
Branch/status assumption: `master`; worktree already had modified launcher spacing files, this output doc, and a modified `unused assets/Inactive_Character.png` at run start.

## Result

Replaced the current launcher inactive Character button image used by the UI with the updated asset from `unused assets/Inactive_Character.png`.

The UI is wired to `/launcher/character-inactive-soft.png`, so only `apps/rpg-ui/public/launcher/character-inactive-soft.png` was overwritten. The older raw `character-inactive.png` asset was left unchanged.

## Files Changed

- `apps/rpg-ui/public/launcher/character-inactive-soft.png`
- `docs/dev/current-codex-output.md`

Existing dirty files preserved from earlier work:

- `apps/rpg-ui/src/game-shell/components/AppShell.tsx`
- `apps/rpg-ui/src/index.css`
- `unused assets/Inactive_Character.png`

## Checks Run

- `git status --short`: run before edits; showed modified launcher spacing files, modified output doc, and modified `unused assets/Inactive_Character.png`.
- Asset inspection: source and destination are both `700x200`.
- Hash verification: source and destination SHA-256 both `aed670c6ef644e408f7128315466b95c2350daac8f2c079a7aac619c78234b1d`.
- `npm.cmd run tool:content-lint`: passed.
- `git diff --check`: passed with CRLF normalization warnings only.

## Behavior / Runtime Confirmation

Runtime behavior did not change. Save/account state, content JSON, schemas, combat, magic, Legacy, progression logic, character creator logic, save-slot behavior, launcher routing, and button state logic were untouched.

This was limited to replacing the inactive Character launcher button image asset currently referenced by the UI.

## Risks / Follow-Up

- No browser visual QA was run; validation was asset dimension/hash plus lint/diff checks.
- The source `unused assets/Inactive_Character.png` remains modified in the worktree because it was already the updated user-provided source asset.

## Next Recommended Version

Version 0.5.29 - Launcher Browser Visual QA

## Suggested Commit Message

style(ui): update inactive character launcher asset
