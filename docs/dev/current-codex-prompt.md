# DEV-0.7.1.4 — Residual G9 Destructive Graph Preflight Repair

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-10-06. Support run attached to planned primary `DEV-0.7.1`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`. Begin from synchronized hosted `master`. G9 parent, G10, planned primary, deployment and Game-version acceptance remain held.

## Objective

Repair only the two confirmed residual fail-open edges in the existing whole-account reset/delete campaign-graph preflight, F2 and F3 in `docs/design/dev-0.7.1.3-g9-lifecycle-parent-independent-reaudit.md`. Do not treat the prior 64/64 repair suite as parent acceptance. Do not implement G10.

## Required implementation and verification

- Complete repository-first orientation, fetch/prune, branch and open-PR review, current authority and relevant FP guardrails. Preserve unrelated worktree changes.
- Inside the same destructive readwrite transaction, before its first write, prove that a retained G9E deletion receipt which represents the current deleted slot generation has its exact `currentSlotGenerations` row. Permit historical receipts after legitimate slot reuse and valid zero-address terminal cleanup; do not impose a false one-receipt/one-current-pointer rule.
- Bind each descendant recovery's `expectedSlotAddress` to the actual retained destination state at its publication boundary. A nullable empty destination is distinct from a nonnull artifact/publication pair. Verify exact provenance through retained prior address/publication/generation history, including same-slot, cross-slot, overwrite, later deletion and reuse where applicable. Reject nonexistent or mismatched pairs without requiring an address to remain live after legitimate later transitions.
- Add durable paired reset/delete native regression cases from coherent synthetic valid controls and one-row F2/F3 corruptions. Assert `invalid_record` before any destructive write, unchanged account revision/generation and target/other rows, and no lifecycle receipt. Test a historical multi-address receipt after reuse as an adversarial check; if it exposes a related fail-open path, repair only that same preflight invariant and document it. Include valid deleted-address, reused-slot, descendant and terminal-cleanup controls to avoid false blocking.
- Recheck selected-App blocked presentation, password/CAS, retry/restart, two owners, abort/quota and exact readback as relevant. Run focused native browser and adjacent owner suites, focused Node, Node UI-config, app-local Vite build and broad UI baseline. State fresh versus retained evidence and nonzero baselines truthfully.

Write a focused repair record and update current output/handoff/prompt/planning/historical/branch routing as applicable. Only after the repair passes, install a **new independent G9 parent re-audit** prompt; do not declare `G9_PARENT_ACCEPTED` from the repair suite. Commit/push and read back hosted head. No unrelated owner refactor, schema/dependency addition, tracked generated output, G10 implementation, deployment, planned-primary acceptance or Game-version change.
