# A3a independent Connector source review and bounded A3b functional creation package

2026-11-22 (America/New_York). Repository `vagabond1215/Lineage_Reforged`; `0.1.1-prealpha` / `INTEGRATED_LOOP`. **Disposition: A3a presentation SOURCE_REVIEW_ACCEPTED_FOR_A3B; A3b EXECUTION_AND_BROWSER_ACCEPTANCE_HELD.** This document is an independent GitHub Connector read-only *source assessment*, written on a documentation-only review branch. It does not certify executable tests, browser acceptance, an integrated UI, production activation or PR merge.

## Exact inspected references

- UI: `codex/ui-shell-account-first-slice-2026-11-21` at `7624adc2f54b72204717ad18a2e4294454d9bfb1`; A3a source implementation `8ec8b4067f9a6baff927c60969e87a4afb8e2ac1`. The UI commit after A3a changes only five documentation files; no post-A3a runtime source delta.
- World owner: draft PR #102, `connector/l3a-world-v8-migration-preflight-2026-11-17` at `e74f9e1414d02cde60ba03aa088afc166f2634b1`; A2b code at `397a601bc8997d9593ab8b4f1182f4f02e39e025`; its next commit also changes documentation only.
- `master` at `20abe83c2aa97ba4699711a9815d9b95e0d3df44`. PR #103 is separate visual provenance `d6fb21d3452f56ecf962f2c7d11eae95394927ca`, draft/unmerged. No original branch was moved by this review.
- GitHub comparison: UI vs owner `diverged`, common merge base `aae4d65cdc65482032d62acef74316ed59c1eacf`, 129 UI commits and 21 owner commits since base. No blanket merge. UI is 20 commits ahead of current master; owner has a different ancestry.
- Read controlling documents: `ui-a3a-world-creator-presentation-receipt-2026-11-22.md`, `ui-a3-world-creator-connector-boundary-and-minimal-load-review-2026-11-22.md`, `ui-world-creator-first-functional-creation-priority-2026-11-22.md`, A2b receipt on its owner branch, and `current-codex-prompt.md`. The A3a 31 focused + 7 render/adjacent Node tests, five-viewport/two-theme Chromium evidence, 118 UI TS diagnostics, and A2b 37 Node tests/real Chromium/184 owner TS diagnostics are **Codex-reported historical evidence, not rerun by this Connector pass**. The 118 and 184 diagnostics are different branch baselines and must not be numerically compared.

## A3a source review findings

Source blobs on UI head:

| Path under `apps/rpg-ui/src/game-shell/` | Git blob |
|---|---|
| `components/WorldCreator.tsx` | `de6e0d9abd040f1cf07441d447ae33d2864bac80` |
| `components/WorldLibrary.tsx` | `a3f3bee542e51e843e9d2005d43f5698a89cb5d4` |
| `components/WelcomeWorldPresentation.tsx` | `0d9bb7c5c98300b111bec3da40ba91513f107621` |
| `worldPresentationState.ts` | `ba61029805560908f4ab6a845374fffb6a2861ad` |
| `accountPresentationGate.ts` | `fe86d5754fb6412612ee24595eac6cf4bc508a28` |
| `../EpochApp.tsx` | `7e81b3e578dfd2f4cc72205866753a300be865e9` |

**Accept for A3b reuse, not as functional:** Creator validates trim/1..80/control characters, confirms Chronicle/Individual/Mortal/normal stakes and one-World pilot; fixed blueprint/scenario; canonical six seasons derived from `packages/content/base/world/calendar.json`; disabled climate, alternate difficulty/season, Persistent, Living and Hardcore. Form is responsible for one mounted pending request and same-mount retry IDs. Library correctly separates `preview`, `loading`, `empty`, `ready`, `blocked`, `readback-failed`; displays owner-supplied identity, date, immutable scenario/rules, no fake Save, Play or World Overview. Back-left/Home-center/right-create arrangement and focus handling are present.

