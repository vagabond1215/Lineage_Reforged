# Current Codex Output

Source version/run: Version 0.5.76 - Chronicle Run-End Summary Pure Projection
Date: 2026-05-24
Branch/status assumption: Ran locally on `master`. Initial worktree was clean but `master` was behind `origin/master` by 4 commits. Default `git pull` was blocked by local SSL certificate validation; `git -c http.sslBackend=schannel pull` fast-forwarded successfully, and `git status --short --branch` then showed clean `master...origin/master` before edits.

## Result
Implemented the pure read-only Chronicle run-end summary projection and focused tests defined by the 0.5.75 plan.

Added `buildChronicleRunEndSummaryViewModel(...)` as a stored-data-only presentation projection for a single run-end Chronicle summary. The projection emits display-ready rows for identity, origin, survival, progression, deeds, payout, estate, continuity, slots, warnings, and an always-empty `actionIds` array.

No React UI, lifecycle mutation, payout recomputation, estate movement, Legacy grant, Bloodlines behavior, Chronicle Mark, Lineage Seal, Family Prestige behavior, schema, content JSON, or generated output was changed.

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
- `packages/engines/game-engine/src/achievements.ts`
- `apps/rpg-ui/src/game-shell/runLifecycle.ts`
- `apps/rpg-ui/src/game-shell/accountMetaPresentation.ts`
- `apps/rpg-ui/src/game-shell/components/AccountMetaPanel.tsx`
- `tests/unit/run-lifecycle.test.mjs`
- `tests/unit/legacy-ledger-presentation.test.mjs`
- `tests/unit/account-estate.test.mjs`
- `tests/unit/bloodlines-presentation.test.mjs`

## Files Changed
- `apps/rpg-ui/src/game-shell/chronicleRunEndSummaryPresentation.ts`
- `tests/unit/chronicle-run-end-summary-presentation.test.mjs`
- `docs/dev/current-codex-output.md`

## Projection Boundary
New file:

- `apps/rpg-ui/src/game-shell/chronicleRunEndSummaryPresentation.ts`

New function:

- `buildChronicleRunEndSummaryViewModel(input: ChronicleRunEndSummaryInput): ChronicleRunEndSummaryViewModel`

Input shape:

- `accountProfile: AccountProfileState`
- `runRecord: AccountRunHistoryRecord | null`
- optional `lifecycleResult` context with read-only `legacyGranted`, `rewardTransactionId`, `clearedSlotIds`, `retainedSlotIds`, and `inheritanceUsesRemaining`

Output shape:

- `title`, `subtitle`, `outcomeLabel`, `statusTone`
- `identityRows`
- `originRows`
- `survivalRows`
- `progressionRows`
- `deedRows`
- `payoutRows`
- `estateRows`
- `continuityRows`
- `slotRows`
- `warningLabels`
- `actionIds: []`

The projection is deterministic and presentation-only. It is not wired into React UI yet.

## Data Rules Enforced
- Reads `AccountRunHistoryRecord` fields only as stored.
- Reads payout state from stored `payoutEligible`, `legacyGranted`, `payoutBreakdown`, `legacyPayoutResolvedAt`, and `legacyPayoutTransactionId`.
- Does not import or call `resolveRunLegacyPayout(...)`.
- Does not recompute payout from Echo, deeds, archive reason, or account state.
- Reads achievement titles through the current achievement catalog; unknown achievement ids use conservative fallback labels.
- Reads estate rows only from stored `accountProfile.estate.deposits/assets` matching `resolveRunHistorySourceId(record)`.
- Deleted records are marked non-authoritative and expose no payout or estate rows.
- `lineageId` is displayed only as lineage and is never treated as `familyId`.
- `sourceRunId` may display source context but does not create parent/child copy without explicit `parentCharacterId`.
- Explicit `familyId`, `parentCharacterId`, `crossLineageStart`, and `inheritanceUsesRemaining` are shown only as read-only stored continuity context.
- Slot impact rows are read-only summaries from stored slot ids and optional lifecycle result context.
- No claim, spend, convert, seal, mark, inherit, transfer, register, retry, resurrect, or purchase actions are emitted.
- `actionIds` is always empty.

