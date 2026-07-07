# Highcrown Settlement Knowledge Snippet Seed Plan

Source version/run: Version 0.5.281 - Highcrown Settlement Knowledge Snippet Seed Plan
Date: 2026-07-07

## Decision Summary

Option A selected: validator/test prerequisite required before parent settlement snippet implementation.

This docs-only plan selects the exact future parent settlement General Lore identification snippet for `settlement.highcrown`, but does not authorize adding it next. The live authority and General Lore registry posture are ready for planning, while semantic Knowledge snippet validation still needs direct `settlement` subject authority support and focused positive/negative tests before a live `settlement.highcrown` snippet should be implemented.

## Current Versioning Posture

- Latest completed primary before this run: `Version 0.5.280 - Highcrown Settlement Knowledge Snippet Coverage Review`.
- Latest completed support/audit run: `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`.
- Current run: `Version 0.5.281 - Highcrown Settlement Knowledge Snippet Seed Plan`.
- Immediate next primary route selected by this plan: `Version 0.5.282 - Settlement Knowledge Subject Validator Support Plan`.

Three-segment versions remain primary roadmap versions. Four-segment versions remain support-run suffixes and do not consume primary roadmap slots.

## Current Settlement Authority Posture

`settlement.highcrown` exists in live settlement authority content.

- id: `settlement.highcrown`
- name: Highcrown
- type: `city`
- macro region: `region.valtherion`
- region: `region.sapphire_rivers`
- locality band: `region_locality.sapphire_rivers_royal_floodplain`
- summary: `Valtherion's imperial river capital, where crown roads, archive districts, and barge quays govern the richest continent on the map.`
- site context: `Highcrown spans bluffs above the main Sapphire confluence, commanding stone bridges, palace terraces, and the empire's largest market courts.`
- identity tags: `continental_capital`, `river_capital`, `imperial_city`, `archive_center`

The record has enough authored identity evidence for a static settlement identification snippet. It directly establishes Highcrown as Valtherion's imperial river capital and gives parent context for the current district and site snippets.

This run changes no settlement content.

## Current District And Site Authority Posture

Current active Highcrown district records:

- `settlement_district.highcrown.archive_districts`
- `settlement_district.highcrown.market_courts`

Current active Highcrown site records:

- `settlement_site.highcrown.barge_quays`, with `parentDistrictId: null`
- `settlement_site.highcrown.palace_terraces`, with `parentDistrictId: null`

The null site district anchors remain valid. This run changes no district content, site content, or anchors.

## Current Knowledge Snippet Posture

Exactly four Highcrown settlement-related General Lore snippets exist:

- `knowledge_snippet.general_lore.highcrown_archive_districts.identification`
- `knowledge_snippet.general_lore.highcrown_market_courts.identification`
- `knowledge_snippet.general_lore.highcrown_barge_quays.identification`
- `knowledge_snippet.general_lore.highcrown_palace_terraces.identification`

Exactly two Highcrown `settlement_district` snippets exist. Exactly two Highcrown `settlement_site` snippets exist. No `settlement.highcrown` General Lore snippet exists.

This run adds no snippets and edits no existing district or site snippets.

## Current General Lore Domain/Registry Posture

`knowledge_domain.general_lore` currently supports:

- `settlement`
- `settlement_district`
- `settlement_site`
- `world.settlements`
- `world.settlement_districts`
- `world.settlement_sites`
- `identification`
- `book_study`

General Lore policy refs remain `null`. This run changes no Knowledge registry, domain, or trial-policy content.

## Current Settlement Subject Validator Posture

Schema vocabulary includes `settlement`, `settlement_district`, and `settlement_site`. The Knowledge domain registry schema also includes these subject values.

Current semantic Knowledge snippet validation is not ready for a live `settlement` subject snippet:

- `tools/content-lint/index.mjs` loads `packages/content/base/world/settlements.json` for location-scope validation, but does not pass a `settlement` entry in `subjectAuthorities` to `validateKnowledgeSnippets`.
- `tools/content-lint/knowledge-snippets.mjs` requires every snippet `subjectType` to have a matching `subjectAuthorities[record.subjectType]` entry.
- The current direct place subject authorities passed for Highcrown place snippets are `settlement_district`, `settlement_site`, and `region`, not `settlement`.
- Focused Knowledge snippet tests include positive and negative direct-subject coverage for `settlement_district` and `settlement_site`, but not direct positive/negative `settlement` subject cases.
- Current settlement records do not use a `status` lifecycle field, so a future validator-support plan should decide an approved live-settlement reference posture rather than copying the active-only district/site rule blindly.

Therefore, direct resolver-backed `settlement` subject support must be planned and implemented before a live parent settlement snippet is added.

## Seed Plan Readiness Standard

A future parent settlement General Lore snippet may be implemented only if all of the following are true:

- `settlement.highcrown` exists in live settlement authority content.
- `settlement.highcrown` has enough authored identity evidence for static settlement identification.
- The selected subject type is exactly `settlement`.
- The selected subject id is exactly `settlement.highcrown`.
- General Lore supports `settlement`.
- General Lore advertises `world.settlements`.
- General Lore supports `identification`.
- General Lore supports `book_study`.
- The Knowledge snippet schema includes `settlement`.
- The Knowledge domain registry schema includes `settlement`.
- Semantic Knowledge snippet validation can resolve direct `settlement` subjects against live settlement authority records.
- Semantic validation uses an approved live-settlement reference posture, since current settlement records do not carry district/site-style `status` values.
- The snippet wording remains static authored settlement identity only.
- The snippet wording does not imply access, services, vendors, prices, trade execution, travel routes, dock operation, cargo inventory, storage, palace access, court/law mechanics, ownership, NPC staffing, access rules, UI, runtime, rewards, unlocks, discovery state, Knowledge progress state, or gameplay behavior.
- Existing district and site snippets remain unchanged.

## Parent Settlement Snippet Candidate Review

The candidate should use `settlement` because the subject is the parent settlement identity for Highcrown. It should not use `settlement_district` because it is not describing Archive Districts or Market Courts as district subjects. It should not use `settlement_site` because it is not describing Barge Quays or Palace Terraces as placed site subjects.

The candidate does not duplicate the existing district/site snippets. The district snippets identify two specific active districts. The site snippets identify two specific active sites. The parent snippet would identify Highcrown itself and provide the settlement-level context that explains why those district and site snippets belong to the same capital.

General Lore is the correct domain because this is broad civic, historical, and place-identity knowledge rather than Flora, Fauna, Minerals, Arcane Lore, Religion, or another more specific domain. General Lore already advertises the selected subject type, collection, category, and discovery source type.

The only blocker is semantic validator/test readiness for direct settlement subjects.

## Exact Future Parent Settlement Snippet Shape

Selected future snippet shape, not implemented in this run:

```json
{
  "id": "knowledge_snippet.general_lore.highcrown.identification",
  "domainId": "knowledge_domain.general_lore",
  "subjectType": "settlement",
  "subjectId": "settlement.highcrown",
  "tier": 1,
  "category": "identification",
  "title": "Recognizing Highcrown",
  "summary": "Highcrown is Valtherion's imperial river capital, where crown roads, archive districts, barge quays, palace terraces, and market courts define the capital's administrative, river-trade, and civic identity.",
  "discoverySources": [
    {
      "sourceType": "book_study",
      "sourceId": null
    }
  ],
  "progression": {
    "completionWeight": 1,
    "countsTowardTierCompletion": true,
    "trialUnlockWeight": 0
  },
  "visibility": {
    "lockedUntilDiscovered": true,
    "revealsSubjectIdentity": true,
    "hiddenSummary": "An unidentified imperial river capital remains to be understood."
  },
  "notes": [
    "This snippet is authored settlement identity knowledge only and grants no settlement access, services, vendors, prices, trade execution, travel routes, dock operation, cargo inventory, storage, palace access, court/law mechanics, ownership, NPC staffing, access rules, UI, runtime, rewards, or gameplay behavior."
  ]
}
```

The selected wording is narrow enough because it uses direct authored settlement evidence and keeps all system implications out of the summary and note.

## Validator/Test Prerequisite Decision

Option A selected.

