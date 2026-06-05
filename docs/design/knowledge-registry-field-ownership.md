# Knowledge Registry Field Ownership Table

Source route: ChatGPT via GitHub Connector
Date: 2026-06-05
Status: connector-only prep for `Version 0.5.107 - Knowledge Domain Registry Plan`; no source, schema, content JSON, UI, generated output, or runtime behavior changes

## Purpose

Define the planning boundary between fields owned by a future knowledge-domain registry, fields owned by snippets, fields owned by runtime state, UI presentation, validation, and external source/evidence systems.

This document is a planning aid. It does not create a registry, schema, runtime loader, save shape, or content records.

## Source Basis

Primary sources:

- `packages/schemas/player/knowledge_snippet.schema.json`
- `docs/design/knowledge-framework-source-map.md`
- `docs/design/knowledge-domain-backlog-normalization.md`
- `docs/design/knowledge-discovery-source-vocabulary.md`
- `docs/future_content_backlog.md`
- `docs/design/future-system-design-ledger.md`

## Ownership Categories

Use these ownership categories in the 0.5.107 registry plan.

| Owner | Meaning |
| --- | --- |
| `registry` | Stable authored metadata for a knowledge domain. Should be content-like and deterministic. |
| `snippet` | Authored detail for individual learnable knowledge fragments. |
| `runtime_state` | Character/account/family/session/save state that records discovery, progress, evidence, or completion. |
| `source_evidence` | Future evidence/event/source owner that can justify discovery or progress. |
| `validation` | Build/lint/schema rules that validate authored records but do not store gameplay state. |
| `presentation` | UI/display wording, ordering, grouping, and reveal treatment. |
| `deferred` | Useful concept, but should not be represented until a later scoped pass. |

## Registry-Owned Fields

Fields that belong in a future `knowledge_domains.json` or equivalent registry.

| Field | Owner | Purpose | Notes |
| --- | --- | --- | --- |
| `id` | registry | Stable canonical id, e.g. `knowledge_domain.flora`. | Required. Must not change casually. |
| `slug` | registry | Human/readable route-safe slug. | Usually derived from id but authored for clarity. |
| `name` | registry | Player/developer-facing domain name. | Required for content planning. |
| `summary` | registry | Short explanation of domain scope. | Should not contain completion state. |
| `group` | registry | Broad grouping such as `natural_world` or `magic_arcana`. | Based on backlog normalization. |
| `wave` | registry | Planning wave: 0, 1, 2, or 3. | Planning/content rollout metadata, not runtime progress. |
| `status` | registry | Planned state such as `active`, `planned`, `draft`, `deferred`. | Do not treat as runtime visibility by itself. |
| `canonicalSubjectTypes` | registry | Subject types normally allowed for snippets in this domain. | Should reference schema values or future planned values. |
| `supportedSnippetCategories` | registry | Categories normally allowed for snippets in this domain. | Should not define individual snippets. |
| `supportedDiscoverySourceFamilies` | registry | Allowed source families from source vocabulary. | Family-level policy. |
| `supportedDiscoverySourceTypes` | registry | Optional tighter source type list. | Use when a domain needs exact limits. |
| `defaultEvidenceOwnerScopes` | registry | Future owner scopes likely to justify discovery/progress. | Planning only until evidence state exists. |
| `relatedSkillIds` | registry | Skills that support discovery/study/checks. | Skills do not auto-complete knowledge. |
| `relatedMagicSchoolIds` | registry | Magic schools/traditions related to domain, if any. | Does not grant known-spell ownership. |
| `relatedContentCollections` | registry | Content areas that can provide subjects or references. | Examples: flora, regions, settlements, spells. |
| `trialPolicyRef` | registry | Future policy id for knowledge trials. | Reference only; do not implement trials here. |
| `completionPolicyRef` | registry | Future policy id for tier/domain completion math. | Reference only; no math in registry plan. |
| `visibilityPolicyRef` | registry | Future policy id for reveal/lock rules. | Reference only; UI and runtime behavior deferred. |
| `schemaGapNotes` | registry | Notes about subject/category/source gaps. | Planning aid; can be moved to docs later. |
| `notes` | registry | Design notes. | Should remain non-runtime commentary. |

