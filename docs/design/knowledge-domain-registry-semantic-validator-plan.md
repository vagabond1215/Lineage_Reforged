# Knowledge Domain Registry Semantic Validator Plan

Source version/run: Version 0.5.112 - Knowledge Domain Registry Semantic Validator Plan
Date: 2026-06-06
Status: planning-only semantic validation design; no validator, schema, content, runtime, persistence, UI, or generated-output implementation

## 1. Purpose And Status

This document defines the exact future content-lint ownership, semantic checks, focused tests, and acceptance criteria for the broad knowledge-domain registry.

This pass does not implement or change:

- validator code
- schema files
- content JSON
- legacy knowledge-domain identification policy
- skills or spells
- runtime loaders or gameplay behavior
- database or persistence behavior
- UI or generated output
- snippets
- evidence or progress state
- completion math
- trials
- Chronicle or Renown events
- item, spell, skill, or knowledge ownership

## 2. Current State

The broad structural schema exists at:

- `packages/schemas/player/knowledge-domain-registry.schema.json`

The broad authored seed catalog exists at:

- `packages/content/base/player/knowledge_domain_registry.json`

The narrow legacy identification-policy shape remains separate:

- `packages/schemas/player/knowledge-domain.schema.json`
- `packages/content/base/player/knowledge_domains.json`
- `KnowledgeDomainRecord`
- the existing `loadKnowledgeDomainContent()` runtime behavior

The broad registry is not runtime-loaded. It is also not registered with `tools/content-lint/index.mjs`, so its cross-field and cross-file semantics are not currently enforced.

The current snippet vocabulary authority is:

- `packages/schemas/player/knowledge_snippet.schema.json`

## 3. Validation Ownership Decision

| Concern | Future owner |
| --- | --- |
| Record structure, required fields, primitive types, enums, patterns, uniqueness within arrays, nullable policy-reference shapes, and rejection of unknown record fields | `packages/schemas/player/knowledge-domain-registry.schema.json` |
| Exact wrapper, semantic relationships, cross-file references, subset rules, custom-use notes, and skill-domain authority | `tools/content-lint/index.mjs` |
| Focused mutation tests for semantic failures | `tests/unit/knowledge-domain-registry-validation.test.mjs` |
| End-to-end repository confirmation | `npm.cmd run tool:content-lint` |

`tools/content-lint/index.mjs` remains the integration owner. It should load the registry and its dependencies, run the structural gate, derive reference sets and schema vocabularies, invoke the semantic validation unit, and include the registry in normal lint output.

For focused tests, the implementation may extract a pure, I/O-free helper to `tools/content-lint/knowledge-domain-registry.mjs`. That helper is a test seam only; `index.mjs` remains the executable owner and caller.

The repository currently has no declared JSON Schema execution dependency. The first implementation should not add one. It should load the live registry schema and use a narrow, fail-closed structural adapter for the schema keywords this record contract uses:

- `type`
- `required`
- `additionalProperties`
- `properties`
- `pattern`
- `enum`
- `minLength`
- `minItems`
- `uniqueItems`
- `items`
- `oneOf`

The adapter must read constraints from the live schema, reject unsupported keywords rather than ignoring them, and remain scoped to this registry contract. It must not grow into a general repository schema framework during the semantic-validator run. Semantic checks must not run against a record that failed this structural gate.

This version plans that behavior only.

## 4. Future Lint Entrypoint

The recommended pure unit is:

```js
validateKnowledgeDomainRegistry({
  relativePath,
  wrapper,
  records,
  legacyPolicyRecords,
  skills,
  availableBaseCollectionIds,
  snippetVocabularies
})
```

Required inputs:

- `relativePath`: registry path for actionable errors
- `wrapper`: parsed broad registry content
- `records`: structurally valid broad registry records
- `legacyPolicyRecords`: records from `packages/content/base/player/knowledge_domains.json`
- `skills`: records from `packages/content/base/player/skills.json`
- `availableBaseCollectionIds`: a set derived from canonical JSON files under `packages/content/base`
- `snippetVocabularies.subjectTypes`: derived from `knowledge_snippet.schema.json`
- `snippetVocabularies.categories`: derived from `knowledge_snippet.schema.json`
- `snippetVocabularies.sourceTypes`: derived from `knowledge_snippet.schema.json`

The source-family mapping remains a validator-owned constant because the snippet schema has source types but does not define source families.

The `index.mjs` orchestration order should be:

1. Parse the wrapper and dependencies.
2. Require the wrapper to contain exactly one top-level key, `records`.
3. Require `records` to be a non-empty array.
4. Validate every record through the narrow adapter driven by `knowledge-domain-registry.schema.json`.
5. Derive snippet vocabularies, skill maps, legacy ids, and base-content collection ids.
6. Call `validateKnowledgeDomainRegistry(...)`.
7. Use the broad registry id set for existing `skills[].knowledgeDomainId` checks.

