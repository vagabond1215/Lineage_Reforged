# Current Codex Output

Source version/run: Version 0.5.71 - Bloodlines View Model Implementation Plan
Date: 2026-05-21
Branch/status assumption: Ran locally on `master`; worktree was clean at start and now contains only the intended narrow source/test/backlog/output changes.

## Result
Implemented a pure, read-only Bloodlines presentation projection in `apps/rpg-ui/src/game-shell/bloodlinesPresentation.ts` and added focused unit coverage in `tests/unit/bloodlines-presentation.test.mjs`.

The implementation path was clean: current account profile state already exposes explicit family records, family-scoped Prestige transactions, family-scoped unlock ownership, and run-history records with optional `familyId` / `parentCharacterId` fields. No planning-only fallback was needed.

## Files Inspected
- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/design/future-system-design-ledger.md`
- `docs/design/bloodlines-information-architecture-audit.md`
- `docs/design/chronicles-bloodline-tree-presentation-plan.md`
- `docs/design/heirloom-and-bequest-systems-plan.md`
- `docs/design/heirloom-vs-bequest-vocabulary-audit.md`
- `docs/design/legacy-scope-bloodline-economy-plan.md`
- `docs/future_content_backlog.md`
- `packages/shared/types/src/contracts.ts`
- `packages/engines/game-engine/src/account-family.ts`
- `packages/engines/game-engine/src/legacy-account.ts`
- `packages/engines/game-engine/src/legacy-unlocks.ts`
- `apps/rpg-ui/src/game-shell/accountProfileManager.ts`
- `apps/rpg-ui/src/game-shell/accountMetaPresentation.ts`
- `apps/rpg-ui/src/game-shell/components/AccountMetaPanel.tsx`
- `apps/rpg-ui/src/game-shell/runLifecycle.ts`
- `tests/unit/account-family.test.mjs`
- `tests/unit/account-profile-storage.test.mjs`
- `tests/unit/legacy-ledger-presentation.test.mjs`
- `tests/unit/legacy-unlocks.test.mjs`

## Files Changed
- `apps/rpg-ui/src/game-shell/bloodlinesPresentation.ts`
- `tests/unit/bloodlines-presentation.test.mjs`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Projection / Plan Summary
- Input data: `buildBloodlinesViewModel(profile)` reads only current `AccountProfileState` data, specifically `profile.families.families`, `profile.families.prestigeTransactions`, `profile.families.familyUnlocks`, and `profile.history.runRecords`.
- Output shape: a deterministic `BloodlinesViewModel` with `hasFamilies`, an empty-state label, summary stats, family summaries, inactive future-system sections, and empty top-level `actionIds`.
- Family summary fields: `familyId`, `familyName`, `status`, `statusLabel`, `rootCharacterId`, `rootLabel`, `memberCount`, `memberCharacterIds`, `knownRunCount`, `latestKnownActivityAt`, warnings, and a small tree summary.
- Family Prestige summary fields: earned, spent, available, formatted labels, and category summaries derived through the existing `resolveFamilyPrestigeTotals(...)` helper.
- Family unlock summary fields: family-scoped unlock ids, optional rank, unlocked timestamp, and source transaction id from existing `listFamilyUnlocks(...)`.
- Run-history/tree summary fields: only records with explicit matching `record.familyId` are linked. `parentCharacterId` is treated as a relation only when it points to another linked run in the same family. `sourceRunId` is displayed as source context only and never creates a parent or family relation. `lineageId` is never treated as `familyId`.
- Inactive states: heirs, heirlooms, bequests, family management, and Family Prestige spending are represented as inactive/read-only sections with no action ids or command metadata.
- Empty-state behavior: default or empty account profiles return `hasFamilies: false`, no family summaries, safe zero summary stats, inactive future-system sections, and no Backstory Eligibility evidence fields.

## Current Repo Reality Confirmed
- Current account profile state has explicit family records under `AccountFamiliesState`.
- Family Prestige currently exists as passive family-scoped ledger transactions and helper-derived totals.
- Family unlock ownership is stored per family and can be projected without inventing account-wide ownership.
- Run history can link to a family only through explicit `familyId`; it can optionally record `parentCharacterId` and `sourceRunId`.
- No Bloodlines UI currently consumes `profile.families`.
- Heir slots, family management, heirlooms, bequests, item-instance persistence, estate transfer/claim execution for this surface, Chronicle Marks, and Lineage Seals remain absent/deferred.
- Family Prestige spending remains absent beyond stored passive spend transactions already supported by the ledger helper.

## Behavior / Runtime Confirmation
- runtime mutation changed: no.
- UI changed: no React UI was added or wired.
- schemas changed: no.
- tests changed: yes, focused unit tests were added for the projection.
- content JSON changed: no.
- generated output changed: no.
- Backstory Eligibility behavior changed: no.
- creator availability changed: no.
- Family Prestige spending changed: no.
- heirloom/bequest runtime added: no.
- family management added: no.
- deferred systems touched: projection/planning only. The backlog now records that UI, family management, heirs, heirlooms, bequests, item instances, estate transfer/claims, Family Prestige spending, Chronicle Marks, Lineage Seals, and scoped Backstory Legacy evidence remain deferred.

## Tests / Checks Run
- `node --test tests/unit/bloodlines-presentation.test.mjs` - passed, 12 tests.
- `npm run tool:content-lint` - blocked by local PowerShell execution policy for `npm.ps1`; no project failure.
- `npm.cmd run tool:content-lint` - passed, `content-lint: ok (53 files checked)`.
- `node --test tests/unit/account-family.test.mjs` - passed, 5 tests.
- `node --test tests/unit/account-profile-storage.test.mjs` - passed, 14 tests.
- `node --test tests/unit/legacy-ledger-presentation.test.mjs` - passed, 13 tests.
- `node --test tests/unit/legacy-unlocks.test.mjs` - passed, 21 tests.
- `node --test tests/unit/bloodlines-presentation.test.mjs` - passed again after final projection tightening, 12 tests.
- `git diff --check` - passed; PowerShell reported LF-to-CRLF normalization warnings for `docs/dev/current-codex-output.md` and `docs/future_content_backlog.md`, with exit code 0.

## Risks / Follow-Up
- The projection is intentionally not wired into `AccountMetaPanel.tsx`; a later UI pass must decide placement, filtering, and visual hierarchy.
- The projection exposes current family and run-history reality only; it does not repair missing roots, missing members, or source-only links.
- Future UI should avoid making inactive heirloom, bequest, family management, or Family Prestige spending sections look actionable.
- Future implementation should keep Bloodline records separate from lineage/species ids and from Backstory Eligibility resolver evidence.
- No broad typecheck was run because previous handoffs note known broad workspace typecheck blockers, and this pass had focused validation coverage.

## Temporary Guardrail Cleanup Decision
- Keep `docs/design/bloodlines-information-architecture-audit.md` for now. It still contains UI sequencing and information-architecture guidance for the next read-only Bloodlines UI pass.
- Keep `docs/design/chronicles-bloodline-tree-presentation-plan.md` for now. The new projection implements part of its read-only model, but UI presentation and tree visualization rules remain useful.
- Keep `docs/design/heirloom-and-bequest-systems-plan.md` for now. This pass did not consume the heirloom/bequest implementation plan beyond marking those sections inactive.
- Keep `docs/design/legacy-scope-bloodline-economy-plan.md` for now. It still records scope and economy boundaries for future Family Prestige and scoped evidence work.
- Fold durable projection rules into a future design ledger only after the read-only UI pass consumes this model.

## Next Recommended Version
Version 0.5.72 - Bloodlines Read-Only Account Meta UI

This is the best next step because the pure projection is now implemented and tested, while no React UI currently consumes it.

## Suggested Commit Message
feat(account): add bloodlines view model projection
