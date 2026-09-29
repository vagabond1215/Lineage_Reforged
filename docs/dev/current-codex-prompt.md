# Legacy Campaign Canonical Materialization And Activation Boundary Decision

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-09-29. Unversioned, documentation-only decision after implemented `DEV-0.7.1 Slice E - Inert Legacy Authority Copy And Verification` from source `87ddc774dec662bdc68d0ae30428505ff0c5d0c2`. Planned parent `DEV-0.7.1`, Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted `DEV-0.7.0`, Slice C capacity failure and combat/parent holds remain unchanged. Slice E is inert staging, not migration acceptance.

## Objective

Define the smallest safe, complete canonical materialization and activation route from the version-2 staged raw copy. Begin from synchronized `master` and complete repository-first orientation. Read the full current prompt/handoff/output/history/planning, protocol, platform/resource policy, failure patterns, branch policy/register, accepted retention and Soundings decisions, Slice D record, `docs/design/legacy-campaign-store-migration-boundary-decision.md`, and Slice E implementation/evidence record. Verify live source, callers and branch/PR state against the published Slice E checkpoint; note any dirty tree before editing.

## Required decision

Specify a versioned canonical schema and transaction/readback contract that represents every accepted artifact including non-head/fork history, all slot addresses, controls, candidates and pending publication recovery, independent Soundings first witness/artifact, v6 migration source/receipt, new-campaign attempts, account profile/history/consumer receipts and unknown quarantined source. Decide whether materialization can be a separate non-activating implementation slice before caller cutover, and give its exact blockers, test matrix and rollback point. Never replay legacy history through v1 `publish`, synthesize provenance, truncate history, or treat `verified_with_blockers` as playable authority.

Map every synchronous `saveManager`, account profile, attempt coordinator, launcher and `App.tsx` call to a concrete asynchronous owner and UI pending/error posture. Decide how all tabs are fenced from old-key writes and stale IndexedDB heads; how source is re-enumerated against the staged generation; how per-account activation selects one store only after complete materialization, close/reopen/restart exact readback and unresolved-blocker clearance; and how divergent stores are quarantined without choosing the newest timestamp. Resolve account reset/delete, pending consumers/recoveries, first Soundings witness, old-key preservation, export/restore and rollback before any retirement. Define production-reachable repair owners for blocked records. Set dynamic quota/abort/blocked-upgrade/unavailable behavior and two-browser plus long-run workload acceptance gates. Separate bounded implementation packages and identify the earliest package that may safely mutate live caller behavior.

Compare the result to the accepted retention decision and Slice E evidence. Install one bounded successor implementation prompt only if the canonical and activation boundary is decision-complete; otherwise install the smallest remaining decision route. Do not infer capacity or combat acceptance from inert copy.

## Exclusions and completion

No code, test, schema, canonical materialization, activation, localStorage or IndexedDB user-data mutation, old-key cleanup, new dependency, combat, reward/economy, `GAME_VERSION` or parent acceptance in this decision. Keep protected branches untouched. Update a focused decision, current output/handoff, historical/deferred register, planning reconciliation, branch register and installed successor prompt from actual findings. Run read-only source/diff checks; distinguish reused Slice E tests/browser evidence from fresh work. Commit, push, fetch and read back exact hosted head; report source and publication identities, branch/PR dispositions and applicable failure-pattern evidence.
