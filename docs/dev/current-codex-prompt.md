# Ashen Reef Survey Minimum Save Identity And Accepted-State Publication Decision

## Run Identity

Unversioned `Ashen Reef Survey Minimum Save Identity And Accepted-State Publication Decision`

Label class: unversioned

Parent version: not applicable

Milestone impact: `supports_current_band`

Suggested commit:

`docs(save): define minimum survey persistence boundary`

## Purpose

Decide the smallest Normal-only save identity, provenance, migration, and accepted-state publication boundary required before the Ashen Reef survey can persist authoritative occurrence, result, and consequence receipts.

This run is documentation and decision only. It must return either:

- one exact dependency-closed persistence foundation and its policy-derived label class; or
- `NO_PACKAGE`.

Do not implement the survey command. Do not assign `0.6.9`, `0.7.0`, or a support suffix in advance.

## Required Reading

Read:

- `AGENTS.md`;
- `README.md`;
- `docs/dev/branch-lifecycle-and-integration-policy.md`;
- `docs/dev/branch-disposition-register.md`;
- current output, handoff, prompt, roadmap, sequenced plan, continuity brief, historical/deferred register, planning-anchor reconciliation, backlog, and static-content program;
- `docs/design/ashen-reef-survey-activity-advancement-scope-and-owner-contract-decision.md`;
- `docs/design/post-lethal-process-static-foundation-next-capability-classification-gate.md`;
- `docs/design/internal-versioning-and-release-milestone-policy.md`;
- `docs/design/stakes-identity-campaign-save-provenance-checkpoint-topology-and-technical-recovery-contract-decision.md`;
- `docs/design/occurrence-contract-taxonomy-and-commitment-clarification.md`;
- `docs/design/occurrence-identity-named-uncertainty-channels-outcome-commitment-and-correction-contract-decision.md`;
- `docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md`;
- `docs/design/difficulty-presets-grim-world-rules-and-stakes-separation-decision.md`;
- current `SaveSnapshot`, session, player-save metadata, run-difficulty, account/run-history, persistence, local save-envelope, new-game, load, and save-control sources;
- current save/load, account-storage, new-game, run-lifecycle, command-serialization, and roundtrip tests;
- the isolated `prep/integrated-gameplay-0-7-readiness-audit` branch through read-only Git inspection only.

## Execution Gate

1. Verify repository, branch, clean worktree, remote alignment, current head, and active route.
2. Run `git fetch --all --prune`; inventory relevant local and remote branches and open PRs; inspect merge bases, unique commits, changed paths, and current-route overlap; refresh `docs/dev/branch-disposition-register.md` for proven lifecycle facts.
3. Confirm the survey owner decision returned `NO_PACKAGE`.
4. Confirm `0.7.0` remains `NOT_READY` and no primary implementation label is active.
5. Reproduce the current version-6 save envelope, snapshot identity fields, account/run linkage, write/load validation, and current-data compatibility posture.
6. Reproduce the accepted campaign/continuity/artifact/publication and occurrence-persistence boundaries.
7. Decide whether any branch integration, PR closure, or branch deletion is due inside this run. Perform no branch action unless it satisfies the branch policy, fits the documentation-only scope, and does not broaden the active decision.
8. Stop without edits if the worktree is dirty, required evidence conflicts, a required source cannot be inspected safely, or a proposed branch action lacks semantic review or required validation.

## Required Decisions

Decide explicitly:

1. the minimum live Normal-only campaign-rules/Stakes identity needed by the survey slice;
2. exact campaign, continuity, character, artifact, and publication identities required now, and which accepted identities may remain deferred;
3. whether identity belongs in `SaveSnapshot`, the stored envelope, account profile, or a separate owner;
4. identity creation for new games;
5. deterministic, idempotent migration/default behavior for current version-6 active saves;
6. why `accountId`, `playerId`, `sourceRunId`, slot id, timestamps, snapshot version, and ticks cannot substitute;
7. minimum artifact provenance and accepted-state publication ordering;
8. candidate write, validation/verification, publication, failure, and recovery behavior;
9. the minimum persisted survey occurrence/result/consequence receipt container and its owner;
10. duplicate delivery and restart lookup behavior;
11. correction/supersession links required now versus deferred tooling;
12. current-save compatibility, corruption, copied-slot, and stale-artifact behavior;
13. exact later paths, tests, migration gates, and protected boundaries;
14. whether one implementation package is dependency-closed and how policy classifies it;
15. whether any live branch contains save, persistence, occurrence, receipt, or publication evidence relevant to this decision, and its exact disposition without treating branch content as current authority automatically.

## Minimum-Slice Constraint

The selected boundary must support:

- stable campaign and continuity scope for one active Normal campaign;
- one authoritative current snapshot/artifact;
- current manual and quick-save behavior;
- accepted survey receipts surviving save/load/restart;
- idempotent current-data migration;
- failure that preserves the previously readable authoritative save;
- UI success only after accepted publication.

