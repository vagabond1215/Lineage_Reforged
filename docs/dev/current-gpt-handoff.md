# Current GPT Handoff

Source route: Codex local implementation pass through `Version 0.5.182 - Religious Hotspot Knowledge Snippet Seed`, plus connector-side user-decision context through 2026-06-18
Date: 2026-06-19
Branch/status assumption: `master`; latest numbered run is a narrow Religion registry/snippet seed.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest numbered Codex handoff.
- `docs/design/religious-hotspot-knowledge-snippet-seed-plan.md` owns the activation target, first snippet posture, registry alignment timing, discovery-source limits, and 0.5.181/0.5.182 sequence.
- `docs/design/religious-hotspot-knowledge-subject-vocabulary-plan.md` remains authority for direct subject and active-only validation decisions.
- The settlement-scale Glasswake hotspot is `active` with validator-required `dominantFaithIds: ["religion.elemental_pantheon"]`; the locality-scale hotspot remains `planned` without `dominantFaithIds`.
- Live Religion registry content now advertises `religious_hotspot` and `world.religious_hotspots`.
- Exactly one live hotspot snippet targets the active settlement-scale Glasswake record; the planned locality hotspot remains unreferenced.
- `docs/design/user-design-decisions-2026-06-17.md`, `docs/design/user-design-decisions-2026-06-18.md`, and `docs/design/open-design-questions-index.md` remain future planning context only.
- `docs/dev/project-roadmap.md`, `docs/dev/codex-sequenced-implementation-plan.md`, and `docs/future_content_backlog.md` own direction and deferred work.

## Current Anchor

Latest completed numbered run:

- `Version 0.5.182 - Religious Hotspot Knowledge Snippet Seed`

Immediate next numbered Codex run:

- `Version 0.5.183 - Religious Hotspot Locality Snippet Decision`

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.182 Result

- Added exactly `knowledge_snippet.religion.glasswake_shrine_lantern_gardens.identification` as authored Tier 1 Religion knowledge.
- Added `religious_hotspot` and `world.religious_hotspots` to the live Religion registry record.
- Preserved both existing Religion snippets and kept Religion trial, completion, and visibility policy refs null.
- Kept `religious_hotspot.lantern_shrine_gardens` planned without `dominantFaithIds`.
- Kept the locality hotspot unreferenced by live snippets.
- Added no schema, validator, Knowledge policy, runtime, UI, storage, event, reward, command, sacred-site, religious-order, favorability, alignment, law, pilgrimage, spell, Magic Study, Prestige, family, difficulty, NPC, inventory, map/grid, travel, or gameplay changes.
- Normal content lint remains 57 checked files.

## Deferred Context

Sacred sites should be planned after generic hotspot snippets and before full favorability/alignment mechanics; pilgrimage is the accepted first sacred-site mechanic. Religious orders, favorability/alignment, relationship, law, difficulty implementation, NPC persistence, inventory, map/grid overhaul, travel, runtime, UI, storage, rewards, events, commands, Magic Study, Prestige, family, and gameplay remain deferred and did not broaden 0.5.181.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.182` | Religious Hotspot Knowledge Snippet Seed | Completed |
| 2 | `0.5.183` | Religious Hotspot Locality Snippet Decision | Recommended next; planning only |
| 3 | Later | Sacred Site Authority Plan | Deferred |
