# Native v3 selected pending-defeat reachability and terminal host gate — 2026-10-29

Status: **NATIVE_SELECTED_TERMINAL_HOST_VERIFIED; SELECTED_PENDING_REACHABILITY_OPEN; SELECTED_V3_ATOMIC_ACTIVATION_HELD**. Unversioned support for the current development band. Game `0.1.1-prealpha` and `INTEGRATED_LOOP` are unchanged.

## Source and reachability decision

Fetched/pruned `master` `a596112acf3945f2bf7c625e943f2511d12aa710`; verified fresh-save decision #19 `62d6cc7b00fdd9f17a4424aafd6527a754b1906c`, unselected Normal-defeat #43 `8a03c461ad8f06e7ea70389a7c3d6304b2368473`, pending publication #44 `022fe22def299cf9fc357058a0214e83875af24b`, and exact stacked heads/bases #47–#53. This [draft PR #54](https://github.com/vagabond1215/Lineage_Reforged/pull/54) starts at #53 `c421db115b4e5ba5afcd69ce4e1fda9969be3a56`; implementation `8c3b02d56d1dc1e75ba43fb86266b64cdcfc8a7c` was pushed/read back before this record.

The only authored nearby exploration context in `packages/content/base/world/encounter_action_contexts.json` originates at `settlement.stonevein`. `resolveNearbyExplorationPlan` matches the player's current settlement to that authored origin; encounter admission requires the candidate's origin to match the selected location. The real native creator can start there, and the #53 ordinary encounter/defeat proof reaches one playable Normal-defeat receipt. The Normal-defeat owner resolves the known safe current Stonevein settlement before considering pending recovery. No ordinary authored native creator → World/Approach → combat route currently proves `recovery_pending`. Removing Stonevein safety, moving the player by test mutation, injecting HP zero, forcing a spawn or inventing an encounter would not establish selected reachability. #44's controlled pending-publication tests remain unselected supporting evidence.

## Implemented owner boundary

`nativeSelectedTerminal.ts` binds the one native selected snapshot/control/source address/account revision to the existing `CleanEpochTerminalAdapter`. It rejects a malformed or mixed-format pair before owner access; the existing owner checks the retained head, account revision and terminal artifact. A blocked owner result retains the caller pair and requires reload. Exact terminal settlement resume first checks the pending receipt's account, campaign, slot, source address and account revision against that same selected pair, then delegates to the existing settlement owner. No new terminal or gear mutation authority was added. `EpochApp` native terminal and ordinary Save controls remain held.

The disposable real-`EpochApp` QA registered a synthetic account, created a native Hunter, opened selected read-only Character, moved its physical Short Bow to the bag, saved and restarted the exact gear graph. A stale prior source was blocked. An injected fifth-write settlement abort left one accepted pending terminal artifact and closed address; after restart, exact-source resume completed one retired history record. Exact retry reused the same terminal publication; changed retry was blocked. Artifact readback conserved every gear instance ID, durability and location; no inventory copy or v2 equipment shadow was introduced. This is synthetic test evidence, not authenticated selected gameplay acceptance.

| Verification | Result |
| --- | --- |
| Red-before-green focused host | Missing module failed; then 2/2 pass |
| Full UI Node suite | 92/92 pass |
| Adjacent root owner/Save selection | 89/91; both failures reproduce on exact #53: combat-status source-text assertion and legacy-ledger direct Node missing `nativeSelectedCharacter.js` |
| UI Node typecheck | pass |
| Broad UI TypeScript | #53 115, child 115; zero new diagnostics |
| Broad workspace TypeScript | #53 762, child 762; zero new normalized diagnostics |
| Content lint | pass, 72 files |
| Direct Vite production build | pass; sparse checkout omits public artwork and warns on launcher URLs |
| Disposable synthetic Chrome | pass: creator/account/Continue, Save/restart, interrupted terminal publication, exact resume, history/restart; native controls held |
| Staged diff check | pass |

## Hold and next trigger

The dedicated selected `recovery_pending` caller remains unimplemented because no authentic authored entry is reachable through the current selected World/Approach route. The next review must obtain an accepted disposition for that reachability gap or a genuine authored route, then prove pending publication/recovery, mixed-format tabs, rollback and a complete atomic selected v3 control path before authenticated fresh-format gameplay/Save acceptance. Keep #54 draft on #53; do not activate native selected controls, merge existing drafts, deploy the Site, delete old account records or advance Game version.

Applied FP-001 (real creator/account/Continue and owner path), FP-002/017 (synthetic versus authenticated boundary), FP-003 (pending entry and recovery hold), FP-005/012 (stale, exact retry, interrupted settlement), FP-008/009 (exact stacked base and branch review), FP-011/013/015 (native validation and physical gear conservation), and FP-016 (actual selected shell read-only hold). No new generalized pattern was identified.
