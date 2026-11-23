# Independent Connector audit: functional World preview and selected-World pickup

**2026-11-22.** Unversioned support review for `vagabond1215/Lineage_Reforged`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`. **Disposition: FUNCTIONAL_WORLD_PREVIEW_SOURCE_REVIEW_PASS; CODEX_BROWSER_RECEIPT_REVIEWED_NOT_REEXECUTED; SELECTED_WORLD_AND_CHARACTER_ACCEPTANCE_HELD.**

This document is a non-invasive source/evidence audit. It does **not** authorize merging draft PR #102, enabling production/default World creation, making World-to-Save associations, or treating unauthenticated list data as an owner capability.

## 1. Latest published Codex run

- Published preview branch: `codex/functional-world-integration-preview-2026-11-22`, head **`bae33e656b8c1e472a3d9f7abb050d47829d48e6`**. Runtime/test commit **`868595f17a2d32bff7a3101a0755098831cc9cdf`**.
- Parent selective UI branch: `codex/selective-ui-consolidation-2026-11-22` at **`7d96447ecce76fce6b67a7928f0b9070941d4aee`**; current `master` **`20abe83c2aa97ba4699711a9815d9b95e0d3df44`**. The preview is **four commits ahead and zero behind master**, and **two commits ahead and zero behind the selective UI branch**. It is not an unreviewed merge of the old divergence.
- Original A3b UI owner integration runtime: `7a46f5771e0785ad7a2d9c1da54ccf200153eeef`. Browser matrix branch `codex/a3b-chromium-matrix-2026-11-22` at `f705857c491b8841e97101a7e3f1fbb225d343c0`. Exact earlier independent source review: `77afc6b51e1057b1dc3b389fbf19f10417a7c925`.
- Source/test handoff and local Chromium results are described in `docs/dev/ui-functional-world-integration-preview-2026-11-22.md` (Git blob `a0411f5a300465535380e3a2b4f0969fe678a238`). They are **Codex-reported local execution**, not independently rerun by this Connector.
- Draft PR #102 remained **open, draft, unmerged** at `e74f9e1414d02cde60ba03aa088afc166f2634b1`. Draft PR #103 remained **open, draft, unmerged** at `d6fb21d3452f56ecf962f2c7d11eae95394927ca`.

## 2. Independent Connector passes executed

1. **Exact history delta:** Compared live `master` → selective UI → functional preview, then compared preview to the older A3b matrix and PR #102 owner branches. Master-based preview carries **4 additional commits** and the selective parent carries the presentation-only baseline; the second slice adds the reviewed owner/Worker/World review build and persistence path. No merge, force-update, retarget, cleanup, or local checkout action occurred.
2. **Untruncated source tree:** Fetched the recursive Git tree for the exact published preview head. **2,337 entries**, `truncated=false`. Compared the tree's object IDs against **every individual manifest-pinned source path**:
   - v1 original canonical, algorithm, JS bridge: **41/41 exact**.
   - v2 browser/source-pack/Worker: **8/8 exact**.
   - v3 owner producer, account adapter/store, pilot, Vite: **5/5 exact**.
   - Separate historical original A1 registry producer `apps/rpg-ui/src/game-shell/firstWorldDurableRegistry.ts`: **1/1 exact** at `cf58c82d4703b6fbc209e7701233881cdad415f3`.
   - **Total 55/55, zero missing, zero mismatched.** Three manifests declare 54 pins; the original A1 producer is the independent 55th. Manifest objects: v1 `8dd06caec702c439ed36b59ac24c146b266adffb`, v2 `573ff2566dff73b6f64785180624ee2e379f8311`, v3 `25477117764ad35a91ffab1526f1ae810344c98d`. Runtime v3 `sha256:90d19ed5fa6f9c06bc093d6f775b65a5b69ad12b66a40362bd42a3bf948cfe33`, v2 parent `sha256:63ba33dc9873ce49e2a2d98ba9744e9e0c45a2ac88ef244212968bb371752437`.
3. **Runtime provenance parity:** Independently fetched both preview and older A3b matrix recursive Git trees, compared **19 specific integration/runtime/test paths** spanning `EpochApp`, version gate, `LocalAccountAccessScreen`, all three World presentation components, world state/projection, account adapter/store, review entry, Vite builds, legacy launcher state and first-campaign adapter. **18/19 exact Git blob matches.** The **only changed path** is `apps/rpg-ui/tests/first-world-a3b-ui-browser-qa.py` (preview `d76174312e07f530106ac30a93cb5b14e29512b6` vs prior matrix `67ff27cddd92cd394195ff0a111b886e6f60175b`), extended for a real persistent browser-process restart. No runtime mismatch among those compared files.
4. **Read-only owner and downstream caller trace:** Opened current preview source `WorldLibrary.tsx`, `worldPresentationState.ts`, `game-shell/state.ts`, `cleanEpochFirstCampaignAdapter.ts`, `world-source/pilot.ts` and `cleanEpochAccountStore.ts`. The verified World card is display-only; its state reducer supports Library/Configuration but not selected-World entry; `state.ts` has `WORLD_LIBRARY_GATE` but no selected-World route; first campaign `start(accountId, form, ...)` does not carry `worldInstanceId`; pilot genesis requires zero `characterAssociations` and `campaignSaveAssociations`, revision zero and tick-zero clock. This is an **actual implementation boundary**. It does not mean the historical account-scoped Character Creator/Save entry is broken.
5. **CI visibility:** GitHub Connector reported **zero PR-triggered workflow runs** and **zero combined status entries** for preview head `bae33e65`. This is absence of CI evidence at those endpoints, not evidence that Codex's local tests failed. No Connector Node, Vite, Playwright, raw PNG, local profile or localhost server execution occurred.

## 3. Actual user goal and Codex local witness

The user's needed first gate is **one visible account Login/Create → Welcome → Chronicle → real World Creator → durable World+receipt → Library, then same World after browser restart and password sign-in**. This was previously blocked on ordinary DEV because the owner write is available **only** in the explicitly compiled, loopback-restricted `world-owner-review` build.

Codex's latest receipt reports an isolated **master-based compiled** preview accomplishing that flow with a disposable Chromium profile, **47 focused Node tests + 7 render tests**, the full **16 width/theme combinations**, extra retry/account/backup/migration tests, all canonical HTTP asset pin checks and three direct Vite build modes. The new A3b browser test includes `launch_persistent_context` followed by closing and starting a separate browser process with the same data directory and origin to verify the World identity and receipt. On the same integration checkout the broad UI TypeScript count rose **118 → 183** when the owner was transplanted. The final **183 diagnostics match the original reviewed A3b baseline**; they do **not** satisfy a no-diagnostic-increase criterion relative to the presentation-only parent. The combined `ui:build` remains red; direct owner-review Vite build is the correct local artifact. No independent Connector runtime execution or new gameplay acceptance is claimed.

**Operational separation:** Standard DEV `npm run dev` supports the version switch and Creator presentation, but its final Create is intentionally disabled. The *functional* local experience is the separate compiled loopback artifact. Codex supplied this exact candidate worktree and PowerShell launch process:

```powershell
Set-Location 'C:\Codex\EoL\.functional-world-preview-20261122\apps\rpg-ui'
$worldPreview = Join-Path $env:TEMP ('lineage-world-preview-' + [guid]::NewGuid())
node node_modules/vite/bin/vite.js build --mode world-owner-review --outDir $worldPreview
if ($LASTEXITCODE -ne 0) { throw 'World preview build failed.' }
python -m http.server 5244 --bind 127.0.0.1 --directory (Join-Path $worldPreview 'client')
```

Open `http://127.0.0.1:5244/` for the Classic selector, or `http://127.0.0.1:5244/?welcomeL1=1&accountPresentation=1&worldPresentation=1` for the functional New UI. **Use a separate browser profile and unused port, preserve the same exact origin/profile on restart, and inspect the actual worktree and listening port before launching.** This command is from Codex's receipt, not executed by Connector. An ordinary Vite server at the old master checkout is not the same preview.

