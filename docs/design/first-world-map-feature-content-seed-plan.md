# First World Map Feature Content Seed Plan

Source version/run: Version 0.5.250 - First World Map Feature Content Seed Plan
Date: 2026-06-28
Status: approved documentation-only seed plan; no live semantic map-feature content

## 1. Decision Summary

`Version 0.5.250` is documentation-only. It approves a future conditional first content seed pass for `world.map_features`, but it does not create live semantic map-feature content now.

The future first seed should be tiny, planned-only by default, and limited to stable named physical landscape features with current authored semantic evidence and validator-supported place anchors. Existing `world.world_map_features` may support a candidate only as current visual/reference evidence and only through nested coastline, river, mountain, or pass feature ids accepted by the validator. It must not be treated as a semantic authority by itself.

The recommended `Version 0.5.251 - First World Map Feature Content Seed` may create one or two `planned` records if a fresh audit reconfirms the candidate evidence below. If that audit finds the evidence too ambiguous, the correct implementation result is to defer live `map_features.json` rather than infer semantic features from geometry, routes, settlements, Knowledge, or generic prose.

This pass does not approve live `packages/content/base/world/map_features.json`, normal content-lint registration, schema changes, validator changes, visual geometry migration, route topology, pathfinding, ecology execution, POIs, Knowledge, runtime, UI, storage, commands, events, rewards, or gameplay behavior.

## 2. Current Schema And Validator Reality

Current landed contract:

- `world.map_features` is the future static authored semantic map-feature identity collection.
- Future content path remains `packages/content/base/world/map_features.json`.
- Schema exists at `packages/schemas/world/map-feature.schema.json`.
- Pure validator helper exists at `tools/content-lint/map-features.mjs`.
- Focused tests exist at `tests/unit/map-feature-validation.test.mjs`.
- Schema-file parse registration exists in `tests/unit/schema-files.test.mjs`.
- No live `packages/content/base/world/map_features.json` exists.
- No normal content-lint registration exists for semantic `map_features.json` or `map-features.mjs`.
- Existing `packages/content/base/world/world_map_features.json` remains a separate visual aggregate authority.

Current semantic map-feature records require a strict `records` wrapper with `map_feature.<slug>` ids, matching lower-snake-case `slug`, `name`, `aliases`, `summary`, `featureType`, `extentKind`, non-empty `placeAnchors`, duplicate-free `descriptiveTags`, required `visualReferences`, `status`, `sourceAuthorityNotes`, and `notes`.

Allowed first-pass `featureType` values are `river`, `lake`, `wetland`, `coastline`, `estuary`, `mountain_range`, `mountain_pass`, `cliff`, `forest`, `grove`, `desert`, `swamp`, `plain`, `natural_harbor`, `natural_landmark`, and `cultural_landscape`. Allowed `extentKind` values are `point_like`, `linear`, `area_like`, `corridor_like`, and `distributed`.

Current place anchors support `region`, `region_locality`, and `settlement` place types with `contains_feature`, `feature_crosses`, `feature_borders`, `feature_near`, or `named_context` roles. The validator resolves anchors against current active `world.regions`, `world.region_localities`, and `world.settlements`; requires at least one region or region-locality anchor; and prevents settlement-only anchoring.

Current visual references may point only to current nested physical visual ids in `world.world_map_features` groups accepted by `validateMapFeatures`: `coastlines`, `riverFeatures`, `mountainFeatures`, and `passFeatures`. Region footprints, crossing features, climate zones, and biome zones are rejected as semantic visual-reference targets.

## 3. Current Content Audit Summary

This pass inspected the semantic schema, pure validator, focused test, schema registration, normal content-lint posture, world-map feature schema decision, visual aggregate feature content, regions, region localities, settlements, world maps, and current handoff files.

Current audit findings:

- `packages/content/base/world/map_features.json` is absent.
- `tools/content-lint/index.mjs` does not import `map-features.mjs` or register semantic `world.map_features` content.
- `packages/content/base/world/world_map_features.json` contains one visual aggregate, `world_map_feature.first_world`, with named nested river, mountain, pass, and other visual feature groups.
- The named nested visual features include useful candidate evidence such as `feature.river_thalos_run`, `feature.mountains_windward_spine`, `feature.mountains_crownwall`, and several named pass features.
- `region.windward_spine` is a current region named `The Windward Spine` and describes the mountain backbone of Serathyl.
- `region.verdant_thalos` is a current region named `Verdant Thalos`; `region_locality.verdant_thalos_coastal_bays` is current and supports the river's broad destination context, while `feature.river_thalos_run` explicitly names and describes Thalos Run as the primary river draining Verdant Thalos farmlands into Aurelis Bay.
- Named passes such as `Sunscar Gate`, `Whitebark Gap`, `Northwind Stair`, and `Obsidian Stair` are plausible but carry route, toll, settlement, or pass-control context that makes them higher risk for a first seed.
- Generic coastline parts, region footprints, climate zones, biome zones, crossing features, world hexes, travel-network routes, ports, roads, fords, bridges, ferries, and settlement economic/admin roles are not safe first-seed semantic identities.

