# Lineage: Reforged RPG Foundation

TypeScript-first, headless simulation scaffold for a grounded medieval-fantasy, dynasty-driven systemic RPG.

## Project Identity

Lineage: Reforged is a foundation-stage RPG where characters, families, places, records, and inherited consequences should matter over generic perk-tree progression. Current development favors narrow validated slices, current-data-first rules, owner-aware systems, and readable long-term payoff before broad runtime expansion.

Strategic continuity lives in:

- `docs/dev/current-codex-output.md` for the latest exact implementation handoff.
- `docs/dev/current-gpt-handoff.md` for current prompt guardrails and connector-side risks.
- `docs/dev/project-roadmap.md` for version order and maturity checkpoints.
- `docs/design/future-system-design-ledger.md` for durable system criteria and vocabulary.
- `docs/dev/project-vision-and-continuity-brief.md` for the strategic source map.

## Codex Workspace

- The active local Codex workspace root is `C:\Codex\EoL`.
- When recreating or updating the Codex project entry, point it at `C:\Codex\EoL` so file explorer, terminal, and workspace permissions resolve to the moved repository.
- The previous OneDrive checkout path is not the active workspace source of truth.

## Project Layout

- `apps/sim-runner`: CLI entrypoint for deterministic simulation ticks.
- `packages/content`: canonical JSON content (`base`) plus additive packs (`packs`).
- `packages/schemas`: JSON schemas and semantic rule declarations.
- `packages/db`: SQL migration templates, seeds, and build outputs.
- `packages/engines`: world/civilization/player/game engine stubs.
- `packages/shared`: shared contracts, clock, RNG, events, and persistence primitives.
- `tools`: content linting, DB build, and scenario tooling.
- `tests`: unit, integration, and simulation scaffolding.
- `docs`: architecture notes and data dictionaries.

## Asset Handling

- UI-facing active art belongs under `apps/rpg-ui/public/` in the feature-specific folder that actually serves it at runtime. Character creator card art should live under `apps/rpg-ui/public/character-creator/<category>/` and keep the canonical filenames referenced by `apps/rpg-ui/src/game-shell/worldSelectionCatalog.ts`.
- Content-owned source art that exists to support canonical world data, map rendering, or content tooling belongs under the relevant `packages/content/...` path, such as `packages/content/base/world/map_assets/`.
- Replaced, inactive, or intentionally archived images should be moved into `unused assets/<category>/` at the repo root instead of being left in active asset folders or loose in the root.
- Root-level loose image files should be treated as temporary intake only. During the same Codex run that uses them, either move them into the correct active asset folder with the canonical runtime filename or archive them under `unused assets/`.
- `apps/rpg-ui/dist/` is generated output, not the primary source of truth. When the UI build is healthy, let the build regenerate `dist`. If build issues temporarily prevent regeneration but the checked-in runtime assets still need to stay usable, mirror the finalized active files from `apps/rpg-ui/public/` into the matching `dist` location as a follow-up step rather than authoring assets in `dist` first.

## Current Data Systems

- World data: biomes, habitats, flora, fauna, calendar, climate profiles, regional ecology profiles, named regions, region locality bands, region-first settlements and dependent sites, shared guild definitions, authored travel networks, world-map metadata, and coordinate-backed world-map feature geometry retained as optional visual/reference support.
- World geography model: continents, subregions, island systems, oceans, locality-band terrain pockets, survivability/population capacity, region-first settlement derivation, climate/biome/elevation modifiers, terrain features, travel baselines, trade-route prerequisites, conflict zones, and named settlement networks.
- Browser map viewer: the content browser can render stored full-size biome and elevation raster layers when available, with source-aligned polygonal overlays, continent/region labels, settlement dots/names, and authored route lines on the shared 2048x1152 pixel grid, but those map layers are display/debug aids rather than simulation-authoritative settlement truth.
- Climate rules: 6-season model, 13-month calendar, and 52-week seasonal length validation.
- Player model: attributes/resources/skills/spells/abilities/traits/equipment/inventory/save metadata.
- Economy model:
  - workplace tier progression (`tierProfile`)
  - workplace upgrades and tier gate requirements (`upgradesProfile`)
  - infrastructure tier progression with technology/material/labor gates, direct higher-tier construction, and higher retrofit labor (`infrastructure`)
  - market context and integration/combo bonuses (`marketProfile`, `integrationProfile`)
  - workforce job curves, job tool requirements, and diminishing returns (`workforceProfile`)
  - production chain variants (input-driven outputs via `variantConfig`)
  - civilization tick economy ledgers aggregated across workplace, building, settlement, subregion, region, and world-map top level
  - baseline guild-issued quest generation driven by supply/demand shortfalls, surpluses, frontier conditions, and security hazards
