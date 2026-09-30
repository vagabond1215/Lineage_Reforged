# DEV-0.7.1 Slice G3 - Clean-Epoch Publication Recovery And Consumer Transactions

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-09-29. Bounded implementation successor to the **Development-Only Clean Persistence Epoch Route Decision** and the G2 account-slot attempt checkpoint. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted `DEV-0.7.0`; live activation, Slice C capacity, combat and parent acceptance remain held.

## Pre-edit gate

Begin from synchronized `master`; complete repository-first orientation and branch/PR review. Read current prompt, handoff, output, history, planning, protocol, platform/resource policies, failure patterns, branch policy/register, clean-epoch decision, G1 and G2 records, and relevant Slice D/Soundings publication evidence. Trace the new `lineage.campaigns.epoch1` v2 account/attempt schema, v1 publication transaction, legacy recovery/consumer rules, account profile and real caller paths. Record clean/dirty worktree, source head, version/run class, exact owners, validation plan and exclusions before editing.

## Bounded implementation

Extend **only** the inert clean-epoch database. Add typed, validated pending publication recovery/consumer evidence linked exactly to a retained account-slot attempt, campaign, artifact, publication, expected account revision and expected campaign head. One account slot is the contention scope. Design prepared, publication-accepted and consumer-completed transitions so no success state is written before its corresponding authority commits. Publication, slot address, recovery and Soundings first witness/artifact must use a transaction or exact idempotent retry; accepted non-head/fork artifacts and complete profile/Chronicle/Legacy state must never be discarded. Complete consumers with account revision checks and durable readback. A missing/malformed account, attempt, recovery, consumer, artifact or witness must block with a named result. Regenerated callers and competing campaigns cannot replace a pending slot. Do not expose a general unguarded clean-epoch publication method.

If first-publication recovery plus all account consumers exceeds one coherent `S` transaction package, finish a tested atomic first-publication/recovery checkpoint, leave consumer completion explicitly pending, and install the narrow consumer successor. Do not conflate a reservation or pending recovery with accepted publication or completed consumers.

Keep the route inert: no App/launcher/save/lifecycle cutover, hosted deployment, browser-storage reset, legacy import/export/reconciliation or old-save recovery, dependency, gameplay, game-version or combat change. Leave Slice E/F records inert. The development-only pre-cutover data waiver does not weaken post-epoch history, Soundings, recovery or long-running capacity requirements.

## Acceptance and handoff

Use synthetic native-browser IndexedDB QA for same-source retry, regenerated attempt, account-slot contention, abort/quota before and after durable publication, close/reopen/lost caller, malformed/missing links, stale account/head, Soundings first and descendant provenance, and compatible recovery/consumer completion where implemented. Re-run G1/G2 account/attempt and v1 publication QA, adjacent campaign/Soundings regressions, Node typecheck, production Vite build, bounded UI typecheck with changed-file diagnostic accounting, and `git diff --check`. Report fresh versus reused evidence. Helper QA does not accept live callers or long-running capacity.

Update focused implementation record, current output/handoff/history/planning/branch register and install the next bounded route from actual results. State applicable failure-pattern IDs, branches/PRs inspected and retained triggers. Commit, push, fetch and read back exact hosted head. No browser user data or deployment changes.
