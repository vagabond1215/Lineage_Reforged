# Future Content Backlog

This file tracks content and systems that are intentionally deferred.

## Update Policy

- Review this file alongside `README.md` before substantial Codex command runs or content edits so deferred intent is considered up front.
- Update this file on every Codex run that adds, defers, narrows, or re-scopes future content.
- Add new backlog items as soon as they are deferred.
- Revise prerequisites and implementation notes when the plan changes.
- Remove items only when the underlying content and wiring are actually implemented.

## Run Notes

- 2026-04-06: Moved 47 loose root settlement image intake files into canonical `apps/rpg-ui/public/character-creator/settlements/` runtime filenames, normalized the mismatched `Riverthorne` and `SeaBanner` intake names onto the canonical `riverthrone` and `seabanner` settlement slugs, archived unmatched `Mossfen.png` under `unused assets/settlements/2026-04-06-unmatched-intake/`, extended the settlement card-art registry so the new images can be used in the character creator, and regenerated `apps/rpg-ui/dist` through `npx vite build`; remaining settlement-art gaps are narrowed below.
- 2026-04-04: Widened the occupied save-card text block so the name and summary lines can use the full inner card width below the delete button, shortened the save-card height to better match the contained copy, reduced the character-name size slightly again, and centered `Empty` in unoccupied cards; `apps/rpg-ui` passes `npx vite build`, and no new deferred follow-up was introduced by this UI pass.
- 2026-04-04: Nudged the main-menu save-card slot header row downward to align the slot label and save timestamp with the trash button center, then lowered the remaining occupied-card copy while shrinking the character-name and metadata typography slightly for a cleaner compact stack; `apps/rpg-ui` passes `npx vite build`, and no new deferred follow-up was introduced by this UI pass.
- 2026-04-04: Tightened the compact launcher save-status banner again so its slate-blue accent state now matches the active game-data page button border, fill opacity, and shadow treatment exactly in light mode; `apps/rpg-ui` passes `npx vite build`, and no new deferred follow-up was introduced by this UI pass.
- 2026-04-04: Reworked the launcher save-status notice into a compact single-line banner by removing the unused tone eyebrow, switching the light-theme accent state to a slate-blue panel with light text and standard borders, replacing the safe-return copy with a saved-to-slot or quicksave timestamp message, and auto-dismissing that compact save banner after 15 seconds; `apps/rpg-ui` passes `npx vite build`, and no new deferred follow-up was introduced by this UI pass.
- 2026-04-04: Refined the light-mode main-menu game-data ledger by moving the Cataclysm wordmark back to the left, re-centering Continue, returning theme/settings beside Exit, strengthening the visible active page state, darkening the shared notice banner treatment, and compacting occupied save cards into one-line names plus two-line origin/location/funds summaries with inline save timestamps; `apps/rpg-ui` passes `npx vite build`, and no new deferred follow-up was introduced by this UI pass.
- 2026-04-04: Moved the new root-level Kaelvar and Valtherion settlement art intake into canonical `apps/rpg-ui/public/character-creator/settlements/` filenames, wired settlement card art overrides plus region-style image-backed settlement cards with fallback for uncovered starts, and regenerated `apps/rpg-ui/dist` through `npx vite build`; `npm.cmd run build` still stops on the pre-existing unrelated typecheck failures across `apps/rpg-ui/src/features/*`, `src/runtime/uiViewModel.ts`, `src/game-shell/gameplayLoop.ts`, `packages/shared/time/src/index.ts`, and `packages/shared/types/src/settlement-institutions.ts`.
- 2026-04-03: Replaced the shared settings icon again with a more conventional centered cog outline after the previous custom gear still read slightly off-center in the launcher UI; `apps/rpg-ui` should be revalidated through the normal Vite build after this UI pass, and no new deferred follow-up was introduced.
- 2026-04-03: Tightened two remaining light-mode character-creation contrast issues by giving unlocked step-rail circles a darker slate-on-pale-blue treatment and switching the live-summary HP/MP/Stamina labels and values to darker theme-aware tones with a light outline so they stay readable on pale cards; `apps/rpg-ui` should be revalidated through the normal Vite build after this UI pass, and no new deferred follow-up was introduced.
- 2026-04-03: Refined the light-mode main menu presentation by replacing the save-page selector highlight with a slate-blue active state, rebuilding the main menu header into a docked slate-blue bar with centered Continue access, swapping manual slot labels from Roman numerals to Arabic numbers, simplifying empty-slot cards down to `Slot N` plus `Empty`, and replacing the shared settings glyph with a cleaner standard gear outline; `apps/rpg-ui` should be revalidated through the normal Vite build after this UI pass, and no new deferred follow-up was introduced.
- 2026-04-03: Hardened the identity-layer cleanup by finishing the creator/snapshot/player-origin semantic rename from `background*` to `backstory*`, removing the dead starter class/background template file, enforcing backstory starting-ability and knowledge-track allowlists in content validation plus snapshot assembly, requiring explicit canonical starting-bundle choice selections with no silent first-option fallback, and moving settlement lawful-start authorization onto a deterministic backstory access registry without changing combat/spawn ownership; focused identity-content and settlement-runtime tests should now cover the stricter rules, `apps/rpg-ui` still needs normal build validation, and `tool:content-lint` is still expected to stop on the pre-existing unrelated `packages/content/base/world/flora.json` record `flora.alder_sapling.harvest.active`.
- 2026-04-03: Replaced the mixed character-creation `background + path/class` model with canonical authored `backstories` and `starting_bundles`, moved settlement-lawful-start gating onto backstory-driven standing, made new characters classless and jobless at creation, added backstory knowledge familiarity to starter state, and removed the remaining creator-facing elemental-destiny wording without changing combat/spawn ownership or spell authoring; targeted schema, settlement-institution, and save-roundtrip tests now pass, `apps/rpg-ui` passes `npx vite build`, and `tool:content-lint` still stops on the pre-existing unrelated `packages/content/base/world/flora.json` record `flora.alder_sapling.harvest.active`.
- 2026-04-02: Cleaned the character-creation identity layout by moving the large full-identity randomizer above the name/sex controls, removing the extra Randomize Identity and Name/Height/Age/Build section labels, and replacing those headings with tighter separator lines so the identity stack reads cleaner without changing the underlying selection logic; `apps/rpg-ui` passes `npx vite build`, and no new deferred follow-up was introduced by this UI pass.
- 2026-04-02: Expanded the character-creation identity step with lineage-and-sex-aware age ranges, a large full-identity randomizer, a wisdom-oriented replacement for the old Average build, and a single-sentence live-summary identity narrative while wiring the new age band through form validation, preview attribute math, and saved identity profile state; `apps/rpg-ui` passes `npx vite build`, and no new deferred follow-up was introduced by this UI/content pass.
- 2026-04-02: Simplified the character-creation discretionary attribute step by replacing the redundant `Current <value>` row label with concrete gameplay-facing inline attribute feeds on each stat row and removing the separate lower attribute-description card grid; `apps/rpg-ui` validation should continue through the normal Vite build, and no new deferred follow-up was introduced by this UI pass.
- 2026-04-02: Normalized the player identity/progression cleanup pass onto the approved canonical model by expanding the skill tree to the missing combat/survival/resource/crafting/knowledge/settlement/leadership branches, replacing drifted title names with the approved domain-based families, rewriting lineage traits to the approved innate packages, replacing the old `spell.arcane.*` placeholder set with the finalized flat placeholder spell list, and retargeting combat hooks, abilities, items, quests, starter/demo/save fixtures, and tests to the new ids without changing combat/spawn ownership; focused combat/progression/schema/save tests pass under `node --test --test-isolation=none`, and `npm.cmd run tool:content-lint` still stops on the pre-existing unrelated `packages/content/base/world/flora.json` record `flora.alder_sapling.harvest.active`.
- 2026-04-02: Upgraded the shared RPG UI tooltip to support opt-in portal rendering plus side/alignment placement, then moved character-creation region and settlement resource-icon tooltips onto that portal path with left-start anchoring so they render above clipped card shells instead of being cut off at the card edge; `apps/rpg-ui` passes `npx vite build`, and no new deferred follow-up was introduced by this UI pass.
- 2026-04-02: Tightened character-creation selector parity by removing the extra collapsed continent-card height, rebuilding settlement cards onto the same collapsed card shell used by regions with settlement-derived resource icons and consistent population badges, and expanding every playable lineage's skin, hair, and eye palette by one additional row with broader lore-friendly variation; `apps/rpg-ui` now passes `npx vite build`, and no new deferred follow-up was introduced by this UI/content pass.
- 2026-04-02: Rebuilt the player identity and progression layer around a hierarchical skill tree, lineage trait packages, canonical milestone titles, a baseline active-ability catalog, a full placeholder spell catalog, structured skill-effect and item-use combat hooks, and content-driven combat action discovery; starter/demo/save/combat fixtures now use the canonical ids, focused player/combat/save/schema tests pass under `node --test --test-isolation=none`, and `tool:content-lint` still stops on the pre-existing unrelated `packages/content/base/world/flora.json` record `flora.alder_sapling.harvest.active`.
- 2026-04-02: Recovered the partial combat/spawn foundation by verifying ownership across `GameState`, `PlayerState`, and `SessionState`, extending monster/combat/spawn schemas and `content-lint` coverage for combat roles, tactics presets, encounter templates, spawn profiles, and monster combat fields, normalizing the remaining canonical app/demo/test fixture ids that still referenced removed player or world records, adding focused combat/spawn unit coverage plus save/schema validation, and completing the missing engine `.js` bridge layer so the top-level `game-engine` entrypoint imports cleanly again; focused validation now passes and `tool:content-lint` still stops only on the pre-existing unrelated `packages/content/base/world/flora.json` record `flora.alder_sapling.harvest.active`.
- 2026-04-02: Replaced the FFXI-seeded player placeholder catalogs with a canonical foundation pass: skills now use layered system/knowledge/specialization records plus progression tracks, knowledge tracks, skill-effect profiles, reusable trials, spell scaling channels, and item use profiles; dependent quest, crafting, item, schema, shared-type, database, lint, and economy surfaces were retargeted to the new ids, focused source-level tests now pass, and `tool:content-lint` now gets past BOM-prefixed JSON parsing but still stops on a pre-existing invalid `packages/content/base/world/flora.json` record (`flora.alder_sapling.harvest.active`) outside this player/progression scope.
- 2026-03-30: Replaced the selected continent and region description-panel faux inner glow with a true seam border, widened the expanded continent description panel slightly so its copy block reads less cramped, and re-anchored the collapsed hover-title gradient overlays to the card edge so their left/top/bottom contours now nest cleanly against the card border; no new deferred follow-up was introduced by this UI pass.
- 2026-03-30: Added a light-mode-only text shadow treatment to the character-creation live summary resource-bar labels and values so the colored HP, MP, and stamina readouts stay legible against the pale summary card background; no new deferred follow-up was introduced by this UI pass.
- 2026-03-30: Fixed the character-creation light-mode step rail so active and completed step-number circles now use dark readable numerals on their tinted fills instead of inheriting low-contrast light text; no new deferred follow-up was introduced by this UI pass.
- 2026-03-30: Removed the selected continent and region ambient blur filler so right-anchored art no longer creates a fuzzy strip beside the left description panel, added a cleaner theme-aware edge shadow on those description panels, switched all survivability difficulty tags to the same opaque bordered treatment in both collapsed and selected states, and narrowed the collapsed hover-title gradient overlays so more card art remains visible behind the title; no new deferred follow-up was introduced by this UI pass.
- 2026-03-30: Changed the collapsed lineage, continent, and region card titles from opaque hover pills to vertically centered semitransparent gradient overlays keyed to the same tone-specific selection gradients as the expanded card copy, increased the collapsed title size, and tightened the light-mode identity-step contrast by giving selected sex, height, and build controls real light-mode selected surfaces plus darker selected text while also strengthening the light-theme border and muted-text tokens for creator inputs, separators, and swatch edges; no new deferred follow-up was introduced by this UI pass.
- 2026-03-30: Created a root-level `unused assets/continents` archive for inactive continent art, moved the previous active continent image set out of the live `public` and `dist` folders into that archive, moved the loose root-supplied continent images into the canonical `apps/rpg-ui/public/character-creator/continents/` filenames with matching selected variants, mirrored the finalized active set into `apps/rpg-ui/dist/character-creator/continents/` because the UI build is still blocked elsewhere, and documented active-versus-archived asset handling rules in `README.md`; no new deferred follow-up was introduced by this asset-management pass.
- 2026-03-30: Refined the character-creation collapsed card presentation so lineage, continent, and region cards now use width-fit art with hover-only name labels, restored the expanded lineage card art behavior while enlarging the selected lineage stat rail typography slightly, removed the opaque collapsed region/continent header bars around survivability and resource markers, and retuned expanded continent cards to anchor art toward the bottom-right while giving the left text panel a modest width and type increase; no new deferred follow-up was introduced by this UI pass.
- 2026-03-30: Added launcher theme toggles to the main menu and settings screen, fixed the light-mode settings back-button contrast, shifted the light-mode UI palette from sepia toward light gray and slate-blue surfaces, changed collapsed character-creation selector cards to keep art visible by default and reveal descriptions on hover, and switched continent and region selector art to full-height fitted presentation while leaving settlement cards on themed decorative backgrounds because no authored settlement image set exists yet; no new deferred follow-up was introduced by this UI pass.
- 2026-03-30: Refined the new island-chain subregions by finalizing the Zenith Isle and Glasswake Quay naming pass, fixed `content-lint` so subregions can legally belong to island systems, added child-island associations to the fine-grained Foammarket Ferry, Lantern Deepwater, and Nacredeep Basin map features while preserving macro island-system tags, and confirmed the current authored travel and trade layers already resolve through settlement and hex links without requiring broader route-network rewrites; no new deferred follow-up was introduced by this data pass.
- 2026-03-30: Replaced the character-creator continent card art with the new root-supplied continent images while preserving the existing card asset slots, and split the Myridian Chain, Lantern Isles, Serpent's Wake, and Dawnreach Isles into named child island subregions wired through regions, localities, settlements, and world hexes so island-region selection no longer repeats the parent island-system name; no new deferred follow-up was introduced by this UI/content pass.
- 2026-03-29: Added authored Draemor region presentation overrides for the Heart Basin, the Emerald Mantle, and the Stormcap Coast, moved their new region art into the character-creator region asset folder, and supplied matching description/resource tooltip content; no new deferred follow-up was introduced by this UI/content pass.
- 2026-03-29: Added authored Serathyl region presentation overrides for Sailor's Verge, the Green Reach, and the Windward Spine, moved their new region art into the character-creator region asset folder, and supplied matching description/resource tooltip content; no new deferred follow-up was introduced by this UI/content pass.
- 2026-03-29: Added a light-mode-only contrast pass across the character creator by making the sticky header, art-backed preview text, selected continent and region split panels, lineage stat rail and action pills, settlement overlay text, tooltips, and scrollbars theme-aware without changing dark-mode behavior; no new deferred follow-up was introduced by this UI pass.
- 2026-03-29: Increased collapsed region resource icon size by roughly 25 percent and expanded region resource icon size by roughly 50 percent through the shared card-icon sizing helper; no new deferred follow-up was introduced by this UI pass.
- 2026-03-29: Disabled pointer capture on the selected region-card foreground spacer layer so the full left description panel can own wheel and hover input instead of limiting scroll detection to the exposed inner text block; no new deferred follow-up was introduced by this UI pass.
- 2026-03-29: Moved the expanded region-card resource icons onto the image layer beside the difficulty badge, increased the selected resource icon size again, and added a light transparent shadow so the icon art reads more clearly over bright backgrounds; no new deferred follow-up was introduced by this UI pass.
- 2026-03-29: Moved the expanded continent difficulty pill out onto the image corner and switched it to the same opaque selected-state treatment used by region cards so the continent description panel keeps its full width; no new deferred follow-up was introduced by this UI pass.
- 2026-03-29: Reduced the expanded region-card resource icon row spacing and side inset so five-icon sets have a better chance of staying on one line at the current larger icon size; no new deferred follow-up was introduced by this UI pass.
- 2026-03-29: Expanded the selected region-card wheel-capture zone to the full left description panel, removed the left-panel tooltip clipping so region resource icon hovers can surface their labels, enlarged the region resource icons again, and switched the selected region difficulty pill to a fully opaque image-corner treatment; no new deferred follow-up was introduced by this UI pass.
- 2026-03-29: Moved the expanded region difficulty pill onto the image corner, hid the selected region-description scrollbar chrome, routed hover and focus wheel input into the description pane, and increased the region resource icon size again while keeping tooltip targets on the icon art; no new deferred follow-up was introduced by this UI pass.
- 2026-03-29: Compressed the collapsed region-card header by moving the resource icon strip inline with the region title while keeping the difficulty badge on the right; no new deferred follow-up was introduced by this UI pass.
- 2026-03-29: Tightened the selected region-card panel interaction so wheel input stays in the scrollable description area, moved the region difficulty pill to a top-right badge position, and resized the image-backed resource icons into a denser single-row layout; no new deferred follow-up was introduced by this UI pass.
- 2026-03-29: Reworked the character-creation region cards to use the same split-panel selected layout as continent cards, added authored Valtherion region art/descriptions plus image-backed region resource icons and region difficulty tags, and left settlement-card presentation as the remaining older flow; no new deferred follow-up was introduced by this UI/content pass.
- 2026-03-29: Replaced pureblood orc, goblin, troll, and merfolk demographic distributions with half-lineage equivalents in canonical world data, then added the first authored Kaelvar region art and explicit region presentation overrides; no new deferred follow-up was introduced by this UI/content pass.
- 2026-03-29: Added the human secondary lineage card image and changed expanded lineage cards to start on primary art and alternate to secondary art on a timed cycle while expanded; no new deferred follow-up was introduced by this UI/content pass.
- 2026-03-29: Wired secondary lineage and continent character-creation card art into the RPG UI and isolated region-card resource tooltip hover state; no new deferred follow-up was introduced by this UI/content pass.
- 2026-03-29: Expanded the character-creation lineage name pools across all playable races; no new deferred follow-up was introduced by this content pass.

