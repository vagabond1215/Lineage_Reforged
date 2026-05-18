# Current Codex Output

Source version/run: Version 0.5.56 - Backstory Eligibility Resolver Implementation
Date: 2026-05-18
Branch/status assumption: Current local branch reality. `git status --short` was run before edits and showed a clean worktree.

## Result

Implemented the first narrow runtime-owned Backstory Eligibility Resolver foundation under the game-engine layer.

This pass added an approved source policy shape, a runtime-owned default policy for all 27 current live backstory ids, a pure resolver function, engine exports, and focused unit tests. The resolver is not wired into the character creator, so current user-facing backstory availability remains unchanged.

## Files Inspected

- `AGENTS.md`
- `README.md`
- `docs/design/backstory-eligibility-resolver-test-plan.md`
- `docs/design/backstory-runtime-policy-shape-draft.md`
- `docs/design/backstory-evidence-ownership-plan.md`
- `docs/design/backstory-eligibility-resolver-plan.md`
- `docs/design/backstory-tiered-lane-design.md`
- `docs/design/backstory-policy-metadata.json`
- `docs/design/backstory-policy-metadata.md`
- `docs/design/legacy-upgrade-catalog-draft.json`
- `docs/future_content_backlog.md`
- `packages/content/base/player/backstories.json`
- `packages/content/base/player/skills.json`
- `packages/content/base/player/achievements.json`
- `packages/content/base/player/legacy_unlocks.json`
- `packages/shared/types/src/contracts.ts`
- `packages/engines/game-engine/src/index.ts`
- `packages/engines/game-engine/src/legacy-unlocks.ts`
- `packages/engines/game-engine/src/account-achievement-state.ts`
- `packages/engines/game-engine/src/achievements.ts`
- `apps/rpg-ui/src/game-shell/accountProfileManager.ts`
- `apps/rpg-ui/src/game-shell/accountMetaPresentation.ts`
- `apps/rpg-ui/src/game-shell/achievementChroniclesPresentation.ts`
- `apps/rpg-ui/src/game-shell/runLifecycle.ts`
- `apps/rpg-ui/src/game-shell/newGameSnapshot.ts`
- `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts`
- `apps/rpg-ui/src/game-shell/characterCreationForm.ts`
- `tests/unit/backstory-policy-metadata.test.mjs`
- `tests/unit/player-identity-content.test.mjs`
- `docs/dev/current-codex-output.md`

## Files Changed

- `packages/engines/game-engine/src/backstory-eligibility-policy.ts`
- `packages/engines/game-engine/src/backstory-eligibility-policy.js`
- `packages/engines/game-engine/src/backstory-eligibility.ts`
- `packages/engines/game-engine/src/backstory-eligibility.js`
- `packages/engines/game-engine/src/index.ts`
- `tests/unit/backstory-eligibility-policy.test.mjs`
- `tests/unit/backstory-eligibility-resolver.test.mjs`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Runtime Policy Implementation Summary

Added `BACKSTORY_ELIGIBILITY_POLICY` as runtime-owned source policy data, not design JSON.

The policy includes:

- `status: "runtime_owned_policy"`
- `runtimeImportAllowed: true`
- the seven approved availability statuses only: `always_available`, `default_available`, `early_legacy`, `locked`, `hidden`, `special`, `deferred`
- baseline default ids: `backstory.local`, `backstory.vagabond`, `backstory.exile`, `backstory.farmhand`, `backstory.amnesiac`
- one rule for each current live backstory id
- a central blocked-evidence list for unsupported family, status, estate/title, regional renown, institution, contact, adoption, marriage, mount, market/economy, magic, medical, and oath/paladin owners
- selected-backstory effect policy requiring only the selected backstory to apply effects

## Resolver Implementation Summary

Added `resolveBackstoryEligibility` as a pure function that accepts live backstory ids, an optional runtime policy, and current-data evidence input.

The resolver returns:

- eligible/selectable ids
- locked records with safe reasons
- hidden ids
- deferred ids
- special ids
- filtered default ids
- per-record policy projection
- current-data validation warnings

The resolver does not read files, mutate input, reach into UI state, purchase Legacy unlocks, write account/save state, or change creator behavior.

## Test Coverage Summary

Added focused tests covering:

- all 27 current live backstory ids have one runtime eligibility rule
- default ids are live and non-empty
- duplicate rules are rejected
- missing live id references are rejected
- future examples are not treated as live policy
- blocked evidence cannot unlock content
- starter-granted ranks are excluded from earned skill evidence
- Tier 2 origins require Legacy support plus scoped evidence
- family-scoped rules do not fall back to account-wide evidence
- unknown selected ids produce direct current-data validation warnings
- resolver input is not mutated

## Non-Import Boundary Summary

Static source tests assert the new resolver and policy modules do not import or consume:

- `docs/design/backstory-policy-metadata.json`
- `docs/design/legacy-upgrade-catalog-draft.json`
- `futureBackstoryLaneDrafts`
- design documents under `docs/design/`

Creator boundary tests also assert `characterCreationCatalog.ts`, `characterCreationForm.ts`, and `newGameSnapshot.ts` are not wired to the resolver yet.

## Default / Current-Data Behavior Summary

Missing optional evidence still returns default-safe current behavior. The baseline default set remains live and non-empty, and default fallback does not unlock Tier 2, Tier 3, special, hidden, or deferred origins.

Current content ids validate directly. Unknown selected ids are reported as current-data warnings, not rescued through aliases, old ids, or compatibility paths.

## Evidence / Scope / Blocked Behavior Summary

The resolver evaluates:

- `requiresAll`
- `requiresAny`
- `requiresEvidence`
- `requiresLegacyPurchase`
- `requiresPrestige`
- `requiresEcho`
- `blocksIf`

Nested groups are not implemented in this foundation and remain unnecessary for the current tests.

Scope checks prove family, source-run, account, region, institution, and estate/title evidence do not silently substitute for each other. Missing family, lineage, or source-run ownership does not grant scoped access.

## Starter-Granted Exclusion Summary

Earned skill evidence requires approved provenance such as `earned_play` or `source_run`. Starter-granted ranks from `starter_backstory` or `starter_bundle` do not satisfy earned skill maxima by default.

The focused Militia Levy/Garrison Ward fixture proves starter formation discipline does not unlock the Tier 2 garrison origin by itself.

## No-Stacking Summary

Each policy rule carries selected-effect policy:

- `appliesOnlySelectedBackstory: true`
- `parentEffectsStack: false`
- `previousBackstoriesAreEvidenceOnly: true`

Resolver tests prove access evidence does not imply stacked parent/child effects.

## No-Compatibility Behavior Summary

The policy vocabulary does not include `retired`, `converted`, aliases, old-id rescue states, or migration-only states.

Tests enforce:

- no alias-based id rescue
- no retired/converted status handling
- no historical id preservation logic
- direct current content id validation
- missing old data does not grant access

## Creator Integration Boundary Confirmation

No resolver wiring was added to the creator.

Current UI behavior remains unchanged: `characterCreationCatalog.ts` still builds from live backstory content, `characterCreationForm.ts` still validates known ids and settlement-start access, and `newGameSnapshot.ts` still applies the selected live backstory only.

Locked-backstory creator presentation remains deferred to Version 0.5.57.

## Checks Run

- `git status --short` - showed only the files changed in this pass:
  - `docs/dev/current-codex-output.md`
  - `docs/future_content_backlog.md`
  - `packages/engines/game-engine/src/index.ts`
  - `packages/engines/game-engine/src/backstory-eligibility-policy.js`
  - `packages/engines/game-engine/src/backstory-eligibility-policy.ts`
  - `packages/engines/game-engine/src/backstory-eligibility.js`
  - `packages/engines/game-engine/src/backstory-eligibility.ts`
  - `tests/unit/backstory-eligibility-policy.test.mjs`
  - `tests/unit/backstory-eligibility-resolver.test.mjs`
- Passed: `npm.cmd run tool:content-lint` - `content-lint: ok (53 files checked)`
- Passed: `node --test tests\unit\backstory-eligibility*.test.mjs` - 21 tests passed
- Passed: `node --test tests\unit\backstory-policy-metadata.test.mjs tests\unit\player-identity-content.test.mjs` - 11 tests passed
- Failed: `npm.cmd run typecheck` - root `tsc` is not available on PATH in this workspace command
- Failed, unrelated existing issues: `.\\apps\\rpg-ui\\node_modules\\.bin\\tsc.cmd --noEmit -p tsconfig.json` reports broad pre-existing TypeScript issues; filtering the output for `backstory-eligibility` returned no matches
- Passed: `git diff --check` - passed with line-ending normalization warnings only

## Behavior / Runtime Confirmation

Runtime resolver/policy modules were added.
No creator behavior changed.
No content JSON changed.
No live backstory records were added, removed, renamed, or modified.
No policy metadata JSON changed.
No starter skill, Legacy purchase, save/account schema, combat, magic, economy, progression, launcher UI, generated UI output, or visible availability behavior changed.
The resolver is not wired into creator filtering yet.

## Risks / Follow-Up

- Creator locked-backstory presentation remains deferred.
- Backstory Legacy purchase integration remains deferred.
- Family/source-run evidence ledgers, earned skill maxima storage, institution/status/estate/title ownership, magic licensing, mounts, contacts, market/economy effects, medical systems, and oath/paladin behavior remain deferred or blocked evidence owners.
- Root typecheck remains blocked by workspace tooling/pre-existing TypeScript issues outside this pass.

## Next Recommended Version

Version 0.5.57 - Creator Locked Backstory Presentation Plan

## Suggested Commit Message

feat(engine): add backstory eligibility resolver foundation
