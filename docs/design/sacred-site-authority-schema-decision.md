# Sacred Site Authority Schema Decision

Version: `0.5.186`
Status: completed documentation-only schema decision
Date: 2026-06-19

## 1. Decision Summary

Future named sacred sites will use a separate `world.sacred_sites` authored authority with a strict records-only wrapper, place-qualified canonical ids, explicit parent-hotspot references, descriptive religion and pilgrimage metadata, and fail-closed semantic validation.

This decision refines the provisional `religiousHotspotId` name from the 0.5.184 plan to `parentReligiousHotspotId` because the relationship is specifically parental. It does not change the underlying 0.5.184 ownership decision.

This run creates no collection, schema, validator, tests, content, Knowledge subject support, snippet, runtime state, UI, storage, pilgrimage, or gameplay behavior.

## 2. Collection And File Identity

| Concern | Decision |
| --- | --- |
| collection id | `world.sacred_sites` |
| future content path | `packages/content/base/world/sacred_sites.json` |
| future schema path | `packages/schemas/world/sacred-site.schema.json` |
| future validator path | `tools/content-lint/sacred-sites.mjs` |
| future focused test path | `tests/unit/sacred-sites-validation.test.mjs` |
| wrapper | exact top-level `{ "records": [...] }`; no wrapper metadata or extra keys |

The schema and pure validator should be implemented together in a later narrow run and registered in the focused schema-file test. They should not be registered in normal content lint until `sacred_sites.json` is added by a later approved content seed. That seed should add one checked file, moving normal lint from 57 to 58 files.

## 3. Canonical Record Identity

The future id pattern is:

`sacred_site.<place_or_region_slug>.<site_slug>`

The corresponding regex should be:

`^sacred_site\.[a-z0-9]+(?:_[a-z0-9]+)*\.[a-z0-9]+(?:_[a-z0-9]+)*$`

This is a named-site identity, not a generic type label. `sacred_site.shrine` is invalid because it contains only a type and lacks both the qualifying place segment and named-site segment.

`sacred_site.glasswake_shrine_lantern_gardens.glasswake_shrine` is a structurally valid example under current authority, but it is not selected as content by this decision. Exact seed ids, names, and claims belong to the future content seed plan.

The required `slug` should remain compatible with the repository's flat slug convention by joining the two id suffix segments with an underscore. For the example above, the slug would be `glasswake_shrine_lantern_gardens_glasswake_shrine`. Validation should require exact id/slug agreement under that transformation and unique ids and slugs.

## 4. Record Contract

Future records should be strict objects with `additionalProperties: false`.

### Required Fields

| Field | Structural contract | Semantic purpose |
| --- | --- | --- |
| `id` | required canonical pattern | Stable named-site identity. |
| `slug` | required flat slug pattern | Stable unique lookup and id agreement. |
| `name` | required non-empty string | Authored proper name. |
| `summary` | required non-empty string | Descriptive authority only. |
| `status` | `planned`, `active`, or `deferred` | Content lifecycle and Knowledge eligibility boundary. |
| `placeAnchor` | required strict object | Geographic attachment using existing place authorities. |
| `parentReligiousHotspotId` | required `religious_hotspot.*` id | Canonical parent in `world.religious_hotspots`. |
| `religionIds` | required non-empty unique array | Explicit broad religion association. |
| `sacredSiteType` | required conservative enum | Named-site classification, not identity. |
| `publicPosture` | required descriptive enum | Public-facing posture without access or law effects. |
| `pilgrimageStatus` | required descriptive enum | Scale of recognized pilgrimage significance only. |
| `sourceAuthorityNotes` | required non-empty unique notes | Provenance for identity, place, and relationships. |
| `notes` | required non-empty unique notes | Explicit no-runtime and no-gameplay boundaries. |

### Optional Fields

| Field | Contract | Boundary |
| --- | --- | --- |
| `deityIds` | optional unique array of canonical deity ids | Every deity must exist and belong to a listed religion; never inferred. |
| `religiousOrderIds` | optional unique array of canonical order ids | Structurally reserved, but any use must fail semantic validation until religious-order authority exists and is supplied. First seed must omit it. |

`dominantFaithIds`, `toleratedFaithIds`, and `restrictedFaithIds` should not appear in the first sacred-site schema. Sacred sites own explicit associations through `religionIds`; faith dominance and restriction require a later dedicated authority decision.

## 5. Place Anchor Contract

`placeAnchor` should reuse current world-place id families while remaining strict:

| Field | Requirement |
| --- | --- |
| `macroRegionId` | required canonical `region.*` id resolving to a continent or island-system authority accepted by current place validation |
| `regionId` | required canonical `region.*` id resolving within `macroRegionId` |
| `regionLocalityId` | optional canonical `region_locality.*` id coherent with both region fields |
| `settlementId` | optional canonical `settlement.*` id coherent with the region and locality when present |

The anchor may be region-scale when no narrower authority exists, but a seed plan must justify why that precision is sufficient for a named site. A place anchor locates a sacred site; it does not establish sacred identity, services, routes, access, ownership, or runtime behavior.

## 6. Planned And Active Semantics

Planned and active records use the same required structural fields. Status changes semantic requirements rather than changing object shape.

### Planned

- may preserve a source-backed future named-site proposal;
- must resolve its place, parent hotspot, and religion references;
- may reference a planned or active parent hotspot;
- is ineligible for live Knowledge snippet references;
- does not imply access, services, pilgrimage, favorability, law, order control, spell access, or gameplay behavior.

### Active

