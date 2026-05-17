# Current Codex Output

Source version/run: Version 0.5.49 - Tier 1 Backstory Content Batch
Date: 2026-05-17
Branch/status assumption: Current local branch reality. `git status --short` was run before edits and showed a clean worktree.

## Result

Added the smaller approved first batch of five safe Tier 1 backstory records and aligned the non-runtime backstory policy metadata.

New live content records:

- `backstory.militia_levy`
- `backstory.street_vendor`
- `backstory.net_tender`
- `backstory.gatherer`
- `backstory.scribes_apprentice`

No unlock resolver, hidden availability logic, starter-skill validation rule, runtime policy import, schema change, starting ability, or generated UI output was added.

## Files Inspected

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
- `tools/content-lint/index.mjs`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Files Changed

- `packages/content/base/player/backstories.json`
- `docs/design/backstory-policy-metadata.json`
- `tests/unit/player-identity-content.test.mjs`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Exact New Backstory Records Added

### `backstory.militia_levy` / Militia Levy

- Attribute adjustments: `CON +1`, `CHA -1`
- Starting skills: `skill.combat.tactics.formation_discipline`, `skill.combat.defense.guard`, `skill.survival.endurance`, `skill.knowledge.civic_lore`
- Starting abilities: none

### `backstory.street_vendor` / Street Vendor

- Attribute adjustments: `CHA +1`, `STR -1`
- Starting skills: `skill.settlement.trade`, `skill.leadership.negotiation`, `skill.knowledge.civic_lore`, `skill.knowledge.general_lore`
- Starting abilities: none

### `backstory.net_tender` / Net-Tender

- Attribute adjustments: `VIT +1`, `INT -1`
- Starting skills: `skill.resource.fishing`, `skill.survival.water_safety`, `skill.survival.swimming`, `skill.survival.endurance`
- Starting abilities: none

### `backstory.gatherer` / Gatherer

- Attribute adjustments: `WIS +1`, `STR -1`
- Starting skills: `skill.resource.gathering`, `skill.resource.foraging`, `skill.knowledge.flora_lore`, `skill.survival.endurance`
- Starting abilities: none

### `backstory.scribes_apprentice` / Scribe's Apprentice

- Attribute adjustments: `INT +1`, `STR -1`
- Starting skills: `skill.settlement.administration`, `skill.knowledge.general_lore`, `skill.knowledge.civic_lore`, `skill.knowledge.cultural_lore`
- Starting abilities: none

All new starter skills use current canonical skill ids and rank 25.

## Policy Metadata Updates

- Added one `records[]` entry for each new backstory.
- Kept `status: "non_runtime_policy_draft"`.
- Kept `runtimeImportAllowed: false`.
- Used `tier_1`, `branchRole: "root"`, `hasPrecursor: false`, `parentBackstoryIds: []`, `alternateUnlockPath: false`, `alternateUnlockKinds: ["none"]`, `capIntent: "low_cap"`, `upgradeScaleIntent: "short_track"`, `expectedUpgradeCountRange: { "min": 30, "max": 100 }`, `upgradeCostCurveIntent: "stepped"`, `echoRequirementIntent: "low"`, and `capProgressionIntent: "bonus_only"` for all five records.
- Used `runtimeRisk: "moderate"` for Militia Levy and `runtimeRisk: "low"` for the other four records.
- Used `implementationReadiness: "current_record"` because these are now live content records.
- Removed the matching future draft placeholders from `futureBackstoryLaneDrafts[]`.
- Repointed downstream future draft parents from removed draft ids to the new live backstory ids.
- Updated existing policy `futureBranchIds` references where they previously pointed at the five removed draft placeholders.
- Did not use `standalone`.

## Future Draft / Backlog Handling

Removed future draft placeholders for:

- `draft.backstory.militia_levy`
- `draft.backstory.street_vendor`
- `draft.backstory.net_tender`
- `draft.backstory.gatherer`
- `draft.backstory.scribes_apprentice`

Kept later concepts deferred, including Drover's Hand, Kitchen Hand, Dockhand/Riverhand, Barge Hand, Forge Yard/Forge Hand, Forge Apprentice, Stablehand, Tanner's Yard, Loomhouse, Hidden Blood, Unacknowledged Blood, Red-Lantern Ward, and Courtesan's House.

Added a concise backlog run note that the first five records are live and that Drover's Hand and Kitchen Hand remain planned for a later content batch.

## Validation Checks Run

- `git status --short`: before edits, clean worktree.
- `git status --short`: after edits, expected modified files only.
- `npm.cmd run tool:content-lint`: passed, `content-lint: ok (53 files checked)`.
- `node --test tests\unit\backstory-policy-metadata.test.mjs tests\unit\*backstory*.mjs tests\unit\*legacy*.mjs tests\unit\*creator*.mjs`: passed, 62 tests.
- `node --test tests\unit\player-identity-content.test.mjs`: passed, 6 tests.
- `git diff --check`: passed. Git printed LF-to-CRLF working-copy warnings only.

## Behavior / Runtime Confirmation

No runtime behavior changed.
No existing backstory records were renamed, removed, or modified except for the explicitly listed addition of five new records.
No starting abilities were added.
No character creator code behavior changed.
No starter skill validation rules changed.
No Legacy, save/account, combat, magic, economy, progression, launcher UI, generated UI output, or availability filtering behavior changed.
Policy metadata remains non-runtime and is not imported by runtime/source paths.

The canonical content catalog now contains five additional live backstory records as requested; the current creator catalog imports live backstory content dynamically, but no creator filtering or runtime logic was changed.

## Risks / Follow-Up

- Because the current creator catalog imports canonical backstory content dynamically, these records can appear wherever the existing live catalog is displayed.
- Militia Levy remains combat-adjacent; keep it ability-free, weapon-neutral, and below Garrison Ward in any future policy work.
- Street Vendor must not gain discounts, contacts, passive income, business ownership, or extra coin without a separate economy/runtime owner.
- Net-Tender must not gain boat ownership, route authority, cargo behavior, contacts, or trade/shipping privilege without later travel/economy ownership.
- Gatherer must not gain healing, alchemy, item-generation behavior, or herbalist rank without a separate system pass.
- Scribe's Apprentice must stay mundane and separate from arcane lore, mana, spellcasting, and institution privilege.
- Drover's Hand and Kitchen Hand remain the next safest candidates for a later narrow content batch.

## Next Recommended Version

Version 0.5.50 - Backstory Eligibility Resolver Plan

## Suggested Commit Message

content(player): add first tier one backstories
