# Chronicle Run-End Summary View Model Plan

Date: 2026-05-24
Route: Codex Local docs-only planning pass
Status: planning source for `Version 0.5.76 - Chronicle Run-End Summary Pure Projection`

## Purpose

Plan the first read-only Chronicle run-end impact summary before implementation.

This plan finalizes the data-owner map from current local source inspection. It is meant to support a later pure projection pass, followed by a separate read-only UI pass.

This plan does not:

- implement `chronicleRunEndSummaryPresentation.ts`
- add React UI
- edit lifecycle logic
- change account history records
- change Legacy payout behavior
- change estate deposit or claim behavior
- add Chronicle Marks
- add Lineage Seals
- add Family Prestige grants or spending
- add Bloodlines behavior
- update generated UI output

## Current Repo Reality

Current source already stores enough data for a conservative read-only summary, but the authoritative owners are split:

- `AccountRunHistoryRecord` in `packages/shared/types/src/contracts.ts` owns durable run identity, outcome, origin, optional family/source links, Echo peak, notable achievement ids, payout metadata, runtime duration, inheritance-use count, and slot ids.
- `resolveRunLegacyPayout(...)` in `packages/engines/game-engine/src/run-legacy-payout.ts` owns payout math. A summary must not call it to recompute awards.
- `archiveActiveRun(...)` in `apps/rpg-ui/src/game-shell/runLifecycle.ts` owns the authoritative archive transition: achievement evaluation, payout resolution, Legacy grant when applicable, payout metadata persistence, estate deposit, profile save, and slot clearing.
- `retainRetiredRun(...)` in `runLifecycle.ts` owns the retained-retirement transition: achievement evaluation, retired outcome fields, inheritance-use count, retained slots, profile save. It does not perform the archive payout or estate deposit path.
- `consumeRetiredRunInheritanceUse(...)` owns decrementing retained retirement uses. A summary may read the resulting count, but must not consume it.
- `isRunChronicleVisible(...)`, `isRunProgressionAuthoritative(...)`, `isRunLineageAuthoritative(...)`, `isRunDeleted(...)`, and `resolveRunHistorySourceId(...)` already describe current authority boundaries for run records.
- `depositEstateFromArchivedSnapshot(...)` in `packages/engines/game-engine/src/account-estate.ts` owns archive-time estate deposits. A summary may read stored estate deposit/asset records after lifecycle completion, but must not deposit or move assets.
- `accountMetaPresentation.ts` already builds compact Chronicle tiles and estate previews. It is a useful label precedent, but a run-end summary needs a richer single-run shape and must avoid inheriting any copy that implies unsupported parent/child or claim behavior.
- `AccountMetaPanel.tsx` renders the existing account meta surfaces. It is not the owner for the future run-end summary projection.

Confirmed absent or deferred:

- no Chronicle Mark owner
- no Lineage Seal owner
- no Family Prestige grant/spend owner from run end
- no heir slot owner
- no heirloom or bequest runtime
- no estate claim delivery seam
- no family management behavior
- no Bloodlines mutation from run end

## Data-Owner Map

