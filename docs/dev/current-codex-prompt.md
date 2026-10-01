# DEV-0.7.1 Slice G9A — Epoch Lifecycle And Destructive Transition Authority Decision

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-10-01. Internal decision slice of planned primary `DEV-0.7.1`; parent, Game version and deployment activation remain held. G8F ordinary caller and G8F.1 failure UI are recorded in `docs/dev/dev-0.7.1-slice-g8f-real-async-app-caller-checkpoint.md` and `docs/dev/dev-0.7.1-slice-g8f-1-actual-app-failure-ui-record.md`. The accepted route is `docs/design/clean-epoch-async-caller-ownership-and-activation-package-decision.md`; preserve the G8C singular head/multiple-address and independent Soundings witness contracts.

## Objective

Produce a decision-complete, repository-authoritative G9 lifecycle and destructive-transition contract before implementing those callers. Map the selected `EpochApp` placeholders and former App/run-lifecycle/account/save paths to existing epoch owner capabilities. Decide the smallest ordered implementation packages for profile/credential and Legacy actions, blocked-run/Normal-defeat repair, retirement and inheritance settlement, terminal slot closure/deletion, explicit account reset/delete, and sign-out/session invalidation. Separate ordinary recoverable transitions from player-requested destructive deletion. Pre-cutover development saves are disposable; accepted new-epoch campaign/world/lineage/Chronicle/history, non-head/fork artifacts and Soundings provenance are durable until an explicit authorized epoch deletion/reset.

## Required decision

For each action, state the exact durable owner, expected account/head/address revision, transaction and pending-recovery identity, required account consumers/receipts, retry/restart/two-tab behavior, and full blocked/readback exit. Define one-time terminal settlement, estate/inheritance and reward semantics from existing accepted gameplay rules; do not invent payouts or clear an address before durable settlement. Define how old tabs and session hints become invalid for reset/delete, and how explicit deletion differs from quota/eviction or ordinary slot closure. Identify any contract that cannot be decided from repository authority and route only that prerequisite to a focused follow-up. Include a matrix of production UI actions and implementation/testing order, with precise G9B first package and exclusions.

This is documentation-only. Do not implement G9 production code, change schema, delete/reset any browser data, deploy, migrate old saves, add dependencies, advance Game version, or claim G10 durability/activation. Use the repo protocol: fetch/prune, read complete current authorities, inspect live branches/PRs and relevant code/tests, preserve unrelated work, update a focused decision plus current output/handoff/prompt, planning/historical and branch registers, commit/push, fetch and read back hosted head. Run read-only probes if needed; label reused G8F.1 tests separately. G10 post-epoch backup/restore, long-running capacity/eviction, coordinated reset/deployment and parent acceptance remain held.
