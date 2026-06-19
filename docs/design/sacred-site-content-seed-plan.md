# Sacred Site Content Seed Plan

Version: `0.5.187`
Status: completed documentation-only seed plan
Date: 2026-06-19

## 1. Decision Summary

The project is ready to seed exactly one future `planned` sacred-site record after schema and validator support exists:

`sacred_site.glasswake_shrine_lantern_gardens.glasswake_shrine`

Current place and hotspot authority supports Glasswake Shrine as a conservative first named-site candidate. Planned status is required because the separate sacred-site scope has not been structurally implemented or validated and current authority does not justify active Knowledge eligibility.

The project is not ready for active sacred-site status, Knowledge snippets, pilgrimage, services, favorability, alignment, law, religious-order control, spell access, Magic Study, runtime, UI, storage, or gameplay behavior.

This run creates no live content, schema, validator, test, Knowledge support, or behavior.

## 2. Candidate Selection

| Field | Future planned value |
| --- | --- |
| `id` | `sacred_site.glasswake_shrine_lantern_gardens.glasswake_shrine` |
| `slug` | `glasswake_shrine_lantern_gardens_glasswake_shrine` |
| `name` | `Glasswake Shrine` |
| `status` | `planned` |
| parent hotspot | `religious_hotspot.glasswake_shrine_lantern_gardens` |
| macro-region | `region.lantern_isles` |
| region | `region.glasswake_quay` |
| locality | `region_locality.lantern_shrine_gardens` |
| settlement | `settlement.glasswake_shrine` |
| `religionIds` | `religion.elemental_pantheon` |
| `sacredSiteType` | `shrine` |
| `publicPosture` | `tolerant` |
| `pilgrimageStatus` | `local` |

No second candidate is selected. The wider `religious_hotspot.lantern_shrine_gardens` remains planned and lacks distinct named-site authority.

## 3. Authority Proof

The candidate is supported by the combination of canonical place and religious-hotspot authority, not by `sacredSiteType` alone:

- `settlement.glasswake_shrine` is an existing canonical named place whose name is `Glasswake Shrine`.
- The settlement is a small sea-facing shrine community with `monastic_house`, `coastal_shrine`, and `scholastic_hospice` identity tags.
- Its site context describes whitewashed halls, herb terraces, a quiet cove, and a tiny chapel pier.
- The settlement belongs to `region_locality.lantern_shrine_gardens`, `region.glasswake_quay`, and `region.lantern_isles`.
- `religious_hotspot.glasswake_shrine_lantern_gardens` is active, has the same complete place anchor, explicitly centers on the Glasswake Shrine community, and associates the hotspot with `religion.elemental_pantheon`.
- The parent hotspot supplies descriptive `publicPosture: "tolerant"`, `pilgrimageStatus: "local"`, and `sacredSiteType: "shrine"` values suitable for a planned draft.

These authorities support a planned named shrine candidate centered on the canonical settlement. They do not yet prove a separately bounded building footprint, deity dedication, religious-order stewardship, services, legal status, pilgrimage route, or mechanical effect. Planned status preserves that boundary.

The identities remain distinct:

| Authority | Meaning |
| --- | --- |
| `settlement.glasswake_shrine` | Canonical settlement and community identity. |
| hotspot `sacredSiteType: "shrine"` | Descriptive classification only; it creates no site record. |
| `religious_hotspot.glasswake_shrine_lantern_gardens` | Broad active hotspot covering the settlement and surrounding shrine gardens. |
| future `sacred_site.*` record | Separate planned named-site authority for Glasswake Shrine, linked to the parent hotspot and exact place anchor. |

## 4. Non-Live Draft Future Record

The following JSON is a planning draft only. It is not live content and must not be copied into a content file before the schema and validator implementation lands.

