# Lethal-Process Definition Owner Namespace And Shared Envelope Schema Plan

## Run Identity

Unversioned `Lethal-Process Definition Owner Namespace And Shared Envelope Schema Plan`

Documentation only. This run does not consume a primary implementation version.

Suggested commit:

`docs(health): plan lethal-process definition envelope`

## Purpose

Decide exact future owner namespaces, owner-specific catalog partitioning, collision-safe definition identity, shared static-only fields, catalog lifecycle, directional reference posture, and schema/validator/test/package boundaries for the six accepted first-scope lethal-process definitions.

This is a schema plan, not schema implementation. It must return one exact later static package or `NO_PACKAGE`.

## Required Reading

Read:

- `AGENTS.md`;
- `README.md`;
- current output, handoff, prompt, roadmap, sequenced plan, continuity brief, historical/deferred register, planning-anchor reconciliation, backlog, and static-content program;
- `docs/design/health-runtime-ownership-and-dependency-closure-audit.md`;
- `docs/design/observer-safe-crisis-assessment-and-presentation-contract-decision.md`;
- `docs/design/care-capability-stabilization-and-process-effect-contract-decision.md`;
- `docs/design/first-lethal-process-definition-and-catalog-plan.md`;
- `docs/design/lethal-process-and-stabilization-research-integration-decision.md`;
- `docs/design/functional-state-lethal-process-care-requirement-and-mortal-crisis-receipt-contract-decision.md`;
- `docs/design/injury-recovery-trauma-and-magical-restoration-decision.md`;
- `docs/design/occurrence-identity-named-uncertainty-channels-outcome-commitment-and-correction-contract-decision.md`.

Inspect live:

- content domain and id namespace conventions;
- schema path, `$id`/title, wrapper, strict-record, enum, reference, and lifecycle conventions;
- pure validators, normal-lint registration, schema parse coverage, and focused-test patterns;
- `packages/content/base/game/combat_health_vocabulary.json`;
- `packages/schemas/game/combat-health-vocabulary.schema.json`;
- `tools/content-lint/combat-health-vocabulary.mjs`;
- `tests/unit/combat-status-condition-injury-authority-validation.test.mjs`;
- existing health, injury, body, hazard, environment, poison, respiratory, magic, and owner vocabulary;
- collision candidates for all proposed namespaces and ids.

## Execution Gate

1. Verify repository, branch, clean worktree, remote alignment, current head, and active route.
2. Confirm the dependency audit selected this as the only ready documentation prerequisite.
3. Confirm the six conceptual first-scope processes remain unchanged:
   - external hemorrhage;
   - confirmed internal hemorrhage;
   - airway obstruction;
   - post-submersion respiratory compromise;
   - systemic hypothermia;
   - hot-altered heat crisis.
4. Confirm the current combined combat-health catalog remains incompatible and must not be widened or reused.
5. Confirm care-capability and observer-safe consumers are accepted.
6. Stop without edits if exact owner attribution cannot be decided from current durable authority or would require new research.
7. Do not perform external research.

## Required Output

Create:

- `docs/design/lethal-process-definition-owner-namespace-and-shared-envelope-schema-plan.md`.

The plan must include:

### 1. Live Schema And Namespace Baseline

Record exact relevant current paths, wrapper/record patterns, namespace conventions, validator registration, tests, and collision results.

### 2. Current Combat-Health Incompatibility

Prove why `combat_status`, `combat_condition`, `combat_injury`, and `future_health_runtime` cannot host or own lethal-process definitions.

No widening, aliasing, migration, shared lifecycle, or relationship-field addition to the current catalog is allowed.

### 3. Exact Definition Owner Matrix

Assign exactly one future static definition owner and exactly one compatible mutable-instance owner class to each of the six conceptual processes.

Preserve:

- hemorrhage versus causal injury;
- airway versus later respiratory harm;
- systemic cold versus local freezing injury;
- hot-altered crisis versus contextual heat illness;
- observer suspicion versus confirmed process;
- process truth versus care, death, magic, UI, and save authority.

If any owner cannot be assigned safely, return `NO_PACKAGE`.

### 4. Exact Namespace And Catalog Partition

Decide:

- exact id prefix/pattern;
- whether owner identity appears in the id;
- exact owner vocabulary;
- exact owner-specific content paths;
- wrapper shape;
- cross-catalog uniqueness strategy;
- lifecycle vocabulary;
- definition version/provenance posture;
- no-alias/no-migration baseline.

