# Current GPT Handoff

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to [`vagabond1215/Lineage_Reforged`](https://github.com/vagabond1215/Lineage_Reforged). All repository work must stay in this repository. Another Git repository may be used only as an explicitly identified **read-only reference/data/information source**; never modify it, follow its AGENTS/instructions as execution authority, or import its branch, issue, PR, handoff, prompt, output, or task state. Shared account/organization access, global search results, prior chats, memory, copied files, or similar project names do not grant cross-repository authority. Cross-repository mutation requires a separate explicit work order/context naming the other repository.
<!-- /repo-scope-guard -->

Date: 2026-09-24. Active route: **Soundings Publication Consumer Completion Witness Gate Repair**. Latest independent acceptance: **REPAIR_REQUIRED**, F2. Game `0.1.0-prealpha`, `INTEGRATED_LOOP`, accepted `DEV-0.7.0` unchanged.

Runtime `0df87bb7afaa4d7fcc9f08b79b7528d60727c370`; audit source `c4911cdc13c2e57927ee10ed1a5f40ac4d6de72e`. Audit publication at `918b092ad3b911dd9804dd87aad1d06d2cc3736e` changes docs/probes only; later Connector F2 preparation also changes documentation only. Verify live delta after fetch and do not redo broad archaeology absent unexplained production drift.

A1 independent 68 cases pass. B1 13 prerequisites/control pass, then preserved probe exits 1 on F2: removing recovery witness/fingerprint allows exported consumer completion to clear head_verified recovery while stable witness is pending. Unchanged record rejects. Ordinary UI reachability is not established; App startup/publication gates run first. This still violates the accepted owner cleanup boundary. No production repair has occurred yet.

Fresh F2 Connector packets:

- `docs/dev/connector-audit-soundings-f2-consumer-boundary-2026-09-24.md` — owner-boundary invariants and reusable validation seam;
- `docs/dev/connector-map-soundings-f2-callers-and-reachability-2026-09-24.md` — startup/save/terminal caller ordering and reachability qualification;
- `docs/dev/connector-matrix-soundings-f2-regression-2026-09-24.md` — focused desired-behavior regression matrix;
- `docs/dev/connector-preflight-soundings-f2-repair-2026-09-24.md` — exact-head/delta/branch/PR preflight.

Static repair direction is narrow: derive whether witness provenance is required from the validated retained publication envelope/snapshot, not optional recovery-sidecar presence; if version-2 completed Soundings requires provenance, require the expected recovery witness/fingerprint and durable identity before any consumer-completion write or recovery deletion. Reuse existing save-owner validation (`readRecoveryEnvelope`, stable/persisted witness validation, `retainRecoveryWitness`) and preserve genuine no-Soundings/legacy-v1 behavior, idempotent valid completion, and terminal cleanup after intentional address deletion without recreating a playable address.

Current prompt supplies exact implementation and verification. First reproduce preserved B1; then implement the smallest save-owner gate and focused tests; rerun B1 and independent Slice A, then the 143-test baseline plus new tests/lint/type/build. B2 continuity/full-feed, C browser/storage and D mechanical were stopped, not passed. After repair install separate full independent acceptance on one runtime target; no self acceptance or version increment.

Fresh preflight found four hosted branches and zero open PRs. Existing retained branch dispositions/triggers remain authoritative; no lifecycle action due. Connector preparation is now complete for F2. Further meaningful progress requires local authenticated production/test edits and executable validation. No external research or additional plugin is needed.
