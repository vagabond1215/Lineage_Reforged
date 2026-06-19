# Current GPT Handoff

Source route: Codex local documentation pass through `Version 0.5.184 - Sacred Site Authority Plan`
Date: 2026-06-19
Branch/status assumption: `master`; latest numbered run is documentation-only.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest numbered Codex handoff.
- `docs/design/sacred-site-authority-plan.md` owns future sacred-site collection, identity, minimum-field, Knowledge sequencing, and boundary decisions.
- `docs/design/religious-hotspot-locality-snippet-decision.md` continues to own the decision to keep locality coverage planned and unreferenced.
- Named sacred sites should use a future separate `world.sacred_sites` authority while remaining rare specializations of canonical religious hotspots.
- Existing `sacredSiteType` fields are descriptive metadata only and create no named-site identity.
- The Glasswake settlement hotspot remains the only active hotspot and owns the only live hotspot snippet.
- `religious_hotspot.lantern_shrine_gardens` remains planned without `dominantFaithIds` and unreferenced.
- Religion advertises `religious_hotspot` and `world.religious_hotspots`; its policy refs remain null.
- No `world.sacred_sites`, `sacred_site.*` ids, direct sacred-site Knowledge vocabulary, or `knowledge_domain.sacred_sites` exists.

## Current Anchor

Latest completed numbered run:

- `Version 0.5.184 - Sacred Site Authority Plan`

Immediate next numbered Codex run:

- `Version 0.5.185 - Sacred Site Authority Schema Decision` (planning only)

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.184 Result

- Selected a future separate sacred-site authority collection linked to canonical parent religious hotspots.
- Defined minimum future identity, place, religion, optional deity/order, type, posture, descriptive pilgrimage, provenance, and boundary fields.
- Required canonical named-site ids before future sacred-site Knowledge snippets.
- Separated descriptive authority from Knowledge references, pilgrimage mechanics, favorability/alignment, law/access, order control, and runtime state.
- Kept `sacredSiteType` descriptive and changed no live content.
- Added no sacred-site content, snippet, registry, hotspot, schema, validator, source, test, runtime, UI, storage, gameplay, pilgrimage, favorability, alignment, law, religious-order, spell, Magic Study, Prestige, family, NPC, inventory, map/grid, or travel behavior.

## Deferred Context

- `0.5.185` should finalize exact sacred-site schema and semantic-validation decisions as documentation only.
- A later approved sequence should separate schema/validator implementation, seed planning, planned content, Knowledge vocabulary, active status, and snippet content.
- Pilgrimage remains the preferred first later sacred-site mechanic but has no contract or behavior yet.
- Religious-order stewardship, favorability/alignment, legal/access consequences, confluence sites, runtime state, UI, storage, rewards, events, commands, Magic Study, Prestige, family, NPC, inventory, map/grid, travel, and gameplay remain deferred.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.184` | Sacred Site Authority Plan | Completed; documentation only |
| 2 | `0.5.185` | Sacred Site Authority Schema Decision | Recommended next; planning only |
| 3 | Later | Sacred Site Authority Schema And Validator | Deferred implementation |