**Integration obligations discovered by reading exact source:**

1. The actual `EpochApp.tsx` currently passes **neither `inventory` nor `onCreateWorld`** to `WelcomeWorldPresentation`. Thus real A3a always defaults to `preview`; Create is disabled. A3b must wire both explicitly. Do not mistake the isolated fixture callback for ownership.
2. `WelcomeWorldPresentation` accepts a `verified` callback and immediately dispatches a highlighted ID; its Library card is independently supplied by the parent. A3b must only send `verified` after the real atomic returned World+receipt and a freshly owner-listed card match account ID, intent ID, world ID, name, scenario, binding rules and source; never render success on matching ID alone. An owner error/corrupt pair cannot be mapped to `empty`.
3. The Creator's `useRef` IDs and pending lock are **mount-local**. Back/Home, app screen remount (key includes current screen), sign-out, reload or uncertain acknowledgement can lose unresolved intent. A3b must move the active intent and busy/admission fence to an account-scoped controller at `EpochApp` level. Reconcile authoritative inventory before allowing a *new* intent. If survival through reload is needed, a minimal untrusted `sessionStorage` pending-intent journal is permitted only after explicit source/security review, with account+generation binding, no password/session/capability, no second World store, and mandatory owner validation on rehydrate. Never treat it as creation authority.
4. `EpochApp.continueToWorlds` currently invokes `inventory(services, accountId)` -> `recoverPendingInventory` (legacy Save recovery) before `OPEN_WORLD_LIBRARY_GATE`. The World-specific route needs account validation + owner World list without new coupling to Save recovery. The existing initial bootstrap/legacy launcher recovery can remain unchanged; do not weaken Save safeguards or claim overall boot is recovery-free.
5. A2b `CleanEpochAccountAdapter` keeps credential-verified sessions in a private WeakMap, populated by register/sign-in. `selectSession()` rebuilds a remembered session via `runtimeSession` and **does not populate the World capability**. A returning user may list after `validateSession`, but Create must be disabled with clear reauthentication guidance until password sign-in issues a fresh session from the **same** adapter/owner. Do not clone, fabricate, serialize or bypass the WeakMap capability.
6. Presentational gate requires `import.meta.env.DEV` (plus native-development Welcome) while owner `createChronicleWorld` requires `__LINEAGE_WORLD_OWNER_REVIEW_BUILD__` compiled with `vite build --mode world-owner-review`, on loopback. Ordinary DEV cannot write; compiled review currently cannot display A3a. A3b needs one explicitly opted-in **compiled-loopback-only** UI gate, with independent checks in owner still intact. Do not expose the QA `window.worldOwnerReview` global as the UI's integration API.
7. Pilot model uses `world.binding.rules.difficulty='mortal'` and `world.binding.scenario`; the older root `world.rules.difficultyPreset` is null. Project Library cards from verified binding; do not backfill or infer unsupported simulation settings. `listChronicleWorlds(accountId)` validates the paired owner graph and reconstructs compact pilot genesis but is not itself session-parameterized; caller must validate account session and match account ID before/after an asynchronous list.
8. UI messages currently refer to a presentation review, and Creator states "unavailable in this preview" when no callback. In functional compiled loopback review, change only wording that would be misleading; default ordinary DEV, staging and hosted must stay explicitly unable to Create.
9. Handle resolution and lifecycle races: an async Create/list result may arrive after sign-out, account switch, account deletion/reset or navigation. Fence against current account/generation/session and request epoch before changing the visible card. A lost response is not proof that no World was committed.

The above are **A3b integration requirements**, not reasons to redesign A3a's layout.

## Source ownership, API and provenance