## Deferred Systems

### Player Identity And Progression

#### Broader milestone-title authoring beyond the representative canonical tracks

- Status: deferred
- Prerequisite: confirm which additional skill families should receive authored 50 / 100 / 125+trial title tracks before expanding beyond the current representative combat, crafting, magic, knowledge, and reserved faith samples
- Intended owner: `packages/content/base/player/titles.json`, `packages/content/base/player/trials.json`, and the player progression/title helpers
- Intended implementation:
  - keep the current pass limited to the approved naming convention plus a representative authored title set instead of auto-generating titles for every skill
  - add wider authored title coverage only after milestone ownership is decided for more weapon, craft, school, knowledge, settlement, and leadership tracks
  - preserve canonical authored records and trial-linked mastery milestones rather than falling back to freeform runtime labels

#### Faith or divine title expansion after faith progression surfaces exist

- Status: deferred
- Prerequisite: authored faith/divine progression tracks, milestone sources, and associated trial or reputation ownership do not exist yet; only the reserved title family scaffold is in place
- Intended owner: player title content plus future religion or divine progression systems
- Intended implementation:
  - keep the reserved `faith` family limited to `Acolyte`, `Votary`, and `Avatar` scaffolding until divine progression has canonical source skills, tracks, or equivalent milestone owners
  - add real faith-title records only when religion-aligned progression sources can grant them cleanly
  - keep the ownership with authored title content and progression helpers instead of ad hoc runtime title generation

#### Spell branching and deeper combat-resolution follow-up after the flat placeholder set is exercised

