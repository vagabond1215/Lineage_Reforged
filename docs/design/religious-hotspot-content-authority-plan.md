# Religious Hotspot Content Authority Plan

Source version/run: Version 0.5.172 - Religious Hotspot Content Authority Plan
Date: 2026-06-16
Status: Documentation-only plan. No content JSON, schema, validator, test, runtime, UI, storage, persistence, trial, reward, event, command, favorability, alignment, consequence, family, Prestige, Magic Study, or gameplay behavior is implemented here.

## Purpose

This plan defines the future content authority needed before Religious Hotspot Knowledge snippets can be authored safely.

`knowledge_domain.religion` is active. Exactly two Religion Knowledge snippets are live:

- `knowledge_snippet.religion.elemental_pantheon.identification`
- `knowledge_snippet.religion.light_lady.identification`

Those two identification snippets remain the only live Religion snippets. Hotspot snippets remain blocked until there is explicit authored authority for place identity, religion/deity/order affiliation, dominant and tolerated faith posture, hotspot intensity, public posture, and supported subject references.

## Current Authority Recap

- `packages/content/base/world/religions.json` owns top-level religion records, nested deity records, nested religious-order records, and broad structure types such as shrine, temple, great temple, and convergence site.
- `packages/content/base/world/regions.json`, `packages/content/base/world/region_localities.json`, and `packages/content/base/world/settlements.json` own geography and settlement identity.
- Current shrine-adjacent geography includes `region.glasswake_quay`, `region_locality.lantern_shrine_gardens`, and `settlement.glasswake_shrine`.
- Those place records mention shrines, monastic houses, traveler relief, record copying, and related civic identity, but do not author exact religious hotspot records.
- Knowledge snippet subject vocabulary supports `religion` and `deity`, and the validator resolves top-level religion ids plus nested deity ids.
- The snippet validator still blocks settlement, culture, institution, historical-event, custom, and similar shortcut subjects. Region exists as a subject, but current region content is not enough to represent a specific religious hotspot.

## Missing Authority Facts

Future hotspot content needs all of the following before a live snippet should be added:

- exact hotspot identity and canonical id
- exact place anchor: region, locality, settlement, or a validated combination
- religion affiliation, with direct references to authored religion ids
- optional deity affiliation, with direct references to authored nested deity ids
- optional religious-order affiliation, with direct references to authored nested order ids
- dominant, tolerated, and restricted faith posture
- hotspot type and sacred-site/site-role identity
- hotspot intensity or severity, as descriptive content only
- public posture toward outsiders and mismatched faiths
- pilgrimage or visitor significance
- source notes explaining why the hotspot is authored and not inferred

## Placement Options

| Option | Strengths | Risks | Validation complexity | Schema/content impact | Suitability | Runtime-risk posture |
| --- | --- | --- | --- | --- | --- | --- |
| Add religion fields to regions, localities, and settlements | Keeps facts near place records; easy to read with geography. | Duplicates relationship logic across three schemas; hard to model multiple hotspots per place; risks treating every shrine-like label as a hotspot. | Medium to high because each place type needs relationship rules and hierarchy checks. | Touches existing world schemas and place content. | Useful only for broad dominant-faith annotations, not for named hotspots. | Medium risk of implying that place records drive access or consequence behavior. |
| Add nested sacred-site or shrine records under religion | Keeps religious doctrine, deities, orders, and structure types together. | Religion file would own geography; multiple religions at one place become awkward; place hierarchy is not naturally validated there. | High because nested records must reference external place ids and avoid duplicate site identity. | Expands religion schema/content substantially. | Good for religion-authored ideal site types; weak for actual placed hotspots. | Medium risk of implying religious systems own place behavior directly. |
| Create separate `world.religious_hotspots` collection | Clean relationship authority between place anchors and religion/deity/order records; supports multiple hotspots per place; can remain descriptive and non-runtime. | Adds a new collection, schema, and semantic validator path. | Medium: validate place anchors, religion/deity/order refs, uniqueness, and hierarchy coherence. | Adds one focused schema/content collection without overloading existing place or religion records. | Best first model for hotspot Knowledge snippets. | Low if fields are explicitly descriptive and consequence-free. |
| Create separate `world.sacred_sites` collection | Strong if the future needs named site inventory, relics, maps, pilgrimage routes, quests, or place services. | Too broad for the immediate hotspot problem; can blur into travel, relic, dungeon, and quest ownership. | Medium to high depending on whether it models service, relic, route, and quest data. | Adds a broader world collection that may invite extra scope. | Good later specialization; not necessary as the first authority. | Medium risk unless tightly limited to descriptive records. |
| Create separate religion/place relationship collection | Generalizes all relationships, including dominant religion, tolerated faiths, holy sites, orders, and conflicts. | Too abstract; may become a generic policy/favorability table before hotspot content is ready. | High because each relationship type needs semantics and validation. | Adds broad relationship infrastructure. | Useful later if many religion-place relationship types emerge. | High risk of implying favorability, law, conversion, or access behavior. |
| Defer until institutions, orders, or factions exist as standalone content | Avoids building authority before broader civil society is ready. | Blocks hotspot snippets even though enough religion and place anchors exist for a descriptive first slice. | Low now, high later when cross-system links appear. | No immediate schema/content impact. | Too conservative for the next Knowledge planning step. | Low now, but delays a useful safe content model. |

