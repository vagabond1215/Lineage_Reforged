# Activity Resolution Existing-System Reuse Audit

## Run Identity

Unversioned `Activity Resolution Existing-System Reuse Audit`

Documentation only. This run does not consume a primary `0.6.x` or later implementation version.

Suggested commit:

`docs(audit): reconcile activity resolution systems`

## Purpose

Reinspect the live repository and determine which existing trial, quest, Knowledge, activity, crafting, workplace, difficulty, and magic structures can safely support a future shared contextual activity-resolution framework.

The audit must decide what is:

- reusable shared vocabulary;
- reusable only through an adapter;
- legacy behavior to preserve temporarily;
- domain-owned and not generalizable;
- missing authority;
- blocked pending another owner;
- unsafe to promote.

The audit must not implement the shared framework.

## Required Reading

Read:

- `AGENTS.md`;
- `README.md`;
- current output, handoff, prompt, roadmap, sequenced plan, continuity brief, historical/deferred register, and backlog;
- `docs/design/activity-resolution-depth-and-attempt-state-contract-plan.md`;
- `docs/design/future-system-design-ledger.md`;
- `docs/design/skill-mastery-trial-framework-plan.md`;
- `docs/design/knowledge-trial-boundary-plan.md`;
- `docs/design/knowledge-trial-readiness-boundary-plan.md`;
- `docs/design/knowledge-trial-readiness-policy-schema-plan.md`;
- `docs/design/crafting-authority-boundary-decision.md`;
- `docs/design/cross-domain-production-research-synthesis.md`;
- `docs/data-dictionary/quests.md`;
- `docs/design/magic-study-authority-boundary-decision.md`;
- relevant activity, travel, quest, difficulty, command/event, and preview/execution boundary documents.

Inspect the live files that own or consume:

- Skill Trial schema, content, progression, tests, and title/breakthrough relationships;
- Knowledge completion, eligibility, readiness, policy, schema, helper, content, and tests;
- quest archetype/definition action trees and their validation/runtime consumers;
- crafting recipes, production chains, workplaces, jobs, tools, and any current craft resolver;
- activity selection and every activity advancement/preview/execution path;
- run difficulty modifiers that could affect progression, checks, or consequences;
- magic readiness/planned-output envelopes and narrow combat-hook execution;
- shared types, commands, events, revision identity, synchronization, and persistence patterns.

## Execution Gate

1. Verify repository, branch, clean worktree, remote alignment, current head, and active route.
2. Confirm every hold prerequisite is accepted. Stop without edits when any prerequisite is not accepted.
3. Confirm `docs/design/activity-resolution-depth-and-attempt-state-contract-plan.md` exists and remains planning-only.
4. Reproduce current counts and identities for trials, skills, Knowledge trial policies/readiness schemas, quest archetypes/definitions, recipes, workplaces/jobs, and relevant helpers.
5. Search for every implementation and consumer of trial outcomes, checkpoints, action trees, activity advancement, crafting resolution, Knowledge readiness, and generic checks.
6. Record stale or contradictory documentation separately from runtime defects.
7. Do not assume that similarly named fields share semantics.

## Required Audit Output

Create:

- `docs/design/activity-resolution-existing-system-reuse-audit.md`

The audit must contain the following sections.

### 1. Exact Live Baseline

Report exact current:

- skill bands, gates, and maximum rank;
- trial records and schema capabilities;
- trial progression helper behavior;
- Knowledge policy, schema, content, helper, and adapter state;
- quest action-tree fields, outcome branches, effects, and consumers;
- crafting recipe and production/workplace authority;
- activity selection and advancement ownership;
- difficulty modifier owners;
- magic readiness and execution boundaries.

### 2. Authority Matrix

For each candidate concept, identify:

- static owner;
- mutable owner;
- current consumer;
- validation;
- tests;
- persistence;
- UI owner;
- missing owner;
- promotion posture.

Candidate concepts must include:

- eligibility;
- readiness;
- depth selection;
- attempt identity;
- phase/node;
- check;
- continuous margin;
- result band;
- branch;
- recovery;
- consecutive soft failure;
- participant role;
- aggregation;
- metric/accumulator;
- familiarity;
- reliability/compression;
- typed effect;
- terminal status;
- cooldown;
- reward/progression proposal;
- deterministic seed/randomness evidence.

### 3. Quest Action-Tree Reuse Decision

Determine whether quest action trees should:

- become the shared definition grammar;
- expose selected shared components;
- remain quest-owned while a separate shared grammar is authored;
- require correction before any reuse.

Inspect strictness, effect ownership, node identity, graph closure, participant aggregation, outcome semantics, and runtime consumers. Do not decide by field-name similarity alone.

### 4. Legacy Trial Adapter Decision

Classify the current trial system as an explicit model such as `state_accumulator` and decide:

- which behavior must remain stable;
- whether current checkpoint thresholds are descriptive, cumulative, or executable;
- how pass/fail and potential loss can coexist with future node outcomes;
- whether content migration is needed;
- whether an adapter can be read-only first;
- which tests lock current behavior.

Do not change rank gates or progression math.

### 5. Knowledge Attempt Gap Decision

Separate what already exists from what remains missing.

At minimum distinguish:

- completion;
- eligibility;
- authored readiness policy content;
- content-to-helper adapter;
- attempt creation;
- checkpoint resolution;
- outcome;
- cooldown;
- reward;
- storage/persistence;
- runtime/UI.

Correct stale roadmap claims that treat already-landed schema/helper work as future work, while preserving genuinely missing layers.

### 6. Crafting Process-Profile Decision

Determine the minimum future static process-profile authority separate from:

- recipes;
- production chains;
- workplaces;
- item instances;
- mutable work orders.

Decide whether phases, metrics, defects, recovery, and objectives belong in a shared activity profile, a crafting-specific profile, or both.

### 7. Gathering Difficulty And Familiarity Gap

Identify the current owners or absences for:

- target difficulty;
- minimum/recommended competence;
- method identity;
- target/method familiarity;
- yield/condition/safety/site-impact dimensions;
- source depletion/regrowth;
- item creation;
- automation/compression reliability.

Do not infer these from production-chain difficulty or workplace metadata unless a current owner explicitly establishes that relationship.

### 8. Activity Advancement Integration Decision

Audit every activity advancement and preview/execution path. Decide whether a future shared attempt resolver should integrate through activity advancement, a separate command family, or domain-owned commands.

Preserve engine-owned activity selection as a separate accepted boundary.

### 9. Determinism And RNG Decision

Identify current deterministic command/revision/event patterns and every relevant randomness owner.

Recommend a future posture for:

- preview/execution parity;
- seed ownership;
- replay;
- stale protection;
- accepted-only application;
- graph simulation;
- test fixtures.

Do not implement RNG or state.

### 10. Typed Effect Ownership Matrix

Map candidate outcome effects to explicit owners. Mark missing owners and prohibit direct generic-resolver mutation.

### 11. Documentation Contradictions

At minimum inspect:

- stale Knowledge readiness sequencing;
- historical `0.5.x` placeholders that should not be executed as future active versions;
- temporary-artifact references and removal conditions;
- any conflict between roadmap, sequenced plan, current handoff, current output, backlog, and durable design plans.

### 12. Exact Follow-Up Sequence

Select the smallest documentation-first sequence after the audit. It should normally separate:

1. competence/difficulty/familiarity/compression authority;
2. shared node/outcome/aggregation vocabulary;
3. attempt identity/state/determinism;
4. typed effect ownership;
5. domain adapters;
6. pure helpers and simulation-only slices;
7. presentation;
8. mutation owners.

Install the exact next prompt only when the audit has enough live evidence to make it decision-complete.

## Required Classifications

Use explicit classifications such as:

- `reuse_shared`;
- `reuse_via_adapter`;
- `preserve_legacy`;
- `domain_owned`;
- `missing_static_authority`;
- `missing_mutable_owner`;
- `validation_gap`;
- `test_gap`;
- `documentation_stale`;
- `blocked_by_owner`;
- `reject_generalization`.

## Prohibited Scope

Do not change:

- content JSON;
- schemas;
- validators;
- tests;
- helpers;
- runtime;
- commands/events;
- UI;
- saves/persistence;
- progression math;
- economy;
- inventory;
- crafting execution;
- gathering execution;
- Knowledge mutation;
- magic execution;
- combat;
- dependencies;
- assets;
- generated output;
- gameplay.

## Allowed Changes When Activated

Documentation only:

- `docs/design/activity-resolution-existing-system-reuse-audit.md`;
- current output and handoff;
- current prompt only to install an exact accepted follow-up prompt;
- roadmap, sequenced plan, backlog, historical/deferred register, continuity brief, and future-system ledger only for proven route or factual corrections;
- this queued file for explicit disposition.

## Validation

- Verify every repository claim against live files.
- Verify all referenced paths exist.
- Search for duplicate or conflicting authority descriptions.
- Confirm no source/test/content/runtime path changed.
- Run conflict-marker and trailing-whitespace checks and `git diff --check`.
- Inspect the complete changed-path set and full diff.
- Do not run builds, content lint, typechecks, tests, servers, generators, package installation, or gameplay unless a repository-fact check strictly requires one; document any exception.

## Completion Report

Report:

- starting commit and worktree state;
- exact inspected systems and counts;
- accepted reuse/adaptation/rejection decisions;
- stale documentation findings;
- required authority and test gaps;
- audit path;
- exact next route and prompt disposition;
- files changed;
- checks run;
- confirmation that no implementation or gameplay behavior changed.
