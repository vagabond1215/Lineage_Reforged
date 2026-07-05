# Market Courts Boundary Clarification Plan

Source version/run: Version 0.5.269 - Market Courts Boundary Clarification Plan
Date: 2026-07-05
Status: documentation-only boundary clarification; future activation recommended

## 1. Decision Summary

Select a safe static-only interpretation for:

- `settlement_district.highcrown.market_courts`

The current record can be constrained to authored settlement-district identity before a later activation attempt. "Market Courts" should mean named civic-commercial yards or enclosed market courts within Highcrown, not functional market execution, legal court mechanics, trade-system behavior, route/cargo operation, services, NPC staffing, UI, runtime, or gameplay.

This run does not activate `market_courts`, edit settlement/district/site content, add Knowledge snippets, edit Knowledge registry/domain/trial-policy content, edit Knowledge schemas or validators, change tests, or change runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, route/travel systems, building/workplace/economy systems, sacred-site/religious-hotspot content, or gameplay behavior.

Next recommended implementation route:

- `Version 0.5.270 - Settlement District Market Courts Status Activation`

## 2. Current Authority Posture

`world.settlements` remains the canonical settlement identity and broad place authority. `settlement.highcrown` exists and remains current. Its `siteContext` explicitly references "the empire's largest market courts."

Current settlement district authority exists at `packages/content/base/world/settlement_districts.json`:

- `settlement_district.highcrown.archive_districts` is `status: "active"` and keeps active static summary wording.
- `settlement_district.highcrown.market_courts` is `status: "planned"`.

Current settlement site authority exists at `packages/content/base/world/settlement_sites.json`:

- `settlement_site.highcrown.barge_quays` is `status: "planned"` with `parentDistrictId: null`.
- `settlement_site.highcrown.palace_terraces` is `status: "planned"` with `parentDistrictId: null`.

District and site authorities remain static authored place identity only. They do not own vendors, services, stock, prices, taxes, trade execution, economy simulation, route logistics, cargo systems, storage, ownership, court/law mechanics, NPC staffing, access rules, discovery state, UI state, commands, events, rewards, runtime state, or gameplay behavior.

## 3. Current Knowledge Posture

Direct Knowledge subject support exists for:

- `settlement_district`
- `settlement_site`

Knowledge snippet validation remains resolver-backed and active-only for both subject types. `knowledge_domain.general_lore` remains active and includes:

- `settlement_district` in `canonicalSubjectTypes`
- `world.settlement_districts` in `relatedContentCollections`

Exactly one live `settlement_district` Knowledge snippet exists:

- `knowledge_snippet.general_lore.highcrown_archive_districts.identification`

No live `settlement_site` Knowledge snippets exist. No Knowledge snippet exists for:

- `settlement_district.highcrown.market_courts`
- `settlement_site.highcrown.barge_quays`
- `settlement_site.highcrown.palace_terraces`

Because `market_courts` remains planned, it remains ineligible for live public Knowledge snippets.

## 4. Boundary Problem Statement

The prior activation review deferred `market_courts` because the current name, summary, and tags risk implying unfinished systems.

Current record facts:

- id: `settlement_district.highcrown.market_courts`
- current status: `planned`
- parent settlement id: `settlement.highcrown`
- current summary: "Planned market district within Highcrown centered on the capital's largest courts for inland river commerce and imperial trade administration."
- current tags: `market`, `trade`, `barge_commerce`, `imperial_capital`, `river_confluence`
- source authority note: Highcrown `siteContext` explicitly references the empire's largest market courts.

The problem is implication control, not evidence. The record has strong authored Highcrown evidence, but active status must not read as a promise that market, court, trade, barge, route, service, economy, NPC, UI, runtime, or gameplay systems exist.

## 5. Static-Only Boundary Criteria

A later activation is acceptable only under this static interpretation:

- "Market Courts" means an authored named district or quarter identity in Highcrown.
- "Courts" means market yards, courtyards, enclosed trade courts, or civic-commercial plazas, not legal courts or runnable services.
- "Market" describes district identity and historic/civic/economic character, not vendor execution.
- "Trade administration" describes civic identity and imperial recordkeeping context, not active taxation, contracts, or economy systems.
- "Barge commerce" remains descriptive context only and does not activate `barge_quays`, routes, cargo, storage, docks, travel, or logistics.
- Existing behavior-exclusion notes should be expanded in the future activation run to make the boundary explicit.
- Future active status must not create discovery state, Knowledge progress, unlocks, UI markers, runtime state, rewards, commands, services, access rules, storage behavior, economy behavior, court behavior, or gameplay behavior.

