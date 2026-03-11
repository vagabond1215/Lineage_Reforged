# Survival-Builder-RPG Foundation

TypeScript-first, headless simulation scaffold for a survival/builder/RPG project.

## Layout

- `apps/sim-runner`: headless CLI entrypoint for the simulation loop.
- `packages/content`: canonical JSON content (`base`) and additive packs (`packs`).
- `packages/schemas`: structural schemas and semantic rule declarations.
- `packages/db`: SQL migration templates, seeds, and generated build outputs.
- `packages/engines`: world/civilization/player/game engine stubs.
- `packages/shared`: shared contracts, events, clock, RNG, and persistence primitives.
- `tools`: command surfaces for content linting, DB build, and deterministic scenarios.
- `tests`: unit, integration, and simulation test scaffolding.
- `docs`: architecture notes, data dictionary, and simulation rules.

## Quick Commands

- `npm run tool:content-lint`
- `npm run tool:db-build`
- `npm run tool:scenario`
- `npm test`

## Current Scope

This is intentionally a foundation pass: contracts, folder boundaries, schemas, stubs, and docs.
Gameplay systems and full simulation implementation are deferred to future iterations.

## Content Browser

Run the local browser app to read story files and inspect content databases/reports:

- Double-click `run-content-browser.cmd`
- or run `powershell -NoProfile -ExecutionPolicy Bypass -STA -File .\scripts\content_story_browser.ps1`

The app shows three sections:

- `Databases` (JSON files under `packages/content/base`)
- `Coverage Reports` (report markdown under `docs/data-dictionary`)
- `Story` (markdown files under `story`)

