# Current Codex Output

Source version/run: Version 0.5.63 - Backstory Legacy Purchase Runtime Shape
Date: 2026-05-19
Branch/status assumption: Local branch was clean before edits. Requested `git pull --ff-only` was attempted but failed because local Git could not verify the remote SSL certificate (`unable to get local issuer certificate`), so this pass used current local branch reality.

## Result
Added the first runtime-owned family-scoped unlock ownership shape and a read-only Backstory Legacy purchase evidence collection helper. The new storage is current-data only, defaults empty, validates against current family records and family prestige transactions, and is not wired into Backstory Eligibility or the creator.

## Files Inspected
- `AGENTS.md` from prompt context
- `README.md`
- `docs/future_content_backlog.md`
- `docs/design/backstory-legacy-purchase-integration-plan.md`
- `docs/design/legacy-scope-bloodline-economy-plan.md`
- `docs/design/chronicles-bloodline-tree-presentation-plan.md`
- `docs/design/backstory-evidence-ownership-plan.md`
- `packages/shared/types/src/contracts.ts`
- `packages/engines/game-engine/src/account-family.ts`
- `packages/engines/game-engine/src/account-family.js`
- `packages/engines/game-engine/src/legacy-account.ts`
- `packages/engines/game-engine/src/legacy-unlocks.ts`
- `packages/engines/game-engine/src/backstory-eligibility-policy.ts`
- `packages/engines/game-engine/src/backstory-eligibility.ts`
- `packages/engines/game-engine/src/index.ts`
- `apps/rpg-ui/src/game-shell/accountProfileManager.ts`
- `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts`
- `apps/rpg-ui/src/game-shell/characterCreationForm.ts`
- `tests/unit/account-family.test.mjs`
- `tests/unit/account-profile-storage.test.mjs`
- Existing backstory eligibility, creator availability, and legacy start-resource tests

## Files Changed
- `packages/shared/types/src/contracts.ts`
- `packages/engines/game-engine/src/account-family.ts`
- `packages/engines/game-engine/src/backstory-legacy-purchases.ts`
- `packages/engines/game-engine/src/backstory-legacy-purchases.js`
- `packages/engines/game-engine/src/index.ts`
- `apps/rpg-ui/src/game-shell/accountProfileManager.ts`
- `tests/unit/account-family.test.mjs`
- `tests/unit/account-profile-storage.test.mjs`
- `tests/unit/backstory-legacy-purchases.test.mjs`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Family Unlock Ownership Shape
- Added `AccountFamilyUnlockState` with `unlockId`, `familyId`, `unlockedAt`, `sourceTransactionId`, and optional positive integer `rank`.
- Added `familyUnlocks` to `AccountFamiliesState`.
- This is ownership state only. It does not grant effects, spend Family Prestige, create families, create heirs, stack backstory effects, or alter creator availability.

## Default Family State
`createDefaultAccountFamiliesState()` now returns:

```ts
{
  families: [],
  prestigeTransactions: [],
  familyUnlocks: []
}
```

Default account profile creation inherits that empty family unlock ownership container.

## Account Profile Validation
Account profile storage validation now requires `familyUnlocks` in the current family state. Each family unlock must:

- have non-empty string `unlockId`, `familyId`, `unlockedAt`, and `sourceTransactionId`
- have a positive integer `rank` when rank is present
- reference an existing family id
- avoid duplicate `unlockId` values within the same family
- reference an existing family prestige transaction for the same family

The source transaction rule is intentionally strict for this first current-data shape: family-scoped unlock ownership must point at a family prestige transaction owned by the same family.

## Family Unlock Helpers
Added pure read-only helpers:

- `hasFamilyUnlock(state, familyId, unlockId)`
- `listFamilyUnlockIds(state, familyId)`
- `listFamilyUnlocks(state, familyId)`
- `resolveFamilyUnlocksByFamily(state)`

The helpers do not mutate input and do not infer unlock ownership from prestige transactions alone.

## Backstory Legacy Purchase Evidence Helper
Added `resolveOwnedBackstoryLegacyPurchaseIds()` in `packages/engines/game-engine/src/backstory-legacy-purchases.ts`.

The helper:

- accepts a profile, runtime Legacy unlock definitions, and optional family/region context
- only considers definitions tagged `backstory`, `backstory_legacy`, or `origin`
- resolves account-scoped backstory purchases from `profile.legacy.legacyUnlocks`
- resolves family-scoped backstory purchases from `profile.families.familyUnlocks` only for the matching `familyId`
- treats region, heir-only, next-run, character-start, catalog-only, and other unsupported scopes conservatively
- returns warnings and `unsupportedScopeUnlockIds` instead of silently unlocking unsupported scopes
- does not read files, import content JSON, import design docs, create purchases, spend currency, call the resolver, or alter creator behavior

