# Highcrown Settlement Site Anchor Evidence Clarification Plan

Source version/run: Version 0.5.274 - Highcrown Settlement Site Anchor Evidence Clarification Plan
Date: 2026-07-06
Status: documentation-only evidence clarification; no content implementation selected

## 1. Decision Summary

Define the evidence standard for future Highcrown settlement site district-anchor, activation, and site Knowledge snippet decisions.

This plan evaluates only:

- `settlement_site.highcrown.barge_quays`
- `settlement_site.highcrown.palace_terraces`

Decision:

- Keep `settlement_site.highcrown.barge_quays` planned and unanchored.
- Keep `settlement_site.highcrown.palace_terraces` planned and unanchored.
- Select no district-anchor implementation from this run.
- Recommend a docs-first activation readiness review next.

This run does not activate sites, change `parentDistrictId`, add Knowledge snippets, edit Knowledge registry/domain/trial-policy content, edit schemas or validators, change tests, or change settlement, district, site, runtime, UI, storage, command, event, reward, migration, save/account, route/travel, building/workplace/economy, court/law, vendor/market, cargo/storage, sacred-site/religious-hotspot, or gameplay behavior.

## 2. Current District Authority Posture

Current settlement district authority exists at `packages/content/base/world/settlement_districts.json`.

- `settlement_district.highcrown.archive_districts` is `status: "active"`.
- `settlement_district.highcrown.market_courts` is `status: "active"`.

`archive_districts` remains static civic record-district identity only. It grants no archive service, Knowledge unlock, storage, NPC staffing, access rule, quest, UI, or gameplay behavior.

`market_courts` remains static market-court district identity only. It grants no vendors, stock, prices, services, taxes, trade execution, law/court mechanics, cargo/storage, ownership, NPC staffing, access rules, route topology, quests, rewards, UI, runtime, or gameplay behavior.

Active district status alone is not site-placement evidence.

## 3. Current Site Authority Posture

Current settlement site authority exists at `packages/content/base/world/settlement_sites.json`.

- `settlement_site.highcrown.barge_quays` is `status: "planned"` with `parentDistrictId: null`.
- `settlement_site.highcrown.palace_terraces` is `status: "planned"` with `parentDistrictId: null`.

Both records are static placed-site identity only. They do not own route topology, pathfinding, cargo inventory, storage, prices, vendors, services, court services, palace access, access control, NPC staffing, ownership, law behavior, UI, runtime, or gameplay behavior.

## 4. Current Knowledge Snippet Posture

Exactly two live `settlement_district` Knowledge snippets exist:

- `knowledge_snippet.general_lore.highcrown_archive_districts.identification`
- `knowledge_snippet.general_lore.highcrown_market_courts.identification`

No live `settlement_site` Knowledge snippets exist.

No Knowledge snippets exist for:

- `settlement_site.highcrown.barge_quays`
- `settlement_site.highcrown.palace_terraces`

This plan does not add or edit snippets.

## 5. Current Knowledge Domain And Registry Posture

Direct Knowledge subject support exists for:

- `settlement_district`
- `settlement_site`

Knowledge snippet validation remains resolver-backed and active-only for both subject types.

`knowledge_domain.general_lore` is active and supports the current district snippets with:

- `settlement_district` in `canonicalSubjectTypes`
- `world.settlement_districts` in `relatedContentCollections`
- `identification` in `supportedSnippetCategories`
- `book_study` in `supportedDiscoverySourceTypes`

No Knowledge registry, domain, trial-policy, schema, or validator change is required for this evidence-clarification plan.

If later site snippets are considered, General Lore or another selected domain must be separately reviewed for `settlement_site` and `world.settlement_sites` support.

## 6. Evidence Clarification Purpose

The prior anchor review found:

- both site records have Highcrown-level authored evidence;
- neither site has direct authored evidence placing it inside `settlement_district.highcrown.archive_districts`;
- neither site has direct authored evidence placing it inside `settlement_district.highcrown.market_courts`;
- semantic proximity is not enough to assign `parentDistrictId`;
- no anchor implementation should follow directly from that review.

