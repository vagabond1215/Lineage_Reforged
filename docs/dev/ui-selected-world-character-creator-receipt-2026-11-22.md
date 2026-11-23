# Selected World to Character Creator

November 22, 2026. Unversioned World UI support. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, development impact `supports_current_band`, game-version impact `none`.

The isolated `codex/selected-world-character-creator-2026-11-22` branch starts at exact functional preview `bae33e656b8c1e472a3d9f7abb050d47829d48e6`. Source review is [the Connector audit at f8649183](https://github.com/vagabond1215/Lineage_Reforged/blob/f8649183ad2e9f891678dab4485c4c2f7def179e/docs/dev/ui-functional-world-preview-independent-connector-audit-and-selected-world-pickup-2026-11-22.md). The runtime/test commit is `7e07c9e2c9b46d4bce132895fcdebf47bc41a5ae`. The original preview, other UI and map worktrees, master and existing PRs were preserved.

## Runtime changes

- `WorldLibrary.tsx` and `WelcomeWorldPresentation.tsx` expose **Open World** on a verified ready card in the compiled review after password-backed authentication. Remembered sessions list the verified card and offer explicit sign-in again.
- `EpochApp.tsx` revalidates the session and account generation around the existing credential-authorized owner reopen. `worldCreatorOwner.ts` validates the exact requested ID, owner-read receipt, canonical source and projection, and the empty genesis pilot. Open and Creator entry/return reject stale responses using the existing UI epoch and active owner. Storage invalidation, visibility/focus rechecks and a selected-route three-second check clear ephemeral context on stale authentication or generation. Sign-out and account replacement clear the route and draft.
- `state.ts` and `worldPresentationState.ts` hold only the ephemeral, account/generation-bound selected World and Creator draft. `WorldCharactersScreen.tsx` shows the verified ID and name and the owner-confirmed empty roster. Back returns to a refreshed Library. `App.tsx` excludes this new route from the retained legacy caller’s gameplay fallback.
- `CharacterCreationNarrativeScreen.tsx`, the form and randomization helpers, and the preview-only inputs in `newGameSnapshot.ts` reuse the existing interactive Creator with a slotless draft. The selected World retains its visible name and identity while moving through the stages. The mobile selected-World sidebar is bounded so its stages and the form can both scroll. Back returns to the same selected World. The account-scoped Classic Creator still receives its original Save slot and callbacks. The World draft has no Save slot or submission callback.

## Preview command

Use the same browser profile and exact origin previously used to create your preview World. The old functional preview used port 5244. Leave that port free before starting this candidate. A separate disposable profile is appropriate for creating a new test World.

```powershell
Set-Location 'C:\Codex\EoL\.selected-world-creator-20261122\apps\rpg-ui'
$worldPreview = Join-Path $env:TEMP ('lineage-selected-world-' + [guid]::NewGuid())
node node_modules/vite/bin/vite.js build --mode world-owner-review --outDir $worldPreview
if ($LASTEXITCODE -ne 0) { throw 'Selected World preview build failed.' }
python -m http.server 5244 --bind 127.0.0.1 --directory (Join-Path $worldPreview 'client')
```

Open the [compiled New UI Preview](http://127.0.0.1:5244/?welcomeL1=1&accountPresentation=1&worldPresentation=1). Sign in with the World’s account password and choose **Chronicle → Open World → Create Character**. When the session was remembered, use **Sign in again to open this World**. Use **Back to World Characters** to return from the Creator. The selector is also available at the [bare splash URL](http://127.0.0.1:5244/).

## Verification

- Compiled Chromium created a real World, closed the browser, reused the disposable persistent profile in a fresh process, and authenticated again. The same World opened into its Characters route and the real Creator. This passed at the documented 5244 origin and the isolated suite origin 5250. Back and Previous Step retained the selected ID. The World/receipt and all unrelated IndexedDB rows matched before and after draft editing.
- All 16 A3b World creation/reopen viewport and theme cases passed. Selected-World Creator was exercised by pointer and keyboard at 1440×800 and 320×568 in both themes. The test navigated Lineage, Identity, Continent, Region, Settlement, available Backstory, Starting Bundle and Finalize, edited the draft identity and attribute focus, and checked the accessible finalization hold. The first pointer run caught an oversized selected-screen logo and the initial mobile run measured zero form viewport height. The bounded logo and mobile sidebar corrected those issues.
- Dedicated Chromium checks passed for remembered-session reauthentication, account switching and cross-account isolation, logout, generation reset and deletion while the Creator was active, and corruption or a missing receipt after the card had rendered. The existing A3b rollback and exact retry scenarios also passed. The ordinary compiled Classic caller launched its campaign and left both World stores empty. The A2b harness passed v7/v8 migration/archive, retained native-v3 ready and retired Save histories, and retry/failure scenarios using the disposable exact v7 fixture.
- 48 focused Node tests and seven render/entry checks passed. All 55 source pins verified. Direct Vite ordinary, compiled review and native-staging builds, the Node UI typecheck and no-new-hex check passed. UI typecheck retained 183 diagnostics on both the exact base and candidate, with an identical diagnostic sequence after removing line and column coordinates. The combined build remains blocked by those baseline errors.
- FP-001/017 cover the actual browser entry. FP-003 records the reachable Creator and the exact finalization owner gate. FP-004/005/018/019 cover rollback, identity retry, stale scope and retained evidence. FP-009 records exact reviewed base and runtime identity. FP-011/014 cover verified owner reads with exact fingerprints and denial of malformed/missing data. FP-002/010 preserve the broader activation and owner boundaries.
- All four registered servers stopped. The four listener probes were clear and no task Chromium processes remained. Locked application dependencies are available for the preview command.

## Finalization boundary

The existing **Begin Journey** control is disabled in the selected-World Creator and explains the hold. `CleanEpochFirstCampaignAdapter.start(accountId, form, …)` publishes an account-slot campaign without a retained World ID or World-revision precondition. The compact pilot admits revision zero with empty `characterAssociations` and `campaignSaveAssociations`. Finalization needs an approved versioned atomic World–Character–native-v3 Save association transaction and corresponding readback, rollback, archive, lifecycle and migration acceptance. The implementation leaves that owner contract and existing Save authorities in place.

Draft PR #102 still requires owner approval before integration. Visual PR #103, Family Library, production and staging publication, master integration and game-version advancement keep their separate holds.
