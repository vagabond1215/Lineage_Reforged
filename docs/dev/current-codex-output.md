# Current Codex Output

Source version/run: Version 0.5.55 - Backstory Eligibility Resolver Test Plan
Date: 2026-05-18
Branch/status assumption: Current local branch reality. `git status --short` was run before edits and showed a clean worktree.

## Result

Added a planning-only Backstory Eligibility Resolver Test Plan. The plan defines the future resolver test layers, non-import boundaries, live catalog coverage expectations, default safety checks, evidence and scope tests, blocked evidence behavior, starter-granted skill exclusion, no-stacking coverage, representative fixtures, creator-boundary tests for later, and no-compatibility assertions.

No resolver, runtime policy, schema, test file, content JSON, metadata JSON, runtime behavior, creator filtering, or UI behavior was added.

## Files Inspected

- `AGENTS.md`
- `README.md`
- `docs/design/backstory-eligibility-resolver-plan.md`
- `docs/design/backstory-evidence-ownership-plan.md`
- `docs/design/backstory-runtime-policy-shape-draft.md`
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

- `docs/design/backstory-eligibility-resolver-test-plan.md`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Test Strategy Summary

The new plan requires future resolver work to include:

- static policy/content validation tests
- pure resolver unit tests
- evidence evaluation tests
- scope isolation tests
- default/new-account safety tests
- no-stacking tests
- non-import boundary tests
- blocked/special/deferred behavior tests
- later creator integration boundary tests

The plan keeps the implementation sequence clear: test plan first, resolver implementation with tests next, creator locked-backstory presentation later, and Backstory Legacy purchase integration after that.

## Non-Import Boundary Test Summary

Future tests should fail if resolver/runtime code imports or consumes:

- `docs/design/backstory-policy-metadata.json`
- `docs/design/legacy-upgrade-catalog-draft.json`
- `futureBackstoryLaneDrafts[]`
- design documents under `docs/design/`

The future runtime policy must be a separate approved shape, and design-only metadata must not affect creator availability.

## Current Live Catalog / Default Safety Test Summary

Current branch reality inspected:

- 27 live backstory records
- 27 non-runtime policy metadata records
- 25 future lane drafts
- 121 skill records
- 15 achievement records
- 44 live Legacy unlock records
- current default-policy ids: `backstory.local`, `backstory.vagabond`, `backstory.exile`, `backstory.farmhand`, `backstory.amnesiac`

The plan requires tests proving every current live backstory id has a resolver rule or explicit current-data fallback, every default id is live, duplicate rules are rejected, future examples are not treated as live policy, and default safety never unlocks Tier 2, Tier 3, special, or deferred origins.

## Evidence / Scope / Blocked Behavior Test Summary

The plan defines tests for `requiresAll`, `requiresAny`, `requiresEvidence`, `requiresLegacyPurchase`, `requiresPrestige`, `requiresEcho`, and `blocksIf`.

It requires blocked evidence to resolve as hidden, deferred, or unmet. Blocked categories include family skill maxima, family backstory history, heir/status evidence, estate/title ownership, regional renown storage, institutional membership, patronage/contact systems, adoption, marriage, mounted behavior, market/economy effects, magic licensing/acquisition, medical/injury systems, and oath/paladin behavior.

Scope isolation tests must prove family, lineage, source-run, region, faction, institution, estate/title, and special/manual evidence do not fall back to account-wide evidence unless explicitly approved.

## Starter-Granted Exclusion Summary

The plan requires future tests proving starter-granted skill ranks do not count as earned skill maxima by default. Militia Levy starter formation discipline must not automatically unlock Garrison Ward or future Sword Drill without earned/source-run evidence or another approved evidence owner.

## No-Stacking Summary

The plan requires tests proving exactly one selected backstory applies effects. Parent backstories can unlock access only when separately recorded as evidence; parent starter skills, attribute adjustments, and starting abilities must not stack with a selected child origin.

## No-Compatibility Test Summary

The plan explicitly requires negative tests for:

- no alias-based id rescue
- no retired or converted id status handling
- no old-save preservation path
- no old-account migration path
- no migration-only selection logic
- no historical id preservation logic
- no old selected backstory preservation path
- direct current content id validation
- missing old data does not grant access

These are guardrail tests only; they do not add compatibility behavior.

## Future Test File Candidates

Recommended future files, not created in this pass:

- `tests/unit/backstory-eligibility-policy.test.mjs`
- `tests/unit/backstory-eligibility-resolver.test.mjs`
- `tests/unit/backstory-eligibility-evidence.test.mjs`
- `tests/unit/backstory-eligibility-scope.test.mjs`
- `tests/unit/backstory-eligibility-creator-boundary.test.mjs`

## Implementation Readiness Checklist

Before Version 0.5.56 implementation begins, the following must be decision-complete:

- runtime policy shape chosen
- test fixture shape chosen
- default set finalized
- blocked evidence list finalized
- availability statuses finalized
- no-compatibility behavior finalized
- non-import boundary tests planned
- current live catalog coverage tests planned
- default/new-account safety tests planned
- evidence requirement tests planned
- blocked evidence tests planned
- no-stacking tests planned
- starter-granted exclusion tests planned
- family/account/scope tests planned
- representative rule fixture tests planned
- creator integration boundary intentionally deferred or explicitly scoped

## Recommended Next Pipeline

1. Version 0.5.56 - Backstory Eligibility Resolver Implementation
2. Version 0.5.57 - Creator Locked Backstory Presentation Plan
3. Version 0.5.58 - Backstory Legacy Purchase Integration Plan

No extra docs-only planning pass is required unless the implementation prompt finds that runtime policy fixture shape is still unsettled.

## Checks Run

- `git status --short` - showed only docs changed in this pass:
  - `docs/dev/current-codex-output.md`
  - `docs/future_content_backlog.md`
  - `docs/design/backstory-eligibility-resolver-test-plan.md`
- `npm.cmd run tool:content-lint` - passed, `content-lint: ok (53 files checked)`.
- `git diff --check` - passed with line-ending normalization warnings only.

## Behavior / Runtime Confirmation

No runtime behavior changed.
No content JSON changed.
No live backstory records were added, removed, renamed, or modified.
No policy metadata JSON changed.
No character creator, starter skill, Legacy, save/account, combat, magic, economy, progression, launcher UI, generated UI output, or availability behavior changed.
This pass only adds a planning document for future resolver tests.

## Risks / Follow-Up

- Runtime implementation still needs an approved runtime policy shape and focused tests before any creator availability changes.
- Earned skill maxima, family/source-run evidence, regional/institution/estate/title ownership, magic licensing, mount behavior, contacts, medical systems, and oath behavior remain missing or partial evidence owners.
- Existing achievements are broad and must not unlock narrow Tier 2 or Tier 3 origins without explicit future policy mapping.
- Creator integration should remain separate until resolver output is stable.

## Next Recommended Version

Version 0.5.56 - Backstory Eligibility Resolver Implementation

## Suggested Commit Message

docs(content): plan backstory resolver tests
