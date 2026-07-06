# Current GPT Handoff

Source version/run: Version 0.5.274 - Highcrown Settlement Site Anchor Evidence Clarification Plan
Date: 2026-07-06
Status: docs-only Highcrown site anchor evidence clarification completed

## Current Site Anchor Evidence Posture

- `settlement_site.highcrown.barge_quays` remains planned with `parentDistrictId: null`.
- `settlement_site.highcrown.palace_terraces` remains planned with `parentDistrictId: null`.
- Current evidence proves both as Highcrown-level sites.
- Current evidence does not place either site inside `settlement_district.highcrown.archive_districts` or `settlement_district.highcrown.market_courts`.
- Semantic proximity between `barge_quays` and `market_courts` is not enough for a district anchor.
- `court_presence` on `palace_terraces` is not placement evidence for Market Courts and does not imply court/law mechanics.

`Version 0.5.274 - Highcrown Settlement Site Anchor Evidence Clarification Plan` added:

- `docs/design/highcrown-settlement-site-anchor-evidence-clarification-plan.md`

## Evidence Standard

Future non-null `parentDistrictId` requires:

- an existing site record;
- a same-settlement active parent district;
- direct authored evidence placing the site inside, within, under, attached to, or administered by the district;
- evidence more specific than broad Highcrown prose;
- evidence more specific than tag overlap or semantic proximity;
- static-only implication control;
- no site activation or Knowledge snippet implication.

Broad settlement prose can support Highcrown-level site identity but not district placement.

## Current District / Site Content Posture

- `settlement_district.highcrown.archive_districts` remains active and unchanged.
- `settlement_district.highcrown.market_courts` remains active with static-only boundary wording.
- `settlement_site.highcrown.barge_quays` remains planned with `parentDistrictId: null`.
- `settlement_site.highcrown.palace_terraces` remains planned with `parentDistrictId: null`.
- No settlement, district, or site content changed in `0.5.274`.

## Current Knowledge Snippet Posture

- Exactly two live `settlement_district` Knowledge snippets exist:
  - `knowledge_snippet.general_lore.highcrown_archive_districts.identification`
  - `knowledge_snippet.general_lore.highcrown_market_courts.identification`
- No live `settlement_site` Knowledge snippets exist.
- No snippets exist for:
  - `settlement_site.highcrown.barge_quays`
  - `settlement_site.highcrown.palace_terraces`
- No Knowledge snippets changed in `0.5.274`.

## Current Knowledge Domain / Registry Posture

- Direct Knowledge subject support exists for `settlement_district` and `settlement_site`.
- Knowledge snippet validation remains resolver-backed and active-only for both subject types.
- `knowledge_domain.general_lore` remains active.
- `knowledge_domain.general_lore.canonicalSubjectTypes` includes `settlement_district`.
- `knowledge_domain.general_lore.relatedContentCollections` includes `world.settlement_districts`.
- `knowledge_domain.general_lore.supportedSnippetCategories` includes `identification`.
- `knowledge_domain.general_lore.supportedDiscoverySourceTypes` includes `book_study`.
- No registry/domain/trial-policy content changed in `0.5.274`.
- Knowledge schemas and validators were unchanged in `0.5.274`.
- If later site snippets are considered, General Lore or another domain must be separately reviewed for `settlement_site` and `world.settlement_sites` support.

## Latest Result

Latest completed:

- `Version 0.5.274 - Highcrown Settlement Site Anchor Evidence Clarification Plan`

Immediate next:

- `Version 0.5.275 - Highcrown Settlement Site Activation Readiness Review`

## Next Route Guardrail

`Version 0.5.275 - Highcrown Settlement Site Activation Readiness Review` should remain docs-first.

It may review whether either planned Highcrown site can safely become active as static site identity while remaining unanchored.

It must not activate sites, change `parentDistrictId`, add site snippets, edit Knowledge schemas or validators, edit Knowledge registry/domain/trial-policy content, add route/travel, building/workplace/economy, court/law, vendor/market, cargo/storage, sacred-site, or religious-hotspot content, or change runtime/UI/storage/commands/events/rewards/migrations/save-account/gameplay behavior unless a later focused implementation prompt explicitly scopes that work.
