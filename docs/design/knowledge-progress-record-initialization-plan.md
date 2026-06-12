# Knowledge Progress Record Initialization Plan

Version: `Version 0.5.137 - Knowledge Progress Record Initialization Plan`

Status: planning authority only

Date: 2026-06-12

## 1. Purpose And Status

This document defines the future boundary for explicitly initializing one character-owned Knowledge progress record. It selects initialization terminology, target and owner authority, deterministic identity construction, zero-state values, sequence and notes posture, duplicate behavior, fixture and storage relationships, and acceptance criteria for a later pure helper.

This run is documentation only. It implements no initialization helper, fixture file, fixture loader, progress or evidence JSON state, storage, persistence, save/session/database shape, runtime integration, migration, normal content-lint registration, schema edit, validator edit, evidence/progress/proposal/producer helper edit, UI, main-menu, generated output, completion, trial, event, reward, ownership mutation, Skill Trial behavior, Spell/Magic Study behavior, or gameplay behavior.

## 2. Current State Recap

The current Knowledge foundation provides:

- four active authored snippets for Aloe, Badger, Iron Ore, and Kaelvar;
- a validated broad domain registry with Flora, Fauna, Minerals, and General Lore active and Arcane Lore planned;
- a strict evidence schema and pure evidence semantic validator;
- a strict progress schema and pure progress semantic validator;
- a pure evidence-to-progress proposal helper that requires exactly one existing valid target progress record;
- a pure observation producer that returns candidate evidence only;
- a storage and persistence boundary plan;
- a storage fixture boundary plan that recommends future test fixtures but creates none.

The repository does not provide:

- an accepted-evidence collection;
- a progress collection;
- canonical progress initialization policy;
- canonical character owner authority;
- canonical acquisition or update sequence authority;
- canonical storage or persistence ownership;
- completion, Knowledge trials, Skill Trial integration, Spell/Magic Study integration, UI, runtime mutation, or gameplay behavior.

Current evidence and progress values exist only as in-memory focused-test inputs. They are not canonical state.

## 3. Initialization Problem Statement

The current evidence-to-progress proposal helper deliberately requires an existing valid progress target. It returns `target_progress_not_found` rather than inventing a progress record.

This creates a necessary boundary:

- accepted evidence may eventually exist before a progress record exists;
- an absent progress record is not the same state as an explicit zero-valued record;
- zero-state fixture validation proves structural and semantic consistency only and does not select runtime initialization policy;
- creating a progress record requires explicit identity, owner, snippet/domain/subject snapshot, initial value, consumed-evidence posture, `updatedSequence`, notes, and duplicate behavior.

Initialization must not be hidden inside:

- an evidence producer;
- evidence validation;
- progress validation;
- the evidence-to-progress proposal helper;
- normal content lint;
- UI or main-menu presentation;
- save/session loading;
- passive map, location, inventory, skill, spell, account, family, or institution state.

## 4. Initialization Terminology

- **Uninitialized progress:** no current progress record exists for one `ownerScope`/`ownerId`/`snippetId` target.
- **Initialized zero-state progress:** an explicit valid progress record exists with `progressValue: 0`, empty `consumedEvidenceIds`, explicit `updatedSequence`, and schema-valid notes.
- **Initialized first-evidence progress:** an explicit operation initializes a missing target in response to accepted evidence. Immediate evidence consumption is not implied.
- **Progress seed:** the explicit immutable inputs used to propose initialization, including owner, snippet, sequence, notes, and current progress records.
- **Progress target:** the exact character and authored snippet pair for which one current progress record may exist.
- **Initialization operation:** a dedicated request to propose one missing progress record under this plan.
- **Initialized progress record:** the complete schema-compatible zero-state record proposed by the initialization operation.
- **Duplicate initialization:** an attempt to initialize a target whose `progressId` or owner/snippet identity already exists.
- **Initialization sequence:** the explicit non-negative integer assigned to the initial `updatedSequence`.
- **Initialization notes:** non-empty schema-valid notes identifying initialization mode and controlled planning or test context.

Uninitialized progress is absence, not a zero-valued record. Zero-state progress is explicit state. First-evidence initialization is an authorized operation, not an automatic side effect of evidence validation or existence.

## 5. Recommended Initial Policy

The first future policy is lazy explicit initialization.

The broader boundary recognizes two explicit modes:

- `zero_state`;
- `first_evidence`.

