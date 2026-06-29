# First Settlement Site Content Seed Plan

Source version/run: Version 0.5.259 - First Settlement Site Content Seed Plan
Date: 2026-06-29
Status: approved documentation-only seed plan; no live site content implementation

## 1. Decision Summary

Approve a tiny future first `world.settlement_sites` content seed posture with exactly two conditional planned records under Highcrown:

- `settlement_site.highcrown.barge_quays`
- `settlement_site.highcrown.palace_terraces`

This run does not create `packages/content/base/world/settlement_sites.json`, modify `world.settlements`, modify `world.settlement_districts`, register normal content lint for settlement sites, change schemas or validators, add tests, or change runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, or gameplay behavior.

The next implementation run may create live site content only if it repeats the lightweight repository audit and preserves the exact guardrails in this plan.

## 2. Current Authority Posture

Current local inspection confirms:

- `world.settlements` remains the canonical settlement identity and broad place authority.
- `packages/content/base/world/settlements.json` exists and includes current parent settlement `settlement.highcrown`.
- `packages/content/base/world/settlement_districts.json` exists with exactly two planned Highcrown records:
  - `settlement_district.highcrown.archive_districts`
  - `settlement_district.highcrown.market_courts`
- `tools/content-lint/index.mjs` registers `settlement_districts.json` and validates it through `validateSettlementDistricts`.
- `packages/content/base/world/settlement_sites.json` remains absent.
- `packages/schemas/world/settlement-site.schema.json` exists.
- `tools/content-lint/settlement-sites.mjs` exists as an isolated pure validator.
- `tests/unit/settlement-site-validation.test.mjs` exists as focused in-memory coverage.
- `tools/content-lint/index.mjs` does not register `settlement_sites.json` or `settlement-sites.mjs`.

The live settlement and district records still do not own placed-site inventories, coordinates, local geometry, route topology, building inventories, vendor/service records, ownership, discovery state, UI state, or gameplay behavior.

## 3. Candidate Audit Method

This plan used a narrow local audit of:

- `packages/content/base/world/settlements.json`
- `packages/content/base/world/settlement_districts.json`
- `docs/design/settlement-district-site-authority-boundary-decision.md`
- `docs/design/settlement-site-schema-plan.md`
- `docs/design/first-settlement-district-content-seed-plan.md`
- current district schema, validator, and focused tests
- current site schema, validator, and focused tests
- `tools/content-lint/index.mjs`

The content audit searched current authored settlement identity fields for explicit placed-site or landmark language, especially `quay`, `wharf`, `dock`, `palace`, `terrace`, `bridge`, `gate`, `guildhall`, `civic hall`, `market`, and named local anchors.

The audit intentionally ignored runtime projections, UI strings, generated operators, map visuals, Knowledge snippets, route adjacency, economy-only roles, building compatibility, district type labels alone, and generic guild boilerplate.

## 4. Evidence Threshold

A future first site record must satisfy all of these:

- parent settlement exists in current `world.settlements`;
- source evidence explicitly names or strongly types a discrete placed site, facility, landmark, or local anchor;
- source evidence is current authored settlement content, current live district content, or an approved design decision;
- the candidate can fit the current site schema without adding fields;
- `parentDistrictId` is `null` unless explicit evidence ties the candidate to a live district;
- any non-null district anchor can only reference `settlement_district.highcrown.archive_districts` or `settlement_district.highcrown.market_courts` in the next seed;
- the candidate does not require a building instance, workplace operation, service provider, NPC, route node, geometry, law/tax/control, ownership, quest, Knowledge, discovery, UI, storage, command, event, reward, or gameplay behavior;
- the candidate can remain `status: "planned"` as static identity content.

The threshold rejects inference from broad settlement role, economic/admin role, `siteClass`, geography-only context, route adjacency, map pixels, visual labels, sacred-site or religious-hotspot prose, Knowledge vocabulary, runtime state, demo snapshots, generated operators, and generic fantasy naming.

## 5. Selected Future Seed Candidates

### Highcrown Barge Quays

