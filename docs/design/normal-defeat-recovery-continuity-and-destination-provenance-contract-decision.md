# Normal Defeat Recovery Continuity And Destination Provenance Contract Decision

Date: 2026-08-02

Source run: unversioned `Normal Defeat Recovery Continuity And Destination Provenance Contract Decision`

Label class: unversioned focused decision

Milestone impact: `supports_current_band`

Status: `DECISION_ACCEPTED_REPAIR_REAUTHORIZED`

Lineage amendment: `docs/design/normal-defeat-recovery-completion-lineage-repair-decision.md` supersedes only this decision's conclusion that the receipt field alone proves arbitrary-depth completion ancestry without linked fork-ledger fields. All original receipt-continuity and destination-provenance decisions remain accepted.

## 1. Decision

The two shared-contract blockers from the stopped `Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair` are decided as follows:

1. `NormalDefeatReceiptState.continuityId` permanently names the continuity on which the original defeat was resolved. Completion never rewrites it.
2. Recovery completion records its own continuity through one additive compatibility field:

```ts
recoveryCompletionContinuityId?: string | null;
```

3. A newly emitted pending receipt writes `recoveryCompletionContinuityId: null`. A newly emitted playable receipt writes the continuity on which playable recovery completed.
4. A non-head ordinary recovery completion creates exactly one child continuity. The receipt retains the source continuity in `continuityId` and records the child in `recoveryCompletionContinuityId`.
5. A completed receipt may therefore name an ancestor continuity while residing in an accepted child or later descendant snapshot.
6. The existing deterministic superseding `normal_defeat` ledger entry remains the completion/correction authority. No new receipt kind or ledger kind is required.
7. Automatic bounded exactly-one-known-safe-settlement completion records the new additive destination source literal `sole_known_settlement`.
8. The target snapshot format remains `lineage.save_snapshot.v2`. No envelope-version, snapshot-format, or version-6 source-format revision is required.

This is the smallest representation that preserves original defeat truth, identifies the continuity that accepted completion, supports restart-safe replay, and avoids falsely calling automatic authority explicit.

## 2. Rejected Alternatives

- Rewriting `receipt.continuityId` to the child is rejected because it destroys the original defeat provenance and conflicts with the receipt's accepted role as defeat truth.
- Using only the containing snapshot continuity is rejected because later forks make containment different from completion authority.
- Relying only on the correction ledger is rejected because the current ledger entry has no continuity field and therefore cannot identify the branch that accepted completion by itself.
- Creating a second receipt is rejected because one stable receipt plus one typed completion-continuity field and the existing superseding ledger entry provide complete bounded authority.
- Extending the ledger schema is rejected because the receipt field closes the missing identity without a generic correction or event framework.
- Relabeling sole-known fallback as `explicit_context`, `current_settlement`, or `campaign_start` is rejected as false provenance.
- Removing the sole-known fallback is rejected because it would narrow accepted `0.6.9.3` through `0.6.9.6` recovery behavior and can leave an otherwise repairable campaign blocked.

## 3. Receipt And Completion Authority Model

### 3.1 Original defeat truth

For every receipt:

- `receiptId` is the stable result identity;
- `sourceMutationId`, `sourceKind`, `campaignId`, `continuityId`, `characterId`, rules, policy, and `sourceTick` describe the original defeat;
- the unique original ledger entry has `entryId === receiptId`, `kind === "normal_defeat"`, `sourceId === sourceMutationId`, no `supersedesEntryId`, and the accepted original tick;
- the original receipt continuity never changes.

### 3.2 Completion truth

For a newly emitted receipt:

- `recovery_pending` requires `recoveryCompletionContinuityId === null`, `destinationId === null`, `destinationSource === "none"`, `recoveryTicks === 0`, and pending tick/resource/projection invariants;
- immediately playable initial resolution requires `recoveryCompletionContinuityId === continuityId`;
- repaired playable recovery requires `recoveryCompletionContinuityId` to equal the continuity that accepted the repair;
- the unique correction entry has id `normal_defeat_recovery.<receiptId>`, kind `normal_defeat`, source id `mutation.recovery_repair.<receiptId>`, `supersedesEntryId === receiptId`, and `acceptedAtTick === resolvedTick`.

The correction entry and receipt are linked by stable deterministic ids. The receipt records the completion continuity; the containing snapshot's verified campaign/artifact lineage proves that the evidence is carried by accepted campaign truth. Later accepted forks preserve both receipt continuity fields unchanged.

### 3.3 Compatibility inference

The field is optional only for stored compatibility. New production writes must always emit it.

For an existing target-format receipt that predates this decision:

