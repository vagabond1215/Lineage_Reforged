# DEV-0.7.1 Slice G9B — Normal Defeat Recovery Publication Owner Implementation

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-10-02. Internal implementation slice of planned primary `DEV-0.7.1`; parent, Game version and deployment activation remain held. Start from the accepted G9A contract in `docs/design/g9a-epoch-lifecycle-and-destructive-transition-authority-decision.md` and preserve G8C one-head/multiple-address, G8D Soundings witness and G8F.1 actual-App failure semantics.

## Objective

Implement the smallest clean-epoch Normal-Stakes defeat recovery owner and selected-App caller. A retained ready campaign with exactly one authoritative `recovery_pending` receipt must be recoverable through the existing campaign-session authority, published as a normal descendant, completed through account consumers and returned only after exact ready readback. Do not persist a snapshot that still contains pending defeat and do not reproduce recovery destination/receipt/continuity rules in UI code.

## Required implementation

- Resolve an exact retained source artifact/publication/session control and expected account/head/destination address.
- Invoke `completePendingNormalDefeatRecovery` as the gameplay authority. Preserve its receipt identity, deterministic safe-settlement destination, four-tick recovery, Chronicle/notification and continuity semantics.
- Publish the resulting playable snapshot through the clean-epoch descendant owner. Same-slot recovery is the primary route; retained non-head source must obey existing fork rules.
- Complete ordinary descendant consumers exactly once and require exact ready-slot readback before gameplay resumes or success is shown.
- Stable retry must reuse the accepted receipt/publication/recovery. Restart after accepted publication resumes the destination-owned descendant recovery rather than recomputing another recovery.
- Reject malformed/multiple/missing receipts, invalid destination, stale account/head/address/source, conflicting duplicate, unresolved publication consumers, closed campaign and storage failure without partial authority.
- Wire only the selected `EpochApp` defeat-recovery path after the owner is proven. Do not fall back to the retained legacy App/localStorage path.

## Verification

Use native Chromium and focused Node coverage as appropriate. Include: head recovery, restart/lost caller after accepted publication, exact duplicate receipt replay, bad explicit destination, malformed/multiple pending receipts, historical/non-head fork, stale account, stale head, stale destination, two-tab contention, write abort and quota injection, and exact ready readback. Re-run adjacent clean-epoch owner suites and campaign/Normal-defeat/Soundings tests. Run Node UI-config typecheck, app-local Vite build and broad UI characterization against the known baseline. Distinguish owner proof from actual selected-App proof.

If a prerequisite contract is missing, stop with the smallest focused follow-up rather than inventing lifecycle semantics.

## Exclusions

No retirement/death terminal settlement, slot deletion, account reset/delete, Legacy/profile UI expansion, G10 activation/deployment/reset, old-save migration, dependency addition, combat implementation or Game-version change. Preserve all immutable artifacts, non-head/fork history and Soundings provenance.

## Repository completion

Fetch/prune and start from synchronized hosted `master`. Inspect live branches/PRs and preserve retained dispositions/triggers. Review complete source/test/doc diff, commit/push useful checkpoints, update focused record plus current output/handoff/prompt/planning/historical/branch authority, then fetch and read back hosted head. If G9B is verified, install G9C from the accepted G9A order; otherwise retain the narrowest repair.
