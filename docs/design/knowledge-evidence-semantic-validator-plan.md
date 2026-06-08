# Knowledge Evidence Semantic Validator Plan

Source version/run: Version 0.5.124 - Knowledge Evidence Semantic Validator Plan
Date: 2026-06-08
Status: planning-only evidence semantic validation design

## 1. Purpose And Status

This document defines the future knowledge-evidence wrapper gate, schema-first validation flow, reference authorities, source/context compatibility rules, duplicate identity checks, focused tests, and implementation acceptance criteria.

This run implements no validator code, evidence JSON or content, evidence state, runtime producers, database or persistence behavior, UI, generated output, progress state, completion math, trials, Chronicle or Renown events, ownership behavior, snippet content, schemas, registry content, skills, spells, or gameplay behavior.

## 2. Current State Recap

The repository currently has:

- The evidence contract at `docs/design/knowledge-evidence-contract-plan.md`.
- The evidence schema plan at `docs/design/knowledge-evidence-schema-plan.md`.
- The strict record schema at `packages/schemas/player/knowledge_evidence.schema.json`.
- Authored snippets at `packages/content/base/player/knowledge_snippets.json`.
- Snippet semantic validation at `tools/content-lint/knowledge-snippets.mjs`.
- The broad domain registry at `packages/content/base/player/knowledge_domain_registry.json`, with structural and semantic validation.

No evidence JSON or content, evidence state, evidence semantic validator, progress state, completion math, trials, UI, runtime loader, or persistence exists.

The evidence schema validates one record's structure only. It does not prove that references resolve, that snapshot fields match a snippet, that a source is declared by that snippet, or that a source and acquisition context are compatible.

## 3. Validation Ownership Decision

Future evidence semantic validation should be implemented as an optional pure helper:

- `tools/content-lint/knowledge-evidence.mjs`

Structural record shape remains owned by:

- `packages/schemas/player/knowledge_evidence.schema.json`

If a future evidence fixture or catalog path is explicitly selected, orchestration may be added to:

- `tools/content-lint/index.mjs`

The first implementation should not select or invent canonical authored evidence content. Evidence is future runtime or state data. While no evidence JSON path exists, `Version 0.5.125` should add only the pure helper and in-memory focused test fixtures. It should not register normal content-lint orchestration.

The validator will not own:

- evidence creation
- runtime event or action authorization
- progress credit
- persistence
- ownership mutation or sharing
- UI or generated presentation

## 4. Future Evidence Wrapper Gate

Any future evidence collection or focused fixture must use:

```json
{
  "records": []
}
```

Wrapper rules:

- The top-level value is an object.
- It has exactly one key: `records`.
- `records` is an array.
- An empty array is valid only in an explicitly named empty-state test.
- Production-like positive fixtures must contain at least one record.
- Every record must pass `packages/schemas/player/knowledge_evidence.schema.json` before semantic checks.
- Semantic checks must not run for a structurally invalid record.
- `evidenceId` values must be unique within the collection.

The wrapper is a validation input contract. It is not approval for a base-content evidence file or persisted evidence-state shape.

## 5. Schema-First Validation Flow

The future helper should:

1. Parse or receive the candidate wrapper.
2. Require the exact `{ records: [...] }` wrapper.
3. Validate each record against `knowledge_evidence.schema.json`.
4. Stop semantic validation for structurally invalid records.
5. Load or receive snippets, the broad domain registry, and selected authority maps.
6. Build fail-closed lookup maps with duplicate authority ids rejected.
7. Run semantic validation only for structurally valid records.
8. Return deterministic errors with relative path, `evidenceId` or record index, field, and offending value.

The first implementation should follow the current narrow schema-adapter pattern without adding a dependency or refactoring the snippet validator. An evidence-scoped adapter may support only the keywords used by the live evidence schema and must fail closed on unsupported schema keywords.

Validation is read-only. It grants no progress, emits no events, and causes no runtime side effects.

## 6. Reference Authority Plan

Initial references are governed as follows:

| Evidence field | Authority and first-validator rule |
| --- | --- |
| `snippetId` | Must resolve exactly once in `packages/content/base/player/knowledge_snippets.json`. |
| `domainId` | Must equal the referenced snippet's `domainId`; that domain must resolve as active in the broad registry. |
| `subjectType` | Must equal the referenced snippet's `subjectType`. |
| `subjectId` | Must equal the referenced snippet's `subjectId`. |
| `sourceType` | Must appear in the referenced snippet's `discoverySources[].sourceType`. |
| `sourceId` | Must be `null` in the first validator. |
| `ownerScope` | Must be `character`. |
| `ownerId` | Remains schema-pattern-only until a canonical character authority or explicit test authority is selected. |

The helper must not invent account, family, character persistence, or owner fallback behavior.

## 7. Domain And Snippet Relationship Checks

For every structurally valid evidence record:

- `snippetId` must resolve to one authored snippet.
- `domainId` must equal `snippet.domainId`.
- `subjectType` must equal `snippet.subjectType`.
- `subjectId` must equal `snippet.subjectId`.
- `sourceType` must be declared by that snippet.
- The referenced domain must resolve to a broad-registry record with `status: "active"`.
- Planned domains, including `knowledge_domain.arcane_lore`, remain blocked.
- Evidence validation must not mutate snippet definitions.
- Evidence fields must not appear in authored snippet JSON.

The existing strict snippet schema and snippet content-lint path already reject undeclared evidence fields in authored snippets. The evidence helper should not duplicate that ownership unless a later integration pass explicitly adds a cross-file assertion.

Arcane Lore evidence must fail while no live authored Arcane Lore snippet in an active domain can resolve.

## 8. SourceId Posture

The first validator must:

- Accept `sourceId: null`.
- Reject every non-null `sourceId`.
- Reject `sourceType: "custom"` even though the schema preserves enum parity.

A later source-authority plan must define the namespace, canonical collection, resolution rule, and source/context compatibility before any non-null `sourceId` is accepted.

## 9. Owner Scope And OwnerId Posture

The first validator must preserve these boundaries:

- `ownerScope` is exactly `character`.
- Family, account, settlement, faction, and custom owner scopes remain blocked or deferred.
- `ownerId` must satisfy the schema's canonical dotted-id pattern.
- Character owner resolution remains deferred until a canonical character fixture or authority exists.
- No account or family sharing is inferred.
- No owner mutation is performed.
- No persistence or save-state shape is introduced.
- A settlement or faction in acquisition context never becomes the evidence owner.

The schema already blocks non-character owner scopes. The semantic validator should still assert the approved posture so later schema broadening cannot silently authorize new ownership behavior.

## 10. Acquisition Context Compatibility Plan

The exact source-to-context mapping is:

| `sourceType` | Required `contextType` |
| --- | --- |
| `field_identification` | `field_observation` |
| `combat_observation` | `field_observation` |
| `travel_observation` | `travel_observation` |
| `resource_use` | `resource_use` |
| `crafting_use` | `crafting_use` |
| `book_study` | `study` |
| `scroll_study` | `study` |
| `tome_study` | `study` |
| `teacher_instruction` | `instruction` |
| `institutional_study` | `instruction` |
| `quest_event` | `quest_event` |
| `chronicle_record` | `chronicle_record` |
| `custom` | Blocked |

Location fields are compatible with every context type because they describe where an occurrence happened:

- `continentId`
- `regionId`
- `settlementId`
- `biomeTags`

Specialized context-field compatibility is:

| `contextType` | Structurally compatible specialized fields |
| --- | --- |
| `field_observation` | `eventId`, `actionId` |
| `travel_observation` | `eventId`, `actionId` |
| `resource_use` | `eventId`, `actionId`, `itemInstanceId`, `skillId` |
| `crafting_use` | `eventId`, `actionId`, `itemInstanceId`, `skillId` |
| `study` | `eventId`, `actionId`, `documentId`, `skillId`, `spellId` |
| `instruction` | `eventId`, `actionId`, `teacherId`, `institutionId`, `skillId`, `spellId` |
| `quest_event` | `eventId`, `questOutcomeId` |
| `chronicle_record` | `eventId`, `chronicleRecordId` |

