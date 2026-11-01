# Native v3 real creator to survey candidate gate — 2026-11-01

Source: `master` `a596112acf3945f2bf7c625e943f2511d12aa710`, draft #58 `519389a8e1683f62f2fba007bc6075091222b9c1`, child `codex/native-v3-selected-lifecycle-gate` test commit `4dbd6b146e2f43c157c07ab18ad6a5a29500d522`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`.

## Implemented and verified boundary

`native-selected-real-creator-survey-browser-qa.mjs` uses a disposable local account and the actual development-only `EpochApp` creator controls. It randomizes a valid identity, then explicitly chooses The Myridian Chain, Starfall Isle, Starfall Port, Workshop-Raised and Hunter Bundle. It does not preseed the character, quest, location or survey. The same account publishes native v3, Unequips and re-Equips its Short Bow through Character/Inventory, Saves, accepts the authored quest, travels to Ashen Reef, advances and Saves all four ordered survey stages, and restarts the same campaign. Retained owner readback checks physical instance IDs, durability, locations, stack quantities, account revision, survey count and publication identity. The test also checks 375×667, 768 and 1440 widths, horizontal overflow, resources/Save visibility and keyboard Tab focus. The Hunter starter's three stacks correctly have disabled Use controls because they have no authored consumable profile.

The first version of this new route test passed against #58. An expanded test assertion failed because it compared the whole gear ledger to its starting state after two accepted movements; revision and receipts must advance. Correcting the assertion confirmed unchanged **physical instances** and exactly two movement revisions. This was a test expectation repair, not a production red/green repair. No production source or owner changed.

## Checks and limits

The new browser route passed repeatedly against the local candidate. UI Node **100/100**, focused root gear/survey **53/53**, Node UI typecheck and content lint **72 files** passed. Direct complete-asset Vite build passed. Broad UI TypeScript **115/115** and workspace TypeScript **763/763** diagnostics exactly matched clean #58 after normalizing worktree paths; no new diagnostics. A broad root unit/simulation sweep returned failure with unrelated settlement/transport and other inherited cases; it is not used as acceptance. `npm run build` remains blocked by the inherited UI TypeScript diagnostics. No hosted or authenticated selected account was used.

## Atomic disposition

**HOLD_SELECTED_ATOMIC_ACTIVATION.** The real creator-to-survey gap is now locally covered, but the full candidate gate remains open:

1. Prove successful Inventory Use through an ordinary reachable authored consumable and exact quantity/effect Save/restart. Hunter starter stacks cannot satisfy that gate.
2. Prove ordinary selected exploration/combat/resource effects through Normal defeat and selected terminal retirement with retained history. The observed post-survey World control offered only return to Starfall Port; the candidate retirement action remains deliberately held. Do not manufacture a route or bypass owner authority.
3. Exercise cross-slot and mixed v2/v3 saves, stale/duplicate requests, changed account revision, interrupted publication, rollback and exact retry at the connected selected caller, and prove obsolete development-save rejection without deletion. Existing owner tests are supporting evidence only.
4. After a safe complete local gate, perform authorized authenticated selected-client Save/restart. The local synthetic account is not that evidence.

Keep default creation on v2, native production review read-only and the QA candidate development-only. No schema, old record, browser origin, Area/Atlas, combat owner, deployed Site, parked combat route or Game version changed. Applied FP-001 (real caller route; no production red claim), FP-002 (partial evidence does not accept the parent), FP-008/009 (exact branch stack), FP-011/013 (one source pair and physical gear), FP-016 (retained publication), FP-017 (authored reachability still open).
