# Current GPT Handoff

Source version/run: Version 0.5.255 - Settlement District Schema And Validator
Date: 2026-06-28
Status: settlement district schema, isolated validator, and focused in-memory tests completed; no live content or normal content-lint registration

## Current Settlement District Posture

- `world.settlements` remains the canonical settlement identity and broad place authority.
- Future settlement districts now have a strict schema at `packages/schemas/world/settlement-district.schema.json`.
- Future settlement districts now have an isolated pure validator helper at `tools/content-lint/settlement-districts.mjs`.
- Focused in-memory validation coverage exists at `tests/unit/settlement-district-validation.test.mjs`.
- `packages/content/base/world/settlement_districts.json` remains absent.
- `tools/content-lint/index.mjs` does not register `settlement_districts.json`.
- Future district ids use `settlement_district.<settlement_slug>.<district_slug>` with `slug` as the lower-snake-case district slug only.
- Required future record fields are `id`, `slug`, `name`, `aliases`, `summary`, `parentSettlementId`, `districtType`, `functionalTags`, `placeRoleTags`, `status`, `sourceAuthorityNotes`, and `notes`.
- Future lifecycle values are `planned`, `active`, and `retired`; empty `records` is valid until live content exists.
- The validator resolves parent settlements against supplied current `world.settlements` records and rejects missing or inactive parents when a settlement lifecycle field is present.
- Current runtime-derived `SettlementDistrictState`, `SettlementPlotState`, and `SettlementBuildingState` remain simulation/projection state, not static authored content authority.
- Building/workplace, settlement economy, route/travel, map/visual, Knowledge, sacred-site/religious-hotspot, runtime, UI, storage, command, event, reward, and gameplay owners remain separate.

## Latest Result

Latest completed:

- `Version 0.5.255 - Settlement District Schema And Validator`

Immediate next:

- `Version 0.5.256 - Settlement Site Schema And Validator`

## Implementation Result

- Added `packages/schemas/world/settlement-district.schema.json`.
- Added `tools/content-lint/settlement-districts.mjs`.
- Added `tests/unit/settlement-district-validation.test.mjs`.
- Added the new schema to `tests/unit/schema-files.test.mjs`.
- Kept `packages/content/base/world/settlement_districts.json` absent.
- Kept normal content lint unregistered for settlement districts.

## Validation Notes

- `node --test tests\unit\settlement-district-validation.test.mjs` passed.
- `npm.cmd run tool:content-lint` passed with 61 files checked.
- `node --test tests\unit\schema-files.test.mjs` still fails on the unrelated pre-existing Knowledge `sacred_site` assertion; the new settlement-district schema parse check passed before that failure.
- Required hygiene checks are recorded in `docs/dev/current-codex-output.md`.

## Next Route Guardrail

`Version 0.5.256 - Settlement Site Schema And Validator` should implement only the already planned future `world.settlement_sites` schema, isolated validator helper, and focused in-memory validation tests without live site content, normal content-lint registration, runtime behavior, UI, storage, commands, events, rewards, migrations, or gameplay behavior unless a newer prompt explicitly scopes broader implementation.
