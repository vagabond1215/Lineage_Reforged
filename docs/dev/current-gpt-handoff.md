# Current GPT Handoff

Source version/run: Version 0.5.266 - Archive District Wording Cleanup
Date: 2026-07-04
Status: active archive district wording cleanup completed

## Current District / Site Content Posture

- `settlement_district.highcrown.archive_districts` remains the only active settlement district.
- Its summary now uses active static wording: "Civic record districts within Highcrown where imperial archives and recordkeeping institutions shape the capital's administrative identity."
- `settlement_district.highcrown.market_courts` remains planned.
- `settlement_site.highcrown.barge_quays` remains planned with `parentDistrictId: null`.
- `settlement_site.highcrown.palace_terraces` remains planned with `parentDistrictId: null`.
- No settlement site content changed.
- No live `settlement_district` or `settlement_site` Knowledge snippets exist.

## Current Knowledge Snippet Planning Posture

- `docs/design/settlement-district-knowledge-snippet-seed-plan.md` selects exactly one future public Knowledge snippet candidate:
  - `id: knowledge_snippet.general_lore.highcrown_archive_districts.identification`
  - `domainId: knowledge_domain.general_lore`
  - `subjectType: settlement_district`
  - `subjectId: settlement_district.highcrown.archive_districts`
  - `category: identification`
  - discovery source type: `book_study`
- The snippet is not implemented yet.
- No snippets should be added for `settlement_district.highcrown.market_courts`, `settlement_site.highcrown.barge_quays`, `settlement_site.highcrown.palace_terraces`, parent settlements, routes, buildings, workplaces, economy, sacred sites, or religious hotspots in the next run.
- Safe snippet wording must remain static authored place knowledge only and must not imply archive access, record browsing, Knowledge unlocks, storage, services, NPC staffing, law/court behavior, quest hooks, UI markers, rewards, runtime state, or gameplay behavior.

## Current Knowledge Domain / Registry Alignment Posture

- Direct Knowledge subject support exists for `settlement_district` and `settlement_site`.
- Knowledge snippet validation remains resolver-backed and active-only for both subject types.
- `knowledge_domain.general_lore` is active and supports `identification` plus `book_study`.
- `knowledge_domain.general_lore` does not currently advertise `settlement_district` in `canonicalSubjectTypes`.
- `knowledge_domain.general_lore` does not currently include `world.settlement_districts` in `relatedContentCollections`.
- The next snippet seed may align only those required General Lore registry fields before or while adding the selected snippet.
- Do not edit Knowledge schemas, validators, trial policies, broad domain structure, or `knowledge_domains.json` for this lane unless a newer prompt explicitly changes scope.

## Latest Result

Latest completed:

- `Version 0.5.266 - Archive District Wording Cleanup`

Immediate next:

- `Version 0.5.267 - Archive District Knowledge Snippet Seed`

## Next Route Guardrail

`Version 0.5.267 - Archive District Knowledge Snippet Seed` may:

- align only `knowledge_domain.general_lore.canonicalSubjectTypes` with `settlement_district`;
- align only `knowledge_domain.general_lore.relatedContentCollections` with `world.settlement_districts`;
- add exactly one Knowledge snippet, `knowledge_snippet.general_lore.highcrown_archive_districts.identification`;
- keep `market_courts`, `barge_quays`, and `palace_terraces` planned;
- add no other snippets;
- activate no additional records;
- edit no Knowledge schemas or validators;
- change no runtime/UI/storage/commands/events/rewards/migrations/save-account/route-travel/building-workplace-economy/sacred-site/religious-hotspot/gameplay behavior.