On PR #102:
- `CleanEpochAccountStore.listChronicleWorlds(accountId)`: validated read-only World inventory; incomplete/orphan/corrupt graph fails; compact World source replay verifies genesis.
- `CleanEpochAccountStore.createChronicleWorld({ expectedAccountRevision, creationIntentId, proposedWorldInstanceId, displayName }, {adapter, session})`: atomic World+receipt, original account-generation/revision checks, one-World quota, stable exact-source retry, retained readback.
- `CleanEpochAccountStore.reopenChronicleWorld({adapter,session})`: credential-capable exact pair and projection verification. Useful as additional confirmation immediately after creation; **not** the route for remembered-session reads.
- `CleanEpochAccountAdapter.validateSession` validates account generation for read; `validateWorldSession` validates WeakMap capability for write.

Owner v3 manifest `docs/design/first-world-economy-source-manifest-v3.json` at blob `25477117764ad35a91ffab1526f1ae810344c98d` pins five v3 successors: `build/first-world-owner-source.mjs`, `cleanEpochAccountAdapter.ts`, `cleanEpochAccountStore.ts`, `world-source/pilot.ts`, `vite.config.ts`. Their recorded pins match the inspected source blobs, including adapter `afaa6036b290903ff88e99a3cf324cd94711c35a`, pilot `0a651074445819b4d7564a0970bf36c31e9ffe7d` and Vite `494f6c907b34479e7bbd90c56434682f045e6be5`. Earlier independent Connector boundary report verified **55/55** total immutable original/v2/v3 pins; this pass did not independently rehash every one. Prefer modifying only UI-only/unpinned files and adding new unpinned narrow tests, leaving v3 verified owner/build source *byte-for-byte unchanged*. If any protected bytes really must change, stop and version a successor, preserving original manifest/proof; no silent pin refresh.

## Exact scoped A3b Codex work order

**Worktree/branch:** Use a new isolated **integration** worktree and branch based on the exact PR102 owner head as runtime base. Keep original UI topic, owner PR102, master, PR103 and primary map worktree unchanged. Confirm remote heads and working tree state before coding; if they moved, recompute source reconciliation before applying this packet. Bring across only the reviewed A3a presentation components/reducer, `accountPresentationGate.ts` and the needed `EpochApp.tsx` UI hunks via controlled file-level application. Do **not** merge or reset either topic branch. Compare exact content of any overlap before applying; `EpochApp` has UI-only routing edits and must retain owner branch account/Save semantics.

**Slice I, compiled opt-in entry:** Implement a narrow helper in the UI gate recognizing `import.meta.env.PROD && import.meta.env.MODE === 'world-owner-review'`, exact loopback hostname, explicit `welcomeL1=1&accountPresentation=1&worldPresentation=1` and compiled owner's existing review guard. Keep old `import.meta.env.DEV` presentation preview behavior unchanged. In `EpochApp`, permit authenticated Welcome/Chronicle/World UI on this exact compiled review route without changing normal `nativeCandidate`/Classic/staging behavior; keep production/hosted/default off. No deployment or change to A2b owner guard.

**Slice II, one owner-fed Library:** Create narrowly scoped `EpochApp` controller/state to asynchronously read World inventory using `services.accounts.validateSession(state.launcherSession)` and `services.owner.listChronicleWorlds(validatedAccount.accountId)`; revalidate exact account/generation and screen request epoch before presenting. Project `world.binding.scenario` and `world.binding.rules`, never unsupported root nulls. On absent pair, `empty`; on one verified pair, `ready` with quota reached; on malformed/source/transaction failure, `blocked` or `readback-failed`, never `empty`. Fetch on World Library entry and on re-entry after credential-backed sign-in. Remove the **additional** `recoverPendingInventory` call from World Library entry without editing older launcher/boot recovery. Maintain zero-character/zero-Save path.

