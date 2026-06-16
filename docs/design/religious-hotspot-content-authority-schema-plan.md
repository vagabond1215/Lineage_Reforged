# Religious Hotspot Content Authority Schema Plan

Source version/run: Version 0.5.174 - Religious Hotspot Content Authority Schema Plan
Date: 2026-06-16
Status: documentation-only schema and semantic-validator plan; no implementation

## Purpose

This plan defines the exact future schema and semantic-validator contract for the selected `world.religious_hotspots` content authority.

It implements no schema, content JSON, validator, tests, snippets, runtime behavior, UI, storage, persistence, event, reward, command, faction, reputation, law, favorability, elemental alignment, conversion, apostasy, spell, Magic Study, Prestige, family, or gameplay behavior.

The selected authority remains the separate future `world.religious_hotspots` collection from `docs/design/religious-hotspot-content-authority-plan.md`. `world.sacred_sites` remains deferred as a possible later specialization.

## Current Authority Recap

- `knowledge_domain.religion` is active.
- Exactly two Religion snippets are live:
  - `knowledge_snippet.religion.elemental_pantheon.identification`
  - `knowledge_snippet.religion.light_lady.identification`
- Religion trial, completion, and visibility policy refs remain null.
- Current Knowledge snippet direct Religion subjects are exactly `religion` and `deity`.
- There is no live `religious_hotspot` Knowledge subject.
- There is no live religious-hotspot content collection.
- World religion content has top-level `religion.*` records, nested `deity.*` records, nested `religious_order.*` organization records, and `religious_site.*` structure-type records.
- Place content can support coherence validation: regions expose `parentRegionId`, region localities expose `macroRegionId` and `regionId`, and settlements expose `macroRegionId`, `regionId`, and `localityBandId`.

## Future Files

Future implementation should use these paths:

- Content file: `packages/content/base/world/religious_hotspots.json`
- Schema file: `packages/schemas/world/religious-hotspot.schema.json`
- Semantic validator: `tools/content-lint/religious-hotspots.mjs`
- Focused tests: `tests/unit/religious-hotspots-validation.test.mjs`
- Normal lint integration: `tools/content-lint/index.mjs`

Do not add an empty live content file only to reserve the path. Schema and focused-validator work can land first with in-memory fixtures. Normal lint checked-file count should remain `56` until a future seed run adds and registers the live content file; that seed run should move normal lint to `57` checked files.

## Wrapper Shape

The future content file should use the current world-content wrapper convention:

```json
{
  "records": []
}
```

Wrapper rules:

- top-level `records` is required;
- additional top-level properties are forbidden;
- `records` contains hotspot records;
- live seed content should use at least one record;
- focused tests may use empty or mutated fixture wrappers only when proving wrapper failure modes.

## Record Shape

Required first-version fields:

- `id`
- `slug`
- `name`
- `summary`
- `status`
- `placeAnchor`
- `religionIds`
- `hotspotType`
- `sacredSiteType`
- `hotspotIntensity`
- `publicPosture`
- `mismatchPressure`
- `pilgrimageStatus`
- `sourceAuthorityNotes`
- `notes`

Optional first-version fields:

- `deityIds`
- `dominantFaithIds`
- `toleratedFaithIds`
- `restrictedFaithIds`

Deferred first-version field:

- `religiousOrderIds`

`religiousOrderIds` should wait for a dedicated order-authority decision or for the schema-and-validator implementation to explicitly add a narrow nested-order resolver. Until then, order involvement belongs in `sourceAuthorityNotes` or `notes`, not in a reference field.

## Field Contract

`id`

- string
- pattern: `^religious_hotspot\.[a-z0-9]+(?:_[a-z0-9]+)*$`
- terminal slug must match `slug`
- no aliases, migration ids, retired ids, old-save compatibility ids, or converted-id behavior

`slug`

- string
- pattern: `^[a-z0-9]+(?:_[a-z0-9]+)*$`

`name`

- non-empty string

`summary`

- non-empty string
- descriptive only; must not define mechanics, access gates, penalties, rewards, or runtime consequences

`status`

- enum: `planned`, `active`, `deferred`
- `planned`: valid authored candidate, not yet referenceable by live snippets
- `active`: complete validated authority record, eligible for future snippet references only after direct `religious_hotspot` subject support exists
- `deferred`: retained proposal, not referenceable

`placeAnchor`

- strict object with no additional properties
- allowed fields:
  - `macroRegionId`
  - `regionId`
  - `regionLocalityId`
  - `settlementId`
- at least one of `regionId`, `regionLocalityId`, or `settlementId` is required
- `macroRegionId` is optional but must be coherent if present

