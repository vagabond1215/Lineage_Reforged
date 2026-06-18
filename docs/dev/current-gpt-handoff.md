# Current GPT Handoff

Source route: Codex local implementation after `Version 0.5.179 - Religious Hotspot Knowledge Subject Schema And Validator`, plus connector-side user-decision context from 2026-06-17 and 2026-06-18
Date: 2026-06-18
Branch/status assumption: `master`; latest numbered implementation is local and June 18 accepted recommendations are merged.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest numbered Codex handoff.
- `docs/design/religious-hotspot-knowledge-subject-vocabulary-plan.md` owns the direct subject and active-only policy decisions consumed by 0.5.179.
- Both Knowledge subject schemas now include `religious_hotspot`.
- `tools/content-lint/knowledge-snippets.mjs` resolves direct hotspot ids and requires status `active` for hotspot snippet subjects.
- `packages/content/base/world/religious_hotspots.json` remains exactly two `planned` records.
- Live Knowledge snippets and `knowledge_domain.religion` registry content remain unchanged.
- `docs/design/user-design-decisions-2026-06-17.md` and `docs/design/user-design-decisions-2026-06-18.md` preserve broader future-system user decisions; they did not broaden 0.5.179.
- `docs/design/open-design-questions-index.md` owns the reduced outstanding-question list after the June 18 intake and accepted recommendations.
- `docs/dev/project-roadmap.md`, `docs/dev/codex-sequenced-implementation-plan.md`, and `docs/future_content_backlog.md` own direction and deferred work.

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

## Connector-Side Decisions After 0.5.178

The June 18 connector intake captured future-system decisions only. These decisions do not alter the completed 0.5.179 scope.

Key durable decisions:

- elemental religious-order placeholder ids should use `religious_order.elemental.[element]`;
- use the accepted FFXI-style elemental relationships, with Light and Darkness opposed;
- Earth and Thunder are intrinsic element names, while stone/rock and lightning may be applied spell labels;
- relationship structures should use separate top-level categories;
- elemental favorability normally floors at 0 for indirect changes, while direct antagonistic actions may reach a per-element floor of -100;
- negative elemental values do not count against the positive 100 total favorability cap;
- default elemental favorability is 0 unless scoped backstories or Prestige unlocks later adjust it;
- difficulty modes should be Story, Adventure, Trial, Extreme, and Prestige-locked Custom, with a hardcore toggle and inverse Prestige scaling;
- first difficulty weights should be Combat Danger 25, Survival Pressure 20, Economy Pressure 15, Progression Friction 20, and Consequence Severity 20;
- NPCs should begin as generated role placeholders and persist only after meaningful promotion by events, roles, relationships, or history;
- inventory should use weight plus item-bulk container capacity and purse coin limits;
- the first storage implementation should cover character containers while preserving later vehicle and settlement extension;
- sacred sites should be planned after generic hotspot snippets but before full favorability/alignment mechanics, with pilgrimage as the first mechanic;
- map/grid authority cleanup and projection should precede serious travel planning.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.179` | Religious Hotspot Knowledge Subject Schema And Validator | Completed |
| 2 | `0.5.180` | Religious Hotspot Knowledge Snippet Seed Plan | Recommended next |
| 3 | Later | Hotspot content-status update before live snippets | Required by active-only policy |
| 4 | Later | Religious Hotspot Knowledge Snippet Seed | Deferred |

Sacred sites, religious orders, Religious Favorability And Elemental Alignment, broader relationship systems, difficulty implementation, NPC generation, inventory, map/grid overhaul, travel, and broader runtime systems remain deferred unless explicitly prioritized.
