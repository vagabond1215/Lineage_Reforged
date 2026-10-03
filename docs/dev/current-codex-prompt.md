# DEV-0.7.1 Slice G9F — Account Reset/Delete And Session Invalidation

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-10-03. Internal implementation slice of planned primary `DEV-0.7.1`; parent, Game version and deployment activation remain held. Begin from synchronized hosted `master` after verified G9E and G9E.1 hardening. Read G9A, the G9D/G9E focused records, G9E prerequisite and G9E.1 closure, current output/handoff, repository protocol, failure-pattern and branch registers, and historical/planning reconciliation.

## Objective

Implement the accepted account-wide reset/delete and session invalidation contract in the clean epoch. Preserve the strict distinction between explicit account-wide destruction and G9E address deletion. Keep G10 activation, backup/restore and long-run capacity acceptance held.

## Required implementation and proof

- Reconcile G9A's exact reset/delete scope against live v6 stores, artifacts, controls, witnesses, historical first/descendant/terminal recoveries, slot pointers, deletion receipts, credentials, account profile, and selected-session hints. Select the smallest owner transaction and durable tombstone/reset-generation design needed to prevent stale resurrection; do not infer deletion from an empty slot.
- Implement exact account revision and reset-generation CAS, atomic account-wide erase or reset, monotonic generation/tombstone authority and idempotent exact retry. Ensure old tabs, pending publication/settlement/cleanup, stale credentials and stored session hints cannot read, publish, recreate or select the destroyed generation.
- Wire only existing verified selected-App account controls where present; if no existing control is verified, report the owner capability separately and avoid inventing account UX. Keep profile/password changes and the old localStorage lifecycle owner outside this package.
- Prove two-owner contention, stale tab, restart, malformed/partial rows, changed retry, abort/quota at every transactional write, lost post-commit readback and exact durable completion. Re-run G9D/G9E and adjacent browser/Node suites, Node UI-config typecheck, app-local Vite build and broad UI baseline characterization. Verify no account-wide operation can affect another account or legacy staging database.

## Exclusions and completion

No G10 clean-development activation/reset procedure, deployment, capacity/eviction/backup acceptance, broad combat, normal/hardcore death caller without accepted gameplay state, new inheritance rule, or Game-version change. Do not treat G9E address deletion as account reset/delete.

Fetch/prune from synchronized hosted `master`, inspect live branches/PRs and retained review triggers, validate, update the focused record and current output/handoff/prompt/planning/historical/branch registers, commit/push useful checkpoints and read back hosted head. If G9F is verified, route to the smallest remaining G9 parent acceptance or G10 decision specified by current authority; otherwise retain the narrowest support route. Do not claim parent or Game-version acceptance from G9F alone.
