# Current Codex Output

Source version/run: Launcher Sidebar Button Scale And Background Softening
Date: 2026-05-13
Branch/status assumption: `master`; worktree already contained the prior uncommitted framed-logo changes plus the user-provided untracked `unused assets/Logo_Dark_Frame.png` at run start.

## Result

Reduced the launcher sidebar image button rendering by 25%.

Desktop launcher art buttons now render at 75% of the sidebar rail width while preserving the existing 7:2 aspect-ratio wrapper and non-distorting `object-fit: contain` behavior. The mobile/base button width was reduced from 12rem to 9rem with matching max-width reduction.

Softened the sidebar textured background by reducing the dark overlay opacity and lowering the side rail inset/ambient shadow strength so the buttons blend more naturally with the textured background image.

## Files Changed

- `apps/rpg-ui/src/index.css`
- `docs/dev/current-codex-output.md`

Existing uncommitted files from the prior logo swap remain present and were not reverted:

- `apps/rpg-ui/src/game-shell/components/AppShell.tsx`
- `apps/rpg-ui/src/game-shell/components/ShellBrandLogo.tsx`
- `apps/rpg-ui/public/branding/lineage-reforged-logo-dark-framed.png`
- `unused assets/Logo_Dark_Frame.png`

## Checks Run

- `git status --short`: run before edits; showed the prior uncommitted framed-logo changes.
- `npm.cmd run tool:content-lint`: passed.
- `node --test tests\unit\*presentation*.mjs`: passed.
- `git diff --check`: passed.

## Behavior / Runtime Confirmation

Runtime behavior did not change. This was launcher visual styling only.

No save/account state, content JSON, schemas, combat, magic, Legacy, progression logic, character creator logic, or image files were changed in this follow-up.

## Risks / Follow-Up

- No browser visual QA was run; validation was lint/tests/diff-only.
- The 75% sizing is CSS-rendered only. The source button assets remain unchanged.

## Next Recommended Version

Version 0.5.25 - Launcher Browser Visual QA

## Suggested Commit Message

style(ui): soften launcher sidebar button scale
