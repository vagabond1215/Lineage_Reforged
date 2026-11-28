# Connector post-mainline cleanup preflight

**Date:** 2026-11-28. **Surface:** read-only GitHub Connector inspection and documentation-only corrections. **Repository:** `vagabond1215/Lineage_Reforged`. **Live baseline before the doc-only edits:** `e71676461b27d3ca34ccff6012ed8f54c82e194f`. **Application and binary assets:** unchanged.

## What is independently verified

- PR #104 is merged at reviewed head `ae74fea0a17b1ec809ec5c12fc1a22fdeb090656`, merge `183dea35f5b9d932693cbac24b84640ef3b7735b`; PRs #102/#103 are closed without merge. The Codex [cleanup receipt](codex-post-mainline-cleanup-receipt-2026-11-28.md) is a separate locally executed record, not a Connector-run filesystem cleanup.
- [Immutable asset-duplicate evidence](connector-asset-duplication-evidence-2026-11-28.json): `unused assets/` has 88 files totaling 231,631,599 logical bytes. **52 entries / 147,672,320 logical bytes** have the same Git blob as files in the checked `apps/rpg-ui`, `packages` or `assets` trees. **36 entries / 83,959,279 bytes** lack an identical tracked file in those three trees; retain pending original-source review. Git object deduplication means logical duplicates are not guaranteed disk savings.
- The live character-creator continent inventory has **9 selected images whose Git blobs are byte-identical to the matching normal images**, totaling **33,372,361 logical bytes** of selected variant paths. The catalog presently references separate `selectedImageUrl` paths, and the [archived standalone preview manifest](../prototypes/lineage-reforged-current-preview.manifest.json) records image dependencies. A versioned UI and visual/keyboard check is required before changing these references.
- The [README](../../README.md) and [standalone prototype guidance](../prototypes/README.md) now say PR #103 was closed without merge and is historical reference, not a parallel React implementation.
- No binary assets, Git branches, PRs, Sites, worktrees, production source or historical world-source manifests were modified in this preflight.

## Selected historical New UI refs compared against the current development mainline

Direction: `base=branch`, `head=master`. **Branch-only commits = 0** means the branch tip is an ancestor of current `master`. Even those refs may have an attached worktree, historical PR consumer or ignored local evidence, and are **not** automatically cleared for deletion.

| Remote branch | Exact Git branch head | Branch-only commits | Classification |
| --- | --- | ---: | --- |
| `codex/new-ui-mainline-final-2026-11-23` | `ae74fea0a17b` | 0 | Merged history; retire only after local owner/evidence audit |
| `codex/selected-world-creator-ux-2026-11-23` | `3789c12b99af` | 0 | Merged history; retire only after local owner/evidence audit |
| `codex/selected-world-entry-creator-2026-11-23` | `acd4d61d6c8c` | 0 | Merged history; retire only after local owner/evidence audit |
| `codex/selected-world-character-creator-2026-11-22` | `f415c5c4ab62` | 0 | Merged history; retire only after local owner/evidence audit |
| `codex/functional-world-integration-preview-2026-11-22` | `bae33e656b8c` | 0 | Merged history; retire only after local owner/evidence audit |
| `codex/selective-ui-consolidation-2026-11-22` | `7d96447ecce7` | 0 | Merged history; retire only after local owner/evidence audit |
| `codex/l1-branded-welcome-account-entry-2026-11-11` | `14aa6380a3a6` | 0 | Merged history; retire only after local owner/evidence audit |
| `codex/ui-shell-account-first-slice-2026-11-21` | `7624adc2f54b` | 20 | Unique commits; do not remove |
| `codex/a3b-world-creator-integration-2026-11-22` | `4c38da5905f2` | 30 | Unique commits; do not remove |
| `codex/a3b-chromium-matrix-2026-11-22` | `f705857c491b` | 32 | Unique commits; do not remove |
| `connector/a3b-independent-connector-source-audit-2026-11-22` | `77afc6b51e10` | 32 | Unique commits; do not remove |

**Result:** 7 branch heads are contained in `master`; 4 have unique unmerged history. Comparisons are GitHub snapshot evidence, not local worktree or ignored-content inspection.

## Boundaries for the next Codex implementation pass

1. Use the exact paths and blob IDs in the asset evidence JSON; refresh `origin/master` before work. Verify every proposed archive deletion's historical references, art ownership, old screenshots and manifest consumers, and whether canonical active art is a suitable retained source. Retain unmatched originals.
2. Do **not** delete the nine active `-selected.png` assets until their `selectedImageUrl` consumers, standalone preview manifest, required semantic selection state, and any associated tests are updated in one coherent patch; confirm browser appearance, focus, keyboard, image loads and fallbacks.
3. For worktree retirement, Codex must inspect Git status **including ignored files**, package dependencies, local QA screenshots, source manifests, site-specific `.wrangler` folders, attached branches, unique commits, and listening processes. The previous Codex dry run found zero auto-eligible worktrees; do not override guards with force.
4. The original `unused assets/` placement policy in root README designates it as an archive. If reorganizing or deleting a byte-identical archived copy, preserve its original provenance path/content in the audit receipt and confirm no active consumer. Keep archived unique images and pinned world source bytes.
5. Do not alter other repositories or external Sites from this connector task. The owner-private preview remained active as recorded by Codex, and its unique assets/consumer state remain separate. Do not claim hosted retirement without Site tooling.
6. The development goal after cleanup is still actual World → Character → playable session → Save → resume. The inherited combined UI build remains red; do not report it as passing based on direct Vite evidence.

**Disposition:** `CONNECTOR_AUDIT_COMPLETE / DOC_POINTERS_REPAIRED / ASSET_AND_WORKTREE_MUTATIONS_HELD_FOR_CODEX`. No claim of runtime validation or reclaimed disk space.