- absent plus `recovery_pending` is interpreted as `null`;
- absent plus `playable` is interpreted as `receipt.continuityId`;
- no load-time byte rewrite is required;
- an exact later repair rewrites the targeted receipt with the explicit field;
- an exact duplicate remains byte-stable and may use the inferred value only after every other durable fact is uniquely validated.

This inference is safe because the pre-decision implementation rejected non-head completion after rewriting the clone's continuity. It could not durably produce a successful pre-decision child-continuity completion.

## 4. Exact Continuity Outcomes

### At-head ordinary completion

- `campaignIdentity.continuityId` remains the source continuity;
- existing parent/fork fields remain unchanged;
- no continuity-fork ledger entry is added;
- `receipt.continuityId` remains the source continuity;
- `receipt.recoveryCompletionContinuityId` becomes that same continuity.

### Non-head ordinary completion

After all source validation and destination classification pass:

- mint one child continuity;
- set `campaignIdentity.parentContinuityId` to `control.loadedContinuityId`;
- set `campaignIdentity.continuityId` to the child;
- set `forkedFromArtifactId` and `forkedFromPublicationId` from control;
- set `firstDivergentMutationId` to `mutation.recovery_repair.<receiptId>`;
- append exactly one `continuity_fork` ledger entry whose `sourceId` is that mutation id and whose accepted tick is the untouched source tick;
- retain `receipt.continuityId` as the source continuity;
- set `receipt.recoveryCompletionContinuityId` to the child.

### Later descendants and copied artifacts

Later accepted mutations and forks do not rewrite either receipt continuity field. A copied artifact preserves the embedded campaign, original receipt, correction entry, projections, and completion continuity exactly. Array position and save-slot position confer no authority.

### Version-6 owner-certified repair

Owner-certified version-6 migration correction is not player divergence:

- it does not create a child continuity, including when the certified source artifact is not campaign head;
- original and completion continuity are the migrated target continuity;
- a playable repair is persisted and verified in the loaded slot before ordinary play;
- a certified-head repair may advance the repaired target head under the accepted migration rules;
- a certified non-head repair publishes only the repaired non-head artifact/address and does not replace campaign head;
- a pending legacy repair remains blocked until the same owner-certified repair can complete and be persisted; it does not enter the ordinary unsaved completion path.

## 5. Stable Targeting And Durable Duplicate Evidence

`completePendingNormalDefeatRecovery(...)` may infer the target only when exactly one pending receipt exists. Completed replay after restart requires an explicit stable target receipt id. It must never select the first, last, or latest receipt.

For the target id, duplicate replay requires exactly one complete, internally consistent set:

1. one receipt;
2. one original ledger entry;
3. one correction ledger entry with the deterministic ids above;
4. one Chronicle projection;
5. one notification projection;
6. matching campaign, character, rules, policy, source, tick, resource, destination, and posture facts;
7. a valid explicit or inferred completion continuity;
8. control and loaded artifact/continuity authority compatible with the current snapshot.

Zero, multiple, ambiguous, orphaned, or conflicting evidence fails closed. Reversed arrays produce the same result. A valid duplicate returns the current snapshot/control and targeted receipt, does not roll back later mutations, does not create a fork, and repeats no recovery effect.

## 6. Destination Provenance

The shared union becomes:

```ts
"explicit_context"
| "current_settlement"
| "campaign_start"
| "sole_known_settlement"
| "none"
```

Strict short-circuit precedence is:

1. supplied explicit destination, validated exactly, records `explicit_context`;
2. validated current settlement records `current_settlement`;
3. validated campaign-start settlement records `campaign_start`;
4. exactly one validated known safe settlement records `sole_known_settlement`;
5. zero known safe settlements fails closed for completion;
6. multiple known safe settlements fail closed as ambiguous.

A supplied malformed or unsafe explicit claim fails without fallback. A valid explicit claim is not contaminated by malformed lower-priority evidence. Initial automatic defeat resolution retains its accepted minimum chain and may become pending; the sole-known fallback is authorized for pending completion, not as a new initial-resolution precedence step.

Existing completed receipts retain their stored source literal. The implementation must not guess and rewrite pre-decision `explicit_context` values. Exact duplicate replay may preserve such a value as historical serialized truth only when all other durable evidence is complete; every new initial or completion write must record the truthful source.

## 7. Compatibility And Migration Posture

- The union and field changes are additive TypeScript contract changes.
- `serializeSnapshot` and `deserializeSnapshot` are JSON pass-through and require no change.
- `isTargetCampaignSnapshot` currently accepts the receipt array structurally, so existing format-v2 snapshots remain readable.
- No target-snapshot rewrite on load is authorized.
- New receipt construction and repair writes must emit the completion field.
- Runtime repair and replay validators must accept only the declared destination literals and the exact missing-field compatibility inference.
- Newly migrated version-6 receipts use the new field and truthful destination source directly.
- No version-6 source bytes are rewritten.
- Shared type exports flow through the existing contracts barrel; no new public export is required for a field or union member.
- Existing JavaScript engine entrypoints are re-export mirrors. Change them only if a new public function is intentionally exported; do not hand-maintain TypeScript-only semantics in a JavaScript mirror.