- Quest data:
  - lightweight settlement/guild-driven `quest_templates` for procedural offer generation
  - reusable `quest_archetypes` for standard branching gathering, escort, extermination, porter, crafting, labor, salvage, and masterwork quest structures
  - authored `quest_definitions` with giver metadata, eligibility requirements, scheduling, rank/risk, deployment roles, and branching action trees

## Workplace Progression and Upgrades

Workplaces can now define:

- `tierProfile`: progression track and upgrade path between facilities.
- `upgradesProfile`: optional upgrade catalog with required dependencies and upgrade effects.
- `tierUpgradeRequirements`: essential upgrades that gate tier advancement.
- `workforceProfile` (required): max concurrent worker cap, tier-gated job assignments, required tools per job, missing-tool output penalties, per-worker rates, and diminishing returns.

Example design intent already captured in content:

- forge tooling upgrades such as bellows
- mine/quarry logistics upgrades such as rail carts, pulleys, and hauling lanes
- forestry lodge-and-above replanting unlock via `job.forester`

## Player Launchers

Use the root launchers for the current playable UI flow:

- Double-click `Play Lineage Reforged.cmd` to start the RPG UI from the project root and open it in your default browser

Launcher logs are written under `logs/`.

## Launcher UI

- The `Game Data` surface now uses compact horizontal save rows with visible empty manual slots, shows 16 manual slots per page across eight pages, relies on empty save-row activation instead of a redundant secondary-bar `New Character` action, and organizes occupied rows into clearer name, save-time, summary, and mirrored delete-rail segments.

## Creator UI

- The character creator uses a compact two-bar shell with inline step progress so the active form keeps more viewport space than the older left-rail layout.
- Expanded generated-profile and starter-detail summary blocks stay on the final review step, while the live summary remains focused on active creation choices.
- Launcher shell chrome, creator chrome, and shell-adjacent status surfaces now share semantic theme tokens so selected states, actions, progress, and light-mode contrast stay more consistent.
- The shared game UI font tokens now prefer the Arial Nova family with Arial and Segoe UI fallbacks so launcher, creator, and runtime chrome all render through the same sans-serif stack.

## In-Game UI

- The in-game shell now uses a compact single-band top bar that keeps name, date/time, condition, HP, MP, stamina, notifications, and settings visible without the older stacked quest and wallet rows.
- Fresh characters now begin at full resolved HP, MP, and stamina so creator preview values match the opening in-game state.
- Creator continent, region, settlement, and lineage card art now bottom-anchor with width-fit defaults to avoid the recent cropped-image regression.

## Quick Commands

- `npm run tool:content-lint`
- `npm run tool:db-build`
- `npm run tool:scenario`
- `npm run typecheck` for the current default UI TypeScript target; it is repeatable but may still fail on known strictness blockers until the typecheck backlog is cleaned.
- `npm run typecheck:workspace` for the broader root `tsconfig.json` audit target, which is expected to expose known cleanup blockers.
- `npm test`

On Windows PowerShell, use `npm.cmd` in place of `npm` if the PowerShell execution policy blocks the npm shim.

## Scope Note

This repository is still a foundation phase. Core data models, validation, and a first-pass civilization tick for economy/quest generation are in place, while full fulfillment, stockpile movement, combat, and balancing logic continue to be implemented incrementally.

## Future Content Backlog

Deferred systems and intentionally held-off content live in [docs/future_content_backlog.md](docs/future_content_backlog.md).

Intent:

- preserve planned-but-delayed systems in one place
- record prerequisites, ownership, and implementation direction for future passes
- keep Codex runs aligned with intentionally held scope before new work starts

This backlog is intended to be updated on each Codex run whenever:

- new future work is deferred
- a deferred item changes prerequisites or ownership
- a deferred item is started or completed
