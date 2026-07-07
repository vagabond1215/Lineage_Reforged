# Highcrown Settlement Knowledge Lane Closure Review

Source version/run: Version 0.5.285 - Highcrown Settlement Knowledge Lane Closure Review
Date: 2026-07-07

## 1. Decision summary

Option A selected: close the Highcrown settlement Knowledge lane.

The fresh audit confirms that parent settlement, district, and site General Lore coverage is complete for the current Highcrown settlement/district/site lane. Exactly five Highcrown settlement-related General Lore snippets exist: one parent `settlement` snippet, two `settlement_district` snippets, and two `settlement_site` snippets.

This review adds no snippets and changes no content, schema, validator, test, runtime, UI, storage, command, event, reward, migration, save/account, route/travel, economy, service, resource, combat, sacred-site, religious-hotspot, or gameplay behavior.

## 2. Current versioning posture

Latest completed primary before this run:

- `Version 0.5.284 - Highcrown Settlement Knowledge Snippet Seed`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Current run:

- `Version 0.5.285 - Highcrown Settlement Knowledge Lane Closure Review`

Next primary route selected by this review:

- `Version 0.5.286 - Service Resource Combat Boundary Queue Review`

Three-segment versions remain primary roadmap versions. Four-segment versions remain support-run suffixes and do not consume primary roadmap slots.

## 3. Current Highcrown settlement authority posture

`settlement.highcrown` exists in `packages/content/base/world/settlements.json`.

Current settlement identity evidence:

- name: Highcrown
- summary: `Valtherion's imperial river capital, where crown roads, archive districts, and barge quays govern the richest continent on the map.`
- site context: `Highcrown spans bluffs above the main Sapphire confluence, commanding stone bridges, palace terraces, and the empire's largest market courts.`

Settlement records still do not use active/planned status semantics. Direct settlement Knowledge references are therefore existence-backed, not active-only.

## 4. Current Highcrown district and site authority posture

Current active Highcrown district records:

- `settlement_district.highcrown.archive_districts`
- `settlement_district.highcrown.market_courts`

Current active Highcrown site records:

- `settlement_site.highcrown.barge_quays`, with `parentDistrictId: null`
- `settlement_site.highcrown.palace_terraces`, with `parentDistrictId: null`

The null site anchors remain valid. The prior anchor decisions remain controlling: current evidence supports Highcrown-level site identity, not placement inside Archive Districts or Market Courts.

## 5. Current General Lore domain/registry posture

`knowledge_domain.general_lore` currently supports the needed registry alignment:

- `settlement`
- `settlement_district`
- `settlement_site`
- `world.settlements`
- `world.settlement_districts`
- `world.settlement_sites`
- `identification`
- `book_study`

General Lore trial, completion, and visibility policy refs remain `null`.

No Knowledge registry, domain, or trial-policy content needs further change for this lane.

## 6. Current settlement subject validator posture

Direct `settlement` Knowledge snippet subject validation is supported through explicit `world.settlements` subject authority.

Normal content lint passes:

- `collectionId: "world.settlements"`
- `idPrefix: "settlement."`
- one-segment settlement id pattern
- live `settlementWrapper.records`

`settlement` is not in the first-validator blocked subject set. `settlement` is not in the active-only subject policy. `settlement_district` and `settlement_site` remain active-only.

Schemas include `settlement`, `settlement_district`, and `settlement_site` subject vocabulary.

## 7. Current Highcrown Knowledge snippet posture

Exactly five Highcrown settlement-related General Lore snippets exist:

- `knowledge_snippet.general_lore.highcrown.identification`
- `knowledge_snippet.general_lore.highcrown_archive_districts.identification`
- `knowledge_snippet.general_lore.highcrown_market_courts.identification`
- `knowledge_snippet.general_lore.highcrown_barge_quays.identification`
- `knowledge_snippet.general_lore.highcrown_palace_terraces.identification`

The split is:

- one direct `settlement` snippet for `settlement.highcrown`
- two direct `settlement_district` snippets
- two direct `settlement_site` snippets

All five are Tier 1 `identification` snippets using `book_study` with `sourceId: null`.

## 8. Lane closure standard

The Highcrown settlement Knowledge lane may close only if all of these are true:

- parent settlement authority exists for `settlement.highcrown`;
- direct `settlement` Knowledge subject validation is supported;
- General Lore supports `settlement` and `world.settlements`;
- parent settlement snippet exists for `settlement.highcrown`;
- both active Highcrown district records have direct snippets;
- both active Highcrown site records have direct snippets;
- site snippets preserve `parentDistrictId: null` where authority evidence does not anchor them to districts;
- all snippets are Tier 1 `identification` General Lore snippets;
- all snippets use `book_study` with `sourceId: null`;
- all snippets have static authored place/settlement identity wording only;
- all snippets avoid implying access, services, vendors, prices, trade execution, route/travel, dock operation, cargo inventory, storage, palace access, court/law mechanics, ownership, NPC staffing, UI, runtime, rewards, unlocks, discovery state, Knowledge progress state, or gameplay behavior;
- Knowledge registry/domain/trial-policy content does not need further change for this lane;
- schemas and validators do not need further change for this lane;
- no settlement/district/site content or anchor changes are needed for this lane;
- focused tests and content lint pass.

The audit confirms every requirement is met.

## 9. Parent settlement snippet review

`knowledge_snippet.general_lore.highcrown.identification` correctly uses `subjectType: "settlement"` and `subjectId: "settlement.highcrown"`.

It identifies Highcrown as Valtherion's imperial river capital and contextualizes crown roads, archive districts, barge quays, palace terraces, and market courts as static settlement identity. Its note explicitly blocks settlement access, services, vendors, prices, trade execution, travel routes, dock operation, cargo inventory, storage, palace access, court/law mechanics, ownership, NPC staffing, access rules, UI, runtime, rewards, and gameplay behavior.

Closure result: complete.

## 10. District snippet review

`knowledge_snippet.general_lore.highcrown_archive_districts.identification` correctly references active `settlement_district.highcrown.archive_districts`. It identifies civic recordkeeping district identity without granting archive access, record browsing, Knowledge unlocks, storage, services, NPC staffing, UI, rewards, runtime, or gameplay behavior.

`knowledge_snippet.general_lore.highcrown_market_courts.identification` correctly references active `settlement_district.highcrown.market_courts`. It identifies civic-commercial district identity without granting vendors, stock, prices, services, taxes, trade execution, law/court mechanics, cargo/storage, ownership, NPC staffing, access rules, route topology, quests, rewards, UI, runtime, or gameplay behavior.

Closure result: complete.

## 11. Site snippet review

`knowledge_snippet.general_lore.highcrown_barge_quays.identification` correctly references active `settlement_site.highcrown.barge_quays`. The site authority remains `parentDistrictId: null`, and the snippet identifies river-wharf site identity without granting dock operation, cargo inventory, storage, travel service, route topology, trade execution, vendors, prices, services, ownership, NPC staffing, access rules, UI, runtime, rewards, or gameplay behavior.

`knowledge_snippet.general_lore.highcrown_palace_terraces.identification` correctly references active `settlement_site.highcrown.palace_terraces`. The site authority remains `parentDistrictId: null`, and the snippet identifies palace landmark identity without granting palace access, court/law mechanics, court services, ownership, NPC staffing, access rules, quests, rewards, UI, runtime, or gameplay behavior.

Closure result: complete.

## 12. Coverage and coherence matrix

| Layer | Authority id | Authority status/posture | Snippet id | Subject type | Source | Static-only boundary | Closure result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Parent settlement | `settlement.highcrown` | Present; existence-backed; no settlement status field | `knowledge_snippet.general_lore.highcrown.identification` | `settlement` | `book_study`, `sourceId: null` | Static settlement identity only; no access, services, travel, trade, courts, storage, UI, runtime, rewards, or gameplay | Closed |
| District | `settlement_district.highcrown.archive_districts` | Active static district identity | `knowledge_snippet.general_lore.highcrown_archive_districts.identification` | `settlement_district` | `book_study`, `sourceId: null` | Static archive district identity only; no archive access, services, storage, UI, rewards, runtime, or gameplay | Closed |
| District | `settlement_district.highcrown.market_courts` | Active static district identity | `knowledge_snippet.general_lore.highcrown_market_courts.identification` | `settlement_district` | `book_study`, `sourceId: null` | Static market-court district identity only; no vendors, prices, trade, law/court mechanics, cargo/storage, UI, runtime, or gameplay | Closed |
| Site | `settlement_site.highcrown.barge_quays` | Active static site identity; `parentDistrictId: null` | `knowledge_snippet.general_lore.highcrown_barge_quays.identification` | `settlement_site` | `book_study`, `sourceId: null` | Static river-wharf identity only; no dock operation, cargo inventory, storage, travel, trade, services, UI, runtime, or gameplay | Closed |
| Site | `settlement_site.highcrown.palace_terraces` | Active static site identity; `parentDistrictId: null` | `knowledge_snippet.general_lore.highcrown_palace_terraces.identification` | `settlement_site` | `book_study`, `sourceId: null` | Static palace landmark identity only; no palace access, court/law mechanics, services, quests, UI, runtime, or gameplay | Closed |

