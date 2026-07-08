# Discovery And POI Gate Intake Audit

Source version/run: Version 0.5.291 - Discovery And POI Gate Intake Audit
Date: 2026-07-08
Status: documentation-only intake audit; no implementation

## 1. Intake Summary

This audit inspects the current discovery, point-of-interest, map-feature, Knowledge, quest, settlement/site, route/travel, runtime, UI, and save/account surfaces before selecting the next safe route.

Current evidence does not justify a generic static `world.pois` authority, a POI schema, a POI seed, discovery state, map reveal, or UI/runtime work in this pass.

The safest current posture is:

- keep authored POI-like identity on existing or future specific authority collections;
- keep discovery-source vocabulary inside Knowledge as possible evidence only;
- keep actual known, discovered, visited, revealed, completed, and map-reveal state with future runtime/save owners;
- run one focused docs-first boundary decision next before any schema or content route is proposed.

## 2. Current Completed-State Posture

Latest completed primary before this run:

- `Version 0.5.290 - Static Authority Validation Consolidation Audit`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Important current guardrails:

- The Highcrown settlement Knowledge lane remains closed from `Version 0.5.285 - Highcrown Settlement Knowledge Lane Closure Review`.
- `Version 0.5.287 - Service Authority Boundary Decision`, `Version 0.5.288 - Resource And Commodity Schema Decision`, and `Version 0.5.289 - Combat Status Condition And Injury Boundary Decision` remain planning authorities only for their deferred lanes.
- `Version 0.5.290` confirmed that no deferred service, resource, commodity, status, condition, or injury implementation has landed.
- Existing static validation lanes reject discovery/map-reveal ownership where it does not belong.

## 3. Current Discovery And POI-Related Surfaces

Fresh local inspection found these relevant live surfaces:

| Surface | Current count or posture | Discovery / POI relevance |
| --- | ---: | --- |
| `packages/content/base/world/map_features.json` | 2 records | Static semantic map-feature identity only; notes explicitly reject POI placement, Knowledge, runtime, UI, storage, commands, events, rewards, and gameplay. |
| `packages/content/base/world/world_map_features.json` | 1 record | Visual/reference geometry aggregate; not semantic POI identity or reveal state. |
| `packages/content/base/world/world_maps.json` | 1 record | Map metadata surface; not player reveal state. |
| `packages/content/base/world/world_hexes.json` | 47 records | Semantic terrain/exploration cells; not discovery state or place identity. |
| `packages/content/base/world/world_hex_edges.json` | 49 records | Traversal topology; not discovery state. |
| `packages/content/base/world/travel_networks.json` | 1 record | Transitional route/travel authority; not current party movement, pathfinding, reveal, or visit state. |
| `packages/content/base/world/settlements.json` | 88 records | Canonical settlement identity; possible POI-like anchor, but owned as settlement authority. |
| `packages/content/base/world/settlement_districts.json` | 2 records | Static district identity; possible POI-like local anchor, but district-owned. |
| `packages/content/base/world/settlement_sites.json` | 2 records | Static site identity; possible POI-like local anchor, but site-owned. |
| `packages/content/base/world/sacred_sites.json` | 1 record | Named sacred-site authority; possible POI family, but religion/site-owned. |
| `packages/content/base/world/religious_hotspots.json` | 2 records | Religious hotspot authority; contextual place signal, not map reveal. |
| `packages/content/base/world/encounter_templates.json` | 6 records | Encounter structure; not POI identity or map reveal. |
| `packages/content/base/world/spawn_profiles.json` | 5 records | Spawn context; not POI identity or discovery state. |
| `packages/content/base/civilization/quest_definitions.json` | 5 records | Quest-authored hooks and objectives; not global POI/reveal authority. |
| `packages/content/base/civilization/quest_templates.json` | 36 records | Repeatable offer inputs; not persistent POI or reveal state. |
| `packages/content/base/civilization/quest_archetypes.json` | 8 records | Quest structure; not POI state. |
| `packages/content/base/player/knowledge_snippets.json` | 16 records | Knowledge content has `discoverySources`; these are possible evidence routes, not automatic discovery or map reveal. |
| `packages/content/base/player/knowledge_domain_registry.json` | 7 domains | Includes source vocabularies such as `travel_observation` and `travel_event`; these do not create travel-event, POI, or reveal state authority. |

No live `world.pois`, `point_of_interest`, `points_of_interest`, or equivalent canonical POI authority was found in current content, schemas, validators, runtime, tests, or UI source.

## 4. Current Owner Matrix

| Concern | Current or future owner posture |
| --- | --- |
| Static place identity | Specific named authority collections: settlements, districts, sites, sacred sites, religious hotspots, map features, and future family-specific authorities such as ruins, forts, caves, mines, ports, or landmarks. |
| Generic POI identity | Not approved. A generic `world.pois` collection would duplicate current explicit authority families unless a later decision proves a narrow non-duplicative role. |
| POI placement rules | Separate future planning/rule authority only. Placement rules must not create canonical authored POIs by implication. |
| Visual map geometry | Existing `world.world_map_features` and map assets; not semantic place authority. |
| Static semantic map features | Existing `world.map_features`; descriptive physical/cultural feature identity only. |
| Travel topology | Existing hexes, edges, and travel network records; not current journey or reveal state. |
| Route visibility | Future boundary needed; current route records do not own whether the player knows, has traveled, or can see them. |
| Map reveal | Future runtime/save state, not authored world authority. |
| Discovered/visited/completed flags | Future player/session/account state, not static content. |
| Knowledge unlocking | Knowledge evidence/progress/completion owners only after explicit policy; source vocabulary does not auto-complete snippets. |
| Quest/narrative discovery | Quest definitions, archetypes, templates, future event/storylet owners, and runtime quest state must remain separate. |
| Encounter/spawn exposure | Encounter and spawn owners may provide context, but do not own POI records or reveal state. |
| Rewards/events | Source-local authored envelopes remain non-paying; runtime reward/event execution remains outside this pass. |
| UI markers | Future UI presentation of known/revealed places only; UI must not become authoritative state. |
| Save/account persistence | Existing save/session contracts contain limited `knownLocations` and discovery Chronicle surfaces, but no generalized POI/map-reveal implementation. |

