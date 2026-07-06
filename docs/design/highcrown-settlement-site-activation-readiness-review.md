# Highcrown Settlement Site Activation Readiness Review

Version: 0.5.275 - Highcrown Settlement Site Activation Readiness Review
Date: 2026-07-06
Scope: docs-only activation readiness review for `settlement_site.highcrown.barge_quays` and `settlement_site.highcrown.palace_terraces`

## Decision summary

Both reviewed Highcrown site records are safe for a later tiny active-status implementation as static site identity while remaining unanchored.

Selected for future activation:

- `settlement_site.highcrown.barge_quays`
- `settlement_site.highcrown.palace_terraces`

This review does not activate either site. Both records remain `status: "planned"` with `parentDistrictId: null` in live content. No Knowledge snippets, registry/domain edits, schemas, validators, tests, runtime behavior, UI, storage, commands, events, rewards, migrations, routes, travel services, building/workplace/economy content, court/law content, vendor/market content, cargo/storage content, sacred-site/religious-hotspot content, or gameplay behavior are changed by this run.

## Current district authority posture

Current settlement district authority exists at `packages/content/base/world/settlement_districts.json`.

- `settlement_district.highcrown.archive_districts` is `status: "active"`.
- `settlement_district.highcrown.market_courts` is `status: "active"`.

The active district records are static district identity only. They do not create archive services, market vendors, stock, prices, services, taxes, trade execution, law/court mechanics, cargo/storage, ownership, NPC staffing, access rules, route topology, quests, rewards, UI, runtime, or gameplay behavior.

No current evidence places either reviewed site inside either active district. `Version 0.5.273 - Highcrown Settlement Site District Anchor Review` and `Version 0.5.274 - Highcrown Settlement Site Anchor Evidence Clarification Plan` remain controlling for district-anchor posture: broad Highcrown prose can prove site identity, but not district placement.

## Current site authority posture

Current settlement site authority exists at `packages/content/base/world/settlement_sites.json`.

- `settlement_site.highcrown.barge_quays` is `status: "planned"` with `parentDistrictId: null`.
- `settlement_site.highcrown.palace_terraces` is `status: "planned"` with `parentDistrictId: null`.

Both records are Highcrown-level placed-site authorities. Their current planned status keeps them ineligible for live active-only Knowledge snippets. Their null district anchors are valid and should remain null unless a later focused run finds direct authored site-to-district evidence.

## Current Knowledge snippet posture

Exactly two live `settlement_district` Knowledge snippets exist:

- `knowledge_snippet.general_lore.highcrown_archive_districts.identification`
- `knowledge_snippet.general_lore.highcrown_market_courts.identification`

No live `settlement_site` Knowledge snippets exist.

No Knowledge snippet exists for:

- `settlement_site.highcrown.barge_quays`
- `settlement_site.highcrown.palace_terraces`

This review does not edit `packages/content/base/player/knowledge_snippets.json`.

## Current Knowledge domain and registry posture

Direct Knowledge subject support exists for:

- `settlement_district`
- `settlement_site`

Knowledge snippet validation remains resolver-backed and active-only for both subject types.

`knowledge_domain.general_lore` is active and currently supports the live district snippets with:

- `settlement_district` in `canonicalSubjectTypes`
- `world.settlement_districts` in `relatedContentCollections`
- `identification` snippet posture through existing snippet content
- `book_study` delivery posture through existing snippet content

General Lore does not currently advertise `settlement_site` or `world.settlement_sites`. That is acceptable for this review because no site snippet is selected or authored. If a later site snippet plan is considered, that separate plan must review domain and registry alignment for site subjects.

## Activation readiness standard

A planned settlement site may be selected for future active status only when all of the following are true:

- the site exists in live `world.settlement_sites` content;
- current authored settlement prose directly supports the site as a Highcrown place;
- active status can mean static authored place identity only;
- the future active wording avoids stale planned-status language;
- the future note explicitly blocks adjacent system implications;
- the site can remain valid with `parentDistrictId: null`;
- the activation does not require new district anchors, snippets, registry/domain edits, schema edits, validator edits, tests, runtime behavior, UI, storage, commands, events, rewards, migrations, route/travel behavior, building/workplace/economy behavior, court/law behavior, vendor/market behavior, cargo/storage behavior, sacred-site/religious-hotspot behavior, or gameplay behavior;
- any later Knowledge snippet remains a separate active-site snippet planning decision.

## Candidate audit method

Each candidate was checked against:

