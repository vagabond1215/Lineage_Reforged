# DEV-0.7.1 Slice G8E — Cross-Slot Campaign Address Owner Implementation

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-09-30. Internal implementation slice of planned primary `DEV-0.7.1`; parent, Game version and live activation remain held. Controlling authority: `docs/design/g8c-first-witnessed-descendant-and-cross-slot-authority-decision.md`, then the G8D checkpoint, G8B/G6 and accepted persistence/Soundings authority.

## Objective

Implement only the accepted **cross-slot manual/quick campaign address owner** in the inert clean epoch. Preserve one singular campaign head. A verified source session may produce one ordinary descendant while a distinct destination slot becomes a durable address to that new immutable artifact/publication; the source slot keeps its previous address. Loading an older address must reconstruct non-head session control against the current campaign head, and its next mutation must fork under the accepted continuity contract. Never delete or rewrite old artifacts or source addresses to make a destination loadable.

In one IndexedDB transaction validate the exact source artifact/publication/continuity, expected campaign head, account revision, destination's supplied expected address (empty or exact prior artifact/publication), destination campaign compatibility, target artifact, pending recovery and consumer plans. Destination overwrite must use CAS; a changed destination conflicts without altering source or history. Account history and consumer fingerprints use the destination address exactly once. Same-source retry preserves the exact artifact/head/destination/recovery; lost caller resumes that accepted publication without another save. Complete consumers exactly once and report success only after exact playable destination readback. Preserve G8D first Soundings witness introduction and later provenance across both same-slot and cross-slot paths.

## Required validation

Add focused native Chromium IndexedDB failure-injection QA for manual-to-quick and quick/historical-to-manual saves, empty and occupied destination CAS, two-owner destination races, source address preservation, overwritten artifact retention, non-head fork, exact destination load/readback, same-source retry, lost caller/restart, stale head/account/source, conflicting destination campaign, malformed address, pending unrelated recovery, abort/quota at every publication write, consumer abort/retry and first/later Soundings provenance across slots. Rerun G8D/G8B/G8A/G7B/G7A and clean-epoch/publication/Soundings adjacent suites, Node UI-config typecheck, app-local Vite build and broad UI characterization against the 137-diagnostic baseline. Separate owner proof from ordinary App UI acceptance.

## Exclusions and successor

No real App switch, lifecycle/reset/delete, coordinated activation or browser reset/deployment, migration for disposable pre-cutover data, combat, dependency or Game-version change. If the cross-slot owner verifies, install **DEV-0.7.1 Slice G8F — Real Async App Caller Cutover And Ordinary UI QA**. G9-G10 remain later.