## Recommended Model

Create a separate authored `world.religious_hotspots` collection as the first hotspot authority.

This collection should be an umbrella relationship record between existing place anchors and existing religion/deity/order authority. It should not implement runtime effects, favorability, elemental alignment, service access, conversion, law, faction reputation, Prestige, family status, Magic Study, spell penalties, or gameplay consequences.

`world.sacred_sites` should remain deferred as a possible later specialized collection if the project needs richer named-site inventory, relic, route, quest, map, or service data. It should not be the first hotspot authority unless the next pass explicitly chooses a sacred-site inventory direction instead of Knowledge snippet readiness.

## Candidate Future Schema Shape

First version fields:

- `id`: canonical id, for example `religious_hotspot.glasswake_shrine`
- `slug`
- `name`
- `summary`
- `status`: `planned`, `active`, or `deferred`
- `placeAnchor`: object with `regionId`, optional `regionLocalityId`, optional `settlementId`, and a rule that at least one place id is present
- `religionIds`: non-empty array of `religion.*` ids
- `deityIds`: optional array of `deity.*` ids
- `religiousOrderIds`: optional array of `religious_order.*` ids, only if the validator resolves nested religion organizations in the same pass
- `dominantFaithIds`: optional array of `religion.*` ids, subset of known religion authority
- `toleratedFaithIds`: optional array of `religion.*` ids
- `restrictedFaithIds`: optional array of `religion.*` ids, descriptive only
- `hotspotType`
- `sacredSiteType`
- `hotspotIntensity`
- `publicPosture`
- `mismatchPressure`
- `pilgrimageStatus`
- `sourceAuthorityNotes`: non-empty notes explaining why the record is authored
- `notes`: non-empty notes for guardrails and deferred behavior

Deferred fields:

- numeric favorability, piety, reputation, suspicion, hostility, or conversion scores
- elemental alignment effects or affinities
- service access, denial, shop, trainer, temple, or healing rules
- faction, law, crime, apostasy, conversion, heresy, or social-penalty behavior
- Prestige, family, bloodline, heir, or dynasty consequences
- spell penalties, magic power, Magic Study, or ritual execution
- event, reward, quest, encounter, travel, route, map, or runtime spawn rules
- generated display copy for live snippets

## Enum Strategy

All values below are descriptive content labels only.

Candidate `hotspotType` values:

- `shrine_community`
- `temple_district`
- `pilgrimage_site`
- `monastic_settlement`
- `holy_market`
- `contested_sacred_site`
- `convergence_site`

Candidate `sacredSiteType` values:

- `none`
- `shrine`
- `temple`
- `great_temple`
- `monastery`
- `convergence_site`
- `chapel`
- `other`

Candidate `hotspotIntensity` values:

- `minor`
- `notable`
- `strong`
- `fanatical`

Candidate `publicPosture` values:

- `indifferent`
- `universal`
- `tolerant`
- `aligned`
- `exclusive`
- `fanatical`

Candidate `mismatchPressure` values:

- `none`
- `social_discomfort`
- `restricted_services`
- `hostile_scrutiny`

Candidate `pilgrimageStatus` values:

- `none`
- `local`
- `regional`
- `major`
- `seasonal`

Values such as `restricted_services`, `hostile_scrutiny`, and `fanatical` must not create behavior. They are authoring labels until a separate favorability, law, service, or consequence system owns behavior.

## Future-Only Candidate Records

These are non-live sketches. They must not be copied into content until a schema and validator exist.

### `religious_hotspot.glasswake_shrine`

- Status: future-only proposed record
- Place anchor: `region.glasswake_quay`, `region_locality.lantern_shrine_gardens`, `settlement.glasswake_shrine`
- Current support: settlement summary, `monastic_house`, `coastal_shrine`, `scholastic_hospice`, chapel-pier language, and locality traveler-relief and record-copying roles
- Proposed fields:
  - `religionIds`: proposed, likely `religion.elemental_pantheon`, but not live authority yet
  - `deityIds`: proposed only; no current place content proves a specific deity
  - `religiousOrderIds`: proposed only; no current place content proves a specific order
  - `hotspotType`: proposed `monastic_settlement` or `shrine_community`
  - `sacredSiteType`: proposed `shrine` or `chapel`
  - `hotspotIntensity`: proposed `minor` or `notable`
  - `publicPosture`: proposed `tolerant` or `universal`
  - `mismatchPressure`: proposed `none` or `social_discomfort`

