# Knowledge Evidence Schema Plan

Source version/run: Version 0.5.122 - Knowledge Evidence Schema Plan
Date: 2026-06-08
Status: planning-only evidence schema design

## 1. Purpose And Status

This document turns the knowledge evidence contract into a precise future JSON Schema design for one knowledge evidence record. It selects the schema path, wrapper posture, required fields, identifier patterns, enum posture, acquisition-context shape, schema-file test registration, semantic-validation boundary, and implementation acceptance criteria.

This run implements no schema files, evidence JSON or content, evidence state, semantic validator, runtime loaders, database or persistence behavior, UI, generated output, progress state, completion math, trials, Chronicle or Renown events, ownership behavior, snippet content, registry content, skills, spells, or gameplay behavior.

This plan is the active guardrail for `Version 0.5.123 - Knowledge Evidence Schema`. After that implementation, retain it through semantic-validator planning or explicitly consolidate its durable rules into a later knowledge-state authority.

## 2. Current State Recap

The repository currently has:

- The evidence contract at `docs/design/knowledge-evidence-contract-plan.md`.
- Authored snippets at `packages/content/base/player/knowledge_snippets.json`.
- The snippet record schema at `packages/schemas/player/knowledge_snippet.schema.json`.
- The snippet semantic validator at `tools/content-lint/knowledge-snippets.mjs`.
- The broad registry at `packages/content/base/player/knowledge_domain_registry.json`.
- Structural and semantic broad-registry validation.

The current snippet catalog contains four records across active Flora, Fauna, Minerals, and General Lore domains.

No evidence schema, evidence content, evidence state, progress state, completion math, trials, UI, runtime loader, or persistence exists yet.

## 3. Schema Ownership Decision

The future evidence record schema path is:

- `packages/schemas/player/knowledge_evidence.schema.json`

The schema will own the structural shape of one evidence record only.

Evidence is future runtime or state data, not authored base content. This plan does not select or create an evidence JSON content path. A later semantic-validator or runtime plan may select an in-memory fixture or dedicated test-fixture path, but that decision must not imply canonical authored evidence.

The evidence record schema must not own:

- cross-file reference resolution
- source-route compatibility
- owner resolution
- progress math
- completion
- trials
- UI state
- persistence
- ownership mutation

Those concerns belong to later semantic validation, runtime producer, progress consumer, persistence, or UI plans.

## 4. Wrapper Decision

The future evidence collection shape is:

```json
{
  "records": []
}
```

Wrapper rules:

- The top-level value is an object.
- It has exactly one key: `records`.
- `records` is an array of evidence records.

The first implementation should create a record-level schema only at `packages/schemas/player/knowledge_evidence.schema.json`, matching the current knowledge-snippet schema pattern.

Wrapper validation remains with a later semantic or runtime validator unless the schema-file test convention changes and explicitly requires a wrapper schema. The schema implementation must not create an evidence collection, evidence state file, or base-content fixture merely to exercise the record schema.

## 5. Required Evidence Record Fields

The first evidence record schema must require:

- `evidenceId`
- `snippetId`
- `domainId`
- `subjectType`
- `subjectId`
- `sourceType`
- `sourceId`
- `ownerScope`
- `ownerId`
- `acquiredSequence`
- `acquisitionContext`
- `notes`

The first schema must not include:

- `acquiredAt`
- `confidence`
- `weight`
- `progressValue`
- `completionValue`
- `trialValue`
- UI fields

Every required field must be supplied explicitly. The schema must define no defaults.

## 6. Identifier And Pattern Plan

The first schema should use these patterns:

| Field | Planned pattern or source |
| --- | --- |
| `evidenceId` | `^knowledge_evidence\.[a-z0-9]+(?:_[a-z0-9]+)*\.[a-z0-9]+(?:_[a-z0-9]+)*\.[a-z0-9]+(?:_[a-z0-9]+)*$` |
| `snippetId` | Reuse the exact `id` pattern from `packages/schemas/player/knowledge_snippet.schema.json`. |
| `domainId` | Reuse the exact `domainId` pattern from `packages/schemas/player/knowledge_snippet.schema.json`. |
| `subjectId` | Reuse the exact canonical dotted-id pattern from `packages/schemas/player/knowledge_snippet.schema.json`. |
| `ownerId` | Use the canonical dotted-id pattern `^[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)+$`. |
| `sourceId` | Allow `null` or a string matching the canonical dotted-id pattern. |

