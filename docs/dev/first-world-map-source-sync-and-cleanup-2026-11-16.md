# First World: 16K source intake, synchronization and map cleanup

Date: 2026-11-16. Unversioned maintenance/source-intake run; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`; development and game-version impacts `none`.

## Outcome and identities

Desktop originals now exist unmodified in Git LFS under `packages/content/base/world/map_assets/first_world_simulator_option2_2026_11_15/`. [Draft PR #90](https://github.com/vagabond1215/Lineage_Reforged/pull/90) targets inspected/current master `fed669de69f2da9333eb8addd0885ca4a2c4c100`; asset commit `abc15835e61b0c9a0ea7e33fe07f8277c205167e`, followed by a receipt-only commit. Primary checkout was safely moved from stale L1 `14aa6380` to synchronized master, then this isolated intake branch; no new worktree was created. Local master and origin/master match. The active C1 remote remains `e4a9f20f769e94e7493de1e955f8c5a8697203a8` and is not merged or rewritten.

All three images are **16384 × 9421**, total **49,846,542 bytes**. Desktop original, previously accepted manifest, ZIP entry, copied repository file and freshly downloaded remote LFS object agree by SHA256 and length. All PNG chunk CRCs and complete decompressed scanline sizes/filter types passed. Local `git lfs fsck --objects --pointers HEAD` passed. Tracking applies only to the new directory; original `First World Biome.png` / `First World Elevation.png` bytes and tracking remain unchanged. The ZIP and simulator saves are not committed.

The [manifest](../design/first-world-option2-16k-export-triad-manifest-2026-11-15.json) and [machine receipt](first-world-map-source-sync-and-cleanup-evidence-2026-11-16.json) hold exact filenames, hashes, paths, source/remote proof and cleanup identities. Use `git lfs pull` after checkout to hydrate the archived PNGs. GitHub LFS upload and fresh download succeeded; account-wide quota allowance was not exposed or inferred.

## Recent connector work and retained files

Master contains PR #89's accepted Option 2 macro-lore/evidence documentation and PR #81's closeout. Those are the immediate source-intake authorities. The three 16K exports are a different evidence set from C1-AC's eleven earlier screenshots; its frozen screenshot manifest is not rewritten.

C1 branch delta `3ebdc92d..e4a9f20f` contains 17 review code/test/workflow/evidence files, 2,569 added lines: C1-AB endpoint continuity, C1-AC simulator district references, C1-AD synthetic Voronoi provenance/adjacency. It does not alter canonical geography. The installed Starfall/L2 prompt and general coordination authorities did not change in that delta; they remain a separate route. C1-AD reports 88 hosted tests, not Windows acceptance of a real decoded map. This intake does not claim to complete that validation lane.

**Deferred finding before real-cell tool reuse:** `scripts/lib/kaelvar-c1ad-voronoi-preflight.mjs` at inspected C1 head checks shared full edges but accepts a rectangle `(10,10)–(30,30)` containing another `(15,15)–(25,25)`, separate provinces and empty neighbor arrays, as `SYNTHETIC_ONLY_VORONOI_ADJACENCY_STRUCTURALLY_VALID`. Independent read-only execution reproduced the missing interior-overlap rejection. The synthetic-only/real-source gates still prevent treating this as imported-source acceptance. Repair and adversarial containment/overlap tests belong in a bounded C1 source-tool pass before any real-cell reuse; not in this archival upload.

Preserve old source readers, C1-AA–AD witnesses, original images and original component/anchor guards until the new source transform and physical parity are independently proven. The committed C1-AC SVG is only 17,203 bytes and remains useful reference evidence. No tracked map code, tests or historical assets were deleted for cosmetic consolidation.

## Completed physical cleanup

Removed **17** clean detached verification checkouts through `git worktree remove`, without force: five map siblings and twelve temporary C1 checkouts. The receipt lists every exact path, head, preserved remote ancestry and measured byte count. Each passed a fresh HEAD/detached/status/untracked/ignored/lock/process-reference check; the earlier inventory found no junctions. All commits remain recoverable. Command-line process inspection is not a universal open-file/editor-buffer audit; no active consumer was identified.

Registered worktrees **61 → 44**. Removed regular-file bytes: **14,087,911,490 (13.12 GiB)**. Observed disk-free increase across removal: **13,808,607,232 bytes (12.86 GiB)**; concurrent filesystem activity means this differs from file-byte accounting. No Git object pruning or unrelated native-v3 cleanup occurred.

Storage snapshot before removal: primary tree (including unrelated nested checkouts) 43,006,866,989 regular-file bytes; map sibling trees 7,335,986,352; temporary C1 checkouts 9,944,547,038. Git objects: 48.31 MiB loose + 1.07 GiB packed. Junction targets were not followed. Largest retained root/nested build directories are approximately 475–485 MB each; they are outside this map-cleanup scope.

Retained `C:\Codex\EoL-map-review` and `C:\Codex\EoL-mixed-map-review`: each has 175 untracked build-output files, plus 4,766 / 4,761 ignored dependency files. Together these contain 3,192,621,900 regular-file bytes. Next cleanup trigger: identify output consumers, prove build reproducibility or retain unique evidence externally, then recheck before deletion. Do not equate generated-looking filenames with proven disposability.

## Branch / PR dispositions

| Lane | Action / disposition | Exact next review trigger |
| --- | --- | --- |
| PR #89 lore branch, `630223a1f0508b252fd60e7458ccfd23abc502e2` | `MERGED_RETIRE` completed: remote branch deleted and absence verified | Closed: six changed files byte-identical on master; merge `1061b17a` reachable; no checkout, local branch, descendant ref, open targeting PR or named consumer found |
| PR #81 Layout A, `0db193e3fc30502bbfcd4eb7e8388586aec239a5` | Already closed/unmerged; remote branch retained, disposable checkout removed | Promote/resolve five unique sketch/docs/test paths for later child-region comparison before branch retirement |
| PR #76 | Retain policy lane | Independent settlement/population acceptance; no map-source shortcut |
| PR #77 | Retain held source/UI lane | Revalidate old footprint change, 42 exclusions and 88 settlement anchors against registered 16K source |
| PR #78 | Retain held mixed-landmass reviewer | Registered new-source comparison and explicit old/proposed parent separation |
| PR #79 | Reusable source tools are integration candidates; branch retained | Re-author minimal tools/tests on master and independently validate without old ownership claims |
| PR #80 | Retain landmass-first evidence | Reconcile contract/proposal ledger with Option 2 source |
| PR #82–#87 | Retain stacked coordinate/coast/ink witnesses | Source alignment, owner-native acceptance and reviewed semantic subset integration; no blind stacked merges |
| C1-K through C1-O | Retain active unique evidence and source tooling | Whole-source comparison, bounded tool defect resolution, owner geographic decision and explicit semantic integration |
| New PR #90 | `ACTIVE_WORK`, source archive review only | Independent archival provenance review; merge only archive/receipt scope, then retire intake branch after accepted reachability proof |

No other PR was closed, retargeted or merged. No other branch was deleted. Current C1 versus inspected master: 202 ahead / 5 behind, 151 changed paths; this is a snapshot, not integration authority.

## Checks, holds and next bounded work

Local coordinate-first suite: **21/21**; no-new-hex guard: 832 code files, zero new dependencies; five-region authoring audit remains canonical-held. [Hosted geography guard](https://github.com/vagabond1215/Lineage_Reforged/actions/runs/43872339284) passed on asset commit `abc15835`. Final documentation-only receipt is distinguished from that tested asset source. No runtime, schema, settlement, route, World/Save, source-coordinate or canonical parent changes were made.

Archival transfer is complete; save/export identity, legacy-coordinate transform, independent islands/component inventory, isthmus topology and canonical geographic adoption remain held. Next map implementation is bounded source registration/comparison, with the noted synthetic-overlap defect fixed before real-cell use. Missing precise elevation meters does not block qualitative geography.

FP-002: archive/test proof is not geographic acceptance. FP-007: bounded documentation edits preserve prior sections. FP-008: six-file semantic/equivalence review before branch retirement, no blind C1 merge. FP-009: inspected master, asset source, final receipt and live remote identities are separated.

Cleanup: all foreground commands ended; no persistent server, browser, game or helper was started. Temporary remote-download cache is removed after hash verification; small JSON receipts remain external and in this repository.