Compatibility rules:

- Fields not compatible with the selected `contextType` must be absent, even when their value would be `null`.
- Compatible optional references may be absent or `null`.
- Every non-null optional reference must resolve through an explicitly selected authority.
- `continentId` resolves through `world/regions` and must identify a `regionType: "continent"` record.
- `regionId` resolves through `world/regions` and must identify a `regionType: "subregion"` record.
- `settlementId` resolves through `world/settlements` as context only.
- When both `continentId` and `regionId` are present, the region's ancestry must lead to that continent.
- When `settlementId` and `regionId` are present, the settlement's `regionId` must match.
- When `settlementId` and `continentId` are present, the settlement's `macroRegionId` must match.
- `eventId`, `actionId`, `itemInstanceId`, `documentId`, `teacherId`, `institutionId`, `questOutcomeId`, `chronicleRecordId`, `skillId`, and `spellId` have no selected first-validator authority and must therefore be `null` or absent.
- `biomeTags` remain schema-validated slugs only. Biome vocabulary resolution is deferred.

Location context is audit metadata. It does not prove that an evidence-producing occurrence happened.

## 11. Initial Authority Selection For Semantic Validation

The recommended first implementation uses:

- Snippets: required.
- Broad domains: required.
- Regions: selected for `continentId` and `regionId`.
- Settlements: selected for `acquisitionContext.settlementId` only.
- Character owner authority: deferred; `ownerId` remains pattern-only.
- All other context authorities: deferred; reject non-null references.

The current region and settlement content shapes support this narrow selection:

- `packages/content/base/world/regions.json` has stable ids, `regionType`, and parent relationships.
- `packages/content/base/world/settlements.json` has stable ids, `macroRegionId`, and `regionId`.

These files are context authorities only. They do not authorize travel, ownership, persistence, map behavior, or evidence production.

## 12. Duplicate Identity Versus Duplicate Credit

The semantic validator owns duplicate record identity:

- Two records in one wrapper may not share an `evidenceId`.

It does not own duplicate progress credit:

- Two distinct records may describe similar occurrences and still be structurally and semantically valid.
- Whether both records contribute progress is a future progress-consumer decision.
- Repeatability, stacking, consumption, decay, confidence, weight, occurrence equivalence, and completion logic do not belong in evidence semantic validation.

## 13. Boundary Rules

- Evidence is not authored snippet content.
- Evidence is not progress state.
- Evidence is not completion state.
- Evidence is not trial state.
- Evidence is not UI state.
- Evidence is not knowledge ownership.
- Evidence semantic validation does not create evidence.
- Evidence semantic validation does not grant discovery or completion.
- Broad-registry `relatedSkillIds` do not create evidence.
- Skill ranks do not create evidence.
- Known spells do not create evidence.
- Possessing an item, book, scroll, tome, or document does not create evidence.
- Location presence does not create evidence.
- Runtime events must be explicitly authorized before they can produce evidence.
- Validation must not mutate evidence, snippets, domains, owners, or runtime state.

## 14. Focused Test Plan

Future focused tests should live in:

- `tests/unit/knowledge-evidence-validation.test.mjs`

Positive tests:

- Accept an explicit empty-state wrapper test.
- Accept a structurally valid Aloe field-identification fixture with `sourceId: null`, `ownerScope: "character"`, `contextType: "field_observation"`, and at least one note.
- Accept equivalent Badger and Iron Ore field-identification fixtures.
- Accept a Kaelvar travel-observation fixture.
- Accept valid continent and region context ids.
- Accept a valid settlement context id with matching region and continent.
- Accept notes only according to the live schema: at least one unique non-empty string.

The positive fixtures must satisfy the live schema. Earlier illustrative contract examples must not be copied unchanged because they predate required `contextType` and `notes`.

Negative tests:

- Reject a missing `records` wrapper.
- Reject extra top-level wrapper keys.
- Reject a structurally invalid evidence record before semantic checks.
- Reject duplicate `evidenceId`.
- Reject unresolved `snippetId`.
- Reject `domainId`, `subjectType`, or `subjectId` mismatch.
- Reject a `sourceType` not declared by the snippet.
- Reject planned or custom source use.
- Reject non-null `sourceId`.
- Reject non-character `ownerScope`.
- Reject an invalid `ownerId` pattern through schema validation.
- Reject an incompatible source/context pair.
- Reject a context field that is incompatible with `contextType`.
- Reject unresolved or incorrectly typed continent, region, or settlement ids.
- Reject inconsistent continent/region/settlement relationships.
- Reject non-null context references whose authorities are not selected.
- Reject empty notes, duplicate notes, and missing notes through schema validation.
- Retain the existing snippet content-lint rejection of evidence fields in authored snippet JSON.
- Reject progress, completion, trial, and UI fields through the strict evidence schema.
- Reject Arcane Lore evidence while no live authored active-domain Arcane Lore snippet exists.

Error assertions should prove that messages include the relative input path, `evidenceId` or record index, field, and offending value where possible.

## 15. Acceptance Criteria For Future Implementation

`Version 0.5.125 - Knowledge Evidence Semantic Validator` is accepted only when:

- The pure evidence semantic validator exists.
- Focused tests pass.
- Wrapper and record validation remain schema-first.
- Semantic checks do not run on structurally invalid records.
- The current evidence schema remains unchanged unless separately authorized.
- No canonical evidence JSON, content, or state path is invented.
- No normal content-lint registration is added without an explicitly selected evidence path.
- No runtime producer, persistence, progress, completion, trial, UI, event, ownership, or gameplay behavior is added.
- No snippet JSON, snippet schema, snippet validator, registry, skill, or spell changes are bundled.
- Errors identify file, evidence id or index, field, and value when possible.
- Validation remains deterministic and side-effect-free.

## 16. Future Implementation Sequence

Recommended order:

1. `Version 0.5.124 - Knowledge Evidence Semantic Validator Plan`
2. `Version 0.5.125 - Knowledge Evidence Semantic Validator`
3. `0.5.x - Knowledge Progress State Plan`
4. `0.5.x - Knowledge Progress State Schema`
5. `0.5.x - Knowledge Evidence-to-Progress Rules Plan`
6. `0.5.x - Knowledge Evidence Producers Plan`
7. `0.5.x - Knowledge Trials Plan`
8. `0.5.x - Knowledge UI Plan`

Each item remains a separate scoped run.

## 17. Risks And Deferred Work

- No canonical evidence storage path exists.
- Character owner authority is unresolved.
- All non-null `sourceId` authorities are unresolved.
- Event, action, item-instance, document, teacher, institution, quest-outcome, Chronicle-record, skill, and spell context authorities are unresolved.
- Biome vocabulary authority is unresolved.
- Duplicate credit, repeatability, and evidence consumption are deferred.
- Progress, completion, trials, and UI are deferred.
- Persistence, save shape, and save migration are deferred.
- Arcane Lore snippets remain blocked while `knowledge_domain.arcane_lore` is planned.
- Main-menu and other UI work remain unrelated.

The evidence contract and schema plans should remain available through validator implementation. After `0.5.125`, make an explicit retain, consolidate, promote, or remove decision for these temporary guardrail documents.

## 18. Non-Goals And Forbidden Changes

This planning run includes:

- no evidence semantic validator implementation
- no evidence JSON or content
- no evidence state
- no evidence schema edits
- no runtime loaders or producers
- no database or persistence changes
- no generated output
- no UI
- no main-menu work
- no save, account, or session state
- no progress state
- no completion math
- no trials
- no Chronicle or Renown events
- no snippet content edits
- no snippet schema edits
- no snippet validator edits
- no registry content edits
- no skill or spell edits
- no item, spell, or skill ownership changes
- no settlement, map, travel, or economy implementation
- no unrelated cleanup
