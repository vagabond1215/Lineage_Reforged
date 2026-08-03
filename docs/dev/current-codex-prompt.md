# Historical Recovery Fork Evidence Verifiability And Parent Acceptance Reopening Decision

Date: 2026-08-03

Revision: connector inspection hardening after live-head, workflow-policy, and parallel-branch review

Label class: unversioned focused decision

Parent version: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`

Milestone impact: `supports_current_band`

Execution posture: documentation-only decision with read-only executable characterization

Suggested commit:

`docs(save): decide historical recovery fork authority`

## Purpose

Resolve the reopened `0.6.9` acceptance boundary after repository inspection established two unresolved issues:

1. no runnable `0.6.9.9` implementation prompt was installed before production commit `cbad987028d81c5ecdc35403333ec920d0ea5e53`, and no separately installed `0.6.9.10` independent-audit prompt preceded the later parent-acceptance claim;
2. the linked-fork implementation proves arbitrary-depth parent/child continuity ancestry and authenticates the current edge, but historical mutation, tick, source-artifact, and source-publication fields may not retain independent durable corroboration after later descendant forks.

Decide the exact historical-edge authority contract, classify the existing implementation under that contract, and install the smallest valid successor route.

Do not repair or revert production, accept parent `0.6.9`, or run the Ashen Reef survey decision in this route.

## Current Disposition

Treat the repository as follows until this decision completes:

- parent `0.6.9`: `ACCEPTANCE_REOPENED_PENDING_FOCUSED_DECISION`;
- `0.6.9.8`: historical independent evidence with conclusion `REPAIR_REQUIRED`;
- `0.6.9.9` / `cbad987028d81c5ecdc35403333ec920d0ea5e53`: `IMPLEMENTED_PENDING_AUTHORITY_RECONCILIATION_AND_REAUDIT`;
- claimed `0.6.9.10` acceptance: superseded pending this decision and a properly installed successor;
- Ashen Reef survey receipt-foundation decision: blocked;
- survey behavior: unimplemented;
- `0.7.0`: `NOT_READY`.

Do not revert the existing implementation by inference. It remains candidate implemented evidence and may become accepted only after this contract decision and a separately installed independent audit.

## Authority And Precedence

Follow `AGENTS.md` and `docs/dev/repository-first-agent-work-protocol.md` completely.

For current execution, use this precedence:

1. this current prompt;
2. `docs/dev/current-gpt-handoff.md`;
3. `docs/dev/current-codex-output.md`;
4. the durable reopening review and focused design decisions;
5. the historical/deferred register and planning-anchor reconciliation;
6. lower-precedence roadmap, plan, brief, backlog, and static-program summaries.

The `## Current Application` paragraph at the end of `docs/dev/repository-first-agent-work-protocol.md` still describes `0.6.9.8` as active. Treat that paragraph as a stale current-state pointer, not as an override of this prompt. Update it after this decision so the durable protocol no longer names a superseded route.

Do not infer route authority from commit messages alone.

## Mandatory Repository Orientation

Fetch and prune all remotes. Record:

- clean worktree and current branch/upstream;
- inspected base, starting head, live remote head, decision commit, final coordination head, and post-push live head;
- ancestry from `5fe11910e6b4951483994ee23529150a697f78cc` through the current head;
- every commit after the hardened `0.6.9.8` prompt and its exact changed files;
- every local and remote branch and every open PR, including merge bases, divergence, unique paths, semantic overlap, current disposition, and named review trigger;
- hosted combined-status and workflow-run availability for `cbad987`, `f68d878`, the starting head, the decision commit, and the final coordination head.

Read the complete current versions of:

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
- `docs/dev/gpt-connector-assistance-policy.md`;
- `docs/dev/codex-failure-patterns-and-verification-guardrails.md`;
- `docs/dev/historical-version-and-deferred-route-register.md`;
- `docs/design/current-planning-anchor-reconciliation.md`;
- `docs/dev/project-roadmap.md`;
- `docs/dev/codex-sequenced-implementation-plan.md`;
- `docs/dev/project-vision-and-continuity-brief.md`;
- `docs/future_content_backlog.md`;
- `docs/design/static-content-expansion-program.md`;
- `docs/dev/branch-lifecycle-and-integration-policy.md`;
- `docs/dev/branch-disposition-register.md`;
- the live shared ledger contract, campaign-session fork emitter, completed-replay validator, focused persistence tests, serialization/publication owners, and every durable record that might corroborate a historical edge.

Use `git show` or equivalent repository inspection to read the exact prompt, handoff, and output at:

- `5fe11910e6b4951483994ee23529150a697f78cc`;
- `551d14bc483054aac129f7a081489b70efb46521`;
- `cbad987028d81c5ecdc35403333ec920d0ea5e53`;
- `f68d878cd1969e861f4fe7a793412876ba48b3a8`.

## Decision Boundary

This run may:

- inspect source, tests, history, branches, PRs, and persisted contracts;
- create temporary read-only probes and remove them before completion;
- run focused existing tests needed to characterize behavior;
- update design, audit, prompt, handoff, output, protocol-current-application, planning, and branch-coordination documents after the decision.

