# Current GPT Handoff

Source route: Codex local implementation after `Version 0.5.177 - Religious Hotspot Content Authority Seed`, plus connector-side user-decision intake on 2026-06-17
Date: 2026-06-17
Branch/status assumption: `master`; latest numbered run is implemented locally.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest numbered Codex handoff.
- `docs/design/user-design-decisions-2026-06-17.md` and `docs/design/open-design-questions-index.md` remain future planning context; they did not broaden 0.5.177.
- `docs/design/religious-hotspot-content-authority-seed-plan.md` owns the selected seed records.
- `packages/content/base/world/religious_hotspots.json` is now the live descriptive hotspot authority with exactly two `planned` records.
- `packages/schemas/world/religious-hotspot.schema.json` and `tools/content-lint/religious-hotspots.mjs` remain the unchanged structural and semantic validation authorities.
- `docs/dev/project-roadmap.md` owns version order; `docs/dev/codex-sequenced-implementation-plan.md` owns the near-term queue; `docs/future_content_backlog.md` owns deferred work.

## Current Anchor

Latest completed numbered run:

- `Version 0.5.177 - Religious Hotspot Content Authority Seed`

Immediate next numbered Codex run:

- `Version 0.5.178 - Religious Hotspot Knowledge Subject Vocabulary Plan`

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.177 Result

- Added `packages/content/base/world/religious_hotspots.json` with `religious_hotspot.glasswake_shrine_lantern_gardens` and `religious_hotspot.lantern_shrine_gardens`, both `planned`.
- Registered the file and existing validator in normal content lint; normal lint now reports 57 files checked.
- Updated focused coverage from the obsolete unregistered posture to live seed validation.
- Added no direct hotspot Knowledge subject support or live hotspot snippets.
- Added no `world.sacred_sites` content.
- Added no `deityIds`, `dominantFaithIds`, `toleratedFaithIds`, `restrictedFaithIds`, or `religiousOrderIds` to the seed records.
- Changed no favorability, alignment, relationship, law, faction, runtime, UI, storage, persistence, reward, event, command, spell, Magic Study, Prestige, family, or gameplay behavior.

## Near-Term Sequence

| Order | Version | Topic | Status |
| ---: | --- | --- | --- |
| 1 | `0.5.177` | Religious Hotspot Content Authority Seed | Completed |
| 2 | `0.5.178` | Religious Hotspot Knowledge Subject Vocabulary Plan | Recommended next |
| 3 | `0.5.179` | Religious Hotspot Knowledge Subject Schema And Validator | Recommended |
| 4 | `0.5.180` | Religious Hotspot Knowledge Snippet Seed Plan | Recommended |

Religious Favorability And Elemental Alignment remains optional future planning after the hotspot authority lane unless explicitly prioritized.
