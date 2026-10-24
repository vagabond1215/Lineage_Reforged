# UI branch consolidation and preview access — 2026-10-23

**Run:** unversioned UI coordination; source `origin/master` `8981bf02aa9fef535862ed92947ab2326e129343`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, development impact `none`, Game-version impact `none`. DEV-0.7.2.13 Combat Action Result Disclosure remains parked and unfinished. The current Character UI readiness prompt remains installed.

## Access decision

No built-in shared-password development login is needed for visual review. The disposable combined worktree has an untracked `/review-ui.html` route rendering the actual `InGameShell` against `demoSnapshot`, clearly marked as a no-sign-in/no-save fixture. At 1280×720 it showed the compact landscape rail beside the Character workspace and stacked HP/MP/ST. A first browser observation exposed an equal-specificity Tailwind override that placed the workspace below the rail; PR #15 corrected it at `9929760d`. At 667×375 the corrected fixture measured a 119px header, 36px resource group, 108×252px rail and 535×252px workspace, with no document-level horizontal overflow. These are controlled preview observations, not selected campaign or Save/restart acceptance.

The local account owner `apps/rpg-ui/src/game-shell/launcherAuthManager.ts` creates salted PBKDF2 verifiers and validates credentials before creating a runtime session. A simple password embedded in the client would be recoverable from source/build output and would create a second access path with different semantics. It would not prove the real sign-in and selected persistence flow. No authentication, storage, production source, save schema or hosted site was changed. If selected acceptance is later needed, use the existing ordinary sign-in with a user-authorized isolated campaign/profile; never reuse protected accounts or infer acceptance from this fixture.

## Branch and PR dependency map

All twelve open PRs were confirmed **draft** on 2026-10-23. Their shared merge base with current master is `f56229dd`; master has six commits beyond that base. The PR bases below describe review stacks, not permission to merge.

| Stack | Exact PR order and inspected heads | Current disposition and next review trigger |
| --- | --- | --- |
| UI guidance | #5 `8980ea38` | `HOLD_NAMED_CONSUMER`: reconcile its 33 unique documentation commits against live prompt/handoff/planning authority; promote only current design guidance at the dedicated UI integration review. |
| Character presentation | #7 `8610260f` → #11 `2d140c4a` → #14 `ce2fc143` | `HOLD_NAMED_CONSUMER`: #11 depends on the equipment owner stack; review actual selected Character, Equipment, Inventory, keyboard, actions and Save/restart before acceptance. |
| Equipment and inventory owners | #10 `9f390e03` → #12 `7b6dccf5` → #13 `c9581eb9` | `HOLD_NAMED_CONSUMER`: retain exact eligibility, stale-consume and indexed-bag fixes together; run owner, conservation and selected action/readback gates before integration. |
| Top bar | #8 `20825cce` → #16 `e6470be5` | `HOLD_NAMED_CONSUMER`: combined selected-client layout, resource/condition, popup and Save controls review. |
| Responsive shell | #9 `69215b6f` → #15 `9929760d` | `HOLD_NAMED_CONSUMER`: verify live selected landscape/portrait, focus, overflow and usable workspace with #7/#8 and owners. The controlled preview has only bounded visual evidence. |
| Nutrition guidance | #6 `8c7f471f`; separate metabolic owner `80c97049` | `HOLD_NAMED_CONSUMER`: independent nutrition contract and migration gate; no UI-stack integration. |

Older protected readiness `59c103c3` and prompt-integrity `58a34e37` references remain `PROTECTED_REFERENCE`. Administration `210df5bc`, creator planning `2cf0cb6c` and creator implementation `d7d12467` remain `HOLD_NAMED_CONSUMER` at their named governance/creator reviews. Their unique commits are not part of the UI stack. No remote branch or open PR was merged, retargeted, closed, force-updated or deleted.

## Cleanup performed and retained state

The primary checkout moved from clean tracked PR #8 source to local `master` and fast-forwarded six commits to `8981bf02`, matching `origin/master`. Draft PR #8 remains at its untouched remote head and also has PR #16 as a retained consumer. The clean detached `.equipment-inventory-pr7-baseline` worktree was removed only after verifying its head exactly equaled retained PR #7 `8610260f` and it had zero tracked/untracked changes. Other detached compositions contain uncommitted source overlays, diagnostics or screenshots; they remain until their unique data is compared with committed PR/evidence records. The active `.landscape-resource-composed` checkout and localhost preview remain available for review; its untracked review route is fixture-only and uncommitted.

No source branch is safe to retire now: each is an open PR head, a stacked PR base, a protected reference, or a named held consumer. A future integration pass should first reconcile #5's durable design subset, then integrate/test the exact owner stack #10→#12→#13, Character stack #7→#11→#14, top bar #8→#16 and shell #9→#15 on current master. Preserve all historical `branch-disposition-register.md` entries when composing. Close/delete refs only after accepted equivalence on master, selected gates, PR closure and exact SHA recheck. Do not advance Game version or reactivate combat as a side effect.

**Checks for this coordination pass:** fetched/pruned refs; twelve live PR metadata readbacks; current master/worktree and branch/ref inventory; merge bases and ahead/behind for all nondefault remote refs; PR changed-path inventory; direct authentication owner inspection; verified clean baseline worktree before removal; `git diff --check` before publication. No new gameplay tests were run for documentation-only coordination. Applicable guardrails: FP-002 (fixture versus selected evidence), FP-008 (semantic branch composition), FP-009 (exact ref identity), FP-017 (production reachability). No new failure pattern.
