# Native Gear Fresh-Format Activation Gate

Date: 2026-10-26. Status: `STARTER_AND_CURRENT_FIT_OWNER_VERIFIED; ATOMIC_CALLER_SAVE_CUTOVER_HELD`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`. Synchronized `master` `a596112acf3945f2bf7c625e943f2511d12aa710`; PR #19 fresh-save decision `62d6cc7b`; PR #20 owner base `0d6debe5`; PR #26 queued task/evidence `3eef18b9`. The separate #22→#25 Echo/Dev stack was inspected, not integrated. No Site deployment or old-save migration.

## Verified bounded checkpoint

The PR #20 owner remains outside selected gameplay. Its authored fit table now covers all **50** item identities accepted by the current UI slot resolver. A Vite-loaded parity test checks the actual resolver, item catalog and new native slot IDs; no extra worn capability is inferred. Six starter durable items with no established worn slot are explicitly **carried only**. Empty fit slot lists therefore mean a legal physical bag/overflow instance whose equip attempt fails; they are not a generic slot wildcard.

All seven starter bundles, including Warrior and Crafter choice variants, have explicit classification: **24 distinct item identities, 19 durable gear identities and five fungible commodity/consumable identities**. Ten choice-resolved owner fixtures grant unique IDs, individual condition, one location, bounded bag use and JSON readback. This is stand-alone owner evidence, not the production creator. Existing duplicate/stale/displacement/overflow tests remain green. The currently selected creator still writes old 17-slot equipment plus item-type bag stacks; no new campaign has been written in native format by this branch.

## Atomic activation boundary

The requested full cutover cannot safely be represented by changing creator alone. Current source has these coupled live authorities:

1. `newGameSnapshot.ts` assembles legacy `EquipmentState`, subtracts worn counts from stack cargo, and lets `legacyPreparationApplication.ts` append Bedroll Kit to old inventory. A new creator must grant every durable unit through the graph and leave only fungible cargo in stacks.
2. `characterPanelState.ts` Equip/Unequip selects a stack index, moves one item into the 17-slot map and writes `ui.character.item-stash.*` flags. It also builds both Equipment and Inventory views from those old stores. All four paths must switch together with fresh instance/revision validation; a second writable map or stash is unacceptable.
3. `player-engine/src/index.ts`, resource resolution, combat action equipment extraction, and UI view models still read `playerState.equipment`. The effective worn projection must come from the graph for every gameplay effect and display, including layered clothing and armor.
4. Survey capture in `player-survey-activity-advancement.ts` copies the old map. `campaign-rules.ts` requires an exact **17-key** equipment witness and checks its canonical owner input. New-format survey material/witness needs a deliberate version and graph-derived facts; rewriting only the capture would make retained results fail verification.
5. `campaign-rules.ts` and SaveManager still admit `lineage.save_snapshot.v2` in a version-7 envelope. A current-format version boundary must require and deeply validate the graph at publication, artifact readback, retry, recovery, fork and restart; older development records must become clearly incompatible without deletion. Merely adding `gearOwner` next to the old map would publish two physical authorities.

These are present production contracts, not a request to restore obsolete saves. PR #19 explicitly waives old v2/17-slot import while retaining protection of *new-format* history. The complete versioned PlayerState, survey material and SaveManager publication/recovery contract is not implemented or validated here. Activating only the tested owner/profile subset would make new creator, actions and Save disagree. Production remains on the prior owner until the coupled package and real-caller tests pass.

## Executed evidence

Red-before-green: seven-bundle coverage initially failed on `item.lumber_axe`; after explicit profiles, native owner **9/9** and actual Vite-loaded fit parity **1/1** passed. Adjacent owner/combat/persistence/survey **89/89**; selected Equipment/Inventory UI test set **14/14**. Content lint **72 files**; Node UI typecheck and isolated strict owner typecheck pass; direct Vite client/server build passes. Broad UI TypeScript: **115 clean master / 115 candidate**, zero normalized diagnostic delta. `git diff --check` passes. Existing master creator/combat/Save fixture remains 37/37, proving old behavior is intact, not that native gear was activated. No authenticated selected-client, native current-format Save/restart or interrupted-publication evidence exists.

FP-001/002: owner fixtures and parity do not accept the real caller. FP-005/012: stale/duplicate receipts and JSON retry at owner level only. FP-008/009: master, PR #19/#20/#26 and this stacked branch retain separate identities. FP-013/014/015/016: nested new graph, survey witness and derived effects need publication, provenance, recomputation and placement tests before activation. FP-017: creator fixture reachability is not a selected campaign. No branch or PR was merged, closed, rebased or deleted; active master prompt, Area/Atlas and #22→#25 runtime remain untouched.

## Smallest safe next package

Install one fresh-format **contract-first** pass on an isolated branch: define versioned native PlayerState/Save admission, graph-only physical inventory, survey owner-input/witness version and effective-worn projection with red tests, while leaving the old selected client unchanged. Then perform the coupled creator/action/resource/combat/UI/Save activation and current-format restart in one atomic implementation checkpoint. Reuse this branch's fit table only after independent review against current catalog and exact heads. Selected-client acceptance and Site publication remain later gates.