- current live site record status, parent settlement, parent district, type, summary, source note, and exclusion note;
- current Highcrown settlement summary and site-context prose;
- current active Highcrown district records and prior anchor reviews;
- current live Knowledge snippets;
- current General Lore registry posture;
- direct `settlement_site` Knowledge subject support and active-only validation;
- adjacent-system implication risks;
- whether a later implementation can be limited to `status`, `summary`, and `notes` for the selected site records.

## Candidate review: `barge_quays`

Current record:

- id: `settlement_site.highcrown.barge_quays`
- status: `planned`
- parent settlement: `settlement.highcrown`
- parent district: `null`
- site type: `wharf`
- current summary: `Planned river wharf site within Highcrown where the capital's barge quays anchor its inland river trade identity.`
- current source note: Highcrown summary explicitly references barge quays.
- current note: static placed-site identity only; no route topology, pathfinding, cargo inventory, storage, prices, vendors, services, ownership, UI, or gameplay behavior.

Evidence:

- Highcrown settlement summary says: `Valtherion's imperial river capital, where crown roads, archive districts, and barge quays govern the richest continent on the map.`
- The phrase "barge quays" directly supports the site as Highcrown-level static place identity.
- No current evidence places the quays inside `archive_districts` or `market_courts`.

Risk review:

- Wharf wording can imply docks, cargo inventory, storage, prices, vendors, services, travel routes, route topology, or logistics execution.
- That risk is controllable if future active wording says only static river-wharf identity and the note explicitly excludes dock operation, cargo inventory, storage, travel service, route topology, trade execution, vendors, prices, services, ownership, staffing, access rules, UI, runtime, rewards, and gameplay behavior.

Decision:

Select `settlement_site.highcrown.barge_quays` for future active-status implementation as static site identity only.

Required future status:

- `active`

Required future summary:

`Static river-wharf site within Highcrown where the capital's barge quays mark its inland river trade identity.`

Required future note:

`Static site identity only; no dock operation, cargo inventory, storage, travel service, route topology, trade execution, vendors, prices, services, ownership, NPC staffing, access rules, UI, runtime, rewards, or gameplay behavior.`

Required anchor posture:

- Keep `parentDistrictId: null`.

Knowledge impact:

- No site snippet should be added by activation.
- A later snippet would require a separate site-snippet plan and domain/registry review.

## Candidate review: `palace_terraces`

Current record:

- id: `settlement_site.highcrown.palace_terraces`
- status: `planned`
- parent settlement: `settlement.highcrown`
- parent district: `null`
- site type: `palace`
- current summary: `Planned palace landmark site within Highcrown where terraced palace grounds mark the capital's imperial bluff identity.`
- current source note: Highcrown siteContext explicitly references palace terraces.
- current note: static placed-site identity only; no court service, access control, NPC staffing, ownership, law, UI, or gameplay behavior.

Evidence:

- Highcrown site context says: `Highcrown spans bluffs above the main Sapphire confluence, commanding stone bridges, palace terraces, and the empire's largest market courts.`
- The phrase "palace terraces" directly supports the site as Highcrown-level static place identity.
- No current evidence places the terraces inside `archive_districts` or `market_courts`.
- The tag `court_presence` is descriptive posture only. It is not evidence of Market Courts placement and does not authorize court/law mechanics.

Risk review:

- Palace wording can imply palace access, court/law services, access control, ownership, NPC staffing, quests, rewards, UI, or runtime behavior.
- That risk is controllable if future active wording says only static palace landmark identity and the note explicitly excludes palace access, court/law mechanics, court services, ownership, staffing, access rules, quests, rewards, UI, runtime, and gameplay behavior.

Decision:

Select `settlement_site.highcrown.palace_terraces` for future active-status implementation as static site identity only.

Required future status:

- `active`

Required future summary:

`Static palace landmark site within Highcrown where terraced palace grounds mark the capital's imperial bluff identity.`

Required future note:

`Static site identity only; no palace access, court/law mechanics, court services, ownership, NPC staffing, access rules, quests, rewards, UI, runtime, or gameplay behavior.`

Required anchor posture:

- Keep `parentDistrictId: null`.

Knowledge impact:

- No site snippet should be added by activation.
- A later snippet would require a separate site-snippet plan and domain/registry review.

## Decision outcome

Option A is selected: both current Highcrown site records are safe for later active-status implementation as static site identity while remaining unanchored.

