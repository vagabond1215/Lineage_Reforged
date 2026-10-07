# DEV-0.7.1.10 — F9 Selected Deletion Intent Change Repair

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-10-07. Support repair of planned `DEV-0.7.1`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`. Begin from freshly fetched and independently read-back hosted `master` containing the `DEV-0.7.1.9` audit. `G9_PARENT_REPAIR_REQUIRED`; G10, deployment, planned-primary and Game-version acceptance remain held.

## Objective

Repair only F9 from `docs/design/dev-0.7.1.9-g9-lifecycle-parent-independent-reaudit.md`: after a submitted selected picker delete commits but its acknowledgement is lost, changing picker selection away and back currently reuses the old request ID and claims the old tombstone as success. A changed selected action must not claim it; an unchanged exact retry after uncertain acknowledgement must still work.

## Required work

- Complete repository-first orientation on hosted `master`: worktree/head, fetch/prune, branches/open PRs, current prompt/output/handoff/planning/historical routing, G9A–F authority, F8 repair and F9 independent audit, relevant FP-001/002/003/004/005/006/008/009/011/012/014/015/017/018/019, production owner/adapter/selected-App picker and Settings paths, tests/build/CI/generated boundaries. Preserve unrelated work.
- Reproduce F9 in the actual selected `EpochApp` before production edits using the independent red `g9-parent-selected-20261007.html?mode=changed-selection` mode. Capture the committed tombstone, changed selection and second-click presentation. Verify target and other-account bytes are unchanged on the false-success path.
- Select the smallest selected-action intent identity or invalidation boundary. Retain the first submitted delete request only while the same selected action remains eligible for exact retry. Leaving that picker selection and returning must create a different request, even if account/revision/generation/password match. A changed password or switched account must likewise not claim a prior tombstone. Keep picker and Settings semantics coherent; do not weaken owner/adapter version-2 tombstone binding or version-1 compatibility.
- Add focused red-to-green actual selected-App checks for selection-away/back, another account, changed password, pre-submit external delete in picker and Settings, exact lost-post-commit-acknowledgement retry in both, stale reset/ordinary revision, wrong current password, second owner competing request and no newer-account mutation. Keep owner restart/two-owner, malformed/legacy tombstone, quota/abort and exact-request retry controls. The independent F9 file may be adapted as repair regression after recording the pre-edit failure; it is not parent-acceptance evidence.
- Run native G9F and adjacent G9B–E/first/descendant/witnessed suites, focused campaign/Soundings Node tests, Node UI-config typecheck, app-local Vite build, broad UI baseline, diff check, branch/PR review. Record exact commands/counts and distinguish existing broad diagnostics from changed paths.
- If the narrow repair passes, record `F9_REPAIR_VERIFIED; INDEPENDENT_G9_PARENT_REAUDIT_REQUIRED`, install a separate fresh parent re-audit, update focused repair record/current output/handoff/prompt/planning/historical/branch routing, commit/push and independently read back hosted `master`. If repair fails, record the blocker and keep G9/G10 held. A repair suite must never declare `G9_PARENT_ACCEPTED`.

No G10 implementation, unrelated owner refactor, new production dependency, tracked generated output, deployment, planned-primary acceptance or Game-version change in this repair.
