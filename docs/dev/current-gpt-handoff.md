# Current GPT Handoff

Source version/run: Version 0.5.261 - Settlement District/Site Knowledge Subject Plan
Date: 2026-06-29
Status: docs-only settlement district/site Knowledge subject decision completed

## Current District/Site Knowledge Subject Posture

- `docs/design/settlement-district-site-knowledge-subject-plan.md` approves future direct Knowledge subject vocabulary for both `settlement_district` and `settlement_site`.
- Selected option: Option D, add both `settlement_district` and `settlement_site`.
- Activation policy: active-only for public Knowledge snippet references.
- Future district snippet subjects should use `subjectType: "settlement_district"` with ids shaped `settlement_district.<settlement_slug>.<district_slug>`.
- Future site snippet subjects should use `subjectType: "settlement_site"` with ids shaped `settlement_site.<settlement_slug>.<site_slug>`.
- Future Knowledge validation must resolve ids against live authority records and reject missing, malformed, or status-ineligible references.
- Site subject validation must accept `parentDistrictId: null` when the site itself exists and passes status policy.
- Non-null site district anchors, if added later, must resolve against live district authority and share the same settlement slug.
- No Knowledge snippets should be seeded while current district/site records remain `planned`, unless a later prompt explicitly approves planned-status preview snippets.
- Knowledge must not infer districts or sites from settlements, prose, routes, maps, buildings, workplaces, sacred sites, hotspots, or runtime state.

## Current Live District/Site Content Posture

- `world.settlements` remains the canonical settlement identity and broad place authority.
- `packages/content/base/world/settlement_districts.json` exists with exactly two planned Highcrown records:
  - `settlement_district.highcrown.archive_districts`
  - `settlement_district.highcrown.market_courts`
- `packages/content/base/world/settlement_sites.json` exists with exactly two planned Highcrown records:
  - `settlement_site.highcrown.barge_quays`
  - `settlement_site.highcrown.palace_terraces`
- Both live site records use `parentDistrictId: null`.
- `tools/content-lint/index.mjs` registers both `settlement_districts.json` and `settlement_sites.json`.
- Normal content lint should still report 63 checked files unless unrelated repo changes occur.

## Latest Result

Latest completed:

- `Version 0.5.261 - Settlement District/Site Knowledge Subject Plan`

Immediate next:

- `Version 0.5.262 - Settlement District/Site Knowledge Subject Schema And Validator`

## Implementation Result

- Added the docs-only decision plan at `docs/design/settlement-district-site-knowledge-subject-plan.md`.
- Updated roadmap, sequence, backlog, GPT handoff, and Codex output docs.
- Made no Knowledge schema, Knowledge registry/domain/trial-policy, Knowledge snippet, settlement/district/site content, validator, test, runtime, UI, storage, command, event, reward, migration, save/account, or gameplay changes.

## Next Route Guardrail

`Version 0.5.262 - Settlement District/Site Knowledge Subject Schema And Validator` should implement only direct subject vocabulary, resolver-backed active-only validation, focused tests, and workflow docs. It should not add snippets or edit settlement, district, site, Knowledge registry, Knowledge domain, trial-policy, runtime, UI, storage, command, event, reward, migration, save/account, or gameplay files unless a newer prompt explicitly changes scope.
