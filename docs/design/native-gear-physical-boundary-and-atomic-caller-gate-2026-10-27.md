# Native Gear Physical Boundary And Atomic Caller Gate

Date: 2026-10-27. Status: `CANDIDATE_PHYSICAL_CONTRACT_VERIFIED; SELECTED_V3_CUTOVER_HELD`. Source `master` `a596112acf3945f2bf7c625e943f2511d12aa710`; stacked source PR #27 `b1bb93c82b45dee9a6f64a496c0dd3b67ae1375e`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`. PR #19's approved fresh-save direction controls: obsolete development saves need no importer and must not be erased automatically.

## Implemented and verified

`native-gear-physical-boundary.ts` defines a candidate `lineage.save_snapshot.v3` **physical section**, not a full SaveSnapshot validator or publication path. Its new player physical shape has one gear graph and fungible inventory, with no old equipment map. Validation checks canonical item keys/classes, positive stack quantities, unique bag IDs, actual bag/gear capacity, owner graph integrity, and absence of `ui.character.item-stash.*` flags. Weapon, armor, clothing, accessory and tool units must be gear instances; commodity, consumable and quest cargo may be stacks. An obsolete version gets explicit “start a new campaign” guidance without mutation or deletion. The accepted two-bow fixture preserves separate IDs and durability alongside 300 stacked rations through JSON roundtrip. This boundary does not claim full snapshot integrity.

A real-caller gate invokes `createNewGameSnapshot` for all seven starter bundles. Every resulting selected snapshot is still `lineage.save_snapshot.v2`, carries `playerState.equipment`, lacks `playerState.gear`, and is rejected by the candidate boundary. This is executable evidence that the new contract is **not activated**, not successful native creator acceptance. No selected-client or current-format Save/restart test exists.

## Exact remaining atomic dependency

1. Creator and Legacy preparation still grant durable units into the 17-slot map or item-type stacks. Actual all-bundle production grants, unique instances and non-duplicating fungible counts need one replacement caller.
2. `characterPanelState.ts` Equip/Unequip and Equipment/Inventory projections still mutate/read that map, bag stacks and item-type stash flags. The new graph needs fresh instance/revision selection and atomic owner actions before UI routing changes.
3. Player resources, combat and character presentation still derive effective worn items from the old map. A graph-only projection must replace all material readers in the same activation.
4. `campaign-rules.ts` hard-codes `lineage.save_snapshot.v2` and validates a 17-key equipment witness. Survey owner input/capture and validation still copy that map. A v3 survey material/intent/witness and campaign-target admission must be versioned together; a physical-only snapshot type cannot inherit old `CampaignRulesState` honestly.
5. SaveManager and clean-epoch first/descendant/terminal adapters use a version-7 stored envelope with `snapshotFormatId` fixed to v2. Artifact readback, retry, recovery, fork, interruption and restart need v3 admission and protection against mixed-tab writes. Changing the string alone would reject legitimate current history or publish mismatched authority.

The complete cutover therefore remains an atomic multi-owner package. Production paths, old selected saves, the active master prompt and deployed Site are unchanged. Do not present this branch as usable v3 Save, native Equipment/Inventory gameplay, or survey/combat/resource acceptance.

## Verification and disposition

Red-before-green: the new boundary test initially failed `ERR_MODULE_NOT_FOUND`. Focused candidate boundary **5/5**, seven-bundle real-caller gate **1/1**, adjacent owner/creator/combat/survey/persistence **82/82**, UI/fit/Overview group **8/8**. Content lint **72 files**, Node UI typecheck and direct Vite build pass. Broad UI TypeScript **115 master / 115 branch**; root workspace **763 master / 765 PR #27 base / 765 branch**, zero new diagnostics in the module. `git diff --check` passes. Parallel Vite test processes reported a nonfatal HMR port warning; the test group exited zero. No full `npm test`, selected gameplay, Save/restart or publication interruption was run on candidate v3.

FP-001/002: actual creator gate explicitly fails native admission; fixtures do not accept parent. FP-005/012: owner stale/duplicate tests remain green, but no live UI retry proof. FP-009: master, PR #27 and this checkpoint retain distinct identities. FP-013/014/015/016: full nested Save/survey provenance and effects remain a named activation gate. FP-017: the seven real creator snapshots prove current reachability of **old** format only. Drafts #19/#20/#22/#25/#26/#27 remain held; no merge, rebase, retarget, closure or branch deletion.

Next implementation must start with red real-caller tests for the v3 creator, action, effective-worn, survey and Save/restart paths, then change those connected owners in one reviewable branch. If it cannot make all paths consistent, keep selected production on v2.
