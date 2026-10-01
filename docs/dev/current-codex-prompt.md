# DEV-0.7.1 Slice G8F.1 — Actual App Failure UI And Recovery Proof

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-10-01. Support run of planned primary `DEV-0.7.1`; G8F caller checkpoint `08329e90` is recorded in `docs/dev/dev-0.7.1-slice-g8f-real-async-app-caller-checkpoint.md`. Parent, Game version and deployment activation remain held. Read the accepted clean-epoch/G8C decisions and G8F record before editing.

## Objective

Close only the actual-App failure UI evidence gap left by G8F. Exercise the selected `EpochApp` in native Chromium, with controlled local-only fault injection at its real IndexedDB owner boundary. Prove accepted pending first-campaign and descendant consumer recovery after lost caller/restart, write-time quota and abort behavior, stale head/account/destination conflicts and two-context contention. Failed reads/writes must never render false empty/playable state, silently start a new attempt, fall back to legacy storage, or show a false success. Exact ready-slot readback is required for resumed success. Preserve the G8F ordinary route and the accepted G8C one-head/multiple-address and Soundings provenance contracts.

## Scope and checks

Create the smallest test-only fault harness or fixture needed; do not add production dependencies or testing hooks to product UI unless a real caller defect requires a narrow repair. Inspect the exact owner transaction/recovery API before choosing injected faults. Test prepared/pending/closed/unsupported slot display, retry reachability and a two-tab race. If a production defect appears, fix it and rerun adjacent native owner suites plus campaign/Soundings Node tests. Run Node UI-config typecheck, app-local Vite build and broad UI characterization against the known 137-diagnostic baseline. Distinguish injected UI proof from lower-level owner suites. If an injection cannot be made reliable, state the exact unproved case and retain G8F/G9 hold.

## Repository completion

Start from fetched synchronized `master`; inspect live branches/PRs and preserve unrelated changes. Review complete source/test/doc diff, record exact proof and held paths, commit/push useful checkpoints, update focused authority and current output/handoff/prompt/branch register, then fetch/read back hosted head. Install the smallest G9 lifecycle route only if the G8F UI boundary is proven; otherwise retain a narrow follow-up. No old-save migration, production deployment, browser reset, G9 lifecycle implementation, G10 durability acceptance, combat or Game-version change.
