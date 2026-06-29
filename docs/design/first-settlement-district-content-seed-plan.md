# First Settlement District Content Seed Plan

Source version/run: Version 0.5.257 - First Settlement District Content Seed Plan
Date: 2026-06-29
Status: approved documentation-only seed plan; no live content implementation

## 1. Decision Summary

Approve a tiny future first `world.settlement_districts` content seed posture with exactly two conditional planned records under Highcrown:

- `settlement_district.highcrown.archive_districts`
- `settlement_district.highcrown.market_courts`

This run does not create `packages/content/base/world/settlement_districts.json`, modify `world.settlements`, register normal content lint, change schemas or validators, add tests, or change runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, or gameplay behavior.

The next implementation run may create live district content only if it repeats the lightweight repository audit and preserves the exact guardrails in this plan.

## 2. Current Authority Posture

Current local inspection confirms:

- `world.settlements` remains the canonical settlement identity and broad place authority.
- `packages/content/base/world/settlements.json` exists and includes current parent settlement `settlement.highcrown`.
- `packages/content/base/world/settlement_districts.json` remains absent.
- `packages/content/base/world/settlement_sites.json` remains absent.
- `packages/schemas/world/settlement-district.schema.json` exists.
- `tools/content-lint/settlement-districts.mjs` exists as an isolated pure validator.
- `tests/unit/settlement-district-validation.test.mjs` exists as focused in-memory coverage.
- `packages/schemas/world/settlement-site.schema.json`, `tools/content-lint/settlement-sites.mjs`, and `tests/unit/settlement-site-validation.test.mjs` exist, but no live site content exists.
- `tools/content-lint/index.mjs` does not register `settlement_districts.json`, `settlement_sites.json`, `settlement-districts.mjs`, or `settlement-sites.mjs`.

The live settlement schema still has no district arrays, placed-site inventories, service-instance lists, runtime district state, coordinates, local geometry, building inventories, vendor/service records, ownership, discovery state, or gameplay behavior.

## 3. Candidate Audit Method

This plan used a narrow local audit of:

- `packages/content/base/world/settlements.json`
- `docs/design/settlement-district-site-authority-boundary-decision.md`
- `docs/design/settlement-district-schema-plan.md`
- `docs/design/settlement-site-schema-plan.md`
- current district schema, validator, and focused tests
- current site schema, validator, and focused tests
- `tools/content-lint/index.mjs`

The content audit searched current authored settlement identity fields for explicit intra-settlement area language, especially `quarter`, `ward`, `district`, `terrace`, `sprawl`, `riverfront`, `market`, `palace`, `citadel`, `guild compound`, and similar terms.

The audit intentionally ignored runtime projections, UI strings, generated operators, map visuals, Knowledge snippets, route adjacency, economy-only roles, building compatibility, and generic guild boilerplate.

## 4. Evidence Threshold

A future first district record must satisfy all of these:

- parent settlement exists in current `world.settlements`;
- source evidence names or strongly types a stable intra-settlement area;
- source evidence is current authored settlement content or an approved design decision;
- the candidate can fit the current district schema without adding fields;
- the candidate does not require a placed site, building instance, service provider, NPC, route node, geometry, law/tax/control, ownership, quest, Knowledge, discovery, UI, storage, command, event, reward, or gameplay behavior;
- the candidate can remain `status: "planned"` as static identity content.

The threshold rejects inference from broad settlement role, `siteClass`, `siteContext` alone when it only describes geography, economic/admin roles, route adjacency, map pixels, sacred-site or religious-hotspot prose, Knowledge vocabulary, runtime state, demo snapshots, generated operators, and generic fantasy naming.

## 5. Selected Future Seed Candidates

### Highcrown Archive Districts

Candidate id:

- `settlement_district.highcrown.archive_districts`

Parent settlement:

- `settlement.highcrown`

Evidence:

- Highcrown summary explicitly says the capital has "archive districts".
- Highcrown is a current city record and a plausible parent for optional district identity.

Planned classification:

- `districtType: "civic_quarter"`

Reasoning:

The evidence names districts directly and describes a durable civic/administrative intra-settlement function. It does not require an archive building instance, NPC staff, Knowledge unlock, service execution, records access rules, storage state, or gameplay behavior.

### Highcrown Market Courts

Candidate id:

- `settlement_district.highcrown.market_courts`

Parent settlement:

- `settlement.highcrown`

Evidence:

- Highcrown `siteContext` explicitly says the city commands "the empire's largest market courts".
- The boundary decision lists market quarters as an acceptable future district example.

Planned classification:

- `districtType: "market_quarter"`

Reasoning:

The evidence names a large intra-settlement market area rather than a single shop, item market profile, route endpoint, vendor service, or runtime economy surface. It can be represented as static district identity while leaving all prices, stock, services, taxes, trade execution, ownership, and UI state to later owners.

## 6. Rejected Or Deferred Candidates

- Aurelis palace roads and naval yards: deferred because the current phrase may describe broad settlement context, placed palace/yard sites, workplace/infrastructure anchors, or future districts. It needs a later focused audit before becoming district content.
- Stonevein terrace-halls: deferred because the phrase is strongly place-like but could be a dwarven architecture pattern, placed civic/craft site, or district family. It needs a later seed pass after the first Highcrown records prove the collection.
- Highcrown palace terraces: deferred because it may become a noble terrace, citadel ward, palace site, or civic site. This plan avoids overloading the first seed with palace/citadel semantics.
- Sunspire Reach guild compounds and stone bridges: deferred because guild compounds and bridges are better candidates for site/infrastructure authority unless a later district plan proves a stable zone identity.
- Generic local guild quarter notes in `guildPresence`: rejected for this first seed because the same boilerplate appears across many settlements and does not prove a distinct authored district candidate.
- Settlement economy, administrative role, route/travel adjacency, visual map references, Knowledge text, sacred-site/religious-hotspot text, runtime district state, generated operators, and demo snapshots: rejected as forbidden inference sources.

