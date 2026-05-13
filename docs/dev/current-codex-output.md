# Current Codex Output

Source version/run: v0.5.6 - Tracked Log Hygiene Audit
Date: 2026-05-13
Branch/status assumption: `master`; worktree was clean before the audit and remained clean after read-only audit commands.

## Result

Cleanup is needed in a follow-up implementation run. Git still tracks 9 log/runtime-output files, and `.gitignore` currently has no log/temp ignore coverage.

## Current .gitignore Log/Temp Coverage

Current relevant entries only cover generated/vendor output:

- `apps/rpg-ui/node_modules/`
- `apps/rpg-ui/dist/`
- `packages/db/build/`

No current `.gitignore` entries cover `*.log`, `logs/`, `scripts/logs/`, `tmp*`, `temp*`, or similar local runtime/scratch output.

## Tracked Log/Temp Candidates

Safe log/runtime-output cleanup candidates:

- `apps/rpg-ui/codex-character-dev.err.log`
- `apps/rpg-ui/codex-character-dev.out.log`
- `apps/rpg-ui/codex-vite-dev.err.log`
- `apps/rpg-ui/codex-vite-dev.out.log`
- `apps/rpg-ui/codex-vite-dev2.err.log`
- `apps/rpg-ui/codex-vite-dev2.out.log`
- `logs/rpg-ui.bootstrap.log`
- `logs/rpg-ui.dev-server.log`
- `scripts/logs/content_story_browser.log`

Preserve `*log*` false positives that are source, docs, assets, or authored content:

- catalog/source files such as `characterCreationCatalog.*`, `worldSelectionCatalog.*`, `crystal_catalog.json`, and schema/content catalog files
- `apps/rpg-ui/public/branding/lineage-reforged-logo-dark.png`
- `docs/future_content_backlog.md`
- `story/continuity/canon_log.md`

Ambiguous temp-like tracked files needing explicit approval before cleanup:

- `.tmp_debug.ps1`
- `temp_goods.txt`
- `tmp_update_guilds_and_settlements.ps1`
- `scripts/tmp_migrate_flora.ps1`

## Recommended Follow-Up

Next implementation should add log ignore coverage and remove only the 9 safe log/runtime-output files from Git tracking with `--cached`.

Recommended `.gitignore` additions:

```gitignore
# Logs and local runtime output
*.log
logs/
scripts/logs/
```

Recommended cleanup command:

```powershell
git rm --cached -- apps/rpg-ui/codex-character-dev.err.log apps/rpg-ui/codex-character-dev.out.log apps/rpg-ui/codex-vite-dev.err.log apps/rpg-ui/codex-vite-dev.out.log apps/rpg-ui/codex-vite-dev2.err.log apps/rpg-ui/codex-vite-dev2.out.log logs/rpg-ui.bootstrap.log logs/rpg-ui.dev-server.log scripts/logs/content_story_browser.log
```

Do not remove or ignore temp-like scripts/text files until a separate approval confirms they are disposable.

## Files Changed

- `docs/dev/current-codex-output.md`

## Checks Run

- `git status --short`: clean before audit
- `Get-Content .gitignore`
- `git ls-files "*log*"`
- `git ls-files "logs/**"`
- `git ls-files "scripts/logs/**"`
- `git ls-files "*.tmp" "*.temp" "*.cache" "*.bak" "*.old"`
- Additional tracked temp/log pattern scans for `tmp`, `temp`, and `.log`
- `git status --short`: clean after read-only audit commands
- `git diff --check`: passed

## Behavior / Runtime Confirmation

Audit/output-only change. No source code, `.gitignore`, package names, package-lock files, README, CHANGELOG, backlog, content JSON, generated/vendor files, logs, runtime behavior, UI behavior, save/account schema, or gameplay systems changed.

## Risks / Follow-Up

- A later cleanup must use `git rm --cached`, not a filesystem delete, to preserve local log files if they are still useful.
- Broad `*.log` ignore coverage is appropriate for local runtime logs but should not be confused with authored docs that contain `log` in the filename.
- Temp-like tracked scripts/text may be obsolete scratch artifacts, but they should be handled only after explicit approval.

## Next Recommended Version

Version 0.5.7 - Tracked Log Cleanup Implementation

## Suggested Commit Message

docs(repo): record tracked log hygiene audit
