# Version 0.6.9.11 - Historical Recovery Fork Authority Acceptance Audit

Date: 2026-08-08

Label class: support suffix

Parent version: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`

Milestone impact: `supports_current_band`

Execution posture: independent read-only production audit with temporary executable characterization

Suggested commit:

`docs(save): audit historical recovery fork authority`

## Objective

Independently audit committed implementation `cbad987028d81c5ecdc35403333ec920d0ea5e53` against `docs/design/historical-recovery-fork-evidence-verifiability-and-parent-acceptance-reopening-decision.md` and decide whether parent `0.6.9` may be accepted under the bounded mixed historical-edge contract.

Do not treat the decision run's probe or the superseded historical `0.6.9.10` claim as this audit's executable evidence. Begin from a freshly synchronized checkout containing `cbad987` and the committed decision, reproduce the matrix independently, and validate the full parent gate.

## Starting Disposition

- parent `0.6.9`: `ACCEPTANCE_REOPENED_PENDING_0.6.9.11`;
- `0.6.9.8`: historical independent evidence, `REPAIR_REQUIRED`;
- `0.6.9.9` / `cbad987`: `IMPLEMENTATION_CONFORMS_REAUDIT_REQUIRED`;
- historical `0.6.9.10`: superseded acceptance claim, retained as evidence only;
- Ashen Reef survey receipt-foundation decision: blocked;
- survey behavior: unimplemented;
- `0.7.0`: `NOT_READY`.

## Authority And Orientation

Follow `AGENTS.md`, the repository-first protocol, prompt-execution platform/tool policy, branch policy/register, and applicable failure-pattern guardrails completely.

Fetch and prune all remotes. Record the inspected base, synchronized audit starting head, implementation head, decision head, audit commit, final coordination head, and post-push live head distinctly. Inspect all local/remote branches and open PRs, their merge bases, divergence, unique paths, dispositions, semantic overlap, and review triggers. Inspect hosted combined status and pull-request-triggered workflow availability for `cbad987`, the decision commit, the audit starting head, the audit commit, and final coordination head.

Read completely:

- current prompt, handoff, and output;
- the historical-fork decision named above;
- the reopening review;
- the `0.6.9.8` pre-audit review;
- the completion-lineage repair decision;
- the parent acceptance audit;
- historical/deferred register and planning reconciliation;
- repository-first protocol, prompt-execution policy, failure-pattern register, branch policy/register;
- live shared ledger contract, campaign-session fork emitter, completed-replay validator, persistence/publication owners, focused tests, mirrors, and every caller used by the validation gate.

## Audit Boundary

This is production-read-only. Do not modify production source, shared contracts, tests, serializers, migrations, formats, dependencies, content, assets, UI, or survey behavior. Temporary probes are allowed only outside tracked tests and must be removed before commit.

Do not integrate or modify parallel branches or PRs. Do not accept the parent from static inspection or green existing tests alone.

If any contract or validation case fails, report `REPAIR_REQUIRED`, install a complete `Version 0.6.9.12 - Historical Recovery Fork Authority Repair` prompt, and stop without repairing production in this audit.

## Contract To Verify

Verify Model C exactly:

1. parent/child linkage is `CHAIN_STRUCTURALLY_VERIFIABLE` through a unique, acyclic, connected path;
2. recovery source mutation and accepted tick are exact against receipt-derived authority;
3. recovery parent and child are exact against receipt original and completion continuity;
4. current-edge source mutation, parent, source artifact, and source publication are exact against current campaign identity;
5. ordinary historical `sourceId`, `forkedFromArtifactId`, and `forkedFromPublicationId` are `CURRENT_EDGE_ONLY_VERIFIABLE` after the edge becomes historical;
6. ordinary historical `acceptedAtTick` is `SELF_ASSERTED_LEDGER_EVIDENCE` constrained by integer, floor, and monotonic rules;
7. historical descriptive fields remain nonblank/well formed, but the implementation and documentation make no universal tamper-authentication claim;
8. all invalid structural, recovery, current-edge, receipt, projection, and control evidence fails closed before effects.

## Independent Characterization Matrix

Using untouched synchronized production, create and remove a fresh temporary probe for:

```text
C0 original defeat
â””â”€ C1 recovery completion
   â””â”€ C2 later fork
      â””â”€ C3 later fork