`religionIds`

- non-empty unique array of `religion.*` ids
- every id must resolve to `world.religions`

`deityIds`

- optional unique array of `deity.*` ids
- every id must resolve to a flattened nested deity record from `world.religions`
- every listed deity must belong to at least one listed `religionIds` parent

`dominantFaithIds`

- optional unique array of `religion.*` ids
- active records must provide at least one dominant faith
- every id must resolve to `world.religions`
- every id must also appear in `religionIds`

`toleratedFaithIds`

- optional unique array of `religion.*` ids
- every id must resolve to `world.religions`

`restrictedFaithIds`

- optional unique array of `religion.*` ids
- every id must resolve to `world.religions`

`hotspotType`

- enum:
  - `settlement_shrine`
  - `locality_shrine_cluster`
  - `pilgrimage_waypoint`
  - `contested_sacred_site`
  - `religious_district`
  - `natural_sacred_place`
  - `memorial_site`

`sacredSiteType`

- enum:
  - `none`
  - `shrine`
  - `temple`
  - `great_temple`
  - `convergence_site`
  - `grove`
  - `spring`
  - `beacon`
  - `memorial`

`hotspotIntensity`

- enum:
  - `minor`
  - `notable`
  - `strong`
- Defer `fanatical` or equivalent values until a later consequence-boundary plan proves they are descriptive only.

`publicPosture`

- enum:
  - `indifferent`
  - `universal`
  - `tolerant`
  - `aligned`
  - `exclusive`
- Defer `fanatical`, `hostile`, and enforcement-like values until scoped law/faction/reputation owners exist.

`mismatchPressure`

- enum:
  - `none`
  - `social_discomfort`
- Defer `restricted_services`, `hostile_scrutiny`, fines, bans, law pressure, faction consequences, and access mechanics until dedicated owners exist.

`pilgrimageStatus`

- enum:
  - `none`
  - `local`
  - `regional`
  - `major`
  - `seasonal`

`sourceAuthorityNotes`

- non-empty unique array of non-empty strings
- records why this hotspot belongs to the referenced place and religion authorities
- may mention unresolved order/site context, but must not create reference authority for deferred fields

`notes`

- non-empty unique array of non-empty strings
- at least one note must explicitly state the record is descriptive and creates no runtime consequence, favorability, law, access, reward, command, or gameplay behavior

## Schema Contract

The future JSON Schema should:

- use JSON Schema draft 2020-12;
- validate record shape strictly with `additionalProperties: false`;
- require all required first-version fields;
- use `minLength`, `minItems`, `uniqueItems`, pattern constraints, and enum constraints;
- avoid defaults;
- avoid nullable loose fields except where a future plan explicitly requires them;
- reject runtime, state, mutable, reward, command, UI, persistence, law, faction, reputation, favorability, alignment, conversion, apostasy, Prestige, family, spell, and gameplay fields.

The schema should not attempt every cross-file rule. Cross-file and conditional rules belong to the semantic validator.

## Semantic Validator Contract

Create a pure validator exported from `tools/content-lint/religious-hotspots.mjs`.

Recommended function:

```js
validateReligiousHotspots({
  wrapper,
  schema,
  religions,
  regions,
  regionLocalities,
  settlements,
  relativePath = "packages/content/base/world/religious_hotspots.json"
})
```

Validator rules:

- validate the wrapper and each record against the schema first;
- reject duplicate hotspot ids;
- reject malformed or missing canonical ids in dependency authorities;
- reject duplicate ids in dependency authority maps;
- enforce `id` terminal slug parity with `slug`;
- resolve all `religionIds`;
- resolve all `deityIds`;
- enforce deity-to-parent-religion coherence;
- reject `dominantFaithIds`, `toleratedFaithIds`, and `restrictedFaithIds` that do not resolve to known religions;
- require active records to have at least one `dominantFaithIds` entry;
- require `dominantFaithIds` to be a subset of `religionIds`;
- require `dominantFaithIds`, `toleratedFaithIds`, and `restrictedFaithIds` to be pairwise disjoint;
- resolve place anchors against current region, locality, and settlement authorities;
- require `regionId`, when present, to reference a `subregion`;
- require `macroRegionId`, when present, to reference a `continent` or `island_system`;
- require `regionLocalityId`, when present, to reference a known region locality;
- require `settlementId`, when present, to reference a known settlement;
- when multiple place fields are present, require them to be coherent using current fields:
  - locality `regionId` must match anchor `regionId`;
  - locality `macroRegionId` must match anchor `macroRegionId` if both are present;
  - settlement `regionId` must match anchor `regionId` if both are present;
  - settlement `localityBandId` must match anchor `regionLocalityId` if both are present;
  - settlement `macroRegionId` must match anchor `macroRegionId` if both are present;
  - if a settlement and locality are present but `regionId` or `macroRegionId` is omitted, infer coherence from the settlement/locality fields and reject mismatch;
