# Current Codex Output

Date: 2026-08-29

Source run: `Sites Preview Asset Hotlink And Deployment`

Label class: unversioned deployment support

Milestone impact: `none`

Parent version: not applicable

Inspected base and asset-source commit: `712982fbf72b158280df0ac89dc903d3b1832ab4`

Committed and pushed implementation: `7002efa8b4c3320932a623c2f1eae7f84865c676`

Validated Sites source commit: `f12274cab9f0fc40fc2c2d322d15128b374e6093`

Disposition: `DEPLOYMENT_COMPLETE_OWNER_ONLY`

The active gameplay route remains `Version 0.7.0 - Integrated Gameplay Systems Band Entry`. This support run does not activate, revise, or supersede that prompt.

## A. Files Changed

- `apps/rpg-ui/src/game-shell/characterCreatorAssetUrl.ts`: adds the production-only character-creator asset resolver pinned to the immutable public GitHub source commit.
- `apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx`: routes every lineage, continent, region, settlement, and resource illustration through that resolver while preserving local development paths.
- `tests/unit/character-creator-asset-url.test.mjs`: covers development passthrough, production rewriting, custom-base normalization, and unrelated-asset passthrough.
- `docs/dev/current-codex-output.md`, `docs/dev/current-gpt-handoff.md`, and `docs/dev/branch-disposition-register.md`: record the completed source replacement, private deployment, executable evidence, and unchanged gameplay/branch posture.

No gameplay owner, save format, schema, migration, authored content, authored visual asset, dependency, or active `0.7.0` authority changed.

## B. Patch And Deployment Summary

- Local development continues to load `/character-creator/**` from `apps/rpg-ui/public`.
- Production builds resolve those 128 files from `raw.githubusercontent.com` at immutable repository commit `712982fbf72b158280df0ac89dc903d3b1832ab4`.
- The authored character-creator asset directory remains tracked and unchanged in Lineage. It is excluded only from the separate Sites source/package.
- The exact Sites source contains `apps/rpg-ui` plus its imported `packages` dependency tree and omits only `apps/rpg-ui/public/character-creator`. Its tracked source is clean at `f12274cab9f0fc40fc2c2d322d15128b374e6093`.
- The filtered build is `20,343,949` bytes, contains no `client/character-creator` directory, and contains the pinned production URL. The official package archive is `18,182,781` bytes with local SHA-256 `3443c0bd6185ac36aee8cd988fc192eec0f697acaf287a522da030790dedf5e4`.
- The private Sites source branch was force-replaced from disposable seed `f4238047ac5e166d2742329447bba6c0883e6554` to the exact validated source commit.
- Sites version 1 (`appgprj_6a92239b7f5c8191a91bcf4ee1f0e136~appgver_cbdecf74766881918ec0a4daf3a3f507`) was saved and production deployment `appgdep_6a9332384ac881919f37da76fb6463dd` succeeded.
- Owner-only access was verified before deployment: one allowed owner, no groups, and no other allowed users.
- Private preview URL: `https://lineage-reforged-preview.vagabond1215.chatgpt.site`.

## C. Tests And Checks

- `node --test tests\unit\character-creator-asset-url.test.mjs`: passed, `4/4`.
- `npm --prefix apps\rpg-ui run typecheck:node`: passed.
- `npm --prefix apps\rpg-ui run typecheck`: retained the known broad TypeScript baseline failure. It includes the pre-existing `.at`/implicit-any diagnostics at lines 189/197 of the modified narrative component, but reports no diagnostic at the new resolver or rewritten asset caller lines.
- `npm run ui:build`: stopped at the same TypeScript baseline because the wrapper runs `tsc` first.
- `npx vite build --outDir .tmp-codex-vite-build --emptyOutDir`: passed against the live repository source.
- `npx vite build`: passed against the exact filtered Sites source; `204` client modules built.
- Official `package-site.sh`: passed; archive contains no `character-creator/` entry.
- Local Sites-enabled development server: passed; `http://127.0.0.1:5173/` returned `200 text/html`.
- Private production readback: passed; the authenticated live URL returned `200 text/html`.
- Pinned GitHub asset readback: passed; returned `200`, `image/png`, `Access-Control-Allow-Origin: *`, and `Cross-Origin-Resource-Policy: cross-origin`.
- `git diff --check`: passed before the implementation commit, with only the existing Windows line-ending warning.

## D. Applicable Failure-Pattern Evidence

- `FP-001`: exercised the real narrative-screen caller, the production bundle, a local HTTP response, the deployed site, and the external asset response rather than accepting the resolver unit test alone.
- `FP-008`: fetched/pruned and refreshed all 37 non-default remote branches and both open PRs; no branch integration was inferred from textual mergeability.
- `FP-009`: distinguishes the Lineage inspected/asset commit, pushed implementation commit, filtered Sites source commit, saved version ID, deployment ID, and final coordination head.
- No new generalized failure-pattern entry was required.

## E. Branch And PR Lifecycle

Fresh orientation found one local branch, 37 non-default remote branches, and two open PRs. PR #2 remains open non-draft at `e78dc645cfb658685be12f45f46d34b7c0da1119`; PR #3 remains open draft at `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`. Both remain `SUPERSEDED_PRESERVE_EVIDENCE`. The protected, candidate-integration, hold, merged-retire, and superseded branch dispositions remain unchanged.

No merge, cherry-pick, rebase, PR mutation, closure, deletion, or Lineage branch disposition change was due. The private Sites source branch is an external deployment source, not a Lineage integration branch; its seed was replaced only as required for exact-source publication.

## F. Risks And Follow-Up

- This is an owner-only preview, not a public game release.
- Raw GitHub delivery is appropriate for this bounded preview but has no dedicated asset-CDN availability, bandwidth, transformation, or cache-control guarantee. A future public or high-traffic release should move these assets to an explicitly selected durable delivery service.
- The pinned asset commit must remain reachable in the public repository for creator illustrations to load. Changing the repository back to private would break anonymous asset fetches.
- The existing UI TypeScript baseline remains outside this hosting package and must not be silently treated as green.
- The active `0.7.0` prompt remains unchanged and may proceed independently.

Suggested coordination commit message: `docs: record private Sites preview deployment`

Next recommended gameplay run: `Version 0.7.0 - Integrated Gameplay Systems Band Entry`

Next preview-hosting run: none required unless access, asset delivery, or the deployed source changes.
