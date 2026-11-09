# Dirty UI worktree preservation — Batch A (2026-11-08)

**Status:** `BATCH_A_PARTIAL_PRESERVATION`, local-only. Unversioned repository maintenance at `master` / `origin/master` `a596112acf3945f2bf7c625e943f2511d12aa710`; Game `0.1.1-prealpha`; `HOLD_SELECTED_ATOMIC_ACTIVATION`. No selected-client acceptance, source integration, worktree retirement, branch/PR action, staging publication, deployment, or account/Save action is claimed.

The complete path-by-path reconstruction record is [`dirty-worktree-preservation-manifest-2026-11-08.json`](dirty-worktree-preservation-manifest-2026-11-08.json), SHA-256 `A12D7577848F93E132B56E7CC18B3CA5B6FDD052EF40B3CDAFFD45144D4F0144`. It records the exact local worktree and base commit, ordered Git status, every changed path's status, head and index entries, intent-to-add state, Git and filesystem modes, length, raw SHA-256, Git blob, matching retained source ref with exact commit, and per-worktree consumer/gate. The manifest is a composition recipe, **not** a claim that any mixture is an existing commit. It excludes ignored generated builds and the shared dependency junction.

## Exact local sources

All four directories are registered, non-reparse detached worktrees under `C:\Codex\EoL`. They remain intact. No staged content exists in any target.

