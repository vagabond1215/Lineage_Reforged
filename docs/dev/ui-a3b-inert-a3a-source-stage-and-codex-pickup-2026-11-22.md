# A3b inert A3a source staging and Codex pickup

Date: 2026-11-22, America/New_York. Game `0.1.1-prealpha` / `INTEGRATED_LOOP`. **Status: A3B_PREWORK_STAGED_INERT / WORLD_CREATION_NOT_CONNECTED.** This is connector-safe prework only. Do not report a functional Creator, integrated tests, real Chromium UI creation, PR acceptance, gameplay loading, default activation or production enablement.

## Anchors and branch protection

- Exact verified owner runtime foundation: draft PR #102 `connector/l3a-world-v8-migration-preflight-2026-11-17` at `e74f9e1414d02cde60ba03aa088afc166f2634b1`.
- Exact reviewed UI source: `codex/ui-shell-account-first-slice-2026-11-21` at `7624adc2f54b72204717ad18a2e4294454d9bfb1`, A3a source commit `8ec8b4067f9a6baff927c60969e87a4afb8e2ac1`.
- Original `master` was `20abe83c2aa97ba4699711a9815d9b95e0d3df44`. PR #103 at `d6fb21d3452f56ecf962f2c7d11eae95394927ca` is separate and remains held.
- This stage branch `connector/a3b-inert-a3a-source-stage-2026-11-22` was **created from PR102's exact head**, not by merge, reset or rebasing either topic. No primary map worktree involved. The only source changes on this branch are new files: existing PR102 account, World, source, build and Classic launcher files are unmodified. No new Vite feature switch, owner callback or UI mount has been added.

## Exact A3a source transfer completed

Six additive files were fetched from the exact UI head, added sequentially through GitHub and then independently fetched from this staging branch. Every resulting Git blob matches its original **exactly**:

| Staged path | Original and staged Git blob SHA-1 |
|---|---|
| `apps/rpg-ui/src/game-shell/components/WorldCreator.tsx` | `de6e0d9abd040f1cf07441d447ae33d2864bac80` |
| `apps/rpg-ui/src/game-shell/components/WorldLibrary.tsx` | `a3f3bee542e51e843e9d2005d43f5698a89cb5d4` |
| `apps/rpg-ui/src/game-shell/components/WelcomeWorldPresentation.tsx` | `0d9bb7c5c98300b111bec3da40ba91513f107621` |
| `apps/rpg-ui/src/game-shell/worldPresentationState.ts` | `ba61029805560908f4ab6a845374fffb6a2861ad` |
| `apps/rpg-ui/src/game-shell/accountPresentationGate.ts` | `fe86d5754fb6412612ee24595eac6cf4bc508a28` |
| `tests/unit/world-presentation-state.test.mjs` | `73bf82c5468cb351b8353f43cbdbcbfed3d55a85` |

**The copied components are currently unmounted.** The original owner-base `EpochApp` never imports `WelcomeWorldPresentation`, never supplies a World Library inventory or a Create callback and does not use the added `accountPresentationGate`. The existing pilot writer still rejects non-compiled/non-loopback writes. Importantly, the copied Creator's default `onCreate` is undefined, so even mounting it without correctly admitted account-side callbacks cannot report a committed World.

Do not copy UI-branch `cleanEpochAccountStore.ts`, `cleanEpochAccountAdapter.ts`, `vite.config.ts` or `main.tsx` over PR102. They contain older/nonmatching owner state or separate QA entry semantics. Stage tests are not acceptance: the single pure presentation-state test was transferred byte-for-byte; no Node runner, browser, build or typecheck has been executed by the Connector.

## Independently reverified source-provenance closure

On PR #102's exact head, the Connector fetched all three original manifests and **all 55 individual Git blob identities** using `fetch_file`:

- v1 `docs/design/first-world-default-chronicle-scenario-source-manifest-v1.json`: 22 source, 10 algorithm, 9 JS entrypoint pins, **41/41 match**.
- v2 `docs/design/first-world-economy-source-manifest-v2.json`: **8/8 match**.
- v3 `docs/design/first-world-economy-source-manifest-v3.json`: **5/5 match**.

