# Knowledge Storage Fixture Boundary Plan

Version: `Version 0.5.136 - Knowledge Storage Fixture Boundary Plan`

Status: planning authority only

Date: 2026-06-12

## 1. Purpose And Status

This plan defines the future test-only fixture boundary needed to exercise Knowledge accepted-evidence collections, progress collections, and storage acceptance scenarios before any production storage owner is selected.

This run is documentation only. It does not create fixture files, fixture loaders, fixture adapters, schemas, validators, storage, persistence, save/session/account fields, runtime state, UI, generated output, or gameplay behavior.

The planned fixture family exists to make later pure-helper and acceptance work reproducible. It is not permission to treat fixture data as authored content, persisted player state, or a runtime source.

## 2. Current Contract Recap

The current Knowledge foundation already provides:

- four active authored snippets for Aloe, Badger, Iron Ore, and Kaelvar;
- five broad Knowledge domain records, with Arcane Lore still planned-only for snippet use;
- strict record-level evidence and progress schemas;
- pure schema-first semantic validators for evidence and progress collections;
- a pure evidence-to-progress proposal helper that proposes deterministic `+1` deltas;
- a pure observation producer that emits candidate evidence only;
- a storage and persistence boundary plan that distinguishes candidate, accepted, rejected, and persisted evidence plus proposed and applied progress changes.

The current helpers operate on in-memory values. They do not read fixture paths, register with normal content lint, own canonical state, mutate progress, accept evidence, or persist anything.

The storage fixture boundary must preserve those contracts:

- candidates remain unaccepted proposals;
- accepted evidence is valid evidence that a future acceptance owner has admitted;
- progress records remain character-owned records for existing authored snippets;
- proposal output remains inert until a future application owner acts;
- persisted state remains undefined until an explicitly scoped production-storage decision.

## 3. Fixture Purpose

The future fixtures should provide deterministic test inputs for:

- individually valid accepted-evidence collections;
- individually valid progress collections;
- empty collection behavior;
- evidence awaiting progress consumption;
- evidence already consumed by one matching progress record;
- duplicate and replay rejection;
- owner, target, sequence, and source-context mismatch rejection;
- later progress initialization planning;
- later evidence acceptance planning;
- later storage acceptance tests that compose existing pure validators and helpers.

Fixtures should let focused tests express a complete scenario without constructing large object graphs inline. They should improve repeatability and reviewability while keeping all authority in the existing schemas, authored registries, authored snippets, and pure validators.

## 4. Fixture Non-Authority Boundary

Future Knowledge fixtures are test inputs only.

They must not become:

- production content;
- canonical authored Knowledge records;
- save, account, session, character, or runtime state;
- a source for normal content loading;
- a registry of valid evidence or progress identities;
- a generator input;
- a persistence format;
- a migration format;
- a compatibility layer;
- a substitute for current schemas or semantic validators;
- a source of UI or gameplay behavior.

Passing a fixture test proves only that the tested helper behavior is correct for that controlled input. It does not make the fixture canonical or persisted.

Tests must continue to obtain snippet, domain, region, settlement, skill, and spell authority from the live authored sources already used by the focused validators. A fixture may reference those authorities, but it must not redefine them.

## 5. Candidate Future Paths

The recommended planned-only path family is:

```text
tests/fixtures/knowledge/
```

Candidate future files are:

```text
tests/fixtures/knowledge/accepted-evidence.valid.json
tests/fixtures/knowledge/progress.valid.json
tests/fixtures/knowledge/storage-scenarios.json
```

These paths are recommendations for a later explicitly scoped implementation run. They do not exist as a result of this plan.

`packages/content/base/` is rejected because fixtures are not production content and must not enter content discovery, schema registration, or normal lint ownership.

A generated-output path is rejected because the scenarios should be small, reviewed source fixtures rather than derived artifacts. Generated placement would also blur source control, regeneration, and canonical-state boundaries.

