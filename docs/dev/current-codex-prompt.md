# Ashen Reef Survey Activity Advancement Scope And Owner Contract Decision

## Run Identity

Unversioned `Ashen Reef Survey Activity Advancement Scope And Owner Contract Decision`

Label class: unversioned

Parent version: not applicable

Milestone impact: `supports_current_band`

Suggested commit:

`docs(activity): define survey advancement owner contract`

## Purpose

Decide the smallest owner-correct contract that could later move only the existing Ashen Reef survey advancement path from UI-authored mutation to an engine-owned deterministic plan/command/result boundary.

This run is documentation and decision only. It must return either:

- one exact dependency-closed later package and its policy-derived label class; or
- `NO_PACKAGE`.

Do not assign `0.6.9`, `0.7.0`, or a support suffix in advance.

## Required Reading

Read:

- `AGENTS.md`;
- `README.md`;
- current output, handoff, prompt, roadmap, sequenced plan, continuity brief, historical/deferred register, planning-anchor reconciliation, backlog, and static-content program;
- `docs/design/post-lethal-process-static-foundation-next-capability-classification-gate.md`;
- `docs/design/internal-versioning-and-release-milestone-policy.md`;
- `docs/design/activity-resolution-existing-system-reuse-audit.md`;
- `docs/design/activity-resolution-depth-and-attempt-state-contract-plan.md`;
- `docs/design/location-recognition-and-geographic-knowledge-taxonomy.md`;
- `docs/design/occurrence-contract-taxonomy-and-commitment-clarification.md`;
- `docs/design/occurrence-identity-named-uncertainty-channels-outcome-commitment-and-correction-contract-decision.md`;
- `docs/design/stakes-identity-campaign-save-provenance-checkpoint-topology-and-technical-recovery-contract-decision.md`;
- `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md`;
- `docs/design/quest-event-chronicle-authority-boundary-decision.md`;
- `docs/design/ui-information-architecture-boundary.md`;
- accepted body/resource and skill-progression sources relevant to the current survey path;
- `apps/rpg-ui/src/game-shell/gameplayLoop.ts`;
- `apps/rpg-ui/src/features/ActivityPanel.tsx`;
- current engine-owned travel, quest acceptance/tracking, activity-selection, synchronization, save, and persistence contracts;
- current focused survey, command, and roundtrip tests;
- the isolated `prep/integrated-gameplay-0-7-readiness-audit` branch through read-only Git inspection only.

## Execution Gate

1. Verify repository, branch, clean worktree, remote alignment, current head, and active route.
2. Confirm the classification gate selected this run as `UNVERSIONED_PREREQUISITE`.
3. Confirm `0.7.0` remains `NOT_READY` and no exact primary implementation label is active.
4. Reproduce the current Ashen Reef preview and execution path exactly.
5. Reproduce the accepted engine command, synchronization, persistence, occurrence, and typed-effect boundaries.
6. Stop without edits if the worktree is dirty, evidence conflicts, a required source is unavailable, or the current survey behavior cannot be characterized safely.

## Required Decisions

Decide explicitly:

1. the exact bounded survey intent and authoritative input facts;
2. eligibility and rejection reasons;
3. one preview/execution material-fact plan;
4. deterministic command identity, snapshot revision, stale, malformed, wrong-player, and incoherent-state behavior;
5. whether command, attempt, occurrence, result, event, and consequence-receipt identities are distinct or safely combined for this bounded deterministic slice;
6. exact accepted-result and rejected-result fields;
7. exact typed proposals and one authoritative affected owner for each applied consequence;
8. atomic application order and rollback/no-mutation behavior;
9. duplicate delivery, equivalent retry, replay, supersession, correction, and reconciliation posture;
10. exact persistence and restart requirements, including whether current `SaveSnapshot` fields suffice;
11. projection boundaries for notification, Chronicle, discovery-facing facts, and notice prose;
12. accepted-only UI application and preview/readiness behavior;
13. exact later files, tests, protected paths, and acceptance gates;
14. whether the later package is dependency-closed and how the version policy classifies it.

## Current Behavior To Characterize

Characterize without changing:

- active tracked `quest.ashen_reef_survey` and Ashen Reef location checks;
- two-tick preview and execution;
- survey metabolic mitigation and attribute profile;
- stamina `-10` and MP `-3`;
- three ordered survey-sector advances;
- General Lore progression and breakthrough-gate behavior;
- ruins confirmation and flora-identification progression;
- discovery entry, operation updates, current-activity transition, notification, Chronicle, notice, and snapshot synchronization;
- completion and already-complete behavior;
- failure and no-mutation behavior;
- save/load preservation of every current authoritative fact.

