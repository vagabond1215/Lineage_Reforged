# Market Courts Knowledge Snippet Seed Review

Source version/run: Version 0.5.271 - Market Courts Knowledge Snippet Seed Review
Date: 2026-07-06
Scope: docs-only Knowledge snippet seed review for `settlement_district.highcrown.market_courts`

## 1. Decision Summary

Select exactly one future public General Lore Knowledge snippet candidate for:

- `settlement_district.highcrown.market_courts`

Selected future snippet id:

- `knowledge_snippet.general_lore.highcrown_market_courts.identification`

This run does not add the snippet.

The future snippet is safe only as authored place knowledge for a named Highcrown civic-commercial district. It must preserve the static-only boundary selected in `Version 0.5.269 - Market Courts Boundary Clarification Plan` and implemented in `Version 0.5.270 - Settlement District Market Courts Status Activation`.

## 2. Current District And Site Authority Posture

Current settlement district authority exists at `packages/content/base/world/settlement_districts.json`.

- `settlement_district.highcrown.archive_districts` is `status: "active"` and remains unchanged.
- `settlement_district.highcrown.market_courts` is `status: "active"`.

Current `market_courts` summary:

`Static market-court district within Highcrown where enclosed commercial yards, imperial trade recordkeeping, and river-confluence identity shape the capital's civic-commercial quarters.`

Current `market_courts` note:

`Static district identity only; no vendors, stock, prices, services, taxes, trade execution, law/court mechanics, cargo/storage, ownership, NPC staffing, access rules, route topology, quests, rewards, UI, runtime, or gameplay behavior.`

Current settlement site authority exists at `packages/content/base/world/settlement_sites.json`.

- `settlement_site.highcrown.barge_quays` remains `status: "planned"` with `parentDistrictId: null`.
- `settlement_site.highcrown.palace_terraces` remains `status: "planned"` with `parentDistrictId: null`.

This review does not edit settlement, district, or site content and does not infer site anchors from the active Market Courts district.

## 3. Current Knowledge Snippet Posture

Exactly one live `settlement_district` Knowledge snippet exists:

- `knowledge_snippet.general_lore.highcrown_archive_districts.identification`

No live `settlement_site` Knowledge snippets exist.

No Knowledge snippets exist for:

- `settlement_district.highcrown.market_courts`
- `settlement_site.highcrown.barge_quays`
- `settlement_site.highcrown.palace_terraces`

This run does not edit `packages/content/base/player/knowledge_snippets.json`.

## 4. Current Knowledge Domain And Registry Posture

`knowledge_domain.general_lore` is active.

It already includes:

- `settlement_district` in `canonicalSubjectTypes`
- `world.settlement_districts` in `relatedContentCollections`
- `identification` in `supportedSnippetCategories`
- `textual_study` in `supportedDiscoverySourceFamilies`
- `book_study` in `supportedDiscoverySourceTypes`

Direct Knowledge subject support exists for:

- `settlement_district`
- `settlement_site`

Knowledge snippet validation remains resolver-backed and active-only for both subject types.

No registry/domain alignment is required for the future Market Courts snippet. This run must not edit `knowledge_domain_registry.json`, `knowledge_domains.json`, or `knowledge_trial_policies.json`.

## 5. Snippet Eligibility Threshold

`settlement_district.highcrown.market_courts` satisfies the future public snippet threshold:

- the district authority exists in live content;
- the district authority is `status: "active"`;
- the district has static-only boundary wording from `Version 0.5.270`;
- `settlement_district` is supported by the Knowledge snippet schema and validator;
- `knowledge_domain.general_lore` already supports `settlement_district`;
- `knowledge_domain.general_lore` already includes `world.settlement_districts`;
- `knowledge_domain.general_lore` supports `identification`;
- `knowledge_domain.general_lore` supports `book_study`;
- safe snippet wording can remain static authored place knowledge only;
- no site activation, district anchoring, registry alignment, schema change, validator change, runtime system, UI, route/travel behavior, building/service/economy behavior, ownership, access control, map coordinates, or gameplay behavior is required.

The future snippet remains blocked unless it preserves the forbidden-implication list in this review.

## 6. Candidate Audit Method

The audit reviewed only:

- `settlement_district.highcrown.market_courts`

The audit checked:

- subject type;
- subject id;
- current authority status;
- parent settlement id;
- current summary;
- current note;
- evidence source;
- evidence strength;
- chosen Knowledge domain candidate;
- whether General Lore already advertises `settlement_district`;
- whether General Lore already includes `world.settlement_districts`;
- supported category;
- supported discovery source type;
- recommended category;
- recommended discovery source family and source type;
- safe title wording;
- safe summary wording;
- safe hidden summary wording;
- required note wording;
- forbidden implications;
- whether a future snippet should be selected or deferred;
- reason.

The audit intentionally did not evaluate archive district snippets, site snippets, parent settlement snippets, route/travel snippets, building/workplace/economy snippets, vendor/market snippets, court/law snippets, cargo/storage snippets, sacred-site snippets, or religious-hotspot snippets.

## 7. Candidate Review

Candidate:

- subject type: `settlement_district`
- subject id: `settlement_district.highcrown.market_courts`
- current authority status: `active`
- parent settlement id: `settlement.highcrown`
- current summary: `Static market-court district within Highcrown where enclosed commercial yards, imperial trade recordkeeping, and river-confluence identity shape the capital's civic-commercial quarters.`
- current note: `Static district identity only; no vendors, stock, prices, services, taxes, trade execution, law/court mechanics, cargo/storage, ownership, NPC staffing, access rules, route topology, quests, rewards, UI, runtime, or gameplay behavior.`
- evidence source: Highcrown `siteContext` explicitly references the empire's largest market courts.
- evidence strength: sufficient for static district identity only.
- chosen Knowledge domain candidate: `knowledge_domain.general_lore`.
- registry already advertises `settlement_district`: yes.
- registry already includes `world.settlement_districts`: yes.
- supported category: yes, `identification`.
- supported discovery source type: yes, `book_study`.
- recommended category: `identification`.
- recommended discovery source family and source type: `textual_study` / `book_study`.
- safe title wording: `Recognizing Highcrown's Market Courts`.
- safe summary wording: `Highcrown's Market Courts are civic-commercial district quarters known for enclosed market yards, imperial trade recordkeeping, and river-confluence identity.`
- safe hidden summary wording: `An unidentified Highcrown market district remains to be understood.`
- required note wording: `This snippet is authored place knowledge only and grants no vendors, stock, prices, services, taxes, trade execution, law/court mechanics, cargo/storage, ownership, NPC staffing, access rules, route topology, quests, rewards, UI, runtime behavior, or gameplay behavior.`
- forbidden implications: vendors, vendor access, stock, prices, services, taxes, trade execution, contracts, market UI, economy simulation, law/court mechanics, hearings, judges, legal services, cargo/storage, route topology, dock operation, travel services, NPC staffing, access rules, ownership, quests, rewards, discovery state, runtime state, and gameplay behavior.
- decision: select future snippet.
- reason: the district is active, direct subject support exists, General Lore is already aligned, the `identification` and `book_study` fields are supported, and the selected wording can remain static authored place knowledge without implying market, vendor, economy, court/law, route, cargo/storage, service, runtime, or gameplay systems.

## 8. Selected Future Snippet Preview

```json
{
  "id": "knowledge_snippet.general_lore.highcrown_market_courts.identification",
  "domainId": "knowledge_domain.general_lore",
  "subjectType": "settlement_district",
  "subjectId": "settlement_district.highcrown.market_courts",
  "tier": 1,
  "category": "identification",
  "title": "Recognizing Highcrown's Market Courts",
  "summary": "Highcrown's Market Courts are civic-commercial district quarters known for enclosed market yards, imperial trade recordkeeping, and river-confluence identity.",
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
    "hiddenSummary": "An unidentified Highcrown market district remains to be understood."
  },
  "notes": [
    "This snippet is authored place knowledge only and grants no vendors, stock, prices, services, taxes, trade execution, law/court mechanics, cargo/storage, ownership, NPC staffing, access rules, route topology, quests, rewards, UI, runtime behavior, or gameplay behavior."
  ]
}
```

The future seed run may use this exact shape if the live audit still matches this review.

## 9. Domain And Registry Alignment Impact

No domain or registry alignment is required.

`knowledge_domain.general_lore` already includes:

- `settlement_district`
- `world.settlement_districts`

This run must not edit:

- `packages/content/base/player/knowledge_domain_registry.json`
- `packages/content/base/player/knowledge_domains.json`
- `packages/content/base/player/knowledge_trial_policies.json`

A future seed run should add only the selected snippet if the live posture remains unchanged.

## 10. Static-Only Wording Constraints

Safe wording may frame Market Courts as:

- a named Highcrown district;
- static civic-commercial place identity;
- enclosed commercial yards, market courts, or courtyards;
- imperial trade recordkeeping context;
- river-confluence identity.

Safe wording must not imply:

- vendors;
- vendor access;
- stock;
- prices;
- services;
- taxes;
- trade execution;
- contracts;
- market UI;
- economy simulation;
- law/court mechanics;
- hearings;
- judges;
- legal services;
- cargo/storage;
- route topology;
- dock operation;
- travel services;
- NPC staffing;
- access rules;
- ownership;
- quests;
- rewards;
- discovery state;
- runtime state;
- gameplay behavior.

## 11. Rejected Alternatives

- Adding the snippet now: rejected because this is a docs-only review.
- Adding multiple `market_courts` snippets: rejected because one identification snippet is enough for first public district knowledge.
- Adding `settlement_site` snippets: rejected because both current site records remain planned.
- Adding snippets for `barge_quays` or `palace_terraces`: rejected because those records are planned and outside scope.
- Using parent `settlement.highcrown` instead of the direct district subject: rejected because direct active `settlement_district` authority exists and is more precise.
- Editing General Lore registry alignment again: rejected because required alignment already exists.
- Editing Knowledge schemas or validators: rejected because direct subject support already exists.
- Implying market operation, vendors, prices, stock, trade execution, tax systems, law/court mechanics, cargo/storage, routes, services, NPCs, UI, rewards, runtime, or gameplay: rejected as outside static authored Knowledge.
- Activating site records: rejected as outside scope.
- Changing site district anchors: rejected because current evidence keeps both site records at `parentDistrictId: null`.
- Changing runtime discovery/progress behavior: rejected because snippets are authored static content only.

## 12. Explicit Non-Goals

This run does not:

- add Knowledge snippets;
- edit Knowledge registry/domain/trial-policy content;
- edit Knowledge schemas or validators;
- edit settlement, district, or site content;
- activate sites;
- change site district anchors;
- evaluate or author archive district snippets;
- evaluate or author parent settlement snippets;
- evaluate or author route/travel snippets;
- evaluate or author building/workplace/economy snippets;
- evaluate or author vendor/market snippets;
- evaluate or author court/law snippets;
- evaluate or author cargo/storage snippets;
- evaluate or author sacred-site or religious-hotspot snippets;
- change tests;
- change runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, route/travel systems, building/workplace/economy systems, court/law systems, vendor/market systems, cargo/storage systems, or gameplay behavior.

## 13. Validation And Audit Posture

Validation for this docs-only review should prove:

- `settlement_district.highcrown.archive_districts` remains active and unchanged;
- `settlement_district.highcrown.market_courts` remains active;
- `market_courts` keeps the selected static-only summary;
- `market_courts` keeps the clarified behavior-exclusion note;
- `settlement_districts.json` is unchanged by this run;
- `settlement_site.highcrown.barge_quays` remains planned with `parentDistrictId: null`;
- `settlement_site.highcrown.palace_terraces` remains planned with `parentDistrictId: null`;
- `settlement_sites.json` is unchanged by this run;
- exactly one live `settlement_district` snippet exists;
- no `market_courts` Knowledge snippet exists in this run;
- no live `settlement_site` snippets exist;
- `knowledge_snippets.json` is unchanged;
- `knowledge_domain.general_lore` remains active;
- General Lore still includes `settlement_district`;
- General Lore still includes `world.settlement_districts`;
- General Lore supports `identification`;
- General Lore supports `book_study`;
- registry/domain/trial-policy content is unchanged;
- direct `settlement_district` and `settlement_site` schema/validator support remains present;
- Knowledge snippet validation remains resolver-backed and active-only;
- changed paths are docs-only.

Minimum hygiene checks:

- `git diff --check`;
- conflict-marker scan on changed files;
- trailing-whitespace scan on changed files;
- changed-path scope audit.

Tests are optional for this docs-only run unless local workflow or owner review requires them.

## 14. Next Recommended Version

`Version 0.5.272 - Market Courts Knowledge Snippet Seed`

That run may add exactly one General Lore Knowledge snippet:

- `knowledge_snippet.general_lore.highcrown_market_courts.identification`

It must not add any other snippets, activate sites, change site district anchors, edit Knowledge schemas or validators, edit Knowledge registry/domain/trial-policy content, or change runtime/UI/storage/commands/events/rewards/migrations/save-account/route-travel/building-workplace-economy/court-law/vendor-market/cargo-storage/gameplay behavior.
