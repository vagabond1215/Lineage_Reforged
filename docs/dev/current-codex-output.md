# Current Codex Output

Date: 2026-09-02

Source run: `Bloodlines Launcher Asset Thread Migration`

Label class: unversioned deployment-support correction

Milestone impact: `none`

Parent version: not applicable

Reconciled repository base: `df6c10dbd75e24d93cb6525cad4e572067389e08`

Committed and pushed migration: `e58d6502b56c7d280d07ac0ad69902974f77de0a`

Deployed Sites source: `8857c08bb272f36938fde0a72087c5c0865be80b`

Disposition: `MIGRATION_COMPLETE_LIVE_VERSION_ALREADY_CURRENT`

The active gameplay route remains `Version 0.7.0 - Integrated Gameplay Systems Band Entry`. This unversioned correction does not activate, revise, or supersede that prompt.

## A. Files Changed

- `apps/rpg-ui/public/launcher/bloodlines-inactive-soft.png`: replaces the provisional tree emblem with the exact deployed silver large-blood-drop asset.
- `apps/rpg-ui/public/launcher/bloodlines-active-soft.png`: replaces the provisional tree emblem with the exact deployed ember-lit large-blood-drop asset.
- `docs/dev/current-codex-output.md`, `docs/dev/current-gpt-handoff.md`, and `docs/dev/branch-disposition-register.md`: record the cross-project recovery, authoritative repository migration, validation, and unchanged route/branch posture.

The sidebar mapping and focused launcher contract test were already present on live `master` through `df6c10dbd75e24d93cb6525cad4e572067389e08`; they were inspected and preserved unchanged.

No gameplay owner, save, schema, migration, dependency, character-creator asset-delivery rule, or active milestone authority changed.

## B. Migration Summary

- An accidental Codex task under the unrelated TORN project created a temporary `Lineage Reforged` checkout and refined the Bloodlines button from a tree-plus-small-drop emblem to one large stylized blood drop.
- That task pushed only the filtered private Sites source commit `8857c08bb272f36938fde0a72087c5c0865be80b`, saved Sites version 2, deployed it privately, and then removed the temporary Lineage checkout from `C:\Codex\TORN`.
- The authoritative Lineage repository later received `df6c10dbd75e24d93cb6525cad4e572067389e08` with the earlier tree-based assets, mapping, and contract test. The deployed large-drop files were still absent from repository history.
- This run retrieved the exact version-2 source from the private Sites source repository, verified its provenance and dimensions, confirmed its `AppShell.tsx` was byte-equivalent to the authoritative mapping, and copied only the two deployed PNGs into `C:\Codex\EoL`.
- Authoritative asset hashes now match the deployed source exactly:
  - active: `a16b93535aff5f52febf30077a5c9ee3d26fc1f39006829ca0f54465648dc870`;
  - inactive: `8709326a28e312582367c1f988d0e385bd1a7fc6b00e0ded7305c07c0537a478`.
- Sites version 2 (`appgprj_6a92239b7f5c8191a91bcf4ee1f0e136~appgver_9a4187a832608191847bdce37d5b49d0`) already serves this exact pair, so no duplicate version or deployment was created.
- Owner-only preview remains `https://lineage-reforged-preview.vagabond1215.chatgpt.site`.

## C. Tests And Checks

- `node --test tests\unit\launcher-bloodlines-asset.test.mjs`: passed, `1/1`.
- `npm --prefix apps\rpg-ui run typecheck:node`: passed.
- `npx vite build --outDir .tmp-bloodlines-vite-build --emptyOutDir`: passed; Worker and `204` client modules built.
- Filtered/deployed and authoritative assets: exact SHA-256 match, exact `700x200` dimensions.
- Production build copies: exact SHA-256 match to the authoritative assets.
- Sites-enabled local server: `200 text/html` at `http://127.0.0.1:5173/`.
- Sites project readback: latest saved version is 2 at source `8857c08bb272f36938fde0a72087c5c0865be80b`; access remains owner-only.
- `git diff --check`: passed before migration publication.
- The broader UI TypeScript baseline was not widened or repaired; the direct deployment build remains the executable preview surface.

## D. Applicable Failure-Pattern Evidence

- `FP-001`: verified the real sidebar mapping, exact PNG contract, local HTTP caller surface, production build copies, and already-deployed Sites source rather than accepting task history alone.
- `FP-008`: refreshed all 37 non-default hosted branches and both open PRs. PR #2 overlaps launcher-asset evidence but remains `SUPERSEDED_PRESERVE_EVIDENCE`; its mechanical/textual relevance did not authorize integration.
- `FP-009`: distinguishes the reconciled GitHub base, authoritative migration commit, filtered Sites source commit, saved version, deployment, and final pushed coordination head.
- No new generalized failure-pattern entry was required.

## E. Branch And PR Lifecycle

Live inventory contains one local branch, 37 non-default hosted branches, and two open PRs. PR #2 remains open non-draft at `e78dc645cfb658685be12f45f46d34b7c0da1119`; PR #3 remains open draft at `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`. Both retain `SUPERSEDED_PRESERVE_EVIDENCE`.

The launcher-asset trigger was reinspected because PR #2 discusses missing Bloodlines art. Its proposed metadata/SVG contract remains superseded and semantically incompatible with the current raster label-bearing launcher system; no merge or cherry-pick was authorized. No branch or PR mutation, closure, deletion, or registered disposition change was due.

The Sites source branch is external deployment infrastructure, not a Lineage integration branch. Retrieving its exact deployed files did not import foreign TORN repository state or authority.

## F. Risks And Follow-Up

- The accidental TORN task remains only as application history; its local Lineage checkout was already removed and the parent TORN worktree was reported clean.
- The two production-consumed `*-soft.png` states are authoritative. No unused non-soft Bloodlines siblings were invented.
- The preview remains owner-only. Its current version already contains the migrated emblem.
- The active `0.7.0` prompt remains unchanged and may proceed independently.

Suggested coordination commit message: `docs: record Bloodlines asset thread migration`

Next recommended gameplay run: `Version 0.7.0 - Integrated Gameplay Systems Band Entry`

Next preview-hosting run: none required unless the asset, access, or deployed source changes.