Do not include survey quest turn-in or rewards.

## Deterministic Slice Boundary

The current survey advancement path has no difficulty check or uncertainty draw.

Decide whether exact deterministic parity can proceed as a domain-specific command without first implementing the general `Competence, Difficulty, Familiarity, And Compression Authority Decision`.

If yes:

- state why this does not authorize a shared or uncertain activity resolver;
- preserve the general decision as a prerequisite for later difficulty-, familiarity-, margin-, recovery-, aggregation-, or named-uncertainty behavior.

If no:

- identify the exact current behavior that requires the broader authority;
- return `NO_PACKAGE` or select that exact unversioned prerequisite.

Do not invent difficulty, result bands, RNG, failure chance, familiarity, compression, recovery, or balance.

## Owner Matrix Requirements

Classify at minimum:

- clock/time;
- metabolic body state;
- HP/MP/stamina resources;
- skill progress and breakthrough gates;
- quest sector/completion facts;
- discovery fact;
- operation state;
- current-activity pointer;
- synchronization;
- notification and Chronicle projection;
- save/persistence;
- UI notice/readiness projection.

For each, record:

- current writer and fact source;
- proposed owner;
- proposal/application/receipt posture;
- persisted identity or state;
- retry/correction rule;
- whether it is included, adapted, projected, or excluded.

Do not create a generic effect owner. Typed effects remain owner-routed proposals.

## Required Evidence

Inspect and record:

- exact `gameplayLoop.ts` survey helpers and branch order;
- current UI call site and unconditional snapshot application;
- current command shapes, deterministic identity, revision/stale checks, event construction, atomic clone/apply, and accepted-only bridges;
- synchronization coverage for every survey-mutated surface;
- snapshot serialization and local save behavior;
- focused skill-gating and command tests;
- occurrence/result/receipt identity, commitment, replay, and correction rules;
- generic event-id collision risk and why generic events cannot own the slice;
- branch-isolated readiness recommendations after refresh, without treating them as controlling authority.

## Prohibited Scope

Do not:

- edit engine, app, shared contract, content, schema, validator, test, save, migration, dependency, generated, asset, or gameplay files;
- implement a command, plan, resolver, result, event, receipt, adapter, effect, persistence field, or UI flow;
- implement general activity resolution, competence, difficulty, familiarity, compression, uncertainty, RNG, recovery, or aggregation;
- include survey turn-in, rewards, rivet cargo, generic quest completion, rest, gathering, crafting, inventory transactions, combat, health, care, death, Geography recognition, or map reveal;
- change current survey balance or behavior;
- use notification, Chronicle, event-envelope, tick, wall-clock, or projection identity as occurrence/result/receipt authority;
- infer mutable health readiness;
- merge, modify, delete, rebase, or cherry-pick the isolated readiness branch;
- run broad workspace typecheck as a decision gate.

## Allowed Documentation Scope

If the execution gate passes:

- add `docs/design/ashen-reef-survey-activity-advancement-scope-and-owner-contract-decision.md`;
- update current output, handoff, prompt, roadmap, sequenced plan, continuity brief, historical/deferred register, planning anchor, backlog, and static-content program only for proven routing facts;
- install exactly one later prompt only if one package or prerequisite is exact, dependency-closed, and safely classified;
- otherwise set the current prompt result to `NO_NEXT_PROMPT`.

## Required Checks

Run:

- repository, branch, worktree, fetch, upstream, and divergence checks;
- current-versus-isolated-readiness-branch read-only comparison;
- exact source-call and writer inventory;
- current survey behavior and focused-test inspection;
- command-pattern, persistence, occurrence, effect-owner, and UI-boundary matrices;
- label and path collision scans;
- documentation-only changed-path audit;
- conflict-marker and trailing-whitespace scans;
- `git diff --check`;
- complete documentation diff review.

Run focused tests only when necessary to resolve a disputed behavior claim. Do not run broad workspace typecheck.

## Completion Report

Report:

- starting commit and repository state;
- exact current survey behavior;
- accepted owner/identity/persistence/UI decisions;
- deterministic/general-resolution boundary;
- dependency result;
- exact later package or `NO_PACKAGE`;
- label class and exact label only when supported;
- exact later paths and checks;
- protected boundaries;
- files changed;
- risks and follow-up notes;
- installed next prompt or `NO_NEXT_PROMPT`.
