# Current Codex Output

Source version/run: v0.5.4 - Tracked Artifact Hygiene Audit
Date: 2026-05-13
Branch/status assumption: `master`; worktree was clean before this read-only audit output update.

## Result

Cleanup is still needed. `.gitignore` covers the main generated/vendor paths, but Git still tracks files under all three because ignore rules do not untrack existing index entries.

Current relevant `.gitignore` entries:

- `apps/rpg-ui/node_modules/`
- `apps/rpg-ui/dist/`
- `packages/db/build/`

Tracked generated/vendor counts:

- `apps/rpg-ui/node_modules/**`: 3654 files
- `apps/rpg-ui/dist/**`: 131 files
- `packages/db/build/**`: 6 files
- Total in explicitly ignored generated/vendor paths: 3791 files

Package-lock awareness:

- `apps/rpg-ui/package-lock.json` is tracked and should be preserved.
- `apps/rpg-ui/node_modules/.package-lock.json` is tracked as part of the vendor tree and would be de-tracked by a node_modules cleanup.

Other obvious tracked generated artifacts discovered:

- `logs/rpg-ui.bootstrap.log`: 1 file
- `logs/rpg-ui.dev-server.log`: 1 file
- `scripts/logs/content_story_browser.log`: 1 file

Recommended safe cleanup prompt/command for a later implementation run:

```powershell
git rm -r --cached -- apps/rpg-ui/node_modules apps/rpg-ui/dist packages/db/build
```

Then verify the three `git ls-files` counts are zero and run `git diff --check`. Handle tracked logs in a separate scoped pass because `.gitignore` does not currently cover them.

Implementation tool recommendation: use Codex 5.5 Local for cleanup because it needs local index changes and validation. ChatGPT via GitHub Connector is suitable for tiny docs-only follow-up, not for de-tracking thousands of local files safely.

## Files Changed

- `docs/dev/current-codex-output.md`

## Checks Run

- `git status --short`: clean before audit output edit
- `Get-Content .gitignore`
- `git ls-files "apps/rpg-ui/node_modules/**" | Measure-Object`
- `git ls-files "apps/rpg-ui/dist/**" | Measure-Object`
- `git ls-files "packages/db/build/**" | Measure-Object`
- `git ls-files "*package-lock.json"`
- `git ls-files` generated/log path grouping audit
- `git branch --show-current`
- `git diff --check`: passed

## Behavior / Runtime Confirmation

Audit/output-only change. No source code, package names, package-lock files, content JSON, generated artifacts, vendor files, runtime behavior, UI behavior, save/account schema, or gameplay systems changed.

## Risks / Follow-Up

- The cleanup command must use `--cached`; without it, it would delete local files.
- `packages/db/build/.gitkeep` is currently tracked and ignored by `packages/db/build/`; decide whether the empty build directory must remain represented before cleanup.
- Removing tracked `apps/rpg-ui/dist/` may affect anyone relying on checked-in built UI artifacts rather than rebuilding locally.
- Tracked logs are still present and need a separate ignore/de-track decision if repository hygiene should cover logs too.

## Next Recommended Version

Version 0.5.5 - Tracked Artifact Cleanup Implementation

## Suggested Commit Message

docs(repo): record tracked artifact hygiene audit
