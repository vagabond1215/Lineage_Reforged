# DEV-0.7.1 Slice G10F — Operational Epoch Cutover Decision Preflight

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-10-18. Planned parent `DEV-0.7.1`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. **G10_DURABILITY_READY; G10D_ACCEPTED_WITH_DOCUMENTED_EVICTION_LIMIT; ACTUAL_INVOLUNTARY_EVICTION_NOT_OBSERVED; ACTIVATION_HELD.** Source decision: `docs/design/dev-0.7.1-slice-g10e-independent-durability-readiness-disposition.md` at hosted `master` `d251c2c979c8debc8bdc5a56fab1a7ffd9c33a54`. Preserve the original G10D D1–D7 and fixed G10E E1–E9 evidence scopes.

## Objective and exclusions

Conduct a **documentation-only, no-operation** operational epoch cutover decision preflight, separate from G10E readiness and from execution. Synchronize authenticated local and hosted `master`; inspect worktree, current coordination, accepted G10A–E authority, failure patterns, live branches/open PRs, exact built/deployment target identities, all origins/profiles proposed for cutover, currently retained development tabs and post-cutover data boundaries. Define the exact sequence, owner, rollback and backup responsibilities for closing old tabs, deploying/relaunching the validated epoch build, and any one-time clearing of **only pre-cutover** disposable development site data before first new-epoch launch. Identify any environment or product decision that cannot be derived from existing authority. Do not call `persist()` denial or successful archive restore observed browser eviction.

Publish a bounded decision record distinguishing what is already authorized from what still requires an explicit owner decision for a later operational run. Verify source/hosted identity, docs diff, branch/PR dispositions and relevant failure-pattern coverage; update current output, handoff, historical/planning route and prompt only for the resulting next step, then commit/push and independently read back hosted files. If a required origin/profile, backup, deployment or rollback fact is unavailable, leave cutover held on the smallest exact blocker. A readiness result alone does not authorize destructive clearing or deployment.

Do **not** deploy, activate, close user tabs, clear site/profile/user data, create new live accounts, accept planned `DEV-0.7.1`, change `GAME_VERSION`, integrate held branches, or rerun G10B–E browser stress/fault/capacity work in this preflight. Do not modify production code. Any later operational cutover and any Game-version decision require separate explicit routing and authorization.
