# Current GPT Handoff

Source version/run: Version 0.5.256 - Settlement Site Schema And Validator
Date: 2026-06-29
Status: settlement site schema, isolated validator, and focused in-memory tests completed; no live content or normal content-lint registration

## Current Settlement Site Posture

- `world.settlements` remains the canonical settlement identity and broad place authority.
- Future settlement districts have a strict schema at `packages/schemas/world/settlement-district.schema.json`, an isolated pure validator at `tools/content-lint/settlement-districts.mjs`, and focused tests at `tests/unit/settlement-district-validation.test.mjs`.
- Future settlement sites now have a strict schema at `packages/schemas/world/settlement-site.schema.json`.
- Future settlement sites now have an isolated pure validator helper at `tools/content-lint/settlement-sites.mjs`.
- Focused in-memory settlement-site validation coverage exists at `tests/unit/settlement-site-validation.test.mjs`.
- `packages/content/base/world/settlement_sites.json` remains absent.
- `packages/content/base/world/settlement_districts.json` remains absent.
- `tools/content-lint/index.mjs` does not register `settlement_sites.json` or `settlement_districts.json`.
- Future site ids use `settlement_site.<settlement_slug>.<site_slug>` with `slug` as the lower-snake-case site slug only.
- Required future site record fields are `id`, `slug`, `name`, `aliases`, `summary`, `parentSettlementId`, `parentDistrictId`, `siteType`, `functionalTags`, `placeRoleTags`, `status`, `sourceAuthorityNotes`, and `notes`.
- Future lifecycle values are `planned`, `active`, and `retired`; empty `records` is valid until live content exists.
- `parentDistrictId` is required but nullable. `parentDistrictId: null` validates without live district content.
- Non-null `parentDistrictId` validates only against supplied in-memory district records in the current helper posture; no district inference or live district content dependency was added.
- The validator resolves parent settlements against supplied current `world.settlements` records and rejects missing or inactive parents when a settlement lifecycle field is present.
- Building/workplace, settlement economy, route/travel, map/visual, Knowledge, sacred-site/religious-hotspot, runtime, UI, storage, command, event, reward, and gameplay owners remain separate.

## Latest Result

Latest completed:

- `Version 0.5.256 - Settlement Site Schema And Validator`

Immediate next:

- `Version 0.5.257 - First Settlement District Content Seed Plan`

## Implementation Result

- Added `packages/schemas/world/settlement-site.schema.json`.
- Added `tools/content-lint/settlement-sites.mjs`.
- Added `tests/unit/settlement-site-validation.test.mjs`.
- Added the new schema to `tests/unit/schema-files.test.mjs`.
- Kept `packages/content/base/world/settlement_sites.json` absent.
- Kept `packages/content/base/world/settlement_districts.json` absent.
- Kept normal content lint unregistered for settlement sites.

## Validation Notes

- `node --test tests\unit\settlement-site-validation.test.mjs` passed.
- `npm.cmd run tool:content-lint` passed with 61 files checked.
- `node --test tests\unit\schema-files.test.mjs` still fails on the unrelated pre-existing Knowledge subject vocabulary assertion around `sacred_site`; the new settlement-site schema parse check passed before that failure.
- Required hygiene checks are recorded in `docs/dev/current-codex-output.md`.

## Next Route Guardrail

`Version 0.5.257 - First Settlement District Content Seed Plan` should remain docs-first unless a newer prompt explicitly scopes implementation. It should plan a tiny first settlement-district content seed from explicit authored evidence only, without creating live district content, site content, normal lint registration, runtime behavior, UI, storage, commands, events, rewards, migrations, or gameplay behavior.
