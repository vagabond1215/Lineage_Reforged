# Knowledge Progress State Plan

Version: `Version 0.5.126 - Knowledge Progress State Plan`
Date: 2026-06-08
Status: planning authority only

## 1. Purpose And Status

This document defines the future knowledge progress-state boundary. It plans record identity, owner scope, snippet and evidence relationships, evidence-consumption boundaries, schema posture, validation responsibilities, examples, and implementation order.

This run implements documentation only. It does not implement a progress schema, progress JSON/content/state, evidence JSON/content/state, runtime loader or producer, database or persistence behavior, UI, generated output, completion math, trials, Chronicle or Renown events, ownership behavior, snippet content, schemas, registry content, skills, spells, or gameplay behavior.

## 2. Current State Recap

The current knowledge foundation is:

- Authored snippets exist at `packages/content/base/player/knowledge_snippets.json`.
- Snippet semantic validation exists at `tools/content-lint/knowledge-snippets.mjs`.
- The evidence record schema exists at `packages/schemas/player/knowledge_evidence.schema.json`.
- Pure evidence semantic validation exists at `tools/content-lint/knowledge-evidence.mjs`.
- The evidence validator is test-fixture-only. It is not registered in normal content lint because no canonical evidence collection or state path exists.
- No canonical evidence or progress storage path exists.
- No progress schema, progress state, evidence-to-progress rules, completion math, trials, UI, runtime producer, persistence contract, or save-state shape exists.

The current authored snippet `progression` object contains content metadata such as `completionWeight`, `countsTowardTierCompletion`, and `trialUnlockWeight`. Those authored values are not player progress state and do not currently compute or grant progress.

## 3. Progress Concept Definition

Knowledge progress is a future owner-scoped state record summarizing a beneficiary's accumulated progress toward one specific authored knowledge snippet.

Progress has these boundaries:

- Progress is not authored snippet content.
- Progress is not evidence.
- Progress is not completion by itself. A later completion plan must define any threshold and completion result.
- Progress is not a trial result or trial-readiness state.
- Progress is not UI display state.
- Progress should be derived from semantically validated evidence or explicitly authorized runtime operations, not free-form mutation.
- A progress record is a current state summary. It does not replace the evidence records that support the summary.

## 4. Progress State Identity

The future progress record should use the following conceptual fields:

| Field | Initial posture |
| --- | --- |
| `progressId` | Stable record identity for one owner and snippet progress record. |
| `snippetId` | Reference to exactly one authored snippet. |
| `domainId` | Snapshot of the referenced snippet's domain. |
| `subjectType` | Snapshot of the referenced snippet's subject type. |
| `subjectId` | Snapshot of the referenced snippet's subject id. |
| `ownerScope` | Beneficiary scope; initially `character` only. |
| `ownerId` | Beneficiary id; pattern-only until a character authority is selected. |
| `progressValue` | Non-negative integer progress points. |
| `consumedEvidenceIds` | Unique references to evidence already credited to this progress record. |
| `progressSources` | Deferred candidate audit detail for individual applied changes. |
| `updatedSequence` | Deterministic sequence of the latest accepted progress update. |
| `notes` | Non-empty planning, fixture, or state notes under the eventual schema policy. |

Identity rules:

- `progressId` must not encode the mutable `progressValue`.
- A future schema plan should select a stable id pattern. The likely family is `knowledge_progress.<domain-or-subject>.<subject-or-owner>.<record-key>`, but this planning pass does not freeze the exact pattern.
- `snippetId`, `domainId`, `subjectType`, and `subjectId` should snapshot the authored relationship and must validate against the current snippet authority.
- `ownerScope` should initially match the evidence posture: `character` only.
- `ownerId` remains pattern-only until an authoritative character collection or runtime identity contract is selected.
- `updatedSequence` should be an integer with a minimum of zero. A deterministic sequence is preferred over timestamps until a clock and persistence owner are selected.
- One owner should have at most one current progress record for one snippet. Cross-record uniqueness belongs to the future semantic validator, not the record schema.

## 5. Owner Scope Posture

The first allowed `ownerScope` should be:

- `character`

The following scopes remain deferred:

- `family`
- `account`
- `settlement`
- `faction`
- `custom`

Owner rules:

- Family or account sharing requires explicit inheritance, sharing, revocation, and benefit rules.
- Settlement or faction acquisition context does not make a settlement or faction the progress owner.
- A progress owner must match the owner of eligible consumed evidence or be produced by a future explicitly authorized ownership-transfer rule.
- The initial plan does not permit owner derivation across scopes.
- No persistence or save-state owner shape is implemented by this run.

