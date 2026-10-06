# DEV-0.7.1.5 — Independent G9 Lifecycle Parent Re-audit

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-10-06. Support run attached to planned primary `DEV-0.7.1`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`. Begin from freshly synchronized hosted `master`, including repair commit `39d886350a7dfb7d94c1514df3e9c5833456177e`. G10, planned primary, deployment and Game-version acceptance remain held until this independent audit reaches an explicit decision.

## Objective

Independently re-audit the G9 lifecycle parent against the repaired hosted source and its real selected-App callers. Do not infer acceptance from the DEV-0.7.1.4 repair matrix or earlier slice test counts. This is an audit, not G10 implementation.

## Required audit

- Complete repository-first orientation: live head/worktree, fetch/prune, branches and open PRs, current prompt/output/handoff, planning and historical reconciliation, G9A through G9F focused authorities and F1/F2/F3 audit/repair records, relevant failure-pattern guardrails, manifests, source/caller paths, tests/build/CI, generated mirrors and known blockers. Preserve unrelated changes.
- Derive an independent account-wide authority inventory and transition graph for ordinary first publication, witnessed descendant and cross-slot overwrite, terminal settlement/cleanup, G9E address deletion/generation reuse, G9F reset/delete and retained lifecycle receipts. Check version-1 account-owned rows, required provenance, exact account/slot/generation/revision binding, password/CAS, pending consumers and post-commit readback/retry.
- Probe fresh coherent synthetic controls and adversarial one-row loss/corruption **before both reset and delete**, including F1 required artifact/control/recovery/witness/address authority, F2 current deleted-generation pointer with retained deletion receipt, and F3 descendant `expectedSlotAddress` for empty, occupied, wrong-slot, overwritten and later deleted/reused destinations. Include historical multi-address slot reuse and valid zero-live-address terminal cleanup. Prove rejection happens before the first destructive write, with unchanged account revision/generation, all target and other-account family rows and no lifecycle receipt; prove valid controls commit and exact retries are fenced.
- Inspect the destructive transaction itself for any additional cross-slice graph omission, false acceptance or false rejection. Exercise ordinary selected-App routes and error presentation as reachable; label synthetic fixtures and any unverified production reachability explicitly. Reconcile independent probes with the G9A decision, native G9B–F suites, adjacent campaign/Soundings Node tests, Node UI-config typecheck, app-local Vite build, broad UI baseline and abort/quota, restart, two-owner and readback evidence. Do not claim green broad UI typecheck if its known diagnostics remain.
- Write a focused parent audit with exact source SHA, methods, results, limitations, applicable FP evidence and one explicit decision: `G9_PARENT_ACCEPTED` only if the complete parent contract is independently proved, or `G9_PARENT_REPAIR_REQUIRED` with the narrowest confirmed repair route. Do not turn a green repair suite into acceptance. If accepted, install a **separate docs-first G10 decision prompt** only; do not implement G10 in this audit. If not accepted, install the narrowest repair prompt and keep G10 held.

Update current output/handoff/prompt/planning/historical/branch routing as applicable. Commit, push and independently read back hosted `master`. No unrelated owner refactor, schema/dependency addition, tracked generated output, G10 implementation, deployment, planned-primary acceptance or Game-version change.
