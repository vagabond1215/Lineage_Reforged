# Current Codex Output

Source version/run: Launcher Sidebar Button Asset Replacement
Date: 2026-05-13
Branch/status assumption: `master`; worktree already contained the prior launcher sprite-clock changes, untracked clock assets, and user-updated `unused assets/` button source files at run start.

## Result

Replaced the eight launcher sidebar button runtime assets with the updated background-removed files from `unused assets/`.

The UI already references the `*-soft.png` files under `apps/rpg-ui/public/launcher/`, so no component wiring or behavior changed. All copied assets retained the required `700x200` dimensions.

## Files Changed

- `apps/rpg-ui/public/launcher/character-active-soft.png`
- `apps/rpg-ui/public/launcher/character-inactive-soft.png` verified/replaced, no net diff from current source state
- `apps/rpg-ui/public/launcher/legacy-active-soft.png`
- `apps/rpg-ui/public/launcher/legacy-inactive-soft.png`
- `apps/rpg-ui/public/launcher/chronicles-active-soft.png`
- `apps/rpg-ui/public/launcher/chronicles-inactive-soft.png`
- `apps/rpg-ui/public/launcher/settings-active-soft.png`
- `apps/rpg-ui/public/launcher/settings-inactive-soft.png`
- `docs/dev/current-codex-output.md`

Existing dirty files from prior/user work were preserved:

- `apps/rpg-ui/src/game-shell/components/MainMenuScreen.tsx`
- `apps/rpg-ui/src/game-shell/components/SettingsScreen.tsx`
- `apps/rpg-ui/src/game-shell/components/LauncherSpriteClock.tsx`
- `apps/rpg-ui/src/index.css`
- `apps/rpg-ui/public/clock/`
- `unused assets/Active_Character.png`
- `unused assets/Active_Chronicles.png`
- `unused assets/Active_Settings.png`
- `unused assets/Active_legacy.png`
- `unused assets/Inactive_Chronicles.png`
- `unused assets/Inactive_Legacy.png`
- `unused assets/Inactive_Settings.png`
- `unused assets/number_tile_dark.png`

## Checks Run

- `git status --short`: run before edits; showed prior sprite-clock/UI changes plus user-updated unused button assets.
- Asset dimension inspection: all eight unused source images and all eight public launcher destinations are `700x200`.
- Hash verification after copy: all eight public launcher destinations match their corresponding `unused assets/` source files byte-for-byte.
- `npm.cmd run tool:content-lint`: passed.
- `git diff --check`: passed with CRLF normalization warnings only.

## Behavior / Runtime Confirmation

Runtime behavior did not change. Save/account state, content JSON, schemas, combat, magic, Legacy, progression, character creator logic, save-slot behavior, launcher routing, clock logic, and sidebar button interaction wiring were untouched.

This was limited to replacing the launcher sidebar button image assets already referenced by `AppShell`.

## Risks / Follow-Up

- No browser visual QA was run; validation was asset dimension/hash plus lint/diff checks.
- The `unused assets/` source images remain modified because they are the user-provided updated source assets.
- Existing sprite-clock changes from the prior run remain in the worktree and were not modified by this asset replacement.

## Next Recommended Version

Version 0.5.31 - Launcher Browser Visual QA

## Suggested Commit Message

style(ui): replace launcher sidebar button assets