## 5. Exact Semantic Checks

### Wrapper And Structural Gate

- The top level must be an object with exactly one key: `records`.
- `records` must be an array.
- `records` must not be empty.
- Every record must pass the broad registry record schema before semantic checks run.
- A structural failure stops semantic validation for that record and reports the structural error.

### Identity

- Domain ids must be unique.
- Slugs must be unique.
- Each `id` must equal `knowledge_domain.${slug}`.
- The first validator must not enforce alphabetic or other record ordering. The approved seed order is authored, deterministic source data, and no durable repository-wide ordering policy currently requires a different sort.

### Source Families

- Every `supportedDiscoverySourceTypes` value must map to a declared `supportedDiscoverySourceFamilies` value.
- Every declared source family must have at least one matching source type.
- The first implementation has no empty-family exceptions. A future exception requires a dedicated plan and focused test.
- `custom` source family and `custom` source type must appear together.
- Any `custom` source family or type requires an explicit note as defined under Custom Usage.

### Skill And Magic-School References

- Every `relatedSkillIds` value must exist in `packages/content/base/player/skills.json`.
- Every `relatedMagicSchoolIds` value must exist in the same skill authority.
- Every magic-school id must match `skill.magic.school.*`.
- Every referenced magic-school record must have `category: "magic"`.
- Every referenced magic-school record must have a `domain` beginning with `school.`.
- A value must not appear in both `relatedSkillIds` and `relatedMagicSchoolIds`.
- Spell `school` slugs such as `elemental`, `control`, or `ranged` are not valid magic-school ids and must fail.

### Content Collections

Valid collection ids are derived by:

1. Recursively enumerate regular `.json` files under `packages/content/base`.
2. Take each path relative to `packages/content/base`.
3. Remove `.json`.
4. Replace path separators with `.`.

Validation rules:

- Every `relatedContentCollections` value must resolve to the derived set.
- Schemas, docs, directories, runtime modules, and files outside `packages/content/base` cannot enter the set.
- Generated, build, temporary, vendor, and dependency paths are not canonical collections and must be excluded if such paths ever appear under the base tree.
- `player.knowledge_domain_registry` must not self-reference.
- A collection reference remains authored metadata and creates no runtime loader.

### Policy References

- `trialPolicyRef`, `completionPolicyRef`, and `visibilityPolicyRef` may be `null`.
- Until corresponding canonical policy collections exist, every non-null policy reference is a hard lint error.
- All current Wave 0 records must therefore keep all three references `null`.
- A future policy implementation must provide an explicit authority and reference-resolution rule before non-null values are accepted.

### Custom Usage

The rule applies when `custom` appears in any of:

- `canonicalSubjectTypes`
- `supportedSnippetCategories`
- `supportedDiscoverySourceFamilies`
- `supportedDiscoverySourceTypes`
- `defaultEvidenceOwnerScopes`

Validation rules:

- At least one non-empty entry in `schemaGapNotes` or `notes` must explicitly contain the word `custom`, case-insensitively.
- General Lore's current constrained custom support is valid because its notes explicitly define the boundary.
- Other domains may use `custom` only when the same explicit justification rule is met.
- The validator must not hard-code General Lore as the only allowed custom domain.
- `custom` never bypasses enum, reference, source-family, or ownership checks.

### Legacy Identification-Policy Subset

- Every id in `packages/content/base/player/knowledge_domains.json` must exist in the broad registry.
- The legacy id set must be a subset of the broad registry id set.
- A broad registry record does not require a legacy identification-policy record.
- `knowledge_domain.arcane_lore` must be accepted without a legacy policy record.
- The validator must not create, infer, or require identification weights or thresholds for broad-only domains.

### Skill `knowledgeDomainId` Authority

- Existing `skills[].knowledgeDomainId` values must resolve against the broad registry, not only the legacy policy subset.
- An unknown broad registry id remains an error.
- Not every broad registry id must appear in a skill.
- `skill.knowledge.arcane_lore` must not be required to add `knowledgeDomainId` during validator implementation.
- Skill-link changes remain owned by the later Skill Knowledge Domain Reference Realignment pass.

### Ownership And Consistency

- Related skill references must resolve; missing references are errors.
- Broad records must not contain legacy policy fields:
  - `domain`
  - `knowledgeSkillId`
  - `spottingSkillId`
  - `identifySkillId`
  - `generalSupportSkillId`
  - `supportWeights`
  - `identifyDifficulty`
  - `autoIdentifyThresholds`
