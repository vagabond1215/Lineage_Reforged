# Current Codex Output

Source version/run: Version 0.5.66 - Backstory Legacy Live Catalog Guard
Date: 2026-05-20
Branch/status assumption: `master`; `git status --short` was clean before edits.

## Result
Added the narrow live-catalog guard needed before Backstory Legacy content migration. Backstory-tagged Legacy definitions are now treated as non-live unless `implementationPriority: "live"` is explicit, and non-live Backstory Legacy definitions are blocked from account-meta purchase presentation, direct purchase execution, and Backstory Legacy purchase evidence collection.

No Backstory Legacy draft records were migrated into the live Legacy catalog.

## Files Inspected
- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/design/future-system-design-ledger.md`
- `docs/design/backstory-legacy-purchase-content-draft.json`
- `docs/design/backstory-legacy-purchase-integration-plan.md`
- `docs/design/backstory-evidence-ownership-plan.md`
- `docs/design/legacy-scope-bloodline-economy-plan.md`
- `docs/dev/prompt-template-hardening-pass.md`
- `packages/content/base/player/legacy_unlocks.json`
- `packages/content/base/player/backstories.json`
- `packages/engines/game-engine/src/legacy-unlocks.ts`
- `packages/engines/game-engine/src/backstory-legacy-purchases.ts`
- `packages/engines/game-engine/src/backstory-eligibility.ts`
- `packages/engines/game-engine/src/backstory-eligibility-policy.ts`
- `apps/rpg-ui/src/game-shell/accountMetaPresentation.ts`
- `apps/rpg-ui/src/game-shell/components/AccountMetaPanel.tsx`
- `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts`
- `tests/unit/backstory-legacy-purchase-content-draft.test.mjs`
- `tests/unit/backstory-legacy-purchases.test.mjs`
- `tests/unit/backstory-creator-availability.test.mjs`
- `tests/unit/backstory-eligibility-policy.test.mjs`
- `tests/unit/backstory-eligibility-resolver.test.mjs`
- `tests/unit/legacy-start-resources.test.mjs`

## Files Changed
- `packages/engines/game-engine/src/legacy-unlocks.ts`
- `packages/engines/game-engine/src/backstory-legacy-purchases.ts`
- `packages/engines/game-engine/src/index.ts`
- `apps/rpg-ui/src/game-shell/accountMetaPresentation.ts`
- `tests/unit/backstory-legacy-purchases.test.mjs`
- `tests/unit/backstory-legacy-catalog-guard.test.mjs`
- `docs/dev/current-codex-output.md`

## Guard Design
- Backstory Legacy definitions are identified by `backstory`, `backstory_legacy`, or `origin` tags.
- Non-live Backstory Legacy definitions are any Backstory Legacy definitions whose `implementationPriority` is not exactly `"live"`. This intentionally includes `catalog_only`, `backlog`, and missing priority.
- Account-meta visibility is blocked by filtering non-live Backstory Legacy definitions out of the account-meta Legacy view model, so they do not appear as ordinary account-meta purchase entries or buttons.
- Purchase execution is blocked by `purchaseLegacyUnlock(...)`, which now returns `non_live_backstory_unlock` for non-live Backstory Legacy definitions.
- Resolver evidence collection is blocked by `resolveOwnedBackstoryLegacyPurchaseIds(...)`, which skips non-live Backstory Legacy definitions and reports them as unsupported/warned if account or family state somehow contains the id.
- Existing non-backstory Legacy definitions are not blocked by this guard, even if their implementation priority is `catalog_only` or `backlog`.
- Test-only injected definition seams were added to `resolveLegacyUnlockStates(...)`, `purchaseLegacyUnlock(...)`, and `buildAccountMetaViewModel(...)` so fixture definitions can prove the guard without adding live content records.

## Behavior / Runtime Confirmation
- No live Backstory Legacy records were added.
- `packages/content/base/player/legacy_unlocks.json` did not change.
- Account meta behavior for existing live records should remain unchanged.
- `purchaseLegacyUnlock(...)` behavior for existing live records should remain unchanged.
- Future/non-live Backstory Legacy definitions are now intentionally hidden from account-meta purchase presentation and blocked from purchase.
- Backstory Eligibility resolver behavior did not change.
- Creator availability did not change.
- No `legacyPurchaseIds` are passed into creator/resolver evidence by this pass.
- No starter skills, starting abilities, attributes, content JSON, schemas, family creation, Family Prestige spending, heir slots, heirlooms, bequests, Chronicle Marks, Lineage Seals, magic runtime, combat math, economy simulation, or generated UI output changed.
- Deferred systems were not touched.

## Tests / Checks Run
- `git status --short` - clean before edits
- `npm.cmd run tool:content-lint` - passed (`content-lint: ok`, 53 files checked)
- `node --test tests\unit\backstory-legacy-catalog-guard.test.mjs` - passed (6 tests)
- `node --test tests\unit\backstory-legacy-purchases.test.mjs` - passed (10 tests)
- `node --test tests\unit\backstory-legacy-purchase-content-draft.test.mjs` - passed (8 tests)
- `node --test tests\unit\backstory-creator-availability.test.mjs` - passed (7 tests)
- `node --test tests\unit\backstory-eligibility*.test.mjs` - passed (21 tests)
- `node --test tests\unit\legacy-start-resources.test.mjs` - passed (8 tests)
- `node --test tests\unit\legacy-unlocks.test.mjs` - passed (21 tests)
- `node --test tests\unit\legacy-ledger-presentation.test.mjs` - passed (13 tests)
- `git diff --check` - passed with Git line-ending normalization warnings only

Broad typecheck was not run. Prior handoffs note known broad workspace typecheck blockers, and this pass stayed focused on the guard plus targeted tests.

## Risks / Follow-Up
- Future live Backstory Legacy records must declare `implementationPriority: "live"` before they can be visible/purchasable.
- Non-live Backstory Legacy definitions remain resolvable as non-purchasable state to engine callers, but account-meta presentation filters them out.
- Resolver integration should still wait until live Backstory Legacy records exist and ownership/exposure is settled.
- `docs/dev/project-roadmap.md` remains stale for the immediate sequence; current Codex output and GPT handoff remain the near-term authority.

## Temporary Guardrail Cleanup Decision
- Keep `docs/design/backstory-legacy-purchase-content-draft.json` until the five draft candidates are migrated into approved runtime content or rejected.
- Keep `docs/design/backstory-legacy-purchase-integration-plan.md` through live content migration and resolver integration.
- Keep `docs/design/backstory-evidence-ownership-plan.md` through resolver evidence integration.
- Keep `docs/design/legacy-scope-bloodline-economy-plan.md` for family-scoped purchase, Bloodlines, bequest, and heirloom boundaries.
- Keep `docs/dev/prompt-template-hardening-pass.md` while future prompts still need its guardrail scaffolding.
- No temporary guardrail docs were deleted in this implementation pass.

## Next Recommended Version
Version 0.5.67 - Backstory Legacy Live Content Migration

Migrate the approved low-risk Backstory Legacy candidates into the live Legacy catalog with explicit live priority, guarded visibility/purchase behavior, and focused tests.

## Suggested Commit Message
feat(legacy): guard backstory catalog-only purchases
