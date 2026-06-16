# Religious Hotspot Content Authority Seed Plan

Source version/run: Version 0.5.176 - Religious Hotspot Content Authority Seed Plan
Date: 2026-06-16
Status: documentation-only seed-content plan; no live content

## Purpose And Status

This plan selects the first future `world.religious_hotspots` seed records and defines how a later implementation should validate and register them.

This run is documentation-only. It adds no live `packages/content/base/world/religious_hotspots.json` file, normal content-lint registration, schema change, validator change, test change, Knowledge snippet subject support, live snippet, `world.sacred_sites`, runtime, UI, storage, persistence, event, reward, command, faction, reputation, law, favorability, elemental alignment, spell, Magic Study, Prestige, family, conversion, apostasy, consequence, or gameplay behavior.

`knowledge_domain.religion` remains active with exactly two live Religion snippets:

- `knowledge_snippet.religion.elemental_pantheon.identification`
- `knowledge_snippet.religion.light_lady.identification`

Religion trial, completion, and visibility policy references remain null. Current direct Religion snippet subjects remain exactly `religion` and `deity`; there is still no live `religious_hotspot` Knowledge subject.

## Current Implementation Recap

- `packages/schemas/world/religious-hotspot.schema.json` owns the future wrapper and record structure.
- `tools/content-lint/religious-hotspots.mjs` owns pure focused semantic validation for in-memory hotspot fixtures.
- `tests/unit/religious-hotspots-validation.test.mjs` owns schema and validator boundary coverage.
- Normal content lint remains `content-lint: ok (56 files checked)`.
- No live `packages/content/base/world/religious_hotspots.json` file exists.
- Direct `religious_hotspot` Knowledge subject support remains blocked until seed records exist and a later vocabulary/schema/validator pass enables direct snippet references.

## Seed Strategy

The first seed implementation should add exactly two `planned` records if the later implementation can validate them unchanged:

1. `religious_hotspot.glasswake_shrine_lantern_gardens`
2. `religious_hotspot.lantern_shrine_gardens`

Two records are justified because current place authority includes both a settlement-scale shrine community and a locality-scale shrine-garden band. Keeping both records allows future snippets to distinguish the specific settlement from the wider shrine-garden locality without inventing runtime behavior.

Both records should start as `planned`.

Do not make the first records `active` yet. Direct `religious_hotspot` Knowledge subject support does not exist, live snippets cannot reference hotspot records, and deity/order/dominant-faith authority for these places is not yet strong enough to treat them as active snippet authority.

If the future implementation finds either draft no longer validates against current content, seed only the stronger record first:

- Preferred fallback: seed `religious_hotspot.glasswake_shrine_lantern_gardens` only.
- Defer `religious_hotspot.lantern_shrine_gardens` if locality-wide authority becomes ambiguous or overlaps too much with the settlement record.

## Candidate Record Audit

### Current Supported Facts

Current place authority supports these ids and relationships:

- `region.lantern_isles` exists and is an `island_system`.
- `region.glasswake_quay` exists, is a `subregion`, and belongs to `region.lantern_isles`.
- `region.glasswake_quay` is a quieter quay-island of shrine estates, shell kilns, traveler refuges, herb gardens, and lookout posts.
- `region.glasswake_quay` has the `shrine` tag.
- `region_locality.lantern_shrine_gardens` exists, belongs to `region.glasswake_quay` and `region.lantern_isles`, and is a `shrine_garden`.
- `region_locality.lantern_shrine_gardens` is summarized as small religious estates with herbs, records, and traveler relief.
- `settlement.glasswake_shrine` exists, belongs to `region_locality.lantern_shrine_gardens`, `region.glasswake_quay`, and `region.lantern_isles`.
- `settlement.glasswake_shrine` is a small sea-facing shrine community that copies ledgers, dries herbs, and tends travelers.
- `settlement.glasswake_shrine` has identity tags `monastic_house`, `coastal_shrine`, and `scholastic_hospice`.
- `religion.elemental_pantheon` exists as the current top-level religion authority.
- `deity.light_lady` exists under `religion.elemental_pantheon`.

### Proposed But Unsupported Authoring Choices

