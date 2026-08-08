# Connector Token-Reset Waiting-Period Prestage

Final consumption status (2026-08-08): verified against synchronized starting head `260e800b584103393a25f6bc5c0599d9289b5356`; source map, route timeline, characterization matrix, and branch index consumed by the historical-fork authority decision. Live branch/PR facts were refreshed and the previously unexecuted matrix was run locally. This document remains historically useful Connector evidence and is no longer an unfinished controlling package.

Date: 2026-08-06

Inspected source head: `d23afddf5fecae470d1ff3988250b379a8513bfb`

Execution surface: ChatGPT through GitHub Connector only

Status: `CONNECTOR_PRESTAGE_COMPLETE_NO_ACTIVE_ROUTE_ADVANCEMENT`

## Purpose

Use the Codex token-reset waiting period to reduce later repository inspection and coordination burden without competing with the active historical recovery-fork decision.

This document is current connector evidence, not implementation or acceptance authority. Codex must re-fetch, re-prune, and verify every dynamic fact against the live checkout before acting.

## Active Route Preserved

The controlling route remains:

`Historical Recovery Fork Evidence Verifiability And Parent Acceptance Reopening Decision`

Current disposition remains:

- parent `0.6.9`: `ACCEPTANCE_REOPENED_PENDING_FOCUSED_DECISION`;
- implementation `cbad987028d81c5ecdc35403333ec920d0ea5e53`: `IMPLEMENTED_PENDING_AUTHORITY_RECONCILIATION_AND_REAUDIT`;
- historical `0.6.9.10` acceptance: superseded;
- Ashen Reef survey decision: blocked;
- survey implementation: unimplemented;
- `0.7.0`: `NOT_READY`.

This connector pass did not change the active prompt, production source, tests, types, persistence formats, serializers, migrations, content, assets, dependencies, or any parallel branch.

## Live Hosted Repository Snapshot

At the inspected head, GitHub exposed:

- default branch: `master`;
- total branches: 37;
- non-default branches: 36;
- branches under `parallel/`: 32;
- open pull requests: 2;
- current branch-disposition register date: 2026-08-02.

The existing `docs/dev/branch-disposition-register.md` is therefore a historical coordination snapshot rather than a complete current inventory. It should not be rewritten from partial connector content. This document is a live addendum until a repository-capable coordinator performs the complete register reconciliation required by policy.

## Twenty-Eight Indexed Evidence Branches

All twenty-eight evidence branch names remain present in the hosted branch inventory. Their exact indexed heads, documents, consumers, and review triggers remain controlled by:

1. `docs/dev/parallel-gpt-connector-only-run-results-2026-08-03.md`;
2. `docs/dev/parallel-gpt-connector-only-second-wave-results-2026-08-03.md`;
3. `docs/dev/parallel-gpt-connector-only-third-wave-results-2026-08-03.md`.

They remain isolated and noncontrolling as `CANDIDATE_INTEGRATION`. Do not merge the waves as batches. A future run should inspect only semantically applicable entries and must still compare them against then-current source and authority.

## Current Non-Evidence Branch Comparisons

Counts below are `branch-only / master-only` against `master` at `d23afddf5fecae470d1ff3988250b379a8513bfb`.

| Branch | Current comparison | Unique paths | Current safe posture |
| --- | --- | --- | --- |
| `feat/main-menu-assets` | `0 / 769`; fully behind | none | Historical branch with no current unique commit; do not delete until a dedicated exact-ref retirement check confirms no PR, asset, or preservation dependency. |
| `main-menu-asset-contract-pass` | `10 / 697`; diverged | two launcher SVGs, `AppShell.tsx`, launcher asset contract | `SUPERSEDED_PRESERVE_EVIDENCE`; PR #2 remains the review surface. Requires product/asset direction and local UI/asset validation before any re-authored consumer. |
| `main-menu-refinement-pass` | `2 / 704`; diverged | `AppShell.tsx`, launcher asset contract | Historical overlapping launcher evidence; do not merge independently from PR #2 disposition. |
| `parallel/connector-prep-freshness-audit` | `1 / 105`; diverged | `docs/dev/connector-prep-freshness-and-supersession-audit.md` | Stale one-document evidence. Review only in a dedicated connector-prep supersession or documentation-integration pass. |
| `parallel/launcher-asset-pr-disposition` | `1 / 103`; diverged | `docs/design/launcher-sidebar-asset-pr-disposition-audit.md` | Optional launcher evidence; named consumer is a launcher/asset disposition decision, not the active persistence route. |
| `parallel/prompt-packaging-integrity-audit` | `1 / 132`; diverged | `docs/dev/parallel-prompt-packaging-integrity-audit-prompt.md` | `PROTECTED_REFERENCE`; do not merge, rewrite, or delete during the active decision. |
| `parallel/0.6.9.7-repair-bundle` | `7 / 56`; diverged | seven evidence files under `docs/dev/repair-bundles/version-0.6.9.7/` | `SUPERSEDED_PRESERVE_EVIDENCE`; no merge or cherry-pick. PR #3 metadata was corrected in this connector pass. |
| `prep/integrated-gameplay-0-7-readiness-audit` | `2 / 185`; diverged | readiness audit and queued prompt | `PROTECTED_REFERENCE`; `0.7.0` remains not ready and this branch cannot override the active route. |

