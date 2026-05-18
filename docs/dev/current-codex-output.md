# Current Codex Output

Source version/run: Version 0.5.58 - Creator Backstory Resolver Integration
Date: 2026-05-18
Branch/status assumption: Current local branch reality. `git status --short` was run before edits and showed a clean worktree.

## Result

Wired the character creator to the runtime-owned Backstory Eligibility Resolver projection for backstory availability.

The creator now derives backstory presentation from live catalog templates plus resolver output. Visible availability intentionally changed through the resolver-backed projection: eligible/default records remain selectable, visible locked records are disabled with conservative copy, hidden/deferred records are omitted from the normal creator list, and special records are displayed conservatively as non-selectable unless the resolver later marks them eligible.

## Files Inspected

- `AGENTS.md`
- `README.md`
- `docs/design/backstory-creator-presentation-plan.md`
- `docs/design/backstory-eligibility-resolver-test-plan.md`
- `docs/future_content_backlog.md`
- `packages/engines/game-engine/src/backstory-eligibility-policy.ts`
- `packages/engines/game-engine/src/backstory-eligibility.ts`
- `packages/engines/game-engine/src/index.ts`
- `packages/content/base/player/backstories.json`
- `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts`
- `apps/rpg-ui/src/game-shell/characterCreationForm.ts`
- `apps/rpg-ui/src/game-shell/newGameSnapshot.ts`
- `apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx`
- `tests/unit/backstory-eligibility-policy.test.mjs`
- `tests/unit/backstory-eligibility-resolver.test.mjs`
- `tests/unit/player-identity-content.test.mjs`
- `tests/unit/legacy-start-resources.test.mjs`
- `tests/unit/account-profile-storage.test.mjs`
- `docs/dev/current-codex-output.md`

## Files Changed

- `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts`
- `apps/rpg-ui/src/game-shell/characterCreationForm.ts`
- `apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx`
- `tests/unit/backstory-creator-availability.test.mjs`
- `tests/unit/backstory-eligibility-policy.test.mjs`
- `tests/unit/legacy-start-resources.test.mjs`
- `tests/unit/account-profile-storage.test.mjs`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Creator Resolver Integration Summary

`characterCreationCatalog.ts` now imports the approved runtime resolver through the game-engine export path and builds a creator-facing projection from:

- live backstory catalog templates
- resolver state/selectability/visibility
- resolver reasons
- resolver default ids

The helper passes only safe current creator input: selected backstory id, account id when available, and source-run ids when already present. It does not invent evidence or pass blocked owner stubs.

## Presentation View-Model Summary

The new `StarterBackstoryPresentation` view model extends the existing live backstory template with:

- `availabilityStatus`
- `availabilityState`
- `selectable`
- `visible`
- `availabilityBadge`
- `lockedReason`
- `unlockHint`
- `isDefault`
- `isSpecial`
- `isDeferred`
- `sortGroup`
- `resolverReasons`

It remains a creator projection, not a new content source.

## Availability Behavior Summary

`getBackstoryOptionsForSelection` now returns resolver-visible presentation entries instead of every live backstory template.

Current no-evidence behavior:

- default and always-available origins remain visible/selectable
- locked origins remain visible but disabled
- deferred and hidden origins are omitted from normal creator options
- special origins are shown conservatively as disabled special entries

Sorting groups selectable defaults first, other selectable records next, visible locked records after that, and special records last, while preserving live catalog order inside each group.

## Selection Behavior Summary

`validateCharacterCreationForm` now rejects known backstory ids that are not resolver-selectable with `Choose an available backstory.`

The narrative creator backstory cards disable non-selectable records and guard the click handler so locked/special records cannot be selected through the UI. Hidden and deferred records are absent from the normal list.

Settlement-start authorization remains a separate validation layer after backstory availability.

## Snapshot Boundary Confirmation

`newGameSnapshot.ts` was not changed.

Snapshot creation still applies exactly one selected live backstory package: selected id, starter skills, attribute math, allowlisted starting abilities, flags, and Chronicle text. Parent/child backstory effects still do not stack.

## Evidence Input Boundary Summary

The creator integration passes only:

- current selected backstory id
- account id when available in the component props
- current source-run id when already selected

It does not pass invented evidence, fake Legacy purchases, dummy family evidence, starter-granted skills as earned maxima, or blocked owner stubs.

## Safe Locked Copy Summary

Visible unavailable records use conservative copy:

- `Requires matching evidence that is not currently available.`
- `Requires matching previous-play evidence that is not currently available.`
- `Not available in the current creator.`

