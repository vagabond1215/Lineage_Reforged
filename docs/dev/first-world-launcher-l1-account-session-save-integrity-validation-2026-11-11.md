# L1 account/session/Save integrity: bounded Connector validation pass

Date: 2026-11-11 (America/New_York). Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`. Candidate: `codex/l1-branded-welcome-account-entry-2026-11-11` at `14aa6380a3a6bb4aae35e0712169c302758d97d5`. Source base: `675ec20843a00cb6d80a6326784ac89263d25bef`. At this review, remote `master` is `426ecd38e1f5858209c79a95d7c04271ae82b5ae` (seven documentation-only commits after the candidate base; candidate itself remains unchanged).

**Decision: `L1_CODE_READY_BROWSER_HELD; L1_ACCOUNT_SESSION_SAVE_INTEGRITY_NOT_YET_PROVEN; HOLD_L1_INTEGRATION_AND_FULL_ACCEPTANCE`.** This is a **read-only Connector source-and-existing-browser-tab pass**, not a local executable QA run. The existing [isolated source review](first-world-launcher-l1-isolated-branch-source-review-2026-11-11.md) remains valid. No candidate code, browser data, Save, local process, protected branch or hosted Site was modified. L2 World identity **research/contract design** may proceed separately, but L2 dependent implementation does not enter until isolated L1 acceptance is supported.

## Evidence available this pass

- GitHub exact commit and diff readback: exactly five candidate files (`EpochApp.tsx`, `LocalAccountAccessScreen.tsx`, new `WelcomeScreen.tsx`, `state.ts`, new `tests/unit/launcher-welcome-routing.test.mjs`). No account adapter, credential store, IndexedDB owner, campaign/Save schema, dependency, game version or deployment change in the L1 diff.
- The candidate source gates Welcome behind native-v3 candidate + `import.meta.env.DEV` + loopback host + explicit `?welcomeL1=1`. Feature-OFF uses `SHOW_MAIN_MENU`; feature-ON uses `SHOW_AUTHENTICATED_WELCOME`, with an unavailable-only `WORLD_LIBRARY_GATE`. Continue does not directly call a campaign load/publish/Save entry point.
- Authentication comes from `CleanEpochAccountAdapter.signIn/register/selectSession`; selected account readback and inventory use `CleanEpochLauncherRead` and `recoverPendingInventory`. This preserves established owner-recovery behavior in source, but recovery may perform legitimate *pending-consumer settlement writes*. Thus an unconditional claim that Welcome performs zero store writes would be incorrect; the proper claim is no **new unauthorized** Save/world mutations on a clean inventory, and exact preservation of existing recovery behavior.
- `EpochApp.logout` removes and rereads the epoch session hint, then clears transient source/revision/address refs and reinitializes. Failure to clear causes a protective blocked screen rather than a success state, by source inspection.
- Existing active Browser tab `http://127.0.0.1:5240/?welcomeL1=1` was read without interaction and displayed an authenticated named Welcome with Continue and Logout. This confirms current rendered state only, not which commit the user-owned Vite process is serving or underlying storage state. Earlier [owner manual observations](first-world-launcher-l1-manual-poc-observations-2026-11-11.md) cover visible sign-in, wrong-password blocking, switching, Continue/Back and Logout, with the documented limitations.
- The candidate adds **three reducer unit tests**. Earlier Codex reports of 15 focused passing tests, Node typecheck, direct Vite build and preexisting broad typecheck diagnostics remain *reported*, not independently executed here. No GitHub Actions workflow run or commit status was returned for the candidate. This environment has read-only browser tab access and no authorized local worktree/test-process access.

## Specific unresolved session-invalidation edge

`CleanEpochAccountAdapter.validateSession(session)` currently compares `session.metadata.epochGeneration` against the retained account lifecycle generation. It does **not** reread the persisted session hint or check whether a different account has since replaced it. That is sufficient to reject a reset/deleted-generation stale session, but **does not itself reject** a prior persistent tab's in-memory session after another tab merely clears or replaces the hint while the same account generation survives.

