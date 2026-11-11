# L1 Implementation Plan: Branded Welcome / Account Gate Before World and Save Selection

Date: 2026-11-11  
Status: **fully scoped planned segment; NOT yet executing. L0 local entry baseline ACCEPTED 2026-11-11; L1-E0 still requires fresh account/Save owner preflight and separate implementation authorization**  
Parent process: [First World Launcher Implementation Process Map](first-world-launcher-implementation-process-map-2026-11-11.md)  
Product target: [Welcome, World Library, Character Entry and Loading](welcome-world-library-character-entry-and-loading-plan-2026-11-11.md)  
Successor: **L2 World identity / persistence owner contract**, not general UI rework.  
External baseline: [L0 accepted local-entry handoff](../dev/first-world-launcher-l0-local-entry-handoff-2026-11-11.md). The [native-v3 Codex prompt](../dev/current-codex-prompt.md) is marked completed; do not rerun or replace it as part of this documentation-only pass.

> **Segment objective:** give every app launch a distinct branded **Welcome** before character Save slots. A signed-out player can select/create and sign into an existing local account with the current verified owner; a persistently signed-in player sees the verified account display name and **Continue / Logout**. **Continue never directly loads a Save** in the new flow. Because no durable World Library yet exists, this segment is **not a production navigation cutover**. All new wiring stays behind a disabled-by-default, test-only feature gate. The real Continue → World Library list/create path is completed and activated in L3-L4.

## 1. Entry-point decision: accept L0 or stop without source edits

### L1-E0: external gate

Required:
1. Verify installed `docs/dev/current-codex-prompt.md` status at execution time and the exact synchronized `master` SHA; inspect worktree and other active task owners.
2. L0 must have **ACCEPTED** a registered, retained and independently reachable Vite process; observed direct and controlled-browser ordinary development entry on exact master and correct compiled preview selection. This prerequisite is **now met for the local-entry baseline only** by the [2026-11-11 L0 handoff](../dev/first-world-launcher-l0-local-entry-handoff-2026-11-11.md) and its [version-specific browser evidence](../dev/native-v3-exact-master-version-selection-accepted-2026-11-11.md). Do not promote this into full gameplay/Save acceptance, selected-client activation or hosting approval.
3. Confirm current native-v3 account/session/Save read/write source contracts and existing tests; record baseline typecheck/build issues before modifications, using synthetic/disposable account storage and authorized loopback only.
4. Confirm L1 is independently scheduled/authorized **after** the prior Codex prompt's completed L0 gate. This L0 documentation handoff is not L1 source implementation authorization; do not replace the completed prompt or create a competing execution route without the separately approved L1 task. Do not switch activation/deployment flags or change the hosted Site.
5. Record bounded changed-file list, source/branch identity, expected UI gate and rollback instructions.

**If any condition fails:** result is `L1_ENTRY_HELD` with exact missing evidence. No UI, state, account, Save or Dev server modifications. No generic retries of an unchanged blocked environment.

### L1-E1: inputs and existing owners to reuse

