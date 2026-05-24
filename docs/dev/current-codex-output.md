# Current Codex Output

Source version/run: Version 0.5.75 - Chronicle Run-End Summary View Model Plan
Date: 2026-05-24
Branch/status assumption: Ran locally on `master`; worktree was clean at start, and local `master` was behind `origin/master` by 21 commits. No pull or remote sync was performed during this docs-only pass.

## Result
Finalized the planning-only data-owner map for the future read-only Chronicle run-end impact summary.

Local source inspection showed the existing plan had the right direction but needed a concrete 0.5.76 projection boundary. Updated `docs/design/chronicle-run-end-summary-view-model-plan.md` with current repo reality, source ownership, allowed/deferred behavior, read-only input/output shape, allowed fields, forbidden inferences, and focused future tests.

No runtime/source/schema/UI/content/test behavior was implemented.

## Files Inspected
- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/chronicle-run-end-summary-view-model-plan.md`
- `docs/design/chronicle-run-end-summary-source-audit.md`
- `docs/design/future-system-design-ledger.md`
- `docs/future_content_backlog.md`
- `packages/shared/types/src/contracts.ts`
- `packages/engines/game-engine/src/run-legacy-payout.ts`
- `packages/engines/game-engine/src/account-estate.ts`
- `apps/rpg-ui/src/game-shell/runLifecycle.ts`
- `apps/rpg-ui/src/game-shell/accountMetaPresentation.ts`
- `apps/rpg-ui/src/game-shell/components/AccountMetaPanel.tsx`
- `tests/unit/run-lifecycle.test.mjs`
- `tests/unit/legacy-ledger-presentation.test.mjs`

## Files Changed
- `docs/design/chronicle-run-end-summary-view-model-plan.md`
- `docs/dev/current-codex-output.md`

## Current Repo Reality
Current account history records can support a conservative read-only run-end summary from stored data:

- `AccountRunHistoryRecord` owns run identity, lineage id, optional family/source fields, starting location ids, timestamps, outcome/archive reason, Echo peak, notable achievement ids, payout metadata, duration fields, inheritance-use count, and save slot ids.
- `runLifecycle.ts` owns terminal transitions. `archiveActiveRun(...)` evaluates achievements, resolves payout, grants Legacy when eligible, persists payout metadata, deposits estate assets, saves the account profile, and clears slots. `retainRetiredRun(...)` records retained retirement and inheritance uses without running the archive payout/deposit path.
- `run-legacy-payout.ts` owns payout math. Future projection must read persisted payout metadata only and must not call the resolver to recompute awards.
- `account-estate.ts` owns archive-time estate deposits and read-only claim previews. Future projection may summarize stored deposits/assets for the source run, but must not claim or move assets.
- `accountMetaPresentation.ts` already has compact Chronicle tile and estate labels, but the run-end summary needs a richer single-run projection and stricter source-link copy.
- `AccountMetaPanel.tsx` renders current account meta sections only; it should not be changed by the 0.5.76 pure projection pass.

Still absent/deferred: Chronicle Marks, Lineage Seals, Family Prestige run-end grants/spending, heirs, heirlooms, bequests, estate claim delivery, family management, and Bloodlines mutation from run end.

## Data-Owner Map
- Run identity/outcome/origin: `AccountRunHistoryRecord`; validate with lifecycle authority helpers where relevant.
- Survival/duration: lifecycle-persisted `totalPlayTicks` and `survivedDays`; do not infer survival from current time.
- Echo/progression: stored `echoLevelReached` and optional payout baseline; do not infer additional progression.
- Notable deeds: stored achievement ids plus current achievement definition titles; unknown ids need conservative fallbacks.
- Legacy payout: stored `payoutEligible`, `legacyGranted`, `payoutBreakdown`, `legacyPayoutResolvedAt`, and `legacyPayoutTransactionId`; payout math remains owned by `run-legacy-payout.ts`.
- Estate summary: `AccountProfileState.estate.deposits/assets` keyed by `resolveRunHistorySourceId(record)`; estate movement remains owned by account estate/lifecycle code.
- Continuity/source line: explicit `sourceRunId`, `crossLineageStart`, `familyId`, `parentCharacterId`, and `inheritanceUsesRemaining`; never derive family or parentage from `lineageId` or `sourceRunId`.
- Slot impact: optional lifecycle result context such as `clearedSlotIds` and `retainedSlotIds`; projection must not delete or retain saves.
- Warnings/actions: projection owns warnings and must emit no action ids.

## Planned Projection Boundary
Future file:

- `apps/rpg-ui/src/game-shell/chronicleRunEndSummaryPresentation.ts`

Future function:

- `buildChronicleRunEndSummaryViewModel(input: ChronicleRunEndSummaryInput): ChronicleRunEndSummaryViewModel`

Planned input:

- `accountProfile: AccountProfileState`
- `runRecord: AccountRunHistoryRecord | null`
- optional lightweight `lifecycleResult` context containing read-only `legacyGranted`, `rewardTransactionId`, `clearedSlotIds`, `retainedSlotIds`, and `inheritanceUsesRemaining`

Planned output:

- display-ready title/subtitle/outcome/status tone
- identity, origin, survival, progression, deed, payout, estate, continuity, and slot rows
- warning labels
- `actionIds: []`

The future projection should read stored profile/run data only. It should not read a raw `SaveSnapshot` for final summary fields after lifecycle completion.

## Allowed / Deferred Behavior
- Allowed: display stored run identity, outcome, origin, duration, Echo, achievement labels, payout metadata, estate deposit summaries, explicit continuity/source fields, and slot impact rows.
- Allowed: use conservative fallback labels for unknown ids or missing optional fields.
- Deferred/forbidden: recompute payout, grant Legacy, create transactions, deposit or move estate assets, claim/deliver estate assets, create bequests or heirlooms, create heirs, create family records, create Family Prestige grants/spends, create Chronicle Marks, create Lineage Seals, create Bloodlines behavior, infer `familyId` from `lineageId`, infer parent/child relation from `sourceRunId`, or emit claim/spend/convert/seal/mark/inherit/transfer/register/retry/resurrect/purchase actions.

## Future Tests
Recommended focused tests for 0.5.76:

1. Missing `runRecord` returns safe warning output and no actions.
2. Active records do not claim terminal payout resolution.
3. Retained retired records show retirement, retained slots, and inheritance-use count without estate claims.
4. Death records show stored outcome, survival, Echo, deeds, and payout rows.
5. Hardcore death records show a distinct label from `archiveReason`.
6. Deleted records show non-authoritative warnings and no payout/estate/action claims.
7. Payout rows read stored metadata without calling `resolveRunLegacyPayout(...)`.
8. Contradictory payout fixture proves stored metadata wins over recomputation.
9. Known achievement ids resolve titles; unknown ids use conservative fallbacks.
10. Missing optional fields produce unknown/unavailable/omitted labels.
11. `lineageId` is never treated as `familyId`.
12. `sourceRunId` does not create parent/child copy without explicit evidence.
13. Estate rows read only stored assets/deposits matching `resolveRunHistorySourceId(record)`.
14. Estate rows never expose claim/transfer/bequest/heirloom actions.
15. Lifecycle cleared/retained slot ids produce read-only slot rows only.
16. `actionIds` is always empty.
17. No Chronicle Marks, Lineage Seals, Family Prestige grants/spends, Bloodlines mutations, estate delivery, or Legacy grants are represented.

## Behavior / Runtime Confirmation
- runtime changed: no
- JSON changed: no
- schema changed: no
- UI changed: no
- content changed: no
- tests changed: no
- generated output changed: no
- payout behavior changed: no
- estate behavior changed: no
- Legacy behavior changed: no
- Bloodlines behavior changed: no
- Chronicle Marks added: no
- Lineage Seals added: no
- Family Prestige behavior changed: no

## Checks Run
- `git status --short --branch` - clean at start; local `master` behind `origin/master` by 21 commits.
- `git diff --check` - passed with line-ending warnings only.

No typecheck, broad workspace validation, runtime tests, or content lint were run because this was a docs-only planning pass and no source/test/content files changed.

## Risks / Follow-Up
- Local `master` is behind `origin/master`; this run used current local branch reality as requested.
- 0.5.76 should stay pure projection plus tests. It should not render React UI or touch lifecycle/payout/estate mutation.
- Existing compact Chronicle tile copy in `accountMetaPresentation.ts` includes source-line cues that are acceptable for the current surface but should not be copied blindly into run-end summary if it implies parent/child relation from `sourceRunId` alone.
- Future implementation should avoid importing broad lifecycle result types if a smaller read-only input contract is enough.

## Temporary Guardrail Cleanup Decision
`docs/design/chronicle-run-end-summary-source-audit.md` remains useful as a source-detail reference through 0.5.76 and 0.5.77. The updated view-model plan is now the active implementation source. After the pure projection and read-only UI land, fold durable rules into `docs/design/future-system-design-ledger.md`, then delete or mark the source audit consumed if it no longer protects implementation choices.

## Next Recommended Version
Version 0.5.76 - Chronicle Run-End Summary Pure Projection

## Suggested Commit Message
docs(chronicle): finalize run-end summary view model plan
