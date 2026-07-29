# Lethal-Process Definition Owner Namespace And Shared Envelope Schema Plan

Date: 2026-07-28

Run: unversioned `Lethal-Process Definition Owner Namespace And Shared Envelope Schema Plan`

Status: accepted documentation-only schema plan; one bounded static foundation package is ready for version classification

Milestone impact: `supports_current_band`

## Decision Summary

Accept four definition domains under one shared static envelope:

- `hemorrhage_process`;
- `airway_process`;
- `respiratory_process`;
- `thermal_process`.

Each domain owns the meaning of definitions in its catalog and is the only compatible class of future mutable-instance owner for those definitions. The shared schema and validator own structure, collision checks, catalog/record coherence, static-only enforcement, and reference validation. They do not own process meaning or mutation.

Reserve the collision-safe id shape:

`lethal_process.<owner_segment>.<slug>`

The exact six first-scope ids are:

1. `lethal_process.hemorrhage.external_hemorrhage`;
2. `lethal_process.hemorrhage.internal_hemorrhage`;
3. `lethal_process.airway.obstruction`;
4. `lethal_process.respiratory.post_submersion_compromise`;
5. `lethal_process.thermal.systemic_hypothermia`;
6. `lethal_process.thermal.hot_altered_crisis`.

The word `confirmed` is not embedded in the internal-hemorrhage id. A process instance is actual owner truth only after the hemorrhage owner accepts it; suspicion remains observer/assessment knowledge and never enters the definition namespace.

One static schema/content/validator/test foundation is `STATIC_PACKAGE_READY`, subject to a separate version-classification gate. Mutable instances, process behavior, balance, persistence, migration, care, diagnosis, death, UI, and gameplay remain `NO_PACKAGE`.

## 1. Live Schema And Namespace Baseline

### 1.1 Current combat-health authority

| Concern | Live path or value |
| --- | --- |
| Content | `packages/content/base/game/combat_health_vocabulary.json` |
| Schema | `packages/schemas/game/combat-health-vocabulary.schema.json` |
| Validator | `tools/content-lint/combat-health-vocabulary.mjs` |
| Normal-lint wiring | `tools/content-lint/index.mjs` |
| Focused test | `tests/unit/combat-status-condition-injury-authority-validation.test.mjs` |
| Schema parse coverage | `tests/unit/schema-files.test.mjs` |
| Wrapper | strict object with exactly `records` |
| Live records | `combat_status.stagger`, `combat_status.bind` |
| Kind namespaces | `combat_status`, `combat_condition`, `combat_injury` |
| Catalog lifecycle | `planned`, `active`, `retired` |

The validator is a pure module with no imports. Normal lint reads content/schema and invokes it through one helper. The focused test verifies exact-once lint wiring, schema registration, input non-mutation, uniqueness, id/slug coherence, strict fields, and recursive rejection of runtime concepts.

### 1.2 Repository schema conventions

Relevant repository schemas:

- use JSON Schema draft 2020-12;
- are registered explicitly in `tests/unit/schema-files.test.mjs`;
- use strict wrappers and strict records where owner integrity matters;
- use local `$defs` and local `$ref` values;
- use `title` selectively;
- do not currently use schema `$id` values.

The future shared schema therefore uses draft 2020-12, the exact title `LethalProcessDefinitionCatalog`, local definitions, and no `$id`.

Content filenames use lower snake case. Schema and focused-validator filenames use lower kebab case. Focused tests use descriptive lower-kebab filenames.

### 1.3 Collision result

Repository-wide searches found no production, content, schema, validator, or test use of:

- the `lethal_process.` prefix;
- any of the six reserved ids;
- any selected future content, schema, validator, or focused-test path.

All selected paths are absent. Current `status.*`, `combat_status.*`, `combat_condition.*`, `combat_injury.*`, body-state facts, and prose do not collide and are not aliases.

## 2. Current Combat-Health Incompatibility

The current catalog remains incompatible:

| Conflict | Why it fails |
| --- | --- |
| Kind | `lethal_process` is not `status`, `condition`, or `injury` |
| Namespace | All accepted ids begin `combat_status`, `combat_condition`, or `combat_injury` |
| Scope | Hemorrhage, airway, respiratory, cold, and heat processes are not inherently combat-owned |
| Owner | `future_health_runtime` is a compatibility label, not a process-definition or instance owner |
| Family | Current families classify combat/body/injury vocabulary, not independent process domains |
| Reference posture | Current validation intentionally rejects relationship fields |
| Lifecycle | Current `active` is catalog lifecycle and would be confused with mutable instance activity |
| Semantics | The catalog cannot establish independently owned causal process meaning |
| Projection | Current names and labels are descriptive metadata, not observer-safe knowledge |
| Migration | No current status, hook, body fact, HP fact, or prose is canonical process truth |

