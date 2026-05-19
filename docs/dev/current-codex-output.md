# Current Codex Output

Source version/run: Version 0.5.61 - Family Records And Prestige Ledger Runtime Shape
Date: 2026-05-19
Branch/status assumption: Current local branch reality. `git status --short` was run before edits and showed a clean worktree.

## Result

Added the first runtime-owned family/Bloodline account shape. Account profiles now have a current-data `families` container, run history records can carry optional family linkage fields, and the game engine exposes passive family prestige ledger total helpers.

## Files Inspected

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/future_content_backlog.md`
- `docs/design/legacy-scope-bloodline-economy-plan.md`
- `docs/design/backstory-legacy-purchase-integration-plan.md`
- `docs/design/backstory-evidence-ownership-plan.md`
- `packages/shared/types/src/contracts.ts`
- `packages/engines/game-engine/src/legacy-account.ts`
- `packages/engines/game-engine/src/account-achievement-state.ts`
- `packages/engines/game-engine/src/account-estate.ts`
- `packages/engines/game-engine/src/legacy-unlocks.ts`
- `packages/engines/game-engine/src/index.ts`
- `apps/rpg-ui/src/game-shell/accountProfileManager.ts`
- `apps/rpg-ui/src/game-shell/accountMetaPresentation.ts`
- `apps/rpg-ui/src/game-shell/components/AccountMetaPanel.tsx`
- `tests/unit/account-profile-storage.test.mjs`
- `tests/unit/legacy-start-resources.test.mjs`
- `tests/unit/legacy-account.test.mjs`
- `tests/unit/account-estate.test.mjs`
- `tests/unit/achievements.test.mjs`
- `tests/unit/run-lifecycle.test.mjs`

## Files Changed

- `packages/shared/types/src/contracts.ts`
- `packages/engines/game-engine/src/account-family.ts`
- `packages/engines/game-engine/src/account-family.js`
- `packages/engines/game-engine/src/legacy-account.ts`
- `packages/engines/game-engine/src/index.ts`
- `apps/rpg-ui/src/game-shell/accountProfileManager.ts`
- `tests/unit/account-family.test.mjs`
- `tests/unit/account-profile-storage.test.mjs`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Runtime Shape Summary

Added shared current-data types for:

- `AccountFamiliesState`
- `AccountFamilyRecord`
- `AccountFamilyStatus`
- `FamilyPrestigeTransactionState`
- `FamilyPrestigeTransactionKind`
- `FamilyPrestigeCategoryTag`
- `AccountFamilyPrestigeTotals`
- `AccountFamilyPrestigeCategoryTotals`

`AccountProfileState` now includes `families: AccountFamiliesState`.

## Family Linkage Summary

`AccountRunHistoryRecord` now supports optional current-data family linkage fields:

- `familyId?: string`
- `parentCharacterId?: string`

These fields are stored and normalized when present. No family tree UI, heir generation, or parent/child behavior was added.

## Family Prestige Ledger Summary

Added `packages/engines/game-engine/src/account-family.ts` with:

- default empty family/Bloodline state creation
- family status, prestige transaction kind, and category tag constants
- passive read-only prestige total helpers by family

The helpers derive earned, spent, available, and category totals from ledger transactions. They do not grant prestige, spend prestige, create families, create heirs, unlock backstories, or mutate input.

## Account Profile / Storage Validation Summary

Default account profile creation now includes an empty `families` container.

Account profile storage validation now understands:

- family records
- family prestige transactions
- required transaction-to-family references
- optional run history family linkage fields

Stored account profiles now require the current-data family state. No old-account or old-save rescue path was added.

## Test Coverage Summary

Added `tests/unit/account-family.test.mjs` for:

- empty default family state
- derived family prestige totals
- family isolation in totals
- input immutability

Updated `tests/unit/account-profile-storage.test.mjs` for:

- family state roundtrip
- run history `familyId` and `parentCharacterId` preservation
- current family state requirement
- rejection of orphan family prestige transactions

Existing focused account, Legacy, achievement, estate, and run-lifecycle tests still pass.

## Checks Run

- `git status --short`
  - Initially clean before edits.
- `node --test tests\unit\account-family.test.mjs tests\unit\account-profile-storage.test.mjs tests\unit\legacy-start-resources.test.mjs`
  - Passed: 22 tests.
- `node --test tests\unit\legacy-account.test.mjs tests\unit\account-estate.test.mjs tests\unit\achievements.test.mjs tests\unit\run-lifecycle.test.mjs`
  - Passed: 32 tests.
- `npm.cmd run tool:content-lint`
  - Passed: `content-lint: ok (53 files checked)`.
- `npm.cmd run typecheck`
  - Failed because root `tsc` is not installed on PATH: `'tsc' is not recognized as an internal or external command`.
- `.\apps\rpg-ui\node_modules\.bin\tsc.cmd --noEmit -p tsconfig.json`
  - Failed on broad pre-existing workspace TypeScript issues, starting with JSON import attributes in `apps/rpg-ui/src/features/characterPanelState.ts`, missing Node/process types in creator math/options files, JSX config for `GameSessionContext.tsx`, and existing strict optional issues in `apps/rpg-ui/src/runtime/uiViewModel.ts`.
  - No errors were reported for the new `account-family` module or changed family/profile shape after the narrow `legacy-account.ts` optional `unlockId` cleanup.
- `git diff --check`
  - Passed. Git reported line-ending normalization warnings only.

## Behavior / Runtime Confirmation

Runtime account/profile shape modules were added.
No creator behavior changed.
No Legacy purchase behavior changed.
No Backstory Eligibility resolver policy semantics changed.
No content JSON changed.
No live backstory records were added, removed, renamed, or modified.
No policy metadata JSON changed.
No starter skill, starting ability, attribute, combat, magic, economy, progression, launcher UI asset, generated UI output, or visible backstory availability behavior changed.
No family tree UI, heir generation, heir slot, heirloom, bequest, Chronicle Mark, Lineage Seal, automatic family prestige earning/spending, Backstory Legacy purchase, or family evidence integration was added.

## Risks / Follow-Up

- Family records are now typed and stored, but no runtime flow creates or manages family records yet.
- Family prestige is ledger-shaped and totalable, but no automatic grant/spend behavior exists.
- Chronicle Marks and Lineage Seals remain unimplemented.
- Heir slots, heir generation, heirlooms, bequests, and estate/title/status ownership remain deferred.
- Family-scoped backstory evidence remains blocked from the resolver until explicit evidence owners exist.
- Broad typecheck remains blocked by existing workspace TypeScript configuration and strictness issues outside this pass.

## Next Recommended Version

Version 0.5.62 - Chronicles Bloodline Tree Presentation Plan

## Suggested Commit Message

feat(legacy): add family prestige ledger shape