## 7. Proposed Future Records

These records are a future JSON preview only. They must not be copied into live content without a fresh implementation audit and focused validation.

```json
{
  "records": [
    {
      "id": "settlement_district.highcrown.archive_districts",
      "slug": "archive_districts",
      "name": "Archive Districts",
      "aliases": [],
      "summary": "Planned civic record districts within Highcrown where imperial archives and recordkeeping institutions shape the capital's administrative identity.",
      "parentSettlementId": "settlement.highcrown",
      "districtType": "civic_quarter",
      "functionalTags": [
        "archives",
        "recordkeeping",
        "civic_administration"
      ],
      "placeRoleTags": [
        "imperial_capital",
        "administrative_core"
      ],
      "status": "planned",
      "sourceAuthorityNotes": [
        "Highcrown summary explicitly references archive districts."
      ],
      "notes": [
        "Static district identity only; no archive service, Knowledge unlock, storage, NPC staffing, access rule, quest, UI, or gameplay behavior."
      ]
    },
    {
      "id": "settlement_district.highcrown.market_courts",
      "slug": "market_courts",
      "name": "Market Courts",
      "aliases": [],
      "summary": "Planned market district within Highcrown centered on the capital's largest courts for inland river commerce and imperial trade administration.",
      "parentSettlementId": "settlement.highcrown",
      "districtType": "market_quarter",
      "functionalTags": [
        "market",
        "trade",
        "barge_commerce"
      ],
      "placeRoleTags": [
        "imperial_capital",
        "river_confluence"
      ],
      "status": "planned",
      "sourceAuthorityNotes": [
        "Highcrown siteContext explicitly references the empire's largest market courts."
      ],
      "notes": [
        "Static district identity only; no prices, stock, vendors, services, taxes, ownership, route topology, UI, or gameplay behavior."
      ]
    }
  ]
}
```

## 8. Validator Readiness

The current district validator is ready for a future live seed if the implementation run supplies current settlement records and validates the new wrapper before normal lint registration.

A future seed implementation must verify:

- wrapper is exactly `{ "records": [...] }`;
- ids follow `settlement_district.<settlement_slug>.<district_slug>`;
- slugs match final id segments;
- parent settlement ids exist and are current;
- district id settlement slug matches the parent settlement slug;
- ids are unique;
- district slugs are unique within each parent settlement;
- arrays are duplicate-free;
- `districtType` and `status` use controlled vocabularies;
- tags are lower-snake-case;
- forbidden fields are rejected.

## 9. Normal Content-Lint Posture

Normal content lint must remain unregistered while `packages/content/base/world/settlement_districts.json` is absent.

The future content seed implementation should create `packages/content/base/world/settlement_districts.json` and register `world.settlement_districts` in normal content lint in the same approved run, after focused validation passes.

Do not register `world.settlement_sites` merely because district content lands. Site content remains a separate future approval.

## 10. Forbidden Inference Sources

Future district implementation must not infer content from:

- broad settlement summaries without explicit district or area evidence;
- settlement administrative role alone;
- settlement economic role alone;
- `siteClass`;
- geography-only `siteContext`;
- building compatibility;
- workplace requirements;
- infrastructure requirements;
- route/travel adjacency;
- map pixels, coordinates, or visual labels;
- region/locality proximity;
- Knowledge snippets;
- quest metadata;
- sacred-site or religious-hotspot prose;
- runtime `SettlementDistrictState`;
- runtime plot/building state;
- demo snapshots;
- generated operators;
- generic fantasy naming.

## 11. Implementation Guardrails For Future Seed Run

The future seed run should:

- create only `packages/content/base/world/settlement_districts.json` unless validation requires a smaller documentation-only deferral;
- seed exactly the two Highcrown planned records from this plan unless the fresh audit finds a blocker;
- keep `world.settlements` unchanged;
- keep `world.settlement_sites` absent;
- register only `world.settlement_districts` in normal content lint if live district content is created;
- run the focused district validation tests;
- run normal content lint and record the new checked-file count;
- run `git diff --check`;
- run conflict-marker and trailing-whitespace scans on changed files;
- prove changed paths are limited to live district content, lint registration if needed, and workflow docs.

## 12. Explicit Non-Goals

- no live district content in this run;
- no live site content;
- no settlement edits;
- no schema edits;
- no validator edits;
- no test edits;
- no normal content-lint registration;
- no region, locality, map-feature, building, workplace, infrastructure, route/travel, Knowledge, sacred-site, religious-hotspot, polity, economy, item, quest, NPC, family, civic, service, housing/property, or magic content edits;
- no coordinates, geometry, pathfinding, map marker, route node, service execution, vendor stock, price, tax, law, control, ownership, NPC schedule, quest trigger, discovery state, Knowledge unlock, UI state, storage state, command, event, reward, migration, save/account, runtime, or gameplay behavior;
- no transition to `0.6.0`.

## 13. Next Recommended Version

`Version 0.5.258 - First Settlement District Content Seed`

That run may create the first live `world.settlement_districts` content file and normal content-lint registration only if it repeats the current path audits, validates exactly the approved tiny Highcrown seed, and preserves all non-runtime guardrails above.
