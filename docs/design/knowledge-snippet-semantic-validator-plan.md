# Knowledge Snippet Semantic Validator Plan

Source version/run: Version 0.5.119 - Knowledge Snippet Semantic Validator Plan
Date: 2026-06-07
Status: planning-only validator design

## 1. Purpose And Status

This document defines the exact future content-lint ownership, schema-first flow, semantic checks, focused tests, and acceptance criteria for authored knowledge snippets.

This run implements no validator code, tests, snippet content, schema files, registry content, skills, runtime loaders, database or persistence behavior, UI, generated output, evidence or progress state, completion math, trials, Chronicle or Renown events, or ownership behavior.

The intended implementation target is a later narrow run. This plan is the active temporary guardrail for that run and should be retained through `Version 0.5.120 - Knowledge Snippet Semantic Validator`. At the end of that implementation, decide explicitly whether to retain it, promote durable rules into an authority document, consolidate it with the authoring plan, or remove it as consumed.

## 2. Current State Recap

The current repository already contains:

- The hardened authored-record schema at `packages/schemas/player/knowledge_snippet.schema.json`.
- The first authored catalog at `packages/content/base/player/knowledge_snippets.json`.
- The broad domain registry at `packages/content/base/player/knowledge_domain_registry.json`.
- The existing broad-registry semantic validator at `tools/content-lint/knowledge-domain-registry.mjs`.

The current snippet catalog contains four Tier 1 records. Normal `npm.cmd run tool:content-lint` does not yet structurally or semantically validate `knowledge_snippets.json`, so that file is not currently part of the normal checked-file count.

Runtime loading of authored snippets remains deferred. The repository also contains a separate import of `apps/rpg-ui/src/styles/main-menu-refinement.css` from `apps/rpg-ui/src/main.tsx`; that main-menu work is outside this knowledge-snippet run and must remain untouched.

## 3. Validation Ownership Decision

Future snippet validation ownership is:

| Concern | Owner |
| --- | --- |
| Content-lint orchestration, dependency loading, and checked-file registration | `tools/content-lint/index.mjs` |
| Optional pure snippet validation helper | `tools/content-lint/knowledge-snippets.mjs` |
| Authored record structure | `packages/schemas/player/knowledge_snippet.schema.json` |
| Domain compatibility metadata | `packages/content/base/player/knowledge_domain_registry.json` |
| Canonical subject identities | The subject authority files listed in Section 7 |
| Runtime discovery, evidence, progress, completion, trials, and ownership | Deferred; not content-lint responsibility |

`tools/content-lint/index.mjs` should remain the executable owner. A dedicated pure helper is preferred because prerequisite graph checks and focused mutation tests should not depend on invoking the entire CLI.

The existing registry validator's schema adapter is intentionally narrow and does not cover every keyword used by the live snippet schema, including `description`, `minimum`, and `maximum`. The snippet validator should therefore use a snippet-scoped, fail-closed structural adapter that supports the exact live snippet-schema keyword set. It must reject unsupported schema keywords rather than silently ignoring them. This does not authorize a general schema framework, a production dependency, or changes to the registry helper.

This pass plans that future behavior only.

## 4. Future Lint Entrypoint Plan

The optional helper should expose one pure entrypoint such as:

```js
validateKnowledgeSnippets({
  relativePath,
  wrapper,
  records,
  snippetSchema,
  registryRecords,
  subjectAuthorities,
  locationAuthorities,
  skillRecords,
  availableContentCollectionIds,
})
```

Inputs:

- `relativePath`: stable path text for actionable errors.
- `wrapper`: the parsed top-level snippet document.
- `records`: `wrapper.records`, supplied only after the exact wrapper gate passes.
- `snippetSchema`: the hardened record schema.
- `registryRecords`: parsed broad knowledge-domain records.
- `subjectAuthorities`: typed lookup maps for the approved initial subject types.
- `locationAuthorities`: region and settlement lookup maps available for discovery scopes.
- `skillRecords`: current records from `packages/content/base/player/skills.json`.
- `availableContentCollectionIds`: current base-content collection ids when needed to verify registry collection ownership.

Future orchestration in `tools/content-lint/index.mjs` should:

1. Parse the snippet wrapper and all required dependency files.
2. Require the exact top-level `records` wrapper before reading records.
3. Validate every snippet structurally against the hardened schema.
4. Stop snippet validation if the wrapper or any record is structurally invalid.
5. Load and index broad registry records, approved subject authorities, location authorities, and skills.
6. Run pure semantic validation.
7. Register `player/knowledge_snippets.json` in the normal lint checks so the checked-file count increments by one. With the current 54-file baseline, the expected immediate result is 55 checked files.

Errors should include the relative path plus the relevant record id, record index, field, and offending value when available.

## 5. Structural And Wrapper Checks

The future validator must enforce:

- The top-level value is a non-array object.
- The wrapper has exactly one key: `records`.
- `records` is a non-empty array.
- Every record passes `packages/schemas/player/knowledge_snippet.schema.json`.
- Snippet ids are unique across the catalog.
- Semantic checks do not run against a structurally invalid catalog.
- Runtime or player-state fields are not allowed.