Missing: 0; mismatched: 0. The v3 runtime fingerprint remains `sha256:90d19ed5fa6f9c06bc093d6f775b65a5b69ad12b66a40362bd42a3bf948cfe33`; parent fingerprint `sha256:63ba33dc9873ce49e2a2d98ba9744e9e0c45a2ac88ef244212968bb371752437`. This is **remote Git blob verification**, not local build verification. The six staged additions do not touch any protected pin. Keep all immutable v1/v2/v3 pins intact. If future A3b truly changes a protected file, stop and publish a versioned successor rather than overwriting provenance.

## Reconciliation inventory: exact current overlaps

The Connector compared UI versus owner by fetching each exact Git blob:

| File | Owner blob | UI blob | Requirement |
|---|---|---|---|
| `EpochApp.tsx` | `6cdad2916e273e920323515733dbf49893209cf0` | `7e81b3e578dfd2f4cc72205866753a300be865e9` | Deliberate narrow integration; do not overwrite account/session, Save and launch logic |
| `components/AppShell.tsx` | `7a2b7b45dc024379ea8add4d67abfef41c330279` | `f8f693ffd23b659c1389b33a9e7b1369b2611f52` | UI variant includes one `exactOptionalPropertyTypes`-safe conditional `innerClassName` spread; pick that one-line fix only after baseline |
| `components/LocalAccountAccessScreen.tsx` | `109df05ed1808395e334b07d50752dc97c48a454` | `4788d22a94aac9fb3d39b0cab07596d5f7f5b56e` | Owner version lacks `presentationPreview` and `splashUiVersion`; selective, gated UI transfer needed if passing these props |
| `main.tsx` | `c4d1914036007010e1dfc9e43bd6a77bb1059174` | `daaf9cd5866e0718c95cd6603c0579e33090ebaf` | **Keep owner version** with compiled review fixture and worker routing |
| `cleanEpochAccountAdapter.ts` | `afaa6036b290903ff88e99a3cf324cd94711c35a` | `bca17503b53eee7564a18911d61b48aa89beea3d` | **Keep protected owner version** and credential-issued World WeakMap |
| `cleanEpochAccountStore.ts` | `d0deba66b3bc977738577e6dce2a06df4c2a9a1d` | `a8b185ddaef0b59c508f1b8e767a05a3a4a2f1b6` | **Keep protected owner version** with v8 World + receipt transaction |
| `App.tsx` | `74598ac46504564df19e97017cb003d04760326c` | same | No source reconciliation needed |
| `components/ui/Card.tsx` | `7fa14a04e68fca96b4134b87fe95ebfe060bf1a7` | same | Already compatible as UI component dependency |
| `index.css` | `4275e0b48f72f868197cce855a9162f63fe230c3` | same | Existing theme tokens available |
| `game-shell/state.ts` | `208d0a17064df898ba4e7dc47dab27613c4c8000` | same | Existing Welcome/World Library reducer actions available |
| `components/WelcomeScreen.tsx` | `17c68d77bc50cc7914338bd23f23161cb15d08d2` | same | Default Classic/legacy presentation remains available |

Exact text diff between the two `EpochApp.tsx` blobs consists of 46 changed lines: new gated presentation imports, split native-development-entry boolean, three preview flags, compatibility launcher handler, splash-selector handler and props, and alternate gated `WelcomeWorldPresentation` render. The original UI-branch version still passes **no** `inventory` or `onCreateWorld`; copying that source file verbatim would not provide functional creation and would require additional `LocalAccountAccessScreen` props. Use owner `EpochApp` as the base for carefully integrated deltas.

The A3a server-render and Chromium presentation QA scripts were **not** staged: they include additional UI account-selector/shell assumptions and DEV-only preview expectations that are not yet reconciled on the owner runtime. A new compiled-review UI Chromium test is still mandatory.

