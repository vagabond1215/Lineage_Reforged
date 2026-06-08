# Knowledge Evidence Contract Plan

Source version/run: Version 0.5.121 - Knowledge Evidence Contract Plan
Date: 2026-06-08
Status: planning-only evidence contract

## 1. Purpose And Status

This document defines the future knowledge-evidence identity, source relationship, beneficiary owner scope, acquisition context, validation boundaries, and implementation sequence.

This run implements no schema files, evidence JSON, evidence state, runtime loaders, database or persistence behavior, UI, generated output, progress state, completion math, trials, Chronicle or Renown events, ownership behavior, snippet content, registry content, or gameplay behavior.

This plan is the active guardrail for the later evidence schema plan and schema implementation. After those runs, explicitly decide whether to retain it as a durable contract, consolidate it into a broader knowledge-state authority, or remove it after promoting remaining rules.

## 2. Current State Recap

The repository currently has:

- Authored snippets at `packages/content/base/player/knowledge_snippets.json`.
- The authored snippet schema at `packages/schemas/player/knowledge_snippet.schema.json`.
- Structural and semantic snippet validation at `tools/content-lint/knowledge-snippets.mjs`.
- Focused snippet validation tests at `tests/unit/knowledge-snippets-validation.test.mjs`.
- The broad registry at `packages/content/base/player/knowledge_domain_registry.json`.
- Structural and semantic broad-registry validation.

The current snippet catalog contains four records across active Flora, Fauna, Minerals, and General Lore domains.

No knowledge-evidence contract, evidence schema, evidence state, progress state, completion math, knowledge trials, knowledge UI, or snippet runtime loader exists yet.

Each snippet's `discoverySources` entries declare possible routes only. They are authored compatibility metadata, not proof that an owner performed an action, encountered a source, gained evidence, discovered a snippet, or earned progress.

## 3. Evidence Concept Definition

Knowledge evidence is a future runtime or state record proving that a specific beneficiary owner encountered an authorized source route relevant to one authored snippet in a specific acquisition context.

Evidence answers:

- which snippet the proof concerns
- which subject and domain were involved
- which declared source route was used
- who may benefit from the proof
- when or in what sequence the proof was acquired
- what authorized context supports the claim

Evidence is not:

- authored snippet content
- a discovery-source declaration
- progress state
- completion
- a trial request or result
- UI display state
- ownership of knowledge
- permission to mutate a snippet definition

Evidence may later be consumed by progress rules. Evidence creation and progress calculation must remain separate operations with separate validation and ownership.

## 4. Evidence Identity

A later schema plan should evaluate this initial record contract:

| Field | Initial posture | Purpose and boundary |
| --- | --- | --- |
| `evidenceId` | Required | Stable unique evidence-record identity. It must not be derived only from display text or a timestamp. |
| `snippetId` | Required | References one authored snippet. |
| `domainId` | Required snapshot/reference | Must equal the referenced snippet's `domainId`. It supports validation and inspection but does not create a domain relationship independently. |
| `subjectType` | Required snapshot/reference | Must equal the referenced snippet's `subjectType`. |
| `subjectId` | Required snapshot/reference | Must equal the referenced snippet's `subjectId`. |
| `sourceType` | Required | Must match one declared discovery route on the referenced snippet. |
| `sourceId` | Required nullable | Remains `null` until the source type has an explicit canonical authority. |
| `ownerScope` | Required | Identifies the beneficiary class governed by Section 5. |
| `ownerId` | Required | Identifies the specific beneficiary within that scope. |
| `acquiredSequence` | Preferred required ordering field | Deterministic non-negative ordering value within the future owning state or event stream. Generation and persistence remain deferred. |
| `acquiredAt` | Optional later | Authoritative timestamp only if a future clock and persistence owner exist. It must not replace deterministic ordering. |
| `acquisitionContext` | Required object | Structured proof context governed by Section 7. |
| `confidence` | Deferred | Do not include in the first schema unless a later progress plan defines its source, bounds, and effect. |
| `weight` | Deferred | Do not include in the first schema. Evidence must not override authored snippet progression weights or invent completion math. |

Recommended identity rules for the later schema plan:

- `evidenceId` is unique across the owning evidence collection.
- `evidenceId` is opaque enough that duplicate-credit policy is not encoded into its text.
- `snippetId`, domain, subject, source, and owner fields are explicit rather than inferred from `evidenceId`.
- No evidence id format should require backwards-compatibility aliases or migrations in this pre-release current-data phase.

