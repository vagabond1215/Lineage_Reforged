# Settlement Knowledge Subject Validator Support Plan

Source version/run: Version 0.5.282 - Settlement Knowledge Subject Validator Support Plan
Date: 2026-07-07

## Decision Summary

Select Option A: implement focused direct `settlement` Knowledge subject validator support before adding any parent `settlement.highcrown` General Lore snippet.

The audit confirms that schema and domain vocabulary already allow direct `settlement` subjects, but normal Knowledge snippet validation does not yet pass live `world.settlements` as a direct subject authority. Focused snippet tests also cover direct `settlement_district` and `settlement_site` subjects, but not direct `settlement` subjects.

The next implementation should wire the existing settlement records into `validateKnowledgeSnippets` as a direct `settlement` subject authority and add focused positive and negative tests. It should not add snippets.

## Current Versioning Posture

Latest completed primary run before this plan:

- `Version 0.5.281 - Highcrown Settlement Knowledge Snippet Seed Plan`

This plan is:

- `Version 0.5.282 - Settlement Knowledge Subject Validator Support Plan`

Next recommended implementation:

- `Version 0.5.283 - Settlement Knowledge Subject Validator Support`

## Current Highcrown Parent Snippet Dependency

`Version 0.5.281` selected the future parent snippet:

- id: `knowledge_snippet.general_lore.highcrown.identification`
- domainId: `knowledge_domain.general_lore`
- subjectType: `settlement`
- subjectId: `settlement.highcrown`
- category/source: `identification` / `book_study`
- title: `Recognizing Highcrown`

That snippet remains deferred. It should not be added until direct `settlement` subject authority validation and focused tests land.

The future snippet must remain static settlement identity only. It must not imply settlement access, services, vendors, prices, trade execution, travel routes, dock operation, cargo inventory, storage, palace access, court/law mechanics, ownership, NPC staffing, access rules, UI, runtime, rewards, unlocks, discovery state, Knowledge progress state, or gameplay behavior.

## Current Settlement Authority Posture

`settlement.highcrown` exists in `packages/content/base/world/settlements.json`.

Current live evidence:

- id: `settlement.highcrown`
- regionId: `region.sapphire_rivers`
- summary: `Valtherion's imperial river capital, where crown roads, archive districts, and barge quays govern the richest continent on the map.`
- siteContext: `Highcrown spans bluffs above the main Sapphire confluence, commanding stone bridges, palace terraces, and the empire's largest market courts.`
- identityTags include `continental_capital`, `river_capital`, `imperial_city`, and `archive_center`

The settlement records do not currently use a `status` lifecycle field. For direct settlement Knowledge subjects, the future validator should therefore be existence-backed against `world.settlements`, not active-only.

## Current Knowledge Schema And Domain Posture

The structural vocabulary already supports direct settlement subjects:

- `packages/schemas/player/knowledge_snippet.schema.json` includes `settlement`.
- `packages/schemas/player/knowledge-domain-registry.schema.json` includes `settlement`.
- `knowledge_domain.general_lore.canonicalSubjectTypes` includes `settlement`.
- `knowledge_domain.general_lore.relatedContentCollections` includes `world.settlements`.
- General Lore also includes `settlement_district`, `settlement_site`, `world.settlement_districts`, and `world.settlement_sites`.
- General Lore already supports `identification` and `book_study`.
- General Lore policy refs remain `null`.

No schema or registry/domain/trial-policy change is needed for direct settlement subject validation.

## Current Semantic Validator Posture

`tools/content-lint/index.mjs` loads `packages/content/base/world/settlements.json` into `settlementWrapper`, but currently passes settlement records only through `locationAuthorities.settlements`.

Direct snippet subject authorities currently include:

- `flora`
- `fauna`
- `mineral`
- `religion`
- `deity`
- `religious_hotspot`
- `sacred_site`
- `settlement_district`
- `settlement_site`
- `region`

There is no direct `settlement` entry in `subjectAuthorities`.

`tools/content-lint/knowledge-snippets.mjs` already has the generic fail-closed behavior needed for direct settlement subjects:

- each snippet subject type must have a matching `subjectAuthorities[record.subjectType]`
- subject ids must use the configured prefix
- subject ids can be checked against an optional id pattern
- subject ids must resolve to records in the configured authority collection

Because `settlement` is not currently passed, a direct settlement snippet would fail with no subject authority. The existing generic validator does not need broad behavior changes for this use case.

## Current Focused Test Posture

`tests/unit/knowledge-snippets-validation.test.mjs` loads `settlements.json`, but its `makeInput().subjectAuthorities` currently mirrors normal lint and does not include direct `settlement`.

The focused tests already exercise direct settlement district and site subjects, including:

- accepted direct `settlement_district` snippets
- accepted direct `settlement_site` snippets
- missing district/site subject ids
- malformed district/site subject ids
- active-only enforcement for district/site subjects
- site parent-district authority and same-settlement slug checks

They do not yet include direct settlement subject positive or negative cases.

## Settlement Subject Validation Readiness Standard

Direct `settlement` Knowledge subject validation is ready only when:

- normal content lint passes a `settlement` subject authority into `validateKnowledgeSnippets`
- the authority uses `world.settlements` as its collection id
- the authority uses `settlement.` as its id prefix
- the authority uses the same one-segment settlement id shape as current settlement records
- existing General Lore domain alignment is preserved
- direct settlement snippets fail if their subject id is malformed
- direct settlement snippets fail if their subject id is absent from `world.settlements`
- focused tests cover the positive and negative paths
- no snippet content is added in the validator support implementation

## Validator Implementation Plan

In `tools/content-lint/index.mjs`, the future implementation should add a direct `settlement` authority to the `subjectAuthorities` object passed to `validateKnowledgeSnippets`:

```js
settlement: {
  collectionId: "world.settlements",
  idPrefix: "settlement.",
  idPattern: /^settlement\.[a-z0-9]+(?:_[a-z0-9]+)*$/,
  records: settlementWrapper.records
}
```

This should be placed near the existing settlement district and site authorities so the static-place authority group remains readable.

Do not remove `locationAuthorities.settlements`; it still owns `locationScope.settlementId` validation.

Do not add `settlement` to `ACTIVE_ONLY_SUBJECT_LABELS` in `tools/content-lint/knowledge-snippets.mjs` during the next implementation. Current settlement records do not expose a lifecycle `status` field, so direct settlement references should be existence-backed. If settlement lifecycle status is added later, active-only settlement snippet policy can be revisited in a separate scoped run.

## Test Implementation Plan

In `tests/unit/knowledge-snippets-validation.test.mjs`, the future implementation should add direct settlement authority fixture support:

- add `settlement` to `makeInput().subjectAuthorities`
- use `collectionId: "world.settlements"`
- use `idPrefix: "settlement."`
- use `idPattern: /^settlement\.[a-z0-9]+(?:_[a-z0-9]+)*$/`
- use `records: structuredClone(settlementWrapper.records)`
- add `world.settlements` to `availableContentCollectionIds` if it is not already present there

Focused test additions should include:

- a positive direct settlement snippet fixture for `settlement.highcrown`
- a missing settlement id rejection, such as `settlement.missing_test_city`
- a malformed settlement id rejection, such as a nested id that does not match the one-segment settlement pattern
- an assertion that `knowledge_snippet.schema.json` includes `settlement`, if the existing schema vocabulary test is still the right local home
- a registry/domain focused assertion for `settlement` and `world.settlements`, if the existing registry validation test remains the right local home

The direct settlement snippet fixture should be in-memory only. It should not add `knowledge_snippet.general_lore.highcrown.identification` to live content in the validator support run.

## Live-Settlement Reference Posture Decision

Use existence-backed live settlement references for direct `settlement` Knowledge subjects.

Reasons:

- current settlement records are already live authority records
- current settlement records do not use active/planned/retired status semantics
- General Lore already advertises `settlement` and `world.settlements`
- the parent `settlement.highcrown` snippet is a static identity snippet, not behavior unlock content

Rejected for this pass:

- active-only settlement references, because there is no settlement lifecycle field to enforce
- synthetic or fixture-only settlement authority in normal lint, because live `world.settlements` already exists
- adding settlement lifecycle status as part of this work, because that would broaden scope beyond Knowledge subject validation

## Future Highcrown Snippet Unblock Criteria

`knowledge_snippet.general_lore.highcrown.identification` may be reconsidered only after:

- direct `settlement` subject authority is wired into normal Knowledge snippet validation
- focused direct settlement subject tests pass
- `npm.cmd run tool:content-lint` passes
- no schema or registry/domain/trial-policy change is required by the validator implementation
- no unrelated settlement/district/site content or anchor change is made

The later snippet seed should remain a separate narrow content run.

## Rejected Alternatives

Option B: add the Highcrown parent snippet now and rely on existing schema/domain support.

Rejected because semantic validation currently requires a direct subject authority and no direct `settlement` authority is passed.

Option C: edit schemas or registry/domain content now.

Rejected because the audit shows structural vocabulary and General Lore alignment already exist.

Option D: infer direct settlement subject authority from `locationAuthorities.settlements`.

Rejected because subject validation and location-scope validation are separate contracts. Keeping them explicit preserves the fail-closed validator model used by existing direct subject authorities.

Option E: add active-only settlement subject policy now.

Rejected because current settlement records do not expose a lifecycle status field, and adding such a field would be a separate content/schema policy decision.

## Explicit Non-Goals

This plan does not authorize:

- adding Knowledge snippets
- editing Knowledge registry/domain/trial-policy content
- editing schemas
- editing validators
- editing tests
- editing settlement, district, or site content
- changing district/site anchors
- adding route/travel, building/workplace/economy, court/law, vendor/market, cargo/storage, sacred-site, religious-hotspot, or service content
- changing runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, or gameplay behavior

## Validation And Audit Posture

This run was docs-only. The audit reviewed:

- `settlement.highcrown` live settlement authority
- current Highcrown settlement-related Knowledge snippets
- General Lore subject and collection alignment
- snippet schema subject vocabulary
- registry schema subject vocabulary
- normal content-lint Knowledge snippet authority wiring
- focused Knowledge snippet validation tests

No source behavior changed in this plan.

## Next Recommended Version

Version 0.5.283 - Settlement Knowledge Subject Validator Support