It must not implement:

- Committed checkpoint selection or ladders;
- Ironbound one-head enforcement;
- cloud/offline conflict resolution;
- a save browser redesign;
- hidden multi-generation recovery beyond the minimum required for safe publication;
- death, closure, settlement, succession, Legacy payout, estate, or account reward changes;
- the survey command itself.

If the accepted save authority proves any omitted element is a mandatory dependency, include only its minimum non-UI foundation or return `NO_PACKAGE`.

## Receipt Persistence Questions

Decide whether the minimum foundation should reserve or implement:

- survey receipt collection location;
- command, occurrence, result, consequence, correction, and projection-safe links;
- semantic policy and material-normalization versions;
- applied/pending/failed/rejected/superseded posture;
- bounded retention for the four survey stages;
- lookup by request and occurrence identity;
- serialization and current-data defaulting;
- no reconstruction from flags, events, notifications, Chronicle, ticks, hashes, or slot addresses.

Do not create a generic gameplay event bus or generic effect engine.

## Required Evidence

Inspect and record:

- `SaveSnapshot`, `SessionState`, `PlayerSaveMetadata`, run-difficulty, and account/run-history types;
- `serializeSnapshot(...)` and `deserializeSnapshot(...)`;
- version-6 stored-save envelope, validation, write, load, inspect, delete, and account-index behavior;
- new-game and inherited-start identity creation;
- manual and quick-save UI/control paths;
- current corruption/incompatibility behavior;
- current save/load and command serialization tests;
- accepted save identity graph, Normal branching, write/verify/publication ordering, occurrence links, migration, and copy protection;
- the isolated readiness audit's minimum-save recommendation after refresh;
- live branch and PR inventory, including every register entry relevant to save, occurrence, survey, persistence, or current coordination.

## Prohibited Scope

Do not:

- edit engine, app, shared contract, content, schema, validator, test, save, migration, dependency, generated, asset, or gameplay files;
- implement identity fields, save envelopes, publication, migration, receipts, commands, UI, or storage;
- implement the survey command or any survey consequence;
- change save-slot behavior, delete saves, rewrite account history, or migrate live user data;
- implement Committed, Ironbound, checkpoint, death, closure, settlement, succession, estate, reward, cloud, networking, encryption, anti-cheat, or broad recovery features;
- infer occurrence identity from event, Chronicle, notification, tick, hash, timestamp, slot, or projection state;
- merge, modify, delete, rebase, force-update, or cherry-pick any `PROTECTED_REFERENCE` branch;
- merge unrelated candidate branches merely to reduce branch count;
- delete any branch without reachability/equivalent-preservation proof, named-consumer closure, linked-PR disposition, exact-ref verification, and required validation;
- run broad workspace typecheck as a decision gate.

## Allowed Documentation Scope

If the execution gate passes:

- add `docs/design/ashen-reef-survey-minimum-save-identity-and-accepted-state-publication-decision.md`;
- update current output, handoff, prompt, roadmap, sequenced plan, continuity brief, historical/deferred register, planning anchor, backlog, and static-content program only for proven routing facts;
- update `docs/dev/branch-disposition-register.md` only for proven live branch and PR facts;
- integrate a documentation-only branch only when it is directly relevant, semantically current, fully reviewed, validation fits this run, and the action does not broaden the save decision; otherwise retain it with an exact review trigger;
- install exactly one later prompt only if one package or prerequisite is exact, dependency-closed, and safely classified;
- otherwise set the current prompt result to `NO_NEXT_PROMPT`.

## Required Checks

Run:

- repository, branch, worktree, fetch, upstream, and divergence checks;
- complete local/remote branch and open-PR inventory after prune;
- merge-base, unique-commit, changed-path, and authority-overlap review for relevant branch-register entries;
- current-versus-isolated-readiness-branch read-only comparison;
- exact save identity, writer, reader, publication, and migration inventory;
- accepted-versus-live save contract matrix;
- survey receipt persistence dependency matrix;
- label and path collision scans;
- documentation-only changed-path audit;
- conflict-marker and trailing-whitespace scans;
- `git diff --check`;
- complete documentation diff review.

Run focused tests only when necessary to resolve a disputed current behavior claim. Do not run broad workspace typecheck.

## Completion Report

Report:

- starting commit and repository state;
- current save identity/publication reality;
- accepted minimum Normal-only identity and provenance boundary;
- migration and failure decisions;
- survey receipt persistence decision;
- dependency result;
- exact later package or `NO_PACKAGE`;
- label class and exact label only when supported;
- exact later paths and checks;
- protected boundaries;
- branches and PRs inspected;
- disposition changes, integrations, closures, or deletions performed and validation for each;
- retained branches and their exact next review triggers;
- files changed;
- risks and follow-up notes;
- installed next prompt or `NO_NEXT_PROMPT`.