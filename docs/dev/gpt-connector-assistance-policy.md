# GPT Connector Assistance Policy

Date: 2026-07-29

Status: durable repository workflow instruction; applies to ChatGPT via GitHub Connector work unless a more specific current prompt or explicit user instruction narrows it

## 1. Purpose

ChatGPT should act as an active repository collaborator rather than only a passive reviewer or prompt writer. It should continually look for work that can be completed safely through the GitHub Connector to reduce avoidable Codex workload, improve future Codex readiness, preserve repository clarity, and surface decisions that need user direction.

The objective is not to maximize the number of connector commits. The objective is to perform the smallest useful work on the least expensive safe execution surface while preserving owner boundaries, current routing, validation discipline, user control over product direction, and complete branch lifecycle handling.

## 2. Proactive Assistance Requirement

During repository inspections, handoffs, roadmap discussions, and Codex coordination, ChatGPT should actively identify and, when authorized, perform useful connector-safe work in these categories:

1. evidence collection that helps the active Codex run;
2. documentation or source-map preparation for likely future Codex runs;
3. fully parallel read-only or documentation-only audits that do not overlap the active Codex edit surface;
4. narrow repository-maintenance work such as stale-pointer correction, supersession classification, retention inventories, branch disposition, and focused documentation cleanup;
5. tiny, obvious, low-risk bug fixes or metadata corrections that can be proven from repository evidence and do not require local execution to validate safely;
6. prompt hardening, handoff clarification, acceptance criteria, changed-path locks, and test-plan preparation;
7. issue, pull-request, branch, artifact, or historical-document disposition audits;
8. user-context collection when a product, design, canon, UX, balance, or sequencing decision would materially benefit from explicit direction;
9. other bounded connector work that safely removes clerical, inspection, packaging, documentation, or branch-triage burden from Codex.

ChatGPT should not wait for the user to name every useful pass. It should notice safe opportunities, explain the value and conflict posture, and proceed when the user has authorized that class of work or when the task is an obvious part of the requested repository maintenance.

## 3. Least-Powerful-Safe-Tool Rule

Use the least powerful execution surface that can complete the work without lowering quality or confidence.

Prefer ChatGPT via GitHub Connector for:

- small repository-aware documentation edits;
- focused audits and source maps;
- prompt and handoff preparation;
- exact file, branch, commit, PR, and route inspection;
- one-file or similarly tiny corrections with clear repository-local proof;
- parallel evidence passes;
- retention, supersession, and disposition inventories;
- preparing acceptance matrices, changed-path lists, validation requirements, and branch integration recommendations for Codex.

Reserve Codex for work that materially benefits from or requires:

- a local working tree;
- executing tests, linters, builds, scripts, or generated-output checks;
- broad or coupled multi-file implementation;
- source/runtime/schema/content changes whose correctness depends on execution;
- migrations, dependency changes, generated files, or substantial refactors;
- iterative edit-test-debug loops;
- branch rebases, semantic conflict resolution, integration validation, or cleanup that cannot be resolved safely from remote repository evidence alone.

Do not route work to Codex merely because Codex could do it. Route it to Codex when local execution, implementation breadth, branch operations, or risk makes Codex the appropriate owner.

## 4. Parallel Connector Passes

When Codex is working, ChatGPT should look for passes that can run independently from the same accepted base commit.

A parallel pass should normally:

- use its own branch;
- create or update only a narrowly named document or tiny isolated file set;
- avoid files the active Codex prompt may edit;
- avoid current prompt, output, handoff, roadmap, sequence, planning-anchor, and backlog files unless the parallel task explicitly owns coordination maintenance;
- avoid implementation files unless the user explicitly authorizes a tiny proven fix;
- state its source commit;
- state that it does not advance the active route or version;
- preserve isolated and noncontrolling branches;
- be compared against its source commit before completion;
- be entered in `docs/dev/branch-disposition-register.md` with a current disposition and review trigger;
- remain unmerged until the active Codex result is inspected when overlap risk exists.

Useful parallel passes include UI ownership audits, engine mutation source maps, content-coverage audits, schema-readiness audits, PR disposition reviews, temporary-artifact inventories, test-gap audits, and future-package evidence matrices.

Do not create parallel work merely to appear productive. Each pass must answer a real repository question, reduce future effort, expose a blocker, or improve execution safety.

## 5. Branch Lifecycle Responsibility

`docs/dev/branch-lifecycle-and-integration-policy.md` controls branch inspection, integration, retention, supersession, and deletion. `docs/dev/branch-disposition-register.md` records the current known branch and PR posture.

ChatGPT must:

- inspect the exact branch diff, source commit, head commit, merge base, changed paths, and current-route overlap before recommending integration;
- classify connector-created branches as `ACTIVE_WORK`, `CANDIDATE_INTEGRATION`, `HOLD_NAMED_CONSUMER`, `PROTECTED_REFERENCE`, `SUPERSEDED_PRESERVE_EVIDENCE`, `ABANDON_SAFE_TO_DELETE`, or `MERGED_RETIRE`;
- record a named review trigger and retirement condition rather than leaving branches indefinitely unclassified;
- surface stale, conflicting, redundant, merged-but-not-retired, and abandoned branches to Codex or the user;
- prepare exact integration guidance for Codex when local rebase, tests, build, schema/content validation, generated-output review, or semantic conflict resolution is required;
- verify equivalent preservation before recommending branch deletion;
- never treat a clean textual merge as proof of semantic compatibility;
- never delete a protected branch or a branch with an incomplete named consumer;
- report the branch and PR lifecycle posture in connector completion reports.

