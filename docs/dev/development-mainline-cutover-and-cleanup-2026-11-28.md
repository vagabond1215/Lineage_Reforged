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
| PRs #102 and #103 | **Closed as superseded on 2026-11-28**, NOT merged | Each PR has an explanatory disposition comment. Its unique legacy QA or visual-preview bytes remain preserved in its branch/PR history; neither was copied wholesale into master or branch-deleted |
| Other open geography, engine, Character, and Save PRs/branches | Unresolved source/evidence until individually compared | Do not mass-close or delete based on age; distinct unmerged records may still have future consumers |
| `vagabond1215/ffxi-text-rpg` | Different project, Hearth & Horizon (`0.9.500`) | Not a Lineage backup; do **not** modify or delete |
| `vagabond1215/cloudflare_artifact` | Private Codex control/mirror for separate hosted Sites source | README says actual source is on `git.chatgpt-team.site`. Do not delete until the configured Site/source and replacement workflow are checked |
| Historical owner-private `lineage-reforged-preview.vagabond1215.chatgpt.site` | Possible obsolete parallel hosted preview | No Sites control available in the GitHub Connector; do not claim deletion or deploy. Verify Site configuration and any unique assets before disabling it |
| Windows `C:\Codex` / local backup roots and sibling Git repos | Not accessible to GitHub Connector | Require a local read-only inventory, path/remote check and clean-state test; never recursive-delete by name or wildcard |

## Codex executable cleanup handoff

The approved local cleanup instructions are now checked into this repository, not dependent on a downloaded chat attachment:

- [Codex post-mainline cleanup work order](codex-post-mainline-cleanup-work-order-2026-11-28.md) contains the exact scope, repo boundaries, application/QA/backup/Sites classification process, verification and execution receipts.
- [Guarded local cleanup utility](../../scripts/dev/lineage-mainline-local-cleanup.ps1) defaults to an inventory-only dry run. Its `-Apply` mode removes only verified clean fully merged review worktrees; exact remote integration branch deletion is an additional optional flag.
- Launch Codex from `C:\Codex\EoL` after `git pull --ff-only origin master`; instruct it to follow the work order and record actual actions. Do not confuse a repo-published script with a local execution.

## Connector-only follow-up preflight (2026-11-28)

The post-merge Connector pass independently verified the already-pushed Codex cleanup commit and added a read-only, evidence-backed next-step queue, without changing application source or deleting assets:

- [Exact asset-duplicate evidence manifest](connector-asset-duplication-evidence-2026-11-28.json) pins every matched Git blob and canonical counterpart: 52 archived entries (147,672,320 logical bytes) duplicated in checked active/canonical asset trees; 36 unmatched archived entries retained; nine byte-identical active continent selected/default pairs (33,372,361 logical selected-variant bytes). Do not interpret those logical sizes as physical Git storage savings.
- [Connector branch and asset preflight](connector-post-mainline-cleanup-preflight-2026-11-28.md) classifies 7 named historical New UI branch heads as contained in `master`, versus 4 with unique unmerged history. The prior Codex dry run found **zero worktrees automatically eligible for removal** because of local ignored content/branch status.
- The root README and the historical standalone UI-preview instructions now correctly describe PR #103 as **closed without merge**, not an active draft. Their historical preview bytes and pinned art remain unchanged.

**Disposition:** connector evidence and document-pointer repairs complete; binary asset edits, worktree cleanup, and remote branch retirement require Codex validation after its local execution access is available.

## Local cleanup procedure

Use a normal PowerShell terminal on the machine that owns the local worktrees. `git -C C:\Codex\EoL worktree list --porcelain` and `git -C C:\Codex\EoL branch -vv` identify local references. Check the exact working-tree path with `git -C <path> status --porcelain=v1 --untracked-files=all`, `git -C <path> merge-base --is-ancestor HEAD origin/master`, and review ignored/untracked files before `git -C C:\Codex\EoL worktree remove <clean-fully-merged-path>`. Never use `--force` and do not prune the main checkout. The original branch refs can be retained until all named PR/evidence consumers are reconciled. Record reclaimed bytes and exact paths only after real deletion.

Audit all suspected backup repositories by their **Git remote URL, latest commit, unique files and current process usage**; do not assume a similar folder name implies duplication. Distinct projects are out of scope.

## Review checkpoints

- Read back the current `master` package scripts and GitHub PR #104 merge commit before assuming the cutover is present in any local checkout.
- Run a short *local* New UI/Classic smoke test after pulling master. This Connector has not run browser or Windows commands.
- The next main engineering milestone is the first actual World-bound Character/gameplay/Save/resume loop, rather than more preview branches.

**Cleanup status:** GitHub mainline merged and dev-start scripts consolidated. PRs #102/#103 are closed as superseded, while their source branches and unique historical evidence remain. Remote branch deletion, local folder deletion and hosted Site removal require their own validated system access. Do not report those as completed.
