# Settlement District Schema Plan

Source version/run: Version 0.5.253 - Settlement District Schema Plan
Date: 2026-06-28
Status: approved documentation-only schema plan; no implementation permission

## 1. Decision Summary

Approve a future strict, content-free `world.settlement_districts` schema posture for optional authored intra-settlement district records.

This run does not create `packages/content/base/world/settlement_districts.json`, `packages/schemas/world/settlement-district.schema.json`, `tools/content-lint/settlement-districts.mjs`, tests, normal content-lint registration, runtime behavior, UI, storage, commands, events, rewards, migrations, or gameplay behavior.

Future districts must remain separate records parented by settlements. They must not be embedded into `world.settlements`, and settlements must not grow reverse district arrays.

## 2. Current Authority Context

Current local inspection confirms:

- `world.settlements` remains the canonical settlement identity and broad place authority.
- `packages/content/base/world/settlements.json` exists with 88 settlement records and 18 dependent settlement records.
- `packages/schemas/world/settlement.schema.json` owns the strict live settlement contract, including `siteClass` and `siteContext` identity fields.
- No live district, ward, placed-building, service-instance, or placed-site record fields are present in the settlement schema.
- `packages/content/base/world/settlement_districts.json` does not exist.
- `packages/schemas/world/settlement-district.schema.json` does not exist.
- `tools/content-lint/settlement-districts.mjs` does not exist.
- `tests/unit/settlement-district-validation.test.mjs` does not exist.
- Runtime-derived `SettlementDistrictState`, `SettlementPlotState`, and `SettlementBuildingState` exist in shared/engine surfaces, but they are deterministic simulation/projection state, not static authored content authority.

## 3. Future Collection Identity

Future collection name:

- `world.settlement_districts`

Candidate future content path:

- `packages/content/base/world/settlement_districts.json`

Candidate future schema path:

- `packages/schemas/world/settlement-district.schema.json`

Candidate future validator path:

- `tools/content-lint/settlement-districts.mjs`

Candidate future focused test path:

- `tests/unit/settlement-district-validation.test.mjs`

Future id pattern:

- `settlement_district.<settlement_slug>.<district_slug>`

Future slug pattern:

- `<district_slug>`
- lower-snake-case district slug only

Future wrapper:

```json
{
  "records": []
}
```

## 4. Proposed Schema Shape

Future district records should use this records-only shape:

```json
{
  "id": "settlement_district.<settlement_slug>.<district_slug>",
  "slug": "<district_slug>",
  "name": "<District Name>",
  "aliases": [],
  "summary": "<Static descriptive district identity summary.>",
  "parentSettlementId": "settlement.<settlement_slug>",
  "districtType": "<controlled value>",
  "functionalTags": [],
  "placeRoleTags": [],
  "status": "planned",
  "sourceAuthorityNotes": [],
  "notes": []
}
```

## 5. Required Fields

Future records should require exactly these fields:

- `id`: canonical district id using `settlement_district.<settlement_slug>.<district_slug>`.
- `slug`: lower-snake-case district slug only, matching the final id segment.
- `name`: stable authored display name.
- `aliases`: duplicate-free alternate names, empty when none are approved.
- `summary`: static descriptive district identity summary.
- `parentSettlementId`: current settlement id using `settlement.<settlement_slug>`.
- `districtType`: controlled district classification.
- `functionalTags`: duplicate-free lower-snake-case descriptive function tags.
- `placeRoleTags`: duplicate-free lower-snake-case descriptive role/context tags.
- `status`: lifecycle value.
- `sourceAuthorityNotes`: duplicate-free notes proving explicit authored support.
- `notes`: optional non-authoritative authoring notes, empty when unused.

## 6. Optional Fields

First implementation should exclude optional fields unless a later prompt proves a concrete validation need.

Optional future fields to evaluate later:

- `localityNotes`: descriptive locality/context notes only.
- `visualReferenceNotes`: non-authoritative visual-reference notes only.
- `relatedSettlementSiteIds`: future site references only after `world.settlement_sites` exists.
- `districtGroup`: optional grouping label for related districts only.
- `adjacencyNotes`: descriptive adjacency notes only, not routes, costs, pathfinding, or geometry.

## 7. Controlled Vocabularies

Lifecycle values:

- `planned`
- `active`
- `retired`

First-pass `districtType` values:

- `market_quarter`
- `harbor_ward`
- `temple_quarter`
- `citadel_ward`
- `craft_district`
- `farm_fringe`
- `gate_district`
- `riverfront_district`
- `noble_terrace`
- `outer_sprawl`
- `residential_quarter`
- `civic_quarter`
- `mixed_district`

