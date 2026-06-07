# Knowledge Snippet Content Authoring Plan

Source version/run: Version 0.5.116 - Knowledge Snippet Content Authoring Plan
Date: 2026-06-07
Status: planning-only snippet authoring contract; no schema, content, validator, runtime, persistence, UI, or generated-output implementation

## 1. Purpose And Status

This document defines the first narrow authored knowledge-snippet set, its future content location and wrapper, the schema hardening required before seed content, semantic validation ownership, and the safe implementation sequence.

This pass does not implement or change:

- knowledge snippet JSON
- knowledge-domain registry content
- legacy identification-policy content
- schemas
- content-lint or validator code
- runtime loaders or gameplay behavior
- database or persistence behavior
- save, account, family, character, or session state
- evidence or progress state
- completion or tier math
- knowledge trials
- UI or generated output
- Chronicle, Renown, reputation, or quest events
- item, spell, skill, or knowledge ownership

The record drafts below are authored-content specifications only. They create no discovery, completion, evidence, ownership, access, or runtime state.

## 2. Current State

The repository currently has:

- a record-level planning schema at `packages/schemas/player/knowledge_snippet.schema.json`
- five broad domains in `packages/content/base/player/knowledge_domain_registry.json`
- four domains with `status: "active"`:
  - `knowledge_domain.flora`
  - `knowledge_domain.fauna`
  - `knowledge_domain.minerals`
  - `knowledge_domain.general_lore`
- one domain with `status: "planned"`:
  - `knowledge_domain.arcane_lore`
- broad registry semantic validation in normal content lint
- no authored snippet content file
- no snippet structural or semantic content-lint entry
- no snippet runtime loader
- no snippet evidence, progress, completion, trial, or UI state

The snippet schema is not currently registered in `tests/unit/schema-files.test.mjs`. It also remains labeled as planning-only and lacks the stricter id, reference, complete-progression, and non-empty-text constraints needed before live seed content.

## 3. Ownership Boundaries

| Owner | Owns | Must not own |
| --- | --- | --- |
| Broad registry | Stable domain ids, domain status, supported subjects, categories, source types, and related collection authorities. | Individual facts, player progress, evidence, or UI state. |
| Snippet content | Stable snippet id, domain, subject, tier, category, learned text, possible source routes, authored weights, visibility hints, and optional prerequisites. | Discovered/completed state, evidence instances, current percentages, trial results, or ownership. |
| Subject content | Canonical flora, fauna, mineral, region, settlement, spell, item, or later subject records. | Knowledge completion or source evidence. |
| Evidence/runtime | Future proof of observation, study, instruction, use, or event credit and resulting player state. | Canonical snippet definitions. |
| Validation | Structural shape, ids, references, domain compatibility, source compatibility, prerequisites, and no-state boundaries. | Gameplay mutation or completion calculation. |
| Presentation | Future locked/discovered rendering and progress display. | Registry truth, evidence creation, or completion authority. |

## 4. Future Content File

Path:

- `packages/content/base/player/knowledge_snippets.json`

Wrapper:

```json
{
  "records": []
}
```

Wrapper rules:

- the top level is an object
- `records` is required
- no additional top-level fields are allowed
- the first seed contains exactly the four records in Section 6
- no version, timestamp, generated metadata, migration field, player state, or runtime state belongs in the wrapper

The content file remains content-lint-only until a dedicated runtime-loading plan explicitly authorizes loading.

## 5. First-Wave Scope

The first seed covers one Tier 1 record for each active broad domain.

| Domain | Status | Included | Reason |
| --- | --- | --- | --- |
| `knowledge_domain.flora` | `active` | Yes | Canonical `flora` subject authority exists. |
| `knowledge_domain.fauna` | `active` | Yes | Canonical `fauna` subject authority exists. |
| `knowledge_domain.minerals` | `active` | Yes | Canonical `mineral` subject authority exists. |
| `knowledge_domain.general_lore` | `active` | Yes | Canonical `region` subject authority exists and no more specific geography domain is live. |
| `knowledge_domain.arcane_lore` | `planned` | No | A planned domain is not open for live snippet authoring. Its skill link does not promote registry status. |