- Status: deferred
- Prerequisite: the finalized flat placeholder spell catalog now exists, but spell trees, branch unlock rules, richer status resolution, and generated-item runtime handling are still intentionally light
- Intended owner: `packages/content/base/player/spells.json`, `packages/content/base/player/skill_effects.json`, and the game/player combat-resolution layers
- Intended implementation:
  - keep the current pass on flat canonical placeholders, validated scaling channels, and content-driven action discovery only
  - add spell-branch progression, richer status and buff resolution, berry-item runtime consumption rules, and broader school-specific combat formulas in a later progression/combat-resolution pass
  - treat the current spell hooks and generated-item metadata as the canonical bridge into that later implementation instead of layering interim compatibility aliases back in

#### Progression-based elemental affinity system after non-restrictive character metadata exists

- Status: deferred
- Prerequisite: character creation, lineage, backstory, and starter data no longer enforce elemental restrictions; the next prerequisite is deciding what non-blocking affinity metadata should live on progression or discovery systems without becoming a creation lock
- Intended owner: player progression content and helpers, not lineage traits, backstories, or starter bundles
- Intended implementation:
  - keep creation-time character data element-neutral so no lineage, backstory, or starting bundle blocks spell or school access
  - add future affinity state as progression-earned or play-earned metadata only after its ownership is defined cleanly
  - keep world, item, crystal, catalyst, and infrastructure affinity rules separate from character progression affinity

#### Affinity growth and antagonistic element interactions after progression ownership is defined

- Status: deferred
- Prerequisite: a non-restrictive progression-owned affinity model must exist first; antagonistic element rules should not be reintroduced through creator data or starter content
- Intended owner: player progression systems plus later combat or status-resolution layers
- Intended implementation:
  - add affinity growth through use, study, trials, or equivalent progression sources instead of fixed creation choices
  - model opposing or antagonistic element interactions only after the owning progression state is stable
  - keep those interactions descriptive or additive at first rather than turning them into hard access locks

#### Affinity integration into skill progression and combat effects after the next progression/combat pass

- Status: deferred
- Prerequisite: the future non-restrictive affinity model and the next deeper progression/combat-resolution pass must both exist first
- Intended owner: `packages/engines/player-engine/src/progression.ts`, combat effect resolution, and player spell or skill content hooks
- Intended implementation:
  - wire future affinity state into spell scaling, school progression, crit or weakness hooks, and other combat-effect channels only after the owning formulas are stable
  - avoid pushing affinity assumptions back into starter templates, lineage data, or other identity-layer records
  - keep this work downstream from the current backstory and starting-bundle separation so starter identity remains content-clean

#### Remaining class/profile cleanup after classless character creation

- Status: deferred
- Prerequisite: new characters now start with `classId` and `jobId` unset, but shared save contracts, origin-profile helpers, and some UI projections still carry class-growth scaffolding for future systems
- Intended owner: shared player contracts, origin-profile helpers, save metadata, and any future class system work
- Intended implementation:
  - keep nullable class and job fields until a future class-system decision either reclaims them cleanly or removes them outright
  - continue treating character creation as classless and bundle-driven rather than reviving path ownership through save or UI layers
  - only remove the remaining class-profile scaffolding when the downstream progression and save semantics are ready for that narrower cleanup

### UI Fixture Cleanup

#### RPG UI starter/demo narrative ids

- Status: deferred
- Prerequisite: move the RPG UI shell off its local placeholder quest/location record layer or formally author that layer as canonical starter content first
- Intended owner: `apps/rpg-ui` gameplay-shell starter/demo fixtures, not world simulation content
- Intended implementation:
  - the combat recovery pass normalized canonical region, settlement, market, route, spell, ability, trait, item, and save-state ids, but the gameplay shell still carries locally scoped quest/location/story ids such as the starter survey loop
  - replace those local ids and their remaining old-world narrative labels only after the UI’s starter-flow records either become authored content or are explicitly retained as UI-local fixtures with a clean naming pass
  - keep future cleanup isolated to the UI/demo shell so it does not blur ownership with canonical world or combat data

### Arcane Documents

#### Magical books and tomes

- Status: deferred
- Prerequisite: the canonical spell catalog, structured schools/traditions, and spell metadata now exist; remaining prerequisites are stable spell branching, inscription rules, charge/decay handling, and item/runtime consumers for spell-bearing documents
- Intended owner: `enchanter-authored arcane documents`, with follow-on support from `scriptorium` and `bookbindery` content
- Intended implementation:
  - define spell-bearing book item families only after spell branches, tiers, and storage or attunement rules are stable enough to support durable authored items
  - keep magical tomes on the enchanter-authored arcane-document path instead of splitting ownership across generic book content
  - add arcane copy, binding, and attunement rules after mundane book production and spell inscription constraints are both settled

#### Magical scrolls

- Status: deferred
- Prerequisite: the canonical spell catalog, structured schools/traditions, and spell metadata now exist; remaining prerequisites are stable spell branching, inscription rules, charge/decay handling, and item/runtime consumers for spell-bearing documents
- Intended owner: `enchanter-authored arcane documents`, with scroll substrate support from `scriptorium`
- Intended implementation:
  - define spell scroll payloads only after spell data can describe charges, decay, inscription limits, and discharge behavior cleanly
  - keep magical scrolls on the same enchanter-authored arcane-document ownership path as tomes and spell manuscripts
  - layer magical scroll production onto the non-magical scroll pipeline instead of duplicating it

### Cartography

#### Region-based maps

- Status: partially deferred
- Prerequisite: region metadata, polygon boundaries, and source raster base layers now exist; remaining prerequisites are cartography item families and physical map-item ownership rules
- Intended owner: future cartography/mapmaking content
- Intended implementation:
  - the first authored world geography pass now lives in `packages/content/base/world/regions.json` and `packages/content/base/world/world_maps.json`
  - `world_maps.json` now carries source-raster asset paths plus an authored source-rect so the browser can align overlays to the canonical map coordinate grid even when the source art includes framing or margins
  - coordinate-backed feature geometry now lives in `packages/content/base/world/world_map_features.json`, including region footprints, climate zones, biome zones, rivers, mountain belts, passes, and crossings
  - `scripts/regenerate_world_map_features.ps1` now regenerates source-aligned coastlines plus region/biome polygon families from the source biome raster so future map-boundary corrections do not require hand-editing every polygon
  - source full-size raster base layers now live under `packages/content/base/world/map_assets/`, and the content browser now uses those layers while overlaying region polygons, continent names, region names, settlements, and route lines against the authored pixel grid
  - add map item families now that region data can anchor them
  - keep future map generation tied to real region records rather than placeholder generic maps
  - keep the browser centered on `world_maps` as the player-facing map surface while lower-level geometry data remains an internal support layer for rendering and optional debug overlays

### Regional Economies

#### Regionally updated supply and demand

- Status: partially deferred
- Prerequisite: hierarchy ledgers, settlement market states, transport runtime, and first-pass autonomous trade dispatch now exist; remaining prerequisites are longer-horizon storage fulfillment, kingdom definitions, and broader market-service consumers
- Intended owner: economy simulation, market systems, and region data
- Intended implementation:
  - first-pass macro-region ecology, region survivability, locality catchment, and import/export baselines now exist for the authored world
  - the civilization tick now builds per-tick supply/demand ledgers and shortfall/surplus summaries across `workplace`, `building`, `settlement`, `region`, and top-level continent ledger nodes
  - guild halls now contribute building-level supply/demand pressure and can issue quests from those ledgers, including synthesized adventurers-guild fallback presence when a settlement has other guild business but no explicit adventurers hall
  - the civilization tick now performs first-pass deterministic trade dispatch from protected surplus into real caravan movement, with stock removal at origin, delivery at destination, and local price pressure updates routed through the transport system
  - remaining work is to deepen stockpile fulfillment beyond first-pass dispatch, reconcile longer-horizon storage drawdown/replenishment, and layer kingdom-level aggregation once kingdoms exist
  - tie shortages, surpluses, and trade specialization to local ecology, infrastructure, workplace density, and route throughput instead of treating ledgers as descriptive totals only

#### Settlement consumption, growth, and routing

- Status: partially deferred
- Prerequisite: authored region-first settlement and locality data, the hex spatial layer, deterministic corridor routing, first-pass caravan runtime, settlement population/business/infrastructure derivation, and autonomous trade dispatch now exist; remaining prerequisites are household consumption drawdown, migration and urban-growth logic, business lifecycle simulation, and richer seasonal route-throughput effects
- Intended owner: region data, economy simulation, settlement simulation, and infrastructure routing systems
- Intended implementation:
  - authored settlement records now live in `packages/content/base/world/settlements.json`
  - authored locality-band records now live in `packages/content/base/world/region_localities.json`
  - settlement records now derive simulation truth from `macroRegionId`, `regionId`, `localityBandId`, `hexAnchorId`, `siteClass`, `terrainContext`, survivability, and trade dependency rather than `mapLocation`
  - authored map scale benchmarks and optional route geometry still live in `packages/content/base/world/world_maps.json` and `packages/content/base/world/travel_networks.json`, but they are no longer settlement-placement or travel-truth ownership
  - browser-facing raster map layers and feature overlays remain useful for display/debug/reference ownership
  - the settlement layer now includes both primary centers and a first dependent-settlement layer of estates, hamlets, monasteries, ferry posts, camps, and similar support sites
  - settlement records now include authored guild-building presence for major human trade, craft, logistics, and adventuring nodes
  - the spatial world layer now lives in `packages/content/base/world/world_hexes.json`, `packages/content/base/world/world_hex_edges.json`, and hex/corridor-aware travel records, with runtime consumers deriving settlement resource access and infrastructure-gated supply from nearby reachable hexes
  - `packages/engines/civilization-engine/src/settlement-simulation.ts` now derives population structure, labor classes, infrastructure throughput/storage/security, transport availability, and business composition from settlement scale, ecology, and route context
  - `packages/engines/civilization-engine/src/trade-runtime.ts` now detects surplus-demand opportunities, enforces protected reserves, dispatch cadence, throughput slots, fill-ratio and profit thresholds, destination absorption, and asset reservations, then dispatches caravans automatically through the existing segment-based transport runtime
  - `packages/engines/civilization-engine/src/index.ts` now emits settlement and trade deltas alongside economy, market, logistics, and quest updates
  - use those records plus region/locality/hex data as the canonical layer for domestic production, regional trade links, infrastructure level, and population-center identity
  - remaining work is to add explicit household consumption drawdown, long-horizon storage depletion/replenishment, migration, urban growth, business opening/closure, and infrastructure-service degradation instead of leaving settlement sizes and enterprise counts mostly static between ticks