## 6. Snippet Relationship Checks

A future progress semantic validator should enforce:

- `snippetId` resolves to exactly one authored snippet.
- `domainId` equals the referenced snippet's `domainId`.
- `subjectType` equals the referenced snippet's `subjectType`.
- `subjectId` equals the referenced snippet's `subjectId`.
- The referenced domain resolves and has `status: "active"`.
- Planned domains, including `knowledge_domain.arcane_lore`, remain blocked until they are active and have semantically valid authored snippets.
- Progress validation never mutates snippet definitions.
- Progress fields never appear in authored snippet JSON.
- Authored snippet `progression` metadata remains input for later completion policy, not mutable state copied into progress records.

## 7. Evidence Relationship And Consumption Boundary

`consumedEvidenceIds` records which validated evidence identities have already contributed to the progress summary.

The first boundary should be:

- Every consumed id references an evidence record that passes the current evidence schema and semantic validator.
- Progress state must reject evidence ids that fail evidence semantic validation.
- Progress state does not create evidence.
- Progress state does not mutate evidence records.
- Duplicate evidence identity remains evidence-validator ownership.
- Duplicate progress credit, occurrence equivalence, repeatability, and stacking remain progress-policy concerns.
- `consumedEvidenceIds` should be unique within a progress record.
- Repeated consumption of the same evidence id remains forbidden unless a future repeatability policy explicitly replaces this rule.
- Evidence owner, snippet, domain, subject type, and subject id must equal the progress record's corresponding values.
- The schema should not infer `progressValue` from the count of consumed evidence ids.

An empty `consumedEvidenceIds` array may be useful for an explicitly initialized zero-value fixture or runtime record. Whether zero-state records should be stored at all belongs to the later schema and storage plans. Positive progress computation cannot be verified until evidence-to-progress rules exist.

## 8. Progress Value Posture

The first structural posture should define `progressValue` as a finite non-negative integer.

Integer progress points are preferred because they:

- avoid floating-point accumulation drift;
- support deterministic equality and replay checks;
- do not imply percentage semantics;
- leave future evidence weights and thresholds open;
- fit the current schema adapter's established integer/minimum pattern.

The first schema should set a minimum of zero and no maximum. It should not define a completion threshold.

This plan does not:

- interpret `progressValue` as a percentage;
- consume `completionWeight` or `trialUnlockWeight` directly;
- define decay, stacking, repeatability, quality weighting, confidence, or completion formulas;
- define how many points any evidence source grants;
- define whether progress can decrease.

Those decisions belong to the future evidence-to-progress and completion-rule plans.

## 9. Progress Sources

`progressSources` is a candidate audit trail describing how accepted changes contributed to the current progress summary.

Candidate source-entry fields are:

- `sourceKind`
- `evidenceId`
- `delta`
- `appliedSequence`
- `reason`

The candidate has these boundaries:

- A progress source is not an evidence record.
- Progress sources do not replace `consumedEvidenceIds`.
- Progress sources do not create evidence.
- `delta` rules remain future evidence-to-progress policy.
- `reason` requires a controlled vocabulary before it can become a stable contract.
- `sourceKind` requires an authority for evidence-backed and authorized non-evidence operations.

Recommendation: defer `progressSources` from the first schema. The first schema should use `consumedEvidenceIds` as the narrow audit boundary. Add `progressSources` only after source kinds, delta rules, reason vocabulary, and replay expectations are planned.

## 10. State Storage Posture

Candidate future locations include:

- runtime-only in-memory state;
- save, account, or session state;
- test fixtures only;
- generated debug state, if a later plan explicitly authorizes it.

This plan does not select a location.

Storage recommendations:

- Do not create a canonical progress JSON or authored content path during planning.
- Treat progress as future runtime/save state rather than base content.
- Do not register progress with content lint as if it were authored content.
- A later schema plan should decide whether the first contract is record-level only or also defines a wrapper.
- A later implementation must not add persistence, save migration, account state, or session mutation unless explicitly scoped.
- Generated debug output must remain absent until its source, lifecycle, and cleanup ownership are selected.

## 11. Schema Ownership Plan

The recommended future schema path is:

- `packages/schemas/player/knowledge_progress.schema.json`

The first schema should likely be:

- a strict record-level schema;
- `type: "object"`;
- `additionalProperties: false`;
- explicit required identity, snippet snapshot, owner, progress, consumed-evidence, sequence, and notes fields;
- free of defaults;
- free of UI, completion, trial, event, persistence, and generated-output fields.

