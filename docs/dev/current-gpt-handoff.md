# Current GPT Handoff

Source route: Codex local content cleanup through `Version 0.5.195 - Sacred Site Active Text Cleanup`
Date: 2026-06-19
Branch/status assumption: `master`; latest numbered run changes two status-prose strings only.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest numbered Codex handoff.
- `docs/design/sacred-site-knowledge-snippet-seed-plan.md` owns the approved first snippet, non-duplication boundary, paired registry timing, and validation expectations.
- `packages/content/base/world/sacred_sites.json` remains canonical site authority with exactly one active record and no stale planned wording.
- Live Religion does not yet advertise `sacred_site` or `world.sacred_sites`; all policy refs remain null.

## Current Anchor

Latest completed numbered run:

- `Version 0.5.195 - Sacred Site Active Text Cleanup`

Immediate next numbered Codex run:

- `Version 0.5.196 - Sacred Site Religion Registry And Snippet Seed`

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.195 Result

- Replaced stale `planned` wording in the active Glasswake Shrine summary with `active` wording.
- Replaced stale `Planned descriptive authority only` in the first note with `Active descriptive authority only`.
- Kept status active and changed no other sacred-site field.
- Added focused exact wording and no-planned-language assertions.
- Preserved normal content lint at 58 checked files.
- Changed no registry, snippet, hotspot, schema, validator, runtime, UI, storage, or gameplay behavior.

## Current Live Boundaries

- The only sacred-site record is active and text-consistent.
- Religion still supports only `religion`, `deity`, and `religious_hotspot`; it does not advertise `sacred_site` or `world.sacred_sites`.
- No sacred-site Knowledge snippet exists.
- `religious_hotspot.glasswake_shrine_lantern_gardens` remains the active parent hotspot and broader existing snippet subject.
- `religious_hotspot.lantern_shrine_gardens` remains planned and unreferenced.
- Hotspot `sacredSiteType` remains descriptive only.
- Normal content lint remains 58 checked files.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.195` | Sacred Site Active Text Cleanup | Completed; two strings only |
| 2 | `0.5.196` | Sacred Site Religion Registry And Snippet Seed | Recommended next; paired registry and one snippet |

Broad Religion runtime, UI, pilgrimage, relationship, law, order, and Magic Study lanes remain blocked.