## Snippet-Owned Fields

Fields that belong to individual knowledge snippets rather than the domain registry.

| Field | Owner | Purpose | Notes |
| --- | --- | --- | --- |
| `id` | snippet | Stable snippet id. | Distinct from domain id. |
| `domainId` | snippet | Links snippet to a domain. | Must reference registry when registry exists. |
| `subjectType` | snippet | What kind of content/entity the snippet is about. | Current schema enum owns allowed values. |
| `subjectId` | snippet | Specific subject reference. | Validation should eventually check if the referenced collection exists. |
| `tier` | snippet | Snippet tier. | Domain registry may define default tier count, but snippet owns actual tier. |
| `category` | snippet | Snippet type such as `identification` or `danger`. | Registry can restrict supported categories. |
| `title` | snippet | Snippet title. | Presentation can format it but snippet owns text. |
| `summary` | snippet | Learned text/summary. | Should not contain runtime completion state. |
| `prerequisites` | snippet | Authored unlock requirements. | Runtime decides whether current state satisfies them. |
| `discoverySources` | snippet | Authored possible source routes. | Source access does not imply completion. |
| `progression.completionWeight` | snippet | Authored contribution weight. | Does not perform completion math by itself. |
| `progression.countsTowardTierCompletion` | snippet | Authored whether it contributes. | Runtime/completion helper applies it later. |
| `progression.trialUnlockWeight` | snippet | Authored trial unlock contribution. | Trial behavior deferred. |
| `visibility.lockedUntilDiscovered` | snippet | Authored reveal hint. | UI/runtime reveal behavior deferred. |
| `visibility.revealsSubjectIdentity` | snippet | Authored reveal hint. | Does not identify subject until runtime rules exist. |
| `visibility.hiddenSummary` | snippet | Hidden-state presentation text. | Presentation consumes later. |
| `notes` | snippet | Authoring notes. | Non-runtime. |

## Runtime-State-Owned Fields

Fields that should not be authored in the registry or snippet content as current progress/state.

| Concept | Owner | Reason |
| --- | --- | --- |
| `discoveredSnippetIds` | runtime_state | Player/character/account discovery state. |
| `completedSnippetIds` | runtime_state | Completion is state, not authored registry data. |
| `domainCompletionPercent` | runtime_state | Derived from snippets and state. |
| `tierCompletionPercent` | runtime_state | Derived from snippets and state. |
| `unlockedKnowledgeTier` | runtime_state | Derived from progress/trials later. |
| `activeKnowledgeTrialIds` | runtime_state | Trial state deferred. |
| `completedKnowledgeTrialIds` | runtime_state | Trial state deferred. |
| `knowledgeEvidenceRefs` | runtime_state | Links to future evidence records. |
| `studyProgress` | runtime_state | Study event progress belongs to future study runtime. |
| `fieldObservationProgress` | runtime_state | Observation progress belongs to runtime/evidence state. |
| `teacherInstructionProgress` | runtime_state | Instruction progress belongs to future study/training state. |
| `institutionalStudyProgress` | runtime_state | Institutional study state belongs to future owner. |
| `chronicleLinkedKnowledge` | runtime_state | Chronicle links must be scoped and evidence-backed. |
| `regionKnowledgeVisibility` | runtime_state | Visibility state is runtime/presentation, not registry. |

## Source/Evidence-Owned Fields

These concepts should belong to future evidence/source records, not the domain registry itself.

| Concept | Owner | Notes |
| --- | --- | --- |
| `sourceRecordId` | source_evidence | Could reference quest event, travel event, study event, Chronicle record, item instance, or teacher. |
| `sourceOwnerScope` | source_evidence | Character/account/family/institution/region/etc. |
| `sourceOwnerId` | source_evidence | Specific owner id. |
| `observedAtLocation` | source_evidence | Event/location detail, not registry metadata. |
| `observedSubjectId` | source_evidence | May justify discovery for a specific snippet. |
| `studyMaterialInstanceId` | source_evidence | Item/document instance, not generic possession. |
| `teacherId` | source_evidence | Teacher source, not automatic completion. |
| `institutionId` | source_evidence | Institution source, not automatic completion. |
| `questOutcomeId` | source_evidence | Quest outcome can authorize evidence later. |
| `chronicleRecordId` | source_evidence | Chronicle record can be referenced later but must not fabricate history. |

