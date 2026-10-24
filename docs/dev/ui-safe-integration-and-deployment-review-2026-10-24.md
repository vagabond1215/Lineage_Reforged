# UI branch integration and deployment review — 2026-10-24

## Scope and starting state

Unversioned branch-integration review from clean tracked `master`/`origin/master` `ea9dc17fa984166c5caa989275d3521f899691ae`. Pre-existing untracked detached composition directories and dependency/build artifacts were preserved. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, DEV-0.7.2.13 combat, nutrition and Save/gameplay owners remain unchanged. The user's current instruction authorizes safe integration and prefers main; it supersedes the older UI readiness prompt's blanket no-merge rule for this review, while its selected-client evidence hold remains a real safety consideration.

## Branch decision

Fetched/pruned and inspected all twelve open draft PRs #5–#16, their head/base refs, unique paths, controlling design and current source. All share old merge base `f56229dde859b9374a54368bd8a8fd2a9872daa1`. Current main already re-authored the PR #7–#16 production/test UI stack, then added the marked nutrition preview and shared notice popups. Directly merging those historical branches risks restoring stale Character, top-bar, shell and coordination files. A strategy-ours merge would falsely label unreviewed evidence and open selected-client gates as merged. **No PR head is safe for direct Git merge now.** No PR was merged, closed, retargeted, rebased or deleted.

| Retained work | Exact head | Disposition and next trigger |
| --- | --- | --- |
| #5 UI design consolidation | `8980ea3875491bf631a18926feb75f90ffa1b55f` | `HOLD_NAMED_CONSUMER`: old preflights/prompts and macro deferral need current-main reconciliation. The durable Character-first priority is re-authored in UI Boundary §23; review remaining historical records before PR supersession. |
| #6 nutrition design | `8c7f471f3e2da3e0d940c7e23e11f40527000042` | `HOLD_NAMED_CONSUMER`: metabolic units, reserves and save migration are not accepted by the visual prototype. Dedicated nutrition owner decision. |
| #7–#9 Character/top-bar/shell | #7 `8610260f`, #8 `20825cce`, #9 `69215b6f` | `HOLD_NAMED_CONSUMER`: source re-authored on main; preserve unique records/screenshots and prove selected UI/Save gates before supersession. |
| #10–#14 equipment/inventory and selection | #10 `9f390e03`, #11 `2d140c4a`, #12 `7b6dccf5`, #13 `c9581eb9`, #14 `ce2fc143` | `HOLD_NAMED_CONSUMER`: owner/presentation source re-authored on main; retain unique red-to-green records and selected action/Save hold. |
| #15–#16 dock and meters | #15 `7cb72c3d`, #16 `c6d52a7a` | `HOLD_NAMED_CONSUMER`: current source includes their presentation intent; preserve unique records and selected responsive/keyboard evidence before retirement. |
| Character Creator implementation/planning | `d7d12467` / `2cf0cb6c` | `HOLD_NAMED_CONSUMER`: distinct creator UI, shared player origins, saved identity and resource calculations need separate G9/G10-aware integration; no source subset merged here. |

All #7–#16 production paths exist on current main. Their unique historical evidence files remain on the branches; the two PR #9 app-only missing paths are controlled fixture files. Eight dirty detached UI rehearsal/composition worktrees retain uncommitted source/evidence and were not touched. Branch deletion and PR closure require named-consumer/evidence checks under the branch lifecycle policy.

## Integrated subset and deployment boundary

The only safe new integration is a **re-authored** current-main §23 addendum in `docs/design/ui-information-architecture-boundary.md`, preserving PR #5's Character-first intent while clearly recording shipped source, selected acceptance hold, marked macro prototype exception and parked owners. No stale prompt or code branch was copied. There is no new deployable UI byte from this docs-only reconciliation.

Site source `main` and saved/deployed version 6 both identify `dfb74ac9d2fc102888e43070d441ad4f820abd6d`. The Site `apps/rpg-ui/src` tree matches Lineage `master` after line-ending normalization, and version 6 deployment is `succeeded`. The 128 Character Creator images are intentionally absent from the Site archive and are resolved from pinned Lineage commit `712982fbf72b158280df0ac89dc903d3b1832ab4`; that commit's asset tree matches current main. Live image HTTP availability and authenticated selected gameplay remain unverified.

## Verification and follow-up

From `apps/rpg-ui`, the focused ten-file Character, Equipment/Inventory, responsive shell, top-bar and notice suite passed **34/34**. `npm run typecheck:node` passed and `npx vite build` passed, emitting unchanged `index-CIueNr_4.js` and `index-CqtSiWBH.css`. Broad `npm run typecheck` still exits 2 with **117 existing diagnostics**, matching the prior main baseline; this documentation-only pass introduced none. `git diff --check` passed. No new selected-client gameplay or Save/restart action was performed; the hosted browser remains at Account Login.

After main push, recheck Site source/deployment identity and redeploy saved version 6 only to fulfill the user's explicit deployment request. Do not create a duplicate saved Site version for unchanged app bytes. Apply FP-002 (do not infer acceptance from green tests), FP-008 (semantic compatibility over textual mergeability), FP-009 (exact source/deployment identity) and FP-016 (presentation placement remains selected-client held).
