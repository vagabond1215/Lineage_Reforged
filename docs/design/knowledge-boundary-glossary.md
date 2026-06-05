# Knowledge Boundary Glossary

Source route: ChatGPT via GitHub Connector
Date: 2026-06-05
Status: connector-only prep for `Version 0.5.107 - Knowledge Domain Registry Plan`; no source, schema, content JSON, UI, generated output, or runtime behavior changes

## Purpose

Define concise boundary vocabulary for the knowledge framework before the knowledge-domain registry plan is authored.

This document exists to keep knowledge distinct from adjacent systems that may provide access, evidence, presentation, or support but must not silently grant knowledge completion.

## Source Basis

Primary sources:

- `docs/design/knowledge-framework-source-map.md`
- `docs/design/knowledge-domain-backlog-normalization.md`
- `docs/design/knowledge-discovery-source-vocabulary.md`
- `docs/design/knowledge-registry-field-ownership.md`
- `packages/schemas/player/knowledge_snippet.schema.json`
- `docs/design/future-system-design-ledger.md`
- `docs/design/skill-mastery-trial-framework-plan.md`
- `docs/future_content_backlog.md`

## Core Boundary Rule

Knowledge is discovered understanding.

Knowledge may be supported by observation, study, instruction, practical use, events, and source/evidence records, but it must not be inferred from adjacent state such as skill rank, possession, map visibility, reputation, known-spell ownership, UI state, or Chronicle visibility.

## Glossary

| Term | Meaning in knowledge framework | Boundary / non-grant rule |
| --- | --- | --- |
| Knowledge | Discovered understanding about a domain, subject, place, material, creature, culture, spell, institution, event, or process. | Must be explicitly discovered/progressed; not inferred from access or adjacent state. |
| Knowledge domain | Stable authored category such as `knowledge_domain.flora`, `knowledge_domain.geography`, or `knowledge_domain.arcane_theory`. | Registry metadata only; does not store player progress. |
| Knowledge snippet | Individual learnable fragment within a domain, tied to subject, tier, category, discovery sources, progression weight, and visibility hints. | Authored opportunity/structure only; runtime state determines discovered/completed status later. |
| Domain registry | Future canonical list of knowledge domains and domain policy metadata. | Must not contain per-player completion, evidence, or runtime state. |
| Discovery source | Authored possible way a snippet may be discovered or progressed. | Source access does not equal completion. |
| Evidence | Future scoped proof that discovery/progress should be credited. | Must have an owner/scope; should not fabricate history or knowledge. |
| Study | Active learning process through text, teacher, institution, scroll, tome, ritual, or similar source. | Access to study material does not equal study completion. |
| Observation | Encountering evidence in field, travel, combat, resource, or social context. | Seeing something does not automatically grant deeper understanding. |
| Practical use | Learning through handling, crafting, gathering, treating, processing, or applying something. | Use does not imply full domain mastery or safe expertise. |
| Completion | Future runtime-derived state showing a snippet/tier/domain is complete. | Not authored in registry; not implemented in 0.5.107. |
| Tier | Authored depth/rank of snippet knowledge within a domain. | Does not unlock itself without completion/trial rules. |
| Knowledge trial | Future checkpoint/trial structure for deeper knowledge tiers. | Deferred; not a skill trial and not implemented in registry planning. |

## Adjacent System Boundaries