#### Region-first settlement truth and map demotion

- Status: partially deferred
- Prerequisite: the region-first location refactor is now in place across `regions.json`, `regional_ecology_profiles.json`, `region_localities.json`, `settlements.json`, `world_hexes.json`, `world_hex_edges.json`, schemas, linting, and economy loaders; remaining prerequisites are route throughput, caravan/trade runtime consumers, and optional weather/season overlays on segment travel
- Intended owner: world region content, settlement schemas, travel data, content lint, and civilization runtime loaders
- Intended implementation:
  - `packages/content/base/world/regions.json` and `packages/content/base/world/regional_ecology_profiles.json` now own survivability, density, catchment, and supply/demand baseline fields used by runtime systems
  - `packages/content/base/world/region_localities.json` now formalizes the `macro region -> region -> locality band -> settlement/site` hierarchy and locality-band terrain-pocket logic
  - `packages/content/base/world/settlements.json` now uses region/locality identity, `hexAnchorId`, `siteClass`, `terrainContext`, `economicModel`, `survivalModel`, and `tradeDependencyProfile` as settlement simulation truth, with old map coordinates retained only under optional `visualMapRef`
  - `packages/content/base/world/world_hexes.json` now provides the coarse spatial continuity layer, while `packages/content/base/world/world_hex_edges.json` owns adjacency, edge barriers, route quality, and travel-mode permissions
  - `packages/content/base/world/travel_networks.json` now uses hex-ordered route records and segment-aware corridor metadata as travel truth, with `pathPoints` and similar geometry retained only as optional visual overlays
  - `tools/content-lint/index.mjs` and `packages/schemas/world/settlement.schema.json` now validate region-first settlement truth and no longer require pixel-coordinate placement or biome/climate polygon membership
  - biome and elevation influence are now expressed through region and locality simulation fields rather than brittle raster-coordinate truth
  - `packages/content/base/world/world_maps.json`, `packages/content/base/world/world_map_features.json`, and the related browser/scripts pipeline are now optional visual/debug/reference ownership instead of settlement-truth ownership
  - remaining work is to let future route throughput, import/export fulfillment, caravan routing, and trade simulation consume the region-first spatial model end to end

#### Hex-grid route throughput and caravan logistics

- Status: partially deferred
- Prerequisite: the deterministic hex grid, adjacency edges, route records, settlement resource access, mode-aware best-route resolver, transport profiles, first-pass caravan runtime, and autonomous trade dispatch now exist; remaining prerequisites are richer corridor queueing, ferry/toll consumption, weather/season overlays, return-position tracking, and convoy attrition or encounter layers
- Intended owner: travel simulation, economy fulfillment, logistics runtime, and future caravan systems
- Intended implementation:
  - use `packages/content/base/world/world_hexes.json`, `packages/content/base/world/world_hex_edges.json`, and `packages/content/base/world/travel_networks.json` as the single spatial/travel truth for convoy and caravan movement
  - `packages/content/base/world/transport_profiles.json` now owns harness, draft-animal, vehicle, and ship profiles for deterministic transport resolution
  - `packages/engines/civilization-engine/src/transport-runtime.ts` now resolves vehicle/animal compatibility, nonlinear load and pull scaling, fatigue/rest, segment-by-segment movement, stock loading/unloading, and destination delivery against the authored route network
  - `packages/engines/civilization-engine/src/index.ts` now advances caravan transport state during civilization ticks and surfaces logistics deltas alongside economy and market updates
  - `packages/engines/civilization-engine/src/trade-runtime.ts` now uses settlement-derived throughput, protected reserves, destination absorption, route validity, vehicle availability, and route-scale limits to dispatch caravans deterministically instead of requiring dispatch to be a purely explicit action
  - remaining work is to deepen corridor throughput from a first-pass route-scale limit into per-segment queueing, ferry/toll consumption, explicit return positioning, multi-unit convoy state, and richer stockpile transfer policies
  - layer optional weather/season modifiers and convoy attrition on segment travel after the deterministic baseline is exercised by settlement demand and trade fulfillment
  - keep caravan routing deterministic and explainable, using the current segment-level penalty breakdowns as the future debugging surface

### Crafting And Item Expansion

#### Prestige material outputs after the base Phase 2 material families are exercised

- Status: deferred
- Prerequisite: the new `steel`, `bronze`, `brass`, precious-metal, fantasy-ingot, cloth-grade, leather-grade, and specialty-lumber families now exist; remaining prerequisite is proving their value through live recipe use, market demand, and first-layer manufactured outputs before adding prestige breadth
- Intended owner: `packages/content/base/items`, `packages/content/base/civilization/workplaces.json`, and `packages/content/base/civilization/production_chains.json`
- Intended implementation:
  - keep the current pass focused on first-layer base apparel, armor, weapons, tools, containers, and household goods that already sit on the validated support graph
  - defer prestige-metal weapons, ceremonial armor, elite furnishings, luxury garments, and decorative household lines until the new base material families are exercised by enough real recipes to justify further splits
  - use future expansion to add material-specific visible outputs only where the material difference affects durability, weight, value, or regional trade identity instead of adding cosmetic variants

#### Magical books, magical scrolls, and enchanter-authored arcane documents after inscription rules stabilize

- Status: deferred
- Prerequisite: the canonical spell catalog and spell metadata now exist; remaining prerequisites are inscription rules, spell-branch stability, charge or attunement handling, and item/runtime consumers for spell-bearing documents
- Intended owner: `enchanter-authored arcane documents`, with downstream support from `scriptorium`, `bookbindery`, and future spell content
- Intended implementation:
  - keep mundane books, blank ledgers, scroll stock, and stationery as the current ownership layer until spell inscription payloads and item consumers exist
  - add magical books / tomes, magical scrolls, and enchanter-authored arcane documents only after spell branches, charges, attunement, and inscription rules are authored canonically
  - keep all spell-bearing document ownership under the enchanter-authored arcane-document path so future tome, scroll, and manuscript systems do not fork into competing implementations

#### Enchanter workplace wiring and lapidary production chains after runtime craft consumers exist

- Status: deferred
- Prerequisite: the elemental combat rules, vessel lifecycle rules, crystal item economy, gemstone expansion, magical-metal affinities, and starter enchanter-facing accessory outputs now exist; remaining prerequisites are stable workplace or recipe runtime consumers plus a decision on how lapidary and enchantment stations should be represented alongside the current placeholder-heavy workplace catalog
- Intended owner: `packages/content/base/civilization/workplaces.json`, `packages/content/base/civilization/production_chains.json`, future crafting runtime consumers, and enchanter content
- Intended implementation:
  - the current pass adds the material, vessel, and item-economy foundations for enchanter and jewelry work without forcing large speculative workplace records into the current unfinished production runtime
  - add dedicated lapidary, jewelry, and enchanter workplaces once real craft execution can consume station distinctions, quality drivers, and vessel consumption rules
  - wire cut-gem processing, component fabrication, affinity attunement, and permanent-bind recipes into production chains after that station/runtime decision is stable
  - keep permanent enchanting explicitly vessel-consuming when those chains are added so the later implementation does not accidentally reintroduce infinite crystal loops

#### Guild institutions and contract systems

- Status: partially deferred
- Prerequisite: authored guild definitions, settlement guild presence, ownership derivation, religion catalogs, bounded magic service catalogs, crystal catalogs, and baseline quest generation now exist; remaining prerequisites are runtime contract acceptance/completion, warehousing, banking, apprenticeship, tax/rent collection, and market-service consumers
- Intended owner: economy simulation, civic institutions, settlement services, property systems, and market systems
- Intended implementation:
  - shared guild definitions now live in `packages/content/base/civilization/guilds.json`
  - settlement records now include `guildPresence` to describe merchant, adventurer, agricultural, mining, shipwright, teamster, scribal, and similar human guild buildings
  - settlement ownership, district restrictions, property valuation, religion, bounded magic-service availability, crystal reserves, and legal start-access derivation now live in `packages/shared/types/src/settlement-institutions.ts`, with engine-facing resolution in `packages/engines/civilization-engine/src/institutions-runtime.ts`
  - elemental religion, bounded magic-service, and crystal catalogs now live in `packages/content/base/world/religions.json`, `packages/content/base/world/magic_infrastructure.json`, and `packages/content/base/world/crystal_catalog.json`
  - merchant buy-in rules, task-trial entry models, and broad trade ownership splits are now authored as data definitions rather than implied only by settlement notes
  - the civilization tick now generates baseline guild-issued quest offers from settlement and guild-building ledgers, with adventurers-guild fallback behavior enforced in runtime
  - add runtime behavior for accepting, completing, expiring, and paying out guild-backed contracts instead of leaving quest offers as generated notices only
  - add bonded storage, credit, apprenticeship progression, rent/tax collection, title transfer, and guild-backed service demand when runtime consumers exist
  - let future civic and faction systems react to guild density, specializations, and regional concentration

#### Ownership, religion, and bounded magic institutions beyond the foundation pass

- Status: partially deferred
- Prerequisite: settlement ownership/property derivation, district restrictions, elemental religion catalogs, bounded magic-service catalogs, crystal catalogs, and class/background-aware start-access rules now exist; remaining prerequisites are canonical NPC/household/company registries, spell database ownership, crystal-charge runtime consumers, and legal/financial lifecycle systems
- Intended owner: settlement institutions, player-start systems, religion content, magic systems, and economy simulation
- Intended implementation:
  - keep the current pass focused on deterministic derivation of land authority, district permissions, plot/building ownership, property valuation, repair scaling, guild presence, religion sites, bounded magic availability, crystal reserves, and legal start-access
  - add real owner registries for individuals, households, companies, temples, nobles, and civic offices before ownership becomes a live transaction system instead of a derived legal layer
  - add rent, tax delinquency progression, foreclosure, condemnation, disputes, charters, and title transfer only after those owner registries and civic ledgers exist
  - keep magic infrastructure bounded to support, ritual, and licensed utility roles until the spell database exists and runtime charge consumption can be enforced on real spell services
  - keep magical books, magical scrolls, and other spell-bearing documents blocked behind the spell database even though religion/magic/crystal infrastructure foundations now exist

