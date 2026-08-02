# Current Codex Output

## Run Identity

- Source run: `Normal Defeat Recovery Continuity And Destination Provenance Contract Decision`
- Date: 2026-08-02
- Branch/status assumption: synchronized clean `master`; documentation decision pending commit at report write
- Inspected base head: `a54ed83688c7a08d292c2b75ec7af3abac75ed52`
- Decision starting head: `a54ed83688c7a08d292c2b75ec7af3abac75ed52`
- Live post-fetch head before decision edits: `a54ed83688c7a08d292c2b75ec7af3abac75ed52`
- Final committed head: report exact SHA in the completion response after commit/push verification
- Label class: unversioned focused decision
- Parent version: none
- Milestone impact: `supports_current_band`
- Suggested commit: `docs(save): decide defeat recovery continuity provenance`

## Outcome

`DECISION_ACCEPTED_REPAIR_REAUTHORIZED`

The repository evidence decides both blockers without changing snapshot format or inventing a generic persistence mechanism:

1. original `NormalDefeatReceiptState.continuityId` remains immutable defeat provenance;
2. additive `recoveryCompletionContinuityId?: string | null` records the continuity that accepted playable completion;
3. non-head ordinary completion validates the untouched source, creates one child, retains source continuity on the receipt, and records child completion continuity;
4. automatic bounded sole-known completion records additive `destinationSource: "sole_known_settlement"`;
5. target format `lineage.save_snapshot.v2` remains compatible through exact missing-field inference and no load-time rewrite;
6. completed replay uses explicit stable receipt targeting plus one complete unique durable evidence set;
7. owner-certified version-6 repair creates no child and must verify repaired same-slot persistence before play.

The revised nine-finding `Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair` prompt is installed. Parent `0.6.9` remains unaccepted, `0.6.9.8` remains reserved, and the Ashen Reef survey route remains blocked.

## Exact Decision And Rejected Alternatives

Accepted:

- one receipt, immutable original continuity, additive completion continuity, existing deterministic correction ledger;
- strict explicit/current/campaign-start/sole-known completion precedence;
- no target snapshot-format bump, no deserializer rewrite, and compatibility inference only for the missing new field;
- exact source-first head/non-head transaction order and separate owner-certified legacy correction path.

Rejected:

- rewriting original receipt continuity;
- relying only on containing snapshot identity or the continuity-less correction ledger;
- a second receipt or new ledger kind;
- falsely labeling sole-known automatic authority explicit;
- removing the accepted bounded fallback;
- selecting completed history by first/last/latest array position;
- a generic replay, event, correction, or transaction framework.

## Head, Non-Head, And Legacy Ordering

For ordinary target completion: unique target selection; complete control/source validation; complete retained receipt/ledger/projection/resource/tick validation; strict destination classification; exact duplicate return; only then clone and optional child creation; targeted receipt/correction update; four ticks/relocation/resources; targeted projections; one session revision; explicit later save only.

At head, no fork occurs and completion continuity equals current continuity. From non-head, exactly one child records the loaded source as parent, loaded artifact/publication as fork origin, recovery mutation as first divergence, and one fork ledger entry; receipt source continuity remains unchanged and completion continuity becomes the child.

Owner-certified version-6 repair creates no child. Head repair may update verified head under accepted migration rules; non-head repair verifies only the repaired non-head artifact/address and cannot replace campaign head. Completed correction must persist before play.

Every ordinary rejection occurs before child-id creation and before effects. Source snapshot and control remain byte-stable, and no partial clone is returned or published.

## Compatibility And Migration

- New shared field: `recoveryCompletionContinuityId?: string | null`.
- New destination literal: `sole_known_settlement`.
- New pending writes emit null; new playable writes emit exact completion continuity.
- Existing missing-field pending receipts infer null.
- Existing missing-field playable receipts infer original continuity after every other durable fact validates.
- Existing stored destination literals are preserved without invented relabeling.
- JSON persistence pass-through and target snapshot format remain unchanged.
- Version-6 source bytes remain immutable; new migrated receipts emit the new contract directly.

## Contract-To-Code-To-Test Matrix

| Contract | Authorized owner | Required evidence |
| --- | --- | --- |
| additive field and literal | `packages/shared/types/src/contracts.ts` | type and old/new serialized compatibility |
| source-aware precedence and exact receipt validation | `packages/engines/game-engine/src/normal-defeat.ts` | nine findings, destination matrix, corrupt/partial/reversed evidence |
| pre-fork admission and stable targeting | `packages/engines/game-engine/src/campaign-session.ts` | head/non-head/restart/later-mutation/multiple-history matrix |
| real caller and legacy persisted correction | `apps/rpg-ui/src/App.tsx`, `apps/rpg-ui/src/game-shell/saveManager.ts` only as required | real run-entry, version-6 head/non-head, failure-before-play |
| export/mirror parity | engine index and exact JavaScript re-export only if a new public helper is needed | public import and mirror check |
| regression evidence | focused persistence test and prescribed adjacent suite | full automated/adversarial/build/type/diff gate |