| Existing source | Reuse decision | Notes / prohibited reuse |
| --- | --- | --- |
| `apps/rpg-ui/src/game-shell/cleanEpochAccountAdapter.ts` | **Reuse directly** `register`, `signIn`, `selectSession`, `validateSession` | Credential verifier and epoch hint handling stay here. Do not add password storage, another account ID generator, a new browser auth cookie or localStorage world index. |
| `apps/rpg-ui/src/game-shell/cleanEpochLauncherRead.ts` | **Reuse directly** `bootstrap` and `inventory` for safe account/session read | Existing bootstrap checks account + all slot statuses. A new cosmetic Welcome must not convert a blocked inventory into `No Worlds` or silently skip pending-consumer recovery. |
| `apps/rpg-ui/src/EpochApp.tsx` | **Narrow routing changes** at boot, sign-in, registration, logout, Continue/render branching | Preserve `recoverPendingInventory`, `showMenu`, real load/save/retire functions, current exact native-v3 selected source route. Guard any new UI mode behind explicit development opt-in. |
| `apps/rpg-ui/src/game-shell/state.ts` | **Add explicit state/actions** without rewriting Save-slot schema | Keep existing `ACCOUNT_ACCESS` and `MAIN_MENU` actions for old path; no `worldId` fabricated from slot. |
| `apps/rpg-ui/src/game-shell/components/LocalAccountAccessScreen.tsx` | **Reuse login form logic and account lifecycle UI** | It currently renders a whole screen, including backup/import/account deletion. Prefer a narrow presentation variant or extracted reusable panel with **same callbacks/state/error semantics** rather than duplicate credential forms. Don't discard existing advanced operations. |
| `apps/rpg-ui/src/game-shell/components/ShellBrandLogo.tsx` | **Reuse brand asset/fallback** | The existing logo is `/branding/lineage-reforged-logo-dark-no-icon-framed.png`; handle load failure with readable text. Styling may enlarge it for splash; do not assume a new licensed image is available. |
| `AppShell.tsx`, `ScreenFrame.tsx`, existing `Card`, `Icon`, `NoticeBanner` | Reuse where visually appropriate, no forced full-shell rewrite | Welcome deliberately can opt out of gameplay left rail. Use consistent colors and focus handling. |
| `MainMenuScreen.tsx`, `LoadGameScreen.tsx`, `cleanEpochFirstCampaignAdapter.ts`, `cleanEpochDescendantAdapter.ts`, `cleanEpochAccountStore.ts` | **Preserve, do not modify in L1** unless a focused test exposes an independently approved safety defect | Existing Save/access/account-meta features must remain reachable on the old route; no World registry or migration here. |
| Legacy `launcherAuthManager.ts`, `App.tsx`, unrelated game shells | **No changes** | Legacy auth tests may be regression evidence, not evidence of native-v3 sign-in correctness. |

## 2. New routing contract and interim feature-gate posture

### 2.1 Intended observable states

```text
Existing normal route (feature disabled, shipping)
  boot → ACCOUNT_ACCESS or MAIN_MENU → current characters/Save route, unchanged

L1 isolated development route (feature enabled only in approved synthetic test)
  boot/recovery
    ├─ blocked → current safe blocked error; never "empty account/world"
    ├─ signed out → ACCOUNT_ACCESS with welcome-branded presentation
    └─ validated persistent session → WELCOME_AUTHENTICATED
                                     ├─ Logout → ACCOUNT_ACCESS welcome
                                     └─ Continue → WORLD_LIBRARY_GATE
                                                   ├─ label "WORLDS" + truthful
                                                   │  "World Library not ready"
                                                   └─ Back → WELCOME_AUTHENTICATED

Login/create success → WELCOME_AUTHENTICATED (not MAIN_MENU, not an auto-loaded Save)
Login failure → remain on ACCOUNT_ACCESS with field-appropriate error
```

The `WORLD_LIBRARY_GATE` is a **temporary explicit unavailable state only within the isolated feature flag**. It has **zero invented world cards** and no Create World, Prestige purchase, Save slot, terrain editor or automatic world mutation. L3/L4 replace it with a real world-index consumer. In release builds the flag remains off until L4 has passed and an explicit cutover is separately approved. Do not expose a dead-end beta menu to the normal player. Avoid a persisted user-toggle in account/session localStorage.

### 2.2 Proposed typed state/actions (illustrative, not schema approval)

```ts
type WelcomeAuthenticatedState = SignedInGameShellBaseState & {
  screen: 'WELCOME_AUTHENTICATED';
};

type WorldLibraryGateState = SignedInGameShellBaseState & {
  screen: 'WORLD_LIBRARY_GATE'; // gated dev shell; removed/replaced by L4
};

type NewLauncherAction =
  | { type: 'SHOW_AUTHENTICATED_WELCOME';
      launcherSession: LauncherRuntimeSession;
      accountProfile: AccountProfileState;
      slots: SaveSlotSummary[];
      notice: GameShellNotice | null }
  | { type: 'OPEN_WORLD_LIBRARY_GATE' }
  | { type: 'RETURN_TO_AUTHENTICATED_WELCOME' };
```

Keep the existing reducer's explicit discriminant guards. `OPEN_WORLD_LIBRARY_GATE` is valid **only** from authenticated Welcome with fresh owner/session validation in the calling boundary; reducer should additionally reject illegal source states. Do not add a free-form string `currentPage` stored outside this state graph. Add a pure routing selector if it helps shared bootstrap and sign-in paths select the same destination, rather than duplicating conditional logic in three closures.

