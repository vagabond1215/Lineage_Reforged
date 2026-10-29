# Native v3 selected session host and Save gate — 2026-10-29

Status: **NATIVE_SESSION_HOST_VERIFIED; SELECTED_V3_ATOMIC_ACTIVATION_HELD**. This is an unversioned support run for the current development band. Game `0.1.1-prealpha` and the `INTEGRATED_LOOP` playability posture are unchanged.

## Exact source and decision

Fetched/pruned master `a596112acf3945f2bf7c625e943f2511d12aa710` and verified draft #19 `62d6cc7b`, #44 `022fe22d`, #47 `3201c1c7`, #48 `10822490`, #49 `a625cea2`, and exact parent #50 `5fc741aa958528fe93c4b2032ce4d47e6a65d5b6`. [Draft PR #51](https://github.com/vagabond1215/Lineage_Reforged/pull/51) is a direct child of #50, with code commit `4ac5660c14cef836cf98b277febdaa6d3a4793dd`. #19's fresh-save waiver remains authoritative; no obsolete development-save migration or record deletion was attempted.

The selected `EpochApp` now retains one v3 snapshot/control/source-slot/account-revision host after an exact ready account readback. The host applies #49's admitted item result as a pair and publishes that exact pair using the existing descendant account adapter. Same-slot Save requires the observed source address; cross-slot Save requires an observed destination address. Accepted publication is read back and checked against the selected publication and account revision. Rejected, stale, duplicate, pending-defeat or unobserved-destination operations retain the prior host. It creates no second item, inventory or Save owner.

This is a working owner dependency, **not** selected v3 gameplay activation. `EpochApp` retains the host but leaves v3 item and ordinary Save controls disabled. The actual selected shell remains a read-only native Character/Inventory review. The selected creator still starts v2. World/quest/survey commands, combat/resource readers, pending Normal-defeat publication, terminal history and mixed-format account routing still need one atomic selected cutover. The existing selected v2 path is unchanged.

## Reproduction and verification

The new host test was red before the production module existed. The disposable real `EpochApp` browser case also reproduced the selected hold: native Unequip and Save were unavailable. The subsequent positive host case used a real native Hunter first-campaign publication and exact account readback, admitted Short Bow Unequip, rejected stale and duplicate item requests, rejected stale account and duplicate Saves, published one descendant, reopened the account owner, and loaded the same physical instance ID, durability, bag location and publication after page restart. The actual `EpochApp` displayed that carried instance on Continue and after page restart. This is synthetic browser evidence, not authenticated selected-client acceptance.

| Check | Result |
| --- | --- |
| UI Node tests, including new host regressions | 86/86 pass |
| Focused root gear, account, survey and Save tests | 99/99 pass |
| UI Node typecheck | pass |
| Broad UI TypeScript against exact #50 | parent 194, child 194 diagnostic lines; zero new normalized signatures |
| Content lint | pass, 72 files |
| Direct Vite build | pass, 278 client modules |
| Disposable Chrome real `EpochApp` and native host | pass; selected controls held, exact native host Save/restart |
| `git diff --check` | pass |

The isolated child was sparse because the machine had under 1 GB free. Direct Vite omitted the large public artwork tree and warned that four launcher image URLs would resolve at runtime. The code build passed, but this sparse output is **not** a full-asset deployment artifact. The ordinary `npm run build` remains blocked by the parent branch's broad TypeScript baseline. Initial focused owner tests could not resolve a sparse test helper; including the tracked helper yielded 99/99. The first Vite attempt lacked the sparse Worker and hosting manifest; including those tracked files yielded the passing build. No production repair was made for those checkout omissions.

Applied failure patterns: FP-001 (actual `EpochApp` Continue and host caller), FP-002/017 (synthetic fixture kept separate from authenticated acceptance), FP-005/012 (stale and duplicate item and Save calls retain exact state and publication), FP-008/009 (direct parent SHA and baseline comparison), FP-011/013/015 (one physical item owner, immutable snapshot/control pair and exact readback), FP-016 (actual selected Character/Inventory placement). No new generalized failure pattern was identified.

## Remaining gate

Keep PR #51 draft and stacked on #50. Review the [next selected gameplay caller dependency](../dev/next-native-v3-selected-gameplay-caller-host-2026-10-29.md) only after exact heads are refreshed. Full selected v3 activation requires creator, World/quest/four-stage survey, combat/resources, pending-defeat recovery, terminal history, ordinary Save, stale/mixed-format and interrupted-publication coherence together. Only then use an authorized authenticated campaign for selected gameplay and Save/restart proof. No Site deployment, merge, Game version change or old-record reset is authorized by this result.