The strongest first future seed posture is one or two planned records drawn from explicit named visual features with separate current region/locality support. Weaker candidates should remain deferred.

## 4. First Seed Scope

The first actual semantic map-feature content seed should include only:

- static semantic physical/cultural landscape identity records in `world.map_features`;
- `status: "planned"` records unless a later prompt explicitly approves active status;
- feature and extent values already accepted by the schema;
- at least one current region or region-locality place anchor per record;
- optional settlement anchors only as `named_context` and never as the only anchor;
- optional visual references only to validator-accepted nested `feature.*` ids in `world.world_map_features`;
- short summaries that identify the feature without asserting geometry, topology, discovery, ecology, ownership, routes, POIs, or gameplay effects;
- `sourceAuthorityNotes` that cite exact current evidence and explain why the record remains descriptive and non-executing;
- `notes` that explicitly reject geometry, coordinates, route topology, pathfinding, ecology execution, POI placement, Knowledge, runtime, UI, storage, commands, events, rewards, and gameplay behavior.

The first seed should not include:

- coordinates, pixels, points, lines, polygons, bounds, source layers, map assets, render styles, UI labels, or visual geometry;
- route ids, edge ids, crossings, roads, bridges, fords, ferries, ports, travel networks, trade routes, or pathfinding data;
- ecology profiles, biome/climate ids, hydrology state, resources, spawn profiles, encounter templates, or POI placement rules;
- polity ids, claims, borders, control, conflicts, jurisdictions, administration, laws, taxes, or player legal state;
- sacred-site, religious-hotspot, Knowledge, quest, Chronicle, economy, service, access, favorability, alignment, runtime, storage, command, event, reward, or gameplay fields.

## 5. Candidate Evidence Policy

Allowed evidence:

- current authored content that explicitly names a stable physical landscape feature;
- current visual aggregate nested `feature.*` ids in accepted groups as non-authoritative visual reference support;
- current region or region-locality records that support broad physical place association;
- current settlement records only as supplemental named context, never as the sole proof;
- existing design docs that approve only the narrow semantic identity contract, not geometry or behavior.

Insufficient evidence by itself:

- region footprint geometry;
- crossing geometry;
- climate zones or biome zones;
- world hex ids or edge ids;
- route ids, travel-network routes, roads, bridges, fords, ferries, locks, ports, or trade-route prose;
- settlement administrative roles, economic roles, or harbor tiers;
- religious hotspots or sacred sites;
- polity records;
- Knowledge snippets, Knowledge subject vocabulary, or discovery text;
- quest metadata;
- generated operators;
- runtime/UI strings;
- map pixel positions or coordinates alone;
- generic descriptive prose without a stable named feature.

If a future implementation cannot cite explicit evidence for the feature name, type, extent, and place anchors, it must skip the candidate.

## 6. Recommended First Candidate Batch

The future `0.5.251` seed may use this candidate list only after a fresh audit reconfirms every source line and validates every anchor.

| Candidate id | Candidate name | Type | Extent | Status | Planned anchors | Visual reference support | Why it is plausible |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `map_feature.windward_spine` | `The Windward Spine` | `mountain_range` | `linear` | `planned` | `region.windward_spine` as `contains_feature`; optionally `region_locality.windward_spine_alpine_passes` as `contains_feature` | `world_map_feature.first_world` / `feature.mountains_windward_spine` | Current region authority names The Windward Spine and describes it as Serathyl's mountain backbone. Current visual aggregate also names Windward Spine as a mountain feature. |
| `map_feature.thalos_run` | `Thalos Run` | `river` | `linear` | `planned` | `region.verdant_thalos` as `feature_crosses`; optionally `region_locality.verdant_thalos_coastal_bays` as `feature_near` | `world_map_feature.first_world` / `feature.river_thalos_run` | Current visual aggregate explicitly names Thalos Run and describes it as the primary river draining Verdant Thalos farmlands into Aurelis Bay; current place authority names Verdant Thalos and its coastal bays. |

Do not add both candidates if the future implementation cannot keep each record brief and fully cited. A one-record seed is acceptable and preferred over weak coverage.

