# Inventory consume stale-stack owner repair — 2026-10-22

## Scope and source

- Repository: `vagabond1215/Lineage_Reforged`; isolated branch `codex/inventory-consume-stale-guard` from draft PR #10 head `9f390e03a26011213dee53929da309f470adba62`.
- Inspected `origin/master` `f56229dde859b9374a54368bd8a8fd2a9872daa1`, PR #7 `8610260f`, #8 `20825cce`, #9 `69215b6f`, #10 `9f390e03`, and #11 `2d140c4a`. All existing drafts and the DEV-0.7.2.13 combat route remain held and untouched.
- Game `0.1.1-prealpha`; `INTEGRATED_LOOP`; no development or game-version advancement. This unversioned owner repair has development impact `supports_current_band` and game-version impact `none`.

## Reproduction and repair

Before editing `consumeInventoryItem`, two new tests failed: a selected Breast Cut stack replaced by Arrow Bundle in either a bag or overflow was still consumed by stale index. The returned snapshot lost Arrow Bundle and gained Breast Cut's authored body-state effects. The owner looked up the profile from `entry.itemId`, then decremented whichever current stack occupied `entry.stackIndex`.

The owner now validates the active bag/overflow location, safe stack index, container identity, generated entry ID, item ID, item key, positive safe-integer quantity, selected quantity, and canonical authored item key before profile lookup, inventory cloning, or body-state application. Invalid selections return the original snapshot reference with `Inventory Changed`. Valid Bread Loaf and Breast Cut still use their existing authored profiles and body-state engine; Breast Cut is supported although its display category is not `consumable`.

The current inventory schema has no stack-instance identity. If two same-ID, same-key, same-quantity stacks compact into the same index, a prior selection is indistinguishable to this owner. A regression test records that limit; no unsupported instance ID or transaction model was added. This ambiguity does not allow the reproduced Breast Cut-to-Arrow Bundle wrong-item effect because item ID/key are checked against the live stack.

## Verification

| Check (working directory) | Result |
| --- | --- |
| Pre-repair `node --test tests/inventory-consume-stale-guard.test.mjs` (`apps/rpg-ui`) | Exit 1; both bag and overflow wrong-item tests failed; result was a new snapshot with Arrow Bundle removed and Breast Cut body-state changes. |
| Post-repair `node --test --test-concurrency=1 tests/inventory-consume-stale-guard.test.mjs tests/equipment-slot-reequip.test.mjs` (`apps/rpg-ui`) | Exit 0; 12/12. Covers stale identity/index/quantity/container, successful bag/overflow profiles, final-unit removal, SaveSnapshot round trips, bow/occupied-slot owner behavior. |
| `node --test --test-concurrency=1` (disposable composed `apps/rpg-ui`) | Exit 0; 23/23, including Character, Equipment/Inventory presentation, shell and top-bar suites. |
| `node --test --test-concurrency=1 tests/unit/player-body-state.test.mjs tests/unit/equipment-profiles-validation.test.mjs tests/unit/campaign-persistence-foundation.test.mjs tests/unit/character-creation-form.test.mjs tests/unit/character-creation-identity.test.mjs tests/unit/character-creation-profile-resolver.test.mjs tests/unit/combat-equipment-mapping.test.mjs tests/unit/combat-delta-presentation.test.mjs tests/unit/combat-hook-support.test.mjs` (`repo root`) | Exit 0; 106/106. |
| `npm run typecheck:node` (`apps/rpg-ui`, owner and composed checkouts) | Exit 0 in both. |
| `npm exec -- vite build` (`apps/rpg-ui`, owner and composed checkouts) | Exit 0 in both; existing large-chunk advisory. |
| `npm run typecheck` (`apps/rpg-ui`) | Owner branch 137 diagnostics vs clean master 137, zero introduced normalized signatures. Composed stack 135 vs clean PR #11 136, zero introduced signatures. Existing broad typecheck remains red. |
| `git diff --check` | Exit 0. |

An early concurrent Vite test launch collided on the shared WebSocket port; it was stopped and rerun serially. An unscoped root `npm test` also discovered UI tests from the wrong Vite root and was stopped; focused root suites and the correctly rooted UI suite above are the valid results.

No authenticated selected campaign was available in the browser inventory. `EQUIPMENT_INVENTORY_SELECTED_INTERACTION_UNVERIFIED` and the separate selected Equipment/re-equip, Save/restart and combined UI acceptance holds remain. Fixture and owner tests are controlled evidence only.

Applicable failure patterns: FP-001 (exported consume owner and composed Character caller tests), FP-002 (no parent/UI acceptance claim), FP-008 (semantic composition of PRs #7–#11), FP-009 (exact fetched heads distinguished from final commit), and FP-014 (live item identity and authored key checked before mutation). No branch merge, rebase, retarget, deletion or prior draft change was performed. Review this draft after the owner tests, then retain selected-client acceptance until an authorized campaign proves Use plus Save/restart.

Suggested commit: `fix(inventory): reject stale consume selections before effects`.