The L1 Continue caller invokes `validateSession`, compares the account ID and display name with fresh inventory, then opens unavailable Worlds. The fresh inventory is account-scoped, but cannot independently prove that the active browser hint still authorizes the same persistent session. Because `stayLoggedIn=false` intentionally stores *no hint*, any adjustment must preserve valid nonpersistent in-memory sessions rather than naively requiring a hint for all sessions. **Treat this as a source-derived test gap/potential A07 failure, not a demonstrated production exploit or authorization to change the underlying adapter without a focused test.**

Required synthetic negative witnesses: (1) same-account lifecycle reset/delete still rejects stale Continue; (2) persistent session hint removed in a second tab while Welcome is open; (3) persistent hint replaced by a different account in a second tab; (4) `stayLoggedIn=false` same-tab Continue remains usable but full browser restart returns to the picker. Record browser screen/result, hint-presence/identity readback without logging secrets, account revisions, and unchanged Save identities. A failing case must hold L1 and be repaired by a separately scoped change/test, with the original prototype retained.

## L1-A01–A15 matrix at this evidence boundary

`PARTIAL` denotes source reasoning and/or previous manual visible smoke only, **not a passing acceptance row**. `NOT_RUN` denotes required execution/readback absent in this pass. None of the 15 rows can honestly be called fully accepted here.

| Row | Status | Outstanding proof |
| --- | --- | --- |
| A01 fresh account | PARTIAL | Truly empty disposable origin; create-first UI and no auto-created owner row |
| A02 existing accounts without hint | PARTIAL | Picker readback; no retained account assumption |
| A03 retained sign-in | PARTIAL | Persisted hint readback, exact restart, no revision/Save drift |
| A04 non-retained sign-in | NOT_RUN | Same-tab Continue followed by full restart and picker |
| A05 wrong password/create mismatch | PARTIAL | Owner/account/slot byte or revision immutability, create mismatch |
| A06 malformed/stale hint | NOT_RUN | Invalid hint/storage failure remains blocked, not empty-account |
| A07 invalidated session | NOT_RUN | Lifecycle reset/delete and second-tab hint removal/replacement; issue above |
| A08 Continue to Worlds only | PARTIAL | Selected exact-commit route and no Save mutation/readback |
| A09 Back | PARTIAL | Same account/revision, no world clock/head movement |
| A10 Logout | PARTIAL | Readback of hint removal and intact account/slot/artifact archive |
| A11 account switching | PARTIAL | Two-account metadata, slot, artifact and selected-owner isolation |
| A12 blocked/pending/corrupt store | NOT_RUN | Pending recovery, incompatible/corrupt slot, denied IndexedDB, no fake empty |
| A13 feature OFF ordinary Save | PARTIAL | Actual current MAIN_MENU → character/Save → reload witness |
| A14 accessibility/mobile | NOT_RUN | Keyboard focus/Enter/error annunciation, 375/768/1280 widths, essential control legibility |
| A15 exact source and tools | PARTIAL | Independent test/build/baseline comparison plus browser revision identity |

## One narrow executable follow-up (Codex-local only)

1. **Preflight, no mutation:** verify the existing L1 branch head equals the pinned SHA; inspect worktree cleanliness and source owners, use a separate task-owned disposable origin/profile/port, and never stop/repoint the user-owned `127.0.0.1:5240` Vite process. Never run on a real account or stored Save. If exact source/process ownership cannot be established, hold without changing source.
2. **Account/session witnesses:** create two synthetic accounts using the existing native-v3 owner. After setup, capture account revisions, lifecycle generations, profile/credential hashes or redacted equivalence, per-account slot status/head identifiers and immutable artifact/backup digests. Verify retained and nonretained session semantics, rejected password/create mismatch, logout/hint readback, cross-account switch, corrupt/stale hint, reset/delete-generation invalidation, second-tab hint removal/replacement and fail-closed disabled storage. Do not delete a non-synthetic account.
3. **Save boundary witnesses:** at least one synthetic current-format slot and one neighboring synthetic account; compare exact owner-backed account/slot/artifact/archive identity before/after gated Welcome/Continue/Back/Logout. Exercise pending-consumer recovery with known accepted fixture and distinguish legitimate recovery writes from extra changes. Verify unsupported/corrupt slots and unavailable IndexedDB do not silently become empty. On an independent disposable fixture with `welcomeL1` OFF, complete ordinary account → MAIN_MENU → Save → reload readback.
4. **Targeted commands:** run `node --test tests/unit/launcher-welcome-routing.test.mjs tests/unit/launcher-auth.test.mjs`, selected existing native-epoch browser QA (confirm harness entry before invoking), `npm --prefix ./apps/rpg-ui run typecheck:node`, broad UI typecheck with explicit baseline delta and direct Vite build. These commands are **requested future evidence**, not executed here. Tie selected browser witness to the exact candidate commit and report viewport/keyboard observations.
5. **Evidence packet:** return every A01–A15 row as `PASS`/`FAIL`/`NOT_RUN`, the actual commands/counts and baseline diagnostics, source SHA, browser route/source identity, redacted before/after digests, cleanup of only task-owned fixtures, and any reproducible failure. A single unresolved required negative row means **HOLD**, not L1 acceptance.

