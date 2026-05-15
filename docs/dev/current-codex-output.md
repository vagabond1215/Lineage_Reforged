# Current Codex Output

Source version/run: Version 0.5.46 - Backstory Metadata Model Guardrail Revision
Date: 2026-05-15
Branch/status assumption: Current local branch reality. `git status --short` was run before edits and showed a clean worktree.

## Result

Revised the planning-only Backstory Legacy metadata model before implementing any metadata draft.

The design now blocks `standalone` as a normal tier value or branch-role category, separates missing precursors into explicit fields, and adds long-term upgrade-scale planning fields without creating runtime behavior.

## Files Changed

- `docs/design/backstory-tiered-lane-design.md`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Metadata Model Decisions

- Future tier values should use `tier_1`, `tier_2`, `tier_3`, `special`, and `deferred`.
- `standalone` should not be used as a tier value or branch-role category unless no defensible alternative exists.
- Tier classification is based on benefit level, prestige, unlock difficulty, and expected replay time.
- A higher-tier backstory can have no lower-tier precursor, but it still needs meaningful previous-play evidence plus Legacy purchase, prestige, Echo, or equivalent requirements.
- Legacy points alone are not enough to unlock higher-tier competence, noble/status recognition, elite identity, or institutional acceptance.

## Precursor / Alternate Unlock Fields

Added planning guidance for:

- `hasPrecursor`
- `parentBackstoryIds`
- `alternateUnlockPath`
- `alternateUnlockKinds`

Examples captured:

- Nobility/status origins can be `tier_2` or `tier_3` with `hasPrecursor: false` when earned through prestige, lineage recognition, estate status, adoption, marriage, patronage, or story outcome.
- `World-Stray`, `Local Champion`, illegitimate/heir-status concepts, and similar narrative exceptions can use `special` when normal tiering is not appropriate.
- Unknown or unsafe future concepts can use `deferred`.

## Upgrade-Scale Planning Fields

Added planning-only guidance for:

- `upgradeScaleIntent`
- `expectedUpgradeCountRange`
- `upgradeCostCurveIntent`
- `prestigeRequirementIntent`
- `echoRequirementIntent`
- `capProgressionIntent`

The design now states expected early planning ranges may be 30 to 100 upgrades, but the metadata model must not hardcode that ceiling. Some lanes may eventually support hundreds or 1000+ small upgrades if Echo, prestige, cost curves, and cap progression justify it.

## Prompt Pipeline Update

- Inserted this docs-only guardrail revision as Version 0.5.46.
- Shifted the non-runtime Tiered Backstory Lane Metadata Draft to Version 0.5.47.
- Shifted later recommended prompts through Version 0.5.50.

## Backlog Note

Added a 2026-05-15 run note to `docs/future_content_backlog.md` recording the revised tier vocabulary, explicit precursor modeling, alternate-unlock requirement, long-term upgrade-scale planning, and the fact that no runtime behavior changed.

## Checks Run

- `git status --short`: before edits, clean worktree.
- `npm.cmd run tool:content-lint`: passed, `content-lint: ok (53 files checked)`.
- `git diff --check`: passed.
- Final `git status --short`: `docs/design/backstory-tiered-lane-design.md`, `docs/dev/current-codex-output.md`, and `docs/future_content_backlog.md` modified.

## Behavior / Runtime Confirmation

No runtime behavior changed.
No content JSON changed.
No backstory records were added, removed, renamed, or modified.
No metadata JSON was changed.
No schemas changed.
No character creator, starter skill, Legacy, save/account, combat, magic, economy, progression, launcher UI, or availability behavior changed.

## Risks / Follow-Up

- The next metadata draft should enforce this vocabulary in the draft shape and avoid introducing `standalone` as a convenience category.
- Upgrade-scale fields are planning-only and should not be wired into purchase logic, caps, creator filtering, or runtime resolvers until a dedicated implementation pass exists.

## Next Recommended Version

Version 0.5.47 - Tiered Backstory Lane Metadata Draft

## Suggested Commit Message

docs(content): revise backstory metadata model guardrails
