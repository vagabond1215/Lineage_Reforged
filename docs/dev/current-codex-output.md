# Current Codex Output

Source version/run: Version 0.5.52 - Backstory Evidence Ownership Plan
Date: 2026-05-17
Branch/status assumption: Current local branch reality. `git status --short` was run before edits and showed a clean worktree.

## Result

Added a planning-only design document for durable evidence ownership before future Backstory Eligibility Resolver work. The plan defines evidence category ownership, likely storage, scope, readiness, source attribution, starter-granted skill exclusion, migration defaults, blocked systems, representative backstory evidence paths, and an updated implementation pipeline.

No evidence ledger, resolver, runtime policy data, content JSON change, policy metadata JSON change, Legacy behavior change, creator behavior change, schema change, or live availability change was added.

## Files Inspected

- `README.md`
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

Listed files not present on this branch:

- `apps/rpg-ui/src/game-shell/accountProfile.ts`; closest equivalent inspected: `accountProfileManager.ts`
- `apps/rpg-ui/src/game-shell/chronicle.ts`; closest equivalents inspected: `accountMetaPresentation.ts`, `achievementChroniclesPresentation.ts`, `runLifecycle.ts`, and `newGameSnapshot.ts`

## Files Changed

- `docs/design/backstory-evidence-ownership-plan.md`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Evidence Ownership Summary

The new plan covers these evidence categories:

- `skill_threshold`
- `earned_skill_maximum`
- `achievement`
- `activity_tag`
- `source_run_evidence`
- `chronicle_flag`
- `profession_history`
- `faction_or_region_reputation`
- `renown_milestone`
- `lineage_title`
- `estate_milestone`
- `institution_acceptance`
- `patronage`
- `adoption`
- `marriage`
- `story_outcome`
- `family_skill_maximum`
- `family_backstory_history`
- `legacy_purchase`
- `echo_requirement`
- `prestige_requirement`
- `special_case`

For each category, the plan defines meaning, likely owner, future storage location, scope, readiness, whether starter-granted values count, tier suitability, missing/default behavior, and risks.

## Source Attribution Summary

The plan requires future evidence to distinguish starter-granted skill ranks, earned skill gains, inherited/family evidence, Legacy-purchased access, account-wide meta unlocks, family-specific unlocks, source-run evidence, Chronicle flags, and achievements.

Starter-granted skill ranks must not count as earned skill maxima by default. Suggested future provenance fields include `sourceType`, `sourceId`, `sourceRunId`, `familyId`, `lineageId`, `scopeType`, `scopeId`, `earnedRankMax`, `starterRankIgnored`, `recordedAt`, and `contentVersion`.

## Scope Model Summary

The plan defines account-wide, family-specific, lineage-specific, character-specific, source-run-specific, region-specific, faction-specific, institution-specific, estate/title-specific, and special/manual scopes.

Key boundary examples:

- Minor Noble should be family, estate, title, or status scoped, not account-wide.
- Merchant Family may require family or source-run trade evidence.
- Garrison Ward may require family or source-run militia evidence.
- Street Vendor can be default, early account unlock, or simple evidence unlock.
- Local Champion should be local-renown, achievement, title, or region scoped.
- World-Stray should remain special/manual or hidden.

## Near-Term Safe Evidence

Safest future channels:

- achievements, if mapped narrowly
- source-run evidence, after explicit evidence summaries exist
- earned skill maxima, only after source attribution separates earned ranks from starter-granted ranks
- Chronicle flags, only after a durable vocabulary and owner are defined

## Blocked Evidence

Blocked until owning systems exist:

- family skill maxima
- family backstory history
- heir legitimacy/status
- estate/title ownership
- regional renown storage if not durable and scoped
- institutional membership
- patronage/contact systems
- adoption
- marriage
- mounted behavior and mount ownership
- market/economy effects
- magic licensing/acquisition
- medical/injury systems
- oath and paladin behavior

## Representative Backstory Examples

The plan maps future evidence directions for Local, Street Vendor, Militia Levy, Scribe's Apprentice, Merchant Family, Carpenter Household, Miner's Kin, Village Hunter, Scout's Ward, Garrison Ward, Scholar's Apprentice, Temple Acolyte, Hedge Adept, Minor Noble, Local Champion, World-Stray, future Sword Drill, future Trade House, future Paladin Oathline, and future Recognized Heir.

## Migration / Compatibility Notes

- Old accounts with no family ledger should use default/new-account backstories plus explicitly supported account-wide evidence only.
- Old saves with selected backstories that later become locked should keep historical identity.
- Old runs lacking source attribution should not infer earned skill maxima.
- Broad old achievements should not unlock narrow Tier 2 or Tier 3 origins until reviewed.
- Missing family or lineage ids should not grant family/lineage-scoped origins.
- Renamed, retired, or converted content ids should preserve historical ids and map only through reviewed migrations.

## Recommended Next Pipeline

1. Version 0.5.53 - Backstory Runtime Policy Shape Draft
2. Version 0.5.54 - Backstory Eligibility Resolver Test Plan
3. Version 0.5.55 - Backstory Eligibility Resolver Implementation
4. Version 0.5.56 - Creator Locked Backstory Presentation Plan
5. Version 0.5.57 - Backstory Legacy Purchase Integration Plan

No extra planning step is required before the runtime policy shape draft if that draft remains non-runtime and schema-free.

## Checks Run

- `git status --short`
- `npm.cmd run tool:content-lint`
- `git diff --check`

`git diff --check` passed with line-ending normalization warnings only.

## Behavior / Runtime Confirmation

No runtime behavior changed.
No content JSON changed.
No live backstory records were added, removed, renamed, or modified.
No policy metadata JSON changed.
No character creator, starter skill, Legacy, save/account, combat, magic, economy, progression, launcher UI, generated UI output, or availability behavior changed.

## Risks / Follow-Up

- Future resolver work remains blocked on runtime policy shape, tests, and durable evidence storage.
- Earned skill maxima are still not safe until starter-granted and earned sources are separated.
- Family, title, estate, institution, patronage, adoption, marriage, mounted, magic, medical, oath, and economy evidence remain blocked until owner systems exist.
- The next draft must encode source, scope, and missing-data behavior so blocked evidence cannot accidentally unlock content.

## Next Recommended Version

Version 0.5.53 - Backstory Runtime Policy Shape Draft

## Suggested Commit Message

docs(content): plan backstory evidence ownership
