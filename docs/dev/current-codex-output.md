# Current Codex Output

Source version/run: Version 0.5.25 - Launcher Logo And Asset Edge Polish
Date: 2026-05-13
Branch/status assumption: `master`; worktree was clean at run start before implementation.

## Result

Replaced the launcher top-left logo with the no-icon framed dark logo from `unused assets/Logo_no-icon_Dark_Framed.png`.

Copied the logo into `apps/rpg-ui/public/branding/lineage-reforged-logo-dark-no-icon-framed.png` and wired `ShellBrandLogo` to that served asset. The copied logo is 1914x822, opaque, and still renders with `object-contain` so it is not cropped, skewed, or stretched.

Created softened launcher button variants for Character, Legacy, Chronicles, and Settings. The original 700x200 public button assets remain untouched; the UI now points to `*-soft.png` variants where only background-like edge pixels were feathered. Each processed variant remains 700x200 and keeps full alpha in non-edge regions.

Updated the launcher chrome CSS so the top bar, sub bar, logo well, and sidebar use opaque dark textured layers with `background-blend-mode` over solid charcoal gradients instead of translucent overlay stacks. Added desktop-only breathing room above the first sidebar button without adding gaps between buttons.

## Files Changed

- `apps/rpg-ui/src/game-shell/components/AppShell.tsx`
- `apps/rpg-ui/src/game-shell/components/ShellBrandLogo.tsx`
- `apps/rpg-ui/src/index.css`
- `apps/rpg-ui/public/branding/lineage-reforged-logo-dark-no-icon-framed.png`
- `apps/rpg-ui/public/launcher/character-inactive-soft.png`
- `apps/rpg-ui/public/launcher/character-active-soft.png`
- `apps/rpg-ui/public/launcher/legacy-inactive-soft.png`
- `apps/rpg-ui/public/launcher/legacy-active-soft.png`
- `apps/rpg-ui/public/launcher/chronicles-inactive-soft.png`
- `apps/rpg-ui/public/launcher/chronicles-active-soft.png`
- `apps/rpg-ui/public/launcher/settings-inactive-soft.png`
- `apps/rpg-ui/public/launcher/settings-active-soft.png`
- `docs/dev/current-codex-output.md`

## Checks Run

- `git status --short`: clean at run start.
- Asset inspection before edits: new no-icon logo is 1914x822; texture is 1254x1254 and opaque; current button assets are 700x200.
- Processed asset inspection: all `*-soft.png` button variants remain 700x200, have alpha-capable PNG format, and contain sampled edge alpha below 255 while preserving max alpha 255.
- `npm.cmd run tool:content-lint`: passed.
- `node --test tests\unit\*presentation*.mjs`: passed.
- `node -e "...typescript.transpileModule(...AppShell.tsx, ShellBrandLogo.tsx...)"`: passed (`AppShell/ShellBrandLogo TSX syntax: ok`).
- `git diff --check`: passed.

## Behavior / Runtime Confirmation

Runtime behavior did not change. Save/account state, content JSON, schemas, combat, magic, Legacy, progression logic, and character creator logic were untouched.

This was limited to launcher visual assets and launcher shell styling.

## Risks / Follow-Up

- No browser visual QA was run; validation was lint/tests/syntax/diff-only.
- The button edge feathering was performed against background-like edge pixels. If the art needs a different feather width after visual review, adjust only the processed public variants or regenerate clearly named replacements.

## Next Recommended Version

Version 0.5.26 - Launcher Browser Visual QA

## Suggested Commit Message

style(ui): polish launcher logo and button edges