- must satisfy every structural and semantic rule without placeholders;
- must reference an active parent religious hotspot;
- must have authoritative identity, place, non-empty `religionIds`, public posture, pilgrimage classification, and provenance notes;
- may be referenced by future Knowledge snippets only after direct `sacred_site` Knowledge subject support exists;
- still creates no access, service, pilgrimage, favorability, law, order control, spell, runtime, or gameplay behavior.

### Deferred

- preserves an authored record that is not currently advancing;
- must remain structurally and referentially valid;
- is ineligible for Knowledge snippet references.

## 7. Parent Religious Hotspot Rules

- Every sacred site must reference exactly one canonical `parentReligiousHotspotId`.
- The parent hotspot must exist.
- Every populated parent place-anchor field must match the sacred-site anchor; the site may add valid narrower locality or settlement specificity but may not contradict or broaden away from its parent.
- An active sacred site requires an active parent hotspot.
- Not every hotspot contains a named sacred site.
- A hotspot may later contain multiple named sacred sites only when separate authority proves each identity and place relationship.
- A hotspot's `sacredSiteType` remains descriptive metadata and never creates, names, or activates a sacred-site record.

## 8. Religion, Deity, And Order References

- `religionIds` is required and owns broad association only.
- `deityIds` is optional. Each id must resolve through `world.religions`, and the deity's parent religion must appear in `religionIds`.
- A deity association must not be inferred from a religion, hotspot, site name, or type.
- `religiousOrderIds` is optional in the future shape but unusable until canonical religious-order authority exists.
- Before that authority exists, the semantic validator should reject any present `religiousOrderIds` field rather than accept unresolvable placeholders.
- Order stewardship, sponsorship, ownership, control, membership, services, or law authority is never implied by religion, deity, hotspot, or sacred-site association.
- The first sacred-site seed must not claim order control.

## 9. Type And Posture Vocabularies

### Sacred Site Type

The first schema should use this conservative enum:

- `shrine`
- `temple`
- `monastery`
- `holy_spring`
- `sacred_grove`

Defer `chapel`, `sanctuary`, `reliquary`, and `wayside_shrine` until authored content proves that each needs a distinct stable meaning rather than mapping to an existing type or another authority family. Also defer confluence-specific types until multi-element authority and rare-trigger rules are separately planned.

### Public Posture

Reuse the current descriptive hotspot vocabulary:

- `indifferent`
- `universal`
- `tolerant`
- `aligned`
- `exclusive`

These labels do not create access, law, services, reaction, or enforcement behavior.

### Pilgrimage Status

Use the future descriptive enum:

- `none`
- `local`
- `regional`
- `major`

Do not include `seasonal` in the first sacred-site enum because it describes timing rather than scale and would require separate calendar authority.

`pilgrimageStatus` creates no route, progress, completion, reward, favorability, travel, UI, persistence, runtime, or gameplay behavior. Pilgrimage routes require a later separate `pilgrimage_route` authority plan. No pilgrimage mechanic is authorized by sacred-site authority data.

## 10. Knowledge Sequence

1. Implement the sacred-site schema, pure validator, and focused tests without live content or normal lint registration.
2. Complete a docs-only seed plan selecting at most one first planned record.
3. Add the approved planned record and register the collection in normal lint.
4. Complete a separate Sacred Site Knowledge Subject Decision.
5. Add direct `sacred_site` vocabulary and active-only authority resolution to Knowledge schemas and validation.
6. Activate a selected site only through a separate status decision after its authority is complete.
7. Align `knowledge_domain.religion` with `sacred_site` and `world.sacred_sites` only when the first live snippet is ready.
8. Add exactly one Tier 1 Religion identification snippet for one active named site.

The sacred-site collection, schema, and validator must exist before Knowledge subject support. Religion must not advertise `sacred_site` before direct subject support lands. No `knowledge_domain.sacred_sites` is authorized.

## 11. Future Validation Posture

The future pure validator should fail closed and validate:

1. exact records-only wrapper shape and a non-empty records array;
2. supported schema vocabulary and schema-first record compliance;
3. unique ids and slugs;
4. exact id prefix, two-segment suffix pattern, and deterministic flattened slug agreement;
5. valid status, `sacredSiteType`, `publicPosture`, and `pilgrimageStatus` values;
6. required non-empty strings and unique non-empty note arrays;
7. strict place-anchor shape and canonical region, locality, and settlement resolution;
8. `parentReligiousHotspotId` resolution and place-anchor coherence;
9. active-site to active-parent status coherence;
10. canonical `religionIds` resolution;
11. canonical `deityIds` resolution and parent-religion membership when present;
12. rejection of `religiousOrderIds` until order authority is supplied, followed later by canonical resolution;
13. active-record authority completeness;
14. rejection through `additionalProperties: false` of runtime, player-state, access, service, route, reward, law, relationship, favorability, alignment, command, event, UI, storage, and gameplay fields.

The validator should consume explicit dependency records, remain pure, and avoid duplicating the full validation responsibilities of religions, hotspots, regions, localities, settlements, or future orders.

## 12. First Seed Readiness

The project is ready for `Version 0.5.187 - Sacred Site Content Seed Plan` after this decision lands.

That run must be documentation-only, select at most one first `planned` sacred-site record, prove its named identity and place/religion/parent-hotspot authority, omit unsupported deity and order references, and draft it against this contract. It must not create `sacred_sites.json`, a schema, validator, tests, Knowledge support, snippets, or behavior.

## 13. Non-Goals

- no sacred-site schema, validator, test, content file, or lint registration;
- no live content, Knowledge snippet, Religion registry, or religious hotspot changes;
- no locality hotspot activation or reference;
- no pilgrimage, favorability, alignment, law, religious-order, spell, Magic Study, Prestige, family, NPC, inventory, map/grid, travel, runtime, UI, storage, command, event, reward, or gameplay behavior;
- no transition to `0.6.0`.
