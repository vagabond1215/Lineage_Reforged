# Settlement Site Schema Plan

Source version/run: Version 0.5.254 - Settlement Site Schema Plan
Date: 2026-06-28
Status: approved documentation-only schema plan; no implementation permission

## 1. Decision Summary

Approve a future strict, content-free `world.settlement_sites` schema posture for optional authored placed settlement-site records.

This run does not create `packages/content/base/world/settlement_sites.json`, `packages/schemas/world/settlement-site.schema.json`, `tools/content-lint/settlement-sites.mjs`, tests, normal content-lint registration, runtime behavior, UI, storage, commands, events, rewards, migrations, or gameplay behavior.

Future settlement sites must remain separate records parented by settlements, with optional district anchoring only when explicitly provided. They must not be embedded into `world.settlements`, and settlements must not grow reverse site arrays.

## 2. Current Authority Context

Current local inspection confirms:

- `world.settlements` remains the canonical settlement identity and broad place authority.
- `packages/content/base/world/settlements.json` exists with 88 settlement records and 18 dependent settlement records.
- `packages/schemas/world/settlement.schema.json` owns the strict live settlement contract, including `siteClass` and `siteContext` identity fields.
- No live district, ward, placed-building, service-instance, or placed-site record fields are present in the settlement schema.
- `packages/content/base/world/settlement_sites.json` does not exist.
- `packages/schemas/world/settlement-site.schema.json` does not exist.
- `tools/content-lint/settlement-sites.mjs` does not exist.
- `tests/unit/settlement-site-validation.test.mjs` does not exist.
- Future district content, schema, validator, and focused test paths remain absent.
- Runtime-derived `SettlementDistrictState`, `SettlementPlotState`, `SettlementBuildingState`, service availability, and property/access projections exist in shared/engine surfaces, but they are deterministic simulation/projection state, not static authored site authority.

## 3. Future Collection Identity

Future collection name:

- `world.settlement_sites`

Candidate future content path:

- `packages/content/base/world/settlement_sites.json`

Candidate future schema path:

- `packages/schemas/world/settlement-site.schema.json`

Candidate future validator path:

- `tools/content-lint/settlement-sites.mjs`

Candidate future focused test path:

- `tests/unit/settlement-site-validation.test.mjs`

Future id pattern:

- `settlement_site.<settlement_slug>.<site_slug>`

Future slug pattern:

- `<site_slug>`
- lower-snake-case site slug only
- must match the final id segment

Future wrapper:

```json
{
  "records": []
}
```

## 4. Proposed Schema Shape

Future settlement-site records should use this records-only shape:

```json
{
  "id": "settlement_site.<settlement_slug>.<site_slug>",
  "slug": "<site_slug>",
  "name": "<Site Name>",
  "aliases": [],
  "summary": "<Static descriptive placed-site identity summary.>",
  "parentSettlementId": "settlement.<settlement_slug>",
  "parentDistrictId": null,
  "siteType": "<controlled value>",
  "functionalTags": [],
  "placeRoleTags": [],
  "status": "planned",
  "sourceAuthorityNotes": [],
  "notes": []
}
```

## 5. Required Fields

Future records should require exactly these fields:

- `id`: canonical site id using `settlement_site.<settlement_slug>.<site_slug>`.
- `slug`: lower-snake-case site slug only, matching the final id segment.
- `name`: stable authored display name.
- `aliases`: duplicate-free alternate names, empty when none are approved.
- `summary`: static descriptive placed-site identity summary.
- `parentSettlementId`: current settlement id using `settlement.<settlement_slug>`.
- `parentDistrictId`: nullable district id for optional district anchoring.
- `siteType`: controlled site classification.
- `functionalTags`: duplicate-free lower-snake-case descriptive function tags.
- `placeRoleTags`: duplicate-free lower-snake-case descriptive role/context tags.
- `status`: lifecycle value.
- `sourceAuthorityNotes`: duplicate-free notes proving explicit authored support.
- `notes`: optional non-authoritative authoring notes, empty when unused.