`sourceId` is structurally nullable. The first semantic validator must reject every non-null `sourceId` until the relevant source authority, namespace, and compatibility rule exist.

Identifiers are references, not display text. The schema must not accept free-form names in identifier fields.

## 7. Enum Posture

### Subject Type

`subjectType` should use the exact enum from the live snippet schema:

- `flora`
- `fauna`
- `mineral`
- `settlement`
- `region`
- `culture`
- `institution`
- `spell`
- `item`
- `ruin`
- `historical_event`
- `custom`

Later semantic validation will still block subject types that lack an approved authority or active-domain use.

### Source Type

`sourceType` should use the exact discovery-source enum from the live snippet schema:

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

`custom` remains semantically blocked even though enum parity preserves it structurally.

### Owner Scope

The first schema should allow exactly:

- `character`

Family and account ownership are planned but blocked until explicit sharing and benefit rules exist. Settlement and faction ownership are deferred. Custom owner scope is not allowed.

The broad registry's `defaultEvidenceOwnerScopes` values must not be copied directly into this enum. That vocabulary mixes beneficiary-like scopes with source and context roles such as teacher, institution, event, region, item instance, and document instance.

## 8. Field Type And Constraint Plan

The first schema should apply these structural constraints:

| Field | Planned constraint |
| --- | --- |
| `evidenceId` | Required non-empty string with the evidence-id pattern. |
| `snippetId` | Required non-empty string with the snippet-id pattern. |
| `domainId` | Required non-empty string with the domain-id pattern. |
| `subjectType` | Required string enum matching the snippet schema. |
| `subjectId` | Required non-empty canonical dotted-id string. |
| `sourceType` | Required string enum matching snippet discovery sources. |
| `sourceId` | Required; either `null` or a non-empty canonical dotted-id string. |
| `ownerScope` | Required string enum containing only `character`. |
| `ownerId` | Required non-empty canonical dotted-id string. |
| `acquiredSequence` | Required integer with `minimum: 0`. |
| `acquisitionContext` | Required strict object governed by Section 9. |
| `notes` | Required array of non-empty strings with `uniqueItems: true`. |

The record must use `additionalProperties: false`.

The schema must define no progress, completion, trial, UI, generated-output, consumer-state, or persistence fields.

## 9. Acquisition Context Schema Design

The first schema should use one strict minimal `acquisitionContext` object:

- `type: object`
- `additionalProperties: false`
- require `contextType`

Initial `contextType` enum:

- `field_observation`
- `travel_observation`
- `resource_use`
- `crafting_use`
- `study`
- `instruction`
- `quest_event`
- `chronicle_record`

Optional context fields:

| Field | Planned constraint |
| --- | --- |
| `continentId` | `null` or canonical dotted-id string. |
| `regionId` | `null` or canonical dotted-id string. |
| `settlementId` | `null` or canonical dotted-id string. |
| `biomeTags` | Array of unique non-empty lower snake-case slugs. |
| `eventId` | `null` or canonical dotted-id string. |
| `actionId` | `null` or canonical dotted-id string. |
| `itemInstanceId` | `null` or canonical dotted-id string. |
| `documentId` | `null` or canonical dotted-id string. |
| `teacherId` | `null` or canonical dotted-id string. |
| `institutionId` | `null` or canonical dotted-id string. |
| `questOutcomeId` | `null` or canonical dotted-id string. |
| `chronicleRecordId` | `null` or canonical dotted-id string. |
| `skillId` | `null` or canonical dotted-id string. |
| `spellId` | `null` or canonical dotted-id string. |

The context must not become a permissive free-form bag. Every optional reference is either `null` or a strict non-empty canonical dotted id.

Source-specific field requirements and source/context compatibility belong to later semantic validation. For example, structural enum parity allows `combat_observation`, but the semantic validator must reject it until an approved context mapping exists.

A discriminated union keyed by `contextType` would be safer if it can be implemented without broadening the narrow schema pass or exceeding current schema-test conventions. If the first implementation keeps one strict object, semantic-validator planning must define exact allowed and required fields for every source/context pairing before evidence records are accepted.

## 10. Boundary And Forbidden Fields

The first schema must reject these record-level fields through `additionalProperties: false`:

- `progress`
- `currentProgress`
- `completed`
- `completion`
- `completionValue`
- `completionPercent`
- `trialState`
- `trialValue`
- `discovered`
- `unlockedAt`
- `completedAt`
- `owner`
- `accountId`
- `familyId`
- `characterId`
- UI state
- evidence consumer state
- generated output fields

