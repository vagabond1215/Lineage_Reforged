# Normal Stakes Activation, First-Mutation Continuity, And Account-Value Publication Dependency Closure Decision

## Run Identity

Unversioned `Normal Stakes Activation, First-Mutation Continuity, And Account-Value Publication Dependency Closure Decision`

Label class: unversioned

Parent version: not applicable

Milestone impact: `supports_current_band`

Suggested commit:

`docs(save): close Normal continuity activation dependencies`

## Purpose

Close the three mandatory dependencies that prevent implementation of the accepted minimum save identity/publication contract:

1. campaign-rules version 2 cannot activate while ordinary HP zero archives the run and deletes saves;
2. Normal requires one child continuity at the first accepted mutation after loading a non-head artifact;
3. account history, achievements, and durable account value must not publish ahead of authoritative campaign state.

This run is documentation and decision only. It must return either:

- one exact dependency-closed implementation package and policy-derived label; or
- `NO_PACKAGE`.

Do not implement runtime changes. Do not preassign `0.6.9`, `0.7.0`, or a suffix.

## Required Reading

Read:

- `AGENTS.md`;
- `README.md`;
- `docs/dev/branch-lifecycle-and-integration-policy.md`;
- `docs/dev/branch-disposition-register.md`;
- current output, handoff, prompt, roadmap, sequenced plan, continuity brief, historical/deferred register, planning-anchor reconciliation, backlog, and static-content program;
- `docs/design/ashen-reef-survey-minimum-save-identity-and-accepted-state-publication-decision.md`;
- `docs/design/ashen-reef-survey-activity-advancement-scope-and-owner-contract-decision.md`;
- `docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md`;
- `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md`;
- `docs/design/stakes-identity-campaign-save-provenance-checkpoint-topology-and-technical-recovery-contract-decision.md`;
- `docs/design/occurrence-identity-named-uncertainty-channels-outcome-commitment-and-correction-contract-decision.md`;
- `docs/design/occurrence-contract-taxonomy-and-commitment-clarification.md`;
- `docs/design/internal-versioning-and-release-milestone-policy.md`;
- current snapshot, campaign difficulty, combat HP-zero, run lifecycle, account achievement/history, new-game, save/load, and game-shell mutation sources;
- relevant focused tests;
- the isolated readiness branch through read-only Git inspection only.

## Execution Gate

1. Verify repository, branch, clean worktree, remote alignment, current head, and active route.
2. Run `git fetch --all --prune`; inventory branches and open PRs; refresh the branch register for proven changes.
3. Confirm the minimum save decision returned `NO_PACKAGE` for exactly the three named dependencies.
4. Confirm `0.7.0` remains `NOT_READY` and no implementation label is active.
5. Reproduce every current accepted snapshot-mutation entry point and classify its admission authority.
6. Reproduce HP-zero archival/deletion and explicit retirement behavior.
7. Reproduce account-history, achievement, Legacy, estate, and profile writes relative to in-memory mutation and save publication.
8. Stop without edits if the worktree is dirty, required authority conflicts, or exact dependency closure cannot be decided safely.

## Required Decisions

Decide explicitly:

1. the exact atomic boundary for campaign-rules version 2, `normal_stakes`, nonterminal defeat, and active legacy HP-zero repair;
2. the minimum authoritative session context carried after loading a save artifact;
3. how the session distinguishes current head, older selectable artifact, unpublished in-memory state, and already-forked child continuity;
4. which owner receives the accepted-mutation signal from engine-owned commands and temporary legacy shell mutation bridges;
5. the exact first-mutation fork algorithm and duplicate-fork protection;
6. whether child continuity identity exists in memory before save and when it becomes durable;
7. how save publication validates the selected source artifact and current campaign control;
8. which account/history/achievement updates are projections, which are transactions, and which must wait for campaign publication;
9. how existing achievement/Legacy behavior is preserved without abandoned-branch duplication;
10. how explicit retirement remains terminal while ordinary HP zero becomes nonterminal;
11. how active version-6 HP-zero repair combines campaign migration, defeat resolution, artifact publication, and account projection;
12. failure, retry, restart, copied-slot, stale-head, and correction behavior;
13. exact implementation paths, tests, migration gates, and protected boundaries;
14. whether one implementation package is dependency-closed and its exact policy classification.