Recommended first-schema required fields:

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

`progressSources` should remain deferred from the first schema. Wrapper validation should remain semantic/runtime-validator ownership unless the later schema plan identifies an established repository convention that requires a wrapper schema.

## 12. Semantic Validation Plan

A future pure semantic validator should own:

- an exact progress wrapper gate if fixtures or state input are selected;
- schema-first record validation;
- duplicate `progressId` rejection;
- one-record-per-owner-and-snippet enforcement;
- snippet/domain/subject parity;
- active-domain checks;
- allowed `ownerScope` checks;
- `consumedEvidenceIds` uniqueness;
- consumed evidence resolution through records that pass evidence semantic validation;
- exact evidence-owner and progress-owner parity;
- exact evidence and progress snippet/domain/subject parity;
- deterministic non-negative `progressValue` and `updatedSequence` structure;
- side-effect-free validation with no input mutation.

The first semantic validator should not:

- compute `progressValue`;
- decide evidence weights;
- create or consume evidence;
- mutate progress;
- mark completion;
- unlock trials;
- emit UI, runtime, Chronicle, or Renown output.

No semantic validator or evidence-to-progress computation is implemented in this pass.

## 13. Relationship To Completion And Trials

Progress is a possible future input to completion, not completion itself.

The following remain future policy:

- per-snippet completion thresholds;
- domain and tier completion;
- `countsTowardTierCompletion`;
- `completionWeight`;
- `trialUnlockWeight`;
- trial readiness and attempt rules.

A progress record does not automatically unlock a trial, emit Chronicle or Renown events, grant ownership, grant rewards, reveal UI, or change gameplay state.

## 14. Relationship To UI And Generated Output

Progress state is not UI display state.

Future UI concerns include:

- labels;
- progress bars;
- percentages;
- badges;
- tooltips;
- sorting and filtering;
- locked and unlocked presentation;
- completion and trial-readiness presentation.

UI should consume an authorized projection rather than reading or mutating raw progress records directly. Generated output must not include progress records until a later generator or runtime plan authorizes the source, format, lifecycle, and cleanup policy.

## 15. Initial Examples

These examples are illustrative and non-authoritative. They must not be added as content or state. Values do not establish evidence weights or completion thresholds.

### Aloe

```json
{
  "progressId": "knowledge_progress.flora.aloe.character_example",
  "snippetId": "knowledge_snippet.flora.aloe.identification",
  "domainId": "knowledge_domain.flora",
  "subjectType": "flora",
  "subjectId": "flora.aloe",
  "ownerScope": "character",
  "ownerId": "character.example",
  "progressValue": 1,
  "consumedEvidenceIds": [
    "knowledge_evidence.flora.aloe.field_001"
  ],
  "updatedSequence": 101,
  "notes": [
    "Illustrative only; one point is not an approved evidence weight."
  ]
}
```

### Badger

```json
{
  "progressId": "knowledge_progress.fauna.badger.character_example",
  "snippetId": "knowledge_snippet.fauna.badger.identification",
  "domainId": "knowledge_domain.fauna",
  "subjectType": "fauna",
  "subjectId": "fauna.badger",
  "ownerScope": "character",
  "ownerId": "character.example",
  "progressValue": 1,
  "consumedEvidenceIds": [
    "knowledge_evidence.fauna.badger.field_001"
  ],
  "updatedSequence": 102,
  "notes": [
    "Illustrative only; observation does not establish completion."
  ]
}
```

### Iron Ore

```json
{
  "progressId": "knowledge_progress.minerals.iron_ore.character_example",
  "snippetId": "knowledge_snippet.minerals.iron_ore.identification",
  "domainId": "knowledge_domain.minerals",
  "subjectType": "mineral",
  "subjectId": "mineral.iron_ore",
  "ownerScope": "character",
  "ownerId": "character.example",
  "progressValue": 1,
  "consumedEvidenceIds": [
    "knowledge_evidence.minerals.iron_ore.field_001"
  ],
  "updatedSequence": 103,
  "notes": [
    "Illustrative only; extraction and processing rules remain deferred."
  ]
}
```

### Kaelvar Travel Observation

```json
{
  "progressId": "knowledge_progress.general_lore.kaelvar.character_example",
  "snippetId": "knowledge_snippet.general_lore.kaelvar.cultural_context",
  "domainId": "knowledge_domain.general_lore",
  "subjectType": "region",
  "subjectId": "region.kaelvar",
  "ownerScope": "character",
  "ownerId": "character.example",
  "progressValue": 1,
  "consumedEvidenceIds": [
    "knowledge_evidence.general_lore.kaelvar.travel_001"
  ],
  "updatedSequence": 104,
  "notes": [
    "Illustrative only; travel presence does not automatically grant evidence or progress."
  ]
}
```