The first implementation should support only `zero_state`.

`first_evidence` remains a named future mode so later acceptance and application planning can decide whether accepted evidence may authorize initialization and whether any atomic operation is needed. It must not consume evidence during the first helper implementation.

The initial policy must not:

- initialize every snippet at character creation;
- auto-initialize inside the producer, evidence validator, progress validator, or evidence-to-progress helper;
- infer initialization from UI display or codex visibility;
- infer initialization from passive map, location, inventory, skill, spell, account, family, institution, quest, Chronicle, or Renown state.

## 6. Progress Target Authority

Initialization must resolve `snippetId` to exactly one active authored Knowledge snippet.

The initialization operation should:

1. receive an explicit `snippetId`;
2. resolve that id in the supplied authored snippet authority;
3. resolve the snippet's `domainId` in the supplied broad domain authority;
4. require the domain to have `status: "active"`;
5. copy `domainId`, `subjectType`, and `subjectId` from the resolved snippet.

Callers must not supply or override target snapshots. Attempts to pass `domainId`, `subjectType`, or `subjectId` should be rejected as unsupported or mismatched inputs.

Snippets and domains are read-only authorities. Initialization must not mutate them.

Planned Arcane Lore remains blocked while `knowledge_domain.arcane_lore` is not active and no active authored Arcane snippet route exists.

## 7. Owner Authority

The first owner posture remains:

- `ownerScope: "character"`;
- explicit `ownerId` input;
- schema-pattern-only `ownerId` validation.

No canonical character collection is selected. A future storage owner must replace pattern-only posture with authoritative character identity resolution before runtime state is created.

Initialization must reject:

- account ownership;
- family ownership;
- settlement ownership;
- faction ownership;
- institution ownership;
- global ownership;
- custom ownership.

Owner identity must not be inferred from UI selection, active session, account, family, location, institution, producer context, evidence context, or ambient runtime state.

## 8. progressId Construction

The planned deterministic format is:

```text
knowledge_progress.<domain-token>.<snippet-token>.<owner-token>
```

In compact ownership notation, this is `knowledge_progress.<domain-token>.<length-prefixed-snippet-token>.<length-prefixed-owner-token>`.

Construction rules:

1. `domain-token` is the exact suffix after `knowledge_domain.` from the resolved snippet's `domainId`.
2. `snippet-token` encodes the exact subject and category components from the resolved `snippetId`.
3. `owner-token` encodes every dot-delimited component of the explicit `ownerId`.
4. Each encoded component uses `<decimal-character-length>_<raw-component>`.
5. Multiple encoded components are joined with `_`.
6. Raw components are already constrained to lowercase alphanumeric and underscore characters by current identifier patterns.

Examples:

```text
knowledge_progress.flora.4_aloe_14_identification.9_character_12_test_subject
knowledge_progress.fauna.6_badger_14_identification.9_character_12_test_subject
knowledge_progress.minerals.8_iron_ore_14_identification.9_character_12_test_subject
knowledge_progress.general_lore.7_kaelvar_16_cultural_context.9_character_12_test_subject
```

Length-prefixing keeps the mapping unambiguous when source components contain underscores or when an owner id contains multiple dotted components.

The rule must guarantee:

- the same owner and snippet produce the same `progressId`;
- a different owner produces a different `progressId`;
- a different snippet produces a different `progressId`;
- zero-state and later first-evidence initialization for the same owner/snippet target use the same `progressId`;
- the id satisfies the live three-token progress-id schema pattern.

The id must not encode:

- `progressValue`;
- `consumedEvidenceIds`;
- `updatedSequence`;
- timestamps;
- random values;
- UI ids;
- storage ids;
- hidden counters.

The caller must not supply `progressId`; it is derived from authoritative inputs. A future storage plan may revisit the rule only through an explicit current-data identity decision.

## 9. Initial progressValue Policy

Zero-state initialization sets:

```text
progressValue = 0
```

The first helper implementation should always initialize zero state, even when a future caller's reason is accepted evidence. It should then leave progress credit to the separate proposal and application flow.

The alternative of creating a positive record with first evidence already consumed remains deferred until evidence acceptance, durable accepted-evidence ownership, progress application, and atomicity policy explicitly authorize it.

Initialization does not:

- interpret progress as a percentage;
- define completion thresholds;
- consume `completionWeight`;
- consume `trialUnlockWeight`;
- calculate tier aggregation;
- establish trial readiness.

