# Knowledge Discovery Source Vocabulary Audit

Source route: ChatGPT via GitHub Connector
Date: 2026-06-05
Status: connector-only prep for `Version 0.5.107 - Knowledge Domain Registry Plan`; no source, schema, content JSON, UI, generated output, or runtime behavior changes

## Purpose

Define a planning vocabulary for knowledge discovery sources before the knowledge-domain registry plan is authored.

This document clarifies what each source type can mean, what it must not imply, and what future validation should eventually protect.

## Source Basis

Primary sources:

- `packages/schemas/player/knowledge_snippet.schema.json`
- `docs/design/knowledge-framework-source-map.md`
- `docs/design/knowledge-domain-backlog-normalization.md`
- `docs/future_content_backlog.md`
- `docs/design/skill-mastery-trial-framework-plan.md`
- `docs/design/future-system-design-ledger.md`

## Core Rule

Discovery source does not mean knowledge completion.

A discovery source should represent a possible route by which a character, account, family, institution, region, or future evidence owner may discover or progress a snippet after explicit runtime rules exist.

Access creates opportunity. It must not silently grant completion.

## Current Schema Source Types

The current planning schema allows these snippet `discoverySources[].sourceType` values:

- `field_identification`
- `resource_use`
- `crafting_use`
- `combat_observation`
- `travel_observation`
- `book_study`
- `teacher_instruction`
- `institutional_study`
- `scroll_study`
- `tome_study`
- `quest_event`
- `chronicle_record`
- `custom`

## Source Families

Use these source-family names in the registry plan unless a later pass changes them.

| Source family | Current source types | Planning meaning |
| --- | --- | --- |
| `field_observation` | `field_identification`, `travel_observation`, `combat_observation` | The player/character encountered evidence in the world. |
| `practical_use` | `resource_use`, `crafting_use` | The player/character learned through handling, use, processing, or production. |
| `textual_study` | `book_study`, `scroll_study`, `tome_study` | The player/character studied a written or inscribed source. |
| `instruction` | `teacher_instruction`, `institutional_study` | The player/character learned through a person, guild, school, order, temple, academy, cult, or institution. |
| `event_record` | `quest_event`, `chronicle_record` | A future event/evidence owner may authorize or record discovery/progression. |
| `custom` | `custom` | Escape hatch for special cases; should require notes and later review. |

## Source Type Semantics

| Source type | Family | Should mean | Must not imply automatically | Likely evidence owner later |
| --- | --- | --- | --- | --- |
| `field_identification` | `field_observation` | Direct field attempt to notice or identify a subject. | Full domain completion, safe handling, or deeper theory. | character/session observation, region/locality context |
| `resource_use` | `practical_use` | Learning from gathering, consuming, applying, or otherwise using a resource. | Generic item possession, crafting skill rank, or market knowledge. | character action, item/source instance |
| `crafting_use` | `practical_use` | Learning from processing or crafting with a material/input. | Recipe ownership, production-chain mastery, or automatic material expertise. | character action, workplace/recipe context |
| `combat_observation` | `field_observation` | Learning from seeing or surviving combat behavior. | Monster lore completion, tactical mastery, combat skill rank, or automatic weakness knowledge. | combat encounter/event record |
| `travel_observation` | `field_observation` | Learning from traversing a region, locality, route, biome, settlement, or sea lane. | Map knowledge, route mastery, regional reputation, or all local lore. | travel event, region/locality/route context |
| `book_study` | `textual_study` | Study through a book or ordinary written source. | Possession of a book, guaranteed comprehension, or known-spell ownership. | character study event, document/item instance |
| `teacher_instruction` | `instruction` | Study through an NPC teacher, mentor, specialist, elder, or trainer. | Teacher access, paid fee, institutional membership, or skill rank gain. | teacher id, training/study event |
| `institutional_study` | `instruction` | Study through guild, school, temple, academy, order, cult, or institution support. | Membership alone, rank, license, reputation, or automatic knowledge grant. | institution id, study event, permission evidence |
| `scroll_study` | `textual_study` | Study through scroll-specific material. | Scroll possession, spell acquisition, or scroll consumption. | scroll item/document instance, study event |
| `tome_study` | `textual_study` | Study through tome, grimoire, codex, tablet, notes, or extended written source. | Tome possession, known-spell ownership, or completion without study. | tome/document instance, study event |
| `quest_event` | `event_record` | Discovery/progression attached to explicit quest outcome or authored event. | Quest visibility, quest acceptance, or reward without event evidence. | quest event id, outcome record |
| `chronicle_record` | `event_record` | Discovery/progression attached to a recorded past event. | Fabricated history, unrelated family knowledge, or global account completion. | Chronicle record id, owner scope |
| `custom` | `custom` | Special authored source not covered by current vocabulary. | Broad bypass of validation or generic grant path. | explicit custom owner and notes required |