This plan converts those findings into a reusable evidence standard for future site anchor, site activation, and site Knowledge snippet decisions.

## 7. Evidence Source Hierarchy

Future decisions should use this hierarchy:

1. Direct structured authority field in the relevant site record or source plan.
2. Direct authored prose stating that the site is inside, part of, attached to, administered by, or physically contained within a named active district.
3. Direct authored design plan selecting a specific site-to-district relationship and explaining static-only implications.
4. Strong but indirect same-settlement evidence, which may prove the site belongs to Highcrown but not to a specific district.
5. Semantic tag overlap, geography guesswork, naming similarity, or functional association.

Only levels 1-3 can support a future non-null `parentDistrictId`.

Level 4 can support Highcrown-level site identity and a later activation review if behavior implications are bounded.

Level 5 is insufficient for district anchoring, activation, or Knowledge snippet authoring by itself.

## 8. District-Anchor Evidence Standard

A future site `parentDistrictId` implementation may be selected only if all of the following are true:

- the site exists in `packages/content/base/world/settlement_sites.json`;
- the site remains a valid authored Highcrown site;
- the site and proposed district share the same settlement slug;
- the proposed parent district exists in `packages/content/base/world/settlement_districts.json`;
- the proposed parent district is `status: "active"`;
- authored evidence directly places the site inside, within, under, attached to, or administered by that district;
- the evidence is more specific than broad Highcrown settlement prose;
- the evidence is more specific than tag overlap or semantic proximity;
- the anchor can remain static authority metadata only;
- the anchor does not imply site activation;
- the anchor does not imply route/travel, cargo/storage, vendor/market, service, court/law, access, ownership, NPC, UI, runtime, reward, command, event, migration, save/account, or gameplay behavior;
- the anchor does not make the planned site eligible for a live Knowledge snippet.

If any requirement is not satisfied, keep `parentDistrictId: null`.

## 9. Site Activation Evidence Standard

A future site activation review may be selected only if all of the following are true:

- the site has direct authored evidence as a current Highcrown site;
- static-only wording exists that avoids functional behavior implications;
- activation would mean only that the site is accepted as current static authored place identity;
- activation would not imply services, access, vendors, travel, cargo, storage, palace access, dock operation, court behavior, NPC staffing, ownership, UI, runtime, rewards, route behavior, economy behavior, or gameplay;
- activation would not require district anchoring unless the district-anchor evidence standard is separately satisfied;
- activation would not add snippets;
- activation would not edit Knowledge schemas, validators, registry/domain/trial-policy content, runtime, UI, or gameplay behavior.

Activation readiness is a separate question from district anchoring. A site may be reviewed for active static identity while remaining unanchored if the evidence proves Highcrown-level site identity and no district-specific placement.

## 10. Site Knowledge Snippet Evidence Standard

A future live `settlement_site` Knowledge snippet requires all of the following:

- the site record exists;
- the site is `status: "active"`;
- direct `settlement_site` subject support remains present;
- the selected Knowledge domain supports `settlement_site`;
- the selected Knowledge domain advertises the relevant content collection if required;
- the category and discovery source type are supported;
- a separate docs-first site snippet seed plan selects exact safe wording;
- the snippet wording is static authored place knowledge only;
- the snippet does not imply access, services, vendors, travel, cargo, storage, palace systems, dock systems, court/law systems, routes, UI, runtime, rewards, or gameplay.

A non-null `parentDistrictId` is not sufficient for snippet eligibility. Active site status and separate snippet planning are still required.

## 11. Candidate Evidence Review: `barge_quays`

Current record:

- id: `settlement_site.highcrown.barge_quays`
- current status: `planned`
- current `parentDistrictId`: `null`
- parent settlement id: `settlement.highcrown`
- site type: `wharf`
- current summary: `Planned river wharf site within Highcrown where the capital's barge quays anchor its inland river trade identity.`
- current functional tags: `barge_traffic`, `cargo_landing`, `river_trade`
- current place-role tags: `imperial_capital`, `river_capital`
- current source authority note: `Highcrown summary explicitly references barge quays.`