The first schema plan should select the exact id pattern and collection wrapper. This run does not create either.

## 5. Owner Scope Model

`ownerScope` identifies who may benefit from evidence. It does not identify the source that produced the evidence.

| Owner scope | Current posture | Meaning |
| --- | --- | --- |
| `character` | First implementation candidate | Evidence belongs to one explicit character. No account or family projection is implied. |
| `family` | Planned, blocked pending sharing rules | Evidence may belong to one explicit family only after inheritance, membership, and benefit rules are defined. |
| `account` | Planned, blocked pending sharing rules | Evidence may belong to one explicit account only after account-wide knowledge policy is defined. |
| `settlement` | Deferred | May be considered only if a later civic or institutional knowledge plan defines who can consume settlement-owned evidence. |
| `faction` | Deferred | May be considered only after a canonical faction authority and membership/benefit rules exist. |

Rules:

- `ownerId` is required and must resolve through the authority for `ownerScope`.
- Character evidence does not fall back to family or account evidence.
- Family evidence does not fall back to account evidence.
- Account or family sharing requires explicit later rules and must not be inferred.
- Settlement or faction context does not make the settlement or faction a beneficiary.
- No custom owner scope is approved.
- No persistence model or owner mutation is implemented in this pass.

The broad registry's current `defaultEvidenceOwnerScopes` field contains both beneficiary-like values and source/context roles such as teachers, events, regions, and item instances. This plan does not edit that field. A later evidence schema plan must distinguish beneficiary `ownerScope` from source and acquisition-context roles rather than copying the registry list directly into an owner enum.

## 6. Source Route Model

The initial evidence `sourceType` vocabulary should be derived from the live snippet schema:

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

Relationship rules:

- Evidence `sourceType` must equal one of the referenced snippet's declared `discoverySources[].sourceType` values.
- Domain support is already enforced for authored snippets and should also be checked when evidence is validated.
- Evidence must not select a source type merely because the broad domain supports it; the specific snippet must declare it.
- `sourceId` remains `null` until a source-type authority plan defines the id namespace, collection, and semantic relationship.
- A non-null `sourceId` must be rejected until its exact source type is authorized.
- `custom` remains blocked until a dedicated source authority and validation plan approves it.

Future source-authority work must separately govern:

- field and combat observations
- travel observations
- resource and crafting uses
- books, scrolls, and tomes
- teachers and institutions
- quest outcomes
- Chronicle records

Access, possession, proximity, membership, visibility, or event existence is insufficient. An explicitly authorized producer must create evidence from a validated occurrence.

## 7. Acquisition Context

`acquisitionContext` is structured metadata describing where and how the evidence-producing occurrence happened. It supports validation and auditability but is not evidence authority by itself.

Candidate fields for later schema planning:

| Context group | Candidate fields | Boundary |
| --- | --- | --- |
| Location | `continentId`, `regionId`, `settlementId`, `biomeTags` | Known location alone does not create evidence. |
| Runtime occurrence | `eventId`, `eventType`, `actionId`, `encounterId` | Allowed only after the relevant event/action authority is explicit. |
| Practical use | `itemInstanceId`, `recipeId`, `productionActionId`, `resourceNodeId` | Possession or recipe visibility is insufficient. |
| Study material | `documentInstanceId`, `bookId`, `scrollInstanceId`, `tomeInstanceId` | Access or ownership is insufficient without an authorized study occurrence. |
| Instruction | `teacherId`, `institutionId`, `instructionEventId` | Hiring, membership, or proximity is insufficient. |
| Quest/Chronicle | `questOutcomeId`, `chronicleRecordId` | Quest acceptance or Chronicle visibility is insufficient. |
| Magic/action support | `spellId`, `skillId`, `actionResultId` | Known spell ownership or skill rank is insufficient. |
| Observation quality | `qualityBand`, `difficultyBand`, or later check result | Deferred until a progress plan defines whether and how it matters. |

Context rules:

- Context fields must be source-type compatible.
- Every non-null context reference must resolve through an explicitly selected authority.
- Context must not be a free-form object used to bypass source validation.
- Being in a location does not auto-create evidence.
- Owning an item or document does not auto-create evidence.
- Knowing a spell does not auto-create evidence.
- Having a skill rank does not auto-create evidence.
- Completing or viewing an event does not create evidence unless that event owner is explicitly authorized to produce it.

