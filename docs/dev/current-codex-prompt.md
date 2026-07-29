# Version 0.6.8 - Lethal-Process Definition Static Foundation

## Run Identity

`Version 0.6.8 - Lethal-Process Definition Static Foundation`

Label class: primary

Parent version: not applicable

Milestone impact: `advances_current_band`

Suggested commit:

`feat(content): add lethal-process definition foundation`

## Purpose

Implement the exact static foundation accepted by:

- `docs/design/lethal-process-definition-owner-namespace-and-shared-envelope-schema-plan.md`;
- `docs/design/lethal-process-static-foundation-version-classification-and-implementation-gate.md`.

Create exactly six non-executing lethal-process definitions under four owner-specific catalogs, one shared strict schema, one pure cross-catalog validator, exact normal-lint/schema registration, and one focused test file.

This run creates static identity authority only. It must not create mutable process state, runtime behavior, persistence, migration, diagnosis, care, death, UI, or gameplay.

## Required Reading

Read:

- `AGENTS.md`;
- `README.md`;
- current output, handoff, prompt, roadmap, sequenced plan, continuity brief, historical/deferred register, planning-anchor reconciliation, backlog, and static-content program;
- `docs/design/internal-versioning-and-release-milestone-policy.md`;
- `docs/design/lethal-process-definition-owner-namespace-and-shared-envelope-schema-plan.md`;
- `docs/design/lethal-process-static-foundation-version-classification-and-implementation-gate.md`;
- `docs/design/health-runtime-ownership-and-dependency-closure-audit.md`;
- `packages/content/base/game/combat_health_vocabulary.json`;
- `packages/schemas/game/combat-health-vocabulary.schema.json`;
- `tools/content-lint/combat-health-vocabulary.mjs`;
- `tools/content-lint/index.mjs`;
- `tests/unit/combat-status-condition-injury-authority-validation.test.mjs`;
- `tests/unit/schema-files.test.mjs`.

## Execution Gate

1. Verify repository, branch, clean worktree, remote alignment, current head, and active route.
2. Confirm `Version 0.6.8` remains unused and the classification gate is accepted.
3. Confirm all seven new paths remain absent.
4. Confirm all six reserved ids remain collision-free.
5. Confirm the four current combat-health authority files are unchanged.
6. Reproduce the exact owner matrix, seed values, envelope, lifecycle, reference posture, paths, and checks from the accepted schema plan.
7. Stop without edits if any collision, authority conflict, missing exact value, or unrelated worktree change makes the package unsafe.

## Exact Implementation Scope

### New content

- `packages/content/base/game/lethal_process_hemorrhage_definitions.json`;
- `packages/content/base/game/lethal_process_airway_definitions.json`;
- `packages/content/base/game/lethal_process_respiratory_definitions.json`;
- `packages/content/base/game/lethal_process_thermal_definitions.json`.

### New schema and validator

- `packages/schemas/game/lethal-process-definition.schema.json`;
- `tools/content-lint/lethal-process-definitions.mjs`.

### Existing registration

- `tools/content-lint/index.mjs`;
- `tests/unit/schema-files.test.mjs`.

### New focused test

- `tests/unit/lethal-process-definition-authority-validation.test.mjs`.

No implementation path outside these nine may change.

## Exact Content

Create exactly:

| Id | Owner | Family | Catalog |
| --- | --- | --- | --- |
| `lethal_process.hemorrhage.external_hemorrhage` | `hemorrhage_process` | `hemorrhage` | hemorrhage |
| `lethal_process.hemorrhage.internal_hemorrhage` | `hemorrhage_process` | `hemorrhage` | hemorrhage |
| `lethal_process.airway.obstruction` | `airway_process` | `airway` | airway |
| `lethal_process.respiratory.post_submersion_compromise` | `respiratory_process` | `respiratory` | respiratory |
| `lethal_process.thermal.systemic_hypothermia` | `thermal_process` | `thermal` | thermal |
| `lethal_process.thermal.hot_altered_crisis` | `thermal_process` | `thermal` | thermal |

Copy every exact slug, internal name, summary, tags, source-authority note, and boundary note from Section 4.2.1 of the accepted schema plan.

Every record must use:

- `catalogLifecycle: "canonical"`;
- `semanticVersion: 1`;
- `references: []`.

Every wrapper contains exactly:

- `ownerDomain`;
- `records`.

Distribution must be exactly two/one/one/two.

Do not add a seventh record, alias, migration, display label, executable hook, or cross-owner reference.

## Shared Schema

Create draft-2020-12 schema:

- title: `LethalProcessDefinitionCatalog`;
- no `$id`;
- strict two-field wrapper;
- strict twelve-field records;
- local `$defs`/`$ref` only.

Required record fields:

1. `id`;
2. `slug`;
3. `name`;
4. `definitionOwner`;
5. `processFamily`;
6. `catalogLifecycle`;
7. `semanticVersion`;
8. `summary`;
9. `references`;
10. `tags`;
11. `sourceAuthorityNotes`;
12. `notes`.