This review selects no district-anchor implementation. It does not change live content. Both records remain planned until a later implementation prompt explicitly authorizes the tiny content edit.

## Future implementation recommendation, if any

Recommended next run:

`Version 0.5.276 - Highcrown Settlement Site Status Activation`

That run may edit only `packages/content/base/world/settlement_sites.json`.

Allowed future content edits:

- change `settlement_site.highcrown.barge_quays.status` from `planned` to `active`;
- replace `settlement_site.highcrown.barge_quays.summary` with the exact selected summary in this review;
- replace `settlement_site.highcrown.barge_quays.notes` with the exact selected note in this review;
- keep `settlement_site.highcrown.barge_quays.parentDistrictId` as `null`;
- change `settlement_site.highcrown.palace_terraces.status` from `planned` to `active`;
- replace `settlement_site.highcrown.palace_terraces.summary` with the exact selected summary in this review;
- replace `settlement_site.highcrown.palace_terraces.notes` with the exact selected note in this review;
- keep `settlement_site.highcrown.palace_terraces.parentDistrictId` as `null`.

Forbidden future changes for that activation run:

- district anchors;
- settlement content;
- district content;
- Knowledge snippets;
- Knowledge registry/domain/trial-policy content;
- Knowledge schemas or validators unless a focused test expectation update is required by the content status change;
- runtime, UI, storage, commands, events, rewards, migrations, save/account behavior;
- route/travel behavior;
- building/workplace/economy behavior;
- court/law behavior;
- vendor/market behavior;
- cargo/storage behavior;
- sacred-site/religious-hotspot behavior;
- gameplay behavior.

## Knowledge snippet impact

Future activation would make each active site technically eligible for later active-only site snippet planning, provided the selected domain also supports `settlement_site` and `world.settlement_sites`.

Activation alone must not add snippets. Site snippet work remains blocked until a separate review selects exact snippet content, checks the domain/registry posture, and preserves static-only boundaries.

## Rejected alternatives

- Activate either site in this review: rejected because this run is docs-only.
- Change `parentDistrictId` for either site: rejected because prior anchor reviews found no direct authored site-to-district evidence.
- Anchor `barge_quays` to `market_courts`: rejected because river trade or commercial proximity is semantic proximity, not district placement evidence.
- Anchor `palace_terraces` to `market_courts`: rejected because `court_presence` and "Market Courts" do not prove palace terrace placement or law/court mechanics.
- Add site Knowledge snippets now: rejected because snippets require active site status and a separate site-snippet plan.
- Align General Lore for `settlement_site` now: rejected because no site snippet is being authored in this review.
- Add dock, cargo, travel, palace, court, service, vendor, storage, NPC, UI, reward, runtime, or gameplay behavior: rejected as out of scope.

## Explicit non-goals

This review does not:

- activate sites;
- change `parentDistrictId`;
- add site snippets;
- add any Knowledge snippets;
- edit Knowledge registry/domain/trial-policy content;
- edit Knowledge schemas or validators;
- edit settlement, district, or site content;
- edit tests;
- edit runtime, UI, storage, commands, events, rewards, migrations, save/account behavior;
- edit route/travel behavior;
- edit building/workplace/economy behavior;
- edit court/law behavior;
- edit vendor/market behavior;
- edit cargo/storage behavior;
- edit sacred-site/religious-hotspot behavior;
- edit gameplay behavior.

## Validation and audit posture

This review should be validated with:

- focused read-only audit of Highcrown settlement, district, and site records;
- focused read-only audit of current Knowledge snippets and General Lore registry posture;
- changed-path scope audit confirming only docs changed;
- `git diff --check`;
- conflict-marker scan on changed files;
- trailing-whitespace scan on changed files;
- normal content lint, if available, to confirm unchanged content still validates.

Expected unchanged live posture after this review:

- both Highcrown districts remain active;
- both Highcrown sites remain planned with `parentDistrictId: null`;
- exactly two live settlement-district Knowledge snippets exist;
- no live settlement-site Knowledge snippets exist;
- General Lore remains active and aligned for current district snippets only;
- direct district/site Knowledge subject support remains active-only;
- no runtime, UI, storage, commands, events, rewards, migrations, save/account, route/travel, building/workplace/economy, court/law, vendor/market, cargo/storage, sacred-site/religious-hotspot, or gameplay behavior changes.

## Next recommended version

`Version 0.5.276 - Highcrown Settlement Site Status Activation`

That run should make the tiny selected content change only if a fresh audit still matches this review.
