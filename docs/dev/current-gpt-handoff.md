# Current GPT Handoff

Source route: Codex local implementation pass through `Version 0.5.188 - Sacred Site Schema And Validator`
Date: 2026-06-19
Branch/status assumption: `master`; latest numbered run is a schema/validator foundation with no live sacred-site content.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest numbered Codex handoff.
- `docs/design/sacred-site-authority-schema-decision.md` owns the implemented structural and semantic contract.
- `docs/design/sacred-site-content-seed-plan.md` owns the exact first planned record for the next content-only run.
- `packages/schemas/world/sacred-site.schema.json` is the live future-record structural contract.
- `tools/content-lint/sacred-sites.mjs` is a pure explicit-dependency validator and is not registered in normal content lint.
- `tests/unit/sacred-sites-validation.test.mjs` owns focused fixture coverage.
- No `packages/content/base/world/sacred_sites.json` file, direct Knowledge support, or sacred-site snippet exists.

## Current Anchor

Latest completed numbered run:

- `Version 0.5.188 - Sacred Site Schema And Validator`

Immediate next numbered Codex run:

- `Version 0.5.189 - First Sacred Site Content Seed`

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.188 Result

- Added a strict records-only schema with place-qualified ids, flattened slugs, required place/parent/religion authority, conservative enums, and reserved optional deity/order fields.
- Added pure schema-first validation for unique identities, canonical references, place hierarchy, parent anchor/status coherence, deity/religion membership, and semantic rejection of order ids.
- Added 55 focused tests covering the planned Glasswake fixture and all requested failure cases.
- Registered the schema only in focused schema-file coverage; 83 schema tests pass.
- Kept normal content lint unmodified at 57 checked files.
- Added no content file, Knowledge support, snippet, registry, hotspot, runtime, UI, storage, pilgrimage, favorability, alignment, law, order, Magic Study, or gameplay behavior.

## Current Live Boundaries

- Religion still supports only `religion`, `deity`, and `religious_hotspot`; it does not advertise `sacred_site` or `world.sacred_sites`.
- Exactly one live hotspot snippet targets the active Glasswake settlement hotspot.
- `religious_hotspot.lantern_shrine_gardens` remains planned without `dominantFaithIds` and unreferenced.
- Hotspot `sacredSiteType` remains descriptive only.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.188` | Sacred Site Schema And Validator | Completed; schema/pure validator/focused tests |
| 2 | `0.5.189` | First Sacred Site Content Seed | Recommended next; one planned record plus normal-lint registration |
| 3 | Later | Sacred Site Knowledge Subject Decision | Deferred planning |
| 4 | Later | Sacred Site Knowledge Subject Support | Deferred implementation |

`0.5.189` must create only `sacred_sites.json` with the planned Glasswake record, register it in normal lint, and update focused tests as needed. It must not add Knowledge support, activation, snippets, runtime, UI, storage, pilgrimage, or gameplay behavior.