Current evidence proves Highcrown-level site identity.

Current evidence does not prove a district anchor.

`market_courts` semantic proximity through `barge_commerce`, river trade, and river-confluence context is insufficient. It remains tag and context overlap, not direct placement evidence.

`archive_districts` has no direct evidence connection.

Future anchor evidence would need explicit wording such as:

- `the Barge Quays lie within the Market Courts`
- `the Barge Quays are administered as part of the Market Courts`
- `the Market Courts include the Barge Quays as their river-facing wharf site`

Any such future wording must remain static authority only and must not imply dock operation, cargo/storage, routes, travel, trade execution, vendors, prices, services, UI, runtime, or gameplay.

Until direct evidence exists, `barge_quays` should remain planned and unanchored.

## 12. Candidate Evidence Review: `palace_terraces`

Current record:

- id: `settlement_site.highcrown.palace_terraces`
- current status: `planned`
- current `parentDistrictId`: `null`
- parent settlement id: `settlement.highcrown`
- site type: `palace`
- current summary: `Planned palace landmark site within Highcrown where terraced palace grounds mark the capital's imperial bluff identity.`
- current functional tags: `palace_precinct`, `court_presence`
- current place-role tags: `imperial_capital`, `bluff_landmark`
- current source authority note: `Highcrown siteContext explicitly references palace terraces.`

Current evidence proves Highcrown-level site identity.

Current evidence does not prove a district anchor.

`archive_districts` has no direct palace terrace placement evidence.

`market_courts` has no direct palace terrace placement evidence.

The term `court_presence` must not be treated as a link to Market Courts or legal/court mechanics. It is descriptive palace context only.

Future anchor evidence would need explicit wording such as:

- `the Palace Terraces lie within the Archive Districts`
- `the Palace Terraces are part of a named Highcrown palace district`
- `the Palace Terraces are administered under [specific active district]`

If no active district is explicitly supported, future content should keep `parentDistrictId: null` or plan a separate district authority before anchoring.

Until direct evidence exists, `palace_terraces` should remain planned and unanchored.

## 13. Accepted Evidence Types

Accept only evidence that does one of the following:

- directly names the site and district in the same relationship;
- directly states physical containment;
- directly states administrative containment;
- directly selects a static site-to-district authority link in a design plan;
- updates source authority notes to cite a direct site-to-district relationship;
- introduces a new active district authority that directly owns the site, if that route is separately planned and implemented.

Accepted evidence must still preserve static-only implications and pass the relevant future gate.

## 14. Rejected Evidence Types

Reject:

- tag overlap alone;
- broad settlement prose alone;
- inferred geography;
- map guesswork;
- real-world analogy;
- semantic similarity;
- `barge` or `river` terms alone;
- `court` terms alone;
- functional convenience;
- desire to reduce null anchors;
- activation status of nearby districts;
- Knowledge snippet subject support;
- runtime route/travel or service assumptions.

Null district anchors are valid authored posture. They should not be treated as incomplete records.

## 15. Future Content Wording Requirements

If future evidence is authored, it must use static-only language.

For `barge_quays`, safe future evidence wording may reference:

- named Highcrown river wharf identity;
- possible district placement only if explicit;
- static river-facing place identity.

It must not imply:

- dock operation;
- cargo inventory;
- storage;
- route topology;
- travel services;
- trade execution;
- vendors;
- prices;
- services;
- UI;
- runtime;
- gameplay.

For `palace_terraces`, safe future evidence wording may reference:

- named Highcrown palace landmark identity;
- terraced palace grounds;
- imperial bluff identity;
- possible district placement only if explicit.

It must not imply:

- palace access;
- court/law mechanics;
- noble NPC services;
- ownership;
- access control;
- quests;
- rewards;
- UI;
- runtime;
- gameplay.

## 16. Future Implementation Gates

Gate A: District anchor implementation.

- Requires direct authored site-to-district evidence.
- May edit only `packages/content/base/world/settlement_sites.json`.
- May change only the selected site record's `parentDistrictId` and optionally a static-only note.
- Must keep the site planned unless a separate activation run is scoped.
- Must add no snippets.

