# First World: contextual launcher shell, original character creator and branching World Entry

> **2026-11-17 focused follow-up:** [Detailed insertion plan: existing eight-step Character Creator → Finalize handoff → post-creator branching World Entry](character-creator-post-finalize-world-entry-integration-plan-2026-11-17.md) is the implementation-level UI/source/acceptance authority for this seam. It confirms from current `CleanEpochFirstCampaignAdapter` that even `first.prepare()` writes a retained attempt and reserves a Save slot, so story preview/failure cannot call it. Retain the current eight-step creator and feature-off `Begin Journey`; introduce rail-free story and 0/100 result only on approved World-bound path, with exact-once first publication after successful authored opening.

Date: 2026-11-17 (America/New_York)  
Status: **Owner-directed UX decision / integrated standalone browser layout preview / production integration NOT_RUN**  
Read and compared at `master` `9203501780d1463bc6c2464f6cfad1df61bd55bc`; draft [PR #102](https://github.com/vagabond1215/Lineage_Reforged/pull/102) at `d3cd548f6b21aff11c40637c3e16026502f8e6e2`, open/unmerged.  
Companion: [World journey base-layout contract](first-world-player-journey-ui-base-layout-contract-2026-11-17.md), [player-first World Creator / gameplay mode gate](first-world-player-first-world-creator-and-library-implementation-gate-2026-11-17.md), [prior Welcome/World/Character plan](welcome-world-library-character-entry-and-loading-plan-2026-11-11.md), [progression vs World kind](world-progression-modes-hardcore-time-and-cross-mode-currencies-intent-2026-11-12.md).  
Explicit exclusions: no production TSX, CSS, reducer, content schema, Save, World DB, account, renderer, real account/World creation, merge or deployment change in this Connector UX pass.

## 1. User direction and revised screen order

Preserve the **existing Lineage launcher**, not a visually unrelated new World menu. The top bar and left pane are **contextual**. A login/splash experience needs neither a full left rail nor a large menu. Retain the existing authenticating owner and character creator; augment the **post-creator World Entry** with context-dependent narrative scenes, including an optional isekai opening and humorous failure/loop branches.

**Selected implementation routing for now, matching existing signed-in Welcome mode prototype:**

```text
SPLASH  [brand, Log In, Create Account; NO rail]
  ├─ LOG IN [existing account chooser + password owner; NO rail]
  └─ CREATE ACCOUNT [existing account creation owner; NO rail]
      → WELCOME [verified account displayName; NO rail]
      → PROGRESSION MODE [Chronicle selectable only when owner route ready;
                          Persistent disabled/Coming Soon; NO rail]
      → YOUR WORLDS [World Library; contextual launcher rail]
           ├─ CREATE WORLD [World name; Individual active when accepted;
           │                Living disabled; Mortal; Hardcore Off;
           │                same World rail]
           │     → WORLD OVERVIEW [new empty World permitted]
           └─ SELECT WORLD → WORLD OVERVIEW
                                   → CHARACTER LIBRARY [selected World only]
                                      ├─ RESUME selected verified character/head → GAME
                                      └─ NEW FOUNDER / verified eligible heir
                                           → EXISTING CHARACTER CREATOR
                                                [its own eight-step rail]
                                           → optional STORY / WORLD ENTRY PROLOGUE
                                                [NO rail; contextual top bar]
                                                ├─ successful eligible branch
                                                │   → exact-once world/character
                                                │      + scene/Save publication
                                                │   → GAME
                                                └─ refusal / bad karma / loop
                                                    → parody 0/100 prologue rating
                                                    → retry story or return to draft
                                                    [NO actual character/Save/death]
```

This resolves the user's permitted mode-versus-World order by preserving the already-established **Welcome → progression mode → Worlds** route. `progressionMode` is a filter/context for the World Library and is pinned on each created World. Selecting another existing World must use that World's actual progression mode; it cannot silently toggle its immutable rules. `worldKind`/Gameplay Mode is **a different World Creator field**: Individual RPG versus later Living World settlement/multi-actor simulation. Neither axis is a character-level toggle.

A future deliberate World-first routing reversal is a separate UX migration, not needed for the current implementation. The mode surface is skipped only if a later explicit accepted routing decision allows it; never silently infer mode from an unrelated latest Save.

## 2. Source-verified current launcher structure

| Actual component/source | Existing behavior relevant to merge | Intent |
| --- | --- | --- |
| `apps/rpg-ui/src/game-shell/components/AppShell.tsx` | `TopBar` has brand, title, subtitle, center actions, primary actions, account controls and priority status; `AppShell` conditionally creates a **desktop brand corner when brand+sidebar** and otherwise renders one ordinary top bar. `ShellSubBar` and `ShellContent` are optional. At desktop its left rail is `md:w-[18.48rem]`. | Reuse this shell as-is where possible. Absence of `sidebar` means no left pane. Do not duplicate layout primitives or force one rail for every page. |
| `MainMenuScreen.tsx` | Left navigation **Characters / Legacy / Chronicles / Bloodlines / Settings**; top center currently has global most-recent-Save Continue; top right account menu **Settings / Exit / Log Out** and `LauncherSpriteClock`. Its rows are `SaveSlotSummary`, NOT World/character index records. | Preserve the navigation vocabulary as context allows, but do **not** expose global latest-Save Continue before verified World+character scope. Add Worlds as first class where a real World owner is available. |
| `LocalAccountAccessScreen.tsx` | Real account picker/create/password/stay-signed-in/archive, existing theme toggle; it already renders a distinct standalone branded layout. | Keep existing account lifecycle, password and backup protections; simplify only surrounding presentation. No sidebar. Anonymous menu: Settings and Theme, Log In where appropriate; no fictitious Logout. |
| `WelcomeScreen.tsx` | Under gated L1, signed-in Welcome offers Chronicle, disabled Persistent; `WORLD_LIBRARY_GATE` still says World Library unavailable. | Keep signed-in Welcome and progression routing, replace the gate only **after** actual World owner acceptance, never by converting sample cards to real Worlds. |
| `CharacterCreationScreen.tsx` / `CharacterCreationNarrativeScreen.tsx` / `characterCreationForm.ts` | The **current executable creator** has the eight steps **Lineage, Identity, Continent, Region, Settlement, Backstory, Starting Bundle, Finalize**, its own detailed left rail and summary, current `Begin Journey` which calls `onCreateGame`. | Preserve all actual validated steps and steps' owner-derived formulas, eligibility, preview, overwrite protection and controls. Do **not** implement a new four-tab creator simply because a future UX document proposed it. Future consolidation is a separately authorized redesign/test migration. |
| `packages/content/base/player/backstories.json` / catalog eligibility | Existing special Backstory: **`backstory.isekai_outcast`, named `World-Stray`**; currently special/manual eligibility, not assumed unlocked by mere UI choice. | The isekai prologue is conditional on genuinely approved, eligible source/backstory and World Entry; not a free new unlock. Ordinary Local/Vagabond/etc. remain normal creator selections. |
| `apps/rpg-ui/src/index.css` | Current dark tokens use charcoal `#0c0c0b`, forged black, smoked steel, parchment `#e8ddc6`, muted gold `#bda66f`, bronze borders, current launcher background textures and light-theme tokens. | Translate layout into real theme variables; do not paste the earlier forest-green standalone prototype as production colors or lose light-theme support. |

The user explicitly wants the **current character creation process retained** while considering newer design intent. Therefore the accepted *next source patch* is shell/navigation composition and a future narrative handoff, **not** the unverified four-main-tab/no-Review design rewrite from older intent. Continue to distinguish **Backstory (the character's past)** from **World Entry (present opening circumstances)** and from the World Creator global starting scenario.

## 3. Contextual top bar and left-pane matrix

| Surface | Top bar | Left pane | User action and safety |
| --- | --- | --- | --- |
| Splash, signed out | Small brand, **local time**, Guest/account menu with Settings/Theme; Log In and Create Account centered in content | **None** | No fake account profile, Logout, World clock or Save controls |
| Account picker / register | Same restrained top layout; back and auth notices when relevant | **None** | Reuse actual account chooser, verifier, stay-signed-in and safe archive path; no local mock password owner |
| Signed-in Welcome | Local time + verified `displayName`, Settings/Theme/Logout menu | **None** | Continue to mode selection, never implicit global Save resume |
| Progression mode | Local time, account menu, back breadcrumb | **None** | Chronicle/Persistent cards; unavailable mode disabled and owner rejected |
| World Library | Existing `AppShell` top bar; verified account controls; World breadcrumb, no global-Save Continue | **Worlds**, relevant account-only Legacy or Settings; hide Character/Bloodline sections until a World is selected | World cards from owner registry, empty/error states, Create action with quota |
| World Creator | Same top bar, breadcrumb and Back to Worlds; no World clock before World exists | World Library navigation or compact contextual Worlds rail | Name + Gameplay Mode Individual/Living; Mortal/Hardcore and provenance exactly validated; no fake customization sliders |
| World Overview/character roster | Local time plus **verified World time when owner exposes it**, account menu, chosen World identity, permitted Continue only for a verified selected character | **Worlds, Characters, Legacy, Chronicles, Bloodlines, Settings** selectively when supported and relevant | Do not infer rosters from global Save-slot rows; unsupported sections hidden/disabled rather than misleading |
| Existing character creator | Existing `AppShell` top/back/theme controls; selected World context without cross-World Continue | Replace general nav with **current eight-step character creator navigator** and preview; preserve step state | All actual validated inputs and eligible heir/founder rules remain intact |
| World Entry cinematic/prologue | Quiet top: local time, account menu, Back to draft where safe; minimal story progress breadcrumb | **None** | Attention on narrative, two large accessible choice buttons; no World/Save mutation from reading or refusing a scene |
| Comic pre-entry bad ending | Same quiet top, account menu | **None** | Show parody 0/100, retry or creator back; no real death/score/Save or account penalty |
| In-game | Existing game-owned HUD and world clock, not this launcher shell fabricated over play | Existing gameplay navigation appropriate to world state | Source of truth is native-v3 + World head, not launcher sample mode |

**Header semantics:** The top-bar time on splash/menu screens is **local clock** (not an unverified World simulation time). Inside a selected World, show the World clock only if actual owner snapshot/readback supports it. Signed-in account menu contains Settings, Theme, Log Out; optional Exit if the host supports it. Signed-out menu cannot contain Log Out. Theme is the existing `themeMode` owner/preferences route, not a duplicate isolated page toggle in real production. An in-memory prototype can use its own demonstration theme without pretending account preferences were saved.

**Responsive:** At 1280px preserve the 18.48rem rail and split right-hand World Creator summary, with existing mobile brand placement rule. At 768px constrain content/summary and use the real `AppShell` responsive layout. At 375px and 320px the rail becomes a single horizontal scrollable *context* navigation, not duplicated nested rails or a hidden offscreen required action; the creator's existing stepper remains usable. Login, mode cards and story remain rail-free. No horizontal document overflow. Bottom buttons must remain reachable at 375×667, and all story choices need readable focus and screen-reader names. Do not duplicate real app's account control/menu state.

## 4. Conditional post-creator World Entry: new narrative seam

The user proposes a **dynamic next screen chosen by the character's accepted Backstory / foundation type**, especially isekai (World-Stray). This is a post-validation **World Entry prologue**, not a replacement for any current character field or a different global World scenario.

```text
CHARACTER_DRAFT_VALIDATED (real existing form)
   → PREPARED_ENTRY_INTENT (accepted account/World rules, backstory, scene/site,
                            exact source fingerprints and operation id)
   → PROLOGUE_NODE (immutable scene/content version, current node, branch path)
       ├─ eligible world-start success → single authorized character/Save
       │     publication and verified readback → IN_GAME
       ├─ refusal/alternate → authored follow-up, a limited finite loop,
       │     player may reconsider before publication
       └─ failed prologue → PRE_ENTRY_PARODY_RESULT 0/100
                             → RETRY PROLOGUE / RETURN TO DRAFT
                             with **no actual campaign/Save or World write**
```

**Critical current-caller mismatch:** Current Finalize's `Begin Journey` immediately invokes `onCreateGame`. The prologue cannot simply be appended after that write, then award a fake death or delete a created Save on failed choices. The future implementation must introduce a verified **pre-publication entry phase** (or an independently approved equivalent atomic owner protocol) and only perform first World/character/campaign/Save publication on successful, eligible World Entry. A stable `entryIntentId`, exact selected World/head/content, immutable scenario/branch version, source-safe retries, and idempotent successful publication are required. Interrupted, stale, multi-tab, back/retry and account switch cases must not duplicate creation, spend Prestige, unlock backstories, grant resources, rewrite a terminal character, or overwrite an existing slot.

**Story IDs vs other IDs:** `prologueId`/`prologueVersion` (this authored narrative graph), `backstoryId` (eligible foundation, e.g. `backstory.isekai_outcast`), `worldEntryScenarioId` (genuine local playable entry at supported World site), `globalScenarioId` (World initial scenario) and `worldInstanceId` (World history) are distinct owners. An accepted bad ending can be **presentation-only** until an owner explicitly chooses to record private narrative attempts; it is not a real run, permadeath, account moral score, leaderboard event, Chronicle Mark or currency source.

### 4.1 Example authored story variants (proposals, not content canon)

| Optional World-Stray opening | Choice A: leading toward World | Choice B: refusal / comic loop | One example pre-entry bad end |
| --- | --- | --- | --- |
| **Box Truck Incident** | “Run out and save the child” → child moves to safety, abrupt non-graphic collision/cut to reincarnation | “Do nothing. Let the child die.” → scene of tragedy and a narrator offering one rewind; continued refusal ends the sequence | **THE WEATHER ALSO DISAPPROVES:** improbable later lightning strike, no rebirth |
| **The Summoning Circle** | “Stand your ground and answer the summons” → open portal/arrival | “Step outside the circle” → the circle follows the player, increasingly officious summoners; refusal can repeat once | **A VERY ORDINARY DESTINY:** heroic invitation expires, uneventful mundane lifetime |
| **The Rain-Slick Door** | Open uncanny door → World harbor | Walk past it → door follows on other corners, Destiny files increasingly rude notices | **DESTINY HAS CLOSED YOUR TICKET:** bureaucratic no-rebirth rejection |
| **The Last Exit Interview** | Accept modest second chance → World | Demand royal title/cheat powers → cosmic paperwork loop | **NO REBIRTH BENEFITS APPROVED:** eternity spent negotiating a nonexistent benefits package |

Proposed prologue failure card title: **“Don't You Know How Isekai Are Supposed to Work?”**, with an over-the-top **`0/100`** *prologue-only* rating and two actions: **Try Another Opening / Retry** or **Return to Character Creator**. The satire is directed toward the player's narrative choice or genre conventions, not graphic injury to the child; represent serious tragedy briefly and non-graphically, then transition to cosmic bureaucracy or slapstick consequences. A finite refusal loop must offer a clear exit and never trap keyboard users in an infinite narrative state. Allow narrative tone/choice eligibility to be reviewed before release.

**Branch continuity:** If the initial scene says a child has already died, a later “save the child” selection **cannot retroactively claim the rescue occurred** unless the author explicitly triggers a rewind node before choice A. In the prototype the narrator offers one rewind; choosing that goes back to the original scene, not directly to a successful rescue. All variants need graph reachability tests, terminal states, retry rules, localization and non-graphic content review.

**Ordinary backstories:** e.g. Local/Vagabond use a contextual, authentic in-World opening, not involuntary truck/summoning scenes. A character's backstory can change **which scene is offered**, but the actual starting geography, site, NPC/items/ambience must be supported by the accepted local area. No fictional inn, summoning court, vehicle wreck or heavenly clerk should be instantiated in simulation just because the narrative text mentions it.

**Isekai eligibility:** `backstory.isekai_outcast` is real authored catalog content; special/manual eligibility remains in force. The offline preview allows choosing World-Stray **solely to navigate this story design**. Do not use this illustration to unlock the origin in production or give it unverified starter abilities.

## 5. Isolated reviewable preview and verified checks

An updated **standalone** `lineage-integrated-launcher-route-preview.html` was generated in the current conversation for visual navigation, not placed into `apps/rpg-ui` or any production build. It follows the source theme values and `AppShell` behavior rather than the earlier green design, and includes:

- Splash → Login/Create Account preview → Welcome → Chronicle (Persistent disabled) → World Library → Creator → World Overview → Character Library → eight-step creator navigation → contextual World Entry (four isekai variants) → mock success or comic pre-entry 0/100 result.
- Existing-style header with local time and Guest/verified-demo-name menu; Settings/Theme/Log Out only when appropriate. No rail until World Library; optional context rail for World; current eight-step rail in character creation; no rail during narrative.
- World Creator named World, Individual selected, Living disabled, Mortal active, Hardcore Off and climate/disasters Coming Soon. All demo World/character data are **in memory only** and no password/real account credentials are requested by the preview.
- Four different bad-ending titles and the optional child-rescue rewind, all pre-publication, all replayable.

In this session, system Chromium via Python Playwright **`page.set_content`** (not `localhost` and not the real React `EpochApp` build) passed at **1280×850, 768×980, 375×812 and 320×700**: splash/login/welcome/mode route, contextual rail and World library, create demo World/name checks, World Overview/selected character return, current eight-step rail, World-Stray story path, Box Truck B→loop→B→0/100, A→demo success, no horizontal viewport overflow or JS page errors. Additional **1280/375** checks passed guest/auth menu actions, light/dark theme, demo registration, Settings dialog, signed-in Logout, **all four** deterministic bad endings, narrator rewind and retry success. `node --check` of the embedded preview script passed. These are **prototype-only** tests, not source-integrated React, real accessibility/screen reader, actual game World create, or native-v3 Save acceptance.

Screenshots (1280/768/375/320; screenshots of splash/mode/World Library/Create/Overview/creator Finalize/Isekai story/bad ending) and the standalone HTML are available in the current user conversation. They are **not** GitHub repository artifacts and their demo labels are not content authority.

## 6. Executable implementation slices and acceptance gates

1. **Repository baseline:** from authenticated synchronized checkout (unavailable in current Connector environment), fetch/prune, inspect exact master/PR #102 and active worktrees; run existing typecheck/build/UI/launcher/World/Save tests and capture source head, no extra branch overlap.
2. **Shell/UI composition only:** implement contextual `AppShell` usage in isolated QA route, reuse `LocalAccountAccessScreen`, `WelcomeScreen`, `MainMenuScreen` vocabulary, `ShellBrandLogo`, `LauncherSpriteClock`, theme tokens and account menu; use actual current character creator unchanged. Add presentational World Library/Creator/Overview/roster components behind fake/mock-only QA **clearly separated from the real owner**, without enabling WORLD_LIBRARY_GATE in production. Test no rail on splash/mode/story, correct rail/step navigator when scoped, 320/375/768/1280, keyboard, focus, light/dark, no global Save shortcut.
3. **Prologue scene data/UX only, isolated:** versioned scene graph resolver and UI for eligible backstory/context with ordinary World Entry fallthrough, finite loop/reconsider/failure branches, accessible A/B, correct branch outcome and deterministic 0/100 presentation. Test missing/unsupported scene, skipped character step, wrong account, invalid World, invalid World-Stray unlock, duplicate user input, tab conflict and branch reachability. Do not invoke `onCreateGame` from any pre-entry option until the owner's publication seam is separately accepted.
4. **Durable owner prerequisite:** PR #102 L3b canonical economy/full-source browser parity and real account World+receipt create/retry/reopen/readback; then accepted World-bound character/campaign/native-v3 Save association, stable pre-entry intent, atomic scene→game publication and restart proof. No user-facing actual Create/Play until these gates pass. The story continuation must not publish the same character twice after reload or concurrent clicks.
5. **World-bound playable integration:** only then connect `Your Worlds → World Creator/Overview → actual creator → valid prologue → World Entry → Save/restart`, real account and World isolation, real local scene and one gameplay action. Feature-OFF legacy launcher remains untouched until separate activation approval; keep unsupported Living, Persistent, Hardcore and climate/disasters disabled.
6. **Future Living mode:** independent shared multi-actor and real settlement/builder action acceptance gate as recorded in parent design; no decorative builder screens.

**Gates retained:** `L2G_SOURCE_CONTRACT_READY`, `L3B_BROWSER_CREATE_HELD`, `HOLD_SELECTED_ATOMIC_ACTIVATION`, `HOLD_STAGING_PUBLICATION`. No new game version/milestone, migration, source acceptance, deployment or release claim.

## 7. Decisions not to misread

- One **individual active player POV** per Individual World does not mean one World per account; multi-World quota and multi-character Living actor quota are independent.
- **World Creator** creates a World *history*, not an atlas. **Character Creator** retains its existing eight implemented stages. **World Entry narrative** is an optional dynamic post-validation bridge, not already playable local area simulation.
- Humorous **0/100** is not a permanent death, Hardcore failure, moral alignment or actual run-end settlement. Its intended fun depends on *not* destroying legitimate drafted characters or granting repeatable rewards.
- If the source-based World-Stray opening, exact account/World/Save owner, or a valid location is unavailable, show an honest unavailable result; never substitute a client-side random roll or publish a fabricated isekai scene.
