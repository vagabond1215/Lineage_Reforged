# DEV-0.7.1 Slice G6 — Inert Descendant Publication And General Recovery Transactions

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-09-30. Internal implementation slice of planned primary `DEV-0.7.1`; parent, Game version and live activation remain held. Controlling authorities: `docs/design/clean-epoch-async-caller-ownership-and-activation-package-decision.md`, `docs/dev/dev-0.7.1-slice-g5-clean-epoch-slot-read-record.md`, and `docs/design/development-only-clean-persistence-epoch-route-decision.md`.

## Pre-edit gate

Begin from synchronized `master`, note dirt, complete the repository-first orientation and fresh branch/PR review. Read complete current prompt/handoff/output, historical/deferred register, planning reconciliation, protocol, platform/resource policies, failure-pattern and branch registers, G1-G5 focused records, relevant Soundings/non-head/Chronicle authority and tests. Record exact source head, run identities, scope, exclusions and acceptance checks before editing.

## Implementation package

Extend the inert clean-epoch owner to accept ordinary descendant publications behind an account-scoped API, never through raw `CampaignIndexedDbStore.publish` from a live caller. Require expected campaign head and account revision, verified predecessor artifact/continuity and complete source snapshot, immutable new artifact, exact slot/head/control and first Soundings witness/artifact provenance. Couple accepted publication to durable pending recovery and explicit account/Chronicle/Legacy consumer plans. Complete those consumers transactionally with exact receipts, retry, restart and conflict behavior; never erase or age-prune legitimate non-head/fork artifacts or nested history. Generalize G5 load/inventory only after descendant recovery and consumer completion are validated; pending, stale, closed and malformed states remain nonplayable. Account and campaign conflicts must surface without overwriting a newer head or profile. Preserve normal defeat and terminal settlement authority without inventing a lifecycle caller.

Use synthetic native-browser QA for first-to-descendant and second descendant, non-head/fork retention and reload, two-owner contention, stale head/account revision, same-source retry after caller loss, abort/quota at each write, pending consumer restart, Soundings first provenance preservation and missing/conflicting retained evidence. Run existing publication QA, adjacent campaign/Soundings tests, Node UI typecheck and app-local Vite build; distinguish broad UI baseline diagnostics. If full descendant publication plus consumer completion exceeds one coherent run, stop at a tested inert accepted-pending checkpoint with an explicit successor, never at an exposed playable half-state. Apply the relevant FP-001/002/003/004/005/006/011/012/013/014/015 and FP-008/009 guards with exact evidence.

## Exclusions and handoff

No App, launcher/auth/session, legacy saveManager, lifecycle or real caller import; no activation, deployment, browser user-data reset, legacy migration/copy/canonical change, dependency, combat or Game-version change. Pre-cutover test data is disposable; all new-epoch world/lineage/Chronicle/history, Soundings and recovery durability remains mandatory. Reset/delete, backup/restore, dynamic quota/eviction, long-running two-browser ordinary-path acceptance and Slice C combat are later gates.

Update one focused G6 record, current output/handoff, historical/deferred route, planning reconciliation, branch register and successor prompt from actual results. State fresh versus reused evidence, inspected branches/PRs and retained triggers. Commit, push, fetch and read back the exact hosted head. Do not touch hosted deployment or user browser data.
