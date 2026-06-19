# Current GPT Handoff

Source route: Codex local documentation pass through `Version 0.5.186 - Sacred Site Authority Schema Decision`
Date: 2026-06-19
Branch/status assumption: `master`; latest numbered run is documentation-only.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest numbered Codex handoff.
- `docs/design/sacred-site-authority-schema-decision.md` owns the future sacred-site wrapper, file family, record shape, id/slug rules, enums, references, status semantics, validation, and immediate sequence.
- `docs/design/sacred-site-authority-plan.md` remains the higher-level authority for the separate named-site layer and behavior boundaries.
- `docs/design/religion-system-expansion-research-plan.md` remains broad planning context and must not broaden the focused sacred-site lane.
- No `world.sacred_sites`, schema, validator, test, direct Knowledge subject support, or sacred-site snippet exists.
- Existing `sacredSiteType` fields remain descriptive metadata only.

## Current Anchor

Latest completed numbered run:

- `Version 0.5.186 - Sacred Site Authority Schema Decision`

Immediate next numbered Codex run:

- `Version 0.5.187 - Sacred Site Content Seed Plan` (planning only)

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.186 Result

- Selected `world.sacred_sites`, `packages/content/base/world/sacred_sites.json`, `packages/schemas/world/sacred-site.schema.json`, `tools/content-lint/sacred-sites.mjs`, and focused `tests/unit/sacred-sites-validation.test.mjs` as future paths.
- Selected an exact records-only wrapper and place-qualified `sacred_site.<place_or_region_slug>.<site_slug>` ids with flattened unique slugs.
- Defined required and optional fields, strict place anchors, identical planned/active structure, stronger active semantics, and parent-hotspot coherence.
- Selected conservative type, public-posture, and descriptive pilgrimage vocabularies.
- Defined fail-closed validation and staged Knowledge subject support after canonical site authority exists.
- Added no schema, validator, test, content, snippet, registry, hotspot, runtime, UI, storage, pilgrimage, favorability, alignment, law, order, Magic Study, or gameplay behavior.

## Current Live Boundaries

- Religion supports `religion`, `deity`, and `religious_hotspot`; it does not advertise `sacred_site` or `world.sacred_sites`.
- Exactly one live hotspot snippet targets the active Glasswake settlement hotspot.
- `religious_hotspot.lantern_shrine_gardens` remains planned without `dominantFaithIds` and unreferenced.
- No named sacred-site authority exists; hotspot `sacredSiteType` values remain descriptive only.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.186` | Sacred Site Authority Schema Decision | Completed; documentation only |
| 2 | `0.5.187` | Sacred Site Content Seed Plan | Recommended next; documentation only |
| 3 | Later | Sacred Site Schema And Validator | Deferred implementation |
| 4 | Later | First Sacred Site Content Seed | Deferred content implementation |

Broad Religion runtime and UI lanes remain blocked.
