# Native v3 Character panel and selected review gate — 2026-10-29

## Authority and decision

Fetched/pruned `master` `a596112acf3945f2bf7c625e943f2511d12aa710` and verified draft #19 `62d6cc7b00fdd9f17a4424aafd6527a754b1906c`, #44 `022fe22def299cf9fc357058a0214e83875af24b`, #47 `3201c1c715aae7c96357426691504fb5d394dba3`, #48 `108224908073662eff97a782454d1315ec8d8377` and exact parent #49 `a625cea2ac0ff5bfbba111cea724e6ae31aee56f`. Isolated [draft PR #50](https://github.com/vagabond1215/Lineage_Reforged/pull/50) stacks on #49; verified implementation `0a89de443c0ad85cc3f19700cdbd6141612e6bad` and attribute-accessibility correction `f063a4942efa1c0ecd0c040e7a976d8a420a5ed0` were pushed/read back. PR #19's development-only fresh-save waiver remains controlling; no old record was converted or erased.

**NATIVE_CHARACTER_PANEL_VERIFIED; SELECTED_V3_ATOMIC_ACTIVATION_HELD.** The selected creator still defaults to v2. A valid native v3 snapshot can now render an owner-backed Character and separate Inventory within the actual `InGameShell` without reading the absent v2 equipment map. That native shell is explicitly read-only: it hides v2 World, combat, Save and retirement controls and disables item mutations. It is a safe review dependency, not a playable v3 selection.

## Implemented boundary

The native panel projects all 38 canonical positions, all nine attributes, exact physical instance IDs, condition, bag/overflow location, authored equipment eligibility and exact fungible stack targets from the #49 reader. It introduces no v2 equipment shadow or second item store. Its Equip, Unequip and Use controls call only `admitNativeSelectedItemCommand` from #49, which delegates to the #47 session owner. A mutable host must supply both native snapshot and campaign control; an accepted command returns both and the panel passes them together to one callback. Without that host the controls are disabled. Existing v2 Character/Inventory and actions are unchanged.

`EpochApp` now refuses to send a v3 loaded record through v2 Normal-defeat recovery, ordinary Save or retirement. These fail-closed guards protect the review entry, but they do not supply native selected publication or defeat completion. Malformed v3 state is refused with a return-to-menu path; it is never handed to v2 `GameSessionProvider`.

## Red-before-green and evidence

Before source edits, the real `InGameShell` native Hunter regression failed at `characterPanelState.buildEquipmentEntries` indexing `playerState.equipment['slot.weapon.left']`. After this slice it passes, with 38 rendered positions and no v2 gameplay controls. A separate native panel test covers nine accessible attributes, exact item/stack presentation and disabled review actions.

- UI Node suite **83/83**; adjacent root gear/account/Save **45/45**.
- Node UI configuration typecheck **pass**; content lint **72 files**; direct Vite production build **pass** (277 modules). The ordinary `npm run build` remains blocked by pre-existing broad TypeScript diagnostics.
- Broad UI TypeScript: exact #49 **115** versus child **115**, zero normalized diagnostic differences. No new diagnostic in changed source. `git diff --check` pass.
- Disposable synthetic Chrome/Vite QA: real native Hunter panel at **1440, 768 and 375 px**, 38 slots, no document-wide horizontal overflow, keyboard Enter inspection, Unequip → Equip → Use with physical gear revision and retained campaign control advancing together; actual `InGameShell` native review branch at the same widths, keyboard Inventory navigation, disabled mutation controls and return-to-menu. This fixture adds Bread Loaf to synthetic cargo and does not use account credentials.

The #49 owner tests separately prove invalid fit, stale/duplicate command rejection, source-bound Use and JSON Save readback. This child does **not** prove an interrupted selected publication, authenticated gameplay, native selected Save/restart, defeat recovery, terminal history or four-stage survey in the selected shell. The selected review shell intentionally has no such actions.

## Exact activation blocker and next gate

`EpochApp` still constructs the first-campaign adapter in v2 mode. Its selected state and `GameSessionContext` mutation callbacks, top bar/World/quest/survey/combat/resource readers, ordinary descendant Save, pending Normal-defeat recovery and terminal handlers remain v2 selected callers. Enabling native creator or item buttons there would create a partial dual-owner game. The next child must first prove a native selected session host that keeps snapshot/control together through World/quest/survey, combat/resources and Save/recovery, then prove current-format account publication/restart, stale/mixed-format fencing and rollback before selecting v3 creation. Authenticated selected-client acceptance follows a safe complete build; the existing Brave session is not used here.

Applied FP-001 (real shell red/green), FP-002/017 (synthetic evidence does not accept selected gameplay), FP-005/012 (owner stale/duplicate and retained identity), FP-008/009 (exact stacked head and baseline comparison), FP-011 (native admission before action), FP-013/015 (one physical gear authority and effective-worn projection), and FP-016 (actual panel placement and three responsive widths). No new failure-pattern entry. No merge, rebase, branch deletion, Site deployment or Game-version change.
