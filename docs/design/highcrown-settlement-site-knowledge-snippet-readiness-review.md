# Highcrown Settlement Site Knowledge Snippet Readiness Review

Source version/run: Version 0.5.277 - Highcrown Settlement Site Knowledge Snippet Readiness Review
Date: 2026-07-06
Status: documentation-only readiness review; no snippets or registry changes

## 1. Decision Summary

Select both now-active Highcrown settlement site authority records for a later docs-first General Lore site Knowledge snippet seed plan:

- `settlement_site.highcrown.barge_quays`
- `settlement_site.highcrown.palace_terraces`

This run does not add snippets, align General Lore for site subjects, edit Knowledge registry/domain/trial-policy content, edit Knowledge schemas or validators, edit settlement/district/site content, change site district anchors, change tests, or change runtime/UI/storage/command/event/reward/migration/save-account/route-travel/building-workplace-economy/court-law/vendor-market/cargo-storage/sacred-site/religious-hotspot/gameplay behavior.

## 2. Current Versioning Posture

Latest completed primary version before this review:

- `Version 0.5.276 - Highcrown Settlement Site Status Activation`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

This review is the next primary roadmap version:

- `Version 0.5.277 - Highcrown Settlement Site Knowledge Snippet Readiness Review`

The completed support suffix `0.5.276.1` does not consume or renumber primary roadmap slots. Three-segment versions remain primary roadmap versions; four-segment versions remain support-run suffixes.

## 3. Current Site Authority Posture

Current settlement site authority exists at `packages/content/base/world/settlement_sites.json`.

`settlement_site.highcrown.barge_quays` is active.

- parent settlement id: `settlement.highcrown`
- parent district id: `null`
- site type: `wharf`
- summary: `Static river-wharf site within Highcrown where the capital's barge quays mark its inland river trade identity.`
- functional tags: `barge_traffic`, `cargo_landing`, `river_trade`
- place-role tags: `imperial_capital`, `river_capital`
- source authority notes: `Highcrown summary explicitly references barge quays.`
- behavior-exclusion note: `Static site identity only; no dock operation, cargo inventory, storage, travel service, route topology, trade execution, vendors, prices, services, ownership, NPC staffing, access rules, UI, runtime, rewards, or gameplay behavior.`

`settlement_site.highcrown.palace_terraces` is active.

- parent settlement id: `settlement.highcrown`
- parent district id: `null`
- site type: `palace`
- summary: `Static palace landmark site within Highcrown where terraced palace grounds mark the capital's imperial bluff identity.`
- functional tags: `palace_precinct`, `court_presence`
- place-role tags: `imperial_capital`, `bluff_landmark`
- source authority notes: `Highcrown siteContext explicitly references palace terraces.`
- behavior-exclusion note: `Static site identity only; no palace access, court/law mechanics, court services, ownership, NPC staffing, access rules, quests, rewards, UI, runtime, or gameplay behavior.`

Both site records remain valid with `parentDistrictId: null`.

## 4. Current District Authority Posture

Current settlement district authority exists at `packages/content/base/world/settlement_districts.json`.

- `settlement_district.highcrown.archive_districts` is active static district identity.
- `settlement_district.highcrown.market_courts` is active static district identity.

Neither active district provides direct authored district-placement evidence for either reviewed site. Prior anchor reviews remain controlling: current evidence proves Highcrown-level site identity, not placement inside `archive_districts` or `market_courts`.

## 5. Current Knowledge Snippet Posture

Exactly two live `settlement_district` General Lore snippets exist:

- `knowledge_snippet.general_lore.highcrown_archive_districts.identification`
- `knowledge_snippet.general_lore.highcrown_market_courts.identification`

No live `settlement_site` snippets exist.

No Knowledge snippets exist for:

- `settlement_site.highcrown.barge_quays`
- `settlement_site.highcrown.palace_terraces`

This review does not edit `packages/content/base/player/knowledge_snippets.json`.

## 6. Current Knowledge Domain And Registry Posture

Direct Knowledge subject support exists for:

- `settlement_district`
- `settlement_site`

The Knowledge snippet schema and Knowledge domain registry schema both include these subject values. Knowledge snippet validation resolves both subject types against live authority records and enforces active-only public references.

`knowledge_domain.general_lore` currently supports the district snippet lane through `packages/content/base/player/knowledge_domain_registry.json`:

- `settlement_district` in `canonicalSubjectTypes`
- `world.settlement_districts` in `relatedContentCollections`
- `identification` in `supportedSnippetCategories`
- `book_study` in `supportedDiscoverySourceTypes`