The later schema plan should choose narrow source-specific context variants rather than one permissive bag of optional references.

## 8. Relationship To Authored Snippets

Future evidence validation must enforce:

- `snippetId` resolves to one authored snippet.
- `domainId` equals the referenced snippet's `domainId`.
- `subjectType` equals the referenced snippet's `subjectType`.
- `subjectId` equals the referenced snippet's `subjectId`.
- `sourceType` matches at least one discovery source declared by the referenced snippet.
- Any later non-null `sourceId` is compatible with the matching declaration and its source authority.
- Acquisition location, when present, is compatible with any applicable authored location scope.
- Evidence does not modify, replace, append to, or normalize authored snippet definitions.
- Evidence never appears in `packages/content/base/player/knowledge_snippets.json`.
- Authored snippets never contain evidence ids, owner ids, acquired times, current progress, or current completion.

Derived evidence that targets a different domain, subject, or snippet is not approved. A later dedicated plan must define derivation and provenance before one occurrence can produce evidence for multiple snippets.

## 9. Relationship To Progress And Completion

Evidence can be an input to future progress calculations. It is not progress or completion by itself.

Future progress planning must decide:

- how many evidence records are required
- whether repeated evidence can contribute
- whether evidence from different source types stacks
- whether evidence quality or difficulty matters
- whether progress decays
- whether owner-scope sharing is permitted
- how snippet `completionWeight` and `countsTowardTierCompletion` are consumed
- how `trialUnlockWeight` interacts with trial readiness
- how prerequisites affect eligibility

Multiple evidence records may be required for one snippet. One evidence record may be valid proof without being sufficient for discovery or completion.

This plan defines no thresholds, percentages, stacking formula, repeatability rule, decay rule, tier math, trial unlock formula, or completion helper.

## 10. Validation Ownership Plan

Future validation should be layered:

| Layer | Future responsibility |
| --- | --- |
| Evidence schema | Exact wrapper, field types, required/nullable fields, id patterns, owner-scope vocabulary, source vocabulary, and strict additional-property rules. |
| Evidence semantic validator | Snippet/domain/subject equality, source-route compatibility, owner authority, context authority, source-id authority, and no-orphan checks. |
| Producer validation | Confirm the runtime event, action, study, instruction, quest outcome, or Chronicle record is authorized to propose evidence. |
| Progress consumer validation | Decide whether valid evidence is eligible, repeated, already consumed, shared, or weighted. This remains outside evidence structural validity. |

Required later checks:

- unique `evidenceId`
- no orphan `snippetId`
- domain and subject fields match the referenced snippet
- `sourceType` is declared by the snippet
- owner scope is approved and `ownerId` resolves
- no unknown source ids once source authorities exist
- context references resolve and are source-compatible
- no evidence fields appear in authored snippet content
- no progress, completion, trial, or UI fields appear in evidence records

Duplicate policy has two distinct layers:

- Duplicate identity: two records may not share one `evidenceId`.
- Duplicate credit: whether two distinct records describe the same occurrence or may both contribute is deferred to source-specific and progress rules.

Validation must fail closed. It must not fabricate missing owner, source, context, domain, subject, sequence, or authority data.

No schema or validator is implemented in this run.

## 11. Initial Evidence Examples

The following examples are illustrative only. They are not authoritative schema drafts and must not be added to content or runtime state in this pass.

### Aloe Field Identification

```json
{
  "evidenceId": "knowledge_evidence.example.aloe_field_001",
  "snippetId": "knowledge_snippet.flora.aloe.identification",
  "domainId": "knowledge_domain.flora",
  "subjectType": "flora",
  "subjectId": "flora.aloe",
  "sourceType": "field_identification",
  "sourceId": null,
  "ownerScope": "character",
  "ownerId": "character.example",
  "acquiredSequence": 101,
  "acquisitionContext": {
    "eventId": "field_observation.example_101",
    "regionId": "region.example_subregion"
  }
}
```

### Badger Field Identification

```json
{
  "evidenceId": "knowledge_evidence.example.badger_field_001",
  "snippetId": "knowledge_snippet.fauna.badger.identification",
  "domainId": "knowledge_domain.fauna",
  "subjectType": "fauna",
  "subjectId": "fauna.badger",
  "sourceType": "field_identification",
  "sourceId": null,
  "ownerScope": "character",
  "ownerId": "character.example",
  "acquiredSequence": 102,
  "acquisitionContext": {
    "eventId": "field_observation.example_102",
    "biomeTags": ["tidal_flat"]
  }
}
```

