# DEV-0.7.1 Slice G8D — First Witnessed Descendant Owner Implementation

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-09-30. Internal implementation slice of planned primary `DEV-0.7.1`; parent, Game version and live activation remain held. Controlling authority: `docs/design/g8c-first-witnessed-descendant-and-cross-slot-authority-decision.md`, then G8B/G6 and accepted Soundings provenance authority.

## Objective

Implement only the accepted **first independently witnessed descendant** owner contract. Do not implement cross-slot addressing or cut App over in this slice.

Extend the clean-epoch descendant publication/recovery owner so the first ordinary Soundings completion after the pure creator head can durably publish from an independently produced **session witness**. The caller must verify the gameplay/session witness against the target snapshot before publication; the transactional owner must independently validate its exact source/predecessor and target facts. In the same IndexedDB transaction as artifact/head/slot/pending recovery, convert the accepted session witness to the immutable applied witness with the new publication's `firstDurable*` identity. Never infer witness authority from snapshot agreement.

Preserve expected campaign-head and account-revision CAS, immutable source/history, exactly-once consumer recovery, retained first creator artifact and later provenance. Same-source retry must reuse exact retained publication/witness/recovery. Lost caller must resume the accepted head. Reject missing/tampered/stale/session-mismatched witness, second first witness, downgrade, malformed retained evidence, closed campaign and conflicting retry.

## Required validation

Add focused native Chromium failure-injection QA for: first completion from pure creator head; exact applied witness/readback; restart before/after commit; lost caller; missing/tampered/stale witness; two-owner contention; abort/quota at publication writes; consumer abort/retry; later descendants preserving first witness; no second witness/downgrade; malformed retained witness/recovery. Rerun G8B/G8A/G7B/G7A, clean-epoch/publication/Soundings adjacent suites, Node UI config typecheck, app-local Vite build and broad UI characterization against the 137-diagnostic baseline.

## Exclusions and successor

No App cutover, cross-slot quick/manual implementation, lifecycle/reset/delete, activation/reset/deployment, migration for disposable pre-cutover data, combat, dependency or Game-version change. If the witnessed owner verifies, install **DEV-0.7.1 Slice G8E — Cross-Slot Campaign Address Owner Implementation**. G8F real App cutover follows G8E; G9-G10 remain later.