- reject active records whose `notes` do not include a no-runtime/no-consequence boundary;
- reject fields that try to encode runtime consequences, rewards, law/faction effects, spell effects, favorability, alignment, conversion, apostasy, or Prestige behavior;
- return deterministic diagnostics in stable record-id order;
- mutate no inputs;
- read no files from inside the validator.

If `religiousOrderIds` is added in the future, the same validator should flatten nested `religious_order.*` organization records from `world.religions`, reject duplicates and malformed ids, resolve every listed order, and require each order to belong to at least one listed parent religion.

## Focused Test Plan

The future focused test file should cover:

- valid planned hotspot fixture;
- valid active hotspot fixture with dominant faith and no-runtime notes;
- schema rejection for missing required fields;
- schema rejection for additional properties;
- duplicate hotspot id rejection;
- id/slug mismatch rejection;
- unresolved religion id rejection;
- unresolved deity id rejection;
- deity listed under an unlisted parent religion rejection;
- duplicate or malformed religion/deity authority rejection;
- unresolved dominant/tolerated/restricted faith id rejection;
- active record without dominant faith rejection;
- contradictory dominant/tolerated/restricted overlap rejection;
- unresolved region, locality, and settlement anchors;
- region anchor that is not a subregion;
- macro-region anchor that is not a continent or island system;
- locality-to-region mismatch rejection;
- settlement-to-locality mismatch rejection;
- settlement-to-region mismatch rejection;
- missing no-runtime/no-consequence note rejection for active records;
- runtime/consequence/favorability/law/reward/state field rejection;
- normal-lint integration remains absent until live seed content is intentionally added.

Do not update existing Knowledge snippet tests during the schema-and-validator implementation unless direct `religious_hotspot` subject support is explicitly in scope.

## Knowledge Snippet Boundary

This plan does not add a direct Knowledge subject. Future `religious_hotspot` snippet support requires a separate vocabulary plan after the content authority has schema, validator, and seed records.

Do not use `custom`, `religion`, `deity`, `region`, `settlement`, shrine, sacred-site, or institution subjects as a workaround for missing hotspot subject support.

## Future Sequence

Recommended next runs:

1. `Version 0.5.175 - Religious Hotspot Content Authority Schema And Validator`
2. `Version 0.5.176 - Religious Hotspot Content Authority Seed Plan`
3. `Version 0.5.177 - Religious Hotspot Content Authority Seed`
4. `Version 0.5.178 - Religious Hotspot Knowledge Subject Vocabulary Plan`
5. `Version 0.5.179 - Religious Hotspot Knowledge Subject Schema And Validator`
6. `Version 0.5.180 - Religious Hotspot Knowledge Snippet Seed Plan`

`Religious Favorability And Elemental Alignment Plan` remains optional after the hotspot authority lane or earlier only if explicitly prioritized. It must remain design-only first and must not imply runtime favor, conversion, law, faction, access, magic, family, Prestige, or gameplay behavior.

## Non-Goals

Do not implement or plan inside this run:

- live hotspot content JSON;
- `world.sacred_sites`;
- direct `religious_hotspot` Knowledge subject support;
- live hotspot snippets;
- snippet progress, evidence, trials, readiness, completion, or visibility behavior;
- runtime shrine, pilgrimage, temple, order, service, access, law, faction, reputation, or favorability mechanics;
- Religious Favorability and Elemental Alignment;
- conversion, apostasy, enforcement, marriage, family, Prestige, Magic Study, spell, reward, event, command, UI, storage, persistence, or gameplay systems;
- survival/builder/RPG/MMO gap-audit implementation.

## Open Questions For Later

- Which exact Glasswake/Lantern Isles hotspot records should be seeded first?
- Should `religiousOrderIds` be added in the first implementation by building a nested order resolver, or remain deferred until religious-order subject authority exists?
- Should a future sacred-site specialization split named relic, route, quest, service, pilgrimage inventory, or map presentation from the descriptive hotspot collection?
- Should favorability/alignment planning wait until hotspot snippets are live, or be prioritized as a separate design-only lane after schema validation?

## Next Recommended Version

Version 0.5.175 - Religious Hotspot Content Authority Schema And Validator
