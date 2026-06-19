# Current GPT Handoff

Source route: Codex local implementation through `Version 0.5.191 - Sacred Site Knowledge Subject Support`
Date: 2026-06-19
Branch/status assumption: `master`; latest numbered run adds schema and validator support only.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest numbered Codex handoff.
- `docs/design/sacred-site-knowledge-subject-decision.md` owns direct subject vocabulary, authority resolution, active-only eligibility, registry timing, snippet posture, tests, and sequence.
- `packages/content/base/world/sacred_sites.json` remains canonical site authority with exactly one planned record.
- `religious_hotspot` and `sacred_site` remain separate subject types and authority collections.
- Live Religion does not advertise `sacred_site` or `world.sacred_sites`; all policy refs remain null.

## Current Anchor

Latest completed numbered run:

- `Version 0.5.191 - Sacred Site Knowledge Subject Support`

Immediate next numbered Codex run:

- `Version 0.5.192 - Sacred Site Activation Decision`

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.191 Result

- Added `sacred_site` to Knowledge snippet and registry schema vocabularies.
- Added `world.sacred_sites` dependency loading and exact place-qualified subject authority.
- Enforced active-only sacred-site Knowledge eligibility; planned, deferred, missing, malformed, type-only, settlement, hotspot, and cross-type references are rejected.
- Added focused in-memory tests for future Religion alignment and active site acceptance without changing live content.
- Preserved normal content lint at 58 checked files.
- Added no registry content, snippet, activation, hotspot, runtime, UI, storage, pilgrimage, or gameplay behavior.

## Current Live Boundaries

- Religion still supports only `religion`, `deity`, and `religious_hotspot`; it does not advertise `sacred_site` or `world.sacred_sites`.
- The only sacred-site record remains planned and is not Knowledge-eligible.
- No sacred-site Knowledge snippets exist.
- Exactly one live hotspot snippet remains valid for the active Glasswake settlement hotspot.
- `religious_hotspot.lantern_shrine_gardens` remains planned without `dominantFaithIds` and unreferenced.
- Hotspot `sacredSiteType` remains descriptive only.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.191` | Sacred Site Knowledge Subject Support | Completed; schema/validator/tests only |
| 2 | `0.5.192` | Sacred Site Activation Decision | Recommended next; documentation only |
| 3 | Later | Sacred Site Activation | Deferred content decision outcome |
| 4 | Later | Sacred Site Religion Registry And Snippet Seed | Deferred content |

Broad Religion runtime, UI, pilgrimage, relationship, law, order, and Magic Study lanes remain blocked.