New UI state is ephemeral presentation. No `worldInstanceId`, `selectedCharacterId`, `saveSlotId` or `hero art selected` should be written to campaign records in L1.

### 2.3 Exact UI behavior

**Signed out Welcome:**
- Large visible Lineage Reborn logo and atmospheric background treatment. Source existing asset and CSS, not a new mandatory generated asset; keep decorative image out of screen-reader reading order.
- Prominent labeled `Log In` panel with existing local account selection, password field, `Stay signed in`, `Create Account` flow. Preserve existing validation and pending/disabled state.
- Keep existing `Import Backup`, account deletion/reset or advanced account administration discoverable through an appropriately labeled advanced section or existing route; never silently drop management features during a visual restyle.
- If no local accounts exist, show create-first-account immediately. If picker exists, don't default/guess a selected account from a stale session. Do not expose credential verifier data to UI.
- Failed verification shows existing owner-provided message. No branded UI "success" unless underlying sign-in/registration returned `ready`.

**Signed in Welcome:**
- `Welcome back, {account.profile.displayName}` with verified account owner; large **Continue** primary, **Logout** secondary. Optional Settings only if existing route works and does not show Save slots in this screen.
- Name from accepted profile readback, never `localStorage` or account-picker cached row alone. Responsive text wraps, no horizontal clipping.
- No Save-slot cards, latest character, starting bundle, Create Character button, or world cards on Welcome.
- Continue rechecks session via `CleanEpochAccountAdapter.validateSession` (and any required owner readback for current world-transition state), then transitions to the explicit World Library boundary. It does **not** call `loadLatest`, `enter`, `prepare`, `createNewGameSnapshot`, or change the world clock.
- Logout reuses the already implemented `EpochApp.logout` semantics: clear/check the single epoch session hint, reset selected source/head references, rebuild the signed-out picker. Do not replace with `deleteAccount`, `resetAccount`, `resetAllSaves` or a second credential handler. On hint-clear failure do not claim successful logout.

**World Library gate (L1 only):**
- A visible `WORLDS / THE ATLAS` title, no slot-like cards, explanation that this development path is awaiting world registry, and `Back to Welcome`.
- No suggested saved-world identities, no “Empty world list” assertion from an unavailable registry, no enabled World Creation, no Prestige charge, no character Load.
- On invalidated session, block/revalidate or return to signed-out entry as the account owner permits. Never render old account name after switching account.

**Accessibility / presentation:**
- Keyboard: Tab reaches account controls, Enter submits valid forms, Escape never loses typed password unexpectedly, logical focus returns on back/login error, disabled buttons genuinely disabled.
- Screen readers: proper heading hierarchy, account panel label, errors associated with inputs, loading announcement, no hover-only help, decorative artwork hidden.
- Responsive witness at representative phone (375px), tablet (768px) and desktop (1280px+) widths. Logo and account panel visible without clipped primary controls; high contrast in light/dark theme and reduced-motion fallback.
- Use existing `ShellBrandLogo` where possible; provide accessible text if missing or failed image. Ensure no extra blocking font/image download required before login is usable.

## 3. Implementation work breakdown

### L1.00: preflight and test harness (entry and exit)

**Entry:** L0 accepted; no active conflicting work on `EpochApp`, account adapter, Save or launcher state.  
**Change:** record exact baseline source, selected QA routes, API calls, and current normal/development/preview mode selection. Build synthetic accounts/slots fixture with no user data and distinct authentication-session states. Confirm the feature-gate mechanism can only be enabled in isolated development or QA entry and is OFF by default.  
**Tests:** untouched default path boots exactly as before; baseline account sign-in, stay-signed-in and Save inventory all pass or are recorded as preexisting failures.  
**Pass:** scope and feature gate approved, baseline evidence captured.  
**Failure:** blocker/protected data/test harness unavailable → **STOP L1** before editing.

### L1.01: pure state transitions