General Lore does not currently advertise:

- `settlement_site`
- `world.settlement_sites`

Therefore a later General Lore site snippet seed plan must select exact registry alignment before snippet implementation. This review does not make that change.

## 7. Site Snippet Readiness Standard

A future live `settlement_site` Knowledge snippet may be planned only if all of the following are true:

- the site record exists in `packages/content/base/world/settlement_sites.json`;
- the site is `status: "active"`;
- the site has direct authored Highcrown-level identity evidence;
- the site does not require a non-null district anchor to be explainable;
- the selected Knowledge subject type is exactly `settlement_site`;
- the selected subject id is the active site id;
- the selected Knowledge domain supports `settlement_site`;
- the selected Knowledge domain advertises `world.settlement_sites`;
- the selected snippet category is supported by that domain;
- the selected discovery source type is supported by that domain;
- the future snippet wording can remain static authored place knowledge only;
- the future snippet wording does not imply access, services, vendors, travel, cargo, storage, palace systems, dock systems, court/law systems, routes, UI, runtime, rewards, unlocks, ownership, NPC staffing, or gameplay;
- the future snippet can use hidden-summary wording that reveals identity without adding gameplay behavior;
- the future snippet can preserve `lockedUntilDiscovered: true`, `revealsSubjectIdentity: true`, and active-only validation posture;
- the future snippet can use `book_study` only if General Lore or another selected domain supports it.

## 8. Candidate Audit Method

Each candidate was checked for:

- site id;
- status;
- parent settlement id;
- parent district id;
- site type;
- current summary;
- functional tags;
- place-role tags;
- source authority notes;
- behavior-exclusion notes;
- evidence strength for Knowledge identification;
- direct active `settlement_site` subject validation support;
- General Lore domain/registry readiness;
- required `world.settlement_sites` alignment;
- candidate category and discovery source type;
- candidate title, summary, hidden summary, and note;
- implication risks;
- whether a later seed plan should include it;
- decision and reason.

## 9. Candidate Review: `barge_quays`

Candidate:

- site id: `settlement_site.highcrown.barge_quays`
- status: `active`
- parent settlement id: `settlement.highcrown`
- parent district id: `null`
- site type: `wharf`
- current summary: `Static river-wharf site within Highcrown where the capital's barge quays mark its inland river trade identity.`
- functional tags: `barge_traffic`, `cargo_landing`, `river_trade`
- place-role tags: `imperial_capital`, `river_capital`
- source authority notes: `Highcrown summary explicitly references barge quays.`
- behavior-exclusion notes: no dock operation, cargo inventory, storage, travel service, route topology, trade execution, vendors, prices, services, ownership, NPC staffing, access rules, UI, runtime, rewards, or gameplay behavior.

Evidence strength:

- Strong for static Knowledge identification. Highcrown settlement summary directly names barge quays.
- The null district anchor is valid and does not block a site-identification snippet.
- Current evidence does not place the Barge Quays inside `market_courts` or any active district.

Validation posture:

- Direct `settlement_site` subject schema support exists.
- Resolver-backed active-only validation can support this site because the site is active.
- General Lore would need future `settlement_site` and `world.settlement_sites` alignment before a General Lore site snippet can validate.

Candidate future snippet:

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
- hidden summary: `An unidentified Highcrown river-wharf site remains to be understood.`
- note: `This snippet is authored place knowledge only and grants no dock operation, cargo inventory, storage, travel service, route topology, trade execution, vendors, prices, services, ownership, NPC staffing, access rules, UI, runtime, rewards, or gameplay behavior.`

Implication risks:

- Wharf, cargo, and river-trade terms can imply docks, cargo inventories, storage, routes, travel services, trade execution, vendors, prices, or gameplay.
- The selected wording controls that risk by keeping the snippet identification-only and by repeating the behavior-exclusion boundary.

Decision:

- Select for later General Lore `settlement_site` identification snippet planning.

Reason:

- The site is active, directly evidenced, valid with `parentDistrictId: null`, supported by direct active-only `settlement_site` validation, and safe with static-only wording if General Lore alignment is planned separately.

## 10. Candidate Review: `palace_terraces`

Candidate:

- site id: `settlement_site.highcrown.palace_terraces`
- status: `active`
- parent settlement id: `settlement.highcrown`
- parent district id: `null`
- site type: `palace`
- current summary: `Static palace landmark site within Highcrown where terraced palace grounds mark the capital's imperial bluff identity.`
- functional tags: `palace_precinct`, `court_presence`
- place-role tags: `imperial_capital`, `bluff_landmark`
- source authority notes: `Highcrown siteContext explicitly references palace terraces.`
- behavior-exclusion notes: no palace access, court/law mechanics, court services, ownership, NPC staffing, access rules, quests, rewards, UI, runtime, or gameplay behavior.

Evidence strength:

- Strong for static Knowledge identification. Highcrown site context directly names palace terraces.
- The null district anchor is valid and does not block a site-identification snippet.
- Current evidence does not place the Palace Terraces inside `archive_districts`, `market_courts`, or any active district.
- `court_presence` is descriptive palace context only. It is not Market Courts placement evidence and does not authorize law/court mechanics.

Validation posture:

- Direct `settlement_site` subject schema support exists.
- Resolver-backed active-only validation can support this site because the site is active.
- General Lore would need future `settlement_site` and `world.settlement_sites` alignment before a General Lore site snippet can validate.

Candidate future snippet:

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
- hidden summary: `An unidentified Highcrown palace landmark remains to be understood.`
- note: `This snippet is authored place knowledge only and grants no palace access, court/law mechanics, court services, ownership, NPC staffing, access rules, quests, rewards, UI, runtime, or gameplay behavior.`

Implication risks:

- Palace and court-related terms can imply palace access, court/law services, access rules, NPC staffing, ownership, quests, rewards, UI, runtime, or gameplay.
- The selected wording controls that risk by keeping the snippet identification-only and by repeating the behavior-exclusion boundary.

Decision:

- Select for later General Lore `settlement_site` identification snippet planning.

Reason:

- The site is active, directly evidenced, valid with `parentDistrictId: null`, supported by direct active-only `settlement_site` validation, and safe with static-only wording if General Lore alignment is planned separately.

## 11. Domain And Registry Alignment Requirements

Use General Lore for the later site snippet lane only if a future seed plan selects narrow registry alignment.

General Lore already supports:

- `settlement_district`
- `world.settlement_districts`
- `identification`
- `book_study`

General Lore does not yet advertise:

- `settlement_site`
- `world.settlement_sites`

If both site snippets are selected for a future General Lore seed, a later implementation would likely need to add:

- `settlement_site` to `knowledge_domain.general_lore.canonicalSubjectTypes`
- `world.settlement_sites` to `knowledge_domain.general_lore.relatedContentCollections`

The future seed should not require a new snippet category or source type because `identification` and `book_study` are already supported by General Lore. Do not edit `knowledge_domain_registry.json`, `knowledge_domains.json`, or trial policies in this review.

## 12. Candidate Future Snippet Scope

Selected future scope:

- two Tier 1 General Lore `identification` snippets;
- direct `settlement_site` subjects only;
- active Highcrown site ids only;
- `book_study` as the discovery source type;
- `sourceId: null`;
- standard progression:
  - `completionWeight: 1`
  - `countsTowardTierCompletion: true`
  - `trialUnlockWeight: 0`
- standard visibility:
  - `lockedUntilDiscovered: true`
  - `revealsSubjectIdentity: true`

The later seed plan should include only:

- `knowledge_snippet.general_lore.highcrown_barge_quays.identification`
- `knowledge_snippet.general_lore.highcrown_palace_terraces.identification`

## 13. Candidate Future Snippet Wording Boundaries

Safe wording may identify:

- the Barge Quays as a Highcrown river-wharf site;
- the Palace Terraces as a Highcrown palace landmark site;
- each site as static authored place knowledge;
- each site as Highcrown-level identity, not district-anchored identity.

Safe wording must not imply:

- district placement;
- dock operation;
- cargo inventory;
- storage;
- travel service;
- route topology;
- trade execution;
- vendors;
- prices;
- services;
- palace access;
- court/law mechanics;
- court services;
- ownership;
- NPC staffing;
- access rules;
- quests;
- rewards;
- UI;
- runtime behavior;
- unlocks;
- gameplay behavior.

## 14. Decision Outcome

Option A is selected: both future site snippet candidates are ready for a later docs-first General Lore site Knowledge snippet seed plan.

- `barge_quays`: selected for later General Lore `settlement_site` identification snippet planning.
- `palace_terraces`: selected for later General Lore `settlement_site` identification snippet planning.

No snippets are added by this review.

## 15. Future Implementation Recommendation, If Any

Recommended next primary route:

`Version 0.5.278 - Highcrown Settlement Site Knowledge Snippet Seed Plan`