## Behavior / Runtime Confirmation
- runtime mutation changed: no
- lifecycle behavior changed: no
- payout behavior changed: no
- payout recomputation added to presentation: no
- estate behavior changed: no
- estate deposit/move/claim/delivery added: no
- Legacy grant behavior changed: no
- Bloodlines behavior changed: no
- Chronicle Marks added: no
- Lineage Seals added: no
- Family Prestige behavior changed: no
- React UI changed: no
- schema changed: no
- content JSON changed: no
- tests changed: yes, one focused unit test file added
- generated output changed: no

## Tests Added / Updated
Added `tests/unit/chronicle-run-end-summary-presentation.test.mjs` covering:

1. Missing `runRecord` returns safe warning output and no actions.
2. Active records render non-terminal context and do not claim payout resolution.
3. Retained retired records render retirement, retained slots, inheritance-use count, and no estate deposit claim.
4. Archived death records render death outcome, survival, Echo, deeds, and stored payout rows.
5. Hardcore death records render a distinct hardcore death label from `archiveReason`.
6. Deleted records render non-authoritative warnings and no payout, estate, or action claims.
7. Stored payout metadata displays without importing/calling `resolveRunLegacyPayout(...)`.
8. Contradictory payout fixtures display stored values instead of recomputing.
9. Known achievement ids resolve titles; unknown ids use conservative fallback labels.
10. Missing optional family/location/duration fields produce safe labels.
11. `lineageId` is never treated as `familyId`.
12. `sourceRunId` can display source context but does not create parent/child copy.
13. Estate rows read only stored deposits/assets matching `resolveRunHistorySourceId(record)`.
14. Estate rows expose no claim/transfer/bequest/heirloom action ids.
15. Lifecycle cleared/retained slot ids produce read-only slot impact rows only.
16. `actionIds` is always empty.
17. Deferred Chronicle, Bloodlines, Family Prestige, estate delivery, Chronicle Mark, and Lineage Seal systems are not represented.

## Checks Run
- `git status --short --branch` - initial worktree clean; branch was `master...origin/master [behind 4]`.
- `git pull` - failed before edits due local SSL certificate validation: `SSL certificate OpenSSL verify result: unable to get local issuer certificate (20)`.
- `git -c http.sslBackend=schannel pull` - passed; fast-forwarded `master` to `origin/master`.
- `git status --short --branch` - passed after sync; clean `master...origin/master`.
- `node --test tests/unit/chronicle-run-end-summary-presentation.test.mjs` - passed, 17 tests.
- `npm.cmd run tool:content-lint` - passed, `content-lint: ok (53 files checked)`.
- `node --test tests/unit/run-lifecycle.test.mjs` - passed, 13 tests.
- `node --test tests/unit/legacy-ledger-presentation.test.mjs` - passed, 13 tests.
- `node --test tests/unit/chronicle-run-end-summary-presentation.test.mjs` - passed, 17 tests.
- `git diff --check` - passed with LF-to-CRLF warning for `docs/dev/current-codex-output.md`.

No broad typecheck was run because this pass did not require it and the repo documents known typecheck target blockers.

## Risks / Follow-Up
- The projection is not yet visible in UI. 0.5.77 should render it read-only without adding mutation paths.
- Some display labels are intentionally conservative. The read-only UI pass may tune layout/copy while preserving the stored-data-only and no-action rules.
- The projection imports lifecycle helpers for authority/source-id classification; it does not call payout resolution or lifecycle mutation paths.
- Existing account meta Chronicle tiles remain unchanged and still use their current compact labels.
- No new deferred work was discovered, so `docs/future_content_backlog.md` was not changed.

## Temporary Guardrail Cleanup Decision
`docs/design/chronicle-run-end-summary-source-audit.md` remains useful through Version 0.5.77 as a source-detail reference for the read-only UI integration. After the UI pass lands, fold durable rules into `docs/design/future-system-design-ledger.md` and delete or mark the source audit consumed if it no longer protects implementation choices.

## Next Recommended Version
Version 0.5.77 - Chronicle Run-End Read-Only UI

## Suggested Commit Message
feat(chronicle): add run-end summary projection
