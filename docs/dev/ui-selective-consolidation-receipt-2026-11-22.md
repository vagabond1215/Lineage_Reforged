# Selective New UI consolidation

November 22, 2026. Unversioned UI support. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, development impact `supports_current_band`, game-version impact `none`. The candidate is ready for review as a read-only World presentation.

## A. Starting refs

The clean new worktree `C:\Codex\EoL\.selective-ui-20261122` and branch `codex/selective-ui-consolidation-2026-11-22` started at fetched `origin/master` `20abe83c2aa97ba4699711a9815d9b95e0d3df44`. Fetch ran without pruning or forcing. The primary map checkout had existing untracked paths. Its worktree and the separate UI, A3b and map checkouts were preserved.

| Reference | Exact commit |
| --- | --- |
| A3a UI topic | `7624adc2f54b72204717ad18a2e4294454d9bfb1` |
| A3b matrix branch | `f705857c491b8841e97101a7e3f1fbb225d343c0` |
| A3b runtime | `7a46f5771e0785ad7a2d9c1da54ccf200153eeef` |
| Independent A3b audit | `77afc6b51e1057b1dc3b389fbf19f10417a7c925` |
| Draft owner PR #102 | `e74f9e1414d02cde60ba03aa088afc166f2634b1` |
| Draft visual-provenance PR #103 | `d6fb21d3452f56ecf962f2c7d11eae95394927ca` |

## B. Integrated files

Source/test commit `b39233997968ce36bb378580c78c460a5ca61985` applies the reviewed 46-line `EpochApp.tsx` diff to the byte-identical master base after checking each hunk. The app retains its existing registered account, session, archive, reset, deletion, Save and launcher owners. `accountPresentationGate.ts`, `LocalAccountAccessScreen.tsx` and the one-line `AppShell.tsx` diagnostic repair support both splash layouts. The selector is available on signed-out native-development loopback `/` and `/index.html`. URL replacement preserves unrelated query values and the fragment. The switch is disabled during account operations, and the selected appearance does not enter persistent account or Save data.

`WelcomeWorldPresentation.tsx`, `WorldLibrary.tsx`, `WorldCreator.tsx` and `worldPresentationState.ts` provide the reviewed account-menu, Welcome, World Library and Creator presentation. Duplicate display names retain distinct picker labels and last-played metadata. The existing launcher is reached through owner validation and the existing inventory/recovery flow. Actual DEV receives neither World inventory nor an owner Create callback. It reports unavailable inventory and offers the configuration preview with final Create disabled. The stable intent and verified-result contract remains covered by an isolated callback test.

Seven directly related tests transferred with the eight runtime paths. All 15 staged blob identities matched the reviewed A3a UI topic. The shared account screen, shell, World Library and presentation model also matched A3b. This candidate adds no production dependencies.

## C. Skipped files and reasons

- `cleanEpochAccountStore.ts`, `cleanEpochAccountAdapter.ts`, `firstWorldDurableRegistry.ts`, `main.tsx`, `vite.config.ts`, `worldOwnerReview.ts`, `worldCreatorOwner.ts`, the `world-source` modules, build helpers and v2/v3 manifests stay on the World-owner lineage. Importing those changes would bring a different storage schema, session capability and compiled review entry. They require a separate owner decision.
- The A3b-specific `EpochApp` World persistence hunks and the extra `WelcomeWorldPresentation` and `WorldCreator` callbacks require the same compiled owner. The simpler reviewed A3a components supply the complete safe preview. The owner-backed A3b and A2b test harnesses were retained on their original branches.
- Historical UI PRs, PR #103 prototype HTML, the retained legacy `App.tsx` body, in-game shell, assets, and historical documentation remain outside this candidate. No cross-branch merge, cherry-pick, ref deletion or retargeting was used.

## D. Holds and compatibility

Master and A3a matched on the runtime entry, account/Save store and adapter, launcher state and Vite config. Applying the selected UI hunks produced no source conflict. Master’s retained v7 owner and account database remain selected. Draft PR #102 remains held for explicit owner integration approval. Production activation, World-to-Save or Character linkage, Family Library, broader launcher substitution, and game-version advancement remain held.

An existing Vite process from the original checkout owned `127.0.0.1:5240` before this pass. The candidate was verified through the same normal Vite DEV entry on `5241`. The original process was preserved. The developer must have a free port to bind this candidate at the requested address.

## E. Executed checks

- Three real Chromium suites passed on DEV at 1440, 1280, 768, 375 and 320 px. They exercised Classic to Preview and back, keyboard and pointer navigation, both themes, remembered/nonremembered sessions, registration, sign-in, sign-out, the guarded existing launcher, duplicate labels, held account operations, and denied World writes. The inspected data graphs had zero Save records. Stale/incorrect account identity and inventory/capture failures blocked the launcher bridge.
- An additional disposable browser check passed existing Settings reset with a lifecycle record, backup export, valid Preview restore to a separate browser context, exact graph comparison after password sign-in, and Preview picker deletion with lifecycle readback. A compiled ordinary browser smoke on port `5242` confirmed that the preview flags leave Account Access and the authenticated launcher in Classic.
- 32 focused Node tests and seven app render/entry/mobile-shell tests passed. Node UI typecheck, direct ordinary and native-staging Vite builds, no-new-hex and Git diff checks passed. From the same checkout, full UI typecheck changed from 119 to 118 diagnostics. The only difference was removal of AppShell TS2375. The combined build still exits 2 on the 118 existing diagnostics.
- All 41 master v1 pins matched the manifest and candidate bytes. The manifest itself matched master. Git comparison found no differences in account/Save owners, entry sources, Vite configuration, packages or design manifests. The separately reviewed 55-pin owner lineage was not edited or adopted.
- FP-001/017 covered actual signed-out and authenticated callers. FP-002 preserves production and owner gates. FP-009 records exact base, source and test identities. FP-010 preserves outstanding owner scope. FP-018/019 cover observed generation/deletion, archive readback and synthetic failure paths.
- Both task-owned servers stopped. Neither task port had a listener, and no task Chromium process remained. The original 5240 listener was still present. The candidate retains its locked application dependencies for local preview.

## F. Local preview

```powershell
Set-Location 'C:\Codex\EoL\.selective-ui-20261122'
npm --prefix apps/rpg-ui run dev -- --host 127.0.0.1 --port 5240 --strictPort
```

When `5240` is free, open [Account Access](http://127.0.0.1:5240/). Until then, run the same command with `--port 5241` and open [the alternate development URL](http://127.0.0.1:5241/). A remembered signed-in session goes to its existing launcher. Sign out through the account menu to reach the selector. The two presentations share account data at the same origin.

## G. Review branch

`codex/selective-ui-consolidation-2026-11-22` carries the candidate and this receipt for review. Keep draft PRs #102 and #103, the A3a/A3b lineages, and map lanes in their existing dispositions. No integration into master or rollout decision is included.
