# Proposed Codex Task: Historical UI PR #10–#16 Exact-Master Semantic Equivalence Audit

<!-- repo-scope-guard -->
> Work **only** in `vagabond1215/Lineage_Reforged`. This is a **non-installed** unversioned review prompt. Do not replace or execute `docs/dev/current-codex-prompt.md`'s independent Character Non-Fungible Gear Owner Cutover And Save Migration task.
<!-- /repo-scope-guard -->

**Package:** S, read-only source review plus focused local tests and a documentation-only report. **Connector-confirmed starting master:** `bcc67be92825cf2aff3af326932e98fd0e938859` as of 2026-11-09; refresh and reconcile all refs before work. Game `0.1.1-prealpha`; `INTEGRATED_LOOP`; `HOLD_SELECTED_ATOMIC_ACTIVATION` remains unchanged. The historical UI PR #5 was **explicitly closed without merge**, and its remote branch retained at `8980ea3875491bf631a18926feb75f90ffa1b55f`. That closure is recorded in `docs/dev/branch-disposition-register.md`, but earlier active-prompt prose may still describe the branch as draft. Do not reopen the PR or reinterpret closure as source merge or selected acceptance.

## Mission and evidence gate

Independently determine whether current-master production owners/callers/tests preserve the essential **historical behavior** and negative regressions from open draft PRs #10–#16. **Do not import historical source or re-run an entire old branch audit.** All eight implementation records and two PR #11 JPGs are already byte-exact archived and current source file paths were compared using exact Git trees. Read only:

- `AGENTS.md`, repository-first-agent protocol, branch policy and register, Codex-vs-Connector procedure, current prompt/output/handoff, and current controlling equipment/non-fungible/Save and UI decisions.
- `docs/dev/historical-ui-prs-10-16-evidence-and-current-source-preflight-2026-11-09.md` for exact PR head matrix, historical blobs, all archival links and specific identity results.
- `docs/dev/historical-ui-pr5-independent-lifecycle-approval-2026-11-09.md` for separately accepted PR #5 supersession and selected-client transfer; it does not approve PR #10–#16 retirement.
- Later authoritative `docs/dev/topbar-dock-main-integration-record-2026-10-24.md`, current Character navigation/selected evidence and relevant non-fungible gear owner decisions; do not rely on old stacked instructions as authority.

Use a clean or fully understood authenticated local checkout. Fetch/prune and check `origin/master`, upstream, tracked/untracked changes and relevant PR heads **without deleting/cleaning or overlaying existing dirty worktrees**. If HEAD differs from the connector checkpoint, classify the delta and compare against *actual* current master. Do not touch protected native-v3 refs.

## Nine distinct changed-byte paths to inspect (no missing source paths)

The connector checked 23 historical changed-file occurrences: **10 byte-identical, 13 different, 0 absent**. Deduplicate the 13 by path and review only these nine different-blob files:

1. `apps/rpg-ui/src/features/characterPanelState.ts` (PR #10/#12/#13)
2. `apps/rpg-ui/src/features/CharacterPanel.tsx` (PR #11/#14)
3. `apps/rpg-ui/tests/equipment-inventory-presentation.test.mjs` (PR #11/#14)
4. `apps/rpg-ui/src/styles/mobile-shell.css` (PR #15)
5. `apps/rpg-ui/tests/mobile-shell-navigation.test.mjs` (PR #15)
6. `apps/rpg-ui/src/components/TopStatusBar.tsx` (PR #16)
7. `apps/rpg-ui/src/components/top-status-layout.css` (PR #16)
8. `apps/rpg-ui/src/game-shell/InGameShell.tsx` (PR #16)
9. `apps/rpg-ui/tests/top-status-bar-render.test.mjs` (PR #16)

The identical file list and exact original/current blobs are in the focused preflight. For each differing path, trace real caller/owner contracts, not merely textual diff. Classify each historical behavior as exactly one of:

- `EQUIVALENT_REAUTHORED`: essential behavior covered differently on current master.
- `ENHANCED_CURRENT`: changed but demonstrably at least as safe/functional.
- `MISSING_REQUIRED_BEHAVIOR`: proven needed behavior absent with a current owner gap.
- `UNRESOLVED`: insufficient evidence. Cite the specific missing verification.

Preserve current Character navigation, item ownership, current top-bar composition, and later decisions even when historical snapshots differ. Byte differences alone never imply regression; byte identity alone never proves full acceptance.

## Focused executable verification

Run **the smallest relevant existing suites** in the correct app/root context, serializing or limiting tests where required. Begin with these likely files, revalidate path/command ownership locally:

- `apps/rpg-ui/tests/equipment-slot-reequip.test.mjs`
- `apps/rpg-ui/tests/inventory-consume-stale-guard.test.mjs`
- `apps/rpg-ui/tests/inventory-exact-bag-target.test.mjs`
- `apps/rpg-ui/tests/inventory-selection-identity.test.mjs`
- `apps/rpg-ui/tests/equipment-inventory-presentation.test.mjs`
- `apps/rpg-ui/tests/mobile-shell-navigation.test.mjs`
- `apps/rpg-ui/tests/top-status-bar-render.test.mjs`

Inspect the correct Node/ESM/Vite test runner and config before invoking. Verify exact validated bag targeting, stale item rejection, no duplicate equip/consume or wrong-stack effects, current UI row selection/ARIA and responsive nav, live owner-backed HP/MP/ST and meaningful conditions. Observe no change to item, state, receipt, witness, or Save contract. Do not run unfocused entire-repository tests merely to fill a report.

Run Node UI typecheck and app-local Vite build **only if needed** for the reviewed scope and available local resource window; for broad UI TypeScript, compare against a clean same-HEAD baseline rather than assuming historic 137 diagnostics are still current. Record exact commands, exit codes, failing signatures and whether each failure is inherited, introduced or environmental. `git diff --check` and changed-path inspection required.

If authorized controlled browser access is genuinely available, a narrow portrait/landscape/keyboard/popover sample may be run, labeled **controlled**. No selected authenticated client/profile/campaign should be assumed or created; no Save mutations or privileged access. Existing screenshots/fixtures are **historical controlled evidence, not selected acceptance**.

## Publication and stop conditions

Publish one concise `docs/dev/historical-ui-prs-10-16-exact-master-semantic-equivalence-audit-2026-11-09.md` (or appropriately dated equivalent) with a **per-PR behavior/owner/real-test/result/missing-evidence matrix** and the nine-file semantic dispositions. List any found gap with an independent **follow-up repair work order**, not inline production edits. Distinguish source semantic proof, executed controlled tests, and authenticated selected-client acceptance. Selected Character/Equipment/Inventory, resource/condition, responsive, keyboard and Save/restart remain assigned to a later independent authorized exact-master review.

If the audit is too large for one coherent resource window, stop after owner/selection (PR #10–#14), publish a durable **partial** evidence matrix, and name the compact shell/top-bar successor (PR #15–#16). Do not discard previous verified work or start all over.

Update the **complete current** branch register, output and handoff minimally **only where repository workflow requires**; do not replace the installed Codex prompt. Commit/push the authorized documentation-only result and verify final remote master/readback. No runtime, test-source, schema, package, native-v3, staging, deployment, account, Save, nutritional, combat, Game-version, PR lifecycle or branch-ref changes.

## Completion status

Report one:

- `UI_HISTORICAL_SOURCE_EQUIVALENCE_REVIEWED; SELECTED_ACCEPTANCE_OUTSTANDING`
- `UI_SEMANTIC_GAP_FOUND; REPAIR_NOT_EXECUTED`
- `UI_SEMANTIC_REVIEW_PARTIAL`
- `UI_SEMANTIC_REVIEW_BLOCKED`

Provide original/current path blobs, current owner/caller, observed tests and non-gates, final publication SHA, changed paths, branch disposition, and **exact next acceptance/repair trigger**. Historical PRs #6–#16 and protected native-v3 references remain retained.
