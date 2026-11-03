# Native-v3 staging maintenance host and rollback evidence — 2026-11-02

Source candidate: draft [PR #64](https://github.com/vagabond1215/Lineage_Reforged/pull/64) at `00c7d236df086fb16e562e1253e542375dab2373`. Game `0.1.1-prealpha`. **HOLD_STAGING_PUBLICATION for the game artifact; HOLD_SELECTED_ATOMIC_ACTIVATION.** The owner authorized publication of inert maintenance content only. No native-v3 app, account logic, QA entry or gameplay asset was placed in the Site source or deployed.

## Target and artifact separation

- Separate Site project `appgprj_6ae8f44b4dac8191a443654a1aad84a9`, slug `lineage-reforged-native-v3-stage`, assigned and now live HTTPS origin `https://lineage-reforged-native-v3-stage.vagabond1215.chatgpt.site`.
- Hosting readback before and after each deployment: current user owner; `custom` access policy revision 1; exactly one allowed user (owner), zero groups and zero external visitors. The private deployment tool independently required owner-only access.
- The Site source contains only `.openai/hosting.json`, `.gitignore`, `dist/index.html` and `dist/assets/access-probe.txt`. Its deployed archive has those two static files plus generated hosting metadata. The separate native-v3 app artifact remains local at the reviewed PR #64 source: 164 files, manifest SHA-256 `0b58519ed9b262e7316152469d315fae517b90cc3f2018ebec4be0549d87bfb3`. It was not copied, pushed or deployed.
- The existing v2 Site `appgprj_6a92239b7f5c8191a91bcf4ee1f0e136` read back unchanged after the rollback: version 16, existing preview URL and access policy revision 1. No account or browser-storage operation occurred.

## Two harmless versions and staging-only rollback

| Step | Saved Site version / source | Local source artifact | Deployment result |
| --- | --- | --- | --- |
| Maintenance v1 | `appgprj_6ae8f44b4dac8191a443654a1aad84a9~appgver_6b868225370c8191ba09e881089c25e9` / `6d10ea11527f88bf4226407fc2cc33d4b112d877` | Two-file SHA-256 manifest `efac51836417a573ffdef884acb17865b748413792afbc35775ed70a8aee1497`; tar SHA-256 `9df64f86d637e1e9abe9f8586dd59de762bd84a770882b27ff53535a9d037fdc` | `appgdep_6ae91b4fd3b081919634a228f4091348`, succeeded |
| Maintenance v2 | `appgprj_6ae8f44b4dac8191a443654a1aad84a9~appgver_b84f622527e48191a875b135410cdff6` / `620bf535ed6443bc979e63147010eaa2268aedf3` | Two-file SHA-256 manifest `3a9f34dc22f5737ab2c7bd8c41b5dcf26bcb87504ea3fd575357299a6e1e2236`; tar SHA-256 `5ce86e21f2cb0353c77c0259168202ce04bfd200bbc9780d20ff227b5141de34` | `appgdep_6ae91c2039488191b0a6db93824ddc94`, succeeded |
| Rollback to saved v1 | Reused exact v1 version ID; no new source save | No new artifact | `appgdep_6ae91c5229ac81919a5864609f10142d`, succeeded; served v1 markers again |

The Site's latest *saved* version number remains 2 after rollback; the active rollback deployment points to saved version 1. Site-source `main` remains at the v2 maintenance commit, which is separate from the active deployed version. The v1 version ID is the staging-only rollback target for any separately approved game-artifact publication.

## Actual host responses

An anonymous HTTP client made direct GET requests to `/` and `/assets/access-probe.txt` after each deployment. Both paths returned **401** for v1, v2 and restored v1. No maintenance marker was present in any anonymous response. These are live HTTP responses, not DNS failures or policy-only inference.

The Site-owner-issued service-access credential returned **200** for both paths in all three states. V1 HTML contained `MAINTENANCE-V1-20261102`; its direct asset was exactly 30 bytes with SHA-256 `eefe63194a40f9af556a20525708b72c3e904c86dbd0a05d035f2de85544a18e`. V2 HTML contained `MAINTENANCE-V2-20261102`; its asset was exactly 30 bytes with SHA-256 `71be72ff6740fc9cb0a8467e2c866210a4e6f56fa26d68f130715c3b6ba20dd2`. After rollback, the v1 HTML marker and exact v1 asset checksum returned, and v2 markers were absent. The hosting service changes the HTML response bytes, so the stable version marker and saved-version deployment ID are used alongside the exact direct-asset checksum.

The service-access credential proves authorized hosting access, **not** interactive owner browser sign-in or `EpochApp` authentication. Both in-app browser control and Windows computer-use initialization failed before a browser tab opened (`failed to write kernel assets`, OS error 3). Owner browser access and every authenticated native-v3 selected-client row remain unverified.

## Rollback procedure and next gate

For a later separately approved native-v3 staging publication, retain the v1 saved version ID above. Before and after publishing, read back the owner-only policy and test anonymous HTML/asset denial and authorized content. On a staging failure, deploy that exact v1 version ID with `deploy_private_site_version` to **only** project `appgprj_6ae8f44b4dac8191a443654a1aad84a9`, then verify the v1 HTML marker, v1 direct-asset checksum, anonymous 401 responses and deployment ID. Do not touch the deployed v2 project or clear either origin's accounts. This rollback sequence was executed successfully with v2 maintenance as the reversible change.

The game artifact still requires separate explicit publication approval. Before requesting atomic activation, obtain a real owner browser session and run the authenticated creator, item/Use, survey, combat/defeat, Save/restart, stale/failure and responsive acceptance rows in the existing [staging plan](../design/native-v3-isolated-staging-candidate-and-publication-plan-2026-11-02.md). Maintenance access and rollback evidence alone do not accept native v3.