`characterId` must not be a top-level shortcut separate from `ownerScope` and `ownerId`.

Evidence remains proof input. It is not progress, completion, discovery, a trial result, knowledge ownership, consumer state, or presentation state.

## 11. Schema-File Test Plan

The schema implementation should update:

- `tests/unit/schema-files.test.mjs`

The future implementation must:

- Add `packages/schemas/player/knowledge_evidence.schema.json` to the focused schema-file list.
- Keep the existing test focused on JSON parseability, `$schema`, and top-level `type`.
- Add a separate focused schema contract audit only if the implementation needs to prove exact required fields, enums, patterns, strictness, and forbidden-field absence.
- Avoid semantic reference validation in the schema pass.
- Avoid creating evidence JSON, evidence state, or runtime fixtures.

No broad typecheck is required for the schema-only implementation unless source outside the approved schema/test/docs scope changes unexpectedly.

## 12. Future Schema Implementation Acceptance Criteria

`Version 0.5.123 - Knowledge Evidence Schema` is accepted only when:

- `packages/schemas/player/knowledge_evidence.schema.json` exists.
- It is a strict record-level JSON Schema.
- It requires all planned live fields.
- It rejects undeclared properties.
- It keeps deferred progress, completion, trial, UI, and generated-output fields out.
- `tests/unit/schema-files.test.mjs` includes it.
- `npm.cmd run tool:content-lint` still passes.
- Focused schema-file tests pass.
- No evidence JSON, evidence state, runtime loading, persistence, UI, generated output, or gameplay behavior is added.
- No snippet content, snippet schema, or snippet validator changes are bundled unless separately authorized.

## 13. Later Semantic Validation Plan

A later semantic-validator plan should define checks for:

- `snippetId` resolves to one authored snippet.
- `domainId` matches the referenced snippet.
- `subjectType` matches the referenced snippet.
- `subjectId` matches the referenced snippet.
- `sourceType` matches one discovery source declared by the referenced snippet.
- `sourceId` remains `null` until an authority exists.
- `ownerScope` is allowed.
- `ownerId` resolves through the owner-scope authority.
- Acquisition-context references resolve through selected authorities.
- `contextType` and populated context fields are compatible with `sourceType`.
- No duplicate `evidenceId` exists in one collection.
- Duplicate progress credit remains a separate progress-consumer policy.
- No evidence fields appear in authored snippet content.
- No progress, completion, trial, UI, generated-output, or consumer-state fields appear in evidence records.

The semantic validator should fail closed. It must not infer omitted owner, source, context, domain, subject, or authority data.

## 14. Risks And Deferred Work

- Owner-scope sharing remains unresolved.
- Broad-registry `defaultEvidenceOwnerScopes` cannot be copied directly into beneficiary ownership.
- Source-id authorities remain undefined.
- Acquisition context could become too permissive without source-specific semantic compatibility.
- Duplicate credit and repeatability are deferred.
- Confidence and weight are deferred.
- Persistence, save shape, and save migration are deferred.
- Progress, completion, trial, and UI behavior remain deferred.
- Arcane Lore snippets remain blocked while `knowledge_domain.arcane_lore` is planned.
- Event, action, item-instance, document, teacher, institution, quest-outcome, and Chronicle-record authorities remain undefined.

## 15. Future Implementation Sequence

Recommended order:

1. `Version 0.5.122 - Knowledge Evidence Schema Plan`
2. `Version 0.5.123 - Knowledge Evidence Schema`
3. `0.5.x - Knowledge Evidence Semantic Validator Plan`
4. `0.5.x - Knowledge Evidence Semantic Validator`
5. `0.5.x - Knowledge Progress State Plan`
6. `0.5.x - Knowledge Progress State Schema`
7. `0.5.x - Knowledge Evidence-to-Progress Rules Plan`
8. `0.5.x - Knowledge Trials Plan`
9. `0.5.x - Knowledge UI Plan`

Each item remains a separate scoped run. Evidence producers, persistence, runtime loading, progress consumers, trials, and UI must not be bundled into schema implementation.

## 16. Non-Goals And Forbidden Changes

This planning run includes:

- no evidence schema implementation
- no evidence JSON or content
- no evidence state
- no semantic validator
- no runtime loaders
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