This run must not modify:

- production source;
- tests;
- shared types;
- snapshot or envelope formats;
- serializers or migrations;
- dependencies;
- content, assets, UI, or survey behavior;
- branches or PRs.

Do not integrate, rewrite, or advance any `parallel/*` branch in this run. Parallel connector branches remain isolated evidence and will be coordinated separately.

If a production change is required, install a complete successor repair prompt and stop.

## Question 1 - Route-Authority Reconciliation

Determine and document:

1. whether a runnable `0.6.9.9` implementation prompt was installed before `cbad987`;
2. whether a runnable independent `0.6.9.10` prompt was installed before `f68d878`;
3. which repository workflow requirements were bypassed;
4. whether `cbad987` may be retained as candidate implemented evidence or must be reverted through a later authorized repair route;
5. the exact independently installed successor required before parent acceptance can be reconsidered.

Do not retroactively treat a focused decision document as the installed executable implementation prompt unless the repository's established route protocol explicitly proves equivalence.

## Question 2 - Durable Evidence Inventory

For every field on a historical `continuity_fork` edge, identify all durable corroboration available after at least two later descendant forks:

- `sourceId`;
- `acceptedAtTick`;
- `parentContinuityId`;
- `childContinuityId`;
- `forkedFromArtifactId`;
- `forkedFromPublicationId`.

Classify each field as exactly one:

- `INDEPENDENTLY_CROSS_VERIFIABLE`;
- `CHAIN_STRUCTURALLY_VERIFIABLE`;
- `CURRENT_EDGE_ONLY_VERIFIABLE`;
- `SELF_ASSERTED_LEDGER_EVIDENCE`;
- `NOT_DURABLY_PROVABLE`.

Inspect, but do not assume, possible corroboration from:

- current campaign identity;
- retained fork entries;
- receipt and correction entries;
- immutable artifacts and verified publications;
- slot addresses and campaign control;
- retained mutation results;
- save metadata;
- Chronicle and notification projections;
- account publication receipts;
- caller or branch state.

A value repeated only inside the same mutable snapshot evidence family is not automatically independent corroboration.

## Question 3 - Executable Characterization Matrix

Using untouched synchronized production source, create temporary probes or focused test invocations for this valid lineage:

```text
C0 original defeat
└─ C1 recovery completion
   └─ C2 later fork
      └─ C3 later fork
```

At `C3`, change exactly one historical recovery-edge field at a time while preserving parent/child continuity:

- source artifact;
- source publication;
- source mutation, when receipt targeting remains stable;
- accepted tick to another valid monotonic integer.

Then change exactly one field on the intermediate `C1 -> C2` edge:

- source mutation;
- accepted tick;
- source artifact;
- source publication;
- parent continuity;
- child continuity.

Also confirm:

- current-edge source mutation, parent, source artifact, and source publication remain cross-checked against current campaign identity;
- duplicate incoming child edges, cycles, disconnected paths, missing recovery edge, wrong recovery mutation, wrong recovery tick, and original-continuity substitution remain rejected;
- every rejection is byte-stable and produces no effects, child, revision, or publication.

Remove every temporary probe before commit. Do not add or edit tests in this decision run.

## Question 4 - Exact Historical-Edge Contract

Distinguish two different guarantees:

1. **semantic consistency and deterministic replay validation** within the accepted save-authority model;
2. **cryptographic or independently authenticated tamper detection** for every retained historical metadata field.

The repository must not claim the second guarantee unless persisted authority actually provides it. The decision must not introduce a generic integrity framework merely to preserve overbroad wording.

Choose one coherent model or a precisely bounded hybrid.

### Model A - Continuity graph authority

- unique acyclic parent/child continuity linkage is acceptance-critical;
- the recovery edge is bound to receipt identity and the exact recovery mutation/tick/continuities that remain durably corroborated;
- current campaign identity authenticates the final/current edge;
- historical source mutation, tick, artifact, and publication fields beyond independently corroborated facts are retained descriptive provenance subject to explicit shape/order rules, not universal tamper-detection claims.

### Model B - Fully authenticated historical edges

- every named field remains acceptance-critical on every historical edge;
- additional bounded durable evidence or chained integrity is required;
- `cbad987` is insufficient until a separately authorized repair closes the gap.

### Model C - Bounded mixed authority

- name every historical field that remains exact authority;
- name every field that becomes descriptive or structural evidence;
- identify the independent corroboration for every exact field;
- prohibit documentation, tests, and completion reports from claiming more than the persisted format proves.

Explain compatibility with immutable artifacts, verified publication, copied artifacts, slot independence, restart/caller loss, old format-v2 snapshots, failure-before-effects, bounded growth, and the no-generic-framework boundary.

## Question 5 - Existing Implementation Classification

Classify `cbad987028d81c5ecdc35403333ec920d0ea5e53` as exactly one:

- `IMPLEMENTATION_CONFORMS_REAUDIT_REQUIRED`;
- `IMPLEMENTATION_PARTIALLY_CONFORMS_REPAIR_REQUIRED`;
- `IMPLEMENTATION_CONTRACT_INDETERMINATE_NO_PACKAGE`;
- `IMPLEMENTATION_MUST_BE_REVERTED_BEFORE_SUCCESSOR`.

A conforming classification does not accept parent `0.6.9`; it authorizes only the separately installed independent audit below.

A repair or revert classification must install a complete repair/replacement prompt and stop without changing production.

## Mandatory Outcome And Exact Successors

Return exactly one outcome.

### `DECISION_ACCEPTED_REAUDIT_AUTHORIZED`

Use only when the exact contract is decided and `cbad987` conforms without production changes.

Then install exactly:

`Version 0.6.9.11 - Historical Recovery Fork Authority Acceptance Audit`

This is the next valid support suffix. Historical `0.6.9.10` must not be reused or renumbered even though its acceptance claim is superseded.

The audit must begin from a synchronized checkout containing `cbad987` and this decision, independently reproduce the characterization matrix, run focused persistence, the prescribed regression group, build, bounded TypeScript audit, serialization/mirror checks, branch review, diff checks, and hosted-status reporting, and keep `0.6.9`, Ashen Reef, and `0.7.0` blocked until it passes.

### `DECISION_ACCEPTED_REPAIR_AUTHORIZED`

Use when the contract is decided but `cbad987` does not satisfy it or must be replaced/reverted.

Then install exactly:

`Version 0.6.9.11 - Historical Recovery Fork Authority Repair`

Reserve exactly:

`Version 0.6.9.12 - Historical Recovery Fork Authority Post-Repair Acceptance Audit`

The repair prompt must define the smallest source/test surface, preserve format and owner boundaries unless a new decision is required, prohibit unrelated changes, and require installation of the reserved independent audit only after implementation succeeds.

### `NO_PACKAGE`

Use only when repository evidence cannot select the authority model without product direction. Ask one smallest exact user question and preserve this decision as active.

## Required Deliverable

Create one permanent decision document under `docs/design/` containing:

- run identity, date, inspected/starting/decision/final/live heads, label class, and milestone impact;
- route-authority timeline and skipped-transition conclusion;
- complete durable-evidence inventory;
- executable characterization matrix and exact results;
- field-by-field authority classification;
- semantic-consistency versus tamper-authentication distinction;
- selected contract model;
- compatibility and migration posture;
- existing implementation classification;
- exact outcome and exact successor prompt;
- branch/PR and hosted-validation report.

After deciding, update every live current-state surface affected by the result:

- `docs/dev/current-codex-prompt.md`;
- `docs/dev/current-codex-output.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/repository-first-agent-work-protocol.md` current-application paragraph;
- `docs/design/normal-stakes-campaign-persistence-foundation-acceptance-audit.md`;
- `docs/design/normal-defeat-recovery-completion-lineage-repair-decision.md`;
- `docs/dev/historical-version-and-deferred-route-register.md`;
- `docs/design/current-planning-anchor-reconciliation.md`;
- `docs/dev/project-roadmap.md`;
- `docs/dev/codex-sequenced-implementation-plan.md`;
- `docs/dev/project-vision-and-continuity-brief.md`;
- `docs/future_content_backlog.md`;
- `docs/design/static-content-expansion-program.md`;
- `docs/dev/branch-disposition-register.md` only when a named branch/PR consumer or disposition actually changes.

Preserve dated history. Mark prior acceptance as superseded rather than deleting it.

## Validation

Run at minimum:

- the focused executable characterization above;
- `node --test tests\unit\campaign-persistence-foundation.test.mjs` without editing tests;
- documentation path/reference checks;
- `git diff --check`;
- complete unstaged, staged, committed, and post-push diff inspection;
- final worktree, branch/upstream, remote-head, combined-status, and workflow-run checks.

A production build or full regression group is not required for this documentation-only decision unless needed to resolve a disputed claim. The installed successor must require the complete validation appropriate to its class.

Apply the relevant repository failure-pattern guardrails and report their exact IDs and evidence.

## Scope Exclusions

Do not:

- accept parent `0.6.9`;
- implement, revert, or rewrite lineage production code;
- edit tests;
- run the Ashen Reef survey decision;
- implement survey receipts or behavior;
- change snapshot or envelope versions;
- add a generic lineage, integrity, replay, event, or transaction framework;
- add dependencies, content, assets, UI, or unrelated cleanup;
- integrate or modify parallel connector branches;
- merge, close, delete, rebase, or force-update branches or PRs.

## Completion Report

Report:

1. inspected, starting, decision, final, and live remote heads;
2. route-authority timeline and skipped-transition conclusion;
3. historical-field evidence classifications;
4. characterization cases and exact results;
5. selected authority model and guarantee boundary;
6. `cbad987` classification;
7. exact decision outcome;
8. exact successor prompt identity and reserved follow-up when applicable;
9. files changed;
10. checks and counts;
11. applicable failure-pattern IDs and evidence;
12. branch/PR and hosted-validation state;
13. exact status of parent `0.6.9`, Ashen Reef, survey behavior, and `0.7.0`.
