# Settlement District Market Courts Activation Review

Source version/run: Version 0.5.268 - Settlement District Market Courts Activation Review
Date: 2026-07-04
Status: documentation-only activation review; activation deferred

## 1. Decision Summary

Defer later active-status implementation for:

- `settlement_district.highcrown.market_courts`

The record remains valid planned static district authority, but this review does not select it for activation. Its current name, summary, and tags still carry unresolved market, trade, court, barge-commerce, service, route, cargo, economy, tax, law, NPC, UI, and gameplay implications. A later boundary clarification pass should first tighten the static-only meaning before activation is reconsidered.

This run does not activate records, add Knowledge snippets, edit Knowledge registry/domain/trial-policy content, edit Knowledge schemas or validators, edit settlement/district/site content, change tests, or change runtime, UI, storage, command, event, reward, migration, save/account, route/travel, building/workplace/economy, sacred-site/religious-hotspot, or gameplay behavior.

## 2. Current Authority Posture

`world.settlements` remains the canonical settlement identity and broad place authority. `settlement.highcrown` exists and remains current. Its summary references "archive districts" and "barge quays"; its `siteContext` references "palace terraces" and "the empire's largest market courts."

Current settlement district authority exists at `packages/content/base/world/settlement_districts.json`:

- `settlement_district.highcrown.archive_districts` is `status: "active"` and has active static summary wording.
- `settlement_district.highcrown.market_courts` is `status: "planned"`.

Current settlement site authority exists at `packages/content/base/world/settlement_sites.json`:

- `settlement_site.highcrown.barge_quays` is `status: "planned"` with `parentDistrictId: null`.
- `settlement_site.highcrown.palace_terraces` is `status: "planned"` with `parentDistrictId: null`.

District and site authorities remain static authored place identity only. They do not own vendors, services, stock, prices, taxes, trade execution, economy simulation, route logistics, cargo systems, storage, ownership, court/law mechanics, NPC staffing, access rules, discovery state, UI state, commands, events, rewards, runtime state, or gameplay behavior.

## 3. Current Knowledge Posture

Direct Knowledge subject support exists for:

- `settlement_district`
- `settlement_site`

Knowledge snippet validation remains resolver-backed and active-only for both subject types. `knowledge_domain.general_lore` remains active and, after `Version 0.5.267`, includes:

- `settlement_district` in `canonicalSubjectTypes`
- `world.settlement_districts` in `relatedContentCollections`

Exactly one live `settlement_district` Knowledge snippet exists:

- `knowledge_snippet.general_lore.highcrown_archive_districts.identification`

No live `settlement_site` Knowledge snippets exist. No Knowledge snippets exist for:

- `settlement_district.highcrown.market_courts`
- `settlement_site.highcrown.barge_quays`
- `settlement_site.highcrown.palace_terraces`

Because `market_courts` remains planned, it remains ineligible for live public Knowledge snippets.

## 4. Market Courts Activation Threshold

`settlement_district.highcrown.market_courts` may be selected for later active status only if a review can prove all of the following:

- the parent settlement exists and is current;
- the record has direct authored evidence in existing Highcrown content or district planning docs;
- the record can remain static district authority only;
- active status will not imply vendors, stock, prices, taxes, market UI, trade execution, economy simulation, services, ownership, route logistics, cargo systems, law/court mechanics, NPC staffing, access rules, quests, rewards, runtime state, or gameplay behavior;
- active status will not imply that `barge_quays`, `palace_terraces`, route/travel systems, cargo/storage systems, trade systems, or service systems are active;
- active status would be safe under the active-only Knowledge subject policy;
- any later Knowledge snippet would require a separate snippet seed plan and safe wording.

The first two requirements are satisfied. The static-only implication requirements are not yet sufficiently bounded.

## 5. Candidate Audit Method

This review audited:

- current workflow handoffs and roadmap/sequence docs;
- the prior district/site authority, seed, Knowledge subject, activation, and snippet plans;
- live settlement, settlement-district, settlement-site, Knowledge domain, Knowledge registry, Knowledge snippet, and Knowledge trial-policy content;
- Knowledge snippet schema and registry schema subject vocabulary;
- Knowledge snippet, settlement district, settlement site, and normal content-lint validator surfaces;
- focused unit test posture for district/site Knowledge references and active-only eligibility.

The review evaluated only:

- `settlement_district.highcrown.market_courts`

It did not evaluate activation or snippet authoring for the archive district, sites, parent settlement snippets, route/travel snippets, building/workplace/economy snippets, sacred-site snippets, or religious-hotspot snippets.

## 6. Candidate Review

Candidate:

- id: `settlement_district.highcrown.market_courts`
- current status: `planned`
- parent settlement id: `settlement.highcrown`
- evidence source: Highcrown `siteContext` explicitly references "the empire's largest market courts"; `docs/design/first-settlement-district-content-seed-plan.md` selected it as a planned market district candidate.
- evidence strength: strong for existence as authored Highcrown district identity.
- current summary: "Planned market district within Highcrown centered on the capital's largest courts for inland river commerce and imperial trade administration."
- current tags: `market`, `trade`, `barge_commerce`, `imperial_capital`, `river_confluence`
- stable static district identity: partially. The name and evidence support a district identity, but the current wording and tags still sit directly beside unfinished economy, trade, court, service, cargo, and route meanings.
- what active status would mean: the Market Courts are accepted as current static authored district identity under Highcrown.
- what active status must not imply: no functional markets, vendors, stock, prices, taxes, market UI, trade execution, economy simulation, services, ownership, law/court mechanics, court hearings, administrative services, NPC staffing, access rules, route logistics, cargo systems, storage, quests, rewards, runtime state, or gameplay behavior.
- unfinished-system dependency risk: high. The current summary and tags use market, trade, barge commerce, courts, inland river commerce, and imperial trade administration terms that can imply unfinished market/economy/service/court/trade/route/cargo systems unless a narrower static-only boundary is added first.
- planned-wording cleanup needed: yes. The summary begins with "Planned..." and would need cleanup before or during any future activation.
- future Knowledge eligibility: if later activated, it would become eligible for separate direct `settlement_district` Knowledge snippet planning, but only after a future snippet plan proves wording that avoids market, service, trade, court, and economy promises.
- decision: defer.
- reason: the record has direct evidence, but active status remains too likely to imply unfinished functional systems. A smaller boundary clarification pass should first decide the safe static wording and exclusion language.

## 7. Decision Outcome

`settlement_district.highcrown.market_courts` remains planned.

This is not a rejection of the district. It remains a valid planned Highcrown district authority record. The blocker is activation clarity: the current content does not yet cleanly separate "Market Courts" as static district identity from market operation, vendors, prices, taxation, trade execution, court/law mechanics, route logistics, cargo handling, services, NPC staffing, UI, and gameplay expectations.

## 8. If Selected: Future Activation Implementation Plan

Not selected in this run.

If a future clarification pass selects `market_courts`, the later activation implementation should be tiny and may:

- edit only `packages/content/base/world/settlement_districts.json`;
- change only `settlement_district.highcrown.market_courts` from `status: "planned"` to `status: "active"`;
- change only its summary wording from planned-status language to static active wording if required;
- preserve id, slug, name, aliases, parent settlement, district type, tags, source notes, and behavior-exclusion notes unless a tiny text clarification is required;
- leave both site records planned with `parentDistrictId: null`;
- add no Knowledge snippets;
- change no Knowledge schemas, validators, registry/domain/trial-policy content, runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, route/travel, building/workplace/economy, sacred-site/religious-hotspot, or gameplay files;
- run settlement district validation, settlement site validation, Knowledge snippet validation, schema-files test, normal content lint, and scope audits.

## 9. If Deferred: Follow-Up Requirements

Next recommended route:

- `Version 0.5.269 - Market Courts Boundary Clarification Plan`

That docs-first follow-up should clarify static district identity boundaries before activation is reconsidered. It should decide:

- whether "Market Courts" can be described as civic-place identity without implying functional markets, vendors, prices, stock, taxation, trade execution, market UI, or economy simulation;
- whether "courts" means market yards/courtyards only, or whether the term risks law/court mechanics and administrative hearings;
- whether `barge_commerce`, inland river commerce, and river-confluence framing can remain descriptive without implying active route/travel, cargo, dock operation, storage, or logistics systems;
- whether the current summary should be rewritten before any activation to remove "Planned..." and reinforce static-only meaning;
- whether current notes need a clearer exclusion of law/court mechanics, route logistics, cargo/storage behavior, NPC staffing, access rules, services, quests, rewards, runtime, UI, and gameplay behavior.

The clarification plan should remain docs-only unless a later prompt explicitly scopes content edits.

## 10. Knowledge Snippet Impact

Direct `settlement_district` Knowledge subject support exists.

General Lore already advertises `settlement_district` and `world.settlement_districts` after `Version 0.5.267`.

`market_courts` remains ineligible for live snippets while planned. If later activated, it would become eligible for a separate future Knowledge snippet seed plan, but activation alone would not add snippets. Any future snippet must use safe static wording and must not imply functional markets, vendors, prices, stock, taxes, market UI, trade execution, economy simulation, services, courts-as-law mechanics, route logistics, cargo/storage behavior, NPC staffing, access rules, quests, rewards, runtime state, or gameplay behavior.

This run adds no `market_courts` snippet, no site snippets, and no General Lore registry changes.

## 11. Explicit Non-Goals

- no `market_courts` activation;
- no archive district activation review or snippet change;
- no `barge_quays` or `palace_terraces` activation review;
- no site snippets;
- no parent settlement snippets;
- no route/travel snippets;
- no building/workplace/economy snippets;
- no sacred-site or religious-hotspot snippets;
- no Knowledge registry/domain/trial-policy edits;
- no Knowledge schema or validator edits;
- no settlement, district, or site content edits;
- no tests changed;
- no runtime, UI, storage, command, event, reward, migration, save/account, route/travel, building/workplace/economy, sacred-site/religious-hotspot, or gameplay behavior;
- no vendors, stock, prices, taxes, market UI, trade execution, economy simulation, services, ownership, law/court mechanics, route logistics, cargo/storage behavior, NPC staffing, access rules, quests, rewards, discovery state, or gameplay promises;
- no transition to `0.6.0`.

## 12. Validation And Audit Posture

This docs-only run should verify:

- changed paths are docs-only;
- `settlement_district.highcrown.archive_districts` remains active and keeps active static summary wording;
- `settlement_district.highcrown.market_courts` remains planned;
- `settlement_districts.json` is unchanged by this run;
- `settlement_site.highcrown.barge_quays` remains planned with `parentDistrictId: null`;
- `settlement_site.highcrown.palace_terraces` remains planned with `parentDistrictId: null`;
- `settlement_sites.json` is unchanged by this run;
- exactly one live `settlement_district` Knowledge snippet exists;
- no live `settlement_site` Knowledge snippets exist;
- no `market_courts` snippet exists;
- Knowledge snippets, registry/domain content, trial policies, schemas, validators, focused tests, content files, runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, route/travel, building/workplace/economy, sacred-site/religious-hotspot, and gameplay files are unchanged;
- `git diff --check` passes;
- conflict-marker and trailing-whitespace scans pass on changed files.

Focused tests are optional for this docs-only run. If run, prefer:

- `node --test tests\unit\knowledge-snippets-validation.test.mjs`
- `node --test tests\unit\knowledge-domain-registry-validation.test.mjs`
- `node --test tests\unit\settlement-district-validation.test.mjs`
- `node --test tests\unit\settlement-site-validation.test.mjs`
- `node --test tests\unit\schema-files.test.mjs`
- `npm.cmd run tool:content-lint`

## 13. Next Recommended Version

`Version 0.5.269 - Market Courts Boundary Clarification Plan`

That run should remain docs-first and should decide whether a static-only activation wording exists for `settlement_district.highcrown.market_courts` before any content status change is attempted.
