# DEV-0.7.1 Slice G1 - Clean-Epoch Transactional Account Store Extension

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-09-29. Bounded implementation slice under planned `DEV-0.7.1`, following the **Development-Only Clean Persistence Epoch Route Decision**. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted `DEV-0.7.0`; live activation, Slice C capacity, combat and parent acceptance remain held.

## Objective and pre-edit gate

Begin from synchronized `master` and complete the repository-first orientation and branch/PR review. Read the complete current prompt, handoff, output, history, planning, protocol, platform/resource policies, failure patterns, branch policy/register, focused clean-epoch decision and relevant Slice D/F evidence. Inspect current IndexedDB schema/API and actual save, profile, attempt, auth, launcher, lifecycle and App callers before selecting the exact store boundary. Record clean/dirty worktree, inspected head, version/run class, affected owner files, existing tests/build/CI, relevant failure patterns and known baseline. Preserve unrelated work.

## Bounded implementation

Create a fresh versioned IndexedDB database namespace for new-epoch authority, reusing the validated artifact/control/slot/witness transactional publication design without selecting the old `lineage.campaigns` legacy-copy/canonical database. Add the smallest typed, account-scoped transactional records and APIs that later async callers need for new account registration/profile identity, credentials, account revision/conflict detection, new-campaign attempts, and pending recovery/consumer relationships. Ensure atomic relationships are either in one transaction or have an explicit idempotent recovery rule; do not claim an atomic operation across IndexedDB and localStorage. Use an epoch-specific session/active-account hint if needed, validated against durable account authority. Preserve all accepted non-head/fork artifacts and independent Soundings first-publication witness/first artifact. Never silently default a missing or malformed retained account to a playable empty profile.

Keep this slice inert: no App/launcher/save/lifecycle cutover, hosted deployment, actual browser-storage reset, legacy import, export/import, reconciliation, old-save recovery, backward compatibility, old-bundle archaeology, two-stage writer fence, gameplay, dependency, game-version or combat change. Leave Slice E/F records inert and their historical evidence intact. If the account plus attempt/recovery transaction surface cannot be completed coherently as a small slice, commit a tested account-registration/profile/credential checkpoint and install a narrowly scoped G2 attempt/recovery prompt. Do not weaken transaction correctness to keep all surfaces in one pass.

## Acceptance and handoff

Use synthetic native-browser IndexedDB QA to prove fresh registration and exact account readback, isolated database name, profile revision conflict, duplicate/retry, close/reopen restart, transaction abort/quota/unavailable, malformed retained record, and any implemented attempt/recovery/consumer edge. Re-run the existing v1 publication and adjacent persistence/Soundings regressions; run Node typecheck, production Vite build, bounded UI typecheck with changed-file diagnostic accounting, and `git diff --check`. Report fresh versus reused evidence. Do not accept post-epoch long-run capacity or live caller behavior from helper tests.

Update focused implementation record/current output/handoff/history/planning/branch register and install the next bounded route from actual results. State applicable failure-pattern IDs, branches/PRs inspected and retained triggers. Commit, push, fetch and read back exact hosted head. No browser user data or deployment changes in this slice.
