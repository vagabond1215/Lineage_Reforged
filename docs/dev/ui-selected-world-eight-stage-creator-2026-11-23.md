# Selected World eight-stage Character Creator

November 23, 2026. Unversioned presentation support, with no parent milestone. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, development impact `supports_current_band`, game-version impact `none`.

The implementation and QA harness are in `7d8971e80e1caaab5e91f094f8b8bbff3169c87b`, `feat(world): use the eight-stage selected World creator`, on `codex/selected-world-entry-creator-2026-11-23`. The branch started at reviewed head `f415c5c4ab627b524b067189f289c70ee1fdb717`. The [presentation reference](../prototypes/lineage-reforged-current-interactive-preview.html) matches `origin/master` blob `da99a105a05710b93e2cc7f692ff94b391f43f19`. The [eight-stage design](../design/character-creator-eight-stage-identity-build-aptitude-conditions-review-2026-11-18.md) and [World Entry boundary](../design/character-creator-world-entry-prestige-supplies-portrait-integration-intent-2026-11-17.md) govern this branch.

## Implementation

- `EpochApp.tsx` mounts `SelectedWorldCreator.tsx` only after the existing credential and owner-verified selected-World handoff. `state.ts` keeps an ephemeral open flag. The component owns its draft and discards it when the player leaves the creator. No legacy form or campaign publication callback is passed to it.
- `selected-world-creator.css` provides the full-width name and avatar header, contextual navigation and World ID, responsive stages and stat rail, vertical Identity rows, portrait handoff, landscape geography cards, Summary and Opening.
- `selectedWorldEntryReview.ts` uses the shared lineage bases and sex, age and height deltas. Its Build/Aptitude allocation and resource projections are review calculations. `selectedWorldEntryReviewCatalog.ts` records the pinned editorial options. Existing source catalogs supply lineage palettes, geography names and available artwork. The palette uses existing source swatches with draft tone controls. The standalone prototype's concept swatches and hue grid are excluded.
- The creator starts with a blank required first name and explicit geography choices. Changing continent or region clears dependent choices, and changes to scenario context invalidate downstream review. Ordinary Core is an editorial draft with a reversible Opening decision. Proposed Conditions are inspectable. Wilderness cards can be read as editorial drafts. World-Stray and Prestige eligibility remain held.
- Summary reports starter skills, traits, equipment, currency and Save allocation as pending. The selected World retains its existing genesis scenario. Opening cannot execute an action, publish a character or allocate a Save until an approved atomic World–Character–native-v3 Save owner exists.
- The Classic creator, Backstory and Starting Bundle data and validators, migrations, manifests, tracked artwork, draft PRs and master preview stay at their existing source. The touched tests are `first-world-a3b-ui-browser-qa.py` and `first-world-a3b-ui.test.mjs`.

## Compiled loopback preview

Use the same browser profile and origin as the World you intend to reopen. The prior preview used `http://127.0.0.1:5244`. The startup check protects any listener already there.

```powershell
Set-Location 'C:\Codex\EoL\.selected-world-entry-20261123\apps\rpg-ui'
$port = 5244
if (Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue) {
    throw "Port $port is already in use."
}
if (-not (Test-Path 'node_modules/vite/bin/vite.js')) {
    npm ci
    if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed.' }
}
$preview = Join-Path $env:TEMP ('lineage-selected-entry-' + [guid]::NewGuid())
node node_modules/vite/bin/vite.js build --mode world-owner-review --outDir $preview
if ($LASTEXITCODE -ne 0) { throw 'Compiled World review build failed.' }
$previewClient = Join-Path $preview 'client'
$previewSession = 'selected-entry-' + [guid]::NewGuid()
$processControl = 'C:\Codex\EoL\.codex-local\process-control.ps1'
& $processControl Start -SessionId $previewSession -FilePath (Get-Command python).Source `
    -Arguments "-m http.server $port --bind 127.0.0.1 --directory `"$previewClient`""
# After review, stop this server with:
# & $processControl StopSession -SessionId $previewSession
```

Open the [compiled preview](http://127.0.0.1:5244/?welcomeL1=1&accountPresentation=1&worldPresentation=1), sign in with the World account password, and choose **Chronicle → Open World → Create Character**. A remembered session may require password-backed sign-in again.

## Verification

- Chromium on compiled review and ordinary builds verified real World creation and reopening after an actual browser restart. All 16 World-creation viewport/theme cases passed. The creator passed all eight stages at desktop 1440×800, tablet 768×800, portrait 375×667, and landscape 667×375 in dark and light themes. Each run recorded the eight stages and an opening decision, with keyboard and pointer coverage across the matrix.
- The browser verified blank-name focus, disabled forward steps, positive and negative Condition inspection, separate randomizers, source geography artwork decoding and coverage, dependent geography invalidation, Ordinary Core review, wilderness and Prestige denial, both opening options and reversal, Back to Characters, and reopening the same World. World, receipt and unrelated IndexedDB rows matched across the draft and reopen. The Classic route still started an ordinary campaign and left the World stores empty.
- The retained verification also passed missing or altered World source, missing receipt, stale account generation, cross-account isolation, sign-out, reset, deletion, rollback and exact retry, competing tabs, backup restore, and compiled entry opt-ins. The lifecycle harness uses keyboard navigation for the existing account control after the launcher clock intercepted a pointer click. No launcher chrome source was changed.
- Node passed 44 focused owner and Classic tests with the local Node compatibility loader and disposable IndexedDB dependency. The eight stage labels, nine Builds, nine Aptitudes, 28 Condition entries, and eight editorial scenarios matched the pinned HTML data. All 810 lineage/Build/Aptitude combinations retained the 90+10 allocation. The exact HTML and all 114 asset hashes verified. The standalone source and Chromium smoke passed. All 55 World-owner source pins verified.
- Node typecheck, no-new-hex and direct Vite ordinary, compiled World review and native-staging builds passed. UI TypeScript reported 183 diagnostics on both the reviewed base and the candidate, identical after normalizing source locations. The combined TypeScript-first build remains blocked by the baseline.
- FP-001/017 are covered by authenticated creation, reopening and creator navigation in Chromium. FP-002/003/010 retain the explicit atomic owner gate. FP-004/005 cover rollback and retry. FP-009 records the exact base, preview pin and runtime commit. FP-011/014 cover pinned source and receipt denial. FP-018/019 cover generation changes, retained store evidence and browser restart.
- Screenshot evidence and browser logs are under `C:\Codex\EoL\.codex-local\selected-entry-20261123`. The screenshots contain disposable accounts and World IDs.


- The four registered test servers stopped. All four listener probes were clear.

## Review trigger

Independently review the current creator presentation using the compiled World route and pinned standalone reference. Keep durable publication, production activation and game-version advancement held. The earlier selected-World branch is the reviewed base. Draft PR #102 retains its World-owner gate. Draft PR #103 remains the presentation source.
