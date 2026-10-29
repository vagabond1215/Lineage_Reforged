# Native v3 session item admission: unselected gate — 2026-10-29

## Source and decision

Fetched/pruned `master` `a596112acf3945f2bf7c625e943f2511d12aa710` and verified draft PR #44 `022fe22def299cf9fc357058a0214e83875af24b`. This isolated child is [draft PR #47](https://github.com/vagabond1215/Lineage_Reforged/pull/47), based on #44, with implementation commit `ccc62f6b4a4d4dd65121f3773b6f4481c7df7c87`. PR #19's fresh-save decision remains the format authority; no obsolete development-save conversion or erasure is attempted. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, unversioned support, development impact `supports_current_band`, game-version impact `none`.

**Decision: one unselected native item-action/session bridge is verified; selected atomic activation remains held.** The bridge calls the existing physical `moveNativeGear` and exact-stack `consumeNativeFungible` owners, then admits an accepted candidate through `admitCampaignMutation` with native validation. It returns the admitted snapshot and control together. Invalid native source/account/campaign, stale and duplicate item requests do not admit a new session mutation. It does not select v3 in `EpochApp`, create a second item owner, or alter v2 equipment.

## Evidence and limits

The new Node caller test failed red at the missing bridge module, then passed green. After a final invalid-source case, the focused bridge suite is **3/3**. The full UI Node suite passed **76/76** before that final case; adjacent native physical/fit/resource tests passed **14/14** and root account/Save tests **22/22**. Node UI typecheck passed; UI broad TypeScript **115/115** and workspace **763/763** match the exact #44 parent after normalizing worktree paths, with zero new diagnostics. Content lint passed for **72 files**. Direct app-local Vite build passed with **271 client modules**. `git diff --cached --check` passed.

A new synthetic browser QA case is written for real native creator -> Short Bow session move -> account descendant Save -> reopen/restart -> duplicate retry, preserving the entire physical gear graph. **It was not executed.** The computer-use browser kernel failed before opening a tab with `failed to write kernel assets: The system cannot find the path specified`; isolated local headless Chrome/Edge yielded no usable browser process or DOM. Its account publication/restart assertions are therefore pending verification, not counted in the pass totals. Node JSON snapshot readback is not a durable account Save/restart substitute.

| Boundary | Evidence | Status |
| --- | --- | --- |
| Native creator gear and exact-stack Use through session admission | Node caller tests, duplicate/stale/invalid source, effective-worn and item conservation | Verified unselected |
| Account descendant Save and browser restart of bridge result | Written browser QA case | Unrun: browser environment unavailable |
| Selected creator and every selected mutation/readback | `EpochApp` defaults to v2; `GameSessionContext`, `CharacterPanel` and Inventory remain v2 typed/readers | Open |
| Pending defeat, four-stage survey, ordinary/terminal Save and rollback as one selected route | Parent unselected owner evidence only | Open |
| Authenticated selected v3 account, Save/load/restart | No selected v3 route exists to exercise | Open |

## Disposition

Keep #47 and #44 draft and unmerged. Preserve old account records, separate drafts, protected refs, parked combat, Site and Game version. Applied FP-001 to creator/owner action tests but selected caller remains open; FP-002 to the explicit parent hold; FP-005 to duplicate/stale checks with browser restart still open; FP-008/009 to exact stacked head and parent-relative diagnostics; FP-011 to validating native source before owner mutation and native admission; FP-012 to one item request/result with durable account replay still open; FP-013/015 to physical gear and effective-worn conservation; FP-017 to separating synthetic and authenticated evidence. No branch merge, retarget, closure or deletion is due. Review trigger: execute the browser QA and complete the selected caller/readers/Save/recovery package, then authenticate selected gameplay and Save/restart.