## 4. Exact downstream gap and bounded next slice

Current **first inaccessible post-World action**: select/open the already-created World. It is not a failure to create the World; the real card has no button and the state machine cannot hold selected World identity. Therefore World-scoped Character Library, Character Creator, Save/Resume and In Game remain **NOT TESTABLE**, not accepted as passing. The older standalone HTML demo is not a backend.

**Safe proposed next Codex slice, separate owner acceptance:**

- Mount an accessible **Open World** button on a `ready` card (never an unverified, blocked, empty, remembered-stale or cross-account card); Back/Home/logout must clear selected-World UI scope.
- Introduce only an **ephemeral selected-World presentation route**, preserving account ID, account lifecycle generation and exact retained `worldInstanceId`; no persistent hints or new IndexedDB stores.
- At selection, do not trust the card or an unauthenticated `listChronicleWorlds(accountId)` by itself. Validate session/account before and after each async inventory/owner check, keep stale UI epoch fencing, enforce exact World ID/generation and pilot source/receipt integrity. `reopenChronicleWorld` uses a credential-issued World capability; remembered sessions cannot silently gain this capability. Choose a verified read-only path with explicit owner approval or request password reauthentication when this credential capability is required.
- Display a truthful **World-scoped empty character shell** only if its source proves the pilot has no character associations. Display account-wide Save slots only through the separate existing launcher, clearly outside the selected World. Fail closed on missing/corrupt pair, changed account, logout, store closure or source mismatch; never claim an unscoped account Save belongs to this World.
- Acceptance: real compiled review, keyboard/pointer and responsive routes, fresh reopen after browser restart/password sign-in, account switching, stale/logout, corrupt/half pair, unsupported mode, one-World cap, source identity, feature-off and Classic fallback. No World simulation or Save writes.
- **Next separate owner-gated functional milestone:** accept a versioned World ↔ Character ↔ native-v3 Save association transaction, including concurrency, history, rollback, migration/archive/restore and evolved World validation. The current compact pilot assumes revision-zero genesis and empty associations. Do not mutate that graph as an unversioned shortcut or create synthetic characters/slots to appear to unblock the UI.

**Current product design nuance:** The November 21 UI prototype is moving away from an intermediate World Overview, so this narrow selection shell may lead directly to a World-scoped Characters screen. Do not resurrect a superseded Overview screen just to fill the route. The exact UI decision is secondary to the account/World authority boundary.

## 5. Explicit holds and result

- Keep `master`, preview and Codex active branch, draft PR #102, PR #103, account/Save owner and all map lanes untouched. This Connector review adds documentation **only** on a separate branch.
- No production or staging publication, port takeover, local user-profile mutation, branch deletion, broad historical UI merge, unrelated typecheck cleanup, Family Library, evolved World, character creation or Save binding.
- **Verdict:** The published functional World preview has exact reviewed source provenance and a clear tested-local Create/restart receipt. Connector source evidence is **PASS**, independent runtime evidence remains **held**, and the next actual player-path blocker is **selected World → World-scoped characters**. A docs-only Connector pickup is safe; making that path functional requires an explicitly scoped implementation and owner review.