Save, account, session, runtime, and application source paths are rejected because no production storage owner has been selected.

## 6. Fixture Wrapper Posture For Evidence And Progress

Each future fixture document should have a small test-only envelope with exactly:

- `fixtureCollectionId`;
- `fixtureVersion`;
- `records`.

The accepted-evidence document shape should be:

```json
{
  "fixtureCollectionId": "knowledge_fixture.accepted_evidence.valid",
  "fixtureVersion": 1,
  "records": []
}
```

The progress document shape should be:

```json
{
  "fixtureCollectionId": "knowledge_fixture.progress.valid",
  "fixtureVersion": 1,
  "records": []
}
```

Rules:

- `fixtureCollectionId` is a stable test-only identity and must not become a runtime collection id.
- `fixtureVersion` starts at integer `1` and versions the fixture document shape only.
- `records` contains exact evidence or progress records governed by the current record schemas.
- No fixture metadata may be copied into evidence records, progress records, saves, sessions, accounts, or runtime state.
- Empty `records` arrays are permitted where a named scenario explicitly tests empty-state behavior.
- Record order must be deterministic and should follow ascending `sequence`, then ascending record id when a tie must be represented.

The current evidence and progress semantic validators require the exact direct input wrapper `{ "records": [...] }`. A future focused test should therefore project only the fixture document's `records` field into a fresh `{ records }` object before invoking the existing helper. The helpers should not be broadened to understand fixture metadata, and no fixture loader or adapter is authorized by this plan.

## 7. Combined Scenario Shape

The future `storage-scenarios.json` document should use this test-only envelope:

```json
{
  "fixtureCollectionId": "knowledge_fixture.storage_scenarios",
  "fixtureVersion": 1,
  "scenarios": []
}
```

Each scenario should contain exactly:

- `scenarioId`;
- `description`;
- `authorityProfile`;
- `acceptedEvidence`;
- `progress`;
- `expected`.

Conceptual shape:

```json
{
  "scenarioId": "knowledge_storage.aloe.accepted_zero_progress",
  "description": "One accepted Aloe observation exists while progress remains explicitly uninitialized.",
  "authorityProfile": "current_authored_knowledge",
  "acceptedEvidence": {
    "fixtureCollectionId": "knowledge_fixture.accepted_evidence.aloe_one",
    "fixtureVersion": 1,
    "records": []
  },
  "progress": {
    "fixtureCollectionId": "knowledge_fixture.progress.empty",
    "fixtureVersion": 1,
    "records": []
  },
  "expected": {
    "evidenceValid": true,
    "progressValid": true,
    "proposalEligible": false,
    "accepted": true,
    "reason": "progress_initialization_required"
  }
}
```

The example is shape guidance, not fixture content and not a final expected-result vocabulary. A later implementation plan must freeze exact `expected` fields before creating the file.

`authorityProfile` is a test-harness selector for the current authored Knowledge authorities. It must not embed copied snippets, domains, regions, settlements, skills, spells, or production storage configuration.

Nested evidence and progress envelopes retain fixture identity for review. Focused tests must still project their `records` into the exact current validator wrappers.

## 8. Fixture Identity

Fixture document identities should:

- use the `knowledge_fixture.` prefix;
- be lowercase snake-case segments separated by dots;
- identify fixture purpose rather than a production owner;
- remain stable when record ordering or descriptive text changes;
- change only when the fixture's semantic role changes.

Scenario identities should:

- use the `knowledge_storage.` prefix;
- identify subject and condition;
- be unique within `storage-scenarios.json`;
- remain independent of test names and file-system order.

Evidence ids, progress ids, snippet ids, domain ids, owner ids, source ids, and context ids inside records must continue to follow their current schemas and semantic authorities. Fixture identities must never be substituted for those record identities.

## 9. Sequence Posture

Fixture documents do not own acquisition or application sequence.

Evidence and progress records must carry explicit sequence values governed by their existing contracts. Future scenarios should use small deterministic integers that make ordering and replay expectations obvious.

