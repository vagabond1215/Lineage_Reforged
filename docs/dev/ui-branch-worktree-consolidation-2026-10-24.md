# UI branch and worktree consolidation — 2026-10-24

**Run:** unversioned repository coordination at synchronized `master`/`origin/master` `f6c7b5045d163d4ac19cf5e6b3eeb6ab35cca422`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; development-milestone impact `none`; game-version impact `none`. DEV-0.7.2.13 Combat Action Result Disclosure remains parked. The full preview UI source was committed and pushed in `f6c7b504`, before this cleanup. This run changes no product source.

## Live branch and PR disposition

Fetched and pruned. All twelve repository PRs #5–#16 remain open **drafts**. The source for the Character, owner, top-bar and shell UI stacks #7–#16 is re-authored on `master`, but their histories and unique evidence/design documents are not fully promoted. Authenticated selected-client navigation, actions, Save/load and restart remain unverified on exact main. Thus the open PR heads and their stacked bases still have named consumers. A source-equivalence assertion alone cannot close them or justify ref deletion.

| Retained stack | Exact remote heads at inspection | Next review trigger |
| --- | --- | --- |
| UI design #5 | `parallel/ui-guidance-consolidation-2026-10-21` `8980ea38` | Reconcile its unique design/prompt guidance with current main authority. |
| Character #7 → #11 → #14 | `8610260f` → `2d140c4a` → `ce2fc143` | Exact-main selected Character, Equipment/Inventory, keyboard, action and Save/restart review; preserve unique PR evidence. |
| Equipment owners #10 → #12 → #13 | `9f390e03` → `7b6dccf5` → `c9581eb9` | Selected inventory/equipment action and state-conservation review, plus evidence-preserving PR disposition. |
| Top bar #8 → #16 | `20825cce` → `c6d52a7a` | Selected resources, warnings, popups, controls and Save review. |
| Shell #9 → #15 | `69215b6f` → `7cb72c3d` | Selected desktop/mobile landscape and portrait layout, focus and overflow review. |
| Nutrition #6; metabolic owner | `8c7f471f`; `80c97049` | Separate nutrition owner/design migration decision. |

All remain `HOLD_NAMED_CONSUMER`. Protected readiness `59c103c3` and prompt-integrity `58a34e37` refs remain `PROTECTED_REFERENCE`; administration `210df5bc`, creator planning `2cf0cb6c` and creator implementation `d7d12467` remain `HOLD_NAMED_CONSUMER` at their established governance/creator triggers. None was merged, rebased, retargeted, closed, force-updated or deleted. Their exact heads must be refreshed before a later retirement decision.

## Safe local cleanup

Eight local implementation worktrees were clean, inside `C:\Codex\EoL`, and at heads exactly matching their retained remote branches. Removed only their worktree registrations/checkouts: `.compact-landscape-domain-rail`, `.equipment-inventory-ux`, `.equipment-slot-repair`, `.inventory-bag-exact-target-repair`, `.inventory-consume-stale-guard`, `.inventory-ui-selection-safety`, `.mobile-shell-repair`, and `.stacked-top-resource-meters`. Local and remote branch refs remain. Five checkout folders retained only `apps/rpg-ui/node_modules` junctions to the primary checkout after `git worktree remove`; each junction target and sole-child status was checked before removing the link and its empty parent folders. The primary dependency directory was not removed.

Detached composition/rehearsal worktrees remain because they contain uncommitted overlays, screenshots, diagnostics or a live review fixture. The separate audit worktree was not touched. The next cleanup trigger is an individual evidence inventory and preservation check for each detached worktree, followed by exact-path verification. No recursive deletion was used.

## Validation and boundary

This cleanup used fetched/pruned refs, live PR metadata, branch-head and remote equivalence checks, worktree status, exact junction-target checks and a post-removal worktree inventory. No gameplay tests were rerun for filesystem/coordination-only cleanup. The prior `f6c7b504` integration's 32/32 focused UI, 51/51 adjacent owner tests, Node UI typecheck, Vite build and baseline-relative TypeScript results remain **prior evidence**, not new selected-client acceptance. `git diff --check` is required before this documentation commit. Applied FP-002 (acceptance hold), FP-008 (semantic branch composition) and FP-009 (exact ref identity).