Deferred or rejected first-seed candidates:

- `map_feature.crownwall`: plausible visual mountain feature, but current place evidence found in this pass is weaker than Windward Spine and should wait for stronger exact named place support.
- `map_feature.sunscar_gate`, `map_feature.whitebark_gap`, `map_feature.northwind_stair`, and `map_feature.obsidian_stair`: plausible named passes, but first-pass seeding should avoid pass-control, toll-road, settlement, and route-topology ambiguity unless a fresh audit can keep the record strictly physical and non-executing.
- Generic `First World Coastline Part N` records: visual line segments are not stable semantic named coastline identities.
- Crossings such as Kingsbridge, Bridgewatch Ferry, Redreed Ford, Southlock, Foammarket Ferry, and Shattergap Strait: crossing features are explicitly disallowed visual-reference targets for first-pass semantic map features.
- Natural harbors, ports, roads, route names, biome/climate zones, and settlement harbor/economic roles remain deferred until their owning authorities are decided.

## 7. Draft Record Shape For Future Implementation

These sketches are non-live planning examples. The future content seed must re-audit and may edit wording before authoring JSON.

```json
{
  "id": "map_feature.windward_spine",
  "slug": "windward_spine",
  "name": "The Windward Spine",
  "aliases": [],
  "summary": "A planned static semantic identity for Serathyl's named mountain backbone.",
  "featureType": "mountain_range",
  "extentKind": "linear",
  "placeAnchors": [
    {
      "placeType": "region",
      "placeId": "region.windward_spine",
      "anchorRole": "contains_feature"
    }
  ],
  "descriptiveTags": ["mountain", "spine"],
  "visualReferences": [
    {
      "visualAggregateId": "world_map_feature.first_world",
      "visualFeatureId": "feature.mountains_windward_spine",
      "relationship": "reference_only",
      "notes": "Non-authoritative pointer to current mountain visual geometry only; geometry is not copied."
    }
  ],
  "status": "planned",
  "sourceAuthorityNotes": [
    "Current region authority names The Windward Spine and describes it as the mountain backbone of Serathyl.",
    "Current visual aggregate names feature.mountains_windward_spine as Windward Spine."
  ],
  "notes": [
    "Static semantic feature identity only; this record does not define geometry, coordinates, route topology, pathfinding, ecology execution, POI placement, Knowledge, runtime, UI, storage, command, event, reward, or gameplay behavior."
  ]
}
```

```json
{
  "id": "map_feature.thalos_run",
  "slug": "thalos_run",
  "name": "Thalos Run",
  "aliases": [],
  "summary": "A planned static semantic identity for the named river draining Verdant Thalos toward Aurelis Bay.",
  "featureType": "river",
  "extentKind": "linear",
  "placeAnchors": [
    {
      "placeType": "region",
      "placeId": "region.verdant_thalos",
      "anchorRole": "feature_crosses"
    },
    {
      "placeType": "region_locality",
      "placeId": "region_locality.verdant_thalos_coastal_bays",
      "anchorRole": "feature_near"
    }
  ],
  "descriptiveTags": ["river", "freshwater"],
  "visualReferences": [
    {
      "visualAggregateId": "world_map_feature.first_world",
      "visualFeatureId": "feature.river_thalos_run",
      "relationship": "reference_only",
      "notes": "Non-authoritative pointer to current river visual geometry only; geometry is not copied."
    }
  ],
  "status": "planned",
  "sourceAuthorityNotes": [
    "Current visual aggregate names feature.river_thalos_run as Thalos Run and describes it as the primary river draining Verdant Thalos farmlands into Aurelis Bay.",
    "Current region authority names Verdant Thalos and current locality authority names Verdant Coastal Bays."
  ],
  "notes": [
    "Static semantic feature identity only; this record does not define geometry, coordinates, route topology, pathfinding, ecology execution, POI placement, Knowledge, runtime, UI, storage, command, event, reward, or gameplay behavior."
  ]
}
```

## 8. Future Authoring Rules

Every future semantic map-feature record must:

- be complete under `packages/schemas/world/map-feature.schema.json`;
- use `map_feature.<slug>` id and matching `slug`;
- use `status: "planned"` unless a future seed explicitly decides `active`;
- use `aliases: []` unless explicit aliases exist;
- use at least one resolving region or region-locality anchor;
- keep settlement anchors supplemental and `named_context` only;
- avoid duplicate exact place anchors and visual references;
- choose the least specific accurate `featureType` and `extentKind`;
- keep summaries short and non-mechanical;
- use `sourceAuthorityNotes` to cite why the identity is canonical enough for planned content;
- use `notes` to state what the record does not imply.

