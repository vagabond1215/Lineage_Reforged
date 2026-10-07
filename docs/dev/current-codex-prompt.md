# DEV-0.7.1.8 — F8 Exact Selected Deletion Request Repair

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-10-07. Support repair of planned `DEV-0.7.1`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`. Begin from freshly synchronized hosted `master` and the exact `DEV-0.7.1.7` independent audit `docs/design/dev-0.7.1.7-g9-lifecycle-parent-independent-reaudit.md`. G9 parent, G10 activation, deployment, planned-primary and Game-version acceptance remain held.

## Objective

Repair only F8: a selected picker or Settings delete that has **not yet been submitted** can claim another owner's matching deletion tombstone as successful. Keep exact lost-post-commit-acknowledgement retry working. Do not begin G10 or declare G9 parent accepted from repair tests.

## Required work

- Complete repository-first orientation: fetch/prune, clean source/worktree, all branches and open PRs, current prompt/output/handoff/planning/historical/branch routing, G9A–F authority and F1–F8 records, relevant failure patterns, manifests, selected `EpochApp` caller and account owner/adapter paths, tests/build/CI and generated/mirror boundaries. Preserve unrelated work.
- Reproduce F8 through **actual selected `EpochApp`** picker and Settings before edits: observe an account, have a second owner delete it at that revision/generation before the first selected delete submission, then click delete. Record that the UI currently clears as success with no error. Pair with valid lost-acknowledgement exact retry and stale revision/generation/wrong-password controls.
- Make a minimal complete fix across the durable deletion request/receipt owner, adapter and selected callers as required. A tombstone matching only account ID, kind, revision and generation must not prove this selected caller submitted the delete. Bind success to an exact stable request identity and retain the originally submitted request for an uncertain post-commit retry; before any first submission, an absent account is stale/unavailable. A changed request, wrong identity, wrong generation, stale selection, malformed tombstone or unverified credential must fail closed. Preserve valid retry through restart/two owners where the accepted contract permits it, and preserve reset/session generation fences. Do not mask failure with UI-only text or treat a fresh later click as the original request unless exact original request state is retained and proved.
- Add durable owner and actual selected-App regression coverage: picker and Settings pre-submit external deletion, same-generation competing delete, changed request, exact lost acknowledgement, restart/two-owner retry, fresh and wrong-password deletion, stale picker after reset/revision change, malformed/missing tombstone and abort/quota/readback. Explicitly assert no manufactured success, no newer account deletion, no unintended storage mutation and precise error/recovery presentation. Reconcile any receipt version/schema compatibility and existing retained v7 accounts without fabricating old request identity.
- Run native G9B–F and adjacent owner suites, focused campaign/Soundings Node tests, Node UI-config typecheck, app-local Vite build, broad UI baseline, diff check, and branch/PR lifecycle review. Label synthetic accounts as synthetic. Record exact results and limitations.
- If repair passes, write a focused F8 repair record, update current output/handoff/prompt/planning/historical/branch routing as applicable, commit/push and independently read back hosted `master`. Install a **new independent G9 parent re-audit**; its source must be the repaired hosted head and its design must come from G9A–F authority rather than the repair suite. If repair cannot be proved, keep a narrow blocked route and G10 held. Do not implement G10 or declare `G9_PARENT_ACCEPTED` in this repair run.

No unrelated owner refactor, new production dependency, G10 implementation, deployment, tracked generated output, planned-primary acceptance or Game-version change.
