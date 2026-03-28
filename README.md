# Cataclysm RPG Foundation

TypeScript-first, headless simulation scaffold for a survival / builder / RPG project.

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

- Double-click `Play Cataclysm.cmd` to start the RPG UI from the project root and open it in the browser

Launcher logs are written under `logs/`.

## Quick Commands

- `npm run tool:content-lint`
- `npm run tool:db-build`
- `npm run tool:scenario`
- `npm test`

## Scope Note

This repository is still a foundation phase. Core data models, validation, and a first-pass civilization tick for economy/quest generation are in place, while full fulfillment, stockpile movement, combat, and balancing logic continue to be implemented incrementally.

## Future Content Backlog

Deferred systems and intentionally held-off content live in [docs/future_content_backlog.md](/Users/vagab/OneDrive/Documents/Cataclysm%20RPG/docs/future_content_backlog.md).

Intent:

- preserve planned-but-delayed systems in one place
- record prerequisites, ownership, and implementation direction for future passes
- keep Codex runs aligned with intentionally held scope before new work starts

This backlog is intended to be updated on each Codex run whenever:

- new future work is deferred
- a deferred item changes prerequisites or ownership
- a deferred item is started or completed