The first seed deliberately excludes:

- Tier 2-10 records
- prerequisite chains
- `custom` subjects, categories, or sources
- non-null text, teacher, institution, quest, Chronicle, scroll, or tome source ids
- culture, institution, ruin, and historical-event subjects without one selected canonical authority
- settlement, spell, and item snippets even though canonical collections exist
- completion-policy or trial-policy behavior

## 6. Exact First Seed Records

Approved authored order:

1. Flora
2. Fauna
3. Minerals
4. General Lore

### Aloe Identification

```json
{
  "id": "knowledge_snippet.flora.aloe.identification",
  "domainId": "knowledge_domain.flora",
  "subjectType": "flora",
  "subjectId": "flora.aloe",
  "tier": 1,
  "category": "identification",
  "title": "Recognizing Aloe",
  "summary": "Aloe is a perennial herb associated with tidal-flat habitat; its harvestable parts include leaves, stems, roots, and flowers.",
  "discoverySources": [
    {
      "sourceType": "field_identification",
      "sourceId": null
    }
  ],
  "progression": {
    "completionWeight": 1,
    "countsTowardTierCompletion": true,
    "trialUnlockWeight": 0
  },
  "visibility": {
    "lockedUntilDiscovered": true,
    "revealsSubjectIdentity": true,
    "hiddenSummary": "An unidentified plant remains to be understood."
  },
  "notes": [
    "Field identification is a possible discovery route only and does not grant completion without future evidence and progression rules."
  ]
}
```

Canonical fact sources:

- `packages/content/base/world/flora.json`
- `packages/content/base/world/habitats.json`

### Badger Identification

```json
{
  "id": "knowledge_snippet.fauna.badger.identification",
  "domainId": "knowledge_domain.fauna",
  "subjectType": "fauna",
  "subjectId": "fauna.badger",
  "tier": 1,
  "category": "identification",
  "title": "Recognizing the Badger",
  "summary": "The badger is a crepuscular omnivorous mammal with a medium danger classification and an association with tidal-flat habitat.",
  "discoverySources": [
    {
      "sourceType": "field_identification",
      "sourceId": null
    }
  ],
  "progression": {
    "completionWeight": 1,
    "countsTowardTierCompletion": true,
    "trialUnlockWeight": 0
  },
  "visibility": {
    "lockedUntilDiscovered": true,
    "revealsSubjectIdentity": true,
    "hiddenSummary": "An unidentified animal remains to be understood."
  },
  "notes": [
    "Field identification is a possible discovery route only and does not grant completion without future evidence and progression rules."
  ]
}
```

Canonical fact sources:

- `packages/content/base/world/fauna.json`
- `packages/content/base/world/habitats.json`

### Iron Ore Identification

```json
{
  "id": "knowledge_snippet.minerals.iron_ore.identification",
  "domainId": "knowledge_domain.minerals",
  "subjectType": "mineral",
  "subjectId": "mineral.iron_ore",
  "tier": 1,
  "category": "identification",
  "title": "Recognizing Iron Ore",
  "summary": "Iron ore is a tier-one mineral found in vein and lode deposits and can be extracted manually or with infrastructure.",
  "discoverySources": [
    {
      "sourceType": "field_identification",
      "sourceId": null
    }
  ],
  "progression": {
    "completionWeight": 1,
    "countsTowardTierCompletion": true,
    "trialUnlockWeight": 0
  },
  "visibility": {
    "lockedUntilDiscovered": true,
    "revealsSubjectIdentity": true,
    "hiddenSummary": "An unidentified mineral remains to be understood."
  },
  "notes": [
    "Field identification is a possible discovery route only and does not grant completion without future evidence and progression rules."
  ]
}
```

Canonical fact source:

- `packages/content/base/world/minerals.json`

### Kaelvar Cultural Context

