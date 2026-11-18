# Character creator revision: World Entry foundation, live rail, identity randomization, portrait generation handoff

Date: 2026-11-17 (America/New_York)  
Status: **OWNER-DIRECTED UI INTENT + LOCALLY TESTED STANDALONE PROTOTYPE + PURE PORTRAIT PROMPT CANDIDATE / PRODUCTION CODE AND SAVE SCHEMA NOT_CHANGED**  
Inspected source: `master` `79166ccca151679f0a3a68bff8c2e00bb9ae53e7`; draft [PR #102](https://github.com/vagabond1215/Lineage_Reforged/pull/102) remains unmerged at `d3cd548f6b21aff11c40637c3e16026502f8e6e2` as of this pass.  
Companion: [Concise creator UI and art refresh](character-creator-concise-profile-build-and-ecology-art-refresh-plan-2026-11-17.md), [post-Finalize opening and Save safety](character-creator-post-finalize-world-entry-integration-plan-2026-11-17.md), [world/first Save owner gate](first-world-player-first-world-creator-and-library-implementation-gate-2026-11-17.md), [future traits/Build model](welcome-world-library-character-entry-and-loading-plan-2026-11-11.md).

## 1. Selected owner UI direction (supersedes earlier Backstory + Starting Bundle navigation proposal)

Make **World Entry** the origin/foundation, starter-conditions and opening-story owner, not an extra chapter stapled onto character Backstory. **Suppress selectable Backstory UI for now**. Treat eventual thematic Backstory-like starts (notably World-Stray) as **Prestige/eligibility-unlocked World Entry scenarios**, not a new universal Backstory unlock.

In the standalone design preview, the revised seven *visible* pages are:

`Lineage → Identity → Continent → Region → Settlement → World Entry → Finalize → optional narrative opening → authorized game entry`.

The old selectable **Starting Bundle page is gone** in the preview; the chosen eligible World Entry **projects its own starting supplies** within World Entry and Finalize, not an independent kit-shopping stage. This is a UI product direction **only**. The production eight-step creator and `CharacterCreationFormState` still contain `backstoryId`, `startingBundleId` and validator/source/Save behavior, and **must not have these fields silently removed or set to blanks**. Real product replacement requires an explicit old-save compatibility, versioned rules/receipt, canonical World Entry source and first-publication owner migration. Existing content Backstory data and historical Saves remain retained/readable. No regression to old default feature-off game is authorized.

Future allowed scenarios may expose `Prestige Required` or other real account evidence, but labels are illustrative until exact authority accepts entitlement checks. Do not enable World-Stray from a visible mock choice. Each eligible World Entry must have a real source-verified site/area, owner-accepted NPC/item/route availability and exact-once starter item/coin/action publication. No kit is inferred from the words `Dockside`, `Mine Road`, or `City Gate`.

## 2. Identity page interactions

**Left-hand creator rail**: remove `Forge a Character` and selected World name from the rail (already present in top chrome). Put the character's **Name → HP / MP / Stamina bars and values → Live stats** at the top, before the step navigator. Live stats = the existing source-derived **nine `STR DEX AGI CON VIT INT WIS SPT CHA`** and derived resources, not a duplicated client formula. The name should update as the user types; changes to sex, age, height, physique, nature, focus, lineage, selected Backstory replacement/world entry, Legacy source or owner math all update from one `buildCharacterCreationPreview` source. No real gameplay tick or DB writes for a preview redraw. On narrow screens put vitals in a compact horizontal row and expandable stat grid before scrollable stage tabs.

**Identity content**: keep inline labels and evenly aligned choice columns from prior owner review. Continue to use the real lineage-valid skin/hair/eye color swatch options and legal identity selectors. Name row's **dice-only** button retains name-only generation; `generateRandomCharacterName` from current source is already available.

**New footer centered control**: `Back · [dice] Random · Next`. On the **Identity page only**, Random changes **sex, age, height, physique, nature, focus, skin, hair and eye colors**, but **does NOT change `playerName`** or lineage, account, World, region, settlement, chosen World Entry or Save identity. Use eligible actual `identityCatalog.ageBands`, `heightBands`, `physiqueOptions`, `natureOptions`, `focusOptions`, `skinToneOptions`, `hairColorOptions`, `eyeColorOptions`; all generated IDs must pass the existing form/lineage validation. Current production `CharacterCreationNarrativeScreen.randomizeIdentitySelection()` **also randomizes `playerName`**; refactor carefully before wiring the centered button, or introduce a separate no-name variant. Keep the existing separate full-character randomizer (if exposed elsewhere) as a distinct action. Avoid unbounded random iteration or hidden rerolls in render.

**No redundant visible Identity heading** when stage is already identified by left navigation and number.

## 3. Right portrait panel and prompt pipeline

Right Identity image panel gets a **Generate** button. This is a **portrait generation workflow**, NOT a game asset owner or a fake generated picture in an empty frame. On click, build a deterministic prompt from the selected actual identity option IDs and their **display labels**, then show a readable/editable-for-copy prompt handoff. Do not send account ID, World ID, credentials, name, Save address or historical activity to third parties automatically.

**Mandatory positive prefix exactly:**

`masterpiece, high-resolution, full color, expert shading, photorealistic`

Then contextually add: **fantasy character portrait**, lineage appearance, woman/man descriptor (`beautiful adult woman` / `handsome adult man`), character age band normalized to reliable adult phrasing, stature, physique, legal skin/hair/eye palette labels, **Nature-driven facial expression**, **Focus-driven bearing/clothing**, and **head-and-shoulders framing with arms/hands fully out of frame**. For example, Prime female → `adult in her prime, prime age`, Prime male → `adult in his prime, prime age`; Young → `young adult over age 20`; Mature → `mature adult ... seasoned facial features`. A canonical source may supply different developmental/age bands in future; mapping must explicitly ensure the character is an adult for photorealistic external generation. Do not simply send the isolated word `Prime`.

**Nature expression mapping (visual editorial, not source mechanics):**
- Curious → inquisitive gaze, expressive/attentive eyes, thoughtful smile.
- Resolute → steadfast composed expression, focused confident gaze.
- Gentle → approachable, empathetic, relaxed expression.

**Focus expression/wardrobe mapping:**
- Balanced → grounded composure and practical fantasy attire.
- Martial → disciplined posture, subtly protective practical travel garb.
- Learned → thoughtful scholarly bearing, modest tailored attire.
- Mystic → introspective mystical presence and understated arcane motifs.

**Hands/fingers**: favor high-confidence **chest-up head-and-shoulders framing** in positive prompt (`arms and hands entirely outside the frame, no visible fingers, no objects held`) and mirror forbidden forms in a separate negative list. Since some generators do not reliably honor negative prompts, composition must do most of the work. Use explicit `single adult character` to reduce duplicates.

**Perchance assessment:** The exact third-party page [realisticgerator](https://perchance.org/realisticgerator) is accessible and renders dynamically inside an iframe, but **no stable, documented deep-link that prepopulates that particular generator or an accepted image-return API was verified in this source review**. Separate Perchance experimental/third-party iframe API projects exist but do not authorize copying their internal/verification endpoints into production. Do not circumvent bot challenges, embed a hidden cookie-fetching frame, assume cross-origin iframe DOM access or advertise automatic image import. The immediate reliable UI is an explicit dialog with **Copy Prompt**, **Open Perchance** (new tab), **Import Result** from local PNG/JPG/WebP with file-type/size guard and in-memory preview; the app does not upload or persist the preview. An automatic adapter is a separate future provider integration, subject to the provider's actual agreement/API availability, privacy notice, origin/nonce-validated messages, timeouts, CSP, image storage, moderation and user consent.

**Production asset requirements:** attach a generated portrait to the character only after the user approves the image, the owner defines a licensed portrait asset reference, checks size/mime/dimension, pins approved content hash and implements Save/archive/reload behavior. Until then, the right panel can preview a temporary imported object URL, never a canonical Save field. A portrait does not alter identity stats or World entry eligibility.

## 4. Contextual World Entry supplies and Prestige

The preview demonstrates three **illustrative, non-canonical** pairs:
- Stonevein / **The Mine Road** → travel clothes, water skin, work gloves.
- Highcrown / **The City Gate** → travel clothes, water flask, one meal.
- Starfall Port / **Dockside Arrival** → plain clothes, water flask, travel satchel.

The visible locked **World-Stray Arrival** card is a future Prestige/eligibility scenario only; it is not selectable and cannot infer automatic backstory unlock. Those sample gear strings are **UI copy, not a real item grant**. Source version must resolve `worldInstanceId + worldEntryScenarioId/version + actual start site + available inventory source + account Prestige/heir/Legacy + game mode`, then allocate items and currency atomically once with first publication, tying receipts to the specific scene outcome. No out-of-band bundle selection or repeated entitlement consumption.

**Backward compatibility:** do not remove `backstories.json` or legacy `startingBundleId` from historical Saves. Define a versioned compatibility projection for old Saves; decide how current `backstoryId` influences skills/Legacy/eligibility separately from the new World Entry. Do not assign everyone a previously unlocked special origin. Production source currently validates `startingBundleId` and sometimes backstory selectability; hiding those UI steps without the owner migration would make characters unstartable or cause invisible automatic gifts. Retain the feature-off creator until the new source contract passes acceptance.

## 5. Implementation boundaries and exact UI evidence

The self-contained HTML `lineage-character-creator-world-entry-portrait-preview.html` and source candidate `characterPortraitPrompt.ts` with tests were generated outside the repository. The preview retains account/World mocks and old geography card art paths; it is not a replacement for actual production React/owner data.

**Isolated QA accepted in this pass:**
- `node --check` extracted inline JavaScript: **PASS**.
- Chromium with Playwright `page.set_content` at **1280×850, 768×980, 375×812, 320×700**: each **PASS** on navigation with 7 proposed UI steps, no Backstory/Starting Bundle selectable stages, side rail name/vitals/live nine stats, centered footer Random, name-only dice, all skin/hair/eye color selection, profile prompt rendering with quality prefix/age/Nature/Focus/hands exclusion, link to Perchance, clipboard attempt and local portrait file import, settlement-driven World Entry/gear, return-to-Finalize, no document overflow or JS errors. **These are mock values, not current game stat math or real Save validation.**
- Pure candidate TypeScript `tsc --project tsconfig.json`: **PASS**. `node --test tests/characterPortraitPrompt.test.cjs`: **9/9 PASS**, testing quality-first, adult age wording by sex, Nature/Focus interpretation, colors, no hands, deterministic no-private-data and input label sanitation.
- **NOT_RUN:** real React creator integration/typecheck/Vite, World owner + Save first publication, approved entitlement/scene/inventory, official Perchance render, third-party provider API acceptance, production portrait asset storage/reload, actual source-derived live stat values.
- Source baseline `master` for this document is **unchanged production game code**. All export buttons remain mock only, and previous art-retention source pins remain.

**Next repo-capable Codex slices:**
1. On authenticated synced checkout, establish baseline/source SHA and actual backstory, starting bundle, character/World Save validators.
2. **Feature-gated UI only:** side live `preview` relocation, centered no-name Identity random, portrait prompt modal and temporary local result, current legacy eight-step rail intact behind feature-off flag. Tests confirm no account/save mutation.
3. Independently design/approve versioned World Entry scenario/source and Prestige policy, Backstory/Bundle migration with old Save compatibility, real start scene and gear owners.
4. Only after accepted World browser create/character association/publication in PR #102 line, replace the Backstory/Bundle UI with authorized World Entry and project real supplies. Then exact-once Save and restart/archives, 320/375/768/1280 desktop and mobile, keyboard/ARIA, feature-off regression, separately approved activation.

Preserve `L3B_BROWSER_CREATE_HELD`, `HOLD_SELECTED_ATOMIC_ACTIVATION`, `HOLD_STAGING_PUBLICATION`. No merge, actual gameplay unlock, Save writing or product version promotion is granted by this design documentation.
