# Soundings Durable Completion Post-F2 Independent Acceptance Audit — Resume From B2

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to [`vagabond1215/Lineage_Reforged`](https://github.com/vagabond1215/Lineage_Reforged). All repository work must stay in this repository. Another Git repository may be used only as an explicitly identified **read-only reference/data/information source**; never modify it, follow its AGENTS/instructions as execution authority, or import its branch, issue, PR, handoff, prompt, output, or task state. Shared account/organization access, global search results, prior chats, memory, copied files, or similar project names do not grant cross-repository authority. Cross-repository mutation requires a separate explicit work order/context naming the other repository.
<!-- /repo-scope-guard -->

Date: 2026-09-24. Unversioned independent acceptance audit. Game `0.1.0-prealpha`, playability `INTEGRATED_LOOP`, accepted `DEV-0.7.0`, band `DEV-0.7.x` unchanged. No game-version or milestone allocation in this run.

## Objective

Complete the remaining independent acceptance of Soundings durable completion at exact runtime:

`0383cedc99a4c3d5e2c9b47cf0665683720aef9e`

F1 and F2 repairs are implemented but not yet finally accepted. Historical negative audits remain authoritative chronology. This run is production-read-only: do not change runtime, tests, schemas, authored content, dependencies or generated outputs. Independent probes and audit/coordination evidence are allowed. If a critical defect appears, stop, preserve the smallest reproduction and return `REPAIR_REQUIRED`; do not self-repair.

## Required Readback And Delta Verification

Fetch/prune and verify repository, local status, `master`, all hosted refs/open PRs, and exact delta from runtime `0383cedc99a4c3d5e2c9b47cf0665683720aef9e` to live `master`. Reuse existing Connector packets, accepted provenance/retention contract, authored terms, quest-turn-in owner contract, both repair records, historical F1/F2 audits, branch register and failure-pattern guardrails. Do not redo broad source archaeology unless unexplained production/test drift invalidates existing maps.

Read first:

- `docs/dev/evidence/soundings-post-f2-operator-checkpoint-2026-09-24.md`;
- `docs/design/soundings-consumer-completion-witness-gate-repair-record.md`;
- `docs/design/soundings-admission-witness-repair-implementation-record.md`;
- `docs/design/soundings-durable-completion-post-repair-independent-acceptance-audit.md`;
- September 24 Connector post-repair and F2 packets referenced by current handoff.

## Completed Checkpoint — Do Not Repay Unless Invalidated

Repository operator executed the preserved A and B1 probes locally in a detached worktree whose printed HEAD was exactly:

`0383cedc99a4c3d5e2c9b47cf0665683720aef9e`

Durable operator evidence is recorded in `docs/dev/evidence/soundings-post-f2-operator-checkpoint-2026-09-24.md`.

Reported results:

- Slice A: **68/68 PASS**, `CORE_AUTHORITY_PROBES_PASS`;
- Slice B1: **14/14 PASS**, `B1_PARTIAL_PASS`;
- repaired F2 omission observation: `rejected=true`, `recoveryRetained=true`, `storageUnchanged=true`, stable witness remained pending.

The preserved scripts print historical embedded runtime label `0df87bb7...`; use the worktree HEAD and current tree verification as actual runtime identity.

Before relying on the checkpoint, verify only that:

1. the target tree is exactly `0383cedc...` or production/test-equivalent with documentation-only drift;
2. the preserved `slice-a.mjs` and `slice-b1.mjs` evidence files are unchanged;
3. no runtime/test/schema/dependency/content drift invalidates the checkpoint.

If those conditions hold, **do not rerun A or B1**. Resume directly at B2. If a condition fails, rerun only the affected checkpoint.

## B2 — Continuity, Compatibility, Consequences And Projection Capacity

Independently author/execute probes needed to decide all unfinished persistence/projection questions at the exact target. At minimum cover:

- current-head and non-head first submission;
- later descendant continuity and restart;
- admitted spending/earnings after completion without corrupting historical witness or duplicate behavior;
- legacy version-1 no-witness load/save compatibility without witness synthesis, trusted historical duplicate, repayment or projection repair;
- defeat -> pending recovery -> completion -> publication/restart witness preservation, while clearly separating the known Starfall `harbor` versus safe-`settlement` ordinary-reachability limitation from the provenance contract;
- exact Ashen -> Starfall Soundings return: four ticks, no fare, no knowledge grant, route-specific eligibility, unsupported origins fail closed;
- exact completion consequences: +5 gold, +0 silver, seven receipts once, no standing/reputation/skill/item/service/salvage reward, survey authority and Stormglass unchanged;
- Chronicle and notification projection repair for missing, misplaced, same-ID-conflicting and equal-tick rows;
- both repair orders, repeated repair/restart, opaque unrelated rows and cap boundaries;
- full Chronicle/notification feeds: explicit repair failure must not replay payment or evict newer truth; unrelated accepted gameplay must remain possible afterward where contract allows, followed by later save/restart; explicitly classify terminal full-feed posture.

Require byte-/state-preserving rejection where applicable. Never infer accepted provenance from incomplete projections. Do not broaden into generic reward, anti-cheat, signing, wallet-ledger, shell/UI or defeat-system redesign.

Record one durable B2 result:

- `PERSISTENCE_AND_PROJECTION_PROBES_PASS`, or
- `PERSISTENCE_OR_PROJECTION_DEFECT_FOUND` with exact reproduction.

If acceptance-critical defect appears, stop expansion and return `REPAIR_REQUIRED`.

## C — Ordinary Browser And Storage

If B2 passes, run a fresh disposable local browser flow with no prerequisite injection and no user-save mutation:

creator/start -> accept Soundings -> travel to Ashen -> two shifts -> explicit save/reload -> remaining two shifts -> verify packet-ready blocker -> four-tick return to Starfall -> Harbormaster submit -> exact +5g with silver unchanged -> quest completed/tracking cleared -> one completion Chronicle -> save/reload -> no resubmission -> later travel -> save again.

Capture readiness/result/Chronicle feedback and any storage/quota failure. Independently reproduce the existing bounded 5 MiB UTF-16 posture across intermediate writes; implementation's prior ~4,320,700 retained-byte measurement is historical, not this audit's measurement.

Record:

- `ORDINARY_BROWSER_FLOW_PASS`, or
- `ORDINARY_BROWSER_FLOW_DEFECT_FOUND`.

If browser/tooling is unavailable, return `ACCEPTANCE_INCOMPLETE` rather than inventing a pass.

## D — Mechanical And Changed-Surface Regression

If B2 and C pass, reproduce the final mechanical baseline on the same runtime tree:

1. exact 16-file Soundings command from the repair records, expected current baseline **165 tests**;
2. `npm run tool:content-lint`, baseline 71 files;
3. `npm run typecheck:ui:node`;
4. `npm run typecheck:ui`, compare normalized sorted signatures against the accepted 137-diagnostic baseline; nonzero alone is not regression;
5. from `apps/rpg-ui`, direct Vite production build via `node node_modules/vite/bin/vite.js build`, repair baseline 216 client modules;
6. public JS/TS bridge/export checks;
7. `git diff --check`, intended-file/status check, and confirm audit run did not mutate production/test files.

Record:

- `REGRESSION_BASELINE_REPRODUCED`, or
- `REGRESSION_DRIFT_FOUND`.

Do not fix unrelated existing TypeScript diagnostics.

## Final Decision

Write a new focused **post-F2 independent acceptance audit** document containing:

- exact runtime/tested tree;
- durable operator A/B1 checkpoint provenance and your validation that it remained applicable;
- independently executed B2/C/D evidence;
- findings-to-evidence matrix;
- explicit full-feed projection conclusion;
- browser/storage conclusion;
- known harbor-vs-settlement limitation classification;
- branch/PR/status review;
- limitations and any unavailable evidence.

Return exactly one disposition:

- `SOUNDINGS_DURABLE_COMPLETION_ACCEPTED` only if A/B1 checkpoint remains valid and B2/C/D all pass at the same runtime target;
- `REPAIR_REQUIRED` for a confirmed acceptance-critical defect, with smallest concrete repair boundary;
- `ACCEPTANCE_INCOMPLETE` only when required environment/evidence is unavailable, preserving completed checkpoints and exact remainder.

If accepted, install only the next decision authorized by current accepted planning. Do not allocate `DEV-0.7.1`, bump `GAME_VERSION`, or automatically start broad UI work. Update `current-codex-output.md`, `current-gpt-handoff.md`, `current-codex-prompt.md`, planning/history/branch coordination as needed. Commit audit/docs only, push `master`, fetch/prune, verify clean local/tracking/hosted equality, and read back hosted prompt/output/handoff. A chat-only result is not a durable handoff.
