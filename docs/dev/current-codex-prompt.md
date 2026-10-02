# DEV-0.7.1 Slice G9D — Terminal Publication And Lifecycle Settlement

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-10-02. Internal implementation slice of planned primary `DEV-0.7.1`; parent, Game version and deployment activation remain held. Follow the accepted G9A action matrix and terminal settlement contract in `docs/design/g9a-epoch-lifecycle-and-destructive-transition-authority-decision.md`, plus the G9B/G9C focused records. Preserve the G8 one-head/multiple-address, Soundings witness, retry, blocked UI and exact-readback semantics.

## Objective

Implement the clean-epoch terminal publication and exactly-once lifecycle settlement owner. Prove retirement first from an exact ready retained campaign and selected `EpochApp` caller. Existing archive, payout, estate and achievement calculators are pure calculation inputs; IndexedDB owns terminal publication, stable recovery, account settlement and readback. Do not route a terminal action through retained localStorage writers.

## Required implementation and proof

- Reconcile the existing retirement/death gameplay paths, closed campaign control, account projections and current IndexedDB stores before selecting the smallest transaction shape. Validate exact account revision, ready source artifact/publication/control, campaign head and source/destination addresses. A pending Normal defeat or first/descendant consumer recovery blocks terminal admission.
- Publish exactly one terminal descendant with `control.closed=true`. Create a durable lifecycle recovery keyed by stable account/campaign/terminal publication in the acceptance transaction. Define and validate complete fingerprints for archive reason, terminal artifact/publication, payout, estate source-run identity and affected addresses. Do not mint a new publication or payout on retry.
- Complete settlement once through account CAS: authoritative run history and archive reason, achievements, run Legacy payout and transaction, estate deposit, last-played and lifecycle receipts. Preserve every immutable artifact, non-head/fork history, Chronicle, Soundings witness and unrelated account state. Keep slot-address closure/deletion for G9E, after settlement.
- Require exact closed campaign and completed account/lifecycle readback before success. Lost caller, restart, two tabs, stale account/head/address, duplicate request, conflicting reason/source, malformed retained recovery, abort/quota at each write, and failed readback must show blocked or resume the one accepted identity without partial authority.
- Wire only the verified retirement control in the selected App after native owner proof. Ordinary/hardcore death may join only where an already accepted gameplay caller supplies authoritative terminal state; do not infer it from UI status or synthetic tests. Distinguish synthetic owner fixtures from ordinary user reachability.
- Re-run adjacent epoch owner and campaign/Soundings tests, Node UI-config typecheck, app-local Vite build, broad UI characterization against the known 137-diagnostic baseline, and actual selected-App restart/failure paths.

If existing stores cannot represent an atomic terminal publication plus durable lifecycle recovery without a schema/contract decision, stop at the smallest decision-complete prerequisite while preserving independent verified work. Do not invent archive, payout, estate, inheritance, or address-deletion rules.

## Exclusions and repository completion

No slot closure/deletion, inheritance-use consumption, account reset/delete, new profile/password controls, pre-cutover migration, G10 deployment/reset/backup/capacity acceptance, broad combat implementation or Game-version change. No address is cleared before terminal settlement.

Fetch/prune from synchronized hosted `master`; inspect live branches/PRs and retain exact review triggers. Review source/test/doc diff, commit/push useful checkpoints, update focused authority plus current output/handoff/prompt/planning/historical/branch registers, then fetch and read back hosted head. If G9D is verified, install G9E from the accepted G9A order; otherwise retain the narrowest support route.
