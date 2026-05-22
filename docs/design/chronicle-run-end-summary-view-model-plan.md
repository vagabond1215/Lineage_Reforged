# Chronicle Run-End Summary View Model Plan

Date: 2026-05-22
Route: ChatGPT via GitHub Connector
Status: planning source for `Version 0.5.75 - Chronicle Run-End Summary View Model Plan`

## Purpose

Plan the first read-only Chronicle run-end impact summary before implementation.

This plan turns `docs/design/chronicle-run-end-summary-source-audit.md` into a Codex-ready source for a later pure projection and UI pass.

This plan does not:

- implement a run-end UI
- edit lifecycle logic
- change account history records
- change Legacy payout behavior
- change estate deposit behavior
- add Chronicle Marks
- add Lineage Seals
- add Family Prestige grants
- add Bloodlines behavior
- update generated UI output

## Current Source Reality

Current repo sources already expose enough data for a read-only first summary:

- `AccountRunHistoryRecord` stores identity, lineage, optional family links, starting location, timing, outcome, archive reason, Echo peak, notable achievements, payout metadata, inheritance uses, survived days, source run, cross-lineage start, and save slots.
- `resolveRunLegacyPayout(...)` computes payout eligibility and breakdown, but future UI should not recompute payout math.
- `runLifecycle.ts` owns terminal transitions such as retirement, active-run archive, payout resolution, estate deposit, profile save, and slot clearing.
- `accountMetaPresentation.ts` already maps run records into Chronicle tiles, but the tile shape is too compact for a single-run end summary.

## 0.5.75 Recommended Output

`Version 0.5.75 - Chronicle Run-End Summary View Model Plan` should create or update this plan only if it needs refinement after local repo inspection.

If Codex finds the source shape clear, the next implementation should be:

- `Version 0.5.76 - Chronicle Run-End Summary Pure Projection`

## Future View-Model Shape

Suggested future file:

- `apps/rpg-ui/src/game-shell/chronicleRunEndSummaryPresentation.ts`

Suggested pure function:

```ts
buildChronicleRunEndSummaryViewModel(input)
```

Suggested input:

- terminal run record or archived `AccountRunHistoryRecord`
- optional lifecycle result if current source exposes one
- account profile only for read-only contextual labels if required

Suggested output:

- title
- subtitle
- outcome label
- archive reason label
- character identity rows
- lineage/family/source-line rows
- starting location rows
- survival/duration rows
- Echo/progression rows
- notable deed rows
- Legacy payout summary rows
- payout breakdown rows from stored/resolved fields only
- estate/inheritance read-only note rows if already present in run record/lifecycle result
- warning notes for missing/non-authoritative/deleted records
- empty/fallback state
- no action ids

## Data Rules

- Read terminal lifecycle result and stored account profile data only.
- Do not recompute Legacy payout in the UI projection.
- Do not grant Legacy.
- Do not deposit estate assets.
- Do not create Chronicle Marks or Lineage Seals.
- Do not create Family Prestige transactions.
- Do not create Bloodlines behavior.
- Do not infer family from `lineageId`.
- Do not infer parent/child relation from `sourceRunId` alone.
- Do not fabricate achievements, deaths, retirements, heirs, estate claims, or family status.

## UI Rules For Later 0.5.77

- Read-only summary only.
- Should appear after terminal lifecycle completion, not before authoritative lifecycle result exists.
- No buttons except ordinary close/continue/navigation controls already owned by the launcher flow.
- No claim, spend, convert, seal, mark, transfer, inherit, or register actions.
- Explain why a run mattered using stored data, not generated lore.

## Future Tests

Future projection tests should prove:

1. Death summary renders identity, outcome, survival, Echo, and payout labels from stored data.
2. Retirement summary renders retirement-specific outcome/archive labels.
3. Deleted/non-authoritative records produce safe warnings.
4. Payout breakdown is read, not recomputed.
5. Missing optional family/location fields produce unknown/unavailable labels.
6. `lineageId` is not treated as `familyId`.
7. `sourceRunId` does not create parent relation by itself.
8. No action ids are emitted.
9. No Chronicle Marks, Lineage Seals, Family Prestige grants, Bloodlines changes, estate delivery, or Legacy payout mutation is represented.

## Validation For Implementation Pass

Future Codex implementation should run:

- `npm.cmd run tool:content-lint`
- focused run lifecycle / account meta / projection tests if present
- the new run-end summary projection test
- `git diff --check`

Do not run broad typecheck unless typecheck target policy has been cleaned up and the prompt explicitly asks for it.