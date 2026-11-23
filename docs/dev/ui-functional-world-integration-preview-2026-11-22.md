# Functional World integration preview

November 22, 2026. Unversioned UI and World validation. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, development impact `supports_current_band`, game-version impact `none`.

## Source and integration

The new isolated branch `codex/functional-world-integration-preview-2026-11-22` starts at the clean selective candidate `7d96447ecce76fce6b67a7928f0b9070941d4aee`, a descendant of live master `20abe83c2aa97ba4699711a9815d9b95e0d3df44`. The user authorized the World owner for this compiled local candidate. The reviewed runtime is A3b `7a46f5771e0785ad7a2d9c1da54ccf200153eeef`, prior matrix `f705857c491b8841e97101a7e3f1fbb225d343c0`, and independent audit `77afc6b51e1057b1dc3b389fbf19f10417a7c925`. The runtime and test commit on the new branch is `868595f17a2d32bff7a3101a0755098831cc9cdf`.

- Preserved the previously consolidated splash and account presentation. Applied checked hunks for the compiled gate, authenticated World callbacks in `EpochApp`, `WelcomeWorldPresentation`, `WorldCreator`, the app review entry and Vite configs. The compiled build still requires loopback, a supported entry path, the exact three query opt-ins and the owner’s independent compiled authorization gate. Remembered accounts can list Worlds. Sign out and use the existing password sign-in before creating a World.
- Transferred only the reviewed A2b account adapter/store, registry, Worker, build/verification and v2/v3 manifest dependencies, plus A3b readback and review support. The existing v7-to-v8 owner migration stays with the same storage authority. App, owner, build and manifest Git blobs match the reviewed runtime. All 55 source pins and both fingerprints match. No new dependency, engine, content or native Save behavior was added.
- Preserved master’s unrelated UI/tests/assets and the separate review lanes. Kept PR #102 and PR #103 histories, older standalone QA apps, prototype assets, historical UI PRs, and inherited coordination changes out of the transfer. The two Node test imports that referenced a legacy QA forwarding file now import the same canonical verifier directly. The exact original v7 owner fixture was used only for the separate owner QA build and removed. No branch was merged or cherry-picked.

## Run the preview

Use this worktree, a free dedicated port, and a separate browser profile. The preview opens the existing database authority at that origin with the reviewed v8 schema. Keeping it on 5244 in a separate profile isolates existing browser accounts and Saves. Use the same preview origin and profile across browser restarts. Use a regular separate profile so persisted Worlds survive closing the browser.

```powershell
Set-Location 'C:\Codex\EoL\.functional-world-preview-20261122\apps\rpg-ui'
$worldPreview = Join-Path $env:TEMP ('lineage-world-preview-' + [guid]::NewGuid())
node node_modules/vite/bin/vite.js build --mode world-owner-review --outDir $worldPreview
if ($LASTEXITCODE -ne 0) { throw 'World preview build failed.' }
python -m http.server 5244 --bind 127.0.0.1 --directory (Join-Path $worldPreview 'client')
```

