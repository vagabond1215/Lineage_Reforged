# Historical Recovery Fork Evidence Verifiability And Parent Acceptance Reopening Decision

Date: 2026-08-02

Label class: unversioned focused decision

Parent version: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`

Milestone impact: `supports_current_band`

Execution posture: documentation-only decision with read-only executable verification

Suggested commit:

`docs(save): decide historical recovery fork authority`

## Purpose

Resolve the reopened `0.6.9` acceptance boundary after inspection found:

1. required `0.6.9.9` implementation and `0.6.9.10` independent-audit prompt transitions were not installed before production repair and parent acceptance were recorded;
2. the linked-fork implementation proves arbitrary-depth parent/child continuity ancestry and the current edge, but historical mutation, tick, source-artifact, and source-publication fields may not have independent durable corroboration once their edge is no longer current.

Decide the exact historical-edge authority contract, classify the existing implementation commit `cbad987028d81c5ecdc35403333ec920d0ea5e53` under that contract, and install the smallest valid successor route.

Do not repair production, accept parent `0.6.9`, or run the Ashen Reef survey decision in this route.

## Current Disposition

Treat the repository as follows until this decision completes:

- parent `0.6.9`: `ACCEPTANCE_REOPENED_PENDING_FOCUSED_DECISION`;
- `0.6.9.8`: historical independent evidence with conclusion `REPAIR_REQUIRED`;
- `0.6.9.9` / `cbad987028d81c5ecdc35403333ec920d0ea5e53`: `IMPLEMENTED_PENDING_AUTHORITY_RECONCILIATION_AND_REAUDIT`;
- claimed `0.6.9.10` acceptance: superseded pending this decision and a properly installed successor;
- Ashen Reef survey receipt-foundation decision: blocked;
- survey behavior: unimplemented;
- `0.7.0`: `NOT_READY`.

Do not revert the existing implementation by inference. It remains repository evidence and may become the accepted implementation only after the contract is decided and a separately installed independent re-audit passes.

## Mandatory Repository Orientation

Follow `AGENTS.md` and `docs/dev/repository-first-agent-work-protocol.md` completely.

Fetch and prune all remotes. Record:

- clean worktree and current branch/upstream;
- inspected base, starting head, live remote head, and final documentation head;
- ancestry from `5fe11910e6b4951483994ee23529150a697f78cc` through the current head;
- all commits after the hardened `0.6.9.8` prompt and their exact changed files;
- all local and remote branches, open PRs, merge bases, divergence, unique paths, semantic overlap, and current dispositions;
- hosted combined-status and workflow-run availability for `cbad987`, `f68d878`, the starting head, and the final documentation commit.

Read complete current versions of:

- `docs/dev/current-codex-prompt.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/current-codex-output.md`;
- `docs/dev/version-0.6.9-parent-acceptance-reopening-and-historical-fork-verifiability-review-2026-08-02.md`;
- `docs/dev/version-0.6.9.8-pre-audit-completion-continuity-lineage-review-2026-08-02.md`;
- `docs/design/normal-defeat-recovery-completion-lineage-repair-decision.md`;
- `docs/design/normal-defeat-recovery-continuity-and-destination-provenance-contract-decision.md`;
- `docs/design/normal-stakes-campaign-persistence-foundation-acceptance-audit.md`;
- `docs/design/internal-versioning-and-release-milestone-policy.md`;
- `docs/dev/repository-first-agent-work-protocol.md`;
- `docs/dev/codex-failure-patterns-and-verification-guardrails.md`;
- `docs/dev/historical-version-and-deferred-route-register.md`;
- `docs/design/current-planning-anchor-reconciliation.md`;
- current roadmap, sequenced plan, continuity brief, backlog, static-content program, branch policy, and branch register;
- the live shared ledger contract, campaign-session fork emitter, completed-replay validator, focused persistence tests, save serialization, publication owners, and any durable campaign-control or artifact records that might corroborate historical edges.

Use `git show` or equivalent repository inspection to read the exact current prompt, handoff, and output at:

- `5fe11910e6b4951483994ee23529150a697f78cc`;
- `551d14bc483054aac129f7a081489b70efb46521`;
- `cbad987028d81c5ecdc35403333ec920d0ea5e53`;
- `f68d878cd1969e861f4fe7a793412876ba48b3a8`.

Do not infer route authority from commit messages alone.

## Decision Boundary

This run may:

- inspect source, tests, history, branches, PRs, and persisted contracts;
- create temporary read-only probes and remove them before completion;
- run focused existing tests needed to characterize behavior;
- update design, audit, prompt, handoff, output, planning, and branch-coordination documents after the decision.

This run must not modify:

- production source;
- tests;
- shared types;
- snapshot or envelope formats;
- serializers or migrations;
- dependencies;
- content, assets, UI, or survey behavior;
- branches or PRs.

If a production change is required, install a complete successor repair prompt and stop.

## Question 1 - Route-Authority Reconciliation

Determine and document:

1. whether a runnable `0.6.9.9` implementation prompt was installed before `cbad987`;
2. whether a runnable independent `0.6.9.10` prompt was installed before `f68d878`;
3. which repository workflow requirements were bypassed, if any;
4. whether the existing implementation may be retained as candidate implemented evidence or must be reverted before a valid route can proceed;
5. what exact independent successor is required before parent acceptance can be reconsidered.

Do not retroactively claim that a focused decision document was itself the installed implementation prompt unless the repository's established route protocol explicitly proves that equivalence.

## Question 2 - Durable Evidence Inventory

For every field on a historical `continuity_fork` edge, identify all independent durable corroboration available after at least two later descendant forks:

- `sourceId`;
- `acceptedAtTick`;
- `parentContinuityId`;
- `childContinuityId`;
- `forkedFromArtifactId`;
- `forkedFromPublicationId`.

For each field classify its current proof as exactly one of:

- `INDEPENDENTLY_CROSS_VERIFIABLE`;
- `CHAIN_STRUCTURALLY_VERIFIABLE`;
- `CURRENT_EDGE_ONLY_VERIFIABLE`;
- `SELF_ASSERTED_LEDGER_EVIDENCE`;
- `NOT_DURABLY_PROVABLE`.

Inspect, but do not assume, possible corroboration from:

- current campaign identity;
- retained fork entries;
- receipt and correction entries;
- artifact and publication records;
- slot addresses;
- campaign control state;
- mutation-result retention;
- save metadata;
- Chronicle or notification projections;
- account publication receipts;
- branch or caller state.

A value repeated only within the same mutable snapshot evidence family is not automatically independent corroboration.

## Question 3 - Executable Characterization Matrix

Using untouched synchronized production source, create temporary probes or focused test invocations that characterize at least:

### Recovery edge after deep descent

Create valid lineage:

```text
C0 original defeat
└─ C1 recovery completion
   └─ C2 later fork
      └─ C3 later fork