**Entry:** L1.00 pass.  
**Changes:** add typed authenticated Welcome and gated World Library route to `state.ts`; explicitly preserve all existing cases/actions; add pure routing selector to use from bootstrap and sign-in.  
**Tests:** invalid reducer transition is inert; signed-out cannot open Worlds; login/bootstrap reaches signed-in Welcome only when experimental route is enabled; old `SHOW_MAIN_MENU` remains unchanged.  
**Pass:** stateless/ephemeral routing compile and tests pass; no account/Save schema edited.  
**Failure:** existing in-game action or Save type exhaustive check broken, cross-account route possible → revert this substep.

### L1.02: branded presentation components

**Entry:** L1.01 pass.  
**Changes (suggested):** `components/WelcomeScreen.tsx` / shared `WelcomeBrandFrame.tsx`; presentation-only signed-out variant of `LocalAccountAccessScreen.tsx` or a shared controlled account panel extracted **without changing auth callbacks**; optional `WorldLibraryGateScreen.tsx` preview shell. Reuse `ShellBrandLogo` and existing Card/Notice primitives.  
**Tests:** logo/text, signed-out form, account creation, errors, named welcome, Continue/Logout, Worlds gate and Back; touch/keyboard/mobile.  
**Pass:** no new credential component logic/Save cards on Welcome, advanced account features preserved.  
**Failure:** duplicate form state, unreadable backgrounds, inaccessible controls, lost archive/delete affordance → adjust UI, no activation.

### L1.03: application-level wiring

**Entry:** L1.02 pass; exact session read owners known.  
**Changes:** `EpochApp.tsx` selects new route via **explicit test-only gate**; successful bootstrap with validated session shows authenticated Welcome; sign-in and registration call unchanged `services.accounts.signIn/register` and use `inventory`/readback as currently required, then show authenticated Welcome. Continue calls session-validation boundary before navigation; Logout uses existing logout handler. The old `showMenu`, `loadLatest`, `activateSlot`, native gameplay/Save and `MAIN_MENU` remain intact under old gate.  
**Tests:** two distinct accounts, sign-in failure, signup retry, retained session, no-hint session, account switch, logout, malformed/stale hint, blocked IDB, pending consumer recovery, no implicit Save load.  
**Pass:** old launcher remains bit-for-bit semantically available while new gate routes correctly; no account revision advanced merely by viewing Welcome.  
**Failure:** new gate ever changes Save/slot head, failure becomes fake empty, account identity leaks, credential/retained receipt failure → STOP, restore old gate.

### L1.04: focused tests and negative evidence

**Entry:** L1.03 pass.  
**Changes:** add narrow reducer/route tests (suggested `tests/unit/launcher-welcome-routing.test.mjs`), extend **native epoch** test suite/QA rather than validating only old `launcherAuthManager`; if browser QA is used, give it a unique task-scoped synthetic IndexedDB database and cleanup its own records only.  
**Positive tests:** every pass row in Section 4, including repeat sign-in/logout and refresh.  
**Negative tests:** corrupt hint, invalid password, blocked IDB, stale lifecycle generation, an existing pending/closed slot, cross-account switch, empty account set and session hint clear failure.  
**Pass:** all newly added tests pass; known baseline tests unchanged; typecheck/build results compared to baseline.  
**Failure:** any data-integrity negative unexpectedly succeeds → not ready even if rendering passes.

### L1.05: exact-source browser witness and independent acceptance

**Entry:** registered Vite launch and source inspection gate proven for this exact revision, synthetic-only QA data.  
**Actions:** capture desktop/mobile screenshots and browser observations of signed-out Welcome, authenticated Welcome and explicit World's unavailable gate; validate keyboard focus/reader labels, navigation, logout/back/refresh. Repeat with feature flag **off** to prove old launcher Save/character path works without migration. Build the exact commit; select native-v3 ordinary dev route only as authorized, **not** hosted/default activation.  
**Pass:** selected browser evidence names exact commit and step outcomes, no unknown server; recorded `L1_ACCEPTED_ISOLATED`.  
**Failure:** browser unavailable → `L1_CODE_READY_BROWSER_HELD`. Do not call L1 accepted. Record, clean only independently verified task-owned processes/tabs.

### L1.06: cleanup, commit, and L2 handoff

