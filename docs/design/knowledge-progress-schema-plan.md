# Knowledge Progress Schema Plan

Source version/run: Version 0.5.127 - Knowledge Progress Schema Plan
Date: 2026-06-08
Status: planning-only knowledge progress schema design

## 1. Purpose And Status

This document turns `docs/design/knowledge-progress-state-plan.md` into a precise future JSON Schema design for one knowledge progress record. It selects the schema path, wrapper posture, required fields, identifier patterns, enums, field constraints, schema-file test registration, semantic-validation boundary, and implementation acceptance criteria.

This run implements no progress schema, progress JSON/content/state, evidence JSON/content/state, runtime loader or producer, database or persistence behavior, UI, generated output, evidence-to-progress rules, completion math, trials, Chronicle or Renown events, ownership behavior, snippet content, schemas, registry content, skills, spells, or gameplay behavior.

## 2. Current State Recap

The current foundation is:

- The progress-state plan exists at `docs/design/knowledge-progress-state-plan.md`.
- The evidence record schema exists at `packages/schemas/player/knowledge_evidence.schema.json`.
- Pure evidence semantic validation exists at `tools/content-lint/knowledge-evidence.mjs`.
- Authored snippets exist at `packages/content/base/player/knowledge_snippets.json`.
- Snippet semantic validation exists at `tools/content-lint/knowledge-snippets.mjs`.
- No canonical evidence or progress storage path exists.
- No progress schema, progress state, progress semantic validator, evidence-to-progress rules, completion math, trials, UI, runtime producer, persistence contract, or save-state shape exists.

The evidence validator remains test-fixture-only because no canonical evidence collection exists. The progress schema must not invent one.

## 3. Schema Ownership Decision

The future progress record schema path is:

- `packages/schemas/player/knowledge_progress.schema.json`

The schema will own the structural shape of one future knowledge progress record only.

Progress is future runtime or save state, not authored base content. The schema must not own:

- evidence-to-progress computation;
- evidence weights or repeatability;
- completion thresholds;
- tier aggregation;
- trial readiness;
- UI state;
- persistence or save migration;
- owner mutation or sharing;
- runtime events;
- gameplay behavior.

Semantic reference validation belongs to a later pure validator or explicitly scoped runtime plan.

## 4. Wrapper Decision

The future progress collection input shape should be:

```json
{
  "records": []
}
```

Wrapper rules:

- The top-level value is an object.
- It has exactly one key: `records`.
- `records` is an array of progress records.

`Version 0.5.128 - Knowledge Progress Schema` should create only the strict record-level schema at `packages/schemas/player/knowledge_progress.schema.json`.

Wrapper validation remains semantic/runtime-validator ownership unless schema-file conventions explicitly change. The schema implementation must not create progress JSON/content/state or test fixtures merely to exercise the record schema.

## 5. Required Progress Record Fields

The first schema must require:

- `progressId`
- `snippetId`
- `domainId`
- `subjectType`
- `subjectId`
- `ownerScope`
- `ownerId`
- `progressValue`
- `consumedEvidenceIds`
- `updatedSequence`
- `notes`

The first schema explicitly defers:

- `progressSources`
- `completed`
- `completedAt`
- `completionValue`
- `completionPercent`
- `trialState`
- `trialReady`
- `trialUnlockValue`
- `discovered`
- `unlockedAt`
- `acquiredAt`
- `confidence`
- `weight`
- UI fields
- generated-output fields
- persistence metadata

Every required field must be supplied explicitly. The schema must define no defaults.

## 6. Identifier And Pattern Plan

The first schema should use these exact patterns:

| Field | Pattern |
| --- | --- |
| `progressId` | `^knowledge_progress\.[a-z0-9]+(?:_[a-z0-9]+)*\.[a-z0-9]+(?:_[a-z0-9]+)*\.[a-z0-9]+(?:_[a-z0-9]+)*$` |
| `snippetId` | `^knowledge_snippet\.[a-z0-9]+(?:_[a-z0-9]+)*\.[a-z0-9]+(?:_[a-z0-9]+)*\.[a-z0-9]+(?:_[a-z0-9]+)*$` |
| `domainId` | `^knowledge_domain\.[a-z0-9]+(?:_[a-z0-9]+)*$` |
| `subjectId` | `^[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)+$` |
| `ownerId` | `^[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)+$` |
| `consumedEvidenceIds` item | `^knowledge_evidence\.[a-z0-9]+(?:_[a-z0-9]+)*\.[a-z0-9]+(?:_[a-z0-9]+)*\.[a-z0-9]+(?:_[a-z0-9]+)*$` |

Identity rules:

- `progressId` must not encode mutable `progressValue`.
- `progressId` should be unique within the future progress collection.
- The record schema validates `progressId` shape, not collection uniqueness.
- `consumedEvidenceIds` must be unique within one record.
- Cross-record evidence consumption remains semantic-validation and later progress-policy ownership.
- Identifier fields are references, not display text.

## 7. Enum Posture

### Subject Type

`subjectType` must mirror the live snippet schema exactly:

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

`custom` remains structurally mirrored for contract parity. A later semantic validator must block it unless an active-domain authored snippet and approved subject authority exist.