Open [Classic splash with the selector](http://127.0.0.1:5244/) or [New UI Preview](http://127.0.0.1:5244/?welcomeL1=1&accountPresentation=1&worldPresentation=1). In the preview profile, create or sign in to an account, choose **Chronicle**, open **Create New World**, enter a name, confirm the fixed pilot settings, and submit. The verified card renders in **Your Worlds**. After restarting the browser, open the same URL, sign in, and choose **Chronicle** again to see the same World. The one-World quota disables further creation.

## World creation acceptance

The compiled user artifact at port 5244 passed the ordered real UI path in a disposable persistent Chromium profile. The first browser registered, signed out, signed in with a password, opened Welcome and Chronicle, verified an empty Library, created a World and read back the World and receipt. All stores outside the World/receipt pair were identical. Chromium exited. A fresh process using the same profile and origin signed in, reopened the Library, and returned the exact same World ID and durable graph. Test instance `world.instance.5b000e7c-8b1d-498c-bf34-33946edb2533` was disposable. No real account or Save data was opened or altered.

- The A3b Chromium suite then passed all 16 viewport/theme combinations, both splash switch directions, quota, remembered-session reauthentication, stale logout/reset, corrupt and missing source and receipt, abort/quota rollback, lost acknowledgement, exact retry, competing tabs, account separation and archive round-trip. A separate Chromium check on ordinary Vite DEV at 5247 reached the Selector and Creator with final submission disabled and both World stores empty. The ordinary compiled origin at 5245 stayed Classic with preview flags.
- The A2b owner suite on the separate 5246 artifact passed exact v7 migration/restore and v8 archive round-trip with native-v3 ready and retired histories, plus credential/session admission, corruption rejection and transaction races. The compact pair remained 50,251 UTF-8 bytes. HTTP readback matched all 22 canonical assets byte for byte on all three compiled origins.
- 47 focused Node tests, seven render/entry tests, Node typecheck, direct Vite ordinary/review/native-staging builds, no-new-hex and Git diff checks passed. The render harness emitted a nonblocking Vite WebSocket port warning. On this same checkout TypeScript reported 118 diagnostics at the selective base and 183 with the transplanted owner. The 183 diagnostics are byte-identical to reviewed A3b (SHA-256 `9b7d269e244352f4d178c5c6501238bffea65188a746fcff3995cd4370c07a67`). The combined build exits 2 on those diagnostics. Use the direct preview build above.
- FP-001/017 are covered by the actual caller path and full browser restart. FP-004/005/018/019 are covered by transaction rollback, stable retries, exact readback, generation and history checks. FP-009 is covered by exact base/runtime/build identities. FP-011/014 are covered by the pin closure, delivered assets and corruption rejection. FP-002/010 preserve existing owner and production gates.
- All four registered servers stopped. Listener and process readback found zero task servers or Chromium processes, and the pre-existing server on 5241 remained. Application dependencies remain available in the isolated worktree for the preview command.

## Downstream reachability after verified reopen

The reopened Library exposed no Open World, Overview, Character Library, Create Character, Continue or Play action. The existing launcher bridge can be reached separately from Welcome and still shows the account’s Characters section. This bridge carries the validated account and its Save inventory.

| Surface | Implemented route and result from the verified World |
| --- | --- |
| World Overview | The Library has a readback card and no selected-World route in `state.ts`. Overview is present in older prototype evidence. The later standalone design drops that intermediate screen. **NOT TESTABLE**. |
| Character Library | `MainMenuScreen.tsx` lists account-scoped Save slots. No World-scoped Character Library or associated roster reader is mounted. **NOT TESTABLE**. |
| Character Creator | `CharacterCreationScreen.tsx` renders the narrative creator when the existing launcher opens an empty account Save slot. `CleanEpochFirstCampaignAdapter.start(accountId, form)` accepts no retained World identity. **NOT TESTABLE**. |
| Gameplay entry | `EpochApp` enters `InGameShell` after an admitted account slot load or first campaign creation. No World-bound campaign/Save handoff exists. **NOT TESTABLE**. |

The immediate blocker is an authenticated selected-World handoff. The Library card has no action or state for a selected `worldInstanceId`. The compact pilot also verifies genesis revision zero with empty `characterAssociations` and `campaignSaveAssociations`. It has no approved association transaction or compatible reopened evolved-World contract. The smallest next slice is an explicitly gated **Open World** action that reuses owner readback to carry a verified account, generation and World ID into a read-only World-scoped library shell. It should show the retained World identity and the owner-confirmed empty roster for this pilot. Character creation and gameplay entry require a separate durable association decision, including exact native-v3 Save and migration behavior.

## Remaining approvals

This branch is scoped to local preview. PR #102 stays draft pending owner integration approval. PR #103 is visual provenance. World-to-Character/Save writes, Family Library implementation, master integration, hosted rollout, production activation and version advancement remain held.
