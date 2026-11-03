# Native-v3 exact-artifact staging publication blocker — 2026-11-02

The owner approved **private staging publication only** of draft PR #64's reviewed implementation `00c7d236df086fb16e562e1253e542375dab2373`, artifact manifest SHA-256 `0b58519ed9b262e7316152469d315fae517b90cc3f2018ebec4be0549d87bfb3`, to Site `appgprj_6ae8f44b4dac8191a443654a1aad84a9` at `https://lineage-reforged-native-v3-stage.vagabond1215.chatgpt.site`. **The game artifact was not successfully published. HOLD_STAGING_PUBLICATION and HOLD_SELECTED_ATOMIC_ACTIVATION remain.** No merge, Game-version change, account reset or deployed-v2 mutation occurred.

## Exact source and preflight

- GitHub Connector readback: #64 remained open/draft at documentation head `7cced5c5be161b858e5461cc14006c4260ac1b35`. Its diff from the approved `00c7d236` implementation changed only four documentation paths; no game source/build input changed.
- The local build output contained exactly 164 files, one `index.html`, no QA/test/fixture HTML, and the approved SHA-256 manifest. The copied Site `dist` recomputed the same manifest. An independently extracted Site package contained the same 164 files and manifest, plus generated hosting metadata outside that set. The local tar was 469,821,283 bytes, SHA-256 `c74495544bc5c42471ade597e184b7b76e82deed68b2ecde8a42d3c43d3619cd`.
- The staging project read back the exact origin and `custom` owner-only policy revision 1: one owner, zero groups and zero external visitors. Saved maintenance version 1 was available as the tested rollback target. The existing v2 Site `appgprj_6a92239b7f5c8191a91bcf4ee1f0e136` remained version 16 with its original URL and policy revision 1.

## Publication attempts and exact blocker

1. The Site source provider rejected a single 417.2 MiB Git push under its **64 MiB per-push** limit before any new Site version was created. No individual required file exceeded 4.3 MiB. Thirteen source batches below the limit were then pushed and read back; a final small commit removed the maintenance probe. The final source commit `872459c6cf339df9d55b2254b1a90563ad0bae27` had tree `e7f0a0179e965de83d33495cdebf9d0068071f9c`, identical to the initially verified complete-artifact tree. No partial source commit was deployed.
2. `save_version_and_deploy_private` with the exact local archive rejected it at the connector's **256 MiB archive input limit**. That rejection saved no version.
3. Source-based static publication of that exact pushed commit, with the archive omitted only because it exceeded the input limit, saved Site version 3 `appgprj_6ae8f44b4dac8191a443654a1aad84a9~appgver_c57bc770962881918a94bb21b0a1895b`. Deployment `appgdep_6ae928f6eef081919689bd93a7296729` **failed** during provider build: `Cloudflare Sandbox Worker request failed: status=500 body={"error":"Cannot create a string longer than 0x1fffffe8 characters"}`. It returned no live URL and never served the game artifact.

The approved artifact cannot pass either currently available Sites publication path unchanged. Reducing or reorganizing assets would create a new artifact and checksum requiring independent review and approval. A provider capacity change or a separately approved asset-delivery architecture is the smallest actionable next gate; do not repeatedly retry the same oversized input or silently trim assets.

## Staging-only restoration and readback

- Redeployed exact saved maintenance version 1 `appgprj_6ae8f44b4dac8191a443654a1aad84a9~appgver_6b868225370c8191ba09e881089c25e9` as `appgdep_6ae9296d265081919680758bc3c8c447` (**succeeded**). Latest *saved* version remains 3, but the active successful deployment is maintenance v1.
- After restoration, anonymous direct GETs to `/` and `/assets/access-probe.txt` both returned **401** with no maintenance marker. The Site-owner-issued service credential returned **200** for both; HTML contained `MAINTENANCE-V1-20261102`, and the asset's exact SHA-256 was `eefe63194a40f9af556a20525708b72c3e904c86dbd0a05d035f2de85544a18e` with no v2 marker. The owner-only policy revision remained 1.
- To avoid a future source-based action selecting the failed app tree, Site source `main` was returned by a new commit `7fb413bf25344e9a8ace6f674dee8d3d56a470b4` to tree `6e4c007f4cb2f3b18e1896cd9536437ad1348231`, exactly the original maintenance-v1 source tree. The unpushed temporary full-artifact backup branch was deleted after the batch history and reviewed artifact remained reachable. No new Site version was saved or deployed for this source alignment.
- The v2 Site still read back version 16 at its existing URL and unchanged owner-only policy. No account data or browser storage was read, reset, imported or modified.

The browser-control runtime again failed before opening a tab (`failed to write kernel assets`, OS error 3). Because the game artifact never became live, authenticated native-v3 registration, sign-in, gameplay and Save/restart acceptance could not be attempted. The service credential proves hosting access to maintenance content, not interactive owner-browser or selected-gameplay acceptance.

## Review trigger

Keep #64 draft and the existing deployed v2 game unchanged. Obtain a capacity-compatible way to publish the **same** reviewed bytes, or prepare a newly reviewed and explicitly approved artifact with a new manifest. Preserve maintenance v1 as rollback until a replacement path is validated. After a successful separately approved private publication, repeat anonymous/authorized HTML and asset checks, then perform actual authenticated `EpochApp` creator, item, World/survey, combat, Save/restart and failure/retry acceptance before any independent atomic activation decision.