Required posture:

- no sequence is inferred from array order;
- no sequence is derived from timestamps;
- no sequence is allocated by fixture loading;
- duplicate sequence values are represented only when a negative scenario specifically tests them;
- scenario order does not imply evidence order;
- accepted-evidence sequence remains distinct from later persistence ordering;
- proposed progress sequence remains inert until a future application owner exists.

## 10. Owner Posture

Current evidence and progress fixtures must remain character-owned because the live schemas and validators currently support character ownership only.

Future fixtures must:

- use explicit owner type and owner id fields already required by each record schema;
- preserve exact owner parity between evidence and progress where a scenario expects eligibility;
- use mismatched owners only in named negative scenarios;
- avoid account, family, dynasty, settlement, institution, or global ownership;
- avoid implying that a fixture collection owns its records.

`fixtureCollectionId` and `scenarioId` are test identities, not gameplay owners.

## 11. Positive Scenarios

The first future fixture implementation should cover at least:

1. Empty accepted-evidence and empty progress collections both pass their current validators.
2. One accepted Aloe observation evidence record passes evidence validation while progress remains an explicit zero-state empty collection.
3. One accepted Aloe evidence record and one matching zero-point Aloe progress record with no consumed evidence both pass validation.
4. One accepted Aloe evidence record and one matching progress record that consumes that evidence pass validation.
5. Current Badger, Iron Ore, and Kaelvar records each pass in narrow independent scenarios using their valid current source/context posture.
6. Multiple valid accepted-evidence records sort deterministically by explicit sequence and id without deriving order from file placement.
7. Multiple valid progress records for distinct character/snippet targets pass without cross-consuming one evidence id.
8. A valid accepted evidence record that has not yet been consumed remains available to the current proposal helper once the required matching progress record exists.
9. Re-running a read-only scenario produces the same validation and proposal result without mutating fixture inputs.

The Aloe accepted-evidence plus empty-progress scenario is intentionally valid at the collection-validation layer. It demonstrates that accepted evidence may exist before a progress record is initialized. It must not silently create progress or claim proposal eligibility.

## 12. Negative Scenarios

The first future fixture implementation should cover at least:

1. Duplicate evidence ids in one accepted-evidence collection.
2. Duplicate progress identities for the same character and snippet target.
3. One evidence id consumed by more than one progress record.
4. Evidence and progress owner mismatch.
5. Evidence and progress snippet, domain, subject type, or subject id mismatch.
6. Evidence referencing an inactive or unknown snippet or broad domain.
7. Progress referencing an inactive or unknown snippet or broad domain.
8. Unsupported Arcane snippet usage while no active Arcane snippet exists.
9. Invalid evidence source/context combinations.
10. Invalid region or settlement authority references.
11. Candidate-only producer output treated as accepted without a future acceptance decision.
12. Replayed evidence proposed after its id is already consumed.
13. Sequence inferred from array position or duplicated where uniqueness is required by the tested rule.
14. Fixture metadata copied into a record or passed directly to an exact current validator wrapper.
15. Fixture collection or scenario identity used as a character owner or production storage identity.
16. A test that mutates fixture input while validating or proposing progress.

Negative scenarios should remain explicit named cases. Invalid records should not be mixed into the primary `*.valid.json` documents.

## 13. Current Validators

Future fixture tests must compose the current pure helpers rather than replace or broaden them:

- `validateKnowledgeEvidence(...)` for `{ records }` evidence inputs and current snippet/domain/region/settlement authorities;
- `validateKnowledgeProgress(...)` for `{ records }` progress inputs plus semantically valid evidence and current snippet/domain authorities;
- the current evidence-to-progress proposal helper for deterministic eligibility and `+1` proposal behavior;
- the current observation producer only when a test explicitly needs a candidate to compare against accepted evidence.

The fixture envelope is deliberately outside the current helper contracts. Test code should:

1. parse the fixture document;
2. validate the small test-only envelope locally in the focused test;
3. clone `records` into the exact current `{ records }` wrapper;
4. call the unchanged current helper;
5. assert deterministic results and input immutability.

No new production validator, generalized fixture framework, helper registration, schema registration, or normal lint integration is authorized by this plan.

## 14. Normal Lint Posture

Future Knowledge fixtures should not be discovered or validated by normal content lint.

Reasons:

- they are test inputs, not base content;
- some future scenario fixtures will intentionally be invalid;
- normal lint should continue to validate authored schemas and content collections only;
- fixture metadata is not part of production wrapper contracts;
- registering fixtures would blur test and content authority.

`npm.cmd run tool:content-lint` remains a regression check for fixture-related planning and future fixture implementation. It must continue to pass without reading `tests/fixtures/knowledge/`.

## 15. Storage And Persistence Posture

Fixture documents may model accepted evidence and applied progress for tests, but they do not define where those records are stored.

This plan does not select:

- save ownership;
- account ownership;
- session ownership;
- character-state ownership;
- runtime repository ownership;
- database tables or documents;
- serialization envelopes;
- transaction boundaries;
- persistence ordering;
- migration or compatibility behavior.

A future storage implementation must be separately planned after fixture, initialization, acceptance, application, completion, and trial contracts are sufficiently stable. Fixture file shape must not be promoted automatically into a persistence format.

## 16. Trial Roadmap

Knowledge, Skill, and Spell/Magic Study trials remain separate systems.

Knowledge trials should eventually:

- evaluate authored snippet completion and domain/tier requirements;
- use accepted and applied Knowledge state rather than skill rank;
- unlock deeper Knowledge access or recognition without granting action capability or spells.

Skill trials should continue to follow the separate skill-mastery framework:

- use skill-specific rank bands, requirements, gates, and checkpoints;
- validate action capability rather than discovered information;
- avoid consuming Knowledge evidence as skill advancement.

Spell/Magic Study trials should eventually:

- govern study, acquisition, control, or spell-specific readiness;
- use dedicated magic-study and acquisition evidence;
- avoid treating Knowledge completion or skill rank as automatic spell acquisition.

These families may later share vocabulary such as evidence, requirement, attempt, result, and checkpoint. Shared vocabulary does not imply shared schemas, fixtures, progression math, runtime owners, or completion behavior.

## 17. Next Exact Run

The exact next run is:

`Version 0.5.137 - Knowledge Progress Record Initialization Plan`

That run must remain documentation only.

It should define:

- when a character-owned progress record may be initialized;
- the required existing snippet/domain/subject authority;
- owner and target identity parity;
- zero-point and empty-consumption defaults;
- explicit initial sequence posture;
- whether initialization is requested by accepted evidence, another explicit command, or both;
- duplicate initialization rejection;
- pure proposal boundaries;
- later focused-test acceptance criteria.

It must not create progress records, fixtures, helpers, tests, schemas, storage, persistence, runtime wiring, UI, or gameplay behavior.

## 18. Future Implementation Sequence

The broad future sequence after this planning run is:

1. Knowledge Progress Record Initialization Plan.
2. Knowledge Progress Record Initialization Helper Plan.
3. Knowledge Progress Record Initialization Helper.
4. Knowledge Evidence Acceptance Helper Plan.
5. Knowledge Evidence Acceptance Helper.
6. Knowledge Progress Application Helper Plan.
7. Knowledge Progress Application Helper.
8. Knowledge Completion Rules Plan.
9. Knowledge Completion Helper Plan.
10. Knowledge Completion Helper.
11. Knowledge Trial Rules Plan.
12. Knowledge Trial Helper Plan.
13. Knowledge Trial Helper.
14. Knowledge Read-Model Plan.
15. Knowledge Read-Model Helper.
16. Canonical Knowledge Storage Ownership Plan.
17. Canonical Knowledge Storage Implementation.
18. Runtime producer integration planning.
19. Runtime producer integration.
20. Persistence integration planning.
21. Persistence integration.
22. UI/read-model presentation planning.
23. UI/read-model presentation.