- The schema's `additionalProperties: false` is the primary structural protection for those fields. Focused tests should retain this ownership boundary.
- `wave` and `status` are authored rollout metadata only. The validator must not load, activate, hide, unlock, or grant anything based on them.
- `knowledge_domain.arcane_lore` with `status: "planned"` is valid.

## 6. Source-Family Mapping

The future validator must enforce this exact mapping in both directions:

| Family | Source types |
| --- | --- |
| `field_observation` | `field_identification`, `travel_observation`, `combat_observation` |
| `practical_use` | `resource_use`, `crafting_use` |
| `textual_study` | `book_study`, `scroll_study`, `tome_study` |
| `instruction` | `teacher_instruction`, `institutional_study` |
| `event_record` | `quest_event`, `chronicle_record` |
| `custom` | `custom` |

## 7. Focused Test Plan

Create `tests/unit/knowledge-domain-registry-validation.test.mjs` around a structurally valid clone of the current five-record registry. Each negative test should mutate one rule at a time.

Required positive tests:

- accepts the current five-record registry
- accepts General Lore's current explicitly constrained custom support
- accepts Arcane Lore as `planned`
- accepts Arcane Lore without a legacy identification-policy record
- allows a broad registry id without a legacy policy record
- allows broad registry ids that are not referenced by skills
- allows a structurally valid non-alphabetic authored record order
- keeps the full repository `tool:content-lint` command passing

Required negative tests:

- rejects a missing or non-array `records` wrapper
- rejects an empty `records` array
- rejects a record that fails the structural schema
- rejects duplicate ids
- rejects duplicate slugs
- rejects id/slug mismatch
- rejects a source type not covered by a declared family
- rejects a declared family with no matching source type
- rejects mismatched custom family/type declarations
- rejects unresolved `relatedSkillIds`
- rejects unresolved `relatedMagicSchoolIds`
- rejects a magic-school reference with the wrong id prefix
- rejects a referenced magic-school skill with the wrong category
- rejects a referenced magic-school skill whose domain does not begin with `school.`
- rejects a spell school slug in `relatedMagicSchoolIds`
- rejects overlap between related skill and magic-school arrays
- rejects unresolved `relatedContentCollections`
- rejects `player.knowledge_domain_registry` self-reference
- rejects non-null policy references while no policy authority exists
- rejects unjustified custom subject, category, source family, source type, or evidence-owner usage
- rejects a legacy policy id absent from the broad registry
- rejects a skill `knowledgeDomainId` absent from the broad registry
- rejects legacy identification-policy fields on a broad record through the structural gate

Tests should import the pure validation unit when extracted. The end-to-end lint command remains the integration test that proves `index.mjs` wiring and current-data compatibility.

## 8. Acceptance Criteria

The future semantic validator implementation is accepted only when:

1. Current repository content passes.
2. All focused negative tests fail for the intended reason.
3. `npm.cmd run tool:content-lint` includes the broad registry structural and semantic gates.
4. Existing `skills[].knowledgeDomainId` checks use broad registry ids.
5. Existing legacy policy ids are enforced as a broad-registry subset.
6. No runtime behavior changes.
7. No registry content or schema changes are bundled.
8. No skill-reference realignment is bundled.
9. No generated output is refreshed incidentally.
10. No new schema-validation dependency or general schema framework is introduced.
11. Focused tests, schema-file tests, content lint, conflict scans, trailing-whitespace scans, and `git diff --check` pass.

## 9. Future Implementation Sequence

1. Knowledge Domain Registry Semantic Validator Plan
2. Knowledge Domain Registry Semantic Validator
3. Skill Knowledge Domain Reference Realignment Plan
4. Skill Knowledge Domain Reference Realignment
5. Knowledge Snippet Content Authoring Plan
6. Knowledge Evidence Contract Plan
7. Knowledge Progress State Plan
8. Knowledge Trial Plan
9. Knowledge UI Plan

The next recommended run is `Version 0.5.113 - Knowledge Domain Registry Semantic Validator`.

This plan remains an active temporary guardrail until the validator implementation consumes it. At that point, the implementation run must decide whether to retain it as durable design authority or promote its remaining rules into the current handoff and remove it in a later cleanup pass.

## 10. Non-Goals And Forbidden Changes

This plan does not authorize:

- no validator code
- no content JSON edits
- no schema edits
- no legacy `knowledge_domains.json` edits
- no skills edits
- no spell edits
- no runtime loaders
- no database or persistence changes
- no generated output
- no UI
- no save, account, or session state
- no snippets
- no evidence or progress state
- no completion math
- no trials
- no Chronicle or Renown events
- no item, spell, or skill ownership changes
- no settlement, map, travel, or economy implementation
- no unrelated cleanup
