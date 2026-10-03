# DEV-0.7.1 Slice G9E.1 — Slot Generation Hardening Before G9F

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-10-02. Internal hardening slice of planned primary `DEV-0.7.1`; G9F account reset/delete, G10, parent acceptance, deployment and Game-version activation remain held. Begin from synchronized hosted `master` after G9E implementation/readback. Read `docs/dev/dev-0.7.1-slice-g9e-slot-generation-address-deletion-record.md`, `docs/dev/dev-0.7.1-slice-g9e-1-hardening-gate.md`, the G9E prerequisite decision, G9A, current output/handoff, repository protocol, validation matrix, failure-pattern and branch registers.

## Objective

Retain the G9E v6 implementation and close the narrow hardening gaps found in hosted review before any account-wide destructive authority is added. This is not a schema redesign and must not begin G9F implementation.

## Required implementation and proof

- Add direct QA for the identity boundary between `slotGenerationId` and save/publication `generationId`. Read real accepted envelope/recovery generation values and prove they cannot satisfy slot-generation CAS. Do not substitute artifact, campaign or publication IDs for this proof.
- Add a published v5-to-v6 migration case with completed first-publication authority, control, address and exact account-consumer evidence; include multi-address state when practical. After upgrade prove ready current readback, campaign-keyed historical first recovery, retained immutable evidence and restart. Malformed/disagreeing migration must still abort.
- Extend terminal-cleanup abort/quota injection across every write of a two-address closure transaction. Exercise account write, all three writes per address and terminal-recovery completion. Every failure must preserve the pre-closure closed campaign and permit exact retry without partial receipts or address loss.
- Add a distinct lost post-commit readback case for terminal address closure. Trigger the failure only after durable closure commit, then reopen/retry and require the same completed closure identity, receipts and account revision with no duplicate mutation.
- Fix selected-App stale deletion presentation. An exact old-generation `same_source_retry` may occur after the physical slot has been reused by a newer campaign; after the operation refresh authoritative inventory and never claim the slot is empty unless the refreshed slot is actually empty.
- Repair coordination ordering: `current-codex-output.md` and `current-gpt-handoff.md` must open with the current G9E/G9E.1 state rather than the older G9E prerequisite `DELETION_HELD` state, while preserving older chronology below.
- Re-run focused G9E QA, hardened G9D terminal QA, adjacent owner/browser suites, selected-App delete/retirement cases, focused campaign/Soundings/survey Node suites, Node UI-config typecheck, app-local Vite build and broad UI baseline characterization. Treat full workspace `npm test` only according to the repository validation matrix; do not convert unrelated known failures into a false green gate.

## Exclusions and completion

No account reset/delete or reset-generation/tombstone implementation, no G10 activation/reset/backup/capacity acceptance, no death caller, no new inheritance rule, no broad combat and no Game-version change. Do not prune immutable artifacts, witnesses, recoveries or deletion receipts.

If all hardening cases pass, update the focused hardening record plus current output/handoff/planning/historical/branch routing, then reinstall **DEV-0.7.1 Slice G9F — Account Reset/Delete And Session Invalidation** from the already accepted G9A contract. Commit/push useful checkpoints and read back hosted `master`. Do not claim G9F started or accepted from this pass alone.
