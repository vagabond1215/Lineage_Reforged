# Historical Recovery Fork Evidence Verifiability And Parent Acceptance Reopening Decision

Date: 2026-08-08

Source run: `Historical Recovery Fork Evidence Verifiability And Parent Acceptance Reopening Decision`

Label class: unversioned focused decision

Parent version: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`

Milestone impact: `supports_current_band`

Outcome: `DECISION_ACCEPTED_REAUDIT_AUTHORIZED`

Existing implementation classification: `IMPLEMENTATION_CONFORMS_REAUDIT_REQUIRED`

Independent acceptance audit: `Version 0.6.9.11`, `PARENT_ACCEPTED`

Independent acceptance authority commit: `0262285e9f19c954ab1693838e27c8a7ea349640`

Inspected base and synchronized starting head: `260e800b584103393a25f6bc5c0599d9289b5356`

Decision authority commit: `907706bb782dbfa70b2eb229d4813e2209b21ab6`

Final coordination commit: `2ae21d13c6fb670450837a81a499de30bdf1454d`

Post-push live head observed for the decision package: `2ae21d13c6fb670450837a81a499de30bdf1454d`

## Decision

Select **Model C - Bounded mixed authority**.

The persisted format proves a unique, acyclic parent/child continuity path from the recovery-completion continuity to the current continuity. It also binds the recovery edge to the deterministic recovery mutation, the receipt source tick, and the receipt's original and completion continuities. Current campaign identity cross-checks the final edge's parent, source mutation, source artifact, and source publication.

After an ordinary edge becomes historical, its mutation, accepted tick, source artifact, and source publication do not all retain independent durable corroboration. Those values remain bounded descriptive ledger provenance: required to be well formed, with integer and monotonic tick constraints, but not universally authenticated historical facts. Documentation and acceptance evidence must not claim cryptographic or independently authenticated tamper detection for those fields.

This contract is semantic-consistency and deterministic-replay authority inside the accepted save model. It is not a cryptographic integrity guarantee for every historical metadata value.

## Route-Authority Reconciliation

History from `5fe11910e6b4951483994ee23529150a697f78cc` proves:

1. `5fe1191` installed `Version 0.6.9.8 - Initial Defeat And Durable Recovery Completion Acceptance Audit`, a production-read-only audit whose blocking result had to install a later executable repair route.
2. `551d14bc483054aac129f7a081489b70efb46521` added only `docs/design/normal-defeat-recovery-completion-lineage-repair-decision.md`. At that commit the current prompt, handoff, and output still named `0.6.9.8`; no runnable `0.6.9.9` prompt was installed.
3. `cbad987028d81c5ecdc35403333ec920d0ea5e53` changed production source, shared contracts, and tests while the installed prompt remained the read-only `0.6.9.8` audit.
4. No intervening commit installed a runnable independent `0.6.9.10` prompt. `f68d878cd1969e861f4fe7a793412876ba48b3a8` changed the coordination chain directly to a claimed `0.6.9.10` acceptance and activated the survey decision.

The sequence bypassed the installed-prompt gate, the audit/implementation separation required by the active route, independent committed-head acceptance installation, and the repository-first handoff requirement. Commit messages and the focused decision do not retroactively supply the missing executable prompts.

The production commit remains candidate evidence rather than being reverted. The executable characterization below shows that it conforms to this newly explicit bounded contract. Parent acceptance still requires a separately installed independent audit.

## Durable Evidence Inventory

The live contract, campaign-session emitter, completed-replay validator, JSON pass-through serializer, save/publication owners, retained mutation results, projections, and account publication records were inspected. Immutable artifacts preserve the snapshot as a whole, but the active format has no hash chain, signature, independent per-edge receipt, or separately retained historical-edge record that authenticates every field after later forks.

Primary classifications apply once an ordinary edge is historical after at least two later forks. The recovery-edge exception is stated separately and does not broaden other historical edges.

| Field | Classification | Durable meaning |
| --- | --- | --- |
| `sourceId` | `CURRENT_EDGE_ONLY_VERIFIABLE` | Current identity duplicates and cross-checks the final edge's first divergent mutation. Once an ordinary edge is historical, its source id is retained only in that ledger entry. The deterministic recovery edge is a bounded exception: its source id is independently derived from the receipt id. |
| `acceptedAtTick` | `SELF_ASSERTED_LEDGER_EVIDENCE` | Ordinary historical ticks are ledger values constrained to integers, the recovery completion floor, and forward monotonic order. No independent per-edge tick receipt remains. The recovery edge is a bounded exception cross-checked to `receipt.sourceTick`. |
| `parentContinuityId` | `CHAIN_STRUCTURALLY_VERIFIABLE` | Unique incoming edges, non-self linkage, cycle detection, and path closure prove the parent chain; the recovery receipt and current identity additionally anchor the endpoints. |
| `childContinuityId` | `CHAIN_STRUCTURALLY_VERIFIABLE` | The child keys the unique incoming-edge walk and is required to connect the recovery-completion continuity to current continuity. |
| `forkedFromArtifactId` | `CURRENT_EDGE_ONLY_VERIFIABLE` | Current identity cross-checks the final edge. After the edge becomes historical, no separate retained owner cross-checks this value. Nonblank shape remains required. |
| `forkedFromPublicationId` | `CURRENT_EDGE_ONLY_VERIFIABLE` | Current identity cross-checks the final edge. After the edge becomes historical, no separate retained owner cross-checks this value. Nonblank shape remains required. |

Receipt/correction entries corroborate recovery identity and ticks, not arbitrary later fork metadata. Chronicle and notification projections corroborate defeat completion, not each fork. Slot addresses, campaign control, retained results, and account publication receipts describe current or publication state and are not a durable independent history for every older edge.

## Executable Characterization

A temporary uncommitted probe used untouched production source to construct `C0 -> C1 -> C2 -> C3`. The later ordinary forks advanced ticks so the intermediate tick could be changed to another valid monotonic integer. Every case compared serialized snapshot bytes and complete control JSON before and after replay. All rejections were byte-stable and produced no effect, child, revision, retained result, or publication. The probe was removed before commit.

| Case | Result |
| --- | --- |
| valid `C0 -> C1 -> C2 -> C3` duplicate replay | accepted |
| recovery source mutation | rejected |
| recovery accepted tick | rejected |
| recovery source artifact | accepted |
| recovery source publication | accepted |
| recovery parent continuity | rejected |
| recovery child continuity | rejected |
| intermediate source mutation | accepted |
| intermediate accepted tick changed to another valid monotonic integer | accepted |
| intermediate source artifact | accepted |
| intermediate source publication | accepted |
| intermediate parent continuity | rejected |
| intermediate child continuity | rejected |
| current-edge source mutation | rejected |
| current-edge parent continuity | rejected |
| current-edge source artifact | rejected |
| current-edge source publication | rejected |
| duplicate incoming child edge | rejected |
| cycle | rejected |
| disconnected path | rejected |
| missing recovery edge | rejected |
| wrong recovery mutation | rejected |
| wrong recovery tick | rejected |
| original-continuity substitution | rejected |
| blank historical identifier | rejected |
| reversed historical tick ordering | rejected |

The unchanged focused repository test then passed `33/33`.

## Exact Contract

Acceptance-critical facts are:

- one unique acyclic parent/child path from recovery completion to current continuity;
- exact recovery mutation, recovery accepted tick, recovery parent, and recovery child against receipt authority;
- nonblank recovery artifact and publication provenance;
- exact current-edge parent, source mutation, artifact, and publication against current campaign identity;
- nonblank identifiers, integer accepted ticks no earlier than completion, and monotonic accepted ticks for intermediate edges;
- completed receipt, original/correction ledger, resource, destination, Chronicle, notification, and control authority already required by the owner.

Historical ordinary mutation, accepted tick, source artifact, and source publication are not independently authenticated after their edge ceases to be current. They remain descriptive evidence under the shape/order constraints above. Recovery artifact and publication are likewise descriptive once deeper descendants exist, even though they are mandatory nonblank evidence.

## Compatibility And Scope

- Snapshot format remains `lineage.save_snapshot.v2`; no envelope or migration change is required.
- JSON serialization remains pass-through and copied artifacts retain the exact embedded graph.
- Slot order, array order, caller memory, and branch state confer no authority.
- Old target snapshots remain governed by the accepted optional-field compatibility rules; missing linked evidence still fails closed where the completed-replay contract requires it.
- Validation remains before effects and rejection remains byte-stable.
- Ledger growth remains one bounded edge per accepted non-head fork.
- No generic lineage, integrity, replay, event, transaction, signature, or hash-chain framework is authorized.

## Existing Implementation And Outcome

`cbad987028d81c5ecdc35403333ec920d0ea5e53` implements the exact structural path, recovery-edge bindings, current-edge bindings, and intermediate shape/order constraints selected here. Its acceptance of changed historical ordinary mutation/tick/artifact/publication and changed deep recovery artifact/publication is conforming behavior under Model C, not proof of authenticated history.

Classification:

`IMPLEMENTATION_CONFORMS_REAUDIT_REQUIRED`

Outcome:

`DECISION_ACCEPTED_REAUDIT_AUTHORIZED`

Install exactly:

`Version 0.6.9.11 - Historical Recovery Fork Authority Acceptance Audit`

Historical `0.6.9.10` remains a superseded acceptance claim and is not reused. At decision completion, parent `0.6.9` was `ACCEPTANCE_REOPENED_PENDING_0.6.9.11` and Ashen Reef was blocked; the independent result is recorded below.

## Prestage, Branch, PR, And Hosted Posture

`docs/dev/connector-token-reset-waiting-period-prestage-2026-08-06.md` was verified against the synchronized checkout and consumed as reusable orientation, source-map, matrix, and branch-index evidence. Live source and history confirmed its claims. Its branch counts were refreshed rather than copied, and its unexecuted characterization was performed locally. The document remains historically useful evidence and no longer controls an unfinished consumer.

Fresh inventory found only local `master`, 36 non-default remote branches, and open PRs #2 and #3. All 28 indexed Connector evidence branches remain isolated `CANDIDATE_INTEGRATION`; the two workflow/readiness references remain `PROTECTED_REFERENCE`; PR #2 and PR #3 remain `SUPERSEDED_PRESERVE_EVIDENCE`. No branch or PR was merged, rebased, updated, closed, or deleted. No branch has semantic overlap that requires integration into this decision.

GitHub exposed no combined statuses and no pull-request-triggered workflow runs for `cbad987`, `f68d878`, or the synchronized starting head. The post-push review likewise exposed no combined statuses and no pull-request-triggered workflow runs for decision commit `907706bb782dbfa70b2eb229d4813e2209b21ab6` or final coordination commit `2ae21d13c6fb670450837a81a499de30bdf1454d`.

## Independent Acceptance Audit Result

`Version 0.6.9.11 - Historical Recovery Fork Authority Acceptance Audit` independently recreated the deep-lineage probe from untouched production and returned `PARENT_ACCEPTED` on 2026-08-08. Its `30/30` matrix accepted all eight bounded Model C descriptive/equivalent cases, rejected all 22 structural, receipt-bound, current-edge, shape, ordering, projection, and control corruptions byte-stably, and passed the `33/33` focused suite, `140/140` regression group, 209-module production Vite build, bounded TypeScript baseline, serialization/mirror, real-caller/publication, diff, hygiene, and hosted gates.

The audit closes `IMPLEMENTATION_CONFORMS_REAUDIT_REQUIRED` as accepted implementation evidence for parent `0.6.9`. It does not broaden Model C, authenticate ordinary historical descriptive fields, implement survey behavior, or make `0.7.0` ready. The next active route is the unversioned `Ashen Reef Survey Occurrence, Result, And Consequence Receipt Foundation Decision`.
