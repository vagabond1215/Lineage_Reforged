# Current GPT Handoff

Source version/run: Version 0.5.262 - Settlement District/Site Knowledge Subject Schema And Validator
Date: 2026-06-30
Status: direct settlement district/site Knowledge subject schema and validator support completed

## Current Knowledge Subject Posture

- `packages/schemas/player/knowledge_snippet.schema.json` now supports direct `subjectType` values:
  - `settlement_district`
  - `settlement_site`
- `packages/schemas/player/knowledge-domain-registry.schema.json` mirrors those values in `canonicalSubjectTypes` because the registry schema owns the same vocabulary surface.
- `tools/content-lint/knowledge-snippets.mjs` validates both subjects through explicit resolver-backed authority records.
- `tools/content-lint/index.mjs` supplies live `world.settlement_districts` and `world.settlement_sites` records to the Knowledge snippet validator.
- Public Knowledge snippet eligibility remains active-only for district and site subjects.
- Planned and retired district/site records are rejected as live snippet subjects.
- `settlement_site` snippets accept `parentDistrictId: null` when the site record itself is active.
- Non-null site `parentDistrictId` values must resolve against supplied district authority, reference an active district, and share the same settlement slug.
- The stale `schema-files.test.mjs` `sacred_site` assertion was aligned as part of this schema vocabulary pass.
- No Knowledge snippets were added.
- No live Knowledge registry/domain/trial-policy content was changed.

## Current District/Site Content Posture

- `world.settlements` remains the canonical settlement identity and broad place authority.
- `packages/content/base/world/settlement_districts.json` exists with exactly two Highcrown records:
  - `settlement_district.highcrown.archive_districts`
  - `settlement_district.highcrown.market_courts`
- Both district records remain `status: "planned"`.
- `packages/content/base/world/settlement_sites.json` exists with exactly two Highcrown records:
  - `settlement_site.highcrown.barge_quays`
  - `settlement_site.highcrown.palace_terraces`
- Both site records remain `status: "planned"` and `parentDistrictId: null`.
- `tools/content-lint/index.mjs` still registers both `settlement_districts.json` and `settlement_sites.json`.
- Normal content lint reports `content-lint: ok (63 files checked)`.

## Latest Result

Latest completed:

- `Version 0.5.262 - Settlement District/Site Knowledge Subject Schema And Validator`

Immediate next:

- `Version 0.5.263 - Settlement District/Site Status Activation Plan`

## Implementation Result

- Added direct district/site subject vocabulary to the Knowledge snippet schema and mirrored registry schema.
- Added active-only resolver-backed Knowledge snippet validation for district and site subject ids.
- Added focused in-memory tests for active fixture acceptance, malformed ids, unresolved ids, planned/retired rejection, null site district anchors, non-null active district anchors, missing/mismatched district anchors, parent-settlement slug mismatch, no parent-settlement inference, schema vocabulary acceptance, and no live snippet seeding.
- Kept settlement, district, site, Knowledge snippet, Knowledge registry content, Knowledge domain, Knowledge trial-policy, runtime, UI, storage, command, event, reward, migration, save/account, route/travel, sacred-site/religious-hotspot, building/workplace/economy content, and gameplay files unchanged.

## Next Route Guardrail

`Version 0.5.263 - Settlement District/Site Status Activation Plan` should be a narrow planning pass that decides whether any current planned district/site authority records are ready to become active for future Knowledge snippet seeding. It should not add snippets, change runtime behavior, or broaden into services, route/travel, UI, storage, command/event/reward, migration, save/account, building/workplace/economy, or gameplay work unless a newer prompt explicitly changes scope.
