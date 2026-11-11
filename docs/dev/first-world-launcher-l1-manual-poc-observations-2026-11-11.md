# L1 branded Welcome: owner manual proof-of-concept observations

Date: 2026-11-11 (America/New_York). Documentation-only GitHub Connector capture against remote `master` `9de85db89eea01b8de936f1d0ffbfcdc4f063386`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`.

**Disposition: `L1_CODE_READY_BROWSER_HELD; MANUAL_FUNCTIONAL_SMOKE_PARTIAL; COSMETIC_POLISH_DEFERRED`.** The user prioritizes an **actually useful, safe functional proof of concept** over visual polish. This does not waive account/session/Save integrity, blocked-state handling, key access or exact-source acceptance. The reported L1 work remains **local and uncommitted** on `codex/l1-branded-welcome-account-entry-2026-11-11`; no remote implementation branch or commit SHA exists for Connector source acceptance at this snapshot. The connector did not access the local worktree or run a browser.

## User-provided manual evidence

The user started Vite themselves from the L1 worktree with `npm run dev -- --host 127.0.0.1 --port 5240 --strictPort`; the supplied PowerShell output reported a ready listener and direct HTTP `200 OK`. The user supplied Brave screenshots showing:

- `http://127.0.0.1:5240/` (also screenshots with a non-opt-in `utm_source` parameter): the existing Character/Save launcher still renders when the L1 feature is not explicitly enabled.
- `http://127.0.0.1:5240/?welcomeL1=1`: the branded, signed-out Welcome/account-selection screen renders; an authenticated Welcome visibly names the synthetic `test_account` and presents Continue/Logout.
- Continue visibly opens the unavailable Worlds screen with a truthful `World Library not ready` message and Back control. The user explicitly reports **Back and Logout work as expected**.
- The user reported, and screenshots show, text overlapping the lower part of the existing logo on several Welcome/Worlds states. This is a **known, deferred cosmetic/layout issue** during prototype development, subject to retaining readable, operable essential controls. It is not permission to hide a broken login or inaccessible primary interaction.

### Additional owner manual account-flow observations

The user separately reports the following results from the visible Welcome/login user interface on the local feature-gated branch:

| Visible check | User observation | Evidence limit |
| --- | --- | --- |
| Persistent login | **Works**, with the expected signed-in Welcome visible | Does not establish the retained hint's storage/readback, lifecycle generation, or restart semantics beyond the interactions actually exercised |
| Logout | **Works correctly** in the visible UI | Does not independently establish session-hint removal readback, underlying account/Save retention, or clearing of all stale references |
| Invalid password | **Login is blocked**, with no visible authentication success | Does not independently prove verifier integrity, metadata immutability, or account revision behavior |
| Switching accounts | **Works appropriately** for the displayed account identity | Does not independently verify isolation of hidden account metadata, slot inventories, IndexedDB owner keys or campaign/Save data |

These are credible **user-reported manual functional smoke results**, not connector/browser automation, storage inspection, backend metadata tests, or a formal complete acceptance matrix. They support the visible behavior of applicable portions of **L1-A03/A05/A10/A11** without proving the entire negative/integrity criteria. No account IDs, passwords, verifier fields or user data were accessed through this Connector.

The earlier Codex report supplied **15 focused Node test passes**, passing `typecheck:node`, baseline-blocked broad UI typecheck without named modified-file diagnostics, and a passing direct Vite build. Those results are **Codex-reported, not independently re-executed by Connector**; their exact code revision/branch is not remotely inspectable while local changes remain uncommitted. Computer Use halted because it could not confidently determine the Edge URL, so no tool-driven L1-A01–A15 browser acceptance was recorded.

## Evidence boundaries and functional next checks

The observations provisionally support the visible route and navigation portions of **L1-A08/A09/A10/A13**, plus a partial signed-out/authenticated rendering witness; they do **not** prove absence of account/Save writes, full logout hint-clearing readback, persistence semantics, keyboard/focus/accessibility, or any unobserved negative case. Do not report any entire L1-A01–A15 row as accepted from screenshots alone.

Prioritize the remaining safety and utility checks over cosmetic layout iteration:

1. Confirm feature OFF retains the normal, actually working Save/character path, not just the menu screenshot.
2. Preserve the user's **visible** confirmations of persistent login, wrong-password rejection, logout and account switching. Verify session-hint storage/removal readback and lifecycle generation; test stay-signed-in **both on and off** and invalidated/stale session blocked on Continue, without treating the UI smoke as backend acceptance.
3. Verify **underlying** two-account metadata/slot/campaign isolation (visible account switching was user-confirmed), plus damaged/blocked IndexedDB and pending/corrupt slot behavior: remain fail-closed, never invent empty Worlds or alter user Saves.
4. Confirm keyboard access, readable/form-associated errors, basic narrow-screen primary controls, and appropriate disabled/busy behavior. Fine-grained spacing, ornate logo treatment, alignment, and decorative hierarchy can be revisited when World Library and character entry are functional.
5. Preserve and commit/push **only** the isolated L1 implementation branch once its local source diff is reviewed, even if browser acceptance stays held. Then use GitHub Connector for independent code/test review and focused coordination. If formal L1 checks remain pending, retain `L1_CODE_READY_BROWSER_HELD` or a more precise named hold; do not claim `L1_ACCEPTED_ISOLATED`.

**Release boundary unchanged:** feature stays disabled by default; no World registry, Save migration, automatic deployment/activation, real-account destructive test, branch merge, PR operation, or Game version change. `HOLD_SELECTED_ATOMIC_ACTIVATION`, `HOLD_STAGING_PUBLICATION`, and retained protected branch/PR dispositions remain. The user's manually started Vite terminal is user-owned and is not subject to Connector cleanup.
