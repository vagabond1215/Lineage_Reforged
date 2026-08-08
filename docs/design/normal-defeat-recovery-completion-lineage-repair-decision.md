# Normal Defeat Recovery Completion Lineage Repair Decision

Date: 2026-08-02

Source run: user-directed reconciliation of the `0.6.9.8` pre-audit lineage finding

Label class: unversioned focused decision

Milestone impact: `supports_current_band`

Status: `DECISION_ACCEPTED_REPAIR_AUTHORIZED`

Historical-edge authority amendment: `docs/design/historical-recovery-fork-evidence-verifiability-and-parent-acceptance-reopening-decision.md` supersedes only claims that every mutation, tick, artifact, and publication field remains independently authenticated after an edge becomes historical. The linked parent/child graph, exact recovery mutation/tick/continuities, current-edge identity checks, and bounded shape/order validation remain accepted.

## Decision

Fresh executable reproduction confirmed both risks recorded in
`docs/dev/version-0.6.9.8-pre-audit-completion-continuity-lineage-review-2026-08-02.md`:

- a recovery completion child replaced by the original receipt continuity was accepted;
- a valid completed receipt was rejected after two later ordinary descendant forks.

The existing format-v2 snapshot cannot prove arbitrary-depth completion ancestry because a `continuity_fork` ledger entry retains its mutation and tick but not the parent continuity, child continuity, source artifact, or source publication. The earlier decision's conclusion that the receipt field alone closed lineage authority is therefore superseded only at this narrow boundary.

Authorize `Version 0.6.9.9 - Durable Recovery Completion Lineage Repair` with the following additive contract:

1. `CampaignAuthorityLedgerEntryState` gains optional stored-compatibility fields `parentContinuityId`, `childContinuityId`, `forkedFromArtifactId`, and `forkedFromPublicationId`.
2. Every newly created `continuity_fork` entry writes all four fields from the validated source control and created child.
3. A non-head completed recovery requires exactly one recovery fork whose source, source tick, parent, child, source artifact, and source publication agree with the receipt and fork identity.
4. Completed replay proves arbitrary-depth descent by walking a unique parent-linked fork path from current continuity back to `recoveryCompletionContinuityId` and matching the current campaign identity to the final fork edge.
5. Missing, duplicate, cyclic, malformed, wrong-source, wrong-tick, wrong-parent, wrong-child, wrong-artifact, wrong-publication, or identity-conflicting path evidence fails closed before effects.
6. At-head recovery creates no recovery fork. Later forks may still form a linked path from its completion/original continuity to the current descendant.

## Compatibility And Scope

- Snapshot format remains `lineage.save_snapshot.v2`; no envelope or source migration version changes.
- The four fields are additive and optional so existing snapshots remain readable.
- An old completed non-head recovery lacking sufficient linked fork evidence fails closed on completed replay; the runtime must not invent ancestry.
- Existing at-head receipts and the accepted missing `recoveryCompletionContinuityId` inference remain valid when their other exact durable evidence validates.
- No new ledger kind, dependency, generic lineage service, survey behavior, UI behavior, or persistence serializer is authorized.
- Authorized source is limited to the shared ledger-entry contract, fork emission owner, completed recovery validator, focused persistence tests, and required coordination documents.

## Acceptance Gate

The repair must reproduce and close:

- original-continuity substitution;
- missing, duplicate, wrong-source, wrong-tick, unrelated, wrong-parent, wrong-child, wrong-artifact, and wrong-publication recovery-fork evidence;
- two-or-more later ordinary descendant forks;
- copied and order-reversed deep descendants;
- current campaign identity conflicts with the final fork edge;
- byte-stable rejection and no child/effect/revision/publication change.

The historical `0.6.9.10` acceptance claim remains superseded because its executable prompt was not independently installed. Installed `Version 0.6.9.11 - Historical Recovery Fork Authority Acceptance Audit` independently passed the bounded mixed contract and accepted parent `0.6.9` on 2026-08-08. The Ashen Reef survey receipt decision is reactivated but unexecuted; survey behavior remains unimplemented and `0.7.0` remains `NOT_READY`.