## 16. Boundary Rules

- Progress is not evidence.
- Progress is not authored content.
- Progress is not completion.
- Progress is not trial state.
- Progress is not UI state.
- Progress validation does not create progress at runtime.
- Evidence validation does not grant progress.
- Skill ranks do not create progress.
- Known spells do not create progress.
- Broad registry `relatedSkillIds` do not create progress.
- Runtime events must be explicitly authorized before creating evidence or progress.
- Progress does not mutate snippets, evidence, domains, owners, or gameplay state.

## 17. Focused Test Plan For Later Schema And Validator Runs

Later phases should add focused coverage for:

- schema-file test registration;
- exact progress schema contract audit;
- exact wrapper gate;
- valid Aloe, Badger, Iron Ore, and Kaelvar character progress fixtures;
- unresolved `snippetId`;
- domain, subject type, and subject id mismatch;
- non-character `ownerScope`;
- invalid `ownerId` pattern;
- duplicate `progressId`;
- duplicate owner-and-snippet records;
- duplicate `consumedEvidenceIds`;
- unresolved or semantically invalid consumed evidence;
- consumed evidence owner mismatch;
- consumed evidence snippet/domain/subject mismatch;
- negative, fractional, non-finite, or non-numeric `progressValue`;
- invalid or non-deterministic `updatedSequence`;
- forbidden completion, trial, UI, event, persistence, and generated-output fields;
- planned Arcane Lore remaining blocked;
- input immutability and deterministic results.

Schema tests should prove structure only. Semantic tests should use in-memory fixtures until canonical evidence and progress storage owners are selected.

## 18. Future Implementation Sequence

Recommended sequence:

1. `Knowledge Progress State Plan` - this document.
2. `Knowledge Progress Schema Plan` - freeze exact field requirements, id patterns, array posture, notes posture, and schema-test expectations.
3. `Knowledge Progress Schema` - add only the strict record schema and focused schema-file coverage.
4. `Knowledge Progress Semantic Validator Plan` - select fixture/wrapper inputs, authority maps, exact cross-record rules, and test matrix.
5. `Knowledge Progress Semantic Validator` - add a pure helper and focused in-memory tests without mutation or normal lint registration unless canonical state exists.
6. `Knowledge Evidence-to-Progress Rules Plan` - define eligible evidence, integer deltas, repeatability, duplicate credit, ordering, and authorized non-evidence operations.
7. `Knowledge Evidence Producers Plan` - define runtime owners that may create evidence.
8. `Knowledge Completion Rules Plan` - define thresholds, authored weights, domain/tier aggregation, and completion outputs.
9. `Knowledge Trials Plan` - define trial readiness, attempts, outcomes, and rewards.
10. `Knowledge UI Plan` - define read-only projections and presentation after state and completion contracts are stable.

The immediate next recommended run is `Version 0.5.127 - Knowledge Progress Schema Plan`.

## 19. Risks And Deferred Work

- No canonical evidence or progress storage path exists.
- Character owner authority is unresolved; `ownerId` remains pattern-only.
- Evidence-to-progress computation is deferred.
- Duplicate credit, occurrence equivalence, repeatability, and stacking are unresolved.
- Progress and completion thresholds are unresolved.
- The role of authored `completionWeight` and `trialUnlockWeight` is unresolved.
- Persistence, save-state shape, and save migration are deferred.
- UI and generated output are deferred.
- Arcane Lore remains blocked while its domain is planned.
- Evidence producer authorization remains deferred.
- A cleanup decision is still needed for the evidence contract, schema, and semantic-validator planning documents after progress schema and evidence-to-progress planning consume their remaining guidance.

## 20. Non-Goals And Forbidden Changes

This plan authorizes none of the following:

- No progress schema implementation.
- No progress JSON, content, or state.
- No evidence JSON, content, or state.
- No evidence validator edits.
- No evidence schema edits.
- No snippet content edits.
- No snippet schema edits.
- No snippet validator edits.
- No registry content edits.
- No skill or spell edits.
- No runtime loaders or producers.
- No database or persistence changes.
- No generated output.
- No UI.
- No main-menu work.
- No save, account, or session state.
- No completion math.
- No trials.
- No Chronicle or Renown events.
- No ownership behavior.
- No item, spell, or skill ownership changes.
- No settlement, map, travel, or economy implementation.
- No unrelated cleanup.
