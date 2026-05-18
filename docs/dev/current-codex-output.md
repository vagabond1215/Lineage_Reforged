# Current Codex Output

Source version/run: Version 0.5.51 - Backstory Eligibility Resolver Plan
Date: 2026-05-17
Branch/status assumption: Current local branch reality. `git status --short` was run before edits and showed a clean worktree.

## Result

Added a planning-only design document for a future Backstory Eligibility Resolver. The plan defines resolver responsibilities, input categories, evidence ownership, runtime-safe rule shape, tier handling, no-stacking behavior, family/account unlock boundaries, default safety, migration concerns, and a staged implementation pipeline.

No resolver, runtime filtering, unlock logic, Legacy purchase, policy metadata import, schema change, content JSON change, creator UI change, or live availability change was added.

## Files Inspected

- `README.md`
- `docs/design/backstory-tiered-lane-design.md`
- `docs/design/backstory-coverage-first-batch-plan.md`
- `docs/design/backstory-policy-metadata.json`
- `docs/design/backstory-policy-metadata.md`
- `packages/content/base/player/backstories.json`
- `packages/content/base/player/skills.json`
- `packages/content/base/player/achievements.json`
- `packages/content/base/player/abilities.json`
- `packages/content/base/player/legacy_unlocks.json`
- `docs/design/legacy-upgrade-catalog-draft.json`
- `docs/future_content_backlog.md`
- `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts`
- `apps/rpg-ui/src/game-shell/characterCreationForm.ts`
- `apps/rpg-ui/src/game-shell/newGameSnapshot.ts`
- `packages/engines/game-engine/src/legacy-unlocks.ts`
- `packages/shared/types/src/settlement-institutions.ts`
- `docs/dev/current-codex-output.md`

## Files Changed

- `docs/design/backstory-eligibility-resolver-plan.md`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Resolver Planning Summary

- The future resolver should return eligible, locked, hidden/deferred, special, and default backstory projections without mutating account state.
- It should explain locked states safely, preserve at least one default/new-account option, enforce one selected backstory, and keep tier bonuses non-stacking.
- It must not read `docs/design/backstory-policy-metadata.json` or `docs/design/legacy-upgrade-catalog-draft.json` as runtime policy.
- It should keep backstory eligibility separate from existing settlement-start authorization.

## Evidence Ownership Summary

The plan separates evidence into channels such as `skill_threshold`, `earned_skill_maximum`, `achievement`, `activity_tag`, `source_run_evidence`, `chronicle_flag`, `profession_history`, reputation, renown, title, estate, institution, patronage, adoption, marriage, story outcome, family skill maximum, family backstory history, and special cases.

Near-term candidates are reviewed achievements, source-run evidence, and earned skill maxima after source attribution exists. Blocked channels include family ledgers, estate/title/status, institutional membership, patronage, adoption, marriage, contacts, mounted behavior, magic licensing, and economy effects.

Starter-granted skill ranks must not count as earned skill maxima unless a later system explicitly allows it.

## Tier Handling Summary

- Tier 1: default, early Legacy, or simple evidence unlock; low risk and no required precursor.
- Tier 2: previous-play evidence or valid alternate unlock path; Legacy purchase plus evidence, never purchase alone.
- Tier 3: long-term unlock with several runs or strong family/institution/status/renown/estate support.
- Special: narrative exceptions outside normal progression.
- Deferred: blocked until runtime owner exists.

The plan classifies current live records for future locking intent without changing current availability.

## Family / Account Unlock Distinction

Family-specific unlocks should own ancestry, lineage, household, estate, title, local-renown, institution, and inherited-standing evidence. Account-wide unlocks may be acceptable for broad defaults, special meta unlocks, content visibility, and non-lineage quality-of-life features.

A random new family should not receive noble, local-renown, garrison, institution, or heir-status backstories because an unrelated lineage earned them.

## Default / New-Account Safety Summary

The plan preserves the current policy-default set as the safe baseline:

- Local
- Vagabond
- Exile
- Farmhand
- Amnesiac

It marks Street Vendor, Net-Tender, Gatherer, Drover's Hand, and Kitchen Hand as possible future default or early-Legacy candidates. Militia Levy and Scribe's Apprentice are better early-Legacy candidates until combat-adjacent and mundane-scholar boundaries are reviewed.

## Migration / Compatibility Notes

- Existing selected backstories remain valid.
- Old saves should not lose identity or starter skills.
- Future locking affects only new character creation after implementation.
- Retired, renamed, or converted backstories should preserve old character history.
- Missing family, unlock, renown, prestige, Echo, and evidence fields should resolve to safe defaults.
- Runtime policy/content versioning should be explicit before implementation.

## Recommended Next Pipeline

1. Version 0.5.52 - Backstory Evidence Ownership Plan
2. Version 0.5.53 - Backstory Runtime Policy Shape Draft
3. Version 0.5.54 - Backstory Eligibility Resolver Test Plan
4. Version 0.5.55 - Backstory Eligibility Resolver Implementation
5. Version 0.5.56 - Creator Locked Backstory Presentation Plan
6. Version 0.5.57 - Backstory Legacy Purchase Integration Plan

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

- The future resolver is still blocked on evidence ownership, runtime policy shape, migration behavior, and test planning.
- Family/ancestry data, heir legitimacy/status, estate/title ownership, regional renown, institutional membership, contacts, patronage, mounted behavior, magic acquisition/licensing, medical/injury systems, and oath/paladin behavior remain blocked for runtime use.
- The next pass should define durable evidence ownership before drafting runtime policy data.

## Next Recommended Version

Version 0.5.52 - Backstory Evidence Ownership Plan

## Suggested Commit Message

docs(content): plan backstory eligibility resolver