## Minimal A3b implementation order for Codex

1. Checkout this exact stage branch into a new **isolated Codex integration worktree** and verify the staged hashes and owner parent. Re-fetch heads before new work; never modify master, PR102, PR103 or the map worktree.
2. Record a fresh **same-branch** TypeScript baseline and source/build checks before editing. Historical UI 118 vs PR102 184 diagnostics are incomparable.
3. Add a narrow explicit `world-owner-review` compiled *loopback* UI admission alongside the existing DEV presentation gate. Preserve independent A2b owner guard and default production route; do not call `window.worldOwnerReview` from actual UI. The compiled review requires exact opt-in query flags and credential-backed account session.
4. In `EpochApp`, provide owner-fed `inventory` through `accounts.validateSession` + `owner.listChronicleWorlds(accountId)`. Recheck account identity and lifecycle after async awaits; keep corrupt/source-missing failure distinct from empty. Do not add Save recovery calls during World Library entry. Preserve the prior launcher bootstrap/recovery safeguards.
5. Keep credential-issued `CleanEpochAccountAdapter` and `CleanEpochAccountStore` instance exactly the same in owner `Services`. Remembered login may inspect valid inventory but must **reauthenticate** for World writes; never infer `WeakMap` capability from session hint. Add an actual UI affordance for reauth or route back to the existing password entry.
6. Extend active intent lifetime beyond the Creator's mounted `useRef`, bound to account ID, generation and the **original expected account revision** (A2b's `samePilotIntent` checks this revision). An uncertain failure and page refresh must reconcile owner records before a new distinct intent. If using a minimal sessionStorage pending journal, keep it untrusted and contain no World/capability/credential copy.
7. Create using `owner.createChronicleWorld({ expectedAccountRevision, creationIntentId, proposedWorldInstanceId, displayName }, {adapter:accounts,session})`. Compare the returned retained World, matching receipt, owner-reopened pair when authorized, and fresh listed card, including source/binding/scenario/account/generation/name/creation intent. Only then emit UI `verified`. Commit genesis only; do not materialize regions, characters, Saves, play sessions or World-time ticks.
8. Run integrated Chromium against disposable accounts and task-owned compiled loopback origins: exact same World after reopen/sign-in; quota; duplicate/retry; stale/logout/account separation/concurrent tabs; source corruption/missing; abort/quota failure; v7 migration/v8 archive/native-v3 histories unchanged; five widths, two themes and default/production feature-off. Preserve A2b test-only v7 fixture procedure.

Historical test commands to **execute and report results from the isolated worktree**, not already performed here:

```sh
git status --short
git rev-parse HEAD
node --import tsx --test tests/unit/world-presentation-state.test.mjs
npm run typecheck:ui:node
npm run typecheck:ui
npm run tool:no-new-hex-dependencies
# From apps/rpg-ui, use direct Vite build as separate evidence:
npm exec -- vite build
npm exec -- vite build --mode world-owner-review
# With task-owned compiled review/ordinary loopback servers:
python apps/rpg-ui/tests/first-world-a2b-browser-qa.py --review-origin http://127.0.0.1:PORT --ordinary-origin http://127.0.0.1:OTHER_PORT
```

The existing A2b real-browser QA may require the temporary exact original-v7 test fixture as documented in `docs/dev/world-a2b-atomic-browser-owner-receipt-2026-11-22.md`; remove it immediately after testing. Build instructions use the exact Node/Vite toolchain available in Codex. Also add and run **a new** integrated browser UI Create/restart spec, not just the old A2b QA global or DEV presentation fixture.

See the source-review package from the separate documentation branch for detailed acceptance and hard-stop boundaries: `connector/a3a-independent-review-a3b-codex-package-2026-11-22`, `docs/dev/ui-a3a-independent-connector-review-a3b-functional-creation-package-2026-11-22.md`.

**Required disposition until new integrated Chromium evidence exists:** `UI_A3B_INTEGRATION_HELD`. No merged PR102, production/hosted/world gameplay activation or game-version change.
