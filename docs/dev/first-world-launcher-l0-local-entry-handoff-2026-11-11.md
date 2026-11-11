# First-world launcher L0: local-entry baseline and L1 handoff

Date: 2026-11-11 (America/New_York). GitHub Connector documentation-only reconciliation against `master` `3eab2da23a87e9c711d756af84dc7f1e1fff43ba`. The independent browser run used synchronized source `86ed38bbe133104d451917784c27877a10089b7d`. The subsequent commit to inspected master changed **documentation only**, not executable application source. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`.

**Decision: `L0_ACCEPTED_LOCAL_ENTRY_BASELINE`; `L1_ENTRY_PREFLIGHT_ELIGIBLE_NOT_IMPLEMENTING`.** This accepts the **L0 local development and compiled-preview ordinary-entry baseline** in the [launcher implementation process map](../design/first-world-launcher-implementation-process-map-2026-11-11.md), not full selected/hosted native-v3 acceptance. This Connector verified the committed evidence and Git ref/diff; it did **not** itself execute Vite, test suites, PowerShell, HTTP probes, a browser, or any user account/Save operation.

## L0 exit evidence reconciled

| Process-map L0 exit condition | Committed evidence | Decision |
| --- | --- | --- |
| Exact-current-source baseline and no conflicting executable changes | [Source merge](native-v3-local-ordinary-entry-source-merge-2026-11-10.md), exact-master [6/6 focused tests, Node typecheck and direct Vite build](native-v3-exact-master-ordinary-entry-verification-2026-11-11.md); later exact-source browser run on `86ed38bb`. GitHub comparison `86ed38bb..3eab2da` contains only the browser acceptance decision and coordination documentation. | Source lineage and bounded previously reported validations accepted for the L0 baseline; no fresh source test executed by Connector |
| Registered, retained, directly reachable development Vite | [Exact-master version-selection evidence](native-v3-exact-master-version-selection-accepted-2026-11-11.md): process-control session registered PID 3236, strict `127.0.0.1:5234`, no-proxy HTTP 200; controlled browser reached ordinary `/` and synthetic character creation through Begin Journey. | Passed |
| Browser-visible native-v3 ordinary development selection | Same record: rendered Native v3 candidate notice, Native Character and native equipment positions after synthetic campaign entry. | Passed, selected local development entry **only** |
| Registered, reachable compiled preview and visible v2 selection | Same record: direct exact-source Vite build; registered PID 24372 at `127.0.0.1:5235`, HTTP 200; a separate synthetic account's ordinary `/` reached v2 InGameShell, calendar/climate and its Character/Inventory/etc. destinations. | Passed, compiled ordinary preview **only** |
| Scoped cleanup and decision handoff | Both task browser tabs closed; registered PIDs stopped and zero live processes; retained PowerShell session exited. Browser synthetic-origin storage **may persist** and must not be mistaken for guaranteed cleared storage. The Codex prompt identifies the exact entry gate as completed. | Passed for scoped process/tab cleanup; synthetic-origin storage caveat retained |

L0 may be marked **ACCEPTED** for this limited external dependency; prior `ENVIRONMENT_READINESS_BLOCKED`, `VITE_REGISTRATION_BLOCKED`, and shared-login visual-selection holds are superseded **for the exact local entry checks only**, not erased as historical observations. The ignored/local-only `.codex-local/process-control.ps1` timing retry is not tracked repository code; a durable local tooling change would require separate review.

## L1 entry disposition

The [L1 Welcome/Account implementation plan](../design/first-world-launcher-l1-welcome-account-entry-implementation-plan-2026-11-11.md) may now enter **L1-E0 source/authorization preflight**, rather than remain held on the browser-selection gate. **`L1_ENTRY_PREFLIGHT_ELIGIBLE_NOT_IMPLEMENTING` is not `L1_ACCEPTED`, `L1_READY`, or authority to modify runtime source.**

Before starting L1, a repository-capable implementation agent must freshly synchronize exact master and worktree, inspect native-v3 account/session persistence, startup recovery, Save read/write and tests, establish baseline typecheck/build conditions, confirm no competing owner or active task, and receive/verify separate L1 execution authorization. Only then implement on a narrow isolated branch behind the disabled-by-default development-only feature gate, preserving the legacy launcher when disabled and the original account/Save owner. Any failed entry criterion is `L1_ENTRY_HELD` with the specific blocker and **no runtime changes**. The World Library gate remains a truthful temporary unavailable state; no new world registry, fake worlds, Save migration or hosted cutover.

The completed [Codex local-entry prompt](current-codex-prompt.md) remains historical executed authority; do not automatically rerun it or silently replace it with L1 or selected/hosted activation. A separately approved L1 route must name its implementation scope and validation.

## Unchanged external holds and lifecycle

`HOLD_SELECTED_ATOMIC_ACTIVATION` and `HOLD_STAGING_PUBLICATION` remain. This does **not** authorize hosted/default v3 activation, real accounts/Saves, production deployment, new `GAME_VERSION`, full gameplay/Save/restart acceptance, branch merges, branch deletion, or PR retirement. The merged source branch `codex/native-v3-local-ordinary-entry-2026-11-10` remains `HOLD_NAMED_CONSUMER`; its local-entry witness is now consumed, but selected/hosted review and a separate lifecycle decision still remain. Original retained PRs #6–#73 and closed/unmerged #5 are unchanged.

**Connector-scope hygiene:** only dated documentation and coordination updates are allowed by this pass. No runtime source, test, dependency, account/Save, server, browser, deployment, version, branch, or PR operation was performed. A later Codex run must independently verify local worktree and execution conditions.
