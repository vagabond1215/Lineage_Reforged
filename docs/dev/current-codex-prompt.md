# Clean Persistence Epoch Namespace And Deployed Old-Client Capability Decision

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-09-29. Unversioned documentation decision supporting planned `DEV-0.7.1` after the **Legacy Writer Fence And Async Caller Cutover Feasibility Decision**. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted `DEV-0.7.0`; activation, Slice C capacity, combat and parent acceptance remain held. The owner selected the existing origin and waived backward preservation, reconciliation, export/import and migration of pre-cutover legacy saves. New-epoch campaigns and history still require full durability.

## Objective and boundary

Begin from synchronized `master`; complete repository-first orientation, inspect the worktree, and read the complete current prompt/handoff/output/history/planning, protocol, platform/resource policy, failure patterns, branch policy/register, the focused feasibility decision and its supersession notes, Slice D/E/F records, and current source/callers. Produce one decision-complete **same-origin clean-epoch namespace and old-client capability contract** without source or deployment mutation.

Inspect the actual configured Sites published version through supported read-only metadata or a lawful read-only deployed-bundle view, if accessible. Identify exactly which storage keys, databases, clear/delete operations and fallback paths that older client can reach; distinguish direct evidence from unavailable archived source. Inventory current `saveManager`, profile, attempt, launcher, App and lifecycle ownership. Do not infer that all old tabs are closed, or that a new deployment can terminate them. If the old bundle cannot be inspected, record the missing proof rather than guessing.

Determine the smallest disjoint new IndexedDB database/store and account/session/credential/active-pointer namespace that could protect **new** authority if old tabs continue writing obsolete keys. Specify account identity and password-verified rekey versus new-registration behavior as an explicit product decision when repository evidence cannot settle it. Define exact no-fallback boot/read/write/reset/delete rules, user-facing start-new-campaign posture, old-data invalidation without premature deletion, new-data backup/restore and rollback, and the native old/new tab plus restart acceptance matrix. Do not design a v6 importer or export/import path solely to preserve waived old saves. Preserve new-epoch non-head/fork history, profiles, attempts, recovery, first Soundings provenance and long-run capacity.

The current owner direction requires old writers to be demonstrably excluded before activation. If a same-origin all-old-tab exclusion proof is unavailable, keep activation blocked. A disjoint namespace establishes non-interference only if both old-bundle capability and new-code isolation are proved; do not silently treat it as proof that old scripts stopped. If the owner separately accepts non-interference as the gate, record that decision and its exact limits. Select the smallest subsequent inert implementation slice only after this contract is decided; otherwise install the next evidence or owner-decision route.

## Acceptance and exclusions

This is a documentation-only audit. No source, schema, test, user storage, site access/deployment, dependency, game version, capacity or combat change; no activation or legacy deletion. Review the complete diff, run `git diff --check`, update focused decision/current output/handoff/history/planning/branch register and install one bounded successor from findings. Commit, push, fetch and read back the exact hosted head. Report fresh versus reused evidence, branch/PR dispositions, failure-pattern constraints, unknowns and the precise activation stop condition.