## 5. Options Considered

### Option A - Descriptors On Existing Authorities For Now

Keep POI-like identity with specific authority collections and allow only stable descriptive posture later where each owner needs it.

Pros:

- matches current repository structure;
- avoids duplicating settlements, sites, sacred sites, map features, and future family-specific authorities;
- preserves runtime/save ownership for player-known and map-revealed state;
- fits existing validator posture that rejects discovery/map-reveal fields in static authorities.

Cons:

- requires a boundary decision to keep terminology consistent across map, Knowledge, travel, and UI surfaces;
- does not create a single POI catalog for UI or generation.

### Option B - Future Separate Static POI Authority In Principle

Create a future generic static POI authority for authored persistent points of interest.

Rejected for now because current permanent geography guidance says canonical POIs belong to their specific named authority family. A generic static authority would likely duplicate settlements, sites, sacred sites, religious hotspots, map features, and future ruins/forts/caves/mines/ports/landmarks.

### Option C - Hybrid Static POI Vocabulary Plus Runtime Discovery State

Create a narrow static vocabulary for POI categories while runtime owns known/visited/revealed state.

Not selected in this intake. A vocabulary-only catalog may eventually be useful, but the current repo first needs a boundary decision proving which terms cannot remain local descriptors on specific owners.

### Option D - Defer POI/Discovery Authority Entirely

Do not run more discovery/POI work yet and move to the next later gate.

Rejected as the immediate next step because current evidence shows enough cross-surface ambiguity to clarify boundaries now: map features reject POI placement, travel docs mention future POIs and discovery state, Knowledge uses discovery-source vocabulary, runtime/save contracts expose limited known-location/discovery Chronicle surfaces, and user design notes expect known/visited POI behavior later.

## 6. Selected Posture

Select Option A for current authored content posture: POI-like identity remains descriptors and records on existing or future specific authority families, not a generic static POI authority.

Also select a follow-up docs-first boundary decision, not a schema plan or seed plan:

`Version 0.5.292 - Discovery And POI Boundary Decision`

That decision should define the allowed vocabulary and owner boundaries for:

- authored public/hidden/surveyable posture, if any;
- known/discovered/visited/revealed/completed player state;
- map reveal versus Knowledge discovery;
- route, hex, map-feature, settlement, district, site, sacred-site, hotspot, quest, encounter, and spawn references;
- UI marker eligibility without UI ownership;
- save/session/account persistence boundaries.

## 7. Required Blockers Before Any Implementation

Before any POI/discovery schema, seed, validator, runtime, UI, or save/account implementation, a later run must have:

- a completed boundary decision proving exact ownership;
- explicit selection of whether a generic static authority is still rejected or narrowly justified;
- a field-level schema plan if any static authority is approved;
- a fresh live-repo audit of current content and contracts;
- a seed plan for any live content;
- focused validation requirements;
- explicit non-goals for travel/pathfinding, map reveal, Knowledge progress, quest state, encounter spawning, rewards, UI, storage, and gameplay.

## 8. Rejected Alternatives

- Creating `world.pois` now.
- Adding `point_of_interest` or `points_of_interest` schema files.
- Adding POI records to content.
- Adding discovery, known, visited, revealed, completed, or map-reveal fields to static records.
- Treating Knowledge `discoverySources`, `travel_observation`, or `travel_event` as route, journey, POI, or reveal authority.
- Treating existing `knownLocations` as a full discovery/map-reveal implementation.
- Using map pixels, visual geometry, labels, route ids, hex tags, quest prose, encounter context, spawn profiles, or UI text as proof of canonical POI records.

## 9. Explicit Non-Goals

This run does not:

- implement POI content;
- create or modify schemas, validators, tests, loaders, lint registration, or content JSON;
- change runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, travel/pathfinding, map reveal, quest state, Knowledge state, encounter/spawn behavior, or gameplay;
- reopen the Highcrown settlement Knowledge lane;
- implement service, resource, commodity, status, condition, or injury authorities;
- run Deep Research;
- move the project to `0.6.x`.

## 10. Validation And Checks

Checks and inspections used for this audit:

- `git status --short --branch`
- `git fetch origin`
- `git pull --ff-only origin master`
- required docs reads: README, current Codex output, current GPT handoff, sequenced implementation plan, roadmap, backlog, and relevant design decisions
- targeted record counts for map, travel, settlement/site, sacred/hotspot, encounter/spawn, quest, and Knowledge surfaces
- targeted searches for POI/discovery/map-reveal terminology across docs, content, schemas, validators, runtime, tests, and UI source
- targeted inspection of `knownLocations`, `discoveryChronicle`, `discoveredAtTick`, and `discoveredAtLabel` contracts and fixtures

## 11. Next Recommended Version

Version 0.5.292 - Discovery And POI Boundary Decision

Reasoning: this intake found no safe generic POI authority to implement, but it did find enough cross-surface discovery/POI vocabulary to require a focused ownership decision before moving to schema, seed, runtime, UI, save/account, or the next later gate.