`functionalTags` and `placeRoleTags` must be lower-snake-case descriptive tags only. They must not execute services, imply inventories, create vendors, encode prices, assign ownership, define law/tax/control, grant quests, reveal Knowledge, drive UI state, or create gameplay effects.

## 8. Parent-Settlement Anchoring Rules

Every district must have exactly one `parentSettlementId`.

The parent settlement must exist in current `world.settlements`.

The parent settlement must be current. Retired or missing parent settlements must fail validation.

The parent settlement slug in the district id must match the slug segment of `parentSettlementId`.

Districts must not be embedded into `world.settlements`.

`world.settlements` must not grow reverse district arrays, district counts, or derived district inventories.

Small settlements may have no district records.

## 9. Forbidden Fields And Inference Sources

Future district records must reject these field families:

- coordinates, `x`, `y`, latitude, longitude, polygons, points, bounds, bounding boxes, map asset references, UI marker state;
- route ids, pathfinding costs, travel estimates;
- building, workplace, service, vendor, stock, price, inventory, or storage state;
- NPC ids, ownership records, population counts, workforce counts;
- law, tax, control, polity, claim, border, or jurisdiction ids;
- quest ids, event refs, command refs, reward refs;
- Knowledge unlock, discovery, reveal, or progress state;
- sacred-site ownership, religious-hotspot ownership, or implied religious authority;
- runtime state, save/storage state, or gameplay effects.

Future districts must not be inferred from these sources alone:

- settlement summaries;
- administrative roles;
- economic roles;
- `siteClass`;
- `siteContext`;
- building compatibility;
- workplace requirements;
- infrastructure requirements;
- route/travel adjacency;
- map pixels or coordinates;
- visual labels or geometry;
- region/locality proximity;
- Knowledge snippets;
- quest metadata;
- sacred-site or religious-hotspot prose;
- runtime `SettlementDistrictState`;
- runtime plot/building state;
- demo snapshots;
- generated operators;
- generic fantasy naming.

## 10. Future Validator Requirements

A future validator should enforce:

- strict `{ "records": [...] }` wrapper shape;
- non-empty records once live district content exists;
- id/slug coherence;
- id parent slug coherence with `parentSettlementId`;
- current parent settlement resolution;
- unique ids;
- unique district slugs within each parent settlement;
- duplicate-free `aliases`, `functionalTags`, `placeRoleTags`, `sourceAuthorityNotes`, and `notes`;
- controlled `districtType` and `status` vocabularies;
- lower-snake-case tag posture;
- no forbidden fields;
- no missing or retired parent settlement;
- no dependency on settlement sites, runtime projections, UI, Knowledge, routes, economy, services, quests, events, commands, rewards, storage, or gameplay systems.

## 11. Future Normal Content-Lint Posture

Do not register `world.settlement_districts` in normal content lint until live content exists.

A future schema/validator implementation may add focused in-memory tests only while the live content file remains absent.

A future content seed must create the content file and then register normal lint in the same approved implementation run.

## 12. Future Seed-Readiness Rules

A future first seed should require:

- explicit authored district evidence or an explicit approved district type for each candidate;
- current parent settlement resolution;
- no runtime, building, workplace, economy-only, route-only, UI-only, Knowledge-only, quest-only, or generic-fantasy inference;
- no geometry, routes, services, NPCs, ownership, inventories, pricing, law/tax/control, quests, Knowledge state, UI state, storage state, or gameplay behavior;
- `status: "planned"` by default;
- a tiny first batch, preferably one or two records;
- exact validation through the future helper before normal lint registration.

## 13. Explicit Non-Goals

- no schema file;
- no validator helper;
- no content JSON;
- no normal content-lint registration;
- no focused tests;
- no settlement, region, locality, map-feature, building, workplace, infrastructure, route/travel, Knowledge, sacred-site, religious-hotspot, polity, economy, item, quest, NPC, family, or civic content edits;
- no runtime, UI, storage, command, event, reward, migration, save/account, or gameplay behavior;
- no service execution, vendor stock, ownership, tax/law/control rules, NPC schedules, quest triggers, discovery state, or Knowledge unlocks;
- no transition to `0.6.0`.

## 14. Next Recommended Version

`Version 0.5.254 - Settlement Site Schema Plan`

That run should remain docs-first. It should decide the exact future `world.settlement_sites` schema posture without creating schemas, validators, content, normal lint registration, runtime behavior, UI, storage, commands, events, rewards, migrations, or gameplay behavior unless a newer prompt explicitly changes scope.