## 8. Transaction Ordering And Rollback Boundary

For ordinary target-format completion:

1. select the target receipt by unique pending identity or explicit completed target id;
2. validate source artifact, revision, control account/campaign/loaded continuity, snapshot campaign/character/rules, and mutation identity;
3. validate the unique receipt, original ledger, absence or exact presence of correction evidence, resource maxima/currents, pending tick equality, Chronicle, notification, destination posture, and all retained source provenance against the untouched source snapshot;
4. resolve and classify destination through strict precedence against the untouched source snapshot;
5. return an exact completed duplicate now, before any child id is minted;
6. if pending and non-head, clone and create exactly one child/fork record; if at head, clone without identity change;
7. update only the targeted receipt and append exactly one correction entry;
8. advance four ticks, relocate, and preserve/restore resources exactly as accepted;
9. update the targeted Chronicle and notification projections;
10. increment session revision once, retain the mutation result once, and return the accepted snapshot/control;
11. publish only through a later explicit manual or quick save.

For owner-certified version-6 repair, steps 1 through 5 remain source-first, no child is created, and the repaired artifact/address must be verified before play under the accepted migration publication rules.

Every validation or destination rejection occurs before child-id creation and before clone mutation. The source snapshot and control must remain byte-stable. An exception after work begins must not return or persist the partial clone, child, receipt update, ticks, relocation, projection update, correction entry, session revision, or publication.

## 9. Contract-To-Code-To-Test Authorization

| # | Contract | Smallest authorized code surface | Required proof |
| --- | --- | --- | --- |
| 1 | additive completion continuity and sole-known literal | `packages/shared/types/src/contracts.ts` | typecheck plus old/new serialized receipt compatibility |
| 2 | strict source-aware destination result | `packages/engines/game-engine/src/normal-defeat.ts` | explicit/current/start/sole/none/ambiguous and corrupt-lower-priority matrix |
| 3 | source-first receipt/projection/resource validation and exact correction | `packages/engines/game-engine/src/normal-defeat.ts` | all nine finding tests, reversed/partial/duplicate evidence, byte-stable rejection |
| 4 | stable completed targeting and pre-fork transaction order | `packages/engines/game-engine/src/campaign-session.ts` | at-head/non-head/restart/later-mutation/multiple-history control matrix |
| 5 | real run-entry and owner-certified legacy completion/persistence | `apps/rpg-ui/src/App.tsx` and `apps/rpg-ui/src/game-shell/saveManager.ts` only where the exact legacy and caller path requires it | real caller, head/non-head version-6, failure-before-entry, verified same-slot publication |
| 6 | public entrypoint parity | `packages/engines/game-engine/src/index.ts` and exact `.js` re-export mirror only if a new public helper is necessary | export/mirror parity check |
| 7 | focused and regression evidence | `tests/unit/campaign-persistence-foundation.test.mjs` and only the existing adjacent prescribed tests | complete evidence matrix, regression group, build, bounded type audit |

No change to `packages/shared/persistence/src/index.ts`, snapshot format identity, envelope version, generic campaign ledger kinds, dependency set, schema catalog, content, assets, survey behavior, or a generic replay/event/transaction framework is authorized unless fresh implementation evidence proves this matrix insufficient and triggers another fail-closed stop.

## 10. Required Evidence Matrix

Revised `0.6.9.7` must cover:

- at-head and non-head pending completion through the real run-entry caller;
- rejection before non-head child creation and one accepted child/completion sequence;
- restart before and after completion;
- completed duplicate after later accepted mutation without rollback;
- multiple historical recoveries with explicit stable targeting and reversed arrays;
- version-6 certified head and non-head repair, including blocked pending and verified completion;
- explicit, current, campaign-start, sole-known, none, and ambiguous destination cases;
- corrupted control, receipt, continuity, rules, ledger, ticks, resources, Chronicle, notifications, and completion-continuity evidence;
- copied artifacts and order-reversed evidence;
- publication blocked while pending, ordinary completion remaining unsaved, explicit later publication, and version-6 same-slot repair persistence;
- all nine reproduced `0.6.9.7` findings and all accepted `0.6.9.2` through `0.6.9.5` regressions.

## 11. Result And Route

Decision result:

`DECISION_ACCEPTED_REPAIR_REAUTHORIZED`

Reinstall:

`Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair`

Parent `0.6.9` remains unaccepted. `0.6.9.8` remains reserved for the separate independent acceptance audit. The Ashen Reef survey route and `0.7.0` remain blocked.