**Do not change in this pass:** L1 prototype source absent a reproduced focused defect and separate approval; ordinary/hosted entry, Save or world schema, account/credential owner, protected branches, pending publications, real IndexedDB/browser profile data, Game version, deployment, PRs or source branch history. L2 world identity/registry contract remains the next *design* boundary, not permission to implement a live registry.

## Connector-safe follow-up: executable task installed

On 2026-11-11 GitHub Connector installed a new **active, unexecuted** L1 account/session/Save integrity and exact-source browser validation work order at [`docs/dev/current-codex-prompt.md`](current-codex-prompt.md), installation commit `e45c32baf51bf68b3b58e1914aa29e55c395da18`. The completed initial L1 implementation instructions remain in that file as a clearly marked historical section. The fresh order pins `14aa6380a3a6bb4aae35e0712169c302758d97d5`, prevents disturbance of the user-owned `127.0.0.1:5240` origin, requires independently isolated two-account fixtures and all A01–A15 readbacks, and stops on a red integrity witness pending separately scoped repair approval.

This is **task installation, not execution**. No native epoch browser harness, Node typecheck, direct Vite build, account/session/Save digest or cross-tab invalidation has been run by Connector. Retain `L1_CODE_READY_BROWSER_HELD`, `HOLD_L1_INTEGRATION_AND_FULL_ACCEPTANCE` and both selected/hosted activation holds. No source/branch mutation or L2 implementation is authorized by this documentation-only follow-up.

## Connector-only exact-source structural check (S01–S12)

A fresh GitHub read of exact candidate `14aa6380a3a6bb4aae35e0712169c302758d97d5` ran **12/12 source-pattern assertions PASS** in Connector's isolated read-only JavaScript evaluator. This is not Node, UI, native-epoch owner, IndexedDB or browser execution. The checks are: S01 five-file diff only; S02 explicit development/loopback/opt-in gate; S03 feature-OFF menu fallback; S04 sign-in and registration both preserve toggle; S05 Continue reads current session/account and inventory; S06 Continue contains no direct Save/World publisher; S07 logout checks hint removal readback; S08 guarded reducer source states; S09 truthful unavailable Worlds UI; S10 retained account-management callbacks; S11 inventory recovery path retained; S12 exactly three reducer tests in new source file.

Exact sampled blobs: `EpochApp.tsx` `6cdad2916e273e920323515733dbf49893209cf0`, `state.ts` `208d0a17064df898ba4e7dc47dab27613c4c8000`, `WelcomeScreen.tsx` `f1a23d2334934a18c591e3dfa7ed424ffa274e0f`, `LocalAccountAccessScreen.tsx` `109df05ed1808395e334b07d50752dc97c48a454`, `CleanEpochAccountAdapter` `bca17503b53eee7564a18911d61b48aa89beea3d`, and new routing tests `cd2ac19df7a458837e60ca27f91ec3f299878d76`. Source risk flags remain R01 (persistent hint not reread by `validateSession`) and R02 (inventory recovery can legitimately resume/publish pending consumers). String-pattern assertions establish only the current wiring shape, not runtime behavior, zero writes, a secure session or an accepted L1 row. The executable A01–A15 matrix remains **0 fully accepted / 10 partial / 5 not run**; retain all L1 holds.