**Slice III, authenticated Create:** From current `EpochApp` session and same `services.accounts`/ `services.owner`, admit only validated World-capable session and verified account/revision; build `WorldPilotCreateInput` with stable UI creation intent and proposed World ID. Use `services.owner.createChronicleWorld(input,{adapter:services.accounts,session:state.launcherSession})`; verify returned `world`/`receipt` and `committed|same_source_retry`, then `reopenChronicleWorld` if credential-capable, then re-list. Compare exact account, generation, intent, World ID, name, source fingerprint, scenario and binding rules; only then return `verified` and show the real card. In uncertain failure, retain the intent, query authoritative World state and ask for retry with **same** IDs; never roll over to another intent until prior intent is conclusively resolved. Introduce a narrowly reviewed pending-intent journal if restart continuity needs it; it must contain no credentials/capability/World copy.

**Slice IV, auth and lifecycle UX:** Keep remembered session read-only with clear "Sign in again to create a World" path using the existing password owner; never mint a World capability from localStorage. Reset busy/visibility when account changes; ignore stale callbacks; prevent simultaneous submits/duplicate IDs, concurrent tab races, quota bypass and post-logout success. Leave selection into World-specific character library for later; no Open/Play on a World card.

**Slice V, proof:** Add focused integration state/type tests, authentication-negative tests, real browser end-to-end Creator UI test and digest witnesses. Use disposable accounts and task-owned separate compiled review and ordinary loopback ports; stop servers after. Record exact before/after `npm run typecheck:ui` diagnostics for that **same integration baseline**, and report unaffected older UI/owner baselines separately. Direct Vite build is not the combined TypeScript build; report both accurately. No new hex dependencies, no protected file drift, no fake success, no Save changes.

## Required validation and hold points

Commands to adapt to the existing isolated checkout and actual package manager/install:
```sh
git rev-parse HEAD
git status --short
node --test tests/unit/world-presentation-state.test.mjs apps/rpg-ui/tests/world-presentation-render.test.mjs
npm run typecheck:ui:node
npm run typecheck:ui
npm run tool:no-new-hex-dependencies
# From apps/rpg-ui, run direct build(s), without conflating with combined tsc:
npm exec -- vite build
npm exec -- vite build --mode world-owner-review
# With disposable task-owned compiled loopback servers running:
python apps/rpg-ui/tests/first-world-a2b-browser-qa.py --review-origin http://127.0.0.1:PORT --ordinary-origin http://127.0.0.1:OTHER_PORT
python apps/rpg-ui/tests/world-presentation-browser-qa.py --origin http://127.0.0.1:PORT --screenshots TASK_OUTPUT_DIR
```
The existing presentation QA is written for DEV/noncommitting review and must **not** be substituted for a new compiled-review, real-UI-Creator acceptance script. Port and source mapping must reflect each test's required build. If the A2b v7-original fixture is required, materialize the pinned source fixture only for test execution and remove it afterward per its receipt.

Matrix for **new** integrated Chromium checks: new/disposable account, World empty->Create->owner receipt->ready card, close/reopen/password sign-in exact same World, remembered session list-only and enforced reauth for write; one-World quota, same IDs exact retry after dropped response, double-submit, two tabs, account separation, stale session/logout/account reset; missing/altered source, orphan/corrupt World or receipt, aborted/quota write; exact v7 migration and v8 archive restore with native-v3 ready/retired Save unchanged; zero character/Save/World simulation mutations; default Classic and non-review URLs cannot Create. Five viewport widths 1440/1280/768/375/320 and both themes, heading focus, Back/Home, scroll/reachability, keyboard/a11y. Capture retained graph digest, source IDs, tests/commands and any failures.

**Stop before acceptance** if compiled review entry cannot be securely gated, original owner/adapter cannot be used, unresolved intents would be overwritten, source manifest changes without successor, World/receipt/source mismatch is rendered as empty or success, boot/recovery safeguards regress, or production/default route becomes capable of writes. Do not merge PR102, touch master or PR103, modify map worktree, change game version or implement gameplay loading.

**Pass label when and only when integrated Chromium accepts actual UI creation and restart readback:** `UI_A3B_FUNCTIONAL_WORLD_CREATION_REVIEW_ACCEPTED`. Until then use `UI_A3B_INTEGRATION_HELD`.
