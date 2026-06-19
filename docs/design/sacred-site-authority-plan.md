# Sacred Site Authority Plan

Version: `0.5.184`
Status: completed documentation-only authority plan
Date: 2026-06-19

## 1. Purpose And Decision

Future named sacred sites should use a separate `world.sacred_sites` authority collection while remaining semantically a rare specialization of `world.religious_hotspots`.

The separate layer is required because a named site needs canonical identity, precise place authority, and explicit religious relationships that cannot be inferred from a hotspot classification field. Every future sacred-site record should reference a canonical parent religious hotspot; the sacred-site layer must not become an unrelated parallel place system.

This run creates no sacred-site content, collection, schema, validator, Knowledge vocabulary, snippet, pilgrimage mechanic, runtime state, UI, storage, or gameplay behavior.

## 2. Current Authority Boundary

- `world.religious_hotspots` is the current descriptive hotspot authority.
- `religious_hotspot.glasswake_shrine_lantern_gardens` is the only active hotspot and owns the only live hotspot Knowledge snippet.
- `religious_hotspot.lantern_shrine_gardens` remains planned without `dominantFaithIds` and unreferenced.
- Existing `sacredSiteType: "shrine"` values classify hotspot context only.
- No `world.sacred_sites` collection, `sacred_site.*` canonical ids, direct `sacred_site` Knowledge subject vocabulary, or named sacred-site authority exists.
- Religion registry policy references remain null.

No current record may be treated as a named sacred site merely because its `sacredSiteType` is non-null.

## 3. Identity Model

A future sacred-site record represents one specifically named religious place with its own canonical identity. It is narrower than a `religious_hotspot`, which may describe a settlement, locality, cluster, route context, or wider concentration of religious activity.

The identity boundaries are:

| Concept | Authority |
| --- | --- |
| `religious_hotspot` | Parent descriptive religious-area authority; may exist without any named sacred site. |
| `sacredSiteType` | Classification metadata only; never creates a site or a canonical id. |
| place anchor | Geographic attachment and coherence evidence; not sacred identity by itself. |
| named sacred site | Future canonical `sacred_site.*` record in `world.sacred_sites`, linked to one parent hotspot. |
| pilgrimage | Later behavior or activity that may target an active sacred site; not part of identity. |
| religious-order stewardship | Optional later organizational relationship; neither required nor inferred. |
| runtime state | Later mutable visit, access, progress, favor, law, reward, or event state; excluded from authority content. |

## 4. Minimum Future Record

The next schema-decision pass should evaluate this minimum descriptive record shape:

| Field | Planned requirement | Boundary |
| --- | --- | --- |
| `id` | required stable `sacred_site.<slug>` id | Canonical identity; exact pattern finalized by schema decision. |
| `slug` | required | Must agree with `id`. |
| `name` | required | Authored proper name, not derived from type metadata. |
| `summary` | required | Descriptive facts only. |
| `status` | required | Planned lifecycle vocabulary; active required before live snippets. |
| `religiousHotspotId` | required | Canonical parent in `world.religious_hotspots`; parent/place coherence must validate. |
| `placeAnchor` | required | Exact supported geographic attachment; must not invent map or travel behavior. |
| `religionIds` | required non-empty | Associated or owning religions supported by source authority. |
| `deityIds` | optional | Omit unless explicit deity authority exists. |
| `religiousOrderIds` | optional | Omit unless canonical order authority and a proven relationship exist. |
| `sacredSiteType` | required | Site classification such as shrine; enum belongs to the later schema decision. |
| `publicPosture` | required | Descriptive public-facing posture only; no access or law consequence. |
| `pilgrimageStatus` | required descriptive classification | Does not create routes, progress, rewards, or mechanics. |
| `sourceAuthorityNotes` | required | States the source basis for identity, location, and religious relationships. |
| `notes` | required | Must include explicit no-runtime and no-gameplay boundaries. |

