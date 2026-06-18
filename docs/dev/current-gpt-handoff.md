# Current GPT Handoff

Source route: Codex local documentation pass after `Version 0.5.178 - Religious Hotspot Knowledge Subject Vocabulary Plan`, plus connector-side user-decision context from 2026-06-17
Date: 2026-06-18
Branch/status assumption: `master`; latest numbered run is documentation-only.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest numbered Codex handoff.
- `docs/design/religious-hotspot-knowledge-subject-vocabulary-plan.md` owns the direct subject decision, active-status reference policy, future schema/validator touchpoints, tests, and boundaries for 0.5.179.
- `packages/content/base/world/religious_hotspots.json` remains the live authority with exactly two `planned` records.
- `packages/schemas/world/religious-hotspot.schema.json` and `tools/content-lint/religious-hotspots.mjs` remain unchanged hotspot validation authorities.
- `docs/design/user-design-decisions-2026-06-17.md` and `docs/design/open-design-questions-index.md` remain future planning context only.
- `docs/dev/project-roadmap.md`, `docs/dev/codex-sequenced-implementation-plan.md`, and `docs/future_content_backlog.md` own direction and deferred work.

## Current Anchor

Latest completed numbered run:

- `Version 0.5.178 - Religious Hotspot Knowledge Subject Vocabulary Plan`

Immediate next numbered Codex run:

- `Version 0.5.179 - Religious Hotspot Knowledge Subject Schema And Validator`

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.178 Result

- Added a documentation-only plan recommending direct `religious_hotspot` subject vocabulary.
- Planned enum additions in both Knowledge schemas and direct authority loading in Knowledge snippet validation.
- Preserved existing `religion` and `deity` behavior and rejected `custom`, `shrine`, `sacred_site`, region, and settlement shortcuts.
- Selected an active-only policy for live hotspot snippets. Both live hotspot records remain `planned`; 0.5.179 must not activate them or add snippets.
- Kept Religion active with exactly two current snippets and null trial, completion, and visibility policy references.
- Normal content lint remains 57 checked files.
- Added no schema, validator, source, test, content JSON, runtime, UI, storage, reward, event, command, favorability, alignment, relationship, law, Magic Study, Prestige, family, or gameplay changes.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.178` | Religious Hotspot Knowledge Subject Vocabulary Plan | Completed |
| 2 | `0.5.179` | Religious Hotspot Knowledge Subject Schema And Validator | Recommended next |
| 3 | `0.5.180` | Religious Hotspot Knowledge Snippet Seed Plan | Recommended |
| 4 | Later | Hotspot content-status update before live snippets | Required by active-only policy |

Sacred sites, religious orders, Religious Favorability And Elemental Alignment, and broader relationship systems remain deferred.