## Validation-Owned Rules

Validation should protect boundaries without storing gameplay state.

| Rule | Owner | Notes |
| --- | --- | --- |
| domain id matches `knowledge_domain.<slug>` | validation | Future registry lint/schema. |
| no duplicate domain ids | validation | Registry validation. |
| wave is allowed | validation | 0, 1, 2, 3 unless plan changes. |
| group is allowed | validation | Use normalized group ids. |
| snippet domain id references known domain | validation | Once registry exists. |
| subject types are compatible with domain | validation | Domain policy to snippet validation. |
| categories are compatible with domain | validation | Domain policy to snippet validation. |
| source families/types are compatible with domain | validation | Source vocabulary to snippet validation. |
| related skill ids exist | validation | Skills can support checks; no auto-completion. |
| related content collections are known | validation | Prevent stale collection names. |
| custom source requires notes | validation | Avoid generic bypass. |
| custom subject/category requires notes | validation | Avoid schema escape-hatch sprawl. |
| no access-only source implies completion | validation | Boundary rule; may be docs/lint until runtime exists. |
| no registry fields store per-player progress | validation | Prevent authoring/runtime-state mixing. |

## Presentation-Owned Fields

UI should own display state and formatting, not registry truth or runtime progress.

| Concept | Owner | Notes |
| --- | --- | --- |
| display order | presentation | Can be derived from group/wave but UI may order differently later. |
| icon id | presentation or registry | If stable across UI surfaces, registry can own; otherwise presentation should. |
| color/theme | presentation | Not registry behavior. |
| collapsed/expanded state | presentation | Pure UI state. |
| hidden/locked copy rendering | presentation | Consumes authored visibility/runtime state later. |
| progress bar display | presentation | Displays runtime-derived progress; does not calculate ownership. |
| filters/search tags | presentation or registry | Stable taxonomy tags may be registry-owned; UI filters are presentation-owned. |

## Deferred Until Later

Do not place these in the 0.5.107 registry plan as implemented behavior.

- save/account/session knowledge state
- runtime loaders for knowledge registry or snippets
- completion math
- tier unlock helpers
- knowledge trial runtime
- study event runtime
- teacher/institution mechanics
- book/scroll/tome consumption or study mechanics
- Chronicle/Renown event creation
- quest reward knowledge grants
- UI implementation
- generated output
- schema migrations

## Recommended Registry Field Shape

A future registry record might use this planning shape:

```json
{
  "id": "knowledge_domain.flora",
  "slug": "flora",
  "name": "Flora",
  "summary": "Knowledge of plants, fungi, herbs, trees, and plant-derived materials.",
  "group": "natural_world",
  "wave": 0,
  "status": "planned",
  "canonicalSubjectTypes": ["flora", "item", "region"],
  "supportedSnippetCategories": ["identification", "habitat", "use", "danger", "seasonality"],
  "supportedDiscoverySourceFamilies": ["field_observation", "practical_use", "textual_study", "instruction"],
  "defaultEvidenceOwnerScopes": ["character", "study_event", "travel_event"],
  "relatedSkillIds": ["skill.resource.spotting.flora", "skill.resource.identify.flora"],
  "relatedContentCollections": ["flora", "habitats", "biomes", "regions"],
  "schemaGapNotes": []
}
```

This is not live content and should not be imported by runtime.

## Recommended 0.5.107 Use

Use this table as the source for the `Registry Ownership Model`, `Planned Registry Fields`, `Validation Rules`, and `Forbidden Until Explicitly Scoped` sections of:

- `docs/design/knowledge-domain-registry-plan.md`

## Recommended Next Connector Work

The next connector-only prep pass should be:

- `Knowledge Boundary Glossary`

Rationale: the registry field ownership table defines where fields belong, but Codex will still benefit from concise definitions that separate knowledge from skills, magic study, known-spell ownership, possession, Chronicle, reputation, and travel visibility.
