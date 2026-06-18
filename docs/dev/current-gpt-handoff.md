# Current GPT Handoff

Source route: Codex local implementation after `Version 0.5.179 - Religious Hotspot Knowledge Subject Schema And Validator`
Date: 2026-06-18
Branch/status assumption: `master`; latest numbered implementation is local.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest numbered Codex handoff.
- `docs/design/religious-hotspot-knowledge-subject-vocabulary-plan.md` owns the direct subject and active-only policy decisions consumed by 0.5.179.
- Both Knowledge subject schemas now include `religious_hotspot`.
- `tools/content-lint/knowledge-snippets.mjs` now resolves direct hotspot ids and requires status `active` for hotspot snippet subjects.
- `packages/content/base/world/religious_hotspots.json` remains exactly two `planned` records.
- Live Knowledge snippets and `knowledge_domain.religion` registry content remain unchanged.
- `docs/design/user-design-decisions-2026-06-17.md` and `docs/design/open-design-questions-index.md` remain future planning context only.

## Current Anchor

Latest completed numbered run:

- `Version 0.5.179 - Religious Hotspot Knowledge Subject Schema And Validator`

Immediate next numbered Codex run:

- `Version 0.5.180 - Religious Hotspot Knowledge Snippet Seed Plan`

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.179 Result

- Added `religious_hotspot` to both Knowledge schema vocabularies.
- Loaded live hotspot authority into Knowledge snippet dependency validation without increasing the 57-file normal lint count.
- Added canonical id resolution plus deterministic malformed, unresolved, and active-status rejection.
- Added focused active in-memory fixtures for both current hotspot ids and rejection coverage for planned records and shortcut subjects.
- Preserved existing `religion` and `deity` behavior.
- Added no live snippets or registry content changes.
- Activated no hotspot records; both remain `planned`.
- Added no sacred-site/order/favorability/alignment/relationship/law/runtime/UI/storage/reward/event/command/Magic Study/Prestige/family/gameplay behavior.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.179` | Religious Hotspot Knowledge Subject Schema And Validator | Completed |
| 2 | `0.5.180` | Religious Hotspot Knowledge Snippet Seed Plan | Recommended next |
| 3 | Later | Hotspot content-status update before live snippets | Required by active-only policy |
| 4 | Later | Religious Hotspot Knowledge Snippet Seed | Deferred |

Sacred sites, religious orders, Religious Favorability And Elemental Alignment, and broader relationship systems remain deferred.
