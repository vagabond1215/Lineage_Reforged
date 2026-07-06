# Current GPT Handoff

Source version/run: Version 0.5.278 - Highcrown Settlement Site Knowledge Snippet Seed Plan
Date: 2026-07-06

## Status

`Version 0.5.278 - Highcrown Settlement Site Knowledge Snippet Seed Plan` completed as a documentation-only primary run.

Latest completed primary:

- `Version 0.5.278 - Highcrown Settlement Site Knowledge Snippet Seed Plan`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.279 - Highcrown Settlement Site Knowledge Snippet Seed`

## Versioning Posture

Three-segment labels such as `0.5.279` are primary roadmap versions. Four-segment labels such as `0.5.276.1` are support-run suffixes and do not consume planned primary roadmap slots.

`0.5.278` completed as the next primary after `0.5.277`.

## Selected General Lore Alignment

The next implementation may update only `knowledge_domain.general_lore` in `packages/content/base/player/knowledge_domain_registry.json`:

- add `settlement_site` to `canonicalSubjectTypes`
- add `world.settlement_sites` to `relatedContentCollections`

Preserve all existing General Lore fields, categories, source types, policy refs, status, title, summary, and notes. Do not add categories, source types, trial policies, readiness policies, schemas, validators, or domain-definition changes.

## Selected Future Snippets

Future Barge Quays snippet:

- id: `knowledge_snippet.general_lore.highcrown_barge_quays.identification`
- domainId: `knowledge_domain.general_lore`
- subjectType: `settlement_site`
- subjectId: `settlement_site.highcrown.barge_quays`
- tier: `1`
- category: `identification`
- title: `Recognizing Highcrown's Barge Quays`
- summary: `Highcrown's Barge Quays are a river-wharf site where the imperial capital's inland river trade identity is marked by its named barge landing grounds.`
- discovery source type: `book_study`
- discovery source id: `null`
- progression: `completionWeight: 1`, `countsTowardTierCompletion: true`, `trialUnlockWeight: 0`
- visibility: `lockedUntilDiscovered: true`, `revealsSubjectIdentity: true`
- hidden summary: `An unidentified Highcrown river-wharf site remains to be understood.`
- note: `This snippet is authored place knowledge only and grants no dock operation, cargo inventory, storage, travel service, route topology, trade execution, vendors, prices, services, ownership, NPC staffing, access rules, UI, runtime, rewards, or gameplay behavior.`

Future Palace Terraces snippet:

- id: `knowledge_snippet.general_lore.highcrown_palace_terraces.identification`
- domainId: `knowledge_domain.general_lore`
- subjectType: `settlement_site`
- subjectId: `settlement_site.highcrown.palace_terraces`
- tier: `1`
- category: `identification`
- title: `Recognizing Highcrown's Palace Terraces`
- summary: `Highcrown's Palace Terraces are a palace landmark site where terraced palace grounds mark the imperial capital's bluff identity.`
- discovery source type: `book_study`
- discovery source id: `null`
- progression: `completionWeight: 1`, `countsTowardTierCompletion: true`, `trialUnlockWeight: 0`
- visibility: `lockedUntilDiscovered: true`, `revealsSubjectIdentity: true`
- hidden summary: `An unidentified Highcrown palace landmark remains to be understood.`
- note: `This snippet is authored place knowledge only and grants no palace access, court/law mechanics, court services, ownership, NPC staffing, access rules, quests, rewards, UI, runtime, or gameplay behavior.`

## Current Site Authority Posture

`settlement_site.highcrown.barge_quays` is active with `parentSettlementId: settlement.highcrown`, `parentDistrictId: null`, and `siteType: wharf`.

`settlement_site.highcrown.palace_terraces` is active with `parentSettlementId: settlement.highcrown`, `parentDistrictId: null`, and `siteType: palace`.

Both site records remain Highcrown-level site identity. Current evidence does not place either site inside `settlement_district.highcrown.archive_districts` or `settlement_district.highcrown.market_courts`.

## Current Knowledge Posture

Exactly two live `settlement_district` General Lore snippets exist:

- `knowledge_snippet.general_lore.highcrown_archive_districts.identification`
- `knowledge_snippet.general_lore.highcrown_market_courts.identification`

No live `settlement_site` snippets exist.

No snippets exist for:

- `settlement_site.highcrown.barge_quays`
- `settlement_site.highcrown.palace_terraces`

Direct `settlement_district` and `settlement_site` Knowledge subject validation exists and remains active-only.

## Next Route Guardrail

`Version 0.5.279 - Highcrown Settlement Site Knowledge Snippet Seed` may update General Lore registry alignment for `settlement_site` and `world.settlement_sites`, add exactly the two selected site snippets, and update focused tests/workflow docs as required.

It must not add other snippets, edit settlement/district/site content, change anchors, edit schemas or validators, edit trial policies, or touch runtime/UI/storage/commands/events/rewards/migrations/save-account/route-travel/building-workplace-economy/court-law/vendor-market/cargo-storage/sacred-site/religious-hotspot/gameplay behavior.

Suggested next commit:

`docs(knowledge): plan highcrown site snippets`