| Worktree | Detached HEAD / reconstruction base | Modified | Untracked | Intent-to-add | Exact source-backed changed files |
| --- | --- | ---: | ---: | ---: | ---: |
| `.combined-ui-master-baseline` | `f56229dde859b9374a54368bd8a8fd2a9872daa1` | 0 | 1 | 0 | 0/1; separate byte copy below |
| `.inventory-bag-exact-composed` | `2d140c4a2693345fa4f8188bb9e2e625b186538f` (PR #11 head) | 5 | 11 | 0 | 16/16 |
| `.inventory-ui-selection-composed` | `2d140c4a2693345fa4f8188bb9e2e625b186538f` (PR #11 head) | 7 | 10 | 0 | 17/17 |
| `.ui-stack-readiness-review` | `ce2fc143e7e5672c986d162d6ed714bad243ac46` (PR #14 head) | 5 | 0 | 9 | 14/14 |

The nine additions in `.ui-stack-readiness-review` are **unstaged intent-to-add** entries. Their index blobs are empty (`e69de29bb2d1d6434b8b29ae775ad8c2e48c5391`); the manifest records their actual worktree bytes and Git blobs. Treating them as staged content would lose the index distinction.

All three compositions share the historical UI/owner stack but have different path sets and base commits. Each changed path has a chosen exact source ref and SHA in the manifest. The selected source refs are:

| Source ref | Exact commit | Bag / selection / readiness file counts |
| --- | --- | --- |
| Current `master` | `a596112acf3945f2bf7c625e943f2511d12aa710` | 6 / 7 / 6 |
| PR #9 `origin/codex/mobile-shell-usable-height` | `69215b6fa6b4bcc805363171541120645f365d8c` | 6 / 4 / 4 |
| PR #8 `origin/codex/persistent-top-bar-ui` | `20825cce24703e5066fb827075d5f310e847fb34` | 3 / 3 / 3 |
| PR #13 `origin/codex/inventory-bag-exact-target-repair` | `c9581eb9834d9c1374560b3a4b26bbdf1dae210d` | 1 / 1 / 1 |
| PR #14 `origin/codex/inventory-ui-selection-safety` | `ce2fc143e7e5672c986d162d6ed714bad243ac46` | 0 / 2 / 0 |

The 47 source-backed changed-file entries total 481,345 bytes when counted per worktree; repeated file contents across compositions are included in that figure. Their source blobs are already on retained remote refs or current master. The *composition recipe* is currently only in the new local manifest and this local record. No remote preservation of that recipe is claimed.

## Baseline diagnostic bytes

The sole untracked file in `.combined-ui-master-baseline` is `baseline-typecheck.txt`, 32,471 bytes, SHA-256 `35FB9E77898EDFFF5C673F3216175FC5212953C8E8A480C5EDC804C8DD6291F2`. It is the `tsc --noEmit -p tsconfig.json` baseline from historical master `f56229dd` (still an ancestor of current master), used by the October 22 combined Character/top-bar rehearsal to compare TypeScript diagnostic signatures; it is **not** selected-client acceptance. The same bytes occur in other local dirty worktrees, but no exact file appeared in inspected current-master or PR #5–#16 trees.

After checking the log for common credential assignments, private-key headers, email addresses, and user-profile paths, its exact bytes were copied to:

`C:\Codex\artifacts\Lineage_Reforged\dirty-worktree-evidence-2026-11-08\combined-ui-master-baseline\baseline-typecheck.txt`

The copy was reopened; length, every byte, and SHA-256 matched the source. This is **separate local preservation on the same host**, not an off-machine backup or a committed remote artifact. The log itself is not included in Git.

## Reconstruction and consumer boundary

For each composition, start a detached checkout at its recorded base commit. Materialize each manifest path from its chosen source commit and relative path using Git checkout semantics; restore the recorded mode and the nine intent-to-add index entries where applicable. For the baseline, copy the separate evidence bytes. Verify every raw SHA-256, Git blob, ordered status entry, head, and index entry against the manifest. The `apps/rpg-ui/package-lock.json` blob at each base and the `apps/rpg-ui/node_modules` junction target are recorded as dependencies. The three present `apps/rpg-ui/dist` directories are ignored generated output, excluded from the recipe, and must be rebuilt only if a consumer needs them. No reconstruction was executed in this pass.

PRs #5–#16 remain open drafts with their historical design, source, and selected-client consumers. The October 24 [main integration record](topbar-dock-main-integration-record-2026-10-24.md) says the UI/owner source was re-authored on main, while the [branch consolidation record](ui-branch-worktree-consolidation-2026-10-24.md) keeps unique evidence and exact-main selected gameplay/Save gates open. The baseline log's historical comparison is preserved locally. No record establishes that an active consumer still needs these *specific local directories*, but current sandbox process inspection cannot prove non-use. Preserve all four until the composition record has been independently retained and the local checkout consumer is checked before any retirement.

Source-byte preservation, reconstructability, historical diagnostics, selected UI acceptance, and runtime implementation authority are separate claims. This record establishes exact source-byte matches and a local reconstruction manifest; it establishes none of the latter acceptance or activation claims. FP-002, FP-008 and FP-009 apply: fixture or hash evidence does not accept selected behavior; mixed PR source requires semantic review; and exact live refs must be rechecked at any later disposition action.

## Next local cleanup review, not authorized here

All 37 other branch checkouts were freshly checked: each is Git-clean and at its matching remote commit. Four older unselected survey checkouts offer a bounded *potential* clean-worktree review: `.native-v3-survey-witness` (PR #34, 1,315,313,392 allocated bytes), `.native-v3-survey-command` (PR #35, 1,315,333,872), `.native-v3-survey-retained` (PR #36, 1,315,354,352), and `.native-v3-survey-mutation` (PR #37, 1,315,383,024). Combined allocation is 5,261,384,640 bytes; 1,942,752,736 of that is ignored `dist`, **already included** in the combined figure. Each has a shared `node_modules` junction, a small `tsbuildinfo`, and the same 74-byte ignored Wrangler deploy config (SHA-256 `568E64DF708DB1AAB4D2F625C38F8D590251E28EA783E073D6D1D03F5D0F00CB`; only `configPath` and `auxiliaryWorkers` keys were observed). Their PRs remain open draft in an unselected chain. This is a shortlist, **not** a finding that their local checkout consumer has ended or that they are safe to remove. The later survey-ledger and four-stage checkouts also contain ignored QA logs and are excluded from this first shortlist.

Do not touch active native-v3, staging, publication, rollback, account, Save, or shared dependency material. The 161 tracked `public` asset deletions in `.native-v3-character-panel` and the external audit checkout's permission failure remain separate blockers. No generated build or worktree was removed here.

## Preservation status and gate

- **Local diagnostic bytes:** copied and byte-verified outside the four worktrees.
- **Source bytes:** all 47 composition entries have exact current-master or retained remote-ref matches.
- **Composition identity:** complete local JSON manifest and this record; neither is committed, pushed, or remotely read back.
- **Remote preservation of new records:** **open**. A later approved documentation-only publication must review the two exact new files, commit/push them on the authorized branch, and read back their hashes before claiming remote preservation. No PR was opened for this administrative record.
- **Retirement:** **not authorized or ready in this pass**. Recheck exact status, source refs, local process consumers, evidence copy, and published manifest before seeking a separate worktree-removal decision.

`BATCH_A_PARTIAL_PRESERVATION` is the final result. `HOLD_SELECTED_ATOMIC_ACTIVATION` remains unchanged.

## November 9 diagnostic preservation update

The exact 32,471-byte historical diagnostic from detached master `f56229dde859b9374a54368bd8a8fd2a9872daa1` is retained at [`evidence/combined-ui-master-baseline-typecheck-2026-10-22.txt`](evidence/combined-ui-master-baseline-typecheck-2026-10-22.txt), SHA-256 `35FB9E77898EDFFF5C673F3216175FC5212953C8E8A480C5EDC804C8DD6291F2`. It records the October 22 `tsc --noEmit -p tsconfig.json` diagnostic signature used by the combined Character/top-bar rehearsal. It is historical comparison evidence, not a current TypeScript baseline or selected-client acceptance. The independent local archive identified above remains a second copy. The original Batch A status above describes its November 8 local-only snapshot; this update does not change that historical result or `HOLD_SELECTED_ATOMIC_ACTIVATION`.
