# Historical UI PRs #10–#16 — exact evidence and current-master source preflight (2026-11-09)

**Status:** `PR10_16_HISTORICAL_RECORDS_PRESERVED; PR11_BINARY_EVIDENCE_PRESERVED; SEMANTIC_EQUIVALENCE_AND_SELECTED_ACCEPTANCE_HELD`.

Repository: `vagabond1215/Lineage_Reforged`. Read-only comparison, exact historical archival and unversioned coordination only, **not an implementation or accepted UI test**. Source identities reflect GitHub's live master at `3fd43811c0ea4b13273fd62485d7625d563bee5e`. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP` and `HOLD_SELECTED_ATOMIC_ACTIVATION` remain unchanged. PRs #10–#16 were all open/draft/unmerged at inspection, with zero entries each in the combined GitHub issue/review/inline discussion timeline. No PR was closed, merged, rebased, retargeted or deleted.

## Dependency and retained ref matrix

| PR | Exact unchanged head | Base and purpose | Retained review consumer |
| --- | --- | --- | --- |
| #10 | `9f390e03a26011213dee53929da309f470adba62` | master; equipment slot eligibility and re-equip owner | Exact-current-owner equivalence, non-fungible gear cutover compatibility and selected item/Save |
| #11 | `2d140c4a2693345fa4f8188bb9e2e625b186538f` | PR #7; Equipment/Inventory presentation and stale UI selection | Exact-current Character action/selection, accessibility, authenticated Save |
| #12 | `7b6dccf592adbbef05361bb501fceb461dd1f5e5` | PR #10; reject stale Consume | Current owner rejection/replay and selected legitimate item Use |
| #13 | `c9581eb9834d9c1374560b3a4b26bbdf1dae210d` | PR #12; exact validated bag target | Current source-target conservation and old-snapshot cases |
| #14 | `ce2fc143e7e5672c986d162d6ed714bad243ac46` | PR #11; distinguish duplicate bag rows | Current selection identity and React/key/ARIA/focus |
| #15 | `7cb72c3d05667ca92821246d0455c0e6c00eb43c` | PR #9; compact landscape rail | Current landscape/portrait/nav/overflow/keyboard |
| #16 | `c6d52a7a14f5f70cddcb7299e63e2a0f3ddb13f6` | PR #8; compact top-resource header | Current live HP/MP/ST and conditions, accessible controls |

These stacked branches are **not merged by commit ancestry** simply because master re-authored source. The older base/master merge history, local dirty-worktree inventory and selected acceptance remain independent. Do not blindly apply any old source patch or copy historical branch-disposition-register sections onto master.

## Eight exact historical implementation/evidence records

Each complete document was fetched at the PR's **specific head**, source Git blob verified, copied unchanged under `docs/dev/evidence/historical-ui-prN/`, and independently read back with the exact same Git blob and file content.

| PR | Archived original filename | Git blob | Preservation commit |
| --- | --- | --- | --- |
| #10 | `equipment-slot-reequip-repair-record-2026-10-22.md` | `946eb8768b179f1c1babe59564c52e6d877069bb` | `cc6af31aca0a2f6011c12dc9b86fb42dca5f6803` |
| #11 | `equipment-inventory-integration-hardening-record-2026-10-22.md` | `50ae5f3e713c5741c938f61c9e0fe0b1c7f816e4` | `538515fea576c93805a3691c87c86ca3979ba1fc` |
| #11 | `equipment-inventory-ux-stacked-first-slice-record-2026-10-22.md` | `bbfa91b7480a45d5ed9d24c25530ac12f5f69429` | `a35bebfd177e0066256f46e106b4ed5999f28dc9` |
| #12 | `inventory-consume-stale-stack-repair-record-2026-10-22.md` | `c0936cafa1caba9ed40aabfb46e6b10e500fe2ff` | `dc0eaea8350622c9b2148c7a459dea032e64277f` |
| #13 | `inventory-exact-bag-owner-repair-record-2026-10-23.md` | `7fd82cf99eee14f82c4ffb2d31112543793e061a` | `3dbb256038aacb7ff695b46f807da000805d0971` |
| #14 | `inventory-ui-selection-identity-repair-record-2026-10-23.md` | `65c3e0b4b2fa37dd529e153938f7be72f2c7ef05` | `84f0987e1f5fe0f93a527ba9e7b7558eb91aac60` |
| #15 | `compact-landscape-domain-rail-record-2026-10-23.md` | `a8b11af31e843897ae15e65b1584955141f4f610` | `d810e833b935d4fbeec1e28545858e1236cb686a` |
| #16 | `stacked-top-resource-meters-record-2026-10-23.md` | `8a8d693c487246f44f6cf75ebe00ed357c863fcf` | `d3ed4dadc1acb27cfdbff2c067a6f0f190215594` |

These retain historical **reported** pre-edit failures and focused test results, not independently rerun tests or proof of current selected gameplay.

## PR #11 two binary screenshots, exact remote publication

The two PR #11 JPGs were absent from master at their original paths. GitHub fetched their base64 bytes, created verified exact Git blobs, then used a new tree and a single fast-forward master update with an expected-parent lease. Fresh remote readback matched both source blobs; the published commit changed **exactly two JPG paths**, no executable source.