### Monsters and Encounters

#### Monster encounter distribution and lairs

- Status: partially deferred
- Prerequisite: baseline monster catalog and quest-facing drops now exist; remaining prerequisites are encounter tables, lair ownership, habitat weighting, and combat/runtime consumers
- Intended owner: world simulation, encounter generation, quest systems, and regional ecology
- Intended implementation:
  - `packages/content/base/world/monsters.json` now includes a broader starter set of kobolds, slimes, wolves, vermin, scorpions, centipedes, elementals, undead, and newer affinity-aware fauna-linked monsters with saleable drops and vessel outputs
  - monster records now also carry first-pass origin metadata for appearance rate, terrain sources, entry vectors, and secure-settlement restrictions so later spawn systems do not treat cities and wilderness as equivalent
  - use that catalog later for real spawn tables, hazard pressure around settlements, lair placement, and route danger instead of relying only on authored quest references
  - connect monster drops to broader crafting, alchemy, and economy consumers once those downstream systems are formalized

#### Full fauna-monster codex merge and lineage backfill

- Status: deferred
- Prerequisite: monster lineage metadata now exists on the new affinity-aware additions, but the broader fauna and monster catalogs still need a full backfill plus a codex presentation layer that can consume those links
- Intended owner: `packages/content/base/world/fauna.json`, `packages/content/base/world/monsters.json`, codex data consumers, and future UI or browser presentation layers
- Intended implementation:
  - keep the current pass focused on adding the merged-fauna design direction, new monster lineage fields, and realistic progression examples instead of rewriting every existing fauna and monster record at once
  - backfill `baseFaunaId`, variant typing, attunement metadata, and related codex links across the rest of the monster catalog in a dedicated normalization pass
  - add merged fauna-page presentation later so species, fantasy fauna branches, and hostile escalations read as one biological line rather than disconnected record lists

#### Tertiary sites below the authored dependent layer

- Status: partially deferred
- Prerequisite: the current primary-plus-dependent settlement layer is now authored; remaining prerequisite is deciding how tertiary hamlets, isolated shrines, tribal camps, ferry slips, and seasonal micro-sites should aggregate into simulation without exploding record count
- Intended owner: world region content, settlement simulation, and map population passes
- Intended implementation:
  - the current pass covers primary named population centers plus a first dependent layer of support settlements
  - add a lighter tertiary layer later so dense regions feel fuller without turning every farm lane, shrine, or fishing cove into a full authored settlement record
  - use that lower layer to represent the many non-urban tribal, rural, and seasonal populations that still sit below the current authored granularity

### Civil Infrastructure

#### Broader non-manned infrastructure families

- Status: partially deferred
- Prerequisite: decide how region data should influence route placement, civic maintenance, and settlement-scale infrastructure prioritization
- Intended owner: civilization infrastructure content, economy simulation, and browser/reporting tools
- Intended implementation:
  - roads, walls, gates, aqueducts, bridges, and canals are now seeded in `packages/content/base/civilization/infrastructure.json`
  - authored travel-network variance rules now account for roads, rivers, mountain passes, canal locks, and open-sea weather at the data layer
  - continue with utilities, harbor works, and other unmanned civic works in the same data model instead of introducing workplace stand-ins
  - keep infrastructure tiers gated by technology, materials, and labor rather than staffing
  - preserve the direct-build rule for higher tiers and the higher-labor retrofit rule for upgrades so infrastructure remains distinct from workplaces
  - add runtime-aware canal routing, lock throughput, and drydock usage after transport simulation can consume infrastructure service outputs directly

#### Settlement plot and building instantiation

- Status: partially complete
- Prerequisite: runtime district, plot, building-condition, repair, and morale initialization now exist; remaining prerequisite is player-facing construction/repair interaction and long-horizon building turnover
- Intended owner: settlement spatial simulation, building placement, plot/building gameplay, and future construction systems
- Intended implementation:
  - use `packages/content/base/civilization/buildings.json` as the canonical building-capability layer, including hosted workplaces, service functions, storage types, and terrain/placeability constraints
  - keep the current building layer as simulation truth for capacity and function; runtime settlement initialization now derives districts, plots, building instances, vacancy, decay, repair pressure, and morale directly from that layer
  - add player-facing construction, redevelopment, frontage choice, and repair prioritization later on top of the current runtime plot/building state instead of replacing it
  - let future placeability consume `hexAnchorId`, `terrainContext`, locality route access, and settlement infrastructure instead of reintroducing pixel placement or arbitrary building slots

### Knowledge and Research

#### Research and administrative book use

- Status: partially deferred
- Prerequisite: formalize record-keeping, research, and technology-advance consumers
- Intended owner: civic/research/workplace systems
- Intended implementation:
  - reuse `record_book`, `reference_book`, and `ledger` as tools for administration, archives, and technology progression
  - add dedicated consumers before introducing broader library or scholastic progression loops

### Botanical Aggregates

#### Mixed-harvest herb and flower deaggregation

- Status: partially deferred
- Prerequisite: define fuller crop, orchard, and forage decomposition rules for broad harvest sources
- Intended owner: flora extraction, agriculture, and foraging content
- Intended implementation:
  - use explicit seeded furrows and per-furrow yields for managed agriculture where the player or settlement chooses what is planted
  - use percent-distribution mixed yields for wild gathering, hedgerow byproducts, orchard understory, and other intentionally broad harvest sources
  - keep `herbs_raw` and `flower_bloom` as aggregate byproducts for mixed farms and wild harvest loops where the source is intentionally broad
  - continue replacing aggregate botanicals inside specific processing recipes and workplaces once named herb and flower inputs exist
  - remove the aggregate harvest buckets only after broad extraction outputs can be split into stable specific species yields

### Item and Economy Data

#### Canonical commodity identity rollout beyond the first pass

- Status: partially deferred
- Prerequisite: the first canonical commodity item cohort, alias-backed flora compatibility, and market overlay schema now exist; remaining prerequisites are broader item catalog coverage, recipe/workplace consumers that can target processing groups, and deliberate provenance rules for aggregate goods
- Intended owner: `packages/content/base/items`, `packages/content/base/civilization`, extraction/workplace content, and future inventory/codex consumers
- Intended implementation:
  - `packages/content/base/items/items.json` now owns the first canonical multi-role commodity records for core raw and processed goods such as wood, bark, sap, resin, herb bundles, compost, hides, leather, dairy, eggs, feathers, blood, bone, ore, and ingots
  - `packages/content/base/civilization/market_item_values.json` now has a dedicated schema and remains the valuation overlay keyed to canonical `itemKey`
  - the Step 2 canonicalization pass now removes `ingredient.*`, `material.*`, and `mineral.*` pseudo-identities from live item usage, promotes the remaining world-source outputs into canonical item records, and normalizes flora/fauna/mineral/monster outputs plus market rows onto one unprefixed item graph
  - remaining work is to migrate more of the market catalog into canonical item records instead of leaving many tradable goods defined only in the market layer
  - the Step 3 workplace IO normalization pass now separates non-inventory access concepts such as `forest_access`, `ore_vein`, and `grazing_pasture` into `packages/content/base/civilization/workplace_abstractions.json`, with workplaces consuming them through `siteTags`, `ioProfile.siteRequirements`, and `progressionProfile.tiers[].siteLaborWeights` instead of `itemKey`
  - extraction-heavy workplace yield pools now use explicit `ioProfile.yieldGroups` instead of flattened access-driven output lists, while manufacturing workplaces remain strict item-only IO
  - remaining work is to replace generic aggregate items such as `hide_raw` with deliberate provenance-aware item families where species distinctions materially matter
  - remaining work is to let recipes, workplaces, crafting, and codex systems consume `roles`, `tags`, and `processingGroups` directly instead of treating those fields as catalog metadata only
  - remaining work is to add canonical consumable and spoilage profile ownership before `consumableProfileId` and `spoilageProfileId` become populated broadly

#### Crafting dependency closure and intermediate material completion

- Status: partially deferred
- Prerequisite: canonical commodity identity rollout, workplace IO normalization, the first component-layer pass, and the Step 5 support-craft closure pass now exist; remaining prerequisites are dependency-closure validation and any provenance-aware splits that materially affect downstream recipes
- Intended owner: `packages/content/base/items`, `packages/content/base/civilization`, world extraction content, schema/lint tooling, and future crafting/runtime consumers
- Intended implementation:
  - Tier 1 canonicalization now promotes the missing `civilization` and `economy.generic` market rows into `packages/content/base/items/items.json`, covering the current economy-owned processed goods, intermediates, byproducts, food products, stationery goods, ammunition bundles, and trade aggregates without waiting on world-source normalization
  - `tools/content-lint/index.mjs` now enforces that Tier 1 economy-owned refs from `market_item_values`, `production_chains`, and `workplaces` must exist in the canonical item registry rather than remaining market-only strings
  - the Step 2 graph pass now closes the main identity gap by canonicalizing all remaining `world.flora`, `world.fauna`, `world.minerals`, and `world.monster` outputs onto canonical item keys and removing the remaining item and market identity collisions
  - the Step 3 workplace IO normalization pass is now complete: workplaces no longer store site/access abstractions in item-bearing fields, access inputs are separated into `siteRequirements`, and extraction yield pools are represented structurally instead of as flattened item-only output lists
  - malformed whitespace-delimited workplace IO rows were already cleared before the current pass; the remaining Step 3 cleanup was structural normalization of access-bearing extraction records and progression labor weights
  - the Step 4 component-layer pass is now complete inside the current workplace roster: sawmill, loomhouse, tannery, chandlery, coopers, fletchers, armorers, cartwrights, weaponsmiths, bookbindery, and the alchemist atelier now produce or consume the first assembly-critical parts such as shafts, staves, handles, poles, wheel parts, rods, wire, rings, rivets, nails, buckles, hinges, ferrules, blade blanks, yarn, cord, binding strips, leather parts, wick, glue, resin pitch, and adhesive
  - the current component pass intentionally reuses existing `timber_beam` and `linen_thread` ownership instead of adding duplicate generic `wood_beam` or `thread` identities
  - the Step 5 support-craft closure pass is now complete inside the existing workplace roster: chandlery now consumes rendered tallow and wick, tannery now emits rendered tallow alongside leather parts and glue, fletching now depends on explicit heads plus quill/binding inputs, cartwrights and bookbinders now consume cord, and weaponsmiths now emit ammunition heads while consuming leather strap for hafted assembly
  - the current support-craft pass intentionally deepens the existing roster instead of adding new workplaces or broad new visible-output families
  - ensure every crafted output has upstream canonical inputs, every upstream input has a logical source path, and every byproduct is either canonicalized or intentionally abstracted
  - remaining work is to replace broad aggregate goods with deliberate provenance-aware families where the distinction materially affects crafting, cooking, or trade behavior
  - add new supporting workplaces or infrastructure families only after dependency-closure validation shows the current roster still cannot complete the normalized graph with disciplined component outputs and support-part chains
  - tighten validation so workplace inputs/outputs, production-chain primary outputs/byproducts/variant inputs, and market overlays are checked for canonical item backing and intentional abstraction instead of market-only existence

