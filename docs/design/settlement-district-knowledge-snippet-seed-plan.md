# Settlement District Knowledge Snippet Seed Plan

Source version/run: Version 0.5.265 - Settlement District Knowledge Snippet Seed Plan
Date: 2026-07-04
Status: approved documentation-only snippet seed decision; no snippet implementation

## 1. Decision Summary

Select exactly one future public Knowledge snippet candidate:

- `subjectType: "settlement_district"`
- `subjectId: "settlement_district.highcrown.archive_districts"`
- preferred domain: `knowledge_domain.general_lore`
- category: `identification`
- discovery source type: `book_study`

Do not add the snippet in this run.

The selected future snippet is safe only as static authored place knowledge. It must not imply archive access, record browsing, Knowledge unlocks, storage inventories, bureaucracy services, NPC staffing, law/court behavior, quest hooks, UI markers, discovery state, rewards, commands, runtime state, or gameplay effects.

The future snippet seed requires a registry alignment step before or with snippet authoring: `knowledge_domain.general_lore` must advertise `settlement_district` in `canonicalSubjectTypes` and `world.settlement_districts` in `relatedContentCollections`.

Because the now-active district summary still begins with "Planned...", choose Option B: a separate tiny wording cleanup before snippet seeding. The cleanup should remove public-facing planned-status ambiguity from the active district summary without changing status, authority fields, snippets, registry content, schemas, validators, runtime behavior, or gameplay behavior.

## 2. Current Authority Posture

`world.settlements` remains the canonical settlement identity and broad place authority. Highcrown exists as `settlement.highcrown`; its summary explicitly names "archive districts" and "barge quays", while its `siteContext` names "palace terraces" and "the empire's largest market courts".

Current settlement district authority exists at `packages/content/base/world/settlement_districts.json` with exactly two Highcrown records:

- `settlement_district.highcrown.archive_districts` has `status: "active"`.
- `settlement_district.highcrown.market_courts` has `status: "planned"`.

Current settlement site authority exists at `packages/content/base/world/settlement_sites.json` with exactly two Highcrown records:

- `settlement_site.highcrown.barge_quays` has `status: "planned"` and `parentDistrictId: null`.
- `settlement_site.highcrown.palace_terraces` has `status: "planned"` and `parentDistrictId: null`.

Normal content lint registers both `world.settlement_districts` and `world.settlement_sites`. These records are static authored place identity only. They do not own coordinates, geometry, route topology, services, vendors, stock, prices, access control, NPC staffing, ownership, discovery state, UI state, storage state, commands, events, rewards, or gameplay effects.

## 3. Current Knowledge Subject Posture

Direct Knowledge subject support exists for:

- `settlement_district`
- `settlement_site`

The Knowledge snippet schema and mirrored Knowledge domain registry schema include both subject values. The Knowledge snippet validator resolves both subject types against live authority records and enforces active-only eligibility for public snippets.

No live `settlement_district` or `settlement_site` Knowledge snippets currently exist.

`knowledge_domain.general_lore` is active and supports `identification` plus `book_study`, but it does not currently include `settlement_district` in `canonicalSubjectTypes` and does not currently include `world.settlement_districts` in `relatedContentCollections`. A future snippet using General Lore will fail semantic validation until those two registry fields are aligned.

## 4. Snippet Eligibility Threshold

A future public Knowledge snippet for `settlement_district.highcrown.archive_districts` is eligible only if:

- the district authority exists in live content;
- the district authority is `status: "active"`;
- `settlement_district` is supported by the Knowledge snippet schema and validator;
- the chosen Knowledge domain can safely advertise `settlement_district`;
- the chosen Knowledge domain can safely include `world.settlement_districts` in `relatedContentCollections`;
- snippet wording is static authored place knowledge only;
- snippet wording does not imply archive access, record browsing, Knowledge unlocks, storage inventories, bureaucracy services, NPC staffing, law/court behavior, quest hooks, UI markers, discovery state, rewards, commands, runtime state, or gameplay effects;
- snippet wording does not activate or imply `market_courts`, `barge_quays`, or `palace_terraces`;
- the snippet does not require new runtime systems, UI, route/travel behavior, building/service/economy behavior, ownership, access control, or map coordinates.

The current candidate satisfies the authority, status, schema, and validator requirements. It requires future General Lore registry alignment before snippet insertion.

## 5. Candidate Audit Method

This pass audited:

- subject type;
- subject id;
- current authority status;
- parent settlement id;
- evidence source;
- evidence strength;
- chosen Knowledge domain candidates;
- whether current registry content advertises the subject type;
- whether current registry content includes the required related content collection;
- whether current supported categories and discovery source types can support a safe snippet;
- recommended snippet category;
- recommended discovery source family and source type;
- safe summary wording;
- forbidden implications;
- decision and reason.

The audit intentionally did not evaluate `settlement_district.highcrown.market_courts`, `settlement_site.highcrown.barge_quays`, `settlement_site.highcrown.palace_terraces`, parent settlement snippets, site snippets, route/travel snippets, building/workplace/economy snippets, or sacred-site/religious-hotspot snippets.

## 6. Candidate Decision

Candidate:

- subject type: `settlement_district`
- subject id: `settlement_district.highcrown.archive_districts`
- current authority status: `active`
- parent settlement id: `settlement.highcrown`
- evidence source: Highcrown summary explicitly references "archive districts"; `docs/design/first-settlement-district-content-seed-plan.md` selected the candidate; `docs/design/settlement-district-site-status-activation-plan.md` selected it for activation; `Version 0.5.264` activated it.
- evidence strength: strong. The phrase names districts directly and ties them to current Highcrown identity.
- chosen Knowledge domain candidate: `knowledge_domain.general_lore`
- registry currently advertises `settlement_district`: no.
- registry currently includes `world.settlement_districts`: no.
- supported category: yes, `identification`.
- supported discovery source family/source type: yes, textual study through `book_study`.
- recommended category: `identification`.
- recommended discovery source family/source type: `textual_study` / `book_study`.
- safe summary wording: "Highcrown's Archive Districts are the capital's civic recordkeeping quarters, known as part of its imperial administrative identity."
- forbidden implications: no archive access, record browsing, Knowledge unlocks, storage, service desk, NPC staff, court/law behavior, quest hook, UI marker, reward, command, runtime state, or gameplay behavior.
- decision: select future snippet.
- reason: the active district has direct authored evidence, a low-risk static place interpretation, live active-only subject support, and a broad active domain that can safely own civic place knowledge after narrow registry alignment.

## 7. Selected Future Snippet Preview

The following record shape is non-binding future implementation guidance only. It is not implemented by this run.

```json
{
  "id": "knowledge_snippet.general_lore.highcrown_archive_districts.identification",
  "domainId": "knowledge_domain.general_lore",
  "subjectType": "settlement_district",
  "subjectId": "settlement_district.highcrown.archive_districts",
  "tier": 1,
  "category": "identification",
  "title": "Recognizing Highcrown's Archive Districts",
  "summary": "Highcrown's Archive Districts are the capital's civic recordkeeping quarters, known as part of its imperial administrative identity.",
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
    "hiddenSummary": "An unidentified Highcrown district remains to be understood."
  },
  "notes": [
    "This snippet is authored place knowledge only and grants no archive access, record browsing, Knowledge unlock, storage, service, NPC staffing, quest hook, UI marker, reward, runtime behavior, or gameplay behavior."
  ]
}
```

Preview audit:

- id shape matches the current snippet schema pattern;
- `domainId` points to an active domain;
- `subjectType` is schema-supported and validator-supported;
- `subjectId` matches the direct settlement district id pattern and resolves to an active authority record;
- `tier: 1`, `category: "identification"`, `book_study`, null `sourceId`, progression, visibility, and notes match existing snippet conventions;
- `knowledge_domain.general_lore` must first add `settlement_district` and `world.settlement_districts` or validation will reject the snippet.

## 8. Domain And Registry Alignment Requirements

Selected domain: `knowledge_domain.general_lore`.

Current registry posture:

- status: `active`;
- supports `settlement_district`: no;
- includes `world.settlement_districts`: no;
- supports category `identification`: yes;
- supports discovery source type `book_study`: yes;
- policy refs: no new policy refs required.

Required future alignment:

- add `settlement_district` to `knowledge_domain.general_lore.canonicalSubjectTypes`;
- add `world.settlement_districts` to `knowledge_domain.general_lore.relatedContentCollections`.

The future implementation should update only those selected domain registry record fields required for snippet validation. It should not restructure Knowledge domains, create a new district-specific domain, edit schemas or validators, add trial/completion/visibility policies, or update `knowledge_domains.json`.

## 9. Future Implementation Plan

Because this plan selects Option B for wording cleanup, the immediate next run should be:

- `Version 0.5.266 - Archive District Wording Cleanup`

That cleanup run may:

- edit only `settlement_district.highcrown.archive_districts` summary wording;
- replace the stale "Planned..." phrase with static active wording;
- keep status, id, slug, parent settlement, district type, tags, source notes, snippets, registry content, schemas, validators, tests, runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, route/travel, building/workplace/economy, sacred-site/religious-hotspot, and gameplay behavior unchanged;
- run settlement district validation, Knowledge snippet validation, schema-files test, normal content lint, and scope audits.

