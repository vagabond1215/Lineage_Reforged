# Current GPT Handoff

Source version/run: Version 0.5.253 - Settlement District Schema Plan
Date: 2026-06-28
Status: docs-only settlement district schema plan completed; no schema, validator, live content, content-lint registration, runtime behavior, UI, storage, commands, events, rewards, migrations, or gameplay behavior changed

## Current Settlement District Schema Posture

- `world.settlements` remains the canonical settlement identity and broad place authority.
- Future settlement districts are approved only as a separate optional authored authority candidate named `world.settlement_districts`, not embedded in settlement records.
- Candidate future content path is `packages/content/base/world/settlement_districts.json`.
- Candidate future schema path is `packages/schemas/world/settlement-district.schema.json`.
- Candidate future validator path is `tools/content-lint/settlement-districts.mjs`.
- Candidate future focused test path is `tests/unit/settlement-district-validation.test.mjs`.
- None of those candidate paths exists or is authorized as implementation by the completed plan.
- Future district ids should use `settlement_district.<settlement_slug>.<district_slug>` with `slug` as the lower-snake-case district slug only.
- Required future record fields are `id`, `slug`, `name`, `aliases`, `summary`, `parentSettlementId`, `districtType`, `functionalTags`, `placeRoleTags`, `status`, `sourceAuthorityNotes`, and `notes`.
- Future lifecycle values are `planned`, `active`, and `retired`; first seeds should default to `planned`.
- Current runtime-derived `SettlementDistrictState`, `SettlementPlotState`, and `SettlementBuildingState` remain simulation/projection state, not static authored content authority.
- Building/workplace, settlement economy, route/travel, map/visual, Knowledge, sacred-site/religious-hotspot, runtime, UI, storage, command, event, reward, and gameplay owners remain separate.

## Latest Result

Latest completed:

- `Version 0.5.253 - Settlement District Schema Plan`

Immediate next:

- `Version 0.5.254 - Settlement Site Schema Plan`

## Decision Result

- Added `docs/design/settlement-district-schema-plan.md`.
- Fixed the future records-only wrapper and exact candidate paths for `world.settlement_districts`.
- Fixed required fields, lifecycle values, district type vocabulary, parent-settlement anchoring rules, forbidden fields, forbidden inference sources, validator requirements, normal-lint posture, and first seed-readiness rules.
- Confirmed local candidate district content/schema/validator/test paths remain absent.

## Validation Notes

- This was a docs-only run.
- Required hygiene checks are recorded in `docs/dev/current-codex-output.md`.
- `node --test tests\unit\schema-files.test.mjs` may still fail on the unrelated pre-existing Knowledge subject vocabulary assertion around `sacred_site` if run.

## Next Route Guardrail

`Version 0.5.254 - Settlement Site Schema Plan` should remain docs-first. It should decide the exact future `world.settlement_sites` schema posture without creating schemas, validators, content, normal lint registration, runtime behavior, UI, storage, commands, events, rewards, migrations, or gameplay behavior unless a newer prompt explicitly scopes implementation.
