# Current GPT Handoff

Source route: Codex local content activation through `Version 0.5.193 - Sacred Site Content Status Activation`
Date: 2026-06-19
Branch/status assumption: `master`; latest numbered run changes one live status value.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest numbered Codex handoff.
- `docs/design/sacred-site-activation-decision.md` owns activation meaning and the completed 0.5.193 boundary.
- `packages/content/base/world/sacred_sites.json` is canonical site authority with exactly one active record.
- Active site status remains descriptive world authority only and does not create mechanics.
- Live Religion does not advertise `sacred_site` or `world.sacred_sites`; all policy refs remain null.

## Current Anchor

Latest completed numbered run:

- `Version 0.5.193 - Sacred Site Content Status Activation`

Immediate next numbered Codex run:

- `Version 0.5.194 - Sacred Site Knowledge Snippet Seed Plan`

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.193 Result

- Changed `sacred_site.glasswake_shrine_lantern_gardens.glasswake_shrine.status` from `planned` to `active`.
- Changed no other sacred-site field.
- Updated the focused live-seed test to require exactly one active record and confirm forbidden authority/behavior fields remain absent.
- Preserved normal content lint at 58 checked files.
- Changed no Religion registry, Knowledge snippet, religious hotspot, runtime, UI, storage, pilgrimage, or gameplay behavior.

## Current Live Boundaries

- The only sacred-site record is active and is eligible for future Knowledge subject references.
- Religion still supports only `religion`, `deity`, and `religious_hotspot`; it does not advertise `sacred_site` or `world.sacred_sites`.
- No sacred-site Knowledge snippets exist, so activation alone authorizes no live snippet.
- `religious_hotspot.glasswake_shrine_lantern_gardens` remains the only active hotspot.
- `religious_hotspot.lantern_shrine_gardens` remains planned and unreferenced.
- Hotspot `sacredSiteType` remains descriptive only.
- Normal content lint remains 58 checked files.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.193` | Sacred Site Content Status Activation | Completed; one status value only |
| 2 | `0.5.194` | Sacred Site Knowledge Snippet Seed Plan | Recommended next; documentation only |
| 3 | Later | Sacred Site Religion Registry And Snippet Seed | Deferred content |

Broad Religion runtime, UI, pilgrimage, relationship, law, order, and Magic Study lanes remain blocked.