No shared persistence JSON owner, format id, envelope version, new ledger kind, dependency, content, asset, survey, or broad UI change is authorized.

## Files Changed

- `docs/design/normal-defeat-recovery-continuity-and-destination-provenance-contract-decision.md`
- `docs/design/normal-stakes-campaign-persistence-foundation-acceptance-audit.md`
- `docs/design/current-planning-anchor-reconciliation.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/historical-version-and-deferred-route-register.md`
- `docs/dev/branch-disposition-register.md`

No production source, shared type, persistence, save, migration, test, dependency, content, asset, generated output, UI, or protected branch changed.

## Applicable Verification Guardrails

- `FP-001`: the real `App.tsx` automatic completion caller and legacy load/save owner were traced; revised repair must execute both.
- `FP-002`: the decision preserves the independent nine-finding and failure-boundary matrices beyond green test totals.
- `FP-003`: ordinary and owner-certified legacy completion owners, exits, persistence posture, restart, and failure rules are explicit.
- `FP-004`: save-slot and publication collision authority remains unchanged and in the regression gate.
- `FP-005`: restart, caller-loss, copied-artifact, and explicit completed targeting are required.
- `FP-006`: duplicate replay returns current state and cannot replace later mutations; non-head legacy repair cannot replace head.
- `FP-007`: complete current coordination and focused authority files were read; writes are bounded and will be fully reread.
- `FP-008`: every live branch and both PRs received merge-base/divergence/path/semantic review; no integration was due.
- `FP-009`: inspected base, decision start, pre-commit live head, final commit, and post-push remote head are distinguished.
- `FP-010`: the revised prompt contains all nine findings and a complete code/test disposition.
- `FP-011`: strict source precedence and full provenance validation occur before child creation or effects.
- `FP-012`: completed replay requires explicit stable targeting and one unique complete evidence set independent of array order.

## Checks Run

- `git status --short --branch`: clean synchronized start.
- `git fetch --prune origin`: passed; default branch remained `a54ed83688c7a08d292c2b75ec7af3abac75ed52`.
- complete local/remote branch inventory with merge bases, divergence, and unique paths: passed.
- authenticated open-PR search and metadata reads: two open PRs, identities unchanged.
- complete required authority reads: passed.
- complete receipt, continuity, ledger, persistence, migration, publication, save/load, test, and real caller trace: passed.
- active documentation link/path validation: passed; every referenced active repository path exists.
- complete new decision and installed prompt reread: passed.
- `git diff --check`: passed.
- staged diff, commit, push, and post-push verification: pending at report write and required before completion.

No production tests, build, or typecheck ran because this prompt explicitly authorized documentation-only decision work and changed no runtime surface. The prior 26/26 baseline is preserved as historical evidence, not claimed as a current test run.

## Branch And PR Lifecycle

- Local branches: one, synchronized `master`.
- Non-default remote branches: eighteen.
- Open PRs: two.
- PR #2 remains open/non-draft at `e78dc645cfb658685be12f45f46d34b7c0da1119` and `SUPERSEDED_PRESERVE_EVIDENCE` for the launcher trigger.
- PR #3 remains open/draft at `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`, `15 / 7` against inspected master, and `HOLD_NAMED_CONSUMER` through revised `0.6.9.7` and `0.6.9.8`.
- Twelve one-document audit branches remain `CANDIDATE_INTEGRATION` at their named triggers.
- `parallel/prompt-packaging-integrity-audit` and `prep/integrated-gameplay-0-7-readiness-audit` remain read-only `PROTECTED_REFERENCE`.
- Launcher legacy branches retain their dedicated hygiene triggers.
- No integration, deletion, rebase, force update, or PR closure was due or performed.

## Risks And Follow-Up

- Production still contains all nine defects until revised `0.6.9.7` succeeds.
- The implementation must not treat the optional compatibility field as optional for new writes.
- Historical `explicit_context` completion provenance cannot be reconstructed and must not be silently relabeled.
- The owner-certified legacy correction exception must not become a general no-fork path.
- The known broad TypeScript baseline remains separate.

## Next Recommended Run

`Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair`

Classification: support suffix attached to parent `0.6.9`. Run under the revised prompt and accepted focused contract. Install `0.6.9.8` only after complete implementation and validation.
