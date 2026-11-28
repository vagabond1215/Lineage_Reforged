# New UI master integration acceptance

**Disposition: MERGE_HELD.** Game `0.1.1-prealpha`. Playability `INTEGRATED_LOOP`. This unversioned integration supports the current development band. Game-version impact is none.

## Source and scope

| Ref | Verified commit |
| --- | --- |
| `origin/master` | `20abe83c2aa97ba4699711a9815d9b95e0d3df44` |
| `origin/codex/selected-world-creator-ux-2026-11-23` | `3789c12b99af439ab401f282f8d0302f79f7f210` |
| Connector preflight | `b19fda8181f6117468ef6ba388af454fe902ce89` |
| Tested runtime and QA on `codex/new-ui-mainline-final-2026-11-23` | `cb01fcfd60355e40f555b6edf296045f6bc5b52b` |

The accepted source is nine commits ahead of master and zero behind, across 61 paths. The coordinator created a separate worktree from master and fast-forwarded to the tested descendant. The 58 owner-scope paths match the Connector audit: 51 identical paths, one candidate-only UI bridge and six historical documentation differences. PR #102 at `e74f9e1414d02cde60ba03aa088afc166f2634b1` retains the owner-review history. PR #103 at `d6fb21d3452f56ecf962f2c7d11eae95394927ca` retains the visual provenance. The prototype blob remains `da99a105a05710b93e2cc7f692ff94b391f43f19`.

The integrated descendant changes `apps/rpg-ui/src/EpochApp.tsx`, `apps/rpg-ui/src/worldOwnerReview.ts`, `apps/rpg-ui/tests/first-world-a2b-browser-qa.py`, `apps/rpg-ui/tests/first-world-a3b-ui-browser-qa.py`, and adds `apps/rpg-ui/tests/new-ui-mainline-browser-qa.py`. It adds an explicit loopback-only Vite development mode and a Classic URL fallback, extends the original-v7 QA fixture with real ready and retired native-v3 campaigns and lifecycle history, adjusts tile geometry measurement, and adds standalone migration, cross-origin restore, native-v3 Classic and development-mode browser acceptance. Snapshot the exact full master-relative path inventory with `git diff --name-status 20abe83c..cb01fcfd`. This receipt, the current output, handoff, prompt status and branch register are the documentation delta.

The verified World UI bridge binds selected World and receipt identity to account lifecycle generation and verified source readback. The selected creator keeps Opening and its choices in memory. Durable World–Character–native-v3 Save association, gameplay, and production World creation require separate owner authorization.

## Executable checks

- **Compiled Chromium suites.** A3b exited 0 against the distinct review and ordinary builds. All 16 World viewport/theme cases passed, including 12 Creator cases. The first invocation exited 1 when the initial persistent-context navigation timed out at 30 seconds. The retry passed that step and completed the full suite.
- **Original v7 migration and v8 Classic.** The A2b CLI exited 0 with the exact original account store fixture (Git blob `a8b185ddaef0b59c508f1b8e767a05a3a4a2f1b6`). The tested compiled master v7 client was independently rebuilt and all 165 client files matched by SHA-256. Upgrade and v7 archive restore preserved all 14 old families, old passwords, native-v3 Saves, ready and retired histories, and lifecycle records. The two new families started empty on upgrade. An open v7 peer blocked migration until it closed. The ordinary v8 Classic build authenticated and continued the original native-v3 Save after migration and after restoring its archive at a separate empty origin.
- **World and v8 archives.** Real World creation through the compiled review client survived a full Chromium restart with matching World, receipt and unrelated stores. The original v8 archive restored across distinct disposable ports, including World, receipt, existing account and native-v3 Saves and history. The owner rejected corrupt archives, orphan/duplicate receipts and occupied restore. Quota and transaction abort recovered through retry. Competing tabs, stale account revision/generation, reset and deletion passed. Each independent migration, transfer, native-v3 Classic and development-mode CLI exited 0.
- **Creator and scroll.** The 12 required viewport/theme pairs reached all eight stages. The 108 screenshots and 12 `scroll.json` files record the resource projections, required first and last name, centered actions, menu/theme/logout, contextual controls, fixed narrative overlays, stage dice, keyboard focus, inline Next, double-click, and dependent invalidation. Opening choices stayed reversible and left the IndexedDB graph intact. World/receipt verification and the ordinary Classic campaign route were exercised. Chromium verified wheel, PageDown, Home/End, scrollbar drag on desktop, touch on mobile, independent rail scrolling, and final-control visibility without document-level horizontal overflow. The Identity scroll range was 1,593 px at 1440×800, 4,494 px at 320×568 and 2,697 px at 667×375. The 320×568 light console sample had zero uncaught page errors and one resource 404 whose URL was unavailable in that capture.
- **Build and source.** 57 focused Node and four render tests passed, covering account/Save owner, archive migration, routes, source pack, Worker and Classic presentation. Node typecheck, no-new-hex, and all three direct Vite modes passed. All 55 World source pins and the exact prototype with all 114 image hashes verified. The World owner fingerprint remains `sha256:90d19ed5fa6f9c06bc093d6f775b65a5b69ad12b66a40362bd42a3bf948cfe33`.
- **Evidence.** Local evidence is under `C:\Codex\EoL\.codex-local\new-ui-mainline-final-20261123`. `evidence.md` indexes the screenshots, scroll captures and CLI logs. FP-001/017 were exercised through legitimate caller routes. FP-004/005/018/019 cover retry, lifecycle and retained data. FP-009 records exact refs, fixture and build identity. FP-011/014 cover source pins and invalid data denial. FP-002/003/010 preserve owner and merge gates.
- **Cleanup.** The task process manager closed both server processes. All six task ports were clear, both borrowed dependency junctions were removed, and the pre-existing preview on port 5244 remained available.