A later implementation should not add `knowledge_snippet.general_lore.highcrown.identification` until a validator-support plan has decided the exact direct `settlement` subject authority wiring and focused tests.

The next route should plan:

- adding `settlement` to Knowledge snippet semantic `subjectAuthorities`;
- using `world.settlements` as the direct collection id;
- using `settlement.` as the id prefix;
- deciding whether an id pattern is needed for `settlement.<slug>`;
- deciding the approved live-settlement eligibility posture for records with no `status` field;
- adding focused positive and negative tests for direct `settlement` snippets;
- preserving existing district/site active-only semantics.

## Future Implementation Sequencing

Next primary route:

`Version 0.5.282 - Settlement Knowledge Subject Validator Support Plan`

Expected later sequence after that plan, if it confirms the same posture:

1. Docs-first validator support plan.
2. Focused validator/test implementation for direct `settlement` Knowledge subjects.
3. Future `Highcrown Settlement Knowledge Snippet Seed` implementation that adds exactly `knowledge_snippet.general_lore.highcrown.identification`, if validation support lands cleanly.

No validator support or snippet implementation happens in this run.

## Static-Only Wording Boundaries

Safe wording may identify:

- Highcrown as Valtherion's imperial river capital;
- Highcrown as a parent settlement identity;
- crown roads, archive districts, barge quays, palace terraces, and market courts as authored place context;
- administrative, river-trade, civic, imperial, and capital identity as static authored place context.

Safe wording must not imply settlement access, services, vendors, prices, trade execution, travel routes, route topology, dock operation, cargo inventory, storage, palace access, court/law mechanics, court services, ownership, NPC staffing, access rules, quests, rewards, UI, runtime behavior, unlocks, discovery state, Knowledge progress state, or gameplay behavior.

## Rejected Alternatives

- Adding the parent settlement snippet now: rejected because direct settlement subject semantic validation needs a separate plan and implementation.
- Adding validator support now: rejected because this run is docs-only.
- Editing Knowledge registry/domain/trial-policy content now: rejected because current General Lore alignment is sufficient.
- Editing schemas now: rejected because schema vocabulary already includes `settlement`.
- Editing existing district or site snippets: rejected because they remain correct and should not be merged into a parent snippet.
- Changing settlement, district, or site content: rejected as out of scope.
- Changing site anchors: rejected because current null anchors remain valid.
- Using a district or site subject for parent Highcrown identity: rejected because `settlement` is the narrowest truthful subject.
- Using the parent settlement snippet to imply services, travel, markets, palace access, court/law, cargo/storage, UI, runtime, rewards, unlocks, discovery state, Knowledge progress state, or gameplay: rejected.

## Explicit Non-Goals

This plan does not add snippets, edit Knowledge registry/domain/trial-policy content, edit Knowledge schemas or validators, edit settlement/district/site content, change site anchors, edit tests, or change runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, route/travel systems, building/workplace/economy systems, court/law systems, vendor/market systems, cargo/storage systems, sacred-site/religious-hotspot content, or gameplay behavior.

## Validation And Audit Posture

Read-only audits confirmed:

- `settlement.highcrown` exists and remains unchanged by this run.
- Highcrown has enough static identity evidence for the selected future parent settlement snippet.
- Both Highcrown district records remain active and unchanged by this run.
- Both Highcrown site records remain active with `parentDistrictId: null` and unchanged by this run.
- Exactly four Highcrown settlement-related General Lore snippets exist.
- Exactly two Highcrown `settlement_district` snippets exist.
- Exactly two Highcrown `settlement_site` snippets exist.
- No `settlement.highcrown` General Lore snippet exists.
- General Lore supports `settlement`, `settlement_district`, `settlement_site`, `world.settlements`, `world.settlement_districts`, `world.settlement_sites`, `identification`, and `book_study`.
- General Lore policy refs remain `null`.
- Schema vocabulary includes `settlement`, `settlement_district`, and `settlement_site`.
- Current semantic validation does not yet wire direct `settlement` subject authority for snippets.
- Focused Knowledge snippet tests do not yet include direct settlement subject positive/negative cases.

## Next Recommended Version

Version 0.5.282 - Settlement Knowledge Subject Validator Support Plan
