# DEV-0.7.1 Slice G7 — Epoch Account, Auth And First-Campaign Orchestration Adapters

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-09-30. Internal implementation slice of planned primary `DEV-0.7.1`; parent, Game version and live activation remain held. Controlling authorities: `docs/design/clean-epoch-async-caller-ownership-and-activation-package-decision.md`, `docs/dev/dev-0.7.1-slice-g6-inert-descendant-recovery-record.md`, and `docs/design/development-only-clean-persistence-epoch-route-decision.md`.

## Pre-edit gate

Begin from synchronized `master`, note dirt, complete repository-first orientation and fresh branch/PR review. Read complete current prompt/handoff/output, historical/deferred register, planning reconciliation, protocol, platform/resource policies, failure-pattern and branch registers, G1-G6 focused records, relevant account/auth/attempt/Soundings authority and tests. Record exact source head, run identities, bounded files, exclusions and acceptance checks before editing. Distinguish development-only disposable pre-cutover data from mandatory post-epoch durability.

## Implementation package

Build inert async adapters for clean-epoch account registration, sign-in and credential/profile mutation, validated epoch session selection, and first-campaign preparation/publication/consumer completion. Use `CleanEpochAccountStore` as sole durable account/campaign authority for these adapters. Credential verification must preserve current PBKDF2 semantics without copying old credentials; an epoch session key is only a hint and must be checked against a retained account. Preserve exact account revision CAS and credential/profile records, stable attempt and campaign identities across retry/restart, first Soundings witness/artifact provenance, selected Legacy preparation and optional one-use inheritance, and all account/Chronicle receipts. Await durable readback before returning success. On unavailable/blocked/quota/malformed/stale/pending states, return a typed blocked/retry result rather than default account, empty slot list, regenerated campaign or legacy fallback. Give every pending state a reachable adapter completion path, with exact same-source retry and conflicting-source rejection.

Keep the adapters inert: no `App.tsx` import, launcher selection switch, deployment, development browser reset, old-storage migration, or live caller claim. Reuse pure existing auth/profile/attempt calculations where possible; do not create a second durable credential or campaign owner. Account reset/delete and terminal/lifecycle settlement remain G9. If account/auth and first-campaign orchestration exceed one coherent run, stop at a tested inert account/auth checkpoint with an explicit successor; never return a playable first campaign with pending consumers.

Use native-browser synthetic QA for register/sign-in/restart, wrong credential, stale account revision, simultaneous owners, epoch session hint validation, blocked/unavailable database, first attempt preparation and accepted-pending/completed restart, lost caller, regenerated attempt conflict, Soundings first provenance, optional inheritance, abort/quota at each account/attempt/recovery boundary, and missing/conflicting retained evidence. Run existing clean-epoch and publication QA, adjacent campaign/Soundings tests, Node UI typecheck and app-local Vite build; distinguish broad UI baseline diagnostics. Apply FP-001/002/003/004/005/006/011/012/013/014/015 and FP-008/009 with exact bounded evidence.

## Exclusions and handoff

No App ordinary save/load actions (G8), lifecycle/reset/delete (G9), activation/deployment/old-browser-data clearing or two-browser/long-run durability acceptance (G10), legacy saveManager fallback/migration, new dependency, combat or Game-version change. Pre-cutover test data may be discarded only during the later deliberate cutover; do not touch user browser data here. Preserve all post-epoch world, lineage, Chronicle, Soundings, non-head/fork and recovery authority.

Update one focused G7 record, current output/handoff, historical/deferred route, planning reconciliation, branch register and successor prompt from actual results. State fresh versus reused evidence, inspected branches/PRs and retained triggers. Commit, push, fetch and read back the exact hosted head.