**Entry:** L1.05 accepted isolated.  
**Cleanup:** remove unreachable **new** test/scaffold code, stale duplicate UI helpers only if references and tests prove them unused; do not delete existing MainMenu, backup/import handlers, CleanEpoch AccountAdapter, Save paths, or historical design documentation. Put dated supersession pointer into any old doc or comment that still explicitly says *logged-in app boot opens Save slots* as the new product rule; avoid blanket replacement of historical factual assertions. Do not edit active Codex prompt or branch disposition without explicit task authority.  
**Exit:** clean changed-file diff, tests/evidence, scoped git commit/readback, one L1 decision record, feature gate still OFF in normal/hosted, and precise next-stage L2 entry contract.  
**Failure:** unexpected file deletion, new world/Save schema mutation, no exact commit/readback → do not hand off.

## 4. Acceptance matrix with precise outcome

| Test ID | Input / scenario | Pass criterion | Fail criterion |
| --- | --- | --- | --- |
| `L1-A01` | No stored accounts on fresh disposable origin | Signed-out branded Welcome shows create-first-account with visible form | Auto-creates default identity or shows fake signed-in welcome |
| `L1-A02` | Existing accounts, no persistent hint | Account chooser/password shown; no account assumed | Shows previous account name or Save slots |
| `L1-A03` | Correct credentials, stay-signed-in TRUE | Auth owner `ready`; named Welcome; after restart returns named Welcome | Auto-enters world/game, displays wrong account, or password copied to another store |
| `L1-A04` | Correct credentials, stay-signed-in FALSE | Named Welcome this session; full restart requires account picker | Persists signed-in session contrary to choice |
| `L1-A05` | Wrong password / mismatched create confirmation | Account panel remains, explicit owner failure; no world/Save/head mutation | Success toast, change to wrong user, durable write |
| `L1-A06` | Malformed or stale session hint | Blocked/recoverable auth result per owner; no fake empty account | Silently builds fresh account or passes Continue |
| `L1-A07` | Session invalidated after Welcome renders | Continue revalidation blocks until safe refresh/re-auth | Opens Worlds or old Save despite invalid session |
| `L1-A08` | Signed-in Continue in gated path | Shows `WORLDS` unavailable gate and Back, not character-slot list | Invokes `loadLatest`, `enter`, `prepare`, or claims real world exists |
| `L1-A09` | Back from Worlds gate | Returns to same validated Welcome/account, no world tick | Creates, mutates or loads a character |
| `L1-A10` | Logout | Epoch hint absence read back, signed-out UI and transient choices cleared, world/Saves intact | Erases account/world/slot data or falsely reports success on removal failure |
| `L1-A11` | Switch between two disposable accounts | No stale name/picker/selection/slot leak | First account identity visible after switch |
| `L1-A12` | Known pending/corrupt/incompatible slot or IndexedDB unavailable | Prior owner recovery/block status preserved; no fake “No worlds” | Reclassifies failure as empty or creates a replacement Save |
| `L1-A13` | Feature flag OFF (normal route) | Existing `ACCOUNT_ACCESS → MAIN_MENU → Save` works exactly as before | New menu steals/defaults Continue or blocks old Save |
| `L1-A14` | Desktop/mobile keyboard and theme | All essential controls legible, focus reachable and form error announced | Logo clips login, background obscures form, pointer-only login |
| `L1-A15` | Source/type/build/reload evidence | Focused native epoch QA, new tests and required type/build complete or baseline deltas explicitly reported; selected browser proven | Claim based on screenshots/prototypes alone, unregistered Vite or unverified commit |

**Minimum stage acceptance is all applicable rows passing**. Any unrun required row is **HOLD**, not automatically omitted. If a current code prerequisite itself fails, record the specific external gate and preserve source untouched.

## 5. Required test/verification commands and sources

Choose commands against actual package scripts, not invented CI aliases:

```sh
# Read/record exact source baseline first. Run only in an authorized checkout.
git fetch origin
git rev-parse HEAD
git status --short
git diff --check

# Contract-focused Node tests (existing old auth tests are regression only).
node --test tests/unit/launcher-auth.test.mjs

# UI Node TypeScript and compile/build routes recorded in package scripts.
npm --prefix ./apps/rpg-ui run typecheck:node
npm --prefix ./apps/rpg-ui run typecheck
npm --prefix ./apps/rpg-ui run build
```