## Minimum Constraint

The accepted solution must:

- support only Normal gameplay activation;
- preserve manual and quick-save addresses;
- create no branch on load alone;
- create exactly one child continuity on the first accepted divergent mutation;
- preserve ordinary unsaved Normal gameplay;
- publish authoritative campaign state before account projections or value consumers;
- make ordinary HP zero nonterminal;
- keep explicit retirement callable and otherwise unchanged;
- preserve source data when migration or publication fails;
- require no production dependency.

It must not implement:

- the survey command or survey receipts;
- Committed or Ironbound behavior;
- checkpoint selection or save-browser redesign;
- actual death, succession, estate redesign, or broad account refactoring;
- a generic command bus, event bus, effect engine, replay service, or transaction framework;
- cloud/offline merging, encryption, anti-cheat, or broad repair UI.

## Required Evidence

Inspect and record:

- all `onSnapshotChange`, command-result, tick, combat, rest, activity, quest, load, and new-game mutation paths;
- current game-shell state transitions and unsaved-change posture;
- `resolveTerminalArchiveReason(...)`, `archiveActiveRun(...)`, retirement, and blocked-run behavior;
- `evaluateSnapshotWithAccount(...)`, achievement evaluation, account profile persistence, run-history updates, Legacy and estate transactions;
- save creation, quick save, load, delete, metadata, and account ordering;
- current focused save, account, lifecycle, command, and combat tests;
- relevant protected-branch evidence and live branch/PR facts.

## Prohibited Scope

Do not:

- edit engine, app, shared contract, persistence, test, content, schema, dependency, asset, generated, or gameplay files;
- migrate or delete live user data;
- merge or delete protected branches;
- integrate unrelated candidate branches;
- close PR #2 or merge its stale asset work;
- infer an implementation label before dependency closure;
- run broad workspace typecheck as a gate.

## Allowed Documentation Scope

If the execution gate passes:

- add `docs/design/normal-stakes-activation-first-mutation-continuity-and-account-value-publication-dependency-closure-decision.md`;
- update current output, handoff, prompt, roadmap, sequenced plan, continuity brief, historical/deferred register, planning anchor, backlog, static-content program, and branch-disposition register only for proven facts;
- install exactly one implementation or prerequisite prompt only when exact and safely classified;
- otherwise set the active prompt result to `NO_NEXT_PROMPT`.

## Required Checks

Run:

- repository, branch, worktree, fetch, upstream, and divergence checks;
- complete branch and open-PR inventory;
- relevant merge-base, unique-commit, changed-path, and authority-overlap review;
- snapshot-mutation writer/admission matrix;
- HP-zero/retirement authority matrix;
- campaign-publication/account-consumer ordering matrix;
- migration and partial-failure matrix;
- focused tests only where needed to prove disputed current behavior;
- label and path collision scans;
- documentation-only changed-path audit;
- conflict-marker and trailing-whitespace scans;
- `git diff --check`;
- complete documentation diff review.

Do not run broad workspace typecheck.

## Completion Report

Report:

- starting commit and repository state;
- exact three-dependency closure result;
- accepted activation, continuity-admission, and account-publication contract;
- migration and failure behavior;
- exact later package or `NO_PACKAGE`;
- label class and exact label only when supported;
- branches and PRs inspected and retained triggers;
- disposition changes or branch actions;
- files changed;
- checks run;
- risks and follow-up notes;
- installed next prompt or `NO_NEXT_PROMPT`.