Gate B: Site activation review.

- May review active status readiness.
- Must not change status unless a later implementation run is selected.
- Must not require a district anchor unless evidence supports one.
- Must not add snippets.

Gate C: Site activation implementation.

- May change only selected site status and tiny wording/notes if a prior review selects it.
- Must not add snippets.
- Must not change runtime/gameplay.

Gate D: Site Knowledge snippet seed review.

- Requires active site status.
- Must be separate from activation.
- Must not add snippets unless followed by a later implementation prompt.

## 17. Knowledge Snippet Impact

Direct `settlement_site` Knowledge subject support exists.

Live `settlement_site` snippets remain active-only.

Both current site records remain planned, so no site snippets may be added.

A non-null `parentDistrictId` would not make a planned site eligible for snippets.

The two current district snippets remain unchanged:

- `knowledge_snippet.general_lore.highcrown_archive_districts.identification`
- `knowledge_snippet.general_lore.highcrown_market_courts.identification`

No Knowledge registry/domain/trial-policy, schema, or validator changes are required in this run.

If later site snippets are considered, General Lore or another domain must be separately reviewed for `settlement_site` and `world.settlement_sites` support.

## 18. Explicit Non-Goals

This run does not:

- activate sites;
- change `parentDistrictId`;
- add or edit Knowledge snippets;
- edit Knowledge registry/domain/trial-policy content;
- edit Knowledge schemas or validators;
- change tests;
- edit settlement, district, or site content;
- evaluate, activate, anchor, or author snippets for districts;
- evaluate or author parent settlement snippets;
- evaluate or author route/travel snippets;
- evaluate or author building/workplace/economy snippets;
- evaluate or author vendor/market snippets;
- evaluate or author court/law snippets;
- evaluate or author cargo/storage snippets;
- evaluate or author sacred-site snippets;
- evaluate or author religious-hotspot snippets;
- change runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, or gameplay behavior;
- transition the project to `0.6.0`.

## 19. Validation And Audit Posture

Validation for this docs-only plan should prove:

- changed paths are docs-only;
- `settlement_district.highcrown.archive_districts` remains active and unchanged;
- `settlement_district.highcrown.market_courts` remains active with static-only boundary wording;
- `settlement_districts.json` is unchanged by this run;
- `settlement_site.highcrown.barge_quays` remains planned with `parentDistrictId: null`;
- `settlement_site.highcrown.palace_terraces` remains planned with `parentDistrictId: null`;
- `settlement_sites.json` is unchanged by this run;
- exactly two live `settlement_district` snippets exist;
- no live `settlement_site` snippets exist;
- no snippets exist for `barge_quays` or `palace_terraces`;
- `knowledge_snippets.json` is unchanged by this run;
- `knowledge_domain.general_lore` remains active and supports the current district snippets;
- registry/domain/trial-policy content is unchanged;
- direct `settlement_district` and `settlement_site` support remains present;
- Knowledge snippet validation remains resolver-backed and active-only;
- settlement site validation still accepts `parentDistrictId: null`;
- no content/schema/validator/test/runtime/UI/storage/command/event/reward/migration/gameplay files changed.

Minimum hygiene checks:

- `git diff --check`;
- conflict-marker scan on changed files;
- trailing-whitespace scan on changed files;
- changed-path scope audit.

Focused tests are optional for this docs-only run unless local workflow requires them.

## 20. Next Recommended Version

`Version 0.5.275 - Highcrown Settlement Site Activation Readiness Review`

That run should remain docs-first. It may review whether either planned Highcrown site can safely become active as static site identity while remaining unanchored. It must not activate sites, change `parentDistrictId`, add site snippets, edit Knowledge schemas or validators, edit Knowledge registry/domain/trial-policy content, add route/travel, building/workplace/economy, court/law, vendor/market, cargo/storage, sacred-site, or religious-hotspot content, or change runtime/UI/storage/commands/events/rewards/migrations/save-account/gameplay behavior unless a later focused implementation prompt explicitly scopes that work.
