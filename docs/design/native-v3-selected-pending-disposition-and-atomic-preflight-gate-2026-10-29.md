# Native v3 selected pending disposition and atomic preflight gate — 2026-10-29

Status: **LATENT_PENDING_OWNER_PATH_ALLOWED; PENDING_CALLER_VERIFIED_UNACTIVATED; SELECTED_V3_ATOMIC_ACTIVATION_HELD**. This is unversioned support for the current development band. Game `0.1.1-prealpha` and playability `INTEGRATED_LOOP` remain unchanged.

## Source and product disposition

Fetched/pruned and verified `master` `a596112acf3945f2bf7c625e943f2511d12aa710`; inspected fresh-save waiver #19 `62d6cc7b`, Normal-defeat owner #43 `8a03c461`, pending account owner #44 `022fe22d`, and exact stacked heads/bases #47–#54. This [draft PR #55](https://github.com/vagabond1215/Lineage_Reforged/pull/55) starts at #54 `a1780cac75b15535842ee24c666cb97e9b88ee05`; verified code commit `b8df30f9a61a96a1b6f1dc013f3dc64a345b437d` was pushed/read back before this record.

The only authored nearby encounter originates at Stonevein, which is a safe settlement. World/Approach admission requires that origin. Normal defeat uses the current safe settlement before the pending fallback. Ordinary creator → authored encounter → combat therefore reaches a playable receipt, not `recovery_pending`. The controlled #44 HP-zero and source-loss setup proves the owner path, not ordinary selected reachability. No encounter, safety, location, or selected account state was changed to manufacture pending reachability.

The owner answered the explicit 2026-10-29 disposition question: **allow a latent owner-tested pending path**. This permits a complete native v3 atomic-activation package to rely on the pending owner/recovery path without adding an artificial authored encounter. It does **not** convert fixture evidence into authenticated selected evidence: selected pending-scenario acceptance remains open, and any future authored pending route requires its own selected proof. Existing accepted Normal-defeat precedence stays intact.

## Implemented boundary and atomic preflight

`nativeSelectedPendingDefeat.ts` binds a validated v3 pending receipt to the one selected snapshot/control/source slot/account revision. It refuses playable, malformed, mismatched and cross-slot requests without an observed destination before calling the existing account owner. The owner handles publication, accepted-pending consumer completion, recovery, stale/non-head and duplicate semantics. The wrapper reads back the next selected pair, requires the expected receipt posture and exact physical gear graph, and retains the prior pair with reload advice on an owner/readback block. It adds no second equipment or defeat authority and is not wired to `EpochApp` controls.

| Atomic surface | Current evidence | Selected activation status |
| --- | --- | --- |
| Creator, Character item actions | Native creator/gear and #49–#51 session callers pass controlled tests; `EpochApp` first-campaign selection is still v2, native Character is review-only | held |
| Quest, travel, four survey stages | #52 owner-backed selected-session wrapper and retained witness chain pass controlled Save/restart | held in actual UI |
| Nearby combat, effective-worn resources, Normal defeat | #53 authentic authored Stonevein path passes controlled owner tests; safe-settlement receipt is playable | held in actual UI |
| Pending publication and recovery | #44 owner plus this exact selected-session wrapper pass interrupted, non-head and recovery readback | latent owner-tested; selected scenario acceptance open |
| Terminal history | #54 exact-source terminal wrapper passes controlled interruption/retry/history | held in actual UI |
| Ordinary Save, mixed-format tabs, rollback | Native #51 descendant host passes controlled Save/restart, but `EpochApp` explicitly holds v3 Save and recovery and mixed-format selected UI behavior has no complete end-to-end proof | held |

No complete native selected UI build exists yet. Authenticated selected gameplay was not attempted. The existing v2 selected path, old account records, parked combat route and deployed Site were not changed.

## Verification and limits

| Check | Result |
| --- | --- |
| Red-before-green focused pending host | Missing module failed; final 2/2 pass |
| Full UI Node suite | 94/94 pass |
| Controlled browser owner suites | Native pending 10/10, v2 Normal defeat 8/8, v2 terminal 14/14; synthetic real-`EpochApp` terminal QA pass |
| Adjacent root owner/Save selection | 440/444; all four failures reproduced on exact #54 parent: two missing sparse backstory paths, combat-status source-text assertion, legacy-ledger direct Node import |
| UI Node typecheck and content lint | pass; lint 72 files |
| Broad UI TypeScript | #54 115, child 115; zero new normalized diagnostics |
| Broad workspace TypeScript | #54 762, child 762; zero new normalized diagnostics |
| Direct Vite build | pass; sparse checkout omits four public launcher artwork URLs; no deployment artifact claim |
| Staged diff check | pass |

Applied FP-001 (real caller wrapper plus controlled browser), FP-002/017 (fixture versus selected boundary), FP-003 (latent pending owner and explicit future selected scenario hold), FP-005/012 (interrupted publication/recovery, exact duplicate and non-head cases), FP-008/009 (stacked base/live head and branch review), FP-011/013/015 (receipt/source and physical gear graph), and FP-016 (native controls remain review-only). No new generalized failure pattern was found.

## Next gate

Implement the **complete** native v3 selected creator, Character, World/survey, combat, pending/terminal and ordinary Save route as one coherent UI activation. Prove stale/mixed-format tabs, interrupted publication, exact retry and rollback, then authenticated fresh-format gameplay and Save/restart. If the package cannot be activated atomically, keep current selected production on v2 and commit only independently verified unactivated work. Pending remains a latent owner-tested path under the owner's decision; do not manufacture a selected pending scenario. Keep #55 draft on #54. No merge, deployment, old-record deletion or Game-version change is authorized by this gate.