```json
{
  "id": "knowledge_snippet.general_lore.kaelvar.cultural_context",
  "domainId": "knowledge_domain.general_lore",
  "subjectType": "region",
  "subjectId": "region.kaelvar",
  "tier": 1,
  "category": "cultural_context",
  "title": "Settlement Patterns of Kaelvar",
  "summary": "Kaelvar's southern coasts cluster ports and estates, while its interior depends on marches, mines, and caravan forts.",
  "discoverySources": [
    {
      "sourceType": "travel_observation",
      "sourceId": null,
      "locationScope": {
        "continentId": "region.kaelvar",
        "regionId": null,
        "settlementId": null,
        "biomeTags": []
      }
    }
  ],
  "progression": {
    "completionWeight": 1,
    "countsTowardTierCompletion": true,
    "trialUnlockWeight": 0
  },
  "visibility": {
    "lockedUntilDiscovered": true,
    "revealsSubjectIdentity": false,
    "hiddenSummary": "A regional settlement pattern remains undiscovered."
  },
  "notes": [
    "Travel observation is a possible discovery route only; entering or revealing Kaelvar does not grant completion."
  ]
}
```

Canonical fact source:

- `packages/content/base/world/regions.json`

General Lore is acceptable for this first regional context because no active geography or settlement-lore domain exists. A future specific domain should own later specialized authoring; General Lore must not become a permanent bypass.

## 7. Schema Readiness Requirements

Before seed content is added, a dedicated schema-hardening implementation should update `knowledge_snippet.schema.json` and register it in `tests/unit/schema-files.test.mjs`.

Required hardening:

- update the description from planning-only to authored content that remains non-runtime-loaded
- require `summary`
- require all three progression fields:
  - `completionWeight`
  - `countsTowardTierCompletion`
  - `trialUnlockWeight`
- do not rely on JSON Schema `default` to author missing values
- add an id pattern for `knowledge_snippet.<domain_slug>.<subject_slug>.<category_slug>`
- add the canonical `knowledge_domain.<slug>` pattern to `domainId`
- add a canonical dotted-id pattern to `subjectId`
- add `minLength: 1` to non-null authored strings
- add `uniqueItems: true` where exact duplicate array entries must be rejected
- require non-empty string items in prerequisite and notes arrays
- constrain prerequisite skill ids to current skill-id format
- constrain location ids and biome tags to canonical id/slug formats
- preserve Tier 1-10, rank 0-125, source-type, category, and subject-type vocabularies
- preserve optional prerequisites and optional `hiddenSummary`
- keep runtime state fields forbidden through `additionalProperties: false`

The schema-hardening pass must not add snippet content, runtime loading, completion behavior, or a general JSON Schema dependency.

## 8. Semantic Validation Ownership

After seed data exists, normal content lint should gain a focused pure snippet validator and tests. The validator should remain authoring protection only.

Required checks:

1. The wrapper contains exactly one `records` key.
2. Records are non-empty.
3. Every record passes the hardened snippet schema.
4. Snippet ids are unique.
5. Every `domainId` resolves to the broad registry.
6. New snippets may reference only domains with `status: "active"`.
7. `subjectType` appears in the domain's `canonicalSubjectTypes`.
8. `category` appears in the domain's `supportedSnippetCategories`.
9. Every discovery `sourceType` appears in the domain's `supportedDiscoverySourceTypes`.
10. Every subject resolves through the selected authority map.
11. The subject's collection appears in the domain's `relatedContentCollections`.
12. Required snippet ids and skill ids resolve.
13. Prerequisite graphs contain no self-reference or cycle.
14. Duplicate required skill ids and duplicate discovery-source declarations are rejected.
15. Location ids resolve and match their intended region type where applicable.
16. `hiddenSummary` is required semantically when `lockedUntilDiscovered` is true.
17. Empty prerequisite objects are rejected; omit `prerequisites` when none exist.
18. `custom` subject, category, or source use remains blocked until a dedicated authority and notes rule are approved.
19. A non-null `sourceId` is rejected until its source-type authority is explicitly mapped.
20. Validation creates no evidence, discovery, progress, completion, trial state, event, or ownership.

### Initial Subject Authority Map