The UI copy avoids raw policy ids, raw evidence ids, Backstory Legacy purchase promises, title/estate promises, institution/contact/mount/magic/medical/oath promises, and blocked-system promises.

## Test Coverage Summary

Added `tests/unit/backstory-creator-availability.test.mjs` covering:

- creator presentation uses resolver projection
- defaults remain visible/selectable without evidence
- locked records are visible but not selectable
- deferred records are omitted
- special records are not ordinary selectable origins
- selected ids cannot bypass resolver output
- settlement-start validation remains separate
- snapshot creation still applies only the selected backstory package
- visible locked copy avoids blocked-system promises/raw ids
- creator code does not import design metadata or compatibility rescue logic

Updated existing resolver boundary tests to expect approved creator resolver usage while still blocking design metadata imports.

Updated existing creator-adjacent test fixtures that used `Local Champion` as a generic valid creator selection. `Local Champion` is now special/non-selectable through resolver-backed creator availability, so those tests use `Local` or filter to selectable options.

## Non-Import / No-Compatibility Summary

Creator code imports the runtime resolver from the engine export path. It does not import:

- `docs/design/backstory-policy-metadata.json`
- `docs/design/legacy-upgrade-catalog-draft.json`
- `futureBackstoryLaneDrafts`
- design documents under `docs/design/`

No id aliases, retired/converted status handling, old-save rescue, old-account rescue, historical id preservation, or migration-only selection behavior was added.

## Validation Checks Run

- `git status --short`
  - Showed only expected source, test, backlog, and output changes.
- `npm.cmd run tool:content-lint`
  - Passed: `content-lint: ok (53 files checked)`
- `node --test tests\unit\backstory-eligibility*.test.mjs`
  - Passed: 21 tests passed.
- `node --test tests\unit\backstory-creator*.test.mjs`
  - Passed: 7 tests passed.
- `node --test tests\unit\player-identity-content.test.mjs`
  - Passed: 6 tests passed.
- `node --test tests\unit\legacy-start-resources.test.mjs tests\unit\account-profile-storage.test.mjs`
  - Passed: 17 tests passed. These were run because their creator-adjacent fixtures used `Local Champion` as a generic valid creator selection before resolver-backed availability made it special/non-selectable.
- `npm.cmd run typecheck`
  - Failed: root `tsc` is not available on PATH: `'tsc' is not recognized as an internal or external command`.
- `.\apps\rpg-ui\node_modules\.bin\tsc.cmd --noEmit -p tsconfig.json`
  - Failed with broad pre-existing workspace TypeScript issues. The first errors are in `apps/rpg-ui/src/features/characterPanelState.ts`, `apps/rpg-ui/src/game-shell/characterCreationIdentityOptions.ts`, `apps/rpg-ui/src/game-shell/characterCreationMath.ts`, and `apps/rpg-ui/src/runtime/developmentSession.ts`.
- `.\apps\rpg-ui\node_modules\.bin\tsc.cmd --noEmit -p tsconfig.json 2>&1 | Select-String -Pattern "characterCreationCatalog|characterCreationForm|CharacterCreationNarrativeScreen|backstory-creator|backstory-eligibility-policy|backstory-eligibility-resolver|account-profile-storage|legacy-start-resources"`
  - No output for changed files.
- `git diff --check`
  - Passed. Git reported line-ending normalization warnings only.

## Behavior / Runtime Confirmation

Creator now consumes resolver projection.
Visible creator availability changed only through resolver-backed availability projection.
No content JSON changed.
No live backstory records were added, removed, renamed, or modified.
No policy metadata JSON changed.
No starter skill, Legacy purchase, save/account schema, combat, magic, economy, progression, launcher UI asset, generated UI output, or snapshot starter-effect behavior changed.
Settlement-start authorization remains separate.
Backstory Legacy purchase integration remains deferred.

## Risks / Follow-Up

- Backstory Legacy purchase integration remains deferred.
- Family/source-run evidence ledgers remain deferred.
- Earned skill maxima storage remains deferred.
- Blocked evidence owners remain deferred.
- Locked UI polish is intentionally minimal in this pass.
- Root `npm.cmd run typecheck` currently cannot find `tsc` on PATH; the app-local TypeScript check still reports broad pre-existing workspace issues outside the changed creator/backstory files.

## Next Recommended Version

Version 0.5.59 - Backstory Legacy Purchase Integration Plan

## Suggested Commit Message

feat(ui): use resolver for creator backstory availability
