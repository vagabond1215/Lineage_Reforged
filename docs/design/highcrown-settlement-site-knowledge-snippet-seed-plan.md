# Highcrown Settlement Site Knowledge Snippet Seed Plan

Source version/run: Version 0.5.278 - Highcrown Settlement Site Knowledge Snippet Seed Plan
Date: 2026-07-06
Status: documentation-only seed plan; no snippets or registry changes

## 1. Decision summary

Select exactly two future Tier 1 General Lore `settlement_site` identification snippets for later implementation:

- `knowledge_snippet.general_lore.highcrown_barge_quays.identification`
- `knowledge_snippet.general_lore.highcrown_palace_terraces.identification`

Select exact future General Lore alignment for the same later implementation:

- add `settlement_site` to `knowledge_domain.general_lore.canonicalSubjectTypes`
- add `world.settlement_sites` to `knowledge_domain.general_lore.relatedContentCollections`

Do not add snippets or edit registry/domain/trial-policy content in this plan. Preserve existing General Lore title, summary, status, notes, categories, discovery source types, and policy refs.

## 2. Current versioning posture

Latest completed primary before this plan:

- `Version 0.5.277 - Highcrown Settlement Site Knowledge Snippet Readiness Review`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

This plan is the next primary roadmap version:

- `Version 0.5.278 - Highcrown Settlement Site Knowledge Snippet Seed Plan`

The completed support suffix `0.5.276.1` does not consume or renumber primary roadmap slots.

## 3. Current site authority posture

Current settlement site authority exists at `packages/content/base/world/settlement_sites.json`.

`settlement_site.highcrown.barge_quays` is active.

- parent settlement id: `settlement.highcrown`
- parent district id: `null`
- site type: `wharf`
- summary: `Static river-wharf site within Highcrown where the capital's barge quays mark its inland river trade identity.`
- behavior boundary: static site identity only; no dock operation, cargo inventory, storage, travel service, route topology, trade execution, vendors, prices, services, ownership, NPC staffing, access rules, UI, runtime, rewards, or gameplay behavior.

`settlement_site.highcrown.palace_terraces` is active.

- parent settlement id: `settlement.highcrown`
- parent district id: `null`
- site type: `palace`
- summary: `Static palace landmark site within Highcrown where terraced palace grounds mark the capital's imperial bluff identity.`
- behavior boundary: static site identity only; no palace access, court/law mechanics, court services, ownership, NPC staffing, access rules, quests, rewards, UI, runtime, or gameplay behavior.

Both site records remain valid with `parentDistrictId: null`.

## 4. Current Knowledge snippet posture

Exactly two live `settlement_district` General Lore snippets exist:

- `knowledge_snippet.general_lore.highcrown_archive_districts.identification`
- `knowledge_snippet.general_lore.highcrown_market_courts.identification`

No live `settlement_site` snippets exist.

No snippets exist for:

- `settlement_site.highcrown.barge_quays`
- `settlement_site.highcrown.palace_terraces`

This plan does not edit `packages/content/base/player/knowledge_snippets.json`.

## 5. Current Knowledge domain and registry posture

Direct Knowledge subject support already exists for:

- `settlement_district`
- `settlement_site`

The Knowledge snippet schema and Knowledge domain registry schema both include these subject values. Knowledge snippet validation resolves both subject types against live authority records and enforces active-only public references.

`knowledge_domain.general_lore` currently supports:

- `settlement_district` in `canonicalSubjectTypes`
- `world.settlement_districts` in `relatedContentCollections`
- `identification` in `supportedSnippetCategories`
- `book_study` in `supportedDiscoverySourceTypes`

General Lore does not currently advertise:

- `settlement_site`
- `world.settlement_sites`

Therefore the future implementation must align only those two General Lore registry fields before adding the selected site snippets.

## 6. Seed plan scope

The future seed implementation should include only:

- one narrow General Lore registry alignment for `settlement_site`
- one narrow General Lore registry alignment for `world.settlement_sites`
- one Barge Quays identification snippet
- one Palace Terraces identification snippet
- focused validation for Knowledge snippets, Knowledge domain registry, settlement sites, schemas, and normal content lint

This plan itself is documentation-only.

## 7. General Lore alignment plan

In `packages/content/base/player/knowledge_domain_registry.json`, update only the `knowledge_domain.general_lore` record:

- add `settlement_site` to `canonicalSubjectTypes`
- add `world.settlement_sites` to `relatedContentCollections`

Preserve all existing General Lore fields and values, including:

- `id`
- `status`
- `title`
- `summary`
- all existing `canonicalSubjectTypes`
- all existing `relatedContentCollections`
- all existing `supportedSnippetCategories`
- all existing `supportedDiscoverySourceTypes`
- all existing policy refs
- notes

Do not add a new category. Do not add a new discovery source type. Do not edit trial policies, readiness policies, schemas, validators, or domain definitions.

## 8. Future snippet record: `barge_quays`