The structural gate should enforce the live schema exactly, including strict `additionalProperties: false`, required fields, identifier patterns, enums, string lengths, array constraints, finite numeric values, and numeric minimums.

The schema owns record shape. The semantic helper must not reimplement every structural rule as an unrelated second schema.

## 6. Domain Checks

For every snippet:

- `domainId` must resolve to the broad registry.
- New authored snippets may reference only domains whose broad-registry status is `active`.
- Planned domains are rejected for live snippet content. This includes `knowledge_domain.arcane_lore`.
- `subjectType` must appear in the domain's `canonicalSubjectTypes`.
- `category` must appear in the domain's `supportedSnippetCategories`.
- Every discovery source `sourceType` must appear in the domain's `supportedDiscoverySourceTypes`.
- Where a subject authority collection exists, the domain's `relatedContentCollections` must include that collection id.

The initial subject-to-collection compatibility map is:

| Subject type | Required domain collection |
| --- | --- |
| `flora` | `world.flora` |
| `fauna` | `world.fauna` |
| `mineral` | `world.minerals` |
| `region` | `world.regions` |

If `availableContentCollectionIds` is supplied, each mapped collection must also be a current base-content collection id.

Broad-registry `relatedSkillIds` remain relationship metadata only. They do not grant a snippet, discovery evidence, progress, completion, a trial result, or ownership.

## 7. Subject Authority Checks

The first validator should use this explicit authority map:

| Subject type | Authority | Expected id prefix | Initial posture |
| --- | --- | --- | --- |
| `flora` | `packages/content/base/world/flora.json` | `flora.` | Allowed |
| `fauna` | `packages/content/base/world/fauna.json` | `fauna.` | Allowed |
| `mineral` | `packages/content/base/world/minerals.json` | `mineral.` | Allowed |
| `region` | `packages/content/base/world/regions.json` | `region.` | Allowed |
| `settlement` | Future settlement authority plan | `settlement.` | Deferred from first seed |
| `spell` | Future spell authority plan | `spell.` | Deferred from first seed |
| `item` | Future item authority plan | `item.` | Deferred from first seed |
| `culture` | No single selected authority | Undecided | Blocked |
| `institution` | No single selected authority | Undecided | Blocked |
| `ruin` | No single selected authority | Undecided | Blocked |
| `historical_event` | No single selected authority | Undecided | Blocked |
| `custom` | No approved custom contract | Undecided | Blocked |

Checks:

- `subjectId` must resolve in the selected authority for its `subjectType`.
- The subject id prefix must match the subject type's expected prefix.
- Unresolved subject ids are errors.
- Deferred and blocked subject types are errors in the first validator.
- A subject's authority collection must match the collection used for the domain compatibility check.

The existence of current settlement, spell, or item files does not authorize those subject mappings in this first validator. Their exact identity and collection contracts remain separate future decisions.

## 8. Discovery Source Checks

For every snippet:

- `discoverySources` must be non-empty.
- Exact duplicate discovery source declarations are errors.
- `sourceType` must be supported by the snippet's active domain.
- `sourceId` must remain `null` until a source authority mapping is explicitly planned.
- Any non-null `sourceId` is rejected by the first validator.
- `locationScope`, when present, may use only known ids for which a current authority exists.
- `biomeTags` remain schema-valid slugs.

Duplicate discovery sources should be detected by a deterministic deep-value key over the declared fields, not by object identity.

Initial location authority:

- `continentId` must resolve in `packages/content/base/world/regions.json` to a record whose current `regionType` is `continent`.
- `regionId` must resolve in `packages/content/base/world/regions.json` to a record whose current `regionType` is `subregion`.
- `settlementId` may resolve in `packages/content/base/world/settlements.json` when that authority is loaded for location scopes.
- A non-null unknown location id is an error.
- Cross-field geographic hierarchy validation is deferred unless a later plan selects an authoritative relationship contract.

Discovery source metadata means only that a route may be capable of producing future evidence. It does not itself create evidence, discovery, progress, completion, trial state, or ownership.

## 9. Progression And Visibility Checks

The schema requires `completionWeight`, `countsTowardTierCompletion`, and `trialUnlockWeight`. They remain inert authored metadata.

Semantic checks should confirm:

- `completionWeight` is a finite non-negative number.
- `trialUnlockWeight` is a finite non-negative number.
- `hiddenSummary` is non-null and non-empty when `lockedUntilDiscovered` is `true`.
- `revealsSubjectIdentity` does not create discovery or ownership.

No authored field may represent:

- current evidence or current progress
- current completion or trial state
- unlock or discovery time
- current owner
- account, family, character, save, or session state
- UI state

Strict schema validation should reject undeclared state fields. The focused tests must preserve this boundary explicitly.

## 10. Prerequisite Checks

When `prerequisites` is present:

- Every prerequisite snippet id must resolve within the same snippet catalog.
- Every prerequisite skill id must resolve in `packages/content/base/player/skills.json`.
- Multiple skill-rank entries must not repeat the same skill id, including repeats with conflicting ranks.
- A snippet may not reference itself.
- The snippet prerequisite graph must be acyclic.
- An empty prerequisites object is an error; authors should omit `prerequisites` when none are needed.

The graph check should run only after all prerequisite snippet ids resolve. It should report at least one actionable cycle path or the records participating in the cycle.

The current four seed records are expected to omit prerequisites.

## 11. Custom And Blocked-Value Posture

For the first validator:

- `custom` subject types, categories, and source types are blocked.
- `custom` is not a validation bypass.
- Arcane Lore snippets are blocked while `knowledge_domain.arcane_lore` remains `planned`.
- General Lore may not be used to bypass a missing specific-domain or subject-authority design.
- A snippet requiring culture, institution, ruin, historical-event, settlement, spell, item, or custom authority must wait for the corresponding focused authority plan.

This posture is current-data only. A later dedicated plan may authorize a new type without adding backwards-compatibility aliases.

## 12. First Seed Acceptance Expectations

The validator must accept the current four records unchanged:

- `knowledge_snippet.flora.aloe.identification`
- `knowledge_snippet.fauna.badger.identification`
- `knowledge_snippet.minerals.iron_ore.identification`
- `knowledge_snippet.general_lore.kaelvar.cultural_context`

The accepted baseline includes:

- the exact `records` wrapper
- four active-domain snippets
- canonical Aloe, Badger, Iron Ore, and Kaelvar subject ids
- null `sourceId` values
- generic field and travel discovery routes
- no prerequisites
- no Arcane Lore snippets

## 13. Focused Test Plan

Create `tests/unit/knowledge-snippets-validation.test.mjs` with fixture cloning and one focused mutation per negative case.

Positive tests:

- accepts the current four-record snippet catalog
- accepts active Flora/Fauna/Minerals/General Lore domains
- accepts current canonical subject ids
- accepts null `sourceId`
- accepts no prerequisites
- keeps `npm.cmd run tool:content-lint` passing

Negative tests:

- rejects missing `records` wrapper
- rejects extra top-level wrapper keys
- rejects empty `records`
- rejects structurally invalid record
- rejects duplicate snippet ids
- rejects unresolved `domainId`
- rejects planned `domainId`, including `knowledge_domain.arcane_lore`
- rejects `subjectType` not supported by domain
- rejects category not supported by domain
- rejects `sourceType` not supported by domain
- rejects unresolved `subjectId`
- rejects blocked subject types without authority
- rejects non-null `sourceId`
- rejects duplicate discovery source declarations
- rejects `lockedUntilDiscovered` true without `hiddenSummary`
- rejects prerequisite snippet self-reference
- rejects prerequisite snippet cycle
- rejects unresolved prerequisite snippet id
- rejects unresolved prerequisite skill id
- rejects duplicate/conflicting prerequisite skill ranks
- rejects empty prerequisites object
- rejects custom subject/category/source values
- rejects runtime/player-state fields

The implementation run should also preserve:

- `node --test tests/unit/schema-files.test.mjs`
- `node --test tests/unit/knowledge-domain-registry-validation.test.mjs`

## 14. Acceptance Criteria

The future implementation is accepted only when:

- The current four-record snippet catalog passes unchanged.
- All focused positive and negative tests pass.
- `npm.cmd run tool:content-lint` includes `knowledge_snippets.json` in its checked-file count.
- No snippet content changes are bundled with validator implementation.
- No schema changes are bundled unless separately authorized.
- No runtime behavior changes.
- No evidence, progress, completion, trial, UI, or persistence behavior changes.
- No generated output is refreshed incidentally.
- Error output identifies the affected file and record or field.
- Structural failure prevents semantic validation of the invalid catalog.

## 15. Future Implementation Sequence

Recommended order:

1. `Version 0.5.119 - Knowledge Snippet Semantic Validator Plan`
2. `Version 0.5.120 - Knowledge Snippet Semantic Validator`
3. `0.5.x - Knowledge Evidence Contract Plan`
4. `0.5.x - Knowledge Progress State Plan`
5. `0.5.x - Knowledge Trial Plan`
6. `0.5.x - Knowledge UI Plan`

Evidence must be designed before progress state. Progress state must be designed before trial or UI behavior. None of those later plans are authorized by validator implementation.

## 16. Non-Goals And Forbidden Changes

This planning run includes:

- no validator code
- no test implementation
- no snippet JSON edits
- no schema edits
- no registry content edits
- no skill edits
- no runtime loaders
- no database or persistence changes
- no generated output
- no UI
- no main-menu work
- no save, account, or session state
- no evidence or progress state
- no completion math
- no trials
- no Chronicle or Renown events
- no item, spell, or skill ownership changes
- no settlement, map, travel, or economy implementation
- no unrelated cleanup

The future validator implementation remains content validation only. It must not be treated as permission to load snippets at runtime or make authored metadata effectful.