| Future summary section | Current source owner | Read allowed | Validation owner | Missing-owner behavior |
| --- | --- | --- | --- | --- |
| Run identity header | `AccountRunHistoryRecord` | `characterId`, `name`, `lineageId`, optional `familyId`, optional `parentCharacterId` | projection should validate missing record and deleted/non-authoritative state | show unknown or warning labels, not fabricated identity |
| Outcome and archive reason | `AccountRunHistoryRecord`, lifecycle classifiers in `runLifecycle.ts` | `outcome`, `archiveReason`, `endedAt`, `lastSeenAt` | `runLifecycle.ts` outcome helpers | show archived/retired/death/deleted labels only from stored outcome fields |
| Origin | `AccountRunHistoryRecord` | `startingContinentId`, `startingRegionId`, `startingSettlementId` | projection label helper | show unknown origin for missing or unsafe ids |
| Survival and duration | `archiveActiveRun(...)` persisted metadata | `survivedDays`, `totalPlayTicks`, `startedAt`, `endedAt` | lifecycle runtime summary at archive time | show unavailable if fields are absent; do not recompute from wall-clock timestamps as authoritative survival |
| Echo/progression | `AccountRunHistoryRecord` | `echoLevelReached`, optional `legacyPayoutBaseline.echoLevel` | payout/lifecycle owners for stored fields | show Echo peak and optional stored baseline context only |
| Notable deeds | `AccountRunHistoryRecord`, achievement definitions | `notableCharacterAchievementIds`, achievement titles via current helper | achievements engine owns definitions | fallback to conservative deed labels for unknown ids |
| Legacy payout summary | `archiveActiveRun(...)` plus `run-legacy-payout.ts` persisted result | `payoutEligible`, `legacyGranted`, `payoutBreakdown`, `legacyPayoutResolvedAt`, `legacyPayoutTransactionId` | `run-legacy-payout.ts` and archive lifecycle | show no-payout or unavailable if unresolved; never call payout resolver |
| Legacy transaction context | `grantLegacyReward(...)` and stored run metadata | `legacyPayoutTransactionId`, optional lifecycle `rewardTransactionId` | Legacy account helpers | show read-only transaction reference only when present |
| Estate deposit summary | `depositEstateFromArchivedSnapshot(...)`, `AccountProfileState.estate` | matching `estate.deposits` and `estate.assets` by `resolveRunHistorySourceId(record)` | account estate helpers | show stored deposit/asset counts only; no claim or transfer |
| Continuity/source line | `AccountRunHistoryRecord`, `resolveRunHistorySourceId(...)` | `sourceRunId`, `crossLineageStart`, `inheritanceUsesRemaining`, explicit `familyId`, explicit `parentCharacterId` | lifecycle/account profile data | show source-link context only; do not infer parent/child or family from `sourceRunId` |
| Slot impact | lifecycle result and run record | `clearedSlotIds`, `retainedSlotIds`, `saveSlotIds` if passed/persisted | lifecycle result owner | show read-only closure/retention labels only |
| Warnings | projection | missing record, deleted record, non-authoritative record, unresolved payout metadata, absent estate owner data | projection tests | warn conservatively instead of filling gaps |

## Planned Projection Boundary

Future file:

- `apps/rpg-ui/src/game-shell/chronicleRunEndSummaryPresentation.ts`

Future pure function:

```ts
export function buildChronicleRunEndSummaryViewModel(
  input: ChronicleRunEndSummaryInput
): ChronicleRunEndSummaryViewModel
```

Recommended input shape:

```ts
export type ChronicleRunEndSummaryInput = {
  accountProfile: AccountProfileState;
  runRecord: AccountRunHistoryRecord | null;
  lifecycleResult?: {
    legacyGranted?: number;
    rewardTransactionId?: string;
    clearedSlotIds?: string[];
    retainedSlotIds?: string[];
    inheritanceUsesRemaining?: number;
  } | null;
};
```

Input rules:

- `runRecord` is the authoritative summary source when present.
- `accountProfile` may be read for history lookups, achievement labels through existing helpers, and estate records.
- `lifecycleResult` may supply immediate transition context that is not persisted as a run-history field, such as cleared or retained slot ids.
- Do not read `SaveSnapshot` directly for projection fields after lifecycle has produced a terminal record.
- Do not accept raw payout inputs separate from stored run metadata.

Recommended output shape:

```ts
export type ChronicleRunEndSummaryViewModel = {
  id: string;
  title: string;
  subtitle: string;
  outcomeLabel: string;
  statusTone: "active" | "retired" | "death" | "archived" | "deleted" | "unknown";
  identityRows: Array<{ label: string; valueLabel: string }>;
  originRows: Array<{ label: string; valueLabel: string }>;
  survivalRows: Array<{ label: string; valueLabel: string }>;
  progressionRows: Array<{ label: string; valueLabel: string }>;
  deedRows: Array<{ id: string; label: string; detailLabel: string | null }>;
  payoutRows: Array<{ label: string; valueLabel: string; detailLabel: string | null }>;
  estateRows: Array<{ label: string; valueLabel: string; detailLabel: string | null }>;
  continuityRows: Array<{ label: string; valueLabel: string; detailLabel: string | null }>;
  slotRows: Array<{ label: string; valueLabel: string }>;
  warningLabels: string[];
  actionIds: [];
};
```

Output rules:

- `actionIds` must always be an empty tuple/array in the first implementation.
- Rows must be display-ready and read-only.
- Missing optional fields should produce unknown, unavailable, or omitted rows rather than guessed data.

## Source Fields That May Be Read

From `AccountRunHistoryRecord`:

- `characterId`
- `name`
- `lineageId`
- `familyId`
- `parentCharacterId`
- `startingContinentId`
- `startingRegionId`
- `startingSettlementId`
- `startedAt`
- `endedAt`
- `lastSeenAt`
- `outcome`
- `archiveReason`
- `echoLevelReached`
- `notableCharacterAchievementIds`
- `legacyPayoutBaseline`
- `legacyGranted`
- `inheritanceUsesRemaining`
- `totalPlayTicks`
- `survivedDays`
- `payoutEligible`
- `payoutBreakdown`
- `legacyPayoutResolvedAt`
- `legacyPayoutTransactionId`
- `sourceRunId`
- `crossLineageStart`
- `saveSlotIds`

From `AccountProfileState`:

- `history.runRecords` for source-run lookup, deleted/non-authoritative checks, and child/source references only when explicit fields exist.
- `estate.deposits` and `estate.assets` for stored archive-time estate summaries keyed by `resolveRunHistorySourceId(record)`.

From lifecycle result:

- `legacyGranted` only as display confirmation of what lifecycle just returned, not as a replacement for persisted run metadata.
- `rewardTransactionId` as read-only transaction context.
- `clearedSlotIds`, `retainedSlotIds`, and `inheritanceUsesRemaining` as immediate transition context.

From helpers:

- `resolveRunHistorySourceId(record)` for stable source id matching.
- lifecycle authority helpers for deleted/progression/lineage states.
- achievement definition title helper for known achievement ids, with conservative fallback.

## Source Fields That Must Not Be Inferred

- Do not infer `familyId` from `lineageId`, `sourceRunId`, account id, character id, selected backstory, or UI state.
- Do not treat `lineageId` as a family, Bloodline, noble house, or inheritance owner.
- Do not infer parent/child relation from `sourceRunId` alone.
- Do not infer heir availability from `inheritanceUsesRemaining`.
- Do not infer estate claimability from stored estate assets.
- Do not infer bequests or heirlooms from estate deposits.
- Do not infer Chronicle Marks or Lineage Seals from achievements, Echo level, death, retirement, or payout.
- Do not infer Family Prestige grants from Legacy payout, family id, or source-run linkage.
- Do not infer missing notable deeds from Echo level or payout score.
- Do not infer payout by running `resolveRunLegacyPayout(...)` in the projection.
- Do not infer survival days from current time if `survivedDays` is absent.

## Allowed / Deferred Behavior