## 6. Candidate Wording Audit

### Option A

Candidate:

`Market court districts within Highcrown where enclosed commercial yards and imperial trade offices shape the capital's civic identity without representing active vendors, prices, services, or trade execution.`

- removes stale planned-status wording: yes.
- preserves source evidence: yes, but "trade offices" adds a sharper institutional image than the current source proves.
- avoids vendor/price/stock/service implications: mostly; it explicitly excludes vendors, prices, services, and trade execution but does not name stock.
- avoids law/court mechanics: partially; "market court" helps, but "courts" still needs note-level clarification.
- avoids route/cargo/storage implications: partially; it does not mention river/barge context, but does not explicitly exclude cargo/storage.
- avoids activation of sites: yes, because it does not mention `barge_quays` or `palace_terraces`.
- suitable for future activation: revise.
- should change notes or only summary: summary plus clarified note.
- decision: revise. Useful exclusions, but the summary is too defensive and "trade offices" may imply services or staffing.

### Option B

Candidate:

`Static market-court districts within Highcrown where river commerce, trade recordkeeping, and imperial civic identity shape the capital's commercial quarters.`

- removes stale planned-status wording: yes.
- preserves source evidence: yes; it keeps market courts, river commerce, trade administration through recordkeeping, and imperial capital identity.
- avoids vendor/price/stock/service implications: mostly, but the note must carry explicit exclusions.
- avoids law/court mechanics: mostly if "market-court" is defined as a civic-commercial yard, not a legal court.
- avoids route/cargo/storage implications: mostly, but "river commerce" requires note-level route/cargo/storage exclusions.
- avoids activation of sites: yes, because it does not mention `barge_quays` or `palace_terraces`.
- suitable for future activation: revise and accept.
- should change notes or only summary: summary plus clarified note.
- decision: accept with revision. Preferred future summary:

`Static market-court district within Highcrown where enclosed commercial yards, imperial trade recordkeeping, and river-confluence identity shape the capital's civic-commercial quarters.`

### Option C

Candidate:

`Commercial court districts within Highcrown where market yards and imperial trade recordkeeping shape the capital's river-confluence identity.`

- removes stale planned-status wording: yes.
- preserves source evidence: yes, though it drops the direct "market courts" phrase.
- avoids vendor/price/stock/service implications: mostly, but less explicit than Option A.
- avoids law/court mechanics: partially; "Commercial court" could still be read as a legal/commercial tribunal.
- avoids route/cargo/storage implications: mostly; "river-confluence identity" is safer than "river commerce."
- avoids activation of sites: yes.
- suitable for future activation: revise, but weaker than revised Option B.
- should change notes or only summary: summary plus clarified note.
- decision: reject in favor of revised Option B. It is safe enough, but losing "market courts" weakens source continuity while "commercial court" still carries legal ambiguity.

### Option D

Candidate:

Defer wording because no concise static-only wording safely avoids market/economy/court/route implications.

- removes stale planned-status wording: no.
- preserves source evidence: no implementation wording selected.
- avoids vendor/price/stock/service implications: yes by deferral only.
- avoids law/court mechanics: yes by deferral only.
- avoids route/cargo/storage implications: yes by deferral only.
- avoids activation of sites: yes.
- suitable for future activation: no.
- should change notes or only summary: neither.
- decision: reject. Revised Option B gives a clear static district wording with note-level exclusions.

## 7. Term-by-Term Clarification

`Market Courts`

- allowed static meaning: named Highcrown civic-commercial district made of enclosed market yards, court-like plazas, and recordkeeping context.
- forbidden runtime/gameplay implication: no market UI, vendor access, prices, stock, services, legal court behavior, hearings, quests, rewards, runtime state, or gameplay.

`market`

- allowed static meaning: district character associated with commerce, exchange history, public yards, and civic identity.
- forbidden runtime/gameplay implication: no vendors, vendor stock, prices, transactions, taxes, market simulation, services, player trading, UI, or economy execution.

`courts`