```

At `C3`, change exactly one historical recovery-edge field at a time while preserving parent/child continuity:

- source artifact;
- source publication;
- source mutation, if target selection can remain stable;
- accepted tick to another valid monotonic integer.

Attempt explicit completed replay and record exact behavior.

### Intermediate historical edge

At `C3`, change exactly one field on the `C1 -> C2` edge:

- source mutation;
- accepted tick;
- source artifact;
- source publication;
- parent continuity;
- child continuity.

Record which changes fail and which pass.

### Current edge control

Confirm current-edge source mutation, parent, source artifact, and source publication remain cross-checked against current campaign identity and fail closed when changed.

### Structural corruption

Confirm duplicate incoming child edges, cycles, disconnected paths, missing recovery edge, wrong recovery mutation, wrong recovery tick, and original-continuity substitution remain rejected.

All probes must be removed before commit. Do not add tests in this decision run.

## Question 4 - Exact Historical-Edge Contract

Decide, field by field, what completed replay is required to prove after an edge becomes historical.

Choose one coherent contract, or a precisely bounded hybrid:

### Model A - Continuity graph authority

- parent/child continuity linkage and unique acyclic descent are acceptance-critical;
- the recovery edge remains bound to receipt identity and required recovery mutation/tick facts;
- current campaign identity authenticates the final/current edge;
- historical source mutation, tick, artifact, and publication fields beyond independently corroborated facts are descriptive retained provenance subject to shape and ordering checks, not claims of tamper detection.

### Model B - Fully authenticated historical edges

- every named field remains acceptance-critical on every historical edge;
- additional durable evidence, chained integrity, or another bounded persisted contract is required;
- existing implementation is insufficient until repaired.

### Model C - Bounded mixed authority

- name every historical field that remains exact authority;
- name every field that becomes descriptive or structural evidence;
- provide the independent corroboration for each exact field;
- prohibit broader wording than the persisted format can prove.

The decision must explain why its model is compatible with:

- immutable artifact and verified publication principles;
- copied artifacts and slot independence;
- restart and caller-state loss;
- old format-v2 snapshots;
- failure-before-effects requirements;
- bounded save growth;
- no generic framework expansion.

## Question 5 - Existing Implementation Classification

Classify `cbad987028d81c5ecdc35403333ec920d0ea5e53` as exactly one:

- `IMPLEMENTATION_CONFORMS_REAUDIT_REQUIRED`;
- `IMPLEMENTATION_PARTIALLY_CONFORMS_REPAIR_REQUIRED`;
- `IMPLEMENTATION_CONTRACT_INDETERMINATE_NO_PACKAGE`;
- `IMPLEMENTATION_MUST_BE_REVERTED_BEFORE_SUCCESSOR`.

A conforming classification does not accept parent `0.6.9`. It authorizes installation of a separate independent acceptance audit only.

A repair-required classification must identify the smallest production and test surface and install a complete repair prompt. Do not implement it here.

## Mandatory Outcome

Return exactly one decision outcome.

### `DECISION_ACCEPTED_REAUDIT_AUTHORIZED`

Use only when the exact contract is decided and the existing implementation conforms without production changes.

Then:

1. amend the lineage decision and parent acceptance authority to state the exact historical-field semantics;
2. preserve prior claimed acceptance as superseded history;
3. install a complete independent support audit prompt using the next valid support suffix under repository policy;
4. require that audit to begin from a synchronized checkout containing `cbad987` and this decision;
5. require fresh characterization, focused tests, regression group, build, bounded TypeScript audit, serialization/mirror checks, branch review, diff checks, and hosted-status reporting;
6. keep parent `0.6.9`, Ashen Reef, and `0.7.0` blocked until that audit passes.

### `DECISION_ACCEPTED_REPAIR_AUTHORIZED`

Use when the exact contract is decided but `cbad987` does not satisfy it.

Then:

1. identify the smallest exact repair surface;
2. install a complete versioned support-repair prompt under repository policy;
3. include a mandatory independent post-repair audit successor;
4. prohibit production implementation in this decision run;
5. keep parent `0.6.9`, Ashen Reef, and `0.7.0` blocked.

### `NO_PACKAGE`

Use only when repository evidence cannot select the authority model without product direction.

Then ask one smallest exact user question and preserve this decision as the active route.

## Required Deliverable

Create one permanent decision document under `docs/design/` containing:

- run identity, date, heads, label class, and milestone impact;
- route-authority timeline and conclusion;
- complete durable-evidence inventory;
- executable characterization matrix and results;
- field-by-field authority classification;
- selected contract model;
- compatibility and migration posture;
- existing implementation classification;
- exact decision outcome;
- exact successor prompt or smallest user question;
- branch/PR and hosted-validation report.

After deciding, update all current coordination surfaces that currently claim parent acceptance or an active Ashen Reef route, including:

- current prompt;
- current output;
- current handoff;
- parent acceptance audit;
- lineage decision;
- historical/deferred register;
- planning-anchor reconciliation;
- roadmap;
- sequenced plan;
- continuity brief;
- backlog;
- static-content program;
- branch register when its named consumer status changes.

Preserve dated historical chronology. Mark prior acceptance as superseded rather than deleting it.

## Validation

Run at minimum:

- focused executable characterization described above;
- `node --test tests\unit\campaign-persistence-foundation.test.mjs` to preserve the current baseline, without editing tests;
- documentation path/reference checks;
- `git diff --check`;
- complete unstaged, staged, and post-commit diff inspection;
- final worktree, branch/upstream, remote-head, combined-status, and workflow-run checks.

A production build or full regression group is not required for this documentation-only decision unless needed to resolve a disputed claim. The installed successor must require the full validation appropriate to its class.

## Scope Exclusions

Do not:

- accept parent `0.6.9`;
- implement or revert lineage production code;
- edit tests;
- run the Ashen Reef survey decision;
- implement survey receipts or behavior;
- change snapshot or envelope versions;
- add a generic lineage, integrity, replay, event, or transaction framework;
- add dependencies, content, assets, UI, or unrelated cleanup;
- merge, close, delete, rebase, or force-update branches or PRs.

## Completion Report

Report:

1. inspected, starting, decision, final, and live remote heads;
2. route-authority timeline and skipped-transition conclusion;
3. historical-field evidence classification;
4. characterization cases and exact results;
5. selected contract model;
6. existing implementation classification;
7. exact decision outcome;
8. successor prompt identity and class;
9. files changed;
10. checks and counts;
11. branch/PR and hosted-validation state;
12. exact status of parent `0.6.9`, Ashen Reef, and `0.7.0`.