| Area | Allowed in 0.5.76 projection | Deferred / forbidden |
| --- | --- | --- |
| Run identity | Read stored run record fields and safe labels. | Fabricating name, family, title, status, or parentage. |
| Outcome | Display stored outcome/archive reason. | Changing outcome or archive reason. |
| Payout | Display stored payout metadata and breakdown rows. | Recomputing payout, granting Legacy, creating transactions. |
| Achievements | Display known achievement titles or safe fallback labels. | Creating new deeds or achievement unlocks. |
| Estate | Display stored deposit/asset counts and read-only rows for this source run. | Depositing, claiming, delivering, moving, splitting, or spending estate assets. |
| Continuity | Display explicit source-link, cross-lineage, explicit family, explicit parent, and retained-use fields. | Creating heirs, family records, Bloodlines behavior, or parent/child relation from sourceRunId alone. |
| Slots | Display lifecycle-provided cleared/retained slot counts. | Deleting, retaining, or moving saves from the projection. |
| Chronicle meta | Display summary copy. | Creating Chronicle Marks or Lineage Seals. |
| Family economy | Display nothing beyond explicit stored family/source labels if needed. | Creating Family Prestige grants/spends or family unlocks. |
| UI actions | Emit no action ids. | claim, spend, convert, seal, mark, inherit, transfer, register, retry, resurrect, or purchase commands. |

## UI Rules For Later 0.5.77

- Read-only summary only.
- Should appear only after terminal lifecycle completion or when viewing an existing authoritative record.
- No buttons except ordinary close/continue/navigation controls already owned by the launcher flow.
- No claim, spend, convert, seal, mark, transfer, inherit, register, purchase, or payout actions.
- Explain why a run mattered using stored data, not generated lore.
- Do not place the summary in Bloodlines unless a later prompt explicitly owns that UI placement.

## Future Tests For 0.5.76

Focused projection tests should prove:

1. Missing `runRecord` returns a safe missing-record summary with warnings and no actions.
2. Active records render as non-terminal context and do not claim payout resolution.
3. Retired retained records render retirement outcome, retained slots, inheritance-use count, and no estate deposit claim.
4. Archived death records render death outcome, survival, Echo, deeds, and stored payout rows.
5. Hardcore death records render a distinct hardcore/death label from `archiveReason`.
6. Deleted records render non-authoritative warnings and no payout/estate/action claims.
7. Stored `legacyGranted`, `payoutEligible`, `payoutBreakdown`, `legacyPayoutResolvedAt`, and `legacyPayoutTransactionId` are displayed without calling `resolveRunLegacyPayout(...)`.
8. A deliberately contradictory payout fixture still displays stored payout metadata, proving the projection does not recompute math.
9. Unknown achievement ids use conservative fallback labels, while known ids use achievement titles.
10. Missing optional family/location/duration fields produce unavailable or omitted labels, not fabricated values.
11. `lineageId` is never treated as `familyId`.
12. `sourceRunId` can link to a source record label but does not create parent/child copy without explicit parent/family evidence.
13. Estate rows read only stored deposits/assets matching `resolveRunHistorySourceId(record)`.
14. Estate assets never produce claim, transfer, bequest, or heirloom actions.
15. Lifecycle `clearedSlotIds` and `retainedSlotIds` produce read-only slot impact rows only.
16. `actionIds` is always empty.
17. No Chronicle Marks, Lineage Seals, Family Prestige grants/spends, Bloodlines mutations, estate delivery, or Legacy grants are represented.

Recommended validation for 0.5.76:

- `npm.cmd run tool:content-lint`
- `node --test tests/unit/run-lifecycle.test.mjs`
- `node --test tests/unit/legacy-ledger-presentation.test.mjs`
- new `node --test tests/unit/chronicle-run-end-summary-presentation.test.mjs`
- `git diff --check`

Do not run broad typecheck unless a later prompt explicitly scopes typecheck cleanup or the target is known green.

## Temporary Guardrail Cleanup Decision

`docs/design/chronicle-run-end-summary-source-audit.md` remains useful as a source-detail reference through `0.5.76` and `0.5.77`.

This plan is now the active implementation source. After the pure projection and read-only UI land, fold any durable Chronicle run-end rules into `docs/design/future-system-design-ledger.md`, then delete or mark the source audit consumed in a cleanup pass if it no longer protects implementation decisions.

## Next Recommended Version

Version 0.5.76 - Chronicle Run-End Summary Pure Projection
