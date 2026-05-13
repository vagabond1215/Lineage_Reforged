# Current Codex Output

Source version/run: v0.5.3 - Branding / Documentation Alignment Implementation
Date: 2026-05-13
Branch/status assumption: `master`; this run started from a clean working tree and preserves historical old-branding notes outside current-facing launcher references.

## Result

Aligned safe visible/current-facing branding with `Lineage: Reforged`, renamed the root player launcher to `Play Lineage Reforged.cmd`, and updated the targeted presentation assertions.

## Files Changed

- `README.md`
- `Play Echoes of Legacy.cmd` -> `Play Lineage Reforged.cmd`
- `scripts/launch_rpg_ui.ps1`
- `apps/rpg-ui/index.html`
- `apps/rpg-ui/src/game-shell/components/ShellBrandLogo.tsx`
- `tests/unit/legacy-ledger-presentation.test.mjs`
- `CHANGELOG.md`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Checks Run

- `git status --short`: clean before edits
- `npm.cmd run tool:content-lint`: passed
- `node --test tests\unit\legacy-ledger-presentation.test.mjs`: passed after updating one stale AppShell class assertion to current source
- `git diff --check`: passed

## Behavior / Runtime Confirmation

No gameplay systems, content JSON, save/account schema, storage keys, package names, generated dist files, node_modules, or runtime logic changed. User-facing branding text changed in docs, launcher copy, browser title, and brand-logo accessibility text.

## Risks / Follow-Up

- Preserved historical `Echoes of Legacy` references in older backlog run notes by instruction.
- Root launcher rename may require users with old shortcuts to point at `Play Lineage Reforged.cmd`.
- Generated `apps/rpg-ui/dist/` was intentionally not regenerated or edited.

## Next Recommended Version

Version 0.5.4 - Tracked Artifact Hygiene Audit

## Suggested Commit Message

docs(repo): align visible branding with Lineage Reforged