ChatGPT may directly merge, close, or delete only when the user has authorized that action, the connector supports it safely, the exact ref/PR is verified, and the branch policy's evidence and validation requirements are satisfied. Otherwise it must prepare a decision-complete Codex or human integration instruction.

Connector-created documentation branches should normally be reviewed for integration at the next route checkpoint relevant to their contents or during a dedicated documentation integration pass. They should not be retained indefinitely merely because they are low risk.

## 6. Aid To Active Codex Work

Before or during a Codex run, ChatGPT should consider preparing:

- exact live-file inventories;
- owner and dependency matrices;
- changed-path allowlists and protected-path lists;
- known baseline failures and non-gates;
- focused validation commands;
- expected record counts, IDs, and distributions;
- stale or superseded authority warnings;
- likely merge-conflict areas;
- acceptance-audit checklists;
- source citations and prior-decision reconciliations;
- branch and PR inventories with proposed dispositions;
- user decisions that should be obtained before implementation begins.

This preparation should reduce Codex inspection and clerical work without predetermining implementation conclusions that require local evidence.

## 7. Tiny Bug-Fix Authority

ChatGPT may fix a simple bug through the connector only when all of the following are true:

1. the defect is concrete and directly visible in repository evidence;
2. the intended correction is unambiguous;
3. the patch is tiny and isolated;
4. it does not alter game balance, canon, owner authority, save shape, migration behavior, dependency posture, generated output, or broad runtime behavior;
5. correctness does not materially depend on running local tests or builds;
6. no active Codex prompt owns the same file or behavior;
7. the change can be reviewed completely through the connector;
8. the completion report clearly states what was and was not validated.

Examples may include a broken documentation link, an objectively stale pointer, a misspelled exact identifier in non-executable documentation, duplicate registration text in a planning file, or another equally narrow correction.

When any condition is not met, prepare the diagnosis and exact repair guidance for Codex instead of applying the change remotely.

## 8. Documentation Maintenance

ChatGPT should keep repository documentation useful and trustworthy when safe to do so.

It should look for:

- stale current-state pointers;
- contradictory route labels;
- superseded prep presented as current authority;
- temporary artifacts whose consumers are complete;
- dead or duplicate documentation;
- missing source identity or integrity notes;
- outdated counts or path references;
- incomplete handoff constraints;
- prompt omissions that could cause scope drift;
- historical documents that need classification rather than deletion;
- branches and PRs whose dispositions are stale or incomplete.

Do not rewrite large documents from partial fetches. Do not delete source or research artifacts until every retention and consumer condition is proven. Prefer small complete-file edits, new focused audits, or explicit cleanup proposals.

## 9. User Input And Development Direction

ChatGPT should actively request user input when the answer would materially affect development direction and repository evidence cannot safely decide it.

Suitable user-input topics include:

- product priorities among multiple dependency-safe routes;
- fictional canon, names, cultures, locations, factions, people, or lore not already owned by a durable source;
- desired UX emphasis, information density, visual style, accessibility priorities, or player workflow;
- acceptable abstraction level, world scale, content density, and regional diversity;
- balance goals, difficulty philosophy, pacing, lethality, recovery, economy, or reward posture;
- scope cuts and milestone definitions;
- whether to preserve, replace, integrate, or abandon a stale experimental branch or PR;
- choices where several technically valid owner models imply meaningfully different game behavior.

Ask for context early enough to influence planning, not after Codex has implemented an avoidable assumption. Keep questions concrete and decision-bearing. Do not ask the user to decide facts that repository inspection or accepted authority already resolves.

When a route is technically ready but product direction is genuinely ambiguous, pause implementation authorization and obtain the smallest useful user decision.

## 10. Codex Work-Minimization Standard

ChatGPT should minimize Codex work that has no significant reason to be performed by Codex.

In practice:

- connector audits should provide Codex with already-reconciled evidence rather than asking Codex to rediscover it;
- connector documentation should close clerical and packaging gaps before implementation;
- small prompt corrections should be made directly when safe;
- future passes should be prepared while Codex handles local implementation;
- acceptance criteria should be explicit enough that Codex can implement and validate without repeatedly resolving old planning ambiguity;
- user context should be collected before it becomes an implementation blocker;
- branch integration guidance should identify exact commits, paths, validation, and deletion conditions;
- work should not be duplicated across ChatGPT and Codex without a clear independent-verification purpose.

Independent acceptance audits remain valuable and are not considered wasteful duplication when they verify a parent package against explicit criteria.

## 11. Safety And Authority Boundaries

Proactive assistance does not override repository authority.

ChatGPT must still:

- obey the current prompt and handoff precedence;
- preserve version-label discipline;
- keep planning separate from implementation permission;
- preserve static/runtime and owner/mutation boundaries;
- avoid inferred canon;
- avoid broad changes from partial repository reads;
- avoid claiming tests or CI passed when they were not run;
- avoid modifying protected branches unless expressly assigned;
- avoid merging or promoting parallel evidence automatically without the branch-policy review;
- keep player-facing language, uncertainty, provenance, and setting constraints intact;
- disclose conflicts, incomplete evidence, and validation limits.

When a potentially useful connector task conflicts with the active route, defer it or isolate it rather than silently competing with Codex.

## 12. Completion And Handoff

For connector work, report:

- source commit;
- branch and commit created;
- exact files changed;
- evidence inspected;
- scope and authority classification;
- validation actually performed;
- unresolved risks;
- merge or rebase posture;
- branch/PR disposition and retirement trigger;
- whether user input is still needed;
- exact next Codex or connector action, when one is justified.

After completing a repository task, ChatGPT should briefly reassess whether another safe connector pass can materially help the same development objective. It should continue only when authorized and useful, not indefinitely expand scope.