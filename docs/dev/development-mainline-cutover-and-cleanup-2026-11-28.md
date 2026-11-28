# New UI development mainline cutover and cleanup register

**Date:** 2026-11-28. **State:** `MAINLINE_MERGED / NEW_UI_DEV_DEFAULT / PROD_UNPUBLISHED`.
This is the current source-of-truth update for the November New UI integration, superseding older `MERGE_HELD` and “branch remains local” instructions *for PR #104 only*. Prior reports are historical evidence, not active work orders. The owner confirmed this is pre-alpha, has no active users or production gameplay data to preserve, and authorized immediate development integration and a bounded cleanup of obsolete parallel work.

## Completed, verified

- PR [#104](https://github.com/vagabond1215/Lineage_Reforged/pull/104) was merged via GitHub into `master` as merge commit `183dea35f5b9d932693cbac24b84640ef3b7735b`, incorporating reviewed exact head `ae74fea0a17b1ec809ec5c12fc1a22fdeb090656`.
- Following the merge, `apps/rpg-ui/package.json` `dev` now uses `vite --mode new-ui-development` (commit `eec9358b0160f3a93a52401bc8f0f86af9746a68`). `dev:classic` retains bare Vite; root `ui:dev:classic` exposes it (commit `fbdcf0669212bf4d0c015b246dd88df5cb14b3b6`). Ordinary `npm run ui:dev` is New UI development presentation. The built-in functional World creation path remains the separate compiled loopback `world-owner-review` mode, not production.
- The previous Connector review confirmed 9/9 v4 successor blob pins, 7/7 archived source remaps, unchanged historical manifests and no detected owner-bound publication regression. The published PR and Codex receipts attest to wider 55/55 pins, exact genesis equivalence, disposable v7→v8 migration and v8 Classic Save continuation; those executable tests were not rerun in the Connector.
- `npm run ui:build` still **fails** on the documented inherited TypeScript diagnostics, with the exact reviewed candidate at 118 versus the previous master at 119 and zero new normalized entries. The development-only exception does not make CI green. Five inherited engine sweep failures remain documented separately. Do not erase or distort those facts.

## Current development posture

1. Use the canonical `master` for forward development. New UI is the normal developer presentation; Classic is an explicit fallback. Prior integration branch/PR #104 is historical and must not be reused as a new feature base.
2. The owner deprioritized *experimental local account, Character and Save compatibility*. It is acceptable to start a **new disposable browser profile/origin** for development. Never silently delete browser profiles, overwrite an existing database, or present deletion as necessary for this merge. Once an origin has v8 IndexedDB, use a v8-capable build on that origin.
3. Prior production, hosted account sync, public World creation and durable World-bound Character/native-v3 Save publication are not automatically activated by the merge. Complete real World→Character→playable gameplay→Save→resume ownership as the next product milestone, not an additional browser preview track.
4. Source pin files, source manifests and verification infrastructure are *not* disposable test data. Do not delete pinned historical source, provenance, authored geographic datasets, unmatched source assets or migration fixtures simply because an old experimental account can be discarded.

## Cleanup inventory and classifications

| Surface | Classification | Action and evidence |
| --- | --- | --- |
| Old `MERGE_HELD` instructions for PR #104 in “current” documents | Superseded pointers | Override via this register and a current-top note; retain prior dated entries as historical records |
| `codex/new-ui-mainline-final-2026-11-23` and intermediate New UI worktrees | Merged implementation, potential local copies | Candidate to remove *only after* verifying exact `origin/master` ancestry, clean worktree, no running process, and no untracked/ignored evidence; never `--force` |
| `.codex-local/new-ui-mainline-final-20261123`, Chromium shots/logs, throwaway temp output | Potential redundant QA artifacts | Inspect owner, size and cross-links first. May be removed after confirming needed acceptance is recorded in Git; do not delete entire shared `.codex-local` |
| PRs #102 and #103 | Retained distinct World-owner/prototype provenance | Keep until their unique unmerged source/evidence is reconciled; not automatically merged or closed by #104 |
| Other open geography, engine, Character, and Save PRs/branches | Unresolved source/evidence until individually compared | Do not mass-close or delete based on age; distinct unmerged records may still have future consumers |
| `vagabond1215/ffxi-text-rpg` | Different project, Hearth & Horizon (`0.9.500`) | Not a Lineage backup; do **not** modify or delete |
| `vagabond1215/cloudflare_artifact` | Private Codex control/mirror for separate hosted Sites source | README says actual source is on `git.chatgpt-team.site`. Do not delete until the configured Site/source and replacement workflow are checked |
| Historical owner-private `lineage-reforged-preview.vagabond1215.chatgpt.site` | Possible obsolete parallel hosted preview | No Sites control available in the GitHub Connector; do not claim deletion or deploy. Verify Site configuration and any unique assets before disabling it |
| Windows `C:\Codex` / local backup roots and sibling Git repos | Not accessible to GitHub Connector | Require a local read-only inventory, path/remote check and clean-state test; never recursive-delete by name or wildcard |

## Local cleanup procedure

Use a normal PowerShell terminal on the machine that owns the local worktrees. `git -C C:\Codex\EoL worktree list --porcelain` and `git -C C:\Codex\EoL branch -vv` identify local references. Check the exact working-tree path with `git -C <path> status --porcelain=v1 --untracked-files=all`, `git -C <path> merge-base --is-ancestor HEAD origin/master`, and review ignored/untracked files before `git -C C:\Codex\EoL worktree remove <clean-fully-merged-path>`. Never use `--force` and do not prune the main checkout. The original branch refs can be retained until all named PR/evidence consumers are reconciled. Record reclaimed bytes and exact paths only after real deletion.

Audit all suspected backup repositories by their **Git remote URL, latest commit, unique files and current process usage**; do not assume a similar folder name implies duplication. Distinct projects are out of scope.

## Review checkpoints

- Read back the current `master` package scripts and GitHub PR #104 merge commit before assuming the cutover is present in any local checkout.
- Run a short *local* New UI/Classic smoke test after pulling master. This Connector has not run browser or Windows commands.
- The next main engineering milestone is the first actual World-bound Character/gameplay/Save/resume loop, rather than more preview branches.

**Cleanup status:** GitHub mainline merged and dev-start scripts consolidated. Remote branch/PR retirement, local folder deletion and hosted Site removal require separate evidence from their corresponding systems. Do not report those as completed.
