# Chronicle Run-End Summary Source Audit

Source route: ChatGPT via GitHub Connector
Date: 2026-05-19
Status: promoted source audit; no runtime/source/UI changes

0.5.75 sequencing note: this audit has been promoted into `docs/design/chronicle-run-end-summary-view-model-plan.md`, which is the active source for `Version 0.5.75 - Chronicle Run-End Summary View Model Plan` through the planned `0.5.76` projection and `0.5.77` read-only UI passes. Keep this audit for source detail, but do not treat the older `0.5.69` prompt target below as current pipeline authority.

## Purpose

This audit maps existing sources for a future run-end Chronicle impact summary for death, retirement, and archival outcomes.

The goal is to prepare a future planning or implementation pass that makes run endings feel meaningful without inventing data or bypassing current run lifecycle ownership.

This document does not:

- implement a run-end UI
- edit lifecycle logic
- change account history records
- change Legacy payout behavior
- change estate deposit behavior
- change achievement behavior
- change save deletion/retirement behavior
- add Chronicle Marks
- add Lineage Seals
- add Family Prestige grants
- add Bloodlines behavior
- update generated UI output
- update `docs/dev/current-codex-output.md`

## Sources Inspected

- `docs/dev/project-roadmap.md`
- `packages/shared/types/src/contracts.ts`
- `packages/engines/game-engine/src/run-legacy-payout.ts`
- `apps/rpg-ui/src/game-shell/runLifecycle.ts`
- `apps/rpg-ui/src/game-shell/accountMetaPresentation.ts`
- `apps/rpg-ui/src/game-shell/components/AccountMetaPanel.tsx`
- `docs/design/future-system-design-ledger.md`

## Current Data Sources

### Account run history

`AccountRunHistoryRecord` already stores most of the durable run-ending data needed for a first summary:

- `characterId`
- `name`
- `lineageId`
- optional `familyId`
- optional `parentCharacterId`
- starting continent/region/settlement ids
- `startedAt`
- optional `endedAt`
- `lastSeenAt`
- `outcome`
- optional `archiveReason`
- `echoLevelReached`
- `notableCharacterAchievementIds`
- optional payout baseline
- optional `legacyGranted`
- optional `inheritanceUsesRemaining`
- optional `totalPlayTicks`
- optional `survivedDays`
- optional payout eligibility/breakdown/resolution fields
- optional `sourceRunId`
- optional `crossLineageStart`
- `saveSlotIds`

This is enough for a read-only run-end impact summary focused on identity, outcome, survival length, Echo depth, notable deeds, Legacy payout, source-line continuity, and origin.

### Legacy payout

`resolveRunLegacyPayout(...)` already computes:

- payout eligibility
- `legacyGranted`
- detailed `payoutBreakdown`
- summary text
- source type/id

The breakdown includes:

- progression depth
- notable deeds
- survival depth
- milestone quality
- archive reason modifier
- challenge modifier
- shallow run modifier
- repeated weak run modifier
- raw score
- modified score
- final amount

This can feed a future summary, but the UI should not recompute payout math. It should read resolved fields from the run record or lifecycle result.

### Run lifecycle

`runLifecycle.ts` already owns the main terminal transitions:

- `retainRetiredRun(...)`
- `consumeRetiredRunInheritanceUse(...)`
- `archiveActiveRun(...)`
- `resolveTerminalArchiveReason(...)`
- `resolveArchivedRunRuntimeSummary(...)`
- `isRunChronicleVisible(...)`
- `isRunProgressionAuthoritative(...)`
- `isRunLineageAuthoritative(...)`
- `isRunDeleted(...)`
- `resolveEligibleHeirSources(...)`
- `resolveHeirSourceById(...)`

`archiveActiveRun(...)` evaluates achievements, resolves payout, grants Legacy if applicable, applies payout metadata to the run record, archives the run, deposits estate assets, saves the account profile, and clears slots.

A future run-end summary should attach after this lifecycle owner has produced the authoritative result, not before.

### Account meta Chronicle UI

`accountMetaPresentation.ts` already maps run records into Chronicle tiles with:

- title/name
- lineage label
- origin label
- status tag
- Echo peak
- Prestige earned label
- duration label
- deed labels
- lineage cue labels
- authority note
- filter ids
- deleted/non-authoritative state

This is a good source for consistent labels, but a run-end summary needs richer single-run breakdown than the current tile.

`AccountMetaPanel.tsx` currently renders Legacy and Chronicles sections, including Chronicle summary stats, estate preview, filters, and Chronicle tiles.

## Recommended Summary Shape

A first run-end summary should be read-only and derived from the terminal lifecycle result and stored account profile.

Suggested sections:

### 1. Outcome Header

Fields:

- character name
- outcome label: Retired, Death, Hardcore Death, Archived, Deleted only if relevant
- lineage label
- origin label
- started/ended timestamps if available

Safe copy:

```text
Arden Voss was retired into the Chronicle.
Mira Voss died and was archived into the Chronicle.
```

