# Proposed Codex Task: Character Inventory Selection Identity and Action-Target Safety

**Date:** 2026-10-23. **Repository boundary:** `vagabond1215/Lineage_Reforged` only. **Classification:** unversioned, bounded UI repair; development impact `supports_current_band`; Game-version impact `none`. **Status:** parallel UI proposed prompt, **not installed** as `docs/dev/current-codex-prompt.md`. The independent active `DEV-0.7.2.13 Combat Action Result Disclosure Contract And Repair` and its current output/handoff remain untouched. Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, `DEV-0.7.2_NOT_READY` and `GAME_VERSION_NOT_READY` are unchanged.

## Mission

Fix the remaining Character Inventory **presentation-selection collision** when two bags share an ID and have the same item at the same stack index. Distinct visible rows must remain separately selectable, show exactly one intended selected row, and pass the **correct live InventoryEntry** into the existing Equip/Use owner. This is a narrow UX/action-target repair, not a new item-instance or inventory transaction model.

This task is not authorized to merge existing PRs, accept selected gameplay, or redesign the Character screen.

## Source preflight and locked dependencies

1. Read `AGENTS.md`, repository-first workflow, branch lifecycle/integration rules, applicable failure-pattern IDs, accepted UI IA and item/equipment/inventory authority. Fetch/prune; examine current master, exact live refs, dirty worktrees and PR statuses before implementation.
2. Last inspected source heads, **refresh before editing**:
   - master `f56229dde859b9374a54368bd8a8fd2a9872daa1`;
   - design/routing PR #5 `9c420caf8ed6debfef24870dfb6509a2ba9bb310` (this proposed prompt will advance #5; use its current head);
   - Character parent PR #7 `8610260fd40a7b371a4789e954f53fc884ad71df`;
   - top bar PR #8 `20825cce24703e5066fb827075d5f310e847fb34`;
   - mobile shell PR #9 `69215b6fa6b4bcc805363171541120645f365d8c`;
   - equipment owner PR #10 `9f390e03a26011213dee53929da309f470adba62`;
   - Equipment/Inventory UI PR #11 `2d140c4a2693345fa4f8188bb9e2e625b186538f`, stacked on #7;
   - consume owner PR #12 `7b6dccf592adbbef05361bb501fceb461dd1f5e5`, stacked on #10;
   - exact validated-bag owner PR #13 `c9581eb9834d9c1374560b3a4b26bbdf1dae210d`, stacked on #12.
3. Read PR #11 UI hardening record and test source, PR #12 stale-Consume owner test, PR #13 `inventory-exact-bag-target.test.mjs` and repair record, and the prior Connector preflight `docs/dev/inventory-duplicate-bag-exact-container-connector-preflight-2026-10-23.md` on design PR #5.
4. This work belongs to the **PR #11 Character presentation** surface, not to owner PR #13. Create an isolated worktree/branch based on the verified current PR #11 head, suggested `codex/inventory-ui-selection-safety`; publish a **draft stacked PR whose base is `codex/equipment-inventory-ux-stacked`**. Do not update, rebase, overwrite, force-push or retarget #7/#11/#10/#12/#13.

## Verified defect and required pre-edit reproduction

`buildInventoryEntries` currently constructs bag row IDs as `inventory.<bag.id>.<itemId>.<stackIndex>`, omitting `containerIndex`. For same-ID bags with the same item/stack index, these IDs collide. PR #11's `selectVisibleInventoryItem` searches by ID alone, and its Inventory map uses `key={entry.id}`, `isSelected = entry.id === selectedInventory?.id`, and `onClick` to store that ID. The first entry can be resolved when the second was clicked; React keys and selected styling collide.

PR #13 fixes an **independent owner defect**: Equip and Consume mutate the same cloned bag array index validated by the action. Do not duplicate that owner repair into this UI branch or introduce another owner.

Before modifying production code:
- Construct a **controlled snapshot** with two bags sharing an ID, both containing Bread Loaf or Breast Cut at the same stack index, identical quantities, but distinct `containerIndex`.
- Use real `buildInventoryEntries` and the current Character UI selection path, not manually fabricated row IDs.
- Write an expected-failing regression showing that clicking/selecting the **second** row resolves the first, both rows can appear selected or have duplicate React keys, and the wrong live bag would become the Equip/Use target through the current UI selection path.
- If testing with a usable item, verify the selected `containerIndex` reaching `consumeInventoryItem`; include an equip-eligible item (Short Bow) and a supported Use item. Do not invent authenticated selected-gameplay evidence.
- Preserve the pre-fix failure output and exact starting refs.

## Bounded presentation repair

Prefer an **ephemeral, collision-free UI presentation identity** derived from the live `InventoryEntry`'s `location`, `containerIndex`, `stackIndex`, item identity and existing entry ID (or an equivalent unambiguous selection tuple). Keep it separate from canonical item/stack identity and from owner validation identifiers.