```

Make later edge ticks distinct enough to test another valid monotonic intermediate tick. Change exactly one field at a time and prove the expected result:

| Case | Required result |
| --- | --- |
| valid deep duplicate and copied/reversed artifact | exact duplicate success with current state |
| recovery source mutation, tick, parent, or child | reject |
| recovery artifact or publication changed to another nonblank id | accept as descriptive historical provenance |
| intermediate source mutation, valid monotonic tick, artifact, or publication | accept as bounded descriptive evidence |
| intermediate parent or child | reject |
| current-edge source mutation, parent, artifact, or publication | reject |
| duplicate incoming child, cycle, disconnect, missing recovery, wrong recovery mutation/tick, original substitution | reject |
| blank identifier, noninteger/below-floor tick, reversed tick order, self edge | reject |

For every rejection compare complete serialized snapshot and control before/after. Prove no effect, child, revision, retained result, tick, projection, ledger mutation, or publication. Confirm valid duplicate replay returns the exact current snapshot/control and does not roll back later mutations.

## Required Validation

Run and report exact counts/results:

1. fresh independent characterization matrix;
2. `node --test tests\unit\campaign-persistence-foundation.test.mjs`;
3. the prescribed adjacent regression group from the last accepted parent gate, refreshed against current repository scripts and imports;
4. RPG UI production build;
5. bounded TypeScript audit, including total diagnostic posture and whether any implementation/decision files are named;
6. serialization JSON pass-through and format-v2 compatibility inspection;
7. JavaScript/TypeScript public export and import-specifier mirror checks;
8. real completed-replay caller and publication-boundary inspection;
9. documentation path/reference and stale-route checks;
10. `git diff --check`, complete unstaged/staged/committed/post-push diff inspection, and hygiene checks;
11. final worktree, branch/upstream, remote-head, combined-status, and workflow-run checks.

Apply at minimum FP-002, FP-008, FP-009, FP-011, and FP-012, plus any other guardrail made relevant by fresh evidence. State the proof for each.

## Outcomes

Return exactly one.

### `PARENT_ACCEPTED`

Use only if every contract and validation gate passes independently. Then:

- update the permanent decision and parent acceptance audit with the accepted audit identity and evidence;
- mark `0.6.9.11` complete and parent `0.6.9` accepted;
- preserve historical `0.6.9.10` as a superseded claim;
- reactivate the unversioned `Ashen Reef Survey Occurrence, Result, And Consequence Receipt Foundation Decision` as the next prompt without running it;
- keep survey behavior unimplemented and `0.7.0` `NOT_READY`.

### `REPAIR_REQUIRED`

Use if any exact gate fails. Do not repair production. Install a complete `Version 0.6.9.12 - Historical Recovery Fork Authority Repair` prompt with a numbered finding-to-owner-to-test matrix and the smallest authorized surface. Parent, Ashen Reef, survey behavior, and `0.7.0` remain blocked.

## Required Coordination

Update current prompt/output/handoff, the permanent decision, parent acceptance audit, completion-lineage decision, repository-first Current Application, historical register, planning reconciliation, roadmap, sequenced plan, continuity brief, backlog, static program, and branch register when live facts/dispositions change. Preserve dated history and exact supersession language.

Commit, push, fetch/verify, inspect hosted status/workflows, and report exact final and live remote identities. A chat report does not replace repository handoff.

## Scope Exclusions

Do not implement or revert lineage production, edit tests, change save/envelope versions, add integrity frameworks, run the Ashen Reef decision, implement survey behavior, add dependencies/content/assets/UI, perform unrelated cleanup, or mutate/integrate/close/delete/rebase/force-update branches or PRs.