That run should remain docs-first. It may select exact future snippet records and exact General Lore alignment for `settlement_site` and `world.settlement_sites`, but it must not add snippets, edit Knowledge registry/domain/trial-policy content, edit schemas or validators, change settlement/district/site content, change anchors, or touch runtime/UI/storage/commands/events/rewards/migrations/save-account/route-travel/building-workplace-economy/court-law/vendor-market/cargo-storage/sacred-site/religious-hotspot/gameplay behavior unless a later focused implementation prompt explicitly scopes that work.

## 16. Rejected Alternatives

- Adding site snippets now: rejected because this is a docs-only readiness review.
- Aligning General Lore for `settlement_site` in this review: rejected because alignment belongs in a separate seed plan or implementation run.
- Changing Knowledge schemas or validators: rejected because direct `settlement_site` support already exists.
- Changing site content: rejected because both site records are already active and static-only.
- Changing `parentDistrictId`: rejected because current evidence does not prove district placement.
- Treating `parentDistrictId: null` as a snippet blocker: rejected because active site snippets can validate with null district anchors.
- Requiring district placement before site identification snippets: rejected because Highcrown-level active site identity is sufficient for identification-only Knowledge.
- Treating `barge_quays` as a Market Courts snippet: rejected because it is a separate active `settlement_site` authority.
- Treating `palace_terraces` as a Market Courts or Archive Districts snippet: rejected because no direct district-placement evidence exists.
- Treating `court_presence` as law/court mechanics: rejected because it is descriptive palace context only.
- Adding route/travel, dock, cargo/storage, palace access, court/law, vendor/market, services, UI, runtime, reward, or gameplay behavior: rejected as out of scope.

## 17. Explicit Non-Goals

This review does not:

- add snippets;
- edit Knowledge registry/domain/trial-policy content;
- edit Knowledge schemas or validators;
- edit settlement, district, or site content;
- change site district anchors;
- change tests;
- evaluate or author snippets for settlement districts;
- evaluate or author parent settlement snippets;
- evaluate or author route/travel snippets;
- evaluate or author dock operation snippets;
- evaluate or author cargo/storage snippets;
- evaluate or author palace system snippets;
- evaluate or author court/law snippets;
- evaluate or author vendor/market snippets;
- evaluate or author service snippets;
- evaluate or author building/workplace/economy snippets;
- evaluate or author sacred-site or religious-hotspot snippets;
- change runtime, UI, storage, command, event, reward, migration, save/account, route/travel, building/workplace/economy, court/law, vendor/market, cargo/storage, sacred-site, religious-hotspot, or gameplay behavior.

## 18. Validation And Audit Posture

Validation for this docs-only review should prove:

- changed paths are docs-only;
- `0.5.276` remains the previous completed primary;
- `0.5.276.1` remains the latest support/audit run;
- this run is `0.5.277`;
- `settlement_site.highcrown.barge_quays` remains active with `parentDistrictId: null`;
- `settlement_site.highcrown.palace_terraces` remains active with `parentDistrictId: null`;
- `settlement_sites.json` is unchanged by this review;
- both Highcrown district records remain active and unchanged;
- `settlement_districts.json` is unchanged by this review;
- exactly two live `settlement_district` snippets exist;
- no live `settlement_site` snippets exist;
- no snippets exist for either reviewed site;
- `knowledge_snippets.json` is unchanged by this review;
- General Lore supports `settlement_district`, `world.settlement_districts`, `identification`, and `book_study`;
- General Lore does not yet advertise `settlement_site` or `world.settlement_sites`;
- registry/domain/trial-policy content is unchanged;
- direct `settlement_district` and `settlement_site` Knowledge subject support remains present;
- active-only validation remains in force;
- schemas and validators are unchanged;
- no content/schema/validator/test/runtime/UI/storage/command/event/reward/migration/gameplay paths changed.

Minimum hygiene checks:

- `git diff --check`;
- conflict-marker scan on changed files;
- trailing-whitespace scan on changed files;
- changed-path scope audit.

Focused tests are optional for this docs-only run unless local workflow requires them.

## 19. Next Recommended Version

`Version 0.5.278 - Highcrown Settlement Site Knowledge Snippet Seed Plan`

That run should remain docs-first. It should plan the exact future site snippet records and exact General Lore alignment needed for `settlement_site` and `world.settlement_sites`, without adding snippets or editing registry/domain/trial-policy content until a later focused implementation prompt explicitly scopes that work.