Exact owner enum:

- `hemorrhage_process`;
- `airway_process`;
- `respiratory_process`;
- `thermal_process`.

Exact family enum:

- `hemorrhage`;
- `airway`;
- `respiratory`;
- `thermal`.

Exact lifecycle enum:

- `planned`;
- `canonical`;
- `retired`.

Exact reference relations:

- `causal_source`;
- `contributing_source`;
- `coexisting_process`;
- `transition_source`.

Exact target domains:

- `injury`;
- `body_state`;
- `hazard`;
- `environment`;
- `poison`;
- `respiratory_process`;
- `magic`;
- `lethal_process`.

Use the exact id, lower-snake, reference, integer-minimum, uniqueness, and static-only constraints from the accepted schema plan.

## Pure Validator

Export one pure cross-catalog validator from:

`tools/content-lint/lethal-process-definitions.mjs`

It must:

- import nothing;
- mutate no input;
- accept all four path/wrapper pairs plus the shared schema in one call;
- optionally accept canonical reference ids by target domain for focused in-memory validation;
- validate strict schema shape before semantics;
- require every exact path and owner once;
- reject unrecognized/missing catalogs;
- enforce wrapper/path/owner/id-segment/family/slug coherence;
- enforce global id, slug, and internal-name uniqueness;
- validate the exact six-record inventory and two/one/one/two distribution for live content;
- validate reference shape, target-domain pattern, duplicates, and injected target existence;
- recursively reject forbidden mutable/runtime/mechanic/diagnosis/care/occurrence/persistence/death/UI/gameplay keys;
- return an inert success envelope with sorted definition ids;
- import no filesystem, engine, app, save, runtime, content owner, or dependency.

## Normal-Lint And Schema Registration

In `tools/content-lint/index.mjs`:

- import the validator exactly once;
- add every catalog to `checks` exactly once;
- use `requiredTopLevel: ["ownerDomain", "records"]`;
- call one dependency helper exactly once;
- have that helper read only the four catalogs and shared schema;
- invoke the pure validator once with empty live reference authority;
- do not import or consult runtime, app, save, combat-health, item, spell, role, service, care, death, UI, or gameplay owners.

In `tests/unit/schema-files.test.mjs`:

- register `packages/schemas/game/lethal-process-definition.schema.json` exactly once.

## Focused Test Requirements

Create:

`tests/unit/lethal-process-definition-authority-validation.test.mjs`

Prove all eighteen obligations in Section 8 of the accepted schema plan, including:

- exact live records and distribution;
- exact-once wiring;
- strict schema/wrapper/record behavior;
- owner/id/family/slug coherence;
- global collisions;
- lifecycle and semantic version;
- input non-mutation and validator purity;
- empty live references;
- injected valid reference fixtures;
- unresolved/invalid/duplicate reference rejection;
- recursive forbidden-field rejection;
- current combat-health separation;
- no production runtime import/reference.

## Prohibited Scope

Do not:

- edit `combat_health_vocabulary` content, schema, validator, or focused test;
- create mutable instances, commands, events, results, receipts, saves, migrations, replay, or correction;
- define stages, severity, rates, timers, thresholds, probabilities, formulas, rolls, damage, healing, symptoms as proof, diagnosis, prognosis, treatment, care, materials, access, providers, costs, death, restoration, or closure;
- add item, spell, skill, role, service, hazard, environment, poison, injury, body-state, magic, observer, UI, narrative, Chronicle, or gameplay integration;
- create aliases or backfill current data;
- add production dependencies;
- run broad workspace typecheck as an acceptance gate;
- modify generated or vendor files.

## Required Checks

Run:

1. `node --test tests/unit/lethal-process-definition-authority-validation.test.mjs`;
2. `node --test tests/unit/schema-files.test.mjs`;
3. `npm.cmd run tool:content-lint`.

Then run:

- reserved-id and path collision/replacement scans;
- exact nine-path implementation diff audit;
- protected combat-health unchanged check;
- production import/reference scan;
- conflict-marker and trailing-whitespace scans;
- `git diff --check`;
- complete implementation diff review.

Expected normal-lint inventory after adding four catalogs:

`content-lint: ok (71 files checked)`

## Post-Acceptance Coordination

Only after every required check passes:

- update current output and handoff with exact results;
- install `Version 0.6.8.1 - Lethal-Process Definition Static Foundation Acceptance Audit` as the next prompt;
- update roadmap, sequenced plan, continuity brief, historical/deferred register, planning anchor, backlog, and static-content program only for proven completion facts.

These documentation updates are coordination artifacts, not implementation-package expansion.

## Completion Report

Report:

- starting commit and worktree state;
- exact records, owners, schema, validator, and registration;
- focused/schema/lint results;
- exact implementation and coordination files changed;
- confirmation that protected combat-health authority is unchanged;
- confirmation that no runtime, save, migration, diagnosis, care, death, UI, dependency, or gameplay behavior changed;
- risks/follow-up notes;
- next support audit.