## 13. Remaining non-Knowledge boundaries

Closing this Knowledge lane does not implement or authorize:

- settlement access;
- services;
- vendors;
- prices;
- trade execution;
- route/travel behavior;
- dock operation;
- cargo inventory;
- storage;
- palace access;
- court/law mechanics;
- ownership;
- NPC staffing;
- access rules;
- UI;
- runtime behavior;
- rewards;
- unlocks;
- discovery state;
- Knowledge progress state;
- service content;
- resource content;
- combat content;
- gameplay behavior.

Future work should move to a broader service/resource/combat boundary queue review, not additional Highcrown place Knowledge snippets.

## 14. Rejected alternatives

- Leave the lane open for more Highcrown place snippets: rejected because the current parent, district, and site coverage is complete for the active authored authority set.
- Add more snippets now: rejected because this run is docs-only and the closure standard is already met.
- Edit Knowledge registry/domain/trial-policy content: rejected because General Lore already advertises the required subjects, collections, category, source type, and null-policy posture.
- Edit schemas or validators: rejected because direct settlement support, active-only district/site support, and subject vocabulary are already in place.
- Change settlement, district, or site content: rejected because authority posture already supports closure.
- Change site anchors: rejected because `parentDistrictId: null` remains the correct evidence-backed posture.
- Move directly to service/resource/combat implementation: rejected because the next route should be a docs-first queue review before any later implementation.

## 15. Explicit non-goals

This review does not add snippets, edit Knowledge registry/domain/trial-policy content, edit Knowledge schemas or validators, edit tests, edit settlement/district/site content, change site anchors, or change runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, route/travel systems, building/workplace/economy systems, court/law systems, vendor/market systems, cargo/storage systems, service content, resource content, combat content, sacred-site/religious-hotspot content, or gameplay behavior.

## 16. Validation and audit posture

Read-only audits confirmed:

- latest completed primary before this run is `Version 0.5.284 - Highcrown Settlement Knowledge Snippet Seed`;
- latest support/audit run remains `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`;
- `settlement.highcrown` exists and settlement records still do not use active/planned status semantics;
- both Highcrown district records remain active;
- both Highcrown site records remain active with `parentDistrictId: null`;
- exactly five Highcrown settlement-related General Lore snippets exist;
- all five snippets are Tier 1 `identification` snippets;
- all five snippets use `book_study` with `sourceId: null`;
- General Lore supports `settlement`, `settlement_district`, `settlement_site`, `world.settlements`, `world.settlement_districts`, `world.settlement_sites`, `identification`, and `book_study`;
- General Lore policy refs remain `null`;
- schema vocabulary includes `settlement`, `settlement_district`, and `settlement_site`;
- normal content lint passes direct `settlement` into subject authorities;
- direct settlement references remain existence-backed;
- district/site active-only semantics remain unchanged;
- focused tests expect the current five Highcrown settlement-related snippets.

Validation commands run:

- `node --test tests\unit\knowledge-snippets-validation.test.mjs`
- `node --test tests\unit\knowledge-domain-registry-validation.test.mjs`
- `node --test tests\unit\schema-files.test.mjs`
- `npm.cmd run tool:content-lint`
- `git diff --check`
- conflict-marker scan on changed files
- trailing-whitespace scan on changed files
- changed-path scope audit

## 17. Next recommended version

Version 0.5.286 - Service Resource Combat Boundary Queue Review

That run should be docs-first. It may review and order later service/resource/combat boundary work after the Highcrown settlement Knowledge lane is closed. It must not add content, edit Knowledge registry/domain/trial-policy content, edit schemas or validators, change settlement/district/site content, change anchors, add route/travel-building-workplace-economy-court-law-vendor-market-cargo-storage-sacred-site-religious-hotspot content, or change runtime/UI/storage/commands/events/rewards/migrations/save-account/gameplay behavior unless a later focused implementation prompt explicitly scopes that work.
