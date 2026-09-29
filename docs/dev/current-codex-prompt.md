# Legacy Campaign Store Migration Boundary Decision

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-09-29. Unversioned, read-only migration-boundary decision following the implemented `DEV-0.7.1 Slice D - Transactional Campaign Store Foundation` at code checkpoint `db129b43`. Planned parent `DEV-0.7.1`, Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP` and accepted `DEV-0.7.0` remain unchanged. Do not infer backend or combat acceptance from Slice D.

## Objective

Produce a decision-complete, repository-authoritative migration contract for moving existing local campaign/account data into the versioned IndexedDB store without changing any live caller or user data in this run. Begin from synchronized `master`, complete repository-first orientation and inspect the full current prompt/handoff/output/history/planning, protocol, platform/tool and resource policies, failure patterns, branch policy/register, Slice C evidence, Slice D implementation/QA record, connector prework, accepted retention decision and Soundings independent-provenance authority. Verify the live source against the Slice D code checkpoint and note any dirty tree before editing.

## Required decision

Inventory every current account-scoped and launcher-owned localStorage family: v7 artifact/control/slot/candidate/recovery/witness, legacy v6/obsolete sources and migration receipts, `accounts.v1` profile/history/consumers, new-campaign attempts, active-account/session pointers and preferences. For each, record identity, version/validator, reader/writer/caller, reference edges, restart/retry posture, retained provenance and deletion restriction. Trace exact sync-to-async call sites in `saveManager.ts`, account profile, attempt coordinator, launcher and `App.tsx`.

Decide the smallest safe non-activating copy/verification package and its schema/version needs, followed by a separate activation/async caller package and rollback/export gates. Specify how the old keys remain readable and unchanged during copy, how raw and semantic IDs are preserved, how unknown/malformed records are quarantined without data loss, how account-wide and cross-slot pending recoveries are handled, how first Soundings witness and first artifact are independently verified, and how active authority is marked atomically only after restart/readback. Define same-source retries, cross-tab/stale-client conflicts, account reset, quota/abort/blocked-upgrade, divergent stores and non-head/fork/history preservation. Identify exact tests and at least two native-browser acceptance gates for later implementation. Do not assert a fixed save count or 5 MiB product budget.

Compare the accepted retention contract and Slice D owner with live source; distinguish implemented transaction proof from still-unimplemented migration and capacity gates. Resolve any material product/authority ambiguity in a focused decision rather than guessing. Install one bounded successor implementation prompt only if the copy contract is decision-complete; otherwise install the smallest necessary decision or repair route.

## Exclusions and completion

No code, test, schema, migration, copy, activation, localStorage or IndexedDB user-data mutation, cleanup, old-key retirement, new dependency, combat, reward, economy, `GAME_VERSION` or parent acceptance in this decision. Keep protected branches untouched. Update the focused decision, current output/handoff, historical/deferred register, planning reconciliation, branch register and installed successor prompt from actual findings. Run read-only source/diff checks; accurately label reused Slice D tests and browser evidence. Commit, push, fetch and read back the exact hosted head. Report inspected source, publication head, branch/PR dispositions and applicable failure-pattern evidence.
