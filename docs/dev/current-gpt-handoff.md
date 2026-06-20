# Current GPT Handoff

Source route: Codex local documentation planning through `Version 0.5.194 - Sacred Site Knowledge Snippet Seed Plan`
Date: 2026-06-19
Branch/status assumption: `master`; latest numbered run is documentation-only.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest numbered Codex handoff.
- `docs/design/sacred-site-knowledge-snippet-seed-plan.md` owns the first snippet candidate, wording, non-duplication boundary, cleanup prerequisite, registry timing, and validation expectations.
- `packages/content/base/world/sacred_sites.json` remains canonical site authority with exactly one active record.
- The active site has stale `planned` wording in its summary and first note; cleanup must precede Knowledge seeding.
- Live Religion does not advertise `sacred_site` or `world.sacred_sites`; all policy refs remain null.

## Current Anchor

Latest completed numbered run:

- `Version 0.5.194 - Sacred Site Knowledge Snippet Seed Plan`

Immediate next numbered Codex run:

- `Version 0.5.195 - Sacred Site Active Text Cleanup`

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.194 Result

- Approved one future Tier 1 Religion identification snippet for the active Glasswake Shrine sacred site.
- Fixed the exact future id, subject, title, summary, hidden summary, book-study source, progression, visibility, and descriptive-only note posture.
- Kept the named-site snippet distinct from the broader Glasswake Shrine Lantern Gardens hotspot snippet.
- Required Religion registry alignment and snippet creation to land together after cleanup.
- Found stale `planned` wording in the active site's summary and first note.
- Changed no live content, registry, snippet, schema, validator, test, hotspot, runtime, UI, storage, or gameplay behavior.

## Current Live Boundaries

- The only sacred-site record remains active but needs narrow status-wording cleanup.
- Religion still supports only `religion`, `deity`, and `religious_hotspot`; it does not advertise `sacred_site` or `world.sacred_sites`.
- No sacred-site Knowledge snippets exist.
- `religious_hotspot.glasswake_shrine_lantern_gardens` remains the active parent hotspot and existing broader snippet subject.
- `religious_hotspot.lantern_shrine_gardens` remains planned and unreferenced.
- Hotspot `sacredSiteType` remains descriptive only.
- Normal content lint remains 58 checked files.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.194` | Sacred Site Knowledge Snippet Seed Plan | Completed; documentation only |
| 2 | `0.5.195` | Sacred Site Active Text Cleanup | Recommended next; two stale phrases only |
| 3 | Later | Sacred Site Religion Registry And Snippet Seed | Deferred until cleanup lands |

Broad Religion runtime, UI, pilgrimage, relationship, law, order, and Magic Study lanes remain blocked.