The schema decision must also determine exact wrapper identity, place-anchor shape, lifecycle enum, sacred-site type enum, public-posture enum, pilgrimage-status enum, duplicate rules, parent-status policy, reference resolution, and whether rare confluence fields belong in the first schema or remain deferred.

## 5. Relationship Rules

- Every sacred site is associated with one canonical religious hotspot; not every hotspot contains a sacred site.
- A sacred site must not replace its settlement, locality, region, or hotspot parent.
- Place anchors locate the record but do not prove sacredness.
- Religion associations must be explicit. Deity and order associations remain absent unless their owning authorities prove them.
- A religious order may later steward or control a sacred site, but organization authority and control semantics belong to a separate plan.
- Rare confluence sites require later explicit multi-element authority and a rare trigger; no confluence fields or records are authorized here.

## 6. Knowledge Snippet Sequence

Named sacred sites require canonical `sacred_site.*` ids before Knowledge snippets may reference them. Do not use `religious_hotspot`, `shrine`, `custom`, a place anchor, or `sacredSiteType` as a shortcut for a named-site subject.

Future work should remain staged:

1. `Version 0.5.184 - Sacred Site Authority Plan` - completed documentation only.
2. `Version 0.5.185 - Sacred Site Authority Schema Decision` - planning only; finalize the structural contract and validation ownership.
3. Sacred Site Authority Schema And Validator - later implementation after an approved schema decision.
4. Sacred Site Authority Seed Plan - select named records and prove source authority without adding live content.
5. Sacred Site Authority Seed - add planned records only unless a separate status decision justifies activation.
6. Sacred Site Knowledge Subject Vocabulary Plan - decide `sacred_site` schema, registry, and validator support.
7. Sacred Site Knowledge Subject Schema And Validator - implement direct authority resolution and active-only policy.
8. Sacred Site Knowledge Snippet Seed Plan - select non-duplicative claims and supported discovery sources.
9. Sacred Site status activation, registry alignment, and snippet seeding - separate narrow runs as required by the approved plans.

Religion should remain the Knowledge domain unless a later domain plan proves a separate domain is necessary. No `knowledge_domain.sacred_sites` is authorized.

## 7. Pilgrimage Boundary

Pilgrimage remains the preferred first future sacred-site mechanic, but it is not implemented or structurally defined here. `pilgrimageStatus` is descriptive content only.

Later pilgrimage planning must separately own eligibility, routes, travel, visits, progress, completion, rewards, trials, quests, events, cooldowns, persistence, UI, and interactions with favorability or alignment. None may be inferred from a sacred-site authority record.

## 8. Forbidden Inferences And Claims

Until later authority and implementation exist, sacred-site data and snippets must not claim or create:

- a named site derived only from `sacredSiteType`, a settlement name, or a place anchor;
- deity affiliation or religious-order stewardship without explicit canonical authority;
- pilgrimage routes, eligibility, progress, completion, rewards, boons, trials, quests, or services;
- favorability, elemental alignment, reputation, faction, relationship, conversion, apostasy, or desecration effects;
- legal status, access restrictions, enforcement authority, donations, ownership transfer, or control;
- spell access, Magic Study readiness, Prestige, family, inheritance, or NPC behavior;
- inventory, map/grid, travel, runtime, UI, storage, command, event, reward, or gameplay state.

## 9. Version 0.5.185 Boundary

`Version 0.5.185 - Sacred Site Authority Schema Decision` should remain documentation-only. The collection and semantic ownership choice is decided, but exact structural and validation details still require a focused decision before implementation.

That run must not create `world.sacred_sites`, a schema, validator, tests, content, Knowledge vocabulary, snippets, pilgrimage mechanics, or behavior.

## 10. Non-Goals

- no sacred-site collection, content, schema, validator, source, or test implementation;
- no live Knowledge snippet or Religion registry changes;
- no religious hotspot record or status changes;
- no locality hotspot activation or snippet coverage;
- no pilgrimage, favorability, alignment, law, religious-order, spell, Magic Study, Prestige, family, NPC, inventory, map/grid, travel, runtime, UI, storage, or gameplay behavior;
- no transition to `0.6.0`.
