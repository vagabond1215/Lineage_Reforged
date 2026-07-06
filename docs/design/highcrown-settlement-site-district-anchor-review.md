# Highcrown Settlement Site District Anchor Review

Source version/run: Version 0.5.273 - Highcrown Settlement Site District Anchor Review
Date: 2026-07-06
Status: documentation-only district-anchor review; no implementation selected

## 1. Decision Summary

Keep both current Highcrown settlement site records planned and unanchored:

- `settlement_site.highcrown.barge_quays`
- `settlement_site.highcrown.palace_terraces`

Neither candidate should receive a later `parentDistrictId` implementation from this review. Current authored evidence proves both are Highcrown sites, but it does not place either site inside `settlement_district.highcrown.archive_districts` or `settlement_district.highcrown.market_courts`.

This run does not activate sites, change `parentDistrictId`, add Knowledge snippets, edit Knowledge registry/domain/trial-policy content, edit schemas or validators, change tests, or change runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, route/travel, building/workplace/economy, court/law, vendor/market, cargo/storage, sacred-site/religious-hotspot, or gameplay behavior.

## 2. Current District Authority Posture

Current settlement district authority exists at `packages/content/base/world/settlement_districts.json`.

- `settlement_district.highcrown.archive_districts` is `status: "active"`.
- `settlement_district.highcrown.market_courts` is `status: "active"`.

`archive_districts` is active as static civic record-district identity only. It grants no archive service, Knowledge unlock, storage, NPC staffing, access rule, quest, UI, or gameplay behavior.

`market_courts` is active as static market-court district identity only. It grants no vendors, stock, prices, services, taxes, trade execution, law/court mechanics, cargo/storage, ownership, NPC staffing, access rules, route topology, quests, rewards, UI, runtime, or gameplay behavior.

The existence of active districts does not automatically prove that a separate Highcrown site belongs inside either district.

## 3. Current Site Authority Posture

Current settlement site authority exists at `packages/content/base/world/settlement_sites.json`.

- `settlement_site.highcrown.barge_quays` is `status: "planned"` with `parentDistrictId: null`.
- `settlement_site.highcrown.palace_terraces` is `status: "planned"` with `parentDistrictId: null`.

Both records are static placed-site identity only. They do not own route topology, cargo inventory, storage, vendors, services, palace access, court services, law behavior, NPC staffing, ownership, UI, runtime state, or gameplay behavior.

## 4. Current Knowledge Snippet Posture

Exactly two live `settlement_district` Knowledge snippets exist:

- `knowledge_snippet.general_lore.highcrown_archive_districts.identification`
- `knowledge_snippet.general_lore.highcrown_market_courts.identification`

No live `settlement_site` Knowledge snippets exist.

No snippets exist for:

- `settlement_site.highcrown.barge_quays`
- `settlement_site.highcrown.palace_terraces`

This review does not add snippets.

## 5. Current Knowledge Domain And Registry Posture

Direct Knowledge subject support exists for:

- `settlement_district`
- `settlement_site`

Knowledge snippet validation remains resolver-backed and active-only for both subject types.

`knowledge_domain.general_lore` is active and currently supports:

- `settlement_district` in `canonicalSubjectTypes`
- `world.settlement_districts` in `relatedContentCollections`
- `identification` in `supportedSnippetCategories`
- `book_study` in `supportedDiscoverySourceTypes`

General Lore does not need changes for this review because no site snippet is selected. If a later active site snippet is selected, that separate snippet plan must recheck whether General Lore should advertise `settlement_site` and `world.settlement_sites`.

## 6. District Anchor Eligibility Threshold

A planned site should receive a future non-null `parentDistrictId` only when all of these are true:

- the site authority remains valid as a separate authored site;
- the candidate parent district is active and belongs to the same settlement;
- direct authored evidence places the site inside that district;
- the anchor can remain static authority metadata only;
- the anchor does not imply activation of site status;
- the anchor does not imply route/travel, cargo/storage, vendor/market, service, court/law, access, ownership, NPC, UI, runtime, reward, command, event, migration, save/account, or gameplay behavior;
- Knowledge snippet eligibility remains separately planned and active-only.

Semantic adjacency, tag overlap, broad settlement prose, or likely geography is not enough.

## 7. Candidate Audit Method

The audit reviewed only the current Highcrown district and site authorities plus the immediate Knowledge support posture.

For each candidate site, the audit checked:

- current id, status, parent settlement, and `parentDistrictId`;
- site type, summary, functional tags, place-role tags, notes, and source authority notes;
- whether Highcrown settlement prose supplies only broad settlement evidence or direct district-placement evidence;
- candidate fit against `archive_districts`;
- candidate fit against `market_courts`;
- implication risk if an anchor were applied;
- whether `parentDistrictId: null` remains the safer current authority posture.

The audit intentionally did not evaluate site activation, site snippets, route/travel behavior, building/workplace/economy behavior, court/law behavior, vendor/market behavior, cargo/storage behavior, sacred-site/religious-hotspot content, runtime behavior, UI, storage, commands, events, rewards, migrations, save/account behavior, or gameplay behavior.

## 8. Candidate Review: `barge_quays`

Current record:

- id: `settlement_site.highcrown.barge_quays`
- status: `planned`
- parent settlement id: `settlement.highcrown`
- parent district id: `null`
- site type: `wharf`
- summary: `Planned river wharf site within Highcrown where the capital's barge quays anchor its inland river trade identity.`
- functional tags: `barge_traffic`, `cargo_landing`, `river_trade`
- place-role tags: `imperial_capital`, `river_capital`
- source authority note: `Highcrown summary explicitly references barge quays.`

Evidence supports a Highcrown-level placed site because `settlement.highcrown` summary references barge quays.

