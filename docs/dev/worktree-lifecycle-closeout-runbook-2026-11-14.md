# Worktree lifecycle: creation, closeout and storage runbook

Date: 2026-11-14
Status: operational companion to [Branch Lifecycle And Integration Policy](branch-lifecycle-and-integration-policy.md), section 11

Repository: `vagabond1215/Lineage_Reforged`
Primary Windows checkout: `C:\Codex\EoL`

## Operating model

Use one primary checkout and, ordinarily, no more than two other **active
persistent task** worktrees. Prefer a short-lived detached checkout for
exact-SHA acceptance and keep its outputs in a separate retained evidence
directory before cleanup. Retain branches independently of checkouts.

Before creating a branch or worktree, record the five essentials:
**named consumer, starting SHA, edit or validation scope, closeout event,
retained evidence location**. Reuse a purpose-matched existing checkout
or branch unless isolation is essential. A new stage letter alone is not
a sufficient reason to allocate a new branch/worktree/PR.

This is not an automatic quota deletion policy. Never discard unique
or dirty work to reach a target number.

## Start-of-task preflight

From PowerShell 7:

```powershell
$Repo = 'C:\Codex\EoL'
git -C $Repo rev-parse --show-toplevel
git -C $Repo status --short --branch
git -C $Repo fetch --all --prune
git -C $Repo worktree list --porcelain
git -C $Repo branch -avv --no-abbrev
git -C $Repo count-objects -vH
```

Check GitHub for active/stacked draft PRs, protected refs and branch
consumers. For each worktree you intend to touch, inspect:

```powershell
$Wt = 'C:\Codex\<EXACT_VERIFIED_WORKTREE_PATH>'
git -C $Wt rev-parse HEAD
git -C $Wt status --porcelain=v1 --untracked-files=all
git -C $Wt ls-files --others --ignored --exclude-standard
git -C $Wt branch --show-current
```

The `ls-files --ignored` output may contain important build output,
development Saves or local evidence; do not assume it is disposable.
Check actual disk paths, junctions, symlinks, locks, process consumers,
and open editors. Commands above are inventory only.

## Working on a temporary acceptance task

Prefer an existing clean purpose-matched checkout. When an isolated
exact-SHA test is required, use a unique path **outside** the primary
repository and record it in the task handoff. Example:

```powershell
$Repo = 'C:\Codex\EoL'
$Sha = '<EXACT_SOURCE_COMMIT>'
$Wt = Join-Path $env:TEMP ('lr-check-' + $Sha.Substring(0,12))
if (Test-Path -LiteralPath $Wt) { throw 'Collision: review path exists' }
git -C $Repo worktree add --detach $Wt $Sha
if ($LASTEXITCODE -ne 0) { throw 'Cannot create detached review worktree' }
```

Carry out validation in this checkout, retain reports/screenshots outside
it, and close out only when all dependent tests and reviews are complete.
Do not use random permanent sibling folders for repeated review attempts.

## End-of-task closeout (mandatory)

1. Record exact path, branch, HEAD and reason for any retained checkout.
2. Complete every task-owned server/test/browser dependency, then stop
   only those exact task-owned processes.
3. Save required reports, hashes, preview screenshots and logs outside
   a disposable worktree, and verify their destinations.
4. Recheck status, staged/untracked/ignored files and branch/head.
5. For a **clean, unneeded** worktree with recoverable commits and no
   valuable ignored content, remove through Git without forcing:
   
   ```powershell
   git -C 'C:\Codex\EoL' worktree remove '<EXACT_VERIFIED_WORKTREE_PATH>'
   git -C 'C:\Codex\EoL' worktree list --porcelain
   ```

6. Leave dirty, locked, active, uncertain or unique checkouts untouched.
   A future explicit owner review can resolve them.
7. Record actual before/after disk usage. Confirm `master`, content
   assets and source geometry remain unchanged unless the task owned them.
8. Update the branch disposition register for changes in branch/PR state.
   Closing a local worktree **does not** close its branch or PR.

**Closeout receipt (include in each implementation handoff):**

```text
Worktree: <exact path>
Source/head: <branch and full SHA>
Disposition: REMOVED | RETAINED_ACTIVE | RETAINED_DIRTY | HELD_UNCERTAIN
Status: <tracked, staged, untracked and ignored inspection summary>
Evidence: <external retained path/URL and verification>
Consumer: <name, or 'none'>
Next review trigger: <event/date, or 'closed'>
Reclaimed: <measured bytes; do not estimate>
```

## Branch lifecycle checkpoint

- Reuse the current topic branch for successive small revisions within
  one integration lane; retain accepted source checkpoints by full SHA.
- Reinspect open PRs, merge bases, unique commits and named consumers at
  milestone transitions and every 14 calendar days while active.
- Prefer a single topic PR targeting its correct base over stacks of
  per-stage PRs when future authoring permits it. Historical stacks are
  handled by their existing review contracts.
- Branch/PR retirement follows sections 5–8 of the parent policy;
  no age-only deletion and no wildcard deletion.
- A newly created disposable maintenance branch must be merged and
  retired or explicitly registered with a consumer and review trigger;
  do not leave an empty completed maintenance branch parked indefinitely.

## Cleanup cadence and measurable outcome

Perform a light closeout after **every task** and a full inventory every
**14 calendar days** while the project is actively changing:

- Number of primary/persistent/temporary worktrees.
- Unfinished retained worktrees with exact owners.
- Disk usage of `C:\Codex\EoL`, sibling Lineage checkouts and Git objects.
- Large ignored `dist`, `node_modules`, caches and temporary reports.
- Actual bytes reclaimed, not theoretical available space.
- Active/held/draft/retirement branch counts and next review triggers.

Prior observed cleanup on 2026-11-14 reclaimed approximately 8.8 GiB
(about 8.15 GiB of ignored UI `dist` outputs from 23 clean worktrees and
about 0.7 GiB from one clean detached audit checkout); the main checkout
was reported at 42.32 GiB afterward. These are a **historical checkpoint**,
not current measurements or a claim this runbook caused that cleanup.

## Destructive-operation guardrails

Never run generic `git clean -fdx`, `git reset --hard`,
`git worktree remove --force`, mass branch deletion, force pushes,
`git gc --prune=now` or filesystem-recursive deletes as automatic
closeout steps. Avoid trying to free space by deleting active dependencies,
source PNGs/vectors, unique Saves or evidence archives. If safety cannot
be proven, preserve the target and report why.

## Responsibility boundary

- **Codex on Windows**: worktree creation/removal, local disk audit,
  runtime build-output cleanup, process/lock inspection and native tests.
- **GitHub Connector**: remote refs/PR inventory, focused docs,
  source-backed design review, integration evidence.
- **Owner**: disposition of disputed unique work, competing geography,
  canonical publication and any intentionally protected branch.
