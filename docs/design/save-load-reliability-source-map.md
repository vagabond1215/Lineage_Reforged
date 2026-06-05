# Save Load Reliability Source Map

Source route: ChatGPT via GitHub Connector
Date: 2026-06-05
Status: connector-only prep for future save/load/persistence reliability work; no source, schema, content JSON, UI implementation, generated output, roadmap advancement, or runtime behavior changes

## Purpose

Map future save/load reliability boundaries before any save/account/session schema, migration, runtime mutation, UI command, persistence test, or generated output work is scoped.

This document is a planning source. It does not authorize implementation.

## Core Boundary Rule

Persistence boundaries must be explicit before state is saved.

Runtime state, account projections, family evidence, character ownership, session data, knowledge progress, Chronicle/Renown records, inventory, economy, combat, magic, and UI selections must not be persisted until their owner scope, schema, migration policy, validation path, and load behavior are explicitly defined.

## Persistence Owner Vocabulary

| Owner scope | Possible durable surface | Boundary |
| --- | --- | --- |
| `account` | account meta, account-scoped unlocks, settings | Does not imply family or character state. |
| `family` | heirs, bequests, family evidence, Family Prestige | Must not be inferred from selected character or lineage text. |
| `character` | skills, known spells, inventory, resources, knowledge progress | Does not imply account/family state. |
| `session` | active run, current location, encounter, transient route state | May be temporary; not necessarily durable. |
| `encounter` | combatants, action queue, temporary statuses | Should not persist unless active-session resume is scoped. |
| `inventory` | item instances, equipment, containers, currency | Catalog ids are not ownership. |
| `chronicle` | event/history records, marks, seals later | Record visibility is not reward authority. |
| `renown` | reputation/fame/notoriety records | Not Family Prestige or knowledge by default. |
| `knowledge` | snippet/domain progress, evidence refs | Registry/snippet definitions are not progress. |
| `ui` | local layout/filter/selection preferences | UI selection is not state authority. |

## Save/Load Reliability Concerns

Future persistence work should define:

- owner scope for every persisted field
- durable id source for every persisted reference
- runtime vs durable state split
- migration behavior for missing/old fields
- validation behavior for invalid references
- load fallback behavior
- corrupted save behavior
- partial save behavior
- account/family/character/session separation
- deterministic serialization order where needed
- UI state exclusion rules

## Cross-Pillar Save Boundaries

| Pillar | May eventually persist | Must not persist by accident |
| --- | --- | --- |
| Knowledge | discovered/completed snippet ids, domain progress, evidence refs | registry definitions, UI visibility, map visibility |
| Magic | known spell ownership, study evidence, readiness state only if durable | transient cast readiness, inert envelopes, UI selection |
| Combat | active encounter only if session-resume scoped | resolved temporary statuses, action proposals, magic ownership assumptions |
| Economy | inventory/currency/transactions only after command owners exist | price projections, market displays, proposed offers |
| Travel | active route/session state only after command owners exist | visible routes, map selections, travel proposals |
| Family | explicit family evidence and durable family state | account projections, selected lineage text, backstory UI |
| Chronicle/Renown | explicit event/recognition records | display-only summaries or inferred grants |
| UI Shell | user preferences if scoped | command authority, evidence, selected ids as proof |

## Load-Time Validation Questions

Before any new persisted field is added, answer:

1. What owner scope owns this field?
2. What schema version introduces it?
3. What default applies when the field is absent?
4. What happens if referenced content id no longer exists?
5. What happens if referenced owner id no longer exists?
6. What happens if the field has an unknown enum value?
7. Is the field durable, session-only, cache-only, or UI-only?
8. Does the load path validate or trust the field?
9. Does the save path write deterministic output?
10. What tests prove older saves still load?

## Migration Policy Questions

Future migration planning should define:

- schema version field location
- per-owner migration order
- account/family/character/session migration split
- missing-field defaults
- deprecated-field handling
- invalid-reference behavior
- forward-incompatible save behavior
- rollback behavior
- test fixture strategy
- whether migrations are pure and deterministic

## Non-Persistence Rules

- Do not persist generated suggestions.
- Do not persist read-only projections.
- Do not persist UI selected ids as authority.
- Do not persist content catalog records inside saves.
- Do not persist route/map visibility as knowledge completion.
- Do not persist Chronicle visibility as reward/evidence unless explicitly scoped.
- Do not persist known-spell ownership from catalog or UI visibility.
- Do not persist economy transactions from price displays.
- Do not persist family ownership from account or character identity by inference.

## Future Validation Rules

Future save/load validation should protect:

- known schema versions only
- known owner scopes only
- deterministic migration path
- invalid references handled explicitly
- missing optional fields default safely
- required fields fail loudly or migrate deterministically
- display-only/proposal-only data is excluded from durable saves
- generated planning output is never loaded as runtime content
- UI-only state cannot grant progression, ownership, or evidence

## Recommended Future Pass Order

Recommended sequence when this area becomes active:

1. `Save Load Source Audit`
   - inspect current save/account/session/state persistence surfaces
   - docs-only/read-only
2. `Persistence Owner Ledger Plan`
   - define owner scopes, durable fields, and excluded transient fields
   - planning only
3. `Save Schema Versioning Plan`
   - define version fields and migration rules
   - planning only
4. `Load Validation Helper Plan`
   - pure helper design for missing/invalid/reference errors
5. `Save Load Fixture Plan`
   - define backward compatibility fixtures before schema mutation
6. `Narrow Persistence Integration`
   - one owner scope at a time, validation-backed

## Forbidden Until Explicitly Scoped

Do not add or change:

- save/account/session schema
- migration code
- runtime state mutation
- UI save/load commands
- generated output
- content JSON
- account/family/character ownership behavior
- knowledge progress persistence
- Chronicle/Renown persistence
- inventory/currency persistence
- route/travel persistence

## Recommended Stop Point

The current connector prep set is broad enough for future Codex planning.

Recommended next project work after token reset:

- `Version 0.5.107 - Knowledge Domain Registry Plan`

Optional future connector-only follow-up:

- `Current Prep Index And Codex Source Stack`

Rationale: many planning docs were added while waiting. A compact index can help future Codex prompts reference the right prep files without overloading the task.
