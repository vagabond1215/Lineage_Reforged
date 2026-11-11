# L1 branded Welcome: connector source preflight and responsibility split

Date: 2026-11-11 (America/New_York). Inspected GitHub `master` `c1441640f586fdb137a78704690d9cb29f781adc`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`.

**Decision: `L1_CONNECTOR_SOURCE_PREFLIGHT_COMPLETE; L1_LOCAL_EXECUTION_PENDING`.** The [L0 local-entry acceptance](first-world-launcher-l0-local-entry-handoff-2026-11-11.md) closes the external exact-master version-selection prerequisite. This source-only connector check does not establish local worktree cleanliness, test baselines, active agent ownership, or L1 implementation acceptance. The user's separate L1 work order authorizes a narrow isolated branch **only if** Codex independently passes these local entry checks.

## Reusable source owners verified on the current ref

- `apps/rpg-ui/src/game-shell/cleanEpochAccountAdapter.ts` exports `CleanEpochAccountAdapter`, including `register`, `signIn`, `selectSession`, `validateSession`. Credential verification and epoch session-hint readback belong to this owner, not to a new Welcome handler.
- `apps/rpg-ui/src/game-shell/cleanEpochLauncherRead.ts` owns `bootstrap` and revision-aware `inventory`. A blocked or corrupt inventory result must never become an invented empty World Library.
- `apps/rpg-ui/src/EpochApp.tsx` currently dispatches `SHOW_MAIN_MENU` at successful bootstrap, sign-in and registration and owns `showMenu`, `enter`, `load`, pending-inventory recovery, session and logout. This is the **narrow integration surface**.
- `apps/rpg-ui/src/game-shell/state.ts` defines `ACCOUNT_ACCESS`, `MAIN_MENU`, `CHARACTER_CREATION`, `LOAD_GAME`, `SETTINGS`, `IN_GAME` and reducer actions; add typed ephemeral Welcome and unavailable-Worlds transitions rather than a parallel store or saved-page string.
- `LocalAccountAccessScreen.tsx` already owns local account forms and their associated management controls. Reuse it or extract presentation-only controls; do not duplicate password flow or remove backup/reset/delete access. Reuse `ShellBrandLogo.tsx` and existing shell styling.
- Tracked UI scripts include `typecheck:node`, `typecheck`, `build`, `dev`, `preview`; the `build` script includes broad TypeScript compilation. Codex must record baseline issues separately from a direct Vite build rather than call a failed combined build green.
- A connector branch-list read returned 81 branches and found **no branch named for L1/Welcome** at this check. Codex must fetch/recheck refs and active worktrees before creating any isolated branch.

## Minimal Codex-only execution

Codex owns operations that this Connector cannot safely perform: inspect the authenticated local worktree and current tests; establish actual baseline and no conflicting owner changes; create one isolated L1 branch; implement the [accepted L1 scope](../design/first-world-launcher-l1-welcome-account-entry-implementation-plan-2026-11-11.md) using existing native-v3 account/session/Save infrastructure; add focused source tests and run required local type/build/browser/keyboard/responsive evidence; verify default feature flag OFF and an unchanged legacy journey; clean task-owned browser/process fixtures; commit/push **only the isolated implementation branch**. No user accounts/Saves, hosted activation, deployment, Game-version change, PR operations, master merge or unrequested changes to the local process manager.

Codex should return a concise evidence packet, **not** perform connector-safe administrative/documentation work: exact base and branch SHA, changed source/test paths, named L1-A01 through A15 outcomes, commands/results including preexisting diagnostics, observed browser version/flow and disposable-origin cleanup, rollback/feature gate, exact blockers, and final process cleanup. If local preflight fails, stop as `L1_ENTRY_HELD` with no source edits. If implementation compiles but required browser evidence fails, return `L1_CODE_READY_BROWSER_HELD` rather than accept L1.

## Connector-owned work after Codex

After the branch/evidence packet arrives, use GitHub Connector to read back the remote branch and diff, independently review owner boundaries, cross-reference tests and L1 matrix, and write the focused L1 decision, `current-codex-output.md`, `current-gpt-handoff.md`, branch register and any stale design pointers. Publish a next-segment prompt **only after** the implementation result is known. Do not predeclare `L1_ACCEPTED_ISOLATED` or merge the branch. Source commits and executable browser proof remain Codex's responsibility; the Connector may inspect but not claim to have executed them.

`HOLD_SELECTED_ATOMIC_ACTIVATION` and `HOLD_STAGING_PUBLICATION` remain. The old completed L0 browser prompt must not be rerun. Local synthetic origin storage may persist and must be scoped/disclosed before claiming cleanup; do not delete unrelated user data. Avoid broad `node.exe` kills and preserve process-control identity checks.