The future package must not:

- add a kind, family, owner, relation, alias, or record to `combat_health_vocabulary`;
- change its schema, validator, lint registration, or focused tests;
- import or map it into the lethal-process catalogs;
- share its catalog lifecycle vocabulary;
- treat `future_health_runtime` as accepted authority.

## 3. Exact Definition Owner Matrix

| Conceptual process | Reserved definition id | Static definition owner | Compatible future mutable-instance owner class | Preserved boundary |
| --- | --- | --- | --- | --- |
| External hemorrhage | `lethal_process.hemorrhage.external_hemorrhage` | `hemorrhage_process` | `hemorrhage_process` instance owner | Causal injury remains injury-owned |
| Confirmed internal hemorrhage | `lethal_process.hemorrhage.internal_hemorrhage` | `hemorrhage_process` | `hemorrhage_process` instance owner | Suspicion remains observer/assessment knowledge |
| Airway obstruction | `lethal_process.airway.obstruction` | `airway_process` | `airway_process` instance owner | Obstruction remains distinct from later respiratory harm |
| Post-submersion respiratory compromise | `lethal_process.respiratory.post_submersion_compromise` | `respiratory_process` | `respiratory_process` instance owner | Submersion/hazard source remains separately owned |
| Systemic hypothermia | `lethal_process.thermal.systemic_hypothermia` | `thermal_process` | `thermal_process` instance owner | Local freezing injury remains injury-owned |
| Hot-altered heat crisis | `lethal_process.thermal.hot_altered_crisis` | `thermal_process` | `thermal_process` instance owner | Contextual heat illness remains body/environment evidence |

These owners are domain-specific rather than actor-specific. Player, NPC, or monster identity does not change definition meaning. One future instance affects one accepted body identity but remains owned by exactly one listed process domain.

No owner may mutate another process, injury, body state, hazard, environment, poison, magic, care, death, save, UI, or narrative owner.

## 4. Exact Namespace And Catalog Partition

### 4.1 Identity

Exact general pattern:

```text
^lethal_process\.(hemorrhage|airway|respiratory|thermal)\.[a-z0-9]+(?:_[a-z0-9]+)*$
```

Exact owner mapping:

| `definitionOwner` | Id owner segment | `processFamily` |
| --- | --- | --- |
| `hemorrhage_process` | `hemorrhage` | `hemorrhage` |
| `airway_process` | `airway` | `airway` |
| `respiratory_process` | `respiratory` | `respiratory` |
| `thermal_process` | `thermal` | `thermal` |

The record `slug` must equal the final id segment. Owner identity therefore appears in the id and the required `definitionOwner` field. The catalog wrapper repeats `ownerDomain`; the validator must require wrapper, path, record owner, id segment, and family to agree.

### 4.2 Owner-specific catalogs

Exact future content paths:

- `packages/content/base/game/lethal_process_hemorrhage_definitions.json`;
- `packages/content/base/game/lethal_process_airway_definitions.json`;
- `packages/content/base/game/lethal_process_respiratory_definitions.json`;
- `packages/content/base/game/lethal_process_thermal_definitions.json`.

Each wrapper is exactly:

```json
{
  "ownerDomain": "<one accepted owner>",
  "records": []
}
```

The later static package may populate only the six reserved identity records in their owning files: two hemorrhage, one airway, one respiratory, and two thermal. It must not add a seventh definition.

### 4.2.1 Exact seed records

Every seed uses:

- `catalogLifecycle: "canonical"`;
- `semanticVersion: 1`;
- `references: []`;
- `sourceAuthorityNotes: "Accepted by the lethal-process research integration, first catalog plan, care and observer contracts, dependency audit, and definition owner/schema plan."`.

Exact record-specific values:

| Id | Slug | Name | Owner / family | Summary | Tags | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `lethal_process.hemorrhage.external_hemorrhage` | `external_hemorrhage` | `External Hemorrhage` | `hemorrhage_process` / `hemorrhage` | `Static identity for an independently owned external hemorrhage process accepted from owner-certified causal facts; it defines no stage, rate, care, outcome, or display behavior.` | `hemorrhage`, `external` | `Causal injury remains injury-owned. This definition does not infer process truth from a wound, bleeding label, HP, or prose.` |
| `lethal_process.hemorrhage.internal_hemorrhage` | `internal_hemorrhage` | `Internal Hemorrhage` | `hemorrhage_process` / `hemorrhage` | `Static identity for an independently owned internal hemorrhage process accepted as actual process truth; it defines no observation, diagnosis, stage, rate, care, outcome, or display behavior.` | `hemorrhage`, `internal` | `An instance represents owner-accepted actual internal hemorrhage. Suspicion and observer confidence remain assessment-owned.` |
| `lethal_process.airway.obstruction` | `obstruction` | `Airway Obstruction` | `airway_process` / `airway` | `Static identity for an independently owned airway obstruction process accepted from owner-certified causal facts; it defines no cause, stage, care, resolution rule, outcome, or display behavior.` | `airway`, `obstruction` | `Airway obstruction remains distinct from later respiratory harm and does not absorb hazard, body, care, or observer authority.` |
| `lethal_process.respiratory.post_submersion_compromise` | `post_submersion_compromise` | `Post-Submersion Respiratory Compromise` | `respiratory_process` / `respiratory` | `Static identity for an independently owned post-submersion respiratory process accepted from owner-certified source facts; it defines no hidden timer, stage, care, prognosis, outcome, or display behavior.` | `respiratory`, `post_submersion` | `Submersion and hazard sources remain separately owned. This definition creates no delayed-death timer or automatic diagnosis.` |
| `lethal_process.thermal.systemic_hypothermia` | `systemic_hypothermia` | `Systemic Hypothermia` | `thermal_process` / `thermal` | `Static identity for an independently owned systemic cold process accepted from owner-certified thermal, body, and environment facts; it defines no temperature threshold, stage, care, outcome, or display behavior.` | `thermal`, `cold_exposure` | `This is a systemic thermal process only. Local freezing injury remains injury-owned, and environment and body facts remain source-owned.` |
| `lethal_process.thermal.hot_altered_crisis` | `hot_altered_crisis` | `Hot-Altered Heat Crisis` | `thermal_process` / `thermal` | `Static identity for an independently owned hot-altered heat process accepted from owner-certified thermal, body, function, and environment facts; it defines no threshold, stage, care, outcome, or display behavior.` | `thermal`, `heat_exposure` | `This process requires a later owner-accepted transition; contextual heat illness remains body and environment evidence.` |

These internal names and summaries are authority metadata. They are not approved player-facing labels, diagnosis text, dialogue, Chronicle copy, or localization source.

### 4.3 Cross-catalog uniqueness

The pure validator receives all four catalogs in one call and enforces:

- each exact path appears once;
- each accepted owner appears once;
- no unrecognized catalog/path is present;
- ids, slugs, and internal names are unique across all catalogs;
- one reserved id appears in exactly one owner catalog;
- wrapper/path/record/id/family coherence;
- the exact first-scope count and owner distribution when validating the populated seed package.

The shared validator is structural infrastructure. It cannot select an owner, infer equivalent meanings, or mutate a record.

### 4.4 Catalog lifecycle and semantic version

Exact catalog lifecycle vocabulary:

- `planned`;
- `canonical`;
- `retired`.

`active` is intentionally absent. Lifecycle describes definition authority only and never an actor/process instance.

Every definition requires `semanticVersion`, a positive integer beginning at `1`. Incrementing it means the static definition's owner-governed meaning changed incompatibly. It is not a package version, save version, public-release promise, process stage, runtime revision, or migration authorization.

There are no aliases and no migration table in the first package.

## 5. Shared Static Envelope

### 5.1 Exact wrapper fields

| Field | Required | Type | Rule |
| --- | --- | --- | --- |
| `ownerDomain` | yes | enum string | One of the four accepted definition owners |
| `records` | yes | array | Strict definition records; non-empty for the six-record seed package |

No other wrapper fields are allowed.

### 5.2 Exact record fields

| Field | Required | Type / allowed values | Static semantics |
| --- | --- | --- | --- |
| `id` | yes | accepted lethal-process id pattern | Collision-safe internal identity |
| `slug` | yes | lower snake case | Must equal final id segment |
| `name` | yes | non-empty string | Internal canonical name, not automatic display copy |
| `definitionOwner` | yes | four-owner enum | Sole owner of definition meaning |
| `processFamily` | yes | `hemorrhage`, `airway`, `respiratory`, `thermal` | Coarse definition family coherent with owner |
| `catalogLifecycle` | yes | `planned`, `canonical`, `retired` | Static catalog posture only |
| `semanticVersion` | yes | integer, minimum `1` | Owner-governed definition meaning version |
| `summary` | yes | non-empty string | Internal stable meaning without mechanics or treatment |
| `references` | yes | unique strict reference objects | Directional, non-owning static references only |
| `tags` | yes | unique lower-snake strings | Internal descriptive indexing only |
| `sourceAuthorityNotes` | yes | non-empty string | Durable repository-decision provenance |
| `notes` | yes | non-empty string | Explicit boundary/prohibition notes |