Future record:

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
- completionWeight: `1`
- countsTowardTierCompletion: `true`
- trialUnlockWeight: `0`
- lockedUntilDiscovered: `true`
- revealsSubjectIdentity: `true`
- hidden summary: `An unidentified Highcrown river-wharf site remains to be understood.`
- note: `This snippet is authored place knowledge only and grants no dock operation, cargo inventory, storage, travel service, route topology, trade execution, vendors, prices, services, ownership, NPC staffing, access rules, UI, runtime, rewards, or gameplay behavior.`

The wording identifies the site only. It must not imply dock operation, cargo inventory, storage, travel service, route topology, trade execution, vendors, prices, services, ownership, NPC staffing, access rules, UI, runtime, rewards, or gameplay behavior.

## 9. Future snippet record: `palace_terraces`

Future record:

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
- completionWeight: `1`
- countsTowardTierCompletion: `true`
- trialUnlockWeight: `0`
- lockedUntilDiscovered: `true`
- revealsSubjectIdentity: `true`
- hidden summary: `An unidentified Highcrown palace landmark remains to be understood.`
- note: `This snippet is authored place knowledge only and grants no palace access, court/law mechanics, court services, ownership, NPC staffing, access rules, quests, rewards, UI, runtime, or gameplay behavior.`

The wording identifies the site only. It must not imply palace access, court/law mechanics, court services, ownership, NPC staffing, access rules, quests, rewards, UI, runtime, or gameplay behavior.

## 10. Static-only wording boundaries

Safe wording may identify:

- Barge Quays as a Highcrown river-wharf site
- Palace Terraces as a Highcrown palace landmark site
- each site as static authored place knowledge
- each site as Highcrown-level identity rather than district-anchored identity

Safe wording must not imply:

- district placement
- dock operation
- cargo inventory
- storage
- travel service
- route topology
- trade execution
- vendors
- prices
- services
- palace access
- court/law mechanics
- court services
- ownership
- NPC staffing
- access rules
- quests
- rewards
- UI
- runtime behavior
- unlocks
- gameplay behavior

## 11. Future implementation requirements

A future implementation should:

- re-audit that both selected site records still exist and remain active
- re-audit that both selected site records still have `parentDistrictId: null`
- update only the selected General Lore registry arrays
- add exactly the two selected snippet records
- preserve the existing district snippets
- preserve all existing General Lore categories and discovery source types
- preserve all Knowledge trial policy refs unless a separate prompt explicitly scopes trial-policy work
- run normal content lint and focused Knowledge/site/schema tests
- update workflow docs and the backlog for the completed implementation

## 12. Rejected alternatives

- Adding snippets in this plan: rejected because this run is documentation-only.
- Editing General Lore in this plan: rejected because the registry change belongs to the later seed implementation.
- Adding a new General Lore category: rejected because `identification` already exists.
- Adding a new discovery source type: rejected because `book_study` already exists.
- Editing trial policies or readiness policies: rejected because the selected snippets use the existing null-policy General Lore posture.
- Changing Knowledge schemas or validators: rejected because direct `settlement_site` support already exists.
- Changing site content or district anchors: rejected because current authority already supports active Highcrown-level site identity and does not prove district placement.
- Adding dock, cargo, storage, travel, route, vendor, market, palace access, court/law, UI, runtime, reward, or gameplay behavior: rejected as out of scope.

## 13. Explicit non-goals

This plan does not:

- add snippets
- edit Knowledge registry/domain/trial-policy content
- edit Knowledge schemas or validators
- edit settlement, district, or site content
- change site district anchors
- change tests
- add route or travel behavior
- add dock or cargo behavior
- add storage behavior
- add palace access behavior
- add court/law behavior
- add vendor, market, service, price, or trade behavior
- add building, workplace, or economy behavior
- add sacred-site or religious-hotspot behavior
- change runtime, UI, storage, commands, events, rewards, migrations, save/account state, or gameplay behavior

## 14. Validation and audit posture

Validation for this docs-only plan should prove:

- changed paths are docs-only
- no content JSON changed
- no schemas changed
- no validators changed
- no tests changed
- no runtime/UI/storage/command/event/reward/migration/gameplay paths changed
- both selected sites remain active with `parentDistrictId: null`
- no live `settlement_site` snippets exist yet
- General Lore still lacks `settlement_site` and `world.settlement_sites` until the later seed implementation

Minimum hygiene checks:

- `git diff --check`
- conflict-marker scan on changed files
- trailing-whitespace scan on changed files
- changed-path scope audit

Focused tests are optional for this docs-only run unless local workflow requires them.

## 15. Next recommended version

`Version 0.5.279 - Highcrown Settlement Site Knowledge Snippet Seed`

That run may update General Lore registry alignment for `settlement_site` and `world.settlement_sites`, add exactly the two selected site snippets, and update focused tests/workflow docs as required. It must not add other snippets, edit settlement/district/site content, change anchors, edit schemas or validators, edit trial policies, or add runtime/UI/storage/commands/events/rewards/migrations/save-account/route-travel/building-workplace-economy/court-law/vendor-market/cargo-storage/sacred-site/religious-hotspot/gameplay behavior.
