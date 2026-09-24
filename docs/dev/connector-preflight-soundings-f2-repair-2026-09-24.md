# Connector Preflight — Soundings F2 Consumer-Completion Repair

Date: 2026-09-24

Repository: `vagabond1215/Lineage_Reforged` only.

Posture: Connector-safe exact-head/delta preflight for the active bounded repair.

## Exact Runtime And Hosted Head

F2 runtime source remains:

`0df87bb7afaa4d7fcc9f08b79b7528d60727c370`

Hosted `master` at preflight start:

`918b092ad3b911dd9804dd87aad1d06d2cc3736e`

Compare runtime -> hosted head is seven commits ahead. The changed-path inventory is documentation and audit evidence only: design/dev Markdown plus the independent `slice-a.mjs` and `slice-b1.mjs` evidence probes. There is no production, implementation-test, schema, dependency, content, asset or generated-runtime drift after `0df87bb...`.

The immediately previous Connector-prepared source `c4911cdc13c2e57927ee10ed1a5f40ac4d6de72e` -> `918b092...` is exactly one audit-publication commit, also docs/evidence only.

## Hosted Coordination Posture

Fresh hosted branch search returns four branches:

- `master`;
- `prep/integrated-gameplay-0-7-readiness-audit`;
- `parallel/prompt-packaging-integrity-audit`;
- `admin/genesis-research-evidence-2026-08-13`.

Fresh scoped PR search returns zero open pull requests.

No branch lifecycle action is indicated by this F2 repair. Existing protected/held dispositions remain authoritative in `branch-disposition-register.md`.

## Current Active Route

`docs/dev/current-codex-prompt.md` installs **Soundings Publication Consumer Completion Witness Gate Repair**, package S.

The latest independent audit is `REPAIR_REQUIRED` for F2. Slice A1 passed 68 independent cases. B1 stopped on the consumer-cleanup omission defect. B2/C/D were not executed and must not be described as accepted.

## Connector Packets For This Repair

Read these before local implementation:

- `docs/dev/connector-audit-soundings-f2-consumer-boundary-2026-09-24.md`;
- `docs/dev/connector-map-soundings-f2-callers-and-reachability-2026-09-24.md`;
- `docs/dev/connector-matrix-soundings-f2-regression-2026-09-24.md`.

Historical September 24 post-repair Connector packets remain useful for broader Soundings context, but the three files above are the shortest exact-owner orientation for F2.

## Codex Delta-Verification Start

After fetch/prune, Codex should verify that all changes after `0df87bb...` remain docs/evidence until its own production repair. If true, it can start directly at:

1. reproduce preserved B1 defect;
2. inspect `completeCampaignPublicationConsumers(...)`, `readRecoveryEnvelope(...)`, `retainRecoveryWitness(...)`, and existing recovery tests;
3. implement the smallest save-owner gate;
4. add focused regressions from the Connector matrix;
5. run prescribed validation.

Broad repository archaeology, new product design, UI work and generic provenance redesign are not justified by current evidence.

## Connector Disposition

`F2_REPAIR_PREFLIGHT_COMPLETE`

Production remains unchanged at this checkpoint.