Do not include coordinate, geometry, source-layer, map-rendering, hex, edge, route, crossing, port, trade-route, pathfinding, political, claim, border, jurisdiction, ecology, biome, climate, hydrology, resource, spawn, encounter, POI-placement, sacred-site, religious-hotspot, settlement-effect, Knowledge, quest, Chronicle, economy, service, discovery, runtime, UI, storage, command, event, reward, access, favorability, alignment, or gameplay fields.

## 9. Future Content Seed Implementation Plan

The next implementation candidate is `Version 0.5.251 - First World Map Feature Content Seed`, conditional on this seed plan being accepted and live content being explicitly authorized.

That future pass may create `packages/content/base/world/map_features.json` only if a fresh audit reconfirms at least one approved candidate. It may register semantic map-feature content in normal content lint only if the implementation prompt explicitly approves registration. It must keep the batch very small, planned-only by default, and auditable.

Recommended implementation sequence:

1. Re-run the semantic map-feature schema, validator, focused tests, normal-lint index, visual aggregate, region, locality, settlement, world-map, route/travel, Knowledge, and runtime-boundary audits.
2. Select one or two planned records from the approved candidate list.
3. Draft `map_features.json` with `status: "planned"`.
4. Run focused map-feature validation tests.
5. Register normal content lint only if explicitly approved.
6. Run normal content lint after registration, if registration happens.
7. Audit changed paths to prove no visual aggregate geometry, region, locality, settlement, route, travel, Knowledge, runtime, UI, storage, command, event, reward, or gameplay files changed.

If the future audit does not support either candidate, do not create `map_features.json`; document the deferral and move to the next appropriate planning lane.

## 10. Validation Checklist For Future Content Seed

The future seed implementation must run or document:

- focused map-feature validation tests;
- schema-file test;
- normal content lint after registration, if registration is approved;
- content audit proving every map-feature id/slug is unique and coherent;
- place-anchor audit proving every region, region-locality, and settlement anchor resolves against current active authority;
- settlement-anchor audit proving no record is settlement-only and any settlement anchor is `named_context`;
- visual-reference audit proving every reference targets an allowed current coastline, river, mountain, or pass nested `feature.*` id and copies no geometry;
- forbidden-field audit for every record;
- non-inference audit proving no record was inferred from region footprint geometry, crossings, climate zones, biome zones, world hexes, route ids, edge ids, travel networks, settlement roles, religious hotspots, sacred sites, polity records, Knowledge, quest metadata, generated operators, runtime/UI strings, coordinates, or generic prose alone;
- scope audit proving no `world.world_map_features`, route, travel, region, locality, settlement, Knowledge, runtime, UI, storage, command, event, reward, or gameplay changes;
- behavior audit proving map features are static descriptive content only.

## 11. Deferred Topics

The following remain explicitly deferred:

- live semantic map-feature content until a later implementation prompt;
- active semantic map-feature status unless explicitly approved;
- semantic coastline identity beyond generic visual coastline segments;
- named passes with route, toll, settlement, or crossing ambiguity;
- natural-harbor, port, road, crossing, bridge, ferry, ford, lock, route, and trade-route authorities;
- visual geometry migration or normalization from `world.world_map_features`;
- region-footprint, climate-zone, biome-zone, hex, edge, grid, and map-asset authority changes;
- geography Knowledge domains, map-feature subjects, snippets, evidence, discovery, or unlock behavior;
- ecology execution, hydrology simulation, resources, spawn/encounter selection, POI placement, pathfinding, travel runtime, UI, storage, command, event, reward, and gameplay behavior.

## 12. Temporary Artifact Handling

`docs/dev/tmp-world-map-spatial-systems-research-2026-06-19.md` remains absent after the `0.5.228` decision retired it.

No temporary map-feature seed artifact was found in this pass. No temporary artifact is deleted or created by this plan.

## 13. Non-Goals

This plan does not authorize:

- live semantic map-feature content;
- `packages/content/base/world/map_features.json`;
- normal semantic map-feature content-lint registration;
- schema, validator, focused-test, visual aggregate, region, locality, settlement, world-map, route, travel, Knowledge, runtime, UI, storage, command, event, reward, or gameplay changes;
- geometry, coordinates, pixels, source layers, map assets, rendering, route topology, pathfinding, ecology execution, POI placement, discovery, or migration work;
- compatibility aliases or transition to `0.6.0`.

## 14. Next Recommended Version

`Version 0.5.251 - First World Map Feature Content Seed`

That future pass is conditional and should proceed only if live semantic map-feature content is explicitly authorized and a fresh audit reconfirms at least one approved planned candidate.
