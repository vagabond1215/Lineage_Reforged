# Current Codex Output

Source version/run: Version 0.5.23 - Launcher Button Asset Integration
Date: 2026-05-13
Branch/status assumption: `master`; worktree was clean at run start before implementation.

## Result

Integrated the manually cropped launcher button assets and dark texture asset into the RPG UI launcher shell.

The launcher sidebar now renders image-backed Character, Legacy, Chronicles, and Settings buttons while preserving the existing section ids, click handlers, disabled behavior, `aria-label`, and `aria-current` behavior. Normal state uses the inactive asset; active, hover, and keyboard focus-visible states use the active asset. The 700x200 button ratio is preserved with a 7:2 aspect-ratio wrapper and `object-fit: contain`.

The top launcher menu bar now uses the copied dark texture asset through the shell chrome token, and the sub bar uses the same texture with a darker overlay. The existing top-left Lineage: Reforged logo asset and sizing were not changed.

## Files Changed

- `apps/rpg-ui/src/game-shell/components/AppShell.tsx`
- `apps/rpg-ui/src/index.css`
- `apps/rpg-ui/public/launcher/character-inactive.png`
- `apps/rpg-ui/public/launcher/character-active.png`
- `apps/rpg-ui/public/launcher/legacy-inactive.png`
- `apps/rpg-ui/public/launcher/legacy-active.png`
- `apps/rpg-ui/public/launcher/chronicles-inactive.png`
- `apps/rpg-ui/public/launcher/chronicles-active.png`
- `apps/rpg-ui/public/launcher/settings-inactive.png`
- `apps/rpg-ui/public/launcher/settings-active.png`
- `apps/rpg-ui/public/launcher/dark-background.png`
- `docs/dev/current-codex-output.md`

## Checks Run

- `git status --short`: clean at run start; final status shows only the intended modified/new files.
- Asset inspection: confirmed the eight source button assets are 700x200 and the copied background asset is 1254x1254.
- `npm.cmd run tool:content-lint`: passed.
- `node --test tests\unit\*presentation*.mjs`: passed.
- `node -e "...typescript.transpileModule(...AppShell.tsx...)"`: passed (`AppShell TSX syntax: ok`).
- `git diff --check`: passed.
- `npx.cmd tsc --noEmit -p apps/rpg-ui/tsconfig.json`: failed before checking code because `npx` attempted a registry request and hit `UNABLE_TO_VERIFY_LEAF_SIGNATURE`.
- `.\apps\rpg-ui\node_modules\.bin\tsc.cmd --noEmit -p apps/rpg-ui/tsconfig.json`: ran locally but failed on existing unrelated repo-wide type errors outside the touched launcher files; the earlier `AppShell.tsx` syntax issue was fixed and the narrow TSX syntax check passes.

## Behavior / Runtime Confirmation

Runtime behavior did not change. Save/account state, content JSON, schemas, combat, magic, Legacy, progression logic, and character creator logic were untouched.

The launcher button integration is presentation-only and uses served assets from `apps/rpg-ui/public/launcher/`, not the root `unused assets` folder.

## Risks / Follow-Up

- No browser visual QA was run in this pass; validation was lint/tests/syntax/diff-only.
- The repo-wide app TypeScript check remains blocked by pre-existing unrelated type errors, so the narrow `AppShell.tsx` syntax check was used to validate the touched TSX render path.

## Next Recommended Version

Version 0.5.24 - Launcher Asset Browser Visual QA

## Suggested Commit Message

style(ui): integrate launcher button assets