#### Derived recipe valuation and runtime cost resolution

- Status: partially deferred
- Prerequisite: recipe standardization, component/support-part closure, and the new item/market valuation metadata now exist; remaining prerequisites are stockpile fulfillment, broader trade routing, and UI/session consumers that can use the new runtime outputs directly
- Intended owner: `packages/content/base/items`, `packages/content/base/civilization/production_chains.json`, `packages/content/base/civilization/market_item_values.json`, runtime crafting systems, and economy simulation
- Intended implementation:
  - `packages/content/base/items/items.json` now carries `valueProfile` on every item plus `materialDifficultyProfile` on authored material families so value and processing are no longer modeled as flat category assumptions
  - `packages/content/base/civilization/market_item_values.json` now carries `pricingProfile` on every market row so the market layer can consume derived value inputs without hard-coding final price logic yet
  - `packages/content/base/civilization/production_chains.json` now carries `recipeProfile` with explicit processing steps, chain value-propagation rules, and step-level skill thresholds so food and non-food crafting share one authored recipe surface
  - the first deterministic runtime pass now lives in `packages/engines/civilization-engine/src/runtime-economy.ts`, where settlement markets derive local buy/sell prices, craft resolution derives time/cost/waste from recipe metadata, and value now carries forward through chain stages instead of resetting at each output
  - `packages/shared/types/src/contracts.ts` now exposes explainable settlement market state, pressure contributions, craft-resolution breakdowns, and item value-resolution outputs so runtime and UI layers can consume one typed surface
  - `packages/engines/civilization-engine/src/index.ts` now builds per-settlement market states each tick and emits market updates from the same deterministic runtime layer instead of leaving pricing as static descriptive content
  - remaining work is to replace the remaining authored `baseValue` fields as active runtime anchors once stockpile fulfillment, throughput, and settlement trade movement can price goods from live inventory rather than fallback source anchors
  - remaining work is to project the new runtime market/craft explanations into UI/session records and player-facing trade screens instead of leaving them inside engine state only
  - remaining work is to connect runtime craft resolution to actual workplace throughput, worker assignments, inventory consumption, and future quality outcomes instead of using it only for deterministic estimates and price derivation
  - avoid adding broader price simulation, auction dynamics, speculative trading, or random failure before stockpile fulfillment and direct runtime consumers exist for the current deterministic model

### Runtime Enforcement

#### Workplace progression simulation rules

- Status: deferred in runtime
- Prerequisite: implement simulation-engine support for progression tiers, variant slot caps, switch labor costs, and upgrade unlock effects
- Intended owner: runtime simulation / workplace engine
- Intended implementation:
  - current content/schema/lint work defines progression data
  - runtime should later enforce throughput, slot, and switching constraints instead of treating them as descriptive only

#### Infrastructure construction and retrofit rules

- Status: deferred in runtime
- Prerequisite: add runtime systems for infrastructure placement, construction jobs, and civic maintenance
- Intended owner: runtime simulation / settlement construction systems
- Intended implementation:
  - enforce infrastructure tier gates from technology, labor, and materials during actual build decisions
  - allow direct construction of higher tiers without requiring lower tiers first
  - model retrofits as more labor-intensive than fresh builds because teardown and rerouting cost extra work

### Ecology and Content Expansion

#### Region-aware cartographic and ecology follow-through

- Status: partially deferred
- Prerequisite: region metadata exists; remaining prerequisite is broader regional ecology ownership and runtime consumers
- Intended owner: world/region content passes
- Intended implementation:
  - first-pass macro-region climate and ecology overlays now live in `packages/content/base/world/regional_ecology_profiles.json`
  - tie future maps, flora distribution, and fauna distribution more tightly to region-specific identities
  - expand deferred regional realism passes using the authored region records now in place
  - add finer subregion-level ecology overlays and runtime weighting after the major trade regions are stable

### Player Systems

#### Discovery chronicle, inventory metadata, and origin growth ownership

- Status: partially deferred
- Prerequisite: player snapshot fields and starter authored origin profiles now exist; remaining prerequisites are canonical item metadata, runtime discovery emitters, and a canonical content/database owner for expanded lineage and class growth records
- Intended owner: `packages/shared`, player-engine/runtime systems, future player/content databases, and UI/session adapters
- Intended implementation:
  - player state now carries `originProfile`, `discoveryChronicle`, `inventory`, `equipment`, and `currency` so the character UI can render a discovery log, carried items, equipped gear, wallet balances, and lineage/class growth effects
  - starter lineage and class growth rules now live in `packages/shared/types/src/player-origins.ts` for human, elf, dwarf, halfling, gnome, orc, goblin, troll, merfolk, and the current starter class set
  - move lineage/class growth definitions into the canonical content/database layer once the playable race and class roster is broad enough that authored profile coverage should not live inside shared TypeScript helpers
  - add a canonical mapping between authored world race ids and player lineage ids so settlement/region demographics, character creation, and origin growth resolve through the same taxonomy
  - add a raw-vs-derived attribute split so sex variance, lineage adjustments, equipment bonuses, effects, and temporary modifiers can be audited separately from final displayed attribute totals
  - add canonical item stat/value/weight metadata refs so inventory and equipment rows can project real authored data instead of humanized item keys and stack ids alone
  - add runtime discovery emitters, dedupe rules, and codex sync ownership so flora/fauna/mineral/item/note discoveries are written by live simulation systems instead of demo snapshot payloads

#### Modular progression foundation follow-through

- Status: partially deferred
- Prerequisite: the canonical player foundation now exists across the hierarchical skill tree, lineage trait packages, titles, abilities, spells, progression tracks, knowledge tracks, skill effects, trials, items, schemas, shared contracts, combat hooks, and linting; remaining prerequisites are runtime progression gain consumers, broader class/job ownership, and expanded authored combat/craft/magic content
- Intended owner: player content databases, player-engine runtime, combat systems, spell systems, craft systems, and later progression tooling
- Intended implementation:
  - the current foundation now uses a hierarchical skill tree with container categories, rankable branch or leaf skills, canonical progression tracks, and milestone-title metadata instead of the old placeholder flat catalog
  - `packages/content/base/player/progression_tracks.json`, `knowledge_tracks.json`, `skill_effects.json`, and `trials.json` now own reusable breakthrough, identification, effect-channel, and trial definitions instead of embedding those rules ad hoc inside individual skills or spells
  - `tools/content-lint/index.mjs` now validates player catalogs and their cross-system refs against quests, items, and crafting surfaces instead of leaving player content outside the main validation pass
  - remaining work is to let live actions award skill gain, breakthrough progress, and trial advancement through runtime systems instead of leaving the new models data-only
  - expand the spell, ability, and specialization roster only when each addition has clear structured effects and governing skill ownership; do not reintroduce placeholder tier spam or vague passive filler
  - keep future growth keyed to the new progression-track and skill-effect model rather than adding one-off rank rules inside UI or runtime fixtures

#### Canonical title expansion and faith-title follow-through

- Status: deferred
- Prerequisite: the canonical title schema, milestone metadata, representative title records, and runtime title state now exist; remaining prerequisites are broader skill-family authoring coverage, title-equip gameplay consumers, and faith or divine progression systems
- Intended owner: `packages/content/base/player/titles.json`, player-engine progression helpers, religion or faith content, and combat/crafting/magic/knowledge systems
- Intended implementation:
  - expand the current representative 50 / 100 / 125+trial title samples into broader authored coverage only after each skill family has stable milestone hooks and progression ownership
  - keep the reserved `faith` title family blocked until religion, favor, or divine progression systems can own milestone logic and equip rules cleanly
  - continue resolving titles through canonical ids, track ids, source skill ids, and milestone metadata rather than drifting back to freeform runtime labels

#### Spell branching and advanced combat-resolution follow-through

- Status: deferred
- Prerequisite: the placeholder spell catalog, structured spell metadata, skill effects, and content-driven combat action discovery now exist; remaining prerequisites are non-placeholder spell trees, deeper combat-resolution rules for support and control hooks, and item-runtime consumers for generated spell support items
- Intended owner: player spell content, combat runtime, item systems, and progression tooling
- Intended implementation:
  - branch elemental, enfeebling, enhancing, healing, druidic, ninjutsu, and performance content beyond placeholders only when each branch has stable governing-skill ownership and real resolution hooks
  - deepen runtime handling for bind, ward, anthem, shadow-step, and similar hooks instead of leaving them as lightweight status proxies in the current combat pass
  - keep `berry` as a spell-generated, party-limited, dissipating support item and not a crafting input or normal resource when the item-runtime follow-through is implemented

#### Background and settlement trait families after non-lineage ownership exists

