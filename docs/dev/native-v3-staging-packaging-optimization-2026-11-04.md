# Native-v3 staging packaging optimization

Date: 2026-11-04. Source: draft PR #64 head `8932e7422e4aeb406c2c5fbeecacf4e59c834fb6`; isolated [draft PR #65](https://github.com/vagabond1215/Lineage_Reforged/pull/65), implementation commit `f5087b0aa6c4c858f85948e1ddf4a610ee2196c8`. Game `0.1.1-prealpha`; `HOLD_STAGING_PUBLICATION` and `HOLD_SELECTED_ATOMIC_ACTIVATION` remain.

## Change and authority

The staging Vite build omits only `public/character-creator/**` from its output. Production creator URLs already resolve through `characterCreatorAssetUrl.ts` to the pinned, unchanged Lineage GitHub commit `712982fbf72b158280df0ac89dc903d3b1832ab4`. The 128 source PNGs, catalogs, resolver, staging app bundle, normal v2 build, gameplay, authentication and persistence are unchanged. The config copies every other public asset after bundling. `publicDir` remains available to local Vite development and preview. This creates an external availability dependency on GitHub raw asset hosting, already present in the approved artifact; a hosting outage can leave creator artwork unavailable without affecting saves.

## Exact artifact comparison

| Measure | Approved PR #64 artifact | Optimized child artifact |
| --- | ---: | ---: |
| Output files | 164 | 36 |
| Output bytes | 485,401,653 | 31,644,254 |
| SHA-256 manifest digest | `0b58519ed9b262e7316152469d315fae517b90cc3f2018ebec4be0549d87bfb3` | `577c9931f289dec88577ba7fbf427c5d344e79c77dd758e9b1ff3a4922d2d269` |
| Local tar bytes, including staging hosting metadata | 469,821,283 (prior publication evidence) | 31,676,416 |

The [complete 36-file hash manifest](native-v3-staging-artifact-manifest-2026-11-04.txt) has exactly the approved artifact's 36 retained file paths and byte hashes. Exactly 128 duplicate creator PNGs are absent; there are no unexpected changed files. The measured child tar SHA-256 is `3a05ad227fe5ae60d9f83c430b86f92fc6e38b33835f1b0e8fd4759fe0bd1a70`. The 31,676,416-byte tar is 236,759,040 bytes below 256 MiB; the 31,644,254-byte output is below the separate 64 MiB source-push threshold. These are local packaging measurements, not provider acceptance or a publication approval. Feasibility inputs remain in the isolated `.native-v3-asset-feasibility/inventory.json` and `coverage.json` and were independently checked against source.

## Verification and limits

The new exclusion test failed against the original build before the change, then passed. All 128 cataloged paths (59 literal and 69 dynamic settlement variants) resolve to the pinned production source and remain as original source files. All other public assets were hash-checked in the optimized package. Focused creator/staging Node tests: 26/26 pass. Node UI typecheck, complete staging Vite build (283 modules), normal v2 build (server 4/client 284 modules), and diff check pass. Normal v2 output: 165/165 file hashes identical to the PR #64 parent output. A local Vite dev request for one creator PNG returned HTTP 200, 3,514,072 bytes, matching the source hash. No full gameplay/recovery suite was rerun because no corresponding owner changed.

The provider has not accepted this new artifact. The separate owner-private staging Site `appgprj_6ae8f44b4dac8191a443654a1aad84a9` at `https://lineage-reforged-native-v3-stage.vagabond1215.chatgpt.site` remains on maintenance v1. Neither it nor the deployed v2 Site was changed. Authenticated selected-client gameplay and Save/restart remain untested for this artifact. Publication requires separate explicit approval of the new full manifest, source head, exact Site target and rollback plan, followed by hosted privacy, served-byte and selected-client checks.

Applied FP-001 (actual staging build and local Vite asset request), FP-002 (tests are not publication/acceptance), and FP-009 (exact parent and retained-file hashes). No branch integration or cleanup is due in this bounded package.