Candidate id:

- `settlement_site.highcrown.barge_quays`

Parent settlement:

- `settlement.highcrown`

District anchor:

- `parentDistrictId: null`

Evidence:

- Highcrown summary explicitly says the capital has "barge quays".
- Highcrown is a current city record and a plausible parent for optional placed-site identity.

Planned classification:

- `siteType: "wharf"`

Reasoning:

The evidence names river-facing quay infrastructure directly. It can be represented as static placed-site identity while leaving route topology, cargo storage, crews, prices, stock, vendors, services, taxes, ownership, access execution, and UI state to later owners.

### Highcrown Palace Terraces

Candidate id:

- `settlement_site.highcrown.palace_terraces`

Parent settlement:

- `settlement.highcrown`

District anchor:

- `parentDistrictId: null`

Evidence:

- Highcrown `siteContext` explicitly says the city commands "palace terraces".
- The site schema allows `siteType: "palace"` for a future placed-site record.

Planned classification:

- `siteType: "palace"`

Reasoning:

The evidence names a palace landmark directly. It can be represented as static placed-site identity without adding court services, NPC staffing, access rules, law/control behavior, ownership, quest hooks, UI state, or gameplay behavior.

## 6. Rejected Or Deferred Candidates

- Highcrown market courts: deferred as a site because `settlement_district.highcrown.market_courts` is already a live district record. A later site pass needs a more discrete named market, hall, exchange, customs house, or plaza before adding site content inside that district.
- Highcrown archive districts: rejected as a site because the current evidence names districts, not a discrete archive building, administrative hall, or record vault.
- Highcrown stone bridges: deferred because the phrase is plural infrastructure context and may belong to bridgehead, route/travel, or infrastructure authority after a focused bridge pass.
- Scribes and Factors Hall, Rivermen Hall, Highcrown Chapterhouse, and Scholars Glass Hall: deferred even though guildhall names are explicit, because the first site seed should avoid starting with guild/service-authority overlap. A later guildhall-focused site pass can evaluate them with institution/service boundaries.
- Sunspire Reach guild compounds and stone bridges: deferred because this first seed stays under Highcrown and because those candidates need their own bridge/guild authority audit.
- Sacred-site, religious-hotspot, Knowledge, route/travel, economy, building/workplace, runtime, generated, and map-visual evidence: rejected as forbidden inference sources for this seed.

## 7. Proposed Future Records

These records are a future JSON preview only. They must not be copied into live content without a fresh implementation audit and focused validation.

```json
{
  "records": [
    {
      "id": "settlement_site.highcrown.barge_quays",
      "slug": "barge_quays",
      "name": "Barge Quays",
      "aliases": [],
      "summary": "Planned river wharf site within Highcrown where the capital's barge quays anchor its inland river trade identity.",
      "parentSettlementId": "settlement.highcrown",
      "parentDistrictId": null,
      "siteType": "wharf",
      "functionalTags": [
        "barge_traffic",
        "cargo_landing",
        "river_trade"
      ],
      "placeRoleTags": [
        "imperial_capital",
        "river_capital"
      ],
      "status": "planned",
      "sourceAuthorityNotes": [
        "Highcrown summary explicitly references barge quays."
      ],
      "notes": [
        "Static placed-site identity only; no route topology, pathfinding, cargo inventory, storage, prices, vendors, services, ownership, UI, or gameplay behavior."
      ]
    },
    {
      "id": "settlement_site.highcrown.palace_terraces",
      "slug": "palace_terraces",
      "name": "Palace Terraces",
      "aliases": [],
      "summary": "Planned palace landmark site within Highcrown where terraced palace grounds mark the capital's imperial bluff identity.",
      "parentSettlementId": "settlement.highcrown",
      "parentDistrictId": null,
      "siteType": "palace",
      "functionalTags": [
        "palace_precinct",
        "court_presence"
      ],
      "placeRoleTags": [
        "imperial_capital",
        "bluff_landmark"
      ],
      "status": "planned",
      "sourceAuthorityNotes": [
        "Highcrown siteContext explicitly references palace terraces."
      ],
      "notes": [
        "Static placed-site identity only; no court service, access control, NPC staffing, ownership, law, UI, or gameplay behavior."
      ]
    }
  ]
}
```