Native epoch-specific browser QA sources to **reuse/extend**: `apps/rpg-ui/campaign-clean-epoch-account-adapter-qa.ts`, `apps/rpg-ui/campaign-clean-epoch-launcher-read-qa.ts`, and existing exact selected-session browser coverage. Their browser entrypoints/harness must be confirmed at implementation time; do not assume running a `.ts` QA source directly via Node is an executable script. Broad `npm test` may be run when safe, but a recorded preexisting failure must be compared and not erased for the sake of a green display. Node/UI typecheck and Vite build are separate reported gates; do not claim a combined `build` pass if typecheck is baseline-blocked.

**Selected browser procedure:** authorized registered Vite → direct HTTP proof → controlled-browser direct navigation → synthetic account/create/sign-in → persistent reload → Worlds gate → back → logout → mobile/keyboard → feature flag OFF original menu/Save witness → stop only identified task-owned processes and cleanup task fixture, record evidence.

## 6. Release/rollback and data safety

- **Rollout:** code can be merged after accepted isolated review if separately approved, but keep experimental launcher disabled for normal/default and hosted until **L3-L4 World Library exists** and full L10 rollout approval. No new world/card data is written in L1.
- **Rollback:** switch OFF the development feature flag and restore existing launcher entry; no schema migration or data rollback should be necessary. Do not delete created accounts, old slots, active Saves or archived history on reverting UI.
- **If L1 fails after partial commits:** revert only explicitly identified L1 UI/state/test source commits using normal reviewed Git practices. Do not reset the whole repository, overwrite unrelated Codex work or purge user data. Keep evidence of blocked test and exact source.
- **User-facing wording:** new screens should never promise World Creation/Selection is implemented until L3-L4 evidence passes. Optional art loading must not gate login; malformed session/storage should surface a protective block, not a new account.
- **Security:** local password stays in existing form-to-adapter call only. All screenshots, browser logs and docs use synthetic credentials and redact identifiers where appropriate.

## 7. Completion checklist and exact next segment seed

Before declaring `L1_ACCEPTED_ISOLATED`, attach a dated stage evidence record with:
- [ ] exact synchronized SHA, source diff and current active external gate/holds
- [ ] present account/session boot read and recovery path preserved
- [ ] `ACCOUNT_ACCESS` retains old credential/backup/delete semantics
- [ ] persistent validated account shows signed-in Welcome with correct name
- [ ] Continue targets explicit Worlds boundary, never slot load
- [ ] world boundary accurately unavailable with no fake instances
- [ ] logout and account switch clear transient state without deleting data
- [ ] feature OFF preserves current launcher to game journey
- [ ] all L1-A01...L1-A15 results and browser/keyboard viewport evidence
- [ ] clean scoped changes, no altered credentials, Save formats, account store, Codex prompt, deployment or Game version
- [ ] accepted commit/readback and rollback flag verified

**L2 entry packet the L1 owner must prepare:**
1. Current `CleanEpochAccountStore` object-store/record key architecture, account lifecycle/revision contract, backup/archive/export/import schema and crash recovery.
2. Existing campaign/continuity/character/artifact/slot identities and whether snapshot content currently contains any trustworthy `worldId` or not; do not infer from `worldState`.
3. Requirements for a newly named and **empty** First World instance, dedicated Individual World clock/head, world-to-campaign association, account ownership, archive/reset/delete semantics and any versioned migration.
4. Exact negative cases: two accounts, one world with no character, accepted first world created twice by retry, stale revision, pending native-v3 Save, world deleted/recovered, world content version unavailable, same-name worlds, no fake cross-world roster.
5. A full **L2 decision** selecting where world registry records live (new store or versioned extension), atomic publication/expected revision and retained receipt identity, with explicit reasons for rejected parallel stores/mapping; **L3 must not implement until L2 is approved**.
6. World Library UI contract to consume from that owner in L4. The temporary L1 `WORLD_LIBRARY_GATE` must be removed or transformed only after the new read API is verifiably ready; flag remains disabled meanwhile.

**Scope close:** This file is a detailed execution plan, not a claim that work L1 is complete. It did not edit runtime source, run browser tests, add world records, clear activation/publication holds, change current Codex instructions or deploy the Site.
