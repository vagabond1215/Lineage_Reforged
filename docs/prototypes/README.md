# Interactive UI prototype: cross-thread continuity and in-ChatGPT preview

Updated: **2026-11-19**. Repository: **[vagabond1215/Lineage_Reforged](https://github.com/vagabond1215/Lineage_Reforged)**.

This page is the **starting point for every new ChatGPT/Codex thread working on the standalone Lineage: Reforged UI preview**. Read it alongside root `AGENTS.md` and the relevant design/implementation contracts. The goal is to preserve the entire interactive prototype and the correct presentation method without reconstructing an earlier chat.

## Source of truth and version selection

- **Default-branch baseline:** [`docs/prototypes/lineage-character-creator-eight-stage-conditions-2026-11-18.html`](lineage-character-creator-eight-stage-conditions-2026-11-18.html). This is a *complete, self-contained HTML/CSS/JavaScript page*, not a screenshot, external iframe, or a React production entry point.
- **Active UI-review candidate as of 2026-11-19:** [draft PR #103](https://github.com/vagabond1215/Lineage_Reforged/pull/103), branch `codex/creator-cosmetic-color-continuity-2026-11-19`. It contains cosmetic-palette continuity, gold active-step styling, the six-season World Creator, unified full-width top/sub-bars, concise entrance and icon-only navigation, plus compact **4:3 Continent/Region/Settlement location cards** with ecology-grounded resource overlays. Latest HTML commit: `ab1249b00474b0d93196e8ce2ed28dd1ed41f0bf`, exact blob SHA: `d6aff660043da1918bcd73d3d8eb6c25a3d6e0d4`. The November 19 signed-out entrance copy and no-Home correction from the conversation-only second preview are included. **This is unmerged review work**, not a default-branch change.
- **World Creator contract:** [player-first World Creator, World Library and character entry gate](../design/first-world-player-first-world-creator-and-library-implementation-gate-2026-11-17.md).
- **Character Creator design contract:** [eight-stage Identity, Build/Aptitude and Conditions review](../design/character-creator-eight-stage-identity-build-aptitude-conditions-review-2026-11-18.md).

**Always fetch live GitHub refs and open PR state first.** Check the exact default-branch commit, candidate PR head, changed paths, and blob SHA before choosing the review source. The links above are pointers, not authorization to assume a particular PR is still open or is already integrated. A previous conversation attachment may be an older snapshot. Treat it as a visual/reference artifact unless the user explicitly selects it for promotion and it has been compared against current repository source. Do not silently replace a newer GitHub version with an older upload.

## Show the real interactive preview *inside ChatGPT*

For requests such as “show the updated preview”, “open in the GPT browser”, or “continue from the last UI preview”:

1. **Retrieve the complete source bytes** from the selected, live branch of the exact HTML file. Prefer an authenticated repository checkout or a direct raw GitHub file download to the current session's workspace. The GitHub connector can locate and inspect source, but a connector text response **is not itself an attached local HTML file**.
2. **Write or copy the complete HTML itself** to an actual `.html` file in the current conversation's output workspace. Check that the exact file exists, that it begins with `<!doctype html>`, contains the CSS and inline script, and preferably that its content matches the selected GitHub blob/commit. If using a tool that can only read remote text, use an available file-writing facility; if none is available, disclose the limitation rather than manufacturing an attachment URL.
3. **Present that verified local HTML file as the interactive ChatGPT attachment**, so the user can open it and use ChatGPT's preview-pane expand control when supported by their client. Attach actual content, not a “launcher” file that loads something else.
4. **Never substitute an HTML wrapper/iframe** pointing to `github.com`, `htmlpreview.github.io`, `raw.githack.com`, or another external site. ChatGPT's preview sandbox may block embedded sites and display a blank page. An external link to GitHub source is useful as a separate fallback, **not** the requested in-app preview.
5. **Do not introduce Google Drive as an intermediate transfer mechanism.** This project preview is already preserved in GitHub. Do not send users through Drive, hosted-page viewers, or repeated reuploads when the repository's full HTML can be retrieved directly.
6. A `sandbox:/mnt/data/...` link is valid **only after the exact file has been created or verified in the current runtime**. Never infer a local file path from a GitHub path, display name, or old conversation. ChatGPT may not support rendering/expanding HTML in every client; state that limitation accurately instead of asserting the preview was displayed.

**Expected user-facing delivery:** one direct, verified, self-contained `.html` preview attachment, a concise description of the change and checks, and optionally a separate GitHub source/PR link. Do not offer only a screenshot or code listing when the user asks for an interactive preview.

## Features and continuity to preserve

The prototype's route starts at the branded Splash/Log In/Create Account, then Welcome with Chronicle (selectable) / Persistent (held), World Library, optional in-memory World Creator, World Overview, Characters and the eight-stage Character Creator. The eight stages are:

1. Lineage
2. Identity
3. Continent
4. Region
5. Settlement
6. World Entry
7. Summary
8. Opening

Maintain ten playable lineage palettes: Human, Dwarf, Gnome, Halfling, Elf, Dark Elf, Half Troll, Half Orc, Half Goblin and Half Merfolk. The extended color palette is visually cosmetic; a newly invented color is not a gameplay rule or a reason to mark its swatch “unverified” to players. The source/proposal provenance of palette data still matters to production integration and must not be silently converted into authorized Save IDs. Color families are displayed in a column-first progression from upper-left toward lower-right, with evenly spaced swatches; preserve the responsive skin, hair and eye grids unless the user asks to change them.

UI requirements recorded by owner review:

- Creator top chrome shows local time followed directly below by World time. An unstarted/unavailable non-real-time World shows `--:--`; an actual real-time World needs server-backed clock data. Do not invent live server time in the demo.
- Contextual creator navigation uses **Back** on the left, **Home** in the center and **Next** on the right, not breadcrumb trails. Back, Home and Next are icon-only controls (**◀**, accessible SVG house, **▶**) with full accessible names/tooltips; the gold gradient/pill treatment and matching active left-rail step remain. This is in draft PR #103.
- Identity has a compact **Detail** eye toggle for conditional number explanations; its icon indicates shown/hidden. Attributes are presented as base-10 numeric values, with no misleading “modifier from 10” badges.
- Cosmetic palette changes must not invalidate a World Entry scenario, Summary review, or chosen opening decision; gameplay-affecting identity/build changes may still revalidate them. This correction is in draft PR #103, not necessarily on `master`.
- World Creator shows Difficulty (Favored/Mortal/Forsaken), overall Temperature (Cold/Normal/Hot), Rainfall (Dry/Normal/Wet) and **the canonical six-season calendar** (Scenario Default, Deepfrost, Thaw, Waking, Swelter, Harvest, Withering). Exact season labels and order come from [`packages/content/base/world/calendar.json`](../../packages/content/base/world/calendar.json), not Earth's four-season shorthand. This update is in draft PR #103; it retains only in-memory demo labels and does not change the game clock. Further adjustments, Persistent Worlds and Living Worlds remain deferred concepts.
- The **unified application chrome** uses a full-width top bar with the emblem and title aligned at its left and a separate full-width contextual sub-bar underneath. Apply the sub-bar to Splash, Log In, Create Account, Welcome/Game Mode, World Library, Create World, World Overview, Characters and the Character Creator. The creator no longer uses a separate left-side brand rectangle; Back and centered Home use the existing gold pill treatment. These layout refinements are in draft PR #103 pending owner review.
- Preserve account screens, game-mode selection, navigation between World Library/Overview/Characters and creator, and the name and choice preservation/validation paths. Do not create real accounts, World instances, characters, game rules, calendar changes, Prestige entitlements or Saves from the mock.


### November 19 concise player-facing preview review

The owner considers the prototype nature understood. **Do not repeat large design-only/account-not-connected/Save-not-written warning panels on each screen.** Remove redundant player-facing copy; preserve real unavailable/locked choices and the truthful behavior of disabled or in-memory-only actions. Do not convert UI cleanup into real account, World, character or Save authority. On the signed-out entrance, retain “A chronicle of lives, choices and legacies. Return to your account or begin a new journey.” above the account card; replace duplicate game titles / “Choose how to enter the world” with “Begin your line. Reforge its story into a legacy.” inside the card above Log In / Create Account. The Welcome/game mode screen retains a personalized greeting without a repeated branded eyebrow. Icon-only subbar controls require an accessible label and tooltip; context-specific Next labels still describe where a click goes. Draft PR #103 contains the current implementation.

### November 19 geography card refresh (draft PR #103)

- **Continent, Region and Settlement** use matching 4:3 scenic cards, 3 per row on wide desktop, 2 per row on tablet and compact mobile. Cards retain original ids, selection, dependent geography, validation and all 88 settlement options; every tile remains uniform instead of expanding the selected tile. Visible copy is mostly the name, one biome/settlement-type line, and small resource emblems over the picture.
- The resource overlay follows the existing eight `WorldRegionResourceTone` categories from [`worldSelectionCatalog.ts`](../../apps/rpg-ui/src/game-shell/worldSelectionCatalog.ts): Timber, Field Crops, Orchards, Garden Produce, Livestock, Fish and Game, Ore, Stone. Region icons follow source economic/environmental descriptors (and existing authored region presentation overrides). Settlement icons follow the existing keyword mapping from authored settlement roles, domestic goods and enclosing region. They are **indicative profile/economy icons**, not precise harvest sites, storage guarantees or item grants.
- The location data used for the preview is read from [`regions.json`](../../packages/content/base/world/regions.json) (5 continents + 4 island systems + 28 child subregions) and [`settlements.json`](../../packages/content/base/world/settlements.json) (88 settlements). Source image assignments are from `worldSelectionCatalog.ts` and the [100-file retention manifest](../design/character-creator-geography-art-retention-manifest-2026-11-17.json): 9 top-level continent images (plus 9 selected duplicates), 13 subregion images, 69 settlement images. Missing **15 region and 19 settlement** images get neutral, location-labelled visual fallback rather than an image for another place. Only resource category icons are reused across locations.
- The HTML optionally loads **pinned existing GitHub PNG files** directly by URL; when network access is unavailable (including an isolated ChatGPT preview), it keeps an intentional neutral scenic placeholder and inline vector fallback resource icon. No art files were altered, embedded or newly accepted.
- **Map status caution for implementers, not player-facing warning copy:** The [November 17 Option 2 full-world atlas](../design/first-world-option2-g2e4a-full-source-global-overview-reproduction-2026-11-17.md) is a representative source-derived display, not canonical coastline, local walkable geometry, resource spawn map or accepted source-to-pixel registration. Keep the current nine-parent/28-region/88-settlement choice catalog intact until a separately accepted geography/content change. Do not infer precise resource abundance or accessibility from a painted tile.
- Standalone inline script syntax and actual browser interaction/selection/overflow were checked at 1440, 1280, 768, 375, 320 px with optional remote imagery intentionally blocked to verify fallback. Tested Kaelvar → Auric Marches → Coppergate and Myridian Chain → Starfall Isle → Starfall Port (no wrong-neighbor art). No JS errors, document horizontal overflow or 4:3 aspect mismatch. This **does not** establish full 88-location browser art loads, React integration or engine/Save gameplay acceptance.

## Review and testing protocol

For a change, start from the currently selected GitHub source, keep scope narrow, and avoid rebuilding the design from conversation memory. Before presenting a changed preview:

- Verify HTML integrity and inline JavaScript syntax; check modified event handlers and semantics (especially navigation, selected states and clock fallback).
- Where a controlled browser is available, navigate Splash → demo account → Chronicle → World Library → World Creator/Overview → Characters → eight creation stages. Check at representative desktop/tablet/mobile widths (ideally 1440, 1280, 768, 375 and 320 CSS px), keyboard/focus behavior, console errors and horizontal overflow. **Record exactly which checks were actually run**, not an inherited old-thread PASS.
- Verify all ten lineage palette sets when changing palette geometry; verify World setting draft and name preservation when changing World Creator.
- Separate **standalone prototype checks** from TypeScript/React build, genuine account/World APIs, engine, Save/restart and native-v3 acceptance. Do not claim those production gates passed because the mock works.
- Keep production activation and Save owner holds intact. Follow root `AGENTS.md`, the repository-first protocol and branch-lifecycle rules for any production implementation.

## Durable cross-thread handoff checklist

At the end of each UI preview change, record in the repository (in a focused dated note if necessary) the **exact source branch, commit/blob SHA, PR status, changed paths, visual decisions, validation actually executed, remaining holds, and the next requested action**. Link this entry point from README/AGENTS rather than forcing the user to restate how preview files should be delivered. Do not treat a historical chat log supplied for context as a new implementation request.

For a new thread, this is enough to begin: **“Continue the Lineage Reforged interactive UI preview using `docs/prototypes/README.md`; inspect live GitHub source and PRs, then show the full self-contained HTML inside ChatGPT.”**
