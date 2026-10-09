# DEV-0.7.1 Slice G10B — Development-Local Selected-Client And Two-Context Proof

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-10-09. Separate bounded executable successor to the docs-only G10A decision in `docs/design/dev-0.7.1-slice-g10a-coordinated-activation-entry-decision.md`. Planned parent `DEV-0.7.1`, Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0` unchanged. G10 activation and post-epoch durability have not been accepted.

## Objective

From a freshly fetched hosted `master`, independently prove the actual selected `EpochApp` and freshly built client use only the epoch authority across ordinary campaign/account actions and two same-origin browser contexts. Use a disposable development-local origin/profile with its own test data. Produce exact evidence and a decision for G10B only; route any discovered defect to the smallest repair before claiming this gate.

## Required work

- Complete repository-first orientation, required current authorities and branch/PR review. Read the G10A focused decision, G9 parent acceptance, clean-development epoch route, failure patterns, current prompt/output/handoff/planning/historical route, manifests, selected App/import graph and built output. Preserve all unrelated work and held branches.
- Build from the exact inspected source head and inspect the emitted client HTML/JS plus the selected import/call graph. Inventory each account, creator, first/descendant save, load, Normal-defeat, Soundings, Legacy, retirement, address deletion and reset/delete authority call and write. Distinguish localStorage theme/time and epoch session hint from legacy save/auth/attempt writes. Prove no selected error path falls back to old `App.tsx`/`saveManager`/launcher storage or the old IndexedDB database. Do not treat bundled inactive wording as an active writer.
- Add the smallest durable test harness needed to exercise actual mounted selected App controls in two simultaneous same-origin contexts: ordinary account/creator/create/save/manual and quick cross-slot/load/restart; stale second-context head/account, exact retry after lost acknowledgement, pending first/descendant completion, and visible blocked/Retry after unavailable/blocked/quota/aborted storage. Cover reachable Normal-defeat recovery, Legacy, terminal/address and account actions without substituting helper-only proof. Keep an old-context writer limited to known obsolete namespaces; prove it cannot select or overwrite new epoch authority. Check another account, retained non-head/fork and Soundings first-witness bytes across relevant actions. Report any case that is only synthetic or not ordinarily reachable, including creator heir-source presentation.
- Use isolated disposable browser storage only. Never clear an existing user origin/profile, launch hosted cutover, deploy, or mutate hosted Sites. Do not add production functionality except a narrow repair required by a reproduced selected-client defect; if a repair crosses the bounded gate, stop and install its own decision/repair route with evidence. Do not implement backup/restore or capacity changes in G10B.
- Record exact native-browser assertions, restart/readback, built string/import evidence and limitations in a focused G10B record. Decide `G10B_SELECTED_CLIENT_PROVEN` only if every required row passes; otherwise `G10B_REPAIR_REQUIRED` with a bounded successor. Update current output, handoff, prompt, planning/historical route and branch register; commit, push and independently read back hosted `master` with exact identities.

Do **not** activate or deploy, clear browser/site data, accept G10 post-epoch durability or planned `DEV-0.7.1`, change `GAME_VERSION`, integrate held branches, or claim that synthetic G9 fixtures prove genuine long-run reachability. G10C backup/restore and G10D capacity/eviction remain separate later gates.