`archive_districts` is rejected as an anchor. The record has no archive, civic recordkeeping, or administrative-district placement evidence.

`market_courts` is rejected as an anchor for now. The semantic proximity is real: `market_courts` has `barge_commerce` context and `barge_quays` has river trade tags. But current authored evidence does not say the Barge Quays are inside the Market Courts. Anchoring the site to Market Courts would risk implying unfinished dock, cargo, storage, trade, route, vendor, market, service, or logistics behavior.

`parentDistrictId: null` remains selected. The evidence proves Highcrown barge quays, not a district-specific placement.

Future reconsideration requires explicit authored text placing the Barge Quays inside a current active Highcrown district and preserving static-only behavior exclusions.

## 9. Candidate Review: `palace_terraces`

Current record:

- id: `settlement_site.highcrown.palace_terraces`
- status: `planned`
- parent settlement id: `settlement.highcrown`
- parent district id: `null`
- site type: `palace`
- summary: `Planned palace landmark site within Highcrown where terraced palace grounds mark the capital's imperial bluff identity.`
- functional tags: `palace_precinct`, `court_presence`
- place-role tags: `imperial_capital`, `bluff_landmark`
- source authority note: `Highcrown siteContext explicitly references palace terraces.`

Evidence supports a Highcrown-level placed site because `settlement.highcrown` site context references palace terraces.

`archive_districts` is rejected as an anchor. The record has no archive, recordkeeping, or administrative-district placement evidence.

`market_courts` is rejected as an anchor. The record has no market, trade, civic-commercial, river-confluence, or market-court placement evidence.

`parentDistrictId: null` remains selected. Neither active district clearly owns palace terraces, and assigning either anchor would add unsupported spatial authority.

Future reconsideration requires explicit authored text placing the Palace Terraces inside a current active Highcrown district and preserving static-only behavior exclusions.

## 10. Decision Outcome

No district-anchor implementation is selected.

- `settlement_site.highcrown.barge_quays` should remain `status: "planned"` with `parentDistrictId: null`.
- `settlement_site.highcrown.palace_terraces` should remain `status: "planned"` with `parentDistrictId: null`.

The current null anchors are not gaps to patch by inference. They are the correct conservative posture until direct authored placement evidence exists.

## 11. Future Implementation Recommendation, If Any

No content implementation should follow directly from this review.

The next useful run should be a documentation-only evidence clarification plan that decides what kind of authored source text would be needed before any future anchor implementation, site activation, or site snippet planning.

Recommended next version:

`Version 0.5.274 - Highcrown Settlement Site Anchor Evidence Clarification Plan`

That future plan should stay docs-first and should not activate sites, change anchors, add site snippets, or touch runtime/gameplay behavior.

## 12. Knowledge Snippet Impact

This review has no immediate Knowledge snippet impact.

Both current site records remain `planned`, so active-only Knowledge validation keeps them ineligible for live public snippets.

Adding a non-null `parentDistrictId` alone would not make a planned site eligible for a snippet. Site snippet eligibility still requires:

- active site status;
- direct `settlement_site` subject support;
- appropriate domain/registry support for `settlement_site`;
- a separate snippet seed plan;
- static-only wording that grants no runtime, UI, reward, route, service, market, cargo, court, access, ownership, or gameplay behavior.

No site snippet is selected here.

## 13. Rejected Alternatives

- Anchor `barge_quays` to `market_courts`: rejected because semantic proximity is not direct district-placement evidence and risks implying dock, cargo, storage, trade, route, vendor, market, service, or logistics behavior.
- Anchor `barge_quays` to `archive_districts`: rejected because no archive or recordkeeping placement evidence exists.
- Anchor `palace_terraces` to `archive_districts`: rejected because no archive or administrative-district placement evidence exists.
- Anchor `palace_terraces` to `market_courts`: rejected because no market, trade, river-confluence, or civic-commercial placement evidence exists.
- Activate sites to make anchors useful: rejected because activation is outside scope and still needs implication review.
- Add site snippets now: rejected because both site records remain planned and no site snippet plan exists.
- Treat Highcrown settlement prose as proof of district placement: rejected because it proves settlement-level identity only.

## 14. Explicit Non-Goals

This run does not:

- activate sites;
- change `parentDistrictId`;
- add or edit Knowledge snippets;
- edit Knowledge registry/domain/trial-policy content;
- edit schemas or validators;
- change tests;
- edit settlement, district, or site content;
- add route/travel, building/workplace/economy, court/law, vendor/market, cargo/storage, sacred-site, or religious-hotspot content;
- change runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, or gameplay behavior;
- transition the project to `0.6.0`.

## 15. Validation And Audit Posture

Validation for this docs-only review should prove:

- changed paths are docs-only;
- `settlement_district.highcrown.archive_districts` remains active;
- `settlement_district.highcrown.market_courts` remains active;
- `settlement_site.highcrown.barge_quays` remains planned with `parentDistrictId: null`;
- `settlement_site.highcrown.palace_terraces` remains planned with `parentDistrictId: null`;
- exactly two live `settlement_district` Knowledge snippets exist;
- no live `settlement_site` snippets exist;
- `knowledge_domain.general_lore` remains active and supports the current district snippets;
- direct `settlement_district` and `settlement_site` subject support remains present;
- no content/schema/validator/test/runtime/UI/storage/gameplay files changed.

Minimum hygiene checks:

- `git diff --check`;
- conflict-marker scan on changed files;
- trailing-whitespace scan on changed files;
- changed-path scope audit.

Focused tests are optional for this docs-only run unless local review requires them.

## 16. Next Recommended Version

`Version 0.5.274 - Highcrown Settlement Site Anchor Evidence Clarification Plan`

That run should document the evidence standard for any later site anchor implementation and should preserve the current no-activation, no-snippet, no-runtime posture.