Each implementation step requires its own scoped authority. This sequence does not pre-authorize code, fixtures, storage, persistence, runtime, or UI changes.

## 19. Future Fixture Implementation Criteria

A later fixture implementation run may create `tests/fixtures/knowledge/` only when its prompt explicitly authorizes fixture files.

That run should:

- create only the approved small fixture documents;
- keep fixtures outside base content and generated paths;
- freeze exact envelope and expected-result fields;
- add focused fixture-boundary tests;
- project `records` into unchanged current validator wrappers;
- use current live authored authorities rather than copied registries;
- prove positive, negative, duplicate, replay, deterministic-order, and immutability cases;
- prove normal content lint does not discover the fixtures;
- avoid production dependencies;
- avoid fixture-loader abstractions unless repeated use demonstrates a concrete need;
- avoid runtime, storage, persistence, save/session/account, UI, and gameplay wiring.

The implementation must also make an explicit cleanup decision for the temporary Knowledge planning guardrails. Until initialization and acceptance responsibilities are implemented and validated, the current evidence, progress, producer, storage, and fixture plans should remain because they still prevent ownership drift.

## 20. This Planning Run Acceptance

`Version 0.5.136` is complete when:

- this document exists with all 22 required sections;
- `tests/fixtures/knowledge/` is recommended but not created;
- evidence, progress, and combined scenario wrapper posture is explicit;
- fixture identity, sequence, owner, authority, lint, storage, and persistence boundaries are explicit;
- positive and negative scenario requirements are explicit;
- Knowledge, Skill, and Spell/Magic Study trial families remain separate;
- `Version 0.5.137 - Knowledge Progress Record Initialization Plan` is the exact next run;
- the workflow roadmap, sequence, handoff, backlog note, and current Codex output are aligned;
- all required existing focused tests and content lint pass;
- only the approved documentation files changed;
- conflict-marker, trailing-whitespace, and diff whitespace checks pass.

## 21. Risks

- Fixture envelopes could be mistaken for production collection or persistence contracts.
- Copying authored authorities into fixtures could create a stale second source of truth.
- Registering fixtures with normal lint could cause intentionally invalid scenarios to affect production validation.
- A generalized loader or adapter could broaden scope before repeated use justifies it.
- Accepted evidence fixtures could imply an acceptance owner that has not been designed.
- Zero-progress fixtures could accidentally imply automatic record creation.
- Combined scenarios could collapse validation, acceptance, application, and persistence into one undefined operation.
- Shared trial vocabulary could be misread as permission to merge Knowledge, Skill, and Magic progression.
- Temporary guardrail plans could become stale if later runs fail to prune or promote their remaining guidance.

Mitigation is strict test-only placement, explicit projection into unchanged current helpers, narrow future prompts, focused path audits, and separate planning for initialization, acceptance, application, completion, trials, storage, persistence, runtime, and UI.

## 22. Non-Goals

This plan does not:

- create fixture files or directories;
- create a fixture schema, loader, adapter, registry, or generalized framework;
- edit current evidence, progress, producer, snippet, registry, skill, spell, schema, validator, helper, or test behavior;
- register anything with normal content lint;
- create or initialize progress records;
- accept, reject, persist, replay, or consume evidence;
- apply progress proposals;
- define completion math;
- define or implement Knowledge trials;
- change Skill trials;
- define or implement Spell/Magic Study trials;
- choose canonical storage ownership;
- change save, account, session, character, database, or runtime schemas;
- add migration or compatibility behavior;
- add runtime producer wiring;
- add UI, main-menu, generated output, events, Chronicle, Renown, quest, inventory, economy, combat, or gameplay behavior;
- authorize magical books, tomes, scrolls, enchanter-authored arcane documents, or region-based maps before their required source systems exist.