The current place records do not explicitly name `religion.elemental_pantheon`, `deity.light_lady`, any religious order, a dominant faith, a tolerated faith, a restricted faith, or a mechanical mismatch consequence.

The seed implementation may still intentionally author `religion.elemental_pantheon` as the initial hotspot religion because it is the only current religion authority and the religion summary supports geography-shaped worship, but the records should remain `planned` to show that the place-to-faith relationship is being introduced as descriptive content authority rather than discovered from an existing place field.

### Fields To Omit Until Authority Exists

- Omit `deityIds` from the first seed records. `deity.light_lady` exists, but the current place records do not prove a Light Lady affiliation for either candidate.
- Omit `dominantFaithIds` while records are `planned`. Dominant faith should be added when records become active or when source authority explicitly supports it.
- Omit `toleratedFaithIds` because there are no additional live religion authorities to list and no local tolerance record exists.
- Omit `restrictedFaithIds` because restrictions would invite law, consequence, favorability, or access interpretation before those owners exist.
- Omit `religiousOrderIds`; the schema does not support it and nested-order resolution remains deferred.

### Fields Safe To Fill Now

- `id`, `slug`, `name`, and `summary` can be authored directly.
- `status` should be `planned`.
- `placeAnchor` can use current coherent macro-region, subregion, locality, and settlement ids.
- `religionIds` can include `religion.elemental_pantheon` as the explicit planned relationship being authored.
- Descriptive enums can use conservative values from the current schema.
- `sourceAuthorityNotes` and `notes` can explain current support, proposed boundaries, omitted deity/order posture, and no-runtime/no-consequence limits.

## Exact Future Record Drafts

These drafts are future-only examples. Do not add them during this planning run.

```json
{
  "records": [
    {
      "id": "religious_hotspot.glasswake_shrine_lantern_gardens",
      "slug": "glasswake_shrine_lantern_gardens",
      "name": "Glasswake Shrine Lantern Gardens",
      "summary": "A planned descriptive hotspot for the Glasswake Shrine community and its surrounding lantern shrine gardens.",
      "status": "planned",
      "placeAnchor": {
        "macroRegionId": "region.lantern_isles",
        "regionId": "region.glasswake_quay",
        "regionLocalityId": "region_locality.lantern_shrine_gardens",
        "settlementId": "settlement.glasswake_shrine"
      },
      "religionIds": [
        "religion.elemental_pantheon"
      ],
      "hotspotType": "settlement_shrine",
      "sacredSiteType": "shrine",
      "hotspotIntensity": "minor",
      "publicPosture": "tolerant",
      "mismatchPressure": "none",
      "pilgrimageStatus": "local",
      "sourceAuthorityNotes": [
        "Current place authority identifies Glasswake Shrine as a small sea-facing shrine community in the Lantern Shrine Gardens locality of Glasswake Quay.",
        "Current locality and region authority describe shrine gardens, religious estates, traveler relief, copied records, herb cultivation, and shrine-adjacent settlement patterns.",
        "The Elemental Pantheon is the only current top-level religion authority and is used here as a planned descriptive relationship, not as an existing place-authored dominant faith."
      ],
      "notes": [
        "Descriptive content authority only; no runtime consequence, favorability, law, access, reward, command, or gameplay behavior.",
        "No deityIds are listed because current place authority does not prove a specific Light Lady or other deity affiliation.",
        "No dominantFaithIds, toleratedFaithIds, restrictedFaithIds, or religiousOrderIds are listed until later content authority or validator support exists."
      ]
    },
    {
      "id": "religious_hotspot.lantern_shrine_gardens",
      "slug": "lantern_shrine_gardens",
      "name": "Lantern Shrine Gardens",
      "summary": "A planned descriptive hotspot for the wider shrine-garden locality around Glasswake Quay.",
      "status": "planned",
      "placeAnchor": {
        "macroRegionId": "region.lantern_isles",
        "regionId": "region.glasswake_quay",
        "regionLocalityId": "region_locality.lantern_shrine_gardens"
      },
      "religionIds": [
        "religion.elemental_pantheon"
      ],
      "hotspotType": "locality_shrine_cluster",
      "sacredSiteType": "shrine",
      "hotspotIntensity": "minor",
      "publicPosture": "universal",
      "mismatchPressure": "none",
      "pilgrimageStatus": "local",
      "sourceAuthorityNotes": [
        "Current locality authority identifies Lantern Shrine Gardens as a shrine-garden locality with religious estates, herbs, records, and traveler relief.",
        "Current region authority places the locality inside Glasswake Quay, a subregion with shrine estates, monasteries, herb gardens, lookout posts, and traveler refuges.",
        "The Elemental Pantheon is the only current top-level religion authority and is used here as a planned descriptive relationship, not as an existing locality-authored dominant faith."
      ],
      "notes": [
        "Descriptive content authority only; no runtime consequence, favorability, law, access, reward, command, or gameplay behavior.",
        "This locality-scale record should remain separate from the Glasswake Shrine settlement record only if future snippets need broader shrine-garden context.",
        "No deityIds, dominantFaithIds, toleratedFaithIds, restrictedFaithIds, or religiousOrderIds are listed until later authority exists."
      ]
    }
  ]
}
```