Avoid implying a reward when none was granted.

### 2. Survival And Progress

Fields:

- survived days
- total play ticks if useful for developer/debug context
- Echo level reached
- payout baseline if present
- earned Echo since baseline if derived by helper

Display priority:

1. survived days
2. Echo peak
3. notable deeds

### 3. Notable Deeds

Fields:

- `notableCharacterAchievementIds`
- resolved achievement titles through the achievement definition helper if used in a view-model pass

Rules:

- show only current known titles
- use conservative fallback for unknown ids
- do not generate narrative deeds from missing ids

### 4. Legacy Award

Fields:

- `payoutEligible`
- `legacyGranted`
- `payoutBreakdown`
- `legacyPayoutResolvedAt`
- `legacyPayoutTransactionId`

Copy:

```text
Legacy awarded: 12
No Legacy awarded.
```

Optional detail rows:

- progression depth
- notable deeds
- survival depth
- archive modifier
- shallow-run modifier
- final amount

Rules:

- read stored payout metadata
- do not recalculate payout in React
- do not grant Legacy from the summary view

### 5. Estate / Claims

Fields:

- estate deposit and asset preview data if produced by `depositEstateFromArchivedSnapshot(...)`
- estate preview already exists in account meta

Rules:

- if estate assets were deposited, summarize count/value only from stored estate data
- if no estate deposit exists, show no estate transfer
- do not imply bequests or heirloom transfer
- do not move assets from summary UI

### 6. Continuity / Lineage

Fields:

- `sourceRunId`
- `inheritanceUsesRemaining`
- `crossLineageStart`
- optional `familyId`
- optional `parentCharacterId`

Rules:

- `sourceRunId` can support continuity copy, but is not a family id
- `familyId` can support future Bloodlines summaries only when real family records exist
- inheritance uses should not imply heir slots or family management

Safe copy:

```text
This retired record can support future inheritance starts while uses remain.
```

Unsafe copy:

```text
A new heir is available.
```

unless heir systems actually exist.

## Missing Owners

A future run-end summary should not claim these until owners exist:

| Missing owner | Do not summarize yet |
| --- | --- |
| Family Prestige grant owner | family prestige earned/spent by this run |
| Chronicle Marks owner | account mark conversion or milestone award |
| Lineage Seals owner | branch closure/capstone seal award |
| Heir slot owner | available heir count or heir generation |
| Bloodlines projection owner | family tree updates beyond current stored records |
| Bequest owner | intentional estate/material transfers |
| Heirloom item-instance owner | heirloom transfer, loss, recovery, registration |
| Reputation/renown persistence owner | local/regional/family renown carry-forward |
| Combat history owner | detailed kill/combat report beyond achievements |
| Magic runtime/acquisition owner | spell mastery or magic legacy awards |

## Recommended View-Model Boundary

Future implementation should add a pure view model before React:

```ts
type RunEndSummaryViewModel = {
  characterId: string;
  title: string;
  outcomeLabel: string;
  originLabel: string;
  lineageLabel: string;
  durationLabel: string | null;
  echoPeakLabel: string;
  deedLabels: string[];
  legacyAwardLabel: string;
  payoutRows: Array<{ label: string; valueLabel: string }>;
  estateRows: Array<{ label: string; valueLabel: string }>;
  continuityLabels: string[];
  warningLabels: string[];
};
```

Do not add this type in this audit.

## Recommended Implementation Sequence

1. Create a pure summary projection from an `AccountRunHistoryRecord` plus account profile.
2. Reuse existing label helpers or factor them out from `accountMetaPresentation.ts` if needed.
3. Add focused tests for death, hardcore death, retirement, no-payout, payout, estate-present, no-estate, source-run continuity, deleted/non-authoritative cases.
4. Render summary after lifecycle result only.
5. Keep all actions absent in the first UI pass.

## Forbidden In First Implementation

- no payout recalculation in React
- no Legacy grant from summary UI
- no estate asset movement
- no bequest transfer
- no heirloom registration/transfer
- no Family Prestige grant
- no Chronicle Mark conversion
- no Lineage Seal award
- no automatic family record creation
- no resurrection/retry mechanics
- no generated narrative claims unsupported by data

## Recommended Next Prompt Target

Historical prompt target below is superseded by `docs/design/chronicle-run-end-summary-view-model-plan.md` and the current sequenced queue. It is retained only for context.

```text
Version 0.5.69 - Chronicle Run-End Summary View-Model Plan

Use docs/design/chronicle-run-end-summary-source-audit.md as the source map.
Plan a pure read-only run-end summary view model from current AccountRunHistoryRecord, account profile, payout metadata, achievement titles, estate preview/deposit data, and source-run continuity fields.
Do not implement React UI unless explicitly scoped.
Do not change lifecycle behavior, payout behavior, estate delivery, Legacy rewards, family records, Family Prestige, Chronicle Marks, Lineage Seals, heirs, bequests, heirlooms, Backstory Eligibility, or generated UI output.
```
