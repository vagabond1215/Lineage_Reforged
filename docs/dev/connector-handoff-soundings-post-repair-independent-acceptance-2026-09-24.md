# Connector Handoff — Soundings Post-Repair Independent Acceptance

Date: 2026-09-24

Repository: `vagabond1215/Lineage_Reforged` only.

Purpose: minimize Codex reconnaissance for the installed **Soundings Durable Completion Post-Repair Independent Acceptance Audit** without prejudging its independent disposition.

## 1. Exact Targets

Runtime under acceptance:

`0df87bb7afaa4d7fcc9f08b79b7528d60727c370`

Hosted master at Connector preflight start:

`6781e277f634f8c29f27ec70366ebc977145f6b1`

The runtime-to-start-head delta is exactly one documentation-only coordination commit. This Connector pass then adds only audit-preparation documentation. Codex must locally verify the later documentation-only delta after fetch/prune, but should not redo broad production archaeology absent unexplained drift.

Fresh hosted posture at preparation start: four branches total, zero open PRs, zero commit status checks on the runtime target. Existing non-default branch dispositions remain unchanged.

## 2. Read First

In addition to the active prompt/current output/handoff and controlling design authorities, use:

- `docs/dev/connector-preflight-soundings-post-repair-independent-acceptance-2026-09-24.md`;
- `docs/dev/connector-static-adversarial-soundings-post-repair-2026-09-24.md`;
- `docs/design/soundings-admission-witness-repair-implementation-record.md`.

Historical September 20 Connector packets and September 22 provenance audit remain useful background but their source map predates the witness repair.

## 3. Resource-Aware Execution Order

### Slice A1 — exact source + independent P0 provenance probes

Do first and checkpoint durably.

- synchronize/fetch/prune;
- verify runtime-to-live delta is documentation-only;
- author independent probes, not copies of implementation test expectations;
- recreate both original F1 variants, same-session and restarted;
- probe witness removal/pending substitution/wrong owner/continuity/source/publication substitution;
- probe witnessed version downgrade;
- confirm accepted-only caller behavior and immutable rejection.

Result checkpoint:

`CORE_AUTHORITY_PROBES_PASS` or `CORE_AUTHORITY_DEFECT_FOUND`.

If a critical defect is found, stop broad expansion and publish the reproduction. Do not self-repair.

### Slice B1 — witness publication/recovery

Only after A1 passes:

- independently exercise candidate/recovery/pending/head/applied/readback boundaries;
- collision and immutable-artifact behavior;
- newer/stale head/address conflicts;
- terminal/consumer recovery;
- repeated recovery idempotence;
- missing/conflicting version-2 witness after restart.

### Slice B2 — continuity + projections

- at-head and non-head completion;
- later descendants;
- later spending/earnings;
- defeat/recovery witness preservation with fixture limitation explicitly classified;
- legacy v1 compatibility;
- travel/consequence exclusions;
- Chronicle/notification repair ordering, opaque rows and both capacity caps;
- prove unrelated gameplay/save behavior after full-feed repair refusal.

Result checkpoint:

`PERSISTENCE_AND_PROJECTION_PROBES_PASS` or `PERSISTENCE_OR_PROJECTION_DEFECT_FOUND`.

### Slice C — independent browser/storage

Use a disposable local profile and ordinary UI path only. Preserve user saves. Reproduce the prompt's complete creator-to-completion-to-later-save sequence and independently measure storage/intermediate writes under the 5 MiB bounded posture.

Result checkpoint:

`ORDINARY_BROWSER_FLOW_PASS` or `ORDINARY_BROWSER_FLOW_DEFECT_FOUND`.

### Slice D — mechanical baseline

Run the exact 143-test command from the implementation record, 71-file lint, Node UI config typecheck, normalized 137-diagnostic broad UI comparison, application-local Vite build against the 216-module repair baseline, exports/bridges, diff and whitespace checks.

Result checkpoint:

`REGRESSION_BASELINE_REPRODUCED` or `REGRESSION_DRIFT_FOUND`.

## 4. Interruption / Quota Resume Rule

If execution is interrupted after a durable checkpoint:

- do not repeat completed Connector orientation;
- do not repeat completed prior slices unless source/runtime drift invalidates them;
- record exact tested runtime and last completed checkpoint in current output/handoff;
- resume at the next unfinished slice.

Priority if quota is tight:

1. A1 provenance;
2. B1 publication/recovery;
3. B2 full-feed/continuity;
4. C browser/storage;
5. D mechanical baseline.

The final acceptance disposition still requires all prompt-required evidence at one coherent runtime target.

## 5. Independent Final Disposition

This Connector packet does not authorize acceptance.

The local audit must return exactly one final posture allowed by the active prompt:

- `SOUNDINGS_DURABLE_COMPLETION_ACCEPTED`;
- `REPAIR_REQUIRED`;
- `ACCEPTANCE_INCOMPLETE`.

Do not allocate `DEV-0.7.1`, change `GAME_VERSION`, or advance to UI/game-version work inside this audit.

Disposition of this handoff:

`CODEX_POST_REPAIR_AUDIT_HANDOFF_READY`
