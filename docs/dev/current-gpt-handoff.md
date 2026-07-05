# Current GPT Handoff

Source version/run: Version 0.5.269 - Market Courts Boundary Clarification Plan
Date: 2026-07-05
Status: docs-only market courts boundary clarification completed

## Current Market Courts Boundary Posture

- `settlement_district.highcrown.market_courts` remains `status: "planned"`.
- The boundary clarification selected a safe static-only interpretation for later activation.
- "Market Courts" should mean a named Highcrown civic-commercial district of enclosed commercial yards, market courts, courtyards, and trade-recordkeeping identity.
- It must not imply vendors, stock, prices, services, taxes, trade execution, law/court mechanics, cargo/storage, ownership, NPC staffing, access rules, route topology, quests, rewards, UI, runtime, or gameplay behavior.
- Selected future replacement summary:
  - `Static market-court district within Highcrown where enclosed commercial yards, imperial trade recordkeeping, and river-confluence identity shape the capital's civic-commercial quarters.`
- Selected future replacement note:
  - `Static district identity only; no vendors, stock, prices, services, taxes, trade execution, law/court mechanics, cargo/storage, ownership, NPC staffing, access rules, route topology, quests, rewards, UI, runtime, or gameplay behavior.`

## Current Knowledge Snippet Posture

- Exactly one live `settlement_district` Knowledge snippet exists:
  - `knowledge_snippet.general_lore.highcrown_archive_districts.identification`
- No live `settlement_site` Knowledge snippets exist.
- No snippets exist for:
  - `settlement_district.highcrown.market_courts`
  - `settlement_site.highcrown.barge_quays`
  - `settlement_site.highcrown.palace_terraces`
- `market_courts` remains ineligible for live snippets while planned.
- If later activated, `market_courts` would become eligible only for a separate future Knowledge snippet seed plan. Activation alone must not add snippets.

## Current Knowledge Domain / Registry Posture

- Direct Knowledge subject support exists for `settlement_district` and `settlement_site`.
- Knowledge snippet validation remains resolver-backed and active-only for both subject types.
- `knowledge_domain.general_lore` remains active.
- `knowledge_domain.general_lore.canonicalSubjectTypes` includes `settlement_district`.
- `knowledge_domain.general_lore.relatedContentCollections` includes `world.settlement_districts`.
- General Lore registry/domain/trial-policy content was unchanged by `0.5.269`.

## Current District / Site Content Posture

- `settlement_district.highcrown.archive_districts` remains active and keeps active static summary wording.
- `settlement_district.highcrown.market_courts` remains planned.
- `settlement_site.highcrown.barge_quays` remains planned with `parentDistrictId: null`.
- `settlement_site.highcrown.palace_terraces` remains planned with `parentDistrictId: null`.
- No settlement, district, or site content changed in `0.5.269`.

## Latest Result

Latest completed:

- `Version 0.5.269 - Market Courts Boundary Clarification Plan`

Immediate next:

- `Version 0.5.270 - Settlement District Market Courts Status Activation`

## Next Route Guardrail

`Version 0.5.270 - Settlement District Market Courts Status Activation` may edit only `packages/content/base/world/settlement_districts.json`.

Allowed changes in that file:

- change only `settlement_district.highcrown.market_courts.status` from `planned` to `active`;
- replace only the selected `market_courts` summary wording;
- optionally replace only the `market_courts` notes entry with the selected clarified note.

The next run must preserve `market_courts` id, slug, name, aliases, parent settlement id, district type, functional tags, place-role tags, and source authority notes. It must keep `archive_districts` active and unchanged, keep both site records planned with `parentDistrictId: null`, add no Knowledge snippets, edit no Knowledge registry/domain/trial-policy content, edit no Knowledge schemas or validators, change no tests unless a focused validation expectation truly requires it, and change no runtime/UI/storage/commands/events/rewards/migrations/save-account/route-travel/building-workplace-economy/sacred-site/religious-hotspot/gameplay behavior.
