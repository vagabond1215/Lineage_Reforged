# DEV-0.7.1 Slice D - Transactional Campaign Store Foundation

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-09-29. Internal prerequisite slice of planned `DEV-0.7.1 - Ordinary Encounter Reachability`; parent and Game `0.1.1-prealpha` remain unchanged. Controlling decision: `docs/design/ordinary-campaign-publication-capacity-and-retention-contract-decision.md`, accepted from inspected source `a16523d8e08b14816a75db95e0b135c09ae40fc9`. Verify the synchronized live head before acting.

## Objective and scope

Build the smallest versioned IndexedDB transaction foundation needed for long-running local campaign publication. This is a storage-owner checkpoint, not live save cutover or combat acceptance. Preserve every existing `localStorage` key and user save. Do not treat the 5 MiB Slice C model as a permanent product budget or delete durable history to fit it.

Complete repository-first orientation: current prompt/output/handoff/history/planning, protocol, platform/tool policy, failure patterns, branch/PR inventory, Slice C evidence, Soundings independent-provenance authority, and the focused decision. Trace the exact current `saveManager.ts`, account profile, new-campaign attempt and ordinary App callers; identify the synchronous-to-async seam and validation commands. Note any dirty worktree before editing. Preserve protected branches and unrelated work.

## Connector-safe prework incorporated

Read `docs/dev/connector-audit-slice-d-transactional-campaign-store-prework-2026-09-29.md` before implementation. Its six-pass owner/invariant/async-seam/witness/acceptance/migration audit is controlling prework unless fresh source disproves it.

In particular, do **not** implement Slice D as four unrelated CRUD stores plus a generic transaction helper. Expose and test a publication-shaped atomic operation: validate expected head/revision and cross-record account/campaign/slot/artifact/publication identities, validate immutable artifact and optional Soundings witness semantics, then commit artifact + control/head + slot/address + required witness as one unit. For a first durable Soundings publication, the committed state must never expose the new head without its matching immutable artifact and valid applied witness. A descendant publication must reject missing/pending/conflicting retained first-publication provenance rather than downgrade it. Preserve same-source idempotency and reject conflicting same-ID retries.

Keep the live synchronous localStorage callers unchanged in Slice D. The new owner must be explicitly asynchronous; do not hide IndexedDB behind a fake synchronous facade. Preserve stable IDs as queryable record fields, version record families, and prove schema fit for later recovery/account/attempt/migration families without cutting them over.

## Required implementation checkpoint

Implement one small browser-native IndexedDB storage owner with explicit versioned schema, account-scoped record identities and an asynchronous transaction contract. Cover artifact, campaign control, slot address and Soundings witness record families in the contract, with room for account/attempt/recovery/migration families without implementing their cutover now. Preserve existing IDs and raw/semantic validation rather than minting replacement authority; reuse or narrowly extract current validators without changing live behavior. The transaction must reject stale head, conflicting immutable artifact or witness, and malformed/unknown record versions before promoting a new head. Commit or abort as one unit and verify exact post-commit readback. Quota, abort, blocked upgrade and unavailable IndexedDB must produce explicit non-mutating failures. Keep pure engines free of browser APIs. Do not add a production dependency.

Use focused executable tests for success, transaction abort at each write, quota failure, stale/conflicting head, immutable conflict, malformed record, restart/reopen and same-source retry. At least one test or isolated QA proof must exercise native IndexedDB in a real browser; an in-memory mock alone is insufficient. Record which browser was exercised and what remains untested. Compare with the existing localStorage publication invariants without changing the live caller. If native browser validation is unavailable, preserve the checkpoint but report it incomplete rather than declaring backend acceptance.

## Exclusions and handoff

No migration or cutover of existing accounts/saves, account-consumer integration, automatic candidate cleanup, old-key retirement, user-data mutation, combat, rewards, economy, shared game schema/content change, new dependency, `GAME_VERSION` change or parent acceptance. Do not pretend this foundation alone clears the capacity gate. The next slices must copy/verify/cut over existing authorities, adapt async callers, handle candidate lifecycle and prove repeated long-running saves, quota/restart/rollback, Soundings witness, cross-slot and account history in an isolated campaign.

Update focused implementation record, current output/handoff, historical/deferred register, planning reconciliation, branch register and installed next prompt based on actual result. Run focused/adjacent tests, applicable build/typecheck and diff checks; label known baseline failures accurately. Commit, push, fetch and read back the exact hosted head, separating inspected source, implementation checkpoint and final publication head. Report applicable failure-pattern evidence and retained branch/PR review triggers.
