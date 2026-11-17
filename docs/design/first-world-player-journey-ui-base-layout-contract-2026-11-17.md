# First World: player journey UI base layout and owner-connected component contract

> **2026-11-17 owner-directed contextual-shell and character-entry extension:** [The latest contextual launcher + original creator + branching World Entry contract](first-world-contextual-launcher-shell-and-branching-entry-ui-contract-2026-11-17.md) supersedes this document's *always-visible World sidebar* sketches and prior green standalone preview where they conflict. Splash/login/auth/Welcome/progression selection and story/fail scenes have **no left rail**; Worlds/Overview have the relevant existing launcher sections; **real character creation keeps the already implemented eight-stage step rail**, not a new speculative creator form. Keep account/time controls in a small contextual top bar. The newer integrated charcoal/bronze/parchment HTML preview passed isolated Chromium flow/branch/mobile review, but remains **design-only, not production UI or Save acceptance**.

Date: 2026-11-17 (America/New_York)  
Status: **OWNER-DIRECTED UI BASE LAYOUT / CONNECTOR-STAGED REVIEWABLE PROTOTYPE / PRODUCTION UI NOT IMPLEMENTED**  
Inspected source before this layout document: `master` `d0c46b36fea0a5492370358dbae3b7ca8d6a40c7`, draft PR [#102](https://github.com/vagabond1215/Lineage_Reforged/pull/102) `d3cd548f6b21aff11c40637c3e16026502f8e6e2`.  
Parent authority: [player-first World Creator and gameplay mode](first-world-player-first-world-creator-and-library-implementation-gate-2026-11-17.md); [World/Character owner plan](welcome-world-library-character-entry-and-loading-plan-2026-11-11.md); [L2→L10 playable gate](first-world-playable-vertical-slice-implementation-plan-2026-11-17.md).  
No code, Save, DB, content, runtime switch, account, production launcher or PR #102 implementation is changed by this document.

## 1. Purpose, reviewable artifact and honesty contract

Specify an implementable, responsive **UI base layout** for the actual player journey:

```text
Account sign-in/register [reuse current LocalAccountAccessScreen]
  → Welcome / choose progression [reuse current WelcomeScreen]
  → Your Worlds [NEW WorldLibraryScreen]
      → Create New World [NEW WorldCreatorScreen]
          → World Overview [NEW WorldOverviewScreen]
      → Select existing World [same WorldOverviewScreen]
  → Characters *in the selected World* [NEW WorldCharacterLibraryScreen or WorldOverview roster]
      → New character → existing CharacterCreationScreen, under verified World context
      → Existing character → verified accepted head / Continue
  → Existing InGameShell, loaded using exact associated World/character/campaign/Save state.
```

A separate **standalone HTML layout-review prototype** was generated in the user conversation (not committed to game source). It contains **only in-memory sample records and client-only navigation**, never IndexedDB/localStorage writes, authentication, real engine calls, real Save loading, market changes or game-time ticks. The prototype is not a certified React implementation or a substitute for World creation acceptance. Sample World names and character identities are illustrative, not authored canon and **must not** become shipped fixtures.

At initial real implementation, do not replace `WORLD_LIBRARY_GATE` until its genuine World owner is accepted. Presentational components may be implemented and typechecked in an isolated Codex checkout behind a private QA screen **only if that route cannot create a World, mutate production stores, or misrepresent demo data as durable**. Wire actual creation/selection only after L3 real Chromium atomic-world parity gates. No feature activation follows from a successful layout screenshot.

## 2. Design system and reuse

Keep the established Lineage launcher shell and native-v3 campaign owner intact. Favor existing components over an invented launcher:

- `apps/rpg-ui/src/game-shell/components/AppShell.tsx`: `AppShell`, `TopBar`, `ShellSubBar`, `SidebarNav`, `ShellContent`. Top/account/notification structure and scroll ownership remain canonical.
- `ShellBrandLogo.tsx`, `LauncherSpriteClock.tsx`, `NoticeBanner.tsx`, `NoticeToast.tsx`, `LocalAccountAccessScreen.tsx` and `WelcomeScreen.tsx`: reuse rather than duplicating login, account, brand or clock state.
- `apps/rpg-ui/src/index.css`: theme variables, panel surfaces, borders, display font and launcher textures are the source of truth. Map the standalone prototype's forest-green/bronze presentation to **existing themed tokens** for production; do **not** paste standalone fixed colors or create a parallel light/dark palette.
- `MainMenuScreen.tsx` is an **information-density reference**, not the World registry. It displays SaveSlotSummary rows and a global latest Save. The World Library must not reuse it as a fake World list, and the World-scoped character roster must not equate Save addresses to character IDs.
- Use the same basic spacing, forged controls, radius, focus ring, typography hierarchy and account dropdown as the current launcher. No new PNG/art generation or placeholder atlas screenshot is required for the functional shell.

## 3. Desktop layout and navigation surfaces

Base desktop >= 1100 CSS px, content width constrained by canonical ShellContent, existing launcher left rail.

```text
┌────────────────────── top bar: Lineage logo ────────────── Account / Logout ─┐
│ breadcrumb: Welcome / Your Worlds / selected World / Character               │
├────── left rail ────┬────────────────────────────────────────────────────────┤
│ Worlds              │  YOUR WORLDS                         [+ Create New World]│
│ Characters          │  intro + exact storage-error/empty/loading state       │
│  (selected World)   │  ┌────────────────────┐ ┌────────────────────┐          │
│ Chronicles (later)  │  │ World name, banner │ │ World name, banner │          │
│ Settings            │  │ Individual/Mortal  │ │ status/character # │          │
│                     │  │ [Open World]       │ │ [Open World]       │          │
│ selected World ID   │  └────────────────────┘ └────────────────────┘          │
└─────────────────────┴────────────────────────────────────────────────────────┘
```

**World Library:** two-column grid where available width permits; each card is a *World instance* with actual `worldInstanceId`, user display name, authored atlas label, progression `Chronicle`, `worldKind`/Gameplay Mode, supported difficulty/Hardcore posture, owner-verified active character count, real World status and permitted Open World action. Never show a fake numeric creation/date/count. The CTA is disabled with an explanation when quota, runtime ownership, stale session or unsupported schema prevents creation. A World with zero characters is valid and has its own card. World card selection **opens the World** but does not load gameplay or choose a character.

**World Creator desktop:** primary left form (roughly two-thirds width) plus right sticky World-summary panel (roughly one-third), stacked at narrower widths. Header `Create a World`, canonical Back to Worlds and compact description: player creates a **new World history**, not random geography. Fields in order: World name; **Gameplay Mode** two prominent cards; Difficulty; Hardcore; advanced World customization Coming Soon; validation/Cancel/Create footer. Right panel: read-only First World atlas identity, Chronicle progression, fixed default scenario, selected Individual mode, Mortal, Hardcore Off, Heroic World / Normal Stakes. Summary is derived from **validated owner/supported option values**, not independent draft truth.

**Gameplay Mode layout:**

| Card | Icon/copy emphasis | Initial control state |
| --- | --- | --- |
| **Individual World** | **RPG-first**; one active playable POV character, real adventuring, a lived lineage, later sequential heir progression | Selected, enabled only if the approved World owner/creation path is ready |
| **Living World** | **Simulation/Settlement**; multiple simultaneously retained playable characters in one shared clock/economy/history, perspective switching, authorized town management and jobs | Visibly **Coming Soon**, disabled; no submit payload or selectable `living` enum until separate owner acceptance |

`Chronicle/Persistent` progression is not the same setting as `Individual/Living` gameplay mode. `Mortal` difficulty is the initial supported selection; Favored/Forsaken and Story require real effective-engine propagation. Hardcore is Off/Coming Soon, not a working toggle; climate variation, wet/dry intensity and hazard-family settings are only a **single summary or collapsed informational disclosure**, not enabled fake sliders. Show one default actual Scenario and authored blueprint rather than interactive global scenario/map editors.

**World Overview:** World identity/mode banner; status and revision/clock only if owner-backed; visible `Characters in this World` section; truthful New Character action; owner-backed roster cards. Distinguish character status (playable, terminal, pending, corrupt, incompatible, unassociated) rather than hiding failure as no characters. One current Individual POV/head must be explicit. `Continue` only when one valid verified target is selected; otherwise `Choose Character`. Later Living has a genuine `Characters` / `Settlements` switch and shared clock/activity status, not a decorative tab for unavailable builder controls.

**Character roster:** each card is an actual `characterId`, name, lineage/role, life/terminal status, last accepted site and **verified eligible campaign head**. Save addresses are details **below** character identity; 128 manual Save slots are not 128 characters. No global latest-Save shortcut which might cross Worlds. Create Character opens the existing creator under exact verified World account/revision/mode context and returns to the **same World** on Back.

## 4. Mobile and tablet behavior

| Width | Navigation | Library | Creator | World Overview |
| --- | --- | --- | --- | --- |
| **375px** phone | Existing shell's compact top bar; horizontally scrollable/compact sectional navigation, large tap targets, back breadcrumb can wrap/truncate without hiding World context | Single card column and full-width New World button | Name first; full-width stacked Individual/Living cards, compact difficulty chips, Hardcore row; right summary moves *below* form | World banner and roster stack vertically; primary character action remains visible without horizontal overflow |
| **768px** tablet | Reuse AppShell responsive side-rail behavior; avoid duplicate nested rails | One/two columns depending available content width; CTA remains accessible | One-column form then summary unless measured room permits two columns | Single-column roster or comfortable tablet rows |
| **1280px** desktop | Existing left side rail and top account shell | Two cards/row; generous text margins | Two-column form + sticky summary | World/character roster with account-scoped navigation |

The page must work at 320px as a separate stress condition. Do not use sticky side summary if it collides with the launcher header, traps focus or occludes primary submit. Height-constrained 375×667 portrait requires the form to scroll normally and keep any sticky controls optional; the selected World and submission feedback must remain readable. No horizontal browser scroll, inaccessible overflow, hover-only controls, or icon-only actions without labels.

## 5. Screen ownership and safe integration contract

| Proposed component or state | Source owner / props | What must **not** happen |
| --- | --- | --- |
| `WORLD_LIBRARY` / `WorldLibraryScreen.tsx` | World index records from accepted v8 owner, account session, loading/error disposition, create/select/back/logout handlers | No fallback to Save slots or default fake World after failed read |
| `WORLD_CREATE` / `WorldCreatorScreen.tsx` | Supported immutable rules manifest, source/fingerprint status, user name draft, stable creation intent, validation/commit result | No local-only World/rules saved in preferences, no cosmetic allowed-but-ignored Hardcore or Living switch |
| `WORLD_OVERVIEW` / `WorldOverviewScreen.tsx` | Exact owner-read World record/revision, character association summary, verified scope/status | No clock tick or character load on mere World selection |
| `WORLD_CHARACTERS` / World-scoped roster | Selected account/world ID + revisioned character/Save association owner, classified heads | No 128-slot global Save list posing as independent characters; no cross-account/World leakage |
| Existing `CHARACTER_CREATION` | Reuse current form with **verified World binding** and accepted start area/mode | No independent override of World Hardcore or gameplay mode |
| Existing `IN_GAME` | Reuse native-v3 Save authority, only via accepted World→character→campaign link | No new second Save engine, fabricated economy, rerolled World on resume |

Use typed projections/views. `worldInstanceId` must be supplied from a verified owner record and revalidated on actions; never inferred from map/region/Save title. Distinguish **selected-world scope** from durable World state, from a Login session hint, and from an unsaved form draft. UI can keep a *temporary* selected ID in React state while mounted, but the next owner action must revalidate account lifecycle/revision, World revision/head and available privileges. Signing out clears all selected World/character hints. Two tabs do not grant separate World history copies.

**Actions:** `Continue Chronicle` → World Library, `Create New World` → Creator (if owner ready), `Create` → atomic exact source-bound create/readback or classified error, `Open World` → Overview, `Create Character` → existing creator with World contract, `Select Character` → eligible accepted head, `Play` → actual authoritative gameplay. A disabled UI button alone does **not** enforce owner authorization; actual write handlers fail closed for unsupported Living, Hardcore, difficulty and World quota.

**Visual state taxonomy** required by every new view: `loading`, `ready_empty`, `ready_populated`, `blocked_storage`, `incompatible_schema`, `corrupt_world`, `stale_session`, `stale_revision`, `quota_reached`, `commit_pending`, `readback_failed`. Use accessible human copy and safe retry/cancel/back; never convert source/owner failure to empty library or successful World creation.

## 6. Prototype-only acceptance recorded, not app acceptance

A standalone locally generated HTML layout-review prototype was tested using Python Playwright + system Chromium 144 in an isolated **`page.set_content`** context (the browser in this environment blocks navigation to both `file://` and `http://127.0.0.1`). This is **not** a locally served `EpochApp` instance and does not run engine/World/Save APIs. Exact representative checks:

| Review gate | 1280×850 | 768×980 | 375×812 |
| --- | --- | --- | --- |
| World Library visible with two explicit **sample** Worlds | PASS | PASS | PASS |
| Create New World → Creator layout with selected Individual and **disabled** Living | PASS | PASS | PASS |
| Required World-name validation and in-memory demo-world creation → empty character roster | PASS | PASS | PASS |
| Character entry/back chain, disabled real character action | PASS | PASS | PASS |
| Empty-account preview and return to sample World list | PASS | PASS | PASS |
| No horizontal document overflow and no JavaScript page errors | PASS | PASS | PASS |

These checks validate only the **reviewable UI behavior and responsive presentation**. In-memory demo records disappear on refresh; they do not prove durable create/Save, real tab races, exact Chronicle economy, native-v3 migrations, accessible screen reader behavior, actual hosted UI or business semantics.

At the inspected starting `master`, historical geography guard #44180817938 was **PASS**, and draft PR #102's historical v8 synthetic/read-only Chromium migration CI #44128790998 was **PASS** at `d3cd548f`. They do not cover this prototype or real World creation.

## 7. Next authenticated implementation/test work

1. **Baseline and head:** independently fetch/prune, confirm exact master/PR history and clean checkout before modifying a source file; run current L2/World, launcher/native-v3 regression, typecheck/build and PR v8 tests, record actual results/deltas.
2. **Small additive UI presentation slice, isolated behind a QA entry:** implement the proposed React component *layout* using existing `AppShell` and theme tokens; typecheck/build; add component-level empty/populated/loading/fault/disabled option tests and browser layout tests at 375/768/1280. Do not mutate production/owner data or enable World create. This can be developed in parallel with the L3b *source-owner* repair only if branch/file ownership is disjoint and reviewed.
3. **L3b owner acceptance still mandatory before functionality:** source-verified browser-safe engine tick-zero equality; full source-set/seed/scenario/rules World+receipt; real Chromium atomic create/retry/reopen/failures; >1 World when multi-World accepted; archive/native-v3 parity and safe account deletion.
4. **Bind real owner adapters to UI:** only after step 3, wire Create/List/Open and World Overview under existing feature-on dev gate; use real data and fail-closed errors, keep the feature-OFF launcher path unchanged.
5. **Bind character and selected gameplay:** after approved World→character/Save association, wire existing creator and selected in-game route and prove save/restart, World isolation and no duplicate clock/economy; then independent selected 375/768/1280 accessibility/keyboard/click/readback acceptance.
6. **Separate Living World milestone:** real two-actor simultaneous state, one clock/economy, verified settlement builder command, actor switching, shared resource/clock correctness, stale tab and safe archive/restart. Disabled card remains honest until these tests pass.

No fake avatar/game-play preview is sufficient for a feature-on claim. Track `PASS/FAIL/NOT_RUN` at the exact tested commit. Keep `L3B_BROWSER_CREATE_HELD`, `HOLD_SELECTED_ATOMIC_ACTIVATION` and `HOLD_STAGING_PUBLICATION` until real executable ownership gates are met.

## 8. Review findings to carry forward

**Player-understandable hierarchy:** World Library is not a Save-slot list; World Creator changes rules and names, not authored geography; a World may be empty; selecting one leads to its own character roster; character selection (not World selection) leads to gameplay. Individual is a playable POV rule, not a one-World-per-account limit. Living means parallel playable actors **inside one World**, not two tabs and not a claim about multiplayer. Simulation/settlement emphasis must eventually include real builder commands.

**UI base layout prepared:** downloadable standalone prototype and three-width screenshots in the current conversation. **Repository source UI remains untouched by this Connector pass**. The next repository-capable Codex slice can implement the component layout with clear hard boundaries while the actual World creation owner is still held.
