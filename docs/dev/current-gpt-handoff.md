# Current GPT Handoff

Source route: Codex local content implementation through `Version 0.5.196 - Sacred Site Religion Registry And Snippet Seed`
Date: 2026-06-19
Branch/status assumption: `master`; latest numbered run changes the Religion registry, one Knowledge snippet, focused tests, and coordination docs only.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest numbered Codex handoff.
- `packages/content/base/player/knowledge_domain_registry.json` now advertises direct `sacred_site` subjects and `world.sacred_sites` under Religion; all Religion policy refs remain null.
- `packages/content/base/player/knowledge_snippets.json` contains exactly one sacred-site snippet targeting the active Glasswake Shrine authority.
- `packages/content/base/world/sacred_sites.json` and `packages/content/base/world/religious_hotspots.json` did not change in `0.5.196`.

## Current Anchor

Latest completed numbered run:

- `Version 0.5.196 - Sacred Site Religion Registry And Snippet Seed`

Immediate next numbered Codex run:

- `Version 0.5.197 - Religious Order Placeholder Authority Plan`

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.196 Result

- Added `sacred_site` and `world.sacred_sites` to the live Religion registry record.
- Kept Religion trial, completion, and visibility policy refs null; created no `knowledge_domain.sacred_sites`.
- Added exactly one Tier 1 `book_study` identification snippet for `sacred_site.glasswake_shrine_lantern_gardens.glasswake_shrine`.
- Preserved the existing Glasswake religious-hotspot snippet unchanged.
- Kept `religious_hotspot.lantern_shrine_gardens` planned and unreferenced; hotspot `sacredSiteType` remains descriptive only.
- Changed no sacred-site content, hotspot content, schema, validator, runtime, UI, storage, or gameplay behavior.
- Normal content lint remains 58 checked files.

## Next Route Boundary

`Version 0.5.197 - Religious Order Placeholder Authority Plan` is documentation-only. It should plan placeholder religious-order authority boundaries without adding order content, schemas, validators, snippets, runtime, UI, storage, or gameplay behavior.
