# Interactive UI prototype: cross-thread continuity and in-ChatGPT preview

Updated: **2026-11-19**. Repository: **[vagabond1215/Lineage_Reforged](https://github.com/vagabond1215/Lineage_Reforged)**.

This page is the **starting point for every new ChatGPT/Codex thread working on the standalone Lineage: Reforged UI preview**. Read it alongside root `AGENTS.md` and the relevant design/implementation contracts. The goal is to preserve the entire interactive prototype and the correct presentation method without reconstructing an earlier chat.

## Source of truth and version selection

- **Default-branch baseline:** [`docs/prototypes/lineage-character-creator-eight-stage-conditions-2026-11-18.html`](lineage-character-creator-eight-stage-conditions-2026-11-18.html). This is a *complete, self-contained HTML/CSS/JavaScript page*, not a screenshot, external iframe, or a React production entry point.
- **Active UI-review candidate as of 2026-11-19:** [draft PR #103](https://github.com/vagabond1215/Lineage_Reforged/pull/103), branch `codex/creator-cosmetic-color-continuity-2026-11-19`. It contains the cosmetic-palette continuity fix and the Back/Home/active-step gold styling requested on 2026-11-19. **This is unmerged review work**, not a default-branch change.
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
- Contextual creator navigation uses **Back** on the left, **Home** in the center and **Next** on the right, not breadcrumb trails. Back and Home match Next's gold gradient / pill treatment in the 2026-11-19 review candidate; the active step in the left rail does too.
- Identity has a compact **Detail** eye toggle for conditional number explanations; its icon indicates shown/hidden. Attributes are presented as base-10 numeric values, with no misleading “modifier from 10” badges.
- Cosmetic palette changes must not invalidate a World Entry scenario, Summary review, or chosen opening decision; gameplay-affecting identity/build changes may still revalidate them. This correction is in draft PR #103, not necessarily on `master`.
- World Creator shows Difficulty (Favored/Mortal/Forsaken), overall Temperature (Cold/Normal/Hot), Rainfall (Dry/Normal/Wet) and Starting Season (Scenario Default/Spring/Summer/Autumn/Winter). It retains chosen labels only in *in-memory demo World records*. Further adjustments, Persistent Worlds and Living Worlds remain review/deferred concepts.
- Preserve account screens, game-mode selection, navigation between World Library/Overview/Characters and creator, and the name and choice preservation/validation paths. Do not create real accounts, World instances, characters, game rules, calendar changes, Prestige entitlements or Saves from the mock.

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