## 10. consumedEvidenceIds Policy

Zero-state initialization sets:

```text
consumedEvidenceIds = []
```

First-evidence initialization with immediate consumption remains deferred.

Initialization must not:

- mark candidate evidence consumed;
- mark merely validated evidence consumed;
- mark accepted evidence consumed unless a future durable acceptance and application owner explicitly authorizes it;
- infer consumed ids from every available evidence record;
- accept caller-supplied consumed ids in the first helper.

Duplicate consumed ids remain structurally invalid. Cross-record evidence-consumption conflicts remain progress-validator, proposal, and future application concerns.

## 11. updatedSequence Policy

Initialization requires an explicit non-negative integer `updatedSequence`.

For zero-state initialization, this value is the explicit initialization sequence. It must be preserved exactly in the proposed record.

The first helper must not derive sequence from:

- wall-clock time;
- filesystem order;
- random values;
- process-global or hidden counters;
- UI order;
- fixture order;
- evidence array order.

A future storage owner must select the canonical sequence authority and monotonicity rules.

The initialization sequence does not establish or modify any evidence `acquiredSequence`.

## 12. Notes Policy

Initialization notes must:

- be an explicit array;
- contain at least one unique non-empty string;
- pass the current progress schema;
- identify `zero_state` initialization;
- identify a controlled planning, test, or future operation context.

The recommended first note is:

```text
Initialized explicit zero-state Knowledge progress record.
```

Additional notes may identify the focused test or future authorized operation. Notes must not contain or claim:

- UI state;
- runtime event payloads;
- save, account, session, or database metadata;
- generated output;
- completion;
- trial readiness;
- evidence acceptance;
- evidence consumption;
- persistence;
- rewards or ownership changes.

## 13. Duplicate Initialization Policy

One owner/snippet target may have at most one current progress record.

Before proposing initialization, the future helper must inspect current supplied progress records and reject:

- an existing identical deterministic `progressId`;
- any existing record with the same `ownerScope`/`ownerId`/`snippetId` tuple;
- duplicate current `progressId` values in supplied state;
- duplicate current owner/snippet identities in supplied state.

Replaying the same deterministic zero-state initialization may become idempotent only if a future storage owner explicitly selects that behavior. The first helper should reject an existing target rather than claim storage idempotency.

A conflicting replay must reject deterministically.

Cross-record consumed-evidence conflicts remain outside initialization because the first initialized record consumes no evidence.

## 14. Relationship To Accepted Evidence

Accepted evidence may later be an explicit reason to request initialization.

Accepted evidence does not force initialization by itself.

The following must not initialize progress:

- candidate evidence;
- evidence that merely passes schema validation;
- evidence that merely passes semantic validation;
- an accepted-evidence fixture;
- passive evidence availability.

Accepted evidence may justify initialization only for the same character owner and exact snippet/domain/subject target. A mismatch must be rejected or remain unrelated.

`first_evidence` remains a future explicit initialization mode. It is not automatic and is not implemented by the first helper.

## 15. Relationship To The Evidence-To-Progress Helper

The current `proposeKnowledgeProgressFromEvidence(...)` helper requires one existing valid target progress record.

Initialization creates that target proposal only. It must not call the evidence-to-progress helper.

The future conceptual pipeline is:

1. accepted evidence exists under an explicit acceptance owner;
2. zero-state progress is initialized when missing and explicitly authorized;
3. the evidence-to-progress helper proposes eligible `+1` progress;
4. the proposed progress record passes current progress validation;
5. a future application helper applies the proposal.

Initialization and evidence-to-progress proposal remain separate operations. This plan does not merge them.

## 16. Relationship To Fixtures

The planned fixture boundary may later include zero-state initialized progress examples.

Fixture examples are test inputs, not runtime initialization or canonical state.

Future fixture scenarios may represent:

- uninitialized progress by absence of a progress record;
- explicit initialized zero-state progress;
- duplicate initialization;
- accepted first evidence with missing progress;
- accepted evidence plus an initialized zero-state target awaiting proposal.

No fixture file or fixture directory is created by this run. Future fixtures must remain under a separately authorized `tests/fixtures/knowledge/` scope and outside normal content lint.

## 17. Relationship To Storage And Persistence

Initialization cannot become runtime state until a storage owner is selected.

The future storage owner must decide:

- where initialized progress is retained;
- whether zero-state initialization is persisted immediately;
- whether exact replay is idempotent or rejected;
- how sequence monotonicity is enforced;
- how concurrent duplicate initialization is prevented.

This plan selects no:

- save shape;
- account shape;
- session shape;
- character-state field;
- database table or document;
- persistence adapter;
- transaction boundary;
- migration or compatibility behavior;
- normal content-lint registration.

## 18. Relationship To Completion, Trials, UI, Generated Output, And Runtime

Initialized progress is not completion and is not trial readiness.

Initialization does not:

- unlock Knowledge trials;
- unlock or affect Skill Trials;
- unlock or affect Spell/Magic Study trials;
- emit Chronicle or Renown events;
- reveal a codex entry;
- create a map pin;
- produce a notification;
- change UI or main-menu state;
- create generated output;
- grant rewards;
- change ownership;
- change skills or spells;
- change inventory, combat, travel, economy, world, or gameplay state.

Future UI must consume authorized read-only projections. It must not create progress records by rendering missing state.

## 19. Future Helper Shape

The recommended implementation paths are:

- `tools/content-lint/knowledge-progress-initialization.mjs`
- `tests/unit/knowledge-progress-initialization.test.mjs`

The helper should be pure, deterministic, in-memory, filesystem-free, and unregistered.

Recommended explicit inputs:

- `relativePath`;
- `initializationMode`, initially only `zero_state`;
- `ownerScope`;
- `ownerId`;
- `snippetId`;
- `updatedSequence`;
- `notes`;
- `snippetsWrapper`;
- `domainRegistryWrapper`;
- `currentProgressWrapper`.

The helper should return exactly:

```text
initializedProgressRecord
issues
safety
```

`initializedProgressRecord` is the complete immutable zero-state proposal or `null`.

Recommended safety flags are:

- `noMutation`;
- `noPersistence`;
- `noEvidenceConsumption`;
- `noProgressApplication`;
- `noCompletion`;
- `noTrialUnlock`;
- `noRuntimeOutput`;
- `noUiOutput`;
- `noGeneratedOutput`.

The helper should not:

- read or write files;
- persist;
- call the producer;
- call the evidence validator;
- call the progress validator;
- call the evidence-to-progress helper;
- mutate inputs;
- create or accept evidence;
- consume evidence;
- complete snippets;
- unlock trials;
- emit UI, runtime, event, reward, or generated output.

Focused tests should validate the returned record through the unchanged current progress helper as a separate assertion.

## 20. Future Helper Focused Test Plan

Positive cases:

- initialize Aloe zero-state progress;
- initialize Badger zero-state progress;
- initialize Iron Ore zero-state progress;
- initialize Kaelvar zero-state progress;
- produce the same deterministic `progressId` for the same owner/snippet;
- produce different ids for different owners;
- produce different ids for different snippets;
- preserve explicit `updatedSequence`;
- preserve schema-valid explicit notes;
- return output that passes the current progress schema and semantic validator with `allowZeroStateRecords: true`;
- leave all inputs unchanged;
- avoid evidence, producer, proposal, and existing-helper invocation inside the initializer.

Negative cases:

- reject missing `ownerId`;
- reject invalid `ownerId`;
- reject non-character `ownerScope`;
- reject missing `snippetId`;
- reject an unknown snippet;
- reject a planned or inactive domain, including Arcane Lore;
- reject caller-supplied target snapshot fields;
- reject caller-supplied `progressId`;
- reject missing, negative, fractional, or non-numeric `updatedSequence`;
- reject empty, duplicate, or non-string notes;
- reject duplicate current `progressId`;
- reject duplicate current owner/snippet target;
- reject `first_evidence` until separately authorized;
- reject evidence, candidate, UI, location, inventory, skill, spell, account, family, institution, quest, Chronicle, or Renown inputs as initialization authority;
- reject completion, trial, UI, runtime, persistence, event, reward, and generated-output fields;
- prove no filesystem, clock, random, hidden-counter, normal-lint, mutation, persistence, evidence-consumption, or progress-application behavior.

## 21. Acceptance Criteria For Future Implementation

`Version 0.5.138 - Knowledge Progress Record Initialization Helper` is acceptable only when:

- only the pure helper and focused tests are added, plus normal handoff updates;
- the helper supports explicit `zero_state` initialization only;
- the helper is deterministic, in-memory, filesystem-free, side-effect-free, and unregistered;
- `progressId` follows the exact rule in Section 8;
- owner, snippet, sequence, and notes are explicit;
- target snapshots come only from current authored authorities;
- duplicate `progressId` and duplicate owner/snippet targets reject deterministically;
- the initialized record passes the current progress schema and semantic validator;
- `progressValue` is zero;
- `consumedEvidenceIds` is empty;
- no evidence is created, accepted, consumed, or proposed;
- no storage, persistence, fixture file, schema edit, existing-validator behavior change, normal lint registration, application, completion, trial, UI, runtime, generated-output, or gameplay behavior is added.

## 22. First Recommended Next Run

The exact next run is:

`Version 0.5.138 - Knowledge Progress Record Initialization Helper`

Scope:

- add the pure initialization helper;
- add focused unit tests;
- support zero-state initialization only;
- derive deterministic schema-compatible `progressId`;
- validate output externally through current progress validation;
- remain unregistered.

It must add no storage, persistence, fixture files, runtime, UI, completion, trials, evidence consumption, progress application, or normal content-lint registration.

## 23. Future Implementation Sequence

Recommended order:

1. Knowledge Progress Record Initialization Plan.
2. Knowledge Progress Record Initialization Helper.
3. Knowledge Evidence Acceptance Helper Plan.
4. Knowledge Evidence Acceptance Helper.
5. Knowledge Progress Application Plan.
6. Knowledge Progress Application Helper.
7. Knowledge Completion Rules Plan.
8. Knowledge Completion Helper.
9. Knowledge Trial Boundary Plan.
10. Knowledge Trial Schema Plan.
11. Knowledge Trial Checkpoint Helper.
12. Skill Trial Schema Expansion Plan.
13. Skill Trial Checkpoint Outcome Helper.
14. Skill Trial Cooldown/Readiness Helper.
15. Magic Study Event Boundary Plan.
16. Magic Study Source Plan.
17. Magic Study Checkpoint Helper.
18. Known-Spell Acquisition Evidence Integration Plan.
19. Shared Trial Vocabulary / Envelope Plan.
20. Trial UI Presentation Plan.

Knowledge, Skill, and Spell/Magic Study trial families remain separate. Shared vocabulary or envelopes must not merge their progression ownership, schemas, math, evidence, or runtime behavior.

## 24. Risks And Deferred Work

- The planned `progressId` rule could conflict with a later storage identity decision.
- Character owner authority remains pattern-only.
- Canonical sequence authority remains unresolved.
- No accepted-evidence collection or acceptance owner exists.
- Storage and persistence ownership remain unresolved.
- First-evidence initialization and immediate consumption remain deferred.
- Progress application remains deferred.
- Duplicate and replay behavior under concurrent or persisted storage remains unresolved.
- Zero-state persistence policy remains unresolved.
- Anti-farming, cooldowns, repeatability, stacking, and occurrence equivalence remain deferred.
- Completion, Knowledge trials, Skill Trials, Spell/Magic Study trials, UI, generated output, runtime, and gameplay behavior remain deferred.
- Arcane Lore initialization remains blocked.
- Knowledge, Skill, and Spell/Magic Study trials remain separate and deferred.
- A cleanup decision remains necessary for the evidence, progress, proposal, producer, storage, fixture, and initialization guardrail documents after initialization, acceptance, and application planning consume or promote their remaining rules.

## 25. Non-Goals And Forbidden Changes

This plan authorizes none of the following:

- no initialization implementation;
- no helper creation;
- no fixture file or directory creation;
- no fixture loader implementation;
- no storage implementation;
- no persistence implementation;
- no accepted-evidence helper implementation;
- no progress-application helper implementation;
- no evidence or progress JSON, content, or state;
- no save, account, session, character, or database shape;
- no migration or compatibility behavior;
- no normal content-lint registration;
- no producer implementation changes;
- no evidence-to-progress helper changes;
- no progress helper changes;
- no evidence helper changes;
- no schema changes;
- no authored content changes;
- no snippet, registry, skill, or spell changes;
- no test changes;
- no runtime;
- no UI or main-menu;
- no generated output;
- no completion;
- no trials;
- no events, rewards, ownership changes, or gameplay behavior;
- no Skill Trial implementation;
- no Spell/Magic Study Trial implementation;
- no unrelated cleanup.