## 6. Optional Fields

First implementation should exclude optional fields unless a later prompt proves a concrete validation need.

Optional future fields to evaluate later:

- `relatedBuildingTemplateIds`: reusable building-template references only, not placed instances.
- `relatedWorkplaceIds`: reusable workplace references only, not workforce or production execution.
- `relatedInfrastructureIds`: reusable infrastructure references only, not construction state.
- `visualReferenceNotes`: non-authoritative visual-reference notes only.
- `accessContextNotes`: descriptive access context only, not access execution.
- `economyContextNotes`: descriptive economic context only, not prices, stock, or market state.
- `religiousContextNotes`: descriptive religious context only, not sacred-site or hotspot ownership.
- `knowledgeContextNotes`: descriptive Knowledge context only, not discovery or progress state.

## 7. Controlled Vocabularies

Lifecycle values:

- `planned`
- `active`
- `retired`

First-pass `siteType` values:

- `market`
- `palace`
- `citadel`
- `gatehouse`
- `dock`
- `wharf`
- `shrine`
- `temple_compound`
- `guildhall`
- `mill`
- `bridgehead`
- `caravanserai`
- `workshop_cluster`
- `civic_hall`
- `landmark_plaza`
- `watch_post`
- `warehouse`
- `inn`
- `stable`
- `customs_house`
- `administrative_hall`
- `other_landmark`

`functionalTags` and `placeRoleTags` must be lower-snake-case descriptive tags only. Tags must not encode runtime state, service execution, inventories, prices, ownership, law/tax/control, quest state, discovery state, access state, UI behavior, or gameplay effects.

## 8. Parent-Settlement And Optional District Anchoring Rules

Every site must have exactly one `parentSettlementId`.

The referenced settlement must exist in current `world.settlements`.

The referenced settlement must be current under existing settlement authority semantics. Missing or retired parent settlements must fail validation if settlement lifecycle semantics are later introduced.

The site id must include the parent settlement slug.

The site id parent slug must match the slug segment of `parentSettlementId`.

Sites must not be embedded into `world.settlements`.

`world.settlements` must not grow reverse site arrays, site counts, or placed-site inventories in the first schema implementation.

`parentDistrictId` should be required as a field but nullable.

`parentDistrictId: null` should be valid because `world.settlement_districts` may not exist yet or a site may not be district-scoped.

If `parentDistrictId` is non-null in a future implementation, it must reference a valid `settlement_district.<settlement_slug>.<district_slug>` id.

A non-null `parentDistrictId` must share the same settlement slug as `parentSettlementId`.

The first site schema/validator should not require district content to exist unless live district authority exists.

Do not embed reverse site arrays into future district records unless a later schema explicitly approves it.

## 9. Building, Workplace, Economy, Travel, And Knowledge Boundaries

Building and workplace templates may be referenced later only as reusable definitions. They are not placed instances, current operation, or local service execution.

A future site record must not copy building/workplace fields, production rules, tool requirements, service execution, stock, prices, storage profiles, workforce details, or hosted operation state.

Settlement economy content may provide descriptive context later, but it must not create canonical placed sites by inference.

Route/travel content may provide access context later, but it must not define local pathfinding, street graphs, route costs, travel estimates, or access execution for placed sites.

Knowledge snippets may describe site facts after site authority exists, but they must not create site authority or grant discovery, unlocks, access, services, or rewards.

Sacred-site and religious-hotspot authorities may specialize religious place identity where explicitly authored, but they must not automatically create ordinary settlement sites.

## 10. Forbidden Fields And Inference Sources

Future settlement-site records must reject these field families:

- coordinates, `x`, `y`, latitude, longitude, polygons, points, bounds, bounding boxes, map asset references, UI marker state;
- route ids, pathfinding costs, travel estimates, street graph ids;
- building inventories, workplace inventories, service inventories, vendor stock, prices, inventory, or storage state;
- NPC ids, ownership records, population counts, workforce counts;
- access-control execution;
- law, tax, control, polity, claim, border, or jurisdiction ids;
- quest ids, event refs, command refs, reward refs;
- Knowledge unlock, discovery, reveal, or progress state;
- sacred-site ownership, religious-hotspot ownership, or implied religious authority;
- runtime state, save/storage state, or gameplay effects.

