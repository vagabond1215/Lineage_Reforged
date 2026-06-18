# Current GPT Handoff

Source route: Codex local implementation pass after `Version 0.5.181 - Religious Hotspot Content Status Activation`, plus connector-side user-decision context through 2026-06-18
Date: 2026-06-18
Branch/status assumption: `master`; latest numbered run is a narrow content-status activation.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest numbered Codex handoff.
- `docs/design/religious-hotspot-knowledge-snippet-seed-plan.md` owns the activation target, first snippet posture, registry alignment timing, discovery-source limits, and 0.5.181/0.5.182 sequence.
- `docs/design/religious-hotspot-knowledge-subject-vocabulary-plan.md` remains authority for direct subject and active-only validation decisions.
- The settlement-scale Glasswake hotspot is `active` with validator-required `dominantFaithIds: ["religion.elemental_pantheon"]`; the locality-scale hotspot remains `planned` without `dominantFaithIds`.
- Live registry and snippet content remain unchanged.
- `docs/design/user-design-decisions-2026-06-17.md`, `docs/design/user-design-decisions-2026-06-18.md`, and `docs/design/open-design-questions-index.md` remain future planning context only.
- `docs/dev/project-roadmap.md`, `docs/dev/codex-sequenced-implementation-plan.md`, and `docs/future_content_backlog.md` own direction and deferred work.

## Current Anchor

Latest completed numbered run:

- `Version 0.5.181 - Religious Hotspot Content Status Activation`

Immediate next numbered Codex run:

- `Version 0.5.182 - Religious Hotspot Knowledge Snippet Seed`

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.181 Result

- Activated only `religious_hotspot.glasswake_shrine_lantern_gardens`.
- Added `dominantFaithIds: ["religion.elemental_pantheon"]` only to the activated record because existing validation requires an active hotspot to identify a dominant faith already present in `religionIds`.
- Kept `religious_hotspot.lantern_shrine_gardens` planned without `dominantFaithIds`.
- Added no live Knowledge snippet and changed no live Religion registry content.
- Kept 0.5.182 as a one-snippet seed plus Religion registry alignment.
- Added no schema, validator, runtime, UI, storage, or gameplay changes.
- Normal content lint remains 57 checked files.

## Deferred Context

Sacred sites should be planned after generic hotspot snippets and before full favorability/alignment mechanics; pilgrimage is the accepted first sacred-site mechanic. Religious orders, favorability/alignment, relationship, law, difficulty implementation, NPC persistence, inventory, map/grid overhaul, travel, runtime, UI, storage, rewards, events, commands, Magic Study, Prestige, family, and gameplay remain deferred and did not broaden 0.5.181.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.181` | Religious Hotspot Content Status Activation | Completed |
| 2 | `0.5.182` | Religious Hotspot Knowledge Snippet Seed | Recommended next |
| 4 | Later | Locality snippet decision or Sacred Site Authority Plan | Deferred |