Avoid both one omnibus medical catalog and duplicated meanings across owners.

### 5. Shared Static Envelope

Define exact future fields, required/optional status, allowed values, and semantics for static definitions only.

Separate:

- identity;
- owning domain;
- family/classification;
- catalog lifecycle;
- internal summary;
- source/provenance;
- directional non-owning references;
- tags/notes where justified;
- semantic version posture.

Recursively forbid actor/target state, stage, severity, progression, timers, probabilities, formulas, symptoms-as-proof, diagnosis, care, materials, access, occurrence, receipt, persistence, migration, UI, and gameplay fields.

### 6. Directional Reference Contract

Decide exact allowed reference categories and resolution ownership without creating cross-owner mutation.

Address injury, body, hazard/environment, poison, respiratory, magic, and other process references. Reject references whose target authority does not exist or is not safe.

### 7. Exact Future Paths

Select exact future:

- content file or files;
- schema file or files;
- pure validator;
- normal-lint registration point;
- schema-file registration;
- focused test file.

No path may be changed in this run.

### 8. Validation And Test Plan

Define exact future positive, negative, collision, reference, purity, registration, and non-runtime-import checks.

Preserve current `combat_health_vocabulary` content, schema, validator, registration, and tests unchanged.

### 9. Migration And Compatibility

Confirm no current id, hook, status, body band, HP fact, active-effect label, save field, event, or prose migrates into a process definition.

### 10. Package Readiness

Return either:

- one exact later static schema/validator/test/content-shell package with paths, allowed fields, registration, checks, and prohibitions; or
- `NO_PACKAGE` with exact unresolved owner or schema authority.

Do not authorize mutable instances, balance, process progression, care, diagnosis, persistence, migration, UI, death, or gameplay.

### 11. Exact Follow-Up Route

Install one exact next prompt only when the plan closes every static package decision. Otherwise use `NO_NEXT_PROMPT`.

Do not preassign a primary version.

## Required Decisions

Answer explicitly:

1. What exact owner defines each first-scope process?
2. What exact namespace and catalog partition apply?
3. What exact shared fields and lifecycle apply?
4. Which directional references are allowed?
5. What exact future paths and checks apply?
6. What current data cannot migrate?
7. Is one static package ready, or is the result `NO_PACKAGE`?
8. What exact route follows?

## Prohibited Scope

Do not:

- perform external research;
- create or modify content, schemas, validators, tests, helpers, runtime, commands/events, UI, saves, migrations, dependencies, generated output, or gameplay;
- widen or change `combat_health_vocabulary`;
- define mutable instances, stages, severity, rates, balance, formulas, timers, thresholds, probabilities, random channels, symptoms as proof, diagnosis, medical protocols, treatment instructions, care actions, materials, costs, access, services, magic effects, death, restoration, or display copy;
- create one universal medical/health resolver;
- make a definition owner mutate injuries, body state, hazards, environment, poison, magic, care, death, saves, or consumers;
- infer ownership from labels, roles, professions, prose, items, spells, services, or current `future_health_runtime`;
- assign a primary version.

## Allowed Changes

Documentation only:

- create the focused schema plan;
- update current output, handoff, and prompt;
- update roadmap, sequenced plan, continuity brief, historical/deferred register, planning anchor, backlog, and static-content program only for proven route facts.

## Validation

- Verify every cited namespace, path, schema, validator, registration, and test claim.
- Verify collision results for proposed ids and paths.
- Verify exactly one owner per definition.
- Verify the shared envelope is static-only and owner-safe.
- Verify no current catalog or implementation path changed.
- Run conflict-marker and trailing-whitespace scans plus `git diff --check`.
- Inspect the complete changed-path set and full diff.

Do not run builds, tests, content lint, typecheck, generators, servers, package installation, or gameplay unless a repository-fact check strictly requires one.

## Completion Report

Report:

- starting commit and worktree state;
- live namespace/schema baseline;
- exact owner matrix;
- namespace/catalog/envelope/reference decisions;
- future paths and validation plan;
- migration boundary;
- static package readiness or `NO_PACKAGE`;
- exact next route;
- files changed;
- checks run;
- confirmation that no content, schema, validator, test, runtime, UI, save, migration, dependency, diagnosis, care, death, or gameplay behavior changed.