### Iron Ore Field Identification

```json
{
  "evidenceId": "knowledge_evidence.example.iron_ore_field_001",
  "snippetId": "knowledge_snippet.minerals.iron_ore.identification",
  "domainId": "knowledge_domain.minerals",
  "subjectType": "mineral",
  "subjectId": "mineral.iron_ore",
  "sourceType": "field_identification",
  "sourceId": null,
  "ownerScope": "character",
  "ownerId": "character.example",
  "acquiredSequence": 103,
  "acquisitionContext": {
    "eventId": "field_observation.example_103",
    "resourceNodeId": "resource_node.example_iron_ore"
  }
}
```

### Kaelvar Travel Observation

```json
{
  "evidenceId": "knowledge_evidence.example.kaelvar_travel_001",
  "snippetId": "knowledge_snippet.general_lore.kaelvar.cultural_context",
  "domainId": "knowledge_domain.general_lore",
  "subjectType": "region",
  "subjectId": "region.kaelvar",
  "sourceType": "travel_observation",
  "sourceId": null,
  "ownerScope": "character",
  "ownerId": "character.example",
  "acquiredSequence": 104,
  "acquisitionContext": {
    "eventId": "travel_event.example_104",
    "continentId": "region.kaelvar"
  }
}
```

Placeholder ids such as `character.example`, `eventId`, `resourceNodeId`, and `region.example_subregion` have no approved authority here. They demonstrate intended categories only.

## 12. Boundary Rules

- Discovery source declarations are not evidence.
- Evidence is not progress state.
- Evidence is not completion state.
- Evidence is not trial state.
- Evidence is not ownership of knowledge.
- Evidence validity does not guarantee progress credit.
- Skill rank does not auto-create evidence.
- Broad-registry `relatedSkillIds` do not create evidence.
- Known spells do not create Arcane Lore evidence.
- Item or document possession does not create study evidence.
- Location presence or map visibility does not create travel evidence.
- Quest visibility, acceptance, or generic completion does not create quest evidence.
- Chronicle visibility does not create Chronicle evidence.
- Runtime events must be explicitly authorized before they can propose or produce evidence.
- UI actions and presentation state never create evidence.
- Validation reads evidence but does not mutate knowledge state.

## 13. Future Implementation Sequence

Recommended order:

1. `Version 0.5.121 - Knowledge Evidence Contract Plan`
2. `Version 0.5.122 - Knowledge Evidence Schema Plan`
3. `Version 0.5.123 - Knowledge Evidence Schema`
4. `0.5.x - Knowledge Progress State Plan`
5. `0.5.x - Knowledge Progress State Schema`
6. `0.5.x - Knowledge Evidence-to-Progress Rules Plan`
7. `0.5.x - Knowledge Trials Plan`
8. `0.5.x - Knowledge UI Plan`

The schema plan must settle exact fields, wrapper shape, id patterns, owner vocabulary, context variants, and validation ownership before a schema file is created.

Evidence state, producers, persistence, progress consumers, trials, and UI remain later separate runs.

## 14. Risks And Deferred Work

- Owner-scope sharing can create ambiguous benefit and inheritance behavior if character, family, and account evidence are mixed.
- The current registry `defaultEvidenceOwnerScopes` vocabulary mixes potential beneficiaries with source/context roles and needs a later ownership decision.
- Source-id authorities are largely undefined.
- Runtime event and action authorities that may produce evidence are undefined.
- Duplicate and repeat evidence rules are deferred.
- Evidence quality, confidence, difficulty, and weight behavior are deferred.
- Progress and completion math are deferred.
- Evidence persistence, save shape, and any save migration are deferred.
- UI display, hidden-state, and provenance presentation semantics are deferred.
- Arcane Lore snippets remain blocked while `knowledge_domain.arcane_lore` is `planned`.
- Family and account sharing remain blocked until explicit rules exist.

## 15. Non-Goals And Forbidden Changes

This plan includes:

- no evidence schema
- no evidence JSON or content
- no evidence state
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
- no registry content edits
- no skill or spell edits
- no item, spell, or skill ownership changes
- no settlement, map, travel, or economy implementation
- no source-authority implementation
- no evidence validator implementation
- no unrelated cleanup