- allowed static meaning: physical courtyards, enclosed yards, civic-commercial plazas, or court-shaped market spaces.
- forbidden runtime/gameplay implication: no legal courts, judges, hearings, lawsuits, civic-service execution, access rules, NPC staffing, quests, judgments, law effects, or gameplay.

`trade`

- allowed static meaning: authored contextual identity around Highcrown's role as an imperial commerce and recordkeeping center.
- forbidden runtime/gameplay implication: no trade contracts, trade routes, market prices, inventory mutation, tax collection, economy simulation, vendor services, or gameplay.

`barge_commerce`

- allowed static meaning: descriptive tag tying Highcrown's commercial identity to river-confluence and barge-facing civic context.
- forbidden runtime/gameplay implication: no `barge_quays` activation, route topology, cargo, dock operation, storage, travel services, pathfinding, logistics execution, or active site authority.

`imperial trade administration`

- allowed static meaning: civic identity and imperial recordkeeping context around trade records and public administration.
- forbidden runtime/gameplay implication: no tax systems, contract systems, permits, legal services, NPC staffing, offices with runnable services, bureaucracy UI, commands, rewards, or economy behavior.

`river_confluence`

- allowed static meaning: place-role context for Highcrown's river-adjacent civic-commercial identity.
- forbidden runtime/gameplay implication: no route/travel topology, cargo movement, port/dock operation, pathfinding, storage, service access, map marker, or travel behavior.

## 8. Selected Static Interpretation, If Any

Selected interpretation:

`settlement_district.highcrown.market_courts` can become active later as static authored district identity only.

The safe meaning is a named Highcrown district of enclosed commercial yards and civic-commercial plazas where imperial trade recordkeeping shapes public identity. This interpretation preserves the Highcrown source evidence while preventing "market," "courts," "trade," and "barge commerce" from becoming executable systems.

Selected future replacement summary:

`Static market-court district within Highcrown where enclosed commercial yards, imperial trade recordkeeping, and river-confluence identity shape the capital's civic-commercial quarters.`

Selected future replacement note:

`Static district identity only; no vendors, stock, prices, services, taxes, trade execution, law/court mechanics, cargo/storage, ownership, NPC staffing, access rules, route topology, quests, rewards, UI, runtime, or gameplay behavior.`

## 9. Future Content Wording Recommendation

A later activation run should replace only the `market_courts` summary with:

`Static market-court district within Highcrown where enclosed commercial yards, imperial trade recordkeeping, and river-confluence identity shape the capital's civic-commercial quarters.`

The existing note should be replaced only if the activation run stays scoped to the same record:

Current note:

`Static district identity only; no prices, stock, vendors, services, taxes, ownership, route topology, UI, or gameplay behavior.`

Recommended future note:

`Static district identity only; no vendors, stock, prices, services, taxes, trade execution, law/court mechanics, cargo/storage, ownership, NPC staffing, access rules, route topology, quests, rewards, UI, runtime, or gameplay behavior.`

The note change is recommended because the current note omits law/court mechanics, trade execution, cargo/storage, NPC staffing, access rules, quests, rewards, and runtime behavior. Those omissions are exactly the implication risks that blocked the prior activation review.

Do not apply either wording change in this run.

## 10. Future Activation Recommendation

Next version should be:

`Version 0.5.270 - Settlement District Market Courts Status Activation`

That future activation may:

- edit only `packages/content/base/world/settlement_districts.json`;
- change only `settlement_district.highcrown.market_courts` from `status: "planned"` to `status: "active"`;
- replace only the selected summary wording;
- optionally replace only the selected notes entry;
- preserve id, slug, name, aliases, parent settlement id, district type, functional tags, place-role tags, and source authority notes;
- keep `settlement_district.highcrown.archive_districts` active and unchanged;
- keep `settlement_site.highcrown.barge_quays` planned with `parentDistrictId: null`;
- keep `settlement_site.highcrown.palace_terraces` planned with `parentDistrictId: null`;
- add no Knowledge snippets;
- edit no Knowledge registry/domain/trial-policy content;
- edit no Knowledge schemas or validators;
- change no runtime, UI, storage, commands, events, rewards, migrations, save/account, route/travel, building/workplace/economy, sacred-site/religious-hotspot, or gameplay behavior.

## 11. Knowledge Snippet Impact

