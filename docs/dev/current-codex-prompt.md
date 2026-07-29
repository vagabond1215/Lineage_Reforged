# Version 0.6.8.1 - Lethal-Process Definition Static Foundation Acceptance Audit

## Run Identity

`Version 0.6.8.1 - Lethal-Process Definition Static Foundation Acceptance Audit`

Label class: support suffix

Parent version: `Version 0.6.8 - Lethal-Process Definition Static Foundation`

Milestone impact: `supports_current_band`

Suggested commit:

`docs(health): accept lethal-process static foundation`

## Purpose

Independently audit the committed `Version 0.6.8` parent implementation and record whether the exact lethal-process static foundation is accepted.

This run is validation and acceptance only. It must not repair, widen, or implement parent code/content. It must not authorize mutable process state, persistence, diagnosis, care, death, UI, or gameplay.

## Required Reading

Read:

- `AGENTS.md`;
- `README.md`;
- current output, handoff, prompt, roadmap, sequenced plan, continuity brief, historical/deferred register, planning-anchor reconciliation, backlog, and static-content program;
- `docs/design/internal-versioning-and-release-milestone-policy.md`;
- `docs/design/lethal-process-definition-owner-namespace-and-shared-envelope-schema-plan.md`;
- `docs/design/lethal-process-static-foundation-version-classification-and-implementation-gate.md`;
- `docs/design/health-runtime-ownership-and-dependency-closure-audit.md`;
- all nine parent implementation paths;
- the parent commit and complete parent diff.

## Execution Gate

1. Verify repository, branch, clean worktree, remote alignment, current head, and parent commit.
2. Confirm this run is a support suffix attached only to `0.6.8`.
3. Confirm all nine exact parent implementation paths exist and no implementation path outside that package changed.
4. Confirm all six reserved ids remain collision-free outside their owning catalogs/tests/docs.
5. Confirm the four protected combat-health authority files remain unchanged by the parent.
6. Stop without edits if the repository is dirty, the parent scope cannot be isolated, a required value is ambiguous, or any acceptance criterion fails.

## Exact Audit Scope

Audit:

- `packages/content/base/game/lethal_process_hemorrhage_definitions.json`;
- `packages/content/base/game/lethal_process_airway_definitions.json`;
- `packages/content/base/game/lethal_process_respiratory_definitions.json`;
- `packages/content/base/game/lethal_process_thermal_definitions.json`;
- `packages/schemas/game/lethal-process-definition.schema.json`;
- `tools/content-lint/lethal-process-definitions.mjs`;
- `tools/content-lint/index.mjs`;
- `tests/unit/schema-files.test.mjs`;
- `tests/unit/lethal-process-definition-authority-validation.test.mjs`.

Protected comparison:

- `packages/content/base/game/combat_health_vocabulary.json`;
- `packages/schemas/game/combat-health-vocabulary.schema.json`;
- `tools/content-lint/combat-health-vocabulary.mjs`;
- `tests/unit/combat-status-condition-injury-authority-validation.test.mjs`.

## Acceptance Criteria

Accept only if every criterion passes:

1. exactly six definitions and four owners;
2. exact two/one/one/two distribution;
3. exact ids, slugs, internal names, summaries, tags, source-authority notes, and boundary notes;
4. canonical lifecycle, semantic version `1`, and empty live references;
5. strict draft-2020-12 wrapper, record, and reference schema with no `$id`;
6. exact owner, family, lifecycle, relation, and target-domain enums;
7. pure validator with no imports or input mutation;
8. strict structure-before-semantics behavior;
9. exact path/owner/id/family/slug coherence;
10. global collision, inventory, distribution, reference, and forbidden-key enforcement;
11. exact-once normal-lint registration and one dependency-helper call;
12. exact-once schema registration;
13. all focused negative and positive obligations represented;
14. no production engine/app import or reference;
15. no current combat-health widening or behavioral regression;
16. no runtime, shared contract, save, migration, diagnosis, care, death, UI, dependency, or gameplay addition.

## Required Checks

Run:

1. `node --test tests/unit/lethal-process-definition-authority-validation.test.mjs`;
2. `node --test tests/unit/schema-files.test.mjs`;
3. `npm.cmd run tool:content-lint`;
4. `node --test tests/unit/combat-status-condition-injury-authority-validation.test.mjs`.

Expected:

- lethal-process focused assertions all pass;
- schema-file assertions all pass;
- `content-lint: ok (71 files checked)`;
- combat-health focused assertions all pass.

Then run:

- exact-record and distribution inspection;
- exact-once registration scans;
- reserved-id and path collision/replacement scans;
- parent changed-path audit;
- protected combat-health parent-diff check;
- production engine/app import/reference scan;
- validator import/purity and forbidden-key inspection;
- conflict-marker and trailing-whitespace scans;
- `git diff --check`;
- complete parent diff review.

Do not run broad workspace typecheck as an acceptance gate.

## Failure Behavior

If any criterion fails:

- make no file changes;
- report `NOT_ACCEPTED`;
- name the exact failed criterion and evidence;
- recommend one narrowly scoped `0.6.8.2` repair prompt;
- do not repair the parent in this audit;
- do not advance another capability.

## Accepted Documentation Scope

Only after every criterion passes:

- add `docs/design/lethal-process-definition-static-foundation-acceptance-audit.md`;
- update current output, handoff, prompt, roadmap, sequenced plan, continuity brief, historical/deferred register, planning anchor, backlog, and static-content program only for proven acceptance facts;
- record the exact audited commit and checks;
- state `ACCEPTED`;
- preserve mutable/executable health work as `NO_PACKAGE`;
- install an unversioned `Post-Lethal-Process Static Foundation Next-Capability Classification Gate` prompt without assigning another primary version.

No content, schema, validator, test, runtime, shared contract, save, migration, dependency, generated, UI, or gameplay path may change.

## Completion Report

Report:

- audited commit and repository state;
- exact parent changed paths;
- acceptance result for every criterion;
- exact check results;
- protected combat-health result;
- production-reference result;
- files changed by the audit;
- risks and follow-up notes;
- next unversioned classification route or exact repair suffix.
