# Current GPT Handoff

Source route: Codex local documentation pass through `Version 0.5.190 - Sacred Site Knowledge Subject Decision`
Date: 2026-06-19
Branch/status assumption: `master`; latest numbered run is documentation-only.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest numbered Codex handoff.
- `docs/design/sacred-site-knowledge-subject-decision.md` owns future direct subject vocabulary, authority resolution, active-only eligibility, registry timing, snippet posture, tests, and sequence.
- `packages/content/base/world/sacred_sites.json` remains canonical site authority with exactly one planned record.
- `religious_hotspot` and `sacred_site` remain separate subject types and authority collections.
- Live Religion does not advertise `sacred_site` or `world.sacred_sites`; all policy refs remain null.

## Current Anchor

Latest completed numbered run:

- `Version 0.5.190 - Sacred Site Knowledge Subject Decision`

Immediate next numbered Codex run:

- `Version 0.5.191 - Sacred Site Knowledge Subject Support`

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.190 Result

- Approved direct `sacred_site` subjects within `knowledge_domain.religion` in principle.
- Selected `world.sacred_sites` as the canonical authority with an exact two-segment site-id pattern.
- Required active-only subject eligibility and explicit rejection of planned, deferred, unresolved, malformed, and cross-type ids.
- Deferred live Religion registry alignment until one site is active and the first snippet seed is ready.
- Defined a future descriptive Tier 1 identification snippet posture and strict forbidden claims.
- Added no Knowledge support, schema, validator, test, snippet, registry, site status, hotspot, runtime, UI, storage, pilgrimage, or gameplay behavior.

## Current Live Boundaries

- Religion supports only `religion`, `deity`, and `religious_hotspot`; it does not advertise `sacred_site` or `world.sacred_sites`.
- The only sacred-site record remains planned and is not Knowledge-eligible.
- Exactly one live hotspot snippet remains valid for the active Glasswake settlement hotspot.
- `religious_hotspot.lantern_shrine_gardens` remains planned without `dominantFaithIds` and unreferenced.
- Hotspot `sacredSiteType` remains descriptive only.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.190` | Sacred Site Knowledge Subject Decision | Completed; documentation only |
| 2 | `0.5.191` | Sacred Site Knowledge Subject Support | Recommended next; schema/validator/tests only |
| 3 | Later | Sacred Site Status Activation Decision | Deferred planning |
| 4 | Later | Sacred Site Religion Registry And Snippet Seed | Deferred content |

Broad Religion runtime, UI, pilgrimage, relationship, law, order, and Magic Study lanes remain blocked.
