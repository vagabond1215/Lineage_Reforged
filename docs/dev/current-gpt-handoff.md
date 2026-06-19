# Current GPT Handoff

Source route: Codex local documentation decision through `Version 0.5.192 - Sacred Site Activation Decision`
Date: 2026-06-19
Branch/status assumption: `master`; latest numbered run is documentation-only.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest numbered Codex handoff.
- `docs/design/sacred-site-activation-decision.md` owns activation readiness, activation meaning, remaining snippet blockers, and the 0.5.193 boundary.
- `packages/content/base/world/sacred_sites.json` remains canonical site authority with exactly one planned record.
- Active site status remains descriptive world authority only and does not create mechanics.
- Live Religion does not advertise `sacred_site` or `world.sacred_sites`; all policy refs remain null.

## Current Anchor

Latest completed numbered run:

- `Version 0.5.192 - Sacred Site Activation Decision`

Immediate next numbered Codex run:

- `Version 0.5.193 - Sacred Site Content Status Activation`

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.192 Result

- Approved the Glasswake Shrine sacred-site record for later active status.
- Confirmed schema, pure validation, normal lint registration, active parent authority, matching place anchors, and canonical religion authority.
- Confirmed the record omits unsupported deity, religious-order, faith-posture, runtime, and gameplay claims.
- Defined active status as live descriptive named-site authority only.
- Deferred the actual status change to 0.5.193.
- Changed no content, Knowledge support, registry, snippet, hotspot, runtime, UI, storage, or gameplay behavior.

## Current Live Boundaries

- The only sacred-site record remains `planned` and is not yet Knowledge-eligible.
- Religion still supports only `religion`, `deity`, and `religious_hotspot`; it does not advertise `sacred_site` or `world.sacred_sites`.
- No sacred-site Knowledge snippets exist.
- `religious_hotspot.glasswake_shrine_lantern_gardens` remains the only active hotspot.
- `religious_hotspot.lantern_shrine_gardens` remains planned and unreferenced.
- Hotspot `sacredSiteType` remains descriptive only.
- Normal content lint remains 58 checked files.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.192` | Sacred Site Activation Decision | Completed; documentation only |
| 2 | `0.5.193` | Sacred Site Content Status Activation | Recommended next; one status change only |
| 3 | Later | Sacred Site Knowledge Snippet Seed Plan | Deferred planning |
| 4 | Later | Sacred Site Religion Registry And Snippet Seed | Deferred content |

Broad Religion runtime, UI, pilgrimage, relationship, law, order, and Magic Study lanes remain blocked.