After that cleanup lands, the later snippet seed run may:

- update only `knowledge_domain.general_lore` registry fields required for `settlement_district` and `world.settlement_districts` alignment;
- add exactly one Knowledge snippet for `settlement_district.highcrown.archive_districts`;
- not add snippets for `market_courts`, `barge_quays`, or `palace_terraces`;
- not activate additional district or site records;
- not edit Knowledge schemas or validators;
- not edit settlement/site content;
- not change runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, route/travel, building/workplace/economy, sacred-site/religious-hotspot, or gameplay behavior;
- run focused Knowledge snippet validation tests;
- run Knowledge domain registry validation tests because registry content will be touched;
- run settlement district validation to prove district content remains clean after the wording cleanup;
- run settlement site validation to prove site posture remains unchanged;
- run schema-files test;
- run normal content lint;
- update workflow docs.

## 10. Rejected Alternatives

- Adding the snippet now: rejected because this is a docs-only seed plan and registry alignment has not been applied.
- Adding multiple district snippets: rejected because only one active district candidate is in scope.
- Adding `settlement_site` snippets now: rejected because both current site records remain planned.
- Using parent `settlement.highcrown` instead of the direct district subject: rejected because direct active district subject support exists and is more precise.
- Activating `market_courts` or sites to support more snippets: rejected because this run must not activate content and those records remain coupled to unfinished market, route, service, dock, palace, access, civic, UI, or gameplay implications.
- Using archive districts to imply archive access, record browsing, storage, services, NPC staff, quests, UI markers, unlocks, rewards, or gameplay: rejected as outside static authored place knowledge.
- Adding runtime discovery/progress behavior: rejected as out of scope for Knowledge content planning.
- Broad Knowledge registry/domain restructuring: rejected because the future snippet needs only narrow General Lore alignment.
- Changing Knowledge schema or validator behavior: rejected because current schema and validator support already exists.

## 11. Explicit Non-Goals

- no Knowledge snippet addition in this run;
- no Knowledge registry/domain/trial-policy content edits in this run;
- no Knowledge schema or validator edits;
- no settlement, district, site, or parent settlement content edits;
- no test edits;
- no runtime, UI, storage, command, event, reward, migration, save/account, route/travel, building/workplace/economy, sacred-site/religious-hotspot, or gameplay behavior;
- no snippets for `market_courts`, `barge_quays`, `palace_terraces`, parent settlements, sites, routes, buildings, workplaces, economy, sacred sites, or religious hotspots;
- no access, services, storage, NPC staffing, archive browsing, court/law behavior, UI markers, rewards, commands, discovery state, or gameplay promises.

## 12. Validation And Audit Posture

This planning run should verify:

- changed paths are docs-only;
- `settlement_district.highcrown.archive_districts` remains active;
- `settlement_district.highcrown.market_courts` remains planned;
- both site records remain planned with `parentDistrictId: null`;
- no live `settlement_district` or `settlement_site` Knowledge snippets exist;
- direct `settlement_district` and `settlement_site` schema/validator support remains present;
- `knowledge_domain.general_lore` is active and supports the selected category/source type;
- `knowledge_domain.general_lore` still requires future subject/collection alignment;
- Knowledge snippets, registry/domain content, schemas, validators, tests, settlement/district/site content, runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, route/travel, building/workplace/economy, sacred-site/religious-hotspot, and gameplay files are unchanged;
- `git diff --check` passes;
- conflict-marker and trailing-whitespace scans pass on changed files.

Tests are optional for this docs-only run. If run, prefer:

- `node --test tests\unit\knowledge-snippets-validation.test.mjs`
- `node --test tests\unit\knowledge-domain-registry-validation.test.mjs`
- `node --test tests\unit\settlement-district-validation.test.mjs`
- `node --test tests\unit\settlement-site-validation.test.mjs`
- `node --test tests\unit\schema-files.test.mjs`
- `npm.cmd run tool:content-lint`

## 13. Next Recommended Version

`Version 0.5.266 - Archive District Wording Cleanup`

That run should remove stale planned-status wording from the active archive district summary before the registry/snippet seed run. The cleanup must remain tiny and must not add snippets, change registry/domain content, edit schemas or validators, activate additional records, or change runtime/UI/storage/commands/events/rewards/migrations/save/account/route/travel/building/workplace/economy/sacred-site/religious-hotspot/gameplay behavior.
