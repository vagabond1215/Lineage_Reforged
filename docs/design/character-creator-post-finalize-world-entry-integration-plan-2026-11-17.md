# Current Character Creator → Branching World Entry: Detailed UI Integration Plan

Date: 2026-11-17 (America/New_York)  
Status: **OWNER-DIRECTED DETAILED UI INTEGRATION CONTRACT / CONNECTOR SOURCE REVIEW / EXECUTABLE PRODUCTION INTEGRATION NOT_RUN**  
Inspected repository: `master` `aa742eafab628ebb3c75e9eff92e6c20adf6ec78`, draft [PR #102](https://github.com/vagabond1215/Lineage_Reforged/pull/102) `d3cd548f6b21aff11c40637c3e16026502f8e6e2` (open, unmerged).  
Authority: [Contextual launcher, current creator and dynamic World Entry](first-world-contextual-launcher-shell-and-branching-entry-ui-contract-2026-11-17.md); [World/Creator/Save acceptance](first-world-player-first-world-creator-and-library-implementation-gate-2026-11-17.md); [World-scoped character and entry contract](welcome-world-library-character-entry-and-loading-plan-2026-11-11.md).  
Scope: **insert a UI-only narrative handoff after the real existing Finalize stage**, preserving source-validated character creation, World selection and account ownership. This doc grants **no** game schema/Save/World migration, new production runtime control, merge or hosted activation.

## 1. Product decision and release boundary

**Keep the CURRENT implemented eight creator steps without changing their order, validation, option eligibility, form model, budget math, source formulas, Save-slot protections or UI step rail:**

`Lineage → Identity → Continent → Region → Settlement → Backstory → Starting Bundle → Finalize`

After **Finalize**, insert a visually distinct **Opening / World Entry** *narrative phase*. It is **not a ninth editable creator form step** and is not the World Creator global genesis scenario. The player can return to the current Finalize and edit the draft, while the story scene is temporarily invalidated and re-resolved. The feature-off legacy game path remains exactly as today.

Selected navigation sequence:

```text
Authenticated account → progression mode (Chronicle initially)
→ actual World Library → verified selected World (Individual for first active slice)
→ verified World-scoped character choice / New Founder / eligible heir
→ EXISTING CharacterCreationNarrativeScreen
   [eight current steps + current left-side step navigator]
→ FINALIZE
   summary, resolved opening, eligible start location, source/entitlement warnings,
   [Back / Continue to Your Opening]    (no publication)
→ CHARACTER_ENTRY_PROLOGUE (no sidebar)
   [scene 1..N] A/B choices, limited authored comedy/refusal, Back to Finalize
      ├→ SUCCESS_READY (explicit World-entry action / commit)
      │  → owner revalidation, exact-once creation+receipt+native-v3 Save,
      │     accepted World entry and readback → IN_GAME
      ├→ LOOP/RECONSIDER → finite next scene or explicit rewind → same story
      └→ PRE_ENTRY_BAD_END (0/100 parody presentation only)
         → Retry this opening / Choose a different opening (if eligible)
         → Return to creator Finalize (draft unchanged)
```

Ordinary Backstories (Local, Vagabond etc.) get a grounded, validated **World Entry** opening; **World-Stray** (`backstory.isekai_outcast`) may get the special Isekai mini-story **only when the actual catalog/entitlement resolver marks that Backstory selectable**. Do not unlock it because the UI can show a mock scene. A missing authorized real start site/scene is a blocked player-facing state, not permission to invent gameplay assets.

**No first character/Save/World action happens when selecting a narrative choice that is not the final, owner-authorized success.** “Refuse”, “Let fate handle it”, “Rewind”, “0/100”, “Retry” and “Return to Finalize” are presentation choices, never real game death, moral currency, XP, run-end rating, Hardcore/life loss, achievement or account ledger entry.

## 2. Current source integration seams: exact files, present behavior, required change

| File | Actual readback at inspected head | Planned minimal intervention (later implementation-capable checkout only) |
| --- | --- | --- |
| `apps/rpg-ui/src/game-shell/components/CharacterCreationScreen.tsx` | Simple reexport of `CharacterCreationNarrativeScreen` | **No replacement**. Continue using this same exported creator. |
| `apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx` | ~2941-line screen; `currentStepId` local state, `CHARACTER_CREATION_STEPS`, existing creator-side summary/step rail, `AppShell`, `ShellBrandLogo`, theme button. Finalize button label `Begin Journey` validates `fullValidation` then directly invokes `onCreateGame({ hasSelectableBackstories })`. | Keep all eight step and preview render branches. **Only at Finalize**, add a small read-only “Your Opening” panel and replace final callback with `onRequestWorldEntry` on the new, **gated** route; old `onCreateGame` remains for feature-off legacy behavior. For staged UI preview, a separate QA prop/adapter must not invoke any owner write. The component should not own story branching/persistence. |
| `apps/rpg-ui/src/game-shell/characterCreationForm.ts` | `CharacterCreationFormState` carries `backstoryId`, `sourceRunId`, `saveSlotId`, world place selections; `validateCharacterCreationForm` checks eligibility, settlement access, skills and starting bundle; eight-step enum ends `review`. | **Do not append `prologue` to `CharacterCreationStepId`** or insert an unrelated field into current form. Define a **separate typed opening view model** after validation. Reject stale form/digest/World selection. |
| `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts` and `packages/content/base/player/backstories.json` | `backstory.isekai_outcast` = **World-Stray**; `isSelectableBackstoryId` derives selectability from `resolveBackstoryCreatorEligibility` (not a plain ID check). `getBackstoryOptionsForSelection` already exposes locked reasons and unlock hints. | Reuse eligibility resolver, and distinguish **backstory** from **entry scene**. An Isekai story cannot be chosen just by manually setting the ID or bypassing account/source evidence. Do not edit backstory stat buffs, abilities or unlock conditions for a storytelling shortcut. |
| `apps/rpg-ui/src/EpochApp.tsx` | `CHARACTER_CREATION` route wires `onCreateGame` to `createCampaign(false, options)`, which revalidates and calls `services.first.start(accountId, state.form, ...)`, then `enter`. The current State union has no story phase. | Add **only behind the approved feature/development gate** a typed non-write story route and events; move the *authorized* final owner write after the accepted successful opening. Maintain the feature-OFF `onCreateGame` path. Never call `enter` based on narrative UI alone. |
| `apps/rpg-ui/src/game-shell/state.ts` | `AppScreen` includes `CHARACTER_CREATION`, `IN_GAME`; no `CHARACTER_ENTRY_PROLOGUE` or `PRE_ENTRY_RESULT`. Reducer preserves form during `UPDATE_CHARACTER_CREATION_FORM`. | Add explicitly discriminated **ephemeral** `CHARACTER_ENTRY_PROLOGUE`, `CHARACTER_ENTRY_RESULT` and eventually `CHARACTER_ENTRY_COMMIT_PENDING`/error states; retain bound form and selected-World context, not a clone of Save authority. Distinct stale, blocked and cancel dispositions. |
| `apps/rpg-ui/src/game-shell/cleanEpochFirstCampaignAdapter.ts` | `start` = **`prepare` + `resume`**. Crucially, existing `prepare` calls `owner.prepareAttempt`, writing a retained `CleanEpochAttemptRecord` that reserves the slot; `resume` publishes an actual Save and completes consumers. | **Do NOT call existing `prepare` when merely opening the narrative**. It is a mutating campaign-owner operation, not a harmless UI preview; a failed prologue must leave no resumable `prepared` slot. On successful ending only, stage an owner-verified exact-once publish adapter that joins accepted World/character/scene identity, scene-version fingerprint and stable intent to the existing protected publication graph. Changing this persistence contract requires independent owner review/tests. |
| `apps/rpg-ui/src/game-shell/components/AppShell.tsx` | Optional `sidebar` already controls rail; brand+sidebar gives fixed desktop logo corner; `TopBar` supports title, account controls and action slots. | Existing creator keeps its rail. New story screen **passes no sidebar**, so desktop focuses on text/choices. Reuse launcher theme/chrome, not a new application shell or fake World-time display. |
| `apps/rpg-ui/src/index.css` | Existing charcoal/iron/parchment/gold tokens and dark/light theme. | Use existing theme variables, forged controls and focus styles. Any new story CSS uses scoped selectors; no global palette reset. |

**Current overwrite caveat:** `CharacterCreationNarrativeScreen` has a `needsOverwrite` confirmation surface, but `EpochApp.createCampaign(forceOverwrite=true)` currently marks Overwrite **unsupported**. The new story route must not silently bypass this hold, reserve an occupied slot or enable an unsupported destructive overwrite.

## 3. Detailed screen specification: keep creator stable, add one intentional seam

### A. Existing Backstory stage: a light-touch preview, not a new selector

Retain every current Backstory card, `availabilityBadge`, `lockedReason`, `unlockHint`, description and starting skill/ability preview. Beneath the **selected and actually selectable** Backstory, optional compact text:

> **Your story's opening**  
> This origin may begin with a short interactive prologue before your journey. Your choices shape the introduction, not the World’s geography or your starting skill totals.

For real eligible World-Stray, optionally show `A strange arrival awaits`; for ordinary Backstory, `Your life in the First World begins in your chosen settlement`. Do not promise a truck, portal, same starting gift, class/stat reroll or available site until the scene resolver provides an accepted preview. Keep descriptions, locked options, keyboard navigation, selection callbacks and step unlocking unchanged.

### B. Current Finalize stage: add an “Opening” handoff panel

Leave all current character statistics, provenance, Legacy preparations, gear and starter bundle preview, source/heir choice and Save-slot warnings intact. Insert a subtle panel **after the existing character summary and before the primary footer**. Required owner-backed rows:

- **Selected World**: verified `worldInstanceId` display name, `First World` authored geography, mode `Chronicle` and `Individual` from *that* World; never a global Save-derived World.
- **Character**: preview name and eligible `backstoryId`/display name; founder/heir status and any immutable heir facts.
- **Opening**: approved scene title or **“Opening unavailable: reason”**; actual eligible settlement/site/worldEntryScenario reference if known. Do **not** fabricate a city, inn, road, spell effect, starting items or arrival point from a map label.
- **Before you enter**: short note: **“The introductory choices are not yet a saved game. Your first Save is created only when your valid opening is accepted.”**
- **Primary action**: `Continue to Your Opening` (only when form+backstory+World+real entry source all pass) replaces `Begin Journey` **on the new world-bound route only**. Existing feature-off route retains `Begin Journey`.
- **Secondary actions**: `Edit Character` (current rail/steps), `Back to [World Name]` (preserves/discards draft only per established cancel policy), and no new destructive overwrite action.

Validation behavior: if form invalid, reveal first current `validateCharacterCreationForm` error and focus the affected step. If a source is unsupported, show `Opening not available in this area yet` and a grounded alternative or Back. No story writes on hover, render, a Back action or changing a dropdown.

**Desktop:** keep existing `AppShell` left creator rail `md:w-[18.48rem]`; Finalize's opening panel sits in main content, not a second sidebar. **Mobile:** the existing step navigator remains compact/scrollable as implemented; opening panel full width; action appears after content in normal page flow and is not occluded by a sticky overlay.

### C. New `CharacterWorldEntryScreen`: quiet narrative stage after Finalize

No left rail. Use `AppShell` without `sidebar`, with top bar `Worlds / [verified World] / [character draft] / Opening`; local clock if available; signed-in account menu with Settings, Theme, Logout. Only display actual World clock if read from the World owner, **not** a static faux time. Back button safely returns to creator's Finalize (do not trigger account/World/Save mutation), with explicit leave confirmation if it would discard unsaved narrative choices.

Main content centered, maximum readable line width (approx. 42–52rem for text; enclosing panel up to 60–64rem) with:
1. Kicker `WORLD ENTRY • PROLOGUE`, authored scene title, optional `SCENE 1 OF 3` if the real graph has a finite path.
2. Narrative illustration only when a valid licensed/owned asset exists; no placeholder required. Accessible text always renders without images.
3. Two or more large **labeled choice cards** (A/B; description + clear consequence/intent where appropriate). A *choice* advances a versioned story node in UI memory but cannot be confused with the accepted gameplay-command queue.
4. An explicit `Back to Finalize`, `Read previous scene` (if safe), `Skip` **only if authored and permitted**, and a safe current World label. Never supply an unconditional Skip that defeats gated origin choices.
5. Pending/loading, invalid source, stale owner and submit failures show explicit messages; only the final success action displays `Enter the World` and then awaits real publication/readback.

**Story top-bar rule:** narrator scenes and parody results intentionally have **no Worlds/Characters/Legacy rail**. The normal launcher section navigation returns only after World Overview or actual in-game entry. The regular creator rail also disappears during narrative without altering its step state.

### D. New `CharacterEntryResultScreen`: bad-karma comic scorecard

Only a terminal **pre-publication narrative refusal** can route here. Centered result; no side rail or campaign HUD:
- Small `AN ENTIRELY UNOFFICIAL ASSESSMENT`; large `0 / 100` typography; playful “Don't You Know How Isekai Are Supposed to Work?” headline, with short variant-specific narrative.
- Clear status `The adventure has not started. No character was lost, and nothing was saved.`
- Primary `Try Again` (fresh eligible prologue with same draft and correctly revalidated source); secondary `Return to Character Creator`. `Pick another opening` offered only if resolver proves multiple eligible variants.
- No false World death flag, permanent “Game Over” state, real account rating, leaderboard/currency event or retention of the mock score.

**Responsiveness:** 1280/768/375/320 CSS px, phone 320×700 and short 375×667. 44px minimum touch controls, single column on phones, no horizontal overflow, body can scroll vertically, text can enlarge 200%, reduced motion respected, focus/reading order sensible, heading announced on navigation, no keyboard trap, `aria-live` for story-node updates and errors. Do not disable browser Back while an actual owner transaction is active without clear explanation/recovery.

## 4. Isekai narrative family: authored, versioned branch graphs

Examples are **editorial proposals**, not currently indexed game scenes or eligible mechanics. Use stable IDs/versions **once accepted**; below are illustrative keys, not machine IDs approved for the actual registry.

| Candidate opening | A path | B path / bounded joke | Terminal pre-entry refusal result |
| --- | --- | --- | --- |
| **The Box Truck Incident** | `Run out and save the child` → child moves out of danger; non-graphic transition to a new existence | `Stay where you are` → terrible consequences are conveyed **without graphic detail**; narrator offers one explicit `Rewind to that choice`, then a finite refusal limit | A later mundane misfortune or lightning strike; **not** a real game death. Rewind always returns to the original choice node; no logically impossible after-the-fact rescue |
| **The Luminous Summoning Circle** | `Answer the summons` → valid narrative handoff | `Step outside the circle` → circle follows, magical clerks get impatient; at most two escalating refusal beats | `Summons expired. Please reapply next lifetime.` |
| **The Impossible Door** | `Open the door` → enters authored World Entry | `Keep walking` → identical door on subsequent corners, increasingly petty cosmic notices | `Destiny closed your ticket.` |
| **The Cosmic Exit Interview** | `Accept the second chance` → accepted World entry | `Negotiate for royal status and powers` → finite cosmic paperwork loop | `Reincarnation application declined for unrealistic compensation expectations.` |

**Variation without chaos:** The first scene can come from the set of *eligible published story graphs* (or the player can choose one if the UX approves choice). A “bad karma” endpoint can rotate among several **authored** variants without always showing the same gag, but must stay stable within a prepared narrative attempt, deterministic for replay/testing, and never produce a new scene graph or grant abilities. Do not generate unbounded “humorous loops”: a maximum of two refusal beats is proposed, then clear retry/success exit or 0/100 terminal. Every branch must have graph-reachability and finite-termination tests; source localization, content warnings, skip accessibility and narrator consistency are part of authoring acceptance.

**Ordinary starts:** Local, Farmhand, Merchant Family, Vagabond, Exile, etc. use specific approved in-World intro scenes tied to real starting conditions; do not force them through Earth-world truck tropes. The current World-Stray origin is **special/manual**, and there is no guarantee that all four isekai candidates are eligible for the same selected World/site. An approved opening only supplies narrative framing; game-world actors/sites/items still require the actual supported starting scene owners.

## 5. UI-only state machine and planned API boundary

Design a typed resolver that is **pure** over a validated, owner-grounded input, and a separate runtime effect owner that alone may commit after the final success gate.

```text
CREATOR_DRAFT (current CHARACTER_CREATION, valid form)
  └─ requestOpening(form snapshot + selectedWorld bound identity)
        → resolving | blocked(reason) | PROLOGUE_READY
PROLOGUE_READY
  ├─ CHOOSE(branchKey) → PROLOGUE_READY(next stable node)
  ├─ CHOOSE(reconsider) → previous authorized node (no publication)
  ├─ CHOOSE(terminalFailure) → PRE_ENTRY_RESULT(score presentation only)
  ├─ RETURN_TO_FINALIZE → CREATOR_DRAFT (retain form, invalidate scene state)
  └─ CHOOSE(acceptedSuccess) → SUCCESS_READY
SUCCESS_READY
  └─ explicit Enter World → COMMIT_PENDING
          → [verify account + World + rules + starter site + original form +
             backstory entitlement + legacy/heir/slot + exact story graph outcome]
          → approved first campaign/World/character/Save owner, exact-once
          → read back exact head/character/world identities → IN_GAME
          ↳ conflict/timeout/readback interrupted → RECOVERY_REQUIRED
              (read accepted owner; NEVER blindly call start a second time)
```

**Suggested UI types, not adopted schemas**:

```ts
type CharacterOpeningView =
  | { status: 'unavailable'; reason: string }
  | { status: 'ready'; worldId: string; worldRevision: number;
      formFingerprint: string; prologueId: string; prologueVersion: number;
      nodeId: string; eligibleChoiceKeys: string[]; sourceSiteId: string }
  | { status: 'failure'; prologueId: string; endingId: string; score: 0 }
  | { status: 'success_ready'; prologueId: string; terminalNodeId: string }
  | { status: 'commit_pending' | 'recovery_required'; requestId: string };
```

No `CharacterCreationFormState` field for story score, no extra Save slot, no client-created World or simulated NPC inventory. Distinguish player-visible backstory, `worldEntryScenarioId`, `prologueId/version`, `globalScenarioId` and `worldInstanceId`. Client graph traversal can be kept **ephemeral** for isolated QA; a final owner contract may pin completed path/intent for audit/recovery. If reload happens during an ephemeral attempt, return to a verified draft/World entry state or explicitly offer restart, rather than pretending an unpersisted branch remains authoritative.

**Candidate events** (names illustrative):
`REQUEST_CHARACTER_OPENING`, `OPENING_RESOLVED`, `CHOOSE_OPENING_ACTION`, `RETURN_TO_CREATOR_FINALIZE`, `SHOW_PRE_ENTRY_RESULT`, `CONFIRM_CHARACTER_WORLD_ENTRY`, `ENTRY_COMMIT_RECOVERY_REQUIRED`. These are distinct from real in-game commands. The reducer must preserve auth session, existing form, selected verified World binding, active source/entitlement and stable attempt identity; enforce stale-action rejection and no story choice accepted after `commit_pending`.

**World mode distinction:** `Individual World` only has one current active POV and sequential heir continuity. `Living World` remains Coming Soon until multi-actor owner and settlement-command acceptance; a story scene cannot spawn extra playable characters or preactivate Living simply by naming several people.

## 6. Commit and overwrite safety: most important architectural gate

Current real adapter `CleanEpochFirstCampaignAdapter.start()` calls `prepare()` and then `resume()`. Current `prepare()` is **not** an inert preview: it builds a campaign snapshot and calls `owner.prepareAttempt`, writing a prepared record and reserving the selected Save slot. Current `resume()` publishes and completes consumers. Therefore:

1. In **QA layout/prologue testing**, keep narrative state entirely in memory. No calls to `first.prepare`, `first.resume`, `first.start`, account Save APIs, World registries or Legacy/Prestige reward APIs.
2. On **real integration**, Finalize validates the current draft and resolves eligible scene data **without preparing the campaign**. An owner-authored versioned intent/fingerprint may be issued or read at the actual commit boundary as needed, but introducing any durable pending intent must have its own recovery semantics and cannot create a resumable campaign prior to successful scene resolution.
3. On accepted **success terminal**, the service independently rechecks current session/account generation, selected World head/mode/difficulty/rules, exact creator form+heir+Legacy evidence, expected empty/approved Save address, scene/site eligibility and prologue graph/version/path. It then does an **exact-once** first publication or returns the previously accepted identical receipt.
4. A different scene path/content/rules/form/world/head under the same request ID is a conflict, never silently “same retry.” A stale/ineligible source fails without a partial World/Save/character or consumed entitlement.
5. If publication succeeds but UI loses readback, rediscover the accepted receipt/World/Save before showing game or Retry. Two tabs choosing different endings cannot both publish; failure outcomes cannot continue a completed intent. Back, logout, account switch, archived restore, abort and crash cannot leak the old draft or selected World into the new authenticated account.
6. Do **not** bypass `forceOverwrite` unsupported behavior or silently upgrade old native-v3 snapshots. The existing first-campaign attempt/consumer protocol and PR #102 World registry extension require an explicit synchronized repository owner/migration design before binding gameplay. Any new persisted field must be versioned, backed up/restored and tested with historical retained saves.

This seam is a **separate development gate** from the visual layout; do not rebrand an isolated story browser test as real World entry acceptance.

## 7. Implementation slices with files, dependency edges and exit evidence

| Slice | Scope and intended files | Exit gates |
| --- | --- | --- |
| **C0: Baseline** | In authenticated synchronized checkout, inspect `master`/PR #102 merge base, current worktree/CI/active owner; run creator, Backstory eligibility, launcher, first-campaign, native-v3 and World tests; record PASS/FAIL/NOT_RUN | Exact source SHA and no overlapping edits. No source change before baseline. |
| **C1: Form-preserving Finalize handoff (QA only)** | Add optional **Opening panel** and an `onRequestWorldEntry` callback to `CharacterCreationNarrativeScreen.tsx` without touching eight-step definitions. Keep feature-OFF original callback and actual validation. Snapshot form digest and World id in QA-only view state. | Existing current creator flows and `onCreateGame` regressions unaffected; no owner calls; keyboard/320/375/768/1280 tests. |
| **C2: Branching UI component + pure graph** | New `CharacterWorldEntryScreen.tsx`, `CharacterEntryResultScreen.tsx`, pure `characterEntryPrologueCatalog.ts` and `characterEntryPrologueResolver.ts` (illustrative file names), plus explicit unit fixtures and a development-only QA route. No canonical content injection until validated. | All authored nodes reachable, bounded loops, conditional Backstory, choice labels, rewind logic, 0/100 non-persistent, no World writes, light/dark and screen reader/keyboard checks. |
| **C3: Approved owner/source story catalog** | Versioned/provenance-checked story IDs and World Entry compatibility, scene/site assets, entitlements, localization, story variants. Requires actual selected-World accepted authoritative API; ordinary backstories supported. | Source complete, no fake local site/room/actor/loot, World-Stray eligibility enforced, deterministic replay. |
| **C4: First-publication handoff** | Within synced PR #102/L3b-derived owner route (not a connector code patch): new World-scoped intent/receipt and atomic character/campaign/Save commit; associated `EpochApp.tsx`/state union and first-campaign adapter changes after source and schema approval. | Real Chromium Node/browser pinned economy parity and World+receipt, stale/race/idempotence/reopen/archive/native-v3, pre-entry failures produce no prepared attempt; successful entry is unique and survives restart. |
| **C5: Player-path E2E and activation review** | Account → Chronicle → verified World → actual current creator → eligible real story → Save/readback → one action → restart/resume; default feature-off launcher regression, no fake story when unsupported. | Owner-backed full acceptance at 320/375/768/1280 + keyboard/screen reader, errors and destructive paths; activation/publication holds addressed separately. |

Do not ship C1/C2 QA components in the normal World route while C4 remains held. A clickable mock can use invented example titles only when clearly marked as **sample narrative**, not gameplay canon.

## 8. Acceptance matrix and negative cases

**Pure/role/graph unit:** supported ordinary Backstory resolves ordinary intro; World-Stray with valid entitlement/source resolves only allowed prologues; locked World-Stray denied even if manually set in form; unsupported site, missing map template, invalid World mode, wrong account and deleted World reject; all loops terminate; A/B/rewind preserve event order and continuity; unique ending IDs and no reroll during retry; “0/100” is UI-only. Invalid input never reaches a world-commit function.

**Component/UI:** Current eight step nav still works and backtracking updates all dependent validations; Finalize shows accurate World/name/Backstory/slot summary; invalid/locked/stale form blocks `Continue to Your Opening`; story rail hidden while creator rail returns on Back; empty/error/retry focus/ARIA; no fake persistent character; responsive 320×700, 375×667/812, 768×980, 1280×850, 200% zoom, reduced motion, theme, screen reader announcements. Clicking rapidly, using browser Back, switching accounts and abandoning a story cannot double-trigger callbacks or expose previous account data.

**Production owner / browser:** Two tabs compete over same selected World/slot; first success wins once, second rejected or exact receipt returned if same source; failure ending leaves slot **empty**, no `prepared` attempt or `pending_consumers`, no character ID or active run, no reward; real successful commit returns correct account/World/character/campaign/Save/scene/prologue receipt; crash between commit/readback heals through owner; logout/relogin and archive export/restore read same accepted result. Feature OFF creator and current Save/overwrite behavior unchanged. Compare full before/after retained graph digests and exact IDs, no production account used.

**History and correctness:** World-stray variant with child rescue cannot imply a rescue happened after the child was lost unless explicit rewind node occurred. All failure endings are concise, non-graphic, joke about the protagonist’s choices and genre conventions rather than glorifying harm to a child. Tragedy must not become a reward farm.

Suggested focused test additions **once source code is authorized**:
- `tests/unit/character-entry-prologue-resolver.test.mjs`
- `tests/unit/character-creator-opening-handoff.test.mjs`
- `tests/unit/character-entry-branch-graph.test.mjs`
- `tests/integration/character-world-entry-first-publication.test.mjs`
- `tests/e2e/character-world-entry-flow.spec.ts` (adapt to actual repository Playwright structure; these are proposals, not claimed existing tests)

Baseline adjoining tests should include actual creator and launcher `node --test` suites, account/first-campaign and PR #102 v8 migration tests, `npm run tool:no-new-hex-dependencies`, bounded/repository TypeScript, real application build and isolated Chromium. Never mark NOT_RUN checks PASS based on the old offline HTML preview.

## 9. UI text and interaction acceptance examples

**Finalize opening panel:**

> **Your opening awaits**  
> `World-Stray · The Luminous Summoning Circle`  
> `World: [verified user world name] · Entry: [verified eligible site]`  
> “Your character is ready, but their story has not begun. Finish the opening to enter this World.”  
> [**Continue to Your Opening**] [Edit Character]

**First isekai scene:**

> **A Circle That Wasn't There Yesterday**  
> “A luminous geometric pattern assembles across the pavement. Somewhere, a committee appears to be arguing about whether your name is pronounced correctly.”  
> A. **Step inside and answer the summons.**  
> B. **Walk around it. I have errands.**

**Finite B-path:** “The circle glides around the corner, arriving ahead of you. There is a brief sound of frustrated chanting.” → **Reconsider** or **Continue refusing**. Continuing twice eventually leads to an authored terminal.

**Pre-entry 0/100 presentation:**

> **Don't You Know How Isekai Are Supposed to Work?**  
> `0 / 100 · Entirely Unofficial Prologue Score`  
> “The Committee for Dramatic Reincarnation regrets to inform you that its budget has been reassigned.”  
> “No character or Save was created.”  
> [**Try This Opening Again**] [Return to Character Creator]

**Final accepted entry:** narrative choice A reaches a `Ready to enter` node; the only real write action is **Enter the World**, with pending feedback; successful readback navigates to the actual playable area. If a failed owner action happens, retain the character draft and present a safe resolved/blocked/recovery option, **never** label it a narrative failure 0/100.

## 10. Required disposition

- **Accepted UX direction:** integrate **after current Finalize**, preserve all eight current creator stages, show intro conditionally by valid Backstory/foundation and accepted World Entry, no left rail during narrative, reuse launcher top clock/account, A/B/rewind/bad karma parody, safe return-to-draft, first publication only after real story success.
- **Still unresolved/requires real owner:** real source-verified local site/entry graph; authorized World-Stray unlock; which authored isekai variants meet eligibility; whether to record branch-path provenance as part of first-publication receipt; exact first-campaign/World/slot/Legacy atomic composition; future persistent-mode and Living-mode entry behavior.
- **Hard holds:** `L2G_SOURCE_CONTRACT_READY`, `L3B_BROWSER_CREATE_HELD`, `HOLD_SELECTED_ATOMIC_ACTIVATION`, `HOLD_STAGING_PUBLICATION`. No master production code/source content changed in this Connector plan; no executable repo tests or real browser game create in this plan.
