# Current Codex Output

Source version/run: Version 0.5.50 - Tier 1 Backstory Content Follow-Up
Date: 2026-05-17
Branch/status assumption: Current local branch reality. `git status --short` was run before edits and showed a clean worktree.

## Result

Added the two remaining approved safe Tier 1 backstory records from the first-batch plan and aligned the non-runtime policy metadata.

New live content records:

- `backstory.drovers_hand`
- `backstory.kitchen_hand`

No unlock resolver, hidden availability logic, starter-skill validation rule, runtime policy import, schema change, starting ability, or generated UI output was added.

## Files Inspected

- `README.md`
- `docs/design/backstory-coverage-first-batch-plan.md`
- `docs/design/backstory-tiered-lane-design.md`
- `docs/design/backstory-policy-metadata.json`
- `docs/design/backstory-policy-metadata.md`
- `packages/content/base/player/backstories.json`
- `packages/content/base/player/skills.json`
- `packages/content/base/player/achievements.json`
- `packages/content/base/player/abilities.json`
- `packages/schemas/player/backstory.schema.json`
- `tests/unit/backstory-policy-metadata.test.mjs`
- `tests/unit/player-identity-content.test.mjs`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Files Changed

- `packages/content/base/player/backstories.json`
- `docs/design/backstory-policy-metadata.json`
- `tests/unit/player-identity-content.test.mjs`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Exact New Backstory Records Added

### `backstory.drovers_hand` / Drover's Hand

- Attribute adjustments: `VIT +1`, `INT -1`
- Starting skills: `skill.survival.animal_handling`, `skill.settlement.ranching`, `skill.survival.endurance`, `skill.survival.navigation`
- Starting abilities: none

### `backstory.kitchen_hand` / Kitchen Hand

- Attribute adjustments: `CON +1`, `CHA -1`
- Starting skills: `skill.crafting.cooking`, `skill.survival.fire_control`, `skill.knowledge.general_lore`, `skill.knowledge.civic_lore`
- Starting abilities: none

All new starter skills use current canonical skill ids and rank 25.

## New Id / Name / Primary Skill Summary

| Backstory id | Visible name | Primary skill | Lane |
| --- | --- | --- | --- |
| `backstory.drovers_hand` | Drover's Hand | `skill.survival.animal_handling` | `rural_labor` |
| `backstory.kitchen_hand` | Kitchen Hand | `skill.crafting.cooking` | `civic_local` |

## Policy Metadata Updates

- Added one `records[]` policy entry for each new live backstory.
- Both entries use `tier_1`, `branchRole: "root"`, `hasPrecursor: false`, `alternateUnlockKinds: ["none"]`, `capIntent: "low_cap"`, `extraEffectIntent: "none"`, `runtimeRisk: "low"`, `implementationReadiness: "current_record"`, and `upgradeScaleIntent: "short_track"`.
- Both entries use `expectedUpgradeCountRange: { "min": 30, "max": 100 }`, `upgradeCostCurveIntent: "stepped"`, `prestigeRequirementIntent: "none"`, `echoRequirementIntent: "low"`, and `capProgressionIntent: "bonus_only"`.
- `runtimeImportAllowed` remains `false` and `status` remains `non_runtime_policy_draft`.

## Future Draft / Backlog Handling

- Verified that no `futureBackstoryLaneDrafts[]` entries duplicate `backstory.drovers_hand` or `backstory.kitchen_hand`.
- No future draft parent references needed repointing.
- Updated `docs/future_content_backlog.md` with a concise note that Drover's Hand and Kitchen Hand were added, while Dockhand/Riverhand, Barge Hand, Forge Yard/Forge Hand, Forge Apprentice, Stablehand, Tanner's Yard, Loomhouse, Hidden Blood, Unacknowledged Blood, Red-Lantern Ward, and Courtesan's House remain deferred or later planning concepts.

## Test Updates

- Updated `tests/unit/player-identity-content.test.mjs` exact expectations from 25 backstories / 106 starter-skill entries to 27 backstories / 114 starter-skill entries.
- No `tests/unit/backstory-policy-metadata.test.mjs` code change was needed; existing exact policy coverage tests passed with the new metadata records.

## Checks Run

- `git status --short`
- `node -e` BOM-stripped JSON parse/count sanity check for live backstories, policy records, and duplicate future drafts
- `npm.cmd run tool:content-lint`
- `node --test tests\unit\backstory-policy-metadata.test.mjs tests\unit\*backstory*.mjs tests\unit\*legacy*.mjs tests\unit\*creator*.mjs`
- `node --test tests\unit\player-identity-content.test.mjs`
- `git diff --check`

`git diff --check` passed with line-ending normalization warnings only.

## Behavior / Runtime Confirmation

No runtime behavior changed.
No existing backstory records were renamed, removed, or modified except where explicitly listed as additions.
No starting abilities were added.
No character creator behavior changed.
No starter skill validation rules changed.
No Legacy, save/account, combat, magic, economy, progression, launcher UI, generated UI output, or availability filtering behavior changed.
Policy metadata remains non-runtime and is not imported by runtime/source paths.

## Risks / Follow-Up

- The canonical backstory catalog now includes the two newly requested live records; current creator code behavior was not changed.
- Drover's Hand must remain free of mounts, riding, cavalry, animal ownership, pack-animal runtime effects, companions, and route authority in future work.
- Kitchen Hand must remain free of inn ownership, hospitality contacts, discounts, passive economy behavior, free food generation, chef mastery, and magic access in future work.
- Later deferred candidates should remain separate content passes with their own skill/runtime ownership checks.

## Next Recommended Version

Version 0.5.51 - Backstory Eligibility Resolver Plan

## Suggested Commit Message

content(player): add remaining tier one backstories