## Non-Grant Rules

These rules should be inherited by every domain and source family.

- Access does not equal study.
- Study does not equal completion unless a future completion helper says so.
- Possession does not equal understanding.
- Observation does not equal mastery.
- Skill rank can support checks but does not auto-complete knowledge.
- Magic study access does not grant known spell ownership.
- Known spell ownership does not grant arcane knowledge completion.
- Chronicle record visibility does not fabricate knowledge.
- Reputation or renown does not prove knowledge.
- Region visibility does not grant regional lore completion.
- UI state does not create evidence.

## Domain Compatibility Guidance

Initial source-family compatibility suggestions for registry planning:

| Domain group | Likely source families | Notes |
| --- | --- | --- |
| `natural_world` | `field_observation`, `practical_use`, `textual_study`, `instruction`, `event_record` | Flora/fauna/minerals/ecology should emphasize field and practical sources. |
| `geography_travel` | `field_observation`, `textual_study`, `instruction`, `event_record` | Travel observation should reveal only scoped route/region/locality snippets. |
| `settlement_society` | `field_observation`, `textual_study`, `instruction`, `event_record` | Institutions and politics should require scoped social/evidence owners later. |
| `monster_combat` | `field_observation`, `textual_study`, `instruction`, `event_record` | Combat observation can expose behavior, danger, and weakness snippets, but not automatic mastery. |
| `economy_materials` | `practical_use`, `field_observation`, `textual_study`, `instruction`, `event_record` | Trade and materials should distinguish use, market observation, and study. |
| `medicine_body` | `field_observation`, `practical_use`, `textual_study`, `instruction`, `event_record` | Medical knowledge should be conservative; observation should not imply safe treatment. |
| `magic_arcana` | `textual_study`, `instruction`, `field_observation`, `event_record`, `practical_use` | Arcane knowledge must stay separate from known-spell ownership and active casting. |
| `religion_myth` | `textual_study`, `instruction`, `field_observation`, `event_record` | Doctrine/myth can use institutions and texts; Chronicle records should remain scoped. |
| `history_culture` | `textual_study`, `field_observation`, `instruction`, `event_record` | Ruins, records, and oral instruction should be separate source types/families. |
| `military_tactics` | `field_observation`, `textual_study`, `instruction`, `practical_use`, `event_record` | Combat observation does not imply tactical expertise or combat behavior changes. |
| `general` | all families | Should be used sparingly as catch-all. |

## Evidence Owner Planning

The registry plan should not implement evidence owners, but it should reserve vocabulary for them.

Possible future evidence owner scopes:

- `character`
- `account`
- `family`
- `institution`
- `region`
- `settlement`
- `quest_event`
- `chronicle_record`
- `item_instance`
- `document_instance`
- `teacher`
- `study_event`
- `travel_event`
- `combat_event`
- `custom`

Do not introduce these as runtime state in 0.5.107. Use them as planning vocabulary only.

## Validation Rules To Plan Later

Future registry or snippet validation should eventually check:

- every source type belongs to a known source family
- every domain declares allowed source families or source types
- snippet source types are compatible with the domain, subject type, and category
- `custom` source types require notes and explicit owner vocabulary
- text/instruction sources do not imply possession/access grants
- event-record sources identify a future event/evidence owner type
- travel sources require region/locality/route scope when relevant
- field sources require subject or location scope when relevant
- Chronicle sources do not create unrelated family/account history
- magic text sources do not create known-spell ownership
- quest sources do not grant knowledge before an explicit quest outcome exists

## Registry Field Implications

The knowledge-domain registry plan should likely include:

- `supportedDiscoverySourceFamilies`
- `supportedDiscoverySourceTypes`
- `defaultEvidenceOwnerScopes`
- `requiresExplicitStudyEvent`
- `allowsFieldObservation`
- `allowsPracticalUse`
- `allowsChronicleReference`
- `customSourcePolicy`

These are planning candidates only. Codex should decide final field names in the registry plan.

## Deferred Decisions

Do not decide in this connector pass:

- completion math
- tier thresholds
- evidence record schema
- study event schema
- Chronicle integration
- quest reward integration
- knowledge UI
- save/account/session shape
- runtime loaders
- schema enum expansions

## Recommended 0.5.107 Use

Use this vocabulary audit as a source for the `Discovery Source And Evidence Vocabulary` and `Validation Rules` sections of:

- `docs/design/knowledge-domain-registry-plan.md`

## Recommended Next Connector Work

The next connector-only prep pass should be one of:

1. `Knowledge Boundary Glossary`
2. `Registry Field Ownership Table`

Preferred next pass:

- `Registry Field Ownership Table`

Rationale: after source vocabulary, Codex needs a clean split between registry-owned fields, snippet-owned fields, runtime state, UI state, and validation-only fields.
