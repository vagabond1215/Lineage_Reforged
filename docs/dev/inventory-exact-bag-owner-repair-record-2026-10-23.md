# Inventory exact-bag Equip/Consume owner repair — 2026-10-23

**Repository:** `vagabond1215/Lineage_Reforged`. **Branch:** [draft PR #13](https://github.com/vagabond1215/Lineage_Reforged/pull/13) on `codex/inventory-bag-exact-target-repair`, from draft PR #12 `7b6dccf592adbbef05361bb501fceb461dd1f5e5`; stacked base `codex/inventory-consume-stale-guard`. **Run:** unversioned bounded owner support, development impact `supports_current_band`, Game-version impact `none`. Game `0.1.1-prealpha`, `INTEGRATED_LOOP`. Active DEV-0.7.2.13 combat prompt/output/handoff remain untouched.

## Exact source and defect

Fetched/pruned master `f56229dde859b9374a54368bd8a8fd2a9872daa1`. Draft design PR #5 was `9c420caf`; implementation PRs #7 `8610260f`, #8 `20825cce`, #9 `69215b6f`, #10 `9f390e03`, #11 `2d140c4a`, #12 `7b6dccf5`, all open and unmerged at preflight. PR #11 is stacked on #7; PR #12 is stacked on #10. No existing branch was edited, merged, rebased, retargeted or deleted.

Both `equipInventoryItem` and `consumeInventoryItem` validated `snapshot.playerState.inventory.bags[entry.containerIndex]`, then cloned inventory and mutated `nextInventory.bags.find(candidate => candidate.id === entry.containerId)`. `cloneInventory` preserves bag array order. A duplicated bag ID could therefore send the mutation to a different bag. Before the patch, four new tests failed: selecting second-bag Short Bow equipped first-bag Arrow Bundle or Breast Cut; selecting second-bag Breast Cut removed first-bag Arrow Bundle or Bread Loaf. The tests used `buildInventoryEntries` and a serialized/deserialized SaveSnapshot. The production starter currently creates one `bag.traveler_satchel`; legacy preparation preserves incoming bag arrays; the shared `InventoryBag` type and JSON serialization impose no ID uniqueness. Ordinary gameplay creation of duplicate IDs was not established.

## Repair boundary

For bag-sourced Equip and Consume, the cloned bag is now addressed by the same validated `containerIndex`. Before mutation it rechecks the cloned bag ID and stack ID/key/positive safe-integer quantity against the selected entry. Missing, stale and invalid selections return the original snapshot with a warning, preserving inventory, equipment, session flags, body state and all other persisted state. The owner never falls back to another same-ID bag. Overflow paths and the existing `addStackToInventory` distribution of displaced or returned items are unchanged. Valid distinct-ID and duplicate-ID indexed entries can act on their exact source bag.

The Character UI's derived row ID omits bag array index: two same-ID bags containing the same item at the same stack index produce colliding row IDs. A test records this presentation ambiguity. The owner has exact `containerIndex` when called with a live entry; distinct user selection of identical rows is **not** established. This remains a separate UI/selected acceptance hold; no speculative bag UUID, stack instance or schema change was made.

## Fresh checks

| Command and cwd | Result |
| --- | --- |
| Pre-patch `node --test --test-concurrency=1 tests/inventory-exact-bag-target.test.mjs` in implementation `apps/rpg-ui` | Exit 1; 0/4. Wrong first-bag equipment and removal reproduced. |
| Post-patch `node --test --test-concurrency=1 tests/inventory-exact-bag-target.test.mjs tests/inventory-consume-stale-guard.test.mjs tests/equipment-slot-reequip.test.mjs` in implementation `apps/rpg-ui` | Exit 0; 20/20. Includes duplicate and distinct bag IDs, both bag orders, stale/missing/invalid entries, quantity conservation, occupied displacement, overflow, authored Bread Loaf/Breast Cut and SaveSnapshot round trips. |
| `node --test --test-concurrency=1` in disposable combined `apps/rpg-ui` | Exit 0; 31/31, including Character, Equipment/Inventory, top bar and mobile shell suites. |
| `node --test --test-concurrency=1 tests/unit/player-body-state.test.mjs tests/unit/equipment-profiles-validation.test.mjs tests/unit/campaign-persistence-foundation.test.mjs tests/unit/character-creation-form.test.mjs tests/unit/character-creation-identity.test.mjs tests/unit/character-creation-profile-resolver.test.mjs tests/unit/combat-equipment-mapping.test.mjs tests/unit/combat-delta-presentation.test.mjs tests/unit/combat-hook-support.test.mjs` at root | Exit 0; 106/106. |
| `npm run typecheck:node` and `npm exec -- vite build` in implementation and combined `apps/rpg-ui` | Exit 0 in each checkout; existing large-chunk advisory. |
| `npm run typecheck` in implementation `apps/rpg-ui` vs clean PR #12 checkout | Both exit 1; 137/137 diagnostics, 87/87 normalized signatures, zero introduced. |
| `npm run typecheck` in combined `apps/rpg-ui` vs pre-repair combined checkout | Both exit 1; 135/135 diagnostics, 85/85 normalized signatures, zero introduced. |
| `git diff --cached --check` | Exit 0, including new files. |

The disposable combined checkout is based on exact PR #11, with source/test overlays from #8/#9/#12 and this repaired owner. Documentation overlays were intentionally excluded to preserve each original branch-register history for later integration. It is controlled validation only. Browser-use policy blocked the prior selected-client attempt; no browser route was retried here. `EQUIPMENT_INVENTORY_SELECTED_INTERACTION_UNVERIFIED`, selected Equip/Use, Save/client restart, zoom and full UI integration acceptance remain held.

Applicable failure patterns: FP-001 (actual owner functions and composed Character caller), FP-002 (controlled tests do not accept selected gameplay), FP-008 (semantic draft composition), FP-009 (live heads distinct from final publication), FP-014 (bag ID string is not unique authority), FP-015 (mutation targets the validated indexed bag). Next: independent owner review, separate presentation decision for colliding row IDs, then selected-client gameplay and Save/restart on an authorized browser-capable surface before any multi-PR integration decision.