Future settlement sites must not be inferred from these sources alone:

- settlement summaries;
- settlement administrative roles;
- settlement economic roles;
- settlement `siteClass`;
- settlement `siteContext`;
- district type labels;
- building compatibility lists;
- workplace requirements;
- infrastructure requirements;
- route/travel adjacency;
- map pixels or coordinates;
- visual labels or geometry;
- region/locality proximity;
- Knowledge snippets;
- quest metadata;
- sacred-site or religious-hotspot prose;
- runtime `SettlementBuildingState`;
- runtime `SettlementPlotState`;
- runtime `SettlementDistrictState`;
- runtime service availability;
- demo snapshots;
- generated operators;
- generic fantasy naming.

## 11. Future Validator Requirements

A future validator should enforce:

- strict `{ "records": [...] }` wrapper shape;
- non-empty records once live site content exists;
- `id` matching `settlement_site.<settlement_slug>.<site_slug>`;
- `slug` matching the final id segment;
- current `parentSettlementId` resolution against `world.settlements`;
- id parent slug coherence with `parentSettlementId`;
- `parentDistrictId` is either `null` or a valid `settlement_district.<settlement_slug>.<district_slug>` id;
- non-null `parentDistrictId` shares the same settlement slug as `parentSettlementId`;
- if live district content exists and a site references a district, the district must resolve;
- unique ids;
- unique site slugs within the same parent settlement;
- duplicate-free `aliases`, `functionalTags`, `placeRoleTags`, `sourceAuthorityNotes`, and `notes`;
- controlled `siteType` and `status` vocabularies;
- lower-snake-case tag posture;
- no forbidden fields;
- no site record for a missing or retired settlement;
- no dependency on runtime projections, UI, Knowledge, routes, economy execution, services, quests, events, commands, rewards, storage, or gameplay systems.

## 12. Future Normal Content-Lint Posture

Do not register `world.settlement_sites` in normal content lint until live content exists.

A future schema/validator implementation may add schema and focused in-memory tests while the live content file remains absent.

A future content seed must create the content file and then register normal lint in the same approved implementation run.

## 13. Future Seed-Readiness Rules

A future first seed should require:

- explicit authored site evidence or an explicit approved site type for each candidate;
- current parent settlement evidence;
- district reference only if district authority exists and validates;
- no inference from runtime building, plot, district, site, service, or property projections;
- no inference from building/workplace/economy compatibility alone;
- no inference from route, map, Knowledge, sacred-site, religious-hotspot, or quest evidence alone;
- no geometry, route costs, services, NPCs, ownership, inventories, pricing, law/tax/control, quests, Knowledge state, UI state, storage state, or gameplay behavior;
- `status: "planned"` by default;
- a tiny first batch, preferably one or two records;
- exact validation through the future helper before normal lint registration.

## 14. Explicit Non-Goals

- no schema file;
- no validator helper;
- no content JSON;
- no normal content-lint registration;
- no focused tests;
- no settlement, district, region, locality, map-feature, building, workplace, infrastructure, route/travel, Knowledge, sacred-site, religious-hotspot, polity, economy, item, quest, NPC, family, or civic content edits;
- no runtime, UI, storage, command, event, reward, migration, save/account, or gameplay behavior;
- no service execution, vendor stock, ownership, tax/law/control rules, NPC schedules, quest triggers, access execution, discovery state, or Knowledge unlocks;
- no transition to `0.6.0`.

## 15. Next Recommended Version

`Version 0.5.255 - Settlement District Schema And Validator`

That run should implement only the already planned future `world.settlement_districts` schema, isolated validator helper, and focused in-memory validation tests without live district content, normal content-lint registration, runtime behavior, UI, storage, commands, events, rewards, migrations, or gameplay behavior unless a newer prompt explicitly changes scope.