- Status: deferred
- Prerequisite: lineage trait packages now exist; remaining prerequisites are background generation rules, settlement-origin ownership, and non-lineage runtime consumers for social, economic, and start-state effects
- Intended owner: starter generation, player trait content, world start systems, and UI/session adapters
- Intended implementation:
  - keep the current trait catalog limited to lineage, innate, and supernatural records instead of reviving the removed background or settlement placeholders
  - reintroduce background or settlement traits only after they can be generated and consumed canonically rather than being hardcoded into starter snapshots
  - keep lineage traits aligned to playable lineage ids and avoid mixing pure-ancestry aliases back into starter generation

#### Trade and social skill families on top of the progression foundation

- Status: deferred
- Prerequisite: the new progression foundation now exists; remaining prerequisites are a clearer merchant, negotiation, reputation, and service-interaction runtime model so trade/social skills have real consumers
- Intended owner: player progression content, economy systems, quest systems, and UI/session adapters
- Intended implementation:
  - add concrete trade/social skills only after barter, negotiation, appraisal, persuasion, favors, and service access have authored checks or runtime consequences
  - keep `Trade / Social` as a category container for now instead of filling it with non-functional flavor skills
  - route future trade/social gain through the same progression tracks, trials, and skill-effect channels used by the current system/knowledge/combat/craft/magic foundation

#### Traversal and mobility specializations after travel runtime ownership exists

- Status: deferred
- Prerequisite: authored travel networks and transport runtime now exist; remaining prerequisites are player-facing traversal actions, terrain penalties, and movement-resolution hooks that can consume mobility skill ranks meaningfully
- Intended owner: player progression content, travel systems, and world interaction runtime
- Intended implementation:
  - keep traversal out of the current skill catalog until climbing, swimming, sailing, mount handling, and routecraft can affect real action resolution instead of serving as broad flavor gates
  - when traversal skills return, wire them through explicit action types, item/tool use profiles, and travel/trial hooks rather than reviving the removed placeholder innate-skill bucket
  - prefer a narrower set of meaningful movement specializations over a broad list of rarely-consumed mobility tags

#### Ecology record identification difficulty authoring

- Status: deferred
- Prerequisite: knowledge tracks and auto-identify thresholds now exist; remaining prerequisite is a deliberate flora/fauna/mineral source audit so identification difficulty and rarity are authored against real ecology records instead of guessed in bulk
- Intended owner: world ecology content, player knowledge systems, and codex/discovery surfaces
- Intended implementation:
  - annotate flora, fauna, and mineral records with authored identification difficulty once the ecology pass is ready to normalize those datasets
  - use domain knowledge first, universal knowledge as weak support, and spotting as a minor assist exactly as the current knowledge-track foundation expects
  - keep the current player foundation generic until the ecology datasets are clean enough to support stable identify thresholds and discovery outcomes

#### Canonical skill, job, workplace, and employment architecture refactor

- Status: partially deferred
- Prerequisite: the placeholder player skill taxonomy has now been replaced by the canonical progression foundation; remaining prerequisites are job registries, workplace role ownership, and shared runtime consumers for employment, hiring, and non-quest action execution
- Intended owner: player progression content, civilization/workplace content, quest systems, simulation runtime, and UI/session adapters
- Intended implementation:
  - build future job and workplace systems on top of the current permanent skill model instead of replacing it again
  - introduce a canonical `jobs.json` so professions become explicit temporary employment roles with required skills, preferred skills, workplace eligibility, progression tiers, and compensation expectations instead of remaining embedded string ids inside workplace staffing curves and player state
  - refactor `packages/content/base/civilization/workplaces.json` so workplaces own capacity, role slots, productivity rules, and multi-role burden semantics while jobs own role identity and worker-fit logic
  - generalize the current quest action/deployment concepts into a reusable context-aware action system that can power travel, gathering, trade, hiring, labor, party assignments, and building interactions outside quest trees
  - add canonical NPC/employment/hiring/negotiation data ownership so candidate discovery, wage negotiation, compensation preferences, and worker loyalty are not inferred from ad hoc settlement tags or quest givers
  - split the current flat player reputation model into local fame, regional fame, faction reputation, party reputation, and business reputation, with explicit ownership for gain/loss rules and UI projection
  - align shared snapshot contracts, simulation runtime state, and the React UI so jobs, employees, parties, workplaces, actions, and reputations resolve through the same typed registries instead of duplicating string-only references across content and session state

#### Real-time HP/MP/Stamina effect catalogs and event integration

- Status: partially deferred
- Prerequisite: the runtime calculator now exists; remaining prerequisites are canonical spell/food/equipment effect payloads, combat/runtime systems that emit resource changes, and authored rest/consumption/aura rules
- Intended owner: player-engine runtime, combat systems, spell/item content, and UI/session adapters
- Intended implementation:
  - player resource runtime now supports active modifiers, pending one-shot changes, per-tick breakdowns, and recent history so HP/MP/Stamina can be recalculated each tick instead of treated as static numbers
  - the player engine now resolves origin maxima, equipment bonuses, ongoing buff/debuff/food/aura effects, natural regeneration, assisted regeneration, degeneration, and direct change requests through one calculator path
  - remaining work is to replace fixture-authored modifier payloads with canonical equipment, spell, potion, food, rest, and aura effect data from the content/database layer
  - wire combat damage, healing, spellcasting costs, potion use, food consumption, environmental drains, and rest actions to emit `player.resource.change` and modifier-application events instead of hand-seeding pending changes in test/demo state
  - extend the UI beyond the current character-overview summary so the player can inspect the full resource history and source-by-source breakdown in dedicated views

### Quest Systems

#### Branching quest execution runtime and issuer registry ownership

- Status: partially deferred
- Prerequisite: authored `quest_definitions` and reusable `quest_archetypes` now exist; remaining prerequisites are canonical NPC/business/government entity registries, quest-branch execution runtime, party deployment ownership, and consequence writers for world/player/session state
- Intended owner: quest systems, civilization/runtime engines, faction and civic content, player deployment systems, and UI/session adapters
- Intended implementation:
  - `packages/content/base/civilization/quest_definitions.json` now stores authored quest givers, requirements, schedules, rank/risk, logistics, rewards, and branching action trees with stat/skill/ability/spell/tool/RNG checks
  - `packages/content/base/civilization/quest_archetypes.json` now stores reusable branching quest families for gathering/extraction, escort, extermination, porter, blacksmithing, masterwork smithing, menial labor, and maritime salvage
  - the starter authored set now covers government, business, guild, and individual quest-giver types, including a more operation-style scenario inspired by multi-role organized-crime structures
  - remaining work is to resolve giver ids against canonical NPC/business/government registries instead of leaving some non-guild ids provisional
  - add a runtime branch executor that can evaluate action-tree checks, apply branch effects, consume items, assign injuries/time loss, and emit chronicle/quest-journal updates
  - add party deployment semantics so extra or missing personnel can positively or negatively affect quest branches the way the authored data now describes
  - connect authored quest outcomes to downstream world changes, faction standings, unlock flags, and follow-on quest chains instead of leaving branch effects as descriptive strings only

#### Quest archetype instantiation, canonical refs, and loop execution

- Status: partially deferred
- Prerequisite: reusable quest archetypes now exist; remaining prerequisites are canonical skill/equipment/tag registries plus runtime support for repeated branch loops and material accounting
- Intended owner: quest systems, player progression content, item/equipment content, and runtime execution layers
- Intended implementation:
  - let future generated quest offers and specific `quest_definitions` reference an archetype id instead of duplicating full branch trees whenever the quest follows a standard family
  - add canonical skill/content support for the fields currently proxied through broad attributes or adjacent skills inside archetypes, especially perception, foraging, mining or extraction, hauling, labor endurance, routecraft, and fine-grained craft-stage specializations
  - normalize freeform `class_tag.*` and `gear.*` references used by the archetypes so they resolve against canonical class/job and equipment-tag registries rather than remaining string-only hints
  - add loop-aware runtime execution for repeated work stages such as fold-stack-weld passes, bulk labor cycles, repeated harvest pulls, and multi-room extermination sweeps so branch outcomes can accumulate instead of resolving as isolated text
  - add explicit material-loss, downgraded-yield, casualty, and partial-completion accounting so catastrophic craft failures, cargo damage, late deliveries, and reduced-lot gathering results can modify real inventories and ledgers

#### Universal quest-role adapter matrix and non-combat check families

- Status: deferred
- Prerequisite: the architecture pass for the modular quest-template system now exists; remaining prerequisites are canonical class or job tags, lineage tags, faith-role tags, merchant-role tags, and authored non-combat skill families
- Intended owner: quest systems, player progression content, religion and faction content, and economy systems
- Intended implementation:
  - formalize reusable quest-stage modifiers for class or job, lineage, combat role, crafter profession, merchant role, and religious office instead of leaving those relationships as freeform text notes
  - add canonical non-combat check families needed by the modular quest-template design, especially perception, foraging, mining or extraction, hauling, bargaining, appraisal, persuasion, deception, etiquette, doctrine, ritual purity, investigation, and routecraft
  - expand authored quest archetypes beyond the current combat, labor, and craft-heavy set into diplomacy, temple service, intrigue, merchant-house operations, and other social or faith-driven quest families using those canonical check families
  - resolve quest-state tracks such as suspicion, sanctity, profit margin, morale, and alert into runtime-owned systems so hybrid quests can carry meaningful consequences across stage boundaries

### Frontend UI

#### Live RPG UI data bindings and persistence

