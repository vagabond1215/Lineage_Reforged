# Native v3 selected quest, travel and survey caller host gate — 2026-10-29

Status: **NATIVE_SELECTED_GAMEPLAY_HOST_VERIFIED; SELECTED_V3_ATOMIC_ACTIVATION_HELD**. Unversioned support for the current development band; Game `0.1.1-prealpha` and `INTEGRATED_LOOP` are unchanged.

## Source and authority

Fetched/pruned master `a596112acf3945f2bf7c625e943f2511d12aa710`; verified open draft #19 `62d6cc7b`, #44 `022fe22d`, #47 `3201c1c7`, #48 `10822490`, #49 `a625cea2`, #50 `5fc741aa` and exact parent #51 `586b0c67d0edf0bd1a67f20efaacd11bc7fdf3bb`. [Draft PR #52](https://github.com/vagabond1215/Lineage_Reforged/pull/52) `codex/native-v3-selected-gameplay-host` is a direct child of #51. Code commit `d33aa5045f3ec4eb72b5a2be16b3afda2cbab4d7` was pushed and read back. #19's approved fresh-save waiver applies; no obsolete development record was migrated, reset or deleted.

The new `nativeSelectedGameplay.ts` uses #51's immutable selected snapshot/control/source pair. The established quest and travel owners create and execute their commands; only native-valid accepted results enter the existing campaign mutation admission. Travel's authored clock, resource and body effects are retained. Survey reads the exact ready account head and account revision, binds the source artifact/publication/continuity, prepares the existing native source witness, commits the native ledger stage, then admits the returned snapshot and control together. The next stage requires descendant Save of the current stage. This adds no physical gear, quest, travel, survey or Save authority.

Wrong account/head/source, unavailable slot, unsupported quest, stale command, duplicate survey request, mixed format and unpublished next-stage requests retain the prior pair. A survey duplicate is recognized only after account/head checks and from the retained native receipt or exact pending mutation result. Quest/travel repeats reject as stale without repeating effects. The owner account publication independently verifies each survey witness against retained source on Save.

## Evidence

The focused test was red before `nativeSelectedGameplay.ts` existed. After implementation it passes **3/3**. A disposable synthetic browser account used a real native Hunter first campaign, account readback and actual `EpochApp` Continue. It accepted the Ashen Reef quest and travel, saved the reached source, committed and saved all four ordered survey stages, checked each receipt's prior artifact/publication and worn gear instance witness, then reopened the account and loaded the same gear graph and four results. A first-write abort during the second survey Save returned blocked while the previous head and account revision remained intact; retry published once. The final completed head had no pending descendant recovery. The actual selected `EpochApp` still rendered read-only Character review after Continue and page restart. This is synthetic test evidence, not authenticated selected-client acceptance.

| Check | Result |
| --- | --- |
| UI Node tests | 89/89 pass |
| Focused root gear, account, survey and Save tests | 99/99 pass |
| Focused new host tests | 3/3 pass, included in UI total |
| UI Node typecheck | pass |
| Broad UI TypeScript against exact #51 | parent 194, child 194 diagnostic lines; zero new normalized signatures |
| Content lint | pass, 72 files |
| Direct Vite production build | pass, 278 client modules |
| Disposable synthetic account browser | pass: four retained stages, interrupted Save rollback, restart and selected review hold |
| `git diff --check` | pass |

The sparse worktree omitted the large public artwork tree, so Vite warned about four launcher asset URLs. This code build is not a full-asset deployment artifact. The broad TypeScript baseline is pre-existing debt; the ordinary `npm run build` remains blocked by it. The first parent comparison could not resolve TypeScript after #51's temporary dependency link had been removed; a verified temporary link yielded the exact 194/194 comparison and was removed. No production change addressed that local sparse-checkout condition.

Applied FP-001 (real creator/account/Continue and owner commands), FP-002/017 (synthetic evidence kept distinct from selected acceptance), FP-005/012 (stale/duplicate and interrupted retry conservation), FP-008/009 (exact stacked source and baseline), FP-011/013/015 (retained-head provenance, one physical gear owner and paired result), FP-016 (actual selected shell placement). No new generalized failure pattern was identified.

## Remaining gate and disposition

Keep PR #52 draft and stacked on #51. Native selected creator and World/survey UI controls remain held. Combat/resource selected callers, pending Normal-defeat recovery, terminal history, ordinary UI Save and mixed-format tab/rollback behavior must form one coherent activation package before authenticated selected v3 acceptance. The selected v2 App is unchanged. [Next bounded route](../dev/next-native-v3-selected-combat-defeat-host-2026-10-29.md) addresses combat/resource and defeat authority without exposing controls. No merge, Site deployment or Game-version change is authorized by this gate.