## Resolver / Creator Boundary
No resolver or creator wiring was added.

- `backstory-eligibility.ts` still receives purchase ids only when a caller explicitly supplies them.
- `backstory-eligibility-policy.ts` semantics were not changed.
- `characterCreationCatalog.ts`, `characterCreationForm.ts`, and `CharacterCreationNarrativeScreen.tsx` do not import or call the new helper.
- The creator continues to use its existing resolver-backed projection path without family purchase evidence.

## Content Boundary
No Backstory Legacy purchase content records were added.

Unchanged:

- `packages/content/base/player/legacy_unlocks.json`
- `docs/design/legacy-upgrade-catalog-draft.json`
- `docs/design/backstory-policy-metadata.json`
- backstory content JSON

## Test Coverage
Added/updated coverage for:

- default family state includes empty `familyUnlocks`
- family unlock helpers isolate ownership by family
- prestige transactions alone do not imply family unlock ownership
- account profile storage accepts valid family unlock state
- orphan family unlock family ids are rejected
- duplicate unlock ids within one family are rejected
- invalid ranks are rejected
- missing or wrong-family source transactions are rejected
- account-owned backstory-tagged definitions resolve as purchase ids
- family-owned backstory-tagged definitions resolve only for matching family id
- family-owned definitions are excluded without a family id
- non-backstory Legacy unlocks are excluded
- unsupported scopes return conservative warnings/lists
- helper does not mutate input
- no resolver/creator wiring was added
- no design metadata or draft catalogs are imported
- no compatibility rescue states were introduced

## Deferred Behavior
Still deferred:

- Backstory Legacy purchase content records
- Backstory Eligibility resolver purchase integration
- creator purchase integration
- Legacy purchase UI
- region, institution, estate/title, heir-only, next-run, and preparation-scoped purchase storage
- family prestige earning/spending behavior
- automatic family creation
- family tree UI
- heir generation and heir slots
- heirloom and bequest systems
- Chronicle Marks
- Lineage Seals

## Checks Run
- `git pull --ff-only` - failed before edits due local Git SSL certificate verification (`unable to get local issuer certificate`)
- `git status --short` - clean before edits
- `npm.cmd run tool:content-lint` - passed
- `node --test tests\unit\account-family.test.mjs tests\unit\account-profile-storage.test.mjs` - passed
- `node --test tests\unit\backstory-legacy-purchases.test.mjs` - passed
- `node --test tests\unit\backstory-eligibility*.test.mjs` - passed
- `node --test tests\unit\backstory-creator*.test.mjs` - passed
- `node --test tests\unit\legacy-start-resources.test.mjs` - passed
- `npm.cmd run typecheck` - failed because root `tsc` is not available in PATH
- `.\apps\rpg-ui\node_modules\.bin\tsc.cmd --noEmit -p tsconfig.json` - failed on broad pre-existing workspace issues; first errors were JSON import attributes in `apps/rpg-ui/src/features/characterPanelState.ts`, missing `process` types, JSX config, and many existing exact-optional-property/type issues. No errors were reported for the changed files.
- `git diff --check` - passed with line-ending normalization warnings only

## Behavior / Runtime Confirmation
Family-scoped unlock ownership shape was added.
Default family state now includes empty family unlock ownership.
No Backstory Legacy purchase content records were added.
No Backstory Eligibility resolver wiring changed.
No creator behavior changed.
No visible backstory availability changed.
No Legacy purchase UI was added.
No family prestige earning/spending behavior was added.
No automatic family creation was added.
No family tree UI was added.
No heir slots were added.
No heirloom or bequest behavior was added.
No Chronicle Marks or Lineage Seals were implemented.
No content JSON changed.
No policy metadata JSON changed.
No generated UI output changed.

## Risks / Follow-Up
- The local pull could not complete because of Git SSL certificate verification, so the run used the current local branch.
- The new family unlock storage is intentionally inert until Backstory Legacy purchase content and resolver integration are approved.
- The helper uses tag-based candidate filtering; future purchase content must tag backstory purchase definitions deliberately.
- Region/institution/estate/title scoped ownership remains unsupported and must not be passed to the resolver as valid evidence until storage owners exist.
- Workspace typecheck still needs separate cleanup; focused tests for this pass are passing.

## Next Recommended Version
Version 0.5.64 - Backstory Legacy Purchase Content Draft

## Suggested Commit Message
feat(legacy): add backstory purchase ownership shape
