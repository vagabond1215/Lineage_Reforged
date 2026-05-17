# Current Codex Output

Source version/run: Version 0.5.47 - Tiered Backstory Lane Metadata Draft
Date: 2026-05-17
Branch/status assumption: Current local branch reality. `git status --short` was run before edits and showed a clean worktree.

## Result

Extended the non-runtime Backstory Legacy policy metadata with planning-only tier, lane, branch, precursor, alternate-unlock, cap, extra-effect, runtime-risk, readiness, and upgrade-scale intent fields.

The metadata remains `status: "non_runtime_policy_draft"` with `runtimeImportAllowed: false`. No resolver, live availability, character creator behavior, starter skills, Legacy runtime, save/account storage, combat, magic, economy, progression, launcher UI, generated UI output, or live backstory content changed.

## Files Changed

- `docs/design/backstory-policy-metadata.json`
- `docs/design/backstory-policy-metadata.md`
- `docs/future_content_backlog.md`
- `tests/unit/backstory-policy-metadata.test.mjs`
- `docs/dev/current-codex-output.md`

## Metadata Shape Changes

- Added allowed-value arrays for `tierValues`, `laneValues`, `branchRoleValues`, `alternateUnlockKindValues`, `capIntentValues`, `extraEffectIntentValues`, `runtimeRiskValues`, `implementationReadinessValues`, `upgradeScaleIntentValues`, `upgradeCostCurveIntentValues`, `prestigeRequirementIntentValues`, `echoRequirementIntentValues`, and `capProgressionIntentValues`.
- Added planning fields to all 20 current policy `records[]` entries, including tier/lane/branch, precursor, alternate unlock, cap/effect, readiness/risk, and upgrade-scale fields.
- Added `futureBackstoryLaneDrafts[]` with 30 compact planning drafts that are separate from current live backstory ids.
- Kept `standalone` out of all allowed-value arrays, current records, and future drafts.

## Current Backstory Tier/Lane Summary

- Tier 1 roots/current starts: `backstory.local` (`civic_local`), `backstory.vagabond` (`travel_survival`), `backstory.exile` (`hardship_survival`), `backstory.craftsmans_child` (`craft`), `backstory.farmhand` (`rural_labor`), `backstory.gutter_rat` (`urban_hardship`), and `backstory.temple_acolyte` (`temple_service`, runtime-owner caution).
- Tier 2 branches/special cases: Merchant Family, Troupe-Raised, Carpenter Household, Village Hunter, Miner's Kin, Garrison Ward, Scout's Ward, Scholar's Apprentice, and Hedge Adept.
- Tier 3 current status/lineage case: `backstory.minor_noble`, with no precursor but explicit alternate unlock intent through prestige, renown, lineage recognition, estate status, patronage, adoption/marriage, or story outcome.
- Special cases: `backstory.amnesiac`, `backstory.isekai_outcast`, and `backstory.local_hero`.

## Future Lane Draft Summary

Added non-live future drafts for:

- Combat/militia: Militia Levy, Sword Drill, Spear Drill, Shield Ward, Bow Levy, Mounted Scout, Swordmaster's Line, Knightly Household, Dragoon Tradition.
- Trade/craft/river: Street Vendor, Merchant Household, Trade House, Forge Apprentice, Forge-Borne, Net-Tender, Ferryman's Household, River Pilot.
- Medicine/scholar/oath: Gatherer, Herbalist's Helper, Physicker's Assistant, Scribe's Apprentice, Arcane Assistant, Archivist Line, Oath Servant, Paladin Oathline.
- Lineage/social: Hidden Blood, Unacknowledged Blood, Disputed Scion, Recognized Heir, Red-Lantern Ward.

Future drafts with missing or uncertain primary skills use `primaryBackgroundSkillId: null` and are marked `needs_runtime_owner` or `backlog`.

## Upgrade-Scale Planning Summary

- Tier 1/current safe concepts generally use `short_track` with a 30-100 planning range.
- Tier 2 concepts generally use `standard_track` with a 60-200 planning range.
- Tier 3 concepts generally use `long_track` with a 100-500 planning range when a future owner is plausible.
- Mounted, paladin, lineage/heir, hidden-blood, and other runtime-blocked concepts use deferred/null range shapes where the owner is not established.

These are planning ranges only, not runtime caps, costs, or purchase counts.

## Test Updates

- Kept exact current backstory coverage validation.
- Added validation that allowed-value arrays, records, and future drafts do not use `standalone`.
- Added validation for tier/lane/branch/cap/effect/risk/readiness/upgrade-scale vocabularies.
- Added validation that Tier 2/Tier 3 records and drafts have a precursor or explicit alternate unlock evidence plus non-empty prerequisite intent.
- Added validation for `expectedUpgradeCountRange` numeric or explicit deferred/null shape.
- Added validation that future drafts are not live backstory ids and that non-null future draft primary skills reference existing skills.
- Added validation that null future draft primary skills explain the missing/uncertain owner and remain `needs_runtime_owner` or `backlog`.

## Checks Run

- `git status --short`: before edits, clean worktree.
- `git status --short`: after edits, expected modified files only.
- `npm.cmd run tool:content-lint`: passed, `content-lint: ok (53 files checked)`.
- `node --test tests\unit\backstory-policy-metadata.test.mjs`: passed, 5 tests.
- `node --test tests\unit\backstory-policy-metadata.test.mjs tests\unit\*backstory*.mjs tests\unit\*legacy*.mjs tests\unit\*creator*.mjs`: passed, 62 tests.
- `git diff --check`: passed. Git printed LF-to-CRLF working-copy warnings only.

## Behavior / Runtime Confirmation

No runtime behavior changed.
No live content JSON changed.
No live backstory records were added, removed, renamed, or modified.
No character creator, starter skill, Legacy, save/account, combat, magic, economy, progression, launcher UI, generated UI output, or availability behavior changed.

`records[]` still maps exactly to current `packages/content/base/player/backstories.json` ids. `futureBackstoryLaneDrafts[]` is not live content and is not imported by the checked runtime/source paths.

## Risks / Follow-Up

- Future drafts are intentionally compact planning concepts, not balanced unlocks or runtime contracts.
- Higher-tier origins without direct precursors still need a future reviewed resolver with previous-play evidence plus Legacy/prestige/Echo or equivalent requirements.
- Mounted, paladin, lineage/heir, market/contact, medical, oath, and magic-adjacent concepts remain blocked until their runtime owners exist.
- Exact upgrade counts, cost curves, prestige/Echo requirements, and cap effects need a later balance pass before implementation.

## Next Recommended Version

Version 0.5.48 - Backstory Coverage First-Batch Plan

## Suggested Commit Message

content(policy): draft tiered backstory lane metadata