### Owner Scope

The first schema must allow exactly:

- `character`

It must not add:

- `family`
- `account`
- `settlement`
- `faction`
- `custom`

Family and account sharing remain blocked until sharing, inheritance, revocation, and benefit rules exist. Settlement or faction context does not make a settlement or faction the progress owner.

## 8. Field Type And Constraint Plan

The root record should use:

- `type: "object"`
- `additionalProperties: false`
- no defaults

Planned field constraints:

| Field | Constraint |
| --- | --- |
| `progressId` | Required non-empty string with the progress-id pattern. |
| `snippetId` | Required non-empty string with the snippet-id pattern. |
| `domainId` | Required non-empty string with the domain-id pattern. |
| `subjectType` | Required string enum matching the live snippet schema. |
| `subjectId` | Required non-empty canonical dotted-id string. |
| `ownerScope` | Required string enum containing only `character`. |
| `ownerId` | Required non-empty canonical dotted-id string. |
| `progressValue` | Required integer with `minimum: 0`; no maximum. |
| `consumedEvidenceIds` | Required array of evidence-id strings with `uniqueItems: true`; no `minItems`. |
| `updatedSequence` | Required integer with `minimum: 0`. |
| `notes` | Required array with `minItems: 1`, `uniqueItems: true`, and non-empty string items. |

An empty `consumedEvidenceIds` array is structurally allowed. This supports an explicitly initialized zero-state record without forcing the record schema to own storage lifecycle or evidence-credit logic. The schema cannot safely express that an empty array is acceptable only when `progressValue` is zero without adding conditional policy that belongs to later semantic/storage planning.

Later semantic and storage policy must decide:

- whether zero-state records should exist;
- whether they should persist;
- whether positive progress may coexist with no consumed evidence;
- whether authorized non-evidence operations may ever contribute.

`notes` should require at least one unique non-empty entry, matching the evidence schema's audit posture. Zero-state records do not justify empty notes; a note can identify the fixture or initialization purpose without defining behavior.

The first schema includes no `progressSources` and no completion, trial, UI, event, generated-output, or persistence fields.

## 9. Consumed Evidence Ids Posture

`consumedEvidenceIds` contains evidence identity references only.

The record schema owns:

- array structure;
- evidence-id string shape;
- uniqueness within the record.

The record schema does not prove:

- that evidence exists;
- that evidence passes semantic validation;
- that evidence is eligible for this progress record;
- that the evidence owner matches the progress owner;
- that evidence and progress target the same snippet/domain/subject;
- that the evidence has not been consumed by another record;
- that evidence count determines `progressValue`.

The array is structurally allowed to be empty. Later semantic/storage policy should allow an empty array only for an explicitly authorized zero-state posture. Re-consuming one evidence id inside the same record is blocked structurally by `uniqueItems: true`.

## 10. Progress Value Posture

`progressValue` is a finite non-negative integer:

- It is not a percentage.
- It has no schema maximum.
- It does not imply completion.
- It does not consume `completionWeight`.
- It does not consume `trialUnlockWeight`.
- It does not define decay.
- It does not define stacking or repeatability.
- It does not define quality weighting or confidence.
- It does not define evidence weights.

JSON Schema `type: "integer"` and `minimum: 0` provide the complete first structural boundary. Evidence-to-progress computation remains a later separate plan.

## 11. Boundary And Forbidden Fields

The first schema must exclude and reject through `additionalProperties: false`:

- `progressSources`
- `completed`
- `completedAt`
- `completion`
- `completionValue`
- `completionPercent`
- `trialState`
- `trialReady`
- `trialValue`
- `trialUnlockValue`
- `discovered`
- `unlockedAt`
- `acquiredAt`
- `confidence`
- `weight`
- `owner`
- `accountId`
- `familyId`
- `characterId`
- embedded evidence records
- UI state
- generated-output fields
- persistence or save metadata
- runtime event output

`characterId` must not be a top-level shortcut separate from `ownerScope` and `ownerId`.

Progress remains a state summary. It is not evidence, authored content, completion, trial state, presentation state, persistence metadata, or event output.

## 12. Schema-File Test Plan

The future schema implementation should update:

- `tests/unit/schema-files.test.mjs`

`Version 0.5.128` should:

- add `packages/schemas/player/knowledge_progress.schema.json` to the focused schema-file list;
- retain the current parseability, `$schema`, and top-level `type` convention;
- add a focused schema contract audit only if needed to prove exact required fields, enums, patterns, strictness, notes posture, consumed-evidence posture, and forbidden-field absence;
- avoid semantic reference validation during the schema pass;
- avoid creating progress JSON/content/state, evidence state, or runtime fixtures.

No broad typecheck is required for the schema-only implementation unless source outside the approved schema/test/docs scope changes unexpectedly.

## 13. Future Schema Implementation Acceptance Criteria

`Version 0.5.128 - Knowledge Progress Schema` is accepted only when:

- `packages/schemas/player/knowledge_progress.schema.json` exists.
- It is a strict record-level JSON Schema.
- It requires all 11 planned fields.
- It rejects undeclared properties.
- It uses the exact planned id patterns and enums.
- `progressValue` and `updatedSequence` are non-negative integers.
- `consumedEvidenceIds` permits an empty array structurally and rejects duplicate ids.
- `notes` requires at least one unique non-empty string.
- `progressSources` remains deferred unless separately authorized.
- Completion, trial, UI, event, generated-output, and persistence fields remain absent.
- `tests/unit/schema-files.test.mjs` includes the schema.
- `npm.cmd run tool:content-lint` still passes.
- No progress JSON/content/state is added.
- No evidence JSON/content/state is added.
- No runtime producer, persistence, completion, trial, UI, event, ownership, or gameplay behavior is added.
- No snippet JSON/schema/validator, evidence schema/validator, registry, skill, or spell change is bundled unless separately authorized.

## 14. Later Semantic Validation Plan

A later progress semantic-validator plan should define:

- exact progress wrapper validation;
- schema-first record validation;
- duplicate `progressId` rejection;
- one record per `ownerScope`/`ownerId`/`snippetId`;
- `snippetId` resolution to one authored snippet;
- `domainId`, `subjectType`, and `subjectId` equality with the referenced snippet;
- active-domain enforcement;
- character-only `ownerScope`;
- pattern-only `ownerId` until a character authority exists;
- consumed evidence resolution through records that pass evidence semantic validation;
- exact consumed-evidence owner parity with the progress owner;
- exact consumed-evidence snippet/domain/subject parity with the progress record;
- `consumedEvidenceIds` uniqueness;
- zero-state and empty-consumed-evidence consistency;
- deterministic non-negative `progressValue` and `updatedSequence`;
- absence of completion, trial, UI, event, generated-output, and persistence fields;
- absence of progress fields in authored snippets;
- side-effect-free validation and input immutability.

Cross-record duplicate evidence consumption remains deferred until the progress semantic-validator plan or evidence-to-progress rules select an exact policy.

No semantic validator is implemented in this run.

## 15. Relationship To Evidence-To-Progress Rules

The progress schema stores a value; it does not compute it.

The schema does not decide:

- evidence weights;
- whether repeated evidence may contribute;
- whether distinct evidence from equivalent occurrences may stack;
- whether evidence quality changes credit;
- whether non-evidence operations may grant progress;
- whether progress can decrease;
- how `updatedSequence` advances.

Those decisions belong to `Knowledge Evidence-to-Progress Rules Plan`, after the progress schema and semantic validator exist as separate narrow slices.

## 16. Relationship To Completion, Trials, And UI

- Progress is not completion.
- Completion thresholds remain undefined.
- Tier aggregation remains undefined.
- `completionWeight`, `countsTowardTierCompletion`, and `trialUnlockWeight` remain later completion-policy inputs.
- Trial readiness remains undefined.
- Progress state does not emit Chronicle or Renown events.
- Progress state does not grant rewards or ownership.
- UI projection, labels, bars, sorting, badges, tooltips, and unlock presentation remain deferred.

## 17. Risks And Deferred Work

- No canonical evidence or progress storage path exists.
- Character owner authority is unresolved.
- Evidence-to-progress computation is deferred.
- Duplicate credit and cross-record evidence-consumption policy are unresolved.
- Zero-state persistence policy is unresolved.
- Completion thresholds are unresolved.
- `progressSources` remains deferred.
- Persistence, save shape, and save migration are deferred.
- UI and generated output are deferred.
- Arcane Lore progress remains blocked while `knowledge_domain.arcane_lore` is planned.
- A cleanup decision remains necessary for the evidence contract, schema, and semantic-validator plans after progress and evidence-to-progress planning consumes their remaining guidance.

## 18. Future Implementation Sequence

Recommended order:

1. `Version 0.5.127 - Knowledge Progress Schema Plan`
2. `Version 0.5.128 - Knowledge Progress Schema`
3. `0.5.x - Knowledge Progress Semantic Validator Plan`
4. `0.5.x - Knowledge Progress Semantic Validator`
5. `0.5.x - Knowledge Evidence-to-Progress Rules Plan`
6. `0.5.x - Knowledge Evidence Producers Plan`
7. `0.5.x - Knowledge Completion Rules Plan`
8. `0.5.x - Knowledge Trials Plan`
9. `0.5.x - Knowledge UI Plan`

Each item remains a separate scoped run.

## 19. Non-Goals And Forbidden Changes

This planning run authorizes none of the following:

- No progress schema implementation.
- No progress JSON, content, or state.
- No progress semantic validator.
- No evidence JSON, content, or state.
- No evidence schema edits.
- No evidence validator edits.
- No snippet content edits.
- No snippet schema edits.
- No snippet validator edits.
- No registry content edits.
- No skill or spell edits.
- No runtime loaders or producers.
- No database or persistence changes.
- No save, account, or session state.
- No generated output.
- No UI.
- No main-menu work.
- No evidence-to-progress rules.
- No completion math.
- No trials.
- No Chronicle or Renown events.
- No ownership behavior.
- No item, spell, or skill ownership changes.
- No settlement, map, travel, or economy implementation.
- No unrelated cleanup.