## Field-By-Field Seed Decisions

### `religious_hotspot.glasswake_shrine_lantern_gardens`

- `id`: use `religious_hotspot.glasswake_shrine_lantern_gardens`.
- `slug`: use `glasswake_shrine_lantern_gardens`.
- `name`: use `Glasswake Shrine Lantern Gardens`.
- `summary`: describe the shrine community and surrounding gardens only.
- `status`: use `planned`.
- `placeAnchor`: include all four coherent ids because the record is settlement-specific and the hierarchy is known.
- `religionIds`: include `religion.elemental_pantheon` as the planned authored faith relationship.
- `deityIds`: omit.
- `dominantFaithIds`: omit while planned.
- `toleratedFaithIds`: omit.
- `restrictedFaithIds`: omit.
- `hotspotType`: use `settlement_shrine`.
- `sacredSiteType`: use `shrine`.
- `hotspotIntensity`: use `minor`.
- `publicPosture`: use `tolerant`.
- `mismatchPressure`: use `none`.
- `pilgrimageStatus`: use `local`.
- `sourceAuthorityNotes`: cite current place hierarchy and shrine-community authority in prose.
- `notes`: include no-runtime/no-consequence guardrails and deferred deity/order/faith-posture boundaries.

### `religious_hotspot.lantern_shrine_gardens`

- `id`: use `religious_hotspot.lantern_shrine_gardens`.
- `slug`: use `lantern_shrine_gardens`.
- `name`: use `Lantern Shrine Gardens`.
- `summary`: describe the wider shrine-garden locality only.
- `status`: use `planned`.
- `placeAnchor`: include macro-region, region, and locality; omit settlement because the record is locality-scale.
- `religionIds`: include `religion.elemental_pantheon` as the planned authored faith relationship.
- `deityIds`: omit.
- `dominantFaithIds`: omit while planned.
- `toleratedFaithIds`: omit.
- `restrictedFaithIds`: omit.
- `hotspotType`: use `locality_shrine_cluster`.
- `sacredSiteType`: use `shrine`.
- `hotspotIntensity`: use `minor`.
- `publicPosture`: use `universal`.
- `mismatchPressure`: use `none`.
- `pilgrimageStatus`: use `local`.
- `sourceAuthorityNotes`: cite current locality and region authority in prose.
- `notes`: include no-runtime/no-consequence guardrails and note that the locality record should remain separate only if future snippets need broader context.

## Validation Dry-Run Plan

The future seed implementation should:

1. Create `packages/content/base/world/religious_hotspots.json`.
2. Add the selected record wrapper exactly, adjusting only if current validation requires it.
3. Register the live content file in `tools/content-lint/index.mjs`.
4. Load:
   - `packages/schemas/world/religious-hotspot.schema.json`
   - `packages/content/base/world/religions.json`
   - `packages/content/base/world/regions.json`
   - `packages/content/base/world/region_localities.json`
   - `packages/content/base/world/settlements.json`
5. Invoke `validateReligiousHotspots`.
6. Move normal content lint from `56` to `57` checked files.
7. Add or update focused tests only if live fixture coverage is needed beyond normal lint registration.
8. Run normal content lint.
9. Run `node --test tests\unit\religious-hotspots-validation.test.mjs`.
10. Keep Knowledge snippet tests unchanged unless direct `religious_hotspot` subject support is explicitly in scope.