Mechanical mergeability is dynamic and is not semantic integration authority.

## Open Pull Requests

### PR #2 — launcher asset contract

- state: open;
- draft: no;
- hosted head: `e78dc645cfb658685be12f45f46d34b7c0da1119`;
- branch: `main-menu-asset-contract-pass`;
- connector-reported mergeability at inspection: true;
- disposition: `SUPERSEDED_PRESERVE_EVIDENCE` pending a dedicated launcher decision, current asset verification, and local UI/build review.

No PR #2 mutation occurred.

### PR #3 — 0.6.9.7 repair bundle

- state: open;
- draft: yes;
- hosted head: `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`;
- branch: `parallel/0.6.9.7-repair-bundle`;
- connector-reported mergeability at inspection: true;
- disposition: `SUPERSEDED_PRESERVE_EVIDENCE`.

The PR body previously described the branch as `HOLD_NAMED_CONSUMER`. This pass corrected the body to the current superseded-evidence posture, retained the do-not-merge rule, linked the reopened decision, and preserved exact bundle and hash information. The PR remains open and draft; no branch content or lifecycle state changed.

## Active Decision Repository Source Map

This map is intended to reduce rediscovery when Codex resumes. It is a static connector characterization and must be verified in the synchronized worktree.

### Controlling prompt and focused authority

- `docs/dev/current-codex-prompt.md`
- `docs/dev/version-0.6.9-parent-acceptance-reopening-and-historical-fork-verifiability-review-2026-08-02.md`
- `docs/dev/version-0.6.9.8-pre-audit-completion-continuity-lineage-review-2026-08-02.md`
- `docs/design/normal-defeat-recovery-completion-lineage-repair-decision.md`
- `docs/design/normal-defeat-recovery-continuity-and-destination-provenance-contract-decision.md`
- `docs/design/normal-stakes-campaign-persistence-foundation-acceptance-audit.md`
- `docs/dev/codex-failure-patterns-and-verification-guardrails.md`

### Shared contract owner

`packages/shared/types/src/contracts.ts`

Inspect the current definitions for:

- `SaveSnapshot`;
- campaign identity and parent/child continuity fields;
- authority-ledger entries and `continuity_fork` fields;
- `NormalDefeatReceiptState` and `recoveryCompletionContinuityId`;
- retained publication, artifact, and mutation evidence carried by the persisted snapshot.

Do not assume that fields co-located in one mutable snapshot are independently corroborated.

### Fork emitter and session-control owner

`packages/engines/game-engine/src/campaign-session.ts`

Primary functions and boundaries:

- `createCampaignSessionControl` establishes loaded artifact, publication, revision, continuity, and head posture;
- `admitCampaignMutation` creates a new continuity and appends a `continuity_fork` ledger entry when a non-head snapshot accepts its first divergent mutation;
- the emitted fork records `sourceId`, `acceptedAtTick`, parent continuity, child continuity, source artifact, and source publication from session control and the proposed snapshot tick;
- `completePendingNormalDefeatRecovery` selects pending versus completed replay behavior and requires exact receipt identity for completed replay;
- `requireRecoveryControlAuthority` cross-checks current session control, current campaign identity, accepted mutation IDs, and retained results.

### Completed-replay validator

`packages/engines/game-engine/src/normal-defeat.ts`

Primary functions and boundaries:

- `hasExactCompletedRecoveryContinuityLineage` validates the recovery edge and walks incoming `continuity_fork` edges from current continuity back to the recovery-completion continuity;
- `validateCompletedNormalDefeatRecoveryProvenance` composes receipt, correction-ledger, recovery-lineage, destination, resource, Chronicle, and notification checks;
- the direct recovery edge is bound to recovery mutation identity, receipt source tick, parent continuity, child continuity, and nonblank artifact/publication fields;
- the current/final edge is cross-checked against current campaign identity for parent continuity, source mutation, artifact, and publication;
- intermediate historical edges are checked for unique incoming structure, nonblank field shape, integer/monotonic tick constraints, and non-self linkage;
- static inspection did not identify an independent retained artifact/publication authority cross-check for every intermediate historical edge.

That last observation is exactly the contract question in the active decision. It is not itself an acceptance conclusion.

### Serialization boundary