| Historical path now preserved on master | Git blob |
| --- | --- |
| `docs/dev/equipment-inventory-hardening-evidence/equipment-critical-375x667.jpg` | `90ad7e89f9b015618e59eba9ecb4222340b20111` |
| `docs/dev/equipment-inventory-hardening-evidence/inventory-critical-375x667.jpg` | `9747937ad811b23e7f698142095663bd8bd9010a` |

Exact publication: `3fd43811c0ea4b13273fd62485d7625d563bee5e`. PR #9's eight PNG screenshots are **already exact-preserved** under `docs/dev/mobile-shell-evidence/`. Neither the JPEGs nor the PNGs are authenticated selected-gameplay acceptance.

## PR #10–#16 current-master source/test identity matrix

The connector fetched **raw Git tree IDs** for master and every exact PR head, inspected all seven recursive trees (no truncation) and compared the source/test paths in each PR's changed-file list. This is a **byte identity inventory only**: identical confirms unchanged file bytes, while different does **not** establish missing behavior, unsafe code or semantic equivalence.

| PR | Exact identical source/test paths on master | Changed source/test paths that exist but have different blobs |
| --- | --- | --- |
| #10 | `game-shell/equipmentSlotEligibility.js`; `game-shell/equipmentSlotEligibility.ts`; `game-shell/newGameSnapshot.ts`; `tests/equipment-slot-reequip.test.mjs` | `features/characterPanelState.ts` |
| #11 | None | `features/CharacterPanel.tsx`; `tests/equipment-inventory-presentation.test.mjs` |
| #12 | `tests/inventory-consume-stale-guard.test.mjs` | `features/characterPanelState.ts` |
| #13 | `tests/inventory-exact-bag-target.test.mjs` | `features/characterPanelState.ts` |
| #14 | `tests/inventory-selection-identity.test.mjs` | `features/CharacterPanel.tsx`; `tests/equipment-inventory-presentation.test.mjs` |
| #15 | `components/SideNav.tsx`; `components/layout/AppLayout.tsx` | `styles/mobile-shell.css`; `tests/mobile-shell-navigation.test.mjs` |
| #16 | `components/ui/TopResourceMeter.tsx` | `components/TopStatusBar.tsx`; `components/top-status-layout.css`; `game-shell/InGameShell.tsx`; `tests/top-status-bar-render.test.mjs` |

**Total: 23 reviewed source/test path occurrences; 10 exact, 13 different, 0 missing.** Shared master files occur in multiple historical PRs; these occurrence counts are **not distinct file counts**.

The safe next executable test/review is a **bounded exact-current-master semantic owner/caller regression and UI presentation audit** of just the 13 differing occurrences, deduplicated by path. Preserve authoritative current owners and later non-fungible gear migration decisions. Run focused existing tests and compare required behaviors in the historical records; do not restore outdated UI navigation. Authentication-dependent selected Equipment/Inventory, resource/condition, portrait/landscape, keyboard and Save/restart proof remains a **separate authorized review trigger**. Do not claim success without actual observations.

## Related branch boundaries

- PR #5: exact docs and independent supersession accepted in [decision](historical-ui-pr5-independent-lifecycle-approval-2026-11-09.md), classified `SUPERSEDED_PRESERVE_EVIDENCE`, **still open**. Closure is an **explicit separately authorized action**; remote branch deletion is later and separately authorized.
- PR #6: three unique historical documents now byte-exact archived under `docs/dev/evidence/historical-nutrition-pr6/`, including the **non-installed** original proposed prompt at commit `a1031fefe5c908955c8a4de1898a14f50f7c6f48`. Its three shared-path diffs are dated cross-links to unapproved proposed Nourishment UI, not new nutritional owner decisions. PR #6 remains `HOLD_NAMED_CONSUMER` pending Human-normalized unit/capacity/conservation and Save migration authoring/decision. The separate contract branch is held. Do not infer acceptance from archival or a changed GitHub mergeability result.
- Historical UI PRs #7–#9 and downstream #10–#16 retain their own branches and selected-acceptance obligations. PR #11's two screenshots and PR #9's eight screenshots are preserved; no further known PR #10–#16 binary evidence is missing from changed-file inventories.
- Native-v3 spare staging Site cleanup is [recorded but deferred](native-v3-spare-staging-site-cleanup-hold-2026-11-09.md). Its exact provider ID and safety remain unresolved; do not modify hosted Sites or activation.

## Next action and stopping rule

**Connector-safe historical evidence promotion is complete for the identified PR #10–#16 dated implementation records and binary images.** Do not schedule another wide old-PR inventory.

Next up, **Codex** should perform the precise live master semantic owner/caller and focused test comparison, producing an evidence-backed source-behavior matrix and remaining acceptance triggers. This is a review-only task until an independently proven missing behavior authorizes a separate small repair. No account, credential, Save, deployment, local worktree or native-v3 mutation is authorized here.

If the user prefers an immediate repository-lifecycle action instead, ask explicitly whether to close PR #5 **without merging and while retaining its remote branch**. Never infer permission to close from an earlier readiness or supersession approval.
