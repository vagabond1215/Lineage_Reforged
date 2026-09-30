# DEV-0.7.1 Slice G2 - Clean-Epoch Attempt And Recovery Transactions

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-09-29. Bounded implementation slice under planned `DEV-0.7.1`, following the **Development-Only Clean Persistence Epoch Route Decision** and the G1 account-store checkpoint. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted `DEV-0.7.0`; live activation, Slice C capacity, combat and parent acceptance remain held.

## Objective and pre-edit gate

Begin from synchronized `master` and complete the repository-first orientation and branch/PR review. Read the complete current prompt, handoff, output, history, planning, protocol, platform/resource policies, failure patterns, branch policy/register, focused clean-epoch decision, G1 record and relevant Slice D/F evidence. Inspect the G1 account schema and the current new-campaign attempt, save-publication recovery/consumer, account profile and real caller paths. Record clean/dirty worktree, inspected head, version/run class, affected owners, focused QA, relevant failure patterns and the broad typecheck baseline. Preserve unrelated work.

## Bounded implementation

Extend the **new** `lineage.campaigns.epoch1` database only. Add typed, validated new-campaign attempt and pending publication recovery/consumer records with exact account, slot, campaign, artifact, publication and attempt relationships. Account-plus-slot is the contention scope: a second campaign or regenerated attempt cannot silently replace a pending destination. Define prepared/accepted/completed transitions, expected account/head revision checks and transaction or idempotent retry rules before writing. Preserve independent first Soundings witness/first artifact, non-head/fork history and complete profile/Chronicle/Legacy state. A missing or malformed retained account, attempt, recovery, consumer or referenced artifact must block the operation with a named result, never default or mint a new identity. Do not expose an unguarded clean-epoch publication API.

Keep this slice inert: no App/launcher/save/lifecycle cutover, hosted deployment, actual browser-storage reset, legacy import/reconciliation, old-save export/import or recovery, backward compatibility, old-bundle archaeology, two-stage writer fence, gameplay, dependency, game-version or combat change. Leave Slice E/F records inert. If attempt preparation and publication-recovery completion cannot fit one coherent `S` transaction package, deliver a tested account-slot attempt checkpoint and install the narrow recovery successor; do not weaken atomicity or conflate pending with accepted authority.

## Acceptance and handoff

Use synthetic native-browser IndexedDB QA for same-source retry, regenerated-attempt collision, multiple campaigns contending for one account slot, failure before and after durable steps, transaction abort/quota, close/reopen, lost caller state, malformed/missing links, stale account/head, and compatible recovery completion where implemented. Re-run G1 account and v1 publication QA plus adjacent persistence/Soundings regressions; run Node typecheck, production Vite build, bounded UI typecheck with changed-file diagnostic accounting and `git diff --check`. Report fresh versus reused evidence. Helper QA does not accept live caller behavior or long-running capacity.

Update focused implementation record/current output/handoff/history/planning/branch register and install the next bounded route from actual results. State applicable failure-pattern IDs, branches/PRs inspected and retained triggers. Commit, push, fetch and read back exact hosted head. No browser user data or deployment changes in this slice.
