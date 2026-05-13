# Current Codex Output

Source version/run: Version 0.5.26 - Launcher Texture Balance And Button Edge Blend
Date: 2026-05-13
Branch/status assumption: `master`; worktree was clean at run start before implementation.

## Result

Rebalanced the launcher chrome so the top bar, logo well, and sidebar show more of the dark texture instead of reading as flat black.

The top bar and sidebar now use lighter solid dark gradients with `overlay` blending so the texture is visibly present while remaining opaque. The secondary top bar remains darker and recessed through `multiply` blending and layered inset shadows rather than a hard border line.

Regenerated the existing public `*-soft.png` launcher button variants from the original 700x200 public button assets with stronger edge-background feathering. The button art paths and behavior did not change; active/inactive/hover/focus still use the existing soft variant names already wired in the launcher.

## Files Changed

- `apps/rpg-ui/src/index.css`
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
- Processed asset inspection: all regenerated `*-soft.png` variants remain 700x200, preserve max alpha 255, and sampled interior pixels remain fully opaque while sampled edge/background pixels include alpha below 255.
- `npm.cmd run tool:content-lint`: passed.
- `node --test tests\unit\*presentation*.mjs`: passed.
- `git diff --check`: passed.

## Behavior / Runtime Confirmation

Runtime behavior did not change. Save/account state, content JSON, schemas, combat, magic, Legacy, progression logic, and character creator logic were untouched.

No launcher layout, logo sizing, save slot rows, account controls, or in-game navigation were changed.

## Risks / Follow-Up

- No browser visual QA was run; validation was lint/tests/diff-only.
- The edge blending is image-processed against edge/background-like pixels. If visual review shows the feather should be wider or narrower, adjust only the `*-soft.png` variants.

## Next Recommended Version

Version 0.5.27 - Launcher Browser Visual QA

## Suggested Commit Message

style(ui): balance launcher texture and button edges
