# Codex work order: consolidate Lineage development mainline and retire redundant local work

**Run type:** unversioned repository hygiene, post New UI mainline integration. **Authorized:** owner explicitly requested cleanup on 2026-11-28. **Scope:** `vagabond1215/Lineage_Reforged` and demonstrably owned, disposable local artifacts from its former integration/testing work. **Primary repository:** `C:\Codex\EoL`. **Target branch:** current `origin/master`. **Current game posture:** pre-alpha and not live; prior test accounts/Characters/Saves are not a compatibility gate.

## Verified starting point (revalidate live before using)

- [PR #104](https://github.com/vagabond1215/Lineage_Reforged/pull/104) merged exact reviewed head `ae74fea0a17b1ec809ec5c12fc1a22fdeb090656` into `master` at `183dea35f5b9d932693cbac24b84640ef3b7735b`.
- Normal `npm run ui:dev` now selects Vite mode `new-ui-development`. `npm run ui:dev:classic` remains an explicit Classic launcher. This is **not a public production deployment**.
- Legacy PRs #102/#103 were closed as **superseded but not merged**; their unique source/QA history and source branches were deliberately retained.
- The combined `npm run ui:build` is **still failing** on the known inherited TypeScript baseline. The reviewed integrated candidate had 118 diagnostics versus 119 on the prior master, with zero new normalized entries. No change should portray this as green.
- Read the [mainline cutover/cleanup register](development-mainline-cutover-and-cleanup-2026-11-28.md), repository `AGENTS.md`, [repository-first protocol](repository-first-agent-work-protocol.md), current handoff and branch lifecycle/disposition policy. Prior PR #104 `MERGE_HELD` instructions are historical, not a reason to reopen this integration.

## Execution contract

**Goal:** eliminate genuinely redundant local New UI integration worktrees, duplicate/temporary testing files, orphaned preview processes, backup folders, and any verified unnecessary associated Git refs or Sites artifacts, so ordinary development continues only from canonical mainline. Do not substitute an audit-only report if plainly safe and authorized cleanup can be performed, but never guess ownership or irrelevance.

1. **Synchronize and identify**: from an authenticated `C:\Codex\EoL` checkout, inspect `git status --porcelain=v1 --untracked-files=all`, `git remote -v`, `git fetch --prune origin`, `git rev-parse origin/master`, `git worktree list --porcelain`, `git branch -vv`, active processes and listening ports. Confirm the exact accepted PR #104 merge is an ancestor of `origin/master`. Do not reset/discard dirty working changes or overwrite other worktrees.
2. **Use the checked-in guard script**: inspect `scripts/dev/lineage-mainline-local-cleanup.ps1`; execute its default dry run with `-RepoRoot 'C:\Codex\EoL'`. Review each eligible path against the real Git index, ignored/untracked evidence, any local process usage, ancestry and linked PR/history. After reconciling its verdict, use `-Apply` only for clean, fully merged, no-dependent review worktrees. Do not use `--force`, `git clean -fdx`, sweeping `Remove-Item -Recurse`, or delete a path because its name merely looks old.
3. **Remote/local branch retirement**: the script supports `-Apply -DeleteMergedRemoteIntegrationBranch` for the single exact former PR #104 branch, and refuses if its SHA has changed. You may use it **after** worktree and provenance verification. Delete only provably fully merged, non-protected local branch names using `git branch -d`, not `-D`. Other branches remain held until their unique content and current consumers are reconciled. No bulk remote deletion or force-push.
4. **Inventory and reclaim local-only artifacts**: examine Lineage-owned `.codex-local`, historical browser screenshots/logs, generated build/cache outputs, test ports, preview servers, adjacent copies/backups, and candidate root folders. For each proposed deletion, establish exact canonical path, originating command/checkout, whether content is reproducible or uniquely evidentiary, whether any process or project references it, and approximate reclaimable bytes. It is acceptable to remove only proven redundant/generated data; distinguish optional dependency caches from unique untracked evidence. Never remove shared scripts, credentials, sources, ignored records containing potentially unique data, pinned source manifests/history, or unrelated projects.
5. **Other repositories and Sites**: examine only what is in scope under the repository's scope-isolation policy. A sibling folder is **not** automatically a Lineage backup. `vagabond1215/ffxi-text-rpg` is a separate game and must not be accessed/changed through this project. The private `cloudflare_artifact` repository and `git.chatgpt-team.site` Site source are separate publication components: do not modify/delete them without proper source-specific authority and verified dependency replacement. Determine whether the older `lineage-reforged-preview.vagabond1215.chatgpt.site` is still used and whether any deployed/unique assets depend on it. If actual Site-management access is unavailable, report that as **not cleaned**; no invented closure. Do not deploy.
6. **Validate then report**: verify primary checkout remains clean or intentionally changed by a bounded documentation receipt; `origin/master` includes the merge and current mainline, no protected refs or source pins were affected, and current `ui:dev` / `ui:dev:classic` launch routes remain configured. Do a focused local smoke only when a relevant surface was changed; don't rerun the whole Chromium matrix just to clean artifacts. Keep any inherited TypeScript and engine failures explicitly marked.
7. **Record actual outcomes** in a focused dated receipt under `docs/dev`: exact deleted paths/branches/Sites (if any), SHA and diff checks, bytes reclaimed, skipped/blocked paths and owners, processes stopped, any remaining active duplicates and why, validation commands with actual exit codes. Update current Codex output/handoff/branch register only as needed to eliminate false active-work pointers. Commit/push only bounded source-of-truth updates to the intended branch; no broad unrelated code changes.

## Exact utility invocations (PowerShell)

```powershell
Set-Location 'C:\Codex\EoL'
git fetch --prune origin
.\scripts\dev\lineage-mainline-local-cleanup.ps1 -RepoRoot 'C:\Codex\EoL'

# Only AFTER classifying the dry-run candidates and verifying no live owners:
.\scripts\dev\lineage-mainline-local-cleanup.ps1 -RepoRoot 'C:\Codex\EoL' -Apply

# Optional exact merged integration branch retirement, after independent SHA confirmation:
.\scripts\dev\lineage-mainline-local-cleanup.ps1 -RepoRoot 'C:\Codex\EoL' -Apply -DeleteMergedRemoteIntegrationBranch
```

**Completion contract:** Report **DONE** only for completed and independently verified removals. For each inaccessible or ambiguous local folder, separate repository, remote branch, and Site, report **HELD** with a concrete next owner/action. Do not claim that old experimental account data must be preserved for production compatibility; do preserve source-of-truth code, provenance and secrets. No production deployment, no bulk deletion and no incidental changes to a different project.
