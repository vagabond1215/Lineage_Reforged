# Current GPT Handoff

Source version/run: Version 0.5.252 - Settlement District And Site Authority Boundary Decision
Date: 2026-06-28
Status: docs-only authority boundary decision completed; no schema, validator, live content, content-lint registration, runtime behavior, UI, storage, commands, events, rewards, migrations, or gameplay behavior changed

## Current Settlement District / Site Authority Posture

- `world.settlements` remains the canonical settlement identity and broad place authority.
- Future settlement districts are approved only as a separate optional authored authority candidate, not embedded in settlement records.
- Future placed settlement sites are approved only as a separate optional authored authority candidate, not inferred from buildings, workplaces, routes, Knowledge, map visuals, settlement prose, or runtime projections.
- Candidate future paths are `packages/content/base/world/settlement_districts.json` and `packages/content/base/world/settlement_sites.json`; neither file exists or is authorized by the completed decision.
- Current runtime-derived `SettlementDistrictState`, `SettlementPlotState`, and `SettlementBuildingState` remain simulation/projection state, not static authored content authority.
- Building/workplace, settlement economy, route/travel, map/visual, Knowledge, sacred-site/religious-hotspot, runtime, UI, storage, command, event, reward, and gameplay owners remain separate.

## Latest Result

Latest completed:

- `Version 0.5.252 - Settlement District And Site Authority Boundary Decision`

Immediate next:

- `Version 0.5.253 - Settlement District Schema Plan`

## Decision Result

- Added `docs/design/settlement-district-site-authority-boundary-decision.md`.
- Defined settlement districts as optional intra-settlement area identities.
- Defined placed settlement sites as optional discrete local facility/POI/landmark identities.
- Selected split future authority posture for districts and sites.
- Rejected inference from settlement summaries, administrative/economic roles, building/workplace compatibility, route adjacency, map pixels, visual labels, Knowledge snippets, quest metadata, sacred-site/hotspot prose, runtime/demo snapshots, generated operators, or generic fantasy naming alone.

## Validation Notes

- This was a docs-only run.
- Required hygiene checks are recorded in `docs/dev/current-codex-output.md`.
- `node --test tests\unit\schema-files.test.mjs` may still fail on the unrelated pre-existing Knowledge subject vocabulary assertion around `sacred_site` if run.

## Next Route Guardrail

`Version 0.5.253 - Settlement District Schema Plan` should remain docs-first. It should decide the exact future `world.settlement_districts` schema posture without creating schemas, validators, content, normal lint registration, runtime behavior, UI, storage, commands, events, rewards, migrations, or gameplay behavior unless a newer prompt explicitly scopes implementation.
