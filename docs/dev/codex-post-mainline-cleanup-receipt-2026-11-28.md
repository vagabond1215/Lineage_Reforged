# Post-mainline local cleanup receipt

**Date:** 2026-11-28. **Run:** unversioned repository hygiene. **Game:** `0.1.1-prealpha`, development-only New UI mainline. **Development milestone impact:** `none`. **Game-version impact:** `none`.

The [work order](codex-post-mainline-cleanup-work-order-2026-11-28.md) ran in `C:\Codex\EoL` on `master`. Local and live remote starting heads matched at `5c61f44bb6638ca1dc9ee6ffe5cd597aea4dbc43`. The index and tracked working tree started clean. The full porcelain inventory had 397 pre-existing untracked entries, including nested worktrees and root dependencies.

## Done

- Removed the two ignored TypeScript incremental caches below. Each checkout's `typecheck:node` script names this path via `--tsBuildInfoFile`. Each file was absent from its Git index, and removal required no dependency reinstall.
  - `C:\Codex\EoL\.new-ui-mainline-20261123\.tmp-rpg-ui-node.tsbuildinfo` (62,652 bytes).
  - `C:\Codex\EoL\.new-ui-mainline-final-20261123\.tmp-rpg-ui-node.tsbuildinfo` (62,743 bytes).
- Removed the following 16 untracked files from `C:\Codex\EoL\.codex-local\new-ui-mainline-20261123` (113,891 bytes). Each had an independent, ordinary file with the same name and SHA-256 in `C:\Codex\EoL\.codex-local\new-ui-mainline-final-20261123`, the retained QA directory. The [final integration receipt](new-ui-mainline-final-acceptance-2026-11-23.md) remains in Git.
  - `a2b.exit`
  - `a2b.log`
  - `combined-build.exit`
  - `combined-build.log`
  - `dev_default.exit`
  - `dev_default.log`
  - `master-tsc.txt`
  - `migration.exit`
  - `migration.log`
  - `native_fallback.exit`
  - `native_fallback.log`
  - `no-new-hex.log`
  - `node-typecheck.log`
  - `prototype-pins.log`
  - `source-pins.log`
  - `source-tsc.txt`

All 18 removed paths were independently read back as absent. All 16 retained counterparts were read back as present. Total removed size was **239,286 logical bytes**. Allocated disk space was left unmeasured. The removal used literal file paths, rejected reparse points, and checked host process references and common preview listeners immediately before mutation. No task-owned persistent resources were launched or needed stopping. The existing Codex-owned listener on port 51760 was preserved.

## Held

| Surface | Evidence and review trigger |
| --- | --- |
| `.new-ui-mainline-20261123` and `codex/new-ui-mainline-acceptance-2026-11-23` | `427deb184a6bd1abb4665e5780f0f6238076c039` has one commit outside `origin/master`. The repository owner must reconcile that QA and rollback record and review local staging metadata before retirement. |
| `.new-ui-mainline-final-20261123`, `.new-ui-master-baseline-20261123`, and exact local/remote `codex/new-ui-mainline-final-2026-11-23` | The final checkout and ref are at merged PR head `ae74fea0a17b1ec809ec5c12fc1a22fdeb090656`. The detached baseline at `20abe83c2aa97ba4699711a9815d9b95e0d3df44` is also reachable from master. Both contain ignored Wrangler and hosting metadata. The final checkout also holds a staging build and a dependency directory. The QA/publication owner must establish retention or reproduction for those files before worktree retirement. Recheck exact ref SHA, attached worktree and named consumers before either branch deletion. |
| Other New UI review worktrees | The guard held `.functional-world-preview-20261122`, `.selected-world-creator-20261122`, `.selected-world-entry-20261123`, `.selected-world-entry-ux-20261123`, and `.selective-ui-20261122` for ignored local contents and `.world-a3b-20261122` for unmerged history. Their QA owners must reconcile each checkout against its recorded consumers and evidence. |
| PRs #102 and #103 and other refs | GitHub confirmed both closed without merge. Their source branches preserve World owner QA and visual provenance. The active PR and native-v3/geography/Classic review owners retain their existing dispositions. Review the exact head and unique source and evidence when the named consumer closes. No branch, worktree, or PR was removed or integrated. |
| Other files, local QA and adjacent folders | Retained unique screenshots, logs, the preservation patch, process ledger, dependencies, staging and deployment metadata, and historical apps and review worktrees. Sibling names were inventory only. A Lineage owner can nominate an exact path for an ownership, content, and consumer review. |
| Owner-private Sites preview and publication components | The Sites owner inventory showed the [older preview](https://lineage-reforged-preview.vagabond1215.chatgpt.site/) active. Deployment lookup confirmed a successful publish for saved version 16, with a 41-file archive at companion source `5ce989ff0a7f4e49be7d95b017854e65513686d9`. The previous versions remain visible. Current consumer activity and unique asset replacement were unverified. The Site owner must verify both and establish source and rollback retention before considering retirement. The wrapper, companion source, older preview and native-v3 staging Site were preserved. No deploy occurred. |

## Validation

- `git fetch --prune origin` exited 0. Live ref readback via `git ls-remote --heads origin` exited 0 outside the restricted network shell. `git merge-base --is-ancestor 183dea35f5b9d932693cbac24b84640ef3b7735b origin/master` exited 0. Git metadata gave the exact reviewed head as the second merge parent. GitHub confirmed #104 merged, #102 and #103 closed unmerged, and returned 79 open PRs (numbers 6–73, 76–80, and 82–87).
- Git worktree and branch inventory covered 54 worktrees, 77 local branches and 131 remote-tracking entries, including the default symbolic ref. The post-removal worktree count stayed 54 and the exact integration refs read back at the reviewed head. FP-008 governed ancestry and evidence retention. FP-009 governed the starting, accepted, and publication SHA distinctions.
- The guard's first direct invocation hit the PowerShell script execution policy. With process-scoped policy, the original script exited 1 because detached worktree records lack a `branch` property. The bounded guard fix treats the property as optional and recognizes porcelain lock and prune reasons. The corrected default dry run exited 0 with **zero eligible worktrees**. The apply and remote deletion switches were left unused.
- The access-restricted process and listener probes returned Access Denied. Host readback succeeded with no matching candidate process or listener on ports 5244, 5310, 5311, or 5173. No orphan was identified for termination.
- Literal-path removal and absence verification exited 0. Tracked config diff and launcher assertions exited 0. Root `ui:dev` selects `vite --mode new-ui-development` and `ui:dev:classic` selects bare `vite`. `git diff --check` exited 0.
- Runtime surfaces were outside this patch. The inherited combined UI build failure was recorded at 118 TypeScript diagnostics versus 119 on prior master, with zero new normalized entries. Five inherited engine sweep failures remain documented. The build, engine suite and browser smoke were left unrereun.

**Receipt commit scope:** this file, the branch register's cleanup pointer and the cleanup guard fix. **Suggested commit:** `docs(dev): record post-mainline local cleanup`. Continue Lineage development from canonical `master` toward the World-to-Character-to-playable-session-to-Save-to-resume route documented in the [cutover register](development-mainline-cutover-and-cleanup-2026-11-28.md).