| `subjectType` | Canonical collection | First-wave posture |
| --- | --- | --- |
| `flora` | `world.flora` | Allowed |
| `fauna` | `world.fauna` | Allowed |
| `mineral` | `world.minerals` | Allowed |
| `region` | `world.regions` | Allowed |
| `settlement` | `world.settlements` | Deferred from first seed |
| `spell` | `player.spells` | Deferred from first seed |
| `item` | `items.items` | Deferred from first seed |
| `culture` | No selected single authority | Blocked |
| `institution` | No selected single authority | Blocked |
| `ruin` | No selected authority | Blocked |
| `historical_event` | No selected single authority | Blocked |
| `custom` | No general authority | Blocked |

## 9. Authoring Rules

- A snippet is one learnable fragment, not a domain summary.
- Learned `summary` text must be traceable to canonical content.
- Tier is authored depth only; it creates no unlock.
- Completion and trial weights are inert metadata until dedicated helpers exist.
- A discovery source is a possible route, not evidence or completion.
- `sourceId: null` means the route is generic and no specific source record is claimed.
- Location scope narrows a route but does not prove that travel occurred.
- Skill ranks may later be prerequisites or check support; they do not grant snippets.
- Known-spell ownership does not grant Arcane Lore snippets.
- Item or document possession does not grant study or completion.
- Registry relationships do not grant knowledge.
- Map visibility, region entry, quest acceptance, Chronicle visibility, reputation, Renown, and UI state do not grant knowledge.
- General Lore may own broad context only while no more specific active domain exists.

## 10. Future Implementation Sequence

1. `Version 0.5.116 - Knowledge Snippet Content Authoring Plan`
2. `Version 0.5.117 - Knowledge Snippet Schema Hardening`
3. `Version 0.5.118 - Knowledge Snippet Seed Data`
4. `Version 0.5.119 - Knowledge Snippet Semantic Validator Plan`
5. `Version 0.5.120 - Knowledge Snippet Semantic Validator`
6. Knowledge Evidence Contract Plan
7. Knowledge Progress State Plan
8. Knowledge Completion Helper Plan
9. Knowledge Trial Plan
10. Knowledge UI Plan

Each item remains a separate scoped run. Runtime loading remains deferred until authored content, semantic validation, evidence, and progress ownership are stable.

## 11. Future Validation Commands

Schema hardening and seed-data implementations should run:

- `npm.cmd run tool:content-lint`
- `node --test tests/unit/schema-files.test.mjs`
- focused snippet schema or semantic tests when introduced
- focused JSON duplicate/order/reference scans
- conflict-marker scans for touched files
- trailing-whitespace scans for touched files
- `git diff --check`

Broad typecheck is not required for schema, JSON, focused-test, and documentation-only passes unless source outside that scope is unexpectedly changed.

## 12. Risks And Deferred Work

- The current snippet schema is planning-only, unregistered in schema-file tests, and not ready to protect live content without hardening.
- No snippet semantic validator exists.
- Arcane Lore remains `planned`; its new skill link does not authorize snippets.
- Culture, institution, ruin, and historical-event subjects lack one selected canonical authority.
- Specific geography and settlement-lore domains do not exist, so General Lore use must remain narrow.
- Completion weights have no runtime meaning until a completion policy/helper exists.
- Evidence contracts, discovery/progress state, prerequisite evaluation, trial behavior, persistence, runtime loading, and UI remain deferred.
- The stale Arcane registry note identified in `0.5.115` remains out of scope for this docs-only plan.

This plan should remain as a temporary implementation guardrail through schema hardening, seed data, and semantic validation. After those runs, decide whether the remaining authoring rules should stay here, move into a durable content-authoring authority, or be pruned.

## 13. Non-Goals And Forbidden Changes

This plan does not authorize:

- no knowledge snippet JSON
- no registry content edits
- no legacy policy edits
- no schema edits
- no validator code
- no runtime loaders
- no database or persistence changes
- no generated output
- no UI
- no save, account, family, character, or session state
- no evidence or progress state
- no completion math or helpers
- no trials
- no Chronicle, Renown, reputation, or quest events
- no item, spell, skill, or knowledge ownership changes
- no automatic grants from skills, spells, items, documents, travel, maps, quests, Chronicle, reputation, or UI
- no broad domain expansion
- no settlement, map, travel, economy, or magic runtime implementation
- no compatibility aliases or migration shims
- no unrelated cleanup