### `religious_hotspot.lantern_shrine_gardens`

- Status: future-only proposed record
- Place anchor: `region.glasswake_quay`, `region_locality.lantern_shrine_gardens`
- Current support: locality type `shrine_garden`, religious estates, herbs, records, traveler relief, and favored monastery/estate settlement patterns
- Proposed fields:
  - `religionIds`: proposed, not live authority yet
  - `hotspotType`: proposed `shrine_community`
  - `sacredSiteType`: proposed `shrine`
  - `hotspotIntensity`: proposed `minor` or `notable`
  - `publicPosture`: proposed `universal` or `tolerant`
  - `mismatchPressure`: proposed `none`

These sketches deliberately avoid assigning exact deity/order allegiance until a future content pass explicitly authors it.

## Future Snippet Path

1. Add a schema plan for `world.religious_hotspots`.
2. Add the schema and semantic validator in a narrow implementation pass.
3. Add one or two future seed hotspot records after validator authority exists.
4. Add direct Knowledge snippet subject support for `religious_hotspot` only after content authority exists.
5. Add one narrow hotspot snippet that points directly at a hotspot record.

Do not use `custom`, `religion`, `deity`, `region`, settlement, shrine, sacred-site, or institution shortcuts to bypass missing hotspot authority.

## Future Validation Requirements

The future validator should enforce:

- wrapper shape and schema compliance
- canonical id format and duplicate-id rejection
- `placeAnchor` has at least one place id
- referenced region, locality, and settlement ids exist
- if multiple place anchors are present, their hierarchy is coherent
- `religionIds`, `dominantFaithIds`, `toleratedFaithIds`, and `restrictedFaithIds` resolve to existing top-level religion ids
- `deityIds` resolve to nested deity ids with duplicate and malformed-id rejection
- `religiousOrderIds`, if included, resolve to nested religious-order ids
- enum values are closed and descriptive
- notes explicitly state no runtime consequence authority
- active Knowledge snippets cannot reference hotspot ids until the hotspot collection and snippet subject are validated together

## Boundary With Favorability And Alignment

Religious hotspot authority is not favorability or alignment authority.

Favorability, elemental alignment, piety, standing, hostility, service access, conversion, apostasy, law, faction, Prestige, family, Magic Study, spell penalty, or gameplay effects require a separate design plan and a separate implementation path. A hotspot record may provide descriptive context later, but it must not calculate or imply behavior.

## Consequence Boundary

Consequence language is allowed only as descriptive posture. A record may say that a place is socially exclusive, under hostile scrutiny, or tolerant of outsiders, but no validator, helper, runtime, UI, event, reward, storage, or command should consume those labels as mechanics until a future owner is approved.

## Trial And Readiness Posture

Religion Knowledge Trial policy references remain null. Hotspot authority does not make trials runnable, does not create readiness policy content, and does not add trial eligibility, readiness, attempts, cooldowns, outcomes, or rewards.

## Non-Goals

- No live hotspot content
- No live hotspot snippets
- No schema, validator, or tests
- No changes to religion, region, locality, settlement, or snippet JSON
- No new favorability, alignment, piety, reputation, faction, law, conversion, apostasy, service, Prestige, family, Magic Study, spell, event, reward, runtime, UI, storage, or gameplay behavior
- No institution/order standalone content model
- No sacred-site inventory beyond a deferred possible collection

## Open Questions

- Should `religiousOrderIds` be included in the first schema if orders remain nested under religion, or deferred until orders become standalone content?
- Should `dominantFaithIds`, `toleratedFaithIds`, and `restrictedFaithIds` be required for active hotspot records, or optional until more religions exist?
- Should first records use `planned` status until a snippet subject exists, then shift to `active` only when snippet validation can reference them?
- Should `world.sacred_sites` later split from `world.religious_hotspots` for relics, routes, maps, and pilgrimage services?
- Should `fanatical`, `restricted_services`, and `hostile_scrutiny` remain in the first enum set, or wait until a consequence-boundary plan proves they will stay descriptive?

## Future Sequence

Recommended next:

- `Version 0.5.174 - Religious Hotspot Content Authority Schema Plan`

Rationale: the preferred model is clear, but the schema and semantic-validator contract should be planned before implementation. The plan should decide exact field requirements, nested religious-order resolver posture, active/planned status semantics, hierarchy checks, and whether the first schema should include direct `religious_hotspot` Knowledge subject preparation.

Deferred alternatives:

- `Version 0.5.174 - Religious Hotspot Content Authority Schema And Validator`: viable only if the user explicitly wants implementation next.
- `Version 0.5.174 - Religious Hotspot Content Authority Seed Plan`: should wait until schema shape is planned.
- `Version 0.5.175 - Religious Favorability And Elemental Alignment Plan`: remains separate and deferred unless explicitly prioritized.
