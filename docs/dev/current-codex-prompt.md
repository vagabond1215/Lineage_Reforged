# DEV-0.7.1 Slice G9C — Revisioned Account And Legacy Actions

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-10-02. Internal implementation slice of planned primary `DEV-0.7.1`; parent, Game version and deployment activation remain held. Follow the accepted G9A lifecycle contract in `docs/design/g9a-epoch-lifecycle-and-destructive-transition-authority-decision.md` and the G9B focused record. Preserve the G8 one-head/multiple-address, Soundings witness, retry and full blocked/readback semantics.

## Objective

Wire ordinary profile, credential and Legacy purchase/preparation actions from the selected `EpochApp` through revisioned clean-epoch account authority. Existing pure gameplay/Legacy resolvers may calculate results; IndexedDB account CAS and exact readback own durable acceptance. A pending first or descendant publication fences account mutation. The retained legacy App/localStorage account writers are not a fallback.

## Required implementation and proof

- Map each selected-App placeholder and former App action to the accepted pure resolver and `CleanEpochAccountStore.updateProfile` or `updateCredential` boundary. Reuse the existing credential verification adapter for password change; do not invent a new credential format or access policy.
- Capture and validate the exact account revision/profile and action input. Apply each purchase or preparation choice once, with retained accepted eligibility and cost. A repeated click or stale tab must not spend twice, grant twice, overwrite newer choices, or return a false success. Profile/password changes must preserve campaign, history, Chronicle, Soundings and publication receipts.
- Reject malformed input, insufficient or changed Legacy authority, stale revision, pending publication, missing/corrupt account, storage abort/quota and readback failure without partial state. Retry/restart must re-read durable account authority and remain idempotent where the accepted action contract requires it.
- Wire only verified selected-App actions. Keep reset/delete, terminal settlement, slot deletion and inheritance-use consumption held for G9D-F. Do not expand account UX beyond these existing actions.
- Exercise native Chromium owner and actual selected-App paths for ordinary success, duplicate/stale action, pending-publication fence, two tabs, restart, abort/quota and exact account/profile/credential readback. Re-run adjacent epoch owner and campaign/Soundings tests, Node UI-config typecheck, app-local Vite build and broad UI characterization against the known 137-diagnostic baseline. Distinguish synthetic UI probes from real user-reachable controls.

If an accepted profile/Legacy action cannot be expressed through the existing account CAS without a new shared contract, stop that action at a focused prerequisite decision while completing independent G9C actions. Do not guess cost, eligibility, credential or lifecycle semantics.

## Exclusions and repository completion

No terminal retirement/death publication, slot closure/delete, inheritance consumption, account reset/delete, schema/dependency addition, pre-cutover migration, G10 deployment/reset/backup/capacity acceptance, combat implementation or Game-version change. Preserve immutable non-head/fork history and Soundings provenance.

Fetch/prune and start from synchronized hosted `master`; inspect live branches/PRs and preserve retained dispositions/triggers. Review complete source/test/doc diff, commit/push useful checkpoints, update focused authority and current output/handoff/prompt/planning/historical/branch registers, then fetch and read back hosted head. If G9C is verified, install G9D from the accepted G9A order; otherwise retain the narrowest support route.
