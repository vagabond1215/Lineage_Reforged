# Current Codex Output

Source version/run: Version 0.5.45 - Backstory Naming Convention Content Pass
Date: 2026-05-15
Branch/status assumption: Current local branch reality. `git status --short` was run before edits and showed a clean worktree.

## Result

Applied a narrow live backstory naming cleanup based on the v0.5.44 tiered backstory lane and naming design.

This was a content-only visible-name and prose-alignment pass plus non-runtime policy metadata note alignment. No tiered lanes, eligibility logic, runtime availability, creator filtering, Legacy behavior, save/account schemas, starter skills, combat, magic, economy, progression, or launcher UI behavior were changed.

## Files Changed

- `packages/content/base/player/backstories.json`
- `docs/design/backstory-policy-metadata.json`
- `docs/dev/current-codex-output.md`

## Exact Backstory Names Changed

- `backstory.merchants_child`: `Merchant's Child` -> `Merchant Family`
- `backstory.carpenters_child`: `Carpenter's Child` -> `Carpenter Household`
- `backstory.craftsmans_child`: `Workshop Child` -> `Workshop-Raised`

Light prose adjustments:

- `Merchant Family` now frames trade as family exposure, household pressure, ledgers, bargaining, and market habits without making the character a current merchant.
- `Carpenter Household` now frames carpentry as household/worksite exposure rather than current employment or mastery.
- `Workshop-Raised` now removes the child label and keeps the premise centered on workshop habits, assisting, sorting, measuring, cleaning, repairs, and material repetition.

## Names Reviewed And Intentionally Kept

- `backstory.miners_kin`: `Miner's Kin`
- `backstory.scouts_ward`: `Scout's Ward`
- `backstory.military_brat`: `Garrison Ward`
- `backstory.gutter_rat`: `Street-Raised`
- `backstory.performer`: `Troupe-Raised`
- `backstory.temple_acolyte`: `Temple Acolyte`
- `backstory.hedge_adept`: `Hedge Adept`
- `backstory.local_hero`: `Local Champion`
- `backstory.isekai_outcast`: `World-Stray`
- `backstory.minor_noble`: `Minor Noble`
- `backstory.village_hunter`: `Village Hunter`
- `backstory.scholars_apprentice`: `Scholar's Apprentice`

## Policy Metadata Updates

- `backstory.merchants_child` now has `recommendedName: "Merchant Family"` and notes matching the live family-trade framing.
- `backstory.craftsmans_child` now has `recommendedName: "Workshop-Raised"` and notes matching the live workshop-environment framing.
- `backstory.carpenters_child` now has `recommendedName: "Carpenter Household"` and notes matching the live household/worksite framing.
- `docs/design/backstory-policy-metadata.json` still has `status: "non_runtime_policy_draft"` and `runtimeImportAllowed: false`.
- Policy metadata was not imported into runtime or source files.

## Behavior / Runtime Confirmation

No runtime behavior changed.
No backstory ids changed.
No backstory records were added or removed.
No `startingSkills` changed.
No `startingAbilityIds` changed.
No `attributeAdjustments` changed.
No character creator behavior changed.
No starter skill, Legacy, save/account, combat, magic, economy, progression, launcher UI, live availability, or runtime eligibility behavior changed.

## Checks Run

- `git status --short`: before edits, clean worktree.
- `git status --short`: after content edits, showed only `docs/design/backstory-policy-metadata.json` and `packages/content/base/player/backstories.json` modified.
- `npm.cmd run tool:content-lint`: passed, `content-lint: ok (53 files checked)`.
- `node --test tests\unit\*backstory*.mjs tests\unit\player-identity-content.test.mjs tests\unit\*legacy*.mjs tests\unit\*creator*.mjs`: passed, 68 tests.
- `git diff --check`: passed.
- Final `git status --short`: `docs/design/backstory-policy-metadata.json`, `docs/dev/current-codex-output.md`, and `packages/content/base/player/backstories.json` modified.

## Risks / Follow-Up

- Generated `apps/rpg-ui/dist` output still contains old built-name text from a prior build. It was left untouched because this pass was content-only and generated artifacts should not be edited directly unless requested.
- `backstory.scholars_apprentice`, `backstory.temple_acolyte`, `backstory.performer`, and `backstory.hedge_adept` still carry magic-adjacent starter skills from current branch reality. This pass intentionally did not split, rebalance, or reinterpret those starts.
- No backlog update was made because this pass introduced no new deferred systems and did not start or complete an existing deferred item.

## Next Recommended Version

Version 0.5.46 - Tiered Backstory Lane Metadata Draft

## Suggested Commit Message

content(player): align backstory names with origin framing
