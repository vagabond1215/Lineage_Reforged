# Codex work order: targeted asset deduplication and obsolete worktree retirement

**Date:** 2026-11-28. **Run:** unversioned repository hygiene, after the initial local cleanup receipt and independent Connector preflight. **Scope:** Lineage: Reforged only. **No game-version advance, production deployment, source-history rewriting, or cross-repository operation.**

This work order is ready to consume when local Codex execution is available. **Do not reinterpret the Codex rate-limit pause as permission for the Connector to change binary assets or delete local files.**

## Read first, verify the live deltas

1. `AGENTS.md`, [current mainline cutover](development-mainline-cutover-and-cleanup-2026-11-28.md), [original cleanup receipt](codex-post-mainline-cleanup-receipt-2026-11-28.md), [independent Connector preflight](connector-post-mainline-cleanup-preflight-2026-11-28.md) and its [machine-readable duplicate identities](connector-asset-duplication-evidence-2026-11-28.json).
2. From `C:\Codex\EoL`, check `git fetch --prune origin`, `git status --porcelain=v1 --untracked-files=all`, `git rev-parse origin/master`, `git worktree list --porcelain`, attached branches and relevant running processes. Preserve existing dirty and ignored files; no resetting or clearing entire directories.
3. Validate Connector evidence against the then-current `origin/master`, not merely its dated baseline. The JSON records Git blob SHA-1 identity and exact tracked path mappings, **not proof of physical disk savings or full consumer reachability**. If the tree changed, recalculate the affected set and report the diff.

## Execution order: prioritize material simplification, not another generic audit

### A. Current UI selected-continent art

- Compare the **nine** selected/default continent art pairs under `apps/rpg-ui/public/character-creator/continents/`. Their identical Git blobs were independently verified at the preflight source tree, totaling **33,372,361 logical bytes in selected paths**.
- Read all `selectedImageUrl` and related component/test consumers, including `apps/rpg-ui/src/game-shell/worldSelectionCatalog.ts`, selected-card rendering and the standalone prototype manifest.
- Choose either real distinct selected artwork, or canonical normal-image URLs with CSS/semantic selection. Do not change selected visual appearance or accessible keyboard/focus behavior inadvertently.
- If removing redundant binary variants, update references, manifest where needed, exact tests, and verify browser asset responses and required responsive states. Preserve an exact historical mapping in the receipt. If the standalone prototype pins old variants, keeping them for the archived prototype is legitimate; do not delete those references by assumption.
- Do **not** present inherited `npm run ui:build` exit 2 as a pass; use the direct Vite command or focused tests appropriate to changed UI files, document actual results and inherited baseline.

### B. Repeated artwork in root `unused assets/`

- The evidence identifies **52 archived paths / 147,672,320 logical bytes** with identical blobs under active/canonical tracked trees. Check all source documentation, build/packaging references, art-origin provenance, and archive policy before removal or relocation.
- **Preserve the 36 archive files / 83,959,279 logical bytes with no identical active/canonical Git blob match** unless a separate explicit source-art disposition is established. They include old theme art and unmatched geographic/settlement references.
- Do not mass-delete the `unused assets` directory. The root README explicitly designates it as an intentional archive for inactive/replaced images. A byte-identical archived source may still be the canonical original even when the same bytes exist in public assets; if so, keep one explicit source-of-truth and preserve provenance.
- Delete only strictly proven redundant copies in small reviewed sets. Record exact relative names, Git blob hashes, original destination/counterpart, size, source references affected, and corresponding validation. No history rewrite or force-push.

### C. Historical New UI worktrees and Git refs

- The Connector preflight found **7 historical branch heads already contained in `master`** and **4 with unique unmerged commits**. This checks ancestry only, not whether local worktrees, processes or untracked evidence are safe to remove.
- First retire clean, fully merged, artifact-reconciled worktrees. Inspect ignored `.wrangler`, dependency directories, staging/publication artifacts, local QA screenshots/logs and process ownership before each change. One earlier Codex guard dry-run found **zero** automatically eligible worktrees, so perform individual evidence reconciliation rather than bypass the guard.
- Preserve unmerged histories and unique QA. For confirmed merged local branches, use `git branch -d` after detaching worktrees. Retire the exact remote integration branch only when its SHA, attached worktree status, PR/evidence ownership and remote state have been independently verified; no wholesale branch deletion.
- Do not delete unrelated sibling repositories, `cloudflare_artifact` controls, or private Sites. The old owner-private Site and its older revisions were still reported as active in the first cleanup receipt. Only an authorized Site-specific inspection can retire them.

## Completion receipt and limits

- Log each actual file/worktree/branch removal, before/after path, hashes, exact bytes freed measured separately from logical source sizes, and any named consumer updated. Report **zero** for a category if nothing qualified.
- Run focused asset/UI tests and check `git diff --check`, root `ui:dev` / `ui:dev:classic` scripts, source manifest invariants, and the touched preview verifier if applicable. Keep old TypeScript and engine baseline failures distinguishable from new regressions.
- Create a focused cleanup receipt in `docs/dev`, update a current pointer only if it actually changed, then commit/push the reviewed delta from a clean intended checkout. Retain unmodified source evidence and report every held item with exact next step.
- Return to **World → Character → playable session → Save → resume** as the main development feature route once cleanup is complete. Do not schedule more repeated broad browser tests without a material change.

**Expected result:** binary/runtime cleanup performed only where actual consumer-preserving verification is available; otherwise, precise holds and a smaller next task. No fake claims of storage savings or deletion.
