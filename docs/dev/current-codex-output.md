# Current Codex Output

Source version/run: Launcher Active Button CSS Shadow Removal
Date: 2026-05-13
Branch/status assumption: `master`; worktree already had the launcher clock-spacing CSS change and this output doc modified at run start. Untracked user intake copies were preserved.

## Result

Removed the only CSS filter/drop-shadow path attached to active launcher sidebar button images.

The dev-tools observation pointed to `.launcher-sidebar-button-image-active`. CSS inspection showed the art-button wrapper is already transparent, pseudo-elements are disabled for `.has-art`, and the active image only had one extra visual treatment: a focus-visible `brightness(...) drop-shadow(...)` filter. That rule is now removed, and the image transition now animates opacity only.

Kept the fixed `12rem` launcher sprite-clock slot from the previous spacing change so the account/player menu button no longer shifts when the clock changes between 3-digit and 4-digit visible times.

## Files Changed

- `apps/rpg-ui/src/index.css`
- `docs/dev/current-codex-output.md`

Untracked user intake copies preserved:

- `unused assets/Active_Character - Copy.png`
- `unused assets/Active_Settings - Copy.png`
- `unused assets/Active_legacy - Copy.png`

## Checks Run

- `git status --short`: run before edits; showed `apps/rpg-ui/src/index.css`, `docs/dev/current-codex-output.md`, and untracked user intake copies.
- CSS inspection of launcher sidebar button image/filter rules.
- Source/destination hash verification for all eight launcher button assets: passed; public assets still match the supplied `unused assets/` files and remain `700x200`.
- `npm.cmd run tool:content-lint`: passed.
- `node --test tests\unit\*presentation*.mjs`: passed, 32 tests.
- `git diff --check`: passed with CRLF normalization warnings only.

## Behavior / Runtime Confirmation

Runtime behavior did not change. Time source, time formatting, account state, save behavior, routes, content JSON, schemas, combat, magic, Legacy, progression, creator logic, save-slot behavior, launcher routing, and sidebar button interaction logic were untouched.

This was limited to launcher visual CSS: stable clock width plus removal of the active image focus-visible filter/drop-shadow.

## Risks / Follow-Up

- No browser visual QA was run; validation was CSS inspection plus lint/test/diff checks.
- If a rectangle remains after removing this CSS filter, the next check should inspect computed styles in-browser for any inherited or browser-applied filter on `.launcher-sidebar-button-image-active`.

## Next Recommended Version

Version 0.5.32 - Launcher Browser Visual QA

## Suggested Commit Message

style(ui): remove active launcher button shadow filter