`packages/shared/persistence/src/index.ts`

The campaign-session fingerprint and save path use serialized snapshot content. The resumed run should identify whether serialization, publication, immutable artifacts, retained mutation results, or any other durable owner independently corroborates historical edge fields after multiple descendant forks.

### Focused executable evidence

`tests/unit/campaign-persistence-foundation.test.mjs`

The active prompt requires characterization beyond relying on the existing suite. Codex should inspect the current focused cases and then run temporary probes for the exact deep lineage below without committing test changes in the decision route.

## Pre-Staged Characterization Matrix

Construct a valid lineage:

```text
C0 original defeat
└─ C1 recovery completion
   └─ C2 later fork
      └─ C3 later fork
```

At `C3`, mutate exactly one field at a time.

### Recovery edge

- source mutation;
- accepted tick;
- source artifact;
- source publication;
- parent continuity;
- child continuity.

### Intermediate `C1 -> C2` edge

- source mutation;
- accepted tick;
- source artifact;
- source publication;
- parent continuity;
- child continuity.

### Current-edge controls

- source mutation;
- parent continuity;
- source artifact;
- source publication.

### Structural controls

- duplicate incoming child edge;
- cycle;
- disconnected path;
- missing recovery edge;
- wrong recovery mutation;
- wrong recovery tick;
- original-continuity substitution;
- malformed or blank identifiers;
- reversed tick ordering.

For every rejection, compare the entire pre-call and post-call state and prove no effects, child, revision, publication, retained result, or byte change occurred.

Remove all temporary probes before commit.

## Evidence Classification Worksheet

The decision should complete this table from live source and executable characterization rather than inference alone.

| Historical edge field | Durable corroboration owners inspected | Observed mutation behavior | Required classification |
| --- | --- | --- | --- |
| `sourceId` | ledger, receipt/correction, retained results, current identity, publication/artifact records | pending local probe | one of the five prompt classifications |
| `acceptedAtTick` | ledger, receipt/correction, snapshot clock/history, publication/artifact records | pending local probe | one of the five prompt classifications |
| `parentContinuityId` | ledger graph, current identity, receipt completion continuity | pending local probe | one of the five prompt classifications |
| `childContinuityId` | ledger graph, current identity, receipt completion continuity | pending local probe | one of the five prompt classifications |
| `forkedFromArtifactId` | ledger, current identity, artifact store, publication records | pending local probe | one of the five prompt classifications |
| `forkedFromPublicationId` | ledger, current identity, publication store, artifact records | pending local probe | one of the five prompt classifications |

Allowed classifications remain:

- `INDEPENDENTLY_CROSS_VERIFIABLE`;
- `CHAIN_STRUCTURALLY_VERIFIABLE`;
- `CURRENT_EDGE_ONLY_VERIFIABLE`;
- `SELF_ASSERTED_LEDGER_EVIDENCE`;
- `NOT_DURABLY_PROVABLE`.

## Codex Resume Checklist

After token reset:

1. perform the fresh platform/tool/model/plugin capability inventory required by `docs/dev/prompt-execution-platform-tool-selection-policy.md`;
2. use an authenticated repository-capable implementation surface because this route requires local Git history, temporary executable probes, and repository documentation commits;
3. fetch and prune, synchronize `master`, and record the new live head;
4. reread the complete active prompt, handoff, output, this prestage, branch policy/register, failure-pattern register, and focused persistence authorities;
5. independently refresh all branch and PR facts; this document is evidence only;
6. verify the source map against current files and history before running probes;
7. execute the active decision exactly, including route-authority reconciliation, the six-field durable-evidence inventory, deep-lineage characterization, explicit semantic-versus-authenticated guarantee distinction, implementation classification, and exact successor installation;
8. update the stale `Current Application` paragraph in the repository-first protocol only after the decision outcome is known;
9. preserve all twenty-eight indexed evidence branches and the protected references without integrating them;
10. update the complete handoff chain, branch register, focused decision, historical/deferred routing, and planning reconciliation required by the prompt;
11. commit, push, and report exact starting, decision, coordination, and post-push heads.

## Work Deliberately Not Performed

- no local Git operations;
- no tests, builds, typechecks, lint, generators, simulations, or executable probes;
- no source, test, type, serializer, migration, content, asset, dependency, or prompt-body change;
- no branch merge, rebase, force update, deletion, or integration;
- no PR close, merge, or draft-state change;
- no branch-register replacement from partial content;
- no parent acceptance or successor installation.

## Review And Retirement

The active decision consumed the route timeline, source map, matrix, and branch index after live verification. Superseded branch counts remain dated evidence; the reasoning worksheet and platform preflight remain historically useful. Current live facts now reside in the decision, branch register, output, and handoff, so this document is retained as noncontrolling evidence.
