# Current Codex Output

Source version/run: Version 0.5.54 - Backstory No-Compatibility Guardrail Revision
Date: 2026-05-18
Branch/status assumption: Current local branch reality. `git status --short` was run before edits and showed a clean worktree.

## Result

Removed premature backwards-compatibility and migration-preservation conventions from the recent Backstory Eligibility planning docs. The resolver planning now targets current authored content and current account/save shapes only, with missing future evidence resolving to default-safe current behavior, locked, hidden, or deferred.

Added an explicit pre-release no-compatibility guardrail to `AGENTS.md` and updated the next pipeline so Version 0.5.55 is the Backstory Eligibility Resolver Test Plan.

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
- `docs/dev/current-codex-output.md`

## Files Changed

- `AGENTS.md`
- `docs/design/backstory-eligibility-resolver-plan.md`
- `docs/design/backstory-evidence-ownership-plan.md`
- `docs/design/backstory-runtime-policy-shape-draft.md`
- `docs/design/backstory-tiered-lane-design.md`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Backwards-Compatibility Cleanup Summary

Removed or reframed planning language around:

- old-save preservation
- old-account preservation
- migration fallback behavior
- historical id preservation
- historical id aliases
- retired-id compatibility
- converted-id compatibility
- migration-only records or selections
- old-data rescue behavior
- old selected backstory preservation

The remaining no-compatibility references are intentional guardrails that say not to plan those features unless explicitly requested.

## AGENTS Guardrail Summary

`AGENTS.md` now states that this pre-release project should not plan or implement backwards compatibility unless explicitly requested. It specifically blocks old-save preservation, old-account preservation, migration aliases, retired-id compatibility, converted-id compatibility, historical id preservation, and migration-only behavior by default.

The roadmap wording was also rephrased from save compatibility / migration policy toward clean save/load behavior, current-data policy, and clean save/load reliability.

## Backstory Docs Cleanup Summary

`docs/design/backstory-eligibility-resolver-plan.md` now:

- targets current authored content and current account/save shapes
- removes migration fallback from the rule shape
- removes old-save and old-account planning
- keeps default/new-account safety
- keeps blocked evidence, family-scope, no-stacking, and non-import guardrails
- updates the pipeline to put this cleanup before the test plan

`docs/design/backstory-evidence-ownership-plan.md` now:

- treats missing evidence storage as unavailable
- removes migration source/provenance language
- removes old-account, old-save, old-run, retired/converted id, and historical preservation planning
- keeps source attribution, scope, starter-granted exclusion, blocked evidence, and abuse prevention
- updates the pipeline to Version 0.5.55 for the test plan

`docs/design/backstory-runtime-policy-shape-draft.md` now:

- removes `migrationFallbacks`, `migrationFallback`, `legacyIdAliases`, `retiredBackstoryIds`, `convertedBackstoryIds`, `preserveExistingSelection`, and `hideForNewCharacters`
- removes `retired` and `converted` availability statuses from the planned status set
- removes `migration_keep_existing_only`
- removes migration as a normal source type
- replaces the migration strategy section with a current-data strategy
- keeps the policy shape schema-free and non-runtime

`docs/design/backstory-tiered-lane-design.md` received small wording cleanup where its older prompt pipeline mentioned compatibility or migration boundaries.

## Terms / Fields Removed Or Reframed

Removed/reframed fields and values:

- `migrationFallbacks`
- `migrationFallback`
- `legacyIdAliases`
- `retiredBackstoryIds`
- `convertedBackstoryIds`
- `preserveExistingSelection`
- `hideForNewCharacters`
- `migration_keep_existing_only`
- `retired` and `converted` as planned runtime availability statuses
- `migration` as a normal source type

Reframed behavior:

- missing current evidence means locked, hidden, deferred, or default-safe current behavior
- missing family/lineage/source-run evidence does not grant scoped unlocks
- missing source attribution does not infer earned skill maxima
- current content ids are validated directly
- clean current-data model changes are allowed while the project remains pre-release

## Remaining Intentional Safety Concepts

Kept intact:

- default/new-account safety
- blocked evidence cannot unlock content
- starter-granted ranks do not count as earned skill maxima
- family-scoped evidence does not fall back to account-wide evidence
- Tier 2 and Tier 3 require evidence, not Legacy purchase alone
- no-stacking: only the selected backstory applies effects
- design metadata remains non-runtime and must not be imported by resolver/runtime
- deferred/special records must not leak unsupported UI promises

## Recommended Next Pipeline

1. Version 0.5.55 - Backstory Eligibility Resolver Test Plan
2. Version 0.5.56 - Backstory Eligibility Resolver Implementation
3. Version 0.5.57 - Creator Locked Backstory Presentation Plan
4. Version 0.5.58 - Backstory Legacy Purchase Integration Plan

## Checks Run

- `git status --short` - showed only docs changed in this pass.
- `npm.cmd run tool:content-lint` - passed, `content-lint: ok (53 files checked)`.
- `git diff --check` - passed with line-ending normalization warnings only.

## Behavior / Runtime Confirmation

No runtime behavior changed.
No content JSON changed.
No live backstory records were added, removed, renamed, or modified.
No policy metadata JSON changed.
No character creator, starter skill, Legacy, save/account, combat, magic, economy, progression, launcher UI, generated UI output, or availability behavior changed.
This pass only removes unnecessary backwards-compatibility planning conventions and adds a pre-release no-compatibility guardrail.

## Risks / Follow-Up

- Future resolver test planning should assert current-data behavior rather than old-data rescue behavior.
- Compatibility work should stay out of scope unless the user explicitly requests it.
- Runtime implementation remains blocked until the test plan covers non-import boundaries, blocked evidence behavior, starter-granted skill exclusion, family/account scope boundaries, default safety, no-compatibility behavior, and no-stacking.

## Next Recommended Version

Version 0.5.55 - Backstory Eligibility Resolver Test Plan

## Suggested Commit Message

docs(workflow): remove premature compatibility planning
