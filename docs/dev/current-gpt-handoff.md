# Current GPT Handoff

Source version/run: Version 0.5.254 - Settlement Site Schema Plan
Date: 2026-06-28
Status: docs-only settlement site schema plan completed; no schema, validator, live content, content-lint registration, runtime behavior, UI, storage, commands, events, rewards, migrations, or gameplay behavior changed

## Current Settlement Site Schema Posture

- `world.settlements` remains the canonical settlement identity and broad place authority.
- Future settlement sites are approved only as a separate optional authored authority candidate named `world.settlement_sites`, not embedded in settlement records.
- Candidate future content path is `packages/content/base/world/settlement_sites.json`.
- Candidate future schema path is `packages/schemas/world/settlement-site.schema.json`.
- Candidate future validator path is `tools/content-lint/settlement-sites.mjs`.
- Candidate future focused test path is `tests/unit/settlement-site-validation.test.mjs`.
- None of those candidate paths exists or is authorized as implementation by the completed plan.
- Future site ids should use `settlement_site.<settlement_slug>.<site_slug>` with `slug` as the lower-snake-case site slug only.
- Required future record fields are `id`, `slug`, `name`, `aliases`, `summary`, `parentSettlementId`, `parentDistrictId`, `siteType`, `functionalTags`, `placeRoleTags`, `status`, `sourceAuthorityNotes`, and `notes`.
- `parentDistrictId` should be required as a nullable field; `null` remains valid when district authority is absent or a site is not district-scoped.
- Future lifecycle values are `planned`, `active`, and `retired`; first seeds should default to `planned`.
- Current runtime-derived `SettlementDistrictState`, `SettlementPlotState`, and `SettlementBuildingState` remain simulation/projection state, not static authored content authority.
- Building/workplace, settlement economy, route/travel, map/visual, Knowledge, sacred-site/religious-hotspot, runtime, UI, storage, command, event, reward, and gameplay owners remain separate.

## Latest Result

Latest completed:

- `Version 0.5.254 - Settlement Site Schema Plan`

Immediate next:

- `Version 0.5.255 - Settlement District Schema And Validator`

## Decision Result

- Added `docs/design/settlement-site-schema-plan.md`.
- Fixed the future records-only wrapper and exact candidate paths for `world.settlement_sites`.
- Fixed required fields, nullable parent-district posture, lifecycle values, site type vocabulary, parent-settlement and optional district anchoring rules, forbidden fields, forbidden inference sources, validator requirements, normal-lint posture, and first seed-readiness rules.
- Confirmed local candidate site and district content/schema/validator/test paths remain absent.

## Validation Notes

- This was a docs-only run.
- Required hygiene checks are recorded in `docs/dev/current-codex-output.md`.
- `node --test tests\unit\schema-files.test.mjs` may still fail on the unrelated pre-existing Knowledge subject vocabulary assertion around `sacred_site` if run.

## Next Route Guardrail

`Version 0.5.255 - Settlement District Schema And Validator` should implement only the already planned future `world.settlement_districts` schema, isolated validator helper, and focused in-memory validation tests without live district content, normal content-lint registration, runtime behavior, UI, storage, commands, events, rewards, migrations, or gameplay behavior unless a newer prompt explicitly scopes broader implementation.