## Normal Lint Registration Plan

The future implementation should register religious hotspots in normal content lint only when the live content file is added.

Expected posture:

- Add `packages/content/base/world/religious_hotspots.json`.
- Register the content file in `tools/content-lint/index.mjs`.
- Load the hotspot schema plus religions, regions, region localities, and settlements as dependencies.
- Invoke `validateReligiousHotspots`.
- Count the hotspot content file exactly once.
- Increment successful normal content lint from `content-lint: ok (56 files checked)` to `content-lint: ok (57 files checked)`.

Do not perform this registration in this seed-plan run.

## Knowledge Snippet Boundary

Seed content does not add Knowledge subject support and does not add snippets.

After seed content exists, a separate `Version 0.5.178 - Religious Hotspot Knowledge Subject Vocabulary Plan` should decide whether and how to add direct `religious_hotspot` subject support.

Do not use `custom`, `religion`, `deity`, `region`, `settlement`, shrine, sacred-site, or institution shortcuts to represent hotspot snippets before direct subject support exists.

## Favorability And Alignment Boundary

Hotspot seed records are descriptive content authority only.

They create no favorability, elemental alignment, piety, standing, service denial, prayer gain, donation gain, pilgrimage gain, law response, faction response, conversion, apostasy, spell penalty, family Prestige, or gameplay behavior.

Descriptive posture fields such as `publicPosture`, `mismatchPressure`, and `pilgrimageStatus` are not mechanics.

## Broad Gap Audit Boundary

`docs/design/survival-builder-rpg-mmo-content-gap-audit.md` remains broad future context only. It should not broaden this seed-plan run.

Inventory/storage, survival, builder construction, NPC population, factions, reputation/favorability, quests/contracts, travel/POIs, law/crime, and estate/succession remain future roadmap material.

## Open Questions

- Should first seed content include one or two records? Current recommendation: two planned records if both validate; otherwise seed only `religious_hotspot.glasswake_shrine_lantern_gardens`.
- Is `religion.elemental_pantheon` sufficiently explicit for both candidates? Current recommendation: yes as a planned authored relationship, not as an existing place-authored dominant faith.
- Is `deity.light_lady` sufficiently explicit for either candidate? Current recommendation: no; omit `deityIds` from the first seed.
- Should `dominantFaithIds` be omitted for planned records until active status is used? Current recommendation: yes.
- Should `settlement.glasswake_shrine` and `region_locality.lantern_shrine_gardens` be separate hotspot records or should one be absorbed into the other? Current recommendation: keep both only if future snippets need both settlement-scale and locality-scale context.
- Should the first seed implementation include any new focused tests for live content, or rely on normal lint registration and existing validator tests? Current recommendation: rely on normal lint first, add focused tests only for registration or live-fixture failure modes.
- Should active status wait until Knowledge subject support exists? Current recommendation: yes.
- Should Religious Favorability And Elemental Alignment be prioritized after seed content or after hotspot Knowledge snippets? Current recommendation: keep it optional after the hotspot authority lane unless explicitly prioritized as design-only work.

## Future Sequence

Recommended next:

1. `Version 0.5.177 - Religious Hotspot Content Authority Seed`
2. `Version 0.5.178 - Religious Hotspot Knowledge Subject Vocabulary Plan`
3. `Version 0.5.179 - Religious Hotspot Knowledge Subject Schema And Validator`
4. `Version 0.5.180 - Religious Hotspot Knowledge Snippet Seed Plan`

`Religious Favorability And Elemental Alignment Plan` remains optional after the hotspot authority lane or earlier only if explicitly prioritized as design-only work.

## Acceptance Criteria For Version 0.5.177

The seed implementation is complete only when it:

- adds live `packages/content/base/world/religious_hotspots.json`;
- registers it in normal content lint;
- validates the selected seed records through the existing schema and `validateReligiousHotspots`;
- moves normal content lint from 56 to 57 checked files;
- does not add direct `religious_hotspot` Knowledge subject support;
- does not add live hotspot snippets;
- does not add favorability/alignment, law/consequence systems, runtime, UI, storage, Magic Study, Prestige, family, or gameplay behavior.