Direct `settlement_district` Knowledge subject support exists.

General Lore already advertises:

- `settlement_district`
- `world.settlement_districts`

`market_courts` remains ineligible for live Knowledge snippets while planned. If later activated, `market_courts` would become eligible for a separate future Knowledge snippet seed plan. Activation alone must not add a snippet.

This boundary clarification run adds no snippets. It does not add site snippets, route/travel snippets, building/workplace/economy snippets, or parent settlement snippets. It does not change General Lore registry alignment. It does not edit Knowledge schema or validator files.

Any future `market_courts` snippet should require a separate plan and must preserve the same static-only exclusions.

## 12. Rejected Interpretations

Rejected:

- treating "Market Courts" as active vendor or service infrastructure;
- treating "market" as stock, prices, vendors, transactions, taxes, market UI, or economy simulation;
- treating "courts" as law/court mechanics, hearings, judges, legal services, access rules, or civic service execution;
- treating "trade administration" as tax, contract, economy, permit, or service execution;
- treating `barge_commerce` as route/travel/cargo/storage activation;
- using `market_courts` activation to activate `barge_quays`;
- using `market_courts` activation to activate `palace_terraces`;
- adding a `market_courts` Knowledge snippet now;
- adding site snippets now;
- changing schema or validator behavior;
- changing runtime or gameplay behavior.

## 13. Explicit Non-Goals

- no `market_courts` activation in this run;
- no archive district evaluation or edits;
- no `barge_quays` or `palace_terraces` activation;
- no parent settlement snippets;
- no site snippets;
- no route/travel snippets;
- no building/workplace/economy snippets;
- no sacred-site or religious-hotspot snippets;
- no Knowledge registry/domain/trial-policy edits;
- no Knowledge schema or validator edits;
- no settlement, district, or site content edits;
- no tests changed;
- no runtime, UI, storage, command, event, reward, migration, save/account, route/travel, building/workplace/economy, sacred-site/religious-hotspot, or gameplay behavior;
- no transition to `0.6.0`.

## 14. Validation And Audit Posture

This docs-only run should verify:

- changed paths are docs-only;
- `settlement_district.highcrown.archive_districts` remains active and keeps active static summary wording;
- `settlement_district.highcrown.market_courts` remains planned;
- `settlement_districts.json` is unchanged by this run;
- `settlement_site.highcrown.barge_quays` remains planned with `parentDistrictId: null`;
- `settlement_site.highcrown.palace_terraces` remains planned with `parentDistrictId: null`;
- `settlement_sites.json` is unchanged by this run;
- exactly one live `settlement_district` Knowledge snippet exists;
- its id remains `knowledge_snippet.general_lore.highcrown_archive_districts.identification`;
- no live `settlement_site` Knowledge snippets exist;
- no `market_courts` snippet exists;
- `knowledge_domain.general_lore` remains active;
- General Lore still includes `settlement_district`;
- General Lore still includes `world.settlement_districts`;
- Knowledge registry/domain content is unchanged by this run;
- direct `settlement_district` and `settlement_site` support remains present in Knowledge schemas and validators;
- Knowledge schema and validator files are unchanged by this run;
- no content/schema/validator/test/runtime/UI/storage/command/event/reward/migration/gameplay paths changed;
- `git diff --check` passes;
- conflict-marker and trailing-whitespace scans pass on changed files.

Focused tests are optional for this docs-only run. If run, prefer:

- `node --test tests\unit\knowledge-snippets-validation.test.mjs`
- `node --test tests\unit\knowledge-domain-registry-validation.test.mjs`
- `node --test tests\unit\settlement-district-validation.test.mjs`
- `node --test tests\unit\settlement-site-validation.test.mjs`
- `node --test tests\unit\schema-files.test.mjs`
- `npm.cmd run tool:content-lint`

## 15. Next Recommended Version

`Version 0.5.270 - Settlement District Market Courts Status Activation`

That run should implement only the selected `market_courts` status, summary, and optional note cleanup in `packages/content/base/world/settlement_districts.json`, add no Knowledge snippets, preserve the sites as planned with `parentDistrictId: null`, and keep every runtime, schema, validator, registry, test, UI, storage, command, event, reward, migration, route/travel, building/workplace/economy, sacred-site/religious-hotspot, and gameplay boundary unchanged.