Apply consistent identity across:
- selected inventory state and `selectVisibleInventoryItem` recovery;
- React list `key` and selected-row styling / `aria-pressed`;
- selection click and detail/action pane target;
- duplicate-row pin state/identity where supported, without silently changing existing persisted pin semantics or unrelated shell ownership.

**Critical:** Pass the real unmodified `InventoryEntry` returned by `buildInventoryEntries` to `equipInventoryItem` and `consumeInventoryItem`. Owner PRs #12/#13 validate `entry.id`, bag ID/index, item ID/key and quantity. A UI-local selection key must not be written into `entry.id` or treated as a SaveSnapshot field without a separately justified owner change.

Keep PR #11's inventory-object-reference selection invalidation or an equally safe current-state guard. Selection must clear/require reselection after state mutation and must not migrate silently to another item due to compaction, sorting, filtering or bag reorder. Existing item favorites remain item-type keyed; distinguish their semantics from row-specific selection/pins. If the shell's pin state cannot safely distinguish duplicate rows without crossing current ownership, record the exact hold rather than silently inventing new persistence.

Test accessible discrimination: when duplicate items have indistinguishable text labels, the player should be able to tell the bag rows apart using truthful existing bag ordering/label/position; any improved accessible name must avoid pretending a durable bag identity exists.

## Regressions and stopping rules

Required regression matrix:
1. Same-ID bags + same item + same stack index: first and second independently selectable; one selected row and exact `containerIndex` in the action entry.
2. Same-ID bags + differing items: no regression to already-fixed exact-bag owner behavior.
3. Distinct-ID bags and overflow: unchanged selection/action behavior.
4. Filter, sort, favorite and pin interaction: selection still targets the intended live entry; hidden selection cannot execute; no ambiguous duplicated React keys.
5. Consume decrement to one/final unit; bag compaction, reorder, quantity change and SaveSnapshot update invalidate stale action selection.
6. Short Bow Equip, occupied-slot displacement, Breast Cut authored Use and Bread Loaf Use in a **disposable composed** checkout including current #7+#11 UI, #10+#12+#13 owner code, and independent #8/#9 shell. Confirm no wrong bag/item mutation or incorrect body effects.
7. SaveSnapshot serialize/deserialize compatibility; no new persisted selection/instance IDs.

Implement only the smallest necessary UI/helper/test change. Avoid edits to `characterPanelState.ts` on this UI branch unless a narrowly demonstrated unavoidable change is documented and it is shown compatible with #13's exact production owner. Do not modify shared schemas, content, authored profiles, other gameplay owners, resource bar, navigation architecture, layout or active combat files.

If a selected-row identity cannot be corrected without changing an authoritative owner contract, stop at a focused failing test and decision record. Do **not** quietly duplicate PR #13's source.

Run focused Character/Inventory regression suites, PR #10/#12/#13 owner tests in the disposable composition, creator/body/combat and persistence tests as applicable, `npm run typecheck:node`, app-local `npm exec -- vite build`, broad `npm run typecheck` with normalized same-environment signature comparison, and `git diff --check`. Avoid concurrently launching test suites sharing Vite's port. Historical PR #13 totals 20/20 owner, 31/31 composed UI, 106/106 focused game tests are baseline reports, not current execution proof. Broad TypeScript remains historically red; no introduced normalized signatures are allowed.

## Publication, browser boundary and completion report

When fixed/tested, commit and push only the narrow presentation patch + focused tests + evidence/register entry on the isolated UI branch; open a **draft PR stacked on #11**. In the final report, distinguish branch-specific diff from disposable composition; preserve dated branch-register histories without overwriting others. Do not merge, accept, delete, rebase or retarget anything. Retain independent #13 owner acceptance and `EQUIPMENT_INVENTORY_SELECTED_INTERACTION_UNVERIFIED`.

A prior selected-client attempt was denied access to localhost by browser-use policy. Do not retry prohibited browser routes or report selected Equip/Use/Save/client-restart as verified. Controlled UI and owner fixtures are not authenticated gameplay. Selected-client acceptance remains a later separate run requiring authorized browser access.

Final report format:
- **A. Repo/branch**: master, exact current PR heads, new branch, base, changed paths, commits, draft PR link, untouched PRs.
- **B. Red-to-green reproduction**: exact colliding entries, failing-before and passing-after results, React/selection and action target proof.
- **C. UI design and compatibility**: presentation identity, same-snapshot scope, owner `InventoryEntry` unchanged, favorite/pin behavior, stale-selection hold.
- **D. Validation**: commands/cwd/exit codes/counts, composed PRs, builds, broad TS normalized diagnostic comparison, SaveSnapshot.
- **E. Acceptance**: `DUPLICATE_BAG_UI_SELECTION_AND_ACTION_TARGET_REPAIRED` only if second-row selection and its actual owner argument are shown safe. Else precise HELD result. Keep authenticated selected gameplay, zoom and integration held.
- **F. Next**: independent review, then user-authorized browser-surface selected Equip/Use/Save/restart; only thereafter consider staged integration of the existing PR stack.

Success is a reviewable, test-backed correction to **presentation identity**, not another gameplay owner or a merged UI.