## 8. Validator Readiness

The current site validator is ready for a future live seed if the implementation run supplies current settlement records and validates the new wrapper before normal lint registration.

A future seed implementation must verify:

- wrapper is exactly `{ "records": [...] }`;
- ids follow `settlement_site.<settlement_slug>.<site_slug>`;
- slugs match final id segments;
- parent settlement ids exist and are current;
- site id settlement slug matches the parent settlement slug;
- `parentDistrictId` is either `null` or a current supplied district id sharing the same settlement slug;
- ids are unique;
- site slugs are unique within each parent settlement;
- arrays are duplicate-free;
- `siteType` and `status` use controlled vocabularies;
- tags are lower-snake-case;
- forbidden fields are rejected.

## 9. District Anchoring Posture

Both selected future records should use `parentDistrictId: null`.

Current evidence does not explicitly place either the Barge Quays or Palace Terraces inside `settlement_district.highcrown.archive_districts` or `settlement_district.highcrown.market_courts`.

The future seed run must not use a non-null district anchor merely because live district content exists. If a later prompt wants district-scoped sites, it must prove explicit evidence tying the site to one of the live district ids or add a separate approved district/content pass first.

## 10. Normal Content-Lint Posture

Normal content lint must remain unregistered for settlement sites while `packages/content/base/world/settlement_sites.json` is absent.

The future content seed implementation should create `packages/content/base/world/settlement_sites.json` and register `world.settlement_sites` in normal content lint in the same approved run, after focused validation passes.

The existing district lint registration must remain intact. A future site seed should increase normal content lint from 62 checked files to 63 checked files unless unrelated changes alter the count.

## 11. Forbidden Inference Sources

Future site implementation must not infer content from:

- broad settlement summaries without explicit placed-site evidence;
- settlement administrative role alone;
- settlement economic role alone;
- `siteClass`;
- geography-only `siteContext`;
- district labels without discrete site evidence;
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
- runtime service availability;
- demo snapshots;
- generated operators;
- generic fantasy naming.

## 12. Implementation Guardrails For Future Seed Run

The future seed run should:

- create only `packages/content/base/world/settlement_sites.json` unless validation requires a smaller documentation-only deferral;
- seed exactly the two Highcrown planned records from this plan unless the fresh audit finds a blocker;
- keep `world.settlements` unchanged;
- keep `world.settlement_districts` unchanged;
- keep both site records at `parentDistrictId: null` unless a newer explicit authority source proves a live district anchor;
- register only `world.settlement_sites` in normal content lint if live site content is created;
- run the focused site validation tests;
- run normal content lint and record the new checked-file count;
- run `git diff --check`;
- run conflict-marker and trailing-whitespace scans on changed files;
- prove changed paths are limited to live site content, lint registration if needed, focused test posture if needed, and workflow docs.

## 13. Explicit Non-Goals

- no live site content in this run;
- no settlement edits;
- no district content edits;
- no schema edits;
- no validator edits;
- no test edits;
- no normal content-lint registration for sites;
- no region, locality, map-feature, building, workplace, infrastructure, route/travel, Knowledge, sacred-site, religious-hotspot, polity, economy, item, quest, NPC, family, civic, service, housing/property, or magic content edits;
- no coordinates, geometry, pathfinding, map marker, route node, service execution, vendor stock, price, tax, law, control, ownership, NPC schedule, quest trigger, discovery state, Knowledge unlock, UI state, storage state, command, event, reward, migration, save/account, runtime, or gameplay behavior;
- no transition to `0.6.0`.

## 14. Next Recommended Version

`Version 0.5.260 - First Settlement Site Content Seed`

That run may create the first live `world.settlement_sites` content file and normal content-lint registration only if it repeats the current path audits, validates exactly the approved tiny Highcrown seed, and preserves all non-runtime guardrails above.
