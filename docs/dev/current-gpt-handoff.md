# Current GPT Handoff

Source route: Codex local content pass through `Version 0.5.189 - First Sacred Site Content Seed`
Date: 2026-06-19
Branch/status assumption: `master`; latest numbered run is one planned sacred-site record plus normal-lint registration.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest numbered Codex handoff.
- `docs/design/sacred-site-content-seed-plan.md` owns the exact first record and its descriptive boundaries.
- `packages/content/base/world/sacred_sites.json` is live authored authority with exactly one planned record.
- `packages/schemas/world/sacred-site.schema.json` and `tools/content-lint/sacred-sites.mjs` own strict structural and semantic validation.
- Normal content lint loads the collection and remains the current live validation path at 58 checked files.
- No sacred-site Knowledge subject support, registry advertisement, activation, or snippet exists.

## Current Anchor

Latest completed numbered run:

- `Version 0.5.189 - First Sacred Site Content Seed`

Immediate next numbered Codex run:

- `Version 0.5.190 - Sacred Site Knowledge Subject Decision` (planning only)

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.189 Result

- Added exactly `sacred_site.glasswake_shrine_lantern_gardens.glasswake_shrine` at `planned` status.
- Preserved the planned draft's exact place anchor, active parent hotspot, Elemental Pantheon association, shrine type, tolerant posture, local descriptive pilgrimage status, provenance, and no-behavior notes.
- Registered `sacred_sites.json` and the pure validator in normal content lint, moving from 57 to 58 checked files.
- Updated focused tests to prove exactly one planned live record and normal-lint registration.
- Added no Knowledge support, snippet, Religion registry change, hotspot change, activation, runtime, UI, storage, pilgrimage, favorability, alignment, law, order, Magic Study, or gameplay behavior.

## Current Live Boundaries

- Religion supports only `religion`, `deity`, and `religious_hotspot`; it does not advertise `sacred_site` or `world.sacred_sites`.
- The only sacred-site record is planned and ineligible for Knowledge references.
- Exactly one live hotspot snippet targets the active Glasswake settlement hotspot.
- `religious_hotspot.lantern_shrine_gardens` remains planned without `dominantFaithIds` and unreferenced.
- Hotspot `sacredSiteType` remains descriptive only.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.189` | First Sacred Site Content Seed | Completed; one planned record plus normal lint |
| 2 | `0.5.190` | Sacred Site Knowledge Subject Decision | Recommended next; planning only |
| 3 | Later | Sacred Site Knowledge Subject Support | Deferred implementation |
| 4 | Later | Sacred Site Status Activation Decision | Deferred planning |

Broad Religion runtime, UI, pilgrimage, relationship, law, order, and Magic Study lanes remain blocked.
