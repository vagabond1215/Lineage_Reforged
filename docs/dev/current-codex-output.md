# Current Codex Output

Source version/run: Version 0.5.53 - Backstory Runtime Policy Shape Draft
Date: 2026-05-18
Branch/status assumption: Current local branch reality. `git status --short` was run before edits and showed a clean worktree.

## Result

Added a planning-only runtime policy shape draft for future Backstory Eligibility Resolver work. The draft defines how a future runtime-approved policy container, availability statuses, rule records, requirement groups, scope policy, source attribution, missing/blocked-data behavior, no-stacking behavior, default safety, migration fields, and validation expectations should be shaped before implementation.

No resolver, runtime policy data, schema, creator filtering, Legacy purchase, content JSON change, policy metadata JSON change, save/account migration, UI change, or live availability change was added.

## Files Inspected

- `README.md`
- `docs/design/backstory-eligibility-resolver-plan.md`
- `docs/design/backstory-evidence-ownership-plan.md`
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
- `docs/dev/current-codex-output.md`

## Files Changed

- `docs/design/backstory-runtime-policy-shape-draft.md`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Runtime Policy Shape Summary

The new draft keeps runtime policy separate from `docs/design/backstory-policy-metadata.json`, `docs/design/legacy-upgrade-catalog-draft.json`, `futureBackstoryLaneDrafts[]`, and design docs.

It proposes a future policy container with:

- `schemaVersion`
- `policyVersion`
- `status`
- `runtimeImportAllowed`
- `contentVersion`
- `defaultBackstoryIds`
- `availabilityRules`
- `blockedEvidenceKinds`
- `evidenceKindDefinitions`
- `scopeDefinitions`
- `migrationFallbacks`
- `explainabilityStrings`

The example container remains `runtimeImportAllowed: false` because this pass is a non-runtime draft.

## Availability Status Summary

The draft defines planned statuses:

- `always_available`
- `default_available`
- `early_legacy`
- `locked`
- `hidden`
- `special`
- `deferred`
- `retired`
- `converted`

Each status is documented with intended selection, visibility, migration, and blocked-owner behavior.

## Requirement / Scope / Source Attribution Summary

The draft proposes rule fields including:

- `backstoryId`
- `availabilityStatus`
- `tier`
- `scopePolicy`
- `requiresAny`
- `requiresAll`
- `requiresLegacyPurchase`
- `requiresPrestige`
- `requiresEcho`
- `requiresEvidence`
- `blocksIf`
- `starterSkillEvidencePolicy`
- `selectedBackstoryEffectPolicy`
- `explainLocked`
- `explainUnlocked`
- `migrationFallback`

Requirement groups include fields for evidence `kind`, `scope`, `scopeId`, `minValue`, `threshold`, allowed source types, starter-granted exclusion, earned-source requirements, owner readiness, missing behavior, blocked behavior, and explanation copy.

Scope policy covers account, family, lineage, character, source-run, region, faction, institution, estate/title, and special/manual scopes. Source attribution covers starter backstory, starter bundle, earned play, Legacy purchase, achievement, source-run, family ledger, Chronicle flag, story outcome, and migration sources.

Starter-granted skill ranks remain excluded from earned skill evidence by default.

## Missing / Blocked Data Behavior Summary

The draft defines missing or blocked behavior values:

- `treat_as_unmet`
- `hide`
- `defer`
- `use_default_fallback`
- `migration_keep_existing_only`
- `manual_review`

Blocked evidence must not unlock content. Blocked mechanics should not appear in creator UI as near-term promises.

## Example Rule Summary

The draft includes illustrative, non-runtime examples for:

- Local as `default_available`
- Street Vendor as a default or `early_legacy` candidate
- Militia Levy as `early_legacy` or civic-defense evidence gated
- Merchant Family as Tier 2 trade evidence plus Legacy/Prestige support
- Garrison Ward as Tier 2 Militia Levy or militia/source-run evidence plus purchase support
- Minor Noble as Tier 3/special and blocked until family, title, estate, legal claim, or story owners exist
- Local Champion as special/converted and region/achievement/story scoped
- World-Stray as special/manual or hidden
- future Sword Drill as Tier 2 with Militia Levy or earned weapon/drill evidence plus Legacy purchase
- future Recognized Heir as deferred/special until title, estate, family, and legal-claim owners exist

## Future Validation Expectations

Future test planning should cover:

- every live backstory has a rule or explicit fallback
- no rule references missing ids except explicit migration/future cases
- runtime policy does not consume design metadata or future drafts
- blocked evidence cannot unlock content
- starter-granted skills are excluded by default
- Tier 2 and Tier 3 cannot unlock from Legacy purchase alone
- family-scoped rules do not fall back to account-wide evidence
- default set is never empty
- old selected backstories remain valid
- deferred/special records do not leak unsupported UI promises
- parent and child backstory effects do not stack
- missing future ledgers fall back safely

## Migration Strategy

The draft recommends explicit migration fields:

- `policyVersion`
- `contentVersion`
- `legacyIdAliases`
- `retiredBackstoryIds`
- `convertedBackstoryIds`
- `preserveExistingSelection`
- `hideForNewCharacters`

Old selected backstories should remain valid on existing saves even if future filtering locks the same origin for new characters. Missing family, lineage, source-run, or evidence fields should not grant high-tier or family-scoped access.

## Recommended Next Pipeline

1. Version 0.5.54 - Backstory Eligibility Resolver Test Plan
2. Version 0.5.55 - Backstory Eligibility Resolver Implementation
3. Version 0.5.56 - Creator Locked Backstory Presentation Plan
4. Version 0.5.57 - Backstory Legacy Purchase Integration Plan

No extra planning step is required before the test plan if the test plan stays non-runtime until implementation is explicitly approved.

## Checks Run

- `git status --short` - showed only the docs changed in this pass.
- `npm.cmd run tool:content-lint` - passed, `content-lint: ok (53 files checked)`.
- `git diff --check` - passed with line-ending normalization warnings only.

## Behavior / Runtime Confirmation

No runtime behavior changed.
No content JSON changed.
No live backstory records were added, removed, renamed, or modified.
No policy metadata JSON changed.
No character creator, starter skill, Legacy, save/account, combat, magic, economy, progression, launcher UI, generated UI output, or availability behavior changed.

## Risks / Follow-Up

- Future resolver work still needs a test plan before implementation.
- Runtime policy data must not be authored until validation can enforce non-import boundaries, blocked evidence behavior, scope isolation, migration safety, and no-stacking.
- Earned skill maxima remain blocked until starter-granted and earned sources are separated.
- Family, lineage, estate/title, institution, patronage, adoption, marriage, mounted, magic, medical, oath, and economy evidence remain blocked or partial until owning systems exist.

## Next Recommended Version

Version 0.5.54 - Backstory Eligibility Resolver Test Plan

## Suggested Commit Message

docs(content): draft backstory runtime policy shape
