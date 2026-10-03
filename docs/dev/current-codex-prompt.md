# DEV-0.7.1.1 — G9 Lifecycle Parent Acceptance Audit

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-10-03. Support run attached to planned primary `DEV-0.7.1`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`. Begin from synchronized hosted `master` after G9F implementation and hosted-head readback. G10 activation, deployment, planned primary and Game-version acceptance remain held.

## Objective

Audit G9B–G9F as one clean-epoch lifecycle/destructive capability against the accepted G9A contract. Decide whether G9 parent scope is accepted, requires one narrow repair, or remains blocked. This run is an acceptance audit, not G10 implementation.

## Required audit

- Re-read the complete current output, handoff, historical/planning registers, G9A authority, G9B–G9F focused records, G9E.1 hardening, failure-pattern and branch registers, validation matrix and selected App caller paths. Reconcile actual source and schema against the records rather than adopting prior PASS counts as current evidence.
- Inventory every real selected-App lifecycle and destructive path: Normal defeat recovery, account/Legacy CAS, retirement terminal publication and settlement, address-only deletion and cleanup, whole-account reset/delete, session bootstrap and stale-tab actions. Keep normal/hardcore death without accepted gameplay terminal state, new inheritance rules and unrelated combat held.
- Independently test the cross-slice boundaries where a single focused suite could miss a conflict: pending first/descendant/terminal recovery followed by reset/delete; stale account/head/address/generation; terminal receipt and G9E deletion history; malformed or missing lifecycle authority; two tabs, restart, exact retry after caller loss, and old hints/registration attempts. Confirm the selected App never routes a lifecycle write through the retained localStorage owner or presents a blocked/partial operation as success.
- Run the smallest executable browser/Node/build/typecheck matrix needed for a decision on the synchronized head. Distinguish fresh checks, retained evidence and synthetic fixtures. Do not call the broad UI baseline green if it remains nonzero.
- Record a decision-complete focused G9 parent audit with `G9_PARENT_ACCEPTED`, `G9_PARENT_REPAIR_REQUIRED`, or `G9_PARENT_BLOCKED`, exact evidence and exclusions. If repair is required, install the narrowest support prompt; if accepted, install the smallest G10 docs-first activation/durability decision prompt. Do not perform G10 activation or reset, deployment, backup/capacity acceptance, or a Game-version change in this audit.

Fetch/prune and inspect live branches/PRs with retained review triggers. Update the focused audit and current output/handoff/prompt/planning/historical/branch routing as applicable, commit/push the audit and read back hosted head. Keep `DEV-0.7.1` parent and Game-version acceptance separate from G9 parent acceptance.