| Adjacent system | What it can contribute later | What it must not imply |
| --- | --- | --- |
| Skills | Support checks, spotting, identification, study, crafting, or trial weighting. | Skill rank does not auto-complete knowledge. |
| Skill mastery trials | Future pattern for checkpoint/trial design. | Skill trials do not replace knowledge trials or grant knowledge by themselves. |
| Magic study | Study/acquisition path for spells and arcane learning. | Magic study access does not grant known-spell ownership or knowledge completion. |
| Known-spell ownership | Character-scoped validated spell ownership. | Knowing a spell does not automatically grant arcane lore, spellcraft, catalyst, conduit, or ritual knowledge. |
| Spell hook support | Readiness/projection classification for spell hooks. | Supported/readiness hooks do not create knowledge, spell ownership, or executable casting. |
| Item possession | Ownership of a book, scroll, tome, reagent, map, relic, tool, weapon, armor, or material. | Possession does not equal understanding or study completion. |
| Equipment/use profiles | May identify practical-use or crafting-use opportunities. | Equipping or using an item does not grant full knowledge without scoped rules. |
| Crafting/production | Practical-use and processing context. | Recipe/content existence does not grant material-processing knowledge. |
| Travel/geography visibility | May create travel-observation evidence or route/locality exposure. | Visiting or revealing a map area does not complete geography/locality knowledge. |
| Settlement/institution access | May create teacher, institution, or social observation opportunities. | Membership, proximity, or reputation does not auto-complete institution/culture/politics knowledge. |
| Quest events | May later authorize explicit evidence/progress. | Quest visibility, acceptance, or reward does not grant knowledge without event evidence. |
| Chronicle | May reference past events as evidence. | Chronicle visibility does not fabricate knowledge or unrelated family/account history. |
| Reputation/Renown | May influence access to teachers/institutions or recognition. | Recognition does not prove knowledge. |
| Backstory | May provide starting context or future eligibility. | Backstory selection does not silently grant knowledge unless explicit current-data rules exist. |
| Bloodlines/Family | May own future family-scoped evidence or inherited context. | Family identity, lineage, or prestige does not fabricate knowledge completion. |
| UI state | Presents known/unknown/progress later. | UI selection, filters, panels, and visibility do not create evidence or progress. |

## Common Non-Grant Examples

- Reading access to a book is not `book_study` completion.
- Owning a scroll is not spell ownership or arcane knowledge.
- Possessing a tome is not `tome_study` completion.
- Hiring a teacher is not `teacher_instruction` completion.
- Joining a guild, academy, temple, order, or cult is not `institutional_study` completion.
- Entering a region is not regional-geography completion.
- Seeing a monster is not monster-lore mastery.
- Harvesting a herb is not herbalism completion.
- Crafting a sword is not full weapon-lore or smithing-materials mastery.
- Surviving a battle is not tactics completion.
- Completing a quest is not knowledge unless an explicit quest-event evidence rule exists.
- Having a Chronicle record is not knowledge unless future scoped rules consume it.
- Having high reputation is not knowledge.
- Selecting a knowledgeable backstory is not runtime knowledge unless explicit authored starting knowledge exists in a future scoped system.

## Registry Planning Implications

The registry plan should:

- define domain ids and domain metadata only
- reference related skills without converting skills into knowledge progress
- reference discovery source families without making access a grant path
- reserve evidence owner vocabulary without implementing evidence records
- define validation boundaries that prevent authored progress/state in registry files
- keep snippets, domains, runtime state, evidence, and UI presentation separate

## Recommended Validation Vocabulary

Future validation should eventually detect:

- registry fields that look like per-player state
- snippet fields that imply unconditional completion
- discovery sources that lack owner/scope notes when `custom`
- domain records that use unsupported subject or source families without notes
- skill relationships that imply auto-completion
- Chronicle/reputation references that imply fabricated history
- item/document references that imply possession equals knowledge

## Deferred Decisions

Do not decide or implement here:

- starting knowledge from backstory
- runtime completion state
- save/account/session shape
- evidence record schema
- study event mechanics
- knowledge trials
- Chronicle/Renown integration
- UI presentation
- schema enum expansion
- registry content creation

## Recommended 0.5.107 Use

Use this glossary as source material for these sections of:

- `docs/design/knowledge-domain-registry-plan.md`

Recommended sections:

- `Knowledge Domain Definition`
- `Boundary: Knowledge vs Skills vs Magic vs Possession vs Chronicle`
- `Discovery Source And Evidence Vocabulary`
- `Validation Rules`
- `Forbidden Until Explicitly Scoped`

## Recommended Next Connector Work

The prep set is now sufficient for Codex 0.5.107.

Recommended next step:

- Generate or run the Codex prompt for `Version 0.5.107 - Knowledge Domain Registry Plan`.

Optional connector-only cleanup before Codex:

- Add these prep docs to the next prompt's `Read first` list.