```json
{
  "id": "sacred_site.glasswake_shrine_lantern_gardens.glasswake_shrine",
  "slug": "glasswake_shrine_lantern_gardens_glasswake_shrine",
  "name": "Glasswake Shrine",
  "summary": "A planned named shrine authority centered on the sea-facing Glasswake Shrine community within the Lantern Shrine Gardens of Glasswake Quay.",
  "status": "planned",
  "placeAnchor": {
    "macroRegionId": "region.lantern_isles",
    "regionId": "region.glasswake_quay",
    "regionLocalityId": "region_locality.lantern_shrine_gardens",
    "settlementId": "settlement.glasswake_shrine"
  },
  "parentReligiousHotspotId": "religious_hotspot.glasswake_shrine_lantern_gardens",
  "religionIds": [
    "religion.elemental_pantheon"
  ],
  "sacredSiteType": "shrine",
  "publicPosture": "tolerant",
  "pilgrimageStatus": "local",
  "sourceAuthorityNotes": [
    "Current settlement authority names Glasswake Shrine and describes it as a sea-facing shrine community with coastal-shrine, monastic-house, and scholastic-hospice identity.",
    "Current place authority locates the settlement in the Lantern Shrine Gardens locality of Glasswake Quay within the Lantern Isles.",
    "The active parent hotspot centers on the Glasswake Shrine community, uses the same place anchor, and associates the location with the Elemental Pantheon."
  ],
  "notes": [
    "Planned descriptive authority only; no runtime, access, service, route, reward, law, favorability, alignment, command, event, UI, storage, or gameplay behavior.",
    "No deityIds are listed because current authority does not prove a specific deity dedication.",
    "No religiousOrderIds or faith-posture arrays are listed because current authority does not prove order stewardship, control, or site-specific faith restrictions.",
    "publicPosture and pilgrimageStatus remain descriptive classifications and create no access or pilgrimage mechanics."
  ]
}
```

The draft intentionally omits `deityIds`, `religiousOrderIds`, `dominantFaithIds`, `toleratedFaithIds`, and `restrictedFaithIds`.

## 5. Activation Blockers

The candidate must remain `planned` because:

- `packages/schemas/world/sacred-site.schema.json` does not exist;
- `tools/content-lint/sacred-sites.mjs` does not exist;
- focused sacred-site validation tests do not exist;
- `packages/content/base/world/sacred_sites.json` does not exist;
- sacred sites are not registered in normal content lint;
- no active sacred-site validation lane exists;
- direct `sacred_site` Knowledge subject vocabulary and authority resolution do not exist;
- no sacred-site activation or Knowledge snippet plan exists;
- current authority does not prove a deity dedication or religious-order stewardship beyond the broad Elemental Pantheon association;
- current authority does not prove a separately bounded structure beyond the named settlement-centered shrine candidate.

Schema and validator implementation alone will not authorize activation. A later status decision must re-audit authority after planned content exists.

## 6. Knowledge Blockers

- No sacred-site Knowledge snippet may be added yet.
- `knowledge_domain.religion` must not advertise `sacred_site` or `world.sacred_sites` yet.
- Direct `sacred_site` vocabulary must first land in both Knowledge subject schemas and validation.
- Knowledge validation must resolve canonical site ids and enforce active-only sacred-site references.
- The first sacred-site snippet must wait until one named record is active and validated.
- The future first snippet should be exactly one Tier 1 Religion identification snippet selected by a separate plan.
- No `knowledge_domain.sacred_sites` is authorized.

## 7. Next Route

The next run should be `Version 0.5.188 - Sacred Site Schema And Validator`.

That run should implement only:

- `packages/schemas/world/sacred-site.schema.json`;
- pure `tools/content-lint/sacred-sites.mjs` validation;
- focused `tests/unit/sacred-sites-validation.test.mjs` coverage;
- focused schema-file registration if consistent with current conventions.

It must not create `packages/content/base/world/sacred_sites.json`, register sacred sites in normal content lint, add Knowledge vocabulary or authority resolution, change the Religion registry, add snippets, activate a site, or add runtime, UI, storage, pilgrimage, or gameplay behavior.

## 8. Non-Goals And Guardrails

- no live content changed;
- no sacred-site content file created;
- no schema, validator, source, or test implementation in this run;
- no Knowledge snippet or Religion registry changes;
- no religious hotspot record changes;
- `religious_hotspot.lantern_shrine_gardens` remains planned and unreferenced;
- `sacredSiteType` remains descriptive metadata only;
- no pilgrimage, favorability, alignment, law, religious-order, spell, Magic Study, Prestige, family, NPC, inventory, map/grid, travel, runtime, UI, storage, command, event, reward, or gameplay behavior;
- no transition to `0.6.0`.