- Status: partially deferred
- Prerequisite: shared player/session snapshot fields and a browser-safe UI projection layer now exist; remaining prerequisite is runtime generation of those session records from actual simulation systems
- Intended owner: `apps/rpg-ui`, `packages/shared`, and engine/session runtime layers
- Intended implementation:
  - a player-facing root launcher now exists as `Play Cataclysm.cmd` so the current UI/browser flow can be entered from the project root without terminal knowledge
  - the React/Tailwind shell now reads from a save/session snapshot bridge instead of the earlier freeform mock-data module, and the in-game shell now owns a typed game-session provider that separates raw active snapshots, derived UI view models, and local navigation state while leaving `demoSnapshot` as development-only seed data
  - shared contracts now carry location, currency, reputation, titles, tracked activity, notifications, codex records, quest journal records, chronicle records, operations, origin profiles, inventory/equipment, and the player discovery chronicle in a session-facing shape the UI can project directly
  - `packages/engines/game-engine/src/save-snapshot.ts` now provides a runtime-side snapshot helper, and `apps/rpg-ui/src/runtime/uiViewModel.ts` projects that snapshot shape into panel data
  - `apps/rpg-ui` now has a typed top-level flow with `MAIN_MENU`, `CHARACTER_CREATION`, `LOAD_GAME`, and `IN_GAME` states so the existing shell can be entered from a real front-end game loop instead of rendering immediately on boot
  - the UI now maintains six browser-local manual save slots plus a dedicated quick-save slot backed by `localStorage`, with serialized shared `SaveSnapshot` payloads, stored save metadata, explicit save/load/overwrite/delete/reset-all controls, and corrupt-slot isolation in the front-end shell
  - the UI character creator now runs as a deterministic multi-step flow for lineage, identity, continent, region, settlement, backstory, starting bundle, manual attribute allocation, and review, with lineage-valid identity palettes, settlement-aware backstory pools, authored starting-bundle loadouts, a slimmer live summary, and a snapshot factory kept separate from the screen component
  - the world, activity, and quest tabs now expose a first playable snapshot-backed loop for accepting a contract, traveling between authored locations, advancing contract work shifts, resting, turning contracts in, and applying rewards to currency, XP, skills, reputation, codex entries, chronicle events, notifications, and operations
  - the detail column now also exposes per-section standard field audits and missing-reference callouts so each submenu window documents what data it expects to receive
  - the character tab now surfaces origin growth, wallet/inventory state, equipped gear refs, and discovery-chronicle records from the snapshot bridge instead of treating those windows as placeholders
  - the character tab now also supports session-backed equip/unequip, inventory filtering and sorting, favorite-item and tracked-skill quick actions, record pinning, and item inspection against the active snapshot instead of acting as a read-only concept panel
  - the in-game shell now uses a docked top bar with centered HP/MP/Stamina bars, icon-tile system navigation, a quest flyout, a settings popover that houses save controls, and a collapsible right-side information pane so panels can reclaim more screen space without leaving the active session
  - pinned items now persist through the saved `sessionState.pinnedRecordIds` snapshot payload, but the current write path is still a UI-local adapter rather than engine-owned save/update orchestration
  - remaining work is to have the simulation produce `worldRecords`, `activityRecords`, `questJournal`, `chronicle`, `codexEntries`, and notification/operation feeds dynamically instead of relying on demo session payloads
  - remaining work is to replace the current UI-authored travel, shift-advance, rest, quest-turn-in, and reward application resolver with engine-owned command handling plus authoritative tick/event output from `packages/engines` or `apps/sim-runner`
  - remaining work is to replace session-flag-driven objective progress, cargo markers, and codex unlock triggers with canonical quest/runtime state owned by the engine layer instead of the front-end command helper
  - remaining work is to replace the current UI-side equip-slot heuristics, session-flag item metadata stashing, and disabled consumable action hook with canonical item definitions plus engine-owned equip/use semantics
  - remaining work is to promote the new shell layout state such as collapsed system tabs, right-side detail visibility, and in-game settings-panel state into canonical UI preferences or session-owned persistence if those presentation choices need to survive reloads instead of resetting per mount
  - the character creator now resolves continent, region, and settlement selection from canonical world data instead of the earlier UI-authored settlement-template catalog
  - remaining work is to replace the UI-authored character creation catalogs for identity palettes, backstories, paths, starter loadouts, and legal-start mappings with canonical content/database ownership once the player-content layer stabilizes
  - the character creator now serves lineage and continent card art from `apps/rpg-ui/public/character-creator`, brings decorative art to the foreground on hover for image-backed cards, expands selected lineage/continent/region/settlement cards into art-forward confirm surfaces with left-side hover narrative overlays, keeps a slimmer live summary behind an inline top-bar toggle that defaults collapsed on continent, region, and settlement steps, and uses a denser left-aligned step rail plus edge-mounted lineage stat panes with embedded advance controls to preserve card space
  - remaining work is to move the current UI-owned lineage/continent card art manifests, expanded lineage color palettes, sex or height or build tradeoff tables, and any future region or settlement card art into canonical player-content ownership once the player-content layer can author visual identity and starting-stat modifiers directly
  - the character creator now also uses authored region card art, image-backed region resource icons, explicit presentation overrides for the Kaelvar trio plus the current Valtherion quartet, and a continent-style split selected layout for region cards; settlement cards now use the same image-backed treatment across the earlier Kaelvar and Valtherion set plus the newly added Sapphire Rivers, Serathyl mainland, Draemor mainland, Talmyra mainland, Watcher Coast, and most Thorn Peninsula starts, while uncovered settlements still fall back to the older art-light presentation
  - remaining work is to extend the settlement art registry and authored image set to the still-uncovered named starts: `Dyehollow`, `Pepperfield Estate`, `Starfall Port`, `Foammarket Ferry`, `Harbormast Quay`, `Pearlwake`, `Chainlight Bastion`, `Lantern Key`, `Driftglass Outpost`, `Glasswake Shrine`, `Lantern Deep`, `Stormfang Haven`, `Blackreef Anchorage`, `Squallhook Refuge`, `Aurora Anchorage`, `Icehook Jetty`, `Whalebone Watch`, `Nacredeep`, and `Stormhook Watch`; intended owner is `apps/rpg-ui` until canonical presentation content absorbs that responsibility
  - remaining work is to replace the current creator-side lineage-fit heuristic for uncommon city locals and nobles with canonical settlement demographics or authored lineage-presence data so those hooks do not stay UI-inferred forever
  - remaining work is to validate the richer creator catalogs against canonical skill, item, and trait registries so the UI no longer depends on mixed placeholder refs during new-game generation
  - remaining work is to replace the UI-authored new-game snapshot builder and browser-local slot manager with engine-owned character creation, canonical save-slot metadata, and session persistence once runtime save semantics are finalized
  - the launcher now persists a root light or dark theme choice through browser storage, but only the character creator currently exposes a dedicated theme toggle; remaining work is to unify theme-aware component styling across the broader launcher shell
  - the main menu now treats manual saves as five page-based game-data ledgers over forty browser-local manual slots with direct load, direct new-game targeting, and per-slot deletion; remaining work is to replace the browser-local slot manager with engine-owned profiles or account-scoped storage if save management grows beyond local ledgers
  - the character creator now uses UI-authored lineage name pools, narrative backstory accordions, a mix of heuristic and explicit region resource presentation metadata, and seeded-plus-authored region-description prose; remaining work is to replace those with canonical cultural naming data, settlement demographics, and authored resource-presentation metadata once those content layers exist

#### RPG UI section field coverage and missing references

- Status: partially deferred
- Prerequisite: section-level UI audit scaffolding now exists; remaining prerequisites are canonical content ids plus live runtime adapters that can populate those refs
- Intended owner: `apps/rpg-ui` with follow-on work in `packages/shared`, engine/session adapters, and authored content layers
- Intended implementation:
  - the UI menus now surface per-section descriptions and record counts, and each submenu detail window now lists its standard fields, current data source refs, and missing or empty references
  - remaining character refs include raw base-attribute provenance, derived combat/encumbrance formulas, authored equipment stat payloads, canonical item metadata refs for inventory rows, canonical spell/food/potion/aura modifier payloads, trait modifier tables, faction threshold tables, title equip/unlock ownership rules, runtime ownership for discovery-chronicle writes, consumable-use execution ownership, and full combat/resource event emitters
  - remaining world refs include authored `world_maps` / `world_map_features` ids, player visibility state, region ecology/hazard bindings, settlement stockpile and service refs, route geometry/throughput refs, and live market price/stock feeds
  - remaining activity refs include employer/workplace ids, business revenue-expense ledgers, upgrade catalogs, recipe/station refs, cargo and shipment ids, contract lifecycle refs, service payroll/readiness refs, vessel/crew refs, and operation dependency / input-output refs
  - remaining codex refs include canonical content ids for flora/fauna/minerals/items/recipes/factions, habitat weighting, extraction/drop links, item stat and recipe refs, faction presence thresholds, and note-source linkage
  - remaining quest refs include issuer / giver ids, acceptance-expiry lifecycle refs, objective-state refs, reward ledger links, follow-on or failure consequence refs, and canonical tracked-objective ownership
  - remaining chronicle refs include source event ids, replay/sort indices, encounter / transaction / dialogue / route / recipe / codex / reputation linkbacks, and stable references to the systems that emitted each event

#### World-panel map rendering against authored geography data

- Status: deferred
- Prerequisite: the UI now accepts snapshot-fed known locations and world records; remaining prerequisite is exposing authored `world_maps`, `world_map_features`, route geometry, and visibility state through that snapshot layer
- Intended owner: `apps/rpg-ui` world panel plus future map/presentation adapters
- Intended implementation:
  - the world tab now consumes snapshot-fed known locations and world records for side lists/details, but the map surface remains a placeholder renderer
  - replace the placeholder with rendered authored geography layers tied to the canonical map coordinate system and live player-known-location visibility
  - layer route risk, settlement supply-demand overlays, and region tooltips onto the same map surface after the adapter contract is stable

#### Desktop packaging and embedded launch flow

- Status: deferred
- Prerequisite: a root-level player launcher now exists; remaining prerequisites are a stable production build pipeline for `apps/rpg-ui` and a clear ownership decision for running or embedding the simulation/runtime host in desktop builds
- Intended owner: desktop packaging, `apps/rpg-ui`, and future app-host/runtime integration layers
- Intended implementation:
  - keep `Play Cataclysm.cmd` as the current non-technical root entrypoint while the project remains browser-hosted in development, with the root launcher explicitly handing the UI URL to the system default browser once the dev server responds
  - package the player UI into a desktop shell once the save flow, launcher behavior, and runtime bridge are stable enough that browser-specific boot assumptions can be removed
