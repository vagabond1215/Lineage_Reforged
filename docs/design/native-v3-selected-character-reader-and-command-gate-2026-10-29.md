# Native v3 selected Character reader and command gate — 2026-10-29

## Source and decision

Fetched/pruned `master` `a596112acf3945f2bf7c625e943f2511d12aa710` and verified draft #19 `62d6cc7b00fdd9f17a4424aafd6527a754b1906c`, #44 `022fe22def299cf9fc357058a0214e83875af24b`, #47 `3201c1c715aae7c96357426691504fb5d394dba3`, and exact parent #48 `108224908073662eff97a782454d1315ec8d8377`. This isolated child is [draft PR #49](https://github.com/vagabond1215/Lineage_Reforged/pull/49), based on #48; verified code commit `59f84a719e40e63c24e77f52968e2ab472d3c76e`. PR #19's fresh-save waiver remains controlling for obsolete development saves. No old record was converted or deleted.

**SELECTED_V3_ATOMIC_ACTIVATION_HELD.** The selected v2 creator and gameplay remain unchanged. This child closes the first #48 render failure with a tested native v3 Character/Inventory reader and UI-facing item command contract; it does not activate the native game.

## Implemented owner boundary

The new `nativeSelectedCharacter` reader validates the complete current-format campaign, then projects every canonical gear slot from `playerState.gear`, exact instance identity, condition, physical location, authored fit and effective-worn facts. It also projects carried bag/overflow gear and exact fungible stacks, including authored Use availability. Presentation rows clone mutable attributes and locations so modifying a row cannot mutate the snapshot. No v2 equipment map, duplicated inventory or fabricated fit/effect is introduced.

`uiViewModel` uses this reader for v3 Character equipment/inventory lists and counts. A real native Hunter now passes `createGameSessionState`; its Short Bow has a stable instance ID and its actual worn slot. The v2 path remains on its existing equipment map. The native UI-facing command adapter sends selected gear and Use targets to the existing #47 owner/session bridge, carrying the original revision and inventory fingerprint so exact retry, stale selection and changed source retain their semantics. An accepted result returns both snapshot and campaign control to its caller. This contract is not yet wired to selected buttons.

## Red-before-green and next selected blocker

Before editing source, the new test called the actual `createGameSessionState` production reader with a native creator Hunter and failed at `uiViewModel.buildCharacterLists` on `Object.entries(playerState.equipment)`, reproducing #48's exception. After the reader repair, that test passes. A diagnostic full `InGameShell` server render then advanced past `uiViewModel` and failed at `characterPanelState.buildEquipmentEntries`, which indexes `playerState.equipment['slot.weapon.left']`. The diagnostic failing shell assertion was removed from the committed passing suite; this exact executable boundary is the next repair target. `CharacterPanel` and its Equipment/Inventory actions, selected `EpochApp` creator/Save/recovery, GameSessionContext mutation callers, World/quest/survey, combat/resource and terminal paths still require a coherent native selected route. Do not switch the creator to v3 on this child.

## Verification and limits

- Focused native reader/command tests **3/3**: nine attributes, canonical slots, Short Bow effective worn, no presentation mutation of physical authority, occupied/invalid fit, gear unequip/re-equip and Save JSON, session control, stale/duplicate, exact Bread Loaf Use, changed stack refusal, unchanged gear and durable Use receipt.
- Full UI Node suite **80/80**; adjacent root gear/account/Save suite **45/45**; Node UI typecheck pass; content lint **72 files**; direct app-local Vite build **275 client modules**; `git diff --check` pass.
- UI broad TypeScript **115/115** and workspace **763/763** relative to exact #48, with zero new normalized diagnostic signatures. Both broad typechecks still fail on existing diagnostics.
- Isolated synthetic IndexedDB browser QA **26/26** through local Vite/headless Chrome. This re-runs the inherited account/gear/Use/Save/restart cases; it is not authenticated selected v3 acceptance and does not exercise the new selected Character buttons.

Applied FP-001 (production `createGameSessionState` red/green and next full-shell failure), FP-002/017 (synthetic evidence cannot accept the selected parent), FP-005/012 (exact retry and durable Use identity), FP-008/009 (exact stacked head and baseline-relative diagnostics), FP-011 (native admission), and FP-013/015 (one physical gear authority, effective worn and projection non-mutation). No new failure-pattern entry is needed. No merge, rebase, retarget, closure, deletion, Site deployment, or Game-version change occurred. Review #49 only with its #48 parent; the next trigger is a native Character/Inventory component and selected session action application followed by the remaining atomic caller/recovery gate and authenticated selected gameplay.
