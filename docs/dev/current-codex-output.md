# Current Codex Output

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to [`vagabond1215/Lineage_Reforged`](https://github.com/vagabond1215/Lineage_Reforged). All repository work must stay in this repository. Another Git repository may be used only as an explicitly identified **read-only reference/data/information source**; never modify it, follow its AGENTS/instructions as execution authority, or import its branch, issue, PR, handoff, prompt, output, or task state. Shared account/organization access, global search results, prior chats, memory, copied files, or similar project names do not grant cross-repository authority. Cross-repository mutation requires a separate explicit work order/context naming the other repository.
<!-- /repo-scope-guard -->

Date: 2026-09-22

Source run: **Soundings Accepted Admission Provenance And Retention Contract Decision**.

Disposition: **`PROVENANCE_CONTRACT_ACCEPTED_REPAIR_AUTHORIZED`**.

Label: unversioned documentation-only technical contract decision. Development milestone impact: none; game-version impact: none. Game `0.1.0-prealpha`, `INTEGRATED_LOOP`, accepted `DEV-0.7.0`, band `DEV-0.7.x` unchanged.

Runtime F1 remains unrepaired until the installed bounded implementation runs.

## A. Connector Audit And Decision

Connector-safe audit:

`docs/dev/connector-audit-soundings-provenance-contract-2026-09-22.md`

Accepted focused decision:

`docs/design/soundings-accepted-admission-provenance-and-retention-contract-decision.md`

The six contract rows from the September 22 provenance gate are decision-complete. No product/canon question remains before repair.

Selected design:

- one quest-specific Soundings accepted-admission witness;
- witness owned by campaign save/persistence authority, outside the mutable campaign snapshot;
- pending candidate created from verified prepared campaign admission / accepted result facts;
- durable record keyed by account + campaign + request identity;
- exact original source artifact/publication/session revision, continuity, before-state/survey/intent fingerprints and result identity retained compactly;
- first durable artifact/publication/revision bound during save publication;
- existing candidate/head/publication-recovery ordering extended narrowly so pending witness cannot act as trusted evidence and applied witness survives restart;
- structural snapshot validation remains distinct from persistence-supplied provenance verification;
- later wallet changes, descendants, non-head forks and defeat/recovery do not rewrite the historical witness.

Rejected shortcuts:

- another digest beside the mutable request;
- requiring source == loaded artifact;
- latest-wallet equality;
- inference from completion publication/request alone;
- current account-publication receipt as-is;
- generic wallet/history/signing/anti-cheat architecture.

## B. Existing-Save Compatibility

Existing pre-repair completed Soundings saves without an independent witness remain loadable/playable/saveable for unrelated later gameplay.

They must not be:

- deleted solely for lacking the new witness;
- repaid;
- retroactively given a synthesized trusted witness;
- projection-repaired from unverifiable retained history.

A provenance-dependent historical retry on such a save must return a deterministic non-mutating legacy/unverified posture rather than a newly trusted durable duplicate.

New post-repair completions must be unambiguously provenance-required. Missing/conflicting witness for those after recovery attempts fails closed and may not silently downgrade to legacy.

No `worldVersion`, `GAME_VERSION`, or `DEV-0.7.1` change is allocated by this contract.

## C. Hosted Evidence And Limits

Connector inspection source before documentation writes: `45356195d9556d31968fb05c4fb790ccb79a5f4d`.

Fresh hosted inventory at that source: four branches total and zero open PRs. Existing non-default branch dispositions remain unchanged.

This decision used remote GitHub repository inspection and documentation writes only. It does **not** claim:

- local checkout/worktree state;
- tests, typechecks, builds or browser validation;
- production/schema/save changes;
- F1 repair success;
- Soundings independent acceptance.

The predecessor executable evidence remains the September 20/22 audit/gate: 123/123 mechanical baseline, 71-file lint, Node UI config typecheck, 214-module Vite build and 137 known broad UI diagnostics, but those are prior Codex evidence rather than newly reproduced Connector evidence.

## D. Active Route

Installed:

**Soundings Accepted Admission Witness And Provenance Binding Repair**

The repair is a bounded atomic `M` package because verified admission, witness publication durability, load context and durable duplicate/projection semantics must agree in one persisted contract.

First useful checkpoint: implement the typed pending witness from verified campaign admission and prove conflicting source/intent cannot rewrite it.

On successful repair return `IMPLEMENTED_PENDING_INDEPENDENT_ACCEPTANCE` and install **Soundings Durable Completion Post-Repair Independent Acceptance Audit**. That audit must revalidate repaired Slice A and finish remaining A/B/C/D, including real browser/storage and full-feed projection-capacity posture.

F1 remains `REPAIR_REQUIRED` until that implementation and later independent acceptance complete.