## TypeScript and merge gate

Node 24.14.1 and TypeScript 5.9.3 reported 119 diagnostics on master and 183 on both the exact reviewed source and the integration. Normalizing coordinates, the integration introduces 65 diagnostic entries and removes one relative to master, for a net increase of 64. The exact reviewed source and the integration have the same diagnostic multiset. The removed entry is in `AppShell.tsx`. The new entries originate in the newly reached civilization-engine type graph: `settlement-simulation.ts` (26), `spatial-world.ts` (20), `runtime-economy.ts` (16), `economy.ts` (2), and `transport-runtime.ts` (1). The combined `npm run ui:build` exited 2.

All five files are pinned by the v1 source manifest. The registry import boundary is independently pinned in `apps/rpg-ui/build/first-world-source-pack.mjs`. Leave these files and pins intact. The smallest authorized correction is a separate owner-approved, versioned source-pack change that fixes these five files, verifies projection equivalence and repeats migration, Worker, receipt and strict TypeScript acceptance. A merge decision must also explicitly approve the forward-only v8 account owner. The integration stays local pending the work order’s executable gate.


## Forward-only rollback and owner-approved transfer

After any browser profile opens v8, keep that origin on a v8-compatible binary. The ordinary direct Vite build of this candidate is the tested Classic fallback. The compiled World review also exposes Classic at its bare root and through the splash selector. Both use the same v8 account and Save authority. An original v7 binary is incompatible with this forward-only rollback posture.

1. Keep the current origin, browser profile, and application binary available while validating a backup. Open the owner-approved origin. Sign in, open the existing launcher where required, and choose **Settings → Portable epoch backup**. Enter the current account password and choose **Download epoch backup**. The file contains every local epoch account, credential verifier material, campaign history, Worlds and receipts. Store it privately.
2. Record its SHA-256 with `Get-FileHash -Algorithm SHA256 -LiteralPath <private-backup-file>`. Verify a copied file against that same hash at the destination. The owner independently checks the archive and family digests during restore.
3. Start the v8 candidate on the destination origin. Confirm the account screen is at a genuinely empty epoch. Choose **Restore epoch backup**, then select the verified file. Treat an occupied, invalid, or interrupted restore as a hold. Use a different empty origin or profile instead of deleting, resetting, or overwriting any existing data.
4. Require the successful epoch readback notice, then sign in with the original password. Confirm the original World ID and selected World path using compiled World review. Open Classic and confirm the expected Save can continue. Retain the source until this is verified. Migration and archive restore do not copy the browser's session preference across origins.

Port `5244` was excluded from testing and synchronization in this pass. Scheme, hostname, port, and browser profile determine the selected browser storage.

## Preview command

Run on loopback with a free port. Functional World review accepts the linked opt-ins. Its bare URL gives v8 Classic. Use the exact same origin and profile as an existing World after an owner-approved cutover.

```powershell
Set-Location 'C:\Codex\EoL\.new-ui-mainline-final-20261123\apps\rpg-ui'
$port = 5310
if (Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue) {
    throw "Port $port is already in use."
}
if (-not (Test-Path 'node_modules/vite/bin/vite.js')) {
    npm ci
    if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed.' }
}
$preview = Join-Path $env:TEMP ('lineage-mainline-review-' + [guid]::NewGuid())
node node_modules/vite/bin/vite.js build --mode world-owner-review --outDir $preview
if ($LASTEXITCODE -ne 0) { throw 'World review build failed.' }
$client = Join-Path $preview 'client'
$session = 'lineage-mainline-preview-' + [guid]::NewGuid()
$controller = 'C:\Codex\EoL\.codex-local\process-control.ps1'
& $controller Start -SessionId $session -FilePath (Get-Command python).Source `
    -Arguments "-m http.server $port --bind 127.0.0.1 --directory `"$client`""
# Stop the server after use with & $controller StopSession -SessionId $session
```

[Functional loopback review](http://127.0.0.1:5310/?welcomeL1=1&accountPresentation=1&worldPresentation=1)

The separate read-only development default is available with `node node_modules/vite/bin/vite.js --mode new-ui-development --host 127.0.0.1 --port 5310 --strictPort` from the same checkout. Run it on a different free port if the compiled preview is in use.