No optional fields are accepted in the first schema. Strictness prevents an optional field from becoming an unreviewed authority channel.

### 5.3 Recursively forbidden semantics

The schema and validator must reject, including under nested objects:

- actor, target, patient, body, encounter, episode, save-slot, or instance state;
- stage, severity, direction, progression, recurrence, stabilization, suppression, resolution, or current activity;
- duration, timer, tick, interval, deadline, rate, threshold, temperature value, quantity, probability, roll, random channel, formula, modifier, damage, or healing;
- symptom lists as proof, diagnosis, assessment, confidence, observer knowledge, urgency, prognosis, or future outcome;
- care requirements, capabilities, attempts, treatment, procedure, materials, costs, access, consent, destination, provider, or service behavior;
- commands, occurrences, results, receipts, events, persistence, saves, migrations, corrections, or supersession;
- death, restoration, resurrection, closure, Stakes, account, rewards, or Legacy behavior;
- runtime hooks, effects, imports, UI, display strings, dialogue, narrative, Chronicle, telemetry, or gameplay behavior.

Strict record/reference schemas provide the primary rejection. The focused validator must retain a normalized forbidden-key defense so nested future changes fail closed.

## 6. Directional Reference Contract

### 6.1 Exact reference object

Each reference object contains exactly:

| Field | Allowed values |
| --- | --- |
| `relation` | `causal_source`, `contributing_source`, `coexisting_process`, `transition_source` |
| `targetDomain` | `injury`, `body_state`, `hazard`, `environment`, `poison`, `respiratory_process`, `magic`, `lethal_process` |
| `targetId` | non-empty canonical static id matching the target owner's declared id pattern |

The reference says only that the process definition may accept an owner-certified relation of that category. It does not assert that a relation exists for an actor, establish diagnosis, copy target meaning, authorize mutation, or define progression.

### 6.2 Resolution ownership

- The target domain owns target existence and meaning.
- The lethal-process definition owner owns whether a reference category is valid for its definition.
- The cross-catalog validator owns only shape, target existence, and permitted relation/domain pairing.
- A future mutable process owner must reference an accepted source occurrence/result, not merely the static target id.

### 6.3 First-package posture

All six first records must use `references: []`.

No current injury, body-state, hazard/environment, poison, respiratory, or magic static identity has been accepted as a safe exact target for these definitions. Empty references preserve the directional contract without inventing authority.

Later non-empty references require:

1. a canonical target id and owner;
2. explicit resolver registration in normal lint;
3. a focused positive and unresolved-target negative test;
4. no cross-owner mutation or instance claim.

Care, death, observer, UI, save, combat status, item, spell-name, role, service, profession, prose, and generic event references are not allowed target domains.

## 7. Exact Future Paths

The bounded static foundation package may change exactly:

### New content

- `packages/content/base/game/lethal_process_hemorrhage_definitions.json`;
- `packages/content/base/game/lethal_process_airway_definitions.json`;
- `packages/content/base/game/lethal_process_respiratory_definitions.json`;
- `packages/content/base/game/lethal_process_thermal_definitions.json`.

### New schema and validator

- `packages/schemas/game/lethal-process-definition.schema.json`;
- `tools/content-lint/lethal-process-definitions.mjs`.

### Existing registration files

- `tools/content-lint/index.mjs`;
- `tests/unit/schema-files.test.mjs`.

### New focused test

- `tests/unit/lethal-process-definition-authority-validation.test.mjs`.

No shared type, engine, app, persistence, UI, dependency, generated, or other content path is allowed.

Normal lint must register all four catalogs exactly once and call one dependency helper exactly once. That helper may read only the four catalogs and the shared schema for the first package. It must not import runtime, app, save, item, spell, role, service, care, death, or presentation owners.

## 8. Validation And Test Plan

The focused test must prove:

1. the exact six live records, ids, owners, families, semantic version `1`, and `canonical` lifecycle;
2. exact two/one/one/two catalog distribution;
3. exact-once normal-lint registration for every catalog, validator import, and dependency-helper call;
4. schema parse registration exactly once;
5. strict wrapper and record shapes;
6. owner/path/id/family/slug coherence;
7. global id, slug, and internal-name uniqueness;
8. accepted lifecycle and semantic-version bounds;
9. validator input non-mutation;
10. pure validator with no filesystem, engine, app, runtime, save, or dependency imports;
11. empty reference arrays for every live seed;
12. valid in-memory reference shape with injected canonical target ids;
13. rejection of unresolved targets, invalid relations/domains, and mismatched target patterns;
14. rejection of duplicate references;
15. recursive rejection of mutable, numeric-mechanic, diagnosis, care, occurrence, persistence, death, UI, and gameplay fields;
16. absence of current combat-health ids, owner labels, aliases, and migration fields;
17. no import or reference from production runtime;
18. unchanged `combat_health_vocabulary` content, schema, validator, registration, and focused-test behavior.

Package checks:

- the new focused test;
- `tests/unit/schema-files.test.mjs`;
- normal content lint;
- collision scans;
- exact changed-path audit;
- `git diff --check`.

Do not run broad workspace typecheck as an acceptance gate; its separately classified 173-diagnostic baseline is unrelated.

## 9. Migration And Compatibility

No current data migrates.

| Current surface | Rule |
| --- | --- |
| `combat_status.*`, `combat_condition.*`, `combat_injury.*` | Remain current vocabulary; never alias |
| `status.*` hooks and combat effects | Remain runtime compatibility facts; never process definitions |
| HP or HP-zero | Remain resources/current legacy behavior; never process or death truth |
| Body-state values/bands | Remain metabolic facts; no process backfill |
| `activeEffects` labels | Remain compatibility projection; no canonical identity |
| Items, spells, skills, roles, services | Remain metadata/source-owner facts; no process or capability inference |
| Events/deltas/history | Remain transport/projection; no process occurrence identity |
| Saves/archive reasons | Preserve existing meanings; no process/death migration |
| Notifications/Chronicle/prose | Remain presentation/history; no definition or diagnosis |

The first static package creates new canonical ids at semantic version `1`. It does not create aliases, backfill historical instances, alter saves, or authorize mutable data.

## 10. Package Readiness

`STATIC_PACKAGE_READY`

Exact allowed package:

- four owner-specific catalogs containing exactly the six reserved static records;
- one shared strict schema;
- one pure cross-catalog validator;
- exact-once normal-lint and schema registration;
- one focused authority-validation test;
- no references from the six live records;
- no runtime consumer or behavior.

Exact prohibitions:

- no seventh definition;
- no poison, shock-like, burn, local-freezing, contextual-heat, care, or observer definition;
- no mutable fields, mechanics, values, stages, timers, diagnosis, treatment, persistence, migration, death, UI, or gameplay;
- no changes to combat-health authority;
- no production imports;
- no new dependency.

The package still requires version classification under the repository maturity policy before implementation. This run does not assign `0.6.8` or any other primary/support version.

Mutable/executable package result:

`NO_PACKAGE`

## 11. Exact Follow-Up Route

Install:

Unversioned `Lethal-Process Static Foundation Version Classification And Implementation Gate`

That documentation-only gate must:

- inspect the internal versioning policy and current `0.6.x` maturity;
- classify the ready static package as a current-band primary capability, parent-specific support suffix, or not ready;
- assign no label unless the policy evidence supports it;
- install one exact versioned implementation prompt only if classification and package integrity both pass;
- otherwise return `NO_NEXT_PROMPT`;
- change no content, schema, validator, test, runtime, save, UI, or gameplay path.

## Explicit Answers

1. **What owner defines each process?** Hemorrhage owns external/internal hemorrhage; airway owns obstruction; respiratory owns post-submersion compromise; thermal owns systemic hypothermia and hot-altered crisis.
2. **What namespace and partition apply?** `lethal_process.<owner_segment>.<slug>` across four owner-specific catalogs.
3. **What shared fields and lifecycle apply?** The strict twelve-field record envelope in Section 5, with `planned | canonical | retired` catalog lifecycle and positive integer semantic version.
4. **Which references are allowed?** Only the four directional relations to the eight declared source domains, with canonical target resolution and no mutation; the first six records contain none.
5. **What paths and checks apply?** The nine exact paths and eighteen focused validation obligations in Sections 7 and 8.
6. **What current data migrates?** None.
7. **Is a static package ready?** Yes, `STATIC_PACKAGE_READY`; every mutable or executable package remains `NO_PACKAGE`.
8. **What follows?** The unversioned version-classification and implementation gate above.

## Non-Implementation Confirmation

This plan changes documentation only. It creates no content, schema, validator, test, helper, runtime, command, event, save, migration, dependency, generated output, diagnosis, care, death, UI, or gameplay behavior.
